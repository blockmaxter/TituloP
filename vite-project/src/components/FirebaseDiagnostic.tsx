import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/contexts/PermissionsContext';
import { getAllUsers } from '@/lib/userPermissions';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserRole, Permission } from '@/types/permissions';
import { 
  Shield, 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const FirebaseDiagnostic: React.FC = () => {
  const { user: currentUser } = usePermissions();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test: string, status: DiagnosticResult['status'], message: string, details?: any) => {
    setResults(prev => [...prev, { test, status, message, details }]);
  };

  const runDiagnostic = async () => {
    setResults([]);
    setTesting(true);

    try {
      // Test 1: Usuario actual
      if (currentUser) {
        addResult('Usuario Actual', 'success', `✅ Usuario conectado: ${currentUser.email}`, {
          role: currentUser.role,
          permissions: currentUser.permissions.length,
          uid: currentUser.uid
        });
      } else {
        addResult('Usuario Actual', 'error', '❌ No hay usuario autenticado');
        return;
      }

      // Test 2: Permisos de gestión
      if (currentUser.permissions.includes(Permission.MANAGE_USERS) || currentUser.role === UserRole.ADMIN) {
        addResult('Permisos', 'success', '✅ Tiene permisos para gestionar usuarios');
      } else {
        addResult('Permisos', 'warning', `⚠️ Rol actual (${currentUser.role}) podría no tener permisos suficientes`);
      }

      // Test 3: Conectividad con Firestore
      try {
        const testDoc = doc(db, 'test', 'connectivity');
        await setDoc(testDoc, { timestamp: new Date() });
        addResult('Firestore Write', 'success', '✅ Puede escribir en Firestore');
      } catch (error) {
        addResult('Firestore Write', 'error', `❌ Error de escritura: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }

      // Test 4: Leer colección de usuarios
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        addResult('Leer Usuarios', 'success', `✅ Puede leer usuarios (${snapshot.docs.length} encontrados)`, {
          count: snapshot.docs.length,
          users: snapshot.docs.map(doc => ({
            id: doc.id,
            email: doc.data().email,
            role: doc.data().role
          }))
        });
      } catch (error) {
        addResult('Leer Usuarios', 'error', `❌ Error al leer usuarios: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }

      // Test 5: Verificar si el usuario actual existe en Firestore
      try {
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          addResult('Usuario en DB', 'success', '✅ Usuario existe en Firestore', userData);
        } else {
          addResult('Usuario en DB', 'warning', '⚠️ Usuario no existe en Firestore (se creará automáticamente)');
          
          // Intentar crear el usuario
          try {
            await setDoc(userDoc, {
              email: currentUser.email,
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              role: currentUser.role,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            addResult('Crear Usuario', 'success', '✅ Usuario creado exitosamente en Firestore');
          } catch (createError) {
            addResult('Crear Usuario', 'error', `❌ Error al crear usuario: ${createError instanceof Error ? createError.message : 'Error desconocido'}`);
          }
        }
      } catch (error) {
        addResult('Usuario en DB', 'error', `❌ Error verificando usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }

      // Test 6: Función getAllUsers
      try {
        const users = await getAllUsers();
        addResult('getAllUsers()', 'success', `✅ Función getAllUsers() exitosa (${users.length} usuarios)`, {
          count: users.length,
          users: users.slice(0, 3).map(u => ({ email: u.email, role: u.role }))
        });
      } catch (error) {
        addResult('getAllUsers()', 'error', `❌ Error en getAllUsers(): ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }

    } catch (error) {
      addResult('General', 'error', `❌ Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Diagnóstico de Firebase y Permisos
        </CardTitle>
        <CardDescription>
          Verifica la conectividad y permisos para la gestión de usuarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostic} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Ejecutando diagnóstico...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Ejecutar Diagnóstico
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Resultados:</h3>
            {results.map((result, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-md border bg-muted/30"
              >
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{result.test}</span>
                    <Badge 
                      variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}
                    >
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-blue-600">
                        Ver detalles
                      </summary>
                      <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-x-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};