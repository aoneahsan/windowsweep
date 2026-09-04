# orphaned_appdata.ps1 - section 23: folders directly under %APPDATA% and %LOCALAPPDATA% that belong to no
# installed program. Interactive only; selected folders go to the Recycle Bin.
#
# The dangerous direction here is calling something orphaned when it is not, so every test errs the other
# way: matching is generous, the exclusion list is long, and an EMPTY program index produces ZERO candidates
# rather than "everything is orphaned".

# Windows' own folders, shared infrastructure, and vendors whose data outlives an uninstall.
$Script:WS_ORPHAN_EXCLUDE = @(
  'Microsoft', 'Windows', 'WindowsPowerShell', 'PowerShell', 'Packages', 'Programs', 'Temp', 'Tmp', 'Comms',
  'ConnectedDevicesPlatform', 'D3DSCache', 'Google', 'Mozilla', 'CrashDumps', 'VirtualStore', 'PeerDistRepub',
  'Publishers', 'History', 'IconCache', 'ElevatedDiagnostics', 'Application Data', 'Local Settings',
  'Deployment', 'assembly', 'GroupPolicy', 'Roaming', 'Local', 'LocalLow', 'Low', 'Diagnostics',
  'PlaceholderTileLogoFolder', 'Desktop', 'Downloads', 'Documents', 'Start Menu', 'SendTo',
  'Recent', 'NetHood', 'PrintHood', 'Templates', 'Cookies',
  # Platform folders that belong to Windows or .NET rather than to any one program: they look orphaned
  # because no uninstall entry names them, and one of them holds settings a .NET app wrote.
  'IsolatedStorage', 'ToastNotificationManagerCompat', 'AppV', 'Package Cache', 'DBG', 'CLR_v4.0', 'CLR_v4.0_32'
)

function ConvertTo-MatchToken {
  <# .SYNOPSIS Lower-case, alphanumerics only - so "Slack Technologies, Inc." and "slack" compare equal. #>
  param([string] $Text)
  if ([string]::IsNullOrWhiteSpace($Text)) { return '' }
  return ($Text.ToLowerInvariant() -replace '[^a-z0-9]', '')
}

function Add-MatchTokens {
  <# .SYNOPSIS Add a display string to the token set: the whole thing, plus each word of 4+ characters. #>
  param([System.Collections.Generic.HashSet[string]] $Set, [string] $Text)
  $whole = ConvertTo-MatchToken $Text
  if ($whole.Length -ge 3) { $null = $Set.Add($whole) }
  foreach ($w in ($Text -split '[^A-Za-z0-9]+')) {
    $t = ConvertTo-MatchToken $w
    if ($t.Length -ge 4) { $null = $Set.Add($t) }
  }
}

function Get-InstalledProgramRows {
  <# .SYNOPSIS Raw uninstall-hive rows from all three registry views. Shared with section 24. #>
  $rows = @()
  $hives = @(
    'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',
    'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall',
    'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall'
  )
  foreach ($h in $hives) {
    $keys = @()
    try { $keys = @(Get-ChildItem -LiteralPath $h -ErrorAction Stop) } catch { $keys = @() }
    foreach ($k in $keys) {
      $props = $null
      try { $props = Get-ItemProperty -LiteralPath $k.PSPath -ErrorAction Stop } catch { continue }
      if (-not $props.DisplayName) { continue }
      $rows += [pscustomobject]@{
        DisplayName = [string]$props.DisplayName; DisplayVersion = [string]$props.DisplayVersion
        Publisher = [string]$props.Publisher; InstallDate = [string]$props.InstallDate
        EstimatedSizeKb = [long]0 + $props.EstimatedSize; InstallLocation = [string]$props.InstallLocation
        UninstallString = [string]$props.UninstallString; SystemComponent = [int]0 + $props.SystemComponent
      }
    }
  }
  return $rows
}

function Get-InstalledProgramIndex {
  <# .SYNOPSIS Everything that says "a program owns this name": uninstall entries, program folders, Store
     package names and running processes. RegistryCount drives the fail-closed gate in section 23. #>
  $P = $Script:P
  $set = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
  $rows = @(Get-InstalledProgramRows)
  foreach ($r in $rows) {
    Add-MatchTokens -Set $set -Text $r.DisplayName
    Add-MatchTokens -Set $set -Text $r.Publisher
    if ($r.InstallLocation) { Add-MatchTokens -Set $set -Text (Split-Path -Leaf ($r.InstallLocation.TrimEnd('\'))) }
  }
  foreach ($dir in @($P.PF, $P.PF86, (Join-Path $P.L 'Programs'), (Join-Path $P.L 'Microsoft\WindowsApps'), (Join-Path $P.PD 'Microsoft\Windows\Start Menu\Programs'))) {
    if (-not $dir -or -not (Test-DirPresent $dir)) { continue }
    foreach ($e in (Get-ChildEntries $dir)) { Add-MatchTokens -Set $set -Text (($e.Name -split '_')[0]) }
  }
  foreach ($e in (Get-ChildEntries (Join-Path $P.L 'Packages'))) { Add-MatchTokens -Set $set -Text (($e.Name -split '_')[0]) }
  try { foreach ($proc in (Get-Process -ErrorAction SilentlyContinue)) { Add-MatchTokens -Set $set -Text $proc.ProcessName } } catch { $null = $_ }
  return [pscustomobject]@{ Tokens = $set; RegistryCount = $rows.Count; Rows = $rows }
}

function Get-OrphanExclusions {
  <# .SYNOPSIS Folder names section 23 never offers: the fixed list plus, derived at run time, the first
     segment under AppData of every target the tool already declares - so a vendor folder we clean can never
     also be offered for deletion, and the list cannot drift as sections are added. #>
  $P = $Script:P
  $set = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($n in $Script:WS_ORPHAN_EXCLUDE) { $null = $set.Add($n) }
  $prefixes = @("$($P.A)\", "$($P.L)\")
  foreach ($t in (Get-AllTargets)) {
    $path = [string]$t.Path
    foreach ($pre in $prefixes) {
      if ($path.StartsWith($pre, [StringComparison]::OrdinalIgnoreCase)) {
        $seg = ($path.Substring($pre.Length) -split '\\')[0]
        if ($seg) { $null = $set.Add($seg) }
      }
    }
  }
  # ,$set - a bare `return $set` UNROLLS the HashSet into an Object[], whose .Contains is case-SENSITIVE,
  # so a folder named "slack" would slip past the "Slack" entry. The comma keeps the set a set.
  return , $set
}

function Test-OrphanFolderName {
  <# .SYNOPSIS True when NOTHING installed claims this folder name. Deliberately generous in the other
     direction: a token that merely starts with the name (or the reverse) counts as a claim. #>
  param([string] $Name, [pscustomobject] $Index)
  $n = ConvertTo-MatchToken $Name
  if ($n.Length -lt 3) { return $false }
  if ($Index.Tokens.Contains($n)) { return $false }
  foreach ($t in $Index.Tokens) {
    if ($t.Length -lt 4) { continue }
    if ($t.StartsWith($n) -or $n.StartsWith($t)) { return $false }
  }
  return $true
}

function Find-OrphanedAppData {
  <# .SYNOPSIS Top-level AppData folders idle N+ days that no installed program claims. Fails closed.
     -Index is for the self-test: it proves the fail-closed gate without touching the real registry. #>
  param([int] $Days, [pscustomobject] $Index = $null)
  $P = $Script:P
  $index = $Index
  if ($null -eq $index) { $index = Get-InstalledProgramIndex }
  if ($index.RegistryCount -eq 0) {
    Write-Warn 'no uninstall entries could be read: refusing to call anything orphaned (fail closed).'
    return @()
  }
  Write-Note "cross-checked against $($index.RegistryCount) installed-program entries"
  $exclude = Get-OrphanExclusions
  $out = @()
  foreach ($root in @($P.A, $P.L)) {
    if (-not (Test-DirPresent $root)) { continue }
    foreach ($e in (Get-ChildEntries $root)) {
      if (-not ($e -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $e)) { continue }
      if ($exclude.Contains($e.Name)) { continue }
      $full = Remove-LongPrefix $e.FullName
      if (Get-ProtectionReason $full) { continue }
      if (-not (Test-OrphanFolderName -Name $e.Name -Index $index)) { continue }
      $idle = Get-IdleDays $full
      if ($idle -lt $Days) { continue }
      $out += [pscustomobject]@{ Name = $e.Name; Path = $full; Root = (Get-FullPath $root); Idle = $idle; Bytes = [long](Get-DirectoryBytes $full) }
    }
  }
  return @($out | Sort-Object Bytes -Descending | Select-Object -First 200)
}

function Get-Targets23 {
  <# .SYNOPSIS Informational rows: the candidates are found at run time, never declared as fixed paths. #>
  $P = $Script:P
  $t = @()
  foreach ($r in @($P.A, $P.L)) {
    if (Test-DirPresent $r) { $t += (New-Target 23 'AppData root scanned for orphans' (Get-FullPath $r) -Kind cmd -Note 'top-level folders only; you pick what goes, and it lands in the Recycle Bin') }
  }
  return $t
}

function Invoke-Section23 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Uninstalling a program usually leaves its AppData folder behind. This lists top-level folders under',
    "Roaming and Local that no installed program, Store package or running process claims and that nothing",
    "has touched for $($ws.Days)+ days. You pick what goes; it lands in the Recycle Bin."
  )
  $rows = @(Find-OrphanedAppData -Days $ws.Days)
  if ($rows.Count -eq 0) { Write-Info 'no orphaned application data found'; return }
  Write-UiLine ("  {0,3}  {1,10} {2,6}  {3}" -f '#', 'SIZE', 'IDLE', 'FOLDER') 'White'
  $i = 1; $total = [long]0
  foreach ($r in $rows) {
    Write-UiLine ("  {0,3}  {1,10} {2,5}d  {3}" -f $i, (Format-Bytes $r.Bytes), $r.Idle, $r.Path) 'Gray'
    Add-JsonCandidate -Section 23 -Index $i -Path $r.Path -Bytes $r.Bytes -IdleDays $r.Idle
    $total += $r.Bytes; $i++
  }
  Write-Info ('total: ' + (Format-Bytes $total))
  Write-Note 'a folder here can still hold settings or a licence for a program you plan to reinstall - read the list.'
  $dest = 'the Recycle Bin'
  if ($ws.Permanent) { $dest = 'PERMANENT deletion (--permanent)' }
  Write-Note "selected folders go to $dest"
  $picks = @(Read-MultiSelect -Total $rows.Count -NoAutoYes -Candidates @($rows | ForEach-Object { $_.Path }))
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  if (-not $ws.DryRun) {
    # Orphaned app data never auto-confirms: --yes does not apply. An explicit --select / --select-file does.
    if (-not (Confirm-Ui -Prompt "Move $($picks.Count) folder(s) to $dest ?" -Default 'n' -NoAutoYes -ScriptedOk)) { Write-Info 'skipped'; return }
  }
  foreach ($k in $picks) { $null = Send-ToRecycleBin -Path $rows[$k - 1].Path -Within $rows[$k - 1].Root }
}
