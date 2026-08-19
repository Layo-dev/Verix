# Landing Page Redesign — Premium Dark Verix

Rebuild the landing page around the dark brand system (black #171717 base, #222/#2A2A2A surfaces, orange #F25623 accent, white/#A3A3A3 text, Manrope) with a premium feel using Unsplash photography.

## Section order (new)

1. Navbar (existing, restyled to a floating rounded dark pill like the reference)
2. Hero — full-bleed dark with warm orange radial glow
3. Stats strip (existing, retuned)
4. Virtual Numbers section (new)
5. Partners (existing)
6. Marketplace section (new)
7. How it works (existing Dashboard.tsx)
8. Pricing (existing)
9. Testimonials + Footer (existing)

`Features.tsx` (the six service code cards) is replaced in the page flow by the new Virtual Numbers section; the file stays in the repo unused unless you want it removed.

## Hero

- Dark background with a soft orange radial wash from top-left, subtle grain/diagonal texture, no purple.
- Centered pill badge: "Trusted by 300k+ users"-style — for Verix: "Trusted by thousands of users".
- Headline in Manrope 800, large, two lines: "Receive OTPs Without Using Your Personal Number."
- Description in muted gray, max-width centered.
- CTAs: solid orange "Open An Account", dark outline "Buy a Number".
- Below: a premium Unsplash lifestyle image (person with phone) in a rounded card with a dark gradient overlay so it blends into the background, similar to the reference imagery.

## Virtual Numbers section

- Label: `VIRTUAL NUMBERS` (orange, uppercase, tracked, 500 weight — replaces the `{ ... }` label style on new sections).
- Heading: "One platform. Thousands of verification possibilities."
- Description: "Get temporary virtual numbers for SMS verification and online services without managing physical SIM cards."
- 4 feature cards in a grid (1 col mobile / 2 tablet / 4 desktop), each on a #222-range surface with #333 border, orange icon in a soft orange circle, 700 title, muted body:
  - Global Coverage — Numbers from multiple countries.
  - Fast Activation — Get your number in seconds.
  - Real-Time SMS — Receive verification codes directly in your dashboard.
  - Pay As You Go — Only pay for the numbers you need.

## Marketplace section

Different visual treatment, same tokens: a large rounded container panel (slightly lighter surface + orange glow corner) holding the content, so it reads as its own "brand within the brand".

- Label: `VERIX MARKETPLACE`
- Heading: "More than verification. Your digital marketplace."
- Description: "Discover ready-to-use digital products, accounts and tools built for people running businesses online."
- CTA link "Explore Marketplace →" pointing to `/dashboard/products`.
- 4 product cards (1/2/4 responsive grid): Unsplash image top with rounded corners, title, one-line description, then a bottom row with price in 800 weight and a "Buy →" text button.
  - Social Account — $12.00
  - Instagram Account — $8.50
  - Digital Tool — $15.00
  - Telegram Number — $6.00
- Cards are presentational and link into the marketplace page; no purchase logic here.

## Navbar

Restyle to a floating rounded dark bar (max-width container, `rounded-full`, #222 surface, subtle border) with orange active link, orange pill Login button, and the existing mobile menu behavior preserved.

## Technical notes

- New files: `src/components/VirtualNumbers.tsx`, `src/components/Marketplace.tsx`. Edited: `src/pages/Index.tsx`, `src/components/Hero.tsx`, `src/components/Navbar.tsx`, `src/index.css` (a `.section-label-caps` utility and a hero glow utility).
- Unsplash images referenced by remote URL with `loading="lazy"`, descriptive alt text, and fixed aspect ratios to avoid layout shift.
- All colors via existing semantic tokens (`background`, `card`, `border`, `muted-foreground`, `accent`) — no hardcoded hex in components.
- Zero horizontal overflow on mobile; decorative glows hidden below `sm`.
- No backend, auth, or data changes.

## Not included

The Login/Sign Up pages were already rebuilt on the split brand layout in the previous change; this plan does not touch them. Say the word if you want them revisited with Unsplash imagery in the brand panel.
