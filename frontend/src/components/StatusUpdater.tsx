import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DEMAND_STATUS_LABELS } from "@/types";

interface StatusUpdaterProps {
  currentStatus: string;
  demandId: string;
  onStatusChange?: (newStatus: string) => void;
  variant?: "inline" | "dropdown";
}

export function StatusUpdater({ 
  currentStatus, 
  demandId, 
  onStatusChange, 
  variant = "inline" 
}: StatusUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    
    try {
      // Simular atualização no backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onStatusChange?.(newStatus);
      
      toast({
        title: "Status atualizado!",
        description: `Status alterado para: ${DEMAND_STATUS_LABELS[newStatus as keyof typeof DEMAND_STATUS_LABELS]}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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

  if (variant === "inline") {
    return (
      <Select 
        value={currentStatus} 
        onValueChange={handleStatusChange}
        disabled={isUpdating}
      >
        <SelectTrigger className={`w-auto min-w-32 h-8 ${getStatusColor(currentStatus)}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border">
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="em_andamento">Em Andamento</SelectItem>
          <SelectItem value="concluida">Concluída</SelectItem>
          <SelectItem value="cancelada">Cancelada</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Status</label>
      <Select 
        value={currentStatus} 
        onValueChange={handleStatusChange}
        disabled={isUpdating}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border">
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="em_andamento">Em Andamento</SelectItem>
          <SelectItem value="concluida">Concluída</SelectItem>
          <SelectItem value="cancelada">Cancelada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}