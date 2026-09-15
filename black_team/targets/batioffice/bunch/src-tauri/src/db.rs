//! SQLite persistence for the local document store.
//!
//! Schema mirrors BatiOffice's local bookkeeping: a flat `files` table plus a
//! `projects` table with an audit `timeline`. All timestamps are unix seconds.

use rusqlite::Connection;
use std::path::PathBuf;

use crate::models::{FileInfo, ProjectInfo, Stats, TimelineEntry};

const SCHEMA: &str = r#"
CREATE TABLE IF NOT EXISTS files (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    path         TEXT UNIQUE NOT NULL,
    name         TEXT NOT NULL,
    kind         TEXT NOT NULL,
    size         INTEGER NOT NULL DEFAULT 0,
    last_opened  INTEGER,
    starred      INTEGER NOT NULL DEFAULT 0,
    mtime        INTEGER
);
CREATE INDEX IF NOT EXISTS idx_files_last_opened ON files(last_opened);
CREATE INDEX IF NOT EXISTS idx_files_starred ON files(starred);

CREATE TABLE IF NOT EXISTS projects (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    root_path  TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS timeline (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    file_path  TEXT NOT NULL,
    action     TEXT NOT NULL,
    timestamp  INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_timeline_project ON timeline(project_id);
"#;

/// Returns the path to the local SQLite store, created inside the app data dir.
fn store_path() -> PathBuf {
    let mut p = std::env::temp_dir();
    p.push("bunch_store.db");
    p
}

/// Opens (creating on first run) the local document store.
pub fn open_store() -> Connection {
    let conn = Connection::open(store_path())
        .expect("failed to open bunch store");
    conn.pragma_update(None, "journal_mode", "wal")
        .expect("failed to set WAL");
    conn.execute_batch(SCHEMA).expect("failed to init schema");
    conn
}

pub fn files_to_info(rows: Vec<(i64, String, String, String, i64, Option<i64>, i64, Option<i64>)>) -> Vec<FileInfo> {
    rows.into_iter()
        .map(|(_id, path, name, kind, size, last_opened, starred, mtime)| FileInfo {
            path,
            name,
            kind: serde_json::from_str(&kind).unwrap_or(crate::models::FileKind::Unknown),
            size,
            last_opened,
            starred: starred != 0,
            mtime,
        })
        .collect()
}

pub fn list_recents(conn: &Connection) -> Vec<FileInfo> {
    let mut stmt = conn
        .prepare("SELECT id,path,name,kind,size,last_opened,starred,mtime FROM files WHERE last_opened IS NOT NULL ORDER BY last_opened DESC")
        .expect("prepare recents");
    let rows = stmt.query_map([], |r| {
        Ok((
            r.get::<_, i64>(0)?,
            r.get::<_, String>(1)?,
            r.get::<_, String>(2)?,
            r.get::<_, String>(3)?,
            r.get::<_, i64>(4)?,
            r.get::<_, Option<i64>>(5)?,
            r.get::<_, i64>(6)?,
            r.get::<_, Option<i64>>(7)?,
        ))
    })
        .expect("map recents")
        .collect::<Result<_, _>>()
        .expect("collect recents");
    files_to_info(rows)
}

pub fn list_starred(conn: &Connection) -> Vec<FileInfo> {
    let mut stmt = conn
        .prepare("SELECT id,path,name,kind,size,last_opened,starred,mtime FROM files WHERE starred = 1 ORDER BY mtime DESC NULLS LAST")
        .expect("prepare starred");
    let rows = stmt.query_map([], |r| {
        Ok((
            r.get::<_, i64>(0)?,
            r.get::<_, String>(1)?,
            r.get::<_, String>(2)?,
            r.get::<_, String>(3)?,
            r.get::<_, i64>(4)?,
            r.get::<_, Option<i64>>(5)?,
            r.get::<_, i64>(6)?,
            r.get::<_, Option<i64>>(7)?,
        ))
    })
        .expect("map starred")
        .collect::<Result<_, _>>()
        .expect("collect starred");
    files_to_info(rows)
}

pub fn upsert_file(conn: &Connection, path: &str, name: &str, kind: &crate::models::FileKind, size: i64, mtime: i64) {
    conn.execute(
        "INSERT INTO files(path,name,kind,size,starred,mtime) VALUES(?1,?2,?3,?4,0,?5)
         ON CONFLICT(path) DO UPDATE SET name=excluded.name, kind=excluded.kind, size=excluded.size, mtime=excluded.mtime",
        rusqlite::params![path, name, serde_json::to_string(kind).unwrap(), size, mtime],
    )
        .expect("upsert file");
}

pub fn touch_opened(conn: &Connection, path: &str, ts: i64) {
    conn.execute("UPDATE files SET last_opened=?1 WHERE path=?2", rusqlite::params![ts, path])
        .expect("touch opened");
}

pub fn set_starred(conn: &Connection, path: &str, on: bool) -> bool {
    let changed = conn.execute(
        "UPDATE files SET starred=?1 WHERE path=?2",
        rusqlite::params![if on { 1 } else { 0 }, path],
    )
        .expect("toggle star");
    changed > 0
}

pub fn remove_recent(conn: &Connection, path: &str) -> bool {
    let changed = conn.execute("DELETE FROM files WHERE path=?1", rusqlite::params![path])
        .expect("remove recent");
    changed > 0
}

pub fn stats(conn: &Connection) -> Stats {
    let total: i64 = conn.query_row("SELECT COUNT(*) FROM files", [], |r| r.get(0)).unwrap_or(0);
    let starred: i64 = conn.query_row("SELECT COUNT(*) FROM files WHERE starred=1", [], |r| r.get(0)).unwrap_or(0);
    let projects: i64 = conn.query_row("SELECT COUNT(*) FROM projects", [], |r| r.get(0)).unwrap_or(0);
    Stats { total_files: total, starred_files: starred, projects }
}

pub fn list_projects(conn: &Connection) -> Vec<ProjectInfo> {
    let mut stmt = conn.prepare("SELECT id,name,root_path FROM projects ORDER BY name").expect("prepare projects");
    let rows = stmt
        .query_map([], |r| Ok((r.get::<_, i64>(0)?, r.get::<_, String>(1)?, r.get::<_, String>(2)?)))
        .expect("map projects")
        .collect::<Result<Vec<_>, _>>()
        .expect("collect projects");
    rows.into_iter().map(|(id, name, root_path)| ProjectInfo { id, name, root_path }).collect()
}

pub fn list_project_files(conn: &Connection, project_id: i64) -> Vec<String> {
    let mut stmt = conn
        .prepare("SELECT file_path FROM timeline WHERE project_id=?1 GROUP BY file_path ORDER BY id DESC")
        .expect("prepare files");
    let rows = stmt
        .query_map(rusqlite::params![project_id], |r| r.get::<_, String>(0))
        .expect("map files")
        .collect::<Result<Vec<_>, _>>()
        .expect("collect files");
    rows
}

pub fn add_timeline(conn: &Connection, project_id: i64, file_path: &str, action: &str, ts: i64) {
    conn.execute(
        "INSERT INTO timeline(project_id,file_path,action,timestamp) VALUES(?1,?2,?3,?4)",
        rusqlite::params![project_id, file_path, action, ts],
    )
        .expect("insert timeline");
}

pub fn list_timeline(conn: &Connection, project_id: i64) -> Vec<TimelineEntry> {
    let mut stmt = conn
        .prepare("SELECT id,project_id,file_path,action,timestamp FROM timeline WHERE project_id=?1 ORDER BY id DESC")
        .expect("prepare timeline");
    let rows = stmt
        .query_map(rusqlite::params![project_id], |r| {
            Ok((
                r.get::<_, i64>(0)?,
                r.get::<_, i64>(1)?,
                r.get::<_, String>(2)?,
                r.get::<_, String>(3)?,
                r.get::<_, i64>(4)?,
            ))
        })
        .expect("map timeline")
        .collect::<Result<Vec<_>, _>>()
        .expect("collect timeline");
    rows.into_iter().map(|(id, project_id, file_path, action, timestamp)| {
        let file_name = file_path.rsplit('/').next().unwrap_or(&file_path).to_string();
        TimelineEntry { id, project_id, file_path, file_name, action, timestamp }
    }).collect()
}

pub fn create_project(conn: &Connection, name: &str, root_path: &str) -> Option<i64> {
    conn.execute("INSERT INTO projects(name,root_path) VALUES(?1,?2)", rusqlite::params![name, root_path])
        .expect("insert project");
    Some(conn.last_insert_rowid())
}

pub fn rename_project(conn: &Connection, id: i64, name: &str) -> bool {
    let changed = conn.execute("UPDATE projects SET name=?1 WHERE id=?2", rusqlite::params![name, id])
        .expect("rename project");
    changed > 0
}

pub fn delete_project(conn: &Connection, id: i64) -> bool {
    let changed = conn.execute("DELETE FROM projects WHERE id=?1", rusqlite::params![id])
        .expect("delete project");
    changed > 0
}

pub fn move_file_in_project(conn: &Connection, project_id: i64, old_path: &str, new_path: &str, ts: i64) -> bool {
    // Record the move in the timeline (BatiOffice moved within a project).
    add_timeline(conn, project_id, old_path, "move", ts);
    add_timeline(conn, project_id, new_path, "move", ts);
    true
}
