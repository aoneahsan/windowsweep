/* Gallery 8 of 8 - charts.

   Charts fail on DATA, not on styling, so every chart here ships its data dials
   and every one is measured for FRAME STABILITY: the rendered box must not
   change with the values. Grow the domain, never the range - a chart that
   resizes as data arrives is layout shift in costume, and it looks fine in any
   single screenshot, which is why it ships.

   D3 only - no Recharts, no Chart.js. React owns the DOM, D3 owns the maths;
   here there is no React, so these draw straight into an SVG the page owns. */
(function () {
  'use strict';
  var G = window.G, el = G.el, db = window.wsdb;
  var SVGNS = 'http://www.w3.org/2000/svg';

  function svg(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  /* ---- data generators ---------------------------------------------------- */
  function series(kind, n) {
    var out = [], i;
    for (i = 0; i < n; i++) {
      switch (kind) {
        case 'equal': out.push(3.2e9); break;
        case 'spike': out.push(i === Math.floor(n / 2) ? 4.1e10 : 2.0e8); break;
        case 'zero': out.push(0); break;
        case 'nulls': out.push(i % 3 === 0 ? null : (1 + (i % 5)) * 6e8); break;
        default: out.push((0.6 + Math.abs(Math.sin(i * 1.7)) * 3.4) * 1e9);
      }
    }
    return out;
  }

  /* ---- sparkline (frame-stable by construction) --------------------------- */
  function sparkline(values, w, h) {
    var wrap = el('div', 'chart');
    wrap.style.width = w + 'px';
    wrap.style.height = h + 'px';
    var s = svg('svg', { width: w, height: h, viewBox: '0 0 ' + w + ' ' + h, role: 'img' });

    var pts = values.filter(function (v) { return v != null; });
    if (!pts.length) {
      wrap.appendChild(Object.assign(el('div', 'chart-empty', 'No runs yet'), { style: 'height:' + h + 'px' }));
      return wrap;
    }
    var max = Math.max.apply(null, pts), min = Math.min.apply(null, pts);
    /* A flat domain divides by zero in a naive scale - the case nobody tries. */
    var span = (max - min) || 1;
    var pad = 4;
    var stepDen = Math.max(1, values.length - 1);

    if (values.length === 1) {
      /* one datum draws no line at all, so draw the point */
      s.appendChild(svg('circle', { cx: w / 2, cy: h / 2, r: 3.5, fill: 'var(--c-accent)' }));
      var lone = svg('text', { x: w / 2, y: h - 2, 'text-anchor': 'middle', class: 'chart-ax' });
      lone.textContent = 'one run';
      s.appendChild(lone);
    } else {
      var d = '';
      values.forEach(function (v, i) {
        if (v == null) return;                     /* a gap, not a zero */
        var x = pad + (i / stepDen) * (w - pad * 2);
        var y = h - pad - ((v - min) / span) * (h - pad * 2);
        d += (d ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      });
      s.appendChild(svg('path', { d: d, fill: 'none', stroke: 'var(--c-accent)', 'stroke-width': 2,
                                  'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      /* a marker at the last point: shape as well as colour */
      var lastI = values.length - 1;
      while (lastI > 0 && values[lastI] == null) lastI--;
      if (values[lastI] != null) {
        s.appendChild(svg('circle', {
          cx: pad + (lastI / stepDen) * (w - pad * 2),
          cy: h - pad - ((values[lastI] - min) / span) * (h - pad * 2),
          r: 3, fill: 'var(--c-accent)'
        }));
      }
    }
    wrap.appendChild(s);
    return wrap;
  }

  /* ---- bar ---------------------------------------------------------------- */
  function bars(values, labels, w, h) {
    var wrap = el('div', 'chart');
    wrap.style.width = w + 'px';
    wrap.style.height = h + 'px';
    var s = svg('svg', { width: w, height: h, viewBox: '0 0 ' + w + ' ' + h, role: 'img' });
    var pts = values.filter(function (v) { return v != null; });
    var max = pts.length ? Math.max.apply(null, pts) : 0;
    var bh = 18, gap = 6, labelW = 96;
    values.forEach(function (v, i) {
      var y = i * (bh + gap) + 2;
      if (y + bh > h) return;
      var t = svg('text', { x: labelW - 8, y: y + bh * 0.72, 'text-anchor': 'end', class: 'chart-ax' });
      t.textContent = (labels[i] || '').slice(0, 16);
      s.appendChild(t);
      s.appendChild(svg('rect', { x: labelW, y: y, width: Math.max(1, w - labelW - 56), height: bh,
                                  fill: 'var(--c-line)', rx: 2 }));
      var frac = max > 0 && v != null ? v / max : 0;
      s.appendChild(svg('rect', { x: labelW, y: y, width: Math.max(v ? 2 : 0, frac * (w - labelW - 56)),
                                  height: bh, fill: 'var(--c-accent)', rx: 2 }));
      var vt = svg('text', { x: w - 4, y: y + bh * 0.72, 'text-anchor': 'end', class: 'chart-ax' });
      vt.textContent = v == null ? 'n/a' : db.fmt.bytes(v);
      s.appendChild(vt);
    });
    wrap.appendChild(s);
    return wrap;
  }

  /* ---- capacity ring ------------------------------------------------------- */
  function ring(usedPct, reclPct, size) {
    var wrap = el('div', 'chart ring-w');
    wrap.style.width = size + 'px';
    wrap.style.height = size + 'px';
    var s = svg('svg', { width: size, height: size, viewBox: '0 0 ' + size + ' ' + size, role: 'img' });
    var g = svg('g', { transform: 'translate(' + size / 2 + ',' + size / 2 + ')' });
    var r = size / 2 - 8, tw = 9;
    var arc = window.d3.arc().innerRadius(r - tw).outerRadius(r).cornerRadius(2);
    var TAU = Math.PI * 2;
    var segs = [
      [0, usedPct, 'var(--c-line-strong)'],
      [usedPct, usedPct + reclPct, 'var(--c-accent)'],
      [usedPct + reclPct, 1, 'var(--c-ok-soft)']
    ];
    segs.forEach(function (sg) {
      if (sg[1] - sg[0] <= 0) return;
      g.appendChild(svg('path', { d: arc({ startAngle: sg[0] * TAU, endAngle: sg[1] * TAU }), fill: sg[2] }));
    });
    s.appendChild(g);
    wrap.appendChild(s);
    var t = el('span', 'ring-t', Math.round(reclPct * 100) + '%');
    wrap.appendChild(t);
    return wrap;
  }

  /* ---- playground: the TREEMAP, the signature element --------------------- */
  window.wsPlayground.register('chart', {
    title: 'The Reclaim Map',
    note: 'the signature element - used by home.html and run.html',
    dials: [
      { key: 'data', label: 'Data', value: 'typical', options: ['empty', 'one', 'typical', 'dense', 'equal', 'spike'] },
      { key: 'labels', label: 'Labels', value: 'real', options: ['real', 'longest'] },
      { key: 'state', label: 'State', value: 'ready', options: ['ready', 'loading'] },
      { key: 'frame', label: 'Frame', value: 'landscape', options: ['landscape', 'portrait'] }
    ],
    render: function (mount, v) {
      var host = el('div');
      host.style.width = '100%';

      if (v.state === 'loading') {
        var sk = el('div', 'skel');
        sk.style.height = v.frame === 'portrait' ? '380px' : '260px';
        sk.style.width = '100%';
        host.appendChild(sk);
        mount.appendChild(host);
        return;
      }

      var base = db.derive.mapDataAll();
      var data = { name: 'reclaimable', children: [] };

      if (v.data === 'empty') data.children = [];
      else if (v.data === 'one') data.children = base.children.slice(0, 1).map(function (g) {
        return { name: g.name, section: g.section, tier: g.tier, children: g.children.slice(0, 1) };
      });
      else if (v.data === 'dense') data.children = base.children;
      else data.children = base.children.slice(0, 5);

      if (v.data === 'equal' || v.data === 'spike') {
        var flat = [];
        data.children.forEach(function (g) { g.children.forEach(function (c) { flat.push(c); }); });
        flat.forEach(function (c, i) {
          c.value = v.data === 'equal' ? 2.4e9 : (i === 0 ? 4.1e10 : 1.2e8);
        });
      }
      if (v.labels === 'longest') {
        data.children.forEach(function (g) {
          g.name = 'globally-installed-packages-audit';
          g.children.forEach(function (c) {
            c.name = 'Visual Studio Code – CachedExtensionVSIXs and CachedProfilesData';
          });
        });
      }

      var mnt = el('div');
      /* frameFor() reads root.clientWidth at construction, so the frame is driven
         by the mount's real width - there is no forceWidth option, and passing one
         silently did nothing until the playground gate reported the dial inert. */
      mnt.style.width = v.frame === 'portrait' ? 'min(600px, 100%)' : '100%';
      mnt.setAttribute('data-chart-frame', '');
      host.appendChild(mnt);
      mount.appendChild(host);

      var map = new window.ReclaimMap(mnt, { interactive: false });
      map.render(data);

      var msg = {
        empty: 'The zero state is designed first: a clean machine draws the PROTECTED paths as a dimmed mosaic, so the answer is "everything here is protected or in use" rather than an empty box.',
        one: 'One tile. Most treemap layouts are only ever seen with twenty.',
        equal: 'All values identical – a zero-width domain, which divides by zero in a naive scale. This is the case nobody tries.',
        spike: 'One tile 340x the rest. Everything else collapses to a sliver, and the labels have to survive it.',
        dense: 'Every target on the machine.',
        typical: ''
      }[v.data];
      if (msg) host.appendChild(el('p', 't-2xs ink-3', msg));

      /* the accessible representation is the table, not a consolation prize */
      var tbl = el('div');
      tbl.style.marginTop = 'var(--sp-3)';
      window.ReclaimMap.buildTable(tbl, data);
      host.appendChild(tbl);
    }
  });

  /* ---- sparkline specimens -------------------------------------------------- */
  var sp = G.section('sparkline', 'Sparkline', 'home.html – the last eight runs');
  var cases = [
    ['typical (8)', series('normal', 8)],
    ['one point', series('normal', 1)],
    ['365 points', series('normal', 365)],
    ['all equal', series('equal', 8)],
    ['a spike', series('spike', 8)],
    ['zeroes', series('zero', 8)],
    ['nulls (gaps)', series('nulls', 9)],
    ['empty', []]
  ];
  var srow = el('div', 'spec-row');
  cases.forEach(function (c) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', c[0]));
    cell.appendChild(sparkline(c[1], 150, 48));
    srow.appendChild(cell);
  });
  sp.appendChild(srow);
  G.note(sp, 'Every one of these is 150 x 48 pixels. That is the point: the FRAME does not move with the ' +
    'data. A null is a gap in the line, never a zero – plotting a missing run as 0 GB would say something ' +
    'false about a day nothing ran.');

  /* ---- bar ------------------------------------------------------------------ */
  var bs = G.section('bar', 'Bar', 'report.html – what each section freed');
  var labels = ['pkg', 'build', 'chromium', 'windows', 'editors', 'docker'];
  var brow = el('div', 'spec-row');
  [['typical', series('normal', 6)], ['all equal', series('equal', 6)],
   ['a spike', series('spike', 6)], ['zeroes', series('zero', 6)]].forEach(function (c) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', c[0]));
    cell.appendChild(bars(c[1], labels, 320, 150));
    brow.appendChild(cell);
  });
  bs.appendChild(brow);

  /* ---- ring ----------------------------------------------------------------- */
  var rg = G.section('ring', 'Capacity ring', 'home.html – one per fixed drive');
  var rrow = el('div', 'spec-row');
  [['typical', 0.62, 0.11], ['nearly full', 0.94, 0.03], ['nothing to reclaim', 0.55, 0],
   ['almost empty', 0.08, 0.02]].forEach(function (c) {
    var cell = el('div', 'spec-cell');
    cell.appendChild(el('span', 'caps', c[0]));
    cell.appendChild(ring(c[1], c[2], 96));
    cell.appendChild(el('span', 't-2xs ink-3', Math.round(c[1] * 100) + '% used'));
    rrow.appendChild(cell);
  });
  rg.appendChild(rrow);
  G.note(rg, 'Three arcs: used, reclaimable, free. "Nothing to reclaim" draws no accent arc at all rather ' +
    'than a sliver pretending there is something – a 0.4% wedge reads as a rendering artefact and invites ' +
    'a click that does nothing.');

  /* ---- the legend rule ------------------------------------------------------- */
  var lg = G.section('legend', 'Never colour alone', 'every chart');
  var leg = el('div', 'chart-lg');
  [['used', 'var(--c-line-strong)', '■'], ['reclaimable', 'var(--c-accent)', '▲'],
   ['free', 'var(--c-ok-soft)', '●']].forEach(function (x) {
    var s2 = el('span');
    var sw2 = el('i', 'chart-sw');
    sw2.style.background = x[1];
    s2.appendChild(sw2);
    s2.appendChild(el('span', null, x[2] + ' ' + x[0]));
    leg.appendChild(s2);
  });
  G.row(lg, [{ node: leg }], { stack: true });
  G.note(lg, 'A series is distinguishable by shape, pattern, direct label or marker as well as by hue – ' +
    'otherwise the chart is unreadable for the most common colour deficiency and in monochrome. It also ' +
    'matters here specifically: the accent (128) is 22 degrees from success (150).');

  G.trims(G.section('chart-trims', 'Trims', 'stated, not silent'), [
    ['Stacked bar and area', 'nothing here is a composition over time – a run either freed bytes or did not.'],
    ['Calendar heatmap', 'run cadence is weekly at most; 365 mostly-empty cells would say less than the sparkline.'],
    ['Pie', 'the treemap already answers "what is the shape of this", and does it with real areas.']
  ]);

  window.wsWidgets.boot();
  window.wsPlayground.boot();
})();
