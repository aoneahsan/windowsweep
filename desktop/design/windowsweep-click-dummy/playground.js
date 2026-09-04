/* ============================================================================
   The PLAYGROUND harness - one owner, eight consumers.

   Every gallery file opens with a knob panel driving ONE LIVE INSTANCE of that
   file's most important component, before the specimen rows begin.

   Why both surfaces exist, and why neither replaces the other:

     specimen rows  answer "are these consistent with each other?" - which needs
                    simultaneity, so they stay
     playground     answers "what happens when...?" - which needs a live target

   A panel that switches between PRE-RENDERED specimens is the same static
   gallery with extra steps: it can only show what the author already thought
   of, which is exactly what the reviewer is trying to get past. It also renders
   identically to a real one, so nothing catches it. Hence the rule below.

   The harness creates its own markup behind an idempotent guard and mounts at
   ONE container name across all eight files - hand-copying a knob panel per
   file is pitfall 4, where the first page works and the rest silently do not.

   Dials are deep-linkable (?variant=danger&state=pending) so a reviewer can
   send back the exact broken combination rather than describing it - and they
   are NEVER PERSISTED. A reviewer flips one dial, forgets, and every page for
   the rest of the session looks broken. Preferences persist; demo axes do not.

   Each dial is a real RadioGroup (RAC anatomy), not a row of buttons: one tab
   stop for the group with arrows inside it, rather than one tab stop per option.
   ============================================================================ */
(function () {
  'use strict';

  var REG = {};
  var MOUNT = '[data-ws-playground]';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* Values come from the URL, fall back to each dial's declared default, and
     are written back to the URL only - never to storage. */
  function readValues(spec) {
    var q = new URLSearchParams(location.search);
    var v = {};
    spec.dials.forEach(function (d) {
      var got = q.get(d.key);
      v[d.key] = (got && d.options.indexOf(got) !== -1) ? got : d.value;
    });
    return v;
  }

  function writeValues(spec, v) {
    var q = new URLSearchParams(location.search);
    spec.dials.forEach(function (d) {
      if (v[d.key] === d.value) q.delete(d.key);
      else q.set(d.key, v[d.key]);
    });
    var s = q.toString();
    history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  }

  function build(host, kind) {
    var spec = REG[kind];
    if (!spec) {
      host.appendChild(el('p', 't-sm ink-3', 'No playground registered for "' + kind + '".'));
      return;
    }
    if (host.dataset.pgBuilt === '1') return;
    host.dataset.pgBuilt = '1';

    var v = readValues(spec);
    var box = el('div', 'pg');

    /* header */
    var hd = el('div', 'pg-hd');
    hd.appendChild(el('span', 'caps', 'Playground'));
    hd.appendChild(el('span', 't-sm', spec.title));
    if (spec.note) hd.appendChild(el('span', 't-xs ink-3', spec.note));
    var acts = el('div', 'pg-acts');
    var reset = el('button', 'btn btn-sm', 'Reset');
    var copy = el('button', 'btn btn-sm', 'Copy link');
    acts.appendChild(reset); acts.appendChild(copy);
    hd.appendChild(acts);
    box.appendChild(hd);

    /* dials */
    var dialWrap = el('div', 'pg-dials');
    var groups = {};
    spec.dials.forEach(function (d) {
      var row = el('div', 'pg-dial');
      var name = 'pg-' + kind + '-' + d.key;
      var lbl = el('span', 'pg-dial-l', d.label);
      lbl.id = name + '-label';
      row.appendChild(lbl);

      var grp = el('div', 'seg');
      grp.setAttribute('role', 'radiogroup');
      grp.setAttribute('aria-labelledby', lbl.id);
      d.options.forEach(function (o) {
        var opt = el('label', 'seg-opt');
        var input = el('input');
        input.type = 'radio'; input.name = name; input.value = o;
        input.checked = (v[d.key] === o);
        input.addEventListener('change', function () {
          v[d.key] = o;
          writeValues(spec, v);
          paint();
        });
        opt.appendChild(input);
        opt.appendChild(el('span', null, d.labels ? (d.labels[o] || o) : o));
        grp.appendChild(opt);
      });
      groups[d.key] = grp;
      row.appendChild(grp);
      dialWrap.appendChild(row);
    });
    box.appendChild(dialWrap);

    /* the live target - ONE instance, rebuilt from the values on every change */
    var stage = el('div', 'pg-stage');
    var mount = el('div', 'pg-mount');
    mount.setAttribute('data-pg-mount', kind);
    stage.appendChild(mount);
    box.appendChild(stage);
    host.appendChild(box);

    function paint() {
      mount.textContent = '';
      try {
        spec.render(mount, v);
      } catch (err) {
        mount.appendChild(el('p', 't-xs', 'playground render failed: ' + err.message));
      }
      if (window.wsWidgets) window.wsWidgets.boot(mount);
    }

    reset.addEventListener('click', function () {
      spec.dials.forEach(function (d) {
        v[d.key] = d.value;
        var input = groups[d.key].querySelector('input[value="' + CSS.escape(d.value) + '"]');
        if (input) input.checked = true;
      });
      writeValues(spec, v);
      paint();
    });

    copy.addEventListener('click', function () {
      var url = location.href;
      var done = function () { if (window.ws) window.ws.toast('Link copied - it carries the exact dial settings.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, done);
      } else { done(); }
    });

    paint();
    host.__pg = { spec: spec, values: v, groups: groups, mount: mount, paint: paint };
  }

  /* ------------------------------------------------------------------------
     The gate. A dial wired to nothing looks exactly like a working one, so the
     only thing separating a playground from a decoration of one is proving that
     moving a knob changes the rendered output.

     It asserts on the CONSEQUENCE - the rendered subtree - not on the attribute
     the knob just wrote, which would only agree with itself.

     Reported as three numbers, never a bare ratio: a dial the runner cannot
     drive is a FAILURE, not a skip.
     ------------------------------------------------------------------------ */
  function gatePlayground() {
    var host = document.querySelector(MOUNT);
    if (!host || !host.__pg) return { ok: true, note: 'no playground on this page' };
    var pg = host.__pg;
    var live = 0, dead = [], undriveable = [];

    pg.spec.dials.forEach(function (d) {
      var grp = pg.groups[d.key];
      if (!grp) { undriveable.push(d.key + ' (no control)'); return; }
      var before = pg.mount.innerHTML;
      var other = d.options.filter(function (o) { return o !== pg.values[d.key]; })[0];
      if (!other) { undriveable.push(d.key + ' (single option)'); return; }
      var input = grp.querySelector('input[value="' + CSS.escape(other) + '"]');
      if (!input) { undriveable.push(d.key + ' (no input for ' + other + ')'); return; }

      var wasValue = pg.values[d.key];
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      var after = pg.mount.innerHTML;
      if (after !== before) live++; else dead.push(d.key);

      /* restore */
      var back = grp.querySelector('input[value="' + CSS.escape(wasValue) + '"]');
      if (back) { back.checked = true; back.dispatchEvent(new Event('change', { bubbles: true })); }
    });

    var ok = dead.length === 0 && undriveable.length === 0;
    return {
      ok: ok,
      note: live + ' live / ' + dead.length + ' inert / ' + undriveable.length + ' undriveable' +
            (dead.length ? ' - inert: ' + dead.join(', ') : '') +
            (undriveable.length ? ' - undriveable: ' + undriveable.join(', ') : '')
    };
  }

  function boot() {
    document.querySelectorAll(MOUNT).forEach(function (h) {
      build(h, h.getAttribute('data-ws-playground'));
    });
  }

  window.wsPlayground = {
    register: function (kind, spec) { REG[kind] = spec; },
    boot: boot,
    gate: gatePlayground,
    el: el
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
