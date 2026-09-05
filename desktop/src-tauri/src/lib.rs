//! windowsweep desktop - the Tauri shell.
//!
//! The window's whole job is to drive the bundled PowerShell engine and show what
//! it reports. Everything that decides what may be deleted lives in that engine,
//! which is the same file the command-line tool runs, bundled verbatim.

mod engine;
mod oauth;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(oauth::OauthListener::default())
        .invoke_handler(tauri::generate_handler![
            engine::app_version,
            engine::run_clean,
            engine::read_run_report,
            oauth::oauth_listen_start,
            oauth::oauth_listen_await,
        ])
        .run(tauri::generate_context!())
        .expect("windowsweep could not start");
}
