# Verix Brand Color Redesign — Black + Orange + White

Replace the current lavender/peach/violet system with a high-contrast black, orange and white identity, keeping Manrope as the typeface with a clear weight scale.

## Color system

| Role | Hex | HSL token value |
|---|---|---|
| Primary Black | #171717 | 0 0% 9% |
| Brand Orange | #F25623 | 15 89% 54% |
| White | #FFFFFF | 0 0% 100% |
| Off White (light bg) | #FAFAFA | 0 0% 98% |
| Border Light Gray | #E5E5E5 | 0 0% 90% |
| Muted Text Gray | #737373 | 0 0% 45% |
| Dark Gray | #262626 | 0 0% 15% |

Token mapping in `src/index.css`:
- `--background` white, `--card`/`--popover` white, page-level surfaces use off-white where a subtle tint is needed (`--muted` = off-white/light gray).
- `--foreground`, `--primary` = black #171717; `--primary-foreground` white.
- `--accent` = brand orange with white foreground; `--ring` = orange.
- `--secondary` = off-white with black foreground; `--muted-foreground` = #737373; `--border`/`--input` = #E5E5E5.
- Dark mode: `--background` #171717, surfaces #262626, borders lifted gray, accent stays orange.
- Sidebar tokens re-based on black/dark gray with orange active state.

Gradients and shadows get rebuilt off the new palette:
- `--gradient-hero`: white → off-white with a soft orange wash (no purple/peach).
- `--gradient-accent`: orange → deeper orange.
- `--gradient-footer`: off-white → light gray.
- `--shadow-card` / `--shadow-card-hover`: neutral black-based shadows instead of violet-tinted ones.

Semantic status colors (success, warning, destructive, toast variants) stay functional but are re-tuned to sit calmly next to orange.

## Typography

Manrope stays (already imported with 400–800).
- `tailwind.config.ts` `fontFamily.sans` changes from Inter to Manrope so utility classes match the body font.
- Weight usage: 400 body, 500 secondary labels, 600 buttons/nav, 700 headings, 800 major headings and prices.
- `.section-title` uses 800; card/section headings 700; buttons and nav links 600; muted labels 500.

## Component cleanup

- Remove the `violet`, `peach`, `lavender` custom colors from `tailwind.config.ts` and `index.css`, replacing them with an `orange` scale (DEFAULT / light / dark).
- `src/components/ui/button.tsx`: `accent` variant hover switches from `bg-violet-dark` to the orange dark token; `hero` stays black, `heroOutline` gets an orange-on-hover border treatment.
- Replace remaining `peach`/`violet-dark` usages in `Features.tsx`, `PhoneMockup.tsx`, `Testimonials.tsx`, and `marketplace/PurchaseSuccessModal.tsx` with orange/neutral tokens.

## Scope

Presentation only — CSS tokens, Tailwind config, and class names in existing components. No layout restructuring, no logic or backend changes.
