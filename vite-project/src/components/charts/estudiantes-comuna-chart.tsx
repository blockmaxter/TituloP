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
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function EstudiantesPorComunaChart() {
  const { data, loading, error } = useFirebaseData()

  // Procesar datos para obtener estudiantes por comuna
  const estudiantesPorComuna = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    const comunasCount = data.reduce((acc, student) => {
      const comuna = student.comuna || 'Sin comuna'
      acc[comuna] = (acc[comuna] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(comunasCount)
      .map(([comuna, cantidad]) => ({
        comuna,
        cantidad
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10) // Mostrar solo las top 10 comunas
  }, [data])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estudiantes por Comuna de Práctica</CardTitle>
          <CardDescription>
            Cargando datos...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
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
          <CardTitle>Estudiantes por Comuna de Práctica</CardTitle>
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
        <CardTitle>Estudiantes por Comuna de Práctica</CardTitle>
        <CardDescription>
          Distribución geográfica de las empresas donde realizan práctica ({data.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={estudiantesPorComuna} 
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="comuna" 
                type="category"
                tick={{ fontSize: 12 }}
                width={70}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar 
                dataKey="cantidad" 
                fill="var(--color-cantidad)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}