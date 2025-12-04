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
}

interface FileImporterProps {
  onDataImported: (data: StudentData[]) => void;
}

export function FileImporter({ onDataImported }: FileImporterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [duplicatesInfo, setDuplicatesInfo] = useState<string>('');
  const [previewData, setPreviewData] = useState<StudentData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para sanitizar texto y convertir acentos a versión simple
  const sanitizeText = (text: string | null | undefined): string => {
    if (!text) return '';
    
    return String(text)
      // Convertir a string y hacer trim
      .trim()
      // Normalizar espacios múltiples a un solo espacio
      .replace(/\s+/g, ' ')
      // Convertir caracteres acentuados a su versión simple
      .normalize('NFD') // Descompone caracteres combinados
      .replace(/[\u0300-\u036f]/g, '') // Remueve diacríticos (tildes, acentos, etc.)
      .replace(/[ñÑ]/g, (match) => match === 'ñ' ? 'n' : 'N') // Ñ y ñ específicamente
      .replace(/[çÇ]/g, (match) => match === 'ç' ? 'c' : 'C') // Ç y ç
      // Remover caracteres de control y caracteres especiales peligrosos
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Remover caracteres que pueden causar problemas en bases de datos
      .replace(/[<>'"&\\]/g, '')
      // Remover caracteres de inyección SQL/NoSQL básicos
      .replace(/[;{}$]/g, '')
      // Remover caracteres Unicode problemáticos
      .replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F]/g, ' ')
      // Normalizar saltos de línea
      .replace(/\r?\n/g, ' ')
      // Normalizar comillas tipográficas a versión simple
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/[–—]/g, '-') // Guiones largos -> guion normal
      // Limitar longitud máxima por seguridad
      .substring(0, 500)
      // Trim final
      .trim();
  };

  // Función para sanitizar email específicamente
  const sanitizeEmail = (email: string | null | undefined): string => {
    if (!email) return '';
    
    const sanitized = sanitizeText(email);
    // Validación básica de formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(sanitized) ? sanitized : '';
  };

  // Función helper para normalizar el estado de evaluación
  const normalizeEvaluationStatus = (status: string | undefined): boolean => {
    if (!status) return false;
    const normalized = status.toString().toLowerCase().trim();
    return normalized === 'si' || normalized === 'sí' || normalized === 'yes' || normalized === 'true' || normalized === '1';
  };

  // Función helper para normalizar el valor antes de guardar
  const normalizeForSave = (status: string | undefined): string => {
    return normalizeEvaluationStatus(status) ? 'Sí' : 'No';
  };

  // Función para sanitizar RUT específicamente
  const sanitizeRUT = (rut: string | null | undefined): string => {
    if (!rut) return '';
    
    const cleaned = String(rut)
      .trim()
      // Mantener solo números, puntos, guiones y K/k
      .replace(/[^0-9.\-Kk]/g, '')
      // Normalizar formato
      .toUpperCase()
      .substring(0, 12); // RUT no debería ser más largo
    
    return cleaned;
  };

  // Función para validar formato de RUT chileno
  const isValidRUTFormat = (rut: string): boolean => {
    if (!rut) return false;
    
    // Remover puntos y guiones para validación
    const cleanRUT = rut.replace(/[.\-]/g, '');
    
    // Debe tener entre 8-9 caracteres (7-8 números + dígito verificador)
    if (cleanRUT.length < 8 || cleanRUT.length > 9) return false;
    
    // Último carácter debe ser número o K
    const lastChar = cleanRUT.slice(-1);
    if (!/[0-9K]/.test(lastChar)) return false;
    
    // Los primeros caracteres deben ser números
    const numbers = cleanRUT.slice(0, -1);
    if (!/^\d+$/.test(numbers)) return false;
    
    return true;
  };

  // Función para sanitizar un objeto StudentData completo
  const sanitizeStudentData = (student: any): StudentData => {
    const sanitizedRUT = sanitizeRUT(student.rut);
    
    return {
      nombreEstudiante: sanitizeText(student.nombreEstudiante),
      rut: isValidRUTFormat(sanitizedRUT) ? sanitizedRUT : '', // Solo guardar si el formato es válido
      facultad: sanitizeText(student.facultad),
      carrera: sanitizeText(student.carrera),
      nombreEmpresa: sanitizeText(student.nombreEmpresa),
      comuna: sanitizeText(student.comuna),
      supervisorPractica: sanitizeText(student.supervisorPractica),
      emailAlumno: sanitizeEmail(student.emailAlumno),
      cargo: sanitizeText(student.cargo),
      areaEstudiante: sanitizeText(student.areaEstudiante),
      semestre: sanitizeText(student.semestre),
      anioPractica: sanitizeText(student.anioPractica),
      anioIngreso: sanitizeText(student.anioIngreso),
      evaluacionEnviada: normalizeForSave(student.evaluacionEnviada)
    };
  };

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
              
              // Mapear columnas basándose exactamente en el CSV proporcionado
              const headerMapping: { [key: string]: keyof StudentData } = {
                'NOMBRE ESTUDIANTE': 'nombreEstudiante',
                'RUT': 'rut',
                'FACULTAD': 'facultad',
                'CARRERA': 'carrera',
                'NOMBRE EMPRESA': 'nombreEmpresa',
                'COMUNA': 'comuna',
                'SUPERVISOR DE PRACTICA': 'supervisorPractica',
                'EMAIL alumno': 'emailAlumno',
                'CARGO': 'cargo',
                'AREA DE ESTUDIANTE': 'areaEstudiante',
                'SEMESTRE': 'semestre',
                'AÑO PRACTICA': 'anioPractica',
                'AÑO INGRESO': 'anioIngreso',
                'EVALUACION\nENVIADA': 'evaluacionEnviada',
                'EVALUACION ENVIADA': 'evaluacionEnviada'
              };

              headers.forEach((header: string, i: number) => {
                const mappedKey = headerMapping[header] || header.toLowerCase().replace(/\s+/g, '');
                if (mappedKey && row[i] !== null && row[i] !== undefined) {
                  student[mappedKey] = String(row[i]).trim();
                }
              });

              // Crear objeto con valores por defecto
              const rawStudent = {
                nombreEstudiante: student.nombreEstudiante || '',
                rut: student.rut || '',
                facultad: student.facultad || '',
                carrera: student.carrera || '',
                nombreEmpresa: student.nombreEmpresa || '',
                comuna: student.comuna || '',
                supervisorPractica: student.supervisorPractica || '',
                emailAlumno: student.emailAlumno || '',
                cargo: student.cargo || '',
                areaEstudiante: student.areaEstudiante || '',
                semestre: student.semestre || '',
                anioPractica: student.anioPractica || '',
                anioIngreso: student.anioIngreso || '',
                evaluacionEnviada: normalizeForSave(student.evaluacionEnviada)
              };

              // Aplicar sanitización
              return sanitizeStudentData(rawStudent);
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
      // Función auxiliar para detectar y convertir encoding
      const readFileWithEncoding = (file: File, encoding: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            resolve(result);
          };
          reader.onerror = () => reject(new Error(`Error al leer archivo con encoding ${encoding}`));
          reader.readAsText(file, encoding);
        });
      };

      // Función para convertir caracteres acentuados a su versión simple
      const normalizeSpecialCharacters = (text: string): string => {
        if (!text) return '';
        
        // Primero, arreglar caracteres mal codificados comunes
        const malEncodedReplacements: { [key: string]: string } = {
          // Caracteres mal codificados de UTF-8 doble codificación
          '\u00C3\u00A1': 'a', // Ã¡ -> a
          '\u00C3\u00A9': 'e', // Ã© -> e
          '\u00C3\u00AD': 'i', // Ã­ -> i
          '\u00C3\u00B3': 'o', // Ã³ -> o
          '\u00C3\u00BA': 'u', // Ãº -> u
          '\u00C3\u00A0': 'a', // Ã  -> a
          '\u00C3\u00A8': 'e', // Ã¨ -> e
          '\u00C3\u00AC': 'i', // Ã¬ -> i
          '\u00C3\u00B2': 'o', // Ã² -> o
          '\u00C3\u00B9': 'u', // Ã¹ -> u
          '\u00C3\u00B1': 'n', // Ã± -> n
          '\u00C3\u00BC': 'u', // Ã¼ -> u
          '\u00C3\u00B6': 'o', // Ã¶ -> o
          '\u00C3\u00A4': 'a', // Ã¤ -> a
          // Mayúsculas mal codificadas
          '\u00C3\u0089': 'E', // ÃÉ -> E
          '\u00C3\u008D': 'I', // ÃÍ -> I
          '\u00C3\u0093': 'O', // ÃÓ -> O
          '\u00C3\u009A': 'U', // ÃÚ -> U
          '\u00C3\u0091': 'N', // ÃÑ -> N
          '\u00C3\u009C': 'U', // ÃÜ -> U
          '\u00C3\u0096': 'O', // ÃÖ -> O
          '\u00C3\u0084': 'A', // ÃÄ -> A
          // Caracteres de reemplazo común
          '\uFFFD': '', // � -> (vacío)
          // Otros caracteres fantasma comunes
          '\u00C2': '', // Â -> (vacío)
        };

        // Aplicar correcciones de caracteres mal codificados
        let normalized = text;
        for (const [wrong, correct] of Object.entries(malEncodedReplacements)) {
          normalized = normalized.replace(new RegExp(wrong, 'g'), correct);
        }

        // Convertir TODOS los caracteres acentuados a su versión simple
        // Usar normalize para descomponer los caracteres y luego remover diacríticos
        normalized = normalized
          .normalize('NFD') // Descompone caracteres combinados
          .replace(/[\u0300-\u036f]/g, '') // Remueve diacríticos (tildes, acentos, etc.)
          .replace(/[ñÑ]/g, (match) => match === 'ñ' ? 'n' : 'N') // Ñ y ñ específicamente
          .replace(/[çÇ]/g, (match) => match === 'ç' ? 'c' : 'C') // Ç y ç
          .replace(/[æÆ]/g, (match) => match === 'æ' ? 'ae' : 'AE') // æ y Æ
          .replace(/[øØ]/g, (match) => match === 'ø' ? 'o' : 'O') // ø y Ø
          .replace(/[åÅ]/g, (match) => match === 'å' ? 'a' : 'A') // å y Å
          .replace(/[ßß]/g, 'ss') // ß alemana
          .replace(/[ðÐ]/g, (match) => match === 'ð' ? 'd' : 'D') // ð islandesa
          .replace(/[þÞ]/g, (match) => match === 'þ' ? 'th' : 'TH') // þ islandesa
          // Limpiar caracteres especiales de comillas y guiones
          .replace(/[""]/g, '"') // Comillas tipográficas -> comillas normales
          .replace(/['']/g, "'") // Apostrofes tipográficos -> apostrofe normal
          .replace(/[–—]/g, '-') // Guiones largos -> guion normal
          // Remover cualquier carácter de control restante
          .replace(/[\x00-\x1F\x7F]/g, '');

        return normalized;
      };

      // Intentar leer con diferentes encodings
      const tryEncodings = async () => {
        const encodings = ['UTF-8', 'ISO-8859-1', 'windows-1252'];
        
        for (const encoding of encodings) {
          try {
            const content = await readFileWithEncoding(file, encoding);
            
            // Verificar si hay caracteres de reemplazo (�) que indican mal encoding
            if (content.includes('�') && encoding !== 'windows-1252') {
              continue;
            }

            // Normalizar caracteres especiales
            const normalizedContent = normalizeSpecialCharacters(content);
            
            // Parsear el contenido normalizado directamente
            Papa.parse(normalizedContent, {
              header: true,
              skipEmptyLines: true,
              delimiter: ';', // El CSV usa punto y coma como separador
              complete: (results) => {
                try {
                  const processedData: StudentData[] = results.data.map((row: any) => {
                    // Aplicar normalización adicional a cada campo
                    const normalizedRow: any = {};
                    for (const [key, value] of Object.entries(row)) {
                      normalizedRow[key] = normalizeSpecialCharacters(String(value || ''));
                    }

                    // Crear objeto raw con los datos del CSV
                    const rawStudent = {
                      nombreEstudiante: normalizedRow['NOMBRE ESTUDIANTE'] || '',
                      rut: normalizedRow['RUT'] || '',
                      facultad: normalizedRow['FACULTAD'] || '',
                      carrera: normalizedRow['CARRERA'] || '',
                      nombreEmpresa: normalizedRow['NOMBRE EMPRESA'] || '',
                      comuna: normalizedRow['COMUNA'] || '',
                      supervisorPractica: normalizedRow['SUPERVISOR DE PRACTICA'] || '',
                      emailAlumno: normalizedRow['EMAIL alumno'] || '',
                      cargo: normalizedRow['CARGO'] || '',
                      areaEstudiante: normalizedRow['AREA DE ESTUDIANTE'] || '',
                      semestre: normalizedRow['SEMESTRE'] || '',
                      anioPractica: normalizedRow['AÑO PRACTICA'] || '',
                      anioIngreso: normalizedRow['AÑO INGRESO'] || '',
                      evaluacionEnviada: normalizeForSave(normalizedRow['EVALUACION\nENVIADA'] || normalizedRow['EVALUACION ENVIADA'])
                    };

                    // Aplicar sanitización
                    return sanitizeStudentData(rawStudent);
                  });
                  
                  console.log(`CSV procesado exitosamente con encoding: ${encoding}`);
                  resolve(processedData);
                } catch (error) {
                  reject(new Error('Error al procesar el archivo CSV: ' + (error as Error).message));
                }
              },
              error: (error) => {
                reject(new Error('Error al parsear CSV: ' + error.message));
              }
            });
            
            return; // Salir del bucle si fue exitoso
          } catch (error) {
            console.warn(`Falló encoding ${encoding}:`, error);
            continue;
          }
        }
        
        reject(new Error('No se pudo determinar la codificación correcta del archivo CSV'));
      };

      tryEncodings().catch(reject);
    });
  };

  const syncToFirebase = async (data: StudentData[]) => {
    try {
      // Validación y sanitización final antes de subir a Firebase
      const sanitizedData = data.map((student, index) => {
        const sanitized = sanitizeStudentData(student);
        
        // Log de cambios importantes durante sanitización
        if (student.rut !== sanitized.rut) {
          console.log(`RUT sanitizado para ${sanitized.nombreEstudiante}: "${student.rut}" → "${sanitized.rut}"`);
        }
        if (student.emailAlumno !== sanitized.emailAlumno) {
          console.log(`Email sanitizado para ${sanitized.nombreEstudiante}: "${student.emailAlumno}" → "${sanitized.emailAlumno}"`);
        }
        
        // Validaciones adicionales
        if (!sanitized.nombreEstudiante) {
          throw new Error(`Fila ${index + 1}: Nombre de estudiante requerido`);
        }
        if (!sanitized.rut) {
          console.warn(`Fila ${index + 1}: RUT inválido o vacío para ${sanitized.nombreEstudiante}`);
        }
        
        return sanitized;
      });

      // Limpiar la colección existente
      const querySnapshot = await getDocs(collection(db, 'estudiantes'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Agregar nuevos datos sanitizados
      const addPromises = sanitizedData.map(async (student, index) => {
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

  const removeDuplicatesByRUT = (data: StudentData[]): { cleanData: StudentData[], duplicatesFound: number } => {
    const rutSet = new Set<string>();
    const cleanData: StudentData[] = [];
    let duplicatesFound = 0;

    for (const student of data) {
      // Normalizar el RUT (quitar espacios, puntos, guiones)
      const normalizedRUT = student.rut
        .replace(/\s+/g, '')
        .replace(/\./g, '')
        .replace(/-/g, '')
        .toLowerCase();

      if (!rutSet.has(normalizedRUT)) {
        rutSet.add(normalizedRUT);
        cleanData.push(student);
      } else {
        duplicatesFound++;
        console.log(`RUT duplicado encontrado y eliminado: ${student.rut} (${student.nombreEstudiante})`);
      }
    }

    return { cleanData, duplicatesFound };
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

      // Eliminar duplicados basándose en RUT
      const { cleanData, duplicatesFound } = removeDuplicatesByRUT(data);

      setPreviewData(cleanData);
      setShowPreview(true);
      
      // Mensaje de estado con información de duplicados
      let message = `Se procesaron ${cleanData.length} registros únicos correctamente`;
      if (duplicatesFound > 0) {
        message += `. Se eliminaron ${duplicatesFound} duplicado${duplicatesFound > 1 ? 's' : ''} basándose en RUT`;
        setDuplicatesInfo(`${duplicatesFound} registro${duplicatesFound > 1 ? 's' : ''} duplicado${duplicatesFound > 1 ? 's' : ''} eliminado${duplicatesFound > 1 ? 's' : ''} (RUT repetido)`);
      } else {
        setDuplicatesInfo('');
      }
      setStatusMessage(message);

    } catch (error) {
      setUploadStatus('error');
      setStatusMessage((error as Error).message);
      setDuplicatesInfo('');
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
    setDuplicatesInfo('');
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
            Los caracteres acentuados (á, é, í, ó, ú, ñ, etc.) se convertirán automáticamente a su versión simple (a, e, i, o, u, n).
            Los datos serán sanitizados y validados antes de sincronizarse con Firebase.
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

          {duplicatesInfo && (
            <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-md">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800 font-medium text-base">
                ⚠️ {duplicatesInfo}
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
                  Se encontraron {previewData.length} registros únicos. 
                  {duplicatesInfo && <span className="block mt-1 text-amber-200">📋 {duplicatesInfo}</span>}
                  Revisa los datos antes de importar.
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
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Comuna</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Área</th>
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
                            <td className="px-4 py-3 text-gray-700">{student.comuna}</td>
                            <td className="px-4 py-3 text-gray-700">{student.areaEstudiante}</td>
                            <td className="px-4 py-3">
                              <Badge className={normalizeEvaluationStatus(student.evaluacionEnviada) ? 
                                'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                                'bg-amber-100 text-amber-800 border-amber-200'
                              }>
                                {normalizeEvaluationStatus(student.evaluacionEnviada) ? '✅ Completada' : '⏳ Pendiente'}
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
                            <Badge className={normalizeEvaluationStatus(student.evaluacionEnviada) ? 
                              'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }>
                              {normalizeEvaluationStatus(student.evaluacionEnviada) ? '✅ Completada' : '⏳ Pendiente'}
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