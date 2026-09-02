import struct
data=open("seaf-server","rb").read()
def u32(o): return struct.unpack_from("<I",data,o)[0]
def u64(o): return struct.unpack_from("<Q",data,o)[0]
e_shoff=u64(0x28); shentsize=struct.unpack_from("<H",data,0x3a)[0]
shnum=struct.unpack_from("<H",data,0x3c)[0]
shstrndx=struct.unpack_from("<H",data,0x3e)[0]
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
secs={}
for i in range(shnum):
    o=e_shoff+i*shentsize
    nm_off=u32(o); p=shstr_off+nm_off
    nm=data[p:data.index(b"\x00",p)].decode()
    secs[nm]=(u64(o+16),u64(o+24),u64(o+32))  # va, off, size
def relocs(secname):
    if secname not in secs: return []
    va,off,size=secs[secname]
    num=int(size//56)
    out=[]
    for i in range(num):
        r=off+i*56
        roff=u64(r); rinfo=u64(r+8); radd=u64(r+16)
        rtype=rinfo&0xffffffff
        rsym=rinfo>>32
        out.append((roff,rtype,rsym,radd))
    return out
for sec in [".rela.dyn",".rela.plt"]:
    rel=relocs(sec)
    print(f"\n=== {sec}: {len(rel)} relocs ===")
    for roff,rtype,rsym,radd in rel:
        if rtype==8:  # RELATIVE
            if radd==0xea5a0 or 0x110f0<=radd<0x119400:
                sec_va=secs[sec][0]; sec_off=secs[sec][1]
                entry_off=roff-sec_off
                print(f"   RELATIVE: r_offset=0x{roff:x} addend(=final VA @base0)=0x{radd:x}  [in {sec} @ off 0x{entry_off:x}]")
    print(f"   --- total RELATIVE relocs in {sec}: {sum(1 for x in rel if x[1]==8)} ---")
