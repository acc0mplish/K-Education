"""Per-section entropy (report §4.3.1). In-process; flags packed (>7.8) regions.

Reproduces the entropy calc that debunked DIE's 'packed' heuristic for the
183MB Electron PE.
"""
from __future__ import annotations
import json
import math

from plugins.base import register, _ok, _fail, _write_evidence


def _entropy(data: bytes) -> float:
    if not data:
        return 0.0
    counts = [0] * 256
    for b in data:
        counts[b] += 1
    n = len(data)
    e = 0.0
    for c in counts:
        if c:
            p = c / n
            e -= p * math.log2(p)
    return round(e, 3)


@register("t_entropy")
def run(tool, target_path, runner, force_skip=False):
    if force_skip:
        return _fail(tool, "skipped by strategy")
    try:
        import pefile
    except ImportError:
        return _fail(tool, "pefile not installed")

    try:
        pe = pefile.PE(target_path, fast_load=True)
    except Exception as e:  # noqa: BLE001
        # not a PE — compute whole-file entropy instead
        try:
            raw = open(target_path, "rb").read(64 * 1024 * 1024)
            ent = _entropy(raw)
            out = json.dumps({"wholeFileSampleEntropy": ent, "note": "non-PE, sampled 64MB"},
                             indent=2).encode()
            _write_evidence(runner, tool, out)
            return _ok(tool, out, message=f"whole-file entropy={ent}")
        except OSError as oe:
            return _fail(tool, f"cannot read: {oe!r}")

    sections = []
    any_packed = False
    for s in pe.sections:
        try:
            raw = s.get_data()
        except Exception:  # noqa: BLE001
            raw = b""
        e = _entropy(raw[: 16 * 1024 * 1024])  # cap per-section sample
        packed = e >= 7.8
        any_packed = any_packed or packed
        sections.append({
            "name": s.Name.rstrip(b"\x00").decode("latin1", "replace"),
            "entropy": e, "rawSize": s.SizeOfRawData,
            "packedHeuristic": packed,
        })
    report = {
        "sections": sections,
        "anyPackedHeuristic": any_packed,
        "note": ">=7.8 raises packed heuristic; verify with DIE/imports (report §12.4)",
    }
    out = json.dumps(report, indent=2, ensure_ascii=False).encode("utf-8")
    _write_evidence(runner, tool, out)
    return _ok(tool, out, message=f"{len(sections)} sections, packedHeuristic={any_packed}",
               anyPacked=any_packed)
