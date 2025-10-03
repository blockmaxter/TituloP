// Tipos para configuraciones de usuario
export interface UserSettings {
  // Perfil
  profile: {
    displayName: string;
    email: string;
    phoneNumber?: string;
    department?: string;
    position?: string;
    bio?: string;
    avatar?: string;
  };
  
  // Notificaciones
  notifications: {
    email: {
      practiceUpdates: boolean;
      evaluationReminders: boolean;
      systemAnnouncements: boolean;
      weeklyReports: boolean;
    };
    push: {
      practiceDeadlines: boolean;
      newEvaluations: boolean;
      systemAlerts: boolean;
      mentions: boolean;
    };
    inApp: {
      allNotifications: boolean;
      sound: boolean;
      desktop: boolean;
    };
  };
  
  // Alertas y preferencias
  alerts: {
    practiceDeadlines: {
      enabled: boolean;
      daysBeforeDeadline: number;
    };
    evaluationReminders: {
      enabled: boolean;
      hoursBeforeDeadline: number;
    };
    systemMaintenance: {
      enabled: boolean;
    };
  };
  
  // Preferencias de la aplicación
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'es' | 'en';
    timezone: string;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    defaultDashboardView: 'analytics' | 'practices' | 'lifecycle';
  };
  
  // Privacidad
  privacy: {
    profileVisibility: 'public' | 'internal' | 'private';
    showEmail: boolean;
    showPhoneNumber: boolean;
    activityStatus: boolean;
  };
}

// Configuraciones por defecto
export const DEFAULT_USER_SETTINGS: UserSettings = {
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