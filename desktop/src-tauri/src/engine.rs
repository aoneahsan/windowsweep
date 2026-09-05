//! Launching the cleanup engine.
//!
//! The app reimplements nothing: it runs the bundled `windowsweep.ps1` and reads
//! what the engine reports. `--json` puts exactly one summary line on stdout and
//! everything else on stderr, so the two streams separate cleanly - the machine
//! contract on one, the human log and the `##windowsweep` progress lines on the
//! other.
//!
//! There is no shell plugin in this app's capability set. The executable is fixed,
//! the script path is resolved from the bundle, and every argument the webview
//! sends is checked against the allowlist below before it reaches a process. A
//! front end cannot aim this at another program, and cannot pass a flag the engine
//! never documented.

use std::io::{BufRead, BufReader};
use std::path::PathBuf;
use std::process::{Command, Stdio};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager};

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
];

/// Flags that take exactly one value.
const ALLOWED_VALUE_FLAGS: &[&str] = &[
    "--only",
    "--profile",
    "--exclude",
    "--days",
    "--temp-days",
    "--large-file-mb",
    "--hiberfil",
    "--scan-roots",
    "--exclude-path",
    "--select",
    "--select-file",
];

#[derive(Debug, Deserialize)]
pub struct RunRequest {
    /// A caller-supplied id, used for the per-run report folder and for the events.
    pub run_id: String,
    pub args: Vec<String>,
}

#[derive(Debug, Serialize, Clone)]
pub struct RunFinished {
    pub run_id: String,
    pub exit_code: i32,
    pub stdout: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct LogLine {
    pub run_id: String,
    pub line: String,
}

fn validate(args: &[String]) -> Result<(), String> {
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

/// The bundled engine, resolved from the app's own resources.
fn script_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .resolve("windowsweep", tauri::path::BaseDirectory::Resource)
        .map_err(|e| format!("the bundled engine could not be located: {e}"))?;
    let script = dir.join("windowsweep.ps1");
    if !script.exists() {
        return Err("the bundled engine is missing from this installation".into());
    }
    Ok(script)
}

/// Where this run's report and log are written, so an elevated second window and
/// this one can both find them.
pub fn run_dir(app: &AppHandle, run_id: &str) -> Result<PathBuf, String> {
    if run_id.is_empty()
        || !run_id
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-')
    {
        return Err("that is not a run id".into());
    }
    let base = app
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("no local data directory: {e}"))?
        .join("runs")
        .join(run_id);
    std::fs::create_dir_all(&base).map_err(|e| format!("could not create the run folder: {e}"))?;
    Ok(base)
}

/// Run the engine, streaming its stderr to the window as it arrives.
///
/// The elevated case is NOT special-cased here: `--elevate` is the engine's own
/// flag, and it is the engine that opens the second window and shows the UAC
/// prompt. This process never requests elevation for itself. The screen that
/// offers an admin section says exactly that, and this is what makes it true.
#[tauri::command]
pub async fn run_clean(app: AppHandle, request: RunRequest) -> Result<RunFinished, String> {
    validate(&request.args)?;
    let script = script_path(&app)?;
    let dir = run_dir(&app, &request.run_id)?;
    let dir_text = dir.to_string_lossy().into_owned();

    let mut args: Vec<String> = vec![
        "-NoProfile".into(),
        "-NoLogo".into(),
        "-ExecutionPolicy".into(),
        "Bypass".into(),
        "-File".into(),
        script.to_string_lossy().into_owned(),
        "--json".into(),
        "--no-color".into(),
        "--reports-dir".into(),
        dir_text.clone(),
        "--logs-dir".into(),
        dir_text,
    ];
    for a in &request.args {
        // --json and --no-color are already present. Passing either twice is
        // harmless but noisy in the log, so they are skipped rather than repeated.
        if a != "--json" && a != "--no-color" {
            args.push(a.clone());
        }
    }

    let mut child = Command::new("powershell.exe")
        .args(&args)
        .env("WINDOWSWEEP_LAUNCHER", "desktop")
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .stdin(Stdio::null())
        .spawn()
        .map_err(|e| format!("the cleanup engine did not start: {e}"))?;

    let stderr = child
        .stderr
        .take()
        .ok_or_else(|| String::from("no error stream from the engine"))?;
    let run_id = request.run_id.clone();
    let handle = app.clone();
    let pump = std::thread::spawn(move || {
        for line in BufReader::new(stderr).lines().map_while(Result::ok) {
            // A progress line is machine-readable and goes on its own channel; the
            // rest is the human log the window tails.
            let channel = if line.starts_with("##windowsweep ") {
                "clean:progress"
            } else {
                "clean:log"
            };
            let _ = handle.emit(
                channel,
                LogLine {
                    run_id: run_id.clone(),
                    line,
                },
            );
        }
    });

    let output = child
        .wait_with_output()
        .map_err(|e| format!("the engine stopped unexpectedly: {e}"))?;
    let _ = pump.join();

    let finished = RunFinished {
        run_id: request.run_id,
        exit_code: output.status.code().unwrap_or(-1),
        stdout: String::from_utf8_lossy(&output.stdout).into_owned(),
    };
    let _ = app.emit("clean:done", finished.clone());
    Ok(finished)
}

/// Read a report one of this app's own runs wrote. Confined to the run folder, so
/// the webview cannot ask for an arbitrary file by naming one.
#[tauri::command]
pub fn read_run_report(
    app: AppHandle,
    run_id: String,
    file_name: String,
) -> Result<String, String> {
    let bad = file_name.contains("..")
        || file_name.contains('/')
        || file_name.contains('\\')
        || file_name.contains(':');
    if bad {
        return Err("that is not a file name inside the run folder".into());
    }
    let path = run_dir(&app, &run_id)?.join(file_name);
    std::fs::read_to_string(&path).map_err(|e| format!("the report could not be read: {e}"))
}

#[tauri::command]
pub fn app_version(app: AppHandle) -> String {
    app.package_info().version.to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

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
}
