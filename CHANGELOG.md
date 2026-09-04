# Changelog

All notable changes to `windowsweep` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [1.1.0] - 2026-09-04

### Added

- **Section 22 - global packages audit.** Lists what npm, pnpm, yarn, bun and deno installed globally with
  size and idle days, flags the ones no recent project references, and prints the exact uninstall command.
  It never uninstalls anything and declares no deletable target: several of those roots are protected paths.
- **Section 23 - orphaned application data.** Top-level folders under `%APPDATA%` and `%LOCALAPPDATA%` that
  no installed program, Store package or running process claims and that nothing has touched for `--days`+
  days. Interactive, Recycle Bin, and it **fails closed** - an unreadable uninstall registry produces zero
  candidates rather than treating everything as orphaned. Every vendor folder another section already cleans
  is excluded automatically, derived from the declared target list so the exclusions cannot drift.
- **Section 24 - installed programs not modified for N+ days.** Report only, largest first, with
  `winget uninstall --id` when one `winget list` call resolves the program and its own `UninstallString`
  otherwise; Store apps listed separately. It never runs an uninstaller.
- **Section 25 - startup items audit.** Run and RunOnce keys, both Startup folders, logon-triggered scheduled
  tasks and `Win32_StartupCommand` in one table with each item's enabled state. It changes nothing.
- **`--select L` and `--select-file P`.** Answer an interactive section's selection in advance, by index or
  by full path. Either flag lets sections 17, 18, 19 and 23 run unattended - a person did choose - and the
  selection answers that section's final confirmation. `--yes` alone still selects nothing.
- **`--notify`.** A Windows notification when a run ends: a real toast on Windows PowerShell 5.1, a tray
  balloon on PowerShell 7. It never changes the exit code and never writes to stdout. `--install-task` adds
  it to the weekly task, so the Sunday run reports itself.
- **`--json` additions.** `candidates[]` (what an interactive section offered) and `targets[]` (what scan
  mode measured), both always present so a caller can rely on the shape, plus per-section progress lines on
  stderr: `##windowsweep section=NN event=start|end status=<status> freed_bytes=<n>`.
- **`--list --json`** prints the section catalogue - sections, tiers, batch policy, the safe batch, the
  profiles and the walkthrough order - so a front end reads it instead of hard-coding it.
- Section 1 gained the Hugging Face model cache (`~\.cache\huggingface\hub`, pruned by the idle gate,
  developer-gated). Section 9 lists `wsreset.exe` as the Microsoft Store cache lever and offers it as a next
  step rather than running it: `wsreset` has no silent mode and always opens the Store.
- Section 17 recognises `.nx`, `.mypy_cache`, `.ruff_cache`, `.tox`, `.eggs`, `.output` and `.serverless`,
  and treats `.cache` as an artefact only when a Gatsby or Parcel config sits beside it. `.venv`, `venv` and
  `.terraform` are deliberately still excluded.
- `docs/sections.md` records the candidate targets that are researched but **not** shipped because the
  software is not installed on the build machine, and why `C:\Intel` was inspected and rejected.

### Fixed

- `Get-OrphanExclusions` returned its exclusion set as an unrolled array, whose `.Contains` is
  case-sensitive, so a folder named `slack` would have slipped past the `Slack` entry. Found by a new check
  before the section shipped.
- Section 24's idle measurement used the newest of write, access and creation time. Last-access is live on
  many systems, so every install folder read as touched today and the section could never report anything;
  it now reads last-write only, which is what "not modified" means.

### Changed

- The target table is collected from the section catalogue instead of a literal `0..21` range, so a new
  section is reachable by `--scan`, `--list-targets` and the safety checks the moment it is declared. The
  menu's prompt range is derived the same way.
- Profile `audit` is now `0, 21, 22, 24, 25`. The three new report sections are read-only and safe, but stay
  out of `--all` so a cleanup run remains a cleanup run.
- Self-test: 27 more checks (151 total) cover the catalogue, section 23's fail-closed gate and derived
  exclusions, section 22 declaring nothing deletable, the scripted-selection flags, the `--json` and
  catalogue shapes, the progress-line format, the global-package verdict, the startup-state rule and the
  artefact list. Each was proved red against a planted defect before it was kept.
- Self-test: ten more checks cover the argument parser, section lists, docker size text, the layout-guard leaf
  test, the `--json` shape, superseded versions, the Chromium layout, workspace storage, stale artefacts and
  the report exporters. `Test-KnownCacheLeaf` and `Get-JsonSummary` were split out of `Invoke-TargetList` and
  `Write-JsonSummary` so the logic can be exercised directly; no behaviour changed.
- `AI-INTEGRATION-GUIDE.md` ships in the npm package and is mirrored on the documentation site: the contract
  an agent or a script relies on - the safe command sequence, what `--yes` never covers, exit codes, the
  `--json` line, output paths and the guarantees.
- A documentation site at `windowsweep-docs.aoneahsan.com` (Docusaurus on GitHub Pages), mirroring `docs/`.

## [1.0.1] - 2026-09-03

### Fixed

- **Sections 17, 18 and 19 no longer pre-select every item under `--yes`.** In the walkthrough and the menu
  with auto-yes on, section 17 could remove every listed build artefact without a person choosing one, and
  18/19 pre-selected everything before their final question. The selection prompt now appears even with
  `--yes`, defaults to none, and section 17's final confirmation is never auto-answered. Batch mode already
  refused these sections and is unchanged. (RW-002)
- Section 19's title no longer names Desktop; only Downloads is scanned. (RW-003)
- Sections 18 and 19 report the tier `recycle` instead of `permanent` in `--list`. (RW-004)
- `--purge-all` from a console asks you to type `purge` once per run, as documented; `--yes` remains the
  confirmation in batch runs. (RW-005)
- A running editor's VSIX download cache is cleared as documented: it is its own target without the
  running-editor guard. (RW-006)
- `--install-task` and `--install-alias` refuse to run under `npx` (exit 3) and print the global-install
  steps; the npx cache is evicted and the task or alias would break later. (RW-007)
- The engine exits 130 when a run is interrupted before it finished; previously only the Node launcher
  did. (RW-008)
- `--uninstall-data` always asks; `--yes` no longer removes your history unattended. (RW-010)

### Changed

- Internal rename `Write-Log` -> `Write-LogLine` (18 call sites) so PSScriptAnalyzer's
  `PSAvoidOverwritingBuiltInCmdlets` passes under PowerShell 7 in CI. No behaviour change.
- Self-test: four new checks prove the `--yes` asymmetry at the helper and at the section 17/18/19 call sites,
  and that every picker call in `modules/` carries `-NoAutoYes` (114 checks).
- Keywords trimmed to twelve (`temp-files` dropped). (RW-011)

## [1.0.0] - 2026-09-03

First release. The Windows member of the cleanup family beside
[linux-cleanup](https://github.com/aoneahsan/linux-cleanup) and
[macleanup](https://github.com/aoneahsan/macleanup).

### Added

- **22 numbered sections** (0-21): package-manager caches, build-tool caches, test-runner browsers, Android
  emulators, Docker, editor caches, browser caches, desktop-app caches, Windows user caches, user temp, Recycle
  Bin, Windows Update cache, the Disk Cleanup engine, DISM component-store cleanup, the hibernation file, event
  logs, stale project build artefacts, partial downloads, large stale personal files, disk-image compaction and
  a disk-usage report. Section numbers are a public contract from this release on.
- **Developer mode.** The first interactive run asks whether you are a developer. Yes means package, build and
  test-runner caches are pruned only when idle 100+ days and the newest version of every versioned tool cache
  is kept; no means those caches are cleared completely. The answer is saved and can be re-asked with
  `--forget-developer`.
- **A dry-run that writes nothing** (`--dry-run`), a read-only scan (`--scan`) and `--list-targets`.
- **One deletion chokepoint** that refuses drive roots, Windows, Program Files, the profile root, personal
  folders, credentials, toolchains and browser/editor state, asserts every deletion lies inside its declared
  target root, never follows junctions or symlinks, handles paths longer than 260 characters and skips files
  another program has open.
- **Batch policy.** `--all` runs the safe batch only; deep sections (11, 15, 16, 20) need
  `--i-understand-deep`; personal sections (17, 18, 19) never run unattended and use the Recycle Bin.
- **Admin awareness.** Admin sections skip with the exact command when not elevated; `--elevate` relaunches
  through a UAC prompt.
- **Session reports** as schema-versioned JSON with Markdown and HTML export, a reports manager, run history
  (`--stats`), history pruning and `--json` for scripting.
- **Weekly Scheduled Task** (`--install-task`) and a PowerShell profile alias (`--install-alias`).
- **Self-test** (`--self-test`): script syntax, ASCII-only source, the protection lists, a real junction
  fixture, the dry-run guarantee, keep-newest, long paths and the extension-leftover rule.
- **Crash bundles** written locally on unexpected exit; `--debug-bundle` and `--report-issue` for bug reports.
  Nothing is ever transmitted.
- Node launcher for `npx windowsweep`, a `.cmd` launcher for machines without Node, and a `ci` workflow that
  runs the self-test and a dry-run on both Windows PowerShell 5.1 and PowerShell 7.
