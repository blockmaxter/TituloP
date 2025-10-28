"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingNav = FloatingNav;
var jsx_runtime_1 = require("react/jsx-runtime");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var permissions_1 = require("@/types/permissions");
function FloatingNav(_a) {
    var activeSection = _a.activeSection, onSectionChange = _a.onSectionChange;
    var hasPermission = (0, PermissionsContext_1.usePermissions)().hasPermission;
    var sections = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: lucide_react_1.LayoutDashboard,
            permission: permissions_1.Permission.VIEW_DASHBOARD
        },
        {
            id: 'biblioteca-de-datos',
            label: 'Biblioteca de Datos',
            icon: lucide_react_1.Database,
            permission: permissions_1.Permission.VIEW_DATA_LIBRARY
        },
        {
            id: 'ciclo-vida',
            label: 'Ciclo de Vida',
            icon: lucide_react_1.List,
            permission: permissions_1.Permission.VIEW_LIFECYCLE
        },
        {
            id: 'analitica',
            label: 'Analítica',
            icon: lucide_react_1.BarChart3,
            permission: permissions_1.Permission.VIEW_ANALYTICS
        },
        {
            id: 'admin',
            label: 'Administración',
            icon: lucide_react_1.Settings,
            permission: permissions_1.Permission.MANAGE_USERS
        },
    ];
    // Filtrar secciones basado en permisos
    var accessibleSections = sections.filter(function (section) { return hasPermission(section.permission); });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed right-4 xl:right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-2", children: accessibleSections.map(function (section) { return ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: activeSection === section.id ? "default" : "outline", size: "sm", onClick: function () { return onSectionChange(section.id); }, className: "w-12 h-12 p-0 rounded-full shadow-lg hover:scale-105 transition-transform", title: section.label, children: (0, jsx_runtime_1.jsx)(section.icon, { className: "h-5 w-5" }) }, section.id)); }) }), (0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 lg:hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-full shadow-lg px-2 py-2", children: (0, jsx_runtime_1.jsx)("div", { className: "flex space-x-1", children: accessibleSections.map(function (section) { return ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: activeSection === section.id ? "default" : "ghost", size: "sm", onClick: function () { return onSectionChange(section.id); }, className: "w-10 h-10 p-0 rounded-full", title: section.label, children: (0, jsx_runtime_1.jsx)(section.icon, { className: "h-4 w-4" }) }, section.id)); }) }) }) })] }));
}
