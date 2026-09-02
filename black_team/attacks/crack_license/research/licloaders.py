import struct
data=open("seaf-server","rb").read()
u64=lambda o: struct.unpack_from("<Q",data,o)[0]; u16=lambda o: struct.unpack_from("<H",data,o)[0]; u32=lambda o: struct.unpack_from("<I",data,o)[0]
e_shoff=u64(0x28); shentsize=u16(0x3a); shnum=u16(0x3c); shstrndx=u16(0x3e)
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
segs=[]
for i in range(shnum):
    o=e_shoff+i*shentsize
    nm_off=u32(o); p=shstr_off+nm_off; nm=data[p:data.index(b"\x00",p)].decode()
    segs.append((u64(o+16),u64(o+24),u64(o+32),nm))
def va_of(off):
    for va_b,off_b,sz,nm in segs:
        if off_b<=off<off_b+sz and va_b!=0: return va_b+(off-off_b),nm
    return None
def rip_loaders(target):
    hits=[]
    for va_b,off_b,sz,nm in segs:
        if nm in ('.rodata','.text'):
            base=va_b; fb=off_b
            for va in range(base,base+sz-8,1):
                f=fb+(va-base)
                if data[f]==0x48 and data[f+1]==0x8d:
                    disp=struct.unpack_from("<i",data,f+4)[0]
                    tgt=va_of(f)[0]+4+disp
                    if tgt==target: hits.append(va)
    return hits
for tag,fo in [("seafile-license.txt",0x149fbc),("license.c",0x149f8c),("hash2",0x149e38)]:
    t=va_of(fo)[0]
    h=rip_loaders(t)
    print(f"{tag}: strVA={hex(t)} rip-loaders={[hex(x) for x in h]}")
