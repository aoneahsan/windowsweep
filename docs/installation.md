# Installation

windowsweep is a PowerShell engine with a thin Node launcher. Installing it adds no service and no startup entry: the weekly Scheduled Task and the `cleanup` alias are separate commands you run yourself. Pick whichever path fits the machine. The [desktop app](./desktop.md) is a window over the same engine.

## Requirements

| Requirement | Version | Why |
|---|---|---|
| Windows | 10 (1809+) or 11 | `Clear-RecycleBin`, `Delete-DeliveryOptimizationCache` and the Scheduled Tasks module ship with these |
| Windows PowerShell | 5.1 (built in) | The engine targets 5.1; PowerShell 7 also works (`--pwsh`) |
| Node.js | 14+ | Only for the `npx` / `npm install -g` paths |

Nothing else is installed. The package has no dependencies, and the command-line tool makes no network calls of its own.

## Zero install with npx

`--scan` measures every target and deletes nothing:

```powershell
npx windowsweep --scan
```

The weekly task and the profile alias need the global install. Under `npx` both installers refuse with exit 3, because a
task or alias registered there would point at a cache npm evicts.

## Global install

```powershell
npm install -g windowsweep
windowsweep --help
windowsweep --install-task       # weekly Scheduled Task, Sundays 03:00, the safe batch
windowsweep --install-alias      # adds a 'cleanup' function to your PowerShell profile
```

## Without Node

Clone the repository and use the `.cmd` launcher, or call the script directly:

```powershell
git clone https://github.com/aoneahsan/windowsweep.git
cd windowsweep
.\windowsweep.cmd --self-test
powershell -NoProfile -ExecutionPolicy Bypass -File .\windowsweep.ps1 --scan
```

The `.cmd` launcher and the Node launcher both start Windows PowerShell with `-ExecutionPolicy Bypass`, so the
machine's script policy never blocks a run. If you call `windowsweep.ps1` yourself under the default
`Restricted` policy, add that flag as shown above.

## PowerShell 7

The launchers default to Windows PowerShell 5.1 because every Windows machine has it; to run the engine on PowerShell 7 instead, pass `--pwsh` or set `WINDOWSWEEP_SHELL=pwsh`.

## Where output lands

Every path writes the same data directory, so `npx` cache eviction never loses your history:

| Item | Path |
|---|---|
| Session logs | `%USERPROFILE%\.windowsweep\logs\` |
| JSON reports and exports | `%USERPROFILE%\.windowsweep\reports\` |
| Debug and crash bundles | `%USERPROFILE%\.windowsweep\feedback\` |
| Settings (developer answer, windows) | `%USERPROFILE%\.windowsweep\config.json` |

Override the root with `WINDOWSWEEP_HOME`, or the two folders with `--logs-dir` / `--reports-dir`
(`WINDOWSWEEP_LOG_DIR` / `WINDOWSWEEP_REPORTS_DIR`).

## Uninstall

```powershell
windowsweep --uninstall-task     # if you scheduled the weekly run
windowsweep --uninstall-alias    # if you added the profile alias
windowsweep --uninstall-data     # removes %USERPROFILE%\.windowsweep after confirming
npm uninstall -g windowsweep
```

## Next

[Quick start](./quick-start.md) is four commands in order. The first is `--self-test`, which proves the
guards on this machine before anything is deleted.

Last Updated: 2026-09-08
