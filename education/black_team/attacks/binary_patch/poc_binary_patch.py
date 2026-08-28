#!/usr/bin/env python3
"""Poc: 정적 바이너리 패치로 라이선스 체크 플립 (원리 시용 PoC, generic).

🎓 교육용 · 본인 소유 앱/취약랩 대상. 배포용 크랙 아님.

원리: 타겟 이진/파일에서 “라이선스 체크 시그널”을 스캔한 뒤,
     해당 영역을 패치한 복사를 생성한다. 실제 크랙이 아니라 “패치 가능한가”를
     시연하는 generic 도구이다. 실제 OEP/함수 복원은 radare2/retdec/ghidra 로.

사용:
    python education/black_team/attacks/binary_patch/poc_binary_patch.py <own_file> --i-own-this

Ethics: --i-own-this 없으면 비-로컬 타겟 거부.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

# 시그널: “라이선스 체크”로 추정되는 문자열 마커 (generic 예시 패턴)
# 실제 프로덕션 마커는 radare2/strings 스캔으로 식별 후 이 리스트에 반영.
MARKERS = [
    rb"is_pro_version",
    rb"check_license",
    rb"SUBSCRIPTION_STATUS",
    rb"isSubscribed",
    rb"license_valid",
]


def scan_and_patch(target: Path, *, i_own_this: bool) -> dict:
    if not i_own_this:
        raise PermissionError(
            "--i-own-this 어설션 필요 (본인 소유 앱/취약랩 대상). 비-로컬 타겟 거부."
        )
    data = target.read_bytes()
    hits = [m.group(0).decode("ascii", "replace") for m in re.finditer(
        b"|".join(re.escape(mk) for mk in MARKERS), data)]
    if not hits:
        return {
            "lane": "binary_patch", "id": "S1", "check_bypassed": False,
            "severity": "info",
            "evidence": "license-check marker not found in target (no match)",
            "not_applicable": True,
        }

    # 원리 시연: 매칭된 마커를 “ patched ”표지로 대체하는 복사본 생성
    patched = data
    for mk in MARKERS:
        patched = re.sub(re.escape(mk), b"PATCHED__CHECK_BYPASSED", patched)

    out = target.with_name(f"{target.name}.patched")
    out.write_bytes(patched)

    return {
        "lane": "binary_patch", "id": "S1", "check_bypassed": True,
        "severity": "high",
        "evidence": f"marker(s) found + patched copy written: {sorted(set(hits))}",
        "patched_file": str(out),
    }


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="binary_patch PoC (owned/lab target)")
    ap.add_argument("target", help="본인 소유 타겟 이진/파일 경로")
    ap.add_argument("--i-own-this", action="store_true",
                    help="본인 소유/의도적 취약랩 어설션 (필수)")
    args = ap.parse_args(argv)

    target = Path(args.target)
    if not target.exists():
        print(f"error: {target} 없음")
        return 1

    res = scan_and_patch(target, i_own_this=args.i_own_this)
    print(json.dumps(res, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
