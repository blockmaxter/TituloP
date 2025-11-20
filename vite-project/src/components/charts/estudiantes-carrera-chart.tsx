"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useFirebaseData } from "@/hooks/useFirebaseData"

const chartConfig = {
  cantidad: {
    label: "Estudiantes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function EstudiantesPorCarreraChart() {
  const { data, loading, error } = useFirebaseData()

  // Procesar datos para obtener estudiantes por carrera
  const estudiantesPorCarrera = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    const carrerasCount = data.reduce((acc, student) => {
      const carrera = student.carrera || 'Sin carrera'
      acc[carrera] = (acc[carrera] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(carrerasCount)
      .map(([carrera, cantidad], index) => ({
        carrera: carrera === '21030' ? 'Ing. Civil Informática' : 
                carrera === '21041' ? 'Ing. Informática' :
                carrera === '21049' ? 'Ing. Civil Computación' : 
                carrera,
        cantidad,
        color: `hsl(var(--chart-${(index % 5) + 1}))`
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
  }, [data])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100 font-bold">Estudiantes por Carrera</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">
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
          <CardTitle className="text-slate-900 dark:text-slate-100 font-bold">Estudiantes por Carrera</CardTitle>
          <CardDescription className="text-red-600 font-medium">
            Error al cargar datos: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100 font-bold">Estudiantes por Carrera</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">
          Distribución de estudiantes en práctica profesional por carrera ({data.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estudiantesPorCarrera} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="carrera" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar 
                dataKey="cantidad" 
                fill="var(--color-cantidad)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}