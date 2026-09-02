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
for tag,fo in [("reload_license",0x11b8bb),("license.c-str",0x149f8c),("seafile-license.txt",0x149fbc),("hash2-msg",0x149e38)]:
    v=va_of(fo)
    print(f"{tag}: fileoff 0x{fo:x} -> VA {hex(v[0]) if v else '?'} in {v[1] if v else '?'}")
# find rip-loaders of the strings -> the license functions
def rip_loaders(target):
    hits=[]
    for va_b,off_b,sz,nm in segs:
        if nm in ('.rodata','.text'):
            base=va_b; fb=off_b
            for va in range(base,base+sz-8,1):
                f=fb+(va-base)
                if data[f]==0x48 and data[f+1]==0x8d:
                    disp=struct.unpack_from("<i",data,f+4)[0]; t=va_of(f)
                    if t and t[0]==target: hits.append(va)
    return hits
for tag,fo in [("license.c-str",0x149f8c),("seafile-license.txt",0x149fbc),("hash2-msg",0x149e38)]:
    h=rip_loaders(fo)
    print(f"  {tag} rip-loaders VA: {[hex(x) for x in h]}")
