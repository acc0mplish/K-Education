#!/usr/bin/env python3
"""Poc: 로컬 시계로 만료 판정하는 대상의 Expiration 을 미래로 위조 (원리 시용).

🎓 교육용 · 본인 소유 앱/취약랩 대상. 배포용 크랙 아님.

원리: 설정/라이선스 파일에서 “만료 시점(Expiration)”을 스캔하고,
     이를 미래 날짜로 위조한 복사본을 생성한다. 실제 앱은 “로컬 시계 = 권위”
     결함으로 평가판이 활성화된다.
     (시스템 시계 회전은 격리 랩에서 운용자가 수동으로 — 이 PoC는 파일 위조만)

사용:
    python education/black_team/attacks/date_patch/poc_clock_rotate.py <own_file> --i-own-this

Ethics: --i-own-this 없으면 비-로컬 타겟 거부.
"""
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timedelta
from pathlib import Path

# far-future 로 간주되는 임계 (t_vuln_license_seafile 의 R2와 동일 기준)
FUTURE_CUTOFF = 2099
# 위조할 미래 시점 (실행일 + 10년)
SIM_FUTURE = datetime.now() + timedelta(days=10 * 365)


def scan_and_spoof(target: Path, *, i_own_this: bool) -> dict:
    if not i_own_this:
        raise PermissionError(
            "--i-own-this 어설션 필요 (본인 소유 앱/취약랩 대상). 비-로컬 타겟 거부."
        )
    text = target.read_text(encoding="utf-8", errors="replace")
    # “Expiration” 식별: 20xx-MM-DD, YYYYMMDD, Unix timestamp 등
    pat = re.compile(
        r"(?i)(expiration)\s*[:=]\s*('\"\s*)?"
        r"(20\d{2}-\d{2}-\d{2}|20\d{6}|\d{10,13})",
    )
    m = pat.search(text)
    if not m:
        return {
            "lane": "date_patch", "id": "S7", "check_bypassed": False,
            "severity": "info",
            "evidence": "Expiration field not found (no match)",
            "not_applicable": True,
        }

    future = SIM_FUTURE.strftime("%Y-%m-%d")
    patched = pat.sub(lambda mm: f"{mm.group(1)}{mm.group(2)}{future}", text, count=1)
    out = target.with_name(f"{target.name}.spoofed")
    out.write_text(patched, encoding="utf-8")

    return {
        "lane": "date_patch", "id": "S7", "check_bypassed": True,
        "severity": "high",
        "evidence": f"Expiration spoofed -> {future} (past the {FUTURE_CUTOFF} horizon)",
        "spoofed_file": str(out),
    }


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="date_patch PoC (owned/lab target)")
    ap.add_argument("target", help="본인 소유 타겟 설정/라이선스 파일")
    ap.add_argument("--i-own-this", action="store_true",
                    help="본인 소유/의도적 취약랩 어설션 (필수)")
    args = ap.parse_args(argv)

    target = Path(args.target)
    if not target.exists():
        print(f"error: {target} 없음")
        return 1

    res = scan_and_spoof(target, i_own_this=args.i_own_this)
    print(json.dumps(res, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
