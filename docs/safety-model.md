# Safety model

> A cleanup tool should never be the reason you lose data. This page spells out every guard windowsweep applies,
> what it refuses to touch, and what it will delete. Read it once; refer back when something surprises you.

## The chokepoint

Every deletion passes through one function, `Remove-PathSafe` (or `Send-ToRecycleBin` for personal files),
with a declared target root. It refuses, in order:

1. paths with `..` segments, UNC paths, drive roots;
2. Windows, `System32`, Program Files, ProgramData, `C:\Users`, your profile root and the AppData roots;
3. every protected subtree, pattern and file name listed below;
4. any path that does not lie strictly inside the target root the calling section declared;
5. the tool's own data folder.

No flag bypasses steps 1-5. `--purge-all` changes how much of a cache goes, never where the tool may reach.

## Never touched

| Category | Examples |
|---|---|
| Your files | Documents, Pictures, Music, Videos, Desktop, Contacts, Favorites, Links, Saved Games, Searches, 3D Objects, OneDrive, Dropbox, Google Drive, iCloud Drive |
| Credentials and agent state | `.ssh`, `.gnupg`, `.aws`, `.azure`, `.kube`, `.gcloud`, `.docker`, `.secrets`, `.config`, `.local`, `.claude`, `.codex`, `.agents`, `.gemini`, `.copilot`, `.ollama` |
| Toolchains and installed software | `%APPDATA%\npm`, nvm, Volta, fnm, corepack, pnpm global, bun/deno/cargo/go binaries, `.rustup`, `%LOCALAPPDATA%\Programs`, WindowsApps, the Android SDK, JetBrains Toolbox |
| Browser data | profile folders as a whole; Local Storage, Session Storage, IndexedDB, cookies, logins, history, bookmarks, extensions, Sync Data, Preferences, PWA CacheStorage, Firefox places/logins/prefs |
| Editor data | `User\settings.json`, `keybindings.json`, snippets, `globalStorage`, local `History` |
| Store apps | `Packages\*\LocalState`, `Settings`, `RoamingState` |
| Windows | Prefetch (clearing it slows boot), `Windows\Installer`, WinSxS (only DISM touches it), `System Volume Information`, `NTUSER.DAT`, `UsrClass.dat`, hiberfil/pagefile/swapfile (only `powercfg` touches hiberfil), Recycle Bin contents (only `Clear-RecycleBin`) |

`windowsweep --list-targets` prints every path the tool can reach and the protected list as the running
script sees it.

## What it deletes, by tier

| Tier | Sections | Recoverable? |
|---|---|---|
| **Rebuilds** - caches and temp files the tool or Windows recreates on next use | 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 17 | The data reappears on demand; a rebuild costs time, not information |
| **Slow to rebuild** - Android emulator images | 4 | Recreate in Android Studio; the per-AVD idle gate exists for this reason |
| **Recycle Bin** - personal files you selected | 18, 19 | Yes, until you empty the bin (`--permanent` bypasses it) |
| **Permanent** | 11 (empty the Recycle Bin), 16 (event logs) | No |
| **Configuration** | 15 (hibernation), 20 (disk-image compaction) | Reversible with `powercfg /hibernate on`; compaction loses nothing |

## The idle gate

A cache file goes only when its newest timestamp (last write, last access, creation) is at least `--days` old
(default 100). Windows disables last-access updates on most volumes, so the tool reads the newest of the three
and errs toward "recently used". A background indexer that touches one file inside a tool version makes the
whole version look fresh; the consequence is that the tool keeps more, never less.

Versioned tool caches (Cypress, Playwright, Gradle distributions, Squirrel `app-x.y.z` folders) also apply a
**keep-newest** rule: the freshest version of each tool is never removed by the idle gate.

## Developer mode

Sections 1-5 behave differently depending on the saved developer answer - see
[Developer mode](./developer-mode.md). Nothing in that mode changes what the tool may reach; it changes whether
a cache is pruned by the idle gate or cleared completely.

## Batch policy

| Policy | Sections | Unattended (`--all`, `--only`, `--profile`) |
|---|---|---|
| safe | 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21 (+12, 13 when elevated) | run with `--yes` |
| opt-in | 4, 14 | run only when named in `--only` or a profile, with `--yes` |
| deep | 11, 15, 16, 20 | refused without `--i-understand-deep`; `--dry-run` previews are allowed |
| interactive | 17, 18, 19 | never; they need a person selecting items |

`--yes` never applies to personal files. Sections 18 and 19 ask a separate question that `--yes` does not answer.

## Running programs

A browser, editor or app that is open keeps its cache files locked and half-written. Its targets are skipped
with a `skipped: X is running` line and a hint to re-run the section after closing it. Files any program has
open are skipped individually and counted, never treated as errors.

## Links and long paths

The walker checks the reparse-point attribute before descending, so a junction or symlink is removed as a
link and its target is never entered. Paths beyond 260 characters (deep `node_modules`) are handled through
the `\\?\` prefix. The self-test proves both with a real junction and a 400+ character path.

## Dry-run

`--dry-run` short-circuits every deletion helper and every destructive external command (`docker`, `cleanmgr`,
`Dism`, `powercfg`, `wevtutil`, `diskpart`, service stop/start, registry writes), printing what would happen and
tallying an estimate. The self-test hashes a fixture tree before and after a dry-run to prove nothing changed.

## No undo

Deletion is one-way for the rebuild tiers. The session log records every path removed with its size, and the
JSON report records every section's outcome. Personal files go to the Recycle Bin by default precisely because
they have no regenerating source.

## Inspect before you trust

```powershell
windowsweep --self-test       # the guards, on this machine
windowsweep --list-targets    # every path the tool can touch
windowsweep --scan            # sizes, read-only
windowsweep --dry-run --all --yes
```

Last Updated: 2026-09-03
