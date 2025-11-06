import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSpreadsheet, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StudentData {
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
}

interface FileImporterProps {
  onDataImported: (data: StudentData[]) => void;
}

export function FileImporter({ onDataImported }: FileImporterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [previewData, setPreviewData] = useState<StudentData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processExcelFile = (file: File): Promise<StudentData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length < 2) {
            reject(new Error('El archivo debe contener al menos una fila de encabezados y una fila de datos'));
            return;
          }

          // Asumiendo que la primera fila son los encabezados
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          const processedData: StudentData[] = rows
            .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
            .map((row) => {
              const student: any = {};
              
              // Mapear columnas basándose en posición o nombre de encabezado
              const headerMapping: { [key: string]: keyof StudentData } = {
                'NOMBRE ESTUDIANTE': 'nombreEstudiante',
                'Nombre Estudiante': 'nombreEstudiante',
                'Nombre': 'nombreEstudiante',
                'RUT': 'rut',
                'Rut': 'rut',
                'CARRERA': 'carrera',
                'Carrera': 'carrera',
                'FACULTAD': 'facultad',
                'Facultad': 'facultad',
                'NOMBRE EMPRESA': 'nombreEmpresa',
                'Nombre Empresa': 'nombreEmpresa',
                'Empresa': 'nombreEmpresa',
                'JEFE DIRECTO': 'jefeDirecto',
                'Jefe Directo': 'jefeDirecto',
                'Jefe': 'jefeDirecto',
                'EMAIL': 'email',
                'Email': 'email',
                'Correo': 'email',
                'EMAIL ESTUDIANTE': 'email',
                'Email Estudiante': 'email',
                'CARGO': 'cargo',
                'Cargo': 'cargo',
                'COMUNA': 'comuna',
                'Comuna': 'comuna',
                'SEMESTRE': 'semestre',
                'Semestre': 'semestre',
                'AÑO PRACTICA': 'anio',
                'Año Practica': 'anio',
                'AÑO INGRESO': 'anioIngreso',
                'Año Ingreso': 'anioIngreso',
                'EVALUACION ENVIADA': 'evaluacionEnviada',
                'Evaluacion Enviada': 'evaluacionEnviada',
                'Evaluación': 'evaluacionEnviada',
                // Mapeos adicionales para compatibilidad con archivos antiguos
                'EMAIL EMPRESA': 'emailEmpresa',
                'Email Empresa': 'emailEmpresa',
                'Correo Empresa': 'emailEmpresa',
                'TELEFONO EMPRESA': 'telefonoEmpresa',
                'Telefono Empresa': 'telefonoEmpresa',
                'Teléfono Empresa': 'telefonoEmpresa',
                'REGION': 'region',
                'Región': 'region',
                'Region': 'region',
                'DIRECCION EMPRESA': 'direccionEmpresa',
                'Direccion Empresa': 'direccionEmpresa',
                'Dirección Empresa': 'direccionEmpresa',
                'AÑO': 'anio',
                'Año': 'anio',
                'FECHA INICIO': 'fechaInicio',
                'Fecha Inicio': 'fechaInicio',
                'FECHA TERMINO': 'fechaTermino',
                'Fecha Termino': 'fechaTermino',
                'Fecha Término': 'fechaTermino',
                'HORAS PRACTICA': 'horasPractica',
                'Horas Practica': 'horasPractica',
                'Horas Práctica': 'horasPractica',
                'SUPERVISOR': 'supervisor',
                'Supervisor': 'supervisor',
                'NOTA PRACTICA': 'notaPractica',
                'Nota Practica': 'notaPractica',
                'Nota Práctica': 'notaPractica'
              };

              headers.forEach((header: string, i: number) => {
                const mappedKey = headerMapping[header] || header.toLowerCase().replace(/\s+/g, '');
                if (mappedKey && row[i] !== null && row[i] !== undefined) {
                  student[mappedKey] = String(row[i]).trim();
                }
              });

              // Valores por defecto si no se encuentran en el archivo
              return {
                nombreEstudiante: student.nombreEstudiante || student.nombre || '',
                rut: student.rut || '',
                carrera: student.carrera || '',
                facultad: student.facultad || '',
                nombreEmpresa: student.nombreEmpresa || student.empresa || '',
                jefeDirecto: student.jefeDirecto || student.jefe || '',
                email: student.email || student.correo || '',
                emailEmpresa: student.emailEmpresa || '',
                telefonoEmpresa: student.telefonoEmpresa || '',
                cargo: student.cargo || '',
                comuna: student.comuna || '',
                region: student.region || '',
                direccionEmpresa: student.direccionEmpresa || '',
                semestre: student.semestre || '',
                anio: student.anio || student.año || '',
                anioIngreso: student.anioIngreso || '',
                fechaInicio: student.fechaInicio || '',
                fechaTermino: student.fechaTermino || '',
                horasPractica: student.horasPractica || '',
                evaluacionEnviada: student.evaluacionEnviada || student.evaluacion || 'No',
                supervisor: student.supervisor || '',
                notaPractica: student.notaPractica || ''
              } as StudentData;
            });

          resolve(processedData);
        } catch (error) {
          reject(new Error('Error al procesar el archivo Excel: ' + (error as Error).message));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processCSVFile = (file: File): Promise<StudentData[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const processedData: StudentData[] = results.data.map((row: any) => ({
              nombreEstudiante: row['NOMBRE ESTUDIANTE'] || row['Nombre Estudiante'] || row['Nombre'] || '',
              rut: row['RUT'] || row['Rut'] || '',
              carrera: row['CARRERA'] || row['Carrera'] || '',
              facultad: row['FACULTAD'] || row['Facultad'] || '',
              nombreEmpresa: row['NOMBRE EMPRESA'] || row['Nombre Empresa'] || row['Empresa'] || '',
              jefeDirecto: row['JEFE DIRECTO'] || row['Jefe Directo'] || row['Jefe'] || '',
              email: row['EMAIL'] || row['Email'] || row['Correo'] || row['EMAIL ESTUDIANTE'] || row['Email Estudiante'] || '',
              emailEmpresa: row['EMAIL EMPRESA'] || row['Email Empresa'] || row['Correo Empresa'] || '',
              telefonoEmpresa: row['TELEFONO EMPRESA'] || row['Telefono Empresa'] || row['Teléfono Empresa'] || '',
              cargo: row['CARGO'] || row['Cargo'] || '',
              comuna: row['COMUNA'] || row['Comuna'] || '',
              region: row['REGION'] || row['Región'] || row['Region'] || '',
              direccionEmpresa: row['DIRECCION EMPRESA'] || row['Direccion Empresa'] || row['Dirección Empresa'] || '',
              semestre: row['SEMESTRE'] || row['Semestre'] || '',
              anio: row['AÑO PRACTICA'] || row['Año Practica'] || row['AÑO'] || row['Año'] || '',
              anioIngreso: row['AÑO INGRESO'] || row['Año Ingreso'] || '',
              fechaInicio: row['FECHA INICIO'] || row['Fecha Inicio'] || '',
              fechaTermino: row['FECHA TERMINO'] || row['Fecha Termino'] || row['Fecha Término'] || '',
              horasPractica: row['HORAS PRACTICA'] || row['Horas Practica'] || row['Horas Práctica'] || '',
              evaluacionEnviada: row['EVALUACION ENVIADA'] || row['Evaluacion Enviada'] || row['Evaluación'] || 'No',
              supervisor: row['SUPERVISOR'] || row['Supervisor'] || '',
              notaPractica: row['NOTA PRACTICA'] || row['Nota Practica'] || row['Nota Práctica'] || ''
            }));
            resolve(processedData);
          } catch (error) {
            reject(new Error('Error al procesar el archivo CSV: ' + (error as Error).message));
          }
        },
        error: (error) => {
          reject(new Error('Error al parsear CSV: ' + error.message));
        }
      });
    });
  };

  const syncToFirebase = async (data: StudentData[]) => {
    try {
      // Limpiar la colección existente
      const querySnapshot = await getDocs(collection(db, 'estudiantes'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Agregar nuevos datos
      const addPromises = data.map(async (student, index) => {
        const docRef = doc(db, 'estudiantes', `estudiante_${index + 1}`);
        return setDoc(docRef, {
          ...student,
          fechaImportacion: new Date().toISOString(),
          id: `estudiante_${index + 1}`
        });
      });

      await Promise.all(addPromises);
      return true;
    } catch (error) {
      console.error('Error al sincronizar con Firebase:', error);
      throw new Error('Error al sincronizar con Firebase: ' + (error as Error).message);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadStatus('idle');
    setStatusMessage('');

    try {
      let data: StudentData[];
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        data = await processExcelFile(file);
      } else if (file.name.endsWith('.csv')) {
        data = await processCSVFile(file);
      } else {
        throw new Error('Formato de archivo no soportado. Use archivos .xlsx, .xls o .csv');
      }

      if (data.length === 0) {
        throw new Error('No se encontraron datos válidos en el archivo');
      }

      setPreviewData(data);
      setShowPreview(true);
      setStatusMessage(`Se procesaron ${data.length} registros correctamente`);

    } catch (error) {
      setUploadStatus('error');
      setStatusMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmImport = async () => {
    if (previewData.length === 0) return;

    setIsLoading(true);
    try {
      await syncToFirebase(previewData);
      onDataImported(previewData);
      setUploadStatus('success');
      setStatusMessage(`Se importaron ${previewData.length} registros exitosamente a Firebase`);
      setShowPreview(false);
      setPreviewData([]);
      
      // Limpiar el input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadStatus('error');
      setStatusMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelImport = () => {
    setShowPreview(false);
    setPreviewData([]);
    setStatusMessage('');
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Upload className="h-6 w-6" />
            </div>
            Importar Datos de Estudiantes
          </CardTitle>
          <CardDescription className="text-indigo-100 text-base mt-2">
            Sube un archivo Excel (.xlsx, .xls) o CSV con los datos de los estudiantes.
            Los datos se sincronizarán automáticamente con Firebase.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="relative">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="w-full h-14 text-sm file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 file:text-white hover:file:from-blue-700 hover:file:to-indigo-700 file:shadow-md file:transition-all file:duration-200 border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 transition-all duration-200 rounded-lg"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-3 text-blue-600">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                      <span className="font-medium">Procesando...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Badge variant="outline" className="px-3 py-2 bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel (.xlsx, .xls)
              </Badge>
              <Badge variant="outline" className="px-3 py-2 bg-blue-50 text-blue-700 border-blue-200 font-medium">
                <FileText className="h-4 w-4 mr-2" />
                CSV (.csv)
              </Badge>
            </div>
          </div>

          {uploadStatus === 'success' && (
            <Alert className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-md">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <AlertDescription className="text-emerald-800 font-medium text-base">
                {statusMessage}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'error' && (
            <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-md">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 font-medium text-base">
                {statusMessage}
              </AlertDescription>
            </Alert>
          )}

          {showPreview && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    👁️
                  </div>
                  Vista Previa de Datos
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Se encontraron {previewData.length} registros. Revisa los datos antes de importar.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Vista de tabla para desktop */}
                <div className="hidden lg:block">
                  <div className="max-h-80 overflow-auto border border-gray-200 rounded-xl bg-white shadow-inner">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">RUT</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Carrera</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Empresa</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Cargo</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Semestre</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {previewData.slice(0, 10).map((student, index) => (
                          <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900">{student.nombreEstudiante}</td>
                            <td className="px-4 py-3 text-gray-700">{student.rut}</td>
                            <td className="px-4 py-3 text-gray-700">{student.carrera}</td>
                            <td className="px-4 py-3 text-gray-700">{student.nombreEmpresa}</td>
                            <td className="px-4 py-3 text-gray-700">{student.cargo}</td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {student.semestre}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={student.evaluacionEnviada === 'Si' || student.evaluacionEnviada === 'Sí' ? 
                                'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                                'bg-amber-100 text-amber-800 border-amber-200'
                              }>
                                {student.evaluacionEnviada || 'No'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Vista de cards para móvil y tablet */}
                <div className="lg:hidden space-y-4 max-h-80 overflow-y-auto">
                  {previewData.slice(0, 5).map((student, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500 bg-white shadow-md">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900">{student.nombreEstudiante}</h4>
                            <Badge className={student.evaluacionEnviada === 'Si' || student.evaluacionEnviada === 'Sí' ? 
                              'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }>
                              {student.evaluacionEnviada || 'No'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><strong>RUT:</strong> {student.rut}</div>
                            <div><strong>Carrera:</strong> {student.carrera}</div>
                            <div><strong>Empresa:</strong> {student.nombreEmpresa}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {previewData.length > (window.innerWidth >= 1024 ? 10 : 5) && (
                  <div className="mt-4 p-3 text-center bg-blue-100 text-blue-800 rounded-lg font-medium">
                    ... y {previewData.length - (window.innerWidth >= 1024 ? 10 : 5)} registros más
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-200">
                  <Button 
                    onClick={confirmImport} 
                    disabled={isLoading}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 sm:flex-none"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirmar Importación ({previewData.length} registros)
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={cancelImport}
                    disabled={isLoading}
                    size="lg"
                    className="border-gray-300 hover:bg-gray-50 flex-1 sm:flex-none"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}