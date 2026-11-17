---
name: aoneahsan-cccs-supabase-edge-functions
description: 'Supabase Edge Functions: Deno structure and shared code, secrets and CORS, invoking with the caller''s JWT so RLS still applies, the service-role escape hatch and its rules, scheduled idempotent jobs with pg_cron, and the free-tier invocation envelope. THE default backend for any Supabase project - use for ANY server-side logic, secret-holding proxy, AI call, webhook or cron there, in place of a Cloudflare Worker; no new Workers since 2026-10-22. Use when adding server-side logic, or on a 401 or CORS error.'
metadata:
  author: aoneahsan
  source: LifeWell rebuild skill-gap brief, 03-SKILL-GAPS.md Tier B
---

# Supabase Edge Functions

`aoneahsan-cccs-supabase` covers schema, RLS and the hosted-only provisioning gate. This covers the compute layer —
Deno functions at the edge, which is where logic goes that the client must not be trusted with.

**The standard: a function runs as the calling user unless it has a stated reason not to.**

## 🔴 On a Supabase project, this IS the backend (owner directive, 2026-08-19)

Server-side work on a Supabase project goes here — not into a Cloudflare Worker. Secret-holding proxies,
AI calls, webhooks, cron, anything the client must not be trusted with. Owner, verbatim: *"if we are on
supabase we get access to it's supabase edge functions for free … we must not use a extra piece for things
our backend can already handle"*.

Cloudflare Workers remain correct for projects with **no** backend of their own — the Firebase-Firestore
ones, where Functions needs the paid Blaze plan. That is the case the Workers rule was written for, and the
only one it still covers. Full rule: `~/.claude/rules/services-integrations.md` → *Backend compute*.

Why a function beats a Worker here (the JWT, data locality, one secret store): `references/patterns.md` →
*Why not a Worker*.

## Structure

```
supabase/functions/
  _shared/
    cors.ts          one CORS helper, imported by every function
    supabase.ts      client factories — one for the caller, one elevated
    email/           the ONE branded email module — layout, catalogue, one composer per email
  send-welcome/index.ts
  recompute-streaks/index.ts
```

Deno, web-standard APIs, npm via `npm:` specifiers. No bundler.

🔴 A sender like `send-welcome` never writes HTML — it calls a composer from `_shared/email/`. Standard:
`aoneahsan-cccs-email-campaigns/references/transactional-email-layout.md`.

## 🔴 Pass the caller's JWT, or RLS stops applying

`userClient(req)` forwards the caller's `Authorization` header so RLS applies (the default); `adminClient()`
uses the secret key and bypasses RLS — every use needs a stated reason. Forgetting the header creates an
**anonymous** client. Read `references/patterns.md` → *Client factories* when writing `_shared/supabase.ts` or
choosing between hosted and legacy keys.

### When elevated access is legitimate

Cross-user aggregation · scheduled jobs with no caller · admin operations already authorised in the function ·
writing a table users may never write directly (audit rows, counters).

**Never** as a shortcut around a policy that is merely inconvenient. With elevated access, *the function is the
security boundary* — validate the caller yourself before you touch anything.

## 🔴 The ordered gate, and what belongs here

A function is a request handler, so it runs the same gate as any other: **shape → authentication →
authorization → business validity → the database**, in that order. Nothing frames the request for you, so the
order is yours to write and easy to get wrong — validating shape after a lookup means a malformed anonymous
request already cost a query.

This is also **where an aggregation belongs** when the client would otherwise fetch rows to compute it: a
dashboard total, a report, a cross-user roll-up. Return the answer, not the data behind it. Both rules and the
two probes that prove the order holds: `aoneahsan-cccs-data-contract`.

## CORS is not optional

Every function answers the `OPTIONS` preflight with the shared CORS headers; read `references/patterns.md` →
*CORS* for the handler.

Omitting the `OPTIONS` branch is the single most common cause of "the function works in curl and fails in the
browser".

## 🔴 Gate G3 before any deploy

`functions deploy`, `secrets set` and `link` all authenticate with the **account-level `sbp_` PAT**, which
lives on the Supabase *account* record in FilesHub — never on the project. No PAT → **BLOCK and ask**; do not
fall back to a password or a dashboard click. One of the three registered accounts holds no PAT while owning
2 projects, so this is a live failure, not a hypothetical (`aoneahsan-cccs-supabase`).

Feed it through the environment — `export SUPABASE_ACCESS_TOKEN=…` — never a `--flag`, which lands in the
process list.

## Secrets

```bash
supabase secrets set OPENAI_API_KEY=… FILESHUB_API_KEY=…
```

🔴 `supabase functions serve` ran against the retired local stack. There is no local runtime now: a function
is verified against the one hosted project, so treat every invocation as production traffic.

**A secret used in a function never gets a `VITE_` prefix** — that inlines it into the shipped bundle. Values
live in `~/.secrets/`; the function reads `Deno.env`.

## Scheduled jobs must be idempotent

```sql
select cron.schedule('recompute-streaks', '0 3 * * *', $$
  select net.http_post(
    url     := 'https://<ref>.supabase.co/functions/v1/recompute-streaks',
    headers := '{"apikey": "<secret-key>"}'::jsonb
  );
$$);
```

A cron job **will** run twice — a retry, a redeploy, a manual trigger. Make the work idempotent (upsert on a
natural key, or a `processed_at` guard), or the second run corrupts what the first one wrote.

## Free-tier envelope

**500,000 invocations/month.** Ample for transactional work; a function called on every keystroke or in a
render loop is not transactional. Batch, debounce, or move it into a database function.

## Common mistakes

| Mistake | What happens | Instead |
|---|---|---|
| No `Authorization` forwarding | anonymous client; RLS blocks everything | `userClient(req)` |
| Elevated client by default | every policy silently bypassed | user client unless justified |
| No `OPTIONS` branch | works in curl, fails in the browser | handle the preflight |
| Non-idempotent cron job | double-writes on any retry | upsert or a processed guard |
| Secret in a `VITE_` var | shipped in the bundle | `Deno.env` + `supabase secrets` |

## Related skills

`aoneahsan-cccs-supabase` (schema, RLS, the provisioning gate) · `-plans-entitlements` (rate limits enforced here) ·
`-postgres-search` (when a query belongs in the database instead) · `-fileshub` (calling it from Deno) ·
`-zero-cost` via `~/.claude/rules/zero-cost.md` (the free-tier boundary).
