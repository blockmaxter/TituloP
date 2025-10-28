"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelinePracticasChart = TimelinePracticasChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var card_1 = require("@/components/ui/card");
var recharts_1 = require("recharts");
var timelineData = [
    {
        mes: "Ene",
        inscripciones: 25,
        iniciosPractica: 0,
        finalizaciones: 12,
        abandonos: 1
    },
    {
        mes: "Feb",
        inscripciones: 30,
        iniciosPractica: 22,
        finalizaciones: 8,
        abandonos: 2
    },
    {
        mes: "Mar",
        inscripciones: 18,
        iniciosPractica: 28,
        finalizaciones: 15,
        abandonos: 1
    },
    {
        mes: "Abr",
        inscripciones: 22,
        iniciosPractica: 16,
        finalizaciones: 20,
        abandonos: 0
    },
    {
        mes: "May",
        inscripciones: 28,
        iniciosPractica: 24,
        finalizaciones: 18,
        abandonos: 1
    },
    {
        mes: "Jun",
        inscripciones: 35,
        iniciosPractica: 26,
        finalizaciones: 22,
        abandonos: 2
    },
    {
        mes: "Jul",
        inscripciones: 20,
        iniciosPractica: 32,
        finalizaciones: 25,
        abandonos: 0
    },
    {
        mes: "Ago",
        inscripciones: 40,
        iniciosPractica: 18,
        finalizaciones: 28,
        abandonos: 1
    },
    {
        mes: "Sep",
        inscripciones: 45,
        iniciosPractica: 38,
        finalizaciones: 16,
        abandonos: 3
    },
    {
        mes: "Oct",
        inscripciones: 25,
        iniciosPractica: 42,
        finalizaciones: 35,
        abandonos: 1
    }
];
function TimelinePracticasChart() {
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Flujo Temporal de Pr\u00E1cticas" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Evoluci\u00F3n mensual del ciclo de vida de las pr\u00E1cticas profesionales" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "h-[350px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: timelineData, margin: { top: 5, right: 30, left: 20, bottom: 5 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "mes", tick: { fontSize: 12 } }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tick: { fontSize: 12 } }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { contentStyle: {
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px'
                                        }, formatter: function (value, name) {
                                            var labels = {
                                                inscripciones: 'Nuevas Inscripciones',
                                                iniciosPractica: 'Inicios de Práctica',
                                                finalizaciones: 'Prácticas Finalizadas',
                                                abandonos: 'Abandonos'
                                            };
                                            return ["".concat(value, " estudiantes"), labels[name] || name];
                                        } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "inscripciones", stroke: "#3b82f6", strokeWidth: 2, name: "Inscripciones", dot: { fill: '#3b82f6', strokeWidth: 2, r: 4 } }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "iniciosPractica", stroke: "#10b981", strokeWidth: 2, name: "Inicios", dot: { fill: '#10b981', strokeWidth: 2, r: 4 } }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "finalizaciones", stroke: "#8b5cf6", strokeWidth: 2, name: "Finalizaciones", dot: { fill: '#8b5cf6', strokeWidth: 2, r: 4 } }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "abandonos", stroke: "#ef4444", strokeWidth: 2, name: "Abandonos", dot: { fill: '#ef4444', strokeWidth: 2, r: 4 }, strokeDasharray: "5 5" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: "278" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Total Inscripciones" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: "246" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Pr\u00E1cticas Iniciadas" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: "199" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Finalizaciones" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-600", children: "12" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Abandonos" })] })] })] })] }));
}
