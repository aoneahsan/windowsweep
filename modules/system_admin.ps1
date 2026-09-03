# system_admin.ps1 - sections 12-16: Windows Update cache, Disk Cleanup engine, DISM, hibernation file, event logs.
# Every section here needs Administrator rights; the runner skips them (with the --elevate hint) when not elevated.

function Get-Targets12 {
  $SR = $Script:P.SR; $PD = $Script:P.PD
  return @(
    (New-Target 12 'Windows Update download cache' "$SR\SoftwareDistribution\Download" -Mode clear -Note 'wuauserv and bits are stopped for the wipe and restarted')
    (New-Target 12 'Delivery Optimization cache' 'Delete-DeliveryOptimizationCache -Force' -Kind cmd)
    (New-Target 12 'Windows temp' "$SR\Temp" -Mode prune -Days $Script:WS.TempDays)
    (New-Target 12 'LocalService temp' "$SR\ServiceProfiles\LocalService\AppData\Local\Temp" -Mode prune -Days $Script:WS.TempDays)
    (New-Target 12 'NetworkService temp' "$SR\ServiceProfiles\NetworkService\AppData\Local\Temp" -Mode prune -Days $Script:WS.TempDays)
    (New-Target 12 'CBS servicing logs' "$SR\Logs\CBS" -Mode prune -Days 30 -Note 'the live CBS.log is open and skipped')
    (New-Target 12 'DISM logs' "$SR\Logs\DISM" -Mode prune -Days 30)
    (New-Target 12 'Windows Update logs' "$SR\Logs\WindowsUpdate" -Mode prune -Days 30)
    (New-Target 12 'Live kernel reports' "$SR\LiveKernelReports" -Mode clear-old -Days 7)
    (New-Target 12 'Windows Error Reporting queue (system)' "$PD\Microsoft\Windows\WER\ReportQueue" -Mode clear)
    (New-Target 12 'Windows Error Reporting archive (system)' "$PD\Microsoft\Windows\WER\ReportArchive" -Mode clear)
    (New-Target 12 'Windows Error Reporting temp (system)' "$PD\Microsoft\Windows\WER\Temp" -Mode clear)
  )
}

function Set-ServiceState {
  <# .SYNOPSIS Stop or start a service through the dry-run-aware wrapper. Returns $true when it was running before a stop. #>
  param([string] $Name, [string] $Action)
  $svc = Get-Service -Name $Name -ErrorAction SilentlyContinue
  if (-not $svc) { return $false }
  if ($Action -eq 'stop') {
    if ($svc.Status -ne 'Running') { return $false }
    if ($Script:WS.DryRun) { Write-DryRun "would stop service $Name"; return $true }
    try { Stop-Service -Name $Name -Force -ErrorAction Stop; Write-Note "stopped $Name" } catch { Write-Warn "could not stop $Name : $($_.Exception.Message)" }
    return $true
  }
  if ($Script:WS.DryRun) { Write-DryRun "would start service $Name"; return $true }
  try { Start-Service -Name $Name -ErrorAction Stop; Write-Note "started $Name" } catch { Write-Warn "could not start $Name : $($_.Exception.Message)" }
  return $true
}

function Invoke-Section12 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Windows Update keeps every downloaded package after installing it; Delivery Optimization keeps peer-share',
    'copies; C:\Windows\Temp and the servicing logs grow forever. All of it is rebuilt on demand.'
  )
  if (-not $ws.IsAdmin) { Write-Warn 'needs Administrator - skipped'; return }
  $targets = Get-Targets12
  $null = Show-TargetSizes $targets
  if (-not (Confirm-Section 'Clear Windows Update and system temp caches now?')) { Write-Info 'skipped'; return }
  $wuWasRunning = Set-ServiceState -Name 'wuauserv' -Action 'stop'
  $bitsWasRunning = Set-ServiceState -Name 'bits' -Action 'stop'
  try {
    $null = Invoke-TargetList $targets
  } finally {
    if ($wuWasRunning) { $null = Set-ServiceState -Name 'wuauserv' -Action 'start' }
    if ($bitsWasRunning) { $null = Set-ServiceState -Name 'bits' -Action 'start' }
  }
  if (Get-Command Delete-DeliveryOptimizationCache -ErrorAction SilentlyContinue) {
    if ($ws.DryRun) { Write-DryRun 'would run Delete-DeliveryOptimizationCache -Force' }
    else {
      try { Delete-DeliveryOptimizationCache -Force -ErrorAction Stop; Write-Ok 'Delivery Optimization cache cleared' } catch { Write-Warn "Delivery Optimization: $($_.Exception.Message)" }
    }
  }
}

# ---------------------------------------------------------------------------------------------
# Section 13 - Disk Cleanup engine (cleanmgr)
# ---------------------------------------------------------------------------------------------

# Handlers this tool enables. Deliberately absent: DownloadsFolder (your files), Recycle Bin (section 11 asks
# separately), User file versions (File History), Windows ESD installation files (needed for Reset this PC),
# Language Pack (removes installed languages).
$Script:WS_CLEANMGR_HANDLERS = @(
  'Active Setup Temp Folders', 'BranchCache', 'Content Indexer Cleaner', 'D3D Shader Cache', 'Delivery Optimization Files',
  'Device Driver Packages', 'Diagnostic Data Viewer database files', 'Downloaded Program Files', 'Internet Cache Files',
  'Offline Pages Files', 'Old ChkDsk Files', 'Previous Installations', 'RetailDemo Offline Content', 'Setup Log Files',
  'System error memory dump files', 'System error minidump files', 'Temporary Files', 'Temporary Setup Files',
  'Temporary Sync Files', 'Thumbnail Cache', 'Update Cleanup', 'Upgrade Discarded Files', 'Windows Defender',
  'Windows Error Reporting Files', 'Windows Upgrade Log Files'
)
$Script:WS_CLEANMGR_KEY = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches'
$Script:WS_CLEANMGR_FLAG = 'StateFlags0077'

function Get-Targets13 {
  return @((New-Target 13 'cleanmgr /sagerun:77 with curated handlers' ($Script:WS_CLEANMGR_HANDLERS -join ', ') -Kind cmd -Note 'never Downloads, Recycle Bin, File History, ESD files or language packs'))
}

function Invoke-Section13 {
  $ws = $Script:WS
  Write-SectionIntro @(
    "Windows' own Disk Cleanup engine, driven with a curated handler list: temporary files, Update Cleanup,",
    'thumbnail cache, memory dumps, setup and upgrade logs, previous Windows installations. It never touches',
    'your Downloads folder, the Recycle Bin, File History or the files Reset-this-PC needs.'
  )
  if (-not $ws.IsAdmin) { Write-Warn 'needs Administrator - skipped'; return }
  if (-not (Test-CommandPresent 'cleanmgr.exe')) { Write-Warn 'cleanmgr.exe not found on this edition of Windows - skipped'; return }
  $present = @()
  foreach ($h in $Script:WS_CLEANMGR_HANDLERS) { if (Test-Path -LiteralPath (Join-Path $Script:WS_CLEANMGR_KEY $h)) { $present += $h } }
  Write-Info "handlers available on this machine: $($present.Count) of $($Script:WS_CLEANMGR_HANDLERS.Count)"
  foreach ($h in $present) { Write-Note $h }
  if ($ws.DryRun) { Write-DryRun 'would run cleanmgr.exe /sagerun:77 with those handlers (cleanmgr cannot preview sizes)'; return }
  if (-not (Confirm-Section 'Run Disk Cleanup with these handlers now? (a progress window may appear; it can take several minutes)')) { Write-Info 'skipped'; return }
  $before = Get-SystemDriveFree
  try {
    foreach ($h in $present) { Set-ItemProperty -LiteralPath (Join-Path $Script:WS_CLEANMGR_KEY $h) -Name $Script:WS_CLEANMGR_FLAG -Value 2 -Type DWord -ErrorAction Stop }
    $r = Invoke-External -FilePath 'cleanmgr.exe' -ArgumentList @('/sagerun:77') -Destructive -Quiet -Label 'cleanmgr /sagerun:77'
    if ($r.ExitCode -ne 0) { Write-Warn "cleanmgr returned $($r.ExitCode)" }
  } catch {
    Write-Err "could not configure Disk Cleanup: $($_.Exception.Message)"
  } finally {
    foreach ($h in $present) { Remove-ItemProperty -LiteralPath (Join-Path $Script:WS_CLEANMGR_KEY $h) -Name $Script:WS_CLEANMGR_FLAG -ErrorAction SilentlyContinue }
  }
  $gain = [math]::Max([long]0, (Get-SystemDriveFree) - $before)
  Add-Freed $gain
  Write-Ok ("Disk Cleanup finished - system drive gained " + (Format-Bytes $gain))
}

# ---------------------------------------------------------------------------------------------
# Section 14 - DISM component store
# ---------------------------------------------------------------------------------------------

function Get-Targets14 {
  $note = 'superseded component versions in WinSxS'
  if ($Script:WS.ResetBase) { $note += '; --reset-base also removes the ability to uninstall installed updates' }
  return @((New-Target 14 'Dism /Online /Cleanup-Image /StartComponentCleanup' "$($Script:P.SR)\WinSxS" -Kind cmd -Note $note))
}

function Invoke-Section14 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'The component store (WinSxS) keeps superseded versions of Windows components. DISM removes the ones no',
    'installed update needs. It is slow (5-20 minutes) and safe; /ResetBase (opt-in) also drops the ability to',
    'uninstall currently installed updates.'
  )
  if (-not $ws.IsAdmin) { Write-Warn 'needs Administrator - skipped'; return }
  if (-not (Test-CommandPresent 'Dism.exe')) { Write-Warn 'Dism.exe not found - skipped'; return }
  Write-Info 'analyzing the component store (read-only, about a minute)...'
  $a = Invoke-External -FilePath 'Dism.exe' -ArgumentList @('/Online', '/Cleanup-Image', '/AnalyzeComponentStore') -Quiet -Label 'dism analyze'
  foreach ($l in $a.Output) { if ($l -match 'Size|Cleanup|Reclaimable|Date' ) { Write-Note ($l.Trim()) } }
  $dismArgs = @('/Online', '/Cleanup-Image', '/StartComponentCleanup')
  if ($ws.ResetBase) { $dismArgs += '/ResetBase'; Write-Warn '/ResetBase requested: installed updates can no longer be uninstalled afterwards' }
  if (-not (Confirm-Section 'Run the component store cleanup now?')) { Write-Info 'skipped'; return }
  $before = Get-SystemDriveFree
  $r = Invoke-External -FilePath 'Dism.exe' -ArgumentList $dismArgs -Destructive -Quiet -Label 'dism StartComponentCleanup'
  if ($r.Ran) {
    $gain = [math]::Max([long]0, (Get-SystemDriveFree) - $before)
    Add-Freed $gain
    if ($r.ExitCode -eq 0) { Write-Ok ("component store cleanup finished - system drive gained " + (Format-Bytes $gain)) } else { Write-Warn "DISM returned $($r.ExitCode) - see the log" }
  }
}

# ---------------------------------------------------------------------------------------------
# Section 15 - hibernation file
# ---------------------------------------------------------------------------------------------

function Get-Targets15 {
  return @((New-Target 15 'hiberfil.sys (powercfg /hibernate off | /type reduced)' (Join-Path $Script:P.SD '\hiberfil.sys') -Kind cmd -Note 'off frees the whole file; reduced keeps Fast Startup at roughly 40% of RAM'))
}

function Invoke-Section15 {
  $ws = $Script:WS
  $h = Get-HiberfilInfo
  Write-SectionIntro @(
    'hiberfil.sys holds a copy of RAM for Hibernate and Fast Startup, so it is about 40% of your RAM - permanently.',
    '  off      removes it. Sleep still works; Hibernate, Fast Startup and hibernate-on-critical-battery do not.',
    '  reduced  keeps Fast Startup only, at a smaller file (Windows decides the size, usually about half).',
    'Running speed is unaffected either way; this is purely disk space.'
  )
  if ($h.Bytes -gt 0) { Write-Kv 'hiberfil.sys now:' ("{0} (hibernation {1})" -f (Format-Bytes $h.Bytes), $h.State) } else { Write-Info 'hiberfil.sys is absent - hibernation is already off'; return }
  if (-not $ws.IsAdmin) { Write-Warn 'needs Administrator - skipped'; return }
  $choice = $ws.Hiberfil
  if (-not $choice) {
    if (-not $ws.Interactive) { Write-Warn 'pass --hiberfil off|reduced|keep to run this section unattended'; return }
    $choice = Read-Choice -Prompt '  [o] turn hibernation off   [r] reduced (keep Fast Startup)   [k] keep as is  > ' -Default 'k'
    switch ($choice) { 'o' { $choice = 'off' } 'r' { $choice = 'reduced' } default { $choice = 'keep' } }
  }
  if ($choice -eq 'keep') { Write-Info 'left unchanged'; return }
  $pcArgs = @('/hibernate', 'off')
  if ($choice -eq 'reduced') { $pcArgs = @('/hibernate', '/type', 'reduced') }
  if ($ws.DryRun) { Write-DryRun ("would run powercfg $($pcArgs -join ' ') (frees up to " + (Format-Bytes $h.Bytes) + ')'); Add-Freed $h.Bytes; return }
  if (-not (Confirm-Ui -Prompt "Run powercfg $($pcArgs -join ' ') now?" -Default 'n')) { Write-Info 'skipped'; return }
  $r = Invoke-External -FilePath 'powercfg.exe' -ArgumentList $pcArgs -Destructive -Quiet -Label "powercfg $($pcArgs -join ' ')"
  Start-Sleep -Seconds 2
  $after = Get-HiberfilInfo
  $gain = [math]::Max([long]0, $h.Bytes - $after.Bytes)
  Add-Freed $gain
  if ($r.ExitCode -eq 0) { Write-Ok ("hibernation set to '$choice' - hiberfil.sys " + (Format-Bytes $h.Bytes) + ' -> ' + (Format-Bytes $after.Bytes) + ' (freed ' + (Format-Bytes $gain) + ')') } else { Write-Warn "powercfg returned $($r.ExitCode)" }
}

# ---------------------------------------------------------------------------------------------
# Section 16 - event logs
# ---------------------------------------------------------------------------------------------

function Get-Targets16 {
  return @((New-Target 16 'Windows Event Logs (wevtutil cl for every log)' "$($Script:P.SR)\System32\winevt\Logs" -Kind cmd -Note 'PERMANENT - troubleshooting history is lost'))
}

function Invoke-Section16 {
  $ws = $Script:WS
  $logDir = Join-Path $Script:P.SR 'System32\winevt\Logs'
  Write-SectionIntro @(
    'Clears every Windows Event Log (Application, System, Security and the hundreds of per-component logs).',
    'This is permanent and removes the history a technician would use to diagnose a problem. Only do this on',
    'a machine that is behaving normally.'
  )
  if (-not $ws.IsAdmin) { Write-Warn 'needs Administrator - skipped'; return }
  $before = Get-DirectoryBytes $logDir
  Write-Kv 'event log store:' (Format-Bytes $before)
  if ($ws.DryRun) { Write-DryRun ("would clear every event log (about " + (Format-Bytes $before) + ')'); Add-Freed $before; return }
  if (-not (Confirm-Ui -Prompt 'Permanently clear ALL Windows Event Logs?' -Default 'n')) { Write-Info 'skipped'; return }
  $list = Invoke-External -FilePath 'wevtutil.exe' -ArgumentList @('el') -Quiet -Label 'wevtutil el'
  $ok = 0; $failed = 0
  foreach ($name in $list.Output) {
    $n = ([string]$name).Trim()
    if (-not $n) { continue }
    $r = Invoke-External -FilePath 'wevtutil.exe' -ArgumentList @('cl', $n) -Destructive -Quiet -Label "wevtutil cl $n"
    if ($r.ExitCode -eq 0) { $ok++ } else { $failed++ }
  }
  $gain = [math]::Max([long]0, $before - (Get-DirectoryBytes $logDir))
  Add-Freed $gain
  Write-Ok ("cleared $ok logs ($failed could not be cleared - analytic/debug channels), freed " + (Format-Bytes $gain))
}
