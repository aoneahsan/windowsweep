/* ============================================================================
   windowsweep desktop dummy - the deterministic demo dataset

   🔴 EVERY section id, key, title, tier, batch policy, admin flag and dev flag
   below is transcribed from the real catalogue in lib/constants.ps1 (v1.1.0).
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
    { key: 'permanent', label: 'permanent', rank: 5, blurb: 'gone for good' }
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
    { id:19, key:'large',     tier:'recycle',   batch:'interactive', admin:false, dev:false, title:'Large stale personal files (Downloads) -> Recycle Bin' },
    { id:20, key:'vhdx',      tier:'config',    batch:'deep',        admin:true,  dev:true,  title:'Docker Desktop / WSL disk image compaction (stops Docker + WSL)' },
    { id:21, key:'diskusage', tier:'report',    batch:'safe',        admin:false, dev:false, title:'Disk usage report (largest entries, drives, disk images)' },
    { id:22, key:'globals',   tier:'report',    batch:'safe',        admin:false, dev:true,  title:'Globally installed packages audit (npm, pnpm, yarn, bun, deno) - report only' },
    { id:23, key:'orphaned',  tier:'recycle',   batch:'interactive', admin:false, dev:false, title:'Orphaned application data under AppData -> Recycle Bin' },
    { id:24, key:'programs',  tier:'report',    batch:'safe',        admin:false, dev:false, title:'Installed programs not modified for N+ days - report only' },
    { id:25, key:'startup',   tier:'report',    batch:'safe',        admin:false, dev:false, title:'Startup items audit (Run keys, Startup folders, logon tasks) - report only' }
  ];

  var SAFE_BATCH = [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21];
  var SAFE_BATCH_ADMIN = [12, 13];
  var INTERACTIVE = [17, 18, 19, 23];
  var PROFILES = {
    dev:        [1, 2, 3, 5, 6, 17],
    minimal:    [7, 9, 10],
    'cache-only': [1, 2, 3, 6, 7, 8, 9],
    system:     [9, 10, 12, 13],
    deep:       [11, 14, 15, 16, 20],
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

  /* the interactive sections - these need a person, and `--yes` never answers them */
  var CANDIDATES = [
    { section:17, path:'D:\\work\\archived\\legacy-portal\\node_modules',   bytes: 1.42*GB, idle:412, project:'legacy-portal' },
    { section:17, path:'D:\\work\\archived\\vendor-sdk\\target',            bytes: 962*MB,  idle:388, project:'vendor-sdk' },
    { section:17, path:'D:\\work\\spikes\\three-demo\\node_modules',        bytes: 604*MB,  idle:301, project:'three-demo' },
    { section:17, path:'D:\\work\\spikes\\rust-parser\\target',             bytes: 511*MB,  idle:266, project:'rust-parser' },
    { section:18, path:'%USERPROFILE%\\Downloads\\ubuntu-24.04.iso.crdownload', bytes: 2.31*GB, idle:63 },
    { section:18, path:'%USERPROFILE%\\Downloads\\vs_BuildTools.exe.part',  bytes: 118*MB,  idle:147 },
    { section:19, path:'%USERPROFILE%\\Downloads\\Win11_24H2_x64.iso',      bytes: 5.84*GB, idle:284 },
    { section:19, path:'%USERPROFILE%\\Downloads\\dataset-2025-archive.zip',bytes: 3.10*GB, idle:196 },
    { section:23, path:'%APPDATA%\\OldVendorTool',                          bytes: 214*MB,  idle:503 },
    { section:23, path:'%LOCALAPPDATA%\\DiscontinuedIDE',                   bytes: 688*MB,  idle:441 }
  ];

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

  var DRIVES = [
    { letter:'C:', total: 272.9*GB, free: 21.0*GB,  reclaimable: 28.4*GB },
    { letter:'D:', total: 203.4*GB, free: 55.8*GB,  reclaimable: 12.9*GB },
    { letter:'E:', total: 476.4*GB, free: 188.8*GB, reclaimable:  1.4*GB }
  ];

  /* last eight runs - relative to today, so the prototype never looks stale */
  function daysAgo(n) { var d = new Date(); d.setDate(d.getDate() - n); return d; }
  var RUNS = [
    { at: daysAgo(31), freed: 18.2*GB, sections: 11, mode:'full sweep' },
    { at: daysAgo(24), freed:  6.1*GB, sections: 11, mode:'full sweep' },
    { at: daysAgo(18), freed:  9.7*GB, sections:  7, mode:'developer caches' },
    { at: daysAgo(14), freed:  2.4*GB, sections:  4, mode:'browsers and temp' },
    { at: daysAgo(10), freed: 13.9*GB, sections: 11, mode:'full sweep' },
    { at: daysAgo(6),  freed:  4.8*GB, sections:  6, mode:'caches only' },
    { at: daysAgo(3),  freed:  7.2*GB, sections: 11, mode:'full sweep' },
    { at: daysAgo(1),  freed:  3.3*GB, sections:  5, mode:'packages and editors' }
  ];

  var GLOBALS = [
    { name:'@angular/cli',  version:'19.2.4', bytes: 62*MB,  idle:341, verdict:'candidate' },
    { name:'gulp-cli',      version:'3.0.0',  bytes: 14*MB,  idle:520, verdict:'candidate' },
    { name:'typescript',    version:'6.0.3',  bytes: 38*MB,  idle:2,   verdict:'kept' },
    { name:'windowsweep',   version:'1.1.0',  bytes: 372*1024, idle:0, verdict:'kept' }
  ];

  window.wsSeed = {
    GB: GB, MB: MB,
    TIERS: TIERS, SECTIONS: SECTIONS, TARGETS: TARGETS, CANDIDATES: CANDIDATES,
    PROTECTED: PROTECTED, DRIVES: DRIVES, RUNS: RUNS, GLOBALS: GLOBALS,
    SAFE_BATCH: SAFE_BATCH, SAFE_BATCH_ADMIN: SAFE_BATCH_ADMIN,
    INTERACTIVE: INTERACTIVE, PROFILES: PROFILES,
    ENGINE_VERSION: '1.1.0', APP_VERSION: '0.1.0-design'
  };
})();
