# What windowsweep consists of

Last Updated: 2026-09-05 (audit of `main` at `2721b75`; npm `windowsweep@1.1.0`; docs site `aoneahsan/windowsweep-docs` at `2e75731`)

This file answers one question for the owner: does the agent understand every part of this project? Every
statement below was checked on 2026-09-05 against the two working trees, the npm registry, GitHub and the
docs domain; the commands are listed at the end. What is missing or planned lives in `remaining-work.md`; the
one-page view is `remaining-work-summary.md`. Status of every open item is in
`docs/features/windowsweep-completion/00-tracker.json` and nowhere else.

## 1. Identity and layout

| | |
|---|---|
| Name | **windowsweep** - safe-by-default Windows cleanup CLI, developer-aware, dry-run first, zero install via npx |
| Kind | a command-line tool (a Windows PowerShell 5.1 engine behind a dependency-free Node launcher) **plus** a public documentation site **plus** a Windows desktop app in design, all under one product name |
| Family | the Windows member beside [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) (Bash) and [macleanup](https://github.com/aoneahsan/macleanup) (Bash): name every path before touching it, prune idle files instead of wiping, refuse personal folders, real dry-run, no network calls |
| Layout on this machine | `D:\work\windows-cleanup-root\` (not a repository) holding two repositories side by side: `windows-cleanup\` (the product, `aoneahsan/windowsweep`, remote `o`) and `windowsweep-docs\` (the site, `aoneahsan/windowsweep-docs`, remote `origin`). Owner decision 2026-09-05: this layout is durable; the inner folder keeps its name |
| Product repository | public, MIT, branch `main` = `o/main` at `2721b75`; 22 commits; ruleset 22181256 (PR + review + required check `ci`, Repository-admin bypass for the owner) |
| Package | `windowsweep@1.1.0` on npm, published 2026-09-04T09:11Z by `aoneahsan`, 44 files, 109.0 kB packed / 365.7 kB unpacked, `os: ["win32"]`, `engines.node >=14`, **no dependencies of any kind**. The engine on `main` is byte-identical to the published one (`git diff 3c4d54e..HEAD -- lib modules windowsweep.ps1 bin package.json` is empty) |
| Releases | annotated tags `v1.0.0` (on `70c6738`), `v1.0.1` (`edaa5cf`), `v1.1.0` (`3c4d54e`), each with a GitHub Release; every release from here gets both |
| Documentation site | `https://windowsweep-docs.aoneahsan.com` - Docusaurus on GitHub Pages, deployed and green; **the domain does not resolve yet** (owner DNS row 11); `aoneahsan.github.io/windowsweep-docs/` answers 301 to the custom domain |
| Desktop app | phase P6: a Tauri 2 wrapper in `desktop/` (identifier `com.aoneahsan.windowsweep`, version = the bundled CLI version). Today only `desktop/design/` exists: the design argument and an approved click dummy |
| Users | developers and power users on Windows 10 (1809+) and Windows 11 who want to see and control every deletion |
| Owner | Ahsan Mahmood - aoneahsan.com, GitHub and LinkedIn `aoneahsan`, aoneahsan@gmail.com (no phone number anywhere in the repo, by decision) |
| Registrations | FilesHub project **60** (`slug: windowsweep`, vault empty until P6 seeds it) · palette registry primary hue **128** (lime) · dev ports 5972 / 5973 (docs site) and 5974 (desktop Vite) |

## 2. Repository map and architecture

```text
bin/windowsweep.js        83   Node launcher: win32 guard, finds windowsweep.ps1, spawns powershell.exe -NoProfile
                               -NoLogo -ExecutionPolicy Bypass -File, passes WINDOWSWEEP_VERSION/_LAUNCHER/_NPX,
                               forwards stdio, Ctrl-C and the exit code; --pwsh selects PowerShell 7
windowsweep.cmd            6   the same launch without Node
windowsweep.ps1          316   entry: $args parser (no param block, GNU-style flags, --flag=value), Initialize-*,
                               dispatch, exit codes, the finally block that exits 130 on an interrupted run
lib/constants.ps1         93   version fallback, author/URL constants, exit codes, the 26-section catalogue, safe
                               batch, profiles, walkthrough order (everything iterates WS_SECTIONS, never a range)
lib/ui.ps1               275   glyphs from [char] codes, colours, Write-* helpers, prompts, Read-MultiSelect with
                               -NoAutoYes, the --select / --select-file queues
lib/log.ps1              140   session log, freed-bytes tally, drive snapshots, the schema-1 JSON report
lib/fs.ps1               180   long-path (\\?\) helpers, junction-aware walker, idle-days, stale-file scan
lib/safety.ps1           493   the chokepoint and its guards (table-driven, pre-normalised prefixes, precompiled
                               patterns)
lib/config.ps1            99   ~\.windowsweep\config.json, the developer question, toolchain hints
lib/scan.ps1             100   New-Target, Get-AllTargets (catalogue-driven), --scan table, targets[] for --json
lib/actions.ps1          212   the target-list engine (Invoke-TargetList), layout kinds, Test-KnownCacheLeaf,
                               superseded versions
modules/runner.ps1       239   section dispatch, batch policy, --scan mode, summary, --json line, progress lines,
                               --list --json
modules/walkthrough.ps1   79   default guided mode         modules/menu.ps1         63   jump-to menu
modules/reports.ps1      212   list, MD/HTML export, --export, --stats, reports manager
modules/release_helpers.ps1 438  --version, --list, the self-test groups 1-12, feedback, debug bundle, task,
                               alias, data removal
modules/self_test_extra.ps1 360  self-test groups 13-17 (pure helpers, fixtures, catalogue, scripted selection,
                               new helpers)
modules/notify.ps1        60   --notify: WinRT toast on 5.1, NotifyIcon balloon on pwsh, never touches exit code
modules/crash_trap.ps1    89   crash bundle on unexpected exit
modules/<section>.ps1          one file per section group: health (0) 101, pkg_managers (1) 73, build_tools (2) 35,
                               test_runners (3) 24, android_avd (4) 36, docker (5 + 20) 93, editors (6) 150,
                               browsers (7) 33, app_caches (8) 58, windows_user (9-11) 118, system_admin (12-16)
                               220, projects (17) 160, personal (18-19) 126, disk_usage (21) 49,
                               globals_audit (22) 236, orphaned_appdata (23) 189, installed_programs (24) 118,
                               startup_audit (25) 126
assets/logo/                   SVG mark + wordmark (the README loads the raw GitHub URL)
docs/                          the manual (13 user pages) + project records; never shipped
desktop/design/                the desktop app's design argument and click dummy (section 11); never shipped
.claude/skills/                six vendored external design-craft skills (`ext-*`, see EXTERNAL-SKILLS.md)
.github/                       ci.yml, three issue forms, config.yml, FUNDING.yml
temp/                          read-only clones of the two sibling tools; gitignored
```

Total engine source: **5,476 lines across 36 files**; every file is under 500 lines; every `.ps1`/`.js` file is
ASCII-only (PowerShell 5.1 reads BOM-less UTF-8 as ANSI, so glyphs are `[char]` codes; the self-test enforces
it). No build step, no TypeScript, no test framework: the fixture-based self-test is the suite.

Data directory: `%USERPROFILE%\.windowsweep\{config.json, logs\, reports\, feedback\}` on every launch path,
overridable with `WINDOWSWEEP_HOME`, `--logs-dir`, `--reports-dir`.

## 3. The 26 sections (numbers frozen; 0-21 shipped in 1.0.0, 22-25 in 1.1.0, 26 is free)

| # | Key | Section | Tier | Admin | Batch | Dev-gated |
|---|---|---|---|---|---|---|
| 0 | health | System health report | report | - | safe | - |
| 1 | pkg | Package-manager caches (npm, yarn, pnpm, bun, deno, pip, uv, Composer, NuGet, Cargo, Go, pub, Hugging Face hub) | rebuilds | - | safe | yes |
| 2 | build | Build-tool caches (Gradle, Maven, Android, Unity, JetBrains) | rebuilds | - | safe | yes |
| 3 | runners | Test-runner browsers (Cypress, Playwright, Puppeteer) - keep newest | rebuilds | - | safe | yes |
| 4 | avd | Android emulators (AVDs) idle N+ days | slow | - | opt-in | yes |
| 5 | docker | Docker: dangling images, build cache, unused images older than N days | rebuilds | - | safe | yes |
| 6 | editors | Editor caches (VS Code, Cursor, Windsurf, Visual Studio) + superseded extensions | rebuilds | - | safe | - |
| 7 | browsers | Browser caches (Chrome, Edge, Brave, Vivaldi, Opera, Chromium, Firefox) | rebuilds | - | safe | - |
| 8 | apps | Desktop app caches (Discord, Slack, Teams, Zoom, Spotify, Postman, Figma, ...) | rebuilds | - | safe | - |
| 9 | wincaches | Windows user caches (INetCache, WER, crash dumps, shader caches, UWP temp; wsreset offered as a next step) | rebuilds | - | safe | - |
| 10 | temp | User temp files older than N days | rebuilds | - | safe | - |
| 11 | recycle | Empty the Recycle Bin - PERMANENT | permanent | - | deep | - |
| 12 | wu | Windows Update + system temp (SoftwareDistribution, Delivery Optimization, Windows\Temp, CBS logs) | rebuilds | yes | safe | - |
| 13 | cleanmgr | Windows Disk Cleanup engine (cleanmgr, curated handlers) | rebuilds | yes | safe | - |
| 14 | dism | Component store cleanup (DISM StartComponentCleanup) - slow | rebuilds | yes | opt-in | - |
| 15 | hiberfil | Hibernation file (off / reduced) | config | yes | deep | - |
| 16 | eventlogs | Clear Windows Event Logs - PERMANENT | permanent | yes | deep | - |
| 17 | projects | Stale project build artefacts (node_modules, dist, .next, target, .nx, .tox, ...) | rebuilds | - | interactive | yes |
| 18 | partials | Partial / orphan downloads -> Recycle Bin | recycle | - | interactive | - |
| 19 | large | Large stale personal files (Downloads) -> Recycle Bin | recycle | - | interactive | - |
| 20 | vhdx | Docker Desktop / WSL disk image compaction (stops Docker + WSL) | config | yes | deep | yes |
| 21 | diskusage | Disk usage report (largest entries, drives, disk images) | report | - | safe | - |
| 22 | globals | Globally installed packages audit (npm, pnpm, yarn, bun, deno) - report only, declares no deletable target | report | - | safe (audit profile) | yes |
| 23 | orphaned | Orphaned application data under AppData -> Recycle Bin (fails closed on an unreadable registry) | recycle | - | interactive | - |
| 24 | programs | Installed programs not modified for N+ days - report only, never uninstalls | report | - | safe (audit profile) | - |
| 25 | startup | Startup items audit (Run keys, Startup folders, logon tasks) - report only | report | - | safe (audit profile) | - |

Safe batch (`--all`): 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21, plus 12 and 13 when already elevated. Profiles: `dev`
1,2,3,4,5,6,17 · `minimal` 7,8,9,10 · `cache-only` 1,2,3,6,7,8,9 · `system` 12,13,14 · `deep`
0,1,2,3,5,6,7,8,9,10,12,13,14,21 · `audit` 0,21,22,24,25. Walkthrough order 1-11, 17, 18, 19, 23, then 12-14
when elevated. `--list --json` prints exactly this catalogue (`tool`, `version`, `sections[]` with `id key title
tier admin batch dev`, `safe_batch`, `safe_batch_admin`, `profiles`, `walkthrough`, `walkthrough_admin`) so a
front end never hard-codes it. On the build machine `--scan --json` measured 657 concrete targets (2026-09-04).

## 4. Modes, flags, exit codes, environment, config

| Mode | Flags | Notes |
|---|---|---|
| Walkthrough | (default), `-w`, `--walkthrough` | needs a console; `a` run / `s` skip / `q` quit per step; running total |
| Menu | `-m`, `--menu` (`-i`, `--interactive` alias) | one section at a time; toggles for dry-run and auto-yes; `A` safe batch |
| Safe batch | `-a`, `--all` (`--all-safe`) | with `--yes` fully unattended |
| Subset | `--only L`, `--profile NAME`, `--exclude L` | ranges like `1,3,5-7`; deep sections refused without `--i-understand-deep`; interactive sections refused in batch unless a selection was supplied |
| Read-only | `-s`/`--scan`, `--list`, `--list-targets` | nothing deleted; `--list --json` prints the catalogue |
| Self-test | `--self-test` | 151 checks, exit 1 on any failure |
| Reports | `--reports`, `--export md\|html\|both [N\|latest\|all]`, `--stats`, `--prune-history [N]` | |
| Feedback | `--feedback`, `--report-issue` (`--report-bug`), `--debug-bundle` | offline; the browser opens only after you confirm |
| Setup | `--install-task` / `--uninstall-task`, `--install-alias` / `--uninstall-alias`, `--uninstall-data` | weekly Sunday 03:00 safe batch (with `--notify`); a `cleanup` profile function; both installers refuse under npx (exit 3) |
| Version / help | `-V`, `--version`, `-h`, `--help`, `/?` | |

Options: `--dry-run` (`-n`), `-y`/`--yes`, `--i-understand-deep`, `--elevate` (and the internal
`--elevated-child`), `-d`/`--days N` (100), `--temp-days N` (3), `--purge-all`, `--developer` /
`--not-developer` (`--no-developer`) / `--forget-developer`, `--scan-roots "P1;P2"`, `--exclude-path P`
(repeatable), `--large-file-mb N` (100), `--hiberfil off|reduced|keep`, `--reset-base`, `--permanent`,
`--select L` (repeatable, one list per interactive prompt), `--select-file P` (one full path per line,
case-insensitive), `--notify`, `--logs-dir`, `--reports-dir`, `--no-report`, `--cleanup-logs`, `--json`,
`-q`/`--quiet`, `--no-color`, `--ascii`, `--pwsh`. Every option also accepts `--flag=value`.

Exit codes: 0 ok · 1 failure or self-test failed · 2 usage or interactive mode without a console · 3 refused
(deep or interactive section named in `--only` without a selection, elevation refused, installer under npx) ·
130 interrupted (engine and Node launcher agree since 1.0.1).

Environment: `WINDOWSWEEP_HOME`, `WINDOWSWEEP_LOG_DIR`, `WINDOWSWEEP_REPORTS_DIR`, `WINDOWSWEEP_SHELL=pwsh`,
`NO_COLOR` / `WINDOWSWEEP_NO_COLOR`, `WINDOWSWEEP_ASCII`; the launcher sets `WINDOWSWEEP_VERSION`,
`WINDOWSWEEP_LAUNCHER`, `WINDOWSWEEP_NPX`. Config keys in `config.json`: `developer`, `developerAskedAt`,
`days`, `tempDays`, `largeFileMb`, `scanRoots`, `excludePaths`, `welcomed`.

## 5. The safety contract (as implemented)

- **One chokepoint.** `Remove-PathSafe` (files, directories, links) and `Send-ToRecycleBin` (personal files)
  with a mandatory `-Within` root; `Remove-StaleFiles`, `Remove-StaleUnits` and `Clear-DirectoryContents`
  re-run the same guards; destructive external commands (docker, cleanmgr, Dism, powercfg, wevtutil, diskpart,
  wsl, ipconfig, pnpm, uv, npm) go through `Invoke-External -Destructive`.
- **The protection table** (`$Script:WS_PROTECT` in `lib/safety.ps1`: `Exact`, `Subtrees` +
  `SubtreePrefixes`, `Exceptions` + `ExceptionPrefixes`, `Patterns` + precompiled `PatternObjects`,
  `Basenames`, `HomePrefix`) refuses, in order: `..` segments, UNC paths, drive roots; the exact roots
  (Windows, System32, SysWOW64, both Program Files, ProgramData, `C:\Users` and Default/Public, the profile
  root, AppData and its three roots); the protected subtrees (personal folders, cloud-sync folders,
  credentials such as `.ssh` `.gnupg` `.secrets` `.aws` `.azure` `.kube` `.gcloud` `.docker`, `.config`,
  `.local`, every AI-agent home such as `.claude` `.codex` `.agents` `.gemini` `.copilot` `.antigravity`
  `.ollama`, editor server folders, toolchain homes such as nvm, Volta, fnm, corepack, pnpm, bun, deno,
  cargo, rustup, go, `Programs`, `WindowsApps`, the Android SDK except its temp folders, Prefetch,
  `Windows\Installer`, WinSxS, `System32\config`, servicing, Boot, Fonts, `Package Cache`, the Start Menu,
  `$Recycle.Bin`, System Volume Information, Recovery, EFI); the wildcard patterns (OneDrive, Store-app
  state, Chrome for Testing, every Chromium profile root and its Local Storage, Session Storage, IndexedDB,
  Cookies, Login Data, Web Data, Bookmarks, History, Sync Data, Preferences, Network, File System,
  databases, Sessions, Extension State, Extensions, Service Worker Database and CacheStorage; editor
  globalStorage, History, settings.json, keybindings.json, snippets; the AI-agent caches under `.cache`;
  JetBrains Toolbox; Firefox places, key4, logins, cookies, storage, prefs, extensions); the protected file
  names (NTUSER.DAT and logs, ntuser.ini, UsrClass.dat and logs, hiberfil, pagefile, swapfile, bootmgr,
  BOOTNXT, DumpStack.log.tmp); and the tool's own data directory (except `--prune-history` and
  `--uninstall-data`). Counted 2026-09-03: 66 subtrees, 50 patterns, 13 file names; the lists only grow
  (1.1.0 added the Hugging Face hub exception under `.cache`). Then the path must lie strictly inside the
  declared root. No flag bypasses any of it.
- **Layout kinds** (`chromium`, `firefox`, `electron`, `editor`) resolve only to allowlisted cache folder names
  (`Cache`, `Code Cache`, `GPUCache`, Dawn caches, shader caches, `Service Worker\ScriptCache`, Crashpad
  reports, `CachedData`, `CachedExtensionVSIXs`, Firefox `cache2`, `startupCache`, `thumbnails`,
  `jumpListCache`, `OfflineCache`, `shader-cache`); `Test-KnownCacheLeaf` refuses any other leaf at run time.
- **Reparse points are never followed**; a junction or symlink is removed as a link. **Long paths** go through
  the `\\?\` prefix. **Locked files** are skipped and counted, never fatal.
- **Idle gate**: a file goes when the newest of write, access and creation time is `--days` old (Windows keeps
  last-access off on most volumes, so the rule only ever makes a file look fresher). Directory units use the
  newest file inside. **Keep-newest** for versioned units (Cypress, Playwright families, Gradle distributions,
  JetBrains IDE versions, Squirrel `app-x.y.z`, editor extension versions). Section 24's report reads
  last-write only, because "not modified" is a different question from "safe to delete".
- **Running-app guard** per target (chrome, msedge, brave, firefox, Code, Cursor, Discord, slack, ms-teams,
  Zoom, Spotify, Postman, Figma, devenv, Adobe apps, steam, ...): skipped with the exact re-run command. A
  running editor keeps everything except its VSIX download cache and old logs (an unguarded target since 1.0.1).
- **Batch policy**: safe sections run in `--all`; opt-in (4, 14) only when named; deep (11, 15, 16, 20) need
  `--i-understand-deep`; interactive (17, 18, 19, 23) never run unattended **unless `--select` or
  `--select-file` supplied the selection** - a person did choose. `--yes` never selects an item in 17, 18, 19
  or 23 (restored in 1.0.1, re-proved by self-test check 16c); `--purge-all` from a console asks you to type
  `purge` once per run; `--uninstall-data` always asks.
- **Section 23 fails closed**: an unreadable uninstall registry yields zero candidates; its exclusions are derived
  from the declared target list of every other section so a vendor folder another section cleans is never
  offered. **Section 22 declares no deletable target** (its roots are protected subtrees; self-test 15e).
  Sections 24 and 25 change nothing.
- **Admin** is detected, never assumed; admin sections skip with the `--elevate` command; `--elevate` relaunches
  through UAC (`Start-Process -Verb RunAs`) and waits.
- **Dry-run** short-circuits every helper and every destructive command, prints `[dry-run]` lines and tallies an
  estimate; the self-test hashes a fixture tree before and after a dry-run.
- **Developer mode**: asked once, saved in `config.json`; on = idle gate + keep-newest on sections 1-5, 17 scans
  project roots; off = sections 1, 2, 3 cleared completely, Docker `system prune -a`, 4/17/20 skipped;
  non-interactive with no saved answer = on (the conservative choice).
- **Offline**: no HTTP or socket code (self-test check [9] greps for it); `Start-Process <url>` opens the
  browser only after the user confirms in `--report-issue`, or on `o N` in the reports manager; `--notify` is
  a local Windows notification.

## 6. Reports, logs, bundles and the machine contract

Per run: `logs\windowsweep-<stamp>.log` (every removal with size, every skip with reason, every external
command with exit code, a credit header) and `reports\report-<stamp>.json` (schema 1: credits, meta, disk
before/after, steps with status `ran | dry-run | skipped | refused | failed`, totals). Exports to Markdown and a
self-contained HTML page (light/dark) with no external tool; `--stats` aggregates history; `--prune-history N`
trims it. Section 17 writes `stale-builds-<stamp>.txt`, section 21 `disk-usage-<stamp>.txt`, section 24
`installed-programs-<stamp>.txt`. `--debug-bundle` and an unexpected exit zip the log, the latest report and a
manifest under `feedback\`; nothing is ever sent.

The contract for scripts, agents and the desktop app (`AI-INTEGRATION-GUIDE.md`, shipped in the tarball):
`--json` prints **one stdout line** (`tool`, `version`, `mode`, `dry_run`, `elevated`, `developer`,
`sections[]` with `section status freed_bytes`, `candidates[]` with `section index path bytes idle_days
project`, `targets[]` with `section label path bytes`, `refusals`, totals) with everything else on stderr,
where every section brackets itself as `##windowsweep section=NN event=start|end status=<status>
freed_bytes=<n>`; `--list --json` prints the catalogue; `--select` / `--select-file` answer the interactive
prompts in advance. These four things are what lets a GUI list candidates with `--dry-run --only 17 --json`
and then remove exactly the user's picks, without reimplementing a single finder.

## 7. Quality gates (all run on 2026-09-05 unless dated)

| Gate | What it proves | State |
|---|---|---|
| `node bin\windowsweep.js --self-test --no-color --no-report` | **151 checks in 17 groups**: [1] PowerShell version, [2] optional tools, [3] parse of every script, [4] ASCII-only source, [5] safety guards (must-refuse and must-allow probes, `Test-PathWithin`), [6] no declared target inside a protected path, [7] fixtures (real junction, nested junction, dry-run tree hash, stale prune, keep-newest, 300+ character path), [8] pure helpers, [9] no network code, [10] version parity, [11] output paths, [12] `--yes` never selects personal or project items (helper + every picker call site by AST), [13] parser, section lists, sizes, cache leaves, JSON summary, [14] superseded versions, Chromium layout, workspace storage, stale artefacts, report export, [15] catalogue reachability and what the new sections promise (incl. the `$p`/`$P` case-collision AST check), [16] scripted selection and the machine contract, [17] global-package verdicts, startup state, artefact list | `all 151 checks passed`, exit 0 |
| `npm run version:check` | `package.json` = `VERSION` = `WS_VERSION_FALLBACK` | `version parity OK: 1.1.0` |
| `npm pack --dry-run` | the `files` allowlist only | 44 files, 109.0 kB / 365.7 kB; no `desktop/`, `docs/`, `CLAUDE.md`, planning files, portfolio file |
| PSScriptAnalyzer 1.25.0 with `PSScriptAnalyzerSettings.psd1` | Error + Warning severity, four justified exclusions | 0 findings (the import needs `-ExecutionPolicy Bypass` in `powershell.exe`; a bare `-NoProfile` call fails to load the module and reports a vacuous 0) |
| CI job `ci` on `windows-latest` (`.github/workflows/ci.yml`) | launcher syntax, version parity, self-test on Windows PowerShell 5.1 and PowerShell 7, dry-run of the safe batch on both, `--list` and `--list-targets`, the analyzer, the tarball sweep (forbids `CLAUDE.md`, `AGENTS.md`, `docs/`, `temp/`, `desktop/`, `.npmrc`, `.env`, the three planning files, `PENDING-TASKS.md`, `portfolio-info`; requires `AI-INTEGRATION-GUIDE.md`) | every run on `main` green since `84c732f`; run 33953046121 green on `2721b75` |
| Planted defects | 2026-09-03: a protected path leaked into a target list turned check [6] red; a syntax error turned [3] red · P2 (2026-09-03): six plants, one fixture rebuilt after a half-oriented plant stayed green · P5 (2026-09-04): seventeen plants, three real defects found by the new checks before they shipped (a HashSet unrolled to a case-sensitive array; section 24 measuring last-access; a `$p`/`$P` collision) | recorded in `docs/PROJECT-CONTEXT.md` and the CHANGELOG |
| Real run (2026-09-03, build machine, safe batch, developer mode, not elevated) | 22.08 GB freed on C:, protected paths spot-checked unchanged, one hot-path defect fixed before release | recorded in `docs/PROJECT-CONTEXT.md` |

Never executed for real so far: sections 12-16 and 20 (need elevation), `--elevate` itself, section 4 (no idle
AVD), 5 (daemon was off), 7 for Chrome and 8 for Slack/Granola (they were open), 17-19 and 23 (interactive),
the Scheduled Task, `--notify` on PowerShell 7, any Windows 11 machine, the `--pwsh` path on a machine with
PowerShell 7. These are the P1 rows in `remaining-work.md`, all owner-run.

## 8. Documentation set

Root: `README.md` (the canonical package README: header block, at-a-glance table, TOC, 21 anchored sections,
absolute links; current at 1.1.0), `CHANGELOG.md` (Keep a Changelog: 1.0.0, 1.0.1, 1.1.0), `CONTRIBUTING.md`,
`SECURITY.md`, `CODE_OF_CONDUCT.md`, `LICENSE` (MIT 2026), `VERSION`, `AI-INTEGRATION-GUIDE.md` (shipped).
`docs/`: index, installation, quick-start, safety-model, sections (0-25 + the candidate-targets table),
cli-reference, profiles, developer-mode, admin-and-elevation, reports-and-logs, troubleshooting, faq, author.
Project records: `docs/PROJECT-CONTEXT.md` (decisions, verified runs, release record), `docs/PACKAGES.md`,
`docs/MANUAL-TASKS.md` (owner-only rows), `docs/DONE-TASKS.md`, `docs/features/windowsweep-v1/` (closed 1.0.0
tracker) and `docs/features/windowsweep-completion/` (the open tracker + overview), `docs/work-history/`
(WH001-WH005), `PENDING-TASKS.md` (none open), `CLAUDE.md` = `AGENTS.md` (mirror pair; differ only in the two
pointer lines), the three planning files at the root. The docs are not in the tarball; the README links every
page by absolute URL.

## 9. Governance and distribution

- GitHub: public, Issues on, Discussions off, wiki off, 8 topics (cache, cleanup, cli, developer-tools,
  disk-cleanup, npm, powershell, windows), homepage empty until the docs domain probes 200, ruleset 22181256
  on `main` (no deletion, no non-fast-forward, PR with one approval and stale-review dismissal, required check
  `ci`, Repository-admin bypass - a direct owner push prints `Bypassed rule violations`). Three issue forms plus
  contact links; `FUNDING.yml` and every support link point at
  `aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep` only.
- npm: `bin` = `windowsweep`, `files` allowlist (bin, lib, modules, the two entry files, README, LICENSE,
  CHANGELOG, SECURITY, VERSION, AI-INTEGRATION-GUIDE), `publishConfig.access public`, `prepublishOnly` runs
  `version:check` and the launcher syntax check. The publish gate (clean pushed tree, CI green, registry below
  the new version, tarball sweep, content-regression diff against the previous tarball with a 30-file floor,
  smoke-install into a temp prefix, `npm whoami` = `aoneahsan` from the FilesHub developer-accounts token,
  publish, `npm view --prefer-online`, `npx -y windowsweep@<v>` from `%TEMP%`) has run three times. Install
  paths: `npx windowsweep`, `npm install -g windowsweep`, or a clone through `windowsweep.cmd` /
  `powershell -ExecutionPolicy Bypass -File windowsweep.ps1`. Owner decision 2026-09-03: no other channel.
- `.gitignore` keeps `temp/`, runtime output, `.npmrc`, `.env*`, keys and editor cruft out; `.gitattributes`
  pins CRLF for `.ps1`/`.psd1`/`.cmd` and LF for `.js`/`.json`/`.md`/`.yml`/`.svg`; `.yarnrc.yml` carries
  `npmMinimalAgeGate: 0` by fleet rule although nothing is installed.

## 10. The documentation site (`windowsweep-docs/`)

| | |
|---|---|
| Stack | Docusaurus `^3.10.1` (`preset-classic`, `theme-mermaid`, `@easyops-cn/docusaurus-search-local`), React `^19.2.7`, TypeScript `~6.0.3`, yarn `4.17.1` (`packageManager` pin, `.yarnrc.yml` with `npmMinimalAgeGate: 0`), ports 5972 (start) / 5973 (serve) |
| Content | a **mirror of `windows-cleanup/docs/`**: intro (from `docs/README.md`), safety-model, developer-mode, installation, quick-start, sections, cli-reference, profiles, admin-and-elevation, reports-and-logs, ai-integration-guide, troubleshooting, faq, changelog (from `CHANGELOG.md`), about (from `docs/author.md`) - 15 pages with `title`/`description`/`tags` front matter, sidebar in that order. Rule: fix the CLI repo first, then re-mirror |
| Deploy | `.github/workflows/deploy-pages.yml`: `yarn install --immutable`, `yarn build` (also the link checker: `onBrokenLinks`/`onBrokenAnchors` throw), an owner-only-file sweep of `build/` with a non-vacuity floor (proved failing on a planted pattern, run 33784877064), `upload-pages-artifact` + `deploy-pages`. Latest run 33857426599 green (201 built files) |
| Domain | `static/CNAME` = `windowsweep-docs.aoneahsan.com`; `url` in `docusaurus.config.ts` matches; **probes 000** (owner DNS row 11); Pages reports `cname` set, `https_enforced: false` (owner row 12 after DNS) |
| Governance | public repo, Issues on, wiki off, ruleset 22211229 with the Pages workflow as the required check, `CONTRIBUTING.md`, `CLAUDE.md` = `AGENTS.md`, `docs/MANUAL-TASKS.md` excluded from the build (the `exclude` list restates the plugin defaults); topics added 2026-09-05 |
| SEO / AEO | four JSON-LD blocks (`WebSite`, `SoftwareSourceCode`, `SoftwareApplication` with `softwareVersion`, `Organization`), canonical link, description/keywords/author/robots meta, Open Graph and Twitter card tags, `sitemap.xml` from the preset (weekly, lastmod), `robots.txt` allowing every search and AI crawler by name and disallowing the SEO-budget bots, with the `Sitemap:` directive, `static/llms.txt`, offline local search, `showLastUpdateTime`. Static HTML per page, so no post-build prerender is needed |
| Analytics | env-gated: `GA_MEASUREMENT_ID` (gtag, anonymised) plus `CLARITY_PROJECT_ID`, `AMPLITUDE_API_KEY`, `SENTRY_DSN` read at build; every key unset today (owner row 18), so the site sends nothing |
| Gaps | the domain (owner); **the OG image is `img/social-card.svg` only** - a PNG export at 1200x630 is owed (RW-043); **no local install** yet (`node_modules` absent, lockfile inherited from `linux-cleanup-docs` and valid only while the dependency set is identical - RW-045); the footer label, `llms.txt` and the intro footer said 0-21 / 1.0.1 until this audit fixed them; homepage field empty until 200 |

## 11. The desktop app (phase P6)

**Decisions (owner, 2026-09-03 and 2026-09-05, verbatim in `docs/PROJECT-CONTEXT.md`).** Optional Google
sign-in for **sync only** (email, settings, run history; settings restored on sign-in); **runs are never gated,
no paid tier, no plan set** (an explicit exemption from the fleet plan-set rule); full fleet observability (GA4,
Amplitude, Clarity, Sentry) **behind a first-run consent dialog** with every provider off until accepted while
the CLI keeps zero network calls; the app lives in `desktop/` of this repository (macleanup pattern), releases as
`desktop-vX.Y.Z` with NSIS + MSI + `.sig` + `latest.json`, identifier `com.aoneahsan.windowsweep`, version =
the bundled CLI version; the admin surface is the Firebase console for this phase; it runs the bundled
`windowsweep.ps1` with `--json --no-color` and **reimplements no cleanup logic**. The toolchain download gate
(TASK-001) was **lifted in full** on 2026-09-05.

**Design (approved).** `desktop/design/README.md` is the argument; `desktop/design/windowsweep-click-dummy/` is
direction **02 "Reclaim"**, approved by the owner on 2026-09-05 (*"approved, looks great, get all remaining
work fully done now"*), gates 2 and 3 pre-authorised in the same message (*"Straight through to the app"*);
direction 01 was rejected on 2026-09-04 and is archived byte-identical under `_rejected/` with a post-mortem.
The language: two regimes (moment screens at variance 7 / motion 6 / density 3; cockpit screens 5 / 4 / 7), the
Reclaim Map (a real d3 treemap sized by bytes, hue by tier, lightness by staleness, with a designed zero state),
the capacity ring, Archivo's width axis as the hierarchy device with JetBrains Mono for paths, a 12-column
bento grid with three band treatments, three treatments (lime 128, sky 231, plum 320) in light and dark, three
constant semantic hues with the 22-degree accent/success separation carried by chroma and a glyph, "shutter and
drain" motion, a ten-axis pre-paint theme control, progressive disclosure on native `<details>`, and **zero
network dependencies** (plain CSS in the shape of the app's future `@theme inline`; d3 and both fonts
vendored with provenance).

**Inventory of the dummy (2026-09-05, 765 KB excluding `_rejected/` at 48 KB):** 20 HTML files - the eleven
product screens `index` (Home, 14 zones), `sections`, `run`, `splash`, `consent`, `picker`, `history`,
`report`, `account`, `settings`, `elevation`, the `pages.html` contents index, and the eight component-library
files `gallery` (actions, feedback) plus `gallery-typography`, `-forms`, `-tables`, `-display`, `-navigation`,
`-overlays`, `-charts`, each with a live playground; 28 JS files (`app.js` shell + NAV registry, `seed.js`,
`db.js` store wrapper, `reclaim-map.js`, `widgets.js`, `wire.js`, `demo.js`, `playground.js`, `gallery.js`,
eight `g-*.js`, eleven `page-*.js`); 4 CSS files (`tokens.css` 26 KB, `shared.css` 47 KB, `components.css`
34 KB, `gallery.css`); `vendor/` with 10 d3 modules and 2 variable fonts. Commits: `07c6f37` (A1/A2),
`5481891` (direction 02), `0c7b955` (round 3), `a2d6b88` (round 4), `63e815f` (gates recorded), `45953b7` (A3
gallery), `2721b75` (A4 screens and NAV wiring, handed over as WIP by this audit). Verified in earlier rounds:
contrast sweeps over 4,272 and 5,160 text nodes with 0 failures after fixing the root causes found, SVG `fill`
included; four gates (overlay contrast, axes, storage namespace, overflow) green at 1440 and 390 and each proved
red on its own plant; a rendered-DOM type audit; six interactive flows driven end to end. **Not yet done for the
A4 screens:** the inventory ledger `CLICK-DUMMY-INVENTORY.md`, the full wiring batch (the six flows through the
store), and the verification sweep across all 19 files - RW-073, RW-074, RW-075.

**What does not exist yet:** `desktop/package.json`, any `src/`, `src-tauri/`, a Firebase project, Firestore
rules, the FilesHub vault entries, `desktop-ci.yml`, `desktop-release.yml`, lockfiles, the updater keypair, a
`desktop-v` release. Owner inputs still owed: the Google OAuth desktop client id (row 15), the four telemetry keys
(row 16), the Visual Studio 2022 Build Tools UAC click (row 22 - rustup/cargo 1.98.1 are installed per-user,
`cl.exe` is absent, so nothing Rust-side links locally and the Tauri half is CI-verified until then).

**Vendored design-craft skills** (`.claude/skills/`, record `EXTERNAL-SKILLS.md`, copied 2026-09-04, forks that
do not auto-update): `ext-uiuxpm-ui-ux-pro-max`, `ext-bencium-ui-typography`, `ext-accesslint-audit`,
`ext-anthropic-theme-factory`, `ext-taste-design-taste-frontend`, `ext-cds-motion-framer`.

## 12. Owner records and registrations

- **Portfolio:** `WINDOWSWEEP_portfolio-info_2026-09-05.md` at this repository's root (outside the npm
  allowlist; CI forbids `portfolio-info` in the tarball), byte-identical to
  `ahsan-notebook/static/assets/personal/projects-info-as-portfolio-item/apps/` (refreshed to 1.1.0 by this
  audit; the rule is one dated file per location, refreshed weekly).
- **Master links JSON** (`PROJECT-LINKS-IDENTIFIERS-CONTACT.json`): entry `windowsweep` (main link = the npm
  page, repo, `links.docs` empty until the domain answers 200, `statusNote` refreshed to 1.1.0, `ownerReview`
  empty - owner row 5).
- **ORCID:** `orcid-project-projects-files/windowsweep.bib` (`aoneahsan-windowsweep-2026`, no version field)
  appended to `aoneahsan-all-works.bib`; import and work-type retype are owner row 13.
- **FilesHub** project 60 · **palette** hue 128 · **ports** 5972/5973/5974 · the Session-1 plan file
  `C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` (sections 12-18 executed; section 19 empty) ·
  the audit plan `please-audit-the-whole-streamed-nest.md` · the project memory note in
  `~/.claude/projects/D--work-windows-cleanup-root/memory/`.

## 13. The owner's part checklist

| Part | Verdict | Where the gap is specified |
|---|---|---|
| CLI / npm package, Windows engine, both launchers | **Done** - published 1.1.0 equals `main` | - |
| Self-test / CI / lint | **Done** - 151 checks, CI on both hosts, analyzer 0 | - |
| In-repo documentation (13 pages, AI guide, records) | **Done** - the stale lines found by this audit are fixed | - |
| Docs site (Docusaurus on GitHub Pages) | **Built and deployed; the domain does not resolve** | RW-040 (owner rows 11-12), RW-045 |
| SEO / AEO on the docs site | **Present** (4 JSON-LD types, meta, robots, sitemap, `llms.txt`, search); labels refreshed | - |
| OG assets | **SVG master only; no PNG export** | RW-043 |
| Post-build SEO / prerender | **Not applicable** - Docusaurus emits static HTML | - |
| Sitemap | **Done** (preset, weekly, lastmod) | - |
| Feed | **Not built** - no blog; a changelog RSS is optional | RW-046 (recorded, owner may override) |
| Backend | CLI: none, by design. Desktop: Firebase Auth + Firestore **not created** | RW-079 |
| Admin panel | Firebase console, by recorded decision | - |
| Web app / Android app / browser extension | **Not applicable** to this product | - |
| Desktop app (Tauri 2) | **Design approved; no app code yet** | RW-073 to RW-085 |
| UI / UX | CLI: console only. Desktop: dummy approved; parity GATE 4 after the app exists | RW-081 |
| i18n | CLI: n/a. Desktop: `t()` from day one plus the lint gate | RW-077 |
| Analytics / error tracking | CLI: none, by promise. Desktop: consent-gated, keys owed (row 16). Docs site: keys unset (row 18) | RW-077, RW-084 |
| Plans / pricing / referral programme | **Exempt by owner decision** for this product (runs always free) | - |
| Storytelling / Story Bible | **Absent** - owner decided 2026-09-05 to retrofit everything | RW-090 to RW-093 |
| Portfolio / master JSON / ORCID | **Present, refreshed to 1.1.0**; owner review and import pending | RW-051 (owner rows 5, 13), RW-055 |
| Verification of never-run paths | **Not done** - all owner rows | P1 |
| Social content | in the notebook by fleet rule, never in this repo | - |

## 14. Commands used for this audit (2026-09-05)

```powershell
git status --short --branch; git log --oneline -25; git diff --stat 3c4d54e..HEAD -- lib modules windowsweep.ps1 bin package.json
wc -l windowsweep.ps1 lib/*.ps1 modules/*.ps1 bin/*.js                 # 5,476 lines, 36 files, max 493
node bin\windowsweep.js --self-test --no-color --no-report            # all 151 checks passed
node bin\windowsweep.js --list --json --no-color --no-report          # 26 sections, the catalogue keys
npm run version:check; npm pack --dry-run                              # parity OK; 44 files, 109.0 / 365.7 kB
powershell -NoProfile -ExecutionPolicy Bypass -Command "Import-Module PSScriptAnalyzer; Invoke-ScriptAnalyzer -Path . -Recurse -Settings PSScriptAnalyzerSettings.psd1"
npm view windowsweep version time.modified dist.fileCount dist.unpackedSize
gh repo view aoneahsan/windowsweep --json hasWikiEnabled,repositoryTopics,homepageUrl,latestRelease
gh api repos/aoneahsan/windowsweep/tags; gh release list; gh run list --limit 8
gh repo view aoneahsan/windowsweep-docs --json repositoryTopics,homepageUrl; gh api repos/aoneahsan/windowsweep-docs/pages
curl -s -o /dev/null -w '%{http_code}' https://windowsweep-docs.aoneahsan.com/   # 000
diff CLAUDE.md AGENTS.md                                               # the two pointer lines only
cmp WINDOWSWEEP_portfolio-info_*.md <notebook copy>                    # identical
rustc --version; cargo --version; where.exe cl.exe                     # 1.98.1; 1.98.1; not found
```
