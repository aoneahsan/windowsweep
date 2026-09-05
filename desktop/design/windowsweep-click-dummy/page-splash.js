/* Splash - the boot and update gate. The one screen with no rail: nothing here
   is navigable, so offering navigation would be a lie about what is ready. */
(function () {
  'use strict';
  var ws = window.ws, el = ws.el;

  var STEPS = [
    ['Starting the engine\u2026', 18],
    ['Reading the catalogue - 26 sections', 46],
    ['Checking for a newer build\u2026', 78],
    ['Ready', 100]
  ];

  window.wsPage = {
    init: function () {
      var fill = document.querySelector('[data-ws-boot-fill]');
      var panel = document.querySelector('[data-ws-update]');
      var fail = document.querySelector('[data-ws-boot-fail]');
      var reduced = ws.prefersReducedMotion();
      /* Read the branch BEFORE the sequence starts. Setting it afterwards let the
         final step unhide the update panel again, so the offline run claimed both
         "could not reach the network" and "version 1.2.0 is ready" at once. */
      var offline = new URLSearchParams(location.search).get('offline') === '1';
      var i = 0;

      function step() {
        if (i >= STEPS.length) {
          /* The update gate appears only after the engine is ready, never before:
             an update prompt over a half-started app is the wrong first thing.
             And there is no update to offer if the check never completed. */
          if (offline) { if (fail) fail.hidden = false; return; }
          if (panel) panel.hidden = false;
          return;
        }
        window.wsWire.setText('bootStep', STEPS[i][0]);
        if (fill) fill.style.width = STEPS[i][1] + '%';
        i++;
        setTimeout(step, reduced ? 120 : 620);
      }
      step();

      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        var a = t.dataset.wsAction;

        if (a === 'updateLater') {
          if (panel) panel.hidden = true;
          ws.toast('It will install the next time you close windowsweep.');
          setTimeout(function () { location.href = 'index.html'; }, 700);
        }
        if (a === 'updateNow') {
          var bar = document.querySelector('[data-ws-dl]');
          var bf = document.querySelector('[data-ws-dl-fill]');
          if (bar) bar.hidden = false;
          window.wsWidgets.pending(t, true);
          var p = 0;
          var iv = setInterval(function () {
            p += reduced ? 34 : 11;
            if (bf) bf.style.width = Math.min(100, p) + '%';
            if (p >= 100) {
              clearInterval(iv);
              window.wsWidgets.pending(t, false);
              ws.toast('Downloaded and verified. This is a design prototype, so nothing restarts.');
            }
          }, reduced ? 120 : 180);
        }
        if (a === 'bootRetry') {
          if (fail) fail.hidden = true;
          ws.toast('Checked again - still offline. Carrying on without it.');
        }
      });

      /* The offline branch is a real state, so it is reachable rather than
         described: splash.html?offline=1 renders it. It is handled inside step()
         above, at the point the check would have completed. */
      if (offline) STEPS[2][0] = 'Checking for a newer build… no answer';
    }
  };
})();
