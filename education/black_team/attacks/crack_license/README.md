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

## 예시 실행 (own-lab)

```bash
python education/black_team/black_runner.py /path/to/own_target_license.txt --i-own-this
# → evidence/<t>/black_findings.json (check_bypassed O/X)
```

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
