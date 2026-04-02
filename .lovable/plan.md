

# Email OTP Signup Flow + Fix Build Errors

## Part 1: Fix Existing Build Errors (3 TypeScript errors)

The `SupabaseClient` type in `refund.ts` uses a complex `ReturnType` import that doesn't match the actual client passed from other files. Fix by using `any` for the supabase parameter type.

**File:** `supabase/functions/_shared/refund.ts` -- change `SupabaseClient` type to `any`

## Part 2: Create Edge Functions in Codebase

The `send-otp` and `verify-otp` functions exist in Supabase but not in the project files. Recreate them locally so they deploy consistently.

### `supabase/functions/send-otp/index.ts`
- Accept `{ email }` in POST body
- Generate 6-digit OTP, hash it, store in `email_otps` table with 10-min expiry
- Send OTP via email (use Supabase Auth admin API `generateLink` or a simple approach: just store the OTP and let the frontend display it for now -- or use Resend since `RESEND_API_KEY` secret exists)
- CORS headers included
- Rate limit: delete old OTPs for same email before inserting

### `supabase/functions/verify-otp/index.ts`
- Accept `{ email, otp }` in POST body
- Look up `email_otps` where `email` matches, `used = false`, `expires_at > now()`
- Compare OTP codes
- If match: mark `used = true`, return `{ valid: true }`
- If expired: return `{ valid: false, error: "Code expired" }`
- If wrong: return `{ valid: false, error: "Invalid code" }`

### `supabase/config.toml`
- Add `[functions.send-otp]` and `[functions.verify-otp]` with `verify_jwt = false`

## Part 3: Redesign Signup Page with Two Steps

### `src/pages/Signup.tsx` -- Two-step flow

**Step 1: Email + Password form** (current form, modified)
- On submit: validate passwords match, call `send-otp` edge function with email
- Do NOT call `supabase.auth.signUp` yet
- Store email + password in component state
- Transition to Step 2

**Step 2: OTP Verification UI**
- Show masked email ("Code sent to j***@gmail.com")
- 6-digit OTP input using the existing `InputOTP` component
- 60-second countdown timer for resend
- "Resend Code" button (disabled during countdown, calls `send-otp` again)
- On OTP submit: call `verify-otp` edge function
  - If valid: call `supabase.auth.signUp({ email, password })` to create account
  - If invalid/expired: show error message inline
- Back button to return to Step 1

**UX details:**
- Countdown starts at 60s, shows "Resend in 0:45" format
- Error states: "Invalid code", "Code expired -- request a new one"
- Loading spinner on verify button during API call
- Auto-submit when all 6 digits entered

## Files Changed
1. `supabase/functions/_shared/refund.ts` -- fix type to `any`
2. `supabase/functions/send-otp/index.ts` -- new edge function
3. `supabase/functions/verify-otp/index.ts` -- new edge function  
4. `supabase/config.toml` -- register new functions
5. `src/pages/Signup.tsx` -- two-step signup with OTP verification

