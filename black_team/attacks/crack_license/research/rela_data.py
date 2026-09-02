import struct
data=open("seaf-server","rb").read()
u16=lambda o:struct.unpack_from("<H",data,o)[0]
u32=lambda o:struct.unpack_from("<I",data,o)[0]
u64=lambda o:struct.unpack_from("<Q",data,o)[0]
e_shoff=u64(0x28); shentsize=u16(0x3a); shnum=u16(0x3c); shstrndx=u16(0x3e)
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
secs=[]
for i in range(shnum):
    o=e_shoff+i*shentsize
    nm_off=u32(o); p=shstr_off+nm_off
    nm=data[p:data.index(b"\x00",p)].decode()
    secs.append({"name":nm,"va":u64(o+16),"off":u64(o+24),"size":u64(o+32),"entsize":u64(o+56),"type":u32(o+4)})
def sec(n): return next(s for s in secs if s["name"]==n)
def va_of_off(f):
    for s in secs:
        if s["off"]<=f<s["off"]+s["size"]:
            return s["va"]+(f-s["off"])
    return None
# dump RELATIVE relocations
for rname in [".rela.data",".rela.rel.ro",".rela.dyncfg"]:
    r=sec(rname) if rname in [s["name"] for s in secs] else None
    if not r: continue
    print(f"\n=== {rname} ({r['size']//r['entsize']} relocs) ===")
    cnt=0
    for k in range(r["size"]//r["entsize"]):
        rr=r["off"]+k*r["entsize"]
        off=u64(rr); info=u64(rr+8); sym=(info>>32)&0xffffffff; typ=info&0xffffffff; addend=u64(rr+16)
        if typ==8:  # R_X86_64_RELATIVE
            val=struct.unpack_from("<Q",data,off)[0]
            va=va_of_off(off)
            print(f"   relat off=0x{off:x} VA=0x{hex(va) if va else 'NA'}  base_val=0x{val:x} addend=0x{addend:x}")
            cnt+=1
    if cnt==0: print("   (no RELATIVE relocs)")
