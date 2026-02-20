
# Fix Mobile Dashboard: Remove Duplicate Sidebar + Add Scroll

## The Problem

There are two conflicting elements on mobile:

1. **Duplicate sidebar triggers**: `DashboardSidebar` always renders its own floating hamburger button (`fixed top-4 left-4`). But `MobileDashboard` also renders `DashboardSidebar` inside a Sheet that has its own header hamburger button. This means mobile users see two hamburger buttons and two sidebar controls fighting each other.

2. **No scroll**: The "Buy a number" content area uses `flex-1` but has no `overflow-y-auto`, so content that overflows the screen is clipped and unreachable.

---

## The Fix

### 1. `src/components/dashboard/DashboardSidebar.tsx`

Add an optional `hideMobileToggle` boolean prop. When `true`, the floating hamburger button and mobile overlay are suppressed. This way:
- Desktop: renders normally with the sidebar visible
- `MobileDashboard` usage: passes `hideMobileToggle={true}` so only the Sheet-controlled sidebar content appears, with no rogue floating button

```typescript
interface DashboardSidebarProps {
  hideMobileToggle?: boolean;
}
```

The floating `<button>` at `fixed top-4 left-4`, the dark overlay `<div>`, and the `isOpen` state logic are all guarded by `!hideMobileToggle`.

### 2. `src/components/dashboard/MobileDashboard.tsx`

Two changes:

**a) Pass `hideMobileToggle` to `DashboardSidebar`:**
```tsx
<SheetContent side="left" className="p-0 w-[280px]">
  <DashboardSidebar hideMobileToggle />
</SheetContent>
```

**b) Make the content area scrollable:**

Change the content wrapper from:
```tsx
<div className="flex-1 p-4">
```
to use `overflow-y-auto` with a fixed height so it scrolls within the screen:
```tsx
<div className="flex-1 overflow-y-auto p-4">
```

This ensures the "Buy a number" tab content (service chip, country chip, buy button) and the "My numbers" tab content are both scrollable on small screens without overflowing the viewport.

---

## Files to Modify

- `src/components/dashboard/DashboardSidebar.tsx` — add `hideMobileToggle` prop to suppress its own floating mobile button
- `src/components/dashboard/MobileDashboard.tsx` — pass `hideMobileToggle` to `DashboardSidebar` and add `overflow-y-auto` to content area
