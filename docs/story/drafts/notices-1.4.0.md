# notices-1.4.0 - the legal bar, the update notice and block screens, and the admin pages for plans, users, numbers, plan requests and releases

Last Updated: 2026-10-31

Content-map row **24** · awareness **being told, or administering** · structure **one sentence and one action; the block
names the release's reason** · tone band **P only; R in the legal bar's analytics line** · length **microcopy** · CTA
**Okay / Update / the admin action** · schema **none** · gate **GATE 2 and GATE 4 pre-authorised under D59**, on the fleet
laws of 2026-10-30 (`legal-notice.md`, `update-flow.md`).

Round 1, 2026-10-31: D68 settles the plan requests page, the main session settled the release warning (ND-4), and D64
is checked against the legal bar and applied to the desktop window's own strings (N-016). No owner question is open;
the site's `draftKept` line still needs browser persistence proof before publication.

**Framework: one sentence and one action, and the consequence shape for the block.** The legal bar is fleet law word
for word. The block screen stops a program the reader was using, so it follows `safety.md`'s shape for an error that
costs the reader time: what happened, what it means, what to do now, and where to go if that fails. Humour is off.
That holds for every string in this file. Admin pages are P only: each label names the thing, and each help line says what the
server does with it.

## Sources

| Source | What it gives these strings |
|---|---|
| `~/.claude/rules/legal-notice.md` | the bar's fixed sentence, *Okay*, one analytics line, `role="status"`, 10 seconds, once per browser and per account, never on a task page |
| Desktop `shell.json` `consent.title` (approved, row 12) | the analytics line the bar reuses, verbatim |
| Fingerprint sentence 9 | the bar's band-R line, trimmed |
| `aoneahsan-cccs-update-flow` → `contract.md`, `web.md`, `desktop-flutter.md`, `verification.md` | notice and block behaviour, Update per surface, the 280-character reason, the test channel, the last 20 |
| The approved plan, wave 2 | platforms `desktop`, `web` and `docs`; Update falls back to the Releases page; a running cleanup is never stopped |
| `README.md` Support link; site `ContactGate.tsx` | the existing support issues route at `https://github.com/aoneahsan/windowsweep/issues` |
| Desktop `shell.json` `splash.update.*` (approved) | *Later*, *Downloaded and verified.*, *Your settings and history are untouched* |
| `aoneahsan-cccs-plans-entitlements`, `-platform-admin`; `docs/CONTRACTS.md` | the five plan-administration capabilities, provenance, nine referral settings and the badge catalogue, with admin writes audited |
| Site `admin.json`, `seo.json`, `sitemapBlurbs.json`; `public/llms.txt` | the admin pages' existing shape, and the sentences 1.4.0 makes false |

## Conventions

- **Desktop keys are flat** in `shell.json`, as `splash.update.*` are; `<1>`/`<3>` are `Trans` indexes. **Site keys nest**
  in `common.json` (`legal`, `release`) and `admin.json`; the bar's two links are named tags, `<privacy>` and `<terms>`,
  because the site's `RichText` maps one `<lnk>` per key. **The docs site has no i18n catalogue**, so its gate module
  holds one constant table under the keys given here.
- **`{{reason}}` is never a key.** The admin's own words render as plain text, verbatim, between the block's title and
  its version line.
- Every slot is new copy unless it quotes what it replaces.

## The lint hook cannot see the fenced copy

Every shipping string sits in a fence. The hook strips fences, so its silence on this file is about the commentary only.
The fenced copy was checked by hand against the banned list and the fingerprint's never-list.

---

## The legal bar

### N-001 · desktop (`shell.json`)

```json
"legal.sentence": "By using windowsweep, you agree to our <1>Privacy Policy</1> and <3>Terms of Service</3>.",
"legal.analytics": "windowsweep collects usage data to improve the product for everyone. Never a file path, never the contents of anything.",
"legal.okay": "Okay"
```

### N-002 · the website (`common.json`)

```json
"legal": {
  "sentence": "By using windowsweep, you agree to our <privacy>Privacy Policy</privacy> and <terms>Terms of Service</terms>.",
  "analytics": "windowsweep collects usage data to improve the product for everyone. Never a file path, never the contents of anything.",
  "okay": "Okay"
}
```

| Element | Note |
|---|---|
| `sentence` | 🔴 Renders exactly *"By using windowsweep, you agree to our Privacy Policy and Terms of Service."* (`legal-notice.md`). *Our* is fleet law's, the one place it appears in this file. Desktop links open `/privacy` and `/terms` on the website in the browser; the site's are internal |
| `analytics` | First sentence: `consent.title`, the approved first-run line, verbatim. Second: fingerprint sentence 9 trimmed to two refusals, which is the band R that row 24 places here. Together they stay one short line, the size of the law's own example |
| Variants | None. Both surfaces carry the same words; only the tag syntax differs |
| Behaviour | `role="status"`, never a dialog. Marked seen the moment it shows, held while hovered or focused, gone after 10 seconds. Never on the sign-in callback |
| D64/D74 check | The line names no tool and no replay. It stays true with Amplitude and Sentry in the desktop window, GA4 routed through the server-side `analytics-ingest` broker when enabled, and Clarity on the site. No change |

No *consent*, no *cookie*, no *updated*, no warning icon: the law forbids each, and the words give none of them a place
to stand.

---

## The update notice - a normal release, required from the next start

### N-003 · desktop (`shell.json`)

```json
"release.notice": "windowsweep {{version}} is required from the next start.",
"release.noticeBody": "Until then, this copy works as it does now. Update now installs it and restarts windowsweep.",
"release.updateNow": "Update now",
"release.later": "Later"
```

### N-004 · the website (`common.json`)

```json
"release": {
  "notice": "This site has a newer version, {{version}}, and it is required from the next page load.",
  "noticeBody": "Update now reloads this page with it.",
  "updateNow": "Update now",
  "later": "Later"
}
```

### N-005 · the docs (the gate module's table)

```json
"releaseGate": {
  "notice": "These docs have a newer version, {{version}}, and it is required from the next page load."
}
```

`noticeBody`, `updateNow` and `later` are N-004's words, unchanged, in the module's table.

| Element | Note |
|---|---|
| `notice` | The contract's three facts in one sentence: the version, that it is required, and from when. On the web, a new start is a new page load (`contract.md`) |
| `noticeBody` | What the button does, before anyone presses it. On the desktop, Update runs the updater, which installs and relaunches |
| `later` | The approved `splash.update.later`. The notice stays until it is dismissed, and dismissing it changes nothing about the next start |

---

## The block screen - nothing else works until the update is in

### N-006 · desktop (`shell.json`)

```json
"release.blockTitle": "windowsweep {{version}} is required.",
"release.blockUrgent": "Nothing else in windowsweep works until it is installed.",
"release.blockSince": "It was announced in an earlier session. From this start, nothing else in windowsweep works until it is installed.",
"release.blockVersions": "Running {{running}} · required {{version}}",
"release.blockKept": "Your settings and history are untouched.",
"release.update": "Update",
"release.runInProgress": "A run is in progress. It finishes before the update installs.",
"release.downloading": "Downloading {{version}} · {{percent}}",
"release.downloaded": "Downloaded and verified.",
"release.installing": "Installing. windowsweep restarts when it finishes.",
"release.failed": "The update did not install: {{message}}",
"release.failedOffline": "This machine is offline. Reconnect, then try the update again.",
"release.fallback": "If the retry fails while connected, download the installer from the release page and run it.",
"release.fallbackLink": "Open the release page",
"release.support": "If the installer also fails, open a support issue.",
"release.supportLink": "Open support issues",
"release.retry": "Try again"
```

### N-007 · the website (`common.json`, inside `release`)

```json
"blockTitle": "Version {{version}} of this site is required.",
"blockUrgent": "Nothing on this page works until the new version loads.",
"blockSince": "This browser was told about it on an earlier visit, and it is required from this page load.",
"blockVersions": "Running {{running}} · required {{version}}",
"update": "Update",
"updating": "Reloading…",
"note": "Update reloads this page with the new version.",
"draftKept": "Your unfinished draft was saved in this browser before this update screen appeared.",
"offline": "This browser is offline, so the new version cannot load yet. Press Update once the connection is back.",
"fallback": "If this screen keeps coming back, reload without the cache: Ctrl+F5 on Windows.",
"support": "If reloading without the cache fails, open a support issue.",
"supportLink": "Open support issues"
```

### N-008 · the docs (the gate module's table, inside `releaseGate`)

```json
"blockTitle": "Version {{version}} of these docs is required."
```

Every other key except `draftKept` is N-007's, word for word: a page of the docs and a page of the site block the
same way. Docs have no unfinished draft.

**Reading order on every surface.** Title, then `blockUrgent` or `blockSince`, then `{{reason}}` as the admin wrote it,
then the version line, then `blockKept` on the desktop or `draftKept` for an unfinished site draft, then the single
Update button. While it works, the button shows progress; when it fails, the failure line and the fallback replace
the note. The support issue link follows the installer or cache-reload fallback if that also fails.

| Element | Note |
|---|---|
| `blockTitle` | What happened, as a fact about a version. Nothing about the reader |
| `blockUrgent` / `blockSince` | What it means. *Since* is the normal release told in an earlier session, which now blocks (`contract.md`, the table's last row) |
| `blockKept` | The approved splash sentence, the reassurance this moment needs, and true: the updater never touches `%USERPROFILE%\.windowsweep\` |
| `runInProgress` | The plan: a running cleanup is never stopped. The sentence holds whether the block waits for the run or Update does |
| `downloaded` | The approved `splash.update.downloaded`. The updater checks the minisign signature before it says so |
| `fallback` (desktop) | The approved plan's Releases page, after a connected retry fails. The link target is the call site's |
| `fallback` (site, docs) | A web page has no installer, and a stale cached page is the failure a reload can meet. *Ctrl+F5 on Windows* is precise for the product's readers and honest about where it applies |
| `supportLink` | The existing GitHub issues route above opens outside the blocked product. It is a text link after the fallback, not a second Update button |
| `draftKept` (site only) | **PROPOSED, NOT READY TO PUBLISH.** Show this line only when an unfinished draft was actually persisted before the block appeared. Publication requires a real-browser proof that the draft survives block, Update, and reload; do not present the line as shipped before that proof |

---

## The admin pages (website, `admin.json`)

### N-009 · navigation, crumbs and the reason every write carries

```json
"navPlans": "Plans",
"navConfig": "Run allowance and referrals",
"navRequests": "Plan requests",
"navReleases": "Releases",
"crumbPlans": "Plans",
"crumbConfig": "Run allowance and referrals",
"crumbRequests": "Plan requests",
"crumbReleases": "Releases",
"reasonLabel": "Reason, kept in the audit log",
"reasonRequired": "Give a reason. It is written to the audit log with the change.",
"saved": "Saved. The audit log has the change and your reason.",
"refused": "Nothing changed: {{message}}"
```

### N-010 · Users - change a plan, override a limit, see where a plan came from

**Replaces `users.lede`:** *"Read-mostly on purpose. The platform role is seeded out of band for two fixed addresses, so
there is no button here that can grant it."*

```json
"lede": "Search by name or email. Open an account to change its plan or one of its limits. Each change asks for a reason and writes an audit row. The platform role is seeded out of band for two fixed addresses; no button here can grant it.",
"colPlan": "Plan",
"planTitle": "Plan",
"planLabel": "Plan",
"planEndsLabel": "Ends on",
"planEndsHint": "Choose an end date for any plan except Free. On that date, the account uses the next eligible plan.",
"planThenLabel": "Then moves to",
"planSave": "Change the plan",
"overrideTitle": "Limits for this account only",
"overrideHint": "An empty field uses the plan’s own limit.",
"overrideUnlimited": "No monthly limit on real runs",
"overrideDevice": "Real runs a month on each machine",
"overrideAccount": "Extra real runs a month, signed in",
"overrideSave": "Save the override",
"overrideClear": "Clear the override",
"provenanceTitle": "Where this plan came from",
"provenanceLede": "Every paid period and every grant on this account, newest first.",
"colSource": "Source", "colFrom": "From", "colUntil": "Until", "colBy": "By", "colReason": "Reason",
"sourcePaid": "Paid through Polar", "sourceAdmin": "Granted by an admin", "sourceReferral": "Referral reward"
```

| Key | Note |
|---|---|
| `lede` | *Read-mostly* stops being true when plans change here. The last sentence is the approved one, kept |
| `planEndsHint`, `planThenLabel` | The grant's three facts: the plan, what it moves to, and when |
| Sources | Three, since D68 makes a plan request grant nothing |
| `colBy` | A system grant has no granter; the cell uses the existing `users.noName` placeholder |

### N-011 · Plans - create a plan, edit its limits

```json
"plans": {
  "title": "Plans, and what each one allows.",
  "lede": "Each plan is a row. New purchases use its current price; existing subscriptions keep theirs. The server reads current limits when it decides, and the audit log keeps each change with its reason.",
  "heading": "Plans",
  "colKey": "Key", "colName": "Name", "colRank": "Rank", "colMonth": "A month", "colYear": "A year", "colActive": "Active",
  "new": "New plan", "edit": "Edit",
  "keyLabel": "Key", "keyHint": "Fixed once saved: accounts and payments point at it.",
  "nameLabel": "Name", "nameHint": "Shown on the pricing page and in the desktop app.",
  "rankLabel": "Rank", "rankHint": "Orders the plans. A higher rank is a larger plan.",
  "activeLabel": "Active", "activeHint": "An inactive plan stays on the accounts that hold it. Nobody new can choose it.",
  "monthLabel": "Price a month, in US cents", "monthHint": "400 is $4. Empty for a plan that is not sold monthly.",
  "yearLabel": "Price a year, in US cents", "yearHint": "Empty for a plan that is not sold yearly.",
  "perSeatLabel": "Priced per seat", "minSeatsLabel": "Minimum seats",
  "unlimitedLabel": "No monthly limit on real runs",
  "deviceLabel": "Real runs a month on each machine", "deviceHint": "Empty uses the number on the allowance page.",
  "accountLabel": "Extra real runs a month, signed in", "accountHint": "Empty uses the number on the allowance page.",
  "machinesLabel": "Machines in multi-machine reports",
  "schedulesLabel": "Schedules", "historyExportLabel": "History export",
  "multiReportsLabel": "Multi-machine reports", "fleetLabel": "Shared fleet report",
  "save": "Save the plan",
  "neverDeleted": "A plan is never deleted. Turn Active off instead.",
  "empty": "No plan rows yet",
  "emptyBody": "The seed adds Free, Pro and Team. Until it runs, there is nothing here to price."
}
```

`keyHint`, `activeHint` and `neverDeleted` are the registry's own rules: never rename a shipped key, deactivate rather
than delete. `monthHint`'s example is unit arithmetic, not a price claim.

### N-012 · Run allowance and referrals - the settings the server reads

```json
"config": {
  "title": "Run allowance and referral settings.",
  "lede": "The server reads each setting when it decides. A change applies to the next run or referral without a release.",
  "colSetting": "Setting", "colValue": "Value", "colAllowed": "Allowed",
  "deviceRuns": "Real runs a month on each machine",
  "deviceRunsHint": "Free’s allowance for one machine. It is used before the account’s.",
  "accountRuns": "Extra real runs a month, signed in",
  "accountRunsHint": "One pool shared by the account's signed-in machines, used after each machine's allowance.",
  "referralOn": "Referrals",
  "referralOnHint": "Off stops new referral rewards.",
  "referralPoints": "Points per confirmed friend",
  "referralBadge": "Badge for a confirmed friend",
  "referralBadgeHint": "Choose an active badge from the referral catalogue.",
  "referralThreshold": "Confirmed friends per reward",
  "referralMonths": "Months per reward",
  "referralPlan": "Plan a reward grants",
  "referralCap": "Most reward months in a rolling year",
  "referralCapHint": "Above it, points and badges still land. Only plan months stop.",
  "referralClaimWindow": "Referral confirmation window, in days",
  "referralSignupWindow": "Referral code entry window, in minutes",
  "badgeCatalogue": "Referral badge catalogue",
  "badgeCatalogueHint": "Create a key and name, then choose an active badge above.",
  "badgeKeyLabel": "Badge key",
  "badgeNameLabel": "Badge name",
  "badgeActive": "Active",
  "badgeCreate": "Create badge",
  "allowed": "{{min}} to {{max}}",
  "change": "Change",
  "save": "Save the value",
  "savedNext": "Saved. The next decision reads it.",
  "outOfRange": "Outside what the database accepts: {{min}} to {{max}}."
}
```

The nine referral settings are stored in `app_config`, with the off switch first; `referralBadge` selects an active
key from `badge_catalogue`, whose entries come from `badges.list` and `badges.create`. The two window settings limit
referral confirmation and code entry; their units are days and minutes. `allowed` prints the database's own bounds,
so the form never offers a value that a CHECK constraint would refuse. The database enforces them.

### N-013 · Plan requests - list and resolve

```json
"requests": {
  "title": "Plan requests.",
  "lede": "Each row is a request for a paid plan. Submitting it charges nothing.",
  "ledeNext": "A request grants no plan. The windowsweep team emails pending requesters a link to pay. A successful send marks the request Notified.",
  "heading": "Requests",
  "colAccount": "Account", "colPlan": "Plan", "colBilling": "Billing", "colSeats": "Seats", "colRequested": "Requested", "colStatus": "Status",
  "statusPending": "Pending", "statusNotified": "Notified", "statusClosed": "Closed",
  "filterLabel": "Status", "filterPending": "Pending", "filterNotified": "Notified", "filterAll": "All",
  "notifyOpen": "Email pay links",
  "notifyHint": "After checkout opens, email pending requesters. A failed send leaves the request Pending.",
  "notifyResult": "{{sent}} pay links accepted. {{failed}} requests not confirmed; review uncertain email outcomes before retrying.",
  "close": "Close",
  "closeHint": "Only Notified requests can be closed. Closing grants no plan.",
  "notifiedByLink": "Notified when its link to pay was emailed.",
  "closed": "Closed. The request stays in the list with its reason.",
  "empty": "No plan requests",
  "emptyBody": "A request appears here when someone presses Request on the pricing page or the Plans screen.",
  "emptyFiltered": "No request has this status. Choose All to see every request."
}
```

D68: a request grants nothing, so the page has no grant action. A successful pay-link email marks a request Notified;
closing is a separate admin action allowed only for Notified requests and recorded with a reason in the audit log.
Pending cannot close. Submitting the request charges nothing; the recipient can pay later through the link.

### N-014 · Releases - the publish form and the last 20

```json
"releases": {
  "title": "Releases, and the version each one requires.",
  "lede": "Publishing a row sets the version the desktop app, this site or the docs must run. A row is never edited. Publish a newer one to correct a mistake. Every publish writes an audit row.",
  "formTitle": "Publish a release",
  "platformLabel": "Platform", "platformDesktop": "Desktop app", "platformWeb": "This website", "platformDocs": "Docs",
  "channelLabel": "Channel", "channelProduction": "Production", "channelTest": "Test",
  "channelHint": "Only test builds read Test. Watch the notice and the block there before publishing to Production.",
  "versionLabel": "Version",
  "versionHint": "Three numbers, such as 1.4.0. Every copy older than this is asked to update.",
  "versionInvalid": "Write the version as three numbers, such as 1.4.0.",
  "severityLabel": "Severity", "severityUrgent": "Urgent", "severityNormal": "Normal",
  "severityUrgentHint": "Older copies stop at once and show the reason, with one Update button.",
  "severityNormalHint": "Older copies are told now, and stop at their next start until they update.",
  "reasonLabel": "Reason",
  "reasonHint": "Shown word for word on the block screen. Say what changed and why this version is required.",
  "reasonCount": "{{count}} of 280",
  "reasonEmpty": "A reason is required. It is the only explanation the block screen gives.",
  "minNativeLabel": "Minimum native version",
  "minNativeHint": "For an app whose web layer updates apart from its binary. The desktop app, this website and the docs leave it empty.",
  "warnAbove": "{{version}} is above the version deployed now, {{deployed}}. Copies older than {{version}} that receive this record would be asked for a version they cannot get yet. Publish after the release is out.",
  "publish": "Publish",
  "confirmTitle": "Publish {{version}} for {{platform}} on {{channel}}?",
  "confirmUrgent": "Every older copy stops at once and shows your reason until it updates.",
  "confirmNormal": "Every older copy is told now, and stops at its next start until it updates.",
  "confirmAction": "Publish", "cancel": "Cancel",
  "published": "Published. Open copies check every 15 minutes; closed ones check at their next start.",
  "refused": "Nothing was published: {{message}}",
  "listTitle": "The last 20 releases",
  "listCaption": "Newest first. To correct a release, publish a newer one.",
  "colPublished": "Published", "colPlatform": "Platform", "colChannel": "Channel", "colVersion": "Version",
  "colSeverity": "Severity", "colReason": "Reason", "colBy": "By",
  "empty": "Nothing published yet",
  "emptyBody": "Until a row exists, no copy is asked to update."
}
```

| Key | Note |
|---|---|
| `reasonHint`, `reasonCount` | The contract's limit: 280 characters, plain words written for the person reading the block |
| `minNativeHint` | No windowsweep platform has a separate web layer, so the field is always empty. Hiding it is the implementer's call; the words are ready either way |
| `warnAbove` | Settled 2026-10-31: the form warns when the version is above the deployed build, because copies older than that version could be asked for a build that does not exist yet. Offline reads fail open |
| `confirmUrgent` / `confirmNormal` | A publish that stops every older copy is a consequence, so it is confirmed. The sentence names what will happen, never how sure the admin is |
| `published` | Open copies check every 15 minutes and on returning to view; closed ones check at start. Offline reads fail open (`contract.md`) |

### N-015 · approved admin strings 1.4.0 makes false, and the heads of the new pages

**Was:** `admin.inbox.lede` *"The whole admin surface is three pages: this inbox, a users list and an audit log. There is
nothing else to administer here. ..."* · `seo.adminUsers.description` and `sitemap.blurb.adminUsers`, both
*read-mostly* · `llms.txt` *"Sign-in, and the three admin pages behind it, are not listed"*.

```json
"admin.inbox.lede": "Contact requests from the contact page. Every status change writes a row to the audit log, and a change made with a request’s buttons can be undone for 6.5 seconds from its notice.",
"seo.adminUsers.description": "Everyone with an account and their plan. Plans and limits change here with a reason; the platform role is seeded out of band, so no button grants it.",
"seo.adminPlans": {
  "title": "Admin plans · windowsweep",
  "description": "Each plan lists prices and limits. New purchases use current prices; renewals keep their original price. The server reads current limits when it decides."
},
"seo.adminConfig": {
  "title": "Admin run allowance · windowsweep",
  "description": "The run allowance and referral settings the server reads as it decides. A change applies to the next run or referral, with an audit row."
},
"seo.adminRequests": {
  "title": "Admin plan requests · windowsweep",
  "description": "Paid-plan requests. Submitting one charges nothing; notifying and closing are separate."
},
"seo.adminReleases": {
  "title": "Admin releases · windowsweep",
  "description": "Publish the version the desktop app, the site or the docs must run, and see the last 20. A release is never edited; a newer one corrects it."
},
"sitemap.name.adminPlans": "Admin · Plans",
"sitemap.name.adminConfig": "Admin · Run allowance and referrals",
"sitemap.name.adminRequests": "Admin · Plan requests",
"sitemap.name.adminReleases": "Admin · Releases",
"sitemap.blurb.adminPlans": "Each plan as a row, with its prices and limits. Every change writes an audit row with its reason.",
"sitemap.blurb.adminConfig": "The run allowance and referral settings, read by the server when it decides.",
"sitemap.blurb.adminRequests": "Paid-plan requests. Submitting one charges nothing.",
"sitemap.blurb.adminReleases": "The publish form and the last 20 releases. A release is never edited.",
"sitemap.blurb.adminUsers": "The users list with each plan. Plans and limits change here with a reason; roles are seeded out of band."
```

```text
Sign-in and admin pages are not listed. Admin pages require admin access and can show data
across accounts.
```

The inbox lede keeps every approved fact except the page count. The machine-readable index sentence drops its page
count because the planned admin routes have not all shipped and that number changes as each new route becomes
available. The index stays accurate.

### N-016 · the desktop window without Clarity (D64)

D64 takes Clarity out of the desktop window. Its two session-replay entries leave with it, and no new words replace
them: three destinations remain on each surface, each already approved.

| Key | Where | 1.4.0 |
|---|---|---|
| `consent.provider.clarity.name` · `.what` | Home's destinations ledger (`HomeDestinations.tsx`, read through `DESTINATIONS`) | the `clarity` row leaves the list; GA4, Amplitude and Sentry stay with their approved lines |
| `settings.privacy.sessionReplay` · `...Desc` | Settings, Privacy (`SettingsPrivacy.tsx`) | the row leaves; the other three rows and *Never sent* stay |
| `consent.*`, the rest | the Consent screen | retired with the screen, which the legal bar replaces |

`consent.provider.ga4.what` still reads true: when enabled, `analytics-ingest` forwards the approved screen and button
events through the Measurement Protocol without placing its API secret in the desktop window.
The website's sentences about the window are `legal-payments` P-11. These three belong to rows 11 to 13, so the keeper
routes them under the owner's GATE 4.

---

## NEEDS DECISION

None is open on this row. ND-1 was answered by D68, and `requests.ledeNext` carries it. ND-4 was settled in the main
session on 2026-10-31: the form warns when a version is above the deployed build, so `warnAbove` ships alone.

---

## Self-check

- **Palette.** P carries every string. R lands once, where row 24 puts it: the bar's *"Never a file path, never the
  contents of anything."* The block screen's only reassurance is a checkable fact, *"Your settings and history are
  untouched."* No W anywhere, and no humour near the block or the legal words.
- **Rhythm.** Shortest string: *"Okay"*. Longest in the bar, the notices and the blocks: the desktop's `release.blockSince`,
  nineteen words split 7 and 12. Longest in the admin pages: the approved inbox sentence N-015 keeps, at 28. Every button
  is one to three words except *Open the release page*, which is four.
- **Length.** Microcopy, as the cap says: the bar is two sentences and one button; each notice is one sentence, one line
  of help and two buttons; each block is at most six lines above its single button.
- **Unsure.** No owner decision is open. ND-1 is answered by D68 and ND-4 is settled. `draftKept` remains conditional
  on a real-browser persistence proof before publication.

## Banned words and tells

The fenced copy holds no banned phrase and no word from the fingerprint's never-list, checked by hand with the hook's
own matching rule; the hook strips these fences before it scores the file. No exclamation marks. No em dashes. *Our*
appears only inside the bar's fixed sentence, once in each catalogue. No *consent*, no *cookie*, no *updated*, no *sorry*.

## Every fact, with its source

| Fact | Source |
|---|---|
| The bar's sentence, *Okay*, one analytics line, `role="status"`, 10 seconds, once per browser and per account, not on a task page | `legal-notice.md` |
| The analytics line | desktop `consent.title`, approved (row 12, GATE 4 2026-09-13) |
| Never a file path, never the contents of anything | fingerprint sentence 9; `consent.neverSent` |
| Notice: the version, required from the next start, Update now; stays until dismissed | `contract.md` *The client gate* |
| Block: the reason, one Update, no close; urgent blocks now, a normal release told earlier blocks at the next start | `contract.md` |
| A new start on the web is a new page load | `contract.md` |
| Desktop Update runs the updater, then relaunches; fallback the Releases page | `desktop-flutter.md`; the approved plan, wave 2 |
| Web Update reloads | `web.md`; the approved plan, wave 2 |
| The support issue route after an update fallback | product `README.md` Support link; site `ContactGate.tsx` |
| The proposed site draft line can publish only after persistence survives block, Update and reload in a real browser | `contract.md` block persistence rule; proof pending |
| A running cleanup is never stopped | the approved plan, wave 2 |
| *Downloaded and verified.*, *Later*, settings and history untouched | `splash.update.*`, approved (row 11) |
| Platforms `desktop`, `web`, `docs`; the test channel | the approved plan; `verification.md` |
| The reason up to 280 characters; never edited, corrected by a newer row; the last 20 | `contract.md` |
| Checks every 15 minutes and on returning to view | `contract.md` |
| Plan, downgrade target, date; provenance; every write audited with a reason | `aoneahsan-cccs-plans-entitlements` → `manual-grant.md`; `-platform-admin` |
| The nine referral settings, the badge catalogue and award, and the cap that stops only plan months | `docs/CONTRACTS.md` §§5, 9, 11 |
| Never rename a key, deactivate rather than delete | `data-driven-registry.md` §1–2 |
| The platform role is seeded out of band for two addresses | `admin.json` `users.lede`, approved |
| A request grants nothing and charges nothing when submitted; a successful pay-link email marks it Notified, and only then can an admin close it | D68; `docs/CONTRACTS.md` §7 |
| The form warns when a version is above the deployed build | settled in the main session, 2026-10-31 |
| The desktop window: Amplitude, Sentry, GA4 through the server-side `analytics-ingest` broker when enabled, no Clarity | D64; D74 |

## Measured lengths

| String | Characters | Limit |
|---|---|---|
| `seo.adminPlans.title` · `description` | 25 · 153 | 60 · 155 |
| `seo.adminConfig.title` · `description` | 33 · 136 | 60 · 155 |
| `seo.adminRequests.title` · `description` | 33 · 87 | 60 · 155 |
| `seo.adminReleases.title` · `description` | 28 · 140 | 60 · 155 |
| `seo.adminUsers.description` | 149 | 155 |
| `sitemap.blurb.admin*` | 51 to 104 | the other blurbs run 95 to 133 |
