# Manual / User-Only Tasks - windowsweep
> The ONE place for everything only you can do. Fixed path: docs/MANUAL-TASKS.md.
> Last updated: 2026-09-03

## Pending
| # | Task | Why only you | Runbook | Status |
|---|------|--------------|---------|--------|
| 1 | Run the admin sections on this machine: `windowsweep --only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate` (Windows Update cache, Disk Cleanup engine, DISM, hibernation off = 15.9 GB) | needs a UAC click at the keyboard | [docs/admin-and-elevation.md](./admin-and-elevation.md) | Not started |
| 2 | Close Chrome, then `windowsweep --only 7 --yes` (about 7.4 GB of Chrome cache across 25 profiles was skipped while it was open; Edge and Brave were cleared in the real run) | the browser was running during the build session | [docs/sections.md](./sections.md) section 7 | Not started |
| 6 | Close Slack and Granola, then `windowsweep --only 8 --yes` (Slack's Store CacheStorage alone was ~373 MB) | the apps were running during the build session | [docs/sections.md](./sections.md) section 8 | Not started |
| 7 | Start Docker Desktop, wait for the daemon, then `windowsweep --only 5 --yes` (dangling images + build cache; the daemon was not running during the real run) | Docker Desktop was stopped on your machine | [docs/sections.md](./sections.md) section 5 | Not started |
| 3 | Walk the personal sections yourself: `windowsweep --only 17 --scan-roots "D:\work;E:\04-code"` and `windowsweep --only 18,19` | they are interactive-only by design | [docs/sections.md](./sections.md) sections 17-19 | Not started |
| 4 | Rename the project folder `D:\work\windows-cleanup` to `D:\work\windowsweep` after closing every session in it | renaming the working directory kills the running sessions | `Rename-Item D:\work\windows-cleanup D:\work\windowsweep` | Not started |
| 5 | Add windowsweep to the portfolio master links JSON and the ORCID works file on your next portfolio pass | owner-run periodic passes | `~/.claude/rules/portfolio-and-social.md` | Not started |

## Completed
(move rows here with the date)
