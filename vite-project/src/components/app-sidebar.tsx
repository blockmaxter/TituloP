import * as React from "react"
import {
  BarChartIcon,
  DatabaseIcon,
  LayoutDashboardIcon,
  MapIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Usuario",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#dashboard",
      icon: LayoutDashboardIcon,
      description: "Vista general del estado de las prácticas"
    },
    {
      title: "Biblioteca de Datos",
      url: "#biblioteca-de-datos",
      icon: DatabaseIcon,
      description: "Gestión y análisis de información"
    },
    {
      title: "Distribución Geográfica",
      url: "#analitica",
      icon: MapIcon,
      description: "Mapa interactivo de estudiantes y empresas"
    },
    {
      title: "Administración",
      url: "#admin",
      icon: SettingsIcon,
      description: "Gestión de usuarios y permisos"
    },
  ],
  navSecondary: [
    // Configuración eliminada según solicitud del usuario
  ],
}

export function AppSidebar({ onSectionChange, activeSection, isAuthenticated, onLoginRequest, ...props }: React.ComponentProps<typeof Sidebar> & { onSectionChange?: (section: string) => void; activeSection?: string; isAuthenticated?: boolean; onLoginRequest?: () => void }) {
  const userData = localStorage.getItem("firebaseUser");
  const user = userData
    ? {
        name: JSON.parse(userData).displayName || "Usuario",
        email: JSON.parse(userData).email || "m@example.com",
        avatar: JSON.parse(userData).photoURL || "/avatars/shadcn.jpg",
      }
    : {
        name: "Visitante",
        email: "visitante@example.com",
        avatar: "/avatars/shadcn.jpg",
      };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" className="flex items-center">
                <img 
                  src="/utem-logo.png" 
                  alt="UTEM Logo" 
                  className="h-5 w-5 flex-shrink-0 object-contain" 
                />
                <span className="text-base font-semibold truncate">Utem Datos</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onSectionChange={onSectionChange} activeSection={activeSection} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <ThemeToggle />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isAuthenticated={isAuthenticated} onLoginRequest={onLoginRequest} />
      </SidebarFooter>
    </Sidebar>
  )
}
