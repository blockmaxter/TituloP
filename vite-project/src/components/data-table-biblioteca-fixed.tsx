import * as React from "react"
import { useState } from "react"
import { FileImporter } from "./file-importer"
import { useFirebaseData } from "@/hooks/useFirebaseData"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { RefreshCw, Download, Upload, Database } from "lucide-react"

const columns = [
  { Header: "NOMBRE ESTUDIANTE", accessor: "nombreEstudiante" },
  { Header: "RUT", accessor: "rut" },
  { Header: "FACULTAD", accessor: "facultad" },
  { Header: "CARRERA", accessor: "carrera" },
  { Header: "NOMBRE EMPRESA", accessor: "nombreEmpresa" },
  { Header: "COMUNA", accessor: "comuna" },
  { Header: "SUPERVISOR DE PRACTICA", accessor: "supervisorPractica" },
  { Header: "EMAIL ALUMNO", accessor: "emailAlumno" },
  { Header: "CARGO", accessor: "cargo" },
  { Header: "AREA DE ESTUDIANTE", accessor: "areaEstudiante" },
  { Header: "SEMESTRE", accessor: "semestre" },
  { Header: "AÑO PRACTICA", accessor: "anioPractica" },
  { Header: "AÑO INGRESO", accessor: "anioIngreso" },
  { Header: "EVALUACION ENVIADA", accessor: "evaluacionEnviada" },
] as const

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

export function DataTableBiblioteca() {
  const { data, loading, error, refreshData } = useFirebaseData();
  const [showImporter, setShowImporter] = useState(false);

  const handleDataImported = (importedData: StudentData[]) => {
    setShowImporter(false);
    // Los datos se actualizarán automáticamente gracias al listener de Firebase
  };

  const exportToCSV = () => {
    if (data.length === 0) return;
    
    const csvContent = [
      columns.map(col => col.Header).join(','),
      ...data.map(row => 
        columns.map(col => `"${row[col.accessor as keyof StudentData] || ''}"`).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `estudiantes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Error al cargar datos</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refreshData} variant="outline" className="text-red-700 border-red-300 hover:bg-red-100">
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de nuevo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8 space-y-6">
        
        {/* Header mejorado */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50 to-indigo-100">
          <CardHeader className="pb-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-t-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3">
                <CardTitle className="text-3xl lg:text-4xl font-bold flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Database className="h-8 w-8" />
                  </div>
                  Estudiantes en Práctica
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg font-medium">
                  Sistema de gestión y seguimiento integral
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-base font-semibold">
                  {data.length} estudiante{data.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6">
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={refreshData}
                  disabled={loading}
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-200"
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={exportToCSV}
                  disabled={data.length === 0}
                  className="bg-emerald-500/20 backdrop-blur-sm text-white border-emerald-300/30 hover:bg-emerald-500/30 transition-all duration-200"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exportar CSV
                </Button>
              </div>
              
              <Button 
                onClick={() => setShowImporter(!showImporter)}
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Upload className="h-5 w-5 mr-2" />
                Importar Datos
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Importador de archivos */}
        {showImporter && (
          <div className="animate-in slide-in-from-top duration-300">
            <FileImporter onDataImported={handleDataImported} />
          </div>
        )}

        {/* Tabla de datos */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {data.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
                <div className="flex flex-col items-center gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                    <Database className="h-20 w-20 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">No hay datos disponibles</h3>
                    <p className="text-gray-600 text-lg">Importa un archivo Excel o CSV para comenzar</p>
                  </div>
                  <Button 
                    onClick={() => setShowImporter(true)}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Importar Datos
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {/* Vista de tabla para pantallas grandes */}
                <div className="hidden xl:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <tr>
                          {columns.map((col) => (
                            <th key={col.accessor} className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                              {col.Header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {data.map((row, idx) => (
                          <tr key={row.id || idx} className="hover:bg-blue-50/50 transition-all duration-200 group">
                            {columns.map((col) => (
                              <td key={col.accessor} className="px-6 py-4 text-sm text-gray-900 group-hover:text-blue-900 transition-colors">
                                {col.accessor === 'evaluacionEnviada' ? (
                                  <Badge 
                                    className={row[col.accessor] === 'Sí' || row[col.accessor] === 'Si' ? 
                                      'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 shadow-sm' : 
                                      'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 shadow-sm'
                                    }
                                  >
                                    {row[col.accessor] || 'No'}
                                  </Badge>
                                ) : col.accessor === 'email' ? (
                                  <a 
                                    href={`mailto:${row[col.accessor as keyof StudentData]}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                                  >
                                    {row[col.accessor as keyof StudentData] || '-'}
                                  </a>
                                ) : col.accessor === 'nombreEstudiante' ? (
                                  <div className="font-bold text-gray-900">
                                    {row[col.accessor as keyof StudentData] || '-'}
                                  </div>
                                ) : col.accessor === 'nombreEmpresa' ? (
                                  <div className="font-semibold text-gray-800">
                                    {row[col.accessor as keyof StudentData] || '-'}
                                  </div>
                                ) : (
                                  <div className="max-w-[200px] truncate" title={String(row[col.accessor as keyof StudentData] || '-')}>
                                    {row[col.accessor as keyof StudentData] || '-'}
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Vista de cards para tablets y móviles */}
                <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {data.map((row, idx) => (
                    <Card key={row.id || idx} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
                      {/* Header del card */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xl leading-tight truncate">{row.nombreEstudiante}</h3>
                            <p className="text-blue-100 text-sm mt-2">{row.rut}</p>
                          </div>
                          <Badge 
                            className={row.evaluacionEnviada === 'Sí' || row.evaluacionEnviada === 'Si' ? 
                              'bg-emerald-500 text-white border-emerald-400 shadow-lg' : 
                              'bg-amber-500 text-white border-amber-400 shadow-lg'
                            }
                          >
                            {row.evaluacionEnviada || 'No'}
                          </Badge>
                        </div>
                      </div>

                      {/* Contenido del card */}
                      <CardContent className="p-6 space-y-6">
                        {/* Información académica */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                          <h4 className="font-bold text-blue-800 text-lg mb-3 flex items-center gap-2">
                            📚 Académico
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600">Carrera:</span>
                              <span className="text-gray-800 font-medium">{row.carrera}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600">Facultad:</span>
                              <span className="text-gray-800">{row.facultad}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600">Semestre:</span>
                              <span className="text-gray-800 font-medium">{row.semestre}</span>
                            </div>
                          </div>
                        </div>

                        {/* Información empresa */}
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl">
                          <h4 className="font-bold text-emerald-800 text-lg mb-3 flex items-center gap-2">
                            🏢 Empresa
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-bold text-gray-900 text-base block">{row.nombreEmpresa}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600">Supervisor:</span>
                              <span className="text-gray-800">{row.jefeDirecto}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600">Cargo:</span>
                              <span className="text-gray-800">{row.cargo}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600">Ubicación:</span>
                              <span className="text-gray-800">{row.comuna}</span>
                            </div>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col gap-3">
                          {row.email && (
                            <Button 
                              asChild
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <a href={`mailto:${row.email}`}>
                                ✉️ Contactar Estudiante
                              </a>
                            </Button>
                          )}
                          {row.notaPractica && (
                            <div className="flex justify-center">
                              <Badge 
                                variant="outline"
                                className={parseFloat(row.notaPractica) >= 4.0 ? 
                                  'bg-emerald-50 text-emerald-700 border-emerald-300 px-4 py-2 text-base font-semibold' : 
                                  'bg-red-50 text-red-700 border-red-300 px-4 py-2 text-base font-semibold'
                                }
                              >
                                📊 Nota: {row.notaPractica}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel de estadísticas */}
        {data.length > 0 && (
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{data.length}</div>
                  <div className="text-blue-100 text-lg font-medium">Total Estudiantes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-emerald-300">
                    {data.filter(student => student.evaluacionEnviada === 'Sí' || student.evaluacionEnviada === 'Si').length}
                  </div>
                  <div className="text-emerald-100 text-lg font-medium">Evaluaciones Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-amber-300">
                    {data.filter(student => student.evaluacionEnviada !== 'Sí' && student.evaluacionEnviada !== 'Si').length}
                  </div>
                  <div className="text-amber-100 text-lg font-medium">Pendientes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}