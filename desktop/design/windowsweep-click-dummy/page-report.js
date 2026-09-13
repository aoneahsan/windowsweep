/* Report - one run, rendered from the JSON the ENGINE wrote. This screen
   computes nothing of its own, which is why a report opened here and the same
   file opened in a text editor can never disagree.

   Amended 2026-09-13 (GATE 4 round 8, D-42) - the first time this screen was judged
   with data. What changed, and why, is in design/README.md; in short:
   - the heading and the meta line are READ OFF the steps below them - the old static
     line said "5 ran, 3 skipped" over a table showing six and two, and "Freed
     3.31 GB" over rows that add up to 5.7 GB;
   - an empty bar reads as what happened: a status word when the section did not run,
     "0 B" when it ran and freed nothing (section 21 read "skipped" beside "ran");
   - a drive wears the success tick only when it gained space;
   - "Show the JSON" opens the file in the window, read-only;
   - "Where this file lives" names the run's own file in the window's layout;
   - report.html?dry=1 draws a dry-run's report and ?empty=1 the screen before any run. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;

  var q = new URLSearchParams(location.search);
  var DRY = q.get('dry') === '1';
  var EMPTY = q.get('empty') === '1';
  /* ?gone=1: a link names a run that has left the list. ?unreadable=1 / =missing: the
     run is on record but its file cannot be shown. Both are states the window has. */
  var GONE = q.get('gone') === '1';
  var UNREADABLE = q.get('unreadable');

  /* demo-data: one run's steps as lib/log.ps1 Add-ReportStep records them -
     section, key, status, bytes, note. A dry-run's steps carry the status 'dry-run'. */
  var STEPS = [
    [1,  'pkg',       'ran',     4.21e9, ''],
    [2,  'build',     'ran',     1.13e9, ''],
    [3,  'runners',   'skipped', 0,      'nothing older than the idle window'],
    [6,  'editors',   'ran',     3.02e8, 'VSIX cache cleared; caches skipped, Code is running'],
    [7,  'browsers',  'skipped', 0,      'Chrome is running - 7.40 GB left in place'],
    [8,  'apps',      'ran',     3.73e8, ''],
    [9,  'wincaches', 'ran',     8.10e7, 'Store cache reset offered, not executed'],
    [21, 'diskusage', 'ran',     0,      'report only - nothing is deleted by this section']
  ].map(function (r) {
    return { id: r[0], key: r[1], status: DRY && r[2] === 'ran' ? 'dry-run' : r[2], freed: r[3], note: r[4] };
  });
  var DURATION = 17;
  /* demo-data: the window gives each run its own folder under its local data and
     passes it as --reports-dir; the engine names the file report-<stamp>-<pid>.json. */
  var FILE = 'report-2026-09-04_091402-4412.json';
  var PATH = 'C:\\Users\\you\\AppData\\Local\\com.aoneahsan.windowsweep\\runs\\2026-09-04-04-14-02-k3x9qa\\' + FILE;

  var total = STEPS.reduce(function (a, s) { return a + s.freed; }, 0);

  /* "Safe batch · 8 sections attempted · 6 ran · 2 skipped · nothing refused · 17
     seconds": ran counts ran and dry-run, the engine's own grouping; a refusal and a
     failure are named in the same line whenever there is one. */
  function metaLine() {
    var ran = 0, skipped = 0, refused = 0, failed = 0;
    STEPS.forEach(function (s) {
      if (s.status === 'ran' || s.status === 'dry-run') ran++;
      else if (s.status === 'refused') refused++;
      else if (s.status === 'failed') failed++;
      else skipped++;
    });
    /* "safe batch" - History's word for the same run (one vocabulary, D-44) */
    var parts = ['safe batch',
      STEPS.length + (STEPS.length === 1 ? ' section attempted' : ' sections attempted'),
      ran + ' ran', skipped + ' skipped', refused ? refused + ' refused' : 'nothing refused'];
    if (failed) parts.push(failed + ' failed');
    parts.push(DURATION + ' seconds');
    return parts.join(' \u00b7 ');
  }

  function header() {
    var title = document.querySelector('[data-ws-report-title]');
    if (title) title.textContent = DRY ? 'A dry-run would reclaim ' + fmt.bytes(total) : 'Freed ' + fmt.bytes(total);
    var meta = document.querySelector('[data-ws-report-meta]');
    if (meta) meta.textContent = metaLine();
    var bt = document.querySelector('[data-ws-report-bars-title]');
    if (bt) bt.textContent = DRY ? 'What each section would free' : 'What each section freed';
    var col = document.querySelector('[data-ws-report-freed-col]');
    if (col) col.textContent = DRY ? 'Would free' : 'Freed';
    var path = document.querySelector('[data-ws-report-path]');
    if (path) path.textContent = PATH;
  }

  function bars() {
    var host = document.querySelector('[data-ws-report-bars]');
    if (!host) return;
    var W = 760, bh = 22, gap = 10, labelW = 110;
    var H = STEPS.length * (bh + gap);
    var max = Math.max.apply(null, STEPS.map(function (s) { return s.freed; })) || 1;
    var NS = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    s.setAttribute('width', '100%');
    s.setAttribute('role', 'img');
    s.setAttribute('aria-label', DRY ? 'Bytes each section would free in this dry-run'
      : 'Bytes freed by each section in this run');
    STEPS.forEach(function (r, i) {
      var y = i * (bh + gap);
      function t(x, txt, anchor, cls) {
        var n = document.createElementNS(NS, 'text');
        n.setAttribute('x', x); n.setAttribute('y', y + bh * 0.72);
        n.setAttribute('text-anchor', anchor);
        n.setAttribute('class', cls || 'chart-ax');
        n.textContent = txt;
        s.appendChild(n);
      }
      t(labelW - 10, r.id + ' \u00b7 ' + r.key, 'end');
      var track = document.createElementNS(NS, 'rect');
      track.setAttribute('x', labelW); track.setAttribute('y', y);
      track.setAttribute('width', W - labelW - 70); track.setAttribute('height', bh);
      track.setAttribute('rx', '3'); track.setAttribute('fill', 'var(--c-line)');
      s.appendChild(track);
      if (r.freed > 0) {
        var bar = document.createElementNS(NS, 'rect');
        bar.setAttribute('x', labelW); bar.setAttribute('y', y);
        bar.setAttribute('width', Math.max(3, (r.freed / max) * (W - labelW - 70)));
        bar.setAttribute('height', bh); bar.setAttribute('rx', '3');
        /* an estimate is drawn in ink, not in the accent that means "freed" */
        bar.setAttribute('fill', DRY ? 'var(--c-ink-3)' : 'var(--c-accent)');
        s.appendChild(bar);
      }
      var zero = r.status === 'ran' || r.status === 'dry-run' ? '0 B' : r.status;
      t(W - 4, r.freed ? fmt.bytes(r.freed) : zero, 'end');
    });
    host.appendChild(s);
  }

  /* Each fixed drive when the run began and when it ended. demo-data: what the run
     freed landed on C:, where the caches live; D: and E: did not change, so they
     carry no tick - the tick says "this succeeded", and only a drive that gained
     space has earned it. A dry-run changes no drive at all. */
  function drives() {
    var host = document.querySelector('[data-ws-report-drives]');
    if (!host) return;
    db.derive.drives().forEach(function (d) {
      var gained = !DRY && d.letter === 'C:' ? total : 0;
      var after = d.free + gained;
      var row = el('div', 'drive');
      row.appendChild(el('span', 'drive-name', d.letter));
      var cap = el('div', 'cap');
      cap.setAttribute('aria-hidden', 'true');
      var used = el('i', 'cap-seg cap-used');
      used.style.width = (((d.total - after) / d.total) * 100) + '%';
      cap.appendChild(used);
      row.appendChild(cap);
      var right = el('div', 't-xs');
      right.style.cssText = 'text-align:end;white-space:nowrap';
      right.appendChild(el('div', gained > 0 ? 'num state-ok' : 'num', fmt.bytes(after) + ' free'));
      right.appendChild(el('div', 'num t-2xs ink-3', 'was ' + fmt.bytes(d.free)));
      row.appendChild(right);
      host.appendChild(row);
    });
  }

  /* The engine's own status word on every badge; the tone only reinforces it. */
  function badge(status) {
    if (status === 'ran') return 'badge-ok';
    if (status === 'dry-run') return 'badge-outline';
    if (status === 'failed') return 'badge-danger';
    if (status === 'refused') return 'badge-warn';
    return 'badge-neutral';
  }

  function table() {
    var tb = document.querySelector('[data-ws-report-rows]');
    if (!tb) return;
    STEPS.forEach(function (r) {
      var tr = el('tr');
      tr.appendChild(el('td', 'num t-sm ink-3', String(r.id)));
      var n = el('td');
      var k = el('span', 't-sm'); k.style.fontWeight = '600'; k.textContent = r.key;
      n.appendChild(k);
      tr.appendChild(n);
      var st = el('td');
      st.appendChild(el('span', 'badge ' + badge(r.status), r.status));
      tr.appendChild(st);
      var f = el('td', 'num-cell t-sm');
      f.textContent = r.freed ? fmt.bytes(r.freed) : '\u2014';
      if (r.freed && !DRY) f.classList.add('accent-ink');
      tr.appendChild(f);
      tr.appendChild(el('td', 't-sm ink-3', r.note || '\u2014'));
      tb.appendChild(tr);
    });
  }

  /* The file as the engine would write it (schema 1, lib/log.ps1 Save-Report).
     demo-data, like every value on this page. */
  function json() {
    var name = document.querySelector('[data-ws-report-json-name]');
    var box = document.querySelector('[data-ws-report-json-box]');
    var text = document.querySelector('[data-ws-report-json-text]');
    if (!name || !box || !text) return;
    name.textContent = FILE;
    box.setAttribute('aria-label', FILE);
    var drivesNow = db.derive.drives().map(function (d) {
      return { drive: d.letter, size_bytes: Math.round(d.total), free_bytes: Math.round(d.free) };
    });
    var doc = {
      schema_version: 1,
      credits: { tool: 'windowsweep', tool_version: S.ENGINE_VERSION, tool_homepage: 'https://github.com/aoneahsan/windowsweep', tool_license: 'MIT License' },
      meta: {
        started_at: '2026-09-04T09:14:02+05:00', finished_at: '2026-09-04T09:14:19+05:00', duration_seconds: DURATION,
        host: 'DESKTOP-DEMO', user: 'you', mode: 'all', dry_run: DRY, elevated: false, developer_mode: true,
        idle_days: 100, temp_days: 3, log_file: PATH.replace(FILE, 'windowsweep-2026-09-04_091402-4412.log'),
        launcher: 'desktop', via_npx: false
      },
      disk: {
        before: drivesNow,
        after: drivesNow.map(function (d) {
          return { drive: d.drive, size_bytes: d.size_bytes, free_bytes: d.free_bytes + (!DRY && d.drive === 'C:' ? Math.round(total) : 0) };
        })
      },
      steps: STEPS.map(function (s, i) {
        return { n: i + 1, section: s.id, title: s.key, status: s.status, freed_bytes: s.freed, note: s.note };
      }),
      totals: {
        total_reclaimed_bytes: DRY ? 0 : total, total_reclaimed_human: DRY ? '0 B' : fmt.bytes(total),
        total_estimated_bytes: DRY ? total : 0, total_estimated_human: DRY ? fmt.bytes(total) : '0 B',
        steps_run: STEPS.filter(function (s) { return s.status === 'ran' || s.status === 'dry-run'; }).length,
        steps_skipped: STEPS.filter(function (s) { return s.status !== 'ran' && s.status !== 'dry-run'; }).length
      }
    };
    text.textContent = JSON.stringify(doc, null, 4);
  }

  /* One state's bands in the page at a time, REMOVED rather than hidden:
     `.band-app:first-of-type` gives the first band its top padding, and a hidden
     section still counts as the first of its type. */
  function keepState() {
    var drop = function (sel) { document.querySelectorAll(sel).forEach(function (b) { b.remove(); }); };
    if (EMPTY || GONE) {
      drop('[data-ws-report-band], [data-ws-report-json], [data-ws-report-unreadable]');
      var e = document.querySelector('[data-ws-report-empty]');
      if (e) e.hidden = false;
      if (GONE) {
        var nav = document.querySelector('[data-ws-report-gone]');
        if (nav) nav.hidden = false;
        var title = document.querySelector('[data-ws-report-empty-title]');
        if (title) title.textContent = 'That run is no longer in this window’s history.';
        drop('[data-ws-report-empty-lede]');
      }
      return;
    }
    drop('[data-ws-report-empty]');
    if (!UNREADABLE) { drop('[data-ws-report-unreadable]'); return; }
    /* the file is not there: the header keeps the History record's figure, the meta
       line holds its height empty, and the button stays reachable and says why */
    var bands = document.querySelectorAll('[data-ws-report-band]');
    for (var i = 1; i < bands.length; i++) bands[i].remove();
    drop('[data-ws-report-json]');
    var u = document.querySelector('[data-ws-report-unreadable]');
    if (u) u.hidden = false;
    if (UNREADABLE === 'missing') {
      var txt = document.querySelector('[data-ws-report-unreadable-text]');
      if (txt) txt.textContent = 'No report file was found for this run, so only its summary is shown.';
      drop('[data-ws-report-unreadable-reason]');
    }
  }

  function unreadableHeader() {
    var meta = document.querySelector('[data-ws-report-meta]');
    if (meta) meta.textContent = ' ';
    var b = document.querySelector('[data-ws-action="reportOpen"]');
    if (b) {
      b.setAttribute('aria-disabled', 'true'); b.setAttribute('data-disabled', '');
      b.setAttribute('aria-describedby', 'report-unreadable'); b.removeAttribute('aria-expanded');
    }
  }

  window.wsPage = {
    init: function () {
      keepState();
      if (EMPTY || GONE) return;
      if (UNREADABLE) {
        var title = document.querySelector('[data-ws-report-title]');
        if (title) title.textContent = 'Freed ' + fmt.bytes(total);
        unreadableHeader();
        return;
      }
      header(); bars(); drives(); table(); json();
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        /* The file opens here, read-only - the answer is the panel appearing under
           the button, so there is no toast. */
        if (t.dataset.wsAction === 'reportOpen') {
          var band = document.querySelector('[data-ws-report-json]');
          if (!band) return;
          var open = band.hidden;
          band.hidden = !open;
          t.setAttribute('aria-expanded', open ? 'true' : 'false');
          if (open) t.setAttribute('aria-controls', 'report-json'); else t.removeAttribute('aria-controls');
        }
        if (t.dataset.wsAction === 'reportExport') {
          ws.toast('Markdown and HTML come from the engine\u2019s own --export, not from this window \u2013 ' +
                   'so an exported report and this page cannot drift apart.');
        }
      });
    }
  };
})();
