"""retdec decompiler — delegates to runner (install gate + timeout)."""
from plugins.base import register


@register("t_retdec")
def run(tool, target_path, runner, force_skip=False):
    return runner.run(tool, target_path, force_skip=force_skip)
