# windowsweep - remaining work to 100% feature-complete and production-ready

Last Updated: 2026-09-03 (audit of commit `84c732f` on `main`; npm `windowsweep@1.0.0`)

This is the working specification for finishing windowsweep. It is written for an agent session (Claude
Code or Codex) that has read `CLAUDE.md` / `AGENTS.md` and nothing else. Every item carries its evidence,
its success criteria, its acceptance points, what to do and what not to do. **Status lives in one place
only: `docs/features/windowsweep-completion/00-tracker.json`.** This file never carries a status column;
when an item closes, the tracker sub-task flips in the same commit as the work.

Companion files: `what-this-project-consists-of.md` (what exists today, with evidence) and
`remaining-work-summary.md` (the one-page view with percentages).

## 1. Definition of done (owner decisions, 2026-09-03)

| Question | Decision |
|---|---|
| What counts as 100% feature-complete | The 1.0 catalogue (sections 0-21) **plus the family-parity features shipped as 1.1** (P5 below), plus the release sync, the found defects, verification, self-test coverage, the docs site, repository hygiene and the portfolio/ORCID records |
| Docs site | **In scope.** `aoneahsan/windowsweep-docs` served at `windowsweep-docs.aoneahsan.com` (Docusaurus on GitHub Pages, like `linux-cleanup-docs` and `macleanup-docs`) |
| Desktop GUI | **A later, separate phase** (P6). A Tauri wrapper around the same script, like `macleanup/desktop`. Not counted toward CLI completion; it gets its own plan and tracker when P0-P5 are closed |
| Distribution channels | **npm and the git clone only.** No winget, Scoop, Chocolatey or PowerShell Gallery |

"Production-ready" for this project means: the published npm version equals `main`; every documented
promise is true in the code; the admin, personal and Windows 11 paths have been exercised for real at least
once; the docs site is live and linked; the repository carries topics, a tag and a release per version; the
owner's records (portfolio, ORCID, master links) name the project.

## 2. Status snapshot (2026-09-03)

| Area | Done | What is missing |
|---|---|---|
| CLI engine 1.0 (22 sections, 5 modes, chokepoint, dry-run, reports, self-test) | 97% | the defects in P0 |
| Release state | 85% | `main` is ahead of npm by one internal rename (RW-001); no git tag, no GitHub Release |
| Verification | 65% | admin sections 12-16 and 20 never run for real; Windows 11 never exercised; Scheduled Task never observed; sections 4, 5, 7 (Chrome), 8 (Slack), 17-19 never run for real |
| Self-test coverage | 75% | argument parser, section-list parser, size parser, superseded-version logic, layout guard, workspace-storage and artefact finders, report export, `--json` shape |
| In-repo documentation | 95% | three doc-versus-code mismatches (RW-004, RW-005, RW-006) |
| Docs site | 0% | everything (P3) |
| Repository hygiene | 70% | topics, homepage, wiki off, tags, releases |
| Owner records | 60% | portfolio-info file, master links JSON, ORCID entry (P4) |
| 1.1 family-parity features | 0% | P5 |
| Desktop app (P6, excluded from the percentage) | 0% | its own plan |

Weighted over the agreed scope (engine 30, 1.1 features 20, verification 10, in-repo docs 10, docs site 10,
self-test 5, release 5, hygiene 5, records 5) the project stands at **about 60% of the agreed scope**; the
shipped 1.0 CLI on its own is **about 90% production-ready**.

## 3. How to work this file

1. Read `CLAUDE.md` (or `AGENTS.md`), then `docs/features/windowsweep-completion/00-tracker.json`. Take
   the first `pending` sub-task; it names the `RW-` item below. Never re-plan from zero.
2. One item (or one phase, when the items are small) per session. Run the gates named in the item before
   claiming it done. Flip the sub-task, bump `lastUpdated`, append a `runHistory` row, one commit, push.
3. Every code change obeys the IRON rules in `CLAUDE.md`: PowerShell 5.1 syntax, ASCII-only source, every
   deletion through the chokepoint with a declared `-Within` root, `--dry-run` honoured, files under 500
   lines, section numbers 0-21 frozen, the version cascade moves together.
4. Owner-only rows (`awaitingUser: true` in the tracker, and a row in `docs/MANUAL-TASKS.md`) are never
   executed by an agent. The agent prepares, the owner runs, the agent records the result.
5. Paste-ready session prompt:

   > Read `remaining-work.md` and `docs/features/windowsweep-completion/00-tracker.json` in
   > `aoneahsan/windowsweep`. Resume the first pending sub-task, do only that item (or that phase), run its
   > gates, flip its status in the same commit, append a runHistory row, one commit, push to `o main`.

## 4. Things never to do (apply to every item)

- Never reuse or renumber a section. 0-21 are a public contract; new sections start at 22; a retired
  section stays as a no-op that says so.
- Never add a runtime dependency to `package.json`, and never add network code (self-test check [9] fails
  the build on `Invoke-WebRequest`, `HttpClient`, sockets, `curl`, `wget`).
- Never delete outside `Remove-PathSafe` / `Send-ToRecycleBin` / `Clear-DirectoryContents` /
  `Remove-StaleFiles` / `Remove-StaleUnits`, and never call a destructive external command outside
  `Invoke-External -Destructive`. A bare `Remove-Item` on user data is a defect.
- Never shrink a protected list. They only grow.
- Never `npm unpublish`; a bad release is `npm deprecate`d. Never `git push --force`, never `--admin`,
  never edit or disable the `main` ruleset. A direct owner push prints `Bypassed rule violations`; quote it.
- Never ship `CLAUDE.md`, `AGENTS.md`, `docs/`, `temp/` or the three root planning files in the tarball
  (`files` is an allowlist; CI sweeps the listing).
- Never put a secret, a token, a phone number or a new machine-specific path into this public repository.
- Never write GUI code into this repository before the desktop-app plan (P6) exists and the owner has
  decided its account model.
- Never change deletion behaviour without a `CHANGELOG.md` entry and matching edits to `docs/sections.md`,
  `docs/cli-reference.md` and the README section table.
- Never run an admin section from an agent session (they need a UAC click), and never run a real (non
  dry-run) cleanup outside the scope the owner named for that session.

## 5. Phase P0 - release sync and known defects (target: 1.0.1)

Gate for the whole phase: `node bin\windowsweep.js --self-test --no-color --no-report` exit 0 on Windows
PowerShell 5.1; CI green on both hosts; `npm run version:check`; `npm pack --dry-run` lists the allowlist
only; every planted defect below turned its new self-test check red before the fix was kept.

### RW-001 - Publish 1.0.1 so npm equals `main` (agent, ~1 h including the gate)

- **What.** `main` (`84c732f`) is ahead of the published `windowsweep@1.0.0` by the internal rename
  `Write-Log` -> `Write-LogLine` in `lib/log.ps1`, `lib/safety.ps1`, `lib/ui.ps1`, `modules/crash_trap.ps1`,
  `modules/runner.ps1` (18 call sites, no behaviour change; it made PSScriptAnalyzer pass under PowerShell 7).
  Every other P0 fix lands in the same release.
- **Why.** A user who reads the source on GitHub and runs the npm package must be running the same code.
- **Evidence.** `git diff 70c6738..HEAD --stat`; `npm view windowsweep version` = `1.0.0`;
  `CHANGELOG.md` `[Unreleased]` (written 2026-09-03).
- **Success criteria.** `npm view windowsweep version` prints `1.0.1`; `git tag v1.0.1` points at the
  release commit; `npx -y windowsweep@1.0.1 --version` from a directory outside the repo prints 1.0.1.
- **Acceptance points.**
  1. Version cascade moved together: `package.json`, `VERSION`, `WS_VERSION_FALLBACK` in
     `lib/constants.ps1`, `CHANGELOG.md` (`[1.0.1] - <date>` replaces `[Unreleased]`), README at-a-glance
     row and README changelog line, `docs/PACKAGES.md` size row (re-measure with `npm pack --dry-run`; the
     audit-day tree packs 78.4 kB / 264.0 kB / 37 files).
  2. The publish gate from `~/.claude/rules/publishing-compliance.md` ran in order: tree clean and pushed,
     self-test and dry-run green, registry version below the new one, `npm pack` + tarball sweep (no
     `CLAUDE.md`, `AGENTS.md`, `docs/`, `temp/`, `.npmrc`, the three root planning files), smoke-install
     of the packed tarball into a temp prefix (`--version`, `--list`, `--self-test`), `npm whoami` =
     `aoneahsan` with the token written from the FilesHub developer account (never echoed), `npm publish
     --access public`, then `npm view` and a fresh-cache `npx` run from a neutral directory.
  3. A GitHub Release `v1.0.1` with the changelog entry as its body (see RW-050 for the tagging convention).
- **To complete.** Land RW-002 to RW-011 first (they are all 1.0.1 content), then run the cascade and gate.
- **Do not.** Do not publish from inside a session that also has uncommitted work; do not skip the
  smoke-install; do not run `npx windowsweep` inside the repo to verify (it resolves the local package and
  fails - `docs/troubleshooting.md`).

### RW-002 - Section 17 deletes every listed artefact under `--yes` with no selection (agent, HIGH, ~1 h)

- **What.** The README and `docs/faq.md` promise that section 17 "removes only what you select". With
  `--yes` on, `Read-MultiSelect` returns every index instead of asking (`lib/ui.ps1:193`), and the final
  confirmation is auto-answered: in the walkthrough `SectionPreConfirmed` short-circuits `Confirm-Section`
  (`modules/walkthrough.ps1:45-46`, `lib/actions.ps1:98`), in the menu the `Y` toggle (`modules/menu.ps1:52`)
  makes `Confirm-Ui` auto-yes. Result: `windowsweep --yes` followed by `a` at step 17, or `--menu`, `Y`,
  `17`, removes every stale artefact folder without a person choosing one. Sections 18 and 19 pre-select
  everything the same way (`modules/personal.ps1:87`) but still stop at a typed confirmation
  (`modules/personal.ps1:91`, `-NoAutoYes`), so they only pre-select.
- **Why.** The whole design rests on personal and project data never going unattended; batch mode refuses
  17-19 correctly (`modules/runner.ps1:55-60`), the interactive modes do not.
- **Evidence.** `lib/ui.ps1:189-197`, `lib/actions.ps1:93-100`, `modules/projects.ps1:132-134`,
  `README.md` FAQ "removes only what you select", `docs/sections.md:157`.
- **Success criteria.** With `--yes` active in any interactive mode, sections 17, 18 and 19 present the
  selection prompt and default to "none"; an empty selection removes nothing; section 17's final
  confirmation is never auto-answered.
- **Acceptance points.**
  1. `Read-MultiSelect` gains `-NoAutoYes`; sections 17, 18, 19 (and section 20's disk picker) pass it.
  2. Section 17's `Confirm-Section` call becomes `Confirm-Ui -NoAutoYes` (walkthrough pre-confirmation no
     longer applies to the selection step).
  3. New self-test check: with `$ws.Yes = $true` and `$ws.Interactive = $false`,
     `Read-MultiSelect -Total 5 -NoAutoYes` returns an empty list, and without the switch returns 1..5
     (documents the intended asymmetry for sections 4 and 20 that legitimately honour `--yes`).
  4. Planted defect proved: remove the switch from section 17, watch the new check go red, restore.
  5. `docs/sections.md` sections 17-19 and `docs/safety-model.md` "Batch policy" state that `--yes` never
     selects items in 17-19; README FAQ unchanged (it becomes true).
- **To complete.** Edit `lib/ui.ps1`, `modules/projects.ps1`, `modules/personal.ps1`, `modules/docker.ps1`
  (section 20 keeps `--yes` = all, because it is deep-gated and documented), `modules/release_helpers.ps1`
  (check), the two docs pages, `CHANGELOG.md` under Fixed.
- **Do not.** Do not change batch-mode refusal (`runner.ps1`); do not make `--yes` stop working for
  sections 4, 11, 15, 16, 20 where it is documented.

### RW-003 - Section 19 title claims Desktop is scanned (agent, 10 min)

- **What.** `lib/constants.ps1:55` titles section 19 "Large stale personal files (Downloads, Desktop)";
  `Get-PersonalRoots` scans Downloads only (`modules/personal.ps1:5-10`) and Desktop is a protected root.
  `--list`, the menu and the walkthrough step header show the wrong title.
- **Success criteria.** Title reads "Large stale personal files (Downloads) -> Recycle Bin"; README row 19,
  `docs/sections.md` row 19 and the section 19 prose all say Downloads only (they already do).
- **Acceptance points.** `node bin\windowsweep.js --list` shows the new title; self-test [3] and [6] green.
- **Do not.** Do not add Desktop as a scanned root; that is a recorded owner decision.

### RW-004 - Sections 18 and 19 print the tier "permanent" (agent, 20 min)

- **What.** `lib/constants.ps1:54-55` carry `Tier = 'permanent'` for the two Recycle Bin sections, so
  `--list` prints "permanent" while README, `docs/sections.md:27-28` and `docs/safety-model.md` say
  "Recycle Bin".
- **Success criteria.** A tier value `recycle` exists in the catalogue comment (`lib/constants.ps1:32`),
  sections 18 and 19 use it, `Show-SectionList` (`modules/release_helpers.ps1:20-33`) prints it, and the
  tier legend in `docs/sections.md` names it.
- **Acceptance points.** `--list` output matches the README tier column row for row; self-test green.
- **Do not.** Do not touch the `Batch` column; 18 and 19 stay `interactive`.

### RW-005 - `--purge-all` is documented as asking once more, but only Docker asks (agent, 45 min)

- **What.** `docs/developer-mode.md:33` says `--purge-all` "asks once more first". In the code only section
  5 asks (`modules/docker.ps1:42`); `Invoke-TargetList` silently switches prune/units targets to `clear`
  (`lib/actions.ps1:126`).
- **Recommended fix.** In interactive runs with `--purge-all` and developer mode on, ask one typed
  confirmation (`Confirm-Typed`, `lib/ui.ps1:179`) once per run before the first section that would purge;
  in batch runs `--yes` is the confirmation (already documented with the fire mark). Update the doc
  sentence to match exactly.
- **Success criteria.** The sentence in `docs/developer-mode.md` describes the real behaviour; a run with
  `--purge-all` and no `--yes` from a console cannot purge without the typed word.
- **Acceptance points.** Manual dry-run from a console shows the typed prompt once; `--purge-all --yes
  --dry-run --all` in CI still runs unattended; self-test green.
- **Do not.** Do not make `--purge-all --yes` interactive; scheduled and scripted use must keep working.

### RW-006 - A running editor's VSIX cache is documented as cleared but is skipped (agent, 20 min)

- **What.** `docs/sections.md:83-84` and the section intro (`modules/editors.ps1:134-135`) say a running
  editor "is left alone except for its VSIX download cache and old logs". The editor-kind target that
  contains `CachedExtensionVSIXs` carries `-Guard $e.Proc` (`modules/editors.ps1:16`), so it is skipped
  while the editor runs; only the logs target is unguarded (`modules/editors.ps1:17`).
- **Recommended fix.** Split `CachedExtensionVSIXs` out of `WS_EDITOR_CACHES` into its own unguarded
  `clear` target per editor (it is a download cache the editor rewrites; safe while running). Keep the
  layout-kind allowlist in `lib/actions.ps1` consistent (`CachedExtensionVSIXs` stays a known leaf).
- **Success criteria.** With VS Code open, `--only 6 --dry-run` lists the VSIX cache as eligible and the
  other caches as skipped; the docs sentence is true.
- **Acceptance points.** Self-test [6] green (the new target is not inside a protected path); dry-run output
  reviewed with an editor open and closed.

### RW-007 - `--install-task` and `--install-alias` under npx point at the evictable npx cache (agent, 45 min)

- **What.** `Get-LaunchCommand` (`modules/release_helpers.ps1:310-318`) uses the global `windowsweep`
  shim only when launched by Node outside npx; under npx it registers `powershell.exe -File <path inside
  the npx cache>`. npx evicts that cache, after which the weekly task and the `cleanup` alias fail silently.
- **Recommended fix.** When `$ws.Npx` is true, refuse both installers with the exact instruction:
  `npm install -g windowsweep` then re-run `windowsweep --install-task` (exit code 3, refused). Say so in
  `docs/installation.md`, `docs/cli-reference.md` (both modes) and `docs/faq.md` ("Is a weekly Scheduled
  Task safe?").
- **Success criteria.** From `npx windowsweep --install-task` the tool prints the instruction and registers
  nothing; from a global install it registers the `windowsweep` shim as before.
- **Acceptance points.** `Get-ScheduledTask -TaskName 'windowsweep weekly safe cleanup'` absent after the
  npx attempt; present after the global-install attempt (owner verifies once, see RW-025).
- **Do not.** Do not register `npx -y windowsweep` as the task action; it would download from the registry
  when the cache is empty, and this tool promises no network activity of its own.

### RW-008 - Exit code 130 is documented but only the Node launcher produces it (agent, 30 min)

- **What.** `docs/cli-reference.md:76` lists 130 for Ctrl-C. The launcher maps a signal to 128+n
  (`bin/windowsweep.js:76-79`); the engine defines `WS_EXIT_INTERRUPT = 130` (`lib/constants.ps1:28`) and
  never uses it, so `windowsweep.cmd` and a direct `-File` run return PowerShell's own code.
- **Recommended fix.** Document the truth ("130 through the Node launcher; the `.cmd` launcher and a direct
  run return PowerShell's code") or, better, catch `PipelineStoppedException` in the entry script's
  `finally` and exit 130 when the run did not finish. Either way the doc and the code must agree.
- **Acceptance points.** Ctrl-C during `--scan` through each launcher observed once; the table matches.

### RW-010 - `--uninstall-data --yes` removes history and the developer answer unattended (agent, 10 min)

- **What.** `modules/release_helpers.ps1:391` confirms with `Confirm-Ui`, which `--yes` auto-answers.
- **Fix.** `-NoAutoYes` on that prompt; note it in `docs/cli-reference.md` ("always asks").
- **Acceptance points.** `--uninstall-data --yes` from a non-interactive console removes nothing and says why.

### RW-011 - Thirteen keywords against the 5-12 rule (agent, 5 min)

- **What.** `package.json:36-48` and the README Keywords line carry 13 terms; the fleet README rule allows
  5-12. Drop `temp-files` from both (least searched) in the 1.0.1 release.

## 6. Phase P1 - verification of paths that have never run for real

These rows are owner-run (a UAC click, a closed browser, a second machine). The agent's part is to prepare
the exact command, collect the log and report afterwards, fix what the run exposes, and record the outcome
in `docs/PROJECT-CONTEXT.md` under a "Verified runs" heading. The rows already exist in
`docs/MANUAL-TASKS.md`; the tracker mirrors them as `awaitingUser` sub-tasks.

### RW-020 - First real elevated run of sections 12-16 and 20 (owner ~30 min + agent 30 min)

- **What.** No admin section has ever executed for real: the build machine ran unelevated, CI runs
  dry-runs only. `Invoke-Elevated` (`lib/safety.ps1:476-493`), the service stop/start wrapper
  (`modules/system_admin.ps1:22-36`), `cleanmgr` with `StateFlags0077` (`modules/system_admin.ps1:86-114`),
  DISM (`:126-148`), `powercfg` (`:158-186`), `wevtutil` (`:196-220`) and `diskpart` compaction
  (`modules/docker.ps1:59-93`) are untested outside dry-run.
- **Command (owner, at the keyboard).**
  `windowsweep --only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate` (MANUAL-TASKS row 1;
  hibernation fully off is the owner's recorded decision). Section 16 (event logs) and 20 (compaction) are
  separate decisions: run `--only 20 --yes --i-understand-deep --elevate` only with Docker Desktop and WSL
  shut down; run 16 only if the owner wants the logs gone.
- **Success criteria.** The elevated window's JSON report shows `ran` for every section requested;
  `wuauserv` and `bits` are `Running` again afterwards (`Get-Service wuauserv,bits`); the
  `StateFlags0077` values are absent from `HKLM:\...\VolumeCaches\*`; `hiberfil.sys` is gone and
  `powercfg /a` reports hibernation unavailable; DISM's analysis lines appeared in the log; no crash
  bundle under `~\.windowsweep\feedback`.
- **Acceptance points (agent, after the run).**
  1. Read the elevated run's log and report; record freed bytes and the before/after free space in
     `docs/PROJECT-CONTEXT.md`.
  2. Any warning or non-zero exit in the log becomes a P0-style fix with its own sub-task.
  3. Confirm the parent window printed the child's exit code (the `-Wait -PassThru` path).
- **Do not.** Never run this from an agent session; never add `--reset-base` on the first run.

### RW-021 - Windows 11 has never been exercised (owner, ~30 min)

- **What.** README and `docs/installation.md` list Windows 11 as supported; every real and dry run so far
  was Windows 10 Pro for Workstations (build 19045) or CI's Windows Server (`windows-latest`).
- **Command (owner, on a Windows 11 machine or VM).** `npx windowsweep --self-test`, then
  `npx windowsweep --dry-run --all --yes`, then a real safe batch `npx windowsweep --all --yes`.
- **Success criteria.** Self-test 108/108 (or the current count), dry-run reviewed, real run frees space with
  no `REFUSE` line that is not expected and no crash bundle; the OS build number recorded in
  `docs/PROJECT-CONTEXT.md` "Verified runs".
- **Acceptance points.** Paths that only exist on Windows 11 (new Teams under `Packages\MSTeams_*`,
  `Widgets`, WebView2 caches) show up in the `--scan` table; anything absent by design is noted in
  `docs/sections.md`.

### RW-022 - Windows Server wording (done 2026-09-03 in the audit commit)

- **What.** README "Platform Support" and `docs/faq.md` said Server "is not in the test matrix"; CI runs
  every self-test and dry-run on `windows-latest`, which is Windows Server. Both texts now say: Server is
  dry-run tested in CI on every push; real runs are verified on Windows 10 only (Windows 11 after RW-021).
- **Acceptance points.** Met: both texts updated in the same wording; nothing claims a real Server run.

### RW-023 - Sections 4, 17, 18 and 19 for real (owner, ~20 min)

- **What.** Section 4 found no idle AVD on the build machine (both used within 3 days), 17-19 are
  interactive by design: MANUAL-TASKS row 3 (`--only 17 --scan-roots "D:\work;E:\04-code"`, then
  `--only 18,19`). Section 4 runs when an AVD is idle 100+ days or with `--days` lowered deliberately.
- **Success criteria.** Each section lists candidates, the owner selects, the selected items go (17:
  removed; 18/19: Recycle Bin), the JSON report shows `ran`, nothing unselected is touched. After RW-002 the
  selection prompt must appear even with `--yes` (do the run after RW-002 lands to prove it).

### RW-024 - Sections 5, 7 and 8 with the blockers closed (owner, ~15 min)

- **What.** Chrome (7.4 GB across 25 profiles), Slack and Granola were open and Docker's daemon was
  stopped during the build-session run, so those targets were skipped by the running-app guard. MANUAL-TASKS
  rows 2, 6, 7.
- **Success criteria.** Each `--only N --yes` run shows the previously skipped targets as cleared; the
  before/after free-space delta is recorded.

### RW-025 - The weekly Scheduled Task observed running once (owner 5 min + agent 15 min)

- **What.** `--install-task` registers `windowsweep weekly safe cleanup` (Sunday 03:00, `--all --yes
  --quiet --no-color`); it has never been observed to run. After RW-007, install it from a global install.
- **Success criteria.** `Get-ScheduledTaskInfo -TaskName 'windowsweep weekly safe cleanup'` shows
  `LastTaskResult 0` after `Start-ScheduledTask` (a manual trigger is fine), a new `report-*.json` exists
  with `mode: all`, `developer_mode: true` (saved answer) and no `refused` step.

### RW-026 - PowerShell 7 path on a real machine (owner optional, 10 min)

- **What.** CI proves the engine on `pwsh`; the build machine has no PowerShell 7, so `--pwsh` through the
  Node launcher and `Register-ScheduledTask` under pwsh 7 were never run locally.
- **Success criteria.** `npx windowsweep --pwsh --self-test` green on a machine with PowerShell 7
  installed; `--pwsh --install-task --dry-run` prints the action line.

## 7. Phase P2 - self-test coverage of the pure logic (agent, half a session)

All of these fall inside the pre-approved test classes (pure logic whose wrongness is invisible, one smoke
test per generator). They extend `Invoke-SelfTest` (`modules/release_helpers.ps1`) group [8] "Pure helpers"
and group [7] fixtures; the file is at 414 lines, so a new `modules/self_test_extra.ps1` (or splitting the
self-test into its own module) keeps every file under 500 lines.

### RW-030 - New checks (target: about 120 checks total)

| Check | Fixture | Passes when |
|---|---|---|
| Argument parser | call `Read-Arguments` on a saved `RawArgs` array: `--only=1,3`, `--export html 2`, `--days=30`, `--scan-roots "a;b"`, `--exclude-path x` twice | every `$Script:WS` field holds the expected value; `--days x` throws the usage error |
| `Get-SectionIdList` | `'1,3,5-7,9-8,99,x'` | returns `1,3,5,6,7,8,9`, warns on 99 and x (`modules/runner.ps1:3-22`) |
| `ConvertFrom-SizeText` | `'2.891GB'`, `'12.5 MB'`, `'20.48kB'`, `'0B'` | bytes match docker's decimal units (`lib/actions.ps1:178-186`) |
| `Remove-SupersededVersions` | fixture root with `app-1.0.0`, `app-1.10.0`, `app-1.9.0` | only `app-1.10.0` survives (version, not string, order) |
| Chromium layout guard | fixture `User Data` with `Default\Cache`, `Default\Local Storage`, `Profile 3\Code Cache` | `Get-ChromiumCacheDirs` returns the two cache folders only; `Invoke-TargetList` refuses a hand-injected non-allowlisted path with `REFUSE (not a known cache folder ...)` |
| `Remove-StaleWorkspaceStorage` | two `workspaceStorage\<id>\workspace.json`, one pointing at an existing folder, one at a missing one | exactly the missing one is removed (dry-run and real) |
| `Find-StaleArtefacts` | a fixture project with `package.json` + `node_modules`, source file 400 days old; a second project with a fresh source file | the first artefact is listed with its age, the second is not; a folder without a marker is skipped |
| Report export smoke | write a minimal schema-1 report JSON, run `Convert-ReportToMarkdown` and `Convert-ReportToHtml` | both files exist, contain `total_reclaimed_human` value and the tool name; HTML has no unescaped `<` from the title |
| `--json` shape | run `Write-JsonSummary` with a stub report | the single stdout line parses; keys `tool version mode dry_run freed_bytes sections refusals` present |
| Prompt asymmetry (from RW-002) | `$ws.Yes = $true; $ws.Interactive = $false` | `Read-MultiSelect -NoAutoYes` -> empty; without the switch -> 1..N |

- **Success criteria.** Each new check turned red on a planted defect at least once (record the plant and
  the message in the commit body), then green; CI green on both hosts; total check count printed in the
  final line and reflected in README ("Self-test" feature line) and `docs/quick-start.md`.
- **Do not.** Do not add a test runner or a dependency; the self-test is the suite.

## 8. Phase P3 - the docs site and the AI guide

### RW-040 - `windowsweep-docs` on GitHub Pages (agent 1 session; owner 2 rows)

- **What.** Both siblings publish their manual as a Docusaurus site (`linux-cleanup-docs.aoneahsan.com`,
  `macleanup-docs.aoneahsan.com`). The fleet docs ladder puts an npm package with no marketing site at
  `<npm-name>-docs.aoneahsan.com`, so the domain is `windowsweep-docs.aoneahsan.com` (probed 2026-09-03:
  `000`, unset; repo name `aoneahsan/windowsweep-docs` free).
- **Stack (mirror `linux-cleanup-docs`).** Docusaurus `^3.10`, `@docusaurus/preset-classic`,
  `@docusaurus/theme-mermaid`, `@easyops-cn/docusaurus-search-local`, React 19, TypeScript `~6.0.3`,
  yarn 4 (`.yarnrc.yml` with `npmMinimalAgeGate: 0`), a port from `~/.dev-ports.json` in 5900-5999, `.env.example`
  only, `.github/workflows/deploy-pages.yml` (`actions/upload-pages-artifact` + `actions/deploy-pages`,
  `permissions: contents read / pages write / id-token write`, `concurrency group pages`), `static/CNAME` =
  `windowsweep-docs.aoneahsan.com`, `docusaurus.config.ts` `url` matching, `baseUrl: '/'`,
  `organizationName: 'aoneahsan'`, `projectName: 'windowsweep-docs'`.
- **Content.** One page per existing `docs/*.md` page (intro from `docs/README.md`, getting-started from
  installation + quick-start, sections, cli-reference, profiles, safety-model, developer-mode,
  admin-and-elevation, reports-and-logs, troubleshooting, faq, about from author), a changelog page fed
  from `CHANGELOG.md`, `title` + `description` front matter on every page, sidebars in that order,
  `llms.txt` and `sitemap.xml` emitted, `docs/MANUAL-TASKS.md` and `docs/story/**` excluded from the docs
  plugin (`exclude` restates the defaults), zero secrets (`git ls-files | grep -iE 'secret|credential|\.npmrc|\.env$'`
  empty).
- **Governance (public repo).** Root `CONTRIBUTING.md`, Issues on, a `main` ruleset with Repository-admin
  bypass and the Pages workflow as the required check, `CLAUDE.md` = `AGENTS.md`, `docs/MANUAL-TASKS.md`
  holding the DNS and Pages rows.
- **Success criteria.** `yarn build` green (it is also the link checker); `find build -iname '*MANUAL*'`
  empty; the Pages deployment succeeds; after the owner's DNS row, `curl -s -o /dev/null -w '%{http_code}'
  https://windowsweep-docs.aoneahsan.com` returns 200 with HTTPS enforced.
- **Write-back (agent, only after the 200 probe).** `package.json` `homepage` -> the docs site; README
  header link row `Docs` and the Documentation table -> the site; `code/projects/project-live-urls.json`
  `docsUrl` (if that registry exists on the machine; else note it); `CLAUDE.md` + `AGENTS.md` Links block;
  GitHub repository homepage (`gh repo edit --homepage`).
- **Owner rows (add to both repos' `docs/MANUAL-TASKS.md`).** Hostinger DNS `CNAME windowsweep-docs ->
  aoneahsan.github.io`; GitHub Settings -> Pages -> custom domain + Enforce HTTPS.
- **Do not.** No Firebase files in a docs repo; no `docs/MANUAL-TASKS.md` in the build; no relative links
  from the package README to the site; do not switch README links before the probe returns 200.

### RW-041 - AI integration guide (agent, 1 h)

- **What.** The fleet's npm-package pattern ships an `AI-INTEGRATION-GUIDE.md` when one exists. For a CLI it
  is short: how an agent runs windowsweep safely (`--scan` and `--dry-run` first, `--json` for the single
  stdout line, exit codes 0/1/2/3, `--no-color --no-report` in automation, what `--yes` covers and never
  covers, no network calls, where logs and reports land, how to read the schema-1 report).
- **Success criteria.** `AI-INTEGRATION-GUIDE.md` at the repo root, added to `files` and to the README link
  row as `AI Guide`, mirrored as a docs-site page; every command in it executed once (dry-run) before the
  release that ships it (1.0.1 or 1.1.0).

## 9. Phase P4 - repository hygiene and the owner's records

### RW-050 - Topics, homepage, wiki, tags, releases (agent 20 min)

- **What.** `gh repo view aoneahsan/windowsweep` shows no topics, no homepage, wiki enabled, no tags, no
  releases (`macleanup` tags its releases; adopt that from now on).
- **To complete.** `gh repo edit aoneahsan/windowsweep --add-topic windows --add-topic cleanup --add-topic
  disk-cleanup --add-topic powershell --add-topic cli --add-topic developer-tools --add-topic npm
  --add-topic cache --enable-wiki=false`; homepage = repository until the docs site probes 200 (RW-040);
  annotated tag `v1.0.0` on `70c6738` (the commit the 1.0.0 tarball was built from) plus a GitHub Release
  with the 1.0.0 changelog entry; from 1.0.1 on, every release tags `vX.Y.Z` and creates the Release in
  the publish session.
- **Success criteria.** `gh api repos/aoneahsan/windowsweep/tags` lists `v1.0.0` (and `v1.0.1` after
  RW-001); `gh release list` shows both; topics visible on the repository page.
- **Do not.** Do not enable Discussions (issues are the single support channel); do not tag `main` HEAD as
  `v1.0.0` (HEAD is not the published tree).

### RW-051 - Portfolio-info file, master links JSON, ORCID (agent 1 h; owner 15 min)

- **What.** Both siblings carry `<NAME>_portfolio-info_<date>.md` at their root, an entry in the master
  links JSON and an ORCID work with a `.bib` file; windowsweep has none (MANUAL-TASKS row 5 asks for the
  owner's passes).
- **To complete (agent).**
  1. Write `packages/WINDOWSWEEP_portfolio-info_<date>.md` in the notebook's
     `projects-info-as-portfolio-item/` tree (identity and distribution table, brand assets from
     `assets/logo/`, feature summary, honest claims only, update-history rows) and a byte-identical copy at
     this repo's root, following `~/.claude/rules-detail/portfolio-and-social.md` rule 3.
  2. Add the windowsweep entry to `PROJECT-LINKS-IDENTIFIERS-CONTACT.json` (main link = the npm page,
     repository, docs URL once live, license MIT, contact email, support URL) for the owner's `ownerReview`.
  3. Write `orcid-project-projects-files/windowsweep.bib`, refresh the combined `aoneahsan-all-works.bib`,
     and add the ORCID block to `CLAUDE.md` + `AGENTS.md` exactly as the siblings carry it (skills
     `aoneahsan-cccs-orcid-profile` + `-bibtex`, agent `aoneahsan-ccca-orcid`); every URL probed live first.
- **Owner.** Review the JSON entry, import the `.bib` into ORCID and retype the work type (MANUAL-TASKS
  rows).
- **Success criteria.** The three records exist with matching facts (version, links, license); the repo copy
  of the portfolio file equals the notebook copy (`cmp`).
- **Do not.** No social content in this repository (the notebook holds it); no invented numbers.

### RW-052 - Folder rename on the build machine (owner, 2 min)

`Rename-Item D:\work\windows-cleanup D:\work\windowsweep` after every session in it is closed
(MANUAL-TASKS row 4). The agent then updates `docs/PROJECT-CONTEXT.md` and the memory note.

### RW-053 - CI tarball sweep covers the planning files (agent, 5 min)

Add `remaining-work.md`, `remaining-work-summary.md`, `what-this-project-consists-of.md` and
`AI-INTEGRATION-GUIDE.md` (allowed) to the forbidden/allowed handling in `.github/workflows/ci.yml:57` so a
future `files` edit cannot ship the planning files. `npm pack --dry-run` today lists 37 files.

### RW-054 - Docs index and README rows for the new root files (done 2026-09-03)

Recorded here for completeness: `README.md` Documentation table and `docs/README.md` Meta table point at
`remaining-work-summary.md`; keep those rows current when the files move or close.

## 10. Phase P5 - 1.1 family-parity features (owner decision 2026-09-03)

Common rules for every item: a new section is a `New-Target` declaration plus an `Invoke-SectionNN`, added to
`WS_SECTIONS` with the next free number (22 onward), a tier, `Admin`, `Batch` and `Dev` flags, a `Get-TargetsNN`
so `--scan`, `--list-targets` and self-test check [6] see it; every path is **verified on a real machine** (the
folder exists for that app and holds only regenerable data) before it becomes a target, and the verification
is written into the item's commit body; every new target passes `--dry-run` review on the owner's machine;
`docs/sections.md`, `docs/cli-reference.md`, `docs/profiles.md`, the README section table and `CHANGELOG.md`
move in the same commit. The phase closes with **1.1.0** (minor: new sections and flags) through the same
gate as RW-001.

### RW-060 - Section 22: global packages audit, read-only (agent, half a session)

- **Mirrors.** `linux-cleanup --globals`.
- **What.** Lists globally installed npm, pnpm, yarn, bun and deno packages with version, install date and a
  staleness verdict, then prints the exact uninstall command per candidate. Never deletes.
- **Where to look (verify each).** npm: `npm root -g` (falls back to `%APPDATA%\npm\node_modules`), plus
  nvm-windows per-version roots `%APPDATA%\nvm\v*\node_modules` when present; pnpm:
  `%LOCALAPPDATA%\pnpm\global\*\node_modules`; yarn v1: `%LOCALAPPDATA%\Yarn\Data\global\node_modules`;
  bun: `%USERPROFILE%\.bun\install\global\node_modules`; deno: `%USERPROFILE%\.deno\bin` (one shim per
  installed script). Reading inside protected roots is allowed; the section declares no deletable target
  (`Get-Targets22` returns `cmd` rows only).
- **Staleness (Windows has no reliable last-invocation signal).** Candidate when the package folder's newest
  timestamp is older than `--days` AND no `package.json` under the section-17 scan roots modified within the
  window names it (dependencies, devDependencies, scripts text) AND it is not one of the always-keep names
  (`npm`, `corepack`, `pnpm`, `yarn`, `windowsweep`). Also flag "shadowed by a local install" when a project
  under the roots has the same bin in `node_modules\.bin`.
- **Acceptance points.** Report format matches the linux-cleanup page (kept / candidate lines, then the
  uninstall commands); `--json` adds nothing; runs in the `audit` profile (`0,21,22`); dry-run and real run
  identical (read-only); self-test [6] green; docs page section written.
- **Do not.** Never uninstall; never enter `node_modules` of a global recursively (read its `package.json`).

### RW-061 - Section 23: orphaned application data, interactive, Recycle Bin (agent, one session)

- **Mirrors.** `macleanup` section 12 (orphaned app-data scan).
- **What.** Folders directly under `%APPDATA%` and `%LOCALAPPDATA%` that belong to no installed program:
  no matching uninstall entry (`HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall`, the
  `WOW6432Node` twin, and the `HKCU` twin; match on `DisplayName`, `Publisher` and `InstallLocation`), no
  matching folder under `Program Files*`, `%LOCALAPPDATA%\Programs` or `WindowsApps`, no running process
  with that name, and not on the exclusion list (Microsoft, Windows, Packages, Programs, Temp, Comms,
  ConnectedDevicesPlatform, D3DSCache, Google, Mozilla, every vendor folder a `Get-TargetsNN` already
  declares, and every protected pattern). Sizes shown; the user multi-selects; selected folders go to the
  Recycle Bin (`Send-ToRecycleBin`, `--permanent` bypasses). Interactive only; `--dry-run` lists.
- **Acceptance points.** On the owner's machine the list contains no folder of an installed program (owner
  review of the first dry-run is the acceptance); a folder named for a running process never appears;
  `--yes` never selects (RW-002 rule); tier `recycle`; batch `interactive`; profile `audit` does not include
  it (it deletes); docs page written with the exclusion list.
- **Do not.** Never treat an empty uninstall list as "everything is orphaned" (fail closed: no registry read
  means no candidates); never touch `Packages\*` (Store apps have their own lifecycle).

### RW-062 - Section 24: installed programs idle N+ days, report-only (agent, half a session)

- **Mirrors.** The report half of `macleanup` section 21 (unused apps).
- **What.** Reads the three uninstall hives (`DisplayName`, `DisplayVersion`, `Publisher`, `InstallDate`
  yyyymmdd, `EstimatedSize` KB, `InstallLocation`, `UninstallString`); idle = days since the newest
  timestamp under `InstallLocation` (skipped when empty); lists programs idle `--days`+ largest first with
  the removal command: `winget uninstall --id <id>` when `winget list --exact` resolves it, else the
  `UninstallString`. Never runs an uninstaller (the recorded non-goal "driver or service changes" and the
  Program Files protection stand).
- **Acceptance points.** Read-only in every mode; runs in `audit`; the report is also written to
  `reports\installed-programs-<stamp>.txt`; Store apps are listed separately from `Get-AppxPackage` with
  `Remove-AppxPackage` hints only for non-system packages; docs written.

### RW-063 - Section 25: startup items audit, report-only (agent, 2 h)

- **Mirrors.** `macleanup` section 25 (launch items), minus removal.
- **What.** One table of everything that starts with the user or the machine: `Run` and `RunOnce` keys
  (HKCU, HKLM, `WOW6432Node`), the two Startup folders (`%APPDATA%\Microsoft\Windows\Start
  Menu\Programs\Startup`, `%ProgramData%\Microsoft\Windows\Start Menu\Programs\Startup`), scheduled tasks
  with a logon trigger, `Win32_StartupCommand`, and the enabled/disabled state from
  `Explorer\StartupApproved`. Section 0 keeps its count line and points here.
- **Acceptance points.** Read-only; report-only; runs in `audit`; the recorded non-goal "startup-item
  management" is unchanged (the tool shows, the user decides in Task Manager); docs written.

### RW-064 - New target rows in sections 8 and 9 (agent, half a session, paths verified first)

| Section | Target | Path (verify on a real machine) | Mode / guard |
|---|---|---|---|
| 8 | Telegram Desktop cache | `%APPDATA%\Telegram Desktop\tdata\user_data\cache` and `...\media_cache` | clear; guard `Telegram` |
| 8 | WhatsApp (Store) cache | the `5319275A.WhatsAppDesktop_*` package's `LocalCache` cache folder (exact leaf to verify) | clear; guard `WhatsApp` |
| 8 | Microsoft Office file cache | `%LOCALAPPDATA%\Microsoft\Office\16.0\OfficeFileCache` | prune idle only; guards `WINWORD`, `EXCEL`, `POWERPNT`, `OUTLOOK`, `ONENOTE` (unsynced changes live here; never clear) |
| 8 | Steam shader cache | `steamapps\shadercache` in every library folder listed in `<Steam>\steamapps\libraryfolders.vdf` | clear; guard `steam` |
| 8 | WebView2 per-app caches | `%LOCALAPPDATA%\*\EBWebView\Default` handled as `chromium` kind (cache leaves only) | layout kind; guard the host app when known |
| 9 | Microsoft Store cache | `wsreset.exe` as a `cmd` target run through `Invoke-External -Destructive` | dry-run prints, real run executes |

- **Acceptance points.** Each path verified present on a machine with the app installed (commit body names
  the machine and the observed size); the layout-kind allowlist in `lib/actions.ps1` unchanged unless a new
  leaf is needed (then self-test proves the second guard still refuses non-cache leaves); dry-run reviewed.

### RW-065 - New target rows in section 1 (agent, 2 h, paths verified first)

| Target | Path or command | Mode |
|---|---|---|
| Hugging Face hub cache | `%USERPROFILE%\.cache\huggingface\hub` | prune, dev-gated (models are 1-20 GB each; keep-newest per model folder) |
| PyTorch hub cache | `%USERPROFILE%\.cache\torch` | prune, dev-gated |
| conda package cache | `conda clean --all --yes` through `Invoke-External -Destructive` when `conda` is present | tool-native, dev-gated |
| Chocolatey | `%TEMP%\chocolatey` (already covered by section 10 - document, no new row) and `C:\ProgramData\chocolatey\lib-bad` (admin, section 12 row) | clear |
| winget | installers land in `%TEMP%\WinGet` - already covered by section 10; document, no new row | - |
| Expo / Metro | `%USERPROFILE%\.expo` holds state, not cache - do not add; Metro's cache is under Temp - already covered | - |

- **Acceptance points.** `$U\.cache\claude*`, `codex*`, `gemini*`, `copilot*` stay protected
  (`lib/safety.ps1:59`); the two `.cache` targets are explicitly allowed by self-test [5]; dry-run reviewed.

### RW-066 - Section 26: driver and upgrade installer leftovers, admin, opt-in (agent, 2 h)

- **What.** Folders installers leave on the system drive and never remove: `C:\NVIDIA` (driver extraction),
  `C:\ProgramData\NVIDIA Corporation\Downloader` (GeForce Experience downloads), `C:\AMD`, `C:\Intel`,
  `C:\ESD` (feature-upgrade payload, safe once the upgrade completed). All regenerable; all admin-owned.
- **Acceptance points.** `Admin = $true`, `Batch = 'optin'`, tier `rebuilds`; `--scan` shows sizes
  unelevated (read access is enough); the folders are outside every protected root (self-test [6]);
  `C:\$WinREAgent`, `C:\Windows.old` and `Windows\Installer` are explicitly NOT targets (Windows.old goes
  through section 13's "Previous Installations" handler; the others are protected by design); docs written.

### RW-067 - Section 17 artefact list additions (agent, 30 min)

Add `.nx`, `.mypy_cache`, `.ruff_cache`, `.tox`, `.eggs`, `.output`, `.serverless` to `WS_ARTEFACT_DIRS`
(`modules/projects.ps1:3`); add `.cache` only when the same folder holds a project marker (Gatsby, Parcel).
Do not add `.venv`/`venv` (users do not expect an environment to vanish) or `.terraform` (holds provider
binaries and lock state). Update `docs/sections.md` section 17 and the README row.

### RW-068 - `--notify`: a Windows toast when a run ends (agent, 2 h)

- **Mirrors.** `macleanup --notify`.
- **What.** After the session summary, show "windowsweep freed X in Y sections" (or the dry-run estimate).
  Windows PowerShell 5.1: WinRT `Windows.UI.Notifications.ToastNotificationManager` with the PowerShell
  AppUserModelId; PowerShell 7 (no WinRT projection by default): a `System.Windows.Forms.NotifyIcon`
  balloon; both wrapped in try/catch so a notification failure never changes the exit code. Off by default;
  `--install-task` adds it to the task action so the Sunday run reports itself.
- **Acceptance points.** Toast seen once on 5.1 and balloon once on pwsh (owner confirms); `--json` output
  unchanged; `--quiet` still notifies (it is the point of the flag); no network; documented in
  `docs/cli-reference.md` and the README options table.

### RW-071 - `--select L` and `--select-file P`: scripted selection for the interactive sections (agent, 2 h)

- **What.** The interactive sections (17, 18, 19 and 23 when it lands) can only be driven by a person typing
  indexes. A GUI, and any script, needs a way to pass the selection in. `--select L` queues index lists
  consumed once per interactive prompt in the order the prompts appear; `--select-file P` reads a UTF-8 file
  of one full path per line, matched case-insensitively against the candidate paths that prompt is offering
  (`Read-MultiSelect -Candidates $paths`), warning about every line that matches nothing.
- **Why.** It is the prerequisite that lets the desktop app list candidates with `--dry-run --only 17 --json`
  and then remove exactly the user's picks. Without it a GUI would have to re-implement the finders.
- **Success criteria.** Either flag lifts the batch refusal for interactive sections, because a person did
  choose - the refusal exists to stop unattended deletion, not scripted deletion. Neither flag makes `--yes`
  select anything (RW-002 stands).
- **Acceptance points.** Self-test: `--select 1,3` against 5 candidates returns `1,3`; a `--select-file` with
  one matching and one bogus path returns one index and warns once. Documented in `docs/cli-reference.md`
  under "Scripting the interactive sections", in `docs/sections.md`, `docs/safety-model.md` and the AI guide.

### RW-072 - `--json` additions and `--list --json` (agent, 2 h)

- **What.** In `--json` mode the interactive sections collect `candidates[]`
  (`section`, `index`, `path`, `bytes`, `idle_days`, `project`), scan mode emits `targets[]`
  (`section`, `label`, `path`, `bytes`), and every section brackets itself on stderr with
  `##windowsweep section=NN event=start|end status=<status> freed_bytes=<n>` so a caller can show progress.
  `--list --json` prints the catalogue: `sections[]` (id, key, title, tier, admin, batch, dev), `safe_batch`,
  `safe_batch_admin`, `profiles`, `walkthrough`.
- **Why.** The same GUI prerequisite as RW-071: a front end reads the catalogue rather than hard-coding it,
  and shows progress from the machine channel rather than parsing the human log.
- **Acceptance points.** The self-test parses each shape; the progress lines appear only in `--json` mode, so
  the human log is unchanged; `bin/windowsweep.js` passes the flags through untouched.


### RW-069 - Sibling features deliberately not adopted (record, no work)

| Sibling feature | Why not |
|---|---|
| `linux-cleanup --tui` (whiptail/dialog) | no dependency-free Windows equivalent; the menu covers it |
| `linux-cleanup --doctor` (shell-init repair) | Linux-specific; Windows PATH repair is out of scope |
| `macleanup --check-update` | contradicts the no-network design, which the README advertises |
| `macleanup` System Restore-style permanent sections (Time Machine snapshots) | Windows restore points are a recovery mechanism; deleting them is out of scope |
| `macleanup` section 27 (font/QuickLook caches) | the Windows font cache is a system service store; clearing it is a repair step, not cleanup |

## 11. Phase P6 - Windows desktop app (decided 2026-09-03; not counted toward CLI completion)

The owner opened this phase on 2026-09-03 and settled its three open questions. The decisions are recorded
verbatim in `docs/PROJECT-CONTEXT.md` ("Session 3 decisions"); this section is the specification derived from
them. The execution plan is `C:/Users/PC/.claude/plans/please-plan-and-get-agile-fairy.md` section 8.

### RW-070 - The decided scope

| Question | Decision |
|---|---|
| Account model | **Optional Google sign-in, for sync only.** The account stores the user's email, their settings and their run history, and restores settings on sign-in. **Runs are never gated**, there is no paid tier and no plan set - an explicit owner exemption from the fleet plan-set rule |
| Telemetry | **Full fleet observability** - GA4, Amplitude, Clarity and Sentry - behind a first-run consent dialog with every provider off until accepted. The CLI keeps its zero-network promise; the desktop app discloses what it sends in its README, the docs site and the root README |
| Location | `desktop/` in this repository (the macleanup pattern), excluded from the npm `files` allowlist and asserted absent by CI |
| Identity | Identifier `com.aoneahsan.windowsweep` (permanent once released); product name `windowsweep`; the app version equals the CLI version it bundles |
| Releases | Tag `desktop-vX.Y.Z`, built by `tauri-action`, NSIS + MSI + `.sig` + `latest.json` on a GitHub Release; the in-app updater reads that manifest |
| Admin surface | The Firebase console for this phase (Authentication -> Users, Firestore). A web admin panel is a later, separate phase - a recorded deviation from the platform-admin rule |
| Toolchain | 🔴 **No download happens on this machine until the owner gives the go-ahead** (`PENDING-TASKS.md` TASK-001, `docs/MANUAL-TASKS.md` row 14). CI compiles the Rust core meanwhile |

### The two sub-phases

- **P6-A (no downloads).** The design argument and a static click dummy of every screen for the owner to
  react to; the Firebase project, its Google provider, Firestore rules and indexes, and the FilesHub vault
  entries; the `desktop/` application written in full and compiled by CI (`desktop-ci.yml`); the records.
  The CLI prerequisites RW-071 and RW-072 ship first, in 1.1.0.
- **P6-B (after the go-ahead).** rustup and the C++ Build Tools, `yarn install` for both trees, the lockfiles
  committed, the local gates, run-to-verify over the app's own WebView2, the updater keypair into
  `~/.secrets/tauri/` and the repository Actions secrets, and the first `desktop-v` release.

### Do not

- Do not reimplement any cleanup logic in the desktop app: it runs the bundled `windowsweep.ps1` with
  `--json --no-color` and nothing else.
- Do not gate a run behind sign-in, add a paid tier, or add a plan set to this app without a new owner
  decision.
- Do not enable any telemetry provider before the consent dialog is accepted, and never send a filesystem
  path, host name or user name in a synced run summary.
- Do not download a toolchain or a dependency tree before the owner's go-ahead.


## 12. What "100%" looks like at the end

- Every P0-P5 sub-task in `docs/features/windowsweep-completion/00-tracker.json` is `complete`, each with a
  commit SHA in `runHistory`, and every owner row is ticked in `docs/MANUAL-TASKS.md`.
- `npm view windowsweep version` equals `VERSION` on `main`; `git tag` lists `v1.0.0`, `v1.0.1`, `v1.1.0`
  with GitHub Releases; the ruleset is unchanged.
- `windowsweep-docs.aoneahsan.com` answers 200 with HTTPS and is the `homepage` in `package.json` and the
  `Docs` link in the README.
- The self-test prints about 120 checks green on Windows PowerShell 5.1 and PowerShell 7 in CI.
- `docs/PROJECT-CONTEXT.md` "Verified runs" records the elevated run, the Windows 11 run, the Scheduled
  Task run and the sections 4/5/7/8/17-19 runs; "Open material unknowns" lists only the desktop-app
  account-model decision.
- The portfolio-info file, the master links JSON entry and the ORCID work exist and agree.
- README, `docs/sections.md`, `docs/cli-reference.md`, `docs/profiles.md` and `lib/constants.ps1` describe
  the same 27 sections (0-26), the same flags and the same tiers.

## 13. Effort estimate

| Phase | Agent effort (sessions of 3-4 h) | Owner effort |
|---|---|---|
| P0 release sync + defects | 1 | - |
| P1 verification | 0.5 (fold in the findings) | about 2-3 h at the keyboard |
| P2 self-test coverage | 0.5 | - |
| P3 docs site + AI guide | 1 | 15 min (DNS + Pages) |
| P4 hygiene + records | 0.5 | 15 min (JSON review, ORCID import) |
| P5 1.1 features | 3-4 | dry-run reviews, about 1 h |
| **Total P0-P5** | **6.5-7.5 sessions** | **about 4 h** |
| P6 desktop app (separate) | 3-8 | the account-model decision |
