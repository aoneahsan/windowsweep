# GATE 4 — parity of the INSTALLED desktop app against the approved click dummy

**Date:** 2026-09-07 · **Build under test:** `C:\Users\PC\AppData\Local\windowsweep\windowsweep-desktop.exe`,
version **1.1.0**, built **13:46**, registered under HKCU Uninstall · **Engine:** the bundled tree at
`…\windowsweep\windowsweep\`, **38 files**, verified intact · **WebView2:** Edg/152.0.4191.66 ·
**Treatment:** lime, light and dark · **Widths:** 1440 and 760.

🔴 **760, not 390.** `tauri.conf.json` sets `minWidth: 760`, so the product cannot be narrower and a failure
at 390 is one nobody can act on. The axis-attribute probe was additionally taken at 390 and is
width-independent (proved below), which is the only thing 390 can honestly tell us.

**Pairs:** 11 screens × 2 widths × light and dark = **44 pairs, 88 captures**, all present.
Full resolution: `D:\work\windows-cleanup-root\gate4-evidence\<screen>-<width>-<mode>-{dummy,app}.png`
(outside git, 14.98 MB). Six representative pairs are copied beside this file.

> 🔴 **This document now holds TWO rounds.** Round 2 is below and is current. **Round 1 follows it,
> unchanged**, because its measurements are what the fixes were made against and several of them are still
> the live diagnosis. Round-1 captures for the six re-judged screens are preserved at
> `gate4-evidence\round1\` (48 files).

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
- Scripts: `D:\work\windows-cleanup-root\gate4-evidence\tools\` (28 files) · logs: `…\logs\` (68 files).
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
