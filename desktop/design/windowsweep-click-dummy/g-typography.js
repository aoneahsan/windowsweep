/* Gallery 2 of 8 - typography. The scale at its real sizes, in place. */
(function () {
  'use strict';
  var G = window.G, el = G.el;

  var SCALE = [
    ['hero', '--fs-hero', '80px', 'the reclaim readout, and nothing else'],
    ['2xl', '--fs-2xl', '44px', 'a screen title on the moment screens'],
    ['xl', '--fs-xl', '32px', 'page h1, the run total'],
    ['lg', '--fs-lg', '24px', 'section headings, stat values'],
    ['md', '--fs-md', '18px', 'panel titles, dialog headings'],
    ['base', '--fs-base', '16px', 'the body floor - nothing prose-shaped goes below it'],
    ['sm', '--fs-sm', '15px', 'supporting prose, controls'],
    ['xs', '--fs-xs', '13px', 'secondary labels, descriptions'],
    ['2xs', '--fs-2xs', '12px', 'badges and chips ONLY']
  ];

  window.wsPlayground.register('type', {
    title: 'The scale',
    note: 'driven by the text-size axis, exactly as the theme control drives it',
    dials: [
      { key: 'scale', label: 'Text size', value: 'medium', options: ['small', 'medium', 'large'] },
      { key: 'face', label: 'Typeface', value: 'archivo', options: ['archivo', 'system'] },
      { key: 'sample', label: 'Sample', value: 'heading', options: ['heading', 'prose', 'numerals', 'longest'] },
      { key: 'width', label: 'Measure', value: 'comfortable', options: ['narrow', 'comfortable', 'full'] }
    ],
    render: function (mount, v) {
      var box = el('div');
      box.style.width = '100%';
      box.style.setProperty('--type-scale', { small: '.9', medium: '1', large: '1.15' }[v.scale]);
      if (v.face === 'system') box.style.setProperty('--ff-display', 'system-ui, sans-serif');
      if (v.face === 'system') box.style.setProperty('--ff-ui', 'system-ui, sans-serif');
      box.style.maxWidth = { narrow: '24rem', comfortable: '42rem', full: '100%' }[v.width];
      box.style.marginInline = 'auto';

      if (v.sample === 'heading') {
        box.appendChild(el('p', 'caps ink-3', 'Reclaimable now'));
        var h = el('h2', 't-xl wide', 'Twenty-six sections, one door');
        box.appendChild(h);
        box.appendChild(el('p', 't-sm ink-3',
          'Hierarchy is carried by the WIDTH axis, not only by size and weight. Almost no interface does ' +
          'this, and that is precisely why it reads as chosen.'));
      } else if (v.sample === 'prose') {
        box.appendChild(el('p', 't-base',
          'windowsweep deletes only what Windows and your tools can rebuild by themselves: package caches, ' +
          'build artefacts, browser caches, crash dumps and update leftovers. Your documents, photos, keys ' +
          'and saved passwords are never touched.'));
        box.appendChild(el('p', 't-base',
          'Every deletion passes through one function with a declared root, so a path outside that root ' +
          'is refused rather than trusted.'));
      } else if (v.sample === 'numerals') {
        var t = el('table', 'tbl');
        var tb = el('tbody');
        [['npm cache', '4.21 GB'], ['Gradle caches', '11.08 GB'], ['Chrome profiles', '7.40 GB'],
         ['Windows Update', '15.90 GB'], ['Total', '38.59 GB']].forEach(function (r) {
          var tr = el('tr');
          tr.appendChild(el('td', 't-sm', r[0]));
          tr.appendChild(el('td', 'num-cell t-sm', r[1]));
          tb.appendChild(tr);
        });
        t.appendChild(tb);
        box.appendChild(t);
        box.appendChild(el('p', 't-xs ink-3',
          'Tabular figures, so a column of sizes aligns on the decimal instead of drifting.'));
      } else {
        box.appendChild(el('h2', 't-lg wide',
          'Globally installed packages audit (npm, pnpm, yarn, bun, deno) – report only'));
        box.appendChild(el('p', 't-sm ink-3',
          'The longest real section title in the catalogue. A layout tuned on “Home” breaks here, which is ' +
          'the whole reason this dial exists.'));
      }
      mount.appendChild(box);
    }
  });

  /* ---- the scale --------------------------------------------------------- */
  var s = G.section('scale', 'The scale, at its real sizes', 'everything');
  var wrap = el('div', 'spec-row');
  wrap.setAttribute('data-stack', '');
  SCALE.forEach(function (r) {
    var line = el('div');
    line.style.display = 'flex';
    line.style.alignItems = 'baseline';
    line.style.gap = 'var(--sp-4)';
    line.style.borderBottom = '1px solid var(--c-line)';
    line.style.paddingBlock = 'var(--sp-2)';
    var tag = el('span', 'mono t-2xs ink-3', r[0]);
    tag.style.width = '3.5rem'; tag.style.flex = 'none';
    line.appendChild(tag);
    var sample = el('span', 'wide', 'Reclaim 42.7 GB');
    sample.style.fontSize = 'var(' + r[1] + ')';
    sample.style.fontFamily = 'var(--ff-display)';
    sample.style.fontWeight = '700';
    sample.style.lineHeight = '1.05';
    sample.style.flex = '1';
    sample.style.minWidth = '0';
    sample.style.overflow = 'hidden';
    line.appendChild(sample);
    var meta = el('span', 't-2xs ink-3', r[2] + ' \u00b7 ' + r[3]);
    meta.style.textAlign = 'end'; meta.style.flex = 'none'; meta.style.maxWidth = '18rem';
    line.appendChild(meta);
    wrap.appendChild(line);
  });
  s.appendChild(wrap);
  G.note(s, 'Round 4 raised the floor: 37 of 39 sized elements had been reaching for 11-13px, and the ' +
    'body base was 15px. `2xs` at 12px is now reserved for badges and chips - nothing prose-shaped may ' +
    'use it, and a rendered-DOM audit fails the build if anything does.');

  /* ---- headings in place ------------------------------------------------- */
  var h = G.section('headings', 'Headings in place, with their real rhythm', 'every screen');
  var doc = el('div', 'spec-row');
  doc.setAttribute('data-stack', '');
  doc.style.maxWidth = '46rem';
  doc.appendChild(el('p', 'caps ink-3', 'Section 6'));
  doc.appendChild(el('h1', 't-xl wide', 'Editor caches'));
  doc.appendChild(el('p', 'lede', 'What VS Code, Cursor and their forks keep on disk between sessions.'));
  doc.appendChild(el('h2', 't-lg wide', 'What is removed'));
  doc.appendChild(el('p', 't-base', 'The cache folders each editor rebuilds on next launch, plus crash ' +
    'reports that have already been sent. Extensions, settings and keybindings are untouched.'));
  doc.appendChild(el('h3', 't-md', 'The VSIX download cache'));
  doc.appendChild(el('p', 't-base', 'Extension installers that have already been unpacked. This one is ' +
    'safe to clear while the editor is running, which is why it is its own target.'));
  h.appendChild(doc);

  /* ---- prose ------------------------------------------------------------- */
  var p = G.section('prose', 'Prose - the rich-text editor’s own output', 'report notes, the about screen');
  var pr = el('div', 'spec-row');
  pr.setAttribute('data-stack', '');
  pr.style.maxWidth = '42rem';
  var body = el('div', 't-base');
  var p1 = el('p');
  p1.appendChild(document.createTextNode('A run writes a '));
  p1.appendChild(el('strong', null, 'JSON report'));
  p1.appendChild(document.createTextNode(' and a plain-text log under '));
  p1.appendChild(el('code', 'mono', '%USERPROFILE%\\.windowsweep'));
  p1.appendChild(document.createTextNode('. Both are '));
  p1.appendChild(el('em', null, 'yours'));
  p1.appendChild(document.createTextNode(' — nothing is uploaded.'));
  body.appendChild(p1);
  var ul = el('ul');
  ['Every section that ran, with what it freed', 'Every refusal, with the reason',
   'Disk free space before and after'].forEach(function (t) { ul.appendChild(el('li', null, t)); });
  body.appendChild(ul);
  var ol = el('ol');
  ['Preview with --dry-run', 'Read the report', 'Run it for real'].forEach(function (t) { ol.appendChild(el('li', null, t)); });
  body.appendChild(ol);
  var bq = el('blockquote');
  bq.appendChild(el('p', null, 'The user must know what will go before it goes.'));
  body.appendChild(bq);
  var pre = el('pre', 'mono');
  pre.textContent = 'windowsweep --dry-run --all --yes --json';
  body.appendChild(pre);
  pr.appendChild(body);
  p.appendChild(pr);

  /* ---- measure ----------------------------------------------------------- */
  var m = G.section('measure', 'Measure - line length stays readable at 1920', 'every prose surface');
  var mrow = el('div', 'spec-row');
  mrow.setAttribute('data-stack', '');
  var wide = el('p', 't-base',
    'Without a measure cap, a paragraph on a 1920-wide window runs to about 190 characters and the eye ' +
    'loses the line on the return sweep. Every prose container in this product caps at 68ch, which is why ' +
    'this sentence stops where it does rather than where the window does.');
  wide.style.maxWidth = '68ch';
  mrow.appendChild(wide);
  var over = el('p', 't-sm ink-3');
  over.textContent = 'The cap is 68ch. The band wrappers apply it; a bare <p> in a full-width panel does not, ' +
    'which is the one place it gets forgotten.';
  mrow.appendChild(over);
  m.appendChild(mrow);

  /* ---- the display font actually reaching the page ------------------------ */
  var v = G.section('verify', 'Is the display face actually reaching the page?', 'the check that caught it elsewhere');
  var vr = el('div', 'spec-row');
  var a = el('div', 'spec-cell');
  a.appendChild(el('span', 'caps', 'display (--ff-display)'));
  var av = el('span', 'wide', 'Aa Bb 42.7 GB');
  av.style.fontFamily = 'var(--ff-display)';
  av.style.fontSize = 'var(--fs-lg)';
  av.style.fontWeight = '700';
  a.appendChild(av);
  var res = el('span', 't-2xs ink-3');
  res.setAttribute('data-type-probe', '');
  a.appendChild(res);
  vr.appendChild(a);
  var b = el('div', 'spec-cell');
  b.appendChild(el('span', 'caps', 'ui (--ff-ui)'));
  var bv = el('span', null, 'Aa Bb 42.7 GB');
  bv.style.fontFamily = 'var(--ff-ui)';
  bv.style.fontSize = 'var(--fs-lg)';
  b.appendChild(bv);
  vr.appendChild(b);
  var c = el('div', 'spec-cell');
  c.appendChild(el('span', 'caps', 'mono (--ff-mono)'));
  var cv = el('span', 'mono', 'C:\\Users\\PC\\AppData');
  cv.style.fontSize = 'var(--fs-sm)';
  c.appendChild(cv);
  vr.appendChild(c);
  v.appendChild(vr);
  G.note(v, 'A --font-display token that is defined and never referenced leaves every heading silently ' +
    'set in the body font - found exactly that way on another project after four directions had been ' +
    'reviewed. The probe below reads the COMPUTED family off the rendered node, not the token.');

  setTimeout(function () {
    var probe = document.querySelector('[data-type-probe]');
    if (!probe) return;
    var f = getComputedStyle(av).fontFamily.split(',')[0].replace(/["']/g, '');
    var g = getComputedStyle(bv).fontFamily.split(',')[0].replace(/["']/g, '');
    probe.textContent = 'computed: ' + f + (f === g ? '  \u2014 SAME as UI, the display face is NOT reaching the page' : '  \u2014 distinct from UI (' + g + ')');
  }, 400);

  G.trims(G.section('type-trims', 'Trims', 'stated, not silent'), [
    ['Drop caps, pull quotes, article bylines', 'this is a utility, not a publication.'],
    ['A third typeface', 'the whole idea is one family doing two jobs through its width axis.']
  ]);

  window.wsWidgets.boot();
  window.wsPlayground.boot();
})();
