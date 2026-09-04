/* ============================================================================
   windowsweep desktop dummy - the shell
   Loaded SYNCHRONOUSLY from <head> (no defer), so the axis pass runs before the
   body is parsed and therefore before first paint - while still keeping ONE axis
   table. Appearance applied late is a colour flash; density or text size applied
   late is a REFLOW.

   🔴 This file OWNS every piece of shared chrome it drives - the rail, the theme
   panel and its toggle, the toast stack, the cursor layer. Nothing is hand-copied
   into a page (click-dummy pitfall 4: four silent defects in one dummy, of which
   the owner saw one). Zero innerHTML; createElement + textContent only.
   ============================================================================ */
(function () {
  'use strict';

  var NS = 'wsdummy';                       // physical keys are `wsdummy:<key>`
  var PREFS_KEY = 'prefs';

  /* -------------------------------------------------------------------------
     STORAGE. Same shape and the same `namespace` semantics as strata-storage, so
     the app swaps the implementation and nothing else. strata itself is not
     vendored here because that is a download, gated on PENDING-TASKS TASK-001.

     🔴 The value is wrapped `{v: ...}` exactly as strata wraps it, and the
     physical key is `<namespace>:<key>` - both couplings are named at BOTH ends
     so a namespace change cannot silently revert this to unprefixed keys.
     Verify by reading a physical key, never by reading this config.
     ------------------------------------------------------------------------- */
  var store = {
    backend: 'memory',
    _mem: {},
    key: function (k) { return NS + ':' + k; },
    get: function (k, dflt) {
      try {
        var raw = localStorage.getItem(this.key(k));
        if (raw == null) return dflt;
        var parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && 'v' in parsed ? parsed.v : dflt;
      } catch (e) { return this._mem[k] !== undefined ? this._mem[k] : dflt; }
    },
    set: function (k, v) {
      this._mem[k] = v;
      try { localStorage.setItem(this.key(k), JSON.stringify({ v: v })); } catch (e) { /* memory only */ }
    },
    clearAll: function () {
      this._mem = {};
      try {
        var doomed = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(NS + ':') === 0) doomed.push(k);
        }
        doomed.forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) { /* ignore */ }
    }
  };
  // probe availability with a real write/read/delete rather than trusting a list
  try {
    var probe = NS + ':__probe';
    localStorage.setItem(probe, '1');
    if (localStorage.getItem(probe) === '1') store.backend = 'localStorage';
    localStorage.removeItem(probe);
  } catch (e) { store.backend = 'memory'; }

  /* -------------------------------------------------------------------------
     🔴 THE AXIS REGISTRY - ONE table. The pre-paint pass iterates it, the panel
     renders from it, one applyAxis() writes it. Adding an axis is one row, so an
     axis cannot be half-added. The recorded failure this prevents: a project
     whose CSS was byte-faithful across six axes while only three were ever
     WRITTEN to the DOM.
     ------------------------------------------------------------------------- */
  var AXES = [
    { key: 'theme',        attr: 'data-theme',         label: 'Appearance',      def: 'dark',
      values: [ {v:'light', t:'Light'}, {v:'dark', t:'Dark'}, {v:'system', t:'System'} ], preview: 'appearance' },
    { key: 'palette',      attr: 'data-palette',       label: 'Colour treatment', def: 'lime',
      values: [ {v:'lime', t:'Lime'}, {v:'sky', t:'Sky'}, {v:'plum', t:'Plum'} ], preview: 'swatch' },
    { key: 'radius',       attr: 'data-radius',        label: 'Corner radius',   def: 'medium',
      values: [ {v:'none',t:'None'}, {v:'small',t:'Small'}, {v:'medium',t:'Medium'}, {v:'large',t:'Large'}, {v:'full',t:'Full'} ], preview: 'radius' },
    { key: 'density',      attr: 'data-density',       label: 'Density',         def: 'comfortable',
      values: [ {v:'compact',t:'Compact'}, {v:'comfortable',t:'Comfortable'}, {v:'spacious',t:'Spacious'} ], preview: 'density' },
    { key: 'typeScale',    attr: 'data-type-scale',    label: 'Text size',       def: 'medium',
      values: [ {v:'small',t:'Small'}, {v:'medium',t:'Medium'}, {v:'large',t:'Large'} ], preview: 'typescale' },
    { key: 'font',         attr: 'data-font',          label: 'Typeface',        def: 'grotesque',
      values: [ {v:'grotesque',t:'Archivo'}, {v:'native',t:'Segoe'} ], preview: 'font' },
    { key: 'surfaceStyle', attr: 'data-surface-style', label: 'Panel background', def: 'solid',
      values: [ {v:'solid',t:'Solid'}, {v:'translucent',t:'Translucent'} ], preview: 'surface' },
    { key: 'cursor',       attr: 'data-cursor',        label: 'Custom cursor',   def: 'custom',
      values: [ {v:'custom',t:'On'}, {v:'off',t:'Off'} ], preview: 'cursor' },
    { key: 'motion',       attr: 'data-motion',        label: 'Motion',          def: 'system',
      values: [ {v:'system',t:'System'}, {v:'full',t:'Full'}, {v:'reduced',t:'Reduced'} ], preview: 'motion' },
    // 🔴 the ONE axis that defaults off - a product that beeps unasked gets muted
    //    at the OS level and loses the channel permanently
    { key: 'sound',        attr: 'data-sound',         label: 'Sound',           def: 'off',
      values: [ {v:'on',t:'On'}, {v:'off',t:'Off'} ], preview: 'sound' }
  ];

  var prefs = store.get(PREFS_KEY, {}) || {};

  /* URL overrides are SHOWN, never persisted - a reviewer who links
     ?palette=plum&theme=light must not have it follow them for the session. */
  var urlOverride = {};
  try {
    var q = new URLSearchParams(location.search);
    AXES.forEach(function (a) {
      var raw = q.get(a.key) || q.get(a.attr.replace(/^data-/, ''));
      if (raw && a.values.some(function (x) { return x.v === raw; })) urlOverride[a.key] = raw;
    });
  } catch (e) { /* ignore */ }

  function axisValue(key) {
    if (key in urlOverride) return urlOverride[key];
    var a = AXES.filter(function (x) { return x.key === key; })[0];
    if (!a) return undefined;
    var v = prefs[key];
    return a.values.some(function (x) { return x.v === v; }) ? v : a.def;
  }

  function resolveAppearance() {
    var t = axisValue('theme');
    if (t === 'system') {
      try { return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
      catch (e) { return 'dark'; }
    }
    return t;
  }

  /* 🔴 ONE apply path, iterating the ONE table. Nothing writes an axis attribute
     anywhere else in this codebase. */
  function applyAllAxes() {
    var el = document.documentElement;
    AXES.forEach(function (a) { el.setAttribute(a.attr, axisValue(a.key)); });
    el.setAttribute('data-appearance', resolveAppearance());   // the RESOLVED value
    el.style.colorScheme = resolveAppearance();
  }
  applyAllAxes();                                              // <- before first paint

  try {
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
      if (axisValue('theme') === 'system') applyAllAxes();
    });
  } catch (e) { /* ignore */ }

  function setAxis(key, v) {
    delete urlOverride[key];
    prefs[key] = v;
    store.set(PREFS_KEY, prefs);
    applyAllAxes();
    renderPanelState();
  }

  /* -------------------------------------------------------------------------
     The motion decision consults BOTH the axis and the OS. A media query cannot
     see the axis, so anything that asks the query directly lets the setting
     appear in the panel, persist correctly, and change nothing.
     ------------------------------------------------------------------------- */
  function prefersReducedMotion() {
    var m = axisValue('motion');
    if (m === 'reduced') return true;
    if (m === 'full') return false;
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  /* -------------------------------------------------------------------------
     NAVIGATION - single source. One project hand-copied its sidebar into 31
     files, ended up with five divergent navigations, and only 38 of 49 pages
     were reachable by clicking.
     ------------------------------------------------------------------------- */
  var NAV = [
    { group: 'Clean' },
    { href: 'index.html',    label: 'Home',      icon: 'home' },
    { href: 'sections.html', label: 'Sections',  icon: 'list',  badge: '26' },
    { href: 'run.html',      label: 'Run',       icon: 'play' },
    { group: 'Records' },
    { href: '#history',  label: 'History',  icon: 'clock',  soon: true },
    { href: '#reports',  label: 'Reports',  icon: 'doc',    soon: true },
    { group: 'You' },
    { href: '#account',  label: 'Account',  icon: 'user',   soon: true },
    { href: '#settings', label: 'Settings', icon: 'gear',   soon: true }
  ];

  var ICONS = {
    home: 'M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-4v-4H8v4H4a1 1 0 0 1-1-1z',
    list: 'M6 5h11M6 10h11M6 15h11M3 5h.01M3 10h.01M3 15h.01',
    play: 'M6 4l10 6-10 6z',
    clock: 'M10 3a7 7 0 1 0 0 14A7 7 0 0 0 10 3zm0 3.4V10l2.6 1.6',
    doc: 'M5 3h6l4 4v10H5zM11 3v4h4',
    user: 'M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 17c0-3 2.7-4.6 6-4.6s6 1.6 6 4.6',
    gear: 'M10 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2zM10 2.6v1.8M10 15.6v1.8M17.4 10h-1.8M4.4 10H2.6M15.2 4.8l-1.3 1.3M6.1 13.9l-1.3 1.3M15.2 15.2l-1.3-1.3M6.1 6.1 4.8 4.8',
    sun: 'M10 13.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM10 1.8v1.6M10 16.6v1.6M18.2 10h-1.6M3.4 10H1.8M15.8 4.2l-1.1 1.1M5.3 14.7l-1.1 1.1M15.8 15.8l-1.1-1.1M5.3 5.3 4.2 4.2',
    close: 'M5 5l10 10M15 5 5 15',
    min: 'M4 10h12',
    max: 'M5 5h10v10H5z',
    menu: 'M3 6h14M3 10h14M3 14h14'
  };

  function svgIcon(name, size) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 20 20');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.6');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    if (size) { s.style.width = size + 'px'; s.style.height = size + 'px'; }
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', ICONS[name] || ICONS.doc);
    s.appendChild(p);
    return s;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function currentPage() {
    var f = location.pathname.split('/').pop();
    return f && f.length ? f : 'index.html';
  }

  function buildRail(mount) {
    if (!mount || mount.dataset.built === '1') return;
    mount.dataset.built = '1';
    var here = currentPage();
    NAV.forEach(function (item) {
      if (item.group) { mount.appendChild(el('div', 'rail-group caps', item.group)); return; }
      var a = el('a', 'rail-item');
      a.href = item.href;
      a.appendChild(svgIcon(item.icon));
      a.appendChild(el('span', null, item.label));
      if (item.badge) a.appendChild(el('span', 'rail-badge', item.badge));
      if (item.soon) {
        a.appendChild(el('span', 'rail-badge', 'soon'));
        a.setAttribute('aria-disabled', 'true');
        a.addEventListener('click', function (ev) {
          ev.preventDefault();
          toast('That screen is in the next batch of this dummy – the direction is what is under review now.');
        });
      }
      if (item.href === here) a.setAttribute('aria-current', 'page');
      mount.appendChild(a);
    });

    // the rail had ~500px of dead space below the nav; a compact readout uses it and
    // keeps the number in view on every screen, not only Home
    var foot = el('div', 'rail-foot');
    foot.appendChild(el('span', 'caps ink-3', 'Reclaimable'));
    var big = el('span', 'num t-md wide accent-ink');
    big.setAttribute('data-ws-text', 'cleanBtn');
    big.textContent = '-';
    foot.appendChild(big);
    var sub = el('span', 't-xs ink-3');
    sub.appendChild(el('span', null, 'across '));
    var n = el('span', 'num');
    n.setAttribute('data-ws-text', 'sectionCount');
    n.textContent = '0';
    sub.appendChild(n);
    sub.appendChild(el('span', null, ' sections'));
    foot.appendChild(sub);
    mount.appendChild(foot);
  }

  /* -------------------------------------------------------------------------
     THE ONE THEME PANEL. Built here, by the same code that drives it, behind an
     idempotent guard - and its toggle is injected into a container whose name is
     the SAME on every page (pitfall 10: a whole preferences UI present in the DOM
     and unreachable, because two shells called the action cluster different
     things).
     ------------------------------------------------------------------------- */
  var panelEls = null;

  function buildPanel() {
    if (document.querySelector('.sheet[data-ws-panel]')) return;

    var scrim = el('div', 'sheet-scrim');
    scrim.hidden = true;
    var sheet = el('aside', 'sheet');
    sheet.hidden = true;
    sheet.setAttribute('data-ws-panel', '');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Appearance');

    var hd = el('div', 'sheet-hd');
    hd.appendChild(el('h2', 't-md', 'Appearance'));
    var close = el('button', 'btn btn-ghost btn-sm');
    close.style.marginInlineStart = 'auto';
    close.setAttribute('aria-label', 'Close appearance panel');
    close.appendChild(svgIcon('close', 14));
    hd.appendChild(close);
    sheet.appendChild(hd);

    var bd = el('div', 'sheet-bd');
    AXES.forEach(function (a) {
      var wrap = el('div');
      var lab = el('span', 'axis-name caps', a.label);
      lab.id = 'axis-' + a.key;
      wrap.appendChild(lab);
      var group = el('div', 'cards');
      group.setAttribute('role', 'radiogroup');
      group.setAttribute('aria-labelledby', lab.id);
      a.values.forEach(function (val) {
        var card = el('button', 'card-sel');
        card.type = 'button';
        card.setAttribute('role', 'radio');
        card.dataset.axis = a.key;
        card.dataset.value = val.v;
        card.appendChild(previewFor(a, val.v));
        card.appendChild(el('span', null, val.t));
        card.addEventListener('click', function () { setAxis(a.key, val.v); });
        group.appendChild(card);
      });
      wrap.appendChild(group);
      bd.appendChild(wrap);
    });

    var note = el('p', 't-xs ink-3');
    note.textContent = 'Saved to this machine. Add ?palette=plum&theme=light to any link to show a look ' +
                       'without saving it.';
    bd.appendChild(note);
    sheet.appendChild(bd);

    document.body.appendChild(scrim);
    document.body.appendChild(sheet);
    panelEls = { scrim: scrim, sheet: sheet };

    function closePanel() {
      scrim.hidden = true; sheet.hidden = true;
      var t = document.querySelector('[data-ws-theme-toggle]');
      if (t) t.focus();
    }
    scrim.addEventListener('click', closePanel);
    close.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) closePanel();
    });
    renderPanelState();
  }

  /* 🔴 Each card previews its OWN value - a radius card drawn at its radius, a
     treatment card showing that treatment's real surface/ink/accent triad. A
     card that only carries a word is a dropdown wearing a border. */
  function previewFor(axis, v) {
    var p = el('span', 'prev');
    if (axis.preview === 'radius') {
      var r = el('span', 'prev-radius');
      r.style.borderRadius = ({ none: '0', small: '2px', medium: '4px', large: '7px', full: '9px' })[v];
      p.appendChild(r);
    } else if (axis.preview === 'swatch') {
      var sw = el('span', 'prev-swatch');
      ['--c-panel', '--c-ink-2', '--c-accent'].forEach(function (tok) {
        var i = el('i');
        // read the value FROM that treatment, not from the live one
        i.style.background = 'var(' + tok + ')';
        sw.appendChild(i);
      });
      sw.setAttribute('data-palette', v);
      sw.setAttribute('data-appearance', resolveAppearance());
      p.appendChild(sw);
    } else if (axis.preview === 'density') {
      var d = el('span', 'prev-density');
      var gap = ({ compact: '2px', comfortable: '4px', spacious: '6px' })[v];
      d.style.gap = gap;
      for (var i2 = 0; i2 < 3; i2++) d.appendChild(el('i'));
      p.appendChild(d);
    } else if (axis.preview === 'typescale') {
      var t = el('span', null, 'Ag');
      t.style.fontSize = ({ small: '10px', medium: '13px', large: '17px' })[v];
      t.style.fontFamily = 'var(--ff-display)';
      p.appendChild(t);
    } else if (axis.preview === 'font') {
      var f = el('span', null, 'Ag');
      f.style.fontSize = '14px';
      f.style.fontFamily = v === 'native'
        ? "'Segoe UI Variable Display','Segoe UI',system-ui,sans-serif"
        : "'Archivo','Segoe UI',system-ui,sans-serif";
      p.appendChild(f);
    } else if (axis.preview === 'appearance') {
      var ap = el('span', 'prev-appearance');
      var l = el('i'), rr = el('i');
      l.style.background = v === 'dark' ? 'oklch(.2 0 0)' : 'oklch(.97 0 0)';
      rr.style.background = v === 'light' ? 'oklch(.97 0 0)' : 'oklch(.2 0 0)';
      ap.appendChild(l); ap.appendChild(rr);
      p.appendChild(ap);
    } else if (axis.preview === 'surface') {
      var s2 = el('span', 'prev-radius');
      s2.style.borderRadius = '3px';
      s2.style.background = v === 'translucent'
        ? 'color-mix(in oklab, var(--c-ink) 22%, transparent)'
        : 'var(--c-ink-3)';
      s2.style.borderColor = 'transparent';
      p.appendChild(s2);
    } else if (axis.preview === 'cursor') {
      var c = el('span', 'prev-radius');
      c.style.borderRadius = '999px';
      c.style.width = '14px'; c.style.height = '14px';
      c.style.opacity = v === 'off' ? '.3' : '1';
      p.appendChild(c);
    } else if (axis.preview === 'motion') {
      p.appendChild(el('span', null, v === 'reduced' ? '||' : (v === 'full' ? '>>>' : '>>')));
    } else if (axis.preview === 'sound') {
      p.appendChild(el('span', null, v === 'on' ? '♪' : '—'));
    }
    return p;
  }

  function renderPanelState() {
    document.querySelectorAll('.card-sel[data-axis]').forEach(function (c) {
      var on = axisValue(c.dataset.axis) === c.dataset.value;
      c.setAttribute('aria-checked', on ? 'true' : 'false');
      c.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll('.prev-swatch[data-palette]').forEach(function (s) {
      s.setAttribute('data-appearance', resolveAppearance());
    });
  }

  function openPanel() {
    buildPanel();
    if (!panelEls) return;
    panelEls.scrim.hidden = false;
    panelEls.sheet.hidden = false;
    renderPanelState();
    var first = panelEls.sheet.querySelector('.card-sel[aria-checked="true"]');
    if (first) first.focus();
  }

  /* -------------------------------------------------------------------------
     TOASTS - the fallback channel, for what happens ELSEWHERE. A visible state
     change at the control is always preferred.
     ------------------------------------------------------------------------- */
  function toastMount() {
    var m = document.querySelector('.toasts');
    if (!m) {
      m = el('div', 'toasts');
      m.setAttribute('aria-live', 'polite');
      document.body.appendChild(m);
    }
    return m;
  }

  function toast(msg, opts) {
    opts = opts || {};
    var m = toastMount();
    var t = el('div', 'toast');
    if (opts.assertive) t.setAttribute('role', 'alert');
    t.appendChild(el('span', null, msg));
    if (opts.undo) {
      var u = el('button', 'btn btn-sm undo', 'Undo');
      u.addEventListener('click', function () { opts.undo(); t.remove(); });
      t.appendChild(u);
    }
    m.appendChild(t);
    setTimeout(function () { t.remove(); }, opts.undo ? 8000 : 4200);
    return t;
  }

  /* -------------------------------------------------------------------------
     THE CURSOR LAYER, and §16's overlay-contrast rule.
     ------------------------------------------------------------------------- */
  var SURFACES = [
    { name: 'accent', sel: '.btn-primary, .cap-recl, .fchip[aria-pressed="true"]' },
    // .selbar and .card-sel each paint their OWN background and were both missed by
    // the first version of this registry - found by the gate, not by reading the CSS
    { name: 'bleed',  sel: '.band-bleed, .titlebar, .statusbar, .toast, .tm-tip, .selbar' },
    { name: 'panel',  sel: '.panel, .sheet' },
    { name: 'well',   sel: '.band-well, .well, .rail, .tm-frame, .logview, .field, .card-sel, .disclose, .tbl tbody tr[data-selected="true"]' },
    { name: 'app',    sel: '.band-app, body' }
  ];

  function buildCursor() {
    if (document.querySelector('.cursor')) return;
    var ring = el('div', 'cursor');
    var dot = el('div', 'cursor-dot');
    ring.setAttribute('aria-hidden', 'true');
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    var x = -100, y = -100, rx = -100, ry = -100, raf = 0;

    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      if (!raf) raf = requestAnimationFrame(tick);
    });

    function tick() {
      raf = 0;
      var lag = prefersReducedMotion() ? 1 : 0.22;
      rx += (x - rx) * lag; ry += (y - ry) * lag;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      if (Math.abs(x - rx) > 0.4 || Math.abs(y - ry) > 0.4) raf = requestAnimationFrame(tick);
    }

    /* 🔴 Resolved on a BOUNDARY event, never in the animation frame. A band change
       happens tens of times a session; a frame runs 60 times a second, and writing
       a dataset attribute there invalidates style every frame. */
    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      if (!(t instanceof Element)) return;
      var name = 'app';
      for (var i = 0; i < SURFACES.length; i++) {
        if (t.closest(SURFACES[i].sel)) { name = SURFACES[i].name; break; }
      }
      ring.setAttribute('data-surface', name);
      dot.setAttribute('data-surface', name);
      ring.setAttribute('data-over',
        t.closest('button, a, [role="button"], input, .tm-tile') ? 'interactive' : 'plain');
    });
  }

  /* -------------------------------------------------------------------------
     GATES. §12f: none of this class of defect has a gate unless one is built, so
     these run on demand from demo.js and each is designed to be watched failing.
     ------------------------------------------------------------------------- */
  var gates = {
    /* 🔴 Asserts on the CONSEQUENCE - what actually paints - not on the
       stylesheet source. A source-shaped check cannot see whether a rule applied,
       and a manifest cross-checked against itself cannot fail. Every element that
       paints its own background must be claimed by the cursor's surface registry,
       or the pointer can be drawn in that surface's own colour and vanish. */
    overlayContrast: function () {
      /* 🔴 Only a surface the pointer can sit INSIDE needs a mapping. The cursor
         ring is 26px and grows to 40px over anything interactive, so an element
         smaller than that is always overlapped by the surface around it too - and
         that surface's mapping already governs the colour. Flagging every 1px
         divider and 9px swatch made the gate report 22 "failures" that could not
         hide a pointer, which is the too-permissive/too-strict pair a new gate
         arrives with. Opaque, and at least cursor-sized: that is the claim set. */
      var CUR = 40;
      var unclaimed = [], seen = {}, painted = 0;

      /* 🔴 Normalise through a canvas, never by parsing the string. Chrome returns
         `oklch(...)` from getComputedStyle for every colour in this project, so an
         `rgba(...)` regex matches NOTHING - which made this gate count 0 painted
         surfaces and report PASS. A gate that measures nothing and says PASS is
         worse than no gate: it reports safety it cannot observe. The planted
         unmapped band is what exposed it, by failing to turn it red. */
      var cv = document.createElement('canvas'); cv.width = cv.height = 1;
      var cx = cv.getContext('2d', { willReadFrequently: true });
      function alphaOf(col) {
        cx.clearRect(0, 0, 1, 1);
        cx.globalCompositeOperation = 'copy';
        cx.fillStyle = 'rgba(0,0,0,0)';
        cx.fillStyle = col;
        cx.fillRect(0, 0, 1, 1);
        return cx.getImageData(0, 0, 1, 1).data[3] / 255;
      }

      var all = document.querySelectorAll('body *');
      for (var i = 0; i < all.length; i++) {
        var n = all[i];
        if (n.closest('.cursor, .cursor-dot, .toasts')) continue;
        var bg = getComputedStyle(n).backgroundColor;
        if (!bg) continue;
        var alpha = alphaOf(bg);
        if (alpha < 0.9) continue;                       // see-through: the layer below governs
        var r = n.getBoundingClientRect();
        if (r.width < CUR || r.height < CUR) continue;   // smaller than the pointer
        painted++;
        if (SURFACES.some(function (s) { return n.matches(s.sel); })) continue;
        var sig = n.tagName.toLowerCase() + '.' +
          (typeof n.className === 'string' && n.className ? n.className.split(' ').slice(0, 2).join('.') : '(none)');
        if (seen[sig]) continue;
        seen[sig] = 1;
        unclaimed.push(sig);
      }
      return { pass: unclaimed.length === 0, painted: painted, unclaimed: unclaimed };
    },

    /* The table, the rendered panel and the DOM must agree on the SAME count.
       Asserting an axis is "declared" is what passed while five of nine were
       never written - so this reads the live attribute off <html>. */
    axes: function () {
      var missing = [], mismatched = [];
      AXES.forEach(function (a) {
        var live = document.documentElement.getAttribute(a.attr);
        if (live == null) { missing.push(a.key); return; }
        if (live !== axisValue(a.key)) mismatched.push(a.key + '=' + live);
      });
      var cards = new Set();
      document.querySelectorAll('.card-sel[data-axis]').forEach(function (c) { cards.add(c.dataset.axis); });
      return {
        pass: missing.length === 0 && mismatched.length === 0 && cards.size === AXES.length,
        declared: AXES.length, written: AXES.length - missing.length, inPanel: cards.size,
        missing: missing, mismatched: mismatched
      };
    },

    /* Proves the namespace actually reached the adapter. A prefix that is silently
       discarded is indistinguishable from one that works, because the same wrong
       key is used both ways. */
    storageNamespace: function () {
      try { localStorage.removeItem('__gate'); } catch (e) { /* a prior run's plant */ }
      store.set('__gate', 'x');
      var physical = null, stray = [];
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (!k || k.indexOf('__gate') === -1) continue;
          if (k === NS + ':__gate') physical = k; else stray.push(k);
        }
      } catch (e) { /* ignore */ }
      var ok = physical === NS + ':__gate' && stray.length === 0;
      try { localStorage.removeItem(NS + ':__gate'); localStorage.removeItem('__gate'); } catch (e) { /* ignore */ }
      return { pass: ok, physicalKey: physical || (stray[0] || null), stray: stray,
               expected: NS + ':__gate', backend: store.backend };
    },

    /* 🔴 documentElement.scrollWidth returns the viewport width whatever overflows
       when html is overflow-x:clip - it hid a 775px topbar in a 320px viewport.
       Walk the elements instead. */
    overflow: function () {
      var vw = document.documentElement.clientWidth, bad = [], skipped = 0;
      /* 🔴 A FIXED ANCESTOR counts, not only a fixed element. The off-canvas drawer
         is position:fixed and translated -100%, so it is correctly off-screen - but
         its 36 descendants are statically positioned inside it and a naive
         `position === 'fixed'` test reports every one of them as an overflow. That
         over-reporting is the gate's own bug, and it is the shape a new gate almost
         always has first. */
      function inFixed(n) {
        for (var p = n; p && p !== document.body; p = p.parentElement) {
          if (getComputedStyle(p).position === 'fixed') return true;
        }
        return false;
      }
      document.querySelectorAll('body *').forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.width === 0) return;
        if (!(r.right > vw + 1.5 || r.left < -1.5)) return;
        // wide content is allowed to scroll inside its OWN container, never the body
        if (n.closest('.xscroll, .logview, .toasts')) { skipped++; return; }
        if (inFixed(n)) { skipped++; return; }
        bad.push(n.tagName.toLowerCase() + '.' + (typeof n.className === 'string' ? n.className : '') +
                 ' @' + Math.round(r.right));
      });
      return { pass: bad.length === 0, viewport: vw, offenders: bad.slice(0, 12),
               count: bad.length, allowed: skipped };
    }
  };

  /* -------------------------------------------------------------------------
     THE TITLE BAR is built here too, for the same reason the panel is. Copied
     into three pages by hand it would work on all three today and lose its
     [data-ws-actions] mount on one of them the first time a page is edited -
     which is pitfall 10 exactly: a complete preferences UI present in the DOM
     and unreachable, with nothing erroring.
     ------------------------------------------------------------------------- */
  function buildTitlebar(bar) {
    if (!bar || bar.dataset.built === '1') return;
    bar.dataset.built = '1';

    var drawer = el('button', 'btn btn-ghost btn-sm tb-interactive drawer-btn');
    drawer.setAttribute('aria-label', 'Menu');
    drawer.appendChild(svgIcon('menu', 15));
    drawer.addEventListener('click', function () {
      var r = document.documentElement;
      r.setAttribute('data-drawer', r.getAttribute('data-drawer') === 'open' ? 'closed' : 'open');
    });
    bar.appendChild(drawer);

    var svgNS = 'http://www.w3.org/2000/svg';
    var mark = document.createElementNS(svgNS, 'svg');
    mark.setAttribute('class', 'tb-mark');
    mark.setAttribute('viewBox', '0 0 24 24');
    mark.setAttribute('fill', 'none');
    mark.setAttribute('aria-hidden', 'true');
    [['M2 17c4.5 0 5-9 10-9s5.5 6 10 6', '3.4', '1'],
     ['M2 21c4.5 0 5-6 10-6s5.5 4 10 4', '2', '.45']].forEach(function (d) {
      var p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', d[0]);
      p.setAttribute('stroke', 'var(--c-accent)');
      p.setAttribute('stroke-width', d[1]);
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('opacity', d[2]);
      mark.appendChild(p);
    });
    bar.appendChild(mark);

    bar.appendChild(el('span', 'tb-title', 'windowsweep'));

    var ver = el('span', 'badge badge-outline mono', '1.1.0');
    ver.setAttribute('data-ws-text', 'engineVersion');
    bar.appendChild(ver);

    bar.appendChild(el('span', 'tb-sep only-wide'));
    var user = el('span', 'badge badge-neutral only-wide', 'standard user');
    user.title = 'Admin sections need a UAC prompt this window cannot answer';
    bar.appendChild(user);
    bar.appendChild(el('span', 'badge badge-warn only-wide', 'design dummy · demo data'));

    // the ONE mount point the theme toggle goes into, with ONE name, everywhere
    var actions = el('div', 'wincontrols tb-interactive');
    actions.setAttribute('data-ws-actions', '');
    bar.appendChild(actions);

    var wc = el('div', 'wincontrols tb-interactive');
    [['min', 'Minimise', ''], ['max', 'Maximise', ''], ['close', 'Close', ' wc-close']].forEach(function (c) {
      var b = el('button', 'wc' + c[2]);
      b.setAttribute('aria-label', c[1]);
      b.appendChild(svgIcon(c[0], 13));
      wc.appendChild(b);
    });
    bar.appendChild(wc);
  }

  /* ------------------------------------------------------------------------- */
  function boot() {
    buildTitlebar(document.querySelector('[data-ws-titlebar]'));
    buildRail(document.querySelector('[data-ws-rail]'));
    buildPanel();
    buildCursor();

    // the theme toggle is injected by the SAME owner that builds the panel and the
    // bar it lands in, so the three cannot disagree
    var host = document.querySelector('[data-ws-actions]');
    if (host && !host.querySelector('[data-ws-theme-toggle]')) {
      var b = el('button', 'btn btn-ghost btn-sm tb-interactive');
      b.setAttribute('data-ws-theme-toggle', '');
      b.setAttribute('aria-label', 'Appearance settings');
      b.title = 'Appearance';
      b.appendChild(svgIcon('sun', 15));
      b.addEventListener('click', openPanel);
      host.appendChild(b);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.ws = {
    AXES: AXES, NAV: NAV, SURFACES: SURFACES,
    store: store, axisValue: axisValue, setAxis: setAxis,
    prefersReducedMotion: prefersReducedMotion,
    openPanel: openPanel, toast: toast, icon: svgIcon, el: el,
    gates: gates, ns: NS,
    resetAll: function () { store.clearAll(); location.reload(); }
  };
})();
