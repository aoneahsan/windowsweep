/* Account - optional Google sign-in, for sync only. Runs are never gated.

   The states TASK-013's sync adds (2026-09-25, D39-D42) are reachable by URL, the way
   index.html?empty=1 is, because none of them is something a reviewer can make a real
   account do. Each one signs the prototype in if it is not already:
     ?replaced=1                  the account held newer settings and they replaced this
                                  machine's - the notice and its Undo (SY-03). D41: only
                                  once a synced setting has been changed here; on untouched
                                  settings the account's are taken without a word.
     ?fail=settingsRead           a settings read that failed (SY-02a)
     ?fail=settingsWrite          a settings write that failed (SY-02a)
     ?pending=1  ?pending=3       run summaries kept to try again (SY-02b, both plural forms)
     ?fail=list                   the account's run summaries could not be read (SY-02c)
     ?fail=listMore               the next page could not be read - the first press; the
                                  next one works (SY-02c)
     ?fail=remove                 a Remove the account did not confirm - each row's first
                                  press; the next one works (SY-02d, D39)
   The empty list (SY-01) is reached by acting: Remove every row. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;

  var TEST_EMAIL = 'you@example.com';
  var Q = new URLSearchParams(location.search);
  var FAIL = Q.get('fail');
  var PENDING = Math.max(0, parseInt(Q.get('pending') || '0', 10) || 0);

  /* ---- The run summaries the account holds (TASK-013, 2026-09-24) ---------------
     demo-data: the newest three of seed.js RUNS are this machine's uploads - so the
     Sync band reads "3 of 8 runs uploaded" - plus the two laptop rows history.html
     draws. A stored summary carries no mode words and no machine name, so a row reads
     the way History's cloud row does: date, mode badge, section count, bytes.
     Each row has an id, and a Remove is remembered (`cloudRemoved`), because it is the
     account's row that goes: History stops drawing a removed laptop row too. */
  var PAGE = 20, DAY = 864e5, cloud = null, shown = PAGE;
  /* D39: a Remove the account did not confirm keeps its row, and says so under it. */
  var removeFailed = {}, refusedOnce = {}, moreRefused = false;

  function seedCloud() {
    var mine = S.RUNS.slice(-3).map(function (r, i) {
      return { id: 'here-' + i, at: r.at, freed: r.freed, sections: r.sections, dry: false, here: true };
    });
    var laptop = [
      { id: 'laptop-4', at: new Date(Date.now() - 4 * DAY), freed: 8.4e9, sections: 9, dry: false, here: false },
      { id: 'laptop-21', at: new Date(Date.now() - 21 * DAY), freed: 2.2e9, sections: 4, dry: false, here: false }
    ];
    /* ?fail=listMore needs a second page to fail on: twenty older laptop rows. */
    if (FAIL === 'listMore') {
      for (var k = 0; k < 20; k++) {
        laptop.push({ id: 'laptop-old-' + k, at: new Date(Date.now() - (40 + k * 6) * DAY),
                      freed: (1 + (k % 5)) * 1.3e9, sections: 6 + (k % 4), dry: false, here: false });
      }
    }
    var gone = db.facts.cloudRemoved || [];
    return mine.concat(laptop)
      .filter(function (r) { return gone.indexOf(r.id) === -1; })
      .sort(function (a, b) { return b.at - a.at; });
  }

  /* What the account holds right now: nothing while signed out. A list read that fails
     (?fail=list) hides the rows, never the count above them - the window counts this
     machine's uploads from its own record, not from the list. */
  function cloudRows() {
    if (!db.facts.signedIn) { cloud = null; shown = PAGE; return []; }
    if (!cloud) cloud = seedCloud();
    return cloud;
  }

  function signInQuietly() {
    if (db.facts.signedIn) return;
    db.set('signedIn', true);
    db.set('email', TEST_EMAIL);
  }

  /* ---- D40: the account's newer settings replaced this machine's ------------------
     The window keeps this in memory only, so closing it ends the notice. The prototype
     keeps it in its store - this dummy's stand-in for "the window is still open" as you
     move between screens; Reset prototype is closing it. It ends at the next settings
     change on any screen (Home's switch or slider, a Settings row, the theme panel), at
     Undo, which is one, and at sign-out. A change is found by comparing every setting
     with the snapshot taken when the notice began. index.html reads the same record. */
  function settingsNow() {
    return JSON.stringify([db.facts.developer, db.facts.idleDays, db.facts.tempDays,
      db.facts.largeFileMb, ws.store.get('prefs', {})]);
  }
  function standingNotice() {
    var n = db.facts.settingsReplaced;
    if (!n) return null;
    if (!db.facts.signedIn || n.after !== settingsNow()) { db.set('settingsReplaced', null); return null; }
    return n;
  }
  /* D41: settings nobody chose here - developer mode as it ships, every axis at its
     default - are a fresh machine taking what "So a second machine starts where you left
     off" promises, so they are replaced without a notice. */
  function untouched() {
    var prefs = ws.store.get('prefs', {}) || {};
    return db.facts.developer === true && ws.AXES.every(function (a) {
      var v = prefs[a.key];
      return v === undefined || v === a.def || !a.values.some(function (x) { return x.v === v; });
    });
  }
  /* ?replaced=1 - what a launch finds when another machine chose later: the account's
     row wins and is applied (here, developer mode the other way round, so a value really
     differs - D42 draws nothing), and this machine's side is kept for the Undo. A second
     replacement while one stands keeps the first, so Undo still puts this machine's own
     settings back. */
  function replaceFromAccount() {
    signInQuietly();
    if (standingNotice()) return;
    var mine = { developer: db.facts.developer };
    var fresh = untouched();
    db.set('developer', !mine.developer);
    if (fresh) return;
    db.set('settingsReplaced', { back: mine, after: settingsNow() });
  }
  /* Undo puts this machine's settings back as a change made here - dated now and sent -
     so it ends the notice. The control leaves with it, so focus goes to the band's
     heading rather than to the top of the page. */
  function undo() {
    var n = standingNotice();
    if (!n) return;
    db.set('settingsReplaced', null);
    db.set('developer', n.back.developer);
    sync();
    var head = document.querySelector('[data-ws-sync-title]');
    if (head) head.focus();
  }
  function recheck() {
    if (db.facts.settingsReplaced && !standingNotice()) sync();
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

  function signedOutEverywhere() {
    db.set('signedIn', false); db.set('email', null);
    /* sign-out ends the notice (D40) - the record is the account's */
    db.set('settingsReplaced', null);
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
              signedOutEverywhere(); card(); sync(); runs(); deleteBand();
            }
          });
        }, 1000);
      });
      host.appendChild(b);
      host.appendChild(el('p', 't-sm ink-3',
        'It opens your normal browser, not a window inside this app – so you can see the address bar ' +
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
      signedOutEverywhere();
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
          signedOutEverywhere();
          field.value = '';
          card(); sync(); runs(); deleteBand();
          ws.toast('Your account is gone, and you are signed out here. Nothing on this PC changed.',
                   { assertive: true });
        }, 900);
      });
    }
    go.disabled = field.value.trim() !== 'delete';
  }

  /* One row of the band, and under it the row's second line when there is one. The
     line's live region is always there - so a line that lands while this screen is open
     is announced - and an Undo sits beside it, outside it. */
  function syncRow(host, title, line, on, second) {
    var i = el('div', 'lst-i');
    var t = el('div');
    t.style.flex = '1';
    t.appendChild(el('div', 't-base', title));
    t.appendChild(el('div', 't-sm ink-3', line));
    var more = el('div');
    more.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:var(--sp-2)';
    var said = el('div', 't-sm');
    said.setAttribute('role', 'status');
    more.appendChild(said);
    if (second) {
      more.style.marginTop = 'var(--sp-2)';
      said.textContent = second.text;
      if (second.undo) {
        said.id = 'sync-replaced';
        var u = el('button', 'btn btn-sm');
        u.type = 'button';
        /* the notice is this button's description, the way a Remove's is its row's When */
        u.setAttribute('aria-describedby', 'sync-replaced');
        u.appendChild(el('span', 'btn-label', 'Undo'));
        u.addEventListener('click', undo);
        more.appendChild(u);
      }
    }
    t.appendChild(more);
    i.appendChild(t);
    var x = el('div', 'lst-x');
    x.appendChild(el('span', 'badge ' + (on ? 'badge-ok' : 'badge-neutral'), on ? 'syncing' : 'local'));
    i.appendChild(x);
    host.appendChild(i);
  }

  function sync() {
    var host = document.querySelector('[data-ws-sync]');
    if (!host) return;
    host.textContent = '';
    var on = db.facts.signedIn;
    /* "3 of 8": this machine's runs the account holds, of the runs this machine made -
       so removing one of them below moves the count, where it is read. */
    var up = cloudRows().filter(function (r) { return r.here; }).length;
    var notice = on ? standingNotice() : null;

    /* SY-02a: one second line at a time, and the notice goes first - it carries the Undo.
       A read that failed at launch leaves the row "Local only"; a write that failed after
       an earlier round-trip leaves its last time standing. */
    var settingsLine = on ? 'Synced 2 minutes ago' : 'Local only';
    var settingsOn = on;
    var second = null;
    if (notice) {
      second = { text: 'Your account held newer settings, so they replaced this machine’s.', undo: true };
    } else if (on && FAIL === 'settingsRead') {
      settingsLine = 'Local only'; settingsOn = false;
      second = { text: 'Your account’s settings could not be read, so this machine keeps its own. ' +
                       'windowsweep tries again the next time it starts.' };
    } else if (on && FAIL === 'settingsWrite') {
      settingsLine = 'Synced 12 minutes ago';
      second = { text: 'Your latest settings have not reached your account. On this machine they stay ' +
                       'exactly as they are, and windowsweep tries again the next time it starts.' };
    }
    syncRow(host, 'Settings', settingsLine, settingsOn, second);

    /* SY-02b: the one failure that writes something - the summary kept to try again. */
    var waiting = null;
    if (on && PENDING === 1) {
      waiting = { text: 'One run summary has not reached your account. windowsweep keeps it on this machine ' +
                        'and tries again the next time it starts.' };
    } else if (on && PENDING > 1) {
      waiting = { text: PENDING + ' run summaries have not reached your account. windowsweep keeps them on ' +
                        'this machine and tries again the next time it starts.' };
    }
    syncRow(host, 'Run summaries',
      on ? up + ' of ' + S.RUNS.length + ' runs uploaded – date, bytes, section count' : 'Local only', on, waiting);
    syncRow(host, 'Paths, drive labels, machine name', 'Never uploaded, signed in or not', false, null);
  }

  /* SY-02d, under the row that failed: announced, because the person has just acted. */
  function removeFailedRow() {
    var tr = el('tr');
    tr.setAttribute('data-ws-remove-failed', '');
    var td = el('td');
    td.colSpan = 5;
    var n = el('div', 'note note-warn');
    n.setAttribute('role', 'alert');
    n.appendChild(el('span', null, '!')).setAttribute('aria-hidden', 'true');
    n.appendChild(el('span', 't-sm', 'windowsweep could not confirm that this run summary was removed, so it ' +
      'stays in the list. Nothing on this machine changed, and you can press Remove again.'));
    td.appendChild(n);
    tr.appendChild(td);
    return tr;
  }

  /* The list: twenty a page with a cursor, as History pages. "Load 20 more" goes inert
     once every row is drawn, and the count beside it - a polite live region - is the
     reason and the answer. Remove answers AT its control (pending, then the row goes),
     and the count changes where the person is looking: no toast.
     Three states while signed in: the rows (with SY-06 above them), SY-01 when the
     account holds none, SY-02c when the first read failed. */
  function runs() {
    var box = document.querySelector('[data-ws-cloud-runs]');
    if (!box) return;
    var failed = db.facts.signedIn && FAIL === 'list';
    var list = failed ? [] : cloudRows();
    box.hidden = !db.facts.signedIn;
    var show = function (sel, visible) { var n = box.querySelector(sel); if (n) n.hidden = !visible; };
    show('[data-ws-cloud-failed]', failed);
    show('[data-ws-cloud-empty]', !failed && list.length === 0);
    show('[data-ws-cloud-note]', !failed && list.length > 0);
    show('[data-ws-cloud-list]', !failed && list.length > 0);
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
      /* five identical names are told apart by the row's own When, and every one is
         told what it does by the line above the table (SY-06) */
      b.setAttribute('aria-describedby', when.id + ' cloud-remove-note');
      b.addEventListener('click', function () { remove(r, i, b); });
      op.appendChild(b);
      tr.appendChild(op);
      tb.appendChild(tr);
      if (removeFailed[r.id]) tb.appendChild(removeFailedRow());
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
     else the band's heading when the last row goes - never dropped to the top.
     D39: a Remove the account did not confirm keeps its row and says so under it; the
     line goes with that row's next press, and nothing is queued. */
  function remove(r, i, b) {
    if (b.dataset.state === 'pending') return;
    var tr = b.closest('tr');
    var said = tr && tr.nextElementSibling;
    if (said && said.hasAttribute('data-ws-remove-failed')) said.remove();
    delete removeFailed[r.id];
    window.wsWidgets.pending(b, true);
    setTimeout(function () {
      window.wsWidgets.pending(b, false);
      if (FAIL === 'remove' && !refusedOnce[r.id]) {
        refusedOnce[r.id] = true;
        removeFailed[r.id] = true;
        if (tr) tr.after(removeFailedRow());
        return;
      }
      var had = document.activeElement === b;
      cloud.splice(cloud.indexOf(r), 1);
      db.set('cloudRemoved', (db.facts.cloudRemoved || []).concat([r.id]));
      sync(); runs();
      if (!had) return;
      var left = document.querySelectorAll('[data-ws-cloud-rows] button');
      var next = left[Math.min(i, left.length - 1)];
      if (next) { next.focus(); return; }
      var head = document.querySelector('[data-ws-sync-title]');
      if (head) head.focus();
    }, 600);
  }

  /* In the window this press is a network read, so it goes pending; ?fail=listMore
     refuses the first one, and the line beside the button says what to do. */
  function loadMore(t) {
    var line = document.querySelector('[data-ws-cloud-more-failed]');
    if (line) line.hidden = true;
    window.wsWidgets.pending(t, true);
    setTimeout(function () {
      window.wsWidgets.pending(t, false);
      if (FAIL === 'listMore' && !moreRefused) {
        moreRefused = true;
        if (line) line.hidden = false;
        return;
      }
      shown += PAGE;
      runs();
    }, 600);
  }

  window.wsPage = {
    init: function () {
      if (Q.get('replaced') === '1') replaceFromAccount();
      else if (FAIL || PENDING > 0) signInQuietly();
      card(); sync(); runs(); deleteBand();
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action="cloudMore"]');
        if (!t || t.getAttribute('aria-disabled') === 'true' || t.dataset.state === 'pending') return;
        loadMore(t);
      });
      /* A setting changed on this screen - the theme panel opens from the title bar -
         ends a standing notice (D40). */
      ['click', 'change'].forEach(function (type) {
        document.addEventListener(type, function () { setTimeout(recheck, 0); });
      });
    }
  };
})();
