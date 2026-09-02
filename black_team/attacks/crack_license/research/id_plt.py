import struct
data=open("seaf-server","rb").read()
u16=lambda o:struct.unpack_from("<H",data,o)[0]
u32=lambda o:struct.unpack_from("<I",data,o)[0]
u64=lambda o:struct.unpack_from("<Q",data,o)[0]
e_shoff=u64(0x28); shentsize=u16(0x3a); shnum=u16(0x3c); shstrndx=u16(0x3e)
shstr_off=u64(e_shoff+shstrndx*shentsize+24)
secs={}
for i in range(shnum):
    o=e_shoff+i*shentsize; nm_off=u32(o); p=shstr_off+nm_off
    nm=data[p:data.index(b"\x00",p)].decode()
    secs[nm]=dict(off=u64(o+24),size=u64(o+32),entsize=u64(o+56))
dname={}
def sym_name(i):
    d=secs[".dynsym"]; ds=secs[".dynstr"]; no=u32(d["off"]+i*d["entsize"]); p=ds["off"]+no
    return data[p:data.index(b"\x00",p)].decode()
rp=secs[".rela.plt"]
stubname={}
for k in range(rp['size']//rp['entsize']):
    r=rp['off']+k*rp['entsize']; roff=u64(r+0); rinfo=u64(r+8)
    if (rinfo&0xffffffff)==7:
        symidx=(rinfo>>32)&0xffffffff; slot=(roff-secs['.got']['off'])//8
        stubname[slot]=sym_name(symidx)
plt=secs[".plt.sec"]["off"]
# find which PLT stubs are in 0x60000-0x65000 range calls
def identify(va):
    gotva=va  # va is the stub VA
    # stub VA -> jmp target (.got entry)
    # reverse: for each slot, compute stub jmp target
    for slot,nm in stubname.items():
        stub=plt+slot*16
        tgt=stub+4+struct.unpack_from("<i",data,stub+7)[0]
        if tgt==va: return nm
    return "?"
# license module calls: identify these call targets
for tgt in [0xf710,0xf700,0xf740,0xf730,0x10940,0xf800,0xf9c0,0xf550,0xadc20,0x70ed0,0xede60]:
    print(f"  0x{tgt:x} -> {identify(tgt)}")
