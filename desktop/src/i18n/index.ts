/**
 * i18n from day one.
 *
 * 🔴 The mechanism ships complete; the translations do not. English-only content
 * is fine indefinitely - but every user-visible string goes through `t()` from the
 * first screen, because retrofitting it later means touching every component.
 *
 * The acceptance test is one sentence: **is adding a second language ONE new
 * catalogue file, and nothing else?** If it would need a component edited, a
 * string extracted, a plural form invented or `<html lang>` wired, this is not
 * built - however green the build is.
 *
 * 🔴 DEFAULT_LOCALE is the catalogue i18next runs. FORMAT_LOCALE (in format.ts) is
 * what Intl formats with. They are different values on purpose and are never
 * collapsed into one: the first is a language, the second is a set of conventions.
 * A project once registered its whole shell bundle under `en-GB` while i18next ran
 * `en`, and rendered a raw key as its heading - i18next returns the key rather than
 * throwing, and typecheck cannot see it because both are strings.
 *
 * 🔴 THE CATALOGUE IS SPLIT ACROSS SEVERAL FILES ONLY BECAUSE THIS REPOSITORY CAPS A
 * FILE AT 500 LINES (it reached 516 on 2026-09-13). It is FLAT - one level of
 * dotted keys - and each file holds whole key prefixes (`home.*` and `run.*` live in
 * `home.json`, and so on), so the files merge with a plain spread and two of them
 * cannot hold the same key. The split was proved lossless when it was made: the four
 * files merged equal the old single file, 514 keys, value for value.
 *
 * Every locale is DISCOVERED: `import.meta.glob` reads `./locales/<lang>/*.json`, so
 * a second language is one new directory (`cp -r locales/en locales/de`, then
 * translate) and no code at all. English alone is also imported by name - as a TYPE
 * only, because it is what every key is checked against.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type enShell from './locales/en/shell.json';
import type enHome from './locales/en/home.json';
import type enSections from './locales/en/sections.json';
import type enAccount from './locales/en/account.json';
import { DEFAULT_LOCALE } from '../lib/format';

type English = typeof enShell & typeof enHome & typeof enSections & typeof enAccount;

export type TranslationKeys = keyof English;

type Catalogue = Record<string, string>;

const files = import.meta.glob<Catalogue>('./locales/*/*.json', {
  eager: true,
  import: 'default',
});

function buildResources(): Record<string, { translation: Catalogue }> {
  const out: Record<string, { translation: Catalogue }> = {};
  for (const [path, catalogue] of Object.entries(files)) {
    /* './locales/en/home.json' -> 'en' */
    const locale = path.split('/')[2];
    if (!locale) continue;
    out[locale] ??= { translation: {} };
    Object.assign(out[locale].translation, catalogue);
  }
  return out;
}

export const resources = buildResources();

void i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

/** Applied to <html> so a screen reader and the CSS logical properties both know. */
export function applyDocumentLanguage(): void {
  document.documentElement.lang = i18n.language;
  document.documentElement.dir = i18n.dir();
}

export default i18n;
