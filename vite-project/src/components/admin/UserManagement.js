"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagement = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var ProtectedRoute_1 = require("@/components/ProtectedRoute");
var permissions_1 = require("@/types/permissions");
var userPermissions_1 = require("@/lib/userPermissions");
var table_1 = require("@/components/ui/table");
var select_1 = require("@/components/ui/select");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var card_1 = require("@/components/ui/card");
var switch_1 = require("@/components/ui/switch");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var lucide_react_1 = require("lucide-react");
var ROLE_LABELS = (_a = {},
    _a[permissions_1.UserRole.SUPER_ADMIN] = 'Super Admin',
    _a[permissions_1.UserRole.ADMIN] = 'Administrador',
    _a[permissions_1.UserRole.COORDINATOR] = 'Coordinador',
    _a[permissions_1.UserRole.PROFESSOR] = 'Profesor',
    _a[permissions_1.UserRole.STUDENT] = 'Estudiante',
    _a[permissions_1.UserRole.VIEWER] = 'Visitante',
    _a);
var ROLE_COLORS = (_b = {},
    _b[permissions_1.UserRole.SUPER_ADMIN] = 'bg-purple-100 text-purple-800 border-purple-200',
    _b[permissions_1.UserRole.ADMIN] = 'bg-red-100 text-red-800 border-red-200',
    _b[permissions_1.UserRole.COORDINATOR] = 'bg-blue-100 text-blue-800 border-blue-200',
    _b[permissions_1.UserRole.PROFESSOR] = 'bg-green-100 text-green-800 border-green-200',
    _b[permissions_1.UserRole.STUDENT] = 'bg-yellow-100 text-yellow-800 border-yellow-200',
    _b[permissions_1.UserRole.VIEWER] = 'bg-gray-100 text-gray-800 border-gray-200',
    _b);
var UserManagement = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, PermissionsContext_1.usePermissions)(), currentUser = _c.user, refreshUserPermissions = _c.refreshUserPermissions;
    var _d = (0, react_1.useState)([]), users = _d[0], setUsers = _d[1];
    var _e = (0, react_1.useState)([]), filteredUsers = _e[0], setFilteredUsers = _e[1];
    var _f = (0, react_1.useState)(true), loading = _f[0], setLoading = _f[1];
    var _g = (0, react_1.useState)(''), searchTerm = _g[0], setSearchTerm = _g[1];
    var _h = (0, react_1.useState)('all'), roleFilter = _h[0], setRoleFilter = _h[1];
    var _j = (0, react_1.useState)('all'), statusFilter = _j[0], setStatusFilter = _j[1];
    var _k = (0, react_1.useState)(null), stats = _k[0], setStats = _k[1];
    // Cargar usuarios y estadísticas
    var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, usersData, statsData, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, Promise.all([
                            (0, userPermissions_1.getAllUsers)(),
                            (0, userPermissions_1.getUserStats)()
                        ])];
                case 1:
                    _a = _b.sent(), usersData = _a[0], statsData = _a[1];
                    setUsers(usersData);
                    setStats(statsData);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error al cargar datos:', error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Filtrar usuarios
    (0, react_1.useEffect)(function () {
        var filtered = users;
        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(function (user) {
                var _a;
                return user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ((_a = user.displayName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm.toLowerCase()));
            });
        }
        // Filtrar por rol
        if (roleFilter !== 'all') {
            filtered = filtered.filter(function (user) { return user.role === roleFilter; });
        }
        // Filtrar por estado
        if (statusFilter !== 'all') {
            filtered = filtered.filter(function (user) {
                return statusFilter === 'active' ? user.isActive : !user.isActive;
            });
        }
        setFilteredUsers(filtered);
    }, [users, searchTerm, roleFilter, statusFilter]);
    (0, react_1.useEffect)(function () {
        loadData();
    }, []);
    // Cambiar rol de usuario
    var handleRoleChange = function (userId, newRole) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, userPermissions_1.updateUserRole)(userId, newRole)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadData()];
                case 2:
                    _a.sent(); // Recargar datos
                    if (!(userId === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid))) return [3 /*break*/, 4];
                    return [4 /*yield*/, refreshUserPermissions()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error('Error al cambiar rol:', error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Cambiar estado de usuario
    var handleStatusChange = function (userId, isActive) { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, userPermissions_1.toggleUserStatus)(userId, isActive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadData()];
                case 2:
                    _a.sent(); // Recargar datos
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error al cambiar estado:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsx)(ProtectedRoute_1.ProtectedRoute, { requiredPermissions: [permissions_1.Permission.MANAGE_USERS], className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [stats && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Total Usuarios" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-4 w-4 text-muted-foreground" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: stats.total }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Activos" }), (0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "h-4 w-4 text-green-600" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: stats.active }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Inactivos" }), (0, jsx_runtime_1.jsx)(lucide_react_1.UserX, { className: "h-4 w-4 text-red-600" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-600", children: stats.inactive }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Nuevos (7 d\u00EDas)" }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4 text-blue-600" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: stats.recentSignups }) })] })] })), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5" }), "Gesti\u00F3n de Usuarios"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Administra roles y permisos de los usuarios del sistema" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "search", children: "Buscar usuario" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "search", placeholder: "Buscar por email o nombre...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "pl-10" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "role-filter", children: "Filtrar por rol" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: roleFilter, onValueChange: function (value) { return setRoleFilter(value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { id: "role-filter", className: "w-48", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todos los roles" }), Object.entries(ROLE_LABELS).map(function (_a) {
                                                                var role = _a[0], label = _a[1];
                                                                return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: role, children: label }, role));
                                                            })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "status-filter", children: "Filtrar por estado" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: statusFilter, onValueChange: function (value) { return setStatusFilter(value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { id: "status-filter", className: "w-32", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "active", children: "Activos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "inactive", children: "Inactivos" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: loadData, disabled: loading, variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-4 w-4 ".concat(loading ? 'animate-spin' : '') }) }) })] }) })] }), (0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-0", children: (0, jsx_runtime_1.jsxs)(table_1.Table, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { children: (0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Usuario" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Email" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Rol" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Estado" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Permisos" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Registro" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableBody, { children: loading ? ((0, jsx_runtime_1.jsx)(table_1.TableRow, { children: (0, jsx_runtime_1.jsx)(table_1.TableCell, { colSpan: 7, className: "text-center py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-4 w-4 animate-spin" }), "Cargando usuarios..."] }) }) })) : filteredUsers.length === 0 ? ((0, jsx_runtime_1.jsx)(table_1.TableRow, { children: (0, jsx_runtime_1.jsx)(table_1.TableCell, { colSpan: 7, className: "text-center py-8 text-muted-foreground", children: "No se encontraron usuarios" }) })) : (filteredUsers.map(function (user) { return ((0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("img", { src: user.photoURL || '/default-avatar.png', alt: user.displayName || user.email, className: "w-8 h-8 rounded-full" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: user.displayName || 'Sin nombre' })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "font-mono text-sm", children: user.email }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: ROLE_COLORS[user.role], children: ROLE_LABELS[user.role] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: user.isActive, onCheckedChange: function (checked) { return handleStatusChange(user.uid, checked); }, disabled: user.uid === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: user.isActive ? 'Activo' : 'Inactivo' })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: user.permissions.length }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "text-sm text-muted-foreground", children: user.createdAt.toLocaleDateString() }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)(select_1.Select, { value: user.role, onValueChange: function (newRole) { return handleRoleChange(user.uid, newRole); }, disabled: user.uid === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-32", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: Object.entries(ROLE_LABELS).map(function (_a) {
                                                                var role = _a[0], label = _a[1];
                                                                return ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: role, children: label }, role));
                                                            }) })] }) })] }, user.uid)); })) })] }) }) })] }) }));
};
exports.UserManagement = UserManagement;
