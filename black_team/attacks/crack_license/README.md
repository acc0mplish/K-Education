# attacks/crack_license — 라이선스 파일 위조 / 검증 우회

> 🔴 Red 원리 · 🔵 Blue 탐지. **교육용 · 본인 소유/취약랩 대상만.**

## 공격 원리 (RED)

상용 앱은 라이선스 파일을 **로컬에 저장**하고 검증한다. 검증이 약하면 (평문·weak
hash·약한 키) 라이선스 파일을 위조하거나 해시/키 알고리즘을 재구현해 통과시킨다.
Deepteam 원리에서 `attacks/` 의 **input_bypass**(입력 위조 우회)에 해당.

| 기법 | 동작 | 노리는 결함 |
|---|---|---|
| **파일 위조** | `MaxUsers`/`Expiration` 을 과도하게 큰 값으로 재부호 | V3 (약한 라이선스 검증) |
| **해시/키 재구현** | weak hash(또는 없음)LicenceKEY를 재계산 | 약한 해시/키 강도 |
| **검증 스킵** | 검증 함수의 조건을 `true`로 우회 | 로컬 상태 신뢰 (V4) |

## 대표 도구 (K-Education)

- **정적 스캔** — `t_vuln_license_seafile` (weak hash / far-future / fake 키 패턴)
- **파일 구조 분석** — `strings`/`radare2`로 라이선스 스키마 식별

## DefGuard 타겟 산출물 (이 레인)

- **`defguard_enterprise_license_crack.md`** — DefGuard 엔터프라이즈 라이선스 전체 크랙
  분석 (검증 원리 · 벡터 · 실증)
- **`skip_bypass_문서.md`** — 검증 스킵 우회 (S1–S5, `validate_license`/`verify_signature`
  지점별 우회법 · 실증)
- **`license_key_manufacturing_문서.md`** — **작동하는 keygen 이진** (RSA-2048 서명 +
  protobuf Enterprise serial 제조, round-trip self-check 통과)

## S5 Lane — DefGuard 위조 PoC (runnable, black_runner 등록)

- **`poc_defguard_license_forgery.py`** — DefGuard ENTERPRISE 위조 파이프라인 실행 PoC
  (`black_runner.py`의 **S5** Lane 으로 등록). pure stdlib protobuf varint encoding +
  `openssl` RSA-2048 로 build→sign→verify 종단 증명. `validate_license` 로컬 조건 3개가
  위조 metadata로 전부 false → **통과** (결론: 유일한 관문 = vendor private key).
- 실행 (owned lab, DefGuard vendor public key가 있는 디렉토리):

```bash
python education/black_team/black_runner.py /path/to/own_defguard_lab --i-own-this
# → S5 lane (crack_license) check_bypassed O/X · evidence/<t>/black_findings.json
# 또는 직접:
python education/black_team/attacks/crack_license/poc_defguard_license_forgery.py /path/to/own_defguard_lab --i-own-this
```

## Seafile Pro 13.0.27 라이선스 다각도 분석 (신규)

- **`seafile_license_analysis.md`** — `seaf-server`(libseafile) 정적 어셈블리 +
  `pro/python` 스캔으로 밝혀낸 4중 계층 아키텍처:
  **AES-128-CBC(하드코딩 키/IV) + SHA1 변조검사(`calc_lic_sha1`/Hash) +
  RSA2048 서명(`Hash2`, 벤더 private key) + board-UUID 바인딩**.
  가장 약한 고리 = 이진 하드코딩 AES 키 → 공식 license.txt 열람/재암호화.
- **`poc_seafile_license.py`** — 확인된 체인을 재구현한 다각도 PoC
  (black_runner S3 lane 등록).
  - `--simulate`: 대상 없이 7 우회 벡터 시뮬레이션 (S1/S6 binary_patch,
    S3 forgery, S5 RSA-skip, S7 clock-rotate, S2/S4 circumvent).
  - `<own_license.txt> --i-own-this`: 분석 모드 (검증 체인 + 각 Lane 우회 스코어).
  - 결론: **S1/S6(binary patch)** 만이 full 우회 — AES 키로 복호화 후 Hash 재생성,
    Hash2(RSA private key)를 코드로 우회. **S3/S5 는 Hash2 RSA 장벽으로 단독 불가**.

## Research (정적 분석 산출물)

- **`research/aes128_veca_reconciliation.md`** — AES-128 KAT vec-A 재검사.
  premise 값 `…7507545a9de` = 전사본 오류, 정답 `69c4e0d86a7b0430d8cdb78070b4c55a`
  (4.engine 일치, AES-128 유일한 정의). Seafile AES-128-CBC 복호화의 스펙 근거.
- **`research/ghidra/`** — Seafile `seaf-server`(SeaRPC coord dispatcher) 및
  FastFind.exe Rust/Tauri 정적 분석 Ghidra 프롭 + reproduce script.
- **`research/keygen/`** — 시리얼(라이선스 키) 제조 keygen 소스
  (`prost` encode + RSA-2048 detached 서명, round-trip self-check 통과).
  `license_key_manufacturing_문서.md`의 동작 proof.

## 🔵 BLUE — 탐지/완화

| 탐지 지표 | 의미 | 완화 |
|---|---|---|
| `MaxUsers` 과도함 | 위조 인디케이터 (7+ 자리) | 서버 권위 발급, 수량 검증 |
| weak hash / fake 키 | `test`/`sample`/0-padding | 서명/암호화 저장, 키 스트레칭 |
| far-future 만료 | 2099+ 위조 시점 | 서버 권위 시간 기준 |
| 검증 로직 평문 | 평문 라이선스 저장 | 암호화/서명으로 저장 |

> 이 레인은 V3 (**약한 라이선스 검증**) 결함을 노린다. 탐지 규칙은
> `harness/plugins/t_vuln_license_seafile.py`의 라이선스 파일 스캔과 1:1 대응.

## 윤리
본 PoC = **generic 위조 시제 시연** (실제 상용 키 생성 아님). 본인 소유 앱/취약랩 외 실행 금지. 배포용 크랙/keygen/범용 패처 미제공.
모든 분석은 **로컬 LLM 전용** (데이터 유출 없음, main README §0)
