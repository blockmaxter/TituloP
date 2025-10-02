import { AppSidebar } from "@/components/app-sidebar"
import { DataTableBiblioteca } from "@/components/data-table-biblioteca"
import { MetricCard, MetricGrid } from "@/components/ui/metric-card"
import { ResponsiveContainer, SectionHeader } from "@/components/ui/responsive-layout"
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
            title="Total de Registros"
            value="12,847"
            description="+20.1% desde el mes pasado"
            trend="up"
            trendValue="20.1%"
          />
          <MetricCard
            title="Procesos Activos"
            value="89"
            description="15 completados hoy"
            trend="neutral"
          />
          <MetricCard
            title="Estado del Sistema"
            value="Operativo"
            description="99.9% de disponibilidad"
            trend="up"
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
                    <p className="text-sm font-medium">Nuevo registro procesado</p>
                    <p className="text-xs text-muted-foreground">Hace 2 minutos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Análisis completado</p>
                    <p className="text-xs text-muted-foreground">Hace 15 minutos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Backup programado</p>
                    <p className="text-xs text-muted-foreground">Hace 1 hora</p>
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
                    <span>CPU</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Memoria</span>
                    <span>62%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '62%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Almacenamiento</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tendencias de Datos</CardTitle>
            <CardDescription>Análisis temporal del rendimiento</CardDescription>
          </CardHeader>
          <CardContent className="h-80 sm:h-96">
            <ChartAreaInteractive />
          </CardContent>
        </Card>
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
    <section id="ciclo-vida" className="min-h-screen py-8 bg-muted/30 animate-in fade-in duration-700">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Ciclo de Vida</h2>
          <p className="text-muted-foreground">Gestión y seguimiento del ciclo de vida de datos</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Estados del Proceso</CardTitle>
              <CardDescription>Fases actuales del ciclo de vida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Recolección</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completado</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Datos recolectados y validados</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Procesamiento</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">En Progreso</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Transformación y limpieza de datos</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Análisis</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pendiente</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Análisis estadístico y patrones</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Archivado</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Programado</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Almacenamiento a largo plazo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cronograma del Proyecto</CardTitle>
              <CardDescription>Planificación temporal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Progreso General</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full" style={{width: '68%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Inicio del proyecto</span>
                    <span className="text-sm text-muted-foreground">01/09/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fase actual</span>
                    <span className="text-sm font-medium text-blue-600">Procesamiento</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Próximo hito</span>
                    <span className="text-sm text-muted-foreground">15/10/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Entrega final</span>
                    <span className="text-sm text-muted-foreground">15/12/2025</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Versiones</CardTitle>
            <CardDescription>Control de versiones y actualizaciones del dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Versión Actual</h4>
                <div className="text-2xl font-bold text-blue-600">v2.3.1</div>
                <p className="text-sm text-muted-foreground">Actualizada hace 2 días</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Cambios Pendientes</h4>
                <div className="text-2xl font-bold text-orange-600">47</div>
                <p className="text-sm text-muted-foreground">Revisiones en cola</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Próxima Versión</h4>
                <div className="text-2xl font-bold text-green-600">v2.4.0</div>
                <p className="text-sm text-muted-foreground">Estimada para el 20/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );

  const renderAnaliticaSection = () => (
    <section id="analitica" className="min-h-screen py-8 animate-in fade-in duration-700">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Analítica</h2>
          <p className="text-muted-foreground">Análisis avanzado y métricas de rendimiento</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Registros Procesados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">847,392</div>
              <p className="text-xs text-green-600">+12.5% esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Precisión del Modelo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.7%</div>
              <p className="text-xs text-blue-600">+2.1% vs mes anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tiempo de Procesamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2s</div>
              <p className="text-xs text-green-600">-15% optimización</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Anomalías Detectadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-orange-600">+3 desde ayer</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Datos</CardTitle>
              <CardDescription>Análisis por categorías principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Categoría A</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Categoría B</span>
                    <span>30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Categoría C</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencias Temporales</CardTitle>
              <CardDescription>Patrones de uso por hora</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pico matutino</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">09:00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Actividad media</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">14:00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pico vespertino</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">18:00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Actividad nocturna</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">02:00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Calidad de Datos</CardTitle>
              <CardDescription>Métricas de integridad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">98.5%</div>
                  <p className="text-sm text-muted-foreground">Completitud</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Registros válidos</span>
                    <span className="text-xs">99.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Duplicados</span>
                    <span className="text-xs">0.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Valores nulos</span>
                    <span className="text-xs">1.5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rendimiento del Sistema</CardTitle>
              <CardDescription>Métricas operativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">99.9%</div>
                  <p className="text-sm text-muted-foreground">Disponibilidad</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Latencia promedio</span>
                    <span className="text-xs">45ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Throughput</span>
                    <span className="text-xs">1.2K req/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Tasa de error</span>
                    <span className="text-xs">0.1%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Predicciones</CardTitle>
              <CardDescription>Modelos predictivos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">87.3%</div>
                  <p className="text-sm text-muted-foreground">Confianza</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Precisión del modelo</span>
                    <span className="text-xs">94.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Recall</span>
                    <span className="text-xs">91.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">F1-Score</span>
                    <span className="text-xs">92.9%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Análisis de Tendencias</CardTitle>
            <CardDescription>Evolución temporal de las métricas principales</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartAreaInteractive />
          </CardContent>
        </Card>
      </div>
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
