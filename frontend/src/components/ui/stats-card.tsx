import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("card-elevated p-6 interactive", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                trend.isPositive 
                  ? "bg-success/20 text-success" 
                  : "bg-destructive/20 text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}