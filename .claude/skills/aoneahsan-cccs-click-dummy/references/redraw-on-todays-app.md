# Redrawing on today's product — and proving the screen uses its width

**Law:** `~/.claude/rules-detail/frontend-ui-standards.md` §19 (owner, 2026-10-26). This file is the method and the
instrument. Reference implementation: the shortlists role-automations dummy (P-SL-48, dummy v3, 26 Oct 2026). Its
first audit passed 14 of 84 states; after the width pass it passed 90 of 90 (three states added), and five planted
layout defects each failed.

## 1. Take the fields, leave the layout

An older prototype, a client's mock-up, a previous dummy or the product's previous version is read once, for a
**field list**: every field, flow, state, rule and word, each with where it came from. Nothing else crosses over:
not its widths, columns, spacing, colours or component shapes.

Then open the **app pages the screen extends** and copy what they really use: the class strings from the component
layer (`src/components/ui/*` or the project's equivalent), the page frame (padding, max width, background), the row
and card anatomy, the dialog shell. Where the reference page wastes space, do better (§19b): note the divergence in
the dummy and in the project's decision log, naming the app pattern used instead.

## 2. The layout patterns

| Content | Desktop (≥1024) | Phone (<640) |
| --- | --- | --- |
| Independent cards (settings, stages, option sets) | `grid grid-cols-1 gap-4 lg:grid-cols-2`, cards `h-full flex flex-col`, the card's action `mt-auto` | one column |
| One big group with many rows (a rule list) | a full-width card, its rows in two columns (`lg:grid lg:grid-cols-2`) | one column |
| A list of records | a full-width table, each value one line inside a set width (`block max-w-[13rem] truncate` + `title`) | a card list (`sm:hidden` cards, `hidden sm:block` table) |
| One form or prose | a single column sized to its content | full width |
| A long dialog | `flex flex-col max-h-[90dvh]`: header and footer `shrink-0`, body `min-h-0 flex-1 overflow-y-auto` | a bottom sheet, `max-h-[calc(100dvh-1rem)]` |
| An icon beside words that may wrap | `flex items-start gap-2`, icon `mt-0.5 shrink-0`, words in one `min-w-0` element | same |
| "title · meta" that may wrap | the meta on its own line, or ` · ` holding the dot to its neighbours | same |

The filter, counts and other management for a long list sit in a toolbar above it, not in a sidebar that narrows it.

## 3. The layout audit

A page-side function, run over CDP at every page and state, at **1440 × 900 and 390 × 844**, after finite entrance
animations finish:

```js
// settle first: an entrance caught mid-fade is not the state
const run = document.getAnimations().filter((a) => a.playState === 'running' && isFinite(a.effect.getComputedTiming().endTime));
await Promise.race([Promise.all(run.map((a) => a.finished.catch(() => null))), new Promise((r) => setTimeout(r, 2500))]);
// then: Runtime.evaluate({ expression: '(' + LAYOUT_AUDIT + ')(' + JSON.stringify(options) + ')', returnByValue: true })
```

It returns `{ failures: [{ check, detail, where }] }`; an empty list is a pass. Record one check per state and width.

| Check | Fails when |
| --- | --- |
| `sideways` | the document or the page's scroller is wider than the window |
| `table-overflow` | a table is wider than the box that holds it |
| `coverage-page` | at ≥1024 px the widest content spans under 80% of the main column |
| `coverage-run` | more than 160 px of content spans under 90% of the widest (a capped column under a full-width header) |
| `dialog-fit` | an open dialog leaves the window |
| `dialog-footer` | a modal's `[data-dialog-footer]` is missing or outside the visible dialog |
| `icon-line` | an icon of 20 px or less sits off the first line of the words after it |
| `select-wrap` | a select shows its value on more than one visible line |
| `separator-line` | a line opens on `·`, `\|` or `•` |
| `ticket-id` | a ticket id (`ABC-123`) is in product text, `aria-label`, `title` or `placeholder` |

**Options per project:** `main` (the content column), `scroller` (the page's own vertical scroller), `ignore`
(review chrome: a dummy's banner and notes — never read), `exempt` (regions drawn as an **unchanged** product surface,
each marked with its reason, e.g. `data-app-unchanged="The dashboard's KPIs widget"` — not judged, listed in the
report), `iconExempt` (a library's own layout, e.g. `[data-sonner-toast]`). A page narrow on purpose carries
`data-layout-narrow="<reason>"`.

🔴 **Keep exemptions honest.** `exempt` covers context the project does not change. Everything the project adds or
changes is judged, and a defect found in the exempt context is filed as a wider finding, not hidden.

## 4. Plants — each check shown failing

Build planted copies of the dummy (never the repo tree), one defect each, prove each applied exactly once, run the
audit over the copy, and require the named state to fail:

| Plant | Change | Must fail |
| --- | --- | --- |
| width cap | put a narrow column back (a cap the stylesheet has, such as `max-w-3xl`, on the list) | `coverage-run` on that page at 1440 |
| dialog cap | remove the dialog's height caps (all of them: the phone's and the base) | `dialog-fit` at 390 |
| icon alone | move a line's icon into its own block above the words | `icon-line` |
| ticket id | put a ticket id back into a sentence | `ticket-id` |
| separator | put "· meta" back after a title in a narrow card | `separator-line` |

🔴 **A plant that changes nothing is a broken plant.** Removing class tokens always works; adding a class works only
if the generated stylesheet contains it (a dummy's stylesheet is generated from its own markup).

## 5. Traps the instrument hit — keep the fixes

- **A page background counted as content** covered every strip. Content is a visible leaf, or a box drawn as a card
  (a border or a shadow); a background-only surface behind other content is not content.
- **Inline text measured by its own width** read ragged text as a narrow column. Inline content, row-flex items and
  grid items take their container's extent; block and column-flex children keep their own (so a capped column
  stays capped, and a lone last card in a grid is not a defect).
- **Inner scroll panes** (a builder's form column) put content far below the fold. Clip each box to its nearest
  inner scroller.
- **A docked side panel** narrows the column: measure up to its left edge.
- **Screen-reader text and count badges** are not an icon's label; skip positioned layers.
- **`line-clamp` lines** are laid out but hidden: count only lines inside the clipping box.
- **A modal or a drawer still in the DOM** must be on screen to count as open.

## 6. The audit's page script

Copy it as it is; tune only the options.

```js
// Layout audit (frontend-ui-standards §19): a page-side function. Run it over CDP as
//   Runtime.evaluate({ expression: '(' + source + ')(' + JSON.stringify(options) + ')', returnByValue: true })
// at every page and state, at 1440 x 900 and at 390 x 844, after entrance animations finish. It reads the page and
// changes nothing. It returns { failures: [{ check, detail, where }] }; an empty list is a pass.
function layoutAudit(options) {
  var o = Object.assign(
    {
      main: 'main', // the page's content column
      scroller: '', // the page's own vertical scroller, when it is not the document
      pageCoverage: 0.8, // at >= 1024 px the widest content spans at least this share of the column
      stripCoverage: 0.9, // and every content strip at least this share of the widest
      strip: 24, // strip height for the coverage scan, px
      maxNarrowRun: 160, // a run of narrow strips taller than this fails
      ignore: '', // review-only chrome (a dummy's banner and notes): never read
      exempt: '', // regions drawn as an unchanged product surface, each marked with its reason: not judged
      tickets: '\\b[A-Z]{2,5}-\\d{2,6}\\b', // ticket ids that must not reach product text
      maxIcon: 20, // icons up to this size sit on their label's first line
      iconExempt: '[data-sonner-toast]', // a library's own layout the product does not draw (its toasts)
      separators: '·|•', // characters no line may open on
      debug: false,
    },
    options || {},
  );
  var failures = [];
  var stats = {};
  var skip = [o.ignore, o.exempt].filter(Boolean).join(', ');
  var describe = function (el) {
    if (!el || el.nodeType !== 1) return '';
    var id = el.id ? '#' + el.id : '';
    var data = Array.prototype.slice
      .call(el.attributes)
      .filter(function (a) {
        return a.name.indexOf('data-') === 0;
      })
      .slice(0, 2)
      .map(function (a) {
        return '[' + a.name + (a.value ? '="' + a.value.slice(0, 24) + '"' : '') + ']';
      })
      .join('');
    var text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    return el.tagName.toLowerCase() + id + data + (text ? ' "' + text + '"' : '');
  };
  var fail = function (check, detail, el) {
    failures.push({ check: check, detail: detail, where: describe(el) });
  };
  var skipped = function (el) {
    return !!(skip && el && el.closest && el.closest(skip));
  };
  var visible = function (el) {
    return !!(el && el.checkVisibility && el.checkVisibility({ opacityProperty: true, visibilityProperty: true }));
  };
  var onScreen = function (el) {
    if (!visible(el)) return false;
    var r = el.getBoundingClientRect();
    return r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
  };
  var px = function (v) {
    return parseFloat(v) || 0;
  };
  var style = function (el) {
    return getComputedStyle(el);
  };
  var inFixedLayer = function (el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) if (style(e).position === 'fixed') return true;
    return false;
  };
  // Text in a positioned layer (a count badge, screen-reader-only text) is not part of the line it sits on.
  var lifted = function (node, root) {
    for (var e = node.parentElement; e && e !== root; e = e.parentElement) {
      var pos = style(e).position;
      if (pos === 'absolute' || pos === 'fixed') return true;
    }
    return false;
  };
  var textNodes = function (root) {
    var out = [];
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (var n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.nodeValue.trim() || (n.parentElement && n.parentElement.closest('svg'))) continue;
      if (lifted(n, root) || !visible(n.parentElement)) continue;
      out.push(n);
    }
    return out;
  };
  var firstCharRect = function (node) {
    var at = node.nodeValue.search(/\S/);
    var rg = document.createRange();
    rg.setStart(node, at);
    rg.setEnd(node, at + 1);
    return rg.getClientRects()[0];
  };
  var modalOpen = Array.prototype.some.call(
    document.querySelectorAll('[role="dialog"][aria-modal="true"], [role="alertdialog"]'),
    onScreen,
  );

  // 1. No sideways scroll: the document, the page's scroller, and every table inside its own box.
  var doc = document.documentElement;
  if (doc.scrollWidth > innerWidth + 1) fail('sideways', 'the page is ' + doc.scrollWidth + ' px in a ' + innerWidth + ' px window', doc);
  var pageScroller = o.scroller && document.querySelector(o.scroller);
  if (pageScroller && pageScroller.scrollWidth > pageScroller.clientWidth + 1) {
    fail('sideways', 'the scroller is ' + pageScroller.scrollWidth + ' px wide in ' + pageScroller.clientWidth, pageScroller);
  }
  Array.prototype.forEach.call(document.querySelectorAll('table'), function (t) {
    if (skipped(t) || !visible(t)) return;
    var box = t.parentElement;
    while (box && box !== document.body && style(box).overflowX === 'visible') box = box.parentElement;
    var limit = box && box !== document.body ? box.clientWidth : innerWidth;
    var w = t.getBoundingClientRect().width;
    if (w > limit + 1) fail('table-overflow', 'a table ' + Math.round(w) + ' px wide in a ' + limit + ' px box: give it the width, or a card list on a phone', t);
  });

  // 2. Width coverage, at >= 1024 px with no modal open. Content is every visible leaf and every box drawn as a card
  // (a border or a shadow); a surface that only paints a background behind other content is not content. A box's
  // horizontal extent is the line it sits on: inline content, row-flex items and grid items take their container's
  // extent (ragged text is not a narrow column, and a lone last card in a grid is not one either), while a block or
  // column-flex child keeps its own (a capped column stays capped). Fixed layers are skipped, a box in an inner
  // scroll pane counts only where the pane shows it, and a panel docked at the right edge narrows the column.
  var main = document.querySelector(o.main);
  if (innerWidth >= 1024 && main && !modalOpen && !main.closest('[data-layout-narrow]') && !skipped(main)) {
    var mr = main.getBoundingClientRect();
    var ms = style(main);
    var L = mr.left + px(ms.paddingLeft);
    var R = mr.right - px(ms.paddingRight);
    Array.prototype.forEach.call(document.querySelectorAll('[role="dialog"], aside, [data-docked]'), function (p) {
      if (!onScreen(p) || main.contains(p) || style(p).position !== 'fixed') return;
      var r = p.getBoundingClientRect();
      if (r.right >= innerWidth - 1 && r.height > innerHeight * 0.6 && r.left > L) R = Math.min(R, r.left);
    });
    var clipCache = new Map();
    var clipOf = function (el) {
      var e = el.parentElement;
      if (!e || e === main || !main.contains(e)) return null;
      if (clipCache.has(e)) return clipCache.get(e);
      var es = style(e);
      var c;
      if (e !== pageScroller && /(auto|scroll)/.test(es.overflowY) && e.scrollHeight > e.clientHeight + 1) {
        var er = e.getBoundingClientRect();
        var upper = clipOf(e);
        c = upper ? [Math.max(er.top, upper[0]), Math.min(er.bottom, upper[1])] : [er.top, er.bottom];
      } else c = clipOf(e);
      clipCache.set(e, c);
      return c;
    };
    var lineBox = function (el) {
      var e = el;
      for (;;) {
        var p = e.parentElement;
        if (!p || p === main || !main.contains(p)) break;
        var ps = style(p);
        var inline = style(e).display.indexOf('inline') === 0;
        var rowFlex = ps.display.indexOf('flex') >= 0 && ps.flexDirection.indexOf('row') === 0;
        var grid = ps.display.indexOf('grid') >= 0;
        if (!(inline || rowFlex || grid)) break;
        e = p;
      }
      return e.getBoundingClientRect();
    };
    var boxes = [];
    Array.prototype.forEach.call(main.querySelectorAll('*'), function (el) {
      if (skipped(el) || el.closest('[data-layout-narrow]') || !visible(el)) return;
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      var s = style(el);
      var card = px(s.borderTopWidth) + px(s.borderRightWidth) + px(s.borderBottomWidth) + px(s.borderLeftWidth) > 0 || s.boxShadow !== 'none';
      if (!card && el.children.length) return;
      if (inFixedLayer(el)) return;
      var top = r.top;
      var bottom = r.bottom;
      var clip = clipOf(el);
      if (clip) {
        top = Math.max(top, clip[0]);
        bottom = Math.min(bottom, clip[1]);
        if (bottom - top < 2) return;
      }
      var lb = lineBox(el);
      boxes.push([Math.max(Math.min(r.left, lb.left), L), Math.min(Math.max(r.right, lb.right), R), top, bottom]);
    });
    if (boxes.length) {
      var top = Math.min.apply(null, boxes.map(function (b) { return b[2]; }));
      var bottom = Math.max.apply(null, boxes.map(function (b) { return b[3]; }));
      var strips = [];
      for (var y = top; y < bottom; y += o.strip) {
        var lo = Infinity;
        var hi = -Infinity;
        for (var i = 0; i < boxes.length; i++) {
          var b = boxes[i];
          if (b[3] <= y || b[2] >= y + o.strip || b[1] <= b[0]) continue;
          if (b[0] < lo) lo = b[0];
          if (b[1] > hi) hi = b[1];
        }
        if (hi > lo) strips.push({ y: y, span: hi - lo });
      }
      var widest = Math.max.apply(null, strips.map(function (s) { return s.span; }));
      if (o.debug) stats.coverage = { column: R - L, widest: widest, strips: strips.map(function (s) { return [Math.round(s.y), Math.round(s.span)]; }) };
      if (widest / (R - L) < o.pageCoverage) {
        fail('coverage-page', 'the widest content spans ' + Math.round((100 * widest) / (R - L)) + '% of the ' + Math.round(R - L) + ' px column', main);
      }
      var run = null;
      var flush = function () {
        if (run && run.end - run.start > o.maxNarrowRun) {
          fail('coverage-run', Math.round(run.end - run.start) + ' px of content (from y ' + Math.round(run.start) + ') spans only ' + Math.round(100 * run.min) + '% of the widest', main);
        }
        run = null;
      };
      strips.forEach(function (s) {
        var c = s.span / widest;
        if (c < o.stripCoverage) {
          if (!run) run = { start: s.y, end: s.y + o.strip, min: c };
          else {
            run.end = s.y + o.strip;
            run.min = Math.min(run.min, c);
          }
        } else flush();
      });
      flush();
    }
  }

  // 3. Dialogs fit the window, and a modal's footer (marked data-dialog-footer) shows without scrolling.
  Array.prototype.forEach.call(document.querySelectorAll('[role="dialog"], [role="alertdialog"]'), function (d) {
    if (skipped(d) || !onScreen(d)) return;
    var r = d.getBoundingClientRect();
    if (r.top < -1 || r.left < -1 || r.bottom > innerHeight + 1 || r.right > innerWidth + 1) {
      fail('dialog-fit', 'box ' + [r.left, r.top, r.right, r.bottom].map(Math.round).join(',') + ' in a ' + innerWidth + ' x ' + innerHeight + ' window', d);
    }
    var modal = d.getAttribute('aria-modal') === 'true' || d.getAttribute('role') === 'alertdialog';
    if (!modal) return;
    var foot = d.querySelector('[data-dialog-footer]');
    var buttons = Array.prototype.filter.call(d.querySelectorAll('button'), function (x) {
      return visible(x) && !x.closest('[data-dialog-close]');
    });
    if (!foot) {
      if (buttons.length) fail('dialog-footer', 'a modal with buttons but no [data-dialog-footer]', d);
      return;
    }
    var f = foot.getBoundingClientRect();
    if (f.top < r.top - 1 || f.bottom > r.bottom + 1 || f.bottom > innerHeight + 1) {
      fail('dialog-footer', 'the footer is outside the visible dialog (' + Math.round(f.top) + '-' + Math.round(f.bottom) + ' vs ' + Math.round(r.top) + '-' + Math.round(r.bottom) + ')', d);
    }
  });

  // 4. A small icon sits on its label's first line. The label is the text that directly follows the icon, or its
  // icon-only wrapper, in the same parent: an icon alone on a line above its text is the old-screen tell.
  var iconOnly = function (el) {
    return !textNodes(el).length && el.querySelectorAll('svg, img').length === 1;
  };
  Array.prototype.forEach.call(document.querySelectorAll('svg'), function (svg) {
    if (skipped(svg) || !visible(svg) || (svg.parentElement && svg.parentElement.closest('svg'))) return;
    if (o.iconExempt && svg.closest(o.iconExempt)) return;
    var r = svg.getBoundingClientRect();
    if (r.width > o.maxIcon || r.height > o.maxIcon || r.width < 6) return;
    var host = svg;
    while (host.parentElement && host.parentElement !== document.body && iconOnly(host.parentElement) && !host.parentElement.matches('button, a, [role]')) {
      host = host.parentElement;
      // An icon set in a painted badge of its own (an empty-state circle, a file tile, an avatar) is an illustration.
      var hs = style(host);
      var hr = host.getBoundingClientRect();
      if (hs.backgroundColor !== 'rgba(0, 0, 0, 0)' && hr.width >= 24 && hr.height >= 24) return;
    }
    // The label: the first sibling after the icon holding visible text, past whitespace, hidden elements and positioned
    // layers (a screen-reader-only prefix, a badge).
    var sib = host.nextSibling;
    var node = null;
    while (sib && !node) {
      if (sib.nodeType === 3) {
        if (sib.nodeValue.trim()) node = sib;
      } else if (sib.nodeType === 1 && visible(sib)) {
        var sp = style(sib).position;
        if (sp !== 'absolute' && sp !== 'fixed') node = textNodes(sib)[0] || null;
        if (!node && sp !== 'absolute' && sp !== 'fixed' && sib.querySelector && sib.querySelector('svg, img, input, button')) break;
      }
      if (!node) sib = sib.nextSibling;
    }
    if (!node) return;
    var line = firstCharRect(node);
    if (!line) return;
    var tol = Math.max(line.height, 14) * 0.75;
    if (Math.abs((r.top + r.bottom) / 2 - (line.top + line.bottom) / 2) > tol) {
      fail('icon-line', 'icon at y ' + Math.round(r.top) + ', its label starts at y ' + Math.round(line.top), host.parentElement);
    }
  });

  // 5. A select shows its value on one line. Lines a clamp hides (line-clamp, overflow hidden) are not shown lines.
  Array.prototype.forEach.call(document.querySelectorAll('[role="combobox"], [aria-haspopup="listbox"]'), function (c) {
    if (skipped(c) || !visible(c) || c.matches('input, textarea')) return;
    var tops = {};
    textNodes(c).forEach(function (n) {
      var clip = null;
      for (var e = n.parentElement; e && c.contains(e); e = e.parentElement) {
        if (style(e).overflowY !== 'visible' || style(e).overflowX !== 'visible') {
          clip = e.getBoundingClientRect();
          break;
        }
      }
      var rg = document.createRange();
      rg.selectNodeContents(n);
      Array.prototype.forEach.call(rg.getClientRects(), function (q) {
        if (q.width > 1 && (!clip || q.top < clip.bottom - 1)) tops[Math.round(q.top)] = 1;
      });
    });
    if (Object.keys(tops).length > 1) fail('select-wrap', 'the value wraps over ' + Object.keys(tops).length + ' lines: truncate it', c);
  });

  // 6. No line opens on a separator, and no ticket id reaches product text.
  var ticket = new RegExp(o.tickets);
  var all = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (var n = all.nextNode(); n; n = all.nextNode()) {
    var p = n.parentElement;
    if (!p || skipped(p) || p.closest('script, style, noscript, template') || !visible(p)) continue;
    var v = n.nodeValue;
    var m = v.match(ticket);
    if (m) fail('ticket-id', '"' + m[0] + '" in product text', p);
    for (var j = 0; j < v.length; j++) {
      if (o.separators.indexOf(v[j]) < 0) continue;
      var cr = document.createRange();
      cr.setStart(n, j);
      cr.setEnd(n, j + 1);
      var c = cr.getClientRects()[0];
      if (!c || !c.width) continue;
      // The box that lays the line out: the nearest block, or the row of a flex container whose item wrapped.
      var block = p;
      while (block.parentElement && style(block).display.indexOf('inline') === 0) block = block.parentElement;
      var ref = block;
      var up = block.parentElement && style(block.parentElement);
      if (up && up.display.indexOf('flex') >= 0 && up.flexDirection.indexOf('row') === 0) ref = block.parentElement;
      var br = ref.getBoundingClientRect();
      var bs = style(ref);
      var lineLeft = br.left + px(bs.paddingLeft) + px(bs.borderLeftWidth);
      var firstTop = br.top + px(bs.paddingTop) + px(bs.borderTopWidth);
      if (c.left - lineLeft < 2 && c.top > firstTop + 2) fail('separator-line', 'a line opens on "' + v[j] + '"', p);
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll('[aria-label], [title], [placeholder]'), function (el) {
    if (skipped(el) || !visible(el)) return;
    ['aria-label', 'title', 'placeholder'].forEach(function (a) {
      var t = el.getAttribute(a);
      var mm = t && t.match(ticket);
      if (mm) fail('ticket-id', '"' + mm[0] + '" in ' + a, el);
    });
  });

  return o.debug ? { failures: failures, stats: stats } : { failures: failures };
}
```

**Last updated:** 2026-10-26
