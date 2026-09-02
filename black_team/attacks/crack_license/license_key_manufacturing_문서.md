# 라이센스키 제조 문서 (License-Key Manufacturing)

> 🔴 Red 원리 · 🔵 Blue 탐지. **교육용 ·本人 소유/취약랩 대상만.**
> 이 문서는 **작동하는 시rial(라이선스 키)을 제조하는** black-team keygen 을 기술한다.
> 실제 상용 키를 생성/배포하는 keygen 이 아니라, 복제 방지 기술 분석 산출물이다.

## 1. DefGuard 라이선스 포맷 (제조 대상 스키마)

DefGuard 라이선스는 **base64-encoded protobuf** 이며, 발급자는 RSA-2048 로
**OpenPGP detached signature** 한다 (`pgp 0.19.0`, `prost 0.14.4`).

```
LicenseMetadata {
  string  customer_id   = 1;
  bool    subscription  = 2;
  int64   valid_until   = 3;   // unix seconds, ~2100
  LicenseLimits limits  = 4;   // None = unlimited
  int32   tier          = 6;   // 0=Unspecified, 1=Business, 2=ENTERPRISE
  int32   support_type  = 7;   // 5 = DIRECT_ENTERPRISE
}
LicenseKey  { bytes metadata = 1; bytes signature = 2; }
```

제조 루트:
```
base64( prost::encode(LicenseKey { metadata, signature }) )
```

## 2. 제조 파이프라인 (4 스텝)

| 단계 | 동작 | DefGuard 대응 |
|---|---|---|
| **1** | RSA-2048 signing key 생성 | vendor issuer key 시뮬레이션 |
| **2** | Enterprise metadata (tier=2) protobuf encode → metadata bytes | `LicenseMetadata` |
| **3** | `DetachedSignature::sign_binary_data(key, data)` 로 서명 | vendor signature |
| **4** | `prost::encode(LicenseKey{metadata,sig})` + base64 | 최종 serial |

## 3. black-team keygen 이진 (작동 확인)

```bash
research/keygen/src/keygen.rs    # src (black_team 자립)
cd research/keygen && cargo build
CARGO_TARGET_DIR=/Users/yong/.cargo-target ./target/debug/keygen
```

**실제 제조 결과 (round-trip self-check 통과):**
```
forged metadata (50 bytes): 0a24306334643…3730346362
signature (310 bytes): c2c07304000108001d16210437f6ee…

LICENSE KEY (serial):
  CjIKJDBjNGRjYjU0LTAwNTQtNGQ0Ny1hZDg2LTE3ZmNkZjI3MDRjYhAB…

  decoded tier = 2 (2=ENTERPRISE)  subscription = true  valid_until = Some(4102444800)
  verify(metadata, signature) => true      ← 서명 검증 통과!
```

## 4. 왜 통과하는가 (validate_license 분석)

`validate_license(license, counts, tier)` 는 세 조건이 모두 `false`여야 한다:
- `is_max_overdue()` — `valid_until=None` 또는 미래 → **false**
- `is_over_license_limits()` — `limits=None` → **unlimited → false**
- `is_lower_tier(Enterprise)` — `tier=2 < 2` → **false**

→ 세 조건 전부 **패스**. 유일한 장벽은 `verify_signature` (vendor key 신뢰) 이다.

## 5. DefGuard 특이사항 — "이 serial 이걸릴 조건"

제조된 serial 은 **이 keygen 의 public key 를 trusting 하는 binary 에서만** 유효하다.
DefGuard 가 vendor issuer key 만을 신뢰하므로, 실제 acceptance 에는 다음 중 하나 필요:

- **S1**: vendor private key 침해 → vendor key 로 재제조 (가장 심각)
- **S2**: DefGuard build 가 test key(`test_key.asc`) 를 trust 하는 경로
- **S3**: `verify_signature` 자체 우회 (코드 패치)

## 6. 🔵 BLUE — 탐지/완화

| 탐지 지표 | 의미 | 완화 |
|---|---|---|
| `valid_until` ~2100 | 위조 시점 | 서버 권위 시간 기준 |
| `limits=None` + tier=2 | 무제한 enterprise | 서버 측 제한 재검증 |
| 서명 issuer fingerprint | 알려지지 않은 발급자 | trusted-issuer 목록 감사 |
| license entropy/서명 이력 | 동일 key 로 대량 발급 | 발급 빈도 이상 감지 |

## 7. 핵심 정리 (1 line)

**DefGuard 라이선스 제조는 `prost` encode + RSA-2048 서명으로 종단 증명됨 —
`validate_license` 세 조건은 위조 metadata 로 무조건 패스하며, 유일한 관문은
vendor public key 신뢰 뿐이다.**
