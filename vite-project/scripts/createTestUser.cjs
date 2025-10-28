const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Configuración de Firebase
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

async function createTestUser() {
  const email = 'test.student@utem.cl';
  const password = 'TestPassword123!';
  const displayName = 'Usuario de Prueba';
  
  console.log('🔧 Creando usuario de prueba...');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Contraseña: ${password}`);
  
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Usuario creado en Firebase Auth');
    console.log(`🆔 UID: ${user.uid}`);
    
    // Crear documento del usuario en Firestore
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
    
    console.log('\n🎯 USUARIO DE PRUEBA CREADO EXITOSAMENTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Contraseña: ${password}`);
    console.log(`👤 Nombre: ${displayName}`);
    console.log(`🏷️  Rol: student`);
    console.log('✅ Estado: Activo');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n📋 INSTRUCCIONES PARA INICIAR SESIÓN:');
    console.log('1. Ve a http://localhost:5173');
    console.log('2. Haz clic en "Iniciar sesión" en la sidebar');
    console.log('3. Ingresa el email y contraseña mostrados arriba');
    console.log('4. ¡Listo! Deberías poder acceder al sistema');
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n⚠️  El usuario ya existe. Puedes usar las credenciales:');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Contraseña: ${password}`);
      console.log('\nO usar "Olvidaste tu contraseña" para crear una nueva contraseña.');
    } else if (error.code === 'auth/weak-password') {
      console.log('\n⚠️  La contraseña es muy débil. Debe tener al menos 6 caracteres.');
    } else {
      console.log('\n🔧 Posibles soluciones:');
      console.log('1. Verificar conexión a internet');
      console.log('2. Verificar configuración de Firebase');
      console.log('3. Verificar que Firebase Auth esté habilitado');
    }
  }
}

createTestUser().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});