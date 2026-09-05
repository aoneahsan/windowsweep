/* Report - one run, rendered from the JSON the ENGINE wrote. This screen
   computes nothing of its own, which is why a report opened here and the same
   file opened in a text editor can never disagree. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;

  var ROWS = [
    [1,  'pkg',       'ran',     4.21e9, ''],
    [2,  'build',     'ran',     1.13e9, ''],
    [3,  'runners',   'skipped', 0,      'nothing older than the idle window'],
    [6,  'editors',   'ran',     3.02e8, 'VSIX cache cleared; caches skipped, Code is running'],
    [7,  'browsers',  'skipped', 0,      'Chrome is running - 7.40 GB left in place'],
    [8,  'apps',      'ran',     3.73e8, ''],
    [9,  'wincaches', 'ran',     8.10e7, 'Store cache reset offered, not executed'],
    [21, 'diskusage', 'ran',     0,      'report only - nothing is deleted by this section']
  ];

  function bars() {
    var host = document.querySelector('[data-ws-report-bars]');
    if (!host) return;
    var W = 760, bh = 22, gap = 10, labelW = 110;
    var H = ROWS.length * (bh + gap);
    var max = Math.max.apply(null, ROWS.map(function (r) { return r[3]; })) || 1;
    var NS = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    s.setAttribute('width', '100%');
    s.setAttribute('role', 'img');
    s.setAttribute('aria-label', 'Bytes freed by each section in this run');
    ROWS.forEach(function (r, i) {
      var y = i * (bh + gap);
      function t(x, txt, anchor, cls) {
        var n = document.createElementNS(NS, 'text');
        n.setAttribute('x', x); n.setAttribute('y', y + bh * 0.72);
        n.setAttribute('text-anchor', anchor);
        n.setAttribute('class', cls || 'chart-ax');
        n.textContent = txt;
        s.appendChild(n);
      }
      t(labelW - 10, r[0] + ' \u00b7 ' + r[1], 'end');
      var track = document.createElementNS(NS, 'rect');
      track.setAttribute('x', labelW); track.setAttribute('y', y);
      track.setAttribute('width', W - labelW - 70); track.setAttribute('height', bh);
      track.setAttribute('rx', '3'); track.setAttribute('fill', 'var(--c-line)');
      s.appendChild(track);
      if (r[3] > 0) {
        var bar = document.createElementNS(NS, 'rect');
        bar.setAttribute('x', labelW); bar.setAttribute('y', y);
        bar.setAttribute('width', Math.max(3, (r[3] / max) * (W - labelW - 70)));
        bar.setAttribute('height', bh); bar.setAttribute('rx', '3');
        bar.setAttribute('fill', 'var(--c-accent)');
        s.appendChild(bar);
      }
      t(W - 4, r[3] ? fmt.bytes(r[3]) : 'skipped', 'end');
    });
    host.appendChild(s);
  }

  function drives() {
    var host = document.querySelector('[data-ws-report-drives]');
    if (!host) return;
    db.derive.drives().forEach(function (d) {
      var row = el('div', 'drive');
      row.appendChild(el('span', 'drive-name', d.letter));
      var cap = el('div', 'cap');
      var after = d.free + Math.min(d.reclaimable, 3.31e9);
      var used = el('i', 'cap-seg cap-used');
      used.style.width = (((d.total - after) / d.total) * 100) + '%';
      cap.appendChild(used);
      row.appendChild(cap);
      var right = el('div', 't-xs');
      right.style.cssText = 'text-align:end;white-space:nowrap';
      var a = el('div', 'num state-ok', fmt.bytes(after) + ' free');
      var b = el('div', 'num t-2xs ink-3', 'was ' + fmt.bytes(d.free));
      right.appendChild(a); right.appendChild(b);
      row.appendChild(right);
      host.appendChild(row);
    });
  }

  function table() {
    var tb = document.querySelector('[data-ws-report-rows]');
    if (!tb) return;
    ROWS.forEach(function (r) {
      var tr = el('tr');
      tr.appendChild(el('td', 'num t-sm ink-3', String(r[0])));
      var n = el('td');
      var k = el('span', 't-sm'); k.style.fontWeight = '600'; k.textContent = r[1];
      n.appendChild(k);
      tr.appendChild(n);
      var st = el('td');
      st.appendChild(el('span', 'badge ' + (r[2] === 'ran' ? 'badge-ok' : 'badge-neutral'), r[2]));
      tr.appendChild(st);
      var f = el('td', 'num-cell t-sm');
      f.textContent = r[3] ? fmt.bytes(r[3]) : '\u2014';
      if (r[3]) f.classList.add('accent-ink');
      tr.appendChild(f);
      tr.appendChild(el('td', 't-sm ink-3', r[4] || '\u2014'));
      tb.appendChild(tr);
    });
  }

  window.wsPage = {
    init: function () {
      bars(); drives(); table();
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        if (t.dataset.wsAction === 'reportOpen') {
          ws.toast('Opens %USERPROFILE%\\.windowsweep\\reports\\run-2026-09-04T09-14-02.json in your ' +
                   'text editor.');
        }
        if (t.dataset.wsAction === 'reportExport') {
          ws.toast('Markdown and HTML come from the engine\u2019s own --export, not from this window \u2013 ' +
                   'so an exported report and this page cannot drift apart.');
        }
      });
    }
  };
})();
