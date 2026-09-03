# pkg_managers.ps1 - section 1: package-manager caches. All regenerable; the idle gate keeps recent work fast.

function Get-Targets01 {
  $P = $Script:P
  $npm = Get-NpmCacheDir
  return @(
    (New-Target 1 'npm cache (_cacache)' (Join-Path $npm '_cacache') -Mode prune -Dev $true -Note 'regenerated on the next npm install')
    (New-Target 1 'npx package cache (_npx)' (Join-Path $npm '_npx') -Mode prune -Dev $true)
    (New-Target 1 'npm logs' (Join-Path $npm '_logs') -Mode clear-old -Days 7)
    (New-Target 1 'Yarn v1 cache' "$($P.L)\Yarn\Cache" -Mode prune -Dev $true -Note 'yarn classic offline mirror')
    (New-Target 1 'Yarn Berry global cache' "$($P.L)\Yarn\Berry\cache" -Mode prune -Dev $true)
    (New-Target 1 'pnpm content store' "$($P.L)\pnpm\store" -Mode prune -Dev $true -Note 'pnpm store prune is used instead when pnpm is installed')
    (New-Target 1 'pnpm metadata cache' "$($P.L)\pnpm-cache" -Mode prune -Dev $true)
    (New-Target 1 'bun install cache' "$($P.U)\.bun\install\cache" -Mode prune -Dev $true -Note 'global bun packages stay')
    (New-Target 1 'deno deps cache' "$($P.L)\deno\deps" -Mode prune -Dev $true -Note 'installed deno scripts (~\.deno\bin) stay')
    (New-Target 1 'deno gen cache' "$($P.L)\deno\gen" -Mode prune -Dev $true)
    (New-Target 1 'deno npm cache' "$($P.L)\deno\npm" -Mode prune -Dev $true)
    (New-Target 1 'deno remote cache' "$($P.L)\deno\remote" -Mode prune -Dev $true)
    (New-Target 1 'pip cache' "$($P.L)\pip\cache" -Mode prune -Dev $true)
    (New-Target 1 'uv cache' "$($P.L)\uv\cache" -Mode prune -Dev $true -Note 'uv cache prune runs first when uv is installed')
    (New-Target 1 'poetry cache' "$($P.L)\pypoetry\Cache" -Mode prune -Dev $true)
    (New-Target 1 'Composer cache (files)' "$($P.L)\Composer\files" -Mode prune -Dev $true)
    (New-Target 1 'Composer cache (roaming)' "$($P.A)\Composer\cache" -Mode prune -Dev $true)
    (New-Target 1 'NuGet http cache' "$($P.L)\NuGet\v3-cache" -Mode clear)
    (New-Target 1 'NuGet plugins cache' "$($P.L)\NuGet\plugins-cache" -Mode clear)
    (New-Target 1 'NuGet scratch' "$($P.L)\Temp\NuGetScratch" -Mode clear)
    (New-Target 1 'NuGet global packages' "$($P.U)\.nuget\packages" -Mode prune -Dev $true -Note 'restored on the next dotnet restore')
    (New-Target 1 'Cargo registry cache' "$($P.U)\.cargo\registry\cache" -Mode prune -Dev $true -Note 'installed cargo binaries (~\.cargo\bin) stay')
    (New-Target 1 'Cargo registry sources' "$($P.U)\.cargo\registry\src" -Mode prune -Dev $true)
    (New-Target 1 'Cargo git checkouts' "$($P.U)\.cargo\git\checkouts" -Mode prune -Dev $true)
    (New-Target 1 'Go build cache' "$($P.L)\go-build" -Mode prune -Dev $true)
    (New-Target 1 'Go module download cache' "$($P.U)\go\pkg\mod\cache\download" -Mode prune -Dev $true)
    (New-Target 1 'Dart/Flutter pub cache' "$($P.L)\Pub\Cache" -Mode prune -Dev $true -Note 'redownloaded by flutter pub get')
    (New-Target 1 'Dart/Flutter pub cache (legacy)' "$($P.A)\Pub\Cache" -Mode prune -Dev $true)
    (New-Target 1 'Dart analysis server cache' "$($P.U)\.dartServer" -Mode prune -Dev $true)
    (New-Target 1 'Electron download cache' "$($P.L)\electron\Cache" -Mode prune -Dev $true)
    (New-Target 1 'electron-builder cache' "$($P.L)\electron-builder\Cache" -Mode prune -Dev $true)
    (New-Target 1 'node-gyp headers cache' "$($P.L)\node-gyp\Cache" -Mode prune -Dev $true)
    (New-Target 1 'Scoop installer cache' "$($P.U)\scoop\cache" -Mode prune -Dev $true)
  )
}

function Invoke-Section01 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Package-manager caches only re-download what a future install needs. Globally installed packages,',
    'toolchain managers (nvm, Volta, corepack, pnpm global, cargo bin, go bin) are protected and never touched.'
  ) -Dev $true
  $targets = Get-Targets01
  $null = Show-TargetSizes $targets
  if (-not (Confirm-Section 'Prune package-manager caches now?')) { Write-Info 'skipped'; return }
  # Tool-native smart prunes first: they know which entries are still referenced.
  if ((Test-CommandPresent 'pnpm') -and $ws.Developer -ne $false -and -not $ws.PurgeAll) {
    Write-Info 'pnpm store prune - removes packages no project references'
    $r = Invoke-External -FilePath 'pnpm' -ArgumentList @('store', 'prune') -Destructive -Quiet -Label 'pnpm store prune'
    if ($r.Ran -and $r.ExitCode -eq 0) { Write-Ok 'pnpm store pruned' }
    $targets = @($targets | Where-Object { $_.Label -ne 'pnpm content store' })
  }
  if ((Test-CommandPresent 'uv') -and $ws.Developer -ne $false -and -not $ws.PurgeAll) {
    Write-Info 'uv cache prune - removes unreachable wheels and sources'
    $r = Invoke-External -FilePath 'uv' -ArgumentList @('cache', 'prune') -Destructive -Quiet -Label 'uv cache prune'
    if ($r.Ran -and $r.ExitCode -eq 0) { Write-Ok 'uv cache pruned' }
  }
  if ((Test-CommandPresent 'npm') -and $ws.PurgeAll) {
    Write-Info 'npm cache clean --force'
    $null = Invoke-External -FilePath 'npm' -ArgumentList @('cache', 'clean', '--force') -Destructive -Quiet -Label 'npm cache clean'
  }
  $null = Invoke-TargetList $targets
}
