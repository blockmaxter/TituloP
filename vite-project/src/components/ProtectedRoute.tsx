import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Permission, UserRole } from '@/types/permissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  requireAll?: boolean; // true = necesita TODOS los permisos/roles, false = necesita AL MENOS UNO
  fallback?: React.ReactNode;
  showError?: boolean;
  className?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAll = false,
  fallback,
  showError = true,
  className = ''
}) => {
  const { user, loading, hasPermission, hasAnyPermission, hasRole } = usePermissions();

  // Mostrar loading mientras se cargan los permisos
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Verificando permisos...</span>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showError) {
      return (
        <Alert className={`m-4 ${className}`}>
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            Debes iniciar sesión para acceder a este contenido.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  // Verificar permisos
  const hasRequiredPermissions = (() => {
    if (requiredPermissions.length === 0) return true;
    
    if (requireAll) {
      return requiredPermissions.every(permission => hasPermission(permission));
    } else {
      return hasAnyPermission(requiredPermissions);
    }
  })();

  // Verificar roles
  const hasRequiredRoles = (() => {
    if (requiredRoles.length === 0) return true;
    
    if (requireAll) {
      return requiredRoles.every(role => hasRole(role));
    } else {
      return requiredRoles.some(role => hasRole(role));
    }
  })();

  // Si no tiene los permisos o roles necesarios
  if (!hasRequiredPermissions || !hasRequiredRoles) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showError) {
      return (
        <Alert className={`m-4 border-red-200 bg-red-50 ${className}`}>
          <ShieldX className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            No tienes permisos suficientes para acceder a este contenido.
            {user.role && (
              <div className="mt-1 text-sm text-red-600">
                Tu rol actual: <span className="font-medium">{user.role}</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  // Usuario tiene permisos, mostrar contenido
  return <div className={className}>{children}</div>;
};

// Hook personalizado para usar en componentes
export const useProtectedAccess = () => {
  const { hasPermission, hasAnyPermission, hasRole, user } = usePermissions();
  
  return {
    canAccess: (permissions: Permission[], roles: UserRole[] = [], requireAll = false) => {
      if (!user) return false;
      
      const hasRequiredPermissions = permissions.length === 0 || 
        (requireAll ? permissions.every(p => hasPermission(p)) : hasAnyPermission(permissions));
      
      const hasRequiredRoles = roles.length === 0 || 
        (requireAll ? roles.every(r => hasRole(r)) : roles.some(r => hasRole(r)));
      
      return hasRequiredPermissions && hasRequiredRoles;
    },
    hasPermission,
    hasAnyPermission,
    hasRole,
    user
  };
};