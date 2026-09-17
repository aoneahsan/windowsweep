//! Where a run's files live, and who may bring that folder into being.
//!
//! Lifted out of `engine.rs` when that file passed the project's 500-line ceiling,
//! and it is a separate concern rather than a convenient offcut: three modules ask
//! this question - `engine.rs` for a run it is about to start, `runs.rs` for the
//! selection file and the listing, `export.rs` for the report it converts - and two
//! of those three must NOT create anything.
//!
//! The id check here is the first of the two boundaries the run folder has;
//! `runs::ensure_inside` is the second, and neither is redundant. This one refuses
//! a name that could climb out. That one refuses a link that resolves out, which a
//! name check cannot see.

use std::path::{Path, PathBuf};

use tauri::{AppHandle, Manager};

/// Check the id and say where that run's folder would be. **Creates nothing.**
///
/// Pure, so a test can reach it without an `AppHandle`. The id check is the first
/// of the two boundaries this module draws - `runs::ensure_inside` is the second,
/// and neither is redundant: this one refuses a name that could climb out, that one
/// refuses a link that resolves out.
fn resolve_run_dir(local_data: &Path, run_id: &str) -> Result<PathBuf, String> {
    if run_id.is_empty()
        || !run_id
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-')
    {
        return Err("that is not a run id".into());
    }
    Ok(local_data.join("runs").join(run_id))
}

/// The app's own local data directory.
fn local_data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_local_data_dir()
        .map_err(|e| format!("no local data directory: {e}"))
}

/// Where this run's report and log are written, so an elevated second window and
/// this one can both find them. **Creates the folder** - for WRITE paths only.
pub fn run_dir(app: &AppHandle, run_id: &str) -> Result<PathBuf, String> {
    let base = resolve_run_dir(&local_data_dir(app)?, run_id)?;
    std::fs::create_dir_all(&base).map_err(|e| format!("could not create the run folder: {e}"))?;
    Ok(base)
}

/// 🔴 The same folder for a READ, and it creates nothing (TASK-016 item 3).
///
/// `run_dir` calls `create_dir_all`, and every read path used it: asking to read a
/// report for a run that never existed CREATED an empty folder for it and then
/// failed. So the window could litter `…\runs\` with empty directories by doing
/// nothing but look, and `list_run_files` answered "no files" for a run id it had
/// just brought into being rather than "there is no such run".
///
/// A read that changes the disk is the wrong shape whatever it returns. This is the
/// resolver every read takes.
pub fn existing_run_dir(app: &AppHandle, run_id: &str) -> Result<PathBuf, String> {
    require_existing(resolve_run_dir(&local_data_dir(app)?, run_id)?)
}

/// Refuse a folder that is not there - the read half of the split above.
fn require_existing(dir: PathBuf) -> Result<PathBuf, String> {
    if !dir.is_dir() {
        return Err("that run has no folder in this installation".into());
    }
    Ok(dir)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 🔴 A READ MUST NOT CREATE WHAT IT IS READING (TASK-016 item 3).
    ///
    /// `run_dir` calls `create_dir_all`, and both read commands used it - so asking
    /// to read a report for a run that never happened created an empty folder for
    /// it. The two halves are asserted against a real temporary directory, because
    /// "creates nothing" is a claim about the filesystem and nothing else can check
    /// it.
    #[test]
    fn a_read_resolves_the_run_folder_without_creating_it() {
        let base = std::env::temp_dir().join("windowsweep-test-noncreating");
        let _ = std::fs::remove_dir_all(&base);
        std::fs::create_dir_all(&base).expect("test fixture");

        let path = resolve_run_dir(&base, "run-never-happened").expect("a valid id resolves");
        assert!(
            !path.exists(),
            "resolving a run folder must not bring it into being"
        );
        assert!(
            require_existing(path.clone()).is_err(),
            "a read of a run that does not exist must be refused, not invented"
        );
        assert!(
            !path.exists(),
            "and the refusal itself must not have created it either"
        );

        // The control, so this cannot pass by refusing everything: a folder that IS
        // there resolves and is accepted.
        std::fs::create_dir_all(base.join("runs").join("run-1")).expect("test fixture");
        let real = resolve_run_dir(&base, "run-1").expect("a valid id resolves");
        assert!(
            require_existing(real).is_ok(),
            "an existing run must be read"
        );

        // And the id check still refuses a name that could climb out.
        for bad in ["", "..", "a/b", r"a\b", "c:run", "run 1"] {
            assert!(
                resolve_run_dir(&base, bad).is_err(),
                "{bad:?} is not a run id"
            );
        }

        let _ = std::fs::remove_dir_all(&base);
    }
}
