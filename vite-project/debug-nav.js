// Script para simular la lógica de navegación
const Permission = {
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_LIFECYCLE: 'view_lifecycle',
  MANAGE_USERS: 'manage_users'
};

// Permisos del estudiante (copiado de los tipos)
const studentPermissions = [
  'view_dashboard',
  'view_analytics', 
  'view_lifecycle',
  'view_practices'
];

// Función hasPermission simulada
const hasPermission = (permission) => {
  return studentPermissions.includes(permission);
};

// Items de navegación (copiado del sidebar)
const navMainItems = [
  {
    title: "Dashboard",
    url: "#"
  },
  {
    title: "Ciclo de vida",
    url: "#"
  },
  {
    title: "Analítica", 
    url: "#"
  },
  {
    title: "Administración",
    url: "#"
  }
];

// Función de mapeo de permisos (copiada de nav-main.tsx)
const getSectionPermissions = (title) => {
  switch (title.toLowerCase()) {
    case 'dashboard':
      return [Permission.VIEW_DASHBOARD];
    case 'ciclo de vida':
      return [Permission.VIEW_LIFECYCLE];
    case 'analítica':
      return [Permission.VIEW_ANALYTICS];
    case 'administración':
      return [Permission.MANAGE_USERS];
    default:
      return [];
  }
};

console.log('🔍 Simulando lógica de navegación para estudiante...\n');

navMainItems.forEach((item) => {
  const requiredPermissions = getSectionPermissions(item.title);
  const hasAccess = requiredPermissions.length === 0 || 
                   requiredPermissions.some(permission => hasPermission(permission));
  
  console.log(`📋 ${item.title}:`);
  console.log(`   Permisos requeridos: [${requiredPermissions.join(', ')}]`);
  console.log(`   Tiene acceso: ${hasAccess ? '✅ SÍ' : '❌ NO'}`);
  console.log(`   Se mostraría: ${hasAccess ? '✅ SÍ' : '❌ NO'}\n`);
});

console.log('🎯 Verificaciones específicas:');
console.log(`¿Tiene VIEW_LIFECYCLE? ${hasPermission(Permission.VIEW_LIFECYCLE) ? '✅ SÍ' : '❌ NO'}`);
console.log(`¿"Ciclo de vida" debe mostrarse? ${getSectionPermissions("Ciclo de vida").some(p => hasPermission(p)) ? '✅ SÍ' : '❌ NO'}`);
