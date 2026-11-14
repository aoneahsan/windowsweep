# self_test_1_5u.ps1 - self-test group [28] for the 1.5.0 update sections: 30 (Windows updates), 31 (drivers) and
# 32 (app updates). Pure functions on fixtures only: no Windows Update COM call, no winget, no pnputil, no network;
# nothing is downloaded, installed or removed. Called from self_test_extra.ps1. ASCII only.

function New-DriverPackageFixture {
  <# .SYNOPSIS A driver-store package shaped like Get-WindowsDriver returns, for check 28d. #>
  param([string] $Driver, [string] $Version, [string] $Date, [string] $Inf = 'nvhm.inf', [string] $Provider = 'NVIDIA',
    [string] $Class = 'Display', [bool] $Inbox = $false, [bool] $Boot = $false)
  $repo = 'C:\Windows\System32\DriverStore\FileRepository\{0}_amd64_{1}\{0}' -f $Inf, $Driver.Replace('.inf', '')
  return [pscustomobject]@{ Driver = $Driver; OriginalFileName = $repo; ProviderName = $Provider; ClassName = $Class
    Version = $Version; Date = [datetime]::ParseExact($Date, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture); Inbox = $Inbox; BootCritical = $Boot }
}

function New-WuUpdateFixture {
  <# .SYNOPSIS A Windows Update entry with the property names of the COM IUpdate, for check 28e. #>
  param([string] $Title, [string] $Kb, [long] $Min, [long] $Max, [object[]] $Categories, [string] $Id, [bool] $BrowseOnly = $false)
  return [pscustomobject]@{ Title = $Title; KBArticleIDs = @($Kb); MinDownloadSize = $Min; MaxDownloadSize = $Max; BrowseOnly = $BrowseOnly
    Categories = $Categories; MsrcSeverity = ''; Identity = [pscustomobject]@{ UpdateID = $Id } }
}

function Invoke-SelfTest28 {
  <# .SYNOPSIS Group [28]: the update sections on fixtures. Returns an object with Checks and Fails counts. #>
  param([string] $Fixture)
  $checks = 0; $fails = 0
  Write-Section '[28] 1.5.0: Windows updates (30), drivers (31), app updates (32) - fixtures only'
  try {
    # 28a - the winget table, read by position: a spinner glued to the header, a two-character East Asian name four
    #       columns wide, an Id winget cut short, the count line, then a second table that is only counted. The same
    #       text is parsed raw and as PowerShell captures it (every carriage return splits a line), via a UTF-8 file.
    $checks++
    $ell = [string][char]0x2026
    $cjk = [string][char]0x5FAE + [string][char]0x4FE1
    $fmt = '{0,-19}{1,-19}{2,-9}{3,-11}{4}'
    $lines = @(
      ("   - `r   \ `r" + ($fmt -f 'Name', 'Id', 'Version', 'Available', 'Source')),
      ('-' * 64),
      ($fmt -f 'Git', 'Git.Git', '2.54.0', '2.56.0.4', 'winget'),
      ($cjk + (' ' * 15) + ('{0,-19}{1,-9}{2,-11}{3}' -f 'Tencent.WeChat', '3.9.10', '4.0.1', 'winget')),
      ($fmt -f 'Some Long App', ('Vendor.LongNam' + $ell), '1.0', '2.0', 'winget'),
      '3 upgrades available.',
      '',
      'The following packages have an upgrade available, but require explicit targeting for upgrade:',
      ($fmt -f 'Name', 'Id', 'Version', 'Available', 'Source'),
      ('-' * 64),
      ($fmt -f 'Pinned App', 'Pinned.App', '1.0', '1.1', 'winget')
    )
    $file = Join-Path $Fixture 'winget-upgrade.txt'
    [IO.File]::WriteAllLines($file, [string[]]$lines, (New-Object System.Text.UTF8Encoding($false)))
    $bad28a = @()
    foreach ($shape in @(@{ Name = 'raw'; Lines = $lines }, @{ Name = 'captured'; Lines = [IO.File]::ReadAllLines($file, [Text.Encoding]::UTF8) })) {
      $t = ConvertFrom-WingetTable -Lines $shape.Lines
      $r = @($t.Rows)
      $ok = ($r.Count -eq 2 -and $r[0].Id -eq 'Git.Git' -and $r[0].Version -eq '2.54.0' -and $r[0].Available -eq '2.56.0.4' -and
        $r[1].Id -eq 'Tencent.WeChat' -and $r[1].Name -eq $cjk -and $r[1].Version -eq '3.9.10' -and $r[1].Available -eq '4.0.1' -and
        @($t.Truncated).Count -eq 1 -and $t.LaterRows -eq 1)
      if (-not $ok) { $bad28a += "$($shape.Name): rows=[$(($r | ForEach-Object { "$($_.Id) $($_.Version)->$($_.Available)" }) -join '; ')] cut=$(@($t.Truncated).Count) later=$($t.LaterRows)" }
    }
    if ($bad28a.Count -eq 0) { Write-Ok 'winget table: 2 rows by position (spinner, wide name, cut Id skipped, count line), second table only counted' } else { Write-Err ("winget table parsed wrong: " + ($bad28a -join ' | ')); $fails++ }

    # 28b - BIOS, UEFI and firmware are never offered; an ordinary display driver is
    $checks++
    $fw = [pscustomobject]@{ Title = 'Lenovo Ltd. - 1.0.0.12'; DriverClass = 'Firmware' }
    $bios = [pscustomobject]@{ Title = 'Lenovo - System - ThinkPad BIOS Update 1.52'; DriverClass = 'System' }
    $uefi = [pscustomobject]@{ Title = 'Lenovo - UEFI capsule 1.10'; DriverClass = 'System' }
    $gpu = [pscustomobject]@{ Title = 'NVIDIA - Display - 31.0.15.5244'; DriverClass = 'Display' }
    $verdicts = @((Test-DriverUpdateOffered $fw), (Test-DriverUpdateOffered $bios), (Test-DriverUpdateOffered $uefi), (Test-DriverUpdateOffered $gpu))
    if (($verdicts -join ',') -eq 'False,False,False,True') { Write-Ok 'driver filter: Firmware class, a BIOS title and a UEFI title refused; a display driver offered' } else { Write-Err "driver filter wrong (firmware, BIOS, UEFI, display): $($verdicts -join ',')"; $fails++ }

    # 28c - the PC maker's own tool is only ever named, never run: on the P52 (2026-11-14) Lenovo System Update's
    # command line queued a firmware package past its driver-only switch. Every note keeps BIOS and firmware unticked.
    $checks++
    $notes = @((Get-MakerUpdaterNote -Maker 'LENOVO' -LenovoInstalled $true), (Get-MakerUpdaterNote -Maker 'LENOVO' -LenovoInstalled $false),
      (Get-MakerUpdaterNote -Maker 'Dell Inc.' -LenovoInstalled $false), (Get-MakerUpdaterNote -Maker 'HP' -LenovoInstalled $false))
    $named = @($notes | Where-Object { $_ -match 'does not run it' -and $_ -match 'BIOS or firmware unticked' }).Count
    $runner = [bool](Get-Command 'Invoke-LenovoSystemUpdate' -ErrorAction SilentlyContinue)
    if ($named -eq 4 -and -not $runner) { Write-Ok "PC maker's tool: named for Lenovo, Dell and HP with BIOS and firmware left unticked; nothing runs it" } else { Write-Err "maker-tool rule wrong: named=$named runnerPresent=$runner"; $fails++ }

    # 28d - driver store: by [version] then date, the newest two of a group stay; inbox and boot-critical never go
    $checks++
    $pkgs = @(
      (New-DriverPackageFixture 'oem1.inf' '9.0.0.0' '2020-01-01'), (New-DriverPackageFixture 'oem2.inf' '10.0.0.0' '2021-01-01'),
      (New-DriverPackageFixture 'oem3.inf' '11.0.0.0' '2022-01-01'), (New-DriverPackageFixture 'oem4.inf' '12.0.0.0' '2023-01-01'),
      (New-DriverPackageFixture 'oem5.inf' '100.0.0.0' '2019-01-01'),
      (New-DriverPackageFixture 'oem6.inf' '1.0.0.0' '2018-01-01' -Inbox $true), (New-DriverPackageFixture 'oem7.inf' '2.0.0.0' '2018-06-01' -Boot $true),
      (New-DriverPackageFixture 'oem8.inf' '5.0.0.0' '2020-01-01' -Inf 'rtwlane.inf' -Provider 'Realtek' -Class 'Net'),
      (New-DriverPackageFixture 'oem9.inf' '6.0.0.0' '2021-01-01' -Inf 'rtwlane.inf' -Provider 'Realtek' -Class 'Net')
    )
    $gone = @(Select-SupersededDriverPackages -Packages $pkgs | ForEach-Object { $_.Driver } | Sort-Object)
    if (($gone -join ',') -eq 'oem1.inf,oem2.inf,oem3.inf') { Write-Ok 'driver store: the 3 oldest of 5 offered; 100.0 and 12.0 kept, inbox, boot-critical and a 2-copy group untouched' } else { Write-Err "driver store selection wrong: [$($gone -join ',')]"; $fails++ }

    # 28e - a Windows Update entry as a row: BrowseOnly left out, an absurd size unknown, KB and path right
    $checks++
    $sec = [pscustomobject]@{ Name = 'Security Updates'; Type = 'UpdateClassification' }
    $cu = New-WuUpdateFixture -Title '2026-11 Cumulative Update for Windows 10 Version 22H2 for x64-based Systems (KB5131096)' -Kb '5131096' -Min 0 -Max 113011781477 -Categories @($sec) -Id '345e7f26-ccaf-428d-a519-47a384cbc9d0'
    $msrt = New-WuUpdateFixture -Title 'Windows Malicious Software Removal Tool x64 - v5.147 (KB890830)' -Kb '890830' -Min 0 -Max 90831768 -Id '20a25326-d78f-4a69-bc81-fa8430093374' -Categories @(
      [pscustomobject]@{ Name = 'Windows 10'; Type = 'Product' }, [pscustomobject]@{ Name = 'Update Rollups'; Type = 'UpdateClassification' })
    $opt = New-WuUpdateFixture -Title 'Feature update to Windows 11, version 25H2' -Kb '5000000' -Min 0 -Max 4000000000 -Categories @($sec) -Id 'feature' -BrowseOnly $true
    $r1 = ConvertTo-UpdateRow -Update $cu
    $r2 = ConvertTo-UpdateRow -Update $msrt
    $r3 = ConvertTo-UpdateRow -Update $opt
    $ok28e = ($null -eq $r3 -and $null -ne $r1 -and $r1.Bytes -eq 0 -and $r1.Kb -eq 'KB5131096' -and $r1.Path -eq 'wu:345e7f26-ccaf-428d-a519-47a384cbc9d0' -and
      $r1.Category -eq 'Security Updates' -and $r2.Bytes -eq 90831768 -and $r2.Category -eq 'Update Rollups' -and (Get-WuUpdateBytes -Min 1000 -Max 5000) -eq 1000)
    if ($ok28e) { Write-Ok 'update rows: BrowseOnly left out, 105 GB shown as unknown, KB5131096 at wu:<UpdateID>, classification used as category' } else { Write-Err "update rows wrong: browseOnly=$($null -eq $r3) bytes=$($r1.Bytes)/$($r2.Bytes) kb=$($r1.Kb) path=$($r1.Path) category=$($r1.Category)/$($r2.Category)"; $fails++ }

    # 28f - the catalogue contract: 30-32 are interactive update rows and sit in no unattended list
    $checks++
    $lists = @{ 'safe batch' = $Script:WS_SAFE_BATCH; 'safe batch (admin)' = $Script:WS_SAFE_BATCH_ADMIN; 'walkthrough' = $Script:WS_WALKTHROUGH; 'walkthrough (admin)' = $Script:WS_WALKTHROUGH_ADMIN }
    foreach ($p in $Script:WS_PROFILES.Keys) { $lists["profile $p"] = $Script:WS_PROFILES[$p] }
    $bad28f = @()
    foreach ($id in 30, 31, 32) {
      $s = Get-Section $id
      if (-not $s) { $bad28f += "no section $id"; continue }
      if ($s.Batch -ne 'interactive') { $bad28f += "$id is batch $($s.Batch)" }
      if ($s.Tier -ne 'update') { $bad28f += "$id is tier $($s.Tier)" }
      foreach ($name in $lists.Keys) { if (@($lists[$name]) -contains $id) { $bad28f += "$id is in the $name" } }
    }
    if ($bad28f.Count -eq 0) { Write-Ok "catalogue: 30-32 are interactive 'update' rows, in no batch, profile or walkthrough" } else { Write-Err ("catalogue contract broken: " + ($bad28f -join '; ')); $fails++ }
  } catch {
    Write-Err "group [28] crashed: $($_.Exception.Message) | at $(($_.ScriptStackTrace -split "`n" | Select-Object -First 3) -join ' <- ')"; $fails++
  }
  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}
