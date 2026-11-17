---
name: aoneahsan-cccs-supabase-realtime
description: 'Live updates over Supabase Realtime: Postgres Changes vs Broadcast vs Presence, authorising a private channel and keeping the socket''s JWT fresh, bounded scoped subscriptions, teardown before re-subscribing, refetch to close the reconnect gap, the first-snapshot baseline. Use when adding live updates to a list, notification, chat or dashboard; when a subscription fires for rows the user should not see; when events stop after a token refresh or network drop; or when a component re-subscribes on every render.'
metadata:
  source: labflow live-update surfaces (a shipped Firestore app whose rebuild targets Supabase) + its rebuild audit, 2026-07-31; gap recorded in labflow-project-root/03-SKILL-GAPS.md
---

# Supabase Realtime

## Overview

A realtime subscription is a **standing query held open across a network you do not control**. Everything
that makes a normal query safe — a limit, a filter the policy can prove, a lifecycle — still applies, and two
new problems appear: the connection drops, and the credential expires while the socket stays open.

**The standard:** every subscription is **bounded and scoped**, the socket's auth is **refreshed
deliberately**, and a reconnect is followed by a **refetch** — because Realtime is not a durable log.

> 🔴 **The Supabase API here is unverified against a running instance** — the source project is Firestore, so
> what transfers is the discipline. Invoke the **`supabase:supabase`** plugin skill for the current API.
> Detail in `OVERVIEW.md`.

## When to use

- Adding live updates to a list, notification, chat or dashboard.
- A subscription delivers rows the user should not see.
- Events stop arriving after a token refresh or a network drop.
- A component re-subscribes on every render, or leaks a channel.

## 🔴 Realtime is not a durable log

Anything published while the client is disconnected is **gone**. The client reconnects, the socket is healthy,
and the UI is silently missing whatever happened in between.

So every subscription has a partner: **on `SUBSCRIBED`, refetch the underlying query.** Not only on the first
subscribe — on every reconnect. Without that, the longer a tab stays open the more wrong it gets, and nothing
signals it.

Treat the subscription as an *invalidation signal*, not as the data path: the event says "something changed",
the query is what the UI renders. That also makes the whole surface degrade correctly when the socket is
unavailable.

## 🔴 Prefer broadcast-from-the-database once it matters

Three mechanisms, and the default choice is not the obvious one:

| Mechanism | Use for | Caution |
|---|---|---|
| **Postgres Changes** | Prototypes, low subscriber counts | Row authorisation is evaluated **per subscriber per change**, so cost grows with subscribers × writes |
| **Broadcast** (from a trigger) | Anything that scales | You choose the payload, so you control what leaks |
| **Presence** | Who is here, who is typing | Ephemeral by design; never a source of truth |

**Broadcast from a database trigger on a private channel** is the shape to reach for: the trigger decides the
topic and the payload, authorisation is a policy on the messages table evaluated once at subscribe, and the
event carries only what you chose to put in it.

Channel topics, private-channel authorisation, and the **DELETE payload trap** — a delete event cannot carry
the row's data the way an insert can, so a client cannot filter on a column it never receives:
`references/channels-and-rls.md`.

## 🔴 The socket carries its own credential, and it goes stale

The websocket authenticates **once, at connect**. When the access token is refreshed, the socket keeps the old
one — and subscriptions begin failing authorisation in a way that looks like a network problem.

Call the client's `setAuth` on every token refresh, and wire it to the auth state change rather than to a
timer. A subscription that worked for an hour and then silently stopped is this, almost every time.

## Bounded, scoped, and provable

The rules from ordinary queries do not relax because the query is standing:

- **A filter the policy can prove**, on the channel and on the refetch. A standing query denied by RLS is a
  subscription that connects and never delivers.
- **A limit on the backing query.** Page size discipline is unchanged — `~/.claude/rules/data-fetch-budget.md`.
- **A structurally bounded subscription** — a config table, a single row — is a legitimate exemption carrying
  a `// bounded: <reason>` comment.
- **No identifiers in the payload beyond what the surface needs.** A toast that names a person is a
  disclosure on a shared screen; `aoneahsan-cccs-phi-safe-engineering` governs.

## One owner, torn down before re-subscribing

The lifecycle worth copying exactly: the unsubscribe handle lives in
the store or the effect that created it, the **previous listener is removed before a new one is created**, and
the error callback degrades rather than throws.

And the detail that is easy to miss — **the first-snapshot baseline.** On first delivery, record the current
state and emit nothing. Without it, every reload replays the existing rows as if they had just happened, and
the user gets a screen of stale notifications about things they already handled.

Effects, StrictMode double-invocation, status handling and the refetch-on-reconnect wiring:
`references/lifecycle-and-reconnection.md`.

## What this skill does not own

| Concern | Owner |
|---|---|
| RLS policy design and the provable-from-its-own-filters rule | `aoneahsan-cccs-postgres-multitenancy-rbac` |
| Schema, migrations, the provisioning gate, the free-tier envelope | `aoneahsan-cccs-supabase` |
| Server-side triggers and functions that broadcast | `aoneahsan-cccs-supabase-edge-functions` |
| Cache invalidation and the query the event refreshes | `aoneahsan-cccs-react-api-tanstack-query` |
| Never polling: exceptions, worker kick, proofs | `aoneahsan-cccs-realtime-not-polling` |
| Queued writes and replay while offline | `aoneahsan-cccs-offline-sync` |

## Common mistakes

| Mistake | What happens | Instead |
|---|---|---|
| Treating the stream as the data | Anything sent while disconnected is lost, silently | Refetch on every `SUBSCRIBED` |
| Never calling `setAuth` after refresh | Works for an hour, then stops looking like a network fault | Wire it to auth state change |
| Subscribing in an effect with unstable deps | Re-subscribes every render; channels leak | Stable key, cleanup removes the channel |
| No first-snapshot baseline | Every reload replays old rows as new events | Baseline, then emit |
| Relying on a DELETE payload's columns | The old row is not delivered the way an insert is | Broadcast a payload you chose |
| An unbounded subscription | The same fetch-all defect, held open | Limit and scope it, or comment the exemption |

## Related skills

`aoneahsan-cccs-supabase` · `-postgres-multitenancy-rbac` · `-supabase-edge-functions` ·
`-react-api-tanstack-query` · `-offline-sync` · `-phi-safe-engineering` · plus the **`supabase:supabase`**
plugin skill for the current API.
