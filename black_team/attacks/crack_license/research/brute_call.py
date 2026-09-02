import struct
data=open("seaf-server","rb").read()
def u32o(o): return struct.unpack_from("<i",data,o+1)[0]
# .text VA==offset. Search E8/E9 targeting these offsets
def find_callers(target_off):
    res=[]
    for i in range(0,len(data)-5):
        if data[i]==0xE8 or data[i]==0xE9:
            rel=struct.unpack_from("<i",data,i+1)[0]
            tgt=i+5+rel
            if tgt==target_off:
                res.append(i)
    return res
for nm,t in [("0x612a0",0x612a0),("0xea5a0",0xea5a0),("0x60330",0x60330),("0xea790",0xea790),("0x63d10",0x63d10),("0x64290",0x64290),("0xcfde0",0xcfde0)]:
    cs=find_callers(t)
    if cs:
        print(f"\nCALLERS of {nm}: {len(cs)}")
        for i in cs[:10]:
            # enclosing function start
            s=None
            for j in range(i-1,max(0,i-0x900),-1):
                if data[j:j+4]==b"\xf3\x0f\x1e\xfa": s=j;break
            print(f"   CALL fileoff=0x{i:x} (instr={data[i:i+5].hex()}) from func_start fileoff=0x{ ('?') if s is None else hex(s)}")
    else:
        print(f"{nm}: NO direct CALL/JMP found")
