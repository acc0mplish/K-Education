# 보안 공격 교육 자료 — Red/Blue 듀얼 퍼스펙티브 하네스 설계

> 작성일: 2026-06-21
> 상위: K-Education RE 워크플로우 하네스 (`WORKFLOW_PLAN.md`)의 보안 교육 확장
> 성격: 본인 소유 앱(DAF Launcher 계열) + 의도적 취약 랩(DVWA/Juice Shop/WebGoat) 대상. red→blue 핸드오프 리포트 모델.

---

## 0. 문서 메타

- **목적**: 기존 RE 하네스(defensive 관찰)에 **offensive(red) + defensive(blue) 양쪽 관점**의 보안 공격 교육 자료를 추가.
- **원래 요청 8개 주제**: SQLi, XSS, DDoS, brute/weak-auth, zero-day, API abuse, CDN/DNS, social engineering.
- **설계 결정(사용자)**:
  1. 형태 = 하네스 탐지 확장에서 **듀얼 퍼스펙티브(red+blue)** 로 확정.
  2. RED 깊이 = (c) 공격 PoC 스크립트 + **red→blue 핸드오프 리포트**(purple-team 모델).
  3. **웹 중심 배제** — 실제 타겟이 데스크톱 앱(Electron PE/asar)이므로 웹 레이어(Cloudflare 상쇄)가 아닌 **앱 자체가 공격면**.
  4. **Tauri 레인 추가** — Electron과 다른 공격면, 병렬 레인.
  5. 최종 scope = **3레인 (Electron + Tauri + 일반 바이너리)**.
  6. **구독/라이선스 우회(S) = Lane 0 최우선 cross-cutting 그룹** — DAF에 실제 구독 로직(`SUBSCRIPTION_PLAN/STATUS` env, `/api/subscription/mock-set` 엔드포인트) 존재. 타겟-직결성 최고 → asar JS + 바이너리 + API + 토큰에 걸쳐 단일 레인 안에 안 갇힘. 전용 그룹(Lane 0)으로 3레인 위에 우선 배치.

---

## 1. 핵심 원칙: Red/Blue 듀얼 퍼스펙티브

각 공격 벡터 = 두 관점 동시 교육:

- **🔴 Red (offensive)** — 공격 원리·페이로드 패턴·공격자 워크플로우·own-lab PoC. "어떻게 뚫리는가" 이해. 산출물 = `red_findings.json`.
- **🔵 Blue (defensive)** — 정적 탐지·완화·시큐어 코딩 처방. "어떻게 막는가". 산출물 = coverage `.out` + 매핑 문서.

**핵심 산출물 = 통합 `security_report.html`** = blue-team 핸드오프 아티팩트. red 증거(익스플로잇 확인) + blue 탐지(정적 발견)를 한 리포트에 병합. 각 finding: red-확인방법 + blue-탐지 + 심각도 + 완화 + 랩 재현.

기존 하네스 원칙("전체 사용 ≠ 전체 성공", 실패/timeout 투명 기록) 준수. 정적 탐지 불가/약한 항목은 catalog `note`와 문서에 명시.

---

## 2. 왜 앱 중심인가 (웹 배제 근거)

| 측면 | 웹 서비스 | 데스크톱 앱 (실제 타겟) |
|------|-----------|------------------------|
| WAF/CDN | Cloudflare가 SQLi/XSS/봇 거의 차단 | 해당 없음 — 앱 자체가 직접 공격면 |
| XSS 영향 | 쿠키 탈취 수준 | Electron: `nodeIntegration`시 **RCE**直达 |
| 코드 가시성 | 서버 사이드 불가 | asar/Rust 바이너리로 **정적 분석 가능** |
| 업데이트 | 서버 푸시 | **auto-update 채널 MITM** = 영구 RCE 벡터 |

→ 웹 레드팀은 실제 threat surface와 불일치. **앱 자체 공격면**에 집중. 기존 하네스가 이미 DAF 앱 표면 일부 건드림(`electron_detect`: DAF_API_TOKEN env, `/api` 엔드포인트, auto-update 패턴, eval, PowerShell bypass) → red exploit + blue 탐지가 실제 타겟에 직결.

---

## 3. 아키텍처

```
K-Education/
├── (기존 RE 하네스 — 변경 없음, 그대로 동작)
│
├── education/                          # NEW — 듀얼 퍼스펙티브
│   ├── README.md                       # red/blue 철학 + 윤리 범위 (본인소유/취약랩만)
│   ├── attacks/                        # 🔴🔵 벡터별 매핑 문서
│   │   ├── _template.md                # 공통 구조: RED(원리+페이로드+랩) + BLUE(탐지/완화) + redteam 매핑
│   │   ├── electron/                   # Lane 1 문서 (A1-A5)
│   │   ├── tauri/                      # Lane 2 문서 (TA1-TA9)
│   │   └── binary/                     # Lane 3 문서 (B1-B4)
│   └── labs/
│       └── README.md                   # DVWA/Juice Shop/WebGoat 로컬 Docker 구성 (실습용)
│
├── education/redteam/                  # 🔴 RED — own-lab 대상 PoC + 페이로드 라이브러리
│   ├── subscription/                   # Lane 0 red PoC (S1-S8) — 최우선
│   ├── electron/                       # Lane 1 red PoC (A1-A5)
│   ├── tauri/                          # Lane 2 red PoC (TA1-TA9)
│   ├── binary/                         # Lane 3 red PoC (B1-B4)
│   ├── payloads/                       # 페이로드 라이브러리 (sqli/xss/wordlists/electron-ipc/tauri-cmd)
│   └── run_redteam.py                  # 오케스트레이터 → evidence/<target>/red_findings.json
│
├── harness/plugins/                    # 🔵 BLUE 확장 — 정적 감지 플러그인
│   ├── t_vuln_subscription.py          # Lane 0: 구독/라이선스 우회 정적 탐지 (S1-S8)
│   ├── t_vuln_electron.py              # Lane 1: Electron misconfig (A1,A2,A3,A4)
│   ├── t_vuln_tauri.py                 # Lane 2: Tauri conf/command (TA1-TA9)
│   ├── t_vuln_binary.py                # Lane 3: secrets/sideload/license (B1-B4)
│   └── t_vuln_deps.py                  # 공통: 의존성 N-day/CVE (A5,TA6)
│
├── harness/report_sec.py               # 🔴🔵 통합 → evidence/<target>/security_report.html
│                                       #   = blue-team 핸드오프 산출물
└── tool_catalog.json                   # +5 tier-7 "vuln-detect" 행
```

### 3.1 데이터 흐름

```
┌──────────────── RED ────────────────┐   ┌──────── BLUE ────────┐
│ redteam/electron/*.py  (PoC on lab) │   │ t_vuln_electron.py   │
│ redteam/tauri/*.py                  │   │ t_vuln_tauri.py      │
│ redteam/binary/*.py                 │   │ t_vuln_binary.py     │
└──────────────┬──────────────────────┘   │ t_vuln_deps.py       │
               │ red_findings.json        └──────────┬────────────┘
               │                                     │ coverage .out
               ▼                                     ▼
        ┌────────────────────────────────────────────────┐
        │        report_sec.py  (merge + enrich)         │
        │  finding: red-confirm + blue-detect + severity │
        │           + remediation + lab-repro            │
        └────────────────────┬───────────────────────────┘
                             ▼
        evidence/<target>/security_report.html   ← blue-team 핸드오프
```

---

## 4. 공격 벡터 인벤토리 (Lane 0 + 3레인)

### Lane 0 — 구독/라이선스 우회 (S1-S8) — 🔥 최우선, cross-cutting

DAF 타겟-직결. asar JS + 바이너리 + API + 토큰에 걸침 → 단일 레인 안 갇힘.

**🔴 RED — 우회 전술**

| ID | 전술 | DAF 관련 |
|----|------|----------|
| S1 | 정적 패치 — `SUBSCRIPTION_STATUS` 체크 `cmp/jz` 플립, asar JS `isSubscribed()→true` | asar JS + PE |
| S2 | 런타임/메모리 패치 — frida로 구독체크 함수 후킹 (frida 브릿지 기존 존재) | 동적 |
| S3 | 로컬 상태 변조 — 캐시 구독상태(config/레지스트리/localStorage/SQLite) 위조 | env 기반 상태 |
| S4 | 응답 스푸핑 — `/api/subscription/*`,`/api/me` 응답 위조 → premium | **`/api/subscription/mock-set` 직접 타격** |
| S5 | 토큰/세션 위조 — premium 계정 토큰 탈취/위조 (A3 결합) | DAF_API_TOKEN |
| S6 | 클라이언트 피처게이트 우회 — 로컬 플래그만 신뢰 → 플립 | 클라이언트 검증 |
| S7 | 시간조작 — 트라이얼 만료 시스템 클락 회전 | 트라이얼 있으면 |
| S8 | 다운그레이드/리플레이 — 구 취약버전 / 유효 구독응답 재생 | 업데이터 채널 |

**🔵 BLUE — 방어/강화**

| ID | 방어 | 정적 탐지 (t_vuln_subscription) |
|----|------|-------------------------------|
| D1 | **서버 권위 체크** — 클라이언트 상태 신뢰 금지, 프리미엄 기능 서버 게이트 (진짜 픽스) | 클라이언트-only 검증 패턴 = 취약 신호 |
| D2 | 클라이언트 강화 — 난독화, asar/바이너리 무결성 체크섬, 안티디버그/태퍼 | 무결성 검증 호출 부재 |
| D3 | 서명/암호화 구독상태 — 평문 저장 금지, 서명 검증 | 평문 `SUBSCRIPTION_*` 저장 |
| D4 | TLS pinning + 응답 서명 — 서버 응답 서명, 클라이언트 검증 | pinning/cert 검증 부재 |
| D5 | 디버그 엔드포인트 제거 — **`/api/subscription/mock-set` 프로덕션 금지** | mock/debug 엔드포인트 strings |
| D6 | 변조 감지 — asar/binary 수정시 실행 거부, frida/디버거 감지 | 변조감지 루틴 부재 |

**윤리 선**: 안티태퍼 평가(소프트웨어 보호). RED PoC = 분석용 own 사본에서 우회 **메커니즘 증명** → blue-team 핸드오프 → D1-D6으로 우회 불가능하게 강화. **배포용 크랙/keygen/범용패처 제공 거부.**

---

### Lane 1 — Electron (A1-A5)

| ID | 벡터 | RED PoC | BLUE 탐지 |
|----|------|---------|-----------|
| A1 | 렌더어 escape (XSS→RCE): `nodeIntegration:true`/`contextIsolation:false`/`webSecurity:false` → `require('child_process')` | 페이로드 주입 → calc/cmd 실행 확인 | BrowserWindow 옵션 스캔, preload 노출 |
| A2 | auto-update 악용: sha256/서명 검증 우회 → MITM 악성 업데이트 | 위조 업데이트 메니페스트 → 실행 확인 | updater 검증 호출 패턴, 하드코딍 origin |
| A3 | 크리덴셜/토큰 탈취: `DAF_API_TOKEN` env/메모리/disk | 프로세스 env 추출, safeStorage 복호 | env 노출, 평문 토큰 저장 (기존 탐지 확장) |
| A4 | IPC/preload 과노출: contextBridge 권한 API 노출 | 노출 IPC 호출 → 권한 상승 | ipcMain/ipcRenderer/contextBridge 매핑 |
| A5 | 의존성 N-day: Electron/Chromium/Node 버전 CVE | 공개 PoC 적용(own lab) | Electron 버전 → CVE DB 매핑 |

### Lane 2 — Tauri (TA1-TA9)

| ID | 벡터 | RED PoC | BLUE 탐지 |
|----|------|---------|-----------|
| TA1 | `#[tauri::command]` 인젝션: unsanitized arg → shell/fs | 커맨드 arg로 셸/경로 인젝 | 바이너리 strings: `Command::new`,`std::process`, 커맨드명 추출 |
| TA2 | capabilities/ACL 과권한(v2) / allowlist misconfig(v1): shell/fs/process 노출 | 노출 API 호출 → RCE | `tauri.conf.json` allowlist + capabilities/*.json 스캔 |
| TA3 | updater 서명 우회: Ed25519 `pubkey` bypass → 악성 업데이트 | 위조 서명/메니페스트 → 실행 | updater 설정, pubkey 존재/강도 |
| TA4 | scope/path-traversal 우회: fs/http scope 탈출 | `../`/절대경로로 임의 파일 | scope 설정 객체 검사 |
| TA5 | 커스텀 프로토콜 남용: `tauri://`/`asset://` SSRF/traversal | 프로토콜 핸들러 악용 | 프로토콜 핸들러 등록 패턴 |
| TA6 | WebView2/WebKitGTK N-day: OS 웹뷰 CVE | 공개 PoC(플랫폼별) | 웹뷰 엔진/버전 감지 |
| TA7 | 크로스오리진 IPC: `dangerousRemoteDomainIpcAccess`/리모트 콘텐츠 | 외부 도메인 JS → 커맨드 | conf 원격 접근 설정 |
| TA8 | Rust 바이너리 시크릿 추출 | strings/디컴파일로 키 추출 | 평문 시크릿 strings 매칭 |
| TA9 | 프론트엔드 XSS → IPC → 권한 커맨드 | XSS → `invoke()` → 위험 커맨드 | 프론트엔드 JS `invoke('...')` 매핑 |

### Lane 3 — 일반 바이너리 (B1-B4)

| ID | 벡터 | RED PoC | BLUE 탐지 |
|----|------|---------|-----------|
| B1 | 로컬 시크릿/설정 추출: 평문 크리덴셜, 약한 난독화 | config 파일/레지스트리 덤프 | 평문 크리덴셜 패턴 |
| B2 | 라이선스/구독 우회: `SUBSCRIPTION_STATUS` 체크 패치 | 바이너리 패치/메모리 후킹 | 라이선스 체크 함수 패턴 |
| B3 | DLL/라이너리 사이드로딩: Windows PE PATH 하이재킹 | 악성 DLL 배치 → 로드 확인 | import table, 로드 경로 하드코딩 |
| B4 | 안전하지 않은 로컬 저장소: SQLite/localStorage 인젝션 | 로컬 DB 인젝션 | 평문 로컬 DB 사용 |

---

## 5. 제외 항목 (정직한 표기)

| 항목 | 제외 이유 | 대체 |
|------|----------|------|
| **C — 웹/CDN-bypass** (origin discovery) | 사용자 선택: 웹 중심 배제. Cloudflare 상쇄 | (없음 — scope 외) |
| **DDoS 공격/분산 스크립트** | 분산 DoS = 파괴적 공격, 타인 인프라 피해. 교육 맥락도 제공 거부(단단한 선) | `03_ddos.md` 이론(메커니즘)+방어 체크리스트만. 선택적 `redteam/binary/loadtest_self.py`(자체 1-오리진 부하테스트, 분산 아님) |
| **zero-day 스크립트** | 미지 취약점 by 정의 → 스크립트 불가 | A5/TA6 **N-day**로 정정 (공개 CVE PoC, own lab) |
| **social engineering 무기화** | 실제 피싱 템플릿 = 타인 표적 공격 | `08_social_engineering.md` 인식교육 + 허가된 조직 시뮬레이션 프레임 이론. 앱=전달매체(trojanized 설치본/가짜 업데이트) 관점 |

---

## 6. 윤리 가드레일 (`education/README.md`에 명시)

1. RED 실습 = **본인 소유 앱 또는 의도적 취약 랩**(DVWA/Juice Shop/WebGoat)에만.
2. DDoS 실습 = 이론 + 자체 서버 1-오리진 부하테스트 한정. **분산/증폭 공격 도구 제공 안 함.**
3. Social eng = 인식교육/레드팀 시뮬레이션 이론 한정. 실제 피싱 무기화 안 함.
4. 타인 시스템·서비스 공격·저작물 복제 금지 (기존 하네스와 동일).
5. 각 RED PoC는 타겟 명시(`--target`) + dry-run 기본 + 인증 범위 어설션.

---

## 7. BLUE 감지기 설계 (기존 패턴 확장)

기존 `codebase_audit.py`/`electron_detect.py` 패턴(regex PATTERNS dict over zip/asar/source bytes → JSON findings) 그대로 적용:

- **`t_vuln_subscription.py`** (covers S1-S8, Lane 0 최우선): 클라이언트-only 구독검증 패턴(`SUBSCRIPTION_PLAN/STATUS`,`isSubscribed`,`isPremium`), 평문 구독상태 저장, mock/debug 엔드포인트 strings(`/api/subscription/mock-set`), asar/binary 무결성 검증 부재, 서버 권위 체크 부재(클라이언트 플래그 신뢰). asar/zip/pe/elf. (기존 `electron_detect.py` daf_env/KEEP_ENDPOINTS 패턴 직접 확장.)
- **`t_vuln_electron.py`** (covers A1,A2,A3,A4): BrowserWindow 옵션, contextIsolation/nodeIntegration/webSecurity, preload 노출, IPC 매핑, auto-update 검증 호출 패턴, env/평문 토큰 저장. asar/zip JS + `package.json` 스캔. (기존 `electron_detect.py` 패턴 확장.)
- **`t_vuln_tauri.py`** (covers TA1,TA2,TA4,TA5,TA7,TA8,TA9): `tauri.conf.json` allowlist(v1)/capabilities(v2) 스캔 + 바이너리 strings(`tauri::`,`Command::new`,`std::process`,`#[tauri::command]`명) + scope 객체 + 원격 접근 설정 + 프론트엔드 `invoke()` 매핑. PE/ELF + conf + JS.
- **`t_vuln_binary.py`** (covers B1,B2,B3,B4): 평문 크리덴셜, 약한 해시, import table 사이드로드 경로, 라이선스/구독 체크 패턴, 평문 로컬 DB 사용. PE/ELF.
- **`t_vuln_deps.py`** (covers A5,TA6): 의존성 버전(Electron/Tauri/Node/Chromium/WebView2/WebKitGTK) → 로컬 CVE DB 매핑. catalog `installPath` 고정.
- (TA3 Tauri updater 서명 검증 강도도 `t_vuln_tauri`에서 정적 확인; 우회 자체는 RED PoC 영역.)
- catalog 행: `tier: 7`, `note: "vuln-detect"`, targetProfiles는 레인별(asar/zip/pe/elf).
- `report_sec.py`: 위 감지 `.out` + `red_findings.json` 병합 → HTML.

---

## 8. 검증 필요 (구현 전 듀얼 퍼스펙티브 웹검색으로 확정)

전역 규칙(web-search.md: 실무+비판 이중 검색) 적용 대상:

- **Tauri v1 vs v2 보안 모델 차이**: allowlist(v1) → capabilities/ACL(v2) 마이그레이션 정확한 필드명/기본값.
- **최신 Tauri CVE**: tao/wry/tauri-core CVE(2024-2026), WebView2/WebKitGTK N-day.
- **Electron 보안 권고 최신**: contextIsolation 기본값 변화, sandbox 요구사항.
- **의존성 CVE 매핑 소스**: NVD/OSV/ advisories — 로컬 DB vs API.

---

## 9. 산출물 목록

| # | 산출물 | 경로 | 레인 |
|---|--------|------|------|
| 1 | 교육 매핑 문서 | `education/attacks/{subscription,electron,tauri,binary}/*.md` (Lane별 + 벡터별) | ALL |
| 2 | 랩 구성 가이드 | `education/labs/README.md` | ALL |
| 3 | RED PoC 스크립트 | `education/redteam/{subscription,electron,tauri,binary}/*.py` | ALL |
| 4 | 페이로드 라이브러리 | `education/redteam/payloads/` | ALL |
| 5 | RED 오케스트레이터 | `education/redteam/run_redteam.py` | ALL |
| 6 | BLUE 감지 플러그인 ×5 | `harness/plugins/t_vuln_*.py` | ALL |
| 7 | 통합 리포트 생성기 | `harness/report_sec.py` | ALL |
| 8 | catalog +5 행 | `tool_catalog.json` | ALL |
| 9 | 교육 README/윤리 | `education/README.md` | ALL |
| 10 | DDoS/SE 예외 문서 | `education/attacks/{ddos,social_engineering}.md` | (제외주제) |

---

## 10. 범위 외 (Out of Scope)

- 웹 서비스 직접 공격(SQLi/XSS on 원격 웹앱) — Cloudflare 상쇄 + 타겟 불일치.
- 모바일 네이티브(Android/iOS) — 별도 scope(mobsf는 기존 catalog에 stub 존재).
- macOS 앱 포팅 — 기존 §16 계획 참조.
- 실제 zero-day 발굴 — N-day 분석으로 대체.
- 운영용 공격 인프라(봇넷/C2) — 제공 거부.

---

*본 설계는 본인 소유 앱·교육 목적의 red→blue 보안 교육 자동화. 타인 시스템 침해·서비스 공격·저작물 복제에는 사용하지 않는다.*
