# What windowsweep consists of

Last Updated: 2026-09-03 (audit of `main` at `84c732f`; npm `windowsweep@1.0.0`)

This file answers one question for the owner: does the agent understand every part of this project? Every
statement below was checked against the tree, the npm registry or GitHub on 2026-09-03; the commands used
are listed at the end. What is missing or planned lives in `remaining-work.md`; the one-page view is
`remaining-work-summary.md`.

## 1. Identity

| | |
|---|---|
| Name | **windowsweep** - safe-by-default Windows cleanup CLI, developer-aware, dry-run first, zero install via npx |
| Kind | a command-line tool: a Windows PowerShell 5.1 engine behind a dependency-free Node launcher |
| Family | the Windows member beside [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) (Bash) and [macleanup](https://github.com/aoneahsan/macleanup) (Bash); same stance: name every path before touching it, prune idle files instead of wiping, refuse personal folders, real dry-run, no network calls |
| Repository | public `aoneahsan/windowsweep`, branch `main`, remote `o`, MIT, 4 commits (`ac72188`, `70c6738`, `5109557`, `84c732f`) |
| Package | `windowsweep@1.0.0` on npm, published 2026-09-03T09:15:18Z by `aoneahsan`, 37 files, 263,214 bytes unpacked, `os: ["win32"]`, `engines.node >=14`, no dependencies of any kind |
| Local folder | `D:\work\windows-cleanup` on the build machine (rename to `windowsweep` is an owner row) |
| Users | developers and power users on Windows 10 (1809+) and Windows 11 who want to see and control every deletion |
| Owner | Ahsan Mahmood - aoneahsan.com, GitHub and LinkedIn `aoneahsan`, aoneahsan@gmail.com (no phone number anywhere, by decision) |

## 2. Architecture

```text
bin/windowsweep.js      Node launcher (83 lines): win32 guard, finds windowsweep.ps1, spawns powershell.exe
                        -NoProfile -NoLogo -ExecutionPolicy Bypass -File, passes WINDOWSWEEP_VERSION /
                        _LAUNCHER / _NPX, forwards stdio, Ctrl-C and the exit code; --pwsh selects PowerShell 7
windowsweep.cmd         the same launch without Node (6 lines)
windowsweep.ps1         entry (292 lines): $args parser (no param block, GNU-style flags, --flag=value),
                        Initialize-Paths / Ui / Safety / Log / Settings / Report / CrashTrap, dispatch, exit codes
lib/constants.ps1       version fallback, author and URL constants, exit codes, the 22-section catalogue,
                        safe batch, profiles, walkthrough order
lib/ui.ps1              glyphs from [char] codes, colours, Write-* helpers, prompts, multi-select parser
lib/log.ps1             session log, freed-bytes tally, drive snapshots, the schema-1 JSON report
lib/fs.ps1              long-path (\\?\) helpers, junction-aware walker, idle-days, stale-file scan
lib/safety.ps1          the chokepoint and its guards (493 lines)
lib/config.ps1          ~\.windowsweep\config.json, the developer question, toolchain hints
lib/scan.ps1            New-Target, Get-AllTargets, --scan table, --list-targets
lib/actions.ps1         the target-list engine (Invoke-TargetList), layout kinds, superseded versions
modules/runner.ps1      section dispatch, batch policy, --scan mode, summary, --json line
modules/<section>.ps1   one file per section group: health (0), pkg_managers (1), build_tools (2),
                        test_runners (3), android_avd (4), docker (5 + 20), editors (6), browsers (7),
                        app_caches (8), windows_user (9-11), system_admin (12-16), projects (17),
                        personal (18-19), disk_usage (21)
modules/walkthrough.ps1 default guided mode      modules/menu.ps1     jump-to menu
modules/reports.ps1     list, MD/HTML export, --export, --stats, reports manager
modules/release_helpers.ps1  --version, --list, --self-test, feedback, debug bundle, task, alias, data removal
modules/crash_trap.ps1  crash bundle on unexpected exit
assets/logo/            SVG mark + wordmark (README loads the raw GitHub URL)
docs/                   the manual (13 user pages) + project records; not shipped
.github/                ci.yml, three issue templates, config.yml, FUNDING.yml
```

Total source: 4,196 lines across 30 files; every file is under 500 lines; every `.ps1`/`.js` file is
ASCII-only (PowerShell 5.1 reads BOM-less UTF-8 as ANSI, so glyphs are `[char]` codes). No build step, no
TypeScript, no test framework: the fixture-based self-test is the suite.

Data directory: `%USERPROFILE%\.windowsweep\{config.json, logs\, reports\, feedback\}` on every launch path,
overridable with `WINDOWSWEEP_HOME`, `--logs-dir`, `--reports-dir`.

## 3. The 22 sections (numbers frozen at 1.0.0)

| # | Section | Tier | Admin | Batch | Developer-gated |
|---|---|---|---|---|---|
| 0 | System health report | report | - | safe | - |
| 1 | Package-manager caches (npm, yarn, pnpm, bun, deno, pip, uv, poetry, Composer, NuGet, Cargo, Go, pub, Electron, node-gyp, Scoop) | rebuilds | - | safe | yes |
| 2 | Build-tool caches (Gradle, Maven, Android, Unity, JetBrains, .NET telemetry) | rebuilds | - | safe | yes |
| 3 | Test-runner browsers (Cypress, Playwright, Playwright-Go, Puppeteer) - keep newest | rebuilds | - | safe | yes |
| 4 | Android emulators (AVDs) idle N+ days | slow | - | opt-in | yes |
| 5 | Docker: dangling layers, build cache, unused images older than N days | rebuilds | - | safe | yes |
| 6 | Editor caches, stale workspace storage, uninstalled extension folders (VS Code, Insiders, VSCodium, Cursor, Windsurf, Visual Studio) | rebuilds | - | safe | - |
| 7 | Browser caches, every profile (Chrome stable/Beta/Dev/Canary, Edge, Brave, Vivaldi, Opera, Opera GX, Chromium, Arc, Firefox, LibreWolf, Waterfox) | rebuilds | - | safe | - |
| 8 | Desktop-app caches (Discord x3, Slack x2, Teams x2, Zoom, Spotify x2, Postman, Figma, Notion, Signal, Skype, GitHub Desktop, Obsidian, Claude, Linear, Granola, Insomnia, Steam, Epic, Adobe, OBS, Squirrel, updaters) + superseded Squirrel versions | rebuilds | - | safe | - |
| 9 | Windows user caches (INetCache, WER, crash dumps, shader caches, RDP bitmaps, OneDrive logs, Store-app temp, themes, CLR logs, Explorer leftovers, DNS flush) | rebuilds | - | safe | - |
| 10 | User temp files idle 3+ days (%TEMP%, %TMP%, Local\Temp, LocalLow\Temp) | rebuilds | - | safe | - |
| 11 | Empty the Recycle Bin | permanent | - | deep | - |
| 12 | Windows Update cache, Delivery Optimization, Windows\Temp, service-profile temp, CBS/DISM/WU logs, system WER | rebuilds | yes | safe when elevated | - |
| 13 | Disk Cleanup engine (cleanmgr /sagerun:77, 25 curated handlers) | rebuilds | yes | safe when elevated | - |
| 14 | Component store (DISM StartComponentCleanup, optional /ResetBase) | rebuilds | yes | opt-in | - |
| 15 | Hibernation file off / reduced / keep | config | yes | deep | - |
| 16 | Clear Windows Event Logs | permanent | yes | deep | - |
| 17 | Stale project build artefacts (node_modules, dist, .next, target, ...) in projects idle N+ days | rebuilds | - | interactive | yes |
| 18 | Partial / orphan downloads in Downloads | Recycle Bin | - | interactive | - |
| 19 | Large stale personal files in Downloads (>= 100 MB, idle N+ days) | Recycle Bin | - | interactive | - |
| 20 | Docker Desktop / WSL disk-image compaction (diskpart) | config | yes | deep | yes |
| 21 | Disk usage report (largest entries of the profile, AppData, system drive) | report | - | safe | - |

Safe batch (`--all`): 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21, plus 12 and 13 when already elevated. Profiles:
`dev` 1,2,3,4,5,6,17 · `minimal` 7,8,9,10 · `cache-only` 1,2,3,6,7,8,9 · `system` 12,13,14 · `deep`
0,1,2,3,5,6,7,8,9,10,12,13,14,21 · `audit` 0,21. Walkthrough order 1-11, 17, 18, 19, then 12-14 when
elevated, then 21. About 160 `New-Target` declarations in source resolve to 99 concrete file-system targets
on the build machine (self-test check [6]); the rest are per-machine (temp roots, editors found) or `cmd`
rows that describe an external command.

## 4. Modes, flags, exit codes

| Mode | Flag | Notes |
|---|---|---|
| Walkthrough | (default), `-w` | needs a console; `a` run / `s` skip / `q` quit per step; running total |
| Menu | `-m`, `--menu` (`-i` alias) | one section at a time; toggles for dry-run and auto-yes; `A` safe batch |
| Safe batch | `-a`, `--all` (`--all-safe` alias) | with `--yes` fully unattended |
| Subset | `--only L`, `--profile NAME`, `--exclude L` | ranges like `1,3,5-7`; deep sections refused without `--i-understand-deep`; interactive sections refused in batch |
| Read-only | `-s`/`--scan`, `--list`, `--list-targets` | nothing deleted |
| Self-test | `--self-test` | 108 checks, exit 1 on any failure |
| Reports | `--reports`, `--export md|html|both [N|latest|all]`, `--stats`, `--prune-history [N]` | |
| Feedback | `--feedback`, `--report-issue` (`--report-bug`), `--debug-bundle` | offline; the browser opens only after you confirm |
| Setup | `--install-task` / `--uninstall-task`, `--install-alias` / `--uninstall-alias`, `--uninstall-data` | weekly Sunday 03:00 safe batch; a `cleanup` profile function |
| Version / help | `-V`, `--version`, `-h`, `--help`, `/?` | |

Options: `--dry-run` (`-n`), `-y`/`--yes`, `--i-understand-deep`, `--elevate`, `-d`/`--days N` (100),
`--temp-days N` (3), `--purge-all`, `--developer` / `--not-developer` (`--no-developer`) /
`--forget-developer`, `--scan-roots "P1;P2"`, `--exclude-path P` (repeatable), `--large-file-mb N` (100),
`--hiberfil off|reduced|keep`, `--reset-base`, `--permanent`, `--logs-dir`, `--reports-dir`, `--no-report`,
`--cleanup-logs`, `--json`, `-q`/`--quiet`, `--no-color`, `--ascii`, `--pwsh`. Every option also accepts
`--flag=value`.

Exit codes: 0 ok · 1 failure or self-test failed · 2 usage or interactive mode without a console · 3 refused
(deep or interactive section named in `--only`, elevation refused) · 130 Ctrl-C (through the Node launcher).

Environment: `WINDOWSWEEP_HOME`, `WINDOWSWEEP_LOG_DIR`, `WINDOWSWEEP_REPORTS_DIR`, `WINDOWSWEEP_SHELL=pwsh`,
`NO_COLOR` / `WINDOWSWEEP_NO_COLOR`, `WINDOWSWEEP_ASCII`; the launcher sets `WINDOWSWEEP_VERSION`,
`WINDOWSWEEP_LAUNCHER`, `WINDOWSWEEP_NPX`. Config keys in `config.json`: `developer`, `developerAskedAt`,
`days`, `tempDays`, `largeFileMb`, `scanRoots`, `excludePaths`, `welcomed`.

## 5. The safety contract (as implemented)

- **One chokepoint.** `Remove-PathSafe` (files, directories, links) and `Send-ToRecycleBin` (personal
  files) with a mandatory `-Within` root; the higher-level helpers `Remove-StaleFiles`, `Remove-StaleUnits`
  and `Clear-DirectoryContents` re-run the same guards; destructive external commands (docker, cleanmgr,
  Dism, powercfg, wevtutil, diskpart, wsl, ipconfig, pnpm, uv, npm) go through `Invoke-External -Destructive`.
- **Refusals, in order:** `..` segments, UNC paths, drive roots; exact roots (Windows, System32, SysWOW64,
  Program Files x2, ProgramData, `C:\Users` and its Default/Public, the profile root, AppData and its three
  roots); 66 protected subtrees (Documents, Pictures, Music, Videos, Desktop, Contacts, Favorites, Links,
  Saved Games, Searches, 3D Objects, Dropbox, Google Drive, iCloudDrive, `.ssh`, `.gnupg`, `.secrets`,
  `.aws`, `.azure`, `.kube`, `.gcloud`, `.docker`, `.config`, `.local`, `.claude`, `.codex`, `.agents`,
  `.gemini`, `.copilot`, `.antigravity`, `.ollama`, `.vscode-server`, `.cursor-server`, `.password-store`,
  npm globals, nvm x3, Volta, fnm x2, corepack, pnpm global, bun bin + global, deno bin, cargo bin, rustup,
  go bin, `Programs`, `WindowsApps`, the Android SDK (except `.temp` and `.downloadIntermediates`),
  Prefetch, `Windows\Installer`, WinSxS, `System32\config`, servicing, Boot, Fonts, `Package Cache`, the
  Start Menu, `$Recycle.Bin`, System Volume Information, Recovery, Boot, EFI); 50 wildcard patterns
  (OneDrive, Store-app LocalState/Settings/RoamingState, Chrome for Testing, every Chromium profile root and
  its Local Storage, Session Storage, IndexedDB, Cookies, Login Data, Web Data, Bookmarks, History, Sync Data,
  Preferences, Network, File System, databases, Sessions, Extension State and settings, Extensions, Service
  Worker Database and CacheStorage, shared_proto_db; editor globalStorage, History, settings.json,
  keybindings.json, snippets; the AI-agent caches under `.cache`; JetBrains Toolbox; Firefox places, key4,
  logins, cookies, storage, prefs, extensions); 13 protected file names (NTUSER.DAT and logs, ntuser.ini,
  UsrClass.dat and logs, hiberfil, pagefile, swapfile, bootmgr, BOOTNXT, DumpStack.log.tmp); the tool's own
  data directory (except `--prune-history` and `--uninstall-data`). Then the path must lie strictly inside
  the declared root. No flag bypasses any of it.
- **Layout kinds** (`chromium`, `firefox`, `electron`, `editor`) resolve only to allowlisted cache folder
  names (`Cache`, `Code Cache`, `GPUCache`, Dawn caches, shader caches, `Service Worker\ScriptCache`,
  Crashpad reports, `CachedData`, `CachedExtensionVSIXs`, Firefox `cache2`, `startupCache`, `thumbnails`,
  `jumpListCache`, `OfflineCache`, `shader-cache`); a second guard refuses any other leaf at run time.
- **Reparse points are never followed**: the walker checks the attribute before descending; a junction or
  symlink is removed as a link. **Long paths** go through the `\\?\` prefix. **Locked files** are skipped and
  counted, never fatal.
- **Idle gate**: a file goes when the newest of write, access and creation time is `--days` old (Windows
  keeps last-access off on most volumes, so the rule only ever makes a file look fresher). Directory units
  use the newest file inside. **Keep-newest** for versioned units (Cypress, Playwright families, Gradle
  distributions, JetBrains IDE versions, Squirrel `app-x.y.z`, editor extension versions).
- **Running-app guard** per target (chrome, msedge, brave, firefox, Code, Cursor, Discord, slack, ms-teams,
  Zoom, Spotify, Postman, Figma, devenv, Adobe apps, steam, ...): skipped with the exact re-run command.
- **Batch policy**: safe sections run in `--all`; opt-in (4, 14) only when named; deep (11, 15, 16, 20)
  need `--i-understand-deep`; interactive (17, 18, 19) never run unattended; `--yes` never applies to
  personal files (18 and 19 re-confirm without auto-yes). One known gap: in the interactive modes `--yes`
  pre-selects every item of 17-19 and section 17 then needs no further human choice - `remaining-work.md`
  RW-002.
- **Admin** is detected, never assumed; admin sections skip with the `--elevate` command; `--elevate`
  relaunches through UAC (`Start-Process -Verb RunAs`) and waits.
- **Dry-run** short-circuits every helper and every destructive command, prints `[dry-run]` lines and
  tallies an estimate; the self-test hashes a fixture tree before and after a dry-run.
- **Developer mode**: asked once, saved in `config.json`; on = idle gate + keep-newest on sections 1-5, 17
  scans project roots; off = sections 1, 2, 3 cleared completely, Docker `system prune -a`, 4/17/20 skipped;
  non-interactive with no saved answer = on (the conservative choice). `--purge-all` clears cache targets
  completely in either mode.
- **Offline**: no HTTP or socket code (self-test check [9] greps for it); `Start-Process <url>` opens the
  browser only after the user confirms in `--report-issue`, or on `o N` in the reports manager.

## 6. Reports, logs, bundles

Per run: `logs\windowsweep-<stamp>.log` (every removal with size, every skip with reason, every external
command with exit code, a credit header) and `reports\report-<stamp>.json` (schema 1: credits, meta, disk
before/after, steps with status `ran | dry-run | skipped | refused | failed`, totals). Exports to Markdown
and a self-contained HTML page (light/dark) with no external tool; `--stats` aggregates history;
`--prune-history N` trims it; `--json` prints one summary line on stdout with everything else on stderr.
Section 17 writes `stale-builds-<stamp>.txt`, section 21 `disk-usage-<stamp>.txt`. `--debug-bundle` and an
unexpected exit zip the log, the latest report and a manifest under `feedback\`; nothing is ever sent.

## 7. Quality gates

| Gate | What it proves | State |
|---|---|---|
| `node bin\windowsweep.js --self-test --no-color` | 108 checks: PowerShell version, optional tools, parse of every script, ASCII-only source, 22 must-refuse and 8 must-allow probe paths, `Test-PathWithin`, no declared target inside a protected path (99 targets), a fixture with a real junction and a nested junction, the dry-run hash guarantee, stale prune, keep-newest, a 300+ character path, three refusals, the extension-leftover plan on an array manifest, the multi-select parser, `Format-Bytes`, the no-network grep, version parity, writable output dirs | 108/108 on the build machine (2026-09-03) |
| `npm run version:check` | `package.json` = `VERSION` = `WS_VERSION_FALLBACK` | OK |
| `npm pack --dry-run` | the `files` allowlist only (37 files, 78.4 kB packed, 264.0 kB unpacked after the audit commit) | OK; CI also sweeps for `CLAUDE.md`, `AGENTS.md`, `docs/`, `temp/`, `.npmrc`, `.env` |
| PSScriptAnalyzer with `PSScriptAnalyzerSettings.psd1` | Error + Warning severity, four justified exclusions | 0 findings (CI, both hosts) |
| CI job `ci` on `windows-latest` (`.github/workflows/ci.yml`) | launcher syntax, version, self-test on Windows PowerShell 5.1 and PowerShell 7, dry-run of the safe batch on both, `--list` and `--list-targets`, the analyzer, the tarball sweep | latest run 33739406904 succeeded on `84c732f`; the three earlier runs failed on the analyzer under pwsh, fixed by that commit |
| Planted defects (2026-09-03) | a protected path leaked into a target list turned check [6] red; a syntax error turned check [3] red; both removed, 108/108 again | recorded in `docs/PROJECT-CONTEXT.md` |
| Real run (2026-09-03, build machine, safe batch, developer mode, not elevated) | 22.08 GB freed on C:, protected paths spot-checked unchanged, one hot-path defect found and fixed before release | recorded in `docs/PROJECT-CONTEXT.md` |

Never executed for real so far: sections 12-16 and 20 (need elevation), section 4 (no idle AVD), 17-19
(interactive), 5 (daemon was off), 7 for Chrome and 8 for Slack/Granola (they were open), the Scheduled
Task, `--elevate` itself, any Windows 11 machine. These are the P1 items in `remaining-work.md`.

## 8. Documentation set

Root: `README.md` (canonical package README pattern: header block, at-a-glance table, TOC, 21 sections
with explicit anchors, absolute links), `CHANGELOG.md` (Keep a Changelog, 1.0.0), `CONTRIBUTING.md` (fork
and PR, protected `main`, coding standards, PR checklist), `SECURITY.md` (private reporting, scope),
`CODE_OF_CONDUCT.md`, `LICENSE` (MIT 2026), `VERSION`. `docs/`: index, installation, quick-start,
safety-model, sections, cli-reference, profiles, developer-mode, admin-and-elevation, reports-and-logs,
troubleshooting, faq, author. Project records: `docs/PROJECT-CONTEXT.md` (decisions, verified runs, release
record), `docs/PACKAGES.md` (no dependencies; external commands; manifest decisions; tarball contents),
`docs/MANUAL-TASKS.md` (owner-only rows), `docs/features/windowsweep-v1/` (closed tracker + overview),
`docs/features/windowsweep-completion/` (the open tracker), `docs/work-history/` (WH001, WH002),
`CLAUDE.md` = `AGENTS.md` (mirror pair, project rules and stack override). The docs are not in the tarball;
the README links every page by absolute URL.

## 9. Governance and distribution

- GitHub: public, Issues enabled, ruleset 22181256 on `main` (no deletion, no non-fast-forward, PR with one
  approval and stale-review dismissal, required check `ci`, Repository-admin bypass so the owner pushes
  directly and the push output says `Bypassed rule violations`). Three issue forms (bug, feature,
  contributor access) plus contact links (security email, maintainer email, support). `FUNDING.yml` and every
  support link point at `aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep` only.
  Not yet set: topics, homepage, wiki off, a `v1.0.0` tag, a GitHub Release.
- npm: `bin` = `windowsweep`, `files` allowlist (bin, lib, modules, the two entry files, README, LICENSE,
  CHANGELOG, SECURITY, VERSION), `publishConfig.access public`, `prepublishOnly` runs `version:check` and the
  launcher syntax check; publish token comes from the FilesHub developer-accounts vault, never the repo.
  Install paths: `npx windowsweep`, `npm install -g windowsweep`, or a clone through `windowsweep.cmd` /
  `powershell -ExecutionPolicy Bypass -File windowsweep.ps1`. Owner decision 2026-09-03: no other channel.
- `.gitignore` keeps `temp/` (read-only clones of the two siblings), runtime output, `.npmrc`, `.env*`,
  keys and editor cruft out; `.gitattributes` pins CRLF for `.ps1`/`.psd1`/`.cmd` and LF for the rest;
  `.yarnrc.yml` carries `npmMinimalAgeGate: 0` by fleet rule although nothing is installed.

## 10. The owner's part checklist

| Part | Verdict | Evidence |
|---|---|---|
| CLI / npm package | **Present and published** | sections 2-9 above; `npm view windowsweep` |
| Windows engine (PowerShell 5.1 + 7) | **Present** | `windowsweep.ps1`, `lib/`, `modules/`; CI on both hosts |
| Node launcher and no-Node launcher | **Present** | `bin/windowsweep.js`, `windowsweep.cmd` |
| Self-test / CI / lint | **Present** | 108 checks, `ci.yml`, PSScriptAnalyzer settings |
| In-repo documentation | **Present** (3 doc-versus-code mismatches open) | `docs/`, README |
| Docs site | **Missing - in scope** (`windowsweep-docs.aoneahsan.com`; both siblings have one) | `remaining-work.md` RW-040 |
| AI integration guide | **Missing - small, in scope** | RW-041 |
| Repository governance (ruleset, CONTRIBUTING, SECURITY, CoC, issue forms, funding) | **Present** | section 9 |
| Repository hygiene (topics, homepage, wiki, tags, releases) | **Partly missing** | RW-050 |
| Portfolio-info file, master links JSON, ORCID | **Missing** (both siblings have them) | RW-051 |
| Verification on Windows 11, elevated sections, Scheduled Task | **Not yet done** | P1 |
| Desktop app | **Not present; a later phase by owner decision** (macleanup has a Tauri one) | P6 |
| Admin panel, plans, backend, web app, Android app, browser extension | **Not applicable** - a local CLI with no accounts, no server, no UI beyond the console | - |
| SEO / AEO, OG assets, post-build SEO, sitemap, feed | **Not applicable to the CLI**; the docs site (RW-040) brings its own sitemap, `llms.txt` and page metadata | - |
| UI/UX, theme control, i18n | **Not applicable** to the console tool (English console output; `--ascii` and `--no-color` are the only presentation switches); they would apply to the desktop app if it is built | - |
| Analytics, error tracking, push, email | **Deliberately absent** - no network calls is a product promise | self-test check [9] |
| Social content | **Lives in the notebook by fleet rule, never in this repo** | - |

## 11. Commands used for this audit (2026-09-03)

```powershell
git log --oneline; git ls-files; git diff 70c6738..HEAD --stat
wc -l windowsweep.ps1 lib/*.ps1 modules/*.ps1 bin/*.js
node bin\windowsweep.js --self-test --no-color --no-report      # 108/108, 99 declared targets
npm run version:check; npm pack --dry-run                        # parity OK; 37 files, 78.4 kB / 264.0 kB
npm view windowsweep version time dist.fileCount dist.unpackedSize
gh repo view aoneahsan/windowsweep --json description,hasWikiEnabled,repositoryTopics,homepageUrl
gh api repos/aoneahsan/windowsweep/rules/branches/main; gh run list --repo aoneahsan/windowsweep
gh api repos/aoneahsan/linux-cleanup-docs/pages; gh api repos/aoneahsan/macleanup-docs/pages
diff CLAUDE.md AGENTS.md                                         # two pointer lines
```
