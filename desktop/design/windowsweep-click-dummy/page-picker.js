/* Picker - sections 17, 18, 19, 23, 26 and 27. The one screen whose entire point is
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
    19: ['Large or old files', 'Downloads first. You can add folders, inspect each result, and choose what goes to the Recycle Bin.'],
    23: ['Orphaned application data', 'AppData folders belonging to programs that are no longer installed. Fails closed: if the registry cannot be read, nothing is offered.'],
    26: ['Uninstall programs you pick', 'Each chosen program runs its own uninstaller. That is permanent. A second list offers any folders it left behind.'],
    27: ['Leftover program folders', 'Folders in Program Files, Common Files and ProgramData that no installed program claims. Needs administrator permission. Chosen folders go to the Recycle Bin.']
  };

  /* Home's "Choose items" opens picker.html?section=N (wire.js renderNeeds), and this
     page ignored the parameter, so every card opened section 17. It is read here. */
  var params = new URLSearchParams(location.search);
  var wanted = Number(params.get('section'));
  var current = META[wanted] ? wanted : 17, chosen = {}, search = '';
  var dataRoots = Array.isArray(db.facts.dataRoots) ? db.facts.dataRoots.filter(function (r) {
    return r === 'D:\\Archive' || r === 'D:\\Media';
  }) : [];
  var dataReason = ['all', 'large', 'old'].indexOf(db.facts.dataReason) !== -1 ? db.facts.dataReason : 'all';
  var dataSort = db.facts.dataSort === 'age' ? 'age' : 'size';
  var scanVersion = 0, scanning = false;

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

  function dataReasonFor(c) {
    var large = c.bytes >= Number(db.facts.largeFileMb) * 1024 * 1024;
    var old = c.idle >= Number(db.facts.idleDays);
    return large && old ? 'both' : large ? 'large' : old ? 'old' : null;
  }

  /* What the engine would offer for a section right now - nothing while it has not
     been asked, or while it is skipped. */
  function offered(id) {
    if (!asked[id] || skipped(id)) return [];
    return S.CANDIDATES.filter(function (c) {
      return c.section === id && (id !== 19 ||
        ((c.root === 'Downloads' || dataRoots.indexOf(c.root) !== -1) && dataReasonFor(c)));
    });
  }

  function rows() {
    return offered(current).filter(function (c) {
      var reason = current === 19 ? dataReasonFor(c) : '';
      if (current === 19 && dataReason !== 'all' && reason !== dataReason && reason !== 'both') return false;
      return !search || (c.path + ' ' + (c.label || c.project || '') + ' ' + reason).toLowerCase().indexOf(search) !== -1;
    }).sort(function (a, b) {
      return current === 19 && dataSort === 'age' ? b.idle - a.idle : b.bytes - a.bytes;
    });
  }

  function paintRoots() {
    var host = document.querySelector('[data-ws-data-roots]');
    if (!host) return;
    host.textContent = '';
    dataRoots.forEach(function (root) {
      var b = el('button', 'btn btn-sm', root + ' ×');
      b.type = 'button';
      b.dataset.wsDataRemove = root;
      b.setAttribute('aria-label', 'Stop scanning ' + root);
      host.appendChild(b);
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
    var scanner = document.querySelector('[data-ws-data-scanner]');
    if (scanner) scanner.hidden = current !== 19;
    var reasonHead = document.querySelector('[data-ws-data-column="reason"]');
    var ageHead = document.querySelector('[data-ws-data-column="age"]');
    if (reasonHead) reasonHead.textContent = current === 19 ? 'Reason' : 'Project';
    if (ageHead) ageHead.textContent = current === 19 ? 'Age' : 'Idle';
    if (current === 19) {
      paintRoots();
      var thresholds = document.querySelector('[data-ws-data-thresholds]');
      if (thresholds) thresholds.textContent = 'Large: ' + db.facts.largeFileMb + ' MB or more. Old: ' + db.facts.idleDays + ' days or more by the timestamp shown on each row. Change the limits in Settings.';
      var files = offered(19), reviewable = files.filter(function (c) { return !c.protected; });
      var sum = reviewable.reduce(function (n, c) { return n + c.bytes; }, 0);
      var summary = document.querySelector('[data-ws-data-summary]');
      if (summary) summary.textContent = asked[19] ?
        reviewable.length + ' reviewable · ' + fmt.bytes(sum) + ' measured · ' + (files.length - reviewable.length) + ' refused' :
        'No files measured for this folder scope yet.';
      document.querySelectorAll('[data-ws-data-reason]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.wsDataReason === dataReason ? 'true' : 'false');
      });
      var sort = document.querySelector('[data-ws-data-sort]');
      if (sort) sort.value = dataSort;
    }

    var tb = document.querySelector('[data-ws-pick-rows]');
    if (!tb) return;
    tb.textContent = '';
    var list = rows();

    if (skipped(current)) {
      tb.appendChild(emptyRow('Nothing to choose here',
        'Developer mode is off, so the engine skips this one. Turn it on in Settings first.'));
    } else if (!asked[current]) {
      if (current === 19) {
        tb.appendChild(emptyRow('This folder scope has not been scanned.',
          'Use Scan these folders above to measure files. Nothing is selected or removed by a scan.'));
      } else {
        var ask = el('button', 'btn btn-sm', 'Dry-run');
        ask.type = 'button';
        ask.dataset.wsAction = 'pickAsk';
        tb.appendChild(emptyRow('Nothing has been offered yet.',
          'A dry-run costs nothing and deletes nothing.', ask));
      }
    } else if (!list.length) {
      tb.appendChild(emptyRow(search || current === 19 && dataReason !== 'all' ? 'Nothing matches that' : 'Nothing to choose here',
        search || current === 19 && dataReason !== 'all' ? 'Clear the path or reason filter to see the other results.'
          : 'This section found no candidates on this machine. That is the good outcome, not an error.'));
    }

    list.forEach(function (c) {
      var on = !!chosen[c.path];
      var tr = el('tr');
      tr.setAttribute('data-selected', on ? 'true' : 'false');

      var tdS = el('td');
      if (!c.protected) {
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
      } else {
        var refused = el('span', 'badge badge-outline', 'Refused');
        refused.title = c.protected;
        tdS.appendChild(refused);
      }
      tr.appendChild(tdS);

      var tdP = el('td');
      var p = el('div', 'mono t-sm', c.path);
      p.style.cssText = 'max-width:38rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
      tdP.appendChild(p);
      if (current === 19) {
        var detail = el('p', 't-xs ink-3', 'Root: ' + c.root + ' · ' + c.idle + ' days since last ' + c.basis + (c.protected ? ' · ' + c.protected : ''));
        detail.style.marginTop = 'var(--sp-1)';
        tdP.appendChild(detail);
      }
      tr.appendChild(tdP);

      var reason = current === 19 ? dataReasonFor(c) : '';
      tr.appendChild(el('td', 't-sm ink-3', current === 19 ?
        (reason === 'both' ? 'Large + old' : reason === 'large' ? 'Large' : 'Old') : (c.label || c.project || '—')));
      tr.appendChild(el('td', 'num t-sm ink-3', c.idle < 0 ? '—' : c.idle + 'd'));
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
    window.wsWire.setText('pickTotal', String(offered(current).filter(function (c) { return !c.protected; }).length));
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
    var line26 = document.querySelector('[data-ws-pick-26]');
    if (line26) line26.hidden = !secs[26];
    var line27 = document.querySelector('[data-ws-pick-27]');
    if (line27) line27.hidden = !secs[27];
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
      offered(current).forEach(function (c) { if (!c.protected) byPath[c.path.toLowerCase()] = c; });
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

  function scanStatus(message) {
    var status = document.querySelector('[data-ws-data-status]');
    if (status) status.textContent = message;
  }

  function rootsChanged() {
    scanVersion++;
    scanning = false;
    window.wsWidgets.pending(document.querySelector('[data-ws-action="dataScan"]'), false);
    Object.keys(chosen).forEach(function (path) {
      var c = chosen[path];
      if (c.section === 19) delete chosen[path];
    });
    db.set('dataRoots', dataRoots.slice());
    asked[19] = false;
    scanStatus('Folder scope changed. Scan these folders to see current results.');
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
      var sort = document.querySelector('[data-ws-data-sort]');
      if (sort) sort.addEventListener('change', function () {
        dataSort = sort.value === 'age' ? 'age' : 'size';
        db.set('dataSort', dataSort);
        paint();
      });

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
        var reason = e.target.closest('[data-ws-data-reason]');
        if (reason) {
          dataReason = reason.dataset.wsDataReason;
          db.set('dataReason', dataReason);
          paint();
          return;
        }
        var addRoot = e.target.closest('[data-ws-data-folder]');
        if (addRoot) {
          var root = addRoot.dataset.wsDataFolder;
          window.wsWidgets.closeDialog('data-folder-dialog');
          if (dataRoots.indexOf(root) === -1) {
            dataRoots.push(root);
            rootsChanged();
          } else scanStatus(root + ' is already in the scan.');
          return;
        }
        var removeRoot = e.target.closest('[data-ws-data-remove]');
        if (removeRoot) {
          dataRoots = dataRoots.filter(function (r) { return r !== removeRoot.dataset.wsDataRemove; });
          rootsChanged();
          return;
        }
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
        if (a === 'dataAddFolder') window.wsWidgets.openDialog('data-folder-dialog');
        if (a === 'dataScan') {
          if (scanning) return;
          scanning = true;
          var version = ++scanVersion;
          Object.keys(chosen).forEach(function (path) { if (chosen[path].section === 19) delete chosen[path]; });
          asked[19] = false;
          paint();
          window.wsWidgets.pending(t, true);
          scanStatus('Scanning Downloads' + (dataRoots.length ? ' and ' + dataRoots.length + ' added folder' + (dataRoots.length === 1 ? '' : 's') : '') + '…');
          setTimeout(function () {
            if (version !== scanVersion) return;
            scanning = false;
            window.wsWidgets.pending(t, false);
            asked[19] = true;
            paint();
            scanStatus(offered(19).length + ' sample results measured. Choose files one by one.');
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
