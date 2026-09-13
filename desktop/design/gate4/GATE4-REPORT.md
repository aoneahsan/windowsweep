# GATE 4 — parity of the INSTALLED desktop app against the approved click dummy

**Date:** 2026-09-07 · **Build under test:** `C:\Users\PC\AppData\Local\windowsweep\windowsweep-desktop.exe`,
version **1.1.0**, built **13:46**, registered under HKCU Uninstall · **Engine:** the bundled tree at
`…\windowsweep\windowsweep\`, **38 files**, verified intact · **WebView2:** Edg/152.0.4191.66 ·
**Treatment:** lime, light and dark · **Widths:** 1440 and 760.

🔴 **760, not 390.** `tauri.conf.json` sets `minWidth: 760`, so the product cannot be narrower and a failure
at 390 is one nobody can act on. The axis-attribute probe was additionally taken at 390 and is
width-independent (proved below), which is the only thing 390 can honestly tell us.

**Pairs:** 11 screens × 2 widths × light and dark = **44 pairs, 88 captures**, all present.
Full resolution: `D:\work\windowsweep-root\gate4-evidence\<screen>-<width>-<mode>-{dummy,app}.png`
(outside git, 14.98 MB). Six representative pairs are copied beside this file.

> 🔴 **This document now holds TWO rounds.** Round 2 is below and is current. **Round 1 follows it,
> unchanged**, because its measurements are what the fixes were made against and several of them are still
> the live diagnosis. Round-1 captures for the six re-judged screens are preserved at
> `gate4-evidence\round1\` (48 files).

---

# ROUND 9 — 2026-09-14, the current source (HEAD `8361a48`, desktop 1.2.0) · NOT CLEAN — D-47, D-48 and D-49 are fixed and proved; one new blocker, D-55 (Home's headline figure after a Picker ask)

**Build under test:** `main` at `8361a48` (pushed; `git status --short -- desktop` empty at the start and after the
build gate; HEAD unmoved to the end), `yarn tauri dev` from `desktop/` — Vite 8.2.2 on 5974, the Rust `dev` profile
already built, `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333 --host-resolver-rules="MAP <the
analytics and error hosts> ~NOTFOUND"`. `app_version` over the real IPC answered **1.2.0** on both launches, and every
report file the round produced says `tool_version 1.2.0`. WebView2 Edg/152.0.4191.66. **Dummy:** Chrome for Testing
151.0.7922.77, headless, profile `ahsan-automation-windowsweep-r9` on 9287 — the port proved free on both address
families before each launch, the profile read back from the OS process table and the listener table.
**Treatment:** lime, light and dark. **Widths:** 1440 and 760. **Account:** none — the local Windows user,
unelevated, signed out (sign-in is not configured in this build; the product has no admin role, so no flow could run
as an admin). **Two launches:** the connection dropped twice mid-round and everything I had running was stopped for
me; the three ports were re-verified free, the app, the guard (the same file, re-proved live before the removal press)
and the dummy's Chrome relaunched on the same ports, and the first launch's records are kept as `*.launch1.*`.

**Pairs:** 124 complete pairs, 248 captures (42 MB) in `gate4-evidence\round9\pairs\` — the eleven screens populated
in both themes at both widths; History with data (All, Dry-runs, Other machines); Report with data (the newest
dry-run, *Show the JSON*, gone, missing, unreadable); the Picker's bar in Permanent mode and the D-48 dialog against
`#pick-confirm`; Home, Picker, Settings, History and Report before a scan; Home after a Picker ask (D-55); Home and
Settings after a safe-batch rehearsal; Splash's skipped frame on a real boot. Four app-only captures record states
the dummy does not draw (D-55, D-59).

## R9.1 — How the round was made safe, and how each instrument was proved first

| instrument | what it did | proved by |
|---|---|---|
| **IPC guard, at the transport** | round 8's v4 guard unchanged in method (CDP `Fetch` on `http://ipc.localhost/*`; the engine's argv re-parsed the way `Read-Arguments` does, so the LAST mode flag decides; refusals are a 403 with `Tauri-Response: error`, a JSON body and CORS headers; preflights continued), with ONE allowance added so History and Report could be judged with real records: a dry-run of the safe batch (`--all --dry-run`), or of an `--only` list whose ids are all in the safe batch or in {17, 18, 19, 23}. Refused as before: every real run, `--elevate`, the task modes, `--select-file` on a real run, `write_select_file`, `--i-understand-deep`, `--hiberfil`, `--permanent`, both `oauth_*`, dialog / opener / process, every updater command but `check` | **offline**, the parser sliced from the guard file itself: **35 of 35** argv cases (round 8's 25 re-judged, plus edges such as `--dry-run --all --only 12`, a dry-run of admin section 12, refused); two plants in copies turned it red — *any dry-run allowed* → 6 cases, *the first mode wins* → 4. **Live, on each launch:** `app_version` → `1.2.0`; eight plants harmless even if the guard failed (an unknown command, `--list --permanent`, `write_select_file`, non-existent dialog / opener / process / updater / oauth commands) all refused, a later `list_drives` allowed. **Totals:** 259 calls; the only refusals are those plants (16), the Splash policy (1) and the single `write_select_file` of the D-48 proof. **The app never attempted a forbidden call** |
| **the postMessage fallback** | the console recorded for "IPC custom protocol failed" | **0 lines** across both launches; every reload waited for a 2 s quiet guard log first |
| **analytics, no destination reached** | the hosts resolve to `~NOTFOUND` in the WebView2; the guard failed every other analytics request and read Amplitude's POST before answering it locally | 746 attempts in `logs\analytics-net.jsonl`, each failed or answered locally; none delivered |
| **axis probe (§10)** | defaults parsed from the dummy's own `app.js` `AXES`: **declared 10 · written 10 · absent 0 · different 0**, identical at 1440 and 760 | the parse plant and the live plant each turned it red; restored clean |
| **word check** | round 8's method unchanged — textContent snapshots, the whole-string rule, five tiers, and the clip report (visible ≥ 95 % on one side, < 50 % on the other) — over **28 surfaces × 2 widths = 56 pairs**, with a provenance pass (each app-only string searched in the dummy's source, each dummy-only string in the app's catalogue) | three plants in copies of this round's snapshots, originals hash-checked: a changed word → the `ABSENT` / `APP ONLY` pair; the separator's double spaces → `LENIENT-LIVE`; a visible sentence marked 1 % shown → `CLIPPED IN APP` |
| **sweeps, hit areas, focus, 100 ms** | round 8's probe on both sides, and a new driver that runs the same probe (sliced from its file, never restated) on the two surfaces round 8 never swept: the bar with rows ticked and the D-48 dialog open | a low-contrast, an 11 px and a 560 px plant each found and gone when removed; the `::before` plant takes a switch's hit area from 44 to 18 (22 on Elevation) |

## R9.2 — The verdict table

| surface | 1440 · 760 · light · dark | what matches | what diverges |
|---|---|---|---|
| **Home** | **diverge — blocker** | after a scan, all twelve bands, the hero's two decimals, the held-back figure after a rehearsal, D-52's lead and category sentences; before a scan, the dummy's `?empty=1` | **D-55** (after a Picker ask), D-57; D-58 (dummy-originated) |
| **Run** | match | at rest after a scan: `READY TO RUN` · `34.20 GB` · `0 of 11 sections · not started`, rows biggest-first, the idle line (D-50 closed), the command | D-59 (only after a refused removal) |
| **Sections** | match | 123 of 137 dummy strings exact and 12 live numbers (the others: `storage:` and a seeded `0 B` row this machine's scan leaves `not measured`, as in round 8); 47 of 47 names; the bar slides | — |
| **Picker** | **match** | all four sections, the bar, the segment (D-47), the consequence line (D-49), the confirmation (D-48), the file zone's name (D-45) | — |
| **History** | match + declared | with data: frame, chart state, chips, columns, pager words, the dry-run and empty states | *Other machines*, declared `pending-wave` (TASK-013) |
| **Report** | diverge (minor) + declared | with data: every band, and the gone, missing, unreadable and empty states | D-56; *Export…*, declared `pending-wave` (TASK-015) |
| **Settings** | match + declared | the held-back sentence with a figure after a rehearsal | the sync note (A-1) |
| **Account** | match + declared | as round 8 | dormant sign-in; the disagreement disclosure (A-1) |
| **Elevation** | match | as round 8 | — |
| **Consent** | match | every word, the status note (D-43 closed) | — |
| **Splash** | match | the skipped frame on a real boot; `--list --json` set in `code` (D-51 closed) | — |

"Diverge" is strict, as in rounds 7–8, and the same exemptions stand: `prototype` for the dummy's static-HTML
styling (underlined rail links, a link-blue `Open the report`, and — newly visible with data — the Report
breadcrumb's 40 px indent, which is the browser's default `ol` padding that the app's preflight resets), the
title-bar badges, the `PROTOTYPE` rail group, `storage: localStorage` and `app 0.1.0-design`; `demo-data` for seeded
rows, paths, runs and notes; `live-number` for sizes, counts, dates, durations and "Six"/"6".

## R9.3 — The three round-8 blockers: fixed and proved on the running app

**D-47 — the deletion-mode segment. Closed.** A row ticked so the bar shows; each option measured in BOTH states
(Recycle Bin selected, then Permanent selected), from computed colours over the painted background, both sides:

| theme | selected option | unselected option | app = dummy |
|---|---|---|---|
| light | **16.74 : 1** (rgb 27 31 22 on white) | **4.87 : 1** (99 103 95 on 233 237 230) | yes, in both states |
| dark | **15.52 : 1** (241 244 238 on 25 28 22) | **6.67 : 1** (146 150 142 on 7 8 5) | yes, in both states |

Sixteen measurements, minimum 4.87 : 1 — the README's own figures. The sweep of the bar and the dialog (R9.9) finds
no contrast failure inside either, in any of 24 states.

**D-48 — a Permanent removal is confirmed first. Closed.** Two rows of 23 ticked, Permanent chosen, *Remove these*
pressed by a real pointer:

- the dialog appears **41.5–45.1 ms** after the pointer is released (keyboard Enter: 33.2 ms; the dummy 8.6–15.0 ms),
  in the same box as `#pick-confirm` (544, 326, 352 × 248 at 1440; 204, 326 at 760) — role `alertdialog`, the `!`
  icon, h2 *"Remove 2 items permanently?"* as its label, *"They do not go to the Recycle Bin. Permanent has no
  undo."* as its description, *Cancel* and *Remove permanently* (`btn btn-danger`), word for word the dummy's;
- **Cancel is focused first**, on both sides; Tab and Shift+Tab cycle between the two buttons and never leave;
- *Cancel* by pointer closes it, focus returns to *Remove these*, and the guard logged **no IPC call**; Enter on
  *Remove these* reopens it with *Cancel* focused; **Escape** closes it, focus returns, still no IPC. Across the whole
  dialog phase (1440 and 760, light and dark, both sides): 0 IPC lines, 0 fallback lines;
- the app makes the page behind `inert` (React Aria's modal) where the dummy relies on `aria-modal="true"`; both
  contain focus — recorded, not a divergence;
- **Remove permanently**, pressed once, last (light, 1440): exactly **one** IPC call, `write_select_file`, **refused
  by the guard**; **no `run_clean`**; the bar's `role="alert"` line carried the refusal verbatim; no run folder was
  created; both chosen folders were still on disk afterwards; 0 fallback lines;
- **Recycle Bin keeps its single press** — judged from the code and never pressed: `Picker.tsx:348`
  `onRemove={() => { if (mode === 'permanent') setConfirming(true); else onRemove(); }}`, as the dummy's
  `page-picker.js:302–308` (Permanent → `#pick-confirm`, otherwise `startRemoval()`).

Pairs: `picker-bar-permanent-*` and `picker-dialog-*`, 1440 and 760, light and dark — the bar and the dialog match
in frame and words; the only difference is the chosen size (`119.3 MB` against the dummy's seeded `902.0 MB`).

**D-49 — what the mode governs. Closed.** The consequence line read as VISIBLE text (the dummy keeps 17's sentence in
a `[hidden]` span, which textContent would include), both sides, all three exact:

| chosen | line |
|---|---|
| only rows of 23 | *"The Recycle Bin can be emptied later. Permanent has no undo."* |
| 23 + a row of 17 | *"… Permanent has no undo. Section 17's rows are deleted outright whichever you choose; this choice covers 18, 19 and 23."* |
| 17's row unticked again | the first line, the sentence gone |

## R9.4 — Round 8's other findings, re-judged

| # | round 8 | round 9 | evidence |
|---|---|---|---|
| D-39 | Home's *"Nothing measured yet."* clipped to 1 px | **closed** | the clip report finds nothing on any of the 56 pairs; before a scan the note is a panel on both sides |
| D-40 | the selection bar pops | **closed** | Picker: `translate` 110 % → 9.9 % over 147 ms (dummy 110 % → 15.8 % over 113 ms); Sections: in 110 % → 6.4 % over 198 ms, out 0 → 104 % over 163 ms; a running transition on both sides |
| D-41 | History never judged with data | **closed** | R9.5 |
| D-42 | Report never judged with data | **closed**, but D-56 | R9.5 |
| D-43 | Consent's status note | **closed** | *first run - what the window sends* on both |
| D-44 | the engine's raw mode | **closed** | Home `… · 1 section · section 19`; History `safe batch`, `section 17`, `sections 1, 2, 3`; Report `safe batch · 11 sections attempted · …` — one vocabulary |
| D-45 | React Aria's `DropZone` name | **closed** | the zone's button is named *Selection file Drop a selection file here, or choose one* — both parts from the catalogue (`picker.fileLabel`, `picker.fileIdle`) |
| D-46 | byte formats | **closed** | hero `54.25 GB`, Run hero `34.20 GB`, rows `652 KB`, `5 KB`, `8 KB`, `117.3 MB` — the dummy's rules |
| D-50 | Run at rest showed the last session | **closed** | `idle - press "Start the safe run"` on both, at rest after a scan |
| D-51 | backticks around `--list --json` | **closed** | set in `code` on both; 0 backticks |
| D-52 | dummy: the protected-categories lead | **closed** | the dummy draws *"And these kinds of thing, wherever they are:"* and the four category sentences, word for word the app's |
| D-53 | dummy: `?empty=1` incomplete | **closed** | hero, ring, drives, ladder, cards and rail foot read the before-a-scan state; the app's pre-scan Home matches it |
| D-54 | dummy: the drawer | **closed** | at 760 both Menu buttons carry `aria-expanded` and `aria-controls="ws-rail"`; Escape closes the drawer and returns `aria-expanded="false"` with focus on Menu, on both |
| R8.8 | held back with a figure (untested) | **tested** | after a safe-batch rehearsal Home reads `HELD BACK RIGHT NOW` `22.0 GB` · *24 caches used in the last 100 days*, and Settings *"Held back right now: 22.0 GB."* — the dummy's sentence, a live number |

## R9.5 — History and Report with data (D-41, D-42), and the two declarations

**The records are real.** First launch: four dry-runs through the app's own controls, each allowed by the guard —
the Sections selection of 1, 2, 3 (`42.6 MB`), Home's *Choose items* on 23 (the Picker's ask, 8 rows), Picker 17's
own *Dry-run* (1 row) and Home's *Dry-run first* (the safe batch, `2.0 GB`, 112 s); the scan before them is recorded
too and correctly left out of History (`isRunRecord`). Second launch: the Picker asked 23, 17, 18 and 19, then a scan
and a safe-batch rehearsal.

**History** (`history`, `history-dry`, `history-other`; 12 pairs), against `history.html` and its chips:

- the lede *"Every run made in this window, and a summary of runs from your other machines if you are signed in."*;
  the figure `0 B` / *freed in the last 0 runs* — the dummy's own *Dry-runs* chip draws the same pair;
- *Freed per run* in its unchanged frame, *the frame does not move with the data*, and — there being no real run —
  *"No real run has finished in this window yet."*, the amendment's words;
- the `Show` chips *All · This machine · Other machines · Dry-runs*, pressed state in the URL (`?filter=`);
- `WHEN · MODE · SECTIONS · WHERE · FREED`; rows `today` over the local stamp, the `dry-run` outline badge, the
  run named in D-44's words, `this machine`, the estimate in ink (`2.0 GB`, `0 B`, `0 B`, `42.6 MB`);
- *Load 20 more* inert with `aria-disabled` and `data-disabled` on both sides, *showing 4 of 4* (a `role="status"`
  region in the app), and *"Twenty at a time with a cursor, never the whole table – the same budget the engine
  itself keeps."*; before any run, `history.html?empty=1`'s words exactly (the pre-scan pairs).

The word check leaves only the dummy's seeded runs (their dates, `real run`, `profile: dev` …) and `storage:`. One
capture showed a hover border on *Other machines*: the physical pointer sat over the window; every later pass parks a
synthetic pointer in the rail's gutter, and the re-capture is clean.

**Report** (`report-dry` — the newest run, the safe-batch dry-run — `report-json`, `report-gone`, `report-missing`,
`report-unreadable`; 20 pairs) against `report.html?dry=1`, `?gone=1` and `?unreadable=missing` / `=1`:

- crumb *History / 2026-09-14 00:31* inside `nav aria-label="Breadcrumb"`; title *"A dry-run would reclaim
  2.0 GB"*; the meta line *"safe batch · 11 sections attempted · 11 ran · 0 skipped · nothing refused · 1 minute,
  48 seconds"* — the dummy's pattern (it draws only a 17-second run; the duration over a minute is `live-number`);
- *Show the JSON* opens a read-only panel under the header, named by its file, holding the file exactly as the
  engine wrote it (PowerShell's own indentation; the dummy's JSON is `demo-data`), its state in the URL
  (`?open=json`);
- *What each section would free*, `0 B` for a step that ran and found nothing; *Disk, before and after* (see D-56);
  the table `# · SECTION · STATUS · WOULD FREE · NOTE`, `—` where the engine wrote no note (this run wrote none);
  *Where this file lives, and what else reads it* with the run's own file;
- gone (`?view=` a run id not in History): the History crumb and *"That run is no longer in this window's
  history."*, exact;
- **missing** and **unreadable** — produced through the product's own chain (store → loader → IPC → the Rust
  side's confinement → screen) without writing anything under the app's runs folder: two History records were
  planted in the dev origin's storage for the capture and removed afterwards (the saved string restored
  byte-identical). *Missing* names a real run folder that holds no report (this round's own boot catalogue read);
  `list_run_files` returns `[]` and the screen reads *"No report file was found for this run, so only its summary
  is shown."* *Unreadable* names a run id the Rust side refuses; the screen reads *"This run's report file could
  not be read, so only its summary is shown."* over the Rust reason (*that is not a run id*; the dummy shows an OS
  error there — `live-number` in kind). In both: the History record's figure as the title, the meta line held
  empty, *Show the JSON* inert (`aria-disabled`) and described by that note — exact, both sides.

**The two declarations** are drawn on screen and both are named, with their class, in `desktop/design/README.md`'s
newest amendment (*"2026-09-13 (latest): History and Report with data"*, *Declared rather than amended*):

| declaration | on screen | README | task |
|---|---|---|---|
| History *Other machines* | *"No runs from other machines"* over *"Run summaries from your other machines are not synced in this build yet. The filter is named here rather than hidden, so what is missing is a stated gap rather than something you have to discover."* | `pending-wave`, both sentences quoted exactly | TASK-013, open |
| Report *Export…* | disabled, with *"Export is not built into this window yet. The report file named below is the complete record of this run."* | `pending-wave`, the note's opening words quoted | TASK-015, open |

## R9.6 — The new blocker: D-55

**D-55 · app · blocking — Home presents a Picker ask as the machine's measurement.** With no scan in the window's
session (the window restarted; History kept), Home correctly reads *not measured*, as the dummy's `?empty=1` does.
After the Picker asks the engine about a section — its own *Dry-run*, or *Choose items* on a Home card — Home reads:

| band | Home after the asks (app) | the dummy's before-a-scan Home |
|---|---|---|
| hero | `0 B` · *across 0 targets in 1 section · re-scan* | `not measured` · *Nothing has been measured yet. A scan reads sizes and deletes nothing.* |
| hero buttons | *Scan again* · *Dry-run first* · *Scan first* (disabled) | *Scan* · *Dry-run first* · *Scan first* (disabled) |
| rail foot | `0 B` · *across 1 section* | `-` · *across 0 sections* |
| map, drives, ladder, held back | *not measured* | *not measured* |

The figure is section 19's ask (no candidates); any other section's ask would put its own estimate there. The
screen contradicts itself — `0 B` over *"Nothing measured yet."* — and the headline states a measurement nobody
made, on a machine whose scan measured `54.25 GB`. **Cause:** `lib/reclaim.ts:58–59` falls back, when nothing is
measured, to the last run's summary (`estimated_bytes`, else `freed_bytes`), and a Picker ask is a run
(`--only N --dry-run`); `Home.tsx:375` words the scan button from `summary`, not from `measured`; the rail foot uses
the same derivation. **The dummy draws no post-run hero at all**, so this state is undeclared as well as wrong.
**Fix (app):** take the fallback only from a run that measured what the hero claims (or show `not measured` until a
scan), and key the button's word on `measured`; if a post-run hero is wanted, the dummy draws it first (§10a).
**Blocking:** the same class as round 4's D-17 — the product's headline figure from a different question.
Evidence: `pairs\home-empty-*-after-ask-*`, the word check's `home-empty-after-ask`, `logs\home-after-ask.txt`.

## R9.7 — New findings, not blocking — each with its owner

| # | owner | finding | why it does not block |
|---|---|---|---|
| **D-56** | app | Report's *Disk, before and after* ticks a DRY-RUN: C: reads `✓ 8.3 GB free` over `was 8.3 GB` because free space rose 6.9 MB from other activity during the 112 s rehearsal. `DiskBeforeAfter.tsx:32` ticks any drive that gained bytes; the dummy never ticks a dry-run (`page-report.js`: `gained = !DRY && …`, *"A dry-run changes no drive at all"*), and the component's own comment says a dry-run "gets the figure without a claim". One condition: pass `dryRun` and require `!dryRun` | the heading, the `dry-run` badges and the two equal figures say it is a rehearsal; nothing follows from the tick |
| **D-57** | app | Home's last-runs line does not age before a scan: *8 minutes ago · 1 section · section 19* stayed unchanged for 125 s with Home open. `LastRuns.tsx:132` formats at render and Home's only clock (`Home.tsx:173–178`) ticks once a scan has measured | a live number that goes stale on an idle screen; any navigation refreshes it |
| **D-58** | dummy, then app | Home's target table has no treatment for a long path: the Path cell (`mono t-2xs`, no maximum, no ellipsis — the same rule on both sides) grows to the longest unbroken path, 128 characters on this machine, and at 1440 Size and Idle (days) sit 307 px beyond the band's own scroller. The same path set into the dummy's row (in the page only) pushes its Size column out too (217 px): the dummy's short seeded paths hide it. The Picker's table already ellipsizes such paths at 608 px, on both sides | the table is collapsed by default, the map above carries every size, and every value is reachable in the band's scroller |
| **D-59** | app | A refused `write_select_file` is recorded as a stopped run. `Picker.tsx:207` calls `finishRun(null, true)` for a refusal that happened before anything started (the comment above it says so), so Run then reads *STOPPED · 11 of 11 sections · not started · "The run stopped before it finished. Whatever it had already reclaimed is in the log below…"* over the previous rehearsal's rows, and Home's scan button reverts to *Scan* beside *measured 37 minutes ago … · re-scan* | reached only when the write fails (a path the Rust side refuses, a full disk); the true reason is shown at the control, as `role="alert"` |

Observations — not divergences:

- **O-1 · design · hit areas under 44 px, shared.** The bar's radios are 28 px tall, *Clear* and *Remove these*
  30 px, the dialog's buttons 42 px — identical in the dummy, which owns the sizes. Row switches keep 44 × 44
  through `::before` (Sections 19 of 19, Elevation 5 of 5, Home 39–44 where rows share an edge).
- **O-2 · Rust side · a read that writes.** `run_dir` (`engine.rs:137`) creates the run folder when asked about a
  run id that has none, so `list_run_files` / `read_run_report` on a History record whose folder was deleted recreate
  an empty folder. Hygiene only.
- **O-3 · app · the Export note steps aside when there is no file.** In the missing and unreadable states the note
  (*"…The report file named below…"*) is withdrawn by design and the disabled *Export…* is described by the file
  note instead; the declaration's words are visible only while a file exists.
- **O-4 · owner · decision 6 on this machine.** After the rehearsal, Home offers *Reclaim 34.2 GB* (the scan's safe
  run) while the engine's own dry-run of the same arguments estimated `2.0 GB`: `22.0 GB` of the gap is the held-back
  figure shown beside it, and browsers (`8.1 GB` → `245 MB`) and temp (`2.8 GB` → `784 MB`) account for most of the
  rest. The dummy draws the same shape, so parity holds; the owner may want the button to carry the rehearsal's
  estimate once one exists.
- **O-5 · dummy · demo-data words.** History's seeded `profile: dev` / `profile: minimal` rows describe runs this
  window never starts (`lib/run-mode.ts`), and Home's sparkline titles a seeded dry-run *freed 9.7 GB*; the app
  prints `0 B` freed for a dry-run.

## R9.8 — A-2, re-stated

A-2's row for **`page-picker.js:289` is retired**: `page-picker.js` raises no toast at all now (0 `toast(` calls).
*Remove these* goes to `run.html` through `startRemoval()` in Recycle Bin mode (`:308`) and opens `#pick-confirm` in
Permanent mode (`:302`); the app answers with the D-48 dialog, `write_select_file` and its Run screen. Two more A-2
rows are retired for the same reason: **`page-history.js:154`** (the pager's toast, removed by the latest amendment;
0 calls in the file) and **`page-report.js:111`** (*Show the JSON* is a panel now). Every other A-2 row stands with
its class, at its current line: `wire.js:88` · `wire.js:611, 613` · `wire.js:618` · `wire.js:633` · `wire.js:665`
and `app.js:251` · `page-run.js:113, 143` · `page-sections.js:242, 250, 258` · `page-elevation.js:178` ·
`page-report.js:294` (the *Export…* toast; the app declares Export `pending-wave`, TASK-015) · `page-consent.js:37` ·
`page-splash.js:49, 64` · `page-account.js:29, 60, 103` · `playground.js:152` — 21 calls, all accounted for.

## R9.9 — The word check and the sweeps, measured

**Words** (56 pairs). No dummy string is missing from the app outside `demo-data`, `live-number`, `prototype` and
the two declarations, except D-55's state words (*"Nothing has been measured yet. A scan reads sizes and deletes
nothing."* and *Scan* absent; *across 0 targets in 1 section*, *re-scan* and *Scan again* app-only). Accessible names:
Sections 47 of 47; the app-only names are additions (*How to delete*, *Selection file*, the sliders' labels), and the
dummy-only names belong to seeded rows or to elements the app draws only in another state (Elevation's deep-gate
switch, the JSON panel while closed, History's chart before a real run). The clip report is empty on every pair.

**Sweeps.** Ten screens × two widths × two themes, both sides: horizontal overflow **0 px**, contrast failures **0**,
focusable but invisible **0**, no error overlay; small text only the map's tile labels (10.5 px) and the ring's
*OF ALL DISKS* (9.5 px), the dummy's own. **The bar with rows ticked and the dialog open** (24 states: light and dark,
1440 and 760, Recycle Bin / Permanent / dialog, both sides): contrast failures **0**, overflow 0. **Focus:** 15 of 15
Tab stops on Home, Picker and Settings change visibly on both sides (`:focus-visible`, 2 px outline, 2 px offset);
both dialog buttons change visibly when focused, on both sides. **Hit areas:** R9.7 O-1; the map is one tab stop on
both sides. **The 100 ms floor** (first mutation on the control after a real pointer press): row switch 20.8 ms,
Sections chip 43.9 ms, Picker chip 31.0 ms, the D-48 dialog 41.9 ms after release (dummy 3.1 / 14.3 / 2.5 / 15.0);
*Clear* changes nothing on itself — the bar leaves, on both sides. The focus-and-timing driver ran with the app in
dark (the dark sweep had left it there) and the dummy in light; D-47's light figures come from R9.3's driver.
**Files under 500 lines:** every stylesheet (largest `02-colour.css`, 386) and every `.ts`/`.tsx`/`.rs` file
(largest `Run.tsx`, 493).

## R9.10 — What could not be tested, and why

| item | why |
|---|---|
| any real removal, the safe run, the elevated run, Recycle Bin's *Remove these*, the schedule switch, sign-in | forbidden by the dispatch; D-48's Recycle Bin press is judged from the code |
| History and Report for a REAL run (`real run` badge, green Freed, *Freed per run* with points, *freed in the last run*, *Freed N*, a ticked drive, *N refused / failed*) | only dry-runs could be made; the dummy's seeded runs are the only rendering |
| *"No dry-runs yet"* (the Dry-runs chip with none) | needs a real run and no dry-run |
| History's second page | nine run records were made; a second page needs twenty-one |
| *Other machines* with rows; *Export…* | not built (TASK-013, TASK-015) |
| a genuinely unreadable report file | would need a file written into the app's runs folder, outside this round's scope; the state was produced through a run id the Rust side refuses (R9.5) |

## R9.11 — Reproducing · side effects · incidents · cleanup

- **Drivers:** `gate4-evidence\round9\drivers\` — round 8's tools copied with their paths moved, the guard with its
  one allowance and 35 offline cases, and new drivers for the Splash boot, Run at rest, the real records, Report's
  states, the removal path (D-47/48/49), the asks, Home after an ask and the bar/dialog sweep; each fed to
  `node --input-type=module` on stdin, `tools\cdp.mjs` unchanged. `logs\`, `words\`, `measure\`, `plants\`,
  `pairs\` beside them. No tool of an earlier round was edited; nothing was added under `tools\`.
- **Side effects:** 21 run folders in the app's local `runs\` — 10 boot catalogue reads (two per boot, five boots),
  2 scans and 9 dry-runs, each matched to an allowed guard call within 3 s, none inside a guard gap. The two planted
  History records removed; at the end the dev origin's storage restored to its as-found keys (two Amplitude keys,
  exact values, unchanged 15 s later), so the tester's storage leaves no records. `desktop/dist` rebuilt once, after
  every runtime proof (an ignored path).
- **Incidents:** the two connection drops (above). My own instrument errors, each corrected and kept: the removal
  proof's on-disk check first parsed the switch labels with their pre-click `aria-checked` prefix and tested
  non-paths — re-checked from the saved labels, both folders present; the re-used scan driver looked for a button
  reading *Scan* and pressed nothing (the button read *Scan again* — D-55's symptom), so the scan was pressed by its
  own label; a staleness probe's first selector matched nothing and was re-run; one driver failed to parse as a
  shell heredoc and was written as a file; the pointer-hover capture above.
- **Cleanup, verified:** the `yarn tauri dev` tree (yarn, the Tauri CLI, cargo, `windowsweep-desktop.exe` and its
  WebView2, Vite) killed by its root PID; the guard exited when its socket closed, on both launches; my Chrome killed
  by PID after its profile was read back; nothing listening on 5974, 9333 or 9287; the owner's Chrome and other
  sessions' processes untouched. **Build gate on the fresh `dist/`:** `yarn build` exit 0, no warning; source maps 0,
  `sourceMappingURL` 0, the dev-engine marker 0 (1 in `src`), `run_clean` and *Remove permanently* found (the grep
  reads the bundle); no DEV test-auth hook in this project (0 in `src`, 0 in `dist`); the tree clean after the build.

## R9.12 — Can GATE 4 close? Can `desktop-v1.2.0` publish?

**No.** Round 8's three blockers are fixed and proved on the running app — D-47 by sixteen contrast measurements
at or above 4.87 : 1, D-48 by a dialog that opens with *Cancel* focused, closes on Cancel and Escape with no IPC
call and hands focus back, and whose *Remove permanently* reached `write_select_file` and nothing further (the guard
refused it), D-49 by three exact lines — and every other round-8 finding is closed. History and Report now match the
dummy with real data, with their two gaps declared `pending-wave` in the README's newest amendment. **One blocking
divergence remains: D-55** — after a Picker ask, Home's headline figure is that ask's summary, not a measurement.
D-56, D-57, D-58 and D-59 are filed with owners and do not block. GATE 4 does not close, and `desktop-v1.2.0` should
not publish on this round. What closes it: D-55's fix, re-proved on a restarted window — Home, then a Picker ask,
then Home reading *not measured* (or a post-ask state the dummy draws first).

---

# ROUND 8 — 2026-09-13, the current source (HEAD `7e78de7`, desktop 1.2.0) · NOT CLEAN — D-23, D-24 and D-25 are fixed on the running app; three new blockers on the Picker's removal path

**Build under test:** `main` at `7e78de7` (pushed; `git status --short -- desktop` empty at the start and, at the end,
only this report; HEAD moved to `809bdd6` while the round ran — another session's `docs/story` commit, no file under
`desktop/` — so the tree under test is `7e78de7`'s),
`yarn tauri dev` from `desktop/` — Vite 8.2.2 on 5974, Rust `dev` profile (already built: no `os error 3`),
`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333 --host-resolver-rules="MAP <the four analytics
hosts> ~NOTFOUND"`, both flags read back from the WebView2 process's own command line. `app_version` over the real
IPC answered **1.2.0**; the Home scan's own report says `credits.tool_version 1.2.0`, `meta.mode scan`,
`meta.launcher desktop`, its log opens `windowsweep v1.2.0`, and the dev-fallback marker is absent; every dry-run
document says `version 1.2.0`. WebView2 Edg/152.0.4191.66. **Dummy:** Chrome for Testing 151.0.7922.77, headless,
profile `ahsan-automation-windowsweep-r8` on port 9287, asserted from the OS process table AND the listener table
before the first navigation (R8.9: 9241 was taken). **Treatment:** lime, light and dark. **Widths:** 1440 and 760.
**Account:** none — the local Windows user, unelevated, signed out (sign-in is not configured in this build); the
product has no admin role, so no flow could run as an admin. **First run:** the dev origin held no `windowsweep:*`
key when the round began, so D-24 was judged on a genuine first run.

**Pairs:** 89 complete pairs, 178 captures (31 MB) in `gate4-evidence\round8\pairs\` — the eleven screens in both
themes at both widths, plus Picker per section, not-asked, selection-file done and section 17 with developer mode off,
Home / Picker / Settings before a scan, Run at rest after a re-scan, Splash's skipped frame, the two D-24/D-25 states
and Elevation's measured note. The eight `splash-<w>-<mode>-skipped-*` from driver 17 show a development-only stuck
frame (R8.8) and are superseded by `splash-skipped-*`.

## R8.1 — How the round was made safe, and how each instrument was proved first

| instrument | what it did | proved by |
|---|---|---|
| **IPC guard, at the transport** | CDP `Fetch` on `http://ipc.localhost/*`. 🔴 The engine's mode is **last-wins** (`windowsweep.ps1` `Read-Arguments`: `--scan --only 12` is a REAL run of 12), so the guard never asks "does `--scan` appear" — it re-parses the argv the way the engine does (value flags consume their value, `--flag=value` split, the last mode flag decides) and judges the mode. Allowed: `list`, `scan`, and a dry-run of `only` whose ids are all in {17, 18, 19, 23}; the read-only commands; updater `check`. Refused: every other run, `--elevate`, the task, alias and uninstall modes, `--select`/`--select-file`, `--i-understand-deep`, `--hiberfil`, `--permanent`, `--purge-all`, `write_select_file`, both `oauth_*`, dialog / opener / process / shell, every other updater command, unknown commands and unreadable bodies. Preflights continued; a refusal is a **403** with `Tauri-Response: error`, a JSON body and CORS headers, so Tauri's `ipc-protocol.js` (2.11.5) takes its error callback and never its postMessage fallback | **offline**, the parser sliced from the guard file itself: 25 of 25 argv cases, including `--scan --only 12 --yes`; a first-wins plant in a copy turned exactly the three last-wins cases red. **Live**: `app_version` → `1.2.0`; eight plants harmless even if the guard failed (unknown command, `--list --permanent`, `write_select_file`, non-existent dialog / opener / process / updater / oauth commands) all refused; a later `list_drives` still reached the guard. **Totals:** 243 calls, 216 allowed, 27 refused — every refusal a plant or the Splash policy (R8.7). **The app never attempted a forbidden call.** No `--elevate` was ever sent |
| **four guard versions** | v1 → v2 answered Amplitude's CORS preflight so its POST could be read; v3 gunzips an Amplitude upload of 2 KB or more (`MIN_GZIP_UPLOAD_BODY_SIZE_BYTES`); v4 lets a policy file refuse `plugin:updater|check` for the Splash capture | the IPC code is hash-identical v1–v3 and v4 changed only the updater line; the offline check passes 25/25 sliced from each; none of the 17 run folders was created inside the three ~7 s swap gaps |
| **the postMessage fallback** | the console was recorded for "IPC custom protocol failed" | **2 lines, both at 10:51:24.2Z, caused by this round:** my reload aborted Home's in-flight mount reads (`schedule_status`, `list_drives` — already guarded and allowed) and the old document retried two of them over postMessage. The flag is per document: the next document's calls all reached the guard, and the rest of the session added **0** (the second reload waited for a quiet guard log) |
| **analytics, no destination reached** | the four hosts resolve to `~NOTFOUND` in the WebView2, and the guard failed every other analytics request, answered the tags with an empty local script, and read Amplitude's POST and answered it locally | the first boot was observed from its first request (guard up 10:45:44.570Z, first IPC 10:45:50.091Z); `logs\analytics-net.jsonl` holds every attempt |
| **axis probe (§10)** | defaults parsed from the dummy's own `app.js` `AXES`: **declared 10 · written 10 · absent 0 · different 0**; the `<html>` set identical at 1440 and 760 and equal to the dummy's live `<html>` | parse arm (density mutated in a copy; `app.js` hash unchanged) → `density: dummy=spacious app=comfortable`; live arm → `radius (data-radius) declared but not written`; restored → clean |
| **word check** | round 7's method unchanged, plus one report: text visible (≥ 95%) on one side and clipped (< 50%) on the other — `checkVisibility()` cannot see an ancestor's `overflow` | three plants in copies (R8.7) |
| **sweeps, hit areas, RW-122** | round 1's probe on both sides; round 7's `10-measure` copied unchanged; a computed-style A/B in the running page | a low-contrast, an 11 px and a 2000 px plant each found and gone when removed; `::before` plant 44 → 18; RW-122 plant moved values, restore exact |

## R8.2 — The verdict table

| surface | 1440 · 760 · light · dark | what matches | what diverges |
|---|---|---|---|
| **Home** | diverge | all twelve bands; D-24, D-25, D-26, D-32, D-33, D-36 closed; the held-back count line; `Reclaim` carries the safe run (decision 6); the map is ONE tab stop | D-39 (before a scan), D-44, D-46, D-52; dummy gap D-53 |
| **Run** | diverge (minor) | `READY TO RUN` · `0 of 11 sections · not started`; rows biggest-first then catalogue order; Cancel disabled at rest; `Log` + its `never animates …` line (D-30); the command | D-50, D-46 |
| **Sections** | **match** | 121 of 123 dummy strings exact, 12 live numbers, 47 of 47 names; D-34 closed | — |
| **Picker** | diverge | not-asked, populated, file-done and developer-off states all match in frame and words; D-23 and D-37 closed | D-40, D-45, D-46; **blockers D-47, D-48, D-49** |
| **History** | diverge (frame) | h1, filter words, status note | **D-41**, D-44 |
| **Report** | diverge (frame) | status note | **D-42**, D-44 |
| **Settings** | match + declared | D-26 and D-35's tablist closed; no `Off` beside the schedule switch | the sync note, declared `pending-wave` (A-1) |
| **Account** | match + declared | D-38 closed in words and frame | dormant sign-in (declared since round 1); the disagreement disclosure, `pending-wave` (A-1) |
| **Elevation** | **match** | D-27, D-28, D-29 closed | — |
| **Consent** | diverge (minor) | every word of the notice | D-43 |
| **Splash** | diverge (minor) | the skipped frame word for word, on a real boot | D-51 |

"Diverge" is strict, as in round 7; the same standing exemptions apply (`prototype`: the dummy's anchor styling,
title-bar badges, `PROTOTYPE` rail group, `storage: localStorage`, `app 0.1.0-design` per A-1; `demo-data`: seeded
rows, paths and runs; `live-number`: sizes, counts, dates). A-1 and A-2 declarations were checked for class and
reason; one does not cover what it is used for (D-48).

## R8.3 — The three round-7 blockers: fixed on the running app

**D-23 · the Picker receives candidates — FIXED, by all three paths, each through the app's own control** (the
control showed `data-state="pending"` + `aria-busy` while it asked):

| path | the guarded call | result |
|---|---|---|
| A · Home "Choose items" on 23, never asked | `--only 23 --yes --dry-run --developer --days 100 --temp-days 3 --large-file-mb 100` | Picker 23 after 4 s: **8 rows**, `0 of 8 chosen` |
| B · the Picker's own Dry-run, section 18 | `--only 18 …` | 6 s: *"Nothing to choose here"* / *"This section found no candidates on this machine. That is the good outcome, not an error."* — the asked-and-empty state, distinct from never-asked |
| C · round 7's failing path: Sections → 17 + 19 → Dry-run | `--only 17,19 …` | Run `Finished · 2 of 2 sections`; Picker 17 **1 row**, Picker 19 the asked-and-empty state |

An independent engine call with each argv, compared path by path with the rows: **23: 8 = 8 · 18: 0 = 0 · 17: 1 = 1
· 19: 0 = 0, identical sets.** Home's cards now read `1 item waiting` (17), `8 items waiting` (23); the rail badge 4.

**D-24 · first-run developer mode — FIXED.** On the genuinely fresh origin, after the notice's own Continue: the
switch `aria-checked="true"`, *"On – keeping anything used in the last 100 days"*, Run `windowsweep --json --all
--yes --developer --days 100 --temp-days 3 --large-file-mb 100`, Elevation's command `--developer`, Settings' switch
on — equal to the dummy's fresh `db.js` state. The stored key stays absent until the switch is touched.

**D-25 · the OFF caption — FIXED, dummy first.** Both sides, each turned OFF through its own switch: *"Off – every
cache is offered in full"* over *"Nothing is being held back – every cache is offered in full."* Restored on both.

## R8.4 — The three new blockers — all on the removal path D-23 just opened

`Remove these` was unreachable in every build before this one, so nothing on its bar has ever been used or judged
with real rows. **None of the three below was pressed** (the dispatch forbids it, rightly): D-47 is measured, D-48
and D-49 are read from the app, the engine and the dummy, and each says so.

**D-47 · the deletion-mode segment is unreadable in light theme · shared (dummy first, then app) · BLOCKING.**
Measured with a row ticked, identical on both sides:

| theme | `Recycle Bin` (selected by default) | `Permanent` | need (13 px) |
|---|---|---|---|
| light | **1.09 : 1** — rgb(243,246,239) on rgb(255,255,255) | **2.24 : 1** | 4.5 : 1 |
| dark | 15.52 : 1 | 6.67 : 1 | 4.5 : 1 |

Cause: `.selbar` swaps the inks to the bleed set for its dark surface; `.seg-opt:has(input:checked)` paints
`--c-panel` (white in light) and keeps that light ink. `.band-bleed .seg` resets the inks; nothing resets them for
`.selbar .seg` (`shared.css:956` / `components.css:298`, carried to `08-forms.css:146` and `06-disclosure.css:104`).
Clip: `gate4-evidence\round8\measure\seg-light-app-x3.png`. The sweeps could not see it — the bar is hidden
unless a row is chosen. **Fix:** add `.selbar .seg` to the ink reset, dummy first.

**D-48 · a Permanent removal asks no confirmation · owner decision, BLOCKING until made.** The app has no
confirmation anywhere in `src` (`onRemove` → `write_select_file` → `--only … --select-file … --permanent`), and the
engine's final question for 18, 19 and 23 is `Confirm-Ui -NoAutoYes -ScriptedOk` (`lib/ui.ps1:161`), which a
`--select-file` answers; `--permanent` adds no question of its own. So pressing it deletes permanently at once. The
dummy says both things: its Picker note — *"A scripted selection (--select or --select-file) counts as a person
choosing, and only then does the run go ahead unattended"* — describes the app; its stand-in toast — *"This would
ask you to confirm N permanent deletions first"* — promises a confirmation nothing provides. A-2 declares that
toast `prototype`, a class for mechanics the dummy cannot perform; it does not cover a confirmation the product lacks.
**The owner decides; the dummy is amended first either way** (a confirmation built, or the toast's sentence replaced).

**D-49 · "Recycle Bin" is shown for rows that are deleted outright · shared (dummy first) · BLOCKING (D-25's bar).**
Section 17's artefacts go through `Remove-PathSafe` whichever mode is set (`modules/projects.ps1:157`;
`PickerSelbar.tsx` records it in a comment). With 17's rows chosen, the bar still reads `Recycle Bin` (selected) and
*"The Recycle Bin can be emptied later. Permanent has no undo."*; the dummy's toast says *"Sent N items to the Recycle
Bin. Recoverable until you empty it."* That understates deletion — round 7's reason for D-25. Mitigation, stated:
17's own lede says the artefacts rebuild. **Fix:** the bar says which sections the choice governs when 17 is in it.

## R8.5 — Every round-7 finding, re-judged

| id | was | now | evidence |
|---|---|---|---|
| D-26 | Settings' developer row carried Home's lines | **closed** | *"Keeps package, build and test-runner caches …"* + *"Held back right now: not measured."* / OFF sentence, both sides |
| D-27 | Elevation command lacked the thresholds (dummy) | **closed** | `--only 12,13,14 --elevate --yes --developer --days 100 --temp-days 3 --large-file-mb 100`, both sides |
| D-28 | Measure answered by a toast (dummy) | **closed** | both: `note note-info`, `role="status"`, beside the button, no toast; the app's press was one guarded `--scan`, no `--elevate`; `consent.exe` in 0 of 45 half-second samples |
| D-29 | Elevation eyebrow, `<strong>`, `<code>`, status bar | **closed** | `Sections 12–16 and 20`; *never elevates itself*; `--reports-dir`, `--logs-dir` and the runs path in `code` on both; command in the status bar on both |
| D-30 | Run log heading and note | **closed** | `Log` + *"never animates – this is the surface you watch while something irreversible happens"*; no `expected` suffix at rest |
| D-31 | "click dummy" in shipped copy | **closed** | no catalogue value contains "dummy"; `pending.body` rewritten |
| D-32 | colon, separator, schedule name | **closed** | `C:  … free of …  ·  … reclaimable`, `… reclaimable on C:`, `Weekly scheduled run` — formats equal |
| D-33 | plurals, trailing period | **closed** | `_one`/`_other` for `lastWhen` and `sparkAria`; no trailing period |
| D-34 | Sections eyebrow | **closed** | no eyebrow on either side |
| D-35 | sync note; tablist name | **closed / declared** | `Settings sections` on both; the sync note `pending-wave` (A-1, TASK-013) |
| D-36 | Include everything no-op; idle readout | **closed (dummy)** | disabled with nothing excluded on both; `100 days` on both |
| D-37 | dummy's 18/19 labels swapped | **closed** | chips `18 · partial downloads`, `19 · large files`; headers from the catalogue on both |
| D-38 | Account frame | **closed** | eyebrow `Optional`, *never gated*, card + *What is stored, exactly* + Sync band on both |
| round-7 list | rail Choose badge · four status notes · Run rows order · schedule `Off` · Admin icon · held-back line · four toasts · `app 0.1.0-design` | **closed / declared** | badge `4` both; notes equal on History, Report, Picker, Account; biggest-first; no `Off` in Settings; the `backend` path on both, not Reports'; *"24 caches used in the last 100 days"*; the dummy's Include everything `done` state and Home schedule `role="status"` line, no new toast; `prototype` (A-1) |
| observations | Reclaim / Run hero figure; the dummy's `holds back -.` | resolved | `Reclaim 33.9 GB` and the Run hero carry the safe run, the Home hero the total (decision 6); the dummy now prints *"Held back right now: 17.3 GB."* |

## R8.6 — New findings, not blocking — each with its owner

| id | owner | what | why not blocking |
|---|---|---|---|
| **D-39** | app | Home before any scan: the map's *"Nothing measured yet."* note is `position:absolute` inside a 2 px `.tm-frame` with `overflow:hidden` — **1 px of 48 visible**; `index.html?empty=1` shows it as a panel. The pre-split CSS was identical; it has hidden since `a75ac9b` because every round captured Home after a scan and `checkVisibility()` passes clipped text | the hero says the same thing on the same screen |
| **D-40** | app | the selection bar (Picker, Sections) pops instead of sliding. Tailwind v4's preflight `[hidden]:where(…){display:none !important}` sits in `@layer base`, and an important declaration in a layer beats the unlayered `.selbar[hidden]{display:flex !important}`. Dummy: `translate` 110% → 15.8% over 106 ms with a running transition; app: `0px` in the first frame, 0 animations | motion only |
| **D-41** | app, or the owner's decision → dummy | **History has never been judged with data** (rounds 1–2 closed it empty as `demo-data`). Absent: the lede, *freed in the last N runs*, the *Freed per run* chart, the `Show` band and *Other machines*, `Where`/`Freed`/open columns, relative dates, *Load 20 more* and its sentence. App-only: `Records`, `Reclaimed`, `Took`, the signed-out note | true records, no false statement |
| **D-42** | app | **Report, likewise never judged with data.** Absent: breadcrumb, *Show the JSON*, *Export…*, *What each section freed*, *Disk, before and after*, the `Note` column and *Where this file lives*. The engine writes each step's `note` and `disk.before/after`; the app shows the step `title` and drops both. App-only: `The last run`, `Key`, `Reclaimed`, `What it touches`, `The same report, on disk at` | true, but less than the file says |
| **D-43** | app | Consent's status bar lacks *"first run - what the window sends"* | one note |
| **D-44** | app | the raw engine mode (`only`, `scan`) in History's Mode column, Home's last-runs line and Report's meta, where the dummy uses `safe batch`, `profile: dev`, `sections 1, 2, 3` — `History.tsx`'s header promises that vocabulary; its code prints `summary.mode` | words |
| **D-45** | app | the file zone's hidden drop button is named by react-aria's default: `DropZone Drop a selection file here, or choose one` — a component name from RAC's own string table, outside the catalogue and not in the dummy | the visible label is right |
| **D-46** | app (low) | one `formatBytes` (one decimal) against the dummy's `fmt.bytes` (whole KB: `293 KB`, `652 KB`) and hero `bytesParts` (two decimals: `29.73 GB`); the word check masks digits, so only this pass sees it | format of live numbers |
| **D-50** | app | Run at rest shows the last engine session (the Home scan's summary with this machine's paths and drive table) under `READY TO RUN · not started`; the dummy shows `idle - press "Start the safe run"` | round 7 saw it only as a privacy note |
| **D-51** | app | Splash's disclosure prints literal backticks around `--list --json`; the dummy sets it in `code` (`splash.detailsWhat` has no markup) | one phrase |
| **D-52** | dummy | app-first copy on Home: `home.protectedCategoriesLead` (*"And these kinds of thing, wherever they are:"*) over the engine's own category sentences — the dummy draws neither (§10a: the dummy absorbs it) | the words are true |
| **D-53** | dummy | `index.html?empty=1` empties only the map and last-runs bands; the hero, ring, drives, ladder, cards and rail foot stay seeded, so the app's before-a-scan words (`not measured`, `Scan first`, `nothing offered yet`) have no approved counterpart | a gap in the specification |
| **D-54** | dummy | the dummy's drawer ignores Escape and its Menu button has no `aria-expanded`/`aria-controls`; the app has all three | the app is right |

Carried: two counts under one noun (the map labels 244 drawn targets, the hero 673); a sentence opening with a
numeral (`6 sections need Windows …`); tile labels at 10.5 px and the ring caption at 9.5 px on both sides (the
dummy's own typography).

## R8.7 — Scope items 2–7, measured

**Picker and its file (item 2).** Not-asked (sections 17 and 23), populated (17, 18, 19, 23), file-done, and 17 with
developer mode off — every state equal in frame and words, pair by pair, both themes, both widths. The file field,
driven through each side's own `<input type=file>` (`DOM.setFileInputFiles`; `plugin:dialog` stayed refused) and by
a synthesized drop: a `.csv` → *"r8-selection.csv is not a .txt or .list file"*; 300,003 bytes → *"That file is
293.0 KB - the limit is 256 KB"*, at the zone's `role="status"` line, nothing ticked; a 4-line file (three real
section-23 candidates — one upper-cased, one space-padded — and one line that matches nothing, plus a comment and a
blank) → *"4 paths, 3 matched"*, **exactly those three rows ticked**, *"No candidate here matches <the line>"* named
once, the bar `3 chosen · across section 23`; the drop path shows *"Release to read it"* first, then the same result;
Clear leaves 0 ticked and the bar hidden. The `?` tooltip's four lines are identical on hover and gone on leave.

**Menu (item 3).** 1440: hidden on both. 760: shown; opens the rail (left −216 → 0, `data-drawer="open"`); **Escape
closes it**; a rail link navigates to History **and closes it**. The dummy's drawer opens and its links navigate;
it ignores Escape (D-54).

**Analytics (item 4).** On a boot whose tags were blocked, `window.clarity` is a function with its queue (empty),
and at the moment each tag was requested the stub already existed. Reloaded with all four destinations **held**,
then released one at a time with a navigation between each: **every destination received the same six views in
order** — `/splash`, `/consent`, `/history`, `/report`, `/account`, `/settings` — **each once**; the first
(`/splash`, tracked before any destination registered) reached each once; a later registration re-sent nothing to an
earlier one; Amplitude's insert ids unique. Plants in copies (a replay-to-every-destination duplicate; the four early
views removed, the pre-fix shape) both turn the comparison red. The launch's own `/` produces no view — the boot's
redirect supersedes it before the router resolves — an observation, not a defect. The first run of this proof read
Amplitude's gzipped batch as empty (my instrument; v3) and was re-run clean.

**RW-122 (item 5).** 14 stylesheets, the largest 386 lines. `tokens/` joined equals the old `tokens.css`; `shell/`
joined equals the old `shell.css` plus one rule added in the same commit (`.t-base`, the D-38 fix) — so "byte-identical
when joined" is off by that one intended rule. Compiled with the project's own Tailwind, split minus `.t-base` equals
pre-split, 94,547 characters. In the running page: **0 of 151,552 values differ** (Home 600 of 2,403 elements,
Sections 584 of 584, 64 properties, both themes); my compile of the split files reproduces the page's own stylesheet
with 0 differences; a one-rule plant moved values; the restore is exact. **Agrees with the builder.**

**Word check (item 6).** All eleven screens plus the RW-105 surfaces, before and after a scan, at both widths.
**Sections, Settings, Account and Elevation** are exact apart from declared and live strings, and Consent differs only
by D-43; the full lists are in `logs\words-*.txt`. Plants, in copies, each verified applied and each original hash-checked:
`A shorter window for` → `A smaller window for` → named ABSENT and APP-ONLY, exact 24 → 23; the separator `  ·  `
→ ` · ` → 13 strings leave live-number (79 → 66) into LENIENT-LIVE, named; one string marked 1% visible →
`CLIPPED IN APP`. The clip report's real positive is D-39; nothing is clipped at 760 or after a scan.

**Sweeps (item 7).** Ten screens × two widths × two themes, both sides: horizontal overflow **0 px**; contrast
failures **0** (the bar hidden — see D-47); focusable but invisible **0**; no error overlay. Focus: **15 of 15** Tab
stops on Home, Picker and Settings show a visible change on both sides (`:focus-visible`, outline 2 px, offset 2 px).
Hit areas: Home's switches 39–44 px (median 44), Sections' 44 × 44 for all 19, `::before` plant → 18. The map: one
tab stop on both sides. **The 100 ms floor:** row switch 13.2 ms, Sections chip 19.5 ms, Picker chip 23.9 ms to the
first mutation on the control (dummy 2.3 / 3.2 / 2.9 ms); my Clear timing observed the button, not the bar, and
recorded nothing — the bar did hide on both.

## R8.8 — What could not be tested, and why

| item | why |
|---|---|
| `Remove these`, the safe run, the elevated run, the schedule switch, sign-in | forbidden by the dispatch; D-48 and D-49 are read from source, not exercised |
| held back with a figure | needs a safe-batch dry-run, outside this round's allowance; `not measured` on both of the app's surfaces |
| Run's Cancel enabled mid-run | needs a real run; disabled at rest on both |
| Splash by hash navigation | with the catalogue already loaded, StrictMode's double effect cancels the only update check and the screen waits for ever — development only; the pair was taken on a real boot |
| 390 px | below `minWidth: 760` |

## R8.9 — Reproducing · side effects · incidents · cleanup

- **Drivers:** `gate4-evidence\round8\drivers\` (41 files, fed to `node --input-type=module` on stdin, `tools\cdp.mjs`
  unchanged); `logs\` (the guard log, the analytics log, the console record, every proof), `words\`, `measure\`,
  `rw122\`, `plants\`, `selection\`. No tool of an earlier round was edited.
- **Side effects:** 17 run folders in the app's local `runs\` (boot catalogue reads, two scans, the dry-runs, three
  `r8-crosscheck-*`) — read-only modes only; the dev origin's storage restored to its as-found keys; `desktop/dist`
  rebuilt once, after every runtime proof (ignored path; the tree still clean).
- **Incidents:** port 9241 was held on 127.0.0.1 by another session's automation Chrome; mine bound only `::1`, so my
  launcher's two read-only GETs (`/json/version`, `/json`) reached theirs — never navigated; mine killed, relaunched
  on 9287 with a listener check. The two postMessage retries (R8.1). My own instrument errors, each corrected and
  kept: a Home-card selector that pressed nothing; a selection file malformed by shell escaping (the app correctly
  read six lines); a re-set file path that fired no change; a clip walk that counted a non-clipping ancestor; a
  contrast reading taken in the wrong theme.
- **Cleanup, verified:** `windowsweep-desktop.exe` and its WebView2, cargo, the Tauri CLI, yarn and Vite gone; the
  guard exited when its socket closed; my Chrome killed; nothing listening on 5974, 9333 or 9287; the owner's
  Chrome and another session's automation Chrome untouched. **Build gate on the fresh `dist/`:** source maps 0,
  `sourceMappingURL` 0, the dev-engine marker 0 (1 in `src`), `run_clean` found (the grep reads the bundle); this
  project has no DEV test-auth hook (0 in `src`, 0 in `dist`).

## R8.10 — Can GATE 4 close? Can `desktop-v1.2.0` publish?

**No.** D-23, D-24 and D-25 are fixed and proved on the running app, but the surface D-23 opened carries three new
blockers: **D-47** (the selected deletion mode unreadable in light theme), **D-48** (a Permanent removal with no
confirmation, against the dummy's own promise — the owner decides) and **D-49** ("Recycle Bin" shown for rows that
are deleted outright). All three are cheap and dummy-first. The rest is filed with an owner and judged non-blocking,
each with its reason; **D-41 and D-42 are the largest parity debt** — History and Report were closed empty in rounds
1–2 and have never matched the dummy with data. **RW-119 can flip:** the Picker pair now shows `Remove these`.
**RW-103's acceptance is not met** for History and Report. A round 9 limited to the Picker bar (D-47–D-49, light
theme, a row from 17 and one from 23) and the owner's D-48 choice is short with these drivers.

---

# ROUND 7 — 2026-09-13, the current source (HEAD `9735c7a`, desktop 1.2.0) · GATE 4 does NOT close — two must-fix divergences

**Build under test:** not the installed 1.1.0 — the current source, launched with `yarn tauri dev` from `desktop/`
(Vite 8.2.2 on the registered port 5974; Rust `dev` profile; `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=
--remote-debugging-port=9333`). `app_version` over the real IPC answered **1.2.0** and a `--scan` document
reported engine **1.2.0**, so every figure below came from the real bundled engine, never the dev stand-in
(`devEngine()` returns `null` inside a Tauri window, `dev-gate.ts:30`). WebView2 Edg/152.0.4191.66.
**Dummy:** Chrome for Testing 151.0.7922.77, headless `--disable-gpu`, a project-scoped profile
`ahsan-automation-windowsweep-r7` on port 9226 (other agents were running in parallel, so not the shared 9222),
profile read from the OS process table before the first navigation. **Treatment:** lime, light and dark.
**Widths:** 1440 and 760. **Account:** none — the local Windows user, unelevated, signed out (sign-in is not
configured in this build); the product has no admin role, so no flow could run as an admin.

**Scope:** RW-119 (the four RW-105 surfaces never captured) and RW-103's acceptance (round-7 pairs judged
`match`), plus TASK-004 / TASK-009 / TASK-010 and D-8 / D-21. **30 pairs, 60 captures**, plus 7 single-side
state captures.

## R7.1 — How the round was made safe, and how its instruments were proved first

| instrument | what it did | proved by |
|---|---|---|
| **IPC guard, at the transport** | Tauri 2.11.5 defines `__TAURI_INTERNALS__.invoke` with `writable:false, configurable:false` (read live), so a JavaScript wrapper would be a silent no-op. The guard intercepted `http://ipc.localhost/*` over CDP `Fetch` and fulfilled every refusal with Tauri's own error shape (`Tauri-Response: error`) — a *failed* request would have sent Tauri to its `postMessage` fallback, around the guard. Allowed `--list`, `--scan` and read-only commands; refused `--elevate`, `--yes`, `--all`, `--only`, `--install-task`, `--uninstall-task`, `--select-file`, `--i-understand-deep`, `--hiberfil`, `--permanent`, `--dry-run`, `write_select_file`, both `oauth_*`, `opener` / `dialog` / `process` and every updater command but `check` | control `app_version` → `1.2.0`; unknown command → `round-7 guard refused ws_r7_guard_probe - refuse: command not on the allowlist`; `run_clean --list --json --permanent` → `refuse: forbidden flag --permanent`; a later `list_drives` still reached the guard (no fallback) |
| **analytics blocked** | the local `.env` carries the four ids and `analytics.ts` has no DEV guard, so a dev session reports to production. `Network.setBlockedURLs` blocked **316** requests after the guard attached (188 Amplitude, 128 Sentry). The first ~9 minutes after boot preceded the guard and are unobserved | the network log |
| **axis probe (§10)** | defaults parsed from the dummy's own `app.js` `AXES` table: **declared 10 · written 10 · absent 0 · different 0**; the full `<html>` attribute set identical at 1440 and 760 | parse arm (density default mutated in an in-memory copy; real `app.js` hash unchanged) → `density: dummy=spacious app=comfortable`; live arm (`data-radius` removed) → `radius (data-radius) declared but not written`; restored → clean |
| **captures** | viewport grown until `main.content` has nothing left to scroll; the dummy's `demo.js` toolbar hidden (2 nodes per page); each app screen's `<details>` state recorded on arrival and restored before every capture (a first pass had it wrong at 760 and was re-run); the app's theme set through its own Appearance panel; **no reload after the one scan** | open-state counts logged per pair (Home 1/5 open on both sides, Run and Elevation 0/1) |

**Over the session the guard allowed 71 calls and refused 6 — all 6 were my plants. The app never attempted a
forbidden call.**

## R7.2 — The verdict table

| surface | 1440 light | 1440 dark | 760 light | 760 dark | what matches | what diverges |
|---|---|---|---|---|---|---|
| **Home** | diverge | diverge | diverge | diverge | all twelve bands; the drives band and capacity ring (RW-105) placed and worded as the dummy; the map is ONE tab stop; the table's per-row switches (TASK-009) | **D-24** (blocking), D-25, D-32, D-33, D-36 |
| **Run** | diverge | diverge | diverge | diverge | idle hero `READY TO RUN` · `0 of N sections · not started` (D-22 closed); **Cancel present and disabled at rest (RW-105)**; D-21 closed | D-30, D-31 |
| **Settings** | diverge | diverge | diverge | diverge | the four D-8 preferences, their values and `Maps to …` lines; the schedule row (RW-105) word for word | D-26, D-35; open question (a) |
| **Picker** | diverge | diverge | diverge | diverge | nothing comparable — the app can only show its empty state | **D-23** (blocking), D-37 |
| **Elevation** (default) | diverge | diverge | diverge | diverge | TASK-004: per-section switches, section 15's `Leave it / Reduced / Turn it off`, both buttons, the scan note | D-27, D-29 |
| **Elevation** (deep gate, 16 chosen) | diverge | diverge | diverge | diverge | gate lede, only the chosen section's consequence, confirm switch `I understand what these sections do`, blocked reason `Confirm you understand the deep sections above.` beside the buttons, run button disabled, `--i-understand-deep` added on confirm — **word for word** | D-27, D-29 |
| **Elevation** (measured) | diverge | — | — | — | the result sentence, the figure a live number | D-28 (channel) |
| **Account** | declared + diverge | declared + diverge | declared + diverge | declared + diverge | the h1 and lede words | the not-configured state is declared on screen (`pending-wave`, as in round 1); **D-38** outside the declaration |
| **Sections** | diverge (minor) | — | — | — | TASK-010 measured; 123 of 137 dummy strings exact, 12 live numbers, **47 of 47 accessible names exact** | D-34 |

"Diverge" is strict: any undeclared difference outside `prototype` · `demo-data` · `live-number` ·
`pending-wave`. Exempted throughout, and not listed again: the dummy's static-HTML anchor styling (underlined rail
links, a link-blue `Open the report` — `prototype`, as in rounds 1–6), its title-bar badges, `PROTOTYPE` rail
group and `storage: localStorage` (`prototype`), seeded tiles, rows, paths and runs (`demo-data`), every size,
count, percentage and "Six"/"6" (`live-number`, though a sentence opening with a numeral is worth a style pass).

## R7.3 — The two must-fix divergences

### D-23 · "Remove these" cannot be reached by any user — the Picker never receives a candidate · **app** · BLOCKING

The Picker renders only `useStore.candidates` (`Picker.tsx:151` returns the empty state otherwise). The only
caller of `setCandidates` is `Home.tsx:192`, and Home only ever runs `--scan` (measured: **673 targets, 0
candidates**) or `--all`, which is the safe batch `0,1,2,3,5,6,7,8,9,10,21` (`lib/constants.ps1:75`) — never an
interactive section. The one path that *can* run an interactive section, the Sections screen's Dry-run, discards
the summary (`Sections.tsx:112` calls only `finishRun`, and `finishRun` stores no candidates). Proved at runtime
through the app's own controls:

| step | result |
|---|---|
| Sections → select 18, 19, 23 → **Dry-run** | one call: `--only 18,19,23 --yes --dry-run --not-developer --days 100 --temp-days 3 --large-file-mb 100`; Run screen `Finished · 0 B · 3 of 3 sections` |
| the engine, same args, called independently | `dry_run: true`, **8 candidates** (section 23), `freed_bytes: 0` |
| the Picker afterwards | `Nothing has been offered yet.` · **0 "Remove these" buttons · 0 rows** |

Consequences: RW-105's "Remove these" is dead code for every user; Home's four "These need a person" cards read
`nothing offered yet · 0 items waiting` forever; "Choose items" only navigates to that empty screen.
**Fix:** store candidates wherever a summary lands — in the store's `finishRun`, or `setCandidates(r.summary.
candidates)` in the Sections `.then` — and give "Choose items" a way to populate (a dry-run of that section on
entry). Then recapture the Picker with real candidates, after D-37 is fixed in the dummy.

### D-24 · first-run developer mode is OFF in the app, ON in the dummy and in the engine · **app** · BLOCKING

| source | first-run developer mode |
|---|---|
| dummy `db.js` `DEFAULT_FACTS` | `developer: true` |
| engine `lib/config.ps1` `Resolve-DeveloperMode` | "flag > saved answer > interactive question > conservative default (yes)" → `$ws.Developer = $true` |
| app `store.ts:354` | `readLocal<boolean>(DEVELOPER_KEY, false)` — and the app always passes the flag, so the engine's default never applies |

Every first-run safe run from the app passes `--not-developer`, which offers every toolchain cache in full.
Rounds 1–6 could not see it: the installed app's storage held `developer: true` from round 1's flow 6. This
round's dev origin was genuinely fresh. **Proved both directions, each through the side's own switch:** with the
app turned ON, its Home line, Run command (`windowsweep --json --all --yes --developer --days 100 --temp-days 3
--large-file-mb 100`) and section-20 card equal the dummy's rendered strings exactly; with the dummy turned OFF,
its Run command and section-20 note (`Developer mode is off, so the engine skips this one. Turn it on in Settings
first.`) equal the app's. **Fix:** `readLocal<boolean>(DEVELOPER_KEY, true)`.

**Fix D-25 with it (owner: the dummy, then the app).** `index.html:130`'s caption is static and the app mirrors
it (`home.developerNote`), so the OFF state — rendered in both — reads *"Off – every cache is offered in full"*
directly above *"Caches you have used recently are left alone, so your next build is not a cold one."*, which is
false at that setting: the D-18 class, copy that understates deletion. The dummy's own Settings row already has
the state-dependent pair (`Nothing is being held back – every cache is offered in full.`).

## R7.4 — The other divergences — filed, each with its owner

| id | owner | element | kind | since |
|---|---|---|---|---|
| **D-26** | app | Settings → Developer mode row carries Home's two lines instead of the dummy's `Keeps package, build and test-runner caches that were used inside the idle window, instead of clearing them completely.` + the state-dependent consequence | words | D-8 |
| **D-27** | dummy | Elevation `commandLine()` (`page-elevation.js:47-54`) lacks the `--days --temp-days --large-file-mb` D-8 put on the elevated run; the Run command was amended, this one was not | words | D-8 |
| **D-28** | dummy | "Measure without elevating": a transient toast in the dummy, an inline `note note-info` with `role="status"` at the control in the app. §12 prefers the app's; the decision is recorded only in `design/README.md` (2026-09-13) — §10a wants it in `page-elevation.js` | layout | 2026-09-13 |
| **D-29** | app | Elevation eyebrow `Sections that need administrator rights` vs `Sections 12–16 and 20`; the lede loses `<strong>never elevates itself</strong>`; steps 2 and 4 lose `<code>` on `--reports-dir`, `--logs-dir` and the runs path; the command line sits in the page instead of the status bar (`[data-ws-text="elevateCmd"]`) | words + layout | TASK-004 |
| **D-30** | app | Run log heading `The engine's own log` vs `Log` + `never animates – this is the surface you watch while something irreversible happens` (`run.html:81-82`); per-section rows append `expected` | words | `5f2bc84` / `a75ac9b` — missed by rounds 1–6, see R7.6 |
| **D-31** | app | shipped copy names "the click dummy": `pending.runProgress` under Run's per-section list and `pending.body` on Settings → Scanning and Notifications. Users of 1.1.0 already see it | words | `a75ac9b` |
| **D-32** | app | on the RW-105 surfaces: ring arc titles `C  ·  9.8 GB free of 272.9 GB  ·  53.6 GB reclaimable` vs `C:  21.0 GB free of …` (colon dropped, a separator added — `home.ringArcTitle`); drive-bar titles `… reclaimable on C` vs `… on C:` (`home.driveRailTitle`; `drives.ts:31` promises "the window adds the colon"); the Home schedule switch named `Weekly schedule` vs `Weekly scheduled run` | words (names) | RW-105 |
| **D-33** | app | `1 sections` (`home.lastWhen`) and `Space freed by the last 1 runs, oldest first: 0 B.` (`home.sparkAria`, with a trailing period the dummy lacks) — no plural form, while the catalogue uses `_one`/`_other` elsewhere | words (i18n) | `a75ac9b` |
| **D-34** | app | Sections eyebrow `The catalogue` — the dummy has none | words + layout | `5f2bc84` — missed by rounds 1–6 |
| **D-35** | app | Settings status note `settings sync when you are signed in` never built (no key in `en.json`); tablist named `Settings` vs `Settings sections` | words | D-8 |
| **D-36** | dummy | Home: `Include everything` stays enabled as a no-op when nothing is excluded (the app disables it); the idle-window readout `100 days` exists only in the app. Amend the dummy to the app's behaviour, or declare | layout + words | wave 4b |
| **D-37** | dummy | the Picker labels 18 and 19 swapped — `18 · large files` / `Large personal files` and `19 · downloads` / `Old downloads` (`picker.html:45-46`, `page-picker.js:10-11`) against its own `seed.js:46-47` and the engine catalogue (18 `partials`, 19 `large`). The app names sections from the catalogue (`Picker.tsx:176`), so a populated Picker will differ until the dummy is fixed | words | — |
| **D-38** | app | Account frame beyond the dormancy declaration: eyebrow `Account` vs `Optional`; `wrap-narrow` single column vs the dummy's card + `What is stored, exactly` table; no Sync band; no `What happens when two machines disagree`; the lede loses `<strong>never gated</strong>`. In every state, configured or not (`Account.tsx:90-160`). Not blocking while sign-in is dormant; owed before row 15 | words + layout | `5f2bc84` |

**Observations, not judged as divergences (owner decisions):**
- **The Reclaim button and the Run hero carry the scan total, not what the run does.** `Reclaim 53.6 GB` and
  `READY TO RUN 53.6 GB`, while the safe run is expected to free **11.5 GB** (the ladder; the per-section rows sum
  to the same). 4.6× on this machine with developer OFF. The dummy's seed makes the two equal, so it never
  specified which number the button carries; round 6 accepted the same shape (59.6 vs 39.5).
- **Real paths push the table's Size and Idle off-screen.** The engine gives only absolute `path` (median 81
  characters), so Home's table is 1453 px wide inside its `.xscroll` band at 1440; the dummy's short
  `%LOCALAPPDATA%\…` seed paths (`demo-data`) never exercised it.
- **The dummy's own Settings consequence renders `Right now that holds back -.`** — a dash for the figure — at
  its seed state.
- **Two counts under one noun.** Home's map `aria-label` says 243 targets; the hero says 673 (zero-byte targets are
  not drawn).
- **RW-105's five dummy questions are still unanswered**, and two surface here: (a) the schedule switch shows a
  state word `Off` beside it in the app only; (c) held back reads `not measured` with no count line.

## R7.5 — Measurements

**Home's table switches (TASK-009)** — every hit area sampled pixel by pixel with `elementFromPoint`, which
attributes a `::before` hit to its switch and shows which neighbour owns an overlapping pixel:

| | dummy 1440 | app 1440 | dummy 760 | app 760 |
|---|---|---|---|---|
| visible switch box | 30.4 × 17 | 30.4 × 17 | 30.4 × 17 | 30.4 × 17 |
| `::before` | min 44 × 44 | min 44 × 44 | min 44 × 44 | min 44 × 44 |
| row height | **39.5** (every row) | 39.5 – 129.5 (median 62) | 39.5 – 84.5 (median 62) | 39.5 – 129.5 (median 62) |
| effective hit height × width | **33 – 39** × 44 (median 39) | 39 – 44 × 44 (median 44) | 38 – 44 × 44 | 39 – 44 × 44 |
| edges owned by a neighbour | 13 | 2 | 0 | 2 |
| sampled (visible in the 20 rem scroller) | 7 of 28 | 5 of 243 | 5 of 28 | 5 of 243 |
| plant `.switch::before{display:none}` | **18**, box unchanged | 18 | 18 | 18 |

**A single-line row is 39.5 px, under 44, so neighbouring 44 px hit areas overlap by 4.5 px.** The lower switch
owns the strip (it paints later), leaving each upper switch an effective **39 × 44** target — above WCAG 2.2's
24 px minimum (2.5.8), below the 44 px goal. The app's rows are mostly taller (wrapped target names), so it
overlaps only where two single-line rows meet. The 33 px reading is the first visible row, clipped by the table
header, not by a neighbour.

**The map is ONE tab stop, on both sides and at both widths.** `svg` `tabindex="0" role="img"`; every tile — 28 in
the dummy, 125 in the app — `tabindex="-1"`, no role, no label; nothing focusable inside. Real Tab presses from
`Reclaim …`: one stop in the map, then out (the app's walk skips `Include everything`, disabled — D-36).

**Sections (TASK-010) — verified.** 19 switches on both sides, each 30.4 × 17 visible in a 59 px row, each with an
empirical **44 × 44** hit area and no overlap, at 1440 and 760. With the rule disabled the height falls to 18 and
the visible box does not move; restored, 44.

## R7.6 — "Measure without elevating": read-only, and no UAC

| | |
|---|---|
| pressed | once, 22:10:04 UTC; the guard logged exactly one call: `run_clean ["--scan","--not-developer","--days","100","--temp-days","3","--large-file-mb","100"]` — **no `--elevate`** (which it would have refused) |
| result, ~24 s | `<p class="note note-info" role="status">` **"Measured 29.8 MB across the sections you chose. Nothing was deleted, and no permission was needed to look."** |
| UAC | the process table sampled every 500 ms from 03:09:57 to 03:12:27 local — **292 samples, `consent.exe` 0** |
| the dummy | toasts `Measured 15.9 GB across the sections you chose. Nothing was deleted, and no permission was needed to look.` — the same sentence (live number), a different channel (D-28) |

"Ask for permission and run" was never pressed (IRON rule 10); confirming the deep gate only changed the command
line. **The 2026-09-13 fix holds.**

## R7.7 — The word check, its plants, and three gaps it closed

**Method.** Raw text-node values (textContent, never `innerText`) after opening every `<details>`; invisible
elements excluded; only whitespace runs that contain a line break folded (self-check first: `"not   measured"`
kept, `"A  ·  B"` kept, source indentation folded). Tiers: exact · live number (digits masked, spacing, case and
punctuation kept) · lenient (reported) · lenient live number (reported) · absent. A **whole** string — the entire
text of its box — must equal a string on the other side; only a fragment may match by containment.

| plant (in a COPY of an app snapshot; originals hash-checked) | applied? | what the check said |
|---|---|---|
| **one word** — Settings, `A shorter window for` → `A smaller window for` | original 1 → copy 0, new phrase 1, 6 entries | **`ABSENT FROM APP: "A shorter window for %TEMP% and the Windows temp folders, which turn over much faster."`** and `APP ONLY: "A smaller window for …"`; exact 23 → 22. Restored: gone |
| **the separator** — Home, every `  ·  ` → ` · ` | 15 → 0 | 13 strings per side moved out of live number into `LENIENT LIVE-NUMBER`, named (`pkg · 13.7 GB` vs `pkg  ·  7.2 GB`). Restored: 81 / 168 live, 0 lenient |

**Gaps in the rounds-1–6 checker (`tools/parity-words.mjs`), found and closed here:**
1. `isQuantity` treats any string of three characters or fewer as a number, so the dummy's heading `Log` could never
   be reported — D-30 has hidden since round 1.
2. Containment lets a short app-only string pass inside a longer dummy sentence (`The catalogue` inside `The
   catalogue is a frozen public contract…`), and a dummy heading pass inside engine output (`Log` inside `Log:  C:\…`)
   — D-34 has hidden since round 1. Fixed by the whole-string rule.
3. My own first live-number tier masked after a whitespace-collapsing fold, so a single-spaced separator would have
   passed as a live number — the exact trap RW-119 names. Fixed before plant 2.

And one in the build gate: the spaced needle `not the real engine` can never match — the marker is
`windowsweep-dev-fallback-not-the-real-engine`. Measured with it: **1 file in `src/`, 0 in `dist/`.**

## R7.8 — What could not be captured, and why

| item | why |
|---|---|
| the app's Picker with candidates and `Remove these` | unreachable — D-23. The dummy's ticked state is captured as the reference (`picker-selected-*`, `Remove these` visible and enabled beside Recycle Bin / Permanent) |
| Run's Cancel enabled mid-run | needs a real cleanup run (MANUAL-TASKS row 28 is the owner's); captured at rest, disabled, on both sides |
| Account's configured signed-out state and the deletion band | sign-in is not configured in this build and will not be in 1.2.0 unless row 15 lands; the dummy also hides the band until sign-in; not faked |
| the schedule switch toggled | it registers a real Scheduled Task (row 26 is the owner's); captured at rest |
| held back with a figure | needs a safe-batch dry-run; left `not measured` |
| 390 px | below `minWidth: 760` |

## R7.9 — Can GATE 4 close? Can `desktop-v1.2.0` publish?

**No — not until D-23 and D-24 (with D-25) are fixed.**

| must fix before publishing | why it blocks |
|---|---|
| **D-23** — the Picker never receives a candidate | RW-105's "Remove these" ships as a built, advertised surface no user can reach, and four Home cards read `nothing offered yet` forever |
| **D-24** + **D-25** — first-run developer mode OFF, and the OFF caption | every first-run safe run offers every toolchain cache in full, against the dummy and the engine's own conservative default, under a caption saying recent caches are left alone |

Everything else is filed, named and owned; by round 6's own principle a filed, named divergence does not hold a
screen. D-31 (the "click dummy" wording in shipped copy) is cheap and worth the same pass. **D-21 is closed** and
**D-8 is confirmed** in the rendered pair. **RW-119 cannot flip** — its Picker pair shows no Remove control —
and **RW-103's acceptance ("pairs judged `match`") is not met.** After the two fixes, a round 8 limited to Home
(the developer band), Picker (with candidates via a Sections dry-run of section 23), Run (the command line) and
Elevation (card 20) is short with these drivers.

## R7.10 — Reproducing this · side effects · cleanup

- **Drivers:** `gate4-evidence\round7\drivers\` — 15 files, the exact text each step fed to `node
  --input-type=module` on stdin, with `tools\cdp.mjs` reused unchanged. Note: `tools\capture-dummy.mjs`,
  `parity-words.mjs`, `parity-axes.mjs` and `r6-verify.mjs` still hardcode the pre-rename root and fail as
  written; `launch-app.mjs` launches the installed 1.1.0.
- **Captures and logs:** `gate4-evidence\round7\pairs\` (67 files, 15 MB) and `…\logs\` (58 files: the IPC guard
  log, the network log, the word snapshots and reports, the measurements, the UAC watch, the storage record).
- **Not beside this file, by decision (main session, 2026-09-13):** the 13 downscaled `*-round7.png` pairs are kept in `gate4-evidence/round7/committed-candidates/` and NOT committed. Their app halves show this machine's user-folder paths and, in the Run log pane, its OS edition, RAM and drive sizes, and IRON rule 8 names only `PROJECT-CONTEXT.md` and `MANUAL-TASKS.md` for machine-specific paths in this public repository. Round 6's committed pairs carry the same kind of detail; they are reported here, not rewritten out of history.
- **Side effects:** eight run folders under `%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\` (two empty from the
  boot catalogue reads, the Home scan, the Measure scan, the Sections dry-run, three `r7-*` from direct engine
  calls; about 206 KB) — the installed app's History reads the same folder; left as evidence, safe to delete.
  Only read-only engine modes ran: `--list`, `--scan`, and one dry-run of interactive sections 18 / 19 / 23,
  permitted by a second guard that required `--dry-run` and was first shown refusing `--permanent`, section 17
  and a missing `--dry-run`. The dev origin's storage was restored to the as-found key set.
- **Incidents, stated:** a `chrome.exe --version` probe launched one Chrome for Testing window on its default
  profile for about two minutes (Windows Chrome does not print a version) — never navigated, killed by PID. The
  round's automation Chrome ended mid-session with Chrome's own `exit_type: Crashed` and no crash dump,
  consistent with an external kill; it was relaunched on the same profile after re-asserting it.
  `C:\Windows\system32\convert.exe` is the FAT-to-NTFS converter, not ImageMagick — never run.
- **Cleanup, verified:** nothing listening on 5974, 9333, 9226 or 9222; no `windowsweep-desktop.exe`, no session
  node process, no windowsweep WebView2; the owner's own Chrome was never touched. Build gate on `desktop/dist/`
  (built 01:26, the 1.2.0 cascade): test-auth hooks 0, dev-engine marker 0, `*.map` 0, `sourceMappingURL` 0;
  the control `run_clean` found.

---

# ROUND 6 — 2026-09-07, 22:22 build · 🔴 GATE 4 CLOSES ON ALL ELEVEN

**Build:** exe 5,512,192 bytes, **22:22:56**, 39 engine files, registry v1.1.0. WebView2 baseline 14.
One `--scan` through Home's own button, no reload, theme switched by attribute. Whitespace self-check ran
first (`'not   measured'` → `'not measured'`, `s` intact); every expected sentence **parsed from the app's own
`en.json`**; every comparison case-insensitive.

## R6.1 — D-18's five items: all closed, measured

| item | app now shows |
|---|---|
| hero `measured … ago` + `· re-scan` | **`measured 0 minutes ago across 665 targets in 10 sections · re-scan`** — both halves, one line |
| the Idle window slider | a real `input[type=range]`, **`min 7, max 365, value 100`** |
| Sections `N of 26 shown` | **`26 of 26 shown`** |
| the status bar's log path | **`C:\Users\PC\AppData\Local\com.aoneahsan.windowsweep\runs\2026-09-07-17-26-25-hr5690`** — the engine's own answer, which is what the amended dummy now specifies |
| Run's command line | **`windowsweep --json --all --yes --developer --days 100`** |

**D-18 is closed.**

## R6.2 — five declarations on Home, all visible, all correctly worded

| declaration | visible | rendered box |
|---|---|---|
| `pending.drives` | ✅ | 629×68 |
| `pending.schedule` | ✅ | 334×78 |
| `pending.mapIdle` | ✅ | 1161×39 |
| `pending.mapExclude` | ✅ | 1161×20 |
| **`pending.heldBack`** (new) | ✅ | 315×137 |

**5 of 5.** The new one reads correctly and is honest about *why*: *"…nothing in its summary says how much of
that the idle gate would keep, so a figure here would be invented. The idle window beside it is real: it is
the threshold the next run uses."* — declared `pending-wave`, sitting beside a **real** slider, which is
exactly the right shape: the unmeasurable half declared, the measurable half built.

## R6.3 — the developer-mode toggle: both states correct, the inversion gone

Driven through the app's own switch:

| | `aria-checked` | rendered line |
|---|---|---|
| as found | `true` | **`On – keeping anything used in the last 100 days`** |
| after toggle | `false` | **`Off – every cache is offered in full`** |
| restored | `true` | `On – keeping anything used in the last 100 days` |

Both match `en.json` (`home.developerOn` with `{{days}}` interpolated to the slider's 100, and
`home.developerOff`) and both match the dummy's own `wire.js:452-453` **string for string**.

🔴 **The inversion is gone.** The old line said *"Off. Toolchain caches are left alone."* while the engine
clears those caches completely at that setting — copy that understated destruction. It now warns.

## R6.4 — the numbers, read against the engine again

| surface | shows |
|---|---|
| hero · rail · button | **59.6 GB** (`measured 0 minutes ago across 665 targets in 10 sections · re-scan`; `across 10 sections`; `Reclaim 59.6 GB`) |
| ladder | **39.5 GB** |

Engine, same session: **665 targets · 63,949,422,308 bytes · 10 sections**; safe-batch subset (computed
independently) **42,411,472,381 bytes**.

| | bytes | **÷ 2³⁰** | app |
|---|---|---|---|
| total | 63,949,422,308 | **59.6** | 59.6 GB ✓ |
| safe batch | 42,411,472,381 | **39.5** | 39.5 GB ✓ |

Both exact. Five surfaces agree; the ladder alone differs, **by exactly the safe-batch subset**. Target count
665 and section count 10 match exactly. This check found D-17 and D-20; it finds nothing this round.

## R6.5 — D-20 is fixed

| | round 5 | **round 6** |
|---|---|---|
| Run's idle eyebrow | `FINISHED` / `Reclaimed 0 B.` | **`READY TO RUN`** |
| the `-1` row | present (`-1 · -1 · ran · 0 B`) | **gone** |
| Per section rows | 1 (the sentinel) | **11** real sections |

## R6.6 — the `svg text` count, and on what data

**27 on Home and 27 on Run** (the same map, drained), against the dummy's **54**. The reason is unchanged and
is the data, not the rule: the app draws **190 tiles** where the dummy draws 73, and this machine's scan
leaves most of them below the label guard. The **derived 44 still cannot be confirmed here** — that needs the
dummy's seeded dataset fed to the app, a source change outside my scope. The data-independent ratio check from
round 4 stands (1.74 dummy vs 1.64 app: same size guard, same two-line label). **Not a defect.**

## R6.7 — the pairs

Both sides measured, no reload. Home 291 dummy texts vs **531** app; absent 127 (was 134). Run 99 vs **342**;
absent 44 (was 49). After removing the dummy's prototype chrome and demo-data tile names, Run's residue is
**two** lines, both in R6.8.

| pair | verdict |
|---|---|
| `home-1440-light` · `-dark` · `home-760-light` · `-dark` | **MATCH** — twelve bands, five declarations, numbers exact, D-18 closed, developer copy correct |
| `sections-1440-light` · `-dark` · `sections-760-light` · `-dark` | **MATCH** — `26 of 26 shown` restored; residue is the dummy's own prototype chrome (`prototype`) |
| `run-1440-light` · `-dark` · `run-760-light` · `-dark` | **MATCH with a filed minor (D-22)** — all six D-19 structures, `READY TO RUN`, no `-1`, 11 per-section rows, the amended command line |

## R6.8 — two new findings, neither blocking

### 🔴 D-21 · the dummy's own amendment is overwritten at runtime · **the DUMMY, not the app**

`run.html:132` carries the amended string. `page-run.js:205-206` then rebuilds the **old** one and writes it
over the slot:

```js
window.wsWire.setText('runCmd',
  'windowsweep --all --yes --json' + (db.facts.developer ? ' --developer' : ' --not-developer'));
```

| | value |
|---|---|
| `run.html:132` (static, amended) | `windowsweep --json --all --yes --developer --days 100` |
| **what the dummy RENDERS** | `windowsweep --all --yes --json --developer` |
| **what the app renders** | `windowsweep --json --all --yes --developer --days 100` |

**The app is correct and matches the amended source; the dummy renders its pre-amendment string.** This is the
recurring class: *a change written into an artefact's static text while a script rewrites it at runtime reads
as applied and is not.* **Fix in the dummy** — build the string from the same helper the static slot records,
or delete the runtime write. Until then a parity check against the *rendered* dummy will keep reporting a
divergence that does not exist in the product.

### D-22 · Run's idle hero omits the number and the progress line · **web layer** · minor

| | dummy (idle) | app (idle) |
|---|---|---|
| eyebrow | `READY TO RUN` | `READY TO RUN` ✅ |
| hero number | **`0 B`** | *(no `.hero-num`)* |
| progress line | **`0 of 8 sections · not started`** | *(absent)* — the app shows `idle - press "Start the safe run"` instead |

The substitute line is itself the dummy's own idle log line (`page-run.js:203`), so this is a slot difference
rather than invented copy. **Undeclared**, so it is filed rather than passed as a declared divergence.

## R6.9 — 🔴 Can GATE 4 close on all eleven screens?

**Yes. GATE 4 closes on all eleven.**

| screens | state |
|---|---|
| Consent · Elevation · Picker · History · Report · Account | clean |
| Splash | D-13 (copy) filed |
| Settings | D-8, D-9 filed |
| **Home** · **Sections** | **clean — D-18 closed this round** |
| **Run** | **closes with D-22 filed (minor, undeclared)** |

**Why D-22 does not block, stated so the bar is visible rather than assumed:** rounds 4 and 5 closed Sections
and then Home while their D-18 minors were open and filed, on the principle that a *filed, named, non-invented*
divergence does not hold a screen. D-22 is that same class — one slot on one screen, using the dummy's own
words. Applying a stricter rule to Run now would be moving the bar to reach a different answer.
**D-21 is a defect in the dummy and does not reflect on the product at all.**

**Open, none blocking:** D-8, D-9 (Settings) · D-13 (Splash copy) · **D-21** (the dummy) · **D-22** (Run, minor).
**Closed:** D-1 … D-7, D-10, D-11, D-12, D-14 … D-20, **and D-18**.

Across six rounds the app went from *unable to start its own engine* to *eleven screens matching an approved
dummy*, and every step of that was found by the same two instruments: **opening the pair side by side, and
reading the numbers against the engine rather than against the screen.**

---

# ROUND 5 — 2026-09-07, 19:09 build · ten of eleven close

**Build:** exe **5,512,192 bytes**, dated **19:09:48**, 39 engine files, registry v1.1.0. WebView2 baseline
before launch: 14. One `--scan` through Home's own button, then **no reload** — theme switched by writing the
two attributes the app's own apply path writes.

**Instrument hygiene, both traps handled before any output was trusted:** every pattern lives inside
`String.raw` in a file written by the Write tool, and a **self-check ran first** —
`'not   measured'.replace(/\s+/g,' ')` → `'not measured'`, `sKept: true`. Had the regex collapsed to a
literal `s` the script refuses to run. Every text comparison is **case-insensitive**, because `.caps` applies
`text-transform: uppercase` and `innerText` reflects the rendered form.

## R5.1 — D-17 is fixed, confirmed independently and arithmetically

Five surfaces now agree, and the sixth differs by design:

| surface | shows |
|---|---|
| hero value | **59.3 GB** |
| hero sub-line | **`across 665 targets in 10 sections`** |
| primary button | **`Reclaim 59.3 GB`** |
| rail footer | **`59.3 GB` · `across 10 sections`** |
| ladder total | **`39.3 GB`** — deliberately different |

The engine, same session, through the app's own IPC: **665 targets · 63,721,958,621 bytes · 10 sections**.
My independently computed safe-batch subset (sections 0,1,2,3,5,6,7,8,9,10,21): **42,185,474,589 bytes**.

🔴 **The apparent 4 GB gap is not a gap — it is the unit, and both figures are exact:**

| | bytes | ÷ 10⁹ | **÷ 2³⁰** | app shows |
|---|---|---|---|---|
| total reclaimable | 63,721,958,621 | 63.7 | **59.3** | **59.3 GB** ✓ |
| safe-batch subset | 42,185,474,589 | 42.2 | **39.3** | **39.3 GB** ✓ |

Both match to the displayed precision at 2³⁰. **This is the engine's own convention, not an app deviation** —
the engine rendered 3,935,340,633 bytes as `"3.7 GB"` in its round-3 report, and 3,935,340,633 / 2³⁰ = 3.7.
Engine, dummy and app agree; the label says GB where the divisor is binary. **An observation, consistently
applied, not a defect** — and not mine to raise against the app.

**Confirmed as asked: the ladder is the only surface that differs, and it differs by exactly the safe-batch
subset** — 42,185,474,589 of 63,721,958,621 bytes, computed from the engine's own `targets[]` rather than
taken on trust. Target count (665) and section count (10) match exactly.

## R5.2 — D-19 is fixed: all six structures render, case-insensitively

On `#/run`, with every `<details>` opened: `what is going` ✅ · `tiles leave as each section finishes` ✅ ·
`per section` ✅ · `where these numbers come from` ✅ · `does none of the deleting` ✅ ·
`start the safe run` ✅.

**The draining band when idle — measured, not believed:**

| | tiles | labels |
|---|---|---|
| dummy default `run.html` (idle) | **73** | 54 |
| app, idle | **189** | 23 |

**Both render the map when idle, so showing it there MATCHES the dummy.** That was a judgement the coordinator
could not make from a measurement; it is now a measurement. My judgement agrees: the dummy renders its map
unconditionally, the app does the same, and the draining semantics (a tile leaves when the engine reports
`end`) are invisible at idle because nothing has started.

## R5.3 — 🔴 D-20 · the Run screen reads a SCAN's summary as a cleanup RUN's · **web layer** · blocks Run

This is D-17's class, in the one place D-17's fix did not reach. The coordinator's note records that the
hero/rail duplication "now lives once in `lib/reclaim.ts`" — **Home and Shell were corrected; Run was not.**

**Measured root cause.** The engine's `--scan` summary, read through the app's own IPC:

```
mode      : scan
sections[]: [{"section":-1,"status":"ran","freed_bytes":0}]
targets[] : cover sections [1,2,3,4,6,7,8,9,10,12]
```

The engine deliberately reports **`section: -1`** for the scan pseudo-step. The Run screen consumes that as a
finished run, producing two visible symptoms after nothing but a read-only scan:

| symptom | app | dummy (default, idle) |
|---|---|---|
| the heading | **`FINISHED`** / **`Reclaimed 0 B.`** | `Ready to run` · `not started` · log line `idle - press "Start the safe run"` |
| the Per section band | a row reading **`-1` · `-1` · `ran` · `0 B`** — the id `-1` leaking as both badge and section name | real section keys (`build`, `pkg`, `browsers`, …) with `queued` / `ran` states |

A person who presses `Scan` and then opens Run is told a run **finished** and **reclaimed 0 B**. Nothing was
run and nothing could have been reclaimed.

**Proposed fix:** treat `section === -1` as not-a-section, and treat a `mode: "scan"` summary as not a run —
the same discrimination `lib/reclaim.ts` already makes for the hero. Then Run's idle state can carry the
dummy's own words (`Ready to run`, `not started`, `idle - press "Start the safe run"`), which are also
currently absent. Round 3 measured the app's never-scanned Run as `Nothing has run yet.`, so **neither of the
app's two idle states uses the dummy's wording** — that is part of the same fix.

## R5.4 — the `svg text` count, and on what data

**23 on the app; 54 on the dummy's default `index.html`** (56 with disclosures opened). Unchanged from round 4
and for the same reason, restated with this round's figures: the map is drawing **190 tiles of which only 14
clear the label guard** (`w > 54 && h > 42`) in a 394px-tall box, against the dummy's 73 tiles / 31 clearing
in a 1421px box. The data is not of comparable shape and the derived **44 therefore cannot be confirmed or
refuted here** — confirming it exactly needs the dummy's seeded dataset fed to the app, a source change
outside my scope.

The data-independent check stands: **labels ÷ tiles-clearing-the-guard is 1.74 (dummy) vs 1.64 (app)** —
~1.7 text nodes per labelled tile on both sides, i.e. the same size guard and the same two-line label shape.
**Not a defect.**

## R5.5 — D-18 confirmed: still exactly those four items, nothing more

Each checked in the running app; every one still absent, so every one still open:

| D-18 item | state |
|---|---|
| the hero's `measured … ago` | absent — open |
| the hero's `· re-scan` | absent — open |
| the developer band's `HELD BACK RIGHT NOW` | absent — open |
| the developer band's `IDLE WINDOW` | absent — open |
| Sections' `of 26 shown` | absent — open |
| the status bar's `%USERPROFILE%\.windowsweep\logs` | absent — open |

**Exactly the four recorded groups (six checks) and nothing more.** One addition for accurate filing: the
dummy's Run status bar also carries the command line `windowsweep --all --yes --json --developer`, which the
app's does not — the same status-bar item, one more instance. All are **undeclared** omissions, which is why
they remain filed rather than passing as declared divergences.

## R5.6 — the pairs

Words compared with **both sides measured**, no reload, case-insensitive.

| screen | dummy texts | app texts | dummy absent | app-only |
|---|---|---|---|---|
| Home | 291 | **522** | 134 | 291 |
| Run | 99 | **319** | 49 | 284 |

Home's 134: 5 prototype, 25 data-bearing by figure, and of the rest the overwhelming majority are the dummy's
**seeded target names and paths** — `demo-data`, since this machine's scan found different targets. The app's
291 app-only lines are its **real** 190 tiles and table rows. What survives that filtering is D-18 only.

Run's 49: 5 prototype, 19 data-bearing, and of the remaining 25 all but four are demo tile names. The four:
`Ready to run`, `not started`, `idle - press "Start the safe run"` (**D-20**) and
`windowsweep --all --yes --json --developer` (**D-18**, status bar). `never animates — this is the surface you
watch while something irreversible happens` is the dummy's own design annotation → `prototype`.

| pair | app page | verdict |
|---|---|---|
| `home-1440-light` · `-dark` | 1440×2240 | **match** — all twelve bands, five surfaces coherent, four declarations visible; **D-18 minor outstanding** (undeclared, filed), on the same basis Sections closed in round 4 |
| `home-760-light` · `-dark` | 760×3211 | **match** — as above |
| `run-1440-light` · `-dark` | 1440×1203 | **defect — D-20** |
| `run-760-light` · `-dark` | 760×1223 | **defect — D-20** |

Judged by eye as well as measured: Home's treemap draws real labelled groups (`avd · 20.0 GB`,
`pkg · 14.7 GB`, `build · 11.7 GB`, `browsers · 7.6 GB`), the ladder shows per-group targets and
`Total a safe run would free 39.3 GB`, the four need-a-person cards, the assurance bleed band, the sparkline
(`0 B`, `1 minute ago · 1 sections · scan`), the admin band and the leaves-this-machine disclosure. Run draws
the same map under `WHAT IS GOING` with `Tiles leave as each section finishes`, a real `THE ENGINE'S OWN LOG`,
`Where these numbers come from`, `Cancel` with its declaration, and `Start the safe run` — spoiled only by the
`FINISHED / Reclaimed 0 B.` heading and the `-1` row.

## R5.7 — 🔴 Can GATE 4 close on all eleven screens?

**No. It closes on ten. One remains: Run, on D-20.**

| | screens | state |
|---|---|---|
| **closes** | Consent, Elevation, Picker, History, Report, Account (clean) · Splash (D-13) · Settings (D-8, D-9) · Sections (D-18) · **Home (D-18)** | **10** |
| 🔴 **cannot close** | **Run — D-20** | 1 |

**Home closes this round.** D-17 is fixed and independently confirmed by arithmetic against the engine; the
twelve bands are all present, eight built and four declared; the declarations are visible and correctly
worded; and the words match once demo-data is set aside. Its only outstanding items are D-18's undeclared
minors, which is the standing on which Sections was closed.

**Run needs D-20:** stop reading a `--scan` summary as a cleanup run, so the `-1` row disappears and the idle
state can carry the dummy's `Ready to run` / `not started`. It is one discrimination, in one place, of a class
already solved once in `lib/reclaim.ts`.

**Open after round 5:** D-8, D-9 (Settings) · D-13 (Splash copy) · **D-18** (minor, undeclared: Home ×2,
Sections ×1, status bar ×2) · **D-20** (Run, blocks the last screen).
**Closed:** D-1 … D-7, D-10, D-11, D-12, D-14, D-15, D-16, **D-17, D-19**.

---

# ROUND 4 — 2026-09-07, 18:45 build · the gate-closing round

**Build:** exe **5,512,192 bytes**, dated **18:45:12**, 39 engine files (bin 1, lib 8, modules 26, root 4).
Every source file predates it (`Home.tsx` 18:21, `Sections.tsx` 18:22, `Run.tsx` 18:14, `en.json` 18:39), so
there is **no source-vs-build skew** this round.

**Ten new components exist and are in the build:** `ReclaimMap.tsx`, `ReclaimMapBand.tsx`, `SafeRunLadder.tsx`,
`NeedsAPerson.tsx`, `LastRuns.tsx`, `AdminNotice.tsx`, `HomeSafety.tsx`, `RunPerSection.tsx`,
`SectionSelbar.tsx`, `SectionsTable.tsx`, with `d3-hierarchy ^3.1.2` in `package.json`.

**State for every measurement:** one `--scan` through Home's own `Scan` button (read-only), then **no reload**
— theme switched by writing the two attributes the app's own apply path writes. Judged against the **default**
dummy state (no `empty=1` / `failed=1`).

## R4.1 — 🔴 D-17 · Home's hero, rail and primary button all read zero while the same screen reads 39.3 GB · **web layer** · the gate-blocker

The engine's own `--scan --developer`, invoked through the app's IPC in the same session:

| the engine reported | value |
|---|---|
| targets | **665** |
| total bytes | **63,720,437,751** (63.7 GB) |
| sections with data | **10** — s4 21.49 GB, s1 15.74, s2 12.61, s7 8.16, s3 3.55, s10 1.00, s8 0.99, s6 0.13 |

What Home shows from that one scan:

| surface | shows | correct? |
|---|---|---|
| the Reclaim Map group totals | `avd · 20.0 GB`, `pkg · 14.7 GB`, `build · 11.7 GB`, `browsers · 7.6 GB` | ✅ matches the engine's per-section figures |
| the ladder | `pkg 14.7 GB / 14 targets`, `build 11.7 GB / 4 targets`, `browsers 7.6 GB / 157 targets`, `runners 3.3 GB / 5 targets`, `and 7 more 2.0 GB`, **`Total a safe run would free 39.3 GB`** | ✅ a plausible safe-batch subset of 63.7 GB |
| **the hero readout** | **`0 B`** · `across 665 targets in **1** sections` | 🔴 target count right, **bytes and section count wrong** |
| **the rail footer** | **`0 B`** · `across 1 sections` | 🔴 wrong |
| **the primary button** | **`Reclaim 0 B`** | 🔴 wrong |

**So three surfaces disagree with two others about one scan, on one screen.** The map and the ladder are
right. A person opening this build sees `RECLAIMABLE NOW 0 B` and a `Reclaim 0 B` button directly above a
ladder that says a safe run would free 39.3 GB, and would reasonably conclude there is nothing to do.

**Diagnosis (offered as a hypothesis for A-WEB to confirm, not asserted):** the `1 sections` is the tell. The
map and ladder aggregate `targets[]` from the scan JSON; the hero and rail appear to aggregate the summary's
`sections[]` array instead, which for a `--scan` carries a single entry and a `freed_bytes` of 0. The dummy's
line is `RECLAIMABLE NOW / 29.73 GB / measured 4 minutes ago across 28 targets in 8 sections · re-scan` and
`Reclaim 29.7 GB`.

## R4.2 — the four declared gaps: all visible, all worded as the catalogue says

Checked as **words, not absence** — each expected sentence **parsed from the app's own `en.json`**, never
restated in the probe, then located in the rendered DOM with a real box.

| declaration | in `innerText` | rendered box | node |
|---|---|---|---|
| `pending.drives` — the drive rails and capacity ring | ✅ | 372×113 | `P.t-sm ink-3` |
| `pending.schedule` — the weekly run | ✅ | 188×156 | `P.t-xs ink-3` |
| `pending.mapIdle` — idle shading and the Idle column | ✅ | 721×39 | `P.t-xs ink-3` |
| `pending.mapExclude` — clicking a tile to keep it | ✅ | 721×39 | `P.t-xs ink-3` |

**All four are visible and correctly worded — a PASS, not a defect.** Confirmed by eye in
`home-1440-light-app.png`: the two map declarations sit under the map legend, `pending.drives` fills a panel
under a real `DRIVES` heading, and `pending.schedule` sits inside the `SCHEDULE` band.

The map legend is trimmed to exactly what the declarations cover: the app keeps `Bigger tile, more space.` and
drops `Click one to keep it.` (→ `mapExclude`), `faded = used recently, solid = long idle` (→ `mapIdle`) and
`nothing excluded` / `Include everything` (→ `mapExclude`). `OF ALL DISKS` and `in use` are gone with the
capacity ring and the drive rails (→ `drives`), and `Idle (days)` with the Idle column (→ `mapIdle`).
**Each omission maps onto a declaration that is on screen.**

## R4.3 — the `svg text` count: 23 measured, and why 44 could not be confirmed here

**Measured: 23 on the app, 56 on the dummy page** (with every `<details>` opened; the stated 46 was presumably
measured with them closed — conditions differ, so I report mine rather than contradict).

🔴 **The 44 expectation cannot be confirmed or refuted on this machine, because my data is not of comparable
shape** — and the reason is my own earlier work: the one authorised real run freed 3.92 GB from the safe
batch, so the map is drawing many near-zero tiles rather than the dummy's eight fat groups.

| | dummy | app |
|---|---|---|
| map box | 1159×**1421** | 1159×**394** |
| tiles (`rect`) | 73 | **190** |
| tiles clearing the label guard (`w>54 && h>42`) | **31** | **14** |
| labels drawn | 54 | 23 |
| **labels ÷ tiles clearing the guard** | **1.74** | **1.64** |

**That ratio is the data-independent check, and it is the finding that matters:** ~1.7 text nodes per
labelled tile on both sides means the app applies the **same size guard and the same two-line label shape**
(name + size). 190 tiles in a 394px-tall box means only 14 clear the guard, so 23 labels is the correct
output of the right rule on different data. **Not a defect.** To confirm 44 exactly, the app would have to be
fed the dummy's seeded dataset, which needs a source change and is outside my scope.

## R4.4 — the restored words, and the admin badges

| restored | where checked | result |
|---|---|---|
| `A safe run, step by step` | Home | ✅ |
| `Per section` | Run | ✅ (`PER SECTION`) |
| `All 26` | Sections | ✅ (dummy and app) |
| `Needs a person` | Sections | ✅ |
| `Needs admin` | Sections | ✅ |
| the six admin badges | Home | ✅ **6/6** — Windows Update, Disk Cleanup, Component store, Hibernation file, Event logs, WSL disk images |

⚠️ On **Sections** both sides show **4 of the 6** admin labels — dummy 4/6 and app 4/6, the same four. That is
**parity**, not a gap; my first reading of it as an app shortfall was wrong until I measured the dummy.

`Six sections need Windows to ask your permission first.` (dummy) vs `6 sections need Windows to ask your
permission first.` (app) is **§10's countable-quantity carve-out working correctly** — the sentence is the
dummy's verbatim, and the number comes from the product. Match.

## R4.5 — the pairs

Words compared with **both sides measured**. 🔴 I had to redo this: `parity-words.mjs` sets the mode by
reloading, so its first round-4 run compared an **unmeasured app against a measured dummy** — the giveaway was
`not measured` and `Scan first` in the app-only list. Round 3 caught this class of error on the captures and
it reappeared here through a different script. The numbers below are from the no-reload rerun.

| screen | dummy texts | app texts | dummy absent | app-only |
|---|---|---|---|---|
| Home | 292 | **520** | 134 | 291 |
| Sections | 125 | 119 | **7** | 3 |
| Run | 100 | 291 | 55 | 271 |

**Sections — MATCH.** Of its 7 absences, **6 are the dummy's own prototype chrome** (`standard user`,
`design dummy · demo data`, `Prototype`, `Contents`, `Components`, `storage: localStorage`) and the seventh is
`of 26 shown`, the filter's count line. The full filter row, the eight-column table with select/tier/expand,
the run-policy disclosure and the restored tier vocabulary are all present.

| pair | verdict |
|---|---|
| `sections-1440-light` · `-dark` · `sections-760-light` · `-dark` | **match** — declared divergence class `prototype` for the six chrome lines; `of 26 shown` is a **defect, D-18 (minor)** |

**Home — defect.** Of its 134 absences: 5 prototype, 25 data-bearing by figure, and of the remaining 104 the
overwhelming majority are the dummy's **seeded target names and paths** (`%USERPROFILE%\.gradle\caches`,
`Maven repository`, `Chrome cache`, the protected-path list) — `demo-data`, since my scan found different
targets. The app's 291 app-only lines are its **real** 190 tiles and table rows. What remains after that
filtering is small and named in D-17/D-18.

| pair | app page | verdict |
|---|---|---|
| `home-1440-light` · `-dark` | 1440×2240 | **defect — D-17** (+ D-18 minor) |
| `home-760-light` · `-dark` | 760×3211 | **defect — D-17** (+ D-18 minor) |

All four fail for the same reason: the zero-value hero, rail and button. Everything else on Home now matches —
**7 bands against the dummy's 7**, the treemap with real labelled tiles, the ladder with per-group targets and
a total, the four need-a-person cards, the assurance bleed band, the sparkline (`0 B`, `52 seconds ago · 1
sections · scan`, `Open the report`), the admin band, the leaves-this-machine disclosure, and all four
declarations.

**Run — defect, and the pair is not like-for-like.** The dummy's default `run.html` is the **idle** state
(`Ready to run`, `not started`); my app was in the **finished** state after a dry run. So `Ready to run` and
`not started` appearing as absent is my state mismatch, not a gap. Two structures are genuinely absent, and
that holds **in both app states** — round 3 measured the same absence with Run idle:

| absent from the app | dummy line |
|---|---|
| the live-tiles band | `What is going` + `Tiles leave as each section finishes` |
| the provenance disclosure | `Where these numbers come from` / `Details` / *"The progress you see is reported by the cleanup engine itself as it works…"* / `windowsweep --all --yes --json --developer` |

`PER SECTION` **is** present. `##windowsweep` lines correctly do not appear in the log pane — Rust routes them
to `clean:progress` — and the real log renders (247 lines in `.logview`).

| pair | verdict |
|---|---|
| `run-1440-light` · `-dark` · `run-760-light` · `-dark` | **defect — D-19** |

## R4.6 — new defects

### D-17 · Home's hero, rail footer and `Reclaim` button read `0 B` / `1 sections` · **web layer** · 🔴 high
Measured against the engine's own scan: 63,720,437,751 bytes across 10 sections and 665 targets. The map and
ladder are correct; these three are not. The primary action reads `Reclaim 0 B` above a ladder saying
39.3 GB. Selectors: `.hero-num` and its scope line, the rail's `RECLAIMABLE` footer, and the primary
`Reclaim …` button. Dummy: `RECLAIMABLE NOW / 29.73 GB / measured 4 minutes ago across 28 targets in 8
sections · re-scan`, `Reclaim 29.7 GB`.

### D-18 · Four small copy and structure gaps, undeclared · **web layer** · minor
| gap | dummy | app |
|---|---|---|
| the hero's timestamp and re-scan link | `measured 4 minutes ago across 28 targets in 8 sections · re-scan` | `across 665 targets in 1 sections` — no `measured … ago`, no `· re-scan` |
| the developer band's figure and slider | `On – keeping anything used in the last 100 days` + `HELD BACK RIGHT NOW` + `IDLE WINDOW` + `Lower it to include more caches.` | `On. Toolchain caches are offered.` + the idle-gate sentence only |
| the Sections filter count | `of 26 shown` | absent |
| the status bar's log path | `engine 1.1.0` · `app 0.1.0-design` · `%USERPROFILE%\.windowsweep\logs` · `storage: localStorage` | `engine 1.1.0` only (`app …-design` and `storage:` are `prototype`; the **log path is not**) |

### D-19 · Run lacks the live-tiles band and the provenance disclosure · **web layer**
As tabulated in R4.5. Confirmed absent in both the idle and the finished state.

## R4.7 — 🔴 Can GATE 4 close on all eleven screens?

**No. It closes on nine. Two remain open, and one of those is a single defect away.**

| | screens | state |
|---|---|---|
| **closes** | Consent, Elevation, Picker, History, Report, Account (clean) · Splash (D-13) · Settings (D-8, D-9) · **Sections (D-18 minor)** | 9 |
| 🔴 **cannot close** | **Home — D-17**, **Run — D-19** | 2 |

**Home is otherwise finished.** All twelve bands are there — eight built and four declared — the treemap
renders real data under the same label rule as the dummy, the four declarations are visible and correctly
worded, and the words match once demo-data is set aside. It fails on **one** defect: three surfaces reporting
zero while two others on the same screen report 39.3 GB. Fix D-17 and Home closes.

**Run needs the live-tiles band and the provenance disclosure**, or a declaration for each in the app's own
UI — the pattern R4.2 shows the project already does well.

**Open after round 4:** D-8, D-9 (Settings) · D-13 (Splash copy) · **D-17** (Home, high) · **D-18** (minor,
Home + Sections + status bar) · **D-19** (Run). **Closed:** D-1 … D-7, D-10, D-11, D-12, **D-14, D-15, D-16**.

---

# ROUND 3 — 2026-09-07, 16:16 build · Home judged for the first time

**Build:** same path, rebuilt **16:16:32**, engine tree 39 files. **D-12 is closed**: `engine.rs` now carries
`strip_verbatim_prefix()` handling both `\\?\` and `\\?\UNC\`, and the catalogue loads.

**The premise, measured before anything was judged:** Sections renders **26 rows, ids 0-25**; Home shows no
engine error; the status bar reads `engine 1.1.0`; the rail reads `Sections 26`.

## R3.1 — the rewritten zone table

Above, in place, with both rounds' numbers and the retired instrument explained. **8 zones missing.**

## R3.2 — D-14 · Home implements 4 of the dummy's 12 bands, and none of the 8 gaps is declared · **web layer**

Corroborated from two independent directions, which is what makes it a defect rather than a data artefact:

1. **Rendered:** the eight bands above are absent from a *measured*, catalogue-loaded Home.
2. **Source:** `src/screens/Home.tsx` calls 19 `t('home.*')` keys, covering only the reclaim readout, the
   safe-run list, developer mode, the scan buttons, the assurance prose, the privacy ledger and the engine
   error. There is **no treemap component anywhere** — `src/components/` holds `Icon.tsx`, `Shell.tsx`,
   `ThemePanel.tsx` and nothing else; `grep` for `treemap|ReclaimMap` hits only `dev-engine.ts` and
   `shell.css`. `Home.tsx` contains **zero** occurrences of `sparkline`, `schedule`, `protected`,
   `needsPerson`, `need a person` or `admin`.

**So these are unimplemented, not empty.** The eight:

| missing band | the dummy line it contradicts | note |
|---|---|---|
| **the Reclaim Map** | inventory §3 zone 3, `[data-ws-map]`, *"the signature element"* | the single largest gap; it is also why `<svg><text>` is 0 |
| the drives band | zone 4, `[data-ws-drives]` | C:/D:/E: rails with free space |
| the capacity ring | zone 4, `[data-ws-ring]`, *"3.1% OF ALL DISKS"* | — |
| these need a person | zone 7, `[data-ws-needs]` — four cards, sections 17/18/19/23 | the picker's own entry point |
| protected-path chips | zone 9, `[data-ws-protected]`, *"How that is enforced"* | — |
| the last eight runs | zone 10, `[data-ws-spark]`, *"THE LAST EIGHT RUNS"* | history exists but is unrendered here |
| schedule | zone 11, beside the sparkline | — |
| sections needing admin | zone 12, *"Six sections need Windows to ask your permission first."* | — |

🔴 **None carries a `pending-wave` note on Home**, unlike the Settings *Scanning* and *Notifications* tabs,
which declare themselves correctly. §10 requires anything the app declines to ship to be declared with a
reason. **Proposed fix:** implement, or declare each on Home in the app's own UI — and amend the dummy first
if any is being dropped for good (§10a).

Two smaller divergences on bands that *are* present:

- The dummy's zone 5 is a **ladder** headed `A SAFE RUN, STEP BY STEP` with per-group totals, bars and
  *"Total a safe run would free"*. The app renders a flat **list** headed `A SAFE RUN TOUCHES THESE`.
  Different heading, different shape. **Part of D-14.**
- At 1440 the app's right-hand column holds only `DEVELOPER MODE`, leaving roughly half the band empty; the
  dummy fills it with the drives rails and the ladder. A consequence of the eight, not a separate finding.

## R3.3 — Home as a parity pair: the four verdicts

Captured in **one measured state** — scan first, then the mode switched by writing the same two attributes
the app's own single apply path writes (`data-theme`, `data-appearance`) **without a reload**. 🔴 Declared,
because `capture-app.mjs` sets the mode by reloading, and a reload discards the zustand store and with it the
scan — those captures read `not measured` and would have been compared against the dummy's measured Home.
The pre-paint path is verified separately by round 1's axis probe.

| pair | app page | verdict |
|---|---|---|
| `home-1440-light` | 1440×1401 | **defect — D-14** (web layer) |
| `home-1440-dark` | 1440×1401 | **defect — D-14** |
| `home-760-light` | 760×1665 | **defect — D-14** |
| `home-760-dark` | 760×1665 | **defect — D-14** |

All four fail for the same reason and no other: the eight missing bands. What is present matches — the title
bar and its version chip, the rail with `Sections 26`, the reclaim readout with its button trio, the
decorative sweep, developer mode with its exact sentences, the bleed assurance band verbatim, the disclosure
row and the status bar. **Words compared as text, not layout:** 296 dummy text nodes against 68 in the app,
182 dummy sentences absent, 23 app-only. Of the 182, the large majority are the eight missing bands' content
and the dummy's demo tile data (`build · 8.8 GB`, `Gradle caches 6.2 GB · 240d`, …), which is `demo-data`;
five are the dummy's own prototype chrome (`standard user`, `design dummy · demo data`, `Prototype`,
`Contents`, `Components`).

Pairs at `desktop/design/gate4/home-{1440,760}-{light,dark}-{dummy,app}.png`; round 2's are kept as
`-round2`.

## R3.4 — Home's consent ledger: **PASS**

The missing third of R2.5, now measurable. Both sides read with every `<details>` opened:

| | dummy | app |
|---|---|---|
| the four destinations named | **4/4** — Google Analytics 4, Amplitude, Microsoft Clarity, Sentry | **4/4** |
| each with an adjacent `on` badge | **4/4** | **4/4** |
| the `Never sent` paragraph | present | present |

The app's line is *"Never sent: a file path, a folder name, a drive label, your user name, your machine name,
or the contents of anything. **A run summary is a count and a number of bytes.**"* — one sentence longer than
the dummy's Home ledger, and that sentence **is** in the dummy on the Consent screen, so it is consistent
copy rather than invention. **Verdict: match.** With R2.5's Consent screen and Settings Privacy tab, all
three notice surfaces are now verified.

## R3.5 — Sections and Run re-judged · and what round 2 actually saw

🔴 **Round 2 judged both against an EMPTY catalogue, and the record says so:** its saved measurement holds
`Sections tbody rows: 0`, `Home rail sections: 0`, `engine-error state: true`. Neither was a parity
judgement.

**Sections — round 3, against real data (26 rows).** Dummy 125 text nodes, app **83**; **28** dummy
sentences absent (round 2: 80), 8 app-only. Five of the 28 are the dummy's prototype chrome. The real gaps:

| absent from the app | what it is |
|---|---|
| `Show`, `All 26`, `Needs a person`, `Deep`, `Select`, `Tier`, `Expand` | the dummy's filter chips and column controls |
| `rebuilds`, `optin`, `deep`, `config`, `interactive` | the raw tier vocabulary — the app substitutes `Everything`, `Needs administrator`, `You pick` |
| `What the four run policies mean` + `Details` + *"runs on its own."* / *"Opt-in only runs if you name it."* / *"needs an extra confirmation on top."* | the four-run-policy disclosure |
| `reclaimable across every section` | the header readout |

**Verdict: defect — D-15** (web layer): the 26-row catalogue, its ids, keys, titles and the column headings
are all correct and match; the **filter/show controls and the four-run-policy disclosure are absent, and the
tier vocabulary is substituted without the dummy being amended.**

**Run — round 3, after a dry run through the UI.** 🔴 The full flow now works end to end in the app:
`Home → Dry-run first` auto-navigates to `#/run`, which reads **`FINISHED` / `A dry-run would reclaim
310.0 MB.` / `This was a dry-run. Run the same thing without it to reclaim the space.`**, with the engine's
own log rendered — **247 lines, 235 monospace nodes**, in `.logview`. The rail updates to `310.0 MB across
11 sections`, and **`#/report` renders 11 rows** with the same heading. That closes round 2's outstanding
"prove the UI flow" item.

- `##windowsweep` lines in the log pane: **0, and correctly so.** The Rust side routes any line starting
  `##windowsweep ` to the `clean:progress` channel and everything else to `clean:log`, so the progress lines
  drive UI state rather than being printed. The per-section outcomes do appear (`10 temp  dry-run  207.6 MB`).
- 🔴 But the dummy's **`Per section`** band (`run.html:59`) and its live tiles (`What is going`, *"Tiles leave
  as each section finishes"*) are **absent** — the progress arrives and has nowhere to render. Also absent:
  `Start the safe run` / `Cancel`, `not started`, and `Drives after the run`.

**Verdict: defect — D-16** (web layer): the run executes and reports correctly; the dummy's per-section
progress surface and run controls are not implemented.

## R3.6 — What was left closed, and why

Per instruction: the nine screens round 2 closed on their own merits were **not** re-judged — Consent
(match), Elevation (match), Splash (D-13 only), Picker · History · Report · Account (declared divergences),
and the closed defects D-1…D-11. Two notes so nothing is silently carried:

- **Report** is now populated with a real dry run (11 rows) and is therefore *newly judgeable*; it was closed
  in round 2 as a `demo-data` declared divergence and is **left closed** as instructed.
- One thing observed in passing and **not** a defect: boot went to `#/consent` although the stored record read
  `answered: true`. The record shape changed with the notice rewrite — `consent.ts` now exports
  `NOTICE_STORAGE_KEY` with `{ seen, seenAt, collected }`, and `Splash.tsx:141` routes on `readNotice().seen`.
  My record was round 1's old `{ …, answered }` shape, which has no `seen`, so the notice was shown once.
  Dismissing it wrote `{"seen":true,"seenAt":"2026-09-07T12:15:37.602Z","collected":3}` and routed to `/`.
  **A real user upgrading will see the notice once more, which is defensible given the notice is new** — a
  migration note, not a defect.

## R3.7 — Can GATE 4 close?

**No — on three of the eleven screens. It can close on eight.**

| | screens | state |
|---|---|---|
| **can close** | Consent, Elevation, Picker, History, Report, Account, Splash*, Settings* | 6 clean + 2 with a single named open defect each (*Splash: D-13; Settings: D-8, D-9) |
| 🔴 **cannot close** | **Home (D-14), Sections (D-15), Run (D-16)** | the three catalogue-driven screens; each has unimplemented dummy content, none of it declared |

The blocking issue is no longer infrastructural — the engine, the bridge, the catalogue and the dry-run flow
all work. **What remains is content parity: eight Home bands, the Sections filter row and policy disclosure,
and the Run per-section surface.** Every one is web-layer work against an approved dummy, and every one must
either ship or be declared on the screen with a reason.

**Open defects after round 3:** D-8, D-9 (Settings), D-13 (Splash copy), **D-14** (Home), **D-15**
(Sections), **D-16** (Run). Closed: D-1 … D-7, D-10, D-11, D-12.

---

# ROUND 2 — 2026-09-07, 15:40 build

**Build under test:** the same path, **rebuilt and reinstalled at 15:40:28**. Engine tree now **39 files** —
`bin/` 1, `lib/` 8, `modules/` 26 and **4 at the root** (`LICENSE`, `VERSION`, `windowsweep.ps1` and
**`package.json`**, the file npm ships in every tarball regardless of the `files` array, which is why a
files-driven copy omitted it and the bundled self-test scored 150 instead of 151).

⚠️ **A live-editing skew applies to every word comparison in this round, and it is measured, not assumed.**
The installed build is frozen at **15:40**. `consent.html` and `src/i18n/locales/en.json` were both edited at
**15:52:11** while this pass was running. So a difference between the dummy page and the app window may be
source drift already fixed, and each finding below states which.

## R2.1 — The headline: `run_clean` now reaches PowerShell, and the engine still produces nothing

**D-1 and D-2 are genuinely closed, proved from the running app:**

| invocation | result |
|---|---|
| `{ request: { runId: … } }` — what the web layer sends | **`ok: true`, exit 0** |
| `{ request: { run_id: … } }` — snake_case | **rejected: `missing field 'runId'`** |
| `args: ['--list','--json']` | **no longer refused by the allowlist** |

So the boundary is fixed and the pair moves together. But `stdout` is **0 bytes** and Home still reads
`The engine did not answer.` — now with a better message: `` `--list --json` produced no catalogue line ``.

🔴 **The cause is D-12 below, which round 1 measured in full and which I reported inside flow 3's narrative
instead of giving it a number. That is why it was not picked up.** A finding without its own number reads as
commentary. It is numbered now.

### D-12 · Tauri hands PowerShell a `\\?\` verbatim path, so no library loads · **Tauri shell** · 🔴 blocking

`script_path()` returns `app.path().resolve("windowsweep", BaseDirectory::Resource)`, which on Windows is a
**verbatim (`\\?\`) path**. It is passed to `powershell.exe -File`, so `$MyInvocation.MyCommand.Path` is
verbatim, `$Script:WS_ROOT` becomes verbatim, and `windowsweep.ps1:33` —
`. (Join-Path $Script:WS_ROOT "lib\$lib.ps1")` — **throws for all eight libraries**, because a verbatim path
has no PSDrive. Nothing loads, nothing prints, and **`run_clean` returns exit 0**.

**Measured through the app's own `clean:log` channel, this round:** 187 stderr lines · **23** carrying a
`\\?\` path · **33** naming `Join-Path` · **9** saying `the value of argument "drive" is null` · **0**
`##windowsweep` progress lines. Identical signature to round 1.

**The decisive pair — same engine, same args, one difference:**

| script path passed to `powershell -File` | stdout |
|---|---|
| `\\?\C:\Users\PC\AppData\Local\windowsweep\windowsweep\windowsweep.ps1` | **0 bytes** |
| `C:\Users\PC\AppData\Local\windowsweep\windowsweep\windowsweep.ps1` | **4,397 bytes** — `windowsweep` v1.1.0, **26 sections, ids 0-25** |

**Proposed fix — in the shell, not the engine.** The engine is frozen at 1.1.0 and works correctly when given
an ordinary path; the shell is what introduces the prefix. Strip it in `script_path()` before returning —
`dunce::simplified(&script).to_path_buf()`, or strip a literal leading `\\?\` from the string form. 🔴 A
regression test should assert the returned path **does not start with `\\?\`**, because this defect is
invisible to every gate: the path is valid, the file exists, `exists()` is true, and the command returns
success.

⚠️ **And `exit_code 0` on a run that produced no report is a second, separable problem** —
`engine.ts` treats it as "the run happened, only its summary was unreadable", so a total failure presents as
a success. Worth closing alongside D-12.

## R2.2 — 🔴 The sweep numbers, with their scope in the number

You asked for the node and SVG counts beside every result, and for the count to rise well above 1,188 with
SVG text present. **It did not.**

| | round 1 | **round 2** | dummy Home, for scale |
|---|---|---|---|
| combinations measured | 44 | **44** | — |
| **text nodes measured** | 1,188 | **1,194** (+6) | — |
| **SVG text nodes** | **0** | **0** | **46** |
| horizontal overflow | 0 | **0** | — |
| text below 12px | 0 | **0** | — |
| contrast failures (WCAG AA, size- and weight-aware) | 0 | **0** | — |
| focusable inside a hidden container | 0 | **0** | — |
| `vite-error-overlay` | 0 | **0** | — |
| runtime exceptions | 0 | **0** | — |

**So the headline is exactly the one you named: something is still not painting.** 1,194 of a possible
~10,684, and zero SVG text against the dummy's 46, is the empty-state chrome again. The treemap, the capacity
ring, the section table, the report table and the candidate list have still never been measured for contrast
or type in the packaged app. **These six zeroes are not a clean bill of health; they are a clean bill of
health for one twelfth of the product.**

**Both gates watched failing again, on two DIFFERENT screens from round 1 so the locator's screen name is
proved too, each plant verified applied first:**

| plant | proof it applied | result |
|---|---|---|
| **A — contrast**, inline `#c9cfc2` on the **Consent** lede | computed colour `oklch(0.462 0.015 128)` → `rgb(201, 207, 194)` | 0 → **3** failures, all located `consent-1440-light[lime]`: `1.48:1 (needs 4.5) at 15px` on `"The cleanup engine makes"`, `"zero network calls"`, `"– its own test suite asserts that, and that "` |
| **B — type floor**, a 9px paragraph on **Elevation** | computed `font-size: 9px`, real `1161x14` box | 0 → **1**: `elevation-1440-light[lime]: 9px "planted nine pixel paragraph"` |

Restored by reload, both back to 0, planted node gone. *(Plant A catching three nodes rather than one is
correct — the dummy's lede sets `zero network calls` in bold, so the sentence is three text nodes, and the
sweep sees all three.)*

## R2.3 — Home's zones and the catalogue, counted · **REWRITTEN IN ROUND 3**

> 🔴 **This table was rewritten on 2026-09-07 after D-12 was fixed. Both rounds' numbers are below, and the
> ROUND-2 INSTRUMENT IS RETIRED — see the correction immediately after the table. The round-2 numbers are kept
> because they are what the fixes were made against, not because they were a parity judgement.**

### The retired instrument, and why

Round 2 counted the dummy's `data-ws-*` markers in the app. Measured in round 3:

| | `data-ws-*` attributes | distinct names |
|---|---|---|
| dummy `index.html` | **48** | 22 |
| the app's Home | **0** | 0 |

**The app uses none of them, because a React app renders components rather than reproducing the dummy's JS
mount points.** So a `0` in that column could mean *the zone is missing* or *the app names it differently*,
and those are completely different findings. In round 2 the app rendered nothing at all, so the zeroes were
right by accident; against a working build the same instrument produces **twelve false defects**. It is
replaced below by a match on an **anchored band label** — a whole line, in the dummy's own caps, with every
`<details>` opened first.

🔴 Two false readings the anchored version caught in my own first attempt, both worth keeping: a bare
`has('DRIVES')` matched **section 21's title** *"Disk usage report (largest entries, drives, disk images)"*
inside the safe-run ladder, and `Never sent` read as absent because it sits inside a **collapsed
`<details>`**, which `innerText` omits.

### Round 3 — zones by anchored band label, disclosures opened

State for every row: the catalogue loaded (**Sections 26**, ids 0-25), and a **read-only `--scan`** run
through Home's own button so the app is in a *measured* state — the dummy's Home is measured, and comparing a
measured page against an unmeasured one is the same error as round 2's empty catalogue.

| zone | dummy | app R2 (retired marker) | **app R3 (anchored label)** |
|---|---|---|---|
| window chrome (`.titlebar`) | yes | 1 | **present** — wordmark + `1.1.0` chip + Appearance + window buttons |
| the reclaim readout (`RECLAIMABLE NOW`) | yes | 0 | **present** — `0 B`, `across 665 targets in 1 sections`, and the button trio |
| **the Reclaim Map** | yes | 0 | 🔴 **MISSING** |
| the drives band | yes | 0 | 🔴 **MISSING** |
| the capacity ring (`of all disks`) | yes | 0 | 🔴 **MISSING** |
| the safe-run ladder | yes | 0 | **present** — as `A SAFE RUN TOUCHES THESE`, 11 sections listed |
| developer mode | yes | n/a | **present** — toggle, `On. Toolchain caches are offered.`, the idle-gate sentence |
| these need a person | yes | 0 | 🔴 **MISSING** |
| the chokepoint assurance prose | yes | n/a | **present** — the bleed band, verbatim |
| protected-path chips (`How that is enforced`) | yes | 0 | 🔴 **MISSING** |
| the last eight runs / sparkline | yes | 0 | 🔴 **MISSING** |
| schedule | yes | 0 | 🔴 **MISSING** |
| sections needing admin | yes | n/a | 🔴 **MISSING** |
| what leaves this machine | yes | 0 | **present** — a disclosure, `What leaves this machine, and what never does.` |
| the status bar (`.statusbar`) | yes | 1 | **present** — `engine 1.1.0` |

**Anchored count: dummy shows 12 · the app shows 4 · 8 MISSING.** Adding the two rows the anchored table
does not label (chrome, status bar) and the assurance prose, the app renders **7 of the dummy's 15 measured
surfaces**.

| | round 2 | **round 3** |
|---|---|---|
| content bands (`.band`) | 1 | **4** (dummy 7) |
| `innerText` length | 323 | **1,465** (dummy 2,666) |
| `<svg>` elements | 14 | **15** (dummy 23) |
| **`<svg><text>` nodes** | **0** | **0** (dummy 46) |
| Sections `tbody tr` rows | **0** | **26** (ids 0-25) |
| rail readout | `across 0 sections` | **`Sections 26`**, footer `310.0 MB across 11 sections` |

**The SVG-text count is still 0 in round 3, and it is no longer D-12's fault** — it is D-14 below. The
treemap and the capacity ring are the two surfaces that carry `<svg><text>`, and neither exists in the app.

## R2.4 — The dry run (dry-run ONLY; no second real cleanup was performed)

`run_clean` **does** reach PowerShell now — proved by the 187 stderr lines that came back over the app's own
`clean:log` channel. The UI flow Home → Dry run → Run → Report is still unreachable, so the run was performed
through the shell's exact spawn (`WINDOWSWEEP_LAUNCHER=desktop`, `--json --no-color --reports-dir --logs-dir`)
with the prefix stripped — i.e. the app's pipeline with D-12 removed.

| assertion | value |
|---|---|
| `dry_run` | **true** |
| `elevated` | **false** |
| `developer` | true |
| `freed_bytes` | **0** (it is a dry run) |
| `estimated_bytes` | **260,396,982** |
| sections | `[0,1,2,3,5,6,7,8,9,10,21]` — the safe batch |
| `refusals` | **`[]`** |
| `##windowsweep` progress lines | **22** |

**The report file's own contents** (`…\com.aoneahsan.windowsweep\runs\2026-09-07-r2-dryrun\report-2026-09-07_154832-18448.json`):
`schema_version 1` · `meta.dry_run **True**` · `meta.elevated False` · `meta.launcher **desktop**` ·
`meta.developer_mode True` · `totals {"total_reclaimed_bytes": 0, "total_estimated_bytes": 260396982,
"steps_run": 11, "steps_skipped": 0}` · 11 steps, all `dry-run` · **0 refused**.

⚠️ Note the estimate fell from this morning's **3,935,340,633** to **260,396,982** — independent corroboration
that the one authorised real run genuinely freed the space it reported.

## R2.5 — The consent notice against the amended dummy

| check | result |
|---|---|
| Consent: visible switches | **0** |
| Consent: buttons | **exactly one — `Continue`** |
| Consent: `Never sent` present | **yes**, full line: *"Never sent: a file path, a folder name, a drive label, your user name, your machine name, or the contents of anything. A run summary is a count and a number of bytes."* |
| Settings → Privacy: tab reachable | yes |
| Settings → Privacy: visible switches | **0** |
| Settings → Privacy: `Never sent` present | **yes** |
| Settings → Privacy: badges | `Google Analytics 4 · on`, `Amplitude · on`, `Microsoft Clarity · on`, `Sentry · on`, `refused` — matching `page-settings.js:227,230-232` |
| Home's ledger | 🔴 **cannot be judged — blocked by D-12.** Home renders 1 band, so `[data-ws-consent]` never mounted and `Never sent` is absent because the whole ledger is absent |
| The notice does not reappear once dismissed | **PASS** — the record from round 1 is still on disk (`answered:true`), and boot goes `/splash` → Home with no notice |
| The notice is reachable on a genuine first run | 🔴 **not re-tested this round** — see R2.8 |

🔴 **The switch count of zero is not a pattern that failed to match.** The sweep counts `[role=switch]`,
`.switch` **and** `input[type=checkbox]`, then excludes the two the dummy legitimately keeps (developer mode,
weekly schedule) **by name** and reports anything else as unexpected. Round 1's lesson applied: a `revok`
pattern does not match `revocable`.

**D-5, D-6 and D-7 are closed**, verified in the running app:

| defect | round-2 state |
|---|---|
| D-5 boot never reached `/splash` | **closed** — boot route is `#/splash` |
| D-6 Consent/Splash had no chrome | **closed** — both carry the title bar and the `Appearance` control; the dummy's collapsed-shell bug is fixed by `shell-bare` (`shared.css:105`), and both pages now render full-width (the dummy's own capture dropped from 326 KB to 124 KB because the bands stop mid-window no longer) |
| D-7 Run said `The run finished.` | **closed** — the never-run state now reads `Nothing has run yet.` |
| D-4 two equal-weight buttons | **moot** — one `Continue`, by owner decision |
| D-11 title bar 0×0 | **closed** — rebuilt on `wincontrols`/`wc`; no 0×0 control and no invisible tab stop found this round |
| D-10 wrong runs folder | **closed** — corrected on both sides; the report file landed under `…\com.aoneahsan.windowsweep\runs\` as stated |
| D-3 reworded copy | **mostly closed** — see D-13 for the one that is not |

## R2.6 — Two live copy divergences that survive

### D-13 · The Splash skipped-note copy says the opposite of the dummy · **web layer**

| source | mtime | sentence |
|---|---|---|
| `splash.html:46` (the dummy) | 15:36 | *"If the update check cannot reach the network it is **skipped and says so** - reclaiming space has never needed it."* |
| `src/i18n/locales/en.json:144` | **15:52** (edited later, still says this) | *"…it is **skipped silently** - reclaiming space has never needed it."* |

**"says so" and "silently" are opposite promises**, and the newer file carries the wrong one. The app's
*behaviour* is right — `Splash.tsx` renders a skipped note with a `Try again` control — so the copy
contradicts both the dummy and the code. **Proposed fix:** restore the dummy's wording in `en.json`.

### Not a defect — resolved by mtime, and worth recording as method

The app window renders *"There is no switch for this and no setting to find. **windowsweep is free, and this
is how it** gets better…"* while the dummy renders *"…**This is how windowsweep** gets better…"*. A pricing
claim on a consent notice would be a serious finding. It is not one: **`consent.html` and `en.json` were both
edited at 15:52:11 and both now read the dummy's version**, and `grep "is free"` finds **zero** hits in either.
The installed build is frozen at 15:40, so what I photographed is a **stale artefact, not a live defect** —
the same class as round 1's D-11. Rebuild closes it. *Checking file mtimes before writing this up is what kept
it out of the defect list.*

## R2.7 — Network, once more

**117 events this session: `tauri.localhost` 91, `ipc.localhost` 20, `data:` URIs 6. External hosts: NONE.**
Zero WebSockets. `Network` was enabled before the page was allowed to run, so boot requests could not be
missed.

🔴 **Stated plainly, as asked: this proves the keys are absent, not that a consent gate works — there is no
gate any more.** The evidence for absence is direct: **there is no `.env` file in `desktop/` at all**, so
`VITE_GA4_MEASUREMENT_ID`, `VITE_AMPLITUDE_API_KEY`, `VITE_CLARITY_PROJECT_ID`, `VITE_SENTRY_DSN` and
`VITE_SUPABASE_URL` are all unset and `configuredFeatures().telemetry` is false by construction. When a key
is added, this measurement must be retaken — it will no longer be evidence of anything.

## R2.8 — The update gate: still unreachable

| observation | value |
|---|---|
| `Checking for a newer build` shown | **no** |
| a skipped note shown | **no** |
| a `Try again` control | **no** |
| visible buttons on Splash | **none** |
| **updater IPC commands invoked, whole session** | **NONE** (`run_clean` ×17, `plugin:event|listen` ×3, nothing else) |

**Blocked by D-12, not by the gate.** `Splash.tsx`'s effect returns early on `engineError || !catalogue`, so
`checkForUpdate()` is never called — corroborated independently by the IPC log, which contains no updater
command at all. The offline path therefore could not be exercised, and **blocking the endpoint would have
proved nothing**: the updater's request is made by Rust, so it never appears in the webview's network log and
CDP cannot block it. Retest after D-12.

Splash also shows `Reading the catalogue - 26 sections` **and** the engine-error note at the same time — a
contradiction on one screen, and a `live-number` the dummy also hardcodes (`page-splash.js:9`). §10's carve-out
says a quantity the product can count comes from the product, inside the dummy's own sentence.

## R2.9 — Round 2 verdict table

| screen | round 1 | **round 2** | why |
|---|---|---|---|
| Splash | defect (D-5, D-6) | **defect** — D-13; content blocked by D-12 | chrome and routing fixed; the skipped-note copy is inverted and the gate is unreachable |
| Consent | defect (D-3, D-4, D-6) | **match** | see the judged pair below |
| Home | defect, blocked | **blocked by D-12** | 2/10 marked zones, 1 band, 0 SVG text |
| Run | defect (D-7) | **blocked by D-12** | idle wording fixed; nothing else can render |
| Sections | blocked | **blocked by D-12** | 0 table rows |
| Settings | defect (D-8, D-9) | **defect** — D-8, D-9 still open | Privacy tab now correct; General still omits four preferences undeclared, About still has no ecosystem roster |
| Elevation | match | **match** (unchanged) | D-10 closed |
| Picker · History · Report | declared divergence | **unchanged** | still `pending-wave` / `demo-data` |
| Account | declared divergence | **unchanged** | sign-in dormant by owner decision |

### The judged pair — Consent at 1440, light (`consent-1440-light-{dummy,app}.png`)

Judged by eye, side by side: a near-pixel match. Heading, the lede **with its bold `zero network calls` and
its en-dash restored**, the `Never sent` panel, the disclosure row, the bleed footer with *"Nothing above needs
an answer."* and one `Continue`, the title bar and its `Appearance` control, and the window buttons — all
present and identical in position. Three differences, all accounted for:

| difference | class |
|---|---|
| dummy version chip `1.1.0`; app shows **`-`** | `live-number`, **blocked by D-12** — `engineVersion` is never populated |
| dummy status bar `engine 1.1.0 · first run - what the window sends`; app shows `engine -` | same |
| dummy badges `standard user`, `design dummy · demo data`, `storage: localStorage` | `prototype`, correctly omitted |

**Closed this round: D-1, D-2, D-3 (mostly), D-4 (moot), D-5, D-6, D-7, D-10, D-11 — nine of the eleven.**
**Still open: D-8, D-9 (parity/copy) and D-12, D-13 (new numbers for old findings).**
🔴 **D-12 alone blocks four of the eleven screens, the whole contrast and type sweep over dense surfaces, the
UI dry-run flow, Home's ledger, and the update gate.**

---

---

# ROUND 1 — 2026-09-07, 13:46 build (history; kept because the fixes were made against it)

## 1. The headline — the installed build cannot run its engine

**The engine tree is fine and the resource-bundling fix holds.** 38 files in `bin/`, `lib/`, `modules/` plus
three at the root; run directly it reports **26 sections, version 1.1.0**. The Rust side spawns it correctly
(`exit 0`, run folder created). The break is entirely at the **IPC boundary**, and there are two stacked
defects (§4, D-1 and D-2). The consequence for GATE 4 is that every data-bearing screen renders its
empty or error state, so **Home shows 0 of its 14 specified zones**:

| | dummy | app |
|---|---|---|
| Home, visible text nodes at 1440 | **286** | **19** |
| Home, zones present | 14 of 14 | **0 of 14** |
| Rail readout | `29.7 GB · across 8 sections` | `- · across 0 sections` |
| Home `<h1>` | `RECLAIMABLE NOW / 29.73 GB` | **`The engine did not answer.`** |

The app states the cause on its own Home screen, verbatim:

```
invalid args `request` for command `run_clean`: missing field `run_id`
```

---

## 2. The 44-pair matrix

Verdict classes: **match** · **declared divergence** (one of the four permitted classes — `prototype`,
`demo-data`, `live-number`, `pending-wave` — with a reason) · **defect** (with the owning writer).

🔴 Where a screen's content is produced by the engine, the row records **blocked by D-1/D-2** rather than
inventing a parity judgement about content that never rendered.

### Splash

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — web layer (D-5, D-6); plus declared `pending-wave` for the update band |

Wordmark, progress bar, step line and the disclosure `<details>` all match. Divergences: the app's Splash
renders **no title bar at all**, so the dummy's version chip and its `Appearance settings` control are both
absent (D-6). The update band and `Checking for a newer build…` are the in-flight update gate — **declared
`pending-wave`, owned by another writer, not counted as a defect here**. The step line freezes at step 0
because the catalogue never arrives, so `/splash` is a dead end in this build (a consequence of D-1, not a
separate defect — and nothing routes to it on boot anyway).

### Consent

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — web layer (D-3, D-4, D-6) |

The closest screen to parity: structure, the four provider cards, `Turn all on` / `Turn all off`, the
disclosure and the two footer buttons are all in place, and the decline path works (§6, flow 1). Three
divergences, all in the **words and the treatment** the dummy owns — see D-3 and D-4. No title bar, so no
theme control (D-6).

### Home

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — Tauri shell + web layer, **blocked by D-1/D-2** |

0 of 14 zones. Nothing about the reclaim readout, the Reclaim Map, the drive rails, the safe-run ladder,
developer mode, "these need a person", the chokepoint, the protected-path chips, the sparkline or the
schedule could be compared, because none of it rendered. The rail, the title bar and the status bar are
present and structurally faithful.

### Run

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — web layer (D-7); content blocked by D-1/D-2 |

The dummy's never-run state reads `Ready to run` with `0 of 0 sections · not started`. The app's reads
**`Finished` / `The run finished.`** while its own log pane on the same screen says **`Nothing has run
yet.`** — a self-contradiction, and approved copy replaced. See D-7.

### Sections

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **blocked by D-1/D-2** |

Headings, the lede, the tier legend and the column headers (`Everything`, `Needs administrator`, `You pick`,
`What it touches`) are present and match. All 26 rows are absent because the catalogue is empty.

### Picker

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **declared divergence — `pending-wave`**; content blocked by D-1/D-2 |

The app shows `Nothing has been offered yet.` and its Remove button is **disabled with the gap stated on the
screen**, because the `--select-file` writer command does not exist in this build. That is §10a's
`pending-wave` exemption used correctly — declared in the app's own UI, not hidden. **Not a defect.**

### History

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **declared divergence — `demo-data`** |

The dummy's rows are seeded demo data. The app's empty state is the honest rendering for a machine on which
the app has never completed a run. Headings, the filter row and the "summary only" cloud label match.

### Report

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **declared divergence — `demo-data`**; a real report blocked by D-1/D-2 |

`No run to report yet.` The schema-1 rendering could not be compared. A real report **was** produced by the
same engine outside the app (§6, flows 3 and 4) and is schema-correct.

### Settings

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — web layer (D-8, D-9); parts correctly declared |

All five tabs exist and are reachable on both sides. Measured per tab (the whole-page comparison was
inconclusive because only the selected tab is visible — resolved in `logs/41-parity-settings-tabs.txt`):

| tab | dummy texts | app texts | verdict |
|---|---|---|---|
| General | 48 | 54 | **defect** — four preferences silently missing, ten theme axes added (D-8) |
| Scanning | 54 | 23 | **declared `pending-wave`** — the app says so on the tab |
| Notifications | 40 | 23 | **declared `pending-wave`** — the app says so on the tab |
| Privacy | 44 | 38 | **defect** — provider descriptions reworded (D-3) |
| About | 47 | 25 | **defect** — the whole ecosystem roster is absent, undeclared (D-9) |

### Account

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **declared divergence — owner decision** |

Sign-in and sync are compiled and dormant: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are
deliberately empty until the Google provider is enabled, and `configuredFeatures()` makes the screen say so.
Correct behaviour, verified — not a defect.

### Elevation

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **match on the words** — but see D-10, a false claim in BOTH artefacts; count blocked by D-1/D-2 |

The app carries the dummy's copy faithfully, including the step list and the SmartScreen note. The heading
reads `0 sections need Windows to ask your permission.` against the dummy's `Six sections…` — a `live-number`
derived from the empty catalogue. **D-10 is the more serious finding: the sentence both artefacts share names
a folder that does not exist.**

---

## 3. Summary of verdicts

| verdict | pairs |
|---|---|
| match (structure and words, within a blocked screen) | 4 (Elevation) |
| declared divergence — permitted class, stated with a reason | 16 (Picker, History, Report, Account) |
| blocked by D-1/D-2 — no honest parity judgement possible | 4 (Sections) |
| **defect** | **20** (Splash, Consent, Home, Run, Settings) |

---

## 4. Defects — each with its owner. NOT fixed here; reported for the owning writer

### D-1 · `RunRequest` field naming — every engine call fails · **Tauri shell** · 🔴 blocking

`src-tauri/src/engine.rs:59-64` declares the payload with `#[derive(Debug, Deserialize)]` and a field
`pub run_id: String`, with **no `#[serde(rename_all = "camelCase")]`**. The web layer sends `runId`
(`src/lib/engine.ts:74` and `:118`). Serde deserialises struct fields by their literal Rust names, so every
`run_clean` invocation is refused before the engine is reached:

```
invalid args `request` for command `run_clean`: missing field `run_id`
```

**Why nothing caught it:** Tauri's `#[tauri::command]` macro *does* convert camelCase → snake_case for bare
command **parameters**, which is why `read_run_report(run_id, file_name)` works when called with
`{ runId, fileName }`, and why `app_version` returns `1.1.0` correctly. The conversion does **not** reach
inside a serde struct. Typecheck, clippy, `cargo test` and `tauri build` are all blind to it.

**Proved decisively:** the identical command with one key renamed —
```
{ request: { runId:  … } }  ->  invalid args … missing field `run_id`
{ request: { run_id: … } }  ->  reaches validate(), then D-2
```
**Proposed fix (one line, and the one consistent with Tauri's own convention for arguments):** add
`#[serde(rename_all = "camelCase")]` above `pub struct RunRequest`. The response structs `RunFinished` and
`LogLine` stay snake_case, which is correct — Tauri does not convert the response direction, and the TS
interfaces already read `run_id` / `exit_code`. *(Alternative: change the two TS call sites to send `run_id`.
One line versus three, and the struct fix leaves the boundary matching Tauri's documented behaviour.)*

### D-2 · `--list` is not in the Rust argument allowlist · **Tauri shell** · 🔴 blocking

`engine.rs:25-41` (`ALLOWED_FLAGS`) and `:44-57` (`ALLOWED_VALUE_FLAGS`) do not contain `--list`.
`loadCatalogue()` sends `['--list', '--json']`, so even with D-1 fixed the boot catalogue read is refused:

```
refusing an argument this window is not allowed to pass: --list
```

**Measured**, not inferred — this is the error the corrected-key probe returned. **Proposed fix:** add
`"--list"` to `ALLOWED_FLAGS`. It is read-only and is the only way the app can honour its own rule that no
section list is hard-coded anywhere.

🔴 **D-1 and D-2 are stacked. Fixing either alone leaves the app non-functional.**

### D-3 · Approved copy silently reworded · **web layer**

The dummy owns the words. Measured live from both rendered pages:

| dummy (authority) | app |
|---|---|
| `…nothing **nags** you again…` | `…nothing **asks** you again…` |
| `The same events, kept longer so trends over months are visible.` | `The same events, sent to a second destination so a funnel can be read across releases.` |
| `Product analytics **would receive** which screens you opened and which buttons you pressed.` | `Which screens you opened and which buttons you pressed.` |
| `…**would receive** a recording of this window with all text masked.` | `A recording of this window with every piece of text masked.` |
| `…**would receive** a stack trace with paths stripped.` | `A stack trace when something breaks, with file paths stripped out.` |

Two typographic divergences are visible in the same pair: the dummy's lede sets **`zero network calls`** in
bold and uses an en-dash, where the app's is plain weight with a hyphen.

The one-word `nags` → `asks` change is exactly the §10 failure mode: *"the app's version reads better"* is
not a reason. **Proposed fix:** decide which wording ships, write it into the dummy first (§10a), then match
the app. The app-only Privacy line *"No destination is configured in this build, so nothing could be sent
even with a switch on."* is good honesty and should be **added to the dummy** rather than dropped.

### D-4 · The two consent buttons diverge from the dummy, and the divergence lives only in a code comment · **web layer**

`consent.html:69-70` gives the decline `class="btn"` and the accept `class="btn btn-primary"`. The app makes
**both** `btn btn-primary` (`Consent.tsx:149-152`), with a source comment explaining why: *"a first-class
decline cannot be the quieter of two buttons."*

Measured in the app — both `oklch(0.82 0.185 128)`, weight 600, 15px, so they genuinely carry equal weight.
The reasoning is sound and it honours the dummy's own prose (*"Declining is a first-class answer"*). But
**§10a requires the decision to be written into the DUMMY, not into a comment**: as things stand the owner
reviewing the dummy sees one primary and one secondary, and the pair does not match. Two equally loud
primaries also leaves the screen with no default action, which is his call to make.
**Proposed fix:** amend `consent.html`, then the log records why the *dummy* changed.

### D-5 · Nothing routes to `/splash` on boot · **web layer** *(adjacent to the in-flight update gate)*

Measured: on a genuinely fresh first run the app opens on `#/` (Home). `Splash.tsx` is the only place that
navigates to `/consent`, so **the consent screen is never presented on first run** — the person is taken
straight to Home with nothing answered. Reported because it changes a first-run guarantee; **the fix belongs
with the Splash/update-gate work already in flight** and is not counted separately.

### D-6 · Consent and Splash render an EMPTY title bar and no status bar · **web layer**

Measured on both sides, and plain in the pair `consent-1440-light-{dummy,app}.png`. The dummy's title bar
carries the `windowsweep` wordmark, the `1.1.0` version chip and an `Appearance settings` control; its status
bar carries `engine 1.1.0 · first run - nothing is on yet` and the storage mode. Consent and Splash in the app
render `<header className="titlebar" data-tauri-drag-region />` **with no children at all** — an empty dark
strip — and **no status bar**.

So the app has the theme control on 9 of 11 routes and **0 on `#/consent` and `#/splash`**, because those
render without the Shell. `rules/frontend-ui-standards.md` §11 and the theming skill both require the header
entry point on **every route at every width**. *(The dummy's `standard user` and `design dummy · demo data`
badges are `prototype` class and correctly omitted.)*
**Proposed fix:** give Consent and Splash the real title bar and status bar; that restores the wordmark, the
version chip and the theme button in one change.

### D-7 · The Run screen's never-run state says the run finished · **web layer**

`run.eyebrowDone` = `Finished` and `run.titleUnknown` = `The run finished.` are rendered whenever
`phase !== 'running'` and there is no summary — i.e. **before anything has ever run** — while
`run.logEmpty` = `Nothing has run yet.` sits on the same screen. The dummy's state is `Ready to run` /
`0 of 0 sections · not started` (`run.html:27,32-34`). **Proposed fix:** add an explicit idle branch using
the dummy's words; keep `titleUnknown` for the genuine "ran but the summary was unreadable" case it was
written for.

### D-8 · Four Settings preferences are missing, undeclared, and the theme axes were put in their place · **web layer**

The dummy's General tab carries developer mode **plus** `Idle window` (`Maps to --days 100.`),
`Temporary files` (`--temp-days 3`), `Large file threshold` (`--large-mb 500`) and `Weekly schedule`
(`--install-task`). The app's General tab carries developer mode **and all ten appearance axes**, and none of
the four preferences. The Scanning and Notifications tabs correctly declare themselves as not yet carried;
**General does not** — the omission is silent, which §10 forbids.

Separately, putting the ten axes on a settings tab creates a **second** theme surface the dummy does not
specify (the dummy has one header panel). §11 asks for one control, one panel.
**Proposed fix:** restore the four preferences or declare them `pending-wave` in the app's own UI, and decide
where the axes live — then write that decision into the dummy.

### D-9 · The ecosystem roster is absent from About, undeclared · **web layer**

`CLICK-DUMMY-INVENTORY.md` §5 specifies **More from the same developer** with a two-layer self-exclusion and
a `wsPromoAudit()` proof harness. The dummy's About tab lists `linux-cleanup`, `macleanup`, `native-update`
and `strata-storage` with their one-line descriptions and the *"not an advertising network"* sentence. The
app's About tab has **none of it**, and no `pending-wave` note. Also absent: the `Version` block
(`What is installed right now.`, `up to date`, `Desktop … · engine 1.1.0 · MIT`).
**Proposed fix:** ship the roster with both filter layers, or declare the omission on the tab.

### D-10 · Both artefacts name a runs folder that does not exist · **web layer + the dummy** 🔴

| source | claim |
|---|---|
| `elevation.html:59` (the dummy) | `%LOCALAPPDATA%\windowsweep-desktop\runs\`, one JSON each. |
| `src/i18n/locales/en.json:223` (the app, faithful to the dummy) | identical |
| **measured, where the shell actually writes** | **`%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\`** |

`run_dir()` uses `app.path().app_local_data_dir()`, which is the bundle **identifier**
(`com.aoneahsan.windowsweep`), not the product name. `%LOCALAPPDATA%\windowsweep-desktop` **does not exist on
this machine**. Parity is a *match* — the app carries the dummy's words correctly — and the shared sentence is
false. This is the "an approved artefact holds its claim until something falsifies it, and nothing re-reads
it" class; the wrong path has already propagated into the session handoff notes.
**Proposed fix:** correct the dummy first, then the catalogue string. Best is to render the path the shell
reports rather than restating it.

### D-11 · Every title-bar button renders 0×0 and cannot be clicked · **web layer** — 🔴 **already fixed in source; present in the installed artefact**

Measured in the running app at 1440: `Appearance`, `Minimise`, `Maximise` and `Close` all have computed
`width: 0px; height: 0px`, and `document.elementFromPoint` at each button's own centre returns
`HEADER.titlebar`, never the button. A programmatic `.click()` *does* open the theme panel, so the handlers
are correct and the fault is purely geometric. On a frameless window (`decorations: false`) that means
**there is no way to close, minimise or maximise the window with the mouse**.

Corroborated from a second direction: the keyboard sweep found **36 tab stops landing on something invisible
— exactly these four buttons on each of the 9 shell routes** (§7).

**The cause and the current state:** the installed build renders `class="tb-btn"` / `tb-btn tb-close`.
`Shell.tsx:70-80` in current source records that this exact bug was found and fixed — those class names do
not exist in `shell.css`, and the real vocabulary is `tb-title`, `wincontrols`, `wc`, `wc-close`. The
rebuilt `dist/` (14:33) contains `wincontrols`, `wc-close`, `tb-title` and **zero** `tb-btn`; the installed
exe was built at **13:46**, before `Shell.tsx` changed at **14:31**.
**Action: none in source — rebuild and reinstall before release.** ⚠️ A raw string grep of the exe is
**not** evidence either way: it returned 0 for all seven needles *including the controls*, because the
frontend is compressed inside the binary. The live DOM is the authoritative instrument.

---

## 5. The dummy-parity probe (§10) — 10 of 10 axes match, and the gate was watched failing

The dummy's defaults are **parsed out of `app.js`'s own `AXES` table** at run time — nothing is restated,
because a restated copy is what drifts.

| axis | attribute | dummy default (parsed) | app live `<html>` | verdict |
|---|---|---|---|---|
| theme | `data-theme` | dark | dark | match |
| palette | `data-palette` | lime | lime | match |
| radius | `data-radius` | medium | medium | match |
| density | `data-density` | comfortable | comfortable | match |
| typeScale | `data-type-scale` | medium | medium | match |
| font | `data-font` | grotesque | grotesque | match |
| surfaceStyle | `data-surface-style` | solid | solid | match |
| cursor | `data-cursor` | custom | custom | match |
| motion | `data-motion` | system | system | match |
| sound | `data-sound` | off | off | match |

**declared 10 · written to `<html>` 10 · absent 0 · present-but-different 0.** The full attribute set is
**byte-identical at 1440, 760 and 390**, so the axis probe is genuinely width-independent rather than assumed
to be. `data-appearance=dark` and `style="color-scheme: dark"` are both written pre-paint.

**Two plants, on the two different arms, each verified applied before its result was read:**

| plant | applied? | result |
|---|---|---|
| **parse arm** — a mutated **copy** of `app.js` with `density` default `comfortable`→`spacious` (the real dummy untouched, byte-identical after) | yes: needle matched, copy differs, `def: 'spacious'` present | **CAUGHT** — `density: dummy=spacious app=comfortable` |
| **live arm** — `data-radius` removed from the running `<html>` | yes: `had=true was=medium nowHas=false` | **CAUGHT** — `radius (data-radius)` reported declared-but-not-written |

Restored by reload: `data-radius=medium`, 14 attributes.

⚠️ One noted divergence, **not** a defect: the dummy's prefs key parses as `prefs` under its own
`windowsweep.dummy.v1` namespace; the app's is `windowsweep:prefs`. Prototype-class, by design.

---

## 6. The seven flows

Every flow ran as the **local Windows user `PC`, unelevated, with no account signed in** — there is no admin
role in this product and sign-in is dormant, so no flow could have been run as an admin.

| # | flow | result |
|---|---|---|
| 1 | First run → consent → **decline** → Home; relaunch keeps the answer | **PASS with a finding.** State was genuinely fresh (`%LOCALAPPDATA%\com.aoneahsan.windowsweep` did not exist; `localStorage` empty — nothing was cleared to fake it). 🔴 The consent screen is **not** shown on a fresh boot (D-5); reached at `#/consent` it works. Decline (`Continue with everything off`) → `#/` with `{"ga4":false,"amplitude":false,"clarity":false,"sentry":false,"answered":true,…}`. After a real quit and relaunch the record is still there, read from the physical key. Both buttons measured equal weight (D-4). |
| 2 | Consent proven by the **network**, not a flag | **PASS.** `Network` was enabled before the page was allowed to run (`Target.setAutoAttach` + `waitForDebuggerOnStart`), so boot requests could not be missed. Session 1: 31 events. Session 2: 89 events. Hosts observed, in total: `tauri.localhost` (80), `ipc.localhost` (34), one `data:` URI ×6. **Zero requests to any analytics, telemetry, Sentry or Supabase host at any point**, and zero WebSockets. |
| 3 | Dry run of the safe batch → Report; report records `dry_run: true` | **PART FAIL (D-1/D-2), engine half PASS.** Through the app: 214 error lines, no summary, no report file, **`exit_code 0`** (see the note below). Re-run through the app's exact spawn with a non-verbatim path: `dry_run:true`, `elevated:false`, `developer:true`, `estimated_bytes: 3,935,340,633`, sections `[0,1,2,3,5,6,7,8,9,10,21]` all `dry-run`, `refusals: []`, **22 `##windowsweep` progress lines**. Report file `meta.dry_run = True`, `meta.elevated = False`, `meta.launcher = desktop`. |
| 4 | 🔴 **ONE REAL RUN**, owner-authorised | **PASS (engine path).** `--all --yes --developer`, unelevated, no interactive section, no admin section, `--elevate` never passed. `freed_bytes` **3,924,712,402** (3.655 GiB) in **156 s**; 11 sections all `ran`; **`refusals: []`**; **no new crash bundle** under `~\.windowsweep\feedback` (only the pre-existing `debug-bundle-2026-09-03_015000.zip`). C: free **before 5,843,419,136** (5.442 GiB) → **after 9,849,925,632** (9.173 GiB), **delta +4,006,506,496** (+3.731 GiB); the report's own disk block agrees (5,840,351,232 → 9,848,250,368). The delta exceeds `freed_bytes` by 81.8 MB, which is other processes writing to C: across a 2m37s window. |
| 5 | The picker, against a created fixture | **UI blocked by design; engine half PASS.** `gate4-fixture\oldproj\` with `package.json` + `node_modules\left-pad\index.js`, all mtimes 2026-01-01. Discovery offered exactly one candidate: `…\oldproj\node_modules`, 209 B, **idle 249d**. `--select-file matched 1 of 1 candidate(s)` → `[scripted selection] … - yes` → `removed 209 B`. **Gone** (4 dirs → 2, 5 files → 3) and **nothing else touched**: `keep-me.txt`, `package.json`, `src\index.js` all byte-identical by SHA-256. The **picker UI** cannot do this: its Remove button is deliberately disabled and the gap is stated on screen, because no Rust command writes the select file. |
| 6 | Settings round-trip across a quit | **PASS.** Three axes changed through the real controls and one preference toggled, then a real quit and relaunch. Read back from the **physical** keys: `windowsweep:prefs = {"v":{"radius":"large","density":"compact","typeScale":"large"}}` and `windowsweep:developer = {"v":true}`; the live `<html>` shows `data-radius=large data-density=compact data-type-scale=large` (written pre-paint), and the switch renders `aria-checked=true` with its own caption `On. Toolchain caches are offered.` |
| 7 | Keyboard and motion | **PASS on both, with D-11 corroborated.** 159 tab stops across 11 screens using real `Input.dispatchKeyEvent` (only a genuine key press makes `:focus-visible` match): **0 stops without a visible indicator**; **36 stops landing on something invisible — all of them the four 0×0 title-bar buttons on the 9 shell routes**. Motion, six cells, all correct: axis `system` + OS no-pref → `--mo 1`; `system` + OS reduce → `.001`; `reduced` + either → `.001`; **`full` + OS reduce → `1`**, so the explicit axis correctly overrides the OS. |

🔴 **A note on flow 3's `exit_code 0`.** When the engine fails to load its own libraries, `run_clean` still
returns **exit 0** with an empty stdout, so the app would read it as "the run happened, only its summary was
unreadable" — which is what `engine.ts:120-125` is written to assume. Worth a look alongside D-1/D-2:
a run that produced no report should not present as a successful one.

🔴 **What flows 3-5 do and do not prove.** The app's own button path cannot start a run in this build, so the
three lines of TypeScript that assemble the IPC payload were bypassed and **everything after them was
exercised for real** — the allowlist, the spawn, the bundled engine, the `clean:log` and `clean:progress`
channels, the report file on disk. The UI's progress and report rendering is **not** verified, because it
cannot be reached.

---

## 7. The measurable sweeps

44 combinations (11 screens × 2 widths × light and dark), **1,188 text nodes**.

| check | result |
|---|---|
| horizontal overflow on the body | **0** combinations |
| user-visible text below 12px | **0** |
| contrast, WCAG AA, size- and weight-aware | **0 failures** |
| focusable controls inside a hidden container | **0** |
| `vite-error-overlay` (asked for by name, shadow root) | **0** |
| runtime exceptions | **0** |

🔴 **This clean result answers a much narrower question than it looks like.** The previous recorded pass
measured **10,684** text nodes; this one measured **1,188**, and **0 of them are SVG text**. Because of
D-1/D-2 the treemap, the section table, the report table, the candidate list and the capacity ring never
painted — and those dense, colour-heavy surfaces are exactly where every previously recorded contrast and
type defect lived. **The SVG count of 0 is itself the proof that the signature element never rendered.**
Re-run this sweep once D-1/D-2 are fixed; today it clears only the empty-state chrome.

**Both gates watched failing, on two different plants, each verified applied first:**

| plant | verification that it applied | result |
|---|---|---|
| **A — contrast:** inline `#c9cfc2` on the Sections lede (light / lime / 1440) | computed colour changed `oklch(0.462 0.015 128)` → `rgb(201, 207, 194)` | 0 → 1 failure: **`1.48:1 (needs 4.5) at 17.1px "The catalogue is a frozen public contract - "`** |
| **B — type floor:** a 9px paragraph appended on Settings (light / lime / 1440) | computed `font-size: 9px` with a real `1203x14` box | 0 → 1: **`9px "planted nine pixel paragraph"`** |

Restored by reload and re-measured: Sections contrast failures back to 0, Settings tiny-text back to 0, the
planted node gone.

**Traps the instrument is built against**, all four previously recorded on this codebase: colours normalised
through a canvas and compared as **pixels** (Chrome returns `oklch()`, so an `rgba()` regex counts zero and
passes vacuously) · SVG text read from **`fill`**, not `color` · `vite-error-overlay` requested **by name**
because a text walk cannot enter a shadow root · the probe canvas cleared to **transparent** between
measurements.

---

## 8. Build gates on `dist/`

Measured against `dist/` as rebuilt at **14:33** — ⚠️ it is a moving target while another writer works; two
JS chunks appeared between two consecutive listings.

| needle | count | reading |
|---|---|---|
| `__wsTestAuth` / `__lwTestAuth` / `__hfTestAuth` | 0 / 0 / 0 | no DEV auth hook exists in this project or its output |
| `dev-engine`, `isDevFallback`, `not the real engine` | 0, 0, 0 | the DEV-only stand-in module is genuinely out of the bundle |
| `devRun` | **2** | 🔴 a **false alarm** — see below |
| controls `run_clean` / `windowsweep` / `tauri` | 2 / 24 / 23 | the grep works; a zero above is not vacuous |
| `*.map` files, `sourceMappingURL` | 0, 0 | source maps off, as required |

🔴 **`devRun` is a name-only false positive, and it is worth recording** because the project's own gate is
written around this string. The shipped gate collapsed exactly as intended —
`async function Rp(){return null}` — so the two `devRun` hits are property accesses on a value that is always
`null`, and the module's four distinctive strings are all absent. **The authoritative check is the module's
own strings plus the collapsed gate, not the identifier.**

---

## 9. What could not be tested, and why

| item | reason |
|---|---|
| Home's 14 zones, the Reclaim Map, the section table, the report table, the candidate list, the capacity ring | **blocked by D-1/D-2** — never rendered |
| The Run screen's live progress, and the Report screen against a real run | same; the channels themselves were verified on the wire (22 progress lines) |
| The picker's UI selection path | **blocked by design** — declared `pending-wave` in the app's own UI |
| Sign-in, sync, account deletion | **dormant by owner decision** — no Supabase keys, Google provider not enabled |
| Telemetry actually reaching a destination | no keys in this build; the correct observation is the **zero** requests recorded in flow 2 |
| The Splash update gate | **owned by another writer, in flight**; landed in `src/` at 14:31, after the 13:46 build |
| Elevated / admin sections (12, 13), and every interactive section other than 17 | outside the authorised scope; `--elevate` never passed |
| 390px | below `minWidth: 760`; the axis-attribute probe was taken there and is width-independent |
| The contrast and type sweep over dense data surfaces | see §7 — re-run after D-1/D-2 |

---

## 10. Reproducing this

Both browsers were driven over the DevTools Protocol from Node 24's built-in `WebSocket`. Headless Chrome is
broken on this machine (GPU crash), so the dummy side ran **headed**.

- Automation Chrome: `$CHROME_WS_BROWSER` (Chrome for Testing 151.0.7922.77) on
  `--user-data-dir=…\ahsan-automation\profiles\ahsan-automation`, port 9222. **Profile asserted before the
  first navigation** and read from the OS process table, because `Browser.getBrowserCommandLine` refuses
  without `--enable-automation` and a check that cannot read anything reads exactly like a check that found
  nothing wrong. The owner's own Chrome (`C:\Program Files\Google\Chrome`) was running throughout and was
  never touched.
- The app: launched with `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333`.
- Scripts: `D:\work\windowsweep-root\gate4-evidence\tools\` (28 files) · logs: `…\logs\` (68 files).
- 🔴 **A full-page capture of these screens is not the document.** Both the dummy and the app are app-shell
  layouts where `document.scrollHeight === innerHeight` and `main.content` scrolls. A naive full-page
  screenshot silently returns **only the fold** — measured on the dummy Home at 1440, where `main.content`
  held **3205px** inside an **832px** box. The captures here grow the viewport until the shell scroller has
  nothing left, re-measuring each time.
- The dummy's review toolbar (`demo.js`, which says in its own header that it is *"not part of the
  specification"*) is hidden before every capture — 2 nodes per page, declared rather than silent.

### The six pairs beside this file

`home-1440-{light,dark}-{dummy,app}.png` · `consent-1440-{light,dark}-{dummy,app}.png` ·
`settings-1440-{light,dark}-{dummy,app}.png` — all ≤300 KB.

Four needed a **0.52** downscale to fit. ⚠️ Measured, because it is not obvious: re-encoding at 0.88 made the
PNG **larger** than the original (625 KB vs 395 KB) — bicubic resampling introduces colours that defeat PNG
filtering — and 0.76 (515 KB) and 0.64 (417 KB) were also larger. 0.52 (749×1174, 289 KB) is the first scale
that fits. **The full-resolution pair for every one of the 44 is in `gate4-evidence\`.**

---

**Bottom line.** The shell, the bundled engine, the theme system, consent, persistence, keyboard access and
motion are all in good order and independently verified. The product is nevertheless **not usable in this
installed build**: two one-line defects at the IPC boundary (D-1, D-2) stop the engine being reachable at
all, and until they are fixed the majority of GATE 4 cannot be judged. D-11 is already fixed in source and
needs only a rebuild. D-3, D-4, D-8, D-9 and D-10 are parity and copy work; **D-10 is a false statement
shipping in both the dummy and the app.**


---

# APPENDED 2026-09-13 by the web layer (A-DESK-2) - declarations for round 8

Appended, not a verdict: round 8 judges. This records what the web layer DECLARES under the four exemption
classes, so the round can check each one rather than rediscover it. The dummy amendments made the same day
are logged in `design/README.md` ("what round 8 would otherwise flag").

## A-1 - Declared divergences

| Dummy element | Words | Class | Why, and what the app does instead |
|---|---|---|---|
| `settings.html:64` status-bar note | *settings sync when you are signed in* | `pending-wave` - **TASK-013** | `src/lib/sync.ts` has no caller: nothing in the window syncs yet, so the app withholds a sentence describing behaviour no code performs. The desktop sync wiring must land before `SUPABASE_ENABLED` flips; the words ship with it. The dummy keeps them (it specifies the finished product) |
| `account.html:73` disclosure | *What happens when two machines disagree* (and its body) | `pending-wave` - **TASK-013** | same wave, same reason |
| `account.html` stored-data table, Last seen | *A timestamp, refreshed when this window syncs, …* | **not exempt** | ships verbatim (`account.stored.lastSeen.why`) |
| status bar `app 0.1.0-design` (`seed.js:174`) | *app 0.1.0-design* | `prototype` | the dummy's own build label; the window prints its real version in the title-bar chip (`live-number`) |

## A-2 - Every toast still in the dummy, each with its class

Four toast acknowledgements moved to the control in the dummy (D-28 class; the README table lists them), and
the Picker's Clear with them. What remains:

| Dummy | Words | Class | What the app does |
|---|---|---|---|
| `wire.js:88` tile keep / include, with Undo | *Keeping {name} ({size})* / *Including …* | `pending-wave` | click-to-keep on a tile is declared on Home since 2026-09-07 (`ExcludePaths` reaches only `modules/projects.ps1`) |
| `wire.js:530-532` Scan / Re-scan | *Read-only scan finished. Nothing was deleted.* · *Re-scanning…* | `prototype` | stands in for a scan the dummy cannot run; the app's Scan answers at the control (pending, then done) and the map, hero and freshness line carry the result |
| `wire.js:537` Home dry-run | *Dry-run: {size} across {n} sections. Nothing was deleted.* | `prototype` | the app's dry-run opens the Run screen, whose hero and per-section rows carry the result |
| `wire.js:552` Reclaim, with Undo | *Freed {size}. A real run would have written a report.* | `prototype` | the app's Reclaim opens the Run screen and its finish band; a deletion run has no Undo there (the Recycle Bin is the recycle tier's) |
| `wire.js:584` · `app.js:249` | *That screen is not in this prototype.* · *That screen is in the next batch of this dummy …* | `prototype` | dummy navigation stubs |
| `page-run.js:113` | *Run cancelled. {size} had already been freed.* · *Freed {size}. Report written.* | `prototype` | the Run hero and finish band carry the same result in place |
| `page-run.js:143` | *Nothing in the safe batch to run.* | `prototype` (channel) | the same words inline (`run.nothingToRun`) |
| `page-sections.js:242` Clear, with Undo | *Selection cleared.* | `prototype` | Clear answers in place - every switch off, the bar leaves - as the dummy's Picker Clear now does |
| `page-sections.js:250` | *Dry-run across {n} sections. Nothing was deleted.* | `prototype` | the app opens the Run screen |
| `page-sections.js:258` | *Sections {ids} need you to choose items first. Nothing was run.* | `prototype` (channel) | the same words, verbatim, beside the button as `role="alert"` - the assertive live region the toast stands for |
| `page-picker.js:289` Remove these | *Sent {n} items to the Recycle Bin …* · *This would ask you to confirm {n} permanent deletions first …* | `prototype` | stands in for the run: the app writes the select file and opens the Run screen. A real deletion - never pressed in verification |
| `page-elevation.js:178` | *Windows would show its permission prompt here for …* | `prototype` | stands in for UAC; the app starts the engine's own `--elevate` |
| `page-history.js:154` | *Loaded the next page - twenty at a time …* | `prototype` | narration of pagination; the app's list grows in place |
| `page-report.js:111,115` | *Opens %USERPROFILE%\.windowsweep\reports\… in your …* · *Markdown and HTML come from the engine's own --export …* | `prototype` | the dummy cannot open or export a file |
| `page-consent.js:37` | *Thanks - that is all. Nothing else to set up.* | `prototype` | Continue leaves the notice for Home; the navigation is the acknowledgement |
| `page-splash.js:49,64` | *It will install the next time you close windowsweep.* · *Downloaded and verified. This is a design prototype, so nothing restarts.* | `pending-wave` | the update band, declared `pending-wave` since round 1 |
| `page-account.js:29,60,103` | *Signed in. Your settings will sync from now on.* · *Signed out. …* · *Your account is gone, …* | `pending-wave` | the account surface is dormant until `SUPABASE_ENABLED` (declared on screen since round 1); the sign-in sentence also names sync, TASK-013 |
| `playground.js:152` | *Link copied - it carries the exact dial settings.* | `prototype` | the component gallery, not a product screen |

## A-3 - Closed since round 7 (for the round to confirm, not to exempt)

- **The populated Picker** - header, chips and filter, table, note, file disclosure and selection bar match the
  dummy; the not-asked state (`picker.html?empty=1`) and section 17 with developer mode off are drawn in both.
  The file field reads a dropped or chosen file, matches it like the engine, ticks matches, lists each
  unmatched line, and refuses a file over 256 KB or of another type AT the zone. Proved on the running app
  (dev build, IPC guarded to `--list`, `--scan` and dry-runs) with a real 307,230-byte file, a real `.csv`,
  and a selection file of two real candidates plus two unmatched lines.
- **The four D-28-class toasts** - the dummy answers at the control, as the app does.
- **Rail "Choose" badge** - `live-number`, built: the catalogue's interactive-section count (4).
- **Status-bar notes** on History, Report, Picker and Account - built, the dummy's words.
- **Run rows** - order is the dummy's biggest-first rule (not `demo-data`), followed; membership amended in the
  dummy to the whole safe batch.
- **Schedule state word** - the Settings row no longer prints *Off* beside its switch; the dummy has none there.
- **Admin rail icon** - the dummy now draws the `backend` icon its own `NAV` named; the app unchanged.
- **Held-back count sub-line** - built: *{n} caches used in the last {days} days*, the dummy's words, counted
  from the scan's newest-write stamps in the developer-safe sections.
