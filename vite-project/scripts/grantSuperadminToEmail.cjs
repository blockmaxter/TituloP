#!/usr/bin/env node

/**
 * Script para otorgar privilegios de SUPER_ADMIN a un usuario específico por email
 * Uso: node grantSuperadminToEmail.js <email>
 * 
 * IMPORTANTE: El usuario debe haber iniciado sesión al menos una vez en la aplicación
 * para que su registro exista en Firestore.
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

async function grantSuperAdmin(userEmail) {
  try {
    console.log('🔐 ===== OTORGANDO PRIVILEGIOS DE SUPER_ADMIN =====');
    console.log(`📧 Email del usuario: ${userEmail}`);
    console.log('');
    console.log('🔍 Buscando usuario en Firestore...');
    
    // Buscar usuario por email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('');
      console.log('❌ ¡ERROR! Usuario no encontrado en la base de datos.');
      console.log('');
      console.log('💡 Para resolver este problema:');
      console.log('   1. El usuario debe visitar la aplicación');
      console.log('   2. Iniciar sesión con su cuenta de Google');
      console.log('   3. Una vez creada la cuenta, ejecutar este script nuevamente');
      console.log('');
      console.log('⚠️  El usuario DEBE iniciar sesión al menos una vez antes de asignar roles.');
      process.exit(1);
    }
    
    // Obtener información del usuario
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;
    
    console.log('✅ Usuario encontrado!');
    console.log('');
    console.log('📋 Información actual del usuario:');
    console.log(`   - Nombre: ${userData.displayName || 'Sin nombre'}`);
    console.log(`   - Email: ${userData.email}`);
    console.log(`   - Rol actual: ${userData.role || 'Sin rol asignado'}`);
    console.log(`   - Estado: ${userData.isActive ? 'Activo' : 'Inactivo'}`);
    console.log(`   - UID: ${userId}`);
    console.log('');
    
    // Actualizar el rol a SUPER_ADMIN
    console.log('🔄 Actualizando rol a SUPER_ADMIN...');
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      role: 'super_admin',
      isActive: true, // Asegurar que el usuario esté activo
      updatedAt: new Date()
    });
    
    console.log('');
    console.log('✅ ¡ÉXITO! Privilegios de SUPER_ADMIN otorgados correctamente');
    console.log('');
    console.log('📋 Nueva configuración del usuario:');
    console.log(`   - Nombre: ${userData.displayName || 'Sin nombre'}`);
    console.log(`   - Email: ${userData.email}`);
    console.log(`   - Rol: SUPER_ADMIN`);
    console.log(`   - Estado: Activo`);
    console.log('');
    console.log('🔐 Permisos otorgados:');
    console.log('   ✓ Acceso completo al sistema');
    console.log('   ✓ Gestión de usuarios y roles');
    console.log('   ✓ Configuración del sistema');
    console.log('   ✓ Acceso a todas las secciones');
    console.log('   ✓ Importación/exportación de datos');
    console.log('   ✓ Gestión del ciclo de vida de prácticas');
    console.log('   ✓ Análisis avanzado y reportes');
    console.log('');
    console.log('🔄 IMPORTANTE: El usuario debe:');
    console.log('   1. Cerrar sesión en la aplicación (si está conectado)');
    console.log('   2. Volver a iniciar sesión');
    console.log('   3. Refrescar la página (F5)');
    console.log('');
    console.log('🎉 ¡Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('');
    console.error('❌ ERROR al otorgar privilegios:', error.message);
    console.error('');
    
    if (error.code === 'permission-denied') {
      console.error('⚠️  Error de permisos. Verifica que:');
      console.error('   - Las credenciales de Firebase sean correctas');
      console.error('   - Las reglas de Firestore permitan esta operación');
    }
    
    process.exit(1);
  }
}

// Validar argumentos de línea de comandos
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('');
  console.log('📧 USO DEL SCRIPT');
  console.log('================');
  console.log('');
  console.log('node grantSuperadminToEmail.js <email>');
  console.log('');
  console.log('EJEMPLO:');
  console.log('  node grantSuperadminToEmail.js marayad@utem.cl');
  console.log('');
  process.exit(1);
}

// Validar formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(userEmail)) {
  console.log('');
  console.log('❌ ERROR: Formato de email inválido');
  console.log('');
  console.log('Por favor, proporciona un email válido.');
  console.log('Ejemplo: usuario@utem.cl');
  console.log('');
  process.exit(1);
}

// Ejecutar la función
grantSuperAdmin(userEmail).then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
