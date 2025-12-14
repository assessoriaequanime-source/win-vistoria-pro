export type VistoriaStatus = 
  | 'aguardando_cliente'
  | 'em_andamento'
  | 'fotos_pendentes'
  | 'assinatura_pendente'
  | 'concluida'
  | 'aprovada'
  | 'rejeitada'
  | 'enviado_siprov'
  | 'erro_siprov';

export type VistoriaTipo = 
  | 'novo_associado'
  | 'migracao'
  | 'revistoria_inadimplencia'
  | 'renovacao';

export type AcionamentoTipo = 
  | 'colisao'
  | 'roubo_furto'
  | 'vidros'
  | 'incendio'
  | 'fenomenos_naturais'
  | 'outros';

export interface FotoVistoria {
  id: string;
  tipo: string;
  url: string;
  timestamp: string;
  localizacao?: {
    latitude: number;
    longitude: number;
  };
  ordem: number;
}

export interface Veiculo {
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  chassi: string;
  renavam: string;
}

export interface Cliente {
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  endereco?: string;
}

export interface Vistoria {
  id: string;
  codigo: string;
  tipo: VistoriaTipo;
  status: VistoriaStatus;
  veiculo: Veiculo;
  cliente: Cliente;
  consultora: string;
  observacoes?: string;
  fotos: FotoVistoria[];
  assinatura?: string;
  localizacao?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  dataCriacao: string;
  dataAtualizacao?: string;
  dataFinalizacao?: string;
  siprovId?: string;
  siprovStatus?: 'desativado' | 'pendente_envio' | 'enviado' | 'erro';
  lgpdAceito: boolean;
  lgpdDataAceite?: string;
}

export interface UserProfile {
  id: string;
  publicId: string;
  displayName: string;
  role: 'master' | 'eventos' | 'consultora';
}

export const FOTO_GUIAS = [
  { id: 1, nome: 'Frente do Veículo', instrucao: 'Tire foto de frente mostrando placa e chassi visível', icone: '🚗', exemplo: 'Posicione-se a 3 metros do veículo' },
  { id: 2, nome: 'Traseira do Veículo', instrucao: 'Foto de trás mostrando placa completa', icone: '🚙', exemplo: 'Certifique-se que a placa está legível' },
  { id: 3, nome: 'Lateral Esquerda', instrucao: 'Foto completa do lado esquerdo do veículo', icone: '⬅️', exemplo: 'Capture todo o lado do carro' },
  { id: 4, nome: 'Lateral Direita', instrucao: 'Foto completa do lado direito do veículo', icone: '➡️', exemplo: 'Capture todo o lado do carro' },
  { id: 5, nome: 'Painel/Hodômetro', instrucao: 'Foto do painel mostrando quilometragem', icone: '📊', exemplo: 'KM deve estar visível e legível' },
  { id: 6, nome: 'Motor', instrucao: 'Foto do motor com capô aberto', icone: '⚙️', exemplo: 'Motor completo visível' },
] as const;

export const STATUS_LABELS: Record<VistoriaStatus, { label: string; color: string }> = {
  aguardando_cliente: { label: 'Aguardando Cliente', color: 'warning' },
  em_andamento: { label: 'Em Andamento', color: 'info' },
  fotos_pendentes: { label: 'Fotos Pendentes', color: 'warning' },
  assinatura_pendente: { label: 'Assinatura Pendente', color: 'warning' },
  concluida: { label: 'Concluída', color: 'success' },
  aprovada: { label: 'Aprovada', color: 'success' },
  rejeitada: { label: 'Rejeitada', color: 'destructive' },
  enviado_siprov: { label: 'Enviado Siprov', color: 'success' },
  erro_siprov: { label: 'Erro Siprov', color: 'destructive' },
};

export const TIPO_LABELS: Record<VistoriaTipo, string> = {
  novo_associado: 'Novo Associado',
  migracao: 'Migração',
  revistoria_inadimplencia: 'Revistoria - Inadimplência',
  renovacao: 'Renovação',
};
