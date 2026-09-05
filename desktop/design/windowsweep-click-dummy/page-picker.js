/* Picker - sections 17, 18, 19 and 23. The one screen whose entire point is
   that NOTHING is chosen for you: --yes never selects here, the default is
   none, and the final question is never auto-answered. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;

  var META = {
    17: ['Stale build artefacts', 'node_modules, target, .gradle and friends, in projects nothing has touched for months. Rebuilt by the project\u2019s own install or build command.'],
    18: ['Large personal files', 'Anything over the size threshold that has not been opened in a long time. These go to the Recycle Bin.'],
    19: ['Old downloads', 'Installers and archives in your Downloads folder. Only Downloads \u2013 never Desktop, never Documents.'],
    23: ['Orphaned application data', 'AppData folders belonging to programs that are no longer installed. Fails closed: if the registry cannot be read, nothing is offered.']
  };

  var current = 17, chosen = {}, search = '';

  function rows() {
    return S.CANDIDATES.filter(function (c) {
      if (c.section !== current) return false;
      if (!search) return true;
      return (c.path + ' ' + (c.project || '')).toLowerCase().indexOf(search) !== -1;
    });
  }

  function paint() {
    var m = META[current];
    window.wsWire.setText('pickSection', String(current));
    window.wsWire.setText('pickTitle', m[0]);
    window.wsWire.setText('pickLede', m[1]);

    var tb = document.querySelector('[data-ws-pick-rows]');
    if (!tb) return;
    tb.textContent = '';
    var list = rows();

    if (!list.length) {
      var tr0 = el('tr');
      var td0 = el('td');
      td0.colSpan = 5;
      var e = el('div', 'empty');
      e.appendChild(el('h3', null, search ? 'Nothing matches that' : 'Nothing to choose here'));
      e.appendChild(el('p', null, search
        ? 'Clear the filter and the candidates come back.'
        : 'This section found no candidates on this machine. That is the good outcome, not an error.'));
      td0.appendChild(e);
      tr0.appendChild(td0); tb.appendChild(tr0);
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

      tr.appendChild(el('td', 't-sm ink-3', c.project || '\u2014'));
      tr.appendChild(el('td', 'num t-sm ink-3', c.idle + 'd'));
      var tdB = el('td', 'num-cell t-sm accent-ink', fmt.bytes(c.bytes));
      tr.appendChild(tdB);
      tb.appendChild(tr);
    });

    window.wsWidgets.boot(tb);
    window.wsWire.setText('pickTotal', String(list.length));
    bar();
  }

  function bar() {
    var keys = Object.keys(chosen);
    var total = keys.reduce(function (a, k) { return a + chosen[k].bytes; }, 0);
    var b = document.querySelector('[data-ws-pickbar]');
    if (b) b.hidden = keys.length === 0;
    ['pickCount', 'pickCount2'].forEach(function (k) { window.wsWire.setText(k, String(keys.length)); });
    ['pickChosen', 'pickChosen2'].forEach(function (k) { window.wsWire.setText(k, fmt.bytes(total)); });
    var secs = {};
    keys.forEach(function (k) { secs[chosen[k].section] = 1; });
    window.wsWire.setText('pickWhere', 'across section' + (Object.keys(secs).length > 1 ? 's ' : ' ') +
      Object.keys(secs).join(', '));
  }

  window.wsPage = {
    init: function () {
      paint();
      document.querySelectorAll('[data-ws-pick]').forEach(function (b) {
        b.addEventListener('click', function () {
          current = Number(b.dataset.wsPick);
          document.querySelectorAll('[data-ws-pick]').forEach(function (o) {
            o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
          });
          paint();
        });
      });
      var s = document.querySelector('[data-ws-pick-search]');
      if (s) s.addEventListener('input', function () { search = s.value.trim().toLowerCase(); paint(); });

      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        var a = t.dataset.wsAction;
        if (a === 'pickClear') {
          var prev = chosen;
          chosen = {};
          paint();
          ws.toast('Cleared.', { undo: function () { chosen = prev; paint(); } });
        }
        if (a === 'pickFile') {
          ws.toast('402 paths read, 397 matched a candidate. 5 lines matched nothing \u2013 each is warned ' +
                   'about individually rather than failing the run.');
        }
        if (a === 'pickGo') {
          var mode = document.querySelector('input[name="pick-mode"]:checked');
          var perm = mode && mode.value === 'permanent';
          var n = Object.keys(chosen).length;
          window.wsWidgets.pending(t, true);
          setTimeout(function () {
            window.wsWidgets.pending(t, false);
            ws.toast(perm
              ? 'This would ask you to confirm ' + n + ' permanent deletions first \u2013 a confirmation ' +
                '--yes never answers.'
              : 'Sent ' + n + ' item' + (n === 1 ? '' : 's') + ' to the Recycle Bin. Recoverable until ' +
                'you empty it.',
              { assertive: perm });
          }, 800);
        }
      });
    }
  };
})();
