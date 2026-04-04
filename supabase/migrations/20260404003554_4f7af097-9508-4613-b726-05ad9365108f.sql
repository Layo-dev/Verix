CREATE POLICY "Authenticated users can read country pricing"
ON public.country_pricing FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read service pricing"
ON public.service_pricing FOR SELECT TO authenticated USING (true);