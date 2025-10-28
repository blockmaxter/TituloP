"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoPracticasChart = EstadoPracticasChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var card_1 = require("@/components/ui/card");
var recharts_1 = require("recharts");
var estadoPracticasData = [
    { estado: "En Búsqueda", estudiantes: 15, color: "#f59e0b" },
    { estado: "En Proceso", estudiantes: 78, color: "#3b82f6" },
    { estado: "Evaluación Final", estudiantes: 18, color: "#8b5cf6" },
    { estado: "Finalizadas", estudiantes: 45, color: "#10b981" },
    { estado: "Abandonadas", estudiantes: 3, color: "#ef4444" }
];
var RADIAN = Math.PI / 180;
var renderCustomizedLabel = function (_a) {
    var cx = _a.cx, cy = _a.cy, midAngle = _a.midAngle, innerRadius = _a.innerRadius, outerRadius = _a.outerRadius, percent = _a.percent;
    var radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    var x = cx + radius * Math.cos(-midAngle * RADIAN);
    var y = cy + radius * Math.sin(-midAngle * RADIAN);
    return ((0, jsx_runtime_1.jsx)("text", { x: x, y: y, fill: "white", textAnchor: x > cx ? 'start' : 'end', dominantBaseline: "central", fontSize: 12, fontWeight: "bold", children: "".concat((percent * 100).toFixed(0), "%") }));
};
function EstadoPracticasChart() {
    var total = estadoPracticasData.reduce(function (sum, item) { return sum + item.estudiantes; }, 0);
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Estado Actual de Pr\u00E1cticas" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Distribuci\u00F3n de estudiantes por etapa del proceso" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: estadoPracticasData, cx: "50%", cy: "50%", labelLine: false, label: renderCustomizedLabel, outerRadius: 100, fill: "#8884d8", dataKey: "estudiantes", children: estadoPracticasData.map(function (entry, index) { return ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: entry.color }, "cell-".concat(index))); }) }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { formatter: function (value) { return ["".concat(value, " estudiantes"), 'Cantidad']; } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {})] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4 text-sm", children: estadoPracticasData.map(function (item) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }), (0, jsx_runtime_1.jsx)("span", { className: "flex-1", children: item.estado }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: item.estudiantes })] }, item.estado)); }) }), (0, jsx_runtime_1.jsx)("div", { className: "pt-2 border-t", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between font-medium", children: [(0, jsx_runtime_1.jsx)("span", { children: "Total de Estudiantes:" }), (0, jsx_runtime_1.jsx)("span", { children: total })] }) })] }) })] }));
}
