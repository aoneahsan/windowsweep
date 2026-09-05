/* Settings - every control maps to a flag the engine already has, so anything
   set here can also be passed on a command line. The theme axes are NOT
   duplicated here: they live in the one theme control, reachable from the
   title bar on every screen. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;

  /* The ecosystem roster, vendored with THIS project's id dropped. The display
     resolver below filters it again - two layers, so a row added by hand still
     never renders. A project never advertises itself. */
  var SELF = 'windowsweep';
  var ROSTER = [
    { id: 'linux-cleanup', name: 'linux-cleanup', blurb: 'The same idea, one chokepoint and a real dry-run, for Linux.' },
    { id: 'macleanup', name: 'macleanup', blurb: 'And for macOS, with the same section catalogue.' },
    { id: 'native-update', name: 'native-update', blurb: 'Signed over-the-air updates for Capacitor apps.' },
    { id: 'strata-storage', name: 'strata-storage', blurb: 'One storage API over localStorage, IndexedDB, cookies and URL state.' }
  ].filter(function (p) { return p.id !== SELF; });

  function row(title, desc, control, consequence) {
    var r = el('div', 'set-row');
    var t = el('div', 'set-txt');
    t.appendChild(el('h3', null, title));
    t.appendChild(el('p', null, desc));
    if (consequence) {
      var c = el('p', 'set-conseq', consequence);
      c.setAttribute('data-conseq', '');
      t.appendChild(c);
    }
    r.appendChild(t);
    var ctl = el('div', 'set-ctl');
    ctl.appendChild(control);
    r.appendChild(ctl);
    return r;
  }

  function num(value, suffix, onChange) {
    var w = el('div');
    w.style.cssText = 'display:flex;align-items:center;gap:var(--sp-2)';
    var i = el('input', 'field');
    i.type = 'number';
    i.value = String(value);
    i.style.width = '6rem';
    i.addEventListener('change', function () { onChange(Number(i.value)); });
    w.appendChild(i);
    w.appendChild(el('span', 't-sm ink-3', suffix));
    return w;
  }

  function swx(on, label, onToggle) {
    var b = el('button', 'switch');
    b.type = 'button';
    b.setAttribute('role', 'switch');
    b.setAttribute('aria-checked', on ? 'true' : 'false');
    b.setAttribute('aria-label', label);
    b.addEventListener('ws:toggle', function (e) { onToggle(e.detail.on); });
    return b;
  }

  function general() {
    var host = document.querySelector('[data-ws-set-general]');
    if (!host) return;
    var g = el('div', 'set-grp');

    var held = db.derive.heldByDeveloperMode();
    var devRow = row('Developer mode',
      'Keeps package, build and test-runner caches that were used inside the idle window, instead of ' +
      'clearing them completely.',
      swx(db.facts.developer, 'Developer mode', function (on) {
        db.set('developer', on);
        general();
        ws.toast(on ? 'Developer mode on \u2013 recent caches are kept.'
                    : 'Developer mode off \u2013 those caches will be cleared completely.');
      }),
      db.facts.developer
        ? 'Right now that holds back ' + fmt.bytes(db.derive.heldByDeveloperMode()) + '.'
        : 'Nothing is being held back \u2013 every cache is offered in full.');
    g.appendChild(devRow);

    g.appendChild(row('Idle window',
      'A file untouched for longer than this counts as stale. The newest of its write, access and ' +
      'creation times is what is measured.',
      num(db.facts.idleDays, 'days', function (v) {
        db.set('idleDays', v); general();
      }),
      'Maps to --days ' + db.facts.idleDays + '.'));

    g.appendChild(row('Temporary files',
      'A shorter window for %TEMP% and the Windows temp folders, which turn over much faster.',
      num(db.facts.tempDays, 'days', function (v) { db.set('tempDays', v); }),
      'Maps to --temp-days ' + db.facts.tempDays + '.'));

    g.appendChild(row('Large file threshold',
      'What section 18 counts as large enough to offer you.',
      num(500, 'MB', function () {}), 'Maps to --large-mb 500.'));

    g.appendChild(row('Weekly schedule',
      'A Windows Scheduled Task that runs the safe batch, notifies you, and never touches an ' +
      'interactive section.',
      swx(db.facts.schedule, 'Weekly schedule', function (on) {
        db.set('schedule', on);
        ws.toast(on ? 'Scheduled for Sundays at 03:00.' : 'The task was removed.');
      }),
      'Maps to --install-task, which refuses under npx because that cache is evicted.'));

    host.textContent = '';
    host.appendChild(g);
    window.wsWidgets.boot(host);
  }

  function scan() {
    var host = document.querySelector('[data-ws-set-scan]');
    if (!host || host.dataset.built === '1') return;
    host.dataset.built = '1';
    var g = el('div', 'set-grp');

    var roots = el('div', 'tags');
    roots.style.width = 'min(28rem, 100%)';
    ['D:\\work', 'E:\\04-code'].forEach(function (p) {
      var t = el('span', 'tag');
      t.appendChild(el('span', null, p));
      var x = el('button', 'tag-x', '\u00d7');
      x.type = 'button';
      x.setAttribute('aria-label', 'Stop scanning ' + p);
      x.addEventListener('click', function () { t.remove(); });
      t.appendChild(x);
      roots.appendChild(t);
    });
    var ri = el('input', 'tags-in');
    ri.placeholder = 'Add a folder\u2026';
    ri.setAttribute('aria-label', 'Add a folder to scan');
    roots.appendChild(ri);
    g.appendChild(row('Folders to scan for stale artefacts',
      'Section 17 looks only inside these. It never scans a whole drive.', roots,
      'Maps to --scan-roots "D:\\work;E:\\04-code".'));

    var ex = el('div', 'tags');
    ex.style.width = 'min(28rem, 100%)';
    var ei = el('input', 'tags-in');
    ei.placeholder = 'Add a path to never touch\u2026';
    ei.setAttribute('aria-label', 'Add an excluded path');
    ex.appendChild(ei);
    g.appendChild(row('Never touch these',
      'Paths added here are refused everywhere, in every section, in addition to the built-in ' +
      'protected list.', ex, 'Maps to a repeated --exclude-path.'));

    var prot = el('div', 'chipfield');
    S.PROTECTED.slice(0, 10).forEach(function (p) { prot.appendChild(el('span', 'chip mono', p)); });
    var more = el('span', 'chip', '+' + Math.max(0, S.PROTECTED.length - 10) + ' more');
    prot.appendChild(more);
    var d = el('details', 'disclose');
    var sm = el('summary');
    sm.appendChild(el('span', 'disclose-line', 'The built-in protected list, which only ever grows'));
    sm.appendChild(el('span', 'disclose-more', 'Details'));
    d.appendChild(sm);
    var bd = el('div', 'disclose-body');
    bd.appendChild(el('p', null,
      'These are refused regardless of flags, profile or elevation. A target that resolves inside one of ' +
      'them is rejected by the single deletion function rather than trusted, and the self-test asserts ' +
      'that no declared target sits inside a protected path.'));
    bd.appendChild(prot);
    d.appendChild(bd);
    g.appendChild(d);

    host.appendChild(g);
    window.wsWidgets.boot(host);
  }

  function notify() {
    var host = document.querySelector('[data-ws-set-notify]');
    if (!host || host.dataset.built === '1') return;
    host.dataset.built = '1';
    var g = el('div', 'set-grp');
    g.appendChild(row('Tell me when a run finishes',
      'A Windows toast with what was freed. It never changes the exit code and never writes to stdout, ' +
      'so a script driving windowsweep is unaffected.',
      swx(true, 'Notify when a run finishes', function () {}), 'Maps to --notify.'));
    g.appendChild(row('Tell me when the weekly task runs',
      'The same toast, from the scheduled run you were not watching.',
      swx(true, 'Notify for scheduled runs', function () {}), ''));
    g.appendChild(row('Sound',
      'A short sound on completion. Off by default \u2013 a product that beeps unasked gets muted at the ' +
      'operating system and loses the channel for good.',
      swx(false, 'Sound', function () {}), 'Also an axis in the theme panel.'));
    host.appendChild(g);
    window.wsWidgets.boot(host);
  }

  function privacy() {
    var host = document.querySelector('[data-ws-set-priv]');
    if (!host) return;
    host.textContent = '';
    var g = el('div', 'set-grp');
    var c = db.facts.consent || { ga4: false, amplitude: false, clarity: false, sentry: false };

    var note = el('div', 'note note-info');
    note.appendChild(el('span', null, 'i'));
    note.appendChild(el('span', null,
      'The cleanup engine makes zero network calls, and its own test suite asserts that. Everything ' +
      'below is about this desktop window only, and revoking any of it takes effect immediately.'));
    g.appendChild(note);

    [['ga4', 'Product analytics', 'Which screens and which buttons.'],
     ['amplitude', 'Behaviour analytics', 'The same events, kept longer.'],
     ['clarity', 'Session replay', 'This window, with all text masked.'],
     ['sentry', 'Crash reports', 'Stack traces with paths stripped.']].forEach(function (p) {
      g.appendChild(row(p[1], p[2], swx(!!c[p[0]], p[1], function (on) {
        var next = Object.assign({}, db.facts.consent || {});
        next[p[0]] = on;
        db.set('consent', next);
        ws.toast(on ? p[1] + ' is on.' : p[1] + ' is off, from now.');
      }), ''));
    });

    g.appendChild(row('Never sent, by any of them',
      'A file path, a folder name, a drive label, your machine name, your Windows user name, or the ' +
      'contents of anything.', el('span', 'badge badge-ok', 'guaranteed'), ''));
    host.appendChild(g);
    window.wsWidgets.boot(host);
  }

  function about() {
    var host = document.querySelector('[data-ws-set-about]');
    if (!host || host.dataset.built === '1') return;
    host.dataset.built = '1';
    var g = el('div', 'set-grp');

    var v = el('div');
    v.appendChild(el('p', 't-sm', 'Desktop ' + S.APP_VERSION + ' \u00b7 engine ' + S.ENGINE_VERSION +
      ' \u00b7 MIT'));
    v.appendChild(el('p', 't-sm ink-3',
      'The desktop app bundles the engine it was built against, so the two can never disagree about what ' +
      'a section does.'));
    g.appendChild(row('Version', 'What is installed right now.', el('span', 'badge badge-neutral', 'up to date'), ''));
    g.appendChild(v);

    /* House promotions: the roster, self-excluded twice over. */
    var promo = el('div', 'promo');
    ROSTER.filter(function (p) { return p.id !== SELF; }).forEach(function (p) {
      var card = el('div', 'card');
      var bd = el('div', 'card-bd');
      bd.appendChild(el('p', 't-base wide', p.name));
      bd.appendChild(el('p', 't-sm ink-3', p.blurb));
      card.appendChild(bd);
      promo.appendChild(card);
    });
    var h = el('div');
    h.appendChild(el('h3', 't-md wide', 'More from the same developer'));
    h.appendChild(el('p', 't-sm ink-3',
      'These are the developer\u2019s own tools, not an advertising network \u2013 nothing here is sold, ' +
      'tracked or third-party, and windowsweep never appears in its own list.'));
    h.style.marginTop = 'var(--sp-4)';
    g.appendChild(h);
    g.appendChild(promo);

    host.appendChild(g);
  }

  window.wsPage = {
    init: function () {
      general(); privacy();
      /* the hidden panels build on first reveal, so nothing measures a zero box */
      document.querySelectorAll('.tab').forEach(function (t) {
        t.addEventListener('click', function () {
          setTimeout(function () { scan(); notify(); about(); }, 0);
        });
      });
    }
  };
})();
