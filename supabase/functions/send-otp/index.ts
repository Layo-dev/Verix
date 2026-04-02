import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createSupabaseAdminClient();

    // Delete old OTPs for this email
    await supabase.from("email_otps").delete().eq("email", email);

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Store OTP with 10-min expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { error: insertErr } = await supabase.from("email_otps").insert({
      email,
      otp,
      expires_at: expiresAt,
    });

    if (insertErr) {
      console.error("Failed to insert OTP:", insertErr);
      return new Response(JSON.stringify({ error: "Failed to send OTP" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send OTP via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (RESEND_API_KEY && LOVABLE_API_KEY) {
      const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
      await fetch(`${GATEWAY_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: "VerixSMS <onboarding@resend.dev>",
          to: [email],
          subject: "Your VerixSMS verification code",
          html: `<div style="font-family:sans-serif;padding:20px;"><h2>Your verification code</h2><p style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:20px 0;">${otp}</p><p>This code expires in 10 minutes.</p></div>`,
        }),
      });
    } else {
      console.log(`OTP for ${email}: ${otp} (email sending not configured)`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-otp error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
