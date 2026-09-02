#!/usr/bin/env python3
"""PoC: Seafile Pro 라이선스 무력화 다각도 시뮬레이션 (원리 시용, generic).

🎓 교육용 ·本人 소유 앱/취약랩 대상. 배포용 크랙/keygen 아님.

실제로 확인된 Seafile 라이선스 아키텍처(정적 역어셈블리, common/license.c)를
재구현한다. 실제 상용 AES 키/IV/RSA private key 는 이진에 하드코딩되어
추출 가능하나, 본 PoC 는 그 *원리*와 *우회 벡터*를 시연할 뿐 실제 키를 생성하지 않는다.

검증 체인 (seaf-server 내부):
    license.txt (AES-128-CBC) -> decrypt
        MaxUsers / Expiration / UUID / Hash / Hash2
    check_license():
        Hash  = SHA1(콘텐츠)  ? (calc_lic_sha1)   -> 변조검사
        Hash2 = RSA-verify(Hash)  ? (벤더 private key) -> 유일한 장벽
        UUID  = board uuid 일치?  Expirationpast?  MaxUsers 초과?

본 PoC 가 구현/시연하는 우회 벡터:
    S1/S6 binary_patch : check_license / calc_lic_sha1 / RSA_verify 반환 상수 1 플립
    S3  crack_license  : AES 복호화(스켈론) -> MaxUsers/Expiration 위조 -> calc_lic_sha1 재생성
    S5  crack_license  : Hash2(RSA) 검증 스킵 시뮬레이션
    S7  date_patch     : far-future Expiration 로 clock rotate
    S2/S4 circumvent   : UUID mismatch 우회 / license null→fake 주입

출력: black_runner 가 읽는 스코어 JSON (lane S3/S5, check_bypassed O/X).

사용:
    python education/black_team/attacks/crack_license/poc_seafile_license.py <own_license.txt> --i-own-this
    (또는 대상 없이 시뮬레이션만: --simulate)

Ethics: --i-own-this 없으면 비-로컬 타겟 거부. 모든 분석 로컬 LLM 전용.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

# --- Seafile license 스키마 (정적 분석 확인 필드) ---
# license.txt (AES-128-CBC) 안의 필드: MaxUsers / Expiration / UUID / Hash / Hash2
SEAFIELD_RE = re.compile(r"(?im)^(?P<k>\w+)\s*[:=]\s*(?P<v>.+?)\s*$")
KNOWN_FIELDS = {"MaxUsers", "Expiration", "UUID", "Hash", "Hash2"}

# Seafile hash = SHA1(Hash 제외 콘텐츠) 16진 — calc_lic_sha1 재구현 (Open EVP_sha1 동형)
def calc_lic_sha1(content: str) -> str:
    """calc_lic_sha1 재구현: Hash 제외 콘텐츠에 SHA1 -> 16진 소문자."""
    lines = [ln for ln in content.splitlines() if ln.strip() and not ln.strip().lower().startswith("hash")]
    clean = "\n".join(lines)
    return hashlib.sha1(clean.encode("utf-8")).hexdigest()


class SeafileLicense:
    """parsed license context (암호화 전, 복호화 후 동일 구조)."""

    def __init__(self, text: str):
        self.raw = text
        self.fields: dict[str, str] = {}
        for m in SEAFIELD_RE.finditer(text):
            if m.group("k").strip() in KNOWN_FIELDS:
                self.fields[m.group("k").strip()] = m.group("v").strip()

    @property
    def maxusers(self) -> int:
        try:
            return int(self.fields.get("MaxUsers", "0"))
        except ValueError:
            return 0

    @property
    def expiration(self) -> str:
        return self.fields.get("Expiration", "")

    def hash_missing(self) -> bool:
        return "Hash" not in self.fields or "Hash2" not in self.fields


# --- 검증 체인 (seaf-server check_license 재구현) ---
class LicenseChecker:
    def __init__(self, board_uuid: str, now: datetime, allowed_maxusers: int):
        self.board_uuid = board_uuid
        self.now = now
        self.allowed_maxusers = allowed_maxusers
        self.flags = set()  # 우회된 체크 집합 (검증 지표)

    def verify(self, lic: SeafileLicense) -> dict:
        """check_license 를 각 단계별로. result["all_ok"] == True 면 완전 우회 성공."""
        checks = {}

        # S3: Hash = SHA1(콘텐츠) 변조검사 (calc_lic_sha1)
        if lic.hash_missing():
            checks["Hash"] = "fail: no hash fields"
        else:
            recomputed = calc_lic_sha1(lic.raw)
            ok = recomputed == lic.fields["Hash"]
            checks["Hash"] = "ok" if ok else "fail"

        # S5: Hash2 RSA-verify (벤더 private key 필요) — 가장 높은 장벽
        #      실제 private key 없으면 여기서 멈춤. PoC 는 시뮬레이션.
        checks["Hash2_RSA"] = self._rsa_check(lic)

        # UUID 바인딩 (board uuid)
        uuid_ok = not lic.hash_missing() and lic.fields.get("UUID") == self.board_uuid
        checks["UUID_bind"] = "ok" if uuid_ok else "fail"

        # Expiration (시간)
        try:
            exp = datetime.strptime(lic.expiration, "%Y-%m-%d")
            exp_ok = exp > self.now
        except ValueError:
            exp_ok = False
        checks["Expiration"] = "ok" if exp_ok else "fail"

        # MaxUsers
        max_ok = lic.maxusers > 0 and lic.maxusers <= self.allowed_maxusers
        checks["MaxUsers"] = "ok" if max_ok else "fail"

        all_ok = all(v == "ok" for v in checks.values())
        return {"checks": checks, "all_ok": all_ok}

    def _rsa_check(self, lic: SeafileLicense) -> str:
        """
        Hash2 =ベン더 RSA private key 로 서명.
        private key 가 없으면 'fail'(장벽). private key 가 추출되면 'ok'.
        이 PoC 에는 private key 가 없어 기본적으로 'fail'.
        """
        if lic.hash_missing():
            return "fail: no hash2"
        # 실제 seafile: RSA_public_decrypt(Hash2, vendor_pub) == Hash ?
        return "fail: vendor private key required (hardcoded key extractable from seaf-server)"


# --- 우회 벡터 (회로 스위치처럼 check_result 를 플립) ---
def bypass_vector(
    scenario: str, lic: SeafileLicense, board_uuid: str, now: datetime
) -> dict:
    """각 우회 벡터별 '검증 우회 성공 여부' 시뮬레이션 + 스코어."""
    checker = LicenseChecker(board_uuid, now, allowed_maxusers=100)
    base = checker.verify(lic)
    checks = dict(base["checks"])
    applied: list[str] = []

    if scenario == "S1_binary_patch_check":
        # S1: check_license 반환 상수 1 플립 -> 모든 로컬 검사 우회
        checks = {k: "ok" for k in checks}
        applied.append("S1:check_license-return-flip")

    elif scenario == "S6_binary_patch_hash":
        # S6: calc_lic_sha1 / RSA_verify 호출 NOP
        if "Hash" in checks:
            checks["Hash"] = "ok"
        checks["Hash2_RSA"] = "ok"  # RSA_verify NOP
        applied.append("S6:calc_lic_sha1+RSA_verify-NOP")

    elif scenario == "S3_forgery":
        # S3: AES 복호화(스켈론) -> MaxUsers/Expiration 위조 -> calc_lic_sha1 재생성
        #      Hash 는 calc_lic_sha1 로 재생성(변조검사 우회). Hash2(RSA)는 여전히 관문.
        fields = dict(lic.fields)
        fields["MaxUsers"] = "999999"
        fields["Expiration"] = (now + timedelta(days=36500)).strftime("%Y-%m-%d")
        lic.fields = fields
        # Hash 재생성 (변조 감지 우회) -> calc_lic_sha1 로 새 콘텐츠의 Hash 계산
        new_hash = calc_lic_sha1(lic.raw)
        checks["Hash"] = "ok"
        applied.append(f"S3:forged MaxUsers=999999 Expiration far-future, Hash={new_hash[:12]}...")
        # Hash2(RSA) 관문은 그대로 -> all_ok 는 Hash2 가 fail 이면 False

    elif scenario == "S5_rsa_skip":
        # S5: Hash2(RSA) 검증 스킵 (verify_signature degenerate)
        checks["Hash2_RSA"] = "ok"
        applied.append("S5:Hash2-RSA-verify-skip")

    elif scenario == "S7_clock_rotate":
        # S7: far-future Expiration 로 로컬 시계 우회
        fields = dict(lic.fields)
        fields["Expiration"] = (now + timedelta(days=36500)).strftime("%Y-%m-%d")
        lic.fields = fields
        checks["Expiration"] = "ok"
        applied.append("S7:far-future Expiration (clock rotate)")

    elif scenario == "S2_uuid_hook":
        # S2: Frida 로 UUID 비교 훅 -> 항상 match
        checks["UUID_bind"] = "ok"
        applied.append("S2:UUID-bind-hook (frida)")

    elif scenario == "S4_license_null":
        # S4: license null-check 우회 -> fake license 주입
        checks["UUID_bind"] = "ok"
        applied.append("S4:null-check-bypass fake-license-inject")

    else:
        return {"scenario": scenario, "checks": checks, "all_ok": base["all_ok"],
                "applied": applied, "severity": "info"}

    all_ok = all(v == "ok" for v in checks.values())
    return {
        "scenario": scenario,
        "checks": checks,
        "all_ok": all_ok,
        "applied": applied,
        # Hash2_RSA 가 fail 이면 RSA private key 가 없는 한 완전 우회 불가
        "hard_barrier": "Hash2_RSA" if checks.get("Hash2_RSA") != "ok" else None,
        "severity": "high" if all_ok else "medium",
    }


def detect_seafile(text: str) -> bool:
    """target 파일이 seafile license 스키마인지 확인 (MaxUsers/Expiration/Hash2 등)."""
    fields = set()
    for m in SEAFIELD_RE.finditer(text):
        fields.add(m.group("k").strip())
    if KNOWN_FIELDS & fields:
        return True
    # 평문 맥락도 허용 (MaxUsers= 또는 Expiration= 등)
    return bool(re.search(r"(?im)^(MaxUsers|Expiration)\b", text)
                and re.search(r"(?i)hash2|license", text))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Seafile 라이선스 무력화 PoC (owned/lab target)")
    ap.add_argument("target", nargs="?", help="본인 소유 Seafile license.txt (owned lab)")
    ap.add_argument("--i-own-this", action="store_true",
                    help="본인 소유/의도적 취약랩 어설션 (target 시 필수)")
    ap.add_argument("--board-uuid", default="board-uuid-1234",
                    help="시뮬레이션용 board UUID (기본값)")
    ap.add_argument("--now", default=None, help="시뮬레이션 현재시점 (ISO)")
    args = ap.parse_args(argv)

    now = datetime.fromisoformat(args.now) if args.now else datetime.now()

    # 시뮬레이션 모드 (대상 없이 원리 시연)
    if not args.target:
        fake = (now + timedelta(days=1)).strftime("%Y-%m-%d")
        sample = (
            f"MaxUsers=100\nExpiration={fake}\nUUID={args.board_uuid}\n"
            f"Hash=deadbeef\nHash2=feedface\n"
        )
        lic = SeafileLicense(sample)
        report = {
            "mode": "simulate",
            "note": "generic 원화 시연 — 실제 키 생성 아님",
            "lanes": {},
        }
        for scen in ["S3_forgery", "S5_rsa_skip", "S1_binary_patch_check",
                     "S6_binary_patch_hash", "S7_clock_rotate",
                     "S2_uuid_hook", "S4_license_null"]:
            report["lanes"][scen] = bypass_vector(scen, SeafileLicense(sample),
                                                   args.board_uuid, now)
        # 상세 report 는 stderr (인간 가독), 스코어는 stdout (runner 기계 가독)
        print(json.dumps(report, indent=2, ensure_ascii=False), file=sys.stderr)
        # S3 관문 보고 (black_runner S3 스코어로 흡수)
        print(json.dumps({
            "lane": "crack_license", "id": "S3",
            "check_bypassed": False,  # Hash2(RSA private key) 관문으로 완전 통과 불가
            "severity": "high",
            "evidence": "AES 키 하드코딩으로 복호화/필드위조 가능, Hash2 RSA private key가 장벽",
        }, indent=2, ensure_ascii=False))
        return 0

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
    if not detect_seafile(text):
        print(json.dumps({
            "lane": "crack_license", "id": "S3", "check_bypassed": False,
            "severity": "info", "not_applicable": True,
            "evidence": "target 가 seafile license 스키마가 아님",
        }, indent=2, ensure_ascii=False))
        return 0

    lic = SeafileLicense(text)
    checker = LicenseChecker(args.board_uuid, now, allowed_maxusers=lic.maxusers or 100)
    verdict = checker.verify(lic)

    report = {
        "mode": "analyze",
        "detected_fields": sorted(lic.fields),
        "original_verdict": verdict["checks"],
        "all_ok": verdict["all_ok"],
        "bypass_lanes": {},
    }
    hard = verdict["checks"].get("Hash2_RSA")
    # 각 시나리오는 원본 lic 을 건드리지 않고 복사본으로 실행
    for scen in ["S1_binary_patch_check", "S6_binary_patch_hash",
                 "S3_forgery", "S5_rsa_skip", "S7_clock_rotate",
                 "S2_uuid_hook", "S4_license_null"]:
        report["bypass_lanes"][scen] = bypass_vector(scen, SeafileLicense(text),
                                                       args.board_uuid, now)

    print(json.dumps(report, indent=2, ensure_ascii=False), file=sys.stderr)
    # S3 스코어: Hash2 RSA private key 가 관문
    print(json.dumps({
        "lane": "crack_license", "id": "S3",
        "check_bypassed": hard == "ok",  # private key 추출 시 True
        "severity": "high",
        "evidence": (
            f"detected fields={sorted(lic.fields)}; "
            "AES 하드코딩 키로 복호화/MaxUsers/Expiration 위조 가능, "
            f"Hash2 RSA={hard} (private key가 유일한 장벽)"
        ),
    }, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
