/**
 * The section catalogue, read from the engine at boot.
 *
 * 🔴 Never hard-coded. `windowsweep --list --json` is the source, so a section
 * added to the engine appears in this app with no app change at all - which is
 * the entire reason 1.1.0 grew that flag. A hard-coded copy would be a second
 * catalogue that drifts, and the drift would be invisible: the app would simply
 * stop offering a section that exists.
 *
 * Shape transcribed from `modules/runner.ps1` -> `Get-CatalogueJson`.
 */

export type SectionTier = 'report' | 'rebuilds' | 'recycle' | 'permanent' | 'config' | 'slow';
export type SectionBatch = 'safe' | 'deep' | 'optin' | 'interactive';

export interface Section {
  id: number;
  key: string;
  title: string;
  tier: SectionTier;
  /** Needs an elevated window. The app never elevates itself; the engine's --elevate does. */
  admin: boolean;
  batch: SectionBatch;
  /** Only offered when developer mode is on. */
  dev: boolean;
}

export interface Catalogue {
  tool: string;
  version: string;
  sections: Section[];
  safe_batch: number[];
  safe_batch_admin: number[];
  profiles: Record<string, number[]>;
  walkthrough: number[];
  walkthrough_admin: number[];
}

/** Tiers whose deletions cannot be undone. The UI must say so wherever it offers them. */
export const PERMANENT_TIERS: ReadonlySet<SectionTier> = new Set<SectionTier>(['permanent']);

/** Tiers that move items to the Recycle Bin rather than deleting them outright. */
export const RECYCLE_TIERS: ReadonlySet<SectionTier> = new Set<SectionTier>(['recycle']);

export function parseCatalogue(stdout: string): Catalogue {
  const line = stdout
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('{'))
    .pop();
  if (!line) throw new Error('`--list --json` produced no catalogue line');
  const raw: unknown = JSON.parse(line);
  if (typeof raw !== 'object' || raw === null) throw new Error('the catalogue was not an object');
  const doc = raw as Partial<Catalogue>;
  if (!Array.isArray(doc.sections) || doc.sections.length === 0) {
    throw new Error('the catalogue carried no sections');
  }
  return {
    tool: String(doc.tool ?? 'windowsweep'),
    version: String(doc.version ?? ''),
    sections: doc.sections,
    safe_batch: doc.safe_batch ?? [],
    safe_batch_admin: doc.safe_batch_admin ?? [],
    profiles: doc.profiles ?? {},
    walkthrough: doc.walkthrough ?? [],
    walkthrough_admin: doc.walkthrough_admin ?? [],
  };
}

export function sectionById(catalogue: Catalogue, id: number): Section | undefined {
  return catalogue.sections.find((s) => s.id === id);
}

/**
 * The sections a plain, unelevated safe run would touch. Derived from the engine's
 * own `safe_batch`, never from a rule this app invents about which tier is safe.
 */
export function safeRunSections(catalogue: Catalogue, developer: boolean): Section[] {
  return catalogue.safe_batch
    .map((id) => sectionById(catalogue, id))
    .filter((s): s is Section => Boolean(s))
    .filter((s) => developer || !s.dev);
}
