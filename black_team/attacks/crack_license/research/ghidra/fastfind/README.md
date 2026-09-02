# FastFind.exe — Ghidra 정적 분석·디컴파일 연구

FastFind.exe(Rust/Tauri hybrid)를 **Ghidra `analyzeHeadless`** 의 Java
`-postScript` 로 정적 분석하고 Rust 소스 라인과 함께 디컴파일한 연구 자료.
모든 출력은 로컬에서 생성 (데이터 유출 없음).

> 🎓 교육용 · 본인 소유 앱/취약랩 대상. 상용 software 무면허 배포용이 아님.
> 핵심 결론(라이선스 서버사이드 등)은 상위 [`../../../fastfind/analysis.md`](../../../fastfind/analysis.md).

## 타겟

- `../../../fastfind/FastFind.exe` — PE32+ x86-64, Rust/Tauri hybrid
- 제조: fastfind.kr / youngsam.net — "Ultra-fast file search engine"
- **외부 PDB 로 스트립드**: 함수 이름(`_ZN…` Rust mangled)은 실행파일이 아니라
  `FastFind.pdb`에 있음. 따라서 PDB 없이 분석하면 함수가 전부 `FUN_`/`thunk_`으로 전환됨.
- 단, **소스 경로 문자열(`src/api.rs:1213` 형태)은 실행파일에 임베드** 되어 있음.

## 프롭: `FastFindDecompile.java`

전체 함수 중 **소스 라인이 있는(=Rust 소스에서 컴파일된) 함수를 모두 디컴파일**하여
`symbols.txt`(색인) + `fastfind_recovered.txt`(decompiled C + 소스 위치)로 출력.

```bash
# 처음 (import+analysis+decompile 원샷)
./reproduce_fastfind.sh /path/to/FastFind.exe /opt/homebrew/opt/ghidra/libexec

# 재실행 (재분석 없이 스크립트만)
GHIDRA_INSTALL_DIR=$GHIDRA "$GHIDRA/support/analyzeHeadless" \
  ghidra_proj/FastFind FastFind -process ghidra_proj/FastFind.ghidra \
  -scriptPath "$PWD" -postScript FastFindDecompile.java   # (이 버전은 -process 미지원)
```

- 분석 DB는 로컬 `ghidra_proj/` 만에 저장 (gitignored).
- 새 프롭/재분석은 **항상 새 프로젝트 이름으로 `-import`** (`-import` 한 번만 유효).
- macOS(ARM64) native decompiler 가 반드시 빌드돼 있어야 함 (`build_natives_macos.sh`).

## Ghidra 12.x API 메모 (이 프롭이 맞춘 부분)

- `DecompilerComponentAdapterFactory`/`DecompInterface` 대신 **`DecompInterface()` (no-arg)
  → `openProgram()` → `decompileFunction(fn, timeout, monitor)` → `DecompileResults`**.
- C 텍스트는 **`DecompileResults.getDecompiledFunction().getC()`**.
  (`getCCodeMarkup().toString()`는 트리 마크업일 뿐 실제 C가 아님 → 빈 문자열).
- 소스 라인: **`Program.getSourceFileManager().getSourceMapEntries(addr)` → `SourceMapEntry`**.
  (함수 스트립드 시 PDB 부재로 이 호출은 빈 결과를 반환함 (PDB 로드 필요)).

## 핵심 발견

1. **스트립드 + 외부 PDB**: mangled 심볼은 PDB 소재. PDB 없이 분석 시 함수가
   `FUN_`/`thunk_`/`caseD_`으로 전환되어 demangle 대상 없음.
2. **소스 경로 임베드**: `src/api.rs:1213`, `src/indexer.rs:1010` 등 모듈·라인 정보가
   실행파일에 박혀 있음 (이것이 `analysis.md` §1 소스 맵의 출처). PDB와 함께 분석하면
   `getSourceMapEntries`가 이 정보를 실제 함수에 매핑.
3. **라이선스 100% 서버사이드**: 바이너리에 시일/라이선스 검증 코드가 전무.
   클라이언트 크랙 대상 없음 (상세는 상위 문서 §4).

## 산출물 (로컬)

- `ghidra_proj/<proj>/symbols.txt` — `demangled_name⇥addr⇥file⇥line` 색인
- `ghidra_proj/<proj>/fastfind_recovered.txt` — decompiled C + 소스 위치
