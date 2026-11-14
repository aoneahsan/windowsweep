# self_test_1_5.ps1 - self-test group [27]: the 1.5.0 uninstaller (D109). The registry chokepoint's refusals and
# its backup-before-delete round trip on a throwaway key, the leftover finders on fixture keys, the Store-app
# filter, broken-entry detection and the uninstall history. A refusal is always proved with --dry-run on, so a
# broken guard shows up as 'dry-run' instead of 'refused' and can never reach a real key. Called by
# Invoke-SelfTestExtra with its fixture root; verdict lines only. ASCII only.

function Invoke-SelfTest27 {
  <# .SYNOPSIS Group [27]: registry chokepoint, Store filter, leftover finders, broken entries, history. #>
  param([string] $Fixture)
  $ws = $Script:WS
  $checks = 0; $fails = 0
  $saved = @{ DryRun = $ws.DryRun; ReportsDir = $ws.ReportsDir; Home = $ws.Home; IsAdmin = $ws.IsAdmin; Stamp = $ws.Stamp }
  $fxKey = 'HKEY_CURRENT_USER\Software\windowsweep-selftest-' + [guid]::NewGuid().ToString('N').Substring(0, 12)
  Write-Section '[27] Uninstaller 1.5: registry chokepoint, Store apps, leftovers'
  try {
    $ws.ReportsDir = Join-Path $Fixture 'g27-reports'
    $ws.Home = Join-Path $Fixture 'g27-home'
    $ws.Stamp = 'selftest'
    $ws.IsAdmin = $false

    # 27a - the protection table refuses roots, shared keys and the wrong kind of key (pure)
    $checks++
    $refuse = @(
      @('HKEY_CURRENT_USER\Software', 'key'), @('HKEY_CURRENT_USER\Software\Microsoft\Windows', 'key'),
      @('HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Intel\Drivers', 'key'), @('HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet', 'key'),
      @('HKLM:\SOFTWARE\Classes\.txt', 'key'), @('HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node', 'key'),
      @('HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall', 'uninstall'),
      @('HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\App\Sub', 'uninstall'),
      @('HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\RunOnceEx', 'run'))
    $allow = @(
      @('HKEY_CURRENT_USER\Software\FileZilla', 'key'), @('HKLM\SOFTWARE\WOW6432Node\TechSmith\Camtasia Studio', 'key'),
      @('HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\Hubstaff', 'uninstall'),
      @('HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run', 'run'))
    $bad = @()
    foreach ($c in $refuse) { if (-not (Get-RegistryProtectionReason -Path $c[0] -Kind $c[1])) { $bad += "allowed $($c[0])" } }
    foreach ($c in $allow) { $why = Get-RegistryProtectionReason -Path $c[0] -Kind $c[1]; if ($why) { $bad += "refused $($c[0]) ($why)" } }
    if ($bad.Count -eq 0) { Write-Ok 'registry protection: roots, shared keys and wrong-kind keys refused; program keys allowed' } else { Write-Err ('registry protection wrong: ' + ($bad -join '; ')); $fails++ }

    # 27b - a refused key never reaches dry-run, and dry-run changes nothing
    $checks++
    $null = New-Item -Path "Registry::$fxKey\Sub" -Force
    $null = New-ItemProperty -Path "Registry::$fxKey" -Name 'probe' -Value 'kept' -Force
    $ws.DryRun = $true
    $r1 = Remove-RegistryKeySafe -Path 'HKEY_CURRENT_USER\Software\Microsoft' 6>$null 3>$null
    $r2 = Remove-RegistryValueSafe -KeyPath $fxKey -Name 'probe' 6>$null 3>$null
    $r3 = Remove-ScheduledTaskSafe -TaskPath '\Microsoft\Windows\Defrag\' -TaskName 'ScheduledDefrag' 6>$null 3>$null
    $r4 = Remove-RegistryKeySafe -Path $fxKey 6>$null 3>$null
    $still = Test-Path -LiteralPath "Registry::$fxKey\Sub"
    if ($r1 -eq 'refused' -and $r2 -eq 'refused' -and $r3 -eq 'refused' -and $r4 -eq 'dry-run' -and $still) { Write-Ok 'refusals happen before dry-run; a dry-run removal leaves the key in place' }
    else { Write-Err "refusal/dry-run order wrong: shared=$r1 value=$r2 task=$r3 fixture=$r4 stillThere=$still"; $fails++ }

    # 27c - a real removal writes a .reg backup first, removes the key, and the backup puts it back
    $checks++
    $ws.DryRun = $false
    $r5 = Remove-RegistryKeySafe -Path $fxKey 6>$null
    $gone = -not (Test-Path -LiteralPath "Registry::$fxKey")
    $backup = @(Get-ChildItem -LiteralPath (Join-Path $ws.ReportsDir 'registry-backups\selftest') -Filter '*.reg' -ErrorAction SilentlyContinue)
    $restored = $false
    if ($backup.Count -eq 1) { $null = & reg.exe import $backup[0].FullName 2>&1; $restored = ((Get-ItemProperty -LiteralPath "Registry::$fxKey" -Name 'probe' -ErrorAction SilentlyContinue).probe -eq 'kept') -and (Test-Path -LiteralPath "Registry::$fxKey\Sub") }
    if ($r5 -eq 'removed' -and $gone -and $restored) { Write-Ok 'real removal: .reg backup first, key removed, backup restores it' }
    else { Write-Err "registry round trip wrong: result=$r5 gone=$gone backups=$($backup.Count) restored=$restored"; $fails++ }

    # 27d - leftover tokens: a vendor word is never a product token, a maker-named program keeps its name
    $checks++
    $sw = Get-LeftoverNameTokens ([pscustomobject]@{ DisplayName = 'Adobe Shockwave Player 12.3'; Publisher = 'Adobe, Inc.'; InstallLocation = 'C:\Windows\SysWOW64\Adobe' })
    $rd = Get-LeftoverNameTokens ([pscustomobject]@{ DisplayName = 'RustDesk'; Publisher = 'RustDesk'; InstallLocation = '' })
    if ($sw.Product.Contains('shockwave') -and -not $sw.Product.Contains('adobe') -and $sw.Vendor.Contains('adobe') -and $rd.Product.Contains('rustdesk')) { Write-Ok 'leftover names: vendor words stay vendor; a program named after its maker keeps its name' }
    else { Write-Err "leftover tokens wrong: shockwave=[$(@($sw.Product) -join ',')]/[$(@($sw.Vendor) -join ',')] rustdesk=[$(@($rd.Product) -join ',')]"; $fails++ }

    # 27e - registry leftovers: product keys and a vendor's matching children; a vendor key whole only when all
    # its children match; a claimed name and a shared key never
    $checks++
    foreach ($k in 'Camtasia Studio', 'TechSmith\Camtasia Recorder', 'TechSmith\Snagit', 'Obsidian', 'Lenovo\Vantage', 'Hubstaff') { $null = New-Item -Path "Registry::$fxKey\$k" -Force }
    $prog = [pscustomobject]@{ DisplayName = 'Camtasia 2022'; Publisher = 'TechSmith Corporation'; InstallLocation = 'C:\Program Files\TechSmith\Camtasia 2022' }
    $vendorApp = [pscustomobject]@{ DisplayName = 'Lenovo Vantage'; Publisher = 'Lenovo'; InstallLocation = '' }
    $claimedApp = [pscustomobject]@{ DisplayName = 'Hubstaff'; Publisher = 'Netsoft Holdings, LLC.'; InstallLocation = '' }
    $claims = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
    $null = $claims.Add('hubstaff')
    $idx = [pscustomobject]@{ Tokens = $claims }
    $all3 = @($prog, $vendorApp, $claimedApp)
    $got1 = @(Find-RegistryLeftovers -Programs $all3 -Index $idx -Roots @($fxKey) | ForEach-Object { $_.Path.Substring($fxKey.Length + 1) } | Sort-Object)
    Remove-Item -LiteralPath "Registry::$fxKey\TechSmith\Snagit" -Force
    $got2 = @(Find-RegistryLeftovers -Programs $all3 -Index $idx -Roots @($fxKey) | ForEach-Object { $_.Path.Substring($fxKey.Length + 1) } | Sort-Object)
    if ((($got1 -join '|') -eq 'Camtasia Studio|TechSmith\Camtasia Recorder') -and (($got2 -join '|') -eq 'Camtasia Studio|TechSmith')) { Write-Ok 'registry leftovers: product keys, matching vendor children, a whole vendor key only when nothing else is in it' }
    else { Write-Err "registry leftovers wrong: first=[$($got1 -join '|')] second=[$($got2 -join '|')]"; $fails++ }

    # 27f - dead startup entries: a value whose program is gone is found, a live one is not
    $checks++
    $run = "$fxKey\Run"
    $null = New-Item -Path "Registry::$run" -Force
    $missing = Join-Path $env:SystemDrive ('windowsweep-missing-' + [guid]::NewGuid().ToString('N').Substring(0, 8) + '\mbae.exe')
    $null = New-ItemProperty -Path "Registry::$run" -Name 'gone' -Value $missing -Force
    $null = New-ItemProperty -Path "Registry::$run" -Name 'alive' -Value ('"' + (Join-Path $env:SystemRoot 'System32\notepad.exe') + '" /x') -Force
    $null = New-ItemProperty -Path "Registry::$run" -Name 'hosted' -Value ('rundll32.exe "' + $missing.Replace('mbae.exe', 'x.dll') + '",Start') -Force
    $dead = @(Find-DeadStartupEntries -Keys @($run) | ForEach-Object { $_.Path } | Sort-Object)
    if (($dead -join '|') -eq "$run::gone|$run::hosted") { Write-Ok 'startup entries: a gone program (direct or through rundll32) is found; a live one is not' }
    else { Write-Err "dead startup entries wrong: [$($dead -join '|')]"; $fails++ }

    # 27g - the Store filter keeps frameworks, system apps, the Store, codecs and hardware apps off the list
    $checks++
    $pk = { param($n, $sig = 'Store', $fw = $false, $nr = $false) [pscustomobject]@{ Name = $n; SignatureKind = $sig; IsFramework = $fw; IsResourcePackage = $false; NonRemovable = $nr } }
    $no = @((& $pk 'Microsoft.VCLibs.140.00' 'Store' $true), (& $pk 'Microsoft.Windows.ShellExperienceHost' 'System'), (& $pk 'Microsoft.WindowsStore'),
      (& $pk 'Microsoft.DesktopAppInstaller'), (& $pk 'NVIDIACorp.NVIDIAControlPanel'), (& $pk 'Microsoft.VP9VideoExtensions'), (& $pk 'Microsoft.WebpImageExtension'),
      (& $pk 'ELANMicroelectronicsCorpo.ELANTouchpadforThinkpad'), (& $pk 'Microsoft.XboxApp' 'Store' $false $true), (& $pk 'MicrosoftCorporationII.WinAppRuntime.Main.1.8'))
    $yes = @((& $pk 'Microsoft.SkypeApp'), (& $pk 'Microsoft.549981C3F5F10'), (& $pk '1424566A.147190DF3DE79'), (& $pk 'Microsoft.WindowsTerminal'))
    $wrong = @($no | Where-Object { Test-StoreAppOffered $_ } | ForEach-Object { "offered $($_.Name)" }) + @($yes | Where-Object { -not (Test-StoreAppOffered $_) } | ForEach-Object { "hid $($_.Name)" })
    if ($wrong.Count -eq 0) { Write-Ok 'Store filter: frameworks, system, Store, codecs, hardware and non-removable apps never offered' } else { Write-Err ('Store filter wrong: ' + ($wrong -join '; ')); $fails++ }

    # 27h - names: Start menu first, then the manifest, then the package name without its publisher prefix
    $checks++
    $fam = @{ 'Microsoft.SkypeApp_kzf8qxf38zg5c' = 'Skype' }
    $n1 = Resolve-StoreAppName -Package ([pscustomobject]@{ Name = 'Microsoft.SkypeApp'; PackageFamilyName = 'Microsoft.SkypeApp_kzf8qxf38zg5c' }) -StartNames $fam
    $n2 = Resolve-StoreAppName -Package ([pscustomobject]@{ Name = 'Microsoft.MixedReality.Portal'; PackageFamilyName = 'x' }) -StartNames $fam -ManifestName 'Mixed Reality Portal'
    $n3 = Resolve-StoreAppName -Package ([pscustomobject]@{ Name = 'Microsoft.MixedReality.Portal'; PackageFamilyName = 'x' }) -StartNames @{}
    $p1 = Resolve-StoreAppPublisher -Package ([pscustomobject]@{ Publisher = 'CN="Anthropic, PBC", O="Anthropic, PBC"' })
    $p2 = Resolve-StoreAppPublisher -Package ([pscustomobject]@{ Publisher = 'CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond' })
    if ($n1 -eq 'Skype' -and $n2 -eq 'Mixed Reality Portal' -and $n3 -eq 'MixedReality Portal' -and $p1 -eq 'Anthropic, PBC' -and $p2 -eq 'Microsoft Corporation') { Write-Ok 'Store names: Start menu, then manifest, then package name; publisher from the signing subject' }
    else { Write-Err "Store names wrong: [$n1] [$n2] [$n3] [$p1] [$p2]"; $fails++ }

    # 27i - a broken entry is one whose uninstaller file is gone on a present drive; MSI and unplugged drives never
    $checks++
    $absent = @([char[]]'ZYXWVUTSRQPONMLKJ' | Where-Object { -not (Test-Path -LiteralPath "$($_):\") } | Select-Object -First 1)
    $b1 = Test-UninstallEntryBroken ([pscustomobject]@{ Strategy = 'inno'; FilePath = $missing.Replace('mbae.exe', 'unins000.exe') })
    $b2 = Test-UninstallEntryBroken ([pscustomobject]@{ Strategy = 'msi'; FilePath = $missing.Replace('mbae.exe', 'msiexec.exe') })
    $b3 = $true
    if ($absent.Count -eq 1) { $b3 = Test-UninstallEntryBroken ([pscustomobject]@{ Strategy = 'nsis'; FilePath = "$($absent[0]):\Tools\uninstall.exe" }) }
    $b4 = Test-UninstallEntryBroken ([pscustomobject]@{ Strategy = 'nsis'; FilePath = (Join-Path $env:SystemRoot 'System32\notepad.exe') })
    if ($b1 -and -not $b2 -and -not $b3 -and -not $b4) { Write-Ok 'broken entries: a missing uninstaller is broken; MSI, an unplugged drive and a present file are not' }
    else { Write-Err "broken-entry rule wrong: missing=$b1 msi=$b2 unplugged=$b3 present=$b4"; $fails++ }

    # 27j - the uninstall history keeps the newest record per program
    $checks++
    Add-UninstallHistory -Row ([pscustomobject]@{ DisplayName = 'FileZilla 3.70.6'; DisplayVersion = '3.70.6'; Publisher = 'Tim Kosse'; KeyPath = 'HKEY_LOCAL_MACHINE\x'; InstallLocation = 'C:\Program Files\FileZilla FTP Client'; Kind = 'program' }) -Strategy 'nsis'
    Add-UninstallHistory -Row ([pscustomobject]@{ DisplayName = 'FileZilla 3.70.6'; DisplayVersion = '3.70.7'; Publisher = 'Tim Kosse'; KeyPath = 'HKEY_LOCAL_MACHINE\x'; InstallLocation = 'C:\Program Files\FileZilla FTP Client'; Kind = 'program' }) -Strategy 'nsis'
    $h = @(Get-UninstallHistory)
    if ($h.Count -eq 1 -and $h[0].DisplayVersion -eq '3.70.7' -and $h[0].InstallLocation -eq 'C:\Program Files\FileZilla FTP Client') { Write-Ok 'uninstall history: one record per program, the newest kept' }
    else { Write-Err "uninstall history wrong: rows=$($h.Count) version=$(@($h | ForEach-Object { $_.DisplayVersion }) -join ',')"; $fails++ }

    # 27k - the startup command parser finds the file a host really runs
    $checks++
    $s1 = Get-StartupProgramPath 'C:\Program Files (x86)\Malwarebytes Anti-Exploit\mbae.exe'
    $s2 = Get-StartupProgramPath '"C:\Tools\a b\c.exe" --tray'
    $s3 = Get-StartupProgramPath 'rundll32.exe "C:\Tools\x.dll",Entry'
    $s4 = Get-StartupProgramPath ((Join-Path $env:SystemRoot 'System32\rundll32.exe') + ' "C:\Tools\y.dll",Entry')
    if ($s1 -eq 'C:\Program Files (x86)\Malwarebytes Anti-Exploit\mbae.exe' -and $s2 -eq 'C:\Tools\a b\c.exe' -and $s3 -eq 'C:\Tools\x.dll' -and $s4 -eq 'C:\Tools\y.dll') { Write-Ok 'startup commands: unquoted paths with spaces, quoted paths, and rundll32 targets' }
    else { Write-Err "startup command parse wrong: [$s1] [$s2] [$s3] [$s4]"; $fails++ }
  } catch {
    Write-Err "group [27] crashed: $($_.Exception.Message) | at $(($_.ScriptStackTrace -split "`n" | Select-Object -First 3) -join ' <- ')"; $fails++
  } finally {
    try { if (Test-Path -LiteralPath "Registry::$fxKey") { Remove-Item -LiteralPath "Registry::$fxKey" -Recurse -Force } } catch { $null = $_ }
    $ws.DryRun = $saved.DryRun; $ws.ReportsDir = $saved.ReportsDir; $ws.Home = $saved.Home; $ws.IsAdmin = $saved.IsAdmin; $ws.Stamp = $saved.Stamp
  }
  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}
