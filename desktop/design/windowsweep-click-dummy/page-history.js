/* History - local runs in full, cloud runs as summaries. The label is the point:
   a synced row carries a date, a byte count and a section count, and nothing
   that could identify a machine or a path. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;

  var filter = 'all', shown = 6;

  function all() {
    var local = S.RUNS.map(function (r, i) {
      return { at: r.at, freed: r.freed, sections: r.sections, mode: r.mode,
               where: 'this machine', cloud: false, dry: i === 2 };
    });
    /* Rows from another machine, deliberately thin - that IS the design. They
       exist only when signed in: showing them signed out would be claiming a
       sync that is not happening. */
    var cloud = db.facts.signedIn ? [
      { at: new Date(Date.now() - 4 * 864e5), freed: 8.4e9, sections: 9, mode: null, where: 'laptop', cloud: true },
      { at: new Date(Date.now() - 21 * 864e5), freed: 2.2e9, sections: 4, mode: null, where: 'laptop', cloud: true }
    ] : [];
    return local.concat(cloud).sort(function (a, b) { return b.at - a.at; });
  }

  function match(r) {
    if (filter === 'local') return !r.cloud;
    if (filter === 'cloud') return r.cloud;
    if (filter === 'dry') return !!r.dry;
    return true;
  }

  function paint() {
    var list = all().filter(match);
    var tb = document.querySelector('[data-ws-hist-rows]');
    if (!tb) return;
    tb.textContent = '';

    if (!list.length) {
      var tr0 = el('tr'); var td0 = el('td'); td0.colSpan = 6;
      var e = el('div', 'empty');
      e.appendChild(el('h3', null, filter === 'cloud' ? 'No runs from other machines' : 'No runs yet'));
      e.appendChild(el('p', null, filter === 'cloud'
        ? (db.facts.signedIn
            ? 'None of your other machines has run windowsweep yet.'
            : 'Sign in and your other machines’ run summaries appear here. Nothing syncs while you are signed out.')
        : 'windowsweep has not run on this machine yet. A dry-run costs nothing and deletes nothing.'));
      td0.appendChild(e); tr0.appendChild(td0); tb.appendChild(tr0);
    }

    list.slice(0, shown).forEach(function (r) {
      var tr = el('tr');
      var when = el('td');
      when.appendChild(el('div', 't-sm', fmt.relDate(r.at)));
      when.appendChild(el('div', 't-xs ink-3', r.at.toISOString().slice(0, 16).replace('T', ' ')));
      tr.appendChild(when);

      var md = el('td');
      md.appendChild(el('span', 'badge ' + (r.dry ? 'badge-outline' : 'badge-neutral'),
        r.dry ? 'dry-run' : 'real run'));
      tr.appendChild(md);

      var sec = el('td');
      if (r.cloud) {
        var s = el('div');
        s.style.cssText = 'display:flex;align-items:center;gap:var(--sp-2);flex-wrap:wrap';
        s.appendChild(el('span', 't-sm ink-3', r.sections + ' sections'));
        s.appendChild(el('span', 'badge badge-outline', 'summary only'));
        sec.appendChild(s);
      } else {
        sec.appendChild(el('div', 't-sm', r.mode));
        sec.appendChild(el('div', 't-xs ink-3', r.sections + ' sections'));
      }
      tr.appendChild(sec);

      tr.appendChild(el('td', 't-sm ink-3', r.where));

      var fr = el('td', 'num-cell t-sm');
      fr.textContent = fmt.bytes(r.freed);
      if (!r.dry) fr.classList.add('accent-ink');
      tr.appendChild(fr);

      var op = el('td');
      var b = el('a', 'btn btn-sm btn-ghost', r.cloud ? '\u2014' : '\u203a');
      if (r.cloud) {
        b = el('span', 't-xs ink-3', '\u2014');
        b.title = 'The full report stays on the machine that made it.';
      } else {
        b.href = 'report.html';
        b.setAttribute('aria-label', 'Open this run\u2019s report');
      }
      op.appendChild(b);
      tr.appendChild(op);
      tb.appendChild(tr);
    });

    window.wsWire.setText('histShown', String(Math.min(shown, list.length)));
    window.wsWire.setText('histAll', String(list.length));
    window.wsWire.setText('histCount', String(list.filter(function (r) { return !r.dry; }).length));
    window.wsWire.setText('histTotal',
      fmt.bytes(list.filter(function (r) { return !r.dry; })
                    .reduce(function (a, r) { return a + r.freed; }, 0)));
  }

  function spark() {
    var host = document.querySelector('[data-ws-hist-spark]');
    if (!host || !window.d3) return;
    var vals = S.RUNS.map(function (r) { return r.freed; });
    var W = 900, H = 90, pad = 6;
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    s.setAttribute('width', '100%');
    s.setAttribute('height', String(H));
    s.setAttribute('role', 'img');
    s.setAttribute('aria-label', 'Bytes freed by each of the last ' + vals.length + ' runs');
    var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    var span = (max - min) || 1;
    var d = '';
    vals.forEach(function (v, i) {
      var x = pad + (i / Math.max(1, vals.length - 1)) * (W - pad * 2);
      var y = H - pad - ((v - min) / span) * (H - pad * 2);
      d += (d ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 3);
      c.setAttribute('fill', 'var(--c-accent)');
      s.appendChild(c);
    });
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--c-accent)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linejoin', 'round');
    s.insertBefore(path, s.firstChild);
    host.appendChild(s);
  }

  window.wsPage = {
    init: function () {
      paint(); spark();
      document.querySelectorAll('[data-ws-hist]').forEach(function (b) {
        b.addEventListener('click', function () {
          filter = b.dataset.wsHist;
          document.querySelectorAll('[data-ws-hist]').forEach(function (o) {
            o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
          });
          paint();
        });
      });
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action="histMore"]');
        if (!t) return;
        shown += 20;
        paint();
        ws.toast('Loaded the next page \u2013 twenty at a time with a cursor, never the whole table.');
      });
    }
  };
})();
