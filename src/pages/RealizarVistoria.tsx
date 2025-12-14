import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Camera, 
  Check, 
  Loader2, 
  MapPin, 
  PenTool,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  X
} from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useVistoria } from '@/contexts/VistoriaContext';
import { FOTO_GUIAS, FotoVistoria } from '@/types/vistoria';
import { toast } from 'sonner';

const LGPD_TERMO = `
TERMO DE CONSENTIMENTO PARA TRATAMENTO DE DADOS PESSOAIS

Pelo presente termo, eu, titular dos dados pessoais, autorizo o GRUPO WIN ASSOCIAÇÃO DE BENEFÍCIOS, inscrito no CNPJ sob nº XX.XXX.XXX/0001-XX, com sede em Florianópolis/SC, a realizar o tratamento dos meus dados pessoais, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), para os seguintes fins:

1. Cadastro e identificação como associado;
2. Realização de vistorias veiculares;
3. Prestação de serviços de assistência e proteção veicular;
4. Comunicações relacionadas aos serviços contratados;
5. Cumprimento de obrigações legais e regulatórias.

Os dados coletados incluem: nome completo, CPF, telefone, e-mail, dados do veículo (placa, chassi, marca, modelo), fotografias do veículo, localização geográfica no momento da vistoria e assinatura digital.

Declaro que fui informado sobre meus direitos como titular de dados, incluindo o direito de acesso, correção, exclusão e portabilidade dos dados, conforme previsto na LGPD.

Este consentimento pode ser revogado a qualquer momento mediante solicitação formal ao Grupo Win.
`;

const RealizarVistoria = () => {
  const navigate = useNavigate();
  const { codigo } = useParams<{ codigo: string }>();
  const { currentVistoria, setCurrentVistoria, getVistoriaByCodigo, addFoto, setAssinatura, finalizarVistoria, isLoading } = useVistoria();
  
  const [step, setStep] = useState<'intro' | 'lgpd' | 'fotos' | 'assinatura' | 'finalizando'>('intro');
  const [currentFotoIndex, setCurrentFotoIndex] = useState(0);
  const [localizacao, setLocalizacao] = useState<{ latitude: number; longitude: number } | null>(null);
  const [lgpdAceito, setLgpdAceito] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showLgpdModal, setShowLgpdModal] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const loadVistoria = async () => {
      if (!currentVistoria && codigo) {
        const vistoria = await getVistoriaByCodigo(codigo);
        if (vistoria) {
          setCurrentVistoria(vistoria);
        } else {
          toast.error('Vistoria não encontrada');
          navigate('/buscar');
        }
      }
    };
    loadVistoria();
  }, [codigo, currentVistoria, getVistoriaByCodigo, setCurrentVistoria, navigate]);

  useEffect(() => {
    // Get location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocalizacao({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.error('Erro ao obter localização:', err);
          toast.error('Ative a localização para continuar');
        },
        { enableHighAccuracy: true }
      );
    }

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCamera(true);
    } catch (err) {
      toast.error('Erro ao acessar câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      const foto: FotoVistoria = {
        id: crypto.randomUUID(),
        tipo: FOTO_GUIAS[currentFotoIndex].nome,
        url: imageData,
        timestamp: new Date().toISOString(),
        localizacao: localizacao || undefined,
        ordem: currentFotoIndex + 1,
      };
      
      addFoto(foto);
      stopCamera();
      
      if (currentFotoIndex < FOTO_GUIAS.length - 1) {
        toast.success(`Foto ${currentFotoIndex + 1} de ${FOTO_GUIAS.length} capturada!`);
        setCurrentFotoIndex(prev => prev + 1);
      } else {
        toast.success('Todas as fotos capturadas!');
        setStep('assinatura');
      }
    }
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const saveSignature = () => {
    if (!signatureRef.current?.isEmpty()) {
      const signatureData = signatureRef.current?.toDataURL('image/png');
      if (signatureData) {
        setAssinatura(signatureData);
        toast.success('Assinatura salva!');
      }
    } else {
      toast.error('Por favor, assine o termo');
    }
  };

  const handleFinish = async () => {
    if (!currentVistoria?.assinatura) {
      toast.error('Assine o termo antes de finalizar');
      return;
    }

    setStep('finalizando');
    await finalizarVistoria();
    toast.success('Vistoria concluída com sucesso!');
    navigate(`/concluida/${codigo}`);
  };

  if (!currentVistoria) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const fotosCapturadas = currentVistoria.fotos?.length || 0;
  const fotoAtual = FOTO_GUIAS[currentFotoIndex];
  const fotoExistente = currentVistoria.fotos?.find(f => f.ordem === currentFotoIndex + 1);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card border-t-0 rounded-t-none py-4 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/buscar')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-montserrat font-bold text-lg text-foreground">
                Vistoria
              </h1>
              <p className="text-xs font-mono text-primary">{currentVistoria.codigo}</p>
            </div>
          </div>
          {localizacao && (
            <div className="flex items-center gap-1 text-success text-xs">
              <MapPin className="w-4 h-4" />
              <span>GPS</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Intro Step */}
        {step === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                Bem-vindo!
              </h2>
              <p className="text-muted-foreground">
                Vamos realizar a vistoria do seu veículo
              </p>
            </div>

            <div className="glass-card p-6 space-y-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Veículo</p>
                <p className="font-semibold text-foreground">
                  {currentVistoria.veiculo.marca} {currentVistoria.veiculo.modelo}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  {currentVistoria.veiculo.placa}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                <p className="font-semibold text-foreground">{currentVistoria.cliente.nome}</p>
              </div>

              <div className="p-4 rounded-xl bg-info/10 border border-info/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-info shrink-0 mt-0.5" />
                  <div className="text-sm text-info">
                    <p className="font-medium mb-1">O que você vai precisar:</p>
                    <ul className="list-disc list-inside text-info/80 space-y-1">
                      <li>Câmera do celular funcionando</li>
                      <li>GPS/Localização ativado</li>
                      <li>Veículo em local iluminado</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setStep('lgpd')}
              className="w-full touch-button bg-primary text-primary-foreground"
            >
              Iniciar Vistoria
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* LGPD Step */}
        {step === 'lgpd' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                Termo de Consentimento
              </h2>
              <p className="text-muted-foreground">
                Lei Geral de Proteção de Dados
              </p>
            </div>

            <div className="glass-card p-6 space-y-4">
              <div className="max-h-[300px] overflow-y-auto p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground whitespace-pre-line">
                {LGPD_TERMO}
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <Checkbox 
                  id="lgpd" 
                  checked={lgpdAceito}
                  onCheckedChange={(checked) => setLgpdAceito(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="lgpd" className="text-sm text-foreground cursor-pointer">
                  Li e concordo com o Termo de Consentimento para Tratamento de Dados Pessoais conforme a Lei Geral de Proteção de Dados (LGPD).
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('intro')}
                className="flex-1 touch-button"
              >
                Voltar
              </Button>
              <Button 
                onClick={() => setStep('fotos')}
                disabled={!lgpdAceito}
                className="flex-1 touch-button bg-primary text-primary-foreground"
              >
                Continuar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Fotos Step */}
        {step === 'fotos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Foto {currentFotoIndex + 1} de {FOTO_GUIAS.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {fotosCapturadas}/{FOTO_GUIAS.length} capturadas
              </span>
            </div>

            <div className="flex gap-1">
              {FOTO_GUIAS.map((_, idx) => {
                const captured = currentVistoria.fotos?.some(f => f.ordem === idx + 1);
                return (
                  <div 
                    key={idx}
                    className={`flex-1 h-2 rounded-full transition-colors ${
                      captured ? 'bg-success' : idx === currentFotoIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                );
              })}
            </div>

            {!showCamera ? (
              <div className="glass-card p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{fotoAtual.icone}</div>
                  <h3 className="font-montserrat font-bold text-xl text-foreground mb-2">
                    {fotoAtual.nome}
                  </h3>
                  <p className="text-muted-foreground">{fotoAtual.instrucao}</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">{fotoAtual.exemplo}</p>
                </div>

                {fotoExistente ? (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden">
                      <img 
                        src={fotoExistente.url} 
                        alt={fotoAtual.nome}
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-success text-success-foreground text-xs font-medium">
                        ✓ Capturada
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline"
                        onClick={startCamera}
                        className="flex-1 touch-button"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Tirar Novamente
                      </Button>
                      {currentFotoIndex < FOTO_GUIAS.length - 1 && (
                        <Button 
                          onClick={() => setCurrentFotoIndex(prev => prev + 1)}
                          className="flex-1 touch-button bg-primary text-primary-foreground"
                        >
                          Próxima
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={startCamera}
                    className="w-full touch-button bg-primary text-primary-foreground"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Tirar Foto
                  </Button>
                )}

                {fotosCapturadas >= FOTO_GUIAS.length && (
                  <Button 
                    onClick={() => setStep('assinatura')}
                    className="w-full touch-button bg-success text-success-foreground mt-4"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Avançar para Assinatura
                  </Button>
                )}
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  className="w-full aspect-[4/3] object-cover bg-black"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={stopCamera}
                      className="w-12 h-12 rounded-full bg-white/20 text-white"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                    <button 
                      onClick={capturePhoto}
                      className="w-16 h-16 rounded-full bg-white border-4 border-primary shadow-lg active:scale-95 transition-transform"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Photo navigation */}
            {!showCamera && (
              <div className="grid grid-cols-6 gap-2">
                {FOTO_GUIAS.map((guia, idx) => {
                  const captured = currentVistoria.fotos?.some(f => f.ordem === idx + 1);
                  const isActive = idx === currentFotoIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentFotoIndex(idx)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-lg transition-all ${
                        captured 
                          ? 'bg-success/20 text-success' 
                          : isActive 
                            ? 'bg-primary/20 text-primary ring-2 ring-primary' 
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {captured ? <Check className="w-4 h-4" /> : guia.icone}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Signature Step */}
        {step === 'assinatura' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                Assinatura Digital
              </h2>
              <p className="text-muted-foreground">
                Assine no campo abaixo para confirmar os dados
              </p>
            </div>

            <div className="glass-card p-4">
              <div className="signature-canvas rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/30">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'w-full h-[200px]',
                    style: { width: '100%', height: '200px' }
                  }}
                  backgroundColor="white"
                />
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button 
                  variant="outline"
                  onClick={clearSignature}
                  className="flex-1"
                >
                  Limpar
                </Button>
                <Button 
                  onClick={saveSignature}
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  Salvar Assinatura
                </Button>
              </div>
            </div>

            {currentVistoria.assinatura && (
              <div className="p-4 rounded-xl bg-success/10 border border-success/30 flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-success font-medium">Assinatura salva</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setStep('fotos')}
                className="flex-1 touch-button"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleFinish}
                disabled={!currentVistoria.assinatura || isLoading}
                className="flex-1 touch-button bg-success text-success-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Finalizar Vistoria
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Finalizing Step */}
        {step === 'finalizando' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Finalizando vistoria...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RealizarVistoria;
