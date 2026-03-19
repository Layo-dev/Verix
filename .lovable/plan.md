

# SMS Inbox Page

Build a new SMS Inbox page at `/dashboard/referral` with a two-panel layout: active numbers list on the left, real-time SMS feed on the right.

---

## Database

### New table: `purchased_numbers`

Stores numbers users have purchased. Fields: `id`, `user_id`, `phone_number`, `country_code`, `country_flag`, `service_name`, `status` (enum: active, expiring, expired), `expires_at`, `created_at`.

### New table: `sms_messages`

Stores incoming SMS for each number. Fields: `id`, `number_id` (FK to purchased_numbers), `sender`, `body`, `otp_code` (extracted OTP if detected), `received_at`.

### RLS policies

Both tables: users can only SELECT their own records (join through `purchased_numbers.user_id = auth.uid()`).

### Realtime

Enable Supabase Realtime on `sms_messages` so the frontend gets live updates via subscription.

---

## New Files

### 1. `src/pages/SmsInboxPage.tsx`

Main page component with the shared dashboard layout (sidebar + main content area). Contains:
- Two-panel grid: number list (left, ~1/3 width) and SMS feed (right, ~2/3 width)
- State for `selectedNumberId`
- Supabase Realtime subscription on `sms_messages` filtered by selected number
- Mobile layout: numbers as a bottom sheet, full-screen SMS feed

### 2. `src/components/dashboard/NumberList.tsx`

Left panel showing all active purchased numbers.

UI per card:
- Phone number (formatted)
- Service name badge
- Status dot: green (active), yellow (expiring soon -- less than 2 mins), gray (expired)
- Time remaining countdown
- Click to select and load messages

Scrollable list with search filter. Selected number highlighted.

### 3. `src/components/dashboard/SmsFeed.tsx`

Right panel showing messages for the selected number.

Each message rendered as a card/bubble:
- Sender name/label at top-left
- Timestamp at top-right
- Message body
- Auto-detected OTP code highlighted with a "Copy Code" button
- Empty state when no messages or no number selected

OTP detection: regex pattern `/\b\d{4,8}\b/` to extract numeric codes from message body.

Auto-scroll to bottom on new messages. Supabase Realtime subscription updates feed live.

---

## File Modifications

### `src/App.tsx`

Add route: `/dashboard/referral` pointing to `SmsInboxPage`, wrapped in `ProtectedRoute`.

### `src/components/dashboard/DashboardSidebar.tsx`

No changes needed -- already links to `/dashboard/referral` for SMS Inbox.

---

## Implementation Order

1. Create database migration (tables + RLS + realtime)
2. Build `NumberList.tsx` component
3. Build `SmsFeed.tsx` component with OTP detection and copy
4. Build `SmsInboxPage.tsx` with layout, state, and Realtime subscription
5. Add route in `App.tsx`

---

## Technical Details

### Realtime subscription pattern

```typescript
const channel = supabase
  .channel('sms-feed')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'sms_messages',
    filter: `number_id=eq.${selectedNumberId}`,
  }, (payload) => {
    setMessages(prev => [...prev, payload.new]);
  })
  .subscribe();
```

### OTP extraction

```typescript
const extractOtp = (text: string): string | null => {
  const match = text.match(/\b(\d{4,8})\b/);
  return match ? match[1] : null;
};
```

### Copy to clipboard

Uses `navigator.clipboard.writeText()` with a toast confirmation.

### Mobile layout

On mobile, the number list becomes a horizontal scrollable strip at the top, with the SMS feed taking the remaining space below. Alternatively, numbers shown in a bottom sheet (consistent with existing mobile patterns).

