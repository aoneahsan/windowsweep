# Safety model

> A cleanup tool should never be the reason you lose data. This page spells out every guard windowsweep applies,
> what it refuses to touch, and what it will delete. Read it once; refer back when something surprises you.

## The chokepoint

Every file and folder windowsweep removes with its own code passes through one function, `Remove-PathSafe` (or `Send-ToRecycleBin` for personal files), with a declared target root. It refuses, in order:

1. paths with `..` segments, UNC paths and drive roots;
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

windowsweep makes no network call. Self-test check [9] greps the whole source for HTTP and socket calls and
fails the build if one appears, and there is no update check anywhere in it.

The tools it runs for you keep their own habits: `winget` and `npm` may check their own sources and
send their own telemetry; the engine itself never does.

Concretely: section 24 runs `winget list` to read what is installed, and winget refreshes its own package
sources when they are more than a few minutes old and reports its own usage to Microsoft by default.
Sections 1 and 22 run `npm` commands, and npm checks the registry for a newer npm unless you have set
`update-notifier=false`. Section 1 also runs `pnpm store prune` inside the default batch.

None of that is windowsweep talking. It is the difference between a program that phones home and a program
that runs one which does, and it is worth knowing before you read a firewall log and blame the wrong tool.

## Never touched

| Category | Examples |
|---|---|
| Your files | Documents, Pictures, Music, Videos, Desktop, Contacts, Favorites, Links, Saved Games, Searches, 3D Objects, OneDrive, Dropbox, Google Drive, iCloud Drive |
| Credentials and agent state | | Credentials and agent state | `.ssh`, `.gnupg`, `.aws`, `.azure`, `.kube`, `.gcloud`, `.docker`, `.secrets`, `.password-store`, `.config`, `.local`, `.claude`, `.codex`, `.agents`, `.gemini`, `.copilot`, `.antigravity`, `.ollama`, `.vscode-server`, `.cursor-server` | |
| Toolchains and installed software | `%APPDATA%\npm`, nvm, Volta, fnm, corepack, pnpm global, bun/deno/cargo/go binaries, `.rustup`, `%LOCALAPPDATA%\Programs`, WindowsApps, the Android SDK, JetBrains Toolbox |
| Browser data | profile folders as a whole; Local Storage, Session Storage, IndexedDB, cookies, logins, history, bookmarks, extensions, Sync Data, Preferences, PWA CacheStorage, Firefox places/logins/prefs |
| Editor data | `User\settings.json`, `keybindings.json`, snippets, `globalStorage`, local `History` |
| Store apps | `Packages\*\LocalState`, `Settings`, `RoamingState` |
| Windows | | Windows | Prefetch (clearing it slows boot), `Windows\Installer`, WinSxS (only DISM touches it), `System32\config`, `Windows\servicing`, `Windows\Boot`, `Windows\Fonts`, `System Volume Information`, `Recovery`, `EFI`, `NTUSER.DAT`, `UsrClass.dat`, hiberfil/pagefile/swapfile (only `powercfg` touches hiberfil), Recycle Bin contents (only `Clear-RecycleBin`) | |

`windowsweep --list-targets` prints every path each section can reach on your machine, then the 66 protected subtrees one per line. Four summary lines close it: the declared roots; browser profile data; editor user data, UWP LocalState and toolchains; and the protected file names alongside Prefetch, `Windows\Installer` and WinSxS.

## What it deletes, by tier

| Tier | Sections | Recoverable? |
|---|---|---|
| **Rebuilds** - caches and temp files the tool or Windows recreates on next use | 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 17 | The data reappears on demand; a rebuild costs time, not information |
| **Slow to rebuild** - Android emulator images | 4 | Recreate in Android Studio; the per-AVD idle gate exists for this reason |
| **Recycle Bin** - personal files you selected | 18, 19, 23 | Yes, until you empty the bin (`--permanent` bypasses it) |
| **Report only** - reads and prints, deletes nothing | 0, 21, 22, 24, 25 | Nothing is removed, so there is nothing to recover |
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

## Developer mode

The saved developer answer changes seven sections, in two ways. Sections 1, 2, 3 and 5 prune by the idle gate when the answer is yes and clear their caches completely when it is no. Sections 4, 17 and 20 are skipped when the answer is no. Nothing in either mode changes what the tool may reach; it changes whether a cache is pruned or cleared, and whether a section runs at all. See [Developer mode](./developer-mode.md).

## Batch policy

| Policy | Sections | Unattended (`--all`, `--only`, `--profile`) |
|---|---|---|
| safe | 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21 (+12, 13 when elevated); 22, 24, 25 are read-only and safe but are not in `--all` | run with `--yes` |
| opt-in | 4, 14 | run only when named in `--only` or a profile, with `--yes` |
| deep | 11, 15, 16, 20 | refused without `--i-understand-deep`; `--dry-run` previews are allowed |
| interactive | 17, 18, 19, 23 | never, unless a selection was supplied; they need a person choosing items |

`--yes` never applies to personal or project files: sections 17, 18, 19 and 23 show their selection prompt
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
`Dism`, `powercfg`, `wevtutil`, `diskpart`, service stop/start, registry writes), printing what would happen and
tallying an estimate. The self-test hashes a fixture tree before and after a dry-run to prove nothing changed.

## No undo

## No undo

Two sections have no undo of any kind. Section 11 empties the Recycle Bin and section 16 clears the Windows event logs. What they remove does not come back, and nothing is copied first, so an unattended run refuses both without `--i-understand-deep`. `--permanent` puts the Recycle Bin tier in the same position: sections 18, 19 and 23 then delete outright instead of recycling. The rebuild tiers are one-way as well. There is no copy, no staging folder and no restore command: a cache is gone the moment it is removed, and it comes back only because the tool that made it makes it again. Personal files go to the Recycle Bin by default precisely because they have no regenerating source. The session log records three shapes rather than one. `Remove-PathSafe` and `Send-ToRecycleBin` write a line per path with its size. A prune writes one line per folder instead: how many files went, how many bytes, and from where. An external command writes the command and the code it exited with. The JSON report records every section's outcome. All of it is a record of what happened, not a way to reverse it.

## Inspect before you trust

```powershell
windowsweep --self-test       # the guards, on this machine
windowsweep --list-targets    # every path the tool can touch
windowsweep --scan            # sizes, read-only
windowsweep --dry-run --all --yes
```

Last Updated: 2026-09-08
