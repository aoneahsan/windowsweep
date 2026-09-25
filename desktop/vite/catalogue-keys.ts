/**
 * 🔴 Every LITERAL key the desktop app asks i18next for exists in the English catalogue.
 *
 * i18next returns the key itself when a key is missing, and a key and a string are both
 * `string`, so typecheck, lint and the build all stay green while a screen draws
 * `history.cloudPending` as its text. That happened on 2026-09-25: the key left the
 * catalogue with TASK-013 and `HistoryTable.tsx` still asked for it, and no gate saw it.
 * This walks `src/` when the build starts and stops it on any literal key the merged
 * catalogue cannot resolve. It is the site's own gate (`windowsweep-web/vite/catalogue-keys.ts`,
 * TASK-003) in the desktop's shape.
 *
 * Two shapes are read: a literal `t('a.b')` (either quote; the call may span lines) and a
 * literal `i18nKey="a.b"` / `i18nKey={'a.b'}`. A key resolves when it is a key of the
 * catalogue, or the base of a plural family (`key_one`, `key_other`, ...).
 *
 * ⚠️ Stated limit: a template key (`history.filter.${f}`) is not proved here - only a
 * literal one. The desktop's template keys are few and each is a closed union in its
 * own module; the site's `template-keys.ts` is the model if they ever need proving.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { Plugin } from 'vite';

const PLURAL_SUFFIXES = ['zero', 'one', 'two', 'few', 'many', 'other'];
const LITERAL_T = /\bt\(\s*(['"])([A-Za-z0-9_.-]+)\1/g;
const LITERAL_I18N_KEY = /i18nKey=\{?\s*(['"])([A-Za-z0-9_.-]+)\1/g;

/** One reference the catalogue could not resolve. */
export interface MissingKey {
  file: string;
  line: number;
  key: string;
}

/** Every `.json` catalogue under `locales/en/`, merged the way `src/i18n/index.ts` merges them. */
function englishCatalogue(root: string): Set<string> {
  const dir = join(root, 'src', 'i18n', 'locales', 'en');
  const keys = new Set<string>();
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.json')) continue;
    const catalogue = JSON.parse(readFileSync(join(dir, name), 'utf8')) as Record<string, unknown>;
    for (const key of Object.keys(catalogue)) keys.add(key);
  }
  return keys;
}

/** Whether `key` is a catalogue key, or the base of a plural family in it. */
function resolves(keys: ReadonlySet<string>, key: string): boolean {
  return keys.has(key) || PLURAL_SUFFIXES.some((suffix) => keys.has(`${key}_${suffix}`));
}

/** Every `.ts` / `.tsx` file under `dir`. */
function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...sourceFiles(path));
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('.d.ts')) out.push(path);
  }
  return out;
}

/**
 * The literal keys in `src/` that the English catalogue cannot resolve.
 *
 * @param root - the desktop app's root (the folder holding `src/`).
 */
export function missingLiteralKeys(root: string): MissingKey[] {
  const keys = englishCatalogue(root);
  const missing: MissingKey[] = [];
  for (const file of sourceFiles(join(root, 'src'))) {
    const text = readFileSync(file, 'utf8');
    for (const pattern of [LITERAL_T, LITERAL_I18N_KEY]) {
      for (const match of text.matchAll(pattern)) {
        const key = match[2];
        if (!key || !key.includes('.') || resolves(keys, key)) continue;
        const line = text.slice(0, match.index).split('\n').length;
        missing.push({ file: relative(root, file).split(sep).join('/'), line, key });
      }
    }
  }
  return missing;
}

/** The Vite plugin: at build start, refuse a build that would draw a raw key. */
export function catalogueKeysPlugin(root: string): Plugin {
  return {
    name: 'windowsweep-desktop:catalogue-keys',
    buildStart() {
      const missing = missingLiteralKeys(root);
      if (missing.length === 0) return;
      const lines = missing.map((m) => `  ${m.file}:${String(m.line)}  ${m.key}`).join('\n');
      this.error(
        `[catalogue-keys] ${String(missing.length)} key(s) the English catalogue cannot resolve - each would draw as its raw key:\n${lines}`
      );
    },
  };
}
