#!/usr/bin/env node

/**
 * Script para verificar el rol asignado a un usuario
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

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

async function checkUserRole(userEmail) {
  try {
    console.log(`🔍 Verificando usuario: ${userEmail}`);
    
    // Buscar usuario por email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ Usuario no encontrado en la base de datos.');
      console.log('💡 El usuario debe iniciar sesión en la aplicación al menos una vez.');
      console.log('🔧 Configuración en el código:');
      console.log(`   - ${userEmail} está configurado como SUPER_ADMIN por defecto`);
      console.log('   - Se asignará automáticamente al iniciar sesión');
      return false;
    }
    
    // Mostrar información del usuario
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ Usuario encontrado en la base de datos:');
    console.log(`📧 Email: ${userData.email}`);
    console.log(`👤 Nombre: ${userData.displayName || 'Sin nombre'}`);
    console.log(`🎭 Rol: ${userData.role || 'Sin rol asignado'}`);
    console.log(`📊 Estado: ${userData.isActive ? 'Activo' : 'Inactivo'}`);
    console.log(`🆔 UID: ${userDoc.id}`);
    console.log(`📅 Creado: ${userData.createdAt?.toDate?.() || 'N/A'}`);
    console.log(`🔄 Actualizado: ${userData.updatedAt?.toDate?.() || 'N/A'}`);
    
    if (userData.role === 'super_admin') {
      console.log('🎉 ¡El usuario tiene privilegios de SUPER_ADMIN!');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error al verificar usuario:', error.message);
    return false;
  }
}

// Obtener email del argumento
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('📧 Uso: node checkUserRole.cjs <email>');
  console.log('Ejemplo: node checkUserRole.cjs marayad@utem.cl');
  process.exit(1);
}

// Ejecutar
checkUserRole(userEmail).then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});