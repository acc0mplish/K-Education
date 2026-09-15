//! Data models shared by the Tauri backend.
//!
//! These mirror the local (Bati-excluded) data model that BatiOffice v0.9.8
//! used under the hood: a small SQLite store of files, projects and a
//! project timeline. Cloud/account/credits/AI types are intentionally omitted.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FileKind {
    Pdf,
    Markdown,
    Doc,
    Sheet,
    Slide,
    Hwp,
    Unknown,
}

impl FileKind {
    pub fn from_extension(path: &str) -> Self {
        let ext = path.rsplit('.').next().unwrap_or("").to_ascii_lowercase();
        match ext.as_str() {
            "pdf" => FileKind::Pdf,
            "md" | "markdown" => FileKind::Markdown,
            "doc" | "docx" => FileKind::Doc,
            "xls" | "xlsx" => FileKind::Sheet,
            "ppt" | "pptx" => FileKind::Slide,
            "hwp" | "hpx" => FileKind::Hwp,
            _ => FileKind::Unknown,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FileInfo {
    pub path: String,
    pub name: String,
    pub kind: FileKind,
    pub size: i64,
    pub last_opened: Option<i64>,
    pub starred: bool,
    pub mtime: Option<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectInfo {
    pub id: i64,
    pub name: String,
    pub root_path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimelineEntry {
    pub id: i64,
    pub project_id: i64,
    pub file_path: String,
    pub file_name: String,
    pub action: String,
    pub timestamp: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Stats {
    pub total_files: i64,
    pub starred_files: i64,
    pub projects: i64,
}
