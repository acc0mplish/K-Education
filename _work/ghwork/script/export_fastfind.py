# fastfind crate 함수를 디컴파일 결과 + 소스 라인과 함께 파일로 출력
# (원샷 headless: import 후 이 스크립트가 export)
from ghidra.app.decompiler import DecompilerComponentAdapterFactory
from ghidra.util.task import TaskMonitor

MON = TaskMonitor.DEFAULT
out = open('/Users/yong/DEV/K-Education/_work/ghwork/out/fastfind_decompiled.txt', 'w')
sym = open('/Users/yong/DEV/K-Education/_work/ghwork/out/fastfind_symbols.txt', 'w')
sym.write('# demangled_name\taddress\tsourcefile\tline\n')

def demangle(nm):
    try:
        cls = java.lang.Class.forName('ghidra.util.CppDemangle')
        m = cls.getMethod('demangle', [java.lang.String])
        return m.invoke(None, nm)
    except Exception:
        return nm

def sortkey(fn):
    a = str(fn)
    a = a.split(':')[0]
    hexp = a.split('$')[0]
    try:
        return (0, int(hexp, 16))
    except Exception:
        return (1, hexp)

total = 0
decompiled = 0
funcs = sorted(currentProgram.getListing().getFunctions(None), key=sortkey)
for f in funcs:
    s = f.getEntryAddress()
    nm = s.getName()
    if nm is None or 'fastfind' not in nm.lower():
        continue
    total += 1
    dn = demangle(nm).strip()
    sl = f.getSourceLine()
    loc = ''
    if sl is not None:
        loc = '  [%s:%s]' % (sl.getSourceFileName(), sl.getLineNumber())
    dec = DecompilerComponentAdapterFactory.createDecompiler(f, currentProgram.getTool(), MON)
    if dec is None:
        continue
    r = dec.decompile(45)
    if not r.decompileSuccess():
        continue
    txt = r.getDecompiledFunction().decompile(False)
    if txt is None or txt.strip() == '':
        continue
    decompiled += 1
    sym.write('%s\t%s\t%s:%s\n' % (dn, str(s),
        sl.getSourceFileName() if sl is not None else '?',
        sl.getLineNumber() if sl is not None else -1))
    out.write('\n// === %s%s ===\n' % (dn, loc))
    out.write(txt)
    out.write('\n')
out.close()
sym.close()
print('EXPORT_DONE total_functions=%d decompiled=%d' % (total, decompiled))
print('OUTPUT=/Users/yong/DEV/K-Education/_work/ghwork/out/fastfind_decompiled.txt')
