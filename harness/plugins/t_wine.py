"""wine64 presence probe. Real PE dynamic exec is the `dynamic` command path
(report §10 / §14.3.4), not part of static coverage."""
from plugins.base import register


@register("t_wine")
def run(tool, target_path, runner, force_skip=False):
    return runner.run(tool, target_path, force_skip=force_skip)
