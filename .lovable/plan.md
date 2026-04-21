
## Improve Buy Number Error Handling on the Frontend

## Goal
Keep the existing `buy-number` edge function, but make the frontend translate its failures into clear, friendly toasts that match the requested UX:

```text
User clicks buy
↓
Frontend shows loading
↓
Backend validates
↓
If error → proper status + message
↓
Frontend shows friendly toast
```

## What is happening now
- The buy button is already calling the correct edge function: `supabase.functions.invoke("buy-number", ...)`.
- The backend is already returning useful HTTP statuses and JSON bodies.
- Current issue: `useBuyNumber.ts` only uses `error.message`, so users see generic Edge Function errors instead of the backend’s real message.
- Network trace confirms one real failure case:
  - `POST /functions/v1/buy-number`
  - Status `402`
  - Body: `{"error":"Insufficient wallet balance","currency":"USD","balance":0.44,"required":0.65,"shortfall":0.21}`

## Frontend-only implementation

### 1. Update `src/hooks/useBuyNumber.ts`
Add a small frontend error-normalization layer inside the hook.

#### Responsibilities
- Keep `loading` behavior exactly as-is.
- Read the real error payload from the edge function response when status is non-2xx.
- Map backend/server/network failures to user-friendly toast content.
- Use semantic toast variants:
  - insufficient balance → `warning`
  - unavailable/provider/network failures → `destructive`

#### Error mapping rules
Map backend responses to these friendly messages:

- **Insufficient balance**
  - Trigger when:
    - HTTP `402`, or
    - backend message includes `Insufficient wallet balance`
  - Toast:
    - Title: `Insufficient balance`
    - Description: `Please top up your wallet to continue`
    - Variant: `warning`

- **No number available**
  - Trigger when backend message includes signals like:
    - `NO_NUMBERS`
    - `No numbers available`
    - `Unsupported country/service` only if that state reflects unavailable inventory in the UI flow
  - Toast:
    - Title: `No number available`
    - Description: `No number available right now. Try again shortly.`
    - Variant: `destructive`

- **Provider failed**
  - Trigger when backend message includes signals like:
    - provider labels/errors such as `HeroSMS`, `GrizzlySMS`
    - `BAD_KEY`, `BANNED`, `ERROR_SQL`, `unexpected payload`
    - `failed: HTTP`
  - Toast:
    - Title: `Provider failed`
    - Description: `Service temporarily unavailable. Try again.`
    - Variant: `destructive`

- **Network error**
  - Trigger when:
    - fetch/invoke fails without a parsed backend body
    - browser is offline / request never reaches backend
    - generic function error has no useful JSON payload
  - Toast:
    - Title: `Network error`
    - Description: `Something went wrong. Check your connection.`
    - Variant: `destructive`

- **Fallback**
  - For anything uncategorized:
    - Title: `Purchase error`
    - Description: parsed backend message if available, otherwise generic network text
    - Variant: `destructive`

### 2. Extract backend error body correctly
In `useBuyNumber.ts`, after `supabase.functions.invoke("buy-number")`:
- If `error` exists, attempt to parse `error.context` as JSON.
- Prefer:
  1. parsed JSON `error`
  2. parsed JSON `message`
  3. `error.message`
- Use the parsed status/message to feed the mapping rules above.

This is the key fix that allows the frontend to show the real backend validation result instead of the generic Supabase Functions error string.

### 3. Keep success flow unchanged
On success:
- continue invalidating `["profile-balance"]`
- keep the success toast
- keep navigation to `/dashboard/referral`

Optional polish:
- mark the success toast as `success` so it uses the new redesigned success styling automatically.

## Files to update

### `src/hooks/useBuyNumber.ts`
Implement:
- response/error parsing
- status-aware and message-aware mapping
- friendly toast titles/descriptions
- optional success variant

## Technical notes
- No backend changes required.
- The buy button is already wired correctly on both desktop and mobile through `useBuyNumber`.
- The backend already returns meaningful status codes; the missing piece is frontend interpretation.
- Current toast system already supports `warning`, `success`, and `destructive`, so no toast component redesign is needed for this task.

## Expected result
When the user taps buy:
- loading state remains visible
- backend validation still runs normally
- failures become readable and trustworthy

Example outcomes:
- `402 Insufficient wallet balance` → `Insufficient balance` / `Please top up your wallet to continue`
- availability/provider issues → clear service message
- network/invoke failures → connection-friendly fallback

## QA checklist
- Try purchase with wallet below required amount and confirm warning toast appears
- Try a country/service combo that returns no availability and confirm “No number available” toast
- Simulate a provider-style failure and confirm “Service temporarily unavailable. Try again.”
- Simulate a disconnected/failed request and confirm network error toast
- Confirm success purchase still navigates to `/dashboard/referral`
- Confirm loading state still disables repeat submissions during the request
