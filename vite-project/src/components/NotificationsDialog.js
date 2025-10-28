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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsDialog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var card_1 = require("@/components/ui/card");
var scroll_area_1 = require("@/components/ui/scroll-area");
var lucide_react_1 = require("lucide-react");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
var NotificationsDialog = function (_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange;
    var user = (0, PermissionsContext_1.usePermissions)().user;
    var _b = (0, react_1.useState)([]), notifications = _b[0], setNotifications = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    // Datos de ejemplo para demostración
    (0, react_1.useEffect)(function () {
        if (open && user) {
            setLoading(true);
            // Simular carga de notificaciones
            setTimeout(function () {
                var sampleNotifications = [
                    {
                        id: '1',
                        title: 'Nueva evaluación asignada',
                        message: 'Se te ha asignado una nueva evaluación para la práctica profesional en empresa XYZ.',
                        type: 'info',
                        read: false,
                        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
                        actionUrl: '/evaluations/123'
                    },
                    {
                        id: '2',
                        title: 'Fecha límite próxima',
                        message: 'La entrega del informe de práctica vence en 3 días.',
                        type: 'warning',
                        read: false,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
                    },
                    {
                        id: '3',
                        title: 'Práctica aprobada',
                        message: '¡Felicitaciones! Tu práctica profesional ha sido aprobada exitosamente.',
                        type: 'success',
                        read: true,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
                    },
                    {
                        id: '4',
                        title: 'Actualización del sistema',
                        message: 'El sistema estará en mantenimiento el domingo de 2:00 AM a 4:00 AM.',
                        type: 'info',
                        read: true,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 días atrás
                    },
                    {
                        id: '5',
                        title: 'Documento pendiente',
                        message: 'Aún no has subido el certificado de finalización de práctica.',
                        type: 'error',
                        read: false,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 días atrás
                    }
                ];
                setNotifications(sampleNotifications);
                setLoading(false);
            }, 1000);
        }
    }, [open, user]);
    var markAsRead = function (notificationId) {
        setNotifications(function (prev) {
            return prev.map(function (notif) {
                return notif.id === notificationId
                    ? __assign(__assign({}, notif), { read: true }) : notif;
            });
        });
    };
    var markAllAsRead = function () {
        setNotifications(function (prev) {
            return prev.map(function (notif) { return (__assign(__assign({}, notif), { read: true })); });
        });
    };
    var deleteNotification = function (notificationId) {
        setNotifications(function (prev) {
            return prev.filter(function (notif) { return notif.id !== notificationId; });
        });
    };
    var getNotificationIcon = function (type) {
        switch (type) {
            case 'success':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircleIcon, { className: "h-5 w-5 text-green-500" });
            case 'warning':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangleIcon, { className: "h-5 w-5 text-yellow-500" });
            case 'error':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XIcon, { className: "h-5 w-5 text-red-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.InfoIcon, { className: "h-5 w-5 text-blue-500" });
        }
    };
    var getNotificationBadgeColor = function (type) {
        switch (type) {
            case 'success':
                return 'default';
            case 'warning':
                return 'secondary';
            case 'error':
                return 'destructive';
            default:
                return 'outline';
        }
    };
    var formatTimeAgo = function (date) {
        var now = new Date();
        var diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        if (diffInMinutes < 1)
            return 'Ahora mismo';
        if (diffInMinutes < 60)
            return "".concat(diffInMinutes, " minutos");
        if (diffInMinutes < 1440)
            return "".concat(Math.floor(diffInMinutes / 60), " horas");
        return "".concat(Math.floor(diffInMinutes / 1440), " d\u00EDas");
    };
    var unreadCount = notifications.filter(function (n) { return !n.read; }).length;
    if (!user)
        return null;
    return ((0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-2xl max-h-[80vh]", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BellIcon, { className: "h-5 w-5" }), "Notificaciones", unreadCount > 0 && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "destructive", className: "ml-2", children: unreadCount }))] }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: "Mantente al d\u00EDa con las \u00FAltimas actualizaciones y alertas" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: notifications.length === 0 ? 'No hay notificaciones' :
                                        "".concat(notifications.length, " notificaci\u00F3n").concat(notifications.length !== 1 ? 'es' : '') }), unreadCount > 0 && ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: markAllAsRead, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckIcon, { className: "h-4 w-4 mr-2" }), "Marcar todas como le\u00EDdas"] }))] }), (0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "h-96", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) })) : notifications.length === 0 ? ((0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "flex flex-col items-center justify-center py-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BellIcon, { className: "h-12 w-12 text-muted-foreground mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium", children: "No tienes notificaciones" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground", children: "Cuando tengas nuevas actualizaciones aparecer\u00E1n aqu\u00ED" })] }) })) : (notifications.map(function (notification) { return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: "transition-all hover:shadow-md ".concat(!notification.read ? 'border-l-4 border-l-primary bg-muted/30' : ''), children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [getNotificationIcon(notification.type), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-medium leading-5", children: [notification.title, !notification.read && ((0, jsx_runtime_1.jsx)("span", { className: "ml-2 inline-block w-2 h-2 bg-primary rounded-full" }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground mt-1", children: notification.message })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 ml-4", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getNotificationBadgeColor(notification.type), className: "text-xs", children: notification.type }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: function () { return deleteNotification(notification.id); }, className: "h-6 w-6 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.XIcon, { className: "h-3 w-3" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ClockIcon, { className: "h-3 w-3" }), formatTimeAgo(notification.createdAt)] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [notification.actionUrl && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", children: "Ver detalles" })), !notification.read && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: function () { return markAsRead(notification.id); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckIcon, { className: "h-4 w-4" }) }))] })] })] })] }) }) }, notification.id)); })) }) })] })] }) }));
};
exports.NotificationsDialog = NotificationsDialog;
