# registry.ps1 - the registry chokepoint (1.5.0, D109). Every registry change windowsweep makes passes here:
# a leftover key of an uninstalled program, a broken uninstall entry, a startup value whose program is gone.
# Each one is exported to a .reg file first (double-clicking the file puts it back) and refused when the export
# fails, when the key is a hive root or a shared system or vendor key, or when it is not the kind of key the
# caller declared. Protection is judged BEFORE dry-run, so a refused key never even reaches a "would remove"
# line, and a self-test can prove a refusal without risking the key. ASCII only.

# Leftover program keys live directly under one of these. The longest matching root wins, so
# HKLM\SOFTWARE\WOW6432Node\Vendor is judged against the WOW6432Node root, not as a key named WOW6432Node.
$Script:WS_REG_ROOTS = @('HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node', 'HKEY_LOCAL_MACHINE\SOFTWARE', 'HKEY_CURRENT_USER\Software')
$Script:WS_REG_UNINSTALL_HIVES = @(
  'HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',
  'HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall',
  'HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall'
)
$Script:WS_REG_RUN_KEYS = @(
  'HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run',
  'HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\RunOnce',
  'HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run',
  'HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce',
  'HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run',
  'HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunOnce'
)
# First-level names under a Software root that are never removed, whatever matches them: Windows itself, shared
# platform keys, hardware vendors, toolchains, browsers, and this tool.
$Script:WS_REG_NEVER = @(
  'Microsoft', 'Classes', 'Policies', 'WOW6432Node', 'Windows', 'Clients', 'RegisteredApplications', 'Description',
  'Setup', 'DefaultUserEnvironment', 'Partner', 'ODBC', 'OpenSSH', 'Khronos', 'Intel', 'NVIDIA Corporation', 'NVIDIA',
  'Realtek', 'Lenovo', 'Dolby', 'Synaptics', 'Elantech', 'ELAN', 'Alps', 'Thunderbolt', 'Python', 'JavaSoft', 'Oracle',
  'GitForWindows', 'Git', 'Google', 'Mozilla', 'Apple Inc.', 'Apple Computer, Inc.', 'Chromium', 'Node.js', 'nodejs',
  'Rust', 'Docker Inc.', 'VMware, Inc.', 'Kitware', 'LLVM', 'Wow6432Node', 'windowsweep', 'aoneahsan', 'AppDataLow',
  'IM Providers', 'Netscape', 'ThinkPad', 'Conexant', 'Waves', 'Qualcomm', 'Broadcom', 'AMD', 'ATI Technologies', 'Validity'
)

function ConvertTo-RegistryPath {
  <# .SYNOPSIS HKCU:\x, HKLM\x, Registry::HKEY_... -> HKEY_CURRENT_USER\x / HKEY_LOCAL_MACHINE\x, no trailing slash. #>
  param([string] $Path)
  $p = ([string]$Path).Trim()
  $p = $p -replace '^Microsoft\.PowerShell\.Core\\Registry::', '' -replace '^Registry::', ''
  $p = $p -replace '^HKCU:\\?', 'HKEY_CURRENT_USER\' -replace '^HKLM:\\?', 'HKEY_LOCAL_MACHINE\'
  $p = $p -replace '^HKCU\\', 'HKEY_CURRENT_USER\' -replace '^HKLM\\', 'HKEY_LOCAL_MACHINE\'
  return $p.TrimEnd('\')
}

function Get-RegistrySubKeyNames {
  <# .SYNOPSIS Names of a key's direct children, read with enumerate rights only - one locked child never hides
     its siblings. Empty when the key is missing or unreadable. #>
  param([string] $Path)
  $p = ConvertTo-RegistryPath $Path
  $hive = $null; $sub = ''
  if ($p.StartsWith('HKEY_CURRENT_USER', [StringComparison]::OrdinalIgnoreCase)) { $hive = [Microsoft.Win32.Registry]::CurrentUser; $sub = $p.Substring(17).TrimStart('\') }
  elseif ($p.StartsWith('HKEY_LOCAL_MACHINE', [StringComparison]::OrdinalIgnoreCase)) { $hive = [Microsoft.Win32.Registry]::LocalMachine; $sub = $p.Substring(18).TrimStart('\') }
  else { return @() }
  $k = $null
  try { $k = $hive.OpenSubKey($sub, $false); if ($k) { return @($k.GetSubKeyNames()) } } catch { $null = $_ } finally { if ($k) { $k.Close() } }
  return @()
}

function Get-RegistryParent {
  param([string] $Path)
  $i = $Path.LastIndexOf('\')
  if ($i -lt 0) { return '' }
  return $Path.Substring(0, $i)
}

function Get-RegistryProtectionReason {
  <# .SYNOPSIS Why windowsweep may not change this key, or $null when it may. -Kind: key (a program's own key
     under a Software root), uninstall (one entry directly under an Uninstall hive) or run (a Run/RunOnce key,
     whose single values are removed). Pure: reads nothing from the registry. #>
  param([string] $Path, [ValidateSet('key', 'uninstall', 'run')][string] $Kind = 'key')
  $p = ConvertTo-RegistryPath $Path
  if (-not $p) { return 'no key named' }
  if ($p -notmatch '^HKEY_(CURRENT_USER|LOCAL_MACHINE)\\') { return 'outside HKEY_CURRENT_USER and HKEY_LOCAL_MACHINE' }
  if ($Kind -eq 'uninstall') {
    $parent = Get-RegistryParent $p
    foreach ($h in $Script:WS_REG_UNINSTALL_HIVES) { if ($parent.Equals($h, [StringComparison]::OrdinalIgnoreCase)) { return $null } }
    return 'not an entry directly under an Uninstall hive'
  }
  if ($Kind -eq 'run') {
    foreach ($k in $Script:WS_REG_RUN_KEYS) { if ($p.Equals($k, [StringComparison]::OrdinalIgnoreCase)) { return $null } }
    return 'not a Run or RunOnce key'
  }
  $root = $null
  foreach ($r in $Script:WS_REG_ROOTS) {
    if ($p.StartsWith($r + '\', [StringComparison]::OrdinalIgnoreCase)) { $root = $r; break }
    if ($p.Equals($r, [StringComparison]::OrdinalIgnoreCase)) { return 'a Software root' }
  }
  if (-not $root) { return 'not under HKCU\Software or HKLM\SOFTWARE' }
  $first = ($p.Substring($root.Length + 1) -split '\\')[0]
  if (Test-RegistryNeverName $first) { return "a shared system or vendor key ($first)" }
  return $null
}

function Test-RegistryNeverName {
  <# .SYNOPSIS True for a key name windowsweep never removes (Windows, shared platform keys, hardware vendors,
     toolchains, browsers, itself), wherever the key sits. #>
  param([string] $Name)
  foreach ($n in $Script:WS_REG_NEVER) { if (([string]$Name).Equals($n, [StringComparison]::OrdinalIgnoreCase)) { return $true } }
  return $false
}

function Backup-RegistryKey {
  <# .SYNOPSIS Export one key and everything under it to a .reg file in the reports folder. Returns the file, or
     '' when the export failed - the caller then keeps the key. #>
  param([string] $Path)
  $p = ConvertTo-RegistryPath $Path
  $dir = Join-Path $Script:WS.ReportsDir ('registry-backups\' + $Script:WS.Stamp)
  try { $null = New-Item -ItemType Directory -Force -Path $dir -ErrorAction Stop } catch { return '' }
  $leaf = ($p.Substring($p.LastIndexOf('\') + 1) -replace '[^A-Za-z0-9._-]', '_')
  if ($leaf.Length -gt 60) { $leaf = $leaf.Substring(0, 60) }
  $file = Join-Path $dir ('{0}-{1}.reg' -f $leaf, [guid]::NewGuid().ToString('N').Substring(0, 8))
  $out = & reg.exe export $p $file /y 2>&1
  $code = $LASTEXITCODE
  $ok = ($code -eq 0) -and (Test-Path -LiteralPath $file) -and ((Get-Item -LiteralPath $file).Length -gt 20)
  if (-not $ok) { Write-LogLine "registry export failed (exit $code): $p : $out"; return '' }
  return $file
}

function Test-RegistryWriteAllowed {
  <# .SYNOPSIS HKEY_LOCAL_MACHINE needs an elevated run; say so once per key and refuse. #>
  param([string] $Path)
  if ($Path.StartsWith('HKEY_LOCAL_MACHINE', [StringComparison]::OrdinalIgnoreCase) -and -not $Script:WS.IsAdmin) {
    Write-Warn "$Path is machine-wide: it needs an elevated run (skipped)"
    return $false
  }
  return $true
}

function Remove-RegistryKeySafe {
  <# .SYNOPSIS The registry chokepoint for keys. Returns removed | absent | dry-run | refused | skipped | failed.
     -Kind key: a program's own key under a Software root; -Kind uninstall: a broken uninstall entry. #>
  param([Parameter(Mandatory = $true)][string] $Path, [ValidateSet('key', 'uninstall')][string] $Kind = 'key', [string] $Label = '')
  $p = ConvertTo-RegistryPath $Path
  $why = Get-RegistryProtectionReason -Path $p -Kind $Kind
  if ($why) { Write-Warn "kept $p ($why)"; Write-LogLine "registry refused: $p : $why"; return 'refused' }
  if (-not (Test-Path -LiteralPath "Registry::$p")) { Write-Info "already gone: $p"; return 'absent' }
  if (-not (Test-RegistryWriteAllowed $p)) { return 'skipped' }
  $what = 'registry key'
  if ($Label) { $what = $Label }
  if ($Script:WS.DryRun) { Write-DryRun "would export, then remove $what  $p"; return 'dry-run' }
  $file = Backup-RegistryKey $p
  if (-not $file) { Write-Err "kept $p - its .reg backup could not be written"; return 'failed' }
  try { Remove-Item -LiteralPath "Registry::$p" -Recurse -Force -ErrorAction Stop }
  catch { Write-Err "could not remove $p - $($_.Exception.Message)"; return 'failed' }
  Write-Ok "removed $what  $p"
  Write-Note "  backup: $file"
  Write-LogLine "registry removed: $p (backup $file)"
  return 'removed'
}

function Remove-RegistryValueSafe {
  <# .SYNOPSIS The registry chokepoint for one Run/RunOnce value. The whole Run key is exported first, so the
     backup also restores the value. Returns removed | absent | dry-run | refused | skipped | failed. #>
  param([Parameter(Mandatory = $true)][string] $KeyPath, [Parameter(Mandatory = $true)][string] $Name)
  $p = ConvertTo-RegistryPath $KeyPath
  $why = Get-RegistryProtectionReason -Path $p -Kind 'run'
  if (-not $why -and [string]::IsNullOrWhiteSpace($Name)) { $why = 'no value named' }
  if ($why) { Write-Warn "kept $p :: $Name ($why)"; Write-LogLine "registry value refused: $p :: $Name : $why"; return 'refused' }
  $present = $false
  try { $present = $null -ne (Get-ItemProperty -LiteralPath "Registry::$p" -Name $Name -ErrorAction Stop) } catch { $present = $false }
  if (-not $present) { Write-Info "already gone: $p :: $Name"; return 'absent' }
  if (-not (Test-RegistryWriteAllowed $p)) { return 'skipped' }
  if ($Script:WS.DryRun) { Write-DryRun "would export the key, then remove the startup entry '$Name' from $p"; return 'dry-run' }
  $file = Backup-RegistryKey $p
  if (-not $file) { Write-Err "kept $p :: $Name - its .reg backup could not be written"; return 'failed' }
  try { Remove-ItemProperty -LiteralPath "Registry::$p" -Name $Name -ErrorAction Stop }
  catch { Write-Err "could not remove $p :: $Name - $($_.Exception.Message)"; return 'failed' }
  Write-Ok "removed the startup entry '$Name'"
  Write-Note "  backup of $p : $file"
  Write-LogLine "registry value removed: $p :: $Name (backup $file)"
  return 'removed'
}
