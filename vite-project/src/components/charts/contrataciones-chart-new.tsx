import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useFirebaseData } from "@/hooks/useFirebaseData"

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

interface PracticaStats {
  total: number;
  conEvaluacion: number;
}

interface ContratacionData {
  periodo: string;
  contrataciones: number;
  practicasCompletadas: number;
  totalPracticas: number;
  porcentajeContratacion: string;
}

// Función helper para normalizar el estado de evaluación
const normalizeEvaluationStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  const normalized = status.toString().toLowerCase().trim();
  return normalized === 'si' || normalized === 'sí' || normalized === 'yes' || normalized === 'true' || normalized === '1';
};

// Función para generar datos de contratación basados en los datos reales
const generateContratacionData = (data: StudentData[]): ContratacionData[] => {
  if (!data || data.length === 0) return [];
  
  // Agrupar por año de práctica
  const practicasPorAno = data.reduce((acc, student) => {
    const ano = student.anioPractica || 'Sin especificar';
    if (!acc[ano]) {
      acc[ano] = {
        total: 0,
        conEvaluacion: 0
      };
    }
    acc[ano].total++;
    if (normalizeEvaluationStatus(student.evaluacionEnviada)) {
      acc[ano].conEvaluacion++;
    }
    return acc;
  }, {} as Record<string, PracticaStats>);
  
  // Convertir a formato de gráfico con estimación de contrataciones
  return Object.entries(practicasPorAno)
    .map(([ano, stats]) => {
      // Estimación: 60-80% de estudiantes con evaluación completada son contratados
      const tasaContratacion = 0.7; // 70% promedio
      const contratacionesEstimadas = Math.round(stats.conEvaluacion * tasaContratacion);
      
      return {
        periodo: ano,
        contrataciones: contratacionesEstimadas,
        practicasCompletadas: stats.conEvaluacion,
        totalPracticas: stats.total,
        porcentajeContratacion: stats.conEvaluacion > 0 ? 
          ((contratacionesEstimadas / stats.conEvaluacion) * 100).toFixed(1) : '0'
      };
    })
    .filter(item => item.periodo !== 'Sin especificar')
    .sort((a, b) => a.periodo.localeCompare(b.periodo));
};

const chartConfig = {
  contrataciones: {
    label: "Contrataciones",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function ContratacionesChart() {
  const { data, loading, error } = useFirebaseData();

  const contratacionData = React.useMemo(() => {
    return generateContratacionData(data);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">Año {label}</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            <span className="font-medium">{data.contrataciones}</span> contrataciones estimadas
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            <span className="font-medium">{data.practicasCompletadas}</span> prácticas completadas
          </p>
          <p className="text-xs text-gray-500">
            Tasa de contratación: <span className="font-medium">{data.porcentajeContratacion}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contrataciones Post-Práctica</CardTitle>
          <CardDescription>
            Cargando datos...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contrataciones Post-Práctica</CardTitle>
          <CardDescription className="text-red-600">
            Error al cargar datos: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || data.length === 0 || contratacionData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contrataciones Post-Práctica</CardTitle>
          <CardDescription>
            Tendencia de contrataciones de estudiantes por año
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-gray-500">No hay datos suficientes</p>
              <p className="text-sm text-gray-400 mt-2">Importa datos CSV para ver las tendencias de contratación</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalContrataciones = contratacionData.reduce((sum, item) => sum + item.contrataciones, 0);
  const totalPracticas = contratacionData.reduce((sum, item) => sum + item.practicasCompletadas, 0);
  const promedioContratacion = totalPracticas > 0 ? ((totalContrataciones / totalPracticas) * 100).toFixed(1) : '0';

  return (
    <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📈 Contrataciones Post-Práctica
        </CardTitle>
        <CardDescription>
          Estimación de contrataciones basada en prácticas completadas ({contratacionData.length} años)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart 
              data={contratacionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="periodo" 
                className="text-gray-600 dark:text-gray-300"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-300"
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={<CustomTooltip />}
              />
              <Line
                type="monotone"
                dataKey="contrataciones"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 6, fill: '#10b981' }}
                activeDot={{ r: 8, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Estadísticas adicionales */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
            📊 Estadísticas de Contratación
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="text-lg font-bold text-green-600">{totalContrataciones}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Contrataciones</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{totalPracticas}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Prácticas Completadas</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{promedioContratacion}%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Tasa Promedio</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{contratacionData.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Años Analizados</div>
            </div>
          </div>
        </div>

        {/* Lista detallada por año */}
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
            📅 Desglose por Año
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {contratacionData.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded border hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Año {item.periodo}</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.totalPracticas} prácticas totales
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 dark:text-green-400">
                    {item.contrataciones} contrataciones
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.porcentajeContratacion}% de tasa
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota explicativa */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Nota:</strong> Las contrataciones son estimadas basándose en una tasa promedio del 70% 
            sobre las prácticas completadas (con evaluación enviada). Los datos reflejan tendencias aproximadas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}