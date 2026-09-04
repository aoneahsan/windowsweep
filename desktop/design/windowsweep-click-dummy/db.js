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
    consent: null,         // null = never asked; otherwise {ga4,amplitude,clarity,sentry}
    signedIn: false,
    email: null,
    schedule: false,
    selection: []          // section ids selected on the Sections screen
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
    toggleSelected: toggleSelected, setSelection: setSelection, reset: reset,
    on: function (f) { listeners.push(f); },
    derive: {
      activeTargets: activeTargets, heldByDeveloperMode: heldByDeveloperMode,
      reclaimable: reclaimable, bySection: bySection,
      safeRunSections: safeRunSections, safeRunBytes: safeRunBytes,
      needsAPerson: needsAPerson, mapData: mapData, mapDataAll: mapDataAll, drives: drives
    },
    fmt: { bytes: bytes, bytesParts: bytesParts, relDate: relDate }
  };
})();
