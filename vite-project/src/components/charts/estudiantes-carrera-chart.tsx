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

// Datos de estudiantes por carrera
const estudiantesPorCarrera = [
  { carrera: "Ing. Civil Informática", cantidad: 45, color: "#3b82f6" },
  { carrera: "Ing. Informática", cantidad: 38, color: "#10b981" },
  { carrera: "Ing. Civil Computación", cantidad: 22, color: "#f59e0b" },
  { carrera: "Técnico Informática", cantidad: 15, color: "#ef4444" },
]

const chartConfig = {
  cantidad: {
    label: "Estudiantes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function EstudiantesPorCarreraChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estudiantes por Carrera</CardTitle>
        <CardDescription>
          Distribución de estudiantes en práctica profesional por carrera
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