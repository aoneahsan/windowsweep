# Edge function code patterns and rationale

The client factories, the CORS preflight handler, and why a Supabase project uses functions rather than a Worker.

## Client factories

```ts
// _shared/supabase.ts
import {createClient} from 'npm:@supabase/supabase-js@2';

/** Runs AS THE USER. RLS applies. This is the default. */
export function userClient(req: Request) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')!)['default'],
    {global: {headers: {Authorization: req.headers.get('Authorization')!}}},
  );
}

/** Bypasses RLS entirely. Every use needs a stated reason. */
export function adminClient() {
  const key = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')!)['default'];
  return createClient(Deno.env.get('SUPABASE_URL')!, key);
}
```

Those JSON dictionaries are the current hosted defaults. Legacy/self-hosted projects may still expose
`SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`; do not ask for or introduce legacy keys in a new hosted
integration. Secret keys still authorize as the `service_role` database role and bypass RLS.

Forgetting the `Authorization` header creates an **anonymous** client — the function then silently reads and
writes nothing, or fails with a permission error that looks like a policy bug.

## CORS

```ts
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', {headers: cors});   // ← the preflight
  // …
  return new Response(JSON.stringify(data), {headers: {...cors, 'Content-Type': 'application/json'}});
});
```

## Why not a Worker

**Three concrete advantages over a Worker here, beyond one platform instead of two:** the caller's JWT
arrives in the request so RLS keeps applying without you rebuilding auth; the function is beside the data,
so an aggregation is a query rather than a round trip; and the secret sits in the same store as every other
project secret rather than a second one to keep alive.
