import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, Home, MessageCircle, FileText, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVistoria } from '@/contexts/VistoriaContext';
import { Vistoria } from '@/types/vistoria';
import { toast } from 'sonner';

const WHATSAPP_NUMBER = '554820133205';

const VistoriaConcluida = () => {
  const navigate = useNavigate();
  const { codigo } = useParams<{ codigo: string }>();
  const { getVistoriaByCodigo } = useVistoria();
  const [vistoria, setVistoria] = useState<Vistoria | null>(null);

  useEffect(() => {
    const loadVistoria = async () => {
      if (codigo) {
        const found = await getVistoriaByCodigo(codigo);
        if (found) {
          setVistoria(found);
        } else {
          navigate('/buscar');
        }
      }
    };
    loadVistoria();
  }, [codigo, getVistoriaByCodigo, navigate]);

  const copyProtocol = () => {
    if (vistoria) {
      navigator.clipboard.writeText(vistoria.codigo);
      toast.success('Protocolo copiado!');
    }
  };

  const shareWhatsApp = () => {
    const message = encodeURIComponent(
      `✅ Vistoria concluída!\n\n` +
      `Protocolo: ${vistoria?.codigo}\n` +
      `Veículo: ${vistoria?.veiculo.marca} ${vistoria?.veiculo.modelo}\n` +
      `Placa: ${vistoria?.veiculo.placa}\n\n` +
      `Data: ${new Date(vistoria?.dataFinalizacao || '').toLocaleString('pt-BR')}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (!vistoria) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-full max-w-sm text-center space-y-6"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-14 h-14 text-success" />
          </motion.div>

          {/* Title */}
          <div>
            <h1 className="font-montserrat font-bold text-3xl text-foreground mb-2">
              Vistoria Concluída!
            </h1>
            <p className="text-muted-foreground">
              Sua vistoria foi registrada com sucesso
            </p>
          </div>

          {/* Protocol Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Protocolo</span>
              <Button variant="ghost" size="sm" onClick={copyProtocol}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="font-mono text-2xl font-bold text-primary mb-4">
              {vistoria.codigo}
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Veículo</span>
                <span className="font-medium text-foreground">
                  {vistoria.veiculo.marca} {vistoria.veiculo.modelo}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Placa</span>
                <span className="font-mono font-medium text-foreground">
                  {vistoria.veiculo.placa}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Data</span>
                <span className="text-foreground">
                  {new Date(vistoria.dataFinalizacao || vistoria.dataCriacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Fotos</span>
                <span className="text-foreground">
                  {vistoria.fotos?.length || 0} capturadas
                </span>
              </div>
            </div>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30"
          >
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm text-success font-medium">
              Aguardando análise
            </span>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Button 
              onClick={shareWhatsApp}
              className="w-full touch-button bg-[#25D366] hover:bg-[#22c55e] text-white"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar Comprovante
            </Button>

            <Link to="/" className="block">
              <Button 
                variant="outline"
                className="w-full touch-button"
              >
                <Home className="w-5 h-5 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </motion.div>

          {/* Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            Você receberá uma notificação quando sua vistoria for aprovada.
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Grupo Win Associação de Benefícios
        </p>
      </footer>
    </div>
  );
};

export default VistoriaConcluida;
