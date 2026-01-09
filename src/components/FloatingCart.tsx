import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface FloatingCartProps {
  onClick: () => void;
}

const FloatingCart = ({ onClick }: FloatingCartProps) => {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-4 bg-primary text-primary-foreground rounded-full shadow-button hover:shadow-hover transition-all duration-300 hover:scale-110 group"
      aria-label="Ver carrito"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 w-7 h-7 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold animate-scale-in">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default FloatingCart;
