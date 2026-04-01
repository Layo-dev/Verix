import { paystackRefund } from "./paystack.ts";

type SupabaseClient = ReturnType<typeof import("jsr:@supabase/supabase-js@2").createClient>;

export async function processRefund(
  supabase: SupabaseClient,
  orderId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  // Fetch the order
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("id, status, refunded, paystack_reference, purchased_number_id")
    .eq("id", orderId)
    .single();

  if (orderErr || !order) {
    return { success: false, error: orderErr?.message ?? "Order not found" };
  }

  // Guard: already refunded
  if (order.refunded) {
    return { success: false, error: "Order already refunded" };
  }

  // Guard: must be paid
  if (order.status !== "paid") {
    return { success: false, error: `Cannot refund order with status '${order.status}'` };
  }

  // Guard: check if OTP was received (do not refund if SMS exists)
  if (order.purchased_number_id) {
    const { data: sms } = await supabase
      .from("sms_messages")
      .select("id")
      .eq("number_id", order.purchased_number_id)
      .limit(1);

    if (sms && sms.length > 0) {
      return { success: false, error: "OTP was received — refund denied" };
    }
  }

  // Call Paystack refund API
  if (!order.paystack_reference) {
    return { success: false, error: "No Paystack reference for refund" };
  }

  try {
    await paystackRefund(order.paystack_reference);
  } catch (e) {
    console.error("Paystack refund API error:", e);
    return { success: false, error: e instanceof Error ? e.message : "Refund API failed" };
  }

  // Mark order as refunded
  const { error: updErr } = await supabase
    .from("orders")
    .update({
      refunded: true,
      refunded_at: new Date().toISOString(),
      refund_reason: reason,
      status: "refunded",
    })
    .eq("id", orderId);

  if (updErr) {
    console.error("Failed to update order after refund:", updErr);
    return { success: false, error: updErr.message };
  }

  // Expire purchased number if it exists
  if (order.purchased_number_id) {
    await supabase
      .from("purchased_numbers")
      .update({ status: "expired" })
      .eq("id", order.purchased_number_id);
  }

  return { success: true };
}
