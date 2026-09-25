/* Account - optional Google sign-in, for sync only. Runs are never gated. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;

  var TEST_EMAIL = 'you@example.com';

  /* ---- The run summaries the account holds (TASK-013, 2026-09-24) ---------------
     demo-data: the newest three of seed.js RUNS are this machine's uploads - so the
     Sync band reads "3 of 8 runs uploaded" - plus the two laptop rows history.html
     draws. A stored summary carries no mode words and no machine name, so a row reads
     the way History's cloud row does: date, mode badge, section count, bytes. */
  var PAGE = 20, DAY = 864e5, cloud = null, shown = PAGE;

  function seedCloud() {
    var mine = S.RUNS.slice(-3).map(function (r) {
      return { at: r.at, freed: r.freed, sections: r.sections, dry: false, here: true };
    });
    var laptop = [
      { at: new Date(Date.now() - 4 * DAY), freed: 8.4e9, sections: 9, dry: false, here: false },
      { at: new Date(Date.now() - 21 * DAY), freed: 2.2e9, sections: 4, dry: false, here: false }
    ];
    return mine.concat(laptop).sort(function (a, b) { return b.at - a.at; });
  }

  /* What the account holds right now: nothing while signed out. */
  function cloudRows() {
    if (!db.facts.signedIn) { cloud = null; shown = PAGE; return []; }
    if (!cloud) cloud = seedCloud();
    return cloud;
  }

  /* The two stamps History prints (page-history.js): local calendar days, and the
     local minute a report file name carries. */
  function relDay(d) {
    var midnight = function (t) { var x = new Date(t); return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(); };
    var days = Math.max(0, Math.round((midnight(Date.now()) - midnight(d.getTime())) / DAY));
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return days + ' days ago';
    var months = Math.round(days / 30);
    return months + (months === 1 ? ' month ago' : ' months ago');
  }
  function exact(d) {
    var two = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()) + ' ' +
      two(d.getHours()) + ':' + two(d.getMinutes());
  }

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
          card(); sync(); runs(); deleteBand();
          ws.toast('Signed in. Your settings will sync from now on.', {
            undo: function () {
              db.set('signedIn', false); db.set('email', null); card(); sync(); runs(); deleteBand();
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
      card(); sync(); runs(); deleteBand();
      ws.toast('Signed out. Everything on this machine stays exactly as it is.');
    });
    /* 🔴 "Delete the cloud copy" stood here and did nothing but describe itself in a
       toast. It is now a real control in its own band (account.html), because the
       thing it deletes is the ACCOUNT - not a copy of anything - and a destructive
       action that irreversible does not belong beside Sign out as a second button of
       equal weight, with no confirmation between the pointer and the deletion. */
    acts.appendChild(out);
    host.appendChild(acts);
    /* D-38 (GATE 4 round 7): the app carries this sentence under Sign out, and the
       dummy owns the words - so it is written here. Since 2026-09-13 it is exact:
       sign-out is scope 'local', so it ends this machine's session and never the
       same person's session on the website, which shares the account. */
    var note = el('p', 't-sm ink-3',
      'Signing out clears every local trace of the account, including the rows cached from your other machines.');
    note.style.marginTop = 'var(--sp-3)';
    host.appendChild(note);
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
          card(); sync(); runs(); deleteBand();
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
    /* "3 of 8": this machine's runs the account holds, of the runs this machine made -
       so removing one of them below moves the count, where it is read. */
    var up = cloudRows().filter(function (r) { return r.here; }).length;
    var rows = [
      ['Settings', on ? 'Synced 2 minutes ago' : 'Local only', on],
      ['Run summaries', on ? up + ' of ' + S.RUNS.length + ' runs uploaded \u2013 date, bytes, section count' : 'Local only', on],
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

  /* The list: twenty a page with a cursor, as History pages. "Load 20 more" goes inert
     once every row is drawn, and the count beside it - a polite live region - is the
     reason and the answer. Remove answers AT its control (pending, then the row goes),
     and the count changes where the person is looking: no toast. */
  function runs() {
    var box = document.querySelector('[data-ws-cloud-runs]');
    if (!box) return;
    var list = cloudRows();
    box.hidden = !db.facts.signedIn || !list.length;
    var tb = box.querySelector('[data-ws-cloud-rows]');
    if (!tb) return;
    tb.textContent = '';
    list.slice(0, shown).forEach(function (r, i) {
      var tr = el('tr');
      var when = el('td');
      when.id = 'cloud-when-' + i;
      when.appendChild(el('div', 't-sm', relDay(r.at)));
      when.appendChild(el('div', 't-xs ink-3', exact(r.at)));
      tr.appendChild(when);

      var md = el('td');
      md.appendChild(el('span', 'badge ' + (r.dry ? 'badge-outline' : 'badge-neutral'), r.dry ? 'dry-run' : 'real run'));
      tr.appendChild(md);

      var sec = el('td'), s = el('div');
      s.style.cssText = 'display:flex;align-items:center;gap:var(--sp-2);flex-wrap:wrap';
      s.appendChild(el('span', 't-sm ink-3', r.sections + (r.sections === 1 ? ' section' : ' sections')));
      s.appendChild(el('span', 'badge badge-outline', 'summary only'));
      sec.appendChild(s);
      tr.appendChild(sec);

      var fr = el('td', 'num-cell t-sm');
      fr.textContent = fmt.bytes(r.freed);
      if (!r.dry) fr.classList.add('accent-ink');
      tr.appendChild(fr);

      var op = el('td');
      var b = el('button', 'btn btn-sm btn-ghost');
      b.type = 'button';
      b.appendChild(el('span', 'btn-label', 'Remove'));
      /* five identical names are told apart by the row's own When */
      b.setAttribute('aria-describedby', when.id);
      b.addEventListener('click', function () { remove(r, i, b); });
      op.appendChild(b);
      tr.appendChild(op);
      tb.appendChild(tr);
    });

    var more = box.querySelector('[data-ws-action="cloudMore"]');
    if (more) {
      if (shown >= list.length) { more.setAttribute('aria-disabled', 'true'); more.setAttribute('data-disabled', ''); }
      else { more.removeAttribute('aria-disabled'); more.removeAttribute('data-disabled'); }
    }
    window.wsWire.setText('cloudShown', String(Math.min(shown, list.length)));
    window.wsWire.setText('cloudAll', String(list.length));
  }

  /* Focus stays in the list: the row that took this one's place, else the one above,
     else the band's heading when the last row goes - never dropped to the top. */
  function remove(r, i, b) {
    if (b.dataset.state === 'pending') return;
    window.wsWidgets.pending(b, true);
    setTimeout(function () {
      var had = document.activeElement === b;
      cloud.splice(cloud.indexOf(r), 1);
      sync(); runs();
      if (!had) return;
      var left = document.querySelectorAll('[data-ws-cloud-rows] button');
      var next = left[Math.min(i, left.length - 1)];
      if (next) { next.focus(); return; }
      var head = document.querySelector('[data-ws-sync-title]');
      if (head) head.focus();
    }, 600);
  }

  window.wsPage = {
    init: function () {
      card(); sync(); runs(); deleteBand();
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action="cloudMore"]');
        if (!t || t.getAttribute('aria-disabled') === 'true') return;
        shown += PAGE;
        runs();
      });
    }
  };
})();
