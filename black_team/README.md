# Black Team — 상용 라이선스 무력화 공격 연구 (License Cracking Research)

> **교육용 ·본인 소유/인가된 자산 대상만.** 본 팀은 라이선스/구독 보호를 뚫는
> **가장 공격적인 적대 퍼스펙티브(black team)**를 문서·PoC로 정리한다.
> 무기화 자동화 코드는 0건 — 모든 PoC는 **본인 소유 앱·의도적 취약 랩**에서만,
> 운용자가 **격리 랩에서 수동 실행**한다. 타인 시스템 침해·저작물 복제 금지.

## 0. 로컬 LLM 전용 (Privacy First)

Black Team 은 **로컬 LLM에서만 동작**합니다. 클라우드 API를 사용하지 않아 분석의
기본 윤리가 보장된다.

- **데이터 유출 없음** — 타겟 앱·독 보호 정보가 외부로 나가지 않음
- **로컬 기록만** — 결과/경로/문서 전부 로컬 (`evidence/<t>/`), 네트워크 격리 불필요
- **인스턴스 격리** — 각 PoC/분석은 분리된 로컬 환경에서 실행
- **우회 시도 시 즉시 정지** — 비로컬·타인 자산 접근 시도 차단

> 즉, Black Team = “로컬 LLM으로만 수행하는 공격 연구팀”이며, 이 제약이
> 윤리적·법적 리스크를 근본적으로 억제한다.

## 1. 이 팀은 무엇인가 (Red vs Black)

K-Education 는 원래 **RED(공격적 평가) / BLUE(방어)** 2원 구조다. Black Team 은
RED 의 **라이선스 무력화 하위 집합**으로, “어떻게 뚫리는가”를 deepest 까지 파고든다.
실무에서는 “black team = 적의 모든 수단을 쓰는 최강력 threat actor”를 뜻한다.

| 퍼스펙티브 | 관점 | K-Education 위치 |
|---|---|---|
| 🔴 Red | 공격적 평가 (SAST/SCA/웹/포렌식) | `docs/RED_TEAM.md`, `education/attacks/` |
| ⚫ **Black** | **라이선스 무력화에 특화된 적대 공격** | **이 문서 (`education/black_team/`)** |
| 🔵 Blue | 방어·감지 (무결성/서명/서버 권위) | `docs/BLUE_TEAM.md`, `t_vuln_license_seafile` |

## 2. deepteam 에서 얻은 인사이트 (구조 차용)

참조 레포 (`klic-awesome-code/deepteam` = **confident-ai/deepteam**, LLM 레드팀
프레임워크)의 내용은 아니지만 **조직화 방식**을 차용했다. deepteam 은 공격을
4개 축으로 정리한다 → Black Team 은 이를 라이선스 무력화에 맞게 재해석:

| deepteam 축 | Black Team 재해석 |
|---|---|
| **attacks/** (single-turn/multi-turn) | `attacks/<lane>/` — 4개 우회 레인 (아래) |
| **vulnerabilities/** ( Defense weakness ) | 각 레인이 노리는 **방어 결함** (TAXONOMY 참조) |
| **metrics/** (LLM-as-judge) | 공격 성공 = `check_bypassed?(O/X)` 이진 스코어 |
| **guardrails/** (방어) | `defense_map.md` — Blue 탐지/완화 |

이 재해석의 상세 분류는 [`TAXONOMY.md`](TAXONOMY.md) 를 볼 것.

## 3. 범위

**포함 (본 팀):** 상용 라이선스/구독 무력화 4 전술
- 🔹 **binary_patch** — 바이너리 정적 패치로 라이선스 체크 플립 (크랙의 핵심)
- 🔹 **date_patch** — 시간조작 / 트라이얼 만료 클락 회전
- 🔹 **crack_license** — 라이선스 파일 위조·검증 로직 우회
- 🔹 **circumvent** — 로컬 피처게이트/클라이언트 권한 우회 (우회)

**제외 (범위 밖 — Blue 위임):** DoS/피싱/원격 무기화. 서버 권위 검증 결함은
`t_vuln_license_seafile`(Blue) 가 담당.

## 4. 레인 요약 (RED 원리 → BLUE 탐지)

| 레인 | 뚫는 방어 | 대표 전술 | Blue 탐지 |
|---|---|---|---|
| `attacks/binary_patch/` | 클라이언트 코드 신뢰 | 체크 함수 플립, OEP 패치 | 무결성/서명, 안티태퍼 |
| `attacks/date_patch/` | 시간 클라이언트 권위 | 클락 회전, 만료 위조 | 서버 권위 시간, NTP 연동 |
| `attacks/crack_license/` | 라이선스 검증 약함 | 파일 위조, 해시/키 알고리즘 재구현 | 서명/암호화 저장, 이상 패턴 |
| `attacks/circumvent/` | 로컬 상태 신뢰 | 플래그/캐시 위조, 게이트 스킵 | 변조 감지, 서버 재검증 |

전체 8종 (S1–S8) 은 Lane 0 문서 (`education/attacks/subscription/01_subscription_bypass.md`)
와 1:1 매핑 — Black Team 은 그 중 **바이너리·라이선스·시간** 깊게 파는 arm.

## 5. 실행 (owned lab)

```bash
# 1) 본인 앱 or 취약랩 타겟 준비 (education/labs/README.md)
# 2) Black orchestrator 로 모든 레인 실행 (own-lab 대상)
python education/black_team/black_runner.py /path/to/own_target.bin --i-own-this

# 3) Blue 로 변조 탐지 (defensive detector)
harness/.venv/bin/python harness/main.py analyze <target.zip> --strategy full
# → evidence/<t>/black_findings.json (RED) + vuln_license.out (BLUE)
```

`black_runner.py` 는 등록된 PoC 를 순회하며 `evidence/<t>/black_findings.json`
에 이진 스코어를 기록한다 (`run_redteam.py` 와 동형). 각 PoC 는 `--i-own-this`
없으면 비-로컬 타겟을 거부한다.

## 6. 산출물 흐름
```
black_runner.py
  ├─ attacks/binary_patch/poc_binary_patch.py
  ├─ attacks/date_patch/poc_clock_rotate.py
  ├─ attacks/crack_license/poc_license_forgery.py        # DefGuard generic 위조
  ├─ attacks/crack_license/poc_seafile_license.py        # Seafile Pro 다각도 우회
  └─ (circumvent: 수동 절차)
        └─→ evidence/<target>/black_findings.json
```

## 7. 윤리 (로컬 LLM 기반)
Black Team 은 **모든 분석을 로컬 LLM으로 수행**하여 데이터 유출·원격 개입 리스크가
근본적으로 낮다. 아래는 기본 원칙이지만, 로컬 환경이라는 성격상 과도한 제약보다는
**의식된 사용**을 지향한다.

- **로컬 LLM 전용** — 클라우드 API 없음. 타겟 데이터가 외부로 나가지 않음.
- **본인 앱 / 의도적 취약랩 대상** — `--i-own-this` 어설션으로 본인 자산임을 확인.
- **제공 제한** — 배포용 크랙·keygen·범용 패처·DoS 도구 등은 원칙적으로 제공 안 함.
- **타인 대상 회피** — 본인이 소유/권한 받은 시스템 외 공격은 피해.
- 궁극적 목적: **안티태퍼 평가(소프트웨어 보호)** — “뚫리는 법”을 알고 “막는 법(Blue)”으로.

> 로컬 LLM + owned/lab 대상 + generic PoC → 윤리/법적 리스크가 최소화되는 구성.
> 실제 상용 소프트웨어 우회 이진보다는 **원리 시용**에 집중.

## 8. 디렉토리 구조
```
education/black_team/
├── README.md               # 이 문서
├── TAXONOMY.md             # attacks/vulnerabilities/metrics/guardrails 재해석
├── black_runner.py         # orchestrator → black_findings.json
├── defense_map.md          # BLUE 탐지/완화 (t_vuln_license_seafile 와 연동)
├── labs/README.md          # owned-lab 실습 타겟
└── attacks/
    ├── binary_patch/       # 🔹 바이너리 정적 패치 (crack 핵심)
    ├── date_patch/         # 🔹 시간조작 / 트라이얼 만료
    ├── crack_license/      # 🔹 라이선스 파일 위조·검증 우회 (DefGuard · Seafile Pro)
    └── circumvent/         # 🔹 로컬 피처게이트 우회 (우회)
```

> 본 폴더의 PoC/도구는 `education/` 분석 산출물 관례에 따라 git 신규 추적 대상이
> 아닐 수 있음. 추적된 reference 파일은 기존 `education/attacks/`·`redteam/`과 동일.
