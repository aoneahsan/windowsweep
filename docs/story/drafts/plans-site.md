# plans-site - `/pricing`, its head, the plan facts in `llms.txt` and `pricing.md`, the `offers` text, its `/sitemap` entry and footer label

Content-map row **21** · awareness **product-aware, evaluating a paid plan** (arriving from the home page or
search) · structure **answer-first: what Free keeps -> what Pro adds -> what Team adds -> how paying works today**
· tone band **P dominant, R where Free keeps something, no W** · length **one page** · CTA **the plan request, later
the pay button** · schema **SoftwareApplication `offers` from the plan rows** · gate **GATE 2 and GATE 4
pre-authorised under D59** (lean panel, the finalizer's fact-consistency PASS, zero unanswered NEEDS DECISION) ·
ships **ahead of desktop 1.4.0**, by D63.

Round 1, 2026-10-31: the owner's answers applied. D68 settles ND-1 and D69 settles the fleet report's contents. No
question is open. Nothing else moved.

**Framework: 4Ps inside the row's answer-first order.** `copywriting-frameworks.md` gives pricing pages the 4Ps.
The promise is the H1, and the picture is the three cards. Proof stays empty. No testimonial, user count or rating
exists. None may be invented. Push is the request button with no urgency attached, because the only honest
reason to act now is that a reader wants what the plan does. The row's beat order decides the sequence on the page.

## Sources

| Source | What it gives this page |
|---|---|
| `docs/PROJECT-CONTEXT.md` Session 21, D56 | the plan set, prices, run numbers, Team's minimum, the referral numbers, every figure an admin field |
| D62 (2026-10-31) | Free keeps run-summary sync, History and each run's report export; Pro's extras are schedules, multi-machine reports across up to 5 machines and a history export |
| D61, D63 | checkout dormant, a plan request instead of a pay button, the page live before desktop 1.4.0 |
| D68, D69 (2026-10-31) | a request grants nothing, and the pay link is emailed when checkout opens; what the fleet report shows |
| The approved brief, `what-is-windowsweep.md` (GATE 4, 2026-10-31) | the Polar sentences, the real-run definition, the arithmetic, the 1.3.2 line |
| `~/.claude/rules/payment-copy.md` | the consent line, verbatim; no refund line on this surface; the neutral cancellation sentence |
| Story Bible §3, §4, §7, §10 and the fingerprint | the palette, the glossary (*protected*, *machine*, *the windowsweep team*), no number promised |
| Site catalogues `common`, `seo`, `sitemapBlurbs`, `home`, `account`; `public/llms.txt` | the shapes these strings extend |

## Conventions

- **Catalogue form.** A new `pricing` namespace (`windowsweep-web/src/lib/i18n/locales/en/pricing.json`), plus members
  in `seo`, `sitemap` and `common.footer`. Key names are proposals; the main session writes the catalogue, dummy first.
- **Every figure is a data slot** read from the plan rows and `app_config`, formatted by `Intl` at render or at build.
  None is typed into a catalogue.
- **One typed plan record** supplies the rendered cards, page head, `pricing.md`, `llms.txt` and JSON-LD offers. The
  question headings are H2s above their Free, Pro and Team cards; each card keeps its short plan name.
- **Two link tags for the consent line**, `<terms>` and `<privacy>`. The site's `RichText` maps every `<lnk>` in a key
  to one element, so the call site needs a two-link variant; one key still holds the whole sentence, as the i18n rule
  requires.
- **Two states.** State A is checkout closed (D61) and state B is checkout open. The `beforeRelease` line shows only
  while the product version mirror reads below 1.4.0.
- **Typography.** Curly apostrophes in catalogue strings, ASCII in `llms.txt` and `pricing.md`, en-GB throughout.
- **New unless stated.** Every slot is new copy. A slot that replaces shipped words quotes them first.

## Data slots

| Slot | Seeded value | Read from |
|---|---|---|
| `{{freePrice}}` | $0 | the Free plan row |
| `{{freeDeviceRuns}}` | 15 | Free's real runs a month on each machine |
| `{{freeAccountRuns}}` | 15 | Free's extra real runs a month, signed in |
| `{{proMonth}}` · `{{proYear}}` | $4 · $36 | the Pro row's monthly and yearly prices |
| `{{proYearAtMonthly}}` | $48 | `proMonth` × 12, computed |
| `{{proMachines}}` | 5 | Pro's machines in multi-machine reports |
| `{{teamSeatMonth}}` · `{{teamSeatYear}}` | $3 · $30 | the Team row's per-seat prices |
| `{{teamSeatYearAtMonthly}}` | $36 | `teamSeatMonth` × 12, computed |
| `{{teamMinSeats}}` | 3 | the Team row's minimum seats |
| `{{teamMinMonth}}` · `{{teamMinYear}}` | $9 · $90 | the per-seat price × the minimum, computed |
| `{{teamMachinesPerSeat}}` | 5 | Team's machines per seat |
| `{{desktopVersion}}` | 1.3.2 | `vite/product-version.json`, the checked mirror |
| `{{plansUpdatedOn}}` | the build reads it | the newest `updated_at` among the plan rows |

Prices render as `$4`, never `US$4.00`: `Intl.NumberFormat('en-GB', { style: 'currency', currency: 'USD',
currencyDisplay: 'narrowSymbol' })`, with no fraction digits for a whole amount.

## The lint hook cannot see the fenced copy

`posttooluse-story-lint.sh` strips every code fence before it counts anything. Every shipping string below sits in
a fence, so a green hook here describes the commentary and nothing more. The fenced strings were checked by hand:
the banned list read with the hook's own matching rule, the fingerprint's never-list, dashes and exclamation marks.
The fact-checker is the real gate.

---

## `/pricing` - the page

### S-001 · page head - crumb, eyebrow, H1, lede (beat 1, what Free keeps)

```json
"crumb": "Pricing",
"eyebrow": "Pricing",
"title": "Every plan runs all 26 sections. Pro lifts the run limit.",
"lede": "Free is {{freePrice}}, with no sign-in and no card. It counts one thing, real runs: {{freeDeviceRuns}} a month on each machine, and {{freeAccountRuns}} more once you sign in with Google. Dry-runs never count. Pro is {{proMonth}} a month with no limit; Team is Pro for every seat, from {{teamMinSeats}} seats. The command line costs nothing and is never counted."
```

| Element | Note |
|---|---|
| `title` | The answer first. The first sentence is a refusal of the usual paid-tier move, holding sections back; the second names the one thing Pro changes |
| `lede` | Every limit sits in the sentence that makes its claim. *No sign-in* rather than *no account*, because a signed-out desktop app holds an anonymous session (`legal-payments` P-02 says so) |

### S-002 · the line shown before desktop 1.4.0 ships

```json
"beforeRelease": "These plans start with desktop app 1.4.0, which is in progress. Today’s desktop app, {{desktopVersion}}, has no plans and no run limit."
```

The brief's own sentence, with the version as a slot. The page goes live first (D63). A reader on 1.3.2 must learn
that nothing changed for them yet.

### S-003 · the Free card (beat 1)

```json
"free": {
  "heading": "What does Free include?",
  "name": "Free",
  "price": "{{freePrice}}",
  "line": "The whole engine, with a monthly count of real runs.",
  "includes": {
    "sections": "All 26 sections and every safety check",
    "runs": "{{freeDeviceRuns}} real runs a month on each machine, {{freeAccountRuns}} more signed in",
    "unlimited": "Dry-runs, scans and reports, unlimited and never counted",
    "sync": "Run summaries synced to your account, signed in",
    "export": "Any run’s report, exported as Markdown or HTML"
  },
  "keeps": "No section is held back for a paid plan. Every plan refuses the same protected paths.",
  "cta": "Download the desktop app"
}
```

| Element | Note |
|---|---|
| `keeps` | Band R, as the row asks. Two refusals the reader can check: `--list` and `--list-targets` print the same sections and paths on any plan. *No section*, never *nothing*: schedules, the history export and multi-machine reports are held back, and the card must not deny it |
| `cta` | `/download`. Free has nothing to request or buy |

### S-004 · the Pro card (beat 2, what Pro adds)

```json
"pro": {
  "heading": "What does Pro add?",
  "name": "Pro",
  "priceMonth": "{{proMonth}} a month",
  "priceYear": "{{proYear}} a year",
  "priceBoth": "{{proMonth}} a month, or {{proYear}} a year",
  "line": "No limit on real runs, for one account on every machine it signs in to.",
  "includes": {
    "runs": "No monthly limit on real runs",
    "schedules": "Schedules: the desktop app’s weekly scheduled run",
    "reports": "Reports across up to {{proMachines}} machines",
    "export": "A history export",
    "free": "Everything in Free"
  },
  "request": "Request Pro",
  "subscribe": "Subscribe to Pro"
}
```

| Element | Note |
|---|---|
| `line` | The brief's flow step 9: the plan reaches every machine signed in to the account |
| `schedules` | Names what the schedule is today. *Schedules, including* would promise kinds nobody has built |
| `subscribe` | The exact verb: the plan renews. `request` is state A's button and `subscribe` is state B's |

### S-005 · the Team card (beat 3, what Team adds)

```json
"team": {
  "heading": "What does Team add?",
  "name": "Team",
  "priceMonth": "{{teamSeatMonth}} a seat a month",
  "priceYear": "{{teamSeatYear}} a seat a year",
  "priceBoth": "{{teamSeatMonth}} a seat a month, or {{teamSeatYear}} a seat a year",
  "minimum": "From {{teamMinSeats}} seats, so the smallest team is {{teamMinMonth}} a month.",
  "line": "Pro for every seat, and one report across the whole team’s machines.",
  "includes": {
    "pro": "Pro for every seat",
    "fleet": "A shared fleet report, up to {{teamMachinesPerSeat}} machines a seat",
    "members": "Members invited by email and removed from the Team screen",
    "summaries": "Runs per member and machine; never a path, file name, machine name or user name"
  },
  "request": "Request Team",
  "subscribe": "Subscribe to Team"
}
```

`summaries` is band R, and it is D69's own list: per member and machine, a run's date, mode, sections and bytes
reclaimed, and never a path, a file name, a machine name or a user name.

### S-006 · the controls the cards share

```json
"current": "Your plan",
"billing": { "label": "Billing", "monthly": "Monthly", "yearly": "Yearly" },
"priceUpdated": "Prices in US dollars. Plan details last updated {{plansUpdatedOn}}.",
"seats": {
  "label": "Seats", "hint": "From {{teamMinSeats}}.",
  "totalMonth_one": "{{count}} seat: {{total}} a month", "totalMonth_other": "{{count}} seats: {{total}} a month",
  "totalYear_one": "{{count}} seat: {{total}} a year", "totalYear_other": "{{count}} seats: {{total}} a year"
},
"signInFirst": "A plan belongs to an account, so the button asks you to sign in with Google first.",
"consent": "By continuing, you agree to our <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>."
```

| Element | Note |
|---|---|
| `consent` | 🔴 Renders exactly *"By continuing, you agree to our Terms of Service and Privacy Policy."*, small and muted, directly under each of the two buttons, in **both** states. The request button stands where the pay button will, so the plans contract test sees one shape in either state. It is the only payment-terms text on the page |
| `priceUpdated` | One date. Render it beside the plan prices. `{{plansUpdatedOn}}` is the newest plan-row `updated_at`, formatted for the reader; it dates the plan details, including changes unrelated to prices |
| *our* | The fingerprint bans the first person plural. These words are fixed by fleet law (`payment-copy.md`) and the dispatch says EXACTLY, so precedence keeps them, and nothing else on the page says *we* or *our* |

### S-007 · the yearly arithmetic

```json
"yearly": "Paid yearly, Pro is {{proYear}} instead of {{proYearAtMonthly}}. A Team seat is {{teamSeatYear}} a year instead of {{teamSeatYearAtMonthly}}, so the smallest team, {{teamMinSeats}} seats, pays {{teamMinYear}} a year."
```

The brief's arithmetic with each figure computed from the rows. *A quarter off* is left out: it is true at $36
against $48 and false the day either price moves.

### S-008 · side by side

```json
"compare": {
  "title": "What does each plan include?",
  "safetyLink": "Every plan uses the same <lnk>safety model</lnk>.",
  "sectionsLink": "See the <lnk>26-section reference</lnk> for what each section touches.",
  "colIncluded": "Included",
  "rows": {
    "runs": "Real runs a month", "unlimited": "Dry-runs, scans and reports",
    "sections": "All 26 sections and every safety check", "sync": "Run summaries synced, signed in",
    "export": "Each run’s report as Markdown or HTML", "schedules": "Schedules in the desktop app",
    "history": "History export", "machines": "Reports across machines",
    "fleet": "Shared fleet report", "seats": "Seats"
  },
  "cells": {
    "freeRuns": "{{freeDeviceRuns}} per machine, plus {{freeAccountRuns}} signed in",
    "noLimit": "No limit", "unlimited": "Unlimited", "yes": "Yes", "no": "No",
    "proMachines": "Up to {{proMachines}}", "teamMachines": "Up to {{teamMachinesPerSeat}} a seat",
    "oneSeat": "1", "teamSeats": "From {{teamMinSeats}}"
  }
}
```

The column headers are the plan names and every row label is a noun, so no header asks a yes/no question
(`safety.md`). *Schedules in the desktop app* keeps Free's *No* true, since the command line's own task is free.
Show the two links beside the comparison: `/safety-model` and `/sections` on the docs site. Each key has one
`<lnk>` tag for the site's existing `RichText` renderer. One link per key.

### S-009 · how paying works (beat 4) - state A, state B, and the moments around a request or a checkout

```json
"paying": {
  "title": "How does paying work?",
  "closed": "Checkout is not open yet. Until it is, the Pro and Team buttons send a plan request instead: it records the plan you asked for on your account, and nothing is charged.",
  "closedNext": "Submitting a request grants nothing. When checkout opens, the windowsweep team emails you a link to pay; paying through that link is a separate step.",
  "open": "Checkout opens on Polar’s page in your browser for the account you are signed in with. Polar is the merchant of record: it charges the card, adds any sales tax or VAT for your country, and issues the receipt. Once Polar confirms the payment, the plan reaches every machine signed in to that account.",
  "requesting": "Sending the request…",
  "requested": "Request recorded for {{plan}}. Sending it charged nothing and granted nothing. When checkout opens, the windowsweep team emails you a link to pay.",
  "requestPending": "You asked for {{plan}} on {{date}}. Sending that request charged nothing and granted nothing. When checkout opens, the windowsweep team emails you a link to pay.",
  "requestFailed": "The request did not reach the server, so nothing was recorded. Try again in a moment.",
  "opening": "Opening the checkout…",
  "openFailed": "The checkout did not open, and nothing was charged. Try again in a moment.",
  "afterCheckout": "Polar has the payment. The plan shows on your account once Polar confirms it.",
  "leftCheckout": "The checkout closed before payment. Nothing was charged.",
  "active": "{{plan}} is on your account, with no limit on real runs."
}
```

| Element | Note |
|---|---|
| `closed` | State A. *Nothing is charged* is band R, a refusal the reader can rely on before pressing anything |
| `closedNext`, `requested`, `requestPending` | D68 in each: submitting a request charges and grants nothing; the later emailed link can lead to payment. The server marks a successfully emailed request `notified`; an admin closes it separately through `requests.close` |
| `open` | State B, the brief's payment-model sentences with *organisation* and the flow steps compressed. No renewal or refund sentence: on a pay surface the consent line is the only payment-terms text |
| `afterCheckout` | Polar's own confirmation page is the success page (`polar-payments` §3); `return_url` may bring the reader back here, and a redirect never grants the plan, so this line promises nothing beyond the webhook |
| `active` | No triumph. A fact and its consequence |

### S-010 · questions about plans (3 to 5, answer first)

```json
"faq": {
  "title": "Questions about plans",
  "realRun": { "q": "What counts as a real run?",
    "a": "A run in the desktop app that can change files. Dry-runs, scans and reports never count, and nothing run from the command line is counted." },
  "cli": { "q": "What does the command line cost?",
    "a": "Nothing. <mono>npx windowsweep</mono> is open source under the MIT licence, has no run limit, and is never counted: it makes no network calls at all. From a copy installed with npm, <mono>windowsweep --install-task</mono> sets up its weekly Scheduled Task with no account." },
  "limit": { "q": "What happens at the limit?",
    "a": "If the device count is used, signing in can add up to {{freeAccountRuns}} more real runs this month. If both Free pools are used, wait for next month's reset or an active Pro or Team plan. Dry-runs, scans and reports carry on. The command line is never counted." },
  "cancel": { "q": "Can I cancel?",
    "a": "Any time. Your paid period runs to its end. After that, the account uses Free unless an admin grant, referral reward or Team entitlement still applies." },
  "freeKeeps": { "q": "What does Free keep?",
    "a": "All 26 sections and every safety check, with dry-runs, scans and reports unlimited. Any run’s report exports to Markdown or HTML. When you sign in, run summaries sync to your account and History lists them. Every plan refuses the same protected paths." }
}
```

| Question | Note |
|---|---|
| `realRun` | The brief's answer, word for word except *desktop-app run* opened into a phrase |
| `cli` | *Installed with npm* because `--install-task` refuses to install from an npx cache, which Windows evicts (`settings.scheduleConseq`, question map row 8) |
| `limit` | A spent device pool can be followed by the signed-in account pool; a real run waits only after both are spent. The month boundary is the server's, and the desktop app prints the exact date |
| `cancel` | `payment-copy.md`'s neutral sentence with the actual entitlement fallback. Cancellation is the one payment fact a plans surface may carry |
| `freeKeeps` | Band R in the last sentence. No FAQPage schema: row 6 scopes FAQPage to the docs `faq` page alone |

---

## The page's other homes

### S-011 · `seo.pricing` - the `<title>` and `<meta name="description">`

```json
"pricing": {
  "title": "Pricing · Free, Pro and Team for the windowsweep desktop app",
  "description": "Free has all 26 sections and {{freeDeviceRuns}} real runs a month on each machine, {{freeAccountRuns}} more signed in. Pro is {{proMonth}} a month with no limit. The command line is never counted."
}
```

The build fills the slots from the plan rows, the same way it fills `SoftwareApplication.softwareVersion` from the
version mirror. Measured lengths are in the self-check.

### S-012 · `/sitemap` - its name and blurb

```json
"name": { "pricing": "Pricing" },
"blurb": { "pricing": "Free, Pro and Team side by side, what counts as a real run, and how paying works. The command line is never counted." }
```

### S-013 · the footer label

```json
"pricing": "Pricing"
```

A `common.footer.links` member, in the *Product* column beside *Download*.

### S-014 · `public/llms.txt` - three edits

Today the intro sentence reads *"This site is windowsweep.aoneahsan.com: where the tool is downloaded, and where an
account holds what the desktop app has synced."*, and the file has no Pricing line and no plan fact.

```text
This site is windowsweep.aoneahsan.com: where the tool is downloaded, where the desktop app's plans are set out,
and where an account holds what the desktop app has synced.

- [Pricing](https://windowsweep.aoneahsan.com/pricing): Free, Pro and Team for the desktop app, side by side; the command line is never counted

- Plans apply to the desktop app from version 1.4.0. Free: {{freePrice}}, all 26 sections and every safety check,
  {{freeDeviceRuns}} real runs a month on each machine and {{freeAccountRuns}} more signed in, dry-runs, scans and
  reports unlimited. Pro: {{proMonth}} a month or {{proYear}} a year, no limit on real runs, schedules, reports across
  up to {{proMachines}} machines and a history export. Team: {{teamSeatMonth}} a seat a month or {{teamSeatYear}} a
  seat a year, from {{teamMinSeats}} seats, Pro for every seat plus a shared fleet report. Plan details last updated
  {{plansUpdatedOn}} in this build. Prices are in US dollars and may change. The command line costs nothing,
  is MIT-licensed, has no run limit and is never counted.
```

The Pricing line joins *Pages on this site* after Download. The plan fact joins *Facts an answer should get right*.
While checkout is closed, the build appends *"Checkout is not open yet; the pricing page takes plan requests.
Submitting a request charges nothing and grants nothing. When checkout opens, the windowsweep team emails
requesters a link to pay; paying through that link is a separate step."* to that bullet. Before 1.4.0 ships it
appends *"Desktop app 1.3.2 has no plans and no run limit."*

### S-015 · `public/pricing.md` - the plan facts as plain text

```markdown
# windowsweep pricing

> Plans for the windowsweep desktop app. The command line costs nothing, is MIT-licensed and is never counted.
> Prices are in US dollars and may change. Plan details last updated {{plansUpdatedOn}} in this build.
> This file is a build snapshot; the [pricing page](https://windowsweep.aoneahsan.com/pricing) carries its own date.

## Plans

| Plan | Price | Includes |
|---|---|---|
| Free | {{freePrice}} | All 26 sections and every safety check; {{freeDeviceRuns}} real runs a month on each machine, {{freeAccountRuns}} more signed in; dry-runs, scans and reports unlimited; run summaries synced when signed in; any run's report as Markdown or HTML |
| Pro | {{proMonth}} a month or {{proYear}} a year | No monthly limit on real runs; schedules (the desktop app's weekly scheduled run); reports across up to {{proMachines}} machines; a history export; everything in Free |
| Team | {{teamSeatMonth}} a seat a month or {{teamSeatYear}} a seat a year, from {{teamMinSeats}} seats | Pro for every seat; a shared fleet report, up to {{teamMachinesPerSeat}} machines a seat, with each run's date, mode, sections and bytes reclaimed per member and machine, never a path, file name, machine name or user name |

## What counts as a real run

A run in the desktop app that can change files. Dry-runs, scans and reports never count. Nothing run from the
command line is counted.

## How paying works

{{payingState}}

## Links

- [Pricing page](https://windowsweep.aoneahsan.com/pricing)
- [Terms of Service](https://windowsweep.aoneahsan.com/terms)
- [Privacy Policy](https://windowsweep.aoneahsan.com/privacy)
```

`{{payingState}}` is one of three states, chosen at build. State A names only the website until desktop 1.4.0 ships:

```text
A before 1.4.0: Checkout is not open yet. The pricing page takes a plan request instead. Submitting it charges nothing and grants nothing. When checkout opens, the windowsweep team emails each pending requester a link to pay; paying through that link is a separate step.
A from 1.4.0: Checkout is not open yet. The pricing page and the desktop app's Plans screen take a plan request instead. Submitting it charges nothing and grants nothing. When checkout opens, the windowsweep team emails each pending requester a link to pay; paying through that link is a separate step.
B: Pro and Team are paid by card in a Polar checkout in the browser, signed in with Google. Polar is the merchant of record: it charges the card, applies any sales tax or VAT and issues the receipt. Plans are billed monthly or yearly in advance and renew automatically; cancel any time, and the plan runs to the end of the period paid for.
Before 1.4.0, appended to either: These plans start with desktop app 1.4.0, which is in progress. Desktop app {{desktopVersion}} has no plans and no run limit.
```

No refund sentence and no consent line: this file has no button, and `payment-copy.md` keeps refund words off every
pricing surface, machine-readable ones included. The newest `updated_at` among the plan rows dates the plan details
in this build, including changes unrelated to prices. It does not claim that the build snapshot is live.

### S-016 · `offers` - the `SoftwareApplication` offer names and descriptions

No `offers` key exists today. 🔴 `vite/prerender.ts` refuses one (the gate of 2026-09-12); D56 superseded the rule it
enforces, so that gate changes in the same commit. The existing `SoftwareApplication` with `@id` ending `/#software`
describes the free command-line engine. These offers belong to a separate desktop `SoftwareApplication` with a
distinct `@id` ending `/pricing#desktop-app`.

```json
"offers": {
  "free": { "name": "windowsweep Free", "description": "All 26 sections and every safety check; {{freeDeviceRuns}} real runs a month on each machine and {{freeAccountRuns}} more signed in; dry-runs, scans and reports unlimited." },
  "proMonthly": { "name": "windowsweep Pro, monthly", "description": "No monthly limit on real runs, schedules, reports across up to {{proMachines}} machines and a history export, billed monthly." },
  "proYearly": { "name": "windowsweep Pro, yearly", "description": "No monthly limit on real runs, schedules, reports across up to {{proMachines}} machines and a history export, billed yearly." },
  "teamMonthly": { "name": "windowsweep Team, monthly, per seat", "description": "Pro for every seat and a shared fleet report, priced per seat and billed monthly, from {{teamMinSeats}} seats." },
  "teamYearly": { "name": "windowsweep Team, yearly, per seat", "description": "Pro for every seat and a shared fleet report, priced per seat and billed yearly, from {{teamMinSeats}} seats." }
}
```

`price` and `priceCurrency` (`USD`) come from the same rows. The desktop entity and its offers say only what the page
shows; the existing command-line entity keeps its own description and version (`aeo-seo.md`).

---

## Approved strings this surface makes false - proposals for the keeper

Not this row's words. Each was approved on another row and turns false the day `/pricing` asks for a sign-in. They are
written here so the keeper can route them; they ship through their own rows' gates.

### S-017 · rows 18 and 19

```json
"signin.lede": "Signing in is needed for three things: sending a message that can be replied to, reading back what the desktop app has synced, and requesting or buying a plan. Nothing else on the site needs it.",
"seo.signin.description": "Google sign-in for one account, shared with the desktop app. It is needed to send a message, to read what the app has synced, and to choose a plan.",
"seo.site.description": "Where windowsweep is downloaded, where the desktop app’s plans are set out, and where an account holds what the desktop app has synced."
```

| Key | Was | Why it changes |
|---|---|---|
| `signin.lede` (row 18) | *"Signing in is only needed for two things..."* | a third reason exists: a plan belongs to an account |
| `seo.signin.description` (row 19) | *"...Only two things need it..."* | the same |
| `seo.site.description` (row 19) | no plans | the site now sets out the plans |

---

## NEEDS DECISION

None is open on this row. **ND-1 was answered by D68** (2026-10-31): submitting a plan request charges and grants
nothing. When checkout opens, the team emails pending requesters a link to pay, marks a request `notified` after a
successful send, and closes it separately through an admin action. S-009 and S-015 keep those steps separate.

---

## Self-check

- **Palette.** P owns the H1, the lede, the payment states, the arithmetic and four answers. R lands in Free's `keeps`,
  `paying.closed` (*nothing is charged*), Team's `summaries` and the last sentence of `freeKeeps`. W is absent, as row 21
  requires. Nothing here hurries, shames or triumphs.
- **Rhythm.** Shortest sentence: *"Nothing."*, the whole first answer to *What does the command line cost?* Longest:
  `paying.closed`'s second sentence, 27 words. The lede runs 9, 21, 3, 17 and 9 words, measured with the hook's tokenizer,
  a slot counted as one word.
- **Length.** One page, as the cap says. S-001 to S-010 hold 973 source-string words across both states, every price
  variant and every moment around a request or a checkout; a reader sees one state at a time. The lede is 59 words,
  and the five answers run 25, 46, 46, 26 and 43.
- **Unsure.** Nothing open. ND-1 is answered by D68, and every fact traces to a record in the table below.

### Banned words and tells

Fenced copy, checked by hand against `banned-phrases.txt` and the fingerprint's never-list: no hit. The shipping strings
carry no exclamation mark and no em dash, and no *we*, *us* or *our* appears anywhere except inside the consent line,
whose words fleet law fixes. No refund sentence. *Free* appears only as the plan's name. *Costs nothing* is said only of
the command line: the scope the 2026-10-31 map amendment allows for a price claim.

### Every fact, with its source

| Fact | Source |
|---|---|
| Free {{freePrice}}; {{freeDeviceRuns}} a month on each machine, {{freeAccountRuns}} more signed in; dry-runs, scans and reports unlimited; every section and safety check | D56; the brief's *Pricing* |
| Free keeps run-summary sync, History and each run's report export | D62 |
| Pro {{proMonth}} or {{proYear}}; no run limit; schedules; reports across up to {{proMachines}} machines; a history export | D56 as refined by D62; the brief |
| Team per seat, from {{teamMinSeats}}; Pro for every seat; shared fleet report; {{teamMachinesPerSeat}} machines a seat | D56, D62; the brief |
| The weekly schedule moves to Pro in the desktop app; the command line keeps `--install-task` | D62; the brief's *What does Free include?* |
| `--install-task` refuses under npx | desktop `settings.scheduleConseq`; content map question 8 |
| What counts as a real run | the brief's *What counts as a real run?* |
| The command line: MIT, no limit, never counted, no network calls | D56; the brief; `privacy.json` `sends.cli` |
| Checkout dormant, a plan request, nothing charged | D61; D63 |
| Submitting a request charges and grants nothing; a successfully emailed pay link marks it `notified`, and an admin closes it separately | D68; `docs/CONTRACTS.md` §7 |
| The fleet report: per member and machine, date, mode, sections, bytes; never a path, file name, machine name or user name | D69 |
| Polar is the merchant of record: card, sales tax or VAT, receipt | the brief's payment model |
| The plan reaches every signed-in machine once Polar confirms | the brief's payment flow, steps 6 to 9 |
| A redirect never grants a plan | `aoneahsan-cccs-polar-payments` §3 |
| Cancel any time; the paid period runs to its end, then the account's remaining entitlements determine the plan | `payment-copy.md`; `docs/CONTRACTS.md` §5 |
| Plans start with 1.4.0; 1.3.2 has no plans and no run limit | the brief; D63 |
| Every plan refuses the same protected paths | the brief: *"The chokepoint refuses the same paths on every plan."* |
| The consent line | `payment-copy.md`, verbatim |

### Measured lengths (seeded values)

| String | Characters | Limit |
|---|---|---|
| `seo.pricing.title` | 60 | about 60 |
| `seo.pricing.description` | 153 (155 if both run figures reach three digits) | 155 |
| `sitemap.blurb.pricing` | 116 | the other blurbs run 95 to 133 |
| `seo.signin.description` (S-017) | 147 | 155 |
| `seo.site.description` (S-017) | 135 | 155 |
