# target_product Pro 13.0.27 라이선스 무력화 분석 (다각도)

> 🔴 Red 원리 · 🔵 Blue 탐지. **교육용 · 본인 소유/취약랩 대상만.**
> 대상: `target_server_13.0.27_x86-64_Ubuntu.tar.gz` (상용 파일서버)
> 분석 방법: **정적 역어셈블리** (`seaf-server` ELF + `pro/python`), strings 스캔.
> 모든 분석은 **로컬 LLM 전용** (데이터 유출 없음, main README §0).

## 0. 요약 (1 line)

target_product 라이선스 = **`license.txt`(AES-128-CBC 암호화) + SHA1 변조검사(`Hash`) +
RSA2048 서명(`Hash2`) + board-UUID 바인딩**의 4중 계층. **가장 약한 고리 =
`seaf-server` C 라이브러리에 하드코딩된 AES 키/IV** (이진에서 추출 가능) —
이를 뚫으면 공식 `license.txt` 를 열람·재암호화할 수 있고, `Hash`/`Hash2` 검사만
우회하면 `MaxUsers`/`Expiration` 위조가 가능하다.

---

## 1. 라이선스 아키텍처 (RED — 원리)

`license.txt` 는 seafile 데이터 디렉토리(`seafile-data/`)에 존재하며,
**`libseafile`(C)** 가 읽어서 검증한다. `seaf-server`(1.8MB, libseafile 정적 링크)
안에서 동작한다. 검증 체인:

```
license.txt (AES-128-CBC 암호화 ← 하드코딩 키/IV)
  └─ AES decrypt  (EVP_aes_128_cbc, seaf-server 내부)
       └─ XML 콘텐츠:
             <MaxUsers>100</MaxUsers>
             <Expiration>2099-01-01</Expiration>
             <UUID>board-uuid</UUID>            ← 서버 board UUID 와 일치해야 함
             <Hash>sha1(콘텐츠)</Hash>          ← 변조 검사 (S3/blue: "License hash mismatch")
             <Hash2>rsa-sign(Hash)</Hash2>      ← 벤더 RSA private key 서명 (S5)
  └─ seafile_check_license():
       - Hash  일치? (calc_lic_sha1, OpenSSL EVP_sha1)   ← "License hash mismatch"
       - Hash2 RSA 검증? (RSA_public_decrypt, 벤더 pub)   ← 유일한 장벽
       - UUID  일치? (board uuid)                        ← "Board uuid not match"
       - Expirationpast?                                   ← "the license has expired"
       - MaxUsers 초과?
```

### 1.1 확인된 심볼 / 상수 (정적 분석)

| 항목 | 값 / 위치 | 의미 |
|---|---|---|
| `calc_lic_sha1` / `calc_lic_hash` | `common/license.c` → `seaf-server` | `Hash` = 콘텐츠 SHA1 재계산 (변조검사) |
| AES | `EVP_aes_128_cbc`, `EVP_DecryptInit_ex`, `EVP_DecryptUpdate` | license.txt 복호화 알고리즘 |
| `RSA_public_decrypt` | OpenSSL | `Hash2` 서명 검증 (벤더 private key 필요) |
| `decrypt_lic_sha1` | `common/license.c` | license 복호화+SHA1 함수 |
| 문자열 | `Board uuid not match`, `No hash2 field`, `License hash mismatch`, `the license has expired` | 검증 지점의 에러 메시지 (변호 검사 순서 노출) |
| hex-lookup | `0123456789abcdef` (rodata) | `calc_lic_hash` 의 16진 인코딩 테이블 |
| 파일 | `license.txt` (seafile-data) | 라이선스 저장 위치 |

> **핵심 취약점**: AES 키와 IV 가 `seaf-server` 이진에 **하드코딩**되어 있다.
> 이것은 V1(클라이언트 코드 신뢰)의 직접적 사례 — 정적 분석으로 키를 추출할 수
> 있으며, 추출된 키로 공식 license.txt 를 복호화하고 수정 후 재암호화 가능하다.

---

## 2. 다각도 공격 벡터 (RED)

black_taxonomy 의 4 우회 레인(binary_patch/date_patch/crack_license/circumvent)에
1:1 매핑. 난이도는 ★(쉬움)~★★★(어려움).

### Lane 0 · **S1/S6 — binary_patch (정적 이진 플립)**
| ID | 방법 | 노리는 결함 | 난이도 |
|---|---|---|---|
| S1 | `seaf-server` 의 `seafile_check_license()` / `seafile_manager_is_license_valid()` 반환상을 상수 `1`로 플립 (OEP 패치) | 클라이언트 코드 신뢰 (V1) | ★★☆ |
| S6 | `calc_lic_sha1`/`RSA_public_decrypt` 호출을 NOP 또는 `0` 리턴으로 교체 | 코드 신뢰 | ★★☆ |

- 이진은 **stripped PIE ELF** → 심볼 없음. 문자열 참조(`"License hash mismatch"` 등)로
  함수 주소를 추적한 뒤 `leaq`/`callq` 를 `nop`/상수 리턴으로 패치.
- Blue 지표: 이진 시그널 변조, OEP 비정상, signature 부재 (정적 비교로 탐지).

### Lane 1 · **S3/S5 — crack_license (파일 위조 + 키 재구현)**
| ID | 방법 | 노리는 결함 | 난이도 |
|---|---|---|---|
| S3 | 하드코딩 AES 키/IV 로 `license.txt` 복호화 → `MaxUsers`/`Expiration` 변경 → 재암호화 | 약한 라이선스 검증 (V3) | ★★☆ |
| S5 | `calc_lic_sha1` 재구현으로 `Hash` 재생성 → `Hash2` RSA 검사 스킵 (검증 로직 우회) | 로컬 상태 신뢰 (V4) | ★★★ |

- **S3의 관문**: AES 키/IV 추출 → 복호화 → 필드 수정 → `Hash` 재생성 → 재암호화.
  `Hash2`(RSA)만 우회하면 전체 통과.
- **S5의 관문**: `Hash2` 는 벤더 RSA **private key**로만 생성 가능 → private key
  없으면 불가. 따라서 우회하려면 **코드 패치(S1/S6)** 또는 **RSA 키 추출** 필요.
- Blue 지표: `MaxUsers` 과도하게 큼, weak hash, fake 키, far-future 만료 (정적/동적).

### Lane 2 · **S7 — date_patch (시간 우회)**
| ID | 방법 | 노리는 결함 | 난이도 |
|---|---|---|---|
| S7 | `Expiration`이 미래로 표시된 위조 license 사용 / 시스템 클록/NTP 로kalexpired 처리 | 시간의 클라이언트 권위 (V2) | ★★ |

- `the license has expired` 검증을 로컬 시계로 우회. NTP 미연동 서버가 표적.

### Lane 3 · **S2/S4/S8 — circumvent (로컬 훅/위조)**
| ID | 방법 | 노리는 결함 | 난이도 |
|---|---|---|---|
| S2 | Frida 로 `seafile_check_license` 심볼 훅 → `1` 강제 | 로컬 상태 신뢰 (V4) | ★★★ |
| S4 | license cache/플래그 위조 (빈 license → trial 게이트 우회) | 로컬 신뢰 (V4) | ★★ |
| S8 | 유효 license 응답/토큰 재플레이 | 서버 권위 부재 | ★★ |

---

## 3. 방어결함 매핑 (Blue 관점)

| 결함 ID | 결함 | target_product 에서의 표현 | Blue 탐지 |
|---|---|---|---|
| **V1** | 클라이언트 코드 신뢰 | AES 키/IV 하드코딩, `check_license` 플립 가능 | 코드 서명, 무결성 비교, 안티태퍼 |
| **V2** | 시간 클라이언트 권위 | `Expiration` 로컬 판정 | 서버 권위 시간, NTP 연동 |
| **V3** | 약한 라이선스 검증 | `MaxUsers`/`Hash` 평문 접근 | 서명/암호화 저장, 키 강도 |
| **V4** | 로컬 상태 신뢰 | `calc_lic_sha1`/UUID 위조 | 서버 재검증, 변조 감지 |

---

## 4. 실증 (empirical — 정적 분석)

```
seaf-server: ELF 64-bit PIE x86-64, stripped, dynamically linked, for GNU/Linux 3.2.0
  license strings: "License hash mismatch", "No hash2 field",
                   "the license has expired", "Board uuid not match"
  crypto: EVP_aes_128_cbc, EVP_DecryptInit/Update, RSA_public_decrypt, EVP_sha1
  symbols: calc_lic_sha1 / calc_lic_hash / decrypt_lic_sha1  (common/license.c)
  format: MaxUsers / Expiration / UUID / Hash / Hash2  (license.txt)
```

**결론**: target_product 라이선스는 "로컬에서 복호화+검증하는 4중 계층"이며,
**AES 키/IV 하드코딩이 유일한 결정적 약점**. 이를 관통하면 `MaxUsers`(사용자 수)/
`Expiration`(만료) 위조 → Pro 기능 활성화. 오직 `Hash2` 의 RSA **private key**だけが
서버 권위를 담보하는 관문.

---

> 📎 관련 — AES-128 KAT vec-A 재검사 (정확한 AES-128 정의):
> [`research/aes128_veca_reconciliation.md`](research/aes128_veca_reconciliation.md).
> target_product license.txt 복호화의 AES-128-CBC 스펙 근거가 동일하다.

---

## 6. SeaRPC coord dispatcher (이 세션 정적 어셈블리 추가)

> 📊 방법: `seaf-server` ELF를 Ghidra `analyzeHeadless`(+ JDK 26)로 정적 분석.
> 분석 **Java 프롭**은 `attacks/crack_license/research/ghidra/` (reproduce).

라이선스 검증 로직은 `libseafile`의 C 함수이지만, 그 안의 **협업 RPC(SeaRPC)
coordination 계층**도 역산했다. AES coord(`0x19d140`)가 *어떻게* 호출되는지가
우회의 실제 경로나원 포인트다.

### 6.1 `FUN_001111c0` — "setup"이지만 실제는 `main`

- **direct `CALL` 참조 = 0**. 오직 DATA(2) + INDIRECTION(1)만 존재 → **간접 호출**(
  주소가 전역 테이블에 저장됨: `INDIRECTION @0x28a3ac`, `DATA @0x293eb8`). OEP/crt0
  방식 진입.
- 인사는 `getopt_long` 옵션 스위치, `event_init`, `FUN_0018ac50`/`FUN_0018a940`/
  `FUN_00121550` 등 init 루틴.
- **B64 coord(`0x18fc30`)를 `0x11327e`에서 레퍼런스** → `searpc_register_function`
 로 넘어감 (main 이 B64를 직접 등록).
- **AES coord(`0x19d140`)는 main 에서 레퍼런스 안 함** → AES 는 이 경로로 안 감.

### 6.2 AES coord(`0x19d140`) — 9 wrapper, 두 가지 dispatch

| wrapper | incoming refs | dispatch |
|---|---|---|
| `0x14c2e0` | DATA=2, INDIRECTION=1 | **indirect**(pointer-only) |
| `0x151b60` | DATA=2, INDIRECTION=1 | indirect |
| `0x1566a0` | DATA=2, INDIRECTION=1 | indirect |
| `0x173b60` | DATA=1, INDIRECTION=1 | indirect |
| `0x173c80` | DATA=1, INDIRECTION=1 | indirect |
| `0x173da0` | DATA=1, INDIRECTION=1 | indirect |
| `0x170f50` | UNCOND_CALL=12 | direct (12 caller) |
| `0x172130` | UNCOND_CALL=22 | direct (**22 caller**) |
| `0x1886a0` | UNCOND_CALL=2 | direct (2 caller) |

- **6개 indirect = 오직 function-pointer 로만 참조** → **jump table (`0x2a0xxx`)**
  진입. (`@0x2a0b0c`→`0x173b60`, `@0x2a0b5c`→`0x173c80`, `@0x2a0bac`→`0x173da0`,
  약 0x50 간격 순차 = vtable/jump-table 구조).
- **3개 direct**: `0x172130`(22 caller), `0x170f50`(12), `0x1886a0`(2) — 여러 RPC
  handler 모음.

### 6.3 upward walk — leaf-most dispatcher 수렴

`0x131830`(2 wrapper 직접 호출)을 위로 올리면 **LEAF 함수로 수렴**:

```
0x131830 (direct-dispatcher, wrappers ×2)
 ├─ 0x135fe0 ── 0x13ab80  ← LEAF (caller 없음)
 └─ 0x1399a0 ── 0x13b2a0 / 0x13be10
                 └─ 0x13be10 ── 0x190b70 · 0x190e80  ← LEAF (caller 없음)
```

→ **`0x13ab80` / `0x190b70` / `0x190e80`** = AES coord 체인의 **top-level leaf(entry)
함수**. 여기서 더 이상 호출자 없음 = 라우팅 근원.

### 6.4 결론 (우회 관점)

- AES coord 는 **단일 dispatcher 가 아니라 세 경로**로 reach: jump table(`0x2a0xxx`)
  + direct dispatcher(`0x131830`) + multi-caller(`0x172130/0x170f50/0x1886a0`).
- **가장 약한 고리는 여전히 §1 의 AES 키/IV 하드코딩** (복호화+위조 가능).
- `Hash2` RSA 서명은 **벤더 private key 필요** → keygen 은 private key 없으면 불가,
  오직 코드 패치(S1/S6) 또는 키 추출로만 full 유효 license 생성 가능.

---

## 5. 윤리 / 한계

- 이 분석은 **generic 위조 시제 시연** (실제 상용 키 생성 아님).
- `Hash2` RSA 서명은 벤더 private key 없이면 생성 불가 (복호화·필드 위조는 가능).
- 본인 소유 앱/취약랩 외 실행 금지. 배포용 크랙/keygen/범용 패처 미제공.
- 모든 분석 **로컬 LLM 전용** (데이터 유출 없음).
