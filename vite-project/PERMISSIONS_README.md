# Sistema de Permisos - Documentación

Este documento explica cómo funciona el sistema de permisos implementado en la aplicación y cómo utilizarlo.

## Arquitectura del Sistema

### 1. Tipos de Roles

El sistema define 6 roles principales:

- **SUPER_ADMIN**: Acceso completo al sistema
- **ADMIN**: Gestión administrativa completa
- **COORDINATOR**: Coordinación de prácticas y estudiantes
- **PROFESSOR**: Gestión académica y evaluaciones
- **STUDENT**: Acceso a información académica
- **VIEWER**: Solo lectura

### 2. Permisos Específicos

Los permisos están granularmente definidos en `/src/types/permissions.ts`:

```typescript
enum Permission {
  // Dashboard
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_DETAILED_ANALYTICS = 'view_detailed_analytics',
  
  // Biblioteca de datos
  VIEW_DATA_LIBRARY = 'view_data_library',
  IMPORT_DATA = 'import_data',
  EXPORT_DATA = 'export_data',
  EDIT_DATA = 'edit_data',
  DELETE_DATA = 'delete_data',
  
  // Administración
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  // ... más permisos
}
```

### 3. Mapeo de Roles a Permisos

El archivo `/src/types/permissions.ts` contiene el mapeo `ROLE_PERMISSIONS` que define qué permisos tiene cada rol.

## Componentes del Sistema

### 1. PermissionsProvider

El contexto global que maneja el estado de autenticación y permisos:

```tsx
import { PermissionsProvider } from '@/contexts/PermissionsContext';

function App() {
  return (
    <PermissionsProvider>
      {/* Tu aplicación */}
    </PermissionsProvider>
  );
}
```

### 2. usePermissions Hook

Hook para acceder a los permisos en cualquier componente:

```tsx
import { usePermissions } from '@/contexts/PermissionsContext';

function MyComponent() {
  const { user, hasPermission, hasRole } = usePermissions();
  
  if (hasPermission(Permission.MANAGE_USERS)) {
    // Mostrar funcionalidad para gestionar usuarios
  }
  
  return <div>...</div>;
}
```

### 3. ProtectedRoute

Componente para proteger rutas o contenido basado en permisos:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Permission } from '@/types/permissions';

// Proteger contenido con permisos específicos
<ProtectedRoute requiredPermissions={[Permission.MANAGE_USERS]}>
  <AdminPanel />
</ProtectedRoute>

// Proteger con roles específicos
<ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
  <AdminContent />
</ProtectedRoute>

// Requerir TODOS los permisos (por defecto requiere AL MENOS UNO)
<ProtectedRoute 
  requiredPermissions={[Permission.EDIT_DATA, Permission.DELETE_DATA]}
  requireAll={true}
>
  <DataEditor />
</ProtectedRoute>

// Con fallback personalizado
<ProtectedRoute 
  requiredPermissions={[Permission.VIEW_ANALYTICS]}
  fallback={<div>Acceso restringido</div>}
>
  <AnalyticsContent />
</ProtectedRoute>
```

### 4. Indicadores de Permisos

Componentes para mostrar información del usuario y sus permisos:

```tsx
import { RoleBadge, PermissionIndicator } from '@/components/UserPermissionIndicators';

// Badge con el rol del usuario
<RoleBadge showIcon={true} showPermissionCount={true} />

// Indicador completo de permisos
<PermissionIndicator />
```

## Gestión de Usuarios

### Panel de Administración

El componente `UserManagement` en `/src/components/admin/UserManagement.tsx` permite a los administradores:

- Ver lista de todos los usuarios
- Cambiar roles de usuarios
- Activar/desactivar usuarios
- Ver estadísticas de usuarios

### Funciones de Utilidad

En `/src/lib/userPermissions.ts` se encuentran funciones para:

```typescript
// Actualizar rol de usuario
await updateUserRole(userId, UserRole.ADMIN);

// Cambiar estado de usuario
await toggleUserStatus(userId, false); // desactivar

// Obtener todos los usuarios
const users = await getAllUsers();

// Obtener estadísticas
const stats = await getUserStats();
```

## Base de Datos (Firestore)

### Estructura de Usuario

```javascript
// Colección: users
{
  email: "usuario@utem.cl",
  displayName: "Nombre Usuario",
  photoURL: "https://...",
  role: "admin", // UserRole enum
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Reglas de Seguridad Sugeridas

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer su propia información
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin']);
    }
    
    // Solo admins pueden listar todos los usuarios
    match /users/{document=**} {
      allow list: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
    }
  }
}
```

## Configuración Inicial

### 1. Roles por Defecto

El sistema determina automáticamente el rol inicial basado en el email:

- Emails en `adminEmails` array → ADMIN
- Emails con palabras clave de profesor → PROFESSOR  
- Emails @utem.cl → STUDENT
- Otros emails → VIEWER

### 2. Restricciones de Dominio

Por defecto, solo emails `@utem.cl` pueden registrarse automáticamente. Usuarios externos necesitan ser agregados manualmente por un administrador.

## Ejemplos de Uso

### Proteger una Sección Completa

```tsx
function Dashboard() {
  return (
    <ProtectedRoute requiredPermissions={[Permission.VIEW_DASHBOARD]}>
      <div>
        <h1>Dashboard</h1>
        
        {/* Subsección que requiere permisos adicionales */}
        <ProtectedRoute requiredPermissions={[Permission.VIEW_DETAILED_ANALYTICS]}>
          <DetailedAnalytics />
        </ProtectedRoute>
      </div>
    </ProtectedRoute>
  );
}
```

### Renderizado Condicional

```tsx
function Navigation() {
  const { hasPermission } = usePermissions();
  
  return (
    <nav>
      <NavItem href="/dashboard">Dashboard</NavItem>
      
      {hasPermission(Permission.VIEW_DATA_LIBRARY) && (
        <NavItem href="/data">Biblioteca de Datos</NavItem>
      )}
      
      {hasPermission(Permission.MANAGE_USERS) && (
        <NavItem href="/admin">Administración</NavItem>
      )}
    </nav>
  );
}
```

### Botones con Permisos

```tsx
function DataTable() {
  const { hasPermission } = usePermissions();
  
  return (
    <div>
      <table>
        {/* ... datos ... */}
      </table>
      
      <div className="actions">
        {hasPermission(Permission.IMPORT_DATA) && (
          <Button>Importar</Button>
        )}
        
        {hasPermission(Permission.EXPORT_DATA) && (
          <Button>Exportar</Button>
        )}
        
        {hasPermission(Permission.DELETE_DATA) && (
          <Button variant="destructive">Eliminar</Button>
        )}
      </div>
    </div>
  );
}
```

## Consideraciones de Seguridad

1. **Validación Client-Side**: Los permisos en el frontend son solo para UX. Siempre validar en el backend.

2. **Tokens de Sesión**: Firebase Auth maneja automáticamente la renovación de tokens.

3. **Firestore Rules**: Implementar reglas de seguridad que reflejen los permisos del sistema.

4. **Logs de Auditoría**: Considerar implementar logs para cambios de permisos y accesos.

5. **Gestión de Sesiones**: El sistema cierra automáticamente sesiones de usuarios desactivados.

## Extensión del Sistema

### Agregar Nuevos Permisos

1. Definir en `Permission` enum
2. Agregar a los roles correspondientes en `ROLE_PERMISSIONS`
3. Usar en componentes con `ProtectedRoute` o `hasPermission`

### Agregar Nuevos Roles

1. Definir en `UserRole` enum
2. Agregar entrada en `ROLE_PERMISSIONS`
3. Actualizar `ROLE_LABELS` y `ROLE_COLORS` en componentes UI
4. Actualizar lógica de rol por defecto si es necesario

## Troubleshooting

### Usuario No Puede Acceder

1. Verificar que el usuario esté activo (`isActive: true`)
2. Verificar que tenga el rol correcto
3. Verificar que el rol tenga los permisos necesarios
4. Revisar restricciones de dominio de email

### Permisos No se Actualizan

1. Llamar a `refreshUserPermissions()` después de cambios
2. Verificar que los cambios se guardaron en Firestore
3. Revisar caché del navegador

### Errores de Autenticación

1. Verificar configuración de Firebase
2. Revisar reglas de Firestore
3. Verificar conexión a internet
4. Revisar logs de consola del navegador