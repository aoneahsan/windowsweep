/* ============================================================================
   windowsweep desktop dummy - the deterministic demo dataset

   🔴 EVERY section id, key, title, tier, batch policy, admin flag and dev flag
   below is transcribed from the real catalogue in lib/constants.ps1 (1.5.0,
   compared mechanically on 2026-11-13: 28 and 29 had been shortened in 1.4.0).
   Nothing about the product is invented here.

   The BYTES are demo data - a plausible developer machine, marked `demo-data` in
   the UI wherever a number is shown, because inventing a figure and presenting it
   as measured is the one thing a dummy must never teach the app to do.
   ============================================================================ */
(function () {
  'use strict';

  var GB = 1024 * 1024 * 1024, MB = 1024 * 1024;

  /* the six tiers, in RISK ORDER - the treemap ramp is ordinal, not categorical */
  var TIERS = [
    { key: 'config',    label: 'config',    rank: 0, blurb: 'changes a setting; deletes nothing' },
    { key: 'report',    label: 'report',    rank: 1, blurb: 'reports only; deletes nothing' },
    { key: 'rebuilds',  label: 'rebuilds',  rank: 2, blurb: 'regenerates on next use' },
    { key: 'slow',      label: 'slow',      rank: 3, blurb: 'regenerates, but slowly' },
    { key: 'recycle',   label: 'recycle',   rank: 4, blurb: 'goes to the Recycle Bin' },
    { key: 'permanent', label: 'permanent', rank: 5, blurb: 'gone for good' },
    /* 1.5.0, sections 30-32 only. Outside the risk ramp: it adds software rather than
       reclaiming space, so no map tile is ever this tier and rank 6 only puts it last. */
    { key: 'update',    label: 'update',    rank: 6, blurb: 'installs what Windows Update or winget fetches' }
  ];

  var SECTIONS = [
    { id:0,  key:'health',    tier:'report',    batch:'safe',        admin:false, dev:false, title:'System health report' },
    { id:1,  key:'pkg',       tier:'rebuilds',  batch:'safe',        admin:false, dev:true,  title:'Package-manager caches (npm, yarn, pnpm, bun, deno, pip, uv, Composer, NuGet, Cargo, Go, pub)' },
    { id:2,  key:'build',     tier:'rebuilds',  batch:'safe',        admin:false, dev:true,  title:'Build-tool caches (Gradle, Maven, Android, Unity, JetBrains)' },
    { id:3,  key:'runners',   tier:'rebuilds',  batch:'safe',        admin:false, dev:true,  title:'Test-runner browsers (Cypress, Playwright, Puppeteer) - keep newest' },
    { id:4,  key:'avd',       tier:'slow',      batch:'optin',       admin:false, dev:true,  title:'Android emulators (AVDs) idle N+ days' },
    { id:5,  key:'docker',    tier:'rebuilds',  batch:'safe',        admin:false, dev:true,  title:'Docker: dangling images, build cache, unused images older than N days' },
    { id:6,  key:'editors',   tier:'rebuilds',  batch:'safe',        admin:false, dev:false, title:'Editor caches (VS Code, Cursor, Windsurf, Visual Studio) + superseded extensions' },
    { id:7,  key:'browsers',  tier:'rebuilds',  batch:'safe',        admin:false, dev:false, title:'Browser caches (Chrome, Edge, Brave, Vivaldi, Opera, Chromium, Firefox)' },
    { id:8,  key:'apps',      tier:'rebuilds',  batch:'safe',        admin:false, dev:false, title:'Desktop app caches (Discord, Slack, Teams, Zoom, Spotify, Postman, Figma, ...)' },
    { id:9,  key:'wincaches', tier:'rebuilds',  batch:'safe',        admin:false, dev:false, title:'Windows user caches (INetCache, WER, crash dumps, shader caches, UWP temp)' },
    { id:10, key:'temp',      tier:'rebuilds',  batch:'safe',        admin:false, dev:false, title:'User temp files older than N days' },
    { id:11, key:'recycle',   tier:'permanent', batch:'deep',        admin:false, dev:false, title:'Empty the Recycle Bin - PERMANENT' },
    { id:12, key:'wu',        tier:'rebuilds',  batch:'safe',        admin:true,  dev:false, title:'Windows Update + system temp (SoftwareDistribution, Delivery Optimization, Windows\\Temp, CBS logs)' },
    { id:13, key:'cleanmgr',  tier:'rebuilds',  batch:'safe',        admin:true,  dev:false, title:'Windows Disk Cleanup engine (cleanmgr, curated handlers)' },
    { id:14, key:'dism',      tier:'rebuilds',  batch:'optin',       admin:true,  dev:false, title:'Component store cleanup (DISM StartComponentCleanup) - slow' },
    { id:15, key:'hiberfil',  tier:'config',    batch:'deep',        admin:true,  dev:false, title:'Hibernation file (off / reduced)' },
    { id:16, key:'eventlogs', tier:'permanent', batch:'deep',        admin:true,  dev:false, title:'Clear Windows Event Logs - PERMANENT' },
    { id:17, key:'projects',  tier:'rebuilds',  batch:'interactive', admin:false, dev:true,  title:'Stale project build artefacts (node_modules, dist, .next, target, ...)' },
    { id:18, key:'partials',  tier:'recycle',   batch:'interactive', admin:false, dev:false, title:'Partial / orphan downloads -> Recycle Bin' },
    { id:19, key:'large',     tier:'recycle',   batch:'interactive', admin:false, dev:false, title:'Large or old personal files (Downloads and folders you add) -> Recycle Bin' },
    { id:20, key:'vhdx',      tier:'config',    batch:'deep',        admin:true,  dev:true,  title:'Docker Desktop / WSL disk image compaction (stops Docker + WSL)' },
    { id:21, key:'diskusage', tier:'report',    batch:'safe',        admin:false, dev:false, title:'Disk usage report (largest entries, drives, disk images)' },
    { id:22, key:'globals',   tier:'report',    batch:'safe',        admin:false, dev:false, title:'Globally installed packages audit (npm, pnpm, yarn, bun, deno) - report only' },
    { id:23, key:'orphaned',  tier:'recycle',   batch:'interactive', admin:false, dev:false, title:'Orphaned application data under AppData -> Recycle Bin' },
    { id:24, key:'programs',  tier:'report',    batch:'safe',        admin:false, dev:false, title:'Installed programs not modified for N+ days - report only' },
    { id:25, key:'startup',   tier:'report',    batch:'safe',        admin:false, dev:false, title:'Startup items audit (Run keys, Startup folders, logon tasks) - report only' },
    { id:26, key:'uninstall', tier:'permanent', batch:'interactive', admin:false, dev:false, title:'Uninstall programs and Store apps you pick, each with its own uninstaller, then what they left (folders, registry keys, shortcuts, startup entries)' },
    { id:27, key:'leftovers', tier:'recycle', batch:'interactive', admin:true, dev:false, title:'Leftovers of uninstalled programs: folders, registry keys (.reg backup first), Start-menu shortcuts, dead startup entries -> Recycle Bin' },
    { id:28, key:'releases', tier:'rebuilds', batch:'safe', admin:false, dev:false, title:'Superseded tool releases and old downloaded updates (Codex, Electron updaters, Ollama, unrequested Node) - current kept' },
    { id:29, key:'browserai', tier:'config', batch:'deep', admin:true, dev:false, title:'Chrome on-device AI model - set the policy that removes it (Chrome shows "Managed by your organization")' },
    /* 1.5.0 (D110): the only sections that reach the network, through Windows Update or winget,
       and only for rows a person picks. Listing needs no admin. 31 names the PC maker's own driver
       tool and never runs it (A4-15). */
    { id:30, key:'winupdate', tier:'update', batch:'interactive', admin:false, dev:false, title:'Windows updates you pick (security, quality, Defender, malware tool) via Windows Update - never restarts your PC' },
    { id:31, key:'drivers', tier:'update', batch:'interactive', admin:false, dev:false, title:'Driver updates you pick from Windows Update, and old driver packages - never BIOS or firmware' },
    { id:32, key:'appupdates', tier:'update', batch:'interactive', admin:false, dev:false, title:'App updates you pick, one at a time, via winget' }
  ];

  var SAFE_BATCH = [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21, 28];
  var SAFE_BATCH_ADMIN = [12, 13];
  var INTERACTIVE = [17, 18, 19, 23, 26, 27, 30, 31, 32];
  var PROFILES = {
    dev:        [1, 2, 3, 5, 6, 17, 28],
    minimal:    [7, 9, 10],
    'cache-only': [1, 2, 3, 6, 7, 8, 9],
    system:     [9, 10, 12, 13],
    deep:       [11, 14, 15, 16, 20, 29],
    audit:      [0, 21, 22, 24, 25]
  };

  /* -------------------------------------------------------------------------
     TARGETS - what the Reclaim Map draws. One tile per target, sized by bytes.
     Paths are the real ones the engine declares; the byte figures are demo data.
     ------------------------------------------------------------------------- */
  function T(section, label, path, bytes, idle) {
    return { section: section, label: label, path: path, bytes: bytes, idle: idle };
  }

  var TARGETS = [
    T(1,  'npm cache',            '%LOCALAPPDATA%\\npm-cache\\_cacache',                       4.82 * GB, 34),
    T(1,  'yarn berry cache',     '%LOCALAPPDATA%\\Yarn\\Berry\\cache',                        3.16 * GB, 51),
    T(1,  'pnpm store',           '%LOCALAPPDATA%\\pnpm\\store',                               2.41 * GB, 118),
    T(1,  'NuGet packages',       '%USERPROFILE%\\.nuget\\packages',                           1.98 * GB, 143),
    T(1,  'Cargo registry',       '%USERPROFILE%\\.cargo\\registry\\cache',                    1.12 * GB, 201),
    T(1,  'pip cache',            '%LOCALAPPDATA%\\pip\\Cache',                                 892 * MB, 96),
    T(1,  'Go module cache',      '%USERPROFILE%\\go\\pkg\\mod\\cache\\download',                774 * MB, 167),
    T(1,  'Hugging Face hub',     '%USERPROFILE%\\.cache\\huggingface\\hub',                    643 * MB, 128),
    T(1,  'Composer cache',       '%LOCALAPPDATA%\\Composer\\files',                            318 * MB, 220),
    T(2,  'Gradle caches',        '%USERPROFILE%\\.gradle\\caches',                            6.24 * GB, 240),
    T(2,  'Android build cache',  '%LOCALAPPDATA%\\Android\\Sdk\\.temp',                       1.44 * GB, 132),
    T(2,  'Maven repository',     '%USERPROFILE%\\.m2\\repository',                            1.09 * GB, 245),
    T(2,  'JetBrains caches',     '%LOCALAPPDATA%\\JetBrains\\IntelliJIdea2025.2\\caches',      886 * MB, 63),
    T(3,  'Playwright browsers',  '%LOCALAPPDATA%\\ms-playwright',                             2.08 * GB, 88),
    T(3,  'Cypress binaries',     '%LOCALAPPDATA%\\Cypress\\Cache',                            1.31 * GB, 154),
    T(3,  'Puppeteer chromes',    '%USERPROFILE%\\.cache\\puppeteer',                           612 * MB, 173),
    T(5,  'Docker build cache',   'docker builder prune',                                      3.87 * GB, 41),
    T(5,  'Dangling images',      'docker image prune',                                        1.63 * GB, 41),
    T(6,  'VS Code cache',        '%APPDATA%\\Code\\Cache',                                     742 * MB, 12),
    T(6,  'VS Code CachedData',   '%APPDATA%\\Code\\CachedData',                                538 * MB, 12),
    T(6,  'VSIX download cache',  '%APPDATA%\\Code\\CachedExtensionVSIXs',                      291 * MB, 30),
    T(6,  'Cursor cache',         '%APPDATA%\\Cursor\\Cache',                                   417 * MB, 22),
    T(7,  'Chrome cache',         '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Cache',  1.86 * GB, 2),
    T(7,  'Edge cache',           '%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Cache',  934 * MB, 9),
    T(7,  'Chrome Code Cache',    '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Code Cache', 611 * MB, 2),
    T(7,  'Firefox cache2',       '%LOCALAPPDATA%\\Mozilla\\Firefox\\Profiles\\cache2',          388 * MB, 47),
    T(8,  'Discord cache',        '%APPDATA%\\discord\\Cache',                                  721 * MB, 5),
    T(8,  'Slack cache',          '%APPDATA%\\Slack\\Cache',                                    464 * MB, 8),
    T(8,  'Spotify data',         '%LOCALAPPDATA%\\Spotify\\Data',                              402 * MB, 3),
    T(8,  'Postman cache',        '%APPDATA%\\Postman\\Cache',                                  188 * MB, 61),
    T(9,  'INetCache',            '%LOCALAPPDATA%\\Microsoft\\Windows\\INetCache',              827 * MB, 14),
    T(9,  'D3D shader cache',     '%LOCALAPPDATA%\\D3DSCache',                                  486 * MB, 6),
    T(9,  'Windows Error Reports','%LOCALAPPDATA%\\Microsoft\\Windows\\WER',                    237 * MB, 58),
    T(9,  'Crash dumps',          '%LOCALAPPDATA%\\CrashDumps',                                 194 * MB, 91),
    T(10, 'User temp',            '%TEMP%',                                                    2.72 * GB, 4),
    T(21, 'Disk usage report',    'reports\\disk-usage-<stamp>.txt',                                   0, 0),
    T(0,  'Health report',        'reports\\health-<stamp>.txt',                                       0, 0)
  ];

  /* -------------------------------------------------------------------------
     WHAT THE ENGINE'S OWN GATES KEEP BACK, per target (D-61, GATE 4 round 10).

     🔴 THE FACT THIS SEED DID NOT HAVE, AND WITHOUT IT THE DUMMY CANNOT DRAW THE
     DIFFERENCE D-61 IS ABOUT. A `--scan` measures what is ON DISK; a `--dry-run`
     reports what the run WOULD delete, which is less, because the engine holds
     things back that a size on disk cannot see: a file a running program still
     has open, and a temp file newer than `--temp-days`. Round 9 measured browsers
     8.1 GB -> 245 MB and temp 2.8 GB -> 784 MB on a real machine for exactly that
     reason. With no gate but the idle window, this dummy's bound and its estimate
     were one number and the two states were indistinguishable here - which is why
     the ladder could promise a figure the run does not deliver and this prototype
     could not show it.

     🔴 DEVELOPER MODE IS NOT IN THIS TABLE, ON PURPOSE. Its idle gate is already
     modelled, one layer up: `activeTargets()` sets a recently-used dev cache aside
     altogether and `heldByDeveloperMode()` reports it as "Held back right now". A
     second subtraction for the same gate would count it twice. Everything here is
     a gate developer mode does not own.

     `keeps` is demo data like every byte figure in this file, and is clamped to the
     target's own size on read. `gate` is why - the engine's own reason, in the
     words its dry-run log uses.
     ------------------------------------------------------------------------- */
  function G(path, keeps, gate) { return { path: path, keeps: keeps, gate: gate }; }

  var GATED = [
    G('%APPDATA%\\Code\\Cache',                                          742 * MB, 'VS Code is running'),
    G('%APPDATA%\\Code\\CachedData',                                     538 * MB, 'VS Code is running'),
    G('%APPDATA%\\Cursor\\Cache',                                        417 * MB, 'Cursor is running'),
    G('%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Cache',       1.86 * GB, 'Chrome is running'),
    G('%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Code Cache',   611 * MB, 'Chrome is running'),
    G('%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Cache',       934 * MB, 'Edge is running'),
    G('%APPDATA%\\discord\\Cache',                                        721 * MB, 'Discord is running'),
    G('%APPDATA%\\Slack\\Cache',                                          464 * MB, 'Slack is running'),
    G('%LOCALAPPDATA%\\Spotify\\Data',                                    402 * MB, 'Spotify is running'),
    G('%LOCALAPPDATA%\\Microsoft\\Windows\\INetCache',                    780 * MB, 'in use by Explorer'),
    G('%LOCALAPPDATA%\\D3DSCache',                                        486 * MB, 'in use by the display driver'),
    G('%TEMP%',                                                          1.98 * GB, 'newer than the temp window, or open')
  ];

  /* the interactive sections - these need a person, and `--yes` never answers them */
  var CANDIDATES = [
    { section:17, path:'D:\\work\\archived\\legacy-portal\\node_modules',   bytes: 1.42*GB, idle:412, project:'legacy-portal' },
    { section:17, path:'D:\\work\\archived\\vendor-sdk\\target',            bytes: 962*MB,  idle:388, project:'vendor-sdk' },
    { section:17, path:'D:\\work\\spikes\\three-demo\\node_modules',        bytes: 604*MB,  idle:301, project:'three-demo' },
    { section:17, path:'D:\\work\\spikes\\rust-parser\\target',             bytes: 511*MB,  idle:266, project:'rust-parser' },
    { section:18, path:'%USERPROFILE%\\Downloads\\ubuntu-24.04.iso.crdownload', bytes: 2.31*GB, idle:63 },
    { section:18, path:'%USERPROFILE%\\Downloads\\vs_BuildTools.exe.part',  bytes: 118*MB,  idle:147 },
    { section:19, path:'%USERPROFILE%\\Downloads\\Win11_24H2_x64.iso',      bytes: 5.84*GB, idle:284, basis:'modified', root:'Downloads' },
    { section:19, path:'%USERPROFILE%\\Downloads\\camera-export.mov',       bytes: 2.16*GB, idle:12,  basis:'modified', root:'Downloads' },
    { section:19, path:'%USERPROFILE%\\Downloads\\old-receipt.txt',         bytes: 48*1024, idle:421, basis:'modified', root:'Downloads' },
    { section:19, path:'%USERPROFILE%\\Downloads\\private-key-backup.txt', bytes: 96*1024, idle:602, basis:'modified', root:'Downloads', protected:'Credential file' },
    { section:19, path:'D:\\Archive\\camera-2019.zip',                     bytes: 3.10*GB, idle:803, basis:'modified', root:'D:\\Archive' },
    { section:19, path:'D:\\Media\\raw-footage.mov',                       bytes: 8.42*GB, idle:8,   basis:'modified', root:'D:\\Media' },
    { section:23, path:'%APPDATA%\\OldVendorTool',                          bytes: 214*MB,  idle:503 },
    { section:23, path:'%LOCALAPPDATA%\\DiscontinuedIDE',                   bytes: 688*MB,  idle:441 },
    /* 26 (1.5.0, D109): one list of three kinds. The Store rows, their appx: paths and sizes
       are this PC's own (the P52, read 2026-11-13); the desktop and broken rows are demo data,
       and `ran` (days since Windows last saw it start, -1 = no record) is demo data on every
       row. Windows tells only an elevated window, so `ran` shows only with ?elevated=1. */
    { section:26, kind:'desktop', label:'Legacy Editor', path:'HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\LegacyEditor', bytes: 810*MB, idle:-1, ran:233 },
    { section:26, kind:'desktop', label:'Old Tool', path:'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\OldTool', bytes: 320*MB, idle:-1, ran:412 },
    { section:26, kind:'store', label:'Skype', path:'appx:Microsoft.SkypeApp_15.150.3125.0_x64__kzf8qxf38zg5c', bytes: 334432883, idle:-1, ran:702 },
    { section:26, kind:'store', label:'Mail and Calendar', path:'appx:microsoft.windowscommunicationsapps_16005.14326.22342.0_x64__8wekyb3d8bbwe', bytes: 216695639, idle:-1, ran:96 },
    { section:26, kind:'store', label:'Microsoft Solitaire Collection', path:'appx:Microsoft.MicrosoftSolitaireCollection_4.27.9181.0_x64__8wekyb3d8bbwe', bytes: 79516493, idle:-1, ran:388 },
    { section:26, kind:'store', label:'Paint 3D', path:'appx:Microsoft.MSPaint_6.1907.29027.0_x64__8wekyb3d8bbwe', bytes: 61867093, idle:-1, ran:-1 },
    { section:26, kind:'store', label:'Xbox Console Companion', path:'appx:Microsoft.XboxApp_48.104.4001.0_x64__8wekyb3d8bbwe', bytes: 11711634, idle:-1, ran:-1 },
    { section:26, kind:'store', label:'Pinterest', path:'appx:1424566A.147190DF3DE79_1.1.1.0_neutral__5byw4zywtsh80', bytes: 1884414, idle:-1, ran:-1 },
    { section:26, kind:'store', label:'Cortana', path:'appx:Microsoft.549981C3F5F10_4.2308.1005.0_x64__8wekyb3d8bbwe', bytes: 1633342, idle:-1, ran:-1 },
    { section:26, kind:'store', label:'Facebook', path:'appx:FACEBOOK.FACEBOOK_2023.531.1.0_x64__8xx8rvfyw5nnt', bytes: 909663, idle:-1, ran:-1 },
    { section:26, kind:'broken', label:'Android Studio', path:'HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Android Studio', missing:'C:\\Program Files\\Android\\Android Studio\\uninstall.exe', bytes: 0, idle:-1, ran:-1 },
    /* 27 (1.5.0): five kinds. Folders and shortcuts go to the Recycle Bin; registry keys and
       startup entries go to a .reg file first (lib/registry.ps1), scheduled tasks to XML. */
    { section:27, kind:'folder', path:'C:\\Program Files\\Old Tool', bytes: 147*MB, idle:390 },
    { section:27, kind:'folder', path:'C:\\ProgramData\\LegacyEditor', bytes: 64*MB, idle:201 },
    { section:27, kind:'shortcut', path:'%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Old Tool\\Old Tool.lnk', bytes: 2*1024, idle:390 },
    { section:27, kind:'registry', path:'HKEY_CURRENT_USER\\Software\\Old Tool', bytes: 0, idle:-1 },
    { section:27, kind:'startup', path:'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\LegacyEditorTray', target:'C:\\Program Files\\Legacy Editor\\tray.exe', bytes: 0, idle:-1 },
    { section:27, kind:'task', path:'\\LegacyEditor\\Update check', bytes: 0, idle:-1 },
    /* 30-32 (1.5.0, D110): the install mode. `verb` is what the row does, `download` is what
       the fetching tool reports (null = size unknown), and `bytes` stays what the row RECLAIMS,
       so an install row is 0 and can never reach a reclaim total. `admin`: installing it needs
       Windows' permission. 30's titles and sizes and 32's names and versions are this PC's own
       on 2026-11-13; MSRT's category, 32's admin flags (installer scope) and all of 31 are demo. */
    { section:30, verb:'install', path:'KB5131096', label:'2026-11 Cumulative Update for Windows 10 Version 22H2 for x64-based Systems (KB5131096)', category:'Security Updates', download:null, admin:true, bytes:0 },
    { section:30, verb:'install', path:'KB890830', label:'Windows Malicious Software Removal Tool x64 - v5.147 (KB890830)', category:'Update Rollups', download: 87*MB, admin:true, bytes:0 },
    { section:31, verb:'install', path:'wu-driver:Intel Corporation - Display - 31.0.101.2135', label:'Intel Corporation - Display - 31.0.101.2135', detail:'Display adapters', download: 448*MB, admin:true, bytes:0 },
    { section:31, verb:'install', path:'wu-driver:Realtek Semiconductor Corp. - MEDIA - 6.0.9549.1', label:'Realtek Semiconductor Corp. - MEDIA - 6.0.9549.1', detail:'Sound, video and game controllers', download: 21*MB, admin:true, bytes:0 },
    { section:31, verb:'remove', path:'oem42.inf', label:'NVIDIA display driver 27.21.14.5671', detail:'oem42.inf \u00b7 9 Aug 2021', admin:true, bytes: 1.12*GB },
    { section:31, verb:'remove', path:'oem57.inf', label:'NVIDIA display driver 30.0.14.7212', detail:'oem57.inf \u00b7 14 Mar 2022', admin:true, bytes: 1.19*GB },
    { section:31, verb:'remove', path:'oem17.inf', label:'Intel Wireless-AC 9560 22.80.1.1', detail:'oem17.inf \u00b7 19 Oct 2021', admin:true, bytes: 38*MB },
    { section:32, verb:'install', path:'Git.Git', label:'Git', from:'2.54.0', to:'2.56.0.4', source:'winget', download:null, admin:true, bytes:0 },
    { section:32, verb:'install', path:'GitHub.cli', label:'GitHub CLI', from:'2.95.0', to:'2.104.0', source:'winget', download:null, admin:true, bytes:0 },
    { section:32, verb:'install', path:'Oracle.JDK.21', label:'Java SE Development Kit', from:'21.0.10', to:'21.0.12', source:'winget', download:null, admin:true, bytes:0 },
    { section:32, verb:'install', path:'Gyan.FFmpeg', label:'FFmpeg', from:'8.1.1', to:'9.0.2', source:'winget', download:null, admin:false, bytes:0 },
    { section:32, verb:'install', path:'RARLab.WinRAR', label:'WinRAR', from:'6.00', to:'7.23.0', source:'winget', download:null, admin:true, bytes:0 },
    { section:32, verb:'install', path:'SlackTechnologies.Slack', label:'Slack', from:'4.51.180.0', to:'4.53.287', source:'winget', download:null, admin:false, running:true, bytes:0 },
    { section:32, verb:'install', path:'XPDM1ZW6815MQM', label:'VLC media player', from:'3.0.16', to:'3.0.23', source:'msstore', download:null, admin:false, bytes:0 },
    { section:32, verb:'install', path:'Microsoft.WindowsTerminal', label:'Windows Terminal', from:'1.24.12741.0', to:'1.25.3131.0', source:'winget', download:null, admin:false, bytes:0 }
  ];

  /* 31's two report blocks - listed for reading, never offered (demo data). */
  var DRIVER_REPORT = {
    problems: [
      { name:'PCI Data Acquisition and Signal Processing Controller', detail:'Code 28 \u00b7 The drivers for this device are not installed.' },
      { name:'Unknown USB Device (Device Descriptor Request Failed)', detail:'Code 43 \u00b7 Windows has stopped this device because it has reported problems.' }
    ],
    oldest: [
      { name:'Synaptics SMBus Driver', detail:'19.0.12.98 \u00b7 26 Mar 2018' },
      { name:'Intel Management Engine Interface', detail:'1918.12.0.1274 \u00b7 30 Apr 2019' },
      { name:'Realtek PCIE CardReader', detail:'10.0.17134.31248 \u00b7 14 Oct 2019' }
    ]
  };

  /* the protected list only ever grows - these are refused regardless of flags */
  var PROTECTED = [
    '%USERPROFILE%\\.ssh', '%USERPROFILE%\\.gnupg', '%USERPROFILE%\\.aws',
    '%USERPROFILE%\\.kube', '%USERPROFILE%\\.docker\\config.json',
    '%APPDATA%\\Microsoft\\Crypto', '%APPDATA%\\Microsoft\\Protect',
    '%USERPROFILE%\\Documents', '%USERPROFILE%\\Desktop', '%USERPROFILE%\\Pictures',
    '%USERPROFILE%\\.claude', '%USERPROFILE%\\.config', '%LOCALAPPDATA%\\Microsoft\\Credentials',
    'C:\\nvm4w', 'C:\\Windows\\System32', 'C:\\Program Files', '%USERPROFILE%\\.gitconfig',
    '%APPDATA%\\Mozilla\\Firefox\\Profiles\\*.default', '%USERPROFILE%\\OneDrive',
    'C:\\Windows\\Installer', 'C:\\$WinREAgent', 'C:\\Windows.old'
  ];

  /* GATE 4 round 8, D-52: the engine's OWN category sentences, verbatim - the constant
     WS_PROTECT_CATEGORIES (lib/constants.ps1:33), which --list-targets prints and
     --list --json publishes as protected.categories. Not seed: the window prints the
     engine's words, so this dummy draws the same words rather than inventing a copy. */
  var PROTECT_CATEGORIES = [
    'every drive root, Windows, System32, Program Files, ProgramData, the user profile root and AppData roots',
    'browser profile data (Local Storage, IndexedDB, cookies, history, bookmarks, extensions, PWA CacheStorage)',
    'editor user data (settings, globalStorage, local History); UWP LocalState; toolchains (nvm, npm globals, corepack, ...)',
    'NTUSER.DAT, UsrClass.dat, hiberfil/pagefile/swapfile (only powercfg touches hiberfil), Prefetch, Windows\\Installer, WinSxS (DISM only)'
  ];

  var DRIVES = [
    { letter:'C:', total: 272.9*GB, free: 21.0*GB,  reclaimable: 28.4*GB },
    { letter:'D:', total: 203.4*GB, free: 55.8*GB,  reclaimable: 12.9*GB },
    { letter:'E:', total: 476.4*GB, free: 188.8*GB, reclaimable:  1.4*GB }
  ];

  /* last eight runs - relative to today, so the prototype never looks stale */
  function daysAgo(n) { var d = new Date(); d.setDate(d.getDate() - n); return d; }
  var RUNS = [
    { at: daysAgo(31), freed: 18.2*GB, sections: 11, mode:'safe batch' },
    { at: daysAgo(24), freed:  6.1*GB, sections: 11, mode:'safe batch' },
    { at: daysAgo(18), freed:  9.7*GB, sections:  7, mode:'profile: dev' },
    { at: daysAgo(14), freed:  2.4*GB, sections:  4, mode:'profile: minimal' },
    { at: daysAgo(10), freed: 13.9*GB, sections: 11, mode:'safe batch' },
    { at: daysAgo(6),  freed:  4.8*GB, sections:  6, mode:'sections 1, 2, 3, 6, 7, 8' },
    { at: daysAgo(3),  freed:  7.2*GB, sections: 11, mode:'safe batch' },
    { at: daysAgo(1),  freed:  3.3*GB, sections:  5, mode:'sections 1, 2, 3, 5, 6' }
  ];

  var GLOBALS = [
    { name:'@angular/cli',  version:'19.2.4', bytes: 62*MB,  idle:341, verdict:'candidate' },
    { name:'gulp-cli',      version:'3.0.0',  bytes: 14*MB,  idle:520, verdict:'candidate' },
    { name:'typescript',    version:'6.0.3',  bytes: 38*MB,  idle:2,   verdict:'kept' },
    { name:'windowsweep',   version:'1.1.0',  bytes: 372*1024, idle:0, verdict:'kept' }
  ];

  window.wsSeed = {
    GB: GB, MB: MB,
    TIERS: TIERS, SECTIONS: SECTIONS, TARGETS: TARGETS, GATED: GATED, CANDIDATES: CANDIDATES,
    PROTECTED: PROTECTED, PROTECT_CATEGORIES: PROTECT_CATEGORIES, DRIVES: DRIVES, RUNS: RUNS, GLOBALS: GLOBALS,
    SAFE_BATCH: SAFE_BATCH, SAFE_BATCH_ADMIN: SAFE_BATCH_ADMIN,
    INTERACTIVE: INTERACTIVE, PROFILES: PROFILES, DRIVER_REPORT: DRIVER_REPORT,
    ENGINE_VERSION: '1.5.0', APP_VERSION: '1.5.0-design'
  };
})();
