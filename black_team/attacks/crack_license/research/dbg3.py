import struct
data=open("seaf-server","rb").read()
u64=lambda o: struct.unpack_from("<Q",data,o)[0]
u32=lambda o: struct.unpack_from("<I",data,o)[0]
u16=lambda o: struct.unpack_from("<H",data,o)[0]
e_shoff=u64(0x28); shentsize=u16(0x3a); shnum=u16(0x3c); shstrndx=u16(0x3e)
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
segs=[]; dynsym=0; dynstr=0; dynsymsz=0; dynsz=0; rel=0
for i in range(shnum):
    o=e_shoff+i*shentsize
    nm_off=u32(o); p=shstr_off+nm_off; nm=data[p:p+64].split(b"\x00",1)[0].decode()
    if nm==".dynsym": dynsym=u64(o+24); dynsymsz=u64(o+56); dynsz=u64(o+32)
    if nm==".dynstr": dynstr=u64(o+24)
    if nm==".rela.plt": rel=u64(o+24)
    segs.append((u64(o+16),u64(o+24),u64(o+32),nm))
def dynname(idx):
    o=dynsym+idx*dynsymsz
    name_off=u32(o); return data[dynstr+name_off:dynstr+name_off+48].split(b"\x00",1)[0].decode()
plt=[va for va,offb,size,nm in segs if nm==".plt.sec"][0]
got=[va for va,offb,size,nm in segs if nm==".got"][0]
print("dynsym",hex(dynsym),"dynstr",hex(dynstr),"symsz",dynsymsz,"dynsz",dynsz,"rel",hex(rel))
print("test dynname(105)=",repr(dynname(105)))
cnt=0
for k in range(dynsz//24):
    ro=rel+k*24
    r_offset=u32(ro); r_type=r_info=u32(ro+8)
    if k<5:
        print(f"  reloc#{k} roff=0x{r_offset:x} rinfo=0x{r_type:x} type={r_type&0xff} symidx={(r_type>>32)&0xffffffff}")
    if (r_type&0xff)!=7: continue
    cnt+=1
    if cnt<=8:
        symidx=(r_type>>32)&0xffffffff
        slot=(r_offset-got)//8
        sva=plt+slot*16
        print(f"    -> {dynname(symidx)} symidx={symidx} got_slot={slot} stubVA=0x{sva:x}")
print("total jumpslot relocs:",cnt)
