import { doc, updateDoc, collection, getDocs, query, where, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserRole, UserWithPermissions, ROLE_PERMISSIONS } from '@/types/permissions';

/**
 * Actualizar el rol de un usuario
 */
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    throw error;
  }
};

/**
 * Activar o desactivar un usuario
 */
export const toggleUserStatus = async (userId: string, isActive: boolean): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isActive,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error al cambiar estado de usuario:', error);
    throw error;
  }
};

/**
 * Obtener todos los usuarios
 */
export const getAllUsers = async (): Promise<UserWithPermissions[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const role = data.role as UserRole || UserRole.VIEWER;
      
      return {
        uid: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        role,
        permissions: ROLE_PERMISSIONS[role] || [],
        isActive: data.isActive !== false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtener usuarios por rol
 */
export const getUsersByRole = async (role: UserRole): Promise<UserWithPermissions[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('role', '==', role));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        uid: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        role: data.role as UserRole,
        permissions: ROLE_PERMISSIONS[role],
        isActive: data.isActive !== false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error('Error al obtener usuarios por rol:', error);
    throw error;
  }
};

/**
 * Crear un nuevo usuario manualmente (por admin)
 */
export const createUser = async (userData: {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
}): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userData.uid);
    const now = new Date();
    
    await setDoc(userRef, {
      email: userData.email,
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      role: userData.role,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Eliminar un usuario (solo marcar como inactivo)
 */
export const deactivateUser = async (userId: string): Promise<void> => {
  try {
    await toggleUserStatus(userId, false);
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    throw error;
  }
};

/**
 * Eliminar usuario permanentemente (solo para super admin)
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

/**
 * Verificar si un email ya existe en la base de datos
 */
export const emailExists = async (email: string): Promise<boolean> => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    return !snapshot.empty;
  } catch (error) {
    console.error('Error al verificar email:', error);
    return false;
  }
};

/**
 * Obtener estadísticas de usuarios
 */
export const getUserStats = async () => {
  try {
    const users = await getAllUsers();
    
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      byRole: {} as Record<UserRole, number>,
      recentSignups: users.filter(u => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return u.createdAt > weekAgo;
      }).length
    };

    // Contar por roles
    Object.values(UserRole).forEach(role => {
      stats.byRole[role] = users.filter(u => u.role === role).length;
    });

    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};