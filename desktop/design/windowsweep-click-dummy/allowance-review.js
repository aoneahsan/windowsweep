/* Review-only allowance and device recovery states. URL switches do not persist;
   the explicit "new PC" choice stores only the dummy device identifier. */
(function () {
  'use strict';
  var q = new URLSearchParams(location.search);
  var allowance = q.get('allowance');
  var state = q.get('state');
  var deviceOwned = q.get('device') === 'owned' || state === 'deviceOwned';
  var $ = function (selector) { return document.querySelector(selector); };

  function dateNextMonth() {
    var now = new Date();
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' })
      .format(new Date(now.getFullYear(), now.getMonth() + 1, 1));
  }

  function link(text, href, primary) {
    var a = document.createElement('a');
    a.className = primary ? 'btn btn-primary' : 'btn';
    a.href = href;
    a.textContent = text;
    return a;
  }

  function renderAllowance() {
    var band = $('[data-allowance-notice]');
    if (!band || !allowance) return;
    var blocked = allowance === 'deviceLimit' || allowance === 'allLimit';
    var unavailable = allowance === 'offline' || allowance === 'timeout' || allowance === 'serverError';
    if (!blocked && !unavailable) return;
    band.hidden = false;
    var title = $('[data-allowance-title]');
    var body = $('[data-allowance-body]');
    var inline = $('[data-allowance-inline]');
    var actions = $('[data-allowance-actions]');
    var home = location.pathname.endsWith('index.html');
    var start = home ? $('[data-ws-action="reclaim"]') : $('[data-ws-action="runStart"]');
    if (start) start.disabled = true;
    if (blocked) {
      title.textContent = allowance === 'deviceLimit'
        ? 'This machine’s 15 real runs for this month are used.'
        : 'This month’s 30 real runs are used.';
      body.textContent = 'The count starts again on ' + dateNextMonth() + '. Until then, dry-runs and scans carry on, and neither is counted.';
      inline.hidden = false;
      if (allowance === 'deviceLimit') {
        actions.appendChild(document.createTextNode('A Free account has 15 extra runs a month across machines. Sign in to see what remains.'));
        actions.appendChild(link('Sign in with Google', 'account.html', true));
      } else {
        actions.appendChild(document.createTextNode('Pro has no monthly limit.'));
        actions.appendChild(link('See plans', 'plans.html?state=allLimit', true));
      }
    } else {
      title.textContent = 'The account server did not answer.';
      body.textContent = 'Try again when you are online; dry runs stay free.';
      if (inline) inline.hidden = true;
      actions.appendChild(link('Try again', location.pathname.split('/').pop(), true));
    }
    if (!home) actions.appendChild(link('Dry-run first', 'index.html?allowance=' + allowance, false));
  }

  function renderDeviceOwned() {
    var band = $('[data-device-owned]');
    if (!band || !deviceOwned) return;
    band.hidden = false;
    var useNew = band.querySelector('[data-device-new]');
    if (useNew) useNew.addEventListener('click', function () {
      var id = crypto.randomUUID();
      window.ws.store.set('reviewDeviceId', id);
      var status = band.querySelector('[data-device-status]');
      if (status) status.textContent = 'Using this PC as new.';
      useNew.disabled = true;
      var signIn = band.querySelector('[data-device-signin]');
      if (signIn) signIn.disabled = true;
    });
    var signIn = band.querySelector('[data-device-signin]');
    if (signIn) signIn.addEventListener('click', function () {
      if (!window.wsAccountReviewSignIn) return;
      window.wsAccountReviewSignIn();
      var status = band.querySelector('[data-device-status]');
      if (status) status.textContent = 'Signing in…';
      setTimeout(function () { band.hidden = true; }, 1100);
    });
  }

  function boot() { renderAllowance(); renderDeviceOwned(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
