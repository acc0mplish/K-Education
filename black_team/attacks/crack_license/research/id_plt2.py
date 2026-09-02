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
def sym_name(i):
    d=secs[".dynsym"]; ds=secs[".dynstr"]; no=u32(d["off"]+i*d["entsize"]); p=ds["off"]+no
    return data[p:data.index(b"\x00",p)].decode()
rp=secs[".rela.plt"]; stub2name={}
for k in range(rp['size']//rp['entsize']):
    r=rp['off']+k*rp['entsize']; roff=u64(r+0); rinfo=u64(r+8)
    if (rinfo&0xffffffff)==7:
        symidx=(rinfo>>32)&0xffffffff; slot=(roff-secs['.got']['off'])//8
        stub2name[plt_slot(slot) if False else slot]=sym_name(symidx)
plt=secs[".plt.sec"]["off"]
def stub_slot(va):
    return (va-plt)//16
def identify(va):
    slot=stub_slot(va)
    return stub2name.get(slot,"?")
for tgt in [0xf710,0xf700,0xf740,0xf730,0xf750,0xf760,0x10940,0xf800,0xf9c0,0xf550,0xf700,0xf710]:
    print(f"  PLT 0x{tgt:x} -> {identify(tgt)}")
