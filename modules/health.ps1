# health.ps1 - section 0: read-only system health report.

function Get-Targets00 { return @() }

function Get-HiberfilInfo {
  $p = Join-Path $Script:P.SD '\hiberfil.sys'
  $size = [long]0
  # Get-Item cannot open the hibernation file without elevation, but FileInfo reads its size from the directory entry.
  try { $f = New-Object IO.FileInfo($p); if ($f.Exists) { $size = [long]$f.Length } } catch { $size = 0 }
  $state = 'unknown'
  try {
    $a = (& powercfg.exe /a 2>$null) -join ' '
    if ($a -match 'Hibernate' -and $a -notmatch 'Hibernation has not been enabled') { $state = 'available' } else { $state = 'off' }
  } catch { $null = $_ }
  return [pscustomobject]@{ Path = $p; Bytes = $size; State = $state }
}

function Get-DiskImageFiles {
  <# .SYNOPSIS Docker Desktop / WSL virtual disks (they grow but never shrink on their own). #>
  $L = $Script:P.L
  $out = @()
  foreach ($root in @((Join-Path $L 'Docker\wsl'), (Join-Path $L 'Packages'))) {
    if (-not (Test-DirPresent $root)) { continue }
    try { $out += Get-ChildItem -LiteralPath $root -Recurse -Filter '*.vhdx' -File -Depth 4 -ErrorAction SilentlyContinue } catch { $null = $_ }
  }
  return $out
}

function Get-BlockingApps {
  <# .SYNOPSIS Running apps whose caches this tool skips while they run. #>
  $map = [ordered]@{ chrome = 'Chrome'; msedge = 'Edge'; brave = 'Brave'; firefox = 'Firefox'; vivaldi = 'Vivaldi'; opera = 'Opera'; Code = 'VS Code'; Cursor = 'Cursor'; Windsurf = 'Windsurf'; Discord = 'Discord'; slack = 'Slack'; 'ms-teams' = 'Teams'; Zoom = 'Zoom'; Spotify = 'Spotify'; Postman = 'Postman'; Figma = 'Figma'; Notion = 'Notion' }
  $out = @()
  foreach ($k in $map.Keys) { if (Test-ProcessRunning @($k)) { $out += $map[$k] } }
  return $out
}

function Invoke-Section00 {
  $ws = $Script:WS
  Write-SectionIntro @('Read-only snapshot of the machine: nothing is changed here.')
  try {
    $os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
    Write-Kv 'Windows:' "$($os.Caption) $($os.Version) (build $($os.BuildNumber))"
    $up = (Get-Date) - $os.LastBootUpTime
    Write-Kv 'Uptime:' ("{0}d {1}h {2}m" -f $up.Days, $up.Hours, $up.Minutes)
    Write-Kv 'RAM:' ("{0} total, {1} free" -f (Format-Bytes ($os.TotalVisibleMemorySize * 1KB)), (Format-Bytes ($os.FreePhysicalMemory * 1KB)))
  } catch { Write-Kv 'Windows:' $ws.OsCaption }
  Write-Kv 'PowerShell:' "$($PSVersionTable.PSVersion) ($($PSVersionTable.PSEdition))"
  $adm = 'no'
  if ($ws.IsAdmin) { $adm = 'yes' } elseif (Test-CanElevate) { $adm = 'no (your account can elevate: --elevate)' } else { $adm = 'no (standard user; admin sections need an administrator)' }
  Write-Kv 'Elevated:' $adm
  $dev = 'not decided yet'
  if ($null -ne $ws.Developer) { if ($ws.Developer) { $dev = "on ($($ws.DeveloperSource))" } else { $dev = "off ($($ws.DeveloperSource))" } }
  Write-Kv 'Developer mode:' $dev
  $hints = @(Get-ToolchainHints)
  if ($hints.Count -gt 0) { Write-Kv 'Dev tooling found:' ($hints -join ', ') }
  Write-UiLine '' 'Gray'
  Show-DriveTable
  try {
    $sys = New-Object IO.DriveInfo($Script:P.SD)
    $pct = 100.0 * $sys.AvailableFreeSpace / $sys.TotalSize
    if ($sys.AvailableFreeSpace -lt 10GB -or $pct -lt 10) { Write-Warn ("system drive has only {0} free ({1:N1}%) - Windows slows down badly below ~10%; this run should help" -f (Format-Bytes $sys.AvailableFreeSpace), $pct) }
  } catch { $null = $_ }
  Write-UiLine '' 'Gray'
  $h = Get-HiberfilInfo
  if ($h.Bytes -gt 0) { Write-Kv 'hiberfil.sys:' ("{0} (hibernation {1}) - section 15 can shrink or remove it (admin)" -f (Format-Bytes $h.Bytes), $h.State) } else { Write-Kv 'hiberfil.sys:' 'absent (hibernation off)' }
  try {
    foreach ($pf in (Get-CimInstance Win32_PageFileUsage -ErrorAction Stop)) { Write-Kv 'pagefile:' ("{0}  {1} allocated" -f $pf.Name, (Format-Bytes ($pf.AllocatedBaseSize * 1MB))) }
  } catch { $null = $_ }
  foreach ($img in (Get-DiskImageFiles)) { Write-Kv 'disk image:' ("{0}  {1} (section 20 compacts it, admin)" -f $img.FullName, (Format-Bytes $img.Length)) }
  if (Test-CommandPresent 'wsl.exe') {
    try {
      $raw = & wsl.exe --list --verbose 2>$null
      $txt = (($raw | ForEach-Object { [string]$_ }) -join "`n") -replace "`0", ''
      $lines = @($txt -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -and $_ -notmatch '^NAME' })
      if ($lines.Count -gt 0) { Write-Kv 'WSL distros:' (($lines | ForEach-Object { ($_ -replace '\s+', ' ') }) -join ' | ') }
    } catch { $null = $_ }
  }
  Write-UiLine '' 'Gray'
  try { $n = @(Get-CimInstance Win32_StartupCommand -ErrorAction Stop).Count; Write-Kv 'Startup items:' "$n (section 25 lists them all; change them in Task Manager > Startup - this tool never does)" } catch { $null = $_ }
  try {
    $ss = (Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\StorageSense\Parameters\StoragePolicy' -ErrorAction Stop).'01'
    $ssText = 'off'
    if ($ss -eq 1) { $ssText = 'on' }
    Write-Kv 'Storage Sense:' $ssText
  } catch { $null = $_ }
  try {
    $la = (& fsutil.exe behavior query disablelastaccess 2>$null) -join ' '
    if ($la -match '=\s*(\d)') {
      $v = [int]$Matches[1]
      $laText = 'disabled - idle age uses write/creation times (the safe reading)'
      if ($v -eq 1 -or $v -eq 3) { $laText = 'enabled - last-access times are reliable' }
      Write-Kv 'Last-access tracking:' $laText
    }
  } catch { $null = $_ }
  $blocking = @(Get-BlockingApps)
  if ($blocking.Count -gt 0) {
    Write-UiLine '' 'Gray'
    Write-Warn ("running now, their caches will be skipped until closed: " + ($blocking -join ', '))
  }
  Add-Freed 0
}
