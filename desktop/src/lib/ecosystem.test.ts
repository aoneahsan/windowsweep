/**
 * The house promotions are vendored twice - into the approved click dummy
 * (`design/windowsweep-click-dummy/page-settings.js`) and into the app
 * (`ecosystem.ts`) - from the one fleet roster. A copy that drifts from the
 * other promotes a different product, name or address than the approved
 * drawing, so the two are compared row for row.
 */

import { describe, expect, it } from 'vitest';

import dummy from '../../design/windowsweep-click-dummy/page-settings.js?raw';

import { promoAudit, promotedProducts, ROSTER_SOURCE, SELF_ID } from './ecosystem';

/** The dummy's rows, read from its own source text. */
function dummyRoster(): { id: string; name: string; tagline: string; url: string }[] {
  const start = dummy.search(/var ROSTER_SOURCE\s*=\s*\[/);
  const end = dummy.indexOf('];', start);
  const rows = dummy.slice(start, end);
  const unq = (s: string | undefined) => (s ?? '').replace(/\\'/g, "'").replace(/\\u2019/g, '’');
  return [
    ...rows.matchAll(
      /\{ id: '((?:[^'\\]|\\.)*)', name: '((?:[^'\\]|\\.)*)', blurb: '((?:[^'\\]|\\.)*)', url: '((?:[^'\\]|\\.)*)' \}/g
    ),
  ].map((m) => ({ id: unq(m[1]), name: unq(m[2]), tagline: unq(m[3]), url: unq(m[4]) }));
}

describe('house promotions', () => {
  it('match the approved dummy row for row', () => {
    const fromDummy = dummyRoster();
    expect(fromDummy.length).toBe(ROSTER_SOURCE.length);
    expect(ROSTER_SOURCE.map(({ id, name, tagline, url }) => ({ id, name, tagline, url }))).toEqual(
      fromDummy
    );
  });

  it('open only https addresses, one per promoted card', () => {
    for (const p of ROSTER_SOURCE) expect(p.url.startsWith('https://')).toBe(true);
    const shown = promotedProducts();
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.every((p) => p.url.length > 'https://'.length)).toBe(true);
  });

  it('never promote this app, by each layer alone', () => {
    expect(ROSTER_SOURCE.some((p) => p.id === SELF_ID)).toBe(true);
    expect(promotedProducts().some((p) => p.id === SELF_ID)).toBe(false);
    for (const c of promoAudit()) expect(c.pass).toBe(true);
  });
});
