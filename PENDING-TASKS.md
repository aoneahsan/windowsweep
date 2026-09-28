# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-28 (latest: TASK-023 filed from the 1.3.2 proofs - a development build reports its analytics too; TASK-020 fixed in code and proved, closing with desktop-v1.3.2. Earlier 2026-09-26: TASK-020 filed from the `desktop-v1.3.1` updater proof - the desktop window's CSP blocks Clarity - and its fix chosen by the owner the same day, D52: widen the CSP. Earlier the same day: TASK-019 closed as DONE-019 - the three `desktop/scripts/*.mjs` generators became Vite plugins in `desktop/vite/`, and the tag run proved it. Earlier 2026-09-25: TASK-017 closed as DONE-018 - applied on D48 and verified both ways. Earlier: TASK-018 closed to `docs/DONE-TASKS.md` as DONE-017 - no new words were needed. Earlier: TASK-019 filed - the three `desktop/scripts/*.mjs` generators, found while preparing D37's desktop half. Earlier: TASK-013 closed to `docs/DONE-TASKS.md` as DONE-016 after its live verification; TASK-017 filed from RW-116: the admin's browser writes the handled fields; TASK-018 filed from TASK-013's run: the zero-count History header. Earlier 2026-09-17: TASK-014, TASK-015 and TASK-016 closed to `docs/DONE-TASKS.md` as DONE-013, DONE-014 and DONE-015 by the v4 run. TASK-013 is the only one left open, and it is blocked on owner row 15 - Google sign-in was re-probed on 2026-09-17 and still reads false)

### TASK-023 - a development build sends its analytics too, and Clarity records one local path there

**Found while working on:** the 1.3.2 proofs (D53, tracker `P6.release-1.3.2`) - proof B under `tauri dev`
(`../gate4-evidence/task020/`, 2026-09-28). **Priority: low** - development builds only; no installed build is
affected.

**The defect.** `startAnalytics` starts every destination whose key is present, with no development gate
(`desktop/src/lib/analytics.ts`), and the local `desktop/.env` carries the keys - so every `yarn tauri dev` session,
every GATE 4 round included, reports to the production GA4, Amplitude, Clarity and Sentry projects. Under Vite's dev
server the page carries `<style data-vite-dev-id="D:/.../app.css">`, and Clarity records that attribute: a local
path, the developer's, in a replay. A production build has no such attribute, and every text node stays masked in
both.

**What to do.** Decide how a development build reports: (a) skip `startAnalytics` when `import.meta.env.DEV`, and
move the GATE 4 steps that watch analytics (a round's isolation check reads Amplitude's storage keys) onto a
production-protocol build; or (b) keep development reporting and strip the Vite attributes before Clarity starts.
(a) is the fleet's usual shape. Either way a round's evidence must say which build it watched.

**Why it was not fixed there.** Proof B, the replay-mask proof for TASK-020, ran under `tauri dev` precisely because
analytics run there (the window's CSP does not apply in development). Changing that mid-release would have moved the
GATE 4 method for round 18; the data concerned is the developer's own, on the developer's machine.

### TASK-020 - the desktop window's CSP blocks Clarity, so session replay has never run in a desktop release

**Found while working on:** the `desktop-v1.3.1` release (D50, tracker `P6.release-1.3.1`) - its first-boot beacons
(`../gate4-evidence/updater-1.3.1/beacons.log`, 2026-09-26). **Priority: high** - a disclosure the window does not keep.
**The owner chose (a) - D52, 2026-09-26: "Widen the CSP (Recommended)".** It ships in the next desktop release;
when to cut that release is asked separately.

**The defect.** `desktop/src-tauri/tauri.conf.json`'s CSP has `script-src 'self' https://www.googletagmanager.com
https://www.clarity.ms` and `img-src 'self' data: blob:`. Clarity's loader (`www.clarity.ms/tag/...`) answers 200, but
the script it loads (`scripts.clarity.ms/0.8.70/clarity.js`) and its pixel (`c.clarity.ms/c.gif`) are refused, so
Clarity never starts - while Settings › Privacy (and the first-run notice) list *Session replay: This window, with all
text masked* as on. The 1.3.0 beacons (2026-09-25) saw the same two requests and did not read their outcome, so every
release since the telemetry ids landed (`desktop-v1.2.0`) is affected. The same `img-src` would also refuse Tag
Manager's sampled `/td` image pixel, which the site's policy refused until web `e01bf4f`.

**What to do - (a), chosen by D52.** (a) Widen the CSP to Clarity's documented hosts (`script-src
https://*.clarity.ms`; `img-src https://*.clarity.ms https://*.googletagmanager.com`), then prove on the wire that a
replay starts and that every text node reaches it masked - the tab's own promise; or (b) remove Clarity from the
desktop build and its row from Settings › Privacy and the first-run notice - dummy first, the words through the story
pipeline. Either way the disclosures describe what the window does, and the change ships in the next desktop release
with its GATE 4 round (the Privacy tab in scope) and the watch-only beacons.

**Why it was not fixed there.** The CSP is compiled into the binary, so either fix is a new desktop release; and (a)
starts a session recording that no desktop user has yet been subject to, while (b) changes an owner decision
(2026-09-07: Clarity with text masked, no opt-out) - both are the owner's to choose.
