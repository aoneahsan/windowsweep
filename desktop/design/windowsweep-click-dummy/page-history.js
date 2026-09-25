/* History - local runs in full, cloud runs as summaries. The label is the point:
   a synced row carries a date, a byte count and a section count, and nothing
   that could identify a machine or a path.

   Amended 2026-09-13 (GATE 4 round 8, D-41) - the first time this screen was judged
   with data. What changed, and why, is in design/README.md; in short:
   - the list is the runs made IN THIS WINDOW (the weekly task and the command line
     write their reports elsewhere), so the lede says so;
   - twenty rows a page, and "Load 20 more" answers with the rows and the count - no
     toast - and goes inert, not disabled, once everything is drawn;
   - "Freed per run" is drawn with d3 from ZERO, the scale Home's spark uses for the
     same metric, and only real runs are points on it (a dry-run freed nothing);
   - the relative day counts local calendar days, and the exact stamp is local time,
     because it is matched against a report file stamped in local time;
   - history.html?empty=1 draws the screen before anything has run.

   Amended 2026-09-25 (TASK-013, SY-04 and SY-05) - History reads the account:
   - another machine's row says "another machine" in Where. The schema stores no machine
     name, so the laptop this used to name was a name nothing could supply;
   - a summary removed on the Account screen is gone here too (the same `cloudRemoved`);
   - the Other machines chip's empty state is corrected (signed in) and entered (signed out);
   - history.html?fail=list draws a first read that failed; ?fail=listMore refuses the
     first Load 20 more, and the next press works. Signed in, that press is a read of
     the account's next page, so it goes pending. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb, S = window.wsSeed, el = ws.el, fmt = db.fmt;

  var PAGE = 20;
  var filter = 'all', shown = PAGE;
  var Q = new URLSearchParams(location.search);
  var EMPTY = Q.get('empty') === '1';
  var FAIL = Q.get('fail');
  var moreRefused = false;
  var DAY = 864e5;

  /* demo-data: the eight seeded runs, plus seventeen older ones so a second page of
     twenty exists here the way it does in a window with a history behind it. */
  function localRuns() {
    if (EMPTY) return [];
    var runs = S.RUNS.map(function (r, i) {
      return { at: r.at, freed: r.freed, sections: r.sections, mode: r.mode,
               where: 'this machine', cloud: false, dry: i === 2 };
    });
    for (var k = 0; k < 17; k++) {
      var list = k % 3 === 0;
      runs.push({
        at: new Date(Date.now() - (35 + k * 9) * DAY),
        freed: (2 + ((k * 7) % 11)) * 1.1 * S.GB,
        sections: list ? 6 : 11,
        mode: list ? 'sections 1, 2, 3, 5, 6, 8' : 'safe batch',
        where: 'this machine', cloud: false, dry: k % 5 === 4
      });
    }
    return runs;
  }

  /* Rows from another machine, deliberately thin - that IS the design. They exist only
     when signed in: showing them signed out would be claiming a sync that is not
     happening. Where says "another machine" and never a name (SY-04): the schema stores
     none. The ids are the Account screen's, so a summary removed there is gone here. */
  function cloudRuns() {
    if (!db.facts.signedIn || FAIL === 'list') return [];
    var gone = db.facts.cloudRemoved || [];
    return [
      { id: 'laptop-4', at: new Date(Date.now() - 4 * DAY), freed: 8.4e9, sections: 9, mode: null,
        where: 'another machine', cloud: true, dry: false },
      { id: 'laptop-21', at: new Date(Date.now() - 21 * DAY), freed: 2.2e9, sections: 4, mode: null,
        where: 'another machine', cloud: true, dry: false }
    ].filter(function (r) { return gone.indexOf(r.id) === -1; });
  }

  function all() {
    return localRuns().concat(cloudRuns()).sort(function (a, b) { return b.at - a.at; });
  }

  /* The chips that list the account's rows - so the ones a failed read leaves unknown. */
  function listsCloud() { return filter !== 'local'; }

  function match(r) {
    if (filter === 'local') return !r.cloud;
    if (filter === 'cloud') return r.cloud;
    if (filter === 'dry') return !!r.dry;
    return true;
  }

  /* Local calendar days, not elapsed hours rounded: a run at 23:50 read at 00:10 is
     yesterday. db.js fmt.relDate rounds elapsed time, which calls it today. */
  function relDay(d) {
    var midnight = function (t) { var x = new Date(t); return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(); };
    var days = Math.max(0, Math.round((midnight(Date.now()) - midnight(d.getTime())) / DAY));
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return days + ' days ago';
    var months = Math.round(days / 30);
    return months + (months === 1 ? ' month ago' : ' months ago');
  }

  /* YYYY-MM-DD HH:MM in LOCAL time - the stamp a report file name carries. */
  function exact(d) {
    var two = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()) + ' ' +
      two(d.getHours()) + ':' + two(d.getMinutes());
  }

  /* SY-05: the title says what the account holds, and the signed-in body says what fills
     it - an empty filter proves only that the account holds nothing from elsewhere. */
  function emptyRow(tb) {
    var title, body;
    if (filter === 'cloud') {
      title = 'No run summaries from other machines';
      body = db.facts.signedIn
        ? 'When a run finishes in the desktop app on another machine signed in as you, its summary appears here.'
        : 'Sign in and your other machines’ run summaries appear here. Nothing syncs while you are signed out.';
    } else if (filter === 'dry' && localRuns().length) {
      title = 'No dry-runs yet';
      body = 'A dry-run costs nothing and deletes nothing.';
    } else {
      title = 'No runs yet';
      body = 'No run has finished in this window yet. A dry-run costs nothing and deletes nothing.';
    }
    var tr = el('tr'), td = el('td'); td.colSpan = 6;
    var e = el('div', 'empty');
    /* h2: the page's only other heading is its h1. Sized as .empty h3 is. */
    var h = el('h2', null, title);
    h.style.cssText = 'font-size:var(--fs-md);font-weight:700';
    e.appendChild(h);
    e.appendChild(el('p', null, body));
    td.appendChild(e); tr.appendChild(td); tb.appendChild(tr);
  }

  /* SY-02c's first key, at the head of the table on every chip that lists the account's
     rows - this window's own rows still show under it. On Other machines it is the only
     row: an unreadable account must not read as an empty one. */
  function failedRow(tb) {
    var tr = el('tr'), td = el('td'); td.colSpan = 6;
    var n = el('div', 'note note-warn');
    n.setAttribute('role', 'status');
    n.appendChild(el('span', null, '!')).setAttribute('aria-hidden', 'true');
    n.appendChild(el('span', 't-sm', 'The run summaries in your account could not be read. Nothing on this ' +
      'machine changed, and windowsweep tries again the next time you open this screen.'));
    td.appendChild(n); tr.appendChild(td); tb.appendChild(tr);
  }

  function paint() {
    var list = all().filter(match);
    var tb = document.querySelector('[data-ws-hist-rows]');
    if (!tb) return;
    tb.textContent = '';

    var unread = db.facts.signedIn && FAIL === 'list' && listsCloud();
    if (unread) failedRow(tb);
    if (!list.length && !(unread && filter === 'cloud')) emptyRow(tb);

    list.slice(0, shown).forEach(function (r, i) {
      var tr = el('tr');
      var when = el('td');
      when.id = 'hist-when-' + i;
      when.appendChild(el('div', 't-sm', relDay(r.at)));
      when.appendChild(el('div', 't-xs ink-3', exact(r.at)));
      tr.appendChild(when);

      var md = el('td');
      md.appendChild(el('span', 'badge ' + (r.dry ? 'badge-outline' : 'badge-neutral'),
        r.dry ? 'dry-run' : 'real run'));
      tr.appendChild(md);

      var sec = el('td');
      if (r.cloud) {
        var s = el('div');
        s.style.cssText = 'display:flex;align-items:center;gap:var(--sp-2);flex-wrap:wrap';
        s.appendChild(el('span', 't-sm ink-3', r.sections + (r.sections === 1 ? ' section' : ' sections')));
        s.appendChild(el('span', 'badge badge-outline', 'summary only'));
        sec.appendChild(s);
      } else {
        sec.appendChild(el('div', 't-sm', r.mode));
        sec.appendChild(el('div', 't-xs ink-3', r.sections + (r.sections === 1 ? ' section' : ' sections')));
      }
      tr.appendChild(sec);

      tr.appendChild(el('td', 't-sm ink-3', r.where));

      var fr = el('td', 'num-cell t-sm');
      fr.textContent = fmt.bytes(r.freed);
      if (!r.dry) fr.classList.add('accent-ink');
      tr.appendChild(fr);

      var op = el('td');
      var b;
      if (r.cloud) {
        /* S-079's sentence is also said, not only shown on hover: a title on a span that
           takes no focus reaches no screen reader. */
        b = el('span', 't-xs ink-3');
        b.title = 'The full report stays on the machine that made it.';
        b.appendChild(el('span', null, '—')).setAttribute('aria-hidden', 'true');
        b.appendChild(el('span', 'visually-hidden', 'The full report stays on the machine that made it.'));
      } else {
        b = el('a', 'btn btn-sm btn-ghost', '›');
        b.href = 'report.html' + (r.dry ? '?dry=1' : '');
        b.setAttribute('aria-label', 'Open this run’s report');
        /* six identical link names are told apart by the row's own When */
        b.setAttribute('aria-describedby', when.id);
      }
      op.appendChild(b);
      tr.appendChild(op);
      tb.appendChild(tr);
    });

    /* Everything drawn: the button goes inert rather than disabled, so the focus a
       keyboard press left on it stays there; the count beside it is the reason. */
    var more = document.querySelector('[data-ws-action="histMore"]');
    if (more) {
      var done = shown >= list.length;
      if (done) { more.setAttribute('aria-disabled', 'true'); more.setAttribute('data-disabled', ''); }
      else { more.removeAttribute('aria-disabled'); more.removeAttribute('data-disabled'); }
    }

    var real = list.filter(function (r) { return !r.dry; });
    window.wsWire.setText('histShown', String(Math.min(shown, list.length)));
    window.wsWire.setText('histAll', String(list.length));
    window.wsWire.setText('histTotal', fmt.bytes(real.reduce(function (a, r) { return a + r.freed; }, 0)));
    var line = document.querySelector('[data-ws-hist-count]');
    if (line) {
      line.textContent = '';
      if (real.length === 1) line.textContent = 'freed in the last run';
      else {
        line.appendChild(document.createTextNode('freed in the last '));
        line.appendChild(el('span', 'num', String(real.length)));
        line.appendChild(document.createTextNode(' runs'));
      }
    }
    /* TASK-018: a view with no real run has nothing to total. "0 B, freed in the last 0 runs" said
       nothing the empty row below does not say better, so the block steps aside. */
    var sum = document.querySelector('[data-ws-hist-sum]');
    if (sum) sum.hidden = real.length === 0;
  }

  /* Freed per run: real d3, the frame fixed at 900 x 90 while the domain moves, and
     the domain starts at ZERO - Home's spark plots the same metric that way, and a
     line whose floor is the smallest run draws a 2.4 GB run as if it freed nothing. */
  function spark() {
    var host = document.querySelector('[data-ws-hist-spark]');
    if (!host || !window.d3) return;
    host.textContent = '';
    var d3 = window.d3, W = 900, H = 90, pad = 6;
    var real = localRuns().filter(function (r) { return !r.dry; })
      .sort(function (a, b) { return a.at - b.at; });

    if (!real.length) {
      var e = el('div', 'chart-empty', 'No real run has finished in this window yet.');
      e.style.height = H + 'px';
      host.appendChild(e);
      return;
    }

    var peak = Math.max(1, d3.max(real, function (r) { return r.freed; }));
    var x = d3.scaleLinear().domain([0, Math.max(1, real.length - 1)]).range([pad, W - pad]);
    var y = d3.scaleLinear().domain([0, peak]).range([H - pad, pad]);
    var at = function (i) { return real.length === 1 ? W / 2 : x(i); };
    var NS = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    s.setAttribute('width', '100%');
    s.setAttribute('height', String(H));
    s.setAttribute('role', 'img');
    s.setAttribute('aria-label', real.length === 1 ? 'Bytes freed by the last run'
      : 'Bytes freed by each of the last ' + real.length + ' runs');
    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d3.line().x(function (r, i) { return at(i); }).y(function (r) { return y(r.freed); })(real));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--c-accent)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linejoin', 'round');
    s.appendChild(path);
    real.forEach(function (r, i) {
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', at(i)); c.setAttribute('cy', y(r.freed)); c.setAttribute('r', 3);
      c.setAttribute('fill', 'var(--c-accent)');
      s.appendChild(c);
    });
    host.appendChild(s);
  }

  function moreFailedLine(visible) {
    var n = document.querySelector('[data-ws-hist-more-failed]');
    if (n) n.hidden = !visible;
  }

  /* Signed in, on a chip that lists the account's rows, the next page may have to be read
     from the account first - so the press goes pending. ?fail=listMore refuses the first
     one: the rows and the count stay, the line beside the button says so, and the next
     press works. */
  function loadMore(t) {
    moreFailedLine(false);
    if (!db.facts.signedIn || !listsCloud()) { shown += PAGE; paint(); return; }
    window.wsWidgets.pending(t, true);
    setTimeout(function () {
      window.wsWidgets.pending(t, false);
      if (FAIL === 'listMore' && !moreRefused) { moreRefused = true; moreFailedLine(true); return; }
      shown += PAGE;
      paint();
    }, 500);
  }

  window.wsPage = {
    init: function () {
      /* a failure state is an account's, so it signs the prototype in */
      if (FAIL && !db.facts.signedIn) { db.set('signedIn', true); db.set('email', 'you@example.com'); }
      paint(); spark();
      document.querySelectorAll('[data-ws-hist]').forEach(function (b) {
        b.addEventListener('click', function () {
          filter = b.dataset.wsHist;
          shown = PAGE;
          moreFailedLine(false);
          document.querySelectorAll('[data-ws-hist]').forEach(function (o) {
            o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
          });
          paint();
        });
      });
      /* No toast: the new rows and the count are the answer, where the person is
         looking (the D-28 rule the round-8 amendment applied to four other toasts). */
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action="histMore"]');
        if (!t || t.getAttribute('aria-disabled') === 'true' || t.dataset.state === 'pending') return;
        loadMore(t);
      });
    }
  };
})();
