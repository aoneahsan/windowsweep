# desktop-cockpit — Sections, Picker, History, Settings, Report

Content-map row **13** · surfaces `sections.html`, `picker.html`, `history.html`, `settings.html`,
`report.html` · tone band **P**, with **W** permitted in the empty states and nowhere else · structure: a
dense table with a plain line above it.

This is a slot inventory rather than a page. Every user-visible string on the five screens is listed once,
numbered, with the file and a selector precise enough to find it in one search; the string that ships sits
inside the fence, and the **Was** and **Change** lines sit outside it. Most of these are already on voice
and are kept.

Two constraints shape this surface. The Picker and the Recycle Bin controls are destructive confirmations,
so humor is off there even though the map row allows it in an empty state. No string may imply that a
permanent deletion can be taken back. And the section catalogue is a frozen public contract: keys, titles,
tiers and batch names come from `seed.js`, which mirrors `lib/constants.ps1`, so those words belong to
content-map row 10 and cannot be edited from here.

| Screen | Slot range | Count |
|---|---|---|
| §A `sections.html` (+ `page-sections.js`) | S-001 – S-032 | 32 |
| §B `picker.html` (+ `page-picker.js`) | S-033 – S-067 | 35 |
| §C `history.html` (+ `page-history.js`) | S-068 – S-092 | 25 |
| §D `settings.html` (+ `page-settings.js`) | S-093 – S-124 | 32 |
| §E `report.html` (+ `page-report.js`) | S-125 – S-143 | 19 |
| **Total** | | **143** |

Shared chrome, meaning the title bar, the rail, the appearance panel, the toast host and the
`engine <version>` and `storage:` ends of the status bar, is inventoried once in `desktop-moment.md` §A.

---

## §A `sections.html` — the catalogue

### S-001 · sections.html:6 · `<title>`
```
windowsweep - Sections
```
**Was:** identical.

**Change:** none.

### S-002 · sections.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - the section catalogue. The cockpit density regime.
```
**Was:** identical.

**Change:** none. A `prototype` exemption.

### S-003 · sections.html:30 · `h1.t-xl.wide`
```
Sections
```
**Was:** Sections

**Change:** none.

### S-004 · sections.html:31-32 · the plain line above the table
```
The catalogue is a frozen public contract - a number is never reused, and a retired section becomes a no-op that says so.
```
**Was:** identical.

**Change:** none. This is the map row's "plain line above each table" doing its job in one sentence, and it
tells a reader something about the product's promises rather than about the table's columns.

### S-005 · sections.html:35-36 · catalogue total
```
{bytes}
reclaimable across every section
```
**Was:** the same pair.

**Change:** none.

### S-006 · sections.html:45 · filter label
```
Show
```
**Was:** Show

**Change:** none.

### S-007 · sections.html:46-52 · filter chips
```
All 26
Safe batch
Needs a person
Needs admin
Deep
Report only
Developer
```
**Was:** the same seven.

**Change:** none. "Needs a person" is the phrase Home uses for the same set, so a reader arriving from
there recognises it without translation.

### S-008 · sections.html:53 · search placeholder
```
Filter by name or key
```
**Was:** Filter by name or key

**Change:** none.

### S-009 · sections.html:66-73 · table headers
```
Select · # · Section · Tier · Batch · Needs · Reclaimable · Expand
```
**Was:** the same eight, with "Select" and "Expand" visually hidden.

**Change:** none.

### S-010 · `page-sections.js:73` · row switch `aria-label`
```
Select section {n}, {key}
```
**Was:** identical.

**Change:** none.

### S-011 · `page-sections.js:81-82` · report-only row
```
—
Report only - there is nothing to select
```
**Was:** the same dash and the same tooltip.

**Change:** none.

### S-012 · `page-sections.js:97` · developer badge
```
dev
```
**Was:** dev

**Change:** none.

### S-013 · `page-sections.js:110` · tier cell
```
(the six tier labels from seed.js — see desktop-moment.md S-043)
```
**Was:** the same.

**Change:** none here.

### S-014 · `page-sections.js:116` · batch badge
```
safe · optin · interactive · deep
```
**Was:** the same four, read from the section row.

**Change:** none. These are the engine's batch policies and row 10 owns the words.

### S-015 · `page-sections.js:124-126` · needs cell
```
admin
you
—
```
**Was:** the same three states.

**Change:** none. "You" as a badge is short enough for the column and exact: the run stops until a person
answers, and no flag can answer for one.

### S-016 · `page-sections.js:139` · expand button `aria-label`
```
Show what section {n} touches
```
**Was:** identical.

**Change:** none. The verb is "touches", which is the word the safety copy uses everywhere else, so the
detail row promises what it delivers.

### S-017 · `page-sections.js:140, 178` · expand glyph
```
▾ ▴
```
**Was:** the same pair.

**Change:** none, recorded so nobody replaces them with words the column has no room for.

### S-018 · `page-sections.js:154` · detail row, report-only
```
This section writes a report and deletes nothing.
```
**Was:** identical.

**Change:** none.

### S-019 · `page-sections.js:155` · detail row, nothing found
```
Nothing declared on this machine right now.
```
**Was:** identical.

**Change:** none.

### S-020 · `page-sections.js:166` · detail row, per-target idle
```
idle {n}d
```
**Was:** idle {n}d

**Change:** none.

### S-021 · `page-sections.js:187` · filter empty state, heading
```
No section matches that.
```
**Was:** No section matches that.

**Change:** none.

### S-022 · `page-sections.js:188` · filter empty state, body
```
All 26 are still there. The filter is narrow.
```
**Was:** All 26 are still there - the filter is just narrow.

**Change:** rewritten. "Just" is banned diction. Splitting the clause leaves the dry note intact while
ending on the short half, which is what this voice does with a paragraph. Band W is allowed here, because
an empty filter has cost the reader nothing.

### S-023 · sections.html:99-100 · selection bar, count
```
{n}
sections selected
```
**Was:** the same pair.

**Change:** none.

### S-024 · `page-sections.js:207-208` · selection bar, warnings
```
{n} need an elevated window
{n} need you to pick items
```
**Was:** the same pair.

**Change:** none. Both warnings appear before the run button rather than after it, which is the ordering the
whole product is built on; a reader never presses Run and then learns what was required of a person.

### S-025 · sections.html:105 · selection bar action
```
Clear
```
**Was:** Clear

**Change:** none.

### S-026 · sections.html:106 · selection bar action
```
Dry-run
```
**Was:** Dry run

**Change:** hyphenated. The glossary fixes the spelling and the flag is `--dry-run`, so Home's toast at
`desktop-moment.md` S-094 now matches.

### S-027 · sections.html:107 · selection bar action
```
Run selected
```
**Was:** Run selected

**Change:** none.

### S-028 · `page-sections.js:242` · toast, selection cleared
```
Selection cleared.
```
**Was:** Selection cleared.

**Change:** none. It carries an Undo, which is why it can be two words.

### S-029 · `page-sections.js:250` · toast, dry-run finished
```
Dry-run across {n} sections. Nothing was deleted.
```
**Was:** Dry run over {n} sections. Nothing was deleted.

**Change:** hyphenated, and "over" becomes "across", which is the preposition every other count on this
surface uses.

### S-030 · `page-sections.js:258-259` · toast, interactive sections blocked
```
Sections {list} need you to choose items first. Nothing was run.
```
**Was:** identical.

**Change:** none. It names the sections, says what is required and reports that nothing happened, in that
order, which is exactly the shape an error of consequence takes even when nothing has been lost.

### S-031 · sections.html:82-88 · disclosure, the run policies
```
What the four run policies mean
Safe runs on its own. Opt-in only runs if you name it. Deep needs an extra confirmation on top. Interactive needs you to pick the items, one by one.
```
**Was:** the same summary and body.

**Change:** none. Four policies, four sentences, none longer than nine words.

### S-032 · sections.html:114 · status bar, page text
```
{n} of 26 shown
```
**Was:** {n} of 26 shown

**Change:** none.

---

## §B `picker.html` — choosing item by item

🔴 This screen ends in a deletion the reader chose, so the humor budget here is zero.

### S-033 · picker.html:6 · `<title>`
```
windowsweep - Choose what goes
```
**Was:** identical.

**Change:** none.

### S-034 · picker.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - the candidate picker for sections 17, 18, 19 and 23.
```
**Was:** identical.

**Change:** none. A `prototype` exemption.

### S-035 · picker.html:27 · eyebrow
```
Section {n} · needs a person
```
**Was:** identical.

**Change:** none.

### S-036 · picker.html:28-29 · pre-script defaults
```
Stale build artefacts
Nothing here is chosen for you.
```
**Was:** the same pair.

**Change:** none. The second line is the screen's thesis and it is the first thing rendered, before any
candidate has loaded.

### S-037 · `page-picker.js` → `META[17]`
```
Stale build artefacts
node_modules, target, .gradle and friends, in projects nothing has touched for months. Rebuilt by the project's own install or build command.
```
**Was:** the same pair.

**Change:** none. The second sentence is the reversibility question answered before it is asked: these come
back, and the copy says what brings them back.

### S-038 · `page-picker.js` → `META[18]`
```
Large personal files
Anything over the size threshold that has not been opened in a long time. These go to the Recycle Bin.
```
**Was:** the same pair.

**Change:** none.

### S-039 · `page-picker.js` → `META[19]`
```
Old downloads
Installers and archives in your Downloads folder. Only Downloads - never Desktop, never Documents.
```
**Was:** the same pair.

**Change:** none. The repetition of "never" is the point, and the two folders named are the two a reader
is most afraid of losing.

### S-040 · `page-picker.js` → `META[23]`
```
Orphaned application data
AppData folders belonging to programs that are no longer installed. Fails closed: if the registry cannot be read, nothing is offered.
```
**Was:** the same pair.

**Change:** none.

### S-041 · picker.html:32-34 · chosen readout
```
{bytes}
{n} of {n} chosen
```
**Was:** the same pair.

**Change:** none.

### S-042 · picker.html:43 · filter label
```
Section
```
**Was:** Section

**Change:** none.

### S-043 · picker.html:44-47 · section chips
```
17 · artefacts
18 · large files
19 · downloads
23 · orphaned data
```
**Was:** the same four.

**Change:** none. Number first, then a two-word noun, which is how the whole product refers to a section.

### S-044 · picker.html:48 · search placeholder
```
Filter by path or project
```
**Was:** Filter by path or project

**Change:** none.

### S-045 · picker.html:61-65 · table headers
```
Choose · Path · Project · Idle · Size
```
**Was:** the same five, with "Choose" visually hidden.

**Change:** none.

### S-046 · `page-picker.js:60` · row switch `aria-label`
```
Choose {path}
```
**Was:** Choose {path}

**Change:** none. The full path is spoken, which is slower to hear and impossible to misread.

### S-047 · `page-picker.js:75` · empty project cell
```
—
```
**Was:** the same.

**Change:** none.

### S-048 · `page-picker.js:76` · idle cell
```
{n}d
```
**Was:** {n}d

**Change:** none.

### S-049 · `page-picker.js:41-43` · empty state, filtered
```
Nothing matches that
Clear the filter and the candidates come back.
```
**Was:** the same pair.

**Change:** none.

### S-050 · `page-picker.js:41-44` · empty state, no candidates
```
Nothing to choose here
This section found no candidates on this machine. That is the good outcome, not an error.
```
**Was:** the same pair.

**Change:** none. Band W, inside an empty state, which is the one place row 13 permits it; nothing has been
deleted at this point and the reader is being told that a blank table is a result rather than a fault.

### S-051 · picker.html:74-79 · the note under the table
```
Nothing here is pre-selected, on purpose. These four sections refuse to act on --yes alone - the prompt still appears, the default is none, and the final question is never auto-answered. A scripted selection (--select or --select-file) counts as a person choosing, and only then does the run go ahead unattended.
```
**Was:** identical.

**Change:** none. It is the longest passage on the screen and every clause of it is a refusal with a
mechanism attached, which is why it earns the length.

### S-052 · picker.html:84 · disclosure summary
```
Drive this from a file instead
```
**Was:** Drive this from a file instead

**Change:** none.

### S-053 · picker.html:88-90 · disclosure body
```
A plain UTF-8 file with one full path per line is matched, case-insensitively, against the candidates this section offers. A line that matches nothing is warned about individually rather than failing the run.
```
**Was:** identical.

**Change:** none.

### S-054 · picker.html:91 · example command
```
windowsweep --only 17 --select-file D:\selections\artefacts.txt
```
**Was:** identical.

**Change:** none.

### S-055 · picker.html:93-95 · drop zone
```
Drop a selection file here, or choose one
.txt or .list · up to 256 KB · one full path per line
Choose a file
```
**Was:** the same three.

**Change:** none. The constraints are stated before the picker opens rather than as an error afterwards,
which is the upload rule this fleet applies to every file field.

### S-056 · picker.html:107-108 · selection bar, count
```
{n}
chosen
```
**Was:** the same pair.

**Change:** none.

### S-057 · `page-picker.js:96-97` · selection bar, scope
```
across section {n}
across sections {list}
```
**Was:** the same pair.

**Change:** none.

### S-058 · picker.html:113 · segmented control `aria-label`
```
How to delete
```
**Was:** How to delete

**Change:** none.

### S-059 · picker.html:114-115 · segmented control options
```
Recycle Bin
Permanent
```
**Was:** the same pair.

**Change:** none to the labels themselves. See the slot below.

### S-060 · picker.html:112-116 · **NEW** — consequence line beside the segmented control
```
The Recycle Bin can be emptied later. Permanent has no undo.
```
**Was:** nothing. The dummy states the difference only in the toast that appears after the deletion, at
S-065 and S-066.

**Change:** added, and flagged as an addition so it is transcribed into `picker.html` rather than assumed to
be there. The Bible requires the difference between the Recycle Bin and a permanent deletion to be stated
wherever it is relevant, and the one place it is most relevant is the control that chooses between them. Two
sentences, eleven words, no adjective.

### S-061 · picker.html:117 · selection bar action
```
Clear
```
**Was:** Clear

**Change:** none.

### S-062 · picker.html:118 · selection bar action
```
Remove these
```
**Was:** Remove these

**Change:** none. The verb matches the tier vocabulary and does not celebrate anything.

### S-063 · `page-picker.js:123` · toast, selection cleared
```
Cleared.
```
**Was:** Cleared.

**Change:** none. It carries an Undo.

### S-064 · `page-picker.js:126-127` · toast, selection file read
```
402 paths read, 397 matched a candidate. 5 lines matched nothing - each is warned about individually rather than failing the run.
```
**Was:** identical.

**Change:** none. The three figures are `demo-data`, and the behaviour they illustrate is the one described
at S-053.

### S-065 · `page-picker.js:137-138` · toast, permanent branch
```
This would ask you to confirm {n} permanent deletions first - a confirmation --yes never answers.
```
**Was:** identical.

**Change:** none. A `prototype` exemption on "This would", and the sentence still carries the fact that
matters: the confirmation exists and no flag can satisfy it.

### S-066 · `page-picker.js:139-140` · toast, Recycle Bin branch
```
Sent {n} item to the Recycle Bin. Recoverable until you empty it.
Sent {n} items to the Recycle Bin. Recoverable until you empty it.
```
**Was:** the same, with the plural built by a ternary.

**Change:** none to the words. Both forms are written out so a catalogue can hold them, as at
`desktop-moment.md` S-110.

### S-067 · picker.html:125 · status bar, page text
```
a person chooses these - --yes never does
```
**Was:** a person chooses these - --yes never does

**Change:** none.

---

## §C `history.html` — what has already happened

### S-068 · history.html:6 · `<title>`
```
windowsweep - History
```
**Was:** identical.

**Change:** none.

### S-069 · history.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - local runs and cloud summaries.
```
**Was:** identical.

**Change:** none. A `prototype` exemption.

### S-070 · history.html:27-29 · heading and the plain line
```
History
Every run this machine has made, and a summary of runs from your other machines if you are signed in.
```
**Was:** the same pair.

**Change:** none. The distinction between a full local row and a thin synced one is drawn in the first
sentence, which is why the "summary only" badge further down needs no explanation.

### S-071 · history.html:32-33 · total
```
{bytes}
freed in the last {n} runs
```
**Was:** the same pair.

**Change:** none.

### S-072 · history.html:43-44 · chart label
```
Freed per run
the frame does not move with the data
```
**Was:** the same pair.

**Change:** none. The right-hand note is a statement about the chart's honesty rather than a caption, and it
belongs on a screen whose whole job is comparing one run against another.

### S-073 · history.html:55-58 · filter chips
```
All
This machine
Other machines
Dry-runs
```
**Was:** All · This machine · Other machines · Previews

**Change:** the fourth chip is renamed. "Preview" is a banned synonym for the dry-run, and this filter
selects rows the engine wrote with `--dry-run`, so the chip now says what it filters.

### S-074 · history.html:70-75 · table headers
```
When · Mode · Sections · Where · Freed · Open
```
**Was:** the same six, with "Open" visually hidden.

**Change:** none.

### S-075 · `page-history.js:58-59` · mode badge
```
dry-run
real run
```
**Was:** preview / real run

**Change:** the first badge is renamed, for the reason at S-073. The pair now reads as one distinction
rather than two vocabularies, and it matches the `dry_run=false` line the log shows during a run.

### S-076 · `seed.js:151-158` · the `mode` values behind that column
```
safe batch
safe batch
profile: dev
profile: minimal
safe batch
sections 1, 2, 3, 6, 7, 8
safe batch
sections 1, 2, 3, 5, 6
```
**Was:** full sweep · full sweep · developer caches · browsers and temp · full sweep · caches only · full sweep · packages and editors

**Change:** rewritten. The engine already had words for these. Every old value was invented for the
prototype, and two of them broke a rule: "full sweep" uses the banned verb as a noun, and none of the six named anything a
reader could type. The new values are the real profile names from `docs/profiles.md`, the safe batch, and
two explicit section lists, so a History row and a command line now describe the same run the same way. Each
label was checked against its own row's section count: the four "safe batch" rows are the four seeded with
eleven sections, which is the length of `SAFE_BATCH` in `seed.js`; `dev` is seven sections and `minimal` is
four, matching `docs/profiles.md`; and the two rows seeded with six and five sections name six and five
sections explicitly, because no documented profile has those lengths.

### S-077 · `page-history.js:67` · synced row badge
```
summary only
```
**Was:** summary only

**Change:** none.

### S-078 · `page-history.js:13, 19-20` · the `where` column values
```
this machine
laptop
```
**Was:** the same pair.

**Change:** none. "Laptop" is `demo-data`; the app shows whatever name the other machine registered.

### S-079 · `page-history.js:86` · synced row, disabled open control
```
The full report stays on the machine that made it.
```
**Was:** identical.

**Change:** none. A disabled control that says why is worth four of an enabled one that fails.

### S-080 · `page-history.js:89` · local row open `aria-label`
```
Open this run's report
```
**Was:** Open this run's report

**Change:** none.

### S-081 · `db.js:205-210` · relative dates
```
today
yesterday
{n} days ago
{n} months ago
```
**Was:** the same four.

**Change:** none, though the transcriber should route these through the same date formatter as the rest of
the app rather than reimplementing them, because a relative date is a locale question and this is the only
place in the dummy that answers one.

### S-082 · `page-history.js:54` · exact timestamp under the relative one
```
{YYYY-MM-DD HH:MM}
```
**Was:** the same.

**Change:** none. The relative date is for reading and the exact one is for matching against a report
filename, and both are shown for that reason.

### S-083 · history.html:83 · pager
```
Load 20 more
```
**Was:** Load 20 more

**Change:** none.

### S-084 · history.html:84-85 · pager count
```
showing {n} of {n}
```
**Was:** showing {n} of {n}

**Change:** none.

### S-085 · history.html:87-88 · pager note
```
Twenty at a time with a cursor, never the whole table - the same budget the engine itself keeps.
```
**Was:** identical.

**Change:** none.

### S-086 · `page-history.js:41` · empty state headings
```
No runs from other machines
No runs yet
```
**Was:** the same pair.

**Change:** none.

### S-087 · `page-history.js:44` · empty state, signed in, no cloud rows
```
None of your other machines has run windowsweep yet.
```
**Was:** identical.

**Change:** none.

### S-088 · `page-history.js:45` · empty state, signed out
```
Sign in and your other machines' run summaries appear here. Nothing syncs while you are signed out.
```
**Was:** identical.

**Change:** none. The second sentence is what makes the first one an offer rather than a nudge.

### S-089 · `page-history.js:46` · empty state, no local runs
```
windowsweep has not run on this machine yet. A dry-run costs nothing and deletes nothing.
```
**Was:** windowsweep has not cleaned anything yet. A preview costs nothing and deletes nothing.

**Change:** two fixes. "Cleaned" is the glossary's banned verb, and "preview" is the banned synonym renamed
across this whole screen at S-073 and S-075; the replacement also points the reader at the one action that
cannot cost anything, which is the right thing for an empty state to offer.

### S-090 · `page-history.js:154` · toast, next page
```
Loaded the next page - twenty at a time with a cursor, never the whole table.
```
**Was:** identical.

**Change:** none.

### S-091 · `page-history.js:114` · sparkline `aria-label`
```
Bytes freed by each of the last {n} runs
```
**Was:** identical.

**Change:** none.

### S-092 · history.html:99 · status bar, page text
```
local runs are complete - cloud rows are summaries
```
**Was:** local runs are complete - cloud rows are summaries

**Change:** none.

---

## §D `settings.html` — every control maps to a flag

### S-093 · settings.html:6 · `<title>`
```
windowsweep - Settings
```
**Was:** identical.

**Change:** none.

### S-094 · settings.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - developer mode, windows, scanning, notifications, privacy.
```
**Was:** identical.

**Change:** none. A `prototype` exemption.

### S-095 · settings.html:25-27 · heading and the plain line
```
Settings
Every one of these maps to a flag the engine already has, so anything you set here you can also pass on a command line.
```
**Was:** the same pair.

**Change:** none. That sentence is the reason every row below carries a "Maps to" line, and it is the
strongest claim on the screen for a reader who would rather not trust a window at all.

### S-096 · settings.html:35-39 · tabs
```
General · Scanning · Notifications · Privacy · About
```
**Was:** the same five.

**Change:** none.

### S-097 · `page-settings.js:77-79` · Developer mode row
```
Developer mode
Keeps package, build and test-runner caches that were used inside the idle window, instead of clearing them completely.
```
**Was:** the same pair.

**Change:** none.

### S-098 · `page-settings.js:87-88` · Developer mode consequence
```
Right now that holds back {bytes}.
Nothing is being held back - every cache is offered in full.
```
**Was:** the same pair.

**Change:** none. Home's state line at `desktop-moment.md` S-056 was changed to match the second of these,
so the two screens now describe the off state in the same words.

### S-099 · `page-settings.js:83-84` · Developer mode toasts
```
Developer mode on - recent caches are kept.
Developer mode off - those caches will be cleared completely.
```
**Was:** the same pair.

**Change:** none.

### S-100 · `page-settings.js:91-93` · Idle window row
```
Idle window
A file untouched for longer than this counts as stale. The newest of its write, access and creation times is what is measured.
```
**Was:** the same pair.

**Change:** none. The second sentence answers the question a sceptical reader asks next, which is which of
the three timestamps decides, and it answers it exactly.

### S-101 · `page-settings.js:97` · Idle window consequence
```
Maps to --days {n}.
```
**Was:** Maps to --days {n}.

**Change:** none.

### S-102 · `page-settings.js:99-102` · Temporary files row
```
Temporary files
A shorter window for %TEMP% and the Windows temp folders, which turn over much faster.
Maps to --temp-days {n}.
```
**Was:** the same three.

**Change:** none.

### S-103 · `page-settings.js:104-106` · Large file threshold row
```
Large file threshold
What section 18 counts as large enough to offer you.
Maps to --large-mb 500.
```
**Was:** the same three.

**Change:** none. "Offer you" rather than "delete", because section 18 is interactive and never deletes
anything a person has not ticked.

### S-104 · `page-settings.js:108-115` · Weekly schedule row
```
Weekly schedule
A Windows Scheduled Task that runs the safe batch, notifies you, and never touches an interactive section.
Maps to --install-task, which refuses under npx because that cache is evicted.
```
**Was:** the same three.

**Change:** none.

### S-105 · `page-settings.js:113` · Weekly schedule toasts
```
Scheduled for Sundays at 03:00.
The task was removed.
```
**Was:** the same pair.

**Change:** none.

### S-106 · `page-settings.js:57, 94, 101, 106` · numeric field suffixes
```
days
MB
```
**Was:** the same pair.

**Change:** none.

### S-107 · `page-settings.js:144-146` · scan roots row
```
Folders to scan for stale artefacts
Section 17 looks only inside these. It never scans a whole drive.
Maps to --scan-roots "D:\work;E:\04-code".
```
**Was:** the same three.

**Change:** none. Two short sentences, the second of them a refusal. The paths in the consequence line are
`demo-data`.

### S-108 · `page-settings.js:135, 141-142` · scan roots controls
```
Stop scanning {path}
Add a folder…
Add a folder to scan
```
**Was:** the same three.

**Change:** none.

### S-109 · `page-settings.js:154-156` · exclusions row
```
Never touch these
Paths added here are refused everywhere, in every section, in addition to the built-in protected list.
Maps to a repeated --exclude-path.
```
**Was:** the same three.

**Change:** none. "Refused" is the glossary's word for what the chokepoint does, and using it here ties a
user's own exclusion to the same mechanism that protects Documents.

### S-110 · `page-settings.js:151-152` · exclusions input
```
Add a path to never touch…
Add an excluded path
```
**Was:** the same pair.

**Change:** none.

### S-111 · `page-settings.js:160, 164-165` · protected list disclosure
```
The built-in protected list, which only ever grows
+{n} more
Details
```
**Was:** the same three.

**Change:** none. "Only ever grows" is a promise about the code's future rather than a description of the
list, and it is the kind of promise this product can actually keep.

### S-112 · `page-settings.js:168-171` · protected list disclosure body
```
These are refused regardless of flags, profile or elevation. A target that resolves inside one of them is rejected by the single deletion function rather than trusted, and the self-test asserts that no declared target sits inside a protected path.
```
**Was:** identical.

**Change:** none.

### S-113 · `page-settings.js:185-188` · run-finished notification row
```
Tell me when a run finishes
A Windows toast with what was freed. It never changes the exit code and never writes to stdout, so a script driving windowsweep is unaffected.
Maps to --notify.
```
**Was:** the same three.

**Change:** none.

### S-114 · `page-settings.js:189-191` · scheduled-run notification row
```
Tell me when the weekly task runs
The same toast, from the scheduled run you were not watching.
```
**Was:** the same pair.

**Change:** none.

### S-115 · `page-settings.js:192-195` · sound row
```
Sound
A short sound on completion. Off by default - a product that beeps unasked gets muted at the operating system and loses the channel for good.
Also an axis in the theme panel.
```
**Was:** the same three.

**Change:** none.

### S-116 · `page-settings.js:188, 191, 195` · notification switch `aria-label`s
```
Notify when a run finishes
Notify for scheduled runs
Sound
```
**Was:** the same three.

**Change:** none.

### S-117 · `page-settings.js:209-211` · privacy tab note
```
The cleanup engine makes zero network calls, and its own test suite asserts that. Everything below is about this desktop window only, and revoking any of it takes effect immediately.
```
**Was:** identical.

**Change:** none. It repeats the consent screen's opening claim, deliberately, because this is where a
reader arrives months later looking for the switch.

### S-118 · `page-settings.js:214-217` · the four privacy rows
```
Product analytics       Which screens and which buttons.
Behaviour analytics     The same events, kept longer.
Session replay          This window, with all text masked.
Crash reports           Stack traces with paths stripped.
```
**Was:** the same four pairs.

**Change:** none to the first, third and fourth, which are the consent screen's wording compressed to a
settings row. The second inherits the open question at `desktop-safety.md` S-013: if the retention
comparison is dropped there, "kept longer" is dropped here in the same edit.

### S-119 · `page-settings.js:222` · privacy toggle toasts
```
{name} is on.
{name} is off, from now.
```
**Was:** the same pair.

**Change:** none. "From now" is the revocation promise in two words, and Home's copy at
`desktop-moment.md` S-089 was changed to match it.

### S-120 · `page-settings.js:226-228` · never-sent row
```
Never sent, by any of them
A file path, a folder name, a drive label, your machine name, your Windows user name, or the contents of anything.
refused
```
**Was:** the same row, with the badge reading "guaranteed".

**Change:** the badge is renamed. The Bible is explicit that the reassurance on this surface is always a
specific refusal rather than an adjective, and "guaranteed" is the adjective version of a claim the row
already makes precisely. "Refused" is also the word the chokepoint uses, which ties the promise to the
mechanism that keeps it.

### S-121 · `page-settings.js:245` · About, version row
```
Version
What is installed right now.
up to date
```
**Was:** the same three.

**Change:** none.

### S-122 · `page-settings.js:240-244` · About, version detail
```
Desktop {version} · engine {version} · MIT
The desktop app bundles the engine it was built against, so the two can never disagree about what a section does.
```
**Was:** the same pair.

**Change:** none.

### S-123 · `page-settings.js:262-265` · About, house promotions
```
More from the same developer
These are the developer's own tools, not an advertising network - nothing here is sold, tracked or third-party, and windowsweep never appears in its own list.
```
**Was:** the same pair.

**Change:** none. That promise binds under the Bible's safety constraints: an advertising network cannot be
added later without changing this sentence first.

### S-124 · `page-settings.js:22-25` · About, roster blurbs
```
linux-cleanup    The same idea, one chokepoint and a real dry-run, for Linux.
macleanup        And for macOS, with the same section catalogue.
native-update    Signed over-the-air updates for Capacitor apps.
strata-storage   One storage API over localStorage, IndexedDB, cookies and URL state.
```
**Was:** the same four.

**Change:** none. Each is one factual line with no claim about the other product's quality.

---

## §E `report.html` — one run, rendered from its JSON

### S-125 · report.html:6 · `<title>`
```
windowsweep - Run report
```
**Was:** identical.

**Change:** none.

### S-126 · report.html:7 · `<meta name="description">`
```
windowsweep desktop, click dummy - one run rendered from its JSON report.
```
**Was:** identical.

**Change:** none. A `prototype` exemption.

### S-127 · report.html:25-28 · breadcrumbs
```
History
{YYYY-MM-DD HH:MM}
```
**Was:** the same pair.

**Change:** none.

### S-128 · report.html:31 · heading
```
Freed {bytes}
```
**Was:** Freed 3.31 GB

**Change:** none to the pattern. The figure is `demo-data`, and the past tense is what makes it a
measurement rather than a promise.

### S-129 · report.html:32-33 · the plain line under the heading
```
Safe batch · 8 sections attempted · 5 ran · 3 skipped · nothing refused · 17 seconds
```
**Was:** identical.

**Change:** none. Six facts, no adjectives, and "nothing refused" is worth its place because a run that did
refuse something needs to say so in the same line.

### S-130 · report.html:36-37 · actions
```
Show the JSON
Export…
```
**Was:** the same pair.

**Change:** none.

### S-131 · report.html:48, 54 · panel labels
```
What each section freed
Disk, before and after
```
**Was:** the same pair.

**Change:** none.

### S-132 · report.html:69-73 · table headers
```
# · Section · Status · Freed · Note
```
**Was:** the same five.

**Change:** none.

### S-133 · `page-report.js:93` · status badges
```
ran
skipped
```
**Was:** the same pair.

**Change:** none. Both are the engine's own status words, so row 10 owns them and this screen quotes them.

### S-134 · `page-report.js:9-17` · the per-section notes
```
nothing older than the idle window
VSIX cache cleared; caches skipped, Code is running
Chrome is running - 7.40 GB left in place
Store cache reset offered, not executed
the bin was already empty
```
**Was:** the same five.

**Change:** none. The third is voice-fingerprint sentence 7 in its shortest form, and the fourth is the
distinction between offering an action and taking one, which is the difference this product is built to
maintain.

### S-135 · `page-report.js:30, 55` · chart labels
```
Bytes freed by each section in this run
skipped
```
**Was:** the same pair.

**Change:** none.

### S-136 · `page-report.js:74-75` · before-and-after rows
```
{bytes} free
was {bytes}
```
**Was:** the same pair.

**Change:** none.

### S-137 · report.html:87 · disclosure summary
```
Where this file lives, and what else reads it
```
**Was:** Where this file lives, and what else reads it

**Change:** none.

### S-138 · report.html:91-94 · disclosure body, paragraph 1
```
Written to %USERPROFILE%\.windowsweep\reports\run-<stamp>.json by the engine itself, in schema 1. This window renders that file - it does not compute anything of its own, which is why a report opened here and a report opened in a text editor can never disagree.
```
**Was:** identical.

**Change:** none.

### S-139 · report.html:95-97 · disclosure body, paragraph 2
```
The same file is what --export md and --export html convert, and what an agent reads when it drives windowsweep from a script.
```
**Was:** identical.

**Change:** none.

### S-140 · `page-report.js:111-112` · toast, open the JSON
```
Opens %USERPROFILE%\.windowsweep\reports\run-{stamp}.json in your text editor.
```
**Was:** identical.

**Change:** none.

### S-141 · `page-report.js:115-116` · toast, export
```
Markdown and HTML come from the engine's own --export, not from this window - so an exported report and this page cannot drift apart.
```
**Was:** identical.

**Change:** none.

### S-142 · report.html:110 · status bar, page text
```
schema 1 - the same file the CLI writes
```
**Was:** schema 1 - the same file the CLI writes

**Change:** none.

### S-143 · `page-report.js:9-17` · the section key in each row
```
1  pkg
2  build
3  runners
6  editors
7  browsers
8  apps
9  wincaches
21 diskusage
```
**Was:** pkg · build · runtimes · editors · chromium · apps · winuser · recycle

**Change:** four keys corrected against the catalogue. `lib/constants.ps1` calls section 3 `runners`, section
7 `browsers` and section 9 `wincaches`, and section 21 is `diskusage` while `recycle` is section 11, which
this run never touched. The screen claims that a report opened here and the same file opened in a text
editor can never disagree, and four invented keys are the one thing that would falsify it. The bar chart at
S-135 reads the same values, so both fix together.

---

## Found in the dummy, reported rather than fixed

Four items, none of them wording.

The Report screen names four sections by keys the engine does not use, which S-143 corrects; that is a
factual defect rather than a style one, because it contradicts the claim the same screen makes about
agreeing with the file on disk. The Sections table renders a `▾` glyph as button text at S-017, which a
screen reader announces as a character; the `aria-label` at S-016 covers it, so this is a note rather than
a defect. The `pickWhere` string at S-057 builds its plural by switching on a count inside a
concatenation, which works in English and nowhere else. And the demo `mode` values rewritten at S-076 live
in `seed.js`, which is shared by History and by Home's sparkline tooltip, so both screens change in one
edit.

---

## Self-check

**Palette.** Band P throughout. That is what a table demands: every row states a fact, a count or a path,
and the "Maps to" line under each Settings control is the purest form of it on this surface. Band R carries six slots:
S-051, S-109, S-112, S-117, S-120 and S-134. Band W appears twice only, at S-022 and S-050, both inside
empty states where nothing has been lost, and the Picker carries none at all.

**Rhythm.** Shortest shipping sentence: "Cleared." at S-063. Longest: the note at S-051 runs to forty-one
words across three clauses, each of which is a refusal with its mechanism attached. The added line at S-060
is deliberately the shortest thing near the most destructive control on the surface.

**Length.** Visible copy measures about 109 words in `sections.html`, 184 in `picker.html`, 94 in
`history.html`, 45 in `settings.html` plus roughly 400 injected by `page-settings.js`, and 129 in
`report.html`. All five are inside row 13's "a screen" cap. Only S-060 adds words. Eleven of them.

**Unsure.** No new `NEEDS DECISION` on this surface. S-118 inherits the open question at
`desktop-safety.md` S-013 about the Amplitude retention claim, and S-060 is an addition rather than a
rewrite, so it wants a yes before it is transcribed into the dummy.
