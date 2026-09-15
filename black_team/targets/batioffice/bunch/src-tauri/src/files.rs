//! Filesystem helpers used by the commands.
//!
//! Thin, dependency-light wrappers around `std::fs`. BatiOffice kept its file
//! bookkeeping in the local store (db.rs) and touched the real FS for the
//! actual documents; we do the same.

use std::fs;
use std::path::{Component, Path, PathBuf};

use crate::models::{FileKind, FileInfo};
use chrono::Utc;

/// Returns a FileInfo for `path` (or None if the file does not exist).
pub fn file_info(path: &str) -> Option<FileInfo> {
    let p = PathBuf::from(path);
    let meta = fs::metadata(&p).ok()?;
    let name = p.file_name().and_then(|n| n.to_str()).unwrap_or("").to_string();
    let kind = FileKind::from_extension(&name);
    let mtime = p.metadata().ok().and_then(|m| m.modified().ok())
        .map(|t| {
            let d = t.duration_since(std::time::SystemTime::UNIX_EPOCH).unwrap_or_default();
            d.as_secs() as i64
        });
    Some(FileInfo {
        path: path.to_string(),
        name,
        kind,
        size: meta.len() as i64,
        last_opened: None,
        starred: false,
        mtime,
    })
}

/// Lists immediate children of `dir` (BatiOffice listed the project folder).
pub fn list_dir(dir: &str) -> Vec<FileInfo> {
    let mut out = Vec::new();
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if let Ok(meta) = path.metadata() {
                out.push(FileInfo {
                    path: path.to_string_lossy().to_string(),
                    name: entry.file_name().to_string_lossy().to_string(),
                    kind: FileKind::from_extension(&path.to_string_lossy()),
                    size: meta.len() as i64,
                    last_opened: None,
                    starred: false,
                    mtime: meta.modified().ok().map(|t| {
                        t.duration_since(std::time::SystemTime::UNIX_EPOCH).unwrap_or_default().as_secs() as i64
                    }),
                });
            }
        }
    }
    out
}

/// Normalizes a path by collapsing `.`/`..` segments.
pub fn canonicalize(path: &str) -> String {
    let mut out: PathBuf = PathBuf::new();
    for comp in Path::new(path).components() {
        match comp {
            Component::ParentDir => {
                out.pop();
            }
            Component::CurDir => {}
            other => out.push(other.as_os_str()),
        }
    }
    out.to_string_lossy().to_string()
}

/// Returns the default save directory, creating it if it does not exist.
pub fn default_save_dir() -> String {
    let home = std::env::var("HOME").unwrap_or_default();
    let dir = PathBuf::from(&home).join("Documents").join("Bunch");
    if !dir.exists() {
        let _ = fs::create_dir_all(&dir);
    }
    dir.to_string_lossy().to_string()
}

/// Creates a new document template and returns its path.
pub fn new_document(kind: &FileKind, dir: &str) -> String {
    let ts = Utc::now().timestamp();
    let (ext, content) = match kind {
        FileKind::Markdown => ("md", "# Untitled Bunch document\n\n"),
        FileKind::Doc => ("docx", "Untitled document"),
        FileKind::Sheet => ("xlsx", "Untitled spreadsheet"),
        FileKind::Slide => ("pptx", "Untitled presentation"),
        FileKind::Pdf => ("pdf", "Untitled PDF"),
        FileKind::Hwp => ("hwp", "Untitled HWP"),
        _ => ("txt", "Untitled document\n"),
    };
    let name = format!("Untitled_{}_{}.{}", ts, rand_suffix(), ext);
    let path = PathBuf::from(dir).join(&name);
    let _ = fs::write(&path, content);
    path.to_string_lossy().to_string()
}

fn rand_suffix() -> String {
    use std::sync::atomic::{AtomicU64, Ordering};
    static COUNTER: AtomicU64 = AtomicU64::new(0);
    let v = COUNTER.fetch_add(1, Ordering::Relaxed);
    format!("{:04}", v % 10000)
}
