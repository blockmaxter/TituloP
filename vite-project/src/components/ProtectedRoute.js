"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProtectedAccess = exports.ProtectedRoute = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var alert_1 = require("@/components/ui/alert");
var lucide_react_1 = require("lucide-react");
var ProtectedRoute = function (_a) {
    var children = _a.children, _b = _a.requiredPermissions, requiredPermissions = _b === void 0 ? [] : _b, _c = _a.requiredRoles, requiredRoles = _c === void 0 ? [] : _c, _d = _a.requireAll, requireAll = _d === void 0 ? false : _d, fallback = _a.fallback, _e = _a.showError, showError = _e === void 0 ? true : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var _g = (0, PermissionsContext_1.usePermissions)(), user = _g.user, loading = _g.loading, hasPermission = _g.hasPermission, hasAnyPermission = _g.hasAnyPermission, hasRole = _g.hasRole;
    // Mostrar loading mientras se cargan los permisos
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center min-h-[200px] ".concat(className), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-4 w-4 animate-spin" }), (0, jsx_runtime_1.jsx)("span", { children: "Verificando permisos..." })] }) }));
    }
    // Si no hay usuario autenticado
    if (!user) {
        if (fallback) {
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: fallback });
        }
        if (showError) {
            return ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { className: "m-4 ".concat(className), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldX, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: "Debes iniciar sesi\u00F3n para acceder a este contenido." })] }));
        }
        return null;
    }
    // Verificar permisos
    var hasRequiredPermissions = (function () {
        if (requiredPermissions.length === 0)
            return true;
        if (requireAll) {
            return requiredPermissions.every(function (permission) { return hasPermission(permission); });
        }
        else {
            return hasAnyPermission(requiredPermissions);
        }
    })();
    // Verificar roles
    var hasRequiredRoles = (function () {
        if (requiredRoles.length === 0)
            return true;
        if (requireAll) {
            return requiredRoles.every(function (role) { return hasRole(role); });
        }
        else {
            return requiredRoles.some(function (role) { return hasRole(role); });
        }
    })();
    // Si no tiene los permisos o roles necesarios
    if (!hasRequiredPermissions || !hasRequiredRoles) {
        if (fallback) {
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: fallback });
        }
        if (showError) {
            return ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { className: "m-4 border-red-200 bg-red-50 ".concat(className), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldX, { className: "h-4 w-4 text-red-600" }), (0, jsx_runtime_1.jsxs)(alert_1.AlertDescription, { className: "text-red-800", children: ["No tienes permisos suficientes para acceder a este contenido.", user.role && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-1 text-sm text-red-600", children: ["Tu rol actual: ", (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: user.role })] }))] })] }));
        }
        return null;
    }
    // Usuario tiene permisos, mostrar contenido
    return (0, jsx_runtime_1.jsx)("div", { className: className, children: children });
};
exports.ProtectedRoute = ProtectedRoute;
// Hook personalizado para usar en componentes
var useProtectedAccess = function () {
    var _a = (0, PermissionsContext_1.usePermissions)(), hasPermission = _a.hasPermission, hasAnyPermission = _a.hasAnyPermission, hasRole = _a.hasRole, user = _a.user;
    return {
        canAccess: function (permissions, roles, requireAll) {
            if (roles === void 0) { roles = []; }
            if (requireAll === void 0) { requireAll = false; }
            if (!user)
                return false;
            var hasRequiredPermissions = permissions.length === 0 ||
                (requireAll ? permissions.every(function (p) { return hasPermission(p); }) : hasAnyPermission(permissions));
            var hasRequiredRoles = roles.length === 0 ||
                (requireAll ? roles.every(function (r) { return hasRole(r); }) : roles.some(function (r) { return hasRole(r); }));
            return hasRequiredPermissions && hasRequiredRoles;
        },
        hasPermission: hasPermission,
        hasAnyPermission: hasAnyPermission,
        hasRole: hasRole,
        user: user
    };
};
exports.useProtectedAccess = useProtectedAccess;
