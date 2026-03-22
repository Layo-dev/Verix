

# Three Landing Page Updates

## Task 1: Features.tsx -- Add 3 more cards with social media icons

Currently has 3 cards (Instagram, Facebook, Instagram duplicate). Will restructure to show 6 cards in a 3x2 grid, each with a proper `react-icons` brand icon.

**Cards (6 total):**
1. Instagram (`SiInstagram`)
2. Facebook (`SiFacebook`)
3. WhatsApp (`SiWhatsapp`)
4. Twitter/X (`SiX`)
5. Telegram (`SiTelegram`)
6. TikTok (`SiTiktok`)

Each card keeps the existing layout: icon circle + service name + sample OTP message + "Do not share" subtext. Use a data array to map over instead of duplicating JSX.

**File:** `src/components/Features.tsx`

---

## Task 2: Dashboard.tsx -- Replace right panel with 5 step cards

Replace the entire right content (balance header, payments, stats, bars) with 5 horizontal step cards matching the uploaded reference image. Each card has:
- A circular icon (light purple background, purple icon)
- A bold title
- A description paragraph

**5 Steps:**
1. **Selection** (icon: `MousePointerClick`) -- "Begin by choosing the appropriate service from the numbers page..."
2. **Configuration** (icon: `Settings`) -- "Indicate your preferred country and the quantity of temp numbers you require"
3. **Purchase** (icon: `ShoppingCart`) -- "Proceed by clicking the cart icon to secure your number"
4. **Activation** (icon: `Smartphone`) -- "Provided temp phone number for verification will be displayed on the Activation page..."
5. **Receiving SMS messages** (icon: `MessageSquare`) -- "The verification code will appear next to your virtual number, ready for use"

Layout: 5-column grid on desktop (`lg:grid-cols-5`), 2-col on tablet, 1-col on mobile. Each card is a white rounded card with subtle border/shadow.

**File:** `src/components/Dashboard.tsx`

---

## Task 3: Pricing.tsx -- Redesign as service price list

Replace the current 3-plan pricing cards with a list layout matching the uploaded reference image. Each row shows:
- Service icon (brand icon from `react-icons`)
- Service name
- Availability count (e.g. "967761 pcs")
- Price badge ("up to $0.03") in a purple rounded pill

**Services to display:**
Amazon, Ticketmaster, Google/YouTube/Gmail, Facebook, TikTok/Douyin, Twitter, WhatsApp (matching the reference)

Remove the monthly/yearly toggle and plan-based layout. Replace with a clean vertical list of service rows.

**File:** `src/components/Pricing.tsx`

---

## Implementation Order
1. Update `Features.tsx` with 6-card grid
2. Update `Dashboard.tsx` right panel with 5 step cards
3. Update `Pricing.tsx` with service price list

