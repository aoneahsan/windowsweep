> Round 4 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

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

