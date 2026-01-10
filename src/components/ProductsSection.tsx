import ProductCard from "./ProductCard";
import { products } from "@/config/site";

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
