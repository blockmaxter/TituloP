import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
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
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Ciclo de vida",
      url: "#",
      icon: ListIcon,
    },
    {
      title: "Analítica",
      url: "#",
      icon: BarChartIcon,
    },
  ],
  navClouds: [
    {
      title: "Captura",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Propuestas activas",
          url: "#",
        },
        {
          title: "Archivadas",
          url: "#",
        },
      ],
    },
    {
      title: "Propuesta",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Propuestas activas",
          url: "#",
        },
        {
          title: "Archivadas",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Propuestas activas",
          url: "#",
        },
        {
          title: "Archivadas",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Buscar",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Biblioteca de datos",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Formulario",
      url: "#",
      icon: FolderIcon,
    },
  ],
}

export function AppSidebar({ onPanelChange, ...props }: React.ComponentProps<typeof Sidebar> & { onPanelChange?: (panel: string) => void }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Utem Datos</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onPanelChange={onPanelChange} />
  <NavDocuments items={data.documents} onPanelChange={onPanelChange} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
