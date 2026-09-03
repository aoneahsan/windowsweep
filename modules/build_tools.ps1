# build_tools.ps1 - section 2: build-tool caches (Gradle, Maven, Android, Unity, JetBrains).

function Get-Targets02 {
  $P = $Script:P
  return @(
    (New-Target 2 'Gradle caches' "$($P.U)\.gradle\caches" -Mode prune -Dev $true -Note 'Gradle re-downloads what a build needs')
    (New-Target 2 'Gradle wrapper distributions' "$($P.U)\.gradle\wrapper\dists" -Mode units -Dev $true -KeepNewest $true -Note 'the newest distribution is always kept')
    (New-Target 2 'Gradle daemon logs' "$($P.U)\.gradle\daemon" -Mode prune -Days 7)
    (New-Target 2 'Gradle temp' "$($P.U)\.gradle\.tmp" -Mode clear)
    (New-Target 2 'Maven local repository' "$($P.U)\.m2\repository" -Mode prune -Dev $true -Note 'restored by the next mvn build')
    (New-Target 2 'Android SDK manager cache' "$($P.U)\.android\cache" -Mode clear)
    (New-Target 2 'Android build cache' "$($P.U)\.android\build-cache" -Mode prune -Dev $true)
    (New-Target 2 'Android SDK temp' "$($P.L)\Android\Sdk\.temp" -Mode clear)
    (New-Target 2 'Android SDK download leftovers' "$($P.L)\Android\Sdk\.downloadIntermediates" -Mode clear)
    (New-Target 2 'Unity cache' "$($P.L)\Unity\cache" -Mode prune -Dev $true)
    (New-Target 2 'JetBrains IDE caches (idle IDE versions)' "$($P.L)\JetBrains" -Mode units -Dev $true -ExcludeNames @('Toolbox') -Note 'a whole IDE version idle N+ days; the Toolbox itself is protected')
    (New-Target 2 '.NET telemetry storage' "$($P.U)\.dotnet\TelemetryStorageService" -Mode clear)
  )
}

function Invoke-Section02 {
  Write-SectionIntro @(
    'Build caches are re-created by the next build. In developer mode only idle files go, so a project you',
    'compiled last week keeps its warm cache. JetBrains caches are removed per IDE version, only when that whole',
    'version has been idle for the window (an IDE you no longer run).'
  ) -Dev $true
  $targets = Get-Targets02
  $null = Show-TargetSizes $targets
  if (-not (Confirm-Section 'Prune build-tool caches now?')) { Write-Info 'skipped'; return }
  if ((Test-CommandPresent 'gradle') -and -not $Script:WS.DryRun) {
    $null = Invoke-External -FilePath 'gradle' -ArgumentList @('--stop') -Quiet -Label 'gradle --stop'
    Write-Note 'stopped idle Gradle daemons so their caches are not locked'
  }
  $null = Invoke-TargetList $targets
}
