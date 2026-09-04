/* ============================================================================
   Run - the moment.

   Progress is DETERMINATE and comes from the engine's own machine-readable lines,
   which 1.1.0 added for exactly this consumer:

       ##windowsweep section=NN event=start
       ##windowsweep section=NN event=end status=<status> freed_bytes=<n>

   An indeterminate spinner would be the wrong answer here: "how far along" is
   precisely the question being asked. The GUI reimplements no cleanup logic - it
   parses those lines and draws them.
   ============================================================================ */
(function () {
  'use strict';

  var db = window.wsdb, ws = window.ws;
  var el = ws.el, fmt = db.fmt;
  var map = null, timer = null, cancelled = false;
  var freed = 0, doneCount = 0, startedAt = 0;
  var queue = [];

  function log(text, cls) {
    var view = document.querySelector('[data-ws-log]');
    if (!view) return;
    var atBottom = view.scrollTop + view.clientHeight >= view.scrollHeight - 8;
    var line = el('div', cls || null, text);
    view.appendChild(line);
    if (atBottom) view.scrollTop = view.scrollHeight;
  }

  function buildList() {
    var mount = document.querySelector('[data-ws-runlist]');
    if (!mount) return;
    mount.textContent = '';
    queue.forEach(function (item) {
      var s = db.section[item.section];
      var row = el('div');
      row.dataset.section = String(item.section);

      var top = el('div');
      top.style.cssText = 'display:flex;align-items:baseline;gap:var(--sp-2)';
      top.appendChild(el('span', 'num t-2xs ink-3', String(item.section)));
      top.appendChild(el('span', 't-sm', s ? s.key : ''));
      var st = el('span', 't-xs ink-3', 'queued');
      st.dataset.role = 'status';
      st.style.marginInlineStart = 'auto';
      top.appendChild(st);
      var by = el('span', 'num t-xs', fmt.bytes(item.bytes));
      by.dataset.role = 'bytes';
      top.appendChild(by);
      row.appendChild(top);

      var bar = el('div', 'prog');
      bar.style.marginTop = 'var(--sp-1)';
      var fill = el('i', 'prog-fill');
      fill.dataset.role = 'fill';
      bar.appendChild(fill);
      row.appendChild(bar);

      mount.appendChild(row);
    });
  }

  function rowFor(id) { return document.querySelector('[data-ws-runlist] [data-section="' + id + '"]'); }

  function setRow(id, status, pct, tone) {
    var r = rowFor(id);
    if (!r) return;
    var f = r.querySelector('[data-role="fill"]');
    var s = r.querySelector('[data-role="status"]');
    if (f) { f.style.width = pct + '%'; if (tone) f.dataset.tone = tone; }
    if (s) s.textContent = status;
  }

  function finish() {
    clearInterval(timer);
    document.querySelector('[data-ws-action="runStart"]').disabled = false;
    document.querySelector('[data-ws-action="runCancel"]').disabled = true;
    window.wsWire.setText('runState', cancelled ? 'Cancelled' : 'Finished');
    var fin = document.querySelector('[data-ws-finish]');
    if (fin && !cancelled) {
      fin.hidden = false;
      window.wsWire.setText('finishLine',
        'Freed ' + fmt.bytes(freed) + ' across ' + doneCount + ' sections in ' +
        Math.max(1, Math.round((Date.now() - startedAt) / 1000)) + ' seconds.');
      var stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      window.wsWire.setText('reportPath', '%USERPROFILE%\\.windowsweep\\reports\\run-' + stamp + '.json');
      window.wsWire.renderMap && null;
      // the drives fill - the payoff the number alone cannot deliver
      var drives = document.querySelector('[data-ws-finish] [data-ws-drives]');
      if (drives) renderFinishDrives(drives);
    }
    log(cancelled ? '! run cancelled by the user' : '+ done', cancelled ? 'l-warn' : 'l-ok');
    ws.toast(cancelled
      ? 'Run cancelled. ' + fmt.bytes(freed) + ' had already been freed.'
      : 'Freed ' + fmt.bytes(freed) + '. Report written.');
  }

  function renderFinishDrives(mount) {
    mount.textContent = '';
    db.derive.drives().forEach(function (d) {
      var row = el('div', 'drive');
      row.appendChild(el('span', 'drive-name', d.letter));
      var cap = el('div', 'cap');
      var newFree = d.free + d.reclaimable;
      var usedPct = ((d.total - newFree) / d.total) * 100;
      var a = el('i', 'cap-seg cap-used'); a.style.width = usedPct + '%';
      cap.appendChild(a);
      row.appendChild(cap);
      var right = el('div', 't-xs');
      right.style.textAlign = 'end';
      right.style.whiteSpace = 'nowrap';
      var f1 = el('div', 'num state-ok'); f1.textContent = fmt.bytes(newFree) + ' free';
      var f2 = el('div', 'num t-2xs ink-3'); f2.textContent = 'was ' + fmt.bytes(d.free);
      right.appendChild(f1); right.appendChild(f2);
      row.appendChild(right);
      mount.appendChild(row);
    });
  }

  function start() {
    cancelled = false; freed = 0; doneCount = 0; startedAt = Date.now();
    queue = db.derive.safeRunSections();
    if (!queue.length) { ws.toast('Nothing in the safe batch to run.'); return; }

    buildList();
    document.querySelector('[data-ws-action="runStart"]').disabled = true;
    document.querySelector('[data-ws-action="runCancel"]').disabled = false;
    var fin = document.querySelector('[data-ws-finish]');
    if (fin) fin.hidden = true;
    var view = document.querySelector('[data-ws-log]');
    if (view) view.textContent = '';

    window.wsWire.setText('runTotal', String(queue.length));
    window.wsWire.setText('runState', 'Running');
    log('windowsweep ' + window.wsSeed.ENGINE_VERSION + ' – safe batch, ' + queue.length + ' sections', 'l-dim');
    log('mode=all dry_run=false developer=' + db.facts.developer + ' idle_days=' + db.facts.idleDays, 'l-dim');

    var i = 0, phase = 0;
    var reduced = ws.prefersReducedMotion();
    var tick = reduced ? 40 : 190;

    timer = setInterval(function () {
      if (cancelled) { finish(); return; }
      if (i >= queue.length) { finish(); return; }

      var item = queue[i];
      var s = db.section[item.section];

      if (phase === 0) {
        log('##windowsweep section=' + item.section + ' event=start', 'l-dim');
        log('> ' + (s ? s.key : item.section) + ': walking ' + item.count + ' target(s)');
        setRow(item.section, 'running', 12);
        phase = 1;
      } else if (phase < 4) {
        setRow(item.section, 'running', 12 + phase * 26);
        phase++;
      } else {
        setRow(item.section, 'done', 100, 'ok');
        var r = rowFor(item.section);
        if (r) { var st = r.querySelector('[data-role="status"]'); if (st) st.className = 't-2xs state-ok'; }
        log('##windowsweep section=' + item.section + ' event=end status=ran freed_bytes=' +
            Math.round(item.bytes), 'l-dim');
        log('+ ' + (s ? s.key : item.section) + ': freed ' + fmt.bytes(item.bytes), 'l-ok');

        freed += item.bytes; doneCount++;
        window.wsWire.setText('runDone', String(doneCount));
        window.wsWire.setText('runElapsed', Math.round((Date.now() - startedAt) / 1000) + 's elapsed');

        // the map drains the tiles this section owned
        if (map) {
          var paths = window.wsSeed.TARGETS
            .filter(function (t) { return t.section === item.section && !db.isExcluded(t.path); })
            .map(function (t) { return t.path; });
          map.drain(paths);
        }

        var n = document.querySelector('[data-ws-hero-n]'), u = document.querySelector('[data-ws-hero-u]');
        if (n) {
          var p = fmt.bytesParts(freed);
          n.textContent = p.n; if (u) u.textContent = p.u;
        }

        i++; phase = 0;
      }
    }, tick);
  }

  window.wsPage = {
    init: function () {
      var mount = document.querySelector('[data-ws-map]');
      if (mount) {
        map = new window.ReclaimMap(mount, { interactive: false });
        map.render(db.derive.mapData());
      }
      queue = db.derive.safeRunSections();
      buildList();
      window.wsWire.setText('runTotal', String(queue.length));
      window.wsWire.setText('runCmd',
        'windowsweep --all --yes --json' + (db.facts.developer ? ' --developer' : ' --not-developer'));
      log('idle – press “Start the safe run”', 'l-dim');

      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        if (t.dataset.wsAction === 'runStart') start();
        if (t.dataset.wsAction === 'runCancel') {
          cancelled = true;
          log('> cancel requested – finishing the section in flight', 'l-warn');
        }
      });
    }
  };
})();
