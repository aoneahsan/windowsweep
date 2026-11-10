/**
 * The ecosystem roster, and the two layers that keep this app out of its own list.
 *
 * 🔴 VENDORED, never hand-written. The single source of truth is the fleet roster
 * at `~/.claude/rules/ecosystem-products.json`, which says so itself: "never copy a
 * product's details into a project by hand; vendor this file with its provenance".
 * Re-vendored 2026-11-10 from that file at notebook 7180f5bc (`lastUpdated: 2026-11-10`), 16
 * products; the first vendoring, 2026-09-08, added the three sibling tools to the fleet
 * roster rather than hand-writing them here. Each row is `id`, `name`, the roster's own
 * `tagline` and its `primaryUrl` - nothing invented here.
 *
 * 🔴 A PROJECT NEVER ADVERTISES ITSELF, and it is TWO layers or it is not done:
 *   LAYER 1  the vendoring drop  - this project's id leaves the roster as it is taken in
 *   LAYER 2  the display resolver - the id is dropped again at render time
 * Each is proved by removing the other. `promoAudit()` below is that proof.
 *
 * 🔴 `ROSTER_SOURCE` deliberately KEEPS the `windowsweep` row. The click dummy's
 * own ledger records why: both layers were no-ops until 2026-09-05 because the
 * array simply never contained the id, so removing either filter changed the
 * rendered list not at all and the "prove each with the other removed" check
 * passed in both directions while proving nothing. A filter that cannot match is
 * indistinguishable from a filter that works. Physically deleting the row here
 * would reintroduce exactly that, which is why the drop is a filter and not an
 * edit. (`design/CLICK-DUMMY-INVENTORY-ledger.md` section 5.)
 *
 * 🔴 THESE ARE THE ONLY ADS, and there is no advertising network. Several of this
 * product's own surfaces promise none, so adding one would make them lies - it is
 * a later owner decision and not a code change alone.
 */

export interface EcosystemProduct {
  id: string;
  name: string;
  /** The roster's own one-line tagline. Not this project's words to rewrite. */
  tagline: string;
  /** The roster's `primaryUrl`: the page a press opens in the system browser. */
  url: string;
}

/** This project's own id, as the fleet roster spells it. */
export const SELF_ID = 'windowsweep';

/** The roster exactly as vendored - every product, this one included. */
export const ROSTER_SOURCE: readonly EcosystemProduct[] = [
  {
    id: 'video-controls-plus',
    name: 'Video Controls Plus',
    tagline: 'Take complete control of any HTML5 video.',
    url: 'https://chromewebstore.google.com/detail/video-controls-plus/ihafdbecgnhendhckoknblmcminoikdb',
  },
  {
    id: 'ztools',
    name: 'ZTools',
    tagline: 'A toolbox of developer and creator utilities, one click away.',
    url: 'https://ztools.zaions.com',
  },
  {
    id: 'clearhire',
    name: 'ClearHire',
    tagline: 'Build a sharper resume and get discovered.',
    url: 'https://clearhire.aoneahsan.com',
  },
  {
    id: 'lifewell',
    name: 'LifeWell',
    tagline: 'Track your health, your way.',
    url: 'https://lifewell.aoneahsan.com',
  },
  {
    id: 'labflow',
    name: 'LabFlow',
    tagline: 'Run your diagnostic lab end to end.',
    url: 'https://labflow.aoneahsan.com',
  },
  {
    id: 'pregnancy-pal',
    name: 'PregnancyPal',
    tagline: 'A calm companion through every week.',
    url: 'https://pregnancypal.aoneahsan.com',
  },
  {
    id: 'sms-mobile-app',
    name: 'SMS App',
    tagline: 'Send SMS at scale from your own Android device.',
    url: 'https://smsapp.aoneahsan.com',
  },
  {
    id: 'native-update',
    name: 'Native Update',
    tagline: 'Ship Capacitor app updates without the store wait.',
    url: 'https://nativeupdate.aoneahsan.com',
  },
  {
    id: 'aoneahsan-portfolio',
    name: 'Meet the Developer',
    tagline: 'The developer behind these tools.',
    url: 'https://aoneahsan.com',
  },
  {
    id: 'files-hub',
    name: 'FilesHub',
    tagline: 'File storage and 70+ developer utilities behind one API key.',
    url: 'https://fileshub.zaions.com',
  },
  {
    id: 'habitforge',
    name: 'HabitForge',
    tagline: 'Turns consistency into a rope you can see.',
    url: 'https://habitforge.aoneahsan.com',
  },
  {
    id: 'trizlink',
    name: 'Trizlink',
    tagline: 'Short links, link-in-bio and click analytics.',
    url: 'https://trizlink.com',
  },
  {
    id: 'windowsweep',
    name: 'windowsweep',
    tagline:
      'Windows cleanup CLI: dry-run first, personal files chosen row by row, zero install via npx.',
    url: 'https://windowsweep.aoneahsan.com',
  },
  {
    id: 'linux-cleanup',
    name: 'linux-cleanup',
    tagline: 'Safe, developer-aware Linux disk and cache cleanup.',
    url: 'https://github.com/aoneahsan/linux-cleanup',
  },
  {
    id: 'macleanup',
    name: 'macleanup',
    tagline: 'Safe-by-default macOS cleanup and maintenance.',
    url: 'https://github.com/aoneahsan/macleanup',
  },
  {
    id: 'strata-storage',
    name: 'Strata Storage',
    tagline: 'One storage API over localStorage, IndexedDB, cookies and native.',
    url: 'https://github.com/aoneahsan/strata-storage',
  },
];

/**
 * 🔴 OFF EVERY PRODUCT ROSTER - owner decision D46 (2026-09-25): the personal-portfolio
 * entry. The fleet rule of that day says a product speaks as its team and never as one
 * person, and "Meet the Developer" is exactly that line. The row stays in
 * `ROSTER_SOURCE`, because a vendored copy is never hand-edited, and leaves here.
 */
export const OFF_ROSTER: ReadonlySet<string> = new Set(['aoneahsan-portfolio']);

/** What the vendoring drop keeps - this project out, and every id kept off rosters. */
const vendored = (p: EcosystemProduct): boolean => p.id !== SELF_ID && !OFF_ROSTER.has(p.id);

/** LAYER 1 - the vendoring drop. */
export const ROSTER: readonly EcosystemProduct[] = ROSTER_SOURCE.filter(vendored);

/** LAYER 2 - the display resolver, applied again at render time. */
export function promotedProducts(): EcosystemProduct[] {
  return ROSTER.filter((p) => p.id !== SELF_ID);
}

export interface PromoAuditCase {
  name: string;
  selfPromoted: boolean;
  expected: boolean;
  pass: boolean;
  shown: number;
}

/**
 * Proof that each layer is load-bearing. Every case removes ONE layer and asks
 * whether this app could promote itself; the fourth removes BOTH and must come
 * back present - without that control the other three prove only that the roster
 * happens not to contain the id.
 */
export function promoAudit(): PromoAuditCase[] {
  const vend = (on: boolean): readonly EcosystemProduct[] =>
    on ? ROSTER_SOURCE.filter(vendored) : ROSTER_SOURCE;
  const show = (list: readonly EcosystemProduct[], on: boolean): string[] =>
    (on ? list.filter((p) => p.id !== SELF_ID) : list).map((p) => p.id);

  const cases: [string, boolean, boolean, boolean][] = [
    ['both layers', true, true, false],
    ['layer 1 only (display filter removed)', true, false, false],
    ['layer 2 only (vendoring drop removed)', false, true, false],
    ['NEITHER layer - the control', false, false, true],
  ];
  return cases.map(([name, layer1, layer2, expected]) => {
    const ids = show(vend(layer1), layer2);
    const selfPromoted = ids.includes(SELF_ID);
    return { name, selfPromoted, expected, pass: selfPromoted === expected, shown: ids.length };
  });
}
