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

> 🔴 **THIS FILE IS THE INDEX; THE ROUND BODIES LIVE IN `rounds/`.** Split on 2026-09-17 (TASK-014): the
> document had reached 2,610 lines against this repository's 500-line rule. Every round moved **verbatim** -
> nothing reworded, nothing dropped, proved line for line by comparing the sorted non-blank lines of the
> original against the sorted non-blank lines of the new files. The blockquote above describes the
> single-file shape this document had when rounds 1 and 2 were written, and is kept as it was written.
>
> A reference of the form `GATE4-REPORT.md §R7.3` still resolves: each round file keeps its own headings
> unchanged, so `§R7.3` is the `## R7.3` heading inside `rounds/round-07.md`. The table below maps each
> round to its file.

## The rounds

| Round | Date | Source under test | Verdict | Body |
|---|---|---|---|---|
| 12 | 2026-09-17 | HEAD `cc3f94d`, desktop 1.2.0 | 🔴 **CLEAN on the product** - D-63, D-64, D-65, D-62, TASK-015 and TASK-016 (2) and (4) all pass, 12 pairs match or carry a declared divergence, zero new app defects. 🔴 **Three findings are against the ROUND'S OWN METHOD**, the first of which matters beyond this round: **a CDP `Fetch.failRequest` guard on `http://ipc.localhost/*` blocks nothing on this build** - Tauri retries the same command over `window.ipc.postMessage` and latches the page onto that wire, so the guard then sees nothing while still reporting itself installed. Fulfil, never fail; and the second wire is guardable only at `window.chrome.webview.postMessage`. **Reclaim was pressed zero times**; three engine runs, all read-only, `total_reclaimed_bytes: 0` on every report | [`rounds/round-12.md`](rounds/round-12.md) |
| 11 | 2026-09-14 | desktop 1.2.0 | 🔴 **No verdict - its outputs were lost, and round 12 supersedes it.** The drivers ran but none of their stdout was saved (`gate4-evidence/round11/` holds 38 drivers and 16 pairs and no output), so the round cannot be read. The two findings written down before the loss are **D-63** and **D-64**; both were fixed in `cbdc32e` and both are judged - and pass - in round 12. Its unguarded 1.8 GB deletion is the reason round 12 leads with its guard | none - the tracker's `knownRisks` carries the incident; superseded by [`rounds/round-12.md`](rounds/round-12.md) |
| 10 | 2026-09-14 | HEAD `7ae4546`, desktop 1.2.0 | NOT CLEAN - D-55 and round 9's four small findings are fixed and D-60 holds on the button and the hero; the same two screens still print a bigger figure as a promise (D-61) | [`rounds/round-10.md`](rounds/round-10.md) |
| 9 | 2026-09-14 | HEAD `8361a48`, desktop 1.2.0 | NOT CLEAN - D-47, D-48 and D-49 are fixed and proved; one new blocker, D-55 (Home's headline figure after a Picker ask) | [`rounds/round-09.md`](rounds/round-09.md) |
| 8 | 2026-09-13 | HEAD `7e78de7`, desktop 1.2.0 | NOT CLEAN - D-23, D-24 and D-25 are fixed on the running app; three new blockers on the Picker's removal path | [`rounds/round-08.md`](rounds/round-08.md) |
| 7 | 2026-09-13 | HEAD `9735c7a`, desktop 1.2.0 | GATE 4 does NOT close - two must-fix divergences (D-23, D-24) | [`rounds/round-07.md`](rounds/round-07.md) |
| 6 | 2026-09-07 | 22:22 build | 🔴 GATE 4 CLOSES ON ALL ELEVEN; two new findings, neither blocking (D-21, D-22) | [`rounds/round-06.md`](rounds/round-06.md) |
| 5 | 2026-09-07 | 19:09 build | Ten of eleven close; D-20 blocks Run | [`rounds/round-05.md`](rounds/round-05.md) |
| 4 | 2026-09-07 | 18:45 build | The gate-closing round; D-17 is the gate-blocker, plus D-18 and D-19 | [`rounds/round-04.md`](rounds/round-04.md) |
| 3 | 2026-09-07 | 16:16 build | Home judged for the first time; D-14 open | [`rounds/round-03.md`](rounds/round-03.md) |
| 2 | 2026-09-07 | 15:40 build | `run_clean` reaches PowerShell and the engine still produces nothing - D-12 blocking, D-13 open | [`rounds/round-02.md`](rounds/round-02.md) |
| 1 | 2026-09-07 | 13:46 build | History, kept because the fixes were made against it: the 44-pair matrix and D-1 .. D-11 | [`rounds/round-01a.md`](rounds/round-01a.md) (§1-§4) · [`rounds/round-01b.md`](rounds/round-01b.md) (§5-§10) |

🔴 **Round 1 is the one round split in two**, because its body is 516 lines on its own. The split is at its
own `## 5.` heading and nothing else about it changed.

The declarations below - **A-1**, **A-2** and **A-3** - are not a round. They were appended by the web layer
on 2026-09-13 and are read against every round from 8 on, so they stay in this file.

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

### A-1 (b) - Known limitations, which are NOT exemptions

A limitation is not one of the four classes: nothing here is waiting for a wave, and no dummy element is
being withheld. It is recorded beside them because a round should be able to check it rather than file it
again.

| What | Why it is true, and why it stays true |
|---|---|
| **History lists only the runs made in THIS window.** A run started by the weekly Scheduled Task, or from a terminal, reports to `%USERPROFILE%\.windowsweep\reports` and never appears in it | The window's History is its own record of what it started (`state/store.ts` -> `addHistory`), not an index of the engine's reports folder. 🔴 **The screen already says so and says it truthfully** - its lede reads *"in this window"* - so nothing on screen over-claims. Building the other reading means reading, parsing and paging a folder this window does not own, whose files another process is writing while it reads; it is a feature, not a fix, and it is **declared rather than built** (product PENDING-TASKS TASK-016 item 1) |

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
| `page-report.js:111` | *Opens %USERPROFILE%\.windowsweep\reports\… in your …* | `prototype` | the dummy cannot open a file |
| `page-report.js:115` | *Markdown and HTML come from the engine's own --export …* | **not exempt, as of 2026-09-17** | **TASK-015 built the export.** These words now ship verbatim as `report.exportDone`, a `role="status"` line beside the button - the dummy's sentence, this app's placement, the trade `ScheduleSwitch` already records. The press runs the engine's own `--export both latest` against the run's folder and reveals the two files it wrote |
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
