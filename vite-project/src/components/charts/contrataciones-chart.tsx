"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
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

// Datos de empresas que han contratado estudiantes por semestre
const empresasContratacion = [
  { semestre: "1-2022", contrataciones: 12 },
  { semestre: "2-2022", contrataciones: 18 },
  { semestre: "1-2023", contrataciones: 25 },
  { semestre: "2-2023", contrataciones: 32 },
  { semestre: "1-2024", contrataciones: 28 },
  { semestre: "2-2024", contrataciones: 35 },
]

const chartConfig = {
  contrataciones: {
    label: "Contrataciones",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function ContratacionesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrataciones Post-Práctica</CardTitle>
        <CardDescription>
          Estudiantes contratados por empresas después de su práctica profesional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart 
              data={empresasContratacion}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semestre" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Line
                type="monotone"
                dataKey="contrataciones"
                stroke="var(--color-contrataciones)"
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}