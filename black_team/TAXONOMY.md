# Black Team — 라이선스 무력화 TAXONOMY

> `confident-ai/deepteam`의 **attacks/vulnerabilities/metrics/guardrails** 4축을
> 라이선스 무력화에 맞게 재해석한 분류 체계. Deepteam 은 LLM 공격을 이 축으로
> 정리하나, 본 문서는 이를 **상용 라이선스 무력화** 도메인에 재매핑한다.

## 0. 4 축 재해석 (deepteam ↔ Black Team)

```
deepteam 조직화                     Black Team 재해석
─────────────                       ────────────────────────
attacks/     → 공격 기술              attacks/<lane>/  (binary_patch, date_patch, …)
vulnerabilities/  → 방어결함          <각 레인이 노리는 defense weakness>
metrics/     → LLM-as-judge 스코어   check_bypassed?(O/X) 이진 스코어
guardrails/  → 방어                  defense_map.md (Blue 탐지/완화)
```

## 1. attacks — 4 우회 레인 (RED 원리)

레인은 Lane 0 S1–S8 과 1:1 매핑. Black Team 은 그 중 **바이너리· 라이선스·시간**을
deep-patch 하는 arm.

| lane | S | 공격 원리 | 노리는 방어결함 |
|---|---|---|---|
| **binary_patch** | S1, S6 | 정적 이진/asar 에서 라이선스 체크 함수를 상수 플립. OEP(출입점) 패치로 `is_pro()`·`check_license()`의 반환을 강제 | 클라이언트 코드 신뢰 (정적 분석으로 뚫림) |
| **date_patch** | S7 | 트라이얼 만료 시점을 미래로 위조 / 클락 회전 (NTP 미연동 활용) | 시간의 클라이언트 권위 |
| **crack_license** | S3, S5 | 라이선스 파일 위조 (`MaxUsers`/`Expiration` 재부호), 해시·LicenceKEY 알고리즘 재구현 | 약한 라이선스 검증 (평문/weak hash) |
| **circumvent** | S2, S4, S8 | frida 로컬 훅, 로컬 상태(캐시/플래그) 위조, 유효 응답 재플레이 | 로컬 상태/클라이언트 권위 신뢰 |

## 2. vulnerabilities — 각 레인이 노리는 방어 결함 (Blue 관점)

| 결함 ID | 결함 | 설명 | 관련 방어 (Blue) |
|---|---|---|---|
| **V1** | 클라이언트 코드 신뢰 | 정적 분석으로 체크 함수 식별·플립 가능 | 무결성 체크섬, 서명, 안티태퍼 |
| **V2** | 시간 클라이언트 권위 | 로컬 시계로 만료 판정 | 서버 권위 시간, NTP/원시 클록 연동 |
| **V3** | 약한 라이선스 검증 | 평문/weak-hash 라이선스 위조 가능 | 서명/암호화 저장, 키 강도 |
| **V4** | 로컬 상태 신뢰 | 캐시/플래그 위조, 게이트 스킵 | 서버 재검증, 변조 감지 |

> V1/V3/V4 는 `harness/plugins/t_vuln_license_seafile.py`(Blue)가 정적으로 탐지.
> V2(시간)는 서버 권위 검증이 Blue 담당 영역.

## 3. metrics — 공격 성공 판정 (이진 스코어)

deepteam 이 LLM-as-judge 로 이진 pass/fail 을 내듯, Black Team 은 **체크 우회 여부**
진단으로 스코어한다. `black_runner.py`가 이 스코어를 `black_findings.json`에 기록.

| 스코어 | 의미 | 판정 근거 |
|---|---|---|
| `check_bypassed = true` | 대상 체크 함수가 우회되어 라이선스/구독이 활성화됨 | PoC 가 타겟 파일에서 플립 후 재검증으로 `True` 반환 |
| `check_bypassed = false` | 우회 시도 실패 또는 대상 아님 | 플립 시그널 미탐지 / 타겟 매칭 실패 |
| `not_applicable` | 대상에 해당 방어 없음 / 매칭 안 됨 | 신호 스캔 결과 없음 |

## 4. guardrails — defense_map (Blue)

각 레인의 원리를 역이용한 Blue 탐지/완화. 상세는 [`defense_map.md`](defense_map.md).

| 공격 (Red) | Blue 탐지 지표 | Blue 완화 |
|---|---|---|
| binary_patch | 이진 시그널 변조, OEP 비정상, signature 부재 | 코드 서명, 무결성 비교, 안티태퍼 |
| date_patch | `Expiration` far-future, round date 위조 | 서버 권위 시간, NTP 연동 |
| crack_license | `MaxUsers` 과도하게 큼, weak hash, fake 키 | 서명/암호화 저장, 키 스트레칭 |
| circumvent | 로컬 플래그/캐시 위조 | 서버 재검증, 이상 패턴 탐지 |

## 5. 4 축 통합 뷰 (deepteam 원형 재구축)

```
            ┌──────────── ATTACKS (원리) ────────────┐
            │ binary_patch · date_patch · crack_license · circumvent │
            ├──────────── VULNERABILITIES (방어결함) ─┐
            │ V1 코드신뢰 · V2 시신뢰 · V3 약검증 · V4 로컬신뢰 │
            ├──────────── METRICS (스코어) ───────────┐
            │ check_bypassed?(O/X)  →  black_findings.json │
            ├──────────── GUARDRAILS (방어) ──────────┐
            │ 무결성·서명·서버권위·NTP·변조감지 (Blue)  │
            └───────────────────────────────────────────┘
```

> 이 팀의 궁극적 목적: “뚫리는 법(Black)”을 알고 “막는 법(Blue)”으로 연결하는
> **안티태퍼 평가(소프트웨어 보호)**. 본인 소유 앱·취약랩 대상 · 배포용 크랙 미제공.
