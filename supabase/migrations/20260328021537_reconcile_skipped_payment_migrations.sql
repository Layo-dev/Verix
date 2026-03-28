-- Reconciles DDL from migrations that never ran on this database:
--   20260319090000_payments_orders.sql — base `orders` was created/altered by 20260319113311 instead,
--     so enums and some constraints differ; we only apply missing pieces below.
--   20260319093000_add_hero_activation_id.sql — adds HeroSMS correlation for webhooks.
--
-- Safe to run on fresh DBs: every step is IF NOT EXISTS / idempotent where possible.

-- From 20260319093000: activation_id for purchased_numbers (paystack-verify / hero-webhook-sms)
ALTER TABLE public.purchased_numbers
  ADD COLUMN IF NOT EXISTS activation_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS purchased_numbers_activation_id_unique
  ON public.purchased_numbers (activation_id)
  WHERE activation_id IS NOT NULL;

-- From 20260319090000: orders.updated_at + trigger (not added by 20260319113311)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE public.orders SET updated_at = COALESCE(created_at, now())
WHERE updated_at IS NULL;

-- Match 20260319090000: user_id required (no NULLs expected)
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'orders'
      AND t.tgname = 'update_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_orders_updated_at
      BEFORE UPDATE ON public.orders
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
