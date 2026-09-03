# Sections 0-21

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

Last Updated: 2026-09-03
