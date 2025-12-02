// Script para asignar ADMIN directamente en Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, setDoc } from 'firebase/firestore';
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

async function makeAdmin(userEmail) {
  try {
    console.log(`🔐 Asignando ADMIN a: ${userEmail}`);
    
    // Nota: Necesitarás el UID del usuario, no solo el email
    // El UID se obtiene cuando el usuario se autentica por primera vez
    
    // Si ya conoces el UID:
    const userId = 'USER_UID_AQUI'; // Reemplazar con el UID real
    
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      role: UserRole.ADMIN,
      updatedAt: new Date()
    });
    
    console.log('✅ ADMIN asignado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    // Si el usuario no existe, crearlo
    if (error.code === 'not-found') {
      console.log('👤 Usuario no encontrado, creando nuevo usuario...');
      
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        email: userEmail,
        displayName: userEmail.split('@')[0],
        photoURL: '',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Usuario creado como ADMIN!');
    }
  }
}

// Uso del script
const email = process.argv[2];
if (email) {
  makeAdmin(email);
} else {
  console.log('📧 Uso: node makeAdmin.js email@ejemplo.com');
}