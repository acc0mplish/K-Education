import sys, struct
data = open(sys.argv[1],'rb').read()
E=[]
def U1(o): return struct.unpack_from("<H",data,o)[0]
def U4(o): return struct.unpack_from("<I",data,o)[0]
def U8(o): return struct.unpack_from("<Q",data,o)[0]
e_shoff=U8(0x28); e_shnum=U1(0x3c); e_shstrndx=U1(0x3e)
SHN_X=0xffff
if e_shnum==SHN_X:
    e_shnum=U8(e_shoff+40)
    if e_shstrndx==SHN_X: e_shstrndx=U4(e_shoff+32)
def sec(i):
    o=e_shoff+i*64
    return {"name":U4(o),"type":U4(o+4),"flags":U8(o+8),"addr":U8(o+16),
            "off":U8(o+24),"size":U8(o+32),"link":U4(o+40),"info":U4(o+44),
            "align":U8(o+48),"entsize":U8(o+56)}
def sname(i):
    base=sec(e_shstrndx)["off"]; p=base+sec(i)["name"]
    end=data.find(b"\x00",p); return data[p:end].decode("latin-1")
secnames=[sname(i) for i in range(e_shnum)]
def find(n):
    for i,nm in enumerate(secnames):
        if nm==n: return i
    return -1
dynsym=find(".dynsym"); dynstr=find(".dynstr"); rela_plt=find(".rela.plt")
print("dynsym@%d dynstr@%d rela.plt@%d"%(dynsym,dynstr,rela_plt))
entsize=sec(dynsym)["entsize"] or 24
strtab_off=sec(dynstr)["off"]
def str_at(off):
    p=strtab_off+off; end=data.find(b"\x00",p)
    return data[p:end].decode("latin-1")
nsym=sec(dynsym)["size"]//entsize
print("dynsym count:",nsym)
target=None
for si in range(nsym):
    st_name,st_info,oth,shndx,st_value,st_size=struct.unpack_from("<IBBHQQ",data,sec(dynsym)["off"]+si*entsize)
    nm=str_at(st_name)
    if nm in ("EVP_aes_128_cbc","EVP_DecryptInit_ex"):
        print(f"  {nm}: symidx={si} value={hex(st_value)} size={st_size}")
        if nm=="EVP_aes_128_cbc": target=si
print("EVP_aes_128_cbc symidx:",target)
PLT=None
if rela_plt>=0:
    re=sec(rela_plt)["entsize"] or 24
    nrela=sec(rela_plt)["size"]//re
    print("rela.plt count:",nrela)
    for ri in range(nrela):
        base=sec(rela_plt)["off"]+ri*re
        r_offset=U8(base); r_info=U8(base+8); addend=struct.unpack_from("<q",data,base+16)[0]
        if (r_info & 0xffffffff)==target:
            print(f"  >>> PLT slot for EVP_aes_128_cbc: addr={hex(r_offset)} addend={addend}")
            PLT=r_offset; break
open('/tmp/ghwork/plt_target.txt','w').write(hex(PLT) if PLT is not None else "NONE")
print("PLT_TARGET=", PLT)
