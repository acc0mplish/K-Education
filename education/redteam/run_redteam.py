#!/usr/bin/env python3
"""RED orchestrator — runs registered RED PoCs against an owned target and
writes evidence/<target>/red_findings.json for the unified security report.

Ethics: owned / intentionally-vulnerable lab only. Passes i_own_this through.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

EDU = Path(__file__).resolve().parent.parent  # education/
if str(EDU) not in sys.path:
    sys.path.insert(0, str(EDU))

from redteam.subscription.s4_mock_endpoint import probe as s4_probe

# Registry of (id, callable(target, i_own_this, timeout) -> finding dict)
RED_MODULES = [
    ("S4", s4_probe),
]


def run(target: str, *, i_own_this: bool, evidence_dir: Path,
        timeout: float = 5.0) -> Path:
    findings = []
    for _id, fn in RED_MODULES:
        try:
            f = fn(target, i_own_this=i_own_this, timeout=timeout)
            if isinstance(f, dict):
                findings.append(f)
        except Exception as e:  # one PoC failing must not abort the run
            findings.append({"id": _id, "confirmed": False,
                             "evidence": f"runner error: {e!r}", "severity": "info"})
    evidence_dir = Path(evidence_dir)
    evidence_dir.mkdir(parents=True, exist_ok=True)
    out = evidence_dir / "red_findings.json"
    out.write_text(json.dumps(
        {"target": target, "findings": findings, "generatedVia": "run_redteam"},
        indent=2, ensure_ascii=False), encoding="utf-8")
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="RED orchestrator (owned/lab target)")
    ap.add_argument("target", help="base URL or path of owned target")
    ap.add_argument("--evidence-dir", default=None,
                    help="output dir (default: evidence/<safe-name>/)")
    ap.add_argument("--i-own-this", action="store_true")
    ap.add_argument("--timeout", type=float, default=5.0)
    args = ap.parse_args(argv)
    ev = Path(args.evidence_dir) if args.evidence_dir else (
        Path(__file__).resolve().parents[2] / "evidence" /
        args.target.replace("/", "_").replace(":", "_")[:80])
    out = run(args.target, i_own_this=args.i_own_this,
              evidence_dir=ev, timeout=args.timeout)
    print(f"red findings -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
