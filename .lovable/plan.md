

# Complete Supabase Authentication System

## Overview

Wire up the existing Login and Signup UI pages to Supabase Auth, add a profiles table with auto-creation, create an auth context provider, protect the dashboard route, and add logout functionality.

---

## Database Setup

### 1. Create `profiles` table

A `profiles` table will store user display information (username, avatar, etc.) and be linked to Supabase's `auth.users` table.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for trigger)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

### 2. Auto-create profile on signup (trigger)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## New Files to Create

### 1. `src/contexts/AuthContext.tsx` -- Auth Provider

A React context that:
- Sets up `onAuthStateChange` listener (before `getSession`)
- Exposes `user`, `session`, `loading`, `signOut` to the app
- Wraps the entire app in `App.tsx`

### 2. `src/components/auth/ProtectedRoute.tsx` -- Route Guard

A wrapper component that:
- Checks if user is authenticated via `useAuth()`
- If loading, shows a spinner
- If not authenticated, redirects to `/login`
- If authenticated, renders children

---

## Files to Modify

### 1. `src/pages/Login.tsx`

- Import `supabase` client and `useNavigate`
- Replace `console.log` in `handleSubmit` with `supabase.auth.signInWithPassword({ email, password })`
- Add loading state and error display using toast notifications
- On success, navigate to `/dashboard`
- If user is already logged in, redirect to `/dashboard`

### 2. `src/pages/Signup.tsx`

- Import `supabase` client and `useNavigate`
- Replace `console.log` in `handleSubmit` with `supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })`
- Add loading state and error display using toast notifications
- On success, show a "Check your email for confirmation" message or redirect to `/dashboard`

### 3. `src/App.tsx`

- Wrap routes with `AuthProvider`
- Wrap `/dashboard` route with `ProtectedRoute`

### 4. `src/components/dashboard/DashboardSidebar.tsx`

- Import `useAuth()` to get user data
- Replace hardcoded "John Doe" / "ID: 12345678" with actual user display name and ID
- Wire up the LogOut button to call `signOut()` and navigate to `/login`

### 5. `src/components/dashboard/MobileDashboard.tsx`

- Import `useAuth()` for user data in the mobile header
- Wire up sidebar logout

### 6. `src/components/Navbar.tsx`

- Import `useAuth()` to check if user is logged in
- If logged in: show "Dashboard" button instead of Login/Sign Up
- If not logged in: keep Login/Sign Up buttons as-is

---

## Authentication Flow

```text
User visits /signup
  -> Fills form, clicks "Sign Up"
  -> supabase.auth.signUp() called
  -> Supabase sends confirmation email
  -> User confirms email
  -> Profile auto-created via trigger
  -> User redirected to /login

User visits /login
  -> Fills form, clicks "Login"
  -> supabase.auth.signInWithPassword() called
  -> On success: session stored, redirect to /dashboard
  -> On failure: toast error message

User visits /dashboard (protected)
  -> ProtectedRoute checks auth state
  -> If no session: redirect to /login
  -> If session exists: render dashboard

User clicks LogOut
  -> supabase.auth.signOut() called
  -> Session cleared
  -> Redirect to /login
```

---

## Implementation Order

1. Run database migration (profiles table + trigger)
2. Create `AuthContext.tsx` with auth state management
3. Create `ProtectedRoute.tsx` component
4. Update `App.tsx` to wrap with AuthProvider and protect routes
5. Update `Login.tsx` with real Supabase auth
6. Update `Signup.tsx` with real Supabase auth
7. Update `DashboardSidebar.tsx` with user data and logout
8. Update `MobileDashboard.tsx` with user data
9. Update `Navbar.tsx` to show conditional auth state

---

## Technical Details

### Auth Context Shape

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}
```

### Session Listener Pattern

The `onAuthStateChange` listener will be set up BEFORE calling `getSession()` to avoid race conditions -- this is a Supabase best practice.

### Error Handling

- Invalid credentials: "Invalid email or password"
- Email not confirmed: "Please check your email to confirm your account"
- Network errors: "Something went wrong. Please try again."
- All errors shown via toast notifications (using existing Sonner)

### Email Confirmation

By default, Supabase requires email confirmation. After signup, users will see a message asking them to check their email. The `emailRedirectTo` option will be set to `window.location.origin` so users return to the app after confirming.

