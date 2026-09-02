import sys, struct
data = open(sys.argv[1],'rb').read()
def U1(o): return struct.unpack_from("<H",data,o)[0]
def U4(o): return struct.unpack_from("<I",data,o)[0]
def U8(o): return struct.unpack_from("<Q",data,o)[0]
e_shoff=U8(0x28); e_shnum=U1(0x3c); e_shstrndx=U1(0x3e)
def sec(i):
    o=e_shoff+i*64
    return {"name":U4(o),"off":U8(o+24),"size":U8(o+32),"entsize":U8(o+56)}
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
def symidx_for(name):
    for si in range(nsym):
        if str_at(struct.unpack_from("<I",data,sec(dynsym)["off"]+si*entsize)[0])==name:
            return si
    return -1
def plt_slot(idx):
    for i in range(e_shnum):
        nm=secnames[i]
        if nm not in (".rela.plt",".rela.dyn"): continue
        re=sec(i)["entsize"] or 24; nre=sec(i)["size"]//re
        for ri in range(nre):
            base=sec(i)["off"]+ri*re
            if ((U8(base+8)>>32)&0xffffffff)==idx:
                return U8(base)
    return None
for nm in ["EVP_aes_128_cbc","EVP_DecryptInit_ex","EVP_DecryptUpdate","EVP_DecryptFinal_ex","EVP_EncryptInit_ex","EVP_AES_256_CBC"]:
    idx=symidx_for(nm)
    slot=plt_slot(idx)
    print(f"{nm}: idx={idx} PLT_slot={hex(slot) if slot else None}")
