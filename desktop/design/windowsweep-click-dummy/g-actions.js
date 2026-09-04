/* Gallery 1 of 8 - the index, actions, and the feedback + system primitives. */
(function () {
  'use strict';
  var G = window.G, el = G.el;

  var LONG = 'Reclaim 42.7 GB across twenty-six sections';
  var LABELS = { short: 'Run', typical: 'Start the safe run', long: LONG, rtl: 'ابدأ التنظيف الآمن' };

  /* ---- playground: ONE live button, driven ------------------------------- */
  window.wsPlayground.register('actions', {
    title: 'Button',
    note: 'used by every screen',
    dials: [
      { key: 'variant', label: 'Variant', value: 'primary', options: ['primary', 'default', 'ghost', 'danger'] },
      { key: 'size', label: 'Size', value: 'md', options: ['sm', 'md', 'lg'] },
      { key: 'state', label: 'State', value: 'default', options: ['default', 'hover', 'pending', 'disabled'] },
      { key: 'label', label: 'Label', value: 'typical', options: ['short', 'typical', 'long', 'rtl'] },
      { key: 'icon', label: 'Icon', value: 'none', options: ['none', 'leading', 'trailing', 'only'] },
      { key: 'width', label: 'Width', value: 'auto', options: ['auto', 'block'] }
    ],
    render: function (mount, v) {
      var cls = { primary: 'btn-primary', danger: 'btn-danger', ghost: 'btn-ghost', 'default': '' }[v.variant];
      var b = G.btn('', cls);
      if (v.size !== 'md') b.classList.add('btn-' + v.size);
      if (v.width === 'block') b.classList.add('btn-block');
      if (v.icon === 'only') b.classList.add('btn-icon');

      var text = LABELS[v.label];
      if (v.label === 'rtl') b.setAttribute('dir', 'rtl');

      if (v.icon === 'leading' || v.icon === 'only') b.appendChild(window.ws.icon('play', 15));
      if (v.icon !== 'only') b.appendChild(el('span', null, text));
      else b.setAttribute('aria-label', text);
      if (v.icon === 'trailing') b.appendChild(window.ws.icon('play', 15));

      if (v.state === 'disabled') {
        b.disabled = true;
        /* disabled still explains itself */
        b.title = 'Nothing is selected yet, so there is nothing to run.';
      }
      if (v.state === 'pending') window.wsWidgets.pending(b, true);
      if (v.state === 'hover') b.setAttribute('data-hovered', 'true');

      /* Acting on it produces its own acknowledgement, at the control. */
      b.addEventListener('click', function () {
        if (b.dataset.state === 'pending') return;
        window.wsWidgets.pending(b, true);
        setTimeout(function () {
          window.wsWidgets.pending(b, false);
          window.ws.toast('Dry run finished. Nothing was deleted.');
        }, 900);
      });

      mount.appendChild(b);
      var hint = el('p', 't-2xs ink-3',
        v.state === 'disabled'
          ? 'Hover it: a disabled control still says why, because `disabled` hides it from screen readers too.'
          : 'Press it - the pending state lands on the button, not in a toast in the far corner.');
      hint.style.textAlign = 'center';
      mount.appendChild(hint);
    }
  });

  /* ---- the index --------------------------------------------------------- */
  var idx = G.section('index', 'The eight files', 'this page is 1 of 8');
  var grid = el('div', 'spec-grid');
  G.FILES.forEach(function (x, i) {
    var a = el('a', 'card');
    a.href = x.f;
    var bd = el('div', 'card-bd');
    bd.appendChild(el('p', 'caps ink-3', (i + 1) + ' of 8'));
    bd.appendChild(el('p', 't-md wide', x.t));
    bd.appendChild(el('p', 't-sm ink-3', x.d));
    a.appendChild(bd);
    grid.appendChild(a);
  });
  idx.appendChild(grid);
  G.note(idx, 'Every page from A4 on is composed from this vocabulary. A page that needs something the ' +
    'library lacks is a signal the LIBRARY is incomplete - it is added here deliberately, never inline as ' +
    'a one-off.');

  /* ---- buttons ----------------------------------------------------------- */
  var s = G.section('buttons', 'Button', 'every screen');
  G.row(s, [
    { label: 'primary', node: G.btn('Start the safe run', 'btn-primary') },
    { label: 'default', node: G.btn('Preview first') },
    { label: 'ghost', node: G.btn('Cancel', 'btn-ghost') },
    { label: 'danger', node: G.btn('Delete permanently', 'btn-danger') },
    { label: 'link-style', node: (function () { var a = el('a', 'lnk', 'What does this delete?'); a.href = '#buttons'; return a; })() }
  ]);
  G.row(s, [
    { label: 'sm', node: G.btn('Small', 'btn-sm') },
    { label: 'md', node: G.btn('Medium') },
    { label: 'lg', node: G.btn('Large', 'btn-lg') },
    {
      label: 'icon only', node: (function () {
        var b = G.btn('', 'btn-icon', { 'aria-label': 'Open settings' });
        b.appendChild(window.ws.icon('gear', 16)); return b;
      })()
    },
    {
      label: 'leading icon', node: (function () {
        var b = G.btn('', 'btn-primary');
        b.appendChild(window.ws.icon('play', 15));
        b.appendChild(el('span', null, 'Run')); return b;
      })()
    }
  ]);

  var states = el('div', 'spec-row');
  [['default', {}], ['hover', { 'data-hovered': 'true' }], ['pressed', { 'data-pressed': 'true' }],
   ['focus-visible', { 'data-focus-visible': 'true' }], ['disabled', { disabled: true }],
   ['pending', { 'data-state': 'pending' }]].forEach(function (st) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', st[0]));
    var b = G.btn('Run', 'btn-primary', st[1]);
    if (st[0] === 'disabled') b.title = 'Choose at least one section first.';
    cell.appendChild(b);
    states.appendChild(cell);
  });
  s.appendChild(states);
  G.note(s, 'focus-visible, never focus: a mouse click must not leave a ring behind. Hover sits behind ' +
    '@media (hover: hover) so a tap on a touch screen leaves no stuck state. And a disabled control ' +
    'carries its reason - `disabled` removes it from the tab order AND from screen readers, so a bare ' +
    'greyed-out button is invisible to some users and inexplicable to the rest.');

  /* ---- toggle + group ---------------------------------------------------- */
  var t = G.section('toggle', 'Toggle, group and split', 'sections.html filters, run.html controls');
  G.row(t, [
    { label: 'toggle off', node: G.btn('Developer mode', '', { 'aria-pressed': 'false' }) },
    { label: 'toggle on', node: G.btn('Developer mode', '', { 'aria-pressed': 'true' }) },
    {
      label: 'group', node: (function () {
        var g = el('div', 'btn-group');
        ['All', 'Safe', 'Deep'].forEach(function (x, i) {
          g.appendChild(G.btn(x, '', { 'aria-pressed': i === 0 ? 'true' : 'false' }));
        });
        return g;
      })()
    },
    {
      label: 'split', node: (function () {
        /* One primary action plus a menu of variants on it. The menu keeps its own
           relative wrapper, so the trigger and its surface never get separated. */
        var wrap = el('div');
        wrap.style.display = 'inline-flex';
        var g = el('div', 'btn-group');
        g.appendChild(G.btn('Run safe batch', 'btn-primary'));
        wrap.appendChild(g);
        wrap.appendChild(G.menu('▾', [
          { t: 'Run with a dry run first' },
          { t: 'Run and notify me', kbd: 'N' },
          '-',
          { t: 'Run everything', danger: true }
        ], { triggerClass: 'btn-primary btn-icon' }));
        return wrap;
      })()
    }
  ]);

  /* ---- menu -------------------------------------------------------------- */
  var m = G.section('menu', 'Menu', 'the title bar and every row action');
  G.row(m, [
    {
      label: 'sections, icons, checkable, destructive',
      node: G.menu('Actions', [
        { label: 'This run' },
        { t: 'Dry run', kbd: 'D' },
        { t: 'Run now', kbd: '⏎' },
        '-',
        { label: 'Options' },
        { t: 'Send to Recycle Bin', checkable: true, checked: true },
        { t: 'Notify me when it finishes', checkable: true },
        { t: 'Run elevated', disabled: true, why: 'This section does not need administrator rights.' },
        '-',
        { t: 'Forget this machine’s history', danger: true }
      ])
    }
  ]);
  G.note(m, 'Open it and use the arrow keys: focus moves without leaving the trigger’s tab stop. Escape ' +
    'closes and returns focus. A checkable item keeps the menu open; a command closes it.');

  /* ---- links ------------------------------------------------------------- */
  var lk = G.section('links', 'Link', 'about, docs, the author block');
  var inline = el('p', 't-sm');
  inline.appendChild(document.createTextNode('Every deletion goes through '));
  var a1 = el('a', 'lnk', 'one chokepoint'); a1.href = '#links';
  inline.appendChild(a1);
  inline.appendChild(document.createTextNode(', and the full argument is in the '));
  var a2 = el('a', 'lnk', 'safety model'); a2.href = '#links';
  inline.appendChild(a2);
  inline.appendChild(document.createTextNode('.'));

  var ext = el('a', 'lnk');
  ext.href = 'https://github.com/aoneahsan/windowsweep';
  ext.target = '_blank';
  ext.rel = 'noopener';
  ext.appendChild(document.createTextNode('windowsweep on GitHub'));
  ext.appendChild(el('span', 'visually-hidden', ' (opens in a new tab)'));

  G.row(lk, [
    { label: 'inline in prose', node: inline },
    { label: 'external', node: ext, why: 'carries a visually-hidden "(opens in a new tab)" - WCAG G201' }
  ], { stack: true });
  G.note(lk, 'An explicit aria-label REPLACES an element’s content, so on an icon-only link the hint has ' +
    'to be folded into the label instead - a hidden span there is dead markup that reads like a solved ' +
    'problem. Only his own products and profiles are do-follow; everything else third-party is nofollow.');

  /* ---- feedback and system ----------------------------------------------- */
  var fb = G.section('feedback', 'Feedback and system', 'every screen');
  G.row(fb, [
    { label: 'inline spinner', node: (function () { var w = el('span', 't-sm'); w.appendChild(el('i', 'spinner')); w.appendChild(document.createTextNode(' Measuring…')); return w; })() },
    { label: 'button loading', node: G.btn('Scanning', 'btn-primary', { 'data-state': 'pending' }) },
    {
      label: 'page skeleton', node: (function () {
        var w = el('div'); w.style.width = '12rem';
        [80, 60, 40].forEach(function (p) { var l = el('div', 'skel skel-l'); l.setAttribute('data-w', String(p)); w.appendChild(l); });
        return w;
      })()
    }
  ]);
  G.row(fb, [
    {
      label: 'offline banner', node: (function () {
        var n = el('div', 'note note-warn');
        n.appendChild(el('span', null, '⚠'));
        n.appendChild(el('span', null, 'You are offline. Cleaning still works – the engine never needed the network. Sync will catch up.'));
        return n;
      })()
    }
  ], { stack: true });
  G.row(fb, [
    {
      label: 'error boundary fallback', node: (function () {
        var w = el('div', 'empty');
        w.appendChild(el('h3', null, 'This panel stopped working'));
        w.appendChild(el('p', null, 'Nothing was deleted, and your last run’s report is safe on disk. ' +
          'Reload the panel, or copy the details for a bug report.'));
        var r = el('div'); r.style.display = 'flex'; r.style.gap = 'var(--sp-2)';
        r.appendChild(G.btn('Reload panel', 'btn-primary'));
        r.appendChild(G.btn('Copy details'));
        w.appendChild(r);
        return w;
      })()
    }
  ], { stack: true });
  G.row(fb, [
    {
      label: 'undo affordance', node: (function () {
        var b = G.btn('Clear selection');
        b.addEventListener('click', function () {
          window.ws.toast('Selection cleared.', { undo: function () { window.ws.toast('Selection restored.'); } });
        });
        return b;
      })(), why: 'press it - undo beats a confirm dialog wherever the action is reversible'
    },
    {
      label: 'confirmation (irreversible only)', node: (function () {
        var b = G.btn('Empty the Recycle Bin', 'btn-danger');
        b.addEventListener('click', function () { window.wsWidgets.openDialog('demo-confirm'); });
        return b;
      })(), why: 'a confirm interrupts everyone to protect against a rare mistake - so it is kept for what cannot be walked back'
    }
  ]);

  /* the alert dialog the confirmation above opens */
  (function () {
    var scrim = el('div', 'scrim');
    scrim.id = 'demo-confirm';
    var d = el('div', 'dlg dlg-sm dlg-danger');
    d.setAttribute('role', 'alertdialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-labelledby', 'demo-confirm-t');
    var hd = el('div', 'dlg-hd');
    hd.appendChild(el('div', 'dlg-icon', '!'));
    var ht = el('div');
    ht.appendChild(el('h2', 't-md wide', 'Empty the Recycle Bin?'));
    ht.firstChild.id = 'demo-confirm-t';
    ht.appendChild(el('p', 't-xs ink-3', 'This cannot be undone.'));
    hd.appendChild(ht);
    d.appendChild(hd);
    var bd = el('div', 'dlg-bd');
    bd.appendChild(el('p', 't-sm', 'The bin holds 2,481 items and 6.1 GB. Everything in it goes permanently, ' +
      'including anything windowsweep put there in earlier runs.'));
    d.appendChild(bd);
    var ft = el('div', 'dlg-ft');
    var cancel = G.btn('Keep them');
    cancel.setAttribute('data-w-close', '');
    cancel.setAttribute('data-autofocus', '');
    var go = G.btn('Empty it', 'btn-danger');
    go.setAttribute('data-w-close', '');
    go.addEventListener('click', function () { window.ws.toast('Nothing happened – this is a design prototype.'); });
    ft.appendChild(cancel); ft.appendChild(go);
    d.appendChild(ft);
    scrim.appendChild(d);
    document.body.appendChild(scrim);
  })();

  G.trims(fb, [
    ['Rating', 'nothing in a disk-cleanup tool is rated.'],
    ['Avatar group', 'one account, one machine - there is never a second face to show.'],
    ['Bottom navigation', 'the Tauri window has a 760px minimum, so there is no mobile target.']
  ]);

  window.wsWidgets.boot();
  window.wsPlayground.boot();
})();
