# constants.ps1 - project metadata, section catalogue, profiles and gates.
# Dot-sourced by windowsweep.ps1. ASCII only (PowerShell 5.1 reads BOM-less files as ANSI).

# Single source of truth for the version is package.json: the Node launcher exports it as
# WINDOWSWEEP_VERSION. A direct checkout falls back to this literal; the version:check script
# asserts the two never drift.
$Script:WS_VERSION_FALLBACK = '1.0.0'

$Script:WS_NAME = 'windowsweep'
$Script:WS_TAGLINE = 'Safe-by-default Windows cleanup CLI - developer-aware, dry-run first, zero install via npx.'
$Script:WS_AUTHOR = 'Ahsan Mahmood'
$Script:WS_EMAIL = 'aoneahsan@gmail.com'
$Script:WS_WEB = 'https://aoneahsan.com'
$Script:WS_LINKEDIN = 'https://linkedin.com/in/aoneahsan'
$Script:WS_GITHUB = 'https://github.com/aoneahsan'
$Script:WS_REPO = 'https://github.com/aoneahsan/windowsweep'
$Script:WS_ISSUES = 'https://github.com/aoneahsan/windowsweep/issues'
$Script:WS_NPM = 'https://www.npmjs.com/package/windowsweep'
$Script:WS_DOCS = 'https://github.com/aoneahsan/windowsweep/blob/main/docs/README.md'
$Script:WS_SUPPORT = 'https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep'
$Script:WS_LICENSE = 'MIT License'

# Exit codes (documented in docs/cli-reference.md).
$Script:WS_EXIT_OK = 0
$Script:WS_EXIT_FAIL = 1
$Script:WS_EXIT_USAGE = 2
$Script:WS_EXIT_REFUSED = 3
$Script:WS_EXIT_INTERRUPT = 130

# Section catalogue. Numbering is a public contract frozen at 1.0.0: a section may be retired
# (kept as a no-op that says so) but a number is never reused for something else.
#   Tier:  report | rebuilds | slow | permanent | config
#   Batch: safe (in --all) | optin (--only/--profile with --yes) | deep (needs --i-understand-deep)
#          | interactive (never batch; dry-run/report allowed)
$Script:WS_SECTIONS = @(
  @{ Id = 0;  Key = 'health';     Title = 'System health report';                                   Tier = 'report';    Admin = $false; Batch = 'safe';        Dev = $false; Fn = 'Invoke-Section00' }
  @{ Id = 1;  Key = 'pkg';        Title = 'Package-manager caches (npm, yarn, pnpm, bun, deno, pip, uv, Composer, NuGet, Cargo, Go, pub)'; Tier = 'rebuilds'; Admin = $false; Batch = 'safe'; Dev = $true; Fn = 'Invoke-Section01' }
  @{ Id = 2;  Key = 'build';      Title = 'Build-tool caches (Gradle, Maven, Android, Unity, JetBrains)'; Tier = 'rebuilds';  Admin = $false; Batch = 'safe';        Dev = $true;  Fn = 'Invoke-Section02' }
  @{ Id = 3;  Key = 'runners';    Title = 'Test-runner browsers (Cypress, Playwright, Puppeteer) - keep newest'; Tier = 'rebuilds'; Admin = $false; Batch = 'safe'; Dev = $true; Fn = 'Invoke-Section03' }
  @{ Id = 4;  Key = 'avd';        Title = 'Android emulators (AVDs) idle N+ days';                    Tier = 'slow';      Admin = $false; Batch = 'optin';       Dev = $true;  Fn = 'Invoke-Section04' }
  @{ Id = 5;  Key = 'docker';     Title = 'Docker: dangling images, build cache, unused images older than N days'; Tier = 'rebuilds'; Admin = $false; Batch = 'safe'; Dev = $true; Fn = 'Invoke-Section05' }
  @{ Id = 6;  Key = 'editors';    Title = 'Editor caches (VS Code, Cursor, Windsurf, Visual Studio) + superseded extensions'; Tier = 'rebuilds'; Admin = $false; Batch = 'safe'; Dev = $false; Fn = 'Invoke-Section06' }
  @{ Id = 7;  Key = 'browsers';   Title = 'Browser caches (Chrome, Edge, Brave, Vivaldi, Opera, Chromium, Firefox)'; Tier = 'rebuilds'; Admin = $false; Batch = 'safe'; Dev = $false; Fn = 'Invoke-Section07' }
  @{ Id = 8;  Key = 'apps';       Title = 'Desktop app caches (Discord, Slack, Teams, Zoom, Spotify, Postman, Figma, ...)'; Tier = 'rebuilds'; Admin = $false; Batch = 'safe'; Dev = $false; Fn = 'Invoke-Section08' }
  @{ Id = 9;  Key = 'wincaches';  Title = 'Windows user caches (INetCache, WER, crash dumps, shader caches, UWP temp)'; Tier = 'rebuilds'; Admin = $false; Batch = 'safe'; Dev = $false; Fn = 'Invoke-Section09' }
  @{ Id = 10; Key = 'temp';       Title = 'User temp files older than N days';                        Tier = 'rebuilds';  Admin = $false; Batch = 'safe';        Dev = $false; Fn = 'Invoke-Section10' }
  @{ Id = 11; Key = 'recycle';    Title = 'Empty the Recycle Bin - PERMANENT';                       Tier = 'permanent'; Admin = $false; Batch = 'deep';        Dev = $false; Fn = 'Invoke-Section11' }
  @{ Id = 12; Key = 'wu';         Title = 'Windows Update + system temp (SoftwareDistribution, Delivery Optimization, Windows\Temp, CBS logs)'; Tier = 'rebuilds'; Admin = $true; Batch = 'safe'; Dev = $false; Fn = 'Invoke-Section12' }
  @{ Id = 13; Key = 'cleanmgr';   Title = 'Windows Disk Cleanup engine (cleanmgr, curated handlers)'; Tier = 'rebuilds'; Admin = $true;  Batch = 'safe';        Dev = $false; Fn = 'Invoke-Section13' }
  @{ Id = 14; Key = 'dism';       Title = 'Component store cleanup (DISM StartComponentCleanup) - slow'; Tier = 'rebuilds'; Admin = $true; Batch = 'optin';      Dev = $false; Fn = 'Invoke-Section14' }
  @{ Id = 15; Key = 'hiberfil';   Title = 'Hibernation file (off / reduced)';                         Tier = 'config';    Admin = $true;  Batch = 'deep';        Dev = $false; Fn = 'Invoke-Section15' }
  @{ Id = 16; Key = 'eventlogs';  Title = 'Clear Windows Event Logs - PERMANENT';                     Tier = 'permanent'; Admin = $true;  Batch = 'deep';        Dev = $false; Fn = 'Invoke-Section16' }
  @{ Id = 17; Key = 'projects';   Title = 'Stale project build artefacts (node_modules, dist, .next, target, ...)'; Tier = 'rebuilds'; Admin = $false; Batch = 'interactive'; Dev = $true; Fn = 'Invoke-Section17' }
  @{ Id = 18; Key = 'partials';   Title = 'Partial / orphan downloads -> Recycle Bin';                Tier = 'permanent'; Admin = $false; Batch = 'interactive'; Dev = $false; Fn = 'Invoke-Section18' }
  @{ Id = 19; Key = 'large';      Title = 'Large stale personal files (Downloads, Desktop) -> Recycle Bin'; Tier = 'permanent'; Admin = $false; Batch = 'interactive'; Dev = $false; Fn = 'Invoke-Section19' }
  @{ Id = 20; Key = 'vhdx';       Title = 'Docker Desktop / WSL disk image compaction (stops Docker + WSL)'; Tier = 'config'; Admin = $true; Batch = 'deep';    Dev = $true;  Fn = 'Invoke-Section20' }
  @{ Id = 21; Key = 'diskusage';  Title = 'Disk usage report (largest entries, drives, disk images)'; Tier = 'report';    Admin = $false; Batch = 'safe';        Dev = $false; Fn = 'Invoke-Section21' }
)

# The safe batch run by --all. Admin sections 12 and 13 join it only when already elevated.
$Script:WS_SAFE_BATCH = @(0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21)
$Script:WS_SAFE_BATCH_ADMIN = @(12, 13)

$Script:WS_PROFILES = @{
  'dev'        = @(1, 2, 3, 4, 5, 6, 17)
  'minimal'    = @(7, 8, 9, 10)
  'cache-only' = @(1, 2, 3, 6, 7, 8, 9)
  'system'     = @(12, 13, 14)
  'deep'       = @(0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 21)
  'audit'      = @(0, 21)
}

# Walkthrough order (interactive default mode). Admin sections are inserted when elevated.
$Script:WS_WALKTHROUGH = @(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 17, 18, 19)
$Script:WS_WALKTHROUGH_ADMIN = @(12, 13, 14)

function Get-Section {
  <# .SYNOPSIS Returns the catalogue entry for a section id, or $null. #>
  param([int] $Id)
  foreach ($s in $Script:WS_SECTIONS) { if ($s.Id -eq $Id) { return $s } }
  return $null
}

function Get-ToolVersion {
  <# .SYNOPSIS The running version: launcher-provided env wins over the checkout fallback. #>
  $v = $env:WINDOWSWEEP_VERSION
  if ([string]::IsNullOrWhiteSpace($v)) { return $Script:WS_VERSION_FALLBACK }
  return $v.Trim()
}
