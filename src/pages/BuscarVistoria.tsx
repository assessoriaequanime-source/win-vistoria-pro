import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Loader2, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVistoria } from '@/contexts/VistoriaContext';
import { toast } from 'sonner';

const BuscarVistoria = () => {
  const navigate = useNavigate();
  const { getVistoriaByCodigo, setCurrentVistoria, isLoading } = useVistoria();
  const [codigo, setCodigo] = useState('');

  const handleSearch = async () => {
    if (!codigo.trim()) {
      toast.error('Digite o código da vistoria');
      return;
    }

    const vistoria = await getVistoriaByCodigo(codigo.trim());
    
    if (!vistoria) {
      toast.error('Vistoria não encontrada');
      return;
    }

    if (vistoria.status === 'concluida' || vistoria.status === 'aprovada' || vistoria.status === 'enviado_siprov') {
      toast.info('Esta vistoria já foi concluída');
      navigate(`/concluida/${vistoria.codigo}`);
      return;
    }

    setCurrentVistoria(vistoria);
    navigate(`/vistoria/${vistoria.codigo}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigo(e.target.value.toUpperCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      {/* Header */}
      <header className="glass-card border-b border-neutral-200 rounded-none py-4 px-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">Buscar Vistoria</h1>
            <p className="text-xs text-muted-foreground">Digite o código recebido</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6 md:space-y-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <FileSearch className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
              Código da Vistoria
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Digite o código que você recebeu da consultora
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 border border-neutral-200 space-y-5">
            <div>
              <input
                type="text"
                value={codigo}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="VIS-XXXXXX-XXXX"
                className="field-input text-center font-mono text-lg md:text-xl uppercase tracking-widest"
                autoFocus
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={isLoading || !codigo.trim()}
              className="w-full touch-button bg-primary text-primary-foreground font-semibold h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Buscar Vistoria
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm md:text-base text-muted-foreground">
              Não tem o código?{' '}
              <a
                href={`https://wa.me/554820133205?text=${encodeURIComponent('Olá! Preciso de ajuda para realizar minha vistoria online.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Fale conosco
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BuscarVistoria;
