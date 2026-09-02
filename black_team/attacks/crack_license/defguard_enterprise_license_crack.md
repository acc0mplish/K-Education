# DefGuard 엔터프ライ즈 라이선스 크랙 (Empirical License-Crack Analysis)

> 🎓 교육용 · 본인 소유/인가된 자산 대상. 본 문서는 **복제 방지 기술 분석** 연구 산출물이며,
> 실제 상용 키를 생성/배포하는 keygen 아님. `education/` 은 로컬 gitignore 대상 (비추적).

- **타겟**: [DefGuard](https://github.com/DefGuard/defguard) (AGPL dual-license, open-code enterprise)
- **레이인**: `crack_license` (TAXONOMY S3/S5 — 라이선스 파일 위조 + 검증 로직 우회)
- **검증 환경**: `pgp 0.19.0`, `prost 0.14.4` (DefGuard Cargo.lock 과 동일 버전)로 재구현

---

## 1. 타겟 아키텍처 (복제 방지 기술)

DefGuard 는 "open-code" dual-license 모델: 엔터프라이즈 코드가 OSS 레포에 그대로 포함되되,
`crates/defguard_core/src/enterprise/` 내 **라이선스 체크**로 락이 걸린다.

```
crates/defguard_core/src/enterprise/
├── LICENSE.md          # "vendor may secure use with a license key" (문서적 근거)
├── license.rs          # 핵심 gate (from_base64 → verify_signature → validate_license)
├── mod.rs              # is_enterprise_license_active() = tier gate
├── limits.rs           # is_over_license_limits() = 객체 수 제한
├── public_key.asc      # ⚠️ vendor RSA trust anchor (이진에 embed)
├── test_key.asc        # test 전용 public key (#[cfg(test)])
├── proto/license.proto # protobuf 스키마
```

**信的模型(Trust Model)**: 엔터프라이즈 기능 사용 = `validate_license()` ALL PASS.
이 체크는 오직 **하나의 RSA-2048 서명**과 순수 로컬 로직에만 의존한다.

---

## 2. 라이선스 포맷 (proto3) — 실许可证 디코드로 확정

`license.proto` (발급자가 직접 제공):
```proto
message LicenseMetadata {  // field 1..7
  string customer_id = 1; bool subscription = 2; optional int64 valid_until = 3;
  LicenseLimits limits = 4; optional int64 version_date_limit = 5;
  LicenseTier tier = 6; SupportType support_type = 7;  // enum → wire=int32/varint
}
message LicenseKey { bytes metadata = 1; bytes signature = 2; }
// 최종: base64(LicenseKey) → DB settings.license 에 저장
```

**실제 Enterprise license 디코드 결과** (vendor 테스트 스위트의 real Enterprise key, `tier=2`):
```
customer_id = 4bb33e52-e34c-4d21-b45a-91ca3a334c09
valid_until = 1766405682  (2025-12-22)
tier        = 2  (ENTERPRISE)   ← 이 값만 있으면 enterprise gate 통과
subscription = false
```
→ 스키마/인코딩이 end-to-end로 확인됨.

---

## 3. 실증 검증 (empirical proof)

`/tmp/lchk` 에서 DefGuard 원본 `verify_signature()` / `from_base64()` 를 `pgp 0.19` + `prost 0.14`
로 재구현하고 실행한 결과:

```
### 1. vendor RSA key
  vendor public_subkeys: 1  (서名字 key 있음 → verify 는 subkey 로 실행)
  test   public_subkeys: 0
### 2. real enterprise license vs vendor key
  => vendor rejected (signed by the TEST key, not vendor key)  — format e2e 확인
  decoded: customer_id=4bb33e52-… valid_until=2025-12-22 tier=2
### 3. FORGE enterprise metadata (protobuf encode)
  forged metadata (22 bytes): 0a0861747461636b657210011880ae99a40f30023805
  validate_license() result: PASS (tier=Enterprise, no expiry, unlimited)
### 4. signature wall
  vendor RSA PRIVATE key present? NO (public keys.asc 만 ship)
### 5. degenerate signature probe
  empty signature          => InvalidSignature parse: no matching packet found
  all-zero (24B)           => InvalidSignature parse: unknown packet header version 0
  all-zero (256B)          => InvalidSignature parse: unknown packet header version 0
```

**결론 A**: 위조 metadata 는 `validate_license()` 를 **완벽히 우회**한다.
**결론 B**: degenerate (empty/zero) signature 는 `pgp` parser 단계에서 rejection → **자바로 뚫림 없음**.
**결론 C**: 유일한 장벽 = **vendor private key** (레포에 없음).

---

## 4. 크랙: 위조 파이프라인 종단 증명 (real RSA)

"키만 있으면 위조는 trivial 하다"를 real RSA 로 종단 증명 (`openssl` RSA-2048):

```
forged metadata (22 bytes): 0a 08 61 74 74 61 63 6b 65 72 10 01 18 80 ae 99 a4 0f 30 02 38 05
openssl genrsa -out mine.key 2048
openssl dgst -sha256 -sign mine.key -out forged_meta.sig forged_meta.bin
openssl dgst -sha256 -verify mine.pub -signature forged_meta.sig forged_meta.bin
  => Verified OK
```
→ build(metadata) → sign(RSA) → verify, **전 파이프라인 작동**. DefGuard唯独 필요한 건
**vendor의 private key** 하나뿐.

---

## 5. 크랙 벡터 (위계순)

### S1 — vendor private key 침해 (mass forgery, 가장 심각)
License server (`pkgs.defguard.net`) 는 모든 유효 license 의 **유일한 signer**.
이 key 하나만 침해되면 위조 파이프라인으로 **무제한 Enterprise license 생성** (§4 증명).
→ vendor trust anchor 이진 embed + renewal endpoint 의 server-authority 에 대한 single point of failure.

### S2 — test key / test license 노출
vendor 는 `test_key.asc` + real Enterprise test key (`tier=2`) 를 테스트 스위트에 동봉.
Signing key 가 공개/유출된 경우, **테스트 키로 서명된 license 를 `#[cfg(test)]` 빌드에서
accept** 하는 경로가 존재 (`mod.rs` 의 `#[cfg(test)] PUBLIC_KEY = test_key.asc`).

### S3 — clock skew (subscription grace window)
`validate_license` → `is_max_overdue()`: subscription license 는 만료 후 **14일(MAX_OVERDUE_TIME)까지**
valid. system clock 을 14일 이내로 뒤로 돌리면 만료된 subscription 을 일시 재가동
(`is_expired`/`is_max_overdue` 모두 `Utc::now()` 의존).

### S4 — renewal endpoint 남용
`renew_license()` 는 `{"key": old}` POST → `{"key": new_signed}` 응답을 그대로 accept.
request binding/authN 이 없어, 유효 key 로만 renewal 이 가능 (key 가 있으면 만료 연장 자동화).

---

## 6. Blue 방어 매핑 (TAXONOMY S3/S5 → 탐지)

| 크랙 | Blue 탐지 지표 |
|---|---|
| S1 mass forgery | license server 서명 key rotation, signature issuer_fingerprint 감사, renewal 요청 소스 IP/빈도 이상 |
| S2 leaked test key | test/release key 분리, key material 외부 미출력, CI 시 test 키 사용 시 알림 |
| S3 clock skew | license 검증 시 monotonic/ntp 동기화 강제, `valid_until` 이상 시점 알람 |
| S4 renewal 남용 | renewal request authN (license→customer 바인딩), rate limit, key entropy/서명 이력 추적 |

---

## 7. 핵심 정리 (1 line)

**DefGuard 엔터프라이즈 enforcing 은 단일 RSA-2048 서명과 순수 로컬 로직에만 의존**하며,
trust anchor(public key)와 renewal signer(vendor key)가 single point of failure.
위조 metadata 파이프라인은 실증 통과 — 오직 vendor private keyだけが 관문.
