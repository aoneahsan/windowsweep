# windowsweep desktop - the amendment log, part 2 (2026-09-13 latest onwards)

> Continues [`AMENDMENTS.md`](AMENDMENTS.md), which reached this repository's 500-line ceiling. Both were
> moved **verbatim** out of [`README.md`](README.md) on 2026-09-17 (TASK-014). 🔴 **The next amendment goes
> at the bottom of this file**, and a new `AMENDMENTS-3.md` starts when this one would pass 500 lines.

## Amendment - 2026-09-13 (latest): History and Report with data (D-41, D-42, D-44's second half)

Rounds 1-2 closed both screens empty; round 8 judged them with data. Dummy first, then the app. Nothing
below edits the finished product down to what is built; what the window cannot do yet is declared.

### 1. `history.html` + `page-history.js` - History (D-41)

| Was | Now, and why |
|---|---|
| *"Every run this machine has made, and a summary ..."* | *"Every run made in this window, and a summary of runs from your other machines if you are signed in."* The window records the runs it starts; the weekly Scheduled Task it registers and any command-line run report to `%USERPROFILE%\.windowsweep\reports`, which the window does not list. Home already says "in this window" |
| empty row *"windowsweep has not run on this machine yet. ..."* | *"No run has finished in this window yet. A dry-run costs nothing and deletes nothing."* (Home's sentence). A `Dry-runs` filter with none reads *"No dry-runs yet"* / *"A dry-run costs nothing and deletes nothing."*; the heading is an h2 (the page has one h1) |
| *"freed in the last 1 runs"* | *"freed in the last run"* for one |
| Freed per run: a hand-built path normalised min..max | d3 from zero - Home's spark's scale for the same metric (min..max drew a 2.4 GB run as if it freed nothing); real runs only; none: *"No real run has finished in this window yet."* inside the unchanged 900 x 90 frame; one run sits mid-frame |
| relative day by rounded elapsed hours; exact stamp in UTC | local calendar days; the exact stamp in local time, as the report file's name is stamped |
| 6 rows; "Load 20 more" adds 20 and raises a toast | twenty a page; no toast (the rows and the count answer; the count is a polite live region); inert (`aria-disabled` + `data-disabled`) once all are drawn; a chip returns to page one |
| eight seeded runs | + seventeen older (demo-data), so the second page exists |
| - | the `Show` label names the chip group; each open link is described by its row's When; a dry-run row opens `report.html?dry=1`; `history.html?empty=1` draws the screen before any run |

Unchanged: a scan is never a row (it measures and deletes nothing; `lib/run-mode.ts` `isRunRecord`). `Other
machines` keeps its signed-in and signed-out words - the finished product's.

### 2. `report.html` + `page-report.js` - Report (D-42)

| Was | Now, and why |
|---|---|
| static *"Freed 3.31 GB"* over rows adding to 5.7 GB; *"Safe batch · ... 5 ran · 3 skipped"* over a table showing 6 and 2 | both read from the steps: *"Freed 5.7 GB"*, *"safe batch · 8 sections attempted · 6 ran · 2 skipped · nothing refused · 17 seconds"*; *"N refused"* / *"N failed"* when present. The opening words are History's (D-44): one run, one name |
| *Show the JSON* toast *"Opens ...run-<stamp>.json in your text editor."* | a read-only panel under the header with the file as written, named by its file; the window may not open a local path (the opener is granted `https:` and `mailto:` only) |
| an empty bar read `skipped` (21 diskusage beside "ran") | the step's status word, or `0 B` when it ran and freed nothing |
| every drive gained up to 3.31 GB, each ticked | the freed bytes land on C:; D: and E: unchanged, no tick - the tick means "this succeeded" |
| badges `ran` / neutral | + `dry-run` outline, `refused` warn, `failed` danger; the word stays the engine's |
| Section column automatic | `width: 11rem`: the engine leaves most notes empty and automatic layout gave Section the Note column's room |
| `%USERPROFILE%\.windowsweep\reports\run-<stamp>.json` | the run's own file in the window's layout (demo-data; the window prints the engine's path): the engine names it `report-<stamp>-<pid>.json`, and the window gives each run its own folder via `--reports-dir` |
| crumbs `ol` | inside `nav aria-label="Breadcrumb"` |
| - | `?dry=1`: *"A dry-run would reclaim 5.7 GB"*, *"What each section would free"*, *"Would free"*, `dry-run` badges, estimates in ink |
| - | `?empty=1`: *"No run to report yet."* + *"A report is written for every run, including a dry-run, and the file on disk says exactly what this screen says."* (the app's words, app-first, now drawn here) |
| - | `?gone=1`: the History crumb + *"That run is no longer in this window's history."* |
| - | `?unreadable=1` / `=missing`: the History record's figure, the meta line held empty, *Show the JSON* inert and described by *"This run's report file could not be read, so only its summary is shown."* (+ the Rust side's reason) / *"No report file was found for this run, so only its summary is shown."* |

Unchanged: *Export...* and its toast - the finished product.

### Declared rather than amended
- History `Other machines`: `pending-wave` (TASK-013) - the window shows *"No runs from other machines"* over
  *"Run summaries from your other machines are not synced in this build yet. The filter is named here rather
  than hidden, so what is missing is a stated gap rather than something you have to discover."*
- Report *Export...*: `pending-wave` - the button is drawn disabled with *Export is not built into this window yet...*; the build needs `--export` on the Rust allowlist and a reveal permission (product PENDING-TASKS TASK-015)

## Amendment - 2026-09-14: GATE 4 round 9

Round 9 (`gate4/GATE4-REPORT.md`, R9.6 and R9.7) closed round 8's blockers and found one more, D-55, with four
small items; the main session then decided D-60. Two of them were the dummy's to change first, and the app
followed each. The app's own items are listed at the end.

### 1. `reclaim-map.js` - a long path ellipsises, and Size stays in view (D-58)

The table's Path cell had no maximum, the same rule on both sides. One 128-character path on a real machine grew
the table until Size and Idle sat 307 px beyond the band's own scroller at 1440; this seed's short paths hid it.
The Path cell now takes the width that is left (`width: 100%; max-width: 0`) and ellipsises inside it. The whole
path stays in the cell's text, which is what a screen reader reads, and one hover away in `title`. The Target cell
keeps to one line, so the room the path gives up is not taken back by a wrapped label.

Measured with a 128-character path set into this page's seed (in the page only):

| width | before: table overflow, Size's right edge | after |
|---|---|---|
| 1440 | 443 px; 323 px beyond the scroller | 0 px; 119 px inside it |
| 760 | 891 px; 771 px beyond | 0 px; 119 px inside |

### 2. `db.js`, `index.html`, `wire.js`, `run.html`, `page-run.js` - the Reclaim button states a bound or the engine's own estimate (D-60, decided)

This replaces the quantity decision 6 gave `{amount}` (the 2026-09-13 round-7 amendment, section 6). Decision 6
stands in its own words - the button's number is what the safe run frees. What changes is how that number is
known.

Round 9 measured the window offering *"Reclaim 34.2 GB"* while the engine's own dry-run of the same arguments
estimated 2.0 GB. Of the gap, 22.0 GB was the held-back figure shown beside the button; browsers (8.1 GB to
245 MB) and temp (2.8 GB to 784 MB) took most of the rest - the engine's own gates, the temp window and files in
use, cutting the measured total down. The measured safe-batch total is what is on disk, not what a press frees,
and the Bible says never to state a gigabyte figure as a promise.

Decided by the main session on 2026-09-14 (`docs/story/decision-log.md`):

- **(a) After a rehearsal with the current arguments** - "Dry-run first", the safe batch dry, with the same
  sections, developer mode, `--days`, `--temp-days`, `--large-file-mb` and exclusions - the button and the Run
  screen's idle hero show that rehearsal's estimate: the engine's own figure.
- **(b) Before one, or once any of those has changed since,** they show an upper bound, worded as one: *"Reclaim
  up to {amount}"*. The amount is the measured safe-batch total less what is held back. It is a true bound,
  because the engine cannot free more than was measured and not held back.
- **The Home hero keeps the measured total.** It describes what is there, not what a press will do.

| where | before a rehearsal, or after an argument moved (b) | after a rehearsal with the current arguments (a) |
|---|---|---|
| Home's primary button | *Reclaim up to {amount}* | *Reclaim {amount}* (the existing sentence) |
| Run's idle hero | *up to*, in its own `.unit` span before the figure | the figure alone |
| either, before a scan | *Scan first*, disabled; *not measured* (unchanged) | |

How this dummy draws both: `db.facts.rehearsal` records the arguments "Dry-run first" ran with, and its estimate -
this prototype's own dry-run figure, the one its toast reports. `db.derive.offer()` compares them with the current
arguments, the exclusions as a set. Press "Dry-run first" and the button drops *up to*; move the idle window, the
developer switch, an exclusion or a Settings threshold and it returns; move it back and the estimate returns.
Starting the safe run on `run.html`, or Home's Reclaim, spends the rehearsal. The seed has no gate but the idle
window, so here the estimate equals the bound and only the words change; on a real machine they differ, as above.

**What the window subtracts, and only while it holds.** Held back is each developer section's size on disk less
the rehearsal's estimate for it, so it measures developer mode, the idle window and the exclusions, and nothing
else. After any of those three moves it reads *not measured* until the next rehearsal, and nothing is subtracted:
a gap measured under `--days 100` would hold back more than a run at `--days 30` does, and the bound built from it
would stop being one. `--temp-days` and `--large-file-mb` govern sections 10 and 19, which are not developer
sections, so the figure survives them and is subtracted. With developer mode off it is 0 by definition. (This
dummy sets its held-back caches aside per target in `activeTargets()`, so its bound is `safeRunBytes()` itself -
the difference `lib/reclaim.ts` already records, unchanged here.)

Measured in the window on this machine: before a rehearsal *"Reclaim up to 34.2 GB"* (the ladder's 34.2 GB, held
back not measured), and the Run hero *up to 34.19 GB*; after "Dry-run first" *"Reclaim 1.9 GB"*, the Run screen
reading *"A dry-run would reclaim 1.9 GB."* and, at rest, *1.92 GB*; `--days 90` *"up to 34.2 GB"*, back to 100
*"1.9 GB"*; `--temp-days 4` *"up to 12.2 GB"* (34.2 less the 22.0 GB held back); developer mode off *"up to
34.2 GB"*; one target excluded *"up to 32.5 GB"*.

New strings in the window's catalogue: `home.reclaimUpTo` *"Reclaim up to {{amount}}"* and `run.heroUpTo`
*"<1>up to</1> <2>{{value}}</2><3>{{unit}}</3>"* - one key, so a language can put the qualifier after the number.
The keeper takes both into desktop-moment's record.

### The app's own round-9 items, no dummy change

- D-55: Home's hero, its sub-line, the scan button's word and the rail foot read the scan and nothing else. A
  Picker ask (`--only N --dry-run`) is a run, and it measures nothing the hero claims; before a scan, Home is
  `index.html?empty=1` whatever has run. The one sub-line state this dummy never drew - a span with no
  freshness, after a run's summary stood in for a scan - is gone with it.
- D-56: a dry-run's report ticks no drive (`page-report.js`: `gained = !DRY && …`).
- D-57: the last-runs line ages on its own half-minute clock, before a scan as after one.
- D-59: a refused `write_select_file` is shown at the control and records no run.

---

## Amendment - 2026-09-14 (later): GATE 4 round 10

Round 10 confirmed D-60 on the Reclaim button and then found the same promise two bands lower, as **D-61**;
it also filed **D-62**, a 760 overflow. Both are the dummy's to change first, and the app follows each. D-61
needed this dummy to gain a state its seed could not show, which is the larger half of this amendment.

### 1. `seed.js`, `db.js`, `index.html`, `wire.js`, `run.html`, `page-run.js` - every figure that describes a run follows D-60's rule (D-61, decided)

**What round 10 measured.** After a rehearsal, with the Reclaim button reading *Reclaim 1.9 GB* - the engine's
own estimate for that exact run - Home's ladder foot still read *"Total a safe run would free 34.2 GB"* and the
Run screen's eleven waiting rows still totalled 34.3 GB (`pkg 13.7 GB`, `browsers 8.1 GB`, `build 5.1 GB`, …),
where the rehearsal's own rows were `0 B`, `245.0 MB` and `42.6 MB`. Eighteen times the figure, in plainer
words, on the same screen. `SafeRunLadder.tsx`'s own header states the invariant it broke: that the total "is
the same number the Reclaim button carries".

**Decided by the main session on 2026-09-14** (`docs/story/decision-log.md`), the same reasoning as D-60:

- **(a) After a rehearsal with the current arguments** - the same sections, developer mode, `--days`,
  `--temp-days`, `--large-file-mb` and exclusions - every figure that describes what a run **would free**
  carries that rehearsal's own number: the ladder's rungs, its "and N more" roll-up, its total, and the Run
  screen's waiting rows.
- **(b) Before one, or once any argument has moved since,** each is the **bound** it is and is worded as one.
- **A figure that describes what is THERE keeps its measured number** and is not touched: Home's hero, the
  drives, the map, a section card on the Sections screen.

| where | (b) before a rehearsal, or after an argument moved | (a) after a rehearsal with the current arguments |
|---|---|---|
| the ladder's total row | *Total a safe run would free up to {amount}* | *Total a safe run would free {amount}* |
| the ladder's rungs and roll-up | the bound per section | the rehearsal's own figure per section |
| both bands' caption | *Sizes on disk — a run frees up to this. A dry-run gives the engine's own figure.* | *The last dry-run's own figures, for these exact settings.* |
| Run's waiting rows | the bound per section | the rehearsal's own figure per section |
| either, before a scan | the caption is not drawn at all, the label loses its *up to*, the rungs read *not measured* (D-53) | |

**Why a caption rather than "up to" on every figure.** Eleven *up to* prefixes down a numeric column is noise,
and it would break the column's alignment; the qualifier belongs to the band, said once. It is also what makes
the state CHANGE visible: press "Dry-run first" and the sentence changes with the numbers, which is how a
reader can tell the two apart at all.

**And the ladder re-ranks.** The rungs sort by the figure shown, so *which step frees the most* stays true in
both states - after a rehearsal the shape of the run really is the estimate's shape. Sorted by size on disk it
would have put a section the engine estimates at 0 B on the top rung with an empty bar.

**The state this dummy gained, and why it had to.** Its seed had no gate but the idle window, so bound,
estimate and ladder total were one number here and pressing "Dry-run first" changed only the words - the
prototype could not draw the defect it is meant to specify the fix for. `seed.js` now declares, per target,
what the engine's **other** gates keep back and why: a file a running program still has open, and a temp file
newer than `--temp-days` (`S.GATED`, twelve rows, each naming its gate - *Chrome is running*, *newer than the
temp window, or open*). That is demo data like every byte figure in the file, and it is clamped to the target's
own size on read. 🔴 **Developer mode is deliberately not in that table**: its idle gate is already modelled
one layer up, where `activeTargets()` sets a recently-used dev cache aside and `heldByDeveloperMode()` reports
it as "Held back right now". A second subtraction for the same gate would count it twice.

`db.derive.safeRunRows()` is the one rule, used by the ladder and by the Run queue; `rehearse()` now records a
figure per section rather than one total, which is what the engine's own summary carries
(`sections[].freed_bytes`, filled in a dry-run exactly as in a real one).

Measured here, at 1440: before a rehearsal *Total a safe run would free up to 29.7 GB* beside *Reclaim up to
29.7 GB*, rungs `build 8.8 GB · pkg 7.2 GB · browsers 3.7 GB · temp 2.7 GB` and *and 4 more 7.3 GB*; after
"Dry-run first" *Total a safe run would free 19.9 GB* beside *Reclaim 19.9 GB*, rungs `build 8.8 GB · pkg
7.2 GB · runners 1.9 GB · temp 757.8 MB` and *and 4 more 1.3 GB* - the ladder re-ranked, browsers falling from
3.7 GB to 388.0 MB because this seed now says Chrome and Edge are running. Run's rows move with it, and its
hero drops its *up to*.

🔴 **One more figure was making the same claim and is fixed with them:** the dry-run's own toast reported
`safeRunBytes()` - the measured total - so the acknowledgement of the rehearsal contradicted the button the
rehearsal had just filled. It carries the estimate now: *Dry-run: 19.9 GB across 8 sections. Nothing was
deleted.*

**What the window does differently, and why that is the same rule.** This dummy's per-section figure is already
net of developer mode (its `activeTargets()` drops a held-back cache outright), so a rung here IS the bound.
The window's figures are sizes on disk, so it subtracts its own measured held-back figure per section - the
difference `lib/reclaim.ts` has recorded since D-60, unchanged. One subtraction each; the rungs sum to the
button's amount on both sides.

### 2. `reclaim-map.js` - the Target cell is capped, not merely kept to one line (D-62)

Round 9's D-58 gave the Path cell the width that is left and kept the Target cell to one line, so the room the
path gave up could not be taken back by a wrapped label. A long label then simply pushed the table instead.
Measured here at 760 with this machine's longest engine title set into the rows (*Windows Error Reporting
archive (system)*, 40 characters), the table overflowed its own scroller by **53 px** with `Idle (days)` ending
**38 px** past the right edge and the Target column holding **304 px** - the same three numbers round 10
reported from the window, which is how this is known to be the dummy's rule rather than the app's.

🔴 **A cap in pixels chosen to fit that title would only move the width at which it breaks.** The engine's
longest safe-batch title is half again as long - *docker image prune (unused images older than N days)*, 52
characters, `modules/docker.ps1:7` - and with it the same table overflowed **138 px**. So the label now lives
in a block span with its own maximum (`13rem * var(--density)`), which is what bounds an auto-layout cell's
contribution; the whole label stays in the cell's text, which is what a screen reader reads, and one hover away
in `title`.

⚠️ **Not by giving Target the Path's own `width:100%; max-width:0`**, which was tried first and measured: the
two flexible columns do not share, the label swallows the path's width entirely and Path collapses to **59 px**
even at 1440. The cap leaves Path the rest.

| width | title | before: overflow · `Idle (days)` past the scroller · Target · Path | after |
|---|---|---|---|
| 760 | 40 chars | 53 px · 38 px · 304 px · 59 px | 0 px · 15 px inside · 232 px · 78 px |
| 760 | 52 chars | 138 px · 123 px · 388 px · 59 px | 0 px · 15 px inside · 232 px · 78 px |
| 1440 | 52 chars | 0 px · 15 px inside · 388 px · 369 px | 0 px · 15 px inside · 232 px · 526 px |

Each "before" was measured with the pre-D-62 rule put back in place and the plant verified to have applied
first; the file was restored byte-identical afterwards. 760 is where this has to hold, because
`tauri.conf.json` sets `minWidth: 760` and the product cannot be narrower.

---

## Amendment - 2026-09-17: GATE 4 round 11 - D-63 and D-64

Round 11 ran on 2026-09-14 and saved none of its driver stdout, so the round has no verdict and is re-run as
round 12 (`gate4/GATE4-REPORT.md`, and the tracker's `knownRisks`). Two findings were written down before
that loss and both are settled here. One of them turns out to need no dummy change at all, and says so
rather than inventing one; the other needed the dummy to gain a state it had never been given - the same
shape D-53 resolved for Home, and resolved the same way.

### 1. No dummy change - a rehearsal goes stale when a later scan re-measures the disk (D-63, decided)

`isCurrentRehearsal` compared the run's arguments and the exclusion set and nothing else, so a rehearsal
stayed current across a later scan. Press **Dry-run first**, then press **Scan**, and every band built on
the rehearsal went on printing the engine's estimate while the window held a newer measurement of the same
disk - a cache emptied, a build run, an installer tidying up after itself. The estimate can describe files
that are no longer there, and D-60's whole point is that a gigabyte figure is never stated as a promise.

**The rule, decided by the main session:** *a rehearsal is current only while its arguments equal the run's
**and** no scan has finished after it.* After a later scan the figures fall back to D-60's bound wording -
"Reclaim up to ...", built from the **new** scan - until the next *Dry-run first*.

**Why no dummy change.** The dummy already draws both states and draws them from one place: `db.js` ->
`offer()` returns `{ amount, upTo }`, `upTo: true` being the bound and `false` the rehearsal's own estimate,
and `safeRunRows()` carries the same flag per section. Nothing on screen is new - **which state is shown**
moved, not what either state looks like. The dummy has no second measurement to make the case reachable
(its seed is measured once and never re-measured), so this is a rule about the app's state machine and not
a divergence from an approved page. No words changed anywhere.

The real-run half of this was already in the tree and is not duplicated: `state/store.ts` ->
`spendScanTargets` drops the rehearsal outright when a real run spends a section it estimated.

### 2. `run.html`, `page-run.js`, `wire.js` - the Run screen before anything is measured (D-64, decided)

On a fresh session the Run screen's **Per section** band printed *"Sizes on disk - a run frees up to this.
A dry-run gives the engine's own figure."* above eleven rows carrying no figures at all, while Home's ladder
- the same claim about the same run, one screen away - correctly drew no caption. The test behind it asked
whether a **run** had happened and never whether anything had been **measured**.

🔴 **The dummy was the side that was missing, and that is the finding.** Home has had this state since D-53
(`index.html?empty=1` -> `applyBeforeScan()`), and Settings since the same round (`settings.html?empty=1`),
but `run.html` had no equivalent - so the app's own first-open Run screen had no approved counterpart to be
judged against. The dummy gains the state rather than the app losing it, exactly as D-53 was resolved.

**`run.html?empty=1`** now renders it, through the mechanism already in the file rather than a new one:

- **`page-run.js`** reads `?empty=1` the way it already reads `?failed=1`, and the way `page-settings.js`
  reads it for the unmeasured Settings screen. The queue is still the whole safe batch - the engine runs it
  whatever this window has measured - and not one row carries a figure.
- **the rows say `not measured`**, which is the word Home's rungs, both heroes, the drives and the held-back
  well already use for this state. A blank cell in a column of byte figures reads as a zero. A row that
  merely has no figure for *this* run - a report-only section before a rehearsal - keeps its blank, because
  that is a different fact.
- **the basis caption goes**, rather than guessing which of the two it would be. That is the same answer
  `applyBeforeScan()` already gives Home's `ladderBasis` under D-61.
- **the map band goes whole** (`run.html` gained `data-ws-run-map` to make it addressable): nothing measured
  is nothing to draw and nothing to drain, which is what the app already does - its map band renders only
  while it has tiles.
- **`wire.js`** contributes the two pieces both heroes share: the hero reads `not measured` and its
  D-60 `up to` prefix goes with the figure it qualified. 🔴 And `applyBeforeScan()`'s `.hero-sub` rewrite is
  now scoped to Home. That file runs on every page and the selector matched the Run screen's sub-line too,
  which would have replaced *"0 of 11 sections - not started"* with Home's sentence about scanning - a
  divergence the app would then have been asked to copy.

**No new words.** Every string above already exists in the dummy and in the app's catalogue; this amendment
moves which of them are shown, in a state that was never drawn.

**Then the app matched.** `screens/Run.tsx` tests `offer === null` for "nothing measured" - deliberately the
same expression Home's ladder reads (`SafeRunLadder.tsx`'s `measured = total !== null`, whose `total` is
that offer's amount), so the two bands cannot drift apart again. 🔴 **Not** `figures.bySection.size === 0`:
emptiness and "nothing measured" are separate facts - exclude every target after a real scan and the map is
empty while the true answer is 0 - and `lib/reclaim.ts` already records that exact conflation as a defect it
had to fix once. `RunPerSection.tsx`'s `basis` gains a fourth value, `'unmeasured'`, because drawing no
caption is not the same fact as a run having happened.
