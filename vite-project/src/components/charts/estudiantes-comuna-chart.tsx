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

// Datos de estudiantes por comuna donde realizan práctica
const estudiantesPorComuna = [
  { comuna: "Las Condes", cantidad: 25 },
  { comuna: "Providencia", cantidad: 22 },
  { comuna: "Santiago", cantidad: 18 },
  { comuna: "Ñuñoa", cantidad: 15 },
  { comuna: "La Reina", cantidad: 12 },
  { comuna: "Vitacura", cantidad: 10 },
  { comuna: "Maipú", cantidad: 8 },
  { comuna: "San Miguel", cantidad: 6 },
  { comuna: "Otras", cantidad: 4 },
]

const chartConfig = {
  cantidad: {
    label: "Estudiantes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function EstudiantesPorComunaChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estudiantes por Comuna de Práctica</CardTitle>
        <CardDescription>
          Distribución geográfica de las empresas donde realizan práctica
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