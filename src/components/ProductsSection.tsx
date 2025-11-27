import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import burritoBolognesa from "@/assets/burrito-bolognesa.jpg";
import burritoCesar from "@/assets/burrito-cesar.jpg";
import burritoBondiola from "@/assets/burrito-bondiola.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const products: Product[] = [
  {
    id: "bolognesa",
    name: "Bolognesa",
    description: "Carne picada con salsa de tomate casera, queso fundido y especias italianas. Un clásico que nunca falla.",
    price: 3500,
    image: burritoBolognesa,
  },
  {
    id: "cesar",
    name: "César",
    description: "Pollo grillado, lechuga crocante, parmesano y nuestra salsa césar especial. Fresco y contundente.",
    price: 3500,
    image: burritoCesar,
  },
  {
    id: "bondiola",
    name: "Bondiola Desmechada",
    description: "Bondiola cocinada 8 horas, desmechada y combinada con mezcla de quesos. Para los que van en serio.",
    price: 4000,
    image: burritoBondiola,
  },
];

interface ProductsSectionProps {
  onOrderClick: (quantities: Record<string, number>) => void;
}

const ProductsSection = ({ onOrderClick }: ProductsSectionProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    bolognesa: 0,
    cesar: 0,
    bondiola: 0,
  });

  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = products.reduce(
    (sum, product) => sum + product.price * (quantities[product.id] || 0),
    0
  );

  const handleOrder = () => {
    onOrderClick(quantities);
  };

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
            Todos nuestros burritos pesan 350g y están pensados para que comas bien de verdad. 
            Nada de porciones de juguete.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                {...product}
                quantity={quantities[product.id] || 0}
                onQuantityChange={handleQuantityChange}
              />
            </div>
          ))}
        </div>

        {/* Order summary bar */}
        {totalItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl p-4 z-50 animate-slide-up">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  <span className="font-bold text-foreground">{totalItems}</span> burrito{totalItems !== 1 ? "s" : ""} seleccionado{totalItems !== 1 ? "s" : ""}
                </span>
                <div className="text-right">
                  <span className="text-2xl font-display font-bold text-primary">
                    ${totalPrice.toLocaleString("es-AR")}
                  </span>
                  <span className="text-xs text-muted-foreground block">+ $2.000 envío</span>
                </div>
              </div>
              <Button variant="hero" size="lg" onClick={handleOrder}>
                Hacer pedido ahora →
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
