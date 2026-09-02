"""YARA scan (report §4.2 / §4.7). In-process yara-python.

Rules dir: tools/yara_rules/. Missing rules → execution_failed (mirrors the
capa rule-path problem in report §13.3).
"""
from __future__ import annotations
import json
from pathlib import Path

from plugins.base import register, _ok, _fail, _write_evidence

RULES_DIR = Path(__file__).resolve().parents[2] / "tools" / "yara_rules"


@register("t_yara")
def run(tool, target_path, runner, force_skip=False):
    if force_skip:
        return _fail(tool, "skipped by strategy")
    try:
        import yara
    except ImportError:
        return _fail(tool, "yara-python not installed")

    index = RULES_DIR / "index.yar"
    if not index.exists():
        return _fail(tool, f"rules missing: {index} (populate tools/yara_rules)")

    try:
        rules = yara.compile(filepath=str(index))
    except Exception as e:  # noqa: BLE001
        return _fail(tool, f"rule compile error: {e!r}")

    matches = rules.match(target_path)
    found = []
    for m in matches:
        found.append({"rule": m.rule, "tags": list(m.tags), "namespace": m.namespace})
    report = {"matchCount": len(found), "matches": found,
              "note": "0 matches = no mining/keylogger/backdoor indicators (report §4.7)"}
    out = json.dumps(report, indent=2, ensure_ascii=False).encode("utf-8")
    _write_evidence(runner, tool, out)
    return _ok(tool, out, message=f"{len(found)} yara matches", matchCount=len(found))
