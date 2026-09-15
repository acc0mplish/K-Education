//! bunch — a BatiOffice local-document-shell reimplementation in Tauri + React.
//!
//! Bati-specific cloud / account / credits / AI / telemetry layers are removed;
//! the local project, recents, starred, tabs and settings shell is ported
//! verbatim in behaviour.

#![cfg_attr(all(test, not(target_os = "macos")), windows_subsystem = "windows")]

mod commands;
mod db;
mod files;
mod models;
mod office;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::home_recents,
            commands::home_starred,
            commands::home_stats,
            commands::home_toggle_star,
            commands::home_open,
            commands::home_reveal,
            commands::home_browse,
            commands::list_dir,
            commands::home_remove_recent,
            commands::home_new_document,
            commands::project_list,
            commands::project_files,
            commands::project_create,
            commands::project_rename,
            commands::project_delete,
            commands::project_move,
            commands::project_timeline,
            commands::get_language,
            commands::set_language,
            commands::get_theme,
            commands::set_theme,
            commands::get_default_save_dir,
            commands::open_external,
            office::serve_module,
            office::files_read,
            office::office_save,
            office::office_open,
            office::office_recent,
        ])
        .run(tauri::generate_context!())
        .expect("error while running bunch");
}
