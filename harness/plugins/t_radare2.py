"""radare2 — PROBE-FIRST (report §14.3.3).

For large Electron PE, full `aaa` analysis times out (report §13.3). So we
override to a short probe (`iI` headers only). Full analysis is a deferred
retry artifact.
"""
from __future__ import annotations

from plugins.base import register


@register("t_radare2")
def run(tool, target_path, runner, force_skip=False):
    # override args to probe-only regardless of catalog (avoid aaa on 183MB PE)
    probe_tool = type(tool)(
        toolID=tool.toolID, tier=tool.tier, install_method=tool.install_method,
        install_status=tool.install_status, command="r2",
        args=["-q", "-c", "iI", "{target}"], target_profiles=tool.target_profiles,
        timeout=min(tool.timeout, 300), plugin=tool.plugin, note="probe-first",
        head=tool.head, rules_path=tool.rules_path, raw=tool.raw,
    )
    return runner.run(probe_tool, target_path, force_skip=force_skip)
