# external.ps1 - running an external process, and asking about / raising privilege.
#
# Split out of lib/safety.ps1 at the 1.3.0 cascade (RW-121), which brought that file back under the
# 500-line ceiling IRON rule 6 sets. The functions below are VERBATIM - none changed, and no behaviour
# moved with them. The deletion chokepoint stays in safety.ps1: Remove-PathSafe, Send-ToRecycleBin and
# the protection guard are that file's whole reason to exist, and they are not what was over the line.
# Running a process and elevating are a different job, which is why this is the split by concern.
#
# Dot-sourced from windowsweep.ps1 immediately after safety, so every caller still resolves at run time.

function Invoke-External {
  <# .SYNOPSIS Run an external command, streaming its output to the log. -Destructive commands are skipped in --dry-run. #>
  param([Parameter(Mandatory = $true)][string] $FilePath, [string[]] $ArgumentList = @(), [switch] $Destructive, [switch] $Quiet, [string] $Label = '')
  $display = "$FilePath $($ArgumentList -join ' ')"
  $tag = ''
  if ($Label) { $tag = " [$Label]" }
  if ($Destructive -and $Script:WS.DryRun) {
    Write-DryRun "would run: $display"
    return [pscustomobject]@{ Ran = $false; ExitCode = 0; Output = @() }
  }
  Write-LogLine "run${tag}: $display"
  $lines = @()
  try {
    $raw = & $FilePath @ArgumentList 2>&1
    foreach ($l in $raw) {
      $s = [string]$l
      $lines += $s
      if (-not $Quiet) { Write-Note $s } else { Write-LogLine $s }
    }
    $code = $LASTEXITCODE
    if ($null -eq $code) { $code = 0 }
  } catch {
    $lines += $_.Exception.Message
    $code = 1
  }
  Write-LogLine "exit $code$tag : $display"
  return [pscustomobject]@{ Ran = $true; ExitCode = $code; Output = $lines }
}

function Test-CommandPresent {
  param([string] $Name)
  return ($null -ne (Get-Command $Name -ErrorAction SilentlyContinue))
}

function Test-ProcessRunning {
  <# .SYNOPSIS True when any process with one of the given names is running. #>
  param([string[]] $Names)
  foreach ($n in $Names) {
    if (@(Get-Process -Name $n -ErrorAction SilentlyContinue).Count -gt 0) { return $true }
  }
  return $false
}

function Test-IsAdmin {
  try {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    return (New-Object Security.Principal.WindowsPrincipal($id)).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  } catch { return $false }
}

function Test-CanElevate {
  <# .SYNOPSIS True when the account belongs to Administrators (even in a filtered, non-elevated token). #>
  try {
    $out = & "$env:SystemRoot\System32\whoami.exe" /groups /fo csv 2>$null
    foreach ($l in $out) { if ($l -match 'S-1-5-32-544') { return $true } }
  } catch { $null = $_ }
  return $false
}

function Invoke-Elevated {
  <# .SYNOPSIS Relaunch this run elevated (UAC prompt) and wait for it. Returns the child's exit code. #>
  $ws = $Script:WS
  $childArgs = @('-NoProfile', '-NoLogo', '-ExecutionPolicy', 'Bypass', '-File', ('"' + $ws.ScriptPath + '"'))
  foreach ($a in $ws.RawArgs) {
    if ($a -eq '--elevate') { continue }
    if ($a -match '[\s"]') { $childArgs += ('"' + ($a -replace '"', '\"') + '"') } else { $childArgs += $a }
  }
  $childArgs += '--elevated-child'
  Write-Info 'Requesting elevation (a UAC prompt appears). The elevated run opens in a new window and writes its own log.'
  try {
    $proc = Start-Process -FilePath 'powershell.exe' -ArgumentList $childArgs -Verb RunAs -Wait -PassThru
    return $proc.ExitCode
  } catch {
    Write-Err "elevation refused or failed: $($_.Exception.Message)"
    return $Script:WS_EXIT_REFUSED
  }
}
