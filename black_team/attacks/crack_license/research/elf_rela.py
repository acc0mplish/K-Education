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
    typ=u32(o+4)
    if typ==4:  # SHT_RELA
        va=u64(o+16); off=u64(o+24); size=u64(o+32)
        print(f"SHT_RELA name={nm!r} VA=0x{va:x} off=0x{off:x} size={size} entsize={u64(o+56)}")
# Now examine the .rela.plt reloc structure at 0x9090 more carefully
print("\n=== raw 32 bytes at .rela.plt fileoff 0x9090 ===")
for j in range(0,32,8):
    print(f"  +0x{j:02x}: " + " ".join(f"{b:02x}" for b in data[0x9090+j:0x9090+j+8]))
# Interpret as Elf64_Rela: r_offset(8) r_info(8) addend(8)
print("\n=== .rela.plt first 4 relocs decoded as Elf64_Rela ===")
for i in range(4):
    ro=0x9090+i*24
    r_offset=u64(ro); r_info=u64(ro+8); addend=u64(ro+16)
    print(f"  #{i}: r_offset=0x{r_offset:x}  r_info=0x{r_info:x}  addend=0x{addend:x}")
    print(f"       type=r_info&0xffffffff={r_info&0xffffffff}  symidx=(r_info>>32)={r_info>>32}")
