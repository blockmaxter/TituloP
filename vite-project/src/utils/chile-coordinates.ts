// Coordenadas de las principales comunas de Chile
export const chileCoordinates: Record<string, { lat: number; lng: number; region: string }> = {
  // Región Metropolitana
  "Santiago": { lat: -33.4489, lng: -70.6693, region: "Región Metropolitana" },
  "Providencia": { lat: -33.4264, lng: -70.6152, region: "Región Metropolitana" },
  "Las Condes": { lat: -33.4172, lng: -70.5476, region: "Región Metropolitana" },
  "Vitacura": { lat: -33.3928, lng: -70.5476, region: "Región Metropolitana" },
  "Ñuñoa": { lat: -33.4569, lng: -70.5946, region: "Región Metropolitana" },
  "La Reina": { lat: -33.4453, lng: -70.5369, region: "Región Metropolitana" },
  "Maipú": { lat: -33.5115, lng: -70.7581, region: "Región Metropolitana" },
  "Puente Alto": { lat: -33.6114, lng: -70.5756, region: "Región Metropolitana" },
  "San Miguel": { lat: -33.4969, lng: -70.6578, region: "Región Metropolitana" },
  "La Florida": { lat: -33.5219, lng: -70.5989, region: "Región Metropolitana" },
  
  // Valparaíso
  "Valparaíso": { lat: -33.0472, lng: -71.6127, region: "Región de Valparaíso" },
  "Viña del Mar": { lat: -33.0246, lng: -71.5522, region: "Región de Valparaíso" },
  "Quilpué": { lat: -33.0472, lng: -71.4425, region: "Región de Valparaíso" },
  "Villa Alemana": { lat: -33.0439, lng: -71.3732, region: "Región de Valparaíso" },
  
  // Concepción
  "Concepción": { lat: -36.8201, lng: -73.0444, region: "Región del Biobío" },
  "Talcahuano": { lat: -36.7312, lng: -73.1161, region: "Región del Biobío" },
  "Chillán": { lat: -36.6067, lng: -72.1034, region: "Región del Ñuble" },
  "Los Ángeles": { lat: -37.4689, lng: -72.3527, region: "Región del Biobío" },
  
  // La Serena
  "La Serena": { lat: -29.9027, lng: -71.2519, region: "Región de Coquimbo" },
  "Coquimbo": { lat: -29.9533, lng: -71.3436, region: "Región de Coquimbo" },
  
  // Antofagasta
  "Antofagasta": { lat: -23.6509, lng: -70.3975, region: "Región de Antofagasta" },
  "Calama": { lat: -22.4569, lng: -68.9172, region: "Región de Antofagasta" },
  
  // Temuco
  "Temuco": { lat: -38.7359, lng: -72.5904, region: "Región de La Araucanía" },
  "Padre Las Casas": { lat: -38.7514, lng: -72.6089, region: "Región de La Araucanía" },
  
  // Valdivia
  "Valdivia": { lat: -39.8142, lng: -73.2459, region: "Región de Los Ríos" },
  
  // Puerto Montt
  "Puerto Montt": { lat: -41.4693, lng: -72.9424, region: "Región de Los Lagos" },
  
  // Punta Arenas
  "Punta Arenas": { lat: -53.1638, lng: -70.9171, region: "Región de Magallanes" },
  
  // Arica
  "Arica": { lat: -18.4746, lng: -70.3064, region: "Región de Arica y Parinacota" },
  
  // Iquique
  "Iquique": { lat: -20.2307, lng: -70.1355, region: "Región de Tarapacá" },
  
  // Rancagua
  "Rancagua": { lat: -34.1708, lng: -70.7394, region: "Región de O'Higgins" },
  
  // Talca
  "Talca": { lat: -35.4232, lng: -71.6483, region: "Región del Maule" },
};

// Función para buscar coordenadas por nombre (con búsqueda fuzzy)
export function findCoordinates(comunaName: string): { lat: number; lng: number; region: string } | null {
  if (!comunaName) return null;
  
  // Normalizar el nombre
  const normalizedInput = comunaName.toLowerCase().trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n');
  
  // Buscar coincidencia exacta primero
  for (const [key, coords] of Object.entries(chileCoordinates)) {
    const normalizedKey = key.toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n');
    
    if (normalizedKey === normalizedInput) {
      return coords;
    }
  }
  
  // Buscar coincidencia parcial
  for (const [key, coords] of Object.entries(chileCoordinates)) {
    const normalizedKey = key.toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n');
    
    if (normalizedKey.includes(normalizedInput) || normalizedInput.includes(normalizedKey)) {
      return coords;
    }
  }
  
  // Coordenadas por defecto (Santiago) si no se encuentra
  return chileCoordinates["Santiago"];
}

// Región central de Chile para centrar el mapa
export const chileCenterCoordinates = {
  lat: -33.4489,
  lng: -70.6693,
  zoom: 6
};