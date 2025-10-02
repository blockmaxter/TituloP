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

// Datos de notas de práctica por rango
const notasPorRango = [
  { rango: "6.5 - 7.0", cantidad: 15, color: "#10b981" },
  { rango: "6.0 - 6.4", cantidad: 28, color: "#22c55e" },
  { rango: "5.5 - 5.9", cantidad: 35, color: "#84cc16" },
  { rango: "5.0 - 5.4", cantidad: 22, color: "#eab308" },
  { rango: "4.5 - 4.9", cantidad: 12, color: "#f59e0b" },
  { rango: "4.0 - 4.4", cantidad: 6, color: "#ef4444" },
  { rango: "< 4.0", cantidad: 2, color: "#dc2626" },
]

const chartConfig = {
  cantidad: {
    label: "Estudiantes",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function NotasPracticaChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Notas de Práctica</CardTitle>
        <CardDescription>
          Rendimiento académico de estudiantes en práctica profesional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={notasPorRango}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="rango" 
                tick={{ fontSize: 12 }}
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