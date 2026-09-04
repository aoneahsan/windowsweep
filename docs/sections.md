# Sections 0-25

Every cleanup operation lives in one numbered section. Numbers are a public contract: a section may be
retired as a no-op, never renumbered. `windowsweep --list` prints the table; `--list-targets` prints every
path each section can reach on your machine.

| # | Section | Tier | Admin | Batch |
|---|---|---|---|---|
| 0 | System health report | report | - | safe |
| 1 | Package-manager caches | rebuilds | - | safe, developer-gated |
| 2 | Build-tool caches | rebuilds | - | safe, developer-gated |
| 3 | Test-runner browsers | rebuilds | - | safe, developer-gated |
| 4 | Android emulators (AVDs) | slow | - | opt-in |
| 5 | Docker | rebuilds | - | safe, developer-gated |
| 6 | Editor caches and extensions | rebuilds | - | safe |
| 7 | Browser caches | rebuilds | - | safe |
| 8 | Desktop-app caches | rebuilds | - | safe |
| 9 | Windows user caches | rebuilds | - | safe |
| 10 | User temp | rebuilds | - | safe |
| 11 | Recycle Bin | permanent | - | deep |
| 12 | Windows Update and system temp | rebuilds | admin | safe when elevated |
| 13 | Disk Cleanup engine | rebuilds | admin | safe when elevated |
| 14 | Component store (DISM) | rebuilds | admin | opt-in |
| 15 | Hibernation file | config | admin | deep |
| 16 | Event logs | permanent | admin | deep |
| 17 | Stale project build artefacts | rebuilds | - | interactive |
| 18 | Partial downloads | Recycle Bin | - | interactive |
| 19 | Large stale personal files | Recycle Bin | - | interactive |
| 20 | Disk-image compaction | config | admin | deep |
| 21 | Disk usage report | report | - | safe |
| 22 | Global packages audit | report | - | safe, audit only |
| 23 | Orphaned application data | Recycle Bin | - | interactive |
| 24 | Installed programs not modified for N+ days | report | - | safe, audit only |
| 25 | Startup items audit | report | - | safe, audit only |

"Developer-gated" means the idle gate applies in developer mode and the cache is cleared completely otherwise
([Developer mode](./developer-mode.md)). Every section honours `--dry-run`. Tier `recycle` means the item goes
to the Recycle Bin (`--list` shows `recycle`).

## 0 - System health report

Read-only. Windows build, uptime, RAM, PowerShell version, elevation state (and whether the account can
elevate), developer mode and detected tooling, a drive table with a warning under 10% free, `hiberfil.sys` size
and hibernation state, page file, Docker/WSL disk images, WSL distros, startup-item count, Storage Sense,
last-access tracking, and the running apps whose caches will be skipped.

## 1 - Package-manager caches

npm (`_cacache`, `_npx`, `_logs`), Yarn v1 and Berry, pnpm (`pnpm store prune` when pnpm is installed),
bun, deno, pip, uv (`uv cache prune` first), poetry, Composer, NuGet (http/plugins/scratch caches and the global
packages folder), Cargo registry and git checkouts, Go build and module caches, Dart/Flutter pub cache, Electron
and node-gyp download caches, Scoop's installer cache. Globally installed packages and version managers are
protected. `--purge-all` clears everything (and runs `npm cache clean --force`).

## 2 - Build-tool caches

Gradle caches (idle files), wrapper distributions (keep newest), daemon logs older than 7 days and `.tmp`;
Maven's local repository (idle files); Android SDK manager cache, build cache and download leftovers; Unity's
cache; JetBrains IDE caches per IDE version, removed only when that whole version has been idle for the window
(the Toolbox itself is protected); .NET telemetry storage. Idle Gradle daemons are stopped first so their files
are not locked.

## 3 - Test-runner browsers

Cypress versions, Playwright browsers (per browser family), Playwright-Go and Puppeteer downloads. The newest
build of each family is always kept; older builds go once idle for the window. A missing build is re-downloaded
by the next `npx cypress install` / `npx playwright install`.

## 4 - Android emulators

Each `.avd` folder plus its `.ini` is one unit, removed only when nothing inside it changed for the window
(booting an emulator updates its files). Skipped while an emulator is running. Not part of `--all`; run it with
`--only 4 --yes` or from the walkthrough.

## 5 - Docker

Needs the Docker CLI and a running daemon. Developer mode: `docker image prune -f` (dangling layers),
`docker builder prune --filter until=<N days>`, `docker image prune -a --filter until=<N days>` (images no
container uses, older than the window). Developer mode off or `--purge-all`: `docker system prune -a -f`.
Volumes are never touched. The disk image itself only shrinks through section 20.

## 6 - Editor caches and extensions

VS Code, VS Code Insiders, VSCodium, Cursor and Windsurf: `Cache`, `CachedData`, `CachedProfilesData`,
`CachedExtensionVSIXs`, `Code Cache`, `GPUCache`, Dawn caches, service-worker caches, crash reports, logs older
than 7 days, `workspaceStorage` entries whose folder no longer exists, and extension folders the editor's own
`extensions.json` does not reference (uninstalled or superseded versions). Visual Studio's ComponentModelCache,
designer shadow cache, AppInsights and SQM logs. A running editor is left alone except for its VSIX cache and
old logs.

## 7 - Browser caches

Chrome (stable, Beta, Dev, Canary), Edge, Brave, Vivaldi, Opera and Opera GX, Chromium, Arc, Firefox,
LibreWolf and Waterfox. For every profile: `Cache`, `Code Cache`, `GPUCache`, shader and Dawn caches, the
service-worker script cache; at the root: shader caches, Crashpad reports, SwReporter. Profile data is never
touched. A browser that is open is skipped entirely.

## 8 - Desktop-app caches

Discord (and Canary/PTB), Slack (installer and Store), Teams classic and new, Zoom logs, Spotify's streaming
cache, Postman, Figma, Notion, Signal, Skype, GitHub Desktop, Obsidian, the Claude desktop app, Linear,
Granola, Insomnia, Steam and Epic web caches and logs, Adobe media caches (idle files), OBS logs and crash
reports, Squirrel installer temp, pending Electron updater downloads older than 7 days, and superseded Squirrel
`app-x.y.z` versions (Discord, Postman, Figma, GitHub Desktop, Slack). Running apps are skipped.

## 9 - Windows user caches

INetCache, the user Windows Error Reporting queue, crash dumps older than 7 days, DirectX / NVIDIA / AMD /
Intel shader caches, the Remote Desktop bitmap cache, OneDrive logs, Store-app `TempState`, `AC\Temp` and
`AC\INetCache`, themes' cached files, PowerShell startup profile data, CLR usage logs, Explorer's
thumbcache/iconcache leftovers and startup logs, the schema cache, per-user Delivery Optimization cache, the
certificate URL cache, diagnostics results older than 30 days, and `ipconfig /flushdns`.

## 10 - User temp

`%TEMP%`, `%TMP%`, `AppData\Local\Temp` and `AppData\LocalLow\Temp`: files idle `--temp-days`+ days
(default 3), then empty folders. Files a running program holds open are skipped.

## 11 - Recycle Bin

`Clear-RecycleBin -Force` on every drive after a separate confirmation. Permanent. Deep-gated.

## 12 - Windows Update and system temp (admin)

Stops `wuauserv` and `bits`, clears `SoftwareDistribution\Download`, restarts them; runs
`Delete-DeliveryOptimizationCache`; prunes `C:\Windows\Temp` and the service-profile temp folders by
`--temp-days`; CBS, DISM and Windows Update logs older than 30 days; live kernel reports older than 7 days; the
system Windows Error Reporting queue, archive and temp.

## 13 - Disk Cleanup engine (admin)

Runs `cleanmgr /sagerun:77` with a curated handler list: Temporary Files, Temporary Setup Files, Setup and
Upgrade logs, Update Cleanup, Delivery Optimization Files, Thumbnail Cache, D3D Shader Cache, System error
memory dumps and minidumps, Windows Error Reporting Files, Previous Installations, Old ChkDsk Files, Content
Indexer Cleaner, Device Driver Packages, Downloaded Program Files, Offline Pages, Diagnostic Data Viewer
database, BranchCache, RetailDemo content, Windows Defender, Active Setup Temp Folders, Temporary Sync Files,
Upgrade Discarded Files. Never enabled: DownloadsFolder, Recycle Bin, User file versions, Windows ESD
installation files, Language Pack. The registry flags are removed afterwards. Cleanmgr cannot preview sizes, so
the dry-run lists the handlers only.

## 14 - Component store (admin)

`Dism /Online /Cleanup-Image /AnalyzeComponentStore` (read-only) then `/StartComponentCleanup`. Slow, safe.
`--reset-base` adds `/ResetBase`, which also removes the ability to uninstall installed updates. Opt-in.

## 15 - Hibernation file (admin)

`hiberfil.sys` is about 40% of RAM. `--hiberfil off` removes it (`powercfg /hibernate off`): Sleep still works;
Hibernate, Fast Startup and hibernate-on-critical-battery do not. `--hiberfil reduced` keeps Fast Startup at a
smaller file. `keep` leaves it. Interactive runs ask; batch runs need the flag. Deep-gated.

## 16 - Event logs (admin)

`wevtutil cl` for every log. Permanent loss of troubleshooting history. Deep-gated.

## 17 - Stale project build artefacts

Scans project roots (auto-detected folders such as `~\source\repos`, `~\Projects`, `~\code`, `D:\work`, or
`--scan-roots "P1;P2"`) for `node_modules`, `dist`, `build`, `out`, `.next`, `.nuxt`, `.turbo`, `.vite`,
`.svelte-kit`, `.astro`, `.parcel-cache`, `target`, `vendor`, `coverage`, `.nyc_output`, `__pycache__`,
`.pytest_cache`, `.dart_tool`, `.angular` and `bin`/`obj` beside a `.csproj`. A folder is listed only when its
parent looks like a project and the project's source files have been idle for the window. You select what goes.
Refuses to scan a whole drive or the profile root; never enters `.git`, AppData or toolchain folders. Writes
`stale-builds-<stamp>.txt` even in dry-run. Interactive only. `--yes` never selects here: the prompt appears
even with `--yes`, Enter selects nothing, and the final question is never auto-answered.

## 18 - Partial downloads

`.crdownload`, `.part`, `.partial`, `.fdmdownload`, `.opdownload`, `.!ut`, `.aria2`, `.download`, `.bc!`
and `.tmp` files in Downloads (4 levels deep). You select; selected files go to the Recycle Bin. Interactive
only; `--yes` never selects and never answers the final question.

## 19 - Large stale personal files

Files of `--large-file-mb`+ MB (default 100) in Downloads that nothing touched for the window, largest first.
You select; selected files go to the Recycle Bin (`--permanent` deletes instead). Interactive only; `--yes`
never selects and never answers the final question.

## 20 - Disk-image compaction (admin)

Lists Docker Desktop and WSL `.vhdx` files, stops Docker Desktop and runs `wsl --shutdown`, then
`diskpart` `compact vdisk` on the ones you select. A virtual disk grows with writes but never shrinks on its
own; compaction returns the free space to Windows. Restart Docker Desktop afterwards. Deep-gated.

## 21 - Disk usage report

Read-only: drive table, hibernation file, disk images, and the 20 largest entries of your profile,
`AppData\Local`, `AppData\Roaming` and the system drive root, with protected entries marked. Writes
`disk-usage-<stamp>.txt`.

## 22 - Global packages audit

Read-only. Lists what `npm`, `pnpm`, `yarn`, `bun` and `deno` installed globally, with each package's
version, size and how long it has been since anything touched it, then prints the exact uninstall command
for the ones nothing seems to need. **It never uninstalls anything**, in any mode - several of these roots
(`nvm4w`, `AppData\Roaming\npm`, `pnpm\global`, `.bun`, `.deno\bin`) are protected paths the tool refuses to
delete from, so the section declares no deletable target at all.

A package is a *candidate* only when all three are true: nothing has touched it for `--days`+ days, no
`package.json` under your project scan roots that changed inside that window names it (dependencies or a
`scripts` line), and it is not one of `npm`, `corepack`, `pnpm`, `yarn` or `windowsweep`. A candidate that a
project also installs locally is marked, because the local copy is the one that actually runs.

Windows keeps no record of when a command last ran, so "idle" here means the package folder's own files have
not changed. Writes `global-packages-<stamp>.txt`. Part of the `audit` profile.

## 23 - Orphaned application data

Interactive only. Top-level folders under `%APPDATA%` and `%LOCALAPPDATA%` that no installed program claims
and that nothing has touched for `--days`+ days - what an uninstaller left behind. You select what goes and
it lands in the **Recycle Bin** (`--permanent` deletes instead). `--yes` never selects here; `--dry-run`
lists and removes nothing.

A folder is claimed - and therefore never offered - when any of these names it: an entry in the three
uninstall registry hives (display name, publisher, or the leaf of its install location), a folder under
`Program Files`, `Program Files (x86)`, `%LOCALAPPDATA%\Programs` or `WindowsApps`, a Store package, or a
running process. Matching is deliberately generous: a token that merely starts with the folder name, or the
reverse, counts as a claim, because wrongly calling something orphaned is the expensive mistake.

**It fails closed.** If the uninstall hives cannot be read at all, the section reports that and produces
**zero** candidates - an empty list of installed programs must never read as "everything is orphaned".

Never offered: `Microsoft`, `Windows`, `Packages` (Store apps own their own lifecycle), `Programs`, `Temp`,
`Comms`, `ConnectedDevicesPlatform`, `D3DSCache`, `Google`, `Mozilla`, `CrashDumps`, `VirtualStore`,
`PeerDistRepub`, `Publishers`, `History`, `IconCache`, `ElevatedDiagnostics`, the shell folders, and the
platform folders `IsolatedStorage`, `ToastNotificationManagerCompat`, `AppV`, `Package Cache`, `DBG` and the
`CLR_v4.0` pair. On top of that, **every vendor folder another section already cleans is excluded
automatically**, derived from the declared target list at run time so it cannot drift.

## 24 - Installed programs not modified for N+ days

Read-only. Reads the three uninstall hives and lists non-system programs, largest first, whose files under
their install location have not been modified for `--days`+ days, each with the command that removes it -
`winget uninstall --id <id>` when one `winget list` call resolves it, otherwise the program's own
`UninstallString`. Store apps are listed separately with `Remove-AppxPackage` hints. **It never runs an
uninstaller.**

The number is **"not modified", not "not used"**: Windows keeps no reliable last-launched record. It is
measured from last-write times only, because last-access is live on many systems and would report every
program as touched today. A program with no recorded install location cannot be measured and is not listed.
Writes `installed-programs-<stamp>.txt`. Part of the `audit` profile.

## 25 - Startup items audit

Read-only. One table of everything that launches at sign-in or boot: `Run` and `RunOnce` under HKCU, HKLM and
`WOW6432Node`, both Startup folders, scheduled tasks with a logon trigger, and `Win32_StartupCommand`, each
marked enabled or disabled. **It changes nothing** - the tool shows them, you change them in Task Manager >
Startup, where you can undo it.

The enabled/disabled state comes from Explorer's `StartupApproved` record, and specifically from the disable
timestamp it stores: a value carrying a real timestamp was switched off, one whose timestamp is zero is on. A
value too short to read is reported as `unknown` rather than guessed. Writes `startup-items-<stamp>.txt`.
Part of the `audit` profile.

## Candidate targets awaiting verification

A path becomes a target only once it has been seen on a real machine holding only regenerable data. These are
researched but **not shipped**, because the software is not installed on the build machine and a guessed path
is exactly what this rule exists to prevent. Each will be added once its folder can be confirmed.

| Would join | Candidate | What has to be seen first |
|---|---|---|
| 8 | Telegram Desktop `tdata\user_data\cache` and `media_cache` | Telegram installed; the two folders present |
| 8 | WhatsApp (Store) cache leaf under its package `LocalCache` | the exact leaf name, which the package layout decides |
| 8 | Microsoft Office `16.0\OfficeFileCache` (prune only, Office guards) | Office installed - it holds unsynced changes, so it is pruned, never cleared |
| 8 | Steam `steamapps\shadercache` per library in `libraryfolders.vdf` | Steam with games installed (the build machine has Steam but no games) |
| 8 | WebView2 `%LOCALAPPDATA%\*\EBWebView` as a Chromium layout | a host app that uses it; the layout itself is already proven by the Teams target |
| 1 | `~\.cache\torch` | PyTorch installed |
| 1 | `conda clean --all --yes` | conda on `PATH` |
| new | Driver and upgrade leftovers: `C:\NVIDIA`, `ProgramData\NVIDIA Corporation\Downloader`, `C:\AMD`, `C:\ESD` | any of them present on a machine with that vendor's driver |

**`C:\Intel` was inspected and rejected.** It exists on the build machine but holds `Thunderbolt`, `Logs` and
a hidden `GfxCPLBatchFiles` - driver support content, not installer extraction leftovers. It will not become
a target.

Last Updated: 2026-09-04
