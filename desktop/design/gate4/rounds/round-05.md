> Round 5 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

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

