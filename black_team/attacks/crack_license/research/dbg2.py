import struct
data=open("seaf-server","rb").read()
u64=lambda o: struct.unpack_from("<Q",data,o)[0]
u32=lambda o: struct.unpack_from("<I",data,o)[0]
u16=lambda o: struct.unpack_from("<H",data,o)[0]
e_shoff=u64(0x28); shentsize=u16(0x3a); shnum=u16(0x3c); shstrndx=u16(0x3e)
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
segs=[]; dynsym=0; dynstr=0; dynsymsz=0
for i in range(shnum):
    o=e_shoff+i*shentsize
    nm_off=u32(o); p=shstr_off+nm_off; nm=data[p:data.index(b"\x00",p)].decode()
    if nm==".dynsym": dynsym=u64(o+24); dynsymsz=u64(o+56); dynsz=u64(o+32)
    if nm==".dynstr": dynstr=u64(o+24)
    segs.append((u64(o+16),u64(o+24),u64(o+32),nm))
print("dynsym", hex(dynsym), "dynstr", hex(dynstr), "dynsymsz", dynsymsz, "dynsz", dynsz)
def dynname(idx):
    o=dynsym+idx*dynsymsz
    name_off=u32(o); p=dynstr+name_off
    return data[p:dynstr].split(b"\x00",1)[0].decode()
for i in (105,60,140,164,112,113,114,115):
    print(i, "->", repr(dynname(i)))
