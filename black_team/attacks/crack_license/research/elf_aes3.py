import sys, struct
data = open(sys.argv[1],'rb').read()
def U1(o): return struct.unpack_from("<H",data,o)[0]
def U4(o): return struct.unpack_from("<I",data,o)[0]
def U8(o): return struct.unpack_from("<Q",data,o)[0]
e_shoff=U8(0x28); e_shnum=U1(0x3c); e_shstrndx=U1(0x3e)
def sec(i):
    o=e_shoff+i*64
    return {"name":U4(o),"off":U8(o+24),"size":U8(o+32),"entsize":U8(o+56),"addr":U8(o+16)}
def sname(i):
    base=sec(e_shstrndx)["off"]; p=base+sec(i)["name"]
    end=data.find(b"\x00",p); return data[p:end].decode("latin-1")
secnames=[sname(i) for i in range(e_shnum)]
def find(n):
    for i,nm in enumerate(secnames):
        if nm==n: return i
    return -1
dynsym=find(".dynsym"); strtab_off=sec(find(".dynstr"))["off"]
def str_at(off):
    p=strtab_off+off; end=data.find(b"\x00",p); return data[p:end].decode("latin-1")
entsize=sec(dynsym)["entsize"] or 24
nsym=sec(dynsym)["size"]//entsize
target=None
for si in range(nsym):
    name_off=struct.unpack_from("<I",data,sec(dynsym)["off"]+si*entsize)[0]
    if str_at(name_off)=="EVP_aes_128_cbc":
        target=si; break
print("EVP_aes_128_cbc dynsym idx:",target)
# symidx is in HIGH 32 bits of r_info for x86-64 ELF
for i in range(e_shnum):
    nm=secnames[i]
    if nm not in (".rela.plt",".rela.dyn"): continue
    re=sec(i)["entsize"] or 24
    nre=sec(i)["size"]//re
    for ri in range(nre):
        base=sec(i)["off"]+ri*re
        r_info=U8(base+8)
        symidx=(r_info>>32) & 0xffffffff
        if symidx==target:
            r_offset=U8(base); addend=struct.unpack_from("<q",data,base+16)[0]
            secidx=None
            for j in range(e_shnum):
                s=sec(j)
                if s["off"]<=r_offset<s["off"]+s["size"]:
                    secidx=j
            print(f"{nm}: PLT/GOT slot addr={hex(r_offset)} addend={addend} -> in section {secnames[secidx] if secidx is not None else '?'}")
