"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsiveContainer = ResponsiveContainer;
exports.SectionHeader = SectionHeader;
exports.GridLayout = GridLayout;
exports.MobileCard = MobileCard;
exports.DesktopOnly = DesktopOnly;
exports.MobileOnly = MobileOnly;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
function ResponsiveContainer(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b, _c = _a.maxWidth, maxWidth = _c === void 0 ? 'full' : _c;
    var getMaxWidthClass = function () {
        switch (maxWidth) {
            case 'sm': return 'max-w-sm';
            case 'md': return 'max-w-md';
            case 'lg': return 'max-w-lg';
            case 'xl': return 'max-w-xl';
            case '2xl': return 'max-w-2xl';
            case 'full': return 'max-w-full';
            default: return 'max-w-full';
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full ".concat(getMaxWidthClass(), " mx-auto px-4 sm:px-6 lg:px-8 ").concat(className), children: children }));
}
function SectionHeader(_a) {
    var title = _a.title, description = _a.description, _b = _a.className, className = _b === void 0 ? "" : _b, actions = _a.actions;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl sm:text-3xl font-bold text-gray-900 truncate", children: title }), description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm sm:text-base text-muted-foreground mt-1", children: description }))] }), actions && ((0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: actions }))] }));
}
function GridLayout(_a) {
    var children = _a.children, _b = _a.cols, cols = _b === void 0 ? { default: 1, sm: 2, lg: 3 } : _b, _c = _a.gap, gap = _c === void 0 ? 'md' : _c, _d = _a.className, className = _d === void 0 ? "" : _d;
    var getGridCols = function () {
        var classes = [];
        if (cols.default)
            classes.push("grid-cols-".concat(cols.default));
        if (cols.sm)
            classes.push("sm:grid-cols-".concat(cols.sm));
        if (cols.md)
            classes.push("md:grid-cols-".concat(cols.md));
        if (cols.lg)
            classes.push("lg:grid-cols-".concat(cols.lg));
        if (cols.xl)
            classes.push("xl:grid-cols-".concat(cols.xl));
        return classes.join(' ');
    };
    var getGap = function () {
        switch (gap) {
            case 'sm': return 'gap-3';
            case 'md': return 'gap-4 sm:gap-6';
            case 'lg': return 'gap-6 sm:gap-8';
            default: return 'gap-4 sm:gap-6';
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid ".concat(getGridCols(), " ").concat(getGap(), " ").concat(className), children: children }));
}
function MobileCard(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b;
    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: "lg:hidden ".concat(className), children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-4", children: children }) }));
}
function DesktopOnly(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b;
    return ((0, jsx_runtime_1.jsx)("div", { className: "hidden lg:block ".concat(className), children: children }));
}
function MobileOnly(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b;
    return ((0, jsx_runtime_1.jsx)("div", { className: "lg:hidden ".concat(className), children: children }));
}
