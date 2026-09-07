---
title: 'Desktop app'
description: 'The windowsweep desktop window: what it adds over the command-line tool, what it collects, and the SmartScreen note on first run.'
tags: [desktop, tauri, privacy, install]
---

# Desktop app

The desktop app is a window over the same engine. It runs the bundled `windowsweep.ps1` with `--json --no-color` and reads its section list from `--list --json`. It reimplements no cleanup logic: the chokepoint, the protected lists and every refusal are the ones the command line enforces. The two differ in what leaves the machine, and that has three answers.

## What it adds over the command line

Nothing to the deletion behaviour. Everything to what you can see while it happens.

The catalogue becomes a table you can filter. A run shows the engine's own log as it arrives, beside a table of what each section reclaimed; the four sections that ask a person to choose get a picker. Most controls in Settings map to a flag the engine already has, so anything you set there you can also type.

## What it does not do

It never raises its own privileges. Six sections need Windows to ask your permission first. Ask for one, and a second, elevated window runs only those sections and writes its own report, while this one waits unelevated. It does not remove the deep-section gate.

## What leaves the machine

Three answers, because three different things are running.

**The engine sends nothing, ever.** No network calls at all, and a self-test check fails the build if one appears.

**The window sends usage and crash reports, to improve the product for everyone.** There is no switch. The first-run screen is a notice with one **Continue**. Four destinations - product analytics, behaviour analytics, session replay with every piece of text masked, and crash reports with file paths stripped out. In 1.1.0 no destination is configured in the build, so nothing has left the machine yet. That is a fact about this release, not a promise: it stops being true the day a key is added.

**Two requests run without asking, and neither carries anything this app knows about you.** On every start the app fetches `latest.json` from this repository's releases; on a machine with no WebView2, the installer downloads it from Microsoft.

**Never sent:** a file path, a folder name, a drive label, your user name, your machine name, or the contents of anything. A run summary is a count and a number of bytes.

### Sign-in and sync

Optional, Google, and it opens your normal browser rather than a window inside the app, so you can see the address bar. What it uploads, in full:

| Your settings | Each run summary |
|---|---|
| your preferences, and when you last changed them | date and duration |
| the developer answer | mode, dry-run, elevated |
| your email address and display name | the section numbers it ran |
| a last-seen timestamp | bytes reclaimed, bytes estimated, and an id |

In 1.1.0 this is dormant: Google is not enabled on the backend project, and the Account screen reports sign-in as unconfigured.

## Install it

Download the `.msi` or the `.exe` installer from [Releases](https://github.com/aoneahsan/windowsweep/releases). The `.exe` installs for the current user and asks for no administrator rights; the `.msi` installs for every user, so Windows asks once. The engine ships inside the app: no separate PowerShell setup, and no Node.

### Windows may warn you the first time you install this

The installer is not signed with a paid code-signing certificate, so Microsoft SmartScreen shows *"Windows protected your PC"* on first run. That is a statement about the certificate, not about the file.

Choose **More info** and then **Run anyway**. You can verify what you downloaded first: every release publishes a SHA-256 checksum for each installer, and a minisign signature the app's own updater checks. Neither is a code-signing certificate - they prove the file is the one that was built, not who built it. The source is public.

This note is here rather than hidden because meeting that dialog unexplained is worse than reading about it in advance.

## Updates

The check runs on the splash screen. An update is offered rather than applied: **Later**, or **Install and restart**. If the check cannot reach the network, you get a note saying so, with **Try again**, and the app carries on without it.

## Where it writes

Each run gets its own folder under `%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\`, holding that run's report and log. An elevated run writes a second report beside the first, because two windows each write their own.

See also: [Safety model](./safety-model.md) · [Admin sections and elevation](./admin-and-elevation.md) · [Sections 0-25](./sections.md)
