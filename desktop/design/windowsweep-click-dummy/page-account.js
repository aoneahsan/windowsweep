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
          card(); sync(); deleteBand();
          ws.toast('Signed in. Your settings will sync from now on.', {
            undo: function () {
              db.set('signedIn', false); db.set('email', null); card(); sync(); deleteBand();
            }
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
      card(); sync(); deleteBand();
      ws.toast('Signed out. Everything on this machine stays exactly as it is.');
    });
    /* 🔴 "Delete the cloud copy" stood here and did nothing but describe itself in a
       toast. It is now a real control in its own band (account.html), because the
       thing it deletes is the ACCOUNT - not a copy of anything - and a destructive
       action that irreversible does not belong beside Sign out as a second button of
       equal weight, with no confirmation between the pointer and the deletion. */
    acts.appendChild(out);
    host.appendChild(acts);
  }

  /* The deletion band: shown only while signed in, and armed only by the typed word.
     🔴 The comparison is against the trimmed value and is case-sensitive, which is
     what "it must match exactly" on the label promises. A control that accepted
     "Delete" would make the label a lie in the least useful direction. */
  function deleteBand() {
    var band = document.querySelector('[data-ws-delete]');
    if (!band) return;
    band.hidden = !db.facts.signedIn;
    var field = band.querySelector('[data-ws-delete-field]');
    var go = band.querySelector('[data-ws-delete-go]');
    if (!field || !go) return;
    if (!db.facts.signedIn) { field.value = ''; go.disabled = true; return; }
    if (field.dataset.wsBound !== 'true') {
      field.dataset.wsBound = 'true';
      field.addEventListener('input', function () {
        go.disabled = field.value.trim() !== 'delete';
      });
      go.addEventListener('click', function () {
        window.wsWidgets.pending(go, true);
        setTimeout(function () {
          window.wsWidgets.pending(go, false);
          db.set('signedIn', false); db.set('email', null);
          field.value = '';
          card(); sync(); deleteBand();
          ws.toast('Your account is gone, and you are signed out here. Nothing on this PC changed.',
                   { assertive: true });
        }, 900);
      });
    }
    go.disabled = field.value.trim() !== 'delete';
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

  window.wsPage = { init: function () { card(); sync(); deleteBand(); } };
})();
