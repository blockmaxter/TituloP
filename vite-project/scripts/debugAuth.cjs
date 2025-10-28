const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

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
const db = getFirestore(app);

async function debugAuth() {
  console.log('🔍 Verificando usuarios en la base de datos...\n');
  
  try {
    // Obtener todos los usuarios
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    if (usersSnapshot.empty) {
      console.log('❌ No hay usuarios en la base de datos');
      console.log('\n📝 Para crear un usuario de prueba, ejecuta:');
      console.log('node scripts/createTestUser.cjs');
      return;
    }
    
    console.log(`📊 Encontrados ${usersSnapshot.size} usuarios:\n`);
    
    usersSnapshot.forEach((doc, index) => {
      const userData = doc.data();
      console.log(`${index + 1}. Usuario ID: ${doc.id}`);
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   👤 Nombre: ${userData.displayName || 'Sin nombre'}`);
      console.log(`   🔑 Rol: ${userData.role || 'Sin rol'}`);
      console.log(`   ✅ Activo: ${userData.isActive !== false ? 'Sí' : 'No'}`);
      console.log(`   📅 Creado: ${userData.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}`);
      console.log('   ─────────────────────────────────────────');
    });
    
    // Verificar usuarios activos con email @utem.cl
    const activeUtemUsers = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.email?.endsWith('@utem.cl') && userData.isActive !== false) {
        activeUtemUsers.push(userData);
      }
    });
    
    console.log(`\n✅ Usuarios activos con @utem.cl: ${activeUtemUsers.length}`);
    
    if (activeUtemUsers.length === 0) {
      console.log('\n⚠️  PROBLEMA DETECTADO: No hay usuarios activos con @utem.cl');
      console.log('\n🔧 SOLUCIONES:');
      console.log('1. Crear usuario de prueba: node scripts/createTestUser.cjs');
      console.log('2. Activar usuario existente: node scripts/activateUser.cjs <email>');
    } else {
      console.log('\n🎯 Usuarios disponibles para login:');
      activeUtemUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.role || 'sin rol'})`);
      });
    }
    
    console.log('\n📋 INSTRUCCIONES DE LOGIN:');
    console.log('1. Ve a http://localhost:5173');
    console.log('2. Haz clic en "Iniciar sesión" en la sidebar');
    console.log('3. Usa uno de los emails mostrados arriba');
    console.log('4. Si no tienes contraseña, usa "Olvidaste tu contraseña"');
    console.log('5. O usa "Iniciar sesión con Google" con cuenta @utem.cl');
    
  } catch (error) {
    console.error('❌ Error al verificar usuarios:', error);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar conexión a internet');
    console.log('2. Verificar configuración de Firebase');
    console.log('3. Verificar reglas de Firestore');
  }
}

debugAuth().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});