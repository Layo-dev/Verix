import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient, getBearerToken } from "../_shared/supabase.ts";
import { getPricing } from "../_shared/pricing.ts";
import { paystackInitialize } from "../_shared/paystack.ts";

type InitBody = {
  /** Wallet top-up: amount in USD (1–500). Requires `type: "topup"`. */
  type?: string;
  amount?: number;
  /** Number purchase via Paystack (legacy): */
  countryCode?: string;
  serviceId?: string;
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function getUsdToNgnRate(): number {
  const raw = Deno.env.get("USD_TO_NGN");
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1600;
}

function createReference(orderId: string) {
  return `verix_${orderId.replaceAll("-", "")}_${Date.now()}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const supabase = createSupabaseAdminClient();
    const accessToken = getBearerToken(req);
    if (!accessToken) return json(401, { error: "Unauthorized" });

    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authData?.user) return json(401, { error: "Unauthorized" });
    const user = authData.user;

    const body = (await req.json().catch(() => ({}))) as InitBody;

    // --- Wallet top-up (UI sends USD; Paystack charges NGN) ---
    if (body.type === "topup") {
      const amountUsd = Number(body.amount);
      if (!amountUsd || !Number.isFinite(amountUsd) || amountUsd < 1 || amountUsd > 500) {
        return json(400, { error: "Top-up amount (USD) must be between 1 and 500" });
      }
      const rate = getUsdToNgnRate();
      const amountNgn = Math.round(amountUsd * rate);
      if (amountNgn < 100) {
        return json(400, {
          error: "Top-up is too small after conversion (Paystack requires at least ₦100)",
        });
      }
      const amountKobo = amountNgn * 100;
      const reference = `verix_topup_${user.id.replaceAll("-", "").slice(0, 12)}_${Date.now()}`;

      const { error: txErr } = await supabase.from("wallet_transactions").insert({
        user_id: user.id,
        type: "credit",
        amount: amountUsd,
        status: "pending",
        reference,
        description: `Wallet top-up — $${amountUsd.toFixed(2)} (≈ ₦${amountNgn.toLocaleString()})`,
      });

      if (txErr) throw new Error(`Failed to create transaction: ${txErr.message}`);

      const email = user.email ?? "user@example.com";
      const init = await paystackInitialize({
        email,
        amount: amountKobo,
        currency: "NGN",
        reference,
        metadata: {
          user_id: user.id,
          type: "wallet_topup",
          amount_usd: amountUsd,
          amount_ngn: amountNgn,
        },
      });

      return json(200, {
        type: "topup",
        reference: init.reference,
        authorization_url: init.authorization_url,
        access_code: init.access_code,
        currency: "NGN",
        amount_usd: amountUsd,
        amount_ngn: amountNgn,
        amount_kobo: amountKobo,
      });
    }

    // --- Pay for virtual number (order) ---
    const countryCode = body.countryCode?.trim();
    const serviceId = body.serviceId?.trim();
    if (!countryCode || !serviceId) {
      return json(400, { error: "countryCode and serviceId are required (or use type: \"topup\" with amount in USD)" });
    }

    const pricing = getPricing({ countryCode, serviceId });

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        country_code: countryCode,
        service_id: serviceId,
        amount_kobo: pricing.amountKobo,
        currency: pricing.currency,
        status: "pending",
        provider_status: "pending",
      })
      .select("id")
      .single();

    if (orderErr || !order) throw new Error(orderErr?.message ?? "Failed to create order");

    const reference = createReference(order.id);
    const email = user.email ?? "user@example.com";

    const init = await paystackInitialize({
      email,
      amount: pricing.amountKobo,
      currency: pricing.currency,
      reference,
      metadata: {
        order_id: order.id,
        user_id: user.id,
        country_code: countryCode,
        service_id: serviceId,
      },
    });

    const { error: updErr } = await supabase
      .from("orders")
      .update({ paystack_reference: init.reference })
      .eq("id", order.id);
    if (updErr) throw new Error(updErr.message);

    return json(200, {
      type: "number_purchase",
      orderId: order.id,
      reference: init.reference,
      authorization_url: init.authorization_url,
      access_code: init.access_code,
      currency: pricing.currency,
      amount_kobo: pricing.amountKobo,
    });
  } catch (e) {
    console.error("paystack-init error:", e);
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});
