CREATE POLICY "No authenticated read of OTPs"
ON public.email_otps FOR SELECT TO authenticated
USING (false);