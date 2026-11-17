# Lifecycle, reconnection and the baseline

## The shape

```tsx
useEffect(() => {
  if (!tenantId) return;
  let cancelled = false;
  let seeded = false;                                  // the baseline flag

  const channel = supabase
    .channel(`tenant:${tenantId}:results`, { config: { private: true } })
    .on('broadcast', { event: '*' }, () => {
      if (!seeded) return;                             // pre-baseline events are history
      queryClient.invalidateQueries({ queryKey: ['results', tenantId] });
    })
    .subscribe((status) => {
      if (cancelled) return;
      if (status === 'SUBSCRIBED') {
        // 🔴 every time, not just the first — this closes the reconnect gap
        queryClient.invalidateQueries({ queryKey: ['results', tenantId] });
        seeded = true;
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setLive(false);
    });

  return () => { cancelled = true; void supabase.removeChannel(channel); };
}, [tenantId, queryClient]);
```

Every line above is load-bearing:

| Line | Prevents |
|---|---|
| The `tenantId` guard | Subscribing to `tenant:undefined:…` during the first render |
| `cancelled` | A status callback firing after unmount — the same async-cleanup race that leaks an `addListener` handle under StrictMode |
| `seeded` | A reload replaying existing rows as fresh events |
| Invalidate **inside** `SUBSCRIBED` | The gap left by every reconnect, not just the first connect |
| `removeChannel` in cleanup | A leaked channel per mount, and duplicate handlers per event |
| Stable deps | Re-subscribing on every render |

## 🔴 Refetch on every `SUBSCRIBED`

The single most consequential line. Realtime delivers nothing that happened while the client was
disconnected, so a tab left open through a network blip is quietly missing data with no signal.

Putting the invalidation inside the status callback means the subscribe path and the reconnect path are the
same code — which is what stops it being handled once and forgotten.

## The first-snapshot baseline

The pattern the shipped app gets right, and the reason it matters is a user-facing one: without it, opening
the app replays every existing row through the notification path, and the user is shown a screen of alerts
about things they dealt with yesterday.

With Postgres Changes there is no initial snapshot, so the baseline is simply "ignore events until the
initial query has resolved". With a Firestore-style listener that *does* deliver a first snapshot, the flag
skips exactly that delivery. Either way the rule is the same: **the first delivery establishes state; it does
not announce it.**

## Status handling

| Status | Meaning | Do |
|---|---|---|
| `SUBSCRIBED` | Joined and authorised | Refetch. Mark the UI live |
| `CHANNEL_ERROR` | Join refused — usually the policy, or a missing publication | Mark not-live. **Do not retry in a tight loop**; the answer will not change |
| `TIMED_OUT` | No response in time | Mark not-live; the client will retry |
| `CLOSED` | Deliberately closed, or the socket went away | Mark not-live |

🔴 **`CHANNEL_ERROR` is usually an authorisation or configuration problem, not a transient one.** Retrying it
aggressively turns a misconfiguration into a load problem and hides the cause. Surface it.

**Show liveness honestly.** If the socket is down, say so — a stale list that looks live is worse than a
visible "reconnecting", because the user acts on it.

## Reconnection

The client reconnects on its own. What it cannot do for you:

- **Close the data gap** — that is the refetch above.
- **Refresh the credential** — the socket authenticated at connect. Wire `setAuth` to the auth state change:

  ```ts
  supabase.auth.onAuthStateChange((_e, session) => {
    supabase.realtime.setAuth(session?.access_token ?? null);
  });
  ```

  🔴 Without it, subscriptions work until the first token refresh and then fail in a way that reads as a
  network fault. It is the single most misdiagnosed failure in this area.

- **Know the tab was asleep.** A backgrounded tab may have its socket dropped without an event. Refetch on
  `visibilitychange` → visible as well as on `SUBSCRIBED`.

## Store-owned subscriptions

Where the listener belongs to a store rather than a component, the same rules hold with one addition: the
handle lives in store state and the **previous listener is removed before a new one is created**.

```ts
subscribe(tenantId) {
  get().unsubscribe?.();                  // 🔴 before, not after
  const channel = /* … */;
  set({ unsubscribe: () => void supabase.removeChannel(channel) });
}
```

Re-subscribing without tearing down is how a store accumulates listeners across a tenant switch, and the
symptom — each event handled N times — appears long after the change that caused it.

## Presence

Presence state is **ephemeral and best-effort**. It is correct for "3 people viewing this" and wrong for
anything that must be right.

- `track` on join, `untrack` on leave, and expect the `leave` event to be missed when a client vanishes —
  presence is reconciled by heartbeat, not guaranteed by it.
- Keep the tracked payload tiny and non-identifying beyond what the UI shows.
- **Never derive a lock, a count of record, or an authorisation decision from presence.**

## Verifying

Static gates cannot see any of this. The checks that can:

1. Subscribe, **disconnect the network for 30 seconds while a change is made elsewhere**, reconnect — the UI
   must show the change.
2. Force a token refresh (or wait one out) — events must keep arriving.
3. Subscribe as a user who should see nothing — nothing arrives, and the status is `CHANNEL_ERROR` rather
   than a silent success.
4. Mount and unmount the component ten times — the channel count returns to where it started.
5. Reload with existing rows present — **no notifications fire**.

## Measured on windowsweep, 2026-11-07

- 🔴 **Clear the channel field BEFORE `removeChannel`, and ignore stale channels.** With the socket down, supabase-js fires a
  channel's CLOSED callback synchronously inside `removeChannel`. A handler that removes the channel first and clears its
  field afterwards re-enters itself until the stack overflows (19 RangeErrors in one gap proof), never schedules its
  retry, and the channel stays dead until restart. Write `const current = channel; channel = null; removeChannel(current)`,
  and open every callback with `if (channel !== joined) return`. windowsweep desktop and web release feeds, fixed `cb23c4d`, `7390d49`.
- **A private per-account signal:** an AFTER INSERT OR UPDATE trigger calls `realtime.send(payload, event, 'plans:' || user_id,
  private => true)`, and one RLS select policy on `realtime.messages` admits `realtime.topic() = 'plans:' || auth.uid()`. The
  payload names nothing; the client re-reads through RLS (migration `20261107073129_plan_change_broadcast`).
