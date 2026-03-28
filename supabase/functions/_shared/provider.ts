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

  const heroCountries = Array.isArray(countriesResp)
    ? countriesResp
    : typeof countriesResp === "object" && countriesResp !== null
      ? Object.values(countriesResp)
      : [];

  const rawServices = servicesResp?.services ?? servicesResp;
  const heroServices = Array.isArray(rawServices)
    ? rawServices
    : typeof rawServices === "object" && rawServices !== null
      ? Object.values(rawServices)
      : [];

  const uiCountryNorm = normalize(ui.countryName);
  const uiServiceNorm = normalize(ui.serviceName);

  console.log("HeroSMS countries sample:", JSON.stringify(heroCountries.slice(0, 3)).slice(0, 500));
  console.log("HeroSMS services sample:", JSON.stringify(heroServices.slice(0, 5)).slice(0, 500));
  console.log(`Searching for country="${ui.countryName}" (norm="${uiCountryNorm}"), service="${ui.serviceName}" (norm="${uiServiceNorm}")`);

  const heroCountry =
    heroCountries.find((c: any) => {
      const fields = Object.values(c).filter((v): v is string => typeof v === "string");
      return fields.some((f) => {
        const norm = normalize(f);
        return norm === uiCountryNorm || norm.includes(uiCountryNorm) || uiCountryNorm.includes(norm);
      });
    }) ?? null;

  const heroService =
    heroServices.find((s: any) => {
      const fields = Object.values(s).filter((v): v is string => typeof v === "string");
      return fields.some((f) => {
        const norm = normalize(f);
        return norm === uiServiceNorm || norm.includes(uiServiceNorm) || uiServiceNorm.includes(norm);
      });
    }) ?? null;

  console.log("Matched country:", heroCountry ? JSON.stringify(heroCountry).slice(0, 200) : "NONE");
  console.log("Matched service:", heroService ? JSON.stringify(heroService).slice(0, 200) : "NONE");

  if (!heroCountry?.id || !heroService?.code) {
    throw new Error(
      `HeroSMS mapping failed for country="${ui.countryName}" and service="${ui.serviceName}". ` +
      `Country match: ${!!heroCountry}, Service match: ${!!heroService}`
    );
  }

  const numberResp = await getJson(
    `${handlerApiUrl}?action=getNumberV2&${apiKeyParam}&service=${encodeURIComponent(
      heroService.code
    )}&country=${encodeURIComponent(heroCountry.id)}`
  );

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

