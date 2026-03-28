

# Fix paystack-verify 500 Error

## Root Cause Analysis

Two issues identified:

### Issue 1: CORS headers are incomplete
The `_shared/cors.ts` file only allows `authorization, x-client-info, apikey, content-type` but the Supabase JS client (v2.95.3) sends additional headers: `x-supabase-client-platform`, `x-supabase-client-platform-version`, `x-supabase-client-runtime`, `x-supabase-client-runtime-version`. This can cause the preflight OPTIONS request to fail, which the browser reports as a network error (sometimes seen as 500).

### Issue 2: `declare const Deno` in provider.ts shadows the global
`supabase/functions/_shared/provider.ts` lines 16-20 have a `declare const Deno` block. While this is a type-only declaration and shouldn't cause runtime issues in most Deno versions, it's unnecessary in edge functions (where Deno is globally available) and could cause compilation issues in certain Deno versions used by Supabase edge runtime.

### Issue 3: Possible boot crash (no logs = function never started)
"No logs found" typically means the function crashed during module loading/compilation, not during request handling. The `jsr:@supabase/supabase-js@2` import in `_shared/supabase.ts` or the `declare const Deno` could be causing a module-level crash.

## Fix Plan

### 1. Update CORS headers (`supabase/functions/_shared/cors.ts`)
Add the missing Supabase client headers:
```
"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version"
```

### 2. Remove `declare const Deno` from provider.ts
Delete lines 16-20 in `supabase/functions/_shared/provider.ts`. The Deno global is already available in edge functions and doesn't need to be declared.

### 3. Add error logging to paystack-verify
Add a `console.error` before returning the 500 in the catch block so future errors are visible in logs:
```typescript
} catch (e) {
  console.error("paystack-verify error:", e);
  return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
}
```

### 4. Redeploy
After these changes, the edge functions will auto-redeploy. The CORS fix ensures the browser preflight succeeds, and removing the Deno declaration eliminates any potential compilation issue.

## Files Changed
- `supabase/functions/_shared/cors.ts` -- update CORS headers
- `supabase/functions/_shared/provider.ts` -- remove `declare const Deno`
- `supabase/functions/paystack-verify/index.ts` -- add console.error logging
- `supabase/functions/paystack-init/index.ts` -- add console.error logging (same pattern)

