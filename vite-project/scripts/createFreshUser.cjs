const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAXA9BLlrQ5L88E2yFlGRYUyj404Npz074",
  authDomain: "titulo-26999.firebaseapp.com",
  projectId: "titulo-26999",
  storageBucket: "titulo-26999.firebasestorage.app",
  messagingSenderId: "456678500203",
  appId: "1:456678500203:web:e788c386920b84155e8e2e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createFreshUser() {
  // Generar timestamp para hacer el email único
  const timestamp = new Date().getTime();
  const email = `demo${timestamp}@utem.cl`;
  const password = 'DemoPassword123!';
  const displayName = 'Usuario Demo';
  
  console.log('🔧 Creando usuario completamente nuevo...');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Contraseña: ${password}`);
  
  try {
    // Crear usuario en Firebase Auth
    console.log('\n1️⃣ Creando usuario en Firebase Auth...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Usuario creado en Firebase Auth');
    console.log(`🆔 UID: ${user.uid}`);
    
    // Crear documento del usuario en Firestore
    console.log('\n2️⃣ Creando documento en Firestore...');
    const userData = {
      email: email,
      displayName: displayName,
      role: 'student',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    console.log('✅ Documento del usuario creado en Firestore');
    
    console.log('\n🎯 USUARIO DEMO CREADO EXITOSAMENTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Contraseña: ${password}`);
    console.log(`👤 Nombre: ${displayName}`);
    console.log(`🏷️  Rol: student`);
    console.log('✅ Estado: Activo');
    console.log('🆔 UID:', user.uid);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n📋 PASOS PARA PROBAR EL LOGIN:');
    console.log('1. Ve a http://localhost:5173');
    console.log('2. Abre las herramientas de desarrollador (F12) y ve a "Console"');
    console.log('3. Haz clic en "Iniciar sesión" en la sidebar');
    console.log('4. Usa las credenciales mostradas arriba');
    console.log('5. Observa los mensajes de log en la consola del navegador');
    console.log('\n⚠️  IMPORTANTE: Copia estas credenciales, son únicas');
    
    // Cerrar sesión para evitar interferencias
    await auth.signOut();
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    console.log('\n🔧 Verifica:');
    console.log('1. Conexión a internet');
    console.log('2. Configuración de Firebase');
    console.log('3. Que Firebase Auth esté habilitado');
  }
}

createFreshUser().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});