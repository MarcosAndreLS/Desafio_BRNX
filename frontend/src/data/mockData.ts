import { Provider, Demand, DemandAction, User } from "@/types";

export const mockProviders: Provider[] = [
  {
    id: "1",
    fantasyName: "BRNX Fibra",
    responsibleName: "João Silva",
    email: "joao@brnxfibra.com",
    phone: "(11) 98765-4321",
    createdAt: new Date('2024-01-15'),
    demandsCount: 5
  },
  {
    id: "2",
    fantasyName: "TechNet Solutions",
    responsibleName: "Maria Santos",
    email: "maria@technet.com",
    phone: "(11) 97654-3210",
    createdAt: new Date('2024-02-20'),
    demandsCount: 3
  },
  {
    id: "3",
    fantasyName: "ConnectMax",
    responsibleName: "Pedro Costa",
    email: "pedro@connectmax.com",
    phone: "(11) 96543-2109",
    createdAt: new Date('2024-03-10'),
    demandsCount: 7
  },
  {
    id: "4",
    fantasyName: "UltraLink ISP",
    responsibleName: "Ana Oliveira",
    email: "ana@ultralink.com",
    phone: "(11) 95432-1098",
    createdAt: new Date('2024-01-28'),
    demandsCount: 2
  }
];

export const mockDemandActions: DemandAction[] = [
  {
    id: "1",
    demandId: "1",
    description: "Análise inicial do tráfego na interface eth1. Identificado pico de utilização de 95% durante horário comercial.",
    technician: "Carlos Técnico",
    executedAt: new Date('2024-08-20T09:30:00'),
    actionType: 'analysis'
  },
  {
    id: "2",
    demandId: "1",
    description: "Implementado controle de banda QoS com priorização de tráfego crítico. Limitado tráfego P2P para 30% da banda disponível.",
    technician: "Carlos Técnico",
    executedAt: new Date('2024-08-20T14:15:00'),
    actionType: 'configuration'
  },
  {
    id: "3",
    demandId: "2",
    description: "Verificação dos equipamentos de rede. Identificada falha no switch principal - LED de status vermelho.",
    technician: "Roberto Silva",
    executedAt: new Date('2024-08-19T10:00:00'),
    actionType: 'analysis'
  },
  {
    id: "4",
    demandId: "2",
    description: "Substituição do switch defeituoso. Configuração das VLANs e teste de conectividade realizados com sucesso.",
    technician: "Roberto Silva",
    executedAt: new Date('2024-08-19T16:30:00'),
    actionType: 'maintenance'
  }
];

export const mockDemands: Demand[] = [
  {
    id: "1",
    title: "Análise de lentidão na rede de borda",
    description: "Cliente relatando lentidão significativa na conexão durante horário comercial. Necessário análise detalhada do tráfego e possível implementação de QoS.",
    type: "diagnostico",
    status: "concluida",
    priority: "alta",
    providerId: "1",
    providerName: "BRNX Fibra",
    createdAt: new Date('2024-08-20T08:00:00'),
    updatedAt: new Date('2024-08-20T16:00:00'),
    assignedTo: "Carlos Técnico",
    actions: mockDemandActions.filter(action => action.demandId === "1")
  },
  {
    id: "2",
    title: "Instabilidade de conexão - Equipamentos",
    description: "Quedas intermitentes de conexão reportadas pelo provedor. Suspeita de problema nos equipamentos de rede.",
    type: "manutencao",
    status: "concluida",
    priority: "critica",
    providerId: "1",
    providerName: "BRNX Fibra",
    createdAt: new Date('2024-08-19T07:30:00'),
    updatedAt: new Date('2024-08-19T17:00:00'),
    assignedTo: "Roberto Silva",
    actions: mockDemandActions.filter(action => action.demandId === "2")
  },
  {
    id: "3",
    title: "Configuração de nova VLAN",
    description: "Necessário criar nova VLAN para segmentar tráfego de clientes corporativos. Configuração deve incluir regras de firewall específicas.",
    type: "configuracao",
    status: "em_andamento",
    priority: "media",
    providerId: "2",
    providerName: "TechNet Solutions",
    createdAt: new Date('2024-08-21T09:00:00'),
    updatedAt: new Date('2024-08-21T09:00:00'),
    assignedTo: "Ana Rede",
    actions: []
  },
  {
    id: "4",
    title: "Instalação de novo ponto de acesso",
    description: "Instalação e configuração de equipamento Wi-Fi 6 para expansão da cobertura wireless.",
    type: "instalacao",
    status: "pendente",
    priority: "baixa",
    providerId: "3",
    providerName: "ConnectMax",
    createdAt: new Date('2024-08-22T14:00:00'),
    updatedAt: new Date('2024-08-22T14:00:00'),
    actions: []
  },
  {
    id: "5",
    title: "Otimização de roteamento BGP",
    description: "Análise e otimização das rotas BGP para melhorar latência e redundância da conexão.",
    type: "configuracao",
    status: "pendente",
    priority: "alta",
    providerId: "4",
    providerName: "UltraLink ISP",
    createdAt: new Date('2024-08-23T10:30:00'),
    updatedAt: new Date('2024-08-23T10:30:00'),
    actions: []
  }
];

export const mockConsultors: User[] = [
  {
    id: "1",
    name: "Carlos Técnico",
    email: "carlos@empresa.com",
    role: "consultor",
    isActive: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: "2", 
    name: "Roberto Silva",
    email: "roberto@empresa.com",
    role: "consultor",
    isActive: true,
    createdAt: new Date('2024-02-15')
  },
  {
    id: "3",
    name: "Ana Rede",
    email: "ana@empresa.com", 
    role: "consultor",
    isActive: true,
    createdAt: new Date('2024-03-20')
  },
  {
    id: "4",
    name: "José Silva",
    email: "jose@empresa.com",
    role: "consultor", 
    isActive: true,
    createdAt: new Date('2024-04-05')
  }
];

export const getDashboardStats = () => {
  const totalDemands = mockDemands.length;
  const pendingDemands = mockDemands.filter(d => d.status === 'pendente').length;
  const inProgressDemands = mockDemands.filter(d => d.status === 'em_andamento').length;
  const completedDemands = mockDemands.filter(d => d.status === 'concluida').length;
  const totalProviders = mockProviders.length;
  const criticalDemands = mockDemands.filter(d => d.priority === 'critica').length;

  return {
    totalDemands,
    pendingDemands,
    inProgressDemands,
    completedDemands,
    totalProviders,
    criticalDemands
  };
};