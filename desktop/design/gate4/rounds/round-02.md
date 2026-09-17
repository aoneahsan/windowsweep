> Round 2 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

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

