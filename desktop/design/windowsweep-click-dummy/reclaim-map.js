/* ============================================================================
   THE RECLAIM MAP - windowsweep desktop's signature element

   Every reclaimable target as one tile, sized by bytes, coloured by tier, grouped
   by section. It exists because the product's whole thesis is one sentence - "the
   user must know what will go before it goes" - and a treemap is that sentence,
   drawn. It is also the only way 26 sections and hundreds of targets become
   readable at a glance.

   🔴 REAL d3.treemap(), vendored, not SVG assembled from template strings. A fake
   chart in a dummy becomes a fake chart in the framework and every page after it
   copies the precedent (click-dummy pitfall 7).

   🔴 THE RENDERED BOX DOES NOT CHANGE WITH THE DATA. Constant viewBox, constant
   scale RANGE; only the domain responds. A chart that resizes as values arrive is
   layout shift wearing a costume, and it is invisible in any single screenshot.

   🔴 THE ZERO STATE IS DESIGNED FIRST, not last. A signature element that renders
   as a blank rectangle on a clean machine destroys the product's argument on first
   paint (pitfall 13). Here, zero draws the PROTECTED paths as a calm dimmed mosaic
   - "everything on this machine is either protected or in use" - which is true,
   informative, and still recognisably the same object.
   ============================================================================ */
(function () {
  'use strict';

  /* 🔴 The frame never changes with the DATA - that is the rule, and it holds. It
     does change with the VIEWPORT, which is a different thing and is required: a
     1000x340 landscape treemap squeezed into a 358px column is unreadable, and it
     left ~160px of dead frame under the tiles. Portrait below 700px. */
  function frameFor(px) {
    return (px && px < 700) ? { w: 620, h: 760 } : { w: 1000, h: 340 };
  }
  var PAD_TOP = 19;                 // room for the section label strip

  /* TWO CHANNELS, TWO VARIABLES, each canonical.

       HUE       = tier          how risky removing it is  (config -> permanent)
       LIGHTNESS = idle days     how stale it is           (fresh -> long untouched)

     The first version used hue alone. On a developer machine eight of eight sections
     are `rebuilds`, so the whole map painted one flat green and told the reader
     nothing they could not already get from the total - monotonous AND uninformative,
     which is the worse half. Staleness is the variable the product actually reasons
     about, so it earns the second channel rather than a decorative zebra stripe.

     🔴 The domain is the REACHABLE range, not [0, 365]. It is re-solved from the data
     on every render, so a machine whose oldest cache is 60 days still gets the full
     ramp instead of eight indistinguishable pale tiles.                             */
  function mixFor(idle, scale) {
    var t = scale ? scale(idle) : 1;
    return Math.round(100 * Math.max(0, Math.min(1, t)));
  }
  /* interpolate between the tier's OWN two ends, never toward the page surface -
     mixing toward the background is what produced mud */
  function tierColour(tier, pct) {
    return 'color-mix(in oklab, var(--c-tier-' + tier + '-hi) ' + pct +
           '%, var(--c-tier-' + tier + '-lo))';
  }
  /* With the muted tier ramp the tiles never approach the ink's own lightness in
     either appearance, so the page's ink is correct on every tile - one rule rather
     than a threshold that had to guess. Verified by the contrast sweep, which now
     reads SVG `fill` instead of `color`. */
  function labelInk() { return 'var(--c-ink)'; }

  function fitText(txt, widthPx, fontPx) {
    var max = Math.floor((widthPx - 12) / (fontPx * 0.56));
    if (max < 3) return '';
    return txt.length <= max ? txt : txt.slice(0, max - 1) + '…';
  }

  function ReclaimMap(root, opts) {
    opts = opts || {};
    var self = this;
    this.root = root;
    this.onToggle = opts.onToggle || function () {};
    this.interactive = opts.interactive !== false;
    this.draining = {};

    root.classList.add('tm-frame');

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var f0 = frameFor(root.clientWidth);
    svg.setAttribute('viewBox', '0 0 ' + f0.w + ' ' + f0.h);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('class', 'tm-svg');
    svg.setAttribute('role', 'img');
    root.appendChild(svg);
    this.svg = svg;

    var tip = document.createElement('div');
    tip.className = 'tm-tip';
    tip.hidden = true;
    root.appendChild(tip);
    this.tip = tip;

    root.addEventListener('mouseleave', function () { self.tip.hidden = true; });
  }

  ReclaimMap.prototype.clear = function () {
    while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
  };

  ReclaimMap.prototype.showTip = function (evt, d) {
    var db = window.wsdb;
    var tip = this.tip;
    tip.textContent = '';
    var p = document.createElement('div');
    p.className = 'mono';
    p.style.wordBreak = 'break-all';
    p.textContent = d.data.path;
    var s = document.createElement('div');
    s.className = 't-xs ink-3';
    s.style.marginTop = '2px';
    s.textContent = db.fmt.bytes(d.data.value) + '  ·  idle ' + d.data.idle + ' days  ·  section '
      + d.data.section + '  ·  ' + d.data.tier
      + (d.data.excluded ? '  ·  EXCLUDED' : '');
    tip.appendChild(p);
    tip.appendChild(s);
    tip.hidden = false;

    var box = this.root.getBoundingClientRect();
    var x = evt.clientX - box.left + 14;
    var y = evt.clientY - box.top + 14;
    // keep it inside the frame
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    if (x + tw > box.width - 6) x = Math.max(6, box.width - tw - 6);
    if (y + th > box.height - 6) y = Math.max(6, evt.clientY - box.top - th - 12);
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  };

  ReclaimMap.prototype.render = function (data) {
    var self = this, db = window.wsdb, d3 = window.d3;
    this.clear();

    var leaves = [];
    (data.children || []).forEach(function (c) { (c.children || []).forEach(function (l) { leaves.push(l); }); });

    var note = this.root.querySelector('.tm-empty-note');
    if (note) note.remove();

    if (!leaves.length) { this.renderZero(); return; }

    var hier = d3.hierarchy(data)
      .sum(function (d) { return d.value || 0; })
      .sort(function (a, b) { return b.value - a.value; });

    var F = frameFor(this.root.clientWidth);
    this.svg.setAttribute('viewBox', '0 0 ' + F.w + ' ' + F.h);
    d3.treemap()
      .tile(d3.treemapSquarify.ratio(F.w > F.h ? 1.4 : 0.8))
      .size([F.w, F.h])
      .paddingOuter(2)
      .paddingTop(PAD_TOP)
      .paddingInner(2)
      .round(true)(hier);

    var ns = 'http://www.w3.org/2000/svg';
    this.addDefs();

    // the idle ramp, re-solved from THIS data every render
    var idles = leaves.map(function (l) { return l.idle || 0; });
    var lo = Math.min.apply(null, idles), hi = Math.max.apply(null, idles);
    var idleScale = (hi > lo)
      ? d3.scaleLinear().domain([lo, hi]).range([0, 1]).clamp(true)
      : function () { return 1; };

    (hier.children || []).forEach(function (grp) {
      var w = grp.x1 - grp.x0, h = grp.y1 - grp.y0;
      if (w < 4 || h < 4) return;

      var frame = document.createElementNS(ns, 'rect');
      frame.setAttribute('x', grp.x0); frame.setAttribute('y', grp.y0);
      frame.setAttribute('width', w); frame.setAttribute('height', h);
      frame.setAttribute('rx', 3);
      frame.setAttribute('fill', 'none');
      frame.setAttribute('stroke', 'var(--c-line)');
      frame.setAttribute('stroke-width', 1);
      self.svg.appendChild(frame);

      if (w > 62 && h > PAD_TOP + 6) {
        var chip = document.createElementNS(ns, 'rect');
        chip.setAttribute('class', 'tm-group-chip');
        chip.setAttribute('x', grp.x0 + 3); chip.setAttribute('y', grp.y0 + 2.5);
        chip.setAttribute('width', Math.min(w - 6, 168)); chip.setAttribute('height', 14);
        chip.setAttribute('rx', 3);
        chip.setAttribute('fill', 'color-mix(in oklab, var(--c-ink) 7%, transparent)');
        self.svg.appendChild(chip);

        var lb = document.createElementNS(ns, 'text');
        lb.setAttribute('x', grp.x0 + 6);
        lb.setAttribute('y', grp.y0 + 13);
        lb.setAttribute('class', 'tm-label');
        lb.setAttribute('font-size', '10.5');
        lb.setAttribute('fill', 'var(--c-ink-3)');
        lb.textContent = fitText(grp.data.name + '  ·  ' + db.fmt.bytes(grp.value), w, 10.5);
        self.svg.appendChild(lb);
      }
    });

    // ---- the tiles ----------------------------------------------------------
    hier.leaves().forEach(function (d) {
      var w = d.x1 - d.x0, h = d.y1 - d.y0;
      if (w < 2 || h < 2) return;

      var g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'tm-tile');
      g.setAttribute('data-path', d.data.path);
      g.setAttribute('data-excluded', d.data.excluded ? 'true' : 'false');
      if (self.draining[d.data.path]) g.setAttribute('data-draining', 'true');
      if (self.interactive) {
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label',
          d.data.name + ', ' + db.fmt.bytes(d.data.value) +
          (d.data.excluded ? ', excluded' : ', included') + '. Activate to toggle.');
      }

      var r = document.createElementNS(ns, 'rect');
      r.setAttribute('class', 'fill');
      r.setAttribute('x', d.x0); r.setAttribute('y', d.y0);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('rx', 2);
      var pct = mixFor(d.data.idle || 0, idleScale);
      r.setAttribute('fill', tierColour(d.data.tier, pct));
      g.appendChild(r);

      // a lit top edge - the same light source as the panels, so tiles read as
      // material rather than as flat swatches
      if (h > 14) {
        var sh = document.createElementNS(ns, 'rect');
        sh.setAttribute('class', 'sheen');
        sh.setAttribute('x', d.x0); sh.setAttribute('y', d.y0);
        sh.setAttribute('width', w); sh.setAttribute('height', Math.min(h * 0.55, 34));
        sh.setAttribute('rx', 4);
        sh.setAttribute('fill', 'url(#wsSheen)');
        sh.setAttribute('pointer-events', 'none');
        g.appendChild(sh);
      }

      // the second channel for the one tier that cannot be undone
      if (d.data.tier === 'permanent') {
        var hatch = document.createElementNS(ns, 'rect');
        hatch.setAttribute('x', d.x0); hatch.setAttribute('y', d.y0);
        hatch.setAttribute('width', w); hatch.setAttribute('height', h);
        hatch.setAttribute('rx', 2);
        hatch.setAttribute('fill', 'url(#wsHatch)');
        hatch.setAttribute('pointer-events', 'none');
        g.appendChild(hatch);
      }

      if (w > 54 && h > 26) {
        var t1 = document.createElementNS(ns, 'text');
        t1.setAttribute('x', d.x0 + 6); t1.setAttribute('y', d.y0 + 15);
        t1.setAttribute('class', 'tm-label');
        t1.setAttribute('font-size', '11');
        t1.setAttribute('fill', labelInk());
        t1.textContent = fitText(d.data.name, w, 11);
        g.appendChild(t1);
      }
      if (w > 54 && h > 42) {
        var t2 = document.createElementNS(ns, 'text');
        t2.setAttribute('x', d.x0 + 6); t2.setAttribute('y', d.y0 + 29);
        t2.setAttribute('class', 'tm-sub');
        t2.setAttribute('font-size', '10');
        t2.setAttribute('fill', labelInk());
        t2.setAttribute('opacity', '.74');
        var full = db.fmt.bytes(d.data.value) + '  ·  ' + d.data.idle + 'd';
        var short = db.fmt.bytes(d.data.value);
        t2.textContent = (fitText(full, w, 10) === full) ? full : fitText(short, w, 10);
        g.appendChild(t2);
      }

      g.addEventListener('mousemove', function (e) { self.showTip(e, d); });
      g.addEventListener('mouseleave', function () { self.tip.hidden = true; });

      if (self.interactive) {
        var act = function () {
          var nowExcluded = db.toggleExcluded(d.data.path);
          g.setAttribute('data-excluded', nowExcluded ? 'true' : 'false');
          self.onToggle(d.data, nowExcluded);
        };
        g.addEventListener('click', act);
        g.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); }
        });
      }

      self.svg.appendChild(g);
    });

    this.addDefs();
    this.svg.setAttribute('aria-label',
      'Reclaim map: ' + leaves.length + ' targets across ' + (hier.children || []).length +
      ' sections, ' + db.fmt.bytes(hier.value) + ' reclaimable in total. ' +
      'The equivalent data is in the table below.');
  };

  ReclaimMap.prototype.addDefs = function () {
    if (this.svg.querySelector('#wsHatch')) return;
    var ns = 'http://www.w3.org/2000/svg';
    var defs = document.createElementNS(ns, 'defs');
    var pat = document.createElementNS(ns, 'pattern');
    pat.setAttribute('id', 'wsHatch');
    pat.setAttribute('width', '6'); pat.setAttribute('height', '6');
    pat.setAttribute('patternUnits', 'userSpaceOnUse');
    pat.setAttribute('patternTransform', 'rotate(45)');
    var line = document.createElementNS(ns, 'rect');
    line.setAttribute('width', '2'); line.setAttribute('height', '6');
    line.setAttribute('fill', 'oklch(0 0 0 / .34)');
    pat.appendChild(line);
    defs.appendChild(pat);

    var grad = document.createElementNS(ns, 'linearGradient');
    grad.setAttribute('id', 'wsSheen');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
    [['0%', 'color-mix(in oklab, var(--c-ink) 13%, transparent)'],
     ['100%', 'transparent']].forEach(function (st) {
      var s2 = document.createElementNS(ns, 'stop');
      s2.setAttribute('offset', st[0]);
      s2.setAttribute('stop-color', st[1]);
      grad.appendChild(s2);
    });
    defs.appendChild(grad);
    this.svg.insertBefore(defs, this.svg.firstChild);
  };

  /* 🔴 THE ZERO STATE. Not "nothing, plus a caption explaining that there is
     nothing" - that is an unfinished state, not an empty one. A clean machine gets
     the same object, drawn from the PROTECTED list, dimmed: proof that the tool
     looked and found only things it refuses to touch. */
  ReclaimMap.prototype.renderZero = function () {
    var ns = 'http://www.w3.org/2000/svg', self = this, d3 = window.d3;
    var paths = window.wsSeed.PROTECTED;

    var fake = { name: 'protected', children: paths.map(function (p, i) {
      return { name: p, value: 40 + ((i * 37) % 130) };     // deterministic, not random
    }) };

    var hier = d3.hierarchy(fake).sum(function (d) { return d.value || 0; })
      .sort(function (a, b) { return b.value - a.value; });
    var FZ = frameFor(this.root.clientWidth);
    this.svg.setAttribute('viewBox', '0 0 ' + FZ.w + ' ' + FZ.h);
    d3.treemap().tile(d3.treemapSquarify.ratio(FZ.w > FZ.h ? 1.4 : 0.8))
      .size([FZ.w, FZ.h]).paddingOuter(2).paddingInner(2).round(true)(hier);

    hier.leaves().forEach(function (d) {
      var r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', d.x0); r.setAttribute('y', d.y0);
      r.setAttribute('width', d.x1 - d.x0); r.setAttribute('height', d.y1 - d.y0);
      r.setAttribute('rx', 2);
      r.setAttribute('fill', 'var(--c-line)');
      r.setAttribute('opacity', '.5');
      self.svg.appendChild(r);

      if ((d.x1 - d.x0) > 74 && (d.y1 - d.y0) > 18) {
        var t = document.createElementNS(ns, 'text');
        t.setAttribute('x', d.x0 + 6); t.setAttribute('y', d.y0 + 14);
        t.setAttribute('class', 'tm-sub');
        t.setAttribute('font-size', '9.5');
        t.setAttribute('fill', 'var(--c-ink-3)');
        t.textContent = d.data.name.replace(/^%[A-Z]+%\\/, '');
        self.svg.appendChild(t);
      }
    });

    this.svg.setAttribute('aria-label',
      'Reclaim map, empty: nothing is reclaimable. The tiles show the ' + paths.length +
      ' protected locations the scan refused to touch.');

    var note = document.createElement('div');
    note.className = 'tm-empty-note';
    var h = document.createElement('p');
    h.className = 't-lg wide';
    h.textContent = 'Nothing to reclaim.';
    var s = document.createElement('p');
    s.className = 't-sm ink-2';
    s.style.maxWidth = '30rem';
    s.textContent = 'Every location behind these tiles is protected or in use. There is nothing here the scan is willing to touch.';
    note.appendChild(h); note.appendChild(s);
    this.root.appendChild(note);
  };

  /* the clean moment: tiles drain out, one wave, then the map re-renders empty of
     what went. The single memorable, deliberate moment - one beats twelve loops. */
  ReclaimMap.prototype.drain = function (paths, done) {
    var self = this;
    var reduced = window.ws.prefersReducedMotion();
    paths.forEach(function (p, i) {
      self.draining[p] = true;
      var g = self.svg.querySelector('.tm-tile[data-path="' + CSS.escape(p) + '"]');
      if (!g) return;
      setTimeout(function () { g.setAttribute('data-draining', 'true'); }, reduced ? 0 : i * 45);
    });
    setTimeout(function () { if (done) done(); }, reduced ? 40 : (paths.length * 45 + 420));
  };

  /* the accessible table carrying the same data - the primary accessible
     representation, not a consolation prize */
  ReclaimMap.buildTable = function (mount, data) {
    var db = window.wsdb;
    mount.textContent = '';
    var table = document.createElement('table');
    table.className = 'tbl';
    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    ['Section', 'Target', 'Path', 'Size', 'Idle (days)'].forEach(function (h) {
      var th = document.createElement('th'); th.textContent = h; hr.appendChild(th);
    });
    thead.appendChild(hr); table.appendChild(thead);
    var tb = document.createElement('tbody');
    (data.children || []).forEach(function (grp) {
      (grp.children || []).forEach(function (l) {
        var tr = document.createElement('tr');
        [grp.name, l.name, l.path, db.fmt.bytes(l.value), String(l.idle)].forEach(function (v, i) {
          var td = document.createElement('td');
          td.textContent = v;
          if (i === 2) td.className = 'mono t-2xs';
          if (i >= 3) td.className = 'num-cell';
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
    });
    table.appendChild(tb);
    mount.appendChild(table);
  };

  window.ReclaimMap = ReclaimMap;
})();
