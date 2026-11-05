//! Push, never poll: tell the window when a run folder changes.
//!
//! An elevated run is a second process in its own console (`Start-Process -Verb
//! RunAs`), so nothing it prints reaches this window's `clean:log` stream; its log
//! and report land in the run's folder instead (`run-tail.ts` explains why). The
//! window used to re-read that folder every 700 ms to tail it. The no-polling law
//! (2026-11-03) retired that timer: the folder is watched here, and every create or
//! write sends one `run:files-changed` signal carrying the run id. The window
//! re-reads on the signal through the same confined commands (`list_run_files`,
//! `read_run_report`); the payload is never the data.
//!
//! 🔴 Why a watch sees every line: the engine appends each log line with
//! `[IO.File]::AppendAllText` (`lib/log.ps1`), which opens, appends and closes, so
//! the directory entry is updated - and a change notification raised - per line.
//! A writer that held its file open would only be seen on close.

use std::collections::HashMap;
use std::sync::Mutex;

use notify::{EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use tauri::{AppHandle, Emitter, State};

use crate::rundir::run_dir;

/// The event the window listens for. Its payload is the run id, nothing else.
pub const FILES_CHANGED: &str = "run:files-changed";

/// The live watches, one per run id. Dropping a watcher is what stops it.
#[derive(Default)]
pub struct RunWatches(Mutex<HashMap<String, RecommendedWatcher>>);

/// Whether a filesystem event is one the tail has to answer.
///
/// Kept apart from the watcher so it is plain to read: a file appearing or being
/// written matters; an access, a metadata touch or a removal does not.
fn is_change(kind: &EventKind) -> bool {
    matches!(kind, EventKind::Create(_) | EventKind::Modify(_))
}

/// Start watching a run's folder.
///
/// `run_dir`, not `existing_run_dir`: the tail starts before the engine is spawned
/// (an elevated child writes the moment UAC is answered), so the folder may not
/// exist yet. This is the run's own write path - the run is about to fill it -
/// and an empty folder a run never used is pruned at a later start (TASK-022).
/// Watching twice is harmless: the second watch replaces the first.
#[tauri::command]
pub fn watch_run_files(
    app: AppHandle,
    watches: State<'_, RunWatches>,
    run_id: String,
) -> Result<(), String> {
    let dir = run_dir(&app, &run_id)?;
    let emitter = app.clone();
    let id = run_id.clone();
    let mut watcher = notify::recommended_watcher(move |res: notify::Result<notify::Event>| {
        let Ok(event) = res else { return };
        if is_change(&event.kind) {
            // Nothing to do when no window listens: the next listener re-reads anyway.
            let _ = emitter.emit(FILES_CHANGED, &id);
        }
    })
    .map_err(|e| format!("the run folder could not be watched: {e}"))?;
    watcher
        .watch(&dir, RecursiveMode::NonRecursive)
        .map_err(|e| format!("the run folder could not be watched: {e}"))?;
    let mut live = watches
        .0
        .lock()
        .map_err(|_| "the run watch list is unavailable".to_string())?;
    live.insert(run_id, watcher);
    Ok(())
}

/// Stop watching a run's folder. Unknown ids are not an error: the tail calls this
/// once on its way out whatever happened before.
#[tauri::command]
pub fn unwatch_run_files(watches: State<'_, RunWatches>, run_id: String) -> Result<(), String> {
    let mut live = watches
        .0
        .lock()
        .map_err(|_| "the run watch list is unavailable".to_string())?;
    live.remove(&run_id);
    Ok(())
}
