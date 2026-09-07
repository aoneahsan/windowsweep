# docs-start — installation, quick start, and the intro page's two drifted strings

<!-- story-lint: allow "elevate" -->

Content-map row **3** · surfaces `docs/installation.md`, `docs/quick-start.md` and the intro portion of
`docs/README.md` · awareness **problem-aware** · structure **what it is → what it refuses → four commands in
order** · tone bands **P, R** · length **~400 words per page** · CTA `npx windowsweep --scan` · schema none.

A slot inventory, the shape the six earlier drafts used. Each entry names its file and a line precise enough
to find the string once. The shipping text sits in a fence of its own; `**Was:**` and `**Change:**` sit
outside it. Nothing is reorganised. Where a string is already on voice it is kept and the entry says so.

## The intro page already has an owner

`site-front.md` (row 9) covers `windowsweep-docs/docs/intro.md`, which is the published mirror of this
repository's `docs/README.md`. Its slots S-001 to S-021 own every string on that page, so nothing here
re-issues them. Two strings are the exception, and they are the reason this file touches the page at all:
they **differ between the two trees**, and site-front recorded both as identical because it read the site
copy. A mirror that disagrees with itself is a defect in the source of truth, which is the repository copy.
Those two are S-023 and S-024 below.

| File | Slot range | Count |
|---|---|---|
| §A `docs/installation.md` | S-001 – S-012, plus S-025 and S-026 | 14 |
| §B `docs/quick-start.md` | S-013 – S-022 | 10 |
| §C `docs/README.md` (mirror drift only) | S-023 – S-024 | 2 |
| **Total** | | **26** |

Slots are listed in **page order**, not numeric order, so the apply step walks each file from the top. S-025
and S-026 were added in the revision round of 2026-09-07 and took the next two free numbers; they sit inside
§A where they belong on the page. Nothing was renumbered. No number was reused.

✅ **S-017 and S-022 were stopped on drifted `Was:` lines and are now RE-BASED**, on the live text, keeping
both numbers. Commit `89e4888` had corrected `docs/quick-start.md` directly, hours after this draft was
written, so each slot's opening argument was already spent. Both `Was:` lines now quote the live file and
each `Change:` argues only what is still true of it. Every slot in this file is appliable. The record of the
drift, what it cost and what it saved is kept in "Drift against the live files" at the end.

---

## §A `docs/installation.md`

### S-001 · installation.md:3 · the opener
```
windowsweep is a PowerShell engine with a thin Node launcher. Installing it adds no service and no startup entry: the weekly Scheduled Task and the `cleanup` alias are separate commands you run yourself. Pick whichever path fits the machine. The [desktop app](./desktop.md) is a window over the same engine.
```
**Was:** windowsweep is a PowerShell engine with a thin Node launcher. Pick whichever path fits the machine.

**Change:** in the first round, one sentence added between the two. Row 3's structure is what it is, then what it refuses, then
the commands, and the second beat was missing from the page a reader reaches from npm. The added sentence is
a refusal rather than an adjective, which is band R's whole rule. It is also checkable: nothing in the tree
registers a service, and the two things that do persist across sessions are `--install-task` and
`--install-alias`, both of which the reader types. **Change** verified against `modules/release_helpers.ps1`
(`Install-WeeklyTask`, `Install-ProfileAlias`) and a grep for `New-Service` across `lib/` and `modules/`,
which returns nothing.

**Second revision, 2026-09-07 — the desktop pointer.** One sentence added at the end. The page offered three
paths as the complete set while S-002, ten lines below, qualifies its no-network claim to "the **command-line**
tool" — a distinction drawn against something the page never named, which leaves a careful reader hunting for
the other thing. `docs/desktop.md` exists and is committed; it measures 782 words (`wc -w`), not the 750 the
review packet estimated. The borrowed phrase is that page's own opening line, so the fact keeps one home and
this page keeps a link. It is a separate sentence rather than a clause on "Pick whichever path fits the
machine", because that sentence frames the three `##` install paths underneath it and the desktop app is not
one of them; folding it in would imply a fourth way to install the command-line tool. Position matters as
much as wording here: at line 3 the referent arrives before the qualifier that needs it, which a fourth
heading between `## Without Node` and `## PowerShell 7` could not have done.

### S-002 · installation.md:13 · the requirements closing line
```
Nothing else is installed. The package has no dependencies, and the command-line tool makes no network calls of its own.
```
**Was:** Nothing else is installed. The tool has no npm dependencies and makes no network calls.

**Change:** two edits, both about a claim staying true. "The tool" becomes "the command-line tool" for the
reason `site-front.md` S-011 sets out: a desktop application ships from this repository and it can send
analytics, so an unqualified "no network calls" on any page of the documentation is the claim that goes
stale first. "Of its own" is the second half. It is not hedging. `--report-issue` and `--feedback` hand a
URL to the reader's browser after they ask, and the reports manager opens an exported HTML file the same way.
Saying "of its own" is what keeps the sentence true in the presence of those three. Verified: `package.json`
has no `dependencies` key, and self-test check [9] greps every source file for seven call shapes and passed.

### S-025 · installation.md:16 · Zero install with npx · the lead-in before the fence
```
`--scan` measures every target and deletes nothing:
```
**Was:** (new — the heading at line 15 was followed straight by the fence at line 17.)

**Change:** added, and this is where change 1 lands. Row 3's CTA was on the page but naked: `npx windowsweep
--scan` sat under a heading about installing, with nothing between the heading and the fence, and the sentence
that makes a sceptic willing to run it — *"It measures every target and deletes nothing"* — was fifty-five
lines further down under `## Uninstall`, where it read as the next uninstall step rather than as the reason to
type the first command. So the beat moves to the moment of copy. The words are the ones S-011 already carried,
with the flag as the subject instead of a pronoun that had no antecedent under a heading. It ends on a colon,
which is the lead-in shape S-005 and S-008 already use on this page. Band R, seven words. It stands
immediately above the thing it describes, which is the whole point of moving it.

### S-003 · installation.md:21-22 · the npx caveat
```
The weekly task and the profile alias need the global install. Under `npx` both installers refuse with exit 3, because a task registered there would point at a cache npm evicts.
```
**Was:** The weekly task and the profile alias need the global install: under `npx` the installers refuse
(exit 3) because the npx cache is evicted.

**Change:** the passive goes and the mechanism arrives. "The npx cache is evicted" leaves the reader
wondering by whom and when; "a cache npm evicts" names the agent. The replacement also matches the words the
program itself prints, which is `Test-NpxInstallerRefusal` in `modules/release_helpers.ps1`: *"it would point
at the npx cache, which npm evicts."* A page and a console message describing the same refusal should not use
two different explanations. **Change** verified: `$Script:WS.ExitCode = $Script:WS_EXIT_REFUSED`, and
`WS_EXIT_REFUSED = 3` in `lib/constants.ps1`.

### S-004 · installation.md:24 · Global install · heading
```
## Global install
```
**Was:** identical.

**Change:** none.

### S-026 · installation.md:26-29 · Global install · the fence
```
npm install -g windowsweep
windowsweep --help
windowsweep --install-task       # weekly Scheduled Task, Sundays 03:00, the safe batch
windowsweep --install-alias      # adds a 'cleanup' function to your PowerShell profile
```
**Was:** the fence held the first two lines only.

**Change:** two lines added, and this is change 4 — the page paying a promise S-001 makes in its second
sentence. S-001 says the weekly Scheduled Task and the `cleanup` alias are separate commands you run
yourself; S-003 says both need the global install; S-009 then shows `--uninstall-task` and
`--uninstall-alias` under `## Uninstall`. The page therefore taught a reader how to remove two things it
never taught them to add, which is the one arrangement that cannot be defended. They land here rather than
anywhere else because S-003 is the sentence that says where they must run. The inverses are already shown,
so the shape is set. Comments are aligned on the same column as S-009's, and they use straight quotes and
no backtick, because a backtick inside a `powershell` fence is an escape character and would read as one.
**Verified against source, not recalled:** `windowsweep.ps1:151` and `:153` accept `--install-task` and
`--install-alias`; `Install-WeeklyTask` builds its trigger with `New-ScheduledTaskTrigger -Weekly -DaysOfWeek
Sunday -At 3am` and its action from `--all --yes --quiet --no-color --notify`, which is the safe batch;
`Install-ProfileAlias` appends the literal `function cleanup { ... }` to `$PROFILE.CurrentUserAllHosts`.
Both descriptions also match the engine's own `--help` at `windowsweep.ps1:65-66`, so the page and the
console will not tell two stories.

<!-- copy pass 2026-09-08: one space before each comment, to S-009's column; see "Copy pass, 2026-09-08" below. -->

### S-005 · installation.md:33 · Without Node · the lead-in
```
Clone the repository and use the `.cmd` launcher, or call the script directly:
```
**Was:** identical.

**Change:** none. Twelve words for two options.

### S-006 · installation.md:42-44 · the execution-policy paragraph
```
The `.cmd` launcher and the Node launcher both start Windows PowerShell with `-ExecutionPolicy Bypass`, so the machine's script policy never blocks a run. If you call `windowsweep.ps1` yourself under the default `Restricted` policy, add that flag as shown above.
```
**Was:** identical.

**Change:** none, and worth recording why. This paragraph says what the launchers do and then what happens
when you skip them, which is the order a reader needs when a policy error has already appeared. It agrees
with `readme.md` S-042, which keeps the same first clause. Two files, one mechanism, no drift.

### S-007 · installation.md:48-49 · PowerShell 7
```
The launchers default to Windows PowerShell 5.1 because every Windows machine has it; to run the engine on PowerShell 7 instead, pass `--pwsh` or set `WINDOWSWEEP_SHELL=pwsh`.
```
**Was:**
```
The launchers default to Windows PowerShell 5.1 because every Windows machine has it. To run the engine on
PowerShell 7 instead, pass `--pwsh` or set `WINDOWSWEEP_SHELL=pwsh`.
```

**Change:** the full stop becomes a semicolon, and `To` becomes `to`. Nothing else moves - the reason still
comes before the flag, which is the right order for a default nobody chose.

The line editor found and could not make this one. These were the page's only two adjacent 14-word
sentences, its single metronome bar, and joining them lifts `installation.md` from 0.44 to 0.50 against a
0.45 floor without adding a claim. It could not apply it because the slot read `Was: identical`, which is a
relation rather than a quotation and gives the applier no anchor - and writing a quoted `Was:` is the main
session's job, since the main session owns the apply step. The quotation above was verified character for
character against `docs/installation.md` before it was written here.

### S-008 · installation.md:53 · Where output lands · the lead-in
```
Every path writes the same data directory, so `npx` cache eviction never loses your history:
```
**Was:** identical.

**Change:** none.

### S-009 · installation.md:68-71 · Uninstall · the four comments
```
windowsweep --uninstall-task     # if you scheduled the weekly run
windowsweep --uninstall-alias    # if you added the profile alias
windowsweep --uninstall-data     # removes %USERPROFILE%\.windowsweep after confirming
npm uninstall -g windowsweep
```
**Was:** the third comment read `# removes ~\.windowsweep after confirming`.

**Change:** one path. `~\.windowsweep` is a shell shorthand that expands in PowerShell and in nothing else:
not in `cmd`, not in File Explorer, not in the head of a reader who has just been told where their logs are
in the Windows form four lines above. This page already writes `%USERPROFILE%\.windowsweep\logs\` in its own
table, so the two notations sat six lines apart. `site-front.md` S-016 made the same correction on the intro
page. The remaining occurrences on other pages are listed in the report as a sweep this draft does not own.

### S-010 · installation.md:72 · Uninstall · what removing the data does not remove

```
`--uninstall-data` removes the logs, the reports and your saved developer answer. It asks first, and `--yes` does not answer that question. It does not restore what windowsweep reclaimed. There is nothing to put back.
```
**Was:** (new — the section ends on the fence.)

**Change:** added, and this is the page's second refusal beat. An uninstall section on a tool that deletes
files invites exactly one question, which is whether uninstalling undoes anything. The answer is no, and
saying it here is cheaper than a reader discovering it. The second sentence is the guarantee: `Confirm-Ui`
is called with `-NoAutoYes` for this prompt, so a batch run cannot answer it. Verified against
`modules/release_helpers.ps1` line 415 and against `AI-INTEGRATION-GUIDE.md`, which already lists
`--uninstall-data` under "never covered by `--yes`".

<!-- line pass 2026-09-08: the fence's last sentence is now two; see "Line pass, 2026-09-08" below. -->

### S-011 · installation.md:73 · the closing hand-off
```
## Next

[Quick start](./quick-start.md) is four commands in order. The first is `--self-test`, which proves the guards on this machine before anything is deleted.
```
**Was:** (new — the page ended on `npm uninstall -g windowsweep`.)

**Change:** added, then revised on 2026-09-07 as the second half of change 1. The page's last words were an
uninstall command, which is a strange note to leave an installation page on, so a hand-off was always owed.
The first draft of it did three jobs in three sentences. Two landed wrong. Its CTA sat
under `## Uninstall` with S-010 above it, so a reader scanning headings met the reason to run `--scan` as
though it were the next thing to uninstall; that beat now lives at S-025, above the command it describes.
And its last sentence said *scan, then Quick start* — but Quick start's first command is `--self-test`, so a
reader who obeyed arrived one step out of order, at a page whose step 1 they had just been told to skip.

Three fixes, then. **The heading is its own.** `## Next` separates the hand-off from S-010's uninstall
paragraph, which is the whole complaint. The CTA restatement is dropped rather than repeated, because S-025
now carries those words at the moment of copy and a page that says them twice weakens both. And the sequence
is named in the order the next page actually runs it, with `--self-test` first and the band-R clause that
says why nothing is at risk yet. The internal-link floor is still discharged: the page reaches `quick-start`
here and `desktop` at S-001.

### S-012 · installation.md:74 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves because this change moves it. `docs/README.md` carries the same slot (S-024) for
the same reason, and neither is a date bumped on its own. `quick-start.md` has no footer slot, so its date
stays 2026-09-03.

---

## §B `docs/quick-start.md`

### S-013 · quick-start.md:3 · the opener
```
Four commands: prove the guards, look, rehearse, then reclaim. Nothing is deleted until the fourth.
```
**Was:** Four commands, from "prove it is safe" to "reclaim the space". Nothing is deleted until the fourth.

**Change:** the quoted phrase goes. "Safe" is the adjective band R exists to replace, and putting it in
quotation marks does not make it a different word. The four verbs now match `readme.md` S-044 exactly, which
matters because the README and this page carry the same four commands and a reader arriving from one to the
other should not meet two vocabularies. Second sentence unchanged: it is the strongest eight words on the
page.

### S-014 · quick-start.md:5 · step 1 · heading
```
## 1. Prove the guards on this machine
```
**Was:** ## 1. Verify the safety guards on your machine

**Change:** "verify" becomes "prove" to match the opener and the README. "Safety guards" loses its first
word, which was doing nothing the noun did not already do. "Your machine" becomes "this machine", because
the point of a self-test is that it runs where the reader is rather than where the author was.

### S-015 · quick-start.md:11-14 · step 1 · what the self-test does
```
The self-test parses every script and checks that every path any section declares lies outside the protected lists. It runs fixtures with a real junction. They prove that links are never followed, that `--dry-run` writes nothing, and that `--yes` never selects a personal or project item. It ends with a pass count (151 at 1.1.0) and exits non-zero on any failure.
```
**Was:** ... checks that every declared target lies outside the protected paths, and runs fixtures ...

**Change:** one clause. "Every declared target" is engine vocabulary; "every path any section declares" is
the same fact in the reader's words, and it makes clear that the check covers the whole catalogue rather
than a sample. No count is added on purpose: check [6] prints one on the machine it runs on (105 here), and
a number printed by the reader's own run is worth more on their screen than in this paragraph. The 151 is
kept because it is a property of the release rather than of a machine. **Verified** by running
`node bin/windowsweep.js --self-test --no-color --no-report`: `all 151 checks passed`, and check [6] printed
`105 declared targets, none inside a protected path`.

<!-- line pass 2026-09-08: the 44-word first sentence is now three sentences; see "Line pass, 2026-09-08" below. -->

### S-016 · quick-start.md:16 · step 2 · heading
```
## 2. See what is there
```
**Was:** identical.

**Change:** none. Five words, and the right five.

### S-017 · quick-start.md:22-24 · step 2 · what `--scan` does
```
It deletes nothing. It writes this run's log and one JSON report under `%USERPROFILE%\.windowsweep`, and touches nothing else; add `--no-report` to skip the report. What it prints: a health report (drives, hibernation file, disk images, running apps that block cache steps), every target with its size on disk, and the personal-file scanners' findings.
```
**Was:** Deletes nothing. Prints a health report (drives, hibernation file, disk images, running apps that
block cache steps), every target with its size on disk, and the personal-file scanners' findings. It does
write its own log and a report under `~\.windowsweep`; pass `--no-report` if you would rather it wrote
nothing at all.

**Change:** 🔴 **Re-based on the live text, 2026-09-07, keeping the number.** The original `Was:` read
*"Read-only. Prints a health report…"* and the whole slot existed to say that "Read-only." is not true.
Commit `89e4888` fixed that directly in the file, hours after this draft was written. That argument is
**spent**. It is not re-made here, and what follows is only what is still true of the sentence now on the page.

**One of the three is a false claim, not a matter of taste.** *"pass `--no-report` if you would rather it
wrote nothing at all"* offers something the flag does not do. `--no-report` suppresses the report and
nothing else: `Initialize-Log` at `lib/log.ps1:3-9` creates the data directories and opens the session log
with no reference to `NoReport`, and only the report writer short-circuits, at `lib/log.ps1:100`
(`if ($ws.NoReport -or -not $ws.Report) { return $null }`). `modules/runner.ps1:193` proves it from the other
end: with the flag set it still prints the log path and reports `Report: (disabled via --no-report)`. So a
reader who wanted nothing written still gets a log. The replacement says `add --no-report to skip the
report`, which is the exact scope of the flag.

The other two are craft and stand on their own. The live sentence writes `~\.windowsweep`, the shell
shorthand that expands in PowerShell and in nothing else — S-009 removes exactly that notation from the
sibling page, so leaving it here would put the two pages back into disagreement one slot after fixing it.
And the order is wrong for the audience. A solution-sceptical reader needs the deletion claim first and the
printing last; the live sentence buries *deletes nothing* behind a list and then adds the writing as an
afterthought beginning *"It does write"*. The replacement leads on the refusal, names the two files it
writes, names the flag that removes one of them, and puts the inventory last.

<!-- copy pass 2026-09-08: a comma before the second "and" of the second sentence; see "Copy pass, 2026-09-08" below. -->

### S-018 · quick-start.md:25 · step 3 · heading
```
## 3. Rehearse the run
```
**Was:** ## 3. Rehearse the cleanup

**Change:** one noun. The Bible's rehearsal motif is that the rehearsal and the performance are the same
command minus a word, so the thing being rehearsed is the run rather than a separate activity called a
cleanup. It is also one syllable shorter and avoids a word the glossary keeps on a short leash.

### S-019 · quick-start.md:31-33 · step 3 · what the dry-run does
```
Runs the safe batch exactly as a real run would, printing `[dry-run] would ...` lines and an estimate per section, and writes a JSON report you can export. A non-interactive run defaults to developer mode on; pass `--not-developer` if that is wrong for the machine.
```
**Was:** identical.

**Change:** none. The line prefix is exact (`Write-DryRun` in `lib/ui.ps1` emits `    [dry-run] ` before
every message), the estimate is real, and the developer-mode default is the conservative one and is stated
as such by the program too.

### S-020 · quick-start.md:35 · step 4 · heading
```
## 4. Reclaim
```
**Was:** ## 4. Clean

**Change:** the glossary's banned verb, in a heading, on the page that teaches the sequence. `reclaim` is
its named replacement and it is what the section does. This is the last of the four verbs promised in S-013,
so the headings and the opener now agree word for word.

### S-021 · quick-start.md:41-44 · step 4 · the walkthrough
```
The guided walkthrough. On the first run it asks whether you are a developer (see [Developer mode](./developer-mode.md)), shows a pre-scan, then visits each section: `a` run, `s` skip, `q` quit. **Enter runs the section** - `a` is the default at that prompt. Every section names what it removes before it acts and keeps a running total. The summary at the end lists the log, the report and the follow-up commands (admin sections, browsers that were open).
```
**Was:** ... then visits each section: `a` runs it, `s` skips it, `q` stops. Every section names what it
removes ...

**Change:** the three keys are relabelled to match what the prompt prints, and one sentence is added.
`modules/walkthrough.ps1` line 42 reads `Read-Choice -Prompt '  action: a run   s skip   q quit  > '
-Default 'a'`, and `Read-Choice` in `lib/ui.ps1` returns the default on an empty reply. **Pressing Enter
therefore runs the section**, and no page in this documentation said so. On a tool whose whole argument is
that nothing happens by accident, a default that acts is the one keystroke a reader must know before they
reach the prompt. It is stated as the mechanism rather than as a warning, because it is a reasonable default
and the sentence is not a scold.

<!-- line pass 2026-09-08: the 34-word closing sentence is now two; see "Line pass, 2026-09-08" below. -->

### S-022 · quick-start.md:53-61 · step 5 · the admin step
```
## 5. The admin step

Sections 12, 13, 14, 15, 16 and 20 change things only an administrator may change. The `system` profile covers 12, 13 and 14:

npx windowsweep --profile system --yes --elevate

The other three are deep sections, and the profile leaves them out: 15 is the hibernation file, 16 is the event logs and permanent, 20 stops Docker and WSL. A batch run refuses a deep section without `--i-understand-deep`. Name the ones you want with `--only`. Details and the hibernation decision: [Admin sections and elevation](./admin-and-elevation.md).
```
**Was:**
```
## 5. The admin step

Sections 12, 13, 14, 15, 16 and 20 need an elevated console. When you are at the keyboard:

npx windowsweep --profile system --yes --elevate

Details and the hibernation decision: [Admin sections and elevation](./admin-and-elevation.md).
```

**Change:** 🔴 **Re-based on the live text, 2026-09-07, keeping the number.** The original `Was:` opened
*"Sections 12-16 need an elevated console"* and the slot's first argument was that the list omitted 20.
Commit `89e4888` fixed it. **Spent, and not re-made here.** The second defect it found was
not fixed, and it is still on the page today.

**The command still does not cover the sections the sentence names.** `lib/constants.ps1:72` reads
`'system' = @(12, 13, 14)`. Six sections carry `Admin = $true` — 12, 13, 14, 15, 16 and 20, at lines 48 to
56 — so the page names six, offers one command directly beneath, and that command runs three. A reader who
follows the sentence gets half of what it promised. Nothing tells them so, and the three that were skipped
are the three with the largest consequences.

**The omission is a rule, not an oversight, and the page never says which.** The three left out are exactly
the three admin sections carrying `Batch = 'deep'` (`lib/constants.ps1:51`, `:52`, `:56`), and
`modules/runner.ps1:89-92` refuses a deep section in batch mode without `--i-understand-deep`, in the
engine's own words: *"section $Id is deep (irreversible or system-changing): refused in batch mode without
--i-understand-deep."* So the profile could not include them. That causal link is what the page was missing;
a bare count would have left the reader thinking the profile was simply incomplete.

**Change 3 of this round lands here: one noun each.** §10 asks for the no-undo distinction wherever it is relevant,
and a sentence about three sections a reader must invoke deliberately is the most relevant place on either
page. Each gets one noun: 15 the hibernation file, 16 the event logs, 20 Docker and WSL.

🔴 **And the stop caught a false claim in this slot's own earlier draft.** It read *"because two of them
cannot be undone and the third stops Docker and WSL"*. Only one cannot be undone. Section
16 is `Tier = 'permanent'` and clears every log with `wevtutil cl`. Section 15 is `Tier = 'config'` and runs
`powercfg /hibernate off`, which `powercfg /hibernate on` reverses; section 20 is `Tier = 'config'` and
compacts a disk image, which removes none of the reader's data. Shipping that sentence would have put a
false permanence claim on a safety beat — the exact failure §10 exists to prevent, in the one place the
Bible most wants it right. The replacement marks 16 permanent and marks nothing else, and the deep gate
carries the rest of the weight, which is what it is for.

`docs/admin-and-elevation.md` agrees on every point: line 3 names the same six, lines 14 to 16 give the same
three nouns, and lines 18 to 19 already say *"15, 16 and 20 are deep-gated."* The link at the end of the slot
therefore leads somewhere that does not contradict it.

Note for the transcription: the fence in the file stays a `powershell` fence with the command alone; it is
reproduced inline above only so the slot reads as one unit.

<!-- copy pass 2026-09-08: the doubled "is", and a comma before "and the profile"; see "Copy pass, 2026-09-08" below. -->

---

## §C `docs/README.md` — the two strings that drifted

Both exist in two trees. `CLAUDE.md` fixes the direction: the repository copy is corrected first,
then re-mirrored. In both cases the **site** copy is already right and the **repository** copy is stale,
which is the wrong way round for a source of truth and is why they are slots rather than a footnote.

### S-023 · docs/README.md:42 · Meta · the audit date
```
| [What the project consists of](../what-this-project-consists-of.md) | Every part of the project with its evidence, as audited on 2026-09-05 |
```
**Was:** ... as audited on 2026-09-03

**Change:** the date. `what-this-project-consists-of.md` line 3 reads *"Last Updated: 2026-09-05 (audit of
`main` at `2721b75`...)"*, so the cell describes an audit two days older than the file it points at. The
published site already says 2026-09-05. **This supersedes the `Was:` line of `site-front.md` S-018**, which
recorded the five Meta cells as identical across the two trees; four of them are, and this one is not.

### S-024 · docs/README.md:54 · the footer
```
Last Updated: 2026-09-05 - tool version 1.1.0
```
**Was:** Last Updated: 2026-09-04 - tool version 1.1.0

**Change:** the date, for the same reason and with the same correction to a sibling draft. **This supersedes
the `Was:` line of `site-front.md` S-020**, which read the site copy and recorded the pair as identical. The
version is right in both trees: `VERSION`, `package.json` and `WS_VERSION_FALLBACK` all say 1.1.0 and
`npm run version:check` asserts it.

---

## Reference tables left alone, and why

`installation.md`'s requirements table and its output-paths table are factual records of what the engine
needs and where it writes, and row 5 governs that kind of cell rather than row 3. Two of them were checked
anyway and are correct: the data-directory paths match `lib/config.ps1` and `lib/log.ps1`, and the
`Windows 10 (1809+) or 11` row matches the cmdlets the engine calls. `quick-start.md` has no tables.

---

## Drift against the live files — two slots stopped, then re-based, 2026-09-07

🔴 **Every fence in this section is a QUOTATION, not a slot.** Nothing here is applied.

**Resolved.** Both slots were re-based on the live text, keeping their numbers, and each `Change:` was
rewritten to argue only what survives. Two rules decided it between them and neither left room for a
judgement call: slot numbers are never reused or renumbered, which ruled out withdrawing these two and
re-issuing them as S-027 and S-028; and a drifted `Was:` is a stop rather than a guess, which ruled out
applying them untouched. This section is kept as the record of why, because the reason is worth more than
the tidy file it would leave behind.

Every `Was:` line was re-read against the live `docs/installation.md` and `docs/quick-start.md` before a word
was changed. Twenty-two of the twenty-four match exactly. Two do not, both in `quick-start.md`, and both are
stopped rather than refreshed: **S-017 and S-022**.

**The cause is known and is not a mystery to solve.** Commit `89e4888`, *"fix(docs): seventeen factual defects
the documentation pass found, all verified against the source"* (2026-09-05 21:04:16 +0500), is the commit
that added this draft to the repository **and** corrected two of the defects the draft was arguing about, in
the live file, directly. Its own message names them: *"quick-start called `--scan` 'Read-only' when it writes
a log and a report; it said sections 12-16 need elevation, omitting 20, then gave a command covering only 12,
13 and 14."* So the draft did not go stale over two days. It was overtaken within the hour.

### S-017 — `--scan` is no longer described as read-only

Draft `Was:`, verbatim:

```
Read-only. Prints a health report (drives, hibernation file, disk images, running apps that block cache steps), every target with its size on disk, and the personal-file scanners' findings.
```

Live `docs/quick-start.md:22-24`, verbatim:

```
Deletes nothing. Prints a health report (drives, hibernation file, disk images, running apps that block cache
steps), every target with its size on disk, and the personal-file scanners' findings. It does write its own
log and a report under `~\.windowsweep`; pass `--no-report` if you would rather it wrote nothing at all.
```

The slot's whole argument was that **"Read-only." is not true**. That word is gone, and the log, the report
and `--no-report` are all named, so the argument is spent. **What survives is not merely craft, which is the
part a quick re-approval would have missed.** The live sentence ends *"pass `--no-report` if you would rather
it wrote nothing at all"*, and that is false: the flag suppresses the report and leaves the log
(`lib/log.ps1:3-9` against `:100`). Two smaller things stand beside it — `~\.windowsweep` is the shorthand
S-009 removes from the sibling page, and the deletion claim is buried third when a sceptical reader needs it
first. **The slot is re-based on all three and keeps its number.**

### S-022 — the section list was fixed; the profile-coverage correction was not

Draft `Was:`, first line, verbatim:

```
Sections 12-16 need an elevated console. When you are at the keyboard:
```

Live `docs/quick-start.md:55`, verbatim:

```
Sections 12, 13, 14, 15, 16 and 20 need an elevated console. When you are at the keyboard:
```

The rest of the slot's `Was:` — the `--profile system --yes --elevate` fence and the hibernation link —
matched the live file exactly. So this one was two-thirds spent and one-third live. **The second defect the
slot found is still on the page, untouched:** `lib/constants.ps1:72` reads `'system' = @(12, 13, 14)`, so the
command under a sentence naming six sections runs three, and nothing on the page says which three or why.
That sentence had never been written. **It is written now, in the re-based S-022, with the deep gate as its
reason and one noun for each of the three.**

### What the stop cost, and what it bought

It cost one round. Change 3 could not attach to a slot whose `Was:` no longer matched, so it waited for the
re-base and landed in S-022 rather than beside it.

🔴 **It bought a false claim caught before it shipped, on the one beat the Bible is strictest about.** The
slot's earlier text said *"because two of them cannot be undone and the third stops Docker and WSL"*. Only
section 16 cannot be undone. Section 15 runs `powercfg /hibernate off`, which `powercfg /hibernate on`
reverses, and section 20 compacts a disk image without removing any of the reader's data — both are
`Tier = 'config'`, not `'permanent'`. Applying the slot as written would have printed a false permanence
claim on a safety sentence, which is the failure §10 exists to prevent. Nobody was looking for it; it
surfaced only because the drift forced every line of the slot to be re-read against the source instead of
re-approved on sight. That is the argument for the stop rule, and it is a stronger one than the bookkeeping.

The second is smaller. It is still real. Re-reading S-017 against the live sentence turned up
*"pass `--no-report` if you would rather it wrote nothing at all"*, which is on the page now and is untrue —
`--no-report` suppresses the report and leaves the log. That defect is younger than the draft: `89e4888`
introduced it while fixing the older one. A slot re-approved on sight would have carried it.

---

## Line pass, 2026-09-08 — three fences

Fences only. Every `Was:` stands as the writer left it, every fact, number, path and flag is where it was,
and the slot order is the developmental round's. Three fences changed, each for a rhythm or clarity reason
the fingerprint names; each slot carries a pointer comment to this section.

**S-010.** The last sentence read *"It does not touch anything windowsweep reclaimed, because there is
nothing to put back"* and now reads *"It does not restore what windowsweep reclaimed. There is nothing to
put back."* "Touch" pointed the wrong way. On an uninstall page it reads first as one more thing the command
will not delete and only on a second pass as the answer the paragraph exists to give, which is that nothing
comes back. The refusal is now named as a refusal to restore and the reason stands on its own, so the
paragraph ends on its shortest line. No fact moved.

**S-015.** The first sentence ran to 44 words against the fingerprint's ceiling of 34, and the earlier
self-check had reported it rather than fixed it because it sat outside that round's changes. It is now three
sentences of 18, 7 and 21 words. Every clause is kept, in order. The three fixture proofs stay one list
because there are exactly three of them, and "that" now leads each so the list is parallel.

**S-021.** The closing sentence was 34 words with a change of subject in the middle, from *every section* to
*the summary*, which is the join a tired reader goes back over. It is split at that join into 14 and 20
words. Nothing else in the slot moved. The Enter sentence and its dash stand as the revision left them, and
that dash is the page's only one.

**Recommended and not made: S-007.** Its two sentences are 14 words each, the one paragraph on
`installation.md` where two equal lengths sit side by side. Joined on a semicolon (*"…has it; to run the
engine…"*) they would be the page's one sentence over 23 words and would lift its burstiness from 0.44 to
0.50 without adding a claim. The slot is kept-identical. Its `Was:` is a relation rather than a quotation, so
it gives the applier no anchor; a line editor may not write one. Left for the main session, which owns the
apply step.

**Left alone; who owns each.** S-003 refuses for *both installers* and explains with *a task registered
there*, which names one of the two; whether the alias case wants its own noun is the fact-checker's call.
S-022's *"16 is the event logs and is permanent"* carries a double *is* the copy editor may smooth without
touching the permanence mark. S-017's second sentence has two *and*s before its semicolon; a comma before the
second would mark the clause boundary, which is a punctuation call and so the copy editor's.
`quick-start.md` has no footer slot, so its *Last Updated* stays 2026-09-03 while `installation.md` and
`docs/README.md` move to 2026-09-05; S-012's note that every page carries the same slot is one page short.
Two kept shapes were left. S-019 opens without a subject where S-017 now opens on *It*, and S-013's *look*
sits under a heading that says *See*. S-013's verbs are matched to `readme.md` S-044 by design and S-019 is
a kept slot, so neither is a line edit.

---

## Copy pass, 2026-09-08 — three fences

Mechanics only. Every fact, number, path, flag and command is where the line pass left it; no heading, no slot
order and no `Was:` line moved. Three fences changed, each for a grammar, punctuation or formatting reason,
and each slot carries a pointer comment to this section. The quick-start figures in the SELF-CHECK were
re-measured afterwards with the rules it states; the pre-edit build reproduced the line pass's figures to the
digit first.

**S-022.** *"16 is the event logs and is permanent"* now reads *"16 is the event logs and permanent"*. The
second *is* goes and the permanence mark stays; the sentence is one word shorter, 30 to 29, and
`docs/admin-and-elevation.md:15` marks section 16 the same way, *(permanent)*. In the same fence a comma now
precedes *and the profile leaves them out*, which joins two independent clauses; S-002 and S-010 on the
sibling page already punctuate that join with a comma.

**S-017.** A comma before the second *and* of its second sentence: *"…under `%USERPROFILE%\.windowsweep`,
and touches nothing else"*. The first *and* joins the two things the run writes; the second joins two
predicates, and without the comma *"…report under X and touches…"* parses once as a third place written.

**S-026.** One space before each of its two comments. The change note says they sit on S-009's column; they
sat one short of it, 33 against 34. Whitespace inside a comment, and neither command changed.

**Commentary.** S-012's change note said every page in this draft carries the same footer slot; two of the
three do (S-012 and S-024), `quick-start.md` has no footer slot, and the note now says so. In the SELF-CHECK,
quick-start's longest sentence is 29 rather than 30, its burstiness 0.58 rather than 0.59 (pstdev over mean,
which is the ratio that reproduces the recorded 0.59 from the line-pass build), and its length 368 by the
self-check's tokenizer and 404 by `wc -w`, each one word down.

**Found and not made.** Four things that are not a copy edit, each with its owner.

- `quick-start.md:63` reads `Last Updated: 2026-09-03` and no slot moves it, so ten changed slots would ship
  under a footer two days older than the sibling pages'. A footer slot is a structural addition.
- S-023's anchor is gone. `docs/README.md` no longer carries the *What the project consists of* Meta row;
  commit `e1ab607` removed it when the planning files left git on 2026-09-07, and the row it removed already
  read *2026-09-05*, so the slot had been applied before its line was deleted. Its link,
  `../what-this-project-consists-of.md`, resolves to nothing inside the repository; the file lives one level
  above it, outside version control.
- S-024 is already applied: `docs/README.md:59` reads *Last Updated: 2026-09-05 - tool version 1.1.0*, which
  is the fence text, so the `Was:` no longer matches. Both §C `Was:` lines are therefore drifted. The
  SELF-CHECK's *"All 26 slots are appliable"* was measured by building the two pages in §A and §B and does
  not cover §C. A drifted `Was:` is a stop rather than a guess, and the stop is the main session's.
- S-015's fence writes *the protected lists* where the live sentence and its `Was:` write *the protected
  paths*, and the change note records one clause changing and not this noun. Both are the engine's terms
  (`lib/scan.ps1:92`, `modules/release_helpers.ps1:101`), so it is the fact-checker's call.

---

## SELF-CHECK

Rewritten on 2026-09-07. The rhythm and length figures were re-measured on 2026-09-08, after the line pass,
and again after the copy pass the same day. Every figure below was re-measured rather than carried
forward, and each carries the tokenizer and the inclusion rule that produced it.

**Palette.** P dominant and carried by S-015, S-017, S-019, S-021, S-022 and S-026, each stating a mechanism
with its file, its schedule or its exact value. S-026 names the day and the hour the weekly task runs rather
than calling it weekly and stopping. S-022 is the densest of them after the re-base: three sections in the
profile, the deep gate that excludes the other three, and one noun each. R lands six times, always as a
specific refusal rather than an adjective — S-001 (no service, no startup entry), S-002 (no network calls of
its own), S-010 (uninstalling puts nothing back), S-011 (nothing is deleted yet), S-017 (*"It deletes
nothing."*) and **S-025**, seven words standing above the command they describe. W is absent. Row 3 lists
only P and R, and neither page is a place for an aside.

**Rhythm.** Measured on the **post-apply** pages with every slot applied, tokenizer `\b[\w'-]+\b`, sentences
split per paragraph on `(?<=[.!?])\s+`, fenced blocks and table rows and headings excluded, and re-measured
on 2026-09-08 after the line pass with the same rules, where the pre-pass build reproduced every figure of
the previous revision to the digit. `installation.md`: 23 sentences, 3 to 23 words, median 12, burstiness
**0.44**, from 0.41; shortest is *"Nothing else is installed."* (four words, S-002) and longest is S-006's
execution-policy sentence at 23, tied with S-001's second. `quick-start.md`: 24 sentences, 3 to 29 words,
median 12.5, burstiness **0.58**, from 0.70; shortest is *"It deletes nothing."* (three words, S-017) and
longest is 29, where S-022's sentence naming the three deep sections ties S-017's inventory sentence and
S-021's first-run sentence. The fall is the 44 leaving.
An outlier lifts a variance figure while breaking the range rule, and the range rule is the one the
fingerprint states. The re-base is what moved the page before that: S-017 restores the three-word refusal
and S-022 adds a 29 (a 30 before the copy pass), a 9 and a 7 where there had been one flat line.

🔴 **Two rhythm facts were reported rather than fixed in the writer's round; the line pass closed one.**
S-015's 44-word sentence exceeded the fingerprint's 34-word ceiling, and the first self-check attributed that
44 to S-021, which measures 34 — the figure was right and its owner was wrong. S-015 is now 18, 7 and 21.
The other stands. `installation.md` sits at **0.44** against the rubric's 0.45, because that page has no
sentence over 23 words. Its obvious lever is S-011: extending the hand-off to explain what `--self-test` does
would clear the threshold in one edit. It is refused deliberately. That explanation is `quick-start`'s own
opening paragraph, a pointer that restates the page it points at breaks the single-home rule, and buying a
variance figure with a duplicated claim is the wrong trade. The line pass found a second lever in S-007 and
left it, for the reason its own section gives.

**Length.** Tokenizer `\b[\w'-]+\b`. **Inclusion rule: prose, headings and table cells; fenced code blocks
excluded**, since a command is a copy target rather than something read. Scope: the two whole files as they
would stand after **every** slot lands, the re-based S-017 and S-022 included. `installation.md`
**258 → 371**; `quick-start.md` **305 → 368**. The cap is ~400 per page. Both are inside it, installation
clearing by 29 words and quick-start by 32 — rather than by the 75 the review packet estimated. Under the
stricter rule that also drops table rows the same two pages read 184 → 297 and 305 → 368; under a plain
`wc -w` over the whole file, 347 → 479 and 341 → 404. The line pass moved these by one word down and two
up: S-010's split is one word shorter and S-015's is two words longer; the copy pass moved quick-start one
word down, S-022's doubled *is*. 🔴 **The re-base cost quick-start 54
words**, which is the price of a correction that names three sections, their gate and three nouns. The page
still clears.

🔴 **Two `wc -w` figures in the previous revision of this section were extrapolated from the other tokenizer
rather than run, and read 483 and 415.** They are corrected above from `wc -w` itself. A number carried
across tokenizers is a guess wearing a measurement's clothes, and it is the same failure this section was
written to close.

🔴 **The previous self-check's figures cannot be reproduced by any of those four rules** — it recorded
`installation.md` at 263 and `quick-start.md` at 246, and the closest match here is 258 and 305. Part of the
quick-start gap is real drift: commit `89e4888` added about 29 words to that page after the figure was taken.
The rest is an inclusion rule that was never written down, which is exactly the ambiguity this section now
closes. `docs/README.md` belongs to site-front. It gains two corrected dates and nothing else.

**The allow marker.** `<!-- story-lint: allow "elevate" -->` sits at the top of this file and its reason had
never been recorded. Here it is: `elevate` is on the shared banned list as a marketing verb, and every
occurrence in this draft is the literal CLI flag `--elevate` inside S-022's command or in prose naming it.
The flag is a frozen public identifier. Renaming it is not available. Quoting it is not a claim.

**Unsure spots.** No string was changed on a guess. **Zero open `NEEDS DECISION` lines**, in the shipping
copy or anywhere else in this file. The one raised earlier in the round — whether S-017 and S-022 should be
re-based or re-issued — was answered on 2026-09-07 by the two rules that govern it rather than by anyone's
preference: numbers are never reused or renumbered, and a drifted `Was:` is a stop rather than a guess.
Re-base was the only option both allowed. It is done, and change 3 landed inside the re-based S-022.

Two facts stay deliberately numberless: the declared target count in S-015, which is printed per machine, and
the long-path fixture length, which belongs to `docs-safety`. Both are choices, not gaps.

**All 26 slots are appliable.** Every `Was:` in this file was matched against the live text mechanically, not
by eye — building each post-apply page asserted its anchor string occurs exactly once, and all 19 assertions
passed.

## Main-session rulings on the copy pass's four NEEDS DECISION lines, 2026-09-08

Three were routine calls that the project's own recorded patterns already answer, so they were taken here
rather than held for the owner. The fourth is a fact-checker question and stays open.

**S-023 - RECORD AS SPENT AND OVERTAKEN.** Its anchor no longer exists. `docs/README.md` has no
"What the project consists of" Meta row; commit `e1ab607` removed it on 2026-09-07 when the planning files
left git, and the row it removed already read `2026-09-05`, so the slot had been applied and then deleted
underneath itself. Re-basing is not possible either: the link pointed at `../what-this-project-consists-of.md`,
which now lives at the workspace root **outside version control**, so the target 404s for every reader on
github.com. Verified in the main session: `grep` for both the heading and the filename in `docs/README.md`
returns only line 47's prose mention, which is a sentence about where those files live rather than a link to
one. The number is retired and never reused.

**S-024 - RECORD AS SPENT.** Already applied. `docs/README.md:59` reads `Last Updated: 2026-09-05 - tool
version 1.1.0`, which is the fence text exactly; only the line number moved (54 -> 59). Confirmed by reading
line 59 off disk.

**Add S-027 for `quick-start.md`'s footer.** The page has ten slots changing it and a footer still dated
`2026-09-03`, two days older than its siblings - confirmed by reading the file's last line. The draft's own
principle is that a date moves because the page's changes move it, so the honest fix is a slot rather than a
silent bump at apply time. Adding it as a slot is also what keeps the applier's `Was:` check meaningful.

### S-027 - quick-start.md:63 - the footer date
```
Last Updated: 2026-09-05
```
**Was:**
```
Last Updated: 2026-09-03
```

**Change:** the date follows the page. Ten slots on this page change its text, and `installation.md` and
`docs/README.md` both already carry `2026-09-05` for the same reason. A footer two days behind the page it
sits under is the smallest kind of untrue.

**S-015 `protected lists` vs `protected paths` - STILL OPEN, and correctly not mine.** The engine uses both
nouns (`lib/scan.ps1:92` "the protected lists"; `modules/release_helpers.ps1:101` "a protected path"), the
fence says *lists* where the live page and its `Was:` say *paths*, and the change note does not record the
noun changing. That is a fact-checker call and it is left for one, with the copy editor's proposed glossary
row carried forward.
