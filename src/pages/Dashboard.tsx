import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  ClipboardList, 
  AlertTriangle, 
  LogOut, 
  FileSearch, 
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useVistoria } from '@/contexts/VistoriaContext';
import { STATUS_LABELS, TIPO_LABELS } from '@/types/vistoria';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { vistorias } = useVistoria();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Statistics
  const stats = {
    total: vistorias.length,
    aguardando: vistorias.filter(v => v.status === 'aguardando_cliente').length,
    emAndamento: vistorias.filter(v => ['em_andamento', 'fotos_pendentes', 'assinatura_pendente'].includes(v.status)).length,
    concluidas: vistorias.filter(v => ['concluida', 'aprovada', 'enviado_siprov'].includes(v.status)).length,
  };

  // Recent vistorias (last 5)
  const recentVistorias = [...vistorias]
    .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
    .slice(0, 5);

  const canCreateVistoria = user.role === 'master' || user.role === 'consultora';
  const canViewAcionamentos = user.role === 'master' || user.role === 'eventos';

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      {/* Header */}
      <header className="glass-card border-b border-neutral-200 rounded-none py-4 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">
              Olá, {user.displayName.split(' ')[0]}!
            </h1>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role === 'master' ? 'Administrador' : user.role}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleLogout}>
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 md:space-y-8">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          <div className="glass-card p-4 md:p-5 border border-neutral-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center border border-warning/20 shrink-0">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-foreground">{stats.aguardando}</p>
                <p className="text-xs text-muted-foreground">Aguardando</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5 border border-neutral-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center border border-info/20 shrink-0">
                <FileSearch className="w-5 h-5 text-info" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-foreground">{stats.emAndamento}</p>
                <p className="text-xs text-muted-foreground">Em Andamento</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5 border border-neutral-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center border border-success/20 shrink-0">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-foreground">{stats.concluidas}</p>
                <p className="text-xs text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5 border border-primary/30 bg-primary/[0.02]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="font-display font-bold text-lg text-foreground">Ações Rápidas</h2>
          
          <div className="grid gap-3 md:gap-4">
            {canCreateVistoria && (
              <Link to="/nova-vistoria">
                <div className="glass-card p-5 md:p-6 card-hover cursor-pointer border border-primary/30 bg-primary/[0.02] group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all glow shrink-0">
                      <PlusCircle className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground">Nova Vistoria</h3>
                      <p className="text-sm text-muted-foreground">Cadastrar novo associado</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </div>
              </Link>
            )}

            {canViewAcionamentos && (
              <div className="glass-card p-5 md:p-6 card-hover cursor-pointer border border-neutral-200 opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-destructive/10 flex items-center justify-center border border-destructive/20 shrink-0">
                    <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-foreground">Acionamentos</h3>
                    <p className="text-sm text-muted-foreground">Em breve</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Vistorias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-foreground">Vistorias Recentes</h2>
          </div>

          {recentVistorias.length === 0 ? (
            <div className="glass-card p-8 md:p-12 text-center border border-neutral-200">
              <ClipboardList className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium mb-4">Nenhuma vistoria cadastrada</p>
              {canCreateVistoria && (
                <Link to="/nova-vistoria">
                  <Button className="mt-4">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Criar primeira vistoria
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {recentVistorias.map((vistoria) => {
                const statusInfo = STATUS_LABELS[vistoria.status];
                return (
                  <div key={vistoria.id} className="glass-card p-4 md:p-5 card-hover border border-neutral-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-primary">
                            {vistoria.codigo}
                          </span>
                          <span className={`status-badge status-${statusInfo.color === 'destructive' ? 'error' : statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {vistoria.cliente.nome || 'Cliente não informado'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {vistoria.veiculo.placa} • {TIPO_LABELS[vistoria.tipo]}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(vistoria.dataCriacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-neutral-200 rounded-none py-2 px-4 bg-white/95">
        <div className="container mx-auto flex items-center justify-around">
          <Link to="/dashboard" className="nav-item active">
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs">Início</span>
          </Link>
          {canCreateVistoria && (
            <Link to="/nova-vistoria" className="nav-item">
              <PlusCircle className="w-6 h-6" />
              <span className="text-xs">Nova</span>
            </Link>
          )}
          <Link to="/buscar" className="nav-item">
            <FileSearch className="w-6 h-6" />
            <span className="text-xs">Buscar</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
