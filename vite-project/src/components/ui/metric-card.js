"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricCard = MetricCard;
exports.MetricGrid = MetricGrid;
exports.StatusBadge = StatusBadge;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
function MetricCard(_a) {
    var title = _a.title, value = _a.value, description = _a.description, trend = _a.trend, trendValue = _a.trendValue, change = _a.change, _b = _a.className, className = _b === void 0 ? "" : _b;
    // Si se proporciona change, convertir a trend y trendValue
    var effectiveTrend = trend || (change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : undefined);
    var effectiveTrendValue = trendValue || (change !== undefined ? "".concat(change > 0 ? '+' : '').concat(change, "%") : undefined);
    var getTrendIcon = function () {
        switch (effectiveTrend) {
            case 'up':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-3 w-3 text-green-600" });
            case 'down':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-3 w-3 text-red-600" });
            case 'neutral':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Minus, { className: "h-3 w-3 text-gray-600" });
            default:
                return null;
        }
    };
    var getTrendColor = function () {
        switch (effectiveTrend) {
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            case 'neutral':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: className, children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-2 sm:pb-3", children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium text-gray-700", children: title }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "pt-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 sm:space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xl sm:text-2xl font-bold", children: value }), (description || effectiveTrendValue) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [description && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground flex-1 mr-2", children: description })), effectiveTrendValue && effectiveTrend && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 ".concat(getTrendColor()), children: [getTrendIcon(), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium", children: effectiveTrendValue })] }))] }))] }) })] }));
}
function MetricGrid(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b;
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ".concat(className), children: children }));
}
function StatusBadge(_a) {
    var status = _a.status, children = _a.children;
    var getStatusStyles = function () {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'error':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'info':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    return ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: getStatusStyles(), children: children }));
}
