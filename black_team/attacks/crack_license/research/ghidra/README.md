# Ghidra 정적 분석 프롭 (reproduce)

**`analyzeHeadless` (-postScript) Java 프롭 모음.** 모든 출력은 로컬에서 생성
(데이터 유출 없음). 두 타겟:

| 타겟 | 분석 대상 | 관련 코드 |
|---|---|---|
| **Seafile Pro 13.0.27** | `seaf-server` ELF (searpc AES 키/위상 추적) | `reproduce.sh` + `DisasmSetup`/`WhoCallsSetup`/`OrphanCheck`/`TraceUp2`/`SeaRPCSetupProbe`/`FullTraceProbe.java` |
| **FastFind.exe** | Rust/Tauri hybrid, 라이선스 100% 서버사이드 | `reproduce_fastfind.sh` + `FastFindDecompile.java` (`fastfind/README.md`) |

> 🎓 교육용 · 본인 소유 앱/취약랩 대상. 배포용 크랙/keygen 아님.
> Seafile 상세 — [`../seafile_license_analysis.md`](../seafile_license_analysis.md) §6.
> FastFind 상세 — [`../../../fastfind/analysis.md`](../../../fastfind/analysis.md).

---

## Seafile (`seaf-server` ELF)

### 실행 (reproduce.sh)

```bash
./reproduce.sh /path/to/seaf-server            # Ghidra 는 brew 경로 기본
# 또는:
PROJ=SeaRPC SCRIPT=FullTraceProbe ./reproduce.sh /path/to/seaf-server /opt/homebrew/opt/ghidra/libexec
```

직접 실행 (위와 동일):

```bash
export GHIDRA_INSTALL_DIR=/opt/homebrew/opt/ghidra/libexec
"$GHIDRA_INSTALL_DIR/support/analyzeHeadless" ghidra_proj/SeaRPC "$BIN" \
  -import "$BIN" -scriptPath "$PWD" -postScript FullTraceProbe
```

- 분석 DB 는 로컬 `ghidra_proj/` 에만 저장 (gitignored).
- 새 프롭은 항상 **새 프로젝트 이름**으로 import (`-import` 는 한 번만 유효).

### 프롭 목록

| 파일 | 목적 | 대표산출 |
|---|---|---|
| **DisasmSetup.java** | `0x1111c0` setup/main 이산화 + `searpc_register` coord ① | main 이 B64 coord(`0x18fc30`)를 `0x11327e`에서 hands-off |
| **WhoCallsSetup.java** | setup indirect caller + AES coord 9 wrapper caller ② | AES coord ← 9 wrapper |
| **OrphanCheck.java** | AES wrapper ref-type + jump-table 소유자 ③ | 6 wrapper jump table · 3 direct |
| **TraceUp2.java** | dispatcher 위상 추적 + jump-table owner ④ | `0x131830` → LEAF |
| **SeaRPCSetupProbe.java** | SeaRPC setup parents + coordinator 원형 프롭 | 초기 스키트 |
| **FullTraceProbe.java** | setup + B64/AES coord 통합 upward trace | — |

### 핵심 발견 (상세는 §6)

1. **`0x1111c0` = main**, B64 coord(`0x18fc30`)를 `searpc_register` 에 넘김. AES coord 는 main 과 무관.
2. **AES coord 는 9 wrapper 로 reach** — 6 jump table, 3 direct caller.
3. **위상 추적은 LEAF 함수로 수렴** → 라우팅 원원.
4. **가장 약한 고리 = §1 AES 키/IV 하드코딩**. `Hash2` RSA 서명은 벤더 private key 필요.

---

## FastFind (`FastFind.exe`, Rust/Tauri)

### 실행 (reproduce_fastfind.sh)

```bash
./reproduce_fastfind.sh /path/to/FastFind.exe /opt/homebrew/opt/ghidra/libexec
```

- 산출물 (로컬 `ghidra_proj/<proj>/`): `symbols.txt`(`demangled⇥addr⇥file⇥line`),
  `fastfind_recovered.txt`(decompiled C + 소스 위치).
- 분석 DB 로컬에만 저장 (gitignored). 새 프롭은 항상 새 프로젝트 이름으로 `-import`.

### 프롭

| 파일 | 목적 |
|---|---|
| **FastFindDecompile.java** | 소스 라인이 있는 Rust 함수를 **자동 디컴파일**. `symbols.txt` + `fastfind_recovered.txt` 출력 |
| **reproduce_fastfind.sh** | Ghidra `analyzeHeadless` 원샷 (import+analysis+decompile) |

### 핵심

- **라이선스 100% 서버사이드** — 바이너리에 시일/라이선스 검증 코드 전무 (클라이언트 크랙 대상 없음).
- 소스 경로(`src/api.rs:1213` 등)는 실행파일에 임베드, **복원엔 `FastFind.pdb` 필요**.
- **`isValid()` 위양성 버그 수정** — decompile 성공을 `getC()` 비어로 진짜 검증하는
  `hasC()` 헬퍼로 대체 (`decompileCompleted() && getDecompiledFunction()!=null && getC() non-empty`).

### 필요 조건

- Ghidra 12.1.x (Java 26), macOS ARM64 native decompiler (`build_natives_macos.sh`로 빌드).
