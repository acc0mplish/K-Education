#!/usr/bin/env python3
"""WSL Windows-interop dynamic runner (report §14.3 #4 alternative to Wine).

Spawns the PE on the Windows host via powershell.exe (native, no Wine) and
captures observable dynamic signals:
  - process tree (Name/PID/PPID/CommandLine) — reveals child processes the
    launcher spawns (DAF Electron children, updaters, helpers)
  - network connections (netstat -ano) — reveals daehanaifactory.com / remote
    endpoints actually contacted (heartbeat, release, uploads)
then kills the spawned process.

LIMITATION (honest): per-process ENVIRONMENT VARIABLES (DAF_API_TOKEN etc.)
cannot be read from another process via WMI/PowerShell. Capturing the token
passed to children requires a PEB-walker or a frida-side hook (deferred).
This runner captures the OBSERVABLES (proc tree + network + cmdline) it can.

SAFETY: own-app / education use only. Dry-run by default; --run to spawn.
"""
from __future__ import annotations
import argparse, json, os, subprocess, sys, time
from pathlib import Path

POWERSHELL = "/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe"


def wsl_to_win(path: str) -> str | None:
    """Convert /mnt/c/... -> C:\\... ; return None if not Windows-accessible."""
    p = Path(path)
    parts = p.parts
    if len(parts) >= 3 and parts[0] == "/" and parts[1] == "mnt" and len(parts[2]) == 1:
        drive = parts[2].upper()
        rest = "\\".join(parts[3:])
        return f"{drive}:\\" + rest if rest else f"{drive}:\\"
    return None


def run_ps(script: str, timeout: int = 30) -> str:
    # force UTF-8 output (Korean Windows defaults to cp949)
    full = "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8; " + script
    r = subprocess.run([POWERSHELL, "-NoProfile", "-NonInteractive", "-Command", full],
                       capture_output=True, timeout=timeout)
    return r.stdout.decode("utf-8", "replace") + r.stderr.decode("utf-8", "replace")


def observe(win_path: str, seconds: int) -> dict:
    ps = f'''
$ErrorActionPreference='SilentlyContinue'
$p = Start-Process -FilePath '{win_path}' -PassThru
$rootPid = if($p){{ $p.Id }} else {{ 0 }}
Start-Sleep -Seconds {seconds}
$procs = Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,Name,CommandLine | Where-Object {{ $_.CommandLine -ne $null }}
$procJson = $procs | ConvertTo-Json -Depth 3 -Compress
$net = netstat -ano
"===ROOTPID==="; $rootPid
"===PROCS==="; $procJson
"===NET==="; $net
if($p){{ Stop-Process -Id $p.Id -Force }}
"===DONE==="
'''
    out = run_ps(ps, timeout=seconds + 30)
    def sect(tag):
        i = out.find(f"=== {tag} ===") if f"=== {tag} ===" in out else out.find(tag)
        return out
    root = ""
    procs_raw = "[]"
    net_raw = ""
    if "===ROOTPID===" in out:
        seg = out.split("===ROOTPID===", 1)[1]
        root = seg.split("===PROCS===", 1)[0].strip().splitlines()
        root = root[0] if root else ""
        if "===PROCS===" in seg:
            procs_seg = seg.split("===PROCS===", 1)[1]
            procs_raw = procs_seg.split("===NET===", 1)[0].strip()
            if "===NET===" in procs_seg:
                net_raw = procs_seg.split("===NET===", 1)[1].split("===DONE===", 1)[0]
    try:
        procs = json.loads(procs_raw) if procs_raw else []
        if isinstance(procs, dict):
            procs = [procs]
    except json.JSONDecodeError:
        procs = []
    # parse netstat
    conns = []
    for line in net_raw.splitlines():
        line = line.strip()
        if line.startswith("[") or not line or "Proto" in line or "Active" in line:
            continue
        parts = line.split()
        if len(parts) >= 5 and parts[0] in ("TCP", "UDP"):
            conns.append({"proto": parts[0], "local": parts[1], "remote": parts[2],
                          "state": parts[3] if len(parts) > 4 else "", "pid": parts[-1]})
    # interesting connections (remote non-local)
    remote = [c for c in conns if c["remote"] not in ("*:*", "0.0.0.0:*", "[::]:*") and c["remote"].endswith(":*") is False]
    daf_hits = [c for c in conns if any(k in net_raw for k in ("daehan", "8787"))]
    return {
        "rootPid": root,
        "processCount": len(procs),
        "processes": procs[:200],
        "connectionCount": len(conns),
        "remoteConnectionsSample": remote[:50],
        "note": "env(DAF_API_TOKEN) capture needs PEB-walker/frida — deferred (runner captures proc tree + network only)",
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("target")
    ap.add_argument("--run", action="store_true", help="actually spawn the PE (default: dry-run)")
    ap.add_argument("--seconds", type=int, default=4)
    ap.add_argument("--outdir", default=None)
    a = ap.parse_args()

    if not os.path.exists(POWERSHELL):
        print("ERROR: powershell.exe not found (not WSL2 with Windows interop?)"); sys.exit(2)
    win = wsl_to_win(os.path.abspath(a.target))
    if not win:
        print(f"ERROR: target not on a Windows-accessible path (/mnt/x/...): {a.target}"); sys.exit(2)
    if not os.path.exists(a.target):
        print(f"ERROR: target not found: {a.target}"); sys.exit(2)

    print(f"[dynamic] target: {a.target}\n          win path: {win}\n          mode: {'RUN' if a.run else 'DRY-RUN (--run to spawn)'}")
    if not a.run:
        print("          plan: spawn via Start-Process -> observe proc tree + netstat -> kill")
        print("          (own-app/education use only)")
        return

    print(f"[dynamic] spawning + observing {a.seconds}s ...")
    result = observe(win, a.seconds)
    result["target"] = a.target
    result["winPath"] = win
    outdir = Path(a.outdir) if a.outdir else Path("/mnt/d/DEV/K-Education/evidence") / Path(a.target).name
    outdir.mkdir(parents=True, exist_ok=True)
    out = outdir / "dynamic_windows.json"
    out.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[dynamic] processes={result['processCount']} connections={result['connectionCount']}")
    print(f"[dynamic] -> {out}")


if __name__ == "__main__":
    main()
