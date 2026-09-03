# browsers.ps1 - section 7: browser caches for every profile. Profile data is never touched.

function Get-Targets07 {
  $P = $Script:P
  return @(
    (New-Target 7 'Google Chrome' "$($P.L)\Google\Chrome\User Data" -Kind chromium -Guard @('chrome') -Note 'cache folders of every profile')
    (New-Target 7 'Google Chrome Beta' "$($P.L)\Google\Chrome Beta\User Data" -Kind chromium -Guard @('chrome'))
    (New-Target 7 'Google Chrome Dev' "$($P.L)\Google\Chrome Dev\User Data" -Kind chromium -Guard @('chrome'))
    (New-Target 7 'Google Chrome Canary' "$($P.L)\Google\Chrome SxS\User Data" -Kind chromium -Guard @('chrome'))
    (New-Target 7 'Microsoft Edge' "$($P.L)\Microsoft\Edge\User Data" -Kind chromium -Guard @('msedge'))
    (New-Target 7 'Brave' "$($P.L)\BraveSoftware\Brave-Browser\User Data" -Kind chromium -Guard @('brave'))
    (New-Target 7 'Vivaldi' "$($P.L)\Vivaldi\User Data" -Kind chromium -Guard @('vivaldi'))
    (New-Target 7 'Opera' "$($P.A)\Opera Software\Opera Stable" -Kind chromium -Guard @('opera'))
    (New-Target 7 'Opera GX' "$($P.A)\Opera Software\Opera GX Stable" -Kind chromium -Guard @('opera'))
    (New-Target 7 'Chromium' "$($P.L)\Chromium\User Data" -Kind chromium -Guard @('chrome', 'chromium'))
    (New-Target 7 'Arc' "$($P.L)\Packages\TheBrowserCompany.Arc_*\LocalCache\Local\Arc\User Data" -Kind chromium -Guard @('Arc'))
    (New-Target 7 'Firefox' "$($P.L)\Mozilla\Firefox\Profiles" -Kind firefox -Guard @('firefox') -Note 'cache2, startupCache, thumbnails, jumpListCache')
    (New-Target 7 'LibreWolf' "$($P.L)\LibreWolf\Profiles" -Kind firefox -Guard @('librewolf'))
    (New-Target 7 'Waterfox' "$($P.L)\Waterfox\Profiles" -Kind firefox -Guard @('waterfox'))
  )
}

function Invoke-Section07 {
  Write-SectionIntro @(
    'Browser caches rebuild as you browse; the first page loads afterwards are a little slower. Cookies, logins,',
    'history, bookmarks, extensions, Local Storage, IndexedDB and PWA CacheStorage are never touched.',
    'A browser that is open right now is skipped - close it and run this section again.'
  )
  $targets = Get-Targets07
  $null = Show-TargetSizes $targets
  if (-not (Confirm-Section 'Clear browser caches now?')) { Write-Info 'skipped'; return }
  $null = Invoke-TargetList $targets
}
