# updates_windows.ps1 - section 30: Windows updates you pick, each one downloaded and installed by Windows Update
# itself (the Windows Update Agent COM API), one at a time. Section 31 reuses the search, row and install helpers
# below for driver updates. Windows Update reaches its own update server; this file makes no network call.
# --dry-run downloads and installs nothing, and nothing here restarts Windows. ASCII only.

# Windows Update reports a cumulative update's MaxDownloadSize as its whole express payload, not what lands on disk:
# 113,011,781,477 bytes for KB5131096 on the P52 (2026-11-13). A size above this ceiling is shown as unknown.
$Script:WS_WU_SIZE_CEILING = [long]20GB

$Script:WS_RESTART_HINT = 'Restart Windows to finish installing updates (windowsweep never restarts your PC)'

# The HRESULTs a person can act on, in plain words. Any other code is shown in hex only.
$Script:WS_WU_ERRORS = @{
  '0x80070422' = 'the Windows Update service is disabled'
  '0x80070005' = 'access denied; this step needs an elevated run'
  '0x80240044' = 'only an elevated run may install updates for the whole PC'
  '0x80240016' = 'another installation is running, or Windows is waiting for a restart; run this again after it'
  '0x8024402C' = 'the update server name could not be resolved (no connection, or a proxy in the way)'
  '0x80072EE7' = 'the update server name could not be resolved (no connection, or a proxy in the way)'
  '0x80072EFD' = 'Windows Update could not connect to its update server'
  '0x80072EE2' = 'the connection to the update server timed out'
  '0x80240438' = 'there is no network route to the update server'
}

function Get-WuErrorText {
  <# .SYNOPSIS One Windows Update failure as text: the HRESULT in hex, plus plain words when a person can act on it.
     Pure. #>
  param([int] $HResult, [string] $Message = '')
  $hex = '0x{0:X8}' -f $HResult
  if ($Script:WS_WU_ERRORS.ContainsKey($hex)) { return "$hex ($($Script:WS_WU_ERRORS[$hex]))" }
  $m = ([string]$Message).Trim()
  if ($m -and $m -notmatch '(?i)HRESULT') { return "$hex ($m)" }
  return $hex
}

function Get-WuFailureText {
  <# .SYNOPSIS The failure text for a caught COM error. PowerShell wraps it in a MethodInvocationException whose own
     HResult says nothing about Windows Update, so the innermost exception is the one read. #>
  param([Management.Automation.ErrorRecord] $ErrorRecord)
  $ex = $ErrorRecord.Exception
  while ($null -ne $ex.InnerException) { $ex = $ex.InnerException }
  return (Get-WuErrorText -HResult $ex.HResult -Message $ex.Message)
}

function Get-WuUpdateBytes {
  <# .SYNOPSIS Expected download size of one update: MinDownloadSize when Windows Update gives one, else
     MaxDownloadSize; 0 (unknown) when neither is set or the figure is above 20 GB. Pure. #>
  param([long] $Min, [long] $Max)
  $b = $Max
  if ($Min -gt 0) { $b = $Min }
  if ($b -le 0 -or $b -gt $Script:WS_WU_SIZE_CEILING) { return [long]0 }
  return [long]$b
}

function Format-CellText {
  <# .SYNOPSIS Cut a table cell to -Width characters, marking the cut with '~' as section 26 does. Pure. #>
  param([string] $Text, [int] $Width)
  $t = [string]$Text
  if ($t.Length -le $Width) { return $t }
  return $t.Substring(0, $Width - 1) + '~'
}

function Get-UpdateShortTitle {
  <# .SYNOPSIS A title for the table: without the "(KB...)" suffix the KB column already shows, and without
     "for x64-based Systems". The full title stays in the log and the --json label. Pure. #>
  param([string] $Title)
  $t = ([string]$Title) -replace '\s*\(KB\d+\)\s*$', '' -replace '\s+for (x64|x86|ARM64)-based Systems', ''
  return $t.Trim()
}

function Get-UpdateRef {
  <# .SYNOPSIS How a line names one update: its KB number, or its title when it has none (drivers have none). #>
  param([pscustomobject] $Row)
  if ($Row.Kb) { return $Row.Kb }
  return $Row.Title
}

function ConvertTo-UpdateRow {
  <# .SYNOPSIS One Windows Update entry - the COM IUpdate, or a fixture with the same property names - as the row
     sections 30 and 31 list. $null for a BrowseOnly update (feature upgrades and optional previews, which Windows
     itself installs only on request) unless -IncludeBrowseOnly. Pure: it only reads properties. #>
  param([object] $Update, [switch] $IncludeBrowseOnly)
  if ($null -eq $Update) { return $null }
  $optional = [bool]$Update.BrowseOnly
  if ($optional -and -not $IncludeBrowseOnly) { return $null }
  $id = [string]$Update.Identity.UpdateID
  $kbs = @()
  foreach ($k in $Update.KBArticleIDs) { if ($k) { $kbs += "KB$k" } }
  $class = ''; $first = ''
  foreach ($c in $Update.Categories) {
    $name = [string]$c; $type = ''
    if ($c -isnot [string]) { $name = [string]$c.Name; $type = [string]$c.Type }
    if (-not $first) { $first = $name }
    if (-not $class -and $type -eq 'UpdateClassification') { $class = $name }
  }
  if (-not $class) { $class = $first }
  # RebootBehavior 0 = never reboots; 1 and 2 may ask for a restart. Unknown counts as "may".
  $reboot = $true
  if ($null -ne $Update.InstallationBehavior -and [int]$Update.InstallationBehavior.RebootBehavior -eq 0) { $reboot = $false }
  $date = ''
  if ($Update.DriverVerDate -is [datetime]) { $date = $Update.DriverVerDate.ToString('yyyy-MM-dd') }
  return [pscustomobject]@{
    Id = $id; Path = "wu:$id"; Kb = ($kbs -join ','); Title = [string]$Update.Title; Category = $class
    Severity = [string]$Update.MsrcSeverity; Optional = $optional; RebootLikely = $reboot
    Bytes = (Get-WuUpdateBytes -Min ([long]$Update.MinDownloadSize) -Max ([long]$Update.MaxDownloadSize))
    DriverClass = [string]$Update.DriverClass; DriverProvider = [string]$Update.DriverProvider; DriverDate = $date
    Update = $Update
  }
}

function Find-WindowsUpdates {
  <# .SYNOPSIS Ask Windows Update what this PC does not have yet: -Type Software (section 30) or Driver (31).
     Returns Session (reused to install), Updates (COM objects) and Error ('' or the failure text). #>
  param([ValidateSet('Software', 'Driver')] [string] $Type)
  $out = [pscustomobject]@{ Session = $null; Updates = @(); Error = '' }
  $criteria = "IsInstalled=0 and IsHidden=0 and Type='$Type'"
  try {
    $session = New-Object -ComObject Microsoft.Update.Session
    $session.ClientApplicationID = $Script:WS_NAME
    $searcher = $session.CreateUpdateSearcher()
    Write-LogLine "Windows Update search: $criteria"
    $result = $searcher.Search($criteria)
    $list = @()
    foreach ($u in $result.Updates) { $list += $u }
    $out.Session = $session
    $out.Updates = $list
    Write-LogLine "Windows Update search: result code $($result.ResultCode), $($list.Count) update(s)"
  } catch {
    $out.Error = Get-WuFailureText -ErrorRecord $_
    Write-LogLine "Windows Update search failed: $($out.Error)"
  }
  return $out
}

function Install-WindowsUpdateOne {
  <# .SYNOPSIS Download and install ONE update through Windows Update. Download() and Install() return when Windows
     Update is done, so nothing here polls. Returns Code (2 succeeded, 3 succeeded with errors, 4 failed, 5 aborted),
     Error and Reboot. The caller has already checked for a real, elevated run. #>
  param([object] $Session, [pscustomobject] $Row)
  $res = [pscustomobject]@{ Code = 4; Error = ''; Reboot = $false }
  try {
    $u = $Row.Update
    if (-not $u.EulaAccepted) { $u.AcceptEula() }
    $coll = New-Object -ComObject Microsoft.Update.UpdateColl
    $null = $coll.Add($u)
    if (-not $u.IsDownloaded) {
      $dl = $Session.CreateUpdateDownloader()
      $dl.Updates = $coll
      $d = $dl.Download()
      if ([int]$d.ResultCode -notin 2, 3) {
        $res.Code = [int]$d.ResultCode
        $res.Error = 'download: ' + (Get-WuErrorText -HResult ([int]$d.HResult))
        return $res
      }
    }
    $inst = $Session.CreateUpdateInstaller()
    $inst.AllowSourcePrompts = $false
    $inst.Updates = $coll
    $r = $inst.Install()
    $one = $r.GetUpdateResult(0)
    $res.Code = [int]$one.ResultCode
    $res.Error = Get-WuErrorText -HResult ([int]$one.HResult)
    $res.Reboot = ([bool]$r.RebootRequired -or [bool]$one.RebootRequired)
  } catch {
    $res.Error = Get-WuFailureText -ErrorRecord $_
  }
  return $res
}

function Write-WuInstallResult {
  <# .SYNOPSIS One verdict line for an install, worded from the Windows Update result code. #>
  param([pscustomobject] $Row, [pscustomobject] $Result)
  $name = Get-UpdateRef $Row
  Write-LogLine ("Windows Update install {0}: result code {1}, {2}, restart needed: {3}" -f $name, $Result.Code, $Result.Error, $Result.Reboot)
  switch ($Result.Code) {
    2 { Write-Ok "$name installed" }
    3 { Write-Warn "$name installed with errors: $($Result.Error)" }
    5 { Write-Warn "$name was not installed: Windows Update stopped before it finished ($($Result.Error))" }
    default { Write-Err "$name was not installed: $($Result.Error)" }
  }
}

function Add-RestartHint {
  <# .SYNOPSIS Say once, after the last install, that Windows needs a restart. The restart is always the person's. #>
  $ws = $Script:WS
  Write-Note 'Windows needs a restart to finish. Restart when it suits you; windowsweep never restarts your PC.'
  if ($ws.Hints -notcontains $Script:WS_RESTART_HINT) { $ws.Hints += $Script:WS_RESTART_HINT }
}

function Get-WindowsBuildLine {
  <# .SYNOPSIS "Microsoft Windows 10 Pro for Workstations 22H2, build 19045.7807": the caption read at start, then
     DisplayVersion (ReleaseId before 20H2) and CurrentBuild.UBR from the registry. #>
  $line = [string]$Script:WS.OsCaption
  try { $cv = Get-ItemProperty -LiteralPath 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion' -ErrorAction Stop } catch { return $line }
  $ver = [string]$cv.DisplayVersion
  if (-not $ver) { $ver = [string]$cv.ReleaseId }
  $line = ("$line $ver").Trim()
  if ($cv.CurrentBuild) {
    $build = [string]$cv.CurrentBuild
    if ($null -ne $cv.UBR) { $build = "$build.$($cv.UBR)" }
    $line += ", build $build"
  }
  return $line
}

function Test-WindowsRestartPending {
  <# .SYNOPSIS True when Windows Update itself says an earlier install is waiting for a restart. #>
  try { return [bool](New-Object -ComObject Microsoft.Update.SystemInfo).RebootRequired } catch { return $false }
}

function Get-Targets30 {
  return @((New-Target 30 'Windows updates (Windows Update)' 'Windows Update Agent (COM)' -Kind cmd -Note 'you pick; Windows Update downloads and installs each one, one at a time; elevated run; never restarts'))
}

function Invoke-Section30 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Windows Update is asked which updates this PC still lacks, and you pick from that list. Each update you pick',
    'is downloaded and installed by Windows Update itself, one at a time, after you confirm. Feature upgrades and',
    'optional previews stay in Settings. Installing needs an elevated run, and nothing here restarts your PC.'
  )
  Write-Info ('this PC: ' + (Get-WindowsBuildLine))
  if (Test-WindowsRestartPending) { Write-Warn 'Windows is waiting for a restart to finish an earlier update' }
  Write-Info 'asking Windows Update (it contacts its update server; this can take a minute)'
  $found = Find-WindowsUpdates -Type 'Software'
  if ($found.Error) { Write-Err "Windows Update could not search: $($found.Error)"; return }
  $rows = @(); $optional = 0
  foreach ($u in $found.Updates) {
    $r = ConvertTo-UpdateRow -Update $u
    if ($null -eq $r) { $optional++ } else { $rows += $r }
  }
  if ($optional -gt 0) { Write-Note "$optional optional update(s) not listed: feature upgrades and previews install from Settings > Windows Update" }
  if ($rows.Count -eq 0) { Write-Ok 'Windows Update has nothing to install'; return }
  Write-UiLine ("  {0,3}  {1,9}  {2,-9}  {3,-54} {4}" -f '#', 'SIZE', 'KB', 'TITLE', 'CATEGORY') 'White'
  $i = 1
  foreach ($r in $rows) {
    $size = 'unknown'
    if ($r.Bytes -gt 0) { $size = Format-Bytes $r.Bytes }
    Write-UiLine ("  {0,3}  {1,9}  {2,-9}  {3,-54} {4}" -f $i, $size, (Format-CellText $r.Kb 9), (Format-CellText (Get-UpdateShortTitle $r.Title) 54), $r.Category) 'Gray'
    Add-JsonCandidate -Section 30 -Index $i -Path $r.Path -Bytes $r.Bytes -IdleDays -1 -Label $r.Title -Extra ([ordered]@{
        kind = 'windows-update'; kb = $r.Kb; category = $r.Category; severity = $r.Severity; reboot_likely = $r.RebootLikely; needs_admin = $true })
    $i++
  }
  if (-not $ws.DryRun -and -not $ws.IsAdmin) {
    Write-Warn 'installing Windows updates needs Administrator rights - nothing was installed'
    Write-Note 'run it elevated:  windowsweep --only 30 --elevate'
    $ws.Hints += 'Install Windows updates from an elevated run:  windowsweep --only 30 --elevate'
    return
  }
  $picks = @(Read-MultiSelect -Total $rows.Count -NoAutoYes -Candidates @($rows | ForEach-Object { $_.Path }))
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  Write-LogLine ('section 30 picks: ' + (($picks | ForEach-Object { $rows[$_ - 1].Path }) -join ', '))
  if ($ws.DryRun) {
    foreach ($k in $picks) { $r = $rows[$k - 1]; Write-DryRun ("would download and install {0} through Windows Update: {1}" -f (Get-UpdateRef $r), $r.Title) }
    Write-Note 'nothing was downloaded or installed'
    return
  }
  if (-not (Confirm-Ui -Prompt "Download and install $($picks.Count) update(s) through Windows Update, one at a time?" -Default 'n' -NoAutoYes -ScriptedOk)) { Write-Info 'skipped'; return }
  $restart = $false
  $n = 0
  foreach ($k in $picks) {
    $r = $rows[$k - 1]
    $n++
    Write-Info ("{0} of {1}: {2} - downloading and installing; Windows Update sets the pace" -f $n, $picks.Count, (Get-UpdateRef $r))
    $res = Install-WindowsUpdateOne -Session $found.Session -Row $r
    Write-WuInstallResult -Row $r -Result $res
    if ($res.Reboot) { $restart = $true }
  }
  if ($restart) { Add-RestartHint }
}
