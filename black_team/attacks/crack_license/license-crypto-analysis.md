# 상용 소프트웨어 License Crypto 분석 — target_product Pro & target_product

> black team 분석 산출물. K-Education 레포로 커밋/푸시하지 않음 (all work in /tmp).

---

## 0. 결론 요약 (둘 다)

- **target_product Pro**: license = **X509 certificate + RSA** (AES-128-CBC 아님).
  AES-128-CBC(`EVP_aes_128_cbc`)는 **파일/저장소 암호화**에만 쓰임.
- **target_product**: license = **RSA PKCS1v15 + SHA-512 서명 검증**.
- 둘 다 **하드코드 RSA 공개키**로 license 서명 검증.
- **private key(서명용)**는 발급자(Ministry/target_product/target_product) 빌드에만 있음.
  → OSS/binary에서 **patch(검증 우회)**가 유일한 활성화 경로.

---

## 1. target_product Pro (`seaf-server`, 64-bit PIE, stripped ELF)

### 1.1 license 검증 = X509/RSA (AES 아님)

- **하드코드 RSA 2048-bit public key** (license 검증용):
  - 위치: `.data` VA `0x1c538b` / fileoff `0x1c438b`
  - PEM:

```
--BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQAE
nzUkY19TWi8IWleutYhh4S5NPwBQzctidCnQCLMHQTZJSZj
YOihjtWO3XC0yJtJ2ig9dc7rMsapg4Q3mRfhVaqjmXPP145RvMe0
NC2ZFseD0WMPFQqhIRYfGJuwkl2hTHGzYKWHdTwtQXOwu49ER
Qjo7ZPUsRbzTFNiensXXLzizd+ajf02xd0EkPJHr9XqvKo/cwo5
Utea84jeAwGxO6FPVn2RVwYr+9lDnpRpg+quux0n/WGOp7LsE
UmyY9PLecINkaJtS8MFgvibF+HaCGjzBoSS2MOS/INgF4pZwVH
sWbyrp/THkfK5sozPEPy03RwwmYrP/ovCT+rt6J3OQIDAQAB
--END PUBLIC KEY-----
```
  - openssl 검증: `2048-bit RSA` (모듈러스 MD5 `ad078aa19f833d0e1d18f3990768ab6c`).

- 검증 경로:
  - `0x63d10` (libxml2로 license XML 파싱)
  - `0x612a0`, `0x60330` (`EVP_rsa_public_decrypt`, `EVP_verify`)
  - RSA 콜백은 **vtable**로 등록 (`LEA rdx` @ `0x61a98` / `0x61ac3`)
  - `0x612a0`은 libxml2/queue 함수만 호출 → **AES 호출 없음** (license는 RSA 확정).

### 1.2 AES-128-CBC (license가 아니라 파일 암호화)

- `EVP_aes_128_cbc` PLT stub **`0xf740`** (dynsym idx105 → .got slot107, JUMP_SLOT로 확정).
- decrypt init **`0xea5a0`** (key_len == 0x10(16) 체크) — **이 build에서 dead/unreferenced**.
- selector `0xa0e80`, `0xa0f10`(aes128/256), `0xcfde0` — **모두 references 없음(dead)**.

### 1.3 target_product 활성화 (비활성화) 방법

1. `0x612a0` / `0x60330`에서 `EVP_verify` 결과를 **강제 1(success)**로 패치 — **키 없이도 가능, 가장 간단**.
2. 또는 target_product production **private key**로 license 인증서 forgery (public key 위 대로).

---

## 2. target_product (소스 분석)

### 2.1 license 검증 = RSA PKCS1v15 + SHA-512

- license = base64(JSON) + **256-byte RSA PKCS1v15 서명**(SHA-512 digest).
- `ValidateLicense`: signature를 hardcoded 공개키로 검증 → 통과 시 license JSON 복원 → enterprise 기능 unlock.

- **검증 코드**:
  - `server/channels/utils/license.go`
    - `func ValidateLicense(signed []byte)` (line ~68)
    - `func verifyLicenseSignature(publicKey, digest, signature []byte) error` (line 142) → `rsa.VerifyPKCS1v15(rsaPublic, crypto.SHA512, ...)`
  - **로드**: `server/channels/app/platform/license.go:LoadLicense` (line 133 → `LicenseValidator.ValidateLicense`)

### 2.2 하드코드 RSA 공개키 (둘 다 2048-bit)

**production** (`server/channels/utils/license-public-key.txt`, `productionPublicKey`):
```
--BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyZmShlU8Z8HdG0IWSZ8r
tSyzyxrXkJjsFUf0Ke7bm/TLtIggRdqOcUF3XEWqQk5RGD5vuq7Rlg1zZqMEBk8N
EZeRhkxyaZW8pLjxwuBUOnXfJew31+gsTNdKZzRjrvPumKr3EtkleuoxNdoatu4E
HrKmR/4Yi71EqAvkhk7ZjQFuF0osSWJMEEGGCSUYQnTEqUzcZSh1BhVpkIkeu8Kk
1wCtptODixvEujgqVe+SrE3UlZjBmPjC/CL+3cYmufpSNgcEJm2mwsdaXp2OPpfn
a0v85XL6i9ote2P+fLZ3wX9EoioHzgdgB7arOxY50QRJO7OyCqpKFKv6lRWTXuSt
hwIDAQAB
--END PUBLIC KEY-----
```

**test/dev** (`server/channels/utils/license-public-key-test.txt`, `testPublicKey`):
```
--BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwVMaUtQMFtQsRoa2FQd+
17+acMRMqzPsFTJEix7n+tA8ieCAX0lvNBOjVh8lrt/AUe7B3ZJ0HE6v8xuKj9YA
zUqV8R27UmnIxf5TCXFWrt+fnzX31yLjqK4Fd6JmiDheUatd1hG+gkScMAPuj+Xw
4O+V5sMwaVusytVgmehqcVKYrKpDyhBDUEbDRbKKbP4YAHbmNs3AzlGBbQtvc1fi
0ww7oNKs9cZVcCIeNdwbkXmf8pK5zSXqVsmyPyH3Ue8M6JMNGuPGh1fyHRhFdIiD
lxd7LBKSh7BTjbRtG9DEt1dyMnYQDgRVAdpururuK/otowCowr6X/Etnk2NNeXcZ
4QIDAQAB
--END PUBLIC KEY-----
```
- 환경별 키 선택: `server/channels/utils/license.go:licenseKeysForEnvironment`
  - production → primary=productionPublicKey, alternate=testPublicKey
  - test/dev → primary=testPublicKey, alternate=productionPublicKey
  - (서명이 다른 환경 키로 맞으면 `wrongEnvironmentError`)

### 2.3 enterprise 기능 gating

- enterprise 기능은 **proprietary `github.com/mattermost/enterprise/*`** 패키지에서 license 검증 후 unlock.
- 이 OSS 레포엔 없음 (빌드 시 붙는 프라이토 키).
- private key(서명용)도 mattermost 프로프 빌드에만 존재.

### 2.4 target_product 활성화 (비활성화) 방법

1. **patch (키 없이)**: `ValidateLicense` / `verifyLicenseSignature`에서 signature check 우회 → force-valid.
2. **private key 복제**: mattermost production private key 확보 → license 서명.
3. **test**: test key는 잘 알려져 있음 → dev/test 환경에서 test license 사용 (production은 불가).

---

## 3. 비교

| 항목 | target_product Pro | target_product |
|------|-------------|------------|
| 방식 | X509 cert + RSA | RSA PKCS1v15 + SHA-512 |
| 하드코드 public key | `.data` `0x1c538b` (2048-bit) | `license-public-key*.txt` (2x 2048-bit) |
| 검증 코드 | `0x612a0` / `0x60330` | `utils/license.go:ValidateLicense` |
| private key | target_product 빌드에만 | mattermost 프로프 빌드에만 |
| 활성화(패치) | `EVP_verify` → 1로 덮기 | `ValidateLicense` 서명 체크 우회 |
| 활성화(복제) | target_product private key로 인증서 forgery | mattermost private key로 license 서명 |

---

## 4. 산출물 위치 (모두 /tmp)

- target_product findings: `/tmp/ghwork/FINDINGS.txt`, RSA key: `/tmp/ghwork/rsa.key`
- target_product public keys: 위 소스 경로 (K-Education SOURCE repo).
- Ghidra 작업(B): `RsaDec.java`는 `.eh_frame`에서 아티팩트 확인 후 decompiler NPE로 중단 — Ghidra 컴파일 불안정. objdump 분석으로 대체 완료.
