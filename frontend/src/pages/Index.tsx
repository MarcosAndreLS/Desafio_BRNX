import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/ui/stats-card";
import { Card } from "@/components/ui/card";
import { getDashboardStats, mockDemands } from "@/data/mockData";
import { DEMAND_STATUS_LABELS } from "@/types";
import { 
  ClipboardList, 
  Building2, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const stats = getDashboardStats();
  
  // Recent demands for activity feed
  const recentDemands = mockDemands
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de gestão de demandas técnicas
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Demandas"
            value={stats.totalDemands}
            description="Todas as demandas cadastradas"
            icon={<ClipboardList className="h-6 w-6" />}
            //trend={{ value: 18, isPositive: true }}
          />
          
          <StatsCard
            title="Provedores Ativos"
            value={stats.totalProviders}
            description="Provedores cadastrados"
            icon={<Building2 className="h-6 w-6" />}
          />
          
          <StatsCard
            title="Pendentes"
            value={stats.pendingDemands}
            description="Aguardando atendimento"
            icon={<Clock className="h-6 w-6" />}
            
          />
          
          <StatsCard
            title="Concluídas"
            value={stats.completedDemands}
            description="Finalizadas com sucesso"
            icon={<CheckCircle className="h-6 w-6" />}
            
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Overview */}
          <Card className="card-elevated p-6 h-80">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Status das Demandas
              </h3>
            </div>
            
            <div className="space-y-4">
              {[
                { status: 'pendente', count: stats.pendingDemands, colorClass: 'bg-warning', bgClass: 'bg-warning/20', textClass: 'text-warning' },
                { status: 'em_andamento', count: stats.inProgressDemands, colorClass: 'bg-primary', bgClass: 'bg-primary/20', textClass: 'text-primary' },
                { status: 'concluida', count: stats.completedDemands, colorClass: 'bg-success', bgClass: 'bg-success/20', textClass: 'text-success' }
              ].map(({ status, count, colorClass, bgClass, textClass }) => (
                <div key={status} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                    <span className="text-sm font-medium text-foreground">
                      {DEMAND_STATUS_LABELS[status as keyof typeof DEMAND_STATUS_LABELS]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-foreground">{count}</span>
                    <div className={`px-2 py-1 rounded-full ${bgClass} ${textClass} text-xs font-medium`}>
                      {((count / stats.totalDemands) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Atividade Recente
            </h3>
            
            <div className="space-y-4">
              {recentDemands.map((demand) => (
                <div key={demand.id} className="p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {demand.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {demand.providerName}
                      </p>
                    </div>
                    <div className={`ml-3 px-2 py-1 rounded-full text-xs font-medium status-${demand.status}`}>
                      {DEMAND_STATUS_LABELS[demand.status]}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                    <span className="text-xs text-muted-foreground">
                      {new Date(demand.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                    {demand.priority === 'critica' && (
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
