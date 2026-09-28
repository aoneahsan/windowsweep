> Round 18 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 18 — 2026-09-28, HEAD `c530312`, desktop 1.3.2 · **CLEAN.** The full sweep (every screen, all five Settings tabs, 28 states at 1440 and 760, light and dark, signed out) finds no new divergence: 22 of its 27 pair summaries match round 17's line for line, and the five that moved show only this machine's own measurements. TASK-022 did what it records. The first launch removed the 271 empty run folders that were a day old and nothing else: all 102 non-empty folders are byte-identical, and no catalogue load left a folder. The sign-in leg repeats its 22 checks. The replay mask holds with both portals open (0 readable text nodes). The 1.3.2 version surfaces, the 1.3.2 engine's team lines, pre-paint and §10 parity all hold. The leak scan's raw matcher found only the project's public Supabase address, inside three drivers: no secret, and nothing in any output (R18.14).

**Scope:** round 17's method on `c530312` ("fix(desktop): no Amplitude remote config, empty run folders go, and
desktop.md says what 1.3.0 and 1.3.1 did"), on top of `6d232e5` ("fix(desktop): Google sign-in completes, the window's CSP
lets Clarity and Sentry through, and 1.3.2"), plus four additions: proof A (the sign-in leg) and proof B (the replay mask,
now with the Theme panel and the file-field tooltip open) re-run, the leak scan's `^[A-Z0-9_]+=` parse, and a run-folder
manifest for TASK-022. `logs/01b` reduces every changed `desktop/src` file and `desktop/index.html` at `5dde309` and
`c530312` to a form formatting cannot touch (the instrument watched failing on seven in-memory plants): **3 with content,
2 new, 0 formatting-only**, each mapped to a row in R18.2. **HEAD stayed at `c530312`** from start to end (`logs/01`,
`logs/26b`); `git status --porcelain` showed only the owner's untracked `assets/logo/windowsweep-mark.png` at both ends.

**Build under test:** `yarn tauri dev` from `desktop/` — Vite 8.3.1 on 5974, `windowsweep-desktop v1.3.2` (dev profile),
`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9361` and an isolated
`WEBVIEW2_USER_DATA_FOLDER=…\gate4-evidence\round18\webview2-profile`. The dev start printed `[prepaint] public/prepaint.js
matches axes.json (10 axes)` and `[engine-bundle] the 1.3.2 engine: 41 files … (0 written, 0 removed)`
(`logs/03-tauri-dev`, now captured by the launcher itself); the bundle reads `VERSION 1.3.2`, all 41 files byte-identical
to the repository's engine (`logs/01`). **Dummy:** Chrome for Testing 151.0.7922.77, profile
`ahsan-automation-windowsweep-r18`, port 9597, pid 21296 — binary, profile and launch GUID read from the OS process table
before the first navigation (`logs/07`). **Signed out throughout; no identity created, injected or deleted.** The one
record the round caused on Supabase is GoTrue's own flow state for proof A's single authorize request, the record any
sign-in attempt makes (R18.4). Lime, light and dark, **1440 and 760**.

**Method — round 17's, unchanged** (`round18\NN-*-source.txt`, 22 drivers copied from round 17 with the r18 tokens, every
stdout in `round18\logs\`; nothing superseded this round). New drivers: `02b` (the run-folder manifest, three modes), `03`
(the dev launcher, which pipes `tauri dev` into its log), `04` (round 17's guard plus the sign-in rows: the authorize
address answered OK and never forwarded, `oauth_listen_*` passed to Rust, `write_select_file` refused), `06` (its proof
with the opener and listener rows), `09r` (the pair run-list, which records the dummy's preparation scripts for the first
time), `23` (the stop, by pid), `29` (proof A) and `30` (proof B). `20` and `28` were rewritten. Three read-only
instruments were written after the run: `28b` (the leak scan's hits classified), `31` (round 18 against round 17, log by
log) and `32` (the new mismatch texts traced). **28 states, 224 captures** in `round18\pairs\`, plus Home's schedule band
in `pairs\clips\`.

---

## R18.1 — Safety

| check | result |
|---|---|
| **profile isolation**, before anything else (`logs/05`) | all 6 `msedgewebview2.exe` under this round's `windowsweep-desktop.exe` (pid 3392) on `…\round18\webview2-profile\EBWebView`; absent at preflight, 340 files after launch; the window's first storage held one Amplitude key and no `windowsweep:*`. The 7 WebView2 processes already running at preflight were not this round's and were never touched (`logs/02`) |
| **the owner's `EBWebView`** | **1,373 files, newest write 2026-09-26T22:04:37.140Z, Local Storage newest 22:04:37.072Z**, identical at preflight (`logs/02`), after launch (`logs/05`) and after everything stopped (`logs/26b`) |
| **the guard** (`logs/04`, `logs/06`) | round 17's, r18 tokens, plus the sign-in rows; predicate **42/42** before any browser, the Splash flag absent at start; attached at 10:47:01.850Z, **before the first catalogue load** (10:47:16.217Z); on the live document wire 2 refused the token by the wrapper and passed the control to Rust, wire 1 refused the token by the fulfil and passed the control; one latch probe failed on purpose; no postMessage retry after a fulfil; `__TAURI_INTERNALS__.invoke` read (`writable:false, configurable:false`), never assigned |
| **the opener and the loopback listener, both wires, before any press** (`logs/06`, 10 of 10) | `open_url {}` and any other address refused on both wires by name; the sign-in authorize address answered `null` by the guard on both wires and never forwarded; `oauth_listen_await` reached Rust's body on both wires, and Rust rejected a mistyped argument before the body. The opener was re-probed on the very document before each About press (`logs/12`) |
| **the Splash flag** | round 17's refusal-only switch, proved in the predicate table; it lived only inside `13-splash` and was deleted (`logs/13`) |
| **the first press** | Consent's *Continue* at **10:48:33.731Z**, after the proof (10:47:33–40Z) (`logs/08`) |
| **still installed at the end** (`logs/20`) | `installed: true, stillTheWrapper: true`; token refused, control reached Rust |

**Every engine invocation — 38, each with its full vector (`logs/04`, `logs/20`):**
- `--list --json` ×2 at launch (10:47:16), ×2 on the proof's reload (10:47:35), ×8 on the four Splash boots
  (10:48:59–10:49:10) and ×2 on the roster audit's boot (10:49:44).
- **`--scan --developer --days 100 --temp-days 3 --large-file-mb 100`** at 10:58:08.003 (*Scan*, pressed once at
  10:58:07.860, `logs/10a`).
- **`--all --yes --dry-run --developer --days 100 --temp-days 3 --large-file-mb 100`** at 11:01:03.443 (*Dry-run first*,
  pressed once at 11:01:03.174, `logs/10b`).
- `--list --json` ×6 on proof B's three loads (11:07:58–11:08:45, `logs/30`) and ×16 on the axis driver's eight loads
  (11:09:02–40, `logs/19`).

**Invocations that could delete: 0. RECLAIM WAS PRESSED ZERO TIMES.** **Refusals: 15**: 3 probe tokens; **8
`plugin:opener|open_url`** (the proof's four, two pre-press probes, and the real presses of *Source* and *Support this
work*, fetch #152 and #155); and 4 `plugin:updater|check` (the Splash boots). **The authorize address was answered OK and
never forwarded 4 times**: the proof's two (wire 2's, which `logs/06` read from the wrapper, and wire 1's #19) and proof
A's two presses (#223, #229).

**Run folders and C:** **397 before, 128 after: 271 gone, 2 new**, and R18.3 judges both. The two new folders hold the
round's only two reports: `2026-09-28-10-58-07-kfs3kg` → `mode=scan, dry_run=false, total_reclaimed_bytes=0`, and
`2026-09-28-11-01-03-s7u7au` → `mode=all, dry_run=true, total_reclaimed_bytes=0`. **No report reclaimed a byte.**

C: free **fell** this time, **83.56 → 82.14 GB (−1,416 MB)**. The engine's own reports put **−471.6 MB** inside the
Scan's 57 s and **−936.2 MB** inside the rehearsal's 2 min 43 s, with nothing reclaimed and 112 KB written. Free space
that falls means something was written, not deleted. This round's own writes to C: were 11.9 MB (the dummy Chrome's
profile) and 112 KB (the run folders) (`logs/20`, `logs/26b`). The rest is not this round's to attribute, just as round
17's rise was not.

## R18.2 — What `5dde309..c530312` changed, judged

| change | commit | verdict | evidence |
|---|---|---|---|
| **TASK-022** — `engine.rs` removes a non-elevated run's folder when it is empty; `rundir.rs` `prune_empty_run_dirs` sweeps empty folders a day old; `lib.rs` runs it at setup | `c530312` | **WORKS AS RECORDED**: the first launch removed exactly the 271 empty folders a day old, every catalogue load removed its own, and every non-empty folder is byte-identical (R18.3) | `logs/02b-*`, `logs/20` |
| **Amplitude's remote config off** — `analytics.ts` `remoteConfig: { fetchRemoteConfig: false }` | `c530312` | **IN THE SOURCE AND IN EFFECT**: one content hunk, that property (`logs/01`, `logs/01b`). A fresh profile's first storage read holds `AMP_unsent_*` only, where rounds 16 and 17 also held `AMP_remote_config_*`. The CSP side (proof C's six blocked `sr-client-cfg` fetches) needs a production-protocol build: R18.13 | `logs/05` against `round17\logs\05` |
| **Google sign-in completes** — `auth.ts`, `oauth-redirect.ts` (+ its test), `oauth.rs` | `6d232e5` | **HOLDS**: 22 of 22, the same outcomes as the 1.3.2 proof, the words differing only by the loopback port (R18.4) | `logs/29`, `logs/31` §4 |
| **the replay mask on `<body>`** — `index.html` | `6d232e5` | **HOLDS**: 0 readable text nodes with both portals open (R18.5) | `logs/30`, `logs/31` §5 |
| **the window's CSP** — `tauri.conf.json` | `6d232e5` | **as committed**. `tauri dev` serves no CSP, so the CSP itself was proof C's, on a debug build of `6d232e5`; neither file moved in `c530312` | `logs/01`; `task020\logs\41-c` |
| **the cascade to 1.3.2** — `package.json`, `Cargo.toml`, `Cargo.lock`, `tauri.conf.json`, `VERSION` | `6d232e5` | **1.3.2 on every surface** (R18.8, R18.9); the engine between the two builds changed only its three version strings | `logs/01`, `logs/08`, `logs/17`, `logs/31` §0 |
| **the dummy's no-keys sentence** — `page-settings.js`, `AMENDMENTS-3.md` | `9a17266` | drawn only behind `?nokeys=1`; the default Privacy pair is unchanged at **24 / 24 / 24**, 0 layout mismatches | `logs/09-pair-settings-privacy-unmeasured`, `logs/31` §1 |

## R18.3 — The run folders: TASK-022's first launch, recorded

`02b` took the manifest at 10:46:43.897Z, before the first launch of this build (`logs/02b-run-manifest-before`, `.json`).
It found **397 folders: 295 empty (271 of them at least a day old at the app's start, 24 younger) and 102 non-empty
holding 246 files**, every file hashed (SHA-256), with 0 links; the app-data folder's top level held `EBWebView/` and
`runs/`. The dev app started at **10:47:01.145Z** (pid 3392, `logs/02b-app-start.json`). 22 s later **271 were gone,
every one of them empty before** (`logs/02b-run-manifest-launch`). After every process of the round had stopped
(`logs/02b-run-manifest-after`):

1. **every non-empty folder is still there, byte for byte**: all 102 of them, 246 files, 0 lost, 0 changed (names, sizes,
   SHA-256);
2. **only empty folders a day old went**: all 271 were empty before and at least 24 h old at the app's start (the oldest
   2026-09-07T09:12:30Z, the youngest 2026-09-26T22:03:55Z), and none sat in the five-minute boundary window. All 24
   younger empty folders were kept;
3. **the boot's catalogue loads added no empty folder**: 2 new folders, both non-empty, and each the runId of the logged
   Scan or rehearsal; none of the 36 `--list --json` runIds has a folder;
4. **nothing else in the app-data folder changed**: its top level holds the same two entries, and the owner's `EBWebView`
   is R18.1's row, unchanged to the file.

**Removed 271 · kept 102 non-empty and 24 young empty · added 2 · 397 → 128.**

## R18.4 — Proof A, the sign-in leg, re-run (`logs/29`)

It ran the same 22 checks as the 1.3.2 sign-in proof, with the same outcomes; only the loopback port in the words differs
(`logs/31` §4).

**Press 1** on Account's one *Sign in with Google*:
- The opener was called with the authorize address and answered by the guard (never forwarded, no browser), and the
  window went pending.
- `redirect_to` was exactly `http://127.0.0.1:57534?state=a775965b-…` on the port `oauth_listen_start` answered, with
  provider google, a PKCE S256 challenge, and the listener up.
- There was no flow state before the first hop. The driver's own GET of the captured address (not followed) answered
  **302 to accounts.google.com**, and the newest `auth.flow_state` row's referrer equals the redirect exactly, with PKCE
  true (read-only SQL).
- Two strays answered 404, and the window stayed pending.
- A reply with the right state gave 200 *Signed in.* The window's one PKCE exchange got GoTrue's **404
  `flow_state_not_found`**, shown as *"sign-in failed: invalid flow state, no valid flow state found"*; the listener
  closed and the button went idle.

**Press 2** got a new state and port (57543); its `access_denied` reply gave *"sign-in was refused: access_denied"*, with
no exchange.

**No session key and no `auth.users` row (0 in the last two hours; total 1 → 1).** The opener was answered for exactly
the two presses and forwarded 0 times.

## R18.5 — Proof B, the replay mask with both portals (`logs/30`)

Clarity is live in this dev window (`clarity.js` 200, `collect` 2xx), and 14 of 14 collect bodies were captured and
decoded. **The clean payloads carry 549 text-node values under `<body>`: 541 masked (549 mangled records), 8 blank, 0
readable**, and no window word appears in any text node or analytics string.

**The portals:** the file field's *?* tooltip on the Picker (hovered, not pressed) and the Theme panel (`role=dialog`,
*Appearance*) both render outside `#root`, the panel as `div.sheet-scrim`. Under `<body data-clarity-mask="true">` the DOM
check finds **0 unmasked of 119** text nodes with the panel open and **0 of 77** with the tooltip. Their own words (5 of
the tooltip's, 17 of the panel's) appear in **no text node and no analytics string**. The literal count's hits sit in
attribute values (127) and CSS and element values (767), which Clarity does not mask by design (TASK-020's finding,
unchanged).

**The instrument can fail:**
- Plant (a) moves the panel's text outside the mask, and the DOM check counts 50 unmasked, all in the panel.
- Plant (b) removes `data-clarity-mask` before `clarity.js` loads, and **181 of 184 text nodes arrive readable**, carrying
  the window's words 156 times.
- A short base-36-looking value on a record that was not mangled is never counted as masked.

Both plants were restored, and at the end `<body data-clarity-mask="true">` is as shipped (B7). Against TASK-020's
proof: 15 checks shared, 15 with the same outcome, and `B4.portals` added (`logs/31` §5).

## R18.6 — The full sweep

The same states as round 17 with the same standing exemptions: the dummy's title-bar badges, `PROTOTYPE` rail group,
`storage: localStorage`, `app 0.1.0-design`, underlined rail links and link-blue anchors (`prototype`); its `1.1.0`
against the app's `1.3.2` (`live-number`); and `data-drawer` on the app's `<html>` only. The shell residue on every pair
is exactly those, plus the rail foot's *across 0 sections* text-node split (`logs/16`).

**Against round 17 (`logs/31`):**
- 22 of the 27 pair summaries are identical line for line, digits included.
- 104 of the 112 residue keys are identical.
- The five that moved are the states that show this machine's measurement: Home after *Scan* and after *Dry-run first*,
  Run and Sections after *Scan*, and the rehearsal's Report.

| screen / state (app ← dummy) | words `<main>` 1440 app / dummy / shared | layout | verdict |
|---|---|---|---|
| **Splash**, skipped frame ← `splash.html?offline=1` (4 real boots, 4 refusals) | 13 / 13 / 13 | 0 | **match** · `logs/13` |
| **Consent**, before *Continue* | 13 / 13 / 13 | 0 | **match** · `logs/09-pair-consent` |
| **Home**, nothing measured ← `index.html?empty=1` | 218 / 174 / **149** | 0 | **match**, the summary identical to round 17's · `logs/09-pair-home-unmeasured` |
| **Home**, after *Scan* ← `index.html` | 999 / 369 / 167 | data-driven only (R18.12) | **match + `demo-data`** · `logs/09-pair-home-scanned` |
| **Home**, after *Dry-run first* ← `index.html` + the dummy's own *Dry-run first* | 1000 / 368 / 165 | data-driven only (R18.12) | **match + `demo-data`** · `logs/09-pair-home-rehearsed` |
| **Run**, nothing measured ← `run.html?empty=1` | 58 / 60 / 56 (a split) | **0** | **match**; D-64 holds (`logs/08`) · `logs/09-pair-run-empty` |
| **Run**, at rest after *Scan* ← `run.html` | 104 / 106 / 55 | tile labels and row figures only | **match + `demo-data`** · `logs/09-pair-run-scanned` |
| **Sections**, after *Scan* ← `sections.html` | 252 / 252 / 233 | 0 over 225 aligned units | **match** (seeded sizes against *not measured*) · `logs/09-pair-sections-scanned` |
| **Picker**, not asked, sections 17 · 18 · 19 · 23 | 39 / 43 / 37 each (a split) | 0 | **match** ×4 · `logs/09-pair-picker-*` |
| **Report**, before any run | 2 / 2 / 2 | 0 | **match** · `logs/09-pair-report-empty` |
| **Report**, the rehearsal's ← `report.html?dry=1` | 109 / 88 / 59 | the breadcrumb's `ol` indent (`prototype`, round-09.md:52-54), the same layout lines as round 17 | **match + declared** · `logs/09-pair-report-dry` |
| **History**, nothing run, all four chips | 24 / 24 / 24 ×4 | 0 ×4 | **match** ×4 · `logs/09-pair-history-empty-*` |
| **History**, one rehearsal: All · Dry-runs | 30 / 185 / 24 · 30 / 53 / 24 | pager count only | **match + `demo-data`** · `logs/09-pair-history-*-after` |
| **Settings · General**, before a scan · after the rehearsal | 25 / 25 / **25** · 25 / 25 / 24 | 0 · 0 | **match** (the held-back figure `live-number`) |
| **Settings · Scanning · Notifications** | 8 / 31 / 7 · 8 / 15 / 7 | 0 | **declared** `pending-wave` (round-01a.md:130-131) |
| **Settings · Privacy** | **24 / 24 / 24** | **0** | **match**; the dummy's `?nokeys=1` sentence is not drawn by default |
| **Settings · About** | 45 / 45 / 44 | 0 | **match**: the version line (R18.8); roster, audits and "up to date" (`logs/10`); the panel to the pixel and the note on all five tabs (`logs/11b`, 15 PASS); both buttons pressed, the app's behind the refused opener (`logs/12`) |
| **Account**, signed out | 43 / 43 / **43** | 0 | **match** · `logs/09-pair-account-signed-out` |
| **Elevation**, after *Scan* | 63 / 69 / 60 | 0 | **match** ("Six"/"6") · `logs/09-pair-elevation-scanned` |
| **the status bar**, 10 screens (`logs/11`) | notes identical at both widths | the version and Home's note in the mono face on both, 20 of 20 | **match**; D-68 holds |

## R18.7 — TASK-018

This is unchanged from round 17 and still holds, with the same summaries line for line (`logs/31` §1). With no run, all
four chips drop the total block on both sides (24/24 words, 0 layout mismatches each). With one rehearsal, the Dry-runs
chip drops it on both sides, and All drops it in the app, where the dummy's seed of 21 real runs keeps it: the same rule
on different data (`logs/09-pair-history-*`).

## R18.8 — The version surfaces, and every version the dummy hard-codes

The app shows **`1.3.2`** on every surface (`logs/08`):
- the title-bar chip **`1.3.2`**;
- the status bar **`engine 1.3.2`**, with the version in its own `span.mono` (JetBrains Mono);
- Settings › About **`Desktop 1.3.2 · engine 1.3.2 · MIT`**.

**Every x.y.z the dummy hard-codes** in its pages and scripts (the gallery files left out):
- the seed engine `1.1.0`, in 16 places (`live-number`);
- the app `0.1.0-design` / `0.1.0`, in 2 places (`prototype`);
- the Splash update band's demo `1.2.0`, in 2 places (`demo-data`);
- three seeded npm package versions (`demo-data`).

**None of them claims a 1.3.x**, so the dummy says nothing that contradicts the app. It renders *Desktop 0.1.0-design ·
engine 1.1.0 · MIT* and *engine 1.1.0*, the standing residue of the About and status-bar pairs (`logs/08`,
`logs/09-pair-settings-about-unmeasured`). Those labels were classified long before this round: `app 0.1.0-design` as
`prototype` (GATE4-REPORT A-1) and `1.1.0` against the app's version as `live-number` (round-16.md:81, round 17's R17.3).

## R18.9 — The 1.3.2 engine, end to end (`logs/17`)

The rehearsal's own folder was found by the run id the window recorded (`2026-09-28-11-01-03-s7u7au`):
- the report's `credits.author` is exactly
  `{"name":"the windowsweep team","email":"","website":"https://windowsweep.aoneahsan.com","linkedin":""}`, with
  `tool_version 1.3.2`;
- the session log opens `# windowsweep v1.3.2 - session log` and `# Author:   The windowsweep team`;
- the bundle reads `VERSION 1.3.2` with `WS_TEAM = 'The windowsweep team'`.

Two controls behave as they must. Round 13's 1.3.0 rehearsal fails the author and log checks. Round 17's 1.3.1 rehearsal
passes them and fails the version check.

## R18.10 — §10 axis parity and pre-paint (`logs/19`)

The window is served `public/prepaint.js` byte for byte (`5c56fdb7…`), and its registry equals `axes.json`. **All ten
axes are first written by `/prepaint.js` before `<body>` exists, against first paint at 188 ms.** Parity is **declared
10 · written 10 · unlocatable 0 · different 0** at 1440 and 760 with `windowsweep:prefs` absent; it goes red on a live
plant and clean on the restore.

The URL axis (D-73) holds:
- `?radius=large&density=spacious` and `?type-scale=large` are shown after the boot pass and never persisted;
- *Small* pressed wins, persists alone (`{"radius":"small"}`) and survives a reload;
- the dummy shows and drops the URL axis the same way.

## R18.11 — What the changed files can change (`logs/01b`)

From `5dde309` to `c530312`, under `desktop/src` and `desktop/index.html`:
- **content**: `analytics.ts` (the one `remoteConfig` property), `auth.ts` (the loopback redirect now built by
  `oauth-redirect.ts`, carrying the state) and `index.html` (the mask attribute on `<body>`);
- **new**: `oauth-redirect.ts` and `oauth-redirect.test.ts`.

Outside `src`:
- `engine.rs`, `rundir.rs` and `lib.rs` (TASK-022);
- `oauth.rs` (the listener);
- `tauri.conf.json` (the CSP and 1.3.2);
- `Cargo.toml`, `Cargo.lock` and `package.json` (1.3.2);
- the dummy's `page-settings.js` with `AMENDMENTS-3.md` (the no-keys sentence).

Every one of them is judged by a row of R18.2. The log's two `fatal: path … exists on disk, but not in '5dde309'` lines
are git's answer for the two new files, which the instrument then lists as added.

## R18.12 — Observations, not defects

1. **Three mismatch texts that round 17 did not have are this machine's figures landing on the seed's strings**
   (`logs/32`). The aligner pairs units by text, so an equal string in two different rows reads as an x or colour
   mismatch:
   - After a scan, the app's `temp` tile reads *temp · 2.7 GB* (x 888, after *browsers · 3.0 GB*), which is also the
     seed's tile text (x 664, after *browsers · 3.7 GB*).
   - The app's *Gradle caches* row reads *1.9 GB · 2d*, the same figure as the seed's *Chrome cache* row.
   - After *Dry-run first*, the app's *1 target* row figure *1.3 GB* (ink) meets the seed's *and 4 more* figure *1.3 GB*
     (accent). The *and N more* figure is accent on both sides in both rounds: the app's *10.4 MB* in round 18 and
     *18.2 MB* in round 17, and the dummy's *1.3 GB*, all `oklch(0.462 0.145 128)`.

   Between the two builds the engine changed only its version strings (`logs/31` §0), so what it measured is the machine.
2. **Round 17's three observations carry forward** (`logs/31` §3):
   - the 2 px under Home's held-back well (the range input's default margin in the dummy, `logs/21`) is unchanged;
   - Home after *Scan* still wraps *re-scan* (x 24 against 402) on this machine's longer sentence;
   - `settings.noKeys` is now in the dummy behind `?nokeys=1` (`9a17266`). The app draws it only in a build with no
     destination key, which is not the build under test.
3. **The Amplitude change is visible in storage.** A fresh profile's first read holds `AMP_unsent_*` only (`logs/05`);
   rounds 16 and 17 also read `AMP_remote_config_*`.
4. **This dev window's replay carries one dev-only attribute**: Vite's `data-vite-dev-id` on a dev `<style>`, a source
   path on this machine, in the clean payloads (`logs/30`). A release build has no such element. It belongs to
   TASK-023's class (dev builds send analytics), which is filed, and nothing was changed for it.

## R18.13 — What could not be tested, and why

- **Scope:** the signed-in Account and History screens need an identity, and proof A stops at GoTrue's refusal by
  design.
- **Engine:** the populated Picker needs a third engine run. A real cleanup run and everything behind it are out: Reclaim
  was pressed zero times.
- **Browser:** no browser opens. The guard answers the authorize address itself and refuses every other opener call.
- **Update band:** the running build is newer than the Latest release.
- **Packaged build and its CSP:** this round ran `tauri dev` only. That includes whether the 1.3.2 CSP now reports 0
  violations with Amplitude's remote config off; proof C's six violations on `6d232e5` were those fetches.
- **No-keys build:** see R18.12(2).
- **A second launch's sweep:** this round launched once. The 24 younger empty folders go at the first launch at least a
  day after each was last written.
- **An elevated run keeping its folder:** admin sections are never launched from an agent session.

All of these are **blocked by scope, not failing**. **Analytics were not blocked**, as in rounds 13–17: Amplitude's key
is in the first read of storage (`logs/05`), and Clarity is live (`logs/30`).

## R18.14 — The round's own instruments

Nothing was superseded: every driver ran to completion on the first try, and the pair run-list finished all five batches
(`logs/09r-*`). Five copied drivers were edited: `01b` (its range and header), `02` (the round's ports), `08` (the About
line and the dummy's x.y.z scan), `17` (the pattern `v1\.3\.2` and the 1.3.1 control) and `26b` (section 7, the
processes). All 36 driver sources pass `node --check`, and its control, a planted redeclaration, fails (`logs/33`); before
the run it caught a redeclared `tipState` in `30`. `18-report-crumb` was copied and not run, as in round 17.

- **The leak scan (`logs/28`) exits 1 on three hits, all `VITE_SUPABASE_URL`.** That is the project's Supabase address,
  which the sign-in leg's allow-list must name: the guard's `AUTH` constant and three of its predicate rows (`04`), plus
  the same constant in its proof (`06`) and in proof A (`29`).
  - `logs/28b` classifies the hits without printing a value. It reproduces 28's three hits; **every one is in a driver
    source, with 0 in any log, screenshot, pair or JSON; no key shape; the other four values absent.**
  - The address is public by construction. It is tracked in three of this repository's own docs at HEAD and is in the
    client bundle of every build (a `VITE_` value). It is also committed in 18 files of the root repository, round 13's
    sign-in driver among them.
  - So, as release-kit-1.3.1's note 2 judged the site's GA4 id, **nothing leaked**. The controls: five of five values
    found in `desktop/.env`, and a planted output line is caught.
  - A driver that reads the address from `desktop/.env` at runtime would bring the raw matcher back to 0.
- **The guard's wire-2 log is read every 2.5 s**, so a document replaced between two reads takes its unread events with
  it. Two sets were lost that way:
  - the proof's own wire-2 fulfil and listener calls, which `06` read from the wrapper itself;
  - at 11:09:01, **four calls the dev console names**: Home's `schedule_status` and `list_drives`, twice each
    (StrictMode). The axis driver's hash change to `#/` started them, and its reload 300 ms later aborted them
    (`logs/03-tauri-dev`: *IPC custom protocol failed … Failed to fetch*; the fifth such warning, at 10:47:33, is the
    latch probe).

  Tauri resends a failed call over postMessage (`ipc-protocol.js`), where that document's wrapper applies the predicate,
  and Rust's two answers reached the reloaded document (*Couldn't find callback id*). **None of the four is
  `run_clean`**, so the 38 vectors stand. The enforcement is the wrapper's, not the log's.
- **The guard's background task ended with exit code 1**, which is `taskkill /F` from `23`, as recorded there.
- **Three instruments were written after the run, all read-only**: `28b` (above), `31` (round 18 against round 17,
  including a planted residue item it must catch) and `32` (the new mismatch texts traced).

## R18.15 — Cleanup, each read back

- **`tauri dev`**: the tree was killed from `yarn tauri dev` (cmd pid 10964, `/T`). The 5974 listener (node 10876), the
  app (3392) and the 9361 WebView2 (280) were each shown inside it first; that is 17 processes, plus the guard. Every pid
  is gone, with no `windowsweep-desktop.exe`, no `cargo.exe` and no WebView2 on the round's profile left; the launcher
  (25296) exited by itself. **9361 and 5974 are free** (`logs/23`, `logs/26b`).
- **The guard**: pid 3148, its command line read first, then killed.
- **The dummy's Chrome**: pid 21296, GUID matched, closed gracefully; **9597 is free** (`logs/25`).
- **Other sessions' ports**: 9333, 9334, 9336, 9591 and 9592 were not listening at the start or the end, and were never
  touched (`logs/02`, `logs/23`, `logs/26b`).
- **The profiles**: the owner's is untouched (R18.1). `round18\webview2-profile` stays: **598 files, 87.2 MB**, ignored
  by the root repository, storing the one axis choice `19` made (`{"radius":"small"}`) and no identity. The dummy
  Chrome's profile `ahsan-automation-windowsweep-r18` stays (11.9 MB).
- **The repository**: HEAD `c530312`, with only the owner's PNG untracked before this report was written.
  `desktop/public/prepaint.js`, rewritten by the plugin on `yarn dev`, is **byte-identical** (`5c56fdb7…`), and there is
  no plant in any file. The leak scan is R18.14.
