import { AppSidebar } from "@/components/app-sidebar"
import { DataTableBiblioteca } from "@/components/data-table-biblioteca"
import { useState, useEffect } from "react"
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
import HomePage from "./pages/index";

export default function App() {
  const [panel, setPanel] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("firebaseUser")));
  const [showLogin, setShowLogin] = useState(false);

  // Verificar el estado de autenticación cada vez que cambie el localStorage
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = Boolean(localStorage.getItem("firebaseUser"));
      setIsAuthenticated(authenticated);
      // Si se autentica exitosamente, ocultar login
      if (authenticated && showLogin) {
        setShowLogin(false);
      }
    };

    // Verificar inicialmente
    checkAuth();

    // Escuchar cambios en el localStorage
    window.addEventListener('storage', checkAuth);
    
    // También verificar periódicamente por si el localStorage cambió en la misma pestaña
    const interval = setInterval(checkAuth, 100);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, [showLogin]);

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
        );
      case "ciclo de vida":
        return <div className="bg-blue-100 min-h-[300px] rounded-xl" />;
      case "analítica":
        return <div className="bg-blue-200 min-h-[300px] rounded-xl" />;
      case "formulario":
        return <div className="bg-blue-300 min-h-[300px] rounded-xl" />;
      case "biblioteca de datos":
        return <DataTableBiblioteca />;
      default:
        return null;
    }
  };

  const handlePanelChange = (panelName: string) => {
    setPanel(panelName.toLowerCase());
  };

  const handleLoginRequest = () => {
    setShowLogin(true);
  };

  // Si se solicita mostrar login, mostrar HomePage
  if (showLogin) {
    return <HomePage />;
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        onPanelChange={handlePanelChange} 
        isAuthenticated={isAuthenticated}
        onLoginRequest={handleLoginRequest}
      />
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
                  <BreadcrumbPage>
                    {panel.charAt(0).toUpperCase() + panel.slice(1)}
                    {!isAuthenticated && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        Modo Visitante
                      </span>
                    )}
                  </BreadcrumbPage>
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
  );
}
