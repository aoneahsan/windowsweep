/* ============================================================================
   EMAILS - the gallery's behaviour (AMENDMENTS-3.md, 2026-11-06).

   Each <template id="email-<name>"> is one message's <body> markup with its
   specimen data. This script draws it twice (600 px, 390 px), writes its plain-
   text part FROM THE SAME MARKUP in the same order (heading, intro, facts as
   "Label: value", the button as "Label: URL", the footer with every URL written
   out), and keeps the chosen message and mail appearance in the URL.

   🔴 The specimen's logo is the live origin's absolute https PNG. Until the main
   session uploads it, the PREVIEW swaps in the repository's own mark - the
   specimen markup itself never changes, so parity reads the real URL.
   ============================================================================ */
(function () {
  'use strict';
  var templates = Array.prototype.slice.call(document.querySelectorAll('template[id^="email-"]'));
  var tabs = document.getElementById('email-tabs');
  var wide = document.getElementById('email-wide');
  var narrow = document.getElementById('email-narrow');
  var text = document.getElementById('email-text');
  var note = document.getElementById('email-note');
  /* offline preview only: the desktop icon, the same three-stroke drawing the emails' hosted logo shows */
  var PREVIEW_LOGO = '../../src-tauri/icons/128x128.png';
  if (!templates.length || !tabs) return;

  function param(name) { return new URLSearchParams(location.search).get(name); }
  function setParam(name, value) {
    var q = new URLSearchParams(location.search);
    if (value) q.set(name, value); else q.delete(name);
    try { history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '')); } catch (e) { /* file:// may refuse */ }
  }

  /* ---- the plain-text part, built from the specimen in reading order ------ */
  function inline(node) {
    var out = '';
    node.childNodes.forEach(function (c) {
      if (c.nodeType === 3) { out += c.textContent; return; }
      if (c.nodeType !== 1) return;
      if (c.tagName === 'BR') { out += '\n'; return; }
      if (c.tagName === 'A') {
        var label = c.textContent.trim(), href = c.getAttribute('href');
        var bare = href.replace(/^https:\/\//, '').replace(/\/$/, '');
        out += label === href || label === bare ? href : label + ' (' + href + ')';
        return;
      }
      out += inline(c);
    });
    return out.replace(/[ \t]+/g, ' ');
  }
  function plain(root) {
    var lines = [];
    root.querySelectorAll('[data-part]').forEach(function (p) {
      var kind = p.getAttribute('data-part');
      if (kind === 'preheader' || kind === 'fallback' || kind === 'logo' || kind === 'image') return;
      if (kind === 'facts') {
        p.querySelectorAll('tr').forEach(function (tr) {
          var c = tr.querySelectorAll('th, td');
          if (c.length > 1) lines.push(c[0].textContent.trim() + ': ' + c[1].textContent.trim());
        });
        lines.push('');
        return;
      }
      if (kind === 'button') {
        var a = p.querySelector('a');
        lines.push(a.textContent.trim() + ': ' + a.getAttribute('href'), '');
        return;
      }
      if (kind === 'bullet') { lines.push('- ' + inline(p).trim()); return; }
      if (kind === 'footer') lines.push('--');
      lines.push(inline(p).trim(), '');
    });
    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  function draw(host, template) {
    host.replaceChildren(template.content.cloneNode(true));
    host.querySelectorAll('img[data-part="logo"]').forEach(function (img) {
      img.addEventListener('error', function swap() {
        img.removeEventListener('error', swap);
        img.setAttribute('data-preview-src', 'repository mark');
        img.src = PREVIEW_LOGO;
      });
      /* a file:// review has no network: preview the local mark at once */
      if (location.protocol === 'file:') img.dispatchEvent(new Event('error'));
    });
  }

  function render(index, focus) {
    var t = templates[index];
    if (!t) return;
    draw(wide, t);
    draw(narrow, t);
    var meta = 'Subject: ' + t.dataset.subject + ' · Preheader: ' + t.dataset.preheader;
    document.querySelectorAll('[data-email-subject]').forEach(function (n) { n.textContent = meta; });
    text.textContent = plain(wide);
    note.textContent = t.dataset.note;
    setParam('email', t.id.replace(/^email-/, ''));
    Array.prototype.forEach.call(tabs.children, function (tab, i) {
      var on = i === index;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });
  }

  templates.forEach(function (t, index) {
    var tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'email-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', 'email-panel');
    tab.textContent = String(index + 1).padStart(2, '0') + ' · ' + t.dataset.label;
    tab.addEventListener('click', function () { render(index, false); });
    tab.addEventListener('keydown', function (e) {
      var next = index;
      if (e.key === 'ArrowRight') next = (index + 1) % templates.length;
      if (e.key === 'ArrowLeft') next = (index + templates.length - 1) % templates.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = templates.length - 1;
      if (next !== index) { e.preventDefault(); render(next, true); }
    });
    tabs.appendChild(tab);
  });

  /* the mail's own appearance, as a mail client would pick it (review control) */
  var modes = document.querySelectorAll('[data-mail-mode]');
  function mode(m) {
    [wide, narrow].forEach(function (host) { host.setAttribute('data-mode', m); });
    modes.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mail-mode') === m ? 'true' : 'false'); });
    setParam('mode', m === 'light' ? null : m);
  }
  modes.forEach(function (b) { b.addEventListener('click', function () { mode(b.getAttribute('data-mail-mode')); }); });

  [wide, narrow].forEach(function (host) {
    host.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      e.preventDefault();
      note.textContent = 'Specimen link. In the sent message it opens ' + link.getAttribute('href');
    });
  });

  /* 🔴 THE LAYOUT'S STYLE BLOCK IS MIRRORED, NEVER RETYPED. It ships in every
     message's <head> and sits inert here (media="not all"), so this page's own
     viewport and OS theme cannot restyle a specimen. Its phone rules are replayed
     as container queries on each canvas, its dark rules under [data-mode=dark]. */
  var layout = document.getElementById('wsm-layout-style');
  var shown = document.getElementById('email-layout-css');
  if (layout && shown) shown.textContent = layout.textContent.trim();
  if (layout && layout.sheet) {
    var css = [];
    Array.prototype.forEach.call(layout.sheet.cssRules, function (r) {
      var cond = r.conditionText || (r.media && r.media.mediaText) || '';
      if (!r.cssRules || /max-width/.test(cond) === /prefers-color-scheme/.test(cond)) return;
      var phone = /max-width/.test(cond);
      var rules = Array.prototype.map.call(r.cssRules, function (c) {
        var pre = phone ? '.email-canvas ' : '.email-canvas[data-mode="dark"] ';
        return c.selectorText.split(',').map(function (s) { return pre + s.trim(); }).join(', ') + ' { ' + c.style.cssText + ' }';
      }).join('\n');
      css.push(phone ? '@container wsmail (max-width: 480px) {\n' + rules + '\n}' : rules);
    });
    var mirror = document.createElement('style');
    mirror.textContent = css.join('\n');
    document.head.appendChild(mirror);
  }

  var want = param('email'), start = 0;
  templates.forEach(function (t, i) { if (t.id === 'email-' + want) start = i; });
  mode(param('mode') === 'dark' ? 'dark' : 'light');
  render(start, false);
}());
