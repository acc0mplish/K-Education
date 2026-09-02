#!/usr/bin/env python3
"""Map original-ELF .plt slots -> dynamic symbol names by walking .plt stubs."""
import struct, sys

path = "/tmp/ghwork/seaf-server"
data = open(path, "rb").read()

def u32(o): return struct.unpack_from("<I", data, o)[0]
def u64(o): return struct.unpack_from("<Q", data, o)[0]

# ELF header
e_shoff = u64(0x28)
e_shentsize = u16 = struct.unpack_from("<H", data, 0x3a)[0]
e_shnum = struct.unpack_from("<H", data, 0x3c)[0]
e_shstrndx = struct.unpack_from("<H", data, 0x3e)[0]

sections = []
for i in range(e_shnum):
    off = e_shoff + i*e_shentsize
    sh = dict(
        sh_name=u32(off+0), sh_type=u32(off+4), sh_flags=u32(off+8),
        sh_addr=u64(off+16), sh_offset=u64(off+24), sh_size=u64(off+32),
        sh_link=u32(off+40), sh_info=u32(off+44), sh_addal=u64(off+48), sh_entsize=u64(off+56),
    )
    sections.append(sh)

shstr = sections[e_shstrndx]
def shname(sh):
    p = shstr["sh_offset"] + sh["sh_name"]
    return data[p:data.index(b"\x00", p)].decode()

# find .plt (sh_type SHT_PROGBITS, X86) and .symtab (SHT_SYMTAB=2) or .dynsym
plt = None; dynsym = None
for sh in sections:
    n = shname(sh)
    if n == ".plt": plt = sh
    if sh["sh_type"] == 2 and "symtab" in n: symtab = sh
    if sh["sh_type"] == 11:  # SHT_DYNSYM
        dynsym = sh

if not plt:
    print("NO .plt section"); sys.exit()
plt_base = plt["sh_addr"]
print(f"PLT base VA = 0x{plt_base:x}  size={plt['sh_size']}  entries={plt['sh_size']//16}")

# dynsym -> dynstr
dynstr = None
for sh in sections:
    if sh["sh_type"] == 5:  # SHT_STRTAB
        # pick the one near dynsym
        if dynsym and abs(sh["sh_addr"] - dynsym["sh_addr"]) < 0x10000:
            dynstr = sh
if dynstr is None:
    # fallback: first strtab
    for sh in sections:
        if sh["sh_type"] == 5: dynstr = sh; break

def symname(idx):
    e = dynsym["sh_entsize"] or 24
    so = dynsym["sh_offset"] + idx*e
    st_name = u32(so+0)
    p = dynstr["sh_offset"] + st_name
    return data[p:data.index(b"\x00", p)].decode()

# walk PLT stubs (each 16 bytes: jmp *GOT[x] where x = (addr-plt_base)/16 roughly;
# the GOT slot number = (stub_offset/16 - 2) for standard .plt layout).
plt_off = plt["sh_offset"]
slots = []
for i in range(3, plt["sh_size"]//16):
    off = plt_off + i*16
    # jmp *0xXX(rip): bytes FF 25 <rel24>
    b = data[off:off+2]
    if b != b"\xff\x25":
        continue
    rel = struct.unpack_from("<i", data, off+2)[0]
    got = off + 6 + rel
    got_idx = (got - data.index(b"\x00", 0))  # placeholder
    # find which section holds this got address to get file offset
    for sh in sections:
        if sh["sh_addr"] <= got < sh["sh_addr"]+sh["sh_size"] and sh["sh_type"] in (1,6):
            foff = got - sh["sh_addr"] + sh["sh_offset"]
            break
    else:
        continue
    word = u64(foff)  # this is the dynamic symbol index (relocated)
    # In R_X86_64_JUMP_SLOT the addend/got entry holds sym idx in high 32 bits
    # Actually the .got.plt entry for JUMP_SLOT contains the sym index directly.
    # But we read it as the index. Let's interpret: low 32 bits unused, high 32 = sym idx
    if word == 0: continue
    # JUMP_SLOT got entry: the value is the sym index in the upper 32 bits
    symidx = (word >> 32) & 0xffffffff if word > 0xffffffff else word
    nm = symname(symidx)
    va = plt_base + i*16
    slots.append((va, symidx, nm))

# Print EVP-related slots
print("\n=== PLT SLOTS matching EVP / RSA / common crypto ===")
for va, idx, nm in slots:
    if nm and ("EVP" in nm or "RSA" in nm or "AES" in nm):
        print(f"  0x{va:x}  symidx={idx}  {nm}")

# Also report the known target addresses to confirm
for name, addr in [("EVP_aes_128_cbc",0x1c5290),("EVP_DecryptInit_ex",0x1c5e98),
                   ("EVP_DecryptUpdate",0x1c5d30),("EVP_DecryptFinal_ex",0x1c5460),
                   ("EVP_EncryptInit_ex",0x1c5930)]:
    for va, idx, nm in slots:
        if nm and va==addr:
            print(f"CONFIRMED {name} @0x{va:x} -> symidx={idx} nm={nm}")
