"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.Permission = exports.UserRole = void 0;
// Tipos de roles disponibles en el sistema
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["COORDINATOR"] = "coordinator";
    UserRole["PROFESSOR"] = "professor";
    UserRole["STUDENT"] = "student";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (exports.UserRole = UserRole = {}));
// Permisos específicos del sistema
var Permission;
(function (Permission) {
    // Dashboard
    Permission["VIEW_DASHBOARD"] = "view_dashboard";
    Permission["VIEW_ANALYTICS"] = "view_analytics";
    Permission["VIEW_DETAILED_ANALYTICS"] = "view_detailed_analytics";
    // Biblioteca de datos
    Permission["VIEW_DATA_LIBRARY"] = "view_data_library";
    Permission["IMPORT_DATA"] = "import_data";
    Permission["EXPORT_DATA"] = "export_data";
    Permission["EDIT_DATA"] = "edit_data";
    Permission["DELETE_DATA"] = "delete_data";
    // Ciclo de vida
    Permission["VIEW_LIFECYCLE"] = "view_lifecycle";
    Permission["MANAGE_LIFECYCLE"] = "manage_lifecycle";
    // Usuarios y administración
    Permission["MANAGE_USERS"] = "manage_users";
    Permission["MANAGE_ROLES"] = "manage_roles";
    Permission["VIEW_USER_LIST"] = "view_user_list";
    // Configuración
    Permission["MANAGE_SETTINGS"] = "manage_settings";
    Permission["VIEW_SETTINGS"] = "view_settings";
    // Reportes
    Permission["GENERATE_REPORTS"] = "generate_reports";
    Permission["VIEW_REPORTS"] = "view_reports";
    // Evaluaciones
    Permission["CREATE_EVALUATIONS"] = "create_evaluations";
    Permission["VIEW_EVALUATIONS"] = "view_evaluations";
    Permission["EDIT_EVALUATIONS"] = "edit_evaluations";
    // Práticas profesionales
    Permission["APPROVE_PRACTICES"] = "approve_practices";
    Permission["MANAGE_PRACTICES"] = "manage_practices";
    Permission["VIEW_PRACTICES"] = "view_practices";
})(Permission || (exports.Permission = Permission = {}));
// Mapeo de roles a permisos
exports.ROLE_PERMISSIONS = (_a = {},
    _a[UserRole.SUPER_ADMIN] = __spreadArray([], Object.values(Permission), true),
    _a[UserRole.ADMIN] = [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_DETAILED_ANALYTICS,
        Permission.VIEW_DATA_LIBRARY,
        Permission.IMPORT_DATA,
        Permission.EXPORT_DATA,
        Permission.EDIT_DATA,
        Permission.DELETE_DATA,
        Permission.VIEW_LIFECYCLE,
        Permission.MANAGE_LIFECYCLE,
        Permission.MANAGE_USERS,
        Permission.VIEW_USER_LIST,
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_SETTINGS,
        Permission.GENERATE_REPORTS,
        Permission.VIEW_REPORTS,
        Permission.CREATE_EVALUATIONS,
        Permission.VIEW_EVALUATIONS,
        Permission.EDIT_EVALUATIONS,
        Permission.APPROVE_PRACTICES,
        Permission.MANAGE_PRACTICES,
        Permission.VIEW_PRACTICES
    ],
    _a[UserRole.COORDINATOR] = [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_DATA_LIBRARY,
        Permission.IMPORT_DATA,
        Permission.EXPORT_DATA,
        Permission.EDIT_DATA,
        Permission.VIEW_LIFECYCLE,
        Permission.MANAGE_LIFECYCLE,
        Permission.VIEW_USER_LIST,
        Permission.VIEW_SETTINGS,
        Permission.GENERATE_REPORTS,
        Permission.VIEW_REPORTS,
        Permission.CREATE_EVALUATIONS,
        Permission.VIEW_EVALUATIONS,
        Permission.EDIT_EVALUATIONS,
        Permission.APPROVE_PRACTICES,
        Permission.MANAGE_PRACTICES,
        Permission.VIEW_PRACTICES
    ],
    _a[UserRole.PROFESSOR] = [
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
    _a[UserRole.STUDENT] = [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_LIFECYCLE,
        Permission.VIEW_PRACTICES
    ],
    _a[UserRole.VIEWER] = [
        Permission.VIEW_DASHBOARD,
        Permission.VIEW_DATA_LIBRARY
    ],
    _a);
