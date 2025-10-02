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
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Datos de evaluaciones enviadas vs pendientes
const evaluacionesData = [
  { name: "Evaluaciones Enviadas", value: 78, color: "#10b981" },
  { name: "Evaluaciones Pendientes", value: 42, color: "#f59e0b" },
]

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Evaluaciones</CardTitle>
        <CardDescription>
          Evaluaciones de práctica profesional enviadas vs pendientes
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