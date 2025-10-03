import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  UserRole, 
  Permission, 
  ROLE_PERMISSIONS, 
  UserWithPermissions, 
  PermissionsContextState 
} from '@/types/permissions';

const PermissionsContext = createContext<PermissionsContextState | null>(null);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions debe ser usado dentro de PermissionsProvider');
  }
  return context;
};

interface PermissionsProviderProps {
  children: React.ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserWithPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener o crear un usuario en Firestore
  const getUserFromFirestore = async (firebaseUser: User): Promise<UserWithPermissions> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userRole = userData.role as UserRole || UserRole.VIEWER;
      
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: userRole,
        permissions: ROLE_PERMISSIONS[userRole] || [],
        isActive: userData.isActive !== false, // Por defecto true
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date()
      };
    } else {
      // Crear nuevo usuario con rol por defecto
      const defaultRole = determineDefaultRole(firebaseUser.email || '');
      const now = new Date();
      
      const newUser: UserWithPermissions = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: defaultRole,
        permissions: ROLE_PERMISSIONS[defaultRole],
        isActive: true,
        createdAt: now,
        updatedAt: now
      };

      // Guardar en Firestore
      await setDoc(userDocRef, {
        email: newUser.email,
        displayName: newUser.displayName,
        photoURL: newUser.photoURL,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: now,
        updatedAt: now
      });

      return newUser;
    }
  };

  // Determinar rol por defecto basado en el email
  const determineDefaultRole = (email: string): UserRole => {
    // Administradores específicos
    const adminEmails = [
      'admin@utem.cl',
      'coordinador@utem.cl'
    ];

    // Profesores (emails con profesor o docente)
    const professorKeywords = ['profesor', 'docente', 'teacher'];
    
    if (adminEmails.includes(email.toLowerCase())) {
      return UserRole.ADMIN;
    }

    if (email.endsWith('@utem.cl')) {
      const localPart = email.split('@')[0].toLowerCase();
      
      if (professorKeywords.some(keyword => localPart.includes(keyword))) {
        return UserRole.PROFESSOR;
      }
      
      // Por defecto, usuarios de UTEM son estudiantes
      return UserRole.STUDENT;
    }

    // Usuarios externos son viewers por defecto
    return UserRole.VIEWER;
  };

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  // Verificar si el usuario tiene al menos uno de los permisos
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  // Refrescar los permisos del usuario
  const refreshUserPermissions = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      try {
        const updatedUser = await getUserFromFirestore(currentUser);
        setUser(updatedUser);
      } catch (error) {
        console.error('Error al refrescar permisos:', error);
      }
    }
  };

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          // Verificar restricción de dominio para usuarios de UTEM
          if (firebaseUser.email && !firebaseUser.email.endsWith('@utem.cl')) {
            // Permitir algunos emails específicos o usuarios externos con roles asignados
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (!userDoc.exists()) {
              // Usuario externo sin rol asignado - cerrar sesión
              await auth.signOut();
              setUser(null);
              setLoading(false);
              return;
            }
          }

          const userWithPermissions = await getUserFromFirestore(firebaseUser);
          
          // Verificar si el usuario está activo
          if (!userWithPermissions.isActive) {
            await auth.signOut();
            setUser(null);
            setLoading(false);
            return;
          }
          
          setUser(userWithPermissions);
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue: PermissionsContextState = {
    user,
    loading,
    hasPermission,
    hasAnyPermission,
    hasRole,
    refreshUserPermissions
  };

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
};