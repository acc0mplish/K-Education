# 라이선스 검증 스킵 우회 문서 (Skip-Bypass)

> 🔴 Red 원리 · 🔵 Blue 탐지. **교육용 ·本人 소유/취약랩 대상만.**
> 이 문서는 라이선스 *위조*가 아니라 **검증 로직 자체를 건너뛰는** 우회에 집중한다.

## 1. 공격 원리 (RED)

상용 앱은 `validate_license()` 를 **매 호출마다** 수행한다. 이 함수가 `Ok(())` 을
반환하면 기능 unlocks. 검증이 **순수 로컬 로직**이면, 서명 검증 단계를 우회/건너뛰어
통과시킬 수 있다. Deepteam 원리에서 `input_bypass` (입력 위조) 와 `logic_bypass`
(조건 우회) 에 해당.

vendor_product (`license.rs`) 검증 체인:

```
from_base64()
  └─ verify_signature()      ← RSA 서명 검증   ← 여기가 유일한 장벽 (S3)
validate_license(license, counts, tier)
  └─ is_max_overdue()         ← 시간 우회 (S1)
  └─ is_over_license_limits() ← 객체 수 제한 우회 (S2)
  └─ is_lower_tier(tier)      ← 티어 우회 (S3)
```

## 2. 우회 벡터 (위계순)

| ID | 우회 방법 | 노리는 결함 | 난이도 |
|---|---|---|---|
| **S1** | `validate_license()` 반환값을 `true`로 플립 | 로컬 상태 신뢰 (V4) | ★☆☆ |
| **S2** | `is_over_license_limits()` / `is_max_overdue()` 조건 삭제 | 객체/시간 검증 | ★☆☆ |
| **S3** | `verify_signature()` 를 무조건 `Ok(())` 으로 우회 | 단일 RSA 서명만 의존 | ★★☆ |
| **S4** | `get_cached_license()` 에서 `None` 대신 가짜 license 주입 | license null-check 우회 | ★★☆ |
| **S5** | tier gate `is_enterprise_license_active()` 초기값 `true` | 기능 락 기본 open | ★☆☆ |

## 3. vendor_product 대상 구체적 우회 지점 (`license.rs` / `limits.rs`)

- **S1** — `validate_license()` (license.rs:483) 의 `Ok(())` 반환 강제.
- **S2** — `is_over_license_limits()` (`limits.rs:115`, `limits=None → false`) 는
  이미 무한 설정이므로 **위조 metadata 에 `limits=None`만 주면 통과**.
- **S3** — `verify_signature()` (license.rs:179). vendor private key 없어도
  `Ok(())` 반환 우회 시 서명 장벽 붕괴.
- **S4** — `get_cached_license()` 가 `None`이면 `LicenseNotFound`.
  `Some(fake)` 를 주입해 `is_max_overdue()`/티어 검증을 우회.
- **S5** — `is_enterprise_license_active()` (`mod.rs`) 의 기본값.

## 4. PoC 실행 (own-lab)

```bash
# vendor_product 원본 verify_signature() 를 재구현한 이진 (pgp 0.19 / prost 0.14)
/tmp/lchk/target/debug/lchk        # verify_signature degenerate probe
# → empty/zero signature 모두 InvalidSignature rejection (자체 뚫림 없음)

# 검증 스킵 우회 시뮬레이션 (로컬 gate)
python education/black_team/black_runner.py <own_target> --i-own-this
# → evidence/<t>/black_findings.json (check_bypassed O/X)
```

## 5. 실증 결과 (empirical)

```
### 5. degenerate signature probe
  empty signature          => InvalidSignature parse: no matching packet found
  all-zero (24B)           => InvalidSignature parse: unknown packet header version 0
  all-zero (256B)          => InvalidSignature parse: unknown packet header version 0
```
→ vendor_product 는 `pgp` parser 단계에서 malformed signature 를 rejection 한다. **자바로
뚫림 없음** → 우회하려면 반드시 **코드 패치(S1–S3)** 가 필요하다.

## 6. 🔵 BLUE — 탐지/완화

| 탐지 지표 | 의미 | 완화 |
|---|---|---|
| gate 함수 반환 상수 `true` | S1/S5 우회 (정적 분석) | 서버 권위 재검증 |
| `verify_signature` 항상 Ok | S3 우회 | 서명 무결성 비교 |
| `validate_license` early-return | S1 우회 (OEP 비정상) | 호출 이력 감사 |
| license 주입 (fake None→Some) | S4 우회 | null-check 강화 |
| `is_over_license_limits` 삭제 | S2 우회 | 서버 측 객체 수 재계산 |

## 7. 핵심 정리 (1 line)

**vendor_product 검증은 `validate_license` 의 로컬 조건 3개 + `verify_signature` 1개에만
의존**하며, 이 중 `verify_signature` 만이 유일한 장벽 — degenerate signature 는
`pgp` parser 단계에서 rejection 되므로 우회에는 코드 패치(S1–S3)가 반드시 필요하다.
