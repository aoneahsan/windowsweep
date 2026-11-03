# self_test_1_4.ps1 - self-test group [19]: the 1.4.0 behaviour found on a real machine (P9, 2026-11-02).
# Called by Invoke-SelfTestExtra with its fixture root; verdict lines only. ASCII only.

function New-AgedFiles {
  <# .SYNOPSIS Create Count files under Dir whose write and creation times are WrittenDaysAgo old; the first
     FreshReads of them were "read" just now, the rest were read when written. Returns the directory. #>
  param([string] $Dir, [int] $Count, [int] $WrittenDaysAgo, [int] $FreshReads)
  New-Item -ItemType Directory -Force -Path $Dir | Out-Null
  $old = [datetime]::UtcNow.AddDays(-1 * $WrittenDaysAgo)
  for ($i = 0; $i -lt $Count; $i++) {
    $f = Join-Path $Dir ("f{0:D3}.bin" -f $i)
    [IO.File]::WriteAllText($f, 'x')
    [IO.File]::SetCreationTimeUtc($f, $old)
    [IO.File]::SetLastWriteTimeUtc($f, $old)
    if ($i -lt $FreshReads) { [IO.File]::SetLastAccessTimeUtc($f, [datetime]::UtcNow) } else { [IO.File]::SetLastAccessTimeUtc($f, $old) }
  }
  return $Dir
}

function Invoke-SelfTest14 {
  <# .SYNOPSIS Run group [19]. Returns an object with Checks and Fails counts. #>
  param([string] $Fixture)
  $checks = 0; $fails = 0
  $root = Join-Path $Fixture 'g19'
  Reset-AccessVerdicts
  try {
    Write-Section '[19] 1.4.0: idle basis when last-access is live (D82), one-line --json, orphan claims'

    # 19a - the verdict rule itself
    $checks++
    $a = Test-AccessSampleLive -Old 30 -FreshAccess 28
    $b = Test-AccessSampleLive -Old 30 -FreshAccess 20
    $c = Test-AccessSampleLive -Old 10 -FreshAccess 10
    if ($a -and -not $b -and -not $c) { Write-Ok 'live verdict: 28 of 30 old files read today is live; 20 of 30 is not; 10 files are too few to judge' } else { Write-Err "live verdict wrong: 28/30=$a 20/30=$b 10/10=$c"; $fails++ }

    # 19b - a root where every old file was "read" today: the idle gate falls back to write time
    $checks++
    $live = New-AgedFiles -Dir (Join-Path $root 'live') -Count 30 -WrittenDaysAgo 60 -FreshReads 30
    $isLive = Test-LastAccessLive -Root $live
    # Assigned directly: @() around a member-accessed List[object] throws "Argument types do not match" on PS 5.1.
    $stale = (Get-StaleFiles -Root $live -Days 30).Files
    if ($isLive -and $stale.Count -eq 30) { Write-Ok 'live last-access: the root is detected and all 30 files written 60 days ago are idle' } else { Write-Err "live root: detected=$isLive stale=$($stale.Count) of 30"; $fails++ }

    # 19c - an honest root (read when written): behaviour unchanged
    $checks++
    $honest = New-AgedFiles -Dir (Join-Path $root 'honest') -Count 30 -WrittenDaysAgo 60 -FreshReads 0
    $isLive = Test-LastAccessLive -Root $honest
    $stale = (Get-StaleFiles -Root $honest -Days 30).Files
    if (-not $isLive -and $stale.Count -eq 30) { Write-Ok 'honest last-access: not flagged, and the 30 old files are idle as before' } else { Write-Err "honest root: detected=$isLive stale=$($stale.Count) of 30"; $fails++ }

    # 19d - a mixed root: the files really read recently are still kept (the conservative rule holds)
    $checks++
    $mixed = New-AgedFiles -Dir (Join-Path $root 'mixed') -Count 30 -WrittenDaysAgo 60 -FreshReads 5
    $isLive = Test-LastAccessLive -Root $mixed
    $stale = (Get-StaleFiles -Root $mixed -Days 30).Files
    if (-not $isLive -and $stale.Count -eq 25) { Write-Ok 'mixed root: 5 of 30 read today is a real signal - those 5 are kept, 25 are idle' } else { Write-Err "mixed root: detected=$isLive stale=$($stale.Count) (expected 25)"; $fails++ }

    # 19e - a root too small to judge: conservative alone, live only when its volume was found live
    $checks++
    Reset-AccessVerdicts
    $small1 = New-AgedFiles -Dir (Join-Path $root 'small1') -Count 3 -WrittenDaysAgo 60 -FreshReads 3
    $idleAlone = Get-IdleDays $small1
    $null = Test-LastAccessLive -Root $live
    $small2 = New-AgedFiles -Dir (Join-Path $root 'small2') -Count 3 -WrittenDaysAgo 60 -FreshReads 3
    $idleInherited = Get-IdleDays $small2
    if ($idleAlone -eq 0 -and $idleInherited -ge 59) { Write-Ok 'small root: 0 days idle on its own, 60 once its volume is known to have live last-access' } else { Write-Err "small root: alone=$idleAlone inherited=$idleInherited"; $fails++ }

    # 19g - the --json summary names the volume whose idle age used write/creation time
    $checks++
    $vol = (Get-VolumeKey $live).TrimEnd('\').ToUpperInvariant()
    $doc = (Get-JsonSummary) | ConvertTo-Json -Depth 5 -Compress
    $named = @(($doc | ConvertFrom-Json).access_live_volumes)
    if ($named -contains $vol -and -not $doc.Contains("`n")) { Write-Ok "--json names the live-access volume ($vol) in access_live_volumes, still on one line" } else { Write-Err "access_live_volumes wrong: [$($named -join ',')] expected $vol"; $fails++ }

    # 19h-19l - section 23 claims learned from the P52 (every case erred towards calling a live folder orphaned)
    $set = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
    foreach ($name in 'windowsweep', 'DBeaverCorp.DBeaverCE', 'Internet Download Manager') { Add-MatchTokens -Set $set -Text $name }
    Add-CommandLineTokens -Set $set -CommandLine 'node C:/Users/x/.claude/plugins/cache/superpowers-chrome/3.0.2/mcp/dist/index.js'
    $index = [pscustomobject]@{ Tokens = $set; RegistryCount = 3; Rows = @() }
    $checks++
    $dnsClaimed = -not (Test-OrphanFolderName -Name 'com.aoneahsan.windowsweep' -Index $index)
    $dnsOrphan = Test-OrphanFolderName -Name 'com.example.zqxwvu' -Index $index
    if ($dnsClaimed -and $dnsOrphan) { Write-Ok 'reverse-DNS data folder: com.aoneahsan.windowsweep is claimed by "windowsweep"; an unknown app id stays an orphan' } else { Write-Err "reverse-DNS claim wrong: claimed=$dnsClaimed unknownIsOrphan=$dnsOrphan"; $fails++ }
    $checks++
    $stem = -not (Test-OrphanFolderName -Name 'DBeaverData' -Index $index)
    $other = Test-OrphanFolderName -Name 'ChessBase' -Index $index
    if ($stem -and $other) { Write-Ok 'vendor stem: DBeaverData is claimed by the DBeaverCorp.DBeaverCE Store app; ChessBase is not' } else { Write-Err "vendor stem wrong: DBeaverData claimed=$stem ChessBase orphan=$other"; $fails++ }
    $checks++
    if (-not (Test-OrphanFolderName -Name 'IDM' -Index $index)) { Write-Ok 'acronym: IDM is claimed by Internet Download Manager' } else { Write-Err 'acronym claim missing: IDM offered as orphaned'; $fails++ }
    $checks++
    $bare = New-Object System.Collections.Generic.HashSet[string]([StringComparer]::Ordinal)
    Add-MatchTokens -Set $bare -Text 'windowsweep'
    Add-CommandLineTokens -Set $bare -CommandLine 'bash -c "grep -c vega-desktop-updater log.txt"'
    $bareIndex = [pscustomobject]@{ Tokens = $bare; RegistryCount = 1; Rows = @() }
    $pathClaims = -not (Test-OrphanFolderName -Name 'superpowers' -Index $index)
    $wordIgnored = Test-OrphanFolderName -Name 'vega-desktop-updater' -Index $bareIndex
    if ($pathClaims -and $wordIgnored) { Write-Ok 'command line: a folder in a running PATH (superpowers) is claimed; a bare word in a shell command line claims nothing' } else { Write-Err "command-line claim wrong: pathClaims=$pathClaims bareWordIgnored=$wordIgnored"; $fails++ }
    $checks++
    $why = Get-ProtectionReason (Join-Path $env:LOCALAPPDATA 'com.aoneahsan.windowsweep\EBWebView')
    if ($why) { Write-Ok "the desktop app's own data folder is protected ($why)" } else { Write-Err "DANGEROUS: the desktop app's data folder is not protected"; $fails++ }

    # 19f - nothing a section emits can reach --json stdout
    $checks++
    $runner = Get-Content -LiteralPath (Join-Path $Script:WS_ROOT 'modules\runner.ps1') -Raw
    $admin = Get-Content -LiteralPath (Join-Path $Script:WS_ROOT 'modules\system_admin.ps1') -Raw
    $runnerOk = $runner -match '\$null = & \$sec\.Fn'
    $doLines = @($admin -split "`n" | Where-Object { $_ -match 'Delete-DeliveryOptimizationCache -Force -ErrorAction' })
    $doOk = ($doLines.Count -ge 1) -and (@($doLines | Where-Object { $_ -notmatch '\*>&1' }).Count -eq 0)
    if ($runnerOk -and $doOk) { Write-Ok 'section output is discarded by the runner, and the Delivery Optimization cmdlet is captured on every stream' } else { Write-Err "stdout guards missing: runner=$runnerOk deliveryOptimization=$doOk"; $fails++ }
  } catch {
    Write-Err "group [19] crashed: $($_.Exception.Message) | at $(($_.ScriptStackTrace -split "`n" | Select-Object -First 3) -join ' <- ')"; $fails++
  } finally {
    Reset-AccessVerdicts
    try { if (Test-Path -LiteralPath $root) { [IO.Directory]::Delete((Get-LongPath $root), $true) } } catch { $null = $_ }
  }
  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}

function Invoke-SelfTest20 {
  <# .SYNOPSIS Group [20]: section 28 (superseded releases, Node pins) and the D79 exception rules. #>
  param([string] $Fixture)
  $checks = 0; $fails = 0
  $root = Join-Path $Fixture 'g20'
  $savedExclude = $Script:WS_EXCLUDE
  try {
    Write-Section '[20] 1.4.0: superseded releases (section 28) and narrow exceptions (D79)'
    $rel = Join-Path $root 'codex\releases'
    foreach ($v in '0.1.0-x86_64-pc-windows-msvc', '0.2.0-x86_64-pc-windows-msvc', '0.3.0-x86_64-pc-windows-msvc', '0.4.0-x86_64-pc-windows-msvc', 'notes') { New-Item -ItemType Directory -Force -Path (Join-Path $rel $v) | Out-Null }
    $link = Join-Path $root 'codex\current'

    # 20b first, while the link is absent - no readable current release means nothing is dropped
    $checks++
    $none = Get-CodexReleasePlan -Root $rel -CurrentLink $link
    if ($none.Reason -and @($none.Drop).Count -eq 0) { Write-Ok 'no current-release link: nothing is offered (fail closed)' } else { Write-Err "missing link not fail-closed: drop=[$($none.Drop -join ',')]"; $fails++ }

    # 20a - current 0.3.0 keeps itself, the newer 0.4.0, the rollback 0.2.0 and the odd folder; only 0.1.0 goes
    $checks++
    New-Item -ItemType Junction -Path $link -Target (Join-Path $rel '0.3.0-x86_64-pc-windows-msvc') | Out-Null
    $plan = Get-CodexReleasePlan -Root $rel -CurrentLink $link
    $dropNames = @($plan.Drop | ForEach-Object { Split-Path -Leaf $_ })
    $keepNames = @($plan.Keep | ForEach-Object { Split-Path -Leaf $_ } | Sort-Object)
    if (-not $plan.Reason -and ($dropNames -join ',') -eq '0.1.0-x86_64-pc-windows-msvc' -and $keepNames.Count -eq 4) { Write-Ok 'Codex plan: current, newer, rollback and an odd folder kept; only the oldest release goes' } else { Write-Err "Codex plan wrong: drop=[$($dropNames -join ',')] keep=[$($keepNames -join ',')] reason='$($plan.Reason)'"; $fails++ }

    # 20c - the live exceptions are exactly the live plan's Drop folders, and the kept ones stay protected
    $checks++
    $live = Get-CodexReleasePlan
    $codexPrefix = (Join-Path $Script:P.U '.codex') + '\'
    $ex = @($Script:WS_PROTECT.Exceptions | Where-Object { $_.StartsWith($codexPrefix, [StringComparison]::OrdinalIgnoreCase) } | Sort-Object)
    $want = @($live.Drop | Sort-Object)
    $keptOpen = @($live.Keep | Where-Object { -not (Get-ProtectionReason $_) })
    if ((($ex -join '|') -eq ($want -join '|')) -and $keptOpen.Count -eq 0) { Write-Ok "D79: $($ex.Count) Codex exception(s), exactly the superseded releases; every kept release still refused" } else { Write-Err "D79 exceptions wrong: exceptions=[$($ex -join ',')] plan=[$($want -join ',')] keptButAllowed=[$($keptOpen -join ',')]"; $fails++ }

    # 20d - an exception never lifts the user's own --exclude-path
    $checks++
    $tempEx = $Script:WS_PROTECT.Exceptions | Select-Object -First 1
    $inside = Join-Path $tempEx 'probe.bin'
    $open = Get-ProtectionReason $inside
    $Script:WS_EXCLUDE = @{ Prefixes = @($tempEx.TrimEnd('\') + '\'); Roots = @($tempEx) }
    $closed = Get-ProtectionReason $inside
    if (-not $open -and $closed -like 'excluded: *') { Write-Ok 'inside an exception, the path is allowed - until the user excludes it' } else { Write-Err "exception vs exclusion wrong: open='$open' closed='$closed'"; $fails++ }
    $Script:WS_EXCLUDE = $savedExclude

    # 20e - Node: the active version, exact pins and the newest of a pinned major stay; nothing else is needed
    $checks++
    $pins = @('24.13.0', '24', '22', '20', 'v24.16.0' | ForEach-Object { ConvertTo-NodePin $_ })
    $np = Get-NodeVersionPlan -Installed @('v22.22.0', 'v24.10.0', 'v24.13.0') -Active 'v24.13.0' -Pins $pins
    $odd = Get-NodeVersionPlan -Installed @('v22.22.0', 'v24.10.0') -Active 'v22.22.0' -Pins @((ConvertTo-NodePin 'banana'))
    if (($np.Drop -join ',') -eq 'v24.10.0' -and @($np.Keep).Count -eq 2 -and @($np.Unmet).Count -eq 2 -and $odd.Reason -and @($odd.Drop).Count -eq 0) { Write-Ok 'Node plan: only v24.10.0 is unrequested; 20 and 24.16.0 are reported as missing; an unreadable request keeps everything' } else { Write-Err "Node plan wrong: drop=[$($np.Drop -join ',')] keep=[$($np.Keep -join ',')] unmet=[$($np.Unmet -join ',')] oddDrop=[$($odd.Drop -join ',')]"; $fails++ }

    # 20f - version requests as projects write them
    $checks++
    $kinds = @('v24.16.0', '24', '>=22.12.0', '^24', 'lts/*', 'banana' | ForEach-Object { $n = ConvertTo-NodePin $_; "$($n.Kind):$($n.Major)" })
    if (($kinds -join ' ') -eq 'exact:24 major:24 major:22 major:24 newest:0 unknown:0') { Write-Ok 'version requests: exact, major, ranges, lts and nonsense each read correctly' } else { Write-Err "version request parsing wrong: $($kinds -join ' ')"; $fails++ }
  } catch {
    Write-Err "group [20] crashed: $($_.Exception.Message) | at $(($_.ScriptStackTrace -split "`n" | Select-Object -First 3) -join ' <- ')"; $fails++
  } finally {
    $Script:WS_EXCLUDE = $savedExclude
    try { $j = Join-Path $root 'codex\current'; if (Test-Path -LiteralPath $j) { [IO.Directory]::Delete($j, $false) } } catch { $null = $_ }
    try { if (Test-Path -LiteralPath $root) { [IO.Directory]::Delete((Get-LongPath $root), $true) } } catch { $null = $_ }
  }
  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}
