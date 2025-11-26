#!/bin/bash

# Script para desplegar a Firebase Hosting
# Uso: ./deploy.sh [opciones]

set -e  # Salir si algún comando falla

echo "🚀 Iniciando proceso de despliegue a Firebase Hosting"

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado. Instalando..."
    npm install -g firebase-tools
fi

# Verificar si está logueado
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Necesitas hacer login en Firebase"
    firebase login --no-localhost
fi

# Verificar configuración del proyecto
if [ ! -f ".firebaserc" ]; then
    echo "❌ Archivo .firebaserc no encontrado"
    echo "Por favor configura tu proyecto con: firebase use --add [PROJECT_ID]"
    exit 1
fi

# Limpiar build anterior
echo "🧹 Limpiando build anterior..."
rm -rf dist/

# Construir el proyecto
echo "🔨 Construyendo el proyecto..."
npm run build

# Verificar que se generó el directorio dist
if [ ! -d "dist" ]; then
    echo "❌ Error: No se generó el directorio dist"
    exit 1
fi

echo "✅ Build completado exitosamente"

# Desplegar
echo "🚀 Desplegando a Firebase Hosting..."

if [ "$1" = "--hosting-only" ]; then
    firebase deploy --only hosting
else
    firebase deploy
fi

echo "✅ Despliegue completado"
echo "🌐 Tu aplicación está ahora disponible en:"
firebase hosting:channel:list

echo ""
echo "💡 Comandos útiles:"
echo "   firebase hosting:channel:list  - Ver URLs de hosting"
echo "   firebase hosting:sites:list    - Ver todos los sitios"
echo "   firebase open hosting          - Abrir en el navegador"