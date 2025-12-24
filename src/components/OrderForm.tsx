import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  quantities: Record<string, number>;
}

const products = [
  { id: "bolognesa", name: "Bolognesa", price: 3500 },
  { id: "cesar", name: "César", price: 3500 },
  { id: "bondiola", name: "Bondiola Desmechada", price: 4000 },
];

const allowedPostalCodes = [
  { code: "1606", name: "Carapachay" },
  { code: "1602", name: "Florida" },
  { code: "1604", name: "Florida Oeste" },
  { code: "1637", name: "La Lucila" },
  { code: "1605", name: "Munro" },
  { code: "1636", name: "Olivos" },
  { code: "1638", name: "Vicente López" },
  { code: "1603", name: "Villa Martelli" },
  { code: "1641", name: "Acassuso" },
  { code: "1640", name: "Martinez" },
  { code: "1642", name: "San Isidro" },
];

const OrderForm = ({ isOpen, onClose, quantities }: OrderFormProps) => {
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [comments, setComments] = useState("");
  const { toast } = useToast();

  if (!isOpen) return null;

  const selectedProducts = products.filter((p) => quantities[p.id] > 0);
  const totalPrice = selectedProducts.reduce(
    (sum, p) => sum + p.price * quantities[p.id],
    0
  );

  const deliveryPrice = 2000;
  const totalWithDelivery = totalPrice + deliveryPrice;

  const isValidPostalCode = allowedPostalCodes.some(
    (pc) => pc.code.toLowerCase() === postalCode.trim().toLowerCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Completá tu nombre",
        description: "Necesitamos saber cómo te llamás.",
        variant: "destructive",
      });
      return;
    }

    if (!postalCode.trim()) {
      toast({
        title: "Completá tu código postal",
        description: "Necesitamos tu CP para verificar si llegamos a tu zona.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPostalCode) {
      toast({
        title: "Zona no disponible",
        description: "Por ahora no llegamos a tu zona. ¡Pero estamos expandiéndonos pronto!",
        variant: "destructive",
      });
      return;
    }

    // Build WhatsApp message
    const orderLines = selectedProducts
      .map((p) => `• ${quantities[p.id]}x ${p.name} ($${(p.price * quantities[p.id]).toLocaleString("es-AR")})`)
      .join("\n");

    const commentsSection = comments.trim() 
      ? `\n💬 Comentarios: ${comments}` 
      : "";

    const message = `¡Hola! 🌯 Quiero hacer un pedido:

${orderLines}

*Subtotal: $${totalPrice.toLocaleString("es-AR")}*
*Envío: $${deliveryPrice.toLocaleString("es-AR")}*
*Total: $${totalWithDelivery.toLocaleString("es-AR")}*

Mis datos:
📛 Nombre: ${name}
📍 Código Postal: ${postalCode.toUpperCase()}${commentsSection}

¡Gracias!`;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/5491124003293?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "¡Pedido enviado!",
      description: "Te redirigimos a WhatsApp para confirmar tu pedido.",
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
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
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Order summary */}
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-foreground mb-3">Resumen</h3>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {quantities[product.id]}x {product.name}
                </span>
                <span className="font-medium text-foreground">
                  ${(product.price * quantities[product.id]).toLocaleString("es-AR")}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-border text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span className="font-medium text-foreground">
              ${deliveryPrice.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-border">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-display text-xl font-bold text-primary">
              ${totalWithDelivery.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nombre</Label>
            <Input
              id="name"
              placeholder="¿Cómo te llamás?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-foreground">Código Postal</Label>
            <Input
              id="postalCode"
              placeholder="Ej: B1636"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className={`bg-background ${postalCode && !isValidPostalCode ? "border-destructive" : ""}`}
            />
            {postalCode && !isValidPostalCode && (
              <p className="text-xs text-destructive">
                Por ahora solo llegamos a: {allowedPostalCodes.map(pc => pc.name).join(", ")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments" className="text-foreground">Comentarios adicionales (opcional)</Label>
            <textarea
              id="comments"
              placeholder="Ej: No puedo comer picante, soy alérgico a X ingrediente..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              rows={3}
            />
          </div>

          <Button type="submit" variant="whatsapp" size="lg" className="w-full">
            <MessageCircle className="w-5 h-5" />
            Enviar pedido por WhatsApp
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Coordinamos por WhatsApp la entrega y el pago 💬
          </p>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
