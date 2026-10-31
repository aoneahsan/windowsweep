# Emails for 1.4.0 — draft

Surface: content-map row 26. Language: en-GB. The seven templates in `docs/CONTRACTS.md` §14 are transactional. The release message is the first marketing email and must wait for a live 1.4.0 build, real screen captures, a `[TEST]` send to the owner, and his approval before any audience send. Every message uses the one branded FilesHub template layout, with matching HTML and text parts. The layout supplies the product mark, URL fallback, reason-for-email footer, and the appropriate support or unsubscribe link. The sender is `windowsweep`; the sign-off is `The windowsweep team`.

## Welcome email — `windowsweep-welcome`

**Production note:** The welcome send depends on a confirmed account conversion and a single provider claim, so an uncertain delivery waits for an audited decision rather than generating another message.

**Trigger:** The first successful `account-welcome` for an email-bearing account. **Audience:** that account. **Subject:** Your windowsweep account is ready. **Preheader:** See how your machine and account run allowances work.

**Eyebrow:** Account ready

**Heading:** Your account is ready.

This machine's allowance goes first: {device_runs} real runs each month. Sign in and your account adds {account_runs} more across the machines you use. Dry-runs, scans and reports do not count.

**Facts card**

| Label | Value |
|---|---|
| This machine | {device_runs} real runs each month |
| Your account | {account_runs} more real runs each month |

**Button:** Open your account → {app_url}

Your account shows what remains. The command-line engine still makes no network calls; the desktop window checks your allowance and updates separately.

Before a real run, read the target list in a dry-run. Protected folders stay refused. The dry-run removes none of your files.

The windowsweep team

**Footer reason:** You received this because your windowsweep account was created. This account message cannot be turned off; use the site contact form for help.

## Plan confirmation email — `windowsweep-plan-confirmed`

**Production note:** The confirmation takes its display plan name, formatted pre-discount and pre-tax subtotal, seat count and UTC period dates from the verified paid order, so it never substitutes an internal plan key or calls the subtotal the final charge.

**Trigger:** A verified `order.paid` grants a plan. **Audience:** the buyer. **Subject:** Your windowsweep plan is active. **Preheader:** The paid period and seat count are recorded below.

**Eyebrow:** Plan confirmed

**Heading:** Your {plan_name} plan is active.

Your paid period runs from {period_start} to {period_end}. The account shows which machines or Team seats the plan covers. The subtotal below is before discounts and tax; your Polar receipt shows the final charge.

**Facts card**

| Label | Value |
|---|---|
| Plan | {plan_name} |
| Interval | {interval_label} |
| Subtotal before discounts and tax | {amount} |
| Seats | {seats} |
| Period | {period_start} to {period_end} |

**Button:** View your plan → {account_url}

The plan is recorded on your account. If the subtotal or period above differs from your Polar order, use the site contact form and include the plan and period. Do not send a payment card number.

The windowsweep team

**Footer reason:** You received this because a payment activated your windowsweep plan. This transaction message cannot be turned off; use the site contact form for billing help.

## Referral confirmation email — `windowsweep-referral-confirmed`

**Production note:** The values come from the confirmed referral transaction, and the account page remains the authority for the next threshold or reward period because later payments can change when a reward is used.

**Trigger:** A referred friend is confirmed, once. **Audience:** the referrer. **Subject:** Your windowsweep referral was confirmed. **Preheader:** The points and confirmed-friend count have changed.

**Eyebrow:** Referral confirmed

**Heading:** Your referral counted.

This friend added {points} points. Your total is now {total_points} points from {confirmed} confirmed friends. A reward takes {threshold} confirmed friends.

{reward_line}

**Facts card**

| Label | Value |
|---|---|
| Points from this referral | {points} |
| Total points | {total_points} |
| Confirmed friends | {confirmed} |
| Reward threshold | {threshold} confirmed friends |

**Production note:** The backend keeps the confirmed referral and its mail claim in durable records, since an uncertain provider response cannot safely trigger a second message without an audited decision.

**Button:** View your referrals → {account_url}

The windowsweep team

**Footer reason:** You received this because a friend joined with your windowsweep referral code and confirmed their account. This account message cannot be turned off; use the site contact form for help.

**Required backend-composed `reward_line`:** The stored template has one slug and string replacement only. The backend derives this display sentence from `rewarded`, `reward_months` and the display name of `reward_plan`; it does not ask FilesHub to branch.

- When `rewarded=yes`: “This confirmation earned {reward_months} month(s) of {reward_plan}. Your account shows when that time can be used.” The backend renders the singular or plural form before sending.
- When `rewarded=no`: “No reward month was added with this confirmation. Your account shows your points and any reward time already earned.” This remains true at a rolling cap.

**Contract wiring:** `docs/CONTRACTS.md` §14 now includes `reward_line`, derived in `account-welcome`. The existing `rewarded`, `reward_months` and `reward_plan` remain the source facts; the email never prints raw `yes`/`no` or an internal plan key.

## Returned payment email — `windowsweep-payment-returned`

**Production note:** This message reports an actual returned payment after the webhook has updated entitlements, so its amount and current plan must come from that committed event rather than from an email request.

**Trigger:** A verified `order.refunded` event. **Audience:** the buyer. **Subject:** A windowsweep payment was returned. **Preheader:** Your current plan is recorded below.

**Eyebrow:** Payment returned

**Heading:** A payment was returned.

The returned amount is {amount_returned}. Your current plan is {plan_now}. Check it before your next real run; a returned payment can change what it includes.

**Facts card**

| Label | Value |
|---|---|
| Plan on the returned order | {plan_name} |
| Amount returned | {amount_returned} |
| Current plan | {plan_now} |

**Button:** See current plans → {pricing_url}

If the returned amount does not match your payment record, use the site contact form and include the date and amount shown by your payment provider. Do not send a card number.

The windowsweep team

**Footer reason:** You received this because the payment provider reported a returned windowsweep payment. This transaction message cannot be turned off; use the site contact form for billing help.

## Plan grant email — `windowsweep-plan-granted`

**Production note:** An admin grant may start later and always has an end date, so the email names the recorded grant and directs the person to Account for its current effect instead of claiming immediate access.

**Trigger:** An audited `grants.create` action. **Audience:** the account holder. **Subject:** A windowsweep plan grant was recorded. **Preheader:** See its plan, seats and end date.

**Eyebrow:** Plan grant

**Heading:** A {plan_name} grant was recorded.

Seats covered: {seats}. Your account shows when this grant applies alongside any paid period or Team membership. Those records are kept separately.

**Facts card**

| Label | Value |
|---|---|
| Plan | {plan_name} |
| Seats | {seats} |
| End date | {ends_at} |

**Button:** View your plan → {account_url}

If this grant is unexpected, use the site contact form. Include the plan name, not a payment card number.

The windowsweep team

**Footer reason:** You received this because an administrator recorded a windowsweep plan grant for your account. This account message cannot be turned off; use the site contact form for help.

**Template data note:** `ends_at` is the grant's formatted long UTC end date; it is never a blank or a raw timestamp.

## Plan request payment link — `windowsweep-plan-request-open`

**Production note:** This email is sent only when checkout is actually open and a pending request has a valid pay URL; the earlier request never grants a plan or reserves a price.

**Trigger:** `requests.notify_open` after checkout opens. **Audience:** the requester. **Subject:** Your windowsweep plan link is ready. **Preheader:** Your earlier plan request did not start a paid plan.

**Eyebrow:** Plan request

**Heading:** Your plan link is ready.

You asked for {plan_name} on the {interval_label} interval. The request did not start a paid plan. Open the link to review the plan and continue to checkout; the plan begins only after payment is confirmed.

**Facts card**

| Label | Value |
|---|---|
| Requested plan | {plan_name} |
| Interval | {interval_label} |

**Production note:** The pay URL opens the pricing page with the requested plan selected, so the email says to review the plan while that page owns the checkout action after the person chooses to continue.

**Button:** Review your plan → {pay_url}

By continuing, you agree to our [Terms of Service](https://windowsweep.aoneahsan.com/terms) and [Privacy Policy](https://windowsweep.aoneahsan.com/privacy).

You can compare the current plans at {pricing_url}. The checkout page shows the amount before you pay.

The windowsweep team

**Footer reason:** You received this because you asked windowsweep to send a plan link when checkout opened. This request message cannot be turned off; use the site contact form for help.

## Team invitation email — `windowsweep-team-invite`

**Production note:** The recipient email is matched by the invite flow, while the team name and inviter display value are escaped as untrusted text before they enter either the HTML or text composer.

**Trigger:** A Team owner creates an invitation. **Audience:** the invitee. **Subject:** A windowsweep Team invitation. **Preheader:** Review who invited you before joining.

**Eyebrow:** Team invitation

**Heading:** You were invited to {team_name}.

{invited_by} invited this address to join their windowsweep Team. Open the link to review and accept the invitation. Joining adds your account as a Team member; it does not start a purchase in your name.

**Facts card**

| Label | Value |
|---|---|
| Team | {team_name} |
| Invited by | {invited_by} |

**Button:** Review the invitation → {accept_url}

If you did not expect this invitation, leave it alone. Your account does not join until you accept.

The windowsweep team

**Footer reason:** You received this because a Team owner invited this address to windowsweep. This invitation message cannot be turned off; use the site contact form for help.

## Release newsletter signup — website and docs

**Production note:** The signup must use the FilesHub marketing list with confirmed consent, a shared resolver for preview and send, and an unsubscribe gate checked before every recipient is queued.

**Heading:** Get release notes by email

One email when a windowsweep release is ready. It names what changed, where to get it and any limit that matters. No cleanup path, file name or machine name is collected for the list.

**Field label:** Email address

**Button:** Get release emails

**After signup:** Check your inbox for release notes. You can leave the list from any email.

**Already subscribed:** If this address is on the list, the next release email will arrive there.

**Send failure:** The signup was not confirmed. Try again or use the site contact form.

## First release email — 1.4.0

**Production note:** The text below is a first campaign draft; no release claim is used in a send until 1.4.0 is live, all four screen images are captured, and the owner approves the test message.

**Campaign:** release newsletter, email 1. **Audience:** confirmed release subscribers only. **Subject:** See each run in windowsweep 1.4.0. **Preheader:** The desktop app shows your allowance, plan and update notice. **One action:** open the download page. **Send condition:** 1.4.0 must be live on the download page; every image below must be a real capture of that build from a non-admin test account, uploaded to FilesHub. Use the FilesHub marketing layout with the product logo and visible unsubscribe link.

**Email heading:** See what a run will touch

windowsweep is a Windows cleanup tool that names targets before it removes them.

**Button, above the fold:** Get windowsweep 1.4.0 → https://windowsweep.aoneahsan.com/download

**Hero image:** [REAL SCREEN REQUIRED: 1.4.0 desktop Run screen, target list and dry-run choice. Alt: “The windowsweep Run screen lists selected sections before a real run.”]

### What fills the disk

**Production note:** Keep this section's bullets as large table rows in the marketing layout, with their visible words also present in the text part when images are blocked or unavailable.

- **Build caches return.** A new install or build can recreate them; removing one costs time.
- **Personal files matter.** Documents, pictures, credentials and browser state are protected.

The number reclaimed depends on your machine. `--scan` measures it before cleanup. The app keeps that difference visible.

### What 1.4.0 shows you

**Production note:** Each feature block needs a crop from the live desktop build, a public FilesHub image URL, meaningful alt text and a matching text paragraph that stands alone without the image.

**A rehearsal before the run.** Start with a dry-run to see the same sections and paths a real run would examine. The dry-run writes its own log and report. No files are removed.

**Feature image:** [REAL SCREEN REQUIRED: 1.4.0 dry-run result. Alt: “A dry-run report lists the sections checked without removing files.”]

**A receipt after the run.** The report names which sections ran and how much space they reclaimed. It does not promise a figure before your machine has been measured.

**Production note:** The report specimen must show only test data and actual section totals from the captured build, because a picture with an invented reclaim figure would undermine the product's measured-number rule.

**Feature image:** [REAL SCREEN REQUIRED: 1.4.0 report. Alt: “The run report lists completed sections and measured reclaimed space.”]

**A count for real runs.** The Plans screen shows the monthly allowance and reset date. A dry-run, scan or report does not spend a real run. If you sign in, the machine's allowance is used first, then your account's.

**Feature image:** [REAL SCREEN REQUIRED: 1.4.0 Plans screen with test data. Alt: “The Plans screen shows real runs left this month and when the count resets.”]

### What stays out of reach

**Production note:** The permanent-action wording is a consequence surface, so the review must check each refusal against the engine and must keep humour away from personal-file selection and deletion.

- **Measure before removing.** `--scan` counts targets, and a dry-run rehearses without removing your files.
- **Keep protected folders.** The chokepoint refuses documents, photos, credentials and browser state. No flag lifts that refusal.
- **Keep the CLI local.** The command-line engine makes no network calls. The desktop window handles account and update requests separately.

Some sections ask you to pick individual personal files. Nothing is selected for you. By default, those picks go to the Recycle Bin; `--permanent` removes that recovery route.

### Where to start

**Production note:** The button above the fold and its repeated copy point to the same download URL; the full HTML rendering must prove the first button is visible at 390 by 844 pixels.

Open the download page and choose the current desktop installer. Select sections on the Run screen, then start with a dry-run. Read the target list. Decide whether to run for real.

The CLI remains available if you work in PowerShell. Its section numbers mean the same thing in the desktop app and the terminal.

**Callout:** The path is named first. What the chokepoint refuses stays refused.

**Production note:** A reviewer must compare the final callout, both button labels, the fallback URL, the reply address and the unsubscribe footer across the HTML and plain-text renderings before the owner test.

**Button, repeated:** Get windowsweep 1.4.0 → https://windowsweep.aoneahsan.com/download

**P.S.** Reply to tell the windowsweep team which section needs a clearer explanation.

**Footer reason:** You asked for windowsweep release emails. Unsubscribe in one click from this message; replies reach the product's main support mailbox.

**Status:** Draft only.

## Self-check

- **Gate:** Lean panel and final copy review complete; publication waits for the implementation and live checks below.
- **Scope:** Copy only.
- **Palette:** precision carries the facts, dates and steps; refusal names protected folders and the dry-run boundary. Workshop dryness is unused here: the welcome email's engine/window distinction is a plain account fact, not a light aside.
- **Rhythm:** shortest complete sentence, “Read the target list.” (4 words); longest, “If the returned amount does not match your payment record, use the site contact form and include the date and amount shown by your payment provider.” (26 words).
- **Length:** seven short transactional messages each use one facts card and one primary button; the pay-link message also carries the required Terms and Privacy links. Signup is a short form; the release email has about 365 shipping words across the required ten blocks. Row 26 says “short”, so marketing's mandatory longer shape applies to its one campaign email.
- **Unsure spots:** no invented product number or image. Fact consistency is conditional on rehearsal and application of the 21 SQL migrations; live FilesHub template HTML, text and escaping; the website's invite and pricing flows; the newsletter list; and real 1.4.0 screen captures. The release mail remains a draft until those checks pass. No owner-only decision is needed for these copy slots.
- **Review:** Bounded panel and targeted fact and SEO rechecks passed for the words. The implementation conditions above remain open.
- **Status:** No send yet.
