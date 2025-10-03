import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BellIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  InfoIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  UserIcon
} from "lucide-react";
import { usePermissions } from "@/contexts/PermissionsContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsDialog: React.FC<NotificationsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = usePermissions();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Datos de ejemplo para demostración
  useEffect(() => {
    if (open && user) {
      setLoading(true);
      // Simular carga de notificaciones
      setTimeout(() => {
        const sampleNotifications: Notification[] = [
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

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBadgeColor = (type: Notification['type']) => {
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `${diffInMinutes} minutos`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} horas`;
    return `${Math.floor(diffInMinutes / 1440)} días`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Notificaciones
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Mantente al día con las últimas actualizaciones y alertas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header con acciones */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {notifications.length === 0 ? 'No hay notificaciones' : 
               `${notifications.length} notificación${notifications.length !== 1 ? 'es' : ''}`}
            </p>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckIcon className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Lista de notificaciones */}
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <BellIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No tienes notificaciones</h3>
                    <p className="text-sm text-muted-foreground">
                      Cuando tengas nuevas actualizaciones aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all hover:shadow-md ${
                      !notification.read ? 'border-l-4 border-l-primary bg-muted/30' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium leading-5">
                                {notification.title}
                                {!notification.read && (
                                  <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-4">
                              <Badge 
                                variant={getNotificationBadgeColor(notification.type) as any}
                                className="text-xs"
                              >
                                {notification.type}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <XIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <ClockIcon className="h-3 w-3" />
                              {formatTimeAgo(notification.createdAt)}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {notification.actionUrl && (
                                <Button variant="outline" size="sm">
                                  Ver detalles
                                </Button>
                              )}
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};