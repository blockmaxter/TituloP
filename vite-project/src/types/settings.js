"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_USER_SETTINGS = void 0;
// Configuraciones por defecto
exports.DEFAULT_USER_SETTINGS = {
    profile: {
        displayName: '',
        email: '',
    },
    notifications: {
        email: {
            practiceUpdates: true,
            evaluationReminders: true,
            systemAnnouncements: true,
            weeklyReports: false,
        },
        push: {
            practiceDeadlines: true,
            newEvaluations: true,
            systemAlerts: true,
            mentions: true,
        },
        inApp: {
            allNotifications: true,
            sound: true,
            desktop: true,
        },
    },
    alerts: {
        practiceDeadlines: {
            enabled: true,
            daysBeforeDeadline: 7,
        },
        evaluationReminders: {
            enabled: true,
            hoursBeforeDeadline: 24,
        },
        systemMaintenance: {
            enabled: true,
        },
    },
    preferences: {
        theme: 'system',
        language: 'es',
        timezone: 'America/Santiago',
        dateFormat: 'DD/MM/YYYY',
        defaultDashboardView: 'analytics',
    },
    privacy: {
        profileVisibility: 'internal',
        showEmail: true,
        showPhoneNumber: false,
        activityStatus: true,
    },
};
