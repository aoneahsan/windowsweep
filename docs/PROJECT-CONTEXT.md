# Project Context - windowsweep

Last Updated: 2026-09-03
Verified Against: commit 84c732f on `main`, 2026-09-03 (1.0.0 released the same day; full audit the same day)

## Identity and outcome
- Purpose: safe, developer-aware disk and cache cleanup CLI for Windows; the Windows member of the family with
  `linux-cleanup` (Bash) and `macleanup` (Bash).
- Primary users: developers and power users on Windows 10/11 who want to see and control every deletion.
- Current status: **1.0.1 released** (2026-09-03) - it carries the internal `Write-LogLine` rename plus every
  P0 fix (RW-002 to RW-011). The self-test runs 114 checks. The docs site and the 1.1 feature set are the open
  work; `remaining-work.md` holds the specification and the tracker holds the status.
- Distribution: `npx windowsweep`, `npm install -g windowsweep`, or a clone run through `windowsweep.cmd`.
  No other channel (owner decision 2026-09-03).
- What is open, with evidence and acceptance criteria: `remaining-work.md` (root); status:
  `docs/features/windowsweep-completion/00-tracker.json`.

## Chosen architecture
- Runtime: Windows PowerShell 5.1-compatible scripts (also run on PowerShell 7), dot-sourced `lib/` + `modules/`,
  flags parsed from `$args` (no `param()` on the entry so GNU-style flags survive `-File`).
- Launcher: `bin/windowsweep.js` (Node >=14, zero dependencies) spawns `powershell.exe -ExecutionPolicy Bypass`;
  `windowsweep.cmd` does the same without Node. Both pass version/launcher facts via `WINDOWSWEEP_*` env vars.
- State: `%USERPROFILE%\.windowsweep\{logs,reports,feedback,config.json}`; JSON report schema 1; MD/HTML export
  built in (no jq).
- Deployment: GitHub (`main`, remote `o`) + npm; CI job `ci` on `windows-latest` runs self-test + dry-run on both
  hosts, PSScriptAnalyzer, and a tarball allowlist sweep.
- Deliberate stack deviations: no TypeScript, no yarn build, no Vitest; the gate is `--self-test` (fixture-based)
  plus `--dry-run`. Source is ASCII-only because PowerShell 5.1 reads BOM-less UTF-8 as ANSI.

## Durable owner decisions
- Name `windowsweep` (windows + sweep sharing the s, the macleanup construction); chosen 2026-09-03 after two
  rounds of candidates; verified free on npm (incl. `window-sweep`) and unclaimed by any real product.
- npm publish of 1.0.0 approved by the owner on 2026-09-03 "to secure the spot"; token comes from the FilesHub
  developer-accounts vault (`aoneahsan-npm-pat`), never stored in the repo.
- Author block carries name, site, GitHub, LinkedIn and the public email only; no phone number (2026-09-03).
- Section numbers 0-21 are frozen from 1.0.0; a retired section stays as a no-op; new sections start at 22.
- Developer mode semantics (owner requirement): developer = idle gate (100 days) + keep-newest on sections 1-5;
  non-developer = clear those caches. Non-interactive with no saved answer defaults to developer on.
- Idle age = newest of write/access/creation time, because Windows disables last-access updates on most
  volumes; the rule may only make files look fresher (conservative). Accepted trade-off 2026-09-03.
- Personal sections (17, 18, 19) are interactive-only and use the Recycle Bin; Downloads is the only personal
  root scanned; Desktop stays a protected root. `--yes` never selects items in them (RW-002 restores this).
- Prefetch, `Windows\Installer`, WinSxS (except via DISM), NTUSER/UsrClass, hiberfil (except via powercfg) are
  never touched by design.
- On the owner's machine (2026-09-03): hibernation to be disabled fully (`--hiberfil off`) in the admin step;
  the real run in the build session covered the safe batch in developer mode only.
- The repo folder on the build machine stays `D:\work\windows-cleanup` until the owner renames it
  (renaming the working directory mid-session breaks the session).
- **Scope of "feature-complete" (2026-09-03):** the 1.0 catalogue plus the family-parity features shipped as
  1.1 - a read-only globals audit (22), an orphaned-AppData scan (23), an installed-programs idle report (24),
  a startup-items audit (25), driver/upgrade installer leftovers (26, admin), new target rows in sections 1, 8
  and 9, and a `--notify` toast. Sibling features deliberately not adopted: TUI, doctor, check-update, restore
  points, font caches (`remaining-work.md` RW-069).
- **Docs site (2026-09-03):** in scope - `aoneahsan/windowsweep-docs` at `windowsweep-docs.aoneahsan.com`,
  Docusaurus on GitHub Pages like the two siblings. The DNS record and the Pages domain are owner rows.
- **Desktop app (2026-09-03):** a later, separate phase (P6): a Tauri wrapper that runs this same script and
  reimplements no cleanup logic, like `macleanup/desktop`. Not counted toward CLI completion. Its account model
  (free local GUI vs sign-in with plans) is decided when the phase opens.
- **Releases (2026-09-03):** every release from 1.0.1 on gets an annotated tag `vX.Y.Z` and a GitHub Release;
  `v1.0.0` is tagged retroactively on `70c6738`, the commit the published tarball was built from.

### Session 3 decisions (2026-09-03) - the desktop app, downloads and telemetry

Recorded verbatim; they govern phase P6 and every session until the owner changes them.

- **Desktop account model.** *"implement auth, just so we can have user emails info, provide ability to store
  run results and settig etc and revert setting state when logged in, so actual features, but keep runs free,
  so they get best value"* -> the desktop app gets **optional Google sign-in for sync**: the account stores the
  user's email, settings and run history and restores settings on sign-in. **Runs are never gated, there is no
  paid tier and no plan set for this app** - an explicit owner exemption from the fleet plan-set rule, revisited
  only when he says so.
- **Toolchain downloads.** *"add that as pending task, i will ask you to download all that you need, and when i
  does, then please download and setup that part, for now do not download on this net please"* -> no toolchain
  or dependency-tree download happens on this machine until he gives the go-ahead: `PENDING-TASKS.md` TASK-001
  and `docs/MANUAL-TASKS.md` row 14. CI does every install and build that needs a dependency tree meanwhile.
- **Desktop telemetry.** Full fleet observability (GA4, Amplitude, Clarity and Sentry) in the desktop app,
  behind a first-run consent dialog with every provider off until accepted. **The CLI keeps its zero-network
  promise unchanged**; the desktop README, the docs site and the README disclose what the app sends.
- **Model workflow.** Fable 5.1 plans and reviews; Opus 5 executes the saved plan without re-planning. The
  Session 1 plan is `C:/Users/PC/.claude/plans/please-plan-and-get-agile-fairy.md`.

Derived from those decisions by the agent, under the standing rules:

- The desktop app lives in `desktop/` of this repository (the macleanup pattern), releases as `desktop-vX.Y.Z`
  with a `latest.json` updater manifest, carries the permanent identifier `com.aoneahsan.windowsweep`, and its
  version equals the CLI version it bundles.
- The admin surface for user emails is the Firebase console for this phase; a web admin panel is a later,
  separate phase. This is a recorded deviation from the fleet platform-admin rule.
- Registered palette: **primary hue 128 (lime)**, light accent `#4d7c0f`, dark accent `#a3e635` with dark
  on-accent text. The registry had no free 25-degree arc; 128 is 24 degrees from taxease (104) and wakalat
  (152), the widest gap available. Success moves to hue 158 so brand and success stay distinguishable. The logo
  mark keeps its sky-blue gradient. Free treatments: `sky` (231) and `plum` (320).
- Registered ports: 5972 (docs site start), 5973 (docs site serve), 5974 (desktop Vite dev URL).

## Constraints and non-goals
- Must: honour `--dry-run` in every destructive helper and external command; route every deletion through
  `Remove-PathSafe` / `Send-ToRecycleBin` with a declared `-Within` root; keep every file under 500 lines;
  keep source ASCII-only; make no network calls; ship only the `files` allowlist.
- Must not: add dependencies; follow reparse points; delete inside a protected root under any flag; auto-run
  deep or interactive sections in batch mode; store credentials or machine-specific paths in the repo.
- Explicitly out of scope for the CLI: registry cleaning, changing startup items (section 25 only reports),
  driver or service changes (section 26 removes installer leftovers, never drivers), undo for caches, running
  an uninstaller (section 24 only reports). A GUI is not part of the CLI; the desktop app is phase P6.

## Key paths and contracts
- `lib/safety.ps1` - the chokepoint and the protected lists; every change here is a safety change.
- `lib/constants.ps1` - section catalogue, profiles, safe batch, version fallback (must equal `package.json` and `VERSION`).
- `lib/actions.ps1` - `New-Target` rows + `Invoke-TargetList`; the cache-folder name allowlist for layout kinds.
- `modules/release_helpers.ps1` - the self-test (108 checks incl. junction, dry-run, keep-newest, extension fixtures).
- `docs/sections.md`, `docs/cli-reference.md`, README section table - must agree with the catalogue.

## Verification
- Standard gates: `node bin/windowsweep.js --self-test --no-color` (exit 0), `npm run version:check`,
  `npm pack --dry-run` shows only the allowlist, `Invoke-ScriptAnalyzer -Recurse -Settings PSScriptAnalyzerSettings.psd1`
  (0 findings).
- Runtime verification: `--dry-run --all --yes --developer` reviewed section by section before any real run;
  CI repeats self-test + dry-run on Windows PowerShell 5.1 and PowerShell 7.
- Gate proof (2026-09-03): two planted defects of different shapes each turned `--self-test` red (exit 1) -
  a protected path declared as a section 9 target (check [6]) and an unclosed function in a module (check [3]);
  both removed, files byte-identical, 108/108 again.
- CI history: the first three runs on `main` failed on PSScriptAnalyzer under PowerShell 7
  (`PSAvoidOverwritingBuiltInCmdlets` lists `Write-Log` for the core target); `84c732f` renamed the function
  and run 33739406904 succeeded. Windows Server (`windows-latest`) is therefore dry-run-tested on every push.
- Audit (2026-09-03, `what-this-project-consists-of.md`): every documented promise checked against the code.
  Findings, all recorded in `remaining-work.md` P0 and none fixed yet: `--yes` pre-selects every item of
  sections 17-19 in the walkthrough and menu and section 17 then deletes without a human choice (RW-002, HIGH);
  section 19's title names Desktop (RW-003); sections 18/19 print the tier "permanent" (RW-004);
  `--purge-all` is documented as asking once more (RW-005); a running editor's VSIX cache is documented as
  cleared but is guarded (RW-006); `--install-task`/`--install-alias` under npx register the evictable npx-cache
  path (RW-007); exit code 130 comes only from the Node launcher (RW-008); `--uninstall-data --yes` asks
  nothing (RW-010); 13 keywords (RW-011).

## Verified runs

### 2026-09-03 - safe batch, developer mode, not elevated (build machine, Windows 10 Pro for Workstations 19045)
- Drive C: free space 2,033,340,416 -> 25,746,153,472 bytes (+22.08 GB); the run's own report counted
  21,319,077,118 bytes in 11m 31s over 11 sections, plus about 1.5 GB removed by an interrupted first pass.
- Per section: 1 package caches 12.16 GB (yarn v1 alone 10.8 GB in 340,734 files idle 100+ days), 6 editors
  4.30 GB (incl. two uninstalled `openai.chatgpt` extension leftovers, 1.95 GB), 10 user temp 3.35 GB, 8 apps
  0.92 GB, 7 browsers 0.46 GB (Edge + Brave), 9 Windows caches 87 MB, 2 build tools 40 MB, 3 and 21 nothing.
- Skipped by design and left to the owner: Chrome (open), Slack and Granola (open), Docker (daemon not running),
  every admin section (not elevated), hibernation (15.9 GB, admin) - rows in `docs/MANUAL-TASKS.md`.
- Protected spot-check before/after: `.ssh` (4 files, newest mtime), Documents (90 files, newest mtime),
  Desktop, AVDs (2), Gradle wrapper dists (2), Android SDK, installed VS Code extensions (16) all unchanged;
  extension folders went 18 -> 16, exactly the two leftovers.
- The first real pass exposed a hot-path defect: the per-file protection check cost 10.6 ms (path resolution
  for ~70 subtrees plus 50 wildcard compiles per call), so 400k yarn files would have taken over four hours.
  The pass was stopped (every deletion is atomic), `Get-ProtectionReason` was rewritten over pre-normalized
  prefixes and precompiled `WildcardPattern` objects (0.58 ms/call, identical verdicts on 35 probe paths,
  self-test guards green), and the run restarted. Keep the guard table-driven; never reintroduce per-call
  path resolution there.

### Not yet run for real (P1 in `remaining-work.md`)
Sections 12-16 and 20 (elevation), `--elevate` itself, section 4 (no idle AVD), 5 (daemon off), 7 for Chrome,
8 for Slack and Granola, 17-19 (interactive), the weekly Scheduled Task, any Windows 11 machine, the `--pwsh`
path on a machine with PowerShell 7. Record each here with numbers when it happens.

## Release record
- 2026-09-03: `ac72188` (first commit, 72 files) and `70c6738` pushed to `main`; repo created public with
  `gh repo create`, Issues enabled, ruleset 22181256 "Protect main (PR + approval; owner bypass)" active
  (deletion, non-fast-forward, PR with 1 approval, required check `ci`; bypass = Repository admin). Direct
  owner pushes report `Bypassed rule violations for refs/heads/main` - expected, never `--force`/`--admin`.
- 2026-09-03T09:15:18Z: `windowsweep@1.0.0` published to npm by `aoneahsan` (37 files, 263,214 bytes
  unpacked; built from `70c6738`); verified with `npm view` and `npx -y windowsweep@1.0.0 --version` from a
  fresh cache.
- 2026-09-03: `5109557` (tracker close-out, real-run and publish records, WH001) and `84c732f` (the
  `Write-LogLine` rename that made CI green) pushed to `main`; not yet on npm.
- Verify a published version from a directory OUTSIDE this repo: inside it, npx resolves the same-named local
  package and reports `'windowsweep' is not recognized` (`docs/troubleshooting.md`).
- GitHub state after the audit: no topics, no homepage, wiki enabled, no tags, no Releases (RW-050).

## Open material unknowns
- None for the CLI. The desktop app's account model (free local GUI vs sign-in with plans and an admin
  panel) is decided when phase P6 opens.
