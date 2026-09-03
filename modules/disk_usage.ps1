# disk_usage.ps1 - section 21: read-only disk usage report (largest entries, disk images, drives).

function Get-Targets21 { return @() }

function Show-LargestEntries {
  <# .SYNOPSIS Size every top-level entry of a folder and print the largest N. Returns the rows. #>
  param([string] $Root, [int] $Top = 20, [string] $Title = '')
  if (-not (Test-DirPresent $Root)) { return @() }
  if (-not $Title) { $Title = $Root }
  Write-Section "Largest entries in $Title"
  Write-Note 'measuring...'
  $rows = @()
  foreach ($e in (Get-ChildEntries $Root)) {
    $full = Remove-LongPrefix $e.FullName
    $bytes = [long]0
    if (Test-ReparsePoint $e) { continue }
    if ($e -is [IO.DirectoryInfo]) { $bytes = Get-DirectoryBytes $full } else { $bytes = [long]$e.Length }
    $rows += [pscustomobject]@{ Path = $full; Bytes = $bytes }
  }
  $rows = @($rows | Sort-Object Bytes -Descending | Select-Object -First $Top)
  foreach ($r in $rows) {
    $why = Get-ProtectionReason $r.Path
    $tag = ''
    if ($why) { $tag = '  [protected]' }
    Write-UiLine ("  {0,10}  {1}{2}" -f (Format-Bytes $r.Bytes), $r.Path, $tag) 'Gray'
  }
  return $rows
}

function Invoke-Section21 {
  $ws = $Script:WS
  $P = $Script:P
  Write-SectionIntro @('Where the space went. Read-only; entries marked [protected] are ones this tool will never delete.')
  $lines = @("windowsweep disk usage report - $(Get-Date -Format 'yyyy-MM-dd HH:mm')", '')
  Show-DriveTable
  foreach ($d in (Get-DriveSnapshot)) { $lines += ("{0}  size {1}  free {2}" -f $d.drive, (Format-Bytes $d.size_bytes), (Format-Bytes $d.free_bytes)) }
  $h = Get-HiberfilInfo
  if ($h.Bytes -gt 0) { Write-Kv 'hiberfil.sys:' (Format-Bytes $h.Bytes); $lines += "hiberfil.sys $(Format-Bytes $h.Bytes)" }
  foreach ($img in (Get-DiskImageFiles)) { Write-Kv 'disk image:' ("{0}  {1}" -f (Format-Bytes $img.Length), $img.FullName); $lines += "vhdx $(Format-Bytes $img.Length) $($img.FullName)" }
  foreach ($pair in @(@($P.U, 'your profile'), @($P.L, 'AppData\Local'), @($P.A, 'AppData\Roaming'), @("$($P.SD)\", "drive $($P.SD)"))) {
    $rows = Show-LargestEntries -Root $pair[0] -Top 20 -Title $pair[1]
    $lines += ''; $lines += "== $($pair[1]) =="
    foreach ($r in $rows) { $lines += ("{0,10}  {1}" -f (Format-Bytes $r.Bytes), $r.Path) }
  }
  if (-not $ws.NoReport) {
    $out = Join-Path $ws.ReportsDir ('disk-usage-' + $ws.Stamp + '.txt')
    try { [IO.File]::WriteAllLines($out, $lines); Write-Info "report written: $out" } catch { Write-Warn "could not write $out" }
  }
}
