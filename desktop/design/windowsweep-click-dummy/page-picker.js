/* Picker - sections 17, 18, 19 and 23. The one screen whose entire point is
   that NOTHING is chosen for you: --yes never selects here, the default is
   none, and the final question is never auto-answered. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;

  /* D-37 (GATE 4 round 7): 18 and 19 were described the wrong way round against
     this dummy's own seed.js and the engine's catalogue (18 partials, 19 large).
     Both texts had been written about section 19's two faces - its size threshold
     and the installers and archives it finds - and neither about 18. 19 keeps the
     one that names its threshold, the setting Settings controls. 18 takes the
     engine's own description of it (modules/personal.ps1, Invoke-Section18) and
     keeps this dummy's Downloads-only sentence, which is true of both. */
  var META = {
    17: ['Stale build artefacts', 'node_modules, target, .gradle and friends, in projects nothing has touched for months. Rebuilt by the project\u2019s own install or build command.'],
    18: ['Partial downloads', 'Half-finished downloads left behind by browsers and download managers. Only Downloads \u2013 never Desktop, never Documents.'],
    19: ['Large personal files', 'Anything over the size threshold that has not been opened in a long time. These go to the Recycle Bin.'],
    23: ['Orphaned application data', 'AppData folders belonging to programs that are no longer installed. Fails closed: if the registry cannot be read, nothing is offered.']
  };

  /* Home's "Choose items" opens picker.html?section=N (wire.js renderNeeds), and this
     page ignored the parameter, so every card opened section 17. It is read here. */
  var params = new URLSearchParams(location.search);
  var wanted = Number(params.get('section'));
  var current = META[wanted] ? wanted : 17, chosen = {}, search = '';

  /* 2026-09-13 (after GATE 4 round 7): A SECTION NOTHING HAS ASKED YET. In the window
     the engine is the only source of these rows, and it offers a section's candidates
     only once a run has asked about that section - a dry-run of it, which costs
     nothing and deletes nothing. Until then there is no list at all, which is a
     different fact from "asked, and there is nothing here", so it gets different
     words. The seed makes every section asked; picker.html?empty=1 renders the first
     state, the way index.html?empty=1 renders Home before a scan. */
  var asked = {};
  Object.keys(META).forEach(function (id) { asked[id] = params.get('empty') !== '1'; });

  /* With developer mode off the engine skips section 17 outright (modules/runner.ps1,
     the 4/17/20 rule): it offers nothing, and a dry-run of it would ask nothing. Said
     on the section, in the words Elevation already uses for section 20. */
  function skipped(id) { return id === 17 && !db.facts.developer; }

  /* What the engine would offer for a section right now - nothing while it has not
     been asked, or while it is skipped. */
  function offered(id) {
    if (!asked[id] || skipped(id)) return [];
    return S.CANDIDATES.filter(function (c) { return c.section === id; });
  }

  function rows() {
    return offered(current).filter(function (c) {
      if (!search) return true;
      return (c.path + ' ' + (c.project || '')).toLowerCase().indexOf(search) !== -1;
    });
  }

  function emptyRow(title, body, action) {
    var tr0 = el('tr');
    var td0 = el('td');
    td0.colSpan = 5;
    var e = el('div', 'empty');
    e.appendChild(el('h3', null, title));
    e.appendChild(el('p', null, body));
    if (action) e.appendChild(action);
    td0.appendChild(e);
    tr0.appendChild(td0);
    return tr0;
  }

  function paint() {
    var m = META[current];
    window.wsWire.setText('pickSection', String(current));
    window.wsWire.setText('pickTitle', m[0]);
    window.wsWire.setText('pickLede', m[1]);
    window.wsWire.setText('pickOnly', String(current));

    var tb = document.querySelector('[data-ws-pick-rows]');
    if (!tb) return;
    tb.textContent = '';
    var list = rows();

    if (skipped(current)) {
      tb.appendChild(emptyRow('Nothing to choose here',
        'Developer mode is off, so the engine skips this one. Turn it on in Settings first.'));
    } else if (!asked[current]) {
      var ask = el('button', 'btn btn-sm', 'Dry-run');
      ask.type = 'button';
      ask.dataset.wsAction = 'pickAsk';
      tb.appendChild(emptyRow('Nothing has been offered yet.',
        'A dry-run costs nothing and deletes nothing.', ask));
    } else if (!list.length) {
      tb.appendChild(emptyRow(search ? 'Nothing matches that' : 'Nothing to choose here', search
        ? 'Clear the filter and the candidates come back.'
        : 'This section found no candidates on this machine. That is the good outcome, not an error.'));
    }

    list.forEach(function (c) {
      var on = !!chosen[c.path];
      var tr = el('tr');
      tr.setAttribute('data-selected', on ? 'true' : 'false');

      var tdS = el('td');
      var sw = el('button', 'switch');
      sw.type = 'button';
      sw.style.setProperty('--sw-w', 'calc(1.9rem * var(--density))');
      sw.setAttribute('role', 'switch');
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      sw.setAttribute('aria-label', 'Choose ' + c.path);
      sw.addEventListener('ws:toggle', function (e2) {
        if (e2.detail.on) chosen[c.path] = c; else delete chosen[c.path];
        tr.setAttribute('data-selected', e2.detail.on ? 'true' : 'false');
        bar();
      });
      tdS.appendChild(sw);
      tr.appendChild(tdS);

      var tdP = el('td');
      var p = el('div', 'mono t-sm', c.path);
      p.style.cssText = 'max-width:38rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
      tdP.appendChild(p);
      tr.appendChild(tdP);

      tr.appendChild(el('td', 't-sm ink-3', c.project || '—'));
      tr.appendChild(el('td', 'num t-sm ink-3', c.idle + 'd'));
      tr.appendChild(el('td', 'num-cell t-sm accent-ink', fmt.bytes(c.bytes)));
      tb.appendChild(tr);
    });

    window.wsWidgets.boot(tb);
    bar();
  }

  /* The header speaks for the section in view and the bar for the whole selection.
     Both used to read one set of counts: the header printed every chosen row over the
     rows of the section in view, so two rows ticked in 17 read "2 of 2 chosen" over
     section 18. */
  function bar() {
    var keys = Object.keys(chosen);
    var total = keys.reduce(function (a, k) { return a + chosen[k].bytes; }, 0);
    var here = keys.filter(function (k) { return chosen[k].section === current; });
    window.wsWire.setText('pickCount', String(here.length));
    window.wsWire.setText('pickTotal', String(offered(current).length));
    window.wsWire.setText('pickChosen', fmt.bytes(here.reduce(function (a, k) { return a + chosen[k].bytes; }, 0)));
    var b = document.querySelector('[data-ws-pickbar]');
    if (b) b.hidden = keys.length === 0;
    window.wsWire.setText('pickCount2', String(keys.length));
    window.wsWire.setText('pickChosen2', fmt.bytes(total));
    var secs = {};
    keys.forEach(function (k) { secs[chosen[k].section] = 1; });
    window.wsWire.setText('pickWhere', 'across section' + (Object.keys(secs).length > 1 ? 's ' : ' ') +
      Object.keys(secs).join(', '));
    /* D-49: 17's rows are deleted outright whichever mode is chosen. */
    var line17 = document.querySelector('[data-ws-pick-17]');
    if (line17) line17.hidden = !secs[17];
  }

  /* ---- the selection file ---------------------------------------------------
     Read here, in the page, and matched against THIS section's candidates the way the
     engine reads a --select-file (windowsweep.ps1): every line trimmed, blank lines and
     # comments skipped, each compared case-insensitively with the paths on offer
     (lib/ui.ps1, Resolve-SelectedPaths). A match is ticked; a line that matches
     nothing is listed, once, in the engine's own words. Nothing is uploaded - the file
     never leaves the machine, and "Remove these" still carries the selection. */
  var LIMIT = 256 * 1024;
  var IDLE = 'Drop a selection file here, or choose one';
  var zoneState = 'idle', zoneText = IDLE;

  function settle(state, text) {
    zoneState = state;
    zoneText = text;
    var z = document.querySelector('[data-ws-pick-drop]');
    if (z) z.dataset.state = state;
    var tx = document.querySelector('[data-ws-pick-drop-text]');
    if (tx) tx.textContent = text;
  }

  function warn(lines) {
    var box = document.querySelector('[data-ws-pick-warn]');
    var list = document.querySelector('[data-ws-pick-warn-list]');
    if (!box || !list) return;
    list.textContent = '';
    box.hidden = lines.length === 0;
    lines.slice(0, 20).forEach(function (line) {
      var d = el('div', 't-xs', 'No candidate here matches ' + line);
      d.style.overflowWrap = 'anywhere';
      list.appendChild(d);
    });
    if (lines.length > 20) list.appendChild(el('div', 't-xs ink-3', 'and ' + (lines.length - 20) + ' more'));
  }

  function read(file) {
    warn([]);
    if (!file) return;
    if (!/[.](txt|list)$/i.test(file.name)) {
      settle('rejected', file.name + ' is not a .txt or .list file');
      return;
    }
    if (file.size > LIMIT) {
      settle('rejected', 'That file is ' + fmt.bytes(file.size) + ' - the limit is 256 KB');
      return;
    }
    file.text().then(function (text) {
      var lines = text.split(/\r\n|\n|\r/).map(function (l) { return l.trim(); })
        .filter(function (l) { return l && l.charAt(0) !== '#'; });
      var byPath = {};
      offered(current).forEach(function (c) { byPath[c.path.toLowerCase()] = c; });
      var matched = 0, missed = [];
      lines.forEach(function (l) {
        var c = byPath[l.toLowerCase()];
        if (c) { chosen[c.path] = c; matched++; } else if (missed.indexOf(l) === -1) missed.push(l);
      });
      paint();
      settle('done', lines.length + ' path' + (lines.length === 1 ? '' : 's') + ', ' + matched + ' matched');
      warn(missed);
    }, function () { settle('rejected', 'That file could not be read.'); });
  }

  /* The app writes the selection file and opens the Run screen, where the engine's
     own log carries what happened. This dummy has no engine, so the removal goes to
     run.html - the way Sections' "Run selected" does - instead of a toast that
     named a destination 17's rows never reach (D-49). */
  function startRemoval() {
    var go = document.querySelector('[data-ws-action="pickGo"]');
    window.wsWidgets.pending(go, true);
    setTimeout(function () { location.href = 'run.html'; }, 600);
  }

  function choose(id) {
    current = id;
    document.querySelectorAll('[data-ws-pick]').forEach(function (o) {
      o.setAttribute('aria-pressed', Number(o.dataset.wsPick) === current ? 'true' : 'false');
    });
    /* A file's verdict is about the section it was read against. */
    settle('idle', IDLE);
    warn([]);
    paint();
  }

  window.wsPage = {
    init: function () {
      choose(current);
      document.querySelectorAll('[data-ws-pick]').forEach(function (b) {
        b.addEventListener('click', function () { choose(Number(b.dataset.wsPick)); });
      });
      var s = document.querySelector('[data-ws-pick-search]');
      if (s) s.addEventListener('input', function () { search = s.value.trim().toLowerCase(); paint(); });

      /* widgets.js bindDrop paints the dragging state; the zone's words follow it here,
         and a drag that leaves puts back whatever the zone last said. */
      var zone = document.querySelector('[data-ws-pick-drop]');
      if (zone) {
        ['dragenter', 'dragover'].forEach(function (t) {
          zone.addEventListener(t, function () {
            var tx = zone.querySelector('[data-ws-pick-drop-text]');
            if (tx) tx.textContent = 'Release to read it';
          });
        });
        zone.addEventListener('dragleave', function () { settle(zoneState, zoneText); });
        zone.addEventListener('drop', function (e) {
          settle(zoneState, zoneText);
          read(e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files[0] : null);
        });
      }
      var input = document.querySelector('[data-ws-pick-input]');
      if (input) {
        input.addEventListener('change', function () {
          read(input.files ? input.files[0] : null);
          input.value = '';
        });
      }

      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        var a = t.dataset.wsAction;
        if (a === 'pickAsk') {
          window.wsWidgets.pending(t, true);
          setTimeout(function () {
            window.wsWidgets.pending(t, false);
            asked[current] = true;
            paint();
          }, 900);
        }
        if (a === 'pickClear') {
          /* Acknowledged where it happened - every switch goes off and the bar slides
             away - rather than by a toast (the D-28 rule: a result lands at the
             control, and a toast is the fallback). */
          chosen = {};
          paint();
        }
        if (a === 'pickFile') {
          var inp = document.querySelector('[data-ws-pick-input]');
          if (inp) inp.click();
        }
        if (a === 'pickGo') {
          var mode = document.querySelector('input[name="pick-mode"]:checked');
          var n = Object.keys(chosen).length;
          if (!n) return;
          /* D-48 (GATE 4 round 8, decided): Permanent asks first, in the gallery's
             destructive alert dialog. The toast that stood here promised that
             confirmation without providing it. */
          if (mode && mode.value === 'permanent') {
            window.wsWire.setText('pickConfirmTitle', 'Remove ' + n + ' item' + (n === 1 ? '' : 's') +
              ' permanently?');
            window.wsWidgets.openDialog('pick-confirm');
            return;
          }
          startRemoval();
        }
        if (a === 'pickGoPermanent') {
          window.wsWidgets.closeDialog('pick-confirm');
          startRemoval();
        }
      });
    }
  };
})();
