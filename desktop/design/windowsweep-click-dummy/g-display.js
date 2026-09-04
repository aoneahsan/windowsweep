/* Gallery 5 of 8 - display. The read-only vocabulary. */
(function () {
  'use strict';
  var G = window.G, el = G.el, db = window.wsdb;

  var TIERS = ['report', 'rebuilds', 'slow', 'recycle', 'permanent', 'config'];

  window.wsPlayground.register('stat', {
    title: 'Stat card',
    note: 'used by home, history and report',
    dials: [
      { key: 'value', label: 'Value', value: 'typical', options: ['zero', 'small', 'typical', 'huge', 'widest'] },
      { key: 'delta', label: 'Delta', value: 'up', options: ['none', 'up', 'down', 'flat'] },
      { key: 'label', label: 'Label', value: 'typical', options: ['typical', 'longest'] },
      { key: 'state', label: 'State', value: 'ready', options: ['ready', 'loading', 'empty'] },
      { key: 'size', label: 'Size', value: 'md', options: ['sm', 'md', 'lg'] }
    ],
    render: function (mount, v) {
      var card = el('div', 'card');
      card.style.width = 'min(22rem, 100%)';
      var bd = el('div', 'card-bd');
      var st = el('div', 'stat');

      if (v.state === 'loading') {
        var s1 = el('div', 'skel skel-l'); s1.setAttribute('data-w', '60'); s1.style.height = '2em';
        var s2 = el('div', 'skel skel-l'); s2.setAttribute('data-w', '40');
        st.appendChild(s1); st.appendChild(s2);
      } else if (v.state === 'empty') {
        var val0 = el('div', 'stat-v', '—');
        st.appendChild(val0);
        st.appendChild(el('div', 'stat-l', 'No run yet. Press Preview to find out.'));
      } else {
        var nums = { zero: 0, small: 4.2e6, typical: 4.271e10, huge: 1.4e13, widest: 999999.99e9 };
        var val = el('div', 'stat-v', db.fmt.bytes(nums[v.value]));
        val.style.fontSize = { sm: 'var(--fs-lg)', md: 'var(--fs-xl)', lg: 'var(--fs-2xl)' }[v.size];
        st.appendChild(val);
        var row = el('div');
        row.style.cssText = 'display:flex;align-items:baseline;gap:var(--sp-2);flex-wrap:wrap';
        row.appendChild(el('div', 'stat-l',
          v.label === 'longest'
            ? 'Reclaimable across every section on every fixed drive, after the idle window'
            : 'Reclaimable now'));
        if (v.delta !== 'none') {
          var d = el('span', 'stat-d');
          d.dataset.dir = v.delta;
          d.appendChild(el('span', null, { up: '▲', down: '▼', flat: '■' }[v.delta]));
          d.appendChild(el('span', null, { up: '+3.1 GB', down: '−1.2 GB', flat: 'no change' }[v.delta]));
          row.appendChild(d);
        }
        st.appendChild(row);
      }
      bd.appendChild(st);
      card.appendChild(bd);
      mount.appendChild(card);
      if (v.value === 'widest' && v.state === 'ready') {
        mount.appendChild(el('p', 't-2xs ink-3',
          'The widest plausible number. Tabular figures keep it from shifting the layout as it counts up.'));
      }
    }
  });

  /* ---- cards ------------------------------------------------------------- */
  var c = G.section('cards', 'Card', 'home, history, account, settings');
  G.row(c, [
    { label: 'plain', node: (function () {
        var x = el('div', 'card'); x.style.width = '15rem';
        var b = el('div', 'card-bd');
        b.appendChild(el('p', 't-md wide', 'Weekly schedule'));
        b.appendChild(el('p', 't-sm ink-3', 'Sundays at 03:00, safe batch only.'));
        x.appendChild(b); return x;
      })() },
    { label: 'interactive', node: (function () {
        var x = el('a', 'card'); x.href = '#cards'; x.style.width = '15rem';
        var b = el('div', 'card-bd');
        b.appendChild(el('p', 't-md wide', 'Last run'));
        b.appendChild(el('p', 't-sm ink-3', 'Yesterday · freed 3.3 GB · 5 sections'));
        x.appendChild(b); return x;
      })(), why: 'lifts on hover, ring on focus-visible' },
    { label: 'with footer actions', node: (function () {
        var x = el('div', 'card'); x.style.width = '17rem';
        var b = el('div', 'card-bd');
        b.appendChild(el('p', 't-md wide', 'Cloud sync'));
        b.appendChild(el('p', 't-sm ink-3', 'Settings and run summaries only. Never a path, a host name or a user name.'));
        x.appendChild(b);
        var f = el('div', 'card-ft');
        f.appendChild(G.btn('Sign in with Google', 'btn-sm btn-primary'));
        f.appendChild(G.btn('Not now', 'btn-sm btn-ghost'));
        x.appendChild(f); return x;
      })() }
  ]);

  /* ---- badges and tiers --------------------------------------------------- */
  var b = G.section('badges', 'Badge, tier and status', 'sections, picker, report');
  var brow = el('div', 'spec-row');
  [['badge-neutral', 'safe'], ['badge-accent', 'developer'], ['badge-ok', 'ran'],
   ['badge-warn', 'needs you'], ['badge-danger', 'admin'], ['badge-outline', 'dev']].forEach(function (x) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', x[0].replace('badge-', '')));
    cell.appendChild(G.badge(x[1], x[0]));
    brow.appendChild(cell);
  });
  b.appendChild(brow);

  var trow = el('div', 'spec-row');
  TIERS.forEach(function (t) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', t));
    cell.appendChild(G.tier(t));
    trow.appendChild(cell);
  });
  b.appendChild(trow);
  G.note(b, 'Never colour alone. The accent (hue 128) sits 22 degrees from success (150) - an honest ' +
    'number, not one rounded up - so the two are separated by CHROMA and a mandatory glyph instead. ' +
    'Every tier chip carries its word; a colour-blind reader loses nothing.');

  /* ---- avatars, progress -------------------------------------------------- */
  var a = G.section('avatar', 'Avatar and progress', 'account, run, report');
  G.row(a, [
    { label: 'initials', node: el('span', 'ava', 'AM') },
    { label: 'large', node: el('span', 'ava ava-lg', 'AM') },
    { label: 'fallback', node: el('span', 'ava', '?') },
    { label: 'progress, determinate', node: (function () {
        var w = el('div'); w.style.width = '11rem';
        var p = el('div', 'prog');
        var f = el('i', 'prog-fill'); f.style.width = '62%';
        p.appendChild(f); w.appendChild(p);
        w.appendChild(el('p', 't-2xs ink-3', '5 of 8 sections'));
        return w;
      })() },
    { label: 'progress, done', node: (function () {
        var w = el('div'); w.style.width = '11rem';
        var p = el('div', 'prog');
        var f = el('i', 'prog-fill'); f.style.width = '100%'; f.dataset.tone = 'ok';
        p.appendChild(f); w.appendChild(p);
        w.appendChild(el('p', 't-2xs state-ok', 'finished'));
        return w;
      })() }
  ]);
  G.note(a, 'RAC reads a <Label> CHILD for Progress and Meter, not a prop-shaped span - a plain span ' +
    'gives identical pixels and an anonymous control that announces "62%" of nothing. An EMPTY <Label> is ' +
    'worse still: it silences the console warning while leaving the accessible name empty.');

  /* ---- skeletons ---------------------------------------------------------- */
  var sk = G.section('skeleton', 'Skeleton', 'every screen that waits');
  G.row(sk, [
    { label: 'shaped like a stat', node: (function () {
        var w = el('div'); w.style.width = '11rem';
        var a1 = el('div', 'skel'); a1.style.height = '2.2em'; a1.style.width = '70%'; a1.style.marginBottom = '.4em';
        var a2 = el('div', 'skel skel-l'); a2.setAttribute('data-w', '40');
        w.appendChild(a1); w.appendChild(a2); return w;
      })() },
    { label: 'shaped like a row', node: (function () {
        var w = el('div'); w.style.width = '17rem';
        for (var i = 0; i < 3; i++) {
          var r = el('div');
          r.style.cssText = 'display:flex;gap:var(--sp-3);align-items:center;padding:var(--sp-2) 0';
          var d = el('div', 'skel'); d.style.width = '1.6rem'; d.style.height = '1.6rem'; d.style.borderRadius = '50%'; d.style.flex = 'none';
          var l = el('div', 'skel skel-l'); l.style.flex = '1';
          r.appendChild(d); r.appendChild(l);
          w.appendChild(r);
        }
        return w;
      })() }
  ]);
  G.note(sk, 'A skeleton is shaped like the thing it stands in for, never a generic grey block - ' +
    'otherwise the layout jumps when the real content lands, which is the shift the skeleton existed to ' +
    'prevent.');

  /* ---- empty states -------------------------------------------------------- */
  var e = G.section('empty', 'Empty state', 'history, picker, report');
  var erow = el('div', 'spec-row');
  [['No runs yet', 'windowsweep has not cleaned anything on this machine. A preview costs nothing and deletes nothing.', 'Preview what is reclaimable'],
   ['Nothing to reclaim', 'Every cache is already empty or still inside its idle window. This is the good outcome.', null],
   ['Nothing matched that file', 'None of the 402 paths in your selection file matched a candidate this section offered. Check the paths, or drop the file again.', 'Choose another file']].forEach(function (x) {
    var cell = el('div', 'spec-cell');
    cell.style.flex = '1';
    cell.style.minWidth = '15rem';
    var w = el('div', 'empty');
    w.appendChild(el('h3', null, x[0]));
    w.appendChild(el('p', null, x[1]));
    if (x[2]) w.appendChild(G.btn(x[2], 'btn-primary'));
    cell.appendChild(w);
    erow.appendChild(cell);
  });
  e.appendChild(erow);
  G.note(e, 'The zero state is designed first, not last. "Nothing to reclaim" is the good outcome on a ' +
    'clean machine and must read like one - never an error, never a blank box.');

  /* ---- banners ------------------------------------------------------------ */
  var n = G.section('banner', 'Banner / inline alert', 'every screen');
  ['info', 'ok', 'warn', 'danger'].forEach(function (tone) {
    var texts = {
      info: 'A dry run writes the same report a real run would - it just deletes nothing.',
      ok: 'Freed 3.31 GB across 5 sections. The report is on disk.',
      warn: 'Chrome is running, so its 7.4 GB of profile cache was skipped. Close it and run section 7 again.',
      danger: 'Six sections need an elevated window. windowsweep will not elevate itself.'
    };
    var w = el('div', 'note note-' + tone);
    w.appendChild(el('span', null, { info: 'i', ok: '✓', warn: '⚠', danger: '!' }[tone]));
    w.appendChild(el('span', null, texts[tone]));
    if (tone === 'info') {
      var x = el('button', 'note-x', '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Dismiss');
      x.addEventListener('click', function () { w.remove(); });
      w.appendChild(x);
    }
    var row = el('div', 'spec-row');
    row.setAttribute('data-stack', '');
    row.appendChild(el('span', 'caps', tone + (tone === 'info' ? ' (dismissible)' : '')));
    row.appendChild(w);
    n.appendChild(row);
  });

  /* ---- lists and timeline --------------------------------------------------- */
  var l = G.section('list', 'List and timeline', 'history, report, run');
  var lst = el('div', 'lst panel');
  [['C:', 'freed 2.10 GB', 'ok'], ['D:', 'freed 1.21 GB', 'ok'], ['E:', 'skipped – not a fixed drive', 'muted']].forEach(function (r) {
    var i = el('div', 'lst-i');
    i.setAttribute('data-interactive', '');
    i.appendChild(el('span', 'ava', r[0]));
    var t = el('div');
    t.appendChild(el('div', 't-sm', r[0] + ' drive'));
    t.appendChild(el('div', 't-xs ink-3', r[1]));
    i.appendChild(t);
    var x = el('div', 'lst-x');
    x.appendChild(G.btn('Open report', 'btn-sm btn-ghost'));
    i.appendChild(x);
    lst.appendChild(i);
  });
  var tl = el('div', 'tl');
  [['09:14:02', 'Run started – safe batch, 8 sections', ''],
   ['09:14:05', 'Section 1 · pkg – freed 4.21 GB', ''],
   ['09:14:11', 'Section 7 · chromium – skipped, Chrome is running', 'muted'],
   ['09:14:19', 'Finished – 3 sections skipped, nothing refused', '']].forEach(function (r) {
    var i = el('div', 'tl-i');
    if (r[2]) i.dataset.tone = r[2];
    i.appendChild(el('span', 'tl-dot'));
    var t = el('div');
    t.appendChild(el('div', 'mono t-2xs ink-3', r[0]));
    t.appendChild(el('div', 't-sm', r[1]));
    i.appendChild(t);
    tl.appendChild(i);
  });
  G.row(l, [{ label: 'list with actions', node: lst }, { label: 'timeline', node: tl }]);

  /* ---- accordion ------------------------------------------------------------ */
  var ac = G.section('accordion', 'Accordion / disclosure', 'home, sections, run - the progressive-disclosure layer');
  var arow = el('div', 'spec-row');
  arow.setAttribute('data-stack', '');
  [['Is anything here irreversible?', 'Cache targets are deleted outright, because Windows and your tools rebuild them. Personal files in sections 18 and 19 go to the Recycle Bin instead, and stay recoverable until you empty it.'],
   ['What can it never touch?', 'Twenty-two protected paths, including your user profile’s Documents, Desktop and Pictures, every credential store, and the Windows directory itself. The list only ever grows.']].forEach(function (x, i) {
    var d = el('details', 'disclose');
    if (i === 0) d.open = true;
    var s = el('summary');
    s.appendChild(el('span', 'disclose-line', x[0]));
    s.appendChild(el('span', 'disclose-more', 'Details'));
    d.appendChild(s);
    var bd = el('div', 'disclose-body');
    bd.appendChild(el('p', null, x[1]));
    d.appendChild(bd);
    arow.appendChild(d);
  });
  ac.appendChild(arow);
  G.note(ac, 'Native <details>/<summary>: keyboard and screen-reader correct with no JavaScript at all. ' +
    'Round 4 moved the safety argument, the admin explanation and the privacy detail behind these, taking ' +
    'the home screen’s default view from 444 words to 208.');

  G.trims(G.section('display-trims', 'Trims', 'stated, not silent'), [
    ['Avatar group', 'one account on one machine – there is never a second face.'],
    ['Carousel', 'nothing here is browsed a slide at a time.'],
    ['Tree view', 'the catalogue is flat; a section number is the whole hierarchy.']
  ]);

  window.wsWidgets.boot();
  window.wsPlayground.boot();
})();
