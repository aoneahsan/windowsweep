# android_avd.ps1 - section 4: Android emulators (AVDs). Slow to recreate, so per-AVD idle gate and never in --all.

function Get-Targets04 {
  return @((New-Target 4 'Android AVDs (each .avd + .ini pair)' "$($Script:P.U)\.android\avd" -Mode units -Dev $true -Note "an AVD goes only when nothing inside it changed for $($Script:WS.Days)+ days"))
}

function Invoke-Section04 {
  $ws = $Script:WS
  $root = Join-Path $Script:P.U '.android\avd'
  Write-SectionIntro @(
    'An emulator image is 5-15 GB and takes minutes to recreate. Each AVD is one unit: it is removed only when',
    "every file inside it has been idle for $($ws.Days)+ days (booting an emulator updates its files)."
  ) -Dev $true
  if (-not (Test-DirPresent $root)) { Write-Info 'no AVDs found'; return }
  if (Test-ProcessRunning @('qemu-system-x86_64', 'emulator', 'emulator64-crash-service')) { Write-Warn 'an Android emulator is running - section skipped'; return }
  $avds = @()
  foreach ($e in (Get-ChildEntries $root)) {
    if (-not ($e -is [IO.DirectoryInfo]) -or $e.Name -notlike '*.avd') { continue }
    $full = Remove-LongPrefix $e.FullName
    $avds += [pscustomobject]@{ Name = $e.Name; Path = $full; Ini = (Join-Path $root ($e.Name -replace '\.avd$', '.ini')); Idle = (Get-IdleDays $full); Bytes = (Get-DirectoryBytes $full) }
  }
  if ($avds.Count -eq 0) { Write-Info 'no AVDs found'; return }
  Write-UiLine ("  {0,-36} {1,10} {2,8}" -f 'AVD', 'SIZE', 'IDLE') 'White'
  foreach ($a in $avds) { Write-UiLine ("  {0,-36} {1,10} {2,7}d" -f $a.Name, (Format-Bytes $a.Bytes), $a.Idle) 'Gray' }
  $avds = @($avds)
  $stale = @($avds | Where-Object { $_.Idle -ge $ws.Days -or $ws.PurgeAll })
  if ($stale.Count -eq 0) { Write-Info "every AVD was used within the last $($ws.Days) days - nothing to prune"; return }
  if (-not (Confirm-Section "Remove $($stale.Count) idle AVD(s)?" 'n')) { Write-Info 'skipped'; return }
  foreach ($a in $stale) {
    $r = Remove-PathSafe -Path $a.Path -Within $root -Label $a.Name
    if ($r.Removed) {
      if (Test-PathPresent $a.Ini) { $null = Remove-PathSafe -Path $a.Ini -Within $root -Label "$($a.Name) ini" }
      if (-not $ws.DryRun) { Write-Ok ("removed AVD $($a.Name) ($($a.Idle)d idle, " + (Format-Bytes $r.Bytes) + ')') }
    }
  }
}
