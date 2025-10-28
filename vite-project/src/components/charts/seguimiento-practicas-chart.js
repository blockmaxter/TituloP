"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeguimientoPracticasChart = SeguimientoPracticasChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var card_1 = require("@/components/ui/card");
var recharts_1 = require("recharts");
var seguimientoData = [
    {
        etapa: "Postulación",
        activos: 100,
        cumpliendo: 95,
        atrasados: 5,
        problemas: 0
    },
    {
        etapa: "Asignación",
        activos: 95,
        cumpliendo: 88,
        atrasados: 5,
        problemas: 2
    },
    {
        etapa: "Inducción",
        activos: 93,
        cumpliendo: 85,
        atrasados: 6,
        problemas: 2
    },
    {
        etapa: "Desarrollo",
        activos: 91,
        cumpliendo: 78,
        atrasados: 10,
        problemas: 3
    },
    {
        etapa: "Evaluación Intermedia",
        activos: 88,
        cumpliendo: 75,
        atrasados: 8,
        problemas: 5
    },
    {
        etapa: "Evaluación Final",
        activos: 83,
        cumpliendo: 70,
        atrasados: 8,
        problemas: 5
    },
    {
        etapa: "Finalización",
        activos: 78,
        cumpliendo: 72,
        atrasados: 4,
        problemas: 2
    }
];
function SeguimientoPracticasChart() {
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Seguimiento por Etapas del Proceso" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Monitoreo del progreso de estudiantes a trav\u00E9s del ciclo de vida" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "h-[350px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.AreaChart, { data: seguimientoData, margin: { top: 10, right: 30, left: 0, bottom: 0 }, children: [(0, jsx_runtime_1.jsxs)("defs", { children: [(0, jsx_runtime_1.jsxs)("linearGradient", { id: "colorCumpliendo", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.8 }), (0, jsx_runtime_1.jsx)("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0.2 })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: "colorAtrasados", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "5%", stopColor: "#f59e0b", stopOpacity: 0.8 }), (0, jsx_runtime_1.jsx)("stop", { offset: "95%", stopColor: "#f59e0b", stopOpacity: 0.2 })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: "colorProblemas", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "5%", stopColor: "#ef4444", stopOpacity: 0.8 }), (0, jsx_runtime_1.jsx)("stop", { offset: "95%", stopColor: "#ef4444", stopOpacity: 0.2 })] })] }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "etapa", tick: { fontSize: 10 }, angle: -45, textAnchor: "end", height: 100 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tick: { fontSize: 12 }, label: { value: 'Estudiantes', angle: -90, position: 'insideLeft' } }), (0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { contentStyle: {
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px'
                                        }, formatter: function (value, name) {
                                            var labels = {
                                                cumpliendo: 'Cumpliendo Cronograma',
                                                atrasados: 'Con Retrasos',
                                                problemas: 'Con Problemas Graves'
                                            };
                                            return ["".concat(value, " estudiantes"), labels[name] || name];
                                        } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "cumpliendo", stackId: "1", stroke: "#10b981", fillOpacity: 1, fill: "url(#colorCumpliendo)", name: "Cumpliendo" }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "atrasados", stackId: "1", stroke: "#f59e0b", fillOpacity: 1, fill: "url(#colorAtrasados)", name: "Atrasados" }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "problemas", stackId: "1", stroke: "#ef4444", fillOpacity: 1, fill: "url(#colorProblemas)", name: "Con Problemas" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-3 bg-green-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold text-green-600", children: "72" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-green-700", children: "Estudiantes finalizando a tiempo" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: "92% de tasa de \u00E9xito" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-3 bg-yellow-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold text-yellow-600", children: "4" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-yellow-700", children: "Con retrasos menores" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: "Recuperables" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-3 bg-red-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold text-red-600", children: "2" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-red-700", children: "Requieren intervenci\u00F3n" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-muted-foreground", children: "Seguimiento especial" })] })] })] })] }));
}
