# Password Recovery — Frontend Contract Finish

Both pages already exist (`ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`) and already use the contract's Supabase calls. This pass closes the remaining gaps so the flow fully matches the contract: complete state coverage, security-safe messaging, and accessibility polish. No backend, no Edge Functions, no custom tokens.

## Current state (verified)

- `/forgot-password` calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + "/reset-password" })` and shows a generic "if an account exists" confirmation — contract-compliant.
- `/reset-password` listens for the `PASSWORD_RECOVERY` auth event, gates the form on a valid recovery session, and calls `supabase.auth.updateUser({ password })`.
- Routes `/forgot-password` and `/reset-password` are registered and public in `App.tsx`.

## Task 1 — Complete the state model

Forgot password:
- States: idle → loading → success → error (already present); add a resend cooldown (e.g. 60s disabled "Resend link" with countdown) instead of instant reset-to-form.
- Keep the confirmation text email-agnostic (never reveal account existence) — already the case; preserve it.

Reset password:
- States: invalid/expired link (already), ready form, loading, success (already), error.
- Add a "detecting recovery session…" loading state for the brief moment before the auth event resolves, so users don't flash the "invalid link" message while the session is being established.
- On success, sign out other sessions implicitly via `updateUser` (Supabase default) and keep the "Continue to login" action; auto-redirect to `/login` after ~3s as a fallback.

## Task 2 — Validation and accessibility

- Password rules: min 8 characters, mismatch check (already); add inline strength hint text.
- `aria-live="polite"` on error and status messages so screen readers announce state changes.
- Ensure visible focus states, labels tied to inputs (AuthInput already handles), and `autoComplete` attributes (`email`, `new-password` — already set).

## Task 3 — Verify end-to-end

- Trigger the forgot-password flow in the preview, confirm the email arrives via the configured SMTP/Resend, follow the link to `/reset-password`, set a new password, and log in with it.
- Confirm the invalid/expired-link state renders correctly when visiting `/reset-password` without a recovery session.

## Technical notes

- Files touched: `src/pages/ForgotPasswordPage.tsx`, `src/pages/ResetPasswordPage.tsx` only.
- No changes to Supabase config, Edge Functions, or auth backend. No service-role keys, no custom tokens.
- One operational note: Supabase dashboard must have `https://<site>/reset-password` in Auth → Redirect URLs for the recovery link to land correctly; this is a dashboard setting, not code.
