import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    const success = await login(username, password);
    setIsSubmitting(false);

    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8 md:mb-12">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 glow">
            <Shield className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            SOS Grupo Win
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Portal Operacional</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-6 md:p-8 border border-neutral-200 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="field-label">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="field-input"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="field-label">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="field-input pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full touch-button bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-button h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
            <p className="text-xs font-semibold text-foreground mb-3">Usuários de teste:</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span><span className="text-foreground font-medium">master</span> / <code className="text-primary">master123</code></span>
              </div>
              <div className="flex items-center justify-between">
                <span><span className="text-foreground font-medium">consultora</span> / <code className="text-primary">cons123</code></span>
              </div>
              <div className="flex items-center justify-between">
                <span><span className="text-foreground font-medium">eventos</span> / <code className="text-primary">eventos123</code></span>
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6 md:mt-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
