/* Picker - sections 17-19, 23, 26 and 27 (what goes) and, from 1.5.0, 30-32 (what is
   installed: picker-install.js; the columns of each: picker-columns.js). The one screen
   whose entire point is that NOTHING is chosen for you: --yes never selects here, the
   default is none, and the final question is never auto-answered. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;
  var cols = window.wsPickCols, inst = window.wsPickInstall;

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
    26: ['Uninstall programs and Store apps you pick', 'Desktop programs run their own uninstallers, one at a time; Store apps are removed for this Windows account. Both are permanent, and a second list then offers what they left behind.'],
    27: ['Leftovers of uninstalled programs', 'What uninstalled programs left where nothing installed, registered or running still uses it. Needs administrator permission. Folders and shortcuts go to the Recycle Bin; everything else is backed up first.'],
    /* 1.5.0 (D110, D111): the install mode. */
    30: ['Windows updates you pick', 'Security, quality and Defender updates and the malicious software removal tool, as Windows Update lists them for this PC. Windows Update fetches each one; windowsweep never restarts your PC.'],
    31: ['Driver updates and old driver packages', 'Driver updates from Windows Update, and old packages left in the driver store. The newest two of each driver always stay, so Device Manager’s Roll Back keeps working. BIOS and firmware updates are never offered, and your PC maker’s own driver tool is named, never run.'],
    32: ['App updates you pick', 'winget fetches each update from its publisher, one at a time. An app that is running is skipped, and an installer that changes the whole PC may show its own Windows permission prompt.']
  };

  /* Home's "Choose items" opens picker.html?section=N (wire.js renderNeeds), and this
     page ignored the parameter, so every card opened section 17. It is read here. */
  var params = new URLSearchParams(location.search);
  var wanted = Number(params.get('section'));
  var current = META[wanted] ? wanted : 17, chosen = {}, search = '';
  /* 26's Ran column is read only by an elevated window: ?elevated=1 draws that list. */
  var elevated = params.get('elevated') === '1';
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
      /* Install rows keep the order their tool lists them in: install, run, remove. */
      if (cols.isInstall(current)) return 0;
      return current === 19 && dataSort === 'age' ? b.idle - a.idle : b.bytes - a.bytes;
    });
  }

  /* The rows the bar acts on: those chosen in the mode in view (install or remove). */
  function modeRows(install) {
    return Object.keys(chosen).map(function (k) { return chosen[k]; })
      .filter(function (c) { return cols.isInstall(c.section) === install; });
  }
  function toggle(sel, on) {
    document.querySelectorAll(sel).forEach(function (n) { n.hidden = !on; });
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
    var head = cols.head(current), install = cols.isInstall(current);
    document.querySelectorAll('[data-ws-col]').forEach(function (th) {
      th.textContent = head[Number(th.dataset.wsCol) - 1];
    });
    /* 1.5.0: the accent figure is space reclaimed, so it stands only where a row can
       reclaim some - every remove section, and 31 for its old packages. */
    var reclaims = offered(current).some(function (c) { return c.bytes > 0; });
    toggle('[data-ws-pick-figure]', !install || reclaims);
    toggle('[data-ws-pick-reclaim-label="head"]', install && reclaims);
    toggle('[data-ws-ran-note]', current === 26 && !elevated);
    toggle('[data-ws-driver-report]', current === 31);
    toggle('[data-ws-pick-filebox]', !install);
    var searchBox = document.querySelector('[data-ws-pick-search]');
    if (searchBox) searchBox.placeholder = install ? 'Filter by name' : 'Filter by path or project';
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
        /* 27 asks for permission even to look; 30-32 list without it and install nothing. */
        tb.appendChild(emptyRow('Nothing has been offered yet.',
          current === 27 ? 'A dry-run of these leftovers asks Windows for administrator permission. Declining scans nothing, and nothing is removed.'
            : install ? 'A dry-run lists what is available. Nothing is installed until you choose rows and confirm.'
            : 'A dry-run costs nothing and deletes nothing.', ask));
      }
    } else if (!list.length) {
      tb.appendChild(emptyRow(search || current === 19 && dataReason !== 'all' ? 'Nothing matches that' : 'Nothing to choose here',
        search || current === 19 && dataReason !== 'all' ? 'Clear the path or reason filter to see the other results.'
          : 'This section found no candidates on this machine. That is the good outcome, not an error.'));
    }

    list.forEach(function (c) {
      tb.appendChild(cols.row(c, {
        on: !!chosen[c.path], elevated: elevated, reason: current === 19 ? dataReasonFor(c) : '',
        onToggle: function (row, on) { if (on) chosen[row.path] = row; else delete chosen[row.path]; bar(); }
      }));
    });

    window.wsWidgets.boot(tb);
    bar();
  }

  /* The header speaks for the section in view and the bar for the whole selection.
     Both used to read one set of counts: the header printed every chosen row over the
     rows of the section in view, so two rows ticked in 17 read "2 of 2 chosen" over
     section 18. */
  function bar() {
    var install = cols.isInstall(current);
    var mine = modeRows(install), other = modeRows(!install);
    var sum = function (rows) { return rows.reduce(function (a, c) { return a + (c.bytes || 0); }, 0); };
    var here = mine.filter(function (c) { return c.section === current; });
    window.wsWire.setText('pickCount', String(here.length));
    window.wsWire.setText('pickTotal', String(offered(current).filter(function (c) { return !c.protected; }).length));
    window.wsWire.setText('pickChosen', fmt.bytes(sum(here)));
    var b = document.querySelector('[data-ws-pickbar]');
    if (b) b.hidden = mine.length === 0;
    window.wsWire.setText('pickCount2', String(mine.length));
    window.wsWire.setText('pickChosen2', fmt.bytes(sum(mine)));
    var secs = {};
    mine.forEach(function (c) { secs[c.section] = 1; });
    window.wsWire.setText('pickWhere', 'across section' + (Object.keys(secs).length > 1 ? 's ' : ' ') +
      Object.keys(secs).join(', '));
    /* 1.5.0: one bar, two modes. Install has no Recycle Bin choice and no reclaim figure
       unless 31's old packages are chosen; its verb is built from the rows chosen. */
    toggle('[data-ws-pick-mode="remove"]', !install);
    toggle('[data-ws-pick-mode="install"]', install);
    toggle('[data-ws-pick-bytes]', !install || sum(mine) > 0);
    toggle('[data-ws-pick-reclaim-label="bar"]', install && sum(mine) > 0);
    var go = document.querySelector('[data-ws-action="pickGo"]');
    if (install) { var t = inst.tally(mine); inst.paintBar(t); if (go) go.textContent = inst.verb(t); }
    else if (go) go.textContent = 'Remove these';
    /* D-49: 17's rows are deleted outright whichever mode is chosen. */
    toggle('[data-ws-pick-17]', !!secs[17]);
    toggle('[data-ws-pick-26]', !!secs[26]);
    toggle('[data-ws-pick-27]', !!secs[27]);
    var keptLine = document.querySelector('[data-ws-pick-kept]');
    if (keptLine) { keptLine.textContent = inst.kept(other); keptLine.hidden = !other.length; }
    fitRoom();
  }

  /* 1.5.0: the page keeps room under its last block for the bar, as tall as the bar is
     while it shows. Install mode wraps it to five lines at 760, and a fixed spacer let
     it cover the note under the table (measured: 88 px at 760; 28 px for 17 before). */
  function fitRoom() {
    var room = document.querySelector('[data-ws-pick-room]');
    var b = document.querySelector('[data-ws-pickbar]');
    if (room && b) room.style.height = b.hidden ? 'var(--sp-16)' : 'calc(' + b.offsetHeight + 'px + var(--sp-4))';
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
      inst.paintReport(S.DRIVER_REPORT);
      /* The bar's height also moves with the text-size and density axes and the width. */
      var pickbar = document.querySelector('[data-ws-pickbar]');
      if (pickbar && window.ResizeObserver) new ResizeObserver(fitRoom).observe(pickbar);
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
             control, and a toast is the fallback). It clears what the bar shows: the
             other mode's rows were never in it (1.5.0). */
          modeRows(cols.isInstall(current)).forEach(function (c) { delete chosen[c.path]; });
          paint();
        }
        if (a === 'pickFile') {
          var inp = document.querySelector('[data-ws-pick-input]');
          if (inp) inp.click();
        }
        if (a === 'pickGo') {
          var install = cols.isInstall(current), mine = modeRows(install);
          if (!mine.length) return;
          /* 1.5.0: an install always asks first - it reaches beyond this machine. */
          if (install) {
            inst.paintConfirm(inst.tally(mine));
            window.wsWidgets.openDialog('pick-install-confirm');
            return;
          }
          /* D-48 (GATE 4 round 8, decided): Permanent asks first, in the gallery's
             destructive alert dialog. Any 26 row asks too, whichever mode is set: an
             uninstall is permanent either way (the app has asked since 1.4.0; 1.5.0
             draws it here, in words true of Store apps and broken entries). */
          var mode = document.querySelector('input[name="pick-mode"]:checked');
          var rows26 = mine.filter(function (c) { return c.section === 26; });
          if (rows26.length) inst.paintUninstall(rows26, mine.length - rows26.length);
          else if (mode && mode.value === 'permanent') inst.paintPermanent(mine.length);
          else { startRemoval(); return; }
          window.wsWidgets.openDialog('pick-confirm');
        }
        if (a === 'pickGoPermanent' || a === 'pickInstallGo') {
          window.wsWidgets.closeDialog(a === 'pickGoPermanent' ? 'pick-confirm' : 'pick-install-confirm');
          startRemoval();
        }
      });
    }
  };
})();
