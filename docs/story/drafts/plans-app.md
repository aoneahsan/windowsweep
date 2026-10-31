# plans-app - the desktop Plans screen, the run count and its limit, the plan request, referrals, Team, and the website's `/account` plan block

Content-map row **22** · awareness **working, mid-task, sometimes at a limit** · structure **the state first (plan, runs
left, reset date) -> the one action** · tone band **P, W once at most, never at a limit** · length **microcopy** · CTA
**upgrade or request** · schema **none** · gate **GATE 2 and GATE 4 pre-authorised under D59** for the new strings. The
replacements in S-012 belong to rows 11 and 13, whose GATE 4 is the owner's own.

Round 1, 2026-10-31: the owner's answers applied. D66 settles ND-7, D68 settles ND-1, D69 sets the fleet report and D70
adds the cancellation to both account-deletion strings. No question is open.

**Framework: Walter's hierarchy, with BAB at the limit.** Usable before pleasurable: every screen states the plan and
its count before it offers anything. The limit-reached state is Before, After, Bridge: the count is used,
then what still works and when the count returns, then three ways on. None of them hurries. A limit is a fact about
a month, never about the person who reached it.

## Sources

| Source | What it gives these strings |
|---|---|
| D56, D62 (`docs/PROJECT-CONTEXT.md`, Session 21) | the plans, the two pools, Team's minimum, the referral numbers; what Free keeps |
| D61 | checkout dormant; a plan request instead of a pay button |
| D66, D68, D69, D70 (2026-10-31) | the weekly task removed once on Free; what a request does; the fleet report; deletion cancels a paid plan first |
| The approved brief (GATE 4, 2026-10-31) | the pool arithmetic, the real-run definition, the referral rule, the payment flow |
| `aoneahsan-cccs-plans-entitlements` and its referral reference | the banked month, the cap that stops only the plan grant, never naming who joined, extend never overwrite |
| `aoneahsan-cccs-polar-payments` §3 and §7 | a redirect never grants a plan; Polar hosts the customer portal for receipts and cancellation |
| The approved plan, wave 6 | the macleanup ports: devices, run claims, the account pool, teams and invites |
| Desktop catalogues `shell`, `home`, `account`; site `account.json` | the shapes extended, and the approved strings S-012 replaces |
| Story Bible §4, §7, §10 and the fingerprint | the palette, *machine*, *the windowsweep team*, the rehearsal motif |

## Conventions

- **Desktop keys are flat**, in a new `desktop/src/i18n/locales/en/plans.json`, matching `account.json` and `home.json`.
  `<1>`/`<3>` are `Trans` indexes, as `history.showing` uses them. Nested plurals use `$t(key, {"count": n})`, the
  pattern `home.heroSubMeasured` already ships.
- **Site keys nest**, in `windowsweep-web/src/lib/i18n/locales/en/account.json`.
- **Every figure is a data slot.** Run counts, prices and the referral numbers come from the server's read of the plan
  rows and `app_config`; dates come formatted by `Intl` in en-GB, local time.
- **The click dummy owns the words.** These go into `desktop/design/` first (CLAUDE.md, D59). The app follows.
- Every slot is new copy unless it quotes what it replaces.

## The lint hook cannot see the fenced copy

Every shipping string sits in a fence, and the hook strips fences before it counts. Its silence on this file describes
the commentary. The fenced copy was checked by hand against the banned list and the fingerprint's never-list, so the
fact-checker remains the gate that matters.

| Finalizer probe, 2026-10-31 | Result |
|---|---|
| Banned-list sentinel inside a shipping slot | Hook silent, exit 0 |
| Same sentinel in a prose paragraph | Named failure, exit 2 |
| Original bytes | Restored; SHA-256 hashes matched |

The hook's clean exit covers commentary only. The fenced strings need the fact review and a human read.

---

## The desktop app

### S-001 · navigation and the status bar (`shell.json`)

```json
"nav.plans": "Plans",
"nav.team": "Team",
"status.plans": "real runs are counted - dry-runs never are",
"status.team": "run summaries only - no path reaches the fleet report"
```

Both status lines keep the bar's lower-case, hyphen-joined shape (`status.picker`, `status.report`).

### S-002 · the Plans screen - the state first

```json
"plans.eyebrow": "Your plan",
"plans.name.free": "Free",
"plans.name.pro": "Pro",
"plans.name.team": "Team",
"plans.meter.left_one": "{{count}} of {{total}} real runs left this month",
"plans.meter.left_other": "{{count}} of {{total}} real runs left this month",
"plans.meter.reset": "The count starts again on {{date}}.",
"plans.meter.never": "Dry-runs, scans and reports are never counted.",
"plans.meter.loading": "Reading this month’s count",
"plans.meter.loadFailed": "This month’s count could not be read. Dry-runs and scans never need it."
```

| Key | Note |
|---|---|
| `plans.name.*` | Keyed by plan id. A plan an admin creates later shows its row's own name |
| `plans.meter.reset` | `{{date}}` is the server's month boundary formatted in local time. If that boundary is UTC midnight, a reader west of UTC sees the last day of the old month, which is correct |
| `plans.meter.never` | Band R, and the Bible's rehearsal motif in one line |

### S-003 · the two pools, one line each

```json
"plans.pool.device_one": "This machine: {{count}} real run a month, used first.",
"plans.pool.device_other": "This machine: {{count}} real runs a month, used first.",
"plans.pool.account_one": "Your account: {{count}} more a month, used after this machine’s, on any machine you sign in to.",
"plans.pool.account_other": "Your account: {{count}} more a month, used after this machine’s, on any machine you sign in to.",
"plans.pool.signedOut_one": "A Free account has {{count}} extra real run a month, shared across machines. Sign in to see what remains.",
"plans.pool.signedOut_other": "A Free account has {{count}} extra real runs a month, shared across machines. Sign in to see what remains."
```

Each line names its pool, its size and its turn. The order, this machine first and the account second, is the
allowance order the plan ports from macleanup's `claim_run()`. Signed out, the account balance is unknown: another
machine may have spent some of it already.

### S-004 · Pro, Team and granted plans

```json
"plans.paid.noLimit": "No monthly limit on real runs.",
"plans.paid.renews": "Renews on {{date}}.",
"plans.paid.ends": "Ends on {{date}}. Another active subscription, grant or Team seat still applies; otherwise Free.",
"plans.paid.teamMember": "Pro through the {{team}} team.",
"plans.paid.granted": "{{plan}} until {{date}}, granted by the windowsweep team.",
"plans.paid.referral": "{{plan}} until {{date}}, earned through referrals.",
"plans.paid.banked_one": "{{count}} month of Pro is banked from referrals. Its start follows your recorded paid plan, Team seat or admin grant of the same or higher rank; a later renewal may move it.",
"plans.paid.banked_other": "{{count}} months of Pro are banked from referrals. Their start dates follow your recorded paid plan, Team seat or admin grant of the same or higher rank; later renewals may move them.",
"plans.paid.portal": "Receipts and cancellation are in Polar’s customer portal."
```

| Key | Note |
|---|---|
| `plans.paid.granted` / `referral` | Provenance the reader can see, so a plan never appears from nowhere |
| `plans.paid.banked_*` | The referral reference: the start follows recorded same-or-higher entitlement, including a Team seat, and may move after renewal |
| `plans.paid.portal` | No *Manage billing* button: `polar-payments` §7 builds no portal route; Polar hosts the customer portal |

### S-005 · choosing Pro or Team - state B, checkout open

```json
"plans.choose.title": "Pro and Team",
"plans.choose.billing": "Billing",
"plans.choose.monthly": "Monthly",
"plans.choose.yearly": "Yearly",
"plans.choose.perMonth": "{{price}} a month",
"plans.choose.perYear": "{{price}} a year",
"plans.choose.perSeatMonth": "{{price}} a seat a month",
"plans.choose.perSeatYear": "{{price}} a seat a year",
"plans.choose.yearlyNote": "Paid yearly: {{year}} instead of {{atMonthly}}.",
"plans.choose.pro": "No limit on real runs, plus schedules, reports across up to {{machines}} machines and a history export.",
"plans.choose.team": "Pro for every seat, from {{min}} seats, and one fleet report across the team’s machines.",
"plans.choose.seats": "Seats",
"plans.choose.seatsHint": "From {{min}}.",
"plans.choose.current": "Your plan",
"plans.choose.subscribePro": "Subscribe to Pro",
"plans.choose.subscribeTeam": "Subscribe to Team",
"plans.choose.consent": "By continuing, you agree to our <1>Terms of Service</1> and <3>Privacy Policy</3>.",
"plans.choose.signIn": "A plan belongs to an account. Sign in with Google to choose one.",
"plans.choose.signInAction": "Sign in with Google",
"plans.choose.opening": "Opening the checkout in your browser…",
"plans.choose.openFailed": "The checkout did not open: {{message}}. Nothing was charged.",
"plans.choose.waiting": "The checkout is open in your browser. The plan updates here once Polar confirms the payment.",
"plans.choose.active": "{{plan}} is on this account now, with no limit on real runs.",
"plans.choose.loadFailed": "The plans could not be read. Dry-runs and scans are not affected."
```

| Key | Note |
|---|---|
| `plans.choose.consent` | 🔴 Renders exactly *"By continuing, you agree to our Terms of Service and Privacy Policy."*, small and muted, directly under each subscribe or request button. The only payment-terms text on the screen. *Our* is fleet law's word, not the voice's |
| `plans.choose.waiting` | The webhook grants the plan, never the browser's return (`polar-payments` §3) |
| `plans.choose.active` | No celebration. A fact and what it changes |

### S-006 · the plan request - state A, checkout closed

```json
"plans.request.closed": "Checkout is not open yet. A request records the plan you want on your account. Nothing is charged.",
"plans.request.next": "A request grants nothing. When checkout opens, the windowsweep team emails you a link to pay and marks the request notified. The team closes it separately.",
"plans.request.pro": "Request Pro",
"plans.request.team": "Request Team",
"plans.request.sending": "Sending the request…",
"plans.request.sent": "Request recorded for {{plan}}. Submitting it charged nothing and granted nothing. The windowsweep team emails you a link to pay when checkout opens.",
"plans.request.pending": "You asked for {{plan}} on {{date}}. Submitting the request charged nothing and granted nothing. When checkout opens, the windowsweep team emails you a link to pay.",
"plans.request.notified": "A link to pay was emailed on {{date}}. The request is marked notified until the windowsweep team closes it.",
"plans.request.failed": "The request did not reach the server, so nothing was recorded. Try again in a moment."
```

The request buttons stand where the subscribe buttons will, with the same consent line under each, and the billing
switch and the seat count stay, so a request names exactly what was asked for.

### S-007 · the limit reached - Plans, Home and Run

```json
"plans.limit.titleDevice_one": "This machine’s {{count}} real run for this month is used.",
"plans.limit.titleDevice_other": "This machine’s {{count}} real runs for this month are used.",
"plans.limit.titleAll_one": "This month’s {{count}} real run is used.",
"plans.limit.titleAll_other": "This month’s {{count}} real runs are used.",
"plans.limit.body": "The count starts again on {{date}}. Until then, dry-runs and scans carry on, and neither is counted.",
"plans.limit.signIn_one": "A Free account has {{count}} extra run a month across machines. Sign in to see what remains.",
"plans.limit.signIn_other": "A Free account has {{count}} extra runs a month across machines. Sign in to see what remains.",
"plans.limit.signInAction": "Sign in with Google",
"plans.limit.pro": "Pro has no monthly limit.",
"plans.limit.proAction": "See plans",
"plans.limit.cli": "The command line runs the same engine and is never counted. Rehearse first. Then run the same command without --dry-run:",
"plans.limit.cliSections": "npx windowsweep --dry-run --only {{sections}} --yes",
"plans.limit.cliSafeBatch": "npx windowsweep --dry-run --all --yes",
"plans.limit.copy": "Copy the command",
"plans.limit.inline": "No real runs left this month. A dry-run still works."
```

| Key | Note |
|---|---|
| `titleDevice` / `titleAll` | Signed out, only this machine's pool exists; signed in, both pools are spent. The number is the subject, never the reader |
| `body` | After, in BAB: what still works, and the date the count returns |
| `signIn_*` | Shown only signed out. The account pool may already be partly or fully spent on another machine |
| `cli`, `cliSections`, `cliSafeBatch` | The rehearsal motif, fingerprint sentence 1. `{{sections}}` is the run's own list, comma-joined (`1,7,10`); the safe batch uses `--all`, the brief's own command. `--yes` never answers for sections 17, 18, 19 and 23, so the command cannot run past a person |
| `inline` | Beside Home's Reclaim button and Run's *Start the safe run* while the count is spent |

State decides. **One primary action by state.** Signed out: `signInAction` is primary, and the balance is read after sign-in. Signed in with
both Free pools spent: `proAction` is primary. The command remains visible as a quieter alternative in both states;
it never runs from this screen. No line says *upgrade now*, *you have used*, *only* or *hurry*.

### S-008 · the weekly schedule on Free (Home and Settings)

```json
"home.scheduleLocked": "The weekly scheduled run is part of Pro in the desktop app.",
"home.scheduleCli": "On any plan, a command line installed with npm sets up the same weekly task with windowsweep --install-task, and it needs no account.",
"home.scheduleSeePlans": "See plans",
"settings.scheduleLocked": "Part of Pro in the desktop app. A command line installed with npm sets up the same task with --install-task, on any plan."
```

*The same task*: the window's switch maps to `--install-task` (`settings.scheduleConseq`), so the command line builds
the identical Scheduled Task. *Installed with npm*, because `--install-task` refuses to run from an npx cache.

**The one-time notice (D66).** On the first start of 1.4.0, a Free user's weekly task from 1.3.2 is removed, and Home
says so once, above the Schedule panel:

```json
"home.scheduleRemovedTitle": "The weekly scheduled run was removed from this machine.",
"home.scheduleRemovedWhy": "From 1.4.0, the weekly schedule in the desktop app is part of Pro. Only the task was removed; nothing else on this machine changed.",
"home.scheduleRemovedAlternatives": "To keep a weekly run, choose Pro, or set up the same task with windowsweep --install-task from a command line installed with npm. That one is free and needs no account.",
"home.scheduleRemovedPlans": "See plans",
"home.scheduleRemovedOkay": "Okay"
```

It names what was touched and what was not, gives the reason in one sentence, and offers both of D66's alternatives
side by side. Pro comes first only because it keeps the switch in this window. No line apologises or hurries. Once
dismissed, the notice never returns.

### S-009 · the referral panel

```json
"plans.referral.title": "Your referrals",
"plans.referral.counts": "A friend counts when their email is verified before the referral window closes.",
"plans.referral.points": "Each confirmed friend earns you $t(plans.referral.pointCount, {\"count\": {{points}} }).",
"plans.referral.months": "For every $t(plans.referral.friendCount, {\"count\": {{threshold}} }), you get $t(plans.referral.proMonthCount, {\"count\": {{months}} }), up to $t(plans.referral.monthCount, {\"count\": {{cap}} }) in any rolling 365 days.",
"plans.referral.pointCount_one": "{{count}} point",
"plans.referral.pointCount_other": "{{count}} points",
"plans.referral.friendCount_one": "{{count}} confirmed friend",
"plans.referral.friendCount_other": "{{count}} confirmed friends",
"plans.referral.proMonthCount_one": "{{count}} month of Pro",
"plans.referral.proMonthCount_other": "{{count}} months of Pro",
"plans.referral.monthCount_one": "{{count}} month",
"plans.referral.monthCount_other": "{{count}} months",
"plans.referral.codeLabel": "Your invite code",
"plans.referral.copyLink": "Copy the invite link",
"plans.referral.copied": "Invite link copied.",
"plans.referral.share": "windowsweep reclaims disk space on Windows and names every path before it touches one. Try it through this invite: {{link}}",
"plans.referral.confirmed_one": "{{count}} friend confirmed",
"plans.referral.confirmed_other": "{{count}} friends confirmed",
"plans.referral.waiting_one": "{{count}} waiting for a verified email",
"plans.referral.waiting_other": "{{count}} waiting for a verified email",
"plans.referral.expired_one": "{{count}} invite expired before verification",
"plans.referral.expired_other": "{{count}} invites expired before verification",
"plans.referral.pointsTotal_one": "{{count}} point",
"plans.referral.pointsTotal_other": "{{count}} points",
"plans.referral.monthsEarned_one": "{{count}} month of Pro earned",
"plans.referral.monthsEarned_other": "{{count}} months of Pro earned",
"plans.referral.badges_one": "{{count}} referral badge, dated the day its friend was confirmed",
"plans.referral.badges_other": "{{count}} referral badges, each dated the day its friend was confirmed",
"plans.referral.badgeAward": "Referral badge: {{name}}, awarded {{date}}.",
"plans.referral.capReached": "Referral Pro months have reached the rolling 365-day cap. Confirmations still earn points and badges. After the cap clears, another completed threshold can earn a month.",
"plans.referral.empty": "No friend has joined with your code yet.",
"plans.referral.signedOut": "Sign in with Google to get an invite code.",
"plans.referral.off": "Invites are not open right now.",
"plans.referral.enterLabel": "Invited by a friend? Their code",
"plans.referral.enterSave": "Save the code",
"plans.referral.enterSaved": "Code saved on this machine. It will be checked when you sign in.",
"plans.referral.enterPending": "Code recorded. It is waiting for this account’s email to be verified.",
"plans.referral.enterTooLate": "This code was submitted too late for this account. Nothing was counted.",
"plans.referral.enterInvalid": "That is not an invite code. Check it and try again."
```

| Key | Note |
|---|---|
| `counts` | The referral eligibility rule, including the time limit |
| `points`, `months` | Nested plurals, so every admin value reads grammatically, 1 included. The numbers come with the counts in one read (the referral reference §2) |
| `share` | The copied text. Its first sentence is the About panel's approved claim (D-67), shortened |
| `confirmed`, `waiting`, `expired` | A count and a state. Never a name or an address: the referral reference §6. Expired pending invites earned no points, badge or plan month |
| `badges_*`, `badgeAward` | Each valid confirmation adds one dated, stacking `referral_badge_awards` row. The catalogue supplies `{{name}}`; `{{date}}` formats `awarded_at` |
| `capReached` | Over the cap, points and badges land. Cap clearance alone awards nothing; a later confirmation must complete another threshold. No exact next-award date is promised |
| `enter*` | A code saved signed out is checked at sign-in; `too_late` and `pending` come from the server. The copy never treats a saved code as a confirmed referral |

Render `confirmed`, `waiting`, `expired`, `pointsTotal`, `badges_*` and `monthsEarned` before the invite code and
share action. A new account sees the empty state first, then the one invite action.

### S-010 · Team

```json
"plans.team.eyebrow": "Team",
"plans.team.title": "Team status",
"plans.team.ownerState": "You own this team. {{used}} of {{seats}} seats in use.",
"plans.team.lede": "Team gives every seat Pro. The fleet report shows each member’s runs by machine: date, mode, sections run and bytes reclaimed. Never a path, file name, machine name or Windows user name.",
"plans.team.locked": "The fleet report comes with Team, which is Pro for every seat, from {{min}} seats.",
"plans.team.lockedAction": "See plans",
"plans.team.createTitle": "Name the team",
"plans.team.createLabel": "Team name",
"plans.team.createAction": "Create the team",
"plans.team.createEmpty": "Give the team a name.",
"plans.team.created": "Team created.",
"plans.team.seats": "{{used}} of {{seats}} seats in use",
"plans.team.memberState": "Team member. Your seat is active.",
"plans.team.seatsNote": "An open invite holds a seat until it is accepted.",
"plans.team.inviteTitle": "Invite by email",
"plans.team.inviteLabel": "Email address",
"plans.team.invitePlaceholder": "name@example.com",
"plans.team.inviteAction": "Send the invite",
"plans.team.inviteHow": "They accept by signing in to windowsweep with that address.",
"plans.team.invited": "Invite email sent to {{email}}.",
"plans.team.inviteEmailUnconfirmed": "Invite recorded for {{email}}. Email delivery was not confirmed. They can sign in with that address to see the invite.",
"plans.team.inviteInvalid": "Enter an email address, such as name@example.com.",
"plans.team.inviteOpen": "An invite to {{email}} is already open.",
"plans.team.noSeat": "Every seat is in use or held by an open invite. Removing a member frees one.",
"plans.team.colMember": "Member",
"plans.team.colRole": "Role",
"plans.team.colStatus": "Status",
"plans.team.roleOwner": "Owner",
"plans.team.roleMember": "Member",
"plans.team.statusActive": "Active",
"plans.team.statusInvited": "Invited",
"plans.team.remove": "Remove",
"plans.team.removed": "{{email}} removed. The seat is free.",
"plans.team.fleetTitle": "Fleet report",
"plans.team.fleetLede": "Each member, machine by machine, up to {{perSeat}} machines a seat.",
"plans.team.fleetEmpty": "Nothing to report yet. A fleet report needs a fleet: it starts with the first run on a seat’s machine.",
"plans.team.failed": "That did not go through: {{message}}. Nothing changed."
```

| Key | Note |
|---|---|
| `lede` | D69's list, word for word in substance: per member and machine, date, mode, sections run and bytes reclaimed. Band R closes it |
| `seatsNote`, `inviteHow` | macleanup's invite rules, which the plan ports: an open invite holds a seat, and only a signed-in account whose verified email matches can accept |
| `invited`, `inviteEmailUnconfirmed` | Use `invited` only when `email_sent` is true. A rejected or uncertain send returns false; the invite row exists, but delivery cannot be claimed |
| `fleetEmpty` | The surface's one W line, on a screen nobody reaches at a limit or at a payment |
| `invitePlaceholder` | `example.com` is reserved for examples, so it names nobody |

For an existing owner, render `title` and `ownerState` before the fleet-report lede or invite controls. For a member,
render `title` and `memberState` first. The locked state leads with `locked` and its one `lockedAction`.

---

## The website

### S-011 · the `/account` plan block, and the page lede that now names it

**Replaces `account.lede`:** *"This page holds the profile, the settings the desktop app has synced and your run
summaries. The messages you have sent are listed on the contact page."*

```json
"lede": "This page holds your plan, the profile, the settings the desktop app has synced and your run summaries. The messages you have sent are listed on the contact page.",
"plan": {
  "title": "Plan",
  "free": "Free. Each machine’s monthly allowance for real runs is {{freeDeviceRuns}}. The account’s monthly pool, shared across machines, is {{freeAccountRuns}}. The desktop app shows what remains.",
  "accountLeft_one": "This account’s extra runs: {{count}} of {{total}} left this month.",
  "accountLeft_other": "This account’s extra runs: {{count}} of {{total}} left this month.",
  "noLimit": "No monthly limit on real runs.",
  "renews": "{{plan}}, renewing on {{date}}.",
  "ends": "{{plan}} until {{date}}. Another active subscription, grant or Team seat still applies; otherwise Free.",
  "teamMember": "Pro through the {{team}} team.",
  "teamOwner_one": "Team, {{count}} seat, renewing on {{date}}.",
  "teamOwner_other": "Team, {{count}} seats, renewing on {{date}}.",
  "granted": "{{plan}} until {{date}}, granted by the windowsweep team.",
  "referral": "{{plan}} until {{date}}, earned through referrals.",
  "requested": "You asked for {{plan}} on {{date}}. Submitting the request charged nothing and granted nothing. When checkout opens, the windowsweep team emails you a link to pay.",
  "notified": "A link to pay was emailed on {{date}}. The request is marked notified until the windowsweep team closes it.",
  "portal": "Receipts and cancellation are in Polar’s customer portal.",
  "seePlans": "See plans"
}
```

| Key | Note |
|---|---|
| `free` | The site reads the account, not a machine, so it states both pools and leaves the per-machine count to the window |
| `accountLeft_*` | Rendered only if the site reads the account pool. Otherwise `free` stands alone |
| `requested` | State A's line, carrying D68 as the desktop request block does |

The page's deletion band gains D70, so it says what happens to a paid plan before it says what goes (row 18's string,
routed by the keeper with P-08 of `legal-payments`):

```json
"deleteWhatGoes": "Deleting removes the sign-in itself and everything stored against it: the profile and plan on this page, the settings the desktop app has synced and your run summaries. Your invite code, referrals and team seat go too, with the messages you have sent. A paid plan is cancelled with Polar first, so nothing is charged afterwards. It happens immediately. It cannot be undone."
```

The same block, in the head and on `/sitemap`:

```json
"seo.account.description": "Your plan, your email and display name, the desktop settings this account has synced, your last runs, sign-out and account deletion.",
"sitemap.blurb.account": "Your plan, email, display name, the desktop settings this account has synced (read-only), the last runs, sign-out and deletion."
```

---

## Approved desktop strings 1.4.0 makes false - proposals for rows 11 and 13

The keeper routes these. Each sentence was approved by the owner (rows 11 to 13) and turns false the day real runs are
counted, so his GATE 4 decides them, dummy first.

### S-012 · Account, Home and the status bar

```json
"account.title": "Sign in to check your account’s extra real runs, or use your settings on another machine.",
"account.lede": "Dry-runs and scans are <1>never counted</1>. A Free account has extra real runs each month, shared across machines. Sign in to see what remains, hold your plan and sync your settings and run summaries.",
"account.cardBody": "Every section and every safety check works signed out, with {{freeDeviceRuns}} real runs a month on this machine. Sign in to see what remains in your account’s shared pool, and to sync settings and run summaries.",
"status.account": "sync is optional - sign in to check extra runs",
"home.privacySignIn": "Signing in is optional. It syncs your settings and a summary of each run, and holds your plan and its monthly run count.",
"account.stored.plan.field": "Plan",
"account.stored.plan.why": "So every machine you sign in to applies the same limits.",
"account.stored.runCount.field": "Run count",
"account.stored.runCount.why": "One row per real run, signed in or not: this machine’s random id, the month and the section numbers. The monthly limit reads it.",
"account.stored.invite.field": "Invite code",
"account.stored.invite.why": "So a friend who joins with it is counted for you.",
"account.deleteWhatGoes": "This removes the account itself, its profile and plan, the settings it synced, the summary of every run it holds, its invite code, referrals and team seat, and any contact requests you sent. A paid plan is cancelled with Polar first, so nothing is charged afterwards. It happens the moment you press the button, and there is no undo."
```

| Key | Was | What makes it false |
|---|---|---|
| `account.title` | *"Sign in only if you want your settings on another machine."* | sign-in now gives access to any remaining runs in the account pool |
| `account.lede` | *"Reclaiming space is <1>never gated</1>. ... and that is all it does."* | real runs are counted from 1.4.0 |
| `account.cardBody` | *"You are using every feature windowsweep has. Signing in adds one thing: ..."* | schedules move to Pro; signing in also gives access to the account pool |
| `status.account` | *"sync is optional - runs are never gated"* | the same |
| `home.privacySignIn` | *"... and nothing else."* | the account also holds the plan and its count |
| `account.stored.*` | the table lists four rows | three more kinds of row exist, with the run-count fields the main session settled |
| `account.deleteWhatGoes` | *"... and any contact requests you sent us. ..."* | D70 cancels a paid plan first; the plan, invite code, referrals and seat go too. *Us* leaves with it, since the voice has no *we* |

The retired Consent screen's strings are not touched here. The plan keeps its *Never sent* list in Settings, Privacy.

---

## NEEDS DECISION

None is open on this row. Both questions were answered on 2026-10-31.

- **ND-1, answered by D68.** Submitting a request grants nothing and charges nothing. When checkout opens, the
  windowsweep team emails a pay link and marks the request notified. A separate admin action closes it.
  `plans.request.next`, `plans.request.sent`, `plans.request.pending`, `plans.request.notified` and
  `account.plan.requested` carry the states.
- **ND-7, answered by D66.** 1.4.0 removes a Free user's weekly task on its first start and says so once, naming Pro
  and the free `--install-task`. S-008's five `home.scheduleRemoved*` strings are that notice.

---

## Self-check

- **Palette.** P owns every state line, every meter and the limit's title and body. R lands in `plans.meter.never`,
  `status.team`, the request block's *nothing is charged* and Team's lede. W appears once, in `plans.team.fleetEmpty`,
  well away from any limit or payment.
- **Rhythm.** Shortest: one-word labels and *"Free."* opening the `/account` block. Row 22's longest own strings are
  `plans.team.lede` at 33 words and `plans.paid.banked_*` at 32; `plans.request.sent` is 23. The two account-deletion replacements are longer safety
  copy, at 59 and 63 words, and route through their original rows. The limit opens with shorter state lines.
| Humanize check | Result |
|---|---|
| Shipping values | 194; 1,888 words; sentence-length variation 0.77 (floor 0.45) |
| Range | 151 sentences of six words or fewer; three of at least 25. The per-150-word rule is allowed for this microcopy: buttons and limit notices need short lines |
| Stance and hedge | Actions and consequences carry the stance; exact account states need no speculative hedge |
| Voice | Checked against the twelve fingerprint sentences; the fingerprint remains uncalibrated by owner samples |
- **Length.** Row 22 stays microcopy: its own strings are at most 33 words and three sentences. The two deletion
  replacements have their original safety-surface review. Every button is three words or fewer except *Copy the
  invite link* and *Sign in with Google*, the label `account.signIn` already ships.
- **Unsure.** No owner decision is open. The backend contract anchors the referral window to the first verified
  conversion; the panel leaves the exact deadline to server status.

### Banned words and tells

Every referral line uses the server's status, rule and dated badge award; it names no friend and does not treat a
saved code as a confirmed referral, even when the email arrives after the claim window has closed.

The fenced copy holds no banned phrase and no word from the fingerprint's never-list, checked by hand with the hook's
own matching rule. It has no exclamation mark and no em dash. No *we*, *us* or *our* appears except inside the fixed
consent line. Nothing at a limit says *upgrade*, *only*, *hurry* or *you used*.

### Every fact, with its source

| Fact | Source |
|---|---|
| {{freeDeviceRuns}} a month on each machine, used first; {{freeAccountRuns}} more on the account | D56; the brief's *What does Free include?*; the plan's `claim_run` port |
| Dry-runs, scans and reports never count; the command line is never counted | the brief's *What counts as a real run?* |
| Pro: no run limit, schedules, reports across up to {{proMachines}} machines, a history export | D56 as refined by D62 |
| Team: Pro for every seat, from {{teamMinSeats}}; a shared fleet report | D56; D62 |
| The weekly schedule moves to Pro; the command line keeps `--install-task` | D62 |
| `--install-task` refuses under npx | `settings.scheduleConseq` |
| Checkout dormant; a request charges nothing | D61 |
| Submitting a request charges and grants nothing; emailing the pay link marks it notified; an admin closes it separately | D68; `docs/CONTRACTS.md` §7 |
| A Free user's weekly task is removed on the first start of 1.4.0, said once, with Pro and `--install-task` named | D66 |
| The fleet report: per member and machine, date, mode, sections run, bytes reclaimed; never a path, file name, machine name or Windows user name | D69 |
| Deleting an account cancels its Polar subscription first; the plan, invite code, referrals and seat are deleted | D70; the main session's settled facts, 2026-10-31 |
| A redirect never grants a plan; Polar hosts the portal for receipts and cancellation | `aoneahsan-cccs-polar-payments` §3, §7 |
| A friend counts once the account exists and the email is verified; points; a Pro month per threshold; the rolling cap | D56; the brief's referral answer |
| Over the cap, points and a dated badge still land; banked months start after currently recorded same-or-higher entitlement, and later renewal can move the date; no friend is named | the referral reference §4 to §6; `docs/CONTRACTS.md` §9 |
| An open invite holds a seat; only the matching verified email accepts | macleanup `docs/database/SCHEMA.md` (`team_invites`), ported by the plan's wave 6 |
| `email_sent` distinguishes an accepted Team invite email from a rejected or uncertain send; the invite row remains available for sign-in | `docs/CONTRACTS.md` §8; `desktop/supabase/functions/team/index.ts` |
| The referral panel's lifetime earned-month count comes from `months_earned_total` | `docs/CONTRACTS.md` §9; `my_referral_status()` |
| No machine name is ever stored | Bible §7, *machine*; `account.neverStored` |
| `--yes` never answers for sections 17, 18, 19 and 23 | the brief's section table |

### Measured lengths

| String | Characters | Limit |
|---|---|---|
| `seo.account.description` (S-011) | 132 | 155 |
| `sitemap.blurb.account` (S-011) | 127 | the other blurbs run 95 to 133 |
