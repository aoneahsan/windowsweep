# Docs for 1.4.0: first draft

Last Updated: 2026-10-31

Content-map row 27. These four pages follow rows 3–6. Each explains the action and names its refusal beside it; then comes the next step. The proposed files are `plans.md`, `updates.md`, `legal-notice.md`, and `desktop-tours.md` in the docs site. The 1.4.0 changelog and `llms.txt` changes follow. Nothing is live. The applier adds the release date and links only after the build, package and live checks prove that each new screen and download exists.

Framework: PAS in each page's opening, then task-led reference prose. The problem is the reader's immediate question, without manufacturing urgency. No invented clock. A plan request, a blocked update or a screen tour brings a reader with a specific task, so give the action available in that state before explaining the system behind it. There is no joke on a payment, legal, update block or run-limit surface because each can cost the reader time or money.

## `plans.md` — use a desktop plan

```md
---
title: 'Use a desktop plan'
description: 'How real-run allowances, Pro, Team, referrals and plan requests work in windowsweep.'
tags: [desktop, plans, runs]
---

# Use a desktop plan

Open **Plans** to see your current plan and how many real runs remain; a plan changes the desktop allowance and extra features while all 26 sections and their protected-path checks stay the same. Even when no real runs remain this month, a dry-run, scan, report-only run or command-line run is never counted.

## How many real runs remain?

Open **Plans** in the desktop app. The allowance shows this machine's count and, when you are signed in, your account's extra count. The app uses this machine's allowance first, then the account's. Both reset at 00:00 UTC on the first day of the month. [Pricing](https://windowsweep.aoneahsan.com/pricing) shows the current limits and prices.

The app asks the account service for a claim immediately before a real run. No claim, no run. If there are no runs left, the run does not start. If the service cannot be reached, the real run waits. A dry-run still works. A run that only reads and reports is not counted.

## What do Free, Pro and Team include?

Free keeps signed-in run-summary sync, History across machines and the report exported from an individual run. Pro removes the monthly real-run limit and adds the desktop weekly schedule, a report across your machines and a history export. Team gives each seat Pro and adds one fleet report. The fleet report shows each member's runs by machine with date, mode, section count and bytes reclaimed. It never shows a path, file name, machine name or Windows user name.

The command-line `--install-task` remains available without a desktop plan. A Free user's old desktop weekly task is removed on the first start of 1.4.0, with a one-time notice; a command-line task is left alone.

## How do I request a plan while checkout is closed?

Choose **Request Pro** or **Request Team** on Plans, or request one from [Pricing](https://windowsweep.aoneahsan.com/pricing). A request records the plan you want. It charges nothing and grants nothing. When checkout opens, the windowsweep team emails a pay link and marks the request notified; the team closes it separately. Until a payment is recorded, your current plan stays in effect.

## How do referral rewards work?

Sign in and open **Plans** to find your invite code. Choose **Copy the invite link** and share it with your friend; the link opens the website with the code ready for sign-in. A friend counts when a new account is linked with the code inside the sign-up window and its email is verified before the claim window closes. Plans shows the current points, threshold and reward settings. It does not name the friend.

Referral Pro time waits behind paid Pro or Team time. If paid or Team coverage starts during a reward, the uncovered part is kept for later. A fully banked reward moves after later paid or Team coverage. **Plans** shows when a reward is waiting or paused. A voided referral can remove the points and any surplus reward time tied to it. Paid time is unaffected.

See [Safety model](./safety-model.md) for the paths every plan refuses, and [Desktop app](./desktop.md) for what the window sends.
```

## `updates.md` — install a required desktop update

```md
---
title: 'Install a required update'
description: 'What a windowsweep update notice means and how to install it in the desktop app, website and docs.'
tags: [updates, desktop, troubleshooting]
---

# Install a required update

Choose **Update** when the desktop app says a release is required. An urgent release blocks an older copy when found; a normal release shows a notice first and blocks from the next start. The notice names the required version and the reason for a block. Nothing runs yet.

## How do I update the desktop app?

Choose **Update** in the notice or block. The app downloads and verifies the signed update. A run already in progress finishes before installation begins. The release screen tells you when the update is downloaded and verified and when installation begins. Your settings and History remain. If the download fails, choose **Try again** while online. The block screen also links to the [release page](https://github.com/aoneahsan/windowsweep/releases) for a manual installer and to [support issues](https://github.com/aoneahsan/windowsweep/issues) if the installer fails.

The app checks for a published release after it opens, every 15 minutes while open, and when it returns to view. If the release service cannot be reached, it continues and checks again later; a published block is not silently dismissed.

## How do I update the website or docs?

Choose **Update now** in a notice or block. The page reloads. It picks up the newest site build. A normal release becomes required from the next page load; an urgent one blocks older builds immediately. A failed reload leaves **Try again** and a support link available. A form draft is kept only where the browser confirms that it was saved before the block; do not rely on a page reload to preserve unsaved text.

The command-line engine makes no automatic network call and checks no release on its own. Its version changes when you install a newer package. Read [Safety model](./safety-model.md) for the engine's protected-path refusals and [Desktop app](./desktop.md) for the window's separate network behaviour.
```

## `legal-notice.md` — read the policy notice

```md
---
title: 'Read the policy notice'
description: 'Where the windowsweep policy notice appears and what its two links explain.'
tags: [privacy, terms, desktop]
---

# Read the policy notice

Open [Privacy Policy](https://windowsweep.aoneahsan.com/privacy) to read what the website and desktop window send and keep. Open [Terms of Service](https://windowsweep.aoneahsan.com/terms) for the account, software and payment rules. The policy bar links to both pages and says that usage data is collected; the command-line engine makes no network call of its own.

## Where can I read the policy rules?

The notice says that no file path or file contents are sent; the policies give the longer list, including account and payment records when those features are used. These pages describe the product's rules; they are not advice about your own legal position.

The bar is a notice. It has an **Okay** button. It appears once per browser and per account on an eligible page, stays while you focus or hover it, and otherwise closes after ten seconds. It does not appear over a task. The policy links remain in the site's footer and in the desktop app after the bar closes. Read [Safety model](./safety-model.md) for what the engine refuses and [Desktop app](./desktop.md) for what the window sends.
```

## `desktop-tours.md` — walk through the desktop app

```md
---
title: 'Walk through the desktop app'
description: 'Where the page tours and walkthrough appear, and what they leave untouched.'
tags: [desktop, tours, quick-start]
---

# Walk through the desktop app

Choose **Tour this page** to learn the controls on the screen you are using. Each step names one landmark and what it opens or checks. No run starts. The tour does not change a setting, sign you in or buy a plan.

## How do I tour this page?

Choose **Tour this page** in the header. Use **Next**, **Back** or **Skip tour**. A short hint can offer the tour once on a page. It stays away from an active task. If a control is hidden in your current state, the tour skips that step instead of pointing at an empty space.

On **Home**, inspect the scan, dry-run and safety detail before a real run; on **Sections** and **Choose**, read the target and its consequence before selecting it. A tour closes before a run starts. The engine still applies the same protected-path refusals when the tour is closed.

## How do I take the walkthrough?

Choose **Walk through windowsweep** for the separate sequence from scan to report. It includes the protected paths the engine refuses before the dry-run step. The walkthrough starts no cleanup run and spends no real-run claim. Use **Open Home** at the end to begin with your own scan.

Read [Safety model](./safety-model.md) for the engine's protected-path rules and [Desktop app](./desktop.md) for what the window sends. A tour changes neither.
```

## `changelog.md` — release entry

Insert under `[Unreleased]` only when 1.4.0 is tagged. Not before. `{{releaseDate}}` is the actual release date, never the draft date. Before replacing that slot, the applier checks the CLI package, the desktop installer, the updater signature and the live pricing and policy pages against every line in this entry.

```md
## [1.4.0] - {{releaseDate}}

The command-line engine keeps all 26 sections. Their protected-path refusals remain. The desktop app adds plans, a real-run allowance, Team and referral screens, page tours and a required-update flow. The app and the engine it bundles share one version.

### Added

- **Plans and run allowance.** The desktop app counts real runs. Dry-runs, scans, report-only runs and command-line runs are never counted. Free keeps every section, signed-in run-summary sync, History and per-run report export; Pro and Team add the features described on [Pricing](https://windowsweep.aoneahsan.com/pricing).
- **Plan requests and referrals.** While checkout is closed, a plan request charges nothing. It grants nothing. The referral panel shows an invite code, points and any earned Pro time without naming the friend.
- **Page tours and a walkthrough.** The tours identify controls and protected-path rules without starting a run or changing a setting.
- **Published release notices.** A normal notice requires the next version from the next start; an urgent release blocks an older app when found. Update installs a verified desktop release after any running cleanup finishes.

### Changed

- **The old desktop weekly task on Free is removed on first start**, with a one-time notice. The command-line `--install-task` is unchanged.
- **The desktop window's data notice now links to both policies.** The command-line engine still makes no network calls of its own.
```

## `llms.txt` — additions at release

At the release gate, change the current-version sentence and the desktop release tag only after the actual artefacts exist. A link is a claim. Add these links to the Documentation list and facts section only after each page responds with the intended content at its public address; avoid repeating mutable prices and limits in the text file.

```md
- [Desktop plans](https://windowsweep-docs.aoneahsan.com/plans): what counts as a real run, what each plan adds, plan requests and referral time
- [Required updates](https://windowsweep-docs.aoneahsan.com/updates): the notice, block and verified desktop installer
- [Policy notice](https://windowsweep-docs.aoneahsan.com/legal-notice): the Terms and Privacy links and where the bar appears
- [Desktop tours](https://windowsweep-docs.aoneahsan.com/desktop-tours): page tours and the walkthrough; no tour starts a run
```

## Self-check

- Palette: precision leads every page and the changelog; refusal appears beside the counted run, path, data and tour claims; workshop dryness is absent on the payment and update consequence passages.
- Rhythm: shortest sentence, “Nothing runs yet.” The longer sentences explain the release gate and the pool and reward mechanics rather than decorate them.
- Length: the proposed fenced pages are 539, 331, 204 and 252 whitespace-delimited words, including front matter; the changelog entry is 223, and `llms.txt` has four short entries. Row 27 sets reference length rather than a numeric cap.
- Unsure spots: release date and version facts are release-gated substitution slots. No date guessed. The line about a form draft is deliberately conditional until browser persistence proof, because a promise that text survives an update would be false if the browser had never saved that text before the block appeared. No owner-only decision is needed for this draft.
