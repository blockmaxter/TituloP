import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import app from '../lib/firebase';
import { useState, useEffect } from 'react';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email && user.email.endsWith("@utem.cl")) {
          localStorage.setItem("firebaseUser", JSON.stringify(user));
          window.location.reload();
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
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Correo o contraseña incorrectos");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/public/vite.svg')] bg-cover bg-center">
      <div className="bg-white bg-opacity-90 p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
        {!showReset ? (
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 mb-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
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
        {error && <div className="text-red-600 text-sm mt-2 text-center">{error}</div>}
      </div>
    </div>
  );
}
