import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  User,
  BarChart3,
  Edit,
  Trash
} from "lucide-react";
import { mockProviders, mockDemands } from "@/data/mockData";
import { DEMAND_STATUS_LABELS, DEMAND_TYPE_LABELS } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProviderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const provider = mockProviders.find(p => p.id === id);
  const providerDemands = mockDemands.filter(d => d.providerId === id);

  if (!provider) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Provedor não encontrado</h2>
          <Button onClick={() => navigate("/providers")} className="mt-4">
            Voltar para Provedores
          </Button>
        </div>
      </AppLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-warning text-warning-foreground';
      case 'em_andamento': return 'bg-primary text-primary-foreground';
      case 'concluida': return 'bg-success text-success-foreground';
      case 'cancelada': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusStats = () => {
    const stats = {
      pendente: 0,
      em_andamento: 0,
      concluida: 0,
      cancelada: 0,
      total: providerDemands.length
    };

    providerDemands.forEach(demand => {
      stats[demand.status as keyof typeof stats]++;
    });

    return stats;
  };

  const stats = getStatusStats();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/providers")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{provider.fantasyName}</h1>
            <p className="text-muted-foreground">
              Detalhes do provedor e suas demandas
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/providers/${provider.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do Provedor */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Informações do Provedor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Nome Fantasia</h4>
                  <p className="text-muted-foreground">{provider.fantasyName}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-1">Responsável</h4>
                  <p className="text-muted-foreground">{provider.responsibleName}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{provider.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{provider.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Cadastrado em {format(provider.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Estatísticas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total de Demandas</span>
                  <Badge variant="outline" className="font-bold">
                    {stats.total}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Pendentes</span>
                    <Badge variant="outline" className="text-xs">
                      {stats.pendente}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Em Andamento</span>
                    <Badge variant="outline" className="text-xs">
                      {stats.em_andamento}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Concluídas</span>
                    <Badge variant="outline" className="text-xs">
                      {stats.concluida}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Demandas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Demandas do Provedor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {providerDemands.length > 0 ? (
                  <div className="space-y-4">
                    {providerDemands.map((demand) => (
                      <div key={demand.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-1">
                            <h4 className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                                onClick={() => navigate(`/demands/${demand.id}`)}>
                              {demand.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {demand.description}
                            </p>
                          </div>
                          <Badge className={getStatusColor(demand.status)}>
                            {DEMAND_STATUS_LABELS[demand.status as keyof typeof DEMAND_STATUS_LABELS]}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4 text-muted-foreground">
                            <span>{DEMAND_TYPE_LABELS[demand.type as keyof typeof DEMAND_TYPE_LABELS]}</span>
                            <span>•</span>
                            <span>{format(demand.createdAt, "dd/MM/yyyy", { locale: ptBR })}</span>
                            {demand.assignedTo && (
                              <>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>{demand.assignedTo}</span>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/demands/${demand.id}`)}
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhuma demanda encontrada
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Este provedor ainda não possui demandas registradas.
                    </p>
                    <Button onClick={() => navigate("/demands/new")}>
                      Criar Nova Demanda
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}