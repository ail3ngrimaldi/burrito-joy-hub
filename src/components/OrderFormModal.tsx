import { useState, useMemo } from "react";
import { X, MapPin, User, Mail, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getShippingCost } from "@/config/site";
import { toast } from "sonner";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => void;
}

export interface OrderFormData {
  name: string;
  address: string;
  postalCode: string;
  isPickup: boolean;
  shippingCost: number;
}

const OrderFormModal = ({ isOpen, onClose, onSubmit }: OrderFormModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    postalCode: "",
  });
  const [wantsPickup, setWantsPickup] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = useMemo(() => {
    const cp = formData.postalCode.trim();
    if (!cp) return null;
    return getShippingCost(cp);
  }, [formData.postalCode]);

  const isFreeDelivery = shipping?.free === true;
  const hasPaidDelivery = shipping !== null && !shipping.free && 'price' in shipping && shipping.price !== null;
  const isUnknownZone = shipping !== null && !shipping.free && 'price' in shipping && shipping.price === null;
  const shippingPrice = hasPaidDelivery ? (shipping as { free: false; price: number; zoneName: string }).price : 0;

  const needsAddress = isFreeDelivery || (hasPaidDelivery && !wantsPickup);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (needsAddress && !formData.address.trim()) newErrors.address = "La dirección es requerida";
    if (!formData.postalCode.trim()) newErrors.postalCode = "El código postal es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const isPickup = isUnknownZone || wantsPickup;
      onSubmit({
        ...formData,
        isPickup,
        shippingCost: isPickup || isFreeDelivery ? 0 : shippingPrice,
      });
    } else {
      toast.error("Por favor completá todos los campos correctamente");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "postalCode") setWantsPickup(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-[60] animate-fade-in flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground">
            Datos de entrega 📍
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Nombre completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Postal Code or Locality */}
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-foreground font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Código Postal o Localidad
            </Label>
            <Input
              id="postalCode"
              type="text"
              placeholder="Ej: 1640 o Belgrano"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className={errors.postalCode ? "border-destructive" : ""}
            />
            {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}

            {/* Shipping info banners */}
            {isFreeDelivery && (
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-primary font-medium flex items-center gap-1">
                  <Truck className="w-4 h-4" /> ¡Envío gratis a tu zona!
                </p>
              </div>
            )}

            {hasPaidDelivery && (
              <div className="p-3 bg-accent/30 border border-accent rounded-lg space-y-2">
                <p className="text-sm text-foreground font-medium flex items-center gap-1">
                  <Truck className="w-4 h-4" /> Envío a tu zona: ${shippingPrice.toLocaleString("es-AR")}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={!wantsPickup ? "default" : "outline"}
                    onClick={() => setWantsPickup(false)}
                    className="flex-1 text-xs"
                  >
                    Envío (${shippingPrice.toLocaleString("es-AR")})
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={wantsPickup ? "default" : "outline"}
                    onClick={() => setWantsPickup(true)}
                    className="flex-1 text-xs"
                  >
                    Retiro gratis
                  </Button>
                </div>
              </div>
            )}

            {isUnknownZone && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Tu zona no tiene envío configurado aún
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                  Podés retirar sin cargo en Olivos, o consultanos por WhatsApp para coordinar envío.
                </p>
              </div>
            )}

            {!shipping && (
              <p className="text-xs text-muted-foreground">
                Ingresá tu código postal para ver las opciones de envío
              </p>
            )}
          </div>

          {/* Address - only when delivering */}
          {needsAddress && (
            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección completa
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Av. Libertador 1234, Piso 5, Depto A"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            {(isUnknownZone || wantsPickup) ? "Continuar (Retiro en local)" : "Continuar al pedido"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrderFormModal;
