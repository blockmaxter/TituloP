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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsProvider = exports.usePermissions = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("@/lib/firebase");
var permissions_1 = require("@/types/permissions");
var PermissionsContext = (0, react_1.createContext)(null);
var usePermissions = function () {
    var context = (0, react_1.useContext)(PermissionsContext);
    if (!context) {
        throw new Error('usePermissions debe ser usado dentro de PermissionsProvider');
    }
    return context;
};
exports.usePermissions = usePermissions;
var PermissionsProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    // Función para obtener o crear un usuario en Firestore
    var getUserFromFirestore = function (firebaseUser) { return __awaiter(void 0, void 0, void 0, function () {
        var userDocRef, userDoc, userData, userRole, defaultRole, now, newUser;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userDocRef = (0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid);
                    return [4 /*yield*/, (0, firestore_1.getDoc)(userDocRef)];
                case 1:
                    userDoc = _c.sent();
                    if (!userDoc.exists()) return [3 /*break*/, 2];
                    userData = userDoc.data();
                    userRole = userData.role || permissions_1.UserRole.VIEWER;
                    return [2 /*return*/, {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName || '',
                            photoURL: firebaseUser.photoURL || '',
                            role: userRole,
                            permissions: permissions_1.ROLE_PERMISSIONS[userRole] || [],
                            isActive: userData.isActive !== false, // Por defecto true
                            createdAt: ((_a = userData.createdAt) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(),
                            updatedAt: ((_b = userData.updatedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || new Date()
                        }];
                case 2:
                    defaultRole = determineDefaultRole(firebaseUser.email || '');
                    now = new Date();
                    newUser = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        displayName: firebaseUser.displayName || '',
                        photoURL: firebaseUser.photoURL || '',
                        role: defaultRole,
                        permissions: permissions_1.ROLE_PERMISSIONS[defaultRole],
                        isActive: true,
                        createdAt: now,
                        updatedAt: now
                    };
                    // Guardar en Firestore
                    return [4 /*yield*/, (0, firestore_1.setDoc)(userDocRef, {
                            email: newUser.email,
                            displayName: newUser.displayName,
                            photoURL: newUser.photoURL,
                            role: newUser.role,
                            isActive: newUser.isActive,
                            createdAt: now,
                            updatedAt: now
                        })];
                case 3:
                    // Guardar en Firestore
                    _c.sent();
                    return [2 /*return*/, newUser];
            }
        });
    }); };
    // Determinar rol por defecto basado en el email
    var determineDefaultRole = function (email) {
        // Administradores específicos
        var adminEmails = [
            'admin@utem.cl',
            'coordinador@utem.cl'
        ];
        // Profesores (emails con profesor o docente)
        var professorKeywords = ['profesor', 'docente', 'teacher'];
        if (adminEmails.includes(email.toLowerCase())) {
            return permissions_1.UserRole.ADMIN;
        }
        if (email.endsWith('@utem.cl')) {
            var localPart_1 = email.split('@')[0].toLowerCase();
            if (professorKeywords.some(function (keyword) { return localPart_1.includes(keyword); })) {
                return permissions_1.UserRole.PROFESSOR;
            }
            // Por defecto, usuarios de UTEM son estudiantes
            return permissions_1.UserRole.STUDENT;
        }
        // Usuarios externos son viewers por defecto
        return permissions_1.UserRole.VIEWER;
    };
    // Verificar si el usuario tiene un permiso específico
    var hasPermission = function (permission) {
        if (!user)
            return false;
        return user.permissions.includes(permission);
    };
    // Verificar si el usuario tiene al menos uno de los permisos
    var hasAnyPermission = function (permissions) {
        if (!user)
            return false;
        return permissions.some(function (permission) { return user.permissions.includes(permission); });
    };
    // Verificar si el usuario tiene un rol específico
    var hasRole = function (role) {
        if (!user)
            return false;
        return user.role === role;
    };
    // Refrescar los permisos del usuario
    var refreshUserPermissions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth, currentUser, updatedUser, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    auth = (0, auth_1.getAuth)();
                    currentUser = auth.currentUser;
                    if (!currentUser) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getUserFromFirestore(currentUser)];
                case 2:
                    updatedUser = _a.sent();
                    setUser(updatedUser);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error al refrescar permisos:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        var auth = (0, auth_1.getAuth)();
        var unsubscribe = (0, auth_1.onAuthStateChanged)(auth, function (firebaseUser) { return __awaiter(void 0, void 0, void 0, function () {
            var userDocRef, userDoc, userWithPermissions, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        if (!firebaseUser) return [3 /*break*/, 10];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        if (!(firebaseUser.email && !firebaseUser.email.endsWith('@utem.cl'))) return [3 /*break*/, 4];
                        userDocRef = (0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid);
                        return [4 /*yield*/, (0, firestore_1.getDoc)(userDocRef)];
                    case 2:
                        userDoc = _a.sent();
                        if (!!userDoc.exists()) return [3 /*break*/, 4];
                        // Usuario externo sin rol asignado - cerrar sesión
                        return [4 /*yield*/, auth.signOut()];
                    case 3:
                        // Usuario externo sin rol asignado - cerrar sesión
                        _a.sent();
                        setUser(null);
                        setLoading(false);
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, getUserFromFirestore(firebaseUser)];
                    case 5:
                        userWithPermissions = _a.sent();
                        if (!!userWithPermissions.isActive) return [3 /*break*/, 7];
                        return [4 /*yield*/, auth.signOut()];
                    case 6:
                        _a.sent();
                        setUser(null);
                        setLoading(false);
                        return [2 /*return*/];
                    case 7:
                        setUser(userWithPermissions);
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        console.error('Error al obtener datos del usuario:', error_2);
                        setUser(null);
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        setUser(null);
                        _a.label = 11;
                    case 11:
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); });
        return function () { return unsubscribe(); };
    }, []);
    var contextValue = {
        user: user,
        loading: loading,
        hasPermission: hasPermission,
        hasAnyPermission: hasAnyPermission,
        hasRole: hasRole,
        refreshUserPermissions: refreshUserPermissions
    };
    return ((0, jsx_runtime_1.jsx)(PermissionsContext.Provider, { value: contextValue, children: children }));
};
exports.PermissionsProvider = PermissionsProvider;
