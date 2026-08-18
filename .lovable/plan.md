# Login & Sign Up Redesign — Split Brand Layout

## Layout (both pages, identical visual system)

Desktop (lg+): two panels in one full-height screen.

```text
┌───────────────────────┬──────────────────────────────┐
│  BRAND PANEL  ~45%    │  FORM PANEL  ~55%            │
│  Verix. logo (top)    │  Heading                     │
│                       │  Subtext                     │
│  Receive SMS.         │  [G][TG][VK][FB]             │
│  Build Your Digital   │  ───── OR ─────              │
│  Workflow.            │  Labeled inputs              │
│                       │  Forgot password? / terms    │
│  supporting copy      │  [ Orange CTA ]              │
│  ▬ orange accent bar  │  Switch-page link            │
└───────────────────────┴──────────────────────────────┘
```

Below lg: brand panel collapses to a compact header (logo + one-line tagline), form stacks full width, centered, comfortable padding. Support button stays.

## Brand panel
- Background `#171717` with a subtle non-generic treatment: soft radial orange glow at low opacity plus a faint diagonal line/grid texture, both decorative and hidden on small screens.
- Headline in Manrope 800, white; supporting copy in muted gray; a short orange accent bar under the copy.

## Form panel
- Slightly lighter surface (`#1F1F1F`-range card token) against the page.
- Heading 700, subtext muted.
- Social row: existing four circular buttons (Google wired, others unchanged).
- OR divider.
- Inputs get visible labels above them; input surface `#2A2A2A`, border `#333`, orange focus ring.
- Primary button: solid orange, 700 weight, full width.

## Login
Heading "Login", subtext "Welcome back to VerixSMS. Access your account and continue." Fields: Email (label "Email or login", email input, email-only auth unchanged), Password with eye toggle. Forgot password link right-aligned. CTA "Login". Footer: "Don't have an account? Sign up".

## Sign Up
Same shell. Heading "Create your Verix account", subtext "Start receiving SMS verification numbers in minutes." Fields: Email, Password, Confirm password (no username field). Terms checkbox. CTA "Create account". Footer: "Already have an account? Login".

Step 2 (email OTP) stays exactly as today functionally — restyled to sit inside the same right panel: back link, "Verify your email", masked email, 6-slot OTP, resend countdown.

## Color rule enforcement
Black for structure, white for content, gray for secondary text, orange reserved for CTA, links, focus and the accent bar only. Dark tokens in `index.css` tuned to the given hierarchy (bg #171717, card #222, input surface #2A2A2A, border #333, muted #A3A3A3, secondary #D4D4D4, orange #F25A26).

## Technical notes
- Files: `src/pages/Login.tsx`, `src/pages/Signup.tsx`, `src/components/auth/AuthInput.tsx` (label styling + dark input surface), new `src/components/auth/AuthLayout.tsx` shared shell, `src/index.css` (dark token tuning + a decorative background utility).
- No auth logic changes: same `signInWithPassword`, same `send-otp` / `verify-otp` / `signUp` sequence, same redirects. No backend/database changes.
- All colors via semantic tokens — no hardcoded hex in components.
