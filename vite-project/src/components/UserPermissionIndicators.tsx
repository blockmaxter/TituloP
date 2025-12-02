import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import { UserRole } from '@/types/permissions';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, ShieldX, User, Eye, GraduationCap, BookOpen } from 'lucide-react';

interface RoleBadgeProps {
  className?: string;
  showIcon?: boolean;
  showPermissionCount?: boolean;
}

const ROLE_CONFIG = {
  [UserRole.ADMIN]: {
    label: 'Administrador',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: ShieldCheck,
    description: 'Gestión administrativa completa'
  },
  [UserRole.PROFESSOR]: {
    label: 'Profesor',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: GraduationCap,
    description: 'Gestión académica y evaluaciones'
  },
  [UserRole.STUDENT]: {
    label: 'Estudiante',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: BookOpen,
    description: 'Acceso a información académica'
  },
  [UserRole.VIEWER]: {
    label: 'Visitante',
    color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-700',
    icon: Eye,
    description: 'Solo lectura'
  }
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ 
  className = '', 
  showIcon = true, 
  showPermissionCount = false 
}) => {
  const { user } = usePermissions();

  if (!user) return null;

  const config = ROLE_CONFIG[user.role];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${className} flex items-center gap-1`}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      <span>{config.label}</span>
      {showPermissionCount && (
        <span className="text-xs opacity-75">
          ({user.permissions.length})
        </span>
      )}
    </Badge>
  );
};

interface PermissionIndicatorProps {
  className?: string;
}

export const PermissionIndicator: React.FC<PermissionIndicatorProps> = ({ className = '' }) => {
  const { user, loading } = usePermissions();

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Shield className="h-4 w-4 animate-pulse text-gray-400" />
        <span className="text-sm text-gray-500">Verificando...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <ShieldX className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">Sin autenticar</span>
      </div>
    );
  }

  const config = ROLE_CONFIG[user.role];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Shield className="h-4 w-4 text-green-500" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{user.displayName || user.email}</span>
          <RoleBadge showIcon={false} />
        </div>
        <span className="text-xs text-gray-500">{config.description}</span>
      </div>
    </div>
  );
};

interface UserPermissionsSummaryProps {
  className?: string;
}

export const UserPermissionsSummary: React.FC<UserPermissionsSummaryProps> = ({ className = '' }) => {
  const { user } = usePermissions();

  if (!user) return null;

  const config = ROLE_CONFIG[user.role];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{config.label}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Permisos activos:</span>
          <span className="font-medium">{user.permissions.length}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Estado:</span>
          <Badge variant={user.isActive ? "default" : "destructive"} className="text-xs">
            {user.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Registro:</span>
          <span className="text-muted-foreground">
            {user.createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};