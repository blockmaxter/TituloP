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
exports.getUserStats = exports.emailExists = exports.deleteUser = exports.deactivateUser = exports.createUser = exports.getUsersByRole = exports.getAllUsers = exports.toggleUserStatus = exports.updateUserRole = void 0;
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("@/lib/firebase");
var permissions_1 = require("@/types/permissions");
/**
 * Actualizar el rol de un usuario
 */
var updateUserRole = function (userId, newRole) { return __awaiter(void 0, void 0, void 0, function () {
    var userRef, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userRef = (0, firestore_1.doc)(firebase_1.db, 'users', userId);
                return [4 /*yield*/, (0, firestore_1.updateDoc)(userRef, {
                        role: newRole,
                        updatedAt: new Date()
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error al actualizar rol de usuario:', error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUserRole = updateUserRole;
/**
 * Activar o desactivar un usuario
 */
var toggleUserStatus = function (userId, isActive) { return __awaiter(void 0, void 0, void 0, function () {
    var userRef, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userRef = (0, firestore_1.doc)(firebase_1.db, 'users', userId);
                return [4 /*yield*/, (0, firestore_1.updateDoc)(userRef, {
                        isActive: isActive,
                        updatedAt: new Date()
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error al cambiar estado de usuario:', error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.toggleUserStatus = toggleUserStatus;
/**
 * Obtener todos los usuarios
 */
var getAllUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var usersCollection, snapshot, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                usersCollection = (0, firestore_1.collection)(firebase_1.db, 'users');
                return [4 /*yield*/, (0, firestore_1.getDocs)(usersCollection)];
            case 1:
                snapshot = _a.sent();
                return [2 /*return*/, snapshot.docs.map(function (doc) {
                        var _a, _b;
                        var data = doc.data();
                        var role = data.role || permissions_1.UserRole.VIEWER;
                        return {
                            uid: doc.id,
                            email: data.email || '',
                            displayName: data.displayName || '',
                            photoURL: data.photoURL || '',
                            role: role,
                            permissions: permissions_1.ROLE_PERMISSIONS[role] || [],
                            isActive: data.isActive !== false,
                            createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(),
                            updatedAt: ((_b = data.updatedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || new Date()
                        };
                    })];
            case 2:
                error_3 = _a.sent();
                console.error('Error al obtener usuarios:', error_3);
                throw error_3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
/**
 * Obtener usuarios por rol
 */
var getUsersByRole = function (role) { return __awaiter(void 0, void 0, void 0, function () {
    var usersCollection, q, snapshot, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                usersCollection = (0, firestore_1.collection)(firebase_1.db, 'users');
                q = (0, firestore_1.query)(usersCollection, (0, firestore_1.where)('role', '==', role));
                return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
            case 1:
                snapshot = _a.sent();
                return [2 /*return*/, snapshot.docs.map(function (doc) {
                        var _a, _b;
                        var data = doc.data();
                        return {
                            uid: doc.id,
                            email: data.email || '',
                            displayName: data.displayName || '',
                            photoURL: data.photoURL || '',
                            role: data.role,
                            permissions: permissions_1.ROLE_PERMISSIONS[role],
                            isActive: data.isActive !== false,
                            createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(),
                            updatedAt: ((_b = data.updatedAt) === null || _b === void 0 ? void 0 : _b.toDate()) || new Date()
                        };
                    })];
            case 2:
                error_4 = _a.sent();
                console.error('Error al obtener usuarios por rol:', error_4);
                throw error_4;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUsersByRole = getUsersByRole;
/**
 * Crear un nuevo usuario manualmente (por admin)
 */
var createUser = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var userRef, now, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userRef = (0, firestore_1.doc)(firebase_1.db, 'users', userData.uid);
                now = new Date();
                return [4 /*yield*/, (0, firestore_1.setDoc)(userRef, {
                        email: userData.email,
                        displayName: userData.displayName || '',
                        photoURL: userData.photoURL || '',
                        role: userData.role,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error al crear usuario:', error_5);
                throw error_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
/**
 * Eliminar un usuario (solo marcar como inactivo)
 */
var deactivateUser = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, exports.toggleUserStatus)(userId, false)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error al desactivar usuario:', error_6);
                throw error_6;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deactivateUser = deactivateUser;
/**
 * Eliminar usuario permanentemente (solo para super admin)
 */
var deleteUser = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var userRef, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userRef = (0, firestore_1.doc)(firebase_1.db, 'users', userId);
                return [4 /*yield*/, (0, firestore_1.deleteDoc)(userRef)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error al eliminar usuario:', error_7);
                throw error_7;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
/**
 * Verificar si un email ya existe en la base de datos
 */
var emailExists = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var usersCollection, q, snapshot, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                usersCollection = (0, firestore_1.collection)(firebase_1.db, 'users');
                q = (0, firestore_1.query)(usersCollection, (0, firestore_1.where)('email', '==', email));
                return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
            case 1:
                snapshot = _a.sent();
                return [2 /*return*/, !snapshot.empty];
            case 2:
                error_8 = _a.sent();
                console.error('Error al verificar email:', error_8);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.emailExists = emailExists;
/**
 * Obtener estadísticas de usuarios
 */
var getUserStats = function () { return __awaiter(void 0, void 0, void 0, function () {
    var users_1, stats_1, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, exports.getAllUsers)()];
            case 1:
                users_1 = _a.sent();
                stats_1 = {
                    total: users_1.length,
                    active: users_1.filter(function (u) { return u.isActive; }).length,
                    inactive: users_1.filter(function (u) { return !u.isActive; }).length,
                    byRole: {},
                    recentSignups: users_1.filter(function (u) {
                        var weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return u.createdAt > weekAgo;
                    }).length
                };
                // Contar por roles
                Object.values(permissions_1.UserRole).forEach(function (role) {
                    stats_1.byRole[role] = users_1.filter(function (u) { return u.role === role; }).length;
                });
                return [2 /*return*/, stats_1];
            case 2:
                error_9 = _a.sent();
                console.error('Error al obtener estadísticas:', error_9);
                throw error_9;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserStats = getUserStats;
