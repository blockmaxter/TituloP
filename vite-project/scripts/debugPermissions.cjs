const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

// Mapeo de roles a permisos desde el código
const ROLE_PERMISSIONS = {
  'admin': [
    // Todos los permisos para el administrador
    'view_dashboard', 'view_analytics', 'view_detailed_analytics',
    'view_data_library', 'import_data', 'export_data', 'edit_data', 'delete_data',
    'view_lifecycle', 'manage_lifecycle', 'manage_users', 'manage_roles',
    'view_user_list', 'manage_settings', 'view_settings', 'generate_reports',
    'view_reports', 'create_evaluations', 'view_evaluations', 'edit_evaluations',
    'approve_practices', 'manage_practices', 'view_practices'
  ],
  'professor': [
    'view_dashboard', 'view_analytics', 'view_data_library', 'view_lifecycle',
    'view_reports', 'create_evaluations', 'view_evaluations', 'edit_evaluations',
    'view_practices'
  ],
  'student': [
    'view_dashboard', 'view_analytics', 'view_lifecycle', 'view_practices'
  ],
  'viewer': [
    'view_dashboard', 'view_data_library'
  ]
};

async function debugUserPermissions() {
  try {
    console.log('🔍 Analizando usuarios y permisos...\n');
    
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    
    if (snapshot.empty) {
      console.log('❌ No se encontraron usuarios en la base de datos');
      return;
    }
    
    console.log(`📊 Encontrados ${snapshot.size} usuarios:\n`);
    
    snapshot.forEach(doc => {
      const userData = doc.data();
      const userRole = userData.role || 'sin_rol';
      const expectedPermissions = ROLE_PERMISSIONS[userRole] || [];
      
      console.log(`👤 Usuario: ${userData.displayName || 'Sin nombre'}`);
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   🔑 Rol: ${userRole}`);
      console.log(`   ✅ Activo: ${userData.isActive ? 'Sí' : 'No'}`);
      console.log(`   🛡️  Permisos esperados (${expectedPermissions.length}):`);
      
      expectedPermissions.forEach(permission => {
        const icon = permission === 'view_lifecycle' ? '🔄' : 
                    permission === 'view_analytics' ? '📊' : 
                    permission === 'view_dashboard' ? '🏠' : 
                    permission === 'view_data_library' ? '📚' : '•';
        console.log(`      ${icon} ${permission}`);
      });
      
      // Verificar específicamente los permisos de ciclo de vida
      const hasLifecycle = expectedPermissions.includes('view_lifecycle');
      const hasAnalytics = expectedPermissions.includes('view_analytics');
      const hasDataLibrary = expectedPermissions.includes('view_data_library');
      
      console.log(`\n   🎯 Accesos específicos:`);
      console.log(`      Ciclo de vida: ${hasLifecycle ? '✅ SÍ' : '❌ NO'}`);
      console.log(`      Analítica: ${hasAnalytics ? '✅ SÍ' : '❌ NO'}`);
      console.log(`      Biblioteca de datos: ${hasDataLibrary ? '✅ SÍ' : '❌ NO'}`);
      
      console.log('   ' + '─'.repeat(50));
      console.log();
    });
    
    // Mostrar resumen de estudiantes
    const students = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.role === 'student') {
        students.push(userData);
      }
    });
    
    if (students.length > 0) {
      console.log(`📚 Resumen para ${students.length} estudiante(s):`);
      students.forEach(student => {
        console.log(`   • ${student.displayName || student.email}`);
        console.log(`     ✅ Puede ver: Dashboard, Analítica, Ciclo de vida, Prácticas`);
        console.log(`     ❌ NO puede ver: Biblioteca de datos, Administración`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error al analizar usuarios:', error);
  }
}

debugUserPermissions();