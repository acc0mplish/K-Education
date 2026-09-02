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
# Dump first 12 relocs to verify encoding
print("=== first 12 .rela.plt relocs (verify r_info encoding) ===")
for i in range(12):
    ro=relplt[1]+i*24
    r_offset=u64(ro+8); r_info=u64(ro+16); addend=u64(ro+24)
    typ=r_info&0xffffffff; symidx_hi=(r_info>>32)&0xffffffff
    print(f"  off=0x{ro:x} r_offset=0x{r_offset:x} r_info=0x{r_info:x} symidx_hi={symidx_hi} low32={typ} sym={symname(symidx_hi)[:30]}")
# Now find the JUMP_SLOT reloc for symidx 105 (EVP_aes_128_cbc)
print("\n=== find reloc with symidx_hi==105 ===")
relnum=relplt[2]//24
for i in range(relnum):
    ro=relplt[1]+i*24
    r_offset=u64(ro+8); r_info=u64(ro+16)
    typ=r_info&0xffffffff; symidx=(r_info>>32)&0xffffffff
    if symidx==105:
        print(f"  FOUND symidx=105 type={typ} r_offset(AES .got VA)=0x{r_offset:x}  .got slot={(r_offset-dynsym[0])//8}")
