#!/usr/bin/env node

/**
 * Script simple para otorgar privilegios de SUPER_ADMIN
 * Uso: node makeSuperAdmin.cjs <email>
 */

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

async function makeSuperAdmin(userEmail) {
  try {
    console.log(`🔍 Buscando usuario: ${userEmail}`);
    
    // Buscar usuario por email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ Usuario no encontrado en la base de datos.');
      console.log('💡 El usuario debe iniciar sesión en la aplicación al menos una vez.');
      return false;
    }
    
    // Obtener información del usuario
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;
    
    console.log(`✅ Usuario encontrado: ${userData.displayName || userData.email}`);
    console.log(`📧 Email: ${userData.email}`);
    console.log(`🆔 UID: ${userId}`);
    console.log(`📋 Rol actual: ${userData.role || 'Sin rol'}`);
    
    // Actualizar el rol a SUPER_ADMIN
    console.log('🔄 Actualizando rol a SUPER_ADMIN...');
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      role: 'super_admin',
      isActive: true,
      updatedAt: new Date()
    });
    
    console.log('✅ ¡ÉXITO! Usuario promovido a SUPER_ADMIN');
    console.log('🔄 El usuario debe refrescar la página para ver los cambios');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('⚠️  Error de permisos de Firestore');
      console.error('📝 Intenta crear/actualizar el usuario manualmente en la aplicación');
    }
    
    return false;
  }
}

// Obtener email del argumento
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('📧 Uso: node makeSuperAdmin.cjs <email>');
  console.log('Ejemplo: node makeSuperAdmin.cjs marayad@utem.cl');
  process.exit(1);
}

// Ejecutar
makeSuperAdmin(userEmail).then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});