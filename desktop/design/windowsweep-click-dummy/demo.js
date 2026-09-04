/* ============================================================================
   windowsweep desktop dummy - the review-only toolbar

   Not part of the specification. It exists so a reviewer can reset the prototype,
   see which storage backend is actually live, and RUN THE GATES - because §12f is
   explicit that this class of defect has no gate unless one is built, and a gate
   nobody has watched fail is a gate nobody has verified.

   Open with the button bottom-left, or Ctrl+Alt+D.
   ============================================================================ */
(function () {
  'use strict';
  var ws = window.ws, el = ws.el;

  function runGates() {
    return {
      axes: ws.gates.axes(),
      overlayContrast: ws.gates.overlayContrast(),
      storageNamespace: ws.gates.storageNamespace(),
      overflow: ws.gates.overflow()
    };
  }

  function line(name, r) {
    var row = el('div');
    row.style.display = 'flex'; row.style.gap = '8px'; row.style.alignItems = 'baseline';
    var tag = el('span', null, r.pass ? 'PASS' : 'FAIL');
    tag.style.fontWeight = '700';
    tag.style.color = r.pass ? 'var(--c-ok-ink)' : 'var(--c-danger-ink)';
    tag.style.flex = 'none'; tag.style.width = '3.2em';
    row.appendChild(tag);
    var body = el('div');
    body.appendChild(el('div', 't-xs', name));
    var detail = '';
    if (name === 'axes') {
      detail = r.declared + ' declared, ' + r.written + ' written to <html>, ' + r.inPanel + ' in the panel'
        + (r.missing.length ? ' | MISSING: ' + r.missing.join(',') : '')
        + (r.mismatched.length ? ' | MISMATCH: ' + r.mismatched.join(',') : '');
    } else if (name === 'overlay contrast') {
      detail = r.painted + ' painted surfaces seen, ' + r.unclaimed.length + ' unclaimed'
        + (r.unclaimed.length ? ' | ' + r.unclaimed.slice(0, 4).join(' , ') : '');
    } else if (name === 'storage namespace') {
      detail = 'physical key ' + (r.physicalKey || '(none)') + ' , expected ' + r.expected + ' , backend ' + r.backend;
    } else if (name === 'overflow at this width') {
      detail = 'viewport ' + r.viewport + 'px, ' + r.count + ' offender(s)'
        + (r.count ? ' | ' + r.offenders.slice(0, 3).join(' , ') : '');
    }
    var d = el('div', 't-2xs ink-3', detail);
    d.style.wordBreak = 'break-all';
    body.appendChild(d);
    row.appendChild(body);
    return row;
  }

  function build() {
    if (document.querySelector('[data-ws-demo]')) return;

    var open = el('button', 'btn btn-sm');
    open.setAttribute('data-ws-demo-open', '');
    open.textContent = 'review tools';
    open.style.cssText = 'position:fixed;z-index:55;inset-block-end:12px;inset-inline-start:12px;opacity:.55';
    open.addEventListener('mouseenter', function () { open.style.opacity = '1'; });
    open.addEventListener('mouseleave', function () { open.style.opacity = '.55'; });
    document.body.appendChild(open);

    var panel = el('div', 'panel pad');
    panel.setAttribute('data-ws-demo', '');
    panel.hidden = true;
    panel.style.cssText = 'position:fixed;z-index:56;inset-block-end:52px;inset-inline-start:12px;width:min(30rem,calc(100vw - 24px));max-height:70vh;overflow:auto;display:flex;flex-direction:column;gap:12px';

    var hd = el('div');
    hd.style.cssText = 'display:flex;align-items:center;gap:8px';
    hd.appendChild(el('strong', 't-sm', 'Review tools'));
    var close = el('button', 'btn btn-sm btn-ghost', 'close');
    close.style.marginInlineStart = 'auto';
    hd.appendChild(close);
    panel.appendChild(hd);

    var info = el('p', 't-2xs ink-3');
    info.textContent = 'Storage backend in use: ' + ws.store.backend +
      '  ·  namespace ' + ws.ns + '  ·  a prototype that silently fell back to memory looks ' +
      'like a persistence bug in the design, so it is reported rather than assumed.';
    panel.appendChild(info);

    var out = el('div');
    out.style.cssText = 'display:flex;flex-direction:column;gap:8px';
    panel.appendChild(out);

    function paint() {
      out.textContent = '';
      var g = runGates();
      out.appendChild(line('axes', g.axes));
      out.appendChild(line('overlay contrast', g.overlayContrast));
      out.appendChild(line('storage namespace', g.storageNamespace));
      out.appendChild(line('overflow at this width', g.overflow));
    }

    var row = el('div');
    row.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid var(--c-line);padding-top:12px';

    var rerun = el('button', 'btn btn-sm', 'Re-run gates');
    rerun.addEventListener('click', paint);
    row.appendChild(rerun);

    /* 🔴 PLANT A DEFECT ON PURPOSE. A gate nobody has watched fail is
       indistinguishable from one that asserts nothing, and every defect these
       four catch is silent by construction. Each plant reproduces the REAL bug,
       not merely a changed value. */
    var plantSurface = el('button', 'btn btn-sm', 'Plant: unclaimed surface');
    plantSurface.title = 'Adds an element that paints its own background and is in no cursor-surface mapping - ' +
                         'the exact shape that made a custom pointer invisible on a coloured band.';
    plantSurface.addEventListener('click', function () {
      var bad = el('div');
      bad.className = 'ws-planted-band';
      bad.style.cssText = 'background:oklch(.62 .19 128);padding:10px;border-radius:6px;margin:8px 0';
      bad.textContent = 'planted band - paints a background, claimed by no surface mapping';
      var host = document.querySelector('.content') || document.body;
      host.insertBefore(bad, host.firstChild);
      paint();
    });
    row.appendChild(plantSurface);

    var plantAxis = el('button', 'btn btn-sm', 'Plant: drop an axis');
    plantAxis.title = 'Removes data-density from <html>, reproducing the five-axes-lost bug rather than ' +
                      'merely changing a value.';
    plantAxis.addEventListener('click', function () {
      document.documentElement.removeAttribute('data-density');
      paint();
    });
    row.appendChild(plantAxis);

    var restore = el('button', 'btn btn-sm btn-ghost', 'Restore');
    restore.addEventListener('click', function () {
      document.querySelectorAll('.ws-planted-band').forEach(function (n) { n.remove(); });
      document.documentElement.setAttribute('data-density', ws.axisValue('density'));
      paint();
    });
    row.appendChild(restore);

    var reset = el('button', 'btn btn-sm btn-danger', 'Reset prototype');
    reset.title = 'Clears the whole namespace and reseeds - back to first run.';
    reset.addEventListener('click', function () { ws.resetAll(); });
    row.appendChild(reset);

    panel.appendChild(row);
    document.body.appendChild(panel);

    function toggle() {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) paint();
    }
    open.addEventListener('click', toggle);
    close.addEventListener('click', toggle);
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.altKey && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); toggle(); }
    });

    window.wsGateRun = runGates;   // so a headless check can call it directly
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
