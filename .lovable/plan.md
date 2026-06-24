## Product Details Modal

Create a clean, Verix-branded product details surface that opens when a user clicks a product card on the Marketplace page. Responsive — centered Dialog on desktop, bottom Sheet on mobile.

### Files

**New: `src/components/marketplace/ProductDetailsModal.tsx`**
- Props: `product: Product | null`, `open: boolean`, `onOpenChange(open: boolean)`, `onBuy(product)`.
- Renders nothing when `product` is null.
- Uses `Dialog` on desktop (`md+`) and `Sheet` (side `bottom`) on mobile via `useIsMobile`, so the layout matches the wireframes.

**Edit: `src/pages/MarketplacePage.tsx`**
- Extend the Supabase products query to also select `description` and `delivery_items`.
- Extend the `Product` / `ProductRow` types with `description: string | null` and `deliveryItems: string[]`.
- Track selected product in state: `const [selected, setSelected] = useState<Product | null>(null)`.
- Make the whole product card clickable (button wrapper) to open the modal. Keep the existing "Buy Now" button inside the card but stop event propagation so it still triggers `handleBuy` directly without opening the modal.
- Render `<ProductDetailsModal product={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} onBuy={handleBuy} />`.

### Modal Layout (matches wireframes)

```text
Desktop (Dialog, max-w-lg, scrollable body):
┌────────────────────────────────┐
│   [Product image, aspect-video]│
├────────────────────────────────┤
│ Netflix Premium                │
│ 🇺🇸 United States · Streaming  │
│                                │
│ Description                    │
│ Premium Netflix account...     │
│                                │
│ What You'll Receive            │
│ ✓ Email                        │
│ ✓ Password                     │
│ ✓ Profile Access               │
│                                │
│ Stock: 12     Price: $5.99     │
│ [        Buy Now            ]  │
└────────────────────────────────┘

Mobile (Sheet, side="bottom", rounded-t-2xl, max-h-[90vh] scrollable):
Same sections stacked full-width, sticky footer holding the Buy Now button.
```

### Section details
- **Image**: `aspect-video` on desktop / `aspect-[16/10]` on mobile, `bg-muted` fallback with country flag emoji centered when no `image_url`.
- **Title row**: `text-xl` title, muted-foreground subline showing `{flag} {country} · {category}`.
- **Description**: small heading `Description` + paragraph from `product.description` (fallback: "No description provided.").
- **What You'll Receive**: small heading + vertical list. Items pulled from `delivery_items` (JSON array of strings). Render with a green check icon (`Check` from lucide) + label. Fallback when array empty: hide the section entirely.
- **Stock + Price**: two inline blocks. Stock pill uses same success/destructive treatment as the card. Price is bold `$X.XX`.
- **Buy Now**: full-width `Button variant="accent"`, disabled when out of stock. On click, calls `onBuy(product)` which (currently) shows the "Coming soon" toast and closes the modal.

### Delivery items parsing
```ts
const deliveryItems = Array.isArray(p.delivery_items)
  ? (p.delivery_items as unknown[]).filter((x): x is string => typeof x === "string")
  : [];
```

### Design (Verix tokens only)
- `bg-background`, `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `accent`, `success`, `destructive`.
- Rounded `rounded-2xl` for the mobile sheet, default Dialog radius on desktop.
- No hardcoded color utilities.

### Responsive
- `<md`: Sheet side `bottom`, full-width, scrollable body, sticky footer Buy Now button.
- `md+`: Dialog centered, `max-w-lg`, scrollable inner body when content overflows viewport.
- 390px viewport: no horizontal overflow; image, title, and lists all wrap properly.

### Out of scope
- No real purchase flow (Buy Now still shows the "Coming soon" toast).
- No product detail page/route.
- No edits to `marketplace_products` schema.
