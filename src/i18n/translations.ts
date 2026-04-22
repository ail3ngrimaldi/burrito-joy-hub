export type Language = "es" | "en";

export const translations = {
  es: {
    // Navbar
    "nav.products": "Productos",
    "nav.faq": "FAQ",
    "nav.order": "Pedir",
    "nav.orderNow": "Pedir ahora",
    "nav.openMenu": "Abrir menú",
    "nav.closeMenu": "Cerrar menú",

    // Hero
    "hero.tagline": "Burritos congelados artesanales",
    "hero.title.line1": "Stockeá el",
    "hero.title.line2": "freezer,",
    "hero.title.line3": "comé rico.",
    "hero.subtitle": "Caseros, nutritivos y abundantes. Duran meses en el freezer. En minutos tenés un platazo.",
    "hero.tag.frozen": "🧊 Congelados",
    "hero.tag.delivery": "🚚 Envío Viernes",
    "hero.tag.zone": "📍 Zona Norte",
    "hero.cta": "Ver productos →",

    // Products
    "products.eyebrow": "Nuestros sabores",
    "products.title": "Elegí los que más te tientan",
    "products.outOfStock": "Sin stock",
    "products.inProduction": "En producción",
    "products.chooseCheese": "Elegí tu queso",
    "products.sold.out": "Agotado",
    "products.add": "Agregar",
    "products.added": "Listo",
    "products.lowStock": "Solo quedan {n} unidades",
    "products.addedToCart": "{n}x {name} ({size}) agregado{plural} al carrito",
    "products.selectCheese": "Seleccioná el tipo de queso",
    "products.onlyAvailable": "Solo hay {n} unidades disponibles",
    "products.kcal": "🔥 {n} kcal",
    "products.protein": "💪 {n}g proteína",
    "products.imageUnavailable": "Imagen no disponible",

    // FAQ
    "faq.eyebrow": "Preguntas frecuentes",
    "faq.title": "Todo lo que necesitás saber",
    "faq.q1": "¿Vienen congelados?",
    "faq.a1": "Sí, los burritos vienen congelados y listos para calentar. Duran 3 meses en el freezer y en 5 minutos tenés un platazo.",
    "faq.q2": "¿Dónde entregan?",
    "faq.a2": "Zona norte y CABA, con bonificación por envío de $2000 según la distancia desde nuestra sucursal.",
    "faq.q3": "¿Cómo pago?",
    "faq.a3": "Transferencia bancaria o efectivo al momento de la entrega.",
    "faq.q4": "¿Cuándo entregan?",
    "faq.a4": "Las entregas son los viernes. Los pedidos ingresan hasta el jueves a las 18hs.",
    "faq.moreQuestions": "¿Más dudas?",
    "faq.writeWhatsapp": "Escribinos por WhatsApp",

    // Testimonials
    "testimonials.eyebrow": "Testimonios",
    "testimonials.title": "Lo que dicen nuestros clientes",
    "testimonials.t1": "La calidad de estos burritos. Son de otro level. Solo probé el de bondio. Masa crocante y supeeeer rellenos. Están excelentes.",
    "testimonials.t2": "SUBLIME el de carne desmechada, sublime, aplausos 👏",
    "testimonials.t3": "Sabía que cocinaban bien pero no sabía que tanto.",

    // Cart
    "cart.title": "Tu pedido 🌯",
    "cart.empty": "Tu carrito está vacío",
    "cart.emptyHint": "¡Agregá algunos burritos deliciosos!",
    "cart.total": "Total ({n} {unit})",
    "cart.unit.singular": "burrito",
    "cart.unit.plural": "burritos",
    "cart.checkout": "Enviar pedido por WhatsApp",
    "cart.close": "Cerrar",
    "cart.decrease": "Disminuir cantidad",
    "cart.increase": "Aumentar cantidad",
    "cart.remove": "Eliminar item",
    "cart.processing.title": "Preparando tu pedido... 🌯",
    "cart.processing.sub": "Ya casi te mandamos a WhatsApp",
    "cart.error.save": "Hubo un problema guardando el pedido. Intentá de nuevo o contactanos por WhatsApp.",
    "cart.success.redirect": "¡Pedido registrado! Redirigiendo a WhatsApp...",

    // Order form
    "order.title": "Datos de entrega 📍",
    "order.name": "Nombre completo",
    "order.namePlaceholder": "Juan Pérez",
    "order.postal": "Código Postal o Localidad",
    "order.postalPlaceholder": "Ej: 1640 o Belgrano",
    "order.address": "Dirección completa",
    "order.addressPlaceholder": "Av. Libertador 1234, Piso 5, Depto A",
    "order.freeShipping": "¡Envío gratis a tu zona!",
    "order.shippingTo": "Envío a tu zona: ${price}",
    "order.delivery": "Envío (${price})",
    "order.pickupFree": "Retiro gratis",
    "order.unknownZone": "⚠️ Tu zona no tiene envío configurado aún",
    "order.unknownZoneHint": "Podés retirar sin cargo en Olivos, o consultanos por WhatsApp para coordinar envío.",
    "order.enterPostal": "Ingresá tu código postal o localidad para ver las opciones de envío",
    "order.continue": "Continuar al pedido",
    "order.continuePickup": "Continuar (Retiro en local)",
    "order.error.name": "El nombre es requerido",
    "order.error.address": "La dirección es requerida",
    "order.error.postal": "El código postal o localidad es requerido",
    "order.error.complete": "Por favor completá todos los campos correctamente",

    // WhatsApp message
    "wa.greeting": "¡Hola! Quiero hacer el siguiente pedido:",
    "wa.pickup": "🏠 *RETIRO EN LOCAL*",
    "wa.shipTo": "🚚 *ENVÍO A DOMICILIO*",
    "wa.name": "Nombre",
    "wa.address": "Dirección",
    "wa.postal": "Código Postal",
    "wa.products": "Productos",
    "wa.shipping": "Envío",
    "wa.shippingFree": "GRATIS",
    "wa.total": "Total",
    "wa.note.pickup": "Retiro en local",
    "wa.note.delivery": "Envío a domicilio",
    "wa.consult": "¡Hola! 👋 Tengo una consulta sobre los burritos...",

    // Footer
    "footer.copyright": "© {year} Los Burritos de Dulcinea",

    // Floating
    "floating.cart": "Ver carrito",
    "floating.whatsapp": "Contactar por WhatsApp",

    // Sizes
    "size.M": "REGULAR",
    "size.L": "XL",

    // 404
    "notfound.title": "¡Ups! Página no encontrada",
    "notfound.back": "Volver al inicio",
  },
  en: {
    // Navbar
    "nav.products": "Products",
    "nav.faq": "FAQ",
    "nav.order": "Order",
    "nav.orderNow": "Order now",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",

    // Hero
    "hero.tagline": "Artisan frozen burritos",
    "hero.title.line1": "Stock the",
    "hero.title.line2": "freezer,",
    "hero.title.line3": "eat well.",
    "hero.subtitle": "Homemade, nutritious and generous. They last for months in the freezer. In minutes you have a feast.",
    "hero.tag.frozen": "🧊 Frozen",
    "hero.tag.delivery": "🚚 Friday delivery",
    "hero.tag.zone": "📍 North Zone",
    "hero.cta": "See products →",

    // Products
    "products.eyebrow": "Our flavors",
    "products.title": "Pick the ones that tempt you most",
    "products.outOfStock": "Out of stock",
    "products.inProduction": "In production",
    "products.chooseCheese": "Choose your cheese",
    "products.sold.out": "Sold out",
    "products.add": "Add",
    "products.added": "Done",
    "products.lowStock": "Only {n} units left",
    "products.addedToCart": "{n}x {name} ({size}) added to cart",
    "products.selectCheese": "Please select a cheese type",
    "products.onlyAvailable": "Only {n} units available",
    "products.kcal": "🔥 {n} kcal",
    "products.protein": "💪 {n}g protein",
    "products.imageUnavailable": "Image unavailable",

    // FAQ
    "faq.eyebrow": "Frequently asked",
    "faq.title": "Everything you need to know",
    "faq.q1": "Are they frozen?",
    "faq.a1": "Yes, the burritos come frozen and ready to heat. They last 3 months in the freezer and in 5 minutes you have a great meal.",
    "faq.q2": "Where do you deliver?",
    "faq.a2": "North Zone and CABA, with a $2000 delivery fee depending on distance from our location.",
    "faq.q3": "How do I pay?",
    "faq.a3": "Bank transfer or cash upon delivery.",
    "faq.q4": "When do you deliver?",
    "faq.a4": "Deliveries are on Fridays. Orders are accepted until Thursday at 6pm.",
    "faq.moreQuestions": "More questions?",
    "faq.writeWhatsapp": "Message us on WhatsApp",

    // Testimonials
    "testimonials.eyebrow": "Testimonials",
    "testimonials.title": "What our customers say",
    "testimonials.t1": "The quality of these burritos. They're on another level. I only tried the bondio one. Crispy dough and suuuper stuffed. They're excellent.",
    "testimonials.t2": "SUBLIME the shredded beef one, sublime, applause 👏",
    "testimonials.t3": "I knew they cooked well but I didn't know how well.",

    // Cart
    "cart.title": "Your order 🌯",
    "cart.empty": "Your cart is empty",
    "cart.emptyHint": "Add some delicious burritos!",
    "cart.total": "Total ({n} {unit})",
    "cart.unit.singular": "burrito",
    "cart.unit.plural": "burritos",
    "cart.checkout": "Send order via WhatsApp",
    "cart.close": "Close",
    "cart.decrease": "Decrease quantity",
    "cart.increase": "Increase quantity",
    "cart.remove": "Remove item",
    "cart.processing.title": "Preparing your order... 🌯",
    "cart.processing.sub": "Sending you to WhatsApp shortly",
    "cart.error.save": "There was a problem saving your order. Please try again or contact us on WhatsApp.",
    "cart.success.redirect": "Order saved! Redirecting to WhatsApp...",

    // Order form
    "order.title": "Delivery details 📍",
    "order.name": "Full name",
    "order.namePlaceholder": "John Doe",
    "order.postal": "Postal code or locality",
    "order.postalPlaceholder": "e.g. 1640 or Belgrano",
    "order.address": "Full address",
    "order.addressPlaceholder": "Av. Libertador 1234, Floor 5, Apt A",
    "order.freeShipping": "Free shipping to your area!",
    "order.shippingTo": "Shipping to your area: ${price}",
    "order.delivery": "Delivery (${price})",
    "order.pickupFree": "Free pickup",
    "order.unknownZone": "⚠️ Your area doesn't have shipping configured yet",
    "order.unknownZoneHint": "You can pick up for free in Olivos, or message us on WhatsApp to arrange delivery.",
    "order.enterPostal": "Enter your postal code or locality to see shipping options",
    "order.continue": "Continue to order",
    "order.continuePickup": "Continue (In-store pickup)",
    "order.error.name": "Name is required",
    "order.error.address": "Address is required",
    "order.error.postal": "Postal code or locality is required",
    "order.error.complete": "Please complete all fields correctly",

    // WhatsApp message
    "wa.greeting": "Hi! I'd like to place the following order:",
    "wa.pickup": "🏠 *IN-STORE PICKUP*",
    "wa.shipTo": "🚚 *HOME DELIVERY*",
    "wa.name": "Name",
    "wa.address": "Address",
    "wa.postal": "Postal Code",
    "wa.products": "Products",
    "wa.shipping": "Shipping",
    "wa.shippingFree": "FREE",
    "wa.total": "Total",
    "wa.note.pickup": "In-store pickup",
    "wa.note.delivery": "Home delivery",
    "wa.consult": "Hi! 👋 I have a question about the burritos...",

    // Footer
    "footer.copyright": "© {year} Los Burritos de Dulcinea",

    // Floating
    "floating.cart": "View cart",
    "floating.whatsapp": "Contact via WhatsApp",

    // Sizes
    "size.M": "REGULAR",
    "size.L": "XL",

    // 404
    "notfound.title": "Oops! Page not found",
    "notfound.back": "Return to Home",
  },
} as const;

export type TranslationKey = keyof typeof translations.es;
