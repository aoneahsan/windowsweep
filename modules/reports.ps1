# reports.ps1 - list, view, export (Markdown / HTML) and summarise past JSON reports. No external tools needed.

function Get-ReportFiles {
  $dir = $Script:WS.ReportsDir
  if (-not (Test-Path -LiteralPath $dir)) { return @() }
  return @(Get-ChildItem -LiteralPath $dir -Filter 'report-*.json' -File -ErrorAction SilentlyContinue | Sort-Object Name -Descending)
}

function Read-Report {
  param([string] $Path)
  try { return (Get-Content -LiteralPath $Path -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop) } catch { return $null }
}

function Show-ReportList {
  $files = @(Get-ReportFiles)
  if ($files.Count -eq 0) { Write-Info 'no reports yet - run a cleanup first'; return @() }
  Write-UiLine ("  {0,3}  {1,-34} {2,8}  {3,-17} {4,-12} {5}" -f '#', 'REPORT', 'SIZE', 'STARTED', 'RECLAIMED', 'MODE') 'White'
  $i = 1
  foreach ($f in $files) {
    $r = Read-Report $f.FullName
    $started = '?'; $rec = '?'; $mode = '?'
    if ($r) {
      $started = ([string]$r.meta.started_at).Substring(0, [math]::Min(16, ([string]$r.meta.started_at).Length)).Replace('T', ' ')
      $rec = $r.totals.total_reclaimed_human
      if ($r.meta.dry_run) { $rec = "~$($r.totals.total_estimated_human) (dry)" }
      $mode = $r.meta.mode
    }
    Write-UiLine ("  {0,3}  {1,-34} {2,8}  {3,-17} {4,-12} {5}" -f $i, $f.Name, (Format-Bytes $f.Length), $started, $rec, $mode) 'Gray'
    $i++
  }
  return $files
}

function ConvertTo-HtmlText { param([string] $Text) return [System.Net.WebUtility]::HtmlEncode([string]$Text) }

function Convert-ReportToMarkdown {
  param([string] $Json, [string] $Out = '')
  $r = Read-Report $Json
  if (-not $r) { Write-Err "cannot read $Json"; return $null }
  if (-not $Out) { $Out = [IO.Path]::ChangeExtension($Json, '.md') }
  $dry = 'no'
  if ($r.meta.dry_run) { $dry = 'yes' }
  $l = @()
  $l += "# $Script:WS_NAME session report"; $l += ''
  $l += "_Generated from ``$([IO.Path]::GetFileName($Json))``_"; $l += ''
  $l += '## Overview'; $l += ''; $l += '| Field | Value |'; $l += '|---|---|'
  $l += "| Started | $($r.meta.started_at) |"; $l += "| Finished | $($r.meta.finished_at) |"; $l += "| Duration | $($r.meta.duration_seconds) s |"
  $l += "| Host | $($r.meta.host) |"; $l += "| User | $($r.meta.user) |"; $l += "| Windows | $($r.meta.os) |"; $l += "| Mode | $($r.meta.mode) |"
  $l += "| Dry-run | $dry |"; $l += "| Elevated | $($r.meta.elevated) |"; $l += "| Developer mode | $($r.meta.developer_mode) |"; $l += "| Idle window | $($r.meta.idle_days) days |"
  $l += ''; $l += '## Result'; $l += ''
  if ($r.meta.dry_run) { $l += "**Would free (estimate): $($r.totals.total_estimated_human)**  " } else { $l += "**Reclaimed: $($r.totals.total_reclaimed_human)** ($($r.totals.total_reclaimed_bytes) bytes)  " }
  $l += "Sections run: $($r.totals.steps_run) - skipped/refused: $($r.totals.steps_skipped)"; $l += ''
  $l += '## Drives'; $l += ''; $l += '| Drive | Before free | After free | Size |'; $l += '|---|---|---|---|'
  foreach ($b in $r.disk.before) {
    $a = $r.disk.after | Where-Object { $_.drive -eq $b.drive } | Select-Object -First 1
    $afterFree = '?'
    if ($a) { $afterFree = Format-Bytes $a.free_bytes }
    $l += "| $($b.drive) | $(Format-Bytes $b.free_bytes) | $afterFree | $(Format-Bytes $b.size_bytes) |"
  }
  $l += ''; $l += '## Steps'; $l += ''; $l += '| # | Section | Title | Status | Freed |'; $l += '|---:|---:|---|---|---:|'
  foreach ($s in $r.steps) { $l += "| $($s.n) | $($s.section) | $($s.title) | $($s.status) | $(Format-Bytes $s.freed_bytes) |" }
  $l += ''; $l += "_${Script:WS_NAME} v$($r.meta.tool_version) by $($r.credits.author.name) - $($r.credits.tool_homepage)_"
  [IO.File]::WriteAllLines($Out, $l)
  Write-Ok "wrote $Out"
  return $Out
}

function Convert-ReportToHtml {
  param([string] $Json, [string] $Out = '')
  $r = Read-Report $Json
  if (-not $r) { Write-Err "cannot read $Json"; return $null }
  if (-not $Out) { $Out = [IO.Path]::ChangeExtension($Json, '.html') }
  $headline = "Reclaimed"; $big = $r.totals.total_reclaimed_human
  if ($r.meta.dry_run) { $headline = 'Would free (dry-run estimate)'; $big = $r.totals.total_estimated_human }
  $rows = ''
  foreach ($s in $r.steps) {
    $cls = ([string]$s.status) -replace '[^a-z-]', ''
    $rows += "<tr class=`"row-$cls`"><td>$($s.n)</td><td>$($s.section)</td><td>$(ConvertTo-HtmlText $s.title)</td><td><span class=`"badge $cls`">$(ConvertTo-HtmlText $s.status)</span></td><td class=`"num`">$(ConvertTo-HtmlText (Format-Bytes $s.freed_bytes))</td></tr>`n"
  }
  $drives = ''
  foreach ($b in $r.disk.before) {
    $a = $r.disk.after | Where-Object { $_.drive -eq $b.drive } | Select-Object -First 1
    $afterFree = '?'
    if ($a) { $afterFree = Format-Bytes $a.free_bytes }
    $drives += "<tr><td>$(ConvertTo-HtmlText $b.drive)</td><td class=`"num`">$(Format-Bytes $b.size_bytes)</td><td class=`"num`">$(Format-Bytes $b.free_bytes)</td><td class=`"num`">$afterFree</td></tr>`n"
  }
  $html = @"
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>$Script:WS_NAME report - $(ConvertTo-HtmlText $r.meta.started_at)</title>
<style>
  :root{--fg:#1c1c1f;--bg:#fafafa;--muted:#7a7a85;--ok:#0a7d54;--warn:#b8860b;--line:#e6e6ea;--card:#fff;--accent:#0b6bcb}
  @media (prefers-color-scheme:dark){:root{--fg:#eaeaea;--bg:#16161a;--muted:#9d9da8;--line:#2a2a30;--card:#1f1f25;--accent:#5aa9ff}}
  *{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.55 'Segoe UI',system-ui,sans-serif}
  .wrap{max-width:960px;margin:2rem auto;padding:0 1.25rem}h1{font-size:1.6rem;margin:0 0 .3rem}
  h2{font-size:1.05rem;margin:2.2rem 0 .7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
  .subtitle{color:var(--muted);margin:0 0 1.5rem}.totals{display:flex;align-items:baseline;gap:1rem;padding:1.5rem 1.75rem;border:1px solid var(--line);border-radius:12px;background:var(--card);margin:1rem 0}
  .totals .big{font-size:2.5rem;font-weight:800;color:var(--ok);line-height:1}.totals .label{color:var(--muted);text-transform:uppercase;font-size:.75rem;letter-spacing:.08em}
  dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.6rem 1.5rem;margin:0;padding:1rem 1.25rem;border:1px solid var(--line);border-radius:10px;background:var(--card)}
  dt{color:var(--muted);font-size:.75rem;text-transform:uppercase;letter-spacing:.05em}dd{margin:.1rem 0 0;font-weight:600;word-break:break-all}
  table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}
  th,td{text-align:left;padding:.55rem .85rem;border-bottom:1px solid var(--line)}tr:last-child td{border-bottom:none}
  th{font-size:.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;background:var(--bg)}td.num{text-align:right;font-variant-numeric:tabular-nums}
  .badge{display:inline-block;padding:.12em .5em;border-radius:999px;font-size:.75em;font-weight:600;text-transform:uppercase}
  .badge.ran,.badge.dry-run{background:rgba(10,125,84,.12);color:var(--ok)}.badge.skipped,.badge.refused{background:rgba(184,134,11,.12);color:var(--warn)}.badge.failed{background:rgba(192,57,43,.12);color:#c0392b}
  footer{margin:3rem 0 1rem;color:var(--muted);font-size:.85rem;text-align:center}a{color:var(--accent)}
</style>
</head>
<body><div class="wrap">
  <h1>$Script:WS_NAME session report</h1>
  <p class="subtitle">$(ConvertTo-HtmlText $r.meta.started_at) to $(ConvertTo-HtmlText $r.meta.finished_at) - $($r.meta.duration_seconds)s - $(ConvertTo-HtmlText $r.meta.host)</p>
  <div class="totals"><div><div class="label">$headline</div><div class="big">$(ConvertTo-HtmlText $big)</div></div>
  <div style="margin-left:auto;text-align:right;color:var(--muted)"><div><strong>$($r.totals.steps_run)</strong> sections run</div><div><strong>$($r.totals.steps_skipped)</strong> skipped</div></div></div>
  <h2>Run</h2>
  <dl><div><dt>Mode</dt><dd>$(ConvertTo-HtmlText $r.meta.mode)</dd></div><div><dt>Dry-run</dt><dd>$($r.meta.dry_run)</dd></div><div><dt>Elevated</dt><dd>$($r.meta.elevated)</dd></div>
  <div><dt>Developer mode</dt><dd>$($r.meta.developer_mode)</dd></div><div><dt>Idle window</dt><dd>$($r.meta.idle_days) days</dd></div><div><dt>Windows</dt><dd>$(ConvertTo-HtmlText $r.meta.os)</dd></div>
  <div><dt>Log file</dt><dd><code>$(ConvertTo-HtmlText $r.meta.log_file)</code></dd></div></dl>
  <h2>Sections</h2>
  <table><thead><tr><th>#</th><th>Section</th><th>Title</th><th>Status</th><th class="num">Freed</th></tr></thead><tbody>
$rows  </tbody></table>
  <h2>Drives</h2>
  <table><thead><tr><th>Drive</th><th class="num">Size</th><th class="num">Free before</th><th class="num">Free after</th></tr></thead><tbody>
$drives  </tbody></table>
  <footer>Generated from <code>$(ConvertTo-HtmlText ([IO.Path]::GetFileName($Json)))</code> by <a href="$Script:WS_REPO">$Script:WS_NAME</a> v$(ConvertTo-HtmlText $r.meta.tool_version) - $(ConvertTo-HtmlText $r.credits.author.name)</footer>
</div></body></html>
"@
  [IO.File]::WriteAllText($Out, $html, (New-Object System.Text.UTF8Encoding($false)))
  Write-Ok "wrote $Out"
  return $Out
}

function Export-Reports {
  <# .SYNOPSIS --export FMT ID. Returns an exit code. #>
  param([string] $Format = 'both', [string] $Id = 'latest')
  if ($Format -notin 'md', 'html', 'both') { Write-Err 'format must be md, html or both'; return $Script:WS_EXIT_USAGE }
  $files = @(Get-ReportFiles)
  if ($files.Count -eq 0) { Write-Err "no reports in $($Script:WS.ReportsDir)"; return $Script:WS_EXIT_FAIL }
  $picked = @()
  switch -Regex ($Id) {
    '^all$' { $picked = $files }
    '^latest$' { $picked = @($files[0]) }
    '^\d+$' { $n = [int]$Id; if ($n -lt 1 -or $n -gt $files.Count) { Write-Err "index $Id out of range (1..$($files.Count))"; return $Script:WS_EXIT_USAGE }; $picked = @($files[$n - 1]) }
    default { Write-Err 'ID must be a number, latest or all'; return $Script:WS_EXIT_USAGE }
  }
  foreach ($f in $picked) {
    if ($Format -in 'md', 'both') { $null = Convert-ReportToMarkdown -Json $f.FullName }
    if ($Format -in 'html', 'both') { $null = Convert-ReportToHtml -Json $f.FullName }
  }
  return $Script:WS_EXIT_OK
}

function Invoke-ReportsManager {
  Write-Box 'Reports manager' $Script:WS.ReportsDir
  $files = @(Show-ReportList)
  if ($files.Count -eq 0) { return }
  if (-not $Script:WS.Interactive) { Write-Note 'non-interactive: use --export md|html|both N|latest|all'; return }
  Write-UiLine '' 'Gray'
  Write-Plain '  cm N  markdown    ch N  html    cb N  both    all  export everything    v N  view JSON    o N  open HTML    d N  delete    q  quit'
  $answer = Read-Line '  > '
  if ($null -eq $answer) { return }
  $parts = $answer.Trim() -split '\s+'
  $cmd = $parts[0].ToLowerInvariant()
  $n = 0
  if ($parts.Count -gt 1 -and $parts[1] -match '^\d+$') { $n = [int]$parts[1] }
  $target = $null
  if ($n -ge 1 -and $n -le $files.Count) { $target = $files[$n - 1].FullName }
  switch ($cmd) {
    'cm' { if ($target) { $null = Convert-ReportToMarkdown -Json $target } else { Write-Err 'invalid index' } }
    'ch' { if ($target) { $null = Convert-ReportToHtml -Json $target } else { Write-Err 'invalid index' } }
    'cb' { if ($target) { $null = Convert-ReportToMarkdown -Json $target; $null = Convert-ReportToHtml -Json $target } else { Write-Err 'invalid index' } }
    'all' { foreach ($f in $files) { $null = Convert-ReportToMarkdown -Json $f.FullName; $null = Convert-ReportToHtml -Json $f.FullName } }
    'v' { if ($target) { Get-Content -LiteralPath $target | ForEach-Object { Write-Plain $_ } } else { Write-Err 'invalid index' } }
    'o' {
      if ($target) {
        $html = [IO.Path]::ChangeExtension($target, '.html')
        if (-not (Test-Path -LiteralPath $html)) { $null = Convert-ReportToHtml -Json $target }
        try { Start-Process $html | Out-Null; Write-Ok "opened $html" } catch { Write-Warn "could not open $html" }
      } else { Write-Err 'invalid index' }
    }
    'd' {
      if ($target) {
        if (Confirm-Ui -Prompt "Delete $([IO.Path]::GetFileName($target)) and its .md/.html siblings?" -Default 'n') {
          foreach ($ext in '.json', '.md', '.html') { $p = [IO.Path]::ChangeExtension($target, $ext); if (Test-Path -LiteralPath $p) { Remove-Item -LiteralPath $p -Force -ErrorAction SilentlyContinue } }
          Write-Ok 'deleted'
        }
      } else { Write-Err 'invalid index' }
    }
    'q' { return }
    default { Write-Warn "unknown action: $cmd" }
  }
}

function Show-Stats {
  Write-Box 'Run history' $Script:WS.Home
  $files = @(Get-ReportFiles)
  if ($files.Count -eq 0) { Write-Info 'no runs recorded yet'; return }
  $total = [long]0; $runs = 0; $dry = 0
  foreach ($f in $files) {
    $r = Read-Report $f.FullName
    if (-not $r) { continue }
    if ($r.meta.dry_run) { $dry++ } else { $runs++; $total += [long]$r.totals.total_reclaimed_bytes }
  }
  Write-Kv 'Real runs:' $runs
  Write-Kv 'Dry-runs:' $dry
  Write-Kv 'Reclaimed overall:' (Format-Bytes $total)
  Write-Kv 'Latest report:' $files[0].FullName
  $logs = Join-Path $Script:WS.Home 'logs'
  if (Test-Path -LiteralPath $logs) { Write-Kv 'Logs on disk:' (Format-Bytes (Get-DirectoryBytes $logs)) }
}
