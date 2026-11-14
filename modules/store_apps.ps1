# store_apps.ps1 - the Store half of section 26 (1.5.0, D109): apps installed for this Windows account from the
# Microsoft Store or as MSIX packages, removed with Remove-AppxPackage, one at a time, never while running.
# Seen on the P52 (2026-11-13): Cortana, six Xbox apps, Skype, Mail and Calendar and Paint 3D still installed
# years after Windows stopped needing them. Removal is for the current account only; Windows may put an inbox
# app back for a new account or after a feature update. ASCII only.

# Never offered: the Store and winget themselves, frameworks and runtimes other apps load, media codecs, WSL,
# language packs and the browser.
$Script:WS_STORE_NEVER = @(
  'Microsoft.WindowsStore', 'Microsoft.StorePurchaseApp', 'Microsoft.DesktopAppInstaller', 'Microsoft.Winget.*',
  'Microsoft.SecHealthUI', 'Microsoft.Services.Store.Engagement', 'Microsoft.UI.Xaml*', 'Microsoft.VCLibs*',
  'Microsoft.NET.*', 'Microsoft.WindowsAppRuntime*', 'MicrosoftCorporationII.WinAppRuntime*',
  'MicrosoftCorporationII.WindowsSubsystemForLinux', 'Microsoft.*Extension', 'Microsoft.*Extensions',
  'Microsoft.LanguageExperiencePack*', 'Microsoft.MicrosoftEdge*', 'Microsoft.Windows.CloudExperienceHost',
  'windowsweep*', 'com.aoneahsan.windowsweep*'
)
# Apps that drive this PC's hardware (touchpad, audio, graphics, maker utilities): removing one breaks a device panel.
$Script:WS_STORE_HARDWARE = @(
  'NVIDIACorp.*', 'AppUp.Intel*', 'Intel*', 'AppUp.Thunderbolt*', 'RealtekSemiconductorCorp.*', 'ELANMicroelectronicsCorpo.*',
  'SynapticsIncorporated.*', 'DolbyLaboratories.*', 'AdvancedMicroDevicesInc*', 'E046963F.*', 'LenovoCorporation*',
  'DellInc.*', 'AD2F1837.*', 'WavesAudio*', 'B9ECED6F.*', 'ThunderboltControlCenter*'
)

function Test-StoreAppOffered {
  <# .SYNOPSIS Pure: may section 26 offer this package? Takes anything with the Get-AppxPackage fields. #>
  param([object] $Package)
  if ($null -eq $Package -or -not $Package.Name) { return $false }
  if ($Package.IsFramework -or $Package.IsResourcePackage) { return $false }
  if ([string]$Package.SignatureKind -eq 'System') { return $false }
  if ($Package.PSObject.Properties['NonRemovable'] -and $Package.NonRemovable) { return $false }
  foreach ($pat in @($Script:WS_STORE_NEVER + $Script:WS_STORE_HARDWARE)) { if ([string]$Package.Name -like $pat) { return $false } }
  return $true
}

function Get-StartAppNames {
  <# .SYNOPSIS PackageFamilyName -> the name the Start menu shows. Empty when Get-StartApps is unavailable. #>
  $map = @{}
  try {
    foreach ($a in @(Get-StartApps -ErrorAction Stop)) {
      $id = [string]$a.AppID
      $bang = $id.IndexOf('!')
      if ($bang -gt 0) { $fam = $id.Substring(0, $bang); if (-not $map.ContainsKey($fam)) { $map[$fam] = [string]$a.Name } }
    }
  } catch { $null = $_ }
  return $map
}

function Get-StoreAppManifestText {
  <# .SYNOPSIS The manifest's display name and publisher name, each '' when missing or an ms-resource reference. #>
  param([object] $Package)
  $out = [pscustomobject]@{ DisplayName = ''; Publisher = '' }
  try {
    $props = (Get-AppxPackageManifest -Package $Package.PackageFullName -ErrorAction Stop).Package.Properties
    if ([string]$props.DisplayName -and [string]$props.DisplayName -notlike 'ms-resource:*') { $out.DisplayName = [string]$props.DisplayName }
    if ([string]$props.PublisherDisplayName -and [string]$props.PublisherDisplayName -notlike 'ms-resource:*') { $out.Publisher = [string]$props.PublisherDisplayName }
  } catch { $null = $_ }
  return $out
}

function Resolve-StoreAppName {
  <# .SYNOPSIS Pure: the friendliest name available - the Start menu's, then the manifest's, then the package
     name with its publisher prefix dropped ("Microsoft.MixedReality.Portal" -> "MixedReality Portal"). #>
  param([object] $Package, [hashtable] $StartNames, [string] $ManifestName = '')
  $fam = [string]$Package.PackageFamilyName
  if ($StartNames -and $StartNames.ContainsKey($fam)) { return $StartNames[$fam] }
  if ($ManifestName) { return $ManifestName }
  $parts = ([string]$Package.Name).Split('.')
  if ($parts.Count -gt 1) { return ($parts | Select-Object -Skip 1) -join ' ' }
  return [string]$Package.Name
}

function Resolve-StoreAppPublisher {
  <# .SYNOPSIS Pure: the manifest's publisher name, else the organisation in the signing subject (CN=...). #>
  param([object] $Package, [string] $ManifestPublisher = '')
  if ($ManifestPublisher) { return $ManifestPublisher }
  $cn = [string]$Package.Publisher
  if ($cn -match '^CN="([^"]+)"') { return $Matches[1] }
  if ($cn -match '^CN=([^,]+)') { return $Matches[1].Trim() }
  return $cn
}

function Get-StoreAppRows {
  <# .SYNOPSIS Store apps section 26 may offer, as rows shaped like the uninstall-hive rows (Kind = store, KeyPath
     = appx:<PackageFullName>, the path --select-file and the desktop app match on). #>
  $pkgs = @()
  try { $pkgs = @(Get-AppxPackage -ErrorAction Stop) } catch { Write-Note "Store apps could not be read: $($_.Exception.Message)"; return @() }
  $names = Get-StartAppNames
  $rows = @()
  foreach ($p in $pkgs) {
    if (-not (Test-StoreAppOffered -Package $p)) { continue }
    $loc = [string]$p.InstallLocation
    $bytes = [long]0
    if ($loc -and (Test-DirPresent $loc)) { $bytes = [long](Get-DirectoryBytes $loc) }
    $mf = Get-StoreAppManifestText -Package $p
    $rows += [pscustomobject]@{
      Kind = 'store'; DisplayName = (Resolve-StoreAppName -Package $p -StartNames $names -ManifestName $mf.DisplayName); DisplayVersion = [string]$p.Version
      Publisher = (Resolve-StoreAppPublisher -Package $p -ManifestPublisher $mf.Publisher); InstallDate = ''; EstimatedSizeKb = [long][math]::Floor($bytes / 1024)
      InstallLocation = $loc; UninstallString = ''; QuietUninstallString = ''; SystemComponent = 0; WindowsInstaller = 0
      KeyPath = 'appx:' + [string]$p.PackageFullName; KeyName = [string]$p.PackageFullName; Machine = $false
      ParentKeyName = ''; ReleaseType = ''; PackageFullName = [string]$p.PackageFullName; PackageName = [string]$p.Name
    }
  }
  return $rows
}

function Invoke-StoreAppRemoval {
  <# .SYNOPSIS Remove one Store app for this account. Returns removed | pending | failed | skipped | dry-run. #>
  param([pscustomobject] $Row)
  $bytes = [long]$Row.EstimatedSizeKb * 1024
  if ($Script:WS.DryRun) {
    Write-DryRun ("would remove the Store app {0} [{1}]" -f $Row.DisplayName, $Row.PackageFullName)
    Add-Freed $bytes
    return 'dry-run'
  }
  $loc = ([string]$Row.InstallLocation).TrimEnd('\')
  if ($loc) {
    $prefix = $loc + '\'
    $running = @(Get-BusyExecutablePaths | Where-Object { $_.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase) })
    if ($running.Count -gt 0) { Write-Warn "$($Row.DisplayName) is running ($([IO.Path]::GetFileName($running[0]))) - close it and run section 26 again"; return 'skipped' }
  }
  Write-LogLine "uninstall [store]: Remove-AppxPackage $($Row.PackageFullName)"
  try { Remove-AppxPackage -Package $Row.PackageFullName -ErrorAction Stop }
  catch { Write-Err "$($Row.DisplayName) - Windows refused to remove it: $($_.Exception.Message)"; return 'failed' }
  $left = @(Get-AppxPackage -Name $Row.PackageName -ErrorAction SilentlyContinue | Where-Object { $_.PackageFullName -eq $Row.PackageFullName })
  if ($left.Count -gt 0) { Write-Warn "$($Row.DisplayName) - Windows reported success but the app is still installed"; return 'pending' }
  Add-Freed $bytes
  Write-Ok "$($Row.DisplayName) removed (Store app)"
  return 'removed'
}
