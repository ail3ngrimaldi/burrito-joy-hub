import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  quantity,
  onQuantityChange,
}: ProductCardProps) => {
  const handleIncrement = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(id, quantity - 1);
    }
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={`Burrito ${name}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {quantity > 0 && (
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
      </div>
    </div>
  );
};

export default ProductCard;
