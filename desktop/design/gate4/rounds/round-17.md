> Round 17 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 17 — 2026-09-26, HEAD `5dde309`, desktop 1.3.1 · **CLEAN.** All six of round 16's findings are closed on the running app (D-68 to D-71, D-73) and in the dummy's seed (D-72), and the full sweep that found them — every screen, all five Settings tabs, 28 states at 1440 and 760, light and dark — finds no new divergence. TASK-018, the 1.3.1 version surfaces, the 1.3.1 engine's team credits, pre-paint and §10 parity still hold, and a URL axis is now shown after the boot pass, never persisted, and yields to an explicit choice.

**Scope:** the re-check of round 16's D-68 to D-73 on `5dde309` ("fix(desktop): GATE 4 round 16 - the app brought to the
dummy, and the dummy's seed corrected"), then round 16's full sweep again, so nothing the fixes touched moved elsewhere.
`logs/01b` reduces every changed `desktop/src` file at `2c5d98e` and `5dde309` to a form formatting cannot touch (the
instrument watched failing on seven plants): **11 with content, 3 new, 1 formatting-only** (`main.tsx`, its comment) — all
in `5dde309`, and each mapped to a finding in R17.2. **HEAD stayed at `5dde309`** from start to end (`logs/01`,
`logs/26b`); `git status --porcelain` shows only the owner's untracked `assets/logo/windowsweep-mark.png` at both ends.

**Build under test:** `yarn tauri dev` from `desktop/` — Vite 8.3.1 on 5974, `windowsweep-desktop v1.3.1` (dev profile),
`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9339` and an isolated
`WEBVIEW2_USER_DATA_FOLDER=…\gate4-evidence\round17\webview2-profile`. The dev start printed `[prepaint] public/prepaint.js
matches axes.json (10 axes)` and `[engine-bundle] the 1.3.1 engine: 41 files … (0 written, 0 removed)` (`logs/03`); the
bundle reads `VERSION 1.3.1`, all 41 files byte-identical to the repository's engine (`logs/01`). **Dummy:** Chrome for
Testing 151.0.7922.77, profile `ahsan-automation-windowsweep-r17`, port 9596, pid 12736 — binary, profile and launch GUID
read from the OS process table before the first navigation (`logs/07`). **Signed out throughout; no identity created,
injected or deleted; nothing written to Supabase.** Lime, light and dark, **1440 and 760**.

**Method — round 16's, unchanged** (`round17\NN-*-source.txt`, 27 drivers copied from round 16 with the r17 tokens, every
stdout in `round17\logs\`; nothing superseded this round). Three extensions, each for a finding: the status-bar driver
reads each unit's effective opacity and compares notes joined (D-68); the axis driver adds the attribute-named URL axis and
an explicit panel choice (D-73); `21` probes Home's held-back well box by box (R17.9). **28 states, 224 captures** in
`round17\pairs\`, plus a close-up of Home's schedule band in `pairs\clips\`.

---

## R17.1 — Safety

| check | result |
|---|---|
| **profile isolation**, before anything else (`logs/05`) | all 6 `msedgewebview2.exe` under this round's `windowsweep-desktop.exe` on `…\round17\webview2-profile\EBWebView`; absent at preflight, 340 files after launch; the window's first storage held only Amplitude's two keys, no `windowsweep:*`. The 7 other WebView2 processes on the machine are the owner's WhatsApp Desktop, never touched |
| **the owner's `EBWebView`** | **1,354 files, newest write 2026-09-26T05:02:35.928Z, Local Storage newest 05:01:57.871Z** — identical at preflight (`logs/02`), after launch (`logs/05`) and after everything stopped (`logs/26b`) |
| **the guard** (`logs/04`, `logs/06`) | round 16's, r17 tokens; predicate **29/29** before any browser, the Splash flag absent at start; attached at 10:18:13.421Z, **before the first catalogue load** (10:18:21.580Z); on the live document wire 2 refused the token by the wrapper and passed the control to Rust, wire 1 refused the token by the fulfil and passed the control; one latch probe failed on purpose; no postMessage retry after a fulfil; `__TAURI_INTERNALS__.invoke` read (`writable:false, configurable:false`), never assigned |
| **the opener, both wires, before any press** | refused on wire 2 and wire 1 by name (`logs/06`), and re-probed on the very document before each app press (`logs/12`) |
| **the Splash flag** | round 16's refusal-only switch, proved in the predicate table; it lived only inside `13-splash` and was deleted (`logs/13`) |
| **the first press** | Consent's *Continue* at **10:19:05.949Z**, after the proof (10:18:40–41Z) |
| **still installed at the end** (`logs/20`) | `installed: true, stillTheWrapper: true`; token refused, control reached Rust |

**Every engine invocation — 32, each with its full vector (`logs/04`, `logs/20`):** `--list --json` ×2 at launch
(10:18:21), ×2 on the proof's reload (10:18:38), ×8 on the four Splash boots (10:19:17–28), ×2 on the roster audit's boot
(10:19:54), **`--scan --developer --days 100 --temp-days 3 --large-file-mb 100`** at 10:28:47.099 (*Scan*, pressed once,
`logs/10a`), **`--all --yes --dry-run --developer --days 100 --temp-days 3 --large-file-mb 100`** at 10:31:25.770
(*Dry-run first*, pressed once, `logs/10b`), and `--list --json` ×16 on the axis driver's eight loads (10:36:22–57,
`logs/19`). **Invocations that could delete: 0. RECLAIM WAS PRESSED ZERO TIMES.** **Refusals: 13** — 3 probe tokens, **6
`plugin:opener|open_url`** (the proof's two, two pre-press probes, the real presses of *Source* and *Support this work*,
fetch #137 and #140), 4 `plugin:updater|check` (the Splash boots).

**Run folders and C:** **333 before, 365 after: 32 new, 0 gone, one per logged invocation by name**; thirty are empty
catalogue-load folders, two hold reports: `2026-09-26-10-28-47-f3baog` → `mode=scan, dry_run=false,
total_reclaimed_bytes=0`; `2026-09-26-10-31-25-5dod82` → `mode=all, dry_run=true, total_reclaimed_bytes=0`. **No report
reclaimed a byte.** C: free rose again, **80.83 → 81.51 GB (+676 MB)**; as in round 16 the rise happened while only
catalogue loads ran — C: already stood at 81.58 GB when the Scan began — and the engine's own reports record **+6.1 MB**
across the Scan and **−11.1 MB** across the rehearsal. This round's own writes to C: were 11.2 MB (the dummy Chrome's
profile) and 112 KB (the run folders).

## R17.2 — D-68 to D-73, re-checked

| id | the fix in `5dde309` | verdict | evidence |
|---|---|---|---|
| **D-68** status bar's machine text | `StatusBar` renders `<Trans i18nKey="app.engine">`, `"engine <1>{{version}}</1>"`, component 1 a `span.mono`; Home's pending note returns `machine: true` | **CLOSED** — the version in **JetBrains Mono on 20 of 20 readings on both sides** (10 screens × 1440/760, round 16: 0/20 in the app); Home's pending note **JetBrains Mono 12px at opacity 0.8 on both**; the version's own span is `span.mono` "1.3.1"; the notes identical on every screen at both widths | `logs/11`, `logs/08` |
| **D-69** Settings › Privacy | `SettingsPrivacy.tsx` draws the dummy's `privacy()` in a `.set-grp`: the note, five `SettingRow`s (`h3` + `p` + `set-ctl` badge); `settings.privacy.*` keys hold the dummy's words; `SettingRow` shared with General | **CLOSED** — words **24 / 24 / 24** at 1440 and 760 (round 16: 31 / 24 / 18); layout **0 mismatches** at 1440 and 760, light and dark (round 16: x 10, width 4, step 4, font 4); structure identical (`h3` 5/5, badges 5/5, `.note` 1/1); matches by eye | `logs/09-pair-settings-privacy-unmeasured`, `pairs\settings-privacy-*` |
| **D-70** Run's hero band | `band band-app` (no `band-tight`) | **CLOSED** — the hero band **32 / 24 px padding, 178 px tall on both sides**, *Per section* at 178 on both; run-empty and run-scanned step mismatches **0** (round 16: 8 px) | `logs/14`, `logs/09-pair-run-*` |
| **D-71** Home's schedule note | `ScheduleSwitch` takes `note`, rendered last in its column; Home passes it | **CLOSED in every Home state** — the note at **x 890, width 275, height 61, three lines, on both sides**, before a scan, after *Scan* and after *Dry-run first* (round 16: x 840, width 337, two lines); the band 1224×197 on both; **Settings' `ScheduleSwitch` (no note) unchanged**: General 25 / 25 / 25 before a scan and 25 / 25 / 24 after the rehearsal (the held-back figure, `live-number`), 0 layout mismatches in both | `logs/09-pair-home-*`, `pairs\clips\home-schedule-unmeasured-*`, `logs/09-pair-settings-general-*` |
| **D-72** the dummy's seed, section 22 | `seed.js:50` `dev:false` (AMENDMENTS-3.md) | **CLOSED** — **seven `dev` badges on each side, sections 1, 2, 3, 4, 5, 17, 20**; words 252 / 252; structure identical (badges equal) | `logs/09-pair-sections-scanned` |
| **D-73** a URL axis | `theme.ts` reads a URL override once, by key or attribute; `applyAllAxes` and the panel layer it; `setAxis` calls `dropUrlOverride`; `prepaint.js` also reads the attribute name | **CLOSED** — `?radius=large&density=spacious`: pre-paint writes `large` at 38.2 ms, **the React boot pass writes `large` again at 222.2 ms**, settled `large` / `spacious`; `?type-scale=large` (the attribute name): shown the same way; **neither persisted** (`windowsweep:prefs` null before and after); the panel shows *Large* / *Spacious* chosen while they are shown; **Corner radius → *Small* pressed: `data-radius` small (wins), `data-density` still spacious, `windowsweep:prefs` `{"radius":"small"}` and nothing else, and *small* survives a reload without the query** | `logs/19` |

## R17.3 — The full sweep

The same states as round 16, the same standing exemptions (the dummy's title-bar badges, `PROTOTYPE` rail group,
`storage: localStorage`, `app 0.1.0-design`, underlined rail links and link-blue anchors — `prototype`; its `1.1.0` against
the app's `1.3.1` — `live-number`; `data-drawer` on the app's `<html>` only). The shell residue on every pair is exactly
those, plus the rail foot's *across 0 sections* text-node split (`logs/16`).

| screen / state (app ← dummy) | words `<main>` 1440 app / dummy / shared | layout | verdict |
|---|---|---|---|
| **Splash**, skipped frame ← `splash.html?offline=1` (4 real boots, 4 refusals) | 13 / 13 / 13 | 0 | **match** · `logs/13` |
| **Consent**, before *Continue* | 13 / 13 / 13 | 0 | **match** · `logs/09-pair-consent` |
| **Home**, nothing measured ← `index.html?empty=1` | 218 / 174 / **149** | 0 | **match** — residue `live-number` (drives, the engine's protected paths) and the carried-forward "Six"/"6" and longer *Never sent* sentence · `logs/09-pair-home-unmeasured` |
| **Home**, after *Scan* ← `index.html` | 950 / 369 / 163 | data-driven only (R17.9) | **match + `demo-data`** · `logs/09-pair-home-scanned` |
| **Home**, after *Dry-run first* ← `index.html` + the dummy's own *Dry-run first* | 951 / 368 / 163 | data-driven only | **match + `demo-data`** · `logs/09-pair-home-rehearsed` |
| **Run**, nothing measured ← `run.html?empty=1` | 58 / 60 / 56 (a split) | **0** | **match**; D-64 holds (`logs/08`) · `logs/09-pair-run-empty` |
| **Run**, at rest after *Scan* ← `run.html` | 105 / 106 / 52 | tile labels and row figures only | **match + `demo-data`** · `logs/09-pair-run-scanned` |
| **Sections**, after *Scan* ← `sections.html` | 252 / 252 / 232 | 0 over 224 aligned units | **match** (seeded sizes against *not measured*) · `logs/09-pair-sections-scanned` |
| **Picker**, not asked, sections 17 · 18 · 19 · 23 | 39 / 43 / 37 each (a split) | 0 | **match** ×4 · `logs/09-pair-picker-*` |
| **Report**, before any run | 2 / 2 / 2 | 0 | **match** · `logs/09-pair-report-empty` |
| **Report**, the rehearsal's ← `report.html?dry=1` | 109 / 88 / 61 | the breadcrumb's `ol` indent (`prototype`, round-09.md:52-54), unchanged from round 16 | **match + declared** · `logs/09-pair-report-dry` |
| **History**, nothing run, all four chips | 24 / 24 / 24 ×4 | 0 ×4 | **match** ×4 · `logs/09-pair-history-empty-*` |
| **History**, one rehearsal: All · Dry-runs | 30 / 185 / 24 · 30 / 53 / 24 | pager count only | **match + `demo-data`** · `logs/09-pair-history-*-after` |
| **Settings · General**, before a scan · after the rehearsal | 25 / 25 / **25** · 25 / 25 / 24 | 0 · 0 | **match** (the held-back figure `live-number`) — the shared `SettingRow` unchanged in effect |
| **Settings · Scanning · Notifications** | 8 / 31 / 7 · 8 / 15 / 7 | 0 | **declared** `pending-wave` (round-01a.md:130-131) |
| **Settings · Privacy** | **24 / 24 / 24** | **0** | **match** — D-69 closed |
| **Settings · About** | 45 / 45 / 44 | 0 | **match** — the version line (R17.5); roster, audits and "up to date" (`logs/10`); the panel to the pixel and the note on all five tabs (`logs/11b`, 15 PASS); both buttons pressed, the app's behind the refused opener (`logs/12`) |
| **Account**, signed out | 43 / 43 / **43** | 0 | **match** · `logs/09-pair-account-signed-out` |
| **Elevation**, after *Scan* | 63 / 69 / 60 | 0 | **match** ("Six"/"6") · `logs/09-pair-elevation-scanned` |
| **the status bar**, 10 screens (`logs/11`) | notes identical at both widths | the version and Home's note in the mono face on both | **match** — D-68 closed |

## R17.4 — TASK-018

Unchanged from round 16 and still holding: with no run, all four chips drop the total block on both sides (24/24 words, 0
layout mismatches each); with one rehearsal, the Dry-runs chip drops it on both sides, and All drops it in the app where the
dummy's seed of 21 real runs keeps it — the same rule on different data (`logs/09-pair-history-*`).

## R17.5 — The version surfaces

The title-bar chip **`1.3.1`**, the status bar **`engine 1.3.1`** with the version in its own `span.mono` (JetBrains Mono),
and Settings › About **`Desktop 1.3.1 · engine 1.3.1 · MIT`** — the About pair's one `<main>` residue against the dummy's
standing `0.1.0-design` / `1.1.0` (`logs/08`, `logs/09-pair-settings-about-unmeasured`).

## R17.6 — The 1.3.1 engine, end to end (`logs/17`)

The rehearsal's own folder, found by the run id the window recorded (`2026-09-26-10-31-25-5dod82`): the report's
`credits.author` is exactly `{"name":"the windowsweep team","email":"","website":"https://windowsweep.aoneahsan.com","linkedin":""}`,
`tool_version 1.3.1`; the session log opens `# windowsweep v1.3.1 - session log` and `# Author:   The windowsweep team`;
the bundle reads `VERSION 1.3.1` with `WS_TEAM = 'The windowsweep team'`. The same checks fail on round 13's 1.3.0
rehearsal, as they must.

## R17.7 — §10 axis parity and pre-paint (`logs/19`)

The window is served `public/prepaint.js` byte for byte (`5c56fdb7…`, the plugin's regenerated file), its registry equal to
`axes.json`; **all ten axes first written by `/prepaint.js` before `<body>` existed, against first paint at 236 ms**;
parity **declared 10 · written 10 · unlocatable 0 · different 0** at 1440 and 760 with `windowsweep:prefs` absent, red on a
live plant and clean on the restore. The URL axis is R17.2's D-73 row. **Observation, not a check:** loaded again *with* the
query after the choice, the window shows `large` over the stored `small` — a link is shown, never persisted, which is the
dummy's own rule; the dummy shows and drops the URL axis the same way.

## R17.8 — What the changed files can change (`logs/01b`)

`2c5d98e` → `5dde309`, under `desktop/src`: **content** — `LastRuns.tsx`, `ScheduleSwitch.tsx` (D-71); `SettingsGeneral.tsx`
(`SettingRow` moved out), `Settings.tsx`, `account.json` (D-69); `Shell.tsx`, `shell.json` (D-68); `Run.tsx` (D-70);
`theme.ts`, `ThemePanel.tsx`, `store.ts` (D-73); **new** — `SettingRow.tsx`, `SettingsPrivacy.tsx`, `theme-url.test.ts`;
**formatting-only** — `main.tsx` (its comment). Outside `src`: `public/prepaint.js` and `vite/prepaint.ts` (D-73's
attribute name), and the dummy's `seed.js` (D-72). Every one of them is judged by a row above.

## R17.9 — Observations, not defects

1. **Home, 2 px below the held-back well** (under the ±3 px tolerance in rounds 16 and 17, found by looking for it,
   `logs/21`): the idle-window slider `input.field[type=range]` carries **margin 2px/2px in the dummy and 0 in the app** —
   Chrome's default margin for a range input, which the dummy's CSS never resets (its only range rule is `.sld
   input[type="range"]`) and the app's preflight does. The well is 112 px against 114, its left column 1 px higher, and the
   page below it 2 px higher. The same static-HTML class round 9 declared `prototype` for the breadcrumb's `ol` padding
   (round-09.md:52-54) — recorded here so it is covered by name, not by tolerance.
2. **Home after *Scan*: the hero column 11 px higher and *re-scan* on a second line in the app** — this machine's sentence
   (*"measured 0 minutes ago across 580 targets in 10 sections"*) is longer than the seed's (*"… 28 targets in 8 …"*), so
   *re-scan* wraps inside the same column width, the column grows 23 px, and its vertical centring moves it up by half.
   Data, not layout: before a scan both sides are identical.
3. **`settings.noKeys`** — *"No destination is configured in this build, so nothing is actually sent from it."* — renders
   only in a build with no destination key; this dev window and every release carry keys, so it was not drawn and does not
   ship. Round 1 recommended adding it to the dummy (round-01a.md:230); the dummy still does not carry it. For the main
   session: add it to the dummy's `privacy()` or keep it as the one app-only build fact.

## R17.10 — What could not be tested, and why

- **Signed-in Account and History** — no identity (scope); formatting-only since round 13 judged them (round 16's R16.8),
  and untouched by `5dde309`. **The populated Picker** — needs a third engine run. **A real cleanup run** and everything
  behind it — Reclaim pressed zero times. **A browser opening**, **Google sign-in** — the guard refuses the opener and
  `oauth_listen_*`. **The update band** — the running build is newer than the Latest release. **The packaged build** —
  `tauri dev` only. **The no-keys build** — R17.9(3). All **blocked by scope, not failing.**
- **Analytics** were not blocked, as in rounds 13–16 (Amplitude's `AMP_*` keys in the first read of storage, `logs/05`).

## R17.11 — The round's own instruments

Nothing was superseded: every driver ran to completion first time. Two drivers were extended for their findings
(`11-statusbar`: effective opacity, notes compared joined — round 16 counted Sections' split count and the dummy's
`app 0.1.0-design` as note differences; `19-axis-parity`: D2 and E), and `08`'s version check strips `app.engine`'s new
`<1>` tags before comparing with `textContent`. The syntax of every edited driver was checked with `node --check`, watched
failing on a planted error first. `18-report-crumb` was copied from round 16 and not run: the breadcrumb's `ol` indent is
round 9's declared `prototype`, and the Report pair's geometry is unchanged from round 16.

## R17.12 — Cleanup, each read back

- **`tauri dev`**: the tree killed from `yarn tauri dev` (pid 21564, `/T`) — the 5974 listener 8996, the app 13048 and the
  9339 WebView2 10764 each shown to descend from it first (`logs/22`); 17 processes with the guard; every pid gone, no
  `windowsweep-desktop.exe`, no WebView2 on the round's profile; **9339 and 5974 free** (`logs/23`, `logs/26b`).
- **The guard**: pid 1044, its command line read first, killed. **The dummy's Chrome**: pid 12736, GUID matched, closed
  gracefully, **9596 free** (`logs/25`). **9333 and 9334** (other sessions, pids 14828 and 13092) and **9591** never touched.
- **The profiles**: the owner's untouched (R17.1); `round17\webview2-profile` stays, **586 files, 87.5 MB**, ignored by the
  root repository, storing the one axis choice E made (`{"radius":"small"}`) and no identity.
- **The repository**: HEAD `5dde309`, only the owner's PNG untracked; `desktop/public/prepaint.js`, rewritten by the plugin
  on `yarn dev`, **byte-identical** (`5c56fdb7…`); no plant in any file. **Leak scan**: 0 hits across the **342 files** this
  round wrote outside the profile, with a control that finds all four `desktop/.env` values in `desktop/.env` (`logs/28`).
