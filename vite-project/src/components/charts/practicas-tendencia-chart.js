"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticasTendenciaChart = PracticasTendenciaChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var recharts_1 = require("recharts");
var card_1 = require("@/components/ui/card");
var chart_1 = require("@/components/ui/chart");
// Datos de prácticas iniciadas por mes
var practicasPorMes = [
    { mes: "Ene", iniciadas: 8, finalizadas: 12 },
    { mes: "Feb", iniciadas: 15, finalizadas: 10 },
    { mes: "Mar", iniciadas: 35, finalizadas: 8 },
    { mes: "Abr", iniciadas: 28, finalizadas: 18 },
    { mes: "May", iniciadas: 22, finalizadas: 25 },
    { mes: "Jun", iniciadas: 18, finalizadas: 30 },
    { mes: "Jul", iniciadas: 12, finalizadas: 35 },
    { mes: "Ago", iniciadas: 32, finalizadas: 15 },
    { mes: "Sep", iniciadas: 25, finalizadas: 20 },
    { mes: "Oct", iniciadas: 20, finalizadas: 28 },
    { mes: "Nov", iniciadas: 15, finalizadas: 32 },
    { mes: "Dic", iniciadas: 5, finalizadas: 25 },
];
var chartConfig = {
    iniciadas: {
        label: "Iniciadas",
        color: "hsl(var(--chart-1))",
    },
    finalizadas: {
        label: "Finalizadas",
        color: "hsl(var(--chart-2))",
    },
};
function PracticasTendenciaChart() {
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Tendencia de Pr\u00E1cticas Profesionales" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Evoluci\u00F3n mensual de pr\u00E1cticas iniciadas y finalizadas durante 2024" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: chartConfig, children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.AreaChart, { data: practicasPorMes, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [(0, jsx_runtime_1.jsxs)("defs", { children: [(0, jsx_runtime_1.jsxs)("linearGradient", { id: "colorIniciadas", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "5%", stopColor: "hsl(var(--chart-1))", stopOpacity: 0.8 }), (0, jsx_runtime_1.jsx)("stop", { offset: "95%", stopColor: "hsl(var(--chart-1))", stopOpacity: 0.1 })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: "colorFinalizadas", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "5%", stopColor: "hsl(var(--chart-2))", stopOpacity: 0.8 }), (0, jsx_runtime_1.jsx)("stop", { offset: "95%", stopColor: "hsl(var(--chart-2))", stopOpacity: 0.1 })] })] }), (0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "mes" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "iniciadas", stroke: "hsl(var(--chart-1))", fillOpacity: 1, fill: "url(#colorIniciadas)" }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "finalizadas", stroke: "hsl(var(--chart-2))", fillOpacity: 1, fill: "url(#colorFinalizadas)" })] }) }) }) })] }));
}
