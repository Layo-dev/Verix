-- Orders/payment tracking for Paystack purchase flow

-- Enum for order status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'failed', 'cancelled');
  END IF;
END$$;

-- Enum for provider status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_status') THEN
    CREATE TYPE public.provider_status AS ENUM ('pending', 'assigned', 'failed');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  country_code TEXT NOT NULL,
  service_id TEXT NOT NULL,
  amount_kobo INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status public.order_status NOT NULL DEFAULT 'pending',
  paystack_reference TEXT UNIQUE,
  provider_status public.provider_status NOT NULL DEFAULT 'pending',
  purchased_number_id UUID REFERENCES public.purchased_numbers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Optional: allow users to create their own pending orders (frontend may not use this directly)
CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- No client-side updates/deletes; edge functions will use service role.

-- Updated_at trigger using existing helper (created in earlier migration)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_orders_updated_at
      BEFORE UPDATE ON public.orders
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

