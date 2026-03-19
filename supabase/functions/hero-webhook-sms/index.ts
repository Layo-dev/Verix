import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient } from "../_shared/supabase.ts";

type HeroWebhookPayload = {
  activationId?: string;
  service?: string;
  text?: string;
  country?: number;
  receivedAt?: string;
  code?: string | null;
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

  try {
    const payload = (await req.json().catch(() => ({}))) as HeroWebhookPayload;

    const activationId = payload.activationId?.toString().trim();
    const sender = payload.service?.toString().trim() ?? "HeroSMS";
    const body = payload.text?.toString().trim() ?? "";
    const receivedAtRaw = payload.receivedAt?.toString();
    const receivedAt =
      receivedAtRaw && !Number.isNaN(Date.parse(receivedAtRaw))
        ? new Date(receivedAtRaw).toISOString()
        : new Date().toISOString();

    const providedOtp = payload.code?.toString().trim() || null;

    if (!activationId || !body) {
      return json(400, { error: "Missing required fields" });
    }

    const supabase = createSupabaseAdminClient(req);

    const { data: purchased, error: lookupError } = await supabase
      .from("purchased_numbers")
      .select("id")
      .maybeSingle();

    if (lookupError) {
      throw new Error(lookupError.message);
    }

    if (!purchased) {
      // Activation not found; acknowledge to avoid retries.
      return json(204, { ok: false, reason: "number_not_found" });
    }

    // Hero expects sms-incoming payload to include code optionally.
    // If code is not provided, extract a best-effort OTP from the SMS text.
    const otpCode = providedOtp ? providedOtp : extractOtp(body);

    // Best-effort idempotency: Hero may retry webhook delivery.
    const { data: existing } = await supabase
      .from("sms_messages")
      .select("id,otp_code")
      .eq("number_id", purchased.id)
      .eq("body", body)
      .order("received_at", { ascending: false })
      .limit(1);

    const existingFirst = Array.isArray(existing) ? existing[0] : null;
    if (existingFirst) {
      const existingOtp = typeof existingFirst.otp_code === "string" ? existingFirst.otp_code : null;
      const nextOtp = otpCode ? otpCode : null;
      if (existingOtp === nextOtp) {
        return json(200, { ok: true, deduped: true });
      }
    }

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

