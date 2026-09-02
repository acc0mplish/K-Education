#!/usr/bin/env python3
"""codebase_audit — static JS/source audit for asar/zip (report §4.4, §12.6).

Run as a standalone script (generic_cli): python3 codebase_audit.py <target>
Scans text-like members for:
  - DAF_* environment variables (report §12.6)
  - API endpoints /api/... (report §5)
  - dangerous APIs: eval, child_process spawn, PowerShell ExecutionPolicy Bypass
  - remote URLs (http(s)://)
  - credential storage markers (safeStorage, token)
Outputs JSON findings to stdout.
"""
from __future__ import annotations
import json
import re
import sys
import zipfile

PATTERNS = {
    "daf_env": re.compile(rb"\bDAF_(API_BASE|API_TOKEN|PROGRAM_ID|SUBSCRIPTION_PLAN|SUBSCRIPTION_STATUS|REMOTE_COMMAND_ID|AUTO_RUN_SETTINGS_PATH)\b"),
    "api_endpoint": re.compile(rb"/api/[a-zA-Z0-9_/{}.-]+"),
    "powershell_bypass": re.compile(rb"ExecutionPolicy\s+Bypass", re.I),
    "child_process": re.compile(rb"(child_process|spawn|execFile|exec\()", re.I),
    "eval": re.compile(rb"\beval\s*\("),
    "remote_url": re.compile(rb"https?://[a-zA-Z0-9._/-]+"),
    "safe_storage": re.compile(rb"safeStorage", re.I),
}

MAX_PER_FILE = 200  # cap matches per file to bound output


def _scan_bytes(name: str, data: bytes) -> dict:
    findings = {}
    for key, rx in PATTERNS.items():
        hits = rx.findall(data)
        if hits:
            uniq = []
            seen = set()
            for h in hits[:MAX_PER_FILE]:
                s = h.decode("latin1", "replace") if isinstance(h, bytes) else h
                if s not in seen:
                    seen.add(s)
                    uniq.append(s)
            findings[key] = uniq
    return {"file": name, "size": len(data), "findings": findings} if findings else None


def audit_zip(path: str):
    results = []
    try:
        zf = zipfile.ZipFile(path)
    except (zipfile.BadZipFile, OSError) as e:
        return {"error": f"not a zip: {e!r}"}
    for info in zf.infolist():
        if info.is_dir():
            continue
        try:
            data = zf.read(info)
        except (RuntimeError, zipfile.BadZipFile, OSError):
            continue
        # skip obviously binary blobs
        if data.count(b"\x00") > len(data) * 0.1 and not data.lstrip().startswith((b"{", b"<", b"import", b"function")):
            continue
        r = _scan_bytes(info.filename, data[: 4 * 1024 * 1024])
        if r:
            results.append(r)
    return {"target": path, "scannedMembers": len(zf.namelist()),
            "filesWithFindings": len(results), "results": results}


def audit_raw(path: str):
    """Fallback: scan raw bytes (works for asar blobs too)."""
    data = open(path, "rb").read(64 * 1024 * 1024)
    r = _scan_bytes(path, data)
    return {"target": path, "mode": "raw_scan", "result": r}


def main(path: str) -> int:
    if path.lower().endswith(".zip"):
        report = audit_zip(path)
    else:
        report = audit_raw(path)
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: codebase_audit.py <target>", file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
