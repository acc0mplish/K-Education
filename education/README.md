# K-Education — 보안 공격 교육 자료 (Red/Blue 듀얼 퍼스펙티브)

각 공격 벡터 = 🔴 Red(offensive) + 🔵 Blue(defensive) 동시 교육.
산출물 = `evidence/<target>/security_report.html` (blue-team 핸드오프).

## 윤리 가드레일 (HARD)
- RED 실습 = **본인 소유 앱 또는 의도적 취약 랩**(DVWA/Juice Shop/WebGoat)에만.
- 모든 RED 엔드포인트는 비-로컬 타겟 거부(`--i-own-this` 어설션 필요).
- **제공 거부**: 분산/DoS 공격 도구, 배포용 크랙/keygen/범용 패처, 실제 피싱 무기화.
- 타인 시스템·서비스 공격·저작물 복제 금지.

## 구조
- `attacks/<lane>/` — 벡터별 매핑 문서 (Red 원리/페이로드 + Blue 탐지/완화)
- `redteam/<lane>/` — RED PoC 스크립트 (own-lab 대상) + `payloads/`
- `redteam/run_redteam.py` — 오케스트레이터 → `evidence/<t>/red_findings.json`
- `labs/README.md` — 취약랩 로컬 Docker 구성

## 레인
- **Lane 0 — 구독/라이선스 우회** (S1-S8) 🔥 최우선, cross-cutting
- Lane 1 — Electron / Lane 2 — Tauri / Lane 3 — 일반 바이너리 (후속 plan)

스펙: `docs/superpowers/specs/2026-06-21-security-attacks-dual-perspective-design.md`
