"""asar listing via @electron/asar (report §4.4). Uses venv/node_tools npx."""
from plugins.base import register


@register("t_asar")
def run(tool, target_path, runner, force_skip=False):
    return runner.run(tool, target_path, force_skip=force_skip)
