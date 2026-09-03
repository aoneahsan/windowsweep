# CLI reference

```powershell
windowsweep [mode] [options]
```

The flags are identical through `npx windowsweep`, the global `windowsweep` command, `windowsweep.cmd` and
`powershell -File windowsweep.ps1`. With no mode, the guided walkthrough starts. Modes marked with a fire mark
delete files (subject to every guard in the [safety model](./safety-model.md)).

## Modes

| Mode | Flags | What it does |
|---|---|---|
| Walkthrough (default) | `-w`, `--walkthrough` | 🔥 Guided run through every section, one confirmation per step |
| Menu | `-m`, `--menu` | 🔥 Pick one section at a time; toggle dry-run and auto-yes |
| Safe batch | `-a`, `--all` | 🔥 Sections 0,1,2,3,5,6,7,8,9,10,21 (+12,13 when elevated), no prompts with `--yes` |
| Only | `--only L` | 🔥 Exactly these sections, e.g. `--only 1,3,5-7` |
| Profile | `--profile NAME` | 🔥 A named bundle - see [Profiles](./profiles.md) |
| Scan | `-s`, `--scan` | Read-only: health report, every target with its size, personal-file scanners |
| List | `--list` | The section catalogue |
| List targets | `--list-targets` | Every path the tool can touch, plus the protected list |
| Self-test | `--self-test` | Syntax, ASCII-only source, guards, junction and dry-run fixtures; exit 1 on failure |
| Reports | `--reports` | Reports manager: list, view, export, open, delete |
| Export | `--export F [ID]` | `F` = `md`, `html`, `both`; `ID` = `N`, `latest` (default), `all` |
| Stats | `--stats` | Run history and total reclaimed |
| Prune history | `--prune-history [N]` | Delete logs, reports and bundles older than N days (default 90) |
| Feedback | `--feedback` | How to report a bug; nothing is sent |
| Report issue | `--report-issue` | Opens a pre-filled GitHub issue in your browser after confirming |
| Debug bundle | `--debug-bundle` | Zips the latest log, report and a manifest under `~\.windowsweep\feedback` |
| Scheduled task | `--install-task`, `--uninstall-task` | Weekly `--all --yes` on Sundays at 03:00, as your user (refused under `npx`; install globally first) |
| Profile alias | `--install-alias`, `--uninstall-alias` | A `cleanup` function in your PowerShell profile (refused under `npx`; install globally first) |
| Uninstall data | `--uninstall-data` | Removes `~\.windowsweep` after a confirmation that `--yes` never answers |
| Version | `-V`, `--version` | Version and author |
| Help | `-h`, `--help` | The flag list |

## Options

| Flag | Default | What it does |
|---|---|---|
| `--dry-run`, `-n` | off | Delete nothing; print what would go and estimate the total |
| `-y`, `--yes` | off | Auto-confirm regenerable-cache steps. Never applies to personal files |
| `--i-understand-deep` | off | Allow deep sections (11, 15, 16, 20) unattended, with `--yes` |
| `--elevate` | off | Relaunch elevated through a UAC prompt; the elevated run writes its own log |
| `-d N`, `--days N` | 100 | Idle window for caches: a file goes when its newest timestamp is N+ days old |
| `--temp-days N` | 3 | Idle window for temp folders (sections 10 and 12) |
| `--purge-all` | off | 🔥 Clear cache targets completely instead of pruning idle files (a console run asks for a typed `purge` once; `--yes` confirms in batch) |
| `--developer` / `--not-developer` | saved answer | Override developer mode for this run only |
| `--forget-developer` | - | Ask the developer question again |
| `--scan-roots "P1;P2"` | auto-detected | Project roots for section 17 (semicolon-separated) |
| `--exclude-path P` | - | Never scan or touch this tree in section 17 (repeatable) |
| `--exclude L` | - | Drop sections from `--all` or a profile |
| `--large-file-mb N` | 100 | Minimum size for section 19 |
| `--hiberfil off|reduced|keep` | ask | What section 15 does |
| `--reset-base` | off | Add `/ResetBase` to section 14 |
| `--permanent` | off | Sections 18 and 19 delete instead of using the Recycle Bin |
| `--logs-dir P`, `--reports-dir P` | `~\.windowsweep\...` | Where logs and reports are written |
| `--no-report` | off | Skip the JSON report (the log is still written) |
| `--cleanup-logs` | off | Delete this run's log at exit; reports are kept |
| `--json` | off | One-line JSON summary on stdout; everything else goes to stderr |
| `-q`, `--quiet` | off | Fewer informational lines |
| `--no-color` | auto | Disable colour (also `NO_COLOR` or `WINDOWSWEEP_NO_COLOR=1`; off when output is redirected) |
| `--ascii` | auto | Plain ASCII glyphs (also `WINDOWSWEEP_ASCII=1`; automatic when output is redirected) |
| `--pwsh` | off | Launcher only: run the engine on PowerShell 7 |

Options may also be written `--days=30`.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | A section failed, or the self-test found a failure |
| 2 | Usage error, or an interactive mode was started without a console |
| 3 | A section named in `--only` was refused (deep without `--i-understand-deep`, or interactive-only), or an installer was started from `npx` |
| 130 | Interrupted with Ctrl-C (the engine exits 130 from its exit handler; the Node launcher also returns 130 when it forwards the signal) |

## Environment variables

| Variable | Default | Effect |
|---|---|---|
| `WINDOWSWEEP_HOME` | `%USERPROFILE%\.windowsweep` | Data directory |
| `WINDOWSWEEP_LOG_DIR`, `WINDOWSWEEP_REPORTS_DIR` | under the data directory | Same as `--logs-dir` / `--reports-dir` |
| `WINDOWSWEEP_SHELL` | `powershell` | `pwsh` runs the engine on PowerShell 7 (launcher only) |
| `WINDOWSWEEP_NO_COLOR`, `NO_COLOR` | unset | Disable colour |
| `WINDOWSWEEP_ASCII` | unset | Plain glyphs |
| `WINDOWSWEEP_VERSION`, `WINDOWSWEEP_LAUNCHER`, `WINDOWSWEEP_NPX` | set by the launcher | Version and launcher facts shown in logs and reports |

## Config file

`~\.windowsweep\config.json` stores defaults; flags always win.

| Key | Default | Meaning |
|---|---|---|
| `developer` | `null` | The saved developer answer (`true` / `false`) |
| `days` | 100 | Idle window |
| `tempDays` | 3 | Temp idle window |
| `largeFileMb` | 100 | Section 19 minimum size |
| `scanRoots` | `[]` | Section 17 roots |
| `excludePaths` | `[]` | Section 17 exclusions |

Last Updated: 2026-09-03
