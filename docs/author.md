# The windowsweep team

The windowsweep team makes the command-line tool and the [desktop app](./desktop.md), which drives the same engine and reimplements none of it. Both programs are open source under the MIT licence.

No guessed paths. A path becomes a target only once it has been seen on a real machine holding only regenerable data, and the ones still waiting are in the [candidate table](./sections.md#candidate-targets-awaiting-verification). Steam's shader cache is one of them, because the build machine has Steam and no games.

- Website: [windowsweep.aoneahsan.com](https://windowsweep.aoneahsan.com)
- Repository: [github.com/aoneahsan/windowsweep](https://github.com/aoneahsan/windowsweep)
- Issues: [github.com/aoneahsan/windowsweep/issues](https://github.com/aoneahsan/windowsweep/issues)
- Contact form: [windowsweep.aoneahsan.com/contact](https://windowsweep.aoneahsan.com/contact) - after signing in, so a reply has somewhere to go
- npm: [npmjs.com/package/windowsweep](https://www.npmjs.com/package/windowsweep)

## The cleanup family

| Platform | Tool | Install |
|---|---|---|
| Linux | [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) | `npx linux-cleanup` |
| macOS | [macleanup](https://github.com/aoneahsan/macleanup) | `npx macleanup` |
| Windows | [windowsweep](https://github.com/aoneahsan/windowsweep) | `npx windowsweep` |

All three share the same stance: name every path before touching it and show a dry-run before removal. windowsweep also lets you scan Downloads or folders you add for large or old files; those selected files go to the Recycle Bin. linux-cleanup and macleanup make no network call unless you request an update check. windowsweep's cleanup never touches the network; only its sections 30, 31 and 32, for the rows you pick, ask Windows Update or winget to download, and windowsweep itself sends nothing.

## Supporting the work

If windowsweep reclaimed space for you, the two things that help most are a star on GitHub and a note to a colleague who has the same problem. You can also support the maintenance at [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep).

Last Updated: 2026-11-14
