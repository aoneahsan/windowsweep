/* Consent - the first-run decision. Every provider starts OFF and stays off
   until this screen is answered; declining is a first-class path that degrades
   nothing. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, el = ws.el;

  var PROVIDERS = [
    ['ga4', 'Product analytics', 'Which screens you opened and which buttons you pressed.',
     'Google Analytics 4'],
    ['amplitude', 'Behaviour analytics', 'The same events, kept longer so trends over months are visible.',
     'Amplitude'],
    ['clarity', 'Session replay', 'A recording of this window with every piece of text masked.',
     'Microsoft Clarity'],
    ['sentry', 'Crash reports', 'A stack trace when something breaks, with file paths stripped out.',
     'Sentry']
  ];

  var state = { ga4: false, amplitude: false, clarity: false, sentry: false };

  function paint() {
    var host = document.querySelector('[data-ws-consent]');
    if (!host) return;
    host.textContent = '';
    PROVIDERS.forEach(function (p) {
      var row = el('div', 'lst-i');
      var txt = el('div');
      txt.style.flex = '1';
      var top = el('div');
      top.style.cssText = 'display:flex;align-items:baseline;gap:var(--sp-2);flex-wrap:wrap';
      top.appendChild(el('span', 't-base', p[1]));
      top.appendChild(el('span', 'badge badge-outline', p[3]));
      txt.appendChild(top);
      txt.appendChild(el('div', 't-sm ink-3', p[2]));
      row.appendChild(txt);

      var sw = el('button', 'switch');
      sw.type = 'button';
      sw.setAttribute('role', 'switch');
      sw.setAttribute('aria-checked', state[p[0]] ? 'true' : 'false');
      sw.setAttribute('aria-label', p[1]);
      sw.addEventListener('ws:toggle', function (e) { state[p[0]] = e.detail.on; summary(); });
      var ctl = el('div', 'lst-x');
      ctl.appendChild(sw);
      row.appendChild(ctl);
      host.appendChild(row);
    });
    window.wsWidgets.boot(host);
    summary();
  }

  function summary() {
    var on = Object.keys(state).filter(function (k) { return state[k]; });
    window.wsWire.setText('consentSummary',
      on.length === 0 ? 'Nothing is switched on. The app works exactly the same.'
        : on.length === 4 ? 'All four are on. You can revoke any of them in Settings, and it stops immediately.'
        : on.length + ' of 4 are on. The rest stay off until you say otherwise.');
  }

  function finish(accepted) {
    db.set('consent', accepted ? Object.assign({}, state)
                               : { ga4: false, amplitude: false, clarity: false, sentry: false });
    ws.toast(accepted ? 'Saved. You can change any of this in Settings.'
                      : 'Nothing was switched on. Nothing will ask again.');
    setTimeout(function () { location.href = 'index.html'; }, 800);
  }

  window.wsPage = {
    init: function () {
      paint();
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        var a = t.dataset.wsAction;
        if (a === 'consentAll') { Object.keys(state).forEach(function (k) { state[k] = true; }); paint(); }
        if (a === 'consentNone') { Object.keys(state).forEach(function (k) { state[k] = false; }); paint(); }
        if (a === 'consentAccept') finish(true);
        if (a === 'consentDecline') finish(false);
      });
    }
  };
})();
