import { useState } from "react";
import { X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { siteConfig } from "@/config/site";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OrderFormModal, { type OrderFormData } from "./OrderFormModal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState<OrderFormData | null>(null);

  const getWhatsAppUrl = (formData: OrderFormData) => {
    if (items.length === 0) return "";

    const itemsList = items
      .map((item) => `- ${item.productName} ${item.size} (${item.weight}) x${item.quantity}`)
      .join("\n");

    const deliveryInfo = formData.isPickup 
      ? `🏠 *RETIRO EN LOCAL*
Nombre: ${formData.name}
Código Postal: ${formData.postalCode}`
      : `🚚 *ENVÍO A DOMICILIO*
Nombre: ${formData.name}
Dirección: ${formData.address}
Código Postal: ${formData.postalCode}`;

    const message = `¡Hola! Quiero hacer el siguiente pedido:

${deliveryInfo}

Productos:
${itemsList}

Total: ${totalItems} ${totalItems === 1 ? "burrito" : "burritos"} - $${totalPrice.toLocaleString("es-AR")}`;

    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleFormSubmit = async (formData: OrderFormData) => {
    setOrderData(formData);
    setShowOrderForm(false);

    // Save order to database
    try {
      const deliveryAddress = formData.isPickup
        ? `RETIRO EN LOCAL - CP: ${formData.postalCode}`
        : `${formData.address} - CP: ${formData.postalCode}`;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: formData.name,
          delivery_address: deliveryAddress,
          total_amount: totalPrice,
          status: "pendiente" as const,
          notes: formData.isPickup ? "Retiro en local" : "Envío a domicilio",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Decrement stock for each item
      for (const item of items) {
        await supabase.rpc("decrement_stock", {
          p_product_id: item.productId,
          p_size: item.size,
          p_quantity: item.quantity,
        });
      }

      console.log("Order saved successfully:", order.id);
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Error al guardar el pedido, pero se enviará por WhatsApp");
    }

    // Open WhatsApp with the order
    const url = getWhatsAppUrl(formData);
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    onClose();
  };

  const handleOrderClick = () => {
    setShowOrderForm(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      >
        <div
          className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl animate-slide-in-right flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Tu pedido 🌯
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-2">Tu carrito está vacío</p>
                <p className="text-muted-foreground text-sm">¡Agregá algunos burritos deliciosos!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.size} ({item.weight})
                      </p>
                      <p className="text-primary font-bold">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-4 h-4 text-foreground" />
                      </button>
                      <span className="w-8 text-center font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4 text-foreground" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="p-2 hover:bg-destructive/10 rounded-full transition-colors text-destructive"
                      aria-label="Eliminar item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex justify-between items-center mb-4">
                <span className="text-foreground font-medium">
                  Total ({totalItems} {totalItems === 1 ? "burrito" : "burritos"})
                </span>
                <span className="text-2xl font-display font-bold text-primary">
                  ${totalPrice.toLocaleString("es-AR")}
                </span>
              </div>
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full gap-2"
                onClick={handleOrderClick}
              >
                <MessageCircle className="w-5 h-5" />
                Enviar pedido por WhatsApp
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Order Form Modal */}
      <OrderFormModal
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};

export default CartDrawer;
