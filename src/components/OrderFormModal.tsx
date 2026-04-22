import { useState, useMemo } from "react";
import { X, MapPin, User, Mail, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getShippingCost } from "@/config/site";
import { useI18n } from "@/contexts/I18nContext";
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
  const { t } = useI18n();
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
    if (!formData.name.trim()) newErrors.name = t("order.error.name");
    if (needsAddress && !formData.address.trim()) newErrors.address = t("order.error.address");
    if (!formData.postalCode.trim()) newErrors.postalCode = t("order.error.postal");
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
      toast.error(t("order.error.complete"));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "postalCode") setWantsPickup(false);
  };

  if (!isOpen) return null;

  const priceFmt = (p: number) => p.toLocaleString("es-AR");

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
            {t("order.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label={t("cart.close")}
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
              {t("order.name")}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={t("order.namePlaceholder")}
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
              {t("order.postal")}
            </Label>
            <Input
              id="postalCode"
              type="text"
              placeholder={t("order.postalPlaceholder")}
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className={errors.postalCode ? "border-destructive" : ""}
            />
            {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}

            {/* Shipping info banners */}
            {isFreeDelivery && (
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-primary font-medium flex items-center gap-1">
                  <Truck className="w-4 h-4" /> {t("order.freeShipping")}
                </p>
              </div>
            )}

            {hasPaidDelivery && (
              <div className="p-3 bg-accent/30 border border-accent rounded-lg space-y-2">
                <p className="text-sm text-foreground font-medium flex items-center gap-1">
                  <Truck className="w-4 h-4" /> {t("order.shippingTo", { price: priceFmt(shippingPrice) })}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={!wantsPickup ? "default" : "outline"}
                    onClick={() => setWantsPickup(false)}
                    className="flex-1 text-xs"
                  >
                    {t("order.delivery", { price: priceFmt(shippingPrice) })}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={wantsPickup ? "default" : "outline"}
                    onClick={() => setWantsPickup(true)}
                    className="flex-1 text-xs"
                  >
                    {t("order.pickupFree")}
                  </Button>
                </div>
              </div>
            )}

            {isUnknownZone && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  {t("order.unknownZone")}
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                  {t("order.unknownZoneHint")}
                </p>
              </div>
            )}

            {!shipping && (
              <p className="text-xs text-muted-foreground">
                {t("order.enterPostal")}
              </p>
            )}
          </div>

          {/* Address - only when delivering */}
          {needsAddress && (
            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t("order.address")}
              </Label>
              <Input
                id="address"
                type="text"
                placeholder={t("order.addressPlaceholder")}
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            {(isUnknownZone || wantsPickup) ? t("order.continuePickup") : t("order.continue")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrderFormModal;
