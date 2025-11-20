import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useFirebaseData } from "@/hooks/useFirebaseData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StudentData {
  id?: string;
  nombreEstudiante: string;
  rut: string;
  facultad: string;
  carrera: string;
  nombreEmpresa: string;
  comuna: string;
  supervisorPractica: string;
  emailAlumno: string;
  cargo: string;
  areaEstudiante: string;
  semestre: string;
  anioPractica: string;
  anioIngreso: string;
  evaluacionEnviada: string;
  fechaImportacion?: string;
}

interface ComunaConteoData {
  comuna: string;
  cantidad: number;
  porcentaje: string;
}

// Función para generar datos de conteo por comuna
const generateComunaConteoData = (data: StudentData[]): ComunaConteoData[] => {
  if (!data || data.length === 0) return [];
  
  // Contar estudiantes por comuna
  const comunaConteo = data.reduce((acc, student) => {
    const comuna = student.comuna || 'Sin especificar';
    acc[comuna] = (acc[comuna] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Convertir a formato de gráfico y ordenar alfabéticamente
  const total = data.length;
  return Object.entries(comunaConteo)
    .map(([comuna, cantidad]) => ({
      comuna: comuna === 'Sin especificar' ? 'Sin especificar' : comuna,
      cantidad,
      porcentaje: ((cantidad / total) * 100).toFixed(1)
    }))
    .sort((a, b) => {
      // Poner "Sin especificar" al final
      if (a.comuna === 'Sin especificar') return 1;
      if (b.comuna === 'Sin especificar') return -1;
      return a.comuna.localeCompare(b.comuna);
    });
};

const chartConfig = {
  cantidad: {
    label: "Estudiantes",
    color: "#2563eb", // blue-600
  },
} satisfies ChartConfig

export function EstudiantesPorComunaLineas() {
  const { data, loading, error } = useFirebaseData();

  const comunaData = React.useMemo(() => {
    return generateComunaConteoData(data);
  }, [data]);

  // Debug: Log para verificar que los datos se están actualizando
  React.useEffect(() => {
    if (data && data.length > 0) {
      console.log(`📊 Gráfico Comuna actualizado: ${data.length} estudiantes, ${comunaData.length} comunas únicas`);
      const comunasEjemplo = comunaData.slice(0, 3).map(c => `${c.comuna}: ${c.cantidad}`);
      console.log(`📍 Ejemplos de comunas: ${comunasEjemplo.join(', ')}`);
    }
  }, [data, comunaData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600 dark:text-blue-400">
              <span className="font-medium">{data.cantidad}</span> estudiantes
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {data.porcentaje}% del total
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Distribución de Estudiantes por Comuna</CardTitle>
          <CardDescription>
            Cargando datos...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Distribución de Estudiantes por Comuna</CardTitle>
          <CardDescription className="text-red-600">
            Error al cargar datos: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || data.length === 0 || comunaData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Distribución de Estudiantes por Comuna</CardTitle>
          <CardDescription>
            Análisis de distribución geográfica de estudiantes en prácticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500">No hay datos suficientes</p>
              <p className="text-sm text-gray-400 mt-2">Importa datos CSV para ver la distribución por comunas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalEstudiantes = comunaData.reduce((sum, item) => sum + item.cantidad, 0);
  const totalComunas = comunaData.filter(item => item.comuna !== 'Sin especificar').length;
  const comunaConMasEstudiantes = comunaData.reduce((max, item) => 
    item.cantidad > max.cantidad ? item : max, comunaData[0]);
  const promedioEstudiantesPorComuna = totalComunas > 0 ? (totalEstudiantes / totalComunas).toFixed(1) : '0';

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              📊 Distribución de Estudiantes por Comuna
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Análisis geográfico ordenado alfabéticamente - {comunaData.length} comunas registradas
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{totalEstudiantes}</div>
            <div className="text-sm text-gray-500">Estudiantes Totales</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas Principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
            <div className="text-2xl font-bold text-blue-600">{totalComunas}</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">Total Comunas</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-4 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50">
            <div className="text-2xl font-bold text-indigo-600">{comunaConMasEstudiantes.cantidad}</div>
            <div className="text-sm text-indigo-800 dark:text-indigo-200">Mayor Concentración</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
            <div className="text-2xl font-bold text-purple-600">{promedioEstudiantesPorComuna}</div>
            <div className="text-sm text-purple-800 dark:text-purple-200">Promedio por Comuna</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
            <div className="text-2xl font-bold text-emerald-600">{comunaConMasEstudiantes.porcentaje}%</div>
            <div className="text-sm text-emerald-800 dark:text-emerald-200">Mayor Porcentaje</div>
          </div>
        </div>

        {/* Gráfico de Líneas */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
            📈 Tendencia de Distribución por Comuna (Orden Alfabético)
          </h4>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart 
                data={comunaData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200/50 dark:stroke-gray-700/50" />
                <XAxis 
                  dataKey="comuna"
                  className="text-gray-600 dark:text-gray-300"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  className="text-gray-600 dark:text-gray-300"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke={chartConfig.cantidad.color}
                  strokeWidth={3}
                  dot={{ r: 4, fill: chartConfig.cantidad.color }}
                  activeDot={{ r: 6, fill: "#1d4ed8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Tabla Resumen */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
          <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
            📋 Tabla Resumen - Conteo por Comuna
          </h4>
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Comuna</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-center">Porcentaje</TableHead>
                  <TableHead className="text-center">Distribución</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comunaData.map((item, index) => (
                  <TableRow 
                    key={item.comuna} 
                    className={index % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-700/30" : ""}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-semibold">
                      {item.comuna === 'Sin especificar' ? 
                        <span className="text-gray-500 italic">{item.comuna}</span> : 
                        item.comuna
                      }
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold text-blue-600">{item.cantidad}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-gray-700 dark:text-gray-300">{item.porcentaje}%</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.porcentaje}%` }}
                        ></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Comuna Destacada */}
        {comunaConMasEstudiantes && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-800/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🏆</div>
              <h4 className="font-bold text-blue-800 dark:text-blue-200">Comuna con Mayor Concentración</h4>
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              <strong>{comunaConMasEstudiantes.comuna}</strong> lidera con <strong>{comunaConMasEstudiantes.cantidad} estudiantes</strong>, 
              representando el <strong>{comunaConMasEstudiantes.porcentaje}%</strong> del total de estudiantes en prácticas profesionales.
            </p>
          </div>
        )}

        {/* Nota Explicativa */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            💡 <strong>Información:</strong> Este análisis muestra la distribución de estudiantes por comuna de práctica, 
            ordenadas alfabéticamente. La línea de tendencia ayuda a visualizar patrones de concentración geográfica.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}