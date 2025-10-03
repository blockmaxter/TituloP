import React, { useState, useEffect } from 'react';
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
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cargar configuraciones del usuario
  useEffect(() => {
    if (user && open) {
      loadUserSettings();
    }
  }, [user, open]);

  const loadUserSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const settingsDoc = await getDoc(doc(db, 'userSettings', user.uid));
      if (settingsDoc.exists()) {
        const userData = settingsDoc.data() as UserSettings;
        setSettings({
          ...DEFAULT_USER_SETTINGS,
          ...userData,
          profile: {
            ...DEFAULT_USER_SETTINGS.profile,
            displayName: user.displayName || '',
            email: user.email,
            ...userData.profile,
          }
        });
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
    } catch (error) {
      console.error('Error loading user settings:', error);
      toast.error('Error al cargar configuraciones');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await setDoc(doc(db, 'userSettings', user.uid), {
        ...settings,
        updatedAt: new Date(),
      }, { merge: true });
      
      toast.success('Configuración guardada exitosamente');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar configuración');
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
                      <Label>Tema</Label>
                      <Select
                        value={settings.preferences.theme}
                        onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('preferences.theme', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="system">Automático</SelectItem>
                        </SelectContent>
                      </Select>
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
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Guardando...
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