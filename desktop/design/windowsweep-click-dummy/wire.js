/* ============================================================================
   windowsweep desktop dummy - the binder

   Declarative `data-ws-*` attributes connect markup to the store. The whole file
   is DISCARDED at translation - it is a specification of behaviour, not code
   anyone should keep. One grep lists everything the first implementation module
   deletes:   grep -oh 'data-ws-[a-z-]*' *.html | sort -u

   🔴 Zero innerHTML. createElement + textContent, same rule as the app.
   ============================================================================ */
(function () {
  'use strict';

  var db = window.wsdb, S = window.wsSeed, ws = window.ws;
  var el = ws.el, fmt = db.fmt;
  var page = (location.pathname.split('/').pop() || 'index.html');
  var map = null;

  /* ------------------------------------------------------------------ helpers */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function setText(key, value) {
    $$('[data-ws-text="' + key + '"]').forEach(function (n) { n.textContent = value; });
  }

  /* a value that changes is SEEN changing - §12a. Never a jump. */
  function countTo(node, from, to, render) {
    if (ws.prefersReducedMotion() || from === to) { render(to); return; }
    var t0 = performance.now(), dur = 620;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      render(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  var heroShown = 0;
  function paintHero(bytes) {
    var n = $('[data-ws-hero-n]'), u = $('[data-ws-hero-u]');
    if (!n) return;
    countTo(n, heroShown, bytes, function (v) {
      var p = fmt.bytesParts(v);
      n.textContent = p.n;
      if (u) u.textContent = p.u;
    });
    heroShown = bytes;
  }

  /* -------------------------------------------------------- the reclaim map */
  function renderMap() {
    var mount = $('[data-ws-map]');
    if (!mount) return;
    if (!map) map = new window.ReclaimMap(mount, {
      onToggle: function (target, excluded) {
        refresh();
        ws.toast(
          (excluded ? 'Keeping ' : 'Including ') + target.name + ' (' + fmt.bytes(target.value) + ')',
          { undo: function () { db.toggleExcluded(target.path); refresh(); renderMap(); } }
        );
      }
    });
    map.render(db.derive.mapDataAll());
    var tbl = $('[data-ws-map-table]');
    if (tbl) window.ReclaimMap.buildTable(tbl, db.derive.mapDataAll());
  }

  function renderLegend() {
    var mount = $('[data-ws-legend]');
    if (!mount) return;
    mount.textContent = '';
    var present = {};
    db.derive.activeTargets().forEach(function (t) {
      var s = db.section[t.section]; if (s) present[s.tier] = true;
    });
    S.TIERS.filter(function (t) { return present[t.key]; }).forEach(function (t) {
      var w = el('span', 'tier tier-' + t.key);
      w.appendChild(el('span', 't-2xs ink-3', t.label + ' – ' + t.blurb));
      mount.appendChild(w);
    });
    // the second channel is explained, or it is an encoding nobody can read
    var ramp = el('span');
    ramp.style.cssText = 'display:inline-flex;align-items:center;gap:var(--sp-2)';
    var bar = el('span');
    bar.style.cssText = 'width:56px;height:9px;border-radius:2px;background:linear-gradient(90deg,' +
      'color-mix(in oklab, var(--c-accent) 34%, var(--c-well)), var(--c-accent))';
    ramp.appendChild(bar);
    ramp.appendChild(el('span', 't-2xs ink-3', 'faded = used recently, solid = long idle'));
    mount.appendChild(ramp);
  }


  /* ------------------------------------------------------------ capacity ring
     The hero's right half was dead space and the treemap was carrying the whole
     page. This fills one and relieves the other: three concentric arcs, one per
     drive, each showing used / reclaimable / free, with the reclaimable slice in
     full accent. It is also the page's only circle - a counterpoint to a layout
     that is otherwise entirely rectangles, which is most of why it reads as
     designed rather than assembled.

     Real d3.arc(); constant viewBox, so the element never resizes with the data. */
  function renderRing() {
    var mount = $('[data-ws-ring]');
    if (!mount || !window.d3) return;
    mount.textContent = '';
    var ns = 'http://www.w3.org/2000/svg';
    var SZ = 260, cx = SZ / 2, cy = SZ / 2;
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + SZ + ' ' + SZ);
    svg.setAttribute('class', 'ring-svg');
    svg.setAttribute('role', 'img');

    var drives = db.derive.drives();
    var TAU = Math.PI * 2, GAP = 0.055;
    var outer = 116, band = 19, pad = 7;

    drives.forEach(function (d, i) {
      var r1 = outer - i * (band + pad), r0 = r1 - band;
      var usedFrac = (d.used - d.reclaimable) / d.total;
      var reclFrac = d.reclaimable / d.total;

      function arc(a0, a1, fill, cls) {
        var path = document.createElementNS(ns, 'path');
        path.setAttribute('d', window.d3.arc()
          .innerRadius(r0).outerRadius(r1)
          .startAngle(a0).endAngle(a1).cornerRadius(3)());
        path.setAttribute('transform', 'translate(' + cx + ',' + cy + ')');
        path.setAttribute('fill', fill);
        if (cls) path.setAttribute('class', cls);
        svg.appendChild(path);
      }
      arc(GAP, TAU - GAP, 'color-mix(in oklab, var(--c-ink) 9%, transparent)');
      arc(GAP, GAP + (TAU - GAP * 2) * usedFrac, 'color-mix(in oklab, var(--c-ink) 26%, transparent)');
      arc(GAP + (TAU - GAP * 2) * usedFrac,
          GAP + (TAU - GAP * 2) * (usedFrac + reclFrac), 'var(--c-accent)', 'ring-recl');

      // a <title> rather than a drawn letter: the Drives zone right below is the
      // labelled view, and three letters stacked in the 12 o'clock gap read as a
      // stray list rather than as part of the ring
      var tt = document.createElementNS(ns, 'title');
      tt.textContent = d.letter + '  ' + fmt.bytes(d.free) + ' free of ' + fmt.bytes(d.total) +
                       '  ·  ' + fmt.bytes(d.reclaimable) + ' reclaimable';
      svg.appendChild(tt);
    });

    var pct = document.createElementNS(ns, 'text');
    pct.setAttribute('x', cx); pct.setAttribute('y', cy + 2);
    pct.setAttribute('text-anchor', 'middle');
    pct.setAttribute('font-size', '31');
    pct.setAttribute('font-family', 'var(--ff-display)');
    pct.setAttribute('font-weight', '700');
    pct.setAttribute('fill', 'var(--c-accent-ink)');
    var tot = db.derive.drives().reduce(function (a, d) { return a + d.total; }, 0);
    var rec = db.derive.reclaimable();
    pct.textContent = ((rec / tot) * 100).toFixed(1) + '%';
    svg.appendChild(pct);

    var cap = document.createElementNS(ns, 'text');
    cap.setAttribute('x', cx); cap.setAttribute('y', cy + 19);
    cap.setAttribute('text-anchor', 'middle');
    cap.setAttribute('font-size', '9.5');
    cap.setAttribute('letter-spacing', '1.1');
    cap.setAttribute('fill', 'var(--c-ink-3)');
    cap.textContent = 'OF ALL DISKS';
    svg.appendChild(cap);

    svg.setAttribute('aria-label', 'Capacity: ' + fmt.bytes(rec) + ' reclaimable, ' +
      ((rec / tot) * 100).toFixed(1) + ' per cent of ' + fmt.bytes(tot) + ' across ' +
      drives.length + ' drives. The same figures are in the Drives panel below.');
    mount.appendChild(svg);
  }

  /* ------------------------------------------------------------ drive rails */
  function renderDrives() {
    var mount = $('[data-ws-drives]');
    if (!mount) return;
    mount.textContent = '';
    db.derive.drives().forEach(function (d) {
      var row = el('div', 'drive');
      row.appendChild(el('span', 'drive-name', d.letter));

      var cap = el('div', 'cap');
      var usedPct = ((d.used - d.reclaimable) / d.total) * 100;
      var reclPct = (d.reclaimable / d.total) * 100;
      var a = el('i', 'cap-seg cap-used');  a.style.width = Math.max(0, usedPct) + '%';
      var b = el('i', 'cap-seg cap-recl pulse'); b.style.width = Math.max(0, reclPct) + '%';
      b.title = fmt.bytes(d.reclaimable) + ' reclaimable on ' + d.letter;
      cap.appendChild(a); cap.appendChild(b);
      row.appendChild(cap);

      var right = el('div', 't-2xs');
      right.style.textAlign = 'end';
      right.style.whiteSpace = 'nowrap';
      var free = el('div', 'num'); free.textContent = fmt.bytes(d.free) + ' free';
      var recl = el('div', 'num accent-ink'); recl.textContent = '+' + fmt.bytes(d.reclaimable);
      right.appendChild(free); right.appendChild(recl);
      row.appendChild(right);

      mount.appendChild(row);
    });

    var note = el('p', 't-2xs ink-3');
    note.style.marginTop = 'var(--sp-4)';
    note.style.display = 'flex';
    note.style.gap = 'var(--sp-3)';
    [['cap-used', 'in use'], ['cap-recl', 'reclaimable'], [null, 'free']].forEach(function (pair) {
      var s = el('span');
      s.style.display = 'inline-flex'; s.style.alignItems = 'center'; s.style.gap = '4px';
      var sw = el('i');
      sw.style.width = '9px'; sw.style.height = '9px'; sw.style.borderRadius = '2px';
      sw.style.background = pair[0] === 'cap-used' ? 'color-mix(in oklab, var(--c-ink) 34%, transparent)'
                          : pair[0] === 'cap-recl' ? 'var(--c-accent)'
                          : 'color-mix(in oklab, var(--c-ink) 10%, transparent)';
      s.appendChild(sw); s.appendChild(el('span', null, pair[1]));
      note.appendChild(s);
    });
    mount.appendChild(note);
  }

  /* ---------------------------------------------------------- the safe ladder */
  function renderLadder() {
    var mount = $('[data-ws-ladder]');
    if (!mount) return;
    mount.textContent = '';
    var rows = db.derive.safeRunSections();
    var max = rows.length ? rows[0].bytes : 1;
    rows.forEach(function (r) {
      var s = db.section[r.section];
      var rung = el('div', 'rung');
      var left = el('div');
      var name = el('div', 't-sm');
      name.textContent = (s ? s.key : r.section);
      var sub = el('div', 't-2xs ink-3');
      sub.textContent = r.count + (r.count === 1 ? ' target' : ' targets');
      left.appendChild(name); left.appendChild(sub);
      rung.appendChild(left);

      var val = el('div', 'num t-sm');
      val.textContent = fmt.bytes(r.bytes);
      rung.appendChild(val);

      var bar = el('div', 'rung-bar');
      var fill = el('i');
      fill.style.width = ((r.bytes / max) * 100).toFixed(1) + '%';
      bar.appendChild(fill);
      rung.appendChild(bar);
      mount.appendChild(rung);
    });
    if (!rows.length) {
      mount.appendChild(el('p', 't-sm ink-3', 'Nothing in the safe batch right now.'));
    }
  }

  /* --------------------------------------------------------- needs a person */
  function renderNeeds() {
    var mount = $('[data-ws-needs]');
    if (!mount) return;
    mount.textContent = '';
    db.derive.needsAPerson().forEach(function (r) {
      var s = db.section[r.section];
      var card = el('div', 'c3 well pad-s');
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = 'var(--sp-2)';

      var top = el('div');
      top.style.display = 'flex'; top.style.alignItems = 'center'; top.style.gap = 'var(--sp-2)';
      top.appendChild(el('span', 'badge badge-warn', String(r.section)));
      top.appendChild(el('span', 't-sm', s ? s.key : ''));
      card.appendChild(top);

      var n = el('p', 'num t-md wide');
      n.textContent = fmt.bytes(r.bytes);
      card.appendChild(n);

      card.appendChild(el('p', 't-2xs ink-3', r.count + ' item' + (r.count === 1 ? '' : 's') + ' waiting'));

      var t = el('span', 'tier tier-' + (s ? s.tier : 'recycle'));
      t.appendChild(el('span', 't-2xs ink-3', s ? s.tier : ''));
      card.appendChild(t);

      var go = el('button', 'btn btn-sm');
      go.textContent = 'Choose items';
      go.addEventListener('click', function () {
        ws.toast('The picker for section ' + r.section + ' is in the next batch of this dummy.');
      });
      card.appendChild(go);

      mount.appendChild(card);
    });
  }

  /* ------------------------------------------------------- protected chips */
  function renderProtected() {
    var mount = $('[data-ws-protected]');
    if (!mount) return;
    mount.textContent = '';
    S.PROTECTED.forEach(function (p) {
      var c = el('span', 'chip', p);
      c.title = 'Refused regardless of any flag';
      mount.appendChild(c);
    });
  }

  /* ------------------------------------------------------------- sparkline */
  function renderSpark() {
    var mount = $('[data-ws-spark]');
    if (!mount || !window.d3) return;
    mount.textContent = '';
    var W = 320, H = 54, P = 4;
    var runs = S.RUNS;
    var x = window.d3.scaleLinear().domain([0, runs.length - 1]).range([P, W - P]);
    // 🔴 constant RANGE, the domain moves - the box never resizes with the data
    var y = window.d3.scaleLinear()
      .domain([0, Math.max.apply(null, runs.map(function (r) { return r.freed; }))])
      .range([H - P, P]);
    var line = window.d3.line()
      .x(function (d, i) { return x(i); })
      .y(function (d) { return y(d.freed); })
      .curve(window.d3.curveMonotoneX);
    var area = window.d3.area()
      .x(function (d, i) { return x(i); })
      .y0(H - P).y1(function (d) { return y(d.freed); })
      .curve(window.d3.curveMonotoneX);

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Space freed by the last ' + runs.length +
      ' runs, oldest first: ' + runs.map(function (r) { return fmt.bytes(r.freed); }).join(', '));
    svg.style.width = '100%'; svg.style.height = H + 'px';

    var ar = document.createElementNS(ns, 'path');
    ar.setAttribute('d', area(runs));
    ar.setAttribute('fill', 'var(--c-accent)');
    ar.setAttribute('opacity', '.16');
    svg.appendChild(ar);

    var ln = document.createElementNS(ns, 'path');
    ln.setAttribute('d', line(runs));
    ln.setAttribute('fill', 'none');
    ln.setAttribute('stroke', 'var(--c-accent)');
    ln.setAttribute('stroke-width', '1.8');
    ln.setAttribute('stroke-linecap', 'round');
    svg.appendChild(ln);

    runs.forEach(function (r, i) {
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', x(i)); c.setAttribute('cy', y(r.freed)); c.setAttribute('r', i === runs.length - 1 ? 3.4 : 2);
      c.setAttribute('fill', 'var(--c-accent)');
      var ttl = document.createElementNS(ns, 'title');
      ttl.textContent = fmt.bytes(r.freed) + ' - ' + fmt.relDate(r.at) + ' - ' + r.mode;
      c.appendChild(ttl);
      svg.appendChild(c);
    });
    mount.appendChild(svg);

    var last = runs[runs.length - 1];
    setText('lastFreed', fmt.bytes(last.freed));
    setText('lastWhen', fmt.relDate(last.at) + ' – ' + last.mode + ' – ' + last.sections + ' sections');
  }

  /* --------------------------------------------------------------- consent */
  function renderConsent() {
    var mount = $('[data-ws-consent]');
    if (!mount) return;
    mount.textContent = '';
    [['GA4', 'page and feature usage'], ['Amplitude', 'funnels'],
     ['Clarity', 'session replay'], ['Sentry', 'crash reports']].forEach(function (p) {
      var row = el('div');
      row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.gap = 'var(--sp-3)';
      var sw = el('button', 'switch');
      sw.setAttribute('role', 'switch');
      sw.setAttribute('aria-checked', 'false');
      sw.setAttribute('aria-label', p[0]);
      sw.addEventListener('click', function () {
        var on = sw.getAttribute('aria-checked') !== 'true';
        sw.setAttribute('aria-checked', on ? 'true' : 'false');
        ws.toast(p[0] + (on ? ' enabled' : ' disabled') + ' - nothing is sent in this dummy.');
      });
      row.appendChild(sw);
      var lab = el('div');
      lab.appendChild(el('span', 't-sm', p[0]));
      lab.appendChild(el('span', 't-2xs ink-3', '  ' + p[1]));
      row.appendChild(lab);
      mount.appendChild(row);
    });
  }

  /* --------------------------------------------------------------- refresh */
  function refresh() {
    var total = db.derive.reclaimable();
    paintHero(total);
    setText('cleanBtn', fmt.bytes(total));
    setText('safeTotal', fmt.bytes(db.derive.safeRunBytes()));
    setText('targetCount', String(db.derive.activeTargets().length));
    setText('sectionCount', String(db.derive.bySection().length));
    setText('engineVersion', S.ENGINE_VERSION);
    setText('appVersion', S.APP_VERSION);
    setText('storageMode', 'storage: ' + ws.store.backend);
    setText('idleDays', String(db.facts.idleDays));

    var held = db.derive.heldByDeveloperMode();
    setText('devHeld', fmt.bytes(held.reduce(function (a, t) { return a + t.bytes; }, 0)));
    setText('devHeldN', String(held.length));
    setText('devState', db.facts.developer
      ? 'On – keeping anything used in the last ' + db.facts.idleDays + ' days'
      : 'Off – every cache is fair game');
    var devSw = $('[data-ws-action="devMode"]');
    if (devSw) devSw.setAttribute('aria-checked', db.facts.developer ? 'true' : 'false');

    var schedSw = $('[data-ws-action="schedule"]');
    if (schedSw) schedSw.setAttribute('aria-checked', db.facts.schedule ? 'true' : 'false');
    setText('scheduleState', db.facts.schedule ? 'On – Sundays at 03:00' : 'Off');

    var ex = db.facts.excluded.length;
    setText('excludedNote', ex === 0 ? 'nothing excluded'
      : ex + (ex === 1 ? ' target kept' : ' targets kept') + ' out of the run');

    renderDrives();
    renderLadder();
    renderLegend();
    renderRing();
  }

  /* --------------------------------------------------------------- actions */
  function busy(btn, label, ms, then) {
    btn.dataset.state = 'pending';
    setTimeout(function () {
      btn.dataset.state = 'done';
      setTimeout(function () { delete btn.dataset.state; if (then) then(); }, 700);
    }, ms);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-ws-action]');
    if (!t) return;
    var a = t.dataset.wsAction;

    if (a === 'scan' || a === 'rescan') {
      var btn = t.classList.contains('btn') ? t : $('[data-ws-action="scan"]');
      if (btn) busy(btn, 'Scanning', 900, function () {
        setText('freshness', '0');
        ws.toast('Read-only scan finished. Nothing was deleted.');
      });
      else ws.toast('Re-scanning...');
    }

    if (a === 'preview') {
      busy(t, 'Previewing', 800, function () {
        ws.toast('Dry run: ' + fmt.bytes(db.derive.safeRunBytes()) + ' across ' +
                 db.derive.safeRunSections().length + ' sections. Nothing was deleted.');
      });
    }

    if (a === 'clean') {
      var freed = db.derive.reclaimable();
      var paths = db.derive.activeTargets().map(function (x) { return x.path; });
      t.dataset.state = 'pending';
      if (map) {
        map.drain(paths, function () {
          t.dataset.state = 'done';
          paintHero(0);
          setText('cleanBtn', '0 B');
          setTimeout(function () { delete t.dataset.state; }, 900);
          ws.toast('Freed ' + fmt.bytes(freed) + '. A real run would have written a report.', {
            undo: function () { map.draining = {}; renderMap(); refresh(); }
          });
        });
      }
    }

    if (a === 'clearExclusions') {
      db.set('excluded', []);
      renderMap(); refresh();
      ws.toast('Every target is back in the run.');
    }

    if (a === 'devMode') {
      db.set('developer', !db.facts.developer);
      renderMap(); refresh();
    }

    if (a === 'schedule') {
      db.set('schedule', !db.facts.schedule);
      refresh();
      ws.toast(db.facts.schedule
        ? 'Weekly task registered. It runs the safe batch only.'
        : 'Weekly task removed.');
    }

    if (a === 'soon') {
      e.preventDefault();
      ws.toast('That screen is in the next batch of this dummy.');
    }
  });

  document.addEventListener('input', function (e) {
    var t = e.target.closest('[data-ws-action="idleDays"]');
    if (!t) return;
    db.facts.idleDays = Number(t.value);
    refresh();
  });
  document.addEventListener('change', function (e) {
    var t = e.target.closest('[data-ws-action="idleDays"]');
    if (!t) return;
    db.set('idleDays', Number(t.value));
    renderMap();
  });

  /* ------------------------------------------------------------------ boot */
  function boot() {
    if (page === 'index.html' || page === '') {
      renderMap(); renderProtected(); renderNeeds(); renderSpark(); renderConsent();
      var idle = $('[data-ws-action="idleDays"]');
      if (idle) idle.value = db.facts.idleDays;
      refresh();
    } else {
      refresh();
    }
    if (window.wsPage && typeof window.wsPage.init === 'function') window.wsPage.init();
  }

  window.wsWire = { refresh: refresh, renderMap: renderMap, setText: setText, $: $, $$: $$, countTo: countTo };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
