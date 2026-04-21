import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  productId: string;
  productName: string;
  size: "M" | "L";
  weight: string;
  price: number;
  quantity: number;
  variant?: string;
  variantLabel?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, size: string, variant?: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  markCartConverted: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SESSION_KEY = "lbd_cart_session_id";

const getOrCreateSessionId = (): string => {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const sessionIdRef = useRef<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  // Debounced sync of cart state to abandoned_carts table
  useEffect(() => {
    if (!sessionIdRef.current) return;
    // Skip the initial empty state on mount
    if (items.length === 0 && !hasTrackedRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      try {
        await supabase.from("abandoned_carts").upsert(
          {
            session_id: sessionIdRef.current,
            items: items as any,
            total_items: totalItems,
            total_amount: totalPrice,
            last_activity: new Date().toISOString(),
            converted: false,
          },
          { onConflict: "session_id" }
        );
        hasTrackedRef.current = true;
      } catch (err) {
        console.error("Cart tracking failed:", err);
      }
    }, 2000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.size === newItem.size && item.variant === newItem.variant
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { ...newItem, quantity }];
    });
  };

  const removeItem = (productId: string, size: string, variant?: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size && item.variant === variant))
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size, variant);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size && item.variant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const markCartConverted = async () => {
    if (!sessionIdRef.current || !hasTrackedRef.current) return;
    try {
      await supabase
        .from("abandoned_carts")
        .update({ converted: true, last_activity: new Date().toISOString() })
        .eq("session_id", sessionIdRef.current);
      // Reset session so the next cart starts fresh
      const newId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, newId);
      sessionIdRef.current = newId;
      hasTrackedRef.current = false;
    } catch (err) {
      console.error("Failed to mark cart converted:", err);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        markCartConverted,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
