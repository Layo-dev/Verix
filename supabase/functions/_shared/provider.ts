type ProvisionInput = {
  countryCode: string;
  serviceId: string;
  userId: string;
  orderId: string;
};

export type ProvisionedNumber = {
  activation_id: string;
  phone_number: string;
  expires_at: string; // ISO
  service_name: string;
  country_flag: string;
};

function getProviderConfig() {
  const baseUrl = Deno.env.get("PROVIDER_BASE_URL");
  const apiKey = Deno.env.get("PROVIDER_API_KEY");
  return { baseUrl, apiKey };
}

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function pseudoNumber(countryCode: string) {
  const suffix = Math.floor(1000000 + Math.random() * 9000000);
  return `+${countryCode}-${suffix}`;
}

/**
 * External provider integration point.
 *
 * Expected provider API shape (recommended):
 * - POST /numbers/provision
 *   body: { countryCode, serviceId, userId, orderId }
 *   returns: { phone_number, expires_at, service_name, country_flag }
 */
export async function provisionNumber(
  input: ProvisionInput,
  ui: { serviceName: string; countryName: string; countryFlag: string }
): Promise<ProvisionedNumber> {
  const { baseUrl, apiKey } = getProviderConfig();

  // Fallback so the payment flow is testable before provider credentials are added.
  if (!baseUrl || !apiKey) {
    return {
      activation_id: `dummy_${input.orderId}`,
      phone_number: pseudoNumber(input.countryCode),
      expires_at: addDays(7),
      service_name: ui.serviceName,
      country_flag: ui.countryFlag,
    };
  }

  const trimmed = baseUrl.replace(/\/+$/, "");
  const handlerApiUrl = trimmed.includes("handler_api.php")
    ? trimmed
    : `${trimmed}/stubs/handler_api.php`;

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

  /** HeroSMS / SMS-activate style APIs often use `id` / `code`, or omit them when rows are keyed by id / short code. */
  function unwrapKeyedRecords(raw: unknown): unknown[] {
    if (Array.isArray(raw)) return raw;
    if (typeof raw !== "object" || raw === null) return [];
    return Object.entries(raw as Record<string, unknown>).map(([key, value]) => {
      if (value === null || typeof value !== "object") return value;
      const row = { ...(value as Record<string, unknown>) };
      if (row.id === undefined && row.country_id === undefined && /^\d+$/.test(key)) {
        row.id = Number(key);
      }
      if (row.code === undefined && row.service === undefined && key.length > 0 && !/^\d+$/.test(key)) {
        row.code = key;
      }
      return row;
    });
  }

  function countryRecordId(c: Record<string, unknown>): string | null {
    const candidates = [
      c.id,
      c.country_id,
      c.countryId,
      c.CountryId,
    ];
    for (const v of candidates) {
      if (v === undefined || v === null || v === "") continue;
      return String(v);
    }
    return null;
  }

  function serviceRecordCode(s: Record<string, unknown>): string | null {
    const candidates = [s.code, s.service, s.service_code, s.short_name, s.shortName];
    for (const v of candidates) {
      if (v === undefined || v === null || v === "") continue;
      return String(v);
    }
    return null;
  }

  const getJson = async (url: string) => {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HeroSMS request failed: ${res.status} ${text}`);
    }
    return (await res.json()) as any;
  };

  const apiKeyParam = `api_key=${encodeURIComponent(apiKey)}`;

  // Resolve hero numeric countryId + service code by matching names.
  const countriesResp = await getJson(
    `${handlerApiUrl}?action=getCountries&${apiKeyParam}`
  );
  const servicesResp = await getJson(
    `${handlerApiUrl}?action=getServicesList&${apiKeyParam}`
  );

  const rawCountriesPayload =
    (countriesResp as Record<string, unknown> | undefined)?.countries ??
    (countriesResp as Record<string, unknown> | undefined)?.data ??
    countriesResp;

  const heroCountries = unwrapKeyedRecords(
    Array.isArray(rawCountriesPayload)
      ? rawCountriesPayload
      : typeof rawCountriesPayload === "object" && rawCountriesPayload !== null
        ? rawCountriesPayload
        : []
  );

  const rawServices =
    (servicesResp as Record<string, unknown> | undefined)?.services ??
    (servicesResp as Record<string, unknown> | undefined)?.data ??
    servicesResp;
  const heroServices = unwrapKeyedRecords(
    Array.isArray(rawServices)
      ? rawServices
      : typeof rawServices === "object" && rawServices !== null
        ? rawServices
        : []
  );

  const uiCountryNorm = normalize(ui.countryName);
  const uiServiceNorm = normalize(ui.serviceName);

  console.log("HeroSMS countries sample:", JSON.stringify(heroCountries.slice(0, 3)).slice(0, 500));
  console.log("HeroSMS services sample:", JSON.stringify(heroServices.slice(0, 5)).slice(0, 500));
  console.log(`Searching for country="${ui.countryName}" (norm="${uiCountryNorm}"), service="${ui.serviceName}" (norm="${uiServiceNorm}")`);

  const heroCountry =
    heroCountries.find((c: unknown) => {
      if (c === null || typeof c !== "object") return false;
      const fields = Object.values(c as Record<string, unknown>).filter(
        (v): v is string => typeof v === "string"
      );
      return fields.some((f) => {
        const norm = normalize(f);
        return norm === uiCountryNorm || norm.includes(uiCountryNorm) || uiCountryNorm.includes(norm);
      });
    }) ?? null;

  const heroService =
    heroServices.find((s: unknown) => {
      if (s === null || typeof s !== "object") return false;
      const fields = Object.values(s as Record<string, unknown>).filter(
        (v): v is string => typeof v === "string"
      );
      return fields.some((f) => {
        const norm = normalize(f);
        return norm === uiServiceNorm || norm.includes(uiServiceNorm) || uiServiceNorm.includes(norm);
      });
    }) ?? null;

  const countryRec =
    heroCountry !== null && typeof heroCountry === "object"
      ? (heroCountry as Record<string, unknown>)
      : null;
  const serviceRec =
    heroService !== null && typeof heroService === "object"
      ? (heroService as Record<string, unknown>)
      : null;

  const resolvedCountryId = countryRec ? countryRecordId(countryRec) : null;
  const resolvedServiceCode = serviceRec ? serviceRecordCode(serviceRec) : null;

  console.log("Matched country:", heroCountry ? JSON.stringify(heroCountry).slice(0, 200) : "NONE");
  console.log("Matched service:", heroService ? JSON.stringify(heroService).slice(0, 200) : "NONE");
  console.log(
    `Resolved countryId=${resolvedCountryId ?? "MISSING"} serviceCode=${resolvedServiceCode ?? "MISSING"}`
  );

  if (!resolvedCountryId || !resolvedServiceCode) {
    throw new Error(
      `HeroSMS mapping failed for country="${ui.countryName}" and service="${ui.serviceName}". ` +
        `Country match: ${!!heroCountry}, Service match: ${!!heroService}. ` +
        `Could not read country id or service code from API rows (expected id/country_id or code/service). ` +
        `countryKeys=${countryRec ? Object.keys(countryRec).join(",") : "n/a"} ` +
        `serviceKeys=${serviceRec ? Object.keys(serviceRec).join(",") : "n/a"}`
    );
  }

  // HeroSMS uses SMS-Activate–compatible handler_api. Per that protocol, getNumber/getNumberV2 accept an
  // optional `url` query parameter: HTTPS endpoint to notify when an SMS arrives for this activation.
  const activationWebhookUrl = Deno.env.get("HERO_SMS_WEBHOOK_URL")?.trim();

  let getNumberQuery =
    `action=getNumberV2&${apiKeyParam}&service=${encodeURIComponent(resolvedServiceCode)}` +
    `&country=${encodeURIComponent(resolvedCountryId)}`;
  if (activationWebhookUrl) {
    getNumberQuery += `&url=${encodeURIComponent(activationWebhookUrl)}`;
  }

  const numberResp = await getJson(`${handlerApiUrl}?${getNumberQuery}`);

  const activationId = String(numberResp.activationId ?? "");
  const phoneNumber = String(numberResp.phoneNumber ?? "");
  const activationEndTime = numberResp.activationEndTime as
    | string
    | undefined;

  if (!activationId || !phoneNumber) {
    throw new Error(
      `HeroSMS getNumberV2 returned unexpected payload: ${JSON.stringify(numberResp).slice(
        0,
        300
      )}`
    );
  }

  const expiresAt = activationEndTime
    ? new Date(activationEndTime).toISOString()
    : addDays(7);

  const phoneWithPlus = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+${phoneNumber}`;

  return {
    activation_id: activationId,
    phone_number: phoneWithPlus,
    expires_at: expiresAt,
    service_name: ui.serviceName,
    country_flag: ui.countryFlag,
  };
}

