#!/usr/bin/env python3
"""Poc: 약한 검증의 라이선스 파일을 위조/검증 우회 (원리 시용, generic).

🎓 교육용 · 본인 소유 앱/취약랩 대상. 배포용 크랙/keygen 아님.

원리: 라이선스 파일에서 “약한 검증 신호(weak hash / far-future / oversized)”를
     스캔한 뒤, 해당 스키마에 맞는 generic 위조 라이선스를 생성해 “검증 우회
 가능 여부”를 시연한다. 실제 상용 키 알고리즘은 재구현 대상이 아니라 시연용.

사용:
    python education/black_team/attacks/crack_license/poc_license_forgery.py <own_file> --i-own-this

Ethics: --i-own-this 없으면 비-로컬 타겟 거부.
"""
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timedelta
from pathlib import Path

# weak hash / fake 키 인디케이터 (t_vuln_license_seafile 의 패턴과 동형)
WEAK_MARKERS = re.compile(r"(?i)(test|sample|xxx|dummy|changeme)")
MAXUSERS_HUGE = re.compile(r"(?i)maxusers\s*[:=]\s*(\d{7,})")
FUTURE_EXP = re.compile(
    r"(?i)(expiration)\s*[:=]\s*(20[9]\d|2\d{3}-)",
)


def assess_license(text: str) -> list[str]:
    """약한 검증 신호를 반환 (탐지 지표)."""
    signals = []
    if WEAK_MARKERS.search(text):
        signals.append("weak_hash/fake_key")
    mm = MAXUSERS_HUGE.search(text)
    if mm:
        signals.append(f"maxusers_oversized={mm.group(1)}")
    if FUTURE_EXP.search(text):
        signals.append("expiration_farfuture")
    return signals


def forge_generic(target: Path, signals: list[str]) -> Path:
    """generic 위조 라이선스 스키마 생성 (실제 상용 키 아님)."""
    body = {
        "product": "DEMO_PRODUCT",
        "tier": "pro",
        "maxusers": 9999999,
        "expiration": (datetime.now() + timedelta(days=10 * 365)).strftime("%Y-%m-%d"),
        # weak_hash/fake_key 신호가 있으면 시제용 해시 시드 (실 키 아님)
        "hash": "demo_hash_seed",
        "signature": "DEMO_SIGNATURE_NOT_VALID",
    }
    out = target.with_name(f"{target.name}.forged")
    out.write_text(json.dumps(body, indent=2, ensure_ascii=False), encoding="utf-8")
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="crack_license PoC (owned/lab target)")
    ap.add_argument("target", help="본인 소유 타겟 라이선스/설정 파일")
    ap.add_argument("--i-own-this", action="store_true",
                    help="본인 소유/의도적 취약랩 어설션 (필수)")
    args = ap.parse_args(argv)

    target = Path(args.target)
    if not target.exists():
        print(f"error: {target} 없음")
        return 1

    if not args.i_own_this:
        print(json.dumps({
            "lane": "crack_license", "id": "S3", "check_bypassed": False,
            "severity": "info",
            "evidence": "--i-own-this 필요 (비-로컬 타겟 거부)",
        }, indent=2, ensure_ascii=False))
        return 0

    text = target.read_text(encoding="utf-8", errors="replace")
    signals = assess_license(text)
    if not signals:
        print(json.dumps({
            "lane": "crack_license", "id": "S3", "check_bypassed": False,
            "severity": "info",
            "evidence": "weak-validation signals not found (strong validation suspected)",
            "not_applicable": True,
        }, indent=2, ensure_ascii=False))
        return 0

    out = forge_generic(target, signals)
    print(json.dumps({
        "lane": "crack_license", "id": "S3", "check_bypassed": True,
        "severity": "high",
        "evidence": f"weak-validation signals {signals} -> forged generic license",
        "forged_file": str(out),
    }, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
