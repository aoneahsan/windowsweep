(function () {
  'use strict';
  var ws = window.ws;
  if (!ws || window.wsTours) return;

  var page = location.pathname.split('/').pop() || 'index.html';
  var stepsByPage = {
    'index.html': [
      ['home-scan', '[data-ws-action="scan"]', 'Scan to measure reclaimable space before choosing a run.'],
      ['home-dry-run', '[data-ws-action="dryRun"]', 'Dry-run shows what the engine would remove without deleting your files.'],
      ['home-safety', '.assure + details summary', 'Open the safety detail to see which personal paths windowsweep refuses.']
    ],
    'sections.html': [
      ['sections-filter', '.filters', 'Filter the section list by what needs your attention.'],
      ['sections-table', '.tbl', 'Expand a section to read what it covers and whether it needs you or an administrator.'],
      ['sections-selection', '.selbar:not([hidden])', 'Review the selection bar before rehearsing the chosen sections.']
    ],
    'picker.html': [
      ['choose-filter', '[data-ws-pick="19"]', 'Filter the listed items before making a choice.'],
      ['choose-table', '.tbl', 'Select an item only after reading its path and size.'],
      ['choose-consequence', '[data-ws-pickbar]:not([hidden])', 'Read the removal method and consequence before continuing.']
    ],
    'run.html': [
      ['run-prepared', '.readout', 'Check the prepared sections and mode before starting.'],
      ['run-start', '[data-ws-action="runStart"]', 'After checking the dry-run, use Start to run the prepared action.'],
      ['run-log', '[data-ws-log]', 'The log shows each section’s result when the run finishes.']
    ],
    'history.html': [
      ['history-filter', '[data-ws-hist="all"]', 'Use Show to narrow the run list to those you need.'],
      ['history-table', '.tbl', 'Open a row to inspect that run’s report.'],
      ['history-total', '[data-ws-hist-sum]', 'The total counts space freed by real runs in the current view.']
    ],
    'report.html': [
      ['report-summary', '[data-ws-report-title]', 'Read the heading to distinguish a dry-run estimate from space reclaimed.'],
      ['report-sections', '[data-ws-report-rows]', 'Inspect the section results to see where the figure came from.'],
      ['report-export', '[data-ws-action="reportExport"]', 'Export this report if you need a copy outside the app.']
    ],
    'account.html': [
      ['account-sign-in', '[data-ws-account-card] .btn-primary', 'Sign in to connect eligible run summaries across your machines.'],
      ['account-stored', '[data-ws-sync]', 'Read the stored-data list to see what belongs to your account.'],
      ['account-delete', '[data-ws-delete]', 'The deletion section names what goes and what stays before you confirm anything.']
    ],
    'settings.html': [
      ['settings-tabs', '[role="tablist"]', 'Choose a tab to inspect its settings.'],
      ['settings-thresholds', '[data-ws-action="idleDays"]', 'Review the thresholds before changing what a scan includes.'],
      ['settings-privacy', '[data-ws-privacy]', 'Open Privacy to see what the app sends and what it refuses to send.'],
      ['settings-version', '[data-ws-text="engineVersion"]', 'Open About to check the installed app and engine versions.']
    ],
    'plans.html': [
      ['plans-allowance', '[data-ws-allowance]', 'Check how many real runs remain this month; scans and dry-runs do not count.'],
      ['plans-options', '[data-ws-plan-cards]', 'Compare Pro and Team before choosing a billing period.'],
      ['plans-referrals', '[data-ws-referrals]', 'Open your referrals to see confirmed friends, points and earned Pro months.']
    ]
  };

  var source = stepsByPage[page] || [];
  var active = null;
  var cssLoaded = false;
  var focusReturn = null;

  function visible(node) {
    if (!node || !node.isConnected || !node.getClientRects().length) return false;
    for (var n = node; n; n = n.parentElement) {
      if (n.hidden || n.inert) return false;
      var s = getComputedStyle(n);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
    }
    return true;
  }

  function available() {
    if (page === 'run.html') {
      var state = document.querySelector('[data-ws-text="runState"]');
      if (state && !/ready|not started/i.test(state.textContent)) return [];
    }
    if (page === 'report.html' && document.querySelector('[data-ws-report-unreadable]:not([hidden])')) return [];
    return source.map(function (step) {
      var target = document.querySelector(step[1]);
      if (visible(target)) target.setAttribute('data-tour', step[0]);
      return { id: step[0], body: step[2], target: target };
    }).filter(function (step) { return visible(step.target); });
  }

  function node(tag, cls, label) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (label != null) e.textContent = label;
    return e;
  }

  function ensureCss() {
    if (cssLoaded) return;
    if (document.querySelector('link[href="tours.css"]')) { cssLoaded = true; return; }
    var link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = 'tours.css';
    document.head.appendChild(link); cssLoaded = true;
  }

  function urlStep(index) {
    var url = new URL(location.href);
    if (index === null) url.searchParams.delete('tour');
    else url.searchParams.set('tour', String(index + 1));
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  function close() {
    if (!active) return;
    active.shade.remove(); active.ring.remove(); active.card.remove();
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', drawRing);
    window.removeEventListener('scroll', drawRing, true);
    active = null; urlStep(null);
    if (focusReturn) focusReturn.focus();
  }

  function drawRing() {
    if (!active) return;
    var rect = active.steps[active.index].target.getBoundingClientRect();
    var ring = active.ring;
    ring.style.left = Math.max(4, rect.left - 5) + 'px';
    ring.style.top = Math.max(4, rect.top - 5) + 'px';
    ring.style.width = Math.max(20, rect.width + 10) + 'px';
    ring.style.height = Math.max(20, rect.height + 10) + 'px';
  }

  function render() {
    if (!active) return;
    var item = active.steps[active.index];
    item.target.scrollIntoView({ block: 'center', behavior: ws.prefersReducedMotion() ? 'auto' : 'smooth' });
    var card = active.card;
    card.replaceChildren();
    var head = node('div', 'ws-tour-card-head');
    var progress = node('p', 'caps accent-ink', 'Step ' + (active.index + 1) + ' of ' + active.steps.length);
    progress.setAttribute('aria-live', 'polite'); head.appendChild(progress);
    var closeButton = node('button', 'btn btn-sm btn-ghost', 'Close tour');
    closeButton.type = 'button'; closeButton.addEventListener('click', close); head.appendChild(closeButton);
    card.appendChild(head);
    var pageTitle = page === 'index.html' ? 'Home' : page === 'picker.html' ? 'Choose' : page.charAt(0).toUpperCase() + page.slice(1).replace('.html', '');
    var title = node('h2', 't-md wide', pageTitle);
    card.appendChild(title);
    card.appendChild(node('p', 't-sm', item.body));
    var jump = node('label', 't-xs ink-3', 'Jump to step');
    var select = node('select', 'field'); select.setAttribute('aria-label', 'Jump to step');
    active.steps.forEach(function (step, index) {
      var option = node('option', null, 'Step ' + (index + 1));
      option.value = String(index); select.appendChild(option);
    });
    select.value = String(active.index);
    select.addEventListener('change', function () { go(Number(select.value)); });
    jump.appendChild(select); card.appendChild(jump);
    var actions = node('div', 'ws-tour-actions');
    var skip = node('button', 'btn btn-sm btn-ghost', 'Skip tour'); skip.type = 'button'; skip.addEventListener('click', close);
    actions.appendChild(skip);
    var back = node('button', 'btn btn-sm', 'Back'); back.type = 'button'; back.disabled = active.index === 0;
    back.addEventListener('click', function () { go(active.index - 1); }); actions.appendChild(back);
    var next = node('button', 'btn btn-sm btn-primary', active.index === active.steps.length - 1 ? 'Finish' : 'Next');
    next.type = 'button'; next.addEventListener('click', function () { if (active.index + 1 === active.steps.length) close(); else go(active.index + 1); });
    actions.appendChild(next); card.appendChild(actions);
    urlStep(active.index);
    requestAnimationFrame(drawRing);
    closeButton.focus();
  }

  function go(index) {
    if (!active || index < 0 || index >= active.steps.length) return;
    active.index = index; render();
  }

  function onKey(event) {
    if (!active) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key === 'Tab') {
      var controls = Array.from(active.card.querySelectorAll('button:not(:disabled),select,a[href]'));
      if (!controls.length) return;
      var first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (event.key === 'ArrowRight' && active.index + 1 < active.steps.length) { event.preventDefault(); go(active.index + 1); }
    if (event.key === 'ArrowLeft' && active.index > 0) { event.preventDefault(); go(active.index - 1); }
  }

  function open(step) {
    var steps = available();
    if (!steps.length) return;
    if (active) close();
    ensureCss();
    focusReturn = document.querySelector('[data-ws-tour-open]');
    var shade = node('div', 'ws-tour-shade'); shade.addEventListener('click', close);
    var ring = node('div', 'ws-tour-ring'); ring.setAttribute('aria-hidden', 'true');
    var card = node('section', 'ws-tour-card'); card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true'); card.setAttribute('aria-label', 'Tour this page');
    document.body.appendChild(shade); document.body.appendChild(ring); document.body.appendChild(card);
    active = { steps: steps, index: Math.min(Math.max((step || 1) - 1, 0), steps.length - 1), shade: shade, ring: ring, card: card };
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', drawRing);
    window.addEventListener('scroll', drawRing, true);
    render();
  }

  window.wsTours = { open: open, close: close, available: available };
})();
