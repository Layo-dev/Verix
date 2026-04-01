

# Implement Refund System

## Overview

Add a Paystack refund capability with two triggers: (1) immediate refund when HeroSMS provisioning fails after payment, and (2) automatic refund when no OTP is received within a timeout window.

## Database Changes

### Migration: Add refund columns to `orders` table

The `orders` table already has `refunded`, `refunded_at`, and `refund_reason` columns (visible in the schema). No new columns needed.

### Migration: Add `otp_status` column check

The `purchased_numbers` table already has `otp_status` (default `'waiting'`). No new columns needed.

## Backend Changes

### 1. New shared helper: `supabase/functions/_shared/refund.ts`

Reusable refund function:

```typescript
export async function processRefund(
  supabase: SupabaseClient,
  orderId: string,
  reason: string
): Promise<{ success: boolean; error?: string }>
```

Logic:
- Fetch the order by ID
- Guard: skip if already refunded (`refunded = true`) or status is not `paid`
- Guard: check that no OTP was received (query `sms_messages` for the order's `purchased_number_id` -- if any exist, refuse refund)
- Call Paystack Refund API: `POST /refund` with `{ transaction: paystackReference }`
- On success: update order `refunded = true`, `refunded_at = now()`, `refund_reason = reason`, `status = 'refunded'`
- Update `purchased_numbers` status to `expired` if it exists

### 2. Add `paystackRefund` to `supabase/functions/_shared/paystack.ts`

```typescript
export async function paystackRefund(reference: string): Promise<void>
```

Calls `POST https://api.paystack.co/refund` with body `{ transaction: reference }` using the secret key.

### 3. Update `supabase/functions/paystack-verify/index.ts` -- CASE 1

When `provisionNumber()` throws (HeroSMS fails after payment verified):
- Catch the provisioning error specifically
- Call `processRefund(supabase, order.id, "Number provisioning failed")`
- Return `{ ok: false, refunded: true, error: "..." }` to the client

### 4. New edge function: `supabase/functions/refund-check/index.ts` -- CASE 2

Scheduled/callable function for OTP timeout refunds:
- Query `purchased_numbers` where `otp_status = 'waiting'` and `created_at < now() - interval '5 minutes'`
- For each, check `sms_messages` count for that number
- If zero messages: call `processRefund()` with reason "No OTP received within timeout"
- Update `purchased_numbers.otp_status = 'timeout'`

This can be invoked via a pg_cron job every minute, or called manually.

### 5. Update `supabase/config.toml`

Add `[functions.refund-check]` with `verify_jwt = false`.

## Frontend Changes

### Update `src/pages/PaystackCallback.tsx`

Handle the new `refunded: true` response from paystack-verify:
- Show a different toast: "Payment refunded -- number could not be assigned"
- Navigate to dashboard instead of inbox

## Files Changed

1. `supabase/functions/_shared/paystack.ts` -- add `paystackRefund()`
2. `supabase/functions/_shared/refund.ts` -- new shared refund logic
3. `supabase/functions/paystack-verify/index.ts` -- catch provisioning failure, auto-refund
4. `supabase/functions/refund-check/index.ts` -- new function for OTP timeout refunds
5. `supabase/config.toml` -- register refund-check function
6. `src/pages/PaystackCallback.tsx` -- handle refund response in UI

## Refund Guards (DO NOT REFUND IF)

- `sms_messages` exist for the purchased number (OTP was delivered)
- Order is already refunded (`refunded = true`)
- Order status is not `paid`

