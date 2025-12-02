// Tipos de roles disponibles en el sistema
export enum UserRole {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  STUDENT = 'student',
  VIEWER = 'viewer'
}

// Permisos específicos del sistema
export enum Permission {
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
  
  // Ciclo de vida
  VIEW_LIFECYCLE = 'view_lifecycle',
  MANAGE_LIFECYCLE = 'manage_lifecycle',
  
  // Usuarios y administración
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  VIEW_USER_LIST = 'view_user_list',
  
  // Configuración
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_SETTINGS = 'view_settings',
  
  // Reportes
  GENERATE_REPORTS = 'generate_reports',
  VIEW_REPORTS = 'view_reports',
  
  // Evaluaciones
  CREATE_EVALUATIONS = 'create_evaluations',
  VIEW_EVALUATIONS = 'view_evaluations',
  EDIT_EVALUATIONS = 'edit_evaluations',
  
  // Práticas profesionales
  APPROVE_PRACTICES = 'approve_practices',
  MANAGE_PRACTICES = 'manage_practices',
  VIEW_PRACTICES = 'view_practices'
}

// Mapeo de roles a permisos
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Todos los permisos para el administrador
    ...Object.values(Permission)
  ],
  
  [UserRole.PROFESSOR]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_DATA_LIBRARY,
    Permission.VIEW_LIFECYCLE,
    Permission.VIEW_REPORTS,
    Permission.CREATE_EVALUATIONS,
    Permission.VIEW_EVALUATIONS,
    Permission.EDIT_EVALUATIONS,
    Permission.VIEW_PRACTICES
  ],
  
  [UserRole.STUDENT]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_LIFECYCLE,
    Permission.VIEW_PRACTICES
  ],
  
  [UserRole.VIEWER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_DATA_LIBRARY
  ]
};

// Información del usuario con permisos
export interface UserWithPermissions {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Context state para permisos
export interface PermissionsContextState {
  user: UserWithPermissions | null;
  loading: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  refreshUserPermissions: () => Promise<void>;
}