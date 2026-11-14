/* ============================================================================
   Picker's install mode (1.5.0, D110) and the uninstall confirmation (D109).

   Sections 30-32 bring software in rather than take anything away (31's old
   driver packages aside). So in their view the bar drops Recycle Bin /
   Permanent, says what will be downloaded, and takes its verb from the rows
   chosen; the press always opens a confirmation first, because an install
   reaches beyond this machine and this window cannot undo it.

   🔴 THE RECLAIM FIGURE NEVER COUNTS AN INSTALL. A row's `bytes` is what it
   reclaims (seed.js), so an install row adds 0 by construction and the
   accent figure moves only for 31's old packages.

   🔴 THE TWO SELECTIONS NEVER MERGE. The chosen map spans sections as it always
   has, but the bar acts on the rows of the mode in view: Remove these never
   installs, and an install never removes a 17-27 row. Rows chosen in the other
   mode stay chosen, and the bar says so in one line.
   ============================================================================ */
(function () {
  'use strict';
  var fmt = window.wsdb.fmt;
  var list = new Intl.ListFormat('en-GB', { type: 'conjunction' });

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function setText(key, value) { window.wsWire.setText(key, value); }
  function show(sel, on) {
    document.querySelectorAll(sel).forEach(function (n) { n.hidden = !on; });
  }

  function tally(rows) {
    var t = { count: rows.length, install: 0, remove: 0, known: 0, unknown: 0,
              reclaim: 0, wu: 0, drivers: 0, winget: 0, ids: {} };
    rows.forEach(function (c) {
      t[c.verb]++;
      t.ids[c.section] = true;
      t.reclaim += c.bytes || 0;
      if (c.section === 30 || (c.section === 31 && c.verb === 'install')) t.wu++;
      if (c.section === 31 && c.verb !== 'remove') t.drivers++;
      if (c.section === 32) t.winget++;
      if (c.verb !== 'remove') { if (c.download) t.known += c.download; else t.unknown++; }
    });
    return t;
  }

  /* The verb says what the press does. One kind says it whole: "Install 3 updates",
     "Remove 2 old packages". A mixed choice in 31 names both parts with their counts,
     in the order the rows are listed - "Install 2, remove 3" - so the button never
     says less than the run will do. (A4-15: no row runs the PC maker's own tool.) */
  function verb(t) {
    if (t.install && t.remove) return 'Install ' + t.install + ', remove ' + t.remove;
    if (t.remove) return 'Remove ' + plural(t.remove, 'old package', 'old packages');
    return 'Install ' + plural(t.install, 'update', 'updates');
  }

  /* A size the tool does not report is counted as unknown, never as zero. */
  function downloadLine(t) {
    if (!t.known && !t.unknown) return 'nothing to download';
    if (!t.known) return 'download size unknown';
    return fmt.bytes(t.known) + ' to download' + (t.unknown ? ', plus ' + t.unknown + ' of unknown size' : '');
  }

  /* Rows chosen in the other mode, named so nobody thinks they were dropped or included. */
  function kept(rows) {
    if (!rows.length) return '';
    var ids = {};
    rows.forEach(function (c) { ids[c.section] = 1; });
    var keys = Object.keys(ids);
    return ' ' + plural(rows.length, 'more row stays', 'more rows stay') + ' chosen in section' +
      (keys.length > 1 ? 's ' : ' ') + list.format(keys) + '; ' +
      (rows.length === 1 ? 'it runs' : 'they run') + ' separately.';
  }

  /* The bar in install mode: the download, and one line per kind of work chosen. */
  function paintBar(t) {
    setText('pickDownload', downloadLine(t));
    show('[data-ws-pick-line="wu"]', !!t.ids[30]);
    show('[data-ws-pick-line="drivers"]', t.drivers > 0);
    show('[data-ws-pick-line="old"]', t.remove > 0);
    show('[data-ws-pick-line="winget"]', t.winget > 0);
    /* Its own clause, so removing old driver packages says it too: 30 and 31 run in the
       elevated window, and what the person meets is Windows' own prompt. */
    show('[data-ws-pick-line="elevated"]', !!(t.ids[30] || t.ids[31]));
  }

  /* The install confirmation: its title and button are the bar's verb; every line it
     shows is about work actually chosen. */
  function paintConfirm(t) {
    var v = verb(t);
    setText('pickInstallTitle', v + '?');
    setText('pickInstallVerb', v);
    show('[data-ws-install-line="wu"]', t.wu > 0);
    show('[data-ws-install-line="firmware"]', !!t.ids[31]);
    /* A4-15: the maker's own driver tool is named, never run - said wherever drivers are chosen. */
    show('[data-ws-install-line="makertool"]', !!t.ids[31]);
    show('[data-ws-install-line="winget"]', t.winget > 0);
    show('[data-ws-install-line="old"]', t.remove > 0);
    show('[data-ws-install-line="admin"]', !!(t.ids[30] || t.ids[31]));
  }

  /* D-48's dialog, in its two shapes. Any 26 row makes it the uninstall question,
     whichever removal mode is set, because an uninstall is permanent either way. */
  function paintPermanent(n) {
    setText('pickConfirmTitle', 'Remove ' + plural(n, 'item', 'items') + ' permanently?');
    setText('pickConfirmVerb', 'Remove permanently');
    show('[data-ws-confirm-line]', false);
    show('[data-ws-confirm-line="permanent"]', true);
  }

  function paintUninstall(rows26, others) {
    var has = function (k) { return rows26.some(function (c) { return c.kind === k; }); };
    setText('pickConfirmTitle', 'Uninstall the chosen programs and apps?');
    setText('pickConfirmVerb', 'Uninstall');
    show('[data-ws-confirm-line]', false);
    show('[data-ws-confirm-line="desktop"]', has('desktop'));
    show('[data-ws-confirm-line="store"]', has('store'));
    show('[data-ws-confirm-line="broken"]', has('broken'));
    show('[data-ws-confirm-line="uninstall"]', true);
    show('[data-ws-confirm-line="others"]', others > 0);
  }

  /* 31's two report blocks: listed for reading, never offered. */
  function paintReport(report) {
    [['problems', '[data-ws-driver-problems]'], ['oldest', '[data-ws-driver-oldest]']].forEach(function (p) {
      var host = document.querySelector(p[1]);
      if (!host || !report) return;
      host.textContent = '';
      report[p[0]].forEach(function (d) {
        var item = window.ws.el('li');
        item.appendChild(window.ws.el('div', 't-sm', d.name));
        item.appendChild(window.ws.el('div', 't-xs ink-3', d.detail));
        host.appendChild(item);
      });
    });
  }

  window.wsPickInstall = {
    tally: tally, verb: verb, downloadLine: downloadLine, kept: kept, paintBar: paintBar,
    paintConfirm: paintConfirm, paintPermanent: paintPermanent, paintUninstall: paintUninstall,
    paintReport: paintReport
  };
})();
