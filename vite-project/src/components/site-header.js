"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteHeader = SiteHeader;
var jsx_runtime_1 = require("react/jsx-runtime");
var separator_1 = require("@/components/ui/separator");
var sidebar_1 = require("@/components/ui/sidebar");
function SiteHeader() {
    return ((0, jsx_runtime_1.jsx)("header", { className: "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6", children: [(0, jsx_runtime_1.jsx)(sidebar_1.SidebarTrigger, { className: "-ml-1" }), (0, jsx_runtime_1.jsx)(separator_1.Separator, { orientation: "vertical", className: "mx-2 data-[orientation=vertical]:h-4" }), (0, jsx_runtime_1.jsx)("h1", { className: "text-base font-medium", children: "Documents" })] }) }));
}
