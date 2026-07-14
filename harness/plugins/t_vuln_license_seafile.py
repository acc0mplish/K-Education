"""t_vuln_license_seafile — BLUE detector for Seafile Pro license/subscription
bypass (Lane 0, S1-S8 + R1-R6 robustness).

Defensive static detector. Scans a Seafile install tree (extracted dir or zip)
for signals that the Pro license/subscription enforcement has been bypassed,
weakened, or is misconfigured. Mirrors t_vuln_subscription's scan shape.

What it flags (all DEFENSIVE — detects a cracked/weak instance, never a crack):
  - forged/manipulated seafile-license.txt (huge MaxUsers, far-future Expiration,
    Hash/LicenceKEY algorithm or shape anomalies)
  - patched gates: user_number_over_limit / is_pro_version returning a hardcoded
    constant (S1/S6 patch signature)
  - IS_PRO_VERSION settings override enabled (S6 backdoor)
  - fail-open `except: return False` in user_number_over_limit (R1 robustness)
  - absence of Expiration enforcement in Python layer (R2)
  - ELF binaries under seafile/bin (ccnet/seaf-server) — for hash-based integrity
    comparison against a known-good baseline (caller-supplied)

Finding schema (same as t_vuln_subscription):
  {"id","signal","severity","match","file","remediation"}
"""
from __future__ import annotations
import re
import zipfile
from pathlib import Path

# signal -> (regex over file CONTENT bytes, severity, S/R id, remediation id)
_PY_PATTERNS = [
    # R1/S1 — fail-open or hardcoded bypass in the user-limit gate
    ("user_limit_fail_open",
     re.compile(rb"def user_number_over_limit[\s\S]{0,1600}?except\s+Exception[\s\S]{0,120}?return\s+False"),
     "high", "R1/S1", "L-D1"),
    ("user_limit_hardcoded_false",
     re.compile(rb"def user_number_over_limit[\s\S]{0,1600}?\breturn\s+False\b"),
     "med", "S1", "L-D1"),
    # S1/S6 — is_pro_version forced True
    ("is_pro_hardcoded_true",
     re.compile(rb"def\s+is_pro_version\s*\([^)]*\)\s*(?:->[^:]+)?:\s*\n(?:[ \t]*#.*)?\s*return\s+(?:True|1)\b"),
     "high", "S1/S6", "L-D4"),
    # S6 — DEBUG IS_PRO_VERSION override present
    ("is_pro_debug_override",
     re.compile(rb"IS_PRO_VERSION['\"]?\s*[:=]\s*(?:True|1)\b"),
     "med", "S6/R5", "L-D5"),
    # S4-NA marker / sanity — remote subscription endpoint (should be absent)
    ("remote_subscription_endpoint",
     re.compile(rb"/api/(?:subscription|license)/(?:mock|set)", re.I),
     "med", "S4", "L-D6"),
    # S1/S6 — scattered Pro gates (informational; 56 call sites is the surface)
    ("pro_feature_gate_call",
     re.compile(rb"\bis_pro_version\s*\("),
     "low", "S1/S6", "L-D4"),
]

# License-file content signals (key=value text). high = strong forge indicator.
_LIC_PATTERNS = [
    # S5/S3 — absurd MaxUsers (forge indicator)
    ("license_maxusers_huge",
     re.compile(rb"MaxUsers\s*=\s*['\"]?(\d{7,})['\"]?"),
     "high", "S5/S3", "L-D3/L-D8"),
    # S7 — far-future expiration (>= 2099) or suspiciously round date
    ("license_expiration_farfuture",
     re.compile(rb"Expiration\s*=\s*['\"]?(20[9]\d|2\d{3}-)", re.I),
     "med", "S7/S5", "L-D2/L-D8"),
    # S5 — weak/missing Hash or LicenceKEY
    ("license_weak_hash",
     re.compile(rb"(?:Hash|LicenceKEY)\s*=\s*['\"]?(\s{0,3}|0{3,}|test|sample|xxx)['\"]?", re.I),
     "high", "S5", "L-D3"),
    # R2 — Expiration field present but Python layer ignores it (informational)
    ("license_has_expiration",
     re.compile(rb"Expiration\s*=", re.I),
     "low", "R2", "L-D2"),
]

MAX_MATCHES_PER_SIGNAL = 50
# Files whose content we inspect for python/license signals.
_PY_FILES_RE = re.compile(r"(licenseparse\.py|/utils/__init__\.py|settings\.py|license\.py|seafevents_api\.py)$")
_LIC_FILES_RE = re.compile(r"seafile-license\.txt$")
# ELF binaries we surface for integrity baseline (we do NOT hash-check without a
# known-good manifest; we just report presence so an operator can diff).
_ELF_RE = re.compile(r"(^|/)(seafile/bin/)?(seaf-server|fileserver|seafile-controller|ccnet-server|seaf-fsck|seafserv-gc)$")


def _decode(h) -> str:
    return h.decode("latin1", "replace") if isinstance(h, (bytes, bytearray)) else str(h)


def _scan_text(name: str, data: bytes, patterns) -> list[dict]:
    out = []
    for signal, rx, sev, sid, did in patterns:
        hits = rx.findall(data)
        if not hits:
            continue
        seen, uniq = set(), []
        for h in hits[:MAX_MATCHES_PER_SIGNAL]:
            s = _decode(h)
            # for tuple-group regexes, flatten
            key = s if isinstance(s, str) else str(s)
            if key not in seen:
                seen.add(key)
                uniq.append(key)
        for m in uniq:
            out.append({"id": sid, "signal": signal, "severity": sev,
                        "match": m, "file": name, "remediation": did})
    return out


def _is_textish(data: bytes) -> bool:
    if data.lstrip().startswith((b"{", b"<", b"import", b"function", b"const", b"var", b"let", b"//", b"#", b"Name=", b"MaxUsers")):
        return True
    return data.count(b"\x00") <= len(data) * 0.10


def _iter_members(path: Path):
    """Yield (name, data) over files of interest in a dir tree or a zip."""
    if path.is_dir():
        for p in path.rglob("*"):
            if not p.is_file():
                continue
            n = str(p)
            if not (_PY_FILES_RE.search(n) or _LIC_FILES_RE.search(n) or _ELF_RE.search(n)):
                continue
            try:
                with open(p, "rb") as fh:
                    data = fh.read(8 * 1024 * 1024)
            except OSError:
                continue
            yield n, data
    elif zipfile.is_zipfile(path):
        with zipfile.ZipFile(path) as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue
                n = info.filename
                if not (_PY_FILES_RE.search(n) or _LIC_FILES_RE.search(n) or _ELF_RE.search(n)):
                    continue
                try:
                    data = zf.read(info)
                except (RuntimeError, zipfile.BadZipFile, OSError):
                    continue
                yield n, data
    else:
        # single file target
        try:
            with open(path, "rb") as fh:
                yield str(path), fh.read(8 * 1024 * 1024)
        except OSError:
            return


def scan(path: str) -> dict:
    p = Path(path)
    findings: list[dict] = []
    scanned = 0
    elf_seen: list[str] = []

    for name, data in _iter_members(p):
        scanned += 1
        if _LIC_FILES_RE.search(name):
            findings.extend(_scan_text(name, data, _LIC_PATTERNS))
        if _PY_FILES_RE.search(name) and _is_textish(data):
            findings.extend(_scan_text(name, data, _PY_PATTERNS))
        if _ELF_RE.search(name):
            # ELF presence — record for operator integrity diff (no auto-hash check
            # without a known-good baseline; avoids false positives).
            if data[:4] == b"\x7fELF":
                elf_seen.append(name)
            findings.append({"id": "S1/S2", "signal": "elf_binary_present",
                             "severity": "info", "match": name,
                             "file": name, "remediation": "L-D7/L-D8"})

    if elf_seen:
        findings.append({"id": "S1/S2", "signal": "elf_integrity_check_pending",
                         "severity": "low", "match": f"{len(elf_seen)} ELF daemons",
                         "file": "seafile/bin", "remediation": "L-D7/L-D8"})

    summary = {"high": 0, "med": 0, "low": 0, "info": 0}
    for f in findings:
        summary[f["severity"]] = summary.get(f["severity"], 0) + 1
    return {"target": str(p), "scannedMembers": scanned,
            "elfBinaries": elf_seen,
            "findings": findings, "summary": summary}


from plugins.base import register, _ok, _write_evidence, register_applicability_na  # noqa: E402
from states import ExecutionStatus  # noqa: E402
from runner import RunResult  # noqa: E402

# Directory tree (Seafile install), zip, pe, elf. Dir handling is Seafile-specific.
_APPLICABLE = {"zip", "pe", "elf", "directory"}


@register("t_vuln_license_seafile")
def run(tool, target_path, runner, force_skip=False):
    if tool.target_profiles and not any(
        p in _APPLICABLE for p in tool.target_profiles
    ):
        return register_applicability_na(tool)
    import json
    report = scan(target_path)
    stdout = json.dumps(report, indent=2, ensure_ascii=False).encode("utf-8")
    _write_evidence(runner, tool, stdout)
    return _ok(tool, stdout,
               message=f"vuln_license_seafile: {len(report['findings'])} findings "
                       f"(high={report['summary']['high']}, med={report['summary']['med']}, "
                       f"low={report['summary']['low']}, info={report['summary']['info']})",
               findingsCount=len(report["findings"]),
               findingsSummary=report["summary"])
