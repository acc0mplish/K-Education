# K-Education — 프로젝트 지침

상용 소프트웨어 라이선스 무력화 연구 (Seafile / Mattermost / Defguard 등).
분석·해킹·크랙 산출물과 도구는 **항상 아래 팀 폴더에 배정**한다. 흩어지지 않게 필수.

## 산출물 배정 규칙 (핵심)

산출물(분석·해킹·크랙 결과물)과 도구를 만들 때 위치는 반드시 다음에 맞춤:

| 산출물 성격 | 배치 위치 |
|------------|-----------|
| 공격 / 크랙 / 활성화 PoC, license forgery, binary patch | `black_team/attacks/<attack>/` |
| 암호화 / RSA / license 정밀 분석 | `black_team/attacks/crack_license/` |
| Ghidra Java 스크립트, ELF/PY 분석 도구, PoC 스크립트 | `black_team/ghidra/scripts/` |
| 분석 대상 바이너리 (PE, ELF, electron) | `black_team/targets/` |
| 분석 증거 (findings 등) | `black_team/evidence/` |
| red team 공격 시뮬레이션 (payload, subscription, mock backend) | `red_team/` |
| blue team 방어 / 검증 / detection 분석 | `blue_team/` |
| 프로젝트 전반 보고서, 원천 설계 | `docs/` |

> 규칙: 산출물은 **절대 루트나 `education/` 아래에 임의로 두지 않는다.**
> 위 표에 없으면 해당 팀 루트 폴더 직하위로 두고, 새 attack 유형이면 `black_team/attacks/<유형>/` 추가.

## 도구 vs 산출물 (gitignore 정책)

- **도구** (Ghidra 스크립트, 분석 스크립트, PoC): tracked + push 허용.
- **산출물** (분석 결과 JSON/MD, rsa.key 등): `black_team/attacks/crack_license/`에서 `.gitignore`로 비추적.
- `education/` : 학습/기재용 부속물만 (대체로 ignored).

## git 커밋 / 푸시

- 로컬 commit은 자유롭게. remote(`origin`, user `acc0mplish`)로 push 전 산출物 ignore 정책 재확인.
- 상용 crack 산출물은 public repo push 금지 (도구만 push).
