# legal-payments - the Terms and Privacy additions for plans, payments, run counts, referrals and teams

Content-map row **23** · awareness **being told the rules before paying, a notice and never a persuasion** · structure
**additions inside the existing pages' order; the NO REFUNDS passage plain and once** · tone band **P and R only, no
humour at all** · length **as the clauses need** · CTA **none** · schema **none** · gate 🔴 **GATE 4 by the owner, not
pre-authorised** (D59: Terms and Privacy changes go to him first).

Round 1, 2026-10-31: the owner's answers D64 and D67 to D71 applied, with the facts the main session settled the same
day. The owner chose to keep the misuse clause in this session, naming deliberate run-limit evasion and referral-account farming and allowing account deletion and referral voiding, subject to legal GATE 4. Publication still waits.

**A legal safety surface.** `story-craft/references/safety.md` was read before the first sentence. Two of its rules
govern every clause: no outcome promise on a legal page and no yes/no column header that turns a cell into an answer.
Humour is off. No sentence pressures, frightens or reassures beyond what a fact supports.

**Framework: the pages' own order, read as a notice.** The persuasion structures each end in an action. This row's
CTA is none. So every addition sits inside the section order the owner already approved for `/terms` (row 20) and
`/privacy` (row 17), and each one says what happens, why, and where it stops. Walter's hierarchy settles the rest:
functional first, and nothing past it.

## Two shipping waves

| Wave | When | What |
|---|---|---|
| **Early** | ahead of desktop 1.4.0, with `/pricing` (D63) | T-02, T-03, P-03, and the head strings in T-05 |
| **With 1.4.0** | when the desktop app starts counting runs | T-01, T-04, P-01, P-02, P-04 to P-09, P-11 |

The early clauses are written to be true before 1.4.0 ships: they say *from version 1.4.0* where the desktop app is
meant, and describe Polar payments as a future path while checkout is closed. **The effective date moves at each wave**,
to the day the new words go live, by the owner's rule of 2026-09-24.

## Sources

| Source | What it gives these clauses |
|---|---|
| `~/.claude/rules/payment-copy.md` | NO REFUNDS, plain and once in the Terms, with a plain Privacy passage; every kind sold is named; the returned-payment rule; the neutral cancellation sentence |
| `aoneahsan-cccs-plans-entitlements` → `terms-and-data-use.md` | cancellation ends the renewal, not the period; the LabFlow Privacy model *"Payments for a plan are not refunded"* |
| D56, D58, D61, D62, D63 (`docs/PROJECT-CONTEXT.md`) | the plans, anonymous sign-ins, devices and run claims, the legal-notice flag, Polar dormant, the early wave |
| D64, D67 to D71, D75, and the facts settled 2026-10-31 | the desktop window's analytics without Clarity and its existing public GA4 Measurement ID; a running plan keeps its price; what a request does; the fleet report; deletion cancels a paid plan first; what survives a deletion; `devices` with no name or Windows version |
| The approved brief (GATE 4, 2026-10-31) | Polar as merchant of record, renewal, cancellation, the returned payment, the email that confirms a plan |
| `aoneahsan-cccs-polar-payments` | Polar hosts the customer portal; plan time is bought per paid order. Its portal-link email is unverified and not claimed in shipping copy |
| `aoneahsan-cccs-update-flow` → `contract.md`; the approved plan, wave 2 | the release check's timing; a running cleanup is never stopped; the updater every six hours |
| macleanup `docs/database/SCHEMA.md` | the shape the plan ports (wave 6): `devices`, `run_claims`, `subscriptions`, `plan_grants`, `referrals`, `teams`, `team_invites` |
| `terms.json`, `privacy.json` (approved rows 20 and 17) | the order, the names (*the account service*, *the desktop app*), every sentence these additions must not contradict |

## Conventions

- **Catalogue form**, as `terms.json` and `privacy.json` hold it, with RichText's `<lnk>` and `<mono>`. One `<lnk>` per
  key. Each new key's position is named by the existing key it follows.
- **No admin-field figure appears in these pages.** Prices, run numbers and referral numbers move without a release, so
  the legal words point at the pricing page and the Plans screen instead of quoting them.
- **Party names follow the approved Terms.** The operator stays the legal party. D45 kept him. The product is the
  subject where it acts, as in *"windowsweep asks nothing about your age"*. The refund clause names windowsweep as the
  party setting its policy and makes no claim that Polar cannot provide a remedy it owes.
- Every slot is new unless it quotes what it replaces.

## The lint hook cannot see the fenced copy

The fenced strings below are the shipping words, and the hook strips fences before it counts. They were checked by hand
against the banned list and the fingerprint's never-list. On a legal surface the fact-checker and the owner are the
gate, and a silent hook proves nothing at all about the clauses it never read.

---

## `/terms` - in the page's order

### T-01 · replaces `terms.account.optional` (wave: with 1.4.0)

**Was:** *"An account is optional, and neither program needs one: downloading and running them work the same without
it. Signing in is Google only, under Google’s own terms. One account covers this website and the desktop app."*

```json
"optional": "An account is optional, and neither program needs one. The command line works the same without it. The desktop app works without it too, on its Free plan’s monthly real runs for each machine, and signing in adds more. Signing in is Google only, under Google’s own terms. One account covers this website and the desktop app."
```

From 1.4.0 the desktop app no longer works *the same* signed out, because signing in adds real runs. The sentence keeps
every true part and names the one that changed. No figure is fixed here.

### T-02 · new section `terms.plans`, after `terms.account` (wave: early)

```json
"plans": {
  "title": "Plans and payment",
  "set": "From version 1.4.0, the desktop app has three plans: Free, Pro and Team. The <lnk>pricing page</lnk> shows what each includes, its price and its limits. Prices and limits can change, and that page always shows the current ones. The command line has no plan and nothing to buy.",
  "polar": "When checkout opens, Pro and Team can be bought on the pricing page or on the desktop app’s Plans screen, after signing in with Google. Card payment goes through a checkout run by Polar (polar.sh). Polar is the merchant of record: it takes the payment, charges any sales tax or VAT, and issues the receipt, under its own terms.",
  "renewal": "Once bought, a paid plan is billed in advance, monthly or yearly, and renews automatically at the end of each period until it is cancelled. Cancel any time; your plan runs to the end of the period you paid for. The account then moves to Free. Cancellation and receipts are handled in Polar’s customer portal.",
  "priceChange": "A paid plan renews at the price it started with until it is cancelled. A new price applies to new purchases.",
  "deletion": "Deleting the account cancels its paid plan with Polar first, so nothing is charged after the deletion.",
  "request": "While checkout is closed, the pricing page takes a plan request instead of a payment. From version 1.4.0, the desktop Plans screen does too. A request charges nothing and grants nothing.",
  "requestNext": "When checkout opens, the windowsweep team emails a link to pay for each open request, then closes the request.",
  "team": "When checkout opens, Team can be bought per seat, from the minimum number of seats the pricing page shows. The account that buys it owns the team. It can invite members by email and remove them. A removed member loses the team’s plan.",
  "referral": "A month of Pro earned through referrals extends any plan already paid for and never shortens one. How many confirmed friends earn a month, and how many months can be earned in any 12 months, are shown on the Plans screen and can change.",
  "misuse": "An account deliberately used to get around the run limits, or to collect referral rewards through accounts made for that purpose, may be deleted, and its referrals voided."
}
```

| Key | Note |
|---|---|
| `set` | *From version 1.4.0* keeps the clause true in the weeks before that release. `<lnk>` is `/pricing` |
| `polar` | The brief's merchant-of-record sentences, made conditional on checkout opening. *Under its own terms* mirrors *under Google's own terms* in `account.optional`, and no third-party address is written, as row 20 decided |
| `renewal` | The second sentence is `payment-copy.md`'s, verbatim. Polar hosts the portal; this clause makes no claim about how its link is delivered |
| `priceChange` | D67, stated as what a buyer keeps: the price a plan started with. Never phrased as a warning |
| `deletion` | D70: the server cancels the subscription before it deletes the account |
| `request`, `requestNext` | D63 and D68: the website takes requests early, the desktop Plans screen joins in 1.4.0, a request grants nothing, and the pay link is emailed when checkout opens before the request closes |
| `team` | Owner, seats from a minimum, invite and remove: D56 and macleanup's `teams` shape. *Loses the team's plan* is true whatever plan the member holds of their own |
| `referral` | The referral reference §4: the grant extends, never overwrites. No number, because all of them are admin fields |
| `misuse` | The owner chose to keep this clause on 2026-10-31, naming deliberate run-limit evasion and referral-account farming, with possible account deletion and referral voiding. The wording follows the contact form clause approved on 2026-09-24 (that run's ND-2, row 20): *"may be deleted"* |

### T-03 · new section `terms.refunds`, after `terms.plans` (wave: early)

```json
"refunds": {
  "title": "All purchases are final",
  "body": "Every purchase is final: Pro, Team, each billing period and each seat. windowsweep does not offer a refund, credit or exchange for any of them, including a period only partly used and seats left unused. If a bank or Polar reverses a payment, the plan time that payment covered ends at once, and you are told by email."
}
```

🔴 **The NO REFUNDS passage, plain and once.** It names every kind of purchase the product sells, as `payment-copy.md`
requires: two plans, their billing periods, and Team's seats. It states windowsweep's policy without claiming Polar
cannot provide a remedy it owes under law or its buyer terms. The third sentence is the returned-payment rule.

### T-04 · new section `terms.updates`, after `terms.software` (wave: with 1.4.0)

```json
"updates": {
  "title": "When an update is required",
  "body": "On start and every 15 minutes, the desktop app, this website and the documentation check whether a newer version is required. If one is, they can ask for the update before you continue, and they show the reason. A run already in progress is never stopped for it."
}
```

**Added by the writer, outside the dispatch list.** The block screen in `notices-1.4.0` stops a program until it updates.
A reader should meet that rule here before meeting the screen. Take it or cut it at GATE 4.

### T-05 · the page's head, its `/sitemap` blurb and its `llms.txt` line (wave: early)

**Was:** `seo.terms.description` *"Ahsan Mahmood runs windowsweep. Its software deletes files and is provided as is, under
the MIT licence, with no liability accepted for lost data."* · `sitemap.blurb.terms` *"Who runs it, the account rules, the
software as is under MIT, and the law. A notice to read before any account or download."*

```json
"seo.terms.description": "Ahsan Mahmood runs windowsweep. Its software deletes files and is provided as is under the MIT licence. Polar will handle payments when checkout opens.",
"sitemap.blurb.terms": "Who runs it, the account rules, plans and payment, the software as is under MIT, and the law. A notice to read before any account, download or plan."
```

```text
- [Terms](https://windowsweep.aoneahsan.com/terms): who runs windowsweep, the account rules, plans and how payment through Polar will work when checkout opens, the software as is under the MIT licence, and Pakistan law
```

The refund rule stays out of all three. A search result for the Terms page is read by someone who may be about to pay,
and the rule lives on the page itself.

`terms.changes` gets no new words. Its date moves at each wave.

---

## `/privacy` - in the page's order

### P-01 · `privacy.signedIn.lede`, its last clause (wave: with 1.4.0)

**Was:** *"... which is how you get to see the address bar you are typing into. What it uploads, in full:"*

```json
"lede": "Signing in is optional and it is Google. One account covers the desktop window and this website, so what follows is true of both. The window opens your normal browser rather than a panel inside the app, which is how you get to see the address bar you are typing into. What it syncs, in full:"
```

From 1.4.0 the app also sends a row for each real run, signed in or not, so *uploads, in full* would be false. *Syncs*
keeps the table's promise exact, and P-02 discloses the run rows.

### P-02 · new section `privacy.runs`, after `privacy.signedIn` (wave: with 1.4.0)

```json
"runs": {
  "title": "How the desktop app counts real runs",
  "lede": "From version 1.4.0, the desktop app counts real runs, because each plan allows a number of them a month. A dry-run, a scan or a report is never counted. Nothing run from the command line is counted either, because the command line makes no network call.",
  "device": "To count runs on a machine without a signed-in account, the app makes a random identifier the first time it starts and keeps it on the machine. It is not made from the machine’s name, its hardware or your Windows user name. The server records when the machine record was created and last seen. A hand-over code is held as a hash with an expiry while a machine is being moved. No machine name, host name or Windows version is stored with it.",
  "anonymous": "Signed out, the app opens an anonymous session with the account service, with no email address and no name, so the server can keep this machine’s count.",
  "claim": "Before a real desktop run starts, the app records a claim: the machine’s identifier, the month, the section numbers the run will cover, which allowance it uses, and your account if you are signed in. Never a path, a folder name, a file name or your machine name.",
  "belongs": "This machine’s count belongs to the machine, so signing in or out does not reset it. The extra runs that come with signing in are counted against your account, on whichever machine you use them."
}
```

| Key | Note |
|---|---|
| `lede` | Band R closes it. The command line's silence is the reason it cannot be counted, and that reason is checkable: self-test check [9] |
| `device`, `claim` | The new schema stores creation and last-seen times plus temporary hand-over metadata, but no machine name, host name or Windows version. `claim_run` records the claim before the engine starts |
| `anonymous` | D58 turns anonymous sign-ins on. *The account service* is the Terms' own name for it |

### P-03 · new section `privacy.plans` (wave: early)

In the early wave, put this section after the existing `privacy.signedIn` section and before `privacy.browser`.
When P-02 ships with 1.4.0, insert `privacy.runs` after `privacy.signedIn` and move this section after `privacy.runs`.

```json
"plans": {
  "title": "Plans and payments",
  "stored": "From desktop version 1.4.0, your account stores payment, grant and team records, including their dates and where each grant came from. Your current plan is worked out from those records, not stored as a separate plan field.",
  "polar": "When checkout opens, Polar (polar.sh) will take payments for windowsweep’s plans as the merchant of record. It will collect what it needs to take the payment and the tax, under its own privacy policy. windowsweep never receives your card number.",
  "received": "For each payment Polar takes, windowsweep will keep one record: the plan, the period it covers, the seat count, the amount, its status and Polar’s order number.",
  "final": "All purchases are final; windowsweep does not offer refunds. The <lnk>terms</lnk> say how a plan renews, ends and is cancelled.",
  "returned": "If a bank or Polar returns a payment, the plan time that payment covered ends, and you are told by email.",
  "request": "While checkout is closed, a plan request stores the plan, the billing period, the seat count and any optional note you provide, and when you asked. Nothing is charged.",
  "requestNext": "When checkout opens, the windowsweep team uses it once, to email you a link to pay, and the request closes."
}
```

| Key | Note |
|---|---|
| `stored` | The current plan is derived on read from payment, grant and team records; provenance stays on each grant |
| `received` | macleanup's `subscriptions` row, one per paid order, which the plan ports; conditional until checkout opens |
| `final` | 🔴 The plain Privacy passage `payment-copy.md` asks for, beside the Terms clause, in LabFlow's shape. `<lnk>` is `/terms` |
| `returned` | The same rule as T-03, in the page that says what data the return changes |

### P-04 · new section `privacy.referrals`, after `privacy.plans` (wave: with 1.4.0)

```json
"referrals": {
  "title": "Referrals",
  "body": "Each account has an invite code. When someone creates an account with it, windowsweep stores who invited whom, when the new account’s email was verified, and the points and Pro months earned. The account that invited sees a count and a state for each friend, never a name or an email address."
}
```

The referral reference §6: the page that shows referrals never shows who joined.

### P-05 · new section `privacy.teams`, after `privacy.referrals` (wave: with 1.4.0)

```json
"teams": {
  "title": "Teams",
  "invite": "An invite stores the email address it was sent to until it is accepted or expires. Only an account signed in with that address can accept it.",
  "owner": "The account that owns a team sees each member’s email address and seat. It also sees the shared fleet report. Its paged, synced run summaries show the date, mode, section numbers and bytes reclaimed for each member and machine. Never a path, a file name, a machine name or a user name."
}
```

A member must learn here, before accepting, what the team's owner will see of their runs. The set is D69's, exactly.

### P-06 · new section `privacy.emails`, after `privacy.teams` (wave: with the first email the product sends)

```json
"emails": {
  "title": "The emails an account receives",
  "body": "The windowsweep team sends account emails to your sign-in address, including a welcome, plan confirmation, payment-return notice and a link for an open plan request. A team invite can reach an address before its owner signs in. These messages go through the windowsweep team’s email service.",
  "newsletter": "The release newsletter goes only to an address that signed up for it, and each issue carries a link that removes the address at once."
}
```

| Key | Note |
|---|---|
| `body` | D58's `account-welcome`; the brief's confirmation email at each payment and renewal; the returned-payment notice; the plan-request link and Team invite. An invite can precede account creation. *The team's email service* is the brief's own phrase |
| `newsletter` | Ships with row 26's signup, not before. One-click removal is the growth law's floor for every send |

### P-07 · replaces `privacy.signedIn.alsoStored` (wave: with 1.4.0)

**Was:** *"Two more things are stored. ... Neither reaches Google Analytics 4, Amplitude, Clarity or Sentry."*

```json
"alsoStored": "Three more things are stored. The email address you signed in with is kept, so the account page can show you which account you are looking at and a message has somewhere to be answered. Anything you send through the contact form is kept in full, subject and message both. And the account notes when the notice bar was first shown to it, so another machine or browser does not show it again. None of them reaches Google Analytics 4, Amplitude, Clarity or Sentry."
```

The legal-notice rule marks the bar seen once per browser and once per account (D58's legal-notice seen flag).

### P-08 · replaces `privacy.signedIn.accountNote` and `deleteWhatStays` (wave: with 1.4.0)

**Was:** *"... Deleting removes the sign-in itself and everything stored against it: your profile, the settings the desktop
app has synced, your run summaries, and the messages you have sent. ..."* · *"What stays is not yours: when an admin
handles one of your messages, that action is logged ..."*

```json
"accountNote": "You can read every one of those values back on your <lnk>account page</lnk>, and delete the account from there. If it has a paid plan, deleting it first cancels the subscription with Polar, so nothing is charged afterwards. Deleting removes the sign-in itself and everything stored against it: your profile, your payment and grant records, the settings the desktop app has synced and your run summaries. Your invite code, referrals and team seat go too, with the messages you have sent. It happens immediately and it cannot be undone.",
"deleteWhatStays": "What stays is not yours. When an admin handled one of your messages or changed your plan, that action stays in the log with its id, what changed and who did it, and none of your words. A machine’s run claim stays with a random row id, its random install id, the month, the allowance it used and the section numbers, so deleting an account does not reset the count. A voided referral leaves an anonymous event with a random row id, a reason code and a date; it has no account, referral or invite code attached. Polar keeps its own record of each payment, under its own terms. Nothing on your machine is touched."
```

| Sentence | Source |
|---|---|
| The subscription is cancelled first | D70: the server cancels it with Polar, then deletes |
| The payment and grant records, invite code, referrals and team seat go | D70; the main session's settled schema facts, 2026-10-31 |
| The audit row keeps none of your words | the same settled facts |
| A machine's claim keeps the random row id and four allowance fields, without an account id or exact timestamp | D71; the schema agent removed `created_at` before application |
| A referral void leaves only an anonymous event id, reason code and date | The 1.4.0 `referral_voids` schema; no account id, referral id, email, invite code or free text |

The same two sentences also appear on `/account` (`account.deleteWhatGoes` and `deleteWhatStays`), so the keeper routes
the matching change to row 18.

### P-09 · replaces `privacy.unasked` (wave: with 1.4.0)

**Was:** title *"Two requests that run without being asked for"*; body *"On every start the desktop app fetches latest.json
... Neither request carries anything the app knows about you ..."*

```json
"unasked": {
  "title": "Requests that run without being asked for",
  "updater": "The desktop app fetches <mono>latest.json</mono> from the release page on every start, every six hours while it is open, and when it comes back into view, to see whether an update exists.",
  "release": "On start, every 15 minutes and on coming back into view, the desktop app, this website and the documentation each read the newest release record, to see whether an update is required. The record is selected by program and channel; it holds no information about you.",
  "webview": "On a machine with no WebView2, the installer downloads it from Microsoft.",
  "none": "The GitHub and Microsoft requests carry no account data. The release-record request may use your account session if you are signed in. GitHub, Microsoft and Supabase, which hosts the account service, see ordinary request details as any website does."
}
```

The title stops counting because a third request arrives with the release record, whose contents have no personal
field even though a signed-in session may accompany the request. Publication checks the final client path.

### P-10 · `privacy.browser`, its lede and two new entries (wave: with 1.4.0)

**Was:** lede *"Three kinds of thing. None of them is behind a banner, because this site does not ask."*

```json
"lede": "Five kinds of thing. None of them is behind a consent banner, because this site does not ask.",
"notice": {
  "title": "Whether the notice bar has been shown",
  "body": "So it shows once in this browser. Signed in, your account notes it too."
},
"update": {
  "title": "The newest version this browser was told to update to",
  "body": "So the update can be required from the next page load."
}
```

The notice bar is a bar, so *behind a banner* could read as false. *A consent banner* is what the sentence always meant.

### P-11 · the desktop window without Clarity (D64; wave: with 1.4.0)

D64 keeps Amplitude and Sentry in the desktop window. D75 keeps GA4's existing public Measurement ID and `gtag.js`
path there. The website keeps Clarity. Every approved sentence that puts a session replay in the desktop window turns
false the day 1.4.0 ships, so these replacements wait for that day; 1.3.2 still runs Clarity until it updates.

```json
"privacy.sends.web.f3": "<b>Microsoft Clarity</b>, on this website only, records a session replay: the page as you used it, with every piece of text masked. It sees where you moved and what you clicked. It does not see what any of it said. The desktop window does not run it.",
"seo.privacy.description": "The command line makes no network calls. The desktop window sends usage events and errors to three destinations, this site to four. There is no switch.",
"footer.analyticsNotice": "This site and the desktop window send usage events to Google Analytics 4 and Amplitude, and errors to Sentry, to improve the product for everyone. This site also runs Microsoft Clarity, which records session replays; the desktop window does not. There is no switch. The command line sends nothing. The whole of it is on the privacy page.",
"home.privacy.web.destinations": "Usage events go to Google Analytics 4 and Amplitude, and errors to Sentry. This website also runs Microsoft Clarity; the desktop window does not.",
"home.privacy.web.replay": "On this website, Clarity records session replays: your interactions with the interface, not the contents of your disk."
```

```text
- Three programs carry the name and only one of them is offline. The command-line engine makes no network
  calls at all - a self-test check greps every source file for HTTP and socket calls and fails the build on
  a hit. The desktop window and this website send usage events to Google Analytics 4 and Amplitude, and errors
  to Sentry. This website also runs Microsoft Clarity, which records session replays; the desktop window does
  not. There is no switch.
```

| Key | Row | Was |
|---|---|---|
| `privacy.sends.web.f3` | 17 | Clarity under *"The desktop window and this website send analytics"*, with no scope |
| `seo.privacy.description` | 17 | *"... send usage events and errors to four destinations"*, of both programs |
| `footer.analyticsNotice` | 17, the footer notice line | Clarity named for *"This site and the desktop window"* |
| `home.privacy.web.*` | 16 | the same, in the home page's privacy band |
| `llms.txt`, the network fact | 19 | the same, in the answer an engine quotes |

Unchanged on purpose: `privacy.signedIn.alsoStored` still names the four tools, which stays true, and the site's
changelog entry for 1.3.2 still says the replay ran in that release, because it did. The desktop window's own strings
are in `notices-1.4.0`, N-016.

---

## NEEDS DECISION

Answered on 2026-10-31, and applied above:

| Question | Answer | Where it lands |
|---|---|---|
| ND-1, what follows a plan request | D68 | T-02 `request`, `requestNext`; P-03 `requestNext` |
| ND-2, what the fleet report shows | D69 | P-05 `owner` |
| ND-3, the schema facts | settled in the main session, with D71 | P-02 `device`; P-08 |
| ND-5, a price change and a running plan | D67 | T-02 `priceChange` |

**ND-6 resolved, 2026-10-31:** the owner chose to keep the misuse sentence in T-02, naming deliberate run-limit evasion or referral-account farming and the possible account deletion and referral voiding. The legal GATE 4 still covers the final clause.

---

## Self-check

- **Palette.** P carries every clause. R lands where a refusal reassures: *"windowsweep never receives your card number"*,
  *"Never a path, a folder name, a file name or your machine name"*, *"never a name or an email address"*, *"A run already
  in progress is never stopped for it"*, *"A request charges nothing"*. No humour, no urgency, no softening of T-03.
- **Rhythm.** Shortest sentence: *"Nothing is charged."* (three words, P-03). Longer sentences explain the machine
  record and deletion consequences; shorter ones state what is kept or refused.
- **Length.** As the clauses need: the Terms' new and replaced strings remain about 500 words across T-01 to T-04.
  The Privacy additions run across P-01 to P-11. The factual corrections add only fields needed for an honest account
  of the data.
- **Unsure.** ND-6 is resolved by the owner's choice. T-04 is still offered for him to take or cut at GATE 4.

### Banned words and tells

The fenced clauses hold no banned phrase and no word from the fingerprint's never-list, checked by hand with the hook's
own matching rule. They carry no exclamation mark and no em dash. Nor any *we*, *us* or *our*. The refund rule appears once in
each page, plainly, and nowhere a person pays: not in the head strings, not on `/sitemap`, not in `llms.txt`.

### Every fact, with its source

| Fact | Source |
|---|---|
| Three plans from 1.4.0; prices and limits change; the command line has nothing to buy | D56; the brief's *What is not sold* |
| Bought on the pricing page or the Plans screen, signed in with Google, paid by card | the brief's payment model |
| Polar is the merchant of record: payment, sales tax or VAT, receipt | the brief's payment model |
| Billed in advance, renews automatically, cancel any time, runs to the end of the period, then Free | the brief; `payment-copy.md` |
| Cancellation and receipts in Polar's customer portal | `aoneahsan-cccs-polar-payments` §7; no verified link delivery method |
| A request charges nothing while checkout is closed | D61 |
| A request grants nothing; each open request is emailed a link to pay when checkout opens, and closes | D68 |
| A running plan renews at the price it started with; a new price applies to new purchases | D67 |
| Deleting an account cancels its Polar subscription first | D70 |
| After a deletion, a machine claim keeps the random row id, install id, month, allowance and sections; no exact timestamp | D71; corrected 1.4.0 schema |
| `devices` stores record timestamps and temporary hand-over metadata, but no machine name, host name or Windows version; payment and grant records, invite code, referrals and seat go with the account; an admin change is audited without the person's words | the main session's settled facts, 2026-10-31 |
| A voided referral leaves an anonymous event with a random id, reason code and date; it cannot be joined to the deleted account | the 1.4.0 `referral_voids` schema, 2026-10-31 |
| The fleet report: paged synced run summaries by member and machine, date, mode, sections run, bytes reclaimed; never a path, file name, machine name or user name | D69 |
| The desktop window: Amplitude, Sentry and GA4 through the existing public Measurement ID and `gtag.js`, with no Clarity; the website keeps Clarity | D64; D75 |
| Team per seat from a minimum; the owner invites and removes | D56; macleanup `teams`, `team_invites` |
| A referral month extends a paid plan and never shortens one | the referral reference §4 |
| Every purchase final; windowsweep offers no refund, credit or exchange; a reversed payment ends its plan time | `payment-copy.md`; the brief's *Policies*; Polar buyer terms govern its legally required remedies |
| The update check on start, every 15 minutes and on return; a run is never stopped for it | `contract.md` *The client gate*; the approved plan, wave 2 |
| The updater: start, every six hours, on resume | the approved plan, wave 2 |
| A random device id; an anonymous session with no email and no name | D58; macleanup `devices` |
| One pre-run claim: device, month, sections, allowance, account if signed in | 1.4.0 `claim_run` contract |
| One record per payment: plan, period, seats, amount, status, Polar's order number | macleanup `subscriptions` |
| The notice bar's flag on the account | D58; `legal-notice.md` |
| Emails: welcome, plan confirmation, returned payment, plan-request link and team invite | D58 `account-welcome`; the brief's flow step 10; `payment-copy.md`; `team_invites` |
| No machine name, folder name or path is ever stored | Bible §7; `account.neverStored` |

### Measured lengths

| String | Characters | Limit |
|---|---|---|
| `seo.terms.description` (T-05) | 151 | 155 |
| `sitemap.blurb.terms` (T-05) | 148 | the other blurbs run 95 to 133; this one gains *plans and payment* |
| `seo.privacy.description` (P-11) | 151 | 155 |
| T-03 `refunds.body` | about 60 words | plain and once |
