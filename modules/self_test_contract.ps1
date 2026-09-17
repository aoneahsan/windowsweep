# self_test_contract.ps1 - self-test group [18]: the 1.2.0 --json and --exclude-path contract.
#
# Split out of modules/self_test_extra.ps1 at the 1.3.0 cascade (RW-121), which brought that file back
# under the 500-line ceiling IRON rule 6 sets. The body below is VERBATIM - no check was changed, added or
# removed, and the self-test count is unchanged. Called from Invoke-SelfTestExtra inside its own fixture,
# so the fixture root is passed in and cleaned up there.

function Invoke-SelfTestContract {
  <# .SYNOPSIS Group [18]. Takes the caller's fixture root. Returns an object with Checks and Fails counts. #>
  param([Parameter(Mandatory)] [string] $Fixture)
  $ws = $Script:WS
  $checks = 0; $fails = 0
  $fx = $Fixture
  $mute = { $Script:WS.Mute = $true }
  $unmute = { $Script:WS.Mute = $false }
  $ancient = (Get-Date).AddDays(-400)

    Write-Section '[18] The 1.2.0 contract additions: newest_write_utc, protected, --exclude-path'

    # 18a - targets[].newest_write_utc reports the newest timestamp under a target, in ISO 8601 UTC.
    # A fixture with a KNOWN mtime, so the assertion is about the value and not merely about the shape.
    $checks++
    $nw = Join-Path $fx 'newest'
    New-Item -ItemType Directory -Force -Path (Join-Path $nw 'deep') | Out-Null
    Set-Content -LiteralPath (Join-Path $nw 'old.txt') -Value 'x'
    Set-Content -LiteralPath (Join-Path $nw 'deep\\new.txt') -Value 'x'
    $stampOld = [datetime]::new(2021, 3, 4, 5, 6, 7, [DateTimeKind]::Utc)
    $stampNew = [datetime]::new(2023, 11, 12, 13, 14, 15, [DateTimeKind]::Utc)
    foreach ($ts in 'LastWriteTime', 'LastAccessTime', 'CreationTime') {
      Set-ItemProperty -LiteralPath (Join-Path $nw 'old.txt') -Name $ts -Value $stampOld.ToLocalTime()
      Set-ItemProperty -LiteralPath (Join-Path $nw 'deep\\new.txt') -Name $ts -Value $stampNew.ToLocalTime()
    }
    $st = Get-DirectoryStats $nw
    $iso = Format-Utc8601 $st.Newest
    # The DEEPER file is the newer one, so a walk that stopped at the top level would report the older stamp
    # and still look like a working timestamp - which is the failure this fixture is shaped to catch.
    $wantIso = '2023-11-12T13:14:15Z'
    $nullIso = Format-Utc8601 ([datetime]::MinValue)
    if ($iso -eq $wantIso -and $null -eq $nullIso) { Write-Ok "newest_write_utc reads the deepest newest file ($iso) and is null for an empty tree" } else { Write-Err "newest_write_utc wrong: got $iso want $wantIso; MinValue gave '$nullIso'"; $fails++ }

    # 18b - --list --json publishes the SAME protected lists the console prints, from one constant.
    $checks++
    $cat = Get-CatalogueJson
    $prot = $cat.protected
    $sameSub = ($null -ne $prot) -and ((@($prot.subtrees) -join '|') -eq (@($Script:WS_PROTECT.Subtrees) -join '|'))
    $sameCat = ($null -ne $prot) -and ((@($prot.categories) -join '|') -eq (@($Script:WS_PROTECT_CATEGORIES) -join '|'))
    $nonEmpty = ($null -ne $prot) -and (@($prot.subtrees).Count -gt 0) -and (@($prot.categories).Count -gt 0)
    if ($sameSub -and $sameCat -and $nonEmpty) { Write-Ok "--list --json publishes the same $(@($prot.subtrees).Count) protected subtrees and $(@($prot.categories).Count) categories the console prints" } else { Write-Err "--list --json protected does not match the printed lists (subtrees=$sameSub categories=$sameCat nonEmpty=$nonEmpty)"; $fails++ }

    # 18c - an excluded path SURVIVES a real fixture run while its sibling goes. Not a dry-run: the whole
    # point is that the chokepoint refuses the deletion rather than merely declining to print it.
    $checks++
    $exRoot = Join-Path $fx 'excl'
    $keep = Join-Path $exRoot 'keep-me'
    $go = Join-Path $exRoot 'go-away'
    foreach ($d in $keep, $go) { New-Item -ItemType Directory -Force -Path $d | Out-Null; Set-Content -LiteralPath (Join-Path $d 'f.txt') -Value 'xxxx' }
    $savedEx = $ws.ExcludePaths
    $savedExcluded = $ws.Excluded
    $savedTable = $Script:WS_EXCLUDE
    try {
      $ws.ExcludePaths = @($keep)
      $ws.Excluded = @()
      Initialize-Exclusions
      & $mute
      $rKeep = Remove-PathSafe -Path $keep -Within $exRoot
      $rGo = Remove-PathSafe -Path $go -Within $exRoot
      & $unmute
      $keptOnDisk = Test-Path -LiteralPath $keep
      # A CHILD, not just the excluded path itself: testing only the exact path let a prefix bug
      # (a doubled backslash) pass this check while nothing inside an excluded folder was refused.
      $childReason = Get-ProtectionReason (Join-Path $keep 'f.txt')
      $childRefused = ($childReason -like 'excluded: *')
      $goneFromDisk = -not (Test-Path -LiteralPath $go)
      $reported = (@($ws.Excluded).Count -eq 1)
      $reasonOk = $rKeep.Reason -like 'excluded: *'
      if ($keptOnDisk -and $goneFromDisk -and $rGo.Removed -and $reported -and $reasonOk -and $childRefused) { Write-Ok "--exclude-path is honoured by the chokepoint for every section: the excluded folder AND a file inside it are both refused, its sibling is not, and it is reported once" } else { Write-Err "--exclude-path not honoured (kept=$keptOnDisk siblingGone=$goneFromDisk reported=$reported childRefused=$childRefused reason='$($rKeep.Reason)')"; $fails++ }
    } finally {
      $ws.ExcludePaths = $savedEx
      $ws.Excluded = $savedExcluded
      $Script:WS_EXCLUDE = $savedTable
    }


    # 18d - the rehearsal and the run agree about an EXCLUDED file inside a pruned cache.
    # Remove-StaleFiles used to apply Get-ProtectionReason only in its real-run loop, so a dry-run
    # counted files the run then skipped and the estimate came out higher than the run - for exactly
    # the files a person most wants the two numbers to agree about.
    $checks++
    $pr = Join-Path $fx 'prune'
    $prKeep = Join-Path $pr 'keep'
    New-Item -ItemType Directory -Force -Path $prKeep | Out-Null
    $goFile = Join-Path $pr 'go.bin'
    $keepFile = Join-Path $prKeep 'keep.bin'
    Set-Content -LiteralPath $goFile -Value ('x' * 400)
    Set-Content -LiteralPath $keepFile -Value ('y' * 400)
    foreach ($f in @($goFile, $keepFile)) {
      foreach ($ts in 'LastWriteTime', 'LastAccessTime', 'CreationTime') {
        Set-ItemProperty -LiteralPath $f -Name $ts -Value $ancient
      }
    }
    $savedEx2 = $ws.ExcludePaths
    $savedTbl2 = $Script:WS_EXCLUDE
    $savedDry = $ws.DryRun
    $savedFreed = $ws.TotalFreed
    $savedEst = $ws.TotalEstimated
    try {
      $ws.ExcludePaths = @($prKeep)
      Initialize-Exclusions
      & $mute
      $ws.DryRun = $true
      $dry = Remove-StaleFiles -Root $pr -Within $pr -Days 1
      $ws.DryRun = $false
      $real = Remove-StaleFiles -Root $pr -Within $pr -Days 1
      & $unmute
      $agree = ($dry.Files -eq $real.Files) -and ($dry.Freed -eq $real.Freed)
      $keptOnDisk2 = Test-Path -LiteralPath $keepFile
      $goneFromDisk2 = -not (Test-Path -LiteralPath $goFile)
      if ($agree -and $keptOnDisk2 -and $goneFromDisk2 -and $dry.Files -eq 1) {
        Write-Ok "a dry-run and a real prune agree exactly when a file is excluded: both report $($dry.Files) file, the excluded one survives"
      } else {
        Write-Err "rehearsal and run disagree (dryFiles=$($dry.Files) realFiles=$($real.Files) dryBytes=$($dry.Freed) realBytes=$($real.Freed) kept=$keptOnDisk2 siblingGone=$goneFromDisk2)"; $fails++
      }
    } finally {
      $ws.ExcludePaths = $savedEx2
      $Script:WS_EXCLUDE = $savedTbl2
      $ws.DryRun = $savedDry
      $ws.TotalFreed = $savedFreed
      $ws.TotalEstimated = $savedEst
    }


    # 18e - a read-only scan REPORTS the developer answer it was given, and invents one when it was not.
    # --scan parsed --developer / --not-developer into DeveloperFlag and then never read it, because
    # Resolve-DeveloperMode ran only for walkthrough, menu, all and only. So section 0 printed
    # "Developer mode: not decided yet" whatever you passed, and --json returned developer: null. The
    # desktop window sends those flags to --scan and could not read back the setting it had just sent.
    # Three orientations, because two of them would pass on the broken code by accident:
    #   A the flag is honoured,  B a saved answer is honoured,  C neither exists -> still undecided.
    $checks++
    $savedFlag = $ws.DeveloperFlag
    $savedDev = $ws.Developer
    $savedSrc = $ws.DeveloperSource
    $savedCfg = $ws.Config
    $savedInter = $ws.Interactive
    $savedForget = $ws.ForgetDeveloper
    try {
      $ws.Interactive = $true          # -ReadOnly must not ask even here; a prompt would hang the suite
      $ws.ForgetDeveloper = $false

      # A - the flag wins, and --not-developer is the case that was silently dropped
      $ws.Config = @{}
      $ws.DeveloperFlag = $false
      $ws.Developer = $null
      $ws.DeveloperSource = $null
      & $mute
      Resolve-DeveloperMode -ReadOnly
      & $unmute
      $aOk = ($ws.Developer -eq $false) -and ($ws.DeveloperSource -eq 'flag')

      # B - no flag, but a saved answer exists
      $ws.Config = @{ developer = $true }
      $ws.DeveloperFlag = $null
      $ws.Developer = $null
      $ws.DeveloperSource = $null
      & $mute
      Resolve-DeveloperMode -ReadOnly
      & $unmute
      $bOk = ($ws.Developer -eq $true) -and ($ws.DeveloperSource -eq 'config')

      # C - neither: a read-only mode must NOT invent a decision, and must not write config.json
      $ws.Config = @{}
      $ws.DeveloperFlag = $null
      $ws.Developer = $null
      $ws.DeveloperSource = $null
      & $mute
      Resolve-DeveloperMode -ReadOnly
      & $unmute
      $cOk = ($null -eq $ws.Developer) -and ($null -eq $ws.Config.developer)

      if ($aOk -and $bOk -and $cOk) {
        Write-Ok "a read-only scan honours --not-developer (flag) and a saved answer (config), and stays undecided when it has neither"
      } else {
        Write-Err "read-only developer resolution wrong (flagHonoured=$aOk savedHonoured=$bOk stillUndecided=$cOk)"; $fails++
      }
    } finally {
      $ws.DeveloperFlag = $savedFlag
      $ws.Developer = $savedDev
      $ws.DeveloperSource = $savedSrc
      $ws.Config = $savedCfg
      $ws.Interactive = $savedInter
      $ws.ForgetDeveloper = $savedForget
    }

  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}
