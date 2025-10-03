import { Button } from "@/components/ui/button";
import { LayoutDashboard, Database, List, BarChart3, Settings } from "lucide-react";
import { usePermissions } from "@/contexts/PermissionsContext";
import { Permission } from "@/types/permissions";

interface FloatingNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function FloatingNav({ activeSection, onSectionChange }: FloatingNavProps) {
  const { hasPermission } = usePermissions();

  const sections = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      permission: Permission.VIEW_DASHBOARD
    },
    { 
      id: 'biblioteca-de-datos', 
      label: 'Biblioteca de Datos', 
      icon: Database,
      permission: Permission.VIEW_DATA_LIBRARY
    },
    { 
      id: 'ciclo-vida', 
      label: 'Ciclo de Vida', 
      icon: List,
      permission: Permission.VIEW_LIFECYCLE
    },
    { 
      id: 'analitica', 
      label: 'Analítica', 
      icon: BarChart3,
      permission: Permission.VIEW_ANALYTICS
    },
    { 
      id: 'admin', 
      label: 'Administración', 
      icon: Settings,
      permission: Permission.MANAGE_USERS
    },
  ];

  // Filtrar secciones basado en permisos
  const accessibleSections = sections.filter(section => hasPermission(section.permission));

  return (
    <>
      {/* Navegación flotante para escritorio */}
      <div className="fixed right-4 xl:right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-2">
        {accessibleSections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSectionChange(section.id)}
            className="w-12 h-12 p-0 rounded-full shadow-lg hover:scale-105 transition-transform"
            title={section.label}
          >
            <section.icon className="h-5 w-5" />
          </Button>
        ))}
      </div>

      {/* Navegación flotante para móvil */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 lg:hidden">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-full shadow-lg px-2 py-2">
          <div className="flex space-x-1">
            {accessibleSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onSectionChange(section.id)}
                className="w-10 h-10 p-0 rounded-full"
                title={section.label}
              >
                <section.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}