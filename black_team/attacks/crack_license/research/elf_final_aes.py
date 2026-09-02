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
# AES: dynsym idx 105 -> .got slot 104 -> .plt.sec stub 104 -> VA
aes_symidx=105
aes_slot=aes_symidx-1  # .got slot
# find .plt.sec stub for this slot: stub k jmps to .got slot k. so stub index = aes_slot
plt_va=None; plt_off=None
for va,offb,size,nm in segs:
    if nm==".plt.sec": plt_va,plt_off=va,offb
stub_va=plt_va+aes_slot*16
print(f"AES EVP_aes_128_cbc: symidx={aes_symidx} .got slot={aes_slot} .plt.sec stub VA=0x{stub_va:x}")
# Verify: this stub should jmp to .got slot aes_slot
s_off=plt_off+aes_slot*16
rel=struct.unpack_from("<i",data,s_off+2)[0]
jmp_va=plt_va+aes_slot*16+11+rel
print(f"  verify stub jmps to VA: 0x{jmp_va:x} (should be in .got)")
# find CALLs to stub_va
found=[]
for i in range(0,len(data)-9):
    if data[i]==0xE8:
        rel=struct.unpack_from("<i",data,i+1)[0]
        iva=va_of(i)
        if iva and iva+5+rel==stub_va:
            found.append((i,iva))
print(f"CALL instructions to AES stub (0x{stub_va:x}): {len(found)}")
for off,iva in found:
    start=None
    for j in range(off-1, max(0,off-0x800), -1):
        if data[j:j+4]==b"\xf3\x0f\x1e\xfa": start=j; break
    fva=va_of(start if start is not None else off)
    # report a bit of the caller context (bytes before CALL)
    ctx = data[off-32:off]
    print(f"  CALL VA=0x{iva:x} fileoff=0x{off:x} caller_func VA=0x{fva:x}")
    # try to detect the caller function name via section
    secname=None
    for va,offb,size,nm in segs:
        if offb<=off<offb+size: secname=nm
    print(f"     in section={secname}")
