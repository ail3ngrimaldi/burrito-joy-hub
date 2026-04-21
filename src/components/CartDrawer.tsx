import { useState } from "react";
import { X, Plus, Minus, Trash2, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { siteConfig } from "@/config/site";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProductStock, getStockForProduct } from "@/hooks/useProductStock";
import OrderFormModal, { type OrderFormData } from "./OrderFormModal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, clearCart, markCartConverted, totalItems, totalPrice } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState<OrderFormData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: stockMap, isLoading: isLoadingStock } = useProductStock();

  const getSizeLabel = (size: "M" | "L") => size === "M" ? "REGULAR" : "XL";

  const getStockProductId = (productId: string, variant?: string) =>
    variant ? `${productId}-${variant}` : productId;

  const getItemStock = (item: { productId: string; size: "M" | "L"; variant?: string }) =>
    getStockForProduct(stockMap, getStockProductId(item.productId, item.variant), item.size);

  const getWhatsAppUrl = (formData: OrderFormData) => {
    if (items.length === 0) return "";

    const itemsList = items
      .map((item) => `- ${item.productName} ${getSizeLabel(item.size)} x${item.quantity}`)
      .join("\n");

    const shippingLine = formData.shippingCost > 0 
      ? `\nEnvío: $${formData.shippingCost.toLocaleString("es-AR")}` 
      : (formData.isPickup ? "" : "\nEnvío: GRATIS");

    const deliveryInfo = formData.isPickup 
      ? `🏠 *RETIRO EN LOCAL*
Nombre: ${formData.name}
Código Postal: ${formData.postalCode}`
      : `🚚 *ENVÍO A DOMICILIO*
Nombre: ${formData.name}
Dirección: ${formData.address}
Código Postal: ${formData.postalCode}`;

    const orderTotal = totalPrice + formData.shippingCost;

    const message = `¡Hola! Quiero hacer el siguiente pedido:

${deliveryInfo}

Productos:
${itemsList}
${shippingLine}

Total: ${totalItems} ${totalItems === 1 ? "burrito" : "burritos"} - $${orderTotal.toLocaleString("es-AR")}`;

    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleFormSubmit = async (formData: OrderFormData) => {
    setOrderData(formData);
    setShowOrderForm(false);
    setIsProcessing(true);

    const whatsAppUrl = getWhatsAppUrl(formData);
    let orderSaved = false;

    try {
      const deliveryAddress = formData.isPickup
        ? `RETIRO EN LOCAL - ${formData.postalCode}`
        : `${formData.address} - ${formData.postalCode}`;

      const orderId = crypto.randomUUID();

      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          customer_name: formData.name,
          delivery_address: deliveryAddress,
          total_amount: totalPrice + formData.shippingCost,
          status: "pendiente" as const,
          notes: formData.isPickup ? "Retiro en local" : "Envío a domicilio",
        });

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: orderId,
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

      for (const item of items) {
        const stockProdId = getStockProductId(item.productId, item.variant);
        await supabase.rpc("decrement_stock", {
          p_product_id: stockProdId,
          p_size: item.size,
          p_quantity: item.quantity,
        });
      }

      orderSaved = true;
      console.log("Order saved successfully:", orderId);
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Hubo un problema guardando el pedido. Intentá de nuevo o contactanos por WhatsApp.");
      setIsProcessing(false);
      return;
    }

    if (orderSaved) {
      toast.success("¡Pedido registrado! Redirigiendo a WhatsApp...");
      const link = document.createElement("a");
      link.href = whatsAppUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      clearCart();
      setIsProcessing(false);
      onClose();
    }
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
                {items.map((item) => {
                  const itemStock = isLoadingStock ? 99 : getItemStock(item);
                  return (
                    <div
                      key={`${item.productId}-${item.size}-${item.variant || ""}`}
                      className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {getSizeLabel(item.size)}
                        </p>
                        <p className="text-primary font-bold">
                          ${(item.price * item.quantity).toLocaleString("es-AR")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1, item.variant)}
                          className="p-2 hover:bg-muted rounded-full transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-4 h-4 text-foreground" />
                        </button>
                        <span className="w-8 text-center font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity < itemStock) {
                              updateQuantity(item.productId, item.size, item.quantity + 1, item.variant);
                            } else {
                              toast.error(`Solo hay ${itemStock} unidades disponibles`);
                            }
                          }}
                          disabled={item.quantity >= itemStock}
                          className="p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-30"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-4 h-4 text-foreground" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.size, item.variant)}
                        className="p-2 hover:bg-destructive/10 rounded-full transition-colors text-destructive"
                        aria-label="Eliminar item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
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

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[70] flex items-center justify-center animate-fade-in">
          <div className="bg-card rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-xs mx-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-foreground font-display text-xl font-bold text-center">
              Preparando tu pedido... 🌯
            </p>
            <p className="text-muted-foreground text-sm text-center">
              Ya casi te mandamos a WhatsApp
            </p>
          </div>
        </div>
      )}

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
