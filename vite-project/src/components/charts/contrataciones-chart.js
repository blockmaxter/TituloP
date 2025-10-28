"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContratacionesChart = ContratacionesChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var recharts_1 = require("recharts");
var card_1 = require("@/components/ui/card");
var chart_1 = require("@/components/ui/chart");
// Datos de empresas que han contratado estudiantes por semestre
var empresasContratacion = [
    { semestre: "1-2022", contrataciones: 12 },
    { semestre: "2-2022", contrataciones: 18 },
    { semestre: "1-2023", contrataciones: 25 },
    { semestre: "2-2023", contrataciones: 32 },
    { semestre: "1-2024", contrataciones: 28 },
    { semestre: "2-2024", contrataciones: 35 },
];
var chartConfig = {
    contrataciones: {
        label: "Contrataciones",
        color: "hsl(var(--chart-4))",
    },
};
function ContratacionesChart() {
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Contrataciones Post-Pr\u00E1ctica" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Estudiantes contratados por empresas despu\u00E9s de su pr\u00E1ctica profesional" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: chartConfig, children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: empresasContratacion, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "semestre" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "contrataciones", stroke: "var(--color-contrataciones)", strokeWidth: 3, dot: { r: 6 }, activeDot: { r: 8 } })] }) }) }) })] }));
}
