# attacks/binary_patch — 바이너리 정적 패치 (License Crack 핵심)

> 🔴 Red 원리 · 🔵 Blue 탐지. **교육용 · 본인 소유/취약랩 대상만.**

## 공격 원리 (RED)

상용 앱(PE/ELF/Mach-O/asar JS)의 라이선스 체크는 **클라이언트 코드에 내장**되어
있고, 정적으로 위치를 식별할 수 있다. 체크 함수를 **상수로 플립**하면 런타임에
항상 `true`를 돌려 라이선스 권한이 활성화된다.

| 기법 | 동작 | 타깃 신호 |
|---|---|---|
| **체크 함수 플립** | `is_pro()` / `check_license()` 을 `return True`로 오버레이 | 함수 몸체의 반환 상수 |
| **OEP(출입점) 패치** | 진입점에서 체크 루틴을 NOP/점프로 점령 | OEP 주소, 호출 체인 |
| **asar JS 패치** | `isSubscribed()` / `SUBSCRIPTION_STATUS` 검증을 `true`로 | 번들 JS 의 조건식 |

> Deepteam 원리 적용: 이 레인은 `attacks/` 축에서 **single-turn 정적 패치**에 해당.

## 대표 도구 (K-Education)

- **정적 스캔** — `harness/main.py analyze` (+ `t_vuln_license_seafile`, `t_vuln_subscription`)
- **이진 탐색** — `radare2`/`rizin`·`objdump`·`readelf`/`nm`·`otool`·`strings`
- **디어셈블** — `retdec`·`ghidra`(probe-first + `--timeout`)
- **asar** — `asar` 추출 후 JS 조건 플립

## 예시 실행 (own-lab)

```bash
python education/black_team/black_runner.py /path/to/own_target.bin --i-own-this
# → evidence/<t>/black_findings.json (check_bypassed O/X)
```

## 🔵 BLUE — 탐지/완화

| 탐지 지표 | 의미 | 완화 |
|---|---|---|
| 이진 시그널 변조 | 체크 상수 `return False`→`True` 플립 | 코드 서명, 무결성 비교 (baseline) |
| OEP 비정상 점령 | 진입점 부근 NOP/점프 | EAT/IAT 모니터링, 안티태퍼 |
| signature 부재 | 서명 검증 스킵 | 부팅 시 서명 검증 강제 |
|asar/JS 무결성 | 번들 JS 조건 플립 | 번들 시그널 해시 저장·검증 |

> 이 레인은 V1(**클라이언트 코드 신뢰**) 결함을 노린다. 탐지 규칙은
> `harness/plugins/t_vuln_license_seafile.py`의 이진 시그널 스캔과 동형.

## 윤리
본 PoC = **generic 원리 시연**. 본인 소유 앱·취약랩 외 실행 금지 (`--i-own-this` 필수).
배포용 크랙/keygen/범용 패처 미제공. 모든 분석은 **로컬 LLM 전용** (데이터 유출 없음, main §0).
