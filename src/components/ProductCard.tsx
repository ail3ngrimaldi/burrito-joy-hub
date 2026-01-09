interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
  onClick: () => void;
}

const ProductCard = ({
  id,
  name,
  description,
  image,
  available,
  onClick,
}: ProductCardProps) => {
  return (
    <div 
      className={`group bg-card rounded-2xl overflow-hidden shadow-card transition-all duration-300 ${available ? 'hover:shadow-xl hover:-translate-y-2 cursor-pointer' : 'opacity-60'}`}
      onClick={available ? onClick : undefined}
    >
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
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-foreground mb-2">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 min-h-[40px]">
          {description}
        </p>
        
        {/* Call to action */}
        {available ? (
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              Ver tamaños y precios →
            </span>
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
