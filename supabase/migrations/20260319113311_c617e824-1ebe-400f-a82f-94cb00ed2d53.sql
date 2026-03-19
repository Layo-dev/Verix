-- Add missing columns to orders table for payment flow
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'NGN',
  ADD COLUMN IF NOT EXISTS provider_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS purchased_number_id uuid REFERENCES public.purchased_numbers(id);

-- Rename columns to match edge function expectations
ALTER TABLE public.orders RENAME COLUMN country TO country_code;
ALTER TABLE public.orders RENAME COLUMN service TO service_id;
ALTER TABLE public.orders RENAME COLUMN amount TO amount_kobo;

-- RLS: users can read their own orders
CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- RLS: users can insert own orders
CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);