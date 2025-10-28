const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

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

async function testLogin() {
  const email = 'test.student@utem.cl';
  const password = 'TestPassword123!';
  
  console.log('🔍 Probando login completo...');
  console.log(`📧 Email: ${email}`);
  
  try {
    // Step 1: Intentar login
    console.log('\n1️⃣ Intentando autenticación con Firebase Auth...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Autenticación exitosa');
    console.log(`🆔 UID: ${user.uid}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Nombre: ${user.displayName || 'Sin nombre'}`);
    
    // Step 2: Verificar documento en Firestore
    console.log('\n2️⃣ Verificando documento en Firestore...');
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      console.log('✅ Documento encontrado en Firestore');
      const userData = userDoc.data();
      console.log('📊 Datos del usuario:');
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   👤 Nombre: ${userData.displayName || 'Sin nombre'}`);
      console.log(`   🔑 Rol: ${userData.role}`);
      console.log(`   ✅ Activo: ${userData.isActive !== false ? 'Sí' : 'No'}`);
      console.log(`   📅 Creado: ${userData.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}`);
      
      // Step 3: Verificar dominio
      console.log('\n3️⃣ Verificando restricciones de dominio...');
      if (user.email && user.email.endsWith('@utem.cl')) {
        console.log('✅ Email tiene dominio @utem.cl válido');
      } else {
        console.log('❌ Email NO tiene dominio @utem.cl');
      }
      
      // Step 4: Verificar estado activo
      console.log('\n4️⃣ Verificando estado del usuario...');
      if (userData.isActive !== false) {
        console.log('✅ Usuario está activo');
      } else {
        console.log('❌ Usuario está INACTIVO');
      }
      
      console.log('\n🎉 RESULTADO: Login debería funcionar correctamente');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 INSTRUCCIONES:');
      console.log('1. Ve a http://localhost:5173');
      console.log('2. Abre las herramientas de desarrollador (F12)');
      console.log('3. Ve a la pestaña "Console"');
      console.log('4. Haz clic en "Iniciar sesión"');
      console.log('5. Observa los mensajes de log en la consola');
      console.log('6. Usa las credenciales mostradas arriba');
      
    } else {
      console.log('❌ Documento NO encontrado en Firestore');
      console.log('\n🔧 SOLUCIÓN: El sistema debería crear el documento automáticamente');
      console.log('Si no funciona, ejecuta: node scripts/createUserDocument.cjs');
    }
    
    // Cerrar sesión para no interferir
    await auth.signOut();
    
  } catch (error) {
    console.error('\n❌ Error durante el login:', error);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n🔧 SOLUCIÓN: Ejecuta node scripts/createTestUser.cjs');
    } else if (error.code === 'auth/wrong-password') {
      console.log('\n🔧 SOLUCIÓN: La contraseña es incorrecta o usa "Olvidaste tu contraseña"');
    } else if (error.code === 'permission-denied') {
      console.log('\n🔧 SOLUCIÓN: Problema con reglas de Firestore o permisos');
    }
  }
}

testLogin().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});