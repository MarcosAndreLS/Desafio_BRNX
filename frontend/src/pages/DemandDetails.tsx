import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft, Plus, User, Calendar, Clock, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
//import { mockDemands, mockConsultors } from "../data/mockData";
import { Demand } from "@/generated/prisma";
import { createAction } from "@/api/actions";
import { getConsultors } from "@/api/users";
import { getDemandById, deleteDemand } from "@/api/demands";
import { 
  DEMAND_TYPE_LABELS, 
  DEMAND_STATUS_LABELS, 
  DEMAND_PRIORITY_LABELS,
  DemandAction 
} from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const actionSchema = z.object({
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  consultorId: z.string().min(1, "Consultor é obrigatório"),
  actionType: z.string().min(1, "Tipo de ação é obrigatório"),
});

type ActionFormData = z.infer<typeof actionSchema>;

const actionTypeLabels = {
  ANALISE: 'Análise',
  CONFIGURACAO: 'Configuração',
  MANUTENCAO: 'Manutenção',
  COMUNICACAO: 'Comunicação',
  RESOLUCAO: 'Resolução'
};

export default function DemandDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actions, setActions] = useState<DemandAction[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [demand, setDemand] = useState<Demand | null>(null);

  const [consultors, setConsultors] = useState<any[]>([]);

  const form = useForm<ActionFormData>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      description: "",
      consultorId: "",
      actionType: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // Busque a demanda e os consultores em paralelo para otimizar
        const [demandData, consultorsData] = await Promise.all([
          getDemandById(id), // Supondo que você criou essa função em @/api/demands
          getConsultors() // A nova função que você criou em @/api/users
        ]);
        
        setDemand(demandData);
        setConsultors(consultorsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (!demand) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Demanda não encontrada</h2>
          <Button onClick={() => navigate("/demands")} className="mt-4">
            Voltar para Demandas
          </Button>
        </div>
      </AppLayout>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICA': return 'bg-destructive text-destructive-foreground';
      case 'ALTA': return 'bg-warning text-warning-foreground';
      case 'MEDIA': return 'bg-primary text-primary-foreground';
      case 'BAIXA': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-warning text-warning-foreground';
      case 'EM_ANDAMENTO': return 'bg-primary text-primary-foreground';
      case 'CONCLUIDA': return 'bg-success text-success-foreground';
      case 'CANCELADA': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const onSubmit = async (data: ActionFormData) => {
    setIsSubmitting(true);
    
    try {
      // Dados para a requisição da API
      const actionData = {
        descricao: data.description,
        tipo: data.actionType,
        demandId: demand.id,
        tecnicoId: data.consultorId,
      };

      // Chama a API para criar a ação
      const newAction = await createAction(actionData);
      
      // Atualiza o estado da demanda com a nova ação
      setDemand(prevDemand => {
        if (!prevDemand) return null;
        return {
          ...prevDemand,
          actions: [...prevDemand.actions, newAction]
        };
      });

      form.reset();
      
      toast({
        title: "Sucesso!",
        description: "Ação registrada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao registrar a ação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar a ação.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allActions = [...demand.actions, ...actions];

  const handleDeleteDemand = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await deleteDemand(id);
      
      toast({
        title: "Demanda excluída",
        description: "A demanda foi removida com sucesso!"
      });
      navigate("/demands");
    } catch (error) {
      console.error("Erro ao excluir a demanda:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a demanda.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg text-muted-foreground">Carregando detalhes...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/demands")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{demand.titulo}</h1>
              <p className="text-muted-foreground">
                Detalhes e histórico da demanda
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline"
            onClick={() => setDeleteDialog(true)}
            disabled={isDeleting} // Desabilita o botão durante a exclusão
            className="border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
            {isDeleting ? "Excluindo..." : "Excluir Demanda"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações da Demanda */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Informações da Demanda
                  <div className="flex space-x-2">
                    <Badge className={getPriorityColor(demand.prioridade)}>
                      {demand.prioridade}
                    </Badge>
                    <Badge className={getStatusColor(demand.status)}>
                      {demand.status}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Descrição</h4>
                  <p className="text-muted-foreground">{demand.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Provedor:</span>
                    <span className="font-medium">{demand.provider.nomeFantasia}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">
                      {demand.tipo}
                    </span>
                  </div>
                  {demand.atendente && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Atendente:</span>
                      <span className="font-medium">{demand.atendente.name}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Criado em:</span>
                    <span className="font-medium">
                      {format(demand.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Ações</CardTitle>
                <CardDescription>
                  Todas as ações realizadas nesta demanda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allActions.length > 0 ? (
                  <div className="space-y-4">
                    {allActions.map((action, index) => (
                      <div key={action.id} className="border-l-2 border-primary pl-4 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">
                            {action.tipo}
                          </Badge>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(action.executadaEm, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-foreground mb-1">{action.descricao}</p>
                        <p className="text-xs text-muted-foreground">Por: {action.tecnico?.name || 'Não atribuído'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma ação registrada ainda.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulário para Nova Ação */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Nova Ação</span>
                </CardTitle>
                <CardDescription>
                  Registre uma nova ação técnica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="actionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Ação</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(actionTypeLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consultorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o consultor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {consultors.map((consultor) => (
                                <SelectItem key={consultor.id} value={consultor.id}>
                                  {consultor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva a ação realizada..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Salvando..." : "Registrar Ação"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog}
          onOpenChange={setDeleteDialog}
          onConfirm={handleDeleteDemand}
          title="Excluir Demanda"
          description="Tem certeza que deseja excluir esta demanda? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos."
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
          icon={<Trash2 className="h-5 w-5 text-destructive" />}
        />

        {/* O restante do código do div e AppLayout */}
      </div>
    </AppLayout>
  );
}