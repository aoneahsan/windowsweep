> Round 15 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 15 — 2026-09-25, HEAD `5934008`, desktop 1.3.0 · **CLEAN.** D-66 and D-67 are closed: the Settings status note is on every tab of the app, the About panel is in the dummy with the owner's words (D47), and the two sides now match in words and to the pixel. Home and Account signed out still match round 13, the version surfaces read 1.3.0, and both buttons were pressed on both sides — the app's behind a guard proved to refuse the opener on both wires, so nothing reached the owner's browser.

**Scope:** the re-check of round 14's two Settings defects before the `desktop-v1.3.0` tag.
`git diff --stat 19d2cbc 5934008 -- desktop`: the dummy's `page-settings.js` (the panel in `about()`), the app's
`Shell.tsx` (`FIXED_NOTES['/settings']`) and `shell.json` (`status.settings`), and the record `AMENDMENTS-2.md`
(`logs/01`). **HEAD stayed at `5934008`** from start to end (`logs/01`, `logs/27`); `git status --porcelain` shows only
the owner's untracked `assets/logo/windowsweep-mark.png` at both ends.

**Method — exactly round 14's** (`round15\NN-*-source.txt`, 13 drivers, every stdout in `round15\logs\`): `yarn tauri
dev` with `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9339` and a new isolated
`WEBVIEW2_USER_DATA_FOLDER=…\gate4-evidence\round15\webview2-profile`; the two-wire guard; the dummy in Chrome for
Testing 151.0.7922.77, profile `ahsan-automation-windowsweep-r15`, port 9595, pid 20664, proved from the OS process
table before the first navigation (`logs/07`). **Signed out throughout; no identity created or injected.** 12 pairs
(Settings About, Home, Account signed out × 1440/760 × light/dark, lime) in `round15\pairs\`, words diffed per pair.

---

## R15.1 — Safety

| check | result |
|---|---|
| **profile isolation**, before anything else (`logs/05`) | all 6 `msedgewebview2.exe` on `…\round15\webview2-profile\EBWebView`; the owner's `EBWebView` **1,315 files, newest write 2026-09-17T17:51:13.737Z** — identical at preflight, after launch and at the end (`logs/26b`) |
| **the guard** (`logs/04`, `logs/06`) | predicate 25/25; attached while the window was still `about:blank`; **wire 2** token refused by the wrapper, control reached Rust; **wire 1** token refused by the fulfil, control reached Rust; no retry after a fulfil; still installed and refusing at the end (`logs/20`) |
| 🔴 **the opener, on both wires, before any press** | `plugin:opener|open_url` probed with **no address at all** (`{}`) — harmless by construction, since Rust would reject the missing `url` if a wire ever let it through: **wire 2** → `refused by the GATE 4 round 15 guard (postMessage wire): plugin:opener|open_url is refused outright in this round`; **wire 1** → the same, `(fetch wire)` (`logs/06`). Re-probed on the very document before each app press (`logs/12`) |
| **the first press** | Consent's *Continue* at 13:46:25.286Z, after the proof |
| **engine calls** | **6, every one `--list --json`** — two per boot × three boots (launch, the proof's reload, the Splash boot of `logs/10`). **Reclaim, Scan and Dry-run first pressed 0 times** |
| **what the guard refused** | **11 in its log**: 2 probe tokens and **9 `plugin:opener|open_url`** — the proof's wire-1 probe, and in each of the two press passes a probe then a press for each button (fetch #66–#76); plus the proof's wire-2 opener refusal, recorded by the wrapper in the page |
| **run folders** | 298 before, 304 after: **6 new — one per call, all empty — 0 gone, 0 reports** |
| **C: free** | 85.53 GB before, 85.51 GB after (−17.3 MB; this round's own writes 8.2 MB, the dummy Chrome's profile) |

## R15.2 — The verdict table

| item | verdict | evidence |
|---|---|---|
| **D-67 · the About panel** — words | **closed — identical**: the paragraph *"windowsweep reclaims disk space on Windows. It names every path before it touches one, and refuses your documents, credentials and browser state outright. The desktop window drives the same engine the command-line tool runs."* and **Source** · **Support this work**. The pair's whole-screen residue is only the declared version line (`Desktop 1.3.0 · engine 1.3.0` against the dummy's `0.1.0-design · 1.1.0`) | `logs/09-pair-settings-about`: app 45 / dummy 45 / **shared 44** |
| **D-67 · the About panel** — layout | **closed — to the pixel**: panel `panel pad` at x 24, y 407, 736×151 (1440) and x 16, y 407, 728×151 (760) on both sides; the paragraph `t-sm` in the same box; the button row `flex` · gap **8px** · `wrap` · margin-top **12px**; both buttons `btn btn-sm` with a `.btn-label`, Source 68×30 and Support this work 128×30, same positions. Whole pages the same height on both sides (1440×1476, 760×1498) | `logs/11`, `settings-about-*` |
| **D-66 · the Settings status note** | **closed** — *"settings sync when you are signed in"* on **all five tabs** at 1440 on both sides (General, Scanning, Notifications, Privacy, About); at **760 both hide it** by the same rule (the app's span is `only-wide sb-note`, the dummy's `only-wide`) — the app then reads `engine 1.3.0`, the dummy `engine 1.1.0 · storage: localStorage` (its standing prototype note) | `logs/11`, `settings-about-*` |
| **the press states — dummy** | **as specified** (`page-settings.js`, 300 ms / 900 ms): Source — pending at +7 ms with **both** buttons disabled, `done` at +318 ms, idle at +1,231 ms; Support this work — +6 / +313 / +1,217 ms | `logs/12` |
| **the press states — app** | **the expected result of the refusal**: each press preceded by an opener probe refused on that document; the guard refused the real call **12 ms after** each press (fetch #73, #76); the control went pending at +14 / +12 ms with **both** disabled, then idle at +30 / +31 ms through `openLink`'s catch path — **no tick** (`SettingsAbout.tsx` `openLink` → `links.ts` `openExternal` → `plugin:opener|open_url`, the only IPC call, no fallback) | `logs/12` |
| the rest of Settings About | unchanged since round 14 and still matching: the promotion heading and note, the **fourteen** cards in the dummy's order, both self-exclusion audits identical (14 · 14 · 15 · 16, the control promoting itself), the "up to date" badge after a Splash boot | `logs/10` |
| **Home, signed out** | **match — round 13's verdict holds** (149 shared units; residue `live-number` and the two carried-forward items) | `home-signed-out-*` |
| **Account, signed out** | **match — 43 / 43** | `account-signed-out-*` |
| **version surfaces** | **`1.3.0` / `engine 1.3.0`**; D-64 re-read on the fresh session holds | `logs/08` |

## R15.3 — What could not be tested, and why

- **A browser actually opening** — the app's two buttons hand an address to the owner's default browser, which an
  agent session never drives; the guard refuses the call, so only the refusal path was exercised. The success path
  (the tick) is the dummy's specification and unobserved in the app. **Blocked, not failing.**
- **The packaged build** — `tauri dev` only. **Signed-in Settings** — not needed; no identity was created.

## R15.4 — Instrument faults, corrected before judging

1. **`12-press-states`, attempt 1** — the app presses were refused by the guard (its raw log: fetch #67 and #70, 29 and 28
   ms after the presses), but the check took "the log lines since the press" from an index one past the new line,
   because the log ends in a newline, and read `[]`. Re-run with the refusal matched by its own timestamp; attempt 1
   kept (`logs/12-press-states.attempt1-guard-log-off-by-one.txt`). Its press timelines already matched attempt 2's.
2. `02-preflight`'s port list was mangled by the carried substitution (9595 three times) and restored to 9591–9599
   before it ran. No result depended on it.

## R15.5 — Cleanup, each read back

- **`tauri dev`**: the tree killed from `yarn tauri dev` (pid 22344, `/T`, 16 processes — the 5974 listener 13896 shown to
  descend from it first); no `windowsweep-desktop.exe`, no WebView2 on the round's profile; **9339 and 5974 free**
  (`logs/22`, `logs/23`).
- **The guard**: pid 25164 killed. **The dummy's Chrome**: pid 20664, GUID matched, closed gracefully, **9595 free**
  (`logs/25`). **9333** (another session, pid 17484) and **9590** never touched.
- **The profiles**: no session was ever in this round's profile; `round15\webview2-profile` stays at **507 files,
  83.9 MB**; the owner's untouched.
- **The repository**: only the owner's PNG untracked; `desktop/public/prepaint.js`, rewritten by `yarn dev`,
  **byte-identical** (`cceabd20…`); no plant in any file. **Leak scan**: 0 hits across the 68 files this round wrote,
  with a control that finds the publishable key in `desktop/.env` (`logs/28`).
