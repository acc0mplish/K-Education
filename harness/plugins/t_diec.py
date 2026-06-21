"""DIE (diec) CLI wrapper. Detects packer/compiler (report §12.4)."""
from plugins.base import register


@register("t_diec")
def run(tool, target_path, runner, force_skip=False):
    return runner.run(tool, target_path, force_skip=force_skip)
