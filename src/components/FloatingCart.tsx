import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";

interface FloatingCartProps {
  onClick: () => void;
}

const FloatingCart = ({ onClick }: FloatingCartProps) => {
  const { totalItems } = useCart();
  const { t } = useI18n();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-4 bg-foreground text-background rounded-full transition-all duration-200 hover:scale-105 hover:opacity-90"
      aria-label={t("floating.cart")}
    >
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default FloatingCart;
