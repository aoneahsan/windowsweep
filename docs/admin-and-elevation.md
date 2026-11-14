# Admin sections and elevation

Sections 12, 13, 14, 15, 16, 20, 27 and 29 change things only an administrator may change. Sections 26, 30
and 31 need an elevated run for part of their work, shown in the second table below. windowsweep never asks
for a password and never stores one; it detects whether the current console is elevated and, when it is
not, skips that work with the exact command that runs it.

## What each admin section does

| # | Section | Effect |
|---|---|---|
| 12 | Windows Update and system temp | Stops `wuauserv`/`bits`, clears the update download cache, restarts them; Delivery Optimization cache; `C:\Windows\Temp`; old CBS/DISM/WU logs; system WER queues |
| 13 | Disk Cleanup engine | `cleanmgr /sagerun:77` with a curated handler list - never Downloads, Recycle Bin, File History, ESD files or language packs |
| 14 | Component store | `Dism /StartComponentCleanup` (slow; `--reset-base` opt-in) |
| 15 | Hibernation file | `powercfg /hibernate off` or `/type reduced` |
| 16 | Event logs | `wevtutil cl` for every log (permanent) |
| 20 | Disk-image compaction | Stops Docker Desktop and WSL, `diskpart compact vdisk` on selected `.vhdx` files |
| 27 | Leftovers of uninstalled programs | Offers leftover folders under Program Files, Common Files and ProgramData, then registry keys, Start-menu shortcuts, startup entries and tasks, for selection; a `.reg` or XML backup comes first, and folders and shortcuts go to the Recycle Bin |
| 29 | Chrome on-device AI model policy | Sets a persistent Chrome policy that removes the downloaded model |

12 and 13 join `--all` automatically when the console is already elevated. 14 is opt-in, because it is slow, and stays out of `--all` even when elevated. 15, 16, 20 and 29 are deep-gated; 27 requires selection.

## Sections that need elevation for part of their work

| # | Works unelevated | Needs an elevated run |
|---|---|---|
| 26 | the list; removing per-user programs and Store apps, and clearing broken entries under `HKEY_CURRENT_USER` | a program installed for all users, or its broken entry; leftover keys and startup entries under `HKEY_LOCAL_MACHINE`; scheduled tasks; the RAN column, read from Windows' Prefetch folder |
| 30 | the list of what Windows Update offers; a dry-run | installing. An unelevated real run lists, then refuses before asking you to pick |
| 31 | the problem-device, old-driver and PC-maker notes; the list of Windows Update drivers | installing a driver, and listing or removing old driver packages, because only an elevated run can read the driver store |
| 32 | everything | nothing. An installer that writes for every user may show its own UAC prompt |

Run them elevated with `windowsweep --only 26 --elevate`, `--only 30 --elevate` or `--only 31 --elevate`. None of them is in `--all`, a profile or the walkthrough: each asks you to pick rows.

## `--elevate`

```powershell
windowsweep --profile system --yes --elevate
```

The tool relaunches itself through `Start-Process -Verb RunAs`, Windows shows the UAC prompt, and the elevated
run opens in a new window with its own log and report under `~\.windowsweep`. The original window waits and
prints the child's exit code. Your account must be a member of Administrators; a standard user is told so by
section 0.

The one-liner that also removes the hibernation file:

```powershell
windowsweep --only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate
```

## The hibernation decision

`hiberfil.sys` holds a copy of RAM and is roughly 40% of it - 16 GB on a 40 GB machine - permanently, on the
system drive.

| Choice | Frees | You keep | You lose |
|---|---|---|---|
| `--hiberfil off` | the whole file | Sleep | Hibernate, Fast Startup, hibernate when the battery is critical |
| `--hiberfil reduced` | about half | Fast Startup, Sleep | Hibernate |
| `--hiberfil keep` | nothing | everything | - |

Running speed is unaffected either way; the gain is disk space, which matters most on a nearly full system drive. Reverse it any time with `powercfg /hibernate on`. Nothing else changes: no power plan, no sleep setting and no BIOS option.

## Why some caches are admin-only

`C:\Windows\Temp`, the Windows Update download cache and the system Error Reporting queues are owned by the
system; the Explorer thumbnail and icon databases are locked by Explorer and are rebuilt cleanly only through
Disk Cleanup; WinSxS may only be touched by DISM. Everything a non-elevated user owns is handled by sections 1-10.

Last Updated: 2026-11-14
