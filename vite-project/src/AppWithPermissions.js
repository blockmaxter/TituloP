"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var jsx_runtime_1 = require("react/jsx-runtime");
var app_sidebar_1 = require("@/components/app-sidebar");
var data_table_biblioteca_1 = require("@/components/data-table-biblioteca");
var metric_card_1 = require("@/components/ui/metric-card");
var responsive_layout_1 = require("@/components/ui/responsive-layout");
var estudiantes_carrera_chart_1 = require("@/components/charts/estudiantes-carrera-chart");
var evaluaciones_chart_1 = require("@/components/charts/evaluaciones-chart");
var practicas_tendencia_chart_1 = require("@/components/charts/practicas-tendencia-chart");
var notas_practica_chart_1 = require("@/components/charts/notas-practica-chart");
var contrataciones_chart_1 = require("@/components/charts/contrataciones-chart");
var estudiantes_comuna_chart_1 = require("@/components/charts/estudiantes-comuna-chart");
var estado_practicas_chart_1 = require("@/components/charts/estado-practicas-chart");
var timeline_practicas_chart_1 = require("@/components/charts/timeline-practicas-chart");
var duracion_practicas_chart_1 = require("@/components/charts/duracion-practicas-chart");
var seguimiento_practicas_chart_1 = require("@/components/charts/seguimiento-practicas-chart");
var react_1 = require("react");
var breadcrumb_1 = require("@/components/ui/breadcrumb");
var separator_1 = require("@/components/ui/separator");
var sidebar_1 = require("@/components/ui/sidebar");
var card_1 = require("@/components/ui/card");
var chart_area_interactive_1 = require("@/components/chart-area-interactive");
var scroll_progress_1 = require("@/components/scroll-progress");
var floating_nav_1 = require("@/components/floating-nav");
var ProtectedRoute_1 = require("@/components/ProtectedRoute");
var UserPermissionIndicators_1 = require("@/components/UserPermissionIndicators");
var UserManagement_1 = require("@/components/admin/UserManagement");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var permissions_1 = require("@/types/permissions");
var AuthWrapper_1 = require("@/components/AuthWrapper");
var index_1 = require("./pages/index");
function AppContent() {
    var _a = (0, react_1.useState)("dashboard"), activeSection = _a[0], setActiveSection = _a[1];
    var _b = (0, react_1.useState)(false), showLogin = _b[0], setShowLogin = _b[1];
    var _c = (0, PermissionsContext_1.usePermissions)(), user = _c.user, loading = _c.loading;
    // Intersection Observer para detectar sección activa
    (0, react_1.useEffect)(function () {
        var observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0.1
        };
        var observerCallback = function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };
        var observer = new IntersectionObserver(observerCallback, observerOptions);
        // Observar todas las secciones
        var sections = ['dashboard', 'biblioteca-de-datos', 'ciclo-vida', 'analitica', 'admin'];
        sections.forEach(function (sectionId) {
            var element = document.getElementById(sectionId);
            if (element) {
                observer.observe(element);
            }
        });
        return function () {
            sections.forEach(function (sectionId) {
                var element = document.getElementById(sectionId);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, []);
    var scrollToSection = function (sectionId) {
        var element = document.getElementById(sectionId);
        if (element) {
            var offset = 80;
            var elementPosition = element.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };
    var renderDashboardSection = function () { return ((0, jsx_runtime_1.jsx)(ProtectedRoute_1.ProtectedRoute, { requiredPermissions: [permissions_1.Permission.VIEW_DASHBOARD], showError: false, children: (0, jsx_runtime_1.jsx)("section", { id: "dashboard", className: "min-h-screen py-8", children: (0, jsx_runtime_1.jsxs)(responsive_layout_1.ResponsiveContainer, { children: [(0, jsx_runtime_1.jsx)(responsive_layout_1.SectionHeader, { title: "Dashboard Ejecutivo", description: "Vista general del estado de las pr\u00E1cticas profesionales y estudiantes" }), (0, jsx_runtime_1.jsxs)(metric_card_1.MetricGrid, { className: "mb-8", children: [(0, jsx_runtime_1.jsx)(metric_card_1.MetricCard, { title: "Estudiantes Activos", value: "1,247", change: +12.5, description: "Estudiantes con pr\u00E1ctica en curso" }), (0, jsx_runtime_1.jsx)(metric_card_1.MetricCard, { title: "Empresas Colaboradoras", value: "89", change: +8.2, description: "Empresas con convenio activo" }), (0, jsx_runtime_1.jsx)(metric_card_1.MetricCard, { title: "Pr\u00E1cticas Finalizadas", value: "342", change: +15.3, description: "Pr\u00E1cticas completadas este semestre" }), (0, jsx_runtime_1.jsx)(metric_card_1.MetricCard, { title: "Nota Promedio", value: "6.2", change: +2.1, description: "Calificaci\u00F3n promedio de pr\u00E1cticas" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid lg:grid-cols-2 gap-6 mb-8", children: [(0, jsx_runtime_1.jsx)(estudiantes_carrera_chart_1.EstudiantesPorCarreraChart, {}), (0, jsx_runtime_1.jsx)(evaluaciones_chart_1.EvaluacionesChart, {})] }), (0, jsx_runtime_1.jsx)(ProtectedRoute_1.ProtectedRoute, { requiredPermissions: [permissions_1.Permission.VIEW_DETAILED_ANALYTICS], fallback: null, children: (0, jsx_runtime_1.jsxs)("div", { className: "grid lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(practicas_tendencia_chart_1.PracticasTendenciaChart, {}), (0, jsx_runtime_1.jsx)(notas_practica_chart_1.NotasPracticaChart, {})] }) })] }) }) })); };
    var renderBibliotecaSection = function () { return ((0, jsx_runtime_1.jsx)(ProtectedRoute_1.ProtectedRoute, { requiredPermissions: [permissions_1.Permission.VIEW_DATA_LIBRARY], showError: false, children: (0, jsx_runtime_1.jsx)("section", { id: "biblioteca-de-datos", className: "min-h-screen py-8 bg-muted/30", children: (0, jsx_runtime_1.jsxs)(responsive_layout_1.ResponsiveContainer, { children: [(0, jsx_runtime_1.jsx)(responsive_layout_1.SectionHeader, { title: "Biblioteca de Datos", description: "Gesti\u00F3n y an\u00E1lisis de informaci\u00F3n de estudiantes y pr\u00E1cticas" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid lg:grid-cols-3 gap-6 mb-8", children: [(0, jsx_runtime_1.jsx)(contrataciones_chart_1.ContratacionesChart, {}), (0, jsx_runtime_1.jsx)(estudiantes_comuna_chart_1.EstudiantesPorComunaChart, {}), (0, jsx_runtime_1.jsx)(estado_practicas_chart_1.EstadoPracticasChart, {})] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Tabla de Datos de Estudiantes" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Vista detallada de estudiantes y sus pr\u00E1cticas profesionales" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(data_table_biblioteca_1.DataTableBiblioteca, {}) })] })] }) }) })); };
    var renderCicloVidaSection = function () { return ((0, jsx_runtime_1.jsx)(ProtectedRoute_1.ProtectedRoute, { requiredPermissions: [permissions_1.Permission.VIEW_LIFECYCLE], showError: false, children: (0, jsx_runtime_1.jsx)("section", { id: "ciclo-vida", className: "min-h-screen py-8", children: (0, jsx_runtime_1.jsxs)(responsive_layout_1.ResponsiveContainer, { children: [(0, jsx_runtime_1.jsx)(responsive_layout_1.SectionHeader, { title: "Ciclo de Vida de Pr\u00E1cticas", description: "Seguimiento temporal y evolutivo de las pr\u00E1cticas profesionales" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid lg:grid-cols-2 gap-6 mb-8", children: [(0, jsx_runtime_1.jsx)(timeline_practicas_chart_1.TimelinePracticasChart, {}), (0, jsx_runtime_1.jsx)(duracion_practicas_chart_1.DuracionPracticasChart, {})] }), (0, jsx_runtime_1.jsx)("div", { className: "grid lg:grid-cols-1 gap-6", children: (0, jsx_runtime_1.jsx)(seguimiento_practicas_chart_1.SeguimientoPracticasChart, {}) })] }) }) })); };
    var renderAnaliticaSection = function () { return ((0, jsx_runtime_1.jsx)(ProtectedRoute_1.ProtectedRoute, { requiredPermissions: [permissions_1.Permission.VIEW_ANALYTICS], showError: false, children: (0, jsx_runtime_1.jsx)("section", { id: "analitica", className: "min-h-screen py-8 bg-muted/30", children: (0, jsx_runtime_1.jsxs)(responsive_layout_1.ResponsiveContainer, { children: [(0, jsx_runtime_1.jsx)(responsive_layout_1.SectionHeader, { title: "Anal\u00EDtica Avanzada", description: "Insights profundos y tendencias de las pr\u00E1cticas profesionales" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "An\u00E1lisis Interactivo de Tendencias" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Explora las tendencias y patrones en los datos de pr\u00E1cticas profesionales" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_area_interactive_1.ChartAreaInteractive, {}) })] }), (0, jsx_runtime_1.jsx)(ProtectedRoute_1.ProtectedRoute, { requiredPermissions: [permissions_1.Permission.VIEW_DETAILED_ANALYTICS], fallback: (0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-2", children: "Anal\u00EDtica Detallada" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Necesitas permisos adicionales para ver los an\u00E1lisis detallados." })] }) }) }), children: (0, jsx_runtime_1.jsxs)("div", { className: "grid lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Predicciones de Rendimiento" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Modelos predictivos basados en datos hist\u00F3ricos" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "h-64 flex items-center justify-center text-muted-foreground", children: "Gr\u00E1fico de predicciones (pr\u00F3ximamente)" }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "An\u00E1lisis de Correlaciones" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Relaciones entre variables acad\u00E9micas y laborales" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "h-64 flex items-center justify-center text-muted-foreground", children: "Matriz de correlaci\u00F3n (pr\u00F3ximamente)" }) })] })] }) })] })] }) }) })); };
    var renderAdminSection = function () { return ((0, jsx_runtime_1.jsx)(ProtectedRoute_1.ProtectedRoute, { requiredPermissions: [permissions_1.Permission.MANAGE_USERS], showError: false, children: (0, jsx_runtime_1.jsx)("section", { id: "admin", className: "min-h-screen py-8", children: (0, jsx_runtime_1.jsxs)(responsive_layout_1.ResponsiveContainer, { children: [(0, jsx_runtime_1.jsx)(responsive_layout_1.SectionHeader, { title: "Administraci\u00F3n", description: "Gesti\u00F3n de usuarios, roles y permisos del sistema" }), (0, jsx_runtime_1.jsx)(UserManagement_1.UserManagement, {})] }) }) })); };
    var handleLoginRequest = function () {
        setShowLogin(true);
    };
    // Si se solicita mostrar login, mostrar HomePage
    if (showLogin) {
        return (0, jsx_runtime_1.jsx)(index_1.default, {});
    }
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-screen", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }), (0, jsx_runtime_1.jsx)("span", { children: "Cargando aplicaci\u00F3n..." })] }) }));
    }
    var isAuthenticated = Boolean(user);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(scroll_progress_1.ScrollProgress, {}), (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarProvider, { children: [(0, jsx_runtime_1.jsx)(app_sidebar_1.AppSidebar, { onSectionChange: scrollToSection, activeSection: activeSection, isAuthenticated: isAuthenticated, onLoginRequest: handleLoginRequest }), (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarInset, { children: [(0, jsx_runtime_1.jsx)("header", { className: "flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 px-3 sm:px-4 w-full", children: [(0, jsx_runtime_1.jsx)(sidebar_1.SidebarTrigger, { className: "-ml-1 flex-shrink-0" }), (0, jsx_runtime_1.jsx)(separator_1.Separator, { orientation: "vertical", className: "mr-2 data-[orientation=vertical]:h-4 hidden sm:block" }), (0, jsx_runtime_1.jsx)(breadcrumb_1.Breadcrumb, { className: "min-w-0 flex-1", children: (0, jsx_runtime_1.jsx)(breadcrumb_1.BreadcrumbList, { children: (0, jsx_runtime_1.jsx)(breadcrumb_1.BreadcrumbItem, { children: (0, jsx_runtime_1.jsxs)(breadcrumb_1.BreadcrumbPage, { className: "text-sm sm:text-base", children: [(0, jsx_runtime_1.jsx)("span", { className: "truncate", children: activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ') }), !isAuthenticated && ((0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full hidden sm:inline", children: "Modo Visitante" }))] }) }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [isAuthenticated && ((0, jsx_runtime_1.jsx)(UserPermissionIndicators_1.RoleBadge, { showIcon: false, className: "hidden sm:flex" })), !isAuthenticated && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full sm:hidden flex-shrink-0", children: "Visitante" }))] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [renderDashboardSection(), renderBibliotecaSection(), renderCicloVidaSection(), renderAnaliticaSection(), renderAdminSection()] }), (0, jsx_runtime_1.jsx)(floating_nav_1.FloatingNav, { activeSection: activeSection, onSectionChange: scrollToSection })] })] })] }));
}
function App() {
    return ((0, jsx_runtime_1.jsx)(AuthWrapper_1.default, { children: (0, jsx_runtime_1.jsx)(AppContent, {}) }));
}
