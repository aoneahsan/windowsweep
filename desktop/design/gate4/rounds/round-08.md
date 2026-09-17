> Round 8 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

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

