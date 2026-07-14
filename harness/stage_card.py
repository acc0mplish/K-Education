#!/usr/bin/env python3
"""AI stage-card generator (report §14.3 #6).

Emits a token-efficient JSON "stage card" for LLM context injection at each
stage: platform + target profile + catalog summary + coverage booleans +
remaining checklist (failed/timeout/manual) + a retry plan + next steps.

Token-light by design (keys short, values deduped) so it fits a system prompt.
"""
from __future__ import annotations
import json
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent


def build(target_name: str, evdir: Path, catalog_path: str) -> dict:
    cov = json.loads((evdir / "coverage.json").read_text(encoding="utf-8"))
    cat = json.loads(Path(catalog_path).read_text(encoding="utf-8"))
    meta = cov["meta"]["target"]

    by_tier = Counter(t["tier"] for t in cat["tools"])
    failed = cov.get("failedToolIDs", [])
    timeout = cov.get("timeoutToolIDs", [])
    manual = [r["toolID"] for r in cov["rows"]
              if r["executionStatus"] == "manual_install"]

    retry = []
    for t in timeout:
        retry.append({"tool": t, "status": "timeout", "action": "probe-first → long → artifact-only fallback"})
    for t in failed:
        if t not in timeout:
            retry.append({"tool": t, "status": "failed", "action": "root-cause (path/install/rules) then re-run"})

    next_steps = []
    if not cov["canClaimFullCoverage"]:
        next_steps.append("close remaining non-terminal tools (skipped/manual)")
    if failed or timeout:
        next_steps.append("resolve retry plan above, re-run analyze")
    next_steps.append(f"render report: `main.py report {target_name}`")
    if meta["profile"] in ("pe", "elf") and not timeout:
        next_steps.append("dynamic lane if applicable (dynamic <target> --run)")

    return {
        "stage": "post-analyze",
        "platform": _platform_label(),
        "target": {"path": meta["path"], "profile": meta["profile"],
                   "size": meta["size"]},
        "catalog": {"total": len(cat["tools"]), "byTier": dict(by_tier)},
        "coverage": {
            "fullCoverage": cov["canClaimFullCoverage"],
            "allSucceeded": cov["canClaimAllToolsSucceeded"],
            "executed": cov["executedCount"], "notApplicable": cov["notApplicableCount"],
            "failed": cov["failedCount"], "timeout": cov["timeoutCount"],
        },
        "remaining": {"failed": failed, "timeout": timeout, "manual": manual},
        "retryPlan": retry,
        "nextSteps": next_steps,
    }


def _platform_label() -> str:
    try:
        import platselect
        return platselect.catalog_label()
    except Exception:  # noqa: BLE001
        return "unknown"


def render(target_name: str, evdir: Path, catalog_path: str) -> Path:
    card = build(target_name, evdir, catalog_path)
    out = evdir / "stage_card.json"
    out.write_text(json.dumps(card, indent=2, ensure_ascii=False), encoding="utf-8")
    return out
