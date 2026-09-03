# Manual / User-Only Tasks - windowsweep
> The ONE place for everything only you can do. Fixed path: docs/MANUAL-TASKS.md.
> Last updated: 2026-09-03 (rows 8-13 added by the audit; the item ids refer to `remaining-work.md`)

## Pending
| # | Task | Why only you | Runbook | Status |
|---|------|--------------|---------|--------|
| 1 | Run the admin sections on this machine: `windowsweep --only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate` (Windows Update cache, Disk Cleanup engine, DISM, hibernation off = 15.9 GB). This is also the first real run of those sections anywhere (RW-020): keep the elevated window's log and report for the agent | needs a UAC click at the keyboard | [docs/admin-and-elevation.md](./admin-and-elevation.md), `remaining-work.md` RW-020 | Not started |
| 2 | Close Chrome, then `windowsweep --only 7 --yes` (about 7.4 GB of Chrome cache across 25 profiles was skipped while it was open; Edge and Brave were cleared in the real run) | the browser was running during the build session | [docs/sections.md](./sections.md) section 7, RW-024 | Not started |
| 6 | Close Slack and Granola, then `windowsweep --only 8 --yes` (Slack's Store CacheStorage alone was ~373 MB) | the apps were running during the build session | [docs/sections.md](./sections.md) section 8, RW-024 | Not started |
| 7 | Start Docker Desktop, wait for the daemon, then `windowsweep --only 5 --yes` (dangling images + build cache; the daemon was not running during the real run) | Docker Desktop was stopped on your machine | [docs/sections.md](./sections.md) section 5, RW-024 | Not started |
| 3 | Walk the personal sections yourself, after RW-002 has landed: `windowsweep --only 17 --scan-roots "D:\work;E:\04-code"` and `windowsweep --only 18,19` | they are interactive-only by design | [docs/sections.md](./sections.md) sections 17-19, RW-023 | Not started |
| 4 | Rename the project folder `D:\work\windows-cleanup` to `D:\work\windowsweep` after closing every session in it | renaming the working directory kills the running sessions | `Rename-Item D:\work\windows-cleanup D:\work\windowsweep`, RW-052 | Not started |
| 5 | Review the windowsweep entry the agent adds to the portfolio master links JSON (`ownerReview: OK`) | owner-run portfolio pass | `~/.claude/rules/portfolio-and-social.md`, RW-051 | Not started |
| 8 | On a Windows 11 machine or VM: `npx windowsweep --self-test`, `npx windowsweep --dry-run --all --yes`, then one real `npx windowsweep --all --yes`; send the agent the build number and the report | needs a Windows 11 machine | `remaining-work.md` RW-021 | Not started |
| 9 | After RW-007 ships (1.0.1), from a global install: `windowsweep --install-task`, then `Start-ScheduledTask -TaskName 'windowsweep weekly safe cleanup'` once and check `Get-ScheduledTaskInfo` shows `LastTaskResult 0` | the task runs under your account on your machine | `remaining-work.md` RW-025 | Not started |
| 10 | Optional: on a machine with PowerShell 7, `npx windowsweep --pwsh --self-test` and `npx windowsweep --pwsh --install-task --dry-run` | the build machine has no PowerShell 7 | `remaining-work.md` RW-026 | Not started |
| 11 | After the docs repo exists (RW-040): Hostinger DNS `CNAME windowsweep-docs -> aoneahsan.github.io` | DNS zone access | `~/.claude/rules/docs-sites.md`, RW-040 | Not started |
| 12 | GitHub `aoneahsan/windowsweep-docs` -> Settings -> Pages: custom domain `windowsweep-docs.aoneahsan.com`, Enforce HTTPS | repository settings | RW-040 | Not started |
| 13 | After RW-051: import `windowsweep.bib` into ORCID and retype the work type; confirm the entry | ORCID account | `~/.claude/rules-detail/portfolio-and-social.md`, RW-051 | Not started |

## Completed
(move rows here with the date)
