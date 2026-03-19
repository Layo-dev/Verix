import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient } from "../_shared/supabase.ts";
import { paystackVerify } from "../_shared/paystack.ts";
import { getPricing } from "../_shared/pricing.ts";
import { provisionNumber } from "../_shared/provider.ts";

type VerifyBody = { reference?: string };

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const supabase = createSupabaseAdminClient(req);
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) return json(401, { error: "Unauthorized" });

    const body = (await req.json().catch(() => ({}))) as VerifyBody;
    const reference = body.reference?.trim();
    if (!reference) return json(400, { error: "reference is required" });

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id,user_id,country_code,service_id,amount_kobo,currency,status,provider_status,purchased_number_id,paystack_reference")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (orderErr) throw new Error(orderErr.message);
    if (!order) return json(404, { error: "Order not found for reference" });
    if (order.user_id !== authData.user.id) return json(403, { error: "Forbidden" });

    // Idempotency: if already assigned, return success.
    if (order.status === "paid" && order.provider_status === "assigned" && order.purchased_number_id) {
      return json(200, { ok: true, orderId: order.id, purchasedNumberId: order.purchased_number_id });
    }

    const tx = await paystackVerify(reference);
    if (tx.status !== "success") {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return json(402, { error: "Payment not successful" });
    }

    // Validate metadata if present
    const meta = tx.metadata;
    if (meta && isRecord(meta)) {
      const metaOrderId = meta.order_id;
      const metaUserId = meta.user_id;
      if (typeof metaOrderId === "string" && metaOrderId !== order.id) {
        return json(400, { error: "Reference does not match order" });
      }
      if (typeof metaUserId === "string" && metaUserId !== authData.user.id) {
        return json(400, { error: "Reference does not match user" });
      }
    }

    // Validate amount/currency based on server-side pricing for the stored selection
    const pricing = getPricing({ countryCode: order.country_code, serviceId: order.service_id });
    if (order.currency !== pricing.currency) return json(400, { error: "Currency mismatch" });
    if (order.amount_kobo !== pricing.amountKobo) return json(400, { error: "Amount mismatch" });
    if (tx.currency !== pricing.currency) return json(400, { error: "Paystack currency mismatch" });
    if (tx.amount !== pricing.amountKobo) return json(400, { error: "Paystack amount mismatch" });

    // Mark paid (idempotent)
    const { error: paidErr } = await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", order.id);
    if (paidErr) throw new Error(paidErr.message);

    // If number already created earlier but order wasn't fully updated, return it
    if (order.purchased_number_id) {
      await supabase.from("orders").update({ provider_status: "assigned" }).eq("id", order.id);
      return json(200, { ok: true, orderId: order.id, purchasedNumberId: order.purchased_number_id });
    }

    const provisioned = await provisionNumber(
      {
        countryCode: order.country_code,
        serviceId: order.service_id,
        userId: authData.user.id,
        orderId: order.id,
      },
      {
        serviceName: pricing.service.service_name,
        countryName: pricing.country.country_name,
        countryFlag: pricing.country.country_flag,
      }
    );

    // Create purchased_numbers row (this is what Inbox reads)
    const { data: purchased, error: pnErr } = await supabase
      .from("purchased_numbers")
      .insert({
        user_id: authData.user.id,
        phone_number: provisioned.phone_number,
        activation_id: provisioned.activation_id,
        country_code: order.country_code,
        country_flag: provisioned.country_flag,
        service_name: provisioned.service_name,
        status: "active",
        expires_at: provisioned.expires_at,
      })
      .select("id")
      .single();

    if (pnErr || !purchased) throw new Error(pnErr?.message ?? "Failed to create purchased number");

    const { error: updErr } = await supabase
      .from("orders")
      .update({ provider_status: "assigned", purchased_number_id: purchased.id })
      .eq("id", order.id);
    if (updErr) throw new Error(updErr.message);

    return json(200, { ok: true, orderId: order.id, purchasedNumberId: purchased.id });
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});

