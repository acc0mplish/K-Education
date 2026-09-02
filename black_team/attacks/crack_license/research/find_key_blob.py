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
def is_ascii_blob(b):
    return all(32<=c<127 or c in (9,10,13) for c in b)
def is_repeating(b):
    # 2+ equal 4-byte words
    return b[:4]==b[4:8] or b[4:8]==b[8:12] or b[:4]==b[8:12]
def interesting(b):
    if len(b)<16: return False
    if is_ascii_blob(b): return False
    if is_repeating(b): return False
    # count nonzero
    if sum(1 for x in b if x!=0)/len(b) < 0.5: return False
    return True
for nm in ('.data','.rodata'):
    for va_b,off_b,sz,sec in segs:
        if sec!=nm: continue
        base=va_b; fb=off_b
        for va in range(base,base+sz-16,4):
            blob=data[fb+(va-base):fb+(va-base)+16]
            if interesting(blob):
                # check if referenced by lea
                ref=False
                for va2,off_b2,sz2,sec2 in segs:
                    if sec2!='.text': continue
                    b2=va2; f2=off_b2
                    for v in range(b2,b2+sz2-8,1):
                        ff=f2+(v-b2)
                        if data[ff]==0x48 and data[ff+1]==0x8d:
                            disp=struct.unpack_from("<i",data,ff+4)[0]
                            if va_of(ff)[0]+4+disp==va: ref=True
                print(f"[{nm}] VA=0x{va:x} ref_by_lea={ref} bytes={blob.hex()}")
