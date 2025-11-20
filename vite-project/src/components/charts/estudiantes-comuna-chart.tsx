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

// Colores para las diferentes carreras
const carreraColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(220, 70%, 50%)",
  "hsl(280, 70%, 50%)",
  "hsl(340, 70%, 50%)",
  "hsl(20, 70%, 50%)",
  "hsl(60, 70%, 50%)",
]

const generateChartConfig = (carreras: string[]): ChartConfig => {
  const config: ChartConfig = {}
  carreras.forEach((carrera, index) => {
    const key = carrera.replace(/\s+/g, '_').toLowerCase()
    config[key] = {
      label: carrera,
      color: carreraColors[index % carreraColors.length],
    }
  })
  return config
}

export function EstudiantesPorComunaChart() {
  const { data, loading, error } = useFirebaseData()

  // Procesar datos para obtener estudiantes por comuna apilados por carrera
  const { estudiantesPorComuna, carreras, chartConfig } = React.useMemo(() => {
    if (!data || data.length === 0) return { estudiantesPorComuna: [], carreras: [], chartConfig: {} }
    
    // Agrupar por comuna y carrera
    const comunasData = data.reduce((acc, student) => {
      const comuna = student.comuna || 'Sin comuna'
      const carrera = student.carrera || 'Sin especificar'
      
      if (!acc[comuna]) {
        acc[comuna] = {}
      }
      
      acc[comuna][carrera] = (acc[comuna][carrera] || 0) + 1
      
      return acc
    }, {} as Record<string, Record<string, number>>)
    
    // Obtener todas las carreras únicas
    const todasLasCarreras = Array.from(new Set(
      data.map(student => student.carrera || 'Sin especificar')
    )).sort()
    
    // Generar configuración del chart
    const config = generateChartConfig(todasLasCarreras)
    
    // Convertir a formato para el gráfico
    const estudiantesData = Object.entries(comunasData)
      .map(([comuna, carreras]) => {
        const row: any = { comuna }
        let total = 0
        
        todasLasCarreras.forEach(carrera => {
          const key = carrera.replace(/\s+/g, '_').toLowerCase()
          const cantidad = carreras[carrera] || 0
          row[key] = cantidad
          total += cantidad
        })
        
        row.total = total
        return row
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 10) // Mostrar solo las top 10 comunas
    
    return {
      estudiantesPorComuna: estudiantesData,
      carreras: todasLasCarreras,
      chartConfig: config
    }
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
          Distribución de estudiantes por comuna y carrera ({data?.length || 0} total)
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
              {carreras.map((carrera, index) => {
                const key = carrera.replace(/\s+/g, '_').toLowerCase()
                return (
                  <Bar 
                    key={carrera}
                    dataKey={key} 
                    stackId="comuna"
                    fill={carreraColors[index % carreraColors.length]}
                    name={carrera}
                  />
                )
              })}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Leyenda de carreras */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Carreras por color:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {carreras.map((carrera, index) => (
              <div key={carrera} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: carreraColors[index % carreraColors.length] }}
                />
                <span className="text-gray-600 dark:text-gray-300">{carrera}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}