# editors.ps1 - section 6: editor caches, stale workspace storage, superseded extension versions.

$Script:WS_EDITORS = @(
  @{ Name = 'VS Code'; Root = 'Code'; Ext = '.vscode'; Proc = @('Code') }
  @{ Name = 'VS Code Insiders'; Root = 'Code - Insiders'; Ext = '.vscode-insiders'; Proc = @('Code - Insiders') }
  @{ Name = 'VSCodium'; Root = 'VSCodium'; Ext = '.vscode-oss'; Proc = @('VSCodium') }
  @{ Name = 'Cursor'; Root = 'Cursor'; Ext = '.cursor'; Proc = @('Cursor') }
  @{ Name = 'Windsurf'; Root = 'Windsurf'; Ext = '.windsurf'; Proc = @('Windsurf') }
)

function Get-Targets06 {
  $P = $Script:P
  $t = @()
  foreach ($e in $Script:WS_EDITORS) {
    $root = Join-Path $P.A $e.Root
    $t += (New-Target 6 "$($e.Name) caches" $root -Kind editor -Guard $e.Proc -Note 'Cache, CachedData, Code Cache, GPUCache, crash reports; skipped while the editor runs')
    $t += (New-Target 6 "$($e.Name) VSIX download cache" (Join-Path $root 'CachedExtensionVSIXs') -Mode clear -Note 'extension installers already unpacked; safe while the editor runs')
    $t += (New-Target 6 "$($e.Name) logs" (Join-Path $root 'logs') -Mode clear-old -Days 7)
    $t += (New-Target 6 "$($e.Name) stale workspace storage" (Join-Path $root 'User\workspaceStorage') -Kind cmd -Guard $e.Proc -Note 'entries whose folder no longer exists')
    $t += (New-Target 6 "$($e.Name) superseded extension versions" (Join-Path $P.U "$($e.Ext)\extensions") -Kind cmd -Guard $e.Proc -Note 'older versions and .obsolete entries; newest kept')
  }
  $t += (New-Target 6 'Visual Studio ComponentModelCache' "$($P.L)\Microsoft\VisualStudio\*\ComponentModelCache" -Kind glob -Mode clear -Guard @('devenv'))
  $t += (New-Target 6 'Visual Studio designer shadow cache' "$($P.L)\Microsoft\VisualStudio\*\Designer\ShadowCache" -Kind glob -Mode clear -Guard @('devenv'))
  $t += (New-Target 6 'Visual Studio telemetry (AppInsights)' "$($P.L)\Microsoft\VSApplicationInsights" -Mode clear)
  $t += (New-Target 6 'Visual Studio SQM logs' "$($P.L)\Microsoft\VSCommon\*\SQM" -Kind glob -Mode clear)
  return $t
}

function Remove-StaleWorkspaceStorage {
  <# .SYNOPSIS workspaceStorage entries pointing at a folder/workspace file that no longer exists. #>
  param([string] $Root, [string] $Label)
  if (-not (Test-DirPresent $Root)) { return }
  $stale = @()
  foreach ($e in (Get-ChildEntries $Root)) {
    if (-not ($e -is [IO.DirectoryInfo])) { continue }
    $json = Join-Path (Remove-LongPrefix $e.FullName) 'workspace.json'
    if (-not (Test-PathPresent $json)) { continue }
    try {
      $w = Get-Content -LiteralPath $json -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
      $uri = $w.folder
      if (-not $uri) { $uri = $w.workspace }
      if (-not $uri -or $uri -notmatch '^file:///') { continue }
      $local = [Uri]::UnescapeDataString(($uri -replace '^file:///', '')) -replace '/', '\'
      if (-not (Test-PathPresent $local)) { $stale += [pscustomobject]@{ Path = (Remove-LongPrefix $e.FullName); Target = $local } }
    } catch { $null = $_ }
  }
  if ($stale.Count -eq 0) { Write-Info "$Label - none stale"; return }
  Write-Info "$Label - $($stale.Count) entries point at folders that no longer exist:"
  foreach ($s in $stale) { Write-Note "  $($s.Target)" }
  foreach ($s in $stale) { $null = Remove-PathSafe -Path $s.Path -Within $Root -Label $Label }
  if (-not $Script:WS.DryRun) { Write-Ok "$Label - removed $($stale.Count) stale entries" }
}

function Read-JsonFile {
  <# .SYNOPSIS Parse a JSON file. A top-level array always comes back as an array (PowerShell 5.1's ConvertFrom-Json
     emits an array as ONE pipeline object, which silently turns 16 entries into a single bogus one when wrapped). #>
  param([string] $Path)
  $parsed = Get-Content -LiteralPath $Path -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
  if ($parsed -is [array]) { return $parsed }
  return @($parsed)
}

function Get-SupersededExtensionPlan {
  <# .SYNOPSIS Decide which extension folders are leftovers. Pure logic (exercised by the self-test).
     A folder is a victim only when the editor's extensions.json does NOT reference it AND either the .obsolete marker
     names it or a different version of the same extension IS referenced. Without extensions.json: .obsolete entries
     plus every version older than the newest one present. #>
  param([string] $Root, [object[]] $Folders)
  $victims = @()
  $obsolete = @{}
  $obsFile = Join-Path $Root '.obsolete'
  if (Test-PathPresent $obsFile) {
    try { $o = Get-Content -LiteralPath $obsFile -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop; foreach ($p in $o.PSObject.Properties) { if ($p.Value) { $obsolete[$p.Name] = $true } } } catch { $null = $_ }
  }
  $installed = $null
  $manifest = Join-Path $Root 'extensions.json'
  if (Test-PathPresent $manifest) {
    try {
      $installed = @{}
      foreach ($entry in (Read-JsonFile $manifest)) {
        $loc = $entry.relativeLocation
        if ($loc -is [string] -and $loc) { $installed[$loc] = $true }
      }
    } catch { $installed = $null }
  }
  if ($null -ne $installed -and $installed.Count -gt 0) {
    $installedIds = @{}
    foreach ($f in $Folders) { if ($installed.ContainsKey($f.Name)) { $installedIds[$f.Id] = $true } }
    foreach ($f in $Folders) {
      if ($installed.ContainsKey($f.Name)) { continue }
      if ($obsolete.ContainsKey($f.Name) -or $installedIds.ContainsKey($f.Id)) { $victims += $f }
    }
    $note = "extensions.json lists $($installed.Count) installed extension(s); $($victims.Count) leftover folder(s)"
  } else {
    foreach ($group in @($Folders | Where-Object { -not $obsolete.ContainsKey($_.Name) } | Group-Object Id)) {
      if ($group.Count -lt 2) { continue }
      $newest = $group.Group | Sort-Object Version -Descending | Select-Object -First 1
      foreach ($v in $group.Group) { if ($v.Path -ne $newest.Path) { $victims += $v } }
    }
    foreach ($f in $Folders) { if ($obsolete.ContainsKey($f.Name)) { $victims += $f } }
    $note = "no extensions.json; using .obsolete + newest-version rule: $($victims.Count) leftover folder(s)"
  }
  return [pscustomobject]@{ Victims = @($victims); Note = $note }
}

function Remove-SupersededExtensions {
  <# .SYNOPSIS Extension folders the editor no longer uses.
     The editor's own extensions.json is the source of truth: every versioned folder it does not reference is a leftover
     (uninstalled, or superseded by the version it does reference). Without that file, fall back to the .obsolete marker
     plus keep-the-newest-version-per-extension. #>
  param([string] $Root, [string] $Label)
  if (-not (Test-DirPresent $Root)) { return }
  $folders = @()
  foreach ($e in @(Get-ChildEntries $Root)) {
    if (-not ($e -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $e)) { continue }
    if ($e.Name -match '^(.+?)-(\d+\.\d+\.\d+)([^\\]*)$') {
      $ver = $null
      try { $ver = [version]$Matches[2] } catch { continue }
      $folders += [pscustomobject]@{ Name = $e.Name; Id = $Matches[1]; Path = (Remove-LongPrefix $e.FullName); Version = $ver }
    }
  }
  if ($folders.Count -eq 0) { Write-Info "$Label - none superseded"; return }
  $plan = Get-SupersededExtensionPlan -Root $Root -Folders $folders
  Write-Note "$Label - $($plan.Note)"
  $victims = @($plan.Victims)
  if ($victims.Count -eq 0) { Write-Info "$Label - none superseded"; return }
  foreach ($v in $victims) {
    $r = Remove-PathSafe -Path $v.Path -Within $Root -Label $Label
    if ($r.Removed -and -not $Script:WS.DryRun) { Write-Ok ("$Label - removed $($v.Name) (" + (Format-Bytes $r.Bytes) + ')') }
  }
}

function Invoke-Section06 {
  Write-SectionIntro @(
    'Editors rebuild their caches on the next start. Settings, keybindings, snippets, globalStorage and local',
    'History are protected. A running editor is left alone except for its VSIX download cache and old logs.'
  )
  $targets = Get-Targets06
  $null = Show-TargetSizes $targets
  if (-not (Confirm-Section 'Clean editor caches now?')) { Write-Info 'skipped'; return }
  $null = Invoke-TargetList @($targets | Where-Object { $_.Kind -ne 'cmd' })
  foreach ($e in $Script:WS_EDITORS) {
    $root = Join-Path $Script:P.A $e.Root
    $extRoot = Join-Path $Script:P.U "$($e.Ext)\extensions"
    if (-not (Test-DirPresent $root) -and -not (Test-DirPresent $extRoot)) { continue }
    if (Test-ProcessRunning $e.Proc) { Write-Warn "$($e.Name) is running - workspace storage and extension versions left alone"; continue }
    Remove-StaleWorkspaceStorage -Root (Join-Path $root 'User\workspaceStorage') -Label "$($e.Name) workspace storage"
    Remove-SupersededExtensions -Root $extRoot -Label "$($e.Name) extensions"
  }
}
