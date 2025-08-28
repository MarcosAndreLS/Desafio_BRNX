import { useState, useEffect } from "react"; // Adicionado useEffect
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusUpdater } from "@/components/StatusUpdater";
import { DEMAND_STATUS_LABELS, DEMAND_TYPE_LABELS, DEMAND_PRIORITY_LABELS } from "@/types";
import { getDemands } from "@/api/demands"; // Importado a função da API
import { Demand } from "@/generated/prisma"; // Importado o tipo Demand do Prisma
import {
  Plus,
  Search,
  Filter,
  Clock,
  User,
  Building2,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Loader2, // Importado Loader2 para o estado de loading
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Demands = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [demands, setDemands] = useState<Demand[]>([]); // Estado para armazenar as demandas da API
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  // Novo useEffect para buscar as demandas da API
  useEffect(() => {
    const fetchDemands = async () => {
      setIsLoading(true);
      try {
        const fetchedDemands = await getDemands(statusFilter);
        setDemands(fetchedDemands);
      } catch (error) {
        console.error("Falha ao buscar demandas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemands();
  }, [statusFilter]); // Dependência: re-executa sempre que o statusFilter mudar

  // A função de filtro agora usa o estado 'demands' obtido da API
  const filteredDemands = demands.filter((demand) => {
    // A API já filtra por status, mas mantemos o filtro de tipo e de busca no front
    const matchesSearch =
      demand.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (demand.provider?.nomeFantasia && demand.provider.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === "all" || demand.tipo === typeFilter;

    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDENTE": // Use os enums do Prisma em maiúsculas
        return <Clock className="h-4 w-4" />;
      case "EM_ANDAMENTO":
        return <AlertTriangle className="h-4 w-4" />;
      case "CONCLUIDA":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-secondary text-secondary-foreground";
      case "EM_ANDAMENTO":
        return "bg-primary text-primary-foreground";
      case "CONCLUIDA":
        return "bg-green-500 text-green-50-foreground";
      case "CANCELADA":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICA":
        return "bg-destructive text-destructive-foreground";
      case "ALTA":
        return "bg-warning text-warning-foreground";
      case "MEDIA":
        return "bg-primary text-primary-foreground";
      case "BAIXA":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Demandas</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie todas as demandas técnicas</p>
          </div>
          <Button
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
            onClick={() => navigate("/demands/new")}
          >
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
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                  <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="DIAGNOSTICO">Diagnóstico</SelectItem>
                  <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                  <SelectItem value="CONFIGURACAO">Configuração</SelectItem>
                  <SelectItem value="INSTALACAO">Instalação</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Demands List */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg text-muted-foreground">Carregando demandas...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDemands.map((demand) => (
              <Card key={demand.id} className="card-elevated p-6 interactive">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                            {demand.titulo}
                          </h3>
                          <Badge className={getPriorityColor(demand.prioridade)}>
                            {demand.prioridade}
                          </Badge>
                          <Badge className={getStatusColor(demand.status)}>
                            <span className="mr-1">{getStatusIcon(demand.status)}</span>
                            {demand.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{demand.descricao}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {demand.provider && (
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {demand.provider.nomeFantasia}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(demand.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                      {/* Removido o campo assignedTo pois não existe no seu schema */}
                      <Badge variant="outline" className="text-xs">
                        {demand.tipo}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/demands/${demand.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
                {demand.actions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Última ação: {demand.actions[demand.actions.length - 1]?.descricao.substring(0, 80)}...
                      </span>
                      <span className="text-muted-foreground">{demand.actions.length} ações registradas</span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Mensagem de "Nenhuma demanda encontrada" */}
        {!isLoading && filteredDemands.length === 0 && (
          <Card className="card-elevated p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma demanda encontrada</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Tente ajustar sua busca ou limpar os filtros"
                : "Comece registrando sua primeira demanda"}
            </p>
            <Button onClick={() => navigate("/demands/new")}>
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