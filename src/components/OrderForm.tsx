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

const OrderForm = ({ isOpen, onClose, quantities }: OrderFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  if (!isOpen) return null;

  const selectedProducts = products.filter((p) => quantities[p.id] > 0);
  const totalPrice = selectedProducts.reduce(
    (sum, p) => sum + p.price * quantities[p.id],
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Completá los datos",
        description: "Necesitamos tu nombre y teléfono para coordinar el pedido.",
        variant: "destructive",
      });
      return;
    }

    // Build WhatsApp message
    const orderLines = selectedProducts
      .map((p) => `• ${quantities[p.id]}x ${p.name} ($${(p.price * quantities[p.id]).toLocaleString("es-AR")})`)
      .join("\n");

    const message = `¡Hola! 🌯 Quiero hacer un pedido:

${orderLines}

*Total: $${totalPrice.toLocaleString("es-AR")}*

Mis datos:
📛 Nombre: ${name}
📱 Teléfono: ${phone}

¡Gracias!`;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/5491134323195?text=${encodeURIComponent(message)}`;
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
          <div className="flex justify-between mt-4 pt-4 border-t border-border">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-display text-xl font-bold text-primary">
              ${totalPrice.toLocaleString("es-AR")}
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
            <Label htmlFor="phone" className="text-foreground">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="11 1234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-background"
            />
          </div>

          <Button type="submit" variant="whatsapp" size="lg" className="w-full">
            <MessageCircle className="w-5 h-5" />
            Enviar pedido por WhatsApp
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Te contactamos para coordinar entrega y pago 💬
          </p>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
