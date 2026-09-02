import struct
data=open("seaf-server","rb").read()
def va_of(f):
    for base,off in [(0x110f0,0x110f0),(0x11a000,0x11a000),(0x1c6000,0x1c5000)]:
        if off<=f<off+0x300000: return base+(f-off)
    return None
TARGETS={0x612a0:"X509 verify chain? (calls EVP_rsa_public_decrypt)",0x604e6:"X509 verify caller",0x613cf:"caller of 0x613cf",0x63d10:"EVP_rsa_public_decrypt caller",0x64290:"EVP_rsa_public_decrypt caller"}
def callers_of(t):
    out=[]
    for i in range(0,len(data)-5):
        # CALL E8 rel32
        if data[i]==0xE8:
            rel=struct.unpack_from("<i",data,i+1)[0]
            iva=va_of(i)
            if iva and iva+5+rel==t:
                # enclosing function start (endbr64)
                s=None
                for j in range(i-1,max(0,i-0x900),-1):
                    if data[j:j+4]==b"\xf3\x0f\x1e\xfa": s=j;break
                fs=va_of(s if s is not None else i)
                out.append((i,fs))
    return out
for t in [0x612a0,0x604e6,0x63d10,0x64290]:
    cs=callers_of(t)
    name=TARGETS.get(t,"")
    print(f"\n=== CALLers of 0x{t:x} ({name}) === {len(cs)}")
    for off,fs in cs[:20]:
        print(f"   CALL fileoff=0x{off:x} VA=0x{va_of(off):x} -> func_start VA=0x{fs:x}")
