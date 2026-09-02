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
    segs.append((u64(o+16), u64(o+24), u64(o+32), nm))
def va_of(off):
    for va,offb,size,nm in segs:
        if offb<=off<offb+size and va!=0: return va+(off-offb)
    return None
# AES .got entry (confirmed 0x1c5290)
AES_GOT=0x1c5290
# 1) find .plt.sec stub whose jmp targets AES_GOT
plt_sec=None
for va,offb,size,nm in segs:
    if nm==".plt.sec": plt_sec=(va,offb,size)
base_va,base_off,size=plt_sec
stub_va=None
for k in range(3, size//16):
    s=base_off+k*16
    rel=struct.unpack_from("<i",data,s+2)[0]   # jmp at s+4, f2 ff 25 rel24
    jmp_va=base_va+k*16+11+rel                 # rip after = stub_va+4+7; rel is VA-relative
    if jmp_va==AES_GOT:
        stub_va=base_va+k*16
        print(f"AES stub: index={k} VA=0x{stub_va:x} (jmp -> {hex(jmp_va)} = .got slot {(jmp_va-0x1c4f40)//8})")
        print("  stub bytes:", data[s:s+16].hex())
        break
if stub_va is None:
    print("AES stub NOT found"); raise SystemExit
# 2) find all CALL (E8 rel32) targeting stub_va
found=[]
for i in range(0,len(data)-9):
    if data[i]==0xE8:
        rel=struct.unpack_from("<i",data,i+1)[0]
        iva=va_of(i)
        if iva is None: continue
        if iva+5+rel==stub_va:
            found.append((i,iva))
print(f"\nCALL instructions to AES stub (VA 0x{stub_va:x}): {len(found)}")
for off,iva in found:
    # caller function: nearest endbr64 (f3 0f 1e fa) scanning back
    start=None
    for j in range(off-1, max(0,off-0x800), -1):
        if data[j:j+4]==b"\xf3\x0f\x1e\xfa": start=j; break
    fva=va_of(start if start is not None else off)
    # also report the CALL instruction bytes
    print(f"  CALL fileoff=0x{off:x} VA=0x{iva:x} -> caller func VA=0x{fva:x}  instr=0x{data[off:off+5].hex()}")
