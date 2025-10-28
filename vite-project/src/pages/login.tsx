import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import app from '../lib/firebase';
import { useState, useEffect } from 'react';
import { ConnectionDiagnostic } from '../components/ConnectionDiagnostic';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email && user.email.endsWith("@utem.cl")) {
          localStorage.setItem("firebaseUser", JSON.stringify(user));
          // Redirigir al dashboard después de login exitoso
          window.location.href = "/";
        } else {
          signOut(auth);
          localStorage.removeItem("firebaseUser");
          setError("Acceso denegado: solo usuarios con correo institucional @utem.cl pueden ingresar. Si tienes dudas, contacta a soporte.");
        }
      }
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError('Error al iniciar sesión con Google');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validar formato de email
    if (!email.includes("@")) {
      setError("Formato de correo electrónico inválido");
      return;
    }
    
    // Validar dominio institucional antes del login
    if (!email.endsWith("@utem.cl")) {
      setError("Solo se permiten correos institucionales @utem.cl");
      return;
    }
    
    try {
      console.log("Intentando login con:", email); // Debug log
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login exitoso:", userCredential.user.email); // Debug log
      
      // El onAuthStateChanged se encargará de la redirección
    } catch (err: any) {
      console.error("Error de login:", err); // Debug log
      
      // Manejo específico de errores
      switch (err.code) {
        case 'auth/user-not-found':
          setError("No existe una cuenta con este correo electrónico. Contacta al administrador para crear tu cuenta.");
          break;
        case 'auth/wrong-password':
          setError("Contraseña incorrecta. Verifica tu contraseña o usa 'Olvidaste tu contraseña'.");
          break;
        case 'auth/invalid-email':
          setError("Formato de correo electrónico inválido");
          break;
        case 'auth/user-disabled':
          setError("Esta cuenta ha sido deshabilitada. Contacta al administrador.");
          break;
        case 'auth/too-many-requests':
          setError("Demasiados intentos fallidos. Intenta nuevamente en unos minutos.");
          break;
        case 'auth/network-request-failed':
          setError("Error de conexión. Verifica tu conexión a internet.");
          break;
        case 'auth/invalid-credential':
          setError("Credenciales inválidas. Verifica tu correo y contraseña.");
          break;
        default:
          setError(`Error al iniciar sesión: ${err.message}`);
      }
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMsg("Se ha enviado un correo para restablecer la contraseña.");
    } catch (err: any) {
      setError("No se pudo enviar el correo. Verifica el email.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-800 bg-opacity-95 dark:bg-opacity-95 p-8 rounded-lg shadow-lg w-full max-w-sm border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-slate-100">Iniciar sesión</h1>
        {!showReset ? (
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 mb-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
            >
              Iniciar sesión con correo
            </button>
            <button
              type="button"
              className="w-full text-blue-600 underline text-sm mt-2"
              onClick={() => setShowReset(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="flex flex-col gap-4 mb-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Enviar correo de recuperación
            </button>
            <button
              type="button"
              className="w-full text-gray-600 underline text-sm mt-2"
              onClick={() => setShowReset(false)}
            >
              Volver al login
            </button>
            {resetMsg && <div className="text-green-600 text-sm mt-2 text-center">{resetMsg}</div>}
          </form>
        )}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mb-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.35 11.1H12V13.9H17.85C17.45 15.3 16.3 16.4 14.7 16.4C12.7 16.4 11.1 14.8 11.1 12.8C11.1 10.8 12.7 9.2 14.7 9.2C15.6 9.2 16.4 9.5 17.05 10.05L19.05 8.05C17.85 7.05 16.35 6.4 14.7 6.4C11.4 6.4 8.7 9.1 8.7 12.4C8.7 15.7 11.4 18.4 14.7 18.4C17.6 18.4 20.1 16.1 20.1 13.2C20.1 12.7 20.05 12.2 19.95 11.7L21.35 11.1Z" fill="#4285F4"/>
          </svg>
          Iniciar sesión con Google
        </button>
        {error && (
          <div className="text-red-600 text-sm mt-2 text-center">
            {error}
            {error.includes("Error de conexión") || error.includes("network") ? (
              <button
                onClick={() => setShowDiagnostic(true)}
                className="block w-full mt-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200 transition"
              >
                🔧 Ejecutar diagnóstico de conectividad
              </button>
            ) : null}
          </div>
        )}
        
        <button
          onClick={() => setShowDiagnostic(true)}
          className="w-full mt-4 text-xs bg-gray-100 text-gray-700 px-2 py-2 rounded hover:bg-gray-200 transition"
        >
          🔧 Diagnóstico de Conectividad
        </button>
      </div>

      {showDiagnostic && (
        <ConnectionDiagnostic onClose={() => setShowDiagnostic(false)} />
      )}
    </div>
  );
}
