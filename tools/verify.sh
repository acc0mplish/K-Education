#!/usr/bin/env bash
# Verify tool availability + versions -> tools/verify_report.json
# Usage: bash tools/verify.sh
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
VENV="$ROOT/harness/.venv"
OUT="$HERE/verify_report.json"

"$VENV/bin/python" - "$OUT" "$VENV" <<'PY'
import json, shutil, subprocess, sys
from pathlib import Path
out, venv = sys.argv[1], sys.argv[2]

CLI = [
    ("file","file",["--version"]), ("strings","strings",["--version"]),
    ("hexdump","hexdump",["-v"]), ("sha256sum","sha256sum",["--version"]),
    ("exiftool","exiftool",["-ver"]), ("binwalk","binwalk",["--version"]),
    ("ssdeep","ssdeep",["-V"]), ("foremost","foremost",["-V"]),
    ("7z","7z",[]), ("innoextract","innoextract",["--version"]),
    ("openssl","openssl",["version"]), ("yara","yara",["--version"]),
    ("radare2","r2",["-v"]), ("rizin","rizin",["-v"]), ("rabin2","rabin2",["-v"]),
    ("objdump","objdump",["--version"]), ("readelf","readelf",["--version"]),
    ("nm","nm",["--version"]), ("osslsigncode","osslsigncode",["--version"]),
    ("gdb","gdb",["--version"]), ("wine64","wine64",["--version"]),
    ("diec","diec",["--version"]), ("capa","capa",["--version"]),
    ("floss","floss",["--version"]), ("curl","curl",["--version"]),
]
PY_MODS = ["pefile","capstone","yara","lief","angr","unicorn","frida","miasm"]

def check_cli(id_, cmd, args):
    path = shutil.which(cmd)
    # fallback: some distros put binaries off-PATH (Ubuntu wine9 -> /usr/lib/wine)
    if not path:
        for fb in ("/usr/lib/wine/"+cmd, "/usr/lib/wine/"+cmd.replace("64","")):
            if __import__("os").path.exists(fb):
                path = fb
                break
    if not path:
        return {"installed": False, "status": "missing"}
    try:
        r = subprocess.run([path]+args, capture_output=True, text=True, timeout=15)
        ver = (r.stdout or r.stderr).splitlines()[0] if (r.stdout or r.stderr) else ""
    except Exception as e:
        ver = f"err: {e!r}"
    return {"installed": True, "path": path, "version": ver[:160], "status": "present"}

report = {"system": {tid: check_cli(tid,c,a) for tid,c,a in CLI}}
report["python"] = {"venv": venv, "modules": {}}
venv_py = str(Path(venv)/"bin"/"python")
for m in PY_MODS:
    r = subprocess.run([venv_py,"-c",f"import {m}"], capture_output=True)
    report["python"]["modules"][m] = {"installed": r.returncode == 0}

Path(out).write_text(json.dumps(report, indent=2, ensure_ascii=False))

sys_ok = sum(1 for v in report["system"].values() if v["installed"])
sys_tot = len(report["system"])
mod_ok = sum(1 for v in report["python"]["modules"].values() if v["installed"])
miss = [k for k,v in report["system"].items() if not v["installed"]]
print(f"system tools: {sys_ok}/{sys_tot} present")
print(f"python mods : {mod_ok}/{len(PY_MODS)} present")
print(f"missing sys : {miss}")
print(f"report -> {out}")
PY
