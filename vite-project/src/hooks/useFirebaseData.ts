import { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export const useFirebaseData = () => {
  const [data, setData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'estudiantes'), orderBy('fechaImportacion', 'desc'));
        
        // Configurar listener en tiempo real
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const students: StudentData[] = [];
          querySnapshot.forEach((doc) => {
            students.push({
              id: doc.id,
              ...doc.data()
            } as StudentData);
          });
          setData(students);
          setLoading(false);
          setError(null);
        }, (err) => {
          console.error('Error fetching data:', err);
          setError('Error al cargar los datos desde Firebase');
          setLoading(false);
        });

        // Retornar función de cleanup
        return unsubscribe;
      } catch (err) {
        console.error('Error setting up listener:', err);
        setError('Error al conectar con Firebase');
        setLoading(false);
      }
    };

    let unsubscribe: (() => void) | undefined;
    
    const setupListener = async () => {
      unsubscribe = await fetchData();
    };
    
    setupListener();
    
    // Cleanup function
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'estudiantes'));
      const students: StudentData[] = [];
      querySnapshot.forEach((doc) => {
        students.push({
          id: doc.id,
          ...doc.data()
        } as StudentData);
      });
      setData(students);
      setError(null);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Error al actualizar los datos');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refreshData
  };
};