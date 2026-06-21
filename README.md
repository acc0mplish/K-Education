# K-Education — Linux/WSL2 RE 워크플로우 하네스

MacRE(보고서 §13)의 47-도구 coverage 아키텍처를 Linux/WSL2로 풀복제한 **교육용** 역공학 하네스.
본인 소유 앱(DAF Launcher 계열) 분석 자동화. 정적/동적 관찰에 한정, 코드 재현·복제 없음.

> 전체 계획: [`WORKFLOW_PLAN.md`](WORKFLOW_PLAN.md)

## 핵심 원칙 (보고서 §13.1)
- **“전체 사용” ≠ “전체 성공”** — `canClaimFullCoverage`(47개 종결)와 `canClaimAllToolsSucceeded`(성공/비대상만) 분리
- **실패/timeout 투명 기록** — `execution_failed`, `timeout_deferred_retry`를 manifest에서 숨기지 않음
- **target별 적용 분류** — zip/asar/pe/elf/archive/network 자동 분류, 비대상도 coverage 항목

## 구조
```
WORKFLOW_PLAN.md          # 계획서(전체 설계)
tool_catalog.json         # 47-도구 단일 진실원
tools/
  install.sh              # apt/wine 설치 (sudo)
  install_manual.sh       # ghidra/retdec/diec 수동 다운로드
  verify.sh               # 설치 검증 -> verify_report.json
  yara_rules/index.yar    # 교육용 지표 룰
harness/
  .venv/                  # Python 격리 환경 (pefile/capstone/yara/lief/angr/...)
  states.py               # ExecutionStatus/InstallStatus enum
  catalog.py              # ToolCatalog
  target_profile.py       # 분류기
  runner.py               # timeout/캡처/stdoutSHA256
  coverage.py             # coverage manifest 집계
  main.py                 # CLI
  plugins/                # per-tool 브릿지 (핵심 실구현 + 무거운 도구 스텁)
scripts/
  entropy.py              # 섹션 엔트로피 (§4.3.1)
  asar_extract.py         # asar 헤더+추출 (§4.4)
  api_probe.sh            # 공개 API 동적 응답 (§5)
evidence/<target>/        # 산출물 (coverage.json + <toolID>.out/.err)
targets/                  # 분석 대상
```

## 빠른 시작
```bash
# 1. Python 도구 (sudo 불필요, 이미 설치됨)
bash tools/install.sh pip

# 2. 시스템 도구 (sudo 필요)
!sudo bash tools/install.sh apt

# 3. 무거운 도구 (선택, 인터넷 필요)
bash tools/install_manual.sh all

# 4. 검증
bash tools/verify.sh

# 5. 도구 목차 확인
harness/.venv/bin/python harness/main.py tool-check

# 6. 분석
harness/.venv/bin/python harness/main.py analyze targets/sample_pe.exe --strategy quick
harness/.venv/bin/python harness/main.py analyze targets/<your.zip> --strategy full
```

## CLI
| 명령 | 설명 |
|---|---|
| `tool-check` | 48-도구 catalog + 설치 상태 → `tools/tool_check_report.json` |
| `profile <target>` | target 분류(zip/asar/pe/elf/...) |
| `analyze <target> [--strategy full\|quick]` | 전수 분석(Electron 레인 자동) → `evidence/<name>/coverage.json` |
| `coverage <target>` | coverage 요약 출력 |
| `report <target>` | 인터랙티브 HTML 리포트 → `evidence/<name>/report.html` (5섹션+체크리스트+자동리스크) |
| `dynamic <target> [--run] [--seconds N]` | WSL Windows-interop 동적 실행(PE proc tree + netstat) |

## 상태 (ExecutionStatus)
`executed` · `execution_failed` · `target_not_applicable` · `timeout_deferred_retry` · `manual_install` · `install_failed` · `bridge_unavailable` · `skipped`(quick 비종결)

## 플러그인 구현 상태
- **실구현**(in-process): pefile, readpe, capstone, lief(PE/ELF 디스패치), entropy, yara, angr(probe+timeout), opus
- **CLI 위임**: file, strings, hexdump, sha256sum, exiftool, binwalk, ssdeep, foremost, 7z, innoextract, objdump, readelf, nm, rizin, rabin2, diec, osslsigncode, asar, curl, api_probe, codebase_audit, gdb, wine, floss, capa
- **probe-first**: radare2(§13.3 timeout 회피)
- **스텁/수동**: ghidra, retdec, cutter, imhex, qiling, miasm, unicorn, decai, mobsf → `bridge_unavailable`/`install_failed` (install_manual.sh 후 자동 활성화)
- **동적 비대상**: frida(정적 타겟엔 not_applicable, `dynamic` 경로 사용)

## 한계 (솔직)
- 시스템 도구 미설치 상태 → `install_failed`로 기록(숨기지 않음). `install.sh apt` 실행 후 재분석.
- ghidra/retdec: 183MB Electron PE는 timeout 재현 가능 → `timeout_deferred_retry`.
- Wine GUI: 헤드리스 WSL에선 Xvfb 또는 Windows 인터프롭 폴백 필요.
- 인증 필요 API(`/api/remote/*`): 계정 없이 불가 → 정적 역추론으로 보완.

## 교육/윤리
본 하네스는 **본인 소유 앱·교육 목적** 관찰 자동화. 타인 시스템 침해·서비스 공격·저작물 복제에 사용 금지.
