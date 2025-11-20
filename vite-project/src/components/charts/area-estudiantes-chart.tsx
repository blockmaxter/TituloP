import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useFirebaseData } from "@/hooks/useFirebaseData"
import * as React from "react"

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

const COLORS = [
  '#0088FE', // Azul
  '#00C49F', // Verde
  '#FFBB28', // Amarillo
  '#FF8042', // Naranja
  '#8884d8', // Púrpura
  '#82ca9d', // Verde claro
  '#ffc658', // Amarillo oscuro
  '#ff7300', // Naranja oscuro
  '#8dd1e1', // Azul claro
  '#d084d0', // Rosa
  '#87d068', // Verde lima
  '#ffb347'  // Durazno
]

export function AreaEstudiantesChart() {
  const { data, loading, error } = useFirebaseData()

  const areaData = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    // Contar estudiantes por área
    const areaCounts = data.reduce((acc, student) => {
      const area = student.areaEstudiante || 'Sin especificar'
      acc[area] = (acc[area] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Convertir a formato para el gráfico
    const chartData = Object.entries(areaCounts).map(([area, count]) => ({
      name: area,
      value: count,
      percentage: ((count / data.length) * 100).toFixed(1)
    }))

    // Ordenar por cantidad de estudiantes (mayor a menor)
    return chartData.sort((a, b) => b.value - a.value)
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{data.value}</span> estudiantes
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{data.percentage}%</span> del total
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Distribución por Área de Estudiante
          </CardTitle>
          <CardDescription>
            Análisis de las áreas de práctica de los estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Distribución por Área de Estudiante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Error al cargar los datos</p>
              <p className="text-sm text-gray-400 mt-2">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Distribución por Área de Estudiante
          </CardTitle>
          <CardDescription>
            Análisis de las áreas de práctica de los estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500">No hay datos disponibles</p>
              <p className="text-sm text-gray-400 mt-2">Importa datos CSV para ver la distribución por áreas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Distribución por Área de Estudiante
        </CardTitle>
        <CardDescription>
          Análisis de las áreas de práctica de los estudiantes ({data.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={areaData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {areaData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color, fontSize: '12px' }}>
                    {value} ({entry.payload.value})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Estadísticas adicionales */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
            📈 Estadísticas por Área
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {areaData.slice(0, 6).map((area, index) => (
              <div 
                key={area.name} 
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {area.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {area.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {area.percentage}%
                  </div>
                </div>
              </div>
            ))}
            {areaData.length > 6 && (
              <div className="text-center py-2 text-sm text-gray-500 col-span-full">
                ... y {areaData.length - 6} áreas más
              </div>
            )}
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{areaData.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Áreas Diferentes</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {areaData[0]?.value || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Área Principal</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">
              {areaData[0]?.percentage || 0}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Mayor Concentración</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {data.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Estudiantes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}