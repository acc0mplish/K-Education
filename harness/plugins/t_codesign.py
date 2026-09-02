"""codesign (macOS) — code signature / notarization. Delegates to runner."""
from plugins.base import register


@register("t_codesign")
def run(tool, target_path, runner, force_skip=False):
    return runner.run(tool, target_path, force_skip=force_skip)
