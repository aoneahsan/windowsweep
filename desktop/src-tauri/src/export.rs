//! Exporting a run's report to Markdown and HTML.
//!
//! The window converts nothing. `modules/reports.ps1` already turns a report JSON
//! into both formats - `Convert-ReportToMarkdown` and `Convert-ReportToHtml`, the
//! same two the command-line tool's `--export` calls - so this command runs that
//! and reveals what it wrote. A second implementation here would be a second answer
//! to a question the engine has already answered, and the Report screen's whole
//! claim is that a report opened in this window and the same report opened in a
//! text editor cannot disagree.
//!
//! 🔴 IT DELIBERATELY DOES NOT GO THROUGH `run_clean`, AND `ALLOWED_FLAGS` IN
//! `args.rs` IS NOT WIDENED. `run_clean` passes a webview-supplied argument vector,
//! so everything it can reach has to be on that allowlist; letting `--export`
//! through would let the webview aim an export at any `--reports-dir` it liked.
//! Here the vector is FIXED - the caller supplies a run id and nothing else, and
//! the id is the one `rundir::existing_run_dir` already constrains - so there is no
//! argument to allow and nothing to check against a list.
//!
//! 🔴 AND IT NEEDS NO NEW CAPABILITY PERMISSION, WHICH IS THE NARROWER ANSWER.
//! `tauri_plugin_opener::reveal_item_in_dir` is a plain Rust function; the plugin's
//! `opener:allow-reveal-item-in-dir` permission exists to expose the plugin's own
//! IPC command to the webview. That command takes NO scope at all, unlike `open_url`
//! and `open_path` beside it: `commands.rs` declares it as
//! `reveal_item_in_dir(paths: Vec<PathBuf>)` with no `CommandScope` parameter, and
//! the generated permission's own description is "without any pre-configured scope".
//! Granting it would therefore hand the webview an unscoped reveal of any path on the
//! disk, however the capability file were written. Calling the function from here
//! instead means the only path that can ever be revealed is one this file computed
//! inside a run folder.

use std::ffi::OsStr;
use std::path::{Path, PathBuf};
use std::process::Command;

use tauri::AppHandle;

use crate::engine::script_path;
use crate::rundir::existing_run_dir;
use crate::runs::ensure_inside;

/// The formats. `both` is the engine's own word for md + html in one pass.
const EXPORT_FORMAT: &str = "both";
/// Which report in the folder. A run folder holds one, and `latest` is how the
/// engine names it - there is no flag that takes a file name.
const EXPORT_WHICH: &str = "latest";

/// The fixed argument vector, built where a test can read it.
///
/// Every element is a constant or a path this process resolved. Nothing the webview
/// sent appears here: the run id reached `existing_run_dir` and became `dir`, and
/// the engine's own path is resolved from the bundle.
fn export_args(script: &Path, dir: &Path) -> Vec<String> {
    vec![
        "-NoProfile".into(),
        "-NoLogo".into(),
        "-ExecutionPolicy".into(),
        "Bypass".into(),
        "-File".into(),
        script.to_string_lossy().into_owned(),
        "--export".into(),
        EXPORT_FORMAT.into(),
        EXPORT_WHICH.into(),
        "--reports-dir".into(),
        dir.to_string_lossy().into_owned(),
        "--no-color".into(),
    ]
}

/// Which report `--export ... latest` will pick, decided the way the engine decides.
///
/// 🔴 MIRRORED FROM `Get-ReportFiles`, NOT GUESSED: it globs `report-*.json` in the
/// reports directory and sorts by NAME DESCENDING, and `latest` takes the first of
/// that list (`modules/reports.ps1:3-7, :144`). The names are timestamped, so the
/// greatest name is the newest file. A run folder normally holds exactly one, which
/// makes the ordering moot in practice and correct when it is not.
///
/// The entry comes from the directory listing rather than from the caller, and it is
/// still resolved and contained: a junction called `report-1.json` planted in the
/// folder points somewhere else entirely.
fn latest_report(dir: &Path) -> Result<PathBuf, String> {
    let entries =
        std::fs::read_dir(dir).map_err(|e| format!("the run folder could not be read: {e}"))?;
    let mut best: Option<(String, PathBuf)> = None;
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().into_owned();
        let lower = name.to_ascii_lowercase();
        if !(lower.starts_with("report-") && lower.ends_with(".json")) {
            continue;
        }
        match entry.file_type() {
            Ok(t) if t.is_file() => {}
            _ => continue,
        }
        let path = entry.path();
        if ensure_inside(dir, &path).is_err() {
            continue;
        }
        // `map_or(true, ..)` rather than `is_none_or`, which is stable only from
        // 1.82 and this crate's MSRV is 1.77.
        if best.as_ref().map_or(true, |(seen, _)| lower > *seen) {
            best = Some((lower, path));
        }
    }
    best.map(|(_, path)| path)
        .ok_or_else(|| String::from("this run wrote no report file, so there is nothing to export"))
}

/// What the engine will have written, derived from the report's own path.
///
/// 🔴 DERIVED, NOT PARSED OFF STDOUT. The engine announces each file as
/// `+ wrote <path>`, and reading that back would make this command depend on the
/// wording of a log line. The rule it actually follows is exact and structural:
/// both converters default their output to
/// `[IO.Path]::ChangeExtension($Json, '.md' / '.html')` (`modules/reports.ps1:40, :72`),
/// so the two files are the report's own path with the extension changed.
///
/// The derivation is a prediction, so the caller checks it against the disk before
/// returning it - see `export_run_reports`. A path that is not there is reported as
/// a failure rather than handed back as a fact.
fn written_paths(report: &Path) -> Vec<PathBuf> {
    vec![report.with_extension("md"), report.with_extension("html")]
}

/// Export this run's report to Markdown and HTML, and show the person where they went.
///
/// Returns both paths, in the order they were written. The caller names a run; it
/// never names a path, a format or a folder.
#[tauri::command]
pub async fn export_run_reports(app: AppHandle, run_id: String) -> Result<Vec<String>, String> {
    let dir = existing_run_dir(&app, &run_id)?;
    let script = script_path(&app)?;
    let report = latest_report(&dir)?;
    let args = export_args(&script, &dir);

    // The conversion is short - one JSON into two text files - but it is still a
    // process and a handful of disk writes, so it goes to the blocking pool rather
    // than holding an async runtime thread, the same reasoning `run_clean` records.
    let output = tauri::async_runtime::spawn_blocking(move || {
        Command::new("powershell.exe")
            .args(&args)
            .env("WINDOWSWEEP_LAUNCHER", "desktop")
            .output()
    })
    .await
    .map_err(|e| format!("the export could not be run: {e}"))?
    .map_err(|e| format!("the export did not start: {e}"))?;

    let written = written_paths(&report);

    // 🔴 The exit code is checked AND the files are. `Export-Reports` returns a
    // usage or failure code for the cases it knows about, but `Convert-ReportToMarkdown`
    // returns null after writing nothing when it cannot read the JSON, and the exit
    // code does not carry that - so a green exit with no file beside the report is a
    // failure this command has to see for itself.
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let tail = stderr.trim().lines().next_back().unwrap_or("").trim();
        return Err(format!(
            "the engine could not export this report (exit {}){}{}",
            output.status.code().unwrap_or(-1),
            if tail.is_empty() { "" } else { ": " },
            tail
        ));
    }
    if let Some(missing) = written.iter().find(|p| !p.is_file()) {
        return Err(format!(
            "the engine reported success but {} is not there, so nothing was exported",
            missing
                .file_name()
                .unwrap_or_else(|| OsStr::new("the export"))
                .to_string_lossy()
        ));
    }

    // Opening Explorer is the result being SHOWN rather than described. Its failure
    // is deliberately not this command's failure: the two files exist either way,
    // and reporting a written export as a failed one because a shell window did not
    // appear would be the window telling the person something untrue about their own
    // disk. There is no logger on this side to record it in.
    let _ = tauri_plugin_opener::reveal_item_in_dir(&written[0]);

    Ok(written
        .iter()
        .map(|p| p.to_string_lossy().into_owned())
        .collect())
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 🔴 The argument vector, asserted whole.
    ///
    /// This is the test that matters most here, because the vector is the entire
    /// security story: the command is safe precisely because nothing in it is
    /// chosen by the caller. An edit that appended a caller-supplied value would be
    /// caught here and nowhere else - `validate` in `args.rs` never sees this path,
    /// deliberately.
    #[test]
    fn builds_the_exact_argument_vector_and_nothing_else() {
        let args = export_args(
            Path::new(r"C:\Program Files\windowsweep\windowsweep\windowsweep.ps1"),
            Path::new(r"C:\Users\PC\AppData\Local\windowsweep\runs\run-7"),
        );
        assert_eq!(
            args,
            vec![
                "-NoProfile",
                "-NoLogo",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                r"C:\Program Files\windowsweep\windowsweep\windowsweep.ps1",
                "--export",
                "both",
                "latest",
                "--reports-dir",
                r"C:\Users\PC\AppData\Local\windowsweep\runs\run-7",
                "--no-color",
            ]
        );
        // The engine's own flags and nothing that could aim it elsewhere. `--json`
        // is absent on purpose: an export writes no summary line, so asking for the
        // machine contract here would be asking for something that never arrives.
        assert!(!args.iter().any(|a| a == "--json"));
        assert!(!args.iter().any(|a| a == "--all" || a == "--yes"));
    }

    /// The written paths are the report's own path with the extension changed -
    /// which is what both converters default to. Asserted against a name carrying
    /// dots of its own, because `with_extension` replaces the LAST one and a report
    /// named `report-2026-09-17T10.04.11.json` is the ordinary case here.
    #[test]
    fn derives_the_written_paths_from_the_report_stem() {
        let report = Path::new(r"C:\runs\run-7\report-2026-09-17T10.04.11.json");
        let written = written_paths(report);
        assert_eq!(
            written[0],
            PathBuf::from(r"C:\runs\run-7\report-2026-09-17T10.04.11.md")
        );
        assert_eq!(
            written[1],
            PathBuf::from(r"C:\runs\run-7\report-2026-09-17T10.04.11.html")
        );
        // Both beside the report, never anywhere else.
        for path in &written {
            assert_eq!(path.parent(), report.parent());
        }
    }

    /// 🔴 Picking the report the way the engine picks it, and refusing when there is
    /// none. The ordering is `Get-ReportFiles`' - name descending - so the assertion
    /// is that the NEWEST timestamped name wins, not the newest mtime: those agree
    /// here and the engine only reads the name.
    #[test]
    fn picks_the_latest_report_and_refuses_a_folder_without_one() {
        let dir = std::env::temp_dir().join("windowsweep-test-export-pick");
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).expect("test fixture");

        // Nothing to export yet - and that is a refusal, not an empty success.
        assert!(
            latest_report(&dir).is_err(),
            "a run that wrote no report has nothing to export"
        );

        // Written oldest-last, so a test that passed by taking the first entry or
        // the newest mtime would have to disagree with the name ordering.
        for name in [
            "report-2026-09-17T09.00.00.json",
            "report-2026-09-17T11.30.00.json",
            "report-2026-09-17T10.15.00.json",
        ] {
            std::fs::write(dir.join(name), "{}").expect("test fixture");
        }
        // Not a report, and not an export target.
        std::fs::write(dir.join("select.txt"), "x").expect("test fixture");
        std::fs::write(dir.join("windowsweep.log"), "x").expect("test fixture");

        let picked = latest_report(&dir).expect("three reports must pick one");
        assert_eq!(
            picked.file_name().map(|n| n.to_string_lossy().into_owned()),
            Some("report-2026-09-17T11.30.00.json".to_string()),
            "the engine's `latest` is the greatest name, and so is this"
        );

        let _ = std::fs::remove_dir_all(&dir);
    }
}
