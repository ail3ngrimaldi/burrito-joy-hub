// ==========================================
// CONFIGURACIÓN DEL SITIO - FÁCIL DE EDITAR
// ==========================================

// Información del negocio
export const siteConfig = {
  // Nombre del emprendimiento
  name: "Los Burritos de Dulcinea",
  
  // Tipografía del logo (clases de Tailwind)
  logoFont: {
    // Familia: font-heading, font-display, font-sans, etc.
    family: "font-heading",
    // Tamaño en mobile
    sizeMobile: "text-lg",
    // Tamaño en desktop
    sizeDesktop: "md:text-xl",
    // Peso: font-normal, font-medium, font-semibold, font-bold
    weight: "font-bold",
  },
  
  // Información de entregas
  delivery: {
    days: "Viernes",
    message: "Entregas:",
  },
  
  // Número de WhatsApp (con código de país)
  whatsappNumber: "5491124003293",
  
  // Códigos postales permitidos
  // Códigos postales con envío GRATIS
  freeDeliveryPostalCodes: [
    "1640", "1641", "1642", "1643", "1644", // Martínez/San Isidro
    "1610", "1611", "1612", "1613", // Boulogne/San Isidro
    "1636", "1637", "1638", "1639",         // Olivos/Vicente López
    "1602", "1603", "1604", "1605", "1606", // Florida/Vicente López
    "1607", "1608",                         // Villa Martelli
    "1646", "1647", "1648",                 // San Fernando
  ],
};

// ==========================================
// CALCULADORA DE ENVÍOS - COMPLETAR PRECIOS
// ==========================================
// Cada zona tiene un listado de códigos postales y un precio de envío.
// Ordenalas de más cercana a más lejana. Si un CP no está en ninguna
// zona (ni en freeDeliveryPostalCodes), se mostrará "Consultar".
//
// Ejemplo de cómo completar:
//   { name: "CABA Centro", postalCodes: ["1000","1001"], price: 1500 },

export interface ShippingZone {
  name: string;
  postalCodes: string[];
  price: number; // en pesos argentinos
}

export const shippingZones: ShippingZone[] = [
  // --- ZONA 1: Cercana (ejemplo) ---
  {
    name: "Zona cercana",
    postalCodes: [
      // Agregá acá los CPs de zona cercana
      // "1234", "1235",
    ],
    price: 2000,
  },
  // --- ZONA 2: Media ---
  {
    name: "Zona media",
    postalCodes: [
      // Agregá acá los CPs de zona media
      // "1400", "1401",
    ],
    price: 3500,
  },
  // --- ZONA 3: Lejana ---
  {
    name: "Zona lejana",
    postalCodes: [
      // Agregá acá los CPs de zona lejana
      // "1800", "1801",
    ],
    price: 5000,
  },
];

/**
 * Calcula el costo de envío para un código postal.
 * Retorna: { free: true } | { free: false, price: number, zone: string } | { free: false, price: null }
 * price = null significa que el CP no está en ninguna zona configurada (consultar).
 */
export function getShippingCost(postalCode: string): 
  | { free: true }
  | { free: false; price: number; zoneName: string }
  | { free: false; price: null } {
  
  const trimmed = postalCode.trim();
  
  if (siteConfig.freeDeliveryPostalCodes.includes(trimmed)) {
    return { free: true };
  }

  for (const zone of shippingZones) {
    if (zone.postalCodes.includes(trimmed)) {
      return { free: false, price: zone.price, zoneName: zone.name };
    }
  }

  // CP no encontrado en ninguna zona
  return { free: false, price: null };
}

// Tamaños disponibles con sus pesos
export const productSizes = {
  M: { label: "REGULAR", weight: "+350g" },
  L: { label: "EXTRALARGE", weight: "+500g" },
} as const;

export type ProductSize = keyof typeof productSizes;

// ==========================================
// PRODUCTOS Y PRECIOS - FÁCIL DE EDITAR
// ==========================================

// Importar imágenes
import imgBondioCheddar from "@/assets/bondioch.png";
import imgPolloPalta from "@/assets/pollopalt.png";
import imgHoneyPin from "@/assets/honeypin.png";
import imgCarneDesm from "@/assets/desmechada.png";
import imgBologn from "@/assets/bolgn.png";
import notFound from "@/assets/not_found.png";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
  nutrition?: {
    M: { kcal: number; protein: number };
    L: { kcal: number; protein: number };
  };
  // Precios por tamaño (en pesos argentinos)
  prices: {
    M: number;
    L: number;
  };
}

export const products: Product[] = [
  {
    id: "bondiocheddar",
    name: "Bondiocheddar",
    description: "Bondiola desmechada cocinada a fuego lento, con cebolla caramelizada, zanahorias en cubo y cheddar fundido. Contundente e irresistible.",
    image: imgBondioCheddar,
    available: true,
    prices: {
      M: 9500,
      L: 13000,
    },
    nutrition: {
      M: { kcal: 847, protein: 50 },
      L: { kcal: 1163, protein: 68 },
    }
  },
  {
    id: "mexican-chicken",
    name: "Pollo Palta",
    description: "Suprema en cubos sazonada mezclada con cebolla y morrón salteados, palta embebida en aceite, limón y cheddar fundido. Fresco y sabroso.",
    image: imgPolloPalta,
    available: true,
    prices: {
      M: 9000,
      L: 12000,
    },
    nutrition: {
      M: { kcal: 726, protein: 54 },
      L: { kcal: 1054, protein: 78 },
    }
  },
  {
    id: "bolognesa",
    name: "Bolognesa",
    description: "Carne picada baja en grasa con salsa bolognesa casera, ricota baja en grasas procesada, queso fundido y especias. Proteína y calorías en su medida justa.",
    image: imgBologn,
    available: true,
    prices: {
      M: 9500,
      L: 14000,
    },
    nutrition: {
      M: { kcal: 641, protein: 54 },
      L: { kcal: 922, protein: 74 },
    }
  },
  {
    id: "the-bear",
    name: "Carne desmechada",
    description: "Carne roja desmechada, mezclada en salsa robert con cebolla y morron salteados más muzzarella fundida. Clásico que no falla.",
    image: imgCarneDesm,
    available: true,
    prices: {
      M: 10000,
      L: 14500,
    },
    nutrition: {
        M: { kcal: 688, protein: 51 },
      L: { kcal: 998, protein: 74 },
    }
  },
    {
    id: "pollo-honeypinaca",
    name: "Pollo espinaca",
    description: "Suprema en cubos mezclada en espinaca, queso crema, miel, cebolla caramelizada y queso fresco. Dulce y cremoso.",
    image: imgHoneyPin,
    available: true,
    prices: {
      M: 9000,
      L: 12000,
    },
    nutrition: {
      M: { kcal: 700, protein: 51 },
      L: { kcal: 1018, protein: 74 },
    }
  },
];
