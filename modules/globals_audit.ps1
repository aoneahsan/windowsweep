# globals_audit.ps1 - section 22: globally installed packages, read-only.
# Lists what npm, pnpm, yarn, bun and deno installed globally, flags the ones nothing has referenced for
# N+ days, and prints the exact uninstall command. It NEVER removes anything, in any mode: several of these
# roots (nvm4w, AppData\npm, pnpm\global, .bun, .deno\bin) are protected subtrees by design.

# Never proposed as a candidate: the tool itself and the package managers everything else depends on.
$Script:WS_GLOBAL_KEEP = @('npm', 'corepack', 'pnpm', 'yarn', 'windowsweep')

function Get-GlobalPackageRoots {
  <# .SYNOPSIS Existing global install roots, one row per manager. Style: node_modules (packages) | bin (shims). #>
  $P = $Script:P
  $rows = @()
  $npmRoot = ''
  if (Test-CommandPresent 'npm') {
    try {
      $out = & npm root -g 2>$null
      $line = ($out | Select-Object -Last 1)
      if ($line) { $npmRoot = $line.Trim() }
    } catch { $null = $_ }
  }
  if (-not $npmRoot) { $npmRoot = Join-Path $P.A 'npm\node_modules' }
  $fixed = @(
    @('npm', $npmRoot, 'node_modules'),
    @('yarn', "$($P.L)\Yarn\Data\global\node_modules", 'node_modules'),
    @('bun', "$($P.U)\.bun\install\global\node_modules", 'node_modules'),
    @('deno', "$($P.U)\.deno\bin", 'bin')
  )
  foreach ($f in $fixed) {
    if (Test-DirPresent $f[1]) { $rows += [pscustomobject]@{ Manager = $f[0]; Root = (Get-FullPath $f[1]); Style = $f[2] } }
  }
  # Version-managed and store-style roots are globs: one root per installed Node version / pnpm version.
  $globs = @()
  $globs += @(@('npm', "$($P.A)\nvm\v*\node_modules"))
  if ($env:NVM_HOME) { $globs += @(@('npm', (Join-Path $env:NVM_HOME 'v*\node_modules'))) }
  $globs += @(@('pnpm', "$($P.L)\pnpm\global\*\node_modules"))
  foreach ($g in $globs) {
    $hits = @()
    try { $hits = @(Get-Item -Path $g[1] -Force -ErrorAction SilentlyContinue | Where-Object { $_ -is [IO.DirectoryInfo] } | ForEach-Object { $_.FullName }) } catch { $hits = @() }
    foreach ($h in $hits) { $rows += [pscustomobject]@{ Manager = $g[0]; Root = (Get-FullPath $h); Style = 'node_modules' } }
  }
  $seen = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  return @($rows | Where-Object { $seen.Add($_.Root) })
}

function Get-PackageBinNames {
  <# .SYNOPSIS Command names a package.json 'bin' field installs: a string means one bin named after the package. #>
  param([object] $Manifest, [string] $Name)
  $out = @()
  if ($null -eq $Manifest) { return $out }
  $bin = $Manifest.bin
  if ($null -eq $bin) { return $out }
  if ($bin -is [string]) { return @(($Name -split '/')[-1]) }
  foreach ($p in $bin.PSObject.Properties) { $out += $p.Name }
  return $out
}

function Get-GlobalPackages {
  <# .SYNOPSIS Packages under one global root. Reads each package.json (top level only) - never walks a global tree. #>
  param([pscustomobject] $RootRow)
  $rows = @()
  if ($RootRow.Style -eq 'bin') {
    foreach ($e in (Get-ChildEntries $RootRow.Root)) {
      if ($e -is [IO.DirectoryInfo]) { continue }
      if ($e.Extension -eq '.cmd') { continue }
      $idle = [int][math]::Floor(([datetime]::UtcNow - (Get-NewestTimestampUtc $e)).TotalDays)
      $rows += [pscustomobject]@{ Manager = $RootRow.Manager; Name = [IO.Path]::GetFileNameWithoutExtension($e.Name)
        Version = ''; Path = (Remove-LongPrefix $e.FullName); Bytes = [long]$e.Length; Idle = $idle
        Bins = @([IO.Path]::GetFileNameWithoutExtension($e.Name)) }
    }
    return $rows
  }
  $dirs = @()
  foreach ($e in (Get-ChildEntries $RootRow.Root)) {
    if (-not ($e -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $e)) { continue }
    if ($e.Name -eq '.bin') { continue }
    if ($e.Name.StartsWith('@')) {
      foreach ($s in (Get-ChildEntries (Remove-LongPrefix $e.FullName))) {
        if ($s -is [IO.DirectoryInfo]) { $dirs += [pscustomobject]@{ Name = ($e.Name + '/' + $s.Name); Dir = (Remove-LongPrefix $s.FullName) } }
      }
      continue
    }
    $dirs += [pscustomobject]@{ Name = $e.Name; Dir = (Remove-LongPrefix $e.FullName) }
  }
  foreach ($d in $dirs) {
    $manifest = $null
    $mf = Join-Path $d.Dir 'package.json'
    if (Test-PathPresent $mf) { try { $manifest = @(Read-JsonFile $mf)[0] } catch { $manifest = $null } }
    $version = ''
    if ($manifest -and $manifest.version) { $version = [string]$manifest.version }
    # The newest of the package's own top-level entries: a global node_modules is far too big to walk.
    $newest = [datetime]::MinValue
    foreach ($c in (Get-ChildEntries $d.Dir)) { $t = Get-NewestTimestampUtc $c; if ($t -gt $newest) { $newest = $t } }
    if ($newest -eq [datetime]::MinValue) { $newest = [datetime]::UtcNow }
    $rows += [pscustomobject]@{ Manager = $RootRow.Manager; Name = $d.Name; Version = $version; Path = $d.Dir
      Bytes = [long](Get-DirectoryBytes $d.Dir); Idle = [int][math]::Floor(([datetime]::UtcNow - $newest).TotalDays)
      Bins = @(Get-PackageBinNames -Manifest $manifest -Name $d.Name) }
  }
  return $rows
}

function Get-ProjectPackageIndex {
  <# .SYNOPSIS What the project roots reference: dependency names, script text and local .bin command names.
     Only manifests touched inside the idle window count - an ancient project does not keep a global alive. #>
  param([string[]] $Roots, [int] $Days, [int] $MaxDepth = 4, [int] $MaxFiles = 2000)
  $names = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  $bins = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  $script = New-Object System.Text.StringBuilder
  $seen = 0
  foreach ($root in $Roots) {
    $stack = New-Object System.Collections.Generic.Stack[object]
    $stack.Push(@($root, 0))
    while ($stack.Count -gt 0 -and $seen -lt $MaxFiles) {
      $item = $stack.Pop()
      $dir = [string]$item[0]; $depth = [int]$item[1]
      foreach ($e in (Get-ChildEntries $dir)) {
        if (Test-ReparsePoint $e) { continue }
        if ($e -is [IO.DirectoryInfo]) {
          if ($e.Name -eq 'node_modules') {
            foreach ($b in (Get-ChildEntries (Join-Path (Remove-LongPrefix $e.FullName) '.bin'))) { $null = $bins.Add([IO.Path]::GetFileNameWithoutExtension($b.Name)) }
            continue
          }
          if ($Script:WS_NEVER_ENTER -contains $e.Name -or $e.Name.StartsWith('.')) { continue }
          if ($depth -lt $MaxDepth) { $stack.Push(@((Remove-LongPrefix $e.FullName), $depth + 1)) }
          continue
        }
        if ($e.Name -ne 'package.json') { continue }
        $seen++
        if ([int][math]::Floor(([datetime]::UtcNow - (Get-NewestTimestampUtc $e)).TotalDays) -ge $Days) { continue }
        $m = $null
        try { $m = @(Read-JsonFile (Remove-LongPrefix $e.FullName))[0] } catch { $m = $null }
        if ($null -eq $m) { continue }
        foreach ($field in @('dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies')) {
          if ($m.$field) { foreach ($p in $m.$field.PSObject.Properties) { $null = $names.Add($p.Name) } }
        }
        if ($m.scripts -and $script.Length -lt 200000) {
          foreach ($p in $m.scripts.PSObject.Properties) { $null = $script.Append(' ').Append([string]$p.Value) }
        }
      }
    }
  }
  return [pscustomobject]@{ Names = $names; Bins = $bins; ScriptText = $script.ToString().ToLowerInvariant(); Scanned = $seen }
}

function Get-GlobalPackageVerdict {
  <# .SYNOPSIS Pure verdict for one global package: keep | candidate, plus whether a project shadows its command.
     Candidate needs all three: idle past the window, never referenced, and not a package manager we protect. #>
  param([pscustomobject] $Package, [pscustomobject] $Index, [int] $Days)
  $short = ($Package.Name -split '/')[-1]
  $shadowed = $false
  foreach ($b in @($Package.Bins)) { if ($Index.Bins.Contains($b)) { $shadowed = $true } }
  if ($Script:WS_GLOBAL_KEEP -contains $short -or $Script:WS_GLOBAL_KEEP -contains $Package.Name) {
    return [pscustomobject]@{ Verdict = 'keep'; Reason = 'package manager / this tool'; Shadowed = $shadowed }
  }
  if ($Index.Names.Contains($Package.Name)) { return [pscustomobject]@{ Verdict = 'keep'; Reason = 'a recent project depends on it'; Shadowed = $shadowed } }
  foreach ($b in @($Package.Bins)) {
    if ($b -and $Index.ScriptText.Contains($b.ToLowerInvariant())) { return [pscustomobject]@{ Verdict = 'keep'; Reason = "a recent project script runs '$b'"; Shadowed = $shadowed } }
  }
  if ($Package.Idle -lt $Days) { return [pscustomobject]@{ Verdict = 'keep'; Reason = "touched $($Package.Idle) days ago"; Shadowed = $shadowed } }
  return [pscustomobject]@{ Verdict = 'candidate'; Reason = "nothing referenced it and it is $($Package.Idle) days old"; Shadowed = $shadowed }
}

function Get-GlobalUninstallCommand {
  <# .SYNOPSIS The exact command that removes one global package for its manager. #>
  param([string] $Manager, [string] $Name)
  switch ($Manager) {
    'npm' { return "npm uninstall -g $Name" }
    'pnpm' { return "pnpm remove -g $Name" }
    'yarn' { return "yarn global remove $Name" }
    'bun' { return "bun remove -g $Name" }
    'deno' { return "deno uninstall $Name" }
    default { return "# remove $Name manually" }
  }
}

function Get-Targets22 {
  <# .SYNOPSIS Informational rows only. Section 22 declares NO deletable target: these roots are protected. #>
  $t = @()
  foreach ($r in (Get-GlobalPackageRoots)) { $t += (New-Target 22 "$($r.Manager) global root" $r.Root -Kind cmd -Note 'read-only audit; this section never deletes') }
  if ($t.Count -eq 0) { $t += (New-Target 22 'global package roots' '(none detected)' -Kind cmd -Note 'read-only audit; this section never deletes') }
  return $t
}

function Invoke-Section22 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'What npm, pnpm, yarn, bun and deno installed globally, and which of those nothing has referenced lately.',
    "A package is a candidate only when it is $($ws.Days)+ days old AND no project touched recently names it.",
    'This section never uninstalls anything - it prints the command and leaves the decision to you.'
  )
  $roots = @(Get-GlobalPackageRoots)
  if ($roots.Count -eq 0) { Write-Info 'no global package roots found'; return }
  Write-Info ('roots: ' + (($roots | ForEach-Object { "$($_.Manager) -> $($_.Root)" }) -join '   '))
  $packages = @()
  foreach ($r in $roots) { $packages += @(Get-GlobalPackages -RootRow $r) }
  if ($packages.Count -eq 0) { Write-Info 'no globally installed packages found'; return }
  $projectRoots = @(Get-ProjectScanRoots)
  $index = Get-ProjectPackageIndex -Roots $projectRoots -Days $ws.Days
  Write-Note "checked $($index.Scanned) project manifest(s) under: $($projectRoots -join '  ')"
  $lines = @("global packages audit - $(Get-Date -Format 'yyyy-MM-dd HH:mm') - idle window $($ws.Days) days", '')
  $kept = @(); $cand = @()
  foreach ($p in ($packages | Sort-Object Bytes -Descending)) {
    $v = Get-GlobalPackageVerdict -Package $p -Index $index -Days $ws.Days
    $row = [pscustomobject]@{ Package = $p; Verdict = $v }
    if ($v.Verdict -eq 'candidate') { $cand += $row } else { $kept += $row }
  }
  Write-Section 'Kept'
  Write-UiLine ("  {0,-34} {1,-10} {2,10} {3,6}  {4}" -f 'PACKAGE', 'VERSION', 'SIZE', 'IDLE', 'WHY') 'White'
  foreach ($r in $kept) {
    $line = "  {0,-34} {1,-10} {2,10} {3,5}d  {4}" -f $r.Package.Name, $r.Package.Version, (Format-Bytes $r.Package.Bytes), $r.Package.Idle, $r.Verdict.Reason
    Write-UiLine $line 'Gray'; $lines += ('kept      ' + $line.Trim())
  }
  Write-Section 'Candidates - nothing recent referenced these'
  if ($cand.Count -eq 0) { Write-Info 'none' } else {
    Write-UiLine ("  {0,-34} {1,-10} {2,10} {3,6}  {4}" -f 'PACKAGE', 'VERSION', 'SIZE', 'IDLE', 'NOTE') 'White'
    $total = [long]0
    foreach ($r in $cand) {
      $note = ''
      if ($r.Verdict.Shadowed) { $note = 'a project installs this command locally' }
      $line = "  {0,-34} {1,-10} {2,10} {3,5}d  {4}" -f $r.Package.Name, $r.Package.Version, (Format-Bytes $r.Package.Bytes), $r.Package.Idle, $note
      Write-UiLine $line 'Yellow'; $lines += ('candidate ' + $line.Trim())
      $total += $r.Package.Bytes
    }
    Write-Info ('candidates hold ' + (Format-Bytes $total))
    Write-Section 'Remove them yourself with'
    $lines += ''; $lines += 'uninstall commands:'
    foreach ($r in $cand) {
      $cmd = Get-GlobalUninstallCommand -Manager $r.Package.Manager -Name $r.Package.Name
      Write-Plain "  $cmd"; $lines += "  $cmd"
    }
    Write-Note 'windowsweep does not run these: a global package can be a command you rely on rarely.'
  }
  if (-not $ws.NoReport) {
    $out = Join-Path $ws.ReportsDir ('global-packages-' + $ws.Stamp + '.txt')
    try { [IO.File]::WriteAllLines($out, $lines); Write-Note "list saved: $out" } catch { $null = $_ }
  }
}
