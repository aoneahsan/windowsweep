/* Gallery 6 of 8 - navigation. A desktop window has no URL bar and no mobile
   bottom nav, so the rail and the command palette carry more than they would
   on the web. */
(function () {
  'use strict';
  var G = window.G, el = G.el, S = window.wsSeed;

  var NAV = window.ws.NAV;

  function rail(mode) {
    var r = el('nav', 'rail');
    r.setAttribute('aria-label', 'Main');
    if (mode === 'icons') r.setAttribute('data-collapsed', 'true');
    var group = el('div', 'rail-group');
    NAV.forEach(function (item) {
      if (item.sep) { group.appendChild(el('div', 'rail-sep')); return; }
      var a = el('a', 'rail-item');
      a.href = item.href;
      if (item.href === 'index.html') a.setAttribute('aria-current', 'page');
      a.appendChild(window.ws.icon(item.icon, 17));
      if (mode !== 'icons') a.appendChild(el('span', null, item.label));
      else a.setAttribute('aria-label', item.label);
      if (item.badge && mode !== 'icons') a.appendChild(el('span', 'rail-badge', item.badge));
      if (item.soon && mode !== 'icons') a.appendChild(el('span', 'badge badge-outline', 'soon'));
      group.appendChild(a);
    });
    r.appendChild(group);
    return r;
  }

  window.wsPlayground.register('rail', {
    title: 'Navigation rail',
    note: 'used by every screen',
    dials: [
      { key: 'mode', label: 'Mode', value: 'expanded', options: ['expanded', 'icons', 'drawer'] },
      { key: 'active', label: 'Active', value: 'home', options: ['home', 'sections', 'run', 'none'] },
      { key: 'labels', label: 'Labels', value: 'real', options: ['real', 'longest'] },
      { key: 'badges', label: 'Badges', value: 'on', options: ['on', 'off'] }
    ],
    render: function (mount, v) {
      var host = el('div');
      host.style.cssText = 'display:flex;gap:var(--sp-4);width:100%;align-items:flex-start';
      var r = rail(v.mode === 'icons' ? 'icons' : 'expanded');
      if (v.mode === 'drawer') {
        r.style.boxShadow = 'var(--wm-raise-shadow)';
        r.style.borderRadius = 'var(--r-md)';
      }
      r.querySelectorAll('.rail-item').forEach(function (a) {
        a.removeAttribute('aria-current');
        var href = a.getAttribute('href');
        var want = { home: 'index.html', sections: 'sections.html', run: 'run.html', none: '' }[v.active];
        if (href === want) a.setAttribute('aria-current', 'page');
        if (v.badges === 'off') a.querySelectorAll('.rail-badge,.badge').forEach(function (b) { b.remove(); });
        if (v.labels === 'longest' && v.mode !== 'icons') {
          var s = a.querySelector('span:not(.rail-badge):not(.badge)');
          if (s) s.textContent = 'Globally installed packages audit';
        }
      });
      host.appendChild(r);
      var note = el('div');
      note.style.flex = '1';
      note.appendChild(el('p', 't-sm ink-3',
        v.mode === 'icons'
          ? 'Collapsed to icons: every item keeps an aria-label, so the accessible name never depends on the visible text.'
          : v.mode === 'drawer'
            ? 'Below 760px the window cannot go, but the drawer shape is what the rail becomes if it ever does.'
            : 'One registry, iterated once. A project that hand-copied its sidebar into 31 pages had them drift within a week.'));
      if (v.labels === 'longest') {
        note.appendChild(el('p', 't-xs ink-3',
          'The longest real section title. A rail tuned on "Home" is where truncation bugs live.'));
      }
      host.appendChild(note);
      mount.appendChild(host);
    }
  });

  /* ---- shell + rail ------------------------------------------------------- */
  var s = G.section('shell', 'The app shell', 'every screen');
  G.row(s, [
    { label: 'expanded', node: rail('expanded') },
    { label: 'collapsed to icons', node: rail('icons') }
  ]);
  G.note(s, 'The title bar is a custom drag region because the window is frameless; the status bar carries ' +
    'the engine version, the log path and the sync state. Both are bleed bands, so they rebind the ink ' +
    'tokens - and anything inside them that paints its own surface restores the base inks, which is the ' +
    'general fix for a defect that shipped twice at 1.05:1 and 1.09:1.');

  /* ---- tabs ---------------------------------------------------------------- */
  var t = G.section('tabs', 'Tabs', 'settings.html, report.html');
  var tabs = el('div', 'tabs');
  var list = el('div', 'tablist');
  list.setAttribute('role', 'tablist');
  var panels = el('div');
  [['General', 'Developer mode, the idle window, the temp window and the large-file threshold.'],
   ['Scanning', 'Which folders are searched for stale build artefacts, and what is excluded.'],
   ['Notifications', 'Whether a finished run raises a toast, and whether the weekly task does.'],
   ['Privacy', 'The four analytics destinations, each individually revocable.'],
   ['Disabled', null]].forEach(function (x, i) {
    var id = 'tab-' + i;
    var b = el('button', 'tab', x[0]);
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.id = id + '-t';
    b.setAttribute('aria-controls', id);
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    if (!x[1]) {
      b.setAttribute('aria-disabled', 'true');
      b.title = 'Sign in first – these settings sync with your account.';
    }
    list.appendChild(b);
    var p = el('div', 't-sm');
    p.id = id;
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('aria-labelledby', id + '-t');
    p.tabIndex = 0;
    p.textContent = x[1] || '';
    p.hidden = i !== 0;
    panels.appendChild(p);
  });
  tabs.appendChild(list);
  tabs.appendChild(panels);
  var trow = el('div', 'spec-row');
  trow.setAttribute('data-stack', '');
  trow.appendChild(tabs);
  t.appendChild(trow);
  G.note(t, 'One tab stop for the list, arrows to move within it. A row of buttons looks identical and ' +
    'gives every tab its own tab stop.');

  /* ---- breadcrumbs, pagination, stepper ------------------------------------ */
  var b = G.section('crumbs', 'Breadcrumbs, pagination, stepper', 'report.html, history.html');
  var cr = el('ol', 'crumbs');
  [['History', '#'], ['2026-09-04 09:14', '#'], ['Section 7 · chromium', null]].forEach(function (x) {
    var li = el('li');
    if (x[1]) { var a = el('a', 'lnk', x[0]); a.href = x[1]; li.appendChild(a); }
    else { var sp = el('span', 'crumb-trunc', x[0]); sp.setAttribute('aria-current', 'page'); li.appendChild(sp); }
    cr.appendChild(li);
  });

  var pg = el('div', 'pager');
  pg.appendChild(G.btn('Previous', 'btn-sm', { disabled: true }));
  ['1', '2', '3'].forEach(function (n, i) {
    pg.appendChild(G.btn(n, 'btn-sm', i === 1 ? { 'aria-current': 'page' } : {}));
  });
  pg.appendChild(el('span', 'pager-gap', '…'));
  pg.appendChild(G.btn('9', 'btn-sm'));
  pg.appendChild(G.btn('Next', 'btn-sm'));

  var pg2 = el('div', 'pager');
  pg2.appendChild(G.btn('Load 20 more runs', 'btn-sm'));
  pg2.appendChild(el('span', 't-xs ink-3', 'showing 20 of 143'));

  G.row(b, [
    { label: 'breadcrumbs, with truncation', node: cr },
    { label: 'numbered', node: pg },
    { label: 'load-more', node: pg2, why: 'the cloud list uses this: limit 20 plus a cursor, never fetch-all' }
  ], { stack: true });

  /* ---- command palette ------------------------------------------------------ */
  var cp = G.section('palette', 'Command palette', 'every screen · Ctrl+K');
  var open = G.btn('Open the palette', 'btn-primary');
  open.addEventListener('click', function () { window.wsWidgets.openDialog('cmdk'); });
  var hint = el('p', 't-sm ink-3');
  hint.appendChild(document.createTextNode('Or press '));
  hint.appendChild(el('span', 'kbd', 'Ctrl'));
  hint.appendChild(document.createTextNode(' '));
  hint.appendChild(el('span', 'kbd', 'K'));
  hint.appendChild(document.createTextNode(' anywhere.'));
  G.row(cp, [{ node: open }, { node: hint }]);
  G.note(cp, 'Twenty-six sections earn a palette: typing "chrome" reaches section 7 in two keystrokes, ' +
    'where the rail would take a page load and a scan of a table.');

  /* build it once, into the body */
  (function () {
    var scrim = el('div', 'cmdk-scrim');
    scrim.id = 'cmdk';
    var box = el('div', 'cmdk');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Command palette');
    var input = el('input', 'cmdk-in');
    input.type = 'search';
    input.placeholder = 'Jump to a section, or run a command…';
    input.setAttribute('aria-label', 'Search commands and sections');
    input.setAttribute('data-autofocus', '');
    box.appendChild(input);
    var list2 = el('div', 'cmdk-list');
    list2.setAttribute('role', 'listbox');
    list2.appendChild(el('div', 'menu-label', 'Commands'));
    [['Preview everything (dry run)', 'D'], ['Start the safe run', '⏎'], ['Open the last report', 'R']].forEach(function (x) {
      var i = el('button', 'menu-item');
      i.type = 'button';
      i.appendChild(el('span', null, x[0]));
      i.appendChild(el('span', 'kbd', x[1]));
      list2.appendChild(i);
    });
    list2.appendChild(el('div', 'menu-label', 'Sections'));
    S.SECTIONS.slice(0, 12).forEach(function (s2) {
      var i = el('button', 'menu-item');
      i.type = 'button';
      i.appendChild(el('span', 'num t-2xs ink-3', String(s2.id)));
      i.appendChild(el('span', null, s2.key));
      i.appendChild(el('span', 't-xs ink-3', s2.title.slice(0, 46)));
      list2.appendChild(i);
    });
    var none = el('div', 'lbox-empty', 'Nothing matches that.');
    none.setAttribute('data-cmdk-empty', '');
    none.hidden = true;
    list2.appendChild(none);
    box.appendChild(list2);
    scrim.appendChild(box);
    document.body.appendChild(scrim);
  })();

  G.trims(G.section('nav-trims', 'Trims', 'stated, not silent'), [
    ['Bottom navigation', 'the window has a 760px minimum; there is no mobile target.'],
    ['Mega menu', 'eleven screens do not need one.'],
    ['A URL bar or back/forward chrome', 'this is a desktop window, not a browser – the rail is the whole map.']
  ]);

  window.wsWidgets.boot();
  window.wsPlayground.boot();
})();
