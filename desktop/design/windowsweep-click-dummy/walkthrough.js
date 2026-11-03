(function () {
  'use strict';
  // This review page depicts the 1.4.1 flow; keep older dummy release fixtures intact.
  if (window.wsSeed) window.wsSeed.ENGINE_VERSION = '1.4.1';
  var slides = [
    { id: 'scan', screen: 'Home', body: 'Scan first to measure the sections windowsweep can inspect.', image: 'scan', href: 'index.html' },
    { id: 'sections', screen: 'Sections', body: 'Open Sections to inspect what each section covers.', image: 'sections', href: 'sections.html' },
    { id: 'choose', screen: 'Choose', body: 'Choose an item only after checking its path and removal method.', image: 'choose', href: 'picker.html?section=19' },
    { id: 'protected', screen: 'Home', body: 'Open the protected-path list to see which personal paths windowsweep refuses to remove.', image: 'protected', href: 'index.html' },
    { id: 'rehearse', screen: 'Home', body: 'Use a dry-run to see the expected result before any deletion.', image: 'rehearse', href: 'index.html' },
    { id: 'result', screen: 'Run', body: 'Read the completed dry-run to check what the engine would have done.', image: 'result', href: 'run.html' },
    { id: 'report', screen: 'History', body: 'Open a run’s report from History to see its recorded result.', image: 'report', href: 'history.html' }
  ];

  function element(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function queryStep() {
    var raw = new URLSearchParams(location.search).get('step');
    var value = Number(raw);
    return Number.isInteger(value) && value >= 1 && value <= slides.length ? value - 1 : 0;
  }

  function boot() {
    var root = document.querySelector('[data-ws-walkthrough]');
    if (!root) return;
    var index = queryStep();
    var startX = null;

    function go(next, push) {
      if (next < 0 || next >= slides.length) return;
      index = next;
      var url = new URL(location.href);
      if (index === 0) url.searchParams.delete('step');
      else url.searchParams.set('step', String(index + 1));
      if (push) history.pushState(null, '', url.pathname + url.search + url.hash);
      else history.replaceState(null, '', url.pathname + url.search + url.hash);
      render();
    }

    function render() {
      var slide = slides[index];
      root.replaceChildren();
      var aside = element('div', 'ws-walk-copy');
      aside.appendChild(element('p', 'caps accent-ink', 'Screen ' + (index + 1) + ' of ' + slides.length));
      aside.appendChild(element('h2', 't-xl wide', slide.screen));
      aside.appendChild(element('p', 'lede', slide.body));
      var dots = element('div', 'ws-walk-dots');
      slides.forEach(function (entry, number) {
        var button = element('button', 'ws-walk-dot', String(number + 1));
        button.type = 'button';
        button.setAttribute('aria-label', 'Screen ' + (number + 1) + ': ' + entry.screen);
        if (number === index) button.setAttribute('aria-current', 'step');
        button.addEventListener('click', function () { go(number, true); });
        dots.appendChild(button);
      });
      aside.appendChild(dots);
      var actions = element('div', 'ws-tour-actions');
      var back = element('button', 'btn', 'Back'); back.type = 'button'; back.disabled = index === 0;
      back.addEventListener('click', function () { go(index - 1, true); }); actions.appendChild(back);
      var open = element('a', 'btn', 'Open ' + slide.screen); open.href = slide.href; actions.appendChild(open);
      var next = element('button', 'btn btn-primary', index === slides.length - 1 ? 'Open Home' : 'Next screen');
      next.type = 'button';
      next.addEventListener('click', function () { if (index === slides.length - 1) location.href = 'index.html'; else go(index + 1, true); });
      actions.appendChild(next); aside.appendChild(actions);

      var figure = element('figure', 'ws-walk-figure');
      var picture = element('picture');
      var image = element('img'); image.src = 'assets/walkthrough/' + slide.image + '-1440.png';
      image.alt = slide.screen + ': ' + slide.body;
      image.width = 1440; image.height = 900; image.loading = 'eager';
      picture.appendChild(image); figure.appendChild(picture);
      figure.appendChild(element('figcaption', 't-xs ink-3', 'Review fixture · ' + slide.screen));
      root.appendChild(aside); root.appendChild(figure);
    }

    document.addEventListener('keydown', function (event) {
      if (event.target.closest('input,select,textarea')) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1, true); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1, true); }
    });
    root.addEventListener('touchstart', function (event) { startX = event.changedTouches[0].screenX; }, { passive: true });
    root.addEventListener('touchend', function (event) {
      if (startX === null) return;
      var delta = event.changedTouches[0].screenX - startX;
      if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1), true);
      startX = null;
    }, { passive: true });
    window.addEventListener('popstate', function () { index = queryStep(); render(); });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
