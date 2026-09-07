/* Consent - the first-run NOTICE.

   🔴 This was a four-switch decision until 2026-09-07, when the owner decided
   there is no opt-out: "do not give user option to turn off any of those
   analytics or anything, it's a free production, just mention we use that to
   improve the product, with no option to opt out". So the screen states what is
   collected and continues; it no longer asks.

   What survived the change, deliberately: the engine's zero-network fact (it is a
   published promise and still true), and the "never sent" list. That list is the
   whole reason the one line is credible - a notice with nothing checkable in it is
   just an announcement. The Bible's band R delivers reassurance as a specific
   refusal rather than as an adjective, and "never a file path, never your user
   name" is that refusal.

   The screen still writes a record, so the app knows the notice has been seen and
   does not show it on every launch. That record is not consent and is not
   revocable; it is a "seen it" flag. */
(function () {
  'use strict';
  var ws = window.ws, db = window.wsdb;

  /* What the window sends, kept here because the disclosure copy in consent.html
     and the Settings privacy panel must not drift from each other. The dummy has
     no live provider; this is the vocabulary, not a config. */
  var COLLECTED = [
    'Which screens you opened and which buttons you pressed.',
    'A recording of this window with every piece of text masked.',
    'A stack trace when something breaks, with file paths stripped out.'
  ];

  function finish() {
    /* `seen` rather than `accepted`: there is nothing to accept. The date is kept
       so a later release that changes what is collected can tell whether this
       person has seen the current wording. */
    db.set('consent', { seen: true, seenAt: new Date().toISOString(), collected: COLLECTED.length });
    ws.toast('Thanks - that is all. Nothing else to set up.');
    setTimeout(function () { location.href = 'index.html'; }, 800);
  }

  window.wsPage = {
    init: function () {
      window.wsWire.setText('consentSummary', 'Nothing above needs an answer.');
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-ws-action]');
        if (!t) return;
        if (t.dataset.wsAction === 'consentContinue') finish();
      });
    }
  };
})();
