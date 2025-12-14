import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, User, Clipboard, Check, Loader2, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useVistoria } from '@/contexts/VistoriaContext';
import { VistoriaTipo, TIPO_LABELS } from '@/types/vistoria';
import { toast } from 'sonner';

const WHATSAPP_NUMBER = '554820133205';

const NovaVistoria = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createVistoria, isLoading } = useVistoria();
  
  const [step, setStep] = useState(1);
  const [createdCodigo, setCreatedCodigo] = useState<string | null>(null);
  
  const [tipo, setTipo] = useState<VistoriaTipo>('novo_associado');
  const [veiculo, setVeiculo] = useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    chassi: '',
    renavam: '',
  });
  const [cliente, setCliente] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
  });
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'master' && user.role !== 'consultora')) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleVeiculoChange = (field: string, value: string) => {
    if (field === 'placa') {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    }
    setVeiculo(prev => ({ ...prev, [field]: value }));
  };

  const handleClienteChange = (field: string, value: string) => {
    if (field === 'cpf') {
      value = value.replace(/\D/g, '').slice(0, 11);
      if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      }
    }
    if (field === 'telefone') {
      value = value.replace(/\D/g, '').slice(0, 11);
      if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
      }
    }
    setCliente(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!veiculo.placa || veiculo.placa.length < 7) {
        toast.error('Placa inválida');
        return false;
      }
      if (!veiculo.marca || !veiculo.modelo) {
        toast.error('Preencha marca e modelo');
        return false;
      }
    }
    if (step === 2) {
      if (!cliente.nome) {
        toast.error('Nome é obrigatório');
        return false;
      }
      if (!cliente.cpf || cliente.cpf.replace(/\D/g, '').length !== 11) {
        toast.error('CPF inválido');
        return false;
      }
      if (!cliente.telefone || cliente.telefone.replace(/\D/g, '').length < 10) {
        toast.error('Telefone inválido');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const vistoria = await createVistoria({
        tipo,
        veiculo,
        cliente,
        consultora: user?.displayName || '',
        observacoes,
      });
      
      setCreatedCodigo(vistoria.codigo);
      setStep(4);
      toast.success('Vistoria criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar vistoria');
    }
  };

  const copyCode = () => {
    if (createdCodigo) {
      navigator.clipboard.writeText(createdCodigo);
      toast.success('Código copiado!');
    }
  };

  const shareWhatsApp = () => {
    if (!createdCodigo) return;
    const message = encodeURIComponent(
      `🚗 *Grupo Win - Vistoria Online*\n\n` +
      `Olá ${cliente.nome}!\n\n` +
      `Seu código de vistoria é:\n*${createdCodigo}*\n\n` +
      `Acesse: https://sos.grupowin.site/buscar\n\n` +
      `Digite o código acima para realizar sua vistoria online.`
    );
    window.open(`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const tipoOptions: { value: VistoriaTipo; label: string }[] = [
    { value: 'novo_associado', label: 'Novo Associado' },
    { value: 'migracao', label: 'Migração' },
    { value: 'revistoria_inadimplencia', label: 'Revistoria - Inadimplência' },
    { value: 'renovacao', label: 'Renovação' },
  ];

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass-card border-t-0 rounded-t-none py-4 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-montserrat font-bold text-lg text-foreground">Nova Vistoria</h1>
            <p className="text-xs text-muted-foreground">
              {step < 4 ? `Etapa ${step} de 3` : 'Concluído'}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-8 max-w-xs mx-auto">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`step-indicator ${step > s ? 'completed' : step === s ? 'active' : 'pending'}`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${step > s ? 'bg-success' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Step 1: Vehicle Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-montserrat font-bold text-lg text-foreground">Dados do Veículo</h2>
                  <p className="text-sm text-muted-foreground">Informações do veículo</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="field-label">Tipo de Vistoria *</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as VistoriaTipo)}
                    className="field-input"
                  >
                    {tipoOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="field-label">Placa *</label>
                  <input
                    type="text"
                    value={veiculo.placa}
                    onChange={(e) => handleVeiculoChange('placa', e.target.value)}
                    placeholder="ABC1D23"
                    className="field-input font-mono uppercase"
                    maxLength={7}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Marca *</label>
                    <input
                      type="text"
                      value={veiculo.marca}
                      onChange={(e) => handleVeiculoChange('marca', e.target.value)}
                      placeholder="Fiat"
                      className="field-input"
                    />
                  </div>
                  <div>
                    <label className="field-label">Modelo *</label>
                    <input
                      type="text"
                      value={veiculo.modelo}
                      onChange={(e) => handleVeiculoChange('modelo', e.target.value)}
                      placeholder="Uno"
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Ano</label>
                    <input
                      type="text"
                      value={veiculo.ano}
                      onChange={(e) => handleVeiculoChange('ano', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="2023"
                      className="field-input"
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <label className="field-label">Cor</label>
                    <input
                      type="text"
                      value={veiculo.cor}
                      onChange={(e) => handleVeiculoChange('cor', e.target.value)}
                      placeholder="Prata"
                      className="field-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Chassi</label>
                  <input
                    type="text"
                    value={veiculo.chassi}
                    onChange={(e) => handleVeiculoChange('chassi', e.target.value.toUpperCase())}
                    placeholder="9BWZZZ377VT004251"
                    className="field-input font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <Button onClick={nextStep} className="w-full touch-button bg-primary text-primary-foreground">
              Continuar
            </Button>
          </motion.div>
        )}

        {/* Step 2: Client Info */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-info" />
                </div>
                <div>
                  <h2 className="font-montserrat font-bold text-lg text-foreground">Dados do Cliente</h2>
                  <p className="text-sm text-muted-foreground">Informações do proprietário</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="field-label">Nome Completo *</label>
                  <input
                    type="text"
                    value={cliente.nome}
                    onChange={(e) => handleClienteChange('nome', e.target.value)}
                    placeholder="João da Silva"
                    className="field-input"
                  />
                </div>

                <div>
                  <label className="field-label">CPF *</label>
                  <input
                    type="text"
                    value={cliente.cpf}
                    onChange={(e) => handleClienteChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    className="field-input"
                  />
                </div>

                <div>
                  <label className="field-label">Telefone (WhatsApp) *</label>
                  <input
                    type="text"
                    value={cliente.telefone}
                    onChange={(e) => handleClienteChange('telefone', e.target.value)}
                    placeholder="(48) 99999-9999"
                    className="field-input"
                  />
                </div>

                <div>
                  <label className="field-label">E-mail</label>
                  <input
                    type="email"
                    value={cliente.email}
                    onChange={(e) => handleClienteChange('email', e.target.value)}
                    placeholder="joao@email.com"
                    className="field-input"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 touch-button">
                Voltar
              </Button>
              <Button onClick={nextStep} className="flex-1 touch-button bg-primary text-primary-foreground">
                Continuar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Clipboard className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h2 className="font-montserrat font-bold text-lg text-foreground">Revisão</h2>
                  <p className="text-sm text-muted-foreground">Confirme os dados</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                  <p className="font-medium text-foreground">{TIPO_LABELS[tipo]}</p>
                </div>

                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Veículo</p>
                  <p className="font-medium text-foreground">
                    {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                  </p>
                  {veiculo.ano && <p className="text-sm text-muted-foreground">Ano: {veiculo.ano}</p>}
                </div>

                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                  <p className="font-medium text-foreground">{cliente.nome}</p>
                  <p className="text-sm text-muted-foreground">{cliente.cpf}</p>
                  <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                </div>

                <div>
                  <label className="field-label">Observações</label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações adicionais..."
                    className="field-input min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 touch-button">
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="flex-1 touch-button bg-success text-success-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Criar Vistoria
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && createdCodigo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-success" />
            </div>

            <div>
              <h2 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                Vistoria Criada!
              </h2>
              <p className="text-muted-foreground">
                Envie o código abaixo para o cliente
              </p>
            </div>

            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Código da Vistoria</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-bold text-primary">
                  {createdCodigo}
                </span>
                <Button variant="ghost" size="icon" onClick={copyCode}>
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={shareWhatsApp}
                className="w-full touch-button bg-[#25D366] hover:bg-[#22c55e] text-white"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar via WhatsApp
              </Button>

              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="w-full touch-button"
              >
                Voltar ao Início
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default NovaVistoria;
