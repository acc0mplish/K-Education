import struct
data=open("seaf-server","rb").read()
u16=lambda o:struct.unpack_from("<H",data,o)[0]
u32=lambda o:struct.unpack_from("<I",data,o)[0]
u64=lambda o:struct.unpack_from("<Q",data,o)[0]
e_shoff=u64(0x28); shentsize=u16(0x3a); shnum=u16(0x3c); shstrndx=u16(0x3e)
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
for i in range(shnum):
    o=e_shoff+i*shentsize
    nm_off=u32(o); p=shstr_off+nm_off
    nm=data[p:data.index(b"\x00",p)].decode()
    typ=u32(o+4)
    if typ==9:  # SHT_RELA
        off=u64(o+24); sz=u64(o+32); en=u64(o+56)
        print(f"  RELA {nm} off=0x{off:x} size=0x{sz:x} entsize=0x{en:x}")
