# Installation

windowsweep is a PowerShell engine with a thin Node launcher. Pick whichever path fits the machine.

## Requirements

| Requirement | Version | Why |
|---|---|---|
| Windows | 10 (1809+) or 11 | `Clear-RecycleBin`, `Delete-DeliveryOptimizationCache` and the Scheduled Tasks module ship with these |
| Windows PowerShell | 5.1 (built in) | The engine targets 5.1; PowerShell 7 also works (`--pwsh`) |
| Node.js | 14+ | Only for the `npx` / `npm install -g` paths |

Nothing else is installed. The tool has no npm dependencies and makes no network calls.

## Zero install with npx

```powershell
npx windowsweep --scan
```

The weekly task and the profile alias need the global install: under `npx` the installers refuse (exit 3)
because the npx cache is evicted.

## Global install

```powershell
npm install -g windowsweep
windowsweep --help
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

The launchers default to Windows PowerShell 5.1 because every Windows machine has it. To run the engine on
PowerShell 7 instead, pass `--pwsh` or set `WINDOWSWEEP_SHELL=pwsh`.

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
windowsweep --uninstall-data     # removes ~\.windowsweep after confirming
npm uninstall -g windowsweep
```

Last Updated: 2026-09-03
