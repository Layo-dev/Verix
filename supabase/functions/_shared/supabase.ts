import { createClient } from "jsr:@supabase/supabase-js@2";

export function createSupabaseAdminClient(req: Request) {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  // Forward the user's JWT so we can identify the caller,
  // while still using service role to bypass RLS for secure server writes.
  const authHeader = req.headers.get("Authorization") ?? "";
  return createClient(url, serviceRoleKey, {
    global: { headers: { Authorization: authHeader } },
  });
}

