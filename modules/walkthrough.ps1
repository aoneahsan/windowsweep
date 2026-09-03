# walkthrough.ps1 - the default interactive mode: every category, one step at a time, with a running total.

function Show-Welcome {
  $ws = $Script:WS
  Write-Banner
  Write-Box "$Script:WS_NAME" $Script:WS_TAGLINE
  Show-DriveTable
  Write-UiLine '' 'Gray'
  Write-Plain '  This walkthrough visits every cleanup category. At each step:'
  Write-Plain '    a  run it (default)     s  skip it     q  stop the walkthrough'
  if ($ws.DryRun) { Write-UiLine '  DRY-RUN: every step only reports what it would remove.' 'Magenta' }
  $dev = 'off'
  if ($ws.Developer) { $dev = 'on' }
  Write-Note "developer mode: $dev   idle window: $($ws.Days) days   temp window: $($ws.TempDays) days"
  Write-Note "logs and reports: $($ws.Home)"
  Write-Note "by $Script:WS_AUTHOR - $Script:WS_WEB"
  Wait-Enter
}

function Invoke-Walkthrough {
  $ws = $Script:WS
  if (-not $ws.Interactive) {
    Write-Err 'The walkthrough needs an interactive console. For unattended runs use:  windowsweep --all --yes   (or --scan / --dry-run to look first)'
    $ws.ExitCode = $Script:WS_EXIT_USAGE
    return
  }
  Show-Welcome
  Write-Box 'Pre-scan' 'Read-only - what each section can reach right now'
  if (Get-Command Invoke-Section00 -ErrorAction SilentlyContinue) { Invoke-Section00 }
  $null = Show-ScanTable
  Wait-Enter

  $steps = @($Script:WS_WALKTHROUGH)
  if ($ws.IsAdmin) { $steps += $Script:WS_WALKTHROUGH_ADMIN }
  $total = $steps.Count + 2
  $n = 0
  $quit = $false
  foreach ($id in $steps) {
    $n++
    $sec = Get-Section $id
    Write-Step -N $n -Total $total -Title $sec.Title
    $choice = Read-Choice -Prompt '  action: a run   s skip   q quit  > ' -Default 'a'
    if ($choice -eq 'q') { Write-Warn 'walkthrough stopped'; Add-ReportStep -Section $id -Title $sec.Title -Status 'skipped' -Note 'quit'; $quit = $true; break }
    if ($choice -eq 's') { Write-Info 'skipped'; Add-ReportStep -Section $id -Title $sec.Title -Status 'skipped'; continue }
    $ws.SectionPreConfirmed = $true
    try { Invoke-SectionById -Id $id } finally { $ws.SectionPreConfirmed = $false }
  }
  if (-not $quit -and -not $ws.IsAdmin) {
    $n++
    Write-Step -N $n -Total $total -Title 'System-level cleanup (needs Administrator)'
    Write-Plain '  Sections 12 (Windows Update cache), 13 (Disk Cleanup engine) and 14 (component store) need an elevated'
    Write-Plain '  console. Run them afterwards with:'
    Write-Plain '      windowsweep --profile system --yes --elevate'
    Write-Plain '  and, if you want the hibernation file gone too (section 15):'
    Write-Plain '      windowsweep --only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate'
    $ws.Hints += 'Admin sections:  windowsweep --profile system --yes --elevate'
    Wait-Enter
  }
  if (-not $quit) {
    $n++
    Write-Step -N $n -Total $total -Title 'Disk usage report'
    Invoke-SectionById -Id 21
  }
  Show-SessionSummary
  Show-NextSteps
}

function Show-NextSteps {
  $ws = $Script:WS
  $tips = @()
  if (-not (Get-ScheduledTask -TaskName $Script:WS_TASK_NAME -ErrorAction SilentlyContinue)) { $tips += 'Schedule the safe batch weekly:   windowsweep --install-task' }
  $tips += 'Browse or export past reports:    windowsweep --reports'
  if ($ws.DryRun) { $tips += 'This was a dry-run. Run the same command without --dry-run to reclaim the space.' }
  if ($tips.Count -gt 0) {
    Write-UiLine '' 'Gray'
    Write-Info 'next steps:'
    foreach ($t in $tips) { Write-Note $t }
  }
}
