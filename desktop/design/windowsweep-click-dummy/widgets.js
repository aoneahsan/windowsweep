/* ============================================================================
   Shared widget behaviour - the minimum that makes a specimen JUDGEABLE.

   The gallery must not invent the internal DOM of an interactive widget: in the
   app, menus, selects, tabs, dialogs, tooltips and sliders are React Aria
   Components, which own their markup, ARIA wiring and keyboard handling. A
   hand-rolled accessibility implementation is worse than RAC's AND gets thrown
   away in translation.

   But a static picture of an open listbox cannot be judged, and judging is what
   the gallery is for. So both rules hold at once:

     - the MARKUP is RAC's real anatomy (its class names, its roles, its
       data-selected / data-focused / data-pressed attributes), so the CSS
       reattaches unchanged;
     - the BEHAVIOUR here is just enough to open, select, dismiss and traverse,
       and the framework build DELETES it.

   Every gallery page says that in a line, so the next reader does not take the
   demo for the specification.

   One owner, one mount point, delegated listeners - never hand-copied per page
   (aoneahsan-cccs-click-dummy pitfall 4).
   ============================================================================ */
(function () {
  'use strict';

  var openLayer = null;   /* the single dismissible layer that is currently open */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function focusables(root) {
    return Array.prototype.filter.call(
      root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),' +
        'select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),' +
        '[contenteditable="true"]'),
      function (n) { return n.offsetParent !== null || n === document.activeElement; });
  }

  /* --- dismissible layers ------------------------------------------------- */

  function closeLayer() {
    if (!openLayer) return;
    var L = openLayer;
    openLayer = null;
    if (L.trigger) {
      L.trigger.setAttribute('aria-expanded', 'false');
      try { L.trigger.focus(); } catch (e) { void e; }
    }
    if (L.surface) L.surface.hidden = true;
    if (L.onClose) L.onClose();
  }

  function openAsLayer(trigger, surface, onClose) {
    closeLayer();
    openLayer = { trigger: trigger, surface: surface, onClose: onClose };
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (surface) surface.hidden = false;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openLayer) { e.stopPropagation(); closeLayer(); }
  });

  document.addEventListener('pointerdown', function (e) {
    if (!openLayer) return;
    if (openLayer.surface && openLayer.surface.contains(e.target)) return;
    if (openLayer.trigger && openLayer.trigger.contains(e.target)) return;
    closeLayer();
  });

  /* --- menu and select ----------------------------------------------------
     Same keyboard contract; they differ only in whether choosing writes a value
     back into a trigger. RAC gives both for free - this is the stand-in. */

  function itemsOf(surface) {
    return Array.prototype.slice.call(
      surface.querySelectorAll('.menu-item:not([aria-disabled="true"]),' +
                               '.lbox-item:not([aria-disabled="true"])'));
  }

  function moveFocus(surface, delta) {
    var items = itemsOf(surface);
    if (!items.length) return;
    var cur = items.indexOf(surface.querySelector('[data-focused]'));
    var next = cur < 0 ? (delta > 0 ? 0 : items.length - 1)
                       : (cur + delta + items.length) % items.length;
    items.forEach(function (i) { i.removeAttribute('data-focused'); });
    items[next].setAttribute('data-focused', 'true');
    items[next].scrollIntoView({ block: 'nearest' });
  }

  function wireDisclosurePair(trigger) {
    var surface = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!surface) return null;
    surface.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    return surface;
  }

  function bindMenuLike(trigger, isSelect) {
    var surface = wireDisclosurePair(trigger);
    if (!surface) return;

    trigger.addEventListener('click', function () {
      if (openLayer && openLayer.trigger === trigger) { closeLayer(); return; }
      openAsLayer(trigger, surface, function () {
        itemsOf(surface).forEach(function (i) { i.removeAttribute('data-focused'); });
      });
      moveFocus(surface, 1);
    });

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!openLayer || openLayer.trigger !== trigger) trigger.click();
        else moveFocus(surface, e.key === 'ArrowDown' ? 1 : -1);
      }
    });

    surface.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(surface, 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(surface, -1); }
      else if (e.key === 'Home') { e.preventDefault(); moveFocus(surface, 1); }
      else if (e.key === 'Enter' || e.key === ' ') {
        var f = surface.querySelector('[data-focused]');
        if (f) { e.preventDefault(); f.click(); }
      }
    });

    surface.addEventListener('click', function (e) {
      var item = e.target.closest('.menu-item,.lbox-item');
      if (!item || item.getAttribute('aria-disabled') === 'true') return;

      if (item.hasAttribute('aria-checked')) {
        item.setAttribute('aria-checked',
          item.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
        return;                                  /* checkable items keep the menu open */
      }
      if (isSelect) {
        itemsOf(surface).forEach(function (i) { i.setAttribute('aria-selected', 'false'); });
        item.setAttribute('aria-selected', 'true');
        var val = trigger.querySelector('.sel-val');
        if (val) val.textContent = item.dataset.label || item.textContent.trim();
        trigger.dispatchEvent(new CustomEvent('ws:change',
          { bubbles: true, detail: { value: item.dataset.value } }));
      }
      closeLayer();
    });
  }

  /* --- tabs: one tab stop for the list, arrows within it ------------------ */

  function bindTabs(list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('.tab'));
    function select(t) {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute('aria-selected', on ? 'true' : 'false');
        o.tabIndex = on ? 0 : -1;
        var p = document.getElementById(o.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); select(n);
      });
    });
    var cur = list.querySelector('.tab[aria-selected="true"]') || tabs[0];
    if (cur) select(cur);
  }

  /* --- dialog: focus moves in, is trapped, Escape closes, focus returns ---
     All four are RAC Modal's job in the app. The fourth is the one hand-rolled
     implementations forget, which drops a keyboard user at the top of the page. */

  var dlgReturn = null;

  function openDialog(id) {
    var scrim = document.getElementById(id);
    if (!scrim) return;
    dlgReturn = document.activeElement;
    scrim.hidden = false;
    document.body.style.overflow = 'hidden';
    var f = focusables(scrim);
    (scrim.querySelector('[data-autofocus]') || f[0] || scrim).focus();
  }

  function closeDialog(scrim) {
    if (!scrim || scrim.hidden) return;
    scrim.hidden = true;
    document.body.style.overflow = '';
    if (dlgReturn) { try { dlgReturn.focus(); } catch (e) { void e; } dlgReturn = null; }
  }

  function topDialog() {
    return document.querySelector('.scrim:not([hidden]),.cmdk-scrim:not([hidden])');
  }

  document.addEventListener('keydown', function (e) {
    var scrim = topDialog();
    if (!scrim) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDialog(scrim); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(scrim);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* --- sliders, switches, toolbars, disclosure ---------------------------- */

  function bindSlider(root) {
    var input = root.querySelector('input[type="range"]');
    var fill = root.querySelector('.sld-fill');
    var thumb = root.querySelector('.sld-thumb');
    var out = root.querySelector('[data-sld-out]');
    if (!input) return;
    function paint() {
      var min = +input.min || 0, max = +input.max || 100;
      var pct = ((+input.value - min) / (max - min)) * 100;
      if (fill) fill.style.width = pct + '%';
      if (thumb) thumb.style.insetInlineStart = pct + '%';
      if (out) out.textContent = input.dataset.suffix
        ? input.value + input.dataset.suffix : input.value;
      root.dispatchEvent(new CustomEvent('ws:slide', { bubbles: true, detail: { value: +input.value } }));
    }
    input.addEventListener('input', paint);
    paint();
  }

  function bindSwitch(sw) {
    sw.addEventListener('click', function () {
      if (sw.getAttribute('aria-disabled') === 'true' || sw.disabled) return;
      var on = sw.getAttribute('aria-checked') === 'true';
      sw.setAttribute('aria-checked', on ? 'false' : 'true');
      sw.dispatchEvent(new CustomEvent('ws:toggle', { bubbles: true, detail: { on: !on } }));
    });
  }

  /* --- tooltip: hover AND focus, because keyboard users get them too ------ */

  function bindTooltip(trigger) {
    var tip = document.getElementById(trigger.getAttribute('aria-describedby'));
    if (!tip) return;
    tip.hidden = true;
    var show = function () { tip.hidden = false; };
    var hide = function () { tip.hidden = true; };
    trigger.addEventListener('pointerenter', show);
    trigger.addEventListener('pointerleave', hide);
    trigger.addEventListener('focus', show);
    trigger.addEventListener('blur', hide);
  }

  /* --- rich text: tiptap-SHAPED over contenteditable ---------------------- */

  function bindRichText(root) {
    var body = root.querySelector('.rt-body');
    var count = root.querySelector('[data-rt-count]');
    if (!body) return;
    function sync() {
      if (count) count.textContent = (body.textContent || '').length + ' characters';
      root.querySelectorAll('.rt-btn[data-cmd]').forEach(function (b) {
        var on = false;
        try { on = document.queryCommandState(b.dataset.cmd); } catch (e) { void e; }
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    root.querySelectorAll('.rt-btn[data-cmd]').forEach(function (b) {
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });
      b.addEventListener('click', function () {
        body.focus();
        try { document.execCommand(b.dataset.cmd, false, null); } catch (e) { void e; }
        sync();
      });
    });
    body.addEventListener('input', sync);
    body.addEventListener('keyup', sync);
    body.addEventListener('mouseup', sync);
    sync();
  }

  /* --- file drop ---------------------------------------------------------- */

  function bindDrop(zone) {
    ['dragenter', 'dragover'].forEach(function (t) {
      zone.addEventListener(t, function (e) { e.preventDefault(); zone.dataset.state = 'dragging'; });
    });
    ['dragleave', 'drop'].forEach(function (t) {
      zone.addEventListener(t, function (e) { e.preventDefault(); zone.dataset.state = 'idle'; });
    });
  }

  /* --- command palette ---------------------------------------------------- */

  function bindCmdk() {
    var scrim = document.getElementById('cmdk');
    if (!scrim) return;
    var input = scrim.querySelector('.cmdk-in');
    var list = scrim.querySelector('.cmdk-list');
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (scrim.hidden) { openDialog('cmdk'); if (input) { input.value = ''; filter(''); } }
        else closeDialog(scrim);
      }
    });
    function filter(q) {
      q = q.toLowerCase();
      var shown = 0;
      list.querySelectorAll('.menu-item').forEach(function (i) {
        var hit = i.textContent.toLowerCase().indexOf(q) !== -1;
        i.hidden = !hit;
        if (hit) shown++;
      });
      var none = list.querySelector('[data-cmdk-empty]');
      if (none) none.hidden = shown > 0;
    }
    if (input) input.addEventListener('input', function () { filter(input.value); });
    if (list) list.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); moveFocus(list, e.key === 'ArrowDown' ? 1 : -1); }
    });
  }

  /* --- boot: idempotent, so a re-run is a no-op --------------------------- */

  function boot(scope) {
    scope = scope || document;
    var q = function (sel, fn) {
      scope.querySelectorAll(sel).forEach(function (n) {
        if (n.dataset.wBound === '1') return;
        n.dataset.wBound = '1';
        fn(n);
      });
    };
    q('[data-w-menu]', function (n) { bindMenuLike(n, false); });
    q('[data-w-select]', function (n) { bindMenuLike(n, true); });
    q('.tablist', bindTabs);
    q('.sld', bindSlider);
    q('.switch', bindSwitch);
    q('[data-w-tip]', bindTooltip);
    q('.rt', bindRichText);
    q('.drop', bindDrop);
    q('[data-w-open]', function (n) {
      n.addEventListener('click', function () { openDialog(n.dataset.wOpen); });
    });
    scope.querySelectorAll('[data-state="pending"]').forEach(function (n) {
      n.setAttribute('aria-busy', 'true');
    });
    q('[data-w-close]', function (n) {
      n.addEventListener('click', function () { closeDialog(n.closest('.scrim,.cmdk-scrim')); });
    });
    scope.querySelectorAll('.scrim,.cmdk-scrim').forEach(function (s) {
      if (s.dataset.wBound === '1') return;
      s.dataset.wBound = '1';
      s.hidden = true;
      s.addEventListener('pointerdown', function (e) { if (e.target === s) closeDialog(s); });
    });
    if (scope === document) bindCmdk();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { boot(); });
  else boot();

  /* Pending is a STATE, not a paint. The spinner is visual only; aria-busy is what
     tells a screen reader the control is working, and the label stays as the
     accessible name even though it is painted transparent. */
  function pending(btn, on) {
    if (!btn) return;
    if (on) { btn.dataset.state = 'pending'; btn.setAttribute('aria-busy', 'true'); }
    else { delete btn.dataset.state; btn.removeAttribute('aria-busy'); }
  }

  window.wsWidgets = {
    boot: boot, el: el, pending: pending,
    openDialog: openDialog,
    closeDialog: function (id) { closeDialog(document.getElementById(id)); },
    closeLayer: closeLayer
  };
})();
