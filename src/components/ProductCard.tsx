import { useState, useEffect } from "react";
import { ShoppingCart, Check, Plus, Minus, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { productSizes, customSizeWeights, type ProductSize, type ProductVariant } from "@/config/site";
import { type ProductStockMap, getStockForProduct } from "@/hooks/useProductStock";
import { useI18n } from "@/contexts/I18nContext";
import { getProductI18n, getProductTag, getVariantLabel } from "@/i18n/products";
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
  singleSize?: boolean;
  nutrition?: {
    M: { kcal: number; protein: number };
    L: { kcal: number; protein: number };
  };
  tag?: {
    enabled: boolean;
    text: string;
    color?: string;
  };
  variants?: ProductVariant[];
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
  tag,
  variants,
  singleSize,
}: ProductCardProps) => {
  const { t, lang } = useI18n();
  const localized = getProductI18n(id, lang, { name, description });
  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const hasVariants = variants && variants.length > 0;
  const stockProductId = hasVariants && selectedVariant ? `${id}-${selectedVariant}` : id;

  const sizeWeight = customSizeWeights[id]?.[selectedSize] ?? productSizes[selectedSize].weight;
  const selectedSizeData = { ...productSizes[selectedSize], weight: sizeWeight };
  const currentPrice = prices[selectedSize];
  const currentStock = getStockForProduct(stockMap, stockProductId, selectedSize);
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
    if (hasVariants && !selectedVariant) {
      toast.error(t("products.selectCheese"));
      return;
    }

    if (!isLoadingStock && currentStock < quantity) {
      toast.error(t("products.onlyAvailable", { n: currentStock }));
      return;
    }

    const variantData = hasVariants ? variants.find((v) => v.id === selectedVariant) : undefined;
    const variantLabelLocalized = variantData
      ? getVariantLabel(variantData.id, lang, variantData.label)
      : undefined;

    addItem(
      {
        productId: id,
        productName: variantLabelLocalized ? `${localized.name} (${variantLabelLocalized})` : localized.name,
        size: selectedSize,
        weight: selectedSizeData.weight,
        price: currentPrice,
        variant: selectedVariant,
        variantLabel: variantLabelLocalized,
      },
      quantity
    );

    setIsAdding(true);
    toast.success(
      t("products.addedToCart", {
        n: quantity,
        name: localized.name,
        size: selectedSizeData.label,
      }),
      { duration: 2000 }
    );

    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 1000);
  };

  const sizes: ProductSize[] = singleSize ? ["M"] : ["M", "L"];
  const getSizeStock = (size: ProductSize) => getStockForProduct(stockMap, stockProductId, size);
  const getSizeWeight = (size: ProductSize) => customSizeWeights[id]?.[size] ?? productSizes[size].weight;

  const tagText = tag?.enabled ? getProductTag(id, lang, tag.text) : "";

  return (
    <div
      className={`group bg-card border border-border overflow-hidden transition-all duration-300 ${
        available ? "hover:border-foreground/30" : "opacity-50"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {tag?.enabled && (
          <div className="absolute top-3 right-3 z-10">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold ${tag.color || 'bg-burrito-orange'} text-white shadow-md`}>
              {tagText}
            </span>
          </div>
        )}
        {image === notFoundImage ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-10 h-10 text-muted-foreground/40" />
            <span className="text-muted-foreground/60 text-xs">{t("products.imageUnavailable")}</span>
          </div>
        ) : (
          <img
            src={image}
            alt={`Burrito ${localized.name}`}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              available ? "" : "grayscale"
            }`}
          />
        )}
        {!available && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              {t("products.outOfStock")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-lg font-bold text-foreground">
            {localized.name}
          </h3>
         {available ? (
          <p className="font-display text-lg font-bold text-foreground">
            ${currentPrice.toLocaleString("es-AR")}
          </p>
          ) : singleSize ? (
          <p className="font-display text-sm font-bold text-muted-foreground">
            ${prices.M.toLocaleString("es-AR")}
          </p>
          ) : (
          <p className="font-display text-sm font-bold text-muted-foreground">
            ${prices.M.toLocaleString("es-AR")} — ${prices.L.toLocaleString("es-AR")}
          </p>
          )}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {localized.description}
        </p>

        {nutrition && (
        <div className="flex gap-2 mb-4">
          <span className="text-xs px-2 py-1 bg-secondary border border-border text-muted-foreground">
            {t("products.kcal", { n: nutrition[selectedSize].kcal })}
          </span>
          <span className="text-xs px-2 py-1 bg-secondary border border-border text-muted-foreground">
            {t("products.protein", { n: nutrition[selectedSize].protein })}
          </span>
        </div>
        )}

        {available && (
          <>
            {/* Variant selector (e.g. cheese type) */}
            {hasVariants && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{t("products.chooseCheese")}</p>
                <div className="flex gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant.id);
                        setQuantity(1);
                      }}
                      className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium transition-all border ${
                        selectedVariant === variant.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:border-foreground"
                      }`}
                    >
                      {getVariantLabel(variant.id, lang, variant.label)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="flex gap-2 mb-4">
              {sizes.map((size) => {
                const sizeStock = getSizeStock(size);
                const isOutOfStock = !isLoadingStock && sizeStock === 0 && (!hasVariants || selectedVariant);

                return (
                  <button
                    key={size}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={!!isOutOfStock}
                    className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium transition-all border ${
                      isOutOfStock
                        ? "border-border text-muted-foreground/40 cursor-not-allowed"
                        : selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {productSizes[size].label} · {isOutOfStock ? t("products.sold.out") : getSizeWeight(size)}
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
                disabled={isAdding || (hasVariants && !selectedVariant)}
                variant="default"
                size="sm"
                className="uppercase tracking-wider text-xs"
              >
                {isAdding ? (
                  <>
                    <Check className="w-3 h-3" />
                    {t("products.added")}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" />
                    {t("products.add")}
                  </>
                )}
              </Button>
            </div>

            {/* Low stock warning */}
            {!isLoadingStock && (!hasVariants || selectedVariant) && currentStock > 0 && currentStock <= 5 && (
              <p className="text-xs text-accent font-medium mt-3">
                {t("products.lowStock", { n: currentStock })}
              </p>
            )}
          </>
        )}

        {!available && (
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">
            {t("products.inProduction")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
