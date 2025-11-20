import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePermissions } from "@/contexts/PermissionsContext"
import { Permission } from "@/types/permissions"

export function NavMain({ items, onSectionChange, activeSection }: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[],
  onSectionChange?: (section: string) => void,
  activeSection?: string
}) {
  const { hasPermission } = usePermissions();

  // Mapeo de secciones a permisos requeridos
  const getSectionPermissions = (title: string): Permission[] => {
    switch (title.toLowerCase()) {
      case 'dashboard':
        return [Permission.VIEW_DASHBOARD];
      case 'biblioteca de datos':
        return [Permission.VIEW_DATA_LIBRARY];
      case 'distribución geográfica':
      case 'analítica':
        return [Permission.VIEW_ANALYTICS];
      case 'administración':
        return [Permission.MANAGE_USERS];
      default:
        return [];
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <div className="px-4 py-2 text-lg font-bold">Panel de datos</div>
        <SidebarMenu>
          {items.map((item) => {
            const requiredPermissions = getSectionPermissions(item.title);
            const hasAccess = requiredPermissions.length === 0 || 
                            requiredPermissions.some(permission => hasPermission(permission));
            
            // Si no tiene permisos, no mostrar el item
            if (!hasAccess) {
              return null;
            }

            const sectionId = item.title === "Dashboard" ? "dashboard" :
                           item.title === "Biblioteca de Datos" ? "biblioteca-de-datos" : 
                           item.title === "Distribución Geográfica" ? "analitica" :
                           item.title === "Administración" ? "admin" :
                           item.title.toLowerCase().replace(/\s+/g, '-');
            const isActive = activeSection === sectionId;
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  onClick={() => onSectionChange && onSectionChange(sectionId)}
                  className={isActive ? "bg-accent text-accent-foreground" : ""}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
