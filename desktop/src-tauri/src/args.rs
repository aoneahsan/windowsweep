//! What the window is allowed to ask the engine to do.
//!
//! The argument allowlist, lifted out of `engine.rs` when that file passed the
//! project's 500-line ceiling. It is the whole security argument for `run_clean`:
//! the executable is fixed and the script path is resolved from the bundle, so the
//! only thing a front end still influences is the argument vector, and this is
//! where that is decided.
//!
//! 🔴 Every entry here was checked against the engine before it was added. An
//! allowlist entry decides whether this window may PASS a flag; it cannot make the
//! engine implement one. A flag allowlisted but not implemented reaches
//! `windowsweep.ps1`'s `default` arm as `unknown argument: ...` - a runtime failure
//! behind a green build, which is exactly the shape this file exists to prevent.

/// Flags the desktop window may pass through. Anything else is refused with the
/// flag named, rather than silently dropped - a dropped flag would mean a run that
/// quietly did something other than what the screen said it would.
const ALLOWED_FLAGS: &[&str] = &[
    "--all",
    "--scan",
    "--dry-run",
    "--yes",
    "--json",
    "--no-color",
    "--ascii",
    "--quiet",
    "--no-report",
    "--notify",
    "--developer",
    "--not-developer",
    "--purge-all",
    "--i-understand-deep",
    "--permanent",
    "--elevate",
    // 🔴 `--list` is how the app learns what the engine can do. `catalogue.ts`
    // calls `windowsweep --list --json` at boot precisely so no section list is
    // ever hard-coded in the app, and this allowlist did not carry it — so the
    // catalogue load was refused with "refusing an argument this window is not
    // allowed to pass: --list" and every screen that reads the catalogue was
    // empty. It is read-only: it prints the catalogue and touches nothing.
    "--list",
    // Read-only companions of `--list`, allowed for the same reason: they print
    // and exit. Keeping them out would mean the app can never show what a
    // section targets without hard-coding it, which is the thing `--list` exists
    // to prevent.
    "--list-targets",
    "--version",
    "--self-test",
    // The weekly Scheduled Task, verified present in the engine at
    // windowsweep.ps1:151-152 where each sets `$ws.Mode`. Both are bare mode
    // flags taking no value, so they belong here rather than below.
    //
    // These two WRITE - they register and remove a Scheduled Task - which is why
    // they are named individually rather than admitted by any looser rule. The
    // pair is deliberate: a window that can create the task and not remove it
    // leaves the person with something they cannot undo from the app that made it.
    "--install-task",
    "--uninstall-task",
];

/// Flags that take exactly one value.
///
/// 🔴 `--large-file-mb`, NOT `--large-mb`. The shorter spelling was proposed for
/// this list and is not a flag: `windowsweep.ps1:171` reads `--large-file-mb`, and
/// nothing anywhere in the engine answers to `--large-mb`. Allowlisting it would
/// have compiled, passed every gate, and then thrown `unknown argument: --large-mb`
/// from the engine's own `default` arm the first time the size control was used -
/// an allowlist entry cannot make a flag exist. The verification is a grep of
/// `windowsweep.ps1`, `lib/*.ps1` and `modules/*.ps1`, and it is why the test below
/// asserts the misspelling is refused rather than only that the real one is allowed.
const ALLOWED_VALUE_FLAGS: &[&str] = &[
    "--only",
    "--profile",
    "--exclude",
    "--days",
    // Verified at windowsweep.ps1:164, and already present before this pass.
    "--temp-days",
    // Verified at windowsweep.ps1:171.
    "--large-file-mb",
    "--hiberfil",
    "--scan-roots",
    // Verified at windowsweep.ps1:170; repeatable, which the validator already
    // handles because it walks the vector rather than deduplicating it.
    "--exclude-path",
    "--select",
    // Verified at windowsweep.ps1:181-186. `write_select_file` in `runs.rs` writes
    // the file this points at, inside the run folder.
    "--select-file",
];

pub fn validate(args: &[String]) -> Result<(), String> {
    let mut i = 0;
    while i < args.len() {
        let a = &args[i];
        if ALLOWED_FLAGS.contains(&a.as_str()) {
            i += 1;
        } else if ALLOWED_VALUE_FLAGS.contains(&a.as_str()) {
            if i + 1 >= args.len() {
                return Err(format!("{a} needs a value"));
            }
            if args[i + 1].starts_with("--") {
                return Err(format!("{a} was given another flag instead of a value"));
            }
            i += 2;
        } else {
            return Err(format!(
                "refusing an argument this window is not allowed to pass: {a}"
            ));
        }
    }
    Ok(())
}

/// Whether this invocation should produce a JSON summary on stdout.
///
/// Read off what the CALLER asked for, never off the built argument vector, because
/// `--json` is appended to every invocation. Three flags legitimately produce no
/// summary and are exempt by name; the exemption list is the whole of the logic, so
/// it is here where a test can reach it rather than inline in `run_clean`.
pub fn wants_summary(args: &[String]) -> bool {
    !args
        .iter()
        .any(|a| a == "--version" || a == "--self-test" || a == "--elevate")
}

#[cfg(test)]
mod tests {
    use super::{validate, wants_summary};

    /// The allowlist is the whole security argument for this command, so it is the
    /// one thing here carrying a test: a flag the engine never documented, and a
    /// value flag whose value is missing, must both be refused rather than passed.
    #[test]
    fn refuses_arguments_outside_the_allowlist() {
        let ok = |v: Vec<&str>| validate(&v.into_iter().map(String::from).collect::<Vec<_>>());
        assert!(ok(vec!["--all", "--dry-run"]).is_ok());
        assert!(ok(vec!["--only", "1,3"]).is_ok());
        // --uninstall-data would delete the user's history; the window may not ask for it.
        assert!(ok(vec!["--uninstall-data"]).is_err());
        assert!(ok(vec!["--only"]).is_err());
        assert!(ok(vec!["--only", "--yes"]).is_err());
        // the run folder is chosen by this process, never by the caller
        assert!(ok(vec!["--reports-dir", "C:\\Windows"]).is_err());
    }

    /// The app reads what the engine can do rather than hard-coding it, so the
    /// read-only flags it depends on at boot must be passable. `--list` was absent,
    /// which refused the catalogue load and emptied every screen that reads it.
    ///
    /// These four print and exit. None of them deletes anything, so allowing them
    /// costs nothing and refusing one breaks a screen.
    #[test]
    fn exempts_only_the_invocations_that_produce_no_summary() {
        // A real run must be held to the contract: no summary line is a failure.
        for args in [
            vec!["--all".to_string(), "--yes".to_string()],
            vec!["--only".to_string(), "12,13".to_string()],
            vec!["--dry-run".to_string()],
            vec!["--list".to_string(), "--json".to_string()],
        ] {
            assert!(
                wants_summary(&args),
                "{args:?} completes a run or prints the machine contract, so the summary is owed"
            );
        }

        // These three print their own shape instead, and demanding a summary from them
        // turns a working path into a hard error. `--elevate` is the one that cost a
        // hang: the parent hands off to an elevated window and exits before the runner
        // that prints the summary is reached.
        for args in [
            vec!["--version".to_string()],
            vec!["--self-test".to_string(), "--no-color".to_string()],
            vec![
                "--only".to_string(),
                "12,13,14".to_string(),
                "--elevate".to_string(),
                "--yes".to_string(),
            ],
        ] {
            assert!(
                !wants_summary(&args),
                "{args:?} produces no summary by design, so the guard must not fire"
            );
        }
    }

    #[test]
    fn allows_the_read_only_flags_the_app_needs_at_boot() {
        let ok = |v: Vec<&str>| validate(&v.into_iter().map(String::from).collect::<Vec<_>>());
        for flag in ["--list", "--list-targets", "--version", "--self-test"] {
            assert!(
                ok(vec![flag, "--json"]).is_ok(),
                "{flag} is read-only and the app needs it; refusing it empties a screen"
            );
        }
        // The boundary still holds: a read-only-looking flag that is NOT documented
        // is still refused, so this test did not widen the allowlist to anything.
        assert!(ok(vec!["--list-everything"]).is_err());
    }

    /// 🔴 The flags added for the scheduling and selection screens - and the one
    /// that was asked for and does not exist.
    ///
    /// Each entry below was checked against the engine before it was allowed, by
    /// grepping `windowsweep.ps1`, `lib/*.ps1` and `modules/*.ps1`. The line
    /// numbers are in the comments beside the constants. That check is the whole
    /// point: an allowlist entry only decides whether this window may PASS a flag,
    /// and passing one the engine does not implement produces
    /// `unknown argument: ...` from the engine's own `default` arm - a runtime
    /// failure with a green build behind it.
    #[test]
    fn passes_the_verified_flags_and_refuses_the_one_that_does_not_exist() {
        let ok = |v: Vec<&str>| validate(&v.into_iter().map(String::from).collect::<Vec<_>>());

        // Bare mode flags, windowsweep.ps1:151-152.
        assert!(ok(vec!["--install-task"]).is_ok());
        assert!(ok(vec!["--uninstall-task"]).is_ok());
        // These take no value, so a stray one must be refused rather than eaten.
        assert!(ok(vec!["--install-task", "weekly"]).is_err());

        // Value flags, all four verified in the engine.
        assert!(ok(vec!["--temp-days", "1"]).is_ok()); // :164
        assert!(ok(vec!["--large-file-mb", "500"]).is_ok()); // :171
        assert!(ok(vec!["--exclude-path", "C:\\keep"]).is_ok()); // :170
        assert!(ok(vec!["--select-file", "C:\\runs\\r1\\select.txt"]).is_ok()); // :181
                                                                                // Repeatable, which the engine supports and the validator must not break.
        assert!(ok(vec!["--exclude-path", "C:\\a", "--exclude-path", "C:\\b"]).is_ok());

        // 🔴 `--large-mb` IS NOT A FLAG. The engine spells it `--large-file-mb` and
        // has no other handler for a size limit, so this must stay refused. It is
        // asserted because the shorter name is the plausible-looking mistake: it
        // reads like a real flag, an allowlist entry for it costs nothing visible,
        // and the failure surfaces only when a person moves the size control.
        assert!(
            ok(vec!["--large-mb", "500"]).is_err(),
            "--large-mb does not exist in the engine; allowlisting it would defer \
             the failure to the first person who used the control"
        );

        // And the neighbours of the two real additions stay refused, so this test
        // records a checked pair rather than a category.
        assert!(ok(vec!["--install-tasks"]).is_err());
        assert!(ok(vec!["--reinstall-task"]).is_err());
    }
}
