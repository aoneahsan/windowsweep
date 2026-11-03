# browsers.ps1 - section 7: browser caches for every profile. Profile data is never touched.
# 1.4.0: --browser-profile-roots / browserProfileRoots name folders that hold Chromium user-data directories of
# their own - automation and test profiles (the P52 kept 2.0 GB of cache in ~\.local\share\ahsan-automation\profiles,
# 2026-11-02). Only the declared cache folders inside them are cleared (D79), and a profile a running browser
# holds through --user-data-dir is skipped. ASCII only.

function Get-DeclaredProfileDirs {
  <# .SYNOPSIS Chromium user-data directories (a folder holding "Local State") under the declared roots, up to
     three levels deep, never through a junction. #>
  param([string[]] $Roots = @($Script:WS.BrowserProfileRoots))
  $out = @()
  $seen = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($r in $Roots) {
    if (-not $r -or -not (Test-DirPresent $r)) { continue }
    $stack = New-Object System.Collections.Generic.Stack[object]
    $stack.Push(@((Get-FullPath $r), 0))
    $visited = 0
    while ($stack.Count -gt 0 -and $visited -lt 5000) {
      $item = $stack.Pop(); $dir = [string]$item[0]; $depth = [int]$item[1]; $visited++
      if (Test-PathPresent (Join-Path $dir 'Local State')) { if ($seen.Add($dir)) { $out += $dir }; continue }
      if ($depth -ge 3) { continue }
      foreach ($e in (Get-ChildEntries $dir)) { if ($e -is [IO.DirectoryInfo] -and -not (Test-ReparsePoint $e)) { $stack.Push(@((Remove-LongPrefix $e.FullName), ($depth + 1))) } }
    }
  }
  return $out
}

function Get-UserDataDirFromCommandLine {
  <# .SYNOPSIS The --user-data-dir a browser command line names, as a full path, or ''. Handles
     --user-data-dir=C:\a, --user-data-dir="C:\a b" and "--user-data-dir=C:\a b". #>
  param([string] $CommandLine)
  $t = [string]$CommandLine
  $v = ''
  if ($t -match '"--user-data-dir=([^"]+)"') { $v = $Matches[1] }
  elseif ($t -match '--user-data-dir="([^"]+)"') { $v = $Matches[1] }
  elseif ($t -match '--user-data-dir=([^\s"]+)') { $v = $Matches[1] }
  if (-not $v) { return '' }
  return (Get-FullPath $v.Trim())
}

function Get-BusyUserDataDirs {
  $set = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  try {
    foreach ($p in @(Get-CimInstance Win32_Process -Property CommandLine -ErrorAction Stop)) {
      $d = Get-UserDataDirFromCommandLine ([string]$p.CommandLine)
      if ($d) { $null = $set.Add($d) }
    }
  } catch { $null = $_ }
  return , $set
}

function Initialize-ProfileRootExceptions {
  <# .SYNOPSIS Called once after the settings merge (D79): exceptions for exactly the cache folders of the user-data
     directories under the declared roots - those folders and nothing above or beside them. #>
  if (@($Script:WS.BrowserProfileRoots).Count -eq 0) { return }
  $leaves = @()
  foreach ($d in (Get-DeclaredProfileDirs)) { $leaves += @(Get-ChromiumCacheDirs $d) }
  $n = Add-CacheLeafExceptions -Paths $leaves
  if ($n -gt 0) { Write-LogLine "D79: $n cache folder(s) under the declared browser-profile roots may be cleared" }
}

function Get-Targets07 {
  $P = $Script:P
  $t = @(
    (New-Target 7 'Google Chrome' "$($P.L)\Google\Chrome\User Data" -Kind chromium -Guard @('chrome') -Note 'cache folders of every profile')
    (New-Target 7 'Google Chrome Beta' "$($P.L)\Google\Chrome Beta\User Data" -Kind chromium -Guard @('chrome'))
    (New-Target 7 'Google Chrome Dev' "$($P.L)\Google\Chrome Dev\User Data" -Kind chromium -Guard @('chrome'))
    (New-Target 7 'Google Chrome Canary' "$($P.L)\Google\Chrome SxS\User Data" -Kind chromium -Guard @('chrome'))
    (New-Target 7 'Microsoft Edge' "$($P.L)\Microsoft\Edge\User Data" -Kind chromium -Guard @('msedge'))
    (New-Target 7 'Brave' "$($P.L)\BraveSoftware\Brave-Browser\User Data" -Kind chromium -Guard @('brave'))
    (New-Target 7 'Vivaldi' "$($P.L)\Vivaldi\User Data" -Kind chromium -Guard @('vivaldi'))
    (New-Target 7 'Opera' "$($P.A)\Opera Software\Opera Stable" -Kind chromium -Guard @('opera'))
    (New-Target 7 'Opera GX' "$($P.A)\Opera Software\Opera GX Stable" -Kind chromium -Guard @('opera'))
    (New-Target 7 'Chromium' "$($P.L)\Chromium\User Data" -Kind chromium -Guard @('chrome', 'chromium'))
    (New-Target 7 'Arc' "$($P.L)\Packages\TheBrowserCompany.Arc_*\LocalCache\Local\Arc\User Data" -Kind chromium -Guard @('Arc'))
    (New-Target 7 'Firefox' "$($P.L)\Mozilla\Firefox\Profiles" -Kind firefox -Guard @('firefox') -Note 'cache2, startupCache, thumbnails, jumpListCache')
    (New-Target 7 'LibreWolf' "$($P.L)\LibreWolf\Profiles" -Kind firefox -Guard @('librewolf'))
    (New-Target 7 'Waterfox' "$($P.L)\Waterfox\Profiles" -Kind firefox -Guard @('waterfox'))
  )
  foreach ($d in (Get-DeclaredProfileDirs)) {
    $t += (New-Target 7 "Declared browser profile ($(Split-Path -Leaf $d))" $d -Kind chromium -Note 'from --browser-profile-roots; skipped while a browser holds it')
  }
  return $t
}

function Invoke-Section07 {
  Write-SectionIntro @(
    'Browser caches rebuild as you browse; the first page loads afterwards are a little slower. Cookies, logins,',
    'history, bookmarks, extensions, Local Storage, IndexedDB and PWA CacheStorage are never touched.',
    'A browser that is open right now is skipped - close it and run this section again.'
  )
  $declared = @(Get-DeclaredProfileDirs)
  $busy = $null
  if ($declared.Count -gt 0) { $busy = Get-BusyUserDataDirs }
  $targets = @(Get-Targets07 | Where-Object {
      if ($null -ne $busy -and $declared -contains $_.Path -and $busy.Contains($_.Path)) { Write-Warn "$($_.Label) - skipped: a running browser holds this profile"; $false } else { $true }
    })
  $null = Show-TargetSizes $targets
  if (-not (Confirm-Section 'Clear browser caches now?')) { Write-Info 'skipped'; return }
  $null = Invoke-TargetList $targets
}
