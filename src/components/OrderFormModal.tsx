import { useState } from "react";
import { X, MapPin, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
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
}

const OrderFormModal = ({ isOpen, onClose, onSubmit }: OrderFormModalProps) => {
  const [formData, setFormData] = useState<Omit<OrderFormData, 'isPickup'>>({
    name: "",
    address: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<Partial<OrderFormData>>({});

  const isPickupRequired = formData.postalCode.trim() !== "" && 
    !siteConfig.allowedPostalCodes.includes(formData.postalCode.trim());

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!isPickupRequired && !formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "El código postal es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        isPickup: isPickupRequired
      });
    } else {
      toast.error("Por favor completá todos los campos correctamente");
    }
  };

  const handleChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Address - only required for delivery */}
          {!isPickupRequired && (
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
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>
          )}

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-foreground font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Código Postal
            </Label>
            <Input
              id="postalCode"
              type="text"
              placeholder="1640"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className={errors.postalCode ? "border-destructive" : ""}
            />
            {errors.postalCode && (
              <p className="text-sm text-destructive">{errors.postalCode}</p>
            )}
            {isPickupRequired ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ Estás muy lejos de nuestra fábrica de burritos
                </p>
                <p className="text-xs text-amber-700 mt-1">
                El envio a tu domicilio cuesta $2000, o retiralos sin cargo en Olivos.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Realizamos entregas en zona norte de Buenos Aires y CABA
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            {isPickupRequired ? "Continuar (Retiro en local)" : "Continuar al pedido"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrderFormModal;
