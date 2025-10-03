const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAXA9BLlrQ5L88E2yFlGRYUyj404Npz074",
  authDomain: "titulo-26999.firebaseapp.com",
  projectId: "titulo-26999",
  storageBucket: "titulo-26999.firebasestorage.app",
  messagingSenderId: "456678500203",
  appId: "1:456678500203:web:e788c386920b84155e8e2e",
  measurementId: "G-TMGEBM8PY9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createTestUser(email, password, displayName, role = 'student') {
  try {
    console.log(`🔄 Creando usuario: ${email}`);
    
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Usuario creado en Auth: ${user.uid}`);
    
    // Crear documento del usuario en Firestore
    const userRef = doc(db, 'users', user.uid);
    const now = new Date();
    
    await setDoc(userRef, {
      email: email,
      displayName: displayName,
      photoURL: '',
      role: role,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
    
    console.log(`✅ Usuario creado en Firestore con rol: ${role}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Display Name: ${displayName}`);
    console.log(`🆔 UID: ${user.uid}`);
    console.log('');
    
    return user;
    
  } catch (error) {
    console.error(`❌ Error creando usuario ${email}:`, error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log(`ℹ️  El usuario ${email} ya existe`);
    }
    
    return null;
  }
}

async function testLogin(email, password) {
  try {
    console.log(`🔄 Probando login: ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(`✅ Login exitoso: ${userCredential.user.email}`);
    console.log(`🆔 UID: ${userCredential.user.uid}`);
    return true;
  } catch (error) {
    console.error(`❌ Error login ${email}:`, error.code, error.message);
    return false;
  }
}

async function main() {
  const command = process.argv[2];
  
  if (command === 'create') {
    console.log('🚀 Creando usuarios de prueba...\n');
    
    const testUsers = [
      {
        email: 'test.admin@utem.cl',
        password: 'admin123456',
        displayName: 'Administrador Test',
        role: 'admin'
      },
      {
        email: 'test.coordinator@utem.cl',
        password: 'coord123456',
        displayName: 'Coordinador Test',
        role: 'coordinator'
      },
      {
        email: 'test.professor@utem.cl',
        password: 'prof123456',
        displayName: 'Profesor Test',
        role: 'professor'
      },
      {
        email: 'test.student@utem.cl',
        password: 'student123456',
        displayName: 'Estudiante Test',
        role: 'student'
      }
    ];
    
    for (const userData of testUsers) {
      await createTestUser(userData.email, userData.password, userData.displayName, userData.role);
    }
    
    console.log('✅ Proceso completado!');
    console.log('\n📝 Usuarios creados para pruebas:');
    testUsers.forEach(user => {
      console.log(`   ${user.email} / ${user.password} (${user.role})`);
    });
    
  } else if (command === 'test') {
    console.log('🧪 Probando login de usuarios existentes...\n');
    
    const testCredentials = [
      { email: 'test.admin@utem.cl', password: 'admin123456' },
      { email: 'test.student@utem.cl', password: 'student123456' },
      { email: 'marayad@utem.cl', password: 'password123' } // Usuario real si existe
    ];
    
    for (const cred of testCredentials) {
      await testLogin(cred.email, cred.password);
    }
    
  } else {
    console.log('🔧 Script de gestión de usuarios para login con correo');
    console.log('\nUso:');
    console.log('  node testEmailAuth.cjs create  - Crear usuarios de prueba');
    console.log('  node testEmailAuth.cjs test    - Probar login con usuarios existentes');
    console.log('\nEjemplos:');
    console.log('  node scripts/testEmailAuth.cjs create');
    console.log('  node scripts/testEmailAuth.cjs test');
  }
}

main().catch(console.error);