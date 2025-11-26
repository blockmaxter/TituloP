# Despliegue en Firebase Hosting

## Prerequisitos

1. Tener una cuenta de Google/Firebase
2. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
3. Tener Firebase CLI instalado

## Instalación de Firebase CLI

```bash
npm install -g firebase-tools
```

## Configuración

### Paso 1: Iniciar sesión en Firebase

```bash
firebase login
```

### Paso 2: Configurar el proyecto

1. Edita el archivo `.firebaserc` y reemplaza `tu-proyecto-firebase-id` con el ID de tu proyecto Firebase:

```json
{
  "projects": {
    "default": "tu-proyecto-real-firebase-id"
  }
}
```

### Paso 3: Construir el proyecto

```bash
npm run build
```

Este comando ejecutará:
- `tsc -b tsconfig.build.json` - Compilación de TypeScript
- `vite build` - Construcción para producción

Los archivos generados estarán en la carpeta `dist/`.

### Paso 4: Desplegar

```bash
# Desplegar todo
firebase deploy

# Solo desplegar hosting
firebase deploy --only hosting

# O usar el script npm
npm run deploy
```

## Scripts NPM disponibles

- `npm run deploy` - Construye y despliega todo
- `npm run deploy:hosting` - Construye y despliega solo hosting
- `npm run build` - Solo construye el proyecto
- `npm run preview` - Vista previa local del build

## Configuración de Firebase Hosting

El archivo `firebase.json` está configurado para:

- **Directorio público**: `dist` (donde Vite genera los archivos)
- **SPA Routing**: Redirige todas las rutas a `index.html`
- **Cache optimizado**: 
  - Archivos estáticos (fonts, CSS, JS, imágenes): cache de 1 año
  - HTML: sin cache para actualizaciones inmediatas

## Troubleshooting

### Error: No project configured
```bash
firebase use --add tu-proyecto-firebase-id
```

### Error: Permission denied
- Verifica que tengas permisos en el proyecto Firebase
- Ejecuta `firebase login` nuevamente

### Build errors
- Verifica que no hay errores de TypeScript: `npm run lint`
- Comprueba las dependencias: `npm install`

## Estructura después del build

```
dist/
├── index.html          # Punto de entrada
├── assets/             # CSS, JS minificados
├── vite.svg           # Assets estáticos
└── ...                # Otros archivos generados
```

## URLs después del despliegue

Una vez desplegado, tu aplicación estará disponible en:
- `https://tu-proyecto-firebase-id.web.app`
- `https://tu-proyecto-firebase-id.firebaseapp.com`

## Configuración avanzada

Para configuraciones adicionales como dominios personalizados, headers CORS específicos, o redirects más complejos, edita el archivo `firebase.json`.