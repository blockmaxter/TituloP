"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SettingsDialog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var dialog_1 = require("@/components/ui/dialog");
var tabs_1 = require("@/components/ui/tabs");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var switch_1 = require("@/components/ui/switch");
var select_1 = require("@/components/ui/select");
var textarea_1 = require("@/components/ui/textarea");
var avatar_1 = require("@/components/ui/avatar");
var card_1 = require("@/components/ui/card");
var separator_1 = require("@/components/ui/separator");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var settings_1 = require("@/types/settings");
var lucide_react_1 = require("lucide-react");
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("@/lib/firebase");
var sonner_1 = require("sonner");
var SettingsDialog = function (_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var user = (0, PermissionsContext_1.usePermissions)().user;
    var _b = (0, react_1.useState)(settings_1.DEFAULT_USER_SETTINGS), settings = _b[0], setSettings = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(false), saving = _d[0], setSaving = _d[1];
    // Cargar configuraciones del usuario
    (0, react_1.useEffect)(function () {
        if (user && open) {
            loadUserSettings();
        }
    }, [user, open]);
    var loadUserSettings = function () { return __awaiter(void 0, void 0, void 0, function () {
        var settingsDoc, userData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user)
                        return [2 /*return*/];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'userSettings', user.uid))];
                case 2:
                    settingsDoc = _a.sent();
                    if (settingsDoc.exists()) {
                        userData = settingsDoc.data();
                        setSettings(__assign(__assign(__assign({}, settings_1.DEFAULT_USER_SETTINGS), userData), { profile: __assign(__assign(__assign({}, settings_1.DEFAULT_USER_SETTINGS.profile), { displayName: user.displayName || '', email: user.email }), userData.profile) }));
                    }
                    else {
                        // Si no existen configuraciones, usar los datos del usuario
                        setSettings(__assign(__assign({}, settings_1.DEFAULT_USER_SETTINGS), { profile: __assign(__assign({}, settings_1.DEFAULT_USER_SETTINGS.profile), { displayName: user.displayName || '', email: user.email }) }));
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error loading user settings:', error_1);
                    sonner_1.toast.error('Error al cargar configuraciones');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var saveSettings = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user)
                        return [2 /*return*/];
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, 'userSettings', user.uid), __assign(__assign({}, settings), { updatedAt: new Date() }), { merge: true })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Configuración guardada exitosamente');
                    onOpenChange(false);
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error saving settings:', error_2);
                    sonner_1.toast.error('Error al guardar configuración');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var updateSetting = function (path, value) {
        setSettings(function (prev) {
            var keys = path.split('.');
            var updated = __assign({}, prev);
            var current = updated;
            for (var i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = __assign({}, current[keys[i]]);
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };
    if (!user)
        return null;
    return ((0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.SettingsIcon, { className: "h-5 w-5" }), "Configuraci\u00F3n"] }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: "Gestiona tu perfil, notificaciones y preferencias del sistema" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "profile", className: "w-full", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-5", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "profile", className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.UserIcon, { className: "h-4 w-4" }), "Perfil"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "notifications", className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BellIcon, { className: "h-4 w-4" }), "Notificaciones"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "alerts", className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangleIcon, { className: "h-4 w-4" }), "Alertas"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "preferences", className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.PaletteIcon, { className: "h-4 w-4" }), "Preferencias"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "privacy", className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldIcon, { className: "h-4 w-4" }), "Privacidad"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 max-h-[60vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "profile", className: "space-y-6", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Informaci\u00F3n Personal" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Actualiza tu informaci\u00F3n de perfil que ser\u00E1 visible para otros usuarios" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)(avatar_1.Avatar, { className: "h-20 w-20", children: [(0, jsx_runtime_1.jsx)(avatar_1.AvatarImage, { src: settings.profile.avatar || user.photoURL || '' }), (0, jsx_runtime_1.jsx)(avatar_1.AvatarFallback, { className: "text-lg", children: settings.profile.displayName ?
                                                                            settings.profile.displayName.split(' ').map(function (n) { return n[0]; }).join('').toUpperCase() :
                                                                            user.email.charAt(0).toUpperCase() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CameraIcon, { className: "h-4 w-4 mr-2" }), "Cambiar foto"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "JPG, PNG m\u00E1ximo 2MB" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "displayName", children: "Nombre completo" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "displayName", value: settings.profile.displayName, onChange: function (e) { return updateSetting('profile.displayName', e.target.value); }, placeholder: "Tu nombre completo" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "email", children: "Email" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "email", value: settings.profile.email, disabled: true, className: "bg-muted" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "phoneNumber", children: "Tel\u00E9fono" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "phoneNumber", value: settings.profile.phoneNumber || '', onChange: function (e) { return updateSetting('profile.phoneNumber', e.target.value); }, placeholder: "+56 9 1234 5678" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "department", children: "Departamento" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "department", value: settings.profile.department || '', onChange: function (e) { return updateSetting('profile.department', e.target.value); }, placeholder: "Escuela de Inform\u00E1tica" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "position", children: "Cargo/Posici\u00F3n" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "position", value: settings.profile.position || '', onChange: function (e) { return updateSetting('profile.position', e.target.value); }, placeholder: "Estudiante, Profesor, Coordinador..." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "bio", children: "Biograf\u00EDa" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "bio", value: settings.profile.bio || '', onChange: function (e) { return updateSetting('profile.bio', e.target.value); }, placeholder: "Cu\u00E9ntanos un poco sobre ti...", rows: 3 })] })] })] }) }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "notifications", className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Notificaciones por Email" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Configura qu\u00E9 notificaciones quieres recibir por correo electr\u00F3nico" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Actualizaciones de pr\u00E1cticas" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Cambios de estado y nuevas asignaciones" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.notifications.email.practiceUpdates, onCheckedChange: function (checked) { return updateSetting('notifications.email.practiceUpdates', checked); } })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Recordatorios de evaluaciones" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Fechas l\u00EDmite y evaluaciones pendientes" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.notifications.email.evaluationReminders, onCheckedChange: function (checked) { return updateSetting('notifications.email.evaluationReminders', checked); } })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Anuncios del sistema" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Actualizaciones importantes y mantenimiento" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.notifications.email.systemAnnouncements, onCheckedChange: function (checked) { return updateSetting('notifications.email.systemAnnouncements', checked); } })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Reportes semanales" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Resumen semanal de actividades" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.notifications.email.weeklyReports, onCheckedChange: function (checked) { return updateSetting('notifications.email.weeklyReports', checked); } })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Notificaciones Push" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Notificaciones instant\u00E1neas en el navegador" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Fechas l\u00EDmite de pr\u00E1cticas" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Alertas de fechas importantes" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.notifications.push.practiceDeadlines, onCheckedChange: function (checked) { return updateSetting('notifications.push.practiceDeadlines', checked); } })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Nuevas evaluaciones" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Cuando se asignen nuevas evaluaciones" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.notifications.push.newEvaluations, onCheckedChange: function (checked) { return updateSetting('notifications.push.newEvaluations', checked); } })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Alertas del sistema" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Notificaciones cr\u00EDticas del sistema" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.notifications.push.systemAlerts, onCheckedChange: function (checked) { return updateSetting('notifications.push.systemAlerts', checked); } })] })] })] })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "alerts", className: "space-y-6", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Configuraci\u00F3n de Alertas" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Personaliza cu\u00E1ndo y c\u00F3mo recibir alertas importantes" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Alertas de fechas l\u00EDmite de pr\u00E1cticas" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.alerts.practiceDeadlines.enabled, onCheckedChange: function (checked) { return updateSetting('alerts.practiceDeadlines.enabled', checked); } })] }), settings.alerts.practiceDeadlines.enabled && ((0, jsx_runtime_1.jsxs)("div", { className: "ml-4 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "practiceDeadlineDays", children: "D\u00EDas antes de la fecha l\u00EDmite" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: settings.alerts.practiceDeadlines.daysBeforeDeadline.toString(), onValueChange: function (value) { return updateSetting('alerts.practiceDeadlines.daysBeforeDeadline', parseInt(value)); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-48", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "1", children: "1 d\u00EDa" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "3", children: "3 d\u00EDas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "7", children: "7 d\u00EDas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "14", children: "14 d\u00EDas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "30", children: "30 d\u00EDas" })] })] })] }))] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Recordatorios de evaluaciones" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.alerts.evaluationReminders.enabled, onCheckedChange: function (checked) { return updateSetting('alerts.evaluationReminders.enabled', checked); } })] }), settings.alerts.evaluationReminders.enabled && ((0, jsx_runtime_1.jsxs)("div", { className: "ml-4 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "evaluationReminderHours", children: "Horas antes de la fecha l\u00EDmite" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: settings.alerts.evaluationReminders.hoursBeforeDeadline.toString(), onValueChange: function (value) { return updateSetting('alerts.evaluationReminders.hoursBeforeDeadline', parseInt(value)); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-48", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "1", children: "1 hora" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "4", children: "4 horas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "12", children: "12 horas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "24", children: "24 horas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "48", children: "48 horas" })] })] })] }))] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Mantenimiento del sistema" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Notificaciones sobre mantenimiento programado" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.alerts.systemMaintenance.enabled, onCheckedChange: function (checked) { return updateSetting('alerts.systemMaintenance.enabled', checked); } })] })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "preferences", className: "space-y-6", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Apariencia y Comportamiento" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Personaliza la interfaz y comportamiento de la aplicaci\u00F3n" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Tema" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: settings.preferences.theme, onValueChange: function (value) { return updateSetting('preferences.theme', value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "light", children: "Claro" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "dark", children: "Oscuro" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "system", children: "Autom\u00E1tico" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Idioma" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: settings.preferences.language, onValueChange: function (value) { return updateSetting('preferences.language', value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "es", children: "Espa\u00F1ol" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "en", children: "English" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Formato de fecha" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: settings.preferences.dateFormat, onValueChange: function (value) { return updateSetting('preferences.dateFormat', value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "DD/MM/YYYY", children: "DD/MM/YYYY" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "MM/DD/YYYY", children: "MM/DD/YYYY" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "YYYY-MM-DD", children: "YYYY-MM-DD" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Vista predeterminada del dashboard" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: settings.preferences.defaultDashboardView, onValueChange: function (value) { return updateSetting('preferences.defaultDashboardView', value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "analytics", children: "Anal\u00EDtica" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "practices", children: "Pr\u00E1cticas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "lifecycle", children: "Ciclo de vida" })] })] })] })] }) })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "privacy", className: "space-y-6", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Configuraci\u00F3n de Privacidad" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Controla qu\u00E9 informaci\u00F3n es visible para otros usuarios" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Visibilidad del perfil" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: settings.privacy.profileVisibility, onValueChange: function (value) { return updateSetting('privacy.profileVisibility', value); }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "public", children: "P\u00FAblico - Visible para todos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "internal", children: "Interno - Solo miembros de UTEM" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "private", children: "Privado - Solo para m\u00ED" })] })] })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Mostrar email en el perfil" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Otros usuarios podr\u00E1n ver tu direcci\u00F3n de correo" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.privacy.showEmail, onCheckedChange: function (checked) { return updateSetting('privacy.showEmail', checked); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Mostrar tel\u00E9fono en el perfil" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Otros usuarios podr\u00E1n ver tu n\u00FAmero de tel\u00E9fono" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.privacy.showPhoneNumber, onCheckedChange: function (checked) { return updateSetting('privacy.showPhoneNumber', checked); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Estado de actividad" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Mostrar cuando est\u00E1s en l\u00EDnea o activo" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settings.privacy.activityStatus, onCheckedChange: function (checked) { return updateSetting('privacy.activityStatus', checked); } })] })] })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: function () { return onOpenChange(false); }, children: "Cancelar" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: saveSettings, disabled: saving, children: saving ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" }), "Guardando..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.SaveIcon, { className: "h-4 w-4 mr-2" }), "Guardar cambios"] })) })] })] })] }) }));
};
exports.SettingsDialog = SettingsDialog;
