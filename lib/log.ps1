# log.ps1 - session log, freed-bytes tally, drive snapshots and the JSON session report.

function Initialize-Log {
  <# .SYNOPSIS Create the data directories and open this run's log with a credit header. #>
  $ws = $Script:WS
  foreach ($d in @($ws.LogsDir, $ws.ReportsDir)) {
    if (-not (Test-Path -LiteralPath $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
  }
  $ws.LogFile = Join-Path $ws.LogsDir ("$Script:WS_NAME-" + $ws.Stamp + '.log')
  $elev = 'no'
  if ($ws.IsAdmin) { $elev = 'yes' }
  $dry = 'no'
  if ($ws.DryRun) { $dry = 'yes' }
  $header = @(
    '# ============================================================'
    "# $Script:WS_NAME v$(Get-ToolVersion) - session log"
    "# Author:   $Script:WS_AUTHOR <$Script:WS_EMAIL>"
    "# Web:      $Script:WS_WEB"
    "# License:  $Script:WS_LICENSE"
    "# Started:  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')"
    "# Mode:     $($ws.Mode)"
    "# Host:     $env:COMPUTERNAME"
    "# User:     $env:USERNAME"
    "# Elevated: $elev"
    "# Dry-run:  $dry"
    "# Launcher: $($ws.Launcher)"
    '# ============================================================'
  )
  try { [IO.File]::WriteAllLines($ws.LogFile, $header) } catch { $ws.LogFile = $null }
}

function Write-Log {
  <# .SYNOPSIS Append one timestamped line to the run log; never throws. #>
  param([string] $Text)
  $f = $Script:WS.LogFile
  if (-not $f) { return }
  try { [IO.File]::AppendAllText($f, ("[{0}] {1}`r`n" -f (Get-Date -Format 'HH:mm:ss'), $Text)) } catch { $null = $_ }
}

function Add-Freed {
  <# .SYNOPSIS Tally bytes freed (or, in dry-run, bytes that would be freed). #>
  param([long] $Bytes)
  if ($Bytes -le 0) { return }
  if ($Script:WS.DryRun) { $Script:WS.TotalEstimated += $Bytes } else { $Script:WS.TotalFreed += $Bytes }
  $Script:WS.SectionFreed += $Bytes
}

function Get-DriveSnapshot {
  <# .SYNOPSIS Size/free bytes of every ready fixed drive. #>
  $rows = @()
  foreach ($d in [IO.DriveInfo]::GetDrives()) {
    try {
      if (-not $d.IsReady) { continue }
      if ($d.DriveType -ne [IO.DriveType]::Fixed) { continue }
      $rows += [ordered]@{ drive = $d.Name.TrimEnd('\'); size_bytes = [long]$d.TotalSize; free_bytes = [long]$d.AvailableFreeSpace }
    } catch { $null = $_ }
  }
  return $rows
}

function Get-SystemDriveFree {
  <# .SYNOPSIS Free bytes on the system drive (used for before/after deltas). #>
  try { return [long](New-Object IO.DriveInfo($env:SystemDrive)).AvailableFreeSpace } catch { return [long]0 }
}

function Show-DriveTable {
  <# .SYNOPSIS Print size / used / free / percent for every fixed drive. #>
  Write-UiLine ("  {0,-6} {1,10} {2,10} {3,10} {4,6}" -f 'DRIVE', 'SIZE', 'USED', 'FREE', 'USE%') 'White'
  foreach ($d in (Get-DriveSnapshot)) {
    $used = $d.size_bytes - $d.free_bytes
    $pct = 0
    if ($d.size_bytes -gt 0) { $pct = [math]::Round(100.0 * $used / $d.size_bytes) }
    $color = 'Gray'
    if ($pct -ge 90) { $color = 'Red' } elseif ($pct -ge 80) { $color = 'Yellow' }
    Write-UiLine ("  {0,-6} {1,10} {2,10} {3,10} {4,5}%" -f $d.drive, (Format-Bytes $d.size_bytes), (Format-Bytes $used), (Format-Bytes $d.free_bytes), $pct) $color
  }
}

function Initialize-Report {
  $ws = $Script:WS
  $ws.Report = @{
    startedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz')
    startedTicks = (Get-Date).Ticks
    drivesBefore = @(Get-DriveSnapshot)
    steps = New-Object System.Collections.ArrayList
  }
}

function Add-ReportStep {
  <# .SYNOPSIS Record a section outcome for the JSON report. Status: ran | skipped | refused | failed | dry-run #>
  param([int] $Section, [string] $Title, [string] $Status, [long] $Freed = 0, [string] $Note = '')
  $ws = $Script:WS
  if (-not $ws.Report) { return }
  $null = $ws.Report.steps.Add([ordered]@{ n = ($ws.Report.steps.Count + 1); section = $Section; title = $Title; status = $Status; freed_bytes = $Freed; note = $Note })
}

function Save-Report {
  <# .SYNOPSIS Write the canonical JSON report (schema 1). Returns the path or $null. #>
  $ws = $Script:WS
  if ($ws.NoReport -or -not $ws.Report) { return $null }
  $ran = 0; $skipped = 0
  foreach ($s in $ws.Report.steps) { if ($s.status -eq 'ran' -or $s.status -eq 'dry-run') { $ran++ } else { $skipped++ } }
  $dev = $null
  if ($null -ne $ws.Developer) { $dev = [bool]$ws.Developer }
  $doc = [ordered]@{
    schema_version = 1
    credits = [ordered]@{
      tool = $Script:WS_NAME; tool_version = (Get-ToolVersion); tool_homepage = $Script:WS_REPO; tool_license = $Script:WS_LICENSE
      author = [ordered]@{ name = $Script:WS_AUTHOR; email = $Script:WS_EMAIL; website = $Script:WS_WEB; linkedin = $Script:WS_LINKEDIN }
    }
    meta = [ordered]@{
      started_at = $ws.Report.startedAt
      finished_at = (Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz')
      duration_seconds = [int][math]::Round(((Get-Date).Ticks - $ws.Report.startedTicks) / 10000000)
      host = $env:COMPUTERNAME; user = $env:USERNAME
      os = $ws.OsCaption; powershell = $PSVersionTable.PSVersion.ToString()
      mode = $ws.Mode; dry_run = [bool]$ws.DryRun; elevated = [bool]$ws.IsAdmin; developer_mode = $dev
      idle_days = $ws.Days; temp_days = $ws.TempDays
      log_file = $ws.LogFile; launcher = $ws.Launcher; via_npx = [bool]$ws.Npx
    }
    disk = [ordered]@{ before = @($ws.Report.drivesBefore); after = @(Get-DriveSnapshot) }
    steps = @($ws.Report.steps)
    totals = [ordered]@{
      total_reclaimed_bytes = [long]$ws.TotalFreed
      total_reclaimed_human = (Format-Bytes $ws.TotalFreed)
      total_estimated_bytes = [long]$ws.TotalEstimated
      total_estimated_human = (Format-Bytes $ws.TotalEstimated)
      steps_run = $ran; steps_skipped = $skipped
    }
  }
  $path = Join-Path $ws.ReportsDir ('report-' + $ws.Stamp + '.json')
  try {
    [IO.File]::WriteAllText($path, ($doc | ConvertTo-Json -Depth 8), (New-Object System.Text.UTF8Encoding($false)))
    $ws.ReportFile = $path
    return $path
  } catch {
    Write-Warn "could not write report: $($_.Exception.Message)"
    return $null
  }
}
