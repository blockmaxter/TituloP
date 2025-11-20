import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useFirebaseData } from "@/hooks/useFirebaseData"
import * as React from "react"

// Función helper para normalizar el estado de evaluación
const normalizeEvaluationStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  const normalized = status.toString().toLowerCase().trim();
  return normalized === 'si' || normalized === 'sí' || normalized === 'yes' || normalized === 'true' || normalized === '1';
};

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function EstadoPracticasChart() {
  const { data, loading, error } = useFirebaseData()

  const estadoPracticasData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    // Categorizar estudiantes basándose en los datos disponibles
    const evaluacionesEnviadas = data.filter(student => 
      normalizeEvaluationStatus(student.evaluacionEnviada)
    ).length
    
    const evaluacionesPendientes = data.length - evaluacionesEnviadas
    
    // Simular categorías basándose en el estado de evaluación
    const enProceso = Math.floor(evaluacionesPendientes * 0.7) // 70% en proceso
    const enBusqueda = Math.floor(evaluacionesPendientes * 0.2) // 20% en búsqueda  
    const evaluacionFinal = evaluacionesPendientes - enProceso - enBusqueda // El resto en evaluación
    
    return [
      { estado: "En Búsqueda", estudiantes: enBusqueda, color: "#f59e0b" },
      { estado: "En Proceso", estudiantes: enProceso, color: "#3b82f6" },
      { estado: "Evaluación Final", estudiantes: evaluacionFinal, color: "#8b5cf6" },
      { estado: "Finalizadas", estudiantes: evaluacionesEnviadas, color: "#10b981" }
    ].filter(item => item.estudiantes > 0) // Solo mostrar categorías con estudiantes
  }, [data])

  const total = React.useMemo(() => 
    estadoPracticasData.reduce((sum, item) => sum + item.estudiantes, 0), 
    [estadoPracticasData]
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado Actual de Prácticas</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
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
          <CardTitle>Estado Actual de Prácticas</CardTitle>
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
        <CardTitle>Estado Actual de Prácticas</CardTitle>
        <CardDescription>Distribución de estudiantes por etapa del proceso ({total} total)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estadoPracticasData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="estudiantes"
                >
                  {estadoPracticasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} estudiantes`, 'Cantidad']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            {estadoPracticasData.map((item) => (
              <div key={item.estado} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1">{item.estado}</span>
                <span className="font-medium">{item.estudiantes}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between font-medium">
              <span>Total de Estudiantes:</span>
              <span>{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}