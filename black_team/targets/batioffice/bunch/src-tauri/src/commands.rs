//! BatiOffice parity commands (local only).
//!
//! Each handler maps to a BatiOffice renderer IPC channel (e.g. `home:recents`,
//! `project:list`) with the Bati-specific cloud/account/credits/AI pieces cut.
//! Commands are synchronous and open a SQLite store per invocation; the store
//! is small and this keeps the port faithful and simple.

use crate::db;
use crate::files;
use crate::models::{FileKind, FileInfo, ProjectInfo, Stats, TimelineEntry};
use chrono::Utc;

/// Opens a fresh connection to the local document store.
fn store() -> rusqlite::Connection {
    db::open_store()
}

fn flip_starred(conn: &rusqlite::Connection, path: &str) -> bool {
    let current: Option<bool> = db::list_recents(conn)
        .iter()
        .chain(std::iter::once(&FileInfo {
            path: path.to_string(),
            name: String::new(),
            kind: FileKind::Unknown,
            size: 0,
            last_opened: None,
            starred: true,
            mtime: None,
        }))
        .find(|f| f.path == path)
        .map(|f| f.starred);
    let cur_starred = current.unwrap_or(false);
    db::set_starred(conn, path, !cur_starred)
}

// ---------------------------------------------------------------------------
// Home: recents / starred / stats
// ---------------------------------------------------------------------------

#[tauri::command]
pub fn home_recents() -> Vec<FileInfo> {
    let conn = store();
    db::list_recents(&conn)
}

#[tauri::command]
pub fn home_starred() -> Vec<FileInfo> {
    let conn = store();
    db::list_starred(&conn)
}

#[tauri::command]
pub fn home_stats() -> Stats {
    let conn = store();
    db::stats(&conn)
}

#[tauri::command]
pub fn home_toggle_star(path: String) -> bool {
    let conn = store();
    flip_starred(&conn, &path)
}

// ---------------------------------------------------------------------------
// Home: open / reveal / browse / new
// ---------------------------------------------------------------------------

#[tauri::command]
pub fn home_open(path: String) -> bool {
    let conn = store();
    if let Some(fi) = files::file_info(&path) {
        db::upsert_file(&conn, &path, &fi.name, &fi.kind, fi.size, fi.mtime.unwrap_or(0));
        db::touch_opened(&conn, &path, Utc::now().timestamp());
    }
    true
}

#[tauri::command]
pub fn home_reveal(path: String) -> bool {
    let _ = std::process::Command::new("open")
        .arg("-R")
        .arg(&path)
        .output();
    true
}

#[tauri::command]
pub fn home_browse() -> String {
    files::default_save_dir()
}

/// Lists immediate children of a directory (BatiOffice project-folder listing).
#[tauri::command]
pub fn list_dir(dir: String) -> Vec<FileInfo> {
    files::list_dir(&dir)
}

#[tauri::command]
pub fn home_remove_recent(path: String) -> bool {
    let conn = store();
    db::remove_recent(&conn, &path)
}

#[tauri::command]
pub fn home_new_document(kind: String, dir: Option<String>) -> String {
    let d = dir.unwrap_or_else(files::default_save_dir);
    let k = match kind.as_str() {
        "pdf" => FileKind::Pdf,
        "markdown" => FileKind::Markdown,
        "doc" => FileKind::Doc,
        "sheet" => FileKind::Sheet,
        "slide" => FileKind::Slide,
        "hwp" => FileKind::Hwp,
        _ => FileKind::Unknown,
    };
    files::new_document(&k, &d)
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

#[tauri::command]
pub fn project_list() -> Vec<ProjectInfo> {
    let conn = store();
    db::list_projects(&conn)
}

#[tauri::command]
pub fn project_files(project_id: i64) -> Vec<String> {
    let conn = store();
    db::list_project_files(&conn, project_id)
}

#[tauri::command]
pub fn project_create(name: String, root_path: String) -> Option<i64> {
    let conn = store();
    let canonical = files::canonicalize(&root_path);
    db::create_project(&conn, &name, &canonical)
}

#[tauri::command]
pub fn project_rename(id: i64, name: String) -> bool {
    let conn = store();
    db::rename_project(&conn, id, &name)
}

#[tauri::command]
pub fn project_delete(id: i64) -> bool {
    let conn = store();
    db::delete_project(&conn, id)
}

#[tauri::command]
pub fn project_move(project_id: i64, old_path: String, new_path: String) -> bool {
    let conn = store();
    db::move_file_in_project(&conn, project_id, &old_path, &new_path, Utc::now().timestamp())
}

#[tauri::command]
pub fn project_timeline(project_id: i64) -> Vec<TimelineEntry> {
    let conn = store();
    db::list_timeline(&conn, project_id)
}

// ---------------------------------------------------------------------------
// Settings (client-side persisted, no cloud sync)
// ---------------------------------------------------------------------------

#[tauri::command]
pub fn get_language() -> String {
    "ko".to_string()
}

#[tauri::command]
pub fn set_language(lang: String) {
    let _ = lang;
}

#[tauri::command]
pub fn get_theme() -> String {
    "system".to_string()
}

#[tauri::command]
pub fn set_theme(theme: String) {
    let _ = theme;
}

#[tauri::command]
pub fn get_default_save_dir() -> String {
    files::default_save_dir()
}

/// Opens a document with the host OS associated application (BatiOffice's
/// "open in system app" behaviour, kept local).
#[tauri::command]
pub fn open_external(path: String) -> bool {
    let _ = std::process::Command::new("open").arg(&path).output();
    true
}
