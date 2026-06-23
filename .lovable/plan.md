## Create Marketplace Page at `/dashboard/products`

### Goal
Build a responsive, Verix-branded Marketplace page matching the wireframe. Uses mock data for now (real data wired later).

### Files

**New: `src/pages/MarketplacePage.tsx`**
- Reuses `DashboardSidebar` pattern (desktop fixed sidebar + mobile sheet via hamburger) like `HistoryPage` and `SmsInboxPage`.
- Holds local state for search query, category filter, country filter.
- Renders filtered product grid from a local `MOCK_PRODUCTS` constant.

**Edit: `src/App.tsx`**
- Add route `/dashboard/products` → `<MarketplacePage />` inside `ProtectedRoute`.
- The sidebar already links to `/dashboard/products` (Marketplace item), so no sidebar edits needed.

### Layout (matches wireframe)

```text
Header:
  Marketplace
  Buy accounts, subscriptions and digital products
─────────────────────────────
Filters row (stacked on mobile, inline on md+):
  [ Search input ]  [ Category select ]  [ Country select ]
─────────────────────────────
Product grid:
  Mobile: 2 cols | Tablet: 3 cols | Desktop: 4 cols
  Card: image, title, country (flag + name), stock, price, "Buy Now" button
```

### Mock data shape
```ts
type Product = {
  id: string;
  title: string;        // e.g. "Netflix Premium"
  image: string;        // placeholder URL or /placeholder.svg
  category: string;     // Streaming | Social | Gaming | Productivity
  country: string;      // US, UK, NG, CA...
  countryFlag: string;  // emoji
  stock: number;
  price: number;        // USD
};
```
~8–12 mock entries spanning a few categories and countries so filters are demonstrable.

### Filtering behavior
- Search: case-insensitive substring match on `title`.
- Category: "All" + unique categories from mock data.
- Country: "All" + unique countries from mock data.
- All client-side, recomputed via `useMemo`.
- Empty state when no matches.

### Card behavior
- "Buy Now" button is a stub for now — shows a toast ("Coming soon") via existing `useToast`. No purchase logic.
- Stock pill: green if >0, muted/red if 0 (button disabled when 0).

### Design (Verix brand)
- Tokens only: `bg-background`, `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `accent`.
- Cards: `rounded-xl border bg-card` with subtle shadow on hover, square-ish image area on top (`aspect-square` with `bg-muted` placeholder), padded content below.
- Buttons: existing `Button` component (`variant="accent"` for Buy Now).
- Filters use existing `Input` + `Select` UI primitives.
- Inter font (inherited).

### Responsive
- `<md`: sidebar in sheet; filters stacked full-width; grid `grid-cols-2 gap-3`.
- `md`: filters `grid-cols-3`; grid `md:grid-cols-3 gap-4`.
- `lg+`: full sidebar; grid `lg:grid-cols-4 gap-5`.
- No horizontal overflow on 390px viewport.

### Out of scope
- No real product data, no Supabase tables, no edge functions.
- No cart, checkout, or purchase flow (Buy Now is a placeholder toast).
- No product detail page.
