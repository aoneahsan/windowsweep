/* Elevation - what needs administrator rights, what the second window does, and
   the SmartScreen note. windowsweep never elevates itself.

   🔴 THE SCREEN IS A CHOICE NOW (PENDING-TASKS TASK-004). It used to list the six
   admin sections and run every one of them, while the lede said "when you ask for
   one of these" - the copy described a product the screen was not, and the dummy
   decides in favour of the copy.

   Three things the choice has to get right, all of them facts about the engine:

   1. `--i-understand-deep` is REQUIRED for sections 15, 16 and 20
      (`modules/runner.ps1:89-92` refuses any Batch = 'deep' without it). The window
      may not add it silently: it authorises irreversible or system-changing work,
      so the deep gate below names the three consequences and asks.
   2. Section 15 needs `--hiberfil off|reduced|keep` as well, or the engine warns
      "pass --hiberfil off|reduced|keep to run this section unattended" and does
      nothing. So its card carries the three-option control instead of a switch,
      and `keep` means "not chosen".
   3. Section 20 carries Dev = $true, and `modules/runner.ps1:105` skips ids 4, 17
      and 20 when developer mode is off. Its card says so rather than letting a
      ticked section silently skip. */
(function () {
  'use strict';
  var ws = window.ws, S = window.wsSeed, db = window.wsdb, el = ws.el;

  /* Chosen section ids. The three non-deep admin sections start on, because that is
     what this screen has always done for them; the deep three start off, because
     turning one on is the decision the gate exists to make visible. */
  var chosen = {};
  var hiberfil = 'keep';
  var deepOk = false;

  function isDeep(s) { return s.batch === 'deep'; }

  function chosenIds() {
    return S.SECTIONS.filter(function (s) { return s.admin && chosen[s.id]; })
      .map(function (s) { return s.id; });
  }

  function chosenDeepIds() {
    return S.SECTIONS.filter(function (s) { return s.admin && isDeep(s) && chosen[s.id]; })
      .map(function (s) { return s.id; });
  }

  /* The command this screen would run, built from the choice rather than described
     - the same rule the Run screen's status bar follows. */
  function commandLine() {
    var ids = chosenIds();
    var parts = ['windowsweep', '--json', '--only', ids.join(','), '--elevate', '--yes'];
    if (chosenDeepIds().length > 0 && deepOk) parts.push('--i-understand-deep');
    if (chosen[15] && hiberfil !== 'keep') parts.push('--hiberfil', hiberfil);
    parts.push(db.facts.developer ? '--developer' : '--not-developer');
    return parts.join(' ');
  }

  function paint() {
    var gate = document.querySelector('[data-ws-deep-gate]');
    var deep = chosenDeepIds();
    if (gate) {
      gate.hidden = deep.length === 0;
      /* Only the consequences of the sections actually chosen. A list naming all
         three when one is ticked is a warning about work that is not happening. */
      Array.prototype.forEach.call(gate.querySelectorAll('[data-ws-deep-item]'), function (li) {
        li.hidden = deep.indexOf(Number(li.dataset.wsDeepItem)) === -1;
      });
      var sw = gate.querySelector('[data-ws-deep-ok]');
      if (sw) sw.setAttribute('aria-checked', deepOk ? 'true' : 'false');
    }

    var blocked = document.querySelector('[data-ws-elevate-blocked]');
    var run = document.querySelector('[data-ws-action="elevateRun"]');
    var dry = document.querySelector('[data-ws-action="elevateDry"]');
    var reason = '';
    if (chosenIds().length === 0) reason = 'Choose at least one section first.';
    else if (deep.length > 0 && !deepOk) reason = 'Confirm you understand the deep sections above.';
    if (blocked) { blocked.textContent = reason; blocked.hidden = reason === ''; }
    if (run) run.disabled = reason !== '';
    if (dry) dry.disabled = chosenIds().length === 0;

    window.wsWire.setText('elevateCmd', commandLine());
  }

  function card(s) {
    var c = el('div', 'card');
    var bd = el('div', 'card-bd');
    var top = el('div');
    top.style.cssText = 'display:flex;align-items:center;gap:var(--sp-2);flex-wrap:wrap';
    top.appendChild(el('span', 'num t-sm ink-3', String(s.id)));
    var k = el('span', 't-base'); k.style.fontWeight = '600'; k.textContent = s.key;
    top.appendChild(k);
    top.appendChild(el('span', 'badge badge-danger', 'admin'));
    if (isDeep(s)) top.appendChild(el('span', 'badge badge-warn', 'deep'));
    bd.appendChild(top);
    bd.appendChild(el('p', 't-sm ink-3', s.title));

    if (s.id === 15) {
      /* 🔴 The per-section choice for hibernation IS the engine's own three-way
         value. A switch here could only say "run section 15", and the engine would
         then ask for a value nothing had supplied. */
      var seg = el('div', 'seg');
      seg.setAttribute('role', 'radiogroup');
      seg.setAttribute('aria-label', 'What to do with the hibernation file');
      [['keep', 'Leave it'], ['reduced', 'Reduced'], ['off', 'Turn it off']].forEach(function (o) {
        var lab = el('label', 'seg-opt');
        var input = document.createElement('input');
        input.type = 'radio'; input.name = 'ws-hiberfil'; input.value = o[0];
        if (hiberfil === o[0]) input.checked = true;
        input.addEventListener('change', function () {
          hiberfil = o[0];
          chosen[15] = (o[0] !== 'keep');
          paint();
        });
        lab.appendChild(input);
        lab.appendChild(el('span', null, o[1]));
        seg.appendChild(lab);
      });
      var wrapSeg = el('div');
      wrapSeg.style.marginTop = 'var(--sp-3)';
      wrapSeg.appendChild(seg);
      bd.appendChild(wrapSeg);
    } else {
      var row = el('label', 't-sm');
      row.style.cssText = 'display:flex;gap:var(--sp-2);align-items:center;margin-top:var(--sp-3)';
      var sw = el('button', 'switch');
      sw.type = 'button';
      sw.setAttribute('role', 'switch');
      sw.setAttribute('aria-checked', chosen[s.id] ? 'true' : 'false');
      sw.setAttribute('aria-label', 'Run section ' + s.id + ', ' + s.key);
      sw.addEventListener('click', function () {
        chosen[s.id] = !chosen[s.id];
        sw.setAttribute('aria-checked', chosen[s.id] ? 'true' : 'false');
        paint();
      });
      row.appendChild(sw);
      row.appendChild(el('span', null, 'Run this one'));
      bd.appendChild(row);
    }

    /* Declared, not discovered at runtime: a ticked section 20 with developer mode
       off is skipped by the engine, and the card is where that belongs. */
    if (s.id === 20 && !db.facts.developer) {
      bd.appendChild(el('p', 't-xs ink-3',
        'Developer mode is off, so the engine skips this one. Turn it on in Settings first.'));
    }

    c.appendChild(bd);
    return c;
  }

  window.wsPage = {
    init: function () {
      var admin = S.SECTIONS.filter(function (s) { return s.admin; });
      admin.forEach(function (s) { chosen[s.id] = !isDeep(s); });

      var host = document.querySelector('[data-ws-elevated]');
      if (host) admin.forEach(function (s) { host.appendChild(card(s)); });

      var ok = document.querySelector('[data-ws-deep-ok]');
      if (ok) {
        ok.addEventListener('click', function () { deepOk = !deepOk; paint(); });
      }

      paint();

      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t || t.disabled) return;
        if (t.dataset.wsAction === 'elevateRun') {
          window.wsWidgets.pending(t, true);
          setTimeout(function () {
            window.wsWidgets.pending(t, false);
            ws.toast('Windows would show its permission prompt here for ' + chosenIds().length +
                     ' section(s). This is a design prototype, so nothing elevates and nothing runs.',
                     { assertive: true });
          }, 900);
        }
        if (t.dataset.wsAction === 'elevateDry') {
          window.wsWidgets.pending(t, true);
          setTimeout(function () {
            window.wsWidgets.pending(t, false);
            ws.toast('Measured 15.9 GB across the sections you chose. Nothing was deleted, and no ' +
                     'permission was needed to look.');
          }, 1100);
        }
      });
    }
  };
})();
