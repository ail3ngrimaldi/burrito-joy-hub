import ProductCard from "./ProductCard";
import burritoBondiocheddar from "@/assets/burrito-bondiocheddar.jpg";
import burritoCesar from "@/assets/burrito-cesar.jpg";
import burritoBondiola from "@/assets/burrito-bondiola.jpg";
import burritoBolognesa from "@/assets/burrito-bolognesa.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
}

const products: Product[] = [
  {
    id: "bondiocheddar",
    name: "Bondiocheddar",
    description: "Bondiola desmechada cocinada a fuego lento, con cebolla caramelizada, zanahorias en cubo y cheddar fundido. Contundente e irresistible.",
    image: burritoBondiocheddar,
    available: true,
  },
  {
    id: "mexican-chicken",
    name: "Pollo Mex",
    description: "Pollo desmechado mezclado con cebolla y morrón en tiras, crema de palta fresca y cheddar fundido. Fresco y sabroso.",
    image: burritoCesar,
    available: true,
  },
  {
    id: "pollo-honeypinaca",
    name: "Honeypinaca",
    description: "Pollo en tiras con queso crema, miel, espinaca, cebolla caramelizada y queso fresco. Dulce y cremoso.",
    image: burritoBondiola,
    available: true,
  },
  {
    id: "veggie",
    name: "Bolognesa Veggie",
    description: "Salsa Bolognesa hecha con soja texturizada, cebolla, morron, ajo y queso fresco. Italiano, delicioso y cruelty free.",
    image: burritoBolognesa,
    available: true,
  },
  {
    id: "pollo-espinaca",
    name: "Pollo al Verdeo",
    description: "Pollo en cubos con queso sardo, queso crema y salsa de verdeo y puerro. Plato clásico sin ensuciar",
    image: burritoBondiola,
    available: false,
  },
  {
    id: "bolognesa",
    name: "Bolognesa Carnívoro",
    description: "Carne picada desgrasada con salsa bolognesa casera, queso fundido y especias. Un clásico reconfortante.",
    image: burritoBolognesa,
    available: false,
  },
];

const ProductsSection = () => {
  return (
    <section id="productos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-in">
          <span className="inline-block px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-full text-sm font-medium mb-4">
            🌯 Nuestros sabores
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Elegí los que más te tientan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todos nuestros burritos tienen la masa más liviana del mercado. 
            Desarrollamos una receta única que nos permite hacer masas super finas, pero ricas y grandes.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
