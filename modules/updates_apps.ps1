# updates_apps.ps1 - section 32: app updates you pick, one at a time, through winget. winget reaches its own
# sources; this file makes no network call. --dry-run updates nothing, an app that is running is skipped, and no
# restart is ever asked for. ASCII only.

function Expand-WideText {
  <# .SYNOPSIS Follow each double-width (East Asian) character with a NUL so a character index equals a console
     column. winget aligns its table by display width, so a Japanese header or a Chinese app name would otherwise
     shift every column after it. Split-WingetRow removes the NULs from each cell again. Pure. #>
  param([string] $Text)
  $sb = New-Object System.Text.StringBuilder
  foreach ($ch in ([string]$Text).ToCharArray()) {
    $null = $sb.Append($ch)
    $c = [int]$ch
    if (($c -ge 0x1100 -and $c -le 0x115F) -or ($c -ge 0x2E80 -and $c -le 0xA4CF -and $c -ne 0x303F) -or ($c -ge 0xAC00 -and $c -le 0xD7A3) -or
      ($c -ge 0xF900 -and $c -le 0xFAFF) -or ($c -ge 0xFE30 -and $c -le 0xFE4F) -or ($c -ge 0xFF00 -and $c -le 0xFF60) -or ($c -ge 0xFFE0 -and $c -le 0xFFE6)) {
      $null = $sb.Append([char]0)
    }
  }
  return $sb.ToString()
}

function Get-ColumnStarts {
  <# .SYNOPSIS Where each column of a winget header begins: every non-space that follows a space (or starts the line).
     Positions, never words - the header is localised. Pure. #>
  param([string] $Header)
  $starts = @()
  for ($c = 0; $c -lt $Header.Length; $c++) {
    if ($Header[$c] -ne ' ' -and ($c -eq 0 -or $Header[$c - 1] -eq ' ')) { $starts += $c }
  }
  return $starts
}

function Split-WingetRow {
  <# .SYNOPSIS The trimmed cells of one table row, or $null when the line does not fit the grid (the count line, a
     message): every column must begin after a space, and the Id must be a single word. Pure. #>
  param([string] $Line, [int[]] $Starts)
  if ($Starts.Count -lt 4 -or $Line.Length -le $Starts[1]) { return $null }
  $cells = @()
  for ($k = 0; $k -lt $Starts.Count; $k++) {
    $from = $Starts[$k]
    if ($from -ge $Line.Length) { $cells += ''; continue }
    if ($k -gt 0 -and $Line[$from - 1] -ne ' ') { return $null }
    $to = $Line.Length
    if ($k + 1 -lt $Starts.Count -and $Starts[$k + 1] -lt $Line.Length) { $to = $Starts[$k + 1] }
    $cells += $Line.Substring($from, $to - $from).Replace([string][char]0, '').Trim()
  }
  if (-not $cells[1] -or $cells[1] -match '\s') { return $null }
  return , $cells
}

function ConvertFrom-WingetTable {
  <# .SYNOPSIS Parse `winget upgrade` output by column position. Spinner fragments go (only the text after a line's
     last carriage return counts); the column starts come from the header line just above the dashes; rows run until
     a blank line or a line that does not fit the grid ("23 upgrades available."). A row whose Id winget cut short
     with an ellipsis is skipped - a cut Id names the wrong package or none - while a cut Name is fine. Only the
     first table is returned; rows of any later table ("require explicit targeting") are only counted.
     Returns Rows (Name, Id, Version, Available, Source), Truncated (names), LaterRows and Tables. Pure. #>
  param([string[]] $Lines)
  $ell = [string][char]0x2026
  $clean = @(foreach ($l in @($Lines)) {
      $t = [string]$l
      $cr = $t.LastIndexOf([char]13)
      if ($cr -ge 0) { $t = $t.Substring($cr + 1) }
      Expand-WideText $t.TrimEnd()
    })
  $out = [pscustomobject]@{ Rows = @(); Truncated = @(); LaterRows = 0; Tables = 0 }
  $i = 0
  while ($i -lt $clean.Count) {
    if ($clean[$i] -notmatch '^-{3,}$') { $i++; continue }
    $h = $i - 1
    while ($h -ge 0 -and -not $clean[$h].Trim()) { $h-- }
    $i++
    if ($h -lt 0) { continue }
    $starts = @(Get-ColumnStarts $clean[$h])
    $out.Tables++
    while ($i -lt $clean.Count -and $clean[$i].Trim()) {
      $cells = Split-WingetRow -Line $clean[$i] -Starts $starts
      if ($null -eq $cells) { break }
      $i++
      if ($out.Tables -gt 1) { $out.LaterRows++; continue }
      if ($cells[1].EndsWith($ell)) { $out.Truncated += $cells[0]; continue }
      $src = ''
      if ($cells.Count -ge 5) { $src = $cells[$cells.Count - 1] }
      $out.Rows += [pscustomobject]@{ Name = $cells[0]; Id = $cells[1]; Version = $cells[2]; Available = $cells[3]; Source = $src }
    }
  }
  return $out
}

function Get-WingetExitKind {
  <# .SYNOPSIS What one `winget upgrade` exit code means here: updated, restart, current, in-use, cancelled or failed.
     The codes were checked with `winget error` (winget 1.29, 2026-11-13). Pure. #>
  param([int] $Code)
  switch ('0x{0:X8}' -f $Code) {
    '0x00000000' { return 'updated' }
    '0x8A150109' { return 'restart' }    # APPINSTALLER_CLI_ERROR_INSTALL_REBOOT_REQUIRED_TO_FINISH
    '0x8A15002B' { return 'current' }    # APPINSTALLER_CLI_ERROR_UPDATE_NOT_APPLICABLE
    '0x8A150101' { return 'in-use' }     # APPINSTALLER_CLI_ERROR_INSTALL_PACKAGE_IN_USE
    '0x8A150103' { return 'in-use' }     # APPINSTALLER_CLI_ERROR_INSTALL_FILE_IN_USE
    '0x8A15010C' { return 'cancelled' }  # APPINSTALLER_CLI_ERROR_INSTALL_CANCELLED_BY_USER
    # Both seen on the P52 (2026-11-14): stripe is installed for one account, so an elevated run may not touch it;
    # the Store's OBS install found no network at that moment.
    '0x8A15007D' { return 'user-scope' } # APPINSTALLER_CLI_ERROR_ADMIN_CONTEXT_ACTION_PROHIBITED
    '0x8A150107' { return 'no-network' } # APPINSTALLER_CLI_ERROR_INSTALL_NO_NETWORK
  }
  return 'failed'
}

function Invoke-WingetCapture {
  <# .SYNOPSIS Run winget once and return its output lines and exit code. winget writes UTF-8, so the console code
     page is UTF-8 for the call and put back in a finally block. #>
  param([string[]] $Arguments)
  $prev = $null
  try { $prev = [Console]::OutputEncoding; [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) } catch { $prev = $null }
  $lines = @(); $code = -1
  try {
    $lines = @(& winget @Arguments 2>&1 | ForEach-Object { [string]$_ })
    $code = [int]$LASTEXITCODE
  } catch {
    $lines = @($_.Exception.Message)
  } finally {
    if ($null -ne $prev) { try { [Console]::OutputEncoding = $prev } catch { $null = $_ } }
  }
  return [pscustomobject]@{ Lines = $lines; ExitCode = $code }
}

function Get-ProgramLocationMap {
  <# .SYNOPSIS Install folders by program-name token, from the uninstall hives, so a winget row can be matched to the
     folder its running programs live in. Shared folders (Program Files itself, the profile, AppData, ...) are left
     out: a program registered with one would make every process look like its own. #>
  $P = $Script:P
  $shared = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($s in @($P.PF, $P.PF86, $P.PD, $P.SR, $P.U, $P.L, $P.A, (Join-Path $P.L 'Programs'))) { if ($s) { $null = $shared.Add($s) } }
  $map = @{}
  foreach ($r in @(Get-InstalledProgramRows)) {
    $loc = Get-FullPath (([string]$r.InstallLocation).Trim().Trim('"'))
    if (-not $loc -or $loc.Length -le 3 -or $shared.Contains($loc)) { continue }
    $tok = ConvertTo-MatchToken $r.DisplayName
    if ($tok.Length -lt 3) { continue }
    if (-not $map.ContainsKey($tok)) { $map[$tok] = @() }
    $map[$tok] += $loc
  }
  return $map
}

function Get-UserSessionExecutablePaths {
  <# .SYNOPSIS Executable paths of processes in a signed-in session (SessionId above 0). A Windows service runs in
     session 0 and is no app someone has open: Free Download Manager's always-on helper service made section 32
     skip its update on the P52 (2026-11-14). The installer stops its own service when it needs to. #>
  try { return @(Get-CimInstance Win32_Process -Filter 'SessionId > 0' -ErrorAction Stop | ForEach-Object { [string]$_.ExecutablePath } | Where-Object { $_ }) } catch { return @() }
}

function Get-RunningExeForPackage {
  <# .SYNOPSIS The first running program inside the install folder of the app a winget row names, or ''. The row is
     matched to an uninstall entry by name token, the way section 24 matches winget ids. Pure. #>
  param([pscustomobject] $Package, [hashtable] $Locations, [string[]] $Busy)
  $tok = ConvertTo-MatchToken $Package.Name
  if (-not $tok -or -not $Locations.ContainsKey($tok)) { return '' }
  foreach ($loc in $Locations[$tok]) {
    $prefix = $loc.TrimEnd('\') + '\'
    foreach ($b in $Busy) { if ($b.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) { return $b } }
  }
  return ''
}

function Write-WingetResult {
  <# .SYNOPSIS One verdict line for one `winget upgrade`; returns $true when Windows needs a restart to finish it. #>
  param([pscustomobject] $Package, [int] $Code)
  $hex = '0x{0:X8}' -f $Code
  Write-LogLine "winget upgrade --id $($Package.Id): exit $Code ($hex)"
  switch (Get-WingetExitKind $Code) {
    'updated' { Write-Ok ("{0} updated to {1}" -f $Package.Name, $Package.Available) }
    'restart' { Write-Ok ("{0} updated to {1}; Windows needs a restart to finish it" -f $Package.Name, $Package.Available); return $true }
    'current' { Write-Info ("{0} is already current: winget found no applicable update (exit {1}, {2})" -f $Package.Name, $Code, $hex) }
    'in-use' { Write-Warn ("{0} is in use - close it and run section 32 again (exit {1}, {2})" -f $Package.Name, $Code, $hex) }
    'cancelled' { Write-Warn ("{0} was not updated: its installer was cancelled (exit {1}, {2})" -f $Package.Name, $Code, $hex) }
    'user-scope' { Write-Warn ("{0} is installed for your account only, and winget will not update it from an elevated run - run section 32 again without --elevate (exit {1}, {2})" -f $Package.Name, $Code, $hex) }
    'no-network' { Write-Warn ("{0} was not updated: its installer could not reach the network just then - run section 32 again (exit {1}, {2})" -f $Package.Name, $Code, $hex) }
    default { Write-Err ("{0} was not updated: winget exited with {1} ({2})" -f $Package.Name, $Code, $hex) }
  }
  return $false
}

function Get-Targets32 {
  return @((New-Target 32 'App updates (winget)' 'winget upgrade --id <Id> --exact --silent' -Kind cmd -Note 'you pick; one app at a time; a running app is skipped; dry-run updates nothing'))
}

function Invoke-Section32 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Apps winget can update are listed with the version installed and the version available, and you pick. winget',
    'updates each pick from its own source, silently and one at a time, after you confirm. An app that is running',
    'is skipped until you close it. An installer that writes for every user shows its own UAC prompt when this run',
    'is not elevated.'
  )
  if (-not (Test-CommandPresent 'winget')) { Write-Info 'winget is not on this PC (it comes with App Installer from the Microsoft Store), so there is nothing to ask'; return }
  Write-Info 'asking winget which apps have an update (it reads its sources; this can take a minute)'
  $cap = Invoke-WingetCapture -Arguments @('upgrade', '--include-unknown', '--disable-interactivity', '--accept-source-agreements')
  Write-LogLine "winget upgrade (list): exit $($cap.ExitCode), $($cap.Lines.Count) line(s)"
  $table = ConvertFrom-WingetTable -Lines $cap.Lines
  if ($table.Tables -eq 0 -and ('0x{0:X8}' -f $cap.ExitCode) -notin '0x00000000', '0x8A150014') {
    Write-Warn ("winget could not list updates (exit {0}, 0x{0:X8})" -f $cap.ExitCode)
    return
  }
  foreach ($n in $table.Truncated) { Write-Note "$n is not offered: winget cut its Id short in the table, and a cut Id cannot name the package" }
  if ($table.LaterRows -gt 0) { Write-Note "$($table.LaterRows) more app(s) are in winget's second list, of updates it installs only when named one by one; they are not offered here" }
  $rows = @($table.Rows)
  if ($rows.Count -eq 0) { Write-Ok 'winget has no update for any installed app'; return }
  Write-UiLine ("  {0,3}  {1,-44} {2,-16} {3,-16} {4}" -f '#', 'APP', 'INSTALLED', 'AVAILABLE', 'SOURCE') 'White'
  # Listing-time snapshot for --json callers (running = the app would be skipped now); picks re-check below.
  $locations = Get-ProgramLocationMap
  $listBusy = @(Get-UserSessionExecutablePaths)
  $i = 1
  foreach ($r in $rows) {
    Write-UiLine ("  {0,3}  {1,-44} {2,-16} {3,-16} {4}" -f $i, (Format-CellText $r.Name 44), (Format-CellText $r.Version 16), (Format-CellText $r.Available 16), $r.Source) 'Gray'
    $isRunning = [bool](Get-RunningExeForPackage -Package $r -Locations $locations -Busy $listBusy)
    Add-JsonCandidate -Section 32 -Index $i -Path "winget:$($r.Id)" -Bytes 0 -IdleDays -1 -Label $r.Name -Extra ([ordered]@{
        kind = 'app-update'; id = $r.Id; version = $r.Version; available = $r.Available; source = $r.Source; needs_admin = $false; running = $isRunning })
    $i++
  }
  $picks = @(Read-MultiSelect -Total $rows.Count -NoAutoYes -Candidates @($rows | ForEach-Object { "winget:$($_.Id)" }))
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  Write-LogLine ('section 32 picks: ' + (($picks | ForEach-Object { $rows[$_ - 1].Id }) -join ', '))
  if ($ws.DryRun) {
    $busy = @(Get-UserSessionExecutablePaths)
    foreach ($k in $picks) {
      $r = $rows[$k - 1]
      $run = Get-RunningExeForPackage -Package $r -Locations $locations -Busy $busy
      if ($run) { Write-DryRun ("would skip {0}: it is running ({1}); close it first" -f $r.Name, [IO.Path]::GetFileName($run)) }
      else { Write-DryRun ("would update {0} {1} -> {2}: winget upgrade --id {3} --exact --silent" -f $r.Name, $r.Version, $r.Available, $r.Id) }
    }
    Write-Note 'nothing was updated'
    return
  }
  if (-not (Confirm-Ui -Prompt "Update $($picks.Count) app(s) with winget, one at a time?" -Default 'n' -NoAutoYes -ScriptedOk)) { Write-Info 'skipped'; return }
  $restart = $false
  foreach ($k in $picks) {
    $r = $rows[$k - 1]
    $run = Get-RunningExeForPackage -Package $r -Locations $locations -Busy @(Get-UserSessionExecutablePaths)
    if ($run) { Write-Warn ("{0} is running ({1}) - close it first; skipped" -f $r.Name, [IO.Path]::GetFileName($run)); continue }
    Write-Info ("updating {0} {1} -> {2} with winget" -f $r.Name, $r.Version, $r.Available)
    $res = Invoke-WingetCapture -Arguments @('upgrade', '--id', $r.Id, '--exact', '--silent', '--accept-package-agreements', '--accept-source-agreements', '--disable-interactivity')
    foreach ($l in $res.Lines) {
      $t = [string]$l
      $cr = $t.LastIndexOf([char]13)
      if ($cr -ge 0) { $t = $t.Substring($cr + 1) }
      if ($t.Trim()) { Write-LogLine "  $t" }
    }
    if (Write-WingetResult -Package $r -Code $res.ExitCode) { $restart = $true }
  }
  if ($restart) { Add-RestartHint }
}
