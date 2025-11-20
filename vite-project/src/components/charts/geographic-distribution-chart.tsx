import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFirebaseData } from "@/hooks/useFirebaseData"
import { MapPin, Building, Users, Navigation, Search, X, User } from "lucide-react"
import { findCoordinates, chileCenterCoordinates } from "@/utils/chile-coordinates"
import "./geographic-map-animations.css"
import { verificarFuncionalidadesMapa } from "@/utils/verificacion-mapa-geografico"

interface ComunaData {
  name: string;
  studentCount: number;
  empresas: string[];
  coordinates: { lat: number; lng: number; region: string } | null;
}

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

interface SearchResult {
  student: StudentData;
  comuna: ComunaData | null;
}

export function GeographicDistributionChart() {
  const { data, loading, error } = useFirebaseData()
  const [selectedComuna, setSelectedComuna] = useState<ComunaData | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false)
  const [mapZoom, setMapZoom] = useState<{ lat: number; lng: number; zoom: number } | null>(null)
  const [highlightedComuna, setHighlightedComuna] = useState<string | null>(null)
  const [previouslyHighlighted, setPreviouslyHighlighted] = useState<string | null>(null)

  const comunaData = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    // Agrupar por comuna
    const comunaGroups = data.reduce((acc, student) => {
      const comuna = student.comuna || 'Sin especificar';
      if (!acc[comuna]) {
        acc[comuna] = {
          count: 0,
          empresas: new Set<string>()
        };
      }
      acc[comuna].count++;
      if (student.nombreEmpresa) {
        acc[comuna].empresas.add(student.nombreEmpresa);
      }
      return acc;
    }, {} as Record<string, { count: number; empresas: Set<string> }>);

    // Convertir a formato con coordenadas
    return Object.entries(comunaGroups).map(([comuna, data]) => ({
      name: comuna,
      studentCount: data.count,
      empresas: Array.from(data.empresas),
      coordinates: findCoordinates(comuna)
    })).sort((a, b) => b.studentCount - a.studentCount);
  }, [data]);

  // Función para buscar estudiantes
  const searchStudents = (query: string) => {
    if (!query.trim() || !data) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    data.forEach(student => {
      const matches = [
        student.nombreEstudiante?.toLowerCase().includes(normalizedQuery),
        student.rut?.toLowerCase().includes(normalizedQuery),
        student.carrera?.toLowerCase().includes(normalizedQuery),
        student.nombreEmpresa?.toLowerCase().includes(normalizedQuery),
        student.comuna?.toLowerCase().includes(normalizedQuery),
        student.cargo?.toLowerCase().includes(normalizedQuery)
      ].some(Boolean);

      if (matches) {
        const comunaInfo = comunaData.find(c => c.name === (student.comuna || 'Sin especificar'));
        results.push({
          student,
          comuna: comunaInfo || null
        });
      }
    });

    setSearchResults(results.slice(0, 10)); // Limitar a 10 resultados
    setShowSearchResults(true);
  };

  // Verificación de funcionalidades del mapa
  React.useEffect(() => {
    if (data && data.length > 0) {
      setTimeout(() => {
        verificarFuncionalidadesMapa();
      }, 2000);
    }
  }, [data]);

  // Manejar búsqueda en tiempo real
  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchStudents(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, data, comunaData]);

  // Función para seleccionar un estudiante y mostrar su ubicación
  const handleSelectStudent = (student: StudentData) => {
    // Restaurar el estilo del estudiante anterior
    if (selectedStudent && selectedStudent.comuna !== student.comuna) {
      setPreviouslyHighlighted(selectedStudent.comuna);
    }
    
    setSelectedStudent(student);
    setShowSearchResults(false);
    setSearchQuery('');
    
    // Buscar y seleccionar la comuna del estudiante
    const studentComuna = comunaData.find(c => c.name === (student.comuna || 'Sin especificar'));
    if (studentComuna && studentComuna.coordinates) {
      setSelectedComuna(studentComuna);
      
      // Configurar zoom hacia la comuna del estudiante
      setMapZoom({
        lat: studentComuna.coordinates.lat,
        lng: studentComuna.coordinates.lng,
        zoom: 12
      });
      
      // Resaltar la nueva comuna
      setHighlightedComuna(student.comuna);
      
      // Crear animación de zoom suave
      setTimeout(() => {
        const mapElement = document.getElementById('chile-map');
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      // Si no se encuentra la comuna, limpiar el zoom
      setMapZoom(null);
      setHighlightedComuna(null);
    }
  };

  // Función para limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setSelectedStudent(null);
    setSelectedComuna(null);
    setMapZoom(null);
    setHighlightedComuna(null);
    setPreviouslyHighlighted(null);
    
    // Enfocar de nuevo el input de búsqueda
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="Busca por"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Mapa de Chile - Distribución por Comunas
          </CardTitle>
          <CardDescription>
            Ubicación geográfica de estudiantes y empresas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Error al cargar datos geográficos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Mapa de Chile - Distribución por Comunas
          </CardTitle>
          <CardDescription>
            Ubicación geográfica de estudiantes y empresas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay datos disponibles para mostrar en el mapa</p>
              <p className="text-sm text-gray-400 mt-2">Importa datos CSV para visualizar la distribución geográfica</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda */}
      <Card className="shadow-sm border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🔍 Búsqueda de Estudiantes
              </h3>
              {data && (
                <Badge variant="outline" className="text-xs">
                  📋 {data.length} estudiantes registrados
                </Badge>
              )}
            </div>
            <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="🔍 Busca por: nombre, RUT, empresa, comuna, carrera, cargo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-11 text-sm"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Resultados de búsqueda */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      📋 {searchResults.length} resultado(s) encontrado(s)
                    </span>
                    <Badge variant="outline" className="text-xs">
                      🔍 Búsqueda: "{searchQuery}"
                    </Badge>
                  </div>
                </div>
                <div className="p-1">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="m-1 p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer rounded-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
                      onClick={() => handleSelectStudent(result.student)}
                    >
                      <div className="space-y-3">
                        {/* Header con nombre y RUT */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {result.student.nombreEstudiante.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                  {result.student.nombreEstudiante}
                                </span>
                                <Badge variant="outline" className="text-xs font-mono">
                                  {result.student.rut}
                                </Badge>
                              </div>
                              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                {result.student.carrera}
                              </div>
                            </div>
                          </div>
                          {result.comuna?.coordinates ? (
                            <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                              📍 Ubicable
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              📍 Sin coordenadas
                            </Badge>
                          )}
                        </div>

                        {/* Información detallada */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {/* Información Académica */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                              🎓 Información Académica
                            </h4>
                            <div className="space-y-1 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                              <p><span className="text-gray-500">Facultad:</span> <span className="font-medium">{result.student.facultad}</span></p>
                              <p><span className="text-gray-500">Semestre:</span> <span className="font-medium">{result.student.semestre}</span></p>
                              <p><span className="text-gray-500">Año Ingreso:</span> <span className="font-medium">{result.student.anioIngreso}</span></p>
                              <p><span className="text-gray-500">Email:</span> <span className="font-medium text-blue-600">{result.student.emailAlumno}</span></p>
                            </div>
                          </div>

                          {/* Información de Práctica */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                              💼 Información de Práctica
                            </h4>
                            <div className="space-y-1 pl-4 border-l-2 border-green-200 dark:border-green-800">
                              <p><span className="text-gray-500">Empresa:</span> <span className="font-semibold text-green-700 dark:text-green-400">{result.student.nombreEmpresa}</span></p>
                              <p><span className="text-gray-500">Cargo:</span> <span className="font-medium">{result.student.cargo}</span></p>
                              <p><span className="text-gray-500">Área:</span> <span className="font-medium">{result.student.areaEstudiante}</span></p>
                              <p><span className="text-gray-500">Supervisor:</span> <span className="font-medium">{result.student.supervisorPractica}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* Información Geográfica */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {result.student.comuna}
                              </span>
                              {result.comuna?.coordinates && (
                                <span className="text-sm text-gray-500">
                                  • {result.comuna.coordinates.region}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {result.comuna?.studentCount || 0} estudiantes
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {result.comuna?.empresas.length || 0} empresas
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Estado de evaluación */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Estado de Evaluación:</span>
                            <Badge className={result.student.evaluacionEnviada?.toLowerCase() === 'si' ? 
                              'bg-emerald-100 text-emerald-800 border-emerald-200 text-xs' : 
                              'bg-amber-100 text-amber-800 border-amber-200 text-xs'
                            }>
                              {result.student.evaluacionEnviada?.toLowerCase() === 'si' ? '✅ Completada' : '⏳ Pendiente'}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-400">
                            Práctica {result.student.anioPractica}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-6 text-center">
                <div className="text-gray-500 dark:text-gray-400 space-y-3">
                  <Search className="h-12 w-12 mx-auto opacity-30" />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                      No se encontraron estudiantes
                    </p>
                    <p className="text-sm">
                      No hay coincidencias para <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">"{searchQuery}"</span>
                    </p>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-medium text-gray-600 dark:text-gray-400">💡 Sugerencias:</p>
                    <ul className="text-left space-y-1 max-w-sm mx-auto">
                      <li>• Verifica la ortografía del nombre</li>
                      <li>• Intenta buscar por RUT (ej: 12.345.678-9)</li>
                      <li>• Prueba con el nombre de la empresa</li>
                      <li>• Busca por comuna (ej: Santiago, Valparaíso)</li>
                      <li>• Intenta con términos más generales</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estudiante Seleccionado */}
      {selectedStudent && (
        <Card className="shadow-lg border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedStudent.nombreEstudiante.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    {selectedStudent.nombreEstudiante}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {selectedStudent.rut}
                    </Badge>
                    <Badge className={selectedStudent.evaluacionEnviada?.toLowerCase() === 'si' ? 
                      'bg-emerald-100 text-emerald-800 border-emerald-200 text-xs' : 
                      'bg-amber-100 text-amber-800 border-amber-200 text-xs'
                    }>
                      {selectedStudent.evaluacionEnviada?.toLowerCase() === 'si' ? '✅ Evaluación Completada' : '⏳ Evaluación Pendiente'}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStudent(null)}
                className="h-8 w-8 p-0 hover:bg-white/80 dark:hover:bg-gray-700/80"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Información Personal */}
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 text-base">
                  🎓 Información Académica
                </h4>
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Carrera:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-semibold text-right max-w-32">{selectedStudent.carrera}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Facultad:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{selectedStudent.facultad}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Semestre:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{selectedStudent.semestre}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Año Ingreso:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{selectedStudent.anioIngreso}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400 font-medium text-xs">Contacto:</span>
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium truncate">
                        {selectedStudent.emailAlumno}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de Práctica */}
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 text-base">
                  💼 Información de Práctica
                </h4>
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium text-xs">Empresa:</span>
                      <p className="text-green-700 dark:text-green-400 font-bold text-base">{selectedStudent.nombreEmpresa}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Cargo:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-right max-w-32">{selectedStudent.cargo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Área:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-right max-w-32">{selectedStudent.areaEstudiante}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Supervisor:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium text-right max-w-32">{selectedStudent.supervisorPractica}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Año Práctica:</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedStudent.anioPractica}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubicación Geográfica */}
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 text-base">
                  🗺️ Ubicación Geográfica
                </h4>
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium text-xs">Comuna:</span>
                      <p className="text-purple-700 dark:text-purple-400 font-bold text-base">{selectedStudent.comuna}</p>
                    </div>
                    {comunaData.find(c => c.name === selectedStudent.comuna)?.coordinates && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 font-medium text-xs">Región:</span>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {comunaData.find(c => c.name === selectedStudent.comuna)?.coordinates?.region}
                        </p>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="space-y-2">
                        {comunaData.find(c => c.name === selectedStudent.comuna)?.coordinates ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 w-full justify-center">
                            📍 Ubicación disponible en mapa
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 w-full justify-center">
                            ⚠️ Comuna no identificada en mapa
                          </Badge>
                        )}
                        {comunaData.find(c => c.name === selectedStudent.comuna) && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
                            <p>
                              <Users className="h-3 w-3 inline mr-1" />
                              {comunaData.find(c => c.name === selectedStudent.comuna)?.studentCount} estudiantes en la comuna
                            </p>
                            <p>
                              <Building className="h-3 w-3 inline mr-1" />
                              {comunaData.find(c => c.name === selectedStudent.comuna)?.empresas.length} empresas registradas
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen rápido */}
            <div className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-4">
              <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                📊 Resumen de Práctica
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-blue-600 text-lg">{selectedStudent.anioPractica}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">Año de Práctica</div>
                </div>
                <div>
                  <div className="font-bold text-green-600 text-lg">
                    {comunaData.find(c => c.name === selectedStudent.comuna)?.studentCount || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">Estudiantes en Comuna</div>
                </div>
                <div>
                  <div className="font-bold text-purple-600 text-lg">
                    {comunaData.find(c => c.name === selectedStudent.comuna)?.empresas.length || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">Empresas en Comuna</div>
                </div>
                <div>
                  <div className="font-bold text-orange-600 text-lg">
                    {selectedStudent.evaluacionEnviada?.toLowerCase() === 'si' ? '✓' : '⏳'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">Estado Evaluación</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapa Principal */}
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Mapa de Chile - Distribución por Comunas
            {selectedStudent && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 ml-2">
                👤 {selectedStudent.nombreEstudiante}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Ubicación geográfica de estudiantes y empresas • {data.length} estudiantes en {comunaData.length} comunas
            {selectedStudent && (
              <span className="block mt-1 text-blue-600 font-medium">
                📍 Mostrando ubicación de {selectedStudent.nombreEstudiante} en {selectedStudent.comuna}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Controles de zoom */}
          {mapZoom && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                  🔍 Enfocado en {highlightedComuna}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMapZoom(null);
                  setHighlightedComuna(null);
                  setPreviouslyHighlighted(selectedStudent?.comuna || null);
                }}
                className="text-xs border-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                🌎 Vista completa
              </Button>
            </div>
          )}
          
          {/* Mapa embebido con OpenStreetMap */}
          <div className="h-96 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 map-zoom-transition">
            <div 
              id="chile-map" 
              className="w-full h-full relative bg-gray-100 dark:bg-gray-800 map-zoom-transition"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px',
                transform: mapZoom ? 'scale(1.02)' : 'scale(1)',
                filter: mapZoom ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)'
              }}
            >
              {/* Iframe con mapa de OpenStreetMap */}
              <iframe
                key={mapZoom ? `${mapZoom.lat}-${mapZoom.lng}-${mapZoom.zoom}` : 'default'}
                src={mapZoom 
                  ? `https://www.openstreetmap.org/export/embed.html?bbox=${mapZoom.lng-0.5},${mapZoom.lat-0.5},${mapZoom.lng+0.5},${mapZoom.lat+0.5}&layer=mapnik&marker=${mapZoom.lat}%2C${mapZoom.lng}`
                  : `https://www.openstreetmap.org/export/embed.html?bbox=-75.6441,-56.5386,-66.0986,-17.5098&layer=mapnik&marker=${chileCenterCoordinates.lat}%2C${chileCenterCoordinates.lng}`
                }
                width="100%"
                height="100%"
                style={{ border: 0, transition: 'all 0.5s ease-in-out' }}
                loading="lazy"
                title={mapZoom ? `Mapa enfocado en ${highlightedComuna}` : "Mapa de Chile - OpenStreetMap"}
              />
              
              {/* Overlay con marcadores virtuales */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Marcador especial para estudiante seleccionado */}
                {selectedStudent && comunaData.find(c => c.name === selectedStudent.comuna)?.coordinates && (() => {
                  const comuna = comunaData.find(c => c.name === selectedStudent.comuna)!;
                  const latPercent = ((comuna.coordinates!.lat + 56.5386) / (-17.5098 + 56.5386)) * 100;
                  const lngPercent = ((comuna.coordinates!.lng + 75.6441) / (-66.0986 + 75.6441)) * 100;
                  
                  return (
                    <div 
                      className="absolute student-marker-enter student-marker-pulse marker-highlight" 
                      style={{
                        left: `${Math.min(Math.max(lngPercent, 5), 95)}%`,
                        top: `${Math.min(Math.max(100 - latPercent, 5), 95)}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 30
                      }}
                    >
                      {/* Múltiples anillos de pulso para mayor impacto visual */}
                      <div className="absolute w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-ping" style={{ animationDuration: '2s' }}></div>
                      <div className="absolute w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-ping" style={{ animationDuration: '1.5s' }}></div>
                      <div className="absolute w-12 h-12 bg-blue-500 rounded-full opacity-40 animate-pulse" style={{ animationDuration: '1s' }}></div>
                      
                      {/* Marcador principal mejorado */}
                      <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white text-lg font-bold pointer-events-auto cursor-pointer hover:scale-125 transition-all duration-300 hover:shadow-blue-500/50 student-marker-heartbeat">
                        🎓
                      </div>
                      {/* Etiqueta del estudiante */}
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shadow-lg border border-blue-500">
                        <div className="flex items-center gap-1">
                          🎓 {selectedStudent.nombreEstudiante.split(' ').slice(0, 2).join(' ')}
                        </div>
                        <div className="text-center text-blue-100 text-[10px] mt-0.5">
                          {selectedStudent.comuna}
                        </div>
                        {/* Flecha apuntando al marcador */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-blue-600"></div>
                      </div>
                    </div>
                  );
                })()}
                
                {/* Marcadores regulares de comunas */}
                {comunaData.slice(0, 8).filter(comuna => comuna.coordinates).map((comuna, index) => {
                  // Calcular posición aproximada en el mapa (simplificado)
                  const latPercent = ((comuna.coordinates!.lat + 56.5386) / (-17.5098 + 56.5386)) * 100;
                  const lngPercent = ((comuna.coordinates!.lng + 75.6441) / (-66.0986 + 75.6441)) * 100;
                  
                  // No mostrar marcador regular si es la comuna del estudiante seleccionado
                  const isSelectedStudentComuna = selectedStudent && comuna.name === selectedStudent.comuna;
                  if (isSelectedStudentComuna) return null;
                  
                  // Determinar si esta comuna debe estar resaltada (fue previamente seleccionada)
                  const isPreviouslyHighlighted = previouslyHighlighted === comuna.name;
                  const isCurrentlySelected = selectedComuna?.name === comuna.name;
                  
                  // Colores con diferentes intensidades según el estado
                  let color;
                  if (isPreviouslyHighlighted) {
                    color = 'bg-gray-400 border-gray-300'; // Color atenuado para los anteriormente resaltados
                  } else if (isCurrentlySelected) {
                    color = 'bg-purple-600 border-purple-400'; // Color especial para seleccionado
                  } else {
                    color = index < 3 ? 'bg-red-500' : index < 6 ? 'bg-yellow-500' : 'bg-green-500';
                  }
                  
                  return (
                    <div
                      key={comuna.name}
                      className={`absolute w-6 h-6 ${color} rounded-full border-2 ${isPreviouslyHighlighted ? 'border-gray-300' : 'border-white'} shadow-lg flex items-center justify-center text-white text-xs font-bold transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-125 transition-all duration-500 z-10 ${
                        isCurrentlySelected ? 'animate-pulse shadow-purple-500/50' : ''
                      } ${
                        isPreviouslyHighlighted ? 'opacity-70' : 'opacity-100'
                      }`}
                      style={{
                        left: `${Math.min(Math.max(lngPercent, 5), 95)}%`,
                        top: `${Math.min(Math.max(100 - latPercent, 5), 95)}%`,
                        transform: `translate(-50%, -50%) ${
                          isPreviouslyHighlighted ? 'scale(0.9)' : isCurrentlySelected ? 'scale(1.1)' : 'scale(1)'
                        }`
                      }}
                      title={`${comuna.name}: ${comuna.studentCount} estudiantes ${isPreviouslyHighlighted ? '(anteriormente seleccionada)' : ''}`}
                      onClick={() => setSelectedComuna(selectedComuna?.name === comuna.name ? null : comuna)}
                    >
                      {comuna.studentCount}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Leyenda del mapa */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Leyenda de Marcadores
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Top 3 comunas (más estudiantes)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Comunas intermedias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Otras comunas</span>
              </div>
            </div>
            {selectedStudent && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    👤 Estudiante seleccionado: {selectedStudent.nombreEstudiante}
                  </span>
                </div>
                {mapZoom && (
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>🔍 Mapa enfocado en {selectedStudent.comuna}</span>
                  </div>
                )}
                {!comunaData.find(c => c.name === selectedStudent.comuna)?.coordinates && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>⚠️ Ubicación no disponible para {selectedStudent.comuna}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas resumidas */}
      <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Estadísticas Geográficas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{comunaData.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Comunas</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {comunaData.reduce((sum, item) => sum + item.empresas.length, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Empresas</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{data.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Estudiantes</div>
            </div>
          </div>

          {/* Lista de comunas */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Distribución por Comuna
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {comunaData.slice(0, 10).map((comuna, index) => (
                <div 
                  key={comuna.name} 
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedComuna?.name === comuna.name 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedComuna(selectedComuna?.name === comuna.name ? null : comuna)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index < 3 ? 'bg-red-500' : index < 6 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{comuna.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {comuna.coordinates?.region || 'Región no identificada'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{comuna.empresas.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{comuna.studentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {comunaData.length > 10 && (
                <div className="text-center py-2 text-sm text-gray-500">
                  ... y {comunaData.length - 10} comunas más
                </div>
              )}
            </div>
          </div>

          {/* Detalles de comuna seleccionada */}
          {selectedComuna && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {selectedComuna.name}
              </h5>
              <div className="text-sm space-y-1">
                <p><strong>Región:</strong> {selectedComuna.coordinates?.region || 'No identificada'}</p>
                <p><strong>Estudiantes:</strong> {selectedComuna.studentCount}</p>
                <p><strong>Empresas ({selectedComuna.empresas.length}):</strong></p>
                <div className="max-h-24 overflow-y-auto">
                  {selectedComuna.empresas.map((empresa, idx) => (
                    <span key={idx} className="inline-block bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                      {empresa}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}