"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Usuario1.",
      logo: GalleryVerticalEnd,
      plan: "Empresarial",
    },
    {
      name: "Usuario2.",
      logo: AudioWaveform,
      plan: "Emprendedor",
    },
    {
      name: "Usuario3.",
      logo: Command,
      plan: "Gratis",
    },
  ],
  navMain: [
    {
      title: "Zona de pruebas",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Historial",
          url: "#",
        },
        {
          title: "Favoritos",
          url: "#",
        },
        {
          title: "Configuración",
          url: "#",
        },
      ],
    },
    {
      title: "Modelos",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Génesis",
          url: "#",
        },
        {
          title: "Explorador",
          url: "#",
        },
        {
          title: "Cuántico",
          url: "#",
        },
      ],
    },
    {
      title: "Documentación",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introducción",
          url: "#",
        },
        {
          title: "Comenzar",
          url: "#",
        },
        {
          title: "Tutoriales",
          url: "#",
        },
        {
          title: "Registro de cambios",
          url: "#",
        },
      ],
    },
    {
      title: "Configuración",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Equipo",
          url: "#",
        },
        {
          title: "Facturación",
          url: "#",
        },
        {
          title: "Límites",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Ingeniería de diseño",
      url: "#",
      icon: Frame,
    },
    {
      name: "Ventas y marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Viajes",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
