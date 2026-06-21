"""file(1) wrapper — truncates large output via tool.head."""
from plugins.base import register


@register("t_file")
def run(tool, target_path, runner, force_skip=False):
    res = runner.run(tool, target_path, force_skip=force_skip)
    return res
