export interface Provider {
  id: string;
  fantasyName: string;
  responsibleName: string;
  email: string;
  phone: string;
  createdAt: Date;
  demandsCount: number;
}

export interface Demand {
  id: string;
  title: string;
  description: string;
  type: DemandType;
  status: DemandStatus;
  priority: DemandPriority;
  providerId: string;
  providerName: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  actions: DemandAction[];
}

export interface DemandAction {
  id: string;
  demandId: string;
  description: string;
  technician: string;
  executedAt: Date;
  actionType: 'analysis' | 'configuration' | 'maintenance' | 'communication' | 'resolution';
}

export type DemandType = 
  | 'diagnostico' 
  | 'manutencao' 
  | 'configuracao' 
  | 'instalacao' 
  | 'outro';

export type DemandStatus = 
  | 'pendente' 
  | 'em_andamento' 
  | 'concluida' 
  | 'cancelada';

export type DemandPriority = 
  | 'baixa' 
  | 'media' 
  | 'alta' 
  | 'critica';

export type UserRole = 
  | 'administrador' 
  | 'atendente' 
  | 'consultor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export const DEMAND_TYPE_LABELS = {
  diagnostico: 'Diagnóstico',
  manutencao: 'Manutenção',
  configuracao: 'Configuração',
  instalacao: 'Instalação',
  outro: 'Outro'
} as const;

export const DEMAND_STATUS_LABELS = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada'
} as const;

export const DEMAND_PRIORITY_LABELS = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica'
} as const;