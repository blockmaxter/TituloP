import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const timelineData = [
  { 
    mes: "Ene", 
    inscripciones: 25, 
    iniciosPractica: 0, 
    finalizaciones: 12,
    abandonos: 1
  },
  { 
    mes: "Feb", 
    inscripciones: 30, 
    iniciosPractica: 22, 
    finalizaciones: 8,
    abandonos: 2 
  },
  { 
    mes: "Mar", 
    inscripciones: 18,
    iniciosPractica: 28, 
    finalizaciones: 15,
    abandonos: 1 
  },
  { 
    mes: "Abr", 
    inscripciones: 22, 
    iniciosPractica: 16, 
    finalizaciones: 20,
    abandonos: 0 
  },
  { 
    mes: "May", 
    inscripciones: 28, 
    iniciosPractica: 24, 
    finalizaciones: 18,
    abandonos: 1 
  },
  { 
    mes: "Jun", 
    inscripciones: 35, 
    iniciosPractica: 26, 
    finalizaciones: 22,
    abandonos: 2 
  },
  { 
    mes: "Jul", 
    inscripciones: 20, 
    iniciosPractica: 32, 
    finalizaciones: 25,
    abandonos: 0 
  },
  { 
    mes: "Ago", 
    inscripciones: 40, 
    iniciosPractica: 18, 
    finalizaciones: 28,
    abandonos: 1 
  },
  { 
    mes: "Sep", 
    inscripciones: 45, 
    iniciosPractica: 38, 
    finalizaciones: 16,
    abandonos: 3 
  },
  { 
    mes: "Oct", 
    inscripciones: 25, 
    iniciosPractica: 42, 
    finalizaciones: 35,
    abandonos: 1 
  }
]

export function TimelinePracticasChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flujo Temporal de Prácticas</CardTitle>
        <CardDescription>Evolución mensual del ciclo de vida de las prácticas profesionales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => {
                  const labels: { [key: string]: string } = {
                    inscripciones: 'Nuevas Inscripciones',
                    iniciosPractica: 'Inicios de Práctica',
                    finalizaciones: 'Prácticas Finalizadas',
                    abandonos: 'Abandonos'
                  }
                  return [`${value} estudiantes`, labels[name] || name]
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="inscripciones" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Inscripciones"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="iniciosPractica" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Inicios"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="finalizaciones" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Finalizaciones"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="abandonos" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Abandonos"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">278</div>
            <div className="text-sm text-muted-foreground">Total Inscripciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">246</div>
            <div className="text-sm text-muted-foreground">Prácticas Iniciadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">199</div>
            <div className="text-sm text-muted-foreground">Finalizaciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-muted-foreground">Abandonos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}