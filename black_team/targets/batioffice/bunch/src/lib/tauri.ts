// bunch <-> Tauri backend API layer.
// Faithful port of BatiOffice's local IPC channels (Bati cloud/account/AI cut).
import { invoke } from "@tauri-apps/api/core";

export type Lang =
  | "ko" | "en" | "ja" | "zh" | "fr" | "de" | "es" | "th" | "id"
  | "ru" | "ar" | "pt" | "it" | "pl" | "nl" | "ms" | "he" | "hi" | "zh-TW";

export type ThemeMode = "system" | "light" | "dark";

export type FileKind =
  | "pdf" | "markdown" | "doc" | "sheet" | "slide" | "hwp" | "unknown";

export interface FileInfo {
  path: string;
  name: string;
  kind: FileKind;
  size: number;
  lastOpened: number | null;
  starred: boolean;
  mtime: number | null;
}

export interface ProjectInfo {
  id: number;
  name: string;
  rootPath: string;
}

export interface TimelineEntry {
  id: number;
  projectId: number;
  filePath: string;
  fileName: string;
  action: string;
  timestamp: number;
}

export interface Stats {
  totalFiles: number;
  starredFiles: number;
  projects: number;
}

export interface HomeRecentsArgs {
  query?: string;
}

// --- Home ---
export const homeRecents = (args?: HomeRecentsArgs) =>
  invoke<FileInfo[]>("home_recents", { args });
export const homeStarred = () => invoke<FileInfo[]>("home_starred");
export const homeStats = () => invoke<Stats>("home_stats");
export const homeToggleStar = (path: string) =>
  invoke<boolean>("home_toggle_star", { path });
export const homeOpen = (path: string) =>
  invoke<boolean>("home_open", { path });
export const homeReveal = (path: string) =>
  invoke<boolean>("home_reveal", { path });
export const homeBrowse = () => invoke<string>("home_browse");
export const listDir = (dir: string) => invoke<FileInfo[]>("list_dir", { dir });
export const homeRemoveRecent = (path: string) =>
  invoke<boolean>("home_remove_recent", { path });
export const homeNewDocument = (kind: FileKind, dir?: string) =>
  invoke<string>("home_new_document", { kind, dir });

// --- Projects ---
export const projectList = () => invoke<ProjectInfo[]>("project_list");
export const projectFiles = (projectId: number) =>
  invoke<string[]>("project_files", { projectId });
export const projectCreate = (name: string, rootPath: string) =>
  invoke<number | null>("project_create", { name, rootPath });
export const projectRename = (id: number, name: string) =>
  invoke<boolean>("project_rename", { id, name });
export const projectDelete = (id: number) =>
  invoke<boolean>("project_delete", { id });
export const projectMove = (projectId: number, oldPath: string, newPath: string) =>
  invoke<boolean>("project_move", { projectId, oldPath, newPath });
export const projectTimeline = (projectId: number) =>
  invoke<TimelineEntry[]>("project_timeline", { projectId });

// --- Settings ---
export const getLanguage = () => invoke<Lang>("get_language");
export const setLanguage = (lang: Lang) =>
  invoke<void>("set_language", { lang });
export const getTheme = () => invoke<ThemeMode>("get_theme");
export const setTheme = (theme: ThemeMode) => invoke<void>("set_theme", { theme });
export const getDefaultSaveDir = () => invoke<string>("get_default_save_dir");
