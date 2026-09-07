# Support, Legal, and Forgot Password Pages

Three new mobile-first pages built on the existing Verix dark system (#171717 surfaces, orange #F25623 accents, Satoshi type, Hugeicons).

## Task 1 — Support Page (`/dashboard/support`)

Mobile-first single column, max width ~640px on larger screens, centered.

Sections top to bottom:
1. Header row: "Support Center" heading + short helper line, with a support illustration on the right (generated brand-styled headset/chat image).
2. Notice banner: red-tinted card with info icon — "Please use one channel only per issue."
3. "Contact channels" row with a green pill on the right: "Fast response usually in minutes".
4. Channel cards grid — 3 across on mobile (as in reference), wider spacing on desktop: WhatsApp, Telegram, Email. All three active links; placeholder targets for now so real handles can be dropped in later.
5. "Before you reach out" list: three info cards (Response Time, What to Include, Safe & Secure) each with a circular orange-tinted icon badge, title, and description.

## Task 2 — Terms & Privacy Page (`/legal`)

Single page holding both Terms and Conditions and the Privacy Policy.
- Centered logo, page title, "Last updated" line.
- Numbered sections with short placeholder copy (Introduction, About Verix, Accounts, Payments and Refunds, Acceptable Use, Privacy Policy, Data We Collect, Contact) — brief text intended to be edited later.
- Readable measure (~70ch), generous vertical rhythm, sticky-free simple scroll, back link at top.
- Linked from the landing footer and from the signup consent line.

## Task 3 — Forgot Password (`/forgot-password`)

UI only, no requests sent.
- Uses the existing split `AuthLayout` so it matches Login/Signup.
- Step 1 look: heading "Forgot password?", helper text, email field, "Send reset link" button, "Back to login" link.
- Static success state shown after submit (local state only) confirming the email was sent, with a "Resend" text button. No backend calls.
- "Forgot password?" link on the Login page points here.

## Technical notes

- New files: `src/pages/SupportPage.tsx`, `src/pages/LegalPage.tsx`, `src/pages/ForgotPasswordPage.tsx`, plus small support subcomponents if the file grows.
- Routes added in `src/App.tsx`: `/dashboard/support` (protected), `/legal` and `/forgot-password` (public).
- Footer and Signup get legal links; Login gets the forgot-password link.
- Only presentation code; no backend, schema, or auth logic changes.
