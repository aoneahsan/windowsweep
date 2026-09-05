/* Account - optional Google sign-in, for sync only. Runs are never gated. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, el = ws.el;

  var TEST_EMAIL = 'you@example.com';

  function card() {
    var host = document.querySelector('[data-ws-account-card]');
    if (!host) return;
    host.textContent = '';

    if (!db.facts.signedIn) {
      host.appendChild(el('p', 'caps ink-3', 'Not signed in'));
      host.appendChild(el('h2', 't-lg wide', 'Everything works as it is.'));
      host.appendChild(el('p', 't-base',
        'You are using every feature windowsweep has. Signing in adds one thing: your settings and a ' +
        'summary of each run follow you to another machine.'));
      var b = el('button', 'btn btn-primary btn-lg');
      b.type = 'button';
      b.style.marginTop = 'var(--sp-4)';
      b.appendChild(el('span', null, 'Sign in with Google'));
      b.addEventListener('click', function () {
        window.wsWidgets.pending(b, true);
        setTimeout(function () {
          db.set('signedIn', true);
          db.set('email', TEST_EMAIL);
          card(); sync();
          ws.toast('Signed in. Your settings will sync from now on.', {
            undo: function () { db.set('signedIn', false); db.set('email', null); card(); sync(); }
          });
        }, 1000);
      });
      host.appendChild(b);
      host.appendChild(el('p', 't-sm ink-3',
        'It opens your normal browser, not a window inside this app \u2013 so you can see the address bar ' +
        'and windowsweep never sees your password.'));
      return;
    }

    var row = el('div');
    row.style.cssText = 'display:flex;gap:var(--sp-4);align-items:center;flex-wrap:wrap';
    row.appendChild(el('span', 'ava ava-lg', 'AM'));
    var who = el('div');
    who.appendChild(el('p', 't-md wide', 'Signed in'));
    who.appendChild(el('p', 't-sm ink-3', db.facts.email || TEST_EMAIL));
    row.appendChild(who);
    host.appendChild(row);

    var acts = el('div');
    acts.style.cssText = 'display:flex;gap:var(--sp-2);margin-top:var(--sp-5);flex-wrap:wrap';
    var out = el('button', 'btn');
    out.type = 'button';
    out.textContent = 'Sign out';
    out.addEventListener('click', function () {
      db.set('signedIn', false); db.set('email', null);
      card(); sync();
      ws.toast('Signed out. Everything on this machine stays exactly as it is.');
    });
    var del = el('button', 'btn btn-danger');
    del.type = 'button';
    del.textContent = 'Delete the cloud copy';
    del.addEventListener('click', function () {
      ws.toast('This would delete your synced settings and run summaries. Local history is untouched.',
               { assertive: true });
    });
    acts.appendChild(out); acts.appendChild(del);
    host.appendChild(acts);
  }

  function sync() {
    var host = document.querySelector('[data-ws-sync]');
    if (!host) return;
    host.textContent = '';
    var on = db.facts.signedIn;
    var rows = [
      ['Settings', on ? 'Synced 2 minutes ago' : 'Local only', on],
      ['Run summaries', on ? '3 of 8 runs uploaded \u2013 date, bytes, section count' : 'Local only', on],
      ['Paths, drive labels, machine name', 'Never uploaded, signed in or not', false]
    ];
    rows.forEach(function (r) {
      var i = el('div', 'lst-i');
      var t = el('div');
      t.style.flex = '1';
      t.appendChild(el('div', 't-base', r[0]));
      t.appendChild(el('div', 't-sm ink-3', r[1]));
      i.appendChild(t);
      var x = el('div', 'lst-x');
      x.appendChild(el('span', 'badge ' + (r[2] ? 'badge-ok' : 'badge-neutral'), r[2] ? 'syncing' : 'local'));
      i.appendChild(x);
      host.appendChild(i);
    });
  }

  window.wsPage = { init: function () { card(); sync(); } };
})();
