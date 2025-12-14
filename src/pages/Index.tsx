import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileSearch, PlusCircle, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '554820133205';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card border-t-0 rounded-t-none py-4 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-montserrat font-bold text-lg text-foreground">SOS Grupo Win</h1>
              <p className="text-xs text-muted-foreground">Portal Operacional</p>
            </div>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-montserrat font-black text-foreground mb-4">
            VISTORIA <span className="gradient-text">ONLINE</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Sistema de vistorias veiculares do Grupo Win. Rápido, seguro e 100% digital.
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid gap-4 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/buscar" className="block">
              <div className="glass-card p-6 card-hover cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileSearch className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-montserrat font-bold text-lg text-foreground">
                      Realizar Vistoria
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Digite o código recebido da consultora
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/login" className="block">
              <div className="glass-card p-6 card-hover cursor-pointer border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 glow">
                    <PlusCircle className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-montserrat font-bold text-lg text-foreground">
                      Área do Colaborador
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Cadastrar nova vistoria ou acompanhar
                    </p>
                  </div>
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
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30">
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
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow z-50"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </motion.a>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border">
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
