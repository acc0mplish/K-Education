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
        if nm==n: return {"off":u64(o+24),"size":u64(o+32),"va":u64(o+16)}
    return None
dr=sec(".data.rel.ro")
print(f".data.rel.ro VA=0x{dr['va']:x} off=0x{dr['off']:x} size=0x{dr['size']:x}")
LOOK={0x612a0,0x60330,0xea5a0,0xea790,0xcfde0,0xf740,0x10940,0x63d10,0x64290,0xee5e0,0xf0a0,0xeb170,0xeadf0}
# find rows containing targets
for base_off in [dr["off"]]:
    k=0
    while base_off+k*8 < dr["off"]+dr["size"]:
        e=base_off+k*8
        vals=[struct.unpack_from("<Q",data,e+j*8)[0] for j in range(min(8,(dr['size']-k*8)//8))]
        hit=[v for v in vals if v in LOOK]
        if hit:
            print(f"\n  TABLE row {k} at off=0x{e:x} VA=0x{dr['va']+(e-dr['off']):x}:")
            for j,v in enumerate(vals):
                tag=" <==TARGET" if v in LOOK else ""
                if v in LOOK or j<3: print(f"     [{j}] 0x{v:x}{tag}")
        k+=1
