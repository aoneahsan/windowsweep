# uninstall.ps1 - section 26: uninstall programs you pick, each with its own registered uninstaller (D77), then
# offer what they left (leftovers.ps1, leftovers_more.ps1). Since 1.5.0 (D109) the same list also carries Store
# apps for this account (store_apps.ps1) and broken entries whose uninstaller is gone (cleared through
# lib\registry.ps1 after a .reg backup). Interactive only; --yes never selects. One program at a time:
# some uninstallers hand the work to a helper, and a second one started meanwhile fails (Adobe's "Failed to
# acquire Bootstrapper Lock", P52 2026-11-02). The silent forms below are the ones that worked on the P52 that
# day. ASCII only.

# Never offered: Windows parts, runtimes other programs need, drivers, hardware support, build kits, this tool.
$Script:WS_UNINSTALL_NEVER = @('*Redistributable*', '*Runtime*', '*Driver*', '*WebView2*', '*Chipset*', '*Firmware*',
  'Microsoft Visual C++*', 'Microsoft .NET*', 'Microsoft ASP.NET*', 'Microsoft Edge*', 'Microsoft Visual Studio Installer*',
  'Visual Studio Build Tools*', 'Windows Software Development Kit*', 'Windows SDK*', 'vs_*', 'Microsoft Update Health Tools*',
  'Update for *', 'Security Update for *', 'Windows Subsystem for Linux*', 'Intel(R) *', "Intel$([char]0x00AE) *", 'Realtek *',
  'NVIDIA PhysX*', '*Thunderbolt*', 'windowsweep*')

function Split-CommandLine {
  <# .SYNOPSIS "C:\a b\u.exe" /x  or  C:\a b\u.exe /x  ->  FilePath + Arguments. An unquoted path may hold spaces
     (Steam's does), so it ends at the first program extension followed by a space or the end. #>
  param([string] $Text)
  $t = ([string]$Text).Trim()
  if ($t.StartsWith('"')) {
    $end = $t.IndexOf('"', 1)
    if ($end -gt 0) { return [pscustomobject]@{ FilePath = $t.Substring(1, $end - 1); Arguments = $t.Substring($end + 1).Trim() } }
  }
  $m = [regex]::Match($t, '^(.+?\.(?:exe|sys|dll|com|bat|cmd|msc|cpl|scr))(?:\s+(.*))?$', [Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success) { return [pscustomobject]@{ FilePath = $m.Groups[1].Value; Arguments = $m.Groups[2].Value.Trim() } }
  $parts = $t -split '\s+', 2
  $tail = ''
  if ($parts.Count -gt 1) { $tail = $parts[1] }
  return [pscustomobject]@{ FilePath = $parts[0]; Arguments = $tail }
}

function Get-AdobeBaseVersion {
  <# .SYNOPSIS Adobe's silent uninstall needs the product's BASE version, which only the installer's icon folder
     records (ProgramData\Adobe\Installer\Icons\<SAP>_<base>): Photoshop 2023 registered 24.1, its base was 24.0. #>
  param([string] $SapCode, [string] $IconsRoot = '')
  if (-not $IconsRoot) { $IconsRoot = Join-Path $Script:P.PD 'Adobe\Installer\Icons' }
  foreach ($e in (Get-ChildEntries $IconsRoot)) {
    if ($e -is [IO.DirectoryInfo] -and $e.Name.StartsWith("$SapCode`_", [StringComparison]::OrdinalIgnoreCase)) { return $e.Name.Substring($SapCode.Length + 1) }
  }
  return ''
}

function Get-UninstallCommand {
  <# .SYNOPSIS The command that removes one program, as the P52 cleanup proved them. Silent when a known silent
     form exists; otherwise the vendor's own uninstaller with its own window. Pure apart from Adobe's icon lookup. #>
  param([pscustomobject] $Row, [string] $AdobeIconsRoot = '')
  $out = [pscustomobject]@{ FilePath = ''; Arguments = ''; Strategy = 'none'; Silent = $false; SuccessCodes = @(0); Helpers = @() }
  $un = [string]$Row.UninstallString
  if ($Row.QuietUninstallString) {
    $c = Split-CommandLine $Row.QuietUninstallString
    $out.FilePath = $c.FilePath; $out.Arguments = $c.Arguments; $out.Strategy = 'quiet'; $out.Silent = $true; $out.Helpers = @('_iu*', 'unins*', 'Au_*')
    return $out
  }
  $guid = ''
  if ($un -match '(\{[0-9A-Fa-f-]{36}\})') { $guid = $Matches[1] } elseif ($Row.KeyName -match '^\{[0-9A-Fa-f-]{36}\}$') { $guid = $Row.KeyName }
  if ($guid -and ($Row.WindowsInstaller -eq 1 -or $un -match '(?i)msiexec')) {
    # VMware Workstation registered no command at all - only its MSI product code (P52, 2026-11-02).
    $out.FilePath = 'msiexec.exe'; $out.Arguments = "/x $guid /qn /norestart"; $out.Strategy = 'msi'; $out.Silent = $true; $out.SuccessCodes = @(0, 1641, 3010)
    return $out
  }
  if (-not $un) { return $out }
  $c = Split-CommandLine $un
  $exe = [IO.Path]::GetFileName($c.FilePath).ToLowerInvariant()
  $out.FilePath = $c.FilePath; $out.Arguments = $c.Arguments
  if ($exe -match '^unins\d{3}\.exe$') { $out.Arguments = '/VERYSILENT /SUPPRESSMSGBOXES /NORESTART'; $out.Strategy = 'inno'; $out.Silent = $true; $out.Helpers = @('_iu*', 'unins*') }
  elseif ($exe -eq 'maintenancetool.exe') { $out.Arguments = 'purge --confirm-command'; $out.Strategy = 'qt-installer'; $out.Silent = $true }
  elseif ($c.FilePath -match '(?i)\\Adobe Desktop Common\\HDBox\\Uninstaller\.exe$' -and $un -match '--sapCode=(\w+)') {
    $sap = $Matches[1]
    $platform = 'win64'
    if ($un -match '--productPlatform=(\w+)') { $platform = $Matches[1] }
    $base = Get-AdobeBaseVersion -SapCode $sap -IconsRoot $AdobeIconsRoot
    if ($base) {
      $out.FilePath = Join-Path (Split-Path -Parent $c.FilePath) 'Setup.exe'
      $out.Arguments = "--uninstall=1 --sapCode=$sap --baseVersion=$base --platform=$platform --deleteUserPreferences=false"
      $out.Strategy = 'adobe'; $out.Silent = $true; $out.Helpers = @('Set-up', 'HDHelper', 'Setup')
    } else { $out.Strategy = 'vendor-ui' }
  }
  elseif ($c.FilePath -match '(?i)\\Application\\[\d.]+\\Installer\\[^\\]*setup\.exe$' -and $c.Arguments -match '--uninstall') {
    # Chromium-family installers (Brave, Copilot's copilot_setup.exe): exit 19 is their success code.
    if ($c.Arguments -notmatch '--force-uninstall') { $out.Arguments = ($c.Arguments + ' --force-uninstall').Trim() }
    $out.Strategy = 'chromium'; $out.Silent = $true; $out.SuccessCodes = @(0, 19)
  }
  elseif ($exe -like '*installer.exe' -and $c.Arguments -match '(?i)\buninstall\b') {
    $args2 = $c.Arguments.Replace('"', '').Trim()
    if ($args2 -notmatch '--quiet') { $args2 = "$args2 --quiet" }
    $out.Arguments = $args2; $out.Strategy = 'quiet-flag'; $out.Silent = $true
  }
  elseif ($exe -in 'uninstall.exe', 'uninst.exe', 'uninstaller.exe') {
    if ($c.Arguments -cnotmatch '(^|\s)/S(\s|$)') { $out.Arguments = ($c.Arguments + ' /S').Trim() }
    $out.Strategy = 'nsis'; $out.Silent = $true; $out.Helpers = @('Au_*')
  }
  elseif ($exe -in 'winget', 'winget.exe' -and $c.Arguments -match '^uninstall\b') {
    # winget's portable packages (jq, FFmpeg, age, ... on the P52) register winget itself as their uninstaller.
    $out.Arguments = ($c.Arguments + ' --silent --disable-interactivity --accept-source-agreements').Trim(); $out.Strategy = 'winget'; $out.Silent = $true
  }
  elseif ($exe -eq 'rustup.exe' -and $c.Arguments -match '^self uninstall\b') {
    if ($c.Arguments -notmatch '(^|\s)-y(\s|$)') { $out.Arguments = ($c.Arguments + ' -y').Trim() }
    $out.Strategy = 'rustup'; $out.Silent = $true
  }
  elseif ($c.FilePath -match '(?i)\\Package Cache\\\{[0-9A-Fa-f-]{36}\}\\[^\\]+\.exe$' -and $c.Arguments -match '(?i)/uninstall') {
    # A WiX bundle in the Package Cache: /quiet is the bundle engine's own switch.
    if ($c.Arguments -notmatch '(?i)/quiet') { $out.Arguments = ($c.Arguments + ' /quiet /norestart').Trim() }
    $out.Strategy = 'wix-bundle'; $out.Silent = $true
  }
  elseif ($c.Arguments -match '(?i)(^|\s)(--yes|-y|--silent|--quiet|/quiet|/qn|/silent|/verysilent)(\s|$)' -or $c.Arguments -cmatch '(^|\s)/S(\s|$)') {
    $out.Strategy = 'registered-silent'; $out.Silent = $true   # Python's manager registers "uninstall --yes --by-id ..."
  }
  else { $out.Strategy = 'vendor-ui' }
  return $out
}

function Test-UninstallOffered {
  <# .SYNOPSIS False for Windows parts, updates, runtimes, drivers, build kits, this tool and entries with no uninstaller. #>
  param([pscustomobject] $Row)
  if (-not $Row.DisplayName -or $Row.SystemComponent -eq 1 -or $Row.ParentKeyName) { return $false }
  if ($Row.ReleaseType -match '(?i)update|hotfix') { return $false }
  if (-not $Row.UninstallString -and -not $Row.QuietUninstallString -and $Row.WindowsInstaller -ne 1) { return $false }
  foreach ($pat in $Script:WS_UNINSTALL_NEVER) { if ($Row.DisplayName -like $pat) { return $false } }
  return $true
}

function Test-UninstallEntryBroken {
  <# .SYNOPSIS Pure: true when an entry's own uninstaller file is gone (its drive present), so running it can only
     fail and the entry can only be cleared. An MSI entry is never judged this way: msiexec is always there. #>
  param([pscustomobject] $Command)
  if ($Command.Strategy -in 'msi', 'none', 'winget') { return $false }
  return (Test-FileGone ([string]$Command.FilePath))
}

function Get-UninstallCandidates {
  <# .SYNOPSIS Everything section 26 may offer, largest first: desktop programs (one row per registry key),
     entries whose uninstaller is gone (Kind = stale, cleared after a .reg backup) and Store apps for this
     account (Kind = store, removed with Remove-AppxPackage). #>
  $rows = @()
  foreach ($r in @(Get-InstalledProgramRows | Where-Object { Test-UninstallOffered $_ })) {
    $kind = 'program'
    if (Test-UninstallEntryBroken (Get-UninstallCommand $r)) { $kind = 'stale' }
    $r | Add-Member -NotePropertyName Kind -NotePropertyValue $kind -Force
    $rows += $r
  }
  $rows += @(Get-StoreAppRows)
  return @($rows | Sort-Object { [long]$_.EstimatedSizeKb } -Descending)
}

function Get-UninstallKindLabel {
  param([string] $Kind)
  switch ($Kind) { 'store' { return 'store' } 'stale' { return 'broken' } default { return 'desktop' } }
}

function Invoke-UninstallRow {
  <# .SYNOPSIS Remove one picked row the way its kind needs, and record a real removal in the uninstall history. #>
  param([pscustomobject] $Row)
  $result = 'failed'
  $strategy = ''
  switch ([string]$Row.Kind) {
    'store' { $result = Invoke-StoreAppRemoval -Row $Row; $strategy = 'store' }
    'stale' {
      Write-Note "$($Row.DisplayName) - its uninstaller is gone, so only its entry in Apps can be cleared"
      $r = Remove-RegistryKeySafe -Path $Row.KeyPath -Kind 'uninstall' -Label "the broken uninstall entry of $($Row.DisplayName)"
      $strategy = 'clear-entry'
      $result = $r
      if ($r -eq 'absent') { $result = 'removed' }
    }
    default { $result = Invoke-ProgramUninstall -Row $Row; $strategy = (Get-UninstallCommand $Row).Strategy }
  }
  if ($result -eq 'removed' -and -not $Script:WS.DryRun) { Add-UninstallHistory -Row $Row -Strategy $strategy }
  return $result
}

function Wait-UninstallDone {
  <# .SYNOPSIS After the uninstaller's own process exits: wait for its registry key to go while any of its known
     helper processes still runs (the work often continues there), up to MaxMinutes. Returns $true when gone. #>
  param([string] $KeyPath, [string[]] $Helpers, [int] $MaxMinutes = 15)
  $deadline = (Get-Date).AddMinutes($MaxMinutes)
  $quietSince = Get-Date
  while ((Get-Date) -lt $deadline) {
    if (-not (Test-Path -LiteralPath "Registry::$KeyPath")) { return $true }
    $busy = @(Get-Process -ErrorAction SilentlyContinue | Where-Object { $n = $_.ProcessName; @($Helpers | Where-Object { $n -like $_ }).Count -gt 0 })
    if ($busy.Count -gt 0) { $quietSince = Get-Date } elseif (((Get-Date) - $quietSince).TotalSeconds -ge 20) { break }
    Start-Sleep -Seconds 3
  }
  return (-not (Test-Path -LiteralPath "Registry::$KeyPath"))
}

function Invoke-ProgramUninstall {
  <# .SYNOPSIS Remove one program with its own uninstaller. Returns removed | pending | failed | skipped | dry-run. #>
  param([pscustomobject] $Row)
  $ws = $Script:WS
  $cmd = Get-UninstallCommand $Row
  if ($cmd.Strategy -eq 'none') { Write-Warn "$($Row.DisplayName) - no uninstall command is registered; remove it from Settings > Apps"; return 'skipped' }
  if ($cmd.FilePath -match '^[A-Za-z]:\\' -and -not (Test-Path -LiteralPath $cmd.FilePath)) {
    Write-Warn "$($Row.DisplayName) - its uninstaller is missing ($($cmd.FilePath)); remove the entry from Settings > Apps"
    return 'skipped'
  }
  $needsAdmin = ($Row.Machine -and -not $ws.IsAdmin)
  $display = ('"{0}" {1}' -f $cmd.FilePath, $cmd.Arguments).Trim()
  if ($ws.DryRun) {
    $suffix = ''
    if ($needsAdmin) { $suffix = '   (installed for all users: needs an elevated run)' }
    Write-DryRun ("would uninstall {0} [{1}]: {2}{3}" -f $Row.DisplayName, $cmd.Strategy, $display, $suffix)
    Add-Freed ([long]$Row.EstimatedSizeKb * 1024)
    return 'dry-run'
  }
  if ($needsAdmin) {
    Write-Warn "$($Row.DisplayName) - installed for all users, so its uninstaller needs Administrator rights (skipped)"
    $ws.Hints += 'Uninstall programs installed for all users from an elevated run:  windowsweep --only 26 --elevate'
    return 'skipped'
  }
  $loc = ([string]$Row.InstallLocation).Trim().Trim('"').TrimEnd('\')
  if ($loc -and (Test-DirPresent $loc)) {
    $prefix = (Get-FullPath $loc) + '\'
    $running = @(Get-BusyExecutablePaths | Where-Object { $_.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase) })
    if ($running.Count -gt 0) { Write-Warn "$($Row.DisplayName) is running ($([IO.Path]::GetFileName($running[0]))) - close it and run section 26 again"; return 'skipped' }
  }
  if (-not $cmd.Silent) { Write-Note "$($Row.DisplayName) has no silent form - its own uninstaller window opens; finish it there" }
  Write-LogLine "uninstall [$($cmd.Strategy)]: $display"
  $started = Get-Date
  try {
    $sp = @{ FilePath = $cmd.FilePath; PassThru = $true; ErrorAction = 'Stop' }
    if ($cmd.Arguments) { $sp.ArgumentList = $cmd.Arguments }
    $proc = Start-Process @sp
    $null = $proc.Handle   # Windows PowerShell loses ExitCode unless the handle is cached while the process runs
    if (-not $proc.WaitForExit(15 * 60 * 1000)) { Write-Warn "$($Row.DisplayName) - the uninstaller is still running after 15 minutes; left running"; return 'pending' }
    $code = $proc.ExitCode
  } catch { Write-Err "$($Row.DisplayName) - could not start its uninstaller: $($_.Exception.Message)"; return 'failed' }
  $gone = Wait-UninstallDone -KeyPath $Row.KeyPath -Helpers $cmd.Helpers
  $secs = [int]((Get-Date) - $started).TotalSeconds
  Write-LogLine "uninstall exit $code after ${secs}s, entry gone: $gone : $($Row.DisplayName)"
  if ($gone) { Add-Freed ([long]$Row.EstimatedSizeKb * 1024); Write-Ok ("{0} uninstalled ({1}s)" -f $Row.DisplayName, $secs); return 'removed' }
  if ($cmd.SuccessCodes -contains $code) { Write-Warn "$($Row.DisplayName) - the uninstaller reported success but its entry is still there (a restart may finish it)"; return 'pending' }
  Write-Err "$($Row.DisplayName) - the uninstaller exited with $code and the program is still installed"
  return 'failed'
}

function Get-Targets26 {
  return @((New-Target 26 'Installed programs and Store apps' 'HKLM + HKCU Uninstall hives | Store apps for this account' -Kind cmd -Note 'you pick; each goes its own way, one at a time; what it left is offered after'))
}

function Get-UninstallRanText {
  <# .SYNOPSIS The RAN column: days since Windows Prefetch saw one of the program's files run, 'none' when no run is
     on record, '-' when unknown (not elevated, or no install folder). #>
  param([pscustomobject] $Row, [hashtable] $Prefetch)
  if ($Prefetch.Count -eq 0 -or -not $Row.InstallLocation) { return '-' }
  $d = Get-LastRunDays -ExeNames @(Get-InstallLocationExeNames -Location $Row.InstallLocation) -Prefetch $Prefetch
  if ($d -ge 0) { return "${d}d" }
  return 'none'
}

function Invoke-Section26 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Programs and Store apps you pick are removed one at a time: a program with its own uninstaller, a Store app for',
    'this Windows account, a broken entry (its uninstaller is gone) by clearing it from Apps after a .reg backup.',
    'Windows parts, runtimes, drivers, hardware apps and build kits are never listed. After a real removal, what the',
    'programs left - folders, registry keys, Start-menu shortcuts, startup entries - is offered. Nothing runs unpicked.'
  )
  $rows = @(Get-UninstallCandidates)
  if ($rows.Count -eq 0) { Write-Info 'no program can be offered'; return }
  $prefetch = Get-PrefetchLastRun
  if ($prefetch.Count -gt 0) { Write-Note 'RAN = days since Windows last saw the program run; "none" = no run on record' }
  else { Write-Note 'RAN (when each program last ran) needs an elevated run: windowsweep --only 26 --elevate' }
  Write-UiLine ("  {0,3}  {1,10}  {2,-7} {3,-44} {4,-12} {5,5}  {6}" -f '#', 'SIZE', 'KIND', 'PROGRAM', 'HOW', 'RAN', 'NEEDS') 'White'
  $i = 1
  foreach ($r in $rows) {
    $how = 'store'; $needs = ''
    if ($r.Kind -eq 'stale') { $how = 'clear entry' }
    elseif ($r.Kind -ne 'store') { $how = (Get-UninstallCommand $r).Strategy }
    if ($r.Machine) { $needs = 'admin' }
    $size = 'unknown'
    if ($r.EstimatedSizeKb -gt 0) { $size = Format-Bytes ([long]$r.EstimatedSizeKb * 1024) }
    $name = [string]$r.DisplayName
    # "Linear 1.32.8" already carries its version: never print it twice.
    if ($r.DisplayVersion -and $name.IndexOf([string]$r.DisplayVersion, [StringComparison]::OrdinalIgnoreCase) -lt 0) { $name = "$name $($r.DisplayVersion)" }
    if ($name.Length -gt 44) { $name = $name.Substring(0, 43) + '~' }
    $ran = Get-UninstallRanText -Row $r -Prefetch $prefetch
    Write-UiLine ("  {0,3}  {1,10}  {2,-7} {3,-44} {4,-12} {5,5}  {6}" -f $i, $size, (Get-UninstallKindLabel $r.Kind), $name, $how, $ran, $needs) 'Gray'
    $extra = [ordered]@{ kind = (Get-UninstallKindLabel $r.Kind); strategy = $how; needs_admin = [bool]$r.Machine; ran = $ran; publisher = [string]$r.Publisher; version = [string]$r.DisplayVersion }
    if ($r.Kind -eq 'stale') { $extra.uninstaller = [string](Get-UninstallCommand $r).FilePath }
    Add-JsonCandidate -Section 26 -Index $i -Path $r.KeyPath -Bytes ([long]$r.EstimatedSizeKb * 1024) -IdleDays -1 -Label $r.DisplayName -Extra $extra
    $i++
  }
  $picks = @(Read-MultiSelect -Total $rows.Count -NoAutoYes -Candidates @($rows | ForEach-Object { $_.KeyPath }))
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  if (-not $ws.DryRun) {
    if (-not (Confirm-Ui -Prompt "Remove $($picks.Count) program(s) and app(s), one at a time?" -Default 'n' -NoAutoYes -ScriptedOk)) { Write-Info 'skipped'; return }
  }
  $removed = @()
  foreach ($k in $picks) {
    $row = $rows[$k - 1]
    if ((Invoke-UninstallRow -Row $row) -eq 'removed') { $removed += $row }
  }
  if ($ws.DryRun) { Write-Note 'what a program leaves behind is offered after a real removal'; return }
  $programs = @($removed | Where-Object { $_.Kind -eq 'program' })
  if ($programs.Count -eq 0) { return }
  Write-Section 'Folders the removed programs left'
  Invoke-LeftoverChoice -Rows @(Find-ProgramLeftovers -Programs $programs) -Section 26 -PathsOrConsoleOnly
  Write-Section 'Registry keys, shortcuts and startup entries the removed programs left'
  Invoke-ExtraLeftoverChoice -Rows @(Find-RemovedProgramExtras -Programs $programs) -Section 26 -PathsOrConsoleOnly
}

function Find-RemovedProgramExtras {
  <# .SYNOPSIS Section 26's second pass for the programs just removed: their registry keys, Start-menu shortcuts,
     and the startup entries and tasks that ran a file inside their install folders. #>
  param([pscustomobject[]] $Programs)
  $locs = @($Programs | ForEach-Object { ([string]$_.InstallLocation).Trim().Trim('"').TrimEnd('\') } | Where-Object { $_ -match '^[A-Za-z]:\\.+' -and -not (Get-ProtectionReason $_) } | ForEach-Object { $_ + '\' })
  $index = Get-InstalledProgramIndex -IgnorePaths @($locs | ForEach-Object { $_.TrimEnd('\') })
  $rows = @(Find-RegistryLeftovers -Programs $Programs -Index $index)
  $rows += @(Find-ShortcutLeftovers -Programs $Programs)
  foreach ($r in @(Find-DeadStartupEntries) + @(Find-DeadScheduledTasks)) {
    if (@($locs | Where-Object { ([string]$r.Target).StartsWith($_, [StringComparison]::OrdinalIgnoreCase) }).Count -gt 0) { $rows += $r }
  }
  return $rows
}
