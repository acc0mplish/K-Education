# Blue Team — 방어적 분석·감지 레인

> **교육용 · 방어 목적.** 본 문서는 K-Education 하네스의 방어(블루팀) 역량을 정리한다.
> 핵심 원칙: **하네스는 "크랙을 만들지 않고 크랙·약화를 감지"한다.**
> 공격 도구를 역으로 써서 **이미 뚫린/약화된 인스턴스를 탐지**하는 데 목적이 있다.

## 1. 목적 / 철학

레드팀 도구(SAST/SCA/역공학)를 **방어 관점**에서 운용:
- 내가 운영하는 앱/인프라의 **알려진 취약점(1-Day)** 사전 탐지
- 라이선스/구독 게이트가 **크랙되었거나 약화된** 상태인지 정적 감지
- 바이너리/바운더리 **무결성 기준선(baseline)** 수립 → 변조 탐지
- 분석 결과의 **투명한 coverage manifest** — 숨김 없이 실패/한계 기록

## 2. 감지 플러그인 (tier 7, "Lane 0 BLUE")

| 플러그인 | 감지 대상 | 신호 |
|---|---|---|
| `vuln_subscription` | 구독/라이선스 바이패스(S1-S8) | 게이트 fail-open, 하드코딩 우회, 원격 구독 엔드포인트 |
| `vuln_license_seafile` | Seafile Pro 라이선스 조작 | MaxUsers 비정상(≥7자리), 2099년 만료, 약한/누락 Hash·LicenceKEY, `is_pro_version` 하드코딩 True, DEBUG `IS_PRO_VERSION` 오버라이드, ELF 데몬 무결성 diff 대상 보고 |

두 플러그인 모두 **방어용 정적 디텍터** — 크랙된/약화된 인스턴스를 찾지, 크랙을
생성하지 않는다. ELF 바이너리는 known-good baseline 없이는 **자동 해시 체크하지 않음**
(오탐 방지). 운용자가 baseline 대비 diff.

## 3. 방어용 SCA / SAST (tier 8, 이중용도)

레드팀 카탈로그의 감사 도구를 방어에 그대로 사용:

| 목적 | 도구 |
|---|---|
| 앱 코드 취약점 | bandit(Python), semgrep(다언어) |
| 하드코딩 시크릿 유출 | gitleaks |
| 의존성 1-Day CVE | trivy_fs · grype · pip_audit · npm_audit · retirejs · dependency_check(Maven/Gradle/JAR) |

방어 시나리오: "내 앱이 취약한 라이브러리에 의존하는가?" → `dependency_check`/`retirejs`/`npm_audit`로 SBOM 기반 1-Day 스캔. 결과를 coverage manifest로 누적.

## 4. coverage 투명성 원칙 (§13.1) — 블루팀 신뢰의 핵심

```
canClaimFullCoverage         (47/84 종결)     ≠   canClaimAllToolsSucceeded (성공+비대상만)
```

- **실패를 숨기지 않음** — `execution_failed`, `timeout_deferred_retry`, `manual_install`,
  `install_failed`, `bridge_unavailable` 모두 manifest에 명시.
- 방어 보고서에서 **"전부 성공했다"는 거짓 주장을 구조적으로 차단**. coverage.json +
  report.html(5섹션 + 접힌 체크리스트 + 자동 리스크 감지)가 근거 제공.

## 5. target 프로파일링 2단계 게이트 (§12.5)

1. **profile** — zip/asar/pe/elf/mach_o/archive/network
2. **sub_profile** — object/archive/script/network

object 도구(pefile/lief/...)은 archive/script 자동 비적용. → MacRE가 겪은
**asar → Mach-O 오분류 방어**. 방어 분석의 정확도(오탐 감소)를 보장.

## 6. Electron = 비즈니스로직 우선 (§15.A, tier 0)

`t_electron` 레인이 asar 추출 + JS 비즈니스로직 스캔(DAF_* env, /api 엔드포인트, IPC,
child_process, auto-update, remote-mgmt, eval)을 1차로 수행. 방어 관점: **앱이 노출하는
공격면(API, 원격 제어, 동적 코드 실행)을 가장 먼저 매핑**. V8 PE(heavy)는 자동 DEFER.

## 7. 바이너리 RE 무결성 기준선 (tier 1-6, 중립)

서명/해시/지표 도구로 정상 baseline 수립:
- **코드서명**: osslsigncode(PE), codesign(macOS) — 서명 검증·만료·체인
- **지표 매칭**: yara(`tools/yara_rules/`), capa(FLARE 규칙, MITRE ATT&CK 매핑)
- **구조/엔트로피**: entropy, lief, capstone, retdec(probe-first)

baseline → 이후 스캔에서 변조/미서명/이상 지표 diff로 **무단 변경 탐지**.

## 8. 사용 흐름 (방어)

```bash
# 1) 내 앱/배포물 baseline 분석
harness/.venv/bin/python harness/main.py analyze <my-app.asar> --strategy full

# 2) 라이선스 게이트 건전성(크랙/약화 여부) 감지
#    → vuln_subscription / vuln_license_seafile 자동 포함(dir/zip/asar/pe/elf)

# 3) 의존성 1-Day 스캔
#    → dependency_check / retirejs / npm_audit 자동 포함

# 4) 투명 보고서
harness/.venv/bin/python harness/main.py report <my-app.asar>   # → report.html
```

## 9. 관련

- 공격 관점: [`RED_TEAM.md`](RED_TEAM.md)
- 전체 계획: [`WORKFLOW_PLAN.md`](../WORKFLOW_PLAN.md)
- 핵심 원칙·한계: [`README.md`](../README.md)
