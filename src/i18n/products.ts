import type { Language } from "./translations";

// Traducciones de nombres y descripciones de productos
// Las claves son los `id` de productos en src/config/site.ts
export const productI18n: Record<
  string,
  Record<Language, { name: string; description: string }>
> = {
  bondiocheddar: {
    es: {
      name: "Bondiocheddar",
      description:
        "Bondiola desmechada cocinada a fuego lento, con cebolla caramelizada, zanahorias en cubo y cheddar fundido. Contundente e irresistible.",
    },
    en: {
      name: "Bondiocheddar",
      description:
        "Slow-cooked shredded pork shoulder with caramelized onion, diced carrots and melted cheddar. Hearty and irresistible.",
    },
  },
  "mexican-chicken": {
    es: {
      name: "Pollo Palta",
      description:
        "Suprema en cubos sazonada mezclada con cebolla y morrón salteados, palta embebida en aceite, limón y cheddar fundido. Fresco y sabroso.",
    },
    en: {
      name: "Chicken Avocado",
      description:
        "Seasoned diced chicken breast mixed with sautéed onion and bell pepper, avocado in oil, lemon and melted cheddar. Fresh and flavorful.",
    },
  },
  bolognesa: {
    es: {
      name: "Bolognesa",
      description:
        "Carne picada baja en grasa con salsa bolognesa casera, ricota baja en grasas procesada, muzzarella fundida y especias. Proteína y calorías en su medida justa.",
    },
    en: {
      name: "Bolognese",
      description:
        "Lean ground beef with homemade bolognese sauce, low-fat ricotta, melted mozzarella and spices. Balanced protein and calories.",
    },
  },
  "bolognesa-lowfat": {
    es: {
      name: "Bolognesa low fat",
      description:
        "Carne picada baja en grasa con salsa bolognesa casera, ricota baja en grasas procesada y especias. Bajísimo en grasas.",
    },
    en: {
      name: "Bolognese low fat",
      description:
        "Lean ground beef with homemade bolognese sauce, low-fat ricotta and spices. Extremely low in fat.",
    },
  },
  "the-bear": {
    es: {
      name: "Carne desmechada",
      description:
        "Carne roja desmechada, mezclada en salsa robert con cebolla y morron salteados más muzzarella fundida. Clásico que no falla.",
    },
    en: {
      name: "Shredded Beef",
      description:
        "Shredded beef in Robert sauce with sautéed onion and bell pepper plus melted mozzarella. A classic that never fails.",
    },
  },
  "pollo-honeypinaca": {
    es: {
      name: "Pollo espinaca",
      description:
        "Suprema en cubos mezclada en espinaca, queso crema, miel, cebolla caramelizada y queso fresco. Dulce y cremoso.",
    },
    en: {
      name: "Chicken Spinach",
      description:
        "Diced chicken breast mixed with spinach, cream cheese, honey, caramelized onion and fresh cheese. Sweet and creamy.",
    },
  },
  veggie: {
    es: {
      name: "Bolognesa Veggie",
      description:
        "Salsa Bolognesa hecha con soja texturizada, cebolla, morrón, zanahoria, apio y queso fresco. Italiano, delicioso y cruelty free.",
    },
    en: {
      name: "Veggie Bolognese",
      description:
        "Bolognese sauce made with textured soy, onion, bell pepper, carrot, celery and fresh cheese. Italian, delicious and cruelty-free.",
    },
  },
};

// Traducciones de tags promocionales
export const productTagI18n: Record<string, Record<Language, string>> = {
  "mexican-chicken": {
    es: "✨ Nueva receta: Pollo en cubos, sazón ajustado!",
    en: "✨ New recipe: Diced chicken, refined seasoning!",
  },
  veggie: {
    es: "🌱 Nuevo gusto!",
    en: "🌱 New flavor!",
  },
};

// Variantes (tipo de queso)
export const productVariantI18n: Record<string, Record<Language, string>> = {
  cremalight: { es: "Queso crema light", en: "Light cream cheese" },
  cheddar: { es: "Queso cheddar", en: "Cheddar cheese" },
};

export const getProductI18n = (
  id: string,
  lang: Language,
  fallback: { name: string; description: string }
) => productI18n[id]?.[lang] ?? fallback;

export const getProductTag = (id: string, lang: Language, fallback?: string) =>
  productTagI18n[id]?.[lang] ?? fallback ?? "";

export const getVariantLabel = (
  variantId: string,
  lang: Language,
  fallback: string
) => productVariantI18n[variantId]?.[lang] ?? fallback;
