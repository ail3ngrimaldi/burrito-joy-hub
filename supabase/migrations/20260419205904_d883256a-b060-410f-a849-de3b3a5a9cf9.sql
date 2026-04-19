
-- Update Bren's order: Bolognesa M from 10000 to 11500 (current price)
UPDATE public.order_items
SET unit_price = 11500
WHERE order_id = '8a552cc8-2732-43f8-870a-5d77d8af7d2c'
  AND product_id = 'bolognesa'
  AND size = 'M';

-- Recalculate and update the order total based on the corrected items
UPDATE public.orders o
SET total_amount = sub.new_total
FROM (
  SELECT order_id, SUM(unit_price * quantity)::int AS new_total
  FROM public.order_items
  WHERE order_id = '8a552cc8-2732-43f8-870a-5d77d8af7d2c'
  GROUP BY order_id
) sub
WHERE o.id = sub.order_id;
