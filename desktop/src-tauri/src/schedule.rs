//! Whether the weekly Scheduled Task exists.
//!
//! The window can already ASK for the task - `--install-task` and
//! `--uninstall-task` are on the allowlist in `args.rs` and the engine registers
//! and removes it itself. What it could not do was find out whether the task is
//! there, and that is the whole of why the schedule switch stayed disabled: a
//! switch drawn from what this window last asked for sits at "on" over a task
//! somebody deleted in Task Scheduler, and a switch that asserts a state it cannot
//! read is the failure this app keeps refusing to ship.
//!
//! 🔴 THREE ANSWERS, NOT TWO. `installed`, `absent` and `unknown` - because the
//! honest answer to "is it there?" is sometimes "this window could not tell", and
//! collapsing that into `absent` would draw an Off switch over a task that runs
//! every Sunday. `UpdateOutcome` in the web store already makes the same
//! distinction for the same reason.
//!
//! 🔴 It asks `schtasks.exe`, which is the query the engine's own
//! `Get-ScheduledTask` wraps, rather than starting PowerShell again: this is read
//! at the top of two screens and a PowerShell start-up costs the better part of a
//! second. The binary is fixed and the task name is a constant in this file, so
//! nothing the webview sends takes any part in choosing what runs - the same
//! argument `run_clean` makes about its own fixed executable.
//!
//! ⚠️ THE LIMIT, STATED: the answer comes from the exit code. `schtasks /Query`
//! exits non-zero both when the task does not exist and when the query itself was
//! refused, and its messages are localised, so those two cannot be told apart from
//! out here. Non-zero is reported as `absent`, which is right for the ordinary
//! case: the task is registered for the current user, and querying your own task
//! needs no elevation. A spawn that fails outright, or a process that ends with no
//! code at all, is `unknown` rather than a guess.

use serde::Serialize;

/// The task the engine registers, verbatim from `$Script:WS_TASK_NAME`
/// (`modules/release_helpers.ps1:317`).
///
/// 🔴 A copy of a name, which is the one thing that can silently rot here: rename
/// it in the engine and this window would report `absent` over a task that exists,
/// with every gate green. It is a constant rather than an argument precisely so
/// there is one place to correct, and it is never taken from the caller.
const TASK_NAME: &str = "windowsweep weekly safe cleanup";

/// Do not flash a console window. The app is a GUI subsystem binary in release, so
/// spawning a console program creates a window for it; this query runs when a
/// screen opens, which would make a black rectangle blink on arrival.
#[cfg(windows)]
const CREATE_NO_WINDOW: u32 = 0x0800_0000;

/// What this window knows about the task.
#[derive(Debug, Serialize, Clone, Copy, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum TaskState {
    /// The query found it.
    Installed,
    /// The query ran and did not find it.
    Absent,
    /// The query could not be made, or gave no answer. NOT the same as `Absent`.
    Unknown,
}

/// The answer, as the window shows it.
///
/// 🔴 Field names cross IPC verbatim, as `DriveInfo` and `CancelOutcome` do, and
/// the serialisation test below pins them for the same reason: renaming one leaves
/// Rust green and the window rendering `undefined`.
#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct ScheduleStatus {
    pub state: TaskState,
    /// So the window can name the task a person would look for in Task Scheduler
    /// rather than describing it, and so the two can never disagree about it.
    pub task_name: String,
}

/// Turn what the process did into what the window may claim.
///
/// Split from the spawning so the decision can be tested as the decision it is;
/// `None` means the process produced no exit code at all.
fn classify(code: Option<i32>) -> TaskState {
    match code {
        Some(0) => TaskState::Installed,
        Some(_) => TaskState::Absent,
        None => TaskState::Unknown,
    }
}

/// Ask Windows whether the weekly task is registered.
///
/// Async and off the runtime: spawning a process and waiting on it blocks, and a
/// blocking call on an async runtime thread stalls every other command with it.
#[tauri::command]
pub async fn schedule_status() -> ScheduleStatus {
    let state = tauri::async_runtime::spawn_blocking(query)
        .await
        .unwrap_or(TaskState::Unknown);
    ScheduleStatus {
        state,
        task_name: TASK_NAME.to_string(),
    }
}

#[cfg(windows)]
fn query() -> TaskState {
    use std::os::windows::process::CommandExt;
    use std::process::{Command, Stdio};

    // `/FO LIST` rather than the default table: the default wraps to the console
    // width, and although nothing here reads the output, a query that cannot be
    // formatted is a query that can fail for a reason that has nothing to do with
    // whether the task exists.
    let outcome = Command::new("schtasks.exe")
        .args(["/Query", "/TN", TASK_NAME, "/FO", "LIST"])
        .creation_flags(CREATE_NO_WINDOW)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .stdin(Stdio::null())
        .status();

    match outcome {
        Ok(status) => classify(status.code()),
        // The binary is missing or could not be started. That is not evidence
        // about the task.
        Err(_) => TaskState::Unknown,
    }
}

/// Off Windows there is no Task Scheduler to ask, and saying so is the only honest
/// answer. This arm exists so `cargo test` and `clippy` run on any host; the app
/// itself is Windows-only.
#[cfg(not(windows))]
fn query() -> TaskState {
    TaskState::Unknown
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 🔴 The three answers, and the distinction the whole module exists for.
    ///
    /// The one that matters is the last: a process that produced no exit code must
    /// NOT read as `absent`, because `absent` is what draws an Off switch, and an
    /// Off switch over a live weekly task is the window telling a person nothing is
    /// scheduled while their disk is cleaned every Sunday.
    #[test]
    fn tells_absent_apart_from_could_not_tell() {
        assert_eq!(classify(Some(0)), TaskState::Installed);
        assert_eq!(classify(Some(1)), TaskState::Absent);
        assert_eq!(
            classify(None),
            TaskState::Unknown,
            "no exit code is not evidence that the task is missing"
        );
        // And the control, so this cannot pass by answering Unknown to everything.
        assert_ne!(classify(Some(0)), TaskState::Unknown);
    }

    /// The wire shape, pinned the way `DriveInfo`'s is - and the enum's spelling
    /// with it, because the web layer compares against these exact strings and a
    /// serde rename is invisible to every Rust gate.
    #[test]
    fn serialises_with_the_names_and_words_the_window_reads() {
        let json = serde_json::to_value(ScheduleStatus {
            state: TaskState::Installed,
            task_name: TASK_NAME.to_string(),
        })
        .expect("ScheduleStatus must serialise");
        let obj = json.as_object().expect("an object");

        for key in ["state", "task_name"] {
            assert!(obj.contains_key(key), "the web layer reads `{key}`");
        }
        assert_eq!(obj.len(), 2, "unexpected fields: {:?}", obj.keys());
        assert_eq!(obj["state"], "installed");
        assert_eq!(obj["task_name"], TASK_NAME);

        // All three words, because the window branches on each of them by name.
        for (state, word) in [
            (TaskState::Installed, "installed"),
            (TaskState::Absent, "absent"),
            (TaskState::Unknown, "unknown"),
        ] {
            assert_eq!(
                serde_json::to_value(state).expect("a state must serialise"),
                word
            );
        }
    }
}
