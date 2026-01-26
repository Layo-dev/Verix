
# Auth Pages and Dashboard Implementation Plan

## Overview
Create the Login, Sign Up, and Dashboard pages for Verix, matching the provided screenshots while maintaining the existing brand design (lavender/peach color scheme, Inter font, clean modern aesthetic).

---

## Pages to Create

### 1. Login Page (`/login`)
A clean, centered login form with:
- "Login" heading (bold, large)
- "Login with" section with 4 social buttons (Google, Telegram, VK, Facebook)
- "Or" divider line
- Email/Login input field
- Password input field with eye toggle for show/hide
- "Forgot your password?" link
- Login button (full width)
- "New user? Sign up" link at bottom
- Floating Support button (bottom right)

### 2. Sign Up Page (`/signup`)
A clean, centered signup form with:
- "Sign Up" heading (bold, large)
- "Login with" section with 4 social buttons
- "Or" divider line
- Email input field with "Confirmation required" note
- Password input field with eye toggle
- Repeat password input field with eye toggle
- Terms checkbox with links to policies
- Sign Up button (full width)
- Floating Support button (bottom right)

### 3. Dashboard Page (`/dashboard`)
A two-column layout with sidebar navigation:

**Sidebar (left):**
- Verix logo at top
- Balance display ($0, Frozen balance: $0)
- "Top up" button (accent color)
- Navigation menu items:
  - Receive SMS (with icon, active state)
  - Mobile proxies
  - Number rent
  - Referral program
- Separator
- Secondary menu:
  - Refill balance
  - Tickets
  - Notifications (with toggle switch)
- "Show more" expandable
- Language selector (flag + "English")
- User profile section at bottom (name, ID, logout icon)

**Main Content Area:**
- "Receive SMS" heading
- Two-panel interface:
  - Left panel: "Buy a number" with country list (searchable, with flags)
  - Center panel: Service/app list (Facebook, Google, WhatsApp, etc. with prices)
  - Right panel: "My numbers" showing active orders or "No operations" empty state
- Settings section at bottom

---

## File Structure

```text
src/
├── pages/
│   ├── Login.tsx          (new)
│   ├── Signup.tsx         (new)
│   └── Dashboard.tsx      (new)
├── components/
│   ├── auth/
│   │   ├── SocialLoginButtons.tsx   (new - reusable social buttons)
│   │   ├── AuthInput.tsx            (new - input with password toggle)
│   │   └── SupportButton.tsx        (new - floating support button)
│   └── dashboard/
│       ├── DashboardSidebar.tsx     (new - sidebar navigation)
│       ├── CountryList.tsx          (new - country selector with flags)
│       ├── ServiceList.tsx          (new - app/service list with prices)
│       └── MyNumbers.tsx            (new - user's active numbers)
└── App.tsx                          (updated with new routes)
```

---

## Component Details

### SocialLoginButtons
- Four circular buttons in a row
- Icons: Google (multicolor G), Telegram (blue), VK (blue), Facebook (blue)
- Hover effects with subtle scale

### AuthInput
- Extended input component with optional password visibility toggle
- Eye/EyeOff icon button on the right
- Helper text support (for "Confirmation required")

### SupportButton
- Fixed position bottom-right
- Blue circular button with chat bubble icon
- "Support" label
- Hover animation

### DashboardSidebar
- Uses existing Sidebar UI components from shadcn
- Custom styling to match screenshot (dark sidebar background)
- Switch component for notifications toggle
- Collapsible on mobile

### CountryList
- Scrollable list with search input
- Country flags using emoji or flag sprites
- Active state highlighting (blue background for selected country)
- Country code displayed (+49, +44, etc.)

### ServiceList
- Scrollable list of services/apps
- Each item shows: app icon, name, availability count, price in accent color
- Search input at top

### MyNumbers
- Empty state with info icon and "No operations" message
- Will show active number orders when populated

---

## Routing Updates

Update `App.tsx` to add:
```text
/login     -> Login page
/signup    -> Signup page  
/dashboard -> Dashboard page
```

Update Navbar to link Login/Sign Up buttons to actual routes.

---

## Design Specifications

### Colors (from existing design system)
- Primary accent: `hsl(270 80% 60%)` (violet)
- Active sidebar item: `hsl(200 100% 50%)` (blue)
- Background: white/light lavender
- Text: dark gray for headings, muted gray for labels

### Typography
- Headings: Inter, 700 weight, 2xl-3xl size
- Body: Inter, 400-500 weight, sm-base size
- Links: accent color, hover underline

### Spacing
- Auth forms: max-width 400px, centered
- Dashboard sidebar: 250px width on desktop
- Content padding: 24-32px

### Responsive Behavior
- Auth pages: centered card on all screens
- Dashboard: sidebar collapses to hamburger menu on mobile
- All content remains visible without horizontal scroll

---

## Technical Notes

### Form Validation (Client-side only for now)
- Email format validation
- Password minimum length (8 characters)
- Password confirmation match
- Required field indicators

### State Management
- Local React state for form inputs
- Sidebar collapse state
- Country/service selection state

### Accessibility
- Proper form labels and ARIA attributes
- Keyboard navigation support
- Focus states on interactive elements

---

## Implementation Order

1. Create shared auth components (SocialLoginButtons, AuthInput, SupportButton)
2. Build Login page
3. Build Signup page
4. Update App.tsx with routes and Navbar links
5. Create dashboard components (Sidebar, CountryList, ServiceList, MyNumbers)
6. Build Dashboard page with full layout
7. Test responsive behavior on all screen sizes
