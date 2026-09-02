#!/usr/bin/env python3
"""Poc: 로컬 피처게이트(플래그/환경변수) 우회 (원리 시용, generic).

🎓 교육용 · 본인 소유 앱/취약랩 대상. 배포용 무기화 아님.

원리: 타겟이 “로컬 플래그/환경변수”로 기능을 활성화할 때, 그 로컬 상태를 위조해
     서버 재검증 없이 기능을 회피한다. 실제 앱의 동적 훅은 frida 로 (격리 랩).

사용:
    python education/black_team/attacks/circumvent/poc_circumvent.py <own_file> --i-own-this

Ethics: --i-own-this 없으면 비-로컬 타겟 거부.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

# 로컬 게이트로 추정되는 플래그/환경변수 마커 (generic 시제)
GATE_MARKERS = re.compile(
    rb"(?i)(flag[_-]?premium|flag[_-]?pro|demo[_-]?mode|is[_-]?pro|beta[_-]?access|"
    rb"(?:env|os)[.-](?:getenv|environ))\s*[:=]?\s*(true|1|on|yes)",
)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="circumvent PoC (owned/lab target)")
    ap.add_argument("target", help="본인 소유 타겟 파일/설정")
    ap.add_argument("--i-own-this", action="store_true",
                    help="본인 소유/의도적 취약랩 어설션 (필수)")
    args = ap.parse_args(argv)

    target = Path(args.target)
    if not target.exists():
        print(f"error: {target} 없음")
        return 1

    if not args.i_own_this:
        print(json.dumps({
            "lane": "circumvent", "id": "S6", "check_bypassed": False,
            "severity": "info",
            "evidence": "--i-own-this 필요 (비-로컬 타겟 거부)",
        }, indent=2, ensure_ascii=False))
        return 0

    data = target.read_bytes()
    hits = sorted({m.group(0).decode("ascii", "replace").strip()
                   for m in GATE_MARKERS.finditer(data)})
    if not hits:
        print(json.dumps({
            "lane": "circumvent", "id": "S6", "check_bypassed": False,
            "severity": "info",
            "evidence": "local feature-gate marker not found (no client-side trust)",
            "not_applicable": True,
        }, indent=2, ensure_ascii=False))
        return 0

    print(json.dumps({
        "lane": "circumvent", "id": "S6", "check_bypassed": True,
        "severity": "high",
        "evidence": (f"local gate(s) found -> client-state spoof bypass: {hits}"),
    }, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
