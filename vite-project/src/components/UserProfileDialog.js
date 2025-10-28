"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileDialog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var dialog_1 = require("@/components/ui/dialog");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var avatar_1 = require("@/components/ui/avatar");
var separator_1 = require("@/components/ui/separator");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var permissions_1 = require("@/types/permissions");
var lucide_react_1 = require("lucide-react");
var UserProfileDialog = function (_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var user = (0, PermissionsContext_1.usePermissions)().user;
    if (!user) {
        return null;
    }
    // Función para formatear el rol
    var formatRole = function (role) {
        var _a;
        var roleLabels = (_a = {},
            _a[permissions_1.UserRole.SUPER_ADMIN] = "Super Administrador",
            _a[permissions_1.UserRole.ADMIN] = "Administrador",
            _a[permissions_1.UserRole.COORDINATOR] = "Coordinador",
            _a[permissions_1.UserRole.PROFESSOR] = "Profesor",
            _a[permissions_1.UserRole.STUDENT] = "Estudiante",
            _a[permissions_1.UserRole.VIEWER] = "Visitante",
            _a);
        return roleLabels[role] || role;
    };
    // Función para obtener el color del rol
    var getRoleColor = function (role) {
        var _a;
        var colors = (_a = {},
            _a[permissions_1.UserRole.SUPER_ADMIN] = "destructive",
            _a[permissions_1.UserRole.ADMIN] = "destructive",
            _a[permissions_1.UserRole.COORDINATOR] = "default",
            _a[permissions_1.UserRole.PROFESSOR] = "secondary",
            _a[permissions_1.UserRole.STUDENT] = "outline",
            _a[permissions_1.UserRole.VIEWER] = "outline",
            _a);
        return colors[role] || "outline";
    };
    // Función para formatear permisos de forma legible
    var formatPermission = function (permission) {
        var _a;
        var permissionLabels = (_a = {},
            _a[permissions_1.Permission.VIEW_DASHBOARD] = "Ver Dashboard",
            _a[permissions_1.Permission.VIEW_ANALYTICS] = "Ver Analítica",
            _a[permissions_1.Permission.VIEW_DETAILED_ANALYTICS] = "Ver Analítica Detallada",
            _a[permissions_1.Permission.VIEW_DATA_LIBRARY] = "Ver Biblioteca de Datos",
            _a[permissions_1.Permission.IMPORT_DATA] = "Importar Datos",
            _a[permissions_1.Permission.EXPORT_DATA] = "Exportar Datos",
            _a[permissions_1.Permission.EDIT_DATA] = "Editar Datos",
            _a[permissions_1.Permission.DELETE_DATA] = "Eliminar Datos",
            _a[permissions_1.Permission.VIEW_LIFECYCLE] = "Ver Ciclo de Vida",
            _a[permissions_1.Permission.MANAGE_LIFECYCLE] = "Gestionar Ciclo de Vida",
            _a[permissions_1.Permission.MANAGE_USERS] = "Gestionar Usuarios",
            _a[permissions_1.Permission.MANAGE_ROLES] = "Gestionar Roles",
            _a[permissions_1.Permission.VIEW_USER_LIST] = "Ver Lista de Usuarios",
            _a[permissions_1.Permission.MANAGE_SETTINGS] = "Gestionar Configuración",
            _a[permissions_1.Permission.VIEW_SETTINGS] = "Ver Configuración",
            _a[permissions_1.Permission.GENERATE_REPORTS] = "Generar Reportes",
            _a[permissions_1.Permission.VIEW_REPORTS] = "Ver Reportes",
            _a[permissions_1.Permission.CREATE_EVALUATIONS] = "Crear Evaluaciones",
            _a[permissions_1.Permission.VIEW_EVALUATIONS] = "Ver Evaluaciones",
            _a[permissions_1.Permission.EDIT_EVALUATIONS] = "Editar Evaluaciones",
            _a[permissions_1.Permission.APPROVE_PRACTICES] = "Aprobar Prácticas",
            _a[permissions_1.Permission.MANAGE_PRACTICES] = "Gestionar Prácticas",
            _a[permissions_1.Permission.VIEW_PRACTICES] = "Ver Prácticas",
            _a);
        return permissionLabels[permission] || permission;
    };
    // Agrupar permisos por categoría
    var groupPermissions = function (permissions) {
        var groups = {
            "Dashboard y Analítica": [
                permissions_1.Permission.VIEW_DASHBOARD,
                permissions_1.Permission.VIEW_ANALYTICS,
                permissions_1.Permission.VIEW_DETAILED_ANALYTICS,
            ],
            "Biblioteca de Datos": [
                permissions_1.Permission.VIEW_DATA_LIBRARY,
                permissions_1.Permission.IMPORT_DATA,
                permissions_1.Permission.EXPORT_DATA,
                permissions_1.Permission.EDIT_DATA,
                permissions_1.Permission.DELETE_DATA,
            ],
            "Ciclo de Vida": [
                permissions_1.Permission.VIEW_LIFECYCLE,
                permissions_1.Permission.MANAGE_LIFECYCLE,
            ],
            "Administración": [
                permissions_1.Permission.MANAGE_USERS,
                permissions_1.Permission.MANAGE_ROLES,
                permissions_1.Permission.VIEW_USER_LIST,
                permissions_1.Permission.MANAGE_SETTINGS,
                permissions_1.Permission.VIEW_SETTINGS,
            ],
            "Reportes": [
                permissions_1.Permission.GENERATE_REPORTS,
                permissions_1.Permission.VIEW_REPORTS,
            ],
            "Evaluaciones": [
                permissions_1.Permission.CREATE_EVALUATIONS,
                permissions_1.Permission.VIEW_EVALUATIONS,
                permissions_1.Permission.EDIT_EVALUATIONS,
            ],
            "Prácticas Profesionales": [
                permissions_1.Permission.APPROVE_PRACTICES,
                permissions_1.Permission.MANAGE_PRACTICES,
                permissions_1.Permission.VIEW_PRACTICES,
            ],
        };
        var result = {};
        Object.entries(groups).forEach(function (_a) {
            var category = _a[0], categoryPermissions = _a[1];
            var userPermissionsInCategory = categoryPermissions.filter(function (p) {
                return permissions.includes(p);
            });
            if (userPermissionsInCategory.length > 0) {
                result[category] = userPermissionsInCategory;
            }
        });
        return result;
    };
    var groupedPermissions = groupPermissions(user.permissions);
    return ((0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-2xl max-h-[80vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserIcon, { className: "h-5 w-5" }), "Mi Perfil"] }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: "Informaci\u00F3n de tu cuenta y permisos del sistema" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Informaci\u00F3n Personal" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)(avatar_1.Avatar, { className: "h-16 w-16", children: [(0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: user.photoURL || '', alt: user.displayName || user.email }), (0, jsx_runtime_1.jsx)(avatar_1.AvatarFallback, { className: "text-lg", children: user.displayName ?
                                                            user.displayName.split(' ').map(function (n) { return n[0]; }).join('').toUpperCase() :
                                                            user.email.charAt(0).toUpperCase() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserIcon, { className: "h-4 w-4 text-muted-foreground" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: user.displayName || 'Sin nombre configurado' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MailIcon, { className: "h-4 w-4 text-muted-foreground" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-muted-foreground", children: user.email })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CalendarIcon, { className: "h-4 w-4 text-muted-foreground" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-muted-foreground", children: ["Miembro desde ", user.createdAt.toLocaleDateString('es-ES', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })] })] })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "text-lg flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldIcon, { className: "h-5 w-5" }), "Estado de la Cuenta"] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Rol:" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getRoleColor(user.role), children: formatRole(user.role) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Estado:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1", children: user.isActive ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircleIcon, { className: "h-4 w-4 text-green-500" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-green-700 border-green-200", children: "Activo" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.XCircleIcon, { className: "h-4 w-4 text-red-500" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-red-700 border-red-200", children: "Inactivo" })] })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "ID de Usuario:" }), (0, jsx_runtime_1.jsxs)("code", { className: "text-xs bg-muted px-2 py-1 rounded", children: [user.uid.slice(0, 8), "..."] })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "text-lg", children: ["Permisos del Sistema (", user.permissions.length, ")"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Lista de acciones que puedes realizar en el sistema" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-4", children: Object.entries(groupedPermissions).map(function (_a) {
                                        var category = _a[0], permissions = _a[1];
                                        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-sm mb-2 text-muted-foreground", children: category }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4", children: permissions.map(function (permission) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-muted/50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircleIcon, { className: "h-4 w-4 text-green-500 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: formatPermission(permission) })] }, permission)); }) }), Object.keys(groupedPermissions).indexOf(category) <
                                                    Object.keys(groupedPermissions).length - 1 && ((0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "my-3" }))] }, category));
                                    }) })] })] })] }) }));
};
exports.UserProfileDialog = UserProfileDialog;
