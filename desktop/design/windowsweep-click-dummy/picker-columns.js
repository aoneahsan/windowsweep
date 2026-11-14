/* ============================================================================
   Picker's columns, section by section (1.5.0).

   One table, five columns; what the last four hold depends on the section in
   view. 17, 18 and 23 keep Path / Project / Idle / Size and 19 keeps Reason and
   Age. 1.5.0 adds three shapes:

   - 26 is ONE list of three kinds: desktop program, Store app, broken entry
     (D109). Its third column is Ran, the days since Windows last saw the program
     start. Windows tells only an elevated window, so a list made without one
     shows a dash on every row and the note above the table says why
     (picker.html [data-ws-ran-note]); picker.html?section=26&elevated=1 draws
     the elevated list.
   - 27 names five kinds and, on every row, what happens to that row: the
     Recycle Bin, a .reg backup first, or an XML export first.
   - 30 to 32 are the INSTALL mode (D110). A row installs or removes; the third
     column is the needs-admin tag and the fourth is what the fetching tool will
     download - never space reclaimed, which stays in `bytes`. 31 never runs the
     PC maker's own driver tool (A4-15): it is named, so there is no `run` row.

   Every word a cell can show lives in this file, so the app mirrors one place.
   ============================================================================ */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, el = ws.el, fmt = db.fmt;

  var PLAIN = ['Path', 'Project', 'Idle', 'Size'];
  var HEAD = {
    19: ['Path', 'Reason', 'Age', 'Size'],
    26: ['Program', 'Kind', 'Ran', 'Size'],
    27: ['Path', 'Kind', 'Idle', 'Size'],
    30: ['Update', 'Category', 'Needs', 'Download'],
    31: ['Driver', 'Action', 'Needs', 'Download'],
    32: ['App', 'Version', 'Needs', 'Download']
  };

  var KIND_26 = {
    desktop: ['desktop program', 'badge-neutral'],
    store: ['Store app', 'badge-neutral'],
    broken: ['broken entry', 'badge-warn']
  };
  var KIND_27 = { folder: 'folder', shortcut: 'shortcut', registry: 'registry key', startup: 'startup entry', task: 'scheduled task' };
  /* What happens to a 27 row. Startup entries add the program they would start. */
  var FATE_27 = {
    folder: 'Goes to the Recycle Bin',
    shortcut: 'Goes to the Recycle Bin',
    registry: 'Backed up to a .reg file first; double-clicking that file puts the key back',
    task: 'Exported to an XML file first; Task Scheduler can import it back'
  };
  var SOURCE_31 = { install: 'Windows Update', remove: 'driver store' };
  var VERB = { install: 'Install', remove: 'Remove' };

  function isInstall(id) { var s = db.section[id]; return !!s && s.tier === 'update'; }
  function head(id) { return HEAD[id] || PLAIN; }

  function sub(cls, text) {
    var p = el('p', cls, text);
    p.style.marginTop = 'var(--sp-1)';
    return p;
  }
  function clip(n) {
    n.style.cssText += ';max-width:38rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
    return n;
  }
  /* A secondary line on a name-first row (26, 32) yields to its cell instead of widening
     it, so every column stays in view at the 760 px minimum. Path-first rows keep clip()
     and the table's own sideways scroll, as 1.4.0 left them. */
  function fit(n) {
    n.style.cssText += ';width:0;min-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
    return n;
  }
  function badge(text, cls) { return el('span', 'badge ' + cls, text); }

  /* What the fetching tool will download. A remove row downloads nothing, and a size
     the tool does not report is said, never guessed (winget reports none). */
  function download(c) {
    if (c.verb === 'remove') return '—';
    return c.download ? fmt.bytes(c.download) : 'size unknown';
  }

  /* The switch's accessible name: the verb in install mode, the program's name in 26
     (an appx: path read aloud helps nobody), the path everywhere else. */
  function choiceLabel(c) {
    if (c.verb) return VERB[c.verb] + ' ' + c.label;
    return 'Choose ' + (c.section === 26 ? c.label : c.path);
  }

  function nameCell(c) {
    var td = el('td');
    if (c.section === 26 || c.verb) {
      var top = el('div', 't-sm', c.label);
      if (c.running) { top.appendChild(document.createTextNode(' ')); top.appendChild(badge('running', 'badge-warn')); }
      td.appendChild(top);
      if (c.section === 26) td.appendChild(fit(sub('mono t-xs ink-3', c.path)));
      if (c.section === 31) td.appendChild(sub('t-xs ink-3', c.detail + (c.verb === 'remove' ? ' · reclaims ' + fmt.bytes(c.bytes) : '')));
      if (c.section === 32) td.appendChild(fit(sub('t-xs ink-3', c.path + ' · ' + c.source)));
      /* Never truncated: it is what the person has to do. */
      if (c.running) td.appendChild(sub('t-xs ink-3', 'Close it first, or it is skipped'));
      if (c.kind === 'broken') td.appendChild(sub('t-xs ink-3', 'Its uninstaller is gone: ' + c.missing));
      return td;
    }
    td.appendChild(clip(el('div', 'mono t-sm', c.path)));
    if (c.section === 19) {
      td.appendChild(sub('t-xs ink-3', 'Root: ' + c.root + ' · ' + c.idle + ' days since last ' + c.basis +
        (c.protected ? ' · ' + c.protected : '')));
    }
    if (c.section === 27) {
      td.appendChild(sub('t-xs ink-3', c.kind === 'startup'
        ? 'Starts ' + c.target + ', which is gone · backed up to a .reg file first'
        : FATE_27[c.kind]));
    }
    return td;
  }

  function kindCell(c, ctx) {
    var td = el('td', 't-sm ink-3');
    if (c.section === 19) td.textContent = ctx.reason === 'both' ? 'Large + old' : ctx.reason === 'large' ? 'Large' : 'Old';
    else if (c.section === 26) td.appendChild(badge(KIND_26[c.kind][0], KIND_26[c.kind][1]));
    else if (c.section === 27) td.appendChild(badge(KIND_27[c.kind], 'badge-neutral'));
    else if (c.section === 30) td.textContent = c.category;
    else if (c.section === 31) {
      td.appendChild(badge(c.verb, c.verb === 'remove' ? 'badge-warn' : 'badge-neutral'));
      td.appendChild(sub('t-xs ink-3', SOURCE_31[c.verb]));
    } else if (c.section === 32) { td.textContent = c.from + ' → ' + c.to; td.style.whiteSpace = 'nowrap'; }
    else td.textContent = c.label || c.project || '—';
    return td;
  }

  function whenCell(c, ctx) {
    if (c.verb) {
      var needs = el('td', 't-sm ink-3', c.admin ? null : '—');
      if (c.admin) needs.appendChild(badge('admin', 'badge-danger'));
      return needs;
    }
    if (c.section === 26) return el('td', 'num t-sm ink-3', ctx.elevated && c.ran >= 0 ? c.ran + 'd' : '—');
    return el('td', 'num t-sm ink-3', c.idle < 0 ? '—' : c.idle + 'd');
  }

  function sizeCell(c) {
    if (c.verb) {
      var d = download(c);
      return el('td', d === 'size unknown' ? 'num-cell t-xs ink-3' : 'num-cell t-sm ink-2', d);
    }
    if (!c.bytes) return el('td', 'num-cell t-sm ink-3', '—');
    return el('td', 'num-cell t-sm accent-ink', fmt.bytes(c.bytes));
  }

  /* One row. ctx: { on, elevated, reason, onToggle(row, on) }. */
  function row(c, ctx) {
    var tr = el('tr');
    tr.setAttribute('data-selected', ctx.on ? 'true' : 'false');
    var tdS = el('td');
    if (!c.protected) {
      var sw = el('button', 'switch');
      sw.type = 'button';
      sw.style.setProperty('--sw-w', 'calc(1.9rem * var(--density))');
      sw.setAttribute('role', 'switch');
      sw.setAttribute('aria-checked', ctx.on ? 'true' : 'false');
      sw.setAttribute('aria-label', choiceLabel(c));
      sw.addEventListener('ws:toggle', function (e) {
        tr.setAttribute('data-selected', e.detail.on ? 'true' : 'false');
        ctx.onToggle(c, e.detail.on);
      });
      tdS.appendChild(sw);
    } else {
      var refused = badge('Refused', 'badge-outline');
      refused.title = c.protected;
      tdS.appendChild(refused);
    }
    tr.appendChild(tdS);
    tr.appendChild(nameCell(c));
    tr.appendChild(kindCell(c, ctx));
    tr.appendChild(whenCell(c, ctx));
    tr.appendChild(sizeCell(c));
    return tr;
  }

  window.wsPickCols = { head: head, isInstall: isInstall, row: row, download: download };
})();
