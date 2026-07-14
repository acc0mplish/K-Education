# K-Education — RE 워크플로우 하네스 (Linux/WSL2 + macOS)

> 🎓 **본 프로젝트는 교육용(Educational)으로 제작되었다.**
> 본인 소유 앱 및 **명시적으로 인가된 자산** 대상의 정적/동적 관찰 자동화만 수행한다.
> 타인 시스템 침해·서비스 거부·저작물 복제·무기화 자동화는 엄격히 금지.
> 능동 스캐너는 인가된 스콥에서만, C2/익스플로잇 프레임워크는 운용자가 격리 랩에서 수동 실행한다.

MacRE(보고서 §13)의 coverage 아키텍처를 풀복제한 **교육용** 역공학 하네스.
**플랫폼 자동 분기** — Linux/WSL2(84 tools) + macOS(63 tools). 본인 소유 앱(DAF Launcher 계열) 분석 자동화. 정적/동적 관찰에 한정, 코드 재현·복제 없음.

## 문서 (Red / Blue)
| 문서 | 내용 |
|---|---|
| [`docs/RED_TEAM.md`](docs/RED_TEAM.md) | 공격적 보안 평가 레인(§17) — SAST/SCA/프론트엔드 난독해제/웹 동적/포렌식/오프라인 패스워드/C2 문서화 |
| [`docs/BLUE_TEAM.md`](docs/BLUE_TEAM.md) | 방어적 분석·감지 레인 — 라이선스 바이패스 감지/의존성 CVE/coverage 투명성/무결성 baseline |
| [`WORKFLOW_PLAN.md`](WORKFLOW_PLAN.md) | 전체 계획서(§1-17) — §14.3 백로그(1-7) + §12.5 전부 구현 완료 |

## 핵심 원칙 (보고서 §13.1, §12.5)
- **"전체 사용" ≠ "전체 성공"** — `canClaimFullCoverage`(전부 종결) vs `canClaimAllToolsSucceeded`(성공/비대상만) 분리
- **실패/timeout 투명 기록** — `execution_failed`, `timeout_deferred_retry` 숨기지 않음
- **target별 적용 분류** — profile(zip/asar/pe/elf/mach_o/archive/network) + **sub_profile**(object/archive/script/network) 2단계 게이트(§12.5). object 도구는 archive/script 자동 비적용(MacRE asar→Mach-O 오분류 방어)
- **Electron = 비즈니스로직-우선** — asar/JS가 1차 분석면, V8 PE는 서명·임포트만(heavy decompiler 자동 DEFER)

## 레인 / 기능
| 레인 | 모듈 | 동작 |
|---|---|---|
| **Electron 비즈니스로직** (§15.A) | `electron_detect.py`, `plugins/t_electron.py` (Tier 0) | asar 추출 + JS 감사(DAF_* env, /api, IPC, child_process, auto-update, remote-mgmt, eval). Electron PE → ghidra/retdec/angr DEFER |
| **HTML 리포트** (§15.B) | `report_html.py`, `report` cmd | coverage.json → 대시보드(접힌 체크리스트+색상배지+5섹션+자동 리스크 감지) |
| **WSL 동적 실행** (§15.D) | `scripts/dynamic_windows.py`, `dynamic` cmd | powershell.exe로 호스트 PE 실행 + proc tree + netstat |
| **AI stage-card** (§14.3 #6) | `stage_card.py`, `stage-card` cmd | 토큰효율 JSON(platform+catalog+coverage+remaining+retryPlan) — LLM 주입용 |
| **macOS 포트** (§16.a) | `platselect.py`, `tool_catalog.macos.json` | Darwin 감지 → otool/lipo/dwarfdump/codesign/xattr/lldb, Wine 제거 |

probe-first(§13.3): radare2 + retdec(`--timeout`). capa rule 경로 고정(§14.3 #2, `plugins/t_capa.py`).

## 구조
```
WORKFLOW_PLAN.md                # 계획서(전체 설계, §1-17)
docs/                           # RED_TEAM.md / BLUE_TEAM.md (레드/블루 핵심 정리)
tool_catalog.json               # Linux 카탈로그 (84 tools: 50 binary-RE + §17 red lane 34)
tool_catalog.macos.json         # macOS 카탈로그 (63 tools, 자동 분기)
tools/
  install.sh / install_macos.sh # apt+wine / brew+clt + §17 red-team(pip/npm/redteam/depcheck)
  install_manual.sh             # ghidra/retdec/diec/capa-rules 수동
  verify.sh                     # 설치 검증 → verify_report.json
  build_macos_catalog.py        # Linux→macOS 카탈로그 변환기
  yara_rules/index.yar          # 교육용 지표 룰
harness/
  .venv/                        # Python 격리 (pefile/capstone/yara/lief/angr/unicorn/frida)
  platselect.py                 # 플랫폼 감지 + 카탈로그 선택
  states.py / catalog.py / target_profile.py / runner.py / coverage.py
  electron_detect.py            # Electron 감지 + JS 비즈니스로직 스캐너
  report_html.py                # 인터랙티브 HTML 리포트 생성
  stage_card.py                 # AI stage-card 생성
  main.py                       # CLI (7 서브커맨드)
  plugins/                      # t_electron/t_capa/t_retdec/t_otool/t_codesign/t_yara/...
scripts/
  entropy.py / asar_extract.py / api_probe.sh / dynamic_windows.py
evidence/<target>/              # coverage.json + report.html + stage_card.json + <toolID>.out/.err
```

## 빠른 시작 (Linux/WSL2)
```bash
bash tools/install.sh pip                      # Python 도구 (sudo 불필요)
!sudo bash tools/install.sh apt                # 시스템 도구 + wine (sudo)
bash tools/install_manual.sh all               # ghidra/retdec/diec (선택, 인터넷)
bash tools/verify.sh                           # 검증

harness/.venv/bin/python harness/main.py tool-check
harness/.venv/bin/python harness/main.py analyze targets/<file> --strategy full
harness/.venv/bin/python harness/main.py report targets/<file>
harness/.venv/bin/python harness/main.py stage-card targets/<file>
harness/.venv/bin/python harness/main.py dynamic targets/<pe> --run --seconds 6
```

## CLI
| 명령 | 설명 |
|---|---|
| `tool-check` | catalog + 설치 상태 → `tools/tool_check_report.json` |
| `profile <target>` | target 분류(profile + sub_profile) |
| `analyze <target> [--strategy full\|quick]` | 전수 분석(Electron 레인 + §12.5 gate 자동) → coverage.json |
| `coverage <target>` | coverage 요약 |
| `report <target>` | 인터랙티브 HTML 리포트 → report.html |
| `dynamic <target> [--run] [--seconds N]` | WSL Windows-interop 동적(PE proc tree + netstat) |
| `stage-card <target>` | AI stage-card JSON(LLM 컨텍스트 주입용) |

## 상태 (ExecutionStatus)
`executed` · `execution_failed` · `target_not_applicable` · `timeout_deferred_retry` · `manual_install` · `install_failed` · `bridge_unavailable` · `skipped`(quick 비종결)

## 플러그인
- **in-process**: electron_business, pefile, readpe, capstone, lief(PE/ELF/Mach-O 디스패치), entropy, yara, angr(probe+timeout), opus, vuln_subscription
- **probe-first**: radare2, retdec(`--timeout`)
- **rule-path 고정**: capa(`tools/downloads/capa/rules`), yara(`tools/yara_rules`)
- **CLI 위임**: file/strings/hexdump/shasum/exiftool/binwalk/ssdeep/foremost/7z/innoextract/objdump/readelf/nm/rizin/rabin2/diec/osslsigncode/asar/curl/api_probe/codebase_audit/gdb/wine/floss + macOS otool/lipo/dwarfdump/codesign/xattr/lldb
- **스텁/수동**: ghidra/cutter/imhex/qiling/miasm/unicorn/decai/mobsf → install 후 활성화

## 한계 (솔직)
- 시스템 도구 미설치 → `install_failed`로 기록(숨기지 않음). 설치 후 재분석.
- 183MB Electron PE: ghidra/retdec는 timeout 재현 → probe-first + DEFER(Electron 레인이 asar/JS로 우회).
- Wine GUI: 헤드리스 WSL에선 Xvfb 또는 WSL 인터프롭 폴백.
- 동적 환경변수(DAF_API_TOKEN) 캡처: WMI 불가 → PEB-walker/frida 필요(deferred).
- 인증 필요 API(`/api/remote/*`): 계정 없이 불가 → 정적 역추론 보완.

## macOS 포트 (§16.a)
`platselect.py`가 `platform.system()` 분기 — Darwin이면 `tool_catalog.macos.json` 자동 선택(otool/lipo/dwarfdump/codesign/xattr/lldb + Wine 제거).
```bash
# Mac에서만 실행:
bash tools/install_macos.sh all                                    # clt + brew + pip + npm
harness/.venv/bin/python harness/main.py tool-check                # macOS catalog(55) 자동 선택
harness/.venv/bin/python harness/main.py analyze <mach-o-app>
```
주의: macOS 도구 자체는 Mac에서만 실행·검증 가능(본 WSL 환경에선 카탈로그 생성·플랫폼 분기 로직만 검증).

## 교육/윤리
본 하네스는 **본인 소유 앱·교육 목적** 관찰 자동화. 타인 시스템 침해·서비스 공격·저작물 복제에 사용 금지.
