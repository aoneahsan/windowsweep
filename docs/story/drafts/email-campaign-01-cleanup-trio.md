# Email campaign 01 — A1, the cleanup family (approved by the owner 2026-11-10, sending since the same day)

**Surface:** a cold marketing email in FilesHub email marketing, project `windowsweep`, template `windowsweep-mkt-a1`,
layout `marketing`. FilesHub adds the brand header, the footer, the postal address and the unsubscribe link.
**Contract:** `aoneahsan-cccs-email-campaigns/references/marketing-email-content.md`: the ten blocks, with the button
above the fold and again at the end.
**Why one email for three tools:** owner, 2026-11-10: *"'windowsweep, macleanup, linux-cleanup' those three should be 1
email, as they are same category"*. linux-cleanup has no website. It links to its GitHub repo, the owner's choice the
same day, and he is moving that project out of the frozen list himself.

**Subject (43):** See what goes before your disk cleanup runs
**Preheader (66):** windowsweep for Windows, macleanup for Mac, linux-cleanup for Linux.
**From:** The windowsweep team · **Reply-to:** hi@aoneahsan.com · **Sent by:** the shared marketing pool

| # | Block | Words | Source |
|---|---|---|---|
| 1 | Eyebrow + hook | Disk cleanup for developers · **See the list before anything goes** | Bible §1 premise: it tells you what it will touch before it touches anything |
| 2 | What it is | windowsweep cleans a Windows machine. Its siblings do the same for Mac and Linux. | README: "the Windows member of a family with linux-cleanup and macleanup" |
| 3 | Button | See windowsweep → site, `utm_campaign=cleanup-trio-01&utm_content=a1` | — |
| 4 | Hero | The app's home: 59.6 GB reclaimable above the reclaim map | Live site shot `/app-shots/app-home-light.png`, cropped |
| 5 | The problem | A cleaner that guesses gets uninstalled · It wipes a cache you needed · It never names the path · Nothing is safe, so nothing gets deleted | Bible §2: problem-aware, solution-sceptical; the budget goes on the guarantees |
| 6 | What it does | Every section is numbered · A rehearsal before the real run (`--scan`, `--dry-run`) · Personal files wait for you (Recycle Bin) | README lede and warning; voice lines 3, 8 |
| 7 | One for each system | macleanup: 28 sections in plain bash, destructive sections confirm, `npx macleanup --dry-run` · linux-cleanup: 100-day default, refuses personal folders, `npx linux-cleanup --scan` | macleanup README 5.3.0; linux-cleanup README 1.6.0 |
| 8 | Why it is worth a try | No network calls (windowsweep, linux-cleanup) · Recent caches can stay (idle gate / 100-day default) · Nothing to install (`npx`) · Open source, MIT | The three READMEs; `npm view <pkg> license` = MIT |
| 9 | How to start | Open a terminal · `npx windowsweep --scan` · Read the list, run only what you want | README quick start |
| 10 | Callout | Some steps have no undo: emptying the Recycle Bin and clearing event logs sit behind their own flag | README warning (`--i-understand-deep`) |
| 11 | Button again + P.S. | Same link, `utm_content=a1-end` · Which machine do you clean most? Reply and say. | Voice: third person for the tool, no "we" |

**Images:** six public FilesHub objects on project 60. The windowsweep app screens are crops of the live site's
`/app-shots/` captures: hero `01M72BYTK2SVBAVBN4R4RM59YV`, sections `01M72BYXT4YWS6J21KQ2WJW4C7`, safe run
`01M72BYYN5XK6WH5SDVNWV1VHX`, "these need a person" `01M72BYZPKKNEW9NSEHG6RVA2V`. The two marks are macleanup
`01M72BZ2B7PXE8V81ZXR3HS3J0` and linux-cleanup `01M72BZ4E1T6NC90W2KP1EZRZ6`. Neither tool has an app screen to
show, so a mark stands in.

**Checks:** 380 words in the text part. No exclamation mark, no "we", none of the fingerprint's Never words. Every
number is on the screen shown or in a README. No price or plan claim.

**FilesHub:** list `01M72C4PACAYSY2SMDDNZFZSXN`, sequence `01M72C4S0DZZPTXWQSBEJV1R9S` (draft, max 1,000).
`[TEST]` email `01M72C5677W0N39ZF4ZNC4CSZV` went to aoneahsan@gmail.com. **On approval:** approve A1, activate,
assign one available pool batch (`POST /email-batches/{id}/assign`, dry run first), and raise the daily cap from
10 to 50.

**Approved 2026-11-10:** the owner typed "approve" after the `[TEST]`. The sequence is active. Pool batch 109
(`01M4CN6QFNXXPMKBKX2AZ3YKJ3`) is assigned: 952 enrolled, 40 stopped addresses left out. The daily cap is now 50,
with a warm-up ramp from 10 (+3 a day) inside 09:00–18:00 UTC.

## 2026-11-10: A2 and A3 written and scheduled (owner: "i approve, do/write second and more emails now, schedule as best as possible")

- **Restructured.** A running FilesHub sequence cannot take new steps, and a separate follow-up sequence would wait out
  the 20-day cross-campaign gap. The one-step sequence `01M72C4S0DZZPTXWQSBEJV1R9S` was paused and finished with
  **0 sent**. The same list is now enrolled in **`01M72CXFSPQDKM8NABC2EEZQ31`**, "Cleanup tools — campaign 01
  (A1–A3)": 952 people, A1 → A2 after 96 h → A3 after 168 h. Pool batch 109's assignment record still names the
  finished sequence.
- **A1 link change (owner-approved):** linux-cleanup now links to `https://www.npmjs.com/package/linux-cleanup`. Its
  GitHub README still opens with the frozen banner.
- **A2, `windowsweep-mkt-a2`**: "Keep the caches your next build needs" (319 words). It covers the idle window
  (100 days), a tier on every row, the engine's own log and JSON report, and linux-cleanup's 100-day default. Images:
  map `01M72CQQ5PH67CZVSMA3HA3SP7`, developer mode `01M72CQN777QSVG8YA66MSNQSK`, log `01M72CQP6J6CK2H7D4P5FT9EPG`,
  plus A1's sections shot. Sources: README lede and warning, voice line 6, the live app shots.
- **A3, `windowsweep-mkt-a3`**: "The big folders are yours to pick" (330 words). It covers sections 17, 18, 19 and 23
  (interactive, never in a safe run), the Recycle Bin for picks, the app's "documents, photos, keys and saved
  passwords are never touched" line, macleanup's Trash, linux-cleanup's personal-directory refusal, and the section 26
  uninstall warning. A1's images are reused.
- `[TEST]` copies of A2 and A3 went to aoneahsan@gmail.com on 2026-11-10.
