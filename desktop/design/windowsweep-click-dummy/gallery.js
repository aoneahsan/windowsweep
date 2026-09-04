/* ============================================================================
   Gallery shell + specimen builders, shared by all eight files.

   The eight-file index lives here ONCE and is rendered into every page, for the
   same reason the nav rail does: one project hand-copied its sidebar into 31
   pages and they drifted within a week.

   Zero innerHTML - createElement + textContent only.
   ============================================================================ */
(function () {
  'use strict';

  var FILES = [
    { f: 'gallery.html',            t: 'Index + actions',  d: 'buttons, toggles, groups, menus, links, feedback' },
    { f: 'gallery-typography.html', t: 'Typography',       d: 'the scale, headings, prose, code, measure, numerals' },
    { f: 'gallery-forms.html',      t: 'Forms',            d: 'field structure, inputs, choice, specialised, multi-step' },
    { f: 'gallery-tables.html',     t: 'Tables',           d: 'the section table in every state' },
    { f: 'gallery-display.html',    t: 'Display',          d: 'cards, stats, lists, badges, tiers, progress, empty' },
    { f: 'gallery-navigation.html', t: 'Navigation',       d: 'shell, rail, tabs, breadcrumbs, pagination, palette' },
    { f: 'gallery-overlays.html',   t: 'Overlays',         d: 'modal, alert, drawer, popover, tooltip, toast' },
    { f: 'gallery-charts.html',     t: 'Charts',           d: 'treemap, ring, sparkline, bar - with data dials' }
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function here() { return location.pathname.split('/').pop() || 'gallery.html'; }

  function renderNav() {
    var host = document.querySelector('[data-g-nav]');
    if (!host || host.dataset.built === '1') return;
    host.dataset.built = '1';
    var nav = el('div', 'gnav');
    FILES.forEach(function (x) {
      var a = el('a', null, x.t);
      a.href = x.f;
      a.title = x.d;
      if (x.f === here()) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    });
    host.appendChild(nav);
  }

  /* The line that keeps the demo from being mistaken for the specification. */
  function renderRacNote() {
    var host = document.querySelector('[data-g-racnote]');
    if (!host || host.dataset.built === '1') return;
    host.dataset.built = '1';
    var n = el('div', 'rac-note');
    var s = el('div');
    s.appendChild(el('strong', null, 'What survives translation, and what does not. '));
    s.appendChild(document.createTextNode(
      'The markup here is React Aria Components’ real anatomy – its class names, roles and ' +
      'data-selected / data-focused / data-pressed attributes – so components.css reattaches to the ' +
      'app unchanged. The behaviour driving these specimens is a stand-in that the framework build ' +
      'DELETES: RAC supplies focus management, typeahead, collision-aware positioning and 30+ locales, ' +
      'and a hand-rolled version of any of that would be worse and thrown away. So judge the paint, the ' +
      'spacing, the states and the sequence between them – not the element tree.'));
    n.appendChild(s);
    host.appendChild(n);
  }

  function mount() { return document.querySelector('[data-g-mount]'); }

  /* section(id, title, usedBy) -> a .spec block, appended in call order */
  function section(id, title, usedBy) {
    var wrap = el('section', 'spec');
    wrap.id = id;
    var hd = el('div', 'spec-hd');
    var h = el('h3', null, title);
    hd.appendChild(h);
    if (usedBy) hd.appendChild(el('span', 'spec-use', 'used by ' + usedBy));
    wrap.appendChild(hd);
    mount().appendChild(wrap);
    return wrap;
  }

  /* row(spec, cells) - cells are {label, node} or {label, nodes:[...]}          */
  function row(spec, cells, opts) {
    opts = opts || {};
    var r = el('div', 'spec-row');
    if (opts.stack) r.setAttribute('data-stack', '');
    cells.forEach(function (c) {
      var cell = el('div', 'spec-cell');
      if (c.label) cell.appendChild(el('span', 'caps', c.label));
      (c.nodes || [c.node]).forEach(function (n) { if (n) cell.appendChild(n); });
      if (c.why) cell.appendChild(el('span', 't-2xs ink-3', c.why));
      r.appendChild(cell);
    });
    spec.appendChild(r);
    return r;
  }

  function note(spec, text) { spec.appendChild(el('p', 'spec-note', text)); return spec; }

  /* The trims, stated. Silently skipping a control means discovering at page 30
     that nothing specifies it. */
  function trims(spec, list) {
    var box = el('div', 'spec-trim');
    box.appendChild(el('p', null,
      'Not built, because this product does not use it – listed rather than silently absent:'));
    list.forEach(function (t) {
      var p = el('p');
      p.appendChild(el('b', null, t[0]));
      p.appendChild(document.createTextNode(' – ' + t[1]));
      box.appendChild(p);
    });
    spec.appendChild(box);
    return box;
  }

  /* --- small builders shared across files --------------------------------- */

  function btn(text, cls, attrs) {
    var b = el('button', 'btn' + (cls ? ' ' + cls : ''), text);
    b.type = 'button';
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'disabled') { b.disabled = !!attrs[k]; return; }
      b.setAttribute(k, attrs[k]);
    });
    return b;
  }

  function badge(text, cls) { return el('span', 'badge ' + (cls || 'badge-neutral'), text); }

  function tier(name) {
    var t = el('span', 'tier tier-' + name);
    t.appendChild(el('span', 't-xs', name));
    return t;
  }

  function sw(on, label) {
    var b = el('button', 'switch');
    b.type = 'button';
    b.setAttribute('role', 'switch');
    b.setAttribute('aria-checked', on ? 'true' : 'false');
    b.setAttribute('aria-label', label || 'Toggle');
    return b;
  }

  /* field(kind, opts) - the wrapper anatomy RAC expects, not a pile of divs */
  var uid = 0;
  function field(opts) {
    opts = opts || {};
    uid++;
    var id = 'f' + uid;
    var w = el('div', 'fw');
    if (opts.label) {
      var l = el('label', 'fw-lbl');
      l.htmlFor = id;
      l.appendChild(document.createTextNode(opts.label));
      if (opts.required) l.appendChild(el('span', 'fw-req', '*'));
      w.appendChild(l);
    }
    var inputHost = w;
    var input;
    if (opts.kind === 'rich') {
      input = richText(opts);
    } else {
      input = el('input', 'field');
      input.id = id;
      input.type = opts.kind || 'text';
      if (opts.placeholder) input.placeholder = opts.placeholder;
      if (opts.value != null) input.value = opts.value;
      if (opts.disabled) input.disabled = true;
      if (opts.readonly) input.readOnly = true;
      if (opts.invalid) input.setAttribute('aria-invalid', 'true');
      if (opts.mono) input.classList.add('field-mono');
      if (opts.affix) {
        var fx = el('div', 'fx');
        fx.appendChild(input);
        fx.appendChild(opts.affix);
        inputHost.appendChild(fx);
        input = null;
      }
    }
    if (input) inputHost.appendChild(input);
    if (opts.desc) {
      var d = el('span', 'fw-desc', opts.desc);
      d.id = id + '-d';
      w.appendChild(d);
      var target = w.querySelector('.field,.rt-body');
      if (target) target.setAttribute('aria-describedby', d.id);
    }
    if (opts.error) {
      var e = el('span', 'fw-err');
      e.appendChild(el('span', null, '⚠'));
      e.appendChild(el('span', null, opts.error));
      w.appendChild(e);
    }
    if (opts.count != null) {
      var row2 = el('div', 'fw-row');
      var c = el('span', 'fw-count', opts.count);
      if (opts.over) c.setAttribute('data-over', 'true');
      row2.appendChild(c);
      w.appendChild(row2);
    }
    return w;
  }

  function richText(opts) {
    var rt = el('div', 'rt');
    var bar = el('div', 'rt-bar');
    [['bold', 'B'], ['italic', 'I'], ['underline', 'U'],
     ['insertUnorderedList', '•'], ['insertOrderedList', '1.']].forEach(function (c) {
      var b = el('button', 'rt-btn', c[1]);
      b.type = 'button';
      b.dataset.cmd = c[0];
      b.setAttribute('aria-label', c[0]);
      b.setAttribute('aria-pressed', 'false');
      bar.appendChild(b);
    });
    rt.appendChild(bar);
    var body = el('div', 'rt-body');
    body.contentEditable = 'true';
    body.setAttribute('role', 'textbox');
    body.setAttribute('aria-multiline', 'true');
    body.setAttribute('aria-label', opts.label || 'Rich text');
    body.dataset.placeholder = opts.placeholder || 'Type here…';
    if (opts.value) body.appendChild(el('p', null, opts.value));
    rt.appendChild(body);
    var ft = el('div', 'rt-ft');
    var cnt = el('span', null, '0 characters');
    cnt.setAttribute('data-rt-count', '');
    ft.appendChild(cnt);
    rt.appendChild(ft);
    return rt;
  }

  function chk(label, opts) {
    opts = opts || {};
    var w = el('label', 'chk');
    var i = el('input');
    i.type = opts.radio ? 'radio' : 'checkbox';
    if (opts.name) i.name = opts.name;
    if (opts.checked) i.checked = true;
    if (opts.disabled) i.disabled = true;
    w.appendChild(i);
    if (opts.radio) {
      var rb = el('span', 'rad-box');
      rb.appendChild(el('span', 'rad-dot'));
      w.appendChild(rb);
      w.className = 'rad';
    } else {
      var cb = el('span', 'chk-box');
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 20 20');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '3');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M4 10.5 8 14.5 16 6');
      svg.appendChild(path);
      cb.appendChild(svg);
      w.appendChild(cb);
    }
    var span = el('span', null, label);
    if (opts.desc) {
      var box = el('span');
      box.appendChild(el('span', 'ws-block', label));
      box.appendChild(el('span', 't-xs ink-3', opts.desc));
      box.firstChild.style.display = 'block';
      span = box;
    }
    w.appendChild(span);
    if (opts.indeterminate) i.indeterminate = true;
    return w;
  }

  function seg(name, options, current) {
    var g = el('div', 'seg');
    g.setAttribute('role', 'radiogroup');
    options.forEach(function (o) {
      var lab = el('label', 'seg-opt');
      var i = el('input');
      i.type = 'radio'; i.name = name; i.value = o;
      if (o === current) i.checked = true;
      lab.appendChild(i);
      lab.appendChild(el('span', null, o));
      g.appendChild(lab);
    });
    return g;
  }

  function slider(opts) {
    opts = opts || {};
    var s = el('div', 'sld');
    var head = el('div', 'fw-row');
    if (opts.label) head.appendChild(el('span', 'fw-lbl', opts.label));
    var out = el('span', 'num t-sm accent-ink');
    out.setAttribute('data-sld-out', '');
    out.style.marginInlineStart = 'auto';
    head.appendChild(out);
    s.appendChild(head);
    var track = el('div', 'sld-track');
    var fill = el('i', 'sld-fill');
    var thumb = el('i', 'sld-thumb');
    var input = el('input');
    input.type = 'range';
    input.min = opts.min != null ? opts.min : 0;
    input.max = opts.max != null ? opts.max : 100;
    input.value = opts.value != null ? opts.value : 50;
    if (opts.suffix) input.dataset.suffix = opts.suffix;
    input.setAttribute('aria-label', opts.label || 'Value');
    track.appendChild(fill); track.appendChild(thumb); track.appendChild(input);
    s.appendChild(track);
    return s;
  }

  var menuId = 0;
  function menu(triggerText, items, opts) {
    opts = opts || {};
    menuId++;
    var id = 'menu' + menuId;
    var wrap = el('div');
    wrap.style.position = 'relative';
    wrap.style.display = 'inline-block';
    var t = btn(triggerText, opts.triggerClass || '', { 'aria-haspopup': 'menu', 'aria-controls': id });
    t.setAttribute('data-w-menu', '');
    wrap.appendChild(t);
    var m = el('div', 'menu');
    m.id = id;
    m.setAttribute('role', 'menu');
    m.style.position = 'absolute';
    m.style.insetInlineStart = '0';
    m.style.marginTop = 'var(--sp-1)';
    m.style.zIndex = '30';
    items.forEach(function (it) {
      if (it === '-') { m.appendChild(el('hr', 'menu-sep')); return; }
      if (it.label) { m.appendChild(el('div', 'menu-label', it.label)); return; }
      var b = el('button', 'menu-item' + (it.danger ? ' is-danger' : ''));
      b.type = 'button';
      b.setAttribute('role', it.checkable ? 'menuitemcheckbox' : 'menuitem');
      if (it.checkable) {
        b.setAttribute('aria-checked', it.checked ? 'true' : 'false');
        b.appendChild(el('span', 'menu-check', '✓'));
      }
      b.appendChild(el('span', null, it.t));
      if (it.kbd) b.appendChild(el('span', 'kbd', it.kbd));
      if (it.disabled) {
        b.setAttribute('aria-disabled', 'true');
        b.title = it.why || 'Not available in this state';
      }
      m.appendChild(b);
    });
    wrap.appendChild(m);
    return wrap;
  }

  var selId = 0;
  function select(opts) {
    opts = opts || {};
    selId++;
    var id = 'lbox' + selId;
    var wrap = el('div');
    wrap.style.position = 'relative';
    var t = el('button', 'sel-btn');
    t.type = 'button';
    t.setAttribute('data-w-select', '');
    t.setAttribute('aria-haspopup', 'listbox');
    t.setAttribute('aria-controls', id);
    if (opts.label) t.setAttribute('aria-label', opts.label);
    if (opts.disabled) t.disabled = true;
    if (opts.invalid) t.setAttribute('data-invalid', 'true');
    t.appendChild(el('span', 'sel-val', opts.value || opts.placeholder || 'Choose…'));
    t.appendChild(el('span', 'sel-caret', '▾'));
    wrap.appendChild(t);
    var lb = el('div', 'lbox');
    lb.id = id;
    lb.setAttribute('role', 'listbox');
    lb.style.position = 'absolute';
    lb.style.insetInline = '0';
    lb.style.marginTop = 'var(--sp-1)';
    lb.style.zIndex = '30';
    (opts.options || []).forEach(function (o) {
      var i = el('div', 'lbox-item');
      i.setAttribute('role', 'option');
      i.setAttribute('aria-selected', o === opts.value ? 'true' : 'false');
      i.dataset.value = o;
      i.textContent = o;
      lb.appendChild(i);
    });
    if (!(opts.options || []).length) lb.appendChild(el('div', 'lbox-empty', opts.empty || 'Nothing matches'));
    wrap.appendChild(lb);
    return wrap;
  }

  function boot() {
    renderNav();
    renderRacNote();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.G = {
    el: el, mount: mount, section: section, row: row, note: note, trims: trims,
    btn: btn, badge: badge, tier: tier, sw: sw, field: field, richText: richText,
    chk: chk, seg: seg, slider: slider, menu: menu, select: select, boot: boot,
    FILES: FILES
  };
})();
