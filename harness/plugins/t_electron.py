"""t_electron — business-logic-first lane for Electron apps (report §10/§12.2).

Primary analysis surface for Electron: extract app.asar + scan JS for the
real business logic (DAF_* env, /api endpoints, IPC, child_process, auto-update,
remote-mgmt, eval). This is where the findings actually live; the V8 PE is a
runtime shell (see t_pe_runtime / main.py heavy-tool defer).
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE.parent) not in sys.path:
    sys.path.insert(0, str(HERE.parent))

from plugins.base import register, _ok, _fail, _write_evidence  # noqa: E402
import electron_detect as ed  # noqa: E402


@register("t_electron")
def run(tool, target_path, runner, force_skip=False):
    if force_skip:
        return _fail(tool, "skipped by strategy")

    # determine target profile cheaply
    p = target_path.lower()
    if p.endswith(".asar"):
        profile = "asar"
    elif p.endswith(".zip"):
        profile = "zip"
    elif ed.is_electron_pe(target_path):
        profile = "pe"
    else:
        return _fail(tool, "not an Electron target (no app.asar, not zip, not electron PE)")

    hits = ed.detect_electron(target_path, profile)
    if not hits:
        return _fail(tool, f"no app.asar found (profile={profile})")

    out_dir = Path(runner.evidence) / "asar_extract"
    out_dir.mkdir(parents=True, exist_ok=True)
    results = []
    for asar_ref, kind in hits:
        if kind == "zip":
            try:
                asar_path = ed.extract_zip_asar(target_path, asar_ref, str(out_dir))
            except Exception as e:  # noqa: BLE001
                results.append({"zip_member": asar_ref, "error": repr(e)})
                continue
        else:
            asar_path = asar_ref
        scan = ed.scan_asar(asar_path, str(out_dir))
        scan["source"] = asar_ref
        results.append(scan)

    report = {
        "target": target_path, "profile": profile,
        "asarCount": len(hits),
        "lane": "business-logic-first (asar/JS primary; PE deferred)",
        "results": results,
    }
    # headline summary for coverage row
    head = {}
    for r in results:
        s = r.get("summary", {})
        for k, v in s.items():
            head[k] = (head.get(k) or []) + v
    report["headline"] = {k: sorted(set(v))[:20] for k, v in head.items() if v}

    out = json.dumps(report, indent=2, ensure_ascii=False).encode("utf-8")
    _write_evidence(runner, tool, out)
    return _ok(
        tool, out,
        message=f"electron lane: {len(hits)} asar scanned, "
                f"{sum(r.get('filesWithFindings',0) for r in results)} JS files with findings",
        asarCount=len(hits),
        endpointCount=len(report["headline"].get("api_endpoint", [])),
        dafEnv=len(report["headline"].get("daf_env", [])),
    )
