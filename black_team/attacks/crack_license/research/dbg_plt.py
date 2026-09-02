import struct
data=open("/tmp/ghwork/seaf-server","rb").read()
def u64(o): return struct.unpack_from("<Q",data,o)[0]
def i32(o): return struct.unpack_from("<i",data,o)[0]
e_shoff=u64(0x28); shentsize=struct.unpack_from("<H",data,0x3a)[0]; shnum=struct.unpack_from("<H",data,0x3c)[0]; shstrndx=struct.unpack_from("<H",data,0x3e)[0]
shentries=[]
for i in range(shnum):
    o=e_shoff+i*shentsize
    shentries.append((struct.unpack_from("<I",data,o)[0], struct.unpack_from("<Q",data,o+16)[0], struct.unpack_from("<Q",data,o+24)[0], struct.unpack_from("<Q",data,o+32)[0]))
shstr=shentries[shstrndx]
def secname(s):
    p=shstr[2]+s[0]; return data[p:data.index(b"\x00",p)].decode()
plt=None; got=None
for s in shentries:
    if secname(s)==".plt.sec": plt=s
    if secname(s)==".got": got=s
PBase,POff=plt[1],plt[2]; GBase,GOff=got[1],got[2]
print(f".plt.sec base=0x{PBase:x}  .got base=0x{GBase:x}")
for k in range(3, 16):
    s=POff+k*16
    rel=i32(s+2)
    jmp=s+6+rel
    slot=(jmp-GBase)//8
    rem=(jmp-GBase)%8
    tgtf = ("slot"+str(slot)) if rem==0 else "not-got-aligned"
    print(f"k={k:<3} bytes={data[s:s+6].hex():>14}  jmpVA=0x{jmp:x}  ->{tgtf}")
val=u64(GOff+(0x1c5290-GBase))
print("\n.got[106]=0x1c5290 value:", hex(val))
