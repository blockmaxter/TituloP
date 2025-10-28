"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavUser = NavUser;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var auth_1 = require("firebase/auth");
var react_1 = require("react");
var avatar_1 = require("@/components/ui/avatar");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var sidebar_1 = require("@/components/ui/sidebar");
var UserProfileDialog_1 = require("@/components/UserProfileDialog");
var SettingsDialog_1 = require("@/components/SettingsDialog");
var NotificationsDialog_1 = require("@/components/NotificationsDialog");
var firebase_1 = require("@/lib/firebase");
function NavUser(_a) {
    var user = _a.user, _b = _a.isAuthenticated, isAuthenticated = _b === void 0 ? false : _b, onLoginRequest = _a.onLoginRequest;
    var isMobile = (0, sidebar_1.useSidebar)().isMobile;
    var _c = (0, react_1.useState)(false), showProfileDialog = _c[0], setShowProfileDialog = _c[1];
    var _d = (0, react_1.useState)(false), showSettingsDialog = _d[0], setShowSettingsDialog = _d[1];
    var _e = (0, react_1.useState)(false), showNotificationsDialog = _e[0], setShowNotificationsDialog = _e[1];
    return ((0, jsx_runtime_1.jsx)(sidebar_1.SidebarMenu, { children: (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarMenuItem, { children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenu, { children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(sidebar_1.SidebarMenuButton, { size: "lg", className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground", children: [(0, jsx_runtime_1.jsxs)(avatar_1.Avatar, { className: "h-8 w-8 rounded-lg grayscale", children: [(0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: user.avatar, alt: user.name }), (0, jsx_runtime_1.jsx)(avatar_1.AvatarFallback, { className: "rounded-lg", children: "CN" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [(0, jsx_runtime_1.jsx)("span", { className: "truncate font-medium", children: isAuthenticated ? user.name : "Visitante" }), isAuthenticated && ((0, jsx_runtime_1.jsx)("span", { className: "truncate text-xs text-muted-foreground", children: user.email }))] }), (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVerticalIcon, { className: "ml-auto size-4" })] }) }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuContent, { className: "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg", side: isMobile ? "bottom" : "right", align: "end", sideOffset: 4, children: [(0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuLabel, { className: "p-0 font-normal", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm", children: [(0, jsx_runtime_1.jsxs)(avatar_1.Avatar, { className: "h-8 w-8 rounded-lg", children: [(0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: user.avatar, alt: user.name }), (0, jsx_runtime_1.jsx)(avatar_1.AvatarFallback, { className: "rounded-lg", children: "CN" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [(0, jsx_runtime_1.jsx)("span", { className: "truncate font-medium", children: isAuthenticated ? user.name : "Visitante" }), isAuthenticated && ((0, jsx_runtime_1.jsx)("span", { className: "truncate text-xs text-muted-foreground", children: user.email }))] })] }) }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}), !isAuthenticated ? ((0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuGroup, { children: (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: function () {
                                            if (onLoginRequest) {
                                                onLoginRequest();
                                            }
                                            else {
                                                window.location.href = "/login";
                                            }
                                        }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserCircleIcon, {}), "Iniciar sesi\u00F3n"] }) })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuGroup, { children: [(0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return setShowProfileDialog(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserCircleIcon, {}), "Mi perfil"] }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return setShowSettingsDialog(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.SettingsIcon, {}), "Configuraci\u00F3n"] }), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return setShowNotificationsDialog(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BellIcon, {}), "Notificaciones"] })] }), (0, jsx_runtime_1.jsx)(dropdown_menu_1.DropdownMenuSeparator, {}), (0, jsx_runtime_1.jsxs)(dropdown_menu_1.DropdownMenuItem, { onClick: function () {
                                                (0, auth_1.signOut)((0, auth_1.getAuth)(firebase_1.default));
                                                localStorage.removeItem("firebaseUser");
                                                window.location.href = "/";
                                            }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOutIcon, {}), "Cerrar sesi\u00F3n"] })] }))] })] }), (0, jsx_runtime_1.jsx)(UserProfileDialog_1.UserProfileDialog, { open: showProfileDialog, onOpenChange: setShowProfileDialog }), (0, jsx_runtime_1.jsx)(SettingsDialog_1.SettingsDialog, { open: showSettingsDialog, onOpenChange: setShowSettingsDialog }), (0, jsx_runtime_1.jsx)(NotificationsDialog_1.NotificationsDialog, { open: showNotificationsDialog, onOpenChange: setShowNotificationsDialog })] }) }));
}
