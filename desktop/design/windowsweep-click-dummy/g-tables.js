/* Gallery 4 of 8 - the table. Its own file because it is the largest single
   component in the product and the one the cockpit regime is built around. */
(function () {
  'use strict';
  var G = window.G, el = G.el, S = window.wsSeed, db = window.wsdb;

  var ROWS = S.SECTIONS.slice(0, 8).map(function (s, i) {
    return {
      id: s.id, key: s.key, title: s.title, tier: s.tier, batch: s.batch,
      admin: s.admin, dev: s.dev, bytes: [4.21e9, 11.08e9, 0, 7.4e9, 1.2e8, 3.3e9, 0, 9.1e8][i] || 0
    };
  });

  function header(cols, opts) {
    var thead = el('thead');
    var tr = el('tr');
    cols.forEach(function (c) {
      var th = el('th');
      if (c.num) th.className = 'num-cell';
      if (c.w) th.style.width = c.w;
      if (c.hidden) { th.appendChild(el('span', 'visually-hidden', c.t)); }
      else if (c.sort && opts && opts.sortable) {
        var b = el('button', 'btn btn-sm btn-ghost');
        b.type = 'button';
        b.style.padding = '0';
        b.setAttribute('aria-sort', c.sort);
        b.appendChild(el('span', null, c.t));
        b.appendChild(el('span', 't-2xs', c.sort === 'descending' ? ' ▾' : c.sort === 'ascending' ? ' ▴' : ' ↕'));
        th.appendChild(b);
        th.setAttribute('aria-sort', c.sort);
      } else th.textContent = c.t;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    return thead;
  }

  var COLS = [
    { t: 'Select', w: '2.4rem', hidden: true },
    { t: '#', w: '3rem' },
    { t: 'Section', sort: 'none' },
    { t: 'Tier', w: '7.5rem' },
    { t: 'Batch', w: '6rem' },
    { t: 'Reclaimable', w: '7rem', num: true, sort: 'descending' },
    { t: 'Row actions', w: '2.5rem', hidden: true }
  ];

  function buildTable(opts) {
    opts = opts || {};
    /* The panel keeps overflow:visible so a row-actions menu can escape it. The SCROLLER is a separate
       inner element: overflow-x:auto and overflow-y:visible cannot coexist on one box, and an inline
       overflow:visible here silently defeated the .xscroll class - measured 2026-09-05, every table on
       this page computed overflow-x:visible while matching a rule that sets it to auto. */
    var wrap = el('div', 'panel');
    wrap.style.overflow = 'visible';
    var scroller = el('div', 'xscroll');
    wrap.appendChild(scroller);
    var t = el('table', 'tbl');
    if (opts.dense) t.style.setProperty('--density', '.82');
    if (opts.sticky) { scroller.style.maxHeight = '18rem'; scroller.style.overflowY = 'auto'; }
    t.appendChild(header(COLS, opts));
    var tb = el('tbody');

    if (opts.loading) {
      for (var i = 0; i < 5; i++) {
        var tr = el('tr');
        COLS.forEach(function (c, j) {
          var td = el('td');
          var sk = el('div', 'skel skel-l');
          sk.setAttribute('data-w', j === 2 ? '80' : '40');
          td.appendChild(sk);
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      }
      t.appendChild(tb); scroller.appendChild(t);
      return wrap;
    }

    if (opts.empty) {
      var etr = el('tr');
      var etd = el('td');
      etd.colSpan = COLS.length;
      var e = el('div', 'empty');
      e.appendChild(el('h3', null, 'No section matches that'));
      e.appendChild(el('p', null, 'All 26 are still there – the filter is narrow. Clear it and they come back.'));
      e.appendChild(G.btn('Clear the filter'));
      etd.appendChild(e);
      etr.appendChild(etd); tb.appendChild(etr);
      t.appendChild(tb); scroller.appendChild(t);
      return wrap;
    }

    (opts.rows || ROWS).forEach(function (r, i) {
      var tr = el('tr');
      var selected = opts.selected && i < 2;
      tr.setAttribute('data-selected', selected ? 'true' : 'false');

      var tdS = el('td');
      if (r.tier !== 'report' && r.tier !== 'config') {
        var sw = G.sw(!!selected, 'Select section ' + r.id + ', ' + r.key);
        sw.style.setProperty('--sw-w', 'calc(1.9rem * var(--density))');
        sw.addEventListener('click', function () {
          setTimeout(function () {
            tr.setAttribute('data-selected', sw.getAttribute('aria-checked'));
          }, 0);
        });
        tdS.appendChild(sw);
      } else {
        var d = el('span', 't-xs ink-3', '—');
        d.title = 'Report only – there is nothing to select';
        tdS.appendChild(d);
      }
      tr.appendChild(tdS);

      tr.appendChild(el('td', 'num t-sm ink-3', String(r.id)));

      var tdN = el('td');
      var top = el('div');
      top.style.cssText = 'display:flex;align-items:center;gap:var(--sp-2)';
      var k = el('span', 't-sm'); k.style.fontWeight = '600'; k.textContent = r.key;
      top.appendChild(k);
      if (r.dev) top.appendChild(G.badge('dev', 'badge-outline'));
      tdN.appendChild(top);
      var sub = el('div', 't-xs ink-3', r.title);
      sub.style.cssText = 'max-width:34rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
      tdN.appendChild(sub);
      tr.appendChild(tdN);

      var tdT = el('td'); tdT.appendChild(G.tier(r.tier)); tr.appendChild(tdT);
      var tdB = el('td');
      tdB.appendChild(G.badge(r.batch,
        r.batch === 'safe' ? 'badge-neutral' : r.batch === 'interactive' ? 'badge-warn'
          : r.batch === 'deep' ? 'badge-danger' : 'badge-outline'));
      tr.appendChild(tdB);

      var tdBy = el('td', 'num-cell t-sm');
      tdBy.textContent = r.bytes ? db.fmt.bytes(r.bytes) : '—';
      if (r.bytes) tdBy.classList.add('accent-ink');
      tr.appendChild(tdBy);

      var tdA = el('td');
      tdA.appendChild(G.menu('⋯', [
        { t: 'Dry run this section' },
        { t: 'Show what it touches' },
        '-',
        { t: 'Exclude it from every run', danger: true }
      ], { triggerClass: 'btn-sm btn-ghost btn-icon' }));
      tr.appendChild(tdA);

      tb.appendChild(tr);
    });
    t.appendChild(tb);
    scroller.appendChild(t);
    return wrap;
  }

  /* ---- playground -------------------------------------------------------- */
  window.wsPlayground.register('table', {
    title: 'Section table',
    note: 'used by sections.html and picker.html',
    dials: [
      { key: 'data', label: 'Data', value: 'typical', options: ['empty', 'one', 'typical', 'dense', 'extreme'] },
      { key: 'state', label: 'State', value: 'default', options: ['default', 'loading', 'selected'] },
      { key: 'density', label: 'Density', value: 'comfortable', options: ['compact', 'comfortable', 'spacious'] },
      { key: 'labels', label: 'Labels', value: 'real', options: ['real', 'longest'] },
      { key: 'sticky', label: 'Header', value: 'normal', options: ['normal', 'sticky'] }
    ],
    render: function (mount, v) {
      var rows;
      if (v.data === 'one') rows = ROWS.slice(0, 1);
      else if (v.data === 'dense') rows = S.SECTIONS.map(function (s, i) {
        return { id: s.id, key: s.key, title: s.title, tier: s.tier, batch: s.batch, dev: s.dev, bytes: (i % 4) * 1.1e9 };
      });
      else if (v.data === 'extreme') {
        rows = [];
        for (var i = 0; i < 400; i++) {
          var s = S.SECTIONS[i % S.SECTIONS.length];
          rows.push({ id: i, key: s.key + '-' + i, title: s.title, tier: s.tier, batch: s.batch, dev: s.dev, bytes: (i % 7) * 4.3e8 });
        }
      } else rows = ROWS;

      if (v.labels === 'longest') {
        rows = rows.map(function (r) {
          return Object.assign({}, r, {
            key: 'globally-installed-packages-audit',
            title: 'Globally installed packages audit (npm, pnpm, yarn, bun, deno) – report only, ' +
                   'with uninstall commands printed for anything idle past the window'
          });
        });
      }

      var host = el('div');
      host.style.width = '100%';
      host.style.setProperty('--density', { compact: '.82', comfortable: '1', spacious: '1.18' }[v.density]);
      host.appendChild(buildTable({
        rows: rows,
        empty: v.data === 'empty',
        loading: v.state === 'loading',
        selected: v.state === 'selected',
        sticky: v.sticky === 'sticky' || v.data === 'extreme',
        sortable: true
      }));
      if (v.data === 'extreme') {
        host.appendChild(el('p', 't-2xs ink-3',
          '400 rows. The real product paginates at 50 – the client never fetches a whole table to filter it.'));
      }
      mount.appendChild(host);
    }
  });

  /* ---- the states, side by side ------------------------------------------ */
  var s1 = G.section('states', 'Every state', 'sections.html, picker.html, history.html');
  [['default', {}], ['selected rows', { selected: true }], ['dense', { dense: true }],
   ['loading', { loading: true }], ['empty', { empty: true }]].forEach(function (st) {
    var b = el('div', 'spec-row');
    b.setAttribute('data-stack', '');
    b.appendChild(el('span', 'caps', st[0]));
    b.appendChild(buildTable(Object.assign({ sortable: true }, st[1])));
    s1.appendChild(b);
  });
  G.note(s1, 'Selection is a switch per row, not a checkbox column, because the product’s own language ' +
    'for "this section is in the run" is a switch everywhere else. The selected state was the one no ' +
    'earlier contrast sweep exercised – selecting a row immediately produced a 4.46:1 failure that a ' +
    'clean unselected sweep had reported as fine for a whole session.');

  /* ---- horizontal scroll -------------------------------------------------- */
  var s2 = G.section('scroll', 'Horizontal overflow', 'a narrow window, never the page');
  var narrow = el('div', 'spec-row');
  narrow.setAttribute('data-stack', '');
  var clip = el('div');
  clip.style.width = '22rem';
  clip.style.maxWidth = '100%';
  clip.style.border = '1px dashed var(--c-line-strong)';
  clip.style.padding = 'var(--sp-2)';
  clip.appendChild(buildTable({ rows: ROWS.slice(0, 3) }));
  narrow.appendChild(el('p', 't-sm ink-3', 'The table scrolls inside its own container. The page body never does.'));
  narrow.appendChild(clip);
  s2.appendChild(narrow);

  /* ---- row expansion ------------------------------------------------------ */
  var s3 = G.section('expand', 'Row expansion', 'what a section actually declares');
  var ex = el('div', 'spec-row');
  ex.setAttribute('data-stack', '');
  var det = el('details', 'disclose');
  var sum = el('summary');
  sum.appendChild(el('span', 'disclose-line', 'Section 1 · pkg · what it touches on this machine'));
  sum.appendChild(el('span', 'disclose-more', 'Details'));
  det.appendChild(sum);
  var body = el('div', 'disclose-body');
  var grid = el('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'minmax(0,1fr) auto auto';
  grid.style.gap = 'var(--sp-1) var(--sp-4)';
  [['%LOCALAPPDATA%\\npm-cache', '4.21 GB', 'idle 142d'],
   ['%LOCALAPPDATA%\\Yarn\\Cache', '2.90 GB', 'idle 88d'],
   ['%USERPROFILE%\\.gradle\\caches', '11.08 GB', 'idle 210d'],
   ['%USERPROFILE%\\.cache\\huggingface\\hub', '640 MB', 'idle 31d']].forEach(function (r) {
    var p = el('span', 'mono t-xs', r[0]);
    p.style.overflow = 'hidden'; p.style.textOverflow = 'ellipsis';
    grid.appendChild(p);
    grid.appendChild(el('span', 'num t-xs ink-3', r[1]));
    grid.appendChild(el('span', 't-xs ink-3', r[2]));
  });
  body.appendChild(grid);
  det.appendChild(body);
  ex.appendChild(det);
  s3.appendChild(ex);

  G.trims(G.section('table-trims', 'Trims', 'stated, not silent'), [
    ['Column reordering and resizing', 'seven fixed columns on a 760px-minimum window; there is nothing to rearrange.'],
    ['Grouped / tree rows', 'the catalogue is flat by design – a section number is the whole hierarchy.'],
    ['Inline cell editing', 'nothing in the catalogue is editable; it is a frozen public contract.']
  ]);

  window.wsWidgets.boot();
  window.wsPlayground.boot();
})();
