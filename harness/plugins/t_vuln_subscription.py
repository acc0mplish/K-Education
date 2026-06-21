"""t_vuln_subscription — BLUE detector for subscription/license bypass (Lane 0, S1-S8).

Scans zip/asar/pe/elf for static signals that indicate a bypassable
subscription model. Reuses codebase_audit's scan shape (regex PATTERNS over
member/raw bytes) but with subscription-specific patterns.

Finding schema:
  {"id","signal","severity","match","file","remediation"}
"""
from __future__ import annotations
import re, zipfile
from pathlib import Path

# signal -> (regex, severity, S-vector id, D-remediation id)
_PATTERNS = [
    ("mock_endpoint", re.compile(rb"/api/subscription/mock-set", re.I),
     "high", "S4", "D5"),
    ("client_subscription_check",
     re.compile(rb"\b(?:SUBSCRIPTION_STATUS|SUBSCRIPTION_PLAN|isSubscribed|isPremium|hasSubscription|subscriptionActive)\b"),
     "med", "S1/S6", "D1"),
    ("client_license_check",
     re.compile(rb"\b(?:isLicensed|licenseValid|checkLicense|verifySubscription|isProUser)\b"),
     "med", "S1", "D1/D2"),
    ("plaintext_subscription_store",
     re.compile(rb"\b(?:subscription|premium|license|isPro)\s*[:=]\s*['\"]?(?:true|active|pro|1|premium)['\"]?", re.I),
     "med", "S3", "D3"),
    ("trial_expiry", re.compile(rb"\b(?:trialExpiresAt|trialEnd|freeTrial|trialDays)\b"),
     "low", "S7", "D3"),
    ("remote_subscription_endpoint",
     re.compile(rb"/api/(?:me|subscription/[\w-]+)", re.I),
     "low", "S4", "D4"),
]

MAX_MATCHES_PER_SIGNAL = 50


def _scan_bytes(name: str, data: bytes) -> list[dict]:
    out = []
    for signal, rx, sev, sid, did in _PATTERNS:
        hits = rx.findall(data)
        if not hits:
            continue
        seen, uniq = set(), []
        for h in hits[:MAX_MATCHES_PER_SIGNAL]:
            s = h.decode("latin1", "replace") if isinstance(h, (bytes, bytearray)) else h
            if s not in seen:
                seen.add(s)
                uniq.append(s)
        for m in uniq:
            out.append({"id": sid, "signal": signal, "severity": sev,
                        "match": m, "file": name, "remediation": did})
    return out


def _is_textish(data: bytes) -> bool:
    if data.lstrip().startswith((b"{", b"<", b"import", b"function", b"const", b"var", b"let", b"//")):
        return True
    return data.count(b"\x00") <= len(data) * 0.10


def scan(path: str) -> dict:
    p = Path(path)
    findings: list[dict] = []
    scanned = 0
    if zipfile.is_zipfile(p):
        with zipfile.ZipFile(p) as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue
                try:
                    data = zf.read(info)
                except (RuntimeError, zipfile.BadZipFile, OSError):
                    continue
                if not _is_textish(data):
                    continue
                scanned += 1
                findings.extend(_scan_bytes(info.filename, data[: 8 * 1024 * 1024]))
    else:
        with open(p, "rb") as f:
            data = f.read(64 * 1024 * 1024)
        if _is_textish(data):
            scanned = 1
            findings.extend(_scan_bytes(str(p), data))
    summary = {"high": 0, "med": 0, "low": 0}
    for f in findings:
        summary[f["severity"]] = summary.get(f["severity"], 0) + 1
    return {"target": str(p), "scannedMembers": scanned,
            "findings": findings, "summary": summary}
