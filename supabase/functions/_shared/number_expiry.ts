/** In-app lifetime for a purchased virtual number (aligned with refund-check timeout). */
export const NUMBER_ACTIVE_MS = 20 * 60 * 1000;

/**
 * Stored `expires_at` is capped at now + 20m. If the provider sends a shorter
 * `activationEndTime`, the earlier time is used.
 */
export function numberExpiresAt(providerActivationEndIso?: string | null): string {
  const cap = Date.now() + NUMBER_ACTIVE_MS;
  const raw = providerActivationEndIso?.trim();
  if (!raw) return new Date(cap).toISOString();
  const t = new Date(raw).getTime();
  if (!Number.isFinite(t)) return new Date(cap).toISOString();
  return new Date(Math.min(t, cap)).toISOString();
}
