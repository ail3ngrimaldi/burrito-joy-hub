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
  allowedPostalCodes: [
    "1640", "1641", "1642", "1643", "1644", // Martínez/San Isidro
    "1610", "1611", "1612", "1613", // Boulogne/San Isidro
    "1636", "1637", "1638", "1639",         // Olivos/Vicente López
    "1602", "1603", "1604", "1605", "1606", // Florida/Vicente López
    "1607", "1608",                         // Villa Martelli
    "1646", "1647", "1648",                 // San Fernando
  ],
};

// Tamaños disponibles con sus pesos
export const productSizes = {
  M: { label: "M", weight: "350g" },
  L: { label: "L", weight: "480g" },
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
  },
  {
    id: "mexican-chicken",
    name: "Pollo Mex",
    description: "Suprema desmechada mezclada con cebolla y morrón salteados, palta embebida en aceite, limón y cheddar fundido. Fresco y sabroso.",
    image: imgPolloPalta,
    available: true,
    prices: {
      M: 9000,
      L: 12000,
    },
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
  },
  {
    id: "the-bear",
    name: "Carne desmechada",
    description: "Carne roja desmechada, cebolla y morron salteados con queso fundido. Clásico que no falla.",
    image: imgCarneDesm,
    available: true,
    prices: {
      M: 10000,
      L: 14500,
    },
  },
    {
    id: "pollo-honeypinaca",
    name: "Honeypinaca",
    description: "Suprema en tiras con queso crema, miel, espinaca, cebolla caramelizada y queso fresco. Dulce y cremoso.",
    image: imgHoneyPin,
    available: true,
    prices: {
      M: 9000,
      L: 11500,
    },
  },
];
