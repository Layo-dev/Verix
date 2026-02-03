
# Mobile and Tablet Dashboard Responsive Implementation

## Overview

Transform the "Receive SMS" dashboard page to be fully responsive for mobile and tablet devices, matching the provided screenshots. The mobile design uses a different UI pattern with bottom sheets/modals for country and service selection instead of the three-column desktop layout.

---

## Design Analysis from Screenshots

### Screenshot 1: Service Selection Modal (Mobile)
- Full-screen modal with "Website or service" header and X close button
- Search input with "Find a site or service" placeholder
- Scrollable list with favorite star icons, service icons, and service names
- Selected item has light blue background highlight

### Screenshot 2: Main Mobile View
- Header: hamburger menu icon, "Receive SMS" title, wallet icon, "$0" balance
- Tab bar: "Buy a number" (active/blue text) | "My numbers" (inactive)
- Selected service chip: Telegram icon + name in light blue pill
- Selected country chip: Morocco flag + "+212" with settings icon
- Full-width blue "Buy a number for $1" button
- Floating chat support button (bottom right)

### Screenshot 3: Country Selection Modal (Mobile)
- Full-screen modal with "Country" header and X close button
- Search input with "Find a country" placeholder and sort icon button
- Scrollable list with:
  - Favorite star icon
  - Country flag emoji
  - Country name + phone code
  - Availability count (e.g., "9977")
  - Price in blue (e.g., "$1")
  - Status dot indicator (blue/red)

---

## Implementation Strategy

### Approach: Conditional Rendering Based on Screen Size
- Use the existing `useIsMobile` hook to detect mobile/tablet screens
- **Mobile (< 768px)**: Show compact card-based UI with sheet modals for selection
- **Tablet/Desktop (>= 768px)**: Keep existing three-column grid layout

---

## Files to Modify

### 1. `src/pages/DashboardPage.tsx`
Add mobile-specific layout with:
- Tab bar for "Buy a number" / "My numbers" toggle
- Compact selection display (service chip + country chip)
- "Buy a number for $X" action button
- Sheet triggers for country/service modals

### 2. `src/components/dashboard/CountryList.tsx`
Add:
- Availability count display (e.g., "9977")
- Price column (e.g., "$1")
- Status indicator dot (blue/red based on availability)
- Sort button in header
- Modal/Sheet variant for mobile use

### 3. `src/components/dashboard/ServiceList.tsx`
Add:
- Favorite star icon on each row
- Modal/Sheet variant for mobile use
- Simplified mobile item display

### 4. Create `src/components/dashboard/MobileDashboard.tsx`
New component containing:
- Mobile header with menu, title, wallet balance
- Tab bar component
- Selected service/country display chips
- Buy button with dynamic price
- Sheet modals for country and service selection

---

## Detailed Component Specifications

### MobileDashboard Component Structure

```text
MobileDashboard
├── Header
│   ├── Menu Button (hamburger icon)
│   ├── "Receive SMS" title
│   ├── Wallet Icon
│   └── Balance Display ("$0")
│
├── Tab Bar
│   ├── "Buy a number" tab (active state)
│   └── "My numbers" tab
│
├── Selection Area (when "Buy a number" tab active)
│   ├── Service Chip (triggers service sheet)
│   │   └── Icon + Service Name in blue pill
│   │
│   ├── Country Chip (triggers country sheet)
│   │   └── Flag + Phone Code + Settings icon
│   │
│   └── Buy Button
│       └── "Buy a number for $X" (full-width blue button)
│
├── My Numbers Area (when "My numbers" tab active)
│   └── Empty state or orders list
│
├── Service Selection Sheet
│   ├── Header: "Website or service" + X button
│   ├── Search input
│   └── Scrollable service list
│
├── Country Selection Sheet
│   ├── Header: "Country" + X button
│   ├── Search input + Sort button
│   └── Scrollable country list with prices
│
└── Support FAB (floating action button)
```

### Mobile Header Specifications
- Height: 48-56px
- Background: white/card background
- Left: Menu icon (opens sidebar sheet)
- Center: "Receive SMS" title (bold, 18px)
- Right: Wallet icon + "$0" balance

### Tab Bar Specifications
- Full-width with two equal tabs
- Active tab: Blue text color (#00A3FF)
- Inactive tab: Muted gray text
- Background: Light gray/muted rounded container
- Padding: 8px vertical, rounded-full corners

### Selection Chips
- Service chip: Light blue background, blue text, rounded-full
- Country chip: Light gray background, dark text, rounded-lg, with settings icon
- Both should be tappable to open respective sheets

### Country List Mobile Enhancements
- Add `count` and `price` fields to country data
- Display format: `Flag | Name (Code) | Count | $Price | Dot`
- Status dot: Blue for available, Red for low stock
- Include favorite star icon (outline) on left

### Buy Button
- Full-width, rounded-full
- Blue background (#00A3FF)
- White text: "Buy a number for $X"
- Price derived from selected country + service

---

## Updated Data Structures

### Extended Country Type
```typescript
interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
  count: number;      // NEW: availability count
  price: number;      // NEW: price in USD
  status: 'high' | 'low';  // NEW: stock status
}
```

### Extended Service Type
```typescript
interface Service {
  id: string;
  name: string;
  icon: string;
  count: number;
  price: number;
  isFavorite?: boolean;  // NEW: for star icon state
}
```

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 768px (mobile) | Single column, sheet modals, tab interface |
| 768-1023px (tablet) | Two-column grid, inline lists |
| >= 1024px (desktop) | Three-column grid, full sidebar |

---

## Implementation Order

1. **Create MobileDashboard component** with basic structure
2. **Update CountryList** with extended data and mobile sheet variant
3. **Update ServiceList** with favorite icons and mobile sheet variant
4. **Modify DashboardPage** to conditionally render MobileDashboard vs desktop layout
5. **Add Sheet components** for country and service selection
6. **Style and polish** for consistent spacing and alignment
7. **Test responsive behavior** across all breakpoints

---

## Technical Notes

### Sheet Modal Behavior
- Use `Sheet` component from shadcn/ui with `side="bottom"` for mobile
- Full height sheets (95vh) for selection lists
- Smooth slide-up animation
- Close on backdrop click or X button

### State Management
- Lift `selectedCountry` and `selectedService` state to parent
- Pass down to both desktop and mobile components
- Calculate total price based on selections

### Accessibility
- Proper ARIA labels for sheet triggers
- Focus management when sheets open/close
- Keyboard navigation within lists

### No Horizontal Scroll
- All content constrained within viewport
- Use `overflow-x-hidden` on containers
- Proper padding on mobile (16px sides)
