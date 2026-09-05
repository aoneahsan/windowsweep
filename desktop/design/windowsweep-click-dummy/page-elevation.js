/* Elevation - what needs administrator rights, what the second window does, and
   the SmartScreen note. windowsweep never elevates itself. */
(function () {
  'use strict';
  var ws = window.ws, S = window.wsSeed, db = window.wsdb, el = ws.el;

  window.wsPage = {
    init: function () {
      var host = document.querySelector('[data-ws-elevated]');
      var admin = S.SECTIONS.filter(function (s) { return s.admin; });
      if (host) {
        admin.forEach(function (s) {
          var card = el('div', 'card');
          var bd = el('div', 'card-bd');
          var top = el('div');
          top.style.cssText = 'display:flex;align-items:center;gap:var(--sp-2);flex-wrap:wrap';
          top.appendChild(el('span', 'num t-sm ink-3', String(s.id)));
          var k = el('span', 't-base'); k.style.fontWeight = '600'; k.textContent = s.key;
          top.appendChild(k);
          top.appendChild(el('span', 'badge badge-danger', 'admin'));
          if (s.batch === 'deep') top.appendChild(el('span', 'badge badge-warn', 'deep'));
          bd.appendChild(top);
          bd.appendChild(el('p', 't-sm ink-3', s.title));
          card.appendChild(bd);
          host.appendChild(card);
        });
      }

      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        if (t.dataset.wsAction === 'elevateRun') {
          window.wsWidgets.pending(t, true);
          setTimeout(function () {
            window.wsWidgets.pending(t, false);
            ws.toast('Windows would show its permission prompt here. This is a design prototype, ' +
                     'so nothing elevates and nothing runs.', { assertive: true });
          }, 900);
        }
        if (t.dataset.wsAction === 'elevateDry') {
          window.wsWidgets.pending(t, true);
          setTimeout(function () {
            window.wsWidgets.pending(t, false);
            ws.toast('Measured 15.9 GB across 6 admin sections. Nothing was deleted, and no ' +
                     'permission was needed to look.');
          }, 1100);
        }
      });
    }
  };
})();
