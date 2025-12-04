"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
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

// Paleta de colores vibrantes que funcionan bien en modo claro y oscuro
const COLORS = [
  "hsl(210, 100%, 56%)", // Azul brillante
  "hsl(142, 76%, 36%)",  // Verde
  "hsl(262, 83%, 58%)",  // Púrpura
  "hsl(346, 87%, 43%)",  // Rojo/Rosa
  "hsl(31, 81%, 56%)",   // Naranja
  "hsl(199, 89%, 48%)",  // Cian
  "hsl(48, 96%, 53%)",   // Amarillo
  "hsl(283, 39%, 53%)",  // Lavanda
]

const chartConfig = {
  cantidad: {
    label: "Estudiantes",
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
        fill: COLORS[index % COLORS.length] // Asignar color único a cada carrera
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
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
              <XAxis 
                dataKey="carrera" 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-foreground"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: 'currentColor' }} className="text-foreground" />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar 
                dataKey="cantidad" 
                radius={[4, 4, 0, 0]}
              >
                {estudiantesPorCarrera.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}