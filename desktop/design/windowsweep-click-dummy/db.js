/* ============================================================================
   windowsweep desktop dummy - the store

   🔴 Store FACTS, derive the rest. What the user did is persisted (which targets
   they excluded, whether developer mode is on, whether they accepted telemetry,
   what they selected). Every total, count and percentage is computed on read by
   the same pure functions the app will use - a stored derived number is how one
   screen says 12 and the next says 11.

   Shape is deliberately Zustand-plus-persist in miniature: an in-memory mirror
   hydrated once at boot, synchronous reads, persistence behind them.
   ============================================================================ */
(function () {
  'use strict';

  var S = window.wsSeed;
  var store = window.ws.store;

  var FACTS_KEY = 'facts';
  var DEFAULT_FACTS = {
    excluded: [],          // target paths the user has excluded from the map
    developer: true,       // developer mode - keeps caches used in the last N days
    idleDays: 100,
    tempDays: 3,
    largeFileMb: 100,     // section 19's 'large enough to offer you' threshold; --large-file-mb
    consent: null,         // null = never asked; otherwise {ga4,amplitude,clarity,sentry}
    signedIn: false,
    email: null,
    schedule: false,
    selection: [],         // section ids selected on the Sections screen
    rehearsal: null        // D-60: the last "Dry-run first" - the arguments it ran with, and its estimate
  };

  var facts = Object.assign({}, DEFAULT_FACTS, store.get(FACTS_KEY, {}) || {});
  var listeners = [];

  function emit() { listeners.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); }
  function persist() { store.set(FACTS_KEY, facts); }

  /* ------------------------------------------------------------------ writes */
  function set(k, v) { facts[k] = v; persist(); emit(); }

  function toggleExcluded(path) {
    var i = facts.excluded.indexOf(path);
    if (i === -1) facts.excluded.push(path); else facts.excluded.splice(i, 1);
    persist(); emit();
    return facts.excluded.indexOf(path) !== -1;
  }

  function toggleSelected(id) {
    var i = facts.selection.indexOf(id);
    if (i === -1) facts.selection.push(id); else facts.selection.splice(i, 1);
    persist(); emit();
  }

  function setSelection(ids) { facts.selection = ids.slice(); persist(); emit(); }

  function reset() {
    store.clearAll();
    facts = Object.assign({}, DEFAULT_FACTS, { excluded: [], selection: [] });
    persist(); emit();
  }

  /* ----------------------------------------------------------------- derived */
  var section = {};
  S.SECTIONS.forEach(function (s) { section[s.id] = s; });

  function isExcluded(path) { return facts.excluded.indexOf(path) !== -1; }

  /* 🔴 Developer mode gates ONLY the sections whose catalogue row carries
     Dev = $true - package, build, test-runner, Docker and project-artefact
     caches. It has never applied to browser, app, Windows or temp caches, and
     treating it as a global filter made the map show 10 tiles instead of 27 and
     the hero read a third of the truth. The flag is per SECTION, so the filter
     must be too. */
  function devGated(t) {
    var s = section[t.section];
    return !!(s && s.dev);
  }

  function activeTargets() {
    return S.TARGETS.filter(function (t) {
      if (t.bytes <= 0) return false;
      if (isExcluded(t.path)) return false;
      if (facts.developer && devGated(t) && t.idle < facts.idleDays) return false;
      return true;
    });
  }

  function heldByDeveloperMode() {
    if (!facts.developer) return [];
    return S.TARGETS.filter(function (t) {
      return t.bytes > 0 && !isExcluded(t.path) && devGated(t) && t.idle < facts.idleDays;
    });
  }

  /* D-61: what the engine's OTHER gates keep back inside a target it does run -
     a file a program still has open, a temp file newer than the temp window. The
     seed declares it per target with its reason (S.GATED); developer mode is not
     in that table, because activeTargets() has already set its caches aside.
     Clamped to the target's own size: a gate cannot keep back more than there is. */
  var gate = {};
  S.GATED.forEach(function (g) { gate[g.path] = g; });
  function keptByEngine(t) {
    var g = gate[t.path];
    return g ? Math.min(t.bytes, g.keeps) : 0;
  }

  function sum(list) { return list.reduce(function (a, t) { return a + t.bytes; }, 0); }

  function reclaimable() { return sum(activeTargets()); }

  function bySection() {
    var m = {};
    activeTargets().forEach(function (t) {
      if (!m[t.section]) m[t.section] = { section: t.section, bytes: 0, count: 0 };
      m[t.section].bytes += t.bytes; m[t.section].count++;
    });
    return Object.keys(m).map(function (k) { return m[k]; })
      .sort(function (a, b) { return b.bytes - a.bytes; });
  }

  /* the safe batch is what a `--all --yes` run would actually touch */
  function safeRunSections() {
    return bySection().filter(function (r) { return S.SAFE_BATCH.indexOf(r.section) !== -1; });
  }
  function safeRunBytes() { return safeRunSections().reduce(function (a, r) { return a + r.bytes; }, 0); }

  /* D-60 (GATE 4 round 9) - the figure the Reclaim button and the Run screen's idle
     hero carry. It replaces the quantity round 7's decision 6 gave them.

     After a rehearsal ("Dry-run first") with the CURRENT arguments - the same
     sections, developer mode, --days, --temp-days, --large-file-mb and exclusions -
     it is that rehearsal's estimate, the engine's own figure. Before one, or once
     any argument has moved since, it is an UPPER BOUND and says so ("Reclaim up
     to"): the safe run's measured total less what developer mode holds back. That
     is a true bound, because a run cannot free more than was measured and not held
     back. Here activeTargets() has already set the held-back caches aside, so the
     bound is safeRunBytes(); the window subtracts its own measured held-back figure.
     Home's hero keeps the measured total - what is there, not what a press does. */
  function runArgs() {
    return {
      developer: facts.developer, idleDays: facts.idleDays, tempDays: facts.tempDays,
      largeFileMb: facts.largeFileMb, excluded: facts.excluded.slice().sort()
    };
  }
  /* The rehearsal that still describes the run on offer, or null. A record written
     before D-61 carried one total and no per-section rows, so it cannot answer the
     ladder; it is read as absent rather than as an estimate of unknown shape. */
  function currentRehearsal() {
    var r = facts.rehearsal;
    if (!r || !r.sections) return null;
    return JSON.stringify(r.args) === JSON.stringify(runArgs()) ? r : null;
  }
  function sumSections(sections) {
    return Object.keys(sections).reduce(function (a, k) { return a + sections[k]; }, 0);
  }
  function offer() {
    var r = currentRehearsal();
    if (r) return { amount: sumSections(r.sections), upTo: false };
    return { amount: safeRunBytes(), upTo: true };
  }
  /* What a dry-run of the safe batch would report, SECTION BY SECTION - the engine
     writes a figure for each step it takes, in a dry-run as in a real one, and its
     total is their sum (verified against a real `--json --dry-run`: eleven
     `sections[].freed_bytes` summing exactly to `estimated_bytes`, with the
     top-level `freed_bytes` 0). Recorded with the arguments it ran with; a real run
     spends it (set it to null). */
  function rehearsalEstimate() {
    var m = {};
    /* Every step the run takes reports a figure, including the report-only sections
       that free nothing - so the ladder shows the engine's own 0 B rather than
       falling back to a measured number for one rung out of eleven. */
    S.SAFE_BATCH.forEach(function (id) { m[id] = 0; });
    activeTargets().forEach(function (t) {
      if (m[t.section] === undefined) return;
      m[t.section] += Math.max(0, t.bytes - keptByEngine(t));
    });
    return m;
  }
  function rehearse() { set('rehearsal', { args: runArgs(), sections: rehearsalEstimate() }); }

  /* D-61 (GATE 4 round 10) - EVERY FIGURE THAT DESCRIBES WHAT A RUN WOULD FREE
     FOLLOWS ONE RULE, not just the Reclaim button D-60 fixed. The ladder's rungs
     and total and the Run screen's waiting rows are the same claim in plainer
     words, and they were printing the measured total beside a button carrying the
     engine's estimate - eighteen times it, on the machine round 10 measured.

       (a) after a rehearsal with the CURRENT arguments, each figure is that
           rehearsal's own number for its section, and the total is their sum -
           which is the button's figure, so the band and the button cannot differ;
       (b) before one, or once any argument has moved since, each figure is the
           measured size less what developer mode is measured to hold back, and it
           is worded as the bound it is ("up to").

     A figure describing what IS THERE keeps its measured number: Home's hero, the
     drives, the map, a section card on the Sections screen. This is only about the
     figures that describe a run.

     Sorted by the figure shown, so "which step frees the most" stays true in both
     states - after a rehearsal the shape of the run really is the estimate's shape. */
  function safeRunRows() {
    var r = currentRehearsal();
    var measured = {};
    bySection().forEach(function (row) { measured[row.section] = row; });
    /* 🔴 Nothing is subtracted here and that is not an omission: bySection() counts
       activeTargets(), which has already set developer mode's held-back caches
       aside, so a rung is net of it and the rungs sum to safeRunBytes() - the
       bound offer() carries. The window's own figures are sizes on disk and it
       subtracts its measured held-back total there, exactly as D-60's amendment
       records for the button. Same rule, one subtraction each. */
    var rows = S.SAFE_BATCH.filter(function (id) { return measured[id]; }).map(function (id) {
      var m = measured[id];
      return { section: id, count: m.count, bytes: r ? (r.sections[id] || 0) : m.bytes };
    });
    rows.sort(function (a, b) { return b.bytes - a.bytes; });
    return { rows: rows, upTo: !r };
  }

  function needsAPerson() {
    var m = {};
    S.CANDIDATES.forEach(function (c) {
      if (!m[c.section]) m[c.section] = { section: c.section, bytes: 0, count: 0 };
      m[c.section].bytes += c.bytes; m[c.section].count++;
    });
    return S.INTERACTIVE.map(function (id) {
      return m[id] || { section: id, bytes: 0, count: 0 };
    });
  }

  /* the treemap's hierarchy: root -> section -> target */
  function mapData() {
    var groups = {};
    activeTargets().forEach(function (t) {
      if (!groups[t.section]) groups[t.section] = [];
      groups[t.section].push(t);
    });
    return {
      name: 'reclaimable',
      children: Object.keys(groups).map(function (id) {
        var s = section[id];
        return {
          name: s ? s.key : ('section ' + id),
          section: Number(id),
          tier: s ? s.tier : 'rebuilds',
          children: groups[id].map(function (t) {
            return { name: t.label, path: t.path, value: t.bytes, idle: t.idle,
                     section: t.section, tier: s ? s.tier : 'rebuilds' };
          })
        };
      })
    };
  }

  /* every target, including excluded ones - the map still draws them, dimmed, so
     "what I turned off" stays visible rather than silently vanishing */
  function mapDataAll() {
    var groups = {};
    S.TARGETS.filter(function (t) { return t.bytes > 0; }).forEach(function (t) {
      if (facts.developer && devGated(t) && t.idle < facts.idleDays) return;
      if (!groups[t.section]) groups[t.section] = [];
      groups[t.section].push(t);
    });
    return {
      name: 'reclaimable',
      children: Object.keys(groups).map(function (id) {
        var s = section[id];
        return {
          name: s ? s.key : ('section ' + id),
          section: Number(id),
          tier: s ? s.tier : 'rebuilds',
          children: groups[id].map(function (t) {
            return { name: t.label, path: t.path, value: t.bytes, idle: t.idle,
                     section: t.section, tier: s ? s.tier : 'rebuilds',
                     excluded: isExcluded(t.path) };
          })
        };
      })
    };
  }

  function drives() {
    // the reclaimable slice tracks the live total rather than being a stored number
    var total = reclaimable();
    var share = S.DRIVES.reduce(function (a, d) { return a + d.reclaimable; }, 0) || 1;
    return S.DRIVES.map(function (d) {
      return {
        letter: d.letter, total: d.total, free: d.free,
        reclaimable: total * (d.reclaimable / share),
        used: d.total - d.free
      };
    });
  }

  /* --------------------------------------------------------------- formatting */
  function bytes(n, dp) {
    if (n == null || isNaN(n)) return '-';
    if (n === 0) return '0 B';
    var u = ['B', 'KB', 'MB', 'GB', 'TB'], i = 0, v = n;
    while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
    var d = dp != null ? dp : (v < 10 && i >= 2 ? 1 : (i >= 2 ? 1 : 0));
    return v.toFixed(d) + ' ' + u[i];
  }
  function bytesParts(n) {
    if (!n) return { n: '0', u: 'B' };
    var u = ['B', 'KB', 'MB', 'GB', 'TB'], i = 0, v = n;
    while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
    return { n: v.toFixed(i >= 3 ? 2 : 1), u: u[i] };
  }
  function relDate(d) {
    var days = Math.round((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return days + ' days ago';
    return Math.round(days / 30) + ' months ago';
  }

  window.wsdb = {
    facts: facts, section: section,
    set: set, toggleExcluded: toggleExcluded, isExcluded: isExcluded,
    toggleSelected: toggleSelected, setSelection: setSelection, reset: reset, rehearse: rehearse,
    on: function (f) { listeners.push(f); },
    derive: {
      activeTargets: activeTargets, heldByDeveloperMode: heldByDeveloperMode,
      reclaimable: reclaimable, bySection: bySection,
      safeRunSections: safeRunSections, safeRunBytes: safeRunBytes, offer: offer,
      safeRunRows: safeRunRows, keptByEngine: keptByEngine,
      needsAPerson: needsAPerson, mapData: mapData, mapDataAll: mapDataAll, drives: drives
    },
    fmt: { bytes: bytes, bytesParts: bytesParts, relDate: relDate }
  };
})();
