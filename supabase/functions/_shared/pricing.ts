type CountryPricing = {
  country_code: string;
  country_flag: string;
  country_name: string;
  price_usd: number;
};

type ServicePricing = {
  service_id: string;
  service_name: string;
  price_usd: number;
};

// Keep in sync with the UI lists (MobileDashboard / ServiceList).
// Server must always compute price; client price is display-only.
const countries: CountryPricing[] = [
  { country_code: "RU", country_name: "Russia", country_flag: "🇷🇺", price_usd: 0.5 },
  { country_code: "UA", country_name: "Ukraine", country_flag: "🇺🇦", price_usd: 0.75 },
  { country_code: "KZ", country_name: "Kazakhstan", country_flag: "🇰🇿", price_usd: 0.6 },
  { country_code: "ID", country_name: "Indonesia", country_flag: "🇮🇩", price_usd: 0.45 },
  { country_code: "MY", country_name: "Malaysia", country_flag: "🇲🇾", price_usd: 0.85 },
  { country_code: "MA", country_name: "Morocco", country_flag: "🇲🇦", price_usd: 1.0 },
  { country_code: "KE", country_name: "Kenya", country_flag: "🇰🇪", price_usd: 0.9 },
  { country_code: "MM", country_name: "Myanmar", country_flag: "🇲🇲", price_usd: 1.2 },
  { country_code: "PH", country_name: "Philippines", country_flag: "🇵🇭", price_usd: 0.55 },
  { country_code: "VN", country_name: "Vietnam", country_flag: "🇻🇳", price_usd: 0.65 },
  { country_code: "TH", country_name: "Thailand", country_flag: "🇹🇭", price_usd: 0.7 },
  { country_code: "DE", country_name: "Germany", country_flag: "🇩🇪", price_usd: 2.5 },
  { country_code: "GB", country_name: "United Kingdom", country_flag: "🇬🇧", price_usd: 2.0 },
  { country_code: "US", country_name: "United States", country_flag: "🇺🇸", price_usd: 1.8 },
  { country_code: "CA", country_name: "Canada", country_flag: "🇨🇦", price_usd: 0.19 },
];

const services: ServicePricing[] = [
  { service_id: "facebook", service_name: "Facebook", price_usd: 0.15 },
  { service_id: "google", service_name: "Google/Gmail", price_usd: 0.25 },
  { service_id: "whatsapp", service_name: "WhatsApp", price_usd: 0.25 },
  { service_id: "telegram", service_name: "Telegram", price_usd: 0.2 },
  { service_id: "instagram", service_name: "Instagram", price_usd: 0.18 },
  { service_id: "twitter", service_name: "Twitter/X", price_usd: 0.22 },
  { service_id: "tiktok", service_name: "TikTok", price_usd: 0.28 },
  { service_id: "discord", service_name: "Discord", price_usd: 0.12 },
  { service_id: "microsoft", service_name: "Microsoft", price_usd: 0.3 },
  { service_id: "apple", service_name: "Apple", price_usd: 0.45 },
  { service_id: "amazon", service_name: "Amazon", price_usd: 0.38 },
  { service_id: "spotify", service_name: "Spotify", price_usd: 0.15 },
  { service_id: "netflix", service_name: "Netflix", price_usd: 0.55 },
  { service_id: "uber", service_name: "Uber", price_usd: 0.25 },
  { service_id: "paypal", service_name: "PayPal", price_usd: 0.42 },
];

function getUsdToNgnRate() {
  // Default chosen so the flow works without configuration; set USD_TO_NGN in secrets for real pricing.
  const raw = Deno.env.get("USD_TO_NGN");
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1600;
}

export function getPricing(args: { countryCode: string; serviceId: string }) {
  const country = countries.find((c) => c.country_code === args.countryCode);
  if (!country) throw new Error("Unsupported country");
  const service = services.find((s) => s.service_id === args.serviceId);
  if (!service) throw new Error("Unsupported service");

  const totalUsd = country.price_usd + service.price_usd;
  const ngn = Math.round(totalUsd * getUsdToNgnRate());
  const amountKobo = ngn * 100;

  return {
    country,
    service,
    currency: "NGN" as const,
    amountKobo,
    totalUsd,
  };
}

