
-- Enum for number status
CREATE TYPE public.number_status AS ENUM ('active', 'expiring', 'expired');

-- Purchased numbers table
CREATE TABLE public.purchased_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  country_code TEXT NOT NULL,
  country_flag TEXT NOT NULL DEFAULT '🌍',
  service_name TEXT NOT NULL,
  status number_status NOT NULL DEFAULT 'active',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.purchased_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own numbers"
  ON public.purchased_numbers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- SMS messages table
CREATE TABLE public.sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number_id UUID REFERENCES public.purchased_numbers(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL,
  body TEXT NOT NULL,
  otp_code TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sms"
  ON public.sms_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.purchased_numbers
      WHERE purchased_numbers.id = sms_messages.number_id
      AND purchased_numbers.user_id = auth.uid()
    )
  );

-- Enable realtime on sms_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.sms_messages;
