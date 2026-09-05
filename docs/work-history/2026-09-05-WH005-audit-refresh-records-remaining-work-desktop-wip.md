# WH005 - full audit, every record refreshed, the desktop WIP committed, and the desktop and story phases put in scope

| Field | Value |
|---|---|
| Date | 2026-09-05 |
| Task | Audit the whole project, refresh every project-info file, and write the remaining-work specification that finishes it |
| Duration | One session (planned on Fable 5.1, executed on Opus 5 from the saved plan) |
| Status | Complete. Two commits in the product repo, one in the documentation repo, one in the notebook |
| Project | windowsweep (`D:\work\windows-cleanup-root\windows-cleanup`) |
| Developer | Ahsan Mahmood |
| Plan | `C:\Users\PC\.claude\plans\please-audit-the-whole-streamed-nest.md` |

## Executive summary

The owner asked for an audit that proves the agent understands every part of the project, refreshes every
record to the current state of the code, and produces the specification that finishes the project to 100%
feature-complete and production-ready. He also asked for the split that made it: **Fable 5.1 planned and saved
the whole implementation plan, then stopped; Opus 5 executed it without re-planning.**

The audit found the code in good order and **the records badly out of date**. Every planning file, the project
context, both instruction files, the portfolio file, the master links entry and several documentation-site
labels still described the project as it stood on 2026-09-03: version 1.0.0 or 1.0.1, 22 sections, 108 to 124
self-test checks, "docs site 0%", "1.1 features 0%", a toolchain download gate that had been lifted, and a
click-dummy gate that had been approved. The tree meanwhile was at 1.1.0 with 26 sections and 151 checks, the
documentation site was deployed, and the desktop design was approved.

Four owner decisions were taken during the session and are recorded verbatim in `docs/PROJECT-CONTEXT.md`:
**the desktop app counts toward 100%**; the twenty-one uncommitted click-dummy files were **committed as their
own design commit** before anything else; the `windows-cleanup-root` **folder layout is durable**; and **every
product-voice surface is retrofitted through the storytelling system**. The last two changed the shape of the
remaining work: a rename row closed as superseded, and a new phase P7 was created.

## Starting point

`main` at `45953b7` with **twenty-one uncommitted files** under `desktop/design/` - the eight A4 click-dummy
screens, their `page-*.js`, the contents index and the navigation wiring, handed over by the previous session
with no record of what state they were in. The three root planning files were dated 2026-09-03. The tracker's
`resumeInstructions` pointed at a block that had already shipped, and its first known risk named a defect fixed
in 1.0.1.

Sessions 3 to 6 had left no work-history record at all. In brief, so the gap is closed: session 3 built the
first desktop click dummy and the owner **rejected** it (*"very basic and not attractive at all"*); session 4
built direction 02 "Reclaim" after copying the external design-craft skill set that the rejection post-mortem
named as the omitted cause; sessions 5 and 6 refined it over two rounds, then the owner **approved GATE 1**
(*"approved, looks great, get all remaining work fully done now"*), **pre-authorised gates 2 and 3**
(*"Straight through to the app"*) and **lifted the toolchain download gate** (*"Lift it fully"*).

## Work completed

### The WIP commit, first

The owner's answer to what should happen to the uncommitted files was *"Commit as its own design commit"*. A
static check first resolved **456 local links and script sources across the twenty HTML files plus every entry
in the navigation registry** - all present. They were committed as `2721b75` and pushed; the push reported
`Bypassed rule violations for refs/heads/main`, as a direct owner push always does, and CI run 33953046121 went
green. The commit body states plainly that Block Q is not verified and that the inventory ledger does not
exist, so nobody later reads the commit as a finished phase.

### The gates, before writing anything about them

| Gate | Result |
|---|---|
| `node bin\windowsweep.js --self-test --no-color --no-report` | `all 151 checks passed`, exit 0 |
| `npm run version:check` | `version parity OK: 1.1.0` |
| `npm pack --dry-run` | 44 files, 109.0 kB packed, 365.7 kB unpacked - the allowlist only |
| PSScriptAnalyzer 1.25.0 | `analyzer findings: 0` |
| `git diff 3c4d54e..HEAD -- lib modules windowsweep.ps1 bin package.json` | empty - the published engine equals `main` |

🔴 **PSScriptAnalyzer needs `-ExecutionPolicy Bypass` to load at all.** A bare `powershell.exe -NoProfile`
invocation fails an AuthorizationManager check while importing the module, and `@(Invoke-ScriptAnalyzer
...).Count` then prints a **vacuous `0`** that reads exactly like a clean run. The first attempt in this
session printed that zero. Print the module version beside the count, always.

### The records

- **`what-this-project-consists-of.md`** rewritten: identity and the two-repository layout, the architecture
  with per-file line counts, all 26 sections with tier and batch policy, every mode and flag, the safety
  contract as implemented, the machine-readable contract, the gates with what each proves, the documentation
  site including its SEO and AEO inventory and its gaps, the desktop app with a full inventory of the click
  dummy, the owner records, and the parts checklist the owner asked for.
- **`remaining-work.md`** rewritten as the working specification: the definition of done including today's
  decisions, a weighted status snapshot showing its own formula, the never-do list extended with the desktop
  and story rules, a closed-items table replacing the deleted specifications, and every open item - P1
  verification (now including `--notify` on both hosts and the audit-section review), the P3 residue (the
  domain write-back, a PNG social card, the local install, and a feed recorded as deliberately not built), the
  P4 and P5 residue, **thirteen P6 items** covering the desktop app block by block, and **four P7 items** for
  the storytelling retrofit.
- **`remaining-work-summary.md`** rewritten with two honest numbers: **about 53% of the whole project** and
  **about 87% of the CLI-only scope** agreed on 2026-09-03, with the arithmetic shown so neither is a claim
  nobody can check.
- **`docs/PROJECT-CONTEXT.md`**: a session-7 decision block, the current status, the folder layout, the
  self-test location, the portfolio record, and an "open material unknowns" section rewritten to say what it
  actually is - owner *input* outstanding, not owner *decisions*.
- **`CLAUDE.md` and `AGENTS.md`**: the current-state block, the stack-override rows for the documentation site
  and the desktop app, a new storytelling row, and a **twelfth IRON rule** - the click dummy owns the desktop
  app's words as well as its layout.
- **The tracker**: five rewritten risks, four new decisions, the P3, P4, P6 and P7 sub-tasks, and resume
  instructions that name the real next item.
- **The portfolio file** renamed to `WINDOWSWEEP_portfolio-info_2026-09-05.md` in both locations and refreshed
  to 1.1.0, with three new history rows; the master links entry updated; `windowsweep.bib` needed no change
  because it carries no version field.
- **The documentation site**: the footer and `llms.txt` moved to 26 sections, the `--yes` fact corrected to
  name section 23, the version labels fixed, and `docs/story/**` excluded from the build **before** phase P7
  can put a Story Bible there.

## Files created

`docs/work-history/2026-09-05-WH005-...md` (this record) · `D:\work\windows-cleanup-root\README.md` (a pointer
at the un-versioned parent root) · the project memory note under
`~/.claude/projects/D--work-windows-cleanup-root/memory/`.

## Files modified

`what-this-project-consists-of.md` · `remaining-work.md` · `remaining-work-summary.md` · `CLAUDE.md` ·
`AGENTS.md` · `README.md` (one roadmap row) · `WINDOWSWEEP_portfolio-info_2026-09-05.md` (renamed) ·
`docs/PROJECT-CONTEXT.md` · `docs/MANUAL-TASKS.md` · `docs/quick-start.md` · `docs/reports-and-logs.md` ·
`docs/features/windowsweep-completion/{00-overview.md,00-tracker.json}` · `desktop/design/README.md` · the
documentation repo's `docusaurus.config.ts`, `deploy-pages.yml`, `static/llms.txt`, `docs/intro.md`,
`docs/quick-start.md`, `docs/reports-and-logs.md`, `CLAUDE.md`, `AGENTS.md` · the notebook's portfolio copy and
master links JSON.

## Reference documents

`remaining-work.md` (the specification) · `docs/features/windowsweep-completion/00-tracker.json` (the status) ·
`C:\Users\PC\.claude\plans\please-audit-the-whole-streamed-nest.md` (this session's plan and handoff) ·
`C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` section 18 (the desktop blocks in long form).

## Current status

P0 and P2 are complete. P1 is entirely owner-run. P3 and P4 are complete on the agent side and wait on owner
rows. P5 has three rows waiting on one owner probe. **P6 (the desktop app) and P7 (the storytelling retrofit)
are the open agent work**: the click dummy has all eleven screens but no inventory ledger, no wiring batch and
no verification sweep; no application code exists; no Story Bible exists.

## Next steps

1. **RW-073** - finish Block Q: the inventory ledger, the house-promotion panel proved in both layers, and
   every page opened and looked at.
2. **RW-074** - the wiring batch: six flows through the store, every link verified by clicking.
3. **RW-075** - the verification sweep across all nineteen files, each gate red on two different plants.
4. **RW-090 and RW-091** - the Story Bible and the content map, stopping at the owner's gates 1 and 2.
5. **RW-093, then RW-077 to RW-083** - the desktop words into the dummy, then the app, its CI, its gates, the
   parity check and the first release.

## Technical notes (traps met this session)

- 🔴 **The Bash tool refuses a command longer than about 30 KB** with `ENAMETOOLONG: name too long, uv_spawn`.
  A large heredoc therefore **silently never runs** - the shell reports the error but the file is untouched, and
  a following step that reads the file sees the old content. Write anything over roughly 20 KB with the file
  tool instead. This cost one silent no-op before it was spotted by re-reading the file's header.
- 🔴 **PSScriptAnalyzer's vacuous zero**, above. The class of defect is the one the fleet build-quality rule
  names: a gate that cannot run reports success.
- 🔴 **A global find-and-replace corrupts history.** Replacing the self-test count `124` with `151` across the
  portfolio file also rewrote two *historical* statements - a release row recording that 1.0.1 grew the suite
  from 108 to 124, and the new row that said "124 → 151". Both were restored. Check every site a global
  replacement touched, not just the ones you meant.
- **Line endings**: `docs/PROJECT-CONTEXT.md` carried mixed CRLF and LF. `.gitattributes` maps `*.md` to LF, so
  it was normalised in place; the diff is larger than the edit, which is expected and correct.
- **JavaScript string escapes eat Windows paths**: `"D:\work\..."` in a `node -e` one-liner silently becomes
  `D:work...`, so a replacement targeting a path never matches. Backslash-bearing edits go through a script
  file written with the file tool, never an inline one-liner.
- The shell's working directory resets between tool calls; every command uses an absolute path or its own `cd`.

## Session metrics

Two commits in the product repository (`2721b75` the WIP design commit, then the audit commit), one in the
documentation repository, one in the notebook. Three planning files rewritten (about 30 KB, 22 KB and 5.5 KB),
nine records edited, one file renamed in two locations, thirteen desktop items and four storytelling items
specified. Four owner decisions recorded verbatim. Every gate re-run and quoted.

## Continuation prompt

> Read `D:\work\windows-cleanup-root\windows-cleanup\CLAUDE.md`, then `remaining-work.md` and
> `docs/features/windowsweep-completion/00-tracker.json` in the same folder. The 2026-09-05 audit refreshed
> every record and put the desktop app (P6) and the storytelling retrofit (P7) in scope; the click dummy holds
> all eleven screens, committed as WIP in `2721b75`. Resume at the first pending sub-task the tracker names -
> expected `P6.design-dummy` = RW-073 (finish Block Q: the `CLICK-DUMMY-INVENTORY.md` ledger, the
> house-promotion panel proved with each self-exclusion layer removed in turn, and every page opened and looked
> at), then RW-074 (the wiring batch) and RW-075 (the verification sweep). Run each item's gates, flip its
> status in the same commit, append a `runHistory` row, one commit per repository, push to `o main` and quote
> the `Bypassed rule violations` line. Owner rows 15, 16 and 22, the P1 runs, row 20 and the DNS rows 11-12
> never block agent work. Do not re-plan; `remaining-work.md` is the specification.

## Document history

| Date | Change |
|---|---|
| 2026-09-05 | Created at the end of the audit session |
