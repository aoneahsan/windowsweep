# The state layer — how the dummy actually works

A4 wires every page into **one working prototype**. There is no separate "interactive version": the same flat
HTML files gain a shared state layer and become the thing the owner clicks through.

No CRUD reaches a server — there is no server. What must be real is the **flow**: a form that submits changes a
list, a sign-in that unlocks the app, a sign-out that resets everything.

## 🔴 The finished dummy is INTERACTIVE and it REMEMBERS (moved from SKILL.md 2026-10-27)

Owner directive, standing: **the final dummy is a working prototype whose state persists through
`strata-storage` over localStorage.** Not a stretch goal — the deliverable. Sign in and the app unlocks;
submit a form and the entry joins the list and survives a reload; sign out and everything resets to first-run.
Ask about this once per project and you have asked once too often.

## The five files

| File | Owns |
|---|---|
| `seed.js` | the deterministic demo dataset. Dates relative to today, so the prototype never looks stale. |
| `db.js` | **the store.** Collections, the derived selectors, the strata instance, the session. |
| `app.js` | the shell — the single navigation registry, preferences, overlays, the page manifest. |
| `wire.js` | the binder: declarative `data-*` attributes that connect markup to the store. |
| `demo.js` | the review-only toolbar — reset, sign in, switch treatment, report which storage mode is live. |

Every page loads all five, in that order, plus the vendored strata bundle before them.

## 🔴 Storage goes through strata-storage, vendored as a classic script

`vendor/strata.iife.js` — an esbuild IIFE build, because **ESM is CORS-blocked over `file://`** and the dummy
must open by double-click. `vendor/README.md` carries the version, the SHA-256 and the exact command that
regenerates it, so a year later it is reproducible rather than mysterious.

### 🔴 `namespace`, not the adapter `prefix`

Probed on strata 2.8.5 by reading the physical key back out of `localStorage`:

| What you write | Physical key |
|---|---|
| `defineStorage({ prefix: 'x:' })` | `theme` — documented no-op |
| `defineStorage({ adapters: { localStorage: { prefix: 'x:' } } })` | `theme` — **also a no-op** |
| `defineStorage({ namespace: 'x' })` | `x:theme` — **the only one that works** |

This matters more here than in a normal app because **every `file://` document shares one origin**, so an
unprefixed key named `settings` or `items` collides with every other local page on the machine. One project's
dummy origin held 24 foreign keys from unrelated tools.

🔴 **The trap is that the no-op looks correct.** A reference implementation shipped
`adapters: { localStorage: { prefix: 'lw-dummy:' } }` with a comment explaining why the prefix was necessary —
and wrote unprefixed keys the whole time. **Verify by reading a physical key, never by reading the config.**

⚠️ **`defaultStorages` does not protect the sync path.** It reads like an ordered fallback list, but with
`localStorage` unavailable, `setSync` still selected it and threw. Probe availability with a real
write/read/delete in a `try`, then pass the one adapter that works.

### 🔴 The pre-paint theme script is the one sanctioned raw-storage exception

It runs in `<head>` before any module exists to call, so it reads `localStorage` directly. Two couplings make
that safe, and both must be named in a comment at **each** end:

- the physical key is **`<namespace>:<key>`**;
- the stored value is **strata's JSON wrapper**, so the script needs `JSON.parse(raw).value`, never the raw
  string.

Change the namespace and every page's head script silently reverts to a theme flash. Nothing catches it.

## The store's shape is the app's shape

Give it the shape the real store will have — an in-memory mirror hydrated once at boot, synchronous reads,
async persistence behind them. That is Zustand-plus-persist in miniature, which makes the dummy a faithful
specification instead of a throwaway.

```
list(collection) · one(collection, id) · add · update · remove
derive.<name>(…)          the selectors — streaks, totals, counts, progress
prefs.get / prefs.set     persisted preferences (treatment, appearance, density)
signIn / signOut / signedIn
reset()                   wipe + reseed
on / emit                 change events, so a write re-renders every bound node
meta                      namespace, keys, version, the live storage backend
```

### 🔴 Store facts, derive the rest

Persist what the user **did** — items, entries, settings. Compute streaks, totals, levels and percentages on
read, with the same pure functions the app will use. A stored derived number is how one screen says 12 and the
next says 11: nobody writes that bug deliberately, it arrives when one of two write paths forgets the cached
copy.

## The six flows that must work

| Flow | Contract |
|---|---|
| **Sign in** | Writes a session fact; `signedIn()` becomes true; app pages unlock. |
| **Authenticated pages** | Check the session on load. A signed-out visitor gets the signed-out state or the auth page — never a half-rendered page. |
| **Sign out** | 🔴 **Clears the whole namespace and reseeds**, returning to first-run. A sign-out that leaves entries behind is the flow reviewers test first. |
| **Create / edit / delete** | Submitting a form or modal writes a fact, the bound list re-renders, and it survives a reload and a navigation. |
| **Seed** | Deterministic, dates relative to today, so no list is ever empty on first open. |
| **Demo switches** | 🔴 **Never persisted.** A reviewer flips `state=error` once, forgets, and every page for the rest of the session looks broken. Preferences persist; demonstration axes do not. |

## The binder is deliberately throwaway — and greppable

Bindings live in one namespaced attribute family (`data-<prefix>-text`, `-list`, `-bind`, `-count`, `-if`,
`-form`, `-action`, `-chart`). One grep lists everything the first implementation module deletes:

```bash
grep -oh 'data-lw-[a-z]*' *.html | sort -u
```

Name the namespace after the project, state in `wire.js` that the whole file is discarded at translation, and
the dummy stays a specification rather than code someone tries to keep.

## Two shell rules that break silently

🔴 **Navigation is single-source.** One registry in `app.js` renders the sidebar, the drawer and the footer. One
project hand-copied its sidebar into 31 files, ended up with **five divergent navigations**, and only 38 of 49
pages were reachable by clicking — while every page passed inspection on its own.

🔴 **Zero `innerHTML`.** Build with `createElement` and `textContent`. Same rule as the app.

## Which mode is it served in — and say so

`localStorage` works fine on `file://` (measured in Chrome, 2026-07-30), so a double-clicked dummy persists with
no server. Cookies and IndexedDB are the ones that misbehave there.

Ship a preview command anyway for Safari and locked-down profiles — `python3 -m http.server <port> --bind
127.0.0.1` on the project's registered dev port, zero dependencies — and have `demo.js` **display the storage
backend actually in use**. A prototype that silently fell back to memory looks like a persistence bug in the
design.

**Last updated:** 2026-07-30
