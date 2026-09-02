"""angr — probe-first CFG with thread timeout (report §13.3 CFG timeout).

On 183MB Electron PE, full CFG recovery exceeds time budget. We load the
project and attempt a SHORT CFGFast; if it doesn't finish in the budget we
record timeout_deferred_retry (not a crash).
"""
from __future__ import annotations
import json
import threading

from plugins.base import register, _ok, _fail, _write_evidence
from states import ExecutionStatus
from runner import RunResult


@register("t_angr")
def run(tool, target_path, runner, force_skip=False):
    if force_skip:
        return _fail(tool, "skipped by strategy")
    try:
        import angr
    except ImportError:
        return _fail(tool, "angr not installed")

    budget = min(tool.timeout, 120)
    result_box = {}

    def worker():
        try:
            proj = angr.Project(target_path, auto_load_libs=False)
            info = {
                "arch": str(proj.arch),
                "entry": hex(proj.entry),
                "filename": proj.filename,
                "bytes": None,
            }
            try:
                cfg = proj.analyses.CFGFast(regions=[(proj.entry, proj.entry + 0x1000)])
                info["cfgNodesProbe"] = len(cfg.nodes())
            except Exception as e:  # noqa: BLE001
                info["cfgProbeError"] = repr(e)
            result_box["ok"] = info
        except Exception as e:  # noqa: BLE001
            result_box["err"] = repr(e)

    t = threading.Thread(target=worker, daemon=True)
    t.start()
    t.join(budget)

    if t.is_alive():
        return RunResult(
            tool.toolID, ExecutionStatus.TIMEOUT_DEFERRED_RETRY, 124, "", 0, 0, float(budget),
            timed_out=True, message=f"angr CFG probe exceeded {budget}s budget",
        )
    if "err" in result_box:
        return _fail(tool, f"angr error: {result_box['err']}")

    info = result_box.get("ok", {})
    out = json.dumps(info, indent=2, ensure_ascii=False).encode("utf-8")
    _write_evidence(runner, tool, out)
    return _ok(tool, out, message=f"arch={info.get('arch')}, entry={info.get('entry')}")
