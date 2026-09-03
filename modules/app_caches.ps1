# app_caches.ps1 - section 8: desktop-app caches (Electron / Chromium-based apps) and superseded Squirrel versions.

function Get-Targets08 {
  $P = $Script:P
  return @(
    (New-Target 8 'Discord' "$($P.A)\discord" -Kind electron -Guard @('Discord'))
    (New-Target 8 'Discord Canary' "$($P.A)\discordcanary" -Kind electron -Guard @('DiscordCanary'))
    (New-Target 8 'Discord PTB' "$($P.A)\discordptb" -Kind electron -Guard @('DiscordPTB'))
    (New-Target 8 'Slack' "$($P.A)\Slack" -Kind electron -Guard @('slack'))
    (New-Target 8 'Slack (Store)' "$($P.L)\Packages\*slack*\LocalCache\Roaming\Slack" -Kind electron -Guard @('slack'))
    (New-Target 8 'Microsoft Teams (classic)' "$($P.A)\Microsoft\Teams" -Kind electron -Guard @('Teams'))
    (New-Target 8 'Microsoft Teams (new)' "$($P.L)\Packages\MSTeams_*\LocalCache\Microsoft\MSTeams\EBWebView\*" -Kind chromium -Guard @('ms-teams'))
    (New-Target 8 'Zoom logs' "$($P.A)\Zoom\logs" -Mode clear-old -Days 30 -Guard @('Zoom'))
    (New-Target 8 'Spotify streaming cache' "$($P.L)\Spotify\Storage" -Mode clear -Guard @('Spotify'))
    (New-Target 8 'Spotify (Store) streaming cache' "$($P.L)\Packages\SpotifyAB.SpotifyMusic_*\LocalCache\Spotify\Storage" -Kind glob -Mode clear -Guard @('Spotify'))
    (New-Target 8 'Postman' "$($P.A)\Postman" -Kind electron -Guard @('Postman'))
    (New-Target 8 'Figma' "$($P.A)\Figma" -Kind electron -Guard @('Figma'))
    (New-Target 8 'Notion' "$($P.A)\Notion" -Kind electron -Guard @('Notion'))
    (New-Target 8 'Signal' "$($P.A)\Signal" -Kind electron -Guard @('Signal'))
    (New-Target 8 'Skype' "$($P.A)\Microsoft\Skype for Desktop" -Kind electron -Guard @('Skype'))
    (New-Target 8 'GitHub Desktop' "$($P.A)\GitHub Desktop" -Kind electron -Guard @('GitHubDesktop'))
    (New-Target 8 'Obsidian' "$($P.A)\obsidian" -Kind electron -Guard @('Obsidian'))
    (New-Target 8 'Claude desktop app' "$($P.A)\Claude" -Kind electron -Guard @('Claude'))
    (New-Target 8 'Linear' "$($P.A)\Linear" -Kind electron -Guard @('Linear'))
    (New-Target 8 'Granola' "$($P.A)\Granola" -Kind electron -Guard @('Granola'))
    (New-Target 8 'Insomnia' "$($P.A)\Insomnia" -Kind electron -Guard @('Insomnia'))
    (New-Target 8 'Steam web cache' "$($P.L)\Steam\htmlcache" -Mode clear -Guard @('steam'))
    (New-Target 8 'Epic Games Launcher web cache' "$($P.L)\EpicGamesLauncher\Saved\webcache*" -Kind glob -Mode clear -Guard @('EpicGamesLauncher'))
    (New-Target 8 'Epic Games Launcher logs' "$($P.L)\EpicGamesLauncher\Saved\Logs" -Mode clear-old -Days 30)
    (New-Target 8 'Adobe media cache files' "$($P.A)\Adobe\Common\Media Cache Files" -Mode prune -Guard @('Adobe Premiere Pro', 'AfterFX', 'Adobe Audition') -Note 'Premiere / After Effects rebuild them on open')
    (New-Target 8 'Adobe media cache database' "$($P.A)\Adobe\Common\Media Cache" -Mode prune -Guard @('Adobe Premiere Pro', 'AfterFX', 'Adobe Audition'))
    (New-Target 8 'OBS Studio logs' "$($P.A)\obs-studio\logs" -Mode clear-old -Days 30)
    (New-Target 8 'OBS Studio crash reports' "$($P.A)\obs-studio\crashes" -Mode clear-old -Days 30)
    (New-Target 8 'Squirrel installer temp' "$($P.L)\SquirrelTemp" -Mode clear)
    (New-Target 8 'Electron updater downloads' "$($P.L)\@*-updater" -Kind glob -Mode clear-old -Days 7 -Note 'pending update installers older than a week')
    (New-Target 8 'Discord superseded versions' "$($P.L)\Discord" -Kind cmd -Guard @('Discord') -Note 'app-x.y.z folders other than the newest')
    (New-Target 8 'Postman superseded versions' "$($P.L)\Postman" -Kind cmd -Guard @('Postman'))
    (New-Target 8 'Figma superseded versions' "$($P.L)\Figma" -Kind cmd -Guard @('Figma'))
    (New-Target 8 'GitHub Desktop superseded versions' "$($P.L)\GitHubDesktop" -Kind cmd -Guard @('GitHubDesktop'))
    (New-Target 8 'Slack superseded versions' "$($P.L)\slack" -Kind cmd -Guard @('slack'))
  )
}

function Invoke-Section08 {
  Write-SectionIntro @(
    'Chat, design and API apps are browsers in disguise: their Cache, Code Cache and GPU caches rebuild on the next',
    'start, and installers that keep old app-x.y.z versions beside the current one waste space. Accounts, chat',
    'databases and settings are never touched; a running app is skipped.'
  )
  $targets = Get-Targets08
  $null = Show-TargetSizes @($targets | Where-Object { $_.Kind -ne 'cmd' })
  if (-not (Confirm-Section 'Clean desktop-app caches now?')) { Write-Info 'skipped'; return }
  $null = Invoke-TargetList @($targets | Where-Object { $_.Kind -ne 'cmd' })
  foreach ($t in @($targets | Where-Object { $_.Kind -eq 'cmd' })) {
    if (-not (Test-DirPresent $t.Path)) { continue }
    $null = Remove-SupersededVersions -Root $t.Path -Guard $t.Guard -Label $t.Label
  }
}
