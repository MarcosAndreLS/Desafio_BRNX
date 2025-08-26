import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { mockProviders } from "@/data/mockData";
import { 
  Plus, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Providers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProviders = mockProviders.filter(provider =>
    provider.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.responsibleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Provedores</h1>
            <p className="text-muted-foreground">
              Gerencie os provedores cadastrados no sistema
            </p>
          </div>
          
          <Button 
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
            onClick={() => navigate("/providers/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Provedor
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="card-elevated p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar provedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="card-elevated p-6 interactive group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {provider.fantasyName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {provider.responsibleName}
                    </p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border border-border">
                    <DropdownMenuItem className="text-popover-foreground hover:bg-muted">
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground hover:bg-muted">
                      Ver Demandas
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{provider.email}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{provider.phone}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Cadastrado em {provider.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                <div className="text-sm">
                  <span className="text-muted-foreground">Demandas: </span>
                  <span className="font-semibold text-foreground">{provider.demandsCount}</span>
                </div>
                
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <Card className="card-elevated p-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum provedor encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Tente ajustar sua busca ou limpar os filtros" 
                : "Comece cadastrando seu primeiro provedor"
              }
            </p>
            <Button onClick={() => navigate("/providers/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Provedor
            </Button>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Providers;