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
def secname(off):
    for va,offb,size,nm in segs:
        if offb<=off<offb+size: return nm
def va_of(off):
    for va,offb,size,nm in segs:
        if offb<=off<offb+size and va!=0: return va+(off-offb)
    return None
# AES stub VA 0xf740, file offset
stub_off=None
for va,offb,size,nm in segs:
    if nm==".plt.sec": stub_off=offb+(0xf740-va)
rel=struct.unpack_from("<i",data,stub_off+2)[0]
jmp_va=0xf740+11+rel
print(f"AES stub 0xf740 jmps to VA 0x{jmp_va:x}  (section {secname(jmp_va)})")
# .got slot of jmp target
for va,offb,size,nm in segs:
    if nm==".got" and offb<=jmp_va<offb+size:
        slot=(jmp_va-offb)//8
        print(f".got slot {slot}: value=0x{u64(offb+(jmp_va-offb)):x}")
        break
# Confirm by listing a few .plt.sec stub jmp targets and their dynsym to cross-check
