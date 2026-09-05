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
| §A `docs/installation.md` | S-001 – S-012 | 12 |
| §B `docs/quick-start.md` | S-013 – S-022 | 10 |
| §C `docs/README.md` (mirror drift only) | S-023 – S-024 | 2 |
| **Total** | | **24** |

---

## §A `docs/installation.md`

### S-001 · installation.md:3 · the opener
```
windowsweep is a PowerShell engine with a thin Node launcher. Installing it adds no service and no startup entry: the weekly Scheduled Task and the `cleanup` alias are separate commands you run yourself. Pick whichever path fits the machine.
```
**Was:** windowsweep is a PowerShell engine with a thin Node launcher. Pick whichever path fits the machine.

**Change:** one sentence added between the two. Row 3's structure is what it is, then what it refuses, then
the commands, and the second beat was missing from the page a reader reaches from npm. The added sentence is
a refusal rather than an adjective, which is band R's whole rule. It is also checkable: nothing in the tree
registers a service, and the two things that do persist across sessions are `--install-task` and
`--install-alias`, both of which the reader types. **Change** verified against `modules/release_helpers.ps1`
(`Install-WeeklyTask`, `Install-ProfileAlias`) and a grep for `New-Service` across `lib/` and `modules/`,
which returns nothing.

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
The launchers default to Windows PowerShell 5.1 because every Windows machine has it. To run the engine on PowerShell 7 instead, pass `--pwsh` or set `WINDOWSWEEP_SHELL=pwsh`.
```
**Was:** identical.

**Change:** none. The reason comes before the flag, which is the right order for a default nobody chose.

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
`--uninstall-data` removes the logs, the reports and your saved developer answer. It asks first, and `--yes` does not answer that question. It does not touch anything windowsweep reclaimed, because there is nothing to put back.
```
**Was:** (new — the section ends on the fence.)

**Change:** added, and this is the page's second refusal beat. An uninstall section on a tool that deletes
files invites exactly one question, which is whether uninstalling undoes anything. The answer is no, and
saying it here is cheaper than a reader discovering it. The middle sentence is the guarantee: `Confirm-Ui`
is called with `-NoAutoYes` for this prompt, so a batch run cannot answer it. Verified against
`modules/release_helpers.ps1` line 415 and against `AI-INTEGRATION-GUIDE.md`, which already lists
`--uninstall-data` under "never covered by `--yes`".

### S-011 · installation.md:73 · the closing pointer
```
Next: `npx windowsweep --scan`. It measures every target and deletes nothing. Then [Quick start](./quick-start.md), which is four commands in order.
```
**Was:** (new — the page ended on `npm uninstall -g windowsweep`.)

**Change:** added. Row 3's CTA is `npx windowsweep --scan` and the page's last words were an uninstall
command, which is a strange note to leave an installation page on. The first sentence is the CTA, the second
is why a sceptical reader will run it, and the third hands over to the page that owns the sequence. It also
discharges the internal-link floor, which asks every indexed page to reach one more page in the set.

### S-012 · installation.md:74 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves because this change moves it. Every page in this draft carries the same slot for
the same reason, and none of them is a date bumped on its own.

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
The self-test parses every script, checks that every path any section declares lies outside the protected lists, and runs fixtures with a real junction to prove links are never followed, that `--dry-run` writes nothing, and that `--yes` never selects a personal or project item. It ends with a pass count (151 at 1.1.0) and exits non-zero on any failure.
```
**Was:** ... checks that every declared target lies outside the protected paths, and runs fixtures ...

**Change:** one clause. "Every declared target" is engine vocabulary; "every path any section declares" is
the same fact in the reader's words, and it makes clear that the check covers the whole catalogue rather
than a sample. No count is added on purpose: check [6] prints one on the machine it runs on (105 here), and
a number printed by the reader's own run is worth more on their screen than in this paragraph. The 151 is
kept because it is a property of the release rather than of a machine. **Verified** by running
`node bin/windowsweep.js --self-test --no-color --no-report`: `all 151 checks passed`, and check [6] printed
`105 declared targets, none inside a protected path`.

### S-016 · quick-start.md:16 · step 2 · heading
```
## 2. See what is there
```
**Was:** identical.

**Change:** none. Five words, and the right five.

### S-017 · quick-start.md:22-23 · step 2 · what `--scan` does
```
It deletes nothing. It writes this run's log and one JSON report under `%USERPROFILE%\.windowsweep` and touches nothing else; add `--no-report` to skip the report. What it prints: a health report (drives, hibernation file, disk images, running apps that block cache steps), every target with its size on disk, and the personal-file scanners' findings.
```
**Was:** Read-only. Prints a health report (drives, hibernation file, disk images, running apps that block
cache steps), every target with its size on disk, and the personal-file scanners' findings.

**Change:** rewritten, and this is the most consequential slot in the draft. **"Read-only." is not true.**
`--scan` calls `Initialize-Log`, which creates the data directories and opens a session log, and it ends in
`Show-SessionSummary`, which writes a JSON report unless `--no-report` was passed. The tool's own console
message is honest about this: it prints `read-only scan - nothing is deleted`, which is a claim about
deletion rather than about writing. So is `AI-INTEGRATION-GUIDE.md`, which says `--dry-run` and `--scan`
"write nothing but the log and the report". Two surfaces of this product had it right and this one had it
wrong, on the page a sceptical reader runs first. The replacement leads on the deletion claim, then names
the two files, then names the flag that removes one of them. **Verified** against `lib/log.ps1`
(`Initialize-Log`, and the `NoReport` short-circuit at line 100), `modules/runner.ps1` (`Invoke-ScanMode`)
and `windowsweep.ps1` line 251.

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
The guided walkthrough. On the first run it asks whether you are a developer (see [Developer mode](./developer-mode.md)), shows a pre-scan, then visits each section: `a` run, `s` skip, `q` quit. **Enter runs the section** - `a` is the default at that prompt. Every section names what it removes before it acts, keeps a running total, and the summary at the end lists the log, the report and the follow-up commands (admin sections, browsers that were open).
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

### S-022 · quick-start.md:52-60 · step 5 · the admin step
```
## 5. The admin step

Sections 12, 13, 14, 15, 16 and 20 change things only an administrator may change. The `system` profile covers the three that are not deep-gated:

npx windowsweep --profile system --yes --elevate

Sections 15, 16 and 20 are in no profile. Each needs `--i-understand-deep` and its own `--only`, because two of them cannot be undone and the third stops Docker and WSL. Details and the hibernation decision: [Admin sections and elevation](./admin-and-elevation.md).
```
**Was:** ## 5. The admin step / Sections 12-16 need an elevated console. When you are at the keyboard: /
`npx windowsweep --profile system --yes --elevate` / Details and the hibernation decision:
[Admin sections and elevation](./admin-and-elevation.md).

**Change:** rewritten, and it corrects two false statements in three lines of text. First, **the list was
wrong**: `Admin = $true` in `lib/constants.ps1` is set on 12, 13, 14, 15, 16 **and 20**, and section 20 stops
Docker Desktop and every WSL distro, which is the last section a reader should meet unannounced.
`docs/admin-and-elevation.md` and `AI-INTEGRATION-GUIDE.md` both list all six, so this page was the outlier.
Second, **the command did not cover the sections the sentence named**: `WS_PROFILES['system']` is
`@(12, 13, 14)`, so a reader who read "12-16" and ran the command got three of the five they were promised,
with 15 and 16 refused. The replacement names the six, says what the profile actually covers, and then says
why the other three are not in it. `docs/profiles.md` already carries the same fact in its notes, which is
where the disagreement was visible.

Note for the transcription: the fence in the file stays a `powershell` fence with the command alone; it is
reproduced inline above only so the slot reads as one unit.

---

## §C `docs/README.md` — the two strings that drifted

Both of these exist in two trees. `CLAUDE.md` fixes the direction: the repository copy is corrected first,
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

## SELF-CHECK

**Palette.** P dominant and carried by S-015, S-017, S-019, S-021 and S-022, each of which states a
mechanism with its file or its exact value. R lands four times and always as a specific refusal rather than
an adjective: S-001 (no service, no startup entry), S-002 (no network calls of its own), S-010 (uninstalling
puts nothing back), S-017 (deletes nothing, writes two files). W is absent. Row 3 lists only P and R, and
neither of these two pages is a place for an aside.

**Rhythm.** Shortest shipping sentence: *"It deletes nothing."* (three words, S-017). Longest: the
walkthrough sentence in S-021 at 44 words. Median across the changed strings is around 20.

**Length.** `installation.md` measures 263 words today and lands at roughly 325 after these slots;
`quick-start.md` measures 246 and lands at roughly 310. The cap is ~400 per page, so both stay inside it with
room. `docs/README.md` is site-front's page and gains nothing but two corrected dates.

**Unsure spots.** None that changed a string. Two facts were deliberately left numberless — the declared
target count in S-015, which is printed per machine, and the long-path fixture length, which belongs to
`docs-safety` and is discussed there.
