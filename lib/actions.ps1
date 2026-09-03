# actions.ps1 - the target-list engine every section drives, plus shared cache-layout helpers.
# A section is mostly a declaration: New-Target rows (path + mode + guards) run by Invoke-TargetList.

$Script:WS_CHROMIUM_PROFILE_CACHES = @('Cache', 'Code Cache', 'GPUCache', 'DawnCache', 'DawnGraphiteCache', 'DawnWebGPUCache', 'GrShaderCache', 'ShaderCache', 'Service Worker\ScriptCache')
$Script:WS_CHROMIUM_ROOT_CACHES = @('ShaderCache', 'GrShaderCache', 'GraphiteDawnCache', 'Crashpad\completed', 'Crashpad\reports', 'SwReporter')
$Script:WS_ELECTRON_CACHES = @('Cache', 'Code Cache', 'GPUCache', 'DawnCache', 'DawnGraphiteCache', 'DawnWebGPUCache', 'GrShaderCache', 'ShaderCache', 'Service Worker\CacheStorage', 'Service Worker\ScriptCache', 'Crashpad\completed', 'Crashpad\reports')
$Script:WS_EDITOR_CACHES = @('Cache', 'CachedData', 'CachedProfilesData', 'Code Cache', 'GPUCache', 'DawnCache', 'DawnGraphiteCache', 'DawnWebGPUCache', 'Service Worker\CacheStorage', 'Service Worker\ScriptCache', 'Crashpad\completed', 'Crashpad\reports')
$Script:WS_FIREFOX_CACHES = @('cache2', 'startupCache', 'thumbnails', 'jumpListCache', 'OfflineCache', 'shader-cache')

function Get-ChromiumProfileDirs {
  <# .SYNOPSIS Profile folders of a Chromium "User Data" root. A root that itself holds Cache is its own profile (Opera, Electron). #>
  param([string] $Root)
  $out = @()
  if (-not (Test-DirPresent $Root)) { return $out }
  foreach ($e in (Get-ChildEntries $Root)) {
    if (-not ($e -is [IO.DirectoryInfo])) { continue }
    if ($e.Name -match '^(Default|Profile \d+|Guest Profile|System Profile)$') { $out += (Remove-LongPrefix $e.FullName) }
  }
  if ($out.Count -eq 0 -and (Test-DirPresent (Join-Path $Root 'Cache'))) { $out += (Get-FullPath $Root) }
  return $out
}

function Get-ChromiumCacheDirs {
  <# .SYNOPSIS Existing regenerable cache folders under a Chromium root (per profile + root-level). Never profile data. #>
  param([string] $Root)
  $out = @()
  foreach ($prof in (Get-ChromiumProfileDirs $Root)) {
    foreach ($sub in $Script:WS_CHROMIUM_PROFILE_CACHES) { $p = Join-Path $prof $sub; if (Test-DirPresent $p) { $out += $p } }
  }
  foreach ($sub in $Script:WS_CHROMIUM_ROOT_CACHES) { $p = Join-Path $Root $sub; if (Test-DirPresent $p) { $out += $p } }
  return @($out | Select-Object -Unique)
}

function Get-FirefoxCacheDirs {
  param([string] $ProfilesRoot)
  $out = @()
  if (-not (Test-DirPresent $ProfilesRoot)) { return $out }
  foreach ($prof in (Get-ChildEntries $ProfilesRoot)) {
    if (-not ($prof -is [IO.DirectoryInfo])) { continue }
    foreach ($sub in $Script:WS_FIREFOX_CACHES) { $p = Join-Path (Remove-LongPrefix $prof.FullName) $sub; if (Test-DirPresent $p) { $out += $p } }
  }
  return $out
}

function Get-SubdirCacheDirs {
  param([string] $Root, [string[]] $Subdirs)
  $out = @()
  if (-not (Test-DirPresent $Root)) { return $out }
  foreach ($sub in $Subdirs) { $p = Join-Path $Root $sub; if (Test-DirPresent $p) { $out += $p } }
  return $out
}

function Get-TargetCachePaths {
  <# .SYNOPSIS Concrete cache folders for the layout kinds (chromium | firefox | electron | editor). #>
  param([pscustomobject] $Target)
  $roots = @()
  if ($Target.Path -match '[\*\?]') {
    try { $roots = @(Get-Item -Path $Target.Path -Force -ErrorAction SilentlyContinue | Where-Object { $_ -is [IO.DirectoryInfo] } | ForEach-Object { $_.FullName }) } catch { $roots = @() }
  } elseif (Test-DirPresent $Target.Path) { $roots = @((Get-FullPath $Target.Path)) }
  $out = @()
  foreach ($r in $roots) {
    switch ($Target.Kind) {
      'chromium' { $out += Get-ChromiumCacheDirs $r }
      'firefox' { $out += Get-FirefoxCacheDirs $r }
      'electron' { $out += Get-SubdirCacheDirs -Root $r -Subdirs $Script:WS_ELECTRON_CACHES }
      'editor' { $out += Get-SubdirCacheDirs -Root $r -Subdirs $Script:WS_EDITOR_CACHES }
    }
  }
  return @($out)
}

function Show-TargetSizes {
  <# .SYNOPSIS Table of the given targets with their current size on disk. Returns total bytes. Skipped when --quiet. #>
  param([pscustomobject[]] $Targets)
  $total = [long]0
  if ($Script:WS.Quiet) { return $total }
  Write-UiLine ("  {0,-44} {1,10}  {2}" -f 'TARGET', 'ON DISK', 'PATH') 'White'
  foreach ($t in $Targets) {
    if ($t.Kind -eq 'cmd') { Write-UiLine ("  {0,-44} {1,10}  {2}" -f $t.Label, '(cmd)', $t.Path) 'DarkGray'; continue }
    $paths = @(Resolve-TargetPaths $t)
    if ($paths.Count -eq 0) { Write-UiLine ("  {0,-44} {1,10}  {2}" -f $t.Label, 'absent', $t.Path) 'DarkGray'; continue }
    $bytes = [long]0
    foreach ($p in $paths) { $bytes += Get-DirectoryBytes $p }
    $total += $bytes
    $shown = $t.Path
    if ($paths.Count -gt 1) { $shown = "$($t.Path)  ($($paths.Count) folders)" }
    Write-UiLine ("  {0,-44} {1,10}  {2}" -f $t.Label, (Format-Bytes $bytes), $shown) 'Gray'
  }
  Write-UiLine ("  {0,-44} {1,10}" -f 'on disk now', (Format-Bytes $total)) 'Cyan'
  return $total
}

function Confirm-Section {
  <# .SYNOPSIS One confirmation per section. Dry-run needs none; the walkthrough's step prompt counts as one. #>
  param([string] $Prompt = 'Proceed with this section?', [string] $Default = 'y')
  $ws = $Script:WS
  if ($ws.DryRun) { Write-Note '[dry-run] estimating only - nothing is deleted'; return $true }
  if ($ws.SectionPreConfirmed) { return $true }
  return (Confirm-Ui -Prompt $Prompt -Default $Default)
}

function Invoke-TargetList {
  <# .SYNOPSIS Run every target with its mode under the dry-run, developer, purge and running-app policies. Returns bytes freed/estimated. #>
  param([pscustomobject[]] $Targets)
  $ws = $Script:WS
  $total = [long]0
  foreach ($t in $Targets) {
    if ($t.Kind -eq 'cmd') { continue }
    $paths = @(Resolve-TargetPaths $t)
    if ($paths.Count -eq 0) { Write-Info "$($t.Label) - absent"; continue }
    if (@($t.Guard).Count -gt 0 -and (Test-ProcessRunning $t.Guard)) {
      Write-Warn "$($t.Label) - skipped: $($t.Guard[0]) is running (close it and run this section again)"
      $ws.Hints += "Close $($t.Guard[0]) and re-run:  windowsweep --only $($t.Section) --yes   (to clear $($t.Label))"
      continue
    }
    $mode = $t.Mode
    if ($t.Kind -in 'chromium', 'firefox', 'electron', 'editor') {
      $mode = 'clear'
      # Second guard: a layout target may only ever clear a known cache folder, never a profile or app root.
      $known = @($Script:WS_CHROMIUM_PROFILE_CACHES + $Script:WS_CHROMIUM_ROOT_CACHES + $Script:WS_ELECTRON_CACHES + $Script:WS_EDITOR_CACHES + $Script:WS_FIREFOX_CACHES | ForEach-Object { [IO.Path]::GetFileName($_) })
      $paths = @($paths | Where-Object {
          $leaf = [IO.Path]::GetFileName($_)
          if ($known -contains $leaf) { $true } else { Write-Err "REFUSE (not a known cache folder for a $($t.Kind) layout): $_"; $false }
        })
    }
    if ($ws.PurgeAll -and $mode -in 'prune', 'units') { $mode = 'clear' }
    if ($t.Dev -and $ws.Developer -eq $false -and $mode -in 'prune', 'units') { $mode = 'clear' }
    $days = $t.Days
    if ($days -le 0) { $days = $ws.Days }
    # A target that resolves to several folders (every browser profile, every cache name) labels each result
    # line with "parent\leaf", so ten "VS Code caches - cleared ..." lines become ten distinguishable ones.
    $multi = ($paths.Count -gt 1)
    foreach ($p in $paths) {
      $label = "$($t.Label)"
      if ($multi) { $label = "$($t.Label) [$(Split-Path -Leaf (Split-Path -Parent $p))\$([IO.Path]::GetFileName($p))]" }
      switch ($mode) {
        'clear' { $r = Clear-DirectoryContents -Path $p -Within $p -Label $label; $total += $r.Freed }
        'clear-old' { $r = Clear-DirectoryContents -Path $p -Within $p -Label $label -OlderThanDays $days; $total += $r.Freed }
        'prune' { $r = Remove-StaleFiles -Root $p -Within $p -Days $days -Label $label; $total += $r.Freed }
        'units' { $r = Remove-StaleUnits -Root $p -Within $p -Days $days -KeepNewest:$t.KeepNewest -DirectoriesOnly -GroupBy $t.GroupBy -ExcludeNames $t.ExcludeNames -Label $label; $total += $r.Freed }
        'file' {
          $r = Remove-PathSafe -Path $p -Within (Split-Path -Parent $p) -Label "$($t.Label)"
          if ($r.Removed -and -not $ws.DryRun -and $r.Bytes -gt 0) { Write-Ok ("$($t.Label) - removed " + (Format-Bytes $r.Bytes)) }
          $total += $r.Bytes
        }
        default { Write-Warn "$($t.Label) - unknown mode '$mode'" }
      }
    }
  }
  return $total
}

function Remove-SupersededVersions {
  <# .SYNOPSIS Squirrel-style installs keep old app-x.y.z folders beside the current one; remove all but the highest version. #>
  param([string] $Root, [string] $Prefix = 'app-', [string[]] $Guard = @(), [string] $Label = '')
  if (-not (Test-DirPresent $Root)) { return [long]0 }
  if ($Guard.Count -gt 0 -and (Test-ProcessRunning $Guard)) { Write-Warn "$Label - superseded versions skipped: $($Guard[0]) is running"; return [long]0 }
  $versions = @()
  foreach ($e in (Get-ChildEntries $Root)) {
    if (-not ($e -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $e)) { continue }
    if ($e.Name -like "$Prefix*") {
      $v = $null
      try { $v = [version]($e.Name.Substring($Prefix.Length) -replace '[^0-9.].*$', '') } catch { $v = $null }
      if ($v) { $versions += [pscustomobject]@{ Name = $e.Name; Path = (Remove-LongPrefix $e.FullName); Version = $v } }
    }
  }
  if ($versions.Count -lt 2) { return [long]0 }
  $newest = $versions | Sort-Object Version -Descending | Select-Object -First 1
  $freed = [long]0
  foreach ($v in $versions) {
    if ($v.Path -eq $newest.Path) { Write-Note "kept  $($v.Name)  (current version)"; continue }
    $r = Remove-PathSafe -Path $v.Path -Within $Root -Label $Label
    if ($r.Removed) { $freed += $r.Bytes; if (-not $Script:WS.DryRun) { Write-Ok ("$Label - removed superseded $($v.Name) (" + (Format-Bytes $r.Bytes) + ')') } }
  }
  return $freed
}

function ConvertFrom-SizeText {
  <# .SYNOPSIS "2.891GB" / "12.5 MB" / "20.48kB" -> bytes (docker prints decimal units). #>
  param([string] $Text)
  if ($Text -match '([\d.]+)\s*(B|kB|KB|MB|GB|TB)') {
    $n = [double]$Matches[1]
    switch ($Matches[2]) { 'kB' { return [long]($n * 1000) } 'KB' { return [long]($n * 1000) } 'MB' { return [long]($n * 1e6) } 'GB' { return [long]($n * 1e9) } 'TB' { return [long]($n * 1e12) } default { return [long]$n } }
  }
  return [long]0
}

function Get-NpmCacheDir {
  $fallback = Join-Path $Script:P.L 'npm-cache'
  if (-not (Test-CommandPresent 'npm')) { return $fallback }
  try {
    $out = & npm config get cache 2>$null
    $line = ($out | Select-Object -Last 1)
    if ($line -and (Test-DirPresent $line.Trim())) { return (Get-FullPath $line.Trim()) }
  } catch { $null = $_ }
  return $fallback
}

function Write-SectionIntro {
  <# .SYNOPSIS Print what a section does and the current strategy line. #>
  param([string[]] $Lines, [bool] $Dev = $false)
  $ws = $Script:WS
  foreach ($l in $Lines) { Write-Plain "  $l" }
  if ($Dev) {
    if ($ws.PurgeAll) { Write-Warn 'strategy: FULL PURGE (--purge-all) - every cache target is emptied, including recently used files' }
    elseif ($ws.Developer -eq $false) { Write-Info 'strategy: developer mode OFF - these caches are cleared completely' }
    else { Write-Info "strategy: developer mode ON - only files idle $($ws.Days)+ days go; the newest version of each tool cache is kept" }
  }
}
