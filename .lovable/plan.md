# DashboardSidebar / Hamburger Menu Redesign

## Goal
Replace the current DashboardSidebar with a clean, dark account-and-support menu that matches the Verix brand system (black #171717, white typography, orange active state) and uses Hugeicons. Remove all navigation links that are no longer part of this menu.

## What will change

### 1. `src/components/dashboard/DashboardSidebar.tsx`
- Remove: logo block, balance/Fund block, Receive SMS / SMS Inbox / Marketplace / History / Orders links, TopUpModal import/usage, `useProfileBalance` import.
- Keep: auth user info, sign-out logic, notifications toggle.
- New structure (top to bottom):
  - Close button row (×) — only meaningful inside the mobile Sheet; on desktop the persistent sidebar can omit it or keep a subtle collapse trigger.
  - **ACCOUNT** section label
    - Profile
    - Notifications (with Switch toggle on the same row)
    - Settings
  - **SUPPORT** section label
    - Help & Support
  - Separator
  - User block: display name + "Account ID" label
  - Log out row
- Styling:
  - Background: `bg-[#171717]` / `bg-sidebar` token (force dark surface).
  - Text: white / `text-sidebar-foreground`.
  - Section labels: uppercase, small, muted gray (`#737373`).
  - Active item: orange background (`bg-accent`) with white text and orange icon tint.
  - Hover: subtle white/gray overlay.
  - Icons: Hugeicons (`UserIcon`, `Notification03Icon`, `Settings01Icon`, `CustomerSupportIcon`, `Logout02Icon`, `Cancel01Icon` or equivalent verified names).

### 2. `src/components/dashboard/mobile/MobileHeader.tsx`
- No structural change needed; it already opens the sidebar Sheet and uses Hugeicons.
- Confirm the Sheet still renders `DashboardSidebar contentOnly` and that the new dark menu fills the Sheet correctly.

### 3. Routes / dead links
- The removed sidebar links (Receive SMS, SMS Inbox, Marketplace, History, Orders) are still reachable via the mobile bottom nav and direct URLs. This plan only changes the sidebar/hamburger menu; it does not remove those routes.

## Acceptance criteria
- Sidebar background is black (#171717), text is white, no blue active state remains.
- Only ACCOUNT and SUPPORT groups plus user info and logout are shown.
- All icons come from `@hugeicons/core-free-icons` via `HugeiconsIcon`.
- Mobile Sheet slides out from the left and shows the same menu.
- Build passes without type errors.
