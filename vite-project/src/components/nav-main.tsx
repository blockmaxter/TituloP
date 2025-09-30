import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({ items, onSectionChange, activeSection }: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[],
  onSectionChange?: (section: string) => void,
  activeSection?: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <div className="px-4 py-2 text-lg font-bold">Panel de datos</div>
        <SidebarMenu>
          {items.map((item) => {
            const sectionId = item.title === "Ciclo de vida" ? "ciclo-vida" : item.title.toLowerCase();
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
