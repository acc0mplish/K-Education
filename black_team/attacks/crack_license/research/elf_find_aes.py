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
def secname_by_off(off):
    for va,offb,size,nm in segs:
        if offb<=off<offb+size: return nm
    return "?"
# .dynsym and .dynstr
dynsym=None; dynstr=None; relplt=None; pltsec=None
for va,offb,size,nm in segs:
    if nm==".dynsym": dynsym=(va,offb,size)
    if nm==".dynstr": dynstr=(va,offb,size)
    if nm==".rela.plt": relplt=(va,offb,size)
    if nm==".plt.sec": pltsec=(va,offb,size)
def symname(idx):
    so=dynsym[1]+idx*24
    no=u32(so); p=dynstr[1]+no; return data[p:data.index(b"\x00",p)].decode()
# Find EVP_aes_128_cbc dynsym idx
aesidx=None
for i in range(dynsym[2]//24):
    if symname(i).startswith("EVP_aes") or symname(i)=="EVP_aes_128_cbc":
        aesidx=i; break
    if aesidx is None and "aes_128" in symname(i): aesidx=i
print("EVP_aes_128_cbc dynsym idx:", aesidx, "->", (symname(aesidx) if aesidx is not None else "?"))
# Find the JUMP_SLOT reloc for this symidx
relsz=relplt[2]//(24) if False else 24
reloff=relplt[1]
relnum=relplt[2]//24
for i in range(relnum):
    ro=reloff+i*24
    r_offset=u64(ro+8); r_info=u64(ro+16); addend=u64(ro+24)
    symidx=(r_info>>32)&0xffffffff; typ=r_info&0xffffffff
    if typ==7 and symidx==aesidx:  # 7 = R_X86_64_JUMP_SLOT
        aes_got=r_offset
        print(f"AES JUMP_SLOT reloc: r_offset(AES .got VA)={hex(r_offset)}  .got slot={(r_offset-dynsym[0])//8 if False else '?'}")
        print(f"   AES .got VA = 0x{r_offset:x}")
        # which section
        print("   in section:", secname_by_off(r_offset))
        break
