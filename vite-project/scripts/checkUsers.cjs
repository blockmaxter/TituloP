#!/usr/bin/env node

/**
 * Script para verificar y crear usuarios de prueba
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc } = require('firebase/firestore');

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

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuarios en Firestore...');
    
    // Intentar obtener todos los usuarios
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    
    console.log(`📊 Usuarios encontrados: ${snapshot.docs.length}`);
    
    if (snapshot.docs.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos');
      console.log('');
      console.log('💡 Posibles soluciones:');
      console.log('   1. Los usuarios deben iniciar sesión en la aplicación al menos una vez');
      console.log('   2. Verifica que las reglas de Firestore permitan la lectura');
      console.log('   3. El usuario actual debe tener rol de administrador');
      console.log('');
      
      // Crear usuario de prueba para marayad@utem.cl si no existe
      console.log('🔄 Creando usuario de prueba para marayad@utem.cl...');
      try {
        const testUserRef = doc(db, 'users', 'test-user-marayad');
        await setDoc(testUserRef, {
          email: 'marayad@utem.cl',
          displayName: 'Usuario de Prueba - Maraya',
          photoURL: '',
          role: 'super_admin',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('✅ Usuario de prueba creado exitosamente');
      } catch (createError) {
        console.error('❌ Error al crear usuario de prueba:', createError.message);
      }
    } else {
      console.log('✅ Usuarios existentes:');
      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${data.email} (${data.role || 'sin rol'}) - ${data.isActive ? 'Activo' : 'Inactivo'}`);
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error al verificar usuarios:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('');
      console.error('⚠️  Error de permisos. Posibles causas:');
      console.error('   - Las reglas de Firestore no permiten leer la colección "users"');
      console.error('   - El usuario actual no tiene rol de administrador asignado');
      console.error('   - El usuario actual no está en la base de datos');
      console.error('');
      console.error('💡 Soluciones:');
      console.error('   1. Asegúrate de haber iniciado sesión como marayad@utem.cl');
      console.error('   2. Verifica las reglas de Firestore');
      console.error('   3. El usuario debe existir en la colección "users" con rol admin/super_admin');
    }
    
    return false;
  }
}

// Ejecutar verificación
checkUsers().then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});