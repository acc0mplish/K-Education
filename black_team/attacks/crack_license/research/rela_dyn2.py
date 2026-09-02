import struct
data=open("seaf-server","rb").read()
u16=lambda o:struct.unpack_from("<H",data,o)[0]
u32=lambda o:struct.unpack_from("<I",data,o)[0]
u64=lambda o:struct.unpack_from("<Q",data,o)[0]
e_shoff=u64(0x28); shentsize=u16(0x3a); shnum=u16(0x3c); shstrndx=u16(0x3e)
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
def sec(n):
    for i in range(shnum):
        o=e_shoff+i*shentsize; nm_off=u32(o); p=shstr_off+nm_off
        nm=data[p:data.index(b"\x00",p)].decode()
        if nm==n: return {"off":u64(o+24),"size":u64(o+32),"entsize":u64(o+56),"va":u64(o+16)}
    return None
rd=sec(".rela.dyn")
LOOK={0x612a0,0x60330,0xea5a0,0xea790,0xcfde0,0xf740,0x10940,0xeb170,0xeadf0}
print("RELATIVE relocs filling in-file .data.rel.ro / .data slots:")
for k in range(rd['size']//rd['entsize']):
    r=rd['off']+k*rd['entsize']
    roff=u64(r+0); rinfo=u64(r+8); typ=rinfo&0xffffffff; addend=u64(r+16)
    if typ==8 and roff < len(data):
        secname="?"
        for s in [".data.rel.ro",".data",".bss"]:
            ss=sec(s)
            if ss and ss["off"]<=roff<ss["off"]+ss["size"]:
                secname=s;break
        if secname not in (".data.rel.ro",".data"): continue
        val=struct.unpack_from("<Q",data,roff)[0]
        tag=" <==TARGET" if val in LOOK else ""
        print(f"  roff=0x{roff:x} VA=0x{roff+ (0x1000 if secname=='.data.rel.ro' or secname=='.data' else 0):x} sec={secname} raw={hex(val)}{tag}")
