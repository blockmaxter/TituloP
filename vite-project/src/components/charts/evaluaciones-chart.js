"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluacionesChart = EvaluacionesChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var recharts_1 = require("recharts");
var card_1 = require("@/components/ui/card");
var chart_1 = require("@/components/ui/chart");
// Datos de evaluaciones enviadas vs pendientes
var evaluacionesData = [
    { name: "Evaluaciones Enviadas", value: 78, color: "#10b981" },
    { name: "Evaluaciones Pendientes", value: 42, color: "#f59e0b" },
];
var chartConfig = {
    enviadas: {
        label: "Enviadas",
        color: "#10b981",
    },
    pendientes: {
        label: "Pendientes",
        color: "#f59e0b",
    },
};
function EvaluacionesChart() {
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Estado de Evaluaciones" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Evaluaciones de pr\u00E1ctica profesional enviadas vs pendientes" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: chartConfig, children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: evaluacionesData, cx: "50%", cy: "50%", labelLine: false, label: function (_a) {
                                        var name = _a.name, percent = _a.percent;
                                        return "".concat(name, ": ").concat((percent * 100).toFixed(0), "%");
                                    }, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: evaluacionesData.map(function (entry, index) { return ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: entry.color }, "cell-".concat(index))); }) }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {})] }) }) }) })] }));
}
