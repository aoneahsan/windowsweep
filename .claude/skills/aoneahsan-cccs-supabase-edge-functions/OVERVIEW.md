# Supabase Edge Functions — overview

## Purpose

`aoneahsan-cccs-supabase` covers schema, RLS and the hosted-only provisioning gate but stops at the database. LifeWell is
about to have a real backend for the first time — scheduled recomputation, transactional email, anything the
client must not be trusted with — and that logic runs in Deno at the edge.

The failure this prevents is subtle: a function that forgets to forward the caller's JWT becomes an anonymous
client, so RLS blocks everything and the symptom reads as a policy bug rather than a missing header.

## What this skill does

- Fixes the **function layout** and the `_shared/` convention.
- States the default: **a function runs as the calling user**, with the JWT forwarded so RLS still applies.
- Bounds the **service-role escape hatch** — when it is legitimate, and that with it the function itself
  becomes the security boundary.
- Requires the **CORS preflight branch**, the cause of "works in curl, fails in the browser".
- Keeps secrets in `Deno.env` and out of any `VITE_` variable.
- Requires **idempotent scheduled jobs**, because a cron job will run twice.
- Names the **500k-invocation free-tier envelope** and what exceeds it.

## When it gets invoked

- Adding server-side logic to a Supabase project.
- Scheduling a recurring job with `pg_cron`.
- Enforcing something a client must not be trusted with (a rate limit, an entitlement).
- A function returning 401, or a CORS error in the browser only.
- Calling FilesHub or an AI provider from the server side.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Supabase-backed projects |
| Stack override | The concern is *server-side logic that runs as the caller unless it states otherwise*. On Firebase the equivalent is a Cloud Function — which the zero-cost rule bans, and is a reason the fleet moved. On Cloudflare it is a Worker (`aoneahsan-cccs-cloudflare-workers`). |

## Sources

| Source | Record |
|---|---|
| Supabase docs + the plugin skills; the hosted-only gate | `~/.claude/rules/supabase-provisioning.md` |
| The rebuild's backend decision and zero-cost constraint | `code/production-projects/lifewell-project-root/00-REBUILD-MASTER-PROMPT.md` |

## Related skills

- `aoneahsan-cccs-supabase` — schema, RLS, the hosted-only provisioning gate
- `aoneahsan-cccs-plans-entitlements` — rate limits and counters enforced here
- `aoneahsan-cccs-postgres-search` — when the work belongs in the database instead
- `aoneahsan-cccs-fileshub` — calling it from Deno
- `supabase:supabase` (plugin) — the current Supabase API

## Maintenance

- **Living registries this skill points at:** `~/.claude/rules/supabase-provisioning.md` (hosted-only, and
  the G3 account-PAT gate a deploy cannot skip) and `~/.claude/rules/zero-cost.md` (the free-tier boundary).
- **Last reviewed:** 2026-08-06 (hosted-only; the retired local stack removed)
