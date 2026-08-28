# black_team labs — 라이선스 무력화 실습 타겟 (owned lab)

> **교육용 · 본인 소유/의도적 취약랩 대상.** 외부 노출·타인 시스템 금지.

## 이 랩은?

Black Team PoC(binary_patch/date_patch/crack_license/circumvent)를 **본인 소유 앱**
또는 **의도적 취약랩**에서 안전하게 실습하는 타겟 목록. 실제 상용 앱은 라이선스·
저작권 문제로 제공하지 않으며, PoC 는 항상 generic·own-lab 전용이다.

## 실용 타겟 (권장)

| 타겟 | 용도 | 준비 |
|---|---|---|
| **본인 소유 앱** | 실제 라이선스 체크 우회 실습 | `--i-own-this` 어설션 후 실행 |
| **self-built target** | 라이선스 체크가 내장된 샘플 앱 | 본인 코드로 `is_pro()`/`Expiration` 내장 |
| **mock app (own code)** | circumvent/flag 위회 연습 | `FLAG_PREMIUM=true` 게이트 내장 |

##own-lab 샘플 앱 제작 (간단 예)

본인 코드로 “ 라이선스 체크가 내장된 ” 타겟을 만들면 PoC 실습이 안전하다:

```python
# demo_target.py — 본인 소유 샘플 타겟 (라이선스 체크 내장)
def is_pro():
    return check_license()          # <- 이 함수를 PoC 가 플립/위조

def check_license():
    # weak 검증: plain flag 만으로 판정 (Black Team 이 노리는 V4)
    return globals().get("FLAG_PREMIUM", False)
```

이 파일을 own-lab 로 실행:

```bash
python education/black_team/attacks/circumvent/poc_circumvent.py demo_target.py --i-own-this
python education/black_team/black_runner.py demo_target.py --i-own-this
```

## 격리 랩 실행 시 주의

- **모든 PoC = `--i-own-this` 필수** (비-로컬 타겟 자동 거부).
- 시계 회전/ida·frida 등 동적 도구는 **격리 랩**(가상환경/랩)에서만 운용자 수동 실행.
- `evidence/<target>/` 에 이진 스코어(`black_findings.json`)가 기록됨.
- 분석 후 Blue 로 탐지 재검증:
  ```bash
  harness/.venv/bin/python harness/main.py analyze <target.zip> --strategy full
  # → evidence/<t>/vuln_license.out (Blue)
  ```

## 윤리 (HARD)

- 본인 소유 앱 · 의도적 취약랩 외 실행 금지.
- 배포용 크랙/keygen/범용 패처·DoS 도구·실제 상용 소프트 우회 금지.
- 타인 시스템·서비스 공격·저작물 복제 금지.
