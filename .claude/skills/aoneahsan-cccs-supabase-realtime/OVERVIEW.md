# Overview — `aoneahsan-cccs-supabase-realtime`

## Purpose

Live updates over Supabase Realtime: choosing between Postgres Changes, Broadcast and Presence, authorising a
private channel, keeping the socket's credential fresh, bounding and scoping every subscription, and closing
the gap a reconnect leaves behind.

## What this skill does

- Starts from one premise: **a subscription is a standing query held open across a network you do not
  control.** Every rule that makes an ordinary query safe still applies, and two new failures appear — the
  connection drops, and the credential expires while the socket stays open.
- Treats the stream as an **invalidation signal, not the data path**, so the surface degrades correctly when
  the socket is unavailable and a reconnect can close its own gap with a refetch.
- Prefers **broadcast from a database trigger on a private channel** over Postgres Changes once subscriber
  count matters, because row authorisation on Postgres Changes is evaluated per subscriber per change.
- Requires `setAuth` on **every token refresh**, since the websocket authenticates once at connect and a
  stale JWT presents as an intermittent network fault.
- Keeps subscriptions **bounded, scoped and provable** — the same page-size and policy-provability rules as
  any other query, with a `// bounded:` comment where an exemption is genuine.
- Holds **one owner per listener**, tears the previous one down before re-subscribing, and degrades on error
  rather than throwing.
- Records a **first-snapshot baseline** so a reload does not replay existing rows as fresh events.

## Where it gets invoked

- Adding live updates to a list, a notification, a chat or a dashboard.
- A subscription delivers rows the user should not see.
- Events stop arriving after a token refresh or a network drop.
- A component re-subscribes on every render, or leaks a channel.

## Why it exists

`labflow-project-root/03-SKILL-GAPS.md` recorded it as a Tier-C gap for live result and notification updates.
A grep of the installed family found `realtime` in two `SKILL.md` bodies — `-analytics` and
`-strata-storage` — both incidental, and `postgres_changes` in none.

## 🔴 Honest provenance

**Neither source codebase contains a line of Supabase Realtime.** The shipped app is Firestore; the rebuild
targets Supabase. So this skill is assembled from two different kinds of input, and the split is worth being
explicit about:

**From the shipped code — the discipline, which it does genuinely well.** Four real `onSnapshot` sites, every
one limited and tenant-scoped, with the chat listener's own comment tying its tenant filter to rules
provability. The unsubscribe handle held in store state with the previous listener torn down before
re-subscribing. Error callbacks that degrade rather than throw. Payloads deliberately free of personal
detail. And the **first-snapshot baseline**, so a login or reload never re-toasts alerts the user already
handled. All of that transfers to Supabase unchanged.

**From Supabase's own API — the mechanics**, which have **not** been verified against a running instance
here. Presence and reconnection have no precedent in the source code at all. Any session using this skill
should invoke the **`supabase:supabase`** plugin skill alongside it: ours carries the decisions, theirs
carries the API.

## What it deliberately does not cover

RLS policy design and the provable-from-its-own-filters rule (`aoneahsan-cccs-postgres-multitenancy-rbac`);
schema, migrations and the provisioning gate (`-supabase`); the triggers and functions that broadcast
(`-supabase-edge-functions`); the cached query an event invalidates (`-react-api-tanstack-query`); and queued
writes while offline (`-offline-sync`).
