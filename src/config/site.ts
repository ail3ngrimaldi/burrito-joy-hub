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
