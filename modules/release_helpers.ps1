# release_helpers.ps1 - version, --list, --self-test, feedback, debug bundle, scheduled task, profile alias, data removal.

function Show-Version {
  Write-Host ''
  Write-Host ("  $Script:WS_NAME v$(Get-ToolVersion)")
  Write-Host ("  $Script:WS_TAGLINE")
  Write-Host ''
  Write-Host ("  Author:    $Script:WS_AUTHOR")
  Write-Host ("  Email:     $Script:WS_EMAIL")
  Write-Host ("  Web:       $Script:WS_WEB")
  Write-Host ("  LinkedIn:  $Script:WS_LINKEDIN")
  Write-Host ("  Source:    $Script:WS_REPO")
  Write-Host ("  License:   $Script:WS_LICENSE")
  Write-Host ''
  Write-Host ("  PowerShell:   $($PSVersionTable.PSVersion) ($($PSVersionTable.PSEdition))")
  Write-Host ("  Project root: $Script:WS_ROOT")
  Write-Host ''
}

function Show-SectionList {
  Write-Host ''
  Write-Host ("  {0,3}  {1,-84} {2,-10} {3,-5} {4}" -f '#', 'SECTION', 'TIER', 'ADMIN', 'BATCH')
  foreach ($s in $Script:WS_SECTIONS) {
    $adm = '-'
    if ($s.Admin) { $adm = 'yes' }
    Write-Host ("  {0,3}  {1,-84} {2,-10} {3,-5} {4}" -f $s.Id, $s.Title, $s.Tier, $adm, $s.Batch)
  }
  Write-Host ''
  Write-Host ("  safe batch (--all): " + ($Script:WS_SAFE_BATCH -join ',') + "  (+" + ($Script:WS_SAFE_BATCH_ADMIN -join ',') + " when elevated)")
  foreach ($k in ($Script:WS_PROFILES.Keys | Sort-Object)) { Write-Host ("  profile {0,-11} {1}" -f $k, ($Script:WS_PROFILES[$k] -join ',')) }
  Write-Host '  batch policy: safe = runs in --all | optin = --only/--profile with --yes | deep = also needs --i-understand-deep | interactive = never batch'
  Write-Host ''
}

# ---------------------------------------------------------------------------------------------
# Self-test
# ---------------------------------------------------------------------------------------------

function Invoke-SelfTest {
  <# .SYNOPSIS Verify syntax, ASCII-only source, safety guards, dry-run, junctions and long paths. Exit 1 on any failure. #>
  $ws = $Script:WS
  $fails = 0
  $checks = 0
  Write-Box 'Self-test' 'Verify syntax, safety guards, dry-run guarantee, junction handling'

  Write-Section '[1] PowerShell'
  $checks++
  if ($PSVersionTable.PSVersion.Major -ge 5) { Write-Ok "PowerShell $($PSVersionTable.PSVersion) ($($PSVersionTable.PSEdition))" } else { Write-Err "PowerShell $($PSVersionTable.PSVersion) - 5.1+ required"; $fails++ }

  Write-Section '[2] Optional tools'
  foreach ($c in @('robocopy.exe', 'cleanmgr.exe', 'Dism.exe', 'powercfg.exe', 'wevtutil.exe', 'diskpart.exe', 'wsl.exe', 'docker', 'npm', 'yarn', 'pnpm', 'pip', 'uv', 'composer', 'dotnet', 'cargo', 'go')) {
    if (Test-CommandPresent $c) { Write-Ok $c } else { Write-Note "$c  (optional - the steps that use it are skipped)" }
  }

  Write-Section '[3] Script syntax'
  $files = @(Get-Item -LiteralPath $ws.ScriptPath) + @(Get-ChildItem -LiteralPath (Join-Path $Script:WS_ROOT 'lib'), (Join-Path $Script:WS_ROOT 'modules') -Filter '*.ps1' -File)
  foreach ($f in $files) {
    $checks++
    $tokens = $null; $errors = $null
    $null = [System.Management.Automation.Language.Parser]::ParseFile($f.FullName, [ref]$tokens, [ref]$errors)
    if ($errors.Count -eq 0) { Write-Ok $f.Name } else { Write-Err "$($f.Name): $($errors[0].Message)"; $fails++ }
  }

  Write-Section '[4] ASCII-only source'
  $srcFiles = @($files) + @(Get-ChildItem -LiteralPath (Join-Path $Script:WS_ROOT 'bin') -Filter '*.js' -File -ErrorAction SilentlyContinue)
  foreach ($f in $srcFiles) {
    $checks++
    $bad = 0
    foreach ($b in [IO.File]::ReadAllBytes($f.FullName)) { if ($b -gt 127) { $bad++; break } }
    if ($bad -eq 0) { Write-Ok $f.Name } else { Write-Err "$($f.Name): $bad non-ASCII byte(s) - PowerShell 5.1 would misread this file"; $fails++ }
  }

  Write-Section '[5] Safety guards'
  $U = $env:USERPROFILE; $L = $env:LOCALAPPDATA
  $mustRefuse = @("$env:SystemDrive\", $env:SystemRoot, "$env:SystemRoot\System32", $env:ProgramFiles, $U, "$U\Documents", "$U\Pictures\holiday", "$U\.ssh\id_ed25519", "$U\.claude\settings.json", "$env:APPDATA\npm", "$env:SystemRoot\Prefetch", "$env:SystemRoot\Installer", "$L\Temp\..\..\Roaming", '\\server\share\x', "$L\Google\Chrome\User Data\Default\Local Storage\leveldb", "$L\Google\Chrome\User Data\Default", "$L\Google\Chrome\User Data\Profile 12", "$L\Packages\Some.App_abc\LocalState\data", "$env:APPDATA\Code\User\globalStorage\state.vscdb", "$U\.cache\claude\x", "$env:SystemDrive\hiberfil.sys", $ws.Home)
  foreach ($p in $mustRefuse) {
    $checks++
    $why = Get-ProtectionReason $p
    if ($why) { Write-Ok "refuses  $p  ($why)" } else { Write-Err "DANGEROUS: not protected: $p"; $fails++ }
  }
  $mustAllow = @("$L\npm-cache\_cacache", "$L\Temp\some-tmp-file.tmp", "$L\Google\Chrome\User Data\Default\Cache\Cache_Data", "$L\Yarn\Cache\v6", "$U\.gradle\caches\modules-2", "$L\Android\Sdk\.temp\x", "$env:APPDATA\Code\CachedExtensionVSIXs", "$U\.vscode\extensions\some.ext-1.0.0")
  foreach ($p in $mustAllow) {
    $checks++
    $why = Get-ProtectionReason $p
    if (-not $why) { Write-Ok "allows   $p" } else { Write-Err "would block a legitimate target: $p ($why)"; $fails++ }
  }
  $checks++
  if ((Test-PathWithin -Path "$L\Temp\a\b" -Within "$L\Temp") -and -not (Test-PathWithin -Path "$L\Tempx\a" -Within "$L\Temp") -and (Test-PathWithin -Path "$L\Temp" -Within "$L\Temp")) { Write-Ok 'Test-PathWithin: inside / sibling-prefix / equal' } else { Write-Err 'Test-PathWithin is wrong'; $fails++ }

  Write-Section '[6] Declared targets are never protected'
  $targets = @(Get-AllTargets | Where-Object { $_.Kind -in 'dir', 'file' })
  $checks++
  $leaked = 0
  foreach ($t in $targets) {
    $why = Get-ProtectionReason $t.Path
    if ($why) { Write-Err "target [$($t.Section)] $($t.Label) is inside a protected path: $($t.Path) ($why)"; $leaked++ }
  }
  if ($leaked -eq 0) { Write-Ok "$($targets.Count) declared targets, none inside a protected path" } else { $fails += $leaked }

  Write-Section '[7] Fixture: junctions, dry-run, stale prune, keep-newest, long paths'
  $fx = Join-Path $ws.Home ('selftest-' + [guid]::NewGuid().ToString('N'))
  $savedDry = $ws.DryRun; $savedYes = $ws.Yes; $savedQuiet = $ws.Quiet
  # Helper output (including the refusals we deliberately provoke) is muted; only the verdict lines print.
  $mute = { $Script:WS.Mute = $true }
  $unmute = { $Script:WS.Mute = $false }
  try {
    New-Item -ItemType Directory -Force -Path $fx | Out-Null
    $ws.AllowOwnData = $true
    & $mute
    $target = Join-Path $fx 'target'; New-Item -ItemType Directory -Force -Path $target | Out-Null
    $sentinel = Join-Path $target 'sentinel.txt'; Set-Content -LiteralPath $sentinel -Value 'keep me'
    $cache = Join-Path $fx 'cache'; New-Item -ItemType Directory -Force -Path $cache | Out-Null
    New-Item -ItemType Junction -Path (Join-Path $cache 'link') -Target $target | Out-Null
    Set-Content -LiteralPath (Join-Path $cache 'junk.txt') -Value 'junk'
    # 7a: removing a junction removes the link only
    $checks++
    $ws.DryRun = $false
    $r = Remove-PathSafe -Path (Join-Path $cache 'link') -Within $cache
    & $unmute
    if ($r.Removed -and (Test-Path -LiteralPath $sentinel) -and -not (Test-Path -LiteralPath (Join-Path $cache 'link'))) { Write-Ok 'junction removed as a link; target sentinel survives' } else { Write-Err 'junction handling is wrong'; $fails++ }
    & $mute
    # 7b: a junction nested inside a tree being removed is not followed
    $checks++
    $tree = Join-Path $fx 'tree'; New-Item -ItemType Directory -Force -Path (Join-Path $tree 'sub') | Out-Null
    New-Item -ItemType Junction -Path (Join-Path $tree 'sub\jl') -Target $target | Out-Null
    Set-Content -LiteralPath (Join-Path $tree 'sub\file.txt') -Value 'x'
    $r = Remove-PathSafe -Path $tree -Within $fx
    & $unmute
    if ($r.Removed -and (Test-Path -LiteralPath $sentinel) -and -not (Test-Path -LiteralPath $tree)) { Write-Ok 'nested junction not followed; tree removed; sentinel survives' } else { Write-Err 'nested junction handling is wrong'; $fails++ }
    & $mute
    # 7c: dry-run changes nothing
    $checks++
    $old = Join-Path $fx 'old'; New-Item -ItemType Directory -Force -Path (Join-Path $old 'deep') | Out-Null
    $oldFile = Join-Path $old 'deep\old.bin'; [IO.File]::WriteAllBytes($oldFile, (New-Object byte[] 4096))
    $freshFile = Join-Path $old 'fresh.bin'; [IO.File]::WriteAllBytes($freshFile, (New-Object byte[] 2048))
    $ancient = (Get-Date).AddDays(-400)
    foreach ($ts in 'LastWriteTime', 'LastAccessTime', 'CreationTime') { Set-ItemProperty -LiteralPath $oldFile -Name $ts -Value $ancient }
    # Files carry the evidence (name, size, write time); directory timestamps are excluded because NTFS
    # updates a folder's own LastWriteTime lazily, which made an earlier version of this check flap.
    $snapshot = { param($root) ((Get-ChildItem -LiteralPath $root -Recurse -Force -File | ForEach-Object { "$($_.FullName)|$($_.Length)|$($_.LastWriteTimeUtc.Ticks)" }) + (Get-ChildItem -LiteralPath $root -Recurse -Force -Directory | ForEach-Object { "D|$($_.FullName)" })) -join "`n" }
    $snapBefore = & $snapshot $old
    $ws.DryRun = $true
    $estBefore = $ws.TotalEstimated
    $r = Remove-StaleFiles -Root $old -Within $fx -Days 100 -Label 'fixture'
    $snapAfter = & $snapshot $old
    $ws.DryRun = $false
    & $unmute
    if ($snapBefore -eq $snapAfter -and $r.Freed -eq 4096 -and ($ws.TotalEstimated - $estBefore) -eq 4096) { Write-Ok 'dry-run changed nothing and estimated exactly the stale 4096 bytes' } else { Write-Err "dry-run guarantee broken (freed=$($r.Freed), tree changed=$($snapBefore -ne $snapAfter))"; $fails++ }
    & $mute
    # 7d: real stale prune removes only the old file and sweeps the empty dir
    $checks++
    $r = Remove-StaleFiles -Root $old -Within $fx -Days 100 -Label 'fixture'
    & $unmute
    if ((-not (Test-Path -LiteralPath $oldFile)) -and (Test-Path -LiteralPath $freshFile) -and (-not (Test-Path -LiteralPath (Join-Path $old 'deep'))) -and $r.Freed -eq 4096) { Write-Ok 'stale prune removed the idle file, kept the fresh one, swept the empty directory' } else { Write-Err 'stale prune behaved wrongly'; $fails++ }
    & $mute
    # 7e: keep-newest keeps the freshest unit even when every unit is idle
    $checks++
    $units = Join-Path $fx 'units'
    foreach ($v in '1.0.0', '2.0.0') { New-Item -ItemType Directory -Force -Path (Join-Path $units $v) | Out-Null; Set-Content -LiteralPath (Join-Path $units "$v\bin.txt") -Value $v }
    $t1 = (Get-Date).AddDays(-300); $t2 = (Get-Date).AddDays(-200)
    foreach ($ts in 'LastWriteTime', 'LastAccessTime', 'CreationTime') { Set-ItemProperty -LiteralPath (Join-Path $units '1.0.0\bin.txt') -Name $ts -Value $t1; Set-ItemProperty -LiteralPath (Join-Path $units '2.0.0\bin.txt') -Name $ts -Value $t2 }
    $r = Remove-StaleUnits -Root $units -Within $fx -Days 100 -KeepNewest -DirectoriesOnly -Label 'fixture units'
    & $unmute
    if ((Test-Path -LiteralPath (Join-Path $units '2.0.0')) -and -not (Test-Path -LiteralPath (Join-Path $units '1.0.0')) -and $r.Pruned -eq 1 -and $r.Kept -eq 1) { Write-Ok 'keep-newest kept 2.0.0 (200d idle) and pruned 1.0.0 (300d idle)' } else { Write-Err 'keep-newest behaved wrongly'; $fails++ }
    & $mute
    # 7f: long path
    $checks++
    $deep = Join-Path $fx 'long'; $p = $deep
    for ($i = 0; $i -lt 12; $i++) { $p = "$p\segment_$('x' * 20)_$i" }
    [IO.Directory]::CreateDirectory((Get-LongPath $p)) | Out-Null
    [IO.File]::WriteAllText((Get-LongPath (Join-Path $p 'deep.txt')), 'x')
    $r = Remove-PathSafe -Path $deep -Within $fx
    & $unmute
    if ($r.Removed -and -not (Test-DirPresent $deep) -and $p.Length -gt 260) { Write-Ok "long path ($($p.Length) chars) removed" } else { Write-Err 'long-path removal failed'; $fails++ }
    & $mute
    # 7g: refusals inside the fixture (the refusal messages themselves are muted; the verdicts print)
    $checks++
    $r = Remove-PathSafe -Path (Join-Path $fx 'target') -Within (Join-Path $fx 'cache')
    & $unmute
    if (-not $r.Removed -and $r.Reason -like 'outside declared root*' -and (Test-Path -LiteralPath $sentinel)) { Write-Ok 'a path outside its declared root is refused' } else { Write-Err 'Within guard failed'; $fails++ }
    & $mute
    $checks++
    $r = Remove-PathSafe -Path $fx -Within $fx
    & $unmute
    if (-not $r.Removed -and (Test-Path -LiteralPath $fx)) { Write-Ok 'a root never deletes itself' } else { Write-Err 'root self-delete guard failed'; $fails++ }
    $checks++
    & $mute
    $r = Remove-PathSafe -Path (Join-Path $env:USERPROFILE 'Documents') -Within $env:USERPROFILE
    & $unmute
    if (-not $r.Removed -and $r.Reason -like 'inside protected*') { Write-Ok 'the chokepoint refuses Documents even when a caller declares the profile as its root' } else { Write-Err 'protected-path refusal failed at the chokepoint'; $fails++ }
    # 7h: editor extension leftovers - the manifest is an ARRAY (the ConvertFrom-Json shape that once collapsed 16 entries into 1)
    $checks++
    $extRoot = Join-Path $fx 'extensions'
    foreach ($d in 'pub.alpha-1.0.0', 'pub.alpha-0.9.0', 'pub.beta-2.0.0-win32-x64', 'pub.gamma-1.0.0', 'pub.delta-3.0.0') { New-Item -ItemType Directory -Force -Path (Join-Path $extRoot $d) | Out-Null; Set-Content -LiteralPath (Join-Path $extRoot "$d\package.json") -Value '{}' }
    Set-Content -LiteralPath (Join-Path $extRoot 'extensions.json') -Value '[{"identifier":{"id":"pub.alpha"},"version":"1.0.0","relativeLocation":"pub.alpha-1.0.0"},{"identifier":{"id":"pub.beta"},"version":"2.0.0","relativeLocation":"pub.beta-2.0.0-win32-x64"},{"identifier":{"id":"pub.delta"},"version":"3.0.0","relativeLocation":"pub.delta-3.0.0"}]'
    Set-Content -LiteralPath (Join-Path $extRoot '.obsolete') -Value '{"pub.gamma-1.0.0":true}'
    $folders = @()
    foreach ($e in @(Get-ChildEntries $extRoot)) { if (($e -is [IO.DirectoryInfo]) -and $e.Name -match '^(.+?)-(\d+\.\d+\.\d+)([^\\]*)$') { $folders += [pscustomobject]@{ Name = $e.Name; Id = $Matches[1]; Path = (Remove-LongPrefix $e.FullName); Version = [version]$Matches[2] } } }
    $plan = Get-SupersededExtensionPlan -Root $extRoot -Folders $folders
    $names = @($plan.Victims | ForEach-Object { $_.Name } | Sort-Object)
    if (($names -join ',') -eq 'pub.alpha-0.9.0,pub.gamma-1.0.0') { Write-Ok 'extension leftovers: superseded alpha-0.9.0 + obsolete gamma go; the 3 installed folders stay' } else { Write-Err "extension leftover plan wrong: [$($names -join ',')]"; $fails++ }
  } catch {
    & $unmute
    Write-Err "fixture test crashed: $($_.Exception.Message)"; $fails++
  } finally {
    & $unmute
    $ws.DryRun = $savedDry; $ws.Yes = $savedYes; $ws.Quiet = $savedQuiet
    try { if (Test-Path -LiteralPath $fx) { [IO.Directory]::Delete((Get-LongPath $fx), $true) } } catch { $null = $_ }
    $ws.AllowOwnData = $false
  }

  Write-Section '[8] Pure helpers'
  $checks++
  $sel = ConvertTo-IndexList -Text '1,3,5-7,9-8,99' -Total 10
  if (($sel -join ',') -eq '1,3,5,6,7,8,9') { Write-Ok "multi-select parser: '1,3,5-7,9-8,99' -> $($sel -join ',')" } else { Write-Err "multi-select parser wrong: $($sel -join ',')"; $fails++ }
  $checks++
  if ((Format-Bytes 0) -eq '0 B' -and (Format-Bytes 1536) -eq '1.5 KB' -and (Format-Bytes 1073741824) -eq '1.0 GB') { Write-Ok 'Format-Bytes' } else { Write-Err "Format-Bytes wrong: $(Format-Bytes 1536)"; $fails++ }

  Write-Section '[9] No network code'
  $checks++
  $needles = @(('Invoke-Web' + 'Request'), ('Invoke-Rest' + 'Method'), ('Net.Web' + 'Client'), ('Http' + 'Client'), ('Sockets.' + 'TcpClient'), ('curl' + '.exe'), ('wget' + ' '))
  $hits = 0
  foreach ($f in $srcFiles) {
    $text = [IO.File]::ReadAllText($f.FullName)
    foreach ($n in $needles) { if ($text.IndexOf($n, [StringComparison]::OrdinalIgnoreCase) -ge 0) { Write-Err "network call in $($f.Name): $n"; $hits++ } }
  }
  if ($hits -eq 0) { Write-Ok 'no HTTP or socket calls in the source' } else { $fails += $hits }

  Write-Section '[10] Version parity'
  $checks++
  $verFile = Join-Path $Script:WS_ROOT 'VERSION'
  $pkgFile = Join-Path $Script:WS_ROOT 'package.json'
  $vFile = ''; $vPkg = ''
  if (Test-Path -LiteralPath $verFile) { $vFile = (Get-Content -LiteralPath $verFile -Raw).Trim() }
  if (Test-Path -LiteralPath $pkgFile) { try { $vPkg = (Get-Content -LiteralPath $pkgFile -Raw | ConvertFrom-Json).version } catch { $vPkg = '?' } }
  if ($vFile -eq $Script:WS_VERSION_FALLBACK -and $vPkg -eq $Script:WS_VERSION_FALLBACK) { Write-Ok "VERSION, package.json and lib/constants.ps1 all say $vPkg" } else { Write-Err "version mismatch: VERSION='$vFile' package.json='$vPkg' constants='$Script:WS_VERSION_FALLBACK'"; $fails++ }

  Write-Section '[11] Output paths'
  foreach ($d in @($ws.LogsDir, $ws.ReportsDir)) {
    $checks++
    try { $probe = Join-Path $d ('.write-test-' + [guid]::NewGuid().ToString('N')); Set-Content -LiteralPath $probe -Value 'x'; Remove-Item -LiteralPath $probe -Force; Write-Ok "$d writable" } catch { Write-Err "$d not writable"; $fails++ }
  }

  Write-Separator
  if ($fails -eq 0) { Write-Ok "all $checks checks passed - $Script:WS_NAME is ready"; return $Script:WS_EXIT_OK }
  Write-Err "$fails of $checks checks FAILED"
  return $Script:WS_EXIT_FAIL
}

# ---------------------------------------------------------------------------------------------
# Feedback, bug reports, debug bundle
# ---------------------------------------------------------------------------------------------

function Show-Feedback {
  Write-Box 'Send feedback / report a bug' 'All offline - nothing leaves your machine unless you send it'
  Write-Plain "  Issues:    $Script:WS_ISSUES"
  Write-Plain "  Email:     $Script:WS_EMAIL"
  Write-Plain "  Web:       $Script:WS_WEB"
  Write-UiLine '' 'Gray'
  Write-Plain '  Please include: Windows version, PowerShell version ($PSVersionTable.PSVersion),'
  Write-Plain "  $Script:WS_NAME version (currently v$(Get-ToolVersion)), the exact command, what you expected,"
  Write-Plain '  what happened, and the log from --debug-bundle (review it first: it holds paths from your machine).'
  Write-UiLine '' 'Gray'
  Write-Plain '  windowsweep --report-issue   opens a pre-filled GitHub issue in your browser'
  Write-Plain '  windowsweep --debug-bundle   zips the latest log + report for attaching'
  Write-UiLine '' 'Gray'
  Write-Note 'Privacy: windowsweep makes no network calls. Logs and reports are written only under ~\.windowsweep.'
}

function Invoke-ReportIssue {
  <# .SYNOPSIS Build a GitHub new-issue URL with environment facts and open it in the default browser after confirming. #>
  $ws = $Script:WS
  $title = "[bug] $Script:WS_NAME v$(Get-ToolVersion): "
  $body = @(
    '**What happened**', '', '', '**What you expected**', '', '', '**Command you ran**', '', '```', 'windowsweep ', '```', '',
    '**Environment (auto-filled, review before submitting)**',
    "- OS: $($ws.OsCaption) ($([Environment]::OSVersion.Version))",
    "- PowerShell: $($PSVersionTable.PSVersion) ($($PSVersionTable.PSEdition))",
    "- $Script:WS_NAME`: v$(Get-ToolVersion) via $($ws.Launcher)",
    "- Elevated: $($ws.IsAdmin)", '',
    '**Log excerpt** (from `windowsweep --debug-bundle`, paths redacted as you see fit)', '', '```', '', '```'
  ) -join "`n"
  $url = "$Script:WS_ISSUES/new?title=$([Uri]::EscapeDataString($title))&labels=bug&body=$([Uri]::EscapeDataString($body))"
  Write-Box 'Report an issue' 'A pre-filled GitHub issue opens in your browser; nothing is submitted until you click Submit'
  Write-Note 'Environment facts included: OS build, PowerShell version, tool version, launcher, elevation. No paths, no logs.'
  if (Confirm-Ui -Prompt 'Open the pre-filled issue in your browser now?' -Default 'y') {
    try { Start-Process $url | Out-Null; Write-Ok 'opened - review, edit, then submit' } catch { Write-Warn "could not open a browser. URL:"; Write-Plain $url }
  } else {
    Write-Plain '  URL (copy it into a browser):'
    Write-Plain "  $url"
  }
}

function New-DebugBundle {
  Write-Box 'Debug bundle' 'Latest log + latest report + system manifest, zipped locally'
  $zip = New-BundleZip -Prefix 'debug-bundle' -Manifest (New-SystemManifest -Kind 'debug bundle')
  if ($zip) {
    Write-Ok "bundle created: $zip"
    Write-Warn 'Review the bundle before sharing - it contains paths from your machine and a cache-size snapshot.'
    Write-Note "Attach it to an issue at $Script:WS_ISSUES"
  }
}

# ---------------------------------------------------------------------------------------------
# Scheduled task, profile alias, data removal, history pruning
# ---------------------------------------------------------------------------------------------

$Script:WS_TASK_NAME = 'windowsweep weekly safe cleanup'

function Get-LaunchCommand {
  <# .SYNOPSIS The command the scheduled task / alias should run: the launcher that started us, or the script. #>
  $ws = $Script:WS
  if ($ws.Launcher -eq 'node' -and -not $ws.Npx) {
    $cmd = Get-Command windowsweep -ErrorAction SilentlyContinue
    if ($cmd) { return [pscustomobject]@{ Exe = $cmd.Source; Args = @() } }
  }
  return [pscustomobject]@{ Exe = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"; Args = @('-NoProfile', '-NoLogo', '-ExecutionPolicy', 'Bypass', '-File', "`"$($ws.ScriptPath)`"") }
}

function Install-WeeklyTask {
  Write-Box 'Install weekly Scheduled Task' "$Script:WS_TASK_NAME - Sundays 03:00, safe batch, no prompts"
  if (Get-ScheduledTask -TaskName $Script:WS_TASK_NAME -ErrorAction SilentlyContinue) { Write-Info 'task already exists'; return }
  $lc = Get-LaunchCommand
  $argLine = (@($lc.Args) + @('--all', '--yes', '--quiet', '--no-color')) -join ' '
  Write-Info "action: $($lc.Exe) $argLine"
  if ($Script:WS.DryRun) { Write-DryRun 'would register the task'; return }
  if (-not (Confirm-Ui -Prompt 'Register this task for your user account?' -Default 'y')) { Write-Info 'skipped'; return }
  try {
    $action = New-ScheduledTaskAction -Execute $lc.Exe -Argument $argLine
    $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 3am
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfIdle:$false -ExecutionTimeLimit (New-TimeSpan -Hours 3)
    Register-ScheduledTask -TaskName $Script:WS_TASK_NAME -Action $action -Trigger $trigger -Settings $settings -Description "$Script:WS_NAME safe batch (--all --yes). $Script:WS_REPO" -ErrorAction Stop | Out-Null
    Write-Ok "registered '$Script:WS_TASK_NAME' (runs as your user, Sundays 03:00; catches up if the PC was off)"
  } catch { Write-Err "could not register the task: $($_.Exception.Message)" }
}

function Uninstall-WeeklyTask {
  Write-Box 'Remove weekly Scheduled Task'
  if (-not (Get-ScheduledTask -TaskName $Script:WS_TASK_NAME -ErrorAction SilentlyContinue)) { Write-Info 'no task found'; return }
  if ($Script:WS.DryRun) { Write-DryRun 'would unregister the task'; return }
  if (Confirm-Ui -Prompt "Remove '$Script:WS_TASK_NAME'?" -Default 'y') {
    try { Unregister-ScheduledTask -TaskName $Script:WS_TASK_NAME -Confirm:$false -ErrorAction Stop; Write-Ok 'task removed' } catch { Write-Err "could not remove the task: $($_.Exception.Message)" }
  }
}

$Script:WS_ALIAS_MARK = '# windowsweep alias'

function Install-ProfileAlias {
  Write-Box 'Install profile alias' "Adds a 'cleanup' function to your PowerShell profile"
  $profilePath = $PROFILE.CurrentUserAllHosts
  $lc = Get-LaunchCommand
  $line = "function cleanup { & `"$($lc.Exe)`" $($lc.Args -join ' ') @args }"
  if ((Test-Path -LiteralPath $profilePath) -and (Select-String -LiteralPath $profilePath -Pattern ([regex]::Escape($Script:WS_ALIAS_MARK)) -Quiet)) { Write-Info "alias already present in $profilePath"; return }
  Write-Info "will append to $profilePath"
  Write-Note $line
  if ($Script:WS.DryRun) { Write-DryRun 'would append the alias'; return }
  if (-not (Confirm-Ui -Prompt 'Add it?' -Default 'y')) { Write-Info 'skipped'; return }
  try {
    $dir = Split-Path -Parent $profilePath
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    Add-Content -LiteralPath $profilePath -Value @('', $Script:WS_ALIAS_MARK, $line)
    Write-Ok "added. Open a new PowerShell window (or run '. `$PROFILE.CurrentUserAllHosts'), then type: cleanup"
  } catch { Write-Err "could not write the profile: $($_.Exception.Message)" }
}

function Uninstall-ProfileAlias {
  Write-Box 'Remove profile alias'
  $profilePath = $PROFILE.CurrentUserAllHosts
  if (-not (Test-Path -LiteralPath $profilePath)) { Write-Info 'no profile file'; return }
  $lines = Get-Content -LiteralPath $profilePath
  if (-not ($lines | Where-Object { $_ -eq $Script:WS_ALIAS_MARK })) { Write-Info 'alias not present'; return }
  if ($Script:WS.DryRun) { Write-DryRun 'would remove the alias block'; return }
  if (-not (Confirm-Ui -Prompt "Remove the windowsweep alias from $profilePath ?" -Default 'y')) { Write-Info 'skipped'; return }
  $out = @(); $skipNext = $false
  foreach ($l in $lines) {
    if ($l -eq $Script:WS_ALIAS_MARK) { $skipNext = $true; continue }
    if ($skipNext) { $skipNext = $false; if ($l -like 'function cleanup*') { continue } }
    $out += $l
  }
  Set-Content -LiteralPath $profilePath -Value $out
  Write-Ok 'alias removed'
}

function Remove-ToolData {
  $ws = $Script:WS
  Write-Box 'Remove windowsweep data' $ws.Home
  if (-not (Test-Path -LiteralPath $ws.Home)) { Write-Info 'nothing to remove'; return }
  $bytes = Get-DirectoryBytes $ws.Home
  Write-Info ("$($ws.Home) holds " + (Format-Bytes $bytes) + ' of logs, reports, bundles and config')
  if ($ws.DryRun) { Write-DryRun "would remove $($ws.Home)"; return }
  if (-not (Confirm-Ui -Prompt 'Delete it all (logs, reports, your developer answer)?' -Default 'n')) { Write-Info 'skipped'; return }
  $ws.LogFile = $null
  try { [IO.Directory]::Delete((Get-LongPath $ws.Home), $true); Write-Ok 'removed' } catch { Write-Err "could not remove: $($_.Exception.Message)" }
}

function Remove-OldHistory {
  <# .SYNOPSIS --prune-history N: delete logs, reports and bundles older than N days. Honours --dry-run. #>
  param([int] $Days = 90)
  $ws = $Script:WS
  Write-Box "Prune run history older than $Days days" $ws.Home
  $ws.AllowOwnData = $true
  $n = 0; $bytes = [long]0
  foreach ($dir in @($ws.LogsDir, $ws.ReportsDir, $ws.FeedbackDir)) {
    if (-not (Test-Path -LiteralPath $dir)) { continue }
    foreach ($f in (Get-ChildItem -LiteralPath $dir -File -Force -ErrorAction SilentlyContinue)) {
      if ($f.FullName -eq $ws.LogFile) { continue }
      if ((Get-IdleDays $f.FullName) -lt $Days) { continue }
      $r = Remove-PathSafe -Path $f.FullName -Within $dir
      if ($r.Removed) { $n++; $bytes += $r.Bytes }
    }
  }
  $ws.AllowOwnData = $false
  if ($ws.DryRun) { Write-Info ("would remove $n file(s), " + (Format-Bytes $bytes)) } else { Write-Ok ("removed $n file(s), " + (Format-Bytes $bytes)) }
}
