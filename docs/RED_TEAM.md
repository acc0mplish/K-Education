# Red Team — 공격적 보안 평가 레인 (§17)

> **교육용 · 본인 소유/인가된 자산 대상만.** 본 문서는 K-Education 하네스의
> 공격적 평가(레드팀) 역량을 정리한다. 무기화 자동화 코드는 0건 — 모든 능동
> 스캐너는 **인가된 스콥(authorized scope)** 에서만, C2 프레임워크는 운용자가
> **격리 랩에서 수동 실행** 한다.

## 1. 목적 / 범위

현대 앱(React/Vue/Next/Electron)은 소스가 압축·난독화되어 있고, 의존성은 방대하다.
레드팀 관점에서 **구조 복원 → 1-Day 탐지 → 비즈니스 로직 역추론 → (인가 시) 능동 검증**
의 파이프라인을 자동화한다.

**포함:** 정적 감사(SAST/SCA/secret), 프론트엔드 난독해제, 웹 동적 스캔, 포렌식,
오프라인 패스워드 크랙(추출한 해시 대상), C2/익스플로잇 프레임워크(문서화·수동).
**제외(범위 밖):** DoS/stress, 피싱/소셜 엔지니어링.

## 2. 도구 인벤토리 (tier 8/9)

| 서브레인 | 도구 | tier | plugin | 비고 |
|---|---|---|---|---|
| **정적 감사 SAST** | bandit · semgrep · gitleaks | 8 | generic_cli | Python/다언어 SAST + 하드코딩 시크릿 |
| **SCA(의존성 CVE)** | trivy_fs · grype · pip_audit · npm_audit · retirejs · dependency_check | 8 | generic_cli | SBOM/fs/Python/npm/JS/Maven·Gradle 1-Day |
| **프론트엔드 난독해제** | wakaru_unpack · webcrack | 8 | generic_cli | webpack/esbuild/obfuscator.io 번들 → 가독 모듈 |
| **프론트엔드(수동)** | jsnice · jsdetox · ast_explorer | 8 | stub | 변수명 복원/디옵퓨케이터/AST 시각화 — 웹 도구 |
| **웹 동적(ACTIVE)** | nmap_vulners · nuclei · nikto · httpx · whatweb · gobuster · ffuf · sqlmap | 8 | generic_cli | **인가된 타깃에서만 자동 실행** |
| **웹 동적(수동)** | burp · local_map_ext | 8 | stub | 프록시 인터셉트 / Map-Local PoC 삽입 |
| **포렌식** | volatility3 · bulk_extractor | 8 | generic_cli | 메모리 덤프 / 대량 증거 추출 |
| **오프라인 패스워드** | john · hashcat | 9 | generic_cli | **추출한 해시 대상만** (라이브 크랙 X) |
| **C2/익스플로잇(수동)** | metasploit · empire · sliver · covenant · pupy · shellter | 9 | stub | **OPERATOR MANUAL ONLY** — 자동 실행 불가 |

> stub + `install.status:manual` → `runner.installed()=False` → 하네스가 **절대
> 자동 실행하지 않음**. 카탈로그 문서화만. 운용자가 격리 랩·인가 스콥에서 수동 실행.

## 3. 방법론

1. **probe-first** — radare2/retdec는 `--timeout`로 먼저 탐침, 실패/지연 시 DEFER.
2. **2단계 적용 게이트** — profile(asar/pe/elf/mach_o/network) + sub_profile
   (object/archive/script/network). object 도구는 archive/script에 자동 비적용(오분류 방어).
3. **투명 기록** — `execution_failed`/`timeout_deferred_retry`를 coverage manifest에 숨기지 않음.
   "전수 실행(coverage)" ≠ "전부 성공(success)".
4. **Electron = 비즈니스로직 우선** — asar/JS가 1차 분석면. V8 PE(183MB)는
   ghidra/retdec 자동 DEFER, asar/JS 레인으로 우회.

## 4. 프론트엔드 분석 파이프라인 (신규, 2026-07)

```
app.asar/zip ──t_electron──▶ asar 추출 + JS 스캔(DAF_*, /api, IPC, eval)
                                   │
                                   ▼  번들 식별 (main.js, chunk-*.js)
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
       wakaru_unpack                          dependency_check / retirejs
   (webpack/esbuild 분해 → 모듈)             (의존성 1-Day CVE)
              │
              ▼
         webcrack (obfuscator.io 난독해제 + unminify)
              │
              ▼
   [수동] jsnice(변수명 복원) → ast_explorer(커스텀 transform 작성)
              │
              ▼
   [수동/PoC] local_map_ext로 복원+계장한 번들을 브라우저에 serve → burp로 인터셉트/재생
```

**설치:** `bash tools/install.sh npm`(wakaru/webcrack) ·
`bash tools/install.sh depcheck`(OWASP, java 17 필요) ·
`!sudo bash tools/install.sh apt`(default-jre 포함).

## 5. 윤리적 경계

- 능동 스캐너(nuclei/sqlmap/...)는 **명시적 인가(authorized scope)** 대상만.
- 패스워드 크래커는 **이미 추출한 해시**에만(라이브 시스템 공격 X).
- C2/익스플로잇 프레임워크: 하네스가 **트로이목마/임플란트를 생성·배포하지 않음**.
  운용자가 격리 랩에서 수동으로 운용.
- DoS/stress · 피싱/소셜 엔지니어링은 카탈로그에서 **명시적으로 제외**.

## 6. 관련

- 전체 계획: [`WORKFLOW_PLAN.md`](../WORKFLOW_PLAN.md)
- 방어 관점: [`BLUE_TEAM.md`](BLUE_TEAM.md)
- 카탈로그 진실원: `tool_catalog.json` (tier 8/9) · `tool_catalog.macos.json`
