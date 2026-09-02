# FastFind.exe 해부 분석 (Black-team 참고용)

🎓 교육용 · 본인 소유/취약랩 대상. 상용 소프트웨어 무면허 배포용이 아님.

**타겟:** `SOURCE/fastfind/FastFind.exe` (PE32+ x86-64, Rust/Tauri hybrid)
**제조:** fastfind.kr / youngsam.net — "Ultra-fast file search engine"

---

## 0. 핵심 결론 (크랙 관점)

- **바이너리에 시일/라이선스 검증 코드가 전무함.**
  `license`, `serial`, `subscription`, `tier`, `premium`, `pro`, `expired` 문자열 **전부 없음**.
- 라이선스는 **100% 서버 사이드(cloud 구독)** — `fastfind.kr` 서버가 인증/권한 담당.
- 클라이언트는 인증 정보 3개만 보관·전송: `연결주소` / `연결토큰` / `베타키`.
- → **클라이언트 크랙 대상 없음.** "시일 부쉰다"는 오류는 서버 토큰·베타키 인증 실패(401)일 가능성이 큼.
- 크랙/우회 대상은 2곳:
  - **S1 로컬 서버**: `ff_local_token` (cookie) 기반 `local-auth`
  - **S2 릴레이 서버**: `fastfind.kr`로 가는 `연결토큰` (device relay token)

---

## 1. 복원된 소스 모듈 맵 (바이너리 디버그 심볼 + 라인번호)

Rust Itanium mangling 심볼에서 실제 소스 경로·라인 복원:

```
fastfind::api       -> src/api.rs:1213
fastfind::autostart -> src/autostart.rs:62
fastfind::cache     -> src/cache.rs:185
fastfind::indexer   -> src/indexer.rs:1010
fastfind::mft       -> src/mft.rs:587
fastfind::shell     -> src/shell.rs:147
fastfind::usn       -> src/usn.rs:622
```

> 이진 내부 임베드 경로는 오래된 빌드 `/code/APPS/fastfind.kr/engine/src/{fold,index,search,update}.rs`
> (현재 바이너리의 실제 모듈은 위 api/cache/indexer/mft/shell/usn/autostart).

---

## 2. 로컬 인증 흐름 (S1 — 서버 없이 로컬 서버 우회 포인트)

```javascript
// local-auth/login 에서 토큰 발급 → 쿠키 저장
const res = await fetch('/api/local-auth/login', {
  method: 'POST', headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ /* username / password / token */ })
});
document.cookie = 'ff_local_token=' + data.token + '; path=/; SameSite=Strict';
// 이후 모든 /api/* 요청에 ff_local_token 쿠키 자동 첨부
```

- 로컬 서버: `FastFind ready at http://<addr>:<port>`
- 인증 실패/권한: `auth_required: true`, `401` (문열에 존재 → 서버가 401 반환)
- 모든 API는 `/api/{action,search,browse,preview,content-search,settings,exec,...}` (로컬 로컬 서버)

---

## 3. 릴레이/연결 흐름 (S2 — 서버 구독)

```
클라이언트 --(결성토큰)--> find.fastfind.kr (relayer) --> 타겔 머신
```
- 두 모드: **Relay** (fastfind.kr 중계, 크기 제한 O) / **Direct** (라우터 포워딩, 서버 없음·빠름)
- `.env` 실제 값:
  ```
  연결주소 https://find.fastfind.kr
  연결토큰 190fb33c-2e8c-447d-9103-a225a35f0e18
  베타키.  BETA-Y8FX-3FD3-6WYD-S38N
  ```
- 한글 라bel은 바이너리에 없어 **수동 주석**. 앱이 이 파일을 직접 파싱하지 않을 수 있음 (실제는 app-data의 settings/json 읽을 가능성 높음).

---

## 4. 크랙 참고 — 실제로 건드릴 곳

| 목표 | 건드릴 위치 | 난이도 |
|---|---|---|
| 로컬 서버 без 서버 | `src/api.rs` `local-auth/login` + `ff_local_token` 검증 | 중 |
| 원격 릴레이 우회 | `fastfind.kr` 서버의 토큰 발급/검증 (서버 외부) | 높(서버 의존) |
| 구독 권한 | 서버 사이드 (클라이언트에서 포징 불가) | N/A |

> 주석: "프로 라이선스 .env 넣기"는 서버 구독 모델이라 **클라이언트 .env에 입력할 프로 키 문자열은 없음**.
> 베타키/연결토큰이 서버에서 승인되면 그 단계가解锁됨.

---

## 5. Ghidra native decompiler 빌드 (macOS ARM64)

`Ghidra_12.1.3_PUBLIC` PUBLIC 릴리스는 macOS ARM64 native decompiler를 동봉하지
않음 → 수동 빌드 필요 (이 Mac에서 디컴파일을 쓰기 위해 수행).

```bash
# 1) mac_arm_64 native decompiler 빌드 (clang + make)
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
cd /tmp/ghidra_12.1.3_PUBLIC/support/gradle
./gradlew buildNatives        # ~40s, BUILD SUCCESSFUL
# 2) 생성된 binary를 Ghidra가 찾는 위치에 복사
mkdir -p Ghidra/Features/Decompiler/os/mac_arm_64
cp -f Ghidra/Features/Decompiler/build/os/mac_arm_64/decompile \
     Ghidra/Features/Decompiler/os/mac_arm_64/decompile
```

> Java 26: Ghidra 클래스(class file 70) 실행은 되나 PyGhidra JPype가 cp314
> wheel 없어 실패 → **Java 21로 분석, PyGhidra는 python 3.13으로 분리**.
> python 3.13: `uv venv --python 3.13 py313` 후 빌드된 wheel로 `pyghidra`.

---

## 6. Rust 소스 복원 — Java `-postScript` 디컴파일기 (실제 동작 확인)

`ghidra/` 연구 폴더의 **`FastFindDecompile.java`** (`reproduce_fastfind.sh` 동봉)가
Rust 소스 라인이 있는 함수를 자동 디컴파일한다. PyGhidra(Jython) 없이 **순수 Java
`-postScript`** 로 구동 → JVM/PyGhidra 버전 의존 제거.

- **입력 함수 수**: 총 ~6100~6600 개. 그중 소스 라인이 있는 함수만 필터링 → 디컴파일.
- **산출물** (로컬 `ghidra_proj/<proj>/`):
  - `symbols.txt` — `demangled_name ⇥ addr ⇥ file ⇥ line` 색인
  - `fastfind_recovered.txt` — decompiled C + 소스 위치 주석
- **동작 확인**: `WARMUP_OK` (decompile 성공) + `RECOVERY_DONE total=6297` 으로
  확인 — 스크립트가 분석 후 자동 실행되어 산출물을 생성함.

### Ghidra 12.x API 맞춘 핵심 (이 프롭이 꺾인 곳)

1. **`getC()` vs `getCCodeMarkup().toString()`**: C 원문은
   `DecompileResults.getDecompiledFunction().getC()`.
   `getCCodeMarkup()` 는 트리 마크업만 줌 → `toString()` 이 **빈 문자열** (이것이
   초기 `decompiled=0`의 원인). 확인 결과 `isValid=true` 이므로 디컴파일 자체는 성공.
2. **소스 라인**: `Program.getSourceFileManager().getSourceMapEntries(addr)` →
   `SourceMapEntry`.
3. **`-process` + `-postScript` 는 이 버전에서 `invalid filename` 로 실패** →
   항상 새 프로젝트 이름으로 `-import`(한 번만 유효).

### 스트립드 / PDB / 임베드 소스 (중요 발견)

- 이 바이너리는 **외부 PDB 로 스트립드**. 함수 이름(`_ZN…` Rust mangled)이 아니라
  `FastFind.pdb`에 있음. PDB 없이 분석 → 모든 함수가 `FUN_`/`thunk_`/`caseD_` 으로
  전환되어 demangle 대상 자체가 됨.
- 단, **소스 경로 문자열은 실행파일에 임베드**: `src/api.rs:1213`, `src/indexer.rs:1010`,
  `src/usn.rs:622` 등 (`analysis.md` §1 소스 맵의 실제 출처). **PDB 함께 분석**해야
  `getSourceMapEntries`가 이 정보를 실제 함수에 매핑한다.
- → **복원을 위해 `FastFind.pdb` 필요** (동반되지 않으면 소스 매핑 불가).

### 결론

- 소스 복원 파이프라인은 **구축·확인 완료** (`WARMUP_OK`/`RECOVERY_DONE`).
- **완전 복원은 PDB 동반 분석으로 확정** — PDB를 Ghidra 프로젝트에 로드하면
  `getSourceMapEntries` + demangle이 실제 함수와 연결되어 `fastfind_recovered.txt`
 가 완성된다.

