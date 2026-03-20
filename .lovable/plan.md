

# Fix Double Sidebar Issue

## Problem

`DashboardSidebar` has its own mobile toggle button, overlay, and slide-in logic built in. When `MobileDashboard` wraps it inside a `Sheet`, two sidebars appear -- one from the Sheet and one from DashboardSidebar's internal mobile toggle.

## Root Cause

- `DashboardSidebar` renders a fixed hamburger button on mobile + its own overlay + slide-in aside
- `MobileDashboard` opens `DashboardSidebar` inside a `<SheetContent>`, which adds another layer

## Solution

Split `DashboardSidebar` into two parts:

### 1. `DashboardSidebar` -- Pure content component (no mobile toggle logic)

Remove:
- The mobile hamburger toggle button (`fixed top-4 left-4`)
- The mobile overlay div (`fixed inset-0 bg-black/50`)
- The `isOpen` state and conditional transform classes

Keep the `<aside>` as a simple static sidebar for desktop use only (always visible on `lg+`). On smaller screens, hide it with `hidden lg:flex`.

### 2. Update `MobileDashboard`

- Continue using `Sheet` with `side="left"` to show sidebar content
- Render only the sidebar inner content (logo, balance, nav, user profile) inside the Sheet -- not the full `DashboardSidebar` component with its own wrapper
- Extract sidebar content into a reusable `SidebarContent` component or pass a prop to `DashboardSidebar` to render content-only mode

### 3. Update `SmsInboxPage`

- Desktop: use `DashboardSidebar` as-is (static sidebar)
- Mobile: already doesn't render sidebar, no changes needed

## Approach: Add `contentOnly` prop

Add an optional `contentOnly` prop to `DashboardSidebar`. When true, render only the inner content (no wrapper `<aside>`, no mobile toggle). When false/undefined, render the full desktop sidebar.

This keeps changes minimal:
- `DashboardSidebar`: remove mobile toggle/overlay, keep desktop static sidebar, export content via prop
- `MobileDashboard`: pass `contentOnly` when rendering inside Sheet
- `DashboardPage`: hide sidebar on mobile (already handled by `isMobile` check)
- `SmsInboxPage`: no changes needed

## Files to Modify

1. **`src/components/dashboard/DashboardSidebar.tsx`** -- Remove mobile hamburger/overlay, make sidebar desktop-only (`hidden lg:flex lg:static`), accept `contentOnly` prop to render just inner content
2. **`src/components/dashboard/MobileDashboard.tsx`** -- Use `<DashboardSidebar contentOnly />` inside Sheet, close sidebar on nav link click
3. **`src/pages/DashboardPage.tsx`** -- Remove `pl-12` padding hack (no longer needed without floating hamburger)

## Layout Reference (from screenshots)

- Desktop: dark sidebar always visible on left, main content on right
- Mobile: hamburger icon in header opens sidebar as a slide-over sheet from left, dark background with full navigation
- Sidebar items: Receive SMS (active/blue highlight), Mobile proxies, Number rent, Referral program, then separator, Refill balance, Tickets, Notifications toggle, Show more, Language selector, User profile at bottom

