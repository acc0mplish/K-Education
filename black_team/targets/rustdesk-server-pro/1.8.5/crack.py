#!/usr/bin/env python3
"""
RustDesk Server Pro 1.8.5 (linux-amd64) license bypass — black_team PoC
=====================================================================
역설계된 검증 체인 (nm/objdump + 내장 ELF 파서로 복원):

  hbbs::lic::PUBLIC_KEY        ed25519 공개키 OnceCell  @ .data 0x1d631c0
                               (심볼 _ZN4hbbs3lic10PUBLIC_KEY…)
      └ 초기화 함수가 .rodata 0x14c834b 의 base64 44B 문자열을 decode
  hbbs::lic::SECRET_BOX_KEY    libsodium secretbox(xsalsa20poly1305)
                               OnceCell @ .data 0x1d631f8
      └ 초기화 함수가 .rodata 의 nonce 24B @0x14c8377 / key 32B @0x14c7f60 로드
  LicenseCheckConfig::read_file @ 0x8dde80
      Config::path(".license_check") -> ProjectDirs(APP_NAME="rustdesk")
        -> $XDG_CONFIG_HOME/rustdesk/.license_check
      -> fs::read -> secretbox::open -> serde_json
  RendezvousServer::start (0x1d5680..) 로컬 로드 분기:
      0x1d8506  license == get_env_or("license","")  불일치 -> remove_file
      0x1d8525  je -> decode_payload (b64 -> ed25519 verify(PUBLIC_KEY)
                                      -> serde_json::from_trait)
      0x1d8600  Machine::same(uid,mac) 불일치 -> WARN + remove_file
      성공 -> INFO "Local license loaded" (lic.rs:332)

공격 (패치 3곳 + 오프라인 위조):
  P1  0x14c834b  공개키 base64 44B 를 공격자 키로 교체 (길이 동일)
  P2  0x1d8525   je -> jmp        : license 문자열 비교 우회
  P3  0xd31000   Machine::same -> mov al,1; ret : 머신 바인딩 제거
  위조  .license_check = secretbox(하드코딩 key/nonce로 봉인)
       {license:"", license_response_payload: b64(our_sig||payload_json),
        network_failure_count:0}
       payload = {type:0, expiry:2000000000(int), next_check_time:1999999999,
                  nonce:"", machine:{uid:"",mac:""}, max_*:10000}

내장 ELF 파서 (macOS에 readelf가 없어 순수 파이썬으로 작성, 본 파일에 통합):
  - 섹션 헤더 -> VA<->파일오프셋 매핑 (.data 는 VA!=오프셋 주의)
  - .symtab -> hbbs::lic::* / Machine::same 심볼 주소
  - RIP-상대 lea/mov + movabs 스캔 -> 정적 OnceCell 을 참조하는 함수 역탐색,
    그 함수들이 로드하는 .rodata 상수(공개키 b64/nonce/key) 자동 발견
  - SHT_RELA(R_X86_64_RELATIVE) -> GOT 간접호출 타깃 복원 (inspect 데모)
  발견 결과가 1.8.5 하드코딩 상수와 다르면(다른 빌드) 경고 후 상수 사용.

사용:
  python3 crack.py                       # cracked/hbbs + cracked/.license_check 생성
  python3 crack.py inspect               # 체인 자동 분석 결과 출력
  python3 crack.py check ~/.config/rustdesk/.license_check   # 캐시 파일 복호화·검증
  mkdir -p ~/.config/rustdesk && cp cracked/.license_check ~/.config/rustdesk/
  ./cracked/hbbs                         # -> INFO [src/lic.rs:332] Local license loaded
"""
import argparse, base64, bisect, json, os, re, struct, sys

# ---- 1.8.5 linux-amd64 기준 상수 (발견 실패시 폴백) ------------------------
ORIG_PUBKEY_B64 = b"OeVuKk5nlHiXp+APNn0Y3pC1Iwpwn44JGqrQCsWqmBw="
PUBKEY_STR_OFF = 0x14C834B          # file offset == VA (.rodata)
LICENSE_JE_OFF = 0x1D8525           # '74 3d' je decode_path  -> 'eb 3d' jmp
MACHINE_SAME   = 0xD31000           # '48 8b 57 10'           -> 'b0 01 c3' return true

SB_NONCE = bytes.fromhex("fb95e4ca780827a2899da1ed9017b9d92cb8d7cce8850b39")  # 24B
SB_KEY = bytes.fromhex("99be5f0ce283832e673f9003f97bc7142fce0ce5a67eafcc7828d03a1945e2bc")  # 32B

from nacl.signing import SigningKey, VerifyKey
from nacl.secret import SecretBox
from nacl.exceptions import BadSignatureError, CryptoError

# ==================== ELF 파서 (readelf 대체) ====================
SHT_SYMTAB, SHT_RELA, SHT_NOBITS = 2, 4, 8
B64_44 = re.compile(rb"^[A-Za-z0-9+/]{43}=$")


class ELF:
    """ELF64 LE 최소 파서: 섹션/VA 매핑, symtab, RELA(GOT), rip-xref 스캔."""

    def __init__(self, data: bytes):
        if data[:6] != b"\x7fELF\x02\x01":
            sys.exit("[-] 대상이 ELF64 little-endian이 아님")
        self.data = data
        (self.e_shoff,) = struct.unpack_from("<Q", data, 0x28)
        self.e_shentsize, self.e_shnum, self.e_shstrndx = struct.unpack_from(
            "<HHH", data, 0x3A)
        raw = [struct.unpack_from("<IIQQQQIIQQ", data,
                                  self.e_shoff + i * self.e_shentsize)
               for i in range(self.e_shnum)]
        sh = raw[self.e_shstrndx]
        shstr = data[sh[4]:sh[4] + sh[5]]
        self.sections = [dict(
            name=shstr[f[0]:].split(b"\0")[0].decode(), type=f[1],
            addr=f[3], offset=f[4], size=f[5], link=f[6], entsize=f[9])
            for f in raw]
        self._syms = None
        self._funcs = None

    def sec(self, name):
        for s in self.sections:
            if s["name"] == name:
                return s
        return None

    def sec_of(self, va):
        for s in self.sections:
            if s["type"] != SHT_NOBITS and s["addr"] and s["addr"] <= va < s["addr"] + s["size"]:
                return s["name"]
        return None

    def va2off(self, va):
        for s in self.sections:
            if s["type"] != SHT_NOBITS and s["addr"] and s["addr"] <= va < s["addr"] + s["size"]:
                return va - s["addr"] + s["offset"]
        return None

    def read(self, va, n):
        off = self.va2off(va)
        return None if off is None else self.data[off:off + n]

    def symbols(self):
        """[(name, value, size, type)] — SYMTAB+DYNSYM 병합, 주소 정렬."""
        if self._syms is None:
            syms = set()
            for s in self.sections:
                if s["type"] not in (SHT_SYMTAB, 11) or not s["entsize"]:
                    continue
                stsec = self.sections[s["link"]]
                st = self.data[stsec["offset"]:stsec["offset"] + stsec["size"]]
                for i in range(s["size"] // s["entsize"]):
                    off = s["offset"] + i * s["entsize"]
                    nm, info, _other, _shndx, value, size = struct.unpack_from(
                        "<IBBHQQ", self.data, off)
                    if not nm or not value or not size:
                        continue
                    end = st.index(b"\0", nm)      # st[nm:] 전체 복사 금지 (수십 초 병목)
                    syms.add((st[nm:end].decode("utf-8", "replace"),
                              value, size, info & 0xF))
            self._syms = sorted(syms, key=lambda t: t[1])
        return self._syms

    def find_sym(self, *subs):
        for name, value, size, typ in self.symbols():
            if all(x in name for x in subs):
                return name, value, size
        return None

    def func_containing(self, va):
        """va 를 포함하는 가장 안쪽(시작주소 최대) FUNC 심볼 → (name, value, size)."""
        if self._funcs is None:
            self._funcs = sorted((v, s, n) for n, v, s, t in self.symbols() if t == 2 and s)
            self._func_vas = [f[0] for f in self._funcs]
        i = bisect.bisect_right(self._func_vas, va) - 1
        while i >= 0 and self._funcs[i][0] > va - 0x200000:
            v, s, n = self._funcs[i]
            if v <= va < v + s:
                return n, v, s        # 내림차순 순회라 첫 적중이 innermost
            i -= 1
        return None

    def rip_refs(self, lo_va: int, hi_va: int) -> set:
        """[lo,hi) 코드의 RIP-상대 참조(+movabs imm64) 타깃 VA 집합.
        modrm(mod=00,rm=101) 앵커 — 명령 끝은 항상 modrm+disp32 = +5바이트."""
        out = set()
        d = self.data
        off0 = self.va2off(lo_va)
        off1 = off0 + (hi_va - lo_va)
        for off in range(max(off0, 2), off1 - 5):
            b = d[off]
            if (b & 0xC7) == 0x05:  # modrm: [rip+disp32]
                p1, p2 = d[off - 1], d[off - 2]
                if (p1 in (0x8D, 0x8B, 0x89) or                      # lea/mov
                        (p1 & 0xF0) == 0x40 and p2 in (0x8D, 0x8B, 0x89) or  # REX.W
                        p1 == 0x0F or p2 == 0x0F):                   # SSE/2-byte opc
                    disp = struct.unpack_from("<i", d, off + 1)[0]
                    out.add(lo_va + (off - off0) + 5 + disp)
            elif b in (0x48, 0x49) and 0xB8 <= d[off + 1] <= 0xBF:   # movabs r64, imm64
                out.add(struct.unpack_from("<Q", d, off + 2)[0])
        return out

    def rela_targets(self):
        """[(got_slot_va, target_va)] — R_X86_64_RELATIVE addend."""
        out = []
        for s in self.sections:
            if s["type"] != SHT_RELA or not s["entsize"]:
                continue
            for i in range(s["size"] // s["entsize"]):
                r_off, r_info, r_add = struct.unpack_from(
                    "<QQq", self.data, s["offset"] + i * s["entsize"])
                if r_info & 0xFFFFFFFF == 8:
                    out.append((r_off, r_add))
        return out


# ==================== 체인 자동 발견 ====================
# OnceCell 초기화 클로저의 특징적 형태 (0x8d1690 / 0x8d1780에서 확인):
#   lea  rsi, [rip+X]        ; .rodata 상수
#   lea  rdi, [rsp+..]       ; 스택 버퍼 (rip-상대 아님)
#   mov  edx, LEN            ; 0x2c=44(공개키 b64) / 0x18=24(nonce) / 0x20=32(key)
#   call *GOT                ; base64::decode / memcpy 계열
# 이 "rip-lea + 길이 즉시값" 패턴을 .text 전체에서 스캔하고,
# nonce(24)와 key(32)가 같은 함수에 공존하는 곳 = SECRET_BOX_KEY 초기화로 식별.
MOV_EDX_LEN = re.compile(b"\xba(\x18|\x20|\x2c)\x00\x00\x00")
LEN_IMM = {0x18: 24, 0x20: 32, 0x2C: 44}


def const_copies(elf: ELF):
    """[(insn_va, target_va, length)] — rip-lea 로 .rodata 를 길이와 함께 복사하는 지점."""
    text = elf.sec(".text")
    d = elf.data
    out = []
    for m in MOV_EDX_LEN.finditer(d, text["offset"], text["offset"] + text["size"] - 5):
        # 직전 ~26바이트 안에서 가장 가까운 REX.W rip-상대 lea 의 타깃 계산
        for p in range(m.start() - 2, max(m.start() - 28, text["offset"] + 1), -1):
            if d[p] == 0x8D and (d[p - 1] & 0xF0) == 0x40 and (d[p + 1] & 0xC7) == 0x05:
                disp = struct.unpack_from("<i", d, p + 2)[0]
                insn_va = text["addr"] + (p - text["offset"])
                out.append((insn_va, insn_va + 6 + disp, LEN_IMM[m.group(1)[0]]))
                break
    return out


def analyze(elf: ELF):
    """심볼 + 패턴 스캔으로 검증 체인 상수를 자동 복원. 실패 항목은 None -> 상수 폴백."""
    res = {"elf": elf, "notes": []}

    # 1) 심볼 앵커 (P3 대상은 심볼 주소를 그대로 신뢰)
    for key, subs in {
        "pub_static": ("hbbs3lic10PUBLIC_KEY",),
        "sb_static": ("hbbs3lic14SECRET_BOX_KEY",),
        "machine_same": ("hbbs_utils", "license7Machine4same"),
        "read_file": ("hbbs3lic", "LicenseCheckConfig", "read_file"),
    }.items():
        res[key] = elf.find_sym(*subs)
        if res[key] is None:
            res["notes"].append(f"심볼 미발견: {key} {subs}")
    if res["machine_same"] and res["machine_same"][1] != MACHINE_SAME:
        res["notes"].append(f"Machine::same 심볼 {res['machine_same'][1]:#x} != "
                            f"상수 {MACHINE_SAME:#x} — 심볼 우선 채택")

    # 2) SECRET_BOX_KEY 초기화: 비-ASCII 24B(nonce)와 32B(key) 복사가 같은 함수에 공존.
    #    (문자열 리터럴을 24/32 바이트로 복사하는 fmt::Debug 등은 ASCII 로 걸러짐)
    def binary_blob(va, n):
        b = elf.read(va, n)
        return b if b and any(c < 32 or c > 126 for c in b) else None

    res["nonce_off"] = res["key_off"] = res["sb_init"] = None
    by_func = {}
    for insn_va, target, ln in const_copies(elf):
        ro = elf.sec_of(target)
        if ro != ".rodata" or not binary_blob(target, ln):
            continue
        f = elf.func_containing(insn_va)
        if f:
            by_func.setdefault(f[1], []).append((target, ln))
    for fva, copies in by_func.items():
        n24 = {t for t, ln in copies if ln == 24}
        n32 = {t for t, ln in copies if ln == 32}
        if len(n24) == 1 and len(n32) == 1:
            if res["sb_init"]:
                res["notes"].append("SECRET_BOX_KEY 초기화 후보 복수 — 상수 사용")
                res["nonce_off"] = res["key_off"] = res["sb_init"] = None
                break
            res["nonce_off"], res["key_off"] = n24.pop(), n32.pop()
            res["sb_init"] = fva

    # 3) PUBLIC_KEY 초기화: 44B 복사 중 b64 가 ed25519 공개키(32B)로 디코딩되는 것.
    #    후보가 복수면 nonce 바로 앞(pubkey 문자열 끝 = nonce 시작)으로 판정.
    res["pubkey_off"] = None
    pub_cands = {t for _i, t, ln in const_copies(elf) if ln == 44
                 and (lambda b: b and B64_44.match(b)
                      and len(base64.b64decode(b)) == 32)(elf.read(t, 44))}
    if res["nonce_off"]:
        pub_cands = {t for t in pub_cands if t + 44 == res["nonce_off"]} or pub_cands
    if len(pub_cands) == 1:
        res["pubkey_off"] = pub_cands.pop()
    elif pub_cands:
        res["notes"].append(f"공개키 후보 복수: {[hex(c) for c in pub_cands]}")

    # 4) 발견값이 1.8.5 상수와 일치하는지 교차검증 (다른 빌드면 경고 후 상수 사용)
    if res["pubkey_off"] and res["pubkey_off"] != PUBKEY_STR_OFF:
        res["notes"].append(f"발견 공개키 오프셋 {res['pubkey_off']:#x} != 상수 "
                            f"{PUBKEY_STR_OFF:#x} — 상수 사용")
        res["pubkey_off"] = None
    if res["key_off"] and elf.read(res["key_off"], 32) != SB_KEY:
        res["notes"].append("발견 secretbox key가 상수와 불일치 — 상수 사용")
        res["key_off"] = res["nonce_off"] = None
    elif res["nonce_off"] and elf.read(res["nonce_off"], 24) != SB_NONCE:
        res["notes"].append("발견 nonce가 상수와 불일치 — 상수 사용")
        res["nonce_off"] = None
    return res


def chain_view(res):
    """analyze 결과를 패치/위조에 쓰는 최종 주소·키로 정리."""
    elf = res["elf"]
    machine_va = res["machine_same"][1] if res["machine_same"] else MACHINE_SAME
    pub_off = res["pubkey_off"] or PUBKEY_STR_OFF
    return {
        "pub_off": pub_off,
        "pub_b64": elf.read(pub_off, 44),
        "je_off": LICENSE_JE_OFF,
        "machine_va": machine_va,
        "sb_key": SB_KEY, "sb_nonce": SB_NONCE,
    }


# ==================== 하위 명령 ====================
def cmd_inspect(args):
    data = open(args.binary, "rb").read()
    elf = ELF(data)
    res = analyze(elf)
    print(f"[*] {args.binary}: {len(data):,} bytes, 섹션 {len(elf.sections)}개")
    for sname in (".text", ".rodata", ".data"):
        s = elf.sec(sname)
        if s:
            print(f"    {sname:8} va={s['addr']:#x} size={s['size']:#x} "
                  f"(VA-파일오프셋 차이 {s['addr'] - s['offset']:#x})")
    labels = [("pub_static", "hbbs::lic::PUBLIC_KEY (OnceCell)"),
              ("sb_static", "hbbs::lic::SECRET_BOX_KEY (OnceCell)"),
              ("machine_same", "Machine::same"),
              ("read_file", "LicenseCheckConfig::read_file")]
    print("[*] 체인 심볼 (symtab):")
    for key, label in labels:
        if res[key]:
            name, value, size = res[key]
            print(f"    {label:36} {value:#010x} size={size:<6} {name[:60]}")
    if res["pubkey_off"]:
        blob = elf.read(res["pubkey_off"], 44)
        print(f"[*] 공개키 b64 @ {res['pubkey_off']:#x}: {blob.decode()}")
    if res["sb_init"]:
        print(f"[*] SECRET_BOX_KEY 초기화 클로저 @ {res['sb_init']:#x} "
              f"({elf.func_containing(res['sb_init'])[0][:70]})")
    if res["nonce_off"]:
        print(f"[*] secretbox nonce @ {res['nonce_off']:#x}: "
              f"{elf.read(res['nonce_off'], 24).hex()}")
    if res["key_off"]:
        print(f"[*] secretbox key   @ {res['key_off']:#x}: "
              f"{elf.read(res['key_off'], 32).hex()}")
    # GOT 간접호출 데모: 체인 핵심 함수들의 GOT 슬롯 복원
    got = dict(elf.rela_targets())
    print("[*] GOT 간접호출 해석 (R_X86_64_RELATIVE):")
    for label, key in [("read_file", "read_file")]:
        if res[key]:
            slot = [g for g, t in got.items() if t == res[key][1]]
            if slot:
                print(f"    callq *{slot[0]:#x} -> {res[key][1]:#x} ({label})")
    ver = elf.find_sym("sodiumoxide", "verify") or elf.find_sym("ed25519", "verify")
    if ver:
        slot = [g for g, t in got.items() if t == ver[1]]
        if slot:
            print(f"    callq *{slot[0]:#x} -> {ver[1]:#x} ({ver[0].split('17h')[0][:40]}…verify)")
    # 패치 지점 현재 상태
    print("[*] 패치 지점 원본 바이트:")
    for off, n, label in [(PUBKEY_STR_OFF, 8, "P1 공개키"),
                          (LICENSE_JE_OFF, 2, "P2 je"),
                          (MACHINE_SAME, 4, "P3 Machine::same")]:
        print(f"    {label:14} {off:#x}: {data[off:off + n].hex()}")
    for note in res["notes"]:
        print(f"[!] {note}")


def patch_binary(src, dst, signing_key, res):
    data = bytearray(open(src, "rb").read())
    cv = chain_view(res)
    # P1: pubkey swap — 발견/상신된 오프셋의 현재 값이 원본 공개키인지 확인
    old = bytes(data[cv["pub_off"]:cv["pub_off"] + 44])
    if old != ORIG_PUBKEY_B64:
        sys.exit(f"[-] pubkey string mismatch at {cv['pub_off']:#x}: {old!r}")
    new_b64 = base64.b64encode(bytes(signing_key.verify_key))
    assert len(new_b64) == 44
    data[cv["pub_off"]:cv["pub_off"] + 44] = new_b64
    # P2: license 문자열 비교 우회 (je -> jmp)
    je = cv["je_off"]
    if bytes(data[je:je + 2]) != b"\x74\x3d":
        sys.exit(f"[-] P2 바이트 불일치 @ {je:#x}: {bytes(data[je:je + 2]).hex()} (버전 다름?)")
    data[je:je + 2] = b"\xeb\x3d"
    # P3: Machine::same -> true (심볼 주소 우선)
    ms = cv["machine_va"]
    if bytes(data[ms:ms + 4]) != b"\x48\x8b\x57\x10":
        sys.exit(f"[-] P3 바이트 불일치 @ {ms:#x}: {bytes(data[ms:ms + 4]).hex()} (버전 다름?)")
    data[ms:ms + 3] = b"\xb0\x01\xc3"
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, "wb").write(bytes(data))
    os.chmod(dst, 0o755)
    print(f"[+] patched {dst}: pubkey swap({cv['pub_off']:#x}) + "
          f"license jmp({je:#x}) + Machine::same=true({ms:#x}) — 49 bytes changed")


def forge(signing_key, cv):
    payload = {
        "type": 0,                       # u16, 10001..10005 는 온라인 오류코드
        "expiry": 2000000000,            # int (i64 epoch, 2033-05-18)
        "next_check_time": 1999999999,
        "nonce": "",
        "machine": {"uid": "", "mac": ""},   # P3 덕에 값 무관
        "max_peers": 10000, "max_users": 10000, "max_conns": 10000,
    }
    msg = json.dumps(payload, separators=(",", ":")).encode()
    payload_b64 = base64.b64encode(bytes(signing_key.sign(msg))).decode()
    cfg = {"license": "",                      # P2 덕에 env license 와 비교 안 함
           "license_response_payload": payload_b64,
           "network_failure_count": 0}
    pt = json.dumps(cfg, separators=(",", ":")).encode()
    em = SecretBox(cv["sb_key"]).encrypt(pt, cv["sb_nonce"])   # nonce(24) || ct
    return bytes(em)[24:]                          # sodiumoxide 포맷: raw ct


def verify_blob(blob: bytes, cv, pubkey_b64=None) -> dict:
    """.license_check 파일을 서버와 동일한 절차로 복호화·검증 (라운드트립 자가검증)."""
    pt = SecretBox(cv["sb_key"]).decrypt(blob, cv["sb_nonce"])   # CryptoError 시 실패
    cfg = json.loads(pt)
    signed = base64.b64decode(cfg["license_response_payload"])
    pk = pubkey_b64 if pubkey_b64 is not None else cv["pub_b64"]
    msg = VerifyKey(base64.b64decode(pk)).verify(signed)   # BadSignatureError(CryptoError 서브클래스)
    return {"config": cfg, "payload": json.loads(msg)}


def cmd_crack(args):
    data = open(args.binary, "rb").read()
    res = analyze(ELF(data))
    for note in res["notes"]:
        print(f"[!] {note}")

    if args.keyfile and os.path.exists(args.keyfile):
        sk = SigningKey(bytes.fromhex(open(args.keyfile).read().strip()))
    else:
        sk = SigningKey.generate()
        if args.keyfile:
            os.makedirs(os.path.dirname(args.keyfile) or ".", exist_ok=True)
            open(args.keyfile, "w").write(bytes(sk).hex())
    print(f"[*] attacker ed25519 pubkey: {base64.b64encode(bytes(sk.verify_key)).decode()}")

    cv = chain_view(res)
    patch_binary(args.binary, os.path.join(args.out_dir, "hbbs"), sk, res)
    ct = forge(sk, cv)
    # 자가검증: 위조 파일을 서버 절차 그대로 open+verify+parse (우리 키로)
    v = verify_blob(ct, cv, base64.b64encode(bytes(sk.verify_key)))
    assert v["payload"]["expiry"] == 2000000000
    print(f"[+] forged .license_check round-trip OK (secretbox open + ed25519 verify + json)")
    lic_path = os.path.join(args.out_dir, ".license_check")
    open(lic_path, "wb").write(ct)
    print(f"[+] forged {lic_path} ({len(ct)} bytes)")
    print(f"[!] install: mkdir -p ~/.config/rustdesk && cp {lic_path} ~/.config/rustdesk/")
    print(f"[!] verify:  python3 {__file__} check {lic_path}")


def cmd_check(args):
    """지정 바이너리의 내장 공개키/키로 .license_check 를 검증 — '이 바이너리가 이
    파일을 수용하는가' 판정 (원본이면 서명 거부, 패치본이면 통과해야 정상)."""
    data = open(args.binary, "rb").read()
    res = analyze(ELF(data))
    cv = chain_view(res)
    blob = open(args.file, "rb").read()
    print(f"[*] {args.file} ({len(blob)} bytes) × {args.binary}")
    print(f"    검증 공개키(바이너리 내장): {cv['pub_b64'].decode()}")
    try:
        pt = SecretBox(cv["sb_key"]).decrypt(blob, cv["sb_nonce"])
    except CryptoError:
        sys.exit("[-] secretbox 복호화 실패 — 봉인 키 불일치 (다른 빌드의 파일?)")
    cfg = json.loads(pt)
    signed = base64.b64decode(cfg["license_response_payload"])
    try:
        msg = VerifyKey(base64.b64decode(cv["pub_b64"])).verify(signed)
    except BadSignatureError:
        sys.exit("[-] ed25519 서명 불일치 — 이 바이너리는 이 파일을 거부함 "
                 "(패치본이라면 --binary cracked/hbbs 로 재확인)")
    payload = json.loads(msg)
    print("[+] secretbox open + ed25519 verify + JSON 파싱 통과 — 이 바이너리는 이 파일을 수용")
    print(f"    license={cfg['license']!r}  "
          f"network_failure_count={cfg['network_failure_count']}")
    for k in ("type", "expiry", "next_check_time", "max_peers", "max_users", "max_conns"):
        print(f"    {k}={payload[k]}")
    print(f"    machine={payload['machine']}")


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--binary", default="amd64/hbbs")
    ap.add_argument("--out-dir", default="cracked")
    ap.add_argument("--keyfile", default=None, help="ed25519 seed hex (재사용시)")
    sub = ap.add_subparsers(dest="cmd")
    kp = sub.add_parser("crack", help="패치+위조 실행 (기본)")
    kp.add_argument("--binary", default="amd64/hbbs")
    kp.add_argument("--out-dir", default="cracked")
    kp.add_argument("--keyfile", default=None, help="ed25519 seed hex (재사용시)")
    ip = sub.add_parser("inspect", help="체인 자동 분석 결과만 출력")
    ip.add_argument("--binary", default="amd64/hbbs")
    cp = sub.add_parser("check", help=".license_check 파일 복호화·검증")
    cp.add_argument("file")
    cp.add_argument("--binary", default="amd64/hbbs")
    argv = sys.argv[1:]
    if not argv or argv[0] not in ("inspect", "check"):
        argv = ["crack"] + argv
    args = ap.parse_args(argv)
    if args.cmd == "inspect":
        cmd_inspect(args)
    elif args.cmd == "check":
        cmd_check(args)
    else:
        cmd_crack(args)


if __name__ == "__main__":
    main()
