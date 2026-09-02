import struct
data=open("/tmp/ghwork/seaf-server","rb").read()
def u64(o): return struct.unpack_from("<Q",data,o)[0]
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
pltbase,pltoff=plt[1],plt[2]
gotbase,gotoff=got[1],got[2]
aes_slot=106
aes_got_addr = gotbase + aes_slot*8
print(f"AES .got entry VA = 0x{aes_got_addr:x} (slot {aes_slot})")

def find_stub(gotaddr):
    pltf,sz=pltoff,plt[3]
    for k in range(3, sz//16):
        s=pltf+k*16
        rel=struct.unpack_from("<i",data,s+2)[0]
        if (s+6+rel)==gotaddr:
            return k,s
    return None
r=find_stub(aes_got_addr)
if r:
    k,s=r
    stub_va=pltbase+k*16
    print(f"FOUND AES .plt.sec stub: index={k} VA=0x{stub_va:x} fileoff=0x{s:x}")
    print("  bytes:", data[s:s+16].hex())
else:
    print("stub not found"); stub_va=None

if stub_va is not None:
    print("\n=== CALL instrs (E8 rel32) targeting AES stub VA 0x"+hex(stub_va)[2:]+") ===")
    cnt=0
    for i in range(0, len(data)-9):
        if data[i]==0xE8:
            rel=struct.unpack_from("<i",data,i+1)[0]
            target=i+5+rel
            if target==stub_va:
                print(f"  CALL fileoff=0x{i:x} (instr=0x{data[i:i+5].hex()})")
                cnt+=1
                if cnt>50: break
    print("  total CALLs to AES stub found:",cnt)
