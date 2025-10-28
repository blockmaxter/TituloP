"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudiantesPorCarreraChart = EstudiantesPorCarreraChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var recharts_1 = require("recharts");
var card_1 = require("@/components/ui/card");
var chart_1 = require("@/components/ui/chart");
// Datos de estudiantes por carrera
var estudiantesPorCarrera = [
    { carrera: "Ing. Civil Informática", cantidad: 45, color: "#3b82f6" },
    { carrera: "Ing. Informática", cantidad: 38, color: "#10b981" },
    { carrera: "Ing. Civil Computación", cantidad: 22, color: "#f59e0b" },
    { carrera: "Técnico Informática", cantidad: 15, color: "#ef4444" },
];
var chartConfig = {
    cantidad: {
        label: "Estudiantes",
        color: "hsl(var(--chart-1))",
    },
};
function EstudiantesPorCarreraChart() {
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Estudiantes por Carrera" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Distribuci\u00F3n de estudiantes en pr\u00E1ctica profesional por carrera" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: chartConfig, children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: estudiantesPorCarrera, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "carrera", tick: { fontSize: 12 }, angle: -45, textAnchor: "end", height: 80 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { cursor: false, content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "cantidad", fill: "var(--color-cantidad)", radius: [4, 4, 0, 0] })] }) }) }) })] }));
}
