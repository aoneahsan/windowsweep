# self_test_1_4b.ps1 - self-test groups [22]-[23] for 1.4.0: uninstall programs (section 26) and the leftover
# finder (sections 26 and 27). Fixtures and pure logic only; nothing is uninstalled or recycled. ASCII only.

function New-ProgramRow {
  <# .SYNOPSIS An uninstall-hive row shaped like Get-InstalledProgramRows returns, for the fixtures below. #>
  param([string] $Name, [string] $Un = '', [string] $Quiet = '', [int] $Msi = 0, [string] $KeyName = '', [string] $Publisher = '',
    [string] $Location = '', [int] $System = 0, [string] $Parent = '')
  return [pscustomobject]@{ DisplayName = $Name; DisplayVersion = ''; Publisher = $Publisher; InstallDate = ''; EstimatedSizeKb = [long]0
    InstallLocation = $Location; UninstallString = $Un; SystemComponent = $System; KeyName = $KeyName; Machine = $false
    KeyPath = "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall\$KeyName"; QuietUninstallString = $Quiet
    WindowsInstaller = $Msi; ParentKeyName = $Parent; ReleaseType = '' }
}

function New-ClaimsFixture {
  param([string[]] $Tokens = @(), [string[]] $Paths = @(), [int] $RegistryCount = 5)
  $set = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
  foreach ($t in $Tokens) { $null = $set.Add($t) }
  return [pscustomobject]@{ Tokens = $set; RegistryCount = $RegistryCount; Rows = @(); Paths = @($Paths | ForEach-Object { Get-FullPath $_ }) }
}

function Invoke-SelfTest22 {
  <# .SYNOPSIS Group [22]: section 26's command builder, offer rules and leftover pass. #>
  param([string] $Fixture)
  $checks = 0; $fails = 0
  $ws = $Script:WS
  $root = Join-Path $Fixture 'g22'
  $saved = @{ Queue = $ws.SelectQueue; Paths = $ws.SelectPaths; Interactive = $ws.Interactive; DryRun = $ws.DryRun }
  try {
    Write-Section '[22] 1.4.0: uninstall programs (section 26) and the folders they leave'
    # 22a - command lines exactly as the P52's uninstall entries wrote them (2026-11-02)
    $checks++
    $cases = @(
      @('C:\Program Files (x86)\Steam\uninstall.exe', 'C:\Program Files (x86)\Steam\uninstall.exe', ''),
      @('"C:\Users\x\AppData\Local\Programs\DockerDesktop\Docker Desktop Installer.exe" "uninstall"', 'C:\Users\x\AppData\Local\Programs\DockerDesktop\Docker Desktop Installer.exe', '"uninstall"'),
      @('MsiExec.exe /X{4B508632-2838-4F42-84EB-ED3153633E0A}', 'MsiExec.exe', '/X{4B508632-2838-4F42-84EB-ED3153633E0A}'),
      @('C:\Program Files\Vendor Name\drv.sys', 'C:\Program Files\Vendor Name\drv.sys', ''),
      @('C:\Program Files\Some.Comet\app.exe /quiet', 'C:\Program Files\Some.Comet\app.exe', '/quiet')
    )
    $bad = @()
    foreach ($c in $cases) { $s = Split-CommandLine $c[0]; if ($s.FilePath -ne $c[1] -or $s.Arguments -ne $c[2]) { $bad += "[$($c[0])] -> [$($s.FilePath)] [$($s.Arguments)]" } }
    if ($bad.Count -eq 0) { Write-Ok 'command lines split at the program - unquoted spaces, quotes and dotted folders included' } else { Write-Err "command lines split wrong: $($bad -join '; ')"; $fails++ }

    # 22b - every registered form maps to the silent command that worked on the P52
    $checks++
    $icons = Join-Path $root 'icons'
    New-Item -ItemType Directory -Force -Path (Join-Path $icons 'PHSP_24.0') | Out-Null
    $hd = 'C:\Program Files (x86)\Common Files\Adobe\Adobe Desktop Common\HDBox'
    $brave = 'C:\Program Files\BraveSoftware\Brave-Browser\Application\156.1.98.63\Installer\setup.exe'
    $copilot = 'C:\Program Files (x86)\Microsoft\Copilot\Application\156.0.4314.58\Installer\copilot_setup.exe'
    $docker = 'C:\Users\x\AppData\Local\Programs\DockerDesktop\Docker Desktop Installer.exe'
    $forms = @(
      @((New-ProgramRow 'CMake' -Un 'MsiExec.exe /X{4B508632-2838-4F42-84EB-ED3153633E0A}' -Msi 1), 'msi', 'msiexec.exe', '/x {4B508632-2838-4F42-84EB-ED3153633E0A} /qn /norestart'),
      @((New-ProgramRow 'VMware Workstation' -Msi 1 -KeyName '{6EC7759F-B700-4743-BB65-BD3ED905D545}'), 'msi', 'msiexec.exe', '/x {6EC7759F-B700-4743-BB65-BD3ED905D545} /qn /norestart'),
      @((New-ProgramRow 'Ollama' -Un '"C:\Users\x\AppData\Local\Programs\Ollama\unins000.exe"'), 'inno', 'C:\Users\x\AppData\Local\Programs\Ollama\unins000.exe', '/VERYSILENT /SUPPRESSMSGBOXES /NORESTART'),
      @((New-ProgramRow 'Steam' -Un 'C:\Program Files (x86)\Steam\uninstall.exe'), 'nsis', 'C:\Program Files (x86)\Steam\uninstall.exe', '/S'),
      @((New-ProgramRow 'Brave' -Un "`"$brave`" --uninstall --system-level"), 'chromium', $brave, '--uninstall --system-level --force-uninstall'),
      @((New-ProgramRow 'Copilot' -Un "`"$copilot`" --uninstall --system-level"), 'chromium', $copilot, '--uninstall --system-level --force-uninstall'),
      @((New-ProgramRow 'Docker Desktop' -Un "`"$docker`" `"uninstall`""), 'quiet-flag', $docker, 'uninstall --quiet'),
      @((New-ProgramRow 'Vulkan SDK' -Un '"C:\VulkanSDK\1.4.363.0\maintenancetool.exe" --start-uninstaller'), 'qt-installer', 'C:\VulkanSDK\1.4.363.0\maintenancetool.exe', 'purge --confirm-command'),
      @((New-ProgramRow 'Adobe Photoshop 2023' -Un "`"$hd\Uninstaller.exe`" --uninstall=1 --sapCode=PHSP --productVersion=24.1 --productPlatform=win64"), 'adobe', "$hd\Setup.exe", '--uninstall=1 --sapCode=PHSP --baseVersion=24.0 --platform=win64 --deleteUserPreferences=false'),
      @((New-ProgramRow 'Quiet Tool' -Un '"C:\Q\uninst.exe"' -Quiet '"C:\Q\uninst.exe" /quiet'), 'quiet', 'C:\Q\uninst.exe', '/quiet'),
      @((New-ProgramRow 'jq' -Un 'winget uninstall --product-code jqlang.jq_Microsoft.Winget.Source_8wekyb3d8bbwe'), 'winget', 'winget', 'uninstall --product-code jqlang.jq_Microsoft.Winget.Source_8wekyb3d8bbwe --silent --disable-interactivity --accept-source-agreements'),
      @((New-ProgramRow 'Rustup' -Un '"C:\Users\x\.cargo\bin\rustup.exe" self uninstall'), 'rustup', 'C:\Users\x\.cargo\bin\rustup.exe', 'self uninstall -y'),
      @((New-ProgramRow 'Bundle' -Un '"C:\ProgramData\Package Cache\{91d90ae4-6607-4b46-968a-8def759dfadf}\Setup.exe"  /uninstall'), 'wix-bundle', 'C:\ProgramData\Package Cache\{91d90ae4-6607-4b46-968a-8def759dfadf}\Setup.exe', '/uninstall /quiet /norestart'),
      @((New-ProgramRow 'Python 3.14.3' -Un '"C:\Users\x\pymanager.exe" uninstall --yes --by-id "pythoncore-3.14-64"'), 'registered-silent', 'C:\Users\x\pymanager.exe', 'uninstall --yes --by-id "pythoncore-3.14-64"'),
      @((New-ProgramRow 'Odd Tool' -Un '"C:\O\remove-me.exe" -x'), 'vendor-ui', 'C:\O\remove-me.exe', '-x'),
      @((New-ProgramRow 'Ghost'), 'none', '', '')
    )
    $bad = @()
    foreach ($f in $forms) {
      $cmd = Get-UninstallCommand -Row $f[0] -AdobeIconsRoot $icons
      if ($cmd.Strategy -ne $f[1] -or $cmd.FilePath -ne $f[2] -or $cmd.Arguments -ne $f[3]) { $bad += "$($f[0].DisplayName): [$($cmd.Strategy)] [$($cmd.FilePath)] [$($cmd.Arguments)]" }
    }
    $okCodes = ((Get-UninstallCommand -Row $forms[4][0]).SuccessCodes -contains 19) -and ((Get-UninstallCommand -Row $forms[0][0]).SuccessCodes -contains 3010)
    if ($bad.Count -eq 0 -and $okCodes) { Write-Ok "uninstall commands: $($forms.Count) registered forms give their silent command (MSI, Inno, NSIS, Chromium, Docker, Qt, Adobe, quiet) or the vendor's window" } else { Write-Err "uninstall commands wrong: $($bad -join '; ') codesOk=$okCodes"; $fails++ }

    # 22c - what is never offered
    $checks++
    $offerRules = @(
      (Test-UninstallOffered (New-ProgramRow 'Steam' -Un 'C:\S\uninstall.exe')),
      (-not (Test-UninstallOffered (New-ProgramRow 'Microsoft Visual C++ 2015-2022 Redistributable (x64) - 14.40' -Un 'C:\v\x.exe'))),
      (-not (Test-UninstallOffered (New-ProgramRow 'NVIDIA Graphics Driver 566.14' -Un 'C:\n\x.exe'))),
      (-not (Test-UninstallOffered (New-ProgramRow "Intel$([char]0x00AE) PROSet/Wireless Software" -Un 'C:\i\x.exe'))),
      (-not (Test-UninstallOffered (New-ProgramRow 'Some Component' -Un 'C:\c\x.exe' -System 1))),
      (-not (Test-UninstallOffered (New-ProgramRow 'Office Patch' -Un 'C:\p\x.exe' -Parent 'Office12'))),
      (-not (Test-UninstallOffered (New-ProgramRow 'windowsweep' -Un 'C:\w\x.exe'))),
      (-not (Test-UninstallOffered (New-ProgramRow 'No Command')))
    )
    if (@($offerRules | Where-Object { -not $_ }).Count -eq 0) { Write-Ok 'runtimes, drivers, Windows parts, patches, this tool and entries without an uninstaller are never offered' } else { Write-Err "offer rules wrong: [$($offerRules -join ',')]"; $fails++ }

    # 22d - leftovers: the install folder and folders named like the program or its publisher; claimed ones stay
    $checks++
    $pf = Join-Path $root 'pf'
    foreach ($d in 'Steam', 'SteamLibrary', 'Valve', 'ContosoData', 'SteamService', 'Internet Explorer', 'Notepad++') { New-Item -ItemType Directory -Force -Path (Join-Path $pf $d) | Out-Null }
    $svc = Join-Path $pf 'SteamService\svc.exe'
    [IO.File]::WriteAllText($svc, 'x')
    $claims = New-ClaimsFixture -Tokens @('contosodata') -Paths @($svc)
    $steam = New-ProgramRow 'Steam' -Un 'C:\S\uninstall.exe' -Publisher 'Valve Corporation' -Location (Join-Path $pf 'Steam')
    $contoso = New-ProgramRow 'Contoso Viewer' -Un 'C:\C\uninstall.exe' -Publisher 'Contoso Ltd'
    $found = @(Find-ProgramLeftovers -Programs @($steam, $contoso) -Roots @($pf) -Claims $claims)
    $offer = @($found | Where-Object { -not $_.Reason } | ForEach-Object { Split-Path -Leaf $_.Path } | Sort-Object)
    $kept = @($found | Where-Object { $_.Reason } | ForEach-Object { Split-Path -Leaf $_.Path } | Sort-Object)
    if (($offer -join ',') -eq 'Steam,SteamLibrary,Valve' -and ($kept -join ',') -eq 'ContosoData,SteamService') { Write-Ok 'leftovers: install folder and folders named like the program or publisher; a claimed name or a path still in use is only reported' } else { Write-Err "leftovers wrong: offer=[$($offer -join ',')] kept=[$($kept -join ',')]"; $fails++ }

    # 22e - an install folder another program still uses, or a protected root, is never offered
    $checks++
    $shared = Join-Path $root 'shared'
    New-Item -ItemType Directory -Force -Path (Join-Path $shared 'Other') | Out-Null
    $other = Join-Path $shared 'Other\app.exe'
    [IO.File]::WriteAllText($other, 'x')
    $progs = @((New-ProgramRow 'Shared Thing' -Un 'C:\x\uninstall.exe' -Location $shared), (New-ProgramRow 'Rooted Thing' -Un 'C:\y\uninstall.exe' -Location $Script:P.PF))
    $g = @(Find-ProgramLeftovers -Programs $progs -Roots @((Join-Path $root 'none')) -Claims (New-ClaimsFixture -Paths @($other)))
    $pfRow = @($g | Where-Object { $_.Path -eq (Get-FullPath $Script:P.PF) })
    if ($g.Count -eq 2 -and @($g | Where-Object { -not $_.Reason }).Count -eq 0 -and $pfRow.Count -eq 1 -and $pfRow[0].Reason -like 'protected root*') { Write-Ok 'an install folder still in use, or registered as a protected root, is reported and never offered' } else { Write-Err "install-folder guard wrong: $(@($g | ForEach-Object { "$($_.Path)=$($_.Reason)" }) -join '; ')"; $fails++ }

    # 22f - an unreadable registry offers nothing
    $checks++
    $fc = @(Find-ProgramLeftovers -Programs @($steam) -Roots @($pf) -Claims (New-ClaimsFixture -RegistryCount 0))
    if ($fc.Count -eq 0) { Write-Ok 'no readable uninstall entries: no leftover is offered (fail closed)' } else { Write-Err "fail-closed gate broken: $($fc.Count) row(s)"; $fails++ }

    # 22g - the second prompt never takes a queued --select meant for a later prompt; section 27's does
    $checks++
    $ws.Interactive = $false; $ws.DryRun = $true; $ws.SelectPaths = @(); $ws.SelectQueue = @('1')
    $row = [pscustomobject]@{ Path = (Get-FullPath (Join-Path $pf 'Valve')); Root = (Get-FullPath $pf); Program = 'Steam'; Reason = $null; Idle = -1; Bytes = [long]0 }
    Invoke-LeftoverChoice -Rows @($row) -Section 26 -PathsOrConsoleOnly
    $left26 = @($ws.SelectQueue).Count; $scripted26 = [bool]$ws.LastSelectionScripted
    Invoke-LeftoverChoice -Rows @($row) -Section 27
    $left27 = @($ws.SelectQueue).Count; $scripted27 = [bool]$ws.LastSelectionScripted
    if ($left26 -eq 1 -and -not $scripted26 -and $left27 -eq 0 -and $scripted27 -and (Test-Path -LiteralPath $row.Path)) { Write-Ok "section 26's leftover prompt never picks from a queued --select; section 27's prompt does" } else { Write-Err "select queue handling wrong: 26 left=$left26 scripted=$scripted26; 27 left=$left27 scripted=$scripted27"; $fails++ }

    # 22h - the catalogue contract: picked by a person only, never batched
    $checks++
    $s26 = Get-Section 26; $s27 = Get-Section 27
    $batched = @($Script:WS_SAFE_BATCH + $Script:WS_SAFE_BATCH_ADMIN + @($Script:WS_PROFILES.Values | ForEach-Object { $_ }))
    $walk = @($Script:WS_WALKTHROUGH + $Script:WS_WALKTHROUGH_ADMIN)
    $ok = ($s26.Batch -eq 'interactive' -and -not $s26.Admin -and $s26.Tier -eq 'permanent' -and $s27.Batch -eq 'interactive' -and $s27.Admin -and
      $s27.Tier -eq 'recycle' -and $batched -notcontains 26 -and $batched -notcontains 27 -and $walk -notcontains 26 -and $Script:WS_WALKTHROUGH_ADMIN -contains 27)
    if ($ok) { Write-Ok 'sections 26 and 27 are interactive and in no batch or profile; 27 joins the elevated walkthrough' } else { Write-Err 'catalogue contract for 26/27 wrong'; $fails++ }
  } catch {
    Write-Err "group [22] crashed: $($_.Exception.Message) | at $(($_.ScriptStackTrace -split "`n" | Select-Object -First 3) -join ' <- ')"; $fails++
  } finally {
    $ws.SelectQueue = $saved.Queue; $ws.SelectPaths = $saved.Paths; $ws.Interactive = $saved.Interactive; $ws.DryRun = $saved.DryRun
    try { if (Test-Path -LiteralPath $root) { [IO.Directory]::Delete((Get-LongPath $root), $true) } } catch { $null = $_ }
  }
  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}

function Invoke-SelfTest24 {
  <# .SYNOPSIS Group [24]: the 1.4.0 extensions to sections 4, 7, 10 and 24. #>
  param([string] $Fixture)
  $checks = 0; $fails = 0
  $root = Join-Path $Fixture 'g24'
  $pr = $Script:WS_PROTECT
  $savedEx = @($pr.Exceptions); $savedExP = @($pr.ExceptionPrefixes)
  try {
    Write-Section '[24] 1.4.0: emulator leftovers (4), declared profiles (7), declared temp roots (10), last run (24)'
    # 24a - an AVD, its pointer, and a pointer to a folder that is gone (the P52's pointed into a missing drive)
    $checks++
    $avdRoot = Join-Path $root 'avd'
    $pix = Join-Path $avdRoot 'Pixel.avd'
    New-Item -ItemType Directory -Force -Path $pix | Out-Null
    [IO.File]::WriteAllLines((Join-Path $pix 'config.ini'), [string[]]@('hw.cpu.arch=x86_64', 'image.sysdir.1=system-images\android-34\default\x86_64\'))
    [IO.File]::WriteAllLines((Join-Path $avdRoot 'Pixel.ini'), [string[]]@('avd.ini.encoding=UTF-8', "path=$pix"))
    [IO.File]::WriteAllLines((Join-Path $avdRoot 'Gone.ini'), [string[]]@('avd.ini.encoding=UTF-8', ('path=' + (Join-Path $root 'missing\Gone.avd'))))
    $inv = Get-AvdInventory -Roots @($avdRoot)
    if (@($inv.Avds).Count -eq 1 -and -not $inv.Avds[0].External -and @($inv.Dangling).Count -eq 1 -and (Split-Path -Leaf $inv.Dangling[0].Path) -eq 'Gone.ini') { Write-Ok 'AVDs: a pointer whose AVD folder is gone is found; the live pair is one AVD' } else { Write-Err "AVD inventory wrong: avds=$(@($inv.Avds).Count) dangling=[$(@($inv.Dangling | ForEach-Object { $_.Path }) -join ',')]"; $fails++ }

    # 24b - images: one in use stays; with no AVD left everything and the emulator go; an AVD naming none keeps all
    $checks++
    $imgs = @(
      [pscustomobject]@{ Package = 'system-images;android-34;default;x86_64'; Path = 'x'; Rel = 'system-images\android-34\default\x86_64' },
      [pscustomobject]@{ Package = 'system-images;android-36.1;google_apis_playstore;x86_64'; Path = 'y'; Rel = 'system-images\android-36.1\google_apis_playstore\x86_64' }
    )
    $one = @((Get-UnusedSdkPackages -Images $imgs -Avds @($inv.Avds) -EmulatorPresent $true).Packages | ForEach-Object { $_.Package })
    $none = @((Get-UnusedSdkPackages -Images $imgs -Avds @() -EmulatorPresent $true).Packages | ForEach-Object { $_.Package })
    $blank = Join-Path $root 'blank.avd'
    New-Item -ItemType Directory -Force -Path $blank | Out-Null
    $odd = Get-UnusedSdkPackages -Images $imgs -Avds @([pscustomobject]@{ Name = 'blank.avd'; Path = $blank }) -EmulatorPresent $true
    if (($one -join ',') -eq 'system-images;android-36.1;google_apis_playstore;x86_64' -and $none.Count -eq 3 -and $none -contains 'emulator' -and @($odd.Packages).Count -eq 0 -and $odd.Reason) { Write-Ok 'SDK packages: only images no AVD uses; the emulator once none is left; an unreadable AVD keeps every image' } else { Write-Err "SDK package plan wrong: one=[$($one -join ',')] none=[$($none -join ',')] odd=$(@($odd.Packages).Count)"; $fails++ }

    # 24c - a declared profile root: only its cache folders become exceptions (D79), never the profile or its data
    $checks++
    $prof = Join-Path $root 'profiles\run1'
    foreach ($d in 'Default\Cache', 'Default\Code Cache', 'Default\Local Storage', 'ShaderCache') { New-Item -ItemType Directory -Force -Path (Join-Path $prof $d) | Out-Null }
    [IO.File]::WriteAllText((Join-Path $prof 'Local State'), '{}')
    $dirs = @(Get-DeclaredProfileDirs -Roots @((Join-Path $root 'profiles')))
    $added = Add-CacheLeafExceptions -Paths @(@(Get-ChromiumCacheDirs $prof) + $prof + (Join-Path $prof 'Default\Local Storage'))
    $ex = @($pr.Exceptions)
    if ($dirs.Count -eq 1 -and $added -eq 3 -and $ex -contains (Get-FullPath (Join-Path $prof 'Default\Cache')) -and $ex -notcontains (Get-FullPath $prof) -and $ex -notcontains (Get-FullPath (Join-Path $prof 'Default\Local Storage'))) { Write-Ok 'declared profiles: exactly the cache folders are lifted - the profile and its Local Storage stay protected' } else { Write-Err "profile-root exceptions wrong: dirs=$($dirs.Count) added=$added"; $fails++ }

    # 24d - the three ways a browser command line names its profile
    $checks++
    $forms = @(
      @('chrome.exe --user-data-dir=C:\t\sl-1 --headless', 'C:\t\sl-1'),
      @('chrome.exe --user-data-dir="C:\a b\p" --x', 'C:\a b\p'),
      @('"chrome.exe" "--user-data-dir=C:\a b\q" --x', 'C:\a b\q'),
      @('chrome.exe --type=renderer', '')
    )
    $bad = @($forms | Where-Object { (Get-UserDataDirFromCommandLine $_[0]) -ne $_[1] } | ForEach-Object { $_[0] })
    if ($bad.Count -eq 0) { Write-Ok '--user-data-dir is read bare, quoted and inside a quoted argument' } else { Write-Err "user-data-dir parsing wrong: $($bad -join '; ')"; $fails++ }

    # 24e - a declared temp root: idle entries go whole, a fresh one stays, one a running program names stays
    $checks++
    $entries = @(
      [pscustomobject]@{ Path = 'C:\t\sl-old'; Idle = 10 }, [pscustomobject]@{ Path = 'C:\t\old.txt'; Idle = 10 },
      [pscustomobject]@{ Path = 'C:\t\sl-fresh'; Idle = 0 }, [pscustomobject]@{ Path = 'C:\t\sl-busy'; Idle = 10 }
    )
    $go = @(Get-TempRootPlan -Entries $entries -Days 3 -BusyText @('chrome.exe --user-data-dir=C:\t\sl-busy --headless', '') | ForEach-Object { $_.Path })
    if (($go -join ',') -eq 'C:\t\sl-old,C:\t\old.txt') { Write-Ok 'declared temp roots: idle entries go whole; fresh ones and ones in use stay' } else { Write-Err "temp-root plan wrong: [$($go -join ',')]"; $fails++ }

    # 24g - a scratch entry a scanner just read (fresh last-access, old writes) is still idle by write time
    $checks++
    $scan = New-AgedFiles -Dir (Join-Path $root 'scratch\sl-old') -Count 30 -WrittenDaysAgo 20 -FreshReads 20
    $wo = Get-IdleDays $scan -WriteOnly
    if ($wo -ge 19) { Write-Ok "declared temp roots measure write time: 2 of 3 files read today, still $wo days idle" } else { Write-Err "write-only idle wrong: $wo"; $fails++ }

    # 24h - D82: old files below hundreds of new ones still give the root its own verdict (P52 %TEMP%, 2026-11-03)
    $checks++
    $deep = Join-Path $root 'deepsample'
    New-Item -ItemType Directory -Force -Path $deep | Out-Null
    for ($i = 0; $i -lt 450; $i++) { [IO.File]::WriteAllText((Join-Path $deep ("n{0:D3}.tmp" -f $i)), 'x') }
    $null = New-AgedFiles -Dir (Join-Path $deep 'zz-old') -Count 30 -WrittenDaysAgo 30 -FreshReads 30
    Reset-AccessVerdicts
    $verdict = Test-LastAccessLive -Root $deep
    Reset-AccessVerdicts
    if ($verdict) { Write-Ok 'D82: 30 old files under 450 new ones are still sampled - the root is judged itself, not by section order' } else { Write-Err 'D82 sample stopped before the old files: the root inherited a verdict'; $fails++ }

    # 24f - Prefetch: file names, and days since the newest run of any of a program's files
    $checks++
    $pf = @{ 'chrome.exe' = [datetime]::UtcNow.AddDays(-2); 'steam.exe' = [datetime]::UtcNow.AddDays(-40); 'uninstall.exe' = [datetime]::UtcNow }
    $ok = ((ConvertFrom-PrefetchName 'CHROME.EXE-1A2B3C4D.pf') -eq 'chrome.exe' -and (ConvertFrom-PrefetchName 'Layout.ini') -eq '' -and
      (ConvertFrom-PrefetchName 'NOTEPAD.EXE-ZZZZZZZZ.pf') -eq '' -and (Get-LastRunDays -ExeNames @('steam.exe', 'steamwebhelper.exe') -Prefetch $pf) -eq 40 -and
      (Get-LastRunDays -ExeNames @('chrome.exe', 'steam.exe') -Prefetch $pf) -eq 2 -and (Get-LastRunDays -ExeNames @('none.exe') -Prefetch $pf) -eq -1 -and
      (Get-LastRunDays -ExeNames @('filezilla.exe', 'uninstall.exe') -Prefetch $pf) -eq -1)
    if ($ok) { Write-Ok 'last run: Prefetch names parse, a program counts from its most recently run file, and a shared uninstall.exe never counts' } else { Write-Err 'Prefetch parsing or last-run days wrong'; $fails++ }
  } catch {
    Write-Err "group [24] crashed: $($_.Exception.Message) | at $(($_.ScriptStackTrace -split "`n" | Select-Object -First 3) -join ' <- ')"; $fails++
  } finally {
    $pr.Exceptions = $savedEx; $pr.ExceptionPrefixes = $savedExP
    try { if (Test-Path -LiteralPath $root) { [IO.Directory]::Delete((Get-LongPath $root), $true) } } catch { $null = $_ }
  }
  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}

function Invoke-SelfTest25 {
  <# .SYNOPSIS Group [25]: section 19's data scanner - reasons, refusals, root rules, the change check, --json. #>
  param([string] $Fixture)
  $checks = 0; $fails = 0
  $ws = $Script:WS
  $root = Join-Path $Fixture 'g25'
  $savedExclude = $Script:WS_EXCLUDE
  $saved = @{ Json = $ws.JsonMode; Cands = $ws.Candidates }
  try {
    Write-Section '[25] 1.4.0: the data scanner (section 19) - large or old, refusals, the change check'
    $d = Join-Path $root 'data'
    New-Item -ItemType Directory -Force -Path (Join-Path $d 'sub') | Out-Null
    $old = [datetime]::UtcNow.AddDays(-400)
    $spec = @(@('big-new.bin', 2048, $false), @('small-old.txt', 10, $true), @('big-old.iso', 4096, $true), @('small-new.txt', 10, $false), @('sub\deep-old.log', 10, $true), @('excluded-old.txt', 10, $true))
    foreach ($s in $spec) {
      $p = Join-Path $d $s[0]
      [IO.File]::WriteAllBytes($p, (New-Object byte[] ([int]$s[1])))
      if ($s[2]) { [IO.File]::SetCreationTimeUtc($p, $old); [IO.File]::SetLastWriteTimeUtc($p, $old); [IO.File]::SetLastAccessTimeUtc($p, $old) }
    }
    $exPath = Get-FullPath (Join-Path $d 'excluded-old.txt')
    $Script:WS_EXCLUDE = @{ Prefixes = @($exPath + '\'); Roots = @($exPath) }
    $rows = @(Find-PersonalFiles -Roots @((Get-FullPath $d)) -MinBytes 1024 -Days 100)
    $Script:WS_EXCLUDE = $savedExclude
    $got = (@($rows | ForEach-Object { "$(Split-Path -Leaf $_.Path)=$($_.Reason)" } | Sort-Object) -join ',')

    # 25a - large at any age, old at any size, both, each file once; a small new file is not listed
    $checks++
    if ($got -eq 'big-new.bin=large,big-old.iso=both,deep-old.log=old,excluded-old.txt=old,small-old.txt=old') { Write-Ok 'data scanner: large (any age), old (any size) and both, each file once' } else { Write-Err "scanner reasons wrong: $got"; $fails++ }

    # 25b - a file the chokepoint refuses stays visible with its reason and cannot be picked
    $checks++
    $ex = @($rows | Where-Object { $_.Path -eq $exPath })
    if ($ex.Count -eq 1 -and -not $ex[0].Selectable -and $ex[0].SkipReason -like 'excluded: *' -and @($rows | Where-Object { -not $_.Selectable }).Count -eq 1) { Write-Ok 'a refused file is listed with its reason and is not selectable' } else { Write-Err 'refused file handling wrong'; $fails++ }

    # 25c - personal roots: never a drive root, the profile, a system/program/app-data folder, a link or a missing folder
    $checks++
    $link = Join-Path $root 'link'
    New-Item -ItemType Junction -Path $link -Target $d | Out-Null
    $verdicts = @(
      ((Test-PersonalRoot 'C:\') -eq 'a drive root'), ((Test-PersonalRoot $Script:P.U) -eq 'the profile folder itself'),
      ((Test-PersonalRoot $Script:P.PF) -like 'inside a system*'), ((Test-PersonalRoot (Join-Path $Script:P.SR 'Temp')) -like 'inside a system*'),
      ((Test-PersonalRoot (Join-Path $Script:P.L 'Temp')) -like 'inside a system*'), ((Test-PersonalRoot $link) -like 'a link*'),
      ((Test-PersonalRoot (Join-Path $root 'missing')) -eq 'not an existing folder'), ($null -eq (Test-PersonalRoot $d))
    )
    if (@($verdicts | Where-Object { -not $_ }).Count -eq 0) { Write-Ok 'personal roots: drive roots, the profile, system, program and app-data folders, links and missing folders are refused' } else { Write-Err "personal root rules wrong: [$($verdicts -join ',')]"; $fails++ }

    # 25d - right before removal: a changed file, and a folder on the path that became a link, are refused
    $checks++
    $one = @($rows | Where-Object { $_.Path -like '*small-old.txt' })[0]
    $before = Test-PersonalFileUnchanged $one
    [IO.File]::AppendAllText($one.Path, 'x')
    $after = Test-PersonalFileUnchanged $one
    $deepRow = @($rows | Where-Object { $_.Path -like '*deep-old.log' })[0]
    Rename-Item -LiteralPath (Join-Path $d 'sub') -NewName 'sub-real'
    New-Item -ItemType Junction -Path (Join-Path $d 'sub') -Target (Join-Path $d 'sub-real') | Out-Null
    $swap = Test-PersonalFileUnchanged $deepRow
    if ($null -eq $before -and $after -like 'changed since the scan*' -and $swap -like 'a folder on its path became a link*') { Write-Ok 'the change check refuses a file edited after the scan and one now reached through a link' } else { Write-Err "change check wrong: before='$before' after='$after' swap='$swap'"; $fails++ }

    # 25e - --json carries the scanner's own fields after the shared ones
    $checks++
    $ws.JsonMode = $true; $ws.Candidates = @()
    Add-JsonCandidate -Section 19 -Index 1 -Path 'C:\x' -Bytes 5 -IdleDays 400 -Extra ([ordered]@{ reason = 'both'; age_basis = 'write'; selectable = $true })
    $c = $ws.Candidates[0]
    if ((@($c.Keys) -join ',') -eq 'section,index,path,bytes,idle_days,project,reason,age_basis,selectable') { Write-Ok '--json: section 19 candidates add reason, age_basis and selectable after the shared fields' } else { Write-Err "candidate shape wrong: $(@($c.Keys) -join ',')"; $fails++ }
  } catch {
    Write-Err "group [25] crashed: $($_.Exception.Message) | at $(($_.ScriptStackTrace -split "`n" | Select-Object -First 3) -join ' <- ')"; $fails++
  } finally {
    $Script:WS_EXCLUDE = $savedExclude
    $ws.JsonMode = $saved.Json; $ws.Candidates = $saved.Cands
    foreach ($j in @((Join-Path $root 'link'), (Join-Path $root 'data\sub'))) { try { if ((Test-Path -LiteralPath $j) -and (Test-ReparsePoint (Get-Item -LiteralPath $j -Force))) { [IO.Directory]::Delete($j, $false) } } catch { $null = $_ } }
    try { if (Test-Path -LiteralPath $root) { [IO.Directory]::Delete((Get-LongPath $root), $true) } } catch { $null = $_ }
  }
  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}

function Invoke-SelfTest23 {
  <# .SYNOPSIS Group [23]: section 27's command-path reader and machine leftover finder. #>
  param([string] $Fixture)
  $checks = 0; $fails = 0
  $root = Join-Path $Fixture 'g23'
  $savedExclude = $Script:WS_EXCLUDE
  try {
    Write-Section '[23] 1.4.0: leftover program folders (section 27)'
    # 23a - registered commands as services, drivers, tasks and Run entries write them
    $checks++
    $SR = $Script:P.SR
    $cases = @(
      @('\SystemRoot\System32\drivers\foo.sys', "$SR\System32\drivers\foo.sys"),
      @('system32\DRIVERS\bar.sys', "$SR\system32\DRIVERS\bar.sys"),
      @('\??\C:\Drivers\z.sys', 'C:\Drivers\z.sys'),
      @('"C:\Program Files\X\x.exe" --data "D:\Data Dir\cfg"', 'C:\Program Files\X\x.exe|D:\Data Dir\cfg'),
      @('rundll32.exe C:\Tools\a.dll,Entry', 'C:\Tools\a.dll'),
      @('%SystemRoot%\system32\svchost.exe -k netsvcs', ([Environment]::ExpandEnvironmentVariables('%SystemRoot%') + '\system32\svchost.exe'))
    )
    $bad = @()
    foreach ($c in $cases) { $got = (@(Get-CommandPaths $c[0]) -join '|'); if ($got -ne $c[1]) { $bad += "[$($c[0])] -> [$got]" } }
    if ($bad.Count -eq 0) { Write-Ok 'service, driver, task and Run commands resolve to the paths they use' } else { Write-Err "command paths wrong: $($bad -join '; ')"; $fails++ }

    # 23b - only an unclaimed folder idle --days is offered
    $checks++
    $m = Join-Path $root 'machine'
    $old = [datetime]::UtcNow.AddDays(-40)
    foreach ($d in 'OldVendor', 'FreshVendor', 'UsedByPath', 'ClaimedName', 'Windows Defender', 'MSECache', 'DESIGNER', 'Validity') { $null = New-AgedFiles -Dir (Join-Path $m $d) -Count 2 -WrittenDaysAgo 40 -FreshReads 0 }
    [IO.File]::WriteAllText((Join-Path $m 'FreshVendor\new.txt'), 'x')
    $claims = New-ClaimsFixture -Tokens @('claimedname') -Paths @((Join-Path $m 'UsedByPath\f000.bin'))
    $rows = @(Find-MachineLeftovers -Days 30 -Roots @($m) -Claims $claims)
    $names = @($rows | ForEach-Object { Split-Path -Leaf $_.Path })
    if (($names -join ',') -eq 'OldVendor' -and -not $rows[0].Reason -and $rows[0].Idle -ge 30) { Write-Ok 'machine leftovers: a fresh folder, one still in use, one an installed program names and a Windows folder are never offered' } else { Write-Err "machine leftovers wrong: [$($names -join ',')] old=$($old.ToString('u'))"; $fails++ }

    # 23c - a folder the person excluded (or a protected one) is reported, never offered
    $checks++
    $oldPath = Get-FullPath (Join-Path $m 'OldVendor')
    $Script:WS_EXCLUDE = @{ Prefixes = @($oldPath + '\'); Roots = @($oldPath) }
    $ex = @(Find-MachineLeftovers -Days 30 -Roots @($m) -Claims $claims)
    $Script:WS_EXCLUDE = $savedExclude
    if ($ex.Count -eq 1 -and $ex[0].Reason -like 'excluded: *') { Write-Ok 'an excluded or protected leftover carries its reason and is only reported' } else { Write-Err "exclusion not honoured: $(@($ex | ForEach-Object { "$($_.Path)=$($_.Reason)" }) -join '; ')"; $fails++ }

    # 23e - an 8.3 name in a registration (COM servers store them) resolves to the long path a folder is listed by
    $checks++
    $long = Join-Path $Script:P.PF86 'Common Files'
    $short = ''
    try { $short = (New-Object -ComObject Scripting.FileSystemObject).GetFolder($long).ShortPath } catch { $short = '' }
    if (-not $short -or $short -eq $long) { Write-Ok '8.3 names are off on this volume - nothing to expand (not judged)' }
    elseif ((Expand-ShortPath "$short\x.dll") -eq "$long\x.dll") { Write-Ok "8.3 names expand: $short -> $long" } else { Write-Err "short path not expanded: $short -> $(Expand-ShortPath "$short\x.dll")"; $fails++ }

    # 23d - an unreadable registry offers nothing
    $checks++
    $none = @(Find-MachineLeftovers -Days 0 -Roots @($m) -Claims (New-ClaimsFixture -RegistryCount 0))
    if ($none.Count -eq 0) { Write-Ok 'no readable uninstall entries: no machine leftover is offered (fail closed)' } else { Write-Err "fail-closed gate broken: $($none.Count) row(s)"; $fails++ }
  } catch {
    Write-Err "group [23] crashed: $($_.Exception.Message) | at $(($_.ScriptStackTrace -split "`n" | Select-Object -First 3) -join ' <- ')"; $fails++
  } finally {
    $Script:WS_EXCLUDE = $savedExclude
    try { if (Test-Path -LiteralPath $root) { [IO.Directory]::Delete((Get-LongPath $root), $true) } } catch { $null = $_ }
  }
  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}
