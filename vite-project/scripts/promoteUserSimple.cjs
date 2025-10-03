const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, updateDoc, doc } = require('firebase/firestore');

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
const db = getFirestore(app);

async function promoteToSuperAdmin(userEmail) {
  try {
    console.log(`🔍 Buscando usuario: ${userEmail}`);
    
    // Buscar usuario por email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ Usuario no encontrado. El usuario debe iniciar sesión al menos una vez.');
      console.log('💡 Instrucciones para el usuario:');
      console.log('   1. Ir a la aplicación web');
      console.log('   2. Hacer clic en "Iniciar sesión"');
      console.log('   3. Autenticarse con Google usando el email: ' + userEmail);
      console.log('   4. Luego ejecutar este script nuevamente');
      console.log('');
      console.log('🌐 URL de la aplicación: http://localhost:5173 (cuando esté ejecutándose)');
      return;
    }
    
    // Actualizar el rol del usuario
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'users', userDoc.id);
    
    console.log(`📄 Datos actuales del usuario:`);
    console.log(`   Email: ${userDoc.data().email}`);
    console.log(`   Nombre: ${userDoc.data().displayName || 'Sin nombre'}`);
    console.log(`   Rol actual: ${userDoc.data().role || 'Sin rol'}`);
    console.log(`   Estado: ${userDoc.data().isActive ? 'Activo' : 'Inactivo'}`);
    
    await updateDoc(userRef, {
      role: 'super_admin',
      updatedAt: new Date()
    });
    
    console.log('');
    console.log('✅ ¡ÉXITO! Usuario promovido a SUPER_ADMIN');
    console.log(`👤 Usuario: ${userDoc.data().displayName || userEmail}`);
    console.log(`🆔 UID: ${userDoc.id}`);
    console.log(`📧 Email: ${userEmail}`);
    console.log('');
    console.log('🔄 Próximos pasos:');
    console.log('   1. El usuario debe refrescar la página web');
    console.log('   2. Verá la nueva sección "Administración" en el sidebar');
    console.log('   3. Tendrá acceso completo a todas las funcionalidades');
    
  } catch (error) {
    console.error('❌ Error al promover usuario:', error);
    console.log('');
    console.log('🔍 Posibles soluciones:');
    console.log('   - Verificar que Firebase esté configurado correctamente');
    console.log('   - Verificar conexión a internet');
    console.log('   - Verificar que el proyecto de Firebase sea el correcto');
  }
}

// Obtener email del argumento de línea de comandos
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('📧 Uso: node promoteUserSimple.cjs email@ejemplo.com');
  console.log('');
  console.log('Ejemplos:');
  console.log('  node scripts/promoteUserSimple.cjs admin@utem.cl');
  console.log('  node scripts/promoteUserSimple.cjs marayad@utem.cl');
  process.exit(1);
}

// Validar formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(userEmail)) {
  console.log('❌ Formato de email inválido: ' + userEmail);
  console.log('✅ Formato correcto: usuario@dominio.com');
  process.exit(1);
}

console.log('🚀 Iniciando promoción a SUPER_ADMIN...');
console.log('📧 Email objetivo: ' + userEmail);
console.log('');

promoteToSuperAdmin(userEmail);