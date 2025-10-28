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
  { Header: "REGIÓN", accessor: "region" },
  { Header: "JEFE DIRECTO", accessor: "jefeDirecto" },
  { Header: "EMAIL ESTUDIANTE", accessor: "email" },
  { Header: "EMAIL EMPRESA", accessor: "emailEmpresa" },
  { Header: "TELÉFONO EMPRESA", accessor: "telefonoEmpresa" },
  { Header: "CARGO", accessor: "cargo" },
  { Header: "SEMESTRE", accessor: "semestre" },
  { Header: "AÑO", accessor: "anio" },
  { Header: "FECHA INICIO", accessor: "fechaInicio" },
  { Header: "FECHA TÉRMINO", accessor: "fechaTermino" },
  { Header: "HORAS PRÁCTICA", accessor: "horasPractica" },
  { Header: "SUPERVISOR", accessor: "supervisor" },
  { Header: "NOTA PRÁCTICA", accessor: "notaPractica" },
  { Header: "EVALUACIÓN ENVIADA", accessor: "evaluacionEnviada" },
]

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
          <CardTitle className="text-red-700">Error al cargar datos</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas y acciones */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Biblioteca de Datos de Estudiantes
              </CardTitle>
              <CardDescription>
                Gestiona y visualiza los datos de estudiantes en práctica profesional
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {data.length} registro{data.length !== 1 ? 's' : ''}
              </Badge>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshData}
                  disabled={loading}
                  className="whitespace-nowrap"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Actualizar</span>
                  <span className="sm:hidden">Act.</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportToCSV}
                  disabled={data.length === 0}
                  className="whitespace-nowrap"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Exportar CSV</span>
                  <span className="sm:hidden">CSV</span>
                </Button>
                <Button 
                  onClick={() => setShowImporter(!showImporter)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Importar Datos</span>
                  <span className="sm:hidden">Importar</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Importador de archivos */}
      {showImporter && (
        <FileImporter onDataImported={handleDataImported} />
      )}

      {/* Tabla de datos */}
      <Card>
        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
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
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-blue-100 sticky top-0">
                    <tr>
                      {columns.map((col) => (
                        <th key={col.accessor} className="px-3 py-3 border-b text-xs font-bold text-blue-900 text-left whitespace-nowrap min-w-[120px]">
                          {col.Header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-blue-50 border-b">
                        {columns.map((col) => (
                          <td key={col.accessor} className="px-3 py-3 text-sm whitespace-nowrap">
                            {col.accessor === 'evaluacionEnviada' ? (
                              <Badge 
                                variant={row[col.accessor] === 'Sí' || row[col.accessor] === 'Si' ? 'default' : 'secondary'}
                                className={row[col.accessor] === 'Sí' || row[col.accessor] === 'Si' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                              >
                                {row[col.accessor] || 'No'}
                              </Badge>
                            ) : col.accessor === 'notaPractica' && row[col.accessor] ? (
                              <Badge 
                                variant="outline"
                                className={parseFloat(row[col.accessor]) >= 4.0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                              >
                                {row[col.accessor]}
                              </Badge>
                            ) : col.accessor === 'email' || col.accessor === 'emailEmpresa' ? (
                              <a 
                                href={`mailto:${row[col.accessor as keyof StudentData]}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {row[col.accessor as keyof StudentData] || '-'}
                              </a>
                            ) : (
                              <span className="max-w-[200px] truncate block" title={String(row[col.accessor as keyof StudentData] || '-')}>
                                {row[col.accessor as keyof StudentData] || '-'}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de cards para pantallas medianas */}
              <div className="hidden md:block lg:hidden overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                    <tr>
                      <th className="px-3 py-3 border-b border-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 text-left">ESTUDIANTE</th>
                      <th className="px-3 py-3 border-b border-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 text-left">EMPRESA</th>
                      <th className="px-3 py-3 border-b border-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 text-left">UBICACIÓN</th>
                      <th className="px-3 py-3 border-b border-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 text-left">PRÁCTICA</th>
                      <th className="px-3 py-3 border-b border-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 text-left">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100">
                        <td className="px-3 py-3 text-sm">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{row.nombreEstudiante}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{row.rut}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{row.carrera}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{row.nombreEmpresa}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{row.jefeDirecto}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{row.cargo}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm">
                          <div>
                            <p className="font-medium">{row.comuna}</p>
                            <p className="text-xs text-gray-500">{row.region}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm">
                          <div>
                            <p className="text-xs">{row.fechaInicio} - {row.fechaTermino}</p>
                            <p className="text-xs text-gray-500">{row.horasPractica} hrs</p>
                            {row.notaPractica && (
                              <Badge 
                                variant="outline"
                                className={parseFloat(row.notaPractica) >= 4.0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                              >
                                {row.notaPractica}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm">
                          <Badge 
                            variant={row.evaluacionEnviada === 'Sí' || row.evaluacionEnviada === 'Si' ? 'default' : 'secondary'}
                            className={row.evaluacionEnviada === 'Sí' || row.evaluacionEnviada === 'Si' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {row.evaluacionEnviada || 'No'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de cards para móviles */}
              <div className="md:hidden space-y-4 p-4">
                {data.map((row, idx) => (
                  <Card key={row.id || idx} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{row.nombreEstudiante}</h3>
                            <p className="text-sm text-gray-600">{row.rut}</p>
                          </div>
                          <Badge 
                            variant={row.evaluacionEnviada === 'Sí' || row.evaluacionEnviada === 'Si' ? 'default' : 'secondary'}
                            className={row.evaluacionEnviada === 'Sí' || row.evaluacionEnviada === 'Si' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {row.evaluacionEnviada || 'No'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Carrera:</span>
                            <span className="ml-2">{row.carrera}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Facultad:</span>
                            <span className="ml-2">{row.facultad}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Empresa:</span>
                            <span className="ml-2">{row.nombreEmpresa}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Ubicación:</span>
                            <span className="ml-2">{row.comuna}, {row.region}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Jefe Directo:</span>
                            <span className="ml-2">{row.jefeDirecto}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Cargo:</span>
                            <span className="ml-2">{row.cargo}</span>
                          </div>
                          {row.email && (
                            <div>
                              <span className="font-medium text-gray-700">Email:</span>
                              <a 
                                href={`mailto:${row.email}`}
                                className="ml-2 text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {row.email}
                              </a>
                            </div>
                          )}
                          {(row.fechaInicio || row.fechaTermino) && (
                            <div>
                              <span className="font-medium text-gray-700">Período:</span>
                              <span className="ml-2">{row.fechaInicio} - {row.fechaTermino}</span>
                            </div>
                          )}
                          {row.horasPractica && (
                            <div>
                              <span className="font-medium text-gray-700">Horas:</span>
                              <span className="ml-2">{row.horasPractica} hrs</span>
                            </div>
                          )}
                          {row.notaPractica && (
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700">Nota:</span>
                              <Badge 
                                variant="outline"
                                className={`ml-2 ${parseFloat(row.notaPractica) >= 4.0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                              >
                                {row.notaPractica}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Footer de información */}
              {data.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 border-t">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span>Mostrando {data.length} estudiante{data.length !== 1 ? 's' : ''}</span>
                    <span className="text-xs hidden lg:block">Desliza horizontalmente para ver todas las columnas →</span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      {data.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-blue-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center sm:text-left">
                  <span className="block sm:inline">Total de estudiantes:</span>
                  <strong className="ml-1">{data.length}</strong>
                </div>
                <div className="text-center sm:text-left">
                  <span className="block sm:inline">Evaluaciones enviadas:</span>
                  <strong className="ml-1">
                    {data.filter(student => student.evaluacionEnviada === 'Sí' || student.evaluacionEnviada === 'Si').length}
                  </strong>
                </div>
                <div className="text-center sm:text-left">
                  <span className="block sm:inline">Pendientes:</span>
                  <strong className="ml-1">
                    {data.filter(student => student.evaluacionEnviada !== 'Sí' && student.evaluacionEnviada !== 'Si').length}
                  </strong>
                </div>
              </div>
              <div className="text-xs text-blue-600 text-center sm:text-right">
                Sincronizado con Firebase
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
