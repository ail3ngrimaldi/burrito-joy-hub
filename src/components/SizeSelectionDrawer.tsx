import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface SizeSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const sizes = [
  { id: "M", label: "M", weight: "360g", price: 9000 },
  { id: "L", label: "L", weight: "460g", price: 12000 },
  { id: "XL", label: "XL", weight: "560g", price: 15000 },
];

const SizeSelectionDrawer = ({ isOpen, onClose, product }: SizeSelectionDrawerProps) => {
  if (!isOpen || !product) return null;

  const handleWhatsAppOrder = (size: typeof sizes[0]) => {
    const message = `Hola! Me interesa el burrito de ${product.name} tamaño ${size.label} (${size.weight})`;
    const whatsappUrl = `https://wa.me/5491124003293?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div 
      className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-card/80 hover:bg-card rounded-full transition-colors shadow-lg"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className="absolute bottom-4 left-6">
            <h2 className="font-display text-2xl font-bold text-foreground drop-shadow-lg">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground text-sm mb-6">
            {product.description}
          </p>

          <h3 className="font-semibold text-foreground mb-4">Elegí tu tamaño:</h3>

          {/* Size options */}
          <div className="space-y-3">
            {sizes.map((size) => (
              <div 
                key={size.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-display text-lg font-bold text-primary">
                      {size.label}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{size.weight}</p>
                    <p className="text-lg font-display font-bold text-primary">
                      ${size.price.toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="whatsapp" 
                  size="sm"
                  onClick={() => handleWhatsAppOrder(size)}
                  className="gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Pedir
                </Button>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Coordinamos entrega y pago por WhatsApp 💬
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectionDrawer;
