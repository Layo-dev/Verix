

# Display Hero Image Instead of PhoneMockup

## Changes

### `src/components/Hero.tsx`

- Comment out `<PhoneMockup />` (keep import commented too)
- Import `HeroImage` from `@/assets/Hero-image.webp`
- Replace the PhoneMockup with an `<img>` tag displaying the hero image
- Keep the same container div and sizing classes so it matches the PhoneMockup dimensions (~w-72 md:w-80, with the same padding/positioning)

### No other files changed

`PhoneMockup.tsx` stays in the codebase untouched.

