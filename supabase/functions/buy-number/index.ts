import { corsHeaders } from "../_shared/cors.ts";
import { createSupabaseAdminClient, getBearerToken } from "../_shared/supabase.ts";

type BuyBody = { countryCode?: string; serviceId?: string };

type ProviderKind = "hero" | "grizzlysms";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function buildHandlerApiUrl(rawBase: string): string {
  const trimmed = rawBase.replace(/\/+$/, "");
  return trimmed.includes("handler_api.php") ? trimmed : `${trimmed}/stubs/handler_api.php`;
}

function providerErrorMessage(providerLabel: string, code: string): string {
  const hints: Record<string, string> = {
    NO_BALANCE: `Add credits to your ${providerLabel} account.`,
    NO_NUMBERS: "No numbers available for this country/service - try another combination.",
    BAD_SERVICE: "Service code not recognised - check hero_code in service_pricing.",
    BAD_KEY: "Check your API key secret for this provider.",
    NO_KEY: "Provider API key is missing.",
    BANNED: "Your provider account is temporarily banned.",
    ERROR_SQL: "Provider internal server error - try again.",
  };
  return `${providerLabel}: ${code}${hints[code] ? ` - ${hints[code]}` : ""}`;
}

async function handlerGet(
  url: string,
  methodLabel: string,
  providerLabel: string
): Promise<unknown> {
  console.log(`${providerLabel} ${methodLabel}:`, url.replace(/api_key=[^&]+/, "api_key=REDACTED"));
  const res = await fetch(url, { method: "GET" });
  const text = await res.text().catch(() => "");
  const t = text.trim();
  console.log(`${providerLabel} ${methodLabel} response: HTTP ${res.status} body=${t.slice(0, 300)}`);

  if (!res.ok) {
    try {
      const parsed = JSON.parse(t) as Record<string, unknown>;
      if (typeof parsed.title === "string") throw new Error(providerErrorMessage(providerLabel, parsed.title));
    } catch (e) {
      if (!(e instanceof SyntaxError)) throw e;
    }
    throw new Error(`${providerLabel} ${methodLabel} failed: HTTP ${res.status} ${t.slice(0, 200)}`);
  }
  if (!t) throw new Error(`${providerLabel} ${methodLabel} returned empty body`);

  const firstLine = (t.split(/\r?\n/)[0] ?? t).trim();
  if (/^[A-Z][A-Z0-9_]*$/.test(firstLine)) throw new Error(providerErrorMessage(providerLabel, firstLine));
  if (firstLine.startsWith("BANNED:") || firstLine.startsWith("WRONG_MAX_PRICE:")) {
    throw new Error(`${providerLabel}: ${firstLine}`);
  }

  try {
    const parsed = JSON.parse(t);
    if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
      const title = (parsed as Record<string, unknown>).title;
      if (typeof title === "string" && /^[A-Z][A-Z0-9_]*$/.test(title)) {
        throw new Error(providerErrorMessage(providerLabel, title));
      }
    }
    return parsed;
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(`${providerLabel} ${methodLabel} unexpected response: ${t.slice(0, 500)}`);
    }
    throw e;
  }
}

async function resolveProvider(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  countryCode: string,
  serviceId: string
): Promise<ProviderKind> {
  const { data, error } = await supabase
    .from("provider_routes")
    .select("provider, priority, created_at")
    .eq("is_active", true)
    .eq("country_code", countryCode)
    .eq("service_id", serviceId)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("resolveProvider:", error.message);
    return "hero";
  }
  if (!data?.provider) return "hero";
  const p = String(data.provider).trim().toLowerCase();
  if (p === "grizzlysms") return "grizzlysms";
  return "hero";
}

function getProviderRuntime(kind: ProviderKind): {
  handlerApiUrl: string;
  apiKey: string | undefined;
  webhookUrl: string | undefined;
  label: string;
} {
  if (kind === "grizzlysms") {
    const rawBase =
      Deno.env.get("GRIZZLY_BASE_URL")?.trim() ||
      "https://api.grizzlysms.com/stubs/handler_api.php";
    return {
      handlerApiUrl: buildHandlerApiUrl(rawBase),
      apiKey: Deno.env.get("GRIZZLY_API_KEY")?.trim(),
      webhookUrl: Deno.env.get("GRIZZLY_SMS_WEBHOOK_URL")?.trim(),
      label: "GrizzlySMS",
    };
  }
  const base = Deno.env.get("PROVIDER_BASE_URL")?.trim();
  return {
    handlerApiUrl: base ? buildHandlerApiUrl(base) : "",
    apiKey: Deno.env.get("PROVIDER_API_KEY")?.trim(),
    webhookUrl: Deno.env.get("HERO_SMS_WEBHOOK_URL")?.trim(),
    label: "HeroSMS",
  };
}

function shouldUseDummy(kind: ProviderKind, rt: ReturnType<typeof getProviderRuntime>): boolean {
  if (!rt.apiKey) return true;
  if (kind === "hero" && !rt.handlerApiUrl) return true;
  return false;
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
    const userId = authData.user.id;

    const body = (await req.json().catch(() => ({}))) as BuyBody;
    const countryCode = body.countryCode?.trim().toUpperCase();
    const serviceId = body.serviceId?.trim().toLowerCase();
    if (!countryCode || !serviceId) {
      return json(400, { error: "countryCode and serviceId are required" });
    }

    const [countryResult, serviceResult] = await Promise.all([
      supabase
        .from("country_pricing")
        .select("country_code, country_name, country_flag, price_usd, hero_id")
        .eq("country_code", countryCode)
        .maybeSingle(),
      supabase
        .from("service_pricing")
        .select("service_id, service_name, price_usd, hero_code")
        .eq("service_id", serviceId)
        .maybeSingle(),
    ]);

    if (countryResult.error) throw new Error(countryResult.error.message);
    if (serviceResult.error) throw new Error(serviceResult.error.message);
    if (!countryResult.data) return json(400, { error: `Unsupported country: ${countryCode}` });
    if (!serviceResult.data) return json(400, { error: `Unsupported service: ${serviceId}` });

    const country = countryResult.data;
    const service = serviceResult.data;

    if (country.hero_id === null || country.hero_id === undefined) {
      return json(400, { error: `hero_id not configured for ${countryCode}` });
    }
    if (!service.hero_code) {
      return json(400, { error: `hero_code not configured for ${serviceId}` });
    }

    const routeProvider = await resolveProvider(supabase, countryCode, serviceId);

    const totalUsd = Number(country.price_usd) + Number(service.price_usd);
    const priceUsd = Math.round(totalUsd * 10000) / 10000;

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    if (profileErr || !profile) return json(404, { error: "User profile not found" });
    if (Number(profile.balance) < priceUsd) {
      return json(402, {
        error: "Insufficient wallet balance",
        currency: "USD",
        balance: Number(profile.balance),
        required: priceUsd,
        shortfall: priceUsd - Number(profile.balance),
      });
    }

    const { data: deducted, error: deductErr } = await supabase.rpc("deduct_wallet_balance", {
      p_user_id: userId,
      p_amount: priceUsd,
    });

    if (deductErr) throw new Error(`Balance deduction failed: ${deductErr.message}`);
    if (!deducted) return json(402, { error: "Insufficient wallet balance", currency: "USD" });

    const rt = getProviderRuntime(routeProvider);
    const dummy = shouldUseDummy(routeProvider, rt);

    let provisioned: { activation_id: string; phone_number: string; expires_at: string };

    if (dummy) {
      provisioned = {
        activation_id: `dummy_${userId}_${Date.now()}`,
        phone_number: `+${countryCode}-${Math.floor(1000000 + Math.random() * 9000000)}`,
        expires_at: addDays(7),
      };
    } else {
      const apiKeyParam = `api_key=${encodeURIComponent(rt.apiKey!)}`;

      const balanceRaw = await fetch(`${rt.handlerApiUrl}?action=getBalance&${apiKeyParam}`)
        .then((r) => r.text())
        .catch(() => "");
      const balanceMatch = balanceRaw.trim().match(/^ACCESS_BALANCE:([\d.]+)$/);
      if (balanceMatch) {
        const provBalance = parseFloat(balanceMatch[1]);
        if (provBalance <= 0) {
          await supabase.rpc("credit_wallet_balance", { p_user_id: userId, p_amount: priceUsd });
          throw new Error(providerErrorMessage(rt.label, "NO_BALANCE"));
        }
      }

      let query =
        `action=getNumberV2&${apiKeyParam}` +
        `&service=${encodeURIComponent(service.hero_code)}` +
        `&country=${encodeURIComponent(country.hero_id)}` +
        `&maxPrice=${encodeURIComponent(String(priceUsd))}`;
      if (rt.webhookUrl) query += `&url=${encodeURIComponent(rt.webhookUrl)}`;

      let numberResp: Record<string, unknown>;
      try {
        numberResp = (await handlerGet(
          `${rt.handlerApiUrl}?${query}`,
          "getNumberV2",
          rt.label
        )) as Record<string, unknown>;
      } catch (provErr) {
        await supabase.rpc("credit_wallet_balance", { p_user_id: userId, p_amount: priceUsd });
        throw provErr;
      }

      const activationId = String(numberResp.activationId ?? "");
      const phoneNumber = String(numberResp.phoneNumber ?? "");
      const activationEndTime = numberResp.activationEndTime as string | undefined;

      if (!activationId || !phoneNumber) {
        await supabase.rpc("credit_wallet_balance", { p_user_id: userId, p_amount: priceUsd });
        throw new Error(
          `${rt.label} getNumberV2 unexpected payload: ${JSON.stringify(numberResp).slice(0, 300)}`
        );
      }

      provisioned = {
        activation_id: activationId,
        phone_number: phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`,
        expires_at: activationEndTime ? new Date(activationEndTime).toISOString() : addDays(7),
      };
    }

    const { data: purchased, error: pnErr } = await supabase
      .from("purchased_numbers")
      .insert({
        user_id: userId,
        phone_number: provisioned.phone_number,
        activation_id: provisioned.activation_id,
        country_code: countryCode,
        country_flag: country.country_flag,
        service_name: service.service_name,
        status: "active",
        expires_at: provisioned.expires_at,
        price_usd: priceUsd,
      })
      .select("id")
      .single();

    if (pnErr || !purchased) {
      await supabase.rpc("credit_wallet_balance", { p_user_id: userId, p_amount: priceUsd });
      throw new Error(pnErr?.message ?? "Failed to create purchased number");
    }

    await supabase.from("wallet_transactions").insert({
      user_id: userId,
      type: "debit",
      amount: priceUsd,
      status: "completed",
      description: `Number purchase - ${service.service_name} (${country.country_flag} ${country.country_name})`,
    });

    const { data: updatedProfile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    return json(200, {
      ok: true,
      provider: routeProvider,
      purchasedNumberId: purchased.id,
      phoneNumber: provisioned.phone_number,
      activationId: provisioned.activation_id,
      expiresAt: provisioned.expires_at,
      serviceName: service.service_name,
      countryFlag: country.country_flag,
      currency: "USD",
      charged: priceUsd,
      balance: updatedProfile?.balance ?? 0,
    });
  } catch (e) {
    console.error("buy-number error:", e);
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});
