import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSpreadsheet, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { collection, addDoc, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
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
            .map((row, index) => {
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Datos de Estudiantes
          </CardTitle>
          <CardDescription>
            Sube un archivo Excel (.xlsx, .xls) o CSV con los datos de los estudiantes.
            Los datos se sincronizarán automáticamente con Firebase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Badge variant="outline" className="text-xs">
                <FileSpreadsheet className="h-3 w-3 mr-1" />
                Excel
              </Badge>
              <Badge variant="outline" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                CSV
              </Badge>
            </div>
          </div>

          {isLoading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Procesando archivo, por favor espere...
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {statusMessage}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {statusMessage}
              </AlertDescription>
            </Alert>
          )}

          {showPreview && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">Vista Previa de Datos</CardTitle>
                <CardDescription>
                  Se encontraron {previewData.length} registros. Revisa los datos antes de importar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-60 overflow-y-auto border rounded-md bg-white">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-2 py-1 text-left">Nombre</th>
                        <th className="px-2 py-1 text-left">RUT</th>
                        <th className="px-2 py-1 text-left">Carrera</th>
                        <th className="px-2 py-1 text-left">Empresa</th>
                        <th className="px-2 py-1 text-left">Cargo</th>
                        <th className="px-2 py-1 text-left">Semestre</th>
                        <th className="px-2 py-1 text-left">Año Práctica</th>
                        <th className="px-2 py-1 text-left">Evaluación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 10).map((student, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-2 py-1">{student.nombreEstudiante}</td>
                          <td className="px-2 py-1">{student.rut}</td>
                          <td className="px-2 py-1">{student.carrera}</td>
                          <td className="px-2 py-1">{student.nombreEmpresa}</td>
                          <td className="px-2 py-1">{student.cargo}</td>
                          <td className="px-2 py-1">{student.semestre}</td>
                          <td className="px-2 py-1">{student.anio}</td>
                          <td className="px-2 py-1">{student.evaluacionEnviada}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewData.length > 10 && (
                    <div className="p-2 text-center text-gray-500">
                      ... y {previewData.length - 10} registros más
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button 
                    onClick={confirmImport} 
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Importación
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={cancelImport}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none"
                  >
                    <X className="h-4 w-4 mr-2" />
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