> Round 9 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

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

