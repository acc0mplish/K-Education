//! office.rs — serve the prebuilt BatiOffice office modules (docs / sheets /
//! slides / rhwp) over a local HTTP server and expose the small set of file
//! channels the modules need to open and save documents.
//!
//! The office engines are prebuilt Electron renderer bundles (Vite output) that
//! reference their assets by absolute path (`/rhwp/...`) or relative path
//! (`./assets/...`) and resolve their WASM engine via `import.meta.url`. They
//! therefore must be served over HTTP from a fixed URL prefix, not loaded from
//! `file://`. A single background `tiny_http` server rooted at
//! `src-tauri/assets/modules/` serves:
//!
//!   /modules/<name>/... -> assets/modules/<name>/...   (docs, sheets, slides)
//!   /rhwp/...           -> assets/modules/hwp-rhwp/... (the HWP web engine)
//!
//! The Bati-specific cloud/account/credits/AI IPC channels are cut; only the
//! file-open/save/recent channels that make the engine functional locally are
//! implemented.

use std::io::Read;
use std::path::{Path, PathBuf};
use std::sync::OnceLock;
use std::thread;

use tiny_http::{Header, Method, Request, Response, Server};

/// Parent directory of the office modules, relative to the package root
/// (where cargo runs `src-tauri/...`). Used as the dev-mode fallback.
pub const MODULES_DIR: &str = "src-tauri/assets/modules";

/// Resolves the on-disk location of the office module bundles, working in both
/// dev and release:
///   - dev  (`cargo run`): CWD is the package root, so `MODULES_DIR` resolves.
///   - release: `bundle_resources` copies `assets/modules` into the app's
///     Resources dir; the executable lives in `Contents/MacOS`, so the modules
///     are at `../Resources/assets/modules`.
/// Returns the directory that *contains* the `modules` subdirectory
/// (`src-tauri/assets`), so that `content_for("modules/...")` resolves to
/// `<assets>/modules/...`. Returns `None` only when the files are genuinely absent (e.g. a bare
/// `cargo test`), so callers can degrade gracefully.
fn resolve_modules_dir() -> Option<PathBuf> {
    // modules dir, found CWD-independently.
    let modules = (|| {
        if let Ok(manifest) = std::env::var("CARGO_MANIFEST_DIR") {
            let rel = PathBuf::from(manifest).join("assets/modules");
            if let Some(p) = rel.canonicalize().ok() {
                if p.join("docs").is_dir() { return Some(p); }
            }
        }
        if let Some(p) = PathBuf::from(MODULES_DIR).canonicalize().ok() {
            if p.join("docs").is_dir() { return Some(p); }
        }
        if let Ok(exe) = std::env::current_exe() {
            if let Some(dir) = exe.parent() {
                let rel = dir.join("../Resources/assets/modules");
                if let Some(p) = rel.canonicalize().ok() {
                    if p.join("docs").is_dir() { return Some(p); }
                }
            }
        }
        None
    })()?;
    modules.parent().map(Path::to_path_buf)
}

/// Base URL prefix a module is served under. `hwp`/`rhwp` use `/rhwp` because
/// the bundle hard-codes `/rhwp/...` absolute asset paths. Other modules live
/// under `/modules/<name>/` (docs/sheets/slides), matching the `assets/modules`
/// directory layout on disk.
fn base_for(name: &str) -> &'static str {
    match name {
        "hwp" | "rhwp" => "/rhwp",
        "docs" => "/modules/docs",
        "sheets" => "/modules/sheets",
        "slides" => "/modules/slides",
        _ => "/modules",
    }
}

/// Returns the subdirectory under `MODULES_DIR` a URL prefix maps to.
fn sub_for(url_path: &str) -> Option<(&'static str, &str)> {
    let rel = url_path.trim_start_matches('/');
    if let Some(rest) = rel.strip_prefix("modules/") {
        return Some(("modules", rest));
    }
    if let Some(rest) = rel.strip_prefix("rhwp/") {
        return Some(("hwp-rhwp", rest));
    }
    None
}

/// Resolves a URL path to an absolute file path inside the modules dir.
/// `sub` is the directory name under `MODULES_DIR` the prefix maps to
/// (`modules` for `/modules`, `hwp-rhwp` for `/rhwp`); `rest` is the remainder.
fn content_for(rel: &str) -> Option<PathBuf> {
    // directory requests default to index.html
    let rel = rel.trim_end_matches('/');
    // base is the parent of the modules dir (the "assets" dir), so that rel
    // ("modules/...") resolves to <assets>/modules/...
    let base = resolve_modules_dir()?;
    let dir = base.join(rel);
    if dir.is_dir() {
        dir.join("index.html").canonicalize().ok()
    } else {
        dir.canonicalize().ok()
    }
}

/// Resolves a URL path to an absolute file path inside the modules dir.
fn resolve(url_path: &str) -> Option<PathBuf> {
    let (sub, rest) = sub_for(url_path)?;
    // `/modules` -> modules/... ; `/rhwp` -> modules/hwp-rhwp/...
    let rel = if sub == "modules" {
        format!("modules/{}", rest)
    } else {
        format!("modules/{}/{}", sub, rest)
    };
    content_for(&rel)
}

fn mime_for(path: &Path) -> Header {
    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    let mime = match ext.as_str() {
        "js" | "mjs" => "text/javascript",
        "css" => "text/css",
        "html" | "htm" => "text/html",
        "json" => "application/json",
        "map" => "application/json",
        "woff2" | "woff" => "font/woff2",
        "ttf" | "otf" => "font/ttf",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "gif" => "image/gif",
        "svg" => "image/svg+xml",
        "ico" => "image/x-icon",
        "wasm" => "application/wasm",
        "mp4" | "webm" => "video/mp4",
        _ => "application/octet-stream",
    };
    Header::from_bytes("Content-Type", mime)
        .unwrap_or_else(|_| Header::from_bytes("Content-Type", "application/octet-stream").unwrap())
}

fn handle_request(req: &Request) -> (u16, Header, Result<Vec<u8>, u16>) {
    let url = req.url().to_string();
    let path = url.split('?').next().unwrap_or(&url);

    if req.method() != &Method::Get {
        return (405, mime_for(Path::new("text/plain")), Err(405));
    }

    match resolve(path) {
        Some(resolved) => match read_file_bytes(&resolved) {
            Some((true, bytes)) => (200, mime_for(&resolved), Ok(bytes)),
            _ => (404, mime_for(Path::new("text/plain")), Err(404)),
        },
        None => (404, mime_for(Path::new("text/plain")), Err(404)),
    }
}

/// Reads a file into memory, returning (is_file, bytes).
fn read_file_bytes(path: &Path) -> Option<(bool, Vec<u8>)> {
    let is_file = path.is_file();
    let mut f = std::fs::File::open(path).ok()?;
    let mut bytes = Vec::new();
    f.read_to_end(&mut bytes).ok()?;
    Some((is_file, bytes))
}

/// Starts the background static server (idempotent) and returns the base URL.
/// The server binds an ephemeral port on first use and is bound for the app
/// lifetime on a dedicated thread.
fn ensure_server() -> String {
    static STARTED: OnceLock<String> = OnceLock::new();
    STARTED
        .get_or_init(|| {
            let server =
                Server::http("127.0.0.1:0").expect("office static server must bind");
            let addr = server
                .server_addr()
                .to_string()
                .trim_start_matches("SocketAddr: ")
                .to_string();
            let url = format!("http://{}", addr);
            thread::spawn(move || {
                for req in server.incoming_requests() {
                    let (status, mime, result) = handle_request(&req);
                    let response = match result {
                        Ok(bytes) => {
                            Response::from_data(bytes).with_header(mime)
                        }
                        Err(code) => {
                            Response::from_string("not found").with_status_code(code)
                        }
                    };
                    let _ = req.respond(response);
                    let _ = status;
                }
            });
            url
        })
        .clone()
}

/// Returns the served base URL for an office module (docs/sheets/slides/rhwp).
#[tauri::command]
pub fn serve_module(name: &str) -> String {
    let base = ensure_server();
    format!("{}/{}", base, base_for(name))
}

/// Reads a file from disk and returns its contents for the module to parse.
#[tauri::command]
pub fn files_read(path: String) -> serde_json::Value {
    let bytes = match std::fs::read(&path) {
        Ok(b) => b,
        Err(_) => {
            return serde_json::json!({ "error": "read failed", "path": path });
        }
    };
    serde_json::json!({
        "base64": base64_encode(&bytes),
        "name": path.rsplit('/').next().unwrap_or(&path),
        "path": path,
        "size": bytes.len(),
    })
}

/// Writes base64-encoded `data` back to `path`. Returns `{ ok }` because the
/// docs engine inspects `result.ok` after a save.
#[tauri::command]
pub fn office_save(path: String, data: String, _auto: Option<bool>) -> serde_json::Value {
    let bytes = match base64_decode(&data) {
        Some(b) => b,
        None => return serde_json::json!({ "ok": false, "error": "bad base64" }),
    };
    let ok = std::fs::write(&path, bytes).is_ok();
    serde_json::json!({ "ok": ok, "path": path })
}

/// File-open channel the docs/slides engine requests. Returns the raw content
/// so the engine can parse it. Accepts an args object; when `blank`/no `path`
/// is given it returns a synthetic empty docx so "new document" works offline.
#[tauri::command]
pub fn office_open(args: serde_json::Value) -> serde_json::Value {
    let path = args
        .get("path")
        .and_then(|v| v.as_str())
        .map(|s| s.to_string());
    let blank = args.get("blank").and_then(|v| v.as_bool()).unwrap_or(false);
    if blank || path.is_none() {
        return serde_json::json!({ "base64": EMPTY_DOCX, "path": null, "name": "Untitled.docx", "size": 0 });
    }
    let p = path.unwrap();
    files_read(p)
}

// Minimal valid .docx (a single empty paragraph) so "new document" opens
// without a network round-trip.
const EMPTY_DOCX: &str =
    "UEsDBBQAAAAIALepL13JTxqw6wAAAK4BAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbH1QvU7DMBDe\
     eQrLK4odGBBCSTrwMwJDeYCTfUks7LPlc0v79jht6YAK4933q69b7YIXW8zsIvXyRrVSIJloHU29\
     /Fi/NPdScAGy4CNhL/fIcjVcdet9QhZVTNzLuZT0oDWbGQOwigmpImPMAUo986QTmE+YUN+27Z02\
     kQpSacriIYfuCUfY+CKed/V9LJLRsxSPR+KS1UtIyTsDpeJ6S/ZXSnNKUFV54PDsEl9XgtQXExbk\
     74CT7q0uk51F8Q65vEKoLP0Vs9U2mk2oSvW/zYWecRydwbN+cUs5GmSukwevzkgARz/99WHu4RtQ\
     SwMEFAAAAAgAt6kvXbmBRHGwAAAAKgEAAAsAAABfcmVscy8ucmVsc43POw7CMAwG4J1TRN5pWgaE\
     UJMuCKkrKgeIEjeNaB5KwqO3JwMDIAZG278/y233sDO5YUzGOwZNVQNBJ70yTjM4D8f1DkjKwikx\
     e4cMFkzQ8VV7wlnkspMmExIpiEsMppzDntIkJ7QiVT6gK5PRRytyKaOmQciL0Eg3db2l8d0A/mGS\
     XjGIvWqADEvAf2w/jkbiwcurRZd/nPhKFFlEjZnB3UdF1atdFRYob+nHi/wJUEsDBBQAAAAIALep\
     L11Ma2cQjAAAALIAAAARAAAAZG9jUHJvcHMvY29yZS54bWxlzbEOwjAMBNCdr4i8ty4MCFVNuzEz\
     wAdYiWkrGieKIwR/T1hYGE93ejdMr7CZJ2ddo1jYtx0YFhf9KrOF2/XcnMBoIfG0RWELb1aYxt3g\
     Uu9i5kuOiXNZWU2FRHuXLCylpB5R3cKBtK0LqeU95kClxjxjIvegmfHQdUcMXMhTIfyCTfqJMA74\
     dzN+AFBLAwQUAAAACAC3qS9dsv6/AJQAAAC6AAAAEQAAAHdvcmQvZG9jdW1lbnQueG1sRY07DsIw\
     EER7TmG5JxsoEIripKOmgAMYe0kixbuW1xBye5wC0cxHI71p+0+Y1RuTTExGH6paKyTHfqLB6Pvt\
     sj9rJdmStzMTGr2i6L7btUvj2b0CUlaFQNIsRo85xwZA3IjBSsURqWxPTsHmUtMACycfEzsUKQdh\
     hmNdnyDYiXRXkA/26+YRNhV0+ZpKhN8C/9fuC1BLAQIUAxQAAAAIALepL13JTxqw6wAAAK4BAAAT\
     AAAAAAAAAAAAAACAAQAAAABbQ29udGVudF9UeXBlc10ueG1sUEsBAhQDFAAAAAgAt6kvXmBRHGw\
     AAAAKgEAAAsAAAAAAAAAAAAAAIABHAEAAF9yZWxsLy5yZWxzUEsBAhQDFAAAAAgAt6kvXUxrZxCM\
     AAAAsgAAABEAAAAAAAAAAAAAAIAB9QEAAGRvY1Byb3BzL2NvcmUueG1sUEsBAhQDFAAAAAgAt6kv\
     XbL+vwCUAAAAugAAABEAAAAAAAAAAAAAAIABsAIAAHdvcmQvZG9jdW1lbnQueG1sUEsFBgAAAAAE\
     AAQA+AAAAHMDAAAAAA==";

/// Empty recent-files list (the store tracks recents via the Home screen).
#[tauri::command]
pub fn office_recent(_kind: Option<String>) -> Vec<String> {
    Vec::new()
}

fn base64_encode(bytes: &[u8]) -> String {
    const B64: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::with_capacity(bytes.len() * 2 / 3 + 4);
    for chunk in bytes.chunks(3) {
        // Encode 3 bytes -> up to 4 base64 chars. Pad short trailing groups
        // with '='. Indexing into B64 (len 64) must stay < 64, so guard each
        // slot instead of the original (which could use index 64 -> panic).
        let b0 = chunk[0] as u32;
        let b1 = (*chunk.get(1).unwrap_or(&0)) as u32;
        let b2 = (*chunk.get(2).unwrap_or(&0)) as u32;
        let n = (b0 << 16) | (b1 << 8) | b2;
        out.push(B64[((n >> 18) & 0x3f) as usize] as char);
        out.push(B64[((n >> 12) & 0x3f) as usize] as char);
        if chunk.len() > 1 {
            out.push(B64[((n >> 6) & 0x3f) as usize] as char);
        } else {
            out.push('=');
        }
        if chunk.len() > 2 {
            out.push(B64[(n & 0x3f) as usize] as char);
        } else {
            out.push('=');
        }
    }
    out
}

fn base64_decode(s: &str) -> Option<Vec<u8>> {
    const VAL: [i8; 256] = {
        let mut v = [-1i8; 256];
        let mut i = 0;
        while i < 26 {
            v[(b'A' + i) as usize] = i as i8;
            v[(b'a' + i) as usize] = 26 + i as i8;
            i += 1;
        }
        i = 0;
        while i < 10 {
            v[(b'0' + i) as usize] = 52 + i as i8;
            i += 1;
        }
        // Non-alphanumeric base64 symbols must be mapped too, or any payload
        // containing them (e.g. the bundled EMPTY_DOCX) decodes as None.
        v[43 /*+*/ as usize] = 62;
        v[47 /* / */ as usize] = 63;
        v
    };
    let mut out = Vec::with_capacity(s.len() / 2);
    let mut buf = 0u32;
    let mut bits = 0u32;
    for ch in s.bytes() {
        // Padding ('=') ends the current group: stop consuming this group.
        if ch == b'=' || ch == b'\n' || ch == b'\r' || ch == b' ' {
            break;
        }
        let v = VAL[ch as usize];
        if v < 0 {
            return None;
        }
        buf = (buf << 6) | v as u32;
        bits += 6;
        if bits >= 8 {
            bits -= 8;
            out.push(((buf >> bits) & 0xff) as u8);
            // Drop the emitted high bits so the next group doesn't inherit
            // stale payload from the already-pushed byte.
            buf &= (1 << bits) - 1;
        }
    }
    Some(out)
}

// NOTE: the frontend resolves the per-module base via the `serve_module`
// command (which applies `base_for`), so this map was dropped as dead code.

#[cfg(test)]
mod tests {
    use super::*;

    /// `office_open({blank:true})` must return the bundled EMPTY_DOCX docx.
    #[test]
    fn open_blank_returns_bundled_docx() {
        let r = office_open(serde_json::json!({ "blank": true }));
        let b64 = r["base64"].as_str().expect("base64 field");
        assert!(b64.len() > 1000, "EMPTY_DOCX payload too short");
        let decoded = base64_decode(b64).expect("decode");
        assert_eq!(&decoded[0..4], b"PK\x03\x04", "blank docx not a real zip");
        assert!(contains(&decoded, b"[Content_Types].xml"));
    }

    /// `office_open({path,blank:false})` must return the file's raw bytes.
    #[test]
    fn open_path_returns_file_bytes() {
        let p = "/tmp/bunch_test/open_path.docx";
        std::fs::write(p, &[0x50u8, 0x4b, 0x03, 0x04, 0x31, 0x32]).unwrap();
        let r = office_open(serde_json::json!({ "path": p, "blank": false }));
        assert_eq!(r["path"].as_str().unwrap(), p);
        let decoded = base64_decode(r["base64"].as_str().unwrap()).expect("decode");
        assert_eq!(decoded, vec![0x50u8, 0x4b, 0x03, 0x04, 0x31, 0x32]);
    }

    /// `office_save` + `files_read` round-trip a real docx.
    #[test]
    fn save_and_read_roundtrip() {
        let p = "/tmp/bunch_test/rt.docx";
        let content = b"PK\x03\x04bunch-docx-contents";
        let b64 = base64_encode(content);
        let r = office_save(p.to_string(), b64, Some(true));
        assert!(r["ok"].as_bool().expect("ok"), "save ok=false");
        let back = std::fs::read(p).expect("read back");
        assert_eq!(back, content);

        let fr = files_read(p.to_string());
        let fr_decoded = base64_decode(fr["base64"].as_str().unwrap()).expect("decode");
        assert_eq!(fr_decoded, content);
        assert_eq!(fr["size"].as_u64().unwrap() as usize, content.len());
    }

    /// End-to-end: start the real static server and HTTP-fetch the URLs the
    /// browser module window requests, proving the full serve pipeline
    /// (server -> resolve -> file bytes) returns 200 with body.
    #[test]
    fn static_server_serves_module_urls() {
        use std::io::Write;
        use std::net::TcpStream;
        let base = ensure_server();
        // base like http://127.0.0.1:PORT ; parse host and port out of it.
        let without_scheme = base.replace("http://", "");
        let (host, port) = match without_scheme.rfind(':') {
            Some(i) => without_scheme.split_at(i), // host="127.0.0.1", port=":58697"
            None => (without_scheme.as_str(), "0"),
        };
        let host = host.split('/').next().unwrap_or("127.0.0.1");
        let port = port.strip_prefix(':').unwrap_or("0");
        let urls = ["/modules/docs/index.html", "/modules/docs/office-preload.js", "/rhwp/office-preload.js"];
        let mut results = Vec::new();
        for u in urls {
            let req = format!("GET {} HTTP/1.1\r\nHost: {}\r\nConnection: close\r\n\r\n", u, host);
            if let Ok(mut s) = TcpStream::connect(format!("{}:{}", host, port)) {
                let _ = s.write_all(req.as_bytes());
                let mut buf = Vec::new();
                let _ = std::io::Read::read_to_end(&mut s, &mut buf);
                let text = String::from_utf8_lossy(&buf).into_owned();
                let status_ok = text.lines().next().map(|l| l.contains(" 200 ")).unwrap_or(false);
                let has_body = text.len() > 40;
                results.push((u.to_string(), status_ok, has_body));
            } else {
                results.push((u.to_string(), false, false));
            }
        }
        for (u, ok, body) in &results {
            assert!(ok, "server did not return 200 for {u}");
            assert!(body, "server returned empty body for {u}");
        }
    }

    /// The office preload bridge must be reachable from both the `/modules/`
    /// (docs/sheets/slides) and `/rhwp/` (hwp) URL prefixes, and the file must
    /// actually exist on disk where the static server serves from. This is the
    /// fix for the Tauri v2 preload gap: dynamically-created module windows have
    /// no preload-script mechanism, so the bridge is injected via a `<script>`
    /// tag in each module index.html.
    #[test]
    fn office_preload_served_from_both_prefixes() {
        for url in ["/modules/docs/office-preload.js", "/rhwp/office-preload.js"] {
            let path = resolve(url).unwrap_or_else(|| panic!("resolve {url}"));
            assert!(path.is_file(), "preload file {url} not found at {path:?}");
            let bytes = std::fs::read(&path).expect("read preload");
            assert!(contains(&bytes, b"window.desktop"), "preload {url} lacks polyfill");
            assert!(contains(&bytes, b"office_open"), "preload {url} lacks invoke");
        }
    }

    /// The served base for each module must resolve to an existing index.html
    /// under `<base>/index.html` — the `base_for` prefix must include the
    /// module's subdirectory (e.g. `/modules/docs`, not just `/modules`).
    #[test]
    fn base_for_points_to_existing_index() {
        for name in ["docs", "sheets", "slides", "hwp"] {
            let base = base_for(name);
            let url = format!("{base}/index.html");
            let path = resolve(&url).expect("resolved index.html");
            assert!(path.is_file(), "{url} not found at {path:?}");
        }
    }

    fn contains(haystack: &[u8], needle: &[u8]) -> bool {
        haystack
            .windows(needle.len())
            .any(|w| w == needle)
    }
}

