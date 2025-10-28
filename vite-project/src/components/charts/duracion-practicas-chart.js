"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuracionPracticasChart = DuracionPracticasChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var card_1 = require("@/components/ui/card");
var recharts_1 = require("recharts");
var duracionData = [
    {
        rango: "0-2 meses",
        abandonadas: 8,
        finalizadas: 2,
        enProceso: 0
    },
    {
        rango: "3-4 meses",
        abandonadas: 3,
        finalizadas: 15,
        enProceso: 12
    },
    {
        rango: "5-6 meses",
        abandonadas: 1,
        finalizadas: 85,
        enProceso: 45
    },
    {
        rango: "7-8 meses",
        abandonadas: 0,
        finalizadas: 35,
        enProceso: 18
    },
    {
        rango: "9+ meses",
        abandonadas: 0,
        finalizadas: 8,
        enProceso: 3
    }
];
function DuracionPracticasChart() {
    var totalPracticas = duracionData.reduce(function (sum, item) {
        return sum + item.abandonadas + item.finalizadas + item.enProceso;
    }, 0);
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Duraci\u00F3n de Pr\u00E1cticas Profesionales" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Distribuci\u00F3n de estudiantes por tiempo de pr\u00E1ctica y estado final" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "h-[350px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: duracionData, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "rango", tick: { fontSize: 11 }, angle: -45, textAnchor: "end", height: 80 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tick: { fontSize: 12 }, label: { value: 'Número de Estudiantes', angle: -90, position: 'insideLeft' } }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { contentStyle: {
                                            backgroundColor: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px'
                                        }, formatter: function (value, name) {
                                            var labels = {
                                                abandonadas: 'Prácticas Abandonadas',
                                                finalizadas: 'Prácticas Completadas',
                                                enProceso: 'En Proceso Actual'
                                            };
                                            return ["".concat(value, " estudiantes"), labels[name] || name];
                                        } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "finalizadas", fill: "#10b981", name: "Completadas", radius: [0, 0, 4, 4] }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "enProceso", fill: "#3b82f6", name: "En Proceso", radius: [0, 0, 4, 4] }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "abandonadas", fill: "#ef4444", name: "Abandonadas", radius: [4, 4, 0, 0] })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: "145" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Completadas" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: "78" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "En Proceso" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-600", children: "12" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Abandonadas" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-600", children: "5.8" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-muted-foreground", children: "Duraci\u00F3n Promedio (meses)" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-3 bg-blue-50 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Insight:" }), " El 85% de las pr\u00E1cticas se completan entre 5-6 meses, que es la duraci\u00F3n est\u00E1ndar establecida por la Escuela de Inform\u00E1tica."] }) })] })] }));
}
