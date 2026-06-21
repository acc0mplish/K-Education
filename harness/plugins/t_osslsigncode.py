"""osslsigncode Authenticode verify (report §3 / §12.3).

Self-signed chains fail verification (nonzero exit) → execution_failed, but
the message-digest match is still visible in stdout. This is the EXPECTED
behavior, not a harness bug.
"""
from plugins.base import register


@register("t_osslsigncode")
def run(tool, target_path, runner, force_skip=False):
    return runner.run(tool, target_path, force_skip=force_skip)
