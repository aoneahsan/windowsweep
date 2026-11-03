# installed_programs.ps1 - section 24: installed programs nothing has modified for N+ days. Report only.
#
# It NEVER runs an uninstaller, in any mode. Windows keeps no reliable "last launched" record, so the number
# reported is "not modified", derived from the files under InstallLocation - never described as "unused".

function Get-WingetIdMap {
  <# .SYNOPSIS One winget call, parsed once: normalised program name -> package id. Empty when winget is absent. #>
  $map = @{}
  if (-not (Test-CommandPresent 'winget')) { return $map }
  $lines = @()
  try { $lines = @(& winget list --disable-interactivity 2>$null) } catch { return $map }
  foreach ($line in $lines) {
    $text = [string]$line
    # "Name   Id   Version   Source" with runs of spaces between columns; ids never contain a space.
    if ($text -notmatch '^(.+?)\s\s+([^\s]+)\s\s+') { continue }
    $name = ConvertTo-MatchToken $Matches[1]
    $id = $Matches[2]
    if ($name.Length -lt 3 -or $id -eq 'Id') { continue }
    if (-not $map.ContainsKey($name)) { $map[$name] = $id }
  }
  return $map
}

function Get-InstallLocationIdleDays {
  <# .SYNOPSIS Days since the newest LAST-WRITE at depth <= 2 under an install folder, or -1 when unknowable.
     Deliberately NOT Get-NewestTimestampUtc, which the cleanup sections use: that takes the newest of write,
     access and creation, and last-access is live on this machine - measured 2026-09-04, every install folder
     read as 0 days idle that way (Git, Gpg4win, RustDesk, Malwarebytes all 0d) while last-write gave 120d,
     203d, 163d and 148d. This section asks "not modified", so last-write is the matching question. #>
  param([string] $Location, [int] $MaxEntries = 4000)
  if ([string]::IsNullOrWhiteSpace($Location)) { return -1 }
  $root = Get-FullPath ($Location.Trim().Trim('"').TrimEnd('\'))
  if (-not $root -or -not (Test-DirPresent $root)) { return -1 }
  $newest = [datetime]::MinValue
  $seen = 0
  $stack = New-Object System.Collections.Generic.Stack[object]
  $stack.Push(@($root, 0))
  while ($stack.Count -gt 0 -and $seen -lt $MaxEntries) {
    $item = $stack.Pop()
    foreach ($e in (Get-ChildEntries ([string]$item[0]))) {
      $seen++
      if (Test-ReparsePoint $e) { continue }
      if ($e -is [IO.DirectoryInfo]) {
        if ([int]$item[1] -lt 2) { $stack.Push(@((Remove-LongPrefix $e.FullName), [int]$item[1] + 1)) }
        continue
      }
      if ($e.LastWriteTimeUtc -gt $newest) { $newest = $e.LastWriteTimeUtc }
    }
  }
  if ($newest -eq [datetime]::MinValue) { return -1 }
  return [int][math]::Floor(([datetime]::UtcNow - $newest).TotalDays)
}

function ConvertFrom-PrefetchName {
  <# .SYNOPSIS "CHROME.EXE-1A2B3C4D.pf" -> "chrome.exe"; '' for anything else. #>
  param([string] $Name)
  if ($Name -match '^(.+\.exe)-[0-9A-Fa-f]{8}\.pf$') { return $Matches[1].ToLowerInvariant() }
  return ''
}

function Get-PrefetchLastRun {
  <# .SYNOPSIS P9: program file name -> newest run (UTC) from Windows\Prefetch, which Windows rewrites on every
     run. Readable only when elevated; empty otherwise or when prefetch is off. #>
  $map = @{}
  if (-not $Script:WS.IsAdmin) { return $map }
  foreach ($e in (Get-ChildEntries (Join-Path $Script:P.SR 'Prefetch'))) {
    if (-not ($e -is [IO.FileInfo])) { continue }
    $exe = ConvertFrom-PrefetchName $e.Name
    if ($exe -and (-not $map.ContainsKey($exe) -or $e.LastWriteTimeUtc -gt $map[$exe])) { $map[$exe] = $e.LastWriteTimeUtc }
  }
  return $map
}

function Get-InstallLocationExeNames {
  <# .SYNOPSIS Program file names (lower case) at depth <= 2 under an install folder, never through a junction. #>
  param([string] $Location, [int] $MaxEntries = 4000)
  $names = @()
  if ([string]::IsNullOrWhiteSpace($Location)) { return $names }
  $root = Get-FullPath ($Location.Trim().Trim('"').TrimEnd('\'))
  if (-not $root -or -not (Test-DirPresent $root)) { return $names }
  $stack = New-Object System.Collections.Generic.Stack[object]
  $stack.Push(@($root, 0))
  $seen = 0
  while ($stack.Count -gt 0 -and $seen -lt $MaxEntries) {
    $item = $stack.Pop()
    foreach ($e in (Get-ChildEntries ([string]$item[0]))) {
      $seen++
      if (Test-ReparsePoint $e) { continue }
      if ($e -is [IO.DirectoryInfo]) { if ([int]$item[1] -lt 2) { $stack.Push(@((Remove-LongPrefix $e.FullName), ([int]$item[1] + 1))) }; continue }
      if ($e.Name -like '*.exe') { $names += $e.Name.ToLowerInvariant() }
    }
  }
  return $names
}

# Prefetch keys a run by file name only, so a name many programs ship says nothing about this one: Steam's
# uninstall.exe running made FileZilla (which also ships uninstall.exe) look "ran today" (P52, 2026-11-03).
$Script:WS_PREFETCH_GENERIC = '^(unins\d*|uninst.*|uninstall.*|update.*|updater.*|setup.*|install.*|crash.*|elevate.*|helper.*|maintenancetool|au_|launcher|bootstrap.*|vc_redist.*|notification_helper|squirrel)\.exe$'

function Get-LastRunDays {
  <# .SYNOPSIS Pure: days since the newest Prefetch run of any of these program files - generic names (uninstall.exe,
     update.exe, setup.exe, crash handlers) never count - or -1 when none ran. #>
  param([string[]] $ExeNames, [hashtable] $Prefetch, [datetime] $NowUtc = [datetime]::UtcNow)
  $best = [datetime]::MinValue
  foreach ($n in @($ExeNames)) {
    if ($n -match $Script:WS_PREFETCH_GENERIC) { continue }
    if ($Prefetch.ContainsKey($n) -and $Prefetch[$n] -gt $best) { $best = $Prefetch[$n] }
  }
  if ($best -eq [datetime]::MinValue) { return -1 }
  return [int][math]::Floor(($NowUtc - $best).TotalDays)
}

function Get-ProgramRemovalHint {
  <# .SYNOPSIS The command that removes a program: winget when it knows it, otherwise its own UninstallString. #>
  param([pscustomobject] $Row, [hashtable] $WingetMap)
  $key = ConvertTo-MatchToken $Row.DisplayName
  if ($WingetMap.ContainsKey($key)) { return "winget uninstall --id $($WingetMap[$key])" }
  if ($Row.UninstallString) { return $Row.UninstallString }
  return '(no uninstall command recorded - remove it from Settings > Apps)'
}

function Get-Targets24 {
  <# .SYNOPSIS Informational only. Section 24 declares nothing deletable: Program Files is protected. #>
  return @((New-Target 24 'Installed programs (registry)' 'HKLM + HKCU Uninstall hives' -Kind cmd -Note 'report only; this section never runs an uninstaller'))
}

function Invoke-Section24 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Programs whose files nothing has modified for a long time, largest first, with the command that removes',
    'each one. Windows keeps no reliable record of when a program last RAN, so this is "not modified", not',
    '"not used" - check the list before acting. This section never runs an uninstaller.'
  )
  $rows = @(Get-InstalledProgramRows | Where-Object { $_.SystemComponent -ne 1 })
  if ($rows.Count -eq 0) { Write-Warn 'no uninstall entries could be read'; return }
  Write-Note "$($rows.Count) installed program(s) found; measuring the ones with an install folder"
  $winget = Get-WingetIdMap
  $scored = @()
  foreach ($r in $rows) {
    $idle = Get-InstallLocationIdleDays -Location $r.InstallLocation
    if ($idle -lt $ws.Days) { continue }
    $scored += [pscustomobject]@{ Row = $r; Idle = $idle; Bytes = ([long]$r.EstimatedSizeKb * 1024) }
  }
  $lines = @("installed programs not modified for $($ws.Days)+ days - $(Get-Date -Format 'yyyy-MM-dd HH:mm')", '')
  if ($scored.Count -eq 0) {
    Write-Info "no installed program has been untouched for $($ws.Days)+ days"
  } else {
    $prefetch = Get-PrefetchLastRun
    if ($prefetch.Count -gt 0) { Write-Note 'RAN = days since Windows Prefetch last saw one of its program files run; "none" means no run is on record (Prefetch keeps about 1,024 programs)' }
    else { Write-Note 'RAN needs an elevated run (Windows Prefetch): windowsweep --only 24 --elevate' }
    Write-UiLine ("  {0,-44} {1,-14} {2,10} {3,6} {4,6}  {5}" -f 'PROGRAM', 'VERSION', 'SIZE', 'IDLE', 'RAN', 'PUBLISHER') 'White'
    foreach ($s in ($scored | Sort-Object Bytes -Descending)) {
      $size = 'unknown'
      if ($s.Bytes -gt 0) { $size = Format-Bytes $s.Bytes }
      $ran = '-'
      if ($prefetch.Count -gt 0) {
        $d = Get-LastRunDays -ExeNames @(Get-InstallLocationExeNames -Location $s.Row.InstallLocation) -Prefetch $prefetch
        if ($d -ge 0) { $ran = "${d}d" } else { $ran = 'none' }
      }
      $line = "  {0,-44} {1,-14} {2,10} {3,5}d {4,6}  {5}" -f $s.Row.DisplayName, $s.Row.DisplayVersion, $size, $s.Idle, $ran, $s.Row.Publisher
      Write-UiLine $line 'Gray'
      $lines += $line.Trim()
      $lines += ('    remove with: ' + (Get-ProgramRemovalHint -Row $s.Row -WingetMap $winget))
    }
    Write-Section 'Remove one yourself with'
    foreach ($s in ($scored | Sort-Object Bytes -Descending | Select-Object -First 10)) {
      Write-Plain ('  ' + (Get-ProgramRemovalHint -Row $s.Row -WingetMap $winget))
    }
  }
  Write-Section 'Store apps (not system packages)'
  $appx = @()
  try { $appx = @(Get-AppxPackage -ErrorAction SilentlyContinue | Where-Object { -not $_.IsFramework -and $_.SignatureKind -ne 'System' }) } catch { $appx = @() }
  if ($appx.Count -eq 0) { Write-Info 'none found' } else {
    foreach ($a in ($appx | Sort-Object Name)) {
      Write-UiLine ("  {0,-52} {1}" -f $a.Name, $a.Version) 'Gray'
      $lines += ("store  {0}  {1}" -f $a.Name, $a.Version)
      $lines += ('    remove with: Remove-AppxPackage -Package ' + $a.PackageFullName)
    }
    Write-Note 'remove one with:  Remove-AppxPackage -Package <PackageFullName>'
  }
  if (-not $ws.NoReport) {
    $out = Join-Path $ws.ReportsDir ('installed-programs-' + $ws.Stamp + '.txt')
    try { [IO.File]::WriteAllLines($out, $lines); Write-Note "list saved: $out" } catch { $null = $_ }
  }
}
