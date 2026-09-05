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
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import { DEFAULT_LOCALE } from '../lib/format';

export const resources = { en: { translation: en } } as const;

export type TranslationKeys = keyof typeof en;

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
