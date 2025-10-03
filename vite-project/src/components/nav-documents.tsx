"use client"

import {
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePermissions } from "@/contexts/PermissionsContext"
import { Permission } from "@/types/permissions"

export function NavDocuments({ items, onSectionChange, activeSection }: {
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[],
  onSectionChange?: (section: string) => void,
  activeSection?: string
}) {
  const { isMobile } = useSidebar()
  const { hasPermission } = usePermissions()

  // Mapeo de documentos a permisos requeridos
  const getDocumentPermissions = (name: string): Permission[] => {
    switch (name.toLowerCase()) {
      case 'biblioteca de datos':
        return [Permission.VIEW_DATA_LIBRARY];
      case 'formulario':
        return []; // Sin permisos específicos requeridos
      default:
        return [];
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documentos</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const requiredPermissions = getDocumentPermissions(item.name);
          const hasAccess = requiredPermissions.length === 0 || 
                           requiredPermissions.some(permission => hasPermission(permission));
          
          // Si no tiene permisos, no mostrar el item
          if (!hasAccess) {
            return null;
          }

          const sectionId = item.name.toLowerCase().replace(/\s+/g, '-');
          const isActive = activeSection === sectionId;
          
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                onClick={() => onSectionChange && onSectionChange(sectionId)}
                className={isActive ? "bg-accent text-accent-foreground" : ""}
              >
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="rounded-sm data-[state=open]:bg-accent"
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <FolderIcon />
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShareIcon />
                  <span>Share</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
