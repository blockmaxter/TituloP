import { useState } from 'react'
import { FileImporter } from "./file-importer"
import { useFirebaseData } from "@/hooks/useFirebaseData"
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { StudentCareerComparisonChart, StudentCompanyChart, StudentAreaChart, StudentTimelineChart, StudentCareerEvaluationChart } from './charts/student-detail-charts'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { RefreshCw, Download, Upload, Database, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2, Save, X, Eye } from "lucide-react"

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
  { Header: "ACCIONES", accessor: "acciones" },
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
  
  // Estados para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para edición y eliminación
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [studentToView, setStudentToView] = useState<StudentData | null>(null);
  const [editFormData, setEditFormData] = useState<StudentData>({
    nombreEstudiante: '',
    rut: '',
    facultad: '',
    carrera: '',
    nombreEmpresa: '',
    comuna: '',
    supervisorPractica: '',
    emailAlumno: '',
    cargo: '',
    areaEstudiante: '',
    semestre: '',
    anioPractica: '',
    anioIngreso: '',
    evaluacionEnviada: 'No'
  });

  // Función helper para normalizar el estado de evaluación
  const normalizeEvaluationStatus = (status: string | undefined): boolean => {
    if (!status) return false;
    const normalized = status.toString().toLowerCase().trim();
    return normalized === 'si' || normalized === 'sí' || normalized === 'yes' || normalized === 'true' || normalized === '1';
  };

  // Función para filtrar datos
  const filteredData = data.filter(student => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      student.nombreEstudiante.toLowerCase().includes(searchLower) ||
      student.rut.toLowerCase().includes(searchLower) ||
      student.facultad.toLowerCase().includes(searchLower) ||
      student.carrera.toLowerCase().includes(searchLower) ||
      student.nombreEmpresa.toLowerCase().includes(searchLower) ||
      student.comuna.toLowerCase().includes(searchLower) ||
      student.supervisorPractica.toLowerCase().includes(searchLower) ||
      student.emailAlumno.toLowerCase().includes(searchLower) ||
      student.cargo.toLowerCase().includes(searchLower) ||
      student.areaEstudiante.toLowerCase().includes(searchLower) ||
      student.semestre.toLowerCase().includes(searchLower) ||
      student.anioPractica.toLowerCase().includes(searchLower) ||
      student.anioIngreso.toLowerCase().includes(searchLower) ||
      student.evaluacionEnviada.toLowerCase().includes(searchLower)
    );
  });

  // Calcular datos paginados
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Funciones de navegación de páginas
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Resetear página cuando se cambia el filtro
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Resetear página cuando se cambian items por página
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Funciones para manejar edición
  const handleEditStudent = (student: StudentData) => {
    setEditingStudent(student);
    setEditFormData({ ...student });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingStudent?.id) return;

    try {
      const docRef = doc(db, 'estudiantes', editingStudent.id);
      await updateDoc(docRef, {
        ...editFormData,
        fechaActualizacion: new Date().toISOString()
      });
      
      setEditDialogOpen(false);
      setEditingStudent(null);
      // Los datos se actualizarán automáticamente por el listener
    } catch (error) {
      console.error('Error updating student:', error);
      // Aquí podrías agregar un toast de error
    }
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingStudent(null);
    setEditFormData({
      nombreEstudiante: '',
      rut: '',
      facultad: '',
      carrera: '',
      nombreEmpresa: '',
      comuna: '',
      supervisorPractica: '',
      emailAlumno: '',
      cargo: '',
      areaEstudiante: '',
      semestre: '',
      anioPractica: '',
      anioIngreso: '',
      evaluacionEnviada: 'No'
    });
  };

  // Funciones para manejar eliminación
  const handleDeleteStudent = (student: StudentData) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  // Funciones para manejar vista de detalle
  const handleViewStudent = (student: StudentData) => {
    setStudentToView(student);
    setViewDialogOpen(true);
  };

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setStudentToView(null);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete?.id) return;

    try {
      const docRef = doc(db, 'estudiantes', studentToDelete.id);
      await deleteDoc(docRef);
      
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      // Los datos se actualizarán automáticamente por el listener
    } catch (error) {
      console.error('Error deleting student:', error);
      // Aquí podrías agregar un toast de error
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  // Función para actualizar datos del formulario
  const handleFormFieldChange = (field: keyof StudentData, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDataImported = () => {
    setShowImporter(false);
    setSearchTerm(''); // Limpiar filtro cuando se importan nuevos datos
    setCurrentPage(1); // Volver a la primera página
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
                  {totalItems} estudiante{totalItems !== 1 ? 's' : ''} {searchTerm && `(filtrado de ${data.length})`}
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
                className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
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

        {/* Barra de búsqueda y controles */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Buscador */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar estudiantes..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearchChange('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </Button>
                )}
              </div>
              
              {/* Controles de paginación */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Elementos por página:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="border border-gray-200 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-300 px-3">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} resultados
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de datos */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {totalItems === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
                <div className="flex flex-col items-center gap-6">
                  {searchTerm ? (
                    <>
                      <div className="p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full">
                        <Search className="h-20 w-20 text-amber-600" />
                      </div>
                      <div className="space-y-3 max-w-md">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">No se encontraron resultados</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                          No hay estudiantes que coincidan con "<strong>{searchTerm}</strong>"
                        </p>
                        <Button 
                          onClick={() => handleSearchChange('')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Limpiar filtro
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                        <Database className="h-20 w-20 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">No hay datos disponibles</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Importa un archivo Excel o CSV para comenzar</p>
                      </div>
                      <Button 
                        onClick={() => setShowImporter(true)}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Importar Datos
                      </Button>
                    </>
                  )}
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
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
                        {currentData.map((row, idx) => (
                          <tr key={row.id || idx} className="hover:bg-blue-50/50 transition-all duration-200 group">
                            {columns.map((col) => (
                              <td key={col.accessor} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                                {col.accessor === 'evaluacionEnviada' ? (
                                  <Badge 
                                    className={row[col.accessor] === 'Sí' || row[col.accessor] === 'Si' ? 
                                      'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 shadow-sm' : 
                                      'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 shadow-sm'
                                    }
                                  >
                                    {row[col.accessor] || 'No'}
                                  </Badge>
                                ) : col.accessor === 'emailAlumno' ? (
                                  <a 
                                    href={`mailto:${row[col.accessor as keyof StudentData]}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                                  >
                                    {row[col.accessor as keyof StudentData] || '-'}
                                  </a>
                                ) : col.accessor === 'nombreEstudiante' ? (
                                  <button 
                                    onClick={() => handleViewStudent(row)}
                                    className="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer text-left transition-colors"
                                    title="Click para ver detalle"
                                  >
                                    {row[col.accessor as keyof StudentData] || '-'}
                                  </button>
                                ) : col.accessor === 'nombreEmpresa' ? (
                                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                                    {row[col.accessor as keyof StudentData] || '-'}
                                  </div>
                                ) : col.accessor === 'acciones' ? (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewStudent(row)}
                                      className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                      title="Ver detalle"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditStudent(row)}
                                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                      title="Editar"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteStudent(row)}
                                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
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
                  {currentData.map((row, idx) => (
                    <Card key={row.id || idx} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
                      {/* Header del card */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <button 
                              onClick={() => handleViewStudent(row)}
                              className="font-bold text-xl leading-tight truncate hover:underline cursor-pointer text-left w-full text-white hover:text-blue-200 transition-colors"
                              title="Click para ver detalle"
                            >
                              {row.nombreEstudiante}
                            </button>
                            <p className="text-blue-100 text-sm mt-2">{row.rut}</p>
                          </div>
                          <Badge 
                            className={normalizeEvaluationStatus(row.evaluacionEnviada) ? 
                              'bg-emerald-500 text-white border-emerald-400 shadow-lg' : 
                              'bg-amber-500 text-white border-amber-400 shadow-lg'
                            }
                          >
                            {normalizeEvaluationStatus(row.evaluacionEnviada) ? '✅ Completada' : '⏳ Pendiente'}
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
                              <span className="font-semibold text-gray-600 dark:text-gray-400">Carrera:</span>
                              <span className="text-gray-800 dark:text-gray-200 font-medium">{row.carrera}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600 dark:text-gray-400">Facultad:</span>
                              <span className="text-gray-800 dark:text-gray-200">{row.facultad}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600 dark:text-gray-400">Semestre:</span>
                              <span className="text-gray-800 dark:text-gray-200 font-medium">{row.semestre}</span>
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
                              <span className="font-bold text-gray-900 dark:text-gray-100 text-base block">{row.nombreEmpresa}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600 dark:text-gray-400">Supervisor:</span>
                              <span className="text-gray-800 dark:text-gray-200">{row.supervisorPractica}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600 dark:text-gray-400">Cargo:</span>
                              <span className="text-gray-800 dark:text-gray-200">{row.cargo}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-600 dark:text-gray-400">Ubicación:</span>
                              <span className="text-gray-800 dark:text-gray-200">{row.comuna}</span>
                            </div>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col gap-3">
                          {row.emailAlumno && (
                            <Button 
                              asChild
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <a href={`mailto:${row.emailAlumno}`}>
                                ✉️ Contactar Estudiante
                              </a>
                            </Button>
                          )}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleViewStudent(row)}
                              className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleEditStudent(row)}
                              className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDeleteStudent(row)}
                              className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controles de paginación inferior */}
        {totalPages > 1 && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} resultados
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-300 px-4">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                    {data.filter(student => normalizeEvaluationStatus(student.evaluacionEnviada)).length}
                  </div>
                  <div className="text-emerald-100 text-lg font-medium">Evaluaciones Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-amber-300">
                    {data.filter(student => !normalizeEvaluationStatus(student.evaluacionEnviada)).length}
                  </div>
                  <div className="text-amber-100 text-lg font-medium">Pendientes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Diálogo de vista de detalle */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-gray-50 to-white border shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              Detalle del Estudiante
            </DialogTitle>
            <DialogDescription>
              Vista completa de toda la información del estudiante
            </DialogDescription>
          </DialogHeader>
          
          {studentToView && (
            <div className="py-4">
              {/* Header con información principal */}
              <div className="bg-gradient-to-r from-white to-slate-100 p-6 rounded-lg mb-6 border border-gray-300 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{studentToView.nombreEstudiante}</h2>
                    <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">RUT: {studentToView.rut}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      className={normalizeEvaluationStatus(studentToView.evaluacionEnviada) ? 
                        'bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2 text-lg font-semibold' : 
                        'bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 text-lg font-semibold'
                      }
                    >
                      {normalizeEvaluationStatus(studentToView.evaluacionEnviada) 
                        ? '✅ Evaluación Completada' 
                        : '⏳ Evaluación Pendiente'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Información Académica */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="border-l-4 border-l-blue-600 bg-white dark:bg-gray-800 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                      🎓 Información Académica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Facultad</span>
                        <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.facultad || 'No especificado'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Carrera</span>
                        <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.carrera || 'No especificado'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Semestre</span>
                        <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.semestre || 'No especificado'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Año de Ingreso</span>
                        <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.anioIngreso || 'No especificado'}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Área de Estudiante</span>
                      <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.areaEstudiante || 'No especificado'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Información de Práctica */}
                <Card className="border-l-4 border-l-purple-600 bg-white dark:bg-gray-800 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-800 dark:text-purple-400 flex items-center gap-2">
                      💼 Información de Práctica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Empresa</span>
                      <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">{studentToView.nombreEmpresa || 'No especificado'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Cargo</span>
                        <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.cargo || 'No especificado'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Año de Práctica</span>
                        <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.anioPractica || 'No especificado'}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Comuna</span>
                      <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.comuna || 'No especificado'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Información de Contacto y Supervisión */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-green-600 bg-white dark:bg-gray-800 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                      📞 Información de Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Email</span>
                      {studentToView.emailAlumno ? (
                        <div className="flex items-center gap-2">
                          <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.emailAlumno}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-8 px-3"
                          >
                            <a href={`mailto:${studentToView.emailAlumno}`}>
                              📧 Contactar
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">No especificado</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-600 bg-white dark:bg-gray-800 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                      👨‍💼 Supervisión
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Supervisor de Práctica</span>
                      <p className="text-slate-900 dark:text-slate-100 font-medium">{studentToView.supervisorPractica || 'No especificado'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sección de Gráficos y Análisis */}
              <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                    📈 Análisis y Contexto
                  </h3>
                  <p className="text-slate-700">Gráficos que muestran el contexto del estudiante en relación con otros datos</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <StudentCareerComparisonChart student={studentToView} />
                  <StudentCareerEvaluationChart student={studentToView} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StudentCompanyChart student={studentToView} />
                  <StudentAreaChart student={studentToView} />
                </div>
                
                <div className="grid grid-cols-1 gap-6 mt-6">
                  <StudentTimelineChart student={studentToView} />
                </div>
              </div>

              {/* Metadatos */}
              {studentToView.fechaImportacion && (
                <div className="mt-6 pt-4 border-t border-slate-300 bg-slate-50 p-4 rounded-lg">
                  <div className="text-center">
                    <span className="text-sm text-slate-600 font-medium">
                      Datos importados el {new Date(studentToView.fechaImportacion).toLocaleString('es-CL')}
                    </span>
                    {studentToView.id && (
                      <span className="text-sm text-gray-400 ml-4">
                        ID: {studentToView.id}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseView}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
            {studentToView && (
              <Button
                onClick={() => {
                  handleCloseView();
                  handleEditStudent(studentToView);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Estudiante</DialogTitle>
            <DialogDescription>
              Modifica la información del estudiante. Los cambios se guardarán en la base de datos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombreEstudiante">Nombre Estudiante</Label>
              <Input
                id="nombreEstudiante"
                value={editFormData.nombreEstudiante}
                onChange={(e) => handleFormFieldChange('nombreEstudiante', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input
                id="rut"
                value={editFormData.rut}
                onChange={(e) => handleFormFieldChange('rut', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facultad">Facultad</Label>
              <Input
                id="facultad"
                value={editFormData.facultad}
                onChange={(e) => handleFormFieldChange('facultad', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera</Label>
              <Input
                id="carrera"
                value={editFormData.carrera}
                onChange={(e) => handleFormFieldChange('carrera', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombreEmpresa">Nombre Empresa</Label>
              <Input
                id="nombreEmpresa"
                value={editFormData.nombreEmpresa}
                onChange={(e) => handleFormFieldChange('nombreEmpresa', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comuna">Comuna</Label>
              <Input
                id="comuna"
                value={editFormData.comuna}
                onChange={(e) => handleFormFieldChange('comuna', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisorPractica">Supervisor de Práctica</Label>
              <Input
                id="supervisorPractica"
                value={editFormData.supervisorPractica}
                onChange={(e) => handleFormFieldChange('supervisorPractica', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailAlumno">Email Alumno</Label>
              <Input
                id="emailAlumno"
                type="email"
                value={editFormData.emailAlumno}
                onChange={(e) => handleFormFieldChange('emailAlumno', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={editFormData.cargo}
                onChange={(e) => handleFormFieldChange('cargo', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaEstudiante">Área de Estudiante</Label>
              <Input
                id="areaEstudiante"
                value={editFormData.areaEstudiante}
                onChange={(e) => handleFormFieldChange('areaEstudiante', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semestre">Semestre</Label>
              <Input
                id="semestre"
                value={editFormData.semestre}
                onChange={(e) => handleFormFieldChange('semestre', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anioPractica">Año Práctica</Label>
              <Input
                id="anioPractica"
                value={editFormData.anioPractica}
                onChange={(e) => handleFormFieldChange('anioPractica', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anioIngreso">Año Ingreso</Label>
              <Input
                id="anioIngreso"
                value={editFormData.anioIngreso}
                onChange={(e) => handleFormFieldChange('anioIngreso', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluacionEnviada">Evaluación Enviada</Label>
              <select
                id="evaluacionEnviada"
                value={editFormData.evaluacionEnviada}
                onChange={(e) => handleFormFieldChange('evaluacionEnviada', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Eliminar Estudiante</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este estudiante?
            </DialogDescription>
          </DialogHeader>
          
          {studentToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-lg">{studentToDelete.nombreEstudiante}</h4>
                <p className="text-gray-600">RUT: {studentToDelete.rut}</p>
                <p className="text-gray-600">Carrera: {studentToDelete.carrera}</p>
                <p className="text-gray-600">Empresa: {studentToDelete.nombreEmpresa}</p>
              </div>
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <strong>¡Atención!</strong> Esta acción no se puede deshacer. Toda la información del estudiante será eliminada permanentemente.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}