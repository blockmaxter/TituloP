import { AppSidebar } from "@/components/app-sidebar"
import { DataTableBiblioteca } from "@/components/data-table-biblioteca"
import { MetricCard, MetricGrid } from "@/components/ui/metric-card"
import { ResponsiveContainer, SectionHeader } from "@/components/ui/responsive-layout"
import { EstudiantesPorCarreraChart } from "@/components/charts/estudiantes-carrera-chart"
import { EvaluacionesChart } from "@/components/charts/evaluaciones-chart"
import { PracticasTendenciaChart } from "@/components/charts/practicas-tendencia-chart"
import { NotasPracticaChart } from "@/components/charts/notas-practica-chart"
import { ContratacionesChart } from "@/components/charts/contrataciones-chart"
import { EstudiantesPorComunaChart } from "@/components/charts/estudiantes-comuna-chart"
import { EstadoPracticasChart } from "@/components/charts/estado-practicas-chart"
import { TimelinePracticasChart } from "@/components/charts/timeline-practicas-chart"
import { DuracionPracticasChart } from "@/components/charts/duracion-practicas-chart"
import { SeguimientoPracticasChart } from "@/components/charts/seguimiento-practicas-chart"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ScrollProgress } from "@/components/scroll-progress"
import { FloatingNav } from "@/components/floating-nav"
import HomePage from "./pages/index";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("firebaseUser")));
  const [showLogin, setShowLogin] = useState(false);

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
    const sections = ['dashboard', 'biblioteca-de-datos', 'ciclo-vida', 'analitica'];
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const renderDashboardSection = () => (
    <section id="dashboard" className="min-h-screen py-4 sm:py-8 animate-in fade-in duration-700">
      <ResponsiveContainer>
        <SectionHeader
          title="Dashboard"
          description="Resumen general del sistema y métricas principales"
        />
        
        <MetricGrid className="mb-6 sm:mb-8">
          <MetricCard
            title="Estudiantes en Práctica"
            value="120"
            description="Semestre actual"
            trend="up"
            trendValue="8.5%"
          />
          <MetricCard
            title="Empresas Asociadas"
            value="78"
            description="En programa activo"
            trend="up"
            trendValue="12.3%"
          />
          <MetricCard
            title="Evaluaciones Enviadas"
            value="65%"
            description="78 de 120 completadas"
            trend="neutral"
          />
          <MetricCard
            title="Promedio de Notas"
            value="5.8"
            description="Escala 1.0 - 7.0"
            trend="up"
            trendValue="0.2"
            className="text-green-600"
          />
        </MetricGrid>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo estudiante registrado</p>
                    <p className="text-xs text-muted-foreground">Juan Pérez - Hace 2 minutos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Evaluación recibida</p>
                    <p className="text-xs text-muted-foreground">Tech Solutions SpA - Hace 15 minutos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Práctica finalizada</p>
                    <p className="text-xs text-muted-foreground">María González - Hace 1 hora</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nueva empresa registrada</p>
                    <p className="text-xs text-muted-foreground">Digital Innovations - Hace 3 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Métricas del Sistema</CardTitle>
              <CardDescription>Rendimiento en tiempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Progreso Semestral</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Evaluaciones Completadas</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Satisfacción Empresas</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-6 sm:mb-8">
          <PracticasTendenciaChart />
          <EvaluacionesChart />
        </div>
        
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <EstudiantesPorCarreraChart />
          <NotasPracticaChart />
          <ContratacionesChart />
        </div>
      </ResponsiveContainer>
    </section>
  );

  const renderBibliotecaSection = () => (
    <section id="biblioteca-de-datos" className="min-h-screen py-4 sm:py-8 bg-muted/20 animate-in fade-in duration-700">
      <ResponsiveContainer>
        <SectionHeader
          title="Biblioteca de Datos"
          description="Gestión de datos de estudiantes en práctica profesional"
        />
        
        <DataTableBiblioteca />
      </ResponsiveContainer>
    </section>
  );

  const renderCicloVidaSection = () => (
    <section id="ciclo-vida" className="min-h-screen py-4 sm:py-8 bg-muted/30 animate-in fade-in duration-700">
      <ResponsiveContainer>
        <SectionHeader
          title="Ciclo de Vida de Prácticas Profesionales"
          description="Seguimiento completo del proceso de prácticas desde inscripción hasta finalización"
        />

        <MetricGrid className="mb-6 sm:mb-8">
          <MetricCard
            title="Duración Promedio"
            value="5.8 meses"
            description="Tiempo promedio de práctica"
            trend="neutral"
          />
          <MetricCard
            title="Tasa de Finalización"
            value="94.8%"
            description="Prácticas completadas exitosamente"
            trend="up"
            trendValue="3.2%"
          />
          <MetricCard
            title="Tiempo Promedio de Asignación"
            value="18 días"
            description="Desde inscripción hasta inicio"
            trend="down"
            trendValue="5 días"
          />
          <MetricCard
            title="Índice de Satisfacción"
            value="4.7/5.0"
            description="Evaluación del proceso"
            trend="up"
            trendValue="0.1"
            className="text-green-600"
          />
        </MetricGrid>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
          <EstadoPracticasChart />
          <TimelinePracticasChart />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
          <DuracionPracticasChart />
          <SeguimientoPracticasChart />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Proceso de Prácticas</CardTitle>
              <CardDescription>Etapas del ciclo de vida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">1. Inscripción y Postulación</div>
                    <div className="text-xs text-muted-foreground">Registro inicial del estudiante</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">2. Asignación de Empresa</div>
                    <div className="text-xs text-muted-foreground">Matching estudiante-empresa</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">3. Inicio de Práctica</div>
                    <div className="text-xs text-muted-foreground">Inducción y primera semana</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">4. Desarrollo y Seguimiento</div>
                    <div className="text-xs text-muted-foreground">Supervisión continua</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">5. Evaluación y Cierre</div>
                    <div className="text-xs text-muted-foreground">Evaluación final y certificación</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cronograma Semestral</CardTitle>
              <CardDescription>Calendario de actividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Progreso Semestre Actual</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Inscripciones abiertas</span>
                    <span className="text-muted-foreground">Mar - Ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Período de prácticas</span>
                    <span className="text-muted-foreground">Abr - Nov</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evaluaciones finales</span>
                    <span className="text-muted-foreground">Oct - Dic</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cierre semestral</span>
                    <span className="text-muted-foreground">15 Dic</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Calidad</CardTitle>
              <CardDescription>Métricas de rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">96.7%</div>
                  <div className="text-sm text-muted-foreground">Tasa de aprobación</div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Promedio de notas</span>
                    <span className="font-medium">6.2/7.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evaluaciones a tiempo</span>
                    <span className="font-medium">89.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfacción empresas</span>
                    <span className="font-medium">4.6/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contratación post-práctica</span>
                    <span className="font-medium">45.2%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ResponsiveContainer>
    </section>
  );

  const renderAnaliticaSection = () => (
    <section id="analitica" className="min-h-screen py-4 sm:py-8 animate-in fade-in duration-700">
      <ResponsiveContainer>
        <SectionHeader
          title="Analítica de Prácticas Profesionales"
          description="Análisis estadístico y métricas de rendimiento del programa"
        />

        <MetricGrid className="mb-6 sm:mb-8">
          <MetricCard
            title="Tasa de Aprobación"
            value="96.7%"
            description="Estudiantes aprobados"
            trend="up"
            trendValue="2.1%"
          />
          <MetricCard
            title="Promedio de Horas"
            value="720"
            description="Horas de práctica completadas"
            trend="neutral"
          />
          <MetricCard
            title="Inserción Laboral"
            value="45%"
            description="Contratados post-práctica"
            trend="up"
            trendValue="8.3%"
          />
          <MetricCard
            title="Satisfacción Empresarial"
            value="4.6/5.0"
            description="Evaluación promedio"
            trend="up"
            trendValue="0.3"
            className="text-green-600"
          />
        </MetricGrid>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
          <EstudiantesPorComunaChart />
          <EvaluacionesChart />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
          <PracticasTendenciaChart />
          <NotasPracticaChart />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <ContratacionesChart />
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Indicadores Clave</CardTitle>
                <CardDescription>Métricas principales del programa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso Semestral</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cumplimiento de Objetivos</span>
                      <span>88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '88%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Calidad de Supervisión</span>
                      <span>91%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '91%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );

  const handleLoginRequest = () => {
    setShowLogin(true);
  };

  // Si se solicita mostrar login, mostrar HomePage
  if (showLogin) {
    return <HomePage />;
  }

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
            {!isAuthenticated && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full sm:hidden flex-shrink-0">
                Visitante
              </span>
            )}
          </div>
        </header>
        <div className="flex-1">
          {renderDashboardSection()}
          {renderBibliotecaSection()}
          {renderCicloVidaSection()}
          {renderAnaliticaSection()}
        </div>
        <FloatingNav 
          activeSection={activeSection}
          onSectionChange={scrollToSection}
        />
      </SidebarInset>
    </SidebarProvider>
    </>
  );
}
