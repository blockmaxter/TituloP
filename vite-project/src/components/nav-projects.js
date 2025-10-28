"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavFormulario = NavFormulario;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var sidebar_1 = require("@/components/ui/sidebar");
function NavFormulario(_a) {
    var formularios = _a.formularios;
    var isMobile = (0, sidebar_1.useSidebar)().isMobile;
    return ((0, jsx_runtime_1.jsxs)(sidebar_1.SidebarGroup, { className: "group-data-[collapsible=icon]:hidden", children: [(0, jsx_runtime_1.jsx)(sidebar_1.SidebarGroupLabel, { children: "Formulario" }), (0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenu, { children: formularios.map(function (item) { return ((0, jsx_runtime_1.jsxs)(sidebar_1.SidebarMenuItem, { children: [(0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenuButton, { asChild: true, children: (0, jsx_runtime_1.jsxs)("a", { href: item.url, children: [(0, jsx_runtime_1.jsx)(item.icon, {}), (0, jsx_runtime_1.jsx)("span", { children: item.name })] }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarMenuAction, { showOnHover: true, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, {}), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "More" })] }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { className: "w-48 rounded-lg", side: isMobile ? "bottom" : "right", align: isMobile ? "end" : "start", children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Folder, { className: "text-muted-foreground" }), (0, jsx_runtime_1.jsx)("span", { children: "Ver formulario" })] }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Forward, { className: "text-muted-foreground" }), (0, jsx_runtime_1.jsx)("span", { children: "Compartir formulario" })] }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "text-muted-foreground" }), (0, jsx_runtime_1.jsx)("span", { children: "Eliminar formulario" })] })] })] })] }, item.name)); }) })] }));
}
