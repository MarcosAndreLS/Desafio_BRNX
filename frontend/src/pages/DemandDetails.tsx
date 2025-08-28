import { useState } from "react";
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
import { ArrowLeft, Plus, User, Calendar, Clock, AlertTriangle, Trash2 } from "lucide-react";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { mockDemands, mockConsultors } from "../data/mockData";
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
  analysis: 'Análise',
  configuration: 'Configuração',
  maintenance: 'Manutenção',
  communication: 'Comunicação',
  resolution: 'Resolução'
};

export default function DemandDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actions, setActions] = useState<DemandAction[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const demand = mockDemands.find(d => d.id === id);

  const form = useForm<ActionFormData>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      description: "",
      consultorId: "",
      actionType: "",
    },
  });

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
      case 'critica': return 'bg-destructive text-destructive-foreground';
      case 'alta': return 'bg-warning text-warning-foreground';
      case 'media': return 'bg-primary text-primary-foreground';
      case 'baixa': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-warning text-warning-foreground';
      case 'em_andamento': return 'bg-primary text-primary-foreground';
      case 'concluida': return 'bg-success text-success-foreground';
      case 'cancelada': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const onSubmit = async (data: ActionFormData) => {
    setIsSubmitting(true);
    
    const selectedConsultor = mockConsultors.find(c => c.id === data.consultorId);

    const newAction: DemandAction = {
      id: `action-${Date.now()}`,
      demandId: demand.id,
      description: data.description,
      technician: selectedConsultor?.name || "",
      executedAt: new Date(),
      actionType: data.actionType as any,
    };

    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setActions(prev => [...prev, newAction]);
    form.reset();
    
    toast({
      title: "Sucesso!",
      description: "Ação registrada com sucesso.",
    });
    
    setIsSubmitting(false);
  };

  const allActions = [...demand.actions, ...actions];

  const handleDeleteDemand = () => {
    toast({
      title: "Demanda excluída",
      description: "A demanda foi removida com sucesso!"
    });
    navigate("/demands");
  };

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
              <h1 className="text-3xl font-bold text-foreground">{demand.title}</h1>
              <p className="text-muted-foreground">
                Detalhes e histórico da demanda
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline"
            onClick={() => setDeleteDialog(true)}
            className="border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Demanda
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
                    <Badge className={getPriorityColor(demand.priority)}>
                      {DEMAND_PRIORITY_LABELS[demand.priority as keyof typeof DEMAND_PRIORITY_LABELS]}
                    </Badge>
                    <Badge className={getStatusColor(demand.status)}>
                      {DEMAND_STATUS_LABELS[demand.status as keyof typeof DEMAND_STATUS_LABELS]}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Descrição</h4>
                  <p className="text-muted-foreground">{demand.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Provedor:</span>
                    <span className="font-medium">{demand.providerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">
                      {DEMAND_TYPE_LABELS[demand.type as keyof typeof DEMAND_TYPE_LABELS]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Criado em:</span>
                    <span className="font-medium">
                      {format(demand.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  {demand.assignedTo && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Responsável:</span>
                      <span className="font-medium">{demand.assignedTo}</span>
                    </div>
                  )}
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
                            {actionTypeLabels[action.actionType]}
                          </Badge>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {format(action.executedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-foreground mb-1">{action.description}</p>
                        <p className="text-xs text-muted-foreground">Por: {action.technician}</p>
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
                              {mockConsultors.filter(c => c.isActive).map((consultor) => (
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
      </div>
    </AppLayout>
  );
}