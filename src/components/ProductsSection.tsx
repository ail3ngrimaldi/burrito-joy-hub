import ProductCard from "./ProductCard";
import { products } from "@/config/site";
import { useProductStock, hasAnyStock } from "@/hooks/useProductStock";
import { useI18n } from "@/contexts/I18nContext";

const ProductsSection = () => {
  const { data: stockMap, isLoading } = useProductStock();
  const { t } = useI18n();

  return (
    <section id="productos" className="py-24 bg-secondary">
      <div className="container mx-auto px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              {t("products.eyebrow")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {t("products.title")}
            </h2>
          </div>

          {/* Products grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const hasStock = product.variants
                ? product.variants.some(v => hasAnyStock(stockMap, `${product.id}-${v.id}`))
                : hasAnyStock(stockMap, product.id);
              const isAvailable = product.available && (isLoading || hasStock);

              return (
                <ProductCard
                  key={product.id}
                  {...product}
                  available={isAvailable}
                  stockMap={stockMap}
                  isLoadingStock={isLoading}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
