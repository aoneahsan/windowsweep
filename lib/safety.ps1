# safety.ps1 - the deletion chokepoint and its guards.
#
# Every byte this tool removes passes through Remove-PathSafe (or Send-ToRecycleBin), which:
#   1. resolves the path and refuses relative segments, UNC paths, drive roots and system roots;
#   2. refuses every protected subtree / pattern / basename (Test-ProtectedPath);
#   3. asserts the path lies strictly inside the target root the caller declared (-Within);
#   4. short-circuits in --dry-run, printing what it would do and tallying an estimate;
#   5. removes reparse points as links, never following them; skips locked files, never fails a run.
# No flag bypasses steps 1-3.

function Initialize-Safety {
  <# .SYNOPSIS Build the protected-path tables from the environment. Called once at startup. #>
  $U = Get-FullPath $env:USERPROFILE
  $L = Get-FullPath $env:LOCALAPPDATA
  $A = Get-FullPath $env:APPDATA
  $LL = Get-FullPath (Join-Path (Split-Path -Parent $L) 'LocalLow')
  $SR = Get-FullPath $env:SystemRoot
  $PD = Get-FullPath $env:ProgramData
  $SD = $env:SystemDrive
  $PF = Get-FullPath $env:ProgramFiles
  $PF86 = Get-FullPath ${env:ProgramFiles(x86)}

  $exact = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($d in [IO.DriveInfo]::GetDrives()) { $null = $exact.Add($d.Name.TrimEnd('\')); $null = $exact.Add($d.Name) }
  foreach ($p in @($SR, "$SR\System32", "$SR\SysWOW64", $PF, $PF86, $PD, "$SD\Users", "$SD\Users\Default", "$SD\Users\Public", $env:PUBLIC, $U, "$U\AppData", $A, $L, $LL)) {
    if (-not $p) { continue }
    $fp = Get-FullPath $p
    if ($fp) { $null = $exact.Add($fp) }
  }

  $subtrees = @(
    "$U\Documents", "$U\Pictures", "$U\Music", "$U\Videos", "$U\Desktop", "$U\Contacts", "$U\Favorites", "$U\Links",
    "$U\Saved Games", "$U\Searches", "$U\3D Objects", "$U\Dropbox", "$U\Google Drive", "$U\iCloudDrive",
    "$U\.ssh", "$U\.gnupg", "$U\.secrets", "$U\.aws", "$U\.azure", "$U\.kube", "$U\.gcloud", "$U\.docker", "$U\.config",
    "$U\.local", "$U\.claude", "$U\.codex", "$U\.agents", "$U\.gemini", "$U\.copilot", "$U\.antigravity", "$U\.ollama",
    "$U\.vscode-server", "$U\.cursor-server", "$U\.password-store",
    "$A\npm", "$A\nvm", "$L\nvm", "$SD\nvm4w", "$L\Volta", "$L\fnm", "$L\fnm_multishells", "$L\node\corepack",
    "$L\pnpm\global", "$U\.bun\bin", "$U\.bun\install\global", "$U\.deno\bin", "$U\.cargo\bin", "$U\.rustup", "$U\go\bin",
    "$L\Programs", "$L\Microsoft\WindowsApps", "$L\Android\Sdk",
    "$SR\Prefetch", "$SR\Installer", "$SR\WinSxS", "$SR\System32\config", "$SR\servicing", "$SR\Boot", "$SR\Fonts",
    "$PD\Package Cache", "$PD\Microsoft\Windows\Start Menu",
    "$SD\`$Recycle.Bin", "$SD\System Volume Information", "$SD\Recovery", "$SD\Boot", "$SD\EFI"
  )
  # Declared exceptions: paths inside a protected subtree that ARE regenerable caches.
  $exceptions = @("$L\Android\Sdk\.temp", "$L\Android\Sdk\.downloadIntermediates")

  # Wildcards matched against the full path. Browser/editor state that must never be mistaken for cache.
  $patterns = @(
    "$U\OneDrive*", "*\Packages\*\LocalState*", "*\Packages\*\Settings*", "*\Packages\*\RoamingState*",
    '*chrome-for-testing*', '*\Chrome for Testing*',
    '*\User Data\Default', '*\User Data\Guest Profile', '*\User Data\System Profile', '*\User Data\Profile ?', '*\User Data\Profile ??',
    '*\User Data\*\Local Storage*', '*\User Data\*\Session Storage*', '*\User Data\*\IndexedDB*', '*\User Data\*\Cookies*',
    '*\User Data\*\Login Data*', '*\User Data\*\Web Data*', '*\User Data\*\Bookmarks*', '*\User Data\*\History*',
    '*\User Data\*\Sync Data*', '*\User Data\*\Preferences', '*\User Data\*\Secure Preferences', '*\User Data\*\Network\*',
    '*\User Data\*\File System*', '*\User Data\*\databases*', '*\User Data\*\Sessions*', '*\User Data\*\Extension State*',
    '*\User Data\*\Local Extension Settings*', '*\User Data\*\Sync Extension Settings*', '*\User Data\*\Extensions\*',
    '*\User Data\*\Service Worker\Database*', '*\User Data\*\Service Worker\CacheStorage*', '*\User Data\*\shared_proto_db*',
    '*\User\globalStorage*', '*\User\History*', '*\User\settings.json', '*\User\keybindings.json', '*\User\snippets*',
    "$U\.cache\claude*", "$U\.cache\codex*", "$U\.cache\gemini*", "$U\.cache\copilot*", "$L\JetBrains\Toolbox*",
    '*\Profiles\*\places.sqlite*', '*\Profiles\*\key4.db', '*\Profiles\*\logins.json', '*\Profiles\*\cookies.sqlite*',
    '*\Profiles\*\storage\*', '*\Profiles\*\prefs.js', '*\Profiles\*\extensions\*'
  )
  $basenames = @('NTUSER.DAT', 'NTUSER.DAT.LOG1', 'NTUSER.DAT.LOG2', 'ntuser.ini', 'UsrClass.dat', 'UsrClass.dat.LOG1',
    'UsrClass.dat.LOG2', 'hiberfil.sys', 'pagefile.sys', 'swapfile.sys', 'bootmgr', 'BOOTNXT', 'DumpStack.log.tmp')

  # Pre-normalized once: Get-ProtectionReason runs once per file during a prune (400k+ files on a big yarn
  # cache), so it must be plain string tests - no per-call path resolution, no per-call wildcard compile.
  $subtreesNorm = @($subtrees | ForEach-Object { Get-FullPath $_ } | Where-Object { $_ })
  $exceptionsNorm = @($exceptions | ForEach-Object { Get-FullPath $_ } | Where-Object { $_ })
  $wildcardIgnoreCase = [System.Management.Automation.WildcardOptions]::IgnoreCase
  $Script:WS_PROTECT = @{
    Exact = $exact
    Subtrees = $subtreesNorm
    SubtreePrefixes = @($subtreesNorm | ForEach-Object { $_ + '\' })
    Exceptions = $exceptionsNorm
    ExceptionPrefixes = @($exceptionsNorm | ForEach-Object { $_ + '\' })
    Patterns = $patterns
    PatternObjects = @($patterns | ForEach-Object { [System.Management.Automation.WildcardPattern]::Get($_, $wildcardIgnoreCase) })
    Basenames = $basenames
    HomePrefix = $null
  }
}

function Test-PathWithin {
  <# .SYNOPSIS True when Path equals Within or lies inside it (case-insensitive, normalized). #>
  param([string] $Path, [string] $Within)
  $p = Get-FullPath $Path; $w = Get-FullPath $Within
  if (-not $p -or -not $w) { return $false }
  if ($p.Equals($w, [StringComparison]::OrdinalIgnoreCase)) { return $true }
  $prefix = $w
  if (-not $prefix.EndsWith('\')) { $prefix = $prefix + '\' }
  return $p.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)
}

function Get-ProtectionReason {
  <# .SYNOPSIS Why a path may not be deleted, or $null when it is allowed.
     Hot path: called once per file during a prune, so it uses only the tables Initialize-Safety pre-normalized.
     "$p\" starts with "$root\" is exactly Test-PathWithin (equal, or inside) without the per-call resolution. #>
  param([string] $Path)
  if ([string]::IsNullOrWhiteSpace($Path)) { return 'empty path' }
  $raw = $Path.Trim()
  if ($raw -match '(^|[\\/])\.\.([\\/]|$)') { return 'relative ".." segment' }
  if ($raw.StartsWith('\\') -and -not $raw.StartsWith('\\?\')) { return 'UNC path' }
  $p = Get-FullPath $raw
  if (-not $p) { return 'unresolvable path' }
  if ($p.StartsWith('\\')) { return 'UNC path' }
  if ($p -match '^[A-Za-z]:\\?$') { return 'drive root' }
  $pr = $Script:WS_PROTECT
  if ($pr.Exact.Contains($p)) { return "protected root: $p" }
  $ic = [StringComparison]::OrdinalIgnoreCase
  $pSlash = $p + '\'
  foreach ($e in $pr.ExceptionPrefixes) { if ($pSlash.StartsWith($e, $ic)) { return $null } }
  for ($i = 0; $i -lt $pr.SubtreePrefixes.Count; $i++) {
    if ($pSlash.StartsWith($pr.SubtreePrefixes[$i], $ic)) { return "inside protected: $($pr.Subtrees[$i])" }
  }
  for ($i = 0; $i -lt $pr.PatternObjects.Count; $i++) {
    if ($pr.PatternObjects[$i].IsMatch($p)) { return "matches protected pattern: $($pr.Patterns[$i])" }
  }
  $base = [IO.Path]::GetFileName($p)
  foreach ($b in $pr.Basenames) { if ($base.Equals($b, $ic)) { return "protected file name: $b" } }
  if ($Script:WS.Home -and -not $Script:WS.AllowOwnData) {
    if (-not $pr.HomePrefix) { $pr.HomePrefix = (Get-FullPath $Script:WS.Home) + '\' }
    if ($pSlash.StartsWith($pr.HomePrefix, $ic)) { return 'the tool''s own data directory' }
  }
  return $null
}

function Test-ProtectedPath {
  param([string] $Path)
  return ($null -ne (Get-ProtectionReason $Path))
}

function New-RemoveResult {
  return [pscustomobject]@{ Removed = $false; Bytes = [long]0; Files = 0; Skipped = 0; SkippedBytes = [long]0; Reason = $null }
}

function Remove-ReadOnlyAttribute {
  param([string] $LongPath)
  try {
    $a = [IO.File]::GetAttributes($LongPath)
    if (($a -band [IO.FileAttributes]::ReadOnly) -ne 0) { [IO.File]::SetAttributes($LongPath, ($a -bxor [IO.FileAttributes]::ReadOnly)) }
  } catch { $null = $_ }
}

function Remove-TreeInternal {
  <# .SYNOPSIS Recursive delete that removes nested reparse points as links and skips locked files. Internal: guards already ran. #>
  param([string] $Path, [pscustomobject] $Result)
  $lp = Get-LongPath $Path
  $entries = @()
  try { $entries = (New-Object IO.DirectoryInfo($lp)).EnumerateFileSystemInfos() } catch { $Result.Skipped++; return $false }
  $allClear = $true
  foreach ($e in $entries) {
    $isLink = (($e.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0)
    $isDir = (($e.Attributes -band [IO.FileAttributes]::Directory) -ne 0)
    try {
      if ($isLink) {
        if ($isDir) { [IO.Directory]::Delete($e.FullName, $false) } else { [IO.File]::Delete($e.FullName) }
        Write-Log ("removed link (not followed): " + (Remove-LongPrefix $e.FullName))
      } elseif ($isDir) {
        if (-not (Remove-TreeInternal -Path $e.FullName -Result $Result)) { $allClear = $false }
      } else {
        Remove-ReadOnlyAttribute $e.FullName
        [IO.File]::Delete($e.FullName)
        $Result.Files++
      }
    } catch {
      $allClear = $false
      $Result.Skipped++
      try { if (-not $isDir) { $Result.SkippedBytes += [long]$e.Length } } catch { $null = $_ }
    }
  }
  if ($allClear) {
    try { [IO.Directory]::Delete($lp, $false) } catch { $allClear = $false; $Result.Skipped++ }
  }
  return $allClear
}

function Remove-PathSafe {
  <# .SYNOPSIS The chokepoint. Removes one file, directory or link after every guard passes. Honours --dry-run. #>
  param([Parameter(Mandatory = $true)][string] $Path, [Parameter(Mandatory = $true)][string] $Within, [string] $Label = '')
  $ws = $Script:WS
  $r = New-RemoveResult
  $tag = ''
  if ($Label) { $tag = " [$Label]" }
  $p = Get-FullPath $Path
  $w = Get-FullPath $Within
  if (-not $p -or -not $w) { $r.Reason = 'unresolvable path'; Write-Err "REFUSE ($($r.Reason)): $Path"; return $r }
  $why = Get-ProtectionReason $p
  if ($why) { $r.Reason = $why; Write-Err "REFUSE ($why): $p"; return $r }
  if ($p.Equals($w, [StringComparison]::OrdinalIgnoreCase)) { $r.Reason = 'target is its own declared root'; Write-Err "REFUSE ($($r.Reason)): $p"; return $r }
  if (-not (Test-PathWithin -Path $p -Within $w)) { $r.Reason = "outside declared root $w"; Write-Err "REFUSE ($($r.Reason)): $p"; return $r }
  $info = Get-ItemInfo $p
  if ($null -eq $info) { $r.Removed = $true; return $r }
  $isDir = ($info -is [IO.DirectoryInfo])
  $isLink = Test-ReparsePoint $info
  $bytes = [long]0
  if ($isLink) { $bytes = 0 } elseif ($isDir) { $bytes = (Get-DirectoryStats $p).Bytes } else { $bytes = [long]$info.Length }
  if ($ws.DryRun) {
    Write-DryRun ("would remove {0,10}  {1}" -f (Format-Bytes $bytes), $p)
    $r.Removed = $true; $r.Bytes = $bytes
    Add-Freed $bytes
    return $r
  }
  $lp = Get-LongPath $p
  try {
    if ($isLink) {
      if ($isDir) { [IO.Directory]::Delete($lp, $false) } else { [IO.File]::Delete($lp) }
      $r.Removed = $true
      Write-Log "removed link (not followed): $p$tag"
    } elseif ($isDir) {
      $r.Removed = Remove-TreeInternal -Path $p -Result $r
      $r.Bytes = [math]::Max([long]0, $bytes - $r.SkippedBytes)
      if ($r.Skipped -gt 0) { Write-Note "$($r.Skipped) item(s) in use or inaccessible, left in place under $p" }
      Write-Log ("removed dir: $p ($($r.Bytes) bytes, skipped $($r.Skipped))$tag")
    } else {
      Remove-ReadOnlyAttribute $lp
      [IO.File]::Delete($lp)
      $r.Removed = $true; $r.Bytes = $bytes; $r.Files = 1
      Write-Log "removed file: $p ($bytes bytes)$tag"
    }
    Add-Freed $r.Bytes
  } catch {
    $r.Skipped++
    $r.Reason = 'in use or access denied'
    Write-Note "in use or inaccessible, skipped: $p"
    Write-Log "skip (locked): $p - $($_.Exception.Message)"
  }
  return $r
}

function Remove-StaleFiles {
  <# .SYNOPSIS Prune files idle >= Days under Root (both timestamps rule), then sweep empty directories. #>
  param([Parameter(Mandatory = $true)][string] $Root, [Parameter(Mandatory = $true)][string] $Within, [int] $Days, [string] $Label = '')
  $ws = $Script:WS
  $out = [pscustomobject]@{ Freed = [long]0; Files = 0; Skipped = 0; Exists = $false }
  if (-not $Label) { $Label = $Root }
  $root = Get-FullPath $Root
  if (-not (Test-DirPresent $root)) { Write-Info "$Label - absent"; return $out }
  if (Test-ReparsePoint (Get-ItemInfo $root)) { Write-Note "$Label - is a link, not entered"; return $out }
  $out.Exists = $true
  $why = Get-ProtectionReason $root
  if ($why) { Write-Err "REFUSE ($why): $root"; return $out }
  if (-not (Test-PathWithin -Path $root -Within $Within)) { Write-Err "REFUSE (outside declared root): $root"; return $out }
  $scan = Get-StaleFiles -Root $root -Days $Days
  $total = [long]0
  foreach ($f in $scan.Files) { $total += $f.Bytes }
  if ($scan.Files.Count -eq 0) { Write-Info "$Label - nothing idle for $Days+ days"; return $out }
  if ($ws.DryRun) {
    Write-DryRun ("would prune {0} in {1} files idle {2}+ days from {3}" -f (Format-Bytes $total), $scan.Files.Count, $Days, $root)
    $out.Freed = $total; $out.Files = $scan.Files.Count
    Add-Freed $total
    return $out
  }
  foreach ($f in $scan.Files) {
    $why = Get-ProtectionReason $f.Path
    if ($why) { $out.Skipped++; continue }
    try {
      Remove-ReadOnlyAttribute $f.Path
      [IO.File]::Delete($f.Path)
      $out.Freed += $f.Bytes; $out.Files++
    } catch { $out.Skipped++ }
  }
  # Sweep directories that became empty, deepest first; never the root itself.
  $dirs = @($scan.Dirs | Sort-Object { $_.Length } -Descending)
  foreach ($d in $dirs) {
    try {
      $di = New-Object IO.DirectoryInfo($d)
      if (($di.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { continue }
      $any = $false
      foreach ($x in $di.EnumerateFileSystemInfos()) { $any = $true; break }
      if (-not $any) { [IO.Directory]::Delete($d, $false) }
    } catch { $null = $_ }
  }
  Add-Freed $out.Freed
  Write-Log ("pruned $($out.Files) files ($($out.Freed) bytes) idle $Days+ days from $root; skipped $($out.Skipped)")
  Write-Ok ("$Label - pruned {0} in {1} files idle {2}+ days ({3} skipped in use)" -f (Format-Bytes $out.Freed), $out.Files, $Days, $out.Skipped)
  return $out
}

function Remove-StaleUnits {
  <# .SYNOPSIS Treat each top-level child as one unit (a tool version, an AVD). Delete units idle >= Days;
     -KeepNewest never removes the freshest unit of each group (-GroupBy maps a name to its group; default: one group). #>
  param([Parameter(Mandatory = $true)][string] $Root, [Parameter(Mandatory = $true)][string] $Within, [int] $Days,
    [string] $Pattern = '*', [switch] $KeepNewest, [switch] $DirectoriesOnly, [scriptblock] $GroupBy = $null,
    [string[]] $ExcludeNames = @(), [string] $Label = '')
  $out = [pscustomobject]@{ Inspected = 0; Pruned = 0; Kept = 0; Freed = [long]0; Exists = $false }
  if (-not $Label) { $Label = $Root }
  $root = Get-FullPath $Root
  if (-not (Test-DirPresent $root)) { Write-Info "$Label - absent"; return $out }
  if (Test-ReparsePoint (Get-ItemInfo $root)) { Write-Note "$Label - is a link, not entered"; return $out }
  $out.Exists = $true
  $why = Get-ProtectionReason $root
  if ($why) { Write-Err "REFUSE ($why): $root"; return $out }
  if (-not (Test-PathWithin -Path $root -Within $Within)) { Write-Err "REFUSE (outside declared root): $root"; return $out }
  $units = @()
  foreach ($e in (Get-ChildEntries $root)) {
    if ($DirectoriesOnly -and -not ($e -is [IO.DirectoryInfo])) { continue }
    if ($e.Name -notlike $Pattern) { continue }
    if ($ExcludeNames -contains $e.Name) { continue }
    if (Test-ReparsePoint $e) { continue }
    $full = Remove-LongPrefix $e.FullName
    $group = 'all'
    if ($GroupBy) { $group = [string](& $GroupBy $e.Name) }
    $units += [pscustomobject]@{ Name = $e.Name; Path = $full; Idle = (Get-IdleDays $full); IsDir = ($e -is [IO.DirectoryInfo]); Group = $group }
  }
  if ($units.Count -eq 0) { Write-Info "$Label - nothing to inspect"; return $out }
  $keep = @{}
  if ($KeepNewest) {
    foreach ($g in ($units | Group-Object Group)) {
      $freshest = $g.Group | Sort-Object Idle | Select-Object -First 1
      $keep[$freshest.Path] = $true
    }
  }
  foreach ($u in ($units | Sort-Object Name)) {
    $out.Inspected++
    if ($KeepNewest -and $keep.ContainsKey($u.Path)) {
      Write-Note ("kept  {0}  (newest of its kind, {1}d idle)" -f $u.Name, $u.Idle)
      $out.Kept++
      continue
    }
    if ($u.Idle -ge $Days) {
      $r = Remove-PathSafe -Path $u.Path -Within $Within -Label $u.Name
      if ($r.Removed) {
        $out.Pruned++; $out.Freed += $r.Bytes
        if (-not $Script:WS.DryRun) { Write-Ok ("pruned {0}  ({1}d idle, {2})" -f $u.Name, $u.Idle, (Format-Bytes $r.Bytes)) }
      }
    } else {
      Write-Note ("kept  {0}  ({1}d idle, within the {2}-day window)" -f $u.Name, $u.Idle, $Days)
      $out.Kept++
    }
  }
  return $out
}

function Clear-DirectoryContents {
  <# .SYNOPSIS Remove everything inside Path (never Path itself). -OlderThanDays limits it to idle entries. #>
  param([Parameter(Mandatory = $true)][string] $Path, [Parameter(Mandatory = $true)][string] $Within, [int] $OlderThanDays = 0, [string] $Label = '')
  $out = [pscustomobject]@{ Freed = [long]0; Items = 0; Skipped = 0; Exists = $false }
  if (-not $Label) { $Label = $Path }
  $p = Get-FullPath $Path
  if (-not (Test-DirPresent $p)) { Write-Info "$Label - absent"; return $out }
  if (Test-ReparsePoint (Get-ItemInfo $p)) { Write-Note "$Label - is a link, not entered"; return $out }
  $out.Exists = $true
  $why = Get-ProtectionReason $p
  if ($why) { Write-Err "REFUSE ($why): $p"; return $out }
  if (-not (Test-PathWithin -Path $p -Within $Within)) { Write-Err "REFUSE (outside declared root $Within): $p"; return $out }
  $entries = @(Get-ChildEntries $p)
  if ($entries.Count -eq 0) { Write-Info "$Label - already empty"; return $out }
  if ($Script:WS.DryRun) {
    # One line per folder in dry-run: the estimate is the sum of what each eligible child would free.
    $est = [long]0; $n = 0
    foreach ($e in $entries) {
      $full = Remove-LongPrefix $e.FullName
      if ($OlderThanDays -gt 0 -and (Get-IdleDays $full) -lt $OlderThanDays) { continue }
      if (Get-ProtectionReason $full) { continue }
      if (Test-ReparsePoint $e) { $n++; continue }
      if ($e -is [IO.DirectoryInfo]) { $est += (Get-DirectoryStats $full).Bytes } else { $est += [long]$e.Length }
      $n++
    }
    if ($n -eq 0) { Write-Info "$Label - nothing eligible"; return $out }
    $age = ''
    if ($OlderThanDays -gt 0) { $age = " idle $OlderThanDays+ days" }
    Write-DryRun ("would clear {0} in {1} items{2} from {3}" -f (Format-Bytes $est), $n, $age, $p)
    Add-Freed $est
    $out.Items = $n; $out.Freed = $est
    return $out
  }
  foreach ($e in $entries) {
    $full = Remove-LongPrefix $e.FullName
    if ($OlderThanDays -gt 0 -and (Get-IdleDays $full) -lt $OlderThanDays) { continue }
    $r = Remove-PathSafe -Path $full -Within $p -Label $Label
    if ($r.Removed) { $out.Items++; $out.Freed += $r.Bytes }
    $out.Skipped += $r.Skipped
  }
  if (-not $Script:WS.DryRun -and $out.Items -gt 0) {
    Write-Ok ("$Label - cleared {0} ({1} items, {2} skipped in use)" -f (Format-Bytes $out.Freed), $out.Items, $out.Skipped)
  } elseif (-not $Script:WS.DryRun) {
    Write-Info "$Label - nothing eligible"
  }
  return $out
}

function Send-ToRecycleBin {
  <# .SYNOPSIS Move a personal file/folder to the Recycle Bin (or delete when --permanent). Same guards as Remove-PathSafe. #>
  param([Parameter(Mandatory = $true)][string] $Path, [Parameter(Mandatory = $true)][string] $Within)
  $ws = $Script:WS
  if ($ws.Permanent) { return (Remove-PathSafe -Path $Path -Within $Within) }
  $r = New-RemoveResult
  $p = Get-FullPath $Path
  $why = Get-ProtectionReason $p
  if ($why) { $r.Reason = $why; Write-Err "REFUSE ($why): $p"; return $r }
  if (-not (Test-PathWithin -Path $p -Within $Within) -or $p.Equals((Get-FullPath $Within), [StringComparison]::OrdinalIgnoreCase)) {
    $r.Reason = "outside declared root $Within"; Write-Err "REFUSE ($($r.Reason)): $p"; return $r
  }
  $info = Get-ItemInfo $p
  if ($null -eq $info) { $r.Removed = $true; return $r }
  $bytes = [long](Get-DirectoryStats $p).Bytes
  if ($ws.DryRun) { Write-DryRun ("would move to Recycle Bin {0,10}  {1}" -f (Format-Bytes $bytes), $p); $r.Removed = $true; $r.Bytes = $bytes; Add-Freed $bytes; return $r }
  try {
    Add-Type -AssemblyName Microsoft.VisualBasic -ErrorAction Stop
    if ($info -is [IO.DirectoryInfo]) {
      [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($p, [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs, [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin)
    } else {
      [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($p, [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs, [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin)
    }
    $r.Removed = $true; $r.Bytes = $bytes
    Add-Freed $bytes
    Write-Log "recycled: $p ($bytes bytes)"
    Write-Ok ("moved to Recycle Bin: {0} ({1})" -f $p, (Format-Bytes $bytes))
  } catch {
    $r.Skipped++; $r.Reason = $_.Exception.Message
    Write-Warn "could not recycle $p - $($_.Exception.Message)"
  }
  return $r
}

function Invoke-External {
  <# .SYNOPSIS Run an external command, streaming its output to the log. -Destructive commands are skipped in --dry-run. #>
  param([Parameter(Mandatory = $true)][string] $FilePath, [string[]] $ArgumentList = @(), [switch] $Destructive, [switch] $Quiet, [string] $Label = '')
  $display = "$FilePath $($ArgumentList -join ' ')"
  $tag = ''
  if ($Label) { $tag = " [$Label]" }
  if ($Destructive -and $Script:WS.DryRun) {
    Write-DryRun "would run: $display"
    return [pscustomobject]@{ Ran = $false; ExitCode = 0; Output = @() }
  }
  Write-Log "run${tag}: $display"
  $lines = @()
  try {
    $raw = & $FilePath @ArgumentList 2>&1
    foreach ($l in $raw) {
      $s = [string]$l
      $lines += $s
      if (-not $Quiet) { Write-Note $s } else { Write-Log $s }
    }
    $code = $LASTEXITCODE
    if ($null -eq $code) { $code = 0 }
  } catch {
    $lines += $_.Exception.Message
    $code = 1
  }
  Write-Log "exit $code$tag : $display"
  return [pscustomobject]@{ Ran = $true; ExitCode = $code; Output = $lines }
}

function Test-CommandPresent {
  param([string] $Name)
  return ($null -ne (Get-Command $Name -ErrorAction SilentlyContinue))
}

function Test-ProcessRunning {
  <# .SYNOPSIS True when any process with one of the given names is running. #>
  param([string[]] $Names)
  foreach ($n in $Names) {
    if (@(Get-Process -Name $n -ErrorAction SilentlyContinue).Count -gt 0) { return $true }
  }
  return $false
}

function Test-IsAdmin {
  try {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    return (New-Object Security.Principal.WindowsPrincipal($id)).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  } catch { return $false }
}

function Test-CanElevate {
  <# .SYNOPSIS True when the account belongs to Administrators (even in a filtered, non-elevated token). #>
  try {
    $out = & "$env:SystemRoot\System32\whoami.exe" /groups /fo csv 2>$null
    foreach ($l in $out) { if ($l -match 'S-1-5-32-544') { return $true } }
  } catch { $null = $_ }
  return $false
}

function Invoke-Elevated {
  <# .SYNOPSIS Relaunch this run elevated (UAC prompt) and wait for it. Returns the child's exit code. #>
  $ws = $Script:WS
  $childArgs = @('-NoProfile', '-NoLogo', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $ws.ScriptPath + '"'))
  foreach ($a in $ws.RawArgs) {
    if ($a -eq '--elevate') { continue }
    if ($a -match '[\s"]') { $childArgs += ('"' + ($a -replace '"', '\"') + '"') } else { $childArgs += $a }
  }
  $childArgs += '--elevated-child'
  Write-Info 'Requesting elevation (a UAC prompt appears). The elevated run opens in a new window and writes its own log.'
  try {
    $proc = Start-Process -FilePath 'powershell.exe' -ArgumentList $childArgs -Verb RunAs -Wait -PassThru
    return $proc.ExitCode
  } catch {
    Write-Err "elevation refused or failed: $($_.Exception.Message)"
    return $Script:WS_EXIT_REFUSED
  }
}
