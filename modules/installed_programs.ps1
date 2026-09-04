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
    Write-UiLine ("  {0,-44} {1,-14} {2,10} {3,6}  {4}" -f 'PROGRAM', 'VERSION', 'SIZE', 'IDLE', 'PUBLISHER') 'White'
    foreach ($s in ($scored | Sort-Object Bytes -Descending)) {
      $size = 'unknown'
      if ($s.Bytes -gt 0) { $size = Format-Bytes $s.Bytes }
      $line = "  {0,-44} {1,-14} {2,10} {3,5}d  {4}" -f $s.Row.DisplayName, $s.Row.DisplayVersion, $size, $s.Idle, $s.Row.Publisher
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
