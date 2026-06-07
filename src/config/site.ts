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
  // -------------------------------------------------------
  // ZONA 1 – Cercana (Belgrano, Núñez, Colegiales, Coghlan, Saavedra)
  // Barrios limítrofes con Vicente López / Olivos
  // -------------------------------------------------------
  {
    name: "CABA Zona Norte",
    postalCodes: [
      // Belgrano
      "1424", "1425", "1426", "1428", "1429", "1430",
      // Núñez
      // (1428, 1429 ya incluidos en Belgrano)
      // Colegiales
      "1414", "1427",
      // (1426, 1428 ya incluidos)
      // Coghlan
      "1431",
      // (1428, 1429, 1430 ya incluidos)
      // Saavedra
      // (1428, 1429, 1430, 1431 ya incluidos)
    ],
    price: 2000, // ← Ajustá este precio
  },

  // -------------------------------------------------------
  // ZONA 2 – Media (Palermo, Villa Urquiza, Chacarita)
  // -------------------------------------------------------
  {
    name: "CABA Zona Media",
    postalCodes: [
      // Palermo (CPs no incluidos en Zona 1)
      "1004", "1007", "1019", "1055", "1113",
      "1172", "1175", "1176", "1177", "1179",
      "1180", "1181", "1182", "1183", "1186",
      "1188", "1416", "1439",
      // (1414, 1425, 1426, 1428, 1429 ya en Zona 1)

      // Villa Urquiza (CPs no incluidos en Zona 1)
      // (1427, 1428, 1430, 1431 ya en Zona 1)

      // Chacarita (CPs no incluidos en Zona 1)
      "1418",
      // (1414, 1416, 1427 ya en Zona 1/arriba)
    ],
    price: 2500, // ← Ajustá este precio
  },

  // -------------------------------------------------------
  // ZONA 3 – Lejana (Recoleta, San Nicolás, Puerto Madero)
  // -------------------------------------------------------
  {
    name: "CABA Zona Centro/Sur",
    postalCodes: [
      // Recoleta (CPs no incluidos en zonas anteriores)
      "1000", "1001", "1011", "1012", "1013", "1014",
      "1015", "1016", "1017", "1018", "1020", "1021",
      "1022", "1023", "1024", "1025", "1026", "1057",
      "1059", "1060", "1061", "1062", "1091", "1108",
      "1111", "1112", "1114", "1115", "1116", "1117",
      "1118", "1119", "1120", "1121", "1122", "1123",
      "1124", "1125", "1126", "1127", "1128", "1129",
      "1170", "1171", "1173", "1174", "1187", "1215",
      // (1172, 1175, 1180, 1186, 1188, 1414, 1425 ya en zonas anteriores)

      // San Nicolás (CPs no incluidos en zonas anteriores)
      "1002", "1003", "1005", "1006", "1008", "1009",
      "1010", "1028", "1033", "1035", "1036", "1037",
      "1038", "1039", "1040", "1041", "1042", "1043",
      "1044", "1045", "1047", "1048", "1049", "1050",
      "1053", "1056", "1066", "1084", "1105", "1106",
      "1190",
      // (muchos CPs ya incluidos en Recoleta arriba)

      // Puerto Madero (CPs no incluidos en zonas anteriores)
      "1184",
      // (1000, 1001, 1005, 1006, 1007, 1010, 1425 ya incluidos)
    ],
    price: 3000, // ← Ajustá este precio
  },
];

// ==========================================
// MAPEO DE LOCALIDADES A CÓDIGOS POSTALES
// ==========================================
// Permite buscar por nombre de localidad además de CP

export const localityMap: Record<string, string[]> = {
  // Zona Norte GBA (envío gratis)
  "martinez": ["1640", "1641", "1642", "1643", "1644"],
  "san isidro": ["1640", "1641", "1642", "1643", "1644", "1610", "1611", "1612", "1613"],
  "boulogne": ["1610", "1611", "1612", "1613"],
  "olivos": ["1636", "1637", "1638", "1639"],
  "vicente lopez": ["1636", "1637", "1638", "1639", "1602", "1603", "1604", "1605", "1606"],
  "florida": ["1602", "1603", "1604", "1605", "1606"],
  "villa martelli": ["1607", "1608"],
  "san fernando": ["1646", "1647", "1648"],
  "munro": ["1605"],
  "carapachay": ["1605"],
  "la lucila": ["1636"],
  // CABA Zona 1
  "belgrano": ["1426", "1428", "1429"],
  "nunez": ["1428", "1429"],
  "nuñez": ["1428", "1429"],
  "colegiales": ["1414", "1427"],
  "coghlan": ["1431"],
  "saavedra": ["1430", "1431"],
  // CABA Zona 2
  "palermo": ["1425", "1414", "1416"],
  "villa urquiza": ["1431"],
  "chacarita": ["1414", "1418"],
  // CABA Zona 3
  "recoleta": ["1012", "1024", "1025", "1060", "1061", "1116", "1117", "1118", "1119"],
  "san nicolas": ["1002", "1003", "1005", "1008", "1035", "1036", "1037"],
  "puerto madero": ["1184", "1000", "1001"],
};

/**
 * Normaliza un input de texto: quita acentos, pasa a minúsculas y trimea.
 */
function normalizeInput(input: string): string {
  return input.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Calcula el costo de envío para un código postal o nombre de localidad.
 */
export function getShippingCost(input: string): 
  | { free: true }
  | { free: false; price: number; zoneName: string }
  | { free: false; price: null } {
  
  const trimmed = input.trim();
  
  // First try as postal code
  if (siteConfig.freeDeliveryPostalCodes.includes(trimmed)) {
    return { free: true };
  }

  for (const zone of shippingZones) {
    if (zone.postalCodes.includes(trimmed)) {
      return { free: false, price: zone.price, zoneName: zone.name };
    }
  }

  // Then try as locality name
  const normalized = normalizeInput(trimmed);
  const matchedCPs = localityMap[normalized];
  
  if (matchedCPs && matchedCPs.length > 0) {
    // Use the first CP to determine the zone
    const firstCP = matchedCPs[0];
    
    if (siteConfig.freeDeliveryPostalCodes.includes(firstCP)) {
      return { free: true };
    }

    for (const zone of shippingZones) {
      if (zone.postalCodes.includes(firstCP)) {
        return { free: false, price: zone.price, zoneName: zone.name };
      }
    }
  }

  // Not found
  return { free: false, price: null };
}

// Tamaños disponibles con sus pesos
export const productSizes = {
  M: { label: "REGULAR", weight: "+350g" },
  L: { label: "XL", weight: "+500g" },
} as const;

export type ProductSize = keyof typeof productSizes;

// Pesos personalizados por producto (override del default)
// Si el producto está acá, se usa este peso para M (y L si aplica)
export const customSizeWeights: Record<string, Partial<Record<ProductSize, string>>> = {
  "bolognesa-lowfat": { M: "300g" },
};

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

export interface ProductVariant {
  id: string;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
  // Si es true, el producto solo se vende en tamaño M (REGULAR)
  singleSize?: boolean;
  nutrition?: {
    M: { kcal: number; protein: number };
    L: { kcal: number; protein: number };
  };
  // Precios por tamaño (en pesos argentinos)
  prices: {
    M: number;
    L: number;
  };
  // Tag promocional (opcional) — texto y color completamente personalizables
  tag?: {
    enabled: boolean;
    // Texto completo que se muestra (ej: "✨ Nueva receta: Pollo en cubos")
    text: string;
    // Color de fondo en clase Tailwind (ej: "bg-burrito-orange", "bg-primary", "bg-green-600")
    color?: string;
  };
  // Variantes del producto (ej: tipo de queso)
  variants?: ProductVariant[];
}

export const products: Product[] = [
  {
    id: "bondiocheddar",
    name: "Bondiocheddar",
    description: "Bondiola desmechada cocinada a fuego lento, con cebolla caramelizada, zanahorias en cubo y cheddar fundido. Contundente e irresistible.",
    image: imgBondioCheddar,
    available: true,
    prices: {
      M: 10000,
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
      M: 10000,
      L: 13000,
    },
    nutrition: {
      M: { kcal: 726, protein: 54 },
      L: { kcal: 1054, protein: 78 },
    },
    tag: {
      enabled: true,
      text: "✨ Nueva receta: Pollo en cubos, sazón ajustado!",
    },
    variants: [
      { id: "cremalight", label: "Queso cremoso" },
      { id: "cheddar", label: "Queso cheddar" },
    ],
  },
  {
    id: "bolognesa",
    name: "Bolognesa",
    description: "Carne picada baja en grasa con salsa bolognesa casera, ricota baja en grasas procesada, muzzarella fundida y especias. Proteína y calorías en su medida justa.",
    image: imgBologn,
    available: true,
    prices: {
      M: 10000,
      L: 13000,
    },
    nutrition: {
      M: { kcal: 641, protein: 54 },
      L: { kcal: 922, protein: 74 },
    }
  },
  {
    id: "the-bear",
    name: "Carne desmechada",
    description: "Roast beef desmechado, mezclado en salsa robert con cebolla y morron salteados más muzzarella fundida. Clásico que no falla.",
    image: imgCarneDesm,
    available: true,
    prices: {
      M: 10000,
      L: 13000,
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
      M: 10000,
      L: 13000,
    },
    nutrition: {
      M: { kcal: 700, protein: 51 },
      L: { kcal: 1018, protein: 74 },
    },
  },
  {
    id: "veggie",
    name: "Bolognesa Veggie",
    description: "Salsa Bolognesa hecha con soja texturizada, cebolla, morrón, zanahoria, apio y queso fresco. Italiano, delicioso y cruelty free.",
    image: notFound,
    available: true,
    prices: {
      M: 6000,
      L: 7500,
    },
    tag: {
      enabled: true,
      text: "🌱 Nuevo gusto!",
      color: "bg-green-600",
    },
  },
];
