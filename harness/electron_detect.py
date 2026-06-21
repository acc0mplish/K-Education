"""Electron detection + business-logic scanner (the novel lane).

Report §10/§12.2: for Electron apps the real business logic lives in app.asar
JS, not the 183MB V8 PE. This module:
  - finds app.asar (inside zip, loose, or sibling to a PE)
  - extracts it (reuses scripts/asar_extract header parse)
  - scans JS/CJS for business-logic patterns (DAF_* env, /api endpoints, IPC,
    child_process, auto-update, remote-mgmt, eval, remote URLs, integrity)
  - detects "Electron PE" (V8 shell) so heavy PE decompilers can be deferred
"""
from __future__ import annotations
import os, re, sys, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE.parent / "scripts") not in sys.path:
    sys.path.insert(0, str(HERE.parent / "scripts"))
import asar_extract  # noqa: E402  (header parse + walk)

# business-logic patterns (report §5 endpoints, §6 updater, §7 remote-mgmt, §12.6 env)
PATTERNS = {
    "daf_env": re.compile(rb"\bDAF_(API_BASE|API_TOKEN|PROGRAM_ID|SUBSCRIPTION_PLAN|SUBSCRIPTION_STATUS|REMOTE_COMMAND_ID|AUTO_RUN_SETTINGS_PATH)\b"),
    "api_endpoint": re.compile(rb"/api/[a-zA-Z0-9_/{}.-]+"),
    "ipc": re.compile(rb"(?:ipcMain\.(?:handle|on)|ipcRenderer\.(?:invoke|send|on))\s*[\(\.][\"'`]([^\"'`]+)"),
    "child_process": re.compile(rb"(?:child_process|require\(['\"]child_process|spawn\(|execFile\(|\.fork\(|powershell|cmd\.exe|ExecutionPolicy\s+Bypass|-NoProfile)", re.I),
    "auto_update": re.compile(rb"(?:downloadBufferWithProgress|apply-launcher-update|Expand-Archive|compareVersions|artifact_url|launcher/release)", re.I),
    "remote_mgmt": re.compile(rb"(?:enableRemote|disableRemote|remoteRunningCommands|deviceSecret|safeStorage|/remote/devices/register|/remote/devices/heartbeat|/remote/commands/update|/remote/uploads/file)", re.I),
    "eval": re.compile(rb"\b(?:eval|new\s+Function)\s*\("),
    "remote_url": re.compile(rb"https?://[a-zA-Z0-9._:-]+"),
    "integrity": re.compile(rb"(?:createHash|sha256|assertUnderRoot|assertUnderLauncherUpdateRoot)", re.I),
    "electron_marker": re.compile(rb"(?:app\.asar|BrowserWindow|electron|preload\.cjs|contextBridge)", re.I),
}

# endpoints that matter even as plain strings (dedup'd)
KEEP_ENDPOINTS = {
    "/api/auth/login", "/api/auth/signup", "/api/me", "/api/programs",
    "/api/launcher/release", "/api/runtime", "/api/notices",
    "/api/remote/devices/register", "/api/remote/devices/heartbeat",
    "/api/remote/commands/update", "/api/remote/uploads/file",
    "/api/subscription/mock-set",
}


def find_asar_in_zip(zip_path: str):
    """Return list of zip members ending with app.asar."""
    out = []
    try:
        zf = zipfile.ZipFile(zip_path)
        for n in zf.namelist():
            if n.endswith("app.asar"):
                out.append(n)
    except (zipfile.BadZipFile, OSError):
        pass
    return out


def is_electron_pe(pe_path: str) -> bool:
    """Detect Electron V8 shell: sibling resources/app.asar, or app.asar/electron strings."""
    p = Path(pe_path)
    for cand in (p.parent / "resources" / "app.asar", p.parent / "app.asar"):
        if cand.exists():
            return True
    # sniff first 4MB for markers
    try:
        with open(pe_path, "rb") as f:
            head = f.read(4 * 1024 * 1024)
        return bool(PATTERNS["electron_marker"].search(head))
    except OSError:
        return False


def detect_electron(path: str, profile: str):
    """Return list of (asar_path_or_zip_member, kind) reachable from target.
    kind: 'asar' (file) | 'zip' (member inside zip)."""
    hits = []
    if profile == "asar":
        hits.append((path, "asar"))
    elif profile == "zip":
        for m in find_asar_in_zip(path):
            hits.append((m, "zip"))
    elif profile == "pe":
        # sibling asar
        p = Path(path)
        for cand in (p.parent / "resources" / "app.asar", p.parent / "app.asar"):
            if cand.exists():
                hits.append((str(cand), "asar"))
    return hits


def _scan_bytes(data: bytes):
    found = {}
    for cat, rx in PATTERNS.items():
        m = rx.findall(data)
        if m:
            vals = []
            for h in m:
                s = h.decode("latin1", "replace") if isinstance(h, (bytes, bytearray)) else h
                if s not in vals:
                    vals.append(s)
            found[cat] = vals[:50]
    return found


def scan_asar(asar_path: str, extract_dir: str):
    """Parse asar header, scan each JS/CJS/JSON member, return business-logic map."""
    header, body_offset_or_err, size, _ = asar_extract.parse_header(asar_path)
    if isinstance(body_offset_or_err, str):
        return {"error": body_offset_or_err}
    files = list(asar_extract.walk(header))
    js_files = [f for f in files if f[0].split(".")[-1] in ("js", "cjs", "mjs", "json", "html")]
    summary = {cat: [] for cat in PATTERNS}
    per_file = []
    with open(asar_path, "rb") as f:
        for name, entry in js_files:
            if entry.get("unpacked"):
                continue
            try:
                off = body_offset_or_err + int(entry["offset"])
                f.seek(off)
                data = f.read(int(entry["size"]))
            except (KeyError, ValueError, OSError):
                continue
            found = _scan_bytes(data)
            if found:
                # only keep ipc endpoint captures (group 1), not full matches
                if "ipc" in found:
                    found["ipc"] = [x for x in found["ipc"] if x and not x.startswith("ipc")]
                per_file.append({"file": name, "size": len(data), "findings": found})
                for cat, vals in found.items():
                    for v in vals:
                        if v not in summary[cat]:
                            summary[cat].append(v)
    # endpoints: intersect with known-important + keep found
    found_eps = set(summary.get("api_endpoint", [])) | set(summary.get("remote_mgmt", []))
    known_hit = sorted(e for e in KEEP_ENDPOINTS if any(e in s for s in found_eps))
    return {
        "asar": asar_path, "size": size, "fileCount": len(files),
        "scannedJsFiles": len(js_files),
        "filesWithFindings": len(per_file),
        "summary": {k: v for k, v in summary.items() if v},
        "knownEndpointsHit": known_hit,
        "perFile": per_file[:50],
    }


def extract_zip_asar(zip_path: str, member: str, out_dir: str) -> str:
    """Extract a zip member (app.asar) to out_dir; return extracted asar path."""
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    dst = Path(out_dir) / Path(member).name
    with zipfile.ZipFile(zip_path) as zf, open(dst, "wb") as f:
        f.write(zf.read(member))
    return str(dst)
