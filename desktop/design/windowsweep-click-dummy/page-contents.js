/* Contents - the inventory, rendered. Progress is counted from THIS list, never
   from ls: ls counts archives, galleries and this page as product screens and
   always over-reports. */
(function () {
  'use strict';
  var ws = window.ws, el = ws.el;

  var SCREENS = [
    ['1', 'Home', 'index.html', 'The Reclaim Map, the readout, and fourteen zones.', 'moment'],
    ['2', 'Sections', 'sections.html', 'All 26, filterable, selectable, expandable.', 'cockpit'],
    ['3', 'Run', 'run.html', 'Determinate progress from the engine\u2019s own ##windowsweep lines.', 'moment'],
    ['4', 'Splash', 'splash.html', 'Boot and the update gate.', 'moment'],
    ['5', 'Consent', 'consent.html', 'Four providers, all off until answered.', 'moment'],
    ['6', 'Picker', 'picker.html', 'Sections 17, 18, 19 and 23 \u2013 nothing pre-selected.', 'cockpit'],
    ['7', 'History', 'history.html', 'Local runs in full, cloud runs as summaries.', 'cockpit'],
    ['8', 'Report', 'report.html', 'One run, rendered from its JSON.', 'cockpit'],
    ['9', 'Account', 'account.html', 'Optional sign-in, for sync only.', 'moment'],
    ['10', 'Settings', 'settings.html', 'Five tabs, every control a real engine flag.', 'cockpit'],
    ['11', 'Elevation', 'elevation.html', 'What needs a UAC click, and the SmartScreen note.', 'moment']
  ];

  window.wsPage = {
    init: function () {
      var host = document.querySelector('[data-ws-contents]');
      if (!host) return;

      var h1 = el('h2', 't-lg wide', 'Screens');
      host.appendChild(h1);
      var grid = el('div', 'spec-grid');
      grid.style.cssText = 'display:grid;gap:var(--sp-4);grid-template-columns:repeat(auto-fit,minmax(min(17rem,100%),1fr));margin-block:var(--sp-4) var(--sp-8)';
      SCREENS.forEach(function (s) {
        var a = el('a', 'card');
        a.href = s[2];
        var bd = el('div', 'card-bd');
        var top = el('div');
        top.style.cssText = 'display:flex;align-items:center;gap:var(--sp-2)';
        top.appendChild(el('span', 'num t-sm ink-3', s[0]));
        top.appendChild(el('span', 't-md wide', s[1]));
        top.appendChild(el('span', 'badge badge-outline', s[4]));
        bd.appendChild(top);
        bd.appendChild(el('p', 't-sm ink-3', s[3]));
        bd.appendChild(el('p', 'mono t-xs ink-3', s[2]));
        a.appendChild(bd);
        grid.appendChild(a);
      });
      host.appendChild(grid);

      var h2 = el('h2', 't-lg wide', 'Component library');
      host.appendChild(h2);
      var grid2 = el('div');
      grid2.style.cssText = 'display:grid;gap:var(--sp-3);grid-template-columns:repeat(auto-fit,minmax(min(15rem,100%),1fr));margin-block:var(--sp-4) var(--sp-8)';
      [['Index + actions', 'gallery.html'], ['Typography', 'gallery-typography.html'],
       ['Forms', 'gallery-forms.html'], ['Tables', 'gallery-tables.html'],
       ['Display', 'gallery-display.html'], ['Navigation', 'gallery-navigation.html'],
       ['Overlays', 'gallery-overlays.html'], ['Charts', 'gallery-charts.html']].forEach(function (g, i) {
        var a = el('a', 'card');
        a.href = g[1];
        var bd = el('div', 'card-bd');
        bd.appendChild(el('p', 'caps ink-3', (i + 1) + ' of 8'));
        bd.appendChild(el('p', 't-base wide', g[0]));
        a.appendChild(bd);
        grid2.appendChild(a);
      });
      host.appendChild(grid2);

      var tot = el('div', 'note note-info');
      tot.appendChild(el('span', null, 'i'));
      tot.appendChild(el('span', null,
        SCREENS.length + ' screens and 8 gallery files \u2013 19 reviewable pages. The archived rejected ' +
        'direction under _rejected/ is not counted, and neither is this page.'));
      host.appendChild(tot);
    }
  };
})();
