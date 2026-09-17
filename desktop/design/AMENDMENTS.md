# windowsweep desktop - the amendment log, part 1 (2026-09-07 .. 2026-09-13 round 8)

> Moved **verbatim** out of [`README.md`](README.md) on 2026-09-17 (TASK-014), which had reached 1,039 lines
> against this repository's 500-line rule. The design argument stayed there; every `## Amendment` section is
> here. This part is closed - it is at the ceiling - and the log **continues in
> [`AMENDMENTS-2.md`](AMENDMENTS-2.md)**, which is where the next amendment goes.

## Amendment - 2026-09-07: the consent screen becomes a notice

🔴 **Recorded here because `frontend-ui-standards.md` §10a requires a divergence to be written into the dummy
first and the reason recorded beside it**, rather than left in a decisions log the reader of the dummy never
opens.

**Owner decision, verbatim:** *"do not give user option to turn off any of those analytics or anything, it's
a free production, just mention we use that to improve the product, with no option to opt out, they can just
not use the product if they so not like it"*, and then *"keep it simple 1 line we collect to improve the
product for everyone, sweet and simple"*.

That supersedes the 2026-09-03 decision this dummy was drawn against, which put four providers behind a
first-run dialog with every one off until accepted.

**Files amended, and what moved:**

| File | Change |
|---|---|
| `consent.html` | Four switches and two answers become one heading, a `Never sent` panel, a disclosure, and one `Continue`. Title now `What the window sends` |
| `page-consent.js` | Writes a *seen it* flag rather than a per-provider map. The comment at its head records what survived and why |
| `index.html` | Home's privacy ledger lists the four destinations as facts with an `on` badge, and gains the `Never sent` paragraph |
| `wire.js` | `renderConsent` paints stated facts, not switches |
| `elevation.html` | The runs folder is `%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\`. It said `windowsweep-desktop`, and so did the app - **parity was a match, so no parity check could find it** |
| `splash.html` | The update band no longer promises installation on close, which Tauri's updater does not do. Now *"Install it now, or carry on and install it later."* |

**Two things kept deliberately.** The engine's zero-network fact, because it is a published claim and still
true - the decision covers the desktop window, never the command-line tool. And the `Never sent` list,
because a notice with nothing checkable in it is an announcement: the Bible's band R delivers reassurance as
a **specific refusal**, and naming what never leaves is that refusal. Cutting it would have made the screen
shorter and worse.

**One thing removed on principle.** A switch a person can press that changes nothing is worse than no switch,
because it is a promise the product does not keep. So the ledger states rather than offers.

⚠️ **This re-opens `desktop-safety`**, a GATE-4-recorded storytelling surface covering Consent and Elevation.
The keeper owes it a pass.

## Amendment - 2026-09-07 (later): Home's twelve bands, and three states the dummy never specified

The GATE 4 round-3 pass was the first to judge these screens against a build that could reach the engine.
Rounds 1 and 2 had measured a Home that rendered one band, because three stacked defects refused every
engine call - so their numbers were right by accident. Judged properly, **Home implemented 4 of the 12
bands** and declared none of the eight gaps, Sections had lost its filter row and its tier vocabulary, and
Run had no per-section surface for progress events that were already arriving.

Eight bands were built and four gaps are now declared in the app's own UI, which is what §10a requires.
**Nothing was edited out of the dummy to match what is built** - the dummy keeps specifying the finished
product, and three of those declarations are `pending-wave` for exactly that reason:

| The dummy still specifies | Why the app declares instead |
|---|---|
| The drive rails and the capacity ring | The engine's `--json` summary carries **no drive or free-space field at all**, and the dummy's own figures here are seeded. A real one needs an engine field, which is frozen outside a version cascade |
| The weekly schedule switch | `--install-task` is not in the Rust argument allowlist, so this window cannot ask the engine to register the task. The engine does it itself from a command line |
| Idle shading and the `Idle (days)` column | `ScanTarget` is `{section, label, path, bytes}` - the scan reports a size and **no age**. The dummy's own `idleScale` degenerates to exactly the value the app uses when the idle range carries no information |
| Clicking a tile to keep it out of the next run | `ExcludePaths` is read by `modules/projects.ps1` and nowhere else, so `--exclude-path` cannot keep a browser or npm cache out of a safe run. A tile you had clicked would still be deleted - **which is why sentence two of `index.html:74` cannot ship as written, and this row is the amendment that says so** |

**Three states the dummy did not specify, added here rather than invented in the app.** This is the part
worth remembering: the app had already written words for two of them, which is the wrong way round. The
dummy owns the words.

| State | Where | Reachable as |
|---|---|---|
| Home before anything has been scanned | `index.html`, `[data-ws-map-empty]` | `index.html?empty=1` |
| The last-eight-runs band with no history | `index.html`, `[data-ws-spark-empty]` | `index.html?empty=1` |
| **A run the engine refused** | `run.html`, `[data-ws-run-fail]` | `run.html?failed=1` |

The failed-run state is the one that mattered. The page carried Ready, Running, Finished and Cancelled -
and `Cancelled` is a different thing, because a person chose it - so a run the engine refused fell through
to **"The run finished."** over a run that never started. A first draft of those words claimed nothing was
left half-deleted; that asserts per-step atomicity nobody can promise, since a folder delete can fail
partway on a locked file, so it was replaced before the app copied it.

**Six labels restored, not substituted.** An implementation pass had shown the engine's own section keys -
`wu`, `cleanmgr`, `dism`, `hiberfil`, `eventlogs`, `vhdx` - and declared the substitution, reasoning that a
second set of names would drift out of step with `--list --json`. The rule is the other way round: the dummy
owns the words, and **section numbers are frozen**, so a map keyed by section id cannot silently drift. The
catalogue's `title` was not an alternative either - those run to *"Windows Update + system temp
(SoftwareDistribution, Delivery Optimization, ...)"*, right for a table row and impossible in a chip. A
future admin section with no label falls back to its title, so it appears in plain sight rather than
vanishing.

⚠️ **Still owed against this amendment:** the `index.html:74` sentence *"Click one to keep it."* and the six
curated admin labels at `index.html:252-257` are now covered by the table above, but the dummy's own text
still reads as though both ship. Settling that wording is a dummy edit, not an app one.

## Amendment - 2026-09-07 (later still): D-18, and a sentence that was backwards

Closing D-18's five divergences turned up a copy defect that had nothing to do with them, and it is the one
worth reading first.

🔴 **The developer-mode state line was inverted, in the direction that understates destruction.** The app
said *"Off. Toolchain caches are left alone."* The engine says the opposite, in its own words at
`lib/actions.ps1:209-210`: with developer mode **off** these caches are *"cleared completely"*; with it
**on**, *"only files idle N+ days go"*. `lib/actions.ps1:130` is the mechanism - a dev target's `prune` or
`units` mode becomes `clear` when developer mode is off. So the window told a reader their toolchain caches
were safe at precisely the setting that empties them.

The dummy had it right all along (`wire.js:451-453`), and the app now carries the dummy's two lines verbatim:
*"On - keeping anything used in the last {N} days"* and *"Off - every cache is offered in full"*. The
supporting note also lost its hardcoded *"last hundred days"*, which had begun contradicting the adjustable
idle window directly beneath it; the dummy's own numberless sentence replaces it.

**Two amendments here, both because the dummy was describing the CLI where the window differs:**

| Where | Was | Now, and why |
|---|---|---|
| `index.html:307` | `%USERPROFILE%\.windowsweep\logs` | That is the CLI's default. The window passes `--logs-dir` on **every** run, so no log ever lands there. It now shows the engine's own answer - the directory of the `log_file` the run reported - and says so plainly before any run has written one |
| `run.html:129` | `windowsweep --all --yes --json` | Built from the same helpers that construct the real arguments, so it cannot drift from what the app runs. `--json` is prepended by the Rust side, hence its position, and `--days` is now a real flag the window passes |

**One capability declared rather than built, and the dummy keeps specifying it:** *"Held back right now"*. The
engine sizes each target with `Get-DirectoryBytes` - its size **on disk** - and prints that caveat itself at
`lib/scan.ps1:77`. Nothing in the `--json` summary reports how much the idle gate would keep, so a figure
there would be invented. The **Idle window** beside it is real and is now built: it drives `--days`, which the
engine documents and the Rust allowlist already permitted.

⚠️ **Still owed against this amendment:** six screens - history, report, picker, settings, account, elevation
- carry a status-bar middle text in the dummy that the app does not render. Not part of D-18; recorded so it
is not rediscovered.

## Amendment - 2026-09-13: the account can be deleted, and Elevation became a choice

Five dummy changes in one pass. Four close filed defects (`PENDING-TASKS.md` TASK-004, 007, 009, 010) and the
fifth builds a control the product had promised in writing and never shipped.

### 1. `account.html` + `page-account.js` - the deletion control (owner decision D14, 2026-09-12)

**Why the DUMMY changed:** the site's `/privacy` says the account can be deleted *"from there"* and names four
things that go. The desktop Account screen offered sign in and sign out, and the dummy's card offered a button
called **"Delete the cloud copy"** whose whole implementation was a toast describing itself. A promise with no
control behind it is the defect; a button that only describes what it would do is the same defect wearing a
control.

| Was | Now |
|---|---|
| `page-account.js`: a `btn btn-danger` beside Sign out, toasting *"This would delete your synced settings and run summaries"* | Gone. Deleting an account is not a second button of equal weight beside Sign out with nothing between the pointer and the deletion |
| nothing | `account.html` `[data-ws-delete]`: a band, shown only while signed in, with a heading, the sentence naming what goes, the sentence naming what stays, a typed `delete` confirmation and a destructive button disabled until it matches exactly |

🔴 **The sentence names what the DATABASE actually does, and no more.** Every user-owned table references
`auth.users` with `onDelete: 'cascade'`, so the account row takes the profile, the synced settings, the run
summaries and the contact requests with it. **`admin_audit` does not go** - it records what an administrator
did and is not the person's row. Nothing on the PC is touched: this deletes a cloud account, not files. The
second paragraph is the *limit* of the first, which is why both are there rather than one reassurance.

**No shame and no urgency language.** It sits one screen from a safety surface, and a product whose whole
argument is *"you see what goes before it goes"* cannot make leaving feel like a mistake. The typed word is
the friction; the copy is not.

⚠️ **Not exercised.** Google is the only provider and it is not enabled on the Supabase project yet, so nobody
can sign in in this build and therefore nobody can reach this control. The RPC, the words and the code path
are built; a live deletion is not.

### 2. `elevation.html` + `page-elevation.js` - the screen became the choice its own lede described

The lede has said *"When you ask for **one** of these"* since the dummy was drawn, and the screen ran all six
admin sections. The dummy decides, and it decides in favour of the copy.

| Change | Why |
|---|---|
| A `switch` on each admin card | The per-section choice the lede already promised |
| A three-option `seg` on section 15 instead of a switch | `--hiberfil off/reduced/keep` is the engine's own vocabulary and a switch cannot say which. With no value `modules/system_admin.ps1:171` prints *"pass --hiberfil off\|reduced\|keep to run this section unattended"* and returns - a **silent no-op behind a UAC prompt**. `keep` means "not chosen" |
| `[data-ws-deep-gate]`: a `note note-danger` naming what each CHOSEN deep section does, plus one confirming switch | `modules/runner.ps1:89-92` refuses every `Batch = 'deep'` section without `--i-understand-deep` - 15, 16 and 20 of the six offered - so the screen listed six and could run three. The flag authorises clearing every Windows Event Log permanently, removing `hiberfil.sys` with Hibernate and Fast Startup, and stopping Docker Desktop and every WSL distro. That is a decision, so it is asked, never defaulted |
| A `[data-ws-elevate-blocked]` line under the buttons | The reason a control is blocked belongs beside the control, never in a toast a person has to provoke |
| Section 20's card declares developer mode when it is off | `modules/runner.ps1:105` skips ids 4, 17 and 20 with developer mode off. Declared on the card rather than discovered in the log |
| The status bar's `six sections need an elevated window` became `[data-ws-text="elevateCmd"]` | That sentence stops being a fact once the screen is a choice. It now shows the invocation, built from the same choice the buttons run - `run.html:132`'s rule, so a sentence cannot drift from the flags |

**The dummy's "This window tails the log" wording was already correct and is unchanged.** What was wrong is
that it was not TRUE: the elevated child is a separate process in its own console (`lib/safety.ps1` ->
`Start-Process -Verb RunAs -Wait`), so nothing it prints reaches the parent's stdout, which is the only stream
this window receives. The app now reads the child's own log and report out of the shared run folder. No dummy
change was owed for that - a code change was.

### 3. `reclaim-map.js` + `index.html` - the map is one tab stop, the table carries the control

Decided 2026-09-08 under the agent's design authority; TASK-009.

`role="img"` on the `<svg>` makes its subtree **presentational**, so the 28 tiles' `aria-label`s were each
computed and then discarded while all 28 `tabindex="0"` stops remained - 28 of Home's 58 focusable stops,
**48% of the page**, announcing roughly nothing. The cost of both approaches with the benefit of neither.

| Was | Now |
|---|---|
| `<svg role="img">`, not focusable | `tabindex="0"` - one stop, carrying the summary label |
| each tile `tabindex="0" role="button" aria-label=...` | each tile `tabindex="-1"`, no role, no label. `-1` rather than omitted, so a tile can still be focused programmatically |
| a tile `keydown` handler for Enter and Space | removed - it went with `role="button"`, and a key handler on something no keyboard can focus is code that can never run |
| `buildTable(mount, data)` - five data columns | `buildTable(mount, data, onToggle)` - an **In the run** column of labelled switches first, `data-path` on the row and the switch, and the column omitted entirely when no handler is passed (the Run screen's map is a drain, not a control) |
| `index.html` `The same data as a table` | `The same data as a table, with a switch for each target` - otherwise the control is discoverable only by opening a disclosure labelled as though it held nothing but numbers |

`wire.js` writes the toggle once through `db.toggleExcluded` and paints both views in place. Rebuilding the
table would throw away the focus of the person using its switches, which is the group the column exists for.

### 4. `shared.css` - a 44px hit area on every switch, with no visual change (TASK-010)

`.switch` at `--sw-w: calc(1.9rem * var(--density))` measures **30.4 x 17**, and 19 of them sit on the
Sections table. That is a **pointer** problem, a different argument from the touch floor that lets `.btn-sm`
stand at 28px in a desktop-only window: a 17px target is hard to hit with a mouse whether or not a finger is
involved.

A `.switch::before` overlay, centred, `min-width`/`min-height: 44px`, painting nothing. The pill, the knob,
the row rhythm and every GATE 4 screenshot are untouched, because a transparent pseudo-element has no
appearance. Measured in the running app: the control box is **30.4 x 17 with the rule and 30.4 x 17 without
it**, while the hit area is **44px x 44px** with and **auto x auto** without. `min-*` rather than a fixed
size, so a switch already larger than 44px keeps its own box.

### 5. `picker.html` - a dead class a previous edit duplicated instead of removing (TASK-007)

`picker.html:120` read `class="t-sm ink-3 t-sm ink-3"`. Commit `6f4706f` removed the dead `selbar-note` -
which resolves to nothing in either stylesheet - and left the two remaining class names written twice. Now
`class="t-sm ink-3"`. The app had already dropped `selbar-note` and records why in `Picker.tsx`.

**Sweep result, on the record:** every `className` string in `desktop/src` was extracted and compared against
the 333 selectors in the app's own CSS. **Zero orphans.** Three apparent hits were checked and are not
classes: `className` (a variable in `PrimaryButton.tsx`), `done` (a comparison value in `RunPerSection.tsx`)
and the `tier-` template prefix, whose six real classes all exist.

### Owed, and deliberately not taken here

🔴 **"Measure without elevating" DID elevate - FIXED in the main session the same day, and the dummy needed
no change, because its words were always right and the app was wrong.** `elevateDry` passed `--dry-run`
alongside `--elevate`, and `windowsweep.ps1:294` relaunches on `--elevate` regardless of the mode - so the
button labelled *"Measure without elevating"*, and the note under it saying a scan can measure these sections
without administrator rights, both described something the invocation did not do.

The invocation that was "not obvious" is settled by the dummy's own sentence: **it is a scan**. `--scan` is
not scoped to six sections, and does not need to be - it sizes every target (`Show-ScanTable` never reaches
the runner's admin skip at `modules/runner.ps1:98`), and the screen sums only the targets whose section was
chosen. That is precisely what the toast's words already say: *"Measured 15.9 GB across the sections you
chose."* So the app now runs `scanArgs`, reports the chosen sections' total inline in that sentence (the
number is a live quantity, the carve-out §10 allows), and refreshes Home's map with the same measurement.
The unelevated `--dry-run --only` the old code would have fallen back to if the prompt were declined measured
nothing at all, because the runner skips every admin section before reading a byte.

🔴 **It cannot come back by accident.** `elevatedArgs` no longer accepts a `dryRun` option, so a rehearsal of an
elevated run - which would still pass `--elevate`, and so still prompt - is a compile error. Planted on
2026-09-13: `dryRun: true` in the screen's builder call -> `TS2353: Object literal may only specify known
properties, and 'dryRun' does not exist`; restored, typecheck green.

## Amendment - 2026-09-13 (later): GATE 4 round 7

Round 7 (`gate4/GATE4-REPORT.md`, R7.x) came back not clean. Six of its findings were the dummy's to change
first, and one decision gave a live number its quantity. Each change below is the dummy moving so the app can
carry its words verbatim; none edits the finished product down to what is built.

### 1. `index.html` + `wire.js` - the developer caption follows the switch (D-25), and two Home details (D-36)

| Was | Now, and why |
|---|---|
| `index.html:130` one fixed caption: *"Caches you have used recently are left alone, so your next build is not a cold one."* | `[data-ws-text="devNote"]`, set in `refresh()`. With developer mode OFF the page read *"Off - every cache is offered in full"* directly above that sentence - false at that setting, in the direction that understates deletion (the engine clears every dev cache completely, `lib/actions.ps1:130`). Off now carries this dummy's own words for it, from its Settings row: *"Nothing is being held back - every cache is offered in full."* The two lines overlap in the OFF state; the dummy's words were kept over new prose, and the keeper may tighten them |
| "Include everything" pressable with nothing excluded - a no-op | disabled while `excluded` is empty, as the app does |
| the idle window's value appeared only inside the count sentence | the label carries its reading, `[data-ws-text="idleReadout"]` ("100 days"), as the app does - the slider no longer moves in silence |

### 2. `page-settings.js` - the developer row's consequence (D-26)

It printed *"Right now that holds back -."*: `fmt.bytes` was handed the ARRAY `heldByDeveloperMode()` returns,
not its total. And the figure the app shows there needs a scan AND a dry-run, so every session starts with it
unmeasured - where *"Right now that holds back not measured."* is not a sentence. It is now label and value,
the Home well's own caption: *"Held back right now: 17.3 GB."* / *"Held back right now: not measured."*;
`settings.html?empty=1` renders the second, the way `index.html?empty=1` renders Home's empty states. Off is
unchanged: *"Nothing is being held back - every cache is offered in full."*

### 3. `page-elevation.js` + `elevation.html` - the command line (D-27) and the measured note (D-28)

- `commandLine()` gains `--days`, `--temp-days` and `--large-file-mb`: D-8 put them on every run and the Run
  screen's line was amended for them; this one was not. The status slot's static text now equals what renders
  by default, so it cannot be D-21 again.
- "Measure without elevating" answers in `[data-ws-measured]`, a `note note-info` with `role="status"` beside
  the control, instead of a toast. The house standard is that a result lands where the person is looking and a
  toast is the fallback; the app already did this.

### 4. `picker.html` + `page-picker.js` - sections 18 and 19 (D-37)

The chips and `META` described 18 and 19 the wrong way round against this dummy's own `seed.js` and the engine
catalogue (18 `partials`, 19 `large`). Both texts had in fact been written about section 19's two faces - its
size threshold, and the installers and archives it finds - and neither about 18. Section 19 keeps the one that
names its threshold (the setting Settings controls). Section 18 takes the engine's own description of it
(`modules/personal.ps1`, `Invoke-Section18`: *"Half-finished downloads left behind by browsers and download
managers"*) and keeps this dummy's Downloads-only sentence, which is true of both. Chip 18 reads
`18 · partial downloads`. The page also reads `?section=`, which Home's "Choose items" has always passed and
this page ignored, so every card opened section 17. ⚠️ This re-opens `desktop-cockpit` S-038 and S-039; the
keeper owes them a pass.

### 5. `page-account.js` - the sign-out sentence (D-38, signed-in state)

The app's signed-in card carries *"Signing out clears every local trace of the account, including the rows
cached from your other machines."* under Sign out, and the dummy owns the words, so it is written here. It is
exact since 2026-09-13: sign-out is scope `'local'`, which ends this machine's session and never the same
person's session on the website sharing the account.

### 6. Which quantity the Reclaim button's live number fills - no word changes

The button's sentence stays *"Reclaim {amount}"*. `{amount}` is **what the safe run frees** - the ladder's own
total, `safeRunBytes` - and the Run screen's idle hero carries the same figure; the Home hero keeps the total
reclaimable. The seed made the two equal (every seeded target sits in a safe-batch section), so this dummy
never decided; the button's own word, "Reclaim", does. The same decision puts only the listed sections' tiles
on the Run screen's "What is going" map. Decided by the main session on round 7.

### Not amended, and why

- **Settings' status note, *"settings sync when you are signed in"*, and Account's *"What happens when two
  machines disagree"*** stay in the dummy and are withheld from the app: nothing in the window syncs yet
  (`src/lib/sync.ts` has no caller), and both describe behaviour no code performs. They arrive with the sync
  wiring, or the dummy withdraws them - the main session's call.
- **The populated Picker's frame** - the section chips, the table, the note, the file disclosure and the
  selection bar - is not yet the app's; the app's Picker still carries words this dummy never had. It was
  unreachable until round 7's D-23 was fixed, so no round has judged it. Owed next, with one decision this
  dummy must make first: a section nothing has asked the engine about yet.

## Amendment - 2026-09-13 (later still): what round 8 would otherwise flag

Round 7's fixes were accepted; this pass closes what was left on its list, dummy first. Where the app had
written words before the dummy had them, the words move here now and the log says so - that order was the
wrong way round. Nothing below edits the finished product down to what is built.

### 1. `picker.html` + `page-picker.js` - the populated Picker, and the section nothing has asked yet

The frame round 7 could not judge (the app's Picker was unreachable until D-23) is now the app's too: the
section's own header, the chips and filter, the table, the note, the file disclosure and the selection bar.
Four changes to the dummy came first:

| Was | Now, and why |
|---|---|
| every section seeded, so the dummy never drew a section the engine had not been asked about | `picker.html?empty=1` draws it: *"Nothing has been offered yet."* over *"A dry-run costs nothing and deletes nothing."* and a **Dry-run** button. In the window the engine is the only source of these rows and offers a section's list only once a run has asked, so "never asked" and "asked, nothing here" are different facts with different words. The title line was the app's (it had carried it since the Picker was built - app first, the wrong way round); the body is this dummy's own History and gallery sentence, the button its Sections button |
| section 17 listed whatever the seed held with developer mode off | *"Nothing to choose here"* over *"Developer mode is off, so the engine skips this one. Turn it on in Settings first."* - Elevation's words for section 20. The engine skips 17 outright in that state (`modules/runner.ps1`, the 4/17/20 rule), so offering its rows would promise a deletion the run will not make |
| the header's count was every chosen row, divided by the rows of the section in view - two rows ticked in 17 read "2 of 2 chosen" over section 18 | the header speaks for the section in view (its chosen bytes, "N of M chosen" of its own rows); the selection bar keeps speaking for the whole selection ("across sections 17, 23") |
| *"Cleared."* toast with Undo | no toast: every switch goes off and the bar slides away, which is the answer where the person is looking (the D-28 rule below) |

The command line in the disclosure now follows the section in view (`--only 23` over section 23); its file path
stays an example (`demo-data`).

### 2. `picker.html` + `page-picker.js` - "Drive this from a file instead" is the gallery's upload field, working

The zone was a static stub whose button raised a toast of invented figures. It is now the gallery's whole
field (`g-forms.js`, "specialised"): the **Selection file** label, the **?** affordance stating *Purpose*,
*Types*, *Max size* and an *Example* before the pick, the zone, and its states. A dropped or chosen file is read
in the page and matched the way the engine reads a `--select-file` (`windowsweep.ps1`: each line trimmed, blank
lines and `#` comments skipped; `lib/ui.ps1` `Resolve-SelectedPaths`: case-insensitive against the candidates
this section offers). Matches are ticked and added to the selection; nothing is uploaded, and "Remove these"
still carries the selection.

| State | Words |
|---|---|
| idle | *"Drop a selection file here, or choose one"* (unchanged) |
| dragging | *"Release to read it"* (the gallery's) |
| done | *"4 paths, 2 matched"* - the gallery's *"402 paths, 397 matched"*, with the file's own numbers |
| rejected, size | *"That file is 300 KB - the limit is 256 KB"* - the gallery's sentence, with the file's own size |
| rejected, type | *"notes.csv is not a .txt or .list file"* - **new**, one plain functional line |
| rejected, unreadable | *"That file could not be read."* - **new**, one plain functional line |
| per unmatched line | *"No candidate here matches D:\work\nothing\here"* - **new** as copy, but it is the engine's own note (*"--select-file: no candidate here matches $want"*), shown before the run rather than after; past twenty lines the rest read *"and N more"*, the safe-run ladder's words |

The limits the affordance prints are the limits enforced (`.txt`/`.list`, 256 KB) - the gallery's own rule
under this field. The unmatched lines sit in a `note note-warn` under the zone.

### 3. Four acknowledgements move from a toast to the control (the D-28 class)

§12: a result lands where the person is looking, and a toast is the fallback. Round 7 filed the channel on one
control (D-28); these four were the same class.

| Where | Was | Now |
|---|---|---|
| `index.html` + `wire.js` - Include everything | *"Every target is back in the run."* toast | the button's own done state (700 ms); it is disabled again at once, since nothing is left to include |
| `index.html` + `wire.js` - the weekly schedule switch | *"Weekly task registered. It runs the safe batch only."* / *"Weekly task removed."* toasts | a `role="status"` line beside the switch, `[data-ws-text="scheduleAck"]`: *"Scheduled for Sundays at 03:00."* / *"The task was removed."* for 4 s. These were the app's words (`home.scheduleDone`, `home.scheduleRemoved`) - app first, now drawn here |
| `page-settings.js` - the developer switch | *"Developer mode on - recent caches are kept."* / *"... off - those caches will be cleared completely."* toasts | none: the consequence line under the title re-renders with the switch |
| `page-settings.js` - the schedule row | the switch alone | the same status line beside the switch, the same words as Home's |

### 4. `page-run.js` - the queue is the whole safe batch

The per-section list showed only the sections with seeded tiles, but the engine also runs the batch's
report-only sections (0 health, 21 disk usage) and reports progress for each, so the list disagreed with its
own "N of M". The measured sections come first, biggest first (the ladder's order - a rule, not `demo-data`,
so the app follows it); the rest follow in catalogue order with no figure, as the app draws them.

### 5. `app.js` - the Admin rail entry draws its own icon

`NAV` has always named the Admin entry's icon `backend`, and the icon map never defined it, so `svgIcon` fell
back to `doc` - the same mark as Reports and Components. The map now draws `backend`, the path the app draws.
The app did not change; the dummy now matches what its own `NAV` asked for.

### Declared rather than amended

`gate4/GATE4-REPORT.md` carries the list, appended the same day: the two sync sentences (`pending-wave`,
TASK-013), `app 0.1.0-design` (`prototype`), and every toast still in the dummy, each with its class. The
Remove-these, scan, dry-run and Reclaim toasts stay: each stands in for a run this dummy cannot perform.

## Amendment - 2026-09-13 (round 8): the removal path, and Home before a scan

Round 8 (`gate4/GATE4-REPORT.md`, R8.4 and R8.6) closed round 7 and found three blockers on the Picker's
removal path, which no round had reached before. All three were the dummy's to change first. Two of its gap
findings were the dummy's alone. The app followed each change; its own items are listed at the end.

### 1. `shared.css` - the selection bar's segment joins the ink reset (D-47)

`.selbar` swaps to the bleed inks, and the reset list that hands a segment back its base inks only named
`.band-bleed .seg`. In light theme the selected "Recycle Bin" read 1.09:1, and "Permanent" 2.24:1.
`.selbar .seg` is now in the list, with a comment naming it the fourth occurrence. Measured after, both
sides, a row chosen:

| theme | selected option | unselected option |
|---|---|---|
| light | 16.74 : 1 | 4.87 : 1 |
| dark | 15.52 : 1 | 6.67 : 1 |

### 2. `picker.html` + `page-picker.js` - a Permanent removal is confirmed first (D-48, decided)

Decided 2026-09-13 (`docs/story/decision-log.md`, "GATE 4 round 8's decision point D-48"). With the mode on
Permanent, "Remove these" opens the gallery's destructive alert dialog (`g-overlays.js`, "alert
(destructive)") as `#pick-confirm`. Cancel is focused first, Escape means Cancel, and only "Remove
permanently" goes on. Recycle Bin mode keeps its single press, because it is recoverable.

| part | words |
|---|---|
| title | *Remove {count} item permanently?* / *Remove {count} items permanently?* |
| body | *They do not go to the Recycle Bin. Permanent has no undo.* - the second sentence is the bar's own |
| buttons | *Cancel* · *Remove permanently* |

The stand-in toast for both modes is gone. It promised the confirmation ("This would ask you to confirm…")
without providing it, and told the Recycle Bin story ("Sent N items to the Recycle Bin") about rows of 17
that never reach it. A removal now goes to `run.html`, the way Sections' "Run selected" does. The window
opens its Run screen at the same point. So `A-2`'s entry for `page-picker.js:289` describes a toast that no
longer exists.

### 3. `picker.html` + `page-picker.js` - what the mode governs (D-49, decided with D-48)

Section 17's artefacts go through `Remove-PathSafe` whichever mode is set (`modules/projects.ps1:157`).
While one of its rows is chosen, the consequence line ends: *"Section 17's rows are deleted outright
whichever you choose; this choice covers 18, 19 and 23."* It is hidden otherwise.

**One layout change came with it.** On one row, the longer line squeezed the bar's own controls: "Remove
these" broke onto two lines, and so did the figure. So the bar wraps, and the consequence line takes a
full-width row of its own under the controls. The window draws the same.

### 4. `index.html` + `wire.js` - `?empty=1` is the whole of Home before a scan (D-53)

It emptied only the map and the last runs, while every other band stayed seeded. So the window's
before-a-scan words had no approved counterpart. They were app-first, the wrong way round. They are drawn
here now:

| band | before a scan |
|---|---|
| hero | *not measured* · *Nothing has been measured yet. A scan reads sizes and deletes nothing.* · **Scan** · **Scan first** (disabled) · the ring is not drawn |
| map | the existing panel; the table keeps its header and has no rows; the legend has no tier chips |
| drives | each rail's free space, and *not measured* for its reclaimable slice |
| developer mode | *not measured*, with no count line |
| ladder | every rung of the safe batch, in catalogue order, *not measured*; *and 7 more*; the total *not measured* |
| these need a person | *nothing offered yet* · *0 items waiting* |
| last runs | the band's own panel carries the two lines; the figure, the chart and "Open the report" step aside. It used to be a panel inside the panel, beside a seeded figure, and it now has the window's anatomy |
| rail foot | *-* · *across 0 sections* |

### 5. `index.html` + `seed.js` + `wire.js` - what is never touched, in the engine's words (D-52)

Under the chip field: the window's lead *"And these kinds of thing, wherever they are:"*, then the engine's
four category sentences, verbatim (`seed.js` `PROTECT_CATEGORIES`, copied from `WS_PROTECT_CATEGORIES`,
`lib/constants.ps1:33`). These are the engine's words, not seed text.

### 6. `app.js` - the drawer says what it opens (D-54)

The Menu button carries `aria-controls="ws-rail"` and an `aria-expanded` that follows the drawer. Escape
closes the drawer. This is what the window already did.

### The app's own round-8 items, no dummy change

- D-39: the map's before-a-scan note is the dummy's panel instead of a note clipped to 1 px.
- D-40: the bar slides again (Tailwind's layered `[hidden]` rule beat `.selbar[hidden]`).
- D-43: Consent's status note.
- D-44, the Home half: *safe batch* / *sections …* instead of the engine's mode, and a scan is no longer
  listed as a run.
- D-45: the drop zone's hidden button is named by the field's label.
- D-46: bytes print as `fmt.bytes` does (whole KB), and the two heroes as `bytesParts` does (two decimals).
- D-50: Run at rest shows the idle line.
- D-51: `--list --json` is set in code.
- The held-back well's two columns now match this dummy's.

