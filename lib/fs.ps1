# fs.ps1 - long-path-safe filesystem helpers. The walker never descends into reparse points
# (junctions / symlinks), which .NET's own recursive enumeration does.

function Get-LongPath {
  <# .SYNOPSIS Prefix an absolute path with \\?\ so .NET accepts paths longer than 260 chars. #>
  param([string] $Path)
  if ($Path.StartsWith('\\?\')) { return $Path }
  if ($Path.StartsWith('\\')) { return ('\\?\UNC\' + $Path.Substring(2)) }
  return ('\\?\' + $Path)
}

function Get-FullPath {
  <# .SYNOPSIS Expand env vars, resolve . and .., strip the long prefix and trailing separators. $null if unresolvable. #>
  param([string] $Path)
  if ([string]::IsNullOrWhiteSpace($Path)) { return $null }
  $p = [Environment]::ExpandEnvironmentVariables($Path.Trim())
  if ($p.StartsWith('\\?\UNC\')) { $p = '\\' + $p.Substring(8) } elseif ($p.StartsWith('\\?\')) { $p = $p.Substring(4) }
  try { $p = [IO.Path]::GetFullPath($p) } catch { return $null }
  if ($p.Length -gt 3) { $p = $p.TrimEnd('\') }
  return $p
}

function Get-ItemInfo {
  <# .SYNOPSIS FileInfo or DirectoryInfo for a path (long-path aware), or $null when absent. #>
  param([string] $Path)
  $lp = Get-LongPath $Path
  try {
    if ([IO.Directory]::Exists($lp)) { return (New-Object IO.DirectoryInfo($lp)) }
    if ([IO.File]::Exists($lp)) { return (New-Object IO.FileInfo($lp)) }
  } catch { $null = $_ }
  return $null
}

function Test-PathPresent {
  param([string] $Path)
  $lp = Get-LongPath $Path
  try { return ([IO.Directory]::Exists($lp) -or [IO.File]::Exists($lp)) } catch { return $false }
}

function Test-DirPresent {
  param([string] $Path)
  try { return [IO.Directory]::Exists((Get-LongPath $Path)) } catch { return $false }
}

function Test-ReparsePoint {
  <# .SYNOPSIS True when the FileSystemInfo is a junction or symbolic link. #>
  param([System.IO.FileSystemInfo] $Info)
  if ($null -eq $Info) { return $false }
  return (($Info.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0)
}

function Get-ChildEntries {
  <# .SYNOPSIS Non-recursive children of a directory; empty on access errors. #>
  param([string] $Path)
  $out = @()
  try {
    $di = New-Object IO.DirectoryInfo((Get-LongPath $Path))
    foreach ($e in $di.EnumerateFileSystemInfos()) { $out += $e }
  } catch { $null = $_ }
  return $out
}

function Get-NewestTimestampUtc {
  <# .SYNOPSIS The most recent of write / access / creation time - the safe "last touched" estimate when access tracking is off.
     -IgnoreAccess drops last-access (D82: used where Test-LastAccessLive found it carries no signal). #>
  param([System.IO.FileSystemInfo] $Info, [switch] $IgnoreAccess)
  $t = $Info.LastWriteTimeUtc
  if (-not $IgnoreAccess) { try { if ($Info.LastAccessTimeUtc -gt $t) { $t = $Info.LastAccessTimeUtc } } catch { $null = $_ } }
  try { if ($Info.CreationTimeUtc -gt $t) { $t = $Info.CreationTimeUtc } } catch { $null = $_ }
  return $t
}

# D82 (owner, 2026-11-02): last-access can be live - Windows updating it, or an indexer, backup, antivirus or disk
# scanner reading every file - and then every file looks touched today, so an idle gate deletes nothing (the P52:
# a 30-day developer run found 1.5 GB of ~37 GB). Each root is sampled once. When at least WS_ACCESS_SAMPLE_MIN
# files written or created a week or more ago were nearly all "read" within the last day, last-access says
# nothing there and idle age uses write/creation time for that root. A root too small to judge inherits a live
# verdict already reached on its volume; otherwise it keeps the conservative newest-of-three.
$Script:WS_ACCESS_LIVE = @{}
$Script:WS_ACCESS_LIVE_VOLUME = @{}
$Script:WS_ACCESS_SAMPLE_MIN = 20
$Script:WS_ACCESS_SAMPLE_MAX = 400
$Script:WS_ACCESS_LIVE_RATIO = 0.9

function Test-AccessSampleLive {
  <# .SYNOPSIS The D82 verdict for a counted sample: enough old files, and nearly all of them read in the last day. #>
  param([int] $Old, [int] $FreshAccess)
  if ($Old -lt $Script:WS_ACCESS_SAMPLE_MIN) { return $false }
  return (($FreshAccess / [double]$Old) -ge $Script:WS_ACCESS_LIVE_RATIO)
}

function Get-VolumeKey {
  <# .SYNOPSIS Lower-case volume root of a path ("c:\"), or '' when it cannot be resolved. #>
  param([string] $Path)
  $full = Get-FullPath $Path
  if (-not $full) { return '' }
  try { return ([IO.Path]::GetPathRoot($full)).ToLowerInvariant() } catch { return '' }
}

function Get-AccessLiveVolumes {
  <# .SYNOPSIS Volumes where a D82 sample found last-access live this run ("C:", "D:") - the --json summary names them. #>
  return @($Script:WS_ACCESS_LIVE_VOLUME.Keys | ForEach-Object { ([string]$_).TrimEnd('\').ToUpperInvariant() } | Sort-Object)
}

function Reset-AccessVerdicts {
  <# .SYNOPSIS Forget every D82 verdict (the self-test isolates its fixtures with this). #>
  $Script:WS_ACCESS_LIVE = @{}
  $Script:WS_ACCESS_LIVE_VOLUME = @{}
}

function Test-LastAccessLive {
  <# .SYNOPSIS $true when last-access carries no signal under Root (D82). Judged once per root from a bounded,
     breadth-first sample that never follows reparse points; the answer is cached for the run. #>
  param([string] $Root)
  $full = Get-FullPath $Root
  if (-not $full) { return $false }
  $key = $full.ToLowerInvariant()
  if ($Script:WS_ACCESS_LIVE.ContainsKey($key)) { return [bool]$Script:WS_ACCESS_LIVE[$key] }
  $now = [datetime]::UtcNow
  $oldCut = $now.AddDays(-7); $freshCut = $now.AddDays(-1)
  $old = 0; $fresh = 0; $seen = 0
  $rootInfo = Get-ItemInfo $full
  if ($rootInfo -is [IO.DirectoryInfo] -and -not (Test-ReparsePoint $rootInfo)) {
    $queue = New-Object System.Collections.Generic.Queue[System.IO.DirectoryInfo]
    $queue.Enqueue($rootInfo)
    while ($queue.Count -gt 0 -and $seen -lt $Script:WS_ACCESS_SAMPLE_MAX) {
      $dir = $queue.Dequeue()
      $entries = $null
      try { $entries = $dir.EnumerateFileSystemInfos() } catch { continue }
      try {
        foreach ($e in $entries) {
          if (($e.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { continue }
          if (($e.Attributes -band [IO.FileAttributes]::Directory) -ne 0) { $queue.Enqueue([IO.DirectoryInfo]$e); continue }
          $seen++
          if ((Get-NewestTimestampUtc $e -IgnoreAccess) -le $oldCut) {
            $old++
            if ($e.LastAccessTimeUtc -ge $freshCut) { $fresh++ }
          }
          if ($seen -ge $Script:WS_ACCESS_SAMPLE_MAX) { break }
        }
      } catch { $null = $_ }
    }
  }
  if ($old -ge $Script:WS_ACCESS_SAMPLE_MIN) {
    $live = Test-AccessSampleLive -Old $old -FreshAccess $fresh
    $Script:WS_ACCESS_LIVE[$key] = $live
    $vol = Get-VolumeKey $full
    if ($live -and $vol -and -not $Script:WS_ACCESS_LIVE_VOLUME.ContainsKey($vol)) {
      $Script:WS_ACCESS_LIVE_VOLUME[$vol] = $true
      $msg = "last-access looks live on {0} ({1} of {2} files written a week or more ago were read in the last day) - idle age there uses write/creation time" -f $vol.TrimEnd('\').ToUpperInvariant(), $fresh, $old
      Write-Note $msg
      Write-LogLine "idle basis: $msg (first seen under $full)"
    }
    return $live
  }
  $vol = Get-VolumeKey $full
  $inherit = [bool]($vol -and $Script:WS_ACCESS_LIVE_VOLUME.ContainsKey($vol))
  $Script:WS_ACCESS_LIVE[$key] = $inherit
  return $inherit
}

function Format-Utc8601 {
  <# .SYNOPSIS ISO 8601 UTC for a timestamp, or $null when nothing was found (the MinValue sentinel).
     Get-DirectoryStats returns MinValue for an empty or unreadable tree, and "0001-01-01" in a contract
     field would read as a real date a caller could sort on. #>
  param([datetime] $When)
  if ($When -le [datetime]::MinValue) { return $null }
  return $When.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
}

function Get-DirectoryStats {
  <# .SYNOPSIS Walk a tree without following reparse points. Returns Bytes, Files, Dirs, Links, Newest (UTC), Errors.
     -IgnoreAccess leaves last-access out of Newest (D82). #>
  param([string] $Path, [switch] $IgnoreAccess)
  $bytes = [long]0; $files = 0; $dirs = 0; $links = 0; $errors = 0
  $newest = [datetime]::MinValue
  $root = Get-ItemInfo $Path
  if ($null -eq $root) { return [pscustomobject]@{ Bytes = 0; Files = 0; Dirs = 0; Links = 0; Newest = $newest; Errors = 0; Exists = $false } }
  if ($root -is [IO.FileInfo]) {
    return [pscustomobject]@{ Bytes = [long]$root.Length; Files = 1; Dirs = 0; Links = 0; Newest = (Get-NewestTimestampUtc $root -IgnoreAccess:$IgnoreAccess); Errors = 0; Exists = $true }
  }
  if (Test-ReparsePoint $root) {
    return [pscustomobject]@{ Bytes = 0; Files = 0; Dirs = 0; Links = 1; Newest = (Get-NewestTimestampUtc $root -IgnoreAccess:$IgnoreAccess); Errors = 0; Exists = $true }
  }
  $stack = New-Object System.Collections.Generic.Stack[System.IO.DirectoryInfo]
  $stack.Push($root)
  while ($stack.Count -gt 0) {
    $dir = $stack.Pop()
    $entries = $null
    try { $entries = $dir.EnumerateFileSystemInfos() } catch { $errors++; continue }
    try {
      foreach ($e in $entries) {
        if (($e.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { $links++; continue }
        if (($e.Attributes -band [IO.FileAttributes]::Directory) -ne 0) { $dirs++; $stack.Push([IO.DirectoryInfo]$e); continue }
        $files++
        $bytes += [long]$e.Length
        $t = $e.LastWriteTimeUtc
        if (-not $IgnoreAccess -and $e.LastAccessTimeUtc -gt $t) { $t = $e.LastAccessTimeUtc }
        if ($e.CreationTimeUtc -gt $t) { $t = $e.CreationTimeUtc }
        if ($t -gt $newest) { $newest = $t }
      }
    } catch { $errors++ }
  }
  if ($newest -eq [datetime]::MinValue) { $newest = Get-NewestTimestampUtc $root -IgnoreAccess:$IgnoreAccess }
  return [pscustomobject]@{ Bytes = $bytes; Files = $files; Dirs = $dirs; Links = $links; Newest = $newest; Errors = $errors; Exists = $true }
}

function Get-DirectoryBytes {
  <# .SYNOPSIS Total bytes under a path (0 when absent). Uses robocopy /L when available - it is native and fast. #>
  param([string] $Path)
  if (-not (Test-PathPresent $Path)) { return [long]0 }
  $info = Get-ItemInfo $Path
  if ($info -is [IO.FileInfo]) { return [long]$info.Length }
  if (Test-ReparsePoint $info) { return [long]0 }
  if (Get-Command robocopy.exe -ErrorAction SilentlyContinue) {
    try {
      $sink = Join-Path $env:TEMP ('windowsweep-null-' + [guid]::NewGuid().ToString('N'))
      $lines = & robocopy.exe $Path $sink /L /S /NJH /BYTES /NFL /NDL /NC /NS /XJ /R:0 /W:0 2>$null
      foreach ($line in $lines) {
        if ($line -match '^\s*Bytes\s*:\s*(\d+)') { return [long]$Matches[1] }
      }
    } catch { $null = $_ }
  }
  return [long](Get-DirectoryStats $Path).Bytes
}

function Get-IdleDays {
  <# .SYNOPSIS Days since the path (or anything inside it) was last touched. 999999 when absent.
     Last-access counts unless Test-LastAccessLive found it carries no signal here (D82). #>
  param([string] $Path)
  $info = Get-ItemInfo $Path
  if ($null -eq $info) { return 999999 }
  $ignore = Test-LastAccessLive -Root $Path
  if ($info -is [IO.FileInfo] -or (Test-ReparsePoint $info)) {
    return [int][math]::Floor(([datetime]::UtcNow - (Get-NewestTimestampUtc $info -IgnoreAccess:$ignore)).TotalDays)
  }
  $stats = Get-DirectoryStats $Path -IgnoreAccess:$ignore
  return [int][math]::Floor(([datetime]::UtcNow - $stats.Newest).TotalDays)
}

function Get-StaleFiles {
  <# .SYNOPSIS Files under Root whose newest timestamp is at least Days old; never follows reparse points.
     Returns objects with Path, Bytes. Also returns the list of directories visited (for the empty sweep). #>
  param([string] $Root, [int] $Days)
  $cutoff = [datetime]::UtcNow.AddDays(-1 * $Days)
  $stale = New-Object System.Collections.Generic.List[object]
  $visited = New-Object System.Collections.Generic.List[string]
  $rootInfo = Get-ItemInfo $Root
  if ($null -eq $rootInfo -or -not ($rootInfo -is [IO.DirectoryInfo]) -or (Test-ReparsePoint $rootInfo)) {
    return [pscustomobject]@{ Files = $stale; Dirs = $visited }
  }
  $ignore = Test-LastAccessLive -Root $Root
  $stack = New-Object System.Collections.Generic.Stack[System.IO.DirectoryInfo]
  $stack.Push($rootInfo)
  while ($stack.Count -gt 0) {
    $dir = $stack.Pop()
    $entries = $null
    try { $entries = $dir.EnumerateFileSystemInfos() } catch { continue }
    try {
      foreach ($e in $entries) {
        if (($e.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { continue }
        if (($e.Attributes -band [IO.FileAttributes]::Directory) -ne 0) {
          $visited.Add($e.FullName)
          $stack.Push([IO.DirectoryInfo]$e)
          continue
        }
        $t = $e.LastWriteTimeUtc
        if (-not $ignore -and $e.LastAccessTimeUtc -gt $t) { $t = $e.LastAccessTimeUtc }
        if ($e.CreationTimeUtc -gt $t) { $t = $e.CreationTimeUtc }
        if ($t -le $cutoff) { $stale.Add([pscustomobject]@{ Path = $e.FullName; Bytes = [long]$e.Length }) }
      }
    } catch { $null = $_ }
  }
  return [pscustomobject]@{ Files = $stale; Dirs = $visited }
}

function Remove-LongPrefix {
  <# .SYNOPSIS Strip \\?\ for display. #>
  param([string] $Path)
  if ($Path.StartsWith('\\?\UNC\')) { return ('\\' + $Path.Substring(8)) }
  if ($Path.StartsWith('\\?\')) { return $Path.Substring(4) }
  return $Path
}
