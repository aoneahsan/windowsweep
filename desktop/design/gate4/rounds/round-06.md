> Round 6 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

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

