"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavMain = NavMain;
var jsx_runtime_1 = require("react/jsx-runtime");
var sidebar_1 = require("@/components/ui/sidebar");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var permissions_1 = require("@/types/permissions");
function NavMain(_a) {
    var items = _a.items, onSectionChange = _a.onSectionChange, activeSection = _a.activeSection;
    var hasPermission = (0, PermissionsContext_1.usePermissions)().hasPermission;
    // Mapeo de secciones a permisos requeridos
    var getSectionPermissions = function (title) {
        switch (title.toLowerCase()) {
            case 'dashboard':
                return [permissions_1.Permission.VIEW_DASHBOARD];
            case 'ciclo de vida':
                return [permissions_1.Permission.VIEW_LIFECYCLE];
            case 'analítica':
                return [permissions_1.Permission.VIEW_ANALYTICS];
            case 'administración':
                return [permissions_1.Permission.MANAGE_USERS];
            default:
                return [];
        }
    };
    return ((0, jsx_runtime_1.jsx)(sidebar_1.SidebarGroup, { children: (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarGroupContent, { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 text-lg font-bold", children: "Panel de datos" }), (0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenu, { children: items.map(function (item) {
                        var requiredPermissions = getSectionPermissions(item.title);
                        var hasAccess = requiredPermissions.length === 0 ||
                            requiredPermissions.some(function (permission) { return hasPermission(permission); });
                        // Si no tiene permisos, no mostrar el item
                        if (!hasAccess) {
                            return null;
                        }
                        var sectionId = item.title === "Ciclo de vida" ? "ciclo-vida" :
                            item.title === "Analítica" ? "analitica" :
                                item.title === "Administración" ? "admin" :
                                    item.title.toLowerCase();
                        var isActive = activeSection === sectionId;
                        return ((0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenuItem, { children: (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarMenuButton, { tooltip: item.title, onClick: function () { return onSectionChange && onSectionChange(sectionId); }, className: isActive ? "bg-accent text-accent-foreground" : "", children: [item.icon && (0, jsx_runtime_1.jsx)(item.icon, {}), (0, jsx_runtime_1.jsx)("span", { children: item.title })] }) }, item.title));
                    }) })] }) }));
}
