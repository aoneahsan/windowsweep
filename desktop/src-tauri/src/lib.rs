//! windowsweep desktop - the Tauri shell.
//!
//! The window's whole job is to drive the bundled PowerShell engine and show what
//! it reports. Everything that decides what may be deleted lives in that engine,
//! which is the same file the command-line tool runs, bundled verbatim.

mod args;
mod cancel;
mod drives;
mod engine;
mod oauth;
mod runs;
mod schedule;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(oauth::OauthListener::default())
        // The live-run map. `run_clean` puts a run in it and takes it out again;
        // `cancel_run` is the only other thing that touches it.
        .manage(cancel::RunRegistry::default())
        // 🔴 ONE `generate_handler!`, holding every command. A second
        // `invoke_handler` call does not merge and does not warn - the later call
        // silently replaces the earlier one, so every command in the first list
        // stops existing while the build stays green and the only symptom is
        // `Command <name> not found` at runtime. Adding a command means adding a
        // line HERE, never a second call below.
        .invoke_handler(tauri::generate_handler![
            engine::app_version,
            engine::run_clean,
            engine::read_run_report,
            cancel::cancel_run,
            drives::list_drives,
            runs::write_select_file,
            runs::list_run_files,
            schedule::schedule_status,
            oauth::oauth_listen_start,
            oauth::oauth_listen_await,
        ])
        .run(tauri::generate_context!())
        .expect("windowsweep could not start");
}
