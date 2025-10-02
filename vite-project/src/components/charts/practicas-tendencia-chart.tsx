"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
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

// Datos de prácticas iniciadas por mes
const practicasPorMes = [
  { mes: "Ene", iniciadas: 8, finalizadas: 12 },
  { mes: "Feb", iniciadas: 15, finalizadas: 10 },
  { mes: "Mar", iniciadas: 35, finalizadas: 8 },
  { mes: "Abr", iniciadas: 28, finalizadas: 18 },
  { mes: "May", iniciadas: 22, finalizadas: 25 },
  { mes: "Jun", iniciadas: 18, finalizadas: 30 },
  { mes: "Jul", iniciadas: 12, finalizadas: 35 },
  { mes: "Ago", iniciadas: 32, finalizadas: 15 },
  { mes: "Sep", iniciadas: 25, finalizadas: 20 },
  { mes: "Oct", iniciadas: 20, finalizadas: 28 },
  { mes: "Nov", iniciadas: 15, finalizadas: 32 },
  { mes: "Dic", iniciadas: 5, finalizadas: 25 },
]

const chartConfig = {
  iniciadas: {
    label: "Iniciadas",
    color: "hsl(var(--chart-1))",
  },
  finalizadas: {
    label: "Finalizadas",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function PracticasTendenciaChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Prácticas Profesionales</CardTitle>
        <CardDescription>
          Evolución mensual de prácticas iniciadas y finalizadas durante 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart 
              data={practicasPorMes}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorIniciadas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorFinalizadas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <Area
                type="monotone"
                dataKey="iniciadas"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorIniciadas)"
              />
              <Area
                type="monotone"
                dataKey="finalizadas"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorFinalizadas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}