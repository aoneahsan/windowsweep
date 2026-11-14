# Safety model

> A cleanup tool should never be the reason you lose data. This page spells out every guard windowsweep applies,
> what it refuses to touch, and what it will delete. Read it once; refer back when something surprises you.

## The chokepoint

Every file and folder windowsweep removes with its own code goes through one of two helpers, `Remove-PathSafe`, or `Send-ToRecycleBin` for personal files, with a declared target root. Both resolve each path to its full form first, then refuse, in order:

1. UNC paths and drive roots, outright. A `..` segment is not refused as text: the resolved path must pass every refusal that follows, containment included;
2. fifteen declared roots: Windows, System32, SysWOW64, both Program Files folders, ProgramData, `C:\Users` with its Default and Public profiles, your profile root, its AppData folder and the Roaming, Local and LocalLow folders inside it;
3. 66 protected subtrees, 50 path patterns and 13 file names - the lists below;
4. the tool's own data folder;
5. any path you excluded yourself;
6. any path that does not lie strictly inside the target root the calling section declared.

Refusal 5 is the one you set. `--exclude-path P` names a tree, every section refuses it, and each refusal is logged as `excluded: <path>` and listed in the `--json` summary's `excluded[]`.

No flag bypasses refusals 1, 2, 3, 5 or 6. `--purge-all` changes how much of a cache goes, never where the tool may reach. Nor do `--select`, `--select-file`, `--permanent` or `--i-understand-deep`.

Refusal 4 has two doors and both are windowsweep's own housekeeping. `--prune-history N` deletes logs, reports and crash bundles older than N days, and `--uninstall-data` removes the whole folder after a confirmation `--yes` does not answer. Neither reaches anything outside `%USERPROFILE%\.windowsweep`.

### The second guard, for browsers and editors

A browser or editor target is not a path; it is a layout. windowsweep resolves it to the cache folders inside every profile it finds, and each resolved folder must also pass `Test-KnownCacheLeaf`, an allowlist of cache folder names in `lib/actions.ps1`. Anything else is refused by name with `REFUSE (not a known cache folder for a chromium layout)`. So a profile folder, a `Local Storage` folder or an extension folder is refused twice: once by the pattern list, and once because it is not on the allowlist.

## The registry chokepoint

Every registry key or value windowsweep removes passes a chokepoint of its own, `lib/registry.ps1`: a removed program's own keys, a broken uninstall entry, a startup entry whose program file is gone. Only sections 26 and 27 reach it. It checks each change against a protection table before anything else, in a dry-run too. A key outside `HKEY_CURRENT_USER` and `HKEY_LOCAL_MACHINE` is refused, and so is one that is not exactly the kind its section declared:

| Kind | Allowed only |
|---|---|
| A program's own key | under `HKCU\Software` or `HKLM\SOFTWARE`, the 32-bit view included; never a Software root itself, and never under Microsoft, Windows, Classes, Policies or another shared platform key, a hardware maker, a toolchain, a browser or windowsweep's own name |
| A broken uninstall entry | directly under one of the three Uninstall hives |
| A startup entry | one value in one of the six `Run` and `RunOnce` keys |

A change that passes is exported first, with Windows' own `reg.exe export`, to `<reports folder>\registry-backups\<run stamp>\` as a `.reg` file; double-click the file to put the key back. For a startup entry the whole `Run` key is exported, so the backup brings the value back too. A scheduled task is saved in the same folder as XML before it is unregistered, and Task Scheduler > Import Task puts it back; a task under `\Microsoft\` is never removed. If a backup cannot be written, the key or task is kept. A key under `HKEY_LOCAL_MACHINE` needs an elevated run. `--prune-history` deletes only files directly in the reports folder, so these backups stay until `--uninstall-data` removes them with the rest of `%USERPROFILE%\.windowsweep`.

Two sections write a setting rather than remove one, and neither goes through this chokepoint: section 13 marks Disk Cleanup's handlers and clears the marks afterwards, and section 29 sets a Chrome policy that stays until you remove it.

## Your own exclusions, and the machine-readable list

`--exclude-path P` (repeatable, or `excludePaths` in the config file) names a tree you want left alone. It is
enforced at the same chokepoint as everything else rather than inside one section, so it holds for **every**
section: an excluded path is refused, logged as `excluded: <path>`, and reported once in the
`excluded[]` array of the `--json` summary. A dry-run applies the same filter before it counts anything, so
the rehearsal and the run report the same files and the same bytes.

A path that is both protected and excluded reports the **protected** reason, not the exclusion. That is
deliberate: the protected list is the promise no flag can lift, and it is the stronger thing to tell you.

The protected lists are machine-readable. `--list --json` carries a `protected` object with `subtrees` (every
protected folder, resolved for this machine) and `categories` (the same sentences `--list-targets` prints).
Both readers take that list from one place, so a front end cannot show you a narrower promise than the
console does.

## What the tools it runs do on their own

Cleanup never touches the network, and the engine's own code holds no network call: self-test check [9]
greps the whole source for HTTP and socket calls and fails the build if one appears. Only sections 30, 31
and 32, for the rows you pick, ask Windows Update or winget to download; windowsweep itself sends nothing,
and it never checks for a newer windowsweep. It never starts a PC maker's driver tool either: on a
ThinkPad, Lenovo System Update queued a firmware package past its driver-only switch, so section 31 only
names the tool.

The tools it runs for you keep their own habits: `winget` and `npm` may check their own sources and
send their own telemetry; the engine itself never does.

Concretely: section 24 runs `winget list` to read what is installed, and winget refreshes its own package
sources when they are more than a few minutes old and reports its own usage to Microsoft by default.
Sections 1 and 22 run `npm` commands, and npm checks the registry for a newer npm unless you have set
`update-notifier=false`. Section 1 also runs `pnpm store prune` inside the default batch. Sections 30 and
31 ask Windows Update for their lists, and it contacts its update server; section 32 asks `winget upgrade`,
which reads its sources. That happens whenever one of those three runs, a dry-run included, and no update
is downloaded or installed until its row is picked.

None of that is windowsweep talking. It is the difference between a program that phones home and a program
that runs one which does, and it is worth knowing before you read a firewall log and blame the wrong tool.

## Never touched

| Category | Examples |
|---|---|
| Your files | Documents, Pictures, Music, Videos, Desktop, Contacts, Favorites, Links, Saved Games, Searches, 3D Objects, OneDrive, Dropbox, Google Drive, iCloud Drive |
| Credentials and agent state | `.ssh`, `.gnupg`, `.aws`, `.azure`, `.kube`, `.gcloud`, `.docker`, `.secrets`, `.password-store`, `.config`, `.local`, `.claude`, `.codex`, `.agents`, `.gemini`, `.copilot`, `.antigravity`, `.ollama`, `.vscode-server`, `.cursor-server` |
| Toolchains and installed software | `%APPDATA%\npm`, nvm, Volta, fnm, corepack, pnpm global, bun/deno/cargo/go binaries, `.rustup`, `%LOCALAPPDATA%\Programs`, WindowsApps, the Android SDK, JetBrains Toolbox |
| Browser data | profile folders as a whole; Local Storage, Session Storage, IndexedDB, cookies, logins, history, bookmarks, extensions, Sync Data, Preferences, PWA CacheStorage, Firefox places/logins/prefs |
| Editor data | `User\settings.json`, `keybindings.json`, snippets, `globalStorage`, local `History` |
| Store apps | `Packages\*\LocalState`, `Settings`, `RoamingState` |
| Windows | Prefetch (clearing it slows boot), `Windows\Installer`, WinSxS (only DISM touches it), `System32\config`, `Windows\servicing`, `Windows\Boot`, `Windows\Fonts`, `System Volume Information`, `Recovery`, `EFI`, `NTUSER.DAT`, `UsrClass.dat`, hiberfil/pagefile/swapfile (only `powercfg` touches hiberfil), Recycle Bin contents (only `Clear-RecycleBin`) |

`windowsweep --list-targets` prints every path each section can reach on your machine, then the 66 protected subtrees one per line. Four summary lines close it: the declared roots; browser profile data; editor user data, UWP LocalState and toolchains; and the protected file names alongside Prefetch, `Windows\Installer` and WinSxS.

## What it deletes, by tier

| Tier | Sections | Recoverable? |
|---|---|---|
| **Report** - reads and prints, deletes nothing in any mode | 0, 21, 22, 24, 25 | Nothing is removed |
| **Rebuilds** - caches and temp files the tool or Windows recreates on next use | 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 17, 28 | No undo. Nothing is copied first; a cache comes back because the tool that made it makes it again. Not everything in 12, 13 and 14 does - see below |
| **Slow to rebuild** - Android emulator images, recreated in Android Studio | 4 | No undo. Recreating one takes minutes and no download while its system image is still installed - but everything installed or saved inside the emulator, and its snapshots, are gone. The per-AVD idle gate exists for that reason |
| **Recycle Bin** - personal files, leftover folders and shortcuts you selected | 18, 19, 23, 27; section 26's leftover lists | The Recycle Bin, until you empty it. Section 19 always recycles selected files; `--permanent` can bypass recycling for supported other sections. Registry keys and startup entries in 26 and 27 are exported to a `.reg` file instead, and tasks to XML |
| **Permanent** | 11 (empty the Recycle Bin), 16 (event logs), 26 (a program's own uninstaller, or `Remove-AppxPackage` for a Store app) | No undo |
| **Configuration** - hibernation off or reduced, disk images compacted, a Chrome AI policy | 15 (hibernation), 20 (disk-image compaction), 29 (Chrome AI model policy) | The setting persists until you change it; section 15 removes `hiberfil.sys` and `powercfg /hibernate on` puts it back |
| **Update** - installs the updates you pick | 30 (Windows Update), 31 (Windows Update drivers, old driver packages), 32 (winget) | No undo from windowsweep, which keeps no copy of what an update replaces. Old driver packages removed in 31 are gone, but the newest two copies of each driver stay, so Device Manager's Roll Back keeps working |

Sections 13 and 14 hand their work to Windows' own cleanup and component-store tools, and some of what
those remove does not come back: a previous Windows installation, superseded drivers and components, and
crash dumps. `--reset-base` additionally removes the ability to uninstall the updates already installed.
The tier name describes the rule; those are the exceptions to it.

## The idle gate

The engine samples each volume to see whether last-access times are live. Where they are, idle age uses
write and creation time so an indexer reading an old file does not make it look new. Elsewhere it uses
the newest of write, access and creation. The default window is `--days 100`; temp entries use
`--temp-days 3`. The JSON summary names volumes where last-access is live in `access_live_volumes`.
An idle timestamp is a clue for review, not proof that a personal file is unneeded.

Versioned tool caches (Cypress, Playwright, Gradle distributions, Squirrel `app-x.y.z` folders) also apply a
**keep-newest** rule: the freshest version of each tool is never removed by the idle gate.

## Developer mode

The saved developer answer changes seven sections, in two ways. Sections 1, 2, 3 and 5 prune by the idle gate when the answer is yes and clear their caches completely when it is no. Sections 4, 17 and 20 are skipped when the answer is no. Nothing in either mode changes what the tool may reach; it changes whether a cache is pruned or cleared, and whether a section runs at all. See [Developer mode](./developer-mode.md).

## Batch policy

| Policy | Sections | Unattended (`--all`, `--only`, `--profile`) |
|---|---|---|
| safe | 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21, 28 (+12, 13 when elevated); 22, 24, 25 are read-only and safe but are not in `--all` | run with `--yes` |
| opt-in | 4, 14 | run only when named in `--only` or a profile, with `--yes` |
| deep | 11, 15, 16, 20, 29 | refused without `--i-understand-deep`; `--dry-run` previews are allowed |
| interactive | 17, 18, 19, 23, 26, 27, 30, 31, 32 | never, unless a selection was supplied; they need a person choosing items |

`--yes` never applies to personal files, project files, programs or updates: interactive sections show their selection prompt
even with `--yes`, default to none, and ask a final question `--yes` does not answer. Section 20's disk
picker is the documented exception (deep-gated, `--yes` selects every disk).

**A scripted selection is a person's choice, and it is the one thing that does lift the interactive
refusal.** `--select 1,3` and `--select-file paths.txt` name exactly which items go, in advance, so a script
or a GUI can drive these sections unattended - and because the naming is explicit, the selection also answers
the section's final confirmation. It is a narrow, deliberate door: the refusal exists to stop *unchosen*
deletion, not scripted deletion. `--yes` on its own still selects nothing and still answers nothing, and
neither flag reaches anything the deletion chokepoint would otherwise refuse.

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
`Dism`, `powercfg`, `wevtutil`, `diskpart`, service stop/start, registry writes, uninstallers,
`Remove-AppxPackage`, `pnputil`, Windows Update installs and `winget upgrade`), printing what would happen
and tallying an estimate. The registry chokepoint still checks every key against its
protection table, so a refused key is refused in the rehearsal too. Sections 30 to 32 still ask Windows
Update and winget for their lists; they download and install nothing. The self-test compares a fixture
tree's file names, sizes, write times and directories before and after a dry-run to check that it did not
change.

## No undo

Sections 11 and 16 have no undo of any kind: they empty the Recycle Bin and clear the Windows event logs. Both require `--i-understand-deep`. Section 26 also has no undo when you select a program or Store app to remove, and sections 30 to 32 keep no copy of what an update replaces. `--permanent` can delete supported selected leftovers outright, but section 19 always sends selected personal files to the Recycle Bin. The rebuild tiers are one-way as well. For files there is no copy, no staging folder and no restore command: a cache is gone the moment it is removed, and it comes back only because the tool that made it makes it again. The registry is the one exception: every key and startup entry sections 26 and 27 remove is exported to a `.reg` file first, and every task to XML, as [the registry chokepoint](#the-registry-chokepoint) describes. The session log records three shapes rather than one. `Remove-PathSafe` and `Send-ToRecycleBin` write a line per path with its size. A prune writes one line per folder instead: how many files went, how many bytes, and from where. An external command writes the command and the code it exited with. The JSON report records every section's outcome. All of it is a record of what happened, not a way to reverse it.

## Inspect before you trust

```powershell
windowsweep --self-test       # the guards, on this machine
windowsweep --list-targets    # every path the tool can touch
windowsweep --scan            # sizes, read-only
windowsweep --dry-run --all --yes
```

Last Updated: 2026-11-14
