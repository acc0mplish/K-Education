# Lane 0 — 구독/라이선스 우회 (Subscription Bypass)

DAF 타겟-직결 최우선 벡터. asar JS + 바이너리 + API + 토큰에 걸침.
듀얼 퍼스펙티브: 🔴 어떻게 뚫리는가 / 🔵 어떻게 막는가.

## 🔴 RED — 우회 전술

| ID | 전술 | 도구/스크립트 |
|----|------|--------------|
| S1 | 정적 패치 — `SUBSCRIPTION_STATUS` 체크 플립, asar JS `isSubscribed()→true` | (후속: binary patch PoC) |
| S2 | 런타임 패치 — frida로 구독체크 후킹 | (후속: frida script) |
| S3 | 로컬 상태 변조 — 캐시 구독상태 위조 | (후속: store tamper PoC) |
| S4 | 응답 스푸핑 — `/api/subscription/mock-set` 직접 타격 | `redteam/subscription/s4_mock_endpoint.py` ✅ |
| S5 | 토큰/세션 위조 — premium 토큰 탈취 (A3 결합) | (후속) |
| S6 | 클라이언트 피처게이트 우회 — 로컬 플래그 플립 | (후속) |
| S7 | 시간조작 — 트라이얼 만료 클락 회전 | (후속) |
| S8 | 다운그레이드/리플레이 — 구버전/유효 응답 재생 | (후속) |

**S4 실습 (owned lab)**:
```bash
# 1) 로컬 취약랩 실행 (education/labs/README.md)
docker run -d -p 8080:80 --name dvwa vulnerables/web-dvwa
# 2) PoC 실행 (mock 엔드포인트 존재 확인)
python education/redteam/subscription/s4_mock_endpoint.py http://127.0.0.1:8080 --i-own-this
# 3) 통합 리포트 생성
harness/.venv/bin/python harness/main.py sec-report <target>
```

## 🔵 BLUE — 탐지/완화

| ID | 방어 | 정적 탐지 |
|----|------|-----------|
| D1 | 서버 권위 체크 — 클라이언트 상태 신뢰 금지 | 클라이언트-only 검증 패턴 (t_vuln_subscription) |
| D2 | 클라이언트 강화 — 무결성 체크섬/난독화/안티태퍼 | 무결성 검증 부재 |
| D3 | 서명/암호화 상태 저장 | 평문 SUBSCRIPTION 저장 |
| D4 | TLS pinning + 응답 서명 | pinning/cert 검증 부재 |
| D5 | 디버그 엔드포인트 제거 — `/api/subscription/mock-set` 금지 | mock 엔드포인트 strings ✅ |
| D6 | 변조 감지 — asar/binary 수정시 거부, frida 감지 | 변조감지 루틴 부재 |

**BLUE 실행**:
```bash
harness/.venv/bin/python harness/main.py analyze targets/<your.zip> --strategy full
# → evidence/<t>/vuln_subscription.out
```

## 산출물 흐름
```
RED: s4_mock_endpoint.py ─┐
                          ├─→ run_redteam.py → red_findings.json ─┐
BLUE: t_vuln_subscription ─→ vuln_subscription.out ────────────────┤
                                                                    ▼
                                              report_sec.py → security_report.html
                                                                    (blue-team 핸드오프)
```

## 윤리
본 문서/PoC = 안티태퍼 평가(소프트웨어 보호). 본인 소유 앱·취약랩 대상.
배포용 크랙/keygen/범용패처·DoS 도구 미제공. 타인 시스템 공격 금지.
