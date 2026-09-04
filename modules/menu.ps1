# menu.ps1 - jump-to menu: run one section at a time; toggle dry-run and auto-yes.

function Show-Menu {
  $ws = $Script:WS
  Write-UiLine '' 'Gray'
  Write-Banner
  $sys = New-Object IO.DriveInfo($Script:P.SD)
  $dry = 'OFF'
  if ($ws.DryRun) { $dry = 'ON' }
  $yes = 'OFF'
  if ($ws.Yes) { $yes = 'ON' }
  $adm = 'no'
  if ($ws.IsAdmin) { $adm = 'yes' }
  Write-UiLine ("  system drive free: {0}   dry-run: {1}   auto-yes: {2}   elevated: {3}" -f (Format-Bytes $sys.AvailableFreeSpace), $dry, $yes, $adm) 'Cyan'
  Write-UiLine '' 'Gray'
  foreach ($s in $Script:WS_SECTIONS) {
    $mark = ' '
    if ($ws.Report.steps | Where-Object { $_.section -eq $s.Id -and $_.status -in 'ran', 'dry-run' }) { $mark = $ws.Glyph.ok }
    $flags = ''
    if ($s.Admin) { $flags += ' [admin]' }
    if ($s.Batch -eq 'deep') { $flags += ' [deep]' }
    if ($s.Batch -eq 'interactive') { $flags += ' [interactive]' }
    $color = 'Gray'
    if ($s.Admin -and -not $ws.IsAdmin) { $color = 'DarkGray' }
    Write-UiLine ("  {0} [{1,2}] {2}{3}" -f $mark, $s.Id, $s.Title, $flags) $color
  }
  Write-UiLine '' 'Gray'
  Write-UiLine '   [A] run the safe batch     [D] toggle dry-run     [Y] toggle auto-yes     [S] summary     [Q] quit' 'White'
}

function Invoke-Menu {
  $ws = $Script:WS
  if (-not $ws.Interactive) {
    Write-Err 'The menu needs an interactive console. For unattended runs use:  windowsweep --all --yes'
    $ws.ExitCode = $Script:WS_EXIT_USAGE
    return
  }
  while ($true) {
    Show-Menu
    $lo = ($Script:WS_SECTIONS | Measure-Object Id -Minimum).Minimum
    $hi = ($Script:WS_SECTIONS | Measure-Object Id -Maximum).Maximum
    $choice = Read-Choice -Prompt "  Select [$lo-$hi / A / D / Y / S / Q]: " -Default ''
    if ($choice -eq '') { continue }
    switch -Regex ($choice) {
      '^q' { Show-SessionSummary; return }
      '^a' {
        $ids = @($Script:WS_SAFE_BATCH)
        if ($ws.IsAdmin) { $ids += $Script:WS_SAFE_BATCH_ADMIN }
        $ws.BatchMode = $true
        try { foreach ($id in $ids) { Invoke-SectionById -Id $id } } finally { $ws.BatchMode = $false }
        Wait-Enter
      }
      '^d' { $ws.DryRun = -not $ws.DryRun }
      '^y' { $ws.Yes = -not $ws.Yes }
      '^s' { Show-SessionSummary; Wait-Enter }
      '^\d+$' {
        $id = [int]$choice
        if (Get-Section $id) { Invoke-SectionById -Id $id; Wait-Enter } else { Write-Warn "no section $id" }
      }
      default { Write-Warn "unrecognised choice: $choice" }
    }
  }
}
