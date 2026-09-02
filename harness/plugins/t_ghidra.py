"""ghidra headless — delegates to runner (install gate + timeout).

Not installed in scaffold → install_failed. After `install_manual.sh` and
re-run, the 183MB Electron PE will likely hit timeout → timeout_deferred_retry
(matches report §13.3).
"""
from plugins.base import register


@register("t_ghidra")
def run(tool, target_path, runner, force_skip=False):
    return runner.run(tool, target_path, force_skip=force_skip)
