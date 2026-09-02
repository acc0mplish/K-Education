import struct
data=open("/tmp/ghwork/seaf-server","rb").read()
u32=lambda o: struct.unpack_from("<I",data,o)[0]
u64=lambda o: struct.unpack_from("<Q",data,o)[0]
e_shoff=u64(0x28); shentsize=struct.unpack_from("<H",data,0x3a)[0]; shnum=struct.unpack_from("<H",data,0x3c)[0]; shstrndx=struct.unpack_from("<H",data,0x3e)[0]
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
segs=[]
for i in range(shnum):
    o=e_shoff+i*shentsize
    nm_off=u32(o); p=shstr_off+nm_off; nm=data[p:data.index(b"\x00",p)].decode()
    segs.append((u64(o+16), u64(o+24), u64(o+32), nm))
dynsym=None; dynstr=None; relplt=None
for va,offb,size,nm in segs:
    if nm==".dynsym": dynsym=(va,offb,size)
    if nm==".dynstr": dynstr=(va,offb,size)
    if nm==".rela.plt": relplt=(va,offb,size)
def symname(idx):
    so=dynsym[1]+idx*24; no=u32(so); p=dynstr[1]+no; return data[p:data.index(b"\x00",p)].decode()
# list EVP dynsyms
print("=== all EVP_* dynamic symbols ===")
evp=[]
for i in range(dynsym[2]//24):
    nm=symname(i)
    if nm.startswith("EVP"):
        evp.append((i,nm)); 
for i,nm in evp:
    print(f"  idx={i}  {nm}")
# JUMP_SLOT relocs -> map (symidx, got_va)
print("\n=== JUMP_SLOT relocs for EVP symbols ===")
relnum=relplt[2]//24
for i in range(relnum):
    ro=relplt[1]+i*24
    r_offset=u64(ro+8); r_info=u64(ro+16)
    symidx=(r_info>>32)&0xffffffff; typ=r_info&0xffffffff
    if typ==7:
        nm=symname(symidx)
        if nm.startswith("EVP"):
            print(f"  {nm}  .got VA={hex(r_offset)}  slot={(r_offset-dynsym[0])//8}")
