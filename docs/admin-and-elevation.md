# Admin sections and elevation

Sections 12, 13, 14, 15, 16 and 20 change things only an administrator may change. windowsweep never asks for
a password and never stores one; it detects whether the current console is elevated and, when it is not, skips
those sections with the exact command that runs them.

## What each admin section does

| # | Section | Effect |
|---|---|---|
| 12 | Windows Update and system temp | Stops `wuauserv`/`bits`, clears the update download cache, restarts them; Delivery Optimization cache; `C:\Windows\Temp`; old CBS/DISM/WU logs; system WER queues |
| 13 | Disk Cleanup engine | `cleanmgr /sagerun:77` with a curated handler list - never Downloads, Recycle Bin, File History, ESD files or language packs |
| 14 | Component store | `Dism /StartComponentCleanup` (slow; `--reset-base` opt-in) |
| 15 | Hibernation file | `powercfg /hibernate off` or `/type reduced` |
| 16 | Event logs | `wevtutil cl` for every log (permanent) |
| 20 | Disk-image compaction | Stops Docker Desktop and WSL, `diskpart compact vdisk` on selected `.vhdx` files |

12 and 13 join `--all` automatically when the console is already elevated. 14 is opt-in (it is slow). 15, 16
and 20 are deep-gated.

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

Running speed is unaffected either way; the gain is disk space, which matters most on a nearly full system
drive. Reverse it any time with `powercfg /hibernate on`.

## Why some caches are admin-only

`C:\Windows\Temp`, the Windows Update download cache and the system Error Reporting queues are owned by the
system; the Explorer thumbnail and icon databases are locked by Explorer and are rebuilt cleanly only through
Disk Cleanup; WinSxS may only be touched by DISM. Everything a non-elevated user owns is handled by sections 1-10.

Last Updated: 2026-09-03
