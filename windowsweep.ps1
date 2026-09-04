# windowsweep - safe, developer-aware Windows cleanup CLI. Entry point.
#
#   windowsweep.ps1                (guided walkthrough)
#   windowsweep.ps1 --help         (every mode and option)
#
# Runs on Windows PowerShell 5.1 and PowerShell 7. Flags are parsed from $args (no param block) so
# GNU-style options survive `powershell -File`. Source is ASCII-only by design.
#
# Author:  Ahsan Mahmood <aoneahsan@gmail.com>  https://aoneahsan.com
# License: MIT (see LICENSE)

$ErrorActionPreference = 'Continue'
$Script:WS_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

$Script:WS = @{
  Mode = 'walkthrough'; RawArgs = @($args); ScriptPath = $MyInvocation.MyCommand.Path
  DryRun = $false; Yes = $false; Deep = $false; Elevate = $false; ElevatedChild = $false; BatchMode = $false
  Days = $null; TempDays = $null; LargeFileMb = $null; PurgeAll = $false
  DeveloperFlag = $null; ForgetDeveloper = $false; Developer = $null; DeveloperSource = ''
  ScanRoots = @(); ExcludePaths = @(); Hiberfil = ''; ResetBase = $false; Permanent = $false
  OnlyList = ''; Profile = ''; Exclude = ''; ExportFmt = 'both'; ExportId = 'latest'; PruneDays = 90
  LogsDir = ''; ReportsDir = ''; NoReport = $false; CleanupLogs = $false
  JsonMode = $false; Quiet = $false; NoColor = $false; Ascii = $false; Notify = $false
  # Scripted selection (--select / --select-file): a person's choice made in advance. SelectActive is LATCHED
  # once at parse time because SelectQueue empties as prompts consume it.
  SelectQueue = @(); SelectPaths = @(); SelectActive = $false; LastSelectionScripted = $false
  Candidates = @(); ScanTargets = @()
  TotalFreed = [long]0; TotalEstimated = [long]0; SectionFreed = [long]0
  Refusals = @(); Hints = @(); ExitCode = 0; Finished = $false; AllowOwnData = $false
}

foreach ($lib in @('constants', 'ui', 'log', 'fs', 'safety', 'config', 'scan', 'actions')) {
  . (Join-Path $Script:WS_ROOT "lib\$lib.ps1")
}
foreach ($m in (Get-ChildItem -LiteralPath (Join-Path $Script:WS_ROOT 'modules') -Filter '*.ps1' | Sort-Object Name)) {
  . $m.FullName
}

function Show-Usage {
  $v = Get-ToolVersion
  $text = @"
$Script:WS_NAME v$v - safe, developer-aware Windows cleanup

USAGE
  windowsweep [mode] [options]

MODES  (default = guided walkthrough through every category)
  -w, --walkthrough     Guided walkthrough, asks before every step
  -m, --menu            Jump-to menu - run one section at a time
  -a, --all             Safe batch: sections $($Script:WS_SAFE_BATCH -join ',') (+12,13 when elevated)
  -s, --scan            Read-only: every target with its size, nothing deleted
      --only L          Run exactly these sections, e.g. --only 1,3,5-7
      --profile NAME    dev | minimal | cache-only | system | deep | audit
      --exclude L       Drop sections from --all / --profile
      --list            Print the section catalogue and exit
      --list-targets    Print every path the tool can touch (read-only)
      --self-test       Verify syntax, safety guards, dry-run and junction handling
      --reports         Reports manager: list / view / export past runs
      --export F [ID]   Export a report: F = md | html | both, ID = N | latest | all
      --stats           Run history from ~\.windowsweep
      --prune-history N Delete logs + reports older than N days (default 90)
      --feedback        How to report a bug (offline; nothing is sent)
      --report-issue    Open a pre-filled GitHub issue in your browser (you review it first)
      --debug-bundle    Zip the latest log + report for a bug report
      --install-task    Weekly Scheduled Task (Sunday 03:00, safe batch)   --uninstall-task
      --install-alias   Add a 'cleanup' function to your PowerShell profile   --uninstall-alias
      --uninstall-data  Remove ~\.windowsweep (logs, reports, config) after confirming
  -V, --version         Version and author        -h, --help   This text

OPTIONS
      --dry-run         Delete nothing; show what would go and how much it frees
  -y, --yes             Auto-confirm regenerable-cache steps (never personal files)
      --i-understand-deep  Allow deep sections (11 Recycle Bin, 15 hibernation, 16 event logs,
                        20 disk-image compaction) to run unattended with --yes
      --elevate         Relaunch elevated (UAC prompt) so admin sections can run
  -d, --days N          Idle threshold for caches (default 100). A file goes only when its newest
                        timestamp (write, access, creation) is at least N days old
      --temp-days N     Idle threshold for %TEMP% (default 3)
      --purge-all       Clear cache targets completely instead of pruning idle files
      --developer / --not-developer   Override the saved developer answer for this run
      --forget-developer   Ask the developer question again
      --scan-roots "P1;P2"   Project roots for section 17     --exclude-path P   (repeatable)
      --large-file-mb N    Minimum size for section 19 (default 100)
      --hiberfil off|reduced|keep   What section 15 does       --reset-base   DISM /ResetBase in 14
      --permanent       Sections 18/19 delete instead of using the Recycle Bin
      --select L        Pre-answer the next interactive selection, e.g. --select 1,3-5. Repeatable: the
                        lists are consumed in the order the prompts appear
      --select-file P   UTF-8 file of one full path per line, matched against each prompt's candidates.
                        Either flag lets sections 17/18/19/23 run unattended - a person did choose
      --notify          Show a Windows notification when the run ends
      --logs-dir P / --reports-dir P / --no-report / --cleanup-logs
      --json            One-line JSON summary on stdout (everything else on stderr)
  -q, --quiet           Less chatter     --no-color     --ascii (plain glyphs)

SAFETY
  Every deletion passes one chokepoint that refuses drive roots, Windows, Program Files, your
  profile root, Documents/Pictures/Desktop, credentials, toolchains and browser/editor state, and
  that never follows a junction or symlink. Personal-file sections are interactive only and use the
  Recycle Bin. --scan and --dry-run change nothing. No network calls, ever.

OUTPUT
  Logs:    $($Script:WS.LogsDir)
  Reports: $($Script:WS.ReportsDir)

$Script:WS_NAME v$v  by $Script:WS_AUTHOR <$Script:WS_EMAIL>  $Script:WS_WEB
$Script:WS_REPO  -  $Script:WS_LICENSE
"@
  Write-Host $text
}

function Get-NextArg {
  param([string[]] $Argv, [ref] $Index, [string] $Name)
  $Index.Value++
  if ($Index.Value -ge $Argv.Count) { throw "option $Name needs a value" }
  return [string]$Argv[$Index.Value]
}

function Read-Arguments {
  $ws = $Script:WS
  $argv = @($ws.RawArgs)
  $i = 0
  while ($i -lt $argv.Count) {
    $a = [string]$argv[$i]
    $inline = $null
    if ($a -match '^(--[A-Za-z][A-Za-z0-9-]*)=(.*)$') { $a = $Matches[1]; $inline = $Matches[2] }
    switch ($a) {
      { $_ -in '-w', '--walkthrough' } { $ws.Mode = 'walkthrough' }
      { $_ -in '-m', '--menu', '-i', '--interactive' } { $ws.Mode = 'menu' }
      { $_ -in '-a', '--all', '--all-safe' } { $ws.Mode = 'all'; $ws.BatchMode = $true }
      { $_ -in '-s', '--scan' } { $ws.Mode = 'scan' }
      '--only' { $ws.Mode = 'only'; $ws.BatchMode = $true; if ($null -ne $inline) { $ws.OnlyList = $inline } else { $ws.OnlyList = Get-NextArg $argv ([ref]$i) $a } }
      '--profile' { $ws.Mode = 'only'; $ws.BatchMode = $true; if ($null -ne $inline) { $ws.Profile = $inline } else { $ws.Profile = Get-NextArg $argv ([ref]$i) $a } }
      '--exclude' { if ($null -ne $inline) { $ws.Exclude = $inline } else { $ws.Exclude = Get-NextArg $argv ([ref]$i) $a } }
      '--list' { $ws.Mode = 'list' }
      '--list-targets' { $ws.Mode = 'list_targets' }
      '--self-test' { $ws.Mode = 'self_test' }
      '--reports' { $ws.Mode = 'reports' }
      '--export' {
        $ws.Mode = 'export'
        if ($null -ne $inline) { $ws.ExportFmt = $inline } elseif (($i + 1) -lt $argv.Count -and -not ([string]$argv[$i + 1]).StartsWith('-')) { $i++; $ws.ExportFmt = [string]$argv[$i] }
        if (($i + 1) -lt $argv.Count -and -not ([string]$argv[$i + 1]).StartsWith('-')) { $i++; $ws.ExportId = [string]$argv[$i] }
      }
      '--stats' { $ws.Mode = 'stats' }
      '--prune-history' {
        $ws.Mode = 'prune_history'
        if ($null -ne $inline) { $ws.PruneDays = [int]$inline } elseif (($i + 1) -lt $argv.Count -and ([string]$argv[$i + 1]) -match '^\d+$') { $i++; $ws.PruneDays = [int]$argv[$i] }
      }
      '--feedback' { $ws.Mode = 'feedback' }
      { $_ -in '--report-issue', '--report-bug' } { $ws.Mode = 'report_issue' }
      '--debug-bundle' { $ws.Mode = 'debug_bundle' }
      '--install-task' { $ws.Mode = 'install_task' }
      '--uninstall-task' { $ws.Mode = 'uninstall_task' }
      '--install-alias' { $ws.Mode = 'install_alias' }
      '--uninstall-alias' { $ws.Mode = 'uninstall_alias' }
      '--uninstall-data' { $ws.Mode = 'uninstall_data' }
      { $_ -in '-V', '--version' } { $ws.Mode = 'version' }
      { $_ -in '-h', '--help', '/?', '-?' } { $ws.Mode = 'help' }
      { $_ -in '-n', '--dry-run' } { $ws.DryRun = $true }
      { $_ -in '-y', '--yes' } { $ws.Yes = $true }
      '--i-understand-deep' { $ws.Deep = $true }
      '--elevate' { $ws.Elevate = $true }
      '--elevated-child' { $ws.ElevatedChild = $true }
      { $_ -in '-d', '--days' } { $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }; if ($v -notmatch '^\d+$') { throw "--days needs a whole number, got '$v'" }; $ws.Days = [int]$v }
      '--temp-days' { $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }; if ($v -notmatch '^\d+$') { throw "--temp-days needs a whole number, got '$v'" }; $ws.TempDays = [int]$v }
      '--purge-all' { $ws.PurgeAll = $true }
      '--developer' { $ws.DeveloperFlag = $true }
      { $_ -in '--not-developer', '--no-developer' } { $ws.DeveloperFlag = $false }
      '--forget-developer' { $ws.ForgetDeveloper = $true }
      '--scan-roots' { $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }; $ws.ScanRoots = @($v -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ }) }
      '--exclude-path' { $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }; $ws.ExcludePaths += $v }
      '--large-file-mb' { $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }; if ($v -notmatch '^\d+$') { throw "--large-file-mb needs a whole number, got '$v'" }; $ws.LargeFileMb = [int]$v }
      '--hiberfil' { $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }; if ($v -notin 'off', 'reduced', 'keep') { throw "--hiberfil must be off, reduced or keep" }; $ws.Hiberfil = $v }
      '--reset-base' { $ws.ResetBase = $true }
      '--permanent' { $ws.Permanent = $true }
      '--logs-dir' { $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }; $ws.LogsDir = $v }
      '--reports-dir' { $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }; $ws.ReportsDir = $v }
      '--no-report' { $ws.NoReport = $true }
      '--cleanup-logs' { $ws.CleanupLogs = $true }
      '--notify' { $ws.Notify = $true }
      '--select' { $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }; $ws.SelectQueue += $v }
      '--select-file' {
        $v = $inline; if ($null -eq $v) { $v = Get-NextArg $argv ([ref]$i) $a }
        $f = Get-FullPath $v
        if (-not $f -or -not (Test-Path -LiteralPath $f)) { throw "--select-file not found: $v" }
        $ws.SelectPaths = @([IO.File]::ReadAllLines($f) | ForEach-Object { $_.Trim() } | Where-Object { $_ -and -not $_.StartsWith('#') })
        if ($ws.SelectPaths.Count -eq 0) { throw "--select-file has no paths in it: $v" }
      }
      '--json' { $ws.JsonMode = $true; $ws.Quiet = $true }
      { $_ -in '-q', '--quiet' } { $ws.Quiet = $true }
      '--no-color' { $ws.NoColor = $true }
      '--ascii' { $ws.Ascii = $true }
      '--pwsh' { }
      default { throw "unknown argument: $a" }
    }
    $i++
  }
  if ($ws.Profile -and -not $Script:WS_PROFILES.ContainsKey($ws.Profile)) {
    throw "unknown profile '$($ws.Profile)' (known: $($Script:WS_PROFILES.Keys -join ', '))"
  }
  # Latched here, once: the queue is drained by the prompts, so a recomputed flag would flip to false mid-run.
  $ws.SelectActive = ($ws.SelectQueue.Count -gt 0 -or $ws.SelectPaths.Count -gt 0)
}

function Initialize-Paths {
  $ws = $Script:WS
  $ws.Stamp = (Get-Date -Format 'yyyy-MM-dd_HHmmss') + '-' + $PID
  $dataHome = $env:WINDOWSWEEP_HOME
  if ([string]::IsNullOrWhiteSpace($dataHome)) { $dataHome = Join-Path $env:USERPROFILE ".$Script:WS_NAME" }
  $ws.Home = Get-FullPath $dataHome
  if (-not $ws.LogsDir) { $ws.LogsDir = $env:WINDOWSWEEP_LOG_DIR }
  if (-not $ws.LogsDir) { $ws.LogsDir = Join-Path $ws.Home 'logs' }
  if (-not $ws.ReportsDir) { $ws.ReportsDir = $env:WINDOWSWEEP_REPORTS_DIR }
  if (-not $ws.ReportsDir) { $ws.ReportsDir = Join-Path $ws.Home 'reports' }
  $ws.LogsDir = Get-FullPath $ws.LogsDir
  $ws.ReportsDir = Get-FullPath $ws.ReportsDir
  $ws.FeedbackDir = Join-Path $ws.Home 'feedback'
  $ws.ConfigPath = Join-Path $ws.Home 'config.json'
  $ws.Launcher = $env:WINDOWSWEEP_LAUNCHER
  if (-not $ws.Launcher) { $ws.Launcher = 'powershell' }
  # Well-known roots used by every module. LL = LocalLow, SR = SystemRoot, PD = ProgramData, SD = system drive.
  $Script:P = @{
    U = (Get-FullPath $env:USERPROFILE); L = (Get-FullPath $env:LOCALAPPDATA); A = (Get-FullPath $env:APPDATA)
    LL = (Get-FullPath (Join-Path (Split-Path -Parent $env:LOCALAPPDATA) 'LocalLow')); SR = (Get-FullPath $env:SystemRoot)
    PD = (Get-FullPath $env:ProgramData); SD = $env:SystemDrive; TEMP = (Get-FullPath $env:TEMP); TMP = (Get-FullPath $env:TMP)
    PF = (Get-FullPath $env:ProgramFiles); PF86 = (Get-FullPath ${env:ProgramFiles(x86)})
  }
  $ws.Npx = ($env:WINDOWSWEEP_NPX -eq '1')
  $ws.IsAdmin = Test-IsAdmin
  try { $ws.OsCaption = (Get-CimInstance Win32_OperatingSystem -ErrorAction Stop).Caption } catch { $ws.OsCaption = 'Windows' }
}

function Initialize-Settings {
  <# .SYNOPSIS Merge config defaults under explicit flags. #>
  $ws = $Script:WS
  $cfg = Import-Config
  if ($null -eq $ws.Days) { $ws.Days = [int]$cfg.days }
  if ($null -eq $ws.TempDays) { $ws.TempDays = [int]$cfg.tempDays }
  if ($null -eq $ws.LargeFileMb) { $ws.LargeFileMb = [int]$cfg.largeFileMb }
  if ($ws.ScanRoots.Count -eq 0 -and $cfg.scanRoots) { $ws.ScanRoots = @($cfg.scanRoots) }
  if ($cfg.excludePaths) { $ws.ExcludePaths = @($ws.ExcludePaths) + @($cfg.excludePaths) }
}

function Invoke-Main {
  $ws = $Script:WS
  switch ($ws.Mode) {
    'help' { Show-Usage; return }
    'version' { Show-Version; return }
    'list' { Show-SectionList; return }
    'list_targets' { Show-TargetList; return }
    'self_test' { $ws.ExitCode = Invoke-SelfTest; return }
    'scan' { Invoke-ScanMode; return }
    'all' { Invoke-BatchMode; return }
    'only' { Invoke-BatchMode; return }
    'walkthrough' { Invoke-Walkthrough; return }
    'menu' { Invoke-Menu; return }
    'reports' { Invoke-ReportsManager; return }
    'export' { $ws.ExitCode = Export-Reports -Format $ws.ExportFmt -Id $ws.ExportId; return }
    'stats' { Show-Stats; return }
    'prune_history' { Remove-OldHistory -Days $ws.PruneDays; return }
    'feedback' { Show-Feedback; return }
    'report_issue' { Invoke-ReportIssue; return }
    'debug_bundle' { New-DebugBundle; return }
    'install_task' { Install-WeeklyTask; return }
    'uninstall_task' { Uninstall-WeeklyTask; return }
    'install_alias' { Install-ProfileAlias; return }
    'uninstall_alias' { Uninstall-ProfileAlias; return }
    'uninstall_data' { Remove-ToolData; return }
    default { Write-Err "unknown mode: $($ws.Mode)"; $ws.ExitCode = $Script:WS_EXIT_USAGE }
  }
}

# ---------------------------------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------------------------------
try {
  Read-Arguments
} catch {
  [Console]::Error.WriteLine("windowsweep: $($_.Exception.Message)")
  [Console]::Error.WriteLine("try: windowsweep --help")
  exit 2
}
Initialize-Paths
Initialize-Ui
Initialize-Safety
$quietModes = @('help', 'version', 'list')
if ($Script:WS.Mode -notin $quietModes) { Initialize-Log }
Initialize-Settings
Initialize-Report
Initialize-CrashTrap

if ($Script:WS.Elevate -and -not $Script:WS.IsAdmin) {
  $code = Invoke-Elevated
  Restore-Ui
  exit $code
}
if ($Script:WS.Elevate -and $Script:WS.IsAdmin) { Write-Note 'already elevated; --elevate is a no-op' }

if ($Script:WS.Mode -in @('walkthrough', 'menu', 'all', 'only')) { Resolve-DeveloperMode; Confirm-PurgeAllOnce }

try {
  Invoke-Main
  $Script:WS.Finished = $true
} catch {
  Invoke-CrashBundle -ErrorRecord $_
  $Script:WS.ExitCode = $Script:WS_EXIT_FAIL
} finally {
  Restore-Ui
  if ($Script:WS.CleanupLogs -and $Script:WS.LogFile -and (Test-Path -LiteralPath $Script:WS.LogFile)) {
    try { Remove-Item -LiteralPath $Script:WS.LogFile -Force -ErrorAction SilentlyContinue } catch { $null = $_ }
  }
  if (-not $Script:WS.Finished -and $Script:WS.ExitCode -eq 0) {
    Write-LogLine 'run interrupted before it finished (Ctrl-C or host stop) - exit 130'
    exit $Script:WS_EXIT_INTERRUPT
  }
}
exit $Script:WS.ExitCode
