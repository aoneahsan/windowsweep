> Sections 10-13 of the click dummy inventory · part of [`CLICK-DUMMY-INVENTORY.md`](CLICK-DUMMY-INVENTORY.md), the index.

# Click dummy inventory - GATE 4 rounds one to four

Last Updated: 2026-09-25 · Moved here verbatim from the index under RW-132.

---

## 10. GATE 4 itself — 2026-09-07, against the INSTALLED app

Section 9 recorded a browser pass over the React screens in a development build. This is **GATE 4**: the
screenshot pairs, taken in the app's own WebView2 from the **installed** 1.1.0 build
(`%LOCALAPPDATA%\windowsweep\windowsweep-desktop.exe`, built 13:46), beside the dummy pages over `file://`.

**Full report, with every verdict and every defect:** `desktop/design/gate4/GATE4-REPORT.md`.
Six representative pairs sit beside it; all 88 captures and 68 logs are outside git at
`D:\work\windowsweep-root\gate4-evidence\`.

### What was taken

**11 screens x {1440, 760} x light and dark = 44 pairs, 88 captures**, lime treatment, all present.
760 rather than 390, because `minWidth` is 760 and a failure at 390 is unactionable — as section 9 already
recorded. The dummy's review toolbar is hidden before each capture (2 nodes, declared).

🔴 **The first 44 captures were wrong and had to be retaken.** Both the dummy and the app are app-shell
layouts: `document.scrollHeight === innerHeight` and `main.content` is what scrolls. A `captureBeyondViewport`
"full page" screenshot therefore returned **only the fold** — measured on the dummy Home at 1440, where
`main.content` held **3205px** of content inside an **832px** box, and every capture came back a uniform
`1440x900`. The instrument now grows the viewport until the shell scroller has nothing left, re-measuring each
time. **A capture that looks complete is not the same as a capture that is complete.**

### The verdict, in one line

| verdict | pairs |
|---|---|
| match | 4 |
| declared divergence (a permitted class, with a reason) | 16 |
| blocked — no honest judgement possible | 4 |
| **defect** | **20** |

🔴 **The installed build cannot run its engine, and that is what dominates the matrix.** The bundled tree is
intact (38 files, 26 sections when run directly) and the Rust side spawns it fine — the break is two stacked
defects at the IPC boundary: `RunRequest` declares `run_id` with no `#[serde(rename_all = "camelCase")]` while
the web layer sends `runId`, and `--list` is missing from the Rust argument allowlist. So **Home renders 0 of
its 14 zones** and shows `The engine did not answer.`; dummy Home has **286** visible text nodes against the
app's **19**.

### The axis parity probe passed, and was watched failing

**10 of 10** axes match, all written to `<html>`, with the dummy's defaults **parsed out of `app.js`'s own
`AXES` table** rather than restated — a restated copy is what drifts. The attribute set is byte-identical at
1440, 760 **and** 390, so its width-independence is measured rather than assumed. Two plants on the two
different arms — a mutated **copy** of `app.js` (`density: comfortable`→`spacious`; the real file byte-identical
afterwards) and `data-radius` removed from the live `<html>` — were each verified applied and each caught.

### Two things this ledger should carry forward

🔴 **A clean sweep can answer a much narrower question than it appears to.** The sweep found 0 overflow, 0
text under 12px, **0 contrast failures** and 0 focusable-while-hidden across all 44 combinations — over
**1,188** text nodes, against section 9's **10,684**, and with **0 SVG text nodes**. The treemap, the section
table, the report table and the capacity ring never painted, and those are precisely where every previously
recorded contrast and type defect lived. The SVG count of 0 *is* the proof the signature element was absent.
Re-run the sweep once the engine bridge is fixed; today it clears only the empty-state chrome.

🔴 **The dummy is carrying a false claim, and the app inherited it faithfully.** `elevation.html:59` names
`%LOCALAPPDATA%\windowsweep-desktop\runs\`; the shell actually writes to
`%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\`, because `app_local_data_dir()` uses the bundle
**identifier**, not the product name, and the folder the sentence names **does not exist**. Parity is a
*match* — which is exactly why no parity check could find it. It had already propagated into a session handoff
note. Amend the dummy first (§10a), then the catalogue string.

Also found by comparing the **words** rather than the arrangement: one approved sentence silently reworded
`nags` → `asks`, the Amplitude description replaced, the Run screen's never-run state reading `Finished /
The run finished.` where the dummy says `Ready to run`, the consent buttons' equal-weight decision living
only in a source comment instead of in the dummy, the theme control missing on `consent` and `splash` (the
dummy carries it on both), four Settings preferences silently absent, and the whole **More from the same
developer** roster of §5 missing from About with no `pending-wave` note. Each is itemised in the report.

---

## 11. GATE 4 round two — 2026-09-07, the 15:40 build

Section 10 recorded the first GATE 4 pass against the 13:46 build and its twenty defective pairs. The IPC
boundary was fixed and the app reinstalled; this records the second pass. Full detail, both rounds:
`desktop/design/gate4/GATE4-REPORT.md`. Round-one captures for the six re-judged screens are preserved at
`gate4-evidence\round1\`.

### Nine of eleven defects closed, and the app still cannot reach its engine

`run_clean` now works: the camelCase payload the web layer sends is accepted and snake_case is **rejected**, so
the pair moves together, and `--list` is allowed. Boot goes through `/splash`, Splash and Consent carry the real
chrome, the title-bar buttons are no longer 0x0, Run's never-run state reads correctly, and the runs folder is
named correctly on both sides.

🔴 **But the engine still produces nothing, and the reason was in round one's report as prose rather than as a
numbered defect — which is why it was not picked up.** Tauri's resource resolver returns a **verbatim `\?\`
path**; `windowsweep.ps1:33` does `Join-Path $Script:WS_ROOT "lib\$lib.ps1"`, and **`Join-Path` throws on a
verbatim path because it has no PSDrive**, so none of the eight libraries load, nothing prints, and
`run_clean` returns **exit 0**. Measured through the app's own `clean:log`: 187 stderr lines, 33 naming
`Join-Path`, 0 progress lines. The decisive pair — same engine, same arguments, one difference:

| script path | stdout |
|---|---|
| `\?\C:\…\windowsweep.ps1` | **0 bytes** |
| `C:\…\windowsweep.ps1` | **4,397 bytes** - v1.1.0, **26 sections, ids 0-25** |

**A finding without its own number reads as commentary.** Number every one.

### The lesson for this ledger: put the scope inside the number

| | round 1 | round 2 | dummy Home |
|---|---|---|---|
| text nodes measured across 44 combinations | 1,188 | **1,194** | - |
| **SVG text nodes** | **0** | **0** | **46** |
| overflow / tiny text / contrast / focus-in-hidden | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | - |

Six zeroes again, and they mean the same narrow thing they meant in round one. **Home renders 2 of the ten
marked zones** (`.titlebar` and `.statusbar` - the shell chrome, not content), **1 content band against the
dummy's 7**, `innerText` 323 characters against 2,554, and **0 `<svg><text>` nodes against 46**. The treemap
and the capacity ring have still never been measured in the packaged app. **A clean sweep is only as wide as
what painted, so the node and SVG counts now travel beside every result rather than being argued afterwards.**

### Two traps met while measuring, both worth keeping

🔴 **`requestAnimationFrame` is throttled to zero in a headed Chrome window that is occluded**, so a settle
helper awaiting two frames hangs forever the moment another window takes focus - and the failure looks exactly
like a wedged renderer. It cost two `Runtime.evaluate` timeouts before the cause was found. Race rAF against a
timer.

🔴 **Check file mtimes before writing up a word divergence.** The app window rendered *"windowsweep is free,
and this is how it gets better…"* where the dummy rendered *"This is how windowsweep gets better…"*. A pricing
claim on a consent notice would be a serious finding. It was not one: `consent.html` and `en.json` were both
edited at **15:52:11** and now agree, while the installed build is frozen at **15:40** - a stale artefact, not
a live defect. `grep "is free"` finds zero hits in either file.

### One live copy divergence found by comparing the words

`splash.html:46` promises the update check *"is **skipped and says so**"*; `en.json:144`, edited **later**, says
*"is **skipped silently**"*. Opposite promises, and the app's behaviour (a skipped note with `Try again`)
matches the dummy rather than its own string. The amended consent notice itself is a **match**: one `Continue`,
zero switches, and the `Never sent` panel present on Consent and on the Settings privacy tab with its four `on`
badges and `refused`. Home's ledger could not be judged - the band never mounted.

---

## 12. GATE 4 round three — 2026-09-07, the 16:16 build: Home judged at last

D-12 (the verbatim `\?\` path) is closed, the catalogue loads, and the screens rounds 1 and 2 could not judge
are judgeable. Full detail: `desktop/design/gate4/GATE4-REPORT.md`, where §R2.3's table is **rewritten in
place** with both rounds' numbers. Round-two captures preserved at `gate4-evidence\round2\`.

### The premise, and it holds

Sections renders **26 rows, ids 0-25**; the rail reads **Sections 26**; the status bar reads `engine 1.1.0`;
no engine error. The full flow works in the app for the first time: **Home → Dry-run first → `#/run`
(`A dry-run would reclaim 310.0 MB.`, 247 log lines) → `#/report` (11 rows)**.

### 🔴 The instrument this ledger recommended was measuring the wrong key set

§10's zone table counted the dummy's `data-ws-*` markers in the app. Measured in round three:

| | `data-ws-*` attributes |
|---|---|
| dummy `index.html` | **48** across 22 distinct names |
| the app's Home | **0** |

**A React app renders components; it has no reason to reproduce the dummy's JS mount points.** So a `0`
could mean *the zone is missing* or *the app names it differently* - different findings entirely. While the
app was broken the zeroes were right by accident; against a working build the same table yields **twelve
false defects**. It is replaced by a match on an **anchored band label** - a whole line, in the dummy's own
caps, with every `<details>` opened first.

Two false readings that version caught in its own first attempt, both worth keeping:

- 🔴 A bare `has('DRIVES')` matched **section 21's title** - *"Disk usage report (largest entries, drives,
  disk images)"* - inside the safe-run list, and reported a drives band that does not exist. **Anchor a label
  to its own line; a substring search over a page that lists 26 section titles will find almost any word.**
- 🔴 `Never sent` read as absent because it sits inside a **collapsed `<details>`**, which `innerText` omits.
  Open every disclosure before reading, or approved copy reads as missing when it is merely closed.

And a third, about state rather than matching: the capture helper sets the appearance mode by writing the
prefs key and **reloading**, which is right for testing pre-paint and wrong for this - a reload discards the
store and with it the scan, so Home photographed as `not measured` and would have been compared against the
dummy's measured Home. **Both halves of a pair must be in the same state**, which is the same error as
round two's empty catalogue wearing different clothes.

### What the honest count is

**Anchored: the dummy shows 12 bands, the app shows 4.** Eight are missing, and the absence is corroborated
from source rather than inferred: `Home.tsx` calls 19 `t('home.*')` keys and **no treemap component exists
anywhere** (`src/components/` is `Icon`, `Shell`, `ThemePanel`), with zero occurrences of `sparkline`,
`schedule`, `protected`, `needsPerson` or `admin`. So they are unimplemented, not dataless.

Missing: **the Reclaim Map** (§3 zone 3, the declared *signature element*), the drives band, the capacity
ring, these-need-a-person, the protected-path chips, the last-eight-runs sparkline, schedule, and
sections-needing-admin. 🔴 **None is declared on Home**, unlike the Settings *Scanning* and *Notifications*
tabs, which declare themselves correctly. That is also why `<svg><text>` is still **0 against the dummy's
46** - the treemap and the ring are the two surfaces that carry it.

**Home's consent ledger passes**: 4/4 destinations with an adjacent `on` badge and the `Never sent`
paragraph, on both sides. With the Consent screen and the Settings Privacy tab, all three notice surfaces
are verified.

**GATE 4 can close on eight of the eleven screens. It cannot close on Home, Sections or Run** - the three
catalogue-driven ones, each carrying unimplemented dummy content that is not declared. The blocker is no
longer infrastructural; it is content parity against this dummy.

---

## 13. GATE 4 round four — 2026-09-07, the 18:45 build: nine of eleven close

D-14, D-15 and D-16 are implemented. Home now carries all twelve bands - **eight built and four declared** -
Sections has its filter row, eight-column table and run-policy disclosure, and Run has its `Per section` band.
Full detail: `desktop/design/gate4/GATE4-REPORT.md` §R4. Round-three captures at `gate4-evidence\round3\`.

### A declared gap is a PASS, and this build declares four of them properly

Checked as **words, not absence** - each expected sentence **parsed from the app's own `en.json`** rather than
restated in the probe, then located in the rendered DOM with a real box. All four render: the drive rails and
capacity ring, the weekly schedule, idle shading and the Idle column, and clicking a tile to keep it. **And
the map legend is trimmed to exactly what they cover** - `Click one to keep it.`, `faded = used recently,
solid = long idle`, `nothing excluded`, `OF ALL DISKS`, `in use` and `Idle (days)` are each gone with a
declaration on screen explaining it. That is the pattern to repeat: an undeclared gap and a declared one look
identical in a screenshot until you read the sentence.

### 🔴 The number that decides the round: one scan, five surfaces, two answers

The engine's own `--scan --developer` through the app's IPC reported **665 targets, 63,720,437,751 bytes,
10 sections**. Home's **map** (`avd · 20.0 GB`, `pkg · 14.7 GB`, `build · 11.7 GB`) and its **ladder**
(`Total a safe run would free 39.3 GB`) agree with that. Its **hero**, its **rail footer** and its **primary
button** read **`0 B`** and `across 1 sections`, so the screen offers **`Reclaim 0 B`** directly above a
ladder promising 39.3 GB. The `1 sections` is the tell: two aggregations of one scan, and the summary's
`sections[]` is almost certainly being summed where `targets[]` was meant. **A parity check on layout and
words would have passed this**; only reading the numbers against the engine caught it.

### The svg-text count, and why a raw count was the wrong question

Measured **23** on the app against a derived expectation of 44. It is not a defect, and the honest reason is
that the data is not comparable - the one authorised real run freed 3.92 GB from the safe batch, so the map
draws many near-zero tiles instead of eight fat groups:

| | dummy | app |
|---|---|---|
| map box | 1159x**1421** | 1159x**394** |
| tiles | 73 | **190** |
| tiles clearing the label guard (`w>54 && h>42`) | 31 | 14 |
| labels drawn | 54 | 23 |
| **labels / tiles clearing the guard** | **1.74** | **1.64** |

🔴 **The ratio is the data-independent check.** ~1.7 text nodes per labelled tile on both sides means the same
size guard and the same two-line label. **When a count depends on data you do not control, measure the RULE
instead** - and say plainly that the exact figure could not be confirmed rather than reporting the near-miss
as either a pass or a defect.

### The mistake this round repeated, from a different direction

Round three recorded that a reload discards the store and the scan, and fixed the capture path. **The word
comparison then made the same error through a different script**: `parity-words.mjs` also sets the mode by
reloading, so its first run compared an **unmeasured app against a measured dummy** - visible only because
`not measured` and `Scan first` turned up in the app-only list. **A lesson recorded against one script does
not protect the others**; the fix belongs in every path that changes state, or in a refusal to compare when
the two sides disagree about being measured. The rerun refuses outright if the app is not measured.

Two smaller corrections worth keeping: on **Sections** both sides show **4 of 6** admin labels, so that is
parity and not an app shortfall - measuring only the app would have produced a false defect. And
`Six sections` versus `6 sections` is §10's countable-quantity carve-out working correctly, the dummy's
sentence with the product's number in it.

### Where the gate stands

**Nine of eleven screens close.** Sections joins the closed set (7 absences, six of them the dummy's own
prototype chrome). **Home and Run remain open** - Home on a single defect, the zero-value hero, rail and
button; Run on the live-tiles band and the provenance disclosure, or a declaration for each.
