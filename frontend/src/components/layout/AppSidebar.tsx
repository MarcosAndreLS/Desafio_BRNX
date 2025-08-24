import { useState } from "react";
import Logo from "@/assets/logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardList, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Visão geral do sistema"
  },
  {
    title: "Provedores",
    href: "/providers",
    icon: Building2,
    description: "Gerenciar provedores"
  },
  {
    title: "Demandas",
    href: "/demands",
    icon: ClipboardList,
    description: "Acompanhar demandas"
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    description: "Configurar sistema"
  }
];

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();

  return (
    <div className={cn(
      "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <img src={Logo} alt="Logo" className="w-8 h-8 object-cover rounded-lg" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">BRNX NetControl</h2>
              <p className="text-xs text-sidebar-foreground/60">Gestão de Demandas</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 flex-shrink-0",
                isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70",
                !isCollapsed && "mr-3"
              )} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="block">{item.title}</span>
                  <span className={cn(
                    "text-xs opacity-70 group-hover:opacity-100 transition-opacity",
                    isActive ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/50"
                  )}>
                    {item.description}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center rounded-lg bg-sidebar-accent/50 p-3",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-foreground">AD</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">Administrador</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">admin@brnx.com</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}