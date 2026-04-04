

# Fetch Pricing from Database

## Problem
Country and service pricing is hardcoded in three frontend files (`CountryList.tsx`, `ServiceList.tsx`, `MobileDashboard.tsx`). The DB tables `country_pricing` and `service_pricing` exist but have RLS policies that block all access (`false`).

## Changes

### 1. Database Migration: Add SELECT RLS policies
Add `SELECT` policies on `country_pricing` and `service_pricing` for `authenticated` users so the frontend can read them.

```sql
CREATE POLICY "Authenticated users can read country pricing"
ON public.country_pricing FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read service pricing"
ON public.service_pricing FOR SELECT TO authenticated USING (true);
```

### 2. New hook: `src/hooks/usePricing.ts`
- Fetch `country_pricing` and `service_pricing` from Supabase on mount using `useQuery`
- Export `useCountryPricing()` and `useServicePricing()` hooks
- Return `{ data, isLoading }` with typed arrays
- Map DB rows to the shape the UI components expect (add icon mapping for services, phoneCode/status for countries)

### 3. Update `src/components/dashboard/CountryList.tsx`
- Remove hardcoded `countries` array
- Accept `countries` and `loading` as props (fetched from hook in parent)
- Show skeleton/spinner while loading

### 4. Update `src/components/dashboard/ServiceList.tsx`
- Remove hardcoded `services` array and its export
- Accept `services` and `loading` as props
- Show skeleton/spinner while loading

### 5. Update `src/components/dashboard/MobileDashboard.tsx`
- Remove hardcoded `countries` array and `services` import
- Accept `countries` and `services` as props
- Show skeleton/spinner while loading

### 6. Update `src/pages/DashboardPage.tsx`
- Call `useCountryPricing()` and `useServicePricing()` hooks
- Pass data down to `CountryList`, `ServiceList`, and `MobileDashboard`

### 7. Update `src/components/Pricing.tsx` (landing page)
- Fetch `service_pricing` from DB (or keep static since landing page may not require auth -- will use the existing hardcoded data as fallback for unauthenticated visitors)

## Icon Mapping Strategy
Since DB rows don't store icons, create a `serviceIconMap` lookup (`Record<string, IconType>`) mapping `service_id` to react-icons components. Unknown services get a generic icon.

## Files Changed
1. **Migration** -- RLS SELECT policies for pricing tables
2. `src/hooks/usePricing.ts` -- new hooks
3. `src/components/dashboard/CountryList.tsx` -- props-driven
4. `src/components/dashboard/ServiceList.tsx` -- props-driven
5. `src/components/dashboard/MobileDashboard.tsx` -- props-driven
6. `src/pages/DashboardPage.tsx` -- fetch and pass data

