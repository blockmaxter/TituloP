import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { UserSettings, DEFAULT_USER_SETTINGS } from "@/types/settings";
import { 
  SettingsIcon,
  UserIcon, 
  BellIcon, 
  ShieldIcon,
  PaletteIcon,
  SaveIcon,
  CameraIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  AlertTriangleIcon,
  EyeIcon,
  EyeOffIcon,
  ClockIcon,
  GlobeIcon
} from "lucide-react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = usePermissions();
  
  // Siempre llamar el hook para cumplir con las reglas de hooks
  const themeContext = useTheme();
  const { theme, setTheme } = themeContext;
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const canSave = !saving && !loading && !!user;

  const loadUserSettings = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    console.log('Cargando configuraciones del usuario:', user.uid);
    
    try {
      const settingsDoc = await getDoc(doc(db, 'userSettings', user.uid));
      if (settingsDoc.exists()) {
        const userData = settingsDoc.data() as UserSettings;
        const mergedSettings = {
          ...DEFAULT_USER_SETTINGS,
          ...userData,
          profile: {
            ...DEFAULT_USER_SETTINGS.profile,
            displayName: user.displayName || '',
            email: user.email,
            ...userData.profile,
          }
        };
        
        setSettings(mergedSettings);
        
        // Sincronizar el tema si es diferente del actual
        if (userData.preferences?.theme && userData.preferences.theme !== theme) {
          setTheme(userData.preferences.theme);
        }
      } else {
        // Si no existen configuraciones, usar los datos del usuario
        setSettings({
          ...DEFAULT_USER_SETTINGS,
          profile: {
            ...DEFAULT_USER_SETTINGS.profile,
            displayName: user.displayName || '',
            email: user.email,
          }
        });
      }
    } catch (error: any) {
      console.warn('No se pudieron cargar las configuraciones del usuario:', error);
      
      // Intentar cargar configuraciones locales como fallback
      let finalSettings = {
        ...DEFAULT_USER_SETTINGS,
        profile: {
          ...DEFAULT_USER_SETTINGS.profile,
          displayName: user.displayName || '',
          email: user.email,
        }
      };

      try {
        const localSettings = localStorage.getItem(`userSettings_${user.uid}`);
        if (localSettings) {
          const parsedLocal = JSON.parse(localSettings);
          finalSettings = {
            ...finalSettings,
            ...parsedLocal,
            profile: {
              ...finalSettings.profile,
              ...parsedLocal.profile,
            }
          };
          console.log('Configuraciones cargadas desde localStorage');
        }
      } catch (localError) {
        console.warn('No se pudieron cargar configuraciones locales:', localError);
      }

      setSettings(finalSettings);

      // Solo mostrar notificaciones para errores críticos inesperados
      if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
        console.log('Permisos insuficientes para Firestore. Usando configuraciones locales/por defecto.');
      } else if (error?.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
        console.log('Firestore bloqueado por el navegador. Usando configuraciones locales/por defecto.');
      } else {
        // Solo mostrar error para otros tipos de errores críticos
        console.error('Error inesperado al cargar configuraciones:', error);
        toast.warning('Usando configuraciones guardadas localmente.');
      }
    } finally {
      setLoading(false);
    }
  }, [user, theme, setTheme]);

  // Cargar configuraciones del usuario
  useEffect(() => {
    if (user && open) {
      loadUserSettings();
    }
  }, [user, open, loadUserSettings]);

  // Resetear estados cuando se abre/cierra el diálogo
  useEffect(() => {
    if (open) {
      setSaving(false);
      setLoading(false);
    }
  }, [open]);

  const saveSettings = async () => {
    if (!user) {
      toast.error('No hay usuario autenticado');
      return;
    }
    
    setSaving(true);
    console.log('Iniciando guardado de configuraciones...', { userId: user.uid, settings });
    
    try {
      const settingsToSave = {
        ...settings,
        updatedAt: new Date(),
      };
      
      console.log('Datos a guardar:', settingsToSave);
      
      await setDoc(doc(db, 'userSettings', user.uid), settingsToSave, { merge: true });
      
      console.log('Configuraciones guardadas exitosamente');
      toast.success('Configuración guardada exitosamente');
      onOpenChange(false);
    } catch (error) {
      console.error('Error detallado al guardar configuración:', {
        error,
        message: error instanceof Error ? error.message : 'Error desconocido',
        userId: user.uid,
        settings
      });
      
      let errorMessage = 'Error al guardar configuración';
      let useLocalFallback = false;
      
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          errorMessage = 'Configuraciones guardadas localmente (permisos limitados)';
          useLocalFallback = true;
        } else if (error.message.includes('offline')) {
          errorMessage = 'Configuraciones guardadas localmente (sin conexión)';
          useLocalFallback = true;
        } else if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          errorMessage = 'Configuraciones guardadas localmente (conexión bloqueada)';
          useLocalFallback = true;
        }
      }
      
      if (useLocalFallback) {
        // Guardar configuraciones localmente como respaldo
        try {
          localStorage.setItem(`userSettings_${user.uid}`, JSON.stringify(settings));
          toast.success(errorMessage);
          onOpenChange(false);
        } catch (localError) {
          toast.error('No se pudieron guardar las configuraciones');
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Configuración
          </DialogTitle>
          <DialogDescription>
            Gestiona tu perfil, notificaciones y preferencias del sistema
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <BellIcon className="h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertTriangleIcon className="h-4 w-4" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-1">
              <PaletteIcon className="h-4 w-4" />
              Preferencias
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1">
              <ShieldIcon className="h-4 w-4" />
              Privacidad
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 max-h-[60vh] overflow-y-auto">
            {/* Perfil */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información de perfil que será visible para otros usuarios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={settings.profile.avatar || user.photoURL || ''} />
                      <AvatarFallback className="text-lg">
                        {settings.profile.displayName ? 
                          settings.profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase() :
                          user.email.charAt(0).toUpperCase()
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <CameraIcon className="h-4 w-4 mr-2" />
                        Cambiar foto
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG máximo 2MB
                      </p>
                    </div>
                  </div>

                  {/* Información básica */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Nombre completo</Label>
                      <Input
                        id="displayName"
                        value={settings.profile.displayName}
                        onChange={(e) => updateSetting('profile.displayName', e.target.value)}
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={settings.profile.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Teléfono</Label>
                      <Input
                        id="phoneNumber"
                        value={settings.profile.phoneNumber || ''}
                        onChange={(e) => updateSetting('profile.phoneNumber', e.target.value)}
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Input
                        id="department"
                        value={settings.profile.department || ''}
                        onChange={(e) => updateSetting('profile.department', e.target.value)}
                        placeholder="Escuela de Informática"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo/Posición</Label>
                    <Input
                      id="position"
                      value={settings.profile.position || ''}
                      onChange={(e) => updateSetting('profile.position', e.target.value)}
                      placeholder="Estudiante, Profesor, Coordinador..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={settings.profile.bio || ''}
                      onChange={(e) => updateSetting('profile.bio', e.target.value)}
                      placeholder="Cuéntanos un poco sobre ti..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notificaciones */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones por Email</CardTitle>
                  <CardDescription>
                    Configura qué notificaciones quieres recibir por correo electrónico
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Actualizaciones de prácticas</Label>
                      <p className="text-sm text-muted-foreground">
                        Cambios de estado y nuevas asignaciones
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.practiceUpdates}
                      onCheckedChange={(checked) => updateSetting('notifications.email.practiceUpdates', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Recordatorios de evaluaciones</Label>
                      <p className="text-sm text-muted-foreground">
                        Fechas límite y evaluaciones pendientes
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.evaluationReminders}
                      onCheckedChange={(checked) => updateSetting('notifications.email.evaluationReminders', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anuncios del sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Actualizaciones importantes y mantenimiento
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.systemAnnouncements}
                      onCheckedChange={(checked) => updateSetting('notifications.email.systemAnnouncements', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reportes semanales</Label>
                      <p className="text-sm text-muted-foreground">
                        Resumen semanal de actividades
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.weeklyReports}
                      onCheckedChange={(checked) => updateSetting('notifications.email.weeklyReports', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones Push</CardTitle>
                  <CardDescription>
                    Notificaciones instantáneas en el navegador
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Fechas límite de prácticas</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas de fechas importantes
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.practiceDeadlines}
                      onCheckedChange={(checked) => updateSetting('notifications.push.practiceDeadlines', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nuevas evaluaciones</Label>
                      <p className="text-sm text-muted-foreground">
                        Cuando se asignen nuevas evaluaciones
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.newEvaluations}
                      onCheckedChange={(checked) => updateSetting('notifications.push.newEvaluations', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas del sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificaciones críticas del sistema
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.systemAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications.push.systemAlerts', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alertas */}
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Alertas</CardTitle>
                  <CardDescription>
                    Personaliza cuándo y cómo recibir alertas importantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Alertas de fechas límite de prácticas</Label>
                      <Switch
                        checked={settings.alerts.practiceDeadlines.enabled}
                        onCheckedChange={(checked) => updateSetting('alerts.practiceDeadlines.enabled', checked)}
                      />
                    </div>
                    
                    {settings.alerts.practiceDeadlines.enabled && (
                      <div className="ml-4 space-y-2">
                        <Label htmlFor="practiceDeadlineDays">Días antes de la fecha límite</Label>
                        <Select
                          value={settings.alerts.practiceDeadlines.daysBeforeDeadline.toString()}
                          onValueChange={(value) => updateSetting('alerts.practiceDeadlines.daysBeforeDeadline', parseInt(value))}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 día</SelectItem>
                            <SelectItem value="3">3 días</SelectItem>
                            <SelectItem value="7">7 días</SelectItem>
                            <SelectItem value="14">14 días</SelectItem>
                            <SelectItem value="30">30 días</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Recordatorios de evaluaciones</Label>
                      <Switch
                        checked={settings.alerts.evaluationReminders.enabled}
                        onCheckedChange={(checked) => updateSetting('alerts.evaluationReminders.enabled', checked)}
                      />
                    </div>
                    
                    {settings.alerts.evaluationReminders.enabled && (
                      <div className="ml-4 space-y-2">
                        <Label htmlFor="evaluationReminderHours">Horas antes de la fecha límite</Label>
                        <Select
                          value={settings.alerts.evaluationReminders.hoursBeforeDeadline.toString()}
                          onValueChange={(value) => updateSetting('alerts.evaluationReminders.hoursBeforeDeadline', parseInt(value))}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hora</SelectItem>
                            <SelectItem value="4">4 horas</SelectItem>
                            <SelectItem value="12">12 horas</SelectItem>
                            <SelectItem value="24">24 horas</SelectItem>
                            <SelectItem value="48">48 horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mantenimiento del sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificaciones sobre mantenimiento programado
                      </p>
                    </div>
                    <Switch
                      checked={settings.alerts.systemMaintenance.enabled}
                      onCheckedChange={(checked) => updateSetting('alerts.systemMaintenance.enabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferencias */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Apariencia y Comportamiento</CardTitle>
                  <CardDescription>
                    Personaliza la interfaz y comportamiento de la aplicación
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme-select">Tema de la aplicación</Label>
                      <Select
                        value={theme}
                        onValueChange={(value: Theme) => {
                          try {
                            setTheme(value);
                            updateSetting('preferences.theme', value);
                            console.log('Tema actualizado a:', value);
                          } catch (error) {
                            console.error('Error al cambiar tema:', error);
                            toast.error('Error al cambiar el tema');
                          }
                        }}
                      >
                        <SelectTrigger id="theme-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500"></div>
                              Claro
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600"></div>
                              Oscuro
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-slate-800 border border-slate-400"></div>
                              Automático (Sistema)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        El tema automático cambia según las preferencias de tu sistema operativo
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Idioma</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value: 'es' | 'en') => updateSetting('preferences.language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Formato de fecha</Label>
                      <Select
                        value={settings.preferences.dateFormat}
                        onValueChange={(value: any) => updateSetting('preferences.dateFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Vista predeterminada del dashboard</Label>
                      <Select
                        value={settings.preferences.defaultDashboardView}
                        onValueChange={(value: any) => updateSetting('preferences.defaultDashboardView', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="analytics">Analítica</SelectItem>
                          <SelectItem value="practices">Prácticas</SelectItem>
                          <SelectItem value="lifecycle">Ciclo de vida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacidad */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Privacidad</CardTitle>
                  <CardDescription>
                    Controla qué información es visible para otros usuarios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Visibilidad del perfil</Label>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value: any) => updateSetting('privacy.profileVisibility', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público - Visible para todos</SelectItem>
                        <SelectItem value="internal">Interno - Solo miembros de UTEM</SelectItem>
                        <SelectItem value="private">Privado - Solo para mí</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mostrar email en el perfil</Label>
                        <p className="text-sm text-muted-foreground">
                          Otros usuarios podrán ver tu dirección de correo
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.showEmail}
                        onCheckedChange={(checked) => updateSetting('privacy.showEmail', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mostrar teléfono en el perfil</Label>
                        <p className="text-sm text-muted-foreground">
                          Otros usuarios podrán ver tu número de teléfono
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.showPhoneNumber}
                        onCheckedChange={(checked) => updateSetting('privacy.showPhoneNumber', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Estado de actividad</Label>
                        <p className="text-sm text-muted-foreground">
                          Mostrar cuando estás en línea o activo
                        </p>
                      </div>
                      <Switch
                        checked={settings.privacy.activityStatus}
                        onCheckedChange={(checked) => updateSetting('privacy.activityStatus', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {(saving || loading) && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSaving(false);
                  setLoading(false);
                  console.log('Estados reseteados manualmente');
                }}
                className="text-xs"
              >
                Resetear
              </Button>
            )}
            <Button 
              onClick={saveSettings} 
              disabled={!canSave}
              className="min-w-[140px]"
              title={!canSave ? 'No se puede guardar en este momento' : 'Guardar configuraciones'}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Guardando...
                </>
              ) : loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Cargando...
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};