# cli-strings - the console surface

Content-map row **10** · surfaces `lib/ui.ps1`, `windowsweep.ps1`, `modules/{walkthrough,menu,runner,reports,health,release_helpers}.ps1`, plus `lib/config.ps1` and `lib/scan.ps1` (see the coverage note) · tone band **P dominant** · structure: terse imperative, every action names its path or count · length: one line each · CTA: the next command.

This is a slot inventory rather than a page. Every user-visible console string on row 10's four surfaces - prompts, the walkthrough, the menu and the run summary - is listed once, numbered, with its file and a line precise enough to find it in one search. The string that ships sits inside the fence; the **Was** and **Change** lines sit outside it. Where a string is already on voice it is kept and said so. Most of it is.

**Ships with 1.2.0.** Applying this surface edits engine source, so it lands only inside a full version cascade (IRON rule 7). Nothing here touches the engine now.

| Section | File | Slot range | Count |
|---|---|---|---|
| §A drawing primitives, banner, every prompt | `lib/ui.ps1` | C-001 - C-017 | 17 |
| §B entry script: `--help`, argument errors, bootstrap | `windowsweep.ps1` | C-018 - C-035 | 18 |
| §C the walkthrough | `modules/walkthrough.ps1` | C-036 - C-055 | 20 |
| §D the menu | `modules/menu.ps1` | C-056 - C-062 | 7 |
| §E section dispatch, run header, scan mode, run summary | `modules/runner.ps1` | C-063 - C-096 | 34 |
| §F the reports manager and run history | `modules/reports.ps1` | C-097 - C-117 | 21 |
| §G section 0, the health report | `modules/health.ps1` | C-118 - C-131 | 14 |
| §H version, `--list`, feedback, task, alias, data removal | `modules/release_helpers.ps1` | C-132 - C-178 | 47 |
| §I the first-run prompt and the purge confirmation | `lib/config.ps1` | C-179 - C-190 | 12 |
| §J the target table the pre-scan and `--scan` print | `lib/scan.ps1` | C-191 - C-195 | 5 |
| **Total** | | | **195** |

## Coverage - what this surface covers, and what it deliberately does not

Row 10 names four surfaces. Two of them reach into files the brief did not list, so those files are covered and flagged rather than left with the product's most-used prompt unwritten:

- **`lib/config.ps1`** carries the first-run developer question. The Bible's glossary defines `developer mode` as "the answer to the first-run question", so that prompt is row 10's, wherever it lives. §I.
- **`lib/scan.ps1`** carries `Show-ScanTable`, which the walkthrough's pre-scan and `--scan` both print. Its two prose lines are part of the run summary the reader sees. §J.

Left alone on purpose, each with its reason:

| Not a slot | Why |
|---|---|
| Section titles, tiers, batch names, profile names | `lib/constants.ps1` is a frozen public contract (IRON rule 4); `docs/sections.md`, `docs/cli-reference.md` and the README table all have to agree with it |
| Anything inside `--json` | a machine contract the desktop app parses |
| The `##windowsweep` progress lines | same contract, `Get-MachineProgressLine` |
| Self-test output (`Invoke-SelfTest`, ~40 strings) | a developer gate, not a product voice surface |
| Error text quoting a PowerShell exception verbatim | C-073, C-162, C-190 mark these where they sit |
| `--list-targets` (`lib/scan.ps1:83-99`) | not one of row 10's four surfaces. Two findings in it are reported below rather than drafted |
| Source comments | not user-visible. `windowsweep.ps1:1`, `modules/walkthrough.ps1:1` and `modules/runner.ps1:1` all carry the same "safe" adjective C-001 removes; a later session applying this draft will want to align them in the same commit |
| The exported Markdown and HTML report bodies | no content-map row names them - raised as a NEEDS DECISION below |

## The measured budgets every slot here was checked against

- **`Write-Box`** draws a 78-glyph rule and indents its subtitle by three: **75 characters** for a subtitle. One shipped subtitle breaks it (C-144, 92 characters); it is fixed here.
- **`Write-Kv`** formats `"  {0,-24} {1}"`, so a key over **24 characters** pushes its whole column right. The longest shipped key is 23. C-088's replacement is 21.
- **`Write-Banner`** sizes its box to `$inner.Length + 2`, so the banner is not capped at 78 - it just has to stay inside a terminal. Shipped: 66 glyphs. C-001: 67.
- **Free-flowing help, `Write-Plain` and `Write-Note` lines** are not under a rule. The shipped baseline in those blocks already runs to 93-104 characters, and the owner ruled that class of overflow cosmetic and acceptable on 2026-09-07. So the test applied here is *no worse than what ships*, and every changed line meets it except two, both named in the self-check.

---

## §A `lib/ui.ps1` - primitives, banner, prompts

### C-001 · `lib/ui.ps1:126` · `Write-Banner`, the strapline
```
   windowsweep v1.2.0 - names every path before it touches one   
```
**Was:** `   windowsweep v1.1.0 - safe, developer-aware Windows cleanup   `

**Change:** the adjective goes. The Bible is explicit - reassurance is delivered as a specific refusal, "never an adjective like 'safe'" - and this line is the most-printed sentence in the product: `Write-Banner` runs at the top of the walkthrough, the menu, every batch run and every scan. It now states the guarantee instead of claiming a property. Third person, present tense, no adjective doing work a verb could do. 65 glyphs of inner text, 67 with the borders, against 66 shipped.

🔴 **This slot is blocked on a NEEDS DECISION** - see NEEDS DECISION 1. The product currently prints two different straplines from six places, and which line belongs here is the same question row 2 was raised to settle.

### C-002 · `lib/ui.ps1:115` · `Write-Step` header
```
  [ STEP 4/18 ]  Browser caches
```
**Was:** the same.

**Change:** none. A step counter is a count, which is what row 10 asks every line to carry.

### C-003 · `lib/ui.ps1:168` · `Confirm-Ui`, a scripted selection answering a prompt
```
[scripted selection] Remove the 6 selected folders? - yes (--select / --select-file)
```
**Was:** the same.

**Change:** none. It names the flag that answered, so the reader can tell a machine's answer from their own.

### C-004 · `lib/ui.ps1:169` · `Confirm-Ui` under `--yes`
```
    [auto-yes] Remove the 6 selected folders?
```
**Was:** the same.

**Change:** none.

### C-005 · `lib/ui.ps1:171` · `Confirm-Ui` with no console
```
non-interactive session: 'Proceed?' answered no (pass --yes to confirm in batch)
```
**Was:** the same.

**Change:** none. A refusal that names the flag which would lift it - the R band, in one line.

### C-006 · `lib/ui.ps1:174-176` · `Confirm-Ui` prompt shape
```
? Proceed? [y/N] 
```
**Was:** the same, with `[Y/n]` when the default is yes.

**Change:** none. The capital letter carries the default; nothing else needs to.

### C-007 · `lib/ui.ps1:166` · `Confirm-Ui` default prompt text
```
Proceed?
```
**Was:** `Proceed?`

**Change:** none. Every real caller passes its own prompt; this is the fallback.

### C-008 · `lib/ui.ps1:186` · `Confirm-Typed` with no console
```
non-interactive session: 'FULL PURGE: ...' requires a typed 'purge'; skipped
```
**Was:** the same.

**Change:** none. Skipped, not assumed - and it says which word was wanted.

### C-009 · `lib/ui.ps1:188` · `Confirm-Typed` prompt
```
  Type 'purge' to proceed: 
```
**Was:** the same.

**Change:** none.

### C-010 · `lib/ui.ps1:206` · `Read-MultiSelect`, `--select-file` matched
```
--select-file matched 4 of 37 candidate(s)
```
**Was:** the same.

**Change:** none. Two counts, no adjectives.

### C-011 · `lib/ui.ps1:214` · `Read-MultiSelect`, `--select` consumed
```
--select '1,3-5' -> 4 of 37 item(s)
```
**Was:** the same.

**Change:** none.

### C-012 · `lib/ui.ps1:218` · `Read-MultiSelect` with no console
```
non-interactive session: nothing selected (a person has to pick these)
```
**Was:** the same.

**Change:** none. This is the sentence the whole interactive-section policy exists to produce. It stays word for word.

### C-013 · `lib/ui.ps1:219` · the selection legend
```
  Selection: 1,3,5-10 | all | none (Enter = none)
```
**Was:** the same.

**Change:** none. It states the default rather than implying it.

### C-014 · `lib/ui.ps1:220` · the selection prompt
```
  Select items (1..37): 
```
**Was:** the same.

**Change:** none.

### C-015 · `lib/ui.ps1:237` · `Resolve-SelectedPaths`, an unmatched line
```
--select-file: no candidate here matches C:\Users\you\Downloads\old.iso
```
**Was:** the same.

**Change:** none. It names the path, which is the rule for every reporting line on this surface.

### C-016 · `lib/ui.ps1:274` · `Wait-Enter`
```
  - press Enter to continue - 
```
**Was:** the same.

**Change:** none.

### C-017 · `lib/ui.ps1:84` · `Write-DryRun` prefix
```
    [dry-run] would remove 412 files (1.4 GB) under C:\Users\you\AppData\Local\Temp
```
**Was:** the same shape.

**Change:** none. The prefix is the rehearsal motif made mechanical: every line a dry-run prints is marked as one.

---

## §B `windowsweep.ps1` - `--help`, argument errors, bootstrap

### C-018 · `windowsweep.ps1:42` · `Show-Usage` header line
```
windowsweep v1.2.0 - names every path before it touches one
```
**Was:** `windowsweep v1.2.0 - safe, developer-aware Windows cleanup`

**Change:** same reason as C-001, and the two must not diverge - a reader who runs `--help` and then a scan should meet one line, not two. 🔴 **Blocked on NEEDS DECISION 1** with C-001.

### C-019 · `windowsweep.ps1:47` · the MODES heading
```
MODES  (default = the guided walkthrough)
```
**Was:** `MODES  (default = guided walkthrough through every category)`

**Change:** two corrections in one short line. "category" is not a word this product owns - the glossary makes `section` the numbered unit of work and bans the alternatives, and the walkthrough itself is built from `WS_WALKTHROUGH`, a list of section ids. And "every" was false: `WS_WALKTHROUGH` is 15 of the 26 sections, plus three more when the console is elevated. Dropping the claim is shorter than qualifying it. 41 characters, against 59 shipped.

### C-020 · `windowsweep.ps1:51` · the `--scan` mode line
```
  -s, --scan            Every target with its size; nothing is deleted
```
**Was:** `  -s, --scan            Read-only: every target with its size, nothing deleted`

**Change:** "Read-only" is not true of `--scan`. It writes a log, and a report unless `--no-report`. This is the same defect the 2026-09-06 docs pass corrected on `quick-start`, and correcting the page while the program kept saying it is the drift this project fights. The clause that was already true does the whole job; the log and the report are named in C-023 and in the OUTPUT block. 70 characters, against 78 shipped.

### C-021 · `windowsweep.ps1:49` · the `--all` mode line
```
  -a, --all             Safe batch: sections $($Script:WS_SAFE_BATCH -join ',') (+$($Script:WS_SAFE_BATCH_ADMIN -join ',') when elevated)
```
**Was:** `  -a, --all             Safe batch: sections $($Script:WS_SAFE_BATCH -join ',') (+12,13 when elevated)`

**Change:** the admin ids were a literal beside an interpolation of the very list they belong to. `WS_SAFE_BATCH_ADMIN` is the source, `--list` already interpolates it (C-134), and IRON rule 4's principle - derive a section list, never write one down - applies to copy as much as to code. Renders identically today (91 characters, unchanged); the point is that it cannot drift tomorrow.

### C-022 · `windowsweep.ps1:48-92` · the remaining MODES and OPTIONS reference lines (about 60)
```
      --only L          Run exactly these sections, e.g. --only 1,3,5-7
      --dry-run         Delete nothing; show what would go and how much it frees
  -d, --days N          Idle threshold for caches (default 100). A file goes only when its newest
                        timestamp (write, access, creation) is at least N days old
```
**Was:** the same, all of them.

**Change:** none, as one deliberate decision rather than sixty unexamined ones. These are reference lines in a fixed two-column block: each names its flag, its argument and its effect in the imperative, and several already carry the voice outright - `--dry-run`'s "Delete nothing", `--select-file`'s "Either flag lets sections 17/18/19/23 run unattended - a person did choose", `--i-understand-deep` naming all four deep sections by number. Reference prose of this shape belongs to content-map row 5, not row 10, and rewriting it here would put two owners on one block.

### C-023 · `windowsweep.ps1:94-97` · the SAFETY block
```
  Every deletion passes one chokepoint that refuses drive roots, Windows, Program Files, your
  profile root, Documents/Pictures/Desktop, credentials, toolchains and browser/editor state, and
  that never follows a junction or symlink. Sections 17, 18, 19 and 23 ask you to pick item by
  item; 18, 19 and 23 send what you pick to the Recycle Bin. --scan and --dry-run delete nothing,
  though both still write a log and a report. No network calls, ever.
```
**Was:**
```
  Every deletion passes one chokepoint that refuses drive roots, Windows, Program Files, your
  profile root, Documents/Pictures/Desktop, credentials, toolchains and browser/editor state, and
  that never follows a junction or symlink. Personal-file sections are interactive only and use the
  Recycle Bin. --scan and --dry-run change nothing. No network calls, ever.
```
**Change:** the first two lines are untouched - they are the core promise, delivered as a list of refusals, and they are already the best paragraph in the product. Two facts in the second half were wrong.

**One:** "Personal-file sections are interactive only and use the Recycle Bin" folds four sections into one claim that fits three of them. The interactive sections are 17, 18, 19 and 23. Sections 18, 19 and 23 are tier `recycle` and send what you pick to the Recycle Bin; **section 17 is tier `rebuilds`** - stale build artefacts, removed through the chokepoint outright, with no undo. Telling a reader their selection goes to the Recycle Bin when one of the four does not is the worst direction for this error to run. The replacement separates the two facts: which sections ask, and which of those use the bin.

**Two:** "change nothing" repeats C-020's overclaim in the paragraph a sceptical reader will actually stop on. `--scan` and `--dry-run` change nothing *of yours*, and both write a log and a report - so the sentence now says which, in the same breath, rather than being technically defensible and quietly wrong.

Widest line drops from 99 to 97 characters; the block gains one line and two facts.

**Note for the implementer:** the section ids here are literals in an expandable here-string. A drift-proof form is available - filter `$Script:WS_SECTIONS` on `Batch -eq 'interactive'` and on `Tier -eq 'recycle'` - and would be the better build if section 26 ever lands interactive. It is not required for the copy to be correct today.

### C-024 · `windowsweep.ps1:99-101` · the OUTPUT block
```
OUTPUT
  Logs:    C:\Users\you\.windowsweep\logs
  Reports: C:\Users\you\.windowsweep\reports
```
**Was:** the same.

**Change:** none. Two resolved paths, no prose. This is where C-020 and C-023 point.

### C-025 · `windowsweep.ps1:103-104` · the help footer
```
windowsweep v1.2.0  by Ahsan Mahmood <aoneahsan@gmail.com>  https://aoneahsan.com
https://github.com/aoneahsan/windowsweep  -  MIT License
```
**Was:** the same.

**Change:** none.

### C-026 · `windowsweep.ps1:193` · unknown argument
```
unknown argument: --dry-runn
```
**Was:** the same.

**Change:** none. It echoes what was typed, which is what a typo needs. C-032 supplies the next command.

### C-027 · `windowsweep.ps1:114` · a flag missing its value
```
option --days needs a value
```
**Was:** the same.

**Change:** none.

### C-028 · `windowsweep.ps1:169,171,178` · a numeric flag given a non-number
```
--days needs a whole number, got 'lots'
```
**Was:** the same, for `--days`, `--temp-days` and `--large-file-mb`.

**Change:** none. It names the flag, the requirement and the value received. Three lines built from one pattern; keeping them parallel is the point.

### C-029 · `windowsweep.ps1:172` · a bad `--hiberfil` value
```
--hiberfil must be off, reduced or keep
```
**Was:** the same.

**Change:** none. It lists the whole legal set, so there is nothing to look up.

### C-030 · `windowsweep.ps1:198` · an unknown profile
```
unknown profile 'developer' (known: audit, cache-only, deep, dev, minimal, system)
```
**Was:** the same.

**Change:** none. It is the pattern every other error line in this file should be read against - the value that was wrong, followed by the complete set of values that would have worked, so nothing has to be looked up.

### C-031 · `windowsweep.ps1:184,186` · `--select-file` problems
```
--select-file not found: picks.txt
--select-file has no paths in it: picks.txt
```
**Was:** the same.

**Change:** none. Two different failures, two different sentences, each naming the file.

### C-032 · `windowsweep.ps1:274-275` · the bootstrap error pair
```
windowsweep: unknown argument: --dry-runn
try: windowsweep --help
```
**Was:** the same.

**Change:** none. Row 10's CTA is the next command, and this is it - two words and a flag.

### C-033 · `windowsweep.ps1:296` · `--elevate` when already elevated
```
already elevated; --elevate is a no-op
```
**Was:** the same.

**Change:** none. It says the flag did nothing rather than pretending it did something.

### C-034 · `windowsweep.ps1:268` · an unreachable mode
```
unknown mode: walkthroughx
```
**Was:** the same.

**Change:** none. Defensive; `Read-Arguments` refuses first.

### C-035 · `windowsweep.ps1:311` · the interrupt record (log only)
```
run interrupted before it finished (Ctrl-C or host stop) - exit 130
```
**Was:** the same.

**Change:** none. It goes to the log rather than the console, and it names the exit code, which is what a caller reading the log afterwards needs.

---

## §C `modules/walkthrough.ps1` - the walkthrough

### C-036 · `modules/walkthrough.ps1:6` · `Show-Welcome`, the title box
```
windowsweep
Developer-aware Windows cleanup CLI: dry-run first, personal folders refused, zero install via npx.
```
**Was:** the title is `$Script:WS_NAME`; the subtitle is `$Script:WS_TAGLINE`, currently `Safe-by-default Windows cleanup CLI - developer-aware, dry-run first, zero install via npx.`

**Change:** none by this surface. The subtitle is `WS_TAGLINE`, which is **content-map row 2** and was approved at GATE 4 on 2026-09-07; it changes here only because that constant changes, in the same 1.2.0 cascade. Recorded so nobody writes it twice.

Its known overflow stands and is not a defect: 99 characters against the 75 a `Write-Box` subtitle has, ruled cosmetic and accepted on 2026-09-07 after every candidate line overflowed, including the 91-character one shipping today.

### C-037 · `modules/walkthrough.ps1:9` · the walkthrough's opening instruction
```
  This walkthrough visits 15 sections, one at a time. At each step:
```
**Was:** `  This walkthrough visits every cleanup category. At each step:`

**Change:** "every" was false and "category" is not the product's word. The walkthrough visits `WS_WALKTHROUGH` - 15 sections - plus `WS_WALKTHROUGH_ADMIN` when the console is elevated, and it is bracketed by a pre-scan and a disk-usage report. Naming the count is also what row 10 asks of a line like this.

**Note for the implementer:** the number is derived, never a literal - `$Script:WS_WALKTHROUGH.Count`, plus `$Script:WS_WALKTHROUGH_ADMIN.Count` when `$ws.IsAdmin`. Both are in scope in `Show-Welcome` already. A literal 15 would drift the first time the walkthrough order changes, which is exactly the failure IRON rule 4 exists to stop.

### C-038 · `modules/walkthrough.ps1:10` · the per-step key legend
```
    a  run it (default)     s  skip it     q  stop the walkthrough
```
**Was:** the same.

**Change:** none. Three keys, the default marked, no invitation to press any of them.

### C-039 · `modules/walkthrough.ps1:11` · the dry-run notice
```
  DRY-RUN: every step only reports what it would remove.
```
**Was:** the same.

**Change:** none.

### C-040 · `modules/walkthrough.ps1:14` · the settings note
```
developer mode: on   idle window: 100 days   temp window: 3 days
```
**Was:** the same.

**Change:** none. Three resolved numbers, printed before anything runs - and the idle window among them is the Bible's "what is kept" motif shown as a value the reader can check rather than a property described to them.

### C-041 · `modules/walkthrough.ps1:15` · where output goes
```
logs and reports: C:\Users\you\.windowsweep
```
**Was:** the same.

**Change:** none.

### C-042 · `modules/walkthrough.ps1:16` · the author line
```
by Ahsan Mahmood - https://aoneahsan.com
```
**Was:** the same.

**Change:** none.

### C-043 · `modules/walkthrough.ps1:23` · the walkthrough with no console
```
The walkthrough needs an interactive console. For unattended runs use:  windowsweep --all --yes   (or --scan / --dry-run to look first)
```
**Was:** the same.

**Change:** none. A refusal, then two next commands, the safer one named second so it is the last thing read. 135 characters and over any budget - but it is a `Write-Err` at the end of a failed invocation with nothing after it to misalign, and cutting either command would cost a reader the answer.

### C-044 · `modules/walkthrough.ps1:28` · the pre-scan box
```
Pre-scan
Deletes nothing - what each section can reach right now
```
**Was:** subtitle `Read-only - what each section can reach right now`

**Change:** the same correction as C-020, in the place a first-time reader meets the idea first. The pre-scan itself deletes nothing, which is the true and stronger claim; the run around it writes a log. 55 characters against the 75 budget.

### C-045 · `modules/walkthrough.ps1:42` · the per-step prompt
```
  action: a run   s skip   q quit  > 
```
**Was:** the same.

**Change:** none.

### C-046 · `modules/walkthrough.ps1:43` · quitting
```
walkthrough stopped
```
**Was:** the same.

**Change:** none. Two words, and the report records `quit` beside the section.

### C-047 · `modules/walkthrough.ps1:44` · skipping a step
```
skipped
```
**Was:** the same.

**Change:** none.

### C-048 · `modules/walkthrough.ps1:50` · the admin step header
```
  [ STEP 16/18 ]  System-level cleanup (needs Administrator)
```
**Was:** the same.

**Change:** none. "cleanup" survives as the product's own category noun; "Administrator" is Windows' word for the thing being asked.

### C-049 · `modules/walkthrough.ps1:51-56` · the admin step body
```
  This walkthrough runs 12 (Windows Update cache), 13 (Disk Cleanup engine) and 14 (component
  store) when the console is elevated. Six sections need an elevated console in all - 15, 16 and
  20 need --i-understand-deep as well. Run the three afterwards with:
      windowsweep --profile system --yes --elevate
  and, to remove the hibernation file too (section 15):
      windowsweep --only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate
```
**Was:**
```
  Sections 12 (Windows Update cache), 13 (Disk Cleanup engine) and 14 (component store) need an elevated
  console. Run them afterwards with:
      windowsweep --profile system --yes --elevate
  and, if you want the hibernation file gone too (section 15):
      windowsweep --only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate
```
**Change:** this is the elevation summary a reader will treat as complete, and it was not. **Six** sections carry `Admin = $true` - 12, 13, 14, 15, 16 and 20 - and the block named three, mentioned a fourth in passing, and never mentioned 16 or 20 at all. It is the same shape as the defect corrected on `quick-start` in the 2026-09-06 pass, where the page named 12-16 and omitted 20; here the same omission survived in the program.

The replacement says which three *this walkthrough* runs, then states the full count and names the three that need `--i-understand-deep` as well, so the sentence a reader generalises from is true. Both commands are kept verbatim - they work. "if you want ... gone" becomes "to remove", because a walkthrough offering a permanent change should not phrase it as a want.

Widest line drops from 104 characters to 96.

### C-050 · `modules/walkthrough.ps1:57` · the hint carried to the summary
```
Admin sections:  windowsweep --profile system --yes --elevate
```
**Was:** the same.

**Change:** none. It reappears under "next steps" at the end, which is where a reader who skipped the block will look.

### C-051 · `modules/walkthrough.ps1:61` · the closing step header
```
  [ STEP 18/18 ]  Disk usage report
```
**Was:** the same.

**Change:** none.

### C-052 · `modules/walkthrough.ps1:71` · the scheduling tip
```
Schedule the safe batch weekly:   windowsweep --install-task
```
**Was:** the same.

**Change:** none. Shown only when no task exists, which is why it is a tip and not a nag.

### C-053 · `modules/walkthrough.ps1:72` · the reports tip
```
Browse or export past reports:    windowsweep --reports
```
**Was:** the same.

**Change:** none.

### C-054 · `modules/walkthrough.ps1:73` · the dry-run closer
```
This was a dry-run. Run the same command without --dry-run to reclaim the space.
```
**Was:** the same.

**Change:** none, and none is possible - this is sentence 1 of the voice fingerprint, already in the tree. The rehearsal motif in two sentences: what that was, and the one word between it and the performance.

### C-055 · `modules/walkthrough.ps1:76` · the next-steps header
```
next steps:
```
**Was:** the same.

**Change:** none.

---

## §D `modules/menu.ps1` - the menu

### C-056 · `modules/menu.ps1:14` · the menu status line
```
  system drive free: 41.2 GB   dry-run: OFF   auto-yes: OFF   elevated: no
```
**Was:** the same.

**Change:** none. Four facts, one of them measured, above a list of destructive options. This is the P band doing its job.

### C-057 · `modules/menu.ps1:17-25` · the section rows
```
  + [ 7] Browser caches (Chrome, Edge, Brave, Firefox, Vivaldi, Opera)
    [11] Empty the Recycle Bin - PERMANENT [deep]
    [17] Stale project build artefacts (node_modules, dist, .next, target, ...) [interactive]
    [12] Windows Update + system temp (...) [admin]
```
**Was:** the same.

**Change:** none. Titles come from `lib/constants.ps1` and are out of scope; the row's own contribution is the tick for a section already run and the `[admin]` / `[deep]` / `[interactive]` flags, which mark the three sections that behave differently before the reader picks one.

### C-058 · `modules/menu.ps1:28` · the menu action legend
```
   [A] run the safe batch     [D] toggle dry-run     [Y] toggle auto-yes     [S] summary     [Q] quit
```
**Was:** the same.

**Change:** none.

### C-059 · `modules/menu.ps1:41` · the menu prompt
```
  Select [0-25 / A / D / Y / S / Q]: 
```
**Was:** the same.

**Change:** none. The range is derived from `WS_SECTIONS` rather than written down - IRON rule 4, in a prompt.

### C-060 · `modules/menu.ps1:34` · the menu with no console
```
The menu needs an interactive console. For unattended runs use:  windowsweep --all --yes
```
**Was:** the same.

**Change:** none.

### C-061 · `modules/menu.ps1:58` · a section number that does not exist
```
no section 26
```
**Was:** the same.

**Change:** none. Three words. Section 26 is genuinely free, and when it lands this line stops appearing for it on its own.

### C-062 · `modules/menu.ps1:60` · an unusable key
```
unrecognised choice: z
```
**Was:** the same.

**Change:** none; en-GB spelling is already right.

---

## §E `modules/runner.ps1` - dispatch, run header, scan mode, run summary

### C-063 · `modules/runner.ps1:13,16` · a bad id inside `--only`
```
no section 26 - ignored
```
**Was:** the same.

**Change:** none. It says what was dropped, so the run's scope is not a surprise.

### C-064 · `modules/runner.ps1:18` · an unparseable fragment
```
cannot parse section 'seven' - ignored
```
**Was:** the same.

**Change:** none.

### C-065 · `modules/runner.ps1:35` · a profile expanded
```
profile 'dev' = sections 1,2,3,4,5,6,17
```
**Was:** the same.

**Change:** none. A profile is a name for a list, and the list is printed before it runs. The list read aloud.

### C-066 · `modules/runner.ps1:40` · after `--exclude`
```
after --exclude: sections 1,2,3,5,6
```
**Was:** the same.

**Change:** none.

### C-067 · `modules/runner.ps1:73` · an unknown section at dispatch
```
no section 26
```
**Was:** the same.

**Change:** none.

### C-068 · `modules/runner.ps1:80` · the interactive-only refusal
```
section 18 is interactive-only: it needs a person at the keyboard, or a selection passed with --select / --select-file.
```
**Was:** the same.

**Change:** none. This is the product's whole position on personal files in one sentence; it names both ways out; and at 118 characters it stays exactly as long as it needs to be, because every clause in it is load-bearing.

### C-069 · `modules/runner.ps1:87` · an interactive section running unattended
```
section 18 runs unattended because a selection was supplied (--select / --select-file): a person chose these.
```
**Was:** the same.

**Change:** none. It states why the guard is not firing, which is the only honest way to run an interactive section without a person present.

### C-070 · `modules/runner.ps1:90` · the deep refusal
```
section 11 is deep (irreversible or system-changing): refused in batch mode without --i-understand-deep.
```
**Was:** the same.

**Change:** none. "irreversible" earns its place: section 11 empties the Recycle Bin and 16 clears event logs, and neither has an undo.

### C-071 · `modules/runner.ps1:98-99` · an admin section without elevation
```
section 12 needs Administrator rights - skipped.
run it elevated:  windowsweep --only 12 --yes --elevate
```
**Was:** the same.

**Change:** none, and this pair is the model for row 10's CTA: what did not happen, then the exact command that makes it happen, with the section id substituted.

### C-072 · `modules/runner.ps1:106` · developer mode off
```
developer mode is off - section 17 (developer-only data) skipped.
```
**Was:** the same.

**Change:** none. It names the answer that caused the skip, and C-185 already said where that answer is stored.

### C-073 · `modules/runner.ps1:119` · a section that threw
```
section 12 failed: <the PowerShell exception message>
```
**Was:** the same.

**Change:** none. Out of scope: the tail is an exception message verbatim. The prefix names the section, which is the part a reader can act on.

### C-074 · `modules/runner.ps1:128` · the dry-run section total
```
  [dry-run] this section would reclaim about 1.4 GB
```
**Was:** `  [dry-run] this section would free about 1.4 GB`

**Change:** `reclaim` is the glossary's verb for what this tool does to space, and "free up" is in its Never column. The summary at the end of the same run already says `Reclaimed:` (C-089) and `--stats` says `Reclaimed overall:`, so this line was the one place the product used a different verb for the same act. "about" stays: an estimate is hedged, because the Bible forbids promising a number.

### C-075 · `modules/runner.ps1:130` · the real section total
```
  + this section reclaimed 1.4 GB (system drive gained 1.4 GB)   running total: 12.9 GB
```
**Was:** `  + this section freed 1.4 GB (system drive gained 1.4 GB)   running total: 12.9 GB`

**Change:** the same verb, and nothing else. Three measured numbers per line - what this section did, what the drive shows, and the total so far - and the middle one exists because the first two can legitimately disagree.

87 characters against 83 shipped, both past an 80-column terminal. The four characters buy one verb across the whole product; the overflow class is the one already ruled cosmetic.

### C-076 · `modules/runner.ps1:132` · a section that found nothing
```
no measurable change in this section
```
**Was:** the same.

**Change:** none. "no measurable change" rather than "nothing found" - the honest claim is about the measurement, and this voice restores hedging where the answer is uncertain.

### C-077 · `modules/runner.ps1:142` · a batch that resolved to nothing
```
no sections to run - check --only / --profile against windowsweep --list
```
**Was:** `no sections to run`

**Change:** the shipped line is accurate and leaves the reader stuck; every other error on this surface names the next command. This one now does, and points at the catalogue rather than at the help text, because a wrong id or a mistyped profile is what put them here. 72 characters.

### C-078 · `modules/runner.ps1:145` · the resolved run list
```
running sections: 0,1,2,3,5,6,7,8,9,10,21
```
**Was:** the same.

**Change:** none.

### C-079 · `modules/runner.ps1:159` · the run header
```
mode: all   strategy: prune files idle 100+ days (temp: 3+ days)   developer: on (config)   elevated: no   auto-yes: True
```
**Was:** the same.

**Change:** none. Everything that will decide what goes, on one line, before anything goes - and the strategy string carries the resolved numbers rather than the defaults.

### C-080 · `modules/runner.ps1:157` · the purge strategy label
```
FULL PURGE of cache targets
```
**Was:** the same.

**Change:** none. `purge` is the one banned word the glossary readmits, for the literal `--purge-all` flag, and this is that flag's own strategy line. The capitals are a warning about a mode the reader turned on deliberately, not urgency: nothing here asks them to hurry.

### C-081 · `modules/runner.ps1:160` · the dry-run header notice
```
  DRY-RUN: nothing will be deleted; sizes below are estimates of what a real run would remove.
```
**Was:** the same.

**Change:** none. It marks the numbers as estimates before the reader sees any, which is the difference between hedging and excusing.

### C-082 · `modules/runner.ps1:161` · the log path
```
log: C:\Users\you\.windowsweep\logs\2026-09-07_101533-12044.log
```
**Was:** the same.

**Change:** none.

### C-083 · `modules/runner.ps1:168` · the scan-mode notice
```
scan only - nothing is deleted; a log and a report are still written
```
**Was:** `read-only scan - nothing is deleted`

**Change:** the third and last instance of the "read-only" overclaim (C-020, C-044), and the one where it is most exposed: this line is the first thing `--scan` prints, and a reader running `--scan` to find out whether this program can be trusted is being told something that is not quite true. The correction is the same one the docs already carry. 68 characters, against 35 - the only slot in this draft that grows to add a fact rather than to keep one.

### C-084 · `modules/runner.ps1:170` · the targets box
```
Targets on disk
What each section can reach, and how much it currently holds
```
**Was:** the same.

**Change:** none. "can reach" is precise in the way "will delete" would not be - the idle gate stands between them, and C-195 says so directly underneath. 60 characters against the 75 budget.

### C-085 · `modules/runner.ps1:173` · the scan's report-step title
```
Read-only scan
```
**Was:** `Read-only scan`

**Change:** none, deliberately, and this is the boundary of the C-020 correction rather than an exception to it. This string is not printed to the console: it is a `title` field in the saved JSON report, and it reappears in the exported Markdown and HTML. Changing it edits a stored artefact's schema-adjacent content for a word nobody reads on screen. The console strings are corrected; the report label stays until whoever owns the report surface decides otherwise. See NEEDS DECISION 2.

### C-086 · `modules/runner.ps1:179` · the summary box
```
Session summary
```
**Was:** the same.

**Change:** none.

### C-087 · `modules/runner.ps1:181` · the dry-run mode row
```
  Mode:                    DRY-RUN - nothing was deleted
```
**Was:** the same.

**Change:** none. Past tense at the end of the run, and it is the first row so it cannot be missed under the numbers.

### C-088 · `modules/runner.ps1:182` · the dry-run estimate row
```
  Would reclaim (est.):    1.4 GB
```
**Was:** `  Would free (estimate):   1.4 GB`

**Change:** the verb, for the reason in C-074, and the abbreviation for a measured reason: `Write-Kv` pads its key to 24 characters, `Would reclaim (estimate):` is 25, and a 25-character key silently pushes this row's value one column right of every other row in the summary. `Would reclaim (est.):` is 21 and keeps the hedge. The longest key shipping today is 23, so the column is unchanged.

### C-089 · `modules/runner.ps1:184` · the real total row
```
  Reclaimed:               12.9 GB
```
**Was:** the same.

**Change:** none - it is already the glossary's verb, and it is why C-074, C-075 and C-088 move toward it rather than away.

### C-090 · `modules/runner.ps1:187` · duration
```
  Duration:                2m 14s
```
**Was:** the same.

**Change:** none.

### C-091 · `modules/runner.ps1:190` · the section tally
```
  Sections run / skipped:  9 / 2
```
**Was:** the same.

**Change:** none. Two counts, and the skipped one is not hidden.

### C-092 · `modules/runner.ps1:191` · the log row
```
  Log:                     C:\Users\you\.windowsweep\logs\2026-09-07_101533-12044.log
```
**Was:** the same.

**Change:** none.

### C-093 · `modules/runner.ps1:193` · the report row and its absence
```
  Report (JSON):           C:\Users\you\.windowsweep\reports\report-2026-09-07_101533-12044.json
  Report:                  (disabled via --no-report)
```
**Was:** the same.

**Change:** none. The second form names the flag that turned it off, so an absent report never reads as a failure.

### C-094 · `modules/runner.ps1:198` · the refusal roll-up
```
refused in batch mode:
    section 18 (interactive-only)
    section 11 (deep, add --i-understand-deep)
```
**Was:** the same.

**Change:** none. Every refusal repeated at the end, each with its reason in brackets and, where one exists, the flag that would lift it. A summary that lists what it declined to do is this Bible's second band in structural form.

### C-095 · `modules/runner.ps1:203` · the summary's next-steps header
```
next steps:
```
**Was:** the same.

**Change:** none.

### C-096 · `modules/runner.ps1:207` · the closing credit
```
windowsweep v1.2.0 by Ahsan Mahmood - https://github.com/aoneahsan/windowsweep
```
**Was:** the same.

**Change:** none. The repository, not a marketing line - the guarantee in C-001 is checkable only because this address is here.

---

## §F `modules/reports.ps1` - the reports manager and run history

### C-097 · `modules/reports.ps1:16` · no reports yet
```
no reports yet - windowsweep --scan writes one and deletes nothing
```
**Was:** `no reports yet - run a cleanup first`

**Change:** an empty state that names a next command, per row 10's CTA - and the command it names deletes nothing, which is the right first suggestion to someone who has not run this program yet. The shipped line sends them to a cleanup with no flags. 66 characters.

### C-098 · `modules/reports.ps1:17` · the report list header
```
    #  REPORT                             SIZE  STARTED           RECLAIMED    MODE
```
**Was:** the same.

**Change:** none. `RECLAIMED` was already the glossary's word here.

### C-099 · `modules/reports.ps1:28` · a report row
```
    1  report-2026-09-07_101533-12044.json   4.1 KB  2026-09-07 10:15  12.9 GB      all
    2  report-2026-09-06_223104-8812.json    3.8 KB  2026-09-06 22:31  ~1.4 GB (dry) scan
```
**Was:** the same.

**Change:** none. The `~` and the `(dry)` marker keep a rehearsal from being read as a result three weeks later, which is the kind of detail this voice exists to protect.

### C-100 · `modules/reports.ps1:39,71` · an unreadable report
```
cannot read C:\Users\you\.windowsweep\reports\report-2026-09-07_101533-12044.json
```
**Was:** the same.

**Change:** none. It names the path.

### C-101 · `modules/reports.ps1:64,131` · an export written
```
wrote C:\Users\you\.windowsweep\reports\report-2026-09-07_101533-12044.md
```
**Was:** the same.

**Change:** none. One verb, one path.

### C-102 · `modules/reports.ps1:138` · a bad export format
```
format must be md, html or both
```
**Was:** the same.

**Change:** none.

### C-103 · `modules/reports.ps1:140` · nothing to export
```
no reports in C:\Users\you\.windowsweep\reports
```
**Was:** the same.

**Change:** none.

### C-104 · `modules/reports.ps1:145` · an index out of range
```
index 9 out of range (1..2)
```
**Was:** the same.

**Change:** none. The range is measured, not assumed.

### C-105 · `modules/reports.ps1:146` · a bad export id
```
ID must be a number, latest or all
```
**Was:** the same.

**Change:** none.

### C-106 · `modules/reports.ps1:156` · the reports-manager box
```
Reports manager
C:\Users\you\.windowsweep\reports
```
**Was:** the same.

**Change:** none - the subtitle is the directory, which is more use than a sentence about it.

### C-107 · `modules/reports.ps1:159` · the manager with no console
```
non-interactive: use --export md|html|both N|latest|all
```
**Was:** the same.

**Change:** none. A refusal and the flag that replaces it.

### C-108 · `modules/reports.ps1:161` · the manager action legend
```
  cm N  markdown    ch N  html    cb N  both    all  export everything    v N  view JSON    o N  open HTML    d N  delete    q  quit
```
**Was:** the same.

**Change:** none. 131 characters on one line, which is dense rather than long-winded: nine actions, each two tokens.

### C-109 · `modules/reports.ps1:171-189` · a missing or out-of-range index
```
invalid index
```
**Was:** the same.

**Change:** none. Two words, printed beside a numbered list still on screen.

### C-110 · `modules/reports.ps1:180` · opening an exported report
```
opened C:\Users\you\.windowsweep\reports\report-2026-09-07_101533-12044.html
could not open C:\Users\you\.windowsweep\reports\report-2026-09-07_101533-12044.html
```
**Was:** the same.

**Change:** none. Both outcomes name the file, so the failure is still actionable.

### C-111 · `modules/reports.ps1:185` · deleting a report
```
Delete report-2026-09-07_101533-12044.json and its .md/.html siblings?
```
**Was:** the same.

**Change:** none. It names the file and the two it will take with it, and its default is no.

### C-112 · `modules/reports.ps1:187` · a report deleted
```
deleted
```
**Was:** the same.

**Change:** none.

### C-113 · `modules/reports.ps1:192` · an unknown manager action
```
unknown action: x
```
**Was:** the same.

**Change:** none.

### C-114 · `modules/reports.ps1:197` · the run-history box
```
Run history
C:\Users\you\.windowsweep
```
**Was:** the same.

**Change:** none.

### C-115 · `modules/reports.ps1:199` · no history
```
no runs recorded yet
```
**Was:** the same.

**Change:** none. `--stats` is a read of the record, so unlike C-097 there is no command to suggest that would not be a guess at intent.

### C-116 · `modules/reports.ps1:206-211` · the history rows
```
  Real runs:               7
  Dry-runs:                3
  Reclaimed overall:       58.4 GB
  Latest report:           C:\Users\you\.windowsweep\reports\report-2026-09-07_101533-12044.json
  Logs on disk:            2.1 MB
```
**Was:** the same.

**Change:** none. Rehearsals counted separately from runs, and the total drawn only from the real ones - which is the arithmetic the voice would demand if the code had not already done it.

### C-117 · `modules/reports.ps1:44-134` · the exported Markdown and HTML bodies (about 30 strings)
```
# windowsweep session report
_Generated from `report-2026-09-07_101533-12044.json`_
## Overview | ## Result | ## Drives | ## Steps
| Field | Value | ... | Dry-run | Would free (estimate) | Reclaimed | ...
Would free (dry-run estimate)
```
**Was:** the same.

**Change:** none in this draft. These are the headings and labels of a generated document, not console strings, and no content-map row names them. They also contain a fourth "Would free" (`reports.ps1:104`) that C-088's reasoning would change - so leaving them is a real inconsistency, not a clean boundary. Raised as **NEEDS DECISION 2** rather than decided here.

---

## §G `modules/health.ps1` - section 0, the health report

### C-118 · `modules/health.ps1:39` · the section-0 intro
```
  Read-only snapshot of the machine: nothing is changed here.
```
**Was:** the same.

**Change:** none - and this is the one "Read-only" in the tree that is true. Section 0 reads CIM classes, drive info and two registry values, and writes nothing at all; the log around it belongs to the run, not to this section. C-020, C-044 and C-083 were corrected because they claimed it for a *mode*; this claims it for a section that earns it.

### C-119 · `modules/health.ps1:42-47` · the machine rows
```
  Windows:                 Windows 10 Pro for Workstations 10.0.19045 (build 19045)
  Uptime:                  4d 6h 12m
  RAM:                     63.9 GB total, 21.4 GB free
  PowerShell:              5.1.19041.6093 (Desktop)
```
**Was:** the same.

**Change:** none. Facts with units, no interpretation.

### C-120 · `modules/health.ps1:48-50` · the elevation row
```
  Elevated:                no (your account can elevate: --elevate)
  Elevated:                no (standard user; admin sections need an administrator)
```
**Was:** the same.

**Change:** none, and the two forms are the reason to keep it: the second does not offer a flag that would not work. Telling a standard user to pass `--elevate` would be the more helpful-sounding answer and the wrong one.

### C-121 · `modules/health.ps1:51-53` · the developer-mode row
```
  Developer mode:          on (config)
  Developer mode:          not decided yet
```
**Was:** the same.

**Change:** none. It names where the answer came from - `flag`, `config`, `answer` or `default` - so a surprising cleanup strategy is traceable to its cause in one line.

### C-122 · `modules/health.ps1:55` · detected tooling
```
  Dev tooling found:       node, yarn, docker, cargo, go
```
**Was:** the same.

**Change:** none.

### C-123 · `modules/health.ps1:61` · the low-disk warning
```
system drive has only 4.2 GB free (3.1%) - the sections below list what can be reclaimed
```
**Was:** `system drive has only 4.2 GB free (3.1%) - Windows slows down badly below ~10%; this run should help`

**Change:** two problems, one line. "Windows slows down badly below ~10%" is a performance claim with no source, and the Bible's rule is that numbers are exact and sourced - a rule-of-thumb threshold with a tilde in front of it is neither. And "this run should help" is a promise about an outcome the tool cannot know, in a voice whose whole discipline is that it never promises a number.

The replacement keeps the two facts it measured and points at the list underneath, which is where the answer actually is. 88 characters, against 100 shipped.

### C-124 · `modules/health.ps1:65` · the hibernation file
```
  hiberfil.sys:            13.7 GB (hibernation available) - section 15 can shrink or remove it (admin)
  hiberfil.sys:            absent (hibernation off)
```
**Was:** the same.

**Change:** none. A size, a state, the section that can act on it, and the fact that it needs elevation - in the order a reader needs them.

### C-125 · `modules/health.ps1:67` · the page file
```
  pagefile:                C:\pagefile.sys  16.0 GB allocated
```
**Was:** the same.

**Change:** none. Reported and never touched; the protected list holds it.

### C-126 · `modules/health.ps1:69` · disk images
```
  disk image:              C:\Users\you\AppData\Local\Docker\wsl\disk\docker_data.vhdx  48.3 GB (section 20 compacts it, admin)
```
**Was:** the same.

**Change:** none. Names the path and the section, and "compacts" rather than "cleans" is the accurate verb for what section 20 does.

### C-127 · `modules/health.ps1:75` · WSL distributions
```
  WSL distros:             Ubuntu Running 2 | docker-desktop Stopped 2
```
**Was:** the same.

**Change:** none.

### C-128 · `modules/health.ps1:79` · startup items
```
  Startup items:           14 (section 25 lists them all; change them in Task Manager > Startup - this tool never does)
```
**Was:** the same.

**Change:** none. A count, a section that will show the detail, and a refusal that sends the reader somewhere else to act. "this tool never does" is the second band in four words, and it is already in the tree.

### C-129 · `modules/health.ps1:84` · Storage Sense
```
  Storage Sense:           off
```
**Was:** the same.

**Change:** none.

### C-130 · `modules/health.ps1:88-92` · last-access tracking
```
  Last-access tracking:    disabled - idle age uses write/creation times (keeps more)
  Last-access tracking:    enabled - last-access times are reliable
```
**Was:** the disabled form read `disabled - idle age uses write/creation times (the safe reading)`

**Change:** "the safe reading" is the adjective the Bible reserves, used here for a fallback rule rather than for the product - a near miss, but the near misses are how a banned word returns. It also said less than it could: the *consequence* of falling back to write and creation times is that files look younger, so fewer of them clear the idle gate. "(keeps more)" states that, and ties the line to the Bible's "what is kept" motif rather than reaching for a reassurance word. The enabled form is untouched.

85 characters printed, against 91 shipped - both past the terminal, and this one closer to it.

### C-131 · `modules/health.ps1:98` · running applications
```
running now, their caches will be skipped until closed: Chrome, VS Code, Slack
```
**Was:** the same.

**Change:** none. It is sentence 7 of the fingerprint in all but the closing command, and it explains a skip before the reader can misread it as a failure.

---

## §H `modules/release_helpers.ps1` - version, `--list`, feedback, task, alias, data

### C-132 · `modules/release_helpers.ps1:4-18` · `--version`
```
  windowsweep v1.2.0
  Developer-aware Windows cleanup CLI: dry-run first, personal folders refused, zero install via npx.

  Author:    Ahsan Mahmood
  Email:     aoneahsan@gmail.com
  Web:       https://aoneahsan.com
  LinkedIn:  https://linkedin.com/in/aoneahsan
  Source:    https://github.com/aoneahsan/windowsweep
  License:   MIT License

  PowerShell:   5.1.19041.6093 (Desktop)
  Project root: C:\Users\you\AppData\Roaming\npm\node_modules\windowsweep
```
**Was:** the same shape, with the old `WS_TAGLINE`.

**Change:** none by this surface. Line 2 is `WS_TAGLINE` - content-map row 2, approved at GATE 4 on 2026-09-07 - and it changes here because that constant changes. `Write-Host` rather than `Write-UiLine`, so no box rule applies and the 99-character line sits fine.

### C-133 · `modules/release_helpers.ps1:25` · the `--list` table header
```
    #  SECTION                                    TIER       ADMIN BATCH
```
**Was:** the same.

**Change:** none.

### C-134 · `modules/release_helpers.ps1:34` · the safe-batch line
```
  safe batch (--all): 0,1,2,3,5,6,7,8,9,10,21  (+12,13 when elevated)
```
**Was:** the same.

**Change:** none - both lists are already interpolated from `WS_SAFE_BATCH` and `WS_SAFE_BATCH_ADMIN`, which is what C-021 brings the help text into line with.

### C-135 · `modules/release_helpers.ps1:35` · the profile lines
```
  profile audit       0,21,22,24,25
  profile system      12,13,14
```
**Was:** the same.

**Change:** none.

### C-136 · `modules/release_helpers.ps1:36` · the batch-policy legend
```
  batch policy: safe = runs in --all | optin = --only/--profile with --yes | deep = also needs --i-understand-deep | interactive = never batch
```
**Was:** the same.

**Change:** none. Four policies, each defined by the flags that reach it, ending on the one that no flag reaches. "never batch" is the strongest three-word refusal in the program and it is the last thing on the line.

### C-137 · `modules/release_helpers.ps1:264` · the feedback box
```
Send feedback / report a bug
All offline - nothing leaves your machine unless you send it
```
**Was:** the same.

**Change:** none. 59 characters, inside the 75 budget, and the subtitle is a refusal with its one exception attached.

### C-138 · `modules/release_helpers.ps1:265-267` · the contact lines
```
  Issues:    https://github.com/aoneahsan/windowsweep/issues
  Email:     aoneahsan@gmail.com
  Web:       https://aoneahsan.com
```
**Was:** the same.

**Change:** none.

### C-139 · `modules/release_helpers.ps1:269-271` · what to include in a report
```
  Please include: Windows version, PowerShell version ($PSVersionTable.PSVersion),
  windowsweep version (currently v1.2.0), the exact command, what you expected,
  what happened, and the log from --debug-bundle (review it first: it holds paths from your machine).
```
**Was:** the same.

**Change:** none. The closing parenthesis is the whole voice: it asks for a log and warns what is in it in the same sentence, rather than collecting it quietly.

### C-140 · `modules/release_helpers.ps1:273-274` · the two commands
```
  windowsweep --report-issue   opens a pre-filled GitHub issue in your browser
  windowsweep --debug-bundle   zips the latest log + report for attaching
```
**Was:** the same.

**Change:** none.

### C-141 · `modules/release_helpers.ps1:276` · the privacy note
```
Privacy: windowsweep makes no network calls. Logs and reports are written only under ~\.windowsweep.
```
**Was:** the same.

**Change:** none. This is supporting commitment 3 of the core promise, stated where a reader who has just been asked for a log will read it. Third person, no company, no "we".

### C-142 · `modules/release_helpers.ps1:282` · the issue title prefix
```
[bug] windowsweep v1.2.0: 
```
**Was:** the same.

**Change:** none.

### C-143 · `modules/release_helpers.ps1:283-292` · the issue body template
```
**What happened**
**What you expected**
**Command you ran**
**Environment (auto-filled, review before submitting)**
- OS: Windows 10 Pro for Workstations 10.0.19045 (10.0.19045.0)
- PowerShell: 5.1.19041.6093 (Desktop)
- windowsweep: v1.2.0 via node
- Elevated: False
**Log excerpt** (from `windowsweep --debug-bundle`, paths redacted as you see fit)
```
**Was:** the same.

**Change:** none. Four questions in the reader's own order, and the environment block says it is auto-filled and asks to be reviewed before it goes anywhere.

### C-144 · `modules/release_helpers.ps1:293` · the report-an-issue box
```
Report an issue
Opens a pre-filled GitHub issue; nothing is sent until you submit it
```
**Was:** subtitle `A pre-filled GitHub issue opens in your browser; nothing is submitted until you click Submit`

**Change:** length, measured. A `Write-Box` subtitle has 75 characters and the shipped line is 92, so it runs 17 glyphs past the rule it sits under - the only shipped subtitle in the eight files that does. The replacement is 68 and keeps both halves of the sentence: what will happen, and the refusal that nothing goes without the reader's click. "in your browser" is dropped because C-146 says it two lines later, and "click Submit" becomes "submit it" because the button's label is GitHub's to change.

### C-145 · `modules/release_helpers.ps1:294` · what the issue carries
```
Environment facts included: OS build, PowerShell version, tool version, launcher, elevation. No paths, no logs.
```
**Was:** the same.

**Change:** none. It enumerates the five facts and then refuses two categories by name. That final clause is the sentence that makes the offer trustworthy, and it is already there.

### C-146 · `modules/release_helpers.ps1:295` · the browser prompt
```
Open the pre-filled issue in your browser now?
```
**Was:** the same.

**Change:** none.

### C-147 · `modules/release_helpers.ps1:296` · the browser opened
```
opened - review, edit, then submit
```
**Was:** the same.

**Change:** none. Three imperatives, in order, and the tool's part is finished at the first.

### C-148 · `modules/release_helpers.ps1:296` · no browser
```
could not open a browser. URL:
```
**Was:** the same.

**Change:** none - the URL follows on its own line, which is what makes it copyable.

### C-149 · `modules/release_helpers.ps1:298-299` · the declined path
```
  URL (copy it into a browser):
  https://github.com/aoneahsan/windowsweep/issues/new?title=...
```
**Was:** the same.

**Change:** none. Declining the browser still leaves the reader with everything the tool built.

### C-150 · `modules/release_helpers.ps1:304` · the debug-bundle box
```
Debug bundle
Latest log + latest report + system manifest, zipped locally
```
**Was:** the same.

**Change:** none. 60 characters; "locally" is the fact that matters and it is the last word.

### C-151 · `modules/release_helpers.ps1:307` · the bundle written
```
bundle created: C:\Users\you\.windowsweep\feedback\debug-bundle-2026-09-07_101533.zip
```
**Was:** the same.

**Change:** none.

### C-152 · `modules/release_helpers.ps1:308` · the sharing warning
```
Review the bundle before sharing - it contains paths from your machine and a cache-size snapshot.
```
**Was:** the same.

**Change:** none. It names what is inside rather than saying the bundle is fine to send.

### C-153 · `modules/release_helpers.ps1:309` · where to attach it
```
Attach it to an issue at https://github.com/aoneahsan/windowsweep/issues
```
**Was:** the same.

**Change:** none.

### C-154 · `modules/release_helpers.ps1:333-337` · the npx installer refusal
```
--install-task is refused under npx: it would point at the npx cache, which npm evicts.
  Install once, then register from the global command:
    npm install -g windowsweep
    windowsweep --install-task
```
**Was:** the same.

**Change:** none. It states the refusal, then its cause, then the two commands that get the reader what they came for - which is the pattern row 10 asks of every line on this surface, done better here than anywhere else in the program.

### C-155 · `modules/release_helpers.ps1:342` · the install-task box
```
Install weekly Scheduled Task
windowsweep weekly safe cleanup - Sundays 03:00, safe batch, no prompts
```
**Was:** the same.

**Change:** none. 71 characters, inside the budget. "safe batch" is the product's own name for `WS_SAFE_BATCH`, not the adjective C-001 removes - a defined term, printed by `--list` as well.

### C-156 · `modules/release_helpers.ps1:344` · the task already exists
```
task already exists
```
**Was:** the same.

**Change:** none.

### C-157 · `modules/release_helpers.ps1:349` · the task's command
```
action: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -NoLogo -ExecutionPolicy Bypass -File "C:\...\windowsweep.ps1" --all --yes --quiet --no-color --notify
```
**Was:** the same.

**Change:** none. The exact command line, printed before it is registered, including all five flags. Naming what a scheduled task will run every Sunday is this Bible's premise applied to the one thing in this program that acts while nobody is watching.

### C-158 · `modules/release_helpers.ps1:350` · under `--dry-run`
```
would register the task
```
**Was:** the same.

**Change:** none.

### C-159 · `modules/release_helpers.ps1:351` · the registration prompt
```
Register this task for your user account?
```
**Was:** the same.

**Change:** none - "for your user account" is the scope, and it is in the question rather than in a note under it.

### C-160 · `modules/release_helpers.ps1:351,357,367` · declining
```
skipped
```
**Was:** the same.

**Change:** none.

### C-161 · `modules/release_helpers.ps1:357` · the task registered
```
registered 'windowsweep weekly safe cleanup' (runs as your user, Sundays 03:00; catches up if the PC was off)
```
**Was:** the same.

**Change:** none. The catch-up clause is a real behaviour of `-StartWhenAvailable` and would surprise someone who found a Tuesday run in the log.

### C-162 · `modules/release_helpers.ps1:358` · registration failed
```
could not register the task: <the PowerShell exception message>
```
**Was:** the same.

**Change:** none. Out of scope: the tail is an exception verbatim.

### C-163 · `modules/release_helpers.ps1:362-370` · removing the task
```
Remove weekly Scheduled Task
no task found
would unregister the task
Remove 'windowsweep weekly safe cleanup'?
task removed
```
**Was:** the same.

**Change:** none. Five strings, each doing one thing; the confirmation names the task.

### C-164 · `modules/release_helpers.ps1:375` · the install-alias box
```
Install profile alias
Adds a 'cleanup' function to your PowerShell profile
```
**Was:** the same.

**Change:** none. 51 characters.

### C-165 · `modules/release_helpers.ps1:379` · the alias already present
```
alias already present in C:\Users\you\Documents\WindowsPowerShell\profile.ps1
```
**Was:** the same.

**Change:** none - it names the file it checked.

### C-166 · `modules/release_helpers.ps1:380-381` · what will be written
```
will append to C:\Users\you\Documents\WindowsPowerShell\profile.ps1
function cleanup { & "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile ... @args }
```
**Was:** the same.

**Change:** none. The file, then the exact line, before the question. The premise again: it shows what it will write to a file the reader owns.

### C-167 · `modules/release_helpers.ps1:383` · the alias prompt
```
Add it?
```
**Was:** the same.

**Change:** none. Two words, because C-166 already said everything.

### C-168 · `modules/release_helpers.ps1:389` · the alias added
```
added. Open a new PowerShell window (or run '. $PROFILE.CurrentUserAllHosts'), then type: cleanup
```
**Was:** the same.

**Change:** none. The next action, its shortcut, and the word to type.

### C-169 · `modules/release_helpers.ps1:394-404` · removing the alias
```
Remove profile alias
no profile file
alias not present
would remove the alias block
Remove the windowsweep alias from C:\Users\you\Documents\WindowsPowerShell\profile.ps1 ?
alias removed
```
**Was:** the same.

**Change:** none. Two different absences get two different sentences, which is more use than one generic line.

### C-170 · `modules/release_helpers.ps1:413` · the data-removal box
```
Remove windowsweep data
C:\Users\you\.windowsweep
```
**Was:** the same.

**Change:** none.

### C-171 · `modules/release_helpers.ps1:414` · nothing there
```
nothing to remove
```
**Was:** the same.

**Change:** none.

### C-172 · `modules/release_helpers.ps1:416` · what is there
```
C:\Users\you\.windowsweep holds 2.4 MB of logs, reports, bundles and config
```
**Was:** the same.

**Change:** none. A path, a measured size, and the four things inside it, before the question.

### C-173 · `modules/release_helpers.ps1:417` · under `--dry-run`
```
would remove C:\Users\you\.windowsweep
```
**Was:** the same.

**Change:** none.

### C-174 · `modules/release_helpers.ps1:418` · the confirmation
```
Delete it all (logs, reports, your developer answer)?
```
**Was:** the same.

**Change:** none, and this is the most carefully built prompt in the file: it defaults to no, it passes `-NoAutoYes` so `--yes` cannot answer it, and it names the developer answer specifically, because that is the item a reader would not have thought of and would miss next run.

### C-175 · `modules/release_helpers.ps1:420` · removed
```
removed
```
**Was:** the same.

**Change:** none.

### C-176 · `modules/release_helpers.ps1:428` · the prune box
```
Prune run history older than 90 days
C:\Users\you\.windowsweep
```
**Was:** the same.

**Change:** none - the threshold is interpolated from `$Days`, so the title states what this invocation will do rather than what the default does.

### C-177 · `modules/release_helpers.ps1:437` · the prune result
```
would remove 12 file(s), 640 KB
removed 12 file(s), 640 KB
```
**Was:** the same.

**Change:** none. A count and a size in both cases, differing by one word.

### C-178 · `modules/release_helpers.ps1:47-255` · self-test output (about 40 strings)
```
Self-test
Verify syntax, safety guards, dry-run guarantee, junction handling
refuses  C:\Users\you\Documents  (inside protected: %USERPROFILE%\Documents)
all 151 checks passed - windowsweep is ready
```
**Was:** the same.

**Change:** none. Out of scope: `--self-test` is a developer gate, not a product voice surface. Noted because it is the largest block of strings in the file and its absence from the inventory should be a decision rather than an oversight.

---

## §I `lib/config.ps1` - the first-run prompt and the purge confirmation

Beyond the eight files the brief named. Covered because the Bible's glossary defines `developer mode` as "the answer to the first-run question", which makes this prompt row 10's whichever file holds it.

### C-179 · `lib/config.ps1:72` · the first-run box
```
One question before anything else
It decides how package and build caches are treated
```
**Was:** the same.

**Change:** none. 51 characters, and the title is the best line in the program's first ten seconds: it bounds the interrogation to one question before the reader has to wonder how many are coming.

### C-180 · `lib/config.ps1:73` · the question
```
  Are you a developer on this machine?
```
**Was:** the same.

**Change:** none. "on this machine" is the part that makes it answerable.

### C-181 · `lib/config.ps1:74-75` · what yes means
```
yes = package/build/test-runner caches are only pruned when idle 100+ days (recent work stays fast);
```
**Was:** the same text with `100` written as a literal.

**Change:** the number becomes `$($ws.Days)`. `Initialize-Settings` runs before `Resolve-DeveloperMode` in the bootstrap, so `$ws.Days` is already resolved from `--days` or the config when this prints - which means someone running `windowsweep --days 30` is currently told the gate is 100 days while the run uses 30. A wrong number in the answer to the product's only question, and it renders identically on a default run, which is why nothing has caught it.

100 characters at the default, unchanged from shipped.

### C-182 · `lib/config.ps1:75` · what yes keeps
```
      the newest version of every versioned tool cache is kept, unless --purge-all.
```
**Was:** `      the newest version of every versioned tool cache is always kept.`

**Change:** "always" is not true. `--purge-all` removes that protection, `lib/safety.ps1` has always said so, and the 2026-09-06 docs pass corrected the identical word on the `developer-mode` page - which said "unconditionally" - because the safety page and that page disagreed in the one case that mattered. The program's own prompt still carried the overclaim after both pages were fixed.

83 characters against 70, and 17 inside the block's own longest line (C-181, 100). An unqualified "always" in a promise about what is kept is the most expensive word on this surface to get wrong.

### C-183 · `lib/config.ps1:76` · what no means
```
no  = those caches are cleared completely; project scans are skipped.
```
**Was:** the same.

**Change:** none. Both consequences, including the one the reader did not ask about.

### C-184 · `lib/config.ps1:77` · the evidence
```
detected developer tooling: node, yarn, docker, cargo, go
```
**Was:** the same.

**Change:** none. It shows what it found without answering for the reader.

### C-185 · `lib/config.ps1:84` · the answer saved
```
developer mode ON - saved to config.json (change with --forget-developer)
```
**Was:** the same.

**Change:** none. What was recorded, where, and how to undo it - in one line, at the moment it happens rather than in documentation.

### C-186 · `lib/config.ps1:89` · not asked
```
developer question not asked (non-interactive run) - defaulting to developer mode ON, the conservative choice; pass --not-developer to override
```
**Was:** the same.

**Change:** none. It says the question was skipped, which way the default fell, why that direction, and the flag that reverses it. 142 characters, all of it doing work.

### C-187 · `lib/config.ps1:96` · the purge confirmation
```
FULL PURGE: --purge-all empties every cache target completely, including files you used yesterday.
```
**Was:** the same.

**Change:** none. "including files you used yesterday" is the clause that makes the flag's cost concrete, and it is followed by a typed-word prompt (C-009) that `--yes` cannot answer. Nothing to add.

### C-188 · `lib/config.ps1:96` · purge confirmed
```
purge-all confirmed for this run
```
**Was:** the same.

**Change:** none - "for this run" bounds it.

### C-189 · `lib/config.ps1:98` · purge declined
```
purge-all declined - this run prunes by the idle window instead
```
**Was:** the same.

**Change:** none. Declining says what will happen instead, so the run is never left ambiguous.

### C-190 · `lib/config.ps1:32,46` · config read and write failures
```
config file unreadable, using defaults: C:\Users\you\.windowsweep\config.json (<exception>)
could not save config: <exception>
```
**Was:** the same.

**Change:** none. Out of scope: both end in an exception verbatim. The first names the path and states the fallback, which is the part that matters.

---

## §J `lib/scan.ps1` - the target table the pre-scan and `--scan` print

Beyond the eight files the brief named. `Show-ScanTable` is printed by the walkthrough's pre-scan (C-044) and by `--scan` (C-083), so its prose is part of row 10's run summary. `Show-TargetList` (`--list-targets`, lines 83-99) is **not** covered - it is not one of row 10's four surfaces, and two findings in it are reported instead.

### C-191 · `lib/scan.ps1:54` · the table header
```
  ITEM                                           SIZE  PATH
```
**Was:** the same.

**Change:** none.

### C-192 · `lib/scan.ps1:57,59` · rows with nothing to measure
```
  Docker system prune                           (cmd)  docker system prune -f
  Bun cache                                    absent  C:\Users\you\.bun\install\cache
```
**Was:** the same.

**Change:** none. "absent" rather than "0 B" - a target that is not there and a target that is empty are different facts, and this voice does not merge them.

### C-193 · `lib/scan.ps1:72` · the per-section total
```
  section total on disk                        1.4 GB
```
**Was:** the same.

**Change:** none. "on disk" is the qualifier C-195 then explains.

### C-194 · `lib/scan.ps1:76` · the scan total
```
Currently on disk across all listed targets: 22.08 GB
```
**Was:** the same.

**Change:** none. "Currently" and "listed" are both doing work: it is a measurement of now, over the declared targets, not a forecast.

### C-195 · `lib/scan.ps1:77` · the caveat under the total
```
These are sizes on disk, not what a run would delete: the idle gate keeps recently used files, and running apps are skipped.
```
**Was:** the same.

**Change:** none, and this is the line the whole scan surface is built to reach. It refuses to let its own biggest number be read as a promise, then gives the two reasons - the idle gate and the running-apps skip. 123 characters, every one of them earning its place. It is the Bible's "what is kept" motif and its no-promised-number rule in the same sentence.

---

## Reported, not fixed - facts rather than voice

Row 10 does not cover these, so they are reported and left alone.

1. **`lib/scan.ps1:94` - `--list-targets` prints `PROTECTED - never deleted, no flag bypasses this` over a list with two undeclared carve-outs.** `WS_PROTECT.ExceptionPrefixes` holds `%LOCALAPPDATA%\Android\Sdk\.temp` and `.downloadIntermediates`, and a path under either clears the guard with no flag at all - `Get-ProtectionReason` returns `$null` for it at `lib/safety.ps1:112`, before the subtree check runs. The 2026-09-06 docs pass added both exceptions to `safety-model.md` for exactly this reason: a carve-out inside a protected subtree is what a sceptical reader wants named. The program's own proof surface still omits them. The heading's claim about *flags* is true; what it implies about the list under it is not. A derived bullet is available - `WS_PROTECT.ExceptionPrefixes` is in scope in `Show-TargetList` - which is why this is reported rather than drafted: the fix is a new line of output, not a rewording.

2. **`lib/scan.ps1:83` - the same `--list-targets` box carries `(read-only)`**, which C-020, C-044 and C-083 correct elsewhere. `--list-targets` is not in `$quietModes` at `windowsweep.ps1:290`, so `Initialize-Log` runs and the mode writes a log. Same word. Same defect, outside row 10.

3. **`modules/reports.ps1:104` - a fourth `Would free (estimate)`** in the exported Markdown, and `Would free (dry-run estimate)` at `reports.ps1:75` in the HTML. C-088 changes the console row to `Would reclaim (est.)`; these two would then disagree with it. Blocked behind NEEDS DECISION 2, not forgotten.

4. **`modules/system_admin.ps1:155` vs `:162` still disagree about Fast Startup** - `reduced` is described as keeping the hibernation file at "roughly 40% of RAM" on one line and the whole file as ~40% on the other. Recorded in the decision log on 2026-09-06 as reported-not-edited. Still true. Outside row 10 as well, since it is section-module intro prose. It would cost nothing to fix inside the 1.2.0 cascade this surface already needs.

5. **Section 22 carries `Dev = $true` with no behavioural branch.** `runner.ps1:106` gates on `$Id -in @(4, 17, 20)`, so 22's flag changes nothing, while `--list --json` reports `dev: true` to the desktop app. Also already recorded on 2026-09-06; repeated because this surface's brief asked for fact defects and this one is still live.

6. **Source comments carry the adjective C-001 removes.** `windowsweep.ps1:1`, `modules/walkthrough.ps1:1` and `modules/runner.ps1:1` all read "safe" or "read-only" in the senses corrected above. Not user-visible, so not slots - but a session applying this draft is already in those files.

---

## NEEDS DECISION

**NEEDS DECISION 1: the product prints two different straplines, from six places. Which line belongs in the banner and the `--help` header?**

Content-map row 2 settled the tagline on 2026-09-07 and recorded that it lives in five places, not the three the brief named: `package.json`, `WS_TAGLINE`, the README header, `docusaurus.config.ts` and the bundled engine copy. There is a **sixth**. It does not print `WS_TAGLINE` at all. `Write-Banner` (`lib/ui.ps1:126`) and `Show-Usage` (`windowsweep.ps1:42`) each carry their own hardcoded strapline - `safe, developer-aware Windows cleanup` - and the banner is the most-printed line in the product, at the top of the walkthrough, the menu, every batch run and every scan.

Reusing the approved tagline here is not available as a silent default: it is 99 characters, and `Write-Banner` sizes its box to the text, so it would draw a 107-glyph box whose top and bottom bars both wrap in an 80-column console. That is three broken lines, not a cosmetic overflow.

- **(a) Recommended - one short banner strapline, stated as a guarantee.** `names every path before it touches one`. 67 glyphs with the borders. One more than ships. It drops the adjective the Bible forbids, states the premise instead of claiming a property, and is the text C-001 and C-018 are written against. The cost: the product has two straplines by design - a 99-character tagline for listings and a short one for the console - and that has to be a decision rather than an accident.
- **(b) One line everywhere: shorten the approved tagline to fit the banner.** Ends the divergence completely, at the price of reopening a GATE-4-approved line and shortening the one that has to survive being read in a list of npm search results with no context.
- **(c) Keep the shipped strapline.** No change, and the Bible's clearest prohibition stays in the product's most-printed sentence.

C-001 and C-018 are drafted for (a) and are the only two slots this blocks.

**NEEDS DECISION 2: do the exported Markdown and HTML report bodies get a content-map row?**

`Convert-ReportToMarkdown` and `Convert-ReportToHtml` (`modules/reports.ps1:44-134`) emit roughly 30 user-visible strings - headings, table columns, `Would free (estimate)`, `Would free (dry-run estimate)`, footers. Nobody owns them. No content-map row names them, and they are the artefact a reader is most likely to keep and reread weeks later. The map's out-of-scope table does not mention them either way, so this is a gap rather than a recorded exclusion.

It matters now because C-088 changes the console's row to `Would reclaim (est.)` while `reports.ps1:104` and `:75` keep the old verb, so approving this surface without an answer ships an inconsistency the next reader will find.

- **(a) Recommended - add a row and write it in the same 1.2.0 cascade.** Small surface, one file, and it inherits every decision this draft already made. It is the honest option because the exports are read by people, not machines.
- **(b) Declare them out of scope in the map, with a reason,** and change only the two `Would free` labels here so the verb is consistent. Cheapest, and it leaves 28 strings unowned.
- **(c) Leave as is and revert C-088.** Consistent, and it keeps a verb the glossary bans.

C-117 and C-085 are held on this. No other slot depends on it.

---

## Self-check

**Palette - 60 precision-before-an-irreversible-act · 25 refusal-as-reassurance · 15 workshop dryness, against row 10's P-dominant brief.**

P carries the surface, as the row demands, and it carries it through counts and paths rather than through register: C-056's four facts above a list of destructive options, C-057's `[deep]` / `[interactive]` / `[admin]` flags before a choice, C-075's three measured numbers, C-079's whole strategy on one line before anything runs, C-157's exact Sunday command, C-166's exact line before it is written to the reader's own profile, C-172's measured size before the deletion question, C-194's "Currently ... across all listed targets".

R lands where the row's structure puts it - at every refusal, and it is the band the changed slots protect most. Kept intact: C-012 "a person has to pick these", C-068's interactive-only refusal, C-128's "this tool never does", C-136 ending on "never batch", C-141's no-network-calls note, C-145's "No paths, no logs", C-154's npx refusal, C-195's whole sentence. Strengthened by change: C-001 and C-018 replace an adjective with a commitment; C-023 separates which sections ask from which use the Recycle Bin; C-130 replaces "the safe reading" with the consequence, "(keeps more)"; C-182 replaces "always kept" with "kept, unless --purge-all".

W is thin, and that is the row's instruction rather than an omission - the band is 15 across the whole Bible and row 10 names P dominant with no W allowance, on a surface where every line sits next to a deletion. The nearest it comes is dry understatement inside a fact: C-076's "no measurable change", C-192's "absent", C-061's three-word "no section 26". No joke anywhere, and none near C-070, C-187 or any prompt that precedes an irreversible act. Banned tones are absent throughout. No urgency, no triumphalism, no shame, no superlative, no exclamation mark in any slot.

**Safety surfaces.** `references/safety.md` governs here and was read against every prompt that precedes an irreversible act: C-070's deep refusal, C-174's data deletion, C-187's typed purge confirmation, C-111's report deletion. Humor is off on all of them, and none carries an exclamation mark or an apology. Two findings came from that pass. C-123's "this run should help" is an outcome promise, which safety.md bans outright and the Bible bans a second time, so it goes. And C-073 - the one line that can report a loss - was checked against the consequence shape and then left alone: `Invoke-SectionById` continues past its `catch` to print C-075, so a reader whose section threw is still told how much that section reclaimed before it failed, and the summary underneath supplies the log path. What happened, what it means, where to look - carried by three adjacent lines rather than one.

This surface has no crisis line. None is invented. No slot gives advice, promises an outcome or grades the reader.

**Rhythm.** Shortest shipping strings: `skipped` (7), `removed` (7), `Add it?` (7), `deleted` (7), `no section 26` (13). Longest: C-186 at 142 characters, C-108 at 131, C-195 at 123, C-068 at 118. The jaggedness is structural here rather than decorative - a one-word acknowledgement after an action, a long sentence where a refusal has to carry its own reason and its own way out. That is the fingerprint's rule ("the longest sentence explains; the shortest states a fact or a refusal") landing on a surface built from single lines. Within the multi-line blocks the pattern holds by measurement: C-049 runs 93, 96, 69, 47, 55, 85; C-023 runs 93, 97, 94, 97, 69, ending on its shortest.

**Length against the budgets, measured rather than eyeballed.**

- **`Write-Box` subtitles, 75-character budget:** every one checked. All pass - C-044 at 55, C-084 at 60, C-137 at 59, C-150 at 60, C-155 at 71, C-164 at 51, C-179 at 51. The one shipped breach, C-144 at 92, is fixed to 68. C-036 is the known 99-character exception, ruled cosmetic and accepted on 2026-09-07, and belongs to row 2.
- **`Write-Kv` keys, 24-character pad:** C-088's `Would reclaim (estimate):` would have been 25 and pushed the whole row's value one column right of the rest of the summary; shipped as `Would reclaim (est.):` at 21. Longest key shipping today is 23, so the column does not move.
- **`Write-Banner`, box = text + 2:** 67 glyphs against 66 shipped. One glyph wider.
- **Free-flowing help, `Write-Plain` and `Write-Note`:** not under a rule, and the shipped baseline in those blocks already runs to 93-104 characters. The test applied was *no worse than what ships*, and every changed line meets it except two, both named rather than hidden: **C-075** at 87 against 83, four characters bought by using the glossary's verb across the whole product; and **C-182** at 83 against 70, thirteen characters bought by removing an "always" that is not true. Both sit inside their own block's widest shipped line. Everything else got shorter. C-019 41 from 59, C-020 70 from 78, C-023's widest 97 from 99, C-049's widest 96 from 104, C-123 88 from 100, C-130 85 from 91, C-144 68 from 92.
- **Row 10's "one line each"** holds for every slot except five deliberate blocks that are one line in the source and print as several: C-023, C-049, C-132, C-139, C-181/182.

**ASCII, verified by character code rather than by eye - and the first version of this paragraph overclaimed, which running the check is what caught.** The claim that matters is about the fences, since fenced text is what becomes engine source: all **197 fenced blocks, 303 lines**, measured with `max(ord(c))`, top out at codepoint **126**. Zero bytes above 127. A scan of the whole file then reports exactly three non-ASCII characters, and not one of them sits inside a fence: `U+00B7` the middle dot (408 times) and `U+00A7` the section sign (22) in slot headers, plus `U+1F534` the red-circle marker (3) - the same house format the three approved desktop drafts already carry, in commentary nobody copies into PowerShell. What self-test check [4] would refuse is absent everywhere, fences and prose alike: typographic quotes, en and em dashes, the ellipsis character and the non-breaking space all count zero across the file. The hyphen, the straight quote and `...` do that work instead. **No new glyph is introduced**: every changed string uses only characters already in `lib/ui.ps1`'s ASCII glyph set or plain letters, so nothing needs a new `[char]` code.

The correction is worth keeping visible. The earlier wording said the whole-file scan came back clean, which it does not, and nothing but running the command would have found that - the same shape as the finding in C-020, where a claim was defensible enough that three surfaces repeated it.

🔴 **The lint hook is blind to every word that ships here, and a green verdict on this file is evidence about nothing that matters.** `posttooluse-story-lint.sh:61` runs `re.sub(r"```.*?```", " ", body, flags=re.S)` before it counts anything. This surface is slot-shaped by construction - one fence per string, per the brief - so **every shipping string is inside a fence and none of them is checked.** What the hook measures is the commentary in these Was/Change paragraphs: prose no user will ever read. So it can report a FAIL about a sentence that is not shipping, and it can PASS while the shipping copy is off-voice. Proved, not inferred. Measured on this file rather than cited from trizlink: a copy of this draft carrying `seamless` and `robust` inside the C-001 fence passed the hook at exit 0; the same two words moved into a Change paragraph failed it at exit 2, naming both. The control fires, so the hook is live; the treatment does not, so every string that ships here is unchecked. Naming the two probe words in this paragraph tripped row 3 on its own, which is a third confirmation from the same experiment. So they carry allow markers. The reason is narrow: they appear nowhere in this draft except as the planted probe; no slot proposes either word, and neither reaches a reader.
<!-- story-lint: allow "seamless" -->
<!-- story-lint: allow "robust" --> The same file has a sibling failure at lines 172-176 where a `UnicodeEncodeError` exit of 1 reads as PASS, so silence from it is unproven by default. **On this surface the fact-checker and a human reader are the only real gate** - which is why every changed slot above cites the constant, the line or the catalogue flag its claim rests on, and why the six fact findings are reported with file and line rather than described.

**Slot count.** **195 total · 21 changed · 174 kept** (89% kept). Most of it was already right. By file: `ui.ps1` 17/1 changed · `windowsweep.ps1` 18/5 · `walkthrough.ps1` 20/3 · `menu.ps1` 7/0 · `runner.ps1` 34/6 · `reports.ps1` 21/1 · `health.ps1` 14/2 · `release_helpers.ps1` 47/1 · `config.ps1` 12/2 · `scan.ps1` 5/0. Of the 21 changes, **9 correct a fact** (C-019, C-020, C-021, C-023, C-037, C-049, C-083, C-181, C-182), **7 correct diction against the Bible or the glossary** (C-001, C-018, C-074, C-075, C-088, C-123, C-130), **2 add a missing next command** (C-077, C-097), **1 is a measured length fix** (C-144), and **2 are the same fix in two places** (C-001/C-018, held on NEEDS DECISION 1). The ratio is close to the three desktop surfaces' 331 of 375, which is the expected shape: the engine's strings were written with this voice in mind before the Bible existed to name it.

**Unsure spots.** Both are NEEDS DECISION items above rather than notes: the sixth strapline location (blocking C-001 and C-018) and the unowned report-export surface (holding C-085 and C-117). Nothing else here is a guess. Every number, path, flag and section id above was read from the tree in this session.
