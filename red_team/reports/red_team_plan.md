# Red Team 계획서 (Engagement Plan)

- **대상(Target)**: {{TARGET}}
- **일자(Date)**: {{DATE}}
- **범위(Scope)**: {{SCOPE}}
- **교전 규칙(RoE)**: {{ROE}}

## 테스트 벡터 (Lane 0 — S1-S8)
| ID | 전술 |
|----|------|
| S1 | 정적 패치 (구독체크 플립) |
| S2 | 런타임 패치 (frida 후킹) |
| S3 | 로컬 상태 변조 |
| S4 | mock 엔드포인트 응답 스푸핑 |
| S5 | 토큰/세션 위조 |
| S6 | 클라이언트 피처게이트 우회 |
| S7 | 시간조작 (트라이얼) |
| S8 | 다운그레이드/리플레이 |

## 방법론
1. 정적 분석(t_vuln_subscription)으로 우회 지점 식별
2. RED PoC(s4_mock_endpoint 등)로 익스플로잇 증명 (owned/lab)
3. 결과 → red_team_result.md + security_report.html

## 성공 기준
- 구독 상태를 클라이언트 단독으로 우회 가능함을 증명
- blue-team 핸드오프 리포트 산출

## 윤리
본인 소유 앱·취약랩 대상. 비파괴. 크랙/keygen/DoS 도구 미사용.
