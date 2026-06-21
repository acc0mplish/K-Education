# RE 워크플로우 계획서 — K-Education (Linux/WSL2)

> MacRE(보고서 §13)의 47-도구 coverage 아키텍처를 Linux/WSL2 환경으로 풀복제하는 교육용 역공학 하네스.
> 분석 대상은 본인 소유 앱(DAF Launcher 계열). 코드 재현·복제 없이 관찰·흐름·메커니즘 파악에 한정.

---

## 0. 문서 메타
- 작성일: 2026-06-20
- 환경: WSL2 Ubuntu (Linux 6.6 x86_64), Windows 호스트 인터프롭(`powershell.exe`), Python 3.12.3, Node 22
- 기준 보고서: `00_DAF_Launcher_RE_Report.md` §13 (MacRE hardened harness), §14 (개선 매트릭스)
- 범위 결정(사용자): **47-도구 풀복제** + **Wine 동적 분석** + **계획서/설치/스캐폴드 전부**
- 성격: 교육용(own app). 공격·복제 도구가 아닌 정적/동적 관찰 자동화.

---

## 1. 목표

MacRE가 macOS에서 하던 일을 Linux/WSL2에서 재현한다:

1. **도구 기억 의존 제거** — AI/사람이 어떤 도구를 쓸지 외우지 않는다. 하네스가 전체 도구 목차(sitemap/checklist)를 먼저 주입한다.
2. **target별 적용 규칙** — zip/asar/PE/ELF/archive/network 마다 applicable 도구를 자동 분류. 비대상도 coverage 항목으로 기록(숨기지 않음).
3. **“전체 사용” vs “전체 성공” 분리** — `canClaimFullCoverage`(47개 전부 종결)와 `canClaimAllToolsSucceeded`(성공+비대상만)를 구분. 보고서 §13.1의 핵심 교훈.
4. **실패/timeout 투명 기록** — `execution_failed`, `timeout_deferred_retry`를 manifest에 남기고 `failedToolIDs`에 보존.
5. **재현 가능 산출물** — evidence/summary/coverage 분리 저장, stdout SHA256으로 무결성 체인.

---

## 2. 환경 분석 (실측)

| 항목 | 값 | 영향 |
|---|---|---|
| 커널 | Linux 6.6.87.2 WSL2 x86_64 | Linux 네이티브 도구 사용 |
| Windows 인터프롭 | `/mnt/c/.../powershell.exe` OK | PE 동적 실행 대안(Wine 외) |
| 패키지 매니저 | apt 2.8.3 / pip 24.0 / npm 10.9 / go / cargo | 다층 설치 |
| Python | 3.12.3 (externally managed, PEP 668) | **venv 필수** — 시스템 pip 직접 설치 차단 |
| 기 설치 | file/strings/objdump/readelf/nm/openssl/hexdump/curl/sha256sum | Tier1 일부 무설치 |
| 미설치 | r2/rizin, yara, binwalk, exiftool, ssdeep, diec, osslsigncode, pefile, capstone, ghidra, retdec, angr, frida, gdb, floss, capa, lief, 7z, innoextract, foremost, wine | 전부 설치 대상 |
| 디스크 | D: 763G 여유 | 충분 |
| sudo | 비밀번호 필요(비대화) | apt/wine 설치는 `install.sh` 경유, 사용자 `!sudo` 실행 |

**macOS 전용 도구 제거**: 보고서의 otool/lipo/dwarfdump/ktool/swift-section/strongarm은 Mach-O 대상. 본 워크플로우는 PE/asar/zip이 주 타겟이므로 이들은 **카탈로그에서 제외하거나 Linux 동등물로 대체**. 보고서 §13.1이 ASAR→Mach-O 오분류를 고친 것과 동일 원칙.

---

## 3. 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│  main.py (CLI)                                              │
│   tool-check | analyze <target> --strategy full|quick       │
└───────────────┬─────────────────────────────────────────────┘
                │
   ┌────────────┴─────────────┐
   ▼                          ▼
ToolCatalog               TargetProfile
(tool_catalog.json 로드)   (file 매직 → profile 분류)
   │                          │
   └──────────┬───────────────┘
              ▼
        ToolRunner
   - per-tool timeout (probe→full→artifact-only)
   - stdout/stderr 캡처 + SHA256
   - exit code → ExecutionStatus 매핑
   - applicability gate (profile × tool.targetProfiles)
              │
              ▼
       CoverageManifest
   - 각 tool row: toolID/tier/applicability/installStatus/
     executionStatus/exitCode/stdoutSHA256/message
   - canClaimFullCoverage / canClaimAllToolsSucceeded
   - failedToolIDs / timeoutToolIDs 분리
              │
              ▼
         evidence/<target>/
   coverage.json | summary.json | <toolID>.out | <toolID>.err
```

### 3.1 상태 머신 (보고서 §13.1 반영)

**ExecutionStatus** (실행 결과):
- `executed` — 정상 종료(exit 0)
- `execution_failed` — 비정상 종료(self-signed 검증 실패, capa rule 경로 오류 등)
- `target_not_applicable` — profile 불일치(예: zip에 ghidra)
- `timeout_deferred_retry` — exit 124. retry 큐 적재
- `manual_install` — 미설치 optional 도구(mobsf)
- `install_failed` — 설치 시도했으나 실패
- `bridge_unavailable` — 플러그인 브릿지 누락/에러

**InstallStatus**: `present` / `missing` / `manual` / `deprecated`

**핵심 불변식**:
- `canClaimFullCoverage` ⇔ 모든 47 tool이 위 상태 중 하나로 **종결**
- `canClaimAllToolsSucceeded` ⇔ 종결 tool이 `executed` 또는 `target_not_applicable` **만**
- 두 값이 다를 수 있다(PE에서 osslssigncode/capa/lief 실패 시). 이 차이를 report에 명시.

---

## 4. 47-도구 인벤토리 (Linux 매핑)

> MacRE 47 non-deprecated를 Linux/WSL2 환경에 맞게 재구성. macOS 전용(Mach-O) 도구는 Linux 동등물로 교체·제거.

### Tier 1 — 메타데이터/문자열 (경량, 항상 실행)
| # | toolID | 설치 | 적용 target |
|---|---|---|---|
| 1 | file | apt(file) 내장 | ALL |
| 2 | strings | apt(binutils) 내장 | ALL |
| 3 | hexdump | apt(bsdmainutils) | ALL |
| 4 | sha256sum | coreutils 내장 | ALL |
| 5 | exiftool | apt(libimage-exiftool-perl) | ALL |
| 6 | binwalk | apt(binwalk) / pip | archive/PE/ELF |
| 7 | ssdeep | apt(ssdeep) | ALL |
| 8 | foremost | apt(foremost) | PE/ELF/archive |
| 9 | p7zip | apt(p7zip-full) | archive |
| 10 | innoextract | apt(innoextract) | inno-setup |
| 11 | openssl | apt 내장 | ALL(x509/dgst) |
| 12 | entropy | harness 스크립트(scripts/entropy.py) | PE/ELF/bin |

### Tier 2 — Electron/ASAR
| # | toolID | 설치 | 적용 target |
|---|---|---|---|
| 13 | asar | npm(@electron/asar) | asar |
| 14 | asar_extract | harness(scripts/asar_extract.py) | asar |
| 15 | codebase_audit | harness(JS 정적 감사) | asar/zip |

### Tier 3 — PE/ELF 정적 구조
| # | toolID | 설치 | 적용 target |
|---|---|---|---|
| 16 | pefile | pip(pefile) | PE |
| 17 | readpe | pip(pefile 래퍼) / pev | PE |
| 18 | objdump | apt(binutils) | PE/ELF |
| 19 | readelf | apt(binutils) 내장 | ELF |
| 20 | nm | apt(binutils) 내장 | PE/ELF |
| 21 | capstone | pip(capstone) | PE/ELF |
| 22 | rizin | apt(rizin) | PE/ELF |
| 23 | rabin2 | rizin 번들(rabin2) | PE/ELF |
| 24 | radare2 | apt(radare2) / github | PE/ELF |
| 25 | cutter | download(Qt) | PE/ELF(선택) |
| 26 | lief | pip(lief) | PE/ELF/Mach-O |
| 27 | die | github(diec) | PE/ELF/archive |
| 28 | imhex | download | PE/ELF(선택) |

### Tier 4 — 디컴파일/심볼릭 (무거움, timeout 위험)
| # | toolID | 설치 | 적용 target |
|---|---|---|---|
| 29 | ghidra | download(zip) | PE/ELF |
| 30 | ghidra_script | ghidra headless | PE/ELF |
| 31 | retdec | download/패키지 | PE/ELF |
| 32 | angr | pip(angr) | PE/ELF |
| 33 | floss | pip(floss) | PE/ELF |
| 34 | capa | pip(flare-capa) | PE/ELF |

### Tier 5 — 에뮬레이션/동적
| # | toolID | 설치 | 적용 target |
|---|---|---|---|
| 35 | unicorn | pip(unicorn) | PE/ELF(stub 에뮬) |
| 36 | qiling | pip(qiling) | PE(Windows rootfs 별도) |
| 37 | miasm | pip(miasm) | PE/ELF |
| 38 | frida | pip(frida-tools) | 동적 프로세스 |
| 39 | wine | apt(wine64) | PE 동적 실행 |
| 40 | gdb | apt(gdb) | ELF 동적 |

### Tier 6 — 보안/네트워크/AI
| # | toolID | 설치 | 적용 target |
|---|---|---|---|
| 41 | yara | apt(yara) + pip(yara-python) | ALL(룰 스캔) |
| 42 | osslsigncode | apt(osslsigncode) | PE(Authenticode) |
| 43 | curl | apt 내장 | network API |
| 44 | api_probe | harness(scripts/api_probe.sh) | network |
| 45 | decai | download(AI 디옵) | PE/ELF(선택) |
| 46 | opus_analysis | harness 요약 | ALL(report 통합) |
| 47 | mobsf | pip(mobsf) — manual | Android/iOS(선택, 미설치 허용) |

**deprecated/제외**(보고서 §13.2 기준): dsdump(Mach-O), otool/lipo/dwarfdump/ktool(Mach-O), swift-section, strongarm, pe-tree(GUI), trid(다운로드 불안정). 이들은 카탈로그에 `deprecated: true`로 명시만.

---

## 5. Target Profile 분류 규칙

`TargetProfile.classify(path)` — `file` 매직 + 확장자 + 헤더 시그니처:

| profile | 판정 신호 |
|---|---|
| `zip` | PK\x03\x04 |
| `asar` | 확장자 .asar + 8바이트 헤더(Pickle) |
| `pe` | MZ 헤더 + PE\x00\x00 |
| `elf` | \x7fELF |
| `mach_o` | 0xFEEDFACE/0xFEEDFACF/0xCAFEBABE |
| `inno_setup` | innoextract -t 통과 |
| `archive` | 7z/tar/gz 매직 |
| `android` | APK(zip 내 classes.dex) |
| `network` | URL/http(s) 스킴 |
| `unknown` | fallback |

각 tool의 `targetProfiles: [...]`와 교집합 → applicability. 빈 교집합 = `target_not_applicable`.

**보고서 §13.1 교훈 적용**: asar가 Mach_O로 오분류되지 않도록 헤더 검증 먼저, `BinaryInfo` 존재만으로 Mach-O 취급 금지.

---

## 6. 설치 계획

3개 레이어. 검증은 `tools/verify.sh`.

### 6.1 venv (Python, sudo 불필요) — 즉시
`harness/.venv`에 설치. PEP 668(externally-managed) 회피.
- pefile, capstone, yara-python, lief, angr, unicorn, frida-tools, ssdeep
- (optional) miasm, qiling, floss, flare-capa, mobsf

### 6.2 apt (시스템, sudo 필요) — `install.sh` 경유
```
sudo apt-get update
sudo apt-get install -y yara binwalk libimage-exiftool-perl ssdeep gdb \
  foremost innoextract p7zip-full radare2 rizin osslsigncode wine64 \
  binutils bsdmainutils
```
사용자 실행: `!sudo bash tools/install.sh apt`

### 6.3 수동 다운로드 (경로 고정)
- **ghidra**: `tools/downloads/ghidra/` (github release zip). headless `analyzeHeadless`.
- **retdec**: `tools/downloads/retdec/` (avast retdec).
- **diec**: github release (`Detect_It_Easy`).
- **imhex**: AppImage.
- **decai**: github.
- 경로는 `tool_catalog.json`의 `installPath`에 고정(보고서 §14.3 "capa rules 경로 고정" 원칙).

### 6.4 npm (asar 전용)
`harness/node_tools/`: `@electron/asar`, `adm-zip`. 완료.

---

## 7. 하네스 모듈 구조

```
K-Education/
├── WORKFLOW_PLAN.md              # 본 문서
├── README.md
├── tools/
│   ├── tool_catalog.json         # 47-도구 레지스트리 (단일 진실원)
│   ├── install.sh                # apt/wine 설치 (sudo)
│   ├── install_manual.sh         # ghidra/retdec/diec 수동
│   └── verify.sh                 # 버전/설치 검증 → verify_report.json
├── harness/
│   ├── .venv/                    # Python 격리 환경
│   ├── node_tools/               # Node asar 도구
│   ├── states.py                 # ExecutionStatus/InstallStatus enum
│   ├── catalog.py                # ToolCatalog (json 로드 + 쿼리)
│   ├── target_profile.py         # TargetProfile 분류기
│   ├── runner.py                 # ToolRunner (timeout/캡처/SHA256)
│   ├── coverage.py               # CoverageManifest 작성/집계
│   ├── plugins/
│   │   ├── base.py               # Plugin 추상 + registry
│   │   ├── t_file.py             # Tier1 실구현
│   │   ├── t_strings.py
│   │   ├── t_pefile.py           # PE 실구현
│   │   ├── t_capstone.py
│   │   ├── t_yara.py
│   │   ├── t_asar.py
│   │   ├── t_lief.py
│   │   ├── t_diec.py
│   │   ├── t_entropy.py
│   │   ├── t_curl.py
│   │   ├── t_osslsigncode.py
│   │   ├── t_ghidra.py           # 스텁(headless 호출)
│   │   ├── t_retdec.py           # 스텁
│   │   ├── t_angr.py             # 스텁(probe-first)
│   │   ├── t_wine.py             # 동적 실행 브릿지
│   │   └── t_frida.py            # 동적 attach 브릿지
│   └── main.py                   # CLI: tool-check / analyze
├── scripts/
│   ├── entropy.py                # 섹션별 엔트로피 (보고서 §4.3.1 재현)
│   ├── asar_extract.py           # asar 헤더+전체추출 파서 (보고서 §4.4)
│   └── api_probe.sh              # 공개 API 동적 응답 (보고서 §5)
├── targets/                      # 분석 대상 샘플 (더미/본인zip)
└── evidence/<target>/            # 산출물
    ├── coverage.json
    ├── summary.json
    ├── <toolID>.out / .err
    └── <toolID>.meta.json
```

---

## 8. 실행 워크플로우 (단계)

### Phase 0 — 사전 점검
```
python harness/main.py tool-check
→ tools/tool_check_report.json
   (present/missing/manual/deprecated 집계, 보고서 §13.2 형식)
```

### Phase 1 — target 식별
```
python harness/main.py profile <target>
→ TargetProfile 출력 (zip/asar/pe/elf/...)
```

### Phase 2 — 전수 분석
```
python harness/main.py analyze <target> --strategy full
```
내부 흐름:
1. catalog에서 applicable tool 필터(profile 교집합)
2. **Electron 레인(§15.A)**: target이 Electron(zip/asar 내 app.asar, 또는 Electron PE)이면
   `t_electron`(Tier 0)이 먼저 실행 → asar 추출 + JS 비즈니스로직 스캔. Electron PE면
   ghidra/retdec/angr는 **자동 DEFER**(이유 명시, 보고서 §10).
3. 각 tool runner 호출:
   - install check → missing 시 `manual_install`/`install_failed`
   - probe-first: 짧은 타임아웃으로 진행 가능성 확인(r2/ghidra/retdec)
   - full: 본 분석(타임아웃 tool별 — PE 600s, ghidra/retdec 1800s)
   - artifact-only fallback: timeout 시 manifest만 남기고 deferred
4. stdout/stderr → evidence/<target>/<toolID>.{out,err}
5. stdout SHA256 → 무결성 체인
6. exit code → ExecutionStatus

### Phase 3 — coverage 집계
```
→ evidence/<target>/coverage.json
   - canClaimFullCoverage (48 종결 여부, electron_business 포함)
   - canClaimAllToolsSucceeded (성공/비대상만 여부)
   - failedToolIDs / timeoutToolIDs
   - executedCount / notApplicableCount / failedCount
```

### Phase 4 — 동적 분석 (WSL Windows-interop, §15.D)
```
python harness/main.py dynamic <pe> --run --seconds 6
→ powershell.exe로 Windows 호스트에서 PE 실행(네이티브, Wine 불필요)
→ 프로세스 트리 + netstat 캡처 → kill
→ evidence/<target>/dynamic_windows.json
```
dry-run 기본, `--run` 시 실제 spawn. 본인 앱/교육 목적 한정.
한계: 자식 프로세스 환경변수(DAF_API_TOKEN)는 WMI로 읽기 불가 → PEB-walker/frida 후킹 필요(deferred).

### Phase 5 — 보고서 통합 (HTML 대시보드, §15.B)
```
python harness/main.py report <target>
→ evidence/<target>/report.html (자체完결)
```
접힌 도구 체크리스트(tier별·색상 배지) + 증거 스니펫 + 고정 5섹션
(분석결론 / 앱개선 backlog / 보안 리스크[자동 감지] / 재현 명령 / 한계).

---

## 9. 보고서 §14 개선 액션 반영 매핑

| §14 항목 | 본 하네스 구현 |
|---|---|
| 전체 도구 목차 P0 | `tool_catalog.json` + `tool-check` CLI 첫 출력 |
| full 의미 분리 P0 | `canClaimFullCoverage` vs `canClaimAllToolsSucceeded` |
| target applicability P0 | `TargetProfile` + catalog preflight |
| ASAR/Electron 승격 P1 | asar 플러그인 + report 상단 요약 |
| PE 분석(lief/capa/r2/retdec) P0 | lief PE 모드 분리, capa rule 경로 고정, probe-first |
| timeout 단계화 P1 | probe→full→artifact-only fallback |
| 동적 분석 lane P1 | Wine runner + Windows 인터프롭 fallback |
| manual install 문서 P2 | verify.sh에 설치명령 자동 첨부 |
| report 템플릿 P1 | 고정 5섹션 |
| AI context 주입 P0 | 매 stage에 catalog+profile+remaining checklist JSON 출력 |

---

## 10. 동적 분석 경로 (Wine)

사용자 선택: Wine 별도 설치(Linux 샌드박스). Windows 인터프롭은 폴백.

### 설치
```
sudo apt-get install -y wine64
wine64 --version
```

### 안전 설계 (교육/관찰 목적)
- Wine prefix 분리: `WINEPREFIX=evidence/<target>/wineprefix`
- 네트워크 제한 권장: 샌드박스 내 실행, 외부 API 호출은 명시적 허용 대상만
- 환경변수 캡처: 실행 전후 `/proc/<pid>/environ` 수집 (DAF_* 토큰 관찰 — 보고서 §12.6)
- 동적 분석은 **본인 소유 앱·교육 목적**에 한정. 타인 시스템·서비스 대상 외부 공격 도구로 사용 불가.

### 관찰 대상 (DAF 런처 기준)
- 자동업데이트: `/api/launcher/release` 호출 → sha256 검증 → PowerShell apply 흐름
- 원격관리: device register → 5s heartbeat → command 수신 루프
- 환경변수 전파: 자식 프로세스에 DAF_API_TOKEN/PROGRAM_ID/SUBSCRIPTION_* 주입

---

## 11. 한계·리스크 (솔직)

| 항목 | 한계 | 완화 |
|---|---|---|
| PE 183MB(V8/Chromium) | ghidra/retdec/angr full decompile timeout 재현 가능 | probe-first + artifact-only fallback |
| qiling Windows rootfs | 별도 다운로드 필요 | 누락 시 `manual_install` 상태 기록 |
| mobsf | Android/iOS 대상 아니면 미사용 | optional, missing 허용 |
| Wine GUI | 헤드리스 WSL에서 GUI 창 안 뜸 | 가상 디스플레이(Xvfb) 또는 인터프롭 폴백 |
| capa rules | 로컬 rule 경로 미고정 시 exit 12(보고서 §13.3) | `installPath`에 rules 디렉토리 고정 |
| lief PE 모드 | Mach-O 브릿지로 잘못 검사 가능(보고서 §13.3) | PE 전용 path 분리 |
| 인증 필요 API | /api/me, /api/remote/* — 계정 없이 불가 | 정적 코드 역추론으로 보완 |
| FLOSS 크기 상한 | 16MB 초과 파일 불가(보고서 §10) | strings로 동등 커버 |

**판정 원칙**: 본 워크플로우는 “성공한 도구만 나열”하지 않는다. 실패·timeout·비대상까지 전수 coverage로 보존(보고서 §14.1).

---

## 12. 마일스톤

| 단계 | 산출물 | 상태 |
|---|---|---|
| M1 | WORKFLOW_PLAN.md (본 문서) | ✅ |
| M2 | tool_catalog.json (48, electron_business 포함) | ✅ |
| M3 | venv + pip 패키지 | ✅ |
| M4 | install.sh / verify.sh | ✅ |
| M5 | harness 코어(states/catalog/profile/runner/coverage/main) | ✅ |
| M6 | 플러그인(핵심 실구현 + 무거운 도구 스텁 + t_electron) | ✅ |
| M7 | scripts(entropy/asar/api_probe/dynamic_windows) | ✅ |
| M8 | README + tool-check 데모 실행 | ✅ |
| M9 | apt/wine 설치 (사용자 `!sudo`) | ⏳ 사용자 액션 |
| M10 | ghidra/retdec/diec 수동 다운로드 | ⏳ 사용자 액션 |
| M11 | 실 타겟(DAF zip) full analyze 실행 | ⏳ M9/M10 이후 |
| M12 | §15.A Electron 레인 | ✅ |
| M13 | §15.B HTML coverage 리포트 | ✅ |
| M14 | §15.D WSL Windows-interop 동적 실행 | ✅ |
| M15 | §15.C/E 미구현 항목(capa검증/retdec probe/applicability gate/AI stage-card) | ⏳ 선택 |
| M16 | §16 macOS 앱 포팅 | ⏳ 설계 |

---

## 13. 다음 단계 (사용자 액션)

1. 시스템 도구 설치: `!sudo bash tools/install.sh apt`
2. 수동 도구 다운로드: `bash tools/install_manual.sh` (ghidra/retdec/diec — 인터넷 필요)
3. 검증: `bash tools/verify.sh` → `tools/verify_report.json`
4. 데모: `harness/.venv/bin/python harness/main.py tool-check`
5. 분석 대상 배치: 본인 zip을 `targets/`에 위치 후
   `harness/.venv/bin/python harness/main.py analyze targets/<file> --strategy full`
6. 리포트: `harness/.venv/bin/python harness/main.py report targets/<file>`
7. 동적: `harness/.venv/bin/python harness/main.py dynamic targets/<pe> --run --seconds 6`

---

## 15. 색다른 구현 (2026-06-21 추가)

§14.3 백로그 중 "해결 안 되는" 항목에 대한 대안 구현. 보고서의 핵심 한계(183MB PE
decompile 무의미 → 진짜 로직은 app.asar JS)를 **PE-중심 흐름에서 asar/JS-중심으로 피벗**.

### 15.A 비즈니스로직-우선 Electron 레인 ✅
- 모듈: `harness/electron_detect.py`, `harness/plugins/t_electron.py`, catalog Tier 0
- 동작: Electron 감지(zip/asar 내 app.asar, Electron PE) → asar 추출 → JS 정적감사
  (DAF_* env, /api 엔드포인트, IPC, child_process, auto-update, remote_mgmt, eval, remote_url)
- Electron PE 타겟 시 ghidra/ghidra_script/retdec/angr **자동 DEFER**
  ("Electron V8 shell — business logic in app.asar") — 무의미한 183MB decompile 우회
- main.py: `is_electron_pe` 감지 → heavy_defer 세트 적용
- 검증: fixture electron_app.zip → DAF env/엔드포인트/IPC/powershell/remote_mgmt/eval 추출 ✓

### 15.B 인터랙티브 HTML coverage 리포트 ✅
- 모듈: `harness/report_html.py`, CLI `report <target>`
- 동작: coverage.json + per-tool .out → 자체完결 HTML 대시보드
- 구성: KPI(전체사용/전체성공) + 접힌 도구 체크리스트(tier별·색상 배지) + 증거 스니펫
  + 고정 5섹션(분석결론/앱개선backlog/보안리스크[자동감지]/재현명령/한계)
- 보안 리스크 자동 감지: electron_business.out에서 자격증명 env 노출·광범위 원격관리·
  PowerShell 숨김실행·eval·YARA 매칭 추출

### 15.D WSL Windows-interop 동적 실행 ✅
- 모듈: `scripts/dynamic_windows.py`, CLI `dynamic <target> [--run] [--seconds N]`
- 동작: powershell.exe로 Windows 호스트에서 PE 실행(네이티브, Wine 불필요) →
  프로세스 트리(Win32_Process) + netstat 캡처 → kill → dynamic_windows.json
- 경로 변환: /mnt/c/... → C:\... (Windows-accessible 검증)
- dry-run 기본, `--run` 시 spawn. cp949(한글 Windows) 인코딩 처리
- 한계(솔직): 자식 프로세스 환경변수(DAF_API_TOKEN)는 WMI로 읽기 불가 →
  PEB-walker 또는 frida 후킹 필요(별도 executor, deferred)

### 15.C/E 미구현 (대안 확정, 선택 구현)
- **#2 capa**: catalog에 rule 경로 지정(`tools/downloads/capa/rules`), capa 미설치라 검증 미완
- **#3 retdec**: probe-first + asar 심볼 선택적 디컴파일(radare2만 적용)
- **§12.5 applicability gate**: 2단계(format + content-structure) → archive/script 서브프로필이
  object 도구(dwarfdump/lipo/nm/ktool) 자동 비적용. K-Education은 macOS 도구 제외로 회피 중
- **#6 AI stage-card**: catalog+profile+remaining checklist JSON 주입 (사용자 선택 안 함)

---

## 16. macOS 앱 (계획)

원래 MacRE가 macOS 기반이므로, Linux/WSL2 하네스를 **macOS 포팅 + 네이티브 앱**으로 확장.
형태 후보(확정 필요):

| 후보 | 설명 | 장점 | 단점 |
|---|---|---|---|
| (a) macOS CLI 포트 | harness를 macOS에서 그대로 실행(otool/lipo/dwarfdump/nm 복원, Wine→미사용) | 빠름, 기존 코드 재사용 | GUI 없음 |
| (b) Swift/SwiftUI 네이티브 앱 | macOS GUI 앱(도구 체크리스트·coverage·리포트 뷰) | 네이티스티c, 샌드박스 | 구현量大 |
| (c) Electron/Tauri 래퍼 | 현재 하네스를 Tauri(Rust) 또는 Electron으로 래핑한 Mac 앱 | 코드 재사용, 크로스플랫폼 | 무거움 |
| (d) Python + PyWebView | report.html을 띄우는 최소 Mac 앱 | 가벼움, 빠른 구현 | 네이티브 아님 |

macOS 특화 도구 매핑(포팅 시):
- Linux `objdump/readelf/nm` → macOS `otool -L/-V, lipo, nm, dwarfdump`
- Wine 동적 → 불가(macOS에서 Windows PE 동적 실행 안 됨) → 정적+에뮬레이션만
- `osslsigncode` Authenticode → macOS에서도 동작
- 새 도구: `class-dump`(Obj-C), `swift-demangle`, `MachOView`, `bagbak`(iOS)

---

*본 계획서는 교육 목적의 본인 소유 앱 분석 자동화를 위한 것. 타인 시스템 침해·서비스 공격·저작물 복제에는 사용하지 않는다.*
