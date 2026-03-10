import { useState, useEffect } from "react";
import { ShoppingCart, Check, Plus, Minus, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { productSizes, type ProductSize } from "@/config/site";
import { type ProductStockMap, getStockForProduct } from "@/hooks/useProductStock";
import notFoundImage from "@/assets/not_found.png";

interface ProductPrices {
  M: number;
  L: number;
}

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
  prices: ProductPrices;
  stockMap?: ProductStockMap;
  isLoadingStock?: boolean;
  onClick?: () => void;
  nutrition?: {
    M: { kcal: number; protein: number };
    L: { kcal: number; protein: number };
  };
  newRecipe?: {
    enabled: boolean;
    label: string;
  };
}

const ProductCard = ({
  id,
  name,
  description,
  image,
  available,
  prices,
  stockMap,
  isLoadingStock,
  nutrition,
  newRecipe,
}: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const selectedSizeData = productSizes[selectedSize];
  const currentPrice = prices[selectedSize];
  const currentStock = getStockForProduct(stockMap, id, selectedSize);
  const maxQuantity = isLoadingStock ? 99 : currentStock;

  useEffect(() => {
    if (!isLoadingStock && quantity > currentStock && currentStock > 0) {
      setQuantity(currentStock);
    }
  }, [currentStock, isLoadingStock, quantity]);

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= maxQuantity) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!isLoadingStock && currentStock < quantity) {
      toast.error(`Solo hay ${currentStock} unidades disponibles`);
      return;
    }

    addItem(
      {
        productId: id,
        productName: name,
        size: selectedSize,
        weight: selectedSizeData.weight,
        price: currentPrice,
      },
      quantity
    );

    setIsAdding(true);
    toast.success(
      `${quantity}x ${name} (${selectedSizeData.label}) agregado${quantity > 1 ? "s" : ""} al carrito`,
      { duration: 2000 }
    );

    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 1000);
  };

  const sizes: ProductSize[] = ["M", "L"];
  const getSizeStock = (size: ProductSize) => getStockForProduct(stockMap, id, size);

  return (
    <div
      className={`group bg-card border border-border overflow-hidden transition-all duration-300 ${
        available ? "hover:border-foreground/30" : "opacity-50"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {newRecipe?.enabled && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-burrito-orange text-white shadow-md">
              ✨ Nueva receta: {newRecipe.label}
            </span>
          </div>
        )}
        {image === notFoundImage ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-10 h-10 text-muted-foreground/40" />
            <span className="text-muted-foreground/60 text-xs">Imagen no disponible</span>
          </div>
        ) : (
          <img
            src={image}
            alt={`Burrito ${name}`}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              available ? "" : "grayscale"
            }`}
          />
        )}
        {!available && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-lg font-bold text-foreground">
            {name}
          </h3>
         {available ? (
          <p className="font-display text-lg font-bold text-foreground">
            ${currentPrice.toLocaleString("es-AR")}
          </p>
          ) : (
          <p className="font-display text-sm font-bold text-muted-foreground">
            ${prices.M.toLocaleString("es-AR")} — ${prices.L.toLocaleString("es-AR")}
          </p>
          )}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {description}
        </p>

        {nutrition && (
        <div className="flex gap-2 mb-4">
          <span className="text-xs px-2 py-1 bg-secondary border border-border text-muted-foreground">
            🔥 {nutrition[selectedSize].kcal} kcal
          </span>
          <span className="text-xs px-2 py-1 bg-secondary border border-border text-muted-foreground">
            💪 {nutrition[selectedSize].protein}g proteína
          </span>
        </div>
        )}

        {available && (
          <>
            {/* Size selector */}
            <div className="flex gap-2 mb-4">
              {sizes.map((size) => {
                const sizeStock = getSizeStock(size);
                const isOutOfStock = !isLoadingStock && sizeStock === 0;

                return (
                  <button
                    key={size}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={isOutOfStock}
                    className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium transition-all border ${
                      isOutOfStock
                        ? "border-border text-muted-foreground/40 cursor-not-allowed"
                        : selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {productSizes[size].label} · {isOutOfStock ? "Agotado" : productSizes[size].weight}
                  </button>
                );
              })}
            </div>

            {/* Quantity + Add */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-30"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity}
                  className="w-8 h-8 border border-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors disabled:opacity-30"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                variant="default"
                size="sm"
                className="uppercase tracking-wider text-xs"
              >
                {isAdding ? (
                  <>
                    <Check className="w-3 h-3" />
                    Listo
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" />
                    Agregar
                  </>
                )}
              </Button>
            </div>

            {/* Low stock warning */}
            {!isLoadingStock && currentStock > 0 && currentStock <= 5 && (
              <p className="text-xs text-accent font-medium mt-3">
                Solo quedan {currentStock} unidades
              </p>
            )}
          </>
        )}

        {!available && (
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">
            En producción
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
