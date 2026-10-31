/* The 1.4.0 Plans specification. URL state selects review data; requests, team and
   referral actions use the dummy's namespaced store and survive a reload. */
(function () {
  'use strict';
  var ws = window.ws;
  var q = new URLSearchParams(location.search);
  var state = q.get('state') || 'free';
  var signedOut = state === 'signedOut' || state === 'deviceLimit';
  var used = state === 'deviceLimit' ? 15 : state === 'allLimit' ? 30 : 5;
  var total = signedOut ? 15 : 30;
  var paid = state === 'pro' || state === 'team' || state === 'teamOwner';
  var $ = function (s) { return document.querySelector(s); };
  var set = function (s, v) { var n = $(s); if (n) n.textContent = v; };
  var request = ws.store.get('plansRequest', null);
  var team = ws.store.get('plansTeam', null);

  function resetDate() {
    var now = new Date();
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' })
      .format(new Date(now.getFullYear(), now.getMonth() + 1, 1));
  }

  function renderMeter() {
    if (state === 'loading' || state === 'error') {
      set('[data-plan-heading]', 'Free');
      set('[data-plan-left]', state === 'loading' ? 'Reading this month’s count' : 'This month’s count could not be read. Dry-runs and scans never need it.');
      $('[data-plan-number]').hidden = true;
      $('[data-plan-skeleton]').hidden = state !== 'loading';
      $('[data-plan-retry]').hidden = state !== 'error';
      $('[data-plan-track]').hidden = true;
      $('[data-plan-reset]').hidden = true;
      $('[data-plan-device]').hidden = true;
      $('[data-plan-account]').hidden = true;
      return;
    }
    set('[data-plan-heading]', state === 'team' || state === 'teamOwner' ? 'Team' : state === 'pro' ? 'Pro' : 'Free');
    $('[data-plan-skeleton]').hidden = true;
    $('[data-plan-retry]').hidden = true;
    set('[data-plan-summary]', paid ? 'No monthly limit on real runs.' : 'Dry-runs, scans and reports are never counted.');
    $('[data-plan-portal]').hidden = !paid || state === 'team';
    set('[data-plan-number]', paid ? '∞' : String(Math.max(0, total - used)));
    set('[data-plan-left]', paid ? 'No monthly limit on real runs.' : (Math.max(0, total - used) + ' of ' + total + ' real runs left this month'));
    set('[data-plan-reset]', paid ? 'Renews on ' + resetDate() + '.' : 'The count starts again on ' + resetDate() + '.');
    set('[data-plan-device]', 'This machine: 15 real runs a month, used first.');
    set('[data-plan-account]', signedOut
      ? 'A Free account has 15 extra real runs a month, shared across machines. Sign in to see what remains.'
      : 'Your account: 15 more a month, used after this machine’s, on any machine you sign in to.');
    $('[data-plan-account]').hidden = paid;
    $('[data-plan-device]').hidden = paid;
    var track = $('[data-plan-track]');
    track.hidden = paid;
    track.setAttribute('aria-valuemax', String(total));
    track.setAttribute('aria-valuenow', String(Math.max(0, total - used)));
    $('[data-plan-fill]').style.width = (Math.max(0, total - used) / total * 100) + '%';
    if (state === 'team') set('[data-plan-summary]', 'Team member. Your seat is active.');
    if (state === 'teamOwner') set('[data-plan-summary]', team ? 'You own this team.' : 'Create the team');
    ['pro', 'team'].forEach(function (key) {
      var current = key === 'pro' ? state === 'pro' : state === 'team' || state === 'teamOwner';
      var button = $('[data-request="' + key + '"]');
      button.disabled = current;
      button.textContent = current ? 'Your plan' : key === 'pro' ? 'Request Pro' : 'Request Team';
      $('[data-pay-line="' + key + '"]').hidden = current;
    });
    if (state === 'deviceLimit' || state === 'allLimit') renderLimit();
  }

  function renderLimit() {
    var limit = $('[data-plan-limit]');
    limit.hidden = false;
    set('[data-limit-title]', state === 'deviceLimit'
      ? 'This machine’s 15 real runs for this month are used.'
      : 'This month’s 30 real runs are used.');
    set('[data-limit-body]', 'The count starts again on ' + resetDate() + '. Until then, dry-runs and scans carry on, and neither is counted.');
    var actions = $('[data-limit-actions]');
    actions.textContent = '';
    var p = ws.el('p', 't-sm', state === 'deviceLimit' ? 'A Free account has 15 extra runs a month across machines. Sign in to see what remains.' : 'Pro has no monthly limit.');
    var a = ws.el('a', 'btn btn-primary', state === 'deviceLimit' ? 'Sign in with Google' : 'See plans');
    a.href = state === 'deviceLimit' ? 'account.html' : '#plan-choose-title';
    actions.appendChild(p); actions.appendChild(a);
  }

  function renderPrices() {
    var yearly = $('input[name="billing"]:checked').value === 'yearly';
    set('[data-pro-price]', yearly ? '$36 a year' : '$4 a month');
    set('[data-team-price]', yearly ? '$30 a seat a year' : '$3 a seat a month');
    set('[data-pro-year-note]', yearly ? 'Paid yearly: $36 instead of $48.' : '');
    set('[data-team-year-note]', yearly ? 'Paid yearly: $30 instead of $36.' : '');
  }

  function renderRequest() {
    var status = $('[data-request-status]');
    if (!request) { status.hidden = true; return; }
    status.hidden = false;
    status.textContent = 'You asked for ' + (request.plan === 'pro' ? 'Pro' : 'Team') + ' on ' + request.date + '. Submitting the request charged nothing and granted nothing. When checkout opens, the windowsweep team emails you a link to pay.';
  }

  function renderReferral() {
    var code = $('#invite-code');
    if (signedOut) {
      code.value = '';
      set('[data-ref-empty]', 'Sign in with Google to get an invite code.');
      $('[data-ref-copy]').disabled = true;
    } else {
      /* A dummy-only stable code is never presented as a real referral award. */
      code.value = 'DEMO-CODE';
    }
  }

  function renderTeam() {
    var host = $('[data-team-content]');
    host.textContent = '';
    if (state === 'team') {
      host.appendChild(ws.el('p', 't-sm', 'Team member. Your seat is active.'));
      host.appendChild(ws.el('h3', 't-md wide', 'Fleet report'));
      host.appendChild(ws.el('p', 't-sm ink-3', 'Nothing to report yet. A fleet report needs a fleet: it starts with the first run on a seat’s machine.'));
      return;
    }
    if (state !== 'teamOwner') {
      host.appendChild(ws.el('p', 't-sm', 'The fleet report comes with Team, which is Pro for every seat, from 3 seats.'));
      var a = ws.el('a', 'btn', 'See plans'); a.href = '#plan-choose-title'; host.appendChild(a);
      return;
    }
    if (team) host.appendChild(ws.el('p', 't-sm', 'You own this team. ' + (team.invites.length + 1) + ' of 3 seats in use.'));
    if (!team) {
      var f = ws.el('div', 'fw');
      var l = ws.el('label', 'fw-lbl', 'Team name'); l.htmlFor = 'plan-team-name';
      var i = ws.el('input', 'field'); i.id = 'plan-team-name';
      var b = ws.el('button', 'btn btn-primary', 'Create the team'); b.type = 'button'; b.dataset.teamCreate = '';
      f.appendChild(l); f.appendChild(i); f.appendChild(b); host.appendChild(f);
      return;
    }
    var field = ws.el('div', 'fw');
    var label = ws.el('label', 'fw-lbl', 'Email address'); label.htmlFor = 'plan-team-email';
    var input = ws.el('input', 'field'); input.id = 'plan-team-email'; input.type = 'email'; input.placeholder = 'name@example.com';
    var button = ws.el('button', 'btn', 'Send the invite'); button.type = 'button'; button.dataset.teamInvite = '';
    field.appendChild(label); field.appendChild(input); field.appendChild(button); host.appendChild(field);
    host.appendChild(ws.el('p', 't-sm ink-3', 'An open invite holds a seat until it is accepted.'));
    host.appendChild(ws.el('p', 't-sm ink-3', 'They accept by signing in to windowsweep with that address.'));
    var status = ws.el('p', 't-sm'); status.setAttribute('role', 'status'); status.dataset.teamStatus = ''; host.appendChild(status);
    if (team.invites.length) {
      var table = ws.el('table', 'tbl');
      var caption = ws.el('caption', 'visually-hidden', 'Team invites'); table.appendChild(caption);
      var head = ws.el('thead'); var hr = ws.el('tr');
      ['Member', 'Role', 'Status', ''].forEach(function (word) { hr.appendChild(ws.el('th', null, word)); });
      head.appendChild(hr); table.appendChild(head);
      var body = ws.el('tbody');
      team.invites.forEach(function (email, index) {
        var row = ws.el('tr');
        row.appendChild(ws.el('td', 't-sm', email));
        row.appendChild(ws.el('td', 't-sm', 'Member'));
        row.appendChild(ws.el('td', 't-sm', 'Invited'));
        var cell = ws.el('td'); var remove = ws.el('button', 'btn btn-sm', 'Remove');
        remove.type = 'button'; remove.dataset.teamRemove = String(index); remove.setAttribute('aria-label', 'Remove ' + email);
        cell.appendChild(remove); row.appendChild(cell); body.appendChild(row);
      });
      table.appendChild(body); host.appendChild(table);
    }
    if (team.invites.length >= 2) {
      button.disabled = true;
      host.appendChild(ws.el('p', 't-sm', 'Every seat is in use or held by an open invite. Removing a member frees one.'));
    }
    host.appendChild(ws.el('h3', 't-md wide', 'Fleet report'));
    host.appendChild(ws.el('p', 't-sm ink-3', 'Nothing to report yet. A fleet report needs a fleet: it starts with the first run on a seat’s machine.'));
  }

  function bind() {
    document.addEventListener('change', function (event) { if (event.target.name === 'billing') renderPrices(); });
    document.addEventListener('click', function (event) {
      var target = event.target.closest('[data-request], [data-ref-copy], [data-plan-copy-command], [data-team-create], [data-team-invite], [data-team-remove]');
      if (!target) return;
      if (target.dataset.request) {
        if (signedOut) { location.href = 'account.html'; return; }
        var seats = Math.max(3, Number($('#team-seats').value) || 3);
        request = { plan: target.dataset.request, billing: $('input[name="billing"]:checked').value,
          seats: seats, date: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()) };
        ws.store.set('plansRequest', request);
        renderRequest();
        set('[data-request-status]', 'Request recorded for ' + (request.plan === 'pro' ? 'Pro' : 'Team') + '. Submitting it charged nothing and granted nothing. The windowsweep team emails you a link to pay when checkout opens.');
        target.dataset.state = 'done';
        setTimeout(function () { delete target.dataset.state; }, 700);
      }
      if (target.hasAttribute('data-ref-copy')) {
        var link = 'https://windowsweep.aoneahsan.com/?ref=' + $('#invite-code').value;
        navigator.clipboard.writeText(link).then(function () { set('[data-ref-status]', 'Invite link copied.'); }, function () { set('[data-ref-status]', ''); });
      }
      if (target.hasAttribute('data-plan-copy-command')) {
        navigator.clipboard.writeText('npx windowsweep --dry-run --all --yes').then(function () { target.textContent = 'Copied'; }, function () {});
      }
      if (target.hasAttribute('data-team-create')) {
        var name = $('#plan-team-name').value.trim();
        if (!name) { $('#plan-team-name').setCustomValidity('Give the team a name.'); $('#plan-team-name').reportValidity(); return; }
        team = { name: name, invites: [] }; ws.store.set('plansTeam', team); renderTeam();
      }
      if (target.hasAttribute('data-team-invite')) {
        var email = $('#plan-team-email');
        if (!email.checkValidity()) { email.setCustomValidity('Enter an email address, such as name@example.com.'); email.reportValidity(); return; }
        var sentTo = email.value;
        team.invites.push(sentTo); ws.store.set('plansTeam', team);
        renderTeam();
        set('[data-team-status]', q.get('mail') === 'uncertain'
          ? 'Invite recorded for ' + sentTo + '. Email delivery was not confirmed. They can sign in with that address to see the invite.'
          : 'Invite email sent to ' + sentTo + '.');
      }
      if (target.hasAttribute('data-team-remove')) {
        var removed = team.invites.splice(Number(target.dataset.teamRemove), 1)[0];
        ws.store.set('plansTeam', team); renderTeam();
        set('[data-team-status]', removed + ' removed. The seat is free.');
      }
    });
    document.addEventListener('input', function (event) { if (event.target.id === 'plan-team-email' || event.target.id === 'plan-team-name') event.target.setCustomValidity(''); });
  }

  window.wsPage = { init: function () {
    renderMeter(); renderPrices(); renderRequest(); renderReferral(); renderTeam(); bind();
    if (q.get('tab') === 'team') $('#team').scrollIntoView();
  } };
})();
