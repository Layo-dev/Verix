# Google OAuth wiring (frontend only)

Supabase Google provider is already configured. This plan only touches frontend code.

## Changes

### 1. `src/components/auth/SocialLoginButtons.tsx`
- Make the Google button trigger Supabase OAuth:
  ```ts
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/dashboard` },
  });
  ```
- Add a local `isLoading` state, disable the button + swap icon for `Loader2` while redirecting.
- Show a `toast.error` on failure (sonner, matching existing pages).
- Leave Telegram / VK / Facebook buttons inert for now (no behavior change).

### 2. `src/contexts/AuthContext.tsx`
- No code change needed — `onAuthStateChange` already picks up the session after the OAuth redirect, and `ProtectedRoute` + the `useEffect` redirects on `/login` and `/signup` will land the user on `/dashboard`.

### 3. No new routes
- `redirectTo` points at `/dashboard` (a protected route). Supabase appends the auth hash; `onAuthStateChange` consumes it and `ProtectedRoute` renders the dashboard.
- The existing `handle_new_user` trigger auto-creates the profile row for first-time Google sign-ins, so signup and login share the same button.

## Out of scope
- No Supabase dashboard / provider changes (already done by user).
- No edits to other social buttons.
- No new pages, no changes to `App.tsx` routes.
