import struct
data=open("seaf-server","rb").read()
u64=lambda o: struct.unpack_from("<Q",data,o)[0]
u32=lambda o: struct.unpack_from("<I",data,o)[0]
u16=lambda o: struct.unpack_from("<H",data,o)[0]
e_shoff=u64(0x28); shentsize=u16(0x3a); shnum=u16(0x3c); shstrndx=u16(0x3e)
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
segs=[]; dynsym=0; dynstr=0; dynsymentsize=0
for i in range(shnum):
    o=e_shoff+i*shentsize
    nm_off=u32(o); p=shstr_off+nm_off; nm=data[p:data.index(b"\x00",p)].decode()
    if nm==".dynsym": dynsym=u64(o+24); dynsymentsize=u16(o+58)
    if nm==".dynstr": dynstr=u64(o+24)
    if nm==".rela.plt": rel=offb=u64(o+24)
def dynname(idx):
    o=dynsym+idx*dynsymentsize
    name_off=u32(o); p=dynstr+name_off
    return data[p:dynstr].split(b"\x00",1)[0].decode()
for k in range(0x3048//24):
    ro=rel+k*24
    r_offset=u32(ro); r_info=u32(ro+8)
    if (r_info&0xff)!=7: continue
    symidx=r_info>>32
    print(dynname(symidx), "symidx", symidx)
