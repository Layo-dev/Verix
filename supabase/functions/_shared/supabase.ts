import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Service-role client for PostgREST. Do not set Authorization to the user's JWT:
 * that forces the `authenticated` role and RLS blocks updates that have no policy
 * (e.g. updating `orders.paystack_reference` after insert).
 */
export function createSupabaseAdminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getBearerToken(req: Request): string | undefined {
  const h = req.headers.get("Authorization");
  if (!h?.startsWith("Bearer ")) return undefined;
  const t = h.slice(7).trim();
  return t || undefined;
}
