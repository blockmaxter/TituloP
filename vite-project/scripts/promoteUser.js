import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { UserRole } from '../src/types/permissions.js';

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
      console.log('💡 Pídele al usuario que:');
      console.log('   1. Vaya a la aplicación');
      console.log('   2. Inicie sesión con Google');
      console.log('   3. Luego ejecuta este script nuevamente');
      return;
    }
    
    // Actualizar el rol del usuario
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'users', userDoc.id);
    
    await updateDoc(userRef, {
      role: UserRole.ADMIN,
      updatedAt: new Date()
    });
    
    console.log('✅ ¡Éxito! Usuario promovido a ADMIN');
    console.log(`👤 Usuario: ${userDoc.data().displayName || userEmail}`);
    console.log(`🆔 UID: ${userDoc.id}`);
    console.log('🔄 El usuario debe refrescar la página para ver los cambios');
    
  } catch (error) {
    console.error('❌ Error al promover usuario:', error);
  }
}

// Obtener email del argumento de línea de comandos
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('📧 Uso: node promoteUser.js email@ejemplo.com');
  console.log('');
  console.log('Ejemplos:');
  console.log('  node promoteUser.js admin@utem.cl');
  console.log('  node promoteUser.js coordinador@utem.cl');
  process.exit(1);
}

// Validar formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(userEmail)) {
  console.log('❌ Formato de email inválido');
  process.exit(1);
}

promoteToSuperAdmin(userEmail);