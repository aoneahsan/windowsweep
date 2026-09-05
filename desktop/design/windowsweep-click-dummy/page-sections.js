/* ============================================================================
   Sections - the catalogue browser. The COCKPIT regime.

   Every row is real: id, key, title, tier, batch policy, admin and developer
   flags all come from lib/constants.ps1 via seed.js. The bytes are demo data.
   ============================================================================ */
(function () {
  'use strict';

  var db = window.wsdb, S = window.wsSeed, ws = window.ws;
  var el = ws.el, fmt = db.fmt;
  var filter = 'all', search = '';

  function bytesFor(id) {
    var row = db.derive.bySection().filter(function (r) { return r.section === id; })[0];
    if (row) return row.bytes;
    var cands = S.CANDIDATES.filter(function (c) { return c.section === id; });
    return cands.reduce(function (a, c) { return a + c.bytes; }, 0);
  }

  function targetsFor(id) {
    var t = S.TARGETS.filter(function (x) { return x.section === id && x.bytes > 0; });
    if (t.length) return t.map(function (x) {
      return { label: x.label, path: x.path, bytes: x.bytes, idle: x.idle };
    });
    return S.CANDIDATES.filter(function (c) { return c.section === id; }).map(function (c) {
      return { label: c.project || 'candidate', path: c.path, bytes: c.bytes, idle: c.idle };
    });
  }

  function matches(s) {
    if (search) {
      var hay = (s.key + ' ' + s.title + ' ' + s.id).toLowerCase();
      if (hay.indexOf(search) === -1) return false;
    }
    switch (filter) {
      case 'safe':        return S.SAFE_BATCH.indexOf(s.id) !== -1 || S.SAFE_BATCH_ADMIN.indexOf(s.id) !== -1;
      case 'interactive': return s.batch === 'interactive';
      case 'admin':       return s.admin;
      case 'deep':        return s.batch === 'deep';
      case 'report':      return s.tier === 'report';
      case 'dev':         return s.dev;
      default:            return true;
    }
  }

  function badgeFor(text, cls) { return el('span', 'badge ' + cls, text); }

  function render() {
    var tb = document.querySelector('[data-ws-sections]');
    if (!tb) return;
    tb.textContent = '';
    var shown = 0;

    S.SECTIONS.forEach(function (s) {
      if (!matches(s)) return;
      shown++;
      var selected = db.facts.selection.indexOf(s.id) !== -1;
      var bytes = bytesFor(s.id);
      var reportOnly = s.tier === 'report' || s.tier === 'config';

      var tr = el('tr');
      tr.setAttribute('data-selected', selected ? 'true' : 'false');
      tr.dataset.id = String(s.id);

      // select
      var tdSel = el('td');
      if (!reportOnly) {
        var sw = el('button', 'switch');
        sw.style.setProperty('--sw-w', 'calc(1.9rem * var(--density))');
        sw.setAttribute('role', 'switch');
        sw.setAttribute('aria-checked', selected ? 'true' : 'false');
        sw.setAttribute('aria-label', 'Select section ' + s.id + ', ' + s.key);
        sw.addEventListener('click', function (e) {
          e.stopPropagation();
          db.toggleSelected(s.id);
          render(); paintSelbar();
        });
        tdSel.appendChild(sw);
      } else {
        var dash = el('span', 't-xs ink-3', '—');
        dash.title = 'Report only - there is nothing to select';
        tdSel.appendChild(dash);
      }
      tr.appendChild(tdSel);

      // id
      var tdId = el('td', 'num t-sm ink-3', String(s.id));
      tr.appendChild(tdId);

      // name + title
      var tdName = el('td');
      var top = el('div');
      top.style.display = 'flex'; top.style.alignItems = 'center'; top.style.gap = 'var(--sp-2)';
      var key = el('span', 't-sm'); key.style.fontWeight = '600'; key.textContent = s.key;
      top.appendChild(key);
      if (s.dev) top.appendChild(badgeFor('dev', 'badge-outline'));
      tdName.appendChild(top);
      var ttl = el('div', 't-xs ink-3', s.title);
      ttl.style.maxWidth = '46rem';
      ttl.style.overflow = 'hidden';
      ttl.style.textOverflow = 'ellipsis';
      ttl.style.whiteSpace = 'nowrap';
      tdName.appendChild(ttl);
      tr.appendChild(tdName);

      // tier
      var tdTier = el('td');
      var tier = el('span', 'tier tier-' + s.tier);
      tier.appendChild(el('span', 't-xs', s.tier));
      tdTier.appendChild(tier);
      tr.appendChild(tdTier);

      // batch
      var tdBatch = el('td');
      tdBatch.appendChild(badgeFor(s.batch,
        s.batch === 'safe' ? 'badge-neutral'
        : s.batch === 'interactive' ? 'badge-warn'
        : s.batch === 'deep' ? 'badge-danger' : 'badge-outline'));
      tr.appendChild(tdBatch);

      // needs
      var tdNeeds = el('td');
      if (s.admin) tdNeeds.appendChild(badgeFor('admin', 'badge-danger'));
      else if (s.batch === 'interactive') tdNeeds.appendChild(badgeFor('you', 'badge-warn'));
      else tdNeeds.appendChild(el('span', 't-xs ink-3', '—'));
      tr.appendChild(tdNeeds);

      // bytes
      var tdB = el('td', 'num-cell t-sm');
      tdB.textContent = reportOnly ? '—' : fmt.bytes(bytes);
      if (!reportOnly && bytes > 0) tdB.classList.add('accent-ink');
      tr.appendChild(tdB);

      // expand
      var tdEx = el('td');
      var ex = el('button', 'btn btn-sm btn-ghost');
      ex.setAttribute('aria-expanded', 'false');
      ex.setAttribute('aria-label', 'Show what section ' + s.id + ' touches');
      ex.textContent = '▾';
      tdEx.appendChild(ex);
      tr.appendChild(tdEx);

      tb.appendChild(tr);

      // detail row - what this section actually declares
      var detail = el('tr', 'detail-row');
      detail.hidden = true;
      var dtd = el('td');
      dtd.colSpan = 8;
      var list = targetsFor(s.id);
      if (!list.length) {
        dtd.appendChild(el('p', 't-xs ink-3',
          reportOnly ? 'This section writes a report and deletes nothing.'
                     : 'Nothing declared on this machine right now.'));
      } else {
        var grid = el('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'minmax(0,1fr) auto auto';
        grid.style.gap = 'var(--sp-1) var(--sp-4)';
        list.forEach(function (t) {
          var p = el('span', 'mono t-xs', t.path);
          p.style.overflow = 'hidden'; p.style.textOverflow = 'ellipsis';
          grid.appendChild(p);
          grid.appendChild(el('span', 'num t-xs ink-3', fmt.bytes(t.bytes)));
          grid.appendChild(el('span', 't-xs ink-3', 'idle ' + t.idle + 'd'));
        });
        dtd.appendChild(grid);
      }
      detail.appendChild(dtd);
      tb.appendChild(detail);

      ex.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = detail.hidden;
        detail.hidden = !open;
        ex.setAttribute('aria-expanded', open ? 'true' : 'false');
        ex.textContent = open ? '▴' : '▾';
      });
    });

    if (!shown) {
      var tr0 = el('tr');
      var td0 = el('td'); td0.colSpan = 8;
      td0.style.padding = 'var(--sp-8)';
      td0.style.textAlign = 'center';
      td0.appendChild(el('p', 't-md wide', 'No section matches that.'));
      td0.appendChild(el('p', 't-xs ink-3', 'All 26 are still there. The filter is narrow.'));
      tr0.appendChild(td0); tb.appendChild(tr0);
    }

    window.wsWire.setText('shownCount', String(shown));
  }

  function paintSelbar() {
    var bar = document.querySelector('[data-ws-selbar]');
    if (!bar) return;
    var sel = db.facts.selection;
    bar.hidden = sel.length === 0;
    var total = sel.reduce(function (a, id) { return a + bytesFor(id); }, 0);
    window.wsWire.setText('selCount', String(sel.length));
    window.wsWire.setText('selBytes', fmt.bytes(total));

    var needsPerson = sel.filter(function (id) { return db.section[id].batch === 'interactive'; });
    var needsAdmin = sel.filter(function (id) { return db.section[id].admin; });
    var warn = [];
    if (needsAdmin.length) warn.push(needsAdmin.length + ' need an elevated window');
    if (needsPerson.length) warn.push(needsPerson.length + ' need you to pick items');
    window.wsWire.setText('selWarn', warn.join(' · '));
  }

  window.wsPage = {
    init: function () {
      render();
      paintSelbar();
      window.wsWire.setText('catalogueTotal', fmt.bytes(db.derive.reclaimable()));

      document.querySelectorAll('[data-ws-filter]').forEach(function (b) {
        b.addEventListener('click', function () {
          filter = b.dataset.wsFilter;
          document.querySelectorAll('[data-ws-filter]').forEach(function (o) {
            o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
          });
          render();
        });
      });

      var s = document.querySelector('[data-ws-search]');
      if (s) s.addEventListener('input', function () {
        search = s.value.trim().toLowerCase();
        render();
      });

      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        var a = t.dataset.wsAction;
        if (a === 'selClear') {
          var prev = db.facts.selection.slice();
          db.setSelection([]);
          render(); paintSelbar();
          ws.toast('Selection cleared.', {
            undo: function () { db.setSelection(prev); render(); paintSelbar(); }
          });
        }
        if (a === 'selDry') {
          t.dataset.state = 'pending';
          setTimeout(function () {
            delete t.dataset.state;
            ws.toast('Dry-run across ' + db.facts.selection.length + ' sections. Nothing was deleted.');
          }, 850);
        }
        if (a === 'selRun') {
          var interactive = db.facts.selection.filter(function (id) {
            return db.section[id].batch === 'interactive';
          });
          if (interactive.length) {
            ws.toast('Sections ' + interactive.join(', ') + ' need you to choose items first. ' +
                     'Nothing was run.', { assertive: true });
            return;
          }
          location.href = 'run.html';
        }
      });
    }
  };
})();
