# Ghidra headless post-script (PyGhidra):
#   analyzeHeadless <proj> hbbs -process hbbs -noanalysis -scriptPath . -postScript dump_license.py <OUT_DIR>
# Collects and decompiles functions related to the license check:
#   1) functions whose mangled name mentions licen/License
#   2) functions referencing telltale license strings
#   3) callers (2 hops) of sodiumoxide ed25519 verify
import re
from ghidra.app.decompiler import DecompInterface
from ghidra.util.task import ConsoleTaskMonitor

OUT = getScriptArgs()[0] if getScriptArgs() else "/tmp/decomp"
import os
if not os.path.isdir(OUT):
    os.makedirs(OUT)

monitor = ConsoleTaskMonitor()
fm = currentProgram.getFunctionManager()
rm = currentProgram.getReferenceManager()
listing = currentProgram.getListing()

TARGET_STRINGS = [
    "License is invalid",
    "Local license loaded",
    "machine information in local license mismatch",
    "License has expired",
    "Failed to verify license due to network error",
    "/license/check",
    "api/license",
    "LICENSE_KEY",
    "license file",
]

NAME_RE = re.compile(r"licen", re.I)

def sanitize(s, maxlen=120):
    s = re.sub(r"[^A-Za-z0-9_.-]", "_", s)
    return s[:maxlen]

def func_name(f):
    try:
        return f.getName()
    except:
        return "unknown"

targets = {}  # entry addr -> (function, reason set)

def add_func(f, reason):
    if f is None:
        return
    key = f.getEntryPoint()
    if key not in targets:
        targets[key] = (f, set())
    targets[key][1].add(reason)

# 1) name matches
count = 0
for f in fm.getFunctions(True):
    n = func_name(f)
    if NAME_RE.search(n):
        add_func(f, "name")
        count += 1
        if count > 60:
            break

# 2) string references
def find_string_data(substr):
    # search memory for the string, return list of Data items
    results = []
    it = listing.getDefinedData(True)
    for d in it:
        try:
            v = d.getValue()
        except:
            continue
        s = str(v) if v else ""
        if substr in s:
            results.append(d)
    return results

for substr in TARGET_STRINGS:
    for d in find_string_data(substr):
        addr = d.getAddress()
        for ref in rm.getReferencesTo(addr):
            f = fm.getFunctionContaining(ref.getFromAddress())
            if f is not None:
                add_func(f, "str:" + substr[:30])
        # also scan raw memory xrefs if not defined data refs (PIE relocations may be in .data rel arrays)

# 3) ed25519 verify callers (2 hops)
VERIFY_ADDR = currentProgram.getAddressFactory().getDefaultAddressSpace().getAddress(0x13298e0)
vf = fm.getFunctionAt(VERIFY_ADDR)
hop1 = set()
if vf is not None:
    for ref in rm.getReferencesTo(vf.getEntryPoint()):
        f = fm.getFunctionContaining(ref.getFromAddress())
        if f is not None:
            add_func(f, "ed25519verify-caller")
            hop1.add(f)
    for f0 in list(hop1):
        for ref in rm.getReferencesTo(f0.getEntryPoint()):
            f = fm.getFunctionContaining(ref.getFromAddress())
            if f is not None and f != f0:
                add_func(f, "ed25519verify-hop2")

# decompile
di = DecompInterface()
di.openProgram(currentProgram)
index = []
items = sorted(targets.items(), key=lambda kv: kv[1][0].getEntryPoint().getOffset())
for i, (addr, (f, reasons)) in enumerate(items):
    name = sanitize(func_name(f))
    fn = os.path.join(OUT, "%03d_%s_%s.c" % (i, addr, name))
    try:
        res = di.decompileFunction(f, 120, monitor)
        code = res.getDecompiledFunction().getC() if res.getDecompiledFunction() else "// decompile failed"
    except Exception as e:
        code = "// exception: %s" % e
    with open(fn, "w") as fh:
        fh.write("// %s @ %s size=%d\n// reasons: %s\n" % (func_name(f), addr, f.getBody().getNumAddresses(), ", ".join(sorted(reasons))))
        fh.write(code)
    index.append("%s\t%s\t%s" % (addr, func_name(f), ",".join(sorted(reasons))))
    if i % 10 == 0:
        monitor.setMessage("decompiled %d/%d" % (i, len(items)))

with open(os.path.join(OUT, "_index.tsv"), "w") as fh:
    fh.write("\n".join(index))
println("DUMP DONE: %d functions -> %s" % (len(items), OUT))
