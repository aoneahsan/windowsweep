# android_avd.ps1 - section 4: Android emulators (AVDs) and what they leave. Slow to recreate, so a per-AVD idle
# gate and never in --all. 1.4.0: every AVD root (also ANDROID_AVD_HOME), pointer .ini files whose AVD is gone
# (the P52's pointed into a drive that no longer existed, 2026-11-02) and system images no remaining AVD uses -
# removed with the SDK's own sdkmanager, the emulator too once no AVD is left. ASCII only.

function Get-AvdRoots {
  <# .SYNOPSIS Every folder the emulator may keep AVDs in: the default, ANDROID_AVD_HOME, and the avd folder under
     ANDROID_EMULATOR_HOME / ANDROID_SDK_HOME / ANDROID_PREFS_ROOT (process, user, machine) - existing ones, once
     each. A missed root would make its AVDs' images look unused. #>
  $default = Join-Path $Script:P.U '.android\avd'
  $seen = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  $cands = @($default)
  foreach ($scope in 'Process', 'User', 'Machine') {
    $cands += [Environment]::GetEnvironmentVariable('ANDROID_AVD_HOME', $scope)
    $em = [Environment]::GetEnvironmentVariable('ANDROID_EMULATOR_HOME', $scope)
    if ($em) { $cands += (Join-Path $em 'avd') }
    foreach ($v in 'ANDROID_SDK_HOME', 'ANDROID_PREFS_ROOT') { $h = [Environment]::GetEnvironmentVariable($v, $scope); if ($h) { $cands += (Join-Path $h '.android\avd') } }
  }
  $out = @()
  foreach ($c in $cands) {
    if (-not $c) { continue }
    $f = Get-FullPath $c
    if (-not $f -or -not $seen.Add($f)) { continue }
    if (Test-DirPresent $f) { $out += $f } elseif ($f -ne (Get-FullPath $default)) { Write-Note "an Android variable names the AVD folder $f, which does not exist" }
  }
  return $out
}

function Read-KeyValueFile {
  <# .SYNOPSIS The key=value lines of an AVD .ini or config.ini; empty when unreadable. #>
  param([string] $Path)
  $h = @{}
  try { foreach ($line in [IO.File]::ReadAllLines($Path)) { $i = $line.IndexOf('='); if ($i -gt 0) { $h[$line.Substring(0, $i).Trim()] = $line.Substring($i + 1).Trim() } } } catch { $null = $_ }
  return $h
}

function Get-AvdInventory {
  <# .SYNOPSIS AVD folders in the roots, AVDs stored elsewhere that a pointer .ini names (External: used for image
     references, never pruned here), and pointer .ini files whose AVD folder is gone. #>
  param([string[]] $Roots)
  $avds = @(); $dangling = @()
  $seen = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($root in $Roots) {
    foreach ($e in (Get-ChildEntries $root)) {
      if ($e -is [IO.DirectoryInfo] -and $e.Name -like '*.avd') {
        $full = Remove-LongPrefix $e.FullName
        if ($seen.Add($full)) { $avds += [pscustomobject]@{ Name = $e.Name; Path = $full; Root = $root; Ini = (Join-Path $root ($e.Name -replace '\.avd$', '.ini')); External = $false } }
      }
    }
  }
  foreach ($root in $Roots) {
    foreach ($e in (Get-ChildEntries $root)) {
      if (-not ($e -is [IO.FileInfo]) -or $e.Name -notlike '*.ini') { continue }
      $full = Remove-LongPrefix $e.FullName
      $target = [string](Read-KeyValueFile $full)['path']
      if (-not $target) { $target = Join-Path $root ($e.Name -replace '\.ini$', '.avd') }
      if (-not (Test-DirPresent $target)) { $dangling += [pscustomobject]@{ Path = $full; Root = $root; Target = $target }; continue }
      $t = Get-FullPath $target
      if ($seen.Add($t)) { $avds += [pscustomobject]@{ Name = (Split-Path -Leaf $t); Path = $t; Root = (Split-Path -Parent $t); Ini = $full; External = $true } }
    }
  }
  return [pscustomobject]@{ Avds = $avds; Dangling = $dangling }
}

function Get-AndroidSdkRoot {
  foreach ($c in @($env:ANDROID_HOME, $env:ANDROID_SDK_ROOT, [Environment]::GetEnvironmentVariable('ANDROID_HOME', 'User'),
      [Environment]::GetEnvironmentVariable('ANDROID_SDK_ROOT', 'User'), (Join-Path $Script:P.L 'Android\Sdk'))) {
    if ($c -and (Test-DirPresent $c)) { return (Get-FullPath $c) }
  }
  return ''
}

function Get-SystemImages {
  <# .SYNOPSIS <sdk>\system-images\<api>\<tag>\<abi> folders. Broken = holds no image (an interrupted install left
     only its .installer folder on the P52): sdkmanager does not know it, so it is only reported. #>
  param([string] $Sdk)
  $out = @()
  foreach ($api in (Get-ChildEntries (Join-Path $Sdk 'system-images'))) {
    if (-not ($api -is [IO.DirectoryInfo])) { continue }
    foreach ($tag in (Get-ChildEntries (Remove-LongPrefix $api.FullName))) {
      if (-not ($tag -is [IO.DirectoryInfo])) { continue }
      foreach ($abi in (Get-ChildEntries (Remove-LongPrefix $tag.FullName))) {
        if (-not ($abi -is [IO.DirectoryInfo])) { continue }
        $p = Remove-LongPrefix $abi.FullName
        $broken = -not ((Test-PathPresent (Join-Path $p 'source.properties')) -or (Test-PathPresent (Join-Path $p 'system.img')) -or (Test-PathPresent (Join-Path $p 'package.xml')))
        $out += [pscustomobject]@{ Package = "system-images;$($api.Name);$($tag.Name);$($abi.Name)"; Path = $p; Rel = ("system-images\$($api.Name)\$($tag.Name)\$($abi.Name)").ToLowerInvariant(); Broken = $broken }
      }
    }
  }
  return $out
}

function Get-UnusedSdkPackages {
  <# .SYNOPSIS Pure: the system images no remaining AVD's config.ini names, and the emulator once no AVD is left.
     An AVD whose config names no image (unreadable, or made by hand) keeps every image. #>
  param([object[]] $Images, [object[]] $Avds, [bool] $EmulatorPresent)
  $used = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::OrdinalIgnoreCase)
  foreach ($a in @($Avds)) {
    $kv = Read-KeyValueFile (Join-Path $a.Path 'config.ini')
    $refs = @($kv.Keys | Where-Object { $_ -like 'image.sysdir.*' } | ForEach-Object { ([string]$kv[$_]).Replace('/', '\').Trim('\').ToLowerInvariant() })
    if ($refs.Count -eq 0) { return [pscustomobject]@{ Packages = @(); Reason = "the AVD $($a.Name) names no system image - every image is kept" } }
    foreach ($r in $refs) { $null = $used.Add($r) }
  }
  $drop = @($Images | Where-Object { -not $used.Contains($_.Rel) })
  if ($EmulatorPresent -and @($Avds).Count -eq 0) { $drop += [pscustomobject]@{ Package = 'emulator'; Path = ''; Rel = 'emulator' } }
  return [pscustomobject]@{ Packages = $drop; Reason = '' }
}

function Get-SdkManagerPath {
  param([string] $Sdk)
  $c = @((Join-Path $Sdk 'cmdline-tools\latest\bin\sdkmanager.bat'))
  $c += @(Get-ChildEntries (Join-Path $Sdk 'cmdline-tools') | Sort-Object Name -Descending | ForEach-Object { Join-Path (Remove-LongPrefix $_.FullName) 'bin\sdkmanager.bat' })
  $c += (Join-Path $Sdk 'tools\bin\sdkmanager.bat')
  foreach ($p in $c) { if (Test-PathPresent $p) { return $p } }
  return ''
}

function Remove-SdkPackages {
  <# .SYNOPSIS Uninstall SDK packages with the SDK's own sdkmanager (no file is deleted by this tool). #>
  param([string] $Sdk, [object[]] $Packages)
  $tool = Get-SdkManagerPath $Sdk
  if (-not $tool) { Write-Warn ('sdkmanager was not found; remove them in Android Studio > SDK Manager: ' + (($Packages | ForEach-Object { $_.Package }) -join ', ')); return }
  $savedJava = $env:JAVA_HOME
  $jbr = Join-Path $Script:P.PF 'Android\Android Studio\jbr'
  if (-not $env:JAVA_HOME -and -not (Test-CommandPresent 'java') -and (Test-DirPresent $jbr)) { $env:JAVA_HOME = $jbr }
  try {
    foreach ($pkg in $Packages) {
      $bytes = [long]0
      if ($pkg.Path) { $bytes = [long](Get-DirectoryBytes $pkg.Path) } else { $bytes = [long](Get-DirectoryBytes (Join-Path $Sdk 'emulator')) }
      $r = Invoke-External -FilePath $tool -ArgumentList @('--uninstall', $pkg.Package) -Destructive -Quiet -Label 'sdkmanager'
      if ($Script:WS.DryRun) { Add-Freed $bytes; continue }
      $left = $pkg.Path
      if (-not $left) { $left = Join-Path $Sdk 'emulator' }
      if (-not (Test-DirPresent $left)) { Add-Freed $bytes; Write-Ok ("{0} removed with sdkmanager ({1})" -f $pkg.Package, (Format-Bytes $bytes)) } else { Write-Warn "$($pkg.Package) is still installed (sdkmanager exit $($r.ExitCode))" }
    }
  } finally { $env:JAVA_HOME = $savedJava }
}

function Get-Targets04 {
  $t = @((New-Target 4 'Android AVDs (each .avd + .ini pair)' "$($Script:P.U)\.android\avd" -Mode units -Dev $true -Note "an AVD goes only when nothing inside it changed for $($Script:WS.Days)+ days"))
  $sdk = Get-AndroidSdkRoot
  if ($sdk) { $t += (New-Target 4 'Android system images no AVD uses' (Join-Path $sdk 'system-images') -Kind cmd -Dev $true -Note 'removed with sdkmanager; the emulator too once no AVD is left') }
  return $t
}

function Invoke-Section04 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'An emulator image is 5-15 GB and takes minutes to recreate. Each AVD is one unit: it is removed only when',
    "every file inside it has been idle for $($ws.Days)+ days (booting an emulator updates its files). Pointer .ini",
    'files whose AVD is gone, and system images no remaining AVD uses, go too - the images with the SDK''s sdkmanager.'
  ) -Dev $true
  if (Test-ProcessRunning @('qemu-system-x86_64', 'emulator', 'emulator64-crash-service')) { Write-Warn 'an Android emulator is running - section skipped'; return }
  $inv = Get-AvdInventory -Roots @(Get-AvdRoots)
  $own = @($inv.Avds | Where-Object { -not $_.External })
  foreach ($a in $own) { $a | Add-Member -NotePropertyName Idle -NotePropertyValue (Get-IdleDays $a.Path) -Force; $a | Add-Member -NotePropertyName Bytes -NotePropertyValue (Get-DirectoryBytes $a.Path) -Force }
  if ($own.Count -gt 0) {
    Write-UiLine ("  {0,-36} {1,10} {2,8}" -f 'AVD', 'SIZE', 'IDLE') 'White'
    foreach ($a in $own) { Write-UiLine ("  {0,-36} {1,10} {2,7}d" -f $a.Name, (Format-Bytes $a.Bytes), $a.Idle) 'Gray' }
  }
  $stale = @($own | Where-Object { $_.Idle -ge $ws.Days -or $ws.PurgeAll })
  foreach ($d in $inv.Dangling) { Write-UiLine ("  pointer to a missing AVD: {0}  (-> {1})" -f $d.Path, $d.Target) 'Gray' }
  $sdk = Get-AndroidSdkRoot
  $unused = [pscustomobject]@{ Packages = @(); Reason = '' }
  if ($sdk) {
    $remaining = @($inv.Avds | Where-Object { $stale -notcontains $_ })
    $all = @(Get-SystemImages $sdk)
    foreach ($b in @($all | Where-Object { $_.Broken })) { Write-UiLine ("  an interrupted SDK install left {0} - remove it in Android Studio > SDK Manager, or delete the folder" -f $b.Path) 'Gray' }
    $unused = Get-UnusedSdkPackages -Images @($all | Where-Object { -not $_.Broken }) -Avds $remaining -EmulatorPresent (Test-DirPresent (Join-Path $sdk 'emulator'))
    if ($unused.Reason) { Write-Note $unused.Reason }
    foreach ($p in $unused.Packages) { Write-UiLine ("  SDK package no AVD uses: {0}" -f $p.Package) 'Gray' }
  }
  $n = $stale.Count + @($inv.Dangling).Count + @($unused.Packages).Count
  if ($n -eq 0) { Write-Info "nothing to remove: every AVD was used within $($ws.Days) days, no pointer is dangling and every image is in use"; return }
  if (-not (Confirm-Section ("Remove {0} idle AVD(s), {1} dangling pointer(s) and {2} unused SDK package(s)?" -f $stale.Count, @($inv.Dangling).Count, @($unused.Packages).Count) 'n')) { Write-Info 'skipped'; return }
  foreach ($a in $stale) {
    $r = Remove-PathSafe -Path $a.Path -Within $a.Root -Label $a.Name
    if ($r.Removed) {
      if (Test-PathPresent $a.Ini) { $null = Remove-PathSafe -Path $a.Ini -Within $a.Root -Label "$($a.Name) ini" }
      if (-not $ws.DryRun) { Write-Ok ("removed AVD $($a.Name) ($($a.Idle)d idle, " + (Format-Bytes $r.Bytes) + ')') }
    }
  }
  foreach ($d in $inv.Dangling) { $null = Send-ToRecycleBin -Path $d.Path -Within $d.Root }
  if (@($unused.Packages).Count -eq 0) { return }
  if (-not $ws.DryRun -and @($stale | Where-Object { Test-DirPresent $_.Path }).Count -gt 0) { Write-Warn 'an AVD could not be removed - its system image is kept; run section 4 again'; return }
  Remove-SdkPackages -Sdk $sdk -Packages @($unused.Packages)
}
