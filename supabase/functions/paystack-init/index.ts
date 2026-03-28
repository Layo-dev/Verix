import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient, getBearerToken } from "../_shared/supabase.ts";
import { getPricing } from "../_shared/pricing.ts";
import { paystackInitialize } from "../_shared/paystack.ts";

type InitBody = {
  countryCode?: string;
  serviceId?: string;
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function createReference(orderId: string) {
  // Paystack reference must be unique; keep deterministic prefix for debugging.
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

    const body = (await req.json().catch(() => ({}))) as InitBody;
    const countryCode = body.countryCode?.trim();
    const serviceId = body.serviceId?.trim();
    if (!countryCode || !serviceId) return json(400, { error: "countryCode and serviceId are required" });

    const pricing = getPricing({ countryCode, serviceId });

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: authData.user.id,
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
    const email = authData.user.email ?? "user@example.com";

    const init = await paystackInitialize({
      email,
      amount: pricing.amountKobo,
      currency: pricing.currency,
      reference,
      metadata: {
        order_id: order.id,
        user_id: authData.user.id,
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
      orderId: order.id,
      reference: init.reference,
      authorization_url: init.authorization_url,
      access_code: init.access_code,
      currency: pricing.currency,
      amount_kobo: pricing.amountKobo,
    });
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});

