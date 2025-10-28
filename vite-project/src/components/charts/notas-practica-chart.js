"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotasPracticaChart = NotasPracticaChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var recharts_1 = require("recharts");
var card_1 = require("@/components/ui/card");
var chart_1 = require("@/components/ui/chart");
// Datos de notas de práctica por rango
var notasPorRango = [
    { rango: "6.5 - 7.0", cantidad: 15, color: "#10b981" },
    { rango: "6.0 - 6.4", cantidad: 28, color: "#22c55e" },
    { rango: "5.5 - 5.9", cantidad: 35, color: "#84cc16" },
    { rango: "5.0 - 5.4", cantidad: 22, color: "#eab308" },
    { rango: "4.5 - 4.9", cantidad: 12, color: "#f59e0b" },
    { rango: "4.0 - 4.4", cantidad: 6, color: "#ef4444" },
    { rango: "< 4.0", cantidad: 2, color: "#dc2626" },
];
var chartConfig = {
    cantidad: {
        label: "Estudiantes",
        color: "hsl(var(--chart-3))",
    },
};
function NotasPracticaChart() {
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Distribuci\u00F3n de Notas de Pr\u00E1ctica" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Rendimiento acad\u00E9mico de estudiantes en pr\u00E1ctica profesional" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: chartConfig, children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: notasPorRango, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "rango", tick: { fontSize: 12 } }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { cursor: false, content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "cantidad", fill: "var(--color-cantidad)", radius: [4, 4, 0, 0] })] }) }) }) })] }));
}
