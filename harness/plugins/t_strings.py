"""strings(1) wrapper."""
from plugins.base import register


@register("t_strings")
def run(tool, target_path, runner, force_skip=False):
    return runner.run(tool, target_path, force_skip=force_skip)
