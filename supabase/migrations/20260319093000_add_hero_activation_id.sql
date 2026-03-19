-- Store HeroSMS activationId to correlate incoming SMS webhooks

ALTER TABLE public.purchased_numbers
  ADD COLUMN IF NOT EXISTS activation_id TEXT;

-- Ensure uniqueness per activationId (nullable for legacy/pseudo rows)
CREATE UNIQUE INDEX IF NOT EXISTS purchased_numbers_activation_id_unique
  ON public.purchased_numbers (activation_id)
  WHERE activation_id IS NOT NULL;

