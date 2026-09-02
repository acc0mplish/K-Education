# attacks/date_patch — 시간조작 / 트라이얼 만료 (Clock Rotation)

> 🔴 Red 원리 · 🔵 Blue 탐지. **교육용 · 본인 소유/취약랩 대상만.**

## 공격 원리 (RED)

트라이얼/평가판은 **로컬 시계**로 만료를 판정한다. “시간이 지났으니 만료”를
재구성하면 평가판이 활성화된다. Deepteam 원리에서는 `attacks/` 축의
**single-turn 시점 위조**에 해당.

| 기법 | 동작 | 노리는 결함 |
|---|---|---|
| **만료 시점 위조** | 설치/설정 파일의 `Expiration`을 미래로 변경 | V2 (시간의 클라이언트 권위) |
| **클락 회전** | 가상환경/랩에서 시스템 시계를 뒤로/앞으로 회전 | NTP 미연동 로컬 판정 |
| **시각계 훅 (동적)** | `time.time()`/`date` 호출을 재배치 | 로컬 타임 소스 신뢰 |

## 대표 도구 (K-Education)

- **정적 스캔** — `Expiration` far-future/round-date 위조 탐지 (`t_vuln_license_seafile` R2)
- **동적** — virtualbox/랩에서 시계 회전 ( 격리 랩·운용자 수동 실행)

## 예시 실행 (own-lab)

```bash
python education/black_team/black_runner.py /path/to/own_target.cfg --i-own-this
# → evidence/<t>/black_findings.json (check_bypassed O/X)
```

## 🔵 BLUE — 탐지/완화

| 탐지 지표 | 의미 | 완화 |
|---|---|---|
| far-future 만료 | `Expiration` >= 2099 또는 원시적 원시 | 서버 권위 시간 기준 |
| round-date | 20xx-01-01 식 인위적 날짜 | 실제 발급 시각 저장 |
| NTP 미동기 | 로컬 시계와 서버 시계 불일치 | NTP/원시 클록 연동 강제 |
| 클록 히스토리 | 시계가 비정상적으로 뒤로 이동 | 단조 증가 검증 (monotonic) |

> 이 레인은 V2 (**시간 클라이언트 권위**) 결함을 노린다. Blue 측 서버 권위 검증은
> `docs/BLUE_TEAM.md` + `t_vuln_license_seafile` 의 Expiration 강제 영역.

## 윤리
본 PoC = **generic 원리 시연**. 본인 소유 앱/취약랩 외 실행 금지. 시계 회전은 격리 랩에서만. 타인 시스템·서비스 공격 금지.
모든 분석은 **로컬 LLM 전용** (데이터 유출 없음, main README §0).
