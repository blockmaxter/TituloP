import { AppSidebar } from "@/components/app-sidebar"
import { DataTableBiblioteca } from "@/components/data-table-biblioteca"
import { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AuthWrapper from "@/components/AuthWrapper"

export default function Page() {
  const [panel, setPanel] = useState("dashboard")

  const renderPanel = () => {
    switch (panel) {
      case "dashboard":
        return (
          <>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
          </>
        )
      case "ciclo de vida":
        return (
          <div className="bg-blue-100 min-h-[300px] rounded-xl" />
        )
      case "analítica":
        return (
          <div className="bg-blue-200 min-h-[300px] rounded-xl" />
        )
      case "formulario":
        return (
          <div className="bg-blue-300 min-h-[300px] rounded-xl" />
        )
      case "biblioteca de datos":
        return <DataTableBiblioteca />
      default:
        return null
    }
  }

  const handlePanelChange = (panelName: string) => {
    setPanel(panelName.toLowerCase())
  }

  return (
    <AuthWrapper>
      <SidebarProvider>
        <AppSidebar onPanelChange={handlePanelChange} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{panel.charAt(0).toUpperCase() + panel.slice(1)}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {renderPanel()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthWrapper>
  );
}
