"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavDocuments = NavDocuments;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var sidebar_1 = require("@/components/ui/sidebar");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var permissions_1 = require("@/types/permissions");
function NavDocuments(_a) {
    var items = _a.items, onSectionChange = _a.onSectionChange, activeSection = _a.activeSection;
    var isMobile = (0, sidebar_1.useSidebar)().isMobile;
    var hasPermission = (0, PermissionsContext_1.usePermissions)().hasPermission;
    // Mapeo de documentos a permisos requeridos
    var getDocumentPermissions = function (name) {
        switch (name.toLowerCase()) {
            case 'biblioteca de datos':
                return [permissions_1.Permission.VIEW_DATA_LIBRARY];
            case 'formulario':
                return []; // Sin permisos específicos requeridos
            default:
                return [];
        }
    };
    return ((0, jsx_runtime_1.jsxs)(sidebar_1.SidebarGroup, { className: "group-data-[collapsible=icon]:hidden", children: [(0, jsx_runtime_1.jsx)(sidebar_1.SidebarGroupLabel, { children: "Documentos" }), (0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenu, { children: items.map(function (item) {
                    var requiredPermissions = getDocumentPermissions(item.name);
                    var hasAccess = requiredPermissions.length === 0 ||
                        requiredPermissions.some(function (permission) { return hasPermission(permission); });
                    // Si no tiene permisos, no mostrar el item
                    if (!hasAccess) {
                        return null;
                    }
                    var sectionId = item.name.toLowerCase().replace(/\s+/g, '-');
                    var isActive = activeSection === sectionId;
                    return ((0, jsx_runtime_1.jsxs)(sidebar_1.SidebarMenuItem, { children: [(0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenuButton, { asChild: true, onClick: function () { return onSectionChange && onSectionChange(sectionId); }, className: isActive ? "bg-accent text-accent-foreground" : "", children: (0, jsx_runtime_1.jsxs)("a", { href: item.url, children: [(0, jsx_runtime_1.jsx)(item.icon, {}), (0, jsx_runtime_1.jsx)("span", { children: item.name })] }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarMenuAction, { showOnHover: true, className: "rounded-sm data-[state=open]:bg-accent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontalIcon, {}), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "More" })] }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { className: "w-24 rounded-lg", side: isMobile ? "bottom" : "right", align: isMobile ? "end" : "start", children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FolderIcon, {}), (0, jsx_runtime_1.jsx)("span", { children: "Open" })] }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShareIcon, {}), (0, jsx_runtime_1.jsx)("span", { children: "Share" })] })] })] })] }, item.name));
                }) })] }));
}
