# Changelog

All notable changes to `windowsweep` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

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
