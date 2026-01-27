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
}: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const selectedSizeData = productSizes[selectedSize];
  const currentPrice = prices[selectedSize];

  // Get stock for current size
  const currentStock = getStockForProduct(stockMap, id, selectedSize);
  const maxQuantity = isLoadingStock ? 99 : currentStock;

  // Reset quantity if it exceeds available stock
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
      `${quantity}x ${name} (${selectedSize}) agregado${quantity > 1 ? "s" : ""} al carrito`,
      { duration: 2000 }
    );

    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 1000);
  };

  const sizes: ProductSize[] = ["M", "L"];

  // Check if a specific size has stock
  const getSizeStock = (size: ProductSize) => getStockForProduct(stockMap, id, size);

  return (
    <div
      className={`group bg-card rounded-2xl overflow-hidden shadow-card transition-all duration-300 ${
        available ? "hover:shadow-xl hover:-translate-y-2" : "opacity-60"
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        {image === notFoundImage ? (
          <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-3">
            <ImageOff className="w-12 h-12 text-muted-foreground/50" />
            <span className="text-muted-foreground/70 text-sm font-medium">
              Imagen no disponible
            </span>
          </div>
        ) : (
          <img
            src={image}
            alt={`Burrito ${name}`}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              available ? "group-hover:scale-110" : "grayscale"
            }`}
          />
        )}
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
                {sizes.map((size) => {
                  const sizeStock = getSizeStock(size);
                  const isOutOfStock = !isLoadingStock && sizeStock === 0;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isOutOfStock
                          ? "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50"
                          : selectedSize === size
                          ? "bg-primary text-primary-foreground shadow-button"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      <span className="font-bold">{productSizes[size].label}</span>
                      <span className="block text-xs opacity-80">
                        {isOutOfStock ? "Agotado" : productSizes[size].weight}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Cantidad:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity}
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stock indicator */}
            {!isLoadingStock && currentStock > 0 && currentStock <= 5 && (
              <p className="text-xs text-amber-600 font-medium mb-2">
                ⚠️ ¡Solo quedan {currentStock} unidades!
              </p>
            )}

            {/* Price and add button */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-display font-bold text-primary">
                  ${(currentPrice * quantity).toLocaleString("es-AR")}
                </p>
                {quantity > 1 && (
                  <p className="text-xs text-muted-foreground">
                    ${currentPrice.toLocaleString("es-AR")} c/u
                  </p>
                )}
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
                    Agregar {quantity > 1 ? `(${quantity})` : ""}
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
