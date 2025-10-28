"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSidebar = AppSidebar;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var lucide_react_1 = require("lucide-react");
var nav_documents_1 = require("@/components/nav-documents");
var nav_main_1 = require("@/components/nav-main");
var nav_secondary_1 = require("@/components/nav-secondary");
var nav_user_1 = require("@/components/nav-user");
var sidebar_1 = require("@/components/ui/sidebar");
var data = {
    user: {
        name: "Usuario",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: lucide_react_1.LayoutDashboardIcon,
        },
        {
            title: "Ciclo de vida",
            url: "#",
            icon: lucide_react_1.ListIcon,
        },
        {
            title: "Analítica",
            url: "#",
            icon: lucide_react_1.BarChartIcon,
        },
        {
            title: "Administración",
            url: "#",
            icon: lucide_react_1.SettingsIcon,
        },
    ],
    navClouds: [
        {
            title: "Captura",
            icon: lucide_react_1.CameraIcon,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Propuestas activas",
                    url: "#",
                },
                {
                    title: "Archivadas",
                    url: "#",
                },
            ],
        },
        {
            title: "Propuesta",
            icon: lucide_react_1.FileTextIcon,
            url: "#",
            items: [
                {
                    title: "Propuestas activas",
                    url: "#",
                },
                {
                    title: "Archivadas",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: lucide_react_1.FileCodeIcon,
            url: "#",
            items: [
                {
                    title: "Propuestas activas",
                    url: "#",
                },
                {
                    title: "Archivadas",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Configuración",
            url: "#",
            icon: lucide_react_1.SettingsIcon,
        },
        {
            title: "Buscar",
            url: "#",
            icon: lucide_react_1.SearchIcon,
        },
    ],
    documents: [
        {
            name: "Biblioteca de datos",
            url: "#",
            icon: lucide_react_1.DatabaseIcon,
        },
        {
            name: "Formulario",
            url: "#",
            icon: lucide_react_1.FolderIcon,
        },
    ],
};
function AppSidebar(_a) {
    var onSectionChange = _a.onSectionChange, activeSection = _a.activeSection, isAuthenticated = _a.isAuthenticated, onLoginRequest = _a.onLoginRequest, props = __rest(_a, ["onSectionChange", "activeSection", "isAuthenticated", "onLoginRequest"]);
    var userData = localStorage.getItem("firebaseUser");
    var user = userData
        ? {
            name: JSON.parse(userData).displayName || "Usuario",
            email: JSON.parse(userData).email || "m@example.com",
            avatar: JSON.parse(userData).photoURL || "/avatars/shadcn.jpg",
        }
        : {
            name: "Visitante",
            email: "visitante@example.com",
            avatar: "/avatars/shadcn.jpg",
        };
    return ((0, jsx_runtime_1.jsxs)(sidebar_1.Sidebar, __assign({ collapsible: "offcanvas" }, props, { children: [(0, jsx_runtime_1.jsx)(sidebar_1.SidebarHeader, { children: (0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenu, { children: (0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenuItem, { children: (0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenuButton, { asChild: true, className: "data-[slot=sidebar-menu-button]:!p-1.5", children: (0, jsx_runtime_1.jsxs)("a", { href: "#", className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpCircleIcon, { className: "h-5 w-5 flex-shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "text-base font-semibold truncate", children: "Utem Datos" })] }) }) }) }) }), (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarContent, { children: [(0, jsx_runtime_1.jsx)(nav_main_1.NavMain, { items: data.navMain, onSectionChange: onSectionChange, activeSection: activeSection }), (0, jsx_runtime_1.jsx)(nav_documents_1.NavDocuments, { items: data.documents, onSectionChange: onSectionChange, activeSection: activeSection }), (0, jsx_runtime_1.jsx)(nav_secondary_1.NavSecondary, { items: data.navSecondary, className: "mt-auto" })] }), (0, jsx_runtime_1.jsx)(sidebar_1.SidebarFooter, { children: (0, jsx_runtime_1.jsx)(nav_user_1.NavUser, { user: user, isAuthenticated: isAuthenticated, onLoginRequest: onLoginRequest }) })] })));
}
