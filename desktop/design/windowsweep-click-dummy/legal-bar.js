/* ============================================================================
   THE LEGAL BAR (N-001; legal-notice.md; AMENDMENTS-3.md, 2026-11-06) - the
   first-run surface since the Consent screen was retired (N-016).

   app.js decides whether it shows (never on a task page, never beside a release
   surface, once per PC and per account) and loads this file only then, as it
   loads tours.js. This file draws it and marks it seen THE MOMENT IT IS DRAWN.

   One quiet bar above the status bar: role="status", no scrim, no focus taken,
   the window usable under it. 10 s; hover and focus hold it and leaving restarts
   it; Okay and Escape close it. The policy links open the website in the browser.
   ============================================================================ */
(function () {
  'use strict';
  var ws = window.ws;
  if (!ws) return;
  var el = ws.el;

  function show(markSeen) {
    if (document.querySelector('[data-ws-legal]')) return;
    var bar = el('div', 'ws-legal');
    bar.setAttribute('data-ws-legal', '');
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');
    var copy = el('div', 'ws-legal-copy');
    var first = el('p', 'ws-legal-sentence', 'By using windowsweep, you agree to our ');
    [['Privacy Policy', 'https://windowsweep.aoneahsan.com/privacy', ' and '],
     ['Terms of Service', 'https://windowsweep.aoneahsan.com/terms', '.']].forEach(function (l) {
      var a = el('a', 'lnk', l[0]);
      a.href = l[1]; a.target = '_blank'; a.rel = 'noopener';
      a.appendChild(el('span', 'visually-hidden', ' (opens in a new tab)'));
      first.appendChild(a);
      first.appendChild(document.createTextNode(l[2]));
    });
    copy.appendChild(first);
    copy.appendChild(el('p', 't-sm ink-3',
      'windowsweep collects usage data to improve the product for everyone. Never a file path, never the contents of anything.'));
    var okay = el('button', 'btn', 'Okay');
    okay.type = 'button';
    bar.appendChild(copy);
    bar.appendChild(okay);
    document.body.appendChild(bar);
    if (markSeen) markSeen();

    var timer = null;
    function arm() { clearTimeout(timer); timer = setTimeout(close, 10000); }
    function hold() { clearTimeout(timer); }
    function close() {
      clearTimeout(timer);
      var had = bar.contains(document.activeElement);
      bar.remove();
      document.removeEventListener('keydown', onKey);
      /* a keyboard user is handed back to where they are: the rail's current item,
         or the Menu button when the rail is folded away */
      if (had) {
        var back = document.querySelector('.rail-item[aria-current="page"]');
        if (!back || !back.offsetParent) back = document.querySelector('.drawer-btn');
        if (back) back.focus();
      }
    }
    /* Escape belongs to an open overlay first; a closed one stays in the DOM, so
       only a drawn one counts */
    function overlayOpen() {
      return [].some.call(document.querySelectorAll('[aria-modal="true"]'), function (m) { return m.getClientRects().length > 0; });
    }
    function onKey(e) {
      if (e.key === 'Escape' && !overlayOpen() && document.documentElement.getAttribute('data-drawer') !== 'open') close();
    }
    bar.addEventListener('mouseenter', hold);
    bar.addEventListener('mouseleave', function () { if (!bar.contains(document.activeElement)) arm(); });
    bar.addEventListener('focusin', hold);
    bar.addEventListener('focusout', function (e) { if (!bar.contains(e.relatedTarget) && !bar.matches(':hover')) arm(); });
    okay.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    arm();
  }

  window.wsLegal = { show: show };
})();
