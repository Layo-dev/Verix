
-- Secure realtime.messages so users can only subscribe to channels for their own data
-- The topic column contains the channel identifier
CREATE POLICY "Users can only receive own realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.purchased_numbers pn
    WHERE pn.user_id = auth.uid()
      AND topic LIKE '%' || pn.id::text || '%'
  )
);
