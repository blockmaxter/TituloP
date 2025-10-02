import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const estadoPracticasData = [
  { estado: "En Búsqueda", estudiantes: 15, color: "#f59e0b" },
  { estado: "En Proceso", estudiantes: 78, color: "#3b82f6" },
  { estado: "Evaluación Final", estudiantes: 18, color: "#8b5cf6" },
  { estado: "Finalizadas", estudiantes: 45, color: "#10b981" },
  { estado: "Abandonadas", estudiantes: 3, color: "#ef4444" }
]

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
  const total = estadoPracticasData.reduce((sum, item) => sum + item.estudiantes, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado Actual de Prácticas</CardTitle>
        <CardDescription>Distribución de estudiantes por etapa del proceso</CardDescription>
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