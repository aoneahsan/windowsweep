# ui.ps1 - console output, glyphs, colours and prompts. ASCII only; glyphs come from [char] codes.
# Every human-readable line goes through Write-UiLine so it is also logged and, in --json mode,
# routed to stderr (stdout then carries only the JSON summary).

function Initialize-Ui {
  <# .SYNOPSIS Decide colour + glyph set from flags, environment and redirection state. #>
  $ws = $Script:WS
  $outRedirected = [Console]::IsOutputRedirected
  $inRedirected = [Console]::IsInputRedirected
  $noColorEnv = (-not [string]::IsNullOrEmpty($env:NO_COLOR)) -or ($env:WINDOWSWEEP_NO_COLOR -eq '1')
  $ws.Color = (-not $ws.NoColor) -and (-not $noColorEnv) -and (-not $outRedirected) -and (-not $ws.JsonMode)
  $ws.Interactive = (-not $inRedirected) -and (-not $ws.JsonMode)
  $useUnicode = (-not $ws.Ascii) -and (-not $outRedirected) -and ($env:WINDOWSWEEP_ASCII -ne '1')
  if ($useUnicode) {
    $ws.Glyph = @{
      ok = [string][char]0x2713; err = [string][char]0x2717; info = [string][char]0x2139; warn = '!'
      bullet = [string][char]0x00B7; arrow = [string][char]0x2192; hline = [string][char]0x2500
      dline = [string][char]0x2550; tl = [string][char]0x2554; tr = [string][char]0x2557
      bl = [string][char]0x255A; br = [string][char]0x255D; vbar = [string][char]0x2551
    }
    try {
      $ws.PrevOutputEncoding = [Console]::OutputEncoding
      [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
    } catch { $ws.PrevOutputEncoding = $null }
  } else {
    $ws.Glyph = @{ ok = '+'; err = 'x'; info = 'i'; warn = '!'; bullet = '*'; arrow = '->'; hline = '-'; dline = '='; tl = '+'; tr = '+'; bl = '+'; br = '+'; vbar = '|' }
  }
}

function Restore-Ui {
  <# .SYNOPSIS Put the console encoding back the way we found it. #>
  $ws = $Script:WS
  if ($ws.PrevOutputEncoding) { try { [Console]::OutputEncoding = $ws.PrevOutputEncoding } catch { $null = $_ } }
}

function Write-UiLine {
  <# .SYNOPSIS Print one line (coloured when allowed) and append it to the log. #>
  param([string] $Text = '', [string] $Color = 'Gray', [switch] $NoLog, [switch] $NoNewline)
  $ws = $Script:WS
  if (-not $NoLog) { Write-LogLine $Text }
  if ($ws.Mute) { return }
  if ($ws.JsonMode) { [Console]::Error.WriteLine($Text); return }
  if ($ws.Color) {
    if ($NoNewline) { Write-Host $Text -ForegroundColor $Color -NoNewline } else { Write-Host $Text -ForegroundColor $Color }
  } else {
    if ($NoNewline) { Write-Host $Text -NoNewline } else { Write-Host $Text }
  }
}

function Write-Info {
  param([string] $Text)
  if ($Script:WS.Quiet) { Write-LogLine "INFO $Text"; return }
  Write-UiLine ("$($Script:WS.Glyph.info) $Text") 'Cyan'
}

function Write-Ok {
  param([string] $Text)
  Write-UiLine ("$($Script:WS.Glyph.ok) $Text") 'Green'
}

function Write-Warn {
  param([string] $Text)
  Write-UiLine ("$($Script:WS.Glyph.warn) $Text") 'Yellow'
}

function Write-Err {
  param([string] $Text)
  Write-UiLine ("$($Script:WS.Glyph.err) $Text") 'Red'
}

function Write-Note {
  param([string] $Text)
  if ($Script:WS.Quiet) { Write-LogLine "NOTE $Text"; return }
  Write-UiLine ("    $Text") 'DarkGray'
}

function Write-Plain {
  param([string] $Text)
  Write-UiLine $Text 'Gray'
}

function Write-DryRun {
  param([string] $Text)
  Write-UiLine ("    [dry-run] $Text") 'Magenta'
}

function Write-Section {
  <# .SYNOPSIS A dashed section heading. #>
  param([string] $Title)
  $h = $Script:WS.Glyph.hline
  Write-UiLine '' 'Gray'
  Write-UiLine ("$h$h $Title $h$h") 'Blue'
}

function Write-Separator {
  Write-UiLine ([string]::new([char]($Script:WS.Glyph.hline), 78)) 'DarkGray'
}

function Write-Box {
  <# .SYNOPSIS Double-lined title box with an optional dim subtitle. #>
  param([string] $Title, [string] $Subtitle = '')
  $line = [string]::new([char]($Script:WS.Glyph.dline), 78)
  Write-UiLine '' 'Gray'
  Write-UiLine $line 'Blue'
  Write-UiLine ("   $Title") 'Blue'
  if ($Subtitle) { Write-UiLine ("   $Subtitle") 'DarkGray' }
  Write-UiLine $line 'Blue'
}

function Write-Step {
  <# .SYNOPSIS Walkthrough step header: [ STEP n/N ]  Title #>
  param([int] $N, [int] $Total, [string] $Title)
  Write-UiLine '' 'Gray'
  Write-Separator
  Write-UiLine ("  [ STEP $N/$Total ]  $Title") 'Cyan'
  Write-Separator
}

function Write-Kv {
  param([string] $Key, [string] $Value)
  Write-UiLine ("  {0,-24} {1}" -f $Key, $Value) 'Gray'
}

function Write-Banner {
  $g = $Script:WS.Glyph
  $inner = "   $Script:WS_NAME v$(Get-ToolVersion) - safe, developer-aware Windows cleanup   "
  $bar = [string]::new([char]($g.dline), $inner.Length)
  Write-UiLine ("$($g.tl)$bar$($g.tr)") 'Blue'
  Write-UiLine ("$($g.vbar)$inner$($g.vbar)") 'Blue'
  Write-UiLine ("$($g.bl)$bar$($g.br)") 'Blue'
}

function Format-Bytes {
  <# .SYNOPSIS Human-readable size (B, KB, MB, GB, TB). #>
  param([double] $Bytes)
  if ($Bytes -lt 0) { $Bytes = 0 }
  $units = @('B', 'KB', 'MB', 'GB', 'TB')
  $i = 0
  while ($Bytes -ge 1024 -and $i -lt ($units.Length - 1)) { $Bytes = $Bytes / 1024; $i++ }
  if ($i -eq 0) { return ("{0:N0} {1}" -f $Bytes, $units[$i]) }
  return ("{0:N1} {1}" -f $Bytes, $units[$i])
}

function Format-Duration {
  param([double] $Seconds)
  $m = [math]::Floor($Seconds / 60); $s = [math]::Floor($Seconds % 60)
  return ("{0}m {1:00}s" -f $m, $s)
}

function Read-Line {
  <# .SYNOPSIS Read one line from the console, or $null when not interactive / at EOF. #>
  param([string] $Prompt = '')
  if (-not $Script:WS.Interactive) { return $null }
  if ($Prompt) { Write-UiLine $Prompt 'White' -NoNewline -NoLog }
  try { $line = [Console]::In.ReadLine() } catch { return $null }
  if ($null -eq $line) { return $null }
  Write-LogLine ("> $line")
  return $line
}

function Confirm-Ui {
  <# .SYNOPSIS y/N prompt. --yes auto-confirms (unless -NoAutoYes); non-interactive runs answer no. #>
  param([string] $Prompt = 'Proceed?', [string] $Default = 'n', [switch] $NoAutoYes)
  $ws = $Script:WS
  if ($ws.Yes -and -not $NoAutoYes) { Write-UiLine ("    [auto-yes] $Prompt") 'DarkGray'; return $true }
  if (-not $ws.Interactive) {
    Write-Note "non-interactive session: '$Prompt' answered no (pass --yes to confirm in batch)"
    return $false
  }
  $hint = '[y/N]'
  if ($Default -eq 'y') { $hint = '[Y/n]' }
  $reply = Read-Line ("? $Prompt $hint ")
  if ($null -eq $reply) { return $false }
  $reply = $reply.Trim()
  if ($reply -eq '') { $reply = $Default }
  return ($reply -match '^(y|yes)$')
}

function Confirm-Typed {
  <# .SYNOPSIS Critical confirmation: the user must type the literal word. Never auto-answered. #>
  param([string] $Prompt, [string] $Word = 'yes')
  if (-not $Script:WS.Interactive) { Write-Note "non-interactive session: '$Prompt' requires a typed '$Word'; skipped"; return $false }
  Write-Warn $Prompt
  $reply = Read-Line ("  Type '$Word' to proceed: ")
  if ($null -eq $reply) { return $false }
  return ($reply.Trim() -eq $Word)
}

function Read-MultiSelect {
  <# .SYNOPSIS Parse "1,3,5-7" / all / none into a sorted unique list of 1-based indexes.
     --yes answers "all" only for callers that do not pass -NoAutoYes. The personal and project pickers pass
     it, so under --yes they still ask when a console is present and select nothing when it is not. #>
  param([int] $Total, [switch] $NoAutoYes)
  if ($Total -le 0) { return @() }
  if ($Script:WS.Yes -and -not $NoAutoYes) { return @(1..$Total) }
  if (-not $Script:WS.Interactive) { Write-Note 'non-interactive session: nothing selected (a person has to pick these)'; return @() }
  Write-UiLine "  Selection: 1,3,5-10 | all | none (Enter = none)" 'DarkGray' -NoLog
  $reply = Read-Line ("  Select items (1..$Total): ")
  return (ConvertTo-IndexList -Text $reply -Total $Total)
}

function ConvertTo-IndexList {
  <# .SYNOPSIS Pure parser behind Read-MultiSelect (kept separate so the self-test can exercise it). #>
  param([string] $Text, [int] $Total)
  if ([string]::IsNullOrWhiteSpace($Text)) { return @() }
  $t = $Text.Trim().ToLowerInvariant()
  if ($t -in @('n', 'none')) { return @() }
  if ($t -in @('a', 'all')) { return @(1..$Total) }
  $set = New-Object System.Collections.Generic.SortedSet[int]
  foreach ($part in ($t -split ',')) {
    $part = $part.Trim()
    if ($part -match '^(\d+)-(\d+)$') {
      $a = [int]$Matches[1]; $b = [int]$Matches[2]
      if ($a -gt $b) { $tmp = $a; $a = $b; $b = $tmp }
      for ($i = $a; $i -le $b; $i++) { if ($i -ge 1 -and $i -le $Total) { $null = $set.Add($i) } }
    } elseif ($part -match '^\d+$') {
      $i = [int]$part
      if ($i -ge 1 -and $i -le $Total) { $null = $set.Add($i) }
    }
  }
  return @($set)
}

function Read-Choice {
  <# .SYNOPSIS One-key choice; returns the lower-cased key or the default. #>
  param([string] $Prompt, [string] $Default = '')
  $reply = Read-Line $Prompt
  if ($null -eq $reply -or $reply.Trim() -eq '') { return $Default }
  return $reply.Trim().ToLowerInvariant()
}

function Wait-Enter {
  if (-not $Script:WS.Interactive) { return }
  $null = Read-Line "  - press Enter to continue - "
}
