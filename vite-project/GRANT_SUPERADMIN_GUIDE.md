# Guía Rápida: Otorgar SUPER_ADMIN a marayad@utem.cl

## Pasos a Seguir

### 1. El usuario debe iniciar sesión primero

⚠️ **IMPORTANTE**: El usuario **marayad@utem.cl** debe iniciar sesión en la aplicación al menos una vez antes de ejecutar el script.

Instrucciones para el usuario:
1. Ir a la aplicación web
2. Hacer clic en "Iniciar sesión"
3. Iniciar sesión con su cuenta de Google usando el email **marayad@utem.cl**
4. Una vez dentro, puede cerrar sesión

### 2. Ejecutar el script

Una vez que el usuario haya iniciado sesión al menos una vez, ejecutar:

```bash
cd /home/runner/work/TituloP/TituloP/vite-project
npm run grant:superadmin marayad@utem.cl
```

O directamente:

```bash
cd /home/runner/work/TituloP/TituloP/vite-project
node scripts/grantSuperadminToEmail.js marayad@utem.cl
```

### 3. Verificar el resultado

El script mostrará:
- ✅ Usuario encontrado
- 📋 Información actual del usuario
- 🔄 Actualizando rol a SUPER_ADMIN
- ✅ Éxito
- 🔐 Lista de permisos otorgados

### 4. El usuario debe refrescar su sesión

Instrucciones para el usuario después de ejecutar el script:
1. Cerrar sesión en la aplicación
2. Volver a iniciar sesión
3. Refrescar la página (F5)
4. Verificar que ahora tiene acceso a "Administración" en el menú

## Permisos de SUPER_ADMIN

Una vez otorgado el rol, el usuario tendrá acceso a:

- ✅ **Dashboard**: Vista completa con métricas ejecutivas
- ✅ **Biblioteca de Datos**: Importar, exportar, editar y eliminar datos
- ✅ **Ciclo de Vida**: Gestionar estados y seguimiento de prácticas
- ✅ **Analítica**: Análisis avanzado y detallado
- ✅ **Administración**: Gestionar usuarios, roles y configuración del sistema

## Verificación

Para verificar que el rol fue asignado correctamente:

1. El usuario inicia sesión
2. En el menú inferior del sidebar, clic en su avatar
3. Seleccionar "Mi perfil"
4. Verificar que el rol mostrado sea "Super Administrador"
5. Verificar que en la lista de permisos aparecen todos los permisos del sistema

## Solución de Problemas

### Error: Usuario no encontrado

**Causa**: El usuario no ha iniciado sesión en la aplicación todavía.

**Solución**: 
1. El usuario debe iniciar sesión al menos una vez
2. Luego ejecutar el script nuevamente

### Error: Permission denied

**Causa**: Problemas con las credenciales de Firebase o las reglas de Firestore.

**Solución**:
1. Verificar que las credenciales de Firebase sean correctas
2. Verificar que las reglas de Firestore permitan esta operación
3. Consultar con el administrador del proyecto Firebase

### El usuario no ve los cambios

**Causa**: La sesión del usuario no se ha refrescado.

**Solución**:
1. El usuario debe cerrar sesión
2. Volver a iniciar sesión
3. Refrescar la página (F5 o Ctrl+R)
4. Si persiste, limpiar caché del navegador

## Contacto

Para más información o soporte, consultar:
- `SISTEMA_CONFIGURACION_USUARIO.md` - Documentación completa del sistema
- `IMPLEMENTACION_PERMISOS.md` - Resumen de implementación
- `PERMISSIONS_README.md` - Documentación técnica de permisos
