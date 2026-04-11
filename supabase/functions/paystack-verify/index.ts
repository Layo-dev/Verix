import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient, getBearerToken } from "../_shared/supabase.ts";
import { paystackVerify } from "../_shared/paystack.ts";
import { getPricing } from "../_shared/pricing.ts";
import { provisionNumber } from "../_shared/provider.ts";
import { processRefund } from "../_shared/refund.ts";

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

function getUsdToNgnRate(): number {
  const raw = Deno.env.get("USD_TO_NGN");
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1600;
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

    const body = (await req.json().catch(() => ({}))) as VerifyBody;
    const reference = body.reference?.trim();
    if (!reference) return json(400, { error: "reference is required" });

    // --- Wallet top-up (reference on wallet_transactions) ---
    const { data: pendingTx, error: wErr } = await supabase
      .from("wallet_transactions")
      .select("id, user_id, amount, status, type")
      .eq("reference", reference)
      .maybeSingle();

    if (wErr) throw new Error(wErr.message);

    if (pendingTx) {
      if (pendingTx.user_id !== authData.user.id) return json(403, { error: "Forbidden" });

      if (pendingTx.type === "credit" && pendingTx.status === "completed") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("balance")
          .eq("id", authData.user.id)
          .single();
        return json(200, {
          ok: true,
          type: "topup",
          alreadyProcessed: true,
          balance: profile?.balance ?? 0,
        });
      }

      if (pendingTx.type === "credit" && pendingTx.status === "pending") {
        const amountUsd = Number(pendingTx.amount);
        if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
          return json(400, { error: "Invalid pending transaction amount" });
        }

        const paystackTx = await paystackVerify(reference);
        if (paystackTx.status !== "success") {
          await supabase.from("wallet_transactions").update({ status: "failed" }).eq("id", pendingTx.id);
          return json(402, { error: "Payment was not successful" });
        }

        const meta = paystackTx.metadata;
        if (meta && isRecord(meta)) {
          const metaUserId = meta.user_id;
          if (typeof metaUserId === "string" && metaUserId !== authData.user.id) {
            return json(400, { error: "Reference does not match user" });
          }
        }

        const currency = String(paystackTx.currency || "").toUpperCase();
        if (currency !== "NGN") return json(400, { error: "Unsupported payment currency" });

        const paidKobo = Number(paystackTx.amount);
        if (!Number.isFinite(paidKobo)) return json(400, { error: "Invalid paid amount" });

        const rate = getUsdToNgnRate();
        const expectedNgn = Math.round(amountUsd * rate);
        const expectedKobo = expectedNgn * 100;
        if (paidKobo !== expectedKobo) {
          return json(400, { error: "Payment amount mismatch" });
        }

        const { data: newBalance, error: creditErr } = await supabase.rpc("credit_wallet_balance", {
          p_user_id: authData.user.id,
          p_amount: amountUsd,
        });
        if (creditErr) throw new Error(`Failed to credit balance: ${creditErr.message}`);

        const { error: completeErr } = await supabase
          .from("wallet_transactions")
          .update({ status: "completed" })
          .eq("id", pendingTx.id);
        if (completeErr) throw new Error(completeErr.message);

        return json(200, { ok: true, type: "topup", credited: amountUsd, balance: newBalance });
      }

      return json(400, { error: "Invalid wallet transaction state" });
    }

    // --- Virtual number purchase (order) ---
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select(
        "id,user_id,country_code,service_id,amount_kobo,currency,status,provider_status,purchased_number_id,paystack_reference"
      )
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (orderErr) throw new Error(orderErr.message);
    if (!order) return json(404, { error: "Transaction not found for reference" });
    if (order.user_id !== authData.user.id) return json(403, { error: "Forbidden" });

    if (order.status === "paid" && order.provider_status === "assigned" && order.purchased_number_id) {
      return json(200, { ok: true, orderId: order.id, purchasedNumberId: order.purchased_number_id });
    }

    const tx = await paystackVerify(reference);
    if (tx.status !== "success") {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return json(402, { error: "Payment not successful" });
    }

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

    const pricing = getPricing({ countryCode: order.country_code, serviceId: order.service_id });
    if (tx.currency !== order.currency) {
      return json(400, { error: "Paystack currency mismatch" });
    }
    const paidKobo = Number(tx.amount);
    if (!Number.isFinite(paidKobo) || paidKobo !== order.amount_kobo) {
      return json(400, { error: "Paystack amount mismatch" });
    }

    const { error: paidErr } = await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);
    if (paidErr) throw new Error(paidErr.message);

    if (order.purchased_number_id) {
      await supabase.from("orders").update({ provider_status: "assigned" }).eq("id", order.id);
      return json(200, { ok: true, orderId: order.id, purchasedNumberId: order.purchased_number_id });
    }

    let provisioned;
    try {
      provisioned = await provisionNumber(
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
    } catch (provErr) {
      console.error("Provisioning failed, initiating refund:", provErr);
      const refundResult = await processRefund(supabase, order.id, "Number provisioning failed");
      console.log("Refund result:", refundResult);
      return json(200, {
        ok: false,
        refunded: refundResult.success,
        error: provErr instanceof Error ? provErr.message : "Provisioning failed",
      });
    }

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
    console.error("paystack-verify error:", e);
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});
