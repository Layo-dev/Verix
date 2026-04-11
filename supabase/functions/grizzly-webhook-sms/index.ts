import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient } from "../_shared/supabase.ts";

type GrizzlyWebhookPayload = {
  activationId?: string | number;
  service?: string;
  text?: string;
  code?: string | null;
  country?: number;
  receivedAt?: string;
};

function ok() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function extractOtp(text: string): string | null {
  const match = text.match(/\b(\d{4,8})\b/);
  return match ? match[1] : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  // Always return 200 to Grizzly SMS to prevent endless retries.

  try {
    const payload = (await req.json().catch(() => ({}))) as GrizzlyWebhookPayload;

    const activationId = payload.activationId?.toString().trim();
    const smsBody = payload.text?.toString().trim() ?? "";
    const sender = payload.service?.toString().trim() ?? "GrizzlySMS";
    const providedCode = payload.code?.toString().trim() || null;
    const receivedAtRaw = payload.receivedAt?.toString();
    const receivedAt =
      receivedAtRaw && !Number.isNaN(Date.parse(receivedAtRaw))
        ? new Date(receivedAtRaw).toISOString()
        : new Date().toISOString();

    if (!activationId) {
      console.warn("grizzly-webhook-sms: missing activationId", JSON.stringify(payload).slice(0, 200));
      return ok();
    }
    if (!smsBody) {
      console.warn("grizzly-webhook-sms: missing text", JSON.stringify(payload).slice(0, 200));
      return ok();
    }

    const supabase = createSupabaseAdminClient();

    const { data: purchased, error: lookupError } = await supabase
      .from("purchased_numbers")
      .select("id")
      .eq("activation_id", activationId)
      .maybeSingle();

    if (lookupError) {
      console.error("grizzly-webhook-sms: DB lookup error", lookupError.message);
      return ok();
    }
    if (!purchased) {
      console.warn(`grizzly-webhook-sms: activationId ${activationId} not found in purchased_numbers`);
      return ok();
    }

    const otpCode = providedCode ?? extractOtp(smsBody);

    const { data: existing } = await supabase
      .from("sms_messages")
      .select("id")
      .eq("number_id", purchased.id)
      .eq("body", smsBody)
      .limit(1)
      .maybeSingle();

    if (existing) {
      console.log(`grizzly-webhook-sms: duplicate for activationId=${activationId}, skipping`);
      return ok();
    }

    const { error: insertError } = await supabase.from("sms_messages").insert({
      number_id: purchased.id,
      sender,
      body: smsBody,
      otp_code: otpCode,
      received_at: receivedAt,
    });

    if (insertError) {
      console.error("grizzly-webhook-sms: insert error", insertError.message);
      return ok();
    }

    const { error: statusErr } = await supabase
      .from("purchased_numbers")
      .update({ otp_status: "received" })
      .eq("id", purchased.id);

    if (statusErr) {
      console.error("grizzly-webhook-sms: failed to update otp_status", statusErr.message);
    }

    console.log(
      `grizzly-webhook-sms: stored SMS activationId=${activationId} numberId=${purchased.id} otp=${otpCode ?? "(none)"}`
    );
    return ok();
  } catch (e) {
    console.error("grizzly-webhook-sms: unhandled error", e instanceof Error ? e.message : e);
    return ok();
  }
});
