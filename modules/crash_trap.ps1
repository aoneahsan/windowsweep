# crash_trap.ps1 - on an unexpected error, bundle the log + latest report + a manifest into a local zip.
# Nothing is ever sent anywhere; the user decides whether to attach it to a bug report.

function Initialize-CrashTrap {
  $Script:WS.CrashArmed = $true
}

function Get-FeedbackDir {
  $d = $Script:WS.FeedbackDir
  if (-not (Test-Path -LiteralPath $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
  return $d
}

function Get-LatestReportPath {
  $dir = $Script:WS.ReportsDir
  if (-not (Test-Path -LiteralPath $dir)) { return $null }
  $f = Get-ChildItem -LiteralPath $dir -Filter 'report-*.json' -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($f) { return $f.FullName }
  return $null
}

function New-SystemManifest {
  <# .SYNOPSIS Non-sensitive environment facts for a bug report. #>
  param([string] $Kind, [string] $Extra = '')
  $ws = $Script:WS
  $lines = @(
    "$Script:WS_NAME v$(Get-ToolVersion) - $Kind"
    "Generated:   $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')"
    ''
    '=== System info ==='
    "OS:          $($ws.OsCaption) ($([Environment]::OSVersion.Version))"
    "PowerShell:  $($PSVersionTable.PSVersion) ($($PSVersionTable.PSEdition))"
    "Elevated:    $($ws.IsAdmin)"
    "Launcher:    $($ws.Launcher)  npx: $($ws.Npx)"
    "Mode:        $($ws.Mode)  dry-run: $($ws.DryRun)  developer: $($ws.Developer)"
    "Node:        $(try { (& node --version 2>$null) } catch { 'not installed' })"
  )
  if ($Extra) { $lines += ''; $lines += $Extra }
  $lines += ''
  $lines += '=== Privacy note ==='
  $lines += 'This bundle was generated locally and was NOT sent anywhere. Review every file before sharing;'
  $lines += 'logs and reports contain paths from your machine and a snapshot of cache sizes.'
  $lines += "Report bugs at: $Script:WS_ISSUES  (or email $Script:WS_EMAIL)"
  return $lines
}

function New-BundleZip {
  <# .SYNOPSIS Zip the current log, the latest report and a manifest. Returns the zip path or $null. #>
  param([string] $Prefix, [string[]] $Manifest)
  $ws = $Script:WS
  $stamp = Get-Date -Format 'yyyy-MM-dd_HHmmss'
  $tmp = Join-Path $env:TEMP ("$Script:WS_NAME-bundle-" + [guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  try {
    [IO.File]::WriteAllLines((Join-Path $tmp 'MANIFEST.txt'), $Manifest)
    if ($ws.LogFile -and (Test-Path -LiteralPath $ws.LogFile)) { Copy-Item -LiteralPath $ws.LogFile -Destination $tmp -ErrorAction SilentlyContinue }
    $rep = Get-LatestReportPath
    if ($rep) { Copy-Item -LiteralPath $rep -Destination $tmp -ErrorAction SilentlyContinue }
    $out = Join-Path (Get-FeedbackDir) ("$Prefix-$stamp.zip")
    Compress-Archive -Path (Join-Path $tmp '*') -DestinationPath $out -Force -ErrorAction Stop
    return $out
  } catch {
    Write-Warn "could not create bundle: $($_.Exception.Message)"
    return $null
  } finally {
    try { Remove-Item -LiteralPath $tmp -Recurse -Force -ErrorAction SilentlyContinue } catch { $null = $_ }
  }
}

function Invoke-CrashBundle {
  <# .SYNOPSIS Called by the entry script when Invoke-Main throws. #>
  param([System.Management.Automation.ErrorRecord] $ErrorRecord)
  $ws = $Script:WS
  $msg = $ErrorRecord.Exception.Message
  $where = $ErrorRecord.InvocationInfo.PositionMessage
  Write-Log "CRASH: $msg"
  Write-Log $ErrorRecord.ScriptStackTrace
  $extra = @("=== Error ===", $msg, $where, '', '=== Stack ===', $ErrorRecord.ScriptStackTrace) -join "`r`n"
  $zip = New-BundleZip -Prefix 'crash' -Manifest (New-SystemManifest -Kind 'CRASH REPORT' -Extra $extra)
  Write-UiLine '' 'Gray'
  Write-Err "$Script:WS_NAME exited unexpectedly: $msg"
  Write-Note $where
  if ($zip) {
    Write-Info "crash bundle: $zip"
    Write-Note 'Review it (it contains paths from your machine), then attach it to an issue:'
    Write-Note "$Script:WS_ISSUES   or run: windowsweep --report-issue"
  }
  Write-Note 'Nothing was sent. windowsweep makes no network calls.'
}
