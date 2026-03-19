export type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer?: { email?: string };
    metadata?: Record<string, unknown>;
  };
};

function getPaystackSecretKey() {
  const key = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!key) throw new Error("Missing PAYSTACK_SECRET_KEY");
  return key;
}

function getPaystackBaseUrl() {
  return Deno.env.get("PAYSTACK_BASE_URL") ?? "https://api.paystack.co";
}

export async function paystackInitialize(args: {
  email: string;
  amount: number; // kobo
  currency?: string;
  reference: string;
  metadata: Record<string, unknown>;
}) {
  const res = await fetch(`${getPaystackBaseUrl()}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: args.email,
      amount: args.amount,
      currency: args.currency,
      reference: args.reference,
      metadata: args.metadata,
    }),
  });

  const json = (await res.json()) as PaystackInitializeResponse;
  if (!res.ok || !json.status || !json.data) {
    throw new Error(`Paystack initialize failed: ${json.message ?? res.statusText}`);
  }
  return json.data;
}

export async function paystackVerify(reference: string) {
  const res = await fetch(
    `${getPaystackBaseUrl()}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getPaystackSecretKey()}`,
      },
    }
  );
  const json = (await res.json()) as PaystackVerifyResponse;
  if (!res.ok || !json.status || !json.data) {
    throw new Error(`Paystack verify failed: ${json.message ?? res.statusText}`);
  }
  return json.data;
}

