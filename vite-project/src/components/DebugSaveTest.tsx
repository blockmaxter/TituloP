import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { usePermissions } from '@/contexts/PermissionsContext';
import { toast } from 'sonner';

export function DebugSaveTest() {
  const { user } = usePermissions();
  const [testing, setTesting] = useState(false);

  const testSave = async () => {
    if (!user) {
      toast.error('No hay usuario autenticado');
      return;
    }

    setTesting(true);
    console.log('=== INICIANDO PRUEBA DE GUARDADO ===');
    console.log('Usuario:', user);
    console.log('DB configuración:', db);

    try {
      const testData = {
        test: true,
        timestamp: new Date(),
        userId: user.uid,
      };

      console.log('Datos de prueba:', testData);
      
      await setDoc(doc(db, 'userSettings', user.uid), testData, { merge: true });
      
      console.log('✅ GUARDADO EXITOSO');
      toast.success('Prueba de guardado exitosa');
    } catch (error) {
      console.error('❌ ERROR EN GUARDADO:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setTesting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 rounded">
        <p>No hay usuario autenticado para la prueba</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-100 rounded">
      <h3 className="font-bold mb-2">Debug: Prueba de Guardado</h3>
      <p className="text-sm mb-4">Usuario: {user.email}</p>
      <button
        onClick={testSave}
        disabled={testing}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {testing ? 'Probando...' : 'Probar Guardado'}
      </button>
    </div>
  );
}