# Project Context - windowsweep, the owner decisions of sessions 13-20

Moved here **verbatim** from [`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md)'s `## Durable owner decisions` section on
2026-11-05, when that file passed its 500-line ceiling. Nothing was reworded: D13-D54, 2026-09-12 to 2026-09-28.
Later decisions (D55 on) stay in `PROJECT-CONTEXT.md`.

### Session 13 decisions (2026-09-12) - the audit

Asked to audit the whole project again and rewrite every record, the owner settled eight questions. His
answers by the option label he chose, and what each one changed:

| # | Question | Answer | Consequence |
|---|---|---|---|
| **D13** | The workspace root had been renamed to `windowsweep-root` under every record | **"Yes, windowsweep-root is final"** | every instruction record repointed; the memory note moved to the new project key; historical quotes keep the old name |
| **D14** | `/privacy` promises account deletion no surface could perform | **"Build it"** | RW-113: a `delete_my_account()` SECURITY DEFINER RPC in this repo's schema home, wired into the site's `/account` and the desktop Account screen, proved on a throwaway alias |
| **D15** | Google sign-in (MANUAL-TASKS row 15) | **"Yes, I will enable it during this run"** | RW-116: sign-in, contact, account, deletion and the admin gating verified as the non-admin alias and as the admin |
| **D16** | Execution model for the remaining work | **"Fable writes audit + plan, Opus executes"** | this session ends with the v3 plan; an Opus session runs its waves. Restated mid-session: *"make sure fable 5.1 plans and save plan and then stop i will switch model to opus 5 and it will (should) implement all planned work, it should run 4 custom subagents to get all planned work as best and fast as possible implemented"* |
| **D17** | Android | **"Keep it out"** | no Android build for the site or the CLI; Capacitor stays wired |
| **D18** | The docs certificate GitHub has not issued in five days | **"Yes, remove and re-add via the API"** | RW-102 opens with the Pages API re-add, then one pass over every docs link |
| **D19** | The two 1.2.0 report-body wording changes flagged for veto | **"Both stand"** | `Reclaimed` in the report tables and the HTML hero without `dry-run` are final |
| **D20** | The sub-agent ceiling for the Opus run | **"Up to four at once"** | scopes pairwise disjoint, verified before every dispatch; hot files main-only; the standing rule of two returns afterwards |

### Session 16 decisions (2026-09-17) - the v4 audit, four from the owner

He ran his standard audit prompt: understand the whole project, refresh every record to the state of the
tree, estimate what is left, then finish it and deploy. Fable 5.1 audited read-only and wrote
`../completion-plan-v4-2026-09-17.md`; Opus 5 executes it. Four decisions, each his verbatim option:

- **D21 - "One writer at a time".** Final, and it supersedes D20's four and the three of 2026-09-14. His
  standing audit prompt still carries the line "it should run 4 custom subagents", so he was asked directly
  and chose the one-writer ceiling on context cost. Read-only explorers may run beside the single writer;
  hot files stay main-only; agents never commit, push, deploy or publish.
- **D22 - "I will enable it before Opus runs"** (row 15, the Google Web OAuth client). 🔴 Probed the same
  day and `external.google` still reads **false**, so ordering rule O6 governs: do everything else first,
  re-poll, and if it is still off when `desktop-v1.2.0` is cut, that release ships with sign-in dormant
  exactly as 1.1.0 did. Never wait on it, and never claim it flipped without a fresh probe.
- **D23 - "Yes, cut 1.3.0 now".** RW-121 ships in this run, so the CLI closes here rather than on the second
  machine. 🔴 The **desktop stays at 1.2.0**: `desktop-release.yml` compares the app manifests with `VERSION`
  at the tagged commit, so the desktop tag is cut first, and because the bundled engine is untracked and
  copied at build time a later dev build carries a 1.3.0 engine under a 1.2.0 app until the next desktop
  release catches up. That consequence is stated in the release notes, not left to be discovered.
- **D24 - "Straight through".** Records, then every unblocked item to the release and the deploys, then the
  records again. No review in between; he reviews at the end, himself.

### Session 17 decisions (2026-09-24/25) - the v5 audit and its execution, twenty-two from the owner

He re-ran his audit prompt, then asked mid-turn for a Terms page "first, so i can get google cloud console app
in production and approved", then approved executing plan v5 with custom agents. Each line is his verbatim option.

- **D25 - Google sign-in: "enabled just now, continue"** - probed `external.google: true` 2026-09-24T10:15Z.
- **D26 - `desktop-v1.3.0`: "Here, once Google is on (Recommended)"** - cut on THIS machine with the 1.3.0
  engine, TASK-013 and sign-in live, a GATE 4 round and the updater proof 1.2.0 -> 1.3.0. Supersedes D23's
  second-machine placement for the desktop.
- **D27 - "Yes, finish on Opus 5.5 (Recommended)"** - the audit prompt's Fable-plans role waived for this run.
- **D28 - "This session sets them (Recommended)"** - Supabase Auth `site_url` = `https://windowsweep.aoneahsan.com`,
  `uri_allow_list` = `https://windowsweep.aoneahsan.com/**,http://127.0.0.1:*`; set and read back 2026-09-24.
- **D29 - "I'll make sure it's published (Recommended)"** - the owner publishes the OAuth consent screen
  (MANUAL-TASKS row 30).
- **D30 - "Also a t1+admin identity"** - RW-116 runs as `t1+1` and `t1+del` (admin-API users, sessions injected),
  `t1+admin` promoted by out-of-band SQL then demoted and deleted in the same wave (O8), the real Google path once
  as the base automation identity, and one real desktop sign-in by the owner (row 31).
- **D31-D34 - the Terms facts:** "Pakistan (Recommended)" (law and courts) · "Google's age where you live
  (Recommended)" · "Ahsan Mahmood (Recommended)" (operator, `aoneahsan@gmail.com`) · "Site, account and software
  (Recommended)". The panel was his "Lean panel (Recommended)"; its three answers (acceptance, misuse, as-is) and
  the effective date ("The day it goes live") are in `docs/story/decision-log.md`. GATE 4: "Approve, ship it".
- **D35 - up to three custom agents** ("i approve, if needed run up to 3 custom subagents"), superseding D21 for
  this run; raised by D43.
- **D36 - "Yes, apply it (Recommended)"** - `runs_user_id_started_at_idx` on `runs (user_id, started_at desc)`,
  applied 2026-09-25 through the session pooler and verified from `pg_indexes` (migration `20260924160739`).
- **D37 - "After the releases, this run (Recommended)"** - the fleet package baseline (ESLint 10, the script
  contract, prettier, husky + lint-staged, vitest) runs after `desktop-v1.3.0`, in this run.
- **D38 - "Manage own account (Recommended)"** - the Terms age is the one Google requires to manage your own
  Google Account, so a parent-supervised child's account does not qualify.
- **D39-D42 - the desktop sync behaviour:** a failed Remove keeps manual retry ("Manual retry") · the settings
  notice sits on Account plus one Home line, in memory only ("Account + a Home line") · no notice on a fresh
  machine ("No notice then") · no notice when a date-only win changes no value ("No notice then").
- **D43 - up to four custom agents** ("re-run the custom subagents up to 4 custom subagents", 2026-09-25),
  superseding D35: scopes pairwise disjoint and verified before each dispatch, hot files main-only, agents never
  commit, push, deploy or publish, and the account-creating and deleting steps of RW-116 stay in the main session.
- **D44-D46 - the team voice** (asked 2026-09-25, after the owner's fleet rule of the same day: products speak as
  "the {Product} team", never one person). **D44 "Change first, then release (Recommended)"** - the desktop
  Settings wording changes, through the story pipeline with his GATE 4 and dummy first, BEFORE `desktop-v1.3.0`
  is tagged. **D45 "All public surfaces, legal kept (Recommended)"** - the team voice on the site, the docs site,
  the README and the desktop app, author metadata included; the Terms operator (D33), the LICENSE copyright and
  the npm `author` field stay, as legal and registry facts. **D46 "Drop it from product rosters
  (Recommended)"** - the personal-portfolio entry ("Meet the Developer") leaves every product roster; the
  portfolio keeps its own voice where it lives.
- **D47 - the About panel stays** (asked 2026-09-25, after GATE 4 round 14 found D-67: a Settings -> About panel the
  app has carried since its first build and the dummy never had). **"Keep it, add to dummy (Recommended)"** - its
  three sentences and the **Source** / **Support this work** buttons are kept word for word and written into the
  dummy first; the answer is also that panel's GATE 4. D-66 (the Settings status note) was the main session's call by
  the round-8 amendment and arrives in the app. Both are checked by round 15 before the tag (D44).
- **D48 - TASK-017 is applied** (asked 2026-09-25): **"Yes, apply it (Recommended)"**. The forward migration
  `20260925154905_stamp_contact_request_handled.sql`: a trigger stamps `handled_at` and `handled_by` on the server when
  the status changes (cleared on a return to `new`, pinned otherwise), and the admin's column grant narrows to
  `status`. The site stops sending both first, and RW-116's flow 3 is re-run after. A production schema change, so his
  yes came first (the D30/D36 pattern).
- **D49 - the workspace root is backed up in git** (asked 2026-09-26): **"get this root folder backed up in git
  properly in existing project repo, in project-root branch or whatever branch we have decided for this purpose in
  global rules, make sure to initialize claude properly in this root folder and put readme etc, so our context
  management will be as best and optimized as possible"**. The fleet rule for a root container whose product
  repository is public puts it on the private `windowsweep-web`: branch `project-root`, remote `o` fetching that
  branch only, unrelated history, never merged. The `webview2-profile/` caches stay out; `../RESTORE.md` rebuilds
  the workspace. It supersedes D1's consequence that the root is not a repository; the planning files still never
  enter this public repository.
- **D50 - `desktop-v1.3.1` is cut in session 18** (asked 2026-09-26): **"Yes, this session (Recommended)"** - after
  the hook line and TASK-019: the O2' cascade to 1.3.1, a kit from `release-kit-1.3.0/`, GATE 4 round 16 until CLEAN,
  publish `--latest`, the updater proof 1.3.0 -> 1.3.1, then the site's download page and the docs (O3').
- **D51 - the stray `runs$RUNID` app-data folder is deleted** (asked 2026-09-26): **"Delete it (Recommended)"** -
  its three files were listed with their SHA-256 in `../gate4-evidence/stray-runs-RUNID/listing.txt` first.
- **D52 - TASK-020 widens the desktop CSP for Clarity** (asked 2026-09-26): **"Widen the CSP (Recommended)"** - its
  documented hosts and Tag Manager's pixel, the replay proved masked on the wire; it ships in the next desktop release.

### Session 19 decision (2026-09-28) - the sign-in fix and 1.3.2

- **D53 - "release new version now"** (2026-09-28, after row 31 failed on the installed 1.3.1), verbatim: *"i tested,
  "the sign-in reply did not match the request that started it" still getting this on sign, release new version now
  ... plan and fix the auth issue in desktop app, and install up to date app in this system once done so i can test
  again, and plan and finish all remaining work fully and properly now please"*. He approved the plan that followed:
  `desktop-v1.3.2` with the sign-in fix (DONE-021), TASK-020 (DONE-020) and the run-folder fix (DONE-022), installed
  here by the updater. Because `desktop-release.yml` refuses a desktop version that differs from `VERSION` (one number
  in the About box), the engine went out as **CLI 1.3.2** too - 1.3.1's engine, file for file.

### Session 20 decision (2026-09-28) - what a development build reports

- **D54 - TASK-023, option (a)** (asked 2026-09-28): **"Yes, option (a) (Recommended)"**.
  - A development build starts no analytics: `yarn dev`, every `tauri dev` session and each GATE 4 round.
  - GA4, Amplitude, Clarity and Sentry are watched on a production-protocol build or on the installed first boot.
  - The production bundle is byte-identical, so no release carries the change (DONE-023).

Last Updated: 2026-11-05 (created by the verbatim move of the session 13-20 decision blocks from `PROJECT-CONTEXT.md`)
