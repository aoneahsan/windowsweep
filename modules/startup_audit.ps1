# startup_audit.ps1 - section 25: everything that starts with the user or the machine. Report only.
#
# The tool shows; the user decides in Task Manager. That non-goal is deliberate: disabling a startup item is
# a system configuration change, not cleanup, and a wrong one is invisible until the next boot.

function Get-StartupApprovedState {
  <# .SYNOPSIS enabled | disabled | unknown from an Explorer StartupApproved value.
     The value is 12 bytes: a DWORD of flags then a FILETIME. Explorer stamps that FILETIME when the item is
     DISABLED and zeroes it when the item is enabled, so a non-zero tail is the reliable signal.
     Measured on Windows 10 19045 (2026-09-04): five items carried a real FILETIME under a leading 0x01, and
     two enabled ones (0x01 and 0x04) carried an all-zero tail - the widely quoted "byte 0 is 02/03" table
     does not hold there, so the tail is read first and 03 / 07 are kept only as a fallback marker.
     A value shorter than 12 bytes is reported as unknown; it is never guessed. #>
  param([byte[]] $Value)
  if ($null -eq $Value -or $Value.Length -lt 12) { return 'unknown' }
  for ($i = 4; $i -lt 12; $i++) { if ($Value[$i] -ne 0) { return 'disabled' } }
  if ($Value[0] -eq 3 -or $Value[0] -eq 7) { return 'disabled' }
  return 'enabled'
}

function Get-StartupApprovedMap {
  <# .SYNOPSIS name -> enabled|disabled|unknown, from the StartupApproved keys Explorer maintains. #>
  $map = @{}
  $keys = @(
    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run',
    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run32',
    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\StartupFolder',
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run',
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\StartupFolder'
  )
  foreach ($k in $keys) {
    $props = $null
    try { $props = Get-ItemProperty -LiteralPath $k -ErrorAction Stop } catch { continue }
    foreach ($prop in $props.PSObject.Properties) {
      if ($prop.Name.StartsWith('PS')) { continue }
      if (-not ($prop.Value -is [byte[]])) { continue }
      $map[$prop.Name] = Get-StartupApprovedState -Value $prop.Value
    }
  }
  return $map
}

function Get-StartupItems {
  <# .SYNOPSIS Every startup entry the user can see, from all five places Windows keeps them. #>
  $P = $Script:P
  $approved = Get-StartupApprovedMap
  $items = @()
  $runKeys = @(
    @('HKCU Run', 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run'),
    @('HKCU RunOnce', 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce'),
    @('HKLM Run', 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run'),
    @('HKLM RunOnce', 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce'),
    @('HKLM Run (32)', 'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run'),
    @('HKLM RunOnce (32)', 'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunOnce')
  )
  foreach ($rk in $runKeys) {
    # NOT $p: PowerShell variable names are case-insensitive, so $p would silently null the $P roots table.
    $props = $null
    try { $props = Get-ItemProperty -LiteralPath $rk[1] -ErrorAction Stop } catch { continue }
    foreach ($prop in $props.PSObject.Properties) {
      if ($prop.Name.StartsWith('PS')) { continue }
      $state = 'enabled'
      if ($approved.ContainsKey($prop.Name)) { $state = $approved[$prop.Name] }
      $items += [pscustomobject]@{ Source = $rk[0]; Name = $prop.Name; State = $state; Command = [string]$prop.Value }
    }
  }
  foreach ($folder in @(@('Startup (user)', (Join-Path $P.A 'Microsoft\Windows\Start Menu\Programs\Startup')), @('Startup (all users)', (Join-Path $P.PD 'Microsoft\Windows\Start Menu\Programs\Startup')))) {
    if (-not (Test-DirPresent $folder[1])) { continue }
    foreach ($e in (Get-ChildEntries $folder[1])) {
      if ($e -is [IO.DirectoryInfo] -or $e.Name -eq 'desktop.ini') { continue }
      $state = 'enabled'
      if ($approved.ContainsKey($e.Name)) { $state = $approved[$e.Name] }
      $items += [pscustomobject]@{ Source = $folder[0]; Name = $e.Name; State = $state; Command = (Remove-LongPrefix $e.FullName) }
    }
  }
  try {
    foreach ($t in (Get-ScheduledTask -ErrorAction Stop)) {
      if (-not (@($t.Triggers) | Where-Object { $_.CimClass.CimClassName -eq 'MSFT_TaskLogonTrigger' })) { continue }
      $state = 'enabled'
      if ($t.State -eq 'Disabled') { $state = 'disabled' }
      $cmd = ''
      foreach ($a in @($t.Actions)) { if ($a.Execute) { $cmd = [string]$a.Execute } }
      $items += [pscustomobject]@{ Source = 'Scheduled task (logon)'; Name = $t.TaskName; State = $state; Command = $cmd }
    }
  } catch { $null = $_ }
  try {
    foreach ($c in (Get-CimInstance Win32_StartupCommand -ErrorAction Stop)) {
      if (@($items | Where-Object { $_.Name -eq $c.Name }).Count -gt 0) { continue }
      $state = 'enabled'
      if ($approved.ContainsKey([string]$c.Name)) { $state = $approved[[string]$c.Name] }
      $items += [pscustomobject]@{ Source = "WMI ($($c.Location))"; Name = [string]$c.Name; State = $state; Command = [string]$c.Command }
    }
  } catch { $null = $_ }
  return @($items | Sort-Object Source, Name)
}

function Get-Targets25 {
  <# .SYNOPSIS Informational only. Section 25 changes nothing: it never disables or removes a startup item. #>
  return @((New-Target 25 'Startup items (registry, folders, tasks)' 'Run keys + Startup folders + logon tasks' -Kind cmd -Note 'report only; change them yourself in Task Manager > Startup'))
}

function Invoke-Section25 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Everything that launches when you sign in or the machine boots: Run and RunOnce keys, both Startup',
    'folders, scheduled tasks with a logon trigger, and what Explorer records as enabled or disabled.',
    'This section only shows them - change them in Task Manager > Startup, where you can undo it.'
  )
  $items = @(Get-StartupItems)
  if ($items.Count -eq 0) { Write-Info 'no startup items found'; return }
  Write-UiLine ("  {0,-22} {1,-30} {2,-9} {3}" -f 'SOURCE', 'NAME', 'STATE', 'COMMAND') 'White'
  $lines = @("startup items - $(Get-Date -Format 'yyyy-MM-dd HH:mm')", '')
  foreach ($it in $items) {
    $color = 'Gray'
    if ($it.State -eq 'disabled') { $color = 'DarkGray' }
    $line = "  {0,-22} {1,-30} {2,-9} {3}" -f $it.Source, $it.Name, $it.State, $it.Command
    Write-UiLine $line $color
    $lines += $line.Trim()
  }
  $on = @($items | Where-Object { $_.State -eq 'enabled' }).Count
  Write-Info "$($items.Count) startup item(s), $on enabled"
  if (-not $ws.NoReport) {
    $out = Join-Path $ws.ReportsDir ('startup-items-' + $ws.Stamp + '.txt')
    try { [IO.File]::WriteAllLines($out, $lines); Write-Note "list saved: $out" } catch { $null = $_ }
  }
}
