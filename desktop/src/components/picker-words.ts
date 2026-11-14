/**
 * The install mode's sentences, chosen from the facts `lib/install-mode.ts` derives.
 *
 * 🔴 One catalogue sentence per SHAPE, never a sentence glued from parts: "Install 2, remove 3" is
 * its own key, so word order stays the translator's and no capitalisation is patched onto a
 * fragment. Every key is a literal `t()` call, so the build's catalogue-key gate proves each exists.
 */

import type { TFunction } from 'i18next';

import { formatBytes, formatList } from '../lib/format';
import type { DownloadPhrase, KeptPhrase, VerbPhrase } from '../lib/install-mode';

/** The button's verb, which the install confirmation repeats as its title and its button. */
export function verbText(t: TFunction, phrase: VerbPhrase): string {
  switch (phrase.kind) {
    case 'install':
      return t('picker.installVerb.install', { count: phrase.count });
    case 'remove':
      return t('picker.installVerb.remove', { count: phrase.count });
    case 'mixed':
      return t('picker.installVerb.mixed', { install: phrase.install, remove: phrase.remove });
  }
}

/** The download, said in words beside the bar's figure - a size never guessed. */
export function downloadText(t: TFunction, phrase: DownloadPhrase): string {
  switch (phrase.kind) {
    case 'none':
      return t('picker.download.none');
    case 'unknown':
      return t('picker.download.unknown');
    case 'known':
      return t('picker.download.known', { size: formatBytes(phrase.bytes) });
    case 'knownPlusUnknown':
      return t('picker.download.knownPlusUnknown', {
        size: formatBytes(phrase.bytes),
        count: phrase.unknown,
      });
  }
}

/** The one line naming rows chosen in the other mode - they stay chosen and run separately. */
export function keptText(t: TFunction, kept: KeptPhrase): string {
  const list = formatList(kept.sections);
  return kept.sections.length > 1
    ? t('picker.keptAcross', { count: kept.rows, list })
    : t('picker.kept', { count: kept.rows, list });
}
