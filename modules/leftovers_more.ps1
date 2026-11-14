# leftovers_more.ps1 - what an uninstaller leaves besides folders (1.5.0, D109): the program's own registry keys,
# Start-menu shortcuts whose target is gone, startup entries and scheduled tasks whose program file is gone.
# Section 26 offers these for the programs it just removed; section 27 for programs removed earlier (the
# uninstall history) and for any startup entry, task or Start-menu shortcut that points at a missing file.
# Seen on the P52 (2026-11-13): a "Malwarebytes Anti-Exploit" Run entry still launching a deleted mbae.exe.
# Registry rows go through lib\registry.ps1 (.reg backup first); shortcuts go to the Recycle Bin; a task is
# exported to XML before it is unregistered. Nothing here is picked by --yes. ASCII only.

$Script:WS_STARTUP_HOSTS = @('rundll32.exe', 'regsvr32.exe', 'cmd.exe', 'powershell.exe', 'pwsh.exe', 'wscript.exe', 'cscript.exe', 'mshta.exe', 'conhost.exe')

function Get-UninstallHistoryPath { return (Join-Path $Script:WS.Home 'uninstalled.jsonl') }

function Add-UninstallHistory {
  <# .SYNOPSIS Record one real removal (one JSON object per line) so its leftovers can be found later. #>
  param([pscustomobject] $Row, [string] $Strategy = '')
  $kind = 'program'
  if ($Row.PSObject.Properties['Kind'] -and $Row.Kind) { $kind = [string]$Row.Kind }
  $o = [ordered]@{ date = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ss'); name = [string]$Row.DisplayName; version = [string]$Row.DisplayVersion
    publisher = [string]$Row.Publisher; kind = $kind; key = [string]$Row.KeyPath; install_location = [string]$Row.InstallLocation; strategy = $Strategy }
  try {
    $file = Get-UninstallHistoryPath
    $dir = Split-Path -Parent $file
    if (-not (Test-DirPresent $dir)) { $null = New-Item -ItemType Directory -Force -Path $dir }
    [IO.File]::AppendAllText($file, (($o | ConvertTo-Json -Compress) + "`n"))
  } catch { Write-LogLine "uninstall history not written: $($_.Exception.Message)" }
}

function Get-UninstallHistory {
  <# .SYNOPSIS Programs removed earlier, newest record per name, shaped like uninstall-hive rows. #>
  $file = Get-UninstallHistoryPath
  if (-not (Test-Path -LiteralPath $file)) { return @() }
  $byName = @{}
  foreach ($line in @([IO.File]::ReadAllLines($file))) {
    if (-not $line.Trim()) { continue }
    try { $o = $line | ConvertFrom-Json } catch { continue }
    if (-not $o.name) { continue }
    $byName[[string]$o.name] = [pscustomobject]@{ DisplayName = [string]$o.name; DisplayVersion = [string]$o.version; Publisher = [string]$o.publisher
      InstallLocation = [string]$o.install_location; KeyPath = [string]$o.key; Kind = [string]$o.kind; Date = [string]$o.date }
  }
  return @($byName.Values)
}

function Get-LeftoverNameTokens {
  <# .SYNOPSIS Pure: a program's product names and vendor names as match tokens (4+ chars, a letter, never a
     common word). The product's first word is skipped when it is the vendor's ("Adobe Shockwave Player" ->
     product "shockwave", vendor "adobe"), so a vendor-wide key is never mistaken for one product's key. #>
  param([pscustomobject] $Program)
  $vendor = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
  $product = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
  $ok = { param($t) $t.Length -ge 4 -and $t -match '[a-z]' -and $Script:WS_LEFTOVER_STOPWORDS -notcontains $t }
  $pubWords = @(([string]$Program.Publisher) -split '[^A-Za-z0-9]+' | Where-Object { $_ })
  foreach ($x in @($pubWords | Select-Object -First 1) + @([string]$Program.Publisher)) { $t = ConvertTo-MatchToken $x; if (& $ok $t) { $null = $vendor.Add($t) } }
  $all = @(([string]$Program.DisplayName) -split '[^A-Za-z0-9]+' | Where-Object { $_ })
  $words = @($all | Where-Object { -not $vendor.Contains((ConvertTo-MatchToken $_)) })
  $first = @($words | Where-Object { & $ok (ConvertTo-MatchToken $_) } | Select-Object -First 1)
  $texts = @($first) + @([string]$Program.DisplayName)
  $loc = ([string]$Program.InstallLocation).Trim().Trim('"').TrimEnd('\')
  if ($loc) { $texts += (Split-Path -Leaf $loc) }
  foreach ($x in $texts) { $t = ConvertTo-MatchToken $x; if ((& $ok $t) -and -not $vendor.Contains($t)) { $null = $product.Add($t) } }
  # A program named after its maker ("RustDesk" by RustDesk) keeps its name as the product token.
  if ($product.Count -eq 0) { foreach ($x in @($all | Select-Object -First 1) + @([string]$Program.DisplayName)) { $t = ConvertTo-MatchToken $x; if (& $ok $t) { $null = $product.Add($t) } } }
  return [pscustomobject]@{ Product = $product; Vendor = $vendor }
}

function Test-KeyNameClaimed {
  <# .SYNOPSIS True when an installed program still claims this key name (the section 23 index). #>
  param([string] $Name, [pscustomobject] $Index)
  if ($null -eq $Index) { return $false }
  return -not (Test-OrphanFolderName -Name $Name -Index $Index)
}

function Find-RegistryLeftovers {
  <# .SYNOPSIS Keys named for the given removed programs under HKCU\Software and HKLM\SOFTWARE (both views). A
     vendor key is offered whole only when every key under it belongs to the removed programs and no installed
     program claims the vendor; otherwise only its matching children. -Roots and -Index are for the self-test. #>
  param([pscustomobject[]] $Programs, [pscustomobject] $Index = $null, [string[]] $Roots = @())
  if ($Roots.Count -eq 0) { $Roots = $Script:WS_REG_ROOTS }
  $prod = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
  $vend = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
  foreach ($pg in @($Programs)) { $tk = Get-LeftoverNameTokens $pg; foreach ($t in $tk.Product) { $null = $prod.Add($t) }; foreach ($t in $tk.Vendor) { $null = $vend.Add($t) } }
  $out = New-Object System.Collections.Generic.List[object]
  if ($prod.Count -eq 0) { return @() }
  foreach ($root in $Roots) {
    foreach ($k in @(Get-RegistrySubKeyNames $root)) {
      $path = "$root\$k"
      if ((Test-RegistryNeverName $k) -or (Get-RegistryProtectionReason -Path $path)) { continue }
      if (Test-NameMatchesTokens -Name $k -Tokens $prod) {
        if (-not (Test-KeyNameClaimed -Name $k -Index $Index)) { $out.Add((New-LeftoverRow -Kind 'registry' -Path $path -Root $root -Label "registry key $k")) }
        continue
      }
      if ($vend.Count -eq 0 -or -not (Test-NameMatchesTokens -Name $k -Tokens $vend)) { continue }
      $subs = @(Get-RegistrySubKeyNames $path)
      $hits = @($subs | Where-Object { (Test-NameMatchesTokens -Name $_ -Tokens $prod) -and -not (Test-KeyNameClaimed -Name $_ -Index $Index) })
      $vendorFree = -not (Test-KeyNameClaimed -Name $k -Index $Index)
      if ($vendorFree -and ($subs.Count -eq 0 -or $hits.Count -eq $subs.Count)) { $out.Add((New-LeftoverRow -Kind 'registry' -Path $path -Root $root -Label "registry key $k")) }
      else { foreach ($h in $hits) { $out.Add((New-LeftoverRow -Kind 'registry' -Path "$path\$h" -Root $root -Label "registry key $k\$h")) } }
    }
  }
  return $out.ToArray()
}

function New-LeftoverRow {
  param([string] $Kind, [string] $Path, [string] $Root, [string] $Label, [string] $Reason = '', [long] $Bytes = 0, [string] $Target = '')
  $machine = $Path.StartsWith('HKEY_LOCAL_MACHINE', [StringComparison]::OrdinalIgnoreCase)
  if (-not $Reason -and ($Kind -eq 'registry' -or $Kind -eq 'startup') -and $machine -and -not $Script:WS.IsAdmin) {
    $Reason = 'machine-wide: an elevated run removes it'
  }
  return [pscustomobject]@{ Kind = $Kind; Path = $Path; Root = $Root; Label = $Label; Reason = $Reason; Bytes = $Bytes; Target = $Target }
}

function Test-FileGone {
  <# .SYNOPSIS True only when the path is absolute, its drive is present, and the file is not there - an unplugged
     drive never makes a target look dead. #>
  param([string] $Path)
  if ($Path -notmatch '^([A-Za-z]:)\\') { return $false }
  if (-not (Test-Path -LiteralPath ($Matches[1] + '\'))) { return $false }
  return -not (Test-Path -LiteralPath $Path)
}

function Get-StartupProgramPath {
  <# .SYNOPSIS Pure: the file a startup command really runs - the program, or for a script host (rundll32,
     cmd, powershell, wscript, ...) the first absolute path among its arguments. #>
  param([string] $Command)
  $paths = @(Get-CommandPaths $Command)
  if ($paths.Count -eq 0) { return '' }
  if ($Script:WS_STARTUP_HOSTS -contains ([IO.Path]::GetFileName($paths[0])).ToLowerInvariant()) {
    if ($paths.Count -gt 1) { return $paths[1] }
    return ''
  }
  return $paths[0]
}

function Find-DeadStartupEntries {
  <# .SYNOPSIS Run and RunOnce values (this user, the machine, 32-bit) whose program file is gone. -Keys is for the
     self-test, which reads a fixture key instead of the real Run keys. #>
  param([string[]] $Keys = @())
  if ($Keys.Count -eq 0) { $Keys = $Script:WS_REG_RUN_KEYS }
  $out = @()
  foreach ($key in $Keys) {
    $item = $null
    try { $item = Get-ItemProperty -LiteralPath "Registry::$key" -ErrorAction Stop } catch { continue }
    foreach ($prop in $item.PSObject.Properties) {
      if ($prop.Name -like 'PS*' -or $prop.Name -eq '(default)') { continue }
      $target = Get-StartupProgramPath ([string]$prop.Value)
      if ($target -and (Test-FileGone $target)) {
        $out += New-LeftoverRow -Kind 'startup' -Path "$key::$($prop.Name)" -Root $key -Label "startup entry '$($prop.Name)' (runs $target, which is gone)" -Target $target
      }
    }
  }
  return $out
}

function Find-DeadScheduledTasks {
  <# .SYNOPSIS Scheduled tasks outside \Microsoft\ whose program file is gone. #>
  $out = @()
  $tasks = @()
  try { $tasks = @(Get-ScheduledTask -ErrorAction Stop) } catch { return @() }
  foreach ($t in $tasks) {
    if ([string]$t.TaskPath -like '\Microsoft\*') { continue }
    foreach ($a in @($t.Actions)) {
      if (-not $a.Execute) { continue }
      $exe = [Environment]::ExpandEnvironmentVariables(([string]$a.Execute).Trim().Trim('"'))
      if (Test-FileGone $exe) {
        $reason = ''
        if (-not $Script:WS.IsAdmin) { $reason = 'scheduled tasks are removed from an elevated run' }
        $out += New-LeftoverRow -Kind 'task' -Path ('task:' + $t.TaskPath + $t.TaskName) -Root ([string]$t.TaskPath) -Label "scheduled task $($t.TaskPath)$($t.TaskName) (runs $exe, which is gone)" -Reason $reason -Target $exe
        break
      }
    }
  }
  return $out
}

function Get-StartMenuProgramRoots {
  $out = @()
  foreach ($d in @([Environment]::GetFolderPath('StartMenu'), [Environment]::GetFolderPath('CommonStartMenu'))) {
    if ($d) { $p = Join-Path $d 'Programs'; if (Test-DirPresent $p) { $out += $p } }
  }
  return $out
}

function Find-ShortcutLeftovers {
  <# .SYNOPSIS Start-menu shortcuts that point into a removed program's folder, or whose target is gone and whose
     name is the program's; with -AnyDead, every Start-menu shortcut whose target is gone. Desktop shortcuts are
     reported only (the Desktop is protected). Advertised MSI shortcuts carry no target and are never judged. #>
  param([pscustomobject[]] $Programs = @(), [switch] $AnyDead)
  $prod = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
  $locs = @()
  foreach ($pg in @($Programs)) {
    foreach ($t in (Get-LeftoverNameTokens $pg).Product) { $null = $prod.Add($t) }
    $l = ([string]$pg.InstallLocation).Trim().Trim('"').TrimEnd('\')
    # A broken entry can name Program Files itself; a protected root would make every shortcut look like its own.
    if ($l -match '^[A-Za-z]:\\.+' -and -not (Get-ProtectionReason $l)) { $locs += ($l + '\') }
  }
  $shell = $null
  try { $shell = New-Object -ComObject WScript.Shell } catch { return @() }
  $out = @()
  try {
    $dirs = @(Get-StartMenuProgramRoots | ForEach-Object { [pscustomobject]@{ Dir = $_; Desktop = $false } })
    foreach ($d in @([Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('CommonDesktopDirectory'))) { if ($d -and (Test-DirPresent $d)) { $dirs += [pscustomobject]@{ Dir = $d; Desktop = $true } } }
    foreach ($d in $dirs) {
      $files = @(Get-ChildItem -LiteralPath $d.Dir -Recurse:(-not $d.Desktop) -Filter '*.lnk' -File -ErrorAction SilentlyContinue | Select-Object -First 3000)
      foreach ($f in $files) {
        $target = ''
        try { $target = [string]$shell.CreateShortcut($f.FullName).TargetPath } catch { continue }
        if (-not $target) { continue }
        $inside = @($locs | Where-Object { $target.StartsWith($_, [StringComparison]::OrdinalIgnoreCase) }).Count -gt 0
        $gone = Test-FileGone $target
        $named = $prod.Count -gt 0 -and ((Test-NameMatchesTokens -Name $f.BaseName -Tokens $prod) -or (Test-NameMatchesTokens -Name $f.Directory.Name -Tokens $prod))
        if (-not ($inside -or ($gone -and ($named -or $AnyDead)))) { continue }
        $reason = ''
        if ($d.Desktop) { $reason = 'on the Desktop, which windowsweep never changes - delete it yourself' }
        $out += New-LeftoverRow -Kind 'shortcut' -Path (Remove-LongPrefix $f.FullName) -Root $d.Dir -Label "Start-menu shortcut $($f.BaseName) -> $target" -Reason $reason -Bytes $f.Length -Target $target
      }
    }
  } finally { try { $null = [Runtime.InteropServices.Marshal]::ReleaseComObject($shell) } catch { $null = $_ } }
  return $out
}

function Get-RemovedHistoryPrograms {
  <# .SYNOPSIS Desktop programs in the uninstall history that are still gone (no entry by that name or key). #>
  $installed = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($r in @(Get-InstalledProgramRows)) { $null = $installed.Add($r.DisplayName) }
  return @(Get-UninstallHistory | Where-Object {
      $_.Kind -eq 'program' -and -not $installed.Contains($_.DisplayName) -and -not ($_.KeyPath -and (Test-Path -LiteralPath ('Registry::' + $_.KeyPath))) })
}

function Find-EarlierRemovalExtras {
  <# .SYNOPSIS Section 27: registry keys and Start-menu shortcuts of programs in the uninstall history that are no
     longer installed, plus every startup entry, scheduled task and Start-menu shortcut whose file is gone. #>
  param([pscustomobject[]] $Gone = @())
  $gone = @($Gone)
  $rows = @()
  if ($gone.Count -gt 0) {
    Write-Note "$($gone.Count) program(s) in the uninstall history are no longer installed; looking for their registry keys"
    $locs = @($gone | ForEach-Object { ([string]$_.InstallLocation).Trim().Trim('"').TrimEnd('\') } | Where-Object { $_ })
    $rows += @(Find-RegistryLeftovers -Programs $gone -Index (Get-InstalledProgramIndex -IgnorePaths $locs))
  }
  $rows += @(Find-ShortcutLeftovers -Programs $gone -AnyDead)
  $rows += @(Find-DeadStartupEntries)
  $rows += @(Find-DeadScheduledTasks)
  return $rows
}

function Remove-ScheduledTaskSafe {
  <# .SYNOPSIS Export a task to XML beside the registry backups, then unregister it. Never under \Microsoft\.
     Returns removed | dry-run | refused | failed. #>
  param([string] $TaskPath, [string] $TaskName)
  if ($TaskPath -like '\Microsoft\*' -or -not $TaskName) { Write-Warn "kept the task $TaskPath$TaskName (Windows' own)"; return 'refused' }
  if ($Script:WS.DryRun) { Write-DryRun "would export, then unregister the scheduled task $TaskPath$TaskName"; return 'dry-run' }
  $dir = Join-Path $Script:WS.ReportsDir ('registry-backups\' + $Script:WS.Stamp)
  $file = Join-Path $dir (('task-' + $TaskName -replace '[^A-Za-z0-9._-]', '_') + '.xml')
  try {
    $null = New-Item -ItemType Directory -Force -Path $dir -ErrorAction Stop
    [IO.File]::WriteAllText($file, [string](Export-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -ErrorAction Stop))
  } catch { Write-Err "kept the task $TaskPath$TaskName - its XML backup could not be written: $($_.Exception.Message)"; return 'failed' }
  try { Unregister-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -Confirm:$false -ErrorAction Stop }
  catch { Write-Err "could not unregister $TaskPath$TaskName - $($_.Exception.Message)"; return 'failed' }
  Write-Ok "unregistered the scheduled task $TaskPath$TaskName"
  Write-Note "  backup (Task Scheduler > Import Task): $file"
  Write-LogLine "task removed: $TaskPath$TaskName (backup $file)"
  return 'removed'
}

function Invoke-ExtraLeftoverChoice {
  <# .SYNOPSIS Report the rows that stay, list the rest, let a person pick, then remove each through its own safe
     path. -PathsOrConsoleOnly as in Invoke-LeftoverChoice. #>
  param([object[]] $Rows, [int] $Section, [switch] $PathsOrConsoleOnly)
  $ws = $Script:WS
  foreach ($r in @($Rows | Where-Object { $_.Reason })) { Write-Note ("kept: {0}  ({1})" -f $r.Path, $r.Reason) }
  $offer = @($Rows | Where-Object { -not $_.Reason })
  if ($offer.Count -eq 0) { Write-Info 'no registry key, shortcut, startup entry or task to offer'; return }
  Write-UiLine ("  {0,3}  {1,-9} {2}" -f '#', 'KIND', 'WHAT') 'White'
  $i = 1
  foreach ($r in $offer) {
    Write-UiLine ("  {0,3}  {1,-9} {2}" -f $i, $r.Kind, $r.Label) 'Gray'
    if ($r.Kind -ne 'task' -and $r.Path -ne $r.Label) { Write-UiLine ("            {0}" -f $r.Path) 'DarkGray' }
    $extra = [ordered]@{ kind = $r.Kind; needs_admin = ($r.Path.StartsWith('HKEY_LOCAL_MACHINE') -or $r.Kind -eq 'task') }
    if ($r.Target) { $extra.target = [string]$r.Target }
    Add-JsonCandidate -Section $Section -Index $i -Path $r.Path -Bytes $r.Bytes -IdleDays -1 -Label $r.Label -Extra $extra
    $i++
  }
  Write-Note 'registry keys and startup entries are exported to a .reg file first; shortcuts go to the Recycle Bin; a task is saved as XML first'
  $saved = $ws.SelectQueue
  if ($PathsOrConsoleOnly) { $ws.SelectQueue = @() }
  try { $picks = @(Read-MultiSelect -Total $offer.Count -NoAutoYes -Candidates @($offer | ForEach-Object { $_.Path })) } finally { if ($PathsOrConsoleOnly) { $ws.SelectQueue = $saved } }
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  if (-not $ws.DryRun) {
    if (-not (Confirm-Ui -Prompt "Remove $($picks.Count) leftover(s) as listed?" -Default 'n' -NoAutoYes -ScriptedOk)) { Write-Info 'skipped'; return }
  }
  foreach ($k in $picks) {
    $r = $offer[$k - 1]
    switch ($r.Kind) {
      'registry' { $null = Remove-RegistryKeySafe -Path $r.Path -Label 'registry key' }
      'startup' { $sep = $r.Path.IndexOf('::'); $null = Remove-RegistryValueSafe -KeyPath $r.Path.Substring(0, $sep) -Name $r.Path.Substring($sep + 2) }
      'shortcut' { $null = Send-ToRecycleBin -Path $r.Path -Within $r.Root }
      'task' { $full = $r.Path.Substring(5); $cut = $full.LastIndexOf('\'); $null = Remove-ScheduledTaskSafe -TaskPath $full.Substring(0, $cut + 1) -TaskName $full.Substring($cut + 1) }
    }
  }
}
