# attacks/circumvent — 로컬 피처게이트 / 클라이언트 권위 우회

> 🔴 Red 원리 · 🔵 Blue 탐지. **교육용 · 본인 소유/취약랩 대상만.**

## 공격 원리 (RED)

앱이 **로컬 상태(플래그/캐시/환경변수)**를 신뢰해 “기능 활성화”를 판정할 때, 그
로컬 상태를 위조하면 서버 검증 없이 기능을 회피한다. Deepteam 원리에서는
`attacks/` 의 **permission_escalation / input_bypass**에 해당.

| 기법 | 동작 | 노리는 결함 |
|---|---|---|
| **플래그 위조** | `FLAG_PREMIUM=true` / 캐시 플래그 위조 | 로컬 상태 신뢰 (V4) |
| **환경변수 우회** | `DEMO_MODE=1` 식 게이트 설정 | 로컬 설정 권위 |
| **캐시 스킵** | 유효한 로컬 결과를 재사용해 재검증 생략 | 서버 재검증 부재 |

## 대표 도구 (K-Education)

- **동적 스캔** — `frida`로 로컬 게이트 함수 훅 ( 격리 랩·운용자 수동 실행)
- **정적 스캔** — 환경변수/플래그 게이트 문자열 식별 (strings)

## 예시 실행 (own-lab)

```bash
# 본인 소유 앱의 로컬 게이트를 일반 플래그로 우회 (owned target)
python education/black_team/attacks/circumvent/poc_circumvent.py <own_file> --i-own-this
# → evidence/<t>/black_findings.json (check_bypassed O/X)
```

## 🔵 BLUE — 탐지/완화

| 탐지 지표 | 의미 | 완화 |
|---|---|---|
| 로컬 플래그 위조 | `FLAG_*`를 true 로 강제 | 서버 재검증 |
| 게이트 환경변수 | `DEMO_MODE` 식 무조건 허용 | 환경변수 게이트 제거 |
| 캐시 재사용 | 재검증 없는 로컬 결과 사용 | 캐시 서명/유효기간 |
| 이상 패턴 | 비정상 플래그 조합 | 이상 패턴 탐지 |

> 이 레인은 V4 (**로컬 상태 신뢰**) 결함을 노린다. Blue 측 “서버 권위” 방어는
> `docs/BLUE_TEAM.md`의 D1(클라이언트 상태 신뢰 금지) 영역.

## 윤리
본 PoC = **generic 게이트 시연**. 본인 소유 앱/취약랩 외 실행 금지. frida 등
동적 도구는 격리 랩에서만. 타인 시스템·서비스 공격 금지.
