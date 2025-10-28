"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionsSummary = exports.PermissionIndicator = exports.RoleBadge = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var permissions_1 = require("@/types/permissions");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var ROLE_CONFIG = (_a = {},
    _a[permissions_1.UserRole.SUPER_ADMIN] = {
        label: 'Super Admin',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: lucide_react_1.Crown,
        description: 'Acceso completo al sistema'
    },
    _a[permissions_1.UserRole.ADMIN] = {
        label: 'Administrador',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: lucide_react_1.ShieldCheck,
        description: 'Gestión administrativa completa'
    },
    _a[permissions_1.UserRole.COORDINATOR] = {
        label: 'Coordinador',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: lucide_react_1.Users,
        description: 'Coordinación de prácticas y estudiantes'
    },
    _a[permissions_1.UserRole.PROFESSOR] = {
        label: 'Profesor',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: lucide_react_1.GraduationCap,
        description: 'Gestión académica y evaluaciones'
    },
    _a[permissions_1.UserRole.STUDENT] = {
        label: 'Estudiante',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: lucide_react_1.BookOpen,
        description: 'Acceso a información académica'
    },
    _a[permissions_1.UserRole.VIEWER] = {
        label: 'Visitante',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: lucide_react_1.Eye,
        description: 'Solo lectura'
    },
    _a);
var RoleBadge = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.showIcon, showIcon = _c === void 0 ? true : _c, _d = _a.showPermissionCount, showPermissionCount = _d === void 0 ? false : _d;
    var user = (0, PermissionsContext_1.usePermissions)().user;
    if (!user)
        return null;
    var config = ROLE_CONFIG[user.role];
    var Icon = config.icon;
    return ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "".concat(config.color, " ").concat(className, " flex items-center gap-1"), children: [showIcon && (0, jsx_runtime_1.jsx)(Icon, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: config.label }), showPermissionCount && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs opacity-75", children: ["(", user.permissions.length, ")"] }))] }));
};
exports.RoleBadge = RoleBadge;
var PermissionIndicator = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, PermissionsContext_1.usePermissions)(), user = _c.user, loading = _c.loading;
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 ".concat(className), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4 animate-pulse text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500", children: "Verificando..." })] }));
    }
    if (!user) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 ".concat(className), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldX, { className: "h-4 w-4 text-red-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-red-600", children: "Sin autenticar" })] }));
    }
    var config = ROLE_CONFIG[user.role];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 ".concat(className), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4 text-green-500" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: user.displayName || user.email }), (0, jsx_runtime_1.jsx)(exports.RoleBadge, { showIcon: false })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: config.description })] })] }));
};
exports.PermissionIndicator = PermissionIndicator;
var UserPermissionsSummary = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var user = (0, PermissionsContext_1.usePermissions)().user;
    if (!user)
        return null;
    var config = ROLE_CONFIG[user.role];
    var Icon = config.icon;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-lg border ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-primary/10", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-5 w-5 text-primary" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold", children: config.label }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: config.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Permisos activos:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: user.permissions.length })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Estado:" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: user.isActive ? "default" : "destructive", className: "text-xs", children: user.isActive ? "Activo" : "Inactivo" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Registro:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground", children: user.createdAt.toLocaleDateString() })] })] })] }));
};
exports.UserPermissionsSummary = UserPermissionsSummary;
