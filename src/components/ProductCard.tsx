import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
}

const sizes = [
  { id: "M" as const, label: "M", weight: "360g", price: 9000 },
  { id: "L" as const, label: "L", weight: "460g", price: 12000 },
  { id: "XL" as const, label: "XL", weight: "560g", price: 15000 },
];

interface ProductCardProps extends Product {
  onClick?: () => void;
}

const ProductCard = ({
  id,
  name,
  description,
  image,
  available,
}: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<"M" | "L" | "XL">("M");
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const selectedSizeData = sizes.find((s) => s.id === selectedSize)!;

  const handleAddToCart = () => {
    addItem({
      productId: id,
      productName: name,
      size: selectedSize,
      weight: selectedSizeData.weight,
      price: selectedSizeData.price,
    });

    setIsAdding(true);
    toast.success(`${name} (${selectedSize}) agregado al carrito`, {
      duration: 2000,
    });

    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div
      className={`group bg-card rounded-2xl overflow-hidden shadow-card transition-all duration-300 ${
        available ? "hover:shadow-xl hover:-translate-y-2" : "opacity-60"
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={`Burrito ${name}`}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            available ? "group-hover:scale-110" : "grayscale"
          }`}
        />
        {!available && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="bg-muted text-muted-foreground px-4 py-2 rounded-full font-bold text-sm">
              Sin stock
            </span>
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

        {available && (
          <>
            {/* Size selector */}
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Tamaño:</p>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedSize === size.id
                        ? "bg-primary text-primary-foreground shadow-button"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    <span className="font-bold">{size.label}</span>
                    <span className="block text-xs opacity-80">{size.weight}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price and add button */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-display font-bold text-primary">
                  ${selectedSizeData.price.toLocaleString("es-AR")}
                </p>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`gap-2 transition-all duration-300 ${
                  isAdding ? "bg-accent" : ""
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    ¡Listo!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Agregar
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {!available && (
          <div className="text-center py-2">
            <span className="text-muted-foreground text-sm font-medium">
              Próximamente disponible
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
