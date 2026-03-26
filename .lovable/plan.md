

# Add Sidebar Menu Button to SMS Inbox Mobile Header

## Problem
On mobile, the SMS Inbox page header has no way to open the dashboard sidebar for navigation.

## Solution
Add a hamburger menu button to the mobile header in `SmsInboxPage.tsx` that opens `DashboardSidebar` in a `Sheet` (same pattern used by `MobileDashboard`).

## Changes

### `src/pages/SmsInboxPage.tsx`
- Import `Sheet`, `SheetContent`, `SheetTrigger` and `Menu` icon
- Import `DashboardSidebar`
- Add `sidebarOpen` state
- Replace the empty `<div className="w-7" />` placeholder (line 104) with a `Menu` button that opens a left-side Sheet containing `<DashboardSidebar contentOnly onNavigate={() => setSidebarOpen(false)} />`
- When a number is selected (back arrow shown), keep the back arrow but also add the menu button — replace the `Settings` button on the right with the `Menu` button, or place menu as the leftmost element

**Mobile header layout:**
```
[ ☰ Menu ]  "SMS Inbox"  [ ⚙ Settings ]
```
When a number is selected:
```
[ ← Back ]  "+1234..."   [ ⚙ Settings ]
```
The menu button replaces the empty spacer div when no number is selected, and can be accessed via the sidebar from anywhere.

### No changes to `SmsFeed.tsx`
The menu belongs in the page-level header, not inside the SmsFeed component, since SmsFeed is a reusable content panel.

