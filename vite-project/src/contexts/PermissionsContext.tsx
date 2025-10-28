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
    
    console.log('Buscando usuario en Firestore:', firebaseUser.uid);
    
    try {
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log('Usuario encontrado en Firestore');
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
      }
    } catch (error) {
      console.error('Error al leer de Firestore:', error);
      console.log('Continuando con usuario por defecto debido a error de Firestore');
    }

    // Si no existe documento o hay error, crear usuario por defecto
    console.log('Usuario no encontrado o error de Firestore, creando usuario por defecto');
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

    // Intentar guardar en Firestore (puede fallar por permisos)
    try {
      console.log('Intentando guardar nuevo usuario en Firestore:', newUser.email, 'con rol:', newUser.role);
      await setDoc(userDocRef, {
        email: newUser.email,
        displayName: newUser.displayName,
        photoURL: newUser.photoURL,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: now,
        updatedAt: now
      });
      console.log('Usuario creado exitosamente en Firestore');
    } catch (saveError) {
      console.error('Error al guardar en Firestore:', saveError);
      console.log('Continuando con usuario en memoria (sin persistir en Firestore)');
    }

    return newUser;
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
          console.log('Procesando usuario autenticado:', firebaseUser.email);
          
          // Verificar restricción de dominio para usuarios de UTEM
          if (firebaseUser.email && !firebaseUser.email.endsWith('@utem.cl')) {
            console.log('Usuario sin dominio @utem.cl, verificando en Firestore...');
            // Permitir algunos emails específicos o usuarios externos con roles asignados
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            try {
              const userDoc = await getDoc(userDocRef);
              
              if (!userDoc.exists()) {
                // Usuario externo sin rol asignado - cerrar sesión
                console.log('Usuario externo sin rol asignado, cerrando sesión');
                await auth.signOut();
                setUser(null);
                setLoading(false);
                return;
              }
            } catch (firestoreError) {
              console.error('Error al verificar documento en Firestore:', firestoreError);
              // En caso de error de Firestore, permitir continuar si es @utem.cl
              if (!firebaseUser.email.endsWith('@utem.cl')) {
                await auth.signOut();
                setUser(null);
                setLoading(false);
                return;
              }
            }
          }

          console.log('Obteniendo datos del usuario:', firebaseUser.email);
          const userWithPermissions = await getUserFromFirestore(firebaseUser);
          
          // Verificar si el usuario está activo
          if (!userWithPermissions.isActive) {
            console.log('Usuario inactivo, cerrando sesión');
            await auth.signOut();
            setUser(null);
            setLoading(false);
            return;
          }
          
          console.log('Usuario autenticado exitosamente:', userWithPermissions.email, 'Rol:', userWithPermissions.role);
          setUser(userWithPermissions);
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          setUser(null);
        }
      } else {
        console.log('No hay usuario autenticado');
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