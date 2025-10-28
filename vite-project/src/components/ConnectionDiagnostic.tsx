import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertTriangleIcon,
  WifiIcon,
  DatabaseIcon,
  UserIcon,
  ShieldIcon,
  XIcon
} from 'lucide-react';

interface ConnectionTest {
  name: string;
  status: 'testing' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

interface ConnectionDiagnosticProps {
  onClose?: () => void;
}

export const ConnectionDiagnostic: React.FC<ConnectionDiagnosticProps> = ({ onClose }) => {
  const [tests, setTests] = useState<ConnectionTest[]>([]);
  const [user, setUser] = useState<any>(null);
  const [testCredentials, setTestCredentials] = useState({
    email: 'demo1761618289147@utem.cl',
    password: 'DemoPassword123!'
  });
  const [testing, setTesting] = useState(false);

  const updateTest = (name: string, status: ConnectionTest['status'], message: string, details?: string) => {
    setTests(prev => {
      const updated = prev.filter(t => t.name !== name);
      return [...updated, { name, status, message, details }];
    });
  };

  const runDiagnostics = async () => {
    setTesting(true);
    setTests([]);

    // Test 1: Firebase Auth connectivity
    updateTest('firebase-auth', 'testing', 'Verificando conectividad con Firebase Auth...');
    try {
      const auth = getAuth();
      updateTest('firebase-auth', 'success', 'Conexión con Firebase Auth: OK', 'Servicio disponible');
    } catch (error) {
      updateTest('firebase-auth', 'error', 'Error de conexión con Firebase Auth', error instanceof Error ? error.message : 'Error desconocido');
    }

    // Test 2: Firestore connectivity
    updateTest('firestore', 'testing', 'Verificando conectividad con Firestore...');
    try {
      // Intentar una operación simple de lectura
      const testDoc = doc(db, 'test', 'connectivity');
      await getDoc(testDoc);
      updateTest('firestore', 'success', 'Conexión con Firestore: OK', 'Lectura exitosa (documento puede no existir)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      if (errorMessage.includes('ERR_BLOCKED_BY_CLIENT')) {
        updateTest('firestore', 'error', 'Firestore bloqueado por el navegador', 'Bloqueador de anuncios o extensión bloqueando la conexión');
      } else if (errorMessage.includes('permission-denied')) {
        updateTest('firestore', 'warning', 'Permisos de Firestore restringidos', 'Conexión OK, pero permisos limitados');
      } else {
        updateTest('firestore', 'error', 'Error de conexión con Firestore', errorMessage);
      }
    }

    // Test 3: Network connectivity
    updateTest('network', 'testing', 'Verificando conectividad general...');
    try {
      const response = await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
      updateTest('network', 'success', 'Conectividad de red: OK', 'Internet disponible');
    } catch (error) {
      updateTest('network', 'error', 'Problema de conectividad de red', 'Sin acceso a internet');
    }

    // Test 4: Firebase configuration
    updateTest('config', 'testing', 'Verificando configuración de Firebase...');
    try {
      const auth = getAuth();
      if (auth.app.options.projectId) {
        updateTest('config', 'success', 'Configuración de Firebase: OK', `Proyecto: ${auth.app.options.projectId}`);
      } else {
        updateTest('config', 'error', 'Configuración de Firebase incompleta', 'Project ID no encontrado');
      }
    } catch (error) {
      updateTest('config', 'error', 'Error en configuración de Firebase', error instanceof Error ? error.message : 'Error desconocido');
    }

    setTesting(false);
  };

  const testLogin = async () => {
    updateTest('login-test', 'testing', 'Intentando login de prueba...');
    
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, testCredentials.email, testCredentials.password);
      
      updateTest('login-test', 'success', 'Login exitoso', `Usuario: ${userCredential.user.email}`);
      
      // Test Firestore write
      updateTest('firestore-write', 'testing', 'Probando escritura en Firestore...');
      try {
        const userDoc = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDoc, {
          email: userCredential.user.email,
          testConnection: true,
          timestamp: new Date()
        }, { merge: true });
        
        updateTest('firestore-write', 'success', 'Escritura en Firestore: OK', 'Documento guardado exitosamente');
      } catch (firestoreError) {
        const errorMsg = firestoreError instanceof Error ? firestoreError.message : 'Error desconocido';
        if (errorMsg.includes('permission-denied')) {
          updateTest('firestore-write', 'warning', 'Permisos de escritura denegados', 'Las reglas de Firestore requieren actualización');
        } else {
          updateTest('firestore-write', 'error', 'Error de escritura en Firestore', errorMsg);
        }
      }
      
    } catch (loginError) {
      const errorMsg = loginError instanceof Error ? loginError.message : 'Error desconocido';
      if (errorMsg.includes('invalid-credential')) {
        updateTest('login-test', 'error', 'Credenciales inválidas', 'Usuario no existe o contraseña incorrecta');
      } else if (errorMsg.includes('ERR_BLOCKED_BY_CLIENT')) {
        updateTest('login-test', 'error', 'Login bloqueado por el navegador', 'Bloqueador de anuncios o extensión interferendo');
      } else {
        updateTest('login-test', 'error', 'Error de login', errorMsg);
      }
    }
  };

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'testing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'testing': return 'outline';
      default: return 'outline';
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getSolutions = () => {
    const hasFirestoreError = tests.some(t => t.name === 'firestore' && t.status === 'error' && t.details?.includes('bloqueado'));
    const hasLoginError = tests.some(t => t.name === 'login-test' && t.status === 'error');
    const hasPermissionError = tests.some(t => t.details?.includes('permission-denied'));

    const solutions = [];

    if (hasFirestoreError) {
      solutions.push({
        title: 'Problema: Firestore bloqueado por el navegador',
        steps: [
          'Deshabilita temporalmente el bloqueador de anuncios (AdBlock, uBlock, etc.)',
          'Agrega "*.googleapis.com" a la lista blanca de tu bloqueador',
          'Prueba en modo incógnito del navegador',
          'Verifica que no hay extensiones bloqueando las conexiones'
        ]
      });
    }

    if (hasPermissionError) {
      solutions.push({
        title: 'Problema: Permisos de Firestore',
        steps: [
          'Las reglas de Firestore necesitan actualizarse',
          'Contacta al administrador del proyecto',
          'Temporalmente, el sistema funcionará en modo de solo lectura'
        ]
      });
    }

    if (hasLoginError) {
      solutions.push({
        title: 'Problema: Error de login',
        steps: [
          'Verifica que las credenciales sean correctas',
          'Usa "Olvidaste tu contraseña" si es necesario',
          'Prueba con login de Google si está disponible',
          'Contacta al administrador para crear tu cuenta'
        ]
      });
    }

    return solutions;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg space-y-6">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiIcon className="h-5 w-5" />
                <CardTitle>Diagnóstico de Conectividad Firebase</CardTitle>
              </div>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardDescription>
              Verificando conectividad y configuración del sistema
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runDiagnostics} disabled={testing}>
              {testing ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
            </Button>
            <Button variant="outline" onClick={testLogin} disabled={testing}>
              Probar Login
            </Button>
          </div>

          <div className="space-y-3">
            {tests.map((test) => (
              <div key={test.name} className="flex items-start gap-3 p-3 border rounded-lg">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{test.message}</span>
                    <Badge variant={getStatusColor(test.status) as any}>
                      {test.status}
                    </Badge>
                  </div>
                  {test.details && (
                    <p className="text-sm text-muted-foreground">{test.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Login */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Prueba de Credenciales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input 
                value={testCredentials.email}
                onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input 
                type="password"
                value={testCredentials.password}
                onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>
          
          {user && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Usuario autenticado: {user.email}
              </p>
              <Button variant="outline" size="sm" onClick={() => signOut(getAuth())} className="mt-2">
                Cerrar Sesión
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solutions */}
      {getSolutions().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5" />
              Soluciones Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getSolutions().map((solution, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{solution.title}</h4>
                <ul className="space-y-1">
                  {solution.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};