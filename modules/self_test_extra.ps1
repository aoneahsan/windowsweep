# self_test_extra.ps1 - extra self-test groups: the --yes asymmetry and its call sites (RW-002), pure helpers
# and fixtures for logic that is invisible when wrong (RW-030). Called by Invoke-SelfTest; verdict lines only.

function Invoke-SelfTestExtra {
  <# .SYNOPSIS Run groups [12]-[14]. Returns an object with Checks and Fails counts. #>
  $ws = $Script:WS
  $checks = 0; $fails = 0
  $saved = @{ DryRun = $ws.DryRun; Yes = $ws.Yes; Interactive = $ws.Interactive; Quiet = $ws.Quiet; NoReport = $ws.NoReport
    ScanRoots = $ws.ScanRoots; AllowOwnData = $ws.AllowOwnData; Mute = $ws.Mute; Days = $ws.Days }
  $fx = Join-Path $ws.Home ('selftest-extra-' + [guid]::NewGuid().ToString('N'))
  $mute = { $Script:WS.Mute = $true }
  $unmute = { $Script:WS.Mute = $false }
  $ancient = (Get-Date).AddDays(-400)
  try {
    New-Item -ItemType Directory -Force -Path $fx | Out-Null
    $ws.AllowOwnData = $true
    $ws.NoReport = $true
    $ws.DryRun = $false
    $ws.Days = 100

    Write-Section '[12] Prompts: --yes never selects personal or project items'
    # 12a - the helper asymmetry
    $checks++
    $ws.Yes = $true; $ws.Interactive = $false
    & $mute
    $none = @(Read-MultiSelect -Total 5 -NoAutoYes)
    $all = @(Read-MultiSelect -Total 5)
    & $unmute
    if ($none.Count -eq 0 -and ($all -join ',') -eq '1,2,3,4,5') { Write-Ok 'Read-MultiSelect: -NoAutoYes selects nothing under --yes; without it every index' } else { Write-Err "Read-MultiSelect asymmetry broken: none=[$($none -join ',')] all=[$($all -join ',')]"; $fails++ }
    # 12b - section 17 call site (a fixture project with an artefact idle 400 days)
    $checks++
    $proj = Join-Path $fx 'proj17\app'
    New-Item -ItemType Directory -Force -Path (Join-Path $proj 'node_modules') | Out-Null
    Set-Content -LiteralPath (Join-Path $proj 'package.json') -Value '{"name":"fixture"}'
    Set-Content -LiteralPath (Join-Path $proj 'node_modules\x.txt') -Value 'x'
    foreach ($ts in 'LastWriteTime', 'LastAccessTime', 'CreationTime') { Set-ItemProperty -LiteralPath (Join-Path $proj 'package.json') -Name $ts -Value $ancient }
    $ws.ScanRoots = @((Join-Path $fx 'proj17'))
    & $mute
    # The fixture must be a real candidate, or the removal check below proves nothing.
    $listed = @(Find-StaleArtefacts -Roots $ws.ScanRoots -Days 100)
    Invoke-Section17
    & $unmute
    if ($listed.Count -eq 1 -and (Test-Path -LiteralPath (Join-Path $proj 'node_modules\x.txt'))) {
      Write-Ok 'section 17 under --yes with no console lists the artefact and removes nothing'
    } elseif ($listed.Count -ne 1) {
      Write-Err "section 17 fixture not detected as a candidate ($($listed.Count) listed) - the check cannot prove anything"; $fails++
    } else {
      Write-Err 'DANGEROUS: section 17 removed an artefact under --yes with no selection'; $fails++
    }
    # 12c - personal picker call site (sections 18/19)
    $checks++
    $pfile = Join-Path $fx 'personal\old.iso'
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $pfile) | Out-Null
    Set-Content -LiteralPath $pfile -Value 'x'
    $row = [pscustomobject]@{ Path = $pfile; Bytes = [long]1; Idle = 400; Root = (Split-Path -Parent $pfile) }
    & $mute
    Invoke-PersonalPicker -Rows @($row) -Prompt 'fixture'
    & $unmute
    if (Test-Path -LiteralPath $pfile) { Write-Ok 'sections 18/19 under --yes with no console recycle nothing' } else { Write-Err 'DANGEROUS: the personal picker removed a file under --yes with no selection'; $fails++ }
    # 12d - every Read-MultiSelect call in modules/ carries -NoAutoYes (AST, not text)
    $checks++
    $offenders = @()
    foreach ($f in (Get-ChildItem -LiteralPath (Join-Path $Script:WS_ROOT 'modules') -Filter '*.ps1' -File)) {
      if ($f.Name -like 'self_test_extra*') { continue }
      $tokens = $null; $errors = $null
      $ast = [System.Management.Automation.Language.Parser]::ParseFile($f.FullName, [ref]$tokens, [ref]$errors)
      $calls = $ast.FindAll({ param($n) ($n -is [System.Management.Automation.Language.CommandAst]) -and ($n.GetCommandName() -eq 'Read-MultiSelect') }, $true)
      foreach ($c in $calls) {
        $has = $false
        foreach ($el in $c.CommandElements) { if (($el -is [System.Management.Automation.Language.CommandParameterAst]) -and ($el.ParameterName -eq 'NoAutoYes')) { $has = $true } }
        if (-not $has) { $offenders += "$($f.Name):$($c.Extent.StartLineNumber)" }
      }
    }
    if ($offenders.Count -eq 0) { Write-Ok 'every Read-MultiSelect call in modules/ carries -NoAutoYes' } else { Write-Err "Read-MultiSelect without -NoAutoYes: $($offenders -join ', ')"; $fails++ }
    $ws.Yes = $saved.Yes; $ws.Interactive = $saved.Interactive; $ws.ScanRoots = $saved.ScanRoots

    Write-Section '[13] Pure helpers: arguments, section lists, sizes, cache leaves, JSON summary'
    # 13a - argument parser
    $checks++
    $keep = @{}
    foreach ($k in 'Mode', 'BatchMode', 'OnlyList', 'ExportFmt', 'ExportId', 'Days', 'ScanRoots', 'ExcludePaths', 'RawArgs') { $keep[$k] = $ws[$k] }
    $ok = $false
    try {
      $ws.RawArgs = @('--only=1,3', '--export', 'html', '2', '--days=30', '--scan-roots', 'a;b', '--exclude-path', 'x', '--exclude-path', 'y')
      $ws.ExcludePaths = @()
      Read-Arguments
      $ok = ($ws.OnlyList -eq '1,3') -and ($ws.ExportFmt -eq 'html') -and ($ws.ExportId -eq '2') -and ($ws.Days -eq 30) -and (($ws.ScanRoots -join ',') -eq 'a,b') -and (($ws.ExcludePaths -join ',') -eq 'x,y')
    } catch { $ok = $false }
    $threw = $false
    try { $ws.RawArgs = @('--days', 'x'); Read-Arguments } catch { $threw = $true }
    foreach ($k in @($keep.Keys)) { $ws[$k] = $keep[$k] }
    if ($ok -and $threw) { Write-Ok 'Read-Arguments: --only=, --export F ID, --days=, --scan-roots, repeated --exclude-path; --days x throws' } else { Write-Err "Read-Arguments wrong (values ok=$ok, bad --days threw=$threw)"; $fails++ }
    # 13b - section id list
    $checks++
    & $mute
    $ids = @(Get-SectionIdList '1,3,5-7,9-8,99,x')
    & $unmute
    if (($ids -join ',') -eq '1,3,5,6,7,8,9') { Write-Ok "Get-SectionIdList '1,3,5-7,9-8,99,x' -> $($ids -join ',')" } else { Write-Err "Get-SectionIdList wrong: $($ids -join ',')"; $fails++ }
    # 13c - docker size text (decimal units)
    $checks++
    $sizes = @(@('2.891GB', 2891000000), @('12.5 MB', 12500000), @('20.48kB', 20480), @('0B', 0))
    $badSizes = @($sizes | Where-Object { [math]::Abs((ConvertFrom-SizeText $_[0]) - [long]$_[1]) -gt 1 })
    if ($badSizes.Count -eq 0) { Write-Ok 'ConvertFrom-SizeText: 2.891GB, 12.5 MB, 20.48kB, 0B' } else { Write-Err "ConvertFrom-SizeText wrong for: $(($badSizes | ForEach-Object { $_[0] }) -join ', ')"; $fails++ }
    # 13d - cache leaf guard
    $checks++
    if ((Test-KnownCacheLeaf "$fx\User Data\Default\Cache") -and -not (Test-KnownCacheLeaf "$fx\User Data\Default\Local Storage") -and -not (Test-KnownCacheLeaf "$fx\User Data\Default")) { Write-Ok 'Test-KnownCacheLeaf: Cache yes; Local Storage and a profile root no' } else { Write-Err 'Test-KnownCacheLeaf is wrong'; $fails++ }
    # 13e - JSON summary shape
    $checks++
    $json = (Get-JsonSummary) | ConvertTo-Json -Depth 5 -Compress
    $back = $null
    try { $back = $json | ConvertFrom-Json } catch { $back = $null }
    $need = @('tool', 'version', 'mode', 'dry_run', 'freed_bytes', 'sections', 'refusals')
    $missing = @($need | Where-Object { ($null -eq $back) -or ($null -eq $back.PSObject.Properties[$_]) })
    if ($back -and $missing.Count -eq 0 -and -not $json.Contains("`n")) { Write-Ok 'Get-JsonSummary: one line, parses back, required keys present' } else { Write-Err "Get-JsonSummary wrong (missing: $($missing -join ','))"; $fails++ }

    Write-Section '[14] Fixtures: superseded versions, Chromium layout, workspace storage, stale artefacts, report export'
    # 14a - superseded Squirrel versions (version order, not string order)
    $checks++
    $sq = Join-Path $fx 'squirrel'
    foreach ($v in 'app-1.0.0', 'app-1.9.0', 'app-1.10.0') { New-Item -ItemType Directory -Force -Path (Join-Path $sq $v) | Out-Null; Set-Content -LiteralPath (Join-Path $sq "$v\f.txt") -Value $v }
    & $mute
    $null = Remove-SupersededVersions -Root $sq -Prefix 'app-' -Label 'fixture'
    & $unmute
    if ((Test-Path -LiteralPath (Join-Path $sq 'app-1.10.0')) -and -not (Test-Path -LiteralPath (Join-Path $sq 'app-1.9.0')) -and -not (Test-Path -LiteralPath (Join-Path $sq 'app-1.0.0'))) { Write-Ok 'Remove-SupersededVersions keeps app-1.10.0 and removes 1.9.0 and 1.0.0' } else { Write-Err 'Remove-SupersededVersions kept the wrong folder'; $fails++ }
    # 14b - Chromium layout: cache folders only, never profile data
    $checks++
    $ud = Join-Path $fx 'User Data'
    foreach ($d in 'Default\Cache', 'Default\Local Storage', 'Profile 3\Code Cache') { New-Item -ItemType Directory -Force -Path (Join-Path $ud $d) | Out-Null }
    $leaves = @(Get-ChromiumCacheDirs $ud | ForEach-Object { [IO.Path]::GetFileName($_) } | Sort-Object)
    if (($leaves -join ',') -eq 'Cache,Code Cache') { Write-Ok 'Get-ChromiumCacheDirs returns the two cache folders and never Local Storage' } else { Write-Err "Get-ChromiumCacheDirs wrong: [$($leaves -join ',')]"; $fails++ }
    # 14c - stale workspace storage: dry-run keeps both, real run removes only the dead entry
    $checks++
    $wsRoot = Join-Path $fx 'workspaceStorage'
    $exists = Join-Path $fx 'exists'; New-Item -ItemType Directory -Force -Path $exists | Out-Null
    foreach ($pair in @(@('a', $exists), @('b', (Join-Path $fx 'missing')))) {
      $d = Join-Path $wsRoot $pair[0]; New-Item -ItemType Directory -Force -Path $d | Out-Null
      $uri = 'file:///' + ([string]$pair[1] -replace '\\', '/')
      Set-Content -LiteralPath (Join-Path $d 'workspace.json') -Value ('{"folder":"' + $uri + '"}')
    }
    & $mute
    $ws.DryRun = $true
    Remove-StaleWorkspaceStorage -Root $wsRoot -Label 'fixture'
    $dryKept = (Test-Path -LiteralPath (Join-Path $wsRoot 'a')) -and (Test-Path -LiteralPath (Join-Path $wsRoot 'b'))
    $ws.DryRun = $false
    Remove-StaleWorkspaceStorage -Root $wsRoot -Label 'fixture'
    & $unmute
    if ($dryKept -and (Test-Path -LiteralPath (Join-Path $wsRoot 'a')) -and -not (Test-Path -LiteralPath (Join-Path $wsRoot 'b'))) { Write-Ok 'Remove-StaleWorkspaceStorage: dry-run keeps both; real run removes only the entry whose folder is gone' } else { Write-Err 'Remove-StaleWorkspaceStorage behaved wrongly'; $fails++ }
    # 14d - stale artefacts: three orientations, so a missing gate in either direction shows up.
    #   A  marker + source idle 400 days -> listed   (the finder works)
    #   B  marker + fresh source         -> not listed (the idle gate works)
    #   C  NO marker + source idle 400 days -> not listed (the project-marker test works)
    # C must be OLD, or the marker test is never what excludes it and the check is half-oriented.
    $checks++
    $pr = Join-Path $fx 'projects'
    foreach ($n in 'A', 'B', 'C') { New-Item -ItemType Directory -Force -Path (Join-Path $pr "$n\node_modules") | Out-Null; Set-Content -LiteralPath (Join-Path $pr "$n\node_modules\x.txt") -Value 'x' }
    foreach ($n in 'A', 'B') { Set-Content -LiteralPath (Join-Path $pr "$n\package.json") -Value '{}' }
    Set-Content -LiteralPath (Join-Path $pr 'A\main.js') -Value 'x'
    Set-Content -LiteralPath (Join-Path $pr 'C\main.js') -Value 'x'
    foreach ($f in (Join-Path $pr 'A\package.json'), (Join-Path $pr 'A\main.js'), (Join-Path $pr 'C\main.js')) {
      foreach ($ts in 'LastWriteTime', 'LastAccessTime', 'CreationTime') { Set-ItemProperty -LiteralPath $f -Name $ts -Value $ancient }
    }
    $found = @(Find-StaleArtefacts -Roots @($pr) -Days 100)
    if ($found.Count -eq 1 -and $found[0].Path -like '*\A\node_modules' -and $found[0].Age -ge 100) { Write-Ok 'Find-StaleArtefacts lists the idle project with a marker, and neither the fresh one nor the idle one without a marker' } else { Write-Err "Find-StaleArtefacts wrong: $($found.Count) result(s) [$(($found | ForEach-Object { $_.Path }) -join '; ')]"; $fails++ }
    # 14e - report export smoke (schema-1 fixture; HTML must escape the title)
    $checks++
    $rep = Join-Path $fx 'report-fixture.json'
    $fixture = '{"schema_version":1,"credits":{"tool":"windowsweep","tool_version":"0.0.0","tool_homepage":"https://github.com/aoneahsan/windowsweep","tool_license":"MIT License","author":{"name":"Ahsan Mahmood","email":"e","website":"w","linkedin":"l"}},"meta":{"started_at":"2026-09-03T10:00:00+05:00","finished_at":"2026-09-03T10:01:00+05:00","duration_seconds":60,"host":"h","user":"u","os":"Windows","powershell":"5.1","mode":"all","dry_run":false,"elevated":false,"developer_mode":true,"idle_days":100,"temp_days":3,"log_file":"C:\\x.log","launcher":"node","via_npx":false,"tool_version":"0.0.0"},"disk":{"before":[{"drive":"C:","size_bytes":100,"free_bytes":10}],"after":[{"drive":"C:","size_bytes":100,"free_bytes":20}]},"steps":[{"n":1,"section":1,"title":"Package <caches>","status":"ran","freed_bytes":4096,"note":""}],"totals":{"total_reclaimed_bytes":4096,"total_reclaimed_human":"4.0 KB","total_estimated_bytes":0,"total_estimated_human":"0 B","steps_run":1,"steps_skipped":0}}'
    [IO.File]::WriteAllText($rep, $fixture, (New-Object System.Text.UTF8Encoding($false)))
    & $mute
    $md = Convert-ReportToMarkdown -Json $rep
    $html = Convert-ReportToHtml -Json $rep
    & $unmute
    $mdText = ''; $htmlText = ''
    if ($md -and (Test-Path -LiteralPath $md)) { $mdText = Get-Content -LiteralPath $md -Raw }
    if ($html -and (Test-Path -LiteralPath $html)) { $htmlText = Get-Content -LiteralPath $html -Raw }
    if ($mdText.Contains('4.0 KB') -and $mdText.Contains('windowsweep') -and $htmlText.Contains('4.0 KB') -and $htmlText.Contains('Package &lt;caches&gt;') -and -not $htmlText.Contains('Package <caches>')) { Write-Ok 'report export: Markdown and HTML written, totals present, HTML escapes the title' } else { Write-Err 'report export smoke failed'; $fails++ }

  } catch {
    & $unmute
    Write-Err "extra self-test crashed: $($_.Exception.Message)"; $fails++
  } finally {
    & $unmute
    foreach ($k in @($saved.Keys)) { $ws[$k] = $saved[$k] }
    try { if (Test-Path -LiteralPath $fx) { [IO.Directory]::Delete((Get-LongPath $fx), $true) } } catch { $null = $_ }
  }
  return [pscustomobject]@{ Checks = $checks; Fails = $fails }
}
