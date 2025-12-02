import { AppSidebar } from "@/components/app-sidebar"
import { DataTableBiblioteca } from "@/components/data-table-biblioteca"
import { GeographicDistributionChart } from "@/components/charts/geographic-distribution-chart"
import { MetricCard, MetricGrid } from "@/components/ui/metric-card"
import { ResponsiveContainer, SectionHeader } from "@/components/ui/responsive-layout"
import { EstudiantesPorCarreraChart } from "@/components/charts/estudiantes-carrera-chart"
import { EvaluacionesChart } from "@/components/charts/evaluaciones-chart"
import { PracticasTendenciaChart } from "@/components/charts/practicas-tendencia-chart"
import { ContratacionesChart } from "./components/charts/contrataciones-chart";
import { EstudiantesPorComunaLineas } from "./components/charts/estudiantes-por-comuna-lineas";
import { EstadoPracticasChart } from "@/components/charts/estado-practicas-chart"
import { TimelinePracticasChart } from "@/components/charts/timeline-practicas-chart"
import { DuracionPracticasChart } from "@/components/charts/duracion-practicas-chart"
import { SeguimientoPracticasChart } from "@/components/charts/seguimiento-practicas-chart"
import { useState, useEffect } from "react"
import { useFirebaseData } from "@/hooks/useFirebaseData"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollProgress } from "@/components/scroll-progress"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { RoleBadge } from "@/components/UserPermissionIndicators"
import { UserManagement } from "@/components/admin/UserManagement"
import { usePermissions } from "@/contexts/PermissionsContext"
import { Permission } from "@/types/permissions"
import AuthWrapper from "@/components/AuthWrapper"
import HomePage from "./pages/index"

function AppContent() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showLogin, setShowLogin] = useState(false);
  const { user, loading } = usePermissions();
  const { data: studentData, loading: dataLoading } = useFirebaseData();

  // Calcular métricas dinámicamente
  const metrics = {
    estudiantesActivos: studentData.length,
    empresasColaboradoras: new Set(studentData.map(s => s.nombreEmpresa).filter(e => e && e.trim())).size,
    practicasFinalizadas: studentData.filter(s => s.evaluacionEnviada === 'Si' || s.evaluacionEnviada === 'Sí').length
  };

  // Intersection Observer para detectar sección activa
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observar todas las secciones
    const sections = ['dashboard', 'biblioteca-de-datos', 'ciclo-vida', 'analitica', 'admin'];
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const renderDashboardSection = () => (
    <ProtectedRoute requiredPermissions={[Permission.VIEW_DASHBOARD]} showError={false}>
      <section id="dashboard" className="min-h-screen py-8">
        <ResponsiveContainer>
          <SectionHeader 
            title="Dashboard Ejecutivo" 
            description="Vista general del estado de las prácticas profesionales y estudiantes"
          />
          
          <MetricGrid className="mb-8">
            <MetricCard
              title="Estudiantes Activos"
              value={dataLoading ? "..." : metrics.estudiantesActivos.toString()}
              change={+12.5}
              description="Estudiantes con práctica registrada"
            />
            <MetricCard
              title="Empresas Colaboradoras"
              value={dataLoading ? "..." : metrics.empresasColaboradoras.toString()}
              change={+8.2}
              description="Empresas con convenio activo"
            />
            <MetricCard
              title="Prácticas Finalizadas"
              value={dataLoading ? "..." : metrics.practicasFinalizadas.toString()}
              change={+15.3}
              description="Prácticas con evaluación enviada"
            />
          </MetricGrid>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <EstudiantesPorCarreraChart />
            <EvaluacionesChart />
          </div>

          <ProtectedRoute requiredPermissions={[Permission.VIEW_DETAILED_ANALYTICS]} fallback={null}>
            <div className="grid lg:grid-cols-1 gap-6">
              <PracticasTendenciaChart />
            </div>
          </ProtectedRoute>
        </ResponsiveContainer>
      </section>
    </ProtectedRoute>
  );

  const renderBibliotecaSection = () => (
    <ProtectedRoute requiredPermissions={[Permission.VIEW_DATA_LIBRARY]} showError={false}>
      <section id="biblioteca-de-datos" className="min-h-screen py-8 bg-muted/30">
        <ResponsiveContainer>
          <SectionHeader 
            title="Biblioteca de Datos" 
            description="Gestión y análisis de información de estudiantes y prácticas"
          />
          
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <ContratacionesChart />
            <EstadoPracticasChart />
          </div>

          <div className="mb-8">
            <EstudiantesPorComunaLineas />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tabla de Datos de Estudiantes</CardTitle>
              <CardDescription>
                Vista detallada de estudiantes y sus prácticas profesionales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTableBiblioteca />
            </CardContent>
          </Card>
        </ResponsiveContainer>
      </section>
    </ProtectedRoute>
  );

  const renderCicloVidaSection = () => (
    <ProtectedRoute requiredPermissions={[Permission.VIEW_LIFECYCLE]} showError={false}>
      <section id="ciclo-vida" className="min-h-screen py-8">
        <ResponsiveContainer>
          <SectionHeader 
            title="Ciclo de Vida de Prácticas" 
            description="Seguimiento temporal y evolutivo de las prácticas profesionales"
          />
          
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <TimelinePracticasChart />
            <DuracionPracticasChart />
          </div>

          <div className="grid lg:grid-cols-1 gap-6">
            <SeguimientoPracticasChart />
          </div>
        </ResponsiveContainer>
      </section>
    </ProtectedRoute>
  );

  const renderAnaliticaSection = () => (
    <ProtectedRoute requiredPermissions={[Permission.VIEW_ANALYTICS]} showError={false}>
      <section id="analitica" className="min-h-screen py-8 bg-muted/30">
        <ResponsiveContainer>
          <SectionHeader 
            title="Distribución Geográfica" 
            description="Mapa interactivo de estudiantes y empresas por comuna"
          />
          
          <div className="space-y-8">
            <GeographicDistributionChart />
          </div>
        </ResponsiveContainer>
      </section>
    </ProtectedRoute>
  );

  const renderAdminSection = () => (
    <ProtectedRoute requiredPermissions={[Permission.MANAGE_USERS]} showError={false}>
      <section id="admin" className="min-h-screen py-8">
        <ResponsiveContainer>
          <SectionHeader 
            title="Administración" 
            description="Gestión de usuarios, roles y permisos del sistema"
          />
          
          <UserManagement />
        </ResponsiveContainer>
      </section>
    </ProtectedRoute>
  );

  const handleLoginRequest = () => {
    setShowLogin(true);
  };

  // Si se solicita mostrar login, mostrar HomePage
  if (showLogin) {
    return <HomePage />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Cargando aplicación...</span>
        </div>
      </div>
    );
  }

  const isAuthenticated = Boolean(user);

  return (
    <>
      <ScrollProgress />
      <SidebarProvider>
        <AppSidebar 
          onSectionChange={scrollToSection} 
          activeSection={activeSection}
          isAuthenticated={isAuthenticated}
          onLoginRequest={handleLoginRequest}
        />
        <SidebarInset>
          <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10">
            <div className="flex items-center gap-2 px-3 sm:px-4 w-full">
              <SidebarTrigger className="-ml-1 flex-shrink-0" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4 hidden sm:block"
              />
              <Breadcrumb className="min-w-0 flex-1">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm sm:text-base">
                      <span className="truncate">
                        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}
                      </span>
                      {!isAuthenticated && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full hidden sm:inline">
                          Modo Visitante
                        </span>
                      )}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              {/* Indicador de permisos en el header */}
              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <RoleBadge showIcon={false} className="hidden sm:flex" />
                )}
                {!isAuthenticated && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full sm:hidden flex-shrink-0">
                    Visitante
                  </span>
                )}
              </div>
            </div>
          </header>
          
          <div className="flex-1">
            {renderDashboardSection()}
            {renderBibliotecaSection()}
            {renderCicloVidaSection()}
            {renderAnaliticaSection()}
            {renderAdminSection()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default function App() {
  return (
    <AuthWrapper>
      <AppContent />
    </AuthWrapper>
  );
}