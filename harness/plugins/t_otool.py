"""otool (macOS Mach-O) — delegates to runner (otool -L libs/imports)."""
from plugins.base import register


@register("t_otool")
def run(tool, target_path, runner, force_skip=False):
    return runner.run(tool, target_path, force_skip=force_skip)
