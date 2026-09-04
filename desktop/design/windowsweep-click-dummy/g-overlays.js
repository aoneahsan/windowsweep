/* Gallery 7 of 8 - overlays. Toast is the FALLBACK channel, not the default:
   if the change is visible on screen, the change is the feedback. */
(function () {
  'use strict';
  var G = window.G, el = G.el;

  function dialog(id, opts) {
    var scrim = el('div', 'scrim');
    scrim.id = id;
    var d = el('div', 'dlg' + (opts.size ? ' dlg-' + opts.size : '') + (opts.danger ? ' dlg-danger' : ''));
    d.setAttribute('role', opts.danger ? 'alertdialog' : 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-labelledby', id + '-t');

    var hd = el('div', 'dlg-hd');
    if (opts.icon) hd.appendChild(el('div', 'dlg-icon', opts.icon));
    var ht = el('div');
    var h = el('h2', 't-md wide', opts.title);
    h.id = id + '-t';
    ht.appendChild(h);
    if (opts.sub) ht.appendChild(el('p', 't-xs ink-3', opts.sub));
    hd.appendChild(ht);
    d.appendChild(hd);

    var bd = el('div', 'dlg-bd');
    (opts.body || []).forEach(function (p) { bd.appendChild(el('p', 't-sm', p)); });
    if (opts.scroll) {
      for (var i = 0; i < 14; i++) {
        bd.appendChild(el('p', 'mono t-xs ink-3',
          'C:\\Users\\PC\\AppData\\Local\\Temp\\build-cache-' + (1000 + i) + '   ' + (40 + i * 3) + ' MB'));
      }
    }
    d.appendChild(bd);

    var ft = el('div', 'dlg-ft');
    (opts.actions || []).forEach(function (a) {
      var b = G.btn(a[0], a[1] || '');
      b.setAttribute('data-w-close', '');
      if (a[2]) b.setAttribute('data-autofocus', '');
      ft.appendChild(b);
    });
    d.appendChild(ft);
    scrim.appendChild(d);
    document.body.appendChild(scrim);
    return scrim;
  }

  /* ---- playground: TOAST -------------------------------------------------- */
  window.wsPlayground.register('toast', {
    title: 'Toast',
    note: 'the fallback channel - used where the change is NOT visible on screen',
    dials: [
      { key: 'tone', label: 'Tone', value: 'plain', options: ['plain', 'success', 'error'] },
      { key: 'action', label: 'Action', value: 'undo', options: ['none', 'undo', 'view'] },
      { key: 'length', label: 'Message', value: 'typical', options: ['short', 'typical', 'longest'] },
      { key: 'count', label: 'Stack', value: 'one', options: ['one', 'three'] }
    ],
    render: function (mount, v) {
      var msgs = {
        short: 'Saved.',
        typical: 'Freed 3.31 GB across 5 sections.',
        longest: 'Sections 17, 18 and 19 need you to choose items first, so nothing was run – ' +
                 'open the picker and select what should go, or pass a selection file.'
      };
      /* The stage renders the toast ITSELF, at rest, so every dial changes what is
         on screen. A stage holding only a "raise it" button looks identical for
         every dial value - which is precisely what the playground gate reported,
         and it was right: those knobs drove behaviour nobody could see. */
      var stack = el('div');
      stack.style.cssText = 'display:flex;flex-direction:column;gap:var(--sp-2);width:min(30rem,100%)';
      var n = v.count === 'three' ? 3 : 1;
      for (var i = 0; i < n; i++) {
        var t = el('div', 'toast');
        if (v.tone === 'error') t.setAttribute('role', 'alert');
        if (v.tone === 'success') t.appendChild(el('span', 'state-ok', '✓'));
        if (v.tone === 'error') t.appendChild(el('span', null, '⚠'));
        t.appendChild(el('span', null, msgs[v.length] + (n > 1 ? ' (' + (i + 1) + ' of 3)' : '')));
        if (v.action === 'undo') t.appendChild(el('button', 'btn btn-sm undo', 'Undo'));
        if (v.action === 'view') t.appendChild(el('button', 'btn btn-sm undo', 'View report'));
        stack.appendChild(t);
      }
      mount.appendChild(stack);

      var b = G.btn('Raise it for real', 'btn-primary');
      b.addEventListener('click', function () {
        var k2 = v.count === 'three' ? 3 : 1;
        for (var j = 0; j < k2; j++) {
          (function (k) {
            setTimeout(function () {
              window.ws.toast(msgs[v.length] + (k2 > 1 ? ' (' + (k + 1) + ' of 3)' : ''), {
                assertive: v.tone === 'error',
                undo: v.action === 'undo' ? function () { window.ws.toast('Put back.'); } : null
              });
            }, k * 220);
          })(j);
        }
      });
      mount.appendChild(b);
      mount.appendChild(el('p', 't-2xs ink-3',
        v.tone === 'error'
          ? 'An error toast is role="alert" – assertive, because the user is about to act on a stale belief.'
          : 'A success toast is aria-live="polite" – it waits for a pause, because interrupting is rude for good news.'));
    }
  });

  /* ---- modal sizes -------------------------------------------------------- */
  var m = G.section('modal', 'Modal', 'consent, elevation, account');
  dialog('ov-sm', { size: 'sm', title: 'Rename this machine', sub: 'Shown in your run history.',
    body: ['Only you can see it. It is not sent with a run summary.'],
    actions: [['Cancel', '', true], ['Save', 'btn-primary']] });
  dialog('ov-md', { title: 'What a dry run does', icon: 'i',
    body: ['It walks every target a real run would, measures what it would free, and writes the same ' +
           'report – then deletes nothing.',
           'Running it first costs a few seconds and is the only way to see the list before it goes.'],
    actions: [['Close', '', true], ['Run the preview', 'btn-primary']] });
  dialog('ov-lg', { size: 'lg', title: 'Everything section 1 would remove', sub: '4.21 GB across 6 targets',
    scroll: true, actions: [['Close', '', true], ['Exclude all of these', 'btn-danger']] });
  dialog('ov-alert', { size: 'sm', danger: true, icon: '!', title: 'Delete 402 files permanently?',
    sub: 'They will not go to the Recycle Bin.',
    body: ['You chose Permanent for this run. windowsweep cannot put these back, and neither can Windows.'],
    actions: [['Keep them', '', true], ['Delete permanently', 'btn-danger']] });

  var mrow = el('div', 'spec-row');
  [['sm', 'ov-sm'], ['md', 'ov-md'], ['lg + scrolling body', 'ov-lg'], ['alert (destructive)', 'ov-alert']].forEach(function (x) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', x[0]));
    var b = G.btn('Open', x[0].indexOf('alert') === 0 ? 'btn-danger' : '');
    b.setAttribute('data-w-open', x[1]);
    cell.appendChild(b);
    mrow.appendChild(cell);
  });
  m.appendChild(mrow);
  G.note(m, 'Focus moves in on open, is trapped while open, Escape closes, and focus returns to the ' +
    'trigger. The fourth is the one hand-rolled implementations forget, and without it a keyboard user is ' +
    'dropped at the top of the page. RAC Modal does all four; this is a stand-in for judging the paint.');

  /* ---- drawer ------------------------------------------------------------- */
  var d = G.section('drawer', 'Drawer / sheet', 'the theme panel, and the report side view');
  var dopen = G.btn('Open the theme panel', 'btn-primary');
  dopen.addEventListener('click', function () { window.ws.openPanel(); });
  G.row(d, [
    { node: dopen, why: 'the real one - ten axes, every card previewing its own value' }
  ]);

  /* ---- popover + tooltip -------------------------------------------------- */
  var p = G.section('popover', 'Popover and tooltip', 'upload fields, tier chips, the elevation note');
  var pw = el('div');
  pw.style.position = 'relative';
  pw.style.display = 'inline-block';
  var ptrig = G.btn('What is a "tier"?', '', { 'aria-haspopup': 'dialog', 'aria-controls': 'ov-pop' });
  ptrig.setAttribute('data-w-menu', '');
  pw.appendChild(ptrig);
  var pop = el('div', 'pop');
  pop.id = 'ov-pop';
  pop.style.position = 'absolute';
  pop.style.insetInlineStart = '0';
  pop.style.marginTop = 'var(--sp-1)';
  pop.style.zIndex = '30';
  pop.style.width = '20rem';
  pop.appendChild(el('p', null, 'A tier says what happens to what a section finds:'));
  var pl = el('div');
  [['report', 'writes a list and deletes nothing'],
   ['rebuilds', 'regenerated automatically by your tools'],
   ['slow', 'regenerated, but the next run is slower'],
   ['recycle', 'goes to the Recycle Bin, recoverable'],
   ['permanent', 'gone for good'],
   ['config', 'a setting, not a file']].forEach(function (r) {
    var line = el('p');
    line.style.cssText = 'display:flex;gap:var(--sp-2);align-items:baseline;margin-top:var(--sp-1)';
    line.appendChild(G.tier(r[0]));
    line.appendChild(el('span', 't-2xs ink-3', r[1]));
    pl.appendChild(line);
  });
  pop.appendChild(pl);
  pw.appendChild(pop);

  var tw = el('div');
  tw.style.position = 'relative';
  tw.style.display = 'inline-block';
  var ttrig = G.btn('', 'btn-icon', { 'aria-label': 'Why is this disabled?' });
  ttrig.appendChild(el('span', null, '?'));
  ttrig.setAttribute('data-w-tip', '');
  ttrig.setAttribute('aria-describedby', 'ov-tip');
  tw.appendChild(ttrig);
  var tip = el('div', 'tip');
  tip.id = 'ov-tip';
  tip.setAttribute('role', 'tooltip');
  tip.style.position = 'absolute';
  tip.style.insetInlineStart = '0';
  tip.style.top = 'calc(100% + var(--sp-1))';
  tip.style.zIndex = '30';
  tip.textContent = 'Six sections need an elevated window, and windowsweep never elevates itself.';
  tw.appendChild(tip);

  G.row(p, [
    { label: 'popover (click, dismissible)', node: pw },
    { label: 'tooltip (hover AND focus)', node: tw, why: 'tab to it – keyboard users get tooltips too' }
  ]);

  /* ---- menu placement ------------------------------------------------------ */
  var mp = G.section('placement', 'Placement near a viewport edge', 'row actions in the last table row');
  var edge = el('div', 'spec-row');
  edge.style.justifyContent = 'space-between';
  ['start', 'end'].forEach(function (side) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', side + ' of the row'));
    cell.appendChild(G.menu('⋯', [
      { t: 'Dry run this section' }, { t: 'Show what it touches' }, '-',
      { t: 'Exclude it from every run', danger: true }
    ], { triggerClass: 'btn-icon' }));
    edge.appendChild(cell);
  });
  mp.appendChild(edge);
  G.note(mp, 'RAC positions collision-aware and flips at the edge. The dummy pins the surface to the ' +
    'trigger so the SPACING and elevation can be judged; the flipping is RAC’s and is not reproduced here.');

  /* ---- toasts, all kinds --------------------------------------------------- */
  var tt = G.section('toasts', 'Toast', 'every screen, sparingly');
  var trow = el('div', 'spec-row');
  [['plain', function () { window.ws.toast('Selection cleared.'); }],
   ['with undo', function () { window.ws.toast('Section 7 excluded from every run.', { undo: function () { window.ws.toast('Put back.'); } }); }],
   ['assertive (error)', function () { window.ws.toast('Chrome is running, so section 7 was skipped.', { assertive: true }); }],
   ['stacked', function () { [0, 1, 2].forEach(function (i) { setTimeout(function () { window.ws.toast('Section ' + (i + 1) + ' finished.'); }, i * 200); }); }]
  ].forEach(function (x) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', x[0]));
    var b = G.btn('Raise it');
    b.addEventListener('click', x[1]);
    cell.appendChild(b);
    trow.appendChild(cell);
  });
  tt.appendChild(trow);
  G.note(tt, 'Toast everything and the toast that mattered is ignored. In this product it carries only ' +
    'what happens ELSEWHERE – a background run finishing, a sync landing, an undoable change whose effect ' +
    'has already scrolled away. A button press is acknowledged at the button.');

  G.trims(G.section('overlay-trims', 'Trims', 'stated, not silent'), [
    ['Lightbox', 'there are no images to enlarge.'],
    ['Nested modals', 'nothing in eleven screens needs a dialog on top of a dialog – the one place it was ' +
      'tempting, the elevation explainer, became its own screen instead.'],
    ['Coach marks / product tour', 'the first-run flow is four steps and then out of the way.']
  ]);

  window.wsWidgets.boot();
  window.wsPlayground.boot();
})();
