import struct
data=open("/tmp/ghwork/seaf-server","rb").read()
u32=lambda o: struct.unpack_from("<I",data,o)[0]
u64=lambda o: struct.unpack_from("<Q",data,o)[0]
e_shoff=u64(0x28); shentsize=struct.unpack_from("<H",data,0x3a)[0]; shnum=struct.unpack_from("<H",data,0x3c)[0]; shstrndx=struct.unpack_from("<H",data,0x3e)[0]
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
segs=[]
for i in range(shnum):
    o=e_shoff+i*shentsize
    nm_off=u32(o)
    p=shstr_off+nm_off; nm=data[p:data.index(b"\x00",p)].decode()
    segs.append((u64(o+16), u64(o+24), u64(o+32), nm))  # va, off, size, name
def va_of(off):
    for va,offb,size,nm in segs:
        if offb<=off<offb+size and va!=0:
            return va+(off-offb), nm
    return None, None
TARGET=0xf3e8
found=[]
for i in range(0, len(data)-9):
    if data[i]==0xE8:
        rel=struct.unpack_from("<i",data,i+1)[0]
        iva,sec = va_of(i)
        if iva is None: continue
        tgt = iva+5+rel
        if tgt==TARGET:
            found.append((i,iva))
print(f"CALL instructions to AES stub VA 0x{TARGET:x}: {len(found)}")
for off,iva in found:
    start=None
    for j in range(off-1, max(0,off-0x600), -1):
        if data[j:j+4]==b"\xf3\x0f\x1e\xfa":
            start=j; break
    fva,_=va_of(start if start is not None else off)
    print(f"  CALL fileoff=0x{off:x} VA=0x{iva:x} -> func_start VA=0x{fva:x}")
