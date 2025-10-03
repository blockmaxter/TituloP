import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { usePermissions } from "@/contexts/PermissionsContext";
import { UserRole, Permission } from "@/types/permissions";
import { 
  UserIcon, 
  MailIcon, 
  ShieldIcon, 
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon 
} from "lucide-react";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = usePermissions();

  if (!user) {
    return null;
  }

  // Función para formatear el rol
  const formatRole = (role: UserRole): string => {
    const roleLabels: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: "Super Administrador",
      [UserRole.ADMIN]: "Administrador",
      [UserRole.COORDINATOR]: "Coordinador",
      [UserRole.PROFESSOR]: "Profesor",
      [UserRole.STUDENT]: "Estudiante",
      [UserRole.VIEWER]: "Visitante",
    };
    return roleLabels[role] || role;
  };

  // Función para obtener el color del rol
  const getRoleColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: "destructive",
      [UserRole.ADMIN]: "destructive",
      [UserRole.COORDINATOR]: "default",
      [UserRole.PROFESSOR]: "secondary",
      [UserRole.STUDENT]: "outline",
      [UserRole.VIEWER]: "outline",
    };
    return colors[role] || "outline";
  };

  // Función para formatear permisos de forma legible
  const formatPermission = (permission: Permission): string => {
    const permissionLabels: Record<Permission, string> = {
      [Permission.VIEW_DASHBOARD]: "Ver Dashboard",
      [Permission.VIEW_ANALYTICS]: "Ver Analítica",
      [Permission.VIEW_DETAILED_ANALYTICS]: "Ver Analítica Detallada",
      [Permission.VIEW_DATA_LIBRARY]: "Ver Biblioteca de Datos",
      [Permission.IMPORT_DATA]: "Importar Datos",
      [Permission.EXPORT_DATA]: "Exportar Datos",
      [Permission.EDIT_DATA]: "Editar Datos",
      [Permission.DELETE_DATA]: "Eliminar Datos",
      [Permission.VIEW_LIFECYCLE]: "Ver Ciclo de Vida",
      [Permission.MANAGE_LIFECYCLE]: "Gestionar Ciclo de Vida",
      [Permission.MANAGE_USERS]: "Gestionar Usuarios",
      [Permission.MANAGE_ROLES]: "Gestionar Roles",
      [Permission.VIEW_USER_LIST]: "Ver Lista de Usuarios",
      [Permission.MANAGE_SETTINGS]: "Gestionar Configuración",
      [Permission.VIEW_SETTINGS]: "Ver Configuración",
      [Permission.GENERATE_REPORTS]: "Generar Reportes",
      [Permission.VIEW_REPORTS]: "Ver Reportes",
      [Permission.CREATE_EVALUATIONS]: "Crear Evaluaciones",
      [Permission.VIEW_EVALUATIONS]: "Ver Evaluaciones",
      [Permission.EDIT_EVALUATIONS]: "Editar Evaluaciones",
      [Permission.APPROVE_PRACTICES]: "Aprobar Prácticas",
      [Permission.MANAGE_PRACTICES]: "Gestionar Prácticas",
      [Permission.VIEW_PRACTICES]: "Ver Prácticas",
    };
    return permissionLabels[permission] || permission;
  };

  // Agrupar permisos por categoría
  const groupPermissions = (permissions: Permission[]) => {
    const groups: Record<string, Permission[]> = {
      "Dashboard y Analítica": [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_DETAILED_ANALYTICS,
      ],
      "Biblioteca de Datos": [
        Permission.VIEW_DATA_LIBRARY,
        Permission.IMPORT_DATA,
        Permission.EXPORT_DATA,
        Permission.EDIT_DATA,
        Permission.DELETE_DATA,
      ],
      "Ciclo de Vida": [
        Permission.VIEW_LIFECYCLE,
        Permission.MANAGE_LIFECYCLE,
      ],
      "Administración": [
        Permission.MANAGE_USERS,
        Permission.MANAGE_ROLES,
        Permission.VIEW_USER_LIST,
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_SETTINGS,
      ],
      "Reportes": [
        Permission.GENERATE_REPORTS,
        Permission.VIEW_REPORTS,
      ],
      "Evaluaciones": [
        Permission.CREATE_EVALUATIONS,
        Permission.VIEW_EVALUATIONS,
        Permission.EDIT_EVALUATIONS,
      ],
      "Prácticas Profesionales": [
        Permission.APPROVE_PRACTICES,
        Permission.MANAGE_PRACTICES,
        Permission.VIEW_PRACTICES,
      ],
    };

    const result: Record<string, Permission[]> = {};
    
    Object.entries(groups).forEach(([category, categoryPermissions]) => {
      const userPermissionsInCategory = categoryPermissions.filter(p => 
        permissions.includes(p)
      );
      if (userPermissionsInCategory.length > 0) {
        result[category] = userPermissionsInCategory;
      }
    });

    return result;
  };

  const groupedPermissions = groupPermissions(user.permissions);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Mi Perfil
          </DialogTitle>
          <DialogDescription>
            Información de tu cuenta y permisos del sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email} />
                  <AvatarFallback className="text-lg">
                    {user.displayName ? 
                      user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() :
                      user.email.charAt(0).toUpperCase()
                    }
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {user.displayName || 'Sin nombre configurado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Miembro desde {user.createdAt.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado de la Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                Estado de la Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rol:</span>
                <Badge variant={getRoleColor(user.role) as any}>
                  {formatRole(user.role)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <div className="flex items-center gap-1">
                  {user.isActive ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        Activo
                      </Badge>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                      <Badge variant="outline" className="text-red-700 border-red-200">
                        Inactivo
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ID de Usuario:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {user.uid.slice(0, 8)}...
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Permisos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Permisos del Sistema ({user.permissions.length})
              </CardTitle>
              <CardDescription>
                Lista de acciones que puedes realizar en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category}>
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">
                          {formatPermission(permission)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {Object.keys(groupedPermissions).indexOf(category) < 
                   Object.keys(groupedPermissions).length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};