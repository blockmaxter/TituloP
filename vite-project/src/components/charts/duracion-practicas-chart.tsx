import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const duracionData = [
  { 
    rango: "0-2 meses", 
    abandonadas: 8, 
    finalizadas: 2,
    enProceso: 0
  },
  { 
    rango: "3-4 meses", 
    abandonadas: 3, 
    finalizadas: 15,
    enProceso: 12
  },
  { 
    rango: "5-6 meses", 
    abandonadas: 1, 
    finalizadas: 85,
    enProceso: 45
  },
  { 
    rango: "7-8 meses", 
    abandonadas: 0, 
    finalizadas: 35,
    enProceso: 18
  },
  { 
    rango: "9+ meses", 
    abandonadas: 0, 
    finalizadas: 8,
    enProceso: 3
  }
]

export function DuracionPracticasChart() {
  const totalPracticas = duracionData.reduce((sum, item) => 
    sum + item.abandonadas + item.finalizadas + item.enProceso, 0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Duración de Prácticas Profesionales</CardTitle>
        <CardDescription>Distribución de estudiantes por tiempo de práctica y estado final</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={duracionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="rango"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Número de Estudiantes', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => {
                  const labels: { [key: string]: string } = {
                    abandonadas: 'Prácticas Abandonadas',
                    finalizadas: 'Prácticas Completadas',
                    enProceso: 'En Proceso Actual'
                  }
                  return [`${value} estudiantes`, labels[name] || name]
                }}
              />
              <Legend />
              <Bar 
                dataKey="finalizadas" 
                fill="#10b981" 
                name="Completadas"
                radius={[0, 0, 4, 4]}
              />
              <Bar 
                dataKey="enProceso" 
                fill="#3b82f6" 
                name="En Proceso"
                radius={[0, 0, 4, 4]}
              />
              <Bar 
                dataKey="abandonadas" 
                fill="#ef4444" 
                name="Abandonadas"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">145</div>
            <div className="text-sm text-muted-foreground">Completadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">78</div>
            <div className="text-sm text-muted-foreground">En Proceso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-muted-foreground">Abandonadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">5.8</div>
            <div className="text-sm text-muted-foreground">Duración Promedio (meses)</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm">
            <strong>Insight:</strong> El 85% de las prácticas se completan entre 5-6 meses, 
            que es la duración estándar establecida por la Escuela de Informática.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}