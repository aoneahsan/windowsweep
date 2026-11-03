# data_scanner.ps1 - section 19 (1.4.0 data scanner): large or old personal files. Downloads by default; folders a
# person adds with --personal-roots / personalRoots (owner, 2026-11-03). Discovery is read-only and lists each file
# once with its reason (large: >= --large-file-mb at any age; old: idle --days at any size; both), its age and the
# timestamps that age came from (D82). Removal stays interactive: exact paths only, never by --yes, Recycle Bin by
# default, and every file is re-checked right before it goes - one that changed since the scan, or whose path now
# runs through a link, is refused. Personal paths never leave the machine. ASCII only.

$Script:WS_DATA_SCAN_MAX_FILES = 200000   # walked per root before the scan stops and says so
$Script:WS_DATA_SCAN_MAX_ROWS = 500       # offered at once, largest first

function Test-PersonalRoot {
  <# .SYNOPSIS Why a folder may not be a personal-data root, or $null when it may. #>
  param([string] $Path)
  $f = Get-FullPath $Path
  if (-not $f) { return 'unresolvable path' }
  if ($f -match '^[A-Za-z]:\\?$') { return 'a drive root' }
  $info = Get-ItemInfo $f
  if (-not ($info -is [IO.DirectoryInfo])) { return 'not an existing folder' }
  if (Test-ReparsePoint $info) { return 'a link - add the folder it points to instead' }
  $P = $Script:P
  if ($f.Equals($P.U, [StringComparison]::OrdinalIgnoreCase)) { return 'the profile folder itself' }
  foreach ($sys in @($P.SR, $P.PF, $P.PF86, $P.PD, (Join-Path $P.U 'AppData'))) {
    if ($sys -and (Test-PathWithin -Path $f -Within $sys)) { return "inside a system, program or app-data folder ($sys)" }
  }
  return (Get-ProtectionReason $f)
}

function Get-PersonalDataRoots {
  <# .SYNOPSIS Downloads plus the accepted --personal-roots, once each; every root's verdict is kept for --json. #>
  $ws = $Script:WS
  $report = @(); $out = @()
  $cands = @()
  $dl = Join-Path $Script:P.U 'Downloads'
  if (Test-DirPresent $dl) { $cands += (Get-FullPath $dl) }
  $cands += @($ws.PersonalRoots)
  foreach ($c in $cands) {
    $f = Get-FullPath $c
    if (-not $f -or $out -contains $f -or @($report | Where-Object { $_.path -eq $f }).Count -gt 0) { continue }
    $why = Test-PersonalRoot $f
    $report += [ordered]@{ path = $f; accepted = (-not $why); reason = [string]$why }
    if ($why) { Write-Warn "not scanned: $f ($why)" } else { $out += $f }
  }
  $ws.PersonalRootsReport = $report
  return $out
}

function Find-PersonalFiles {
  <# .SYNOPSIS Read-only: files under the roots that are large (>= MinBytes, any age) or old (idle >= Days, any
     size), each once. Rows carry Selectable = $false and SkipReason when the chokepoint would refuse the file. #>
  param([string[]] $Roots, [long] $MinBytes, [int] $Days, [int] $MaxFiles = $Script:WS_DATA_SCAN_MAX_FILES)
  $rows = New-Object System.Collections.Generic.List[object]
  $now = [datetime]::UtcNow
  foreach ($root in $Roots) {
    $ignore = Test-LastAccessLive -Root $root
    $basis = 'write+access'
    if ($ignore) { $basis = 'write' }
    $files = @(Get-FilesUnder -Root $root -MaxDepth 6 -MaxFiles $MaxFiles)
    if ($files.Count -ge $MaxFiles) { Write-Note "stopped after $MaxFiles files under $root - add a narrower folder for the rest" }
    foreach ($f in $files) {
      $len = [long]$f.Length
      $t = Get-NewestTimestampUtc $f -IgnoreAccess:$ignore
      $age = [int][math]::Floor(($now - $t).TotalDays)
      $large = ($len -ge $MinBytes); $old = ($age -ge $Days)
      if (-not ($large -or $old)) { continue }
      $reason = 'old'
      if ($large -and $old) { $reason = 'both' } elseif ($large) { $reason = 'large' }
      $path = Remove-LongPrefix $f.FullName
      $why = Get-ProtectionReason $path
      $rows.Add([pscustomobject]@{ Path = $path; Root = $root; Bytes = $len; Idle = $age; Reason = $reason; Basis = $basis
          Modified = $t; Written = $f.LastWriteTimeUtc; Selectable = (-not $why); SkipReason = [string]$why })
    }
  }
  return $rows.ToArray()
}

function Test-PersonalFileUnchanged {
  <# .SYNOPSIS Right before removal: why the file may no longer go - gone, now a link, changed since the scan, or
     reached through a folder that became a link - or $null when it is exactly what the scan saw. #>
  param([pscustomobject] $Row)
  $info = Get-ItemInfo $Row.Path
  if (-not ($info -is [IO.FileInfo])) { return 'gone, or no longer a file' }
  if (Test-ReparsePoint $info) { return 'it became a link' }
  if ([long]$info.Length -ne [long]$Row.Bytes -or $info.LastWriteTimeUtc -ne $Row.Written) { return 'changed since the scan - scan again' }
  $root = Get-FullPath $Row.Root
  $rootInfo = Get-ItemInfo $root
  if (-not ($rootInfo -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $rootInfo)) { return 'its folder is gone or became a link' }
  $dir = $info.Directory
  while ($null -ne $dir -and -not (Get-FullPath $dir.FullName).Equals($root, [StringComparison]::OrdinalIgnoreCase)) {
    if (Test-ReparsePoint $dir) { return 'a folder on its path became a link' }
    $dir = $dir.Parent
  }
  if ($null -eq $dir) { return 'no longer inside its folder' }
  return $null
}

function Show-DataScanTable {
  param([object[]] $Rows)
  Write-UiLine ("  {0,3}  {1,10} {2,6}  {3,-5}  {4}" -f '#', 'SIZE', 'AGE', 'WHY', 'FILE') 'White'
  $i = 1
  foreach ($r in $Rows) { Write-UiLine ("  {0,3}  {1,10} {2,5}d  {3,-5}  {4}" -f $i, (Format-Bytes $r.Bytes), $r.Idle, $r.Reason, $r.Path) 'Gray'; $i++ }
}

function Get-Targets19 {
  $t = @()
  foreach ($r in @(Join-Path $Script:P.U 'Downloads') + @($Script:WS.PersonalRoots)) {
    if ($r -and (Test-DirPresent $r)) { $t += (New-Target 19 "Files >= $($Script:WS.LargeFileMb) MB, or idle $($Script:WS.Days)+ days" (Get-FullPath $r) -Kind cmd -Note 'moved to the Recycle Bin after you pick them') }
  }
  return $t
}

function Invoke-Section19 {
  $ws = $Script:WS
  Write-SectionIntro @(
    "Files in Downloads and the folders you added that are large ($($ws.LargeFileMb) MB or more, any age) or old (untouched for",
    "$($ws.Days)+ days, any size). Large and old describe the file, not whether you still need it. You pick what goes;",
    'it lands in the Recycle Bin, and a file that changed since this list was made is refused.'
  )
  $roots = @(Get-PersonalDataRoots)
  if ($roots.Count -eq 0) { Write-Info 'no folder to scan (no Downloads folder, and no accepted --personal-roots)'; return }
  $all = @(Find-PersonalFiles -Roots $roots -MinBytes ([long]$ws.LargeFileMb * 1MB) -Days $ws.Days)
  foreach ($k in @($all | Where-Object { -not $_.Selectable })) {
    Write-Note ("kept: {0}  ({1})" -f $k.Path, $k.SkipReason)
    Add-JsonCandidate -Section 19 -Index 0 -Path $k.Path -Bytes $k.Bytes -IdleDays $k.Idle -Extra ([ordered]@{ reason = $k.Reason; age_basis = $k.Basis; modified = $k.Modified.ToString('o'); root = $k.Root; selectable = $false; skip_reason = $k.SkipReason })
  }
  $offer = @($all | Where-Object { $_.Selectable } | Sort-Object Bytes -Descending)
  if ($offer.Count -gt $Script:WS_DATA_SCAN_MAX_ROWS) { Write-Note ("{0} more matching files are not listed (the smallest) - raise --large-file-mb or --days to see others" -f ($offer.Count - $Script:WS_DATA_SCAN_MAX_ROWS)); $offer = @($offer | Select-Object -First $Script:WS_DATA_SCAN_MAX_ROWS) }
  if ($offer.Count -eq 0) { Write-Info 'no large or old file found'; return }
  Show-DataScanTable $offer
  $i = 1; $total = [long]0
  foreach ($r in $offer) {
    Add-JsonCandidate -Section 19 -Index $i -Path $r.Path -Bytes $r.Bytes -IdleDays $r.Idle -Extra ([ordered]@{ reason = $r.Reason; age_basis = $r.Basis; modified = $r.Modified.ToString('o'); root = $r.Root; selectable = $true })
    $total += $r.Bytes; $i++
  }
  Write-Info ('total: ' + (Format-Bytes $total))
  $dest = 'the Recycle Bin'
  if ($ws.Permanent) { Write-Note '--permanent does not apply to personal files in section 19' }
  Write-Note "selected files go to $dest"
  $picks = @(Read-MultiSelect -Total $offer.Count -NoAutoYes -Candidates @($offer | ForEach-Object { $_.Path }))
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  if (-not $ws.DryRun) {
    if (-not (Confirm-Ui -Prompt "Move the selected files to $dest ($($picks.Count) file(s))?" -Default 'n' -NoAutoYes -ScriptedOk)) { Write-Info 'skipped'; return }
  }
  foreach ($k in $picks) {
    $row = $offer[$k - 1]
    $changed = Test-PersonalFileUnchanged $row
    if ($changed) { Write-Warn "kept $($row.Path) - $changed"; continue }
    $null = Send-ToRecycleBin -Path $row.Path -Within $row.Root -AlwaysRecycle
  }
}

function Show-DataScan {
  <# .SYNOPSIS Read-only listing of section 19 for --scan. #>
  $ws = $Script:WS
  Write-Section "Files >= $($ws.LargeFileMb) MB, or idle $($ws.Days)+ days, in Downloads and your added folders"
  $roots = @(Get-PersonalDataRoots)
  $rows = @(Find-PersonalFiles -Roots $roots -MinBytes ([long]$ws.LargeFileMb * 1MB) -Days $ws.Days | Where-Object { $_.Selectable } | Sort-Object Bytes -Descending)
  if ($rows.Count -eq 0) { Write-Info 'none found' } else { Show-DataScanTable @($rows | Select-Object -First 30) }
}
