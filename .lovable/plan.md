# Mobile Dashboard + Receive SMS Redesign (mobile only)

Desktop layouts stay exactly as they are. All work below applies to the mobile breakpoint.

## 1. New mobile Home screen

`/dashboard` on mobile becomes an overview screen instead of the buy flow:

- **Header**: minimal bar — menu button (opens existing sidebar sheet), centered "Verix." wordmark, notification bell on the right.
- **Balance card**: full-width dark card with orange accents. Left column "Available balance" + large `$0.50` (800 weight) + `Frozen $0.00`; right column "Transactions" + count. Below: three pill actions — `+ Fund` (opens existing TopUpModal), `Numbers`, `View`.
- **Quick actions**: 2x2 grid of tappable cards — Buy Number, SMS Inbox, Marketplace, More.
- **Recent activity**: section header with "View all" link, then rows: status dot, title, subtitle (country · service or channel), right-aligned amount (orange/negative for spend, green for funding) and relative time.
- **Marketplace preview**: "Explore Marketplace" heading + one-line description, then two horizontal product cards and a "View marketplace" link to `/dashboard/products`.
- **Bottom navigation** (fixed, safe-area aware): Home, Receive, Inbox, Wallet. Active item is orange.

## 2. Receive SMS page (mobile)

Modelled on the hero-sms reference, in Verix dark/orange styling:

- Step blocks stacked in cards: **1. Choose service**, **2. Choose country**, **3. Buy**.
- Each step is a tappable row that opens the existing bottom sheet (search + list with icon, name, price). Once picked, the row collapses to the selection with a clear (X) button and the next step appears.
- Step 3 renders only after both are selected: a single full-width orange button `Buy for $X.XX` (no verification/time options), plus the 20-minute refund note.
- Existing buy logic, pricing hooks and sheets are reused untouched.

## 3. Icons

Replace Lucide with Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`) in the mobile dashboard, quick actions, bottom nav and receive page. Desktop components keep their current icons.

## Technical notes

- Add route `/dashboard/buy` for the Receive SMS flow and `/dashboard/wallet` for the Wallet tab; on mobile `/dashboard` renders the new `MobileHome`, desktop `/dashboard` keeps the current three-column layout.
- New files: `src/components/dashboard/mobile/MobileHome.tsx`, `BalanceCard.tsx`, `QuickActions.tsx`, `RecentActivity.tsx`, `MarketplacePreview.tsx`, `BottomNav.tsx`; `MobileDashboard.tsx` is refactored into the step-based Receive SMS layout.
- Balance comes from `useProfileBalance`. Recent activity, transaction count and marketplace preview cards use placeholder data for now (real queries wired later on request).
- Colors only from existing tokens (background, card, surface, accent, muted-foreground) — no hardcoded hex.
- Content padded bottom so the fixed nav never covers it; zero horizontal overflow.
