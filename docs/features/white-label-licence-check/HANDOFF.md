# White-label licence check in the desktop app — Windows handoff

**Written:** 2026-11-14 · **For:** the owner, on the Windows 11 PC · **Manual task:** row 43 in
[`docs/MANUAL-TASKS.md`](../../MANUAL-TASKS.md)

## What is already done

windowsweep is sold as a **managed white-label licence** (owner rule 2026-11-13, "Managed white-label only"):

- The source is public under MIT, so there is **no buyout** and every licence is **non-exclusive**. A licence pays
  for our rebrand-build-and-release work and the right to use the windowsweep name and mark, which MIT does not grant.
- Groups: **Desktop app** and **Command-line tool (npm)**, $10,000 each, 10% off the pair ($18,000). 6 months of
  updates included; renewals $500 / 3 months, $700 / 6, $1,000 / 12. Every number is read live from the licensing
  catalogue; nothing is typed into code.
- Live since 2026-11-14 (GATE 4 from the owner, "approve windowsweep gate 4"): `windowsweep.aoneahsan.com/white-label`
  (pricing, updates, licence terms, custom work, `/verify-license`) and `windowsweep-docs.aoneahsan.com/white-label`.
  Terms and Privacy carry the licence clauses. Click-dummy amendment 46 in `windowsweep-web/design/AMENDMENTS-3.md`.

## What is left: the dormant check in `desktop/`

Every licensed build we ship for a buyer must check its key once on start. Our own builds carry no key, so the
check never runs and no request is made. Nothing was added to `desktop/` yet, because it needs the Windows toolchain
to build and test.

### Contract

| Item | Value |
|---|---|
| Build env | `VITE_WHITE_LABEL_KEY` — empty in our builds (add it to `desktop/.env.example` as an empty, documented name) |
| Key prefix | `WINDOWSWEEP-WL-…` |
| Verify call | `GET https://fileshub.zaions.com/api/licensing/v1/licenses/verify?key=<key>` → `data.verdict` is `valid`, `pending_setup`, `revoked`, `not_found` or `invalid_format` |
| No `host` | the desktop webview has no domain of its own, so the key alone is the proof |
| Inactive verdicts | `revoked`, `not_found`, `invalid_format` → show the inactive view |
| Fail open | offline, timeout (5 s), a 5xx or an unreadable body → the app keeps working; the next start tries again |
| When | once at start, and once when the window is focused again — **never on a timer** (realtime-not-polling law) |
| Where the answer lives | memory only (a small zustand store), never persisted |
| Verify page | `https://windowsweep.aoneahsan.com/verify-license?key=<key>` |
| Sidecar | the licensed build's own download page serves `/.well-known/windowsweep-white-label-license.json` (path from the catalogue's `sidecar_path`); that belongs to the buyer's site, not the desktop app |

### Steps

1. `desktop/src/lib/licence-check.ts`: `licenceCheckEnabled = key.length > 0`; `checkLicence()` with an
   `AbortController` 5 s timeout; `bindLicenceCheck()` calls it at start and on `focus`, returns the unbind;
   JSDoc on each export.
2. `desktop/src/components/LicenceInactive.tsx`: a full-window view in the desktop design system (React Aria,
   tokens, no new colours): one heading ("This licence is not active"), one line naming the key, and one button that
   opens the verify page in the browser through the existing external-link helper. No other way past it.
3. Mount it in `App.tsx`: one `useEffect(() => bindLicenceCheck(), [])`, and render `LicenceInactive` instead of the
   shell when the store says inactive. With no key, the guard renders children and binds nothing.
4. i18n: every string through `t()`, keys under `whiteLabel.*` in the English catalogue.
5. `src-tauri/tauri.conf.json` CSP: add `https://fileshub.zaions.com` to `connect-src` only.
6. `desktop/.env.example`: `VITE_WHITE_LABEL_KEY=` with a one-line comment.

### Proof on Windows

1. `cd desktop && yarn gates` (typecheck, lint with zero warnings, build, tests) — green.
2. No key: `yarn build`, then search `dist/assets/*.js` for `licenses/verify` — it may exist, but the dev tools
   network panel of `yarn tauri dev` must show **no** call to it.
3. A bad key: `VITE_WHITE_LABEL_KEY=WINDOWSWEEP-WL-TEST-0000 yarn tauri dev` → the inactive view appears.
4. Offline with that key (disconnect the network) → the app opens normally.
5. Commit and push `main`. The next desktop release carries it; nothing changes for our own users.

When done, move row 43 to Completed with the date and commit, and set `clientBuildCheck: true` for windowsweep in
`projects-finalization-record/production/white-label-status.json`.
