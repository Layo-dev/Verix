

# Update PaystackCallback for Top-Up Support

## Problem
`PaystackCallback.tsx` currently only handles number purchase verification. With the new top-up flow, the callback needs to distinguish between a successful top-up and a successful number purchase, showing the correct toast message and navigating to the right page.

## Approach
The `paystack-verify` response likely includes a `type` field (or the order metadata distinguishes top-ups from purchases). Update the callback to:

1. Check if the successful response indicates a top-up (`data.type === "topup"` or absence of `purchasedNumberId`)
2. Show appropriate toast:
   - Top-up: "Balance topped up!" with the credited amount
   - Purchase: "Number purchased!" (existing)
3. Navigate correctly:
   - Top-up: `/dashboard` (stay on main dashboard)
   - Purchase: `/dashboard/referral` (SMS inbox, existing behavior)
4. Invalidate `profile-balance` query in both cases (already done)

## Changes

### `src/pages/PaystackCallback.tsx`
- After successful verify, check `data.type === "topup"` (or fallback: no `purchasedNumberId`)
- Branch toast message and navigation accordingly
- Add a loading spinner (Loader2) for better UX instead of plain text

