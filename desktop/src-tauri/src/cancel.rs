//! Stopping a run that is already going.
//!
//! `run_clean` spawns PowerShell and then blocks until it exits, so by the time
//! the window wants to stop it there is no handle left in reach. This module is
//! that handle: every run registers itself here while it runs and removes itself
//! when it finishes, and `cancel_run` is how a second command reaches into the
//! first one's process.
//!
//! 🔴 An elevated run cannot be cancelled, and this says so instead of pretending.
//! `--elevate` makes the engine hand the work to a NEW elevated window and exit -
//! `windowsweep.ps1:291-295` - so the process this app can reach is the parent
//! that already went away, and killing it stops nothing. The elevated child is a
//! different session at a higher integrity level that a medium-integrity process
//! is not permitted to terminate. A Cancel button that silently did nothing there
//! would be the worst version of this: the run continues, the window says it
//! stopped, and files keep being deleted behind a screen that claims otherwise.
//! So the outcome carries the reason and the window states it.

use std::collections::{HashMap, HashSet};
use std::process::Child;
use std::sync::{Arc, Mutex};

use serde::Serialize;
use tauri::State;

/// What the registry holds for a live run.
struct Tracked<P> {
    handle: P,
    /// Recorded when the run starts, from the arguments the caller sent, because
    /// after the parent exits there is nothing left to infer it from.
    elevated: bool,
}

#[derive(Default)]
struct Inner<P> {
    running: HashMap<String, Tracked<P>>,
    /// Runs asked to stop. Separate from `running` because the answer is needed
    /// AFTER the entry has been removed: the waiting side has to tell "the process
    /// ended because we killed it" from "the process ended having produced
    /// nothing", and those two need opposite handling.
    cancelled: HashSet<String>,
}

/// The live-run map, generic in the handle purely so the bookkeeping can be tested
/// without spawning processes.
///
/// The bookkeeping is the part that goes wrong - an entry that outlives its run
/// makes a finished run look cancellable, and one removed too early makes a live
/// run uncancellable - and neither has anything to do with what a process is. The
/// app uses exactly one instantiation, `RunRegistry`, so this costs nothing at
/// runtime.
pub struct Registry<P> {
    inner: Mutex<Inner<P>>,
}

impl<P> Default for Registry<P> {
    fn default() -> Self {
        Self {
            inner: Mutex::new(Inner {
                running: HashMap::new(),
                cancelled: HashSet::new(),
            }),
        }
    }
}

impl<P> Registry<P> {
    /// 🔴 Every method takes the lock and drops it before returning. Nothing here
    /// is held across an `.await`, which is what makes a `std` mutex correct in a
    /// module two async commands both touch - a `std` guard held across an await
    /// point deadlocks, and the compiler does not always say so.
    fn lock(&self) -> Result<std::sync::MutexGuard<'_, Inner<P>>, String> {
        self.inner
            .lock()
            .map_err(|_| String::from("the run registry is in a bad state"))
    }

    /// Record a run as live. A re-used id replaces the old entry, which is the
    /// right answer: two live runs cannot share an id, so the newer one owns it.
    pub fn track(&self, run_id: &str, handle: P, elevated: bool) -> Result<(), String> {
        let mut inner = self.lock()?;
        inner.cancelled.remove(run_id);
        inner
            .running
            .insert(run_id.to_string(), Tracked { handle, elevated });
        Ok(())
    }

    /// Remove a finished run and report whether it was cancelled on the way out.
    pub fn finish(&self, run_id: &str) -> Result<bool, String> {
        let mut inner = self.lock()?;
        inner.running.remove(run_id);
        Ok(inner.cancelled.remove(run_id))
    }

    /// Whether a run is live, and whether it is elevated. `None` means not running.
    pub fn lookup(&self, run_id: &str) -> Result<Option<bool>, String> {
        let inner = self.lock()?;
        Ok(inner.running.get(run_id).map(|t| t.elevated))
    }

    /// Mark a run cancelled and hand back a clone of its handle to act on.
    ///
    /// The entry stays in `running`: the process is still alive at this instant and
    /// only the waiting side may retire it, or a slow-dying process would look
    /// finished while it was still deleting.
    fn mark_and_clone(&self, run_id: &str) -> Result<Option<P>, String>
    where
        P: Clone,
    {
        let mut inner = self.lock()?;
        let Some(tracked) = inner.running.get(run_id) else {
            return Ok(None);
        };
        let handle = tracked.handle.clone();
        inner.cancelled.insert(run_id.to_string());
        Ok(Some(handle))
    }

    #[cfg(test)]
    fn live_count(&self) -> usize {
        self.inner.lock().expect("test lock").running.len()
    }

    #[cfg(test)]
    fn is_marked(&self, run_id: &str) -> bool {
        self.inner
            .lock()
            .expect("test lock")
            .cancelled
            .contains(run_id)
    }
}

/// The child of a live run, shared between the thread waiting on it and whichever
/// command is asked to kill it.
pub type ChildHandle = Arc<Mutex<Child>>;

/// The instantiation the app manages.
pub type RunRegistry = Registry<ChildHandle>;

/// What Cancel did, in terms the window can put on screen without guessing.
#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct CancelOutcome {
    pub run_id: String,
    /// True only when a process was actually signalled.
    pub cancelled: bool,
    /// True when this run handed itself to an elevated window, which is the case
    /// this app cannot stop.
    pub elevated: bool,
    /// A sentence for the window to show. Written here rather than in the web
    /// layer so the reason and the fact cannot drift apart.
    pub reason: String,
}

/// Reasons, kept together so the wording is one decision rather than three.
fn outcome(run_id: &str, cancelled: bool, elevated: bool, reason: &str) -> CancelOutcome {
    CancelOutcome {
        run_id: run_id.to_string(),
        cancelled,
        elevated,
        reason: reason.to_string(),
    }
}

/// Decide what Cancel means for a run in a given state.
///
/// Split from the killing so the three answers can be tested as the decision they
/// are. `None` for the state means the registry has no such run.
fn decide(run_id: &str, state: Option<bool>) -> Option<CancelOutcome> {
    match state {
        None => Some(outcome(
            run_id,
            false,
            false,
            "That run is not going any more, so there was nothing to stop.",
        )),
        Some(true) => Some(outcome(
            run_id,
            false,
            true,
            "This run is being carried out by a separate administrator window, which \
             windowsweep cannot stop from here. Close that window to end it.",
        )),
        // Live and ordinary: the caller does the killing, so no outcome yet.
        Some(false) => None,
    }
}

/// Stop a run this window started.
#[tauri::command]
pub fn cancel_run(
    registry: State<'_, RunRegistry>,
    run_id: String,
) -> Result<CancelOutcome, String> {
    if let Some(answer) = decide(&run_id, registry.lookup(&run_id)?) {
        return Ok(answer);
    }

    let Some(handle) = registry.mark_and_clone(&run_id)? else {
        // It finished between the lookup and here. Not an error - the person asked
        // for it to stop and it is stopped.
        return Ok(outcome(
            &run_id,
            false,
            false,
            "That run finished on its own just as it was asked to stop.",
        ));
    };

    let mut child = handle
        .lock()
        .map_err(|_| String::from("the run's process is in a bad state"))?;
    match child.kill() {
        Ok(()) => Ok(outcome(
            &run_id,
            true,
            false,
            "The run was stopped. Anything already deleted stays deleted.",
        )),
        // `kill` fails when the process has already gone, which is the same
        // user-visible outcome by a different route.
        Err(e) if e.kind() == std::io::ErrorKind::InvalidInput => Ok(outcome(
            &run_id,
            false,
            false,
            "That run had already finished.",
        )),
        Err(e) => Err(format!("the run could not be stopped: {e}")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 🔴 Insert, look up, remove - and the cancelled flag surviving exactly one
    /// removal.
    ///
    /// The handle is a plain number here. Nothing this test covers is about
    /// processes: it is about an entry existing for precisely as long as its run,
    /// and about `finish` being the one place that answers "was this killed or did
    /// it just end", which the waiting side reads to decide whether an empty
    /// stdout is a failure or a cancellation.
    #[test]
    fn tracks_a_run_for_exactly_as_long_as_it_runs() {
        let reg: Registry<u32> = Registry::default();

        // Nothing is running.
        assert_eq!(reg.lookup("run-1").unwrap(), None);
        assert_eq!(reg.live_count(), 0);

        // Insert, then look up.
        reg.track("run-1", 111, false).unwrap();
        reg.track("run-2", 222, true).unwrap();
        assert_eq!(reg.lookup("run-1").unwrap(), Some(false));
        assert_eq!(
            reg.lookup("run-2").unwrap(),
            Some(true),
            "elevation is remembered"
        );
        assert_eq!(
            reg.lookup("run-3").unwrap(),
            None,
            "an unknown id is not running"
        );
        assert_eq!(reg.live_count(), 2);

        // Cancelling marks without removing - the process is still dying.
        assert_eq!(reg.mark_and_clone("run-1").unwrap(), Some(111));
        assert!(reg.is_marked("run-1"));
        assert_eq!(
            reg.live_count(),
            2,
            "a cancelled run is still live until it exits"
        );
        assert_eq!(reg.lookup("run-1").unwrap(), Some(false));

        // Finishing removes it AND reports the cancellation, once.
        assert!(
            reg.finish("run-1").unwrap(),
            "finish reports it was cancelled"
        );
        assert_eq!(reg.lookup("run-1").unwrap(), None, "removed");
        assert_eq!(reg.live_count(), 1);
        assert!(
            !reg.finish("run-1").unwrap(),
            "the cancellation is consumed, so a re-used id does not inherit it"
        );

        // A run that ends on its own reports false, which is what keeps the
        // no-summary guard in engine.rs firing for real failures.
        assert!(!reg.finish("run-2").unwrap());
        assert_eq!(reg.live_count(), 0);

        // Marking something that is not running yields nothing to kill.
        assert_eq!(reg.mark_and_clone("run-2").unwrap(), None);

        // And a re-used id starts clean rather than inheriting the old mark.
        reg.track("run-9", 1, false).unwrap();
        reg.mark_and_clone("run-9").unwrap();
        reg.track("run-9", 2, false).unwrap();
        assert!(!reg.is_marked("run-9"), "re-tracking clears a stale mark");
        assert!(!reg.finish("run-9").unwrap());
    }

    /// 🔴 The elevated answer, which is the one that must never be silent.
    #[test]
    fn declares_that_an_elevated_run_cannot_be_stopped() {
        // Elevated: refused, and the reason says why and what to do instead.
        let elevated = decide("run-e", Some(true)).expect("elevated is decided without killing");
        assert!(!elevated.cancelled, "nothing was signalled");
        assert!(elevated.elevated, "the window must be able to say why");
        assert!(
            elevated.reason.contains("administrator window"),
            "the reason must name the thing the person has to close: {}",
            elevated.reason
        );

        // Not running: also decided here, also not a kill, and NOT elevated - a
        // window that showed the elevation sentence for an ordinary finished run
        // would be telling the person to close a window that does not exist.
        let gone = decide("run-x", None).expect("an unknown run is decided");
        assert!(!gone.cancelled);
        assert!(!gone.elevated);

        // Live and ordinary: no answer here, because the caller must do the work.
        // This is the assertion that stops `decide` degenerating into "always
        // refuse", which would pass every other line in this test.
        assert!(
            decide("run-o", Some(false)).is_none(),
            "an ordinary live run must fall through to the kill"
        );
    }

    /// The outcome crosses IPC, so its field names are pinned the same way
    /// `DriveInfo`'s are.
    #[test]
    fn cancel_outcome_serialises_with_the_names_the_window_reads() {
        let json = serde_json::to_value(outcome("run-1", true, false, "stopped"))
            .expect("CancelOutcome must serialise");
        let obj = json.as_object().expect("an object");
        for key in ["run_id", "cancelled", "elevated", "reason"] {
            assert!(obj.contains_key(key), "the web layer reads `{key}`");
        }
        assert_eq!(obj.len(), 4);
        assert_eq!(obj["cancelled"], true);
        assert_eq!(obj["elevated"], false);
    }
}
