#!/usr/bin/env python3
"""Black orchestrator — registered Black PoC 를 owned/target 에서 순회 실행하고
evidence/<target>/black_findings.json 을 쓴다 (run_redteam.py 와 동형).

🎓 교육용 ·본인 소유/의도적 취약랩 대상. 배포용 무기화 아님.

Black Team = 라이선스 무력화 특화 공격 arm (binary_patch/date_patch/crack_license/
circumvent). 각 PoC 는 --i-own-this 가 없으면 비-로컬 타겟을 거부한다.

사용:
    python education/black_team/black_runner.py <own_target> --i-own-this

Ethics: 본인 소유 앱·취약랩 대상 · 타인 시스템 공격 금지 · 배포용 크랙 미제공.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

BT = Path(__file__).resolve().parent  # education/black_team/

# lane: (id, PoC 상대경로) — PoC 스코어(JSON check_bypassed)를 모은다
LANES = [
    ("S1", "attacks/binary_patch/poc_binary_patch.py"),
    ("S7", "attacks/date_patch/poc_clock_rotate.py"),
    ("S3", "attacks/crack_license/poc_license_forgery.py"),
    ("S3", "attacks/crack_license/poc_seafile_license.py"),   # Seafile Pro 라이선스 (crack_license)
    ("S5", "attacks/crack_license/poc_defguard_license_forgery.py"),  # DefGuard 위조 (crack_license)
    ("S6", "attacks/circumvent/poc_circumvent.py"),
]


def run_lane(target: str, poc_rel: str, *, i_own_this: bool) -> dict:
    poc = (BT / poc_rel).resolve()
    cmd = [sys.executable, str(poc), target]
    if i_own_this:
        cmd.append("--i-own-this")
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        # PoC가 --i-own-this 없이 실행되면 (비-로컬 거부) info 스코어로 흡수
        return {"id": None, "lane": poc_rel.split("/")[1], "confirmed": False,
                "severity": "info", "evidence": f"{poc.name} skipped/run error: {proc.stderr.strip()}"}
    try:
        score = json.loads(proc.stdout)
    except json.JSONDecodeError as e:
        return {"id": None, "lane": poc_rel.split("/")[1], "confirmed": False,
                "severity": "info", "evidence": f"{poc.name} bad JSON: {e}"}
    score.setdefault("id", None)
    score["confirmed"] = bool(score.get("check_bypassed", False))
    return score


def run(target: str, *, i_own_this: bool) -> Path:
    findings = []
    for lane_id, poc_rel in LANES:
        score = run_lane(target, poc_rel, i_own_this=i_own_this)
        score["id"] = lane_id                       # S1/S7/S3/S6
        score.setdefault("lane", poc_rel.split("/")[1])
        findings.append(score)

    safe = str(target).replace("/", "_").replace(":", "_")[:80]
    evidence = Path(__file__).resolve().parents[2] / "evidence" / safe
    evidence.mkdir(parents=True, exist_ok=True)
    out = evidence / "black_findings.json"
    payload = {
        "target": str(target),
        "findings": findings,
        "summary": {
            "check_bypassed": sum(1 for f in findings if f.get("confirmed")),
            "lanes_tried": len(LANES),
        },
        "generatedVia": "black_runner",
    }
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Black orchestrator (owned/lab target)")
    ap.add_argument("target", help="본인 소유 타겟 (이진/설정/라이선스 파일)")
    ap.add_argument("--i-own-this", action="store_true",
                    help="본인 소유/의도적 취약랩 어설션 (필수)")
    args = ap.parse_args(argv)

    target = Path(args.target)
    if not target.exists():
        print(f"error: {target} 없음")
        return 1

    out = run(target, i_own_this=args.i_own_this)
    payload = json.loads(out.read_text(encoding="utf-8"))
    print(f"black findings -> {out}")
    print(f"  check_bypassed: {payload['summary']['check_bypassed']}/{payload['summary']['lanes_tried']} lanes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
