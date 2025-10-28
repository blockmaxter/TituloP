# 🚀 Guía de Inicio Rápido

## Configuración del Sistema en 3 Pasos

---

## Paso 1️⃣: Iniciar la Aplicación

```bash
cd /home/runner/work/TituloP/TituloP/vite-project
npm install
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## Paso 2️⃣: Primer Usuario Administrador

### Opción A: Usar el email configurado por defecto

Si inicias sesión con cualquiera de estos emails, obtendrás rol ADMIN automáticamente:
- `admin@utem.cl`
- `coordinador@utem.cl`

### Opción B: Otorgar SUPER_ADMIN a marayad@utem.cl

**Importante**: El usuario debe iniciar sesión en la app primero.

1. El usuario va a la app y hace login con Google usando `marayad@utem.cl`
2. Ejecutar el script:
```bash
npm run grant:superadmin marayad@utem.cl
```
3. El usuario cierra sesión y vuelve a iniciar sesión

---

## Paso 3️⃣: Verificar Funcionamiento

### Como Estudiante:

1. Iniciar sesión con cualquier email `@utem.cl` (excepto los de admin)
2. Verificar que en el menú aparecen:
   - ✅ Dashboard
   - ✅ Ciclo de vida
   - ✅ Analítica
3. Verificar que NO aparecen:
   - ❌ Biblioteca de datos
   - ❌ Administración

### Como Administrador:

1. Iniciar sesión con `admin@utem.cl` o `marayad@utem.cl`
2. Verificar que en el menú aparecen TODAS las secciones:
   - ✅ Dashboard
   - ✅ Ciclo de vida
   - ✅ Analítica
   - ✅ Administración
   - ✅ Biblioteca de datos

---

## 🎯 Funcionalidades Principales

### Ver Perfil de Usuario

1. Clic en el avatar del usuario (abajo del sidebar)
2. Seleccionar "Mi perfil"
3. Ver:
   - Nombre, email, rol
   - Lista de permisos
   - Estado de la cuenta

### Configurar Preferencias

1. Clic en el avatar del usuario
2. Seleccionar "Configuración"
3. Navegar por las pestañas:
   - **Perfil**: Editar información personal
   - **Notificaciones**: Configurar alertas por email
   - **Alertas**: Configurar recordatorios
   - **Preferencias**: Tema, idioma, formato
   - **Privacidad**: Visibilidad del perfil
4. Hacer cambios
5. Clic en "Guardar cambios"

### Gestionar Usuarios (Solo Admin)

1. Iniciar sesión como admin
2. Ir a la sección "Administración"
3. Ver lista de usuarios
4. Cambiar roles
5. Activar/desactivar usuarios

---

## 📋 Comandos Útiles

```bash
# Iniciar aplicación en desarrollo
npm run dev

# Construir para producción
npm run build

# Ver estadísticas de usuarios
npm run users:stats

# Inicializar usuarios de ejemplo
npm run users:init

# Otorgar SUPER_ADMIN a un usuario
npm run grant:superadmin <email>

# Ejemplo:
npm run grant:superadmin marayad@utem.cl
```

---

## 🔐 Roles y Accesos Rápidos

| Rol | Acceso Principal |
|-----|-----------------|
| **SUPER_ADMIN** | Todo el sistema + gestión de roles |
| **ADMIN** | Todo excepto gestión de roles |
| **COORDINATOR** | Coordinación de prácticas y estudiantes |
| **PROFESSOR** | Gestión académica y evaluaciones |
| **STUDENT** | Dashboard, Analítica, Ciclo de Vida |
| **VIEWER** | Solo lectura básica |

---

## 🆘 Solución de Problemas

### El usuario no ve sus permisos actualizados

**Solución**:
1. Cerrar sesión
2. Volver a iniciar sesión
3. Refrescar la página (F5)

### Error al ejecutar el script de SUPER_ADMIN

**Causa**: Usuario no ha iniciado sesión en la app

**Solución**:
1. El usuario debe iniciar sesión al menos una vez
2. Ejecutar el script nuevamente

### La navegación no se filtra correctamente

**Solución**:
1. Verificar el rol del usuario en "Mi perfil"
2. Refrescar la página (F5)
3. Limpiar caché del navegador si persiste

---

## 📖 Documentación Completa

Para más detalles, consultar:

- **IMPLEMENTACION_COMPLETA.md** - Resumen visual completo
- **SISTEMA_CONFIGURACION_USUARIO.md** - Documentación técnica detallada
- **GRANT_SUPERADMIN_GUIDE.md** - Guía para otorgar superadmin
- **VERIFICATION_CHECKLIST.md** - Lista de verificación completa
- **IMPLEMENTACION_PERMISOS.md** - Resumen de permisos
- **PERMISSIONS_README.md** - Documentación técnica de permisos

---

## ✅ Checklist de Inicio

- [ ] Aplicación instalada y corriendo
- [ ] Usuario administrador creado
- [ ] Verificado acceso como estudiante
- [ ] Verificado acceso como administrador
- [ ] Probado botón de perfil
- [ ] Probado botón de configuración
- [ ] Verificado filtrado de navegación

---

## 🎉 ¡Listo!

El sistema está completamente configurado y listo para usar.

**¿Necesitas ayuda?** Consulta la documentación completa o el checklist de verificación.

---

**Última actualización**: 28 de Octubre, 2025  
**Versión**: 1.0.0
