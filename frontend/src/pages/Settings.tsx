import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatsCard } from "@/components/ui/stats-card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { mockConsultors, getDashboardStats } from "@/data/mockData";
import { 
  Settings as SettingsIcon, 
  Users, 
  TrendingUp, 
  Activity,
  Plus,
  Edit2,
  Trash2,
  UserPlus,
  Shield
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [consultors, setConsultors] = useState(mockConsultors);
  const [newConsultor, setNewConsultor] = useState({
    name: "",
    email: "",
    role: "consultor" as "consultor" | "atendente"
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; consultorId?: string }>({ open: false });
  const stats = getDashboardStats();

  const handleAddConsultor = () => {
    if (!newConsultor.name || !newConsultor.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newUser = {
      id: String(consultors.length + 1),
      name: newConsultor.name,
      email: newConsultor.email,
      role: newConsultor.role,
      isActive: true,
      createdAt: new Date()
    };

    setConsultors([...consultors, newUser]);
    setNewConsultor({ name: "", email: "", role: "consultor" });
    
    toast({
      title: "Sucesso",
      description: `${newConsultor.role === 'consultor' ? 'Consultor' : 'Atendente'} cadastrado com sucesso!`
    });
  };

  const handleDeleteConsultor = () => {
    if (deleteDialog.consultorId) {
      const consultorToDelete = consultors.find(c => c.id === deleteDialog.consultorId);
      setConsultors(consultors.filter(c => c.id !== deleteDialog.consultorId));
      
      toast({
        title: `${consultorToDelete?.role === 'consultor' ? 'Consultor' : 'Atendente'} excluído`,
        description: "O usuário foi removido com sucesso!"
      });
    }
    setDeleteDialog({ open: false });
  };

  const toggleConsultorStatus = (id: string) => {
    setConsultors(consultors.map(consultor => 
      consultor.id === id 
        ? { ...consultor, isActive: !consultor.isActive }
        : consultor
    ));
    
    toast({
      title: "Status atualizado",
      description: "Status do consultor foi alterado com sucesso!"
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Painel administrativo para gerenciar consultores e visualizar métricas do sistema
          </p>
        </div>

        {/* Admin Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Consultores"
            value={consultors.filter(c => c.isActive).length}
            description="Consultores ativos"
            icon={<Users className="h-6 w-6" />}
          />
          
          <StatsCard
            title="Demandas Ativas"
            value={stats.pendingDemands + stats.inProgressDemands}
            description="Em andamento + pendentes"
            icon={<Activity className="h-6 w-6" />}
          />
          
          <StatsCard
            title="Taxa de Conclusão"
            value={`${Math.round((stats.completedDemands / stats.totalDemands) * 100)}%`}
            description="Demandas finalizadas"
            icon={<TrendingUp className="h-6 w-6" />}
          />
          
          <StatsCard
            title="Provedores Ativos"
            value={stats.totalProviders}
            description="Total cadastrado"
            icon={<Shield className="h-6 w-6" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cadastro de Consultor */}
          <Card className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-primary" />
              Cadastrar Usuário
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome de usuário</Label>
                <Input
                  id="name"
                  placeholder="Nome de usuário"
                  value={newConsultor.name}
                  onChange={(e) => setNewConsultor({ ...newConsultor, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@empresa.com"
                  value={newConsultor.email}
                  onChange={(e) => setNewConsultor({ ...newConsultor, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select 
                  value={newConsultor.role} 
                  onValueChange={(value: "consultor" | "atendente") => 
                    setNewConsultor({ ...newConsultor, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultor">Consultor</SelectItem>
                    <SelectItem value="atendente">Atendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddConsultor}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar {newConsultor.role === 'consultor' ? 'Consultor' : 'Atendente'}
              </Button>
            </div>
          </Card>

          {/* Lista de Consultores */}
          <Card className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Usuários Cadastrados
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {consultors.map((consultor: any) => (
                <div key={consultor.id} className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{consultor.name}</h4>
                        <Badge variant={consultor.isActive ? "default" : "secondary"}>
                          {consultor.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{consultor.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{consultor.role}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleConsultorStatus(consultor.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteDialog({ open: true, consultorId: consultor.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open })}
          onConfirm={handleDeleteConsultor}
          title={`Excluir ${consultors.find(c => c.id === deleteDialog.consultorId)?.role === 'consultor' ? 'Consultor' : 'Atendente'}`}
          description={`Tem certeza que deseja excluir este ${consultors.find(c => c.id === deleteDialog.consultorId)?.role === 'consultor' ? 'consultor' : 'atendente'}? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
          icon={<Trash2 className="h-5 w-5 text-destructive" />}
        />
      </div>
    </AppLayout>
  );
};

export default Settings;