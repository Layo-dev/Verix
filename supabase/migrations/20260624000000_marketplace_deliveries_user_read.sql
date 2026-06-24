CREATE POLICY "Users can read own marketplace deliveries"
  ON public.marketplace_deliveries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_orders
      WHERE marketplace_orders.id = marketplace_deliveries.order_id
        AND marketplace_orders.user_id = auth.uid()
    )
  );
