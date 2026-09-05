# Firebase for the desktop app

Sign-in and sync are the only things that touch a network in this product. The
command-line engine makes no network calls at all, and the desktop window makes
none until a person signs in or accepts a telemetry destination.

## What is here

| File | What it is |
|---|---|
| `firestore.rules` | The security rules. Deny by default; a field allowlist on both documents |
| `firestore.indexes.json` | The one composite index the History screen needs |
| `firebase.json` | Firestore only - no Hosting target, no Functions |

## The data model, in full

```
users/{uid}                     email · displayName · settings · settingsUpdatedAt · createdAt · lastSeenAt
users/{uid}/runs/{runId}        runId · startedAt · mode · dryRun · elevated · sections[] · freedBytes · estimatedBytes · durationMs
```

That is the entire model. 🔴 **No path, folder name, drive label, machine name or
user name is stored anywhere**, which is what the consent screen promises. The
promise is kept in two places so neither can drift alone: `src/lib/sync.ts` ->
`stripRun` narrows the object before it is sent, and the field allowlist in
`firestore.rules` makes the server refuse anything wider.

## Deploying

🔴 **Never `firebase deploy --only firestore`** — the bare form can delete
indexes. Name both targets:

```bash
npx -y firebase-tools@latest deploy \
  --only firestore:rules,firestore:indexes \
  --project <project-id> \
  --config desktop/firebase/firebase.json
```

## Still owner-only

Creating the Firebase project itself, and enabling the Google sign-in provider,
are account-level actions on the owner's Google account. They are recorded as
rows in `docs/MANUAL-TASKS.md` alongside row 15 (the OAuth desktop client id),
because all three are needed together and none of them is useful alone: the app
compiles, installs and cleans without any of it, and sign-in stays dormant until
`VITE_GOOGLE_DESKTOP_CLIENT_ID` and `VITE_FIREBASE_API_KEY` are present.

## Two notes that cannot live in the files themselves

**`firestore.indexes.json` carries no comment keys.** The Firebase CLI validates
that file against a schema, so a `"//"` key inside an index object is a risk
rather than documentation. What the one index is for: the History screen pages a
person's own runs newest-first, twenty at a time. It is declared explicitly rather
than relying on Firestore's automatic single-field index surviving a schema change.

**`tauri.conf.json` carries none either, and that one is measured** — Tauri's
config schema rejects UNKNOWN FIELDS outright, so a `_note` key fails the build
with `unknown field ..., expected one of ...`. Measured in CI on 2026-09-05, on a
comment added in good faith. The note it was carrying belongs here: the
`bundle.resources` glob ends in `**/*`, not `**`, because in the Rust glob crate a
trailing `**` matches full path *components* — it found four directories and no
files, and tauri-build reported `didn't match any files`.
