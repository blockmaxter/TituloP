import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import { Permission } from '@/types/permissions';

export const DebugPermissions: React.FC = () => {
  const { user, hasPermission } = usePermissions();
  
  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded p-4 max-w-sm">
        <h3 className="font-bold text-red-800">Debug: Sin usuario</h3>
        <p className="text-red-600 text-sm">No hay usuario logueado</p>
      </div>
    );
  }

  const checkPermissions = [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_LIFECYCLE,
    Permission.VIEW_DATA_LIBRARY,
    Permission.MANAGE_USERS
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded p-4 max-w-sm z-50">
      <h3 className="font-bold text-blue-800">Debug: Permisos</h3>
      <div className="text-xs text-blue-600 mt-2">
        <p><strong>Usuario:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
        <p><strong>Activo:</strong> {user.isActive ? 'Sí' : 'No'}</p>
        <div className="mt-2">
          <strong>Permisos:</strong>
          <ul className="ml-2">
            {checkPermissions.map(permission => (
              <li key={permission} className={hasPermission(permission) ? 'text-green-600' : 'text-red-600'}>
                {hasPermission(permission) ? '✅' : '❌'} {permission}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-2">
          <strong>Total permisos:</strong> {user.permissions.length}
        </div>
      </div>
    </div>
  );
};