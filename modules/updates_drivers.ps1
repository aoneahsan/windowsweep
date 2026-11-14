# updates_drivers.ps1 - section 31: driver updates you pick from Windows Update, the devices Windows reports a
# problem with, the oldest third-party drivers, old copies in the driver store, and the PC maker's own driver tool
# named but never run. Never BIOS or firmware, from any source (owner, 2026-11-13). On the P52 (2026-11-14) Lenovo
# System Update's command line queued an IR-camera firmware package past its driver-only switch, so 1.5.0 never
# starts a maker's tool. Every install and removal needs an elevated run; nothing here restarts Windows. The
# Windows Update search, row and install helpers live in updates_windows.ps1. ASCII only.

# Device Manager's problem codes, in plain words (CM_PROB_*). Code 45 (not connected) is counted, never listed.
$Script:WS_DEVICE_PROBLEMS = @{
  1 = 'not configured correctly'; 3 = 'its driver may be damaged, or Windows is low on memory'; 10 = 'cannot start'
  12 = 'cannot find enough free resources'; 14 = 'works only after a restart'; 18 = 'its drivers need reinstalling'
  19 = 'its registry configuration is incomplete or damaged'; 21 = 'Windows is removing it'; 22 = 'disabled'
  24 = 'not present, not working, or missing a driver'; 28 = 'no driver installed'; 31 = 'Windows cannot load the drivers it needs'
  32 = 'its driver service is disabled'; 37 = 'its driver failed to initialize'; 39 = 'its driver is missing or damaged'
  43 = 'Windows stopped it after it reported problems'
}


function Test-DriverUpdateOffered {
  <# .SYNOPSIS False for anything that would flash BIOS, UEFI or firmware: DriverClass Firmware, or a title naming
     BIOS, UEFI or firmware. Such an update is never listed, so it can never be picked. Pure. #>
  param([object] $Update)
  if ([string]$Update.DriverClass -match '(?i)firmware') { return $false }
  if ([string]$Update.Title -match '(?i)\bBIOS\b|\bUEFI\b|firmware') { return $false }
  return $true
}

function Get-DeviceProblemText {
  <# .SYNOPSIS Device Manager's problem code as words; the bare number for a code not in the map. Pure. #>
  param([int] $Code)
  if ($Script:WS_DEVICE_PROBLEMS.ContainsKey($Code)) { return $Script:WS_DEVICE_PROBLEMS[$Code] }
  return "problem code $Code"
}

function Select-OldThirdPartyDrivers {
  <# .SYNOPSIS Drivers whose provider is not Microsoft, dated more than -Years before -Now: oldest first, one row per
     device name, provider and version, at most -Top. A date before 1990 is a placeholder, not an age (Intel gives
     its INF-only chipset files 1968-07-18 on purpose): those are counted in Placeholder and never listed. Pure. #>
  param([object[]] $Drivers, [datetime] $Now, [int] $Years = 3, [int] $Top = 15)
  $cut = $Now.AddYears(-$Years)
  $placeholder = 0
  $seen = @{}
  $rows = @()
  foreach ($d in $Drivers) {
    $prov = [string]$d.DriverProviderName
    if (-not $prov -or $prov -match '^Microsoft' -or $d.DriverDate -isnot [datetime]) { continue }
    $date = [datetime]$d.DriverDate
    if ($date -ge $cut) { continue }
    if ($date.Year -lt 1990) { $placeholder++; continue }
    $key = "$($d.DeviceName)|$prov|$($d.DriverVersion)"
    if ($seen.ContainsKey($key)) { $seen[$key].Devices++; continue }
    $row = [pscustomobject]@{ Device = [string]$d.DeviceName; Provider = $prov; Version = [string]$d.DriverVersion; Date = $date; Devices = 1 }
    $seen[$key] = $row
    $rows += $row
  }
  return [pscustomobject]@{ Rows = @($rows | Sort-Object Date | Select-Object -First $Top); Total = $rows.Count; Placeholder = $placeholder }
}

function Find-LenovoSystemUpdate {
  <# .SYNOPSIS Path of Lenovo System Update's program (tvsu.exe), or '' when it is not installed. #>
  foreach ($dir in @(${env:ProgramFiles(x86)}, $env:ProgramFiles)) {
    if (-not $dir) { continue }
    $exe = Join-Path $dir 'Lenovo\System Update\tvsu.exe'
    if (Test-PathPresent $exe) { return $exe }
  }
  return ''
}

function Get-PcMaker {
  <# .SYNOPSIS The manufacturer Windows reports for this PC (Win32_ComputerSystem), or '' when unreadable. #>
  try { return ([string](Get-CimInstance Win32_ComputerSystem -ErrorAction Stop).Manufacturer).Trim() } catch { return '' }
}

function Get-DriverReport {
  <# .SYNOPSIS Section 31's two report lists for --json callers (driver_report), created on first use. #>
  if ($null -eq $Script:WS.DriverReport) { $Script:WS.DriverReport = [ordered]@{ problems = @(); oldest = @() } }
  return $Script:WS.DriverReport
}

function Show-ProblemDevices {
  <# .SYNOPSIS Report only: the devices Device Manager would flag, with the problem in words. #>
  Write-Section 'Devices Windows reports a problem with (report only)'
  $devs = $null
  try { $devs = @(Get-CimInstance Win32_PnPEntity -Filter 'ConfigManagerErrorCode <> 0' -ErrorAction Stop) } catch { Write-Warn 'the device list could not be read'; return }
  $away = @($devs | Where-Object { [int]$_.ConfigManagerErrorCode -eq 45 }).Count
  $rest = @($devs | Where-Object { [int]$_.ConfigManagerErrorCode -ne 45 })
  Write-LogLine "problem devices: $($rest.Count) listed, $away not connected (code 45)"
  if ($rest.Count -eq 0) { Write-Ok 'no connected device reports a problem' }
  $report = Get-DriverReport
  # The device name goes last, uncut: two devices of one family often differ only at the end of the name.
  foreach ($d in $rest) {
    $name = [string]$d.Name
    if (-not $name) { $name = [string]$d.DeviceID }
    $code = [int]$d.ConfigManagerErrorCode
    Write-UiLine ("  code {0,-3} {1,-52} {2}" -f $code, (Get-DeviceProblemText $code), $name) 'Yellow'
    $report.problems += [ordered]@{ name = $name; code = $code; problem = (Get-DeviceProblemText $code) }
  }
  if ($away -gt 0) { Write-Note "$away device(s) Windows remembers are not connected now (code 45); that is normal for anything unplugged" }
}

function Show-OldDrivers {
  <# .SYNOPSIS Report only: the oldest third-party drivers in use. #>
  Write-Section 'Oldest third-party drivers (report only)'
  $all = $null
  try { $all = @(Get-CimInstance Win32_PnPSignedDriver -ErrorAction Stop) } catch { Write-Warn 'the driver list could not be read'; return }
  $old = Select-OldThirdPartyDrivers -Drivers $all -Now (Get-Date)
  Write-LogLine "old third-party drivers: $($old.Total) older than 3 years, $($old.Placeholder) with a placeholder date"
  if ($old.Total -eq 0) { Write-Ok 'no third-party driver here is older than 3 years' }
  else {
    Write-Note 'Old is not wrong: a driver that works can stay as it is. This list is where to look when a device misbehaves.'
    # Oldest first, so the date leads; the device name goes last, uncut (a family of devices differs at the end).
    Write-UiLine ("  {0,-10}  {1,-20} {2,-16} {3}" -f 'DATE', 'PROVIDER', 'VERSION', 'DEVICE') 'White'
    $report = Get-DriverReport
    foreach ($r in $old.Rows) {
      $dev = $r.Device
      if ($r.Devices -gt 1) { $dev = "$dev ($($r.Devices) devices)" }
      Write-UiLine ("  {0,-10}  {1,-20} {2,-16} {3}" -f $r.Date.ToString('yyyy-MM-dd'), (Format-CellText $r.Provider 20), (Format-CellText $r.Version 16), $dev) 'Gray'
      $report.oldest += [ordered]@{ device = $dev; provider = [string]$r.Provider; version = [string]$r.Version; date = $r.Date.ToString('yyyy-MM-dd') }
    }
    if ($old.Total -gt $old.Rows.Count) { Write-Note "the $($old.Rows.Count) oldest of $($old.Total) are shown" }
  }
  if ($old.Placeholder -gt 0) { Write-Note "$($old.Placeholder) device(s) carry a placeholder driver date before 1990 and are not listed (Intel gives its INF-only chipset files 1968-07-18 on purpose)" }
}

function Get-WuDriverOffers {
  <# .SYNOPSIS The driver updates Windows Update has for this PC, BIOS and firmware held back. Optional (BrowseOnly)
     drivers are included and marked: here every row is picked by a person anyway. #>
  Write-Section 'Driver updates from Windows Update'
  Write-Info 'asking Windows Update for drivers (it contacts its update server; this can take a minute)'
  $found = Find-WindowsUpdates -Type 'Driver'
  if ($found.Error) { Write-Warn "Windows Update could not search for drivers: $($found.Error)"; return @() }
  $rows = @(); $held = 0
  foreach ($u in $found.Updates) {
    if (-not (Test-DriverUpdateOffered $u)) { $held++; Write-LogLine "held back (BIOS or firmware): $($u.Title)"; continue }
    $r = ConvertTo-UpdateRow -Update $u -IncludeBrowseOnly
    $note = ''
    if ($r.Optional) { $note = 'optional' }
    $line = "{0,-52} {1,-12} {2,-10} {3}" -f (Format-CellText $r.Title 52), (Format-CellText $r.DriverClass 12), $r.DriverDate, $note
    $rows += [pscustomobject]@{ Kind = 'driver-update'; Path = $r.Path; Label = $r.Title; Bytes = $r.Bytes; Line = $line; Row = $r; Session = $found.Session
      Extra = [ordered]@{ kind = 'driver-update'; driver_class = $r.DriverClass; driver_provider = $r.DriverProvider; driver_date = $r.DriverDate; optional = $r.Optional; needs_admin = $true } }
  }
  if ($held -gt 0) { Write-Note "$held BIOS or firmware update(s) held back: windowsweep never offers BIOS or firmware" }
  if ($rows.Count -eq 0) { Write-Ok 'Windows Update has no driver to offer for this PC' }
  else { Write-UiLine ("  {0,3}  {1,9}  {2,-52} {3,-12} {4,-10} {5}" -f '#', 'SIZE', 'DRIVER', 'CLASS', 'DATE', '') 'White' }
  return $rows
}

function Get-MakerUpdaterNote {
  <# .SYNOPSIS Pure: what section 31 says about the PC maker's own driver tool. windowsweep only names it: on the
     P52 (2026-11-14) Lenovo System Update's command line queued an IR-camera firmware package past its driver-only
     switch, and a package it started waited 13 hours behind a prompt nobody could see. #>
  param([string] $Maker, [bool] $LenovoInstalled)
  $rule = 'leave anything marked BIOS or firmware unticked'
  if ($Maker -match '^Lenovo') {
    if ($LenovoInstalled) { return "Lenovo System Update is installed, and windowsweep does not run it: on a ThinkPad its command line queued firmware past a driver-only switch. Open it from the Start menu and $rule." }
    return "Lenovo's own driver tool is Lenovo System Update (winget install --id Lenovo.SystemUpdate --exact). windowsweep does not run it; in it, $rule."
  }
  if ($Maker -match '^Dell') { return "Dell's own driver tool is Dell Command | Update (winget Dell.CommandUpdate). windowsweep does not run it; in it, $rule." }
  if ($Maker -match '^(HP|Hewlett)') { return "HP's own driver tool is HP Image Assistant (winget HP.ImageAssistant). windowsweep does not run it; in it, $rule." }
  if ($Maker) { return "windowsweep knows no driver tool from $Maker; the Windows Update drivers above are the ones it offers." }
  return 'the PC maker could not be read'
}

function Show-MakerUpdater {
  <# .SYNOPSIS Report only: the PC maker's own driver tool, named and never run. #>
  Write-Section "Your PC maker's own driver tool (report only)"
  $maker = Get-PcMaker
  Write-LogLine "PC maker: $maker"
  Write-Note (Get-MakerUpdaterNote -Maker $maker -LenovoInstalled ([bool](Find-LenovoSystemUpdate)))
}

function ConvertTo-VersionOrZero {
  <# .SYNOPSIS A driver version string as [version]; 0.0 when it does not parse, so it sorts as the oldest. Pure. #>
  param([string] $Text)
  $v = $null
  if ([version]::TryParse(([string]$Text).Trim(), [ref]$v)) { return $v }
  return [version]'0.0'
}

function Select-SupersededDriverPackages {
  <# .SYNOPSIS Old copies in the driver store that only take space. Third-party packages (oemNN.inf) are grouped by
     INF file name, provider and class and ordered newest first by [version], then date; the newest -Keep (two) of
     each group stay - the one in use and the one Device Manager's Roll Back returns to - and the rest are returned.
     Inbox and boot-critical packages are never returned and never take a kept place. Pure. #>
  param([object[]] $Packages, [int] $Keep = 2)
  $groups = @{}
  foreach ($p in $Packages) {
    if ($null -eq $p -or [bool]$p.Inbox -or [bool]$p.BootCritical -or [string]$p.Driver -notmatch '^oem\d+\.inf$') { continue }
    $key = ('{0}|{1}|{2}' -f [IO.Path]::GetFileName([string]$p.OriginalFileName), $p.ProviderName, $p.ClassName).ToLowerInvariant()
    if (-not $groups.ContainsKey($key)) { $groups[$key] = @() }
    $groups[$key] += $p
  }
  $out = @()
  foreach ($key in @($groups.Keys | Sort-Object)) {
    $sorted = @($groups[$key] | Sort-Object -Property @{ Expression = { ConvertTo-VersionOrZero $_.Version }; Descending = $true }, @{ Expression = { $_.Date }; Descending = $true })
    if ($sorted.Count -gt $Keep) { $out += @($sorted | Select-Object -Skip $Keep) }
  }
  return $out
}

function Get-DriverStoreOffers {
  <# .SYNOPSIS Old driver packages as rows, each sized by its FileRepository folder. Reading the driver store needs an
     elevated run; without one a note says so and nothing is offered. #>
  Write-Section 'Old driver packages in the driver store'
  if (-not $Script:WS.IsAdmin) {
    Write-Note 'only an elevated run can read the driver store, so old packages are listed there:  windowsweep --only 31 --elevate'
    return @()
  }
  # DISM draws a progress bar; this function's scope (and only it) goes without one.
  $ProgressPreference = 'SilentlyContinue'
  $pkgs = $null
  try { $pkgs = @(Get-WindowsDriver -Online -All -ErrorAction Stop) } catch { Write-Warn "the driver store could not be read: $($_.Exception.Message)"; return @() }
  $old = @(Select-SupersededDriverPackages -Packages $pkgs)
  Write-LogLine "driver store: $($pkgs.Count) package(s), $($old.Count) superseded"
  if ($old.Count -eq 0) { Write-Ok 'no driver has more than two copies in the store'; return @() }
  Write-UiLine ("  {0,3}  {1,9}  {2,-12} {3,-22} {4,-14} {5,-18} {6}" -f '#', 'SIZE', 'PACKAGE', 'PROVIDER', 'CLASS', 'VERSION', 'DATE') 'White'
  $rows = @()
  foreach ($p in $old) {
    $folder = Split-Path -Parent ([string]$p.OriginalFileName)
    $bytes = [long]0
    if ($folder) { $bytes = [long](Get-DirectoryStats $folder).Bytes }
    $date = ''
    if ($p.Date -is [datetime]) { $date = $p.Date.ToString('yyyy-MM-dd') }
    $line = "{0,-12} {1,-22} {2,-14} {3,-18} {4}" -f $p.Driver, (Format-CellText $p.ProviderName 22), (Format-CellText $p.ClassName 14), (Format-CellText $p.Version 18), $date
    $label = "{0} {1} {2} ({3})" -f $p.ProviderName, $p.ClassName, $p.Version, $p.Driver
    $rows += [pscustomobject]@{ Kind = 'driver-package'; Path = "oem:$($p.Driver)"; Label = $label; Bytes = $bytes; Line = $line; Inf = [string]$p.Driver
      Extra = [ordered]@{ kind = 'driver-package'; provider = [string]$p.ProviderName; class = [string]$p.ClassName; version = [string]$p.Version; date = $date; needs_admin = $true } }
  }
  return $rows
}

function Remove-DriverPackage {
  <# .SYNOPSIS Remove one old package with Windows' own pnputil, never with /force: Windows keeps a package a device
     still uses, and that is reported as kept, not as an error. Returns removed | kept | dry-run. #>
  param([pscustomobject] $Offer)
  if ($Script:WS.DryRun) {
    Write-DryRun ("would remove {0}: pnputil /delete-driver {1}" -f $Offer.Label, $Offer.Inf)
    Add-Freed $Offer.Bytes
    return 'dry-run'
  }
  Write-LogLine "run: pnputil.exe /delete-driver $($Offer.Inf)"
  $out = @(& pnputil.exe /delete-driver $Offer.Inf 2>&1)
  $code = $LASTEXITCODE
  foreach ($l in $out) { if ([string]$l) { Write-LogLine "  $l" } }
  Write-LogLine "pnputil exit $code : $($Offer.Inf)"
  if ($code -eq 0) {
    Add-Freed $Offer.Bytes
    Write-Ok ("{0} removed ({1})" -f $Offer.Label, (Format-Bytes $Offer.Bytes))
    return 'removed'
  }
  Write-Note ("{0} kept: a device still uses it, so Windows did not remove it (pnputil exit {1})" -f $Offer.Inf, $code)
  return 'kept'
}

function Get-Targets31 {
  return @(
    (New-Target 31 'Driver updates (Windows Update)' 'Windows Update Agent (COM)' -Kind cmd -Note 'you pick; BIOS and firmware are never offered; elevated run; never restarts'),
    (New-Target 31 "PC maker's own driver tool" 'Lenovo System Update, Dell Command | Update, HP Image Assistant' -Kind cmd -Note 'named only, never run (it can queue BIOS or firmware); report only'),
    (New-Target 31 'Old driver packages' 'driver store (pnputil /delete-driver, no /force)' -Kind cmd -Note 'the two newest copies of each driver stay; inbox and boot-critical packages are never offered')
  )
}

function Invoke-Section31 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Driver updates are offered from Windows Update; BIOS and firmware are never offered. Your PC maker''s own',
    'driver tool is named, never run. Devices with a problem and the oldest third-party drivers are listed for',
    'reading only. Old copies of a driver in the driver store are offered too; the two newest copies of each always',
    'stay. Installing and removing need an elevated run, and nothing here restarts your PC.'
  )
  Show-ProblemDevices
  Show-OldDrivers
  Show-MakerUpdater
  # One numbered list across both kinds of offer, so one selection (and one --select-file) answers them all.
  # Each group prints its heading and notes, then its rows, before the next group is asked.
  $offers = @()
  $i = 1
  foreach ($fn in 'Get-WuDriverOffers', 'Get-DriverStoreOffers') {
    foreach ($o in @(& $fn)) {
      $size = '-'
      if ($o.Bytes -gt 0) { $size = Format-Bytes $o.Bytes }
      Write-UiLine ("  {0,3}  {1,9}  {2}" -f $i, $size, $o.Line) 'Gray'
      Add-JsonCandidate -Section 31 -Index $i -Path $o.Path -Bytes $o.Bytes -IdleDays -1 -Label $o.Label -Extra $o.Extra
      $offers += $o
      $i++
    }
  }
  if ($offers.Count -eq 0) { Write-Info 'nothing to install or remove here'; return }
  if (-not $ws.DryRun -and -not $ws.IsAdmin) {
    Write-Warn 'installing drivers and removing driver packages need Administrator rights - nothing was changed'
    Write-Note 'run it elevated:  windowsweep --only 31 --elevate'
    $ws.Hints += 'Install drivers or remove old driver packages from an elevated run:  windowsweep --only 31 --elevate'
    return
  }
  $picks = @(Read-MultiSelect -Total $offers.Count -NoAutoYes -Candidates @($offers | ForEach-Object { $_.Path }))
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  Write-LogLine ('section 31 picks: ' + (($picks | ForEach-Object { $offers[$_ - 1].Path }) -join ', '))
  if (-not $ws.DryRun) {
    if (-not (Confirm-Ui -Prompt "Install or remove $($picks.Count) driver item(s), one at a time?" -Default 'n' -NoAutoYes -ScriptedOk)) { Write-Info 'skipped'; return }
  }
  $restart = $false
  foreach ($k in $picks) {
    $o = $offers[$k - 1]
    if ($o.Kind -eq 'driver-package') { $null = Remove-DriverPackage -Offer $o }
    elseif ($ws.DryRun) { Write-DryRun "would download and install through Windows Update: $($o.Label)" }
    else {
      Write-Info "installing $($o.Label) - Windows Update sets the pace"
      $res = Install-WindowsUpdateOne -Session $o.Session -Row $o.Row
      Write-WuInstallResult -Row $o.Row -Result $res
      if ($res.Reboot) { $restart = $true }
    }
  }
  if ($ws.DryRun) { Write-Note 'nothing was installed or removed'; return }
  if ($restart) { Add-RestartHint }
}
