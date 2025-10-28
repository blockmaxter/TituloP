"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugPermissions = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var permissions_1 = require("@/types/permissions");
var DebugPermissions = function () {
    var _a = (0, PermissionsContext_1.usePermissions)(), user = _a.user, hasPermission = _a.hasPermission;
    if (!user) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded p-4 max-w-sm", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-red-800", children: "Debug: Sin usuario" }), (0, jsx_runtime_1.jsx)("p", { className: "text-red-600 text-sm", children: "No hay usuario logueado" })] }));
    }
    var checkPermissions = [
        permissions_1.Permission.VIEW_DASHBOARD,
        permissions_1.Permission.VIEW_ANALYTICS,
        permissions_1.Permission.VIEW_LIFECYCLE,
        permissions_1.Permission.VIEW_DATA_LIBRARY,
        permissions_1.Permission.MANAGE_USERS
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded p-4 max-w-sm z-50", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-blue-800", children: "Debug: Permisos" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-blue-600 mt-2", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Usuario:" }), " ", user.email] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Rol:" }), " ", user.role] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Activo:" }), " ", user.isActive ? 'Sí' : 'No'] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Permisos:" }), (0, jsx_runtime_1.jsx)("ul", { className: "ml-2", children: checkPermissions.map(function (permission) { return ((0, jsx_runtime_1.jsxs)("li", { className: hasPermission(permission) ? 'text-green-600' : 'text-red-600', children: [hasPermission(permission) ? '✅' : '❌', " ", permission] }, permission)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Total permisos:" }), " ", user.permissions.length] })] })] }));
};
exports.DebugPermissions = DebugPermissions;
