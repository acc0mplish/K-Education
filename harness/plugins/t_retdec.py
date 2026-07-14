"""retdec decompiler — PROBE-FIRST (report §14.3 #3).

Large Electron/V8 PE full-decompile exceeds time budget. Probe-first: pass
retdec's own --timeout (short) so it bails into a partial artifact instead of
hanging; the harness runner timeout is a backstop. On probe timeout we record
timeout_deferred_retry (deferred to a long offline pass / artifact-only).
"""
from plugins.base import register


@register("t_retdec")
def run(tool, target_path, runner, force_skip=False):
    probe = type(tool)(
        toolID=tool.toolID, tier=tool.tier, install_method=tool.install_method,
        install_status=tool.install_status, command=tool.command,
        args=["{target}", "--timeout", "180", "--backend-timeout", "120"],
        target_profiles=tool.target_profiles,
        timeout=min(tool.timeout, 600), plugin=tool.plugin,
        note="probe-first (--timeout)", head=tool.head, rules_path=tool.rules_path,
        raw=tool.raw,
    )
    return runner.run(probe, target_path, force_skip=force_skip)
