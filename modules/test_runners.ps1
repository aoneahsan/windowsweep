# test_runners.ps1 - section 3: downloaded test browsers (Cypress, Playwright, Puppeteer). Keep the newest of each.

$Script:WS_GROUP_BY_FAMILY = { param($name) ($name -replace '[-_]?v?\d[\d.]*$', '') }

function Get-Targets03 {
  $P = $Script:P
  return @(
    (New-Target 3 'Cypress binary versions' "$($P.L)\Cypress\Cache" -Mode units -Dev $true -KeepNewest $true -Note 'one folder per Cypress version; newest kept')
    (New-Target 3 'Playwright browsers' "$($P.L)\ms-playwright" -Mode units -Dev $true -KeepNewest $true -GroupBy $Script:WS_GROUP_BY_FAMILY -ExcludeNames @('.links', 'daemon') -Note 'newest build of each browser kept')
    (New-Target 3 'Playwright-Go browsers' "$($P.L)\ms-playwright-go" -Mode units -Dev $true -KeepNewest $true -GroupBy $Script:WS_GROUP_BY_FAMILY)
    (New-Target 3 'Puppeteer browsers' "$($P.U)\.cache\puppeteer\*" -Kind glob -Mode units -Dev $true -KeepNewest $true -Note 'per browser family: newest build kept')
  )
}

function Invoke-Section03 {
  Write-SectionIntro @(
    'Test runners download whole browsers per version. The newest build of each browser is always kept; older',
    'builds go once idle for the window. A missing build is re-downloaded by the next install or "playwright install".'
  ) -Dev $true
  $targets = Get-Targets03
  $null = Show-TargetSizes $targets
  if (-not (Confirm-Section 'Prune superseded test-runner browsers now?')) { Write-Info 'skipped'; return }
  $null = Invoke-TargetList $targets
}
