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
  <# .SYNOPSIS The most recent of write / access / creation time - the safe "last touched" estimate when access tracking is off. #>
  param([System.IO.FileSystemInfo] $Info)
  $t = $Info.LastWriteTimeUtc
  try { if ($Info.LastAccessTimeUtc -gt $t) { $t = $Info.LastAccessTimeUtc } } catch { $null = $_ }
  try { if ($Info.CreationTimeUtc -gt $t) { $t = $Info.CreationTimeUtc } } catch { $null = $_ }
  return $t
}

function Get-DirectoryStats {
  <# .SYNOPSIS Walk a tree without following reparse points. Returns Bytes, Files, Dirs, Links, Newest (UTC), Errors. #>
  param([string] $Path)
  $bytes = [long]0; $files = 0; $dirs = 0; $links = 0; $errors = 0
  $newest = [datetime]::MinValue
  $root = Get-ItemInfo $Path
  if ($null -eq $root) { return [pscustomobject]@{ Bytes = 0; Files = 0; Dirs = 0; Links = 0; Newest = $newest; Errors = 0; Exists = $false } }
  if ($root -is [IO.FileInfo]) {
    return [pscustomobject]@{ Bytes = [long]$root.Length; Files = 1; Dirs = 0; Links = 0; Newest = (Get-NewestTimestampUtc $root); Errors = 0; Exists = $true }
  }
  if (Test-ReparsePoint $root) {
    return [pscustomobject]@{ Bytes = 0; Files = 0; Dirs = 0; Links = 1; Newest = (Get-NewestTimestampUtc $root); Errors = 0; Exists = $true }
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
        if ($e.LastAccessTimeUtc -gt $t) { $t = $e.LastAccessTimeUtc }
        if ($e.CreationTimeUtc -gt $t) { $t = $e.CreationTimeUtc }
        if ($t -gt $newest) { $newest = $t }
      }
    } catch { $errors++ }
  }
  if ($newest -eq [datetime]::MinValue) { $newest = Get-NewestTimestampUtc $root }
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
  <# .SYNOPSIS Days since the path (or anything inside it) was last touched. 999999 when absent. #>
  param([string] $Path)
  $info = Get-ItemInfo $Path
  if ($null -eq $info) { return 999999 }
  if ($info -is [IO.FileInfo] -or (Test-ReparsePoint $info)) {
    return [int][math]::Floor(([datetime]::UtcNow - (Get-NewestTimestampUtc $info)).TotalDays)
  }
  $stats = Get-DirectoryStats $Path
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
        if ($e.LastAccessTimeUtc -gt $t) { $t = $e.LastAccessTimeUtc }
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
