"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudiantesPorComunaChart = EstudiantesPorComunaChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var recharts_1 = require("recharts");
var card_1 = require("@/components/ui/card");
var chart_1 = require("@/components/ui/chart");
// Datos de estudiantes por comuna donde realizan práctica
var estudiantesPorComuna = [
    { comuna: "Las Condes", cantidad: 25 },
    { comuna: "Providencia", cantidad: 22 },
    { comuna: "Santiago", cantidad: 18 },
    { comuna: "Ñuñoa", cantidad: 15 },
    { comuna: "La Reina", cantidad: 12 },
    { comuna: "Vitacura", cantidad: 10 },
    { comuna: "Maipú", cantidad: 8 },
    { comuna: "San Miguel", cantidad: 6 },
    { comuna: "Otras", cantidad: 4 },
];
var chartConfig = {
    cantidad: {
        label: "Estudiantes",
        color: "hsl(var(--chart-2))",
    },
};
function EstudiantesPorComunaChart() {
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Estudiantes por Comuna de Pr\u00E1ctica" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Distribuci\u00F3n geogr\u00E1fica de las empresas donde realizan pr\u00E1ctica" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: chartConfig, children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 350, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: estudiantesPorComuna, layout: "horizontal", margin: { top: 20, right: 30, left: 80, bottom: 5 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { type: "number" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { dataKey: "comuna", type: "category", tick: { fontSize: 12 }, width: 70 }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { cursor: false, content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "cantidad", fill: "var(--color-cantidad)", radius: [0, 4, 4, 0] })] }) }) }) })] }));
}
