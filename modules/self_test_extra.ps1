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
