# browser_ai.ps1 - section 29: the Chrome on-device AI model (OptGuideOnDeviceModel, ~4 GB on the P52, 2026-11-02).
# Deleting the folder alone is pointless - Chrome downloads it again. The GenAILocalFoundationalModelSettings
# policy (1 = do not download) stops that, and Chrome then removes the model itself on its next start (seen on the
# P52 the same day). Any Chrome policy makes Chrome show "Managed by your organization". ASCII only.

$Script:WS_BROWSERAI_POLICY_KEY = 'HKLM:\SOFTWARE\Policies\Google\Chrome'
$Script:WS_BROWSERAI_POLICY_VALUE = 'GenAILocalFoundationalModelSettings'
$Script:WS_BROWSERAI_UNDO = 'reg delete HKLM\SOFTWARE\Policies\Google\Chrome /v GenAILocalFoundationalModelSettings /f'

function Get-ChromeUserDataRoots {
  <# .SYNOPSIS The User Data roots of every installed Chrome channel; all of them read the Google\Chrome policy. #>
  $L = $Script:P.L
  return @(@('Google\Chrome', 'Google\Chrome Beta', 'Google\Chrome Dev', 'Google\Chrome SxS') | ForEach-Object { Join-Path $L "$_\User Data" } | Where-Object { Test-DirPresent $_ })
}

function Get-BrowserAiPolicyState {
  <# .SYNOPSIS The policy's current value (1 = the model is not downloaded), or $null when it is not set. #>
  param([string] $KeyPath = $Script:WS_BROWSERAI_POLICY_KEY)
  try { $v = (Get-ItemProperty -LiteralPath $KeyPath -Name $Script:WS_BROWSERAI_POLICY_VALUE -ErrorAction Stop).($Script:WS_BROWSERAI_POLICY_VALUE); return [int]$v } catch { return $null }
}

function Set-BrowserAiPolicy {
  <# .SYNOPSIS Set the policy to 1. --dry-run prints and writes nothing. -KeyPath lets the self-test use a
     throwaway HKCU key instead of the machine policy. Returns 'set', 'would-set' or 'failed'. #>
  param([string] $KeyPath = $Script:WS_BROWSERAI_POLICY_KEY)
  if ($Script:WS.DryRun) { Write-DryRun "would set $KeyPath\$($Script:WS_BROWSERAI_POLICY_VALUE) = 1 (DWORD)"; return 'would-set' }
  try {
    if (-not (Test-Path -LiteralPath $KeyPath)) { New-Item -Path $KeyPath -Force -ErrorAction Stop | Out-Null }
    New-ItemProperty -LiteralPath $KeyPath -Name $Script:WS_BROWSERAI_POLICY_VALUE -Value 1 -PropertyType DWord -Force -ErrorAction Stop | Out-Null
    Write-LogLine "policy set: $KeyPath\$($Script:WS_BROWSERAI_POLICY_VALUE) = 1"
    return 'set'
  } catch {
    Write-Err "could not set the Chrome policy: $($_.Exception.Message)"
    return 'failed'
  }
}

function Get-Targets29 {
  $t = @((New-Target 29 'Chrome policy GenAILocalFoundationalModelSettings = 1' $Script:WS_BROWSERAI_POLICY_KEY -Kind cmd -Note 'stops the download; Chrome then removes the model itself'))
  foreach ($root in (Get-ChromeUserDataRoots)) {
    $t += (New-Target 29 'Chrome on-device AI model' (Join-Path $root 'OptGuideOnDeviceModel') -Mode clear -Guard @('chrome') -Note 'removed now only while Chrome is closed')
  }
  return $t
}

function Invoke-Section29 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Chrome downloads an on-device AI model of several GB. Deleting it alone is pointless - Chrome fetches it again.',
    'This sets the Chrome policy that stops the download; Chrome then removes the model on its next start.',
    'Chrome will show "Managed by your organization" while the policy is set.'
  )
  $models = @(Get-ChromeUserDataRoots | ForEach-Object { Join-Path $_ 'OptGuideOnDeviceModel' } | Where-Object { Test-DirPresent $_ })
  foreach ($m in $models) { Write-UiLine ("  {0,10}  {1}" -f (Format-Bytes (Get-DirectoryBytes $m)), $m) 'Gray' }
  if ($models.Count -eq 0) { Write-Info 'no on-device AI model folder found' }
  if ((Get-BrowserAiPolicyState) -eq 1) {
    Write-Info 'the policy is already set - Chrome will not download the model again'
  } else {
    if (-not (Confirm-Section 'Set the Chrome policy that removes the on-device AI model?' 'n')) { Write-Info 'skipped'; return }
    if ((Set-BrowserAiPolicy) -eq 'set') { Write-Ok 'Chrome policy set: the on-device AI model will not be downloaded again' }
  }
  foreach ($m in $models) {
    if (Test-ProcessRunning @('chrome')) { Write-Note "Chrome is running - it removes $m itself on its next start"; continue }
    $r = Remove-PathSafe -Path $m -Within (Split-Path -Parent $m) -Label 'Chrome on-device AI model'
    if ($r.Removed -and -not $ws.DryRun) { Write-Ok ('Chrome on-device AI model removed (' + (Format-Bytes $r.Bytes) + ')') }
  }
  Write-Note "undo (Chrome downloads the model again):  $Script:WS_BROWSERAI_UNDO"
}
