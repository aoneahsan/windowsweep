# personal.ps1 - sections 18 and 19: personal files in Downloads. Interactive only; the Recycle Bin is the destination.

$Script:WS_PARTIAL_PATTERNS = @('*.crdownload', '*.part', '*.partial', '*.fdmdownload', '*.opdownload', '*.!ut', '*.aria2', '*.download', '*.bc!', '*.tmp')

function Get-PersonalRoots {
  $roots = @()
  $d = Join-Path $Script:P.U 'Downloads'
  if (Test-DirPresent $d) { $roots += (Get-FullPath $d) }
  return $roots
}

function Get-Targets18 {
  $t = @()
  foreach ($r in (Get-PersonalRoots)) { $t += (New-Target 18 'Partial / orphan downloads' $r -Kind cmd -Note ($Script:WS_PARTIAL_PATTERNS -join ' ')) }
  return $t
}

function Get-Targets19 {
  $t = @()
  foreach ($r in (Get-PersonalRoots)) { $t += (New-Target 19 "Files >= $($Script:WS.LargeFileMb) MB idle $($Script:WS.Days)+ days" $r -Kind cmd -Note 'moved to the Recycle Bin after you pick them') }
  return $t
}

function Get-FilesUnder {
  <# .SYNOPSIS Files under Root up to MaxDepth, never following links, never entering protected folders. #>
  param([string] $Root, [int] $MaxDepth = 4)
  $out = New-Object System.Collections.Generic.List[object]
  $stack = New-Object System.Collections.Generic.Stack[object]
  $stack.Push(@($Root, 0))
  while ($stack.Count -gt 0) {
    $item = $stack.Pop()
    foreach ($e in (Get-ChildEntries ([string]$item[0]))) {
      if (Test-ReparsePoint $e) { continue }
      if ($e -is [IO.DirectoryInfo]) { if ([int]$item[1] -lt $MaxDepth) { $stack.Push(@((Remove-LongPrefix $e.FullName), [int]$item[1] + 1)) }; continue }
      $out.Add($e)
    }
  }
  return $out
}

function Get-PartialDownloads {
  $list = @()
  foreach ($root in (Get-PersonalRoots)) {
    foreach ($f in (Get-FilesUnder -Root $root -MaxDepth 4)) {
      foreach ($pat in $Script:WS_PARTIAL_PATTERNS) {
        if ($f.Name -like $pat) { $list += [pscustomobject]@{ Path = (Remove-LongPrefix $f.FullName); Bytes = [long]$f.Length; Idle = [int][math]::Floor(([datetime]::UtcNow - (Get-NewestTimestampUtc $f)).TotalDays); Root = $root }; break }
      }
    }
  }
  return @($list | Sort-Object Bytes -Descending)
}

function Get-LargeStaleFiles {
  $ws = $Script:WS
  $min = [long]$ws.LargeFileMb * 1MB
  $list = @()
  foreach ($root in (Get-PersonalRoots)) {
    foreach ($f in (Get-FilesUnder -Root $root -MaxDepth 4)) {
      if ([long]$f.Length -lt $min) { continue }
      $idle = [int][math]::Floor(([datetime]::UtcNow - (Get-NewestTimestampUtc $f)).TotalDays)
      if ($idle -lt $ws.Days) { continue }
      $list += [pscustomobject]@{ Path = (Remove-LongPrefix $f.FullName); Bytes = [long]$f.Length; Idle = $idle; Root = $root }
    }
  }
  return @($list | Sort-Object Bytes -Descending | Select-Object -First 100)
}

function Show-FileTable {
  param([object[]] $Rows)
  Write-UiLine ("  {0,3}  {1,10} {2,6}  {3}" -f '#', 'SIZE', 'IDLE', 'FILE') 'White'
  $i = 1
  foreach ($r in $Rows) { Write-UiLine ("  {0,3}  {1,10} {2,5}d  {3}" -f $i, (Format-Bytes $r.Bytes), $r.Idle, $r.Path) 'Gray'; $i++ }
}

function Invoke-PersonalPicker {
  param([object[]] $Rows, [string] $Prompt, [int] $Section = 0)
  $ws = $Script:WS
  $Rows = @($Rows)
  if ($Rows.Count -eq 0) { Write-Info 'none found'; return }
  Show-FileTable $Rows
  $total = [long]0
  $i = 1
  foreach ($r in $Rows) { $total += $r.Bytes; Add-JsonCandidate -Section $Section -Index $i -Path $r.Path -Bytes $r.Bytes -IdleDays $r.Idle; $i++ }
  Write-Info ("total: " + (Format-Bytes $total))
  $dest = 'the Recycle Bin'
  if ($ws.Permanent) { $dest = 'PERMANENT deletion (--permanent)' }
  Write-Note "selected files go to $dest"
  $picks = @(Read-MultiSelect -Total $Rows.Count -NoAutoYes -Candidates @($Rows | ForEach-Object { $_.Path }))
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  if (-not $ws.DryRun) {
    # Personal files never auto-confirm: --yes does not apply here. An explicit --select / --select-file
    # choice does, because it is a person naming these exact files in advance.
    if (-not (Confirm-Ui -Prompt "$Prompt ($($picks.Count) file(s))?" -Default 'n' -NoAutoYes -ScriptedOk)) { Write-Info 'skipped'; return }
  }
  foreach ($k in $picks) { $null = Send-ToRecycleBin -Path $Rows[$k - 1].Path -Within $Rows[$k - 1].Root }
}

function Invoke-Section18 {
  Write-SectionIntro @(
    'Half-finished downloads left behind by browsers and download managers (.crdownload, .part, .tmp, ...).',
    'You pick what goes; it lands in the Recycle Bin. Desktop and cloud-synced folders are never scanned.'
  )
  if (@(Get-PersonalRoots).Count -eq 0) { Write-Info 'no Downloads folder found'; return }
  Invoke-PersonalPicker -Rows @(Get-PartialDownloads) -Prompt 'Move the selected partial downloads to the Recycle Bin' -Section 18
}

function Invoke-Section19 {
  $ws = $Script:WS
  Write-SectionIntro @(
    "Files of $($ws.LargeFileMb) MB or more in Downloads that nothing has touched for $($ws.Days)+ days: old installers, ISOs,",
    'archives you already extracted. You pick what goes; it lands in the Recycle Bin.'
  )
  if (@(Get-PersonalRoots).Count -eq 0) { Write-Info 'no Downloads folder found'; return }
  Invoke-PersonalPicker -Rows @(Get-LargeStaleFiles) -Prompt 'Move the selected files to the Recycle Bin' -Section 19
}

function Show-PersonalScan {
  <# .SYNOPSIS Read-only listing used by --scan. #>
  Write-Box 'Personal files (read-only)' 'Sections 18 and 19 are interactive only - nothing here is deleted'
  Write-Section 'Partial / orphan downloads'
  $p = @(Get-PartialDownloads)
  if ($p.Count -eq 0) { Write-Info 'none found' } else { Show-FileTable @($p | Select-Object -First 30) }
  Write-Section "Files >= $($Script:WS.LargeFileMb) MB idle $($Script:WS.Days)+ days in Downloads"
  $l = @(Get-LargeStaleFiles)
  if ($l.Count -eq 0) { Write-Info 'none found' } else { Show-FileTable @($l | Select-Object -First 30) }
}
