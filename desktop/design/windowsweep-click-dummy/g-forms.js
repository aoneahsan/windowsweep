/* Gallery 3 of 8 - forms. Field structure first, because it is what makes an
   error visible; then inputs, choice, specialised controls and the multi-step. */
(function () {
  'use strict';
  var G = window.G, el = G.el;

  /* ---- playground: the FIELD WRAPPER, not the input ----------------------
     The wrapper is the component that goes wrong: a primitive that forgets to
     forward errorMessage lets every field in the app turn red and never say
     why - five primitives on one project, compiling and building clean. */
  window.wsPlayground.register('field', {
    title: 'Field wrapper',
    note: 'label, required marker, description, error, count - one anatomy',
    dials: [
      { key: 'kind', label: 'Input', value: 'text', options: ['text', 'password', 'number', 'search', 'select', 'rich'] },
      { key: 'state', label: 'State', value: 'default', options: ['default', 'invalid', 'disabled', 'readonly'] },
      { key: 'help', label: 'Help', value: 'description', options: ['none', 'description', 'count', 'both'] },
      { key: 'label', label: 'Label', value: 'typical', options: ['typical', 'longest', 'none'] },
      { key: 'required', label: 'Required', value: 'no', options: ['no', 'yes'] }
    ],
    render: function (mount, v) {
      var labels = {
        typical: 'Idle window',
        longest: 'Extra folders to scan for stale build artefacts, one per line',
        none: null
      };
      var opts = {
        kind: v.kind === 'select' || v.kind === 'rich' ? v.kind : v.kind,
        label: labels[v.label],
        required: v.required === 'yes',
        placeholder: 'e.g. 100',
        value: v.kind === 'number' ? '100' : '',
        desc: (v.help === 'description' || v.help === 'both')
          ? 'Files untouched for longer than this are treated as stale. Below 30 days windowsweep asks twice.'
          : null,
        error: v.state === 'invalid' ? 'Enter a whole number of days between 1 and 3650.' : null,
        disabled: v.state === 'disabled',
        readonly: v.state === 'readonly',
        invalid: v.state === 'invalid',
        count: (v.help === 'count' || v.help === 'both') ? '3 / 4 characters' : null
      };

      var node;
      if (v.kind === 'select') {
        node = el('div', 'fw');
        if (opts.label) {
          var l = el('label', 'fw-lbl');
          l.appendChild(document.createTextNode(opts.label));
          if (opts.required) l.appendChild(el('span', 'fw-req', '*'));
          node.appendChild(l);
        }
        node.appendChild(G.select({
          label: opts.label || 'Profile',
          value: 'dev',
          options: ['dev', 'minimal', 'cache-only', 'system', 'deep', 'audit'],
          disabled: opts.disabled, invalid: opts.invalid
        }));
        if (opts.desc) node.appendChild(el('span', 'fw-desc', opts.desc));
        if (opts.error) {
          var e = el('span', 'fw-err');
          e.appendChild(el('span', null, '\u26a0'));
          e.appendChild(el('span', null, opts.error));
          node.appendChild(e);
        }
      } else {
        node = G.field(opts);
      }
      node.style.width = 'min(30rem, 100%)';
      mount.appendChild(node);
      if (v.state === 'invalid') {
        mount.appendChild(el('p', 't-2xs ink-3',
          'The message sits beside the control and never animates in - the user needs to read it now.'));
      }
      if (v.state === 'readonly') {
        mount.appendChild(el('p', 't-2xs ink-3',
          'Read-only is visibly different from disabled: legible, selectable, still in the tab order.'));
      }
    }
  });

  /* ---- structure --------------------------------------------------------- */
  var st = G.section('structure', 'Field structure', 'settings.html, picker.html, account.html');
  G.row(st, [
    { label: 'complete', node: G.field({ label: 'Idle window', required: true, kind: 'number', value: '100', desc: 'Files untouched for longer than this are treated as stale.', count: '3 / 4 characters' }) },
    { label: 'with error', node: G.field({ label: 'Idle window', kind: 'text', value: 'ninety', invalid: true, error: 'Enter a whole number of days between 1 and 3650.' }) },
    { label: 'read-only', node: G.field({ label: 'Report folder', kind: 'text', value: '%USERPROFILE%\\.windowsweep\\reports', readonly: true, mono: true, desc: 'Change it with --reports-dir.' }) },
    { label: 'disabled', node: G.field({ label: 'Scan roots', kind: 'text', value: 'D:\\work', disabled: true, desc: 'Turn on developer mode to scan project folders.' }) }
  ], { stack: false });
  G.note(st, 'RAC derives aria-describedby from Text and FieldError children, so the anatomy is ' +
    'Label > Input > description > error - not a pile of divs with a red border. A wrapper that does not ' +
    'forward errorMessage makes an invalid field impossible to explain, silently.');

  /* fieldset */
  var fs = el('fieldset', 'spec-row');
  fs.setAttribute('data-stack', '');
  fs.style.border = '1px solid var(--c-line)';
  var lg = el('legend', 'caps ink-3', 'What counts as stale');
  fs.appendChild(lg);
  var g2 = el('div');
  g2.style.display = 'grid';
  g2.style.gap = 'var(--sp-4)';
  g2.style.gridTemplateColumns = 'repeat(auto-fit, minmax(min(16rem,100%),1fr))';
  g2.appendChild(G.field({ label: 'Idle window (days)', kind: 'number', value: '100' }));
  g2.appendChild(G.field({ label: 'Temp files older than (days)', kind: 'number', value: '3' }));
  g2.appendChild(G.field({ label: 'Large file threshold (MB)', kind: 'number', value: '500' }));
  fs.appendChild(g2);
  st.appendChild(fs);

  /* ---- inputs ------------------------------------------------------------ */
  var inp = G.section('inputs', 'Inputs', 'settings.html, account.html');
  function reveal() {
    var b = el('button', 'fx-btn', '\u25c9');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show password');
    b.addEventListener('click', function () {
      var f = b.parentNode.querySelector('.field');
      var on = f.type === 'password';
      f.type = on ? 'text' : 'password';
      b.setAttribute('aria-label', on ? 'Hide password' : 'Show password');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    return b;
  }
  function clearBtn() {
    var b = el('button', 'fx-btn', '\u00d7');
    b.type = 'button';
    b.setAttribute('aria-label', 'Clear search');
    b.addEventListener('click', function () {
      var f = b.parentNode.querySelector('.field');
      f.value = ''; f.focus();
    });
    return b;
  }
  function stepper() {
    var w = el('div', 'fx-step');
    ['\u25b4', '\u25be'].forEach(function (g, i) {
      var b = el('button', 'fx-btn', g);
      b.type = 'button';
      b.setAttribute('aria-label', i ? 'Decrease' : 'Increase');
      b.addEventListener('click', function () {
        var f = w.parentNode.querySelector('.field');
        f.value = String((parseInt(f.value, 10) || 0) + (i ? -1 : 1));
      });
      w.appendChild(b);
    });
    return w;
  }
  G.row(inp, [
    { label: 'text', node: G.field({ label: 'Machine label', kind: 'text', placeholder: 'This PC' }) },
    { label: 'email', node: G.field({ label: 'Account', kind: 'email', value: 'you@example.com' }) },
    { label: 'password + reveal', node: G.field({ label: 'Keystore password', kind: 'password', value: 'hunter2hunter2', affix: reveal() }) }
  ]);
  G.row(inp, [
    { label: 'number + stepper', node: G.field({ label: 'Idle days', kind: 'number', value: '100', affix: stepper() }) },
    { label: 'search + clear', node: G.field({ label: 'Filter sections', kind: 'search', value: 'cache', affix: clearBtn() }) },
    { label: 'url', node: G.field({ label: 'Docs', kind: 'url', value: 'https://github.com/aoneahsan/windowsweep', mono: true }) }
  ]);

  var rt = G.section('richtext', 'Rich text', 'the note attached to a saved run');
  var rtw = G.field({
    kind: 'rich', label: 'Run note',
    placeholder: 'Why did you run this? (optional)',
    value: 'Cleared before the 1.1.0 release build.'
  });
  rtw.style.maxWidth = '40rem';
  G.row(rt, [{ node: rtw }], { stack: true });
  G.note(rt, 'THERE IS NO MULTI-LINE PLAIN INPUT IN A SHIPPED PRODUCT. This is tiptap-SHAPED over ' +
    'contenteditable: the real toolbar, the real pressed states, the real character count, with tiptap ' +
    'itself arriving in the app. The gate is the RENDERED DOM - every page in this dummy reports zero ' +
    'such elements from document.querySelectorAll, which a source grep cannot honestly claim, because a ' +
    'sentence describing the rule contains the very string it is looking for.');

  /* ---- choice ------------------------------------------------------------ */
  var ch = G.section('choice', 'Choice', 'settings.html, picker.html');
  G.row(ch, [
    { label: 'select', node: (function () { var w = G.select({ label: 'Profile', value: 'dev', options: ['dev', 'minimal', 'cache-only', 'system', 'deep', 'audit'] }); w.style.width = '13rem'; return w; })() },
    { label: 'combobox (async)', node: (function () { var w = G.select({ label: 'Scan root', placeholder: 'Type to search…', options: [] , empty: 'Searching…' }); w.style.width = '13rem'; return w; })(), why: 'the empty listbox carries the loading state, not a spinner over the field' },
    { label: 'multi-select / tags', node: (function () {
        var t = el('div', 'tags');
        ['node_modules', '.gradle', 'target'].forEach(function (x) {
          var g = el('span', 'tag');
          g.appendChild(el('span', null, x));
          var b = el('button', 'tag-x', '\u00d7');
          b.type = 'button';
          b.setAttribute('aria-label', 'Remove ' + x);
          b.addEventListener('click', function () { g.remove(); });
          g.appendChild(b);
          t.appendChild(g);
        });
        var i = el('input', 'tags-in');
        i.setAttribute('aria-label', 'Add an artefact folder');
        i.placeholder = 'Add…';
        t.appendChild(i);
        t.style.width = '18rem';
        return t;
      })() }
  ]);

  var chkRow = el('div', 'spec-row');
  [['unchecked', {}], ['checked', { checked: true }], ['indeterminate', { indeterminate: true }],
   ['disabled', { disabled: true }], ['checked+disabled', { checked: true, disabled: true }]].forEach(function (c) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', c[0]));
    cell.appendChild(G.chk('Send to Recycle Bin', c[1]));
    chkRow.appendChild(cell);
  });
  ch.appendChild(chkRow);

  G.row(ch, [
    { label: 'checkbox group', node: (function () {
        var g = el('div', 'chk-grp');
        g.appendChild(G.chk('Package manager caches', { checked: true, desc: 'npm, yarn, pnpm, bun, NuGet, pip' }));
        g.appendChild(G.chk('Build artefacts', { desc: 'node_modules, target, .gradle - only in idle projects' }));
        g.appendChild(G.chk('Browser caches', { checked: true, desc: 'Chromium profiles and Firefox' }));
        return g;
      })() },
    { label: 'radio group', node: (function () {
        var g = el('div', 'rad-grp');
        g.setAttribute('role', 'radiogroup');
        g.appendChild(G.chk('Recycle Bin (recoverable)', { radio: true, name: 'g-del', checked: true }));
        g.appendChild(G.chk('Permanent', { radio: true, name: 'g-del' }));
        return g;
      })() },
    { label: 'switch', nodes: [
        (function () { var r = el('div'); r.style.display = 'flex'; r.style.gap = 'var(--sp-3)'; r.style.alignItems = 'center';
          r.appendChild(G.sw(true, 'Developer mode')); r.appendChild(el('span', 't-sm', 'Developer mode')); return r; })(),
        (function () { var r = el('div'); r.style.display = 'flex'; r.style.gap = 'var(--sp-3)'; r.style.alignItems = 'center';
          var s = G.sw(false, 'Notify me'); r.appendChild(s); r.appendChild(el('span', 't-sm', 'Notify me')); return r; })()
      ] }
  ]);

  G.row(ch, [
    { label: 'segmented control', node: G.seg('g-seg', ['Recycle', 'Permanent'], 'Recycle') },
    { label: 'slider', node: (function () { var s = G.slider({ label: 'Idle window', min: 1, max: 365, value: 100, suffix: ' days' }); s.style.width = '18rem'; return s; })() },
    { label: 'slider, range', node: (function () {
        var w = el('div'); w.style.width = '18rem';
        w.appendChild(G.slider({ label: 'Size from', min: 0, max: 5000, value: 500, suffix: ' MB' }));
        w.appendChild(G.slider({ label: 'Size to', min: 0, max: 5000, value: 4000, suffix: ' MB' }));
        return w;
      })(), why: 'two thumbs on one track in RAC; drawn here as the pair it becomes' }
  ]);

  /* ---- specialised ------------------------------------------------------- */
  var sp = G.section('specialised', 'Specialised', 'history.html, settings.html');
  G.row(sp, [
    { label: 'date', node: G.field({ label: 'Runs since', kind: 'date', value: '2026-08-01' }) },
    { label: 'date range', node: (function () {
        var w = el('div'); w.style.display = 'flex'; w.style.gap = 'var(--sp-2)'; w.style.alignItems = 'flex-end';
        w.appendChild(G.field({ label: 'From', kind: 'date', value: '2026-08-01' }));
        w.appendChild(G.field({ label: 'To', kind: 'date', value: '2026-09-05' }));
        return w;
      })() }
  ]);

  var drop = el('div');
  drop.style.maxWidth = '32rem';
  var dlabel = el('div', 'fw-lbl');
  dlabel.appendChild(document.createTextNode('Selection file'));
  var info = el('button', 'fx-btn', '?');
  info.type = 'button';
  info.style.position = 'static';
  info.setAttribute('aria-label', 'What this file must contain');
  info.setAttribute('data-w-tip', '');
  info.setAttribute('aria-describedby', 'drop-tip');
  dlabel.appendChild(info);
  drop.appendChild(dlabel);

  var tip = el('div', 'pop');
  tip.id = 'drop-tip';
  tip.setAttribute('role', 'tooltip');
  tip.style.position = 'absolute';
  tip.style.zIndex = '30';
  var tipList = el('div');
  [['Purpose', 'One full path per line; each is matched against the candidates a section offers.'],
   ['Types', '.txt or .list, UTF-8'],
   ['Max size', '256 KB'],
   ['Example', 'D:\\work\\old-app\\node_modules']].forEach(function (r) {
    var p = el('p');
    p.appendChild(el('b', null, r[0] + ': '));
    p.appendChild(document.createTextNode(r[1]));
    tipList.appendChild(p);
  });
  tip.appendChild(tipList);

  var dz = el('div', 'drop');
  dz.dataset.state = 'idle';
  dz.appendChild(el('p', 't-sm', 'Drop a selection file here, or choose one'));
  dz.appendChild(el('p', 'drop-hint', '.txt or .list \u00b7 up to 256 KB \u00b7 one full path per line'));
  dz.appendChild(G.btn('Choose a file'));
  var dwrap = el('div');
  dwrap.style.position = 'relative';
  dwrap.appendChild(dz);
  dwrap.appendChild(tip);
  drop.appendChild(dwrap);

  G.row(sp, [{ node: drop }], { stack: true });

  var dstates = el('div', 'spec-row');
  [['dragging', 'Release to read it'], ['uploading', 'Reading 128 of 402 lines…'],
   ['done', '402 paths, 397 matched'], ['rejected', 'That file is 1.4 MB - the limit is 256 KB']].forEach(function (s) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', s[0]));
    var z = el('div', 'drop');
    z.dataset.state = s[0] === 'uploading' ? 'idle' : s[0];
    z.style.minWidth = '13rem';
    z.appendChild(el('p', 't-sm', s[1]));
    if (s[0] === 'uploading') {
      var bar = el('div', 'prog'); bar.style.width = '100%';
      var f = el('i', 'prog-fill'); f.style.width = '32%';
      bar.appendChild(f); z.appendChild(bar);
    }
    cell.appendChild(z);
    dstates.appendChild(cell);
  });
  sp.appendChild(dstates);
  G.note(sp, 'The info affordance states purpose, types, size limit and an example BEFORE the pick - and ' +
    'the numbers it shows are the numbers the app enforces. A limit shown that is not enforced, or ' +
    'enforced and not shown, is the same defect twice.');

  /* ---- multi-step -------------------------------------------------------- */
  var ms = G.section('multistep', 'Multi-step form', 'the first-run flow: consent, developer mode, schedule');
  var stepsRow = el('div', 'steps');
  [['Consent', 'done'], ['Developer mode', 'current'], ['Schedule', 'todo'], ['Review', 'todo']].forEach(function (s, i, arr) {
    var st2 = el('div', 'step');
    st2.dataset.state = s[1];
    st2.appendChild(el('span', 'step-n', s[1] === 'done' ? '\u2713' : String(i + 1)));
    st2.appendChild(el('span', null, s[0]));
    stepsRow.appendChild(st2);
    if (i < arr.length - 1) stepsRow.appendChild(el('div', 'step-bar'));
  });
  var msBox = el('div', 'spec-row');
  msBox.setAttribute('data-stack', '');
  msBox.appendChild(stepsRow);
  msBox.appendChild(el('hr', 'rule'));
  msBox.appendChild(el('h4', 't-md wide', 'Are you a developer?'));
  msBox.appendChild(el('p', 't-sm ink-3', 'It changes what counts as safe to delete. You can change it later.'));
  var msg = el('div', 'rad-grp');
  msg.setAttribute('role', 'radiogroup');
  msg.appendChild(G.chk('Yes - keep 100 days of package and build caches', { radio: true, name: 'g-ms', checked: true }));
  msg.appendChild(G.chk('No - clear those caches completely', { radio: true, name: 'g-ms' }));
  msBox.appendChild(msg);
  var msFt = el('div');
  msFt.style.display = 'flex'; msFt.style.gap = 'var(--sp-2)'; msFt.style.marginTop = 'var(--sp-4)';
  msFt.appendChild(G.btn('Back'));
  var skip = G.btn('Skip', 'btn-ghost');
  msFt.appendChild(skip);
  var next = G.btn('Next', 'btn-primary');
  next.style.marginInlineStart = 'auto';
  msFt.appendChild(next);
  msBox.appendChild(msFt);
  ms.appendChild(msBox);

  /* Submit-invalid moves focus TO the field. Scrolling to it is not enough -
     a keyboard user is still parked on the submit button. */
  var demo = G.section('submit', 'Submit an invalid form', 'press it');
  var dform = el('form', 'spec-row');
  dform.setAttribute('data-stack', '');
  dform.style.maxWidth = '32rem';
  var f1 = G.field({ label: 'Idle window (days)', required: true, kind: 'text', value: 'ninety' });
  var f2 = G.field({ label: 'Machine label', kind: 'text', value: 'Build box' });
  dform.appendChild(f1); dform.appendChild(f2);
  var sub = G.btn('Save settings', 'btn-primary');
  sub.type = 'submit';
  dform.appendChild(sub);
  dform.addEventListener('submit', function (e) {
    e.preventDefault();
    window.wsWidgets.pending(sub, true);
    setTimeout(function () {
      window.wsWidgets.pending(sub, false);
      var input = f1.querySelector('.field');
      if (f1.querySelector('.fw-err')) return;
      input.setAttribute('aria-invalid', 'true');
      var err = el('span', 'fw-err');
      err.appendChild(el('span', null, '\u26a0'));
      err.appendChild(el('span', null, 'Enter a whole number of days between 1 and 3650.'));
      f1.appendChild(err);
      input.focus();
    }, 700);
  });
  demo.appendChild(dform);
  G.note(demo, 'The error lands at the field that caused it and focus moves there - not a toast in the ' +
    'corner saying “something went wrong”, which leaves the user hunting.');

  G.trims(G.section('form-trims', 'Trims', 'stated, not silent'), [
    ['Rating', 'nothing here is rated.'],
    ['Colour picker', 'colour is a theme axis chosen from card selectors, never a free picker.'],
    ['Time picker', 'the schedule is a weekday plus an hour, both plain selects.'],
    ['Avatar upload', 'the account photo comes from Google; there is nothing to upload.']
  ]);

  window.wsWidgets.boot();
  window.wsPlayground.boot();
})();
