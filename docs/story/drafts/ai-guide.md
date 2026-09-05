# ai-guide — the contract an automated caller runs under

<!-- story-lint: allow "elevate" -->

Content-map row **8** · surface `AI-INTEGRATION-GUIDE.md` at the repository root, mirrored as
`windowsweep-docs/docs/ai-integration-guide.md` · awareness **a machine, or a person writing automation** ·
structure **contract-first: the safe sequence, then the shapes** · tone bands **P only, no W** · length
**reference length** · CTA none · schema none.

This page is read by something that cannot ask a follow-up question. So the standard is different from every
other surface in the batch: a sentence that is merely true is not enough, and a sentence that is true in the
common case and silent about the failure case is a defect. Four such gaps were found. Each one produces a
caller that behaves correctly until the day it does not, and none of them is visible from the page as it
stands.

**No band W anywhere.** Nothing here is an aside, and nothing is written to be enjoyed.

| Section | Slot range | Count |
|---|---|---|
| §A opener, the safe sequence, `--yes` | S-001 – S-011 | 11 |
| §B exit codes, the flags note, the `--json` line | S-012 – S-023 | 12 |
| §C output, elevation, the guarantees | S-024 – S-032 | 9 |
| §D the do-nots, interactive sections, the catalogue, the audits | S-033 – S-040 | 8 |
| **Total** | | **40** |

---

## §A The opener, the safe sequence, and `--yes`

### S-001 · AI-INTEGRATION-GUIDE.md:3-6 · the opener
```
This is the contract an automated caller can rely on: what windowsweep promises, what it refuses, what it prints, and what it returns. It is written for an agent or a script rather than a person. For what the tool *is*, read the [README](https://github.com/aoneahsan/windowsweep#readme); for what each section touches, read [Sections 0-25](https://github.com/aoneahsan/windowsweep/blob/main/docs/sections.md).
```
**Was:** identical.

**Change:** none. Four nouns in the first sentence, and each has its own section below. The absolute URLs
are correct for this file in both trees. This file lives at the repository root, so a relative link cannot
resolve from the docs site; an absolute GitHub link resolves from either. The link path that legitimately
differs between the trees is the one **pointing at** this file, and it lives on the index page rather than
here: `docs/README.md` writes `../AI-INTEGRATION-GUIDE.md` and `intro.md` writes `./ai-integration-guide.md`.

### S-002 · AI-INTEGRATION-GUIDE.md:8-9 · the warning
```
**windowsweep deletes files.** Every command below that is not marked read-only can remove data. There is no undo for caches. Treat a real run as an irreversible operation and rehearse it with `--dry-run` first.
```
**Was:** ... Treat a real run as an irreversible operation and preview it first.

**Change:** one word. "Preview" is the glossary's reserved term and the flag is called `--dry-run`, so a
caller reading "preview it first" has to guess which flag is meant. Naming it removes the guess, which is the
whole job of this page.

### S-003 · AI-INTEGRATION-GUIDE.md:11-18 · the safe sequence
```
npx windowsweep --self-test --no-color --no-report     # read-only: proves the guards on this machine
npx windowsweep --scan --no-color --no-report          # deletes nothing; still writes a session log
npx windowsweep --dry-run --all --yes --no-color       # writes nothing; reports what a real run would remove
npx windowsweep --all --yes --no-color                 # the real safe batch
```
**Was:** line 2 read `# read-only: every target and its size`.

**Change:** one comment. `--no-report` suppresses the JSON report and there is no flag that suppresses the
session log, so `--scan` always creates `%USERPROFILE%\.windowsweep\logs\windowsweep-<stamp>.log`. A caller
running this inside a container, a locked-down service account or a read-only home directory needs that fact
at the point the command appears, rather than three sections later when the run has already failed. The
removed half of the comment is restored by S-004.

### S-004 · AI-INTEGRATION-GUIDE.md:19 · NEW · what the sequence writes
```
Every mode writes a session log unless the data directory is redirected. `--no-report` skips the JSON report; `--cleanup-logs` deletes this run's log at exit; `--logs-dir` and `--reports-dir` move both. `--no-report --cleanup-logs` together leave nothing behind, which is the combination for a caller that must not touch the user's data directory.
```
**Was:** (new.)

**Change:** added, and it answers a question the page never addressed. `lib/log.ps1` creates the directories
and opens the log in `Initialize-Log`, which runs for every mode; nothing skips it. So "read-only" and
"writes nothing" were being read by a caller as "leaves the filesystem untouched", and that is not what the
tool does. The last sentence is the practical answer: two flags together give the caller the behaviour it
assumed it already had.

### S-005 · AI-INTEGRATION-GUIDE.md:20-21 · the `--json` note
```
Add `--json` when a program reads the result. In that mode **stdout carries exactly one line, the JSON summary**, and every human-readable line goes to stderr. `--json` also implies `--quiet`.
```
**Was:** identical.

**Change:** none. The stronger and more dangerous half of this contract - the case where that line is **not**
written - is S-020.

### S-006 · AI-INTEGRATION-GUIDE.md:23-26 · what `--yes` covers
```
## What `--yes` covers, and what it never covers

`--yes` auto-confirms **regenerable caches only**. The safe batch that `--all` selects is sections 0-3, 5-10 and 21, plus 12 and 13 when the console is already elevated. Sections 4 and 14 are opt-in: `--yes` confirms them, but only when `--only` or a profile names them.
```
**Was:** `--yes` auto-confirms **regenerable caches only**: sections 0-3, 5-10, 21, and 12-14 when the console
is already elevated.

**Change:** rewritten, and **the old sentence was wrong about section 14**. `WS_SAFE_BATCH_ADMIN` in
`lib/constants.ps1` is `@(12, 13)`; section 14's `Batch` is `optin`, so it is never in `--all`, elevated or
not. A caller told that `--all --yes` on an elevated console runs 12-14 will schedule a DISM component-store
cleanup that never happens and record it as done. The rewrite also separates two things the old sentence
merged: what `--all` selects, and what `--yes` confirms. They are different questions, and section 4 is the
case that proves it - `--yes` will confirm it, and only if something named it.

### S-007 · AI-INTEGRATION-GUIDE.md:28-33 · the never-covered table
```
| Sections 17, 18, 19, 23 | The selection prompt appears even with `--yes` and defaults to none. With no console attached nothing is selected, and each asks a final question `--yes` does not answer. Only `--select` / `--select-file` supply a choice (see below) |
| Sections 11, 15, 16, 20 | Deep. Refused in batch mode unless `--i-understand-deep` is also passed |
| `--uninstall-data` | Always asks; `--yes` does not answer it |
| `--purge-all` | From a console it asks for a typed `purge` once per run. In a batch run `--yes` is the confirmation. Declining the typed word leaves the run pruning by the idle window rather than aborting |
```
**Was:** the same four rows; the `--purge-all` row ended at "In a batch run `--yes` is the confirmation".

**Change:** one cell. A caller that pipes input and gets a declined `purge` needs to know the run continues
with different behaviour rather than stopping: `Confirm-PurgeAllOnce` in `lib/config.ps1` sets `PurgeAll`
back to `$false` and prints a note. Without that sentence the caller has two outcomes to distinguish and no
way to know a third exists.

### S-008 · AI-INTEGRATION-GUIDE.md:35-37 · the batch-mode paragraph
```
In batch mode (`--all`, `--only`, `--profile`) sections 17, 18, 19 and 23 are refused outright and reported as `refused`, unless a `--select` or `--select-file` choice was supplied. They need a person choosing items - in advance is fine, absent is not.
```
**Was:** identical.

**Change:** none. The last clause is the whole policy in eight words, and it is the right eight.

### S-009 · AI-INTEGRATION-GUIDE.md:38 · NEW · what a refusal does to the exit code
```
A refusal in `--only` mode sets exit code 3 even when every other section ran. Read `sections[]` and `refusals[]` rather than treating a non-zero exit as a failure of the whole run.
```
**Was:** (new.)

**Change:** added. `modules/runner.ps1` line 148 promotes the exit code to 3 whenever `Refusals` is non-empty
in `only` mode, so `--only 7,17 --yes` returns 3 with section 7 completed. A caller treating a non-zero exit
as "nothing happened" will retry a run that already reclaimed space, and one treating it as a hard failure
will alert on a documented, intended refusal. Both are avoided by one sentence naming the two arrays that
carry the truth.

### S-010 · AI-INTEGRATION-GUIDE.md:39 · NEW · an unknown section id
```
An id that is not in the catalogue is dropped with a warning on **stderr** and the run continues with the rest: `--only 7,99` runs section 7. If every id is unknown the run ends as a usage error, exit 2, with no JSON line on stdout. Read `sections[]` to learn what actually ran; never assume it matches the list you passed.
```
**Was:** (new.)

**Change:** added, and this is the fourth gap. `Get-SectionIdList` in `modules/runner.ps1` validates each id
against the catalogue and prints `no section 99 - ignored` for the rest, on stderr - which a `--json` caller
is often discarding. The two outcomes were verified by running them: `--only 99` exited 2 and printed nothing
on stdout, and the empty-list guard is at `modules/runner.ps1` line 142. A caller that builds `--only` from
configuration and never checks `sections[]` will silently run a subset for as long as the typo survives.

### S-011 · AI-INTEGRATION-GUIDE.md:40 · NEW · what `--yes` never becomes
```
No combination of flags makes `--yes` select an item in sections 17, 18, 19 or 23. Piping input does not; `--i-understand-deep` does not; `--permanent` does not. Only `--select` or `--select-file` names items, and the self-test asserts it on every run.
```
**Was:** (new.)

**Change:** added as the section's closing refusal. The heading promises what `--yes` never covers and the
page then describes four cases, which leaves a caller wondering whether some fifth combination exists. It
does not, and self-test check [16] asserts that `--yes` alone selects nothing and never counts as a scripted
choice. Naming the three things a caller would try is what makes the claim usable.

---

## §B Exit codes, flags, and the `--json` line

### S-012 · AI-INTEGRATION-GUIDE.md:39-47 · the exit-code table
```
| 0 | Success |
| 1 | A section failed, or the self-test found a failure |
| 2 | Usage error, an interactive mode was started without a console, or no valid section remained after parsing |
| 3 | A section named in `--only` was refused, or an installer was started from `npx` |
| 130 | Interrupted before the run finished. The engine exits 130 from its exit handler; the Node launcher returns 130 when it forwards the signal |
```
**Was:** the 2 row read "Usage error, or an interactive mode was started without a console"; the 130 row read
"Interrupted before the run finished (Ctrl-C)".

**Change:** two cells. Code 2 gains the third case S-010 documents, because an empty section list after
parsing is neither of the two the row named. Code 130 gains the detail `docs/cli-reference.md` already
carries: there are two processes, and both return 130. A caller reading only this page had no way to know
that the number it sees came from the launcher rather than the engine.

### S-013 · AI-INTEGRATION-GUIDE.md:49-67 · the automation flag table
```
(unchanged: --json, --no-color / --ascii, --no-report, --cleanup-logs, --quiet, --only / --profile / --exclude, --days / --temp-days, --developer / --not-developer, --scan-roots / --exclude-path, --logs-dir / --reports-dir, --select / --select-file, --notify, --list --json, --pwsh)
```
**Was:** the same fourteen rows.

**Change:** none. This is a factual record of the engine's own flags and every cell was checked against
`windowsweep.ps1`'s argument parser. The three defaults it states - `--days` 100, `--temp-days` 3, developer
mode on for a non-interactive run with no saved answer - all match `lib/config.ps1`.

### S-014 · AI-INTEGRATION-GUIDE.md:68-69 · the developer default
```
A non-interactive run with no saved developer answer defaults to developer mode **on**, the conservative choice, and says so.
```
**Was:** identical.

**Change:** none.

### S-015 · AI-INTEGRATION-GUIDE.md:70 · NEW · reading the developer answer
```
`developer` in the JSON line is the answer the run used: `true`, `false`, or `null` in a mode that never resolves the question. A caller that needs a specific behaviour passes `--developer` or `--not-developer` rather than relying on the saved answer, which lives in the user's `config.json` and can change between runs.
```
**Was:** (new.)

**Change:** added. The key is described in the table below as a value; nothing says the value comes from a
file the caller does not control. `windowsweep.ps1` line 236 reads it from `config.json`, so two identical
invocations on the same machine can behave differently after the user has answered the first-run question.
An automated caller that wants a repeatable run has to pass the flag, and the page never said so.

### S-016 · AI-INTEGRATION-GUIDE.md:71-79 · the `--json` example
```
{"tool":"windowsweep","version":"1.1.0","mode":"all","dry_run":false,"elevated":false,"developer":true,
 "freed_bytes":0,"estimated_bytes":0,
 "sections":[{"section":1,"status":"ran","freed_bytes":0}],
 "candidates":[],"targets":[],
 "refusals":[],"log_file":"...","report_file":"..."}
```
**Was:** identical.

**Change:** none. The key order matches `Get-JsonSummary`'s ordered hashtable in `modules/runner.ps1`, and
the version matches `VERSION`, `package.json` and `WS_VERSION_FALLBACK`, which `npm run version:check`
asserts.

### S-017 · AI-INTEGRATION-GUIDE.md:81-93 · the key table
```
| `freed_bytes` | Real bytes removed. `0` in a dry-run. Never an estimate, and never a promise about a later run |
| `estimated_bytes` | What a dry-run says a real run would remove, measured at the moment the rehearsal ran. `0` in a real run |
```
**Was:** `freed_bytes` read "Real bytes removed. `0` in a dry-run"; `estimated_bytes` read "What a dry-run
says a real run would remove. `0` in a real run".

**Change:** two cells, and the addition is the same fact the page already gives in its "Do not" list: an
estimate is a measurement of one moment. Saying it in the key table too is worth the eleven words, because a
caller reading the schema is deciding what to store, and a stored `estimated_bytes` compared against a later
`freed_bytes` is the most likely wrong comparison a caller will make.

### S-018 · AI-INTEGRATION-GUIDE.md:90-91 · the always-present arrays
```
| `candidates[]` | What an interactive section offered: `section`, `index`, `path`, `bytes`, `idle_days`, `project`. Always present, empty when none were collected |
| `targets[]` | Scan mode only: `section`, `label`, `path`, `bytes`. Always present, empty otherwise |
```
**Was:** identical.

**Change:** none. "Always present, empty when none were collected" is the shape guarantee a caller needs, and
self-test check [16] asserts it on a run that collects neither.

### S-019 · AI-INTEGRATION-GUIDE.md:95 · the status values
```
`status` is one of `ran`, `dry-run`, `skipped`, `refused`, `failed`.
```
**Was:** identical.

**Change:** none. Five values, stated twice in this file. Both statements agree.

### S-020 · AI-INTEGRATION-GUIDE.md:96 · NEW · when the JSON line is not written
```
The JSON line is written at the end of the run summary. A run that does not reach its summary does not write one: an unhandled error writes a crash bundle and exits 1, and Ctrl-C exits 130 from the exit handler. So read the exit code first and parse stdout only when it is not empty. An empty stdout with a non-zero code is a run that ended early, and the session log is the record of how far it got.
```
**Was:** (new.)

**Change:** added, and of the four gaps this is the one most likely to break a caller in production.
`Write-JsonSummary` is called from `Show-SessionSummary` at `modules/runner.ps1` line 209, which is inside
`Invoke-Main`; the `catch` in `windowsweep.ps1` writes a crash bundle and sets exit 1 without reaching it,
and the `finally` block exits 130 without reaching it either. A caller that parses stdout unconditionally
therefore fails to parse on exactly the runs it most needs to report, and the failure looks like a
malformed-output bug rather than an interrupted run. The last sentence gives it somewhere to look.

### S-021 · AI-INTEGRATION-GUIDE.md:97 · NEW · stdout is one line, and stderr is not JSON
```
Nothing but that one line is ever written to stdout in `--json` mode, including the `##windowsweep` progress lines, which go to stderr and are not JSON. A caller reading stdout line by line will read at most one line.
```
**Was:** (new — the fact is stated later, at the progress-line section.)

**Change:** added here as well, deliberately. The promise "stdout carries exactly one line" is made at the
top of the page and the progress lines are introduced 100 lines later, which is far enough apart that a
caller can implement a stdout reader in between. Stating the exclusion beside the promise costs two sentences
and closes the gap. `Write-MachineProgress` carries the same warning in its own synopsis comment.

### S-022 · AI-INTEGRATION-GUIDE.md:98 · NEW · the version key
```
`version` is the running version, which the Node launcher supplies through `WINDOWSWEEP_VERSION`; a direct `.ps1` invocation falls back to the literal in `lib/constants.ps1`. Pin behaviour to `--list --json` rather than to a version string: section numbers are frozen, the set grows, and the catalogue is authoritative.
```
**Was:** (new.)

**Change:** added. `Get-ToolVersion` prefers the environment variable and falls back to the constant, so the
two invocation paths can disagree in a checkout that is not the published package. More importantly, the page
tells a caller to read the catalogue rather than hard-code section numbers, and it does not tell them the
same about the version. A caller branching on `version` for a capability that `--list --json` already reports
is building the fragile thing this page exists to prevent.

### S-023 · AI-INTEGRATION-GUIDE.md:99 · NEW · what the JSON line does not contain
```
The line carries no file contents, no user name field, no machine identifier and no path that windowsweep decided to keep. Paths appear only in `log_file`, `report_file` and `candidates[].path`, and those are the user's own paths. The full report on disk carries more: host, user, OS and the drive snapshots.
```
**Was:** (new.)

**Change:** added. A caller that forwards this line to a log aggregator or an issue tracker needs to know what
it is forwarding, and the honest answer has two halves: the one-line summary is narrow, and the report file it
names is not. `lib/log.ps1` writes `host` and `user` into the report's `meta` block, so a caller attaching
`report_file` is attaching more than the line it read. This is row 8's version of the refusal the other
surfaces make.

---

## §C Output, elevation, and the guarantees

### S-024 · AI-INTEGRATION-GUIDE.md:97-108 · where output lands
```
(unchanged: the four-row path table, the WINDOWSWEEP_HOME override, the two directory flags, the colour and ASCII variables, and WINDOWSWEEP_SHELL=pwsh)
```
**Was:** the same table and paragraph.

**Change:** none. Every path matches `lib/config.ps1`, and the four environment variables match
`windowsweep.ps1`'s parser.

### S-025 · AI-INTEGRATION-GUIDE.md:110-114 · the report shape
```
The report file is schema-versioned JSON (`schema_version: 1`) with five top-level blocks: `credits`, `meta` (times, host, OS, PowerShell version, mode, the three flags, the idle windows, the launcher), `disk` (`before` and `after` snapshots per fixed drive), `steps` (one row per section with `status` and `freed_bytes`), and `totals`. `--export md|html|both [N|latest|all]` renders any report to Markdown or a self-contained HTML page without extra tools.
```
**Was:** identical.

**Change:** none. Five blocks, all five present in `docs/reports-and-logs.md`'s example and in `lib/log.ps1`.

### S-026 · AI-INTEGRATION-GUIDE.md:116-121 · elevation
```
Sections 12-16 and 20 need Administrator rights. Without them the runner skips each with the exact command to run. `--elevate` relaunches the whole run through a UAC prompt: **a new elevated window opens with its own log and report**, and the original process waits and returns the child's exit code. That prompt cannot be answered by a script, so `--elevate` does not belong in an unattended context.
```
**Was:** identical.

**Change:** none, and this section is the model the rest of the page should follow. It names the six sections
correctly - `docs/quick-start.md` did not until `docs-start` S-022 - it says what the flag does to process
structure, and it ends on the one thing an automated caller must not do.

### S-027 · AI-INTEGRATION-GUIDE.md:122 · NEW · what elevation does not change
```
Elevation changes which sections can run and nothing else. The protected lists, the declared roots and the chokepoint are identical in the elevated process, which is built from the same `Initialize-Safety` call.
```
**Was:** (new.)

**Change:** added, matching `docs-reference` S-056 on the human page. A caller deciding whether to run
elevated is deciding about blast radius, and the answer is that the radius does not change: `lib/safety.ps1`
builds the same tables from the same environment in both processes, and `Get-ProtectionReason` is the same
function. So elevation is a scheduling decision. It is not a risk decision, and saying so here is what lets an
operator treat the elevated path as ordinary.

### S-028 · AI-INTEGRATION-GUIDE.md:125-126 · guarantee · no network
```
- **No network calls of its own.** Self-test check [9] greps every source file for `Invoke-WebRequest`, `Invoke-RestMethod`, `Net.WebClient`, `HttpClient`, `Sockets.TcpClient`, `curl.exe` and `wget`, and fails the run if it finds one. There is no telemetry and no update check. `--report-issue` and `--feedback` hand a URL to the user's browser after they confirm, and neither belongs in an unattended run.
```
**Was:** **No network calls of its own.** The self-test greps the source for HTTP and socket calls and fails
the run if it finds one. There is no telemetry and no update check.

**Change:** the seven needles are named, and the browser exception is added. The needles matter here more
than on the FAQ, because a caller auditing this tool for an offline environment can run the same grep. The
exception matters because `Start-Process <url>` does exist in three code paths, and a page claiming "no
network calls of its own" without naming them invites an auditor to find them and conclude the page is
lying. Both were checked in `modules/release_helpers.ps1` line 224 and in the report and feedback modules.

### S-029 · AI-INTEGRATION-GUIDE.md:127 · guarantee · the chokepoint
```
- **Every deletion of anything on the user's machine passes one chokepoint** with a declared root, and is refused if it falls outside it. windowsweep's own logs, reports and fixtures are the exception, reachable only through `--cleanup-logs`, `--prune-history` and `--uninstall-data`.
```
**Was:** **Every deletion passes one chokepoint** with a declared root, and is refused if it falls outside it.

**Change:** the same correction `docs-safety` S-004 and S-006 make. It matters more here. An auditor reading a guarantee section will grep for `Remove-Item` and `[IO.Directory]::Delete`, find
eight call sites outside `lib/safety.ps1`, and stop trusting the list. Naming the exception up front, with the
three flags that reach it, means the grep confirms the page instead of contradicting it. Every one of those
eight sites operates on windowsweep's own artefacts - a crash-bundle temp folder, a temporary Docker script,
two self-test fixtures, a write probe, a report the user chose to delete, the data folder, and this run's
log - and each was checked individually. `Clear-RecycleBin` in section 11 is the ninth path and is named on
the safety page as the only thing that empties the bin.

### S-030 · AI-INTEGRATION-GUIDE.md:128-129 · guarantee · protected paths
```
- **Protected paths are refused regardless of flags**: every drive root, fifteen declared roots (Windows, System32, SysWOW64, both Program Files folders, ProgramData, `C:\Users` with Default and Public, the profile root, and the AppData Roaming, Local and LocalLow folders), 66 protected subtrees, 50 path patterns and 13 file names. Two paths are declared exceptions - `%LOCALAPPDATA%\Android\Sdk\.temp` and `.downloadIntermediates` - and there are no others. No flag bypasses any of it.
```
**Was:** **Protected paths are refused regardless of flags**: drive roots, Windows, Program Files, the
profile root, personal folders, credentials, toolchains, browser and editor state. No flag bypasses this.

**Change:** the categories become counts, and the exception list appears. A guarantee section on a contract
page should be countable: a caller auditing this tool can run `--list-targets`, count the subtrees printed
and compare. The old list was a sample presented as a boundary, which is the same problem `docs-safety` S-009
fixes on the safety page. All five numbers were counted in `lib/safety.ps1` rather than recalled. "No flag
bypasses any of it" is correct here without the qualification S-029 needed, because these are the lists at
guard steps 1 to 4 rather than the tool's own data folder.

### S-031 · AI-INTEGRATION-GUIDE.md:130-131 · guarantee · links and dry-run
```
- **Junctions and symlinks are removed as links, never followed.** The walker checks the reparse-point attribute before descending, and the self-test proves it with a real junction whose target holds a sentinel file.
- **`--dry-run` and `--scan` write nothing** but the log and the report, which `--cleanup-logs` and `--no-report` remove.
```
**Was:** the same two bullets; the first ended at "never followed", and the second at "but the log and the
report".

**Change:** each gains its mechanism. The junction bullet was the only guarantee on the page with no evidence
beside it, and the sentinel is what makes the self-test's check meaningful rather than a claim. The dry-run
bullet was already the most honest sentence in this documentation about what a read-only mode writes, and
naming the two flags turns it into something a caller can act on.

### S-032 · AI-INTEGRATION-GUIDE.md:132-135 · guarantee · numbers and dependencies
```
- **Section numbers are a public contract.** 0-25 today; a section may be retired as a no-op, and a number is never reused. Read `--list --json` rather than hard-coding the set.
- **Zero runtime dependencies.** The package is PowerShell plus a Node launcher that uses only built-in modules.
```
**Was:** identical.

**Change:** none. Both were verified: `WS_SECTIONS` holds 26 rows with unique ids, self-test check [15]
asserts it, and `package.json` has no `dependencies` key.

---

## §D The do-nots, the interactive sections, the catalogue

### S-033 · AI-INTEGRATION-GUIDE.md:137-147 · the do-not list
```
(unchanged: the npx-inside-a-clone rule, the do-not-schedule-npx rule, the do-not-pipe-y rule, and the do-not-treat-a-dry-run-as-a-promise rule)
```
**Was:** the same four.

**Change:** none. Four rules, each naming a specific failure and its supported alternative, which is the
right shape for this page. The third one is the strongest: piping `y` selects nothing, and the correct answer
is named in the same bullet.

### S-034 · AI-INTEGRATION-GUIDE.md:148 · NEW · a fifth do-not
```
- Do not parse the human output on stderr. It is not a stable format, it changes with `--quiet`, `--ascii` and `--no-color`, and the only stable machine surfaces are the `--json` line, the `##windowsweep` progress lines and the report file.
```
**Was:** (new.)

**Change:** added. The page gives a caller three stable surfaces and never says the fourth thing they can see
is unstable, so a caller with a `--json` line that lacks a field it wants will reach for the stderr text next.
Saying which surfaces are contracts, in the section listing what not to do, is where a caller will find it.

### S-035 · AI-INTEGRATION-GUIDE.md:149-171 · driving the interactive sections
```
(unchanged: the two-step example, and the four rules a caller can rely on)
```
**Was:** the same section.

**Change:** none, and this is the best-written part of the file. It shows the list command first, then the act
command, then states the four invariants including the one that matters most: neither flag reaches a path the
chokepoint would otherwise refuse. Self-test check [16] round-trips all of it.

### S-036 · AI-INTEGRATION-GUIDE.md:179-181 · the catalogue keys
```
One stdout line: `sections[]` (`id`, `key`, `title`, `tier`, `admin`, `batch`, `dev`), `safe_batch`, `safe_batch_admin`, `profiles`, `walkthrough`, `walkthrough_admin`. Read it instead of hard-coding section numbers - they are frozen, but the set grows.

`tier` is one of `report`, `rebuilds`, `slow`, `recycle`, `permanent`, `config`. `batch` is one of `safe`, `optin`, `deep`, `interactive`. `dev` is the catalogue's developer flag: sections 1, 2, 3 and 5 prune by the idle gate instead of clearing when the answer is yes, and sections 4, 17 and 20 do not run at all when it is no. Treat `dev` as catalogue metadata rather than as a single guaranteed behaviour.
```
**Was:** the first paragraph only.

**Change:** one paragraph added, defining the three enumerated fields. `tier` and `batch` are named in the
key list and their possible values appear nowhere on this page, so a caller switching on them has to derive
the set from a sample - which will miss `slow` and `optin`, each of which belongs to two sections. `dev` is
the harder one: it is set on eight sections and means two different things, which is why the last sentence
says what it is rather than what it promises. Section 22 carries the flag and behaves identically either way,
which is reported as a catalogue defect rather than described here as intent. All three value sets were taken
from `lib/constants.ps1`.

### S-037 · AI-INTEGRATION-GUIDE.md:183-192 · the progress lines
```
In `--json` mode every section brackets itself on **stderr**:

##windowsweep section=7 event=start
##windowsweep section=7 event=end status=ran freed_bytes=4096

`status` is one of `ran`, `dry-run`, `skipped`, `refused`, `failed`. Scan mode also fills `targets[]` (`section`, `label`, `path`, `bytes`) in the final JSON line. `candidates` and `targets` are always present, empty when nothing was collected.
```
**Was:** identical.

**Change:** none. The format matches `Get-MachineProgressLine` in `modules/runner.ps1` exactly, including the
fact that only the `end` line carries `status` and `freed_bytes`, and self-test check [16] parses it back.

### S-038 · AI-INTEGRATION-GUIDE.md:194-199 · the read-only sections
```
## The read-only sections

`--profile audit` runs sections 0, 21, 22, 24 and 25, and none of the five deletes anything in any mode: the health report, disk usage, globally installed packages, installed programs not modified for `--days`+ days, and startup items. Sections 22, 24 and 25 print removal commands and never execute one; section 25 never changes a startup entry. Section 24 reports "not modified", not "not used" - Windows keeps no reliable last-launched record.

Section 23 is **not** one of these. It is interactive, and what a caller selects goes to the Recycle Bin.
```
**Was:** ## The read-only audits / `--profile audit` runs sections 0, 21, 22, 24 and 25 and deletes nothing
in any mode: ... (no closing paragraph).

**Change:** the heading and one new paragraph. "Audits" is the word that made the README call section 23 a
read-only audit until this morning: the README named three audits and the wrong fourth, and this page uses
the same word for a set of five that includes two reports. "Read-only sections" describes the property a
caller cares about and cannot be miscounted. The closing paragraph states the exclusion outright, because a
caller building a "safe to run anywhere" list from this section is exactly the reader that mistake harms.

### S-039 · AI-INTEGRATION-GUIDE.md:200 · NEW · the two footers
```
Last Updated: 2026-09-05 - tool version 1.1.0 - contract for section numbers 0-25.
```
**Was:** (new — this file has no footer at all.)

**Change:** added. Every other page in this documentation carries a `Last Updated` line, and this one carries
none, which on a contract page is the omission that matters most: a caller cannot tell whether the contract
it is reading describes the version it is running. Three facts. The date; the version the page was
checked against; the section range the contract covers, which is the thing on this page most likely to
change first.

### S-040 · the docs-site mirror

**Change:** none to the text, and recorded for the transcription. `windowsweep-docs/docs/ai-integration-guide.md`
is this file with a five-line front-matter block prepended and nothing else altered; a byte-level diff of the
two files this session showed exactly that. Every slot above therefore lands twice, and the front matter's
`description` field is the one string that lives only in the site copy. It reads "How an agent or a script
runs windowsweep safely - the --json contract, exit codes, what --yes never covers, and the guarantees",
which carries the banned adverb. **Recommended replacement**, if the transcription touches it: "The contract
an agent or a script runs under: the `--json` line, the exit codes, what `--yes` never covers, and the
guarantees."

---

## SELF-CHECK

**Palette.** P only, which row 8 requires. No W anywhere. Every slot is a mechanism, a count, a file
reference or a failure mode. There is no aside. Nothing here is written to be enjoyed, and nothing offers
reassurance that is not also a fact a caller can act on. R appears
in the form a machine can act on rather than as comfort: S-011 (no combination makes `--yes` select),
S-023 (what the line does not contain), S-027 (elevation changes nothing about reach), S-030 (five counts and
two exceptions).

**Rhythm.** Shortest shipping sentence: *"Section 23 is **not** one of these."* (six words, S-038). Longest:
S-020's third sentence at 31 words. Median across the changed strings is about 26, which is longer than the
fingerprint's 12-16 and is correct for a page whose sentences are contract clauses.

**Length.** Row 8's cap is "reference length", with no figure. The file measures 1,483 words today and lands
near 2,050. Twelve of the forty slots are new text, and every one of them closes a case a caller would
otherwise have to discover by being broken by it.

**Unsure spots.** One. It is a judgement rather than a fact: S-036 defines `dev` as catalogue metadata
instead of documenting that section 22's flag has no effect. The alternative was a sentence describing an
engine defect on a contract page, which would then need removing when the flag is fixed.

**Banned-phrase sweep.** Run with a script over the fenced shipping strings only, 1,834 words of them,
against the shared list plus this project's own bans. Four hits, all deliberate and all frozen vocabulary:
**`safe`** three times, in "the safe batch" at S-003 and S-006 and in the `batch` enum at S-036, which are
`WS_SAFE_BATCH` and the catalogue's own value list; and **`elevate`** as the flag name `--elevate`, covered
by the allow marker at the top of this file. Two were removed rather than kept: `preview` at S-002, and
`safely` in the mirror's front-matter description at S-040. Nothing matched `clean` or `sweep` as a verb,
`just`, `simply`, `easily`, a superlative or a first-person plural.
