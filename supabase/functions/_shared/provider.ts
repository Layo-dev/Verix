type ProvisionInput = {
  countryCode: string;
  serviceId: string;
  userId: string;
  orderId: string;
};

export type ProvisionedNumber = {
  phone_number: string;
  expires_at: string; // ISO
  service_name: string;
  country_flag: string;
};

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
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
  ui: { serviceName: string; countryFlag: string }
): Promise<ProvisionedNumber> {
  const { baseUrl, apiKey } = getProviderConfig();

  // Fallback so the payment flow is testable before provider credentials are added.
  if (!baseUrl || !apiKey) {
    return {
      phone_number: pseudoNumber(input.countryCode),
      expires_at: addDays(7),
      service_name: ui.serviceName,
      country_flag: ui.countryFlag,
    };
  }

  const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/number/request`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countryCode: input.countryCode,
      serviceId: input.serviceId,
      userId: input.userId,
      orderId: input.orderId,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Provider provision failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as {
    phone_number?: string;
    number?: string;
    expires_at?: string;
    ttl_minutes?: number;
    service_name?: string;
    country_flag?: string;
  };

  const phoneNumber = json.phone_number ?? json.number;
  if (!phoneNumber) {
    throw new Error("Provider response missing phone number");
  }

  let expiresAt = json.expires_at;
  if (!expiresAt) {
    const ttlMinutes = typeof json.ttl_minutes === "number" && json.ttl_minutes > 0
      ? json.ttl_minutes
      : 60 * 24 * 7; // default 7 days
    expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  }

  return {
    phone_number: phoneNumber,
    expires_at: expiresAt,
    service_name: json.service_name ?? ui.serviceName,
    country_flag: json.country_flag ?? ui.countryFlag,
  };
}

