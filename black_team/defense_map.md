# defense_map — Black 공격 ↔ Blue 탐지/완화 매핑

> Deepteam 의 `guardrails/` 재해석. 각 Black 레인의 원리를 역이용한 Blue 방어.
> 정적 탐지 규칙은 `harness/plugins/t_vuln_license_seafile.py`(Blue)와 1:1 대응.

## 0. 통합 뷰 (attack ↔ vulnerability ↔ defense)

```
Black 공격              노리는 결함     Blue 방어 (탐지 + 완화)
────────────────────    ────────────    ─────────────────────────────
binary_patch(S1,S6)     V1 코드신뢰     무결성 비교 · 코드 서명 · 안티태퍼
date_patch(S7)          V2 시신뢰       서버 권위 시간 · NTP 연동 · monotonic
crack_license(S3,S5)    V3 약검증       서명·암호화 저장 · 키 스트레칭
circumvent(S6)          V4 로신뢰       서버 재검증 · 변조·이상 패턴 탐지
```

## 1. 레인별 Blue 지표 (`t_vuln_license_seafile` 스캔 규칙과 매핑)

| Black 레인 | Blue 탐지 신호 | 심각도 | 완화 (remediation) |
|---|---|---|---|
| binary_patch | `user_number_over_limit` fail-open `except: return False` | high | L-D1 — fail-open 제거, 반환 강제 |
| binary_patch | `is_pro_version` hardcoded `return True/1` | high | L-D4 — 상수 플립 방어, 동적 판정 |
| binary_patch | `IS_PRO_VERSION` DEBUG 오버라이드 | med | L-D5 — 디버그 오버라이드 제거 |
| date_patch | `Expiration` far-future (`209\d`/`2\d{3}-`) | med | L-D2/L-D8 — 서버 권위 시간 검증 |
| crack_license | `MaxUsers` 7+ 자리 (위조 인디케이터) | high | L-D3 — 서버 권위 발급·수량 검증 |
| crack_license | weak/missing `Hash`/`LicenceKEY` | high | L-D3 — 서명·암호화 저장 |
| circumvent | 로컬 게이트/플래그 위조 | med | L-D4 — 서버 재검증, 이상 패턴 |

> 신호 ID(`L-Dx`)는 `t_vuln_license_seafile`의 `remediation` 필드와 동일 표기.

## 2. Blue 실행 (정적 탐지)

```bash
# 본인 소유 앱 or Seafile 설치 트리 대상 (extracted dir 또는 zip)
harness/.venv/bin/python harness/main.py analyze <target.zip> --strategy full
# → evidence/<t>/vuln_license.out (Blue findings) + evidence/<t>/black_findings.json (Black)
```

## 3. 방어 권장 사항 (공통)

| 방어 | why |
|---|---|
| **서버 권위** | 클라이언트 상태(구독/라이선스/시간) 신뢰 금지 — D1 |
| **무결성 + 서명** | 이진/asar 번들에 시그널 해시 저장·부팅 시 검증 — D2 |
| **암호화 저장** | 라이선스/키를 평문 대신 서명·암호화 — D3 |
| **NTP/원시 클록** | 시간 판정 서버 권위 연동, monotonic 검증 — D2/L-D8 |
| **변조 탐지** | 로컬 플래그/캐시 위조 이상 패턴 — D4 |

## 4. 산출물 흐름

```
Black: black_runner.py ─┐
                         ├─→ black_findings.json (RED) ─┐
Blue : t_vuln_license_seafile ─→ vuln_license.out ───────┤
                                                            ▼
                                                    report_sec.py
                                                      → security_report.html
```

> 이 맵은 “뚫리는 법(Black)”을 “막는 법(Blue)”으로 연결하는 안티태퍼 평가용.
> 본인 소유 앱·취약랩 대상 · 배포용 크랙 미제공 · 타인 시스템 공격 금지.
