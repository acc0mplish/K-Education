#!/usr/bin/env python3
"""Generate tool_catalog.macos.json from the Linux catalog.

macOS port rules (report §16 option a):
  - system tools that ship with Xcode CLT: otool/lipo/nm/dwarfdump/codesign/xattr/strings/file/shasum/hexdump
  - brew replaces apt for: yara/exiftool/binwalk/ssdeep/radare2/rizin/osslsigncode/p7zip/foremost/binutils/lldb
  - REMOVE wine (Windows PE can't execute on macOS), gdb -> lldb
  - ADD Mach-O tools: otool, lipo, dwarfdump, codesign, xattr, class-dump(optional)
  - keep universal (pip/npm/download/harness): electron_business, entropy, asar, pefile,
    readpe, capstone, lief, ghidra, retdec, angr, floss, capa, unicorn, qiling, miasm,
    frida, curl, api_probe, opus_analysis, vuln_subscription, mobsf, die, etc.
  - sha256sum command -> shasum -a 256 (macOS)
Not runnable here (Linux/WSL2); logic verified, macOS tools need a Mac to run.
"""
import json, copy
from pathlib import Path

ROOT = Path("/mnt/d/DEV/K-Education")
SRC = ROOT / "tool_catalog.json"
DST = ROOT / "tool_catalog.macos.json"

# toolID -> {command, install.method, args, targetProfiles, plugin, note} overrides
BREW = {"yara", "exiftool", "binwalk", "ssdeep", "radare2", "rizin", "rabin2",
        "osslsigncode", "p7zip", "foremost", "innoextract", "objdump"}
SYSTEM = {"file", "strings", "hexdump", "openssl_x509"}  # ship with macOS/CLT
REMOVE = {"wine", "gdb"}  # wine can't exec Win PE on mac; gdb -> lldb

d = json.loads(SRC.read_text(encoding="utf-8"))
d["_meta"]["source"] = "macOS CLI port of MacRE harness (§16.a)"
d["_meta"]["platform"] = "darwin"
# macOS tools are NOT deprecated here
d["deprecated"] = [x for x in d.get("deprecated", []) if x not in
                   ("otool", "lipo", "dwarfdump", "ktool")]

new_tools = []
for t in d["tools"]:
    tid = t["toolID"]
    if tid in REMOVE:
        continue
    t = copy.deepcopy(t)
    if tid in BREW:
        t["install"]["method"] = "brew"
    elif tid in SYSTEM:
        t["install"]["method"] = "system"
        t["install"]["status"] = "present"
    if tid == "sha256sum":
        t["command"] = "shasum"
        t["args"] = ["-a", "256", "{target}"]
    if tid == "objdump":
        # binutils objdump via brew; still useful for PE/ELF on mac
        t["note"] = "brew binutils objdump (PE/ELF)"
    new_tools.append(t)

# macOS Mach-O native tools (Xcode CLT)
MACHO_TOOLS = [
    {"toolID": "otool", "tier": 3, "install": {"method": "system", "status": "present"},
     "command": "otool", "args": ["-L", "{target}"], "targetProfiles": ["mach_o"],
     "timeout": 180, "plugin": "t_otool", "note": "Mach-O libs/imports (-L)"},
    {"toolID": "otool_hdr", "tier": 3, "install": {"method": "system", "status": "present"},
     "command": "otool", "args": ["-hv", "{target}"], "targetProfiles": ["mach_o"],
     "timeout": 120, "plugin": "generic_cli", "note": "Mach-O header (-hv)"},
    {"toolID": "lipo", "tier": 3, "install": {"method": "system", "status": "present"},
     "command": "lipo", "args": ["-info", "{target}"], "targetProfiles": ["mach_o"],
     "timeout": 120, "plugin": "generic_cli", "note": "universal arch info"},
    {"toolID": "dwarfdump", "tier": 3, "install": {"method": "system", "status": "present"},
     "command": "dwarfdump", "args": ["--debug-info", "{target}"], "targetProfiles": ["mach_o"],
     "timeout": 300, "plugin": "generic_cli", "note": "DWARF debug info"},
    {"toolID": "nm_mac", "tier": 3, "install": {"method": "system", "status": "present"},
     "command": "nm", "args": ["-m", "{target}"], "targetProfiles": ["mach_o"],
     "timeout": 180, "plugin": "generic_cli", "note": "Mach-O symbols (macOS nm)"},
    {"toolID": "codesign", "tier": 6, "install": {"method": "system", "status": "present"},
     "command": "codesign", "args": ["-dv", "--verbose=4", "{target}"], "targetProfiles": ["mach_o"],
     "timeout": 120, "plugin": "t_codesign", "note": "code signature / notarization"},
    {"toolID": "xattr", "tier": 6, "install": {"method": "system", "status": "present"},
     "command": "xattr", "args": ["-l", "{target}"], "targetProfiles": ["mach_o", "zip"],
     "timeout": 60, "plugin": "generic_cli", "note": "quarantine / Gatekeeper attrs"},
    {"toolID": "lldb", "tier": 5, "install": {"method": "system", "status": "present"},
     "command": "lldb", "args": ["--version"], "targetProfiles": ["mach_o"],
     "timeout": 120, "plugin": "generic_cli", "note": "macOS debugger (replaces gdb/wine dynamic)"},
]
new_tools.extend(MACHO_TOOLS)
d["tools"] = new_tools

DST.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"생성: {DST.name} | tools {len(d['tools'])} (Linux 49 - wine/gdb + Mach-O {len(MACHO_TOOLS)})")
print("removed:", REMOVE, "| brew:", sorted(BREW), "| Mach-O 추가:", [t['toolID'] for t in MACHO_TOOLS])
