import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  available: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  quantity,
  available,
  onQuantityChange,
}: ProductCardProps) => {
  const handleIncrement = () => {
    if (available) {
      onQuantityChange(id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0 && available) {
      onQuantityChange(id, quantity - 1);
    }
  };

  return (
    <div className={`group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 ${available ? 'hover:-translate-y-2' : 'opacity-60'}`}>
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={`Burrito ${name}`}
          className={`w-full h-full object-cover transition-transform duration-500 ${available ? 'group-hover:scale-110' : 'grayscale'}`}
        />
        {!available && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-bold text-sm">
              Sin stock
            </span>
          </div>
        )}
        {quantity > 0 && available && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
            {quantity}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-foreground mb-2">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 min-h-[40px]">
          {description}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-display text-2xl font-bold text-primary">
              ${price.toLocaleString("es-AR")}
            </span>
            <span className="text-sm text-muted-foreground ml-1">c/u</span>
          </div>
        </div>
        
        {/* Quantity selector */}
        {available ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="quantity"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity === 0}
                aria-label="Quitar uno"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <span className="w-12 text-center font-bold text-lg text-foreground">
                {quantity}
              </span>
              
              <Button
                variant="quantity"
                size="icon"
                onClick={handleIncrement}
                aria-label="Agregar uno"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {quantity > 0 && (
              <span className="text-sm font-semibold text-accent">
                ${(price * quantity).toLocaleString("es-AR")}
              </span>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <span className="text-muted-foreground text-sm font-medium">Próximamente disponible</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
