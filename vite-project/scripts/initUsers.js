import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { UserRole } from '../src/types/permissions';

// Configuración de Firebase (usar las mismas credenciales que en tu app)
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

// Usuarios de ejemplo para inicializar el sistema
const initialUsers = [
  {
    uid: 'admin-001',
    email: 'admin@utem.cl',
    displayName: 'Administrador Sistema',
    photoURL: '',
    role: UserRole.SUPER_ADMIN,
    isActive: true
  },
  {
    uid: 'coord-001', 
    email: 'coordinador@utem.cl',
    displayName: 'Coordinador Prácticas',
    photoURL: '',
    role: UserRole.COORDINATOR,
    isActive: true
  },
  {
    uid: 'prof-001',
    email: 'profesor.juan@utem.cl',
    displayName: 'Juan Pérez',
    photoURL: '',
    role: UserRole.PROFESSOR,
    isActive: true
  },
  {
    uid: 'stud-001',
    email: 'maria.gonzalez@utem.cl',
    displayName: 'María González',
    photoURL: '',
    role: UserRole.STUDENT,
    isActive: true
  },
  {
    uid: 'view-001',
    email: 'visitante@example.com',
    displayName: 'Usuario Visitante',
    photoURL: '',
    role: UserRole.VIEWER,
    isActive: true
  }
];

async function initializeUsers() {
  console.log('🚀 Inicializando usuarios en Firestore...');
  
  try {
    // Verificar si ya existen usuarios
    const usersCollection = collection(db, 'users');
    const existingUsers = await getDocs(usersCollection);
    
    if (!existingUsers.empty) {
      console.log(`⚠️  Ya existen ${existingUsers.size} usuarios en la base de datos.`);
      console.log('¿Deseas continuar y agregar/actualizar usuarios? (y/n)');
      
      // En un entorno real, usarías readline o similar para input del usuario
      // Por ahora, comentamos esta validación
      // return;
    }

    const now = new Date();
    
    for (const user of initialUsers) {
      const userRef = doc(db, 'users', user.uid);
      
      await setDoc(userRef, {
        ...user,
        createdAt: now,
        updatedAt: now
      }, { merge: true }); // merge: true para no sobrescribir si ya existe
      
      console.log(`✅ Usuario creado/actualizado: ${user.email} (${user.role})`);
    }
    
    console.log('\n🎉 Inicialización completa!');
    console.log('\nUsuarios creados:');
    initialUsers.forEach(user => {
      console.log(`  • ${user.email} - ${user.role} - ${user.displayName}`);
    });
    
    console.log('\n📝 Próximos pasos:');
    console.log('1. Los usuarios pueden iniciar sesión con Google usando sus emails');
    console.log('2. Puedes gestionar roles desde el panel de administración');
    console.log('3. Revisa las reglas de Firestore para seguridad');
    
  } catch (error) {
    console.error('❌ Error al inicializar usuarios:', error);
  }
}

// Función para limpiar usuarios de prueba (usar con cuidado)
async function cleanupTestUsers() {
  console.log('🧹 Limpiando usuarios de prueba...');
  
  try {
    const testUserIds = ['admin-001', 'coord-001', 'prof-001', 'stud-001', 'view-001'];
    
    for (const uid of testUserIds) {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { isActive: false, updatedAt: new Date() }, { merge: true });
      console.log(`🔴 Usuario desactivado: ${uid}`);
    }
    
    console.log('✅ Cleanup completado');
  } catch (error) {
    console.error('❌ Error en cleanup:', error);
  }
}

// Función para mostrar estadísticas actuales
async function showUserStats() {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    
    const stats = {
      total: 0,
      active: 0,
      inactive: 0,
      byRole: {}
    };
    
    snapshot.forEach(doc => {
      const userData = doc.data();
      stats.total++;
      
      if (userData.isActive) {
        stats.active++;
      } else {
        stats.inactive++;
      }
      
      const role = userData.role || 'unknown';
      stats.byRole[role] = (stats.byRole[role] || 0) + 1;
    });
    
    console.log('📊 Estadísticas de usuarios:');
    console.log(`  Total: ${stats.total}`);
    console.log(`  Activos: ${stats.active}`);
    console.log(`  Inactivos: ${stats.inactive}`);
    console.log('\n  Por rol:');
    Object.entries(stats.byRole).forEach(([role, count]) => {
      console.log(`    ${role}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
  }
}

// Ejecutar según el argumento de línea de comandos
const command = process.argv[2];

switch (command) {
  case 'init':
    initializeUsers();
    break;
  case 'cleanup':
    cleanupTestUsers();
    break;
  case 'stats':
    showUserStats();
    break;
  default:
    console.log('🔧 Script de gestión de usuarios');
    console.log('\nUso:');
    console.log('  npm run users:init     - Inicializar usuarios de ejemplo');
    console.log('  npm run users:stats    - Mostrar estadísticas');
    console.log('  npm run users:cleanup  - Desactivar usuarios de prueba');
    console.log('\nEjemplos:');
    console.log('  node scripts/initUsers.js init');
    console.log('  node scripts/initUsers.js stats');
}