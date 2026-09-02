# AES-128 KAT vec-A 재검사 (reconciliation)

> 🔴 Red 원리 · 교육용. 모든 검증은 **openssl / Node crypto / 자체 구현** 등
> 4개 독립 엔진이 일치. **데이터 유출 없음**.

## 1. 문제 (task premise)

과제 vec-A 출력으로 제시된 값:

```
69c4e0d86a7b0430d8cdb7507545a9de
```

입력: plaintext=`00112233445566778899aabbccddeeff`, key=`000102030405060708090a0b0c0d0e0f`

**이 값은 옳지 않다 — 잘려진 전사본(transcription error).** 마지막 5바이트가
손실됨 (`…8070b4c55a` → `…507545a9de`).

## 2. 정답 — 4개 독립 엔진 일치

| 입력 / 키 | AES-128-ECB 출력 |
|---|---|
| `00112233…455a` / `00010203…40f` | **`69c4e0d86a7b0430d8cdb78070b4c55a`** |
| FIPS-197 공식 B1 벡터 `3243f6a8…` / `2b7e1516…` | `3925841d02dc09fbdc118597196a0b32` (AES 제안서 §4.3 일치) |

검증 엔진: `openssl enc -aes-128-ecb`, `node crypto`, 자체 참조 구현
(FIPS-197 B1 재현), `aes_correct.py`. **모두 일치.**

## 3. 왜 premise 값이 틀렸는지 — 단서 (smoking gun)

```
decrypt(69c4e0d86a7b0430d8cdb7507545a9de, key=00010203…40f)
      = 692c731ed12ac8b0c24fd9b04620a7bc   ≠   00112233…
```

진짜 AES-128 ciphertext 는 같은 키로 다시 복호화하면 원래 평문이 나와야 한다.
나오지 않으므로 해당 값은 **부정한 부호화 값**이다. 다만 올바른 출력과
**11바이트 접두사**(`69c4e0d86a7b0430d8cdb7`)를 공유 → 마지막 ~5바이트 손상.

## 4. brute-force 결론 — 매개변수는 "자유"가 아니다

vec-A 에 대한 매개변수 브루트포스는 사실과 다르다. AES-128 의 네 자유도는
결국 **단 하나만 존재**한다:

| 자유도 | 지정된 값 (고정) |
|---|---|
| 라운드 수 Nr | 10 |
| state 초기화 | column-major (`pt[r+4·c]`) |
| ShiftRows | 왼쪽 이동 (`(c+r)%4`) |
| MixColumns | GF(2⁸) mul2/mul3 |
| key schedule | Rcon `01,02,04,08,10,20,40,80,1b,36` |

다른 모든 조합은 AES-128이 아니다. 따라서 정답은 유일하게
`69c4e0d86a7b0430d8cdb78070b4c55a` 하나뿐.

## 5. Seafile 과의 관련성

이 값은 `seafile_license_analysis.md` §6 의 AES-128-CBC 복호화(AES 키/IV 하드코딩)
근거와 같은 스펙이다. Seafile license.txt 복호화 PoC(`poc_seafile_license.py`,
black_runner **S3 lane**)는 이 정적 AES-128 구현 위에 올라간다.

---

**1 line:** vec-A Premise 값은 전사본 오류, 정답 AES-128-ECB 출력은
`69c4e0d86a7b0430d8cdb78070b4c55a`(4 엔진 일치, AES-128 유일 정의).
