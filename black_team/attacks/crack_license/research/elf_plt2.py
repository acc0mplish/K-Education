import struct
data=open("/tmp/ghwork/seaf-server","rb").read()
def u32(o): return struct.unpack_from("<I",data,o)[0]
def i32(o): return struct.unpack_from("<i",data,o)[0]
def u64(o): return struct.unpack_from("<Q",data,o)[0]
e_shoff=u64(0x28); shentsize=struct.unpack_from("<H",data,0x3a)[0]; shnum=struct.unpack_from("<H",data,0x3c)[0]; shstrndx=struct.unpack_from("<H",data,0x3e)[0]
secs=[]
for i in range(shnum):
    o=e_shoff+i*shentsize
    secs.append(dict(name=u32(o),type=u32(o+4),addr=u64(o+16),off=u64(o+24),size=u64(o+32),link=u32(o+40),entsize=u64(o+56)))
shstr=secs[shstrndx]
def nm(s):
    p=shstr["off"]+s["name"]; return data[p:data.index(b"\x00",p)].decode()
def sect(n):
    for s in secs:
        if nm(s)==n: return s
    return None

plt=sect(".plt.sec"); gotplt=sect(".got"); dynsym=sect(".dynsym"); dynstr=sect(".dynstr")
relplt=sect(".rela.plt")
print(f".plt.sec base=0x{plt['addr']:x} entsize={plt['entsize']}")
print(f".got.plt base=0x{gotplt['addr']:x} entsize={gotplt['entsize']}")
print(f".rela.plt base=0x{relplt['addr']:x} entsize={relplt['entsize']}")

def dynname(idx):
    so=dynsym["off"]+idx*24
    nameoff=u32(so)
    p=dynstr["off"]+nameoff
    return data[p:data.index(b"\x00",p)].decode()

# For each JUMP_SLOT reloc, get got offset (r_offset) -> symbol name
# The .plt.sec stub for dynsym n is at .plt.sec_base + (n + 1)*16   (standard after the reserved slot)
# We'll map stub addr <-> sym name via the .plt.sec jmp target.
# Build sym->got_offset map:
symidx_by_got={}
relsz=relplt["entsize"]
for i in range(relplt["size"]//relsz):
    ro=relplt["off"]+i*relsz
    r_offset=u64(ro+8); r_info=u64(ro+16); addend=u64(ro+24)
    symidx=(r_info>>32)&0xffffffff
    typ=r_info&0xffffffff
    if typ==7:  # R_X86_64_JUMP_SLOT
        # the .plt.sec stub jmps to a .got.plt slot; the slot index relates to symidx
        symidx_by_got[symidx]=r_offset

print("\n=== AES / decrypt-related dynsym and their stub addr (computed) ===")
targets=["EVP_aes_128_cbc","EVP_DecryptInit_ex","EVP_DecryptUpdate","EVP_DecryptFinal_ex","EVP_EncryptInit_ex","EVP_DecryptEx"]
for sname in targets:
    idx=None
    for i in range(dynsym["size"]//24):
        if dynname(i)==sname: idx=i; break
    if idx is None: 
        # try prefix match
        for i in range(dynsym["size"]//24):
            if dynname(i).startswith(sname): idx=i; break
    if idx is None: continue
    got_off = symidx_by_got.get(idx,"?")
    # stub addr guess: .plt.sec_base + (idx+1)*16
    stub_guess = plt["addr"] + (idx+1)*16
    print(f"  {sname:<26} dynsym_idx={idx:<4} got_offset=0x{got_off if isinstance(got_off,int) else got_off:<8x} stub_guess=0x{stub_guess:x}")

# Now find the stub for AES by walking .plt.sec jmp rels and matching .got.plt slot
print("\n=== verify AES stub via .plt.sec jmp target ===")
aesidx=None
for i in range(dynsym["size"]//24):
    if dynname(i)=="EVP_aes_128_cbc": aesidx=i; break
if aesidx is None:
    for i in range(dynsym["size"]//24):
        if dynname(i).startswith("EVP_aes"): aesidx=i; break
print("AES dynsym idx =",aesidx, "name =", dynname(aesidx) if aesidx is not None else "?")
if aesidx is not None:
    aesgotoff = symidx_by_got.get(aesidx)
    aesgotf = got["off"] + (aesgotoff - gotplt["addr"])
    print(f"AES got slot file offset = 0x{aesgotf:x} (val={hex(u64(aesgotf))})")
    # find the .plt.sec stub whose jmp lands on this got slot
    pltf=plt["off"]
    stub=None
    off=pltf
    # walk stubs, compute jmp target
    def find_stub_for_got(gotf):
        n=plt["size"]//plt["entsize"]
        for k in range(3, n):
            s=pltf+k*plt["entsize"]
            b=data[s+2:s+6]
            rel=struct.unpack_from("<i",data,s+2)[0]
            # jmp *rel(rip): rip after insn = s+6
            gotaddr = s+6+rel
            gotfoff = gotaddr - gotplt["addr"] + got["off"]
            if gotfoff==gotf:
                return k, s
        return None
    r=find_stub_for_got(aesgotf)
    if r:
        k,s=r
        print(f"FOUND AES .plt.sec stub: index={k} addr=0x{plt['addr']+k*plt['entsize']:x} fileoff=0x{s:x}")
    else:
        print("could not locate stub by jmp match (layout differs)")
