# config.ps1 - persistent settings (~\.windowsweep\config.json) and the developer question.

function Get-DefaultConfig {
  return [ordered]@{
    schema = 1
    developer = $null
    developerAskedAt = $null
    days = 100
    tempDays = 3
    largeFileMb = 100
    scanRoots = @()
    excludePaths = @()
    welcomed = $false
  }
}

function Import-Config {
  <# .SYNOPSIS Load config.json over the defaults; a broken file is reported and ignored. #>
  $ws = $Script:WS
  $cfg = Get-DefaultConfig
  $path = $ws.ConfigPath
  if (Test-Path -LiteralPath $path) {
    try {
      $raw = Get-Content -LiteralPath $path -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
      foreach ($k in @($cfg.Keys)) {
        $prop = $raw.PSObject.Properties[$k]
        if ($null -ne $prop) { $cfg[$k] = $prop.Value }
      }
      if ($null -eq $cfg.scanRoots) { $cfg.scanRoots = @() }
      if ($null -eq $cfg.excludePaths) { $cfg.excludePaths = @() }
    } catch {
      Write-Warn "config file unreadable, using defaults: $path ($($_.Exception.Message))"
    }
  }
  $ws.Config = $cfg
  return $cfg
}

function Save-Config {
  $ws = $Script:WS
  try {
    $dir = Split-Path -Parent $ws.ConfigPath
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [IO.File]::WriteAllText($ws.ConfigPath, ($ws.Config | ConvertTo-Json -Depth 4), (New-Object System.Text.UTF8Encoding($false)))
  } catch {
    Write-Warn "could not save config: $($_.Exception.Message)"
  }
}

function Get-ToolchainHints {
  <# .SYNOPSIS Names of developer tools found on this machine (used to suggest the developer answer). #>
  $found = @()
  foreach ($c in @('node', 'npm', 'yarn', 'pnpm', 'bun', 'deno', 'git', 'docker', 'python', 'pip', 'uv', 'java', 'gradle', 'dotnet', 'cargo', 'go', 'flutter', 'composer', 'php', 'code', 'cursor')) {
    if (Get-Command $c -ErrorAction SilentlyContinue) { $found += $c }
  }
  $dirs = @{
    'Gradle caches' = "$env:USERPROFILE\.gradle"; 'Android SDK' = "$env:LOCALAPPDATA\Android\Sdk"; 'VS Code' = "$env:APPDATA\Code"
    'Docker Desktop' = "$env:LOCALAPPDATA\Docker"; 'JetBrains IDEs' = "$env:LOCALAPPDATA\JetBrains"; 'Visual Studio' = "$env:LOCALAPPDATA\Microsoft\VisualStudio"
  }
  foreach ($k in $dirs.Keys) { if (Test-Path -LiteralPath $dirs[$k]) { $found += $k } }
  return $found
}

function Resolve-DeveloperMode {
  <# .SYNOPSIS Decide developer mode: flag > saved answer > interactive question > conservative default (yes). #>
  $ws = $Script:WS
  if ($null -ne $ws.DeveloperFlag) { $ws.Developer = [bool]$ws.DeveloperFlag; $ws.DeveloperSource = 'flag'; return }
  if ($ws.ForgetDeveloper) { $ws.Config.developer = $null; $ws.Config.developerAskedAt = $null }
  if ($null -ne $ws.Config.developer) { $ws.Developer = [bool]$ws.Config.developer; $ws.DeveloperSource = 'config'; return }
  if ($ws.Interactive -and -not $ws.Yes) {
    $hints = @(Get-ToolchainHints)
    Write-Box 'One question before anything else' 'It decides how package and build caches are treated'
    Write-Plain '  Are you a developer on this machine?'
    Write-Note 'yes = package/build/test-runner caches are only pruned when idle 100+ days (recent work stays fast);'
    Write-Note '      the newest version of every versioned tool cache is always kept.'
    Write-Note 'no  = those caches are cleared completely; project scans are skipped.'
    if ($hints.Count -gt 0) { Write-Note ("detected developer tooling: " + ($hints -join ', ')) }
    $ans = Confirm-Ui -Prompt 'Are you a developer on this machine?' -Default 'y' -NoAutoYes
    $ws.Developer = $ans
    $ws.DeveloperSource = 'answer'
    $ws.Config.developer = $ans
    $ws.Config.developerAskedAt = (Get-Date).ToString('yyyy-MM-dd')
    Save-Config
    if ($ans) { Write-Ok 'developer mode ON - saved to config.json (change with --forget-developer)' } else { Write-Ok 'developer mode OFF - saved to config.json (change with --forget-developer)' }
    return
  }
  $ws.Developer = $true
  $ws.DeveloperSource = 'default'
  Write-Note 'developer question not asked (non-interactive run) - defaulting to developer mode ON, the conservative choice; pass --not-developer to override'
}
