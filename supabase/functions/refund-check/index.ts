import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient } from "../_shared/supabase.ts";
import { processRefund } from "../_shared/refund.ts";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  try {
    const supabase = createSupabaseAdminClient();

    // Find purchased numbers waiting for OTP for more than 5 minutes with no SMS
    const twentyMinAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString();

    const { data: staleNumbers, error: queryErr } = await supabase
      .from("purchased_numbers")
      .select("id, user_id")
      .eq("otp_status", "waiting")
      .eq("status", "active")
      .lt("created_at", fiveMinAgo);

    if (queryErr) throw new Error(queryErr.message);
    if (!staleNumbers || staleNumbers.length === 0) {
      return json(200, { processed: 0 });
    }

    let refunded = 0;

    for (const num of staleNumbers) {
      // Check if any SMS was received
      const { data: sms } = await supabase
        .from("sms_messages")
        .select("id")
        .eq("number_id", num.id)
        .limit(1);

      if (sms && sms.length > 0) {
        // OTP received — update status, no refund
        await supabase
          .from("purchased_numbers")
          .update({ otp_status: "received" })
          .eq("id", num.id);
        continue;
      }

      // Find the order for this purchased number
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("purchased_number_id", num.id)
        .eq("status", "paid")
        .maybeSingle();

      if (order) {
        const result = await processRefund(supabase, order.id, "No OTP received within timeout");
        if (result.success) {
          refunded++;
        } else {
          console.warn(`Refund skipped for order ${order.id}: ${result.error}`);
        }
      }

      // Mark as timeout regardless
      await supabase
        .from("purchased_numbers")
        .update({ otp_status: "timeout" })
        .eq("id", num.id);
    }

    return json(200, { processed: staleNumbers.length, refunded });
  } catch (e) {
    console.error("refund-check error:", e);
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});
