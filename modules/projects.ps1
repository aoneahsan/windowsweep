# projects.ps1 - section 17: stale build artefacts in projects nobody has touched for N+ days. Interactive only.

$Script:WS_ARTEFACT_DIRS = @('node_modules', 'dist', 'build', 'out', '.next', '.nuxt', '.turbo', '.vite', '.svelte-kit', '.astro', '.parcel-cache', 'target', 'vendor', 'coverage', '.nyc_output', '__pycache__', '.pytest_cache', '.dart_tool', '.angular')
$Script:WS_PROJECT_MARKERS = @('package.json', 'pubspec.yaml', 'composer.json', 'Cargo.toml', 'go.mod', 'build.gradle', 'build.gradle.kts', 'pom.xml', 'pyproject.toml', 'requirements.txt', 'angular.json', 'next.config.js', 'next.config.mjs', 'nuxt.config.ts', 'vite.config.ts', 'vite.config.js')
$Script:WS_NEVER_ENTER = @('.git', 'AppData', 'node_modules', '$RECYCLE.BIN', 'System Volume Information', '.gradle', '.m2', '.nuget', '.cargo', '.vscode', '.idea')

function Get-ProjectScanRoots {
  $ws = $Script:WS
  $U = $Script:P.U
  $roots = @()
  if ($ws.ScanRoots.Count -gt 0) {
    foreach ($r in $ws.ScanRoots) {
      $f = Get-FullPath $r
      if (-not $f -or -not (Test-DirPresent $f)) { Write-Warn "scan root not found: $r"; continue }
      if ($f -match '^[A-Za-z]:\\?$' -or $f.Equals($U, [StringComparison]::OrdinalIgnoreCase)) { Write-Warn "refusing to scan a whole drive or your profile root: $f (name a projects folder)"; continue }
      $roots += $f
    }
    return $roots
  }
  $names = @('source\repos', 'source', 'repos', 'Projects', 'projects', 'code', 'Code', 'dev', 'Dev', 'Development', 'work', 'Work', 'git', 'GitHub', 'Documents\GitHub', 'Documents\Projects', 'Documents\code', 'Documents\dev', 'Documents\repos')
  foreach ($n in $names) { $p = Join-Path $U $n; if (Test-DirPresent $p) { $roots += (Get-FullPath $p) } }
  foreach ($d in [IO.DriveInfo]::GetDrives()) {
    if (-not $d.IsReady -or $d.DriveType -ne [IO.DriveType]::Fixed) { continue }
    foreach ($n in @('work', 'code', 'projects', 'repos', 'dev', 'src', 'git', 'Projects', 'Code', 'Work')) {
      $p = Join-Path $d.Name $n
      if ((Test-DirPresent $p) -and ($roots -notcontains (Get-FullPath $p))) { $roots += (Get-FullPath $p) }
    }
  }
  return @($roots | Select-Object -Unique)
}

function Get-Targets17 {
  $roots = @(Get-ProjectScanRoots)
  $t = @()
  foreach ($r in $roots) { $t += (New-Target 17 'Project scan root' $r -Kind cmd -Note ($Script:WS_ARTEFACT_DIRS -join ', ')) }
  if ($t.Count -eq 0) { $t += (New-Target 17 'Project scan root' '(none detected - pass --scan-roots "D:\work;E:\code")' -Kind cmd) }
  return $t
}

function Test-ProjectMarker {
  param([string] $Dir, [string] $ArtefactName)
  $entries = Get-ChildEntries $Dir
  $names = @($entries | ForEach-Object { $_.Name })
  if ($ArtefactName -in 'bin', 'obj') { return [bool]($names | Where-Object { $_ -like '*.csproj' -or $_ -like '*.sln' -or $_ -like '*.fsproj' }) }
  foreach ($m in $Script:WS_PROJECT_MARKERS) { if ($names -contains $m) { return $true } }
  return ($names -contains '.git')
}

function Get-ProjectActivityDays {
  <# .SYNOPSIS Days since any SOURCE file in the project changed (artefact dirs and .git excluded). #>
  param([string] $ProjectDir)
  $newest = [datetime]::MinValue
  $stack = New-Object System.Collections.Generic.Stack[string]
  $stack.Push($ProjectDir)
  $seen = 0
  while ($stack.Count -gt 0 -and $seen -lt 200000) {
    $dir = $stack.Pop()
    foreach ($e in (Get-ChildEntries $dir)) {
      $seen++
      if (Test-ReparsePoint $e) { continue }
      if ($e -is [IO.DirectoryInfo]) {
        if ($Script:WS_ARTEFACT_DIRS -contains $e.Name -or $Script:WS_NEVER_ENTER -contains $e.Name) { continue }
        $stack.Push((Remove-LongPrefix $e.FullName)); continue
      }
      $t = Get-NewestTimestampUtc $e
      if ($t -gt $newest) { $newest = $t }
    }
  }
  if ($newest -eq [datetime]::MinValue) { return (Get-IdleDays $ProjectDir) }
  return [int][math]::Floor(([datetime]::UtcNow - $newest).TotalDays)
}

function Find-StaleArtefacts {
  <# .SYNOPSIS Artefact folders (node_modules, dist, ...) whose project has been idle for N+ days. #>
  param([string[]] $Roots, [int] $Days, [int] $MaxDepth = 6)
  $ws = $Script:WS
  $found = New-Object System.Collections.Generic.List[object]
  $projectAge = @{}
  foreach ($root in $Roots) {
    $stack = New-Object System.Collections.Generic.Stack[object]
    $stack.Push(@($root, 0))
    while ($stack.Count -gt 0) {
      $item = $stack.Pop()
      $dir = [string]$item[0]; $depth = [int]$item[1]
      foreach ($e in (Get-ChildEntries $dir)) {
        if (-not ($e -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $e)) { continue }
        $full = Remove-LongPrefix $e.FullName
        $skip = $false
        foreach ($x in $ws.ExcludePaths) { if ($x -and (Test-PathWithin -Path $full -Within $x)) { $skip = $true; break } }
        if ($skip) { continue }
        if ($Script:WS_ARTEFACT_DIRS -contains $e.Name -or ($e.Name -in 'bin', 'obj')) {
          if (-not (Test-ProjectMarker -Dir $dir -ArtefactName $e.Name)) { continue }
          if (-not $projectAge.ContainsKey($dir)) { $projectAge[$dir] = Get-ProjectActivityDays $dir }
          $age = $projectAge[$dir]
          if ($age -ge $Days) { $found.Add([pscustomobject]@{ Path = $full; Project = $dir; Age = $age; Bytes = [long](Get-DirectoryBytes $full); Root = $root }) }
          continue
        }
        if ($Script:WS_NEVER_ENTER -contains $e.Name -or $e.Name.StartsWith('.')) { continue }
        if ($depth -lt $MaxDepth) { $stack.Push(@($full, $depth + 1)) }
      }
    }
  }
  return @($found | Sort-Object Bytes -Descending)
}

function Invoke-Section17 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'node_modules, dist, .next, target, vendor and friends are rebuilt by the next install or build. Only projects',
    "whose SOURCE files nobody touched for $($ws.Days)+ days are listed, and nothing goes without your selection.",
    'Toolchain folders (.gradle, .nuget, .cargo, AppData) and .git are never entered.'
  )
  $roots = @(Get-ProjectScanRoots)
  if ($roots.Count -eq 0) { Write-Warn 'no project roots found. Pass --scan-roots "D:\work;E:\code" (semicolon-separated) or save scanRoots in config.json.'; return }
  Write-Info ("scanning: " + ($roots -join '  '))
  $found = @(Find-StaleArtefacts -Roots $roots -Days $ws.Days)
  if ($found.Count -eq 0) { Write-Info "no build artefacts in projects idle $($ws.Days)+ days"; return }
  $reportLines = @("stale build artefacts - projects idle $($ws.Days)+ days - $(Get-Date -Format 'yyyy-MM-dd HH:mm')", '')
  Write-UiLine ("  {0,3}  {1,10} {2,6}  {3}" -f '#', 'SIZE', 'IDLE', 'ARTEFACT') 'White'
  $i = 1; $total = [long]0
  foreach ($f in $found) {
    Write-UiLine ("  {0,3}  {1,10} {2,5}d  {3}" -f $i, (Format-Bytes $f.Bytes), $f.Age, $f.Path) 'Gray'
    $reportLines += ("{0,10} {1,5}d  {2}" -f (Format-Bytes $f.Bytes), $f.Age, $f.Path)
    $total += $f.Bytes; $i++
    if ($i -gt 200) { Write-Warn 'list truncated to 200 entries'; break }
  }
  Write-Info ("total: " + (Format-Bytes $total))
  if (-not $ws.NoReport) {
    $out = Join-Path $ws.ReportsDir ('stale-builds-' + $ws.Stamp + '.txt')
    try { [IO.File]::WriteAllLines($out, $reportLines); Write-Note "list saved: $out" } catch { $null = $_ }
  }
  $picks = Read-MultiSelect -Total ([math]::Min($found.Count, 200))
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  if (-not (Confirm-Section "Remove $($picks.Count) artefact folder(s)? (rebuild with the project's install/build command)" 'n')) { Write-Info 'skipped'; return }
  foreach ($k in $picks) {
    $f = $found[$k - 1]
    $r = Remove-PathSafe -Path $f.Path -Within $f.Root -Label (Split-Path -Leaf $f.Path)
    if ($r.Removed -and -not $ws.DryRun) { Write-Ok ("removed " + (Format-Bytes $r.Bytes) + "  $($f.Path)") }
  }
}
