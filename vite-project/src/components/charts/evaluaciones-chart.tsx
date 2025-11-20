"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Función helper para normalizar el estado de evaluación
const normalizeEvaluationStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  const normalized = status.toString().toLowerCase().trim();
  return normalized === 'si' || normalized === 'sí' || normalized === 'yes' || normalized === 'true' || normalized === '1';
};
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useFirebaseData } from "@/hooks/useFirebaseData"

const chartConfig = {
  enviadas: {
    label: "Enviadas",
    color: "#10b981",
  },
  pendientes: {
    label: "Pendientes", 
    color: "#f59e0b",
  },
} satisfies ChartConfig

export function EvaluacionesChart() {
  const { data, loading, error } = useFirebaseData()

  // Procesar datos para obtener evaluaciones enviadas vs pendientes
  const evaluacionesData = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    const enviadas = data.filter(student => 
      normalizeEvaluationStatus(student.evaluacionEnviada)
    ).length
    
    const pendientes = data.length - enviadas
    
    return [
      { name: "Evaluaciones Enviadas", value: enviadas, color: "#10b981" },
      { name: "Evaluaciones Pendientes", value: pendientes, color: "#f59e0b" },
    ]
  }, [data])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado de Evaluaciones</CardTitle>
          <CardDescription>
            Cargando datos...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado de Evaluaciones</CardTitle>
          <CardDescription className="text-red-600">
            Error al cargar datos: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Evaluaciones</CardTitle>
        <CardDescription>
          Evaluaciones de práctica profesional enviadas vs pendientes ({data.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={evaluacionesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {evaluacionesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}