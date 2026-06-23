## Create History Page at `/dashboard/history`

### Goal
Build a responsive History page that lists only expired purchased numbers, with date filters, search, status filter, summary stats, and a clean Verix-branded layout matching the wireframe.

### Files

**New: `src/pages/HistoryPage.tsx`**
- Reuses `DashboardSidebar` (desktop fixed sidebar, mobile sheet) like `SmsInboxPage`.
- Fetches from `purchased_numbers` where `status = 'expired'` for the current user, ordered by `expires_at desc`.
- Joins/derives "OTP status" from `otp_status` column to show Received vs No Code.

**New route in `src/App.tsx`**
- Add `/dashboard/history` → `<HistoryPage />` inside `ProtectedRoute`.

### Layout (matches wireframe)

```text
Header: "History"
─────────────────────────────
Date range tabs: Last 7 Days | Last 30 Days | All Time
─────────────────────────────
Filters row (stacked on mobile, inline on desktop):
  • Search number (input)
  • Search service (input)
  • Status filter (select: All / Received / No Code)
─────────────────────────────
Summary cards (2 columns):
  • Total Purchases: N
  • Total Spent: $X.XX
─────────────────────────────
Table (desktop) / Stacked cards (mobile):
  Country | Service | Number | Cost | Status
  🇺🇸  Telegram  +1xxx  $1.50  Received
  🇨🇦  Google    +1xxx  $2.00  No Code
```

### Behavior
- Date tabs filter by `expires_at` within range (7d, 30d, all).
- Number search: substring match on `phone_number`.
- Service search: substring match on `service_name`.
- Status filter: maps to `otp_status` ('received' vs other → No Code).
- Summary recomputes from filtered list (count + sum of `price_usd`, displayed USD).
- Empty state when no records match.
- Loading skeleton while fetching.

### Design (Verix brand)
- Uses existing tokens: `bg-background`, `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `accent` for active tab.
- Rounded `rounded-xl` cards, subtle borders, Inter font (inherited).
- Status pills: green (`hsl(var(--success))` bg/text) for Received, muted/red for No Code.
- Date tabs as segmented control: pill-shaped, active = accent bg.
- Table on `md:` and up; on mobile each row becomes a compact card with flag + number on top, service + cost + status below.

### Responsive
- Mobile (`<md`): single column, filters stacked, summary side-by-side small cards, rows as cards. Sidebar in sheet via hamburger.
- Tablet/Desktop (`md+`): filters inline (grid-cols-3), summary as 2 cards, full table.

### Data
- Single Supabase query on mount:
  ```ts
  supabase.from('purchased_numbers')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'expired')
    .order('expires_at', { ascending: false })
  ```
- All filtering done client-side for snappy UX.

### Out of scope
- No edits to edge functions, schema, or other dashboard pages.
- No export/CSV (can be added later if requested).
