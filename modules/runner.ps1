# runner.ps1 - section dispatch, batch policy enforcement, the read-only scan mode and the summary.

function Get-SectionIdList {
  <# .SYNOPSIS Parse "1,3,5-7" into section ids; validates against the catalogue. #>
  param([string] $Text)
  $ids = New-Object System.Collections.Generic.SortedSet[int]
  foreach ($part in ($Text -split ',')) {
    $part = $part.Trim()
    if (-not $part) { continue }
    if ($part -match '^(\d+)-(\d+)$') {
      $a = [int]$Matches[1]; $b = [int]$Matches[2]
      if ($a -gt $b) { $t = $a; $a = $b; $b = $t }
      for ($i = $a; $i -le $b; $i++) { if (Get-Section $i) { $null = $ids.Add($i) } else { Write-Warn "no section $i - ignored" } }
    } elseif ($part -match '^\d+$') {
      $i = [int]$part
      if (Get-Section $i) { $null = $ids.Add($i) } else { Write-Warn "no section $i - ignored" }
    } else {
      Write-Warn "cannot parse section '$part' - ignored"
    }
  }
  return @($ids)
}

function Get-RequestedSections {
  <# .SYNOPSIS Resolve --all / --only / --profile / --exclude into the ordered list to run. #>
  $ws = $Script:WS
  $ids = @()
  if ($ws.Mode -eq 'all') {
    $ids = @($Script:WS_SAFE_BATCH)
    if ($ws.IsAdmin) { $ids += $Script:WS_SAFE_BATCH_ADMIN }
  } elseif ($ws.OnlyList) {
    $ids = Get-SectionIdList $ws.OnlyList
  } elseif ($ws.Profile) {
    $ids = @($Script:WS_PROFILES[$ws.Profile])
    Write-Info "profile '$($ws.Profile)' = sections $($ids -join ',')"
  }
  if ($ws.Exclude) {
    $ex = Get-SectionIdList $ws.Exclude
    $ids = @($ids | Where-Object { $ex -notcontains $_ })
    Write-Info "after --exclude: sections $($ids -join ',')"
  }
  return @($ids | Sort-Object -Unique)
}

function Invoke-SectionById {
  <# .SYNOPSIS Run one section under the batch, admin and developer policies; records the report step. #>
  param([int] $Id)
  $ws = $Script:WS
  $sec = Get-Section $Id
  if (-not $sec) { Write-Warn "no section $Id"; return }
  $title = "[{0:00}] {1}" -f $sec.Id, $sec.Title
  Write-Box $title
  # Batch policy: deep and interactive-only sections never run unattended without an explicit opt-in.
  if ($ws.BatchMode -and -not $ws.DryRun) {
    if ($sec.Batch -eq 'interactive') {
      Write-Warn "section $Id is interactive-only: it needs a person at the keyboard. Run it from the walkthrough or the menu."
      $ws.Refusals += "section $Id (interactive-only)"
      Add-ReportStep -Section $Id -Title $sec.Title -Status 'refused' -Note 'interactive-only section in batch mode'
      return
    }
    if ($sec.Batch -eq 'deep' -and -not $ws.Deep) {
      Write-Warn "section $Id is deep (irreversible or system-changing): refused in batch mode without --i-understand-deep."
      $ws.Refusals += "section $Id (deep, add --i-understand-deep)"
      Add-ReportStep -Section $Id -Title $sec.Title -Status 'refused' -Note 'deep section without --i-understand-deep'
      return
    }
  }
  if ($sec.Admin -and -not $ws.IsAdmin) {
    Write-Warn "section $Id needs Administrator rights - skipped."
    Write-Note "run it elevated:  windowsweep --only $Id --yes --elevate"
    $ws.Hints += "Admin section $Id skipped: windowsweep --only $Id --yes --elevate"
    Add-ReportStep -Section $Id -Title $sec.Title -Status 'skipped' -Note 'needs Administrator'
    return
  }
  if ($sec.Dev -and $ws.Developer -eq $false -and $Id -in @(4, 17, 20)) {
    Write-Info "developer mode is off - section $Id (developer-only data) skipped."
    Add-ReportStep -Section $Id -Title $sec.Title -Status 'skipped' -Note 'developer mode off'
    return
  }
  $ws.SectionFreed = [long]0
  $before = Get-SystemDriveFree
  $status = 'ran'
  if ($ws.DryRun) { $status = 'dry-run' }
  try {
    & $sec.Fn
  } catch {
    $status = 'failed'
    Write-Err "section $Id failed: $($_.Exception.Message)"
    Write-LogLine ("section $Id error: " + $_.ScriptStackTrace)
    $ws.ExitCode = $Script:WS_EXIT_FAIL
  }
  $after = Get-SystemDriveFree
  $delta = $after - $before
  if ($delta -lt 0) { $delta = 0 }
  $freed = $ws.SectionFreed
  if ($ws.DryRun) {
    if ($freed -gt 0) { Write-UiLine ("  [dry-run] this section would free about {0}" -f (Format-Bytes $freed)) 'Magenta' }
  } elseif ($freed -gt 0 -or $delta -gt 0) {
    Write-UiLine ("  {0} this section freed {1} (system drive gained {2})   running total: {3}" -f $ws.Glyph.ok, (Format-Bytes $freed), (Format-Bytes $delta), (Format-Bytes $ws.TotalFreed)) 'Green'
  } else {
    Write-Note 'no measurable change in this section'
  }
  Add-ReportStep -Section $Id -Title $sec.Title -Status $status -Freed $freed
}

function Invoke-BatchMode {
  <# .SYNOPSIS --all / --only / --profile #>
  $ws = $Script:WS
  $ids = @(Get-RequestedSections)
  if ($ids.Count -eq 0) { Write-Err 'no sections to run'; $ws.ExitCode = $Script:WS_EXIT_USAGE; return }
  Write-Banner
  Show-RunHeader
  Write-Info "running sections: $($ids -join ',')"
  foreach ($id in $ids) { Invoke-SectionById -Id $id }
  Show-SessionSummary
  if ($ws.Refusals.Count -gt 0 -and $ws.Mode -eq 'only' -and $ws.ExitCode -eq 0) { $ws.ExitCode = $Script:WS_EXIT_REFUSED }
}

function Show-RunHeader {
  $ws = $Script:WS
  $strategy = "prune files idle $($ws.Days)+ days (temp: $($ws.TempDays)+ days)"
  if ($ws.PurgeAll) { $strategy = 'FULL PURGE of cache targets' }
  $dev = 'off'
  if ($ws.Developer) { $dev = "on ($($ws.DeveloperSource))" }
  $adm = 'no'
  if ($ws.IsAdmin) { $adm = 'yes' }
  Write-Info "mode: $($ws.Mode)   strategy: $strategy   developer: $dev   elevated: $adm   auto-yes: $($ws.Yes)"
  if ($ws.DryRun) { Write-UiLine '  DRY-RUN: nothing will be deleted; sizes below are estimates of what a real run would remove.' 'Magenta' }
  Write-Info "log: $($ws.LogFile)"
}

function Invoke-ScanMode {
  <# .SYNOPSIS --scan: health report + every target's size + the read-only personal scanners. Deletes nothing. #>
  $ws = $Script:WS
  Write-Banner
  Write-Info 'read-only scan - nothing is deleted'
  if (Get-Command Invoke-Section00 -ErrorAction SilentlyContinue) { Invoke-Section00 }
  Write-Box 'Targets on disk' 'What each section can reach, and how much it currently holds'
  $null = Show-ScanTable
  if (Get-Command Show-PersonalScan -ErrorAction SilentlyContinue) { Show-PersonalScan }
  Add-ReportStep -Section -1 -Title 'Read-only scan' -Status 'ran'
  Show-SessionSummary
}

function Show-SessionSummary {
  $ws = $Script:WS
  Write-Box 'Session summary'
  if ($ws.DryRun) {
    Write-Kv 'Mode:' 'DRY-RUN - nothing was deleted'
    Write-Kv 'Would free (estimate):' (Format-Bytes $ws.TotalEstimated)
  } else {
    Write-Kv 'Reclaimed:' (Format-Bytes $ws.TotalFreed)
  }
  $secs = [int][math]::Round(((Get-Date).Ticks - $ws.Report.startedTicks) / 10000000)
  Write-Kv 'Duration:' (Format-Duration $secs)
  $ran = @($ws.Report.steps | Where-Object { $_.status -in 'ran', 'dry-run' }).Count
  $skipped = @($ws.Report.steps | Where-Object { $_.status -notin 'ran', 'dry-run' }).Count
  Write-Kv 'Sections run / skipped:' "$ran / $skipped"
  Write-Kv 'Log:' $ws.LogFile
  $rep = Save-Report
  if ($rep) { Write-Kv 'Report (JSON):' $rep } elseif ($ws.NoReport) { Write-Kv 'Report:' '(disabled via --no-report)' }
  Write-UiLine '' 'Gray'
  Show-DriveTable
  if ($ws.Refusals.Count -gt 0) {
    Write-UiLine '' 'Gray'
    Write-Warn 'refused in batch mode:'
    foreach ($r in $ws.Refusals) { Write-Note $r }
  }
  if ($ws.Hints.Count -gt 0) {
    Write-UiLine '' 'Gray'
    Write-Info 'next steps:'
    foreach ($h in ($ws.Hints | Sort-Object -Unique)) { Write-Note $h }
  }
  Write-UiLine '' 'Gray'
  Write-Note "$Script:WS_NAME v$(Get-ToolVersion) by $Script:WS_AUTHOR - $Script:WS_REPO"
  if ($ws.JsonMode) { Write-JsonSummary }
}

function Get-JsonSummary {
  <# .SYNOPSIS The --json document (ordered), kept apart from the printer so the self-test can parse it. #>
  $ws = $Script:WS
  return [ordered]@{
    tool = $Script:WS_NAME; version = (Get-ToolVersion); mode = $ws.Mode; dry_run = [bool]$ws.DryRun
    elevated = [bool]$ws.IsAdmin; developer = $ws.Developer
    freed_bytes = [long]$ws.TotalFreed; estimated_bytes = [long]$ws.TotalEstimated
    sections = @($ws.Report.steps | ForEach-Object { [ordered]@{ section = $_.section; status = $_.status; freed_bytes = $_.freed_bytes } })
    refusals = @($ws.Refusals); log_file = $ws.LogFile; report_file = $ws.ReportFile
  }
}

function Write-JsonSummary {
  <# .SYNOPSIS --json: the only line written to stdout. #>
  [Console]::Out.WriteLine(((Get-JsonSummary) | ConvertTo-Json -Depth 5 -Compress))
}
