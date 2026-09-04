# WH004 - phase P5 closed, 1.1.0 published: four new sections, scripted selection, the JSON contract

| Field | Value |
|---|---|
| Date | 2026-09-04 |
| Task | Session 2 of the completion plan: phase P5, closing with the 1.1.0 release |
| Duration | One session (Opus 5 execution of a Fable 5.1 plan, section 12 Blocks F-M) |
| Status | P5 complete; RW-064 and RW-065 partially shipped and RW-066 deferred, all three awaiting the owner's candidate-path probe |
| Project | windowsweep (`D:\work\windows-cleanup`) |
| Developer | Ahsan Mahmood |
| Plan | `C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` section 12 |

## Executive summary

windowsweep 1.1.0 is published, tagged and released. It adds four sections - a global-packages audit, an
orphaned-application-data cleaner, an idle-programs report and a startup-items audit - and the two things a
GUI needs from a CLI: a way to supply an interactive section's selection in advance (`--select`,
`--select-file`) and a machine-readable contract (`candidates[]`, `targets[]`, progress lines,
`--list --json`). The self-test grew from 124 to 151 checks, and each of the seventeen plants turned its own
check red before being restored.

Three real defects surfaced, none of them anticipated by the plan, and each was found by something other than
reading the code:

1. **A returned `HashSet` was unrolled into an `Object[]`**, whose `.Contains` is case-sensitive, so section
   23's exclusion list would have missed a folder named `slack` while holding `Slack`. A new check caught it
   before the section ever shipped.
2. **Section 24 measured the wrong timestamp.** It used the newest of write, access and creation, as the
   cleanup sections do - but last-access is live on this machine, so every install folder read as touched
   today and the section reported nothing while looking perfectly healthy. Measured: Git 0d by that rule,
   120d by last-write; Gpg4win 0d vs 203d.
3. **A `$p` loop variable destroyed the `$P` roots table** in the same function, because PowerShell variable
   names are case-insensitive. Section 25 crashed on it. An AST check now refuses that pattern anywhere in
   `modules/`.

The plan's decision to ship **only verified target paths** removed real scope, and that is recorded rather
than absorbed: five of RW-064's six rows, two of RW-065's three, and the whole of RW-066 are not in 1.1.0.

## Starting point

`main` at `a7e49fa`, npm at 1.0.1, self-test 124 checks, sections 0-21, P5 entirely pending. The plan's
section 8 outlined P5 before anything had been measured.

## Work completed

### Planning - the measurement that changed the plan

Before writing code, every candidate path in RW-064, RW-065 and RW-066 was probed on this machine. Telegram,
WhatsApp (Store), Office, PyTorch, conda, `C:\NVIDIA`, `C:\AMD`, `C:\ESD` and the NVIDIA Downloader are all
absent; Steam is installed but has no `shadercache` because no game is; the generic WebView2 glob matches
nothing. And `C:\Intel`, which the specification listed as a driver-extraction leftover, **exists and is not
one** - it holds `Thunderbolt`, `Logs` and a hidden `GfxCPLBatchFiles`.

That produced two owner decisions (recorded verbatim in `docs/PROJECT-CONTEXT.md`): ship only what was
verified, with the rest as a documented candidate table plus one probe row; and continue straight into P6-A
after 1.1.0 rather than pausing for a review.

### Block F - catalogue-driven plumbing

`Get-AllTargets` (`lib/scan.ps1:18`) and the menu prompt (`modules/menu.ps1:40`) iterated a literal `0..21`,
which would have made every new section invisible to `--scan`, `--list-targets` and safety check [6]. Both now
derive from `WS_SECTIONS`.

### Block G-I - sections 22 to 25

- **`modules/globals_audit.ps1`** (section 22). Roots from `npm root -g`, nvm-windows, pnpm, Yarn, bun and
  deno; per-package version and size read from the package's own top-level entries, never a recursive walk of
  a global `node_modules`. A package is a candidate only when it is idle past the window, unreferenced by any
  recently-touched `package.json` under the scan roots, and not a package manager. It declares **no deletable
  target** - check 15e proves it, and planting one also tripped the existing protected-path check, confirming
  those roots really are protected subtrees.
- **`modules/orphaned_appdata.ps1`** (section 23). The evidence index is built from three uninstall hives,
  `Program Files`, `%LOCALAPPDATA%\Programs`, `WindowsApps`, Store packages and running processes; matching is
  deliberately generous because the expensive mistake is calling something orphaned when it is not. It **fails
  closed** on an unreadable registry, and its exclusion set is derived at run time from the declared target
  list so a vendor folder another section cleans can never also be offered.
- **`modules/installed_programs.ps1`** (section 24) and **`modules/startup_audit.ps1`** (section 25). Both
  report-only. Section 25's enabled/disabled rule is derived from Explorer's disable FILETIME rather than the
  widely quoted byte-0 table, because the measurement on this machine contradicted the table.

### Block J - the verified rows, and the deferrals

Shipped: the Hugging Face hub cache in section 1 (prune, developer-gated - the spec asked for keep-newest per
model, but HF snapshots link into blobs so removing one orphans blobs), `wsreset.exe` in section 9 as an
**offered next step** rather than an execution (it has no silent mode and always opens the Store, and a
cleanup run must not pop a window), and seven artefact-directory additions plus a marker-gated `.cache`.

Deferred, with the reason written into `docs/sections.md`: everything unverifiable, and `C:\Intel` outright.

### Block K - the GUI prerequisites

`--select` / `--select-file` (`lib/ui.ps1`), `--notify` (`modules/notify.ps1`), `candidates[]` / `targets[]`
/ progress lines / `--list --json` (`modules/runner.ps1`, `lib/scan.ps1`). The interactive batch refusal is
lifted only when a selection was supplied, and the scripted selection also answers that section's final
confirmation - proved end to end against a fixture: `--yes` alone refused with exit 3 and deleted nothing,
`--select-file` naming one of two artefacts removed exactly that one.

### Blocks L-M - the release and the records

Version cascade, CHANGELOG `[1.1.0]`, README section table 0-25, four documentation pages, the AI guide's
placeholder replaced with the real contract, the docs site re-mirrored, and the publish gate in full.

## Files created

`modules/globals_audit.ps1` · `modules/orphaned_appdata.ps1` · `modules/installed_programs.ps1` ·
`modules/startup_audit.ps1` · `modules/notify.ps1` · this record.

## Files modified

`lib/{constants,scan,ui}.ps1` · `modules/{runner,projects,personal,menu,health,pkg_managers,windows_user,release_helpers,self_test_extra}.ps1` ·
`windowsweep.ps1` · `package.json` · `VERSION` · `CHANGELOG.md` · `README.md` · `AI-INTEGRATION-GUIDE.md` ·
`docs/{sections,cli-reference,profiles,safety-model,PACKAGES,README,MANUAL-TASKS,PROJECT-CONTEXT}.md` ·
`docs/features/windowsweep-completion/00-tracker.json` · `CLAUDE.md` + `AGENTS.md` · the docs repo's six
mirrored pages and `docusaurus.config.ts`.

## Verification

| Gate | Result |
|---|---|
| Self-test (Windows PowerShell 5.1) | `all 151 checks passed`, exit 0 |
| Every new check proved red | 17 plants, each restored; messages quoted in the plan's execution log |
| `--dry-run --all --yes` | exit 0, 11 sections |
| `--dry-run --profile audit` | exit 0, 5 sections |
| `--scan --json` | one stdout line, 657 targets, every documented key present |
| `--list --json` | one stdout line, 26 sections |
| `--only 17 --yes` with no selection | exit 3, refused, fixture untouched |
| `--only 17 --select-file` | removed exactly the named artefact, left the other |
| `--notify` on 5.1 | toast shown, exit 0, nothing on stdout |
| `npm run version:check` | `version parity OK: 1.1.0` |
| PSScriptAnalyzer (local, 5.1) | 0 findings |
| Largest file | 471 lines (cap 500) |
| CI (`windows-latest`, both hosts) | run 33856301415 success on `3c4d54e` |
| `npm view windowsweep version` | `1.1.0` |
| `npx -y windowsweep@1.1.0 --version` from `%TEMP%` | `windowsweep v1.1.0` |
| Content-regression diff vs the 1.0.1 tarball | no file lost; six added |
| Tag / Release | `v1.1.0 -> 3c4d54e`, Release published |
| Docs Pages deploy | run 33857426599 success |
| `windowsweep-docs.aoneahsan.com` | `000` - expected until the owner's DNS row |

## Technical notes (traps met)

- **PowerShell variable names are case-insensitive**, so `$p = $null` inside a loop silently destroys a `$P`
  taken from `$Script:P` in the same function. Section 25 died on `Join-Path` receiving a null. There is now
  an AST check for the pattern.
- **A returned collection is unrolled.** `return $set` on a `HashSet[string]` hands back an `Object[]`, whose
  `.Contains` is ordinal and case-sensitive. `return , $set` keeps it a set.
- **Last-access time is live on this machine**, so the tool's usual newest-of-three idle rule answers "was
  this read recently", not "was this modified". Correct for deciding what to delete; wrong for a report about
  modification. Two different questions, two different instruments.
- **The `tar` on PATH is Git Bash's**, which reads `C:\...` as a remote host - the same trap as session 1. The
  publish diff now calls `%SystemRoot%\System32\tar.exe` explicitly **and** refuses to compare fewer than 30
  extracted files, so the failure announced itself instead of printing a reassuring "nothing disappeared".
- **A Bash heredoc collapses `\N`** in a Python string: writing the tracker note containing `C:\NVIDIA` died
  on a unicode-escape error. Backslash-bearing content goes through Write/Edit or `chr(92)`.
- **A truncating pipe kills the child process**: `node ... | Select-Object -First 40` reported exit `-1` for a
  run that actually exited 0. Read the exit code from an unpiped run.
- **PSScriptAnalyzer flags `$Event`** as an automatic variable; the parameter is `$Stage` and only the emitted
  wire key stays `event=`.

## Current status

P0, P2 and P5 are complete. P3 needs only the owner's DNS record, P4 only his folder rename, P1 is entirely
his. P6 has not started. RW-064, RW-065 and RW-066 wait on `docs/MANUAL-TASKS.md` row 20.

## Next steps

1. **Session 3 is P6-A** (plan section 12, Block N): the written design argument and the static click dummy
   for every desktop screen, then the `desktop/` code and its CI workflows, compiled by CI only.
2. `P6.firebase-vault` stays blocked: provisioning needs `npx firebase-tools`, a large download gated on
   `PENDING-TASKS.md` TASK-001.
3. Owner rows now actionable: 1, 3, 8, 9, 11, 12, 13, 14 to 21 in `docs/MANUAL-TASKS.md`. Row 20 is the one
   that unblocks agent work - it settles the candidate-target table in a single paste.

## Session metrics

Two commits in the CLI repo, one in the documentation repo. Five new modules, four new sections, five new
flags or output contracts. Self-test 124 -> 151 checks with 17 plants. One npm release, one tag, one GitHub
Release. Three real defects found by the new checks before they could ship.

## Continuation prompt

> Read `C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` section 12 (especially Block N and the
> section 13 execution log), then `D:\work\windows-cleanup\CLAUDE.md` and
> `docs/features/windowsweep-completion/00-tracker.json`. Session 2 closed phase P5 and published
> windowsweep 1.1.0 with sections 22-25, `--select`/`--select-file`, `--notify` and the `--json` additions;
> the self-test is at 151 checks. Continue with **Session 3 = phase P6-A**, starting at `P6.design-dummy`:
> the written design argument and the static click dummy for every desktop screen in three treatments, light
> and dark, for the owner to review, then the `desktop/` application code and its CI workflows. Do not
> re-plan the finished phases, and remember that anything needing a toolchain or dependency download stays
> blocked on `PENDING-TASKS.md` TASK-001.

## Document history

| Date | Change |
|---|---|
| 2026-09-04 | Created at the end of Session 2 |
