# docker.ps1 - section 5 (Docker prune) and section 20 (disk image compaction).

function Get-Targets05 {
  return @(
    (New-Target 5 'docker image prune (dangling layers)' 'docker image prune -f' -Kind cmd)
    (New-Target 5 'docker builder prune (build cache idle N+ days)' 'docker builder prune -f --filter until=<N>h' -Kind cmd)
    (New-Target 5 'docker image prune (unused images older than N days)' 'docker image prune -a -f --filter until=<N>h' -Kind cmd)
  )
}

function Test-DockerDaemon {
  if (-not (Test-CommandPresent 'docker')) { return $false }
  $r = Invoke-External -FilePath 'docker' -ArgumentList @('info', '--format', '{{.ServerVersion}}') -Quiet -Label 'docker info'
  return ($r.Ran -and $r.ExitCode -eq 0)
}

function Invoke-DockerPrune {
  param([string[]] $Arguments, [string] $Label)
  $r = Invoke-External -FilePath 'docker' -ArgumentList $Arguments -Destructive -Quiet -Label $Label
  if (-not $r.Ran) { return [long]0 }
  $freed = [long]0
  foreach ($l in $r.Output) { if ($l -match 'Total reclaimed space:\s*(.+)$') { $freed += ConvertFrom-SizeText $Matches[1] } }
  if ($r.ExitCode -eq 0) { Write-Ok ("$Label - reclaimed " + (Format-Bytes $freed)) } else { Write-Warn "$Label - docker returned $($r.ExitCode)" }
  Add-Freed $freed
  return $freed
}

function Invoke-Section05 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'Docker keeps every image layer and build step it ever produced. Dangling layers and the build cache are',
    'safe to drop; images no container uses go only when older than the idle window. Volumes are never touched',
    '(review them yourself with: docker volume ls  /  docker volume prune).'
  ) -Dev $true
  if (-not (Test-CommandPresent 'docker')) { Write-Info 'docker CLI not found - skipped'; return }
  if (-not (Test-DockerDaemon)) { Write-Warn 'Docker daemon is not running (start Docker Desktop) - skipped'; $ws.Hints += 'Start Docker Desktop and re-run:  windowsweep --only 5 --yes'; return }
  $df = Invoke-External -FilePath 'docker' -ArgumentList @('system', 'df') -Quiet -Label 'docker system df'
  foreach ($l in $df.Output) { Write-Plain "  $l" }
  if (-not (Confirm-Section 'Prune Docker now?')) { Write-Info 'skipped'; return }
  $hours = [int]($ws.Days * 24)
  if ($ws.PurgeAll -or $ws.Developer -eq $false) {
    if ($ws.Developer -ne $false -and -not (Confirm-Ui -Prompt 'FULL PURGE removes every image no container uses right now (they re-pull later). Continue?' -Default 'n')) { Write-Info 'full purge declined; doing the conservative prune instead' }
    else { $null = Invoke-DockerPrune -Arguments @('system', 'prune', '-a', '-f') -Label 'docker system prune -a'; return }
  }
  $null = Invoke-DockerPrune -Arguments @('image', 'prune', '-f') -Label 'dangling image layers'
  $null = Invoke-DockerPrune -Arguments @('builder', 'prune', '-f', '--filter', "until=${hours}h") -Label "build cache idle $($ws.Days)+ days"
  $null = Invoke-DockerPrune -Arguments @('image', 'prune', '-a', '-f', '--filter', "until=${hours}h") -Label "unused images older than $($ws.Days) days"
  Write-Note 'the Docker disk image (docker_data.vhdx) does not shrink by itself - section 20 compacts it (admin, stops Docker)'
}

# ---------------------------------------------------------------------------------------------
# Section 20 - disk image compaction
# ---------------------------------------------------------------------------------------------

function Get-Targets20 {
  return @((New-Target 20 'Docker Desktop / WSL virtual disks (*.vhdx)' "$($Script:P.L)\Docker\wsl\*\*.vhdx and Packages\*\LocalState\*.vhdx" -Kind cmd -Note 'diskpart compact vdisk; Docker Desktop and WSL are stopped first'))
}

function Invoke-Section20 {
  $ws = $Script:WS
  Write-SectionIntro @(
    'A WSL/Docker virtual disk grows as data is written but never shrinks when it is deleted. Compaction hands the',
    'free space back to Windows. It needs Administrator rights and STOPS Docker Desktop and every WSL distro first;',
    'restart Docker Desktop afterwards.'
  )
  $images = @(Get-DiskImageFiles)
  if ($images.Count -eq 0) { Write-Info 'no .vhdx disk images found'; return }
  $i = 1
  foreach ($img in $images) { Write-UiLine ("  {0,3}  {1,10}  {2}" -f $i, (Format-Bytes $img.Length), $img.FullName) 'Gray'; $i++ }
  if (-not (Test-CommandPresent 'diskpart.exe')) { Write-Warn 'diskpart.exe not found - skipped'; return }
  $picks = @()
  if ($ws.Yes) { $picks = @(1..$images.Count) } else { $picks = Read-MultiSelect -Total $images.Count }
  if ($picks.Count -eq 0) { Write-Info 'nothing selected'; return }
  if (-not (Confirm-Section 'Stop Docker Desktop and WSL now and compact the selected disks?' 'n')) { Write-Info 'skipped'; return }
  if ($ws.DryRun) { foreach ($k in $picks) { Write-DryRun "would compact $($images[$k - 1].FullName)" }; return }
  Write-Info 'stopping Docker Desktop and WSL...'
  Get-Process -Name 'Docker Desktop' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  $null = Invoke-External -FilePath 'wsl.exe' -ArgumentList @('--shutdown') -Destructive -Quiet -Label 'wsl --shutdown'
  Start-Sleep -Seconds 8
  foreach ($k in $picks) {
    $img = $images[$k - 1]
    $before = (Get-Item -LiteralPath $img.FullName).Length
    $script = Join-Path $env:TEMP ("windowsweep-diskpart-" + [guid]::NewGuid().ToString('N') + '.txt')
    [IO.File]::WriteAllLines($script, @("select vdisk file=`"$($img.FullName)`"", 'attach vdisk readonly', 'compact vdisk', 'detach vdisk', 'exit'))
    $r = Invoke-External -FilePath 'diskpart.exe' -ArgumentList @('/s', $script) -Destructive -Quiet -Label "diskpart compact $($img.Name)"
    Remove-Item -LiteralPath $script -Force -ErrorAction SilentlyContinue
    $after = (Get-Item -LiteralPath $img.FullName).Length
    $gain = [math]::Max([long]0, $before - $after)
    if ($r.ExitCode -eq 0) { Write-Ok ("$($img.Name): " + (Format-Bytes $before) + ' -> ' + (Format-Bytes $after) + ' (freed ' + (Format-Bytes $gain) + ')') } else { Write-Warn "$($img.Name): diskpart returned $($r.ExitCode)"; foreach ($l in $r.Output) { Write-Note $l } }
    Add-Freed $gain
  }
  Write-Info 'done - start Docker Desktop again when you need it'
}
