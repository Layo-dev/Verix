import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient } from "../_shared/supabase.ts";

type HeroWebhookPayload = {
  to?: string;
  from?: string;
  text?: string;
  otp_code?: string | null;
  timestamp?: string;
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function extractOtp(body: string): string | null {
  const match = body.match(/\b(\d{4,8})\b/);
  return match ? match[1] : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const secret = Deno.env.get("HERO_WEBHOOK_SECRET");
  if (secret) {
    const provided = req.headers.get("x-hero-webhook-secret");
    if (!provided || provided !== secret) {
      return json(401, { error: "Unauthorized" });
    }
  }

  try {
    const payload = (await req.json().catch(() => ({}))) as HeroWebhookPayload;

    const phoneNumber = payload.to?.trim();
    const sender = payload.from?.trim() ?? "unknown";
    const body = payload.text?.trim() ?? "";
    const receivedAt =
      payload.timestamp && !Number.isNaN(Date.parse(payload.timestamp))
        ? new Date(payload.timestamp).toISOString()
        : new Date().toISOString();

    if (!phoneNumber || !body) {
      return json(400, { error: "Missing required fields" });
    }

    const supabase = createSupabaseAdminClient(req);

    const { data: purchased, error: lookupError } = await supabase
      .from("purchased_numbers")
      .select("id")
      .eq("phone_number", phoneNumber)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (lookupError) {
      throw new Error(lookupError.message);
    }

    if (!purchased) {
      // Number not found; acknowledge to avoid retries, but log for debugging.
      return json(204, { ok: false, reason: "number_not_found" });
    }

    const otpCode =
      payload.otp_code && payload.otp_code.trim().length
        ? payload.otp_code.trim()
        : extractOtp(body);

    const { error: insertError } = await supabase.from("sms_messages").insert({
      number_id: purchased.id,
      sender,
      body,
      otp_code: otpCode,
      received_at: receivedAt,
    });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return json(200, { ok: true });
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});

