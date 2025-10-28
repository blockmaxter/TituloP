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
exports.default = LoginPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var auth_1 = require("firebase/auth");
var firebase_1 = require("../lib/firebase");
var react_1 = require("react");
var provider = new auth_1.GoogleAuthProvider();
var auth = (0, auth_1.getAuth)(firebase_1.default);
function LoginPage() {
    var _this = this;
    var _a = (0, react_1.useState)(""), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(""), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(""), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(""), resetMsg = _d[0], setResetMsg = _d[1];
    var _e = (0, react_1.useState)(false), showReset = _e[0], setShowReset = _e[1];
    (0, react_1.useEffect)(function () {
        (0, auth_1.onAuthStateChanged)(auth, function (user) {
            if (user) {
                if (user.email && user.email.endsWith("@utem.cl")) {
                    localStorage.setItem("firebaseUser", JSON.stringify(user));
                    // Redirigir al dashboard después de login exitoso
                    window.location.href = "/";
                }
                else {
                    (0, auth_1.signOut)(auth);
                    localStorage.removeItem("firebaseUser");
                    setError("Acceso denegado: solo usuarios con correo institucional @utem.cl pueden ingresar. Si tienes dudas, contacta a soporte.");
                }
            }
        });
    }, []);
    var handleGoogleLogin = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, auth_1.signInWithPopup)(auth, provider)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    setError('Error al iniciar sesión con Google');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleEmailLogin = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var userCredential, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError("");
                    // Validar formato de email
                    if (!email.includes("@")) {
                        setError("Formato de correo electrónico inválido");
                        return [2 /*return*/];
                    }
                    // Validar dominio institucional antes del login
                    if (!email.endsWith("@utem.cl")) {
                        setError("Solo se permiten correos institucionales @utem.cl");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log("Intentando login con:", email); // Debug log
                    return [4 /*yield*/, (0, auth_1.signInWithEmailAndPassword)(auth, email, password)];
                case 2:
                    userCredential = _a.sent();
                    console.log("Login exitoso:", userCredential.user.email); // Debug log
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error("Error de login:", err_1); // Debug log
                    // Manejo específico de errores
                    switch (err_1.code) {
                        case 'auth/user-not-found':
                            setError("No existe una cuenta con este correo electrónico. Contacta al administrador para crear tu cuenta.");
                            break;
                        case 'auth/wrong-password':
                            setError("Contraseña incorrecta. Verifica tu contraseña o usa 'Olvidaste tu contraseña'.");
                            break;
                        case 'auth/invalid-email':
                            setError("Formato de correo electrónico inválido");
                            break;
                        case 'auth/user-disabled':
                            setError("Esta cuenta ha sido deshabilitada. Contacta al administrador.");
                            break;
                        case 'auth/too-many-requests':
                            setError("Demasiados intentos fallidos. Intenta nuevamente en unos minutos.");
                            break;
                        case 'auth/network-request-failed':
                            setError("Error de conexión. Verifica tu conexión a internet.");
                            break;
                        case 'auth/invalid-credential':
                            setError("Credenciales inválidas. Verifica tu correo y contraseña.");
                            break;
                        default:
                            setError("Error al iniciar sesi\u00F3n: ".concat(err_1.message));
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handlePasswordReset = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setResetMsg("");
                    setError("");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, auth_1.sendPasswordResetEmail)(auth, email)];
                case 2:
                    _a.sent();
                    setResetMsg("Se ha enviado un correo para restablecer la contraseña.");
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setError("No se pudo enviar el correo. Verifica el email.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col items-center justify-center min-h-screen bg-[url('/public/vite.svg')] bg-cover bg-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white bg-opacity-90 p-8 rounded shadow-md w-full max-w-sm", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold mb-6 text-center", children: "Iniciar sesi\u00F3n" }), !showReset ? ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleEmailLogin, className: "flex flex-col gap-4 mb-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Correo electr\u00F3nico", value: email, onChange: function (e) { return setEmail(e.target.value); }, className: "border rounded px-3 py-2 w-full", required: true }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Contrase\u00F1a", value: password, onChange: function (e) { return setPassword(e.target.value); }, className: "border rounded px-3 py-2 w-full", required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition", children: "Iniciar sesi\u00F3n con correo" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "w-full text-blue-600 underline text-sm mt-2", onClick: function () { return setShowReset(true); }, children: "\u00BFOlvidaste tu contrase\u00F1a?" })] })) : ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handlePasswordReset, className: "flex flex-col gap-4 mb-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Correo electr\u00F3nico", value: email, onChange: function (e) { return setEmail(e.target.value); }, className: "border rounded px-3 py-2 w-full", required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition", children: "Enviar correo de recuperaci\u00F3n" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "w-full text-gray-600 underline text-sm mt-2", onClick: function () { return setShowReset(false); }, children: "Volver al login" }), resetMsg && (0, jsx_runtime_1.jsx)("div", { className: "text-green-600 text-sm mt-2 text-center", children: resetMsg })] })), (0, jsx_runtime_1.jsxs)("button", { onClick: handleGoogleLogin, className: "w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mb-2", children: [(0, jsx_runtime_1.jsx)("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: (0, jsx_runtime_1.jsx)("path", { d: "M21.35 11.1H12V13.9H17.85C17.45 15.3 16.3 16.4 14.7 16.4C12.7 16.4 11.1 14.8 11.1 12.8C11.1 10.8 12.7 9.2 14.7 9.2C15.6 9.2 16.4 9.5 17.05 10.05L19.05 8.05C17.85 7.05 16.35 6.4 14.7 6.4C11.4 6.4 8.7 9.1 8.7 12.4C8.7 15.7 11.4 18.4 14.7 18.4C17.6 18.4 20.1 16.1 20.1 13.2C20.1 12.7 20.05 12.2 19.95 11.7L21.35 11.1Z", fill: "#4285F4" }) }), "Iniciar sesi\u00F3n con Google"] }), error && (0, jsx_runtime_1.jsx)("div", { className: "text-red-600 text-sm mt-2 text-center", children: error })] }) }));
}
