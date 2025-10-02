import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const seguimientoData = [
  { 
    etapa: "Postulación",
    activos: 100,
    cumpliendo: 95,
    atrasados: 5,
    problemas: 0
  },
  { 
    etapa: "Asignación",
    activos: 95,
    cumpliendo: 88,
    atrasados: 5,
    problemas: 2
  },
  { 
    etapa: "Inducción",
    activos: 93,
    cumpliendo: 85,
    atrasados: 6,
    problemas: 2
  },
  { 
    etapa: "Desarrollo",
    activos: 91,
    cumpliendo: 78,
    atrasados: 10,
    problemas: 3
  },
  { 
    etapa: "Evaluación Intermedia",
    activos: 88,
    cumpliendo: 75,
    atrasados: 8,
    problemas: 5
  },
  { 
    etapa: "Evaluación Final",
    activos: 83,
    cumpliendo: 70,
    atrasados: 8,
    problemas: 5
  },
  { 
    etapa: "Finalización",
    activos: 78,
    cumpliendo: 72,
    atrasados: 4,
    problemas: 2
  }
]

export function SeguimientoPracticasChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguimiento por Etapas del Proceso</CardTitle>
        <CardDescription>Monitoreo del progreso de estudiantes a través del ciclo de vida</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={seguimientoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumpliendo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorAtrasados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorProblemas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="etapa"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Estudiantes', angle: -90, position: 'insideLeft' }}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => {
                  const labels: { [key: string]: string } = {
                    cumpliendo: 'Cumpliendo Cronograma',
                    atrasados: 'Con Retrasos',
                    problemas: 'Con Problemas Graves'
                  }
                  return [`${value} estudiantes`, labels[name] || name]
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="cumpliendo"
                stackId="1"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorCumpliendo)"
                name="Cumpliendo"
              />
              <Area
                type="monotone"
                dataKey="atrasados"
                stackId="1"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorAtrasados)"
                name="Atrasados"
              />
              <Area
                type="monotone"
                dataKey="problemas"
                stackId="1"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorProblemas)"
                name="Con Problemas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">72</div>
            <div className="text-sm text-green-700">Estudiantes finalizando a tiempo</div>
            <div className="text-xs text-muted-foreground">92% de tasa de éxito</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600">4</div>
            <div className="text-sm text-yellow-700">Con retrasos menores</div>
            <div className="text-xs text-muted-foreground">Recuperables</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">2</div>
            <div className="text-sm text-red-700">Requieren intervención</div>
            <div className="text-xs text-muted-foreground">Seguimiento especial</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}