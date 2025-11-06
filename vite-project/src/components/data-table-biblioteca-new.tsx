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
  { Header: "CARRERA", accessor: "carrera" },
  { Header: "FACULTAD", accessor: "facultad" },
  { Header: "NOMBRE EMPRESA", accessor: "nombreEmpresa" },
  { Header: "COMUNA", accessor: "comuna" },
  { Header: "JEFE DIRECTO", accessor: "jefeDirecto" },
  { Header: "EMAIL", accessor: "email" },
  { Header: "CARGO", accessor: "cargo" },
  { Header: "SEMESTRE", accessor: "semestre" },
  { Header: "AÑO PRACTICA", accessor: "anio" },
  { Header: "AÑO INGRESO", accessor: "anioIngreso" },
  { Header: "EVALUACION ENVIADA", accessor: "evaluacionEnviada" },
] as const

interface StudentData {
  id?: string;
  nombreEstudiante: string;
  rut: string;
  carrera: string;
  facultad: string;
  nombreEmpresa: string;
  jefeDirecto: string;
  email: string;
  emailEmpresa: string;
  telefonoEmpresa: string;
  cargo: string;
  comuna: string;
  region: string;
  direccionEmpresa: string;
  semestre: string;
  anio: string;
  anioIngreso: string;
  fechaInicio: string;
  fechaTermino: string;
  horasPractica: string;
  evaluacionEnviada: string;
  supervisor: string;
  notaPractica: string;
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
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header mejorado */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  Biblioteca de Datos de Estudiantes
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Gestiona y visualiza los datos de estudiantes en práctica profesional
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm px-3 py-1 bg-blue-100 text-blue-800 border-blue-200">
                  {data.length} registro{data.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshData}
                  disabled={loading}
                  className="whitespace-nowrap hover:bg-gray-50 border-gray-300"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Actualizar</span>
                  <span className="sm:hidden">Act.</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportToCSV}
                  disabled={data.length === 0}
                  className="whitespace-nowrap hover:bg-green-50 border-green-300 text-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Exportar CSV</span>
                  <span className="sm:hidden">CSV</span>
                </Button>
              </div>
              
              <Button 
                onClick={() => setShowImporter(!showImporter)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Importar Datos</span>
                <span className="sm:hidden">Importar</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Importador de archivos */}
      {showImporter && (
        <FileImporter onDataImported={handleDataImported} />
      )}

      {/* Tabla de datos */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="flex flex-col items-center gap-4">
                <Database className="h-16 w-16 text-gray-300" />
                <div>
                  <p className="text-xl font-medium">No hay datos disponibles</p>
                  <p className="text-sm text-gray-400 mt-1">Importa un archivo Excel o CSV para comenzar</p>
                </div>
                <Button 
                  onClick={() => setShowImporter(true)}
                  className="mt-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Datos
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Vista de tabla para pantallas grandes */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                      <tr>
                        {columns.map((col) => (
                          <th key={col.accessor} className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap min-w-[140px]">
                            {col.Header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data.map((row, idx) => (
                        <tr key={row.id || idx} className="hover:bg-blue-50 transition-colors duration-150 group">
                          {columns.map((col) => (
                            <td key={col.accessor} className="px-4 py-4 text-sm text-gray-900 border-b border-gray-100 group-hover:border-blue-200 transition-colors">
                              {col.accessor === 'evaluacionEnviada' ? (
                                <Badge 
                                  variant={row[col.accessor] === 'Sí' || row[col.accessor] === 'Si' ? 'default' : 'secondary'}
                                  className={row[col.accessor] === 'Sí' || row[col.accessor] === 'Si' ? 
                                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' : 
                                    'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
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
                                <div className="font-semibold text-gray-900">
                                  {row[col.accessor as keyof StudentData] || '-'}
                                </div>
                              ) : col.accessor === 'nombreEmpresa' ? (
                                <div className="font-medium text-gray-800">
                                  {row[col.accessor as keyof StudentData] || '-'}
                                </div>
                              ) : (
                                <div className="max-w-[180px] truncate" title={String(row[col.accessor as keyof StudentData] || '-')}>
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

              {/* Vista optimizada para tablets */}
              <div className="hidden md:block lg:hidden">
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estudiante</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Empresa</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ubicación</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data.map((row, idx) => (
                        <tr key={row.id || idx} className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-4 py-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-900">{row.nombreEstudiante}</p>
                              <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">{row.rut}</p>
                              <p className="text-xs text-blue-600 font-medium">{row.carrera}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-900">{row.nombreEmpresa}</p>
                              <p className="text-xs text-gray-600">{row.jefeDirecto}</p>
                              <p className="text-xs text-blue-600 font-medium">{row.cargo}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-800">{row.comuna}</p>
                              <p className="text-xs text-gray-500">{row.region}</p>
                              {row.email && (
                                <a href={`mailto:${row.email}`} className="text-xs text-blue-600 hover:text-blue-800 hover:underline block">
                                  {row.email}
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div className="space-y-2">
                              <Badge 
                                variant={row.evaluacionEnviada === 'Sí' || row.evaluacionEnviada === 'Si' ? 'default' : 'secondary'}
                                className={row.evaluacionEnviada === 'Sí' || row.evaluacionEnviada === 'Si' ? 
                                  'bg-green-100 text-green-800 border-green-200' : 
                                  'bg-gray-100 text-gray-700 border-gray-200'
                                }
                              >
                                {row.evaluacionEnviada || 'No'}
                              </Badge>
                              {row.notaPractica && (
                                <Badge 
                                  variant="outline"
                                  className={parseFloat(row.notaPractica) >= 4.0 ? 
                                    'bg-green-50 text-green-700 border-green-200 block w-fit' : 
                                    'bg-red-50 text-red-700 border-red-200 block w-fit'
                                  }
                                >
                                  Nota: {row.notaPractica}
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vista optimizada para móviles */}
              <div className="md:hidden space-y-4 p-4">
                {data.map((row, idx) => (
                  <Card key={row.id || idx} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="p-0">
                      {/* Header del card */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white rounded-t-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg leading-tight">{row.nombreEstudiante}</h3>
                            <p className="text-blue-100 text-sm mt-1">{row.rut}</p>
                          </div>
                          <Badge 
                            variant={row.evaluacionEnviada === 'Sí' || row.evaluacionEnviada === 'Si' ? 'default' : 'secondary'}
                            className={row.evaluacionEnviada === 'Sí' || row.evaluacionEnviada === 'Si' ? 
                              'bg-green-500 text-white border-green-400 shadow-md' : 
                              'bg-gray-200 text-gray-800 border-gray-300'
                            }
                          >
                            {row.evaluacionEnviada || 'No'}
                          </Badge>
                        </div>
                      </div>

                      {/* Contenido del card */}
                      <div className="p-4 space-y-4">
                        {/* Información académica */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-blue-800 text-sm mb-2">
                            📚 Información Académica
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium text-gray-600">Carrera:</span> {row.carrera}</div>
                            <div><span className="font-medium text-gray-600">Facultad:</span> {row.facultad}</div>
                            <div><span className="font-medium text-gray-600">Semestre:</span> {row.semestre}</div>
                          </div>
                        </div>

                        {/* Información empresa */}
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-green-800 text-sm mb-2">
                            🏢 Empresa
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="font-semibold text-gray-800">{row.nombreEmpresa}</div>
                            <div><span className="font-medium text-gray-600">Jefe:</span> {row.jefeDirecto}</div>
                            <div><span className="font-medium text-gray-600">Cargo:</span> {row.cargo}</div>
                            <div><span className="font-medium text-gray-600">Lugar:</span> {row.comuna}</div>
                          </div>
                        </div>

                        {/* Contacto y estado */}
                        <div className="space-y-3">
                          {row.email && (
                            <a 
                              href={`mailto:${row.email}`}
                              className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                            >
                              ✉️ Contactar
                            </a>
                          )}
                          {row.notaPractica && (
                            <div className="flex justify-center">
                              <Badge 
                                variant="outline"
                                className={parseFloat(row.notaPractica) >= 4.0 ? 
                                  'bg-green-50 text-green-700 border-green-200 px-3 py-1' : 
                                  'bg-red-50 text-red-700 border-red-200 px-3 py-1'
                                }
                              >
                                Nota: {row.notaPractica}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas */}
      {data.length > 0 && (
        <Card className="bg-blue-50 border-blue-200 shadow-md">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{data.length}</div>
                <div className="text-sm text-blue-700">Total de estudiantes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {data.filter(student => student.evaluacionEnviada === 'Sí' || student.evaluacionEnviada === 'Si').length}
                </div>
                <div className="text-sm text-green-700">Evaluaciones enviadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {data.filter(student => student.evaluacionEnviada !== 'Sí' && student.evaluacionEnviada !== 'Si').length}
                </div>
                <div className="text-sm text-amber-700">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}