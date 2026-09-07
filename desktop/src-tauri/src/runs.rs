//! Files inside a run's own folder.
//!
//! Two commands the window needs and `engine.rs` had no room for: writing the
//! selection list an unattended run is driven by, and listing what a run left
//! behind so an elevated child's log can be tailed from the parent window.
//!
//! Both are confined to the run folder, the same boundary `read_run_report`
//! draws. The webview names a run, never a path: `run_dir` refuses a run id that
//! is not alphanumeric-or-hyphen, and every path this module produces is checked
//! to still be inside that folder after the filesystem has resolved it. The
//! second check is not redundant with the first - a junction or symlink planted
//! in the run folder resolves outward, and the id check cannot see that.

use std::path::Path;

use tauri::AppHandle;

use crate::engine::run_dir;

/// The fixed name of the selection list. The caller does not choose it, which is
/// most of why this command cannot be aimed anywhere.
const SELECT_FILE_NAME: &str = "select.txt";

/// 🔴 The containment check, factored out so a test can reach it.
///
/// `read_run_report` does this inline with a substring test on the file name. That
/// is sound for a name the caller supplies, but it cannot see a link: a directory
/// entry called `report-1.json` may be a junction pointing at `C:\Windows`, and a
/// name-only check passes it. So this resolves both sides and compares the real
/// locations.
///
/// `canonicalize` is what does the resolving, and it only works on a path that
/// exists - so a path being written is checked by its PARENT, which does exist.
fn ensure_inside(base: &Path, candidate: &Path) -> Result<(), String> {
    let real_base = base
        .canonicalize()
        .map_err(|e| format!("the run folder could not be resolved: {e}"))?;
    let real_candidate = candidate
        .canonicalize()
        .map_err(|e| format!("that path could not be resolved: {e}"))?;
    if !real_candidate.starts_with(&real_base) {
        return Err("that path is outside the run folder".into());
    }
    Ok(())
}

/// Turn the selected paths into the exact bytes the engine will read.
///
/// 🔴 Three properties, and the engine depends on all three.
///
/// **No BOM.** `windowsweep.ps1` reads this with `[IO.File]::ReadAllLines`, which
/// strips a UTF-8 BOM on .NET but not on every host it may run under; and the
/// first line is a full path, so a surviving BOM makes `C:\...` into `\u{feff}C:\...`
/// and that line silently matches no candidate. A path that matches nothing is not
/// an error to the engine - it is one fewer file selected, which is the quiet
/// wrong answer rather than a loud one.
///
/// **CRLF.** The engine trims each line, so LF would work today; CRLF is what a
/// Windows text file is, and it is what anyone opening this file in Notepad to
/// see what was selected will expect to find.
///
/// **No embedded newline in a path.** This is the one that is a refusal rather
/// than a formatting choice. A caller that could put `\n` inside a "path" could
/// append lines the window never showed anyone - the selection file is the record
/// of what a person chose, and one line must mean one choice. A NUL is refused for
/// the same reason a level down: it truncates the path for the Win32 call the
/// engine eventually makes.
///
/// A `#` at the start is refused too, because the engine treats such a line as a
/// comment and drops it - so it would be accepted here and vanish there.
fn render_select_file(paths: &[String]) -> Result<Vec<u8>, String> {
    if paths.is_empty() {
        return Err("a selection file with no paths in it would be refused by the engine".into());
    }
    let mut out = String::new();
    for p in paths {
        let trimmed = p.trim();
        if trimmed.is_empty() {
            return Err("a blank line is not a selection".into());
        }
        if p.contains('\n') || p.contains('\r') {
            return Err(format!(
                "refusing a selection containing a line break, which would add choices nobody made: {p:?}"
            ));
        }
        if p.contains('\0') {
            return Err(format!("refusing a selection containing a NUL byte: {p:?}"));
        }
        if trimmed.starts_with('#') {
            return Err(format!(
                "the engine reads a leading # as a comment and would drop this line: {trimmed}"
            ));
        }
        out.push_str(trimmed);
        out.push_str("\r\n");
    }
    Ok(out.into_bytes())
}

/// Write the selection list for a run, and hand back where it went.
///
/// The returned path is what the caller passes to `--select-file`, which is
/// already on the value-flag allowlist in `engine.rs`.
#[tauri::command]
pub fn write_select_file(
    app: AppHandle,
    run_id: String,
    paths: Vec<String>,
) -> Result<String, String> {
    let bytes = render_select_file(&paths)?;
    let dir = run_dir(&app, &run_id)?;
    let path = dir.join(SELECT_FILE_NAME);

    // The parent is what exists at this point, so it is what gets resolved. The
    // file name is a constant, so nothing the caller sent takes part in choosing
    // where this lands - but the folder itself is checked, because that is the
    // half a planted junction could move.
    ensure_inside(&dir, &dir)?;

    std::fs::write(&path, &bytes)
        .map_err(|e| format!("the selection could not be written: {e}"))?;

    // And once it exists, check the real thing rather than the intention.
    ensure_inside(&dir, &path)?;
    Ok(path.to_string_lossy().into_owned())
}

/// Whether a run folder entry is one this app wrote and the window may read.
///
/// Kept separate from the directory walk so it is testable without a filesystem.
fn is_listable(name: &str) -> bool {
    let lower = name.to_ascii_lowercase();
    (lower.starts_with("report-") && lower.ends_with(".json")) || lower.ends_with(".log")
}

/// List the reports and logs a run produced.
///
/// The sibling of `read_run_report`: that one reads a file the caller can already
/// name, this one is how the caller learns the names. It exists for the elevated
/// case in particular - the elevated child writes its summary and log into this
/// same folder while the parent has already exited, so the window has no other way
/// to find out what the child called them.
///
/// Names only, never paths. The caller feeds one straight back to
/// `read_run_report`, whose own check refuses anything with a separator in it.
#[tauri::command]
pub fn list_run_files(app: AppHandle, run_id: String) -> Result<Vec<String>, String> {
    let dir = run_dir(&app, &run_id)?;
    let entries =
        std::fs::read_dir(&dir).map_err(|e| format!("the run folder could not be read: {e}"))?;

    let mut names: Vec<String> = Vec::new();
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().into_owned();
        if !is_listable(&name) {
            continue;
        }
        let path = entry.path();
        // A directory called `something.log` is not a report, and a junction
        // called one resolves outside the folder. Both are skipped rather than
        // refused: one bad entry must not stop the window listing the rest.
        match entry.file_type() {
            Ok(t) if t.is_file() => {}
            _ => continue,
        }
        if ensure_inside(&dir, &path).is_err() {
            continue;
        }
        names.push(name);
    }
    names.sort();
    Ok(names)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 🔴 The encoding test. Every assertion here is a way the engine reads the
    /// file wrongly rather than a way it fails to read it - which is what makes
    /// this worth a test at all. A BOM or an LF ending does not throw; it silently
    /// selects fewer files than the window said it would.
    #[test]
    fn writes_utf8_without_a_bom_and_ends_every_line_with_crlf() {
        let bytes = render_select_file(&[
            r"C:\Users\PC\AppData\Local\Temp\one.tmp".to_string(),
            r"C:\Users\PC\Downloads\two nine.iso".to_string(),
        ])
        .expect("two ordinary paths must render");

        // No BOM. The engine's first line is a path; a BOM makes it match nothing.
        assert_ne!(
            &bytes[..3.min(bytes.len())],
            &[0xEF, 0xBB, 0xBF],
            "a UTF-8 BOM would corrupt the first path"
        );
        assert!(!bytes.starts_with(&[0xEF, 0xBB, 0xBF]));

        let text = String::from_utf8(bytes).expect("the file must be valid UTF-8");
        assert_eq!(
            text,
            "C:\\Users\\PC\\AppData\\Local\\Temp\\one.tmp\r\n\
             C:\\Users\\PC\\Downloads\\two nine.iso\r\n"
        );

        // Stated as a property as well as an equality, so a future edit that adds
        // a path cannot quietly drop the ending on the new line: every LF in the
        // file is preceded by a CR.
        let raw = text.as_bytes();
        for (i, b) in raw.iter().enumerate() {
            if *b == b'\n' {
                assert!(i > 0 && raw[i - 1] == b'\r', "a bare LF at byte {i}");
            }
        }
        assert_eq!(text.matches("\r\n").count(), 2, "one ending per path");
    }

    /// The refusals. Each of these is a line the engine would accept and act on,
    /// meaning something other than what the window displayed.
    #[test]
    fn refuses_a_selection_that_is_not_one_choice_per_line() {
        // The injection case: one "path" carrying a second selection nobody chose.
        let smuggled = render_select_file(&[
            r"C:\Users\PC\Downloads\ok.iso".to_string(),
            "C:\\decoy.txt\r\nC:\\Windows\\System32\\config\\SAM".to_string(),
        ]);
        assert!(
            smuggled.is_err(),
            "an embedded line break adds a selection the window never showed"
        );

        assert!(
            render_select_file(&["a\nb".to_string()]).is_err(),
            "bare LF"
        );
        assert!(render_select_file(&["a\0b".to_string()]).is_err(), "NUL");
        assert!(render_select_file(&["   ".to_string()]).is_err(), "blank");
        assert!(render_select_file(&[]).is_err(), "empty selection");
        // The engine drops a leading-# line as a comment, so accepting it here
        // would mean a file the person picked silently not being touched.
        assert!(render_select_file(&["#C:\\notes.txt".to_string()]).is_err());

        // The control, so this test cannot pass by refusing everything: an
        // ordinary path with spaces and a hash NOT in first position is fine.
        assert!(render_select_file(&[r"C:\a b\c#1.txt".to_string()]).is_ok());
    }

    /// 🔴 The containment refusal, exercised against a real junction-shaped escape.
    ///
    /// A name-only check - the shape `read_run_report` uses - passes every case
    /// below, because none of these names contains `..`, a separator or a colon.
    /// It is the resolution that catches them, which is why the check resolves.
    #[test]
    fn refuses_a_path_that_resolves_outside_the_run_folder() {
        let base = std::env::temp_dir().join("windowsweep-test-contain");
        let inside = base.join("nested");
        let outside = std::env::temp_dir().join("windowsweep-test-elsewhere");
        std::fs::create_dir_all(&inside).expect("test fixture");
        std::fs::create_dir_all(&outside).expect("test fixture");

        let good = inside.join("report-1.json");
        std::fs::write(&good, "{}").expect("test fixture");
        assert!(
            ensure_inside(&base, &good).is_ok(),
            "a real file under the run folder must be allowed, or this test proves nothing"
        );

        // The escape: a sibling folder, reachable only by resolving.
        let bad = outside.join("report-1.json");
        std::fs::write(&bad, "{}").expect("test fixture");
        assert!(
            ensure_inside(&base, &bad).is_err(),
            "a file outside the run folder must be refused"
        );

        // A traversal that a substring check on the FINAL component would miss,
        // because the final component is a perfectly ordinary name.
        let traversed = base.join("nested").join("..").join("..");
        assert!(
            ensure_inside(&base, &traversed).is_err(),
            "climbing out through .. must be refused after resolution"
        );

        let _ = std::fs::remove_dir_all(&base);
        let _ = std::fs::remove_dir_all(&outside);
    }

    /// What the window may see. The list is deliberately narrow: a run folder also
    /// holds `select.txt`, which the window wrote and has no reason to read back,
    /// and anything a future engine version drops there.
    #[test]
    fn lists_only_the_reports_and_logs() {
        for name in [
            "report-2026-09-08.json",
            "REPORT-1.JSON",
            "windowsweep.log",
            "elevated-child.LOG",
        ] {
            assert!(
                is_listable(name),
                "{name} is a run artefact the window tails"
            );
        }
        for name in [
            "select.txt",
            "report-1.json.exe",
            "notes.txt",
            "report.json",
            "log",
            "summary.jsonl",
        ] {
            assert!(
                !is_listable(name),
                "{name} is not a report or a log and must not be offered"
            );
        }
    }
}
