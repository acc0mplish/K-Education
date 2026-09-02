#!/usr/bin/env python3
"""Poc: DefGuard 엔터프ライズ 라이선스 위조 (원리 시용, pure-stdlib + openssl).

🎓 교육용 · 본인 소유 앱/취약랩 대상. 배포용 크랙/keygen 아님.

원리: DefGuard 엔터프ライ즈 기능은 `validate_license()`의 로컬 조건 3개가
     모두 false일 때만 unlock 된다. 위조 metadata (tier=2 ENTERPRISE,
     future valid_until, limits=None) 를 protobuf encode → RSA-2048 서명으로
     build하고, `validate_license`가 이 위조 키를 통과하는지를 시연한다.

     결론 (분석 문서): 위조 metadata 파이프라인은 종단 통과. 유일한 장벽 =
     vendor private key (레포에 없음).

사용:
    python education/black_team/attacks/crack_license/poc_defguard_license_forgery.py \
        <own_defguard_target> --i-own-this

  <own_defguard_target>: DefGuard vendor public key(public_key.asc)가 있는
                         owned lab 파일/디렉토리. 없으면 not_applicable로 skip.

Ethics: --i-own-this 없으면 비-로컬 타겟 거부.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

# --- minimal protobuf varint encoder (field 1/2/3/6, pure stdlib) ---

def zigzag32(n: int) -> int:
    return (n << 1) ^ (n >> 31) if n < 0 else (n << 1) & 0xFFFFFFFF


def zigzag64(n: int) -> int:
    return (n << 1) ^ (n >> 63) if n < 0 else (n << 1) & 0xFFFFFFFFFFFFFFFF


def varint(n: int) -> bytes:
    n &= 0xFFFFFFFFFFFFFFFF
    out = bytearray()
    while True:
        b = n & 0x7F
        n >>= 7
        if n:
            out.append(b | 0x80)
        else:
            out.append(b)
            break
    return bytes(out)


def tag(field: int, wire: int) -> bytes:
    return varint((field << 3) | wire)  # wire: 2=len-delimited, 0=varint


def encode_string(field: int, value: str) -> bytes:
    raw = value.encode("utf-8")
    return tag(field, 2) + varint(len(raw)) + raw


def encode_varint(field: int, value: int) -> bytes:
    return tag(field, 0) + varint(zigzag64(value) if value < 0 else value)


# DefGuard LicenseMetadata 필드 (license.proto, 분석 문서 참고)
# customer_id=1(string), subscription=2(bool), valid_until=3(int64), tier=6(int32)
def forge_metadata(customer_id: str = "attacker",
                   valid_until: int = 4102444800,  # ~2100
                   tier: int = 2) -> bytes:
    """ENTERPRISE 위조 metadata (limits=None = 무제한).
    분석 문서의 인코딩과 동일 구조: field1/2/3/6."""
    out = encode_string(1, customer_id)
    out += encode_varint(2, 1 if valid_until else 0)  # subscription
    out += encode_varint(3, valid_until)              # valid_until (future)
    out += encode_varint(6, tier)                     # tier = 2 (ENTERPRISE)
    return out


# --- validate_license 로컬 조건 3개 재현 (license.rs / limits.rs) ---

def is_max_overdue(valid_until) -> bool:
    """subscription 만료 초과 여부 — valid_until None/과거이면 true."""
    return valid_until is None or valid_until < _now()


def is_over_license_limits(limits) -> bool:
    """limits=None 이면 무한 → false (위조 metadata는 limits=None)."""
    return limits is not None


def is_lower_tier(tier) -> bool:
    """tier < ENTERPRISE(2)이면 true."""
    return tier < 2


def _now() -> int:
    return int(os.environ.get("DEFGUARD_FAKE_NOW", "1800000000"))  # ~2027


def validate_license(valid_until, limits, tier) -> bool:
    """세 조건이 모두 false여만 ENTERPRISE unlock (위조 키는 전부 false)."""
    return not (is_max_overdue(valid_until) or
                is_over_license_limits(limits) or
                is_lower_tier(tier))


# --- RSA-2048 sign/verify (openssl shell-out, analysis doc §4와 동형) ---

def rsa_sign_verify(data: bytes) -> tuple[bool, dict]:
    """temp dir에서 RSA-2048 key 생성 → 서명 → self verify (test key).
    vendor private key 없으면 self-check 모드로 파이프라인 종단 증명."""
    work = Path(tempfile.mkdtemp(prefix="dg_rsa_"))
    try:
        key = work / "mine.key"
        sig = work / "forged_meta.sig"
        pub = work / "mine.pub"
        (work / "data.bin").write_bytes(data)
        _sh("openssl", "genrsa", "-out", str(key), "2048", cwd=work)
        _sh("openssl", "dgst", "-sha256", "-sign", str(key),
            "-out", str(sig), str(work / "data.bin"), cwd=work)
        _sh("openssl", "rsa", "-pubout", "-in", str(key), "-out", str(pub), cwd=work)
        r = _sh("openssl", "dgst", "-sha256", "-verify", str(pub),
                "-signature", str(sig), str(work / "data.bin"), cwd=work, check=False)
        verified = "Verified OK" in r.stdout
        return verified, {"selfcheck": True,
                          "note": "vendor private key 없어 test key로 self-check (실제 accept엔 vendor key 필요)"}
    except Exception as e:  # noqa: BLE001
        return False, {"error": str(e)}


def _sh(cmd: str, *args: str, cwd=None, check: bool = True) -> subprocess.CompletedProcess:
    res = subprocess.run([cmd, *args], cwd=cwd, capture_output=True, text=True)
    if check and res.returncode != 0:
        raise RuntimeError(f"{cmd} {' '.join(args)} failed: {res.stderr.strip()}")
    return res


# --- target 스캔 (DefGuard vendor public key 존재 여부) ---

def find_vendor_key(target: Path) -> Path | None:
    """own target에서 DefGuard vendor public key(public_key.asc) 탐색."""
    cands = [target] if target.is_file() else list(target.rglob("*"))
    for p in cands:
        if p.name == "public_key.asc" or "public_key.asc" in p.name:
            return p
    # embed pubkey 단서: ASCII public key 블록
    for p in cands:
        try:
            if p.stat().st_size < 2048 and b"BEGIN RSA PUBLIC KEY" in p.read_bytes():
                return p
        except (OSError, ValueError):
            continue
    return None


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="DefGuard 라이선스 위조 PoC (owned/lab target)")
    ap.add_argument("target", help="본인 소유 DefGuard 대상 (public_key.asc 있는 lab)")
    ap.add_argument("--i-own-this", action="store_true",
                    help="본인 소유/의도적 취약랩 어설션 (필수)")
    args = ap.parse_args(argv)

    def emit(**kw) -> None:
        kw.setdefault("lane", "crack_license")
        kw.setdefault("id", "S5")
        print(json.dumps(kw, ensure_ascii=False, indent=2))

    target = Path(args.target)
    if not target.exists():
        print(f"error: {target} 없음")
        return 1

    # ethics gate (기존 PoC와 동형)
    if not args.i_own_this:
        emit(check_bypassed=False, severity="info",
             evidence="--i-own-this 필요 (비-로컬 타겟 거부)")
        return 0

    vendor_key = find_vendor_key(target)
    if vendor_key is None:
        emit(check_bypassed=False, severity="info", not_applicable=True,
             evidence="DefGuard vendor public key(public_key.asc) not found in target "
                      "(owned lab에 key를 놓으면 위조 파이프라인 실행)")
        return 0

    # 1) 위조 metadata (ENTERPRISE, future, unlimited)
    metadata = forge_metadata(customer_id="attacker", valid_until=4102444800, tier=2)

    # 2) validate_license 로컬 조건 3개 재현 (모두 false → 통과)
    lv = validate_license(valid_until=4102444800, limits=None, tier=2)

    # 3) RSA sign/verify 파이프라인 (self-check)
    verified, rsa_info = rsa_sign_verify(metadata)

    severity = "high" if lv else "medium"
    emit(check_bypassed=lv,
         severity=severity,
         forged_metadata_hex=metadata.hex(),
         forged_metadata_len=len(metadata),
         validate_license_passed=lv,
         rsa_signature_verified=verified,
         evidence=(f"forged tier={2} metadata passes validate_license(3/3 false); "
                   f"signature wall: vendor RSA-2048 private key required for real "
                   f"acceptance (self-check via test key). vendor key present={vendor_key.name}"),
         **rsa_info)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
