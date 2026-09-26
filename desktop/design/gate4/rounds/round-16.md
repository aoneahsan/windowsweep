> Round 16 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 16 — 2026-09-26, HEAD `2c5d98e`, desktop 1.3.1 · **NOT CLEAN.** The first full sweep since round 9 found six undeclared divergences, none introduced by the changes under review: five in the app (D-68 the status bar's version face, D-69 the Settings Privacy tab, D-70 the Run hero's padding, D-71 Home's schedule note, D-73 a URL axis the window drops) and one in the dummy's seed (D-72, section 22's `dev` flag). TASK-018, the 1.3.1 version surfaces, the 1.3.1 engine's team lines, pre-paint from the plugin-written `prepaint.js` and §10's default parity (10 · 10 · 0 · 0) all hold; the URL axis is the one §10 check that fails (D-73).

**Scope:** a FULL parity sweep, every screen and every Settings tab, on the commit that would be tagged
`desktop-v1.3.1`. What changed since round 15's CLEAN `5934008` (`logs/01`, 137 desktop files): TASK-018 (History's
total steps aside with no real run, dummy first), D37's dependency refresh and the prettier pass, TASK-019 (the
generators become Vite plugins) and the cascade to 1.3.1. `logs/01b` reduces every changed `desktop/src` file and
`index.html` at both commits to a form formatting cannot touch (the TypeScript AST with JSX text normalised, CSS
tokens, JSON values; the instrument watched failing on seven plants): **91 formatting-only, 7 with content, 2 new
tests** (R16.8). **HEAD stayed at `2c5d98e`** from start to end (`logs/01`, `logs/26b`); `git status --porcelain` shows only
the owner's untracked `assets/logo/windowsweep-mark.png` at both ends.

**Build under test:** `yarn tauri dev` from `desktop/` — Vite 8.3.1 on 5974, `windowsweep-desktop v1.3.1` (dev
profile, no `os error 3`), `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9339` and an isolated
`WEBVIEW2_USER_DATA_FOLDER=…\gate4-evidence\round16\webview2-profile`. The dev start printed
`[prepaint] public/prepaint.js matches axes.json (10 axes)` and `[engine-bundle] the 1.3.1 engine: 41 files in
src-tauri/resources/windowsweep/ (0 written, 0 removed)` (`logs/03`); the bundle's `VERSION` reads **1.3.1** and all 41 files
are byte-identical to the repository's engine (`logs/01`). **Dummy:** Chrome for Testing 151.0.7922.77, profile
`ahsan-automation-windowsweep-r16`, port 9596, pid 21008 — binary, profile and a launch GUID read from the OS process table
before the first navigation (`logs/07`). **Signed out throughout; no identity created, injected or deleted, nothing
written to Supabase.** Treatment lime, light and dark, **1440 and 760** (never 390: `minWidth: 760`).

**Method — round 15's, extended where a full sweep needed it** (`round16\NN-*-source.txt`, 26 drivers, every stdout in
`round16\logs\`, every superseded attempt kept). The pair driver (`09`) keeps round 15's capture method and adds: the
dummy's storage cleared before every capture; words from `<main>` **and** the title bar, rail and status bar, textContent
of visible nodes (`checkVisibility()`), every `<details>` opened, diffed **case-insensitively** at 1440 and 760 with
case-only differences reported with their rendered form; the page **as captured** compared unit by unit (x, width,
height, vertical step, font, colour) on an LCS alignment of the shared words. `16` sorts every residue into split ·
live-number · path · words, watched failing on plants. **28 states, 224 captures** in `round16\pairs\`, plus two close-ups
in `pairs\clips\`.

---

## R16.1 — Safety

| check | result |
|---|---|
| **profile isolation**, before anything else (`logs/05`) | all 6 `msedgewebview2.exe` under this round's `windowsweep-desktop.exe` on `…\round16\webview2-profile\EBWebView`; the folder absent at preflight, 340 files after launch; the window's first storage held only Amplitude's two keys, no `windowsweep:*` |
| **the owner's `EBWebView`** | **1,354 files, newest write 2026-09-26T05:02:35.928Z, Local Storage newest 05:01:57.871Z** — identical at preflight (`logs/02`), after launch (`logs/05`) and after everything stopped (`logs/26b`) |
| **the guard** (`logs/04`, `logs/06`) | round 15's v5 with the r16 tokens; predicate **29/29** before any browser, the Splash flag absent at start; attached at 09:00:40.965Z, **before the first catalogue load** (09:00:42.851Z); wire 2 assigned and read back identical; **wire 2** token refused by the wrapper, control reached Rust (`Command gate4_r16_probe not found`); **wire 1** token refused by the fulfil, control reached Rust; one latch probe failed on purpose (fetch #8); no postMessage retry after a fulfil; `__TAURI_INTERNALS__.invoke` read (`writable:false, configurable:false`), never assigned |
| **the opener, both wires, before any press** | `plugin:opener|open_url {}` refused on wire 2 and wire 1 by name (`logs/06`), and re-probed on the very document before each app press (`logs/12`) |
| **one addition, refusal-only** | while `round16\splash-refuse-updater-check.flag` exists, wire 1 also refuses `plugin:updater|check` so Splash holds its skipped frame (round 8 held it the same way); proved in the predicate table with the flag set (the check refused, a deleting run still refused, `--list` still allowed, the opener still refused); the flag lived only inside `13-splash` and was deleted (`logs/13`) |
| **the first press** | Consent's *Continue* at **09:04:35.031Z**, after the proof (09:01:11–17Z) |
| **still installed at the end** (`logs/20`) | `installed: true, stillTheWrapper: true`; the token still refused, the control still reached Rust |

**Every engine invocation — 22, each with its full vector (`logs/04`, `logs/20`):**

| when (UTC) | vector | what caused it |
|---|---|---|
| 09:00:42.851 ×2 | `--list --json` | launch (StrictMode's double catalogue load) |
| 09:01:12.484 ×2 | `--list --json` | the guard proof's reload |
| 09:10:59.672 · 09:11:03.247 · 09:11:06.672 · 09:11:10.028, ×2 each | `--list --json` | the four Splash boots (`logs/13`) |
| 09:12:21.156 ×2 | `--list --json` | the roster audit's Splash boot (`logs/10`) |
| **09:31:42.122** | **`--scan --developer --days 100 --temp-days 3 --large-file-mb 100`** | *Scan*, pressed once (`logs/10a`) |
| **09:36:32.371** | **`--all --yes --dry-run --developer --days 100 --temp-days 3 --large-file-mb 100`** | *Dry-run first*, pressed once (`logs/10b`) |
| 09:45:42.715 · 09:45:55.082 · 09:45:59.998, ×2 each | `--list --json` | the three axis-parity loads (`logs/19`) |

**Invocations that could delete: 0. RECLAIM WAS PRESSED ZERO TIMES** — the hero's buttons taken by position *and* exact
label (`[0]` "Scan", `[1]` "Dry-run first"; the driver aborts on `[2]`). **Refusals: 13** — 3 probe tokens (proof wire 2,
proof wire 1, final), **6 `plugin:opener|open_url`** (the proof's two, the two pre-press probes, the two real presses of
*Source* and *Support this work*, fetch #157 and #160), 4 `plugin:updater|check` (the Splash boots, fetch #37, #48, #58, #69).

**Run folders and C:** (`logs/02`, `logs/20`, `logs/26b`) — **311 before, 333 after: 22 new, 0 gone, one per logged
invocation by name**. Twenty are the empty folders a catalogue load leaves; two hold reports:
`2026-09-26-09-31-42-h7w5ba` → `meta.mode=scan, meta.dry_run=false, totals.total_reclaimed_bytes=0`;
`2026-09-26-09-36-32-c7tfla` → `meta.mode=all, meta.dry_run=true, totals.total_reclaimed_bytes=0`. **No report reclaimed a
byte.** 🔴 **C: free ROSE, 79.88 GB → 80.97 GB (+1,084 MB)** — the direction a deletion would produce, so it was traced
rather than dismissed: the engine's own reports record C: around the only two runs of the round, **+1.6 MB** across the
Scan and **+8.9 MB** across the rehearsal, and C: already stood at 81.36 GB when the Scan began (09:31:43), so the rise
happened in a window where the engine ran nothing but `--list --json`. Other sessions were active (9333 and 9334 came
up during the round); the drive is not an instrument that attributes this delta — the reports are. This round's own
writes to C: were 11.9 MB (the dummy Chrome's profile) and 113 KB (the run folders).

## R16.2 — The verdict table

"Match" is strict, as in rounds 7–8: nothing undeclared outside `prototype` · `demo-data` · `live-number` ·
`pending-wave`. Standing exemptions, visible in every pair and not repeated below: the dummy's title-bar badges
(`standard user`, `design dummy · demo data`), its `PROTOTYPE` rail group (Contents, Components), `storage: localStorage`
and `app 0.1.0-design` (`prototype`, GATE4-REPORT A-1), its underlined rail links and link-blue anchors (`prototype`,
R7.2/R9.2), `1.1.0`/`engine 1.1.0` against the app's `1.3.1` (`live-number`), and `data-drawer` on the app's `<html>`
only (the drawer's state, not an axis). **Text-node splits** — the same words cut into more nodes on one side, rendered
in the same face (checked) — are not divergences: the rail foot's *across 0 sections*, Run's *0 of 11 sections*, the
Picker eyebrow, Sections' *26 of 26 shown*.

| screen / state (app ← dummy) | words `<main>` 1440 app / dummy / shared | layout | verdict |
|---|---|---|---|
| **Splash**, the skipped frame ← `splash.html?offline=1` (4 real boots) | 13 / 13 / 13 | 0 mismatches | **match** (D-68 in its status bar) · `logs/13` |
| **Consent**, before *Continue* ← `consent.html` | 13 / 13 / 13 | 0 | **match** · `logs/09-pair-consent` |
| **Home**, nothing measured ← `index.html?empty=1` | 218 / 174 / **149** — round 13's count | D-71 | **D-71**; residue `live-number` (drives, the engine's protected paths) and the two carried-forward items: "Six"/"6" (§10's countable carve-out) and the longer *Never sent* sentence (R3, "consistent copy") · `logs/09-pair-home-unmeasured` |
| **Home**, after *Scan* ← `index.html` | 950 / 369 / 163 | D-71; the rest data-driven | **D-71**; the residue is this machine's 580 targets, tiers, sizes and browsers against the seed (`demo-data`), *nothing offered yet* where the seed has every section asked, no finished run against the seed's runs; held back *not measured* after a scan without a rehearsal is declared (AMENDMENTS-2.md:326, D-65) · `logs/09-pair-home-scanned` |
| **Home**, after *Dry-run first* ← `index.html` + the dummy's own *Dry-run first* | 951 / 368 / 162 | D-71 | **D-71**; the rehearsal's caption, ladder label and held-back words shared on both sides · `logs/09-pair-home-rehearsed` |
| **Run**, nothing measured ← `run.html?empty=1` | 58 / 60 / 56 (a split) | **8 px** | **D-70**; D-64 holds (`logs/08`) · `logs/09-pair-run-empty`, `logs/14` |
| **Run**, at rest after *Scan* ← `run.html` | 105 / 106 / 52 | **8 px**; tile labels data-driven | **D-70**; map tiles and sizes `demo-data` · `logs/09-pair-run-scanned` |
| **Sections**, after *Scan* ← `sections.html` | 252 / 253 / **232** | 0 mismatches over 224 aligned units | **D-72 (dummy)**; the rest seeded sizes against *not measured* for the 9 sections a scan does not measure · `logs/09-pair-sections-scanned` |
| **Picker**, not asked, sections 17 · 18 · 19 · 23 ← `picker.html?empty=1[&section=N]` | 39 / 43 / 37 each (a split) | 0 | **match** ×4 · `logs/09-pair-picker-*` |
| **Report**, before any run ← `report.html?empty=1` | 2 / 2 / 2 | 0 | **match** · `logs/09-pair-report-empty` |
| **Report**, the rehearsal's ← `report.html?dry=1` | 109 / 88 / 59 | the breadcrumb 40 px in and 13 px down in the dummy, and its knock-on | **match + declared**: the dummy's `ol.crumbs` keeps the browser's list margin and padding that the app's preflight resets (`logs/18`) — `prototype`, round-09.md:52-54; the rows are the seed's 8 steps against this rehearsal's 11 (`demo-data`) · `logs/09-pair-report-dry` |
| **History**, nothing run: All · This machine · Other machines · Dry-runs ← `history.html?empty=1` + its chips | 24 / 24 / 24 ×4 | 0 ×4 | **match** ×4 — TASK-018 (R16.4) · `logs/09-pair-history-empty-*` |
| **History**, one rehearsal: All ← `history.html` | 30 / 185 / 24 | pager width only | **match + `demo-data`** (the seed's 25 rows) — TASK-018 (R16.4) · `logs/09-pair-history-all-after` |
| **History**, one rehearsal: Dry-runs ← `history.html` + its chip | 30 / 53 / 24 | 0 | **match + `demo-data`** — TASK-018 (R16.4) · `logs/09-pair-history-dry-after` |
| **Settings · General**, nothing measured ← `settings.html?empty=1` | 25 / 25 / **25** | 0 | **match** · `logs/09-pair-settings-general-unmeasured` |
| **Settings · General**, after the rehearsal ← `settings.html` | 25 / 25 / 24 | 0 | **match** (the held-back figure, `live-number`) · `logs/09-pair-settings-general-measured` |
| **Settings · Scanning** | 8 / 31 / 7 | 0 | **declared** — the app's *"This tab is not built yet…"*, `pending-wave` since round 1 (round-01a.md:130; CLICK-DUMMY-INVENTORY-gate4-rounds-1-4.md:196) · `logs/09-pair-settings-scanning-unmeasured` |
| **Settings · Notifications** | 8 / 15 / 7 | 0 | **declared**, as Scanning (round-01a.md:131) · `logs/09-pair-settings-notifications-unmeasured` |
| **Settings · Privacy** | 31 / 24 / 18 | x 10 · width 4 · step 4 · font 4 | **D-69** · `logs/09-pair-settings-privacy-unmeasured` |
| **Settings · About** | 45 / 45 / 44 | 0 | **match** — the version line (R16.5); roster, both audits and "up to date" as round 15 (`logs/10`); the panel to the pixel and the status note on all five tabs (`logs/11b`); both buttons pressed, the app's behind the refused opener (`logs/12`) |
| **Account**, signed out ← `account.html` | 43 / 43 / **43** | 0 | **match** · `logs/09-pair-account-signed-out` |
| **Elevation**, after *Scan* ← `elevation.html` | 63 / 69 / 60 | 0 | **match** ("Six"/"6", carried forward) · `logs/09-pair-elevation-scanned` |
| **the status bar**, every shelled screen (`logs/11`) | the notes match on all 10 screens at both widths once the dummy's `app 0.1.0-design` (`prototype`) and the Sections count's text-node split are set aside; `.only-wide` hides them at 760 on both sides | the version's face; Home's pending note's face | **D-68** |

## R16.3 — The new defects, D-68 to D-73 — each older than the changes under review

`logs/01b` shows every file below either formatting-only between `5934008` and `2c5d98e` or, for `main.tsx`, changed only
in its `buildVersion` lines; the dummy changed only `history.html` and `page-history.js` (TASK-018). **No earlier round
measured these surfaces' geometry or type.** Rounds 7–10 saved the dummy's whole Settings page text, the hidden Privacy
panel included, but judged the visible General tab — round 8's check lists 28 dummy texts and three ABSENT lines, none from
Privacy (`round8/logs/words-populated-1440.txt:322-341`) — and rounds 12–15 did not read the tab; so round 14's line that
round 8 judged "the other four tabs" *match + declared* did not hold for Privacy.

**D-68 · app · the status bar's machine text is not set in the mono face.**
(a) **The engine version, on every shelled screen, both widths, both modes.** Dummy: `engine <span class="mono"
data-ws-text="engineVersion">1.1.0</span>` (`splash.html:91`, `settings.html:63`, `index.html:353`, every page) —
**JetBrains Mono** 12px. App: `Shell.tsx:360` `<span>{t('app.engine', { version })}</span>` with `shell.json:4` `"engine
{{version}}"` — the whole run in **Archivo** 12px. Measured **20 of 20** readings mono in the dummy, **0 of 20** in the app
(`logs/11`). (b) **Home's note before any run**: the dummy's `index.html:359` `<span class="only-wide mono"
style="opacity:.8">the log path appears once a run has written one</span>`; the app's `Shell.tsx:321` returns `{ text:
t('app.logsPending') }` without `machine: true`, so the sentence is Archivo at full opacity and only a real log path gets
mono and 80 % (1440 only — `.only-wide` on both). Since `2721b75`/`5f2bc84` (2026-09-05) and `a3c7fca` (2026-09-07).
Shots: `pairs\splash-skipped-1440-light-{app,dummy}.png`, the foot. **Resolution:** the dummy owns the type (IRON rule
12) — a mono span around the version in `StatusBar`, and `machine: true` for the pending sentence; or amend the dummy.

**D-69 · app · the Settings Privacy tab carries other words and another layout.** Dummy `page-settings.js:253-279`
`privacy()`: the note *"The cleanup engine makes zero network calls, and its own test suite asserts that. Everything below
is about this desktop window only. windowsweep collects it to improve the product for everyone, and there is no switch
for it."*; four `set-grp` rows — a 16px/600 `h3` label (*Product analytics*, *Behaviour analytics*, *Session replay*,
*Crash reports*), one short line (*"Which screens and which buttons."*, *"This window, with all text masked."*, *"Stack
traces with paths stripped."*), an `on` badge at the column's edge (x 736); a *Never sent* row, *"A file path, a folder
name, a drive label, your machine name, your Windows user name, or the contents of anything."* App `Settings.tsx:90-154`:
the Consent notice's keys — `consent.lede` (*"…makes **zero network calls** – its own test suite asserts that, and that does
not change. What follows is only about the desktop window you are looking at."*), a full-width `.lst` whose rows carry a
15px/400 label **plus a vendor badge** (*Google Analytics 4*, *Amplitude*, *Microsoft Clarity*, *Sentry*) and the notice's
longer lines, `on` at x 1164, *Never sent:* with *"…A run summary is a count and a number of bytes."*, and the paragraph
*"There is no switch for this and no setting to find. This is how windowsweep gets better for the next person who runs
it."* — none of which is in the tab's dummy. 6 dummy units absent, 13 app-only; layout x 10 · width 4 · step 4 (rows 58
against 85 px) · font 4; `h3` 0/5, badges 9/5; 1440 and 760, light and dark. **History:** both sides rewritten in one
commit, `67c0975` (2026-09-07 15:45), five minutes after round 2's build — round 2's "Privacy tab now correct" judged the
older text, and no round has diffed the tab's words since (above). Shots: `pairs\settings-privacy-unmeasured-1440-light-{app,dummy}.png`.
**Resolution:** the main session's — the dummy's tab written to the notice's words and list (dummy first), or the app
drawing the dummy's rows.

**D-70 · app · the Run screen's hero band is 8 px shorter.** App `Run.tsx:280` `<section className="band band-app
band-tight">` (padding 32 / **16** px); dummy `run.html:24` `<section class="band band-app">` (32 / **24** px). Everything
below the hero — the rule, *Per section*, *Log*, the rows, the map band — sits **8 px higher** in the app, in every Run
state (the class is unconditional; measured before a scan and at rest after one), at 1440 and 760 (*Per section* 102 against 110 px from *Start the safe run*; 114/122 at 760; after the scan *What is
going* 116/124). The dummy's hidden bands take no space (`logs/14` lists every band on both sides). Since `5f2bc84`
(2026-09-05). Shots: `pairs\run-empty-1440-light-{app,dummy}.png` (the rule at y 210 / 218). **Resolution:** drop
`band-tight` from the hero, or amend the dummy.

**D-71 · app · Home's schedule note sits under the switch instead of beside it.** Dummy `index.html:286-294`: the
`.well.pad` is a flex row — the switch, then one column holding *Off*, the acknowledgement line and *"Runs the safe batch
once a week and tells you what it freed. Never the sections that need you."* App `LastRuns.tsx:187-192`: a block
`.well.pad` — `<ScheduleSwitch/>`, then the note as its own `<p>` with a top margin. The note starts at the panel's edge
(x 840 against 890 at 1440, 37 against 87 at 760), wraps in 2 lines instead of 3, and the panel is 11 px shorter (186
against 197), in every Home state. The app's comment names `index.html:239-244` "the switch, then its state, then the note"
— the order was transcribed, not the column. Since `a75ac9b` / `90f7b90` (2026-09-07/08). Shots:
`pairs\clips\home-schedule-1440-light-{app,dummy}.png`. **Resolution:** the dummy's flex row in `LastRuns.tsx`.

**D-72 · DUMMY · section 22 is flagged `dev` in the seed and not in the engine.** `seed.js:50` `{ id:22, key:'globals', …
dev:true }` — while its own header says every dev flag *"is transcribed from the real catalogue in lib/constants.ps1"* — and
`lib/constants.ps1:69` has `Dev = $false` (since 1.1.0, `3c4d54e`). The app reads the engine, so its Sections screen shows
seven `dev` badges (1, 2, 3, 4, 5, 17, 20) where the dummy shows eight (+22); badges 43/44 (`logs/09-pair-sections-scanned`).
**The app is right. Resolution:** `seed.js:50` to `dev:false` (the round-7 D-37 class).

**D-73 · app · a URL axis is applied before first paint and then taken away.** The theming contract, and the dummy's own
`app.js:99-111` (*"URL overrides are SHOWN, never persisted"*), show `?radius=large&density=spacious`; the dummy settles on
`large` / `spacious` (`logs/19`). The window's `prepaint.js` writes them too — `data-radius="large"` at **39.7 ms**, before
`<body>` — and then `main.tsx:16` `applyAllAxes(readPrefs())` rewrites both from storage at **221.1 ms**; `readPrefs()`
(`theme.ts:77`) reads localStorage only, so the settled window shows `medium` / `comfortable` while `location.search` still
carries the query. **Not persisted: holds** (no key changed). `main.tsx`'s comment says the second pass "costs nothing
because the attributes are already correct" — true for stored preferences, not for the URL layer `prepaint.js` honours.
Since `5f2bc84` (2026-09-05); round 13's parity check never loaded a URL axis. **Resolution:** the React-side pass honours
the same URL-over-storage precedence (shown, never written), or is dropped as redundant after pre-paint.

## R16.4 — TASK-018 (`data-ws-hist-sum` / `HistoryHeader.tsx` `runs > 0`)

- **No run at all** — all four chips on both sides: the total block is gone, *No runs yet* stands; 24 of 24 words on
  each chip, identical order, 0 layout mismatches (`history-empty-*`). *"0 B, freed in the last 0 runs"* appears nowhere.
- **One rehearsal, Dry-runs chip** — both views hold no real run and **both drop the block**; the rows are this window's
  rehearsal against the seed's three dry-runs (`history-dry-after`).
- **One rehearsal, All** — the app's view holds only the rehearsal and drops the block; the dummy's seed has 21 real runs and
  keeps it (*151.6 GB freed in the last 21 runs*) — the same rule on different data (`history-all-after`).
- One or more real runs (the block shown) needs a real cleanup run, which a round never makes — the rule's shown branch
  is unchanged code, and the dummy draws it with its seed.

## R16.5 — The version surfaces

The title-bar chip **`1.3.1`** and the status bar **`engine 1.3.1`** (`logs/08`, every capture); Settings › About reads
**`Desktop 1.3.1 · engine 1.3.1 · MIT`** — the pair's one `<main>` residue against the dummy's standing `Desktop
0.1.0-design · engine 1.1.0 · MIT` (`logs/09-pair-settings-about-unmeasured`). The About panel asks Rust first; the
cascade's `buildVersion` only stands in outside a Tauri window (R16.8).

## R16.6 — The 1.3.1 engine, end to end (`logs/17`)

The rehearsal's own folder, found by the run id the window recorded (`2026-09-26-09-36-32-c7tfla`), never by date:
the report's `credits.author` is exactly **`{"name":"the windowsweep team","email":"","website":"https://windowsweep.aoneahsan.com","linkedin":""}`**,
`credits.tool_version 1.3.1`, `meta.launcher desktop`; the session log opens `# windowsweep v1.3.1 - session log` and
**`# Author:   The windowsweep team`**. The bundle reads `VERSION 1.3.1` with `WS_TEAM = 'The windowsweep team'`.
**Watched failing:** the same checks against round 13's 1.3.0 rehearsal (`2026-09-25-10-50-07-wdeo0j`, author *Ahsan
Mahmood*, the owner's email and LinkedIn) fail both, as they must.

## R16.7 — §10 axis parity, pre-paint from the plugin's `prepaint.js` (`logs/19`)

- **The script:** the window is served `public/prepaint.js` byte for byte (`754b3029…`), headed `GENERATED by
  vite/prepaint.ts`, its embedded registry equal to `axes.json` projected as `prepaint.ts` projects it (10 axes).
- **Before first paint:** a recorder installed before any page script logged every `<html>` `data-*` write on one boot:
  **all ten axes first written by `/prepaint.js`, before `<body>` existed, at 32.6–32.9 ms, against first paint at 280 ms**;
  `main.tsx`'s handover rewrote the same values at 256 ms (a no-op here — D-73 is where it is not).
- **Parity:** the dummy's ten defaults parsed from its `app.js`: **declared 10 · written 10 · unlocatable 0 · different 0**
  at 1440 and 760, with `windowsweep:prefs` absent (pre-paint ran from nothing); a live plant turned it different 1,
  unlocatable 1, and the restore read clean, order-insensitively.
- **A URL axis:** applied pre-paint, **not shown** once settled — D-73; **not persisted** — holds.

## R16.8 — What the changed files can change (`logs/01b`)

Of 100 changed files under `desktop/src` plus `index.html`, **91 are formatting only** (`Account.tsx`, every account
component and every history component but `HistoryHeader.tsx` among them, so signed-in Account and History judged in
round 13 hold by construction, TASK-018's header aside), **2 are new tests**, and **7 carry content**: `HistoryHeader.tsx` (TASK-018's `runs > 0`); `SettingsAbout.tsx`, `config.ts`, `main.tsx`, `vite-env.d.ts`
(`appVersionFallback '1.2.0'` → `buildVersion`, the manifest's version); `analytics.ts` (Sentry 11's `dataCollection`,
every category off); `axes.json` (its `_comment` only). `git diff --stat 5934008 2c5d98e -- desktop/src/screens/Account.tsx
desktop/src/components/account` lists 4 files, 108 insertions and 27 deletions — the dispatch expected none; all four are
formatting-only here, the prettier pass `1d6e458` being the only commit that touched them.

## R16.9 — What could not be tested, and why

- **Signed-in Account and History** — no identity was created or injected; their code is formatting-only since round 13
  (R16.8), which judged them. **Blocked by scope, not failing.**
- **A real cleanup run** and every state behind it (Run's finish band for a real run, History's shown total, Report of a
  real run) — Reclaim pressed zero times, deliberately. **Blocked, not failing.**
- **The populated Picker** — needs a dry-run of an interactive section, a third engine run beyond the round's two presses;
  its files are formatting-only since round 15's `5934008` (R16.8), and round 9 last judged it populated. **The Run screen
  after the rehearsal** was read (`logs/10b`: *Finished*, 11 of 11, every row `dry-run`) but has no dummy counterpart to
  pair — the dummy's rehearsal answers on Home.
- **A browser actually opening** from *Source* / *Support this work*; **Google sign-in** — the guard refuses the opener
  and `oauth_listen_*`. **The update band** (`splash.html`'s default) — the running build (1.3.1) is newer than the Latest
  release (1.3.0), so the check answers *none*.
- **The packaged build** — `tauri dev` only. **Measure without elevating** and the elevated run — not pressed (IRON rule 10).
- **Analytics** were not blocked this round, as in rounds 13–15: the window initialised Amplitude (its `AMP_*` keys were in
  the first read of storage, `logs/05`).

## R16.10 — The round's own instrument faults, each corrected before judging

1. **`01b`, attempt 1** — read `.rise:nth-child(n+5)` against `(n + 5)` as a content change (the An+B grammar allows the
   space) and printed only the first difference per file. Folded inside `:nth-*()`, every hunk printed, two plants added
   (`logs/01b-….attempt1-nth-child-spacing-and-first-diff-only.txt`).
2. **`13-splash`, attempt 1** — `Page.navigate` to `…/#/` from `#/run` is a same-document fragment change, not a boot: 12
   "boots", no update check, 0 refusals, no capture. Now round 15's boot (`#/` then a reload); 4 boots, 4 refusals, every
   capture on its first try (`logs/13-splash.attempt1-fragment-navigation-is-not-a-boot.txt`). No engine call came of it.
3. **`09-pair`, the five Settings pairs, attempt 1** — geometry was read with every `<details>` open; on the dummy's
   Scanning tab that lengthened `<main>` past the fitted viewport, a scrollbar narrowed the column, and the lede
   "rewrapped" 42 px narrower in the reading only. Geometry now comes from the page as captured; words still open every
   disclosure. Re-run; only that artefact moved (`logs/09-pair-settings-*.attempt1-geometry-read-with-details-open.txt`).
4. **`15-clip` home-schedule, attempt 1** — `SCOPE=.panel` found no panel and clipped the paragraph alone (`p.t-sm.ink-3`
   339×45 / 289×68); its log and clips were overwritten by the `section` re-run — recorded here instead.
5. **Alignment artefacts, read and set aside:** Report's "—" colour pairs an app *Note* dash with a dummy *Would free*
   dash (both sides draw each column's dash alike); Home's legend, tiles, held-back well and *re-scan* offsets follow
   this machine's data.
6. **A stray `python -`** in one shell command waited on stdin; stopped (pid 12604) before it read or wrote anything, and
   the file edit queued behind it applied as written.

## R16.11 — Cleanup, each read back

- **`tauri dev`**: the tree killed from `yarn tauri dev` (pid 16468, `/T`, 16 processes) — the 5974 listener 7120, the app
  25772 and the 9339 WebView2 1496 each shown to descend from it first (`logs/22`); every pid gone, no
  `windowsweep-desktop.exe`, no WebView2 on the round's profile; **9339 and 5974 free** (`logs/23`, `logs/26b`).
- **The guard**: pid 8968, its command line read first, killed. **The dummy's Chrome**: pid 21008, GUID matched, closed
  gracefully, **9596 free** (`logs/25`). **9333 and 9334** (other sessions, pids 14828 and 13092) and **9591** never touched.
- **The profiles**: the owner's untouched (R16.1); `round16\webview2-profile` stays, **597 files, 87.1 MB**, ignored by the
  root repository's `.gitignore`. No identity was ever in it.
- **The repository**: HEAD `2c5d98e`, only the owner's PNG untracked; `desktop/public/prepaint.js`, rewritten by the plugin
  on `yarn dev`, **byte-identical** (`754b3029…`); no plant in any file. **Leak scan**: 0 hits across the **350 files**
  this round wrote outside the profile, for the four `desktop/.env` values of 16+ characters and four key shapes, with a
  control that finds all four values in `desktop/.env` (`logs/28`).
