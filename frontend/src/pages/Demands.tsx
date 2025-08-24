import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockDemands } from "@/data/mockData";
import { DEMAND_STATUS_LABELS, DEMAND_TYPE_LABELS, DEMAND_PRIORITY_LABELS } from "@/types";
import { 
  Plus, 
  Search, 
  Filter,
  Clock,
  User,
  Building2,
  AlertTriangle,
  CheckCircle,
  Calendar
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Demands = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const filteredDemands = mockDemands.filter(demand => {
    const matchesSearch = demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demand.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || demand.status === statusFilter;
    const matchesType = typeFilter === "all" || demand.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'em_andamento':
        return <AlertTriangle className="h-4 w-4" />;
      case 'concluida':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica':
        return 'bg-destructive text-destructive-foreground';
      case 'alta':
        return 'bg-warning text-warning-foreground';
      case 'media':
        return 'bg-primary text-primary-foreground';
      case 'baixa':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Demandas</h1>
            <p className="text-muted-foreground">
              Acompanhe e gerencie todas as demandas técnicas
            </p>
          </div>
          
          <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4 mr-2" />
            Nova Demanda
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="card-elevated p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar demandas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="configuracao">Configuração</SelectItem>
                  <SelectItem value="instalacao">Instalação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Demands List */}
        <div className="space-y-4">
          {filteredDemands.map((demand) => (
            <Card key={demand.id} className="card-elevated p-6 interactive">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                          {demand.title}
                        </h3>
                        <Badge className={getPriorityColor(demand.priority)}>
                          {DEMAND_PRIORITY_LABELS[demand.priority]}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {demand.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {demand.providerName}
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(demand.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    
                    {demand.assignedTo && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {demand.assignedTo}
                      </div>
                    )}
                    
                    <Badge variant="outline" className="text-xs">
                      {DEMAND_TYPE_LABELS[demand.type]}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md status-${demand.status}`}>
                    {getStatusIcon(demand.status)}
                    <span className="text-xs font-medium">
                      {DEMAND_STATUS_LABELS[demand.status]}
                    </span>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>

              {demand.actions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Última ação: {demand.actions[demand.actions.length - 1]?.description.substring(0, 80)}...
                    </span>
                    <span className="text-muted-foreground">
                      {demand.actions.length} ações registradas
                    </span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredDemands.length === 0 && (
          <Card className="card-elevated p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma demanda encontrada
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Tente ajustar sua busca ou limpar os filtros" 
                : "Comece registrando sua primeira demanda"
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Demanda
            </Button>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Demands;