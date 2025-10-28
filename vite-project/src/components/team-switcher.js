"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSwitcher = TeamSwitcher;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var lucide_react_1 = require("lucide-react");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var sidebar_1 = require("@/components/ui/sidebar");
function TeamSwitcher(_a) {
    var teams = _a.teams;
    var isMobile = (0, sidebar_1.useSidebar)().isMobile;
    var _b = React.useState(teams[0]), activeTeam = _b[0], setActiveTeam = _b[1];
    if (!activeTeam) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenu, { children: (0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenuItem, { children: (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarMenuButton, { size: "lg", className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground", children: (0, jsx_runtime_1.jsx)(activeTeam.logo, { className: "size-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [(0, jsx_runtime_1.jsx)("span", { className: "truncate font-semibold", children: activeTeam.name }), (0, jsx_runtime_1.jsx)("span", { className: "truncate text-xs", children: activeTeam.plan })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronsUpDown, { className: "ml-auto" })] }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { className: "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg", align: "start", side: isMobile ? "bottom" : "right", sideOffset: 4, children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuLabel, { className: "text-xs text-muted-foreground", children: "Equipos" }), teams.map(function (team, index) { return ((0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return setActiveTeam(team); }, className: "gap-2 p-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex size-6 items-center justify-center rounded-sm border", children: (0, jsx_runtime_1.jsx)(team.logo, { className: "size-4 shrink-0" }) }), team.name, (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuShortcut, { children: ["\u2318", index + 1] })] }, team.name)); }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { className: "gap-2 p-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex size-6 items-center justify-center rounded-md border bg-background", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium text-muted-foreground", children: "Agregar equipo" })] })] })] }) }) }));
}
