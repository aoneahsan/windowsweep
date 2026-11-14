/**
 * The rows the DEVELOPMENT-ONLY stand-in (`dev-engine.ts`) offers when a section is asked.
 *
 * 🔴 Reached only through `dev-engine.ts`, which only `engine.ts` -> `devEngine()` imports, and only
 * dynamically behind `import.meta.env.DEV` - so none of this is in a production bundle. Import it
 * from nowhere else: a static import from any other module would put every row below into `dist/`.
 *
 * 🔴 The FIGURES are the click dummy's own seed (`seed.js` CANDIDATES and DRIVER_REPORT, 1.5.0),
 * because this fixture exists to make a parity capture possible and a capture is only meaningful
 * against the page it is compared with. The SHAPE is the engine's `--json`, field for field
 * (`Add-JsonCandidate -Extra` in `modules/uninstall.ps1`, `leftovers_more.ps1`, `updates_*.ps1`):
 * 26 says `kind` and `ran`, 27's extra rows say `kind`, 30 and 31 put the DOWNLOAD size in `bytes`
 * while an old driver package puts the space it frees there, and 32 sends 0. Three fields the
 * 1.5.0 engine does not emit yet are seeded so the screens can be judged with them - `uninstaller`
 * (26 broken), `target` (27 startup) and `running` (32) - and so is `driver_report`.
 *
 * Two figures follow the dummy where the engine differs, on purpose and only here: 27's shortcut
 * carries an idle age (the engine sends none for its extra rows), and 32's `needs_admin` follows the
 * dummy's installer-scope demo flags (the engine sends `false` for every 32 row). Section 26's list
 * is unelevated, as the window's own ask is: every `ran` is `-`.
 */

import type { DriverReport } from './cli';

const MB = 1024 ** 2;
const GB = 1024 ** 3;
const UNINSTALL_KEY = 'Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall';

/** A raw `candidates[]` entry, as the engine writes one. */
type RawCandidate = Record<string, string | number | boolean | null>;

function rows(section: number, list: RawCandidate[]): RawCandidate[] {
  return list.map((row, i) => ({ section, index: i + 1, idle_days: -1, project: '', ...row }));
}

/** Section 26 - one list of three kinds (D109). Store rows are the dummy's (read on the P52). */
const PROGRAMS = rows(26, [
  {
    path: `HKEY_LOCAL_MACHINE\\${UNINSTALL_KEY}\\LegacyEditor`,
    label: 'Legacy Editor',
    bytes: 810 * MB,
    kind: 'desktop',
    strategy: 'exe',
    needs_admin: true,
    ran: '-',
  },
  {
    path: `HKEY_CURRENT_USER\\${UNINSTALL_KEY}\\OldTool`,
    label: 'Old Tool',
    bytes: 320 * MB,
    kind: 'desktop',
    strategy: 'msi',
    needs_admin: false,
    ran: '-',
  },
  ...(
    [
      ['Skype', 'Microsoft.SkypeApp_15.150.3125.0_x64__kzf8qxf38zg5c', 334432883],
      [
        'Mail and Calendar',
        'microsoft.windowscommunicationsapps_16005.14326.22342.0_x64__8wekyb3d8bbwe',
        216695639,
      ],
      [
        'Microsoft Solitaire Collection',
        'Microsoft.MicrosoftSolitaireCollection_4.27.9181.0_x64__8wekyb3d8bbwe',
        79516493,
      ],
      ['Paint 3D', 'Microsoft.MSPaint_6.1907.29027.0_x64__8wekyb3d8bbwe', 61867093],
      ['Xbox Console Companion', 'Microsoft.XboxApp_48.104.4001.0_x64__8wekyb3d8bbwe', 11711634],
      ['Pinterest', '1424566A.147190DF3DE79_1.1.1.0_neutral__5byw4zywtsh80', 1884414],
      ['Cortana', 'Microsoft.549981C3F5F10_4.2308.1005.0_x64__8wekyb3d8bbwe', 1633342],
      ['Facebook', 'FACEBOOK.FACEBOOK_2023.531.1.0_x64__8xx8rvfyw5nnt', 909663],
    ] as const
  ).map(([label, pkg, bytes]) => ({
    path: `appx:${pkg}`,
    label,
    bytes,
    kind: 'store',
    strategy: 'store',
    needs_admin: false,
    ran: '-',
  })),
  {
    path: `HKEY_LOCAL_MACHINE\\${UNINSTALL_KEY}\\Android Studio`,
    label: 'Android Studio',
    bytes: 0,
    kind: 'broken',
    strategy: 'clear entry',
    needs_admin: true,
    ran: '-',
    uninstaller: 'C:\\Program Files\\Android\\Android Studio\\uninstall.exe',
  },
]);

/** Section 27 - five kinds. A folder row carries no `kind`, as `modules/leftovers.ps1` sends it. */
const LEFTOVERS = rows(27, [
  { path: 'C:\\Program Files\\Old Tool', label: 'Old Tool', bytes: 147 * MB, idle_days: 390 },
  { path: 'C:\\ProgramData\\LegacyEditor', label: 'LegacyEditor', bytes: 64 * MB, idle_days: 201 },
  {
    path: '%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Old Tool\\Old Tool.lnk',
    label: 'Start-menu shortcut Old Tool',
    bytes: 2 * 1024,
    idle_days: 390,
    kind: 'shortcut',
    needs_admin: false,
  },
  {
    path: 'HKEY_CURRENT_USER\\Software\\Old Tool',
    label: 'registry key Old Tool',
    bytes: 0,
    kind: 'registry',
    needs_admin: false,
  },
  {
    path: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run::LegacyEditorTray',
    label: "startup entry 'LegacyEditorTray'",
    bytes: 0,
    kind: 'startup',
    needs_admin: false,
    target: 'C:\\Program Files\\Legacy Editor\\tray.exe',
  },
  {
    path: 'task:\\LegacyEditor\\Update check',
    label: 'scheduled task \\LegacyEditor\\Update check',
    bytes: 0,
    kind: 'task',
    needs_admin: true,
  },
]);

/** Section 30 - `bytes` is the download size, 0 when Windows Update reports none. */
const WINDOWS_UPDATES = rows(30, [
  {
    path: 'wu:00000000-0000-4000-8000-000005131096',
    label:
      '2026-11 Cumulative Update for Windows 10 Version 22H2 for x64-based Systems (KB5131096)',
    bytes: 0,
    kind: 'windows-update',
    kb: 'KB5131096',
    category: 'Security Updates',
    severity: 'Critical',
    reboot_likely: true,
    needs_admin: true,
  },
  {
    path: 'wu:00000000-0000-4000-8000-000000890830',
    label: 'Windows Malicious Software Removal Tool x64 - v5.147 (KB890830)',
    bytes: 87 * MB,
    kind: 'windows-update',
    kb: 'KB890830',
    category: 'Update Rollups',
    severity: '',
    reboot_likely: false,
    needs_admin: true,
  },
]);

/** Section 31 - two driver installs and three old packages; no maker's tool is ever a row (A4-15). */
const DRIVERS = rows(31, [
  {
    path: 'wu:00000000-0000-4000-8000-000031010121',
    label: 'Intel Corporation - Display - 31.0.101.2135',
    bytes: 448 * MB,
    kind: 'driver-update',
    driver_class: 'Display adapters',
    driver_provider: 'Intel Corporation',
    driver_date: '',
    optional: false,
    needs_admin: true,
  },
  {
    path: 'wu:00000000-0000-4000-8000-000006095491',
    label: 'Realtek Semiconductor Corp. - MEDIA - 6.0.9549.1',
    bytes: 21 * MB,
    kind: 'driver-update',
    driver_class: 'Sound, video and game controllers',
    driver_provider: 'Realtek Semiconductor Corp.',
    driver_date: '',
    optional: false,
    needs_admin: true,
  },
  ...(
    [
      [
        'oem42.inf',
        'NVIDIA display driver 27.21.14.5671',
        1.12 * GB,
        'NVIDIA',
        'Display',
        '27.21.14.5671',
        '2021-08-09',
      ],
      [
        'oem57.inf',
        'NVIDIA display driver 30.0.14.7212',
        1.19 * GB,
        'NVIDIA',
        'Display',
        '30.0.14.7212',
        '2022-03-14',
      ],
      [
        'oem17.inf',
        'Intel Wireless-AC 9560 22.80.1.1',
        38 * MB,
        'Intel',
        'Net',
        '22.80.1.1',
        '2021-10-19',
      ],
    ] as const
  ).map(([inf, label, bytes, provider, cls, version, date]) => ({
    path: `oem:${inf}`,
    label,
    bytes: Math.round(bytes),
    kind: 'driver-package',
    provider,
    class: cls,
    version,
    date,
    needs_admin: true,
  })),
]);

/** Section 32 - winget reports no size, so `bytes` is 0 on every row. */
const APP_UPDATES = rows(
  32,
  (
    [
      ['Git.Git', 'Git', '2.54.0', '2.56.0.4', 'winget', true],
      ['GitHub.cli', 'GitHub CLI', '2.95.0', '2.104.0', 'winget', true],
      ['Oracle.JDK.21', 'Java SE Development Kit', '21.0.10', '21.0.12', 'winget', true],
      ['Gyan.FFmpeg', 'FFmpeg', '8.1.1', '9.0.2', 'winget', false],
      ['RARLab.WinRAR', 'WinRAR', '6.00', '7.23.0', 'winget', true],
      ['SlackTechnologies.Slack', 'Slack', '4.51.180.0', '4.53.287', 'winget', false],
      ['XPDM1ZW6815MQM', 'VLC media player', '3.0.16', '3.0.23', 'msstore', false],
      [
        'Microsoft.WindowsTerminal',
        'Windows Terminal',
        '1.24.12741.0',
        '1.25.3131.0',
        'winget',
        false,
      ],
    ] as const
  ).map(([id, label, version, available, source, admin]) => ({
    path: `winget:${id}`,
    label,
    bytes: 0,
    kind: 'app-update',
    id,
    version,
    available,
    source,
    needs_admin: admin,
    ...(id === 'SlackTechnologies.Slack' ? { running: true } : {}),
  }))
);

/** What each interactive section offers in the stand-in, beside the 17-23 rows `dev-engine.ts` keeps. */
export const DEV_UPDATE_CANDIDATES: readonly RawCandidate[] = [
  ...PROGRAMS,
  ...LEFTOVERS,
  ...WINDOWS_UPDATES,
  ...DRIVERS,
  ...APP_UPDATES,
];

/** Section 31's report blocks, as the dummy seeds them (`seed.js` DRIVER_REPORT). */
export const DEV_DRIVER_REPORT: DriverReport = {
  problems: [
    {
      name: 'PCI Data Acquisition and Signal Processing Controller',
      code: 28,
      problem: 'The drivers for this device are not installed.',
    },
    {
      name: 'Unknown USB Device (Device Descriptor Request Failed)',
      code: 43,
      problem: 'Windows has stopped this device because it has reported problems.',
    },
  ],
  oldest: [
    {
      device: 'Synaptics SMBus Driver',
      provider: 'Synaptics',
      version: '19.0.12.98',
      date: '2018-03-26',
    },
    {
      device: 'Intel Management Engine Interface',
      provider: 'Intel',
      version: '1918.12.0.1274',
      date: '2019-04-30',
    },
    {
      device: 'Realtek PCIE CardReader',
      provider: 'Realtek',
      version: '10.0.17134.31248',
      date: '2019-10-14',
    },
  ],
};
