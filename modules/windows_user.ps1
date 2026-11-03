# windows_user.ps1 - section 9 (Windows user caches), section 10 (user temp), section 11 (Recycle Bin).

function Get-Targets09 {
  $P = $Script:P
  return @(
    (New-Target 9 'Internet cache (INetCache)' "$($P.L)\Microsoft\Windows\INetCache" -Mode clear -Note 'IE / legacy WebView cache')
    (New-Target 9 'Windows Error Reporting (user)' "$($P.L)\Microsoft\Windows\WER" -Mode clear)
    (New-Target 9 'Crash dumps' "$($P.L)\CrashDumps" -Mode clear-old -Days 7)
    (New-Target 9 'DirectX shader cache' "$($P.L)\D3DSCache" -Mode clear)
    (New-Target 9 'NVIDIA DirectX shader cache' "$($P.L)\NVIDIA\DXCache" -Mode clear)
    (New-Target 9 'NVIDIA OpenGL shader cache' "$($P.L)\NVIDIA\GLCache" -Mode clear)
    (New-Target 9 'NVIDIA NV_Cache' "$($P.L)\NVIDIA Corporation\NV_Cache" -Mode clear)
    (New-Target 9 'AMD DirectX shader cache' "$($P.L)\AMD\DxCache" -Mode clear)
    (New-Target 9 'AMD OpenGL shader cache' "$($P.L)\AMD\GLCache" -Mode clear)
    (New-Target 9 'Intel shader cache' "$($P.L)\Intel\ShaderCache" -Mode clear)
    (New-Target 9 'Remote Desktop bitmap cache' "$($P.L)\Microsoft\Terminal Server Client\Cache" -Mode clear)
    (New-Target 9 'OneDrive logs' "$($P.L)\Microsoft\OneDrive\logs" -Mode clear-old -Days 7)
    (New-Target 9 'OneDrive setup logs' "$($P.L)\Microsoft\OneDrive\setup\logs" -Mode clear-old -Days 7)
    (New-Target 9 'Store apps TempState' "$($P.L)\Packages\*\TempState" -Kind glob -Mode clear)
    (New-Target 9 'Store apps AC\Temp' "$($P.L)\Packages\*\AC\Temp" -Kind glob -Mode clear)
    (New-Target 9 'Store apps AC\INetCache' "$($P.L)\Packages\*\AC\INetCache" -Kind glob -Mode clear)
    (New-Target 9 'Themes cached files' "$($P.L)\Microsoft\Windows\Themes\CachedFiles" -Mode clear)
    (New-Target 9 'PowerShell startup profile data' "$($P.L)\Microsoft\Windows\PowerShell\StartupProfileData-*" -Kind fileglob -Mode file)
    (New-Target 9 'CLR usage logs' "$($P.L)\Microsoft\CLR_v4.0\UsageLogs" -Mode clear)
    (New-Target 9 'CLR usage logs (32-bit)' "$($P.L)\Microsoft\CLR_v4.0_32\UsageLogs" -Mode clear)
    (New-Target 9 'Explorer thumbcache leftovers' "$($P.L)\Microsoft\Windows\Explorer\ThumbCacheToDelete" -Mode clear)
    (New-Target 9 'Explorer iconcache leftovers' "$($P.L)\Microsoft\Windows\Explorer\IconCacheToDelete" -Mode clear)
    (New-Target 9 'Explorer startup logs' "$($P.L)\Microsoft\Windows\Explorer\ExplorerStartupLog*.etl" -Kind fileglob -Mode file)
    (New-Target 9 'Windows schema cache' "$($P.L)\Microsoft\Windows\SchCache" -Mode clear)
    (New-Target 9 'Delivery Optimization (per user)' "$($P.L)\Microsoft\Windows\DeliveryOptimization\Cache" -Mode clear)
    (New-Target 9 'Certificate URL cache' "$($P.LL)\Microsoft\CryptnetUrlCache" -Mode clear)
    (New-Target 9 'Diagnostics results' "$($P.L)\Diagnostics" -Mode clear-old -Days 30)
    (New-Target 9 'DNS resolver cache' 'ipconfig /flushdns' -Kind cmd)
    (New-Target 9 'Microsoft Store download cache' 'wsreset.exe' -Kind cmd -Note 'printed as a next step, never run for you: wsreset has no silent mode and always opens the Store')
  )
}

function Invoke-Section09 {
  Write-SectionIntro @(
    'Caches Windows and its drivers rebuild silently: shader caches, error-report queues, crash dumps, Store-app',
    'temp folders, Remote Desktop bitmaps. Files an app is holding open are skipped. The Explorer thumbnail and',
    'icon databases themselves belong to Disk Cleanup (section 13, admin), which rebuilds them cleanly.'
  )
  $targets = Get-Targets09
  $null = Show-TargetSizes $targets
  if (-not (Confirm-Section 'Clear Windows user caches now?')) { Write-Info 'skipped'; return }
  $null = Invoke-TargetList $targets
  $r = Invoke-External -FilePath 'ipconfig.exe' -ArgumentList @('/flushdns') -Destructive -Quiet -Label 'ipconfig /flushdns'
  if ($r.Ran -and $r.ExitCode -eq 0) { Write-Ok 'DNS resolver cache flushed' }
  # wsreset is the only lever for the Store download cache, and it has no silent switch: every build opens
  # the Store window when it finishes. A cleanup run must not pop a window, so it is offered, never executed.
  if (Test-PathPresent (Join-Path $Script:P.SR 'System32\wsreset.exe')) {
    $Script:WS.Hints += 'Microsoft Store cache: run  wsreset.exe  yourself when you want it cleared (it opens the Store when it finishes)'
  }
}

# ---------------------------------------------------------------------------------------------
# Section 10 - user temp
# ---------------------------------------------------------------------------------------------

function Get-TempRoots {
  $P = $Script:P
  $roots = @()
  foreach ($r in @($P.TEMP, $P.TMP, (Join-Path $P.L 'Temp'), (Join-Path $P.LL 'Temp'))) {
    if ($r -and (Test-DirPresent $r)) { $f = Get-FullPath $r; if ($roots -notcontains $f) { $roots += $f } }
  }
  return $roots
}

function Get-DeclaredTempRoots {
  <# .SYNOPSIS 1.4.0: --temp-roots / tempRoots - folders a person uses as scratch space (C:\t on the P52, where
     test runs left one browser profile per run). Existing ones, once each, never a Windows temp root twice. #>
  $known = @(Get-TempRoots)
  $out = @()
  foreach ($r in @($Script:WS.TempRoots)) {
    if (-not $r -or -not (Test-DirPresent $r)) { continue }
    $f = Get-FullPath $r
    if ($known -notcontains $f -and $out -notcontains $f) { $out += $f }
  }
  return $out
}

function Get-TempRootPlan {
  <# .SYNOPSIS Pure over its inputs: the top-level entries of a declared temp root that go whole - nothing inside
     written for -Days or more (the caller measures write/creation time only), and not named in any running
     program's command line (a test browser using one as its profile). #>
  param([object[]] $Entries, [int] $Days, [string[]] $BusyText)
  $out = @()
  foreach ($e in @($Entries)) {
    if ($e.Idle -lt $Days) { continue }
    $named = $false
    foreach ($b in @($BusyText)) { if ($b -and $b.IndexOf($e.Path, [StringComparison]::OrdinalIgnoreCase) -ge 0) { $named = $true; break } }
    if (-not $named) { $out += $e }
  }
  return $out
}

function Get-Targets10 {
  $t = @()
  foreach ($r in (Get-TempRoots)) { $t += (New-Target 10 'User temp' $r -Mode prune -Days $Script:WS.TempDays -Note "files idle $($Script:WS.TempDays)+ days; open files are skipped") }
  foreach ($r in (Get-DeclaredTempRoots)) { $t += (New-Target 10 "Declared temp root ($r)" $r -Mode clear-old -Days $Script:WS.TempDays -Note "each entry idle $($Script:WS.TempDays)+ days goes whole; one a running program names is kept") }
  return $t
}

function Invoke-Section10 {
  $ws = $Script:WS
  Write-SectionIntro @(
    "Temporary files idle for $($ws.TempDays)+ days. Files a running program still has open are skipped, so an",
    'installer or build that is in progress right now is safe. Lower the window with --temp-days 1 for a harder sweep.'
  )
  $targets = @(Get-Targets10 | Where-Object { $_.Mode -ne 'clear-old' })
  $declared = @(Get-DeclaredTempRoots)
  if ($targets.Count -eq 0 -and $declared.Count -eq 0) { Write-Info 'no temp folders found'; return }
  $null = Show-TargetSizes $targets
  $busy = @()
  if ($declared.Count -gt 0) { try { $busy = @(Get-CimInstance Win32_Process -Property CommandLine -ErrorAction Stop | ForEach-Object { [string]$_.CommandLine } | Where-Object { $_ }) } catch { $busy = @() } }
  $plans = @()
  foreach ($root in $declared) {
    $entries = @(Get-ChildEntries $root | Where-Object { -not (Test-ReparsePoint $_) } | ForEach-Object { $full = Remove-LongPrefix $_.FullName; [pscustomobject]@{ Path = $full; Idle = (Get-IdleDays $full -WriteOnly) } })
    $go = @(Get-TempRootPlan -Entries $entries -Days $ws.TempDays -BusyText $busy)
    Write-UiLine ("  {0}: {1} of {2} entries idle {3}+ days and not in use" -f $root, $go.Count, $entries.Count, $ws.TempDays) 'Gray'
    $plans += [pscustomobject]@{ Root = $root; Go = $go }
  }
  if (-not (Confirm-Section "Remove temp files idle $($ws.TempDays)+ days?")) { Write-Info 'skipped'; return }
  $null = Invoke-TargetList $targets
  foreach ($pl in $plans) {
    $freed = [long]0; $n = 0
    foreach ($e in $pl.Go) { $r = Remove-PathSafe -Path $e.Path -Within $pl.Root -Label 'declared temp root'; if ($r.Removed) { $freed += $r.Bytes; $n++ } }
    if (-not $ws.DryRun -and $n -gt 0) { Write-Ok ("{0} - {1} entries removed ({2})" -f $pl.Root, $n, (Format-Bytes $freed)) }
  }
}

# ---------------------------------------------------------------------------------------------
# Section 11 - Recycle Bin
# ---------------------------------------------------------------------------------------------

function Get-Targets11 { return @((New-Target 11 'Recycle Bin (all drives)' 'Clear-RecycleBin' -Kind cmd -Note 'PERMANENT - everything in the bin is gone')) }

function Get-RecycleBinStats {
  $items = 0; $bytes = [long]0
  try {
    $shell = New-Object -ComObject Shell.Application
    $bin = $shell.NameSpace(0xA)
    foreach ($i in $bin.Items()) { $items++; try { $bytes += [long]$i.Size } catch { $null = $_ } }
  } catch { $null = $_ }
  return [pscustomobject]@{ Items = $items; Bytes = $bytes }
}

function Invoke-Section11 {
  $ws = $Script:WS
  Write-SectionIntro @('Emptying the Recycle Bin is permanent: nothing in it can be restored afterwards.')
  $s = Get-RecycleBinStats
  Write-Kv 'Recycle Bin:' ("{0} item(s), {1}" -f $s.Items, (Format-Bytes $s.Bytes))
  if ($s.Items -eq 0) { Write-Info 'already empty'; return }
  if ($ws.DryRun) { Write-DryRun ("would empty the Recycle Bin (" + (Format-Bytes $s.Bytes) + ')'); Add-Freed $s.Bytes; return }
  if (-not (Confirm-Ui -Prompt "Permanently delete all $($s.Items) item(s) in the Recycle Bin?" -Default 'n')) { Write-Info 'skipped'; return }
  try {
    Clear-RecycleBin -Force -ErrorAction Stop
    Add-Freed $s.Bytes
    Write-Ok ("Recycle Bin emptied (" + (Format-Bytes $s.Bytes) + ')')
  } catch { Write-Err "could not empty the Recycle Bin: $($_.Exception.Message)" }
}
