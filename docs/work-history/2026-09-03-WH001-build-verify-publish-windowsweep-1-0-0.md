# WH001 - Build, verify, run and publish windowsweep 1.0.0

| Field | Value |
|---|---|
| Date | 2026-09-03 |
| Task id | WH001 (tracker `docs/features/windowsweep-v1/00-tracker.json`, phases A-H) |
| Duration | one build session (planning through publish), with one pause/resume |
| Status | complete - 1.0.0 on GitHub and npm; owner-only follow-ups in `docs/MANUAL-TASKS.md` |
| Project | windowsweep (`aoneahsan/windowsweep`, npm `windowsweep`) |
| Developer | Ahsan Mahmood, with Claude Code |

## Executive summary

A new Windows cleanup CLI was built from an empty folder to a published 1.0.0: a PowerShell 5.1 engine with
22 numbered sections behind a Node launcher, a fixture-based self-test, canonical docs, CI, a protected public
repo and an npm release. The real run on the build machine took drive C: from 1.89 GB free to 23.98 GB free
without touching a protected path, and exposed one hot-path defect that was fixed before release.

## Starting point

Empty `D:\work\windows-cleanup` with the two sibling tools cloned into `temp/` for reference; a workstation
with 1.8 GB free on a 273 GB system drive, Windows PowerShell 5.1 only, last-access tracking disabled.

## Work completed

- **A-C - engine.** `windowsweep.ps1` ($args parsing, dispatch), `lib/` (constants, ui, log, fs, safety, config,
  scan, actions), 18 modules for sections 0-21 plus walkthrough, menu, reports, release helpers and the crash
  trap. Chokepoint `Remove-PathSafe` in `lib/safety.ps1`; layout kinds resolve only to allowlisted cache folder
  names in `lib/actions.ps1`.
- **D - docs and package.** README (canonical pattern), 13 docs pages, CHANGELOG, CONTRIBUTING, SECURITY,
  CODE_OF_CONDUCT, LICENSE, issue templates, FUNDING, `ci.yml`, logos, CLAUDE.md = AGENTS.md, tracker + overview.
- **E - verification.** PSScriptAnalyzer 0 findings after three real fixes (`lib/safety.ps1`: labels logged,
  `Remove-StaleUnits` honours `-Within`). Two planted defects each turned `--self-test` red (check [6], check
  [3]) and were removed. Real run `--all --yes --developer`: 21,319,077,118 bytes reported in 11m 31s; C: free
  2,033,340,416 -> 25,746,153,472 bytes. Spot-check of `.ssh`, Documents, Desktop, AVDs, Gradle dists, Android
  SDK and installed VS Code extensions: unchanged.
- **Defect found by the real run.** `Get-ProtectionReason` cost 10.6 ms per file (path resolution for ~70
  subtrees plus 50 wildcard compiles per call), so 400,000 yarn files would have taken over four hours. The
  pass was stopped, the guard rewritten over pre-normalized prefixes and precompiled `WildcardPattern`
  objects (`lib/safety.ps1`, 0.58 ms per call, identical verdicts on 35 probe paths), and the run restarted.
- **F - GitHub.** Commits `ac72188` and `70c6738`; public repo, Issues on, ruleset 22181256 (owner bypass,
  required check `ci`).
- **G - npm.** Gate passed (clean tree, registry 404, tarball sweep with a planted-needle control, smoke install
  with self-test); published as `aoneahsan` at 2026-09-03T09:15:18Z; verified with `npm view` and a fresh-cache
  `npx` run from a neutral directory.

## Files created or modified

Everything under the repository root except `temp/` (gitignored). The two post-release edits of this session:
`lib/safety.ps1` (guard hot path, unused-parameter fixes) and `lib/actions.ps1` (per-folder result labels).

## Reference documents

`docs/PROJECT-CONTEXT.md` (decisions, real-run and release records) · `docs/MANUAL-TASKS.md` (owner-only
rows) · `docs/features/windowsweep-v1/00-tracker.json` · `docs/safety-model.md` · `CHANGELOG.md`.

## Current status

1.0.0 released. Tracker phases A-H complete. Seven owner-only rows open in `docs/MANUAL-TASKS.md`.

## Next steps

1. Owner: admin sections with hibernation off (`--only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate`).
2. Owner: close Chrome, then `--only 7 --yes`; close Slack and Granola, then `--only 8 --yes`; start Docker
   Desktop, then `--only 5 --yes`.
3. Owner: walk sections 17-19 interactively; rename the folder to `windowsweep`; portfolio and ORCID passes.
4. Next code work: a 1.0.x only if a user reports a defect; section numbers stay frozen.

## Technical notes

- PowerShell 5.1: `ConvertFrom-Json` returns a top-level array as one object; scalar `.Count` is `$null` on a
  PSCustomObject - guards `Read-JsonFile` and `@()` wraps are deliberate.
- NTFS updates directory timestamps lazily; the self-test's dry-run hash compares files only.
- `Get-Item` on `hiberfil.sys` fails unelevated; `New-Object IO.FileInfo` reads its size.
- Verify a published version from outside the repo; inside it npx picks the same-named local package.

## Session metrics

Self-test 108/108 on both hosts in CI; analyzer 0 findings; 22.08 GB freed on the build machine; two
commits before the record commit; one npm publish.

## Continuation prompt

> Read `docs/work-history/2026-09-03-WH001-build-verify-publish-windowsweep-1-0-0.md` and
> `docs/features/windowsweep-v1/00-tracker.json` in `aoneahsan/windowsweep`. Phases A-H of 1.0.0 are complete
> and published. Verify that state against `git log --oneline main` and `npm view windowsweep version`, list
> the open rows in `docs/MANUAL-TASKS.md` without doing them (they are owner-only), and then guide me through
> whatever I ask for next - a 1.0.x fix, a new target row, or a docs change - keeping the section numbers
> frozen, every deletion on the chokepoint, `--dry-run` honoured, source ASCII-only, and the version cascade
> (`package.json`, `VERSION`, `lib/constants.ps1`, CHANGELOG, README) moving together.

## Document history

| Date | Change |
|---|---|
| 2026-09-03 | Created at the end of the 1.0.0 build session |
