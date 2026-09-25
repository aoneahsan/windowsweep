# desktop-sync-strings - the Sync band's new lines, Home's notice, and History's other machines

Content-map rows **11** (`desktop-moment`: Home and the Account screen) and **13** (`desktop-cockpit`, the History
screen). Row 11's tone bands are **P and R**; row 13's is **P**, with **W** allowed only in an empty state. The
structure is row 11's (the number, then what it will touch, then the action), turned towards what sync adds: a line
that says what Remove touches before it is pressed, the failures (what did not happen, then what it touched, then
what comes next) and a replacement (what happened, what it means for a run, the way back). The framework is Walter's
hierarchy for the failure lines and the two notices, which say what happened and what follows before any
personality is allowed. Here they carry none. Remove's line takes the account-deletion band's order (what goes,
then what stays) and ends on Bible section 10's no-undo rule. The two empty states are BAB, and their bridge is a
finished run.

TASK-013 wired the desktop app's sync. The wiring needs strings that no approved artefact carries (decision log,
2026-09-24). **Round 1** applies the owner's D39, D40, D41 and D42, the main session's decision that Account states
what Remove does before it is pressed, the developmental editor's five findings and the line editor's note. Seven
slots.

Status: **publish-ready, finalized 2026-09-25**. Round 1 closed with a fact-check PASS (decision log, *2026-09-25 -
`desktop-sync-strings` round 1 closed*). The finalizer changed no shipping string. It moved the credit for SY-06's
order from Bible section 10 to the account-deletion band, answered the fact-checker's two record gaps from the log
(SY-03) and recorded one superseded note (item 9 under *Found elsewhere*). GATE 4 for rows 11 and 13 is the
owner's own, so nothing here ships until he approves it with the dummy.

## Conventions

This is a slot inventory in the format of `desktop-moment.md` and `desktop-cockpit.md`, numbered SY-01 to SY-07 so
no slot collides with theirs. The two new slots take the next numbers, and every round-0 number stands. The string
that ships sits inside the fence. Outside it, in this order, come the catalogue key, the place in the click dummy,
the condition that shows it, what stood there before, and the reason it reads as it does. Apostrophes are typed
straight, as in the other desktop drafts; the catalogue's curly ones apply at transcription. Every new or corrected
line goes into the dummy first (IRON rule 12).

Every behaviour a line describes was read in the code and is cited by function name, under `desktop/src` unless
another root is named. Nothing here is a guess. Where a line needs behaviour the code does not have yet, it is
written for what was decided and the change is listed under **Needs code**; where nothing has decided it, the slot
carries a `NEEDS DECISION`.

| Slot | Screen | What it is | Keys |
|---|---|---|---|
| SY-01 | Account | the run list's empty line | `account.runs.empty` |
| SY-06 | Account | what Remove does, above the list (new) | `account.runs.removeNote` |
| SY-02 | Account | four failures in seven keys | `account.sync.failed.*` |
| SY-03 | Account | the conflict notice and its Undo | `account.sync.conflict.notice`, `account.sync.conflict.undo` |
| SY-07 | Home | the same event, above the run control (new) | `home.settingsReplaced` |
| SY-04 | History | the Where cell of another machine's row | `history.whereOtherMachine` |
| SY-05 | History | `history.cloudPending` removed, the title corrected, two bodies enter the catalogue | `history.cloudEmptyTitle`, `history.cloudEmptyBody`, `history.cloudEmptyBodySignedOut` |

---

## Account - the Sync band (`account.html`, `page-account.js`)

### SY-01 - `[data-ws-cloud-runs]`, the run list's empty line

**Key:** `account.runs.empty`, beside its siblings `account.runs.title`, `account.runs.summaryOnly`,
`account.runs.remove` and `account.runs.removeNote` (SY-06).

```
Your account holds no run summaries. When a run finishes in the desktop app on any machine signed in as you, its summary appears here; runs from before you signed in stay on this machine.
```

**Placement:** under the list's own heading, Run summaries, in place of the table and its pager. The box stops
hiding itself for an empty account.

**Shown when:** signed in, the first read succeeded, and the account holds nothing, which includes the moment after
the last Remove. `CloudRuns` returns null today for loading, for a failed first read and for an empty account alike,
so this line and SY-02c need those three states told apart (Needs code, 5).

**Was:** nothing.

**Change:** new in round 0; round 1 widens the bridge. `CloudRuns` reads the list through `fetchRuns(uid)`, which
filters on `user_id` and nothing else (`lib/sync.ts`), and `pushRun` writes no machine column. So a run finished on
any machine signed in as you fills this list, and round 0's "in this window" named one route of two. "In the desktop
app" keeps the limit the old wording carried, since the weekly task and the command line never upload. The clause
after the semicolon stays. A reader who sees "0 of 8 runs uploaded" above an empty list would assume eight uploads
are queued, when `runFinished` sends nothing while nobody is signed in and `startSync` retries only what failed after
a sign-in. The clause speaks of this machine, which this window can see. There is no "yet", because the line also
follows the last Remove, where "yet" would misdescribe a list the person has just emptied. No button either: History's
empty states carry none, and this one's bridge is the run itself.

### SY-06 - what Remove does, before it is pressed

**Key:** `account.runs.removeNote`

```
Remove deletes one run's summary from your account; it touches no log or report on this machine or any other. There is no undo.
```

**Placement:** row 11's "what it will touch" slot. It sits under the list's heading, Run summaries, and above the
table, so it follows the band's "N of M runs uploaded" and comes before the first Remove and before SY-02d, whose
"press Remove again" assumes the reader was told once. Each Remove's `aria-describedby` names its row's When and then
this line (Needs code, 5).

**Shown when:** signed in and the list holds at least one row. It leaves with the last row, when SY-01 takes its
place.

**Was:** nothing. Round 0 reported the gap (item 4 below), and the main session decided the line.

**Change:** new. The order is the account-deletion band's, `account.deleteWhatGoes` before `account.deleteWhatStays`:
what goes, then what is not touched. The last sentence keeps Bible section 10's "Never imply a deletion is
reversible", a rule that sets no order. What goes carries no "only", because a Remove reaches past the account.
When this machine sent the
run, `removeCloudRun` also drops its id from this machine's `uploaded` ledger (`lib/sync-session.ts`), and the band's
count changes with it. "The account only" would repeat the overclaim Bible section 3 corrected for the dry-run. The
refusal is the R band's specific one, and it names what Remove does not reach rather than where anything is. The
press touches no file anywhere. `deleteRun` removes one row from `runs`, and the ledger is a `localStorage` record
(`lib/sync-local.ts`). The line does not borrow `account.neverStored`'s "the detail stays on the machine that
made it", which asserts a file this window cannot see. "There is no undo" because nothing in the app puts a removed
summary back; the delete band's "there is no undo" is the precedent. No "recommended", no confirm, no humour.

### SY-02 - four failures, seven keys

The brief offered one line with a `{{what}}` variable for all four failures. It would be false twice. After a failed
settings write the person's own change is still on this machine, so "nothing on this PC changed" reads as a revert of
it; and the app never retries a failed Remove, so "it will be tried again" would describe a behaviour that does not
exist. The i18n law points the same way, because a translated action spliced into a translated sentence is a
concatenated fragment that works in English and nowhere else, the defect `desktop-cockpit.md` already reported in
`pickWhere`. So each failure gets whole sentences of its own under `account.sync.failed.*`, and every one keeps one
shape: what did not happen, what it touched on this machine, what happens next.

The wording says "this machine" where the brief said "this PC". The Sync band's own nouns are "machine name" and "two
machines", and the sign-out line promises "Everything on this machine stays exactly as it is"; "this PC" belongs to
the account-deletion band underneath.

None of the four is a toast, because the app ships no toast component (`ScheduleSwitch.tsx`), so each sits beside
the thing that failed. None carries W, which row 11 does not allow.

#### SY-02a - settings, one key for each direction

**Keys:** `account.sync.failed.settingsRead` and `account.sync.failed.settingsWrite`, where round 0 had one,
`account.sync.failed.settings`.

```
Your account's settings could not be read, so this machine keeps its own. windowsweep tries again the next time it starts.
```

```
Your latest settings have not reached your account. On this machine they stay exactly as they are, and windowsweep tries again the next time it starts.
```

**Placement:** a second line in the Settings row, under "Local only" or its last "Synced ..." time, which stays where
it is. One line at a time. A later failure replaces an earlier one.

**Shown when:** `settingsRead` shows when a `fetchSettings` throws, either in `reconcile` before anything is applied
or in `save()`'s stale branch after the account turned a write away. `settingsWrite` shows when a `pushSettings`
throws, either in `reconcile` after this machine's side won or in the debounced write `settingsChanged` schedules.
Neither shows when the account's settings were applied and only the write-back failed, because the account already
holds those. The next round-trip that moves the "Synced ..." time clears either.

**Was:** nothing.

**Change:** new in round 0, split in round 1. Round 0's one sentence, "Your latest settings have not reached your
account", named one direction of a two-way failure. A read that fails at boot is the other direction. The account's
newer settings, if it holds any, have not reached this machine either, and after D40 that is the case the reader
most needs to hear, since the synced developer switch decides what a run keeps. To someone who changed nothing here,
round 0's sentence read as an upload failure. So the key splits by the step that failed, as SY-02c split by page.
The read line takes SY-02c's own shape ("could not be read"), and "keeps its own" says which settings a run started
here will follow. The write line is round 0's. Unchanged. "Stay exactly as they are" borrows the sign-out line's
promise, because the literal "nothing changed" would contradict the setting the person has just changed here.
"Latest" stops it arguing with a "Synced 12 minutes ago" printed beside it. Both retries are real: `restoreSync`
runs at boot (`App.tsx`), and `reconcile` reads and then writes again. A later settings change here retries sooner,
which neither line says.

#### SY-02b - a run summary's upload

**Keys:** `account.sync.failed.upload_one` and `account.sync.failed.upload_other`. `{{count}}` is the number of
summaries kept to try again, `readRunLedger(uid).pending.length`.

```
One run summary has not reached your account. windowsweep keeps it on this machine and tries again the next time it starts.
```

```
{{count}} run summaries have not reached your account. windowsweep keeps them on this machine and tries again the next time it starts.
```

**Placement:** a second line in the Run summaries row, under "N of M runs uploaded".

**Shown when:** the ledger holds at least one summary waiting. `useSyncStatus` holds `uploaded` and no pending count
today, so the count has to be exposed beside it (Needs code, 1).

**Was:** nothing.

**Change:** new. This is the one failure that writes something, since `upload` keeps the stripped summary in
windowsweep's own ledger so it can try again. "Nothing on this PC changed" would be false by one record, and this
product has corrected that exact overclaim before (Bible section 3, where a dry-run "writes exactly two files, both
its own"), so the sentence names the record instead of denying it. Two limits stay outside the line. The ledger keeps
fifty (`PENDING_LIMIT`). Signing out clears it through `clearRunLedger`, which `account.signOutNote` already covers as
every local trace of the account. `runFinished` retries sooner when a run finishes before the next start.

#### SY-02c - reading the list

**Keys:** `account.sync.failed.list` for the first page, `account.sync.failed.listMore` for a later one.

```
The run summaries in your account could not be read. Nothing on this machine changed, and windowsweep tries again the next time you open this screen.
```

```
The next page could not be read; nothing on this machine changed. Press again to retry.
```

**Placement:** the first in place of the table, under Run summaries; the second beside *Load 20 more*, whose
"showing N of M" stays.

**Shown when:** `readPages` returns null, or the `fetchRuns` inside `onMore` rejects.

**Was:** nothing.

**Change:** new. The brief counted one read. Two keys, because the retries differ. A first page is
read again whenever `CloudRuns` mounts, which is the next time Account opens; a later page is read again only by the
next press, as the comment in `onMore` says. "The next page" is the dummy's own phrase for a History page (S-090).
Round 1 joins `listMore`'s first two sentences with a semicolon (the line editor's note): three sentences were one
more than the surface allows an error, and the two facts are one event. Once History reads the account, the first
key's opening sentence fits there as well, provided History also re-reads on its next open, which is unbuilt.

#### SY-02d - a Remove

**Key:** `account.sync.failed.remove`

```
windowsweep could not confirm that this run summary was removed, so it stays in the list. Nothing on this machine changed, and you can press Remove again.
```

**Placement:** a row directly under the one that failed, spanning the table, announced with `role="alert"`, since the
person has just acted and would otherwise believe it worked.

**Shown when:** `removeCloudRun` rejects. The row stays where it is (`onRemove`), and the line goes with that row's
next press.

**Was:** nothing.

**Decided:** D39, *"Manual retry (Recommended)"*. The line ships as written and nothing is queued.

**Change:** new. "Could not confirm" is the hedge the code makes itself: `removeCloudRun` rejects "when the account
may still hold it", and a delete that reached the server before its answer was lost has in fact gone. Pressing again
is safe either way, because `deleteRun` treats zero rows removed as the outcome asked for. "Nothing on this machine
changed" is exact here: the ledger write in `removeCloudRun` runs only after `deleteRun` resolves. The line offers the
press and leaves the choice with the person, which matters on the one control in this band that deletes something.
SY-06 now stands above the table. The press it offers has its consequence on screen.

### SY-03 - the conflict notice, and its Undo

**Keys:** `account.sync.conflict.notice` and `account.sync.conflict.undo`

```
Your account held newer settings, so they replaced this machine's.
```

```
Undo
```

**Placement:** a second line in the Settings row with Undo beside it, one block above the "What happens when two
machines disagree" disclosure that promises both (D40). The button's `aria-describedby` points at the notice, the way
Remove's points at its row's When. SY-07 states the same event on Home for as long as this stands.

**Shown when:** `reconcile` takes the account's side (`winner === remote`), and also when a write in `save()` comes
back `'stale'` and the fresher row is applied. That second path replaces a change the person made seconds earlier.
`reconcileSettings` already returns the losing side as `replaced` (Needs code, 2). `save()` keeps none yet.
**Not shown** when the replaced side is `untouched()`, with every axis at its default and developer mode as it ships
(D41): that is a fresh machine taking what the Account table promises, *"So a second machine starts where you left
off."* **Nor** when the account's row won on date alone and changed no value, which happens when the same choice was
made on two machines separately (D42): no notice and no Home line then, the way D41 treats a fresh machine.

NEEDS DECISION (answered, D42): whether the notice and SY-07 stand when a replacement changed no value - the account's
row was newer, but every axis and developer mode match this machine's, which happens when the same choice was made on
two machines separately, because `reconcile` compares dates and never values - options (a) no notice then, the way
D41 treats a fresh machine; (b) show it whenever the account's side wins - recommended (a) because an Undo that puts
back identical values offers nothing, and a line above Home's run control announcing a change nobody can find reads
as a fault.

**Decided:** D42, *"No notice then (Recommended)"*: no Account notice and no Home line when a date-only win changes no
value, the way D41 treats a fresh machine.

**Ends:** at the next settings change on this machine, Undo included, since it is one; at sign-out; or when the
window closes. Nothing stores it (decision log, 2026-09-25). A second replacement while it stands keeps the first
`replaced`, so Undo still puts this machine's own settings back (Needs code, 2).

NEEDS DECISION (answered from the record, D40): does the notice outlive a restart? D40's first record (decision
log, 2026-09-24 (later)) ends it at the next settings change or sign-out and names no restart. Options:
*"Account + a Home line (Recommended)"*, on the Sync band until the next settings change or sign-out, plus the Home
line above the run control while it stands. Or *"Also kept across restarts"*.

**Decided:** the owner took *"Account + a Home line (Recommended)"*, not *"Also kept across restarts"* (decision
log, 2026-09-25). The notice lives in memory only. Closing windowsweep ends it, as SY-07's last sentence says.

**Undo does:** put `replaced` back through the store's own actions, dated now; then send it. Left undated, the next
start would apply the account's side again without a word. The disclosure's promise would then break with nobody
told.

**Was:** nothing. The disclosure is withheld in the app because "its Undo has no words" (`SyncBand.tsx` and
`Account.tsx`). With these strings it ships, with S-165 amended in the dummy first to the sentence D40 carries
(decision log, 2026-09-25): "The newer change wins, and this screen tells you which one it was, with an Undo that
puts the other back."

NEEDS DECISION (answered from the record, D40): was the S-165 amendment decided? D40's first record names the notice
and the Home line, not S-165. Options, the writer's: (a) the Sync band only, with S-165 amended to the sentence above;
(b) *"as (a), plus one line on Home"*.

**Decided:** the owner took (b), so the S-165 amendment is part of D40 (decision log, 2026-09-25). It goes into the
dummy with the rest (`desktop/design/AMENDMENTS-2.md`) and is shown at this surface's GATE 4. It rewords S-165's first
sentence only. No decision touches the second, which stays as approved.

**Change:** new. The shape is fingerprint specimen 7's ("Chrome was open, so its cache was left alone"): the
condition, then what it caused, with the loss in the emphatic last place. It names the account as the source. The
website never writes these settings (`windowsweep-web/src/lib/account.ts`), so a desktop window wrote them, and that
window is usually another machine, though an earlier install on this same PC is one too; "your account" is true of
both. The label is Undo because the disclosure promises that word, and the dummy's undo toasts already use it.

---

## Home - the reclaim readout (`index.html`)

### SY-07 - the same event, above the run control

**Key:** `home.settingsReplaced`

```
Your account held newer settings, so they replaced this machine's. Developer mode is one of them, and it decides what a run started here keeps. Undo is on <1>the Account screen</1> until you change a setting here, sign out or close windowsweep.
```

**Placement:** in the reclaim readout, after the sub-line (`.hero-sub`) and before the three buttons
(`.hero-actions`), so it follows the number and precedes Scan, Dry-run first and Reclaim in reading and tab order.
`<1>` marks a link to Account, the line's one control, which is what puts it in the tab order; it carries no Undo.
`role="status"`, so a replacement that lands while Home is open is announced.

**Shown when:** exactly while SY-03's notice stands, read from the same state, so the two begin and end together
(Needs code, 6). When D41 or D42 withholds the notice, this line is withheld with it.

**Was:** nothing.

**Change:** new (D40, *"Account + a Home line (Recommended)"*). The first sentence is SY-03's, word for word, so the
two read as one event. The catalogue can nest it as `$t(account.sync.conflict.notice)`, the way
`home.heroSubMeasured` nests `home.countTargets`, and then the two cannot drift apart. The second sentence says what
the event means for a run. Developer mode is the one synced setting a run reads (`localSettings()` carries the ten
appearance axes and `developer`), and it decides what is kept (`settings.developerDesc`). "One of them" names it
without claiming its value changed; under D42 the notice means some value changed, and the line still does not say
which. The app could derive that from `replaced`, but one line that is true either way needs no second key. It says
"a run started here" rather than "the next run" because the weekly task never follows this switch:
`Install-WeeklyTask` (`modules/release_helpers.ps1`) registers `--all --yes --quiet --no-color --notify` with no
developer flag, so the Sunday run takes the engine's own saved answer, or its default (`Resolve-DeveloperMode`). The
third sentence is the way back, and its three ends are the notice's own. A settings change and sign-out are D40's. Closing
the window ends a notice nothing stores, and nothing in `src-tauri` keeps the process alive in a tray. The line
blocks nothing, confirms nothing, and never says "nothing changed", because something did.

**Home's figures were checked first**, because a stale number would need a different sentence. None goes stale. A
scan is session-only (`scannedAt`, "Deliberately NOT persisted", `state/store.ts`) and `restoreSync` starts at launch
(`App.tsx`), so a replacement at boot normally lands before Home has any figure at all. Two paths can land one after
a figure: a Scan pressed before the boot read returns, and `save()`'s stale branch after a change made here. In both,
the hero stays true, because it is the size on disk and developer mode does not move it. `reclaimableBytes` reads
only the targets, and a developer cache is measured whole, then pruned or cleared only when a run acts on it
(`New-Target`, `lib/scan.ps1`). The Reclaim button re-words itself as "Reclaim up to", with nothing held back
subtracted, because `isCurrentRehearsal` and `heldBackApplies` both compare `developer` (`lib/rehearsal.ts`). So the
line needs no clause about the number.

---

## History (`history.html`, `page-history.js`)

### SY-04 - the Where cell of another machine's row

**Key:** `history.whereOtherMachine`, beside `history.whereThisMachine`

```
another machine
```

**Placement:** the Where column, on every row read from the account that this window's History does not hold.

**Was:** laptop, in `page-history.js`, as `demo-data`. The app has no key.

**Change:** replaced. The schema stores no machine name and the Account screen says so (its "Never stored" note
names "your machine name"), so a row that named one would be inventing it; a host name is never synced to make it
true. "Another machine" pairs with "this machine" on the local rows and with the Other machines chip that filters
these rows. One limit is shared with that chip: an earlier install on this same PC, whose runs this window never
recorded, also reads as another machine, and nothing stored can tell the two apart. At 760 the label runs three
characters longer than "this machine" in a 7rem column, so it may wrap. The parity pair at 760 decides.

### SY-05 - `history.cloudPending`, and what takes its place

**Decision:** removed. Once History reads the account, the Other machines filter shows real rows; the dummy's own
empty states cover an empty filter. Two of their lines need correcting first.

**Key removed:** `history.cloudPending`. Its first sentence says run summaries from other machines "are not synced in
this build yet", which is false from the day History reads `fetchRuns`. Its second explains a gap that will be gone.

**Keys:** the title, corrected, and two bodies from the dummy's `emptyRow`.

`history.cloudEmptyTitle`:

```
No run summaries from other machines
```

**Was:** "No runs from other machines" (S-086).

`history.cloudEmptyBody`, signed in:

```
When a run finishes in the desktop app on another machine signed in as you, its summary appears here.
```

**Was:** "None of your other machines has run windowsweep yet." It is S-087. It never reached the catalogue, because
the app showed `cloudPending` in its place.

**Change:** both corrected before they ship for the first time, dummy first. Once History reads the account, an empty
filter proves only that the account holds no summary from elsewhere: a laptop that ran the command-line tool, ran
while signed out, or had its summaries removed on Account has run windowsweep and still shows nothing here.
TASK-013's Remove made the third case possible, so S-087 is an approved line falsified by a later decision.
S-086 makes the same claim in five words, so the title goes with it, and "run summaries" is what the account holds.
With the title saying that, round 0's opening sentence ("Your account holds no run summaries from other machines.")
became a restatement. An empty state here is a heading and one sentence of the after-state, so the restatement is
cut. What remains is SY-01's bridge with "another machine" in it, so the two empty lists explain themselves in the
same words.
W was allowed here and stays unused. A correction wants the plainest register.

`history.cloudEmptyBodySignedOut`, signed out:

```
Sign in and your other machines' run summaries appear here. Nothing syncs while you are signed out.
```

**Was:** identical (S-088).

**Change:** none. It enters the catalogue as approved, under the corrected title.

**Also owed:** a failed read on History needs a line of its own, or an unreadable account looks exactly like an empty
one, and SY-02c's first key is worded to fit there if History also re-reads on its next open.

---

## Needs code

Each change the strings above need and the code does not have, by file and function. None changes what a run does.

1. **`lib/sync-state.ts`, `SyncStatus`**. Three fields beside `uploaded`: `settingsFailed` (`'read'`, `'write'` or
   null, cleared by `settingsSynced`), `pending` (the ledger's `pending.length`) and `replaced`. `end()` clears all
   three at sign-out. The module imports only zustand, so Home can read it without loading the client at boot.
2. **`lib/sync-session.ts`**. `reconcile` sets `'read'` when `fetchSettings` throws and `'write'` when this machine won
   and `save` throws, and keeps `reconcileSettings(...).replaced` when the account won, `untouched(replaced)` is
   false (D41) and at least one value in `replaced` differs from the row applied (D42). `save`, in its stale branch,
   captures `localSettings()` before `applySettings(fresher)` as `replaced` under the same two tests, and a throw
   from its `fetchSettings` is `'read'`. While one `replaced` stands, a
   second is not taken, so a write-back that comes back stale in the same boot cannot swap this machine's own side for
   the account's older one. `settingsChanged`'s catch sets `'write'`, and the change itself clears `replaced`.
   `upload` publishes `failed.length`. A new `undoReplacement()` applies `replaced` through the store's setters
   outside `applyQuietly`, so `noteSettingsChanged` dates it now, the debounced write sends it, and the change ends
   the notice.
3. **`state/store.ts`, `setIdleDays`, `setTempDays` and `setLargeFileMb`**. None of them reaches
   `noteSettingsChanged`. They do not sync. Each must still end the notice, through `sync-hooks.ts` so the path stays
   boot-safe, or SY-07's "until you change a setting here" is false for three settings.
4. **`components/account/SyncBand.tsx`**. The Settings row's second line (SY-02a, or SY-03 with Undo) and the Run
   summaries row's (SY-02b). When Undo leaves, focus moves to the band's heading, which already accepts it
   (`tabIndex={-1}`).
5. **`components/account/CloudRuns.tsx`**. Tell apart the three states `return null` merges: loading, a first read
   that failed (`readPages` returns null, SY-02c) and an empty account (SY-01, including after the last Remove, where
   `onEmptied` runs today). `onMore`'s catch shows `listMore`, and `onRemove`'s shows SY-02d in a row under the one
   that failed. SY-06 sits under the heading with an id, and each Remove's `aria-describedby` becomes its When's id
   and then that one.
6. **`screens/Home.tsx`, the readout**. SY-07 between `.hero-sub` and `.hero-actions`, rendered from
   `useSyncStatus`'s `replaced`, so it and SY-03 end together, and are withheld together under D41 and D42.
7. **Home's figures: nothing**. Checked under SY-07.
8. **History, `lib/history-rows.ts` `rowsFor` and `components/history/HistoryTable.tsx`**. `otherMachines` reads
   `fetchRuns`, which is TASK-013's own remainder, and gains a failed-read line (SY-05, Also owed).

---

## Found elsewhere, reported rather than fixed

Nine items, one since taken. None is wording in this file.

1. **The run count resets across a sign-out**. `signOut` clears the run ledger (`auth.ts`), so after signing back in
   `uploaded` starts empty and the band reads "0 of 8 runs uploaded" above a list that still shows this machine's
   earlier summaries. The dummy defines the count as this machine's runs the account holds, and that reading
   contradicts it.
2. **`save()`'s stale branch replaces this machine's settings with nobody told**. It applies the fresher row over a
   change made seconds earlier and keeps no `replaced`; two PCs whose clocks disagree by a few minutes make that
   reachable in ordinary use. SY-03 is written for both paths, and Needs code 2 captures it.
3. **A comment names a channel the app does not have**. `reconcileSettings` in `sync.ts` says the caller shows
   `replaced` "in an undo toast", in an app that ships no toast component.
4. **Remove had no undo, and nothing on Account said so**. Taken in round 1: the main session decided the line.
   SY-06 is it.
5. **A Remove leaves the sending machine's count counting it**. `removeCloudRun` drops the id from this machine's
   ledger only. Remove on the desktop a run the laptop sent, and the laptop's "N of M runs uploaded" still counts a
   summary the account no longer holds, until a sign-out there clears its ledger.
6. **The dummy's comment says a Remove touches no machine**. Above `[data-ws-cloud-runs]` in `account.html`:
   "Removing one touches nothing on any machine." `removeCloudRun` rewrites this machine's ledger. It is a comment,
   not shipping copy, and SY-06 does not inherit it.
7. **The weekly task never follows the window's developer switch**. `Install-WeeklyTask` passes no developer flag, so
   the Sunday run takes the engine's own saved answer or its default, whatever this window or the account holds.
   SY-07 says "a run started here" for that reason. Neither `home.scheduleNote` nor `settings.scheduleDesc` says the scheduled run may
   keep a different set.
8. **"Your settings" is wider than what syncs**. `localSettings()` carries the ten appearance axes and developer
   mode; the idle window, the temp window and the large-file threshold stay on each machine. `account.lede`,
   `account.cardBody` and `account.stored.settings.why` ("So a second machine starts where you left off") read as all
   of them. SY-03 and SY-07 use the same noun. They inherit its width.
9. **S-078's note in `desktop-cockpit.md` is superseded by SY-04**. It says "the app shows whatever name the other
   machine registered". The schema stores no machine name, and no machine or host name is ever synced (Bible
   section 7, *machine*), so SY-04 names none. The keeper amends S-078's note at record time.

---

## Self-check

**Palette:** the unit is the independent clause in the fenced copy, each key's English value counted once and the
plural pair once, with the two labels, the title and the unchanged S-088 left out. That gives 32 clauses: P 25, R 7,
W 0, or 78 / 22 / 0 per cent. R sits where a failure, an empty list or a deletion could alarm: SY-01's last clause,
SY-06's "touches no log or report on this machine or any other", SY-02a's "keeps its own" and "stay exactly as they
are", and "nothing on this machine changed" in both SY-02c keys and in SY-02d. W stays at zero. Row 11 forbids it, and
SY-05's one empty state is a correction.

**Rhythm:** the shortest shipping sentences are "There is no undo." (SY-06) and "Press again to retry." (SY-02c) at
four words, and the longest is SY-01's second at 29. Over the 21 fenced sentences, standard deviation over mean is
0.46, measured by hand because the hook cannot see inside a fence. The median of 12 sits at the bottom of the
fingerprint's 12 to 16, as Bible section 8 asks desktop UI for "the same voice, fewer words". Re-measured at
finalize over the same 21: 0.459, population standard deviation. Only SY-01's second sentence reaches 25 words, so
the rubric's range row, taken over the fences in 150-word windows, fails from `listMore` on. It is allowed. The
strings sit in separate places on three screens and are never read as one run of prose, and reaching 25 words would
mean padding a status line or merging two unrelated facts.

**Length:** rows 11 and 13 cap each screen at "a screen". Account gains 35 words when its list is empty (SY-01) or 24
above a populated one (SY-06), one failure line per row at 16 to 27 words (SY-02), and a 10-word notice with a
one-word control (SY-03). Home gains 42 words while the notice stands (SY-07), the longest single addition here.
History trades `cloudPending`'s 36 words for a 6-word title over 19 words signed in or 17 signed out (SY-05), and its
Where cell stays at two words (SY-04).

**Banned phrases, by hand:** the hook strips fences, so on this file it checks only the commentary. That was
measured at finalize on a scratch copy: a banned word planted inside SY-01's fence left the hook silent, and the
same word in SY-01's Was line made it exit 2 and name the word. So all sixteen fence values were matched by hand, on
word boundaries, against the 87 entries of `aoneahsan-cccs-story-craft/assets/banned-phrases.txt`, the
fingerprint's never-list, the glossary's never-column and first person plural. No hit. A planted control was caught
each time. No em dash, no exclamation mark, no not-X-but-Y, and `windowsweep` is lower-case wherever it appears.

**Unsure:** no open `NEEDS DECISION`. SY-03 carries three, all answered. D42 withholds the notice when a replacement
changed no value, and the fact-checker's two record gaps, the notice's lifetime and the S-165 amendment, are closed
from the decision log of 2026-09-25. Two checks wait for parity. SY-04 may wrap at 760, and SY-07 may run to four
lines above the buttons there. SY-07's link is a placement proposal, and the dummy amendment decides it.
