
## Redesign Legacy Toast UI to Match Reference

## Goal
Update the existing toast component used by the app so success, warning, and error messages visually match the screenshot style: soft pastel background, circular icon badge on the left, strong title, muted description, and a visible close button on the right.

## What to change

### 1. Extend the toast variants
Update `src/components/ui/toast.tsx` to support clearer semantic variants:
- `success`
- `warning`
- `destructive` (error)
- keep `default` for neutral/info if needed

Each variant should get:
- pastel tinted background
- subtle border
- dark readable text
- soft shadow
- rounded large card shape
- close button styling that stays visible, not hover-only

### 2. Add variant icons inside the toast layout
Update `src/components/ui/toaster.tsx` so each toast renders:
- left circular icon container
- icon based on variant:
  - success → check icon
  - warning → alert/info icon
  - destructive → alert triangle or circle alert
  - default → info icon
- centered content block with title + description
- close button aligned to top-right

Target structure:
```text
[icon badge] [title + description................] [close]
```

### 3. Match the reference styling more closely
Implement the visual treatment shown in the screenshot:
- larger horizontal card layout
- softer background fills:
  - success: mint/green tint
  - error: blush/red tint
  - warning: cream/yellow tint
  - default/info: pale blue tint
- circular white icon disc with colored icon inside
- title slightly larger/bolder than current
- description in muted gray
- generous padding and spacing
- rounded corners closer to the screenshot

### 4. Keep current toast API compatible
Do not change how toasts are called in the rest of the app.
Existing calls like:
- `toast({ title, description })`
- `toast({ ..., variant: "destructive" })`

should keep working.

Add support so new warning/success variants can be used later without breaking the current calls.

### 5. Ensure current app flows benefit automatically
Because multiple existing screens already use the legacy `useToast` system, the redesign should automatically improve messages in:
- `src/pages/PaystackCallback.tsx`
- `src/hooks/useBuyNumber.ts`
- `src/components/dashboard/TopUpModal.tsx`
- `src/components/dashboard/SmsFeed.tsx`

No business logic changes needed there unless you want to optionally assign:
- success variant to successful payment/purchase/copied states
- warning variant for refunded or cautionary states

## Files to update

### `src/components/ui/toast.tsx`
- add `success` and `warning` variants
- redesign base toast container styles
- restyle viewport for cleaner spacing
- restyle close button visibility and positioning

### `src/components/ui/toaster.tsx`
- add icon mapping by variant
- render a structured left-icon / content / close layout
- preserve existing `ToastTitle`, `ToastDescription`, `action`

### Optional follow-up updates
If desired after the UI redesign:
- `src/components/dashboard/SmsFeed.tsx` → mark “Copied!” as success
- `src/pages/PaystackCallback.tsx` → use warning for refund states
- `src/hooks/useBuyNumber.ts` and `src/components/dashboard/TopUpModal.tsx` → keep destructive for failures, default/success for successful states

## Technical notes
- Use Lucide icons already available in the project.
- Keep the current legacy toast system (`useToast`) because it is already wired into important flows.
- Avoid switching everything to Sonner in this task; this is a visual redesign of the existing toast path.
- Preserve accessibility and Radix toast behavior.
- Keep the layout responsive so it still looks good on smaller screens.

## QA checklist
- Success toast shows green icon badge and mint background
- Warning toast shows amber icon badge and cream background
- Error toast shows red icon badge and blush background
- Close icon is always visible and clickable
- Long descriptions wrap cleanly without overlap
- Desktop and mobile widths look balanced
- Existing payment and buy-number flows still trigger toasts correctly
