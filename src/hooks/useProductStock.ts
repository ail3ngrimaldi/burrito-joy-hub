import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProductSize } from "@/config/site";

interface StockItem {
  product_id: string;
  size: string;
  quantity: number;
}

export interface ProductStockMap {
  [productId: string]: {
    [size in ProductSize]?: number;
  };
}

export const useProductStock = () => {
  return useQuery({
    queryKey: ["product-stock"],
    queryFn: async (): Promise<ProductStockMap> => {
      const { data, error } = await supabase
        .from("product_stock")
        .select("product_id, size, quantity");

      if (error) {
        console.error("Error fetching stock:", error);
        throw error;
      }

      // Transform array to nested object for easy lookup
      const stockMap: ProductStockMap = {};
      (data as StockItem[]).forEach((item) => {
        if (!stockMap[item.product_id]) {
          stockMap[item.product_id] = {};
        }
        stockMap[item.product_id][item.size as ProductSize] = item.quantity;
      });

      return stockMap;
    },
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

export const getStockForProduct = (
  stockMap: ProductStockMap | undefined,
  productId: string,
  size: ProductSize
): number => {
  if (!stockMap || !stockMap[productId]) return 0;
  return stockMap[productId][size] ?? 0;
};

export const hasAnyStock = (
  stockMap: ProductStockMap | undefined,
  productId: string
): boolean => {
  if (!stockMap || !stockMap[productId]) return false;
  const sizes = stockMap[productId];
  return Object.values(sizes).some((qty) => qty !== undefined && qty > 0);
};
