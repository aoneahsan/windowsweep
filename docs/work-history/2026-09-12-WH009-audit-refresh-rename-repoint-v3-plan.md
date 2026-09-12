# WH009 - the 2026-09-12 audit: every record made true, the rename repointed, the v3 plan

| | |
|---|---|
| Date | 2026-09-12 |
| Task id | WH009 (session 13) |
| Duration | one session on Fable 5.1 |
| Status | complete - the audit files, the records and the plan; execution handed to an Opus 5 session (D16) |
| Project | windowsweep (`D:\work\windowsweep-root\` - the product repo, the docs site, the marketing site) |
| Developer | Ahsan Mahmood (owner); the session on Fable 5.1 |

## Executive summary

The owner re-ran his standard audit prompt. The last records were written on 2026-09-08 and had gone stale in
four ways at once: CLI 1.2.0 had shipped, the marketing site had gone live, a dozen story surfaces had been
applied, and the workspace root folder itself had been renamed under every record. The session re-verified
every part against the trees, npm, GitHub, DNS and both live sites, asked the owner eight questions (D13-D20),
rewrote the three planning files, made every instruction record true, refreshed the portfolio and the master
links entry, and saved the v3 completion plan for an Opus session running up to four custom agents. Whole
project: about 79% (85% excluding the marketing site), up from 68%.

## Starting point

- Product `fc29532`, docs `96d33d7`, web `d50f02b`, all clean and pushed; `remaining-work-summary.md` still said
  "the marketing site does not exist yet" and 68%; every path record named `windows-cleanup-root`.
- The SessionStart hook reported the brain repo seven commits behind; `sync-all.sh` was run first (its
  verifier reported one global FAIL, `pretooluse-hosting-budget-gate.sh misjudged 1 case`, and one WARN - not
  this project's).

## Work completed

**Verified today (commands in `../../what-this-project-consists-of.md` §16):** self-test 156 exit 0; version
parity 1.2.0; a 44-file tarball; PSScriptAnalyzer 1.25.0 clean; the engine diff against `v1.2.0` EMPTY;
desktop typecheck / lint / prepaint / build green with zero source maps; the site typecheck / lint / build
green, zero maps, zero arbitrary Tailwind values; the docs build green with zero owner-only files;
`desktop-v1.1.0` installed on this machine (HKCU); the docs HTTPS failure being GitHub's own `*.github.io`
certificate with no CAA record on the apex; the site serving the home title and canonical on every route and
200 on unknown paths; npm `latest` 1.2.0; `latest.json` 1.1.0.

**Found:** the root rename (D13); the README's Version / Install-size / Status rows and its Changelog paragraph
left at 1.1.0 by the 1.2.0 cascade (fixed in the repo; the published tarball's copy stays stale until 1.3.0);
`lib/safety.ps1` (541) and `modules/self_test_extra.ps1` (537) over the 500-line ceiling, plus the desktop's
`shell.css` (1,693) and `tokens.css` (534); D-9 / D-13 / D-22 and TASK-005 done in code with their rows still
open; MANUAL-TASKS row 24 never needed; the web repo's GATE 1 row still Pending; row 27 filed as owner work
although the run-to-verify grant covers it.

**The owner's eight answers (recorded verbatim by option label in `docs/PROJECT-CONTEXT.md` and the
tracker):** D13 the rename is final · D14 build account deletion · D15 Google sign-in during this run · D16
Fable plans, Opus executes · D17 Android out · D18 the agent re-adds the docs domain via the Pages API · D19
the two 1.2.0 report-wording changes stand · D20 up to four agents at once.

**Written / rewritten:**

- `../../what-this-project-consists-of.md`, `../../remaining-work.md` (RW-113 account deletion, RW-114 site
  SEO / prerender / 404 / `llms.txt` / JSON-LD / OG / IndexNow, RW-115 site telemetry, RW-116 verification
  as a person, RW-117 site parity, RW-118 site CI, RW-119 the RW-105 capture, RW-120 records after the rename,
  RW-121 the 1.3.0 cascade debt, RW-122 the two stylesheets), `../../remaining-work-summary.md` (79% / 85%
  with the arithmetic), `../../completion-plan-v3-2026-09-12.md` (W0-W7, dispatch packets with `EXCLUSIVE
  SCOPE`, the paste-ready prompt).
- The root `README.md` and `CLAUDE.md` = `AGENTS.md`; the product `CLAUDE.md` = `AGENTS.md` (the "Current
  state" section rewritten to session 13; the P8 row from "not started" to live; D20); `docs/PROJECT-CONTEXT.md`
  (verified against `fc29532`; the session-13 decisions; the 1.2.0 and desktop-v1.1.0 release records; the
  2026-09-07 run through the app; open unknowns); `docs/MANUAL-TASKS.md` (row 15 reworded, row 24 closed, row
  27 moved to the tracker, row 29 added); `PENDING-TASKS.md` (TASK-005 -> `DONE-005` with evidence; 7.2 KB);
  the tracker (`lastUpdated`, D13-D20, eight new sub-tasks, seven notes made precise, a `runHistory` row,
  `resumeInstructions` for Opus); `docs/features/windowsweep-completion/00-overview.md`; `docs/README.md`; the
  README rows; the docs repo's `CLAUDE.md` = `AGENTS.md` and `docs/MANUAL-TASKS.md`; the web repo's `CLAUDE.md`
  = `AGENTS.md`, `docs/PROJECT-CONTEXT.md`, `docs/MANUAL-TASKS.md` (row 1 closed, rows 2-3 added), `README.md`;
  the design ledgers and one source comment repointed; `~/.dev-ports.json`; the palette registry `domain`; the
  memory note moved to `D--work-windowsweep-root`; the portfolio (`WINDOWSWEEP_portfolio-info_2026-09-12.md` in
  both locations, byte-identical); the master links JSON (`links.web`, `statusNote`, `dataGapsNote`).

## Files created / modified

Product repo: `CLAUDE.md`, `AGENTS.md`, `README.md`, `PENDING-TASKS.md`, `WINDOWSWEEP_portfolio-info_2026-09-12.md`
(the 09-08 file deleted), `docs/PROJECT-CONTEXT.md`, `docs/MANUAL-TASKS.md`, `docs/DONE-TASKS.md`,
`docs/README.md`, `docs/features/windowsweep-completion/{00-tracker.json,00-overview.md}`,
`desktop/design/CLICK-DUMMY-INVENTORY.md`, `desktop/design/gate4/GATE4-REPORT.md`, `desktop/src/lib/analytics.ts`
(a comment), this record. Docs repo: `CLAUDE.md`, `AGENTS.md`, `docs/MANUAL-TASKS.md`. Web repo: `CLAUDE.md`,
`AGENTS.md`, `README.md`, `docs/PROJECT-CONTEXT.md`, `docs/MANUAL-TASKS.md`. Workspace root (outside git): the
three planning files, the v3 plan, `README.md`, `CLAUDE.md`, `AGENTS.md`. Notebook: the portfolio copy, the master
JSON, the palette registry. Home: `~/.dev-ports.json`, the memory note.

## Current status and next steps

The audit deliverables are complete; **no engine file changed** (the diff against `v1.2.0` is still empty). The
Opus session takes the v3 plan from W0: the brain sync, the docs domain re-add, the site `.env`; then W1 the
deletion RPC; W2 four agents; W3 deploy + telemetry + the person-shaped verification once row 15 lands +
parity; W4 `desktop-v1.2.0` and the updater proof; W5 the one-pass write-back; W6 the keeper; W7 close-out.

## Technical notes

- The edits to eleven record files were applied by a runner that asserts every anchor occurs exactly once
  (`apply-edits.mjs` + `edits.json` in the session scratchpad) - a drifted anchor fails loudly rather than
  editing the wrong place. All 59 anchors matched.
- The context-budget rows were resolved to a fixed point: the byte count of a file that states its own size
  converges after one substitution as long as the digit count is stable.
- Two shell calls that both `cd` in one response raced on the shared working directory; every later command
  used absolute paths.

## Session metrics

Three planning files rewritten, 23 record files edited across three repos and the notebook, 102 tracker
sub-tasks (67 complete), zero engine changes, four gates re-run in three repos, eight owner decisions recorded.

## Continuation prompt

> Read `D:\work\windowsweep-root\windowsweep\CLAUDE.md`, then
> `D:\work\windowsweep-root\completion-plan-v3-2026-09-12.md` (the v3 plan, written on Fable 5.1 on
> 2026-09-12 from a full audit), then `docs/features/windowsweep-completion/00-tracker.json`. Twenty owner
> decisions are recorded (D1-D12 in the tracker, D13-D20 in the v3 plan) - apply them, never re-ask. Resume at
> the first `pending`/`in_progress` sub-task; the v3 waves say how. Invoke the wave's skill loadout before the
> first edit and state it. Use only `aoneahsan-ccca-*` agents, each with the plan's `EXCLUSIVE SCOPE`, never
> more than FOUR at once (D20), never on a hot file; agents never commit, push or deploy. At the start of every
> session poll `external.google`, the docs HTTPS state, the site `.env` and
> `releases/latest/download/latest.json`, and run what each unblocks. Run every gate a task names, watch each
> new gate fail once on a plant you verified applied, flip the tracker in the same commit as the work, append
> a `runHistory` row, one commit per repo, push, quote the bypass line, no attribution trailer. Do not stop
> while any open item is unblocked; when only owner rows and second-machine rows remain, finish with W7 and a
> work-history record ending in this prompt updated. Do not re-plan and do not re-derive the backend, the
> layout, the tagline, the release sequence, the analytics decision, the site's scope, the account-deletion
> decision or the Android exclusion. Done so far: nothing beyond the 2026-09-12 audit (W0 is next).

## Document history

| Date | Change |
|---|---|
| 2026-09-12 | Created at the end of the audit session |
