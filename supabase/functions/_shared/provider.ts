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

  const heroCountries = Array.isArray(countriesResp) ? countriesResp : [];
  const heroServices = Array.isArray(servicesResp?.services)
    ? servicesResp.services
    : [];

  const uiCountryNorm = normalize(ui.countryName);
  const uiServiceNorm = normalize(ui.serviceName);

  const heroCountry =
    heroCountries.find((c: any) => {
      const eng = typeof c?.eng === "string" ? normalize(c.eng) : "";
      const rus = typeof c?.rus === "string" ? normalize(c.rus) : "";
      return (
        eng === uiCountryNorm ||
        rus === uiCountryNorm ||
        eng.includes(uiCountryNorm) ||
        rus.includes(uiCountryNorm)
      );
    }) ?? null;

  const heroService =
    heroServices.find((s: any) => {
      const nameNorm = typeof s?.name === "string" ? normalize(s.name) : "";
      return (
        nameNorm === uiServiceNorm ||
        nameNorm.includes(uiServiceNorm) ||
        uiServiceNorm.includes(nameNorm)
      );
    }) ?? null;

  if (!heroCountry?.id || !heroService?.code) {
    throw new Error(
      `HeroSMS mapping failed for country="${ui.countryName}" and service="${ui.serviceName}"`
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

