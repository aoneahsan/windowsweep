# leftovers.ps1 - section 27: folders uninstalled programs left in Program Files, Common Files and ProgramData
# (D78), and the finder section 26 runs right after an uninstall. Section 23 owns the top level of AppData.
# Registry keys, shortcuts, startup entries and tasks left behind live in leftovers_more.ps1 (1.5.0, D109).
# A folder is offered only when no installed program's name claims it, nothing registered still points into it
# (an uninstall entry, a service or driver, an environment variable or PATH entry, a Run entry, a shortcut, a
# scheduled task or a running process) and - in section 27 - it has been idle --days. An unreadable registry
# offers nothing (fail closed). Picked folders go to the Recycle Bin; one inside a protected folder is only
# reported. Seen on the P52 (2026-11-02): AVAST Software and Malwarebytes Anti-Exploit folders years after
# their uninstall. ASCII only.

# Never offered: Windows, runtime, hardware-vendor and shared folders, whatever claims them or not.
$Script:WS_LEFTOVER_NEVER = @(
  'Common Files', 'Internet Explorer', 'Microsoft', 'Microsoft.NET', 'Microsoft Office', 'Microsoft OneDrive', 'Microsoft SDKs',
  'Microsoft SQL Server', 'Microsoft Update Health Tools', 'Microsoft Visual Studio', 'Microsoft Analysis Services', 'MSBuild',
  'dotnet', 'Reference Assemblies', 'Uninstall Information', 'Windows Defender', 'Windows Defender Advanced Threat Protection',
  'Windows Kits', 'Windows Mail', 'Windows Media Player', 'Windows Multimedia Platform', 'Windows NT', 'Windows Photo Viewer',
  'Windows Portable Devices', 'Windows Security', 'Windows Sidebar', 'WindowsApps', 'WindowsPowerShell', 'ModifiableWindowsApps',
  'PowerShell', 'Windows', 'WindowsHolographicDevices', 'USOPrivate', 'USOShared', 'SoftwareDistribution', 'ssh', 'Packages',
  'Package Cache', 'regid.1991-06.com.microsoft', 'Comms', 'Application Data', 'Desktop', 'Documents', 'Start Menu',
  'Templates', 'Favorites', 'DeviceSync', 'Temp', 'Tmp', 'IIS', 'IIS Express', 'Intel', 'NVIDIA', 'NVIDIA Corporation', 'AMD',
  # Shared Microsoft components and install caches, and a fingerprint driver's data - offered on the P52 (2026-11-03)
  'MSECache', 'MSOCache', 'DESIGNER', 'Microsoft Shared', 'System', 'Services', 'SpeechEngines', 'InstallShield',
  'InstallShield Installation Information', 'Windows Live', 'Validity',
  'ATI Technologies', 'Realtek', 'Synaptics', 'Lenovo', 'Dell', 'HP', 'Hewlett-Packard', 'Thunderbolt', 'Conexant', 'Dolby',
  'Waves', 'Qualcomm', 'Broadcom', 'Killer Networking', 'Rivet Networks', 'Elantech', 'Alps', 'Bonjour', 'Apple', 'Google',
  'Mozilla', 'Oracle', 'Java', 'Git', 'nodejs', 'Python', 'WSL', 'windowsweep', 'com.aoneahsan.windowsweep'
)
# Words too common to tie a folder to one program: never used as a program's key name.
$Script:WS_LEFTOVER_STOPWORDS = @('corporation', 'corp', 'software', 'systems', 'system', 'technologies', 'technology', 'limited',
  'company', 'group', 'studio', 'studios', 'microsoft', 'windows', 'google', 'apps', 'tools', 'tool', 'program', 'programs', 'data',
  'update', 'updater', 'setup', 'desktop', 'free', 'easy', 'best', 'simple', 'smart', 'super', 'quick', 'total', 'advanced',
  'auto', 'mini', 'open', 'global', 'universal', 'portable', 'online', 'digital', 'power', 'master', 'magic', 'ultimate',
  'express', 'visual', 'version', 'edition', 'professional', 'enterprise', 'community', 'client', 'server', 'service',
  'services', 'helper', 'player', 'manager', 'runtime', 'driver', 'drivers', 'support', 'common', 'files', 'shared')

function Get-CommandPaths {
  <# .SYNOPSIS The absolute paths a registered command names - its program and any absolute path among its
     arguments - with environment variables expanded and the kernel forms (\SystemRoot\, \??\, system32\) resolved. #>
  param([string] $Text)
  $t = [Environment]::ExpandEnvironmentVariables(([string]$Text).Trim())
  if (-not $t) { return @() }
  $t = $t -replace '^\\\?\?\\', ''
  if ($t -match '^\\SystemRoot\\(.*)$') { $t = Join-Path $Script:P.SR $Matches[1] }
  elseif ($t -match '^(system32|syswow64)\\') { $t = Join-Path $Script:P.SR $t }
  $c = Split-CommandLine $t
  $out = @($c.FilePath)
  foreach ($m in [regex]::Matches([string]$c.Arguments, '"([A-Za-z]:\\[^"]+)"|(?<![^\s,=])([A-Za-z]:\\[^\s",]+)')) {
    $v = $m.Groups[1].Value
    if (-not $v) { $v = $m.Groups[2].Value }
    $out += $v
  }
  return @($out | Where-Object { $_ -match '^[A-Za-z]:\\' })
}

function Get-ShortcutTargets {
  <# .SYNOPSIS Targets of the Start Menu, desktop and pinned-taskbar shortcuts, for this user and all users. #>
  $dirs = @([Environment]::GetFolderPath('StartMenu'), [Environment]::GetFolderPath('CommonStartMenu'),
    [Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('CommonDesktopDirectory'),
    (Join-Path $Script:P.A 'Microsoft\Internet Explorer\Quick Launch'))
  $out = New-Object System.Collections.Generic.List[string]
  $shell = $null
  try { $shell = New-Object -ComObject WScript.Shell } catch { return @() }
  try {
    foreach ($d in $dirs) {
      if (-not $d -or -not (Test-DirPresent $d)) { continue }
      foreach ($f in @(Get-ChildItem -LiteralPath $d -Recurse -Filter '*.lnk' -File -ErrorAction SilentlyContinue | Select-Object -First 3000)) {
        try { $target = [string]$shell.CreateShortcut($f.FullName).TargetPath; if ($target) { $out.Add($target) } } catch { $null = $_ }
      }
    }
  } finally { try { $null = [Runtime.InteropServices.Marshal]::ReleaseComObject($shell) } catch { $null = $_ } }
  return $out.ToArray()
}

function Get-ComServerPaths {
  <# .SYNOPSIS Files registered COM servers and type libraries load (machine 64- and 32-bit, and this user). Office
     2007's add-in designer in Common Files\DESIGNER is registered only this way (P52, 2026-11-03). #>
  $out = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($v in @(@('LocalMachine', 'Registry64'), @('LocalMachine', 'Registry32'), @('CurrentUser', 'Default'))) {
    $base = $null
    try { $base = [Microsoft.Win32.RegistryKey]::OpenBaseKey([Microsoft.Win32.RegistryHive]$v[0], [Microsoft.Win32.RegistryView]$v[1]) } catch { continue }
    try {
      $clsid = $base.OpenSubKey('SOFTWARE\Classes\CLSID')
      if ($clsid) {
        foreach ($name in $clsid.GetSubKeyNames()) {
          foreach ($sub in 'InprocServer32', 'LocalServer32') {
            $k = $null
            try { $k = $clsid.OpenSubKey("$name\$sub") } catch { $k = $null }
            if ($k) { $val = [string]$k.GetValue(''); $k.Close(); if ($val) { $null = $out.Add($val) } }
          }
        }
        $clsid.Close()
      }
      $tl = $base.OpenSubKey('SOFTWARE\Classes\TypeLib')
      if ($tl) {
        foreach ($g in $tl.GetSubKeyNames()) {
          $gk = $null
          try { $gk = $tl.OpenSubKey($g) } catch { $gk = $null }
          if (-not $gk) { continue }
          foreach ($ver in $gk.GetSubKeyNames()) {
            foreach ($lcid in @(try { $gk.OpenSubKey($ver).GetSubKeyNames() } catch { @() })) {
              foreach ($plat in 'win32', 'win64') {
                $pk = $null
                try { $pk = $gk.OpenSubKey("$ver\$lcid\$plat") } catch { $pk = $null }
                if ($pk) { $val = [string]$pk.GetValue(''); $pk.Close(); if ($val) { $null = $out.Add($val) } }
              }
            }
          }
          $gk.Close()
        }
        $tl.Close()
      }
    } catch { $null = $_ } finally { $base.Close() }
  }
  return @($out)
}

function Expand-ShortPath {
  <# .SYNOPSIS C:\PROGRA~2\COMMON~1\x -> C:\Program Files (x86)\Common Files\x. COM registrations often store 8.3
     names; a claim must compare with the long path a folder is listed by. Unchanged when it cannot resolve. #>
  param([string] $Path)
  if ($Path -notmatch '~') { return $Path }
  $parts = $Path.Split('\')
  $cur = $parts[0] + '\'
  for ($i = 1; $i -lt $parts.Count; $i++) {
    $seg = $parts[$i]
    if (-not $seg) { continue }
    if ($seg.Contains('~')) {
      try { $hit = @(([IO.DirectoryInfo]$cur).GetFileSystemInfos($seg)); if ($hit.Count -eq 1) { $seg = $hit[0].Name } } catch { return $Path }
    }
    $cur = Join-Path $cur $seg
  }
  return $cur
}

function Get-LeftoverClaims {
  <# .SYNOPSIS What still claims a folder. Names: the installed-program index without the folders being judged.
     Paths: existing files and folders an uninstall entry, a service or driver, an environment variable (PATH
     included), a Run entry, a shortcut, a scheduled task or a running process names. #>
  param([string[]] $IgnorePaths = @())
  $index = Get-InstalledProgramIndex -IgnorePaths $IgnorePaths
  $raw = New-Object System.Collections.Generic.List[string]
  foreach ($r in $index.Rows) {
    if ($r.InstallLocation) { $raw.Add(([string]$r.InstallLocation).Trim().Trim('"')) }
    foreach ($s in @($r.UninstallString, $r.QuietUninstallString)) { if ($s) { foreach ($x in (Get-CommandPaths $s)) { $raw.Add($x) } } }
  }
  foreach ($cls in 'Win32_Service', 'Win32_SystemDriver') {
    try { foreach ($s in @(Get-CimInstance $cls -Property PathName -ErrorAction Stop)) { foreach ($x in (Get-CommandPaths ([string]$s.PathName))) { $raw.Add($x) } } } catch { $null = $_ }
  }
  foreach ($scope in 'Machine', 'User') {
    try {
      $vars = [Environment]::GetEnvironmentVariables($scope)
      foreach ($k in @($vars.Keys)) {
        foreach ($part in ([string]$vars[$k] -split ';')) { $v = [Environment]::ExpandEnvironmentVariables($part.Trim().Trim('"')); if ($v -match '^[A-Za-z]:\\') { $raw.Add($v) } }
      }
    } catch { $null = $_ }
  }
  foreach ($key in @('HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run', 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce',
      'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run', 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run',
      'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce')) {
    try {
      $item = Get-ItemProperty -LiteralPath $key -ErrorAction Stop
      foreach ($prop in $item.PSObject.Properties) { if ($prop.Name -notlike 'PS*') { foreach ($x in (Get-CommandPaths ([string]$prop.Value))) { $raw.Add($x) } } }
    } catch { $null = $_ }
  }
  foreach ($x in (Get-ShortcutTargets)) { $raw.Add($x) }
  foreach ($x in (Get-ComServerPaths)) { foreach ($y in (Get-CommandPaths $x)) { $raw.Add($y) } }
  try {
    foreach ($task in @(Get-ScheduledTask -ErrorAction Stop)) {
      foreach ($a in @($task.Actions)) {
        if ($a.Execute) { foreach ($x in (Get-CommandPaths ('"' + ([string]$a.Execute).Trim('"') + '" ' + [string]$a.Arguments))) { $raw.Add($x) } }
      }
    }
  } catch { $null = $_ }
  try {
    foreach ($proc in @(Get-CimInstance Win32_Process -Property ExecutablePath, CommandLine -ErrorAction Stop)) {
      if ($proc.ExecutablePath) { $raw.Add([string]$proc.ExecutablePath) }
      if ($proc.CommandLine) { foreach ($x in (Get-CommandPaths ([string]$proc.CommandLine))) { $raw.Add($x) } }
    }
  } catch { $null = $_ }
  $set = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($r in $raw) {
    $f = ''
    try { $f = Expand-ShortPath (Get-FullPath $r) } catch { $f = '' }
    if ($f -and -not $set.Contains($f) -and (Test-Path -LiteralPath $f)) { $null = $set.Add($f) }
  }
  return [pscustomobject]@{ Tokens = $index.Tokens; RegistryCount = $index.RegistryCount; Rows = $index.Rows; Paths = @($set) }
}

function Test-LeftoverClaimed {
  <# .SYNOPSIS Why a folder still belongs to something, or $null when nothing claims it. #>
  param([string] $Path, [pscustomobject] $Claims)
  if (-not (Test-OrphanFolderName -Name (Split-Path -Leaf $Path) -Index $Claims)) { return 'its name belongs to an installed program' }
  $prefix = $Path.TrimEnd('\') + '\'
  foreach ($c in $Claims.Paths) {
    if ($c.Equals($Path, [StringComparison]::OrdinalIgnoreCase) -or $c.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) { return "still in use: $c" }
  }
  return $null
}

function Get-LeftoverRoots {
  <# .SYNOPSIS Where uninstalled programs leave folders. -WithAppData adds Roaming and Local - for section 26's
     pass right after an uninstall only; section 23 owns them otherwise. #>
  param([switch] $WithAppData)
  $P = $Script:P
  $roots = @($P.PF, $P.PF86, (Join-Path $P.PF 'Common Files'), (Join-Path $P.PF86 'Common Files'), $P.PD, (Join-Path $P.L 'Programs'))
  if ($WithAppData) { $roots += @($P.A, $P.L) }
  $seen = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  return @($roots | Where-Object { $_ -and (Test-DirPresent $_) -and $seen.Add($_) })
}

function Get-ProgramKeyTokens {
  <# .SYNOPSIS The names a program's leftover folders carry: the first word of its name and of its publisher, its
     whole name and its install folder's name - 4+ characters, with a letter, never a common word. #>
  param([pscustomobject] $Program)
  $set = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
  $texts = @()
  foreach ($text in @($Program.DisplayName, $Program.Publisher)) {
    $words = @(([string]$text) -split '[^A-Za-z0-9]+' | Where-Object { $_ })
    if ($words.Count -gt 0) { $texts += $words[0] }
    $texts += [string]$text
  }
  $loc = ([string]$Program.InstallLocation).Trim().Trim('"').TrimEnd('\')
  if ($loc) { $texts += (Split-Path -Leaf $loc) }
  foreach ($x in $texts) {
    $t = ConvertTo-MatchToken $x
    if ($t.Length -ge 4 -and $t -match '[a-z]' -and $Script:WS_LEFTOVER_STOPWORDS -notcontains $t) { $null = $set.Add($t) }
  }
  return , $set
}

function Test-NameMatchesTokens {
  <# .SYNOPSIS A folder named exactly like a key name or starting with one ("SteamLibrary" for "steam"); for a
     reverse-DNS name, any segment after the first. #>
  param([string] $Name, [System.Collections.Generic.HashSet[string]] $Tokens)
  $names = @($Name)
  if ($Name -match '^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+){2,}$') { $names += @($Name.Split('.') | Select-Object -Skip 1) }
  foreach ($nm in $names) {
    $n = ConvertTo-MatchToken $nm
    if ($n.Length -lt 4) { continue }
    foreach ($t in $Tokens) { if ($n -eq $t -or $n.StartsWith($t)) { return $true } }
  }
  return $false
}

function New-NeverSet {
  $set = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($n in @($Script:WS_LEFTOVER_NEVER + $Script:WS_ORPHAN_EXCLUDE)) { $null = $set.Add($n) }
  return , $set
}

function Find-ProgramLeftovers {
  <# .SYNOPSIS Section 26, after an uninstall: the removed programs' install folders, and folders in the leftover
     roots and AppData named like them. Rows carry Reason = $null to offer, else why the folder stays. Fails
     closed. -Roots and -Claims are for the self-test. #>
  param([pscustomobject[]] $Programs, [string[]] $Roots = @(), [pscustomobject] $Claims = $null)
  if ($Roots.Count -eq 0) { $Roots = @(Get-LeftoverRoots -WithAppData) }
  $tokens = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
  foreach ($prog in @($Programs)) { foreach ($t in (Get-ProgramKeyTokens $prog)) { $null = $tokens.Add($t) } }
  $never = New-NeverSet
  $cand = New-Object System.Collections.Generic.List[object]
  $seen = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($prog in @($Programs)) {
    $loc = ([string]$prog.InstallLocation).Trim().Trim('"').TrimEnd('\')
    if (-not $loc -or -not (Test-DirPresent $loc)) { continue }
    $full = Get-FullPath $loc
    if ($seen.Add($full)) { $cand.Add([pscustomobject]@{ Path = $full; Root = (Split-Path -Parent $full); Program = $prog.DisplayName; Reason = $null; Idle = -1; Bytes = [long]0 }) }
  }
  foreach ($root in $Roots) {
    if ($tokens.Count -eq 0 -or -not $root -or -not (Test-DirPresent $root)) { continue }
    foreach ($e in (Get-ChildEntries $root)) {
      if (-not ($e -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $e) -or $never.Contains($e.Name)) { continue }
      if (-not (Test-NameMatchesTokens -Name $e.Name -Tokens $tokens)) { continue }
      $full = Remove-LongPrefix $e.FullName
      if ($seen.Add($full)) { $cand.Add([pscustomobject]@{ Path = $full; Root = (Get-FullPath $root); Program = ''; Reason = $null; Idle = -1; Bytes = [long]0 }) }
    }
  }
  if ($cand.Count -eq 0) { return @() }
  if ($null -eq $Claims) { $Claims = Get-LeftoverClaims -IgnorePaths @($cand | ForEach-Object { $_.Path }) }
  if ($Claims.RegistryCount -eq 0) { Write-Warn 'no uninstall entries could be read: no folder is offered (fail closed)'; return @() }
  foreach ($c in $cand) {
    $why = Get-ProtectionReason $c.Path
    if (-not $why) { $why = Test-LeftoverClaimed -Path $c.Path -Claims $Claims }
    $c.Reason = $why
    # Sized only when offered: a registered install folder can be a protected root such as Program Files.
    if (-not $why) { $c.Bytes = [long](Get-DirectoryBytes $c.Path) }
  }
  return $cand.ToArray()   # @() around a List[object] throws "Argument types do not match" in PS 5.1
}

function Find-MachineLeftovers {
  <# .SYNOPSIS Section 27: top-level folders in the leftover roots that nothing claims, idle -Days or more. Rows
     carry Reason = $null to offer, else why the folder is only reported. Fails closed. #>
  param([int] $Days, [string[]] $Roots = @(), [pscustomobject] $Claims = $null)
  if ($Roots.Count -eq 0) { $Roots = @(Get-LeftoverRoots) }
  $never = New-NeverSet
  $cand = New-Object System.Collections.Generic.List[object]
  foreach ($root in $Roots) {
    if (-not $root -or -not (Test-DirPresent $root)) { continue }
    foreach ($e in (Get-ChildEntries $root)) {
      if (-not ($e -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $e) -or $never.Contains($e.Name)) { continue }
      $cand.Add([pscustomobject]@{ Path = (Remove-LongPrefix $e.FullName); Root = (Get-FullPath $root); Program = ''; Reason = $null; Idle = 0; Bytes = [long]0 })
    }
  }
  if ($cand.Count -eq 0) { return @() }
  if ($null -eq $Claims) { $Claims = Get-LeftoverClaims -IgnorePaths @($cand | ForEach-Object { $_.Path }) }
  if ($Claims.RegistryCount -eq 0) { Write-Warn 'no uninstall entries could be read: no folder is offered (fail closed)'; return @() }
  Write-Note "cross-checked against $($Claims.RegistryCount) installed-program entries and $(@($Claims.Paths).Count) paths still in use"
  $out = @()
  foreach ($c in $cand) {
    if (Test-LeftoverClaimed -Path $c.Path -Claims $Claims) { continue }
    $c.Idle = Get-IdleDays $c.Path
    if ($c.Idle -lt $Days) { continue }
    $c.Reason = Get-ProtectionReason $c.Path
    $c.Bytes = [long](Get-DirectoryBytes $c.Path)
    $out += $c
  }
  return @($out | Sort-Object Bytes -Descending | Select-Object -First 200)
}

function Invoke-LeftoverChoice {
  <# .SYNOPSIS Report the rows that stay, list the rest, and let a person pick folders for the Recycle Bin.
     -PathsOrConsoleOnly (section 26's second prompt): only --select-file paths or a console answer pick here - a
     queued --select list belongs to a later prompt and is left for it. #>
  param([object[]] $Rows, [int] $Section, [switch] $PathsOrConsoleOnly)
  $ws = $Script:WS
  foreach ($r in @($Rows | Where-Object { $_.Reason })) { Write-Note ("kept: {0}  ({1})" -f $r.Path, $r.Reason) }
  $offer = @($Rows | Where-Object { -not $_.Reason })
  if ($offer.Count -eq 0) { Write-Info 'no leftover folder can be offered'; return }
  Write-UiLine ("  {0,3}  {1,10} {2,6}  {3}" -f '#', 'SIZE', 'IDLE', 'FOLDER') 'White'
  $i = 1; $total = [long]0
  foreach ($r in $offer) {
    $idle = '-'
    if ($r.Idle -ge 0) { $idle = "$($r.Idle)d" }
    Write-UiLine ("  {0,3}  {1,10} {2,6}  {3}" -f $i, (Format-Bytes $r.Bytes), $idle, $r.Path) 'Gray'
    $label = ''
    if ($Section -eq 26) { $label = 'leftover'; if ($r.Program) { $label = "leftover: $($r.Program)" } }
    Add-JsonCandidate -Section $Section -Index $i -Path $r.Path -Bytes $r.Bytes -IdleDays $r.Idle -Label $label
    $total += $r.Bytes; $i++
  }
  Write-Info ('total: ' + (Format-Bytes $total))
  $dest = 'the Recycle Bin'
  if ($ws.Permanent) { $dest = 'PERMANENT deletion (--permanent)' }
  Write-Note "selected folders go to $dest"
  $saved = $ws.SelectQueue
  if ($PathsOrConsoleOnly) { $ws.SelectQueue = @() }
  try { $picks = @(Read-MultiSelect -Total $offer.Count -NoAutoYes -Candidates @($offer | ForEach-Object { $_.Path })) } finally { if ($PathsOrConsoleOnly) { $ws.SelectQueue = $saved } }
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  if (-not $ws.DryRun) {
    if (-not (Confirm-Ui -Prompt "Move $($picks.Count) folder(s) to $dest ?" -Default 'n' -NoAutoYes -ScriptedOk)) { Write-Info 'skipped'; return }
  }
  foreach ($k in $picks) { $null = Send-ToRecycleBin -Path $offer[$k - 1].Path -Within $offer[$k - 1].Root }
}

function Get-DeadPathEntries {
  <# .SYNOPSIS PATH entries and path-valued environment variables (machine and user) naming something that no
     longer exists. Report only. #>
  $out = @()
  foreach ($scope in 'Machine', 'User') {
    $vars = $null
    try { $vars = [Environment]::GetEnvironmentVariables($scope) } catch { continue }
    foreach ($k in @($vars.Keys | Sort-Object)) {
      foreach ($part in @([string]$vars[$k] -split ';' | Where-Object { $_.Trim() })) {
        $v = [Environment]::ExpandEnvironmentVariables($part.Trim().Trim('"'))
        if ($v -match '^[A-Za-z]:\\' -and -not (Test-Path -LiteralPath $v)) { $out += [pscustomobject]@{ Scope = $scope; Name = [string]$k; Value = $v } }
      }
    }
  }
  return $out
}

function Get-Targets27 {
  $P = $Script:P
  return @(
    (New-Target 27 'Leftover program folders' "$($P.PF) | $($P.PF86) | Common Files | $($P.PD)" -Kind cmd -Note 'you pick; idle --days; nothing installed, registered or running uses them'),
    (New-Target 27 'Leftover registry keys, shortcuts, startup entries and tasks' 'HKCU\Software | HKLM\SOFTWARE | Start menu | Run keys | Task Scheduler' -Kind cmd -Note 'you pick; .reg or XML backup first; shortcuts to the Recycle Bin')
  )
}

function Invoke-Section27 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Uninstallers often leave things behind. First the top-level folders in Program Files, Common Files and',
    'ProgramData that no installed program, service, driver, PATH entry, shortcut, task or running process uses',
    "and that nothing has touched for $($ws.Days)+ days (they go to the Recycle Bin). Then registry keys of programs",
    'windowsweep removed earlier, and Start-menu shortcuts, startup entries and scheduled tasks whose file is gone:',
    'registry entries are exported to a .reg file and tasks saved as XML before they go. You pick every row.'
  )
  $gone = @(Get-RemovedHistoryPrograms)
  $rows = @(Find-MachineLeftovers -Days $ws.Days)
  if ($gone.Count -gt 0) {
    # Programs windowsweep removed earlier: their folders are known leftovers, offered without the idle wait.
    $seen = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
    foreach ($r in $rows) { $null = $seen.Add($r.Path) }
    foreach ($r in @(Find-ProgramLeftovers -Programs $gone)) { if ($seen.Add($r.Path)) { $rows += $r } }
  }
  Invoke-LeftoverChoice -Rows $rows -Section 27
  Write-Section 'Registry keys, shortcuts, startup entries and tasks left behind'
  Invoke-ExtraLeftoverChoice -Rows @(Find-EarlierRemovalExtras -Gone $gone) -Section 27
  $dead = @(Get-DeadPathEntries)
  if ($dead.Count -eq 0) { return }
  Write-Section 'Environment entries naming something that no longer exists (report only)'
  foreach ($d in $dead) { Write-UiLine ("  {0,-7} {1,-24} {2}" -f $d.Scope, $d.Name, $d.Value) 'Gray' }
  Write-Note 'remove them in System Properties > Environment Variables once the tool they belonged to is gone'
}
