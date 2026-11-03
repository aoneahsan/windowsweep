# tool_releases.ps1 - section 28: superseded tool releases and downloaded updates; the running/current one is kept.
# Seen on the P52 (2026-11-02): 27 Codex releases (11 GB) beside one current junction, Electron updater installers
# left after the app that downloaded them was removed, an Ollama update download, and Node versions no project pins.
# ASCII only.

function ConvertTo-ReleaseVersion {
  <# .SYNOPSIS "0.166.0-x86_64-pc-windows-msvc" -> [version] 0.166.0; $null for any other folder shape. #>
  param([string] $Name)
  if ($Name -match '^(\d+)\.(\d+)\.(\d+)(-[A-Za-z0-9_.-]+)?$') { return [version]("{0}.{1}.{2}" -f $Matches[1], $Matches[2], $Matches[3]) }
  return $null
}

function Get-CodexReleasePlan {
  <# .SYNOPSIS Split Codex standalone releases into Keep and Drop. Kept: the `current` junction's target, every
     newer release (an update not switched to yet), the newest older one (rollback) and any folder that is not a
     plain version. Without a readable `current` link nothing is dropped (fail closed). -Root and -CurrentLink
     let the self-test plan a fixture. #>
  param([string] $Root = '', [string] $CurrentLink = '')
  if (-not $Root) { $Root = Join-Path $Script:P.U '.codex\packages\standalone\releases' }
  if (-not $CurrentLink) { $CurrentLink = Join-Path (Split-Path -Parent $Root) 'current' }
  $plan = [pscustomobject]@{ Root = (Get-FullPath $Root); Current = $null; Keep = @(); Drop = @(); Reason = '' }
  if (-not (Test-DirPresent $Root)) { $plan.Reason = 'no Codex releases folder'; return $plan }
  $current = $null
  try {
    $link = Get-Item -LiteralPath $CurrentLink -Force -ErrorAction Stop
    if (Test-ReparsePoint $link) { $current = Get-FullPath ([string](@($link.Target)[0])) }
  } catch { $current = $null }
  if (-not $current -or -not (Test-DirPresent $current)) { $plan.Reason = 'no readable current-release link - nothing is removed'; return $plan }
  $plan.Current = $current
  $ic = [StringComparison]::OrdinalIgnoreCase
  $rows = @()
  foreach ($e in (Get-ChildEntries $Root)) {
    if (-not ($e -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $e)) { continue }
    $rows += [pscustomobject]@{ Path = (Remove-LongPrefix $e.FullName); Version = (ConvertTo-ReleaseVersion $e.Name) }
  }
  $cur = @($rows | Where-Object { $_.Path.Equals($current, $ic) }) | Select-Object -First 1
  if ($null -eq $cur -or $null -eq $cur.Version) {
    $plan.Reason = 'the current release is not a version folder under the releases root - nothing is removed'
    $plan.Keep = @($rows | ForEach-Object { $_.Path })
    return $plan
  }
  $rollback = @($rows | Where-Object { $null -ne $_.Version -and $_.Version -lt $cur.Version } | Sort-Object Version -Descending) | Select-Object -First 1
  foreach ($r in $rows) {
    $keepIt = ($r.Path.Equals($current, $ic) -or $null -eq $r.Version -or $r.Version -gt $cur.Version -or ($null -ne $rollback -and $r.Path.Equals($rollback.Path, $ic)))
    if ($keepIt) { $plan.Keep += $r.Path } else { $plan.Drop += $r.Path }
  }
  return $plan
}

function Get-CodexReleaseExceptions {
  <# .SYNOPSIS The D79 exceptions for lib/safety.ps1: exactly the Drop folders of the live plan, nothing else. #>
  $plan = Get-CodexReleasePlan
  if ($plan.Reason) { return @() }
  return @($plan.Drop)
}

function Get-BusyExecutablePaths {
  <# .SYNOPSIS Executable paths of running processes (one CIM read), so a release folder in use is never removed. #>
  try { return @(Get-CimInstance Win32_Process -ErrorAction Stop | ForEach-Object { [string]$_.ExecutablePath } | Where-Object { $_ }) } catch { return @() }
}

function Invoke-CodexReleasePrune {
  <# .SYNOPSIS Remove the Drop folders through the chokepoint (which refuses anything the D79 exception does not name). #>
  $plan = Get-CodexReleasePlan
  if ($plan.Reason) { Write-Info "Codex releases - $($plan.Reason)"; return }
  Write-Note ("Codex releases: {0} kept (current {1}), {2} superseded" -f $plan.Keep.Count, (Split-Path -Leaf $plan.Current), $plan.Drop.Count)
  if ($plan.Drop.Count -eq 0) { Write-Info 'Codex releases - nothing superseded'; return }
  $busy = @(Get-BusyExecutablePaths)
  foreach ($d in $plan.Drop) {
    $prefix = $d.TrimEnd('\') + '\'
    if (@($busy | Where-Object { $_.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase) }).Count -gt 0) { Write-Note "in use by a running process, kept: $d"; continue }
    $r = Remove-PathSafe -Path $d -Within $plan.Root -Label 'Codex release'
    if ($r.Removed -and -not $Script:WS.DryRun) { Write-Ok ("Codex release {0} removed ({1})" -f (Split-Path -Leaf $d), (Format-Bytes $r.Bytes)) }
  }
}

function ConvertTo-NodePin {
  <# .SYNOPSIS One version request from .nvmrc / .node-version / engines.node: exact, major, newest or unknown. #>
  param([string] $Text)
  $t = ([string]$Text).Trim().ToLowerInvariant()
  if (-not $t) { return $null }
  if ($t -in 'node', 'latest', 'stable', 'current' -or $t.StartsWith('lts')) { return [pscustomobject]@{ Kind = 'newest'; Major = 0; Version = $null; Text = $t } }
  if ($t -match '^v?(\d+)\.(\d+)\.(\d+)$') { return [pscustomobject]@{ Kind = 'exact'; Major = [int]$Matches[1]; Version = [version]("{0}.{1}.{2}" -f $Matches[1], $Matches[2], $Matches[3]); Text = $t } }
  if ($t -match '^[\^~>=<\s]*v?(\d+)') { return [pscustomobject]@{ Kind = 'major'; Major = [int]$Matches[1]; Version = $null; Text = $t } }
  return [pscustomobject]@{ Kind = 'unknown'; Major = 0; Version = $null; Text = $t }
}

function Get-NodeVersionPlan {
  <# .SYNOPSIS Which installed Node versions no project needs. Kept: the active one, every exact pin, and for a
     major pin ("24", "^24", ">=24") the newest installed of that major - the one nvm would pick. An unreadable
     pin keeps everything (fail closed). Pure: the self-test drives it with literals. #>
  param([string[]] $Installed, [string] $Active, [pscustomobject[]] $Pins)
  $plan = [pscustomobject]@{ Keep = @(); Drop = @(); Unmet = @(); Reason = '' }
  $rows = @()
  foreach ($i in @($Installed)) { $n = ConvertTo-NodePin $i; if ($n -and $n.Kind -eq 'exact') { $rows += [pscustomobject]@{ Name = $i; Version = $n.Version; Major = $n.Major } } }
  $keep = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  if ($Active) { $null = $keep.Add($Active) }
  foreach ($pin in @($Pins)) {
    if ($null -eq $pin) { continue }
    if ($pin.Kind -eq 'unknown') { $plan.Reason = "a version request could not be read ('$($pin.Text)') - nothing is removed"; $plan.Keep = @($Installed); return $plan }
    $hit = $null
    if ($pin.Kind -eq 'exact') { $hit = @($rows | Where-Object { $_.Version -eq $pin.Version }) | Select-Object -First 1 }
    elseif ($pin.Kind -eq 'major') { $hit = @($rows | Where-Object { $_.Major -eq $pin.Major } | Sort-Object Version -Descending) | Select-Object -First 1 }
    elseif ($pin.Kind -eq 'newest') { $hit = @($rows | Sort-Object Version -Descending) | Select-Object -First 1 }
    if ($hit) { $null = $keep.Add($hit.Name) } else { $plan.Unmet += $pin.Text }
  }
  foreach ($r in $rows) { if ($keep.Contains($r.Name)) { $plan.Keep += $r.Name } else { $plan.Drop += $r.Name } }
  return $plan
}

function Get-NodePins {
  <# .SYNOPSIS Every Node version request under the scan roots: .nvmrc, .node-version and package.json engines.node,
     at most four folders deep, never inside node_modules or a never-enter folder. #>
  param([string[]] $Roots, [int] $MaxDepth = 4)
  $pins = @()
  foreach ($root in @($Roots)) {
    if (-not (Test-DirPresent $root)) { continue }
    $stack = New-Object System.Collections.Generic.Stack[object]
    $stack.Push(@((Get-FullPath $root), 0))
    $seen = 0
    while ($stack.Count -gt 0 -and $seen -lt 20000) {
      $item = $stack.Pop(); $dir = [string]$item[0]; $depth = [int]$item[1]
      foreach ($e in (Get-ChildEntries $dir)) {
        $seen++
        if (Test-ReparsePoint $e) { continue }
        if ($e -is [IO.DirectoryInfo]) {
          if ($e.Name -eq 'node_modules' -or $e.Name.StartsWith('.') -or $Script:WS_NEVER_ENTER -contains $e.Name) { continue }
          if ($depth -lt $MaxDepth) { $stack.Push(@((Remove-LongPrefix $e.FullName), $depth + 1)) }
          continue
        }
        $file = Remove-LongPrefix $e.FullName
        if ($e.Name -in '.nvmrc', '.node-version') {
          try { $pins += ConvertTo-NodePin ([IO.File]::ReadAllText($file)) } catch { $null = $_ }
        } elseif ($e.Name -eq 'package.json') {
          try { $j = [IO.File]::ReadAllText($file) | ConvertFrom-Json; if ($j.engines -and $j.engines.node) { $pins += ConvertTo-NodePin ([string]$j.engines.node) } } catch { $null = $_ }
        }
      }
    }
  }
  return @($pins | Where-Object { $_ })
}

function Invoke-NvmPrune {
  <# .SYNOPSIS Remove unpinned Node versions with nvm itself (developer mode and --scan-roots only). The tool never
     deletes inside the nvm folder; `nvm uninstall` does, through Invoke-External -Destructive. #>
  $ws = $Script:WS
  if ($ws.Developer -ne $true) { Write-Info 'Node versions - developer mode is off, left alone'; return }
  if (@($ws.ScanRoots).Count -eq 0) { Write-Info 'Node versions - no --scan-roots, so project version requests cannot be read; nothing removed'; return }
  $nvmHome = $env:NVM_HOME
  if (-not $nvmHome) { $nvmHome = Join-Path $Script:P.L 'nvm' }
  if (-not (Test-DirPresent $nvmHome)) { Write-Info 'Node versions - nvm for Windows not found'; return }
  $installed = @(Get-ChildEntries $nvmHome | Where-Object { $_ -is [IO.DirectoryInfo] -and $_.Name -match '^v\d+\.\d+\.\d+$' } | ForEach-Object { $_.Name })
  $active = ''
  $symlink = $env:NVM_SYMLINK
  if ($symlink) { try { $li = Get-Item -LiteralPath $symlink -Force -ErrorAction Stop; if (Test-ReparsePoint $li) { $active = Split-Path -Leaf ([string](@($li.Target)[0])) } } catch { $active = '' } }
  if (-not $active) { Write-Info 'Node versions - the active version could not be read; nothing removed'; return }
  $plan = Get-NodeVersionPlan -Installed $installed -Active $active -Pins @(Get-NodePins -Roots $ws.ScanRoots)
  if ($plan.Reason) { Write-Info "Node versions - $($plan.Reason)"; return }
  Write-Note ("Node versions: active {0}; kept {1}; not needed {2}" -f $active, ($plan.Keep -join ', '), ($plan.Drop -join ', '))
  if (@($plan.Unmet).Count -gt 0) { Write-Note ("requested but not installed: " + (($plan.Unmet | Sort-Object -Unique) -join ', ')) }
  if ($plan.Drop.Count -eq 0) { return }
  if (-not (Test-CommandPresent 'nvm')) { Write-Warn ('nvm is not on PATH; remove them yourself with: nvm uninstall ' + (($plan.Drop | ForEach-Object { $_.TrimStart('v') }) -join ' / ')); return }
  foreach ($v in $plan.Drop) {
    $bytes = Get-DirectoryBytes (Join-Path $nvmHome $v)
    $r = Invoke-External -FilePath 'nvm' -ArgumentList @('uninstall', $v.TrimStart('v')) -Destructive -Quiet -Label 'nvm'
    if ($ws.DryRun) { Add-Freed $bytes; continue }
    if (-not (Test-DirPresent (Join-Path $nvmHome $v))) { Add-Freed $bytes; Write-Ok ("Node {0} removed with nvm ({1})" -f $v, (Format-Bytes $bytes)) } else { Write-Warn "Node $v is still installed (nvm exit $($r.ExitCode))" }
  }
}

function Get-Targets28 {
  $P = $Script:P
  $t = @((New-Target 28 'Codex superseded releases' (Join-Path $P.U '.codex\packages\standalone\releases') -Kind cmd -Note 'the current release, any newer one and the newest older one are kept'))
  # Electron updaters named without "@" - section 8 owns the "@name-updater" ones. One target per folder, so the
  # list shows each and section 23 knows the folder is cleaned here.
  foreach ($e in (Get-ChildEntries $P.L)) {
    if (-not ($e -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $e) -or $e.Name.StartsWith('@') -or $e.Name -notlike '*-updater') { continue }
    $t += (New-Target 28 "Electron updater downloads ($($e.Name))" (Remove-LongPrefix $e.FullName) -Mode clear-old -Days 7 -Note 'downloaded installers and pending updates idle 7+ days')
  }
  $t += (New-Target 28 'Ollama downloaded updates' (Join-Path $P.L 'Ollama\updates_v2') -Mode clear-old -Days 1)
  $t += (New-Target 28 'Node versions no project requests (nvm)' (Join-Path $P.L 'nvm') -Kind cmd -Note 'developer mode and --scan-roots; nvm uninstall; the active and every requested version are kept')
  return $t
}

function Invoke-Section28 {
  Write-SectionIntro @(
    'Tools that update themselves often keep every old release. This removes the superseded ones and old downloaded',
    'updates. The release in use, any newer one and the newest older one stay, and a release a running program uses',
    'is skipped. Node versions go only in developer mode, when no project under --scan-roots asks for them.'
  )
  $targets = @(Get-Targets28)
  $null = Show-TargetSizes $targets
  if (-not (Confirm-Section 'Remove superseded releases and old downloaded updates?')) { Write-Info 'skipped'; return }
  Invoke-CodexReleasePrune
  $null = Invoke-TargetList @($targets | Where-Object { $_.Kind -ne 'cmd' })
  Invoke-NvmPrune
}
