/**
 * Every place windowsweep is released, as the desktop app lists them (Settings → About → "Get windowsweep";
 * standard aoneahsan-cccs-platform-links, owner request 2026-11-20). The website's own module
 * (windowsweep-web/src/config/platforms.ts) carries the same four; links open in the system browser.
 */
export type PlatformId = 'desktop' | 'npm' | 'web' | 'docs';

export interface Platform {
  readonly id: PlatformId;
  readonly href: string;
  readonly verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {
    id: 'desktop',
    href: 'https://github.com/aoneahsan/windowsweep/releases/latest/download/windowsweep-setup.exe',
    verified: '2026-11-20',
  },
  { id: 'npm', href: 'https://www.npmjs.com/package/windowsweep', verified: '2026-11-20' },
  { id: 'web', href: 'https://windowsweep.aoneahsan.com', verified: '2026-11-20' },
  { id: 'docs', href: 'https://windowsweep-docs.aoneahsan.com', verified: '2026-11-20' },
];

/** This bundle is the desktop app: its row reads "You're using it". */
export const CURRENT_SURFACE: PlatformId = 'desktop';
/** The website page that lists every place. */
export const APPS_URL = 'https://windowsweep.aoneahsan.com/apps';
