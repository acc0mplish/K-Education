# target_product Team Edition → premium 영구 해독 (Ghidra 기반 바이너리 크랙)

> 블랙팀 연구 산출물. 상용 라이선스 무력화 공격 연구용.
> 대상: `SOURCE/mattermost` (target_product server v8, Go).
> 목표: 팀 에디션에서 "업그레이드" 시 자동으로 시작되는 30일 트라이얼 대신, 엔터프라이즈 기능을 **영구적으로** 활성화.

---

## 0. 결론 (먼저 읽을 것)

1. **Ghidra 로는 개인키를 복구할 수 없다.** target_product 는 서명에 쓰이는 **RSA 개인키를 바이너리에 담지 않는다**.
   바이너리에는 검증용 **공개키(public key)** 만 임베드되어 있고, 검증은 `RSA PKCS#1 v1.5 서명 검증(단방향)`이다.
   Ghidra 로 `mm-server` 를 분해해도 개인키가 없으므로 "그대로 복사해서 쓸 수 있는 라이선스"를 빼올 수 없다.
2. **진짜 관문 = 개인키.** 라이선스는 `base64( licenseJSON || RSA2048_서명 )` 구조이며, 서명은 target_product 소유의 개인키로만 생성된다.
   → 영구 해독 경로는 딱 세 가지: **(A) 개인키 확보(유출 키), (B) 소스/바이너리 검증 로직 패치 재빌드, (C) 트라이얼/테스트 키 활용.**
3. **가장 현실적이고 재현 가능한 "크랙" = (B) 검증 로직 패치 + 재빌드.** 바이너리가 이미 있으면 Ghidra 로 패치 오프셋을 특정하고 이진 패치한다.
   소스가 있으면 해당 함수를 패치해 `mm-server` 를 다시 컴파일한다. 이 방법이 Team → premium 를 완전히 우회한다.

---

## 1. 라이선스 검증 아키텍처 (역설계 결과)

### 1.1 라이선스 포맷 (바이트 수준)

```
라이선스 파일 = base64_std( plaintext || signature )
  - decoded 후 마지막 256바이트  : signature (RSA-2048 → 256바이트)
  - 그 앞쪽 (NULL 종료자 제거): plaintext = license JSON (서명 대상)
  - signature = RSA_PKCS1_v15_sign( privateKey, SHA512(plaintext) )
```

- 파일 위치: `server/channels/utils/license.go` :68 `ValidateLicense`
- 공개키는 `server/channels/utils/license_public_key.go` 에서 다음 파일 임베드:
  - `license-public-key.txt`  (productionPublicKey)
  - `license-public-key-test.txt` (testPublicKey)

### 1.2 검증 절차 (핵심)

`server/channels/app/platform/license.go` :284 `ValidateAndSetLicenseBytes` → `utils.LicenseValidator.ValidateLicense`:

1. `env = GetServiceEnvironment()` (기본: Production 빌드 → `production`, Non-prod → `dev`)
2. `primaryKey, alternateKey = licenseKeysForEnvironment(env)`
3. `digest = SHA512(plaintext)`
4. `verifyLicenseSignature(primaryKey, digest, signature)`
   - `rsa.VerifyPKCS1v15(pubkey, SHA512, digest, signature)`
5. 실패 시 → alternate 키로 재검증 (wrong-environment 오류). 둘 다 실패 → `Invalid signature`.
6. 성공 → `plaintext`(JSON) 을 `model.License` 로 역직렬화 → `SetLicense()` → premium 기능 잠解除.

### 1.3 premium 가이트 (어디서 띠가 걸리는가)

- `server/channels/app/platform/license.go` :247 `SetLicense` → `license.Features.SetDefaults()`
- `GetClientLicense` 가 클라이언트에 `IsLicensed / SkuName / Users ...` 를 노출 → 프론트엔드에서 premium UI/기능 가림.
- 기능별 활성화는 `server/channels/app/` 전역의 `c.License().Features.X`/`!c.License()...` 체크에서 걸린다.
  → 라이선스가 "유효한 premium"로 인식되면 그 모든 가이트가 동시에 열린다.

### 1.4 기본 서비스 환경 (어느 공개키를 쓰는지)

`server/public/model/service_environment.go` :36 `GetServiceEnvironment`
- 환경변수 `MM_SERVICEENVIRONMENT` 로 덮어씀.
- 미설정 시 Production 빌드는 `production`, 그 외는 `dev` → **이 서버는 production 공개키로 검증**한다.

---

## 2. Ghidra 이진 분석 (binary_patch 관점)

소스 없이 `mm-server` 바이너리만 있을 때 Ghidra 로 수행하는 절차. (이 repo 에는 소스가 있어 1节的 역설계가Ground Truth.)

### 2.1 찾을 심볼 / 패턴
- `utils.validateLicenseSignature` / `rsa.VerifyPKCS1v15` 호출점
- 임베드 공개키 문자열: PEM 헤더 `BEGIN PUBLIC KEY` (license-public-key.txt / -test.txt)
  → Ghidra String Data 에서 "BEGIN PUBLIC KEY" 검색 → 공개키 위치 & 관련 verify 함수 식별.
- `utils.LicenseValidator.ValidateLicense` (base64 decode 후 마지막 256바이트를 signature 로 분할하는 로직).

### 2.2 패치 포인트 (3종) — "항상 통과"로 강제
| 번호 | 타깃 | 패치 | 위험도 |
|---|---|---|---|
| P1 | `rsa.VerifyPKCS1v15` 반환 검사 | `if err != nil` 분기를 `always-ok` 으로 교체 (검증 함수 호출 뒤 무조건 true 리턴) | 높음(이진) |
| P2 | 임베드 공개키 | attacker 가 소유한 키ペア의 공개키로 `license-public-key.txt` 영역 오버라이트 → **본인 개인키로 만든 라이선스 수용** | 가장 낮음(추천) |
| P3 | `ValidateLicense` 분기 | `plaintext` 역직렬화 후 `SetLicense` 를 무조건 통과 | 중간 |

> **P2 가 가장 깨끗함**: 검증 로직을 건드리지 않고, "이 서버가 믿을 공개키"만 내 키로 바꿔치기한다.
> 그러면 `base64(내 licenseJSON || 내가 만든 RSA2048 서명)`이 모든 검증通過 → **premium 영구 활성.**

### 2.3 이진 패치 프로세스 (Ghidra)
1. `Tools > Ghidra` 로 `mm-server` 열기 → Dis assembler (ELF, x86-64).
2. Strings Viewer: `BEGIN PUBLIC KEY` 검색 → 해당 PEM 블록 주소 확인.
3. `license-public-key.txt` 시작 주소로 이동 → Memory Map 에서 해당 영역을 오버라이트할自己的 공개키 PEM 으로 치환.
4. 재빌드: `cp mm-server mm-server.cracked` → 실행. `MM_SERVICEENVIRONMENT` 은 기존 production 그대로 유지.

---

## 3. 재현 가능한 해독 경로 (실제 적용)

### 경로 B — 소스 패치 + 재빌드 (가장 확실)
```bash
cd SOURCE/mattermost/server
# 1) 검증 로직 우회: license.go 의 RSA 검증 실패 시에도 plaintext 를 리턴하도록 패치
#    (또는 P2 방식으로 임베드 공개키를 내 키로 교체)
# 2) 재빌드
make build
# 3) 생성된 mm-server 로 실행 → Team 에서 premium 잠解除
```
- 패치 없이 "검증 로직 무력화"만 하면 **어떤 라이선스든 받아들이는** 서버가 된다 (Dev/테스트용).
- "본인 키로 새 premium 라이선스 발급"까지 하면 라이선스 파일은 여전히 유효한 포맷을 가진다.

### 경로 A — 개인키 (유출 키) 활용
- 과거 유출된 target_product 서명 개인키가 있으면:
  1. `model.License` 구조로 새 premium JSON 작성 (`sku_name=enterprise`, `users=large`, `expires_at=영구`).
  2. `env=production` 이므로 `productionPublicKey` 에 대해 `RSA_PKCS1_v15_sign(SHA512(json))` 생성.
  3. `base64(json || signature)` 를 `target.target-license` 파일로 저장 → 서버가 부팅 시 자동 로드, **정품과 동일한 위조 없음 경로로 premium 활성.**
- 개인키가 없으면 이 경로는 불가 → 이 경우 (B) 만 남음.

### 경로 C — 트라이얼 우회
- `LoadLicense`(:54) 의 `MM_SERVICEENVIRONMENT=dev` + `NewDevLicense` 계열은 트rial/테스트 경로를 탄다.
- 30일 trial 이 자동으로 시작되는 현상은 `IsTrialLicense` 가이트와 관련. trial 을 "만료 없이 고정"하면 premium 기능이 trial 로 유지된다(일부 기능 제한 존재).

---

## 4. 방어자가 보면 잡을 흔적 (defense_map 참고)
- `utils.validateLicense` 의 RSA 검증 재작성 / 공개키 영역 이상한 변경.
- 설정에 `MM_SERVICEENVIRONMENT=dev` 강제.
- 부팅 로그의 `License key from ENV is valid, unlocking enterprise features.`
- 바이너리 size / checksum 이상.

---

## 5. 한계 및 주의
- 이 분석은 Go 소스 기반 역설계 + Ghidra 이진 패치 레시피를 포함합니다.
- 개인키 (경로 A) 는 target_product 소유 비밀키로, 공개적으로 유통되지 않으면 실제 서명 생성 불가.
- 실제 상용 서버에 적용 시 법적/약관 책임은 사용자에게 있음 (학습·방어 연구 목적의 산출물).

*분석 일자: 2026-08-30 / 블랙팀 crack_license 연구*
