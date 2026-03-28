

# Fix HeroSMS Country/Service Name Mapping

## Problem

The HeroSMS API's `getCountries` and `getServicesList` endpoints return data, but the fuzzy name matching fails to find "Russia" and "Facebook". This means either:
1. The API response format differs from what the code expects (e.g., countries returned as an object/map instead of an array, or fields named differently than `eng`/`rus`)
2. The service names in the API don't match (e.g., "Facebook" might be listed as "fb" or "Фейсбук")

## Fix

### `supabase/functions/_shared/provider.ts`

**Add debug logging** before the mapping failure to capture what the API actually returns, so we can see the real field names and values:

```typescript
console.log("HeroSMS countries sample:", JSON.stringify(heroCountries.slice(0, 3)).slice(0, 500));
console.log("HeroSMS services sample:", JSON.stringify(heroServices.slice(0, 3)).slice(0, 500));
console.log(`Searching for country="${ui.countryName}" (norm="${uiCountryNorm}"), service="${ui.serviceName}" (norm="${uiServiceNorm}")`);
```

**Handle object-style responses**: The `getCountries` API may return an object like `{ "0": { "eng": "Russia", ... }, "1": { ... } }` instead of an array. Convert it:

```typescript
const heroCountries = Array.isArray(countriesResp) 
  ? countriesResp 
  : typeof countriesResp === "object" && countriesResp !== null
    ? Object.values(countriesResp)
    : [];
```

Same for services — `servicesResp` might not have a `.services` property, or it could be an object:

```typescript
const rawServices = servicesResp?.services ?? servicesResp;
const heroServices = Array.isArray(rawServices)
  ? rawServices
  : typeof rawServices === "object" && rawServices !== null
    ? Object.values(rawServices)
    : [];
```

**Broaden country field matching**: Some SMS APIs use `name`, `title`, or `country_name` instead of `eng`/`rus`. Check all string fields:

```typescript
const heroCountry = heroCountries.find((c: any) => {
  const fields = Object.values(c).filter((v): v is string => typeof v === "string");
  return fields.some(f => {
    const norm = normalize(f);
    return norm === uiCountryNorm || norm.includes(uiCountryNorm) || uiCountryNorm.includes(norm);
  });
}) ?? null;
```

**Broaden service matching** similarly — check `name`, `code`, `title`, and any other string fields.

### Files changed
- `supabase/functions/_shared/provider.ts`

