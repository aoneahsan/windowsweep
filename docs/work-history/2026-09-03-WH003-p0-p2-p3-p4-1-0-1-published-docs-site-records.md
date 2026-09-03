# WH003 - 1.0.1 published, self-test to 124 checks, documentation site live, owner records written

| Field | Value |
|---|---|
| Date | 2026-09-03 |
| Task | Session 1 of the completion plan: phases P0, P2, P3 and P4 |
| Duration | One session (Opus 5 execution of a Fable 5.1 plan) |
| Status | P0 complete · P2 complete · P3 in progress (awaiting the owner's DNS row) · P4 in progress (RW-052 is the owner's) |
| Project | windowsweep (`D:\work\windows-cleanup`) |
| Developer | Ahsan Mahmood |
| Plan | `C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` |

## Executive summary

windowsweep 1.0.1 is published, tagged and released; every P0 defect from the launch-day audit is fixed,
including the HIGH one where `--yes` pre-selected personal and project files. The self-test grew from 108 to
124 checks, and every new check was proved red against a planted defect before it was kept. A documentation
site now exists at `aoneahsan/windowsweep-docs`, deployed green to GitHub Pages, waiting only on the owner's
DNS record. The owner's portfolio, master-links and ORCID records exist, and the palette and port registries
carry windowsweep's claims.

Three defects were found in the *instruments* rather than the product, and each was fixed before its number
was trusted: a Ctrl-C harness whose ordering made the child inherit "ignore Ctrl-C" and report a false 0; a
tarball-comparison step whose Windows-style path made `tar` treat `C:` as a remote host, so a `||` printed a
false "nothing disappeared"; and a stale-artefact self-test check that stayed green when its own gate was
removed, because the fixture was half-oriented.

## Starting point

`main` at `104ec1a`, npm at 1.0.0, self-test 108 checks, no tags, no Releases, no documentation site, no
portfolio or ORCID record. Ten open P0 items from the 2026-09-03 audit, specified in `remaining-work.md`.

## Work completed

### Block A - P0: the defects and the 1.0.1 release (`edaa5cf`, `51a8d58`)

- **RW-002 (HIGH).** `Read-MultiSelect` in `lib/ui.ps1:189` gained `-NoAutoYes`, and a non-interactive call
  now returns an empty selection instead of falling through to a prompt that cannot be answered. Sections 17
  (`modules/projects.ps1:132`), 18/19 (`modules/personal.ps1:87`) and 20's disk picker
  (`modules/docker.ps1:72`) pass it; section 17's final question became `Confirm-Ui -NoAutoYes`, so the
  walkthrough's step answer no longer stands in for a selection. Section 20 keeps `--yes` = every disk, which
  is deep-gated and documented.
- **RW-003, RW-004.** Section 19's title dropped Desktop; sections 18 and 19 carry the new tier `recycle`
  (`lib/constants.ps1:54-55`), with the tier legend added to `docs/sections.md` and the README.
- **RW-005.** `Confirm-PurgeAllOnce` in `lib/config.ps1` asks for a typed `purge` once per console run and
  falls back to pruning when declined; wired into `windowsweep.ps1` beside `Resolve-DeveloperMode`.
- **RW-006.** `CachedExtensionVSIXs` left `WS_EDITOR_CACHES` (`lib/actions.ps1:7`) and became its own
  unguarded target per editor (`modules/editors.ps1:16-17`), which is what the documentation already claimed.
- **RW-007.** `Test-NpxInstallerRefusal` refuses `--install-task` and `--install-alias` under npx with exit 3
  and the global-install steps.
- **RW-008.** The entry script's `finally` block exits 130 when a run did not finish.
- **RW-010, RW-011.** `--uninstall-data` confirms with `-NoAutoYes`; keywords trimmed to twelve.
- **RW-053.** The CI tarball sweep names the three planning files, `PENDING-TASKS.md`, `desktop/` and
  `portfolio-info`, and asserts `AI-INTEGRATION-GUIDE.md` ships once it exists.
- **New module** `modules/self_test_extra.ps1` with group [12], four checks. One of them reads every module's
  AST and fails if any `Read-MultiSelect` call omits `-NoAutoYes` - the check that makes the RW-002 fix
  permanent rather than a one-time edit.
- **Released.** The publish gate ran in full and 1.0.1 went out (38 files, 81.4 kB packed, 273.1 kB unpacked),
  verified from the registry and with `npx -y windowsweep@1.0.1 --version` from `%TEMP%`. Annotated tags
  `v1.0.0` (on `70c6738`, the commit the 1.0.0 tarball was built from) and `v1.0.1` (`edaa5cf`), each with a
  GitHub Release.

### Block B - P2: self-test coverage (`1650e80`)

Groups [13] and [14], ten checks: the argument parser, `Get-SectionIdList`, `ConvertFrom-SizeText`, the
cache-leaf guard, the `--json` shape, superseded Squirrel versions, the Chromium layout, stale workspace
storage, stale artefacts, and the report exporters. Two pure functions were split out so they can be
exercised directly with no behaviour change: `Test-KnownCacheLeaf` from the second guard inside
`Invoke-TargetList`, and `Get-JsonSummary` from `Write-JsonSummary`.

### Block C - P3: the documentation site and the AI guide (`5c12134`; docs repo `e3f86fd`..`234a54a`)

`aoneahsan/windowsweep-docs` mirrors the `linux-cleanup-docs` template: site URL and CNAME, four JSON-LD
payloads rewritten for a Windows PowerShell CLI, navbar and footer pointing at the flat page set, prism
gaining `powershell`, and the Infima ramp moved to hue 128. Fifteen pages mirrored from `docs/` plus the AI
guide, every one with `title`, `description` and `tags`, every one in the sidebar. Pages is enabled with the
CNAME pinned, the wiki is off, and ruleset 22211229 matches the sibling repo's.

`AI-INTEGRATION-GUIDE.md` at the CLI repo root documents the contract for an agent or a script. Every command
in it was run read-only before it shipped, and one claim was corrected against the output rather than left as
written: `developer` is `null` in a mode that never resolves the question.

### Block D - P4: hygiene and the owner's records (`a94bac7`; notebook `26db4a0f`)

Eight topics, wiki off. FilesHub project 60 created for the phase-P6 vault. Palette hue 128 registered and
ports 5972/5973/5974 claimed. The portfolio-info file written to the notebook with a byte-identical copy at
the repo root, the master-links entry added with `ownerReview` empty, `windowsweep.bib` written and appended
to the combined corpus (24 entries, pure ASCII), and the ORCID block added to both instruction files.

## Files created

`modules/self_test_extra.ps1` · `AI-INTEGRATION-GUIDE.md` · `PENDING-TASKS.md` ·
`WINDOWSWEEP_portfolio-info_2026-09-03.md` · `docs/work-history/2026-09-03-WH003-*.md` · the whole
`windowsweep-docs` repository · the notebook's `windowsweep.bib` and portfolio file.

## Files modified

`lib/{ui,constants,config,actions}.ps1` · `modules/{projects,personal,docker,editors,release_helpers,runner}.ps1` ·
`windowsweep.ps1` · `package.json` · `VERSION` · `CHANGELOG.md` · `README.md` · `.github/workflows/ci.yml` ·
`docs/{sections,safety-model,developer-mode,cli-reference,installation,faq,quick-start,PACKAGES,README,PROJECT-CONTEXT,MANUAL-TASKS}.md` ·
`docs/features/windowsweep-completion/00-tracker.json` · `remaining-work.md` · `remaining-work-summary.md` ·
`CLAUDE.md` + `AGENTS.md` · the notebook's master links JSON, ORCID README and MANUAL-TASKS, and the palette
registry.

## Verification

| Gate | Result |
|---|---|
| Self-test (Windows PowerShell 5.1) | `all 124 checks passed`, exit 0 |
| `--dry-run --all --yes` | exit 0, 11 sections |
| `npm run version:check` | `version parity OK: 1.0.1` |
| PSScriptAnalyzer (local, 5.1) | 0 findings |
| CI (`windows-latest`, both hosts) | green on `edaa5cf`, including PSScriptAnalyzer under PowerShell 7 and the new tarball assertion |
| `npm view windowsweep version` | `1.0.1` |
| `npx -y windowsweep@1.0.1 --version` from `%TEMP%` | `windowsweep v1.0.1` |
| Tags / Releases | `v1.0.0 -> 70c6738`, `v1.0.1 -> edaa5cf`; both Releases listed |
| Pages deploy | Build and Deploy green; `no owner-only files in 201 built files` |
| `windowsweep-docs.aoneahsan.com` | `000` - expected until the owner's DNS row |

Sixteen planted defects were used across the session; each turned its own check red and was then restored.

## Technical notes (traps met)

- **A harness can inherit the very thing it is testing.** `SetConsoleCtrlHandler(NULL, TRUE)` is inherited by
  children created afterwards, so setting it before spawning made the child ignore Ctrl-C and exit 0 - a
  false negative that looked like "the fix does not work". Spawn first, then protect the harness. Separately,
  `Start-Process -PassThru` drops the process handle in PowerShell 5.1 unless `$p.Handle` is touched, which
  makes `$p.ExitCode` read back as `$null`.
- **Git Bash `tar` reads `C:/...` as a remote host.** The extraction failed, the comparison directories never
  existed, and a `grep ... || echo "none"` printed a reassuring "no file disappeared". Bash tools need
  `/c/...`; Windows Python needs `C:/...`; the two are not interchangeable in one script.
- **A Bash heredoc collapses `\\` even when quoted.** `D:\\ahsan-notebook` reached Python as `D:\ahsan...`,
  where `\a` is a bell. Write backslash-bearing content with the Edit or Write tool.
- **Python treats `\0` in a search string as an octal escape.** A `.replace()` on a path containing
  `E:\04-code` silently matched nothing; without an assertion beside it, the no-op was invisible.
- **A three-way fixture needs three distinct reasons.** The stale-artefact check listed A (idle, has a
  marker) and excluded B and C - but B and C were excluded by the *age* gate, so removing the marker test
  changed nothing. C now carries a source file idle 400 days and no marker, and the plant goes red.
- **`test -z "$(find build ...)"` passes when `build/` is missing.** The Pages sweep now refuses a missing or
  suspiciously small build directory and reports the denominator it checked.
- The self-test count is 124 rather than the 122 the plan predicted: the new module file adds one check to
  group [3] (syntax) and one to group [4] (ASCII), on top of the ten new checks.

## Current status

P0 and P2 are closed. P3 is complete except the write-back that waits on DNS. P4 is complete except the
folder rename, which is the owner's. P1 is entirely owner-run. P5 and P6 have not started.

## Next steps

1. Fable 5.1 reviews this session and plans Session 2.
2. Session 2 is P5: the 1.1 sections (22-26), the new target rows, `--notify`, and the two GUI prerequisites
   RW-071 (`--select`) and RW-072 (the `--json` additions), closing with 1.1.0.
3. Then P6, the desktop app, starting with the click dummy for the owner's review.
4. Owner rows now actionable: 1, 3, 8, 9, 11, 12, 14 to 18 in `docs/MANUAL-TASKS.md`.

## Session metrics

Five commits in the CLI repo, six in the documentation repo, one in the notebook. Self-test 108 -> 124
checks. One npm release, two tags, two GitHub Releases, one new public repository.

## Continuation prompt

> Read `C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` (especially section 9, the execution
> log, and section 8, the outline for later sessions), then `D:\work\windows-cleanup\CLAUDE.md`,
> `remaining-work.md` and `docs/features/windowsweep-completion/00-tracker.json`. Session 1 closed phases P0
> and P2, left P3 waiting only on the owner's DNS record and P4 waiting only on his folder rename, and
> published windowsweep 1.0.1 with tags and Releases. Review what was done, then plan Session 2 - phase P5,
> the 1.1 family-parity features plus RW-071 and RW-072, closing with the 1.1.0 release - and save the plan
> in full detail before any code is written. Do not re-plan the finished phases.

## Document history

| Date | Change |
|---|---|
| 2026-09-03 | Created at the end of Session 1 |
