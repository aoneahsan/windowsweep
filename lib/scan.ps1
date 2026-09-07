# scan.ps1 - read-only scanners: the target table, --list-targets and the pre-scan.
# Every module contributes its targets through a Get-TargetsNN function; nothing here deletes.

function New-Target {
  <# .SYNOPSIS Describe one path the tool can touch and how it is treated.
     Kind: dir | file | glob (expands to dirs) | fileglob (expands to files) | cmd (informational)
     Mode: prune (files idle >= Days) | clear (everything inside) | clear-old (entries idle >= Days) |
           units (each child is a version/unit; idle gate, -KeepNewest per group) | file (remove the file)
     Dev:  $true = a developer cache: pruned by the idle gate in developer mode, cleared otherwise.
     Guard: process names; the target is skipped while any of them runs. #>
  param([int] $Section, [string] $Label, [string] $Path, [string] $Kind = 'dir', [string] $Mode = 'prune',
    [int] $Days = 0, [bool] $Dev = $false, [string[]] $Guard = @(), [bool] $KeepNewest = $false,
    [scriptblock] $GroupBy = $null, [string[]] $ExcludeNames = @(), [string] $Note = '')
  return [pscustomobject]@{ Section = $Section; Label = $Label; Path = $Path; Kind = $Kind; Mode = $Mode; Days = $Days
    Dev = $Dev; Guard = $Guard; KeepNewest = $KeepNewest; GroupBy = $GroupBy; ExcludeNames = $ExcludeNames; Note = $Note }
}

function Get-AllTargets {
  <# .SYNOPSIS Collect every declared target from the loaded modules: one Get-TargetsNN per catalogue row.
     Driven by WS_SECTIONS, never a literal range, so a new section is reachable the moment it is declared. #>
  $all = @()
  foreach ($s in $Script:WS_SECTIONS) {
    $fn = 'Get-Targets{0:00}' -f $s.Id
    if (Get-Command $fn -ErrorAction SilentlyContinue) { $all += @(& $fn) }
  }
  return $all
}

function Resolve-TargetPaths {
  <# .SYNOPSIS Expand a glob target into concrete existing paths; a plain path returns itself when present. #>
  param([pscustomobject] $Target)
  if ($Target.Kind -eq 'cmd') { return @() }
  if ($Target.Kind -in 'chromium', 'firefox', 'electron', 'editor') { return @(Get-TargetCachePaths $Target) }
  if ($Target.Kind -eq 'glob') {
    try { return @(Get-Item -Path $Target.Path -Force -ErrorAction SilentlyContinue | Where-Object { $_ -is [IO.DirectoryInfo] } | ForEach-Object { $_.FullName }) } catch { return @() }
  }
  if ($Target.Kind -eq 'fileglob') {
    try { return @(Get-Item -Path $Target.Path -Force -ErrorAction SilentlyContinue | Where-Object { $_ -is [IO.FileInfo] } | ForEach-Object { $_.FullName }) } catch { return @() }
  }
  if (Test-PathPresent $Target.Path) { return @((Get-FullPath $Target.Path)) }
  return @()
}

function Show-ScanTable {
  <# .SYNOPSIS Read-only table of every target with its current size. Returns total bytes found. #>
  param([int[]] $Sections = @())
  $total = [long]0
  $targets = @(Get-AllTargets)
  if ($Sections.Count -gt 0) { $targets = @($targets | Where-Object { $Sections -contains $_.Section }) }
  $bySection = $targets | Group-Object Section | Sort-Object { [int]$_.Name }
  foreach ($g in $bySection) {
    $sec = Get-Section ([int]$g.Name)
    Write-Section ("[{0:00}] {1}" -f $sec.Id, $sec.Title)
    Write-UiLine ("  {0,-46} {1,10}  {2}" -f 'ITEM', 'SIZE', 'PATH') 'White'
    $secTotal = [long]0
    foreach ($t in $g.Group) {
      if ($t.Kind -eq 'cmd') { Write-UiLine ("  {0,-46} {1,10}  {2}" -f $t.Label, '(cmd)', $t.Path) 'DarkGray'; continue }
      $paths = @(Resolve-TargetPaths $t)
      if ($paths.Count -eq 0) { Write-UiLine ("  {0,-46} {1,10}  {2}" -f $t.Label, 'absent', $t.Path) 'DarkGray'; continue }
      $bytes = [long]0
      foreach ($p in $paths) {
        # Sized once per path: a second pass for --json would walk every target twice. Under --json the walk
        # is Get-DirectoryStats, which returns the newest timestamp out of the SAME enumeration that produces
        # the byte count - so newest_write_utc costs no extra walk. Outside --json the faster robocopy path in
        # Get-DirectoryBytes is kept, because a human --scan has no use for the timestamp.
        $newest = $null
        if ($Script:WS.JsonMode) {
          $st = Get-DirectoryStats $p
          $b = [long]$st.Bytes
          $newest = Format-Utc8601 $st.Newest
        } else {
          $b = [long](Get-DirectoryBytes $p)
        }
        $bytes += $b
        if ($Script:WS.JsonMode) { $Script:WS.ScanTargets += [ordered]@{ section = $t.Section; label = $t.Label; path = $p; bytes = $b; newest_write_utc = $newest } }
      }
      $secTotal += $bytes
      $shown = $t.Path
      if ($paths.Count -gt 1) { $shown = "$($t.Path)  ($($paths.Count) matches)" }
      Write-UiLine ("  {0,-46} {1,10}  {2}" -f $t.Label, (Format-Bytes $bytes), $shown) 'Gray'
    }
    Write-UiLine ("  {0,-46} {1,10}" -f 'section total on disk', (Format-Bytes $secTotal)) 'Cyan'
    $total += $secTotal
  }
  Write-UiLine '' 'Gray'
  Write-Info ("Currently on disk across all listed targets: " + (Format-Bytes $total))
  Write-Note 'These are sizes on disk, not what a run would delete: the idle gate keeps recently used files, and running apps are skipped.'
  return $total
}

function Show-TargetList {
  <# .SYNOPSIS --list-targets: every path the tool can touch, plus the protected lists. #>
  Write-Box 'Cleanup targets' 'Every path this tool can touch, grouped by section (read-only)'
  $targets = @(Get-AllTargets)
  foreach ($g in ($targets | Group-Object Section | Sort-Object { [int]$_.Name })) {
    $sec = Get-Section ([int]$g.Name)
    Write-Section ("[{0:00}] {1}" -f $sec.Id, $sec.Title)
    foreach ($t in $g.Group) {
      $note = ''
      if ($t.Note) { $note = "  - $($t.Note)" }
      Write-UiLine ("  {0,-44} {1}{2}" -f $t.Label, $t.Path, $note) 'Gray'
    }
  }
  Write-Section 'PROTECTED - never deleted, no flag bypasses this'
  foreach ($s in $Script:WS_PROTECT.Subtrees) { Write-UiLine "  $($Script:WS.Glyph.bullet) $s" 'DarkGray' }
  # ONE list, read here and by --list --json (Get-CatalogueJson). Printing one wording and publishing another
  # is exactly the drift a machine-readable copy of a human list invites, so there is only ever one copy.
  foreach ($c in $Script:WS_PROTECT_CATEGORIES) { Write-UiLine "  $($Script:WS.Glyph.bullet) $c" 'DarkGray' }
}
