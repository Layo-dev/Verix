

# Top Up Modal — Frontend Only

## Overview
Add a "Top Up" dialog modal triggered from the sidebar's "Top up" button (and mobile header wallet icon). The modal lets users enter an amount and kicks off a Paystack payment via the existing `paystack-init` edge function with a new `type: "topup"` payload.

## UX Flow

```text
[Top up button] → Modal opens
  ┌─────────────────────────────┐
  │  Top up balance             │
  │                             │
  │  Quick amounts:             │
  │  [$5] [$10] [$20] [$50]    │
  │                             │
  │  Or enter custom amount:    │
  │  ┌─────────────────────┐   │
  │  │ $                   │   │
  │  └─────────────────────┘   │
  │                             │
  │  [Pay with Paystack]        │
  └─────────────────────────────┘
```

- Quick-select preset chips ($5, $10, $20, $50)
- Custom amount input with validation (min $1, max $500)
- Single CTA button: "Pay $X.XX" — redirects to Paystack
- Loading spinner while initializing payment

## Files Changed

### 1. New: `src/components/dashboard/TopUpModal.tsx`
- Dialog using existing `Dialog` component from `@/components/ui/dialog`
- Props: `open`, `onOpenChange`
- State: `amount` (number), `loading` (boolean)
- Preset amount chips that set amount on click
- Custom input field (type number, min 1)
- On submit: call `supabase.functions.invoke("paystack-init", { body: { type: "topup", amount } })` and redirect to `authorization_url`
- Error handling via toast

### 2. Update: `src/components/dashboard/DashboardSidebar.tsx`
- Add `useState` for modal open state
- Wire "Top up" button (line 74) to open the modal
- Render `<TopUpModal />` inside sidebar

### 3. Update: `src/components/dashboard/MobileDashboard.tsx`
- Add `useState` for modal open state
- Make the wallet/`$0` area in the header tappable to open modal
- Render `<TopUpModal />`

