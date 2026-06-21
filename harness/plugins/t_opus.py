"""opus_analysis — report-integration placeholder.

In the scaffold this records an executed empty artifact. Full impl aggregates
coverage.json + per-tool .out into summary.md (report §14.3.7 fixed sections).
"""
from plugins.base import register, _ok, _write_evidence


@register("t_opus")
def run(tool, target_path, runner, force_skip=False):
    out = "opus_analysis: scaffold placeholder - run report aggregation in Phase 5\n".encode("utf-8")
    _write_evidence(runner, tool, out)
    return _ok(tool, out, message="placeholder")
