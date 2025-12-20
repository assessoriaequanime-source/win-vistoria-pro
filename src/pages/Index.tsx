import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileSearch, PlusCircle, MessageCircle, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '554820133205';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      {/* Header */}
      <header className="glass-card border-b border-neutral-200 rounded-none py-3 md:py-4 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base md:text-lg text-foreground">SOS Grupo Win</h1>
              <p className="text-xs text-muted-foreground">Portal Operacional</p>
            </div>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm" className="h-9">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            VISTORIA <span className="gradient-text">ONLINE</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sistema de vistorias veiculares do Grupo Win. Rápido, seguro e 100% digital.
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid gap-4 md:gap-6 max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/buscar" className="block group">
              <div className="glass-card p-6 md:p-8 card-hover cursor-pointer border border-neutral-200">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                    <FileSearch className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-display font-bold text-lg md:text-xl text-foreground">
                      Realizar Vistoria
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                      Digite o código recebido da consultora
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/login" className="block group">
              <div className="glass-card p-6 md:p-8 card-hover cursor-pointer border border-primary/30 bg-primary/[0.02]">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:border-primary/40 transition-all glow">
                    <PlusCircle className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-display font-bold text-lg md:text-xl text-foreground">
                      Área do Colaborador
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                      Cadastrar nova vistoria ou acompanhar
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary transition-colors" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-success/5 border border-success/30">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-success font-medium">Sistema Online</span>
          </div>
        </motion.div>
      </main>

      {/* WhatsApp FAB */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </motion.a>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-neutral-200 bg-white/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Grupo Win Associação de Benefícios
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
};

export default Index;
